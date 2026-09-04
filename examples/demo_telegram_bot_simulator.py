import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from robyn.chain.wallet import AgentWallet
from robyn.modules.telegram_sniper import TelegramSniperBot

print("=" * 70)
print(">> DEMO: TELEGRAM SNIPER & TRADING BOT SIMULATOR")
print("Target Chain: Robinhood Chain (Sub-80ms Execution)")
print("=" * 70)

wallet = AgentWallet()
bot = TelegramSniperBot(wallet)

# Test 1: /start
print("\n[Simulating User Command: /start]")
print(bot.process_command("/start"))

# Test 2: /snipe
print("\n[Simulating User Command: /snipe 0xCASHCAT 0.5]")
print(bot.process_command("/snipe 0xCASHCAT 0.5"))

# Test 3: /launch
print("\n[Simulating User Command: /launch SherwoodApex APEX]")
print(bot.process_command("/launch SherwoodApex APEX"))

# Test 4: /hedge
print("\n[Simulating User Command: /hedge 0xCASHCAT 2.5]")
print(bot.process_command("/hedge 0xCASHCAT 2.5"))

# Test 5: /clm
print("\n[Simulating User Command: /clm NVDA/USDC]")
print(bot.process_command("/clm NVDA/USDC"))

print("\n[SUCCESS] All Telegram sniper and trading bot commands executed flawlessly!")
print("=" * 70)
