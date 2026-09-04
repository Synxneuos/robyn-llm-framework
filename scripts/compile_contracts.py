import json
import os
import sys
import solcx

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

solcx.set_solc_version('0.8.20')

contract_path = os.path.join(os.path.dirname(__file__), "..", "contracts", "RobinhoodCollateralVault.sol")
with open(contract_path, "r", encoding="utf-8") as f:
    source = f.read()

compiled = solcx.compile_source(
    source,
    output_values=["abi", "bin"],
    solc_version="0.8.20",
    optimize=True,
    optimize_runs=200
)

contract_id = "<stdin>:RobinhoodCollateralVault"
vault_data = compiled[contract_id]

artifact = {
    "contractName": "RobinhoodCollateralVault",
    "abi": vault_data["abi"],
    "bytecode": "0x" + vault_data["bin"]
}

out_path = os.path.join(os.path.dirname(__file__), "..", "contracts", "RobinhoodCollateralVault.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(artifact, f, indent=2)

print(f"[+] Successfully compiled RobinhoodCollateralVault.sol!")
print(f"[+] Bytecode length: {len(vault_data['bin'])} hex chars")
print(f"[+] Saved to: {out_path}")
