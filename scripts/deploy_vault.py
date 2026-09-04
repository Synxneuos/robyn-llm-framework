"""
Real Deployer & Verification Script for RobinhoodCollateralVault on Robinhood Chain (Arbitrum Orbit Nitro)
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
CHAIN_ID = int(os.getenv("ROBINHOOD_CHAIN_ID", "4663"))
EXPLORER_URL = os.getenv("ROBINHOOD_EXPLORER_URL", "https://robinhoodchain.blockscout.com")

def main():
    print("=" * 75)
    print(f">> ROBINHOOD CHAIN (ID: {CHAIN_ID}) REAL ON-CHAIN DEPLOYER & VERIFIER")
    print("=" * 75)

    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    if not w3.is_connected():
        print(f"[ERROR] Could not connect to Robinhood RPC: {RPC_URL}")
        sys.exit(1)

    block_num = w3.eth.block_number
    gas_price_wei = w3.eth.gas_price
    gas_price_gwei = w3.from_wei(gas_price_wei, "gwei")
    print(f"[+] Connected to Robinhood Chain!")
    print(f"    RPC Endpoint: {RPC_URL}")
    print(f"    Current Block Number: {block_num}")
    print(f"    Network Gas Price: {gas_price_gwei:.4f} Gwei")
    print(f"    Chain ID: {w3.eth.chain_id}")

    # Load compiled artifact
    artifact_path = os.path.join(os.path.dirname(__file__), "..", "contracts", "RobinhoodCollateralVault.json")
    if not os.path.exists(artifact_path):
        print(f"[ERROR] Artifact not found at {artifact_path}. Run compile_contracts.py first.")
        sys.exit(1)

    with open(artifact_path, "r", encoding="utf-8") as f:
        artifact = json.load(f)

    abi = artifact["abi"]
    bytecode = artifact["bytecode"]

    private_key = os.getenv("PRIVATE_KEY")
    if not private_key:
        print("\n" + "-" * 75)
        print("[INFO] No PRIVATE_KEY provided in environment.")
        print("To deploy to Robinhood Chain, provide a funded account:")
        print("    $env:PRIVATE_KEY=\"your_private_key_here\"")
        print("    uv run python scripts/deploy_vault.py")
        print("-" * 75)

        demo_acct = Account.create()
        print(f"\nExample generated address: {demo_acct.address}")
        balance_wei = w3.eth.get_balance(demo_acct.address)
        print(f"Account Balance: {w3.from_wei(balance_wei, 'ether')} ETH")
        return

    # Deploy using provided private key
    deployer = Account.from_key(private_key)
    balance_wei = w3.eth.get_balance(deployer.address)
    balance_eth = w3.from_wei(balance_wei, "ether")
    print(f"\n[Deployer Account]: {deployer.address}")
    print(f"[Deployer Balance]: {balance_eth} ETH")

    if balance_wei == 0:
        print("\n[WARNING] Deployer account has 0 ETH on Robinhood Chain.")
        print(f"Bridge ETH to Robinhood Chain or fund {deployer.address} to proceed.")
        return

    print("\n[*] Deploying RobinhoodCollateralVault...")
    contract = w3.eth.contract(abi=abi, bytecode=bytecode)

    nonce = w3.eth.get_transaction_count(deployer.address)
    agent_keeper_address = deployer.address

    construct_txn = contract.constructor(agent_keeper_address).build_transaction({
        'from': deployer.address,
        'nonce': nonce,
        'gas': 3000000,
        'gasPrice': gas_price_wei,
        'chainId': CHAIN_ID
    })

    signed_txn = w3.eth.account.sign_transaction(construct_txn, private_key=private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    print(f"[+] Transaction broadcasted! Tx Hash: {tx_hash.hex()}")
    print(f"[+] Explorer link: {EXPLORER_URL}/tx/{tx_hash.hex()}")

    print("[*] Waiting for receipt on Robinhood Chain...")
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=60)

    contract_address = tx_receipt.contractAddress
    print("\n" + "=" * 75)
    print(f"[SUCCESS] RobinhoodCollateralVault deployed successfully!")
    print(f"Contract Address: {contract_address}")
    print(f"Block Number: {tx_receipt.blockNumber}")
    print(f"Gas Used: {tx_receipt.gasUsed}")
    print(f"Blockscout Verification Link: {EXPLORER_URL}/address/{contract_address}")
    print("=" * 75)

    # Automatically update constants.ts in web-app
    constants_path = os.path.join(os.path.dirname(__file__), "..", "web-app", "lib", "constants.ts")
    if os.path.exists(constants_path):
        with open(constants_path, "w", encoding="utf-8") as f:
            f.write(f"export const VAULT_ADDRESS = '{contract_address}' as `0x${{string}}`\n")
        print(f"[+] Updated {constants_path} with deployed contract address!")

if __name__ == "__main__":
    main()
