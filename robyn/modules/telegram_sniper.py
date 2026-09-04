import json
import os
import sys
from typing import Dict, Any, List
from robyn.chain.wallet import AgentWallet
from robyn.modules.hyper_speed_engine import HyperSpeedEngine
from robyn.modules.hedging_vault import MemeToStockHedger
from robyn.modules.clm_vault import CLMVaultManager


class TelegramSniperBot:
    """
    Telegram Sniper & Trading Agent for Robinhood Chain.
    
    Provides a lightning-fast chat interface for:
    - /launch: Deploy instant meme tokens via HyperSpeed minimal proxy (<$0.0009).
    - /snipe: Sub-80ms zero-approval buy on Pons/Uniswap pools.
    - /hedge: Activate auto profit-sweeping into tokenized stocks ($NVDA, $AAPL).
    - /clm: Check and re-center Uniswap V3 concentrated liquidity vaults.
    - /status: Live wallet balance and 100ms Orbit telemetry.
    """
    def __init__(self, wallet: AgentWallet, bot_token: str = None):
        self.wallet = wallet
        self.bot_token = bot_token or os.getenv("TELEGRAM_BOT_TOKEN", "")
        self.hyperspeed = HyperSpeedEngine(wallet)
        self.hedger = MemeToStockHedger(wallet)
        self.clm = CLMVaultManager(wallet)

    def process_command(self, command_text: str, user_id: str = "tg_trader_1") -> str:
        """Parses and executes Telegram bot commands."""
        parts = command_text.strip().split()
        if not parts:
            return "Type /help for available Robinhood Chain commands."

        cmd = parts[0].lower()

        # 1. Start / Help Command
        if cmd in ["/start", "/help"]:
            return (
                ">> Welcome to Robyn Telegram Sniper (Robinhood Chain)\n\n"
                "Available Commands:\n"
                "- /snipe <token> <eth> : Snipe token in <80ms with 0 approval\n"
                "- /launch <name> <ticker> : Launch token in <70ms (<$0.0009 gas)\n"
                "- /hedge <token> <mult> : Lock profits into tokenized NVDA\n"
                "- /clm <pair> : Re-center Uniswap V3 liquidity for high APR\n"
                "- /wallet : Check balance & Orbit telemetry\n\n"
                "Powered by Robyn HyperSpeed Engine on Arbitrum Orbit (100ms blocks)"
            )

        # 2. Snipe Command
        elif cmd == "/snipe":
            token = parts[1] if len(parts) > 1 else "0xCASHCAT"
            amount_eth = float(parts[2]) if len(parts) > 2 else 0.25
            result = self.hyperspeed.hyper_trade_swap(token_address=token, amount_in_eth=amount_eth, is_buy=True)
            return (
                f"[SNIPE CONFIRMED - Sub-80ms]\n"
                f"  Token: {result['token']}\n"
                f"  Amount: {result['amount_in']}\n"
                f"  Speed: {result['latency']}\n"
                f"  Cost: {result['gas_cost_usd']}\n"
                f"  Tx: {result['tx_hash'][:16]}..."
            )

        # 3. Launch Command
        elif cmd == "/launch":
            name = parts[1] if len(parts) > 1 else "Robin Bull"
            ticker = parts[2] if len(parts) > 2 else "RBULL"
            result = self.hyperspeed.launch_token_hyper(name=name, symbol=ticker)
            return (
                f"[TOKEN LAUNCHED INSTANTLY]\n"
                f"  Name: {result['token_name']} ({result['ticker']})\n"
                f"  Address: {result['contract_address']}\n"
                f"  Latency: {result['performance_metrics']['execution_latency']}\n"
                f"  Gas Fee: {result['performance_metrics']['estimated_fee_usd']}\n"
                f"  Curve: Active in Block 0"
            )

        # 4. Hedge Command
        elif cmd == "/hedge":
            token = parts[1] if len(parts) > 1 else "0xCASHCAT"
            mult = float(parts[2]) if len(parts) > 2 else 2.0
            result = self.hedger.create_rule(meme_token=token, target_stock="NVDA", take_profit_multiple=mult, hedge_percent=30.0)
            return (
                f"[AUTO-HEDGING VAULT ACTIVE]\n"
                f"  Target Token: {token}\n"
                f"  Trigger: {mult}x pump\n"
                f"  Action: Convert 30% into Tokenized NVDA\n"
                f"  Keeper: Robyn 100ms listener"
            )

        # 5. CLM Vault Command
        elif cmd == "/clm":
            pair = parts[1] if len(parts) > 1 else "NVDA/USDC"
            result = self.clm.execute_auto_recenter(pool_pair=pair)
            return (
                f"[CLM VAULT REBALANCED]\n"
                f"  Pool: {result['pool']}\n"
                f"  Latency: {result['latency']}\n"
                f"  Range: {result['new_optimized_range']}\n"
                f"  Projected Fee Boost: {result['projected_yield_boost']}"
            )

        # 6. Wallet Command
        elif cmd in ["/wallet", "/status"]:
            return (
                f"[AGENT WALLET & TELEMETRY]\n"
                f"  Address: {self.wallet.address}\n"
                f"  Balance: {self.wallet.get_balance()} ETH\n"
                f"  Network: Robinhood Chain (Arbitrum Orbit)\n"
                f"  Block Time: 100ms Sequencer\n"
                f"  Status: Active & Ready"
            )

        else:
            return f"Unknown command '{cmd}'. Use /help to view command list."

    def start_polling_loop(self):
        """Interactive Terminal / Polling Loop."""
        print(">> [Robyn Telegram Bot] Online & Listening for commands...")
        print(">> Type '/help' to test or 'exit' to quit.")
        while True:
            try:
                user_input = input("\n[Telegram User]: ")
                if user_input.strip().lower() in ["exit", "quit"]:
                    break
                reply = self.process_command(user_input)
                print(f"[Robyn Bot]:\n{reply}")
            except (KeyboardInterrupt, EOFError):
                break
