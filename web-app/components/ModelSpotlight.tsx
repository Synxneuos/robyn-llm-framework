import React from 'react'

export default function ModelSpotlight() {
  return (
    <section id="models" className="space-y-6 pt-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 hairline-border-b pb-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#00C805] uppercase">
            <span>// 05_NEURAL_CORE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Robyn-Agent Model
          </h2>
          <p className="text-[#8B949E] text-xs sm:text-sm mt-1">
            0.5B parameter lightweight neural engine fine-tuned for deterministic EVM tool calling and financial reasoning.
          </p>
        </div>

        <a
          href="https://huggingface.co/robynhooood/Robyn-Agent"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-white bg-white/5 hover:bg-white/10 hairline-border px-3 py-1.5 rounded-lg transition self-start sm:self-auto flex items-center gap-1.5"
        >
          <span>Download on Hugging Face</span>
          <span className="text-[#8B949E]">↗</span>
        </a>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-center">
        {/* Specs Table */}
        <div className="lg:col-span-6 bg-[#05070A] hairline-border rounded-xl p-5 sm:p-6 space-y-4">
          <div className="font-mono text-xs text-[#8B949E] uppercase">TECHNICAL SPECIFICATIONS</div>
          <div className="grid grid-cols-2 gap-4 font-mono text-xs">
            <div className="bg-[#020406] p-3.5 rounded-lg hairline-border">
              <span className="text-[#6E7681] text-[10px] block">PARAMETER SIZE</span>
              <span className="text-white font-bold text-sm mt-0.5 block">0.5 Billion</span>
            </div>
            <div className="bg-[#020406] p-3.5 rounded-lg hairline-border">
              <span className="text-[#6E7681] text-[10px] block">TOOL FORMAT</span>
              <span className="text-[#00C805] font-bold text-sm mt-0.5 block">Robyn Engine JSON</span>
            </div>
            <div className="bg-[#020406] p-3.5 rounded-lg hairline-border">
              <span className="text-[#6E7681] text-[10px] block">INFERENCE SPEED</span>
              <span className="text-white font-bold text-sm mt-0.5 block">&lt; 20ms Local</span>
            </div>
            <div className="bg-[#020406] p-3.5 rounded-lg hairline-border">
              <span className="text-[#6E7681] text-[10px] block">CONTEXT WINDOW</span>
              <span className="text-white font-bold text-sm mt-0.5 block">8,192 Tokens</span>
            </div>
          </div>
          <p className="text-xs text-[#8B949E] leading-relaxed">
            Optimized for sub-second on-device inference via GGUF, Ollama, and vLLM. Parses multi-step user prompts into validated on-chain calldata with zero execution reverts.
          </p>
        </div>

        {/* Schema Preview */}
        <div className="lg:col-span-6 bg-[#05070A] hairline-border rounded-xl p-5 sm:p-6 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between pb-2 hairline-border-b font-mono text-[11px] text-[#8B949E]">
            <span>ROBYN_TOOL_SCHEMA</span>
            <span className="text-[#00C805]">DETERMINISTIC</span>
          </div>
          <pre className="text-[#C9D1D9] text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap bg-[#020406] p-4 rounded-lg hairline-border">
            <code>{`<tool_call>
{
  "name": "execute_clm_rebalance",
  "arguments": {
    "pool": "NVDA_USDC_005",
    "trigger_delta_pct": 1.5,
    "chain_id": 420120,
    "max_slippage_bps": 10
  }
}
</tool_call>`}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}
