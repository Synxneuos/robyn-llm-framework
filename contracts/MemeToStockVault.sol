// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

/**
 * @title MemeToStockVault
 * @dev Autonomous Hedging Vault for Robinhood Chain.
 * Users deposit volatile meme tokens with customizable take-profit rules.
 * Authorized AI Agent (Robyn) executes autonomous swaps into tokenized stocks (RWAs) on DEX pumps.
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

interface IDEXRouter {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

contract MemeToStockVault {
    address public immutable agentKeeper; // Robyn Autonomous Agent address
    address public immutable router;      // Pons or Uniswap DEX router

    struct HedgeRule {
        address user;
        address memeToken;
        address targetStock; // Tokenized stock address (e.g. NVDA)
        uint256 entryPriceUsd;
        uint256 takeProfitMultiple; // e.g. 200 = 2x, 300 = 3x
        uint256 hedgePercent;      // e.g. 30 = 30% of position converted to stock
        bool active;
    }

    uint256 public ruleCount;
    mapping(uint256 => HedgeRule) public hedgeRules;

    event RuleRegistered(uint256 indexed ruleId, address indexed user, address memeToken, address targetStock);
    event HedgeExecuted(uint256 indexed ruleId, uint256 memeSold, uint256 stockReceived);

    modifier onlyAgent() {
        require(msg.sender == agentKeeper, "Only Robyn agent can trigger hedge");
        _;
    }

    constructor(address _agentKeeper, address _router) {
        agentKeeper = _agentKeeper;
        router = _router;
    }

    function createHedgeRule(
        address memeToken,
        address targetStock,
        uint256 entryPriceUsd,
        uint256 takeProfitMultiple,
        uint256 hedgePercent
    ) external returns (uint256 ruleId) {
        require(hedgePercent > 0 && hedgePercent <= 100, "Invalid percentage");
        ruleId = ++ruleCount;

        hedgeRules[ruleId] = HedgeRule({
            user: msg.sender,
            memeToken: memeToken,
            targetStock: targetStock,
            entryPriceUsd: entryPriceUsd,
            takeProfitMultiple: takeProfitMultiple,
            hedgePercent: hedgePercent,
            active: true
        });

        emit RuleRegistered(ruleId, msg.sender, memeToken, targetStock);
    }

    function executeAutonomousHedge(
        uint256 ruleId,
        uint256 memeAmountToHedge,
        uint256 minStockOut,
        address[] calldata path
    ) external onlyAgent {
        HedgeRule storage rule = hedgeRules[ruleId];
        require(rule.active, "Rule inactive");

        // Pull tokens approved by user to vault
        IERC20(rule.memeToken).transferFrom(rule.user, address(this), memeAmountToHedge);
        IERC20(rule.memeToken).approve(router, memeAmountToHedge);

        // Execute DEX swap directly into Tokenized Stock
        uint256[] memory amounts = IDEXRouter(router).swapExactTokensForTokens(
            memeAmountToHedge,
            minStockOut,
            path,
            rule.user,
            block.timestamp + 300
        );

        emit HedgeExecuted(ruleId, memeAmountToHedge, amounts[amounts.length - 1]);
    }
}
