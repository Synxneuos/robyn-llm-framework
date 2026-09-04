import argparse
import json
import sys
from robyn.core.agent import RobynAgent
from robyn.modules.hedging_vault import MemeToStockHedger
from robyn.modules.equi_launchpad import EquiMemeLaunchpad
from robyn.modules.flash_arbitrage import FlashArbitrageEngine
from robyn.modules.portfolio_manager import AIPortfolioManager
from robyn.modules.hype_oracle import OnChainHypeOracle
from robyn.modules.hyper_speed_engine import HyperSpeedEngine
from robyn.modules.clm_vault import CLMVaultManager
from robyn.modules.verifiable_proofs import VerifiableAuditLogger
from robyn.modules.telegram_sniper import TelegramSniperBot


def main():
    if sys.stdout.encoding != "utf-8":
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass

    parser = argparse.ArgumentParser(description="Robyn Autonomous AI Agent CLI (Robinhood Chain)")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # 1. Status Command
    subparsers.add_parser("status", help="Check agent wallet and Robinhood Chain telemetry")

    # 2. Prompt Command
    prompt_p = subparsers.add_parser("prompt", help="Send natural language prompt to Robyn-Agent")
    prompt_p.add_argument("text", type=str, help="Prompt text")

    # 3. Hedge Command
    hedge_p = subparsers.add_parser("hedge", help="Set up auto take-profit into tokenized stocks")
    hedge_p.add_argument("--meme", type=str, default="0xMemeToken", help="Meme token address")
    hedge_p.add_argument("--stock", type=str, default="NVDA", help="Target tokenized stock (NVDA/AAPL/TSLA)")
    hedge_p.add_argument("--pump", type=float, default=2.0, help="Pump multiple (e.g. 2.0 = 2x)")
    hedge_p.add_argument("--percent", type=float, default=30.0, help="Percentage to convert to stock")

    # 4. Launch Command
    launch_p = subparsers.add_parser("launch", help="Launch a stock-backed meme token")
    launch_p.add_argument("--name", type=str, required=True, help="Token name")
    launch_p.add_argument("--symbol", type=str, required=True, help="Token ticker")
    launch_p.add_argument("--stock", type=str, default="NVDA", help="Backing stock asset")
    launch_p.add_argument("--percent", type=int, default=10, help="Backing percentage")

    # 5. Arb Command
    arb_p = subparsers.add_parser("arb", help="Scan and execute 100ms flash arbitrage")
    arb_p.add_argument("--pair", type=str, default="CASHCAT/ETH", help="Trading pair")

    # 6. Benchmark Command (Faster & Cheaper than Solana)
    subparsers.add_parser("benchmark", help="Compare Robinhood Orbit HyperSpeed vs Solana Mainnet")

    # 7. CLM Command (Concentrated Liquidity)
    clm_p = subparsers.add_parser("clm", help="Analyze and re-center Uniswap V3 concentrated liquidity")
    clm_p.add_argument("--pool", type=str, default="NVDA/USDC", help="Pool pair")

    # 8. Verifiable Proof Command
    proof_p = subparsers.add_parser("proof", help="Anchor cryptographic audit receipt for an action")
    proof_p.add_argument("--action", type=str, default="AUTONOMOUS_HEDGE", help="Action type")

    # 9. Telegram Bot Simulator Command
    subparsers.add_parser("telegram", help="Start interactive Telegram trading sniper")

    args = parser.parse_args()

    # Initialize Agent and register modules
    agent = RobynAgent()
    agent.register_module("hedger", MemeToStockHedger(agent.wallet))
    agent.register_module("launchpad", EquiMemeLaunchpad(agent.wallet))
    agent.register_module("arbitrage", FlashArbitrageEngine(agent.wallet))
    agent.register_module("portfolio", AIPortfolioManager(agent.wallet))
    agent.register_module("oracle", OnChainHypeOracle())
    agent.register_module("hyperspeed", HyperSpeedEngine(agent.wallet))
    agent.register_module("clm", CLMVaultManager(agent.wallet))
    agent.register_module("audit", VerifiableAuditLogger(agent.wallet))
    agent.register_module("telegram", TelegramSniperBot(agent.wallet))

    if args.command == "status":
        print(json.dumps(agent.execute_prompt("check status"), indent=2))
    elif args.command == "prompt":
        print(json.dumps(agent.execute_prompt(args.text), indent=2))
    elif args.command == "benchmark":
        print(json.dumps(agent.modules["hyperspeed"].get_benchmark_comparison(), indent=2))
    elif args.command == "clm":
        print(json.dumps(agent.modules["clm"].execute_auto_recenter(args.pool), indent=2))
    elif args.command == "proof":
        print(json.dumps(agent.modules["audit"].generate_action_proof(args.action, "CLI invocation", {"action": args.action}), indent=2))
    elif args.command == "telegram":
        agent.modules["telegram"].start_polling_loop()
    elif args.command == "hedge":
        hedger = agent.modules["hedger"]
        print(json.dumps(hedger.create_rule(args.meme, args.stock, args.pump, args.percent), indent=2))
    elif args.command == "launch":
        launchpad = agent.modules["launchpad"]
        print(json.dumps(launchpad.launch_stock_backed_token(args.name, args.symbol, backing_stock=args.stock, backing_percent=args.percent), indent=2))
    elif args.command == "arb":
        arb = agent.modules["arbitrage"]
        print(json.dumps(arb.scan_and_execute(args.pair), indent=2))
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
