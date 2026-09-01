import json
from typing import Dict, Any, List
from robyn.chain.wallet import AgentWallet
from robyn.chain.client import RobinhoodChainClient
from robyn.core.llm import RobynLLM


class RobynAgent:
    """The central Autonomous Agent controller orchestrating Robinhood Chain modules."""
    def __init__(self, private_key: str = None, rpc_url: str = None):
        self.client = RobinhoodChainClient(rpc_url)
        self.wallet = AgentWallet(private_key, self.client)
        self.llm = RobynLLM()
        self.modules: Dict[str, Any] = {}

    def register_module(self, name: str, module_instance: Any):
        """Attaches specialized execution modules (Hedging, Launchpad, Arbitrage, etc.)."""
        self.modules[name] = module_instance

    def execute_prompt(self, user_prompt: str) -> Dict[str, Any]:
        """Processes natural language input, invokes tool action, and returns structured results."""
        action = self.llm.generate_action(user_prompt, [])
        tool_name = action.get("name")
        args = action.get("arguments", {})

        if tool_name == "create_hedge_rule" and "hedger" in self.modules:
            return self.modules["hedger"].create_rule(**args)
        elif tool_name == "launch_equi_meme" and "launchpad" in self.modules:
            return self.modules["launchpad"].launch_stock_backed_token(**args)
        elif tool_name == "run_arbitrage_scan" and "arbitrage" in self.modules:
            return self.modules["arbitrage"].scan_and_execute(**args)
        elif tool_name == "query_hype_oracle" and "oracle" in self.modules:
            return self.modules["oracle"].get_hype_score(**args)
        else:
            return {
                "agent": "Robyn-Agent",
                "status": "Online",
                "wallet": self.wallet.address,
                "balance": f"{self.wallet.get_balance()} ETH",
                "chain_telemetry": self.client.get_chain_telemetry()
            }
