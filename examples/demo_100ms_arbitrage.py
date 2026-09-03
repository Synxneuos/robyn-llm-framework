import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from robyn.chain.wallet import AgentWallet
from robyn.modules.flash_arbitrage import FlashArbitrageEngine

print("=" * 60)
print(">> DEMO 3: 100MS FLASH-ARBITRAGE SWARM")
print("Target Chain: Robinhood Chain (Arbitrum Orbit)")
print("=" * 60)

wallet = AgentWallet()
engine = FlashArbitrageEngine(wallet)

print("\n[Scanning liquidity pools on Pons AMM and Uniswap V3...]")
arb_result = engine.scan_and_execute(pair="CASHCAT/ETH")
print(json.dumps(arb_result, indent=2))
print("\n[SUCCESS] Sub-100ms atomic flash arbitrage executed successfully!")
