import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { iAdjectives, naAdjectives } from '../lib/adjectives.js'

export default function AdjectivesHome() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
        <div
          className="relative max-w-3xl mx-auto px-4 pt-16 pb-10 text-center"
          style={{ paddingTop: 'max(4rem, calc(env(safe-area-inset-top) + 3rem))' }}
        >
          <div className="inline-flex items-center gap-2 pill mb-5 text-accent2 border-accent/20 bg-accent/5">
            い・な
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight tracking-tight">
            Learn{' '}
            <span className="font-script italic font-medium text-accent2 text-5xl sm:text-7xl">
              adjectives
            </span>
            .
          </h1>
          <p className="mt-4 text-muted text-base sm:text-lg max-w-xl mx-auto">
            Master {iAdjectives.length} i-adjectives and {naAdjectives.length} na-adjectives —
            with present and past conjugations plus example sentences.
          </p>
          <div className="mt-8 grid grid-cols-3 max-w-md mx-auto gap-3 text-sm">
            <Stat label="i-adj" value={iAdjectives.length} />
            <Stat label="na-adj" value={naAdjectives.length} />
            <Stat label="Forms" value={4} />
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-8">
        <SectionLabel
          title="い-adjectives"
          sub={`${iAdjectives.length} words · conjugate with -katta / -kunai`}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {iAdjectives.map((adj) => (
            <AdjCard key={adj.id} adj={adj} />
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-24">
        <SectionLabel
          title="な-adjectives"
          sub={`${naAdjectives.length} words · conjugate with deshita / ja arimasen`}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {naAdjectives.map((adj) => (
            <AdjCard key={adj.id} adj={adj} />
          ))}
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="glow-card p-3">
      <div className="text-xl font-bold text-accent2">{value}</div>
      <div className="text-xs text-muted uppercase tracking-wider">{label}</div>
    </div>
  )
}

function SectionLabel({ title, sub }) {
  return (
    <div className="flex items-baseline justify-between mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <span className="text-xs text-muted">{sub}</span>
    </div>
  )
}

function AdjCard({ adj }) {
  return (
    <Link
      to={`/adjectives/${adj.id}`}
      className="glow-card p-5 flex flex-col gap-2 group"
    >
      <div className="flex items-start justify-between">
        <span
          className={`text-[10px] uppercase tracking-[0.18em] font-semibold px-2 py-0.5 rounded-full ${
            adj.type === 'i'
              ? 'bg-accent/10 text-accent'
              : 'bg-accent2/10 text-accent2'
          }`}
        >
          {adj.type}-adj
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-accent transition shrink-0" />
      </div>
      <div className="font-bold text-lg leading-snug">{adj.romaji}</div>
      <div className="text-sm text-muted leading-snug">{adj.english}</div>
    </Link>
  )
}
