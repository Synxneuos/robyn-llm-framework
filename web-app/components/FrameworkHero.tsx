import React from 'react'

interface HeroProps {
  onExplore: () => void
}

export default function FrameworkHero({ onExplore }: HeroProps) {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Editorial Headline & Actions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Subtle Technical Label */}
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#8B949E] tracking-wider uppercase">
            <span className="text-[#00C805] font-bold">ROBYN OS</span>
            <span>//</span>
            <span>AUTONOMOUS AGENT INFRASTRUCTURE</span>
          </div>

          {/* Large Confident Editorial Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            Build autonomous agents that think, execute, and operate.
          </h1>

          {/* Supporting Technical Paragraph */}
          <p className="text-[#8B949E] text-base sm:text-lg leading-relaxed max-w-xl font-normal">
            The developer-native multi-agent execution framework engineered for the <strong className="text-white font-medium">Robinhood Chain (Arbitrum Orbit)</strong>. Fusing lightweight 0.5B on-device tool-calling neural models with sub-100ms on-chain execution, declarative character configurations, and automated real-world asset action pipelines.
          </p>

          {/* Restrained CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onExplore}
              className="font-mono text-xs text-black font-semibold bg-white hover:bg-[#E2E8F0] px-5 py-3 rounded-lg transition shadow-sm"
            >
              Explore the Runtime ↓
            </button>
            <a
              href="https://github.com/robynhood-fw/robyn-llm-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-white bg-white/5 hover:bg-white/10 hairline-border px-5 py-3 rounded-lg transition flex items-center gap-2"
            >
              <span>View on GitHub</span>
              <span className="text-[#8B949E]">↗</span>
            </a>
          </div>

          {/* Technical Metadata Strip */}
          <div className="pt-4 flex flex-wrap items-center gap-6 font-mono text-xs text-[#6E7681]">
            <div>
              <span className="text-white font-semibold">100ms</span> Orbit Nitro
            </div>
            <span className="text-[#30363D]">·</span>
            <div>
              <span className="text-white font-semibold">0.5B</span> Hermes Tool LLM
            </div>
            <span className="text-[#30363D]">·</span>
            <div>
              <span className="text-white font-semibold">Apache-2.0</span> Open Source
            </div>
          </div>
        </div>

        {/* Right Column: The LOCKED Robyn Character Artwork in a Premium Container */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md">
            {/* Minimalist Dark Frame */}
            <div className="bg-[#05070A] hairline-border rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
              {/* Header Metadata */}
              <div className="flex items-center justify-between pb-3 hairline-border-b font-mono text-[11px] text-[#8B949E]">
                <span className="text-white font-medium">AGENT IDENTITY // ROBYN-CORE</span>
                <span className="text-[#00C805] font-semibold text-[10px] uppercase">LOCKED ASSET</span>
              </div>

              {/* Exact Locked Robyn Girl Artwork (/robyn_avatar.jpg) */}
              <div className="relative rounded-xl overflow-hidden bg-black aspect-square hairline-border">
                <img
                  src="/robyn_avatar.jpg"
                  alt="Robyn Autonomous AI Character"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Technical Spec Footer */}
              <div className="flex items-center justify-between font-mono text-[11px] text-[#8B949E] pt-1">
                <span>Model: robynhooood/Robyn-Agent</span>
                <span className="text-white">Chain ID: 420120</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
