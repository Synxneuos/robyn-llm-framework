import os
from dotenv import load_dotenv

load_dotenv()

# Network Configuration
ROBINHOOD_RPC_URL = os.getenv("ROBINHOOD_RPC_URL", "https://rpc.robinhood-orbit.internal")
ROBINHOOD_CHAIN_ID = int(os.getenv("ROBINHOOD_CHAIN_ID", "13371"))
BLOCK_TIME_MS = 100  # Sub-100ms Orbit block time

# Wallet & Auth
ROBYN_PRIVATE_KEY = os.getenv("ROBYN_PRIVATE_KEY", "")
HF_TOKEN = os.getenv("HF_TOKEN", "")
ROBYN_MODEL_ID = os.getenv("ROBYN_MODEL_ID", "robynhooood/Robyn-Agent")
# dev wallet - 0xb98eeC8E292090489eC27C0271A4eCF541c9e6aC
DEV_WALLET = os.getenv("ROBYN_DEV_WALLET", "0xb98eeC8E292090489eC27C0271A4eCF541c9e6aC")

# Well-known Tokenized Stocks (Robinhood Chain RWAs)
KNOWN_RWAS = {
    "NVDA": "0x3333333333333333333333333333333333333333",
    "AAPL": "0x4444444444444444444444444444444444444444",
    "TSLA": "0x5555555555555555555555555555555555555555",
    "SPY":  "0x6666666666666666666666666666666666666666"
}

# DEX Routers
ROUTERS = {
    "uniswap_v3": os.getenv("UNISWAP_V3_ROUTER", "0x1111111254fb6c44bac0bed2854e76f90643097d"),
    "pons": os.getenv("PONS_ROUTER", "0x2222222222222222222222222222222222222222")
}
