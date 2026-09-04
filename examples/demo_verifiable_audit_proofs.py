import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from robyn.chain.wallet import AgentWallet
from robyn.modules.verifiable_proofs import VerifiableAuditLogger

print("=" * 70)
print(">> DEMO: ON-CHAIN VERIFIABLE AI AUDIT RECEIPTS")
print("Target Chain: Robinhood Chain (Trade Proof Oracle)")
print("=" * 70)

wallet = AgentWallet()
logger = VerifiableAuditLogger(wallet)

# Step 1: Simulate autonomous trade execution payload
execution_payload = {
    "action": "AUTONOMOUS_HEDGE",
    "token_in": "0xCASHCAT",
    "token_out": "0xNVDA_TOKENIZED",
    "amount_usd": 2500.00,
    "max_slippage_bps": 25,
    "block_latency_ms": 78.4
}

# Step 2: Generate and anchor cryptographic proof
print("\n[Generating cryptographic decision root & anchoring on-chain]")
receipt = logger.generate_action_proof(
    action_type="AUTONOMOUS_HEDGE",
    user_prompt="Robyn, hedge 30% of my CASHCAT gains into NVDA stock",
    execution_payload=execution_payload
)
print(json.dumps(receipt, indent=2))

print("\n[SUCCESS] Decision root and execution hash anchored on Robinhood Chain with 100% auditability!")
print("=" * 70)
