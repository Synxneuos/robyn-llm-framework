'use client'

import React from 'react'

export default function ModelSpotlight() {
  return (
    <section id="model" className="rounded-3xl bg-[#090B0E] border border-white/10 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#00C805]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="grid lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Model Specs & Value Prop */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 bg-[#00C805]/10 border border-[#00C805]/30 rounded-full px-3 py-1 text-xs font-bold text-[#00C805] uppercase tracking-wider">
            <span>🤗</span>
            <span>Hugging Face Model Spotlight</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Robyn-Agent: 0.5B Financial Neural Engine
          </h3>

          <p className="text-gray-300 text-sm leading-relaxed">
            Trained specifically for autonomous EVM tool calling and financial reasoning. Uses the structured <strong className="text-white">Hermes &lt;tool_call&gt; JSON format</strong> to parse natural language instructions into validated on-chain transactions in under 20 milliseconds.
          </p>

          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-black/60 rounded-xl border border-white/10">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Parameters</span>
              <span className="text-lg font-black text-white font-mono">0.5 Billion</span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Ultra-fast inference</span>
            </div>

            <div className="p-3 bg-black/60 rounded-xl border border-white/10">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Tool Syntax</span>
              <span className="text-lg font-black text-[#00C805] font-mono">Hermes JSON</span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Structured EVM calls</span>
            </div>

            <div className="p-3 bg-black/60 rounded-xl border border-white/10">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Inference Speed</span>
              <span className="text-lg font-black text-white font-mono">&lt; 20ms</span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Sub-second ready</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            <a
              href="https://huggingface.co/robynhooood/Robyn-Agent"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#00C805] hover:bg-[#00E806] text-black font-black px-6 py-3 rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-[#00C805]/20"
            >
              <span>Download Model Weights on Hugging Face</span>
              <span>↗</span>
            </a>
            <span className="text-xs text-gray-400 font-mono">
              Model ID: <strong className="text-white">robynhooood/Robyn-Agent</strong>
            </span>
          </div>
        </div>

        {/* Right Column: Code Format Sample */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-black border border-white/15 p-5 font-mono text-xs shadow-xl space-y-2">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-[11px] text-gray-400">
              <span>Hermes Tool-Calling Output</span>
              <span className="text-[#00C805]">JSON SCHEMA</span>
            </div>
            <pre className="text-gray-300 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
              <code>{`<tool_call>
{
  "name": "execute_rwa_hedge",
  "arguments": {
    "pool": "PONS_ROBYN_WETH",
    "profit_trigger_pct": 100,
    "rwa_asset": "NVDA",
    "chain_id": 4663
  }
}
</tool_call>`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
