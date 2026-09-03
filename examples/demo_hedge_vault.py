import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from robyn.chain.wallet import AgentWallet
from robyn.modules.hedging_vault import MemeToStockHedger

print("=" * 60)
print(">> DEMO 1: MEME-TO-WALLSTREET AUTONOMOUS HEDGER")
print("Target Chain: Robinhood Chain (Arbitrum Orbit)")
print("=" * 60)

wallet = AgentWallet()
hedger = MemeToStockHedger(wallet)

# Step 1: User registers rule
print("\n[Step 1: User activates auto take-profit into tokenized NVDA]")
rule = hedger.create_rule(
    meme_token="0xCASHCAT_ADDRESS",
    target_stock="NVDA",
    take_profit_multiple=2.0,
    hedge_percent=30.0
)
print(json.dumps(rule, indent=2))

# Step 2: Robyn detects 2x pump and executes in 100ms
print("\n[Step 2: 2x Pump detected on Pons DEX - Robyn executes 84ms hedge]")
execution = hedger.simulate_hedge_execution(
    rule_id=rule["rule_id"],
    meme_profit_usd=1500.00,
    target_stock="NVDA"
)
print(json.dumps(execution, indent=2))
print("\n[SUCCESS] Meme profits safely locked in tokenized Nvidia shares!")
