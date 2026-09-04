import React from 'react'

export default function GitHubCTA() {
  return (
    <section className="pt-10">
      <div className="bg-[#05070A] hairline-border rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4 shadow-2xl relative overflow-hidden">
        <div className="font-mono text-xs text-[#00C805] uppercase tracking-wider">
          OPEN SOURCE RUNTIME
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Build your own agents. Extend the runtime. Explore the source.
        </h2>
        <p className="text-[#8B949E] text-sm max-w-xl mx-auto">
          Robyn OS is fully open-source under the Apache-2.0 license. Join the developer community building autonomous agents for Robinhood Chain.
        </p>
        <div className="pt-2">
          <a
            href="https://github.com/robynhood-fw/robyn-llm-framework"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs text-black font-semibold bg-white hover:bg-[#E2E8F0] px-6 py-3 rounded-lg transition shadow-sm"
          >
            <span>View GitHub Repository</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
