// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

/**
 * @dev Minimal interface for standard ERC20 operations.
 */
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
}

/**
 * @dev SafeERC20 wrapper around ERC20 operations to handle non-standard return values.
 */
library SafeERC20 {
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        require(address(token).code.length > 0, "SafeERC20: call to non-contract");
        (bool success, bytes memory data) = address(token).call(
            abi.encodeWithSelector(IERC20.transfer.selector, to, value)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "SafeERC20: transfer failed");
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        require(address(token).code.length > 0, "SafeERC20: call to non-contract");
        (bool success, bytes memory data) = address(token).call(
            abi.encodeWithSelector(IERC20.transferFrom.selector, from, to, value)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "SafeERC20: transferFrom failed");
    }
}

/**
 * @dev ReentrancyGuard to prevent reentrant calls.
 */
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

/**
 * @dev Ownable2Step for safe two-step ownership transfers.
 */
abstract contract Ownable2Step {
    address private _owner;
    address private _pendingOwner;

    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function pendingOwner() public view virtual returns (address) {
        return _pendingOwner;
    }

    modifier onlyOwner() {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is 0 address");
        _pendingOwner = newOwner;
        emit OwnershipTransferStarted(_owner, newOwner);
    }

    function acceptOwnership() public virtual {
        require(pendingOwner() == msg.sender, "Ownable: caller is not pending owner");
        emit OwnershipTransferred(_owner, msg.sender);
        _owner = msg.sender;
        _pendingOwner = address(0);
    }
}

/**
 * @title RobynStockVault
 * @notice Non-custodial, multi-asset Stock-Backed Holder Vault for ROBYN on Robinhood Chain (ID: 4663).
 * 
 * ACCOUNTING MODEL EXPLANATION:
 * ----------------------------
 * 1. Total ROBYN supply basis is fixed at 1,000,000,000 * 1e18.
 * 2. User ownership percentage = userShares / TOTAL_ROBYN_SUPPLY.
 * 3. Stock Tokens (NVDA, AAPL, TSLA, AMZN) purchased via 10% fee DCA are deposited into the vault.
 * 4. An accumulated index per share (accStockPerShare) is scaled by 1e36 for integer precision:
 *      accStockPerShare[stock] += (depositedAmount * 1e36) / TOTAL_ROBYN_SUPPLY
 * 5. Users deposit ROBYN into the vault (1:1 with zero lock duration, withdrawable anytime).
 *    This prevents double-claiming across wallet transfers while preserving 100% liquidity.
 * 6. Claimable Stock = (userShares * accStockPerShare[stock]) / 1e36 - userRewardDebt[user][stock].
 * 7. When claiming, stock tokens are transferred directly to user's wallet and rewardDebt is updated.
 */
