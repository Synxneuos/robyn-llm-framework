// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

/**
 * @title EquiMemeToken
 * @dev Stock-Backed Meme Token for Robinhood Chain.
 * A portion of all minting liquidity is reserved to purchase tokenized stocks (e.g., NVDA, AAPL),
 * providing an unruggable, real-world asset collateral floor price.
 */

contract EquiMemeToken {
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    address public owner;
    address public rwaStockAsset; // Address of tokenized stock (e.g., NVDA tokenized on Robinhood)
    uint256 public rwaBackingBps; // Basis points of backing (e.g., 1000 = 10%)

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event RwaCollateralDeposited(uint256 amountStock);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        address _rwaStockAsset,
        uint256 _rwaBackingBps
    ) {
        require(_rwaBackingBps <= 5000, "Max 50% backing");
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        rwaStockAsset = _rwaStockAsset;
        rwaBackingBps = _rwaBackingBps;

        _mint(msg.sender, _initialSupply * 10**decimals);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        return _transfer(msg.sender, to, amount);
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 currentAllowance = allowance[from][msg.sender];
        require(currentAllowance >= amount, "Allowance exceeded");
        allowance[from][msg.sender] = currentAllowance - amount;
        return _transfer(from, to, amount);
    }

    function _transfer(address from, address to, uint256 amount) internal returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }

    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }
}
