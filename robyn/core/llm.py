import json
import re
from typing import Dict, Any, List, Optional
from robyn.config import ROBYN_MODEL_ID, HF_TOKEN


class RobynLLM:
    """Interface for the Robyn-Agent model, parsing user intent into Hermes tool calls."""
    def __init__(self, model_id: str = ROBYN_MODEL_ID, token: str = HF_TOKEN):
        self.model_id = model_id
        self.token = token

    def format_hermes_prompt(self, user_msg: str, tools: List[Dict[str, Any]]) -> str:
        """Constructs a Hermes-compatible function calling chat template."""
        tools_str = json.dumps(tools, indent=2)
        system_prompt = (
            "You are Robyn, an autonomous AI agent living natively on the Robinhood Chain. "
            "You operate with sub-100ms execution speed, managing tokens, DEX swaps, and RWA hedging. "
            f"You have access to the following tools:\n{tools_str}\n"
            "When executing an action, emit ONLY a <tool_call> block containing a JSON payload."
        )
        return (
            f"<|im_start|>system\n{system_prompt}<|im_end|>\n"
            f"<|im_start|>user\n{user_msg}<|im_end|>\n"
            f"<|im_start|>assistant\n"
        )

    def parse_tool_call(self, text: str) -> Optional[Dict[str, Any]]:
        """Extracts JSON tool call payload from Hermes output."""
        pattern = r"<tool_call>\s*({.*?})\s*</tool_call>"
        match = re.search(pattern, text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                pass
        return None

    def generate_action(self, user_prompt: str, tools: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Local heuristic & model inference engine."""
        lowered = user_prompt.lower()
        
        # 1. Hedging Rule
        if "hedge" in lowered or "take profit" in lowered or "lock profit" in lowered:
            return {
                "name": "create_hedge_rule",
                "arguments": {
                    "meme_token": "0xMemeTokenAddress",
                    "target_stock": "NVDA",
                    "take_profit_multiple": 2.5,
                    "hedge_percent": 30
                }
            }
        
        # 2. Stock-Backed Meme Token Launch
        elif "launch" in lowered or "deploy" in lowered:
            return {
                "name": "launch_equi_meme",
                "arguments": {
                    "name": "Sherwood Bull",
                    "symbol": "SBULL",
                    "supply": 1000000000,
                    "backing_stock": "NVDA",
                    "backing_percent": 10
                }
            }

        # 3. Flash Arbitrage
        elif "arbitrage" in lowered or "arb" in lowered or "flash" in lowered:
            return {
                "name": "run_arbitrage_scan",
                "arguments": {
                    "pair": "CASHCAT/ETH",
                    "min_profit_usd": 15.0
                }
            }

        # 4. Hype Oracle / Sentiment Check
        elif "hype" in lowered or "sentiment" in lowered:
            return {
                "name": "query_hype_oracle",
                "arguments": {
                    "ticker": "NVDA"
                }
            }

        # 5. Default Wallet/Status Check
        else:
            return {
                "name": "get_telemetry",
                "arguments": {}
            }
