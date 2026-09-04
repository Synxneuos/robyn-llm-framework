"""
Robyn LLM Framework: Autonomous EVM Agent & Action Engine for Robinhood Chain
"""

__version__ = "1.0.0"
__author__ = "Robyn Hood"

from robyn.core.agent import RobynAgent
from robyn.core.llm import RobynLLM
from robyn.chain.client import RobinhoodChainClient, RobinhoodClient
from robyn.modules.hedging_vault import MemeToStockHedger
from robyn.modules.equi_launchpad import EquiMemeLaunchpad
from robyn.modules.flash_arbitrage import FlashArbitrageEngine
from robyn.modules.portfolio_manager import AIPortfolioManager
from robyn.modules.hype_oracle import OnChainHypeOracle
from robyn.modules.hyper_speed_engine import HyperSpeedEngine
from robyn.modules.clm_vault import CLMVaultManager
from robyn.modules.verifiable_proofs import VerifiableAuditLogger
from robyn.modules.telegram_sniper import TelegramSniperBot

__all__ = [
    "RobynAgent",
    "RobynLLM",
    "RobinhoodChainClient",
    "RobinhoodClient",
    "MemeToStockHedger",
    "EquiMemeLaunchpad",
    "FlashArbitrageEngine",
    "AIPortfolioManager",
    "OnChainHypeOracle",
    "HyperSpeedEngine",
    "CLMVaultManager",
    "VerifiableAuditLogger",
    "TelegramSniperBot"
]
