import React from 'react'

const PIPELINE_STEPS = [
  {
    step: '01',
    name: 'PERCEPTION',
    title: 'Mempool & Event Ingestion',
    desc: 'High-frequency WebSocket listener ingesting Robinhood Orbit Nitro blocks at 100ms intervals.',
    detail: 'RPC stream: rpc.mainnet.chain.robinhood.com',
  },
  {
    step: '02',
    name: 'REASONING',
    title: 'Robyn Neural LLM Core',
    desc: '0.5B Hermes fine-tuned model decomposes multi-step natural language into structured tool calls.',
    detail: '<tool_call> JSON schema validation',
  },
  {
    step: '03',
    name: 'TOOL EXECUTION',
    title: 'Plugin Resolution Layer',
    desc: 'Dispatches actions to modular plugins: Uniswap V3, Robinhood RPC, ERC-4337 Smart Accounts.',
    detail: 'Plugin bus: @robyn-os/plugin-*',
  },
  {
    step: '04',
    name: 'SIMULATION',
    title: 'Zero-Revert Pre-Flight',
    desc: 'Simulates state transitions off-chain to guarantee gas efficiency and 100% execution success.',
    detail: 'eth_call state verification',
  },
  {
    step: '05',
    name: 'SETTLEMENT',
    title: 'Arbitrum Orbit Finality',
    desc: 'Broadcasts signed transactions to Robinhood Chain with sub-second block inclusion and cryptographic receipts.',
    detail: 'Blockscout on-chain verification',
  },
]

export default function FrameworkArchitecture() {
  return (
    <section id="pipeline" className="space-y-8 pt-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 hairline-border-b pb-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#00C805] uppercase">
            <span>// 02_ENGINEERING_ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            THE RUNTIME
          </h2>
          <p className="text-[#8B949E] text-xs sm:text-sm mt-1">
            A modular execution layer engineered for autonomous agents on Arbitrum Orbit.
          </p>
        </div>

        <div className="font-mono text-xs text-[#8B949E]">
          5-STAGE DETERMINISTIC PIPELINE
        </div>
      </div>

      {/* Engineering Pipeline Flow (Open Layout with Connectors) */}
      <div className="grid md:grid-cols-5 gap-4">
        {PIPELINE_STEPS.map((step, idx) => (
          <div
            key={step.step}
            className="bg-[#05070A] hairline-border rounded-xl p-5 flex flex-col justify-between hover:border-white/20 transition group"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-[#8B949E] mb-3">
                <span className="text-white font-bold">{step.step}</span>
                <span className="text-[10px] text-[#00C805]">{step.name}</span>
              </div>
              <h3 className="font-mono text-sm font-semibold text-white mb-2 group-hover:text-[#00C805] transition">
                {step.title}
              </h3>
              <p className="text-[#8B949E] text-xs leading-relaxed mb-4">
                {step.desc}
              </p>
            </div>

            <div className="pt-3 hairline-border-t border-white/5 font-mono text-[10px] text-[#6E7681]">
              {step.detail}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
