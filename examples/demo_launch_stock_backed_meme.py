import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from robyn.chain.wallet import AgentWallet
from robyn.modules.equi_launchpad import EquiMemeLaunchpad

print("=" * 60)
print(">> DEMO 2: STOCK-BACKED MEME TOKEN LAUNCHPAD")
print("Target Chain: Robinhood Chain (Arbitrum Orbit)")
print("=" * 60)

wallet = AgentWallet()
launchpad = EquiMemeLaunchpad(wallet)

print("\n[Deploying $SBULL backed by 10% tokenized Tesla stock]")
token = launchpad.launch_stock_backed_token(
    name="Sherwood Bull",
    symbol="SBULL",
    supply=1000000000,
    backing_stock="TSLA",
    backing_percent=10
)
print(json.dumps(token, indent=2))
print("\n[SUCCESS] Token launched with an unruggable stock-collateral price floor!")
