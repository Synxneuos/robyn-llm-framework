import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from robyn.chain.wallet import AgentWallet
from robyn.modules.portfolio_manager import AIPortfolioManager
from robyn.modules.hype_oracle import OnChainHypeOracle

print("=" * 60)
print(">> DEMO 4 & 5: AI HEDGE FUND MANAGER & HYPE ORACLE")
print("Target Chain: Robinhood Chain (Arbitrum Orbit)")
print("=" * 60)

wallet = AgentWallet()
portfolio = AIPortfolioManager(wallet)
oracle = OnChainHypeOracle()

print("\n[Step 1: Reading On-Chain Hype Oracle for NVDA sentiment]")
hype = oracle.get_hype_score("NVDA")
print(json.dumps(hype, indent=2))

print("\n[Step 2: Rebalancing Portfolio via ERC-4337 Session Key]")
rebalance = portfolio.rebalance_portfolio(wallet.address, target_risk="moderate")
print(json.dumps(rebalance, indent=2))
print("\n[SUCCESS] Portfolio autonomously aligned with real-time market sentiment!")
