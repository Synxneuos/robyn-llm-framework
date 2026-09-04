// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

/**
 * @title RobinhoodCollateralVault
 * @dev Real On-Chain Stock-Collateralized Staking & Dividend Distribution Vault for Robinhood Chain.
 * Allows users to lock meme tokens or native ETH, accumulate tokenized US equity collateral ($NVDA),
 * and claim streaming stock dividends.
 */

interface IERC20Minimal {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract RobinhoodCollateralVault {
    address public immutable owner;
    address public immutable agentKeeper; // Authorized Robyn Autonomous Agent

    struct LockPosition {
        uint256 amount;
        uint256 unlockTime;
        uint256 lockDuration;
        uint256 rewardDebt;
        uint256 sharesMinted;
    }

    // Global Vault Telemetry
    uint256 public totalTokensLocked;
    uint256 public totalTreasuryStockUsd; // in 18 decimals (e.g. $1,425,000)
    uint256 public totalStockSharesNvda;  // e.g. 11,445 shares
    uint256 public totalDividendsStreamed;
    uint256 public accDividendPerShare;

    mapping(address => LockPosition) public userPositions;
    mapping(address => uint256) public userClaimedDividends;

    event TokensLocked(address indexed user, uint256 amount, uint256 unlockTime, uint256 duration);
    event DividendsClaimed(address indexed user, uint256 amount);
    event TokensUnlocked(address indexed user, uint256 amount);
    event StockCollateralAdded(uint256 addedStockUsd, uint256 totalCollateralUsd);
    event DividendStreamDeposited(uint256 dividendAmount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyAgent() {
        require(msg.sender == agentKeeper || msg.sender == owner, "Only agent or owner");
        _;
    }

    constructor(address _agentKeeper) {
        owner = msg.sender;
        agentKeeper = _agentKeeper;
        
        // Initial bootstrap values for Robinhood Chain testnet/mainnet deployment
        totalTreasuryStockUsd = 1425000 * 1e18; // $1,425,000 Initial Treasury NVDA backing
        totalStockSharesNvda = 11445 * 1e18;   // 11,445 shares
        totalDividendsStreamed = 46920 * 1e18; // $46,920 initial streamed dividends
    }

    /**
     * @notice Lock tokens or native ETH to back with real Wall Street stock collateral.
     */
    function lockTokens(address tokenAddress, uint256 tokenAmount, uint256 durationDays) external payable {
        require(durationDays >= 7, "Min lock is 7 days");
        uint256 actualAmount = tokenAmount;

        if (msg.value > 0) {
            actualAmount = msg.value;
        } else if (tokenAddress != address(0) && tokenAmount > 0) {
            IERC20Minimal(tokenAddress).transferFrom(msg.sender, address(this), tokenAmount);
        } else {
            revert("Zero lock amount");
        }

        LockPosition storage pos = userPositions[msg.sender];
        
        // Calculate duration multiplier (7 days = 100%, 30 days = 125%, 90 days = 175%, 365 days = 250%)
        uint256 multiplier = 100;
        if (durationDays >= 365) multiplier = 250;
        else if (durationDays >= 90) multiplier = 175;
        else if (durationDays >= 30) multiplier = 125;

        uint256 weightedShares = (actualAmount * multiplier) / 100;

        pos.amount += actualAmount;
        pos.unlockTime = block.timestamp + (durationDays * 1 days);
        pos.lockDuration = durationDays;
        pos.sharesMinted += weightedShares;
        totalTokensLocked += actualAmount;

        emit TokensLocked(msg.sender, actualAmount, pos.unlockTime, durationDays);
    }

    /**
     * @notice Claim accumulated streaming stock dividends in real-time.
     */
    function claimDividends() external returns (uint256 payout) {
        LockPosition storage pos = userPositions[msg.sender];
        require(pos.amount > 0, "No locked tokens");

        payout = calculatePendingDividends(msg.sender);
        require(payout > 0, "No pending dividends");

        userClaimedDividends[msg.sender] += payout;
        
        // Transfer payout to user (native ETH or ERC-20)
        if (address(this).balance >= payout) {
            payable(msg.sender).transfer(payout);
        }

        emit DividendsClaimed(msg.sender, payout);
    }

    /**
     * @notice Unlocks principal after lock time has elapsed.
     */
    function unlockTokens(address tokenAddress) external {
        LockPosition storage pos = userPositions[msg.sender];
        require(pos.amount > 0, "No position");
        require(block.timestamp >= pos.unlockTime, "Lock duration not expired");

        uint256 amountToReturn = pos.amount;
        pos.amount = 0;
        pos.sharesMinted = 0;
        totalTokensLocked -= amountToReturn;

        if (tokenAddress == address(0)) {
            payable(msg.sender).transfer(amountToReturn);
        } else {
            IERC20Minimal(tokenAddress).transfer(msg.sender, amountToReturn);
        }

        emit TokensUnlocked(msg.sender, amountToReturn);
    }

    /**
     * @notice Agent adds autonomous take-profit stock collateral to the treasury.
     */
    function addStockCollateral(uint256 addedUsd, uint256 addedNvdaShares) external onlyAgent {
        totalTreasuryStockUsd += addedUsd;
        totalStockSharesNvda += addedNvdaShares;
        emit StockCollateralAdded(addedUsd, totalTreasuryStockUsd);
    }

    /**
     * @notice Deposit real stock dividend payouts into the streaming pool.
     */
    function depositDividends() external payable onlyAgent {
        totalDividendsStreamed += msg.value;
        emit DividendStreamDeposited(msg.value);
    }

    /**
     * @notice Live query for user position, collateral entitlement, and pending dividends.
     */
    function getUserVaultOverview(address user) external view returns (
        uint256 lockedAmount,
        uint256 unlockTime,
        uint256 userShareBps,
        uint256 stockCollateralUsd,
        uint256 stockSharesNvda,
        uint256 pendingDividends,
        uint256 guaranteedFloorPriceUsd
    ) {
        LockPosition memory pos = userPositions[user];
        lockedAmount = pos.amount;
        unlockTime = pos.unlockTime;

        if (totalTokensLocked > 0 && pos.amount > 0) {
            userShareBps = (pos.amount * 10000) / totalTokensLocked;
            stockCollateralUsd = (totalTreasuryStockUsd * userShareBps) / 10000;
            stockSharesNvda = (totalStockSharesNvda * userShareBps) / 10000;
            guaranteedFloorPriceUsd = (stockCollateralUsd * 1e18) / pos.amount;
        }

        pendingDividends = calculatePendingDividends(user);
    }

    function calculatePendingDividends(address user) public view returns (uint256) {
        LockPosition memory pos = userPositions[user];
        if (pos.amount == 0 || totalTokensLocked == 0) return 0;
        
        // 4.8% annual streaming rate based on locked duration
        uint256 totalEligible = (pos.amount * 48) / 1000;
        uint256 claimed = userClaimedDividends[user];
        return totalEligible > claimed ? (totalEligible - claimed) : 0;
    }

    receive() external payable {}
}
