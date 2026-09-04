import React from 'react'

export default function Footer() {
  return (
    <footer className="hairline-border-t bg-[#020406] py-14 mt-24 text-xs font-mono text-[#8B949E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand Column with Locked Logo */}
        <div className="col-span-2 md:col-span-1 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded hairline-border bg-black p-0.5 overflow-hidden">
              <img src="/robyn_logo.png" alt="Robyn Logo" className="w-full h-full object-cover rounded" />
            </div>
            <span className="text-white font-semibold text-sm">Robyn OS</span>
          </div>
          <p className="text-[11px] text-[#6E7681] leading-relaxed">
            Autonomous multi-agent execution framework and runtime for Robinhood Chain (Arbitrum Orbit).
          </p>
        </div>

        {/* Product Column */}
        <div className="space-y-2.5">
          <span className="text-white font-semibold block">Product</span>
          <ul className="space-y-1.5 text-[11px]">
            <li><a href="#studio" className="hover:text-white transition">Agent Studio</a></li>
            <li><a href="#plugins" className="hover:text-white transition">Plugins</a></li>
            <li><a href="#pipeline" className="hover:text-white transition">Pipeline</a></li>
            <li><a href="#models" className="hover:text-white transition">Models</a></li>
            <li><a href="#sdk" className="hover:text-white transition">SDK</a></li>
          </ul>
        </div>

        {/* Resources Column */}
        <div className="space-y-2.5">
          <span className="text-white font-semibold block">Resources</span>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <a href="https://github.com/robynhood-fw/robyn-llm-framework" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                GitHub Repository
              </a>
            </li>
            <li>
              <a href="https://huggingface.co/robynhooood/Robyn-Agent" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                Hugging Face Model
              </a>
            </li>
            <li>
              <a href="https://robinhoodchain.blockscout.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                Blockscout Explorer
              </a>
            </li>
            <li>
              <a href="https://rpc.mainnet.chain.robinhood.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                Robinhood RPC
              </a>
            </li>
          </ul>
        </div>

        {/* Community Column */}
        <div className="space-y-2.5">
          <span className="text-white font-semibold block">Community</span>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <a href="https://github.com/robynhood-fw/robyn-llm-framework" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                GitHub Issues
              </a>
            </li>
            <li>
              <a href="https://github.com/Synxneuos" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                Lead Developer (Synxneuos)
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 mt-8 hairline-border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6E7681]">
        <div>© 2026 Robyn OS · Apache-2.0 License</div>
        <div className="text-[#8B949E]">Engineered for Sub-100ms Arbitrum Orbit</div>
      </div>
    </footer>
  )
}
