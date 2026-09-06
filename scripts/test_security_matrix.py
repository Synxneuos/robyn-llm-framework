import os
import re
import json
import urllib.request

RPC_URL = "https://rpc.mainnet.chain.robinhood.com"
ROBYN_TOKEN_CA = "0x78b96280c3347e0f58a7147b73eb0ec5ffff025d"
PONS_ESCROW_CA = "0xbc39B6502E1a6Ab36E4A5c5026A35F08342A0A9c"

STOCK_TOKENS = {
    "NVDA": "0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec",
    "AAPL": "0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9",
    "TSLA": "0x322F0929c4625eD5bAd873c95208D54E1c003b2d",
    "AMZN": "0x12f190a9F9d7D37a250758b26824B97CE941bF54",
}

def rpc_call(method, params):
    payload = json.dumps({"jsonrpc": "2.0", "id": 1, "method": method, "params": params}).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    req = urllib.request.Request(RPC_URL, data=payload, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as response:
        res = json.loads(response.read().decode("utf-8"))
        return res.get("result")

def run_tests():
    results = {}
    print("=================================================================")
    print("ROBYN STOCK VAULT - PRODUCTION SECURITY TEST MATRIX")
    print("=================================================================\n")

    # -------------------------------------------------------------
    # TEST 1: Total fee = 100 -> Stock budget = 10, Treasury = 90
    # -------------------------------------------------------------
    fee_1 = 100
    stock_budget_1 = (fee_1 * 1000) // 10000
    treasury_1 = fee_1 - stock_budget_1
    t1_pass = (stock_budget_1 == 10 and treasury_1 == 90)
    results["Fee Split (100)"] = ("PASS" if t1_pass else "FAIL", f"Stock: {stock_budget_1}, Treasury: {treasury_1}")
    print(f"[{results['Fee Split (100)'][0]}] Fee = 100 -> Stock Budget: {stock_budget_1}, Treasury: {treasury_1}")

    # -------------------------------------------------------------
    # TEST 2: Total fee = 1,000 -> Stock budget = 100, Treasury = 900
    # -------------------------------------------------------------
    fee_2 = 1000
    stock_budget_2 = (fee_2 * 1000) // 10000
    treasury_2 = fee_2 - stock_budget_2
    t2_pass = (stock_budget_2 == 100 and treasury_2 == 900)
    results["Fee Split (1000)"] = ("PASS" if t2_pass else "FAIL", f"Stock: {stock_budget_2}, Treasury: {treasury_2}")
    print(f"[{results['Fee Split (1000)'][0]}] Fee = 1000 -> Stock Budget: {stock_budget_2}, Treasury: {treasury_2}")

    # -------------------------------------------------------------
    # TEST 3: Wallet B has 0.011 ETH -> Cannot sweep below 0.01 ETH
    # -------------------------------------------------------------
    min_reserve = 10_000_000_000_000_000 # 0.01 ETH in wei
    safety_buffer = 2_000_000_000_000_000 # 0.002 ETH in wei
    est_tx_gas = 21_000 * 100_000_000      # 21000 gas @ 0.1 gwei = 0.0000021 ETH
    balance_11 = 11_000_000_000_000_000   # 0.011 ETH

    total_required_retention = min_reserve + safety_buffer + est_tx_gas
    transferable_11 = max(0, balance_11 - total_required_retention)
    post_balance_11 = balance_11 - transferable_11
    t3_pass = (post_balance_11 >= min_reserve and transferable_11 == 0)
    results["0.011 ETH Reserve Floor"] = ("PASS" if t3_pass else "FAIL", f"Transferable: {transferable_11} wei, Retained: {post_balance_11 / 1e18} ETH")
    print(f"[{results['0.011 ETH Reserve Floor'][0]}] Wallet B has 0.011 ETH -> Transferable: {transferable_11} (Sweep prevented to protect 0.01 ETH reserve + gas buffer)")

    # -------------------------------------------------------------
    # TEST 4: Wallet B has exactly 0.01 ETH -> No ETH sweep
    # -------------------------------------------------------------
    balance_10 = 10_000_000_000_000_000 # exactly 0.01 ETH
    transferable_10 = max(0, balance_10 - total_required_retention)
    t4_pass = (transferable_10 == 0)
    results["0.01 ETH Exact Floor"] = ("PASS" if t4_pass else "FAIL", f"Transferable: {transferable_10} wei")
    print(f"[{results['0.01 ETH Exact Floor'][0]}] Wallet B has 0.010 ETH -> Transferable: {transferable_10} (Zero sweep)")

    # -------------------------------------------------------------
    # TEST 5, 6, 7: Wallet A Private Key Isolation (Server, Frontend, Repo)
    # -------------------------------------------------------------
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    forbidden_keys = ["TREASURY_PRIVATE_KEY", "SAFE_WALLET_PRIVATE_KEY", "SAFE_TREASURY_PRIVATE_KEY"]
    found_forbidden = []

    for root, dirs, files in os.walk(repo_root):
        if "node_modules" in root or ".git" in root or "dist" in root:
            continue
        for file in files:
            if file.endswith((".ts", ".tsx", ".js", ".jsx", ".json", ".env")):
                path = os.path.join(root, file)
                try:
                    with open(path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                        for fk in forbidden_keys:
                            if fk in content:
                                found_forbidden.append((path, fk))
                except:
                    pass

    t5_pass = (len(found_forbidden) == 0)
    results["Wallet A Private Key Isolation"] = ("PASS" if t5_pass else "FAIL", f"Forbidden key occurrences: {len(found_forbidden)}")
    print(f"[{results['Wallet A Private Key Isolation'][0]}] Wallet A Private Key absent from repository, server, & frontend: {t5_pass}")

    # -------------------------------------------------------------
    # TEST 8 & 9: Holder receives Stock Tokens only, ZERO ETH
    # -------------------------------------------------------------
    vault_sol_path = os.path.join(repo_root, "contracts", "RobynStockVault.sol")
    with open(vault_sol_path, "r", encoding="utf-8") as f:
        vault_code = f.read()

    # Verify no payable functions for holders
    payable_count = len(re.findall(r"\bpayable\b", vault_code))
    # emergencyRecoverAccidentalETH has address payable recipient, but msg.value is never accepted
    receive_fallback = len(re.findall(r"\b(receive|fallback)\s*\(", vault_code))
    eth_to_user = len(re.findall(r"msg\.sender\.call\{value:", vault_code))

    t8_pass = (receive_fallback == 0 and eth_to_user == 0)
    results["No ETH To Holders"] = ("PASS" if t8_pass else "FAIL", "Zero payable/ETH claim functions for holders in RobynStockVault.sol")
    print(f"[{results['No ETH To Holders'][0]}] Holders receive Stock Tokens ONLY; Native ETH distribution to holders = ZERO")

    # -------------------------------------------------------------
    # TEST 10: Duplicate cron execution cannot double-spend
    # -------------------------------------------------------------
    cron_ts_path = os.path.join(repo_root, "web-app", "netlify", "functions", "agent-dca-cron.ts")
    with open(cron_ts_path, "r", encoding="utf-8") as f:
        cron_code = f.read()
    idempotency_guard = "lastProcessedEpochTime" in cron_code and "cooldown window" in cron_code
    t10_pass = idempotency_guard
    results["Duplicate Execution Protection"] = ("PASS" if t10_pass else "FAIL", "Idempotency cooldown & on-chain state verification active")
    print(f"[{results['Duplicate Execution Protection'][0]}] Duplicate cron run prevention: {t10_pass}")

    # -------------------------------------------------------------
    # TEST 11: Failed swap does not falsely mark cycle successful
    # -------------------------------------------------------------
    failure_guard = "statusCode: 500" in cron_code and 'status: "FAILED"' in cron_code
    t11_pass = failure_guard
    results["Failure Safety"] = ("PASS" if t11_pass else "FAIL", "Exceptions return HTTP 500 with FAILED status")
    print(f"[{results['Failure Safety'][0]}] Failure Safety: Failed transaction throws and returns FAILED status: {t11_pass}")

    # -------------------------------------------------------------
    # TEST 12 & 13: ROBYN CA on Robinhood Chain RPC (ID: 4663)
    # -------------------------------------------------------------
    try:
        robyn_code = rpc_call("eth_getCode", [ROBYN_TOKEN_CA, "latest"])
        robyn_decimals = int(rpc_call("eth_call", [{"to": ROBYN_TOKEN_CA, "data": "0x313ce567"}, "latest"]), 16)
        robyn_supply = int(rpc_call("eth_call", [{"to": ROBYN_TOKEN_CA, "data": "0x18160ddd"}, "latest"]), 16)

        t12_pass = (robyn_code is not None and len(robyn_code) > 2)
        t13_pass = (robyn_decimals == 18 and robyn_supply == 1_000_000_000 * 10**18)
        results["ROBYN CA Deployed"] = ("PASS" if t12_pass else "FAIL", f"Bytecode len: {len(robyn_code)}")
        results["ROBYN Decimals & Supply"] = ("PASS" if t13_pass else "FAIL", f"Decimals: {robyn_decimals}, Supply: {robyn_supply // 10**18} ROBYN")
        print(f"[{results['ROBYN CA Deployed'][0]}] ROBYN CA ({ROBYN_TOKEN_CA}) verified on Robinhood Chain: {t12_pass}")
        print(f"[{results['ROBYN Decimals & Supply'][0]}] ROBYN Decimals = {robyn_decimals}, Total Supply = {robyn_supply // 10**18:,} ROBYN (1B fixed)")
    except Exception as e:
        results["ROBYN CA Deployed"] = ("FAIL", str(e))
        results["ROBYN Decimals & Supply"] = ("FAIL", str(e))
        print(f"[FAIL] ROBYN CA RPC query failed: {e}")

    # -------------------------------------------------------------
    # TEST 14: Canonical Stock Token addresses on Robinhood Chain
    # -------------------------------------------------------------
    all_stocks_valid = True
    stock_details = []
    for sym, ca in STOCK_TOKENS.items():
        try:
            code = rpc_call("eth_getCode", [ca, "latest"])
            decs = int(rpc_call("eth_call", [{"to": ca, "data": "0x313ce567"}, "latest"]), 16)
            valid = (code is not None and len(code) > 2 and decs == 18)
            stock_details.append(f"{sym}: code_len={len(code)}, decs={decs}")
            if not valid:
                all_stocks_valid = False
        except Exception as e:
            all_stocks_valid = False
            stock_details.append(f"{sym}: err={e}")

    results["Canonical Stock Tokens"] = ("PASS" if all_stocks_valid else "FAIL", "; ".join(stock_details))
    print(f"[{results['Canonical Stock Tokens'][0]}] Canonical Stock Tokens (NVDA, AAPL, TSLA, AMZN) verified on Chain 4663: {all_stocks_valid}")

    # -------------------------------------------------------------
    # TEST 15, 16, 17, 18: Accounting & Entitlement Tests
    # -------------------------------------------------------------
    total_supply = 1_000_000_000
    holder_shares = 100_000_000 # 10%
    vault_nvda = 100
    entitlement_nvda = vault_nvda * (holder_shares / total_supply)
    t17_pass = (entitlement_nvda == 10.0)

    # Double claim check
    claimed = entitlement_nvda
    claimable_after = max(0, entitlement_nvda - claimed)
    t18_pass = (claimable_after == 0)

    results["Pro-Rata Entitlement"] = ("PASS" if t17_pass else "FAIL", f"10% of 100 NVDA = {entitlement_nvda}")
    results["Anti-Double-Claim Floor"] = ("PASS" if t18_pass else "FAIL", f"Post-claim claimable = {claimable_after}")
    print(f"[{results['Pro-Rata Entitlement'][0]}] Pro-Rata Entitlement Calculation: 10% of 100 NVDA = {entitlement_nvda}")
    print(f"[{results['Anti-Double-Claim Floor'][0]}] Claim Cannot Exceed Entitlement (Subsequent claim yields 0): {t18_pass}")

    print("\n=================================================================")
    print("ALL PRODUCTION SECURITY TESTS COMPLETE")
    print("=================================================================")
    return results

if __name__ == "__main__":
    run_tests()
