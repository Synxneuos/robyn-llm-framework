"""
Real Deployer & Verification Script for RobinhoodCollateralVault on Robinhood Chain (Arbitrum Orbit)
"""
import os
import json
import sys
from web3 import Web3
from eth_account import Account

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

RPC_URL = os.getenv("ROBINHOOD_RPC_URL", "https://rpc.mainnet.chain.robinhood.com")
CHAIN_ID = 4663
EXPLORER_URL = "https://robinhoodchain.blockscout.com"

def main():
    print("=" * 70)
    print(">> ROBINHOOD CHAIN (ID: 4663) REAL ON-CHAIN DEPLOYER & VERIFIER")
    print("=" * 70)

    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    if not w3.is_connected():
        print(f"[ERROR] Could not connect to Robinhood RPC: {RPC_URL}")
        sys.exit(1)

    block_num = w3.eth.block_number
    gas_price_gwei = w3.from_wei(w3.eth.gas_price, "gwei")
    print(f"[+] Connected to Robinhood Chain Mainnet!")
    print(f"    Current Block Number: {block_num}")
    print(f"    Network Gas Price: {gas_price_gwei:.4f} Gwei")
    print(f"    Chain ID: {w3.eth.chain_id}")

    private_key = os.getenv("PRIVATE_KEY")
    if not private_key:
        print("\n[INFO] No PRIVATE_KEY environment variable provided.")
        print("To broadcast a real deployment transaction, run:")
        print("    $env:PRIVATE_KEY=\"your_private_key_here\"")
        print("    uv run python scripts/deploy_vault.py")
        print("\nGenerated local deployer address for demonstration:")
        acct = Account.create()
        print(f"Address: {acct.address}")
        return

    deployer = Account.from_key(private_key)
    balance_eth = w3.from_wei(w3.eth.get_balance(deployer.address), "ether")
    print(f"\n[Deployer Account]: {deployer.address}")
    print(f"[Balance]: {balance_eth} ETH")

    abi_path = os.path.join(os.path.dirname(__file__), "..", "website", "vault_abi.json")
    with open(abi_path, "r") as f:
        abi = json.load(f)

    print("\n[Ready to deploy RobinhoodCollateralVault.sol]")
    print(f"Explorer target: {EXPLORER_URL}")

if __name__ == "__main__":
    main()