contract RobynStockVault is ReentrancyGuard, Ownable2Step {
    using SafeERC20 for IERC20;

    // --- Core Constants ---
    uint256 public constant TOTAL_ROBYN_SUPPLY = 1_000_000_000 * 1e18; // 1 Billion ROBYN
    uint256 private constant ACC_PRECISION = 1e36;                     // High-precision scaling

    // Canonical ROBYN Token on Robinhood Chain
    IERC20 public immutable robynToken;

    // --- State Variables ---
    uint256 public totalShares; // Total ROBYN deposited into the vault
    mapping(address => uint256) public userShares; // User ROBYN shares

    // Multi-Asset Configuration
    address[] public supportedAssets;
    mapping(address => bool) public isSupportedAsset;

    // Per-Asset Vault Balances & Accounting
    mapping(address => uint256) public vaultStockBalance;
    mapping(address => uint256) public accStockPerShare; // Scaled by 1e36

    // User Claim Accounting
    mapping(address => mapping(address => uint256)) public userRewardDebt;
    mapping(address => mapping(address => uint256)) public userTotalClaimed;

    // Authorized Keepers / Relayers (DCA Cron)
    mapping(address => bool) public isKeeper;

    // --- Events ---
    event RobynDeposited(address indexed user, uint256 amount);
    event RobynWithdrawn(address indexed user, uint256 amount);
    event StockDeposited(address indexed stockToken, uint256 amount, uint256 timestamp);
    event StockClaimed(address indexed user, address indexed stockToken, uint256 amount);
    event SupportedAssetAdded(address indexed stockToken);
    event SupportedAssetRemoved(address indexed stockToken);
    event KeeperUpdated(address indexed keeper, bool authorized);

    // --- Modifiers ---
    modifier onlyKeeperOrOwner() {
        require(isKeeper[msg.sender] || owner() == msg.sender, "RobynStockVault: caller not authorized");
        _;
    }

    /**
     * @notice Constructor initializes ROBYN token and initial canonical Robinhood stock tokens.
     * @param _robynToken Canonical ROBYN token address on Robinhood Chain.
     * @param _initialKeeper Initial authorized DCA keeper / relay daemon.
     */
    constructor(address _robynToken, address _initialKeeper) {
        require(_robynToken != address(0), "Zero address");
        robynToken = IERC20(_robynToken);

        if (_initialKeeper != address(0)) {
            isKeeper[_initialKeeper] = true;
            emit KeeperUpdated(_initialKeeper, true);
        }

        // Initialize Canonical Robinhood Chain Stock Tokens (Chain ID 4663)
        _addSupportedAsset(0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec); // NVDA
        _addSupportedAsset(0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9); // AAPL
        _addSupportedAsset(0x322F0929c4625eD5bAd873c95208D54E1c003b2d); // TSLA
        _addSupportedAsset(0x12f190a9F9d7D37a250758b26824B97CE941bF54); // AMZN
    }

    // =========================================================================
    // USER DEPOSIT & WITHDRAWAL (Soft-Custody, Zero Lock Duration, Zero Fee)
    // =========================================================================

    /**
     * @notice Deposit ROBYN tokens to register for proportional Stock Vault entitlements.
     * @dev Zero lock time. Tokens can be withdrawn at any time. Automatically settles pending claims.
     * @param amount Amount of ROBYN to deposit (in 18 decimals).
     */
    function depositRobyn(uint256 amount) external nonReentrant {
        require(amount > 0, "RobynStockVault: zero deposit");

        // 1. Auto-settle any pending claims before modifying share balance
        _settleAllPending(msg.sender);

        // 2. Transfer ROBYN from user to vault
        robynToken.safeTransferFrom(msg.sender, address(this), amount);

        // 3. Update shares
        userShares[msg.sender] += amount;
        totalShares += amount;

        // 4. Update reward debts for new share balance
        for (uint256 i = 0; i < supportedAssets.length; i++) {
            address asset = supportedAssets[i];
            userRewardDebt[msg.sender][asset] = (userShares[msg.sender] * accStockPerShare[asset]) / ACC_PRECISION;
        }

        emit RobynDeposited(msg.sender, amount);
    }

    /**
     * @notice Withdraw ROBYN tokens back to user's wallet.
     * @dev Unclaimed stocks are automatically sent to the user upon withdrawal.
     * @param amount Amount of ROBYN to withdraw.
     */
    function withdrawRobyn(uint256 amount) external nonReentrant {
        require(amount > 0, "RobynStockVault: zero withdrawal");
        require(userShares[msg.sender] >= amount, "RobynStockVault: insufficient shares");

        // 1. Auto-settle all pending claims before reducing shares
        _settleAllPending(msg.sender);

        // 2. Reduce shares
        userShares[msg.sender] -= amount;
        totalShares -= amount;

        // 3. Update reward debts
        for (uint256 i = 0; i < supportedAssets.length; i++) {
            address asset = supportedAssets[i];
            userRewardDebt[msg.sender][asset] = (userShares[msg.sender] * accStockPerShare[asset]) / ACC_PRECISION;
        }

        // 4. Return ROBYN to user
        robynToken.safeTransfer(msg.sender, amount);

        emit RobynWithdrawn(msg.sender, amount);
    }

    // =========================================================================
    // DCA KEEPER STOCK DEPOSIT (10% Protocol Fee Allocation)
    // =========================================================================

    /**
     * @notice Authorized DCA keeper deposits purchased Stock Tokens into the Vault.
     * @param stockToken Address of the tokenized stock (NVDA, AAPL, TSLA, AMZN).
     * @param amount Amount of stock tokens purchased and transferred to the Vault.
     */
    function depositStockToken(address stockToken, uint256 amount) external nonReentrant onlyKeeperOrOwner {
        require(isSupportedAsset[stockToken], "RobynStockVault: asset not supported");
        require(amount > 0, "RobynStockVault: zero deposit amount");

        // Pull stock token into the vault
        IERC20(stockToken).safeTransferFrom(msg.sender, address(this), amount);

        // Update vault balance
        vaultStockBalance[stockToken] += amount;

        // Update accumulated stock index per ROBYN supply basis
        accStockPerShare[stockToken] += (amount * ACC_PRECISION) / TOTAL_ROBYN_SUPPLY;

        emit StockDeposited(stockToken, amount, block.timestamp);
    }

    // =========================================================================
    // USER CLAIMS
    // =========================================================================

    /**
     * @notice Claim accumulated entitlement for a specific Stock Token.
     * @param stockToken Address of the stock asset to claim.
     */
    function claim(address stockToken) external nonReentrant returns (uint256 claimable) {
        require(isSupportedAsset[stockToken], "RobynStockVault: unsupported asset");
        claimable = _claimAsset(msg.sender, stockToken);
        require(claimable > 0, "RobynStockVault: nothing to claim");
    }

    /**
     * @notice Batch claim all available Stock Token entitlements in one single transaction.
     */
    function claimAll() external nonReentrant returns (uint256[] memory claimedAmounts) {
        claimedAmounts = new uint256[](supportedAssets.length);
        uint256 totalClaimed = 0;

        for (uint256 i = 0; i < supportedAssets.length; i++) {
            address asset = supportedAssets[i];
            uint256 amount = _claimAsset(msg.sender, asset);
            claimedAmounts[i] = amount;
            totalClaimed += amount;
        }

        require(totalClaimed > 0, "RobynStockVault: nothing to claim");
    }

    /**
     * @dev Internal claim logic with checks-effects-interactions.
     */
    function _claimAsset(address user, address stockToken) internal returns (uint256 claimable) {
        uint256 entitlement = (userShares[user] * accStockPerShare[stockToken]) / ACC_PRECISION;
        uint256 debt = userRewardDebt[user][stockToken];

        if (entitlement > debt) {
            claimable = entitlement - debt;
            userRewardDebt[user][stockToken] = entitlement;
            userTotalClaimed[user][stockToken] += claimable;

            // Ensure vault balance accounting
            if (vaultStockBalance[stockToken] >= claimable) {
                vaultStockBalance[stockToken] -= claimable;
            } else {
                vaultStockBalance[stockToken] = 0;
            }

            // Safe transfer stock token to user
            IERC20(stockToken).safeTransfer(user, claimable);

            emit StockClaimed(user, stockToken, claimable);
        }
    }

    /**
     * @dev Internal helper to settle all pending claims before modifying share balances.
     */
    function _settleAllPending(address user) internal {
        for (uint256 i = 0; i < supportedAssets.length; i++) {
            address asset = supportedAssets[i];
            _claimAsset(user, asset);
        }
    }

    // =========================================================================
    // VIEW / TELEMETRY FUNCTIONS (For Frontend Dashboard & Accounting)
    // =========================================================================

    /**
     * @notice Get user's cumulative gross stock entitlement since joining.
     */
    function getUserEntitlement(address user, address stockToken) external view returns (uint256) {
        return (userShares[user] * accStockPerShare[stockToken]) / ACC_PRECISION;
    }

    /**
     * @notice Get user's currently claimable stock amount.
     */
    function getUserClaimable(address user, address stockToken) external view returns (uint256) {
        uint256 entitlement = (userShares[user] * accStockPerShare[stockToken]) / ACC_PRECISION;
        uint256 debt = userRewardDebt[user][stockToken];
        return entitlement > debt ? entitlement - debt : 0;
    }

    /**
     * @notice Get user's already claimed stock amount.
     */
    function getUserClaimed(address user, address stockToken) external view returns (uint256) {
        return userTotalClaimed[user][stockToken];
    }

    /**
     * @notice Get user's proportional share percentage (in basis points, 10000 = 100%).
     */
    function getUserShareBps(address user) external view returns (uint256) {
        return (userShares[user] * 10000) / TOTAL_ROBYN_SUPPLY;
    }

    /**
     * @notice Get current total Vault balance for a stock token.
     */
    function getVaultBalance(address stockToken) external view returns (uint256) {
        return vaultStockBalance[stockToken];
    }

    /**
     * @notice Get list of all supported Stock Token addresses.
     */
    function getSupportedAssets() external view returns (address[] memory) {
        return supportedAssets;
    }

    // =========================================================================
    // ADMINISTRATIVE CONFIGURATION (Restricted, No Backdoors)
    // =========================================================================

    function setKeeper(address keeper, bool authorized) external onlyOwner {
        require(keeper != address(0), "Zero address");
        isKeeper[keeper] = authorized;
        emit KeeperUpdated(keeper, authorized);
    }

    function addSupportedAsset(address stockToken) external onlyOwner {
        _addSupportedAsset(stockToken);
    }

    function _addSupportedAsset(address stockToken) internal {
        require(stockToken != address(0), "Zero address");
        if (!isSupportedAsset[stockToken]) {
            isSupportedAsset[stockToken] = true;
            supportedAssets.push(stockToken);
            emit SupportedAssetAdded(stockToken);
        }
    }

    // =========================================================================
    // VAULT ETH SECURITY & EMERGENCY RESCUE (Restricted, Non-Holder)
    // =========================================================================

    event AccidentalETHRecovered(address indexed recipient, uint256 amount);

    /**
     * @notice Emergency recovery for accidental native ETH forcibly sent to the contract (e.g. via selfdestruct).
     * @dev HARD RULE: Native ETH is NEVER distributed to ROBYN holders, is NEVER treated as a holder reward,
     *      and is NEVER included in pro-rata Stock Vault entitlement accounting.
     *      Only callable by contract owner (Ownable2Step).
     * @param recipient Target address to receive the recovered ETH (e.g. Safe Treasury Wallet).
     */
    function emergencyRecoverAccidentalETH(address payable recipient) external onlyOwner nonReentrant {
        require(recipient != address(0), "Zero address");
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to recover");
        (bool success, ) = recipient.call{value: balance}("");
        require(success, "ETH recovery failed");
        emit AccidentalETHRecovered(recipient, balance);
    }
}
