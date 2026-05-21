import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import AudioButton from '../components/AudioButton.jsx'
import { adjectives, getAdjective, getConjugations } from '../lib/adjectives.js'

export default function AdjectiveDetail() {
  const { adjId } = useParams()
  const nav = useNavigate()
  const adj = getAdjective(adjId)

  if (!adj) {
    return (
      <div className="p-6">
        Adjective not found.{' '}
        <Link to="/adjectives" className="text-accent underline">
          Go back
        </Link>
      </div>
    )
  }

  const conjugations = getConjugations(adj)
  const idx = adjectives.findIndex((a) => a.id === adjId)
  const prev = idx > 0 ? adjectives[idx - 1] : null
  const next = idx < adjectives.length - 1 ? adjectives[idx + 1] : null

  return (
    <div>
      <PageHeader
        title="Adjectives"
        subtitle={`${idx + 1} of ${adjectives.length}`}
      />

      <main className="max-w-3xl mx-auto px-4 pt-6 pb-24 space-y-6">
        {/* Adjective card */}
        <section className="glow-card p-8 sm:p-10 text-center">
          <span
            className={`pill text-xs font-semibold ${
              adj.type === 'i'
                ? 'text-accent border-accent/30 bg-accent/5'
                : 'text-accent2 border-accent2/30 bg-accent2/5'
            }`}
          >
            {adj.type === 'i' ? 'い-adjective' : 'な-adjective'}
          </span>
          <h1 className="mt-4 text-5xl sm:text-6xl font-bold tracking-tight">
            {adj.romaji}
          </h1>
          <p className="mt-3 text-lg text-muted">{adj.english}</p>
          {adj.type === 'i' && (
            <p className="mt-1 text-sm text-muted">
              Stem: <span className="font-mono text-ink">{adj.stem}</span>
            </p>
          )}
          <div className="mt-5 flex items-center justify-center">
            <AudioButton text={adj.romaji} size="xl" />
          </div>
        </section>

        {/* Conjugation table */}
        <section className="space-y-3">
          <h2 className="text-sm uppercase tracking-[0.18em] text-muted">
            Conjugations &amp; example sentences
          </h2>
          <div className="space-y-3">
            {conjugations.map((row) => (
              <ConjugationRow key={row.label} row={row} />
            ))}
          </div>
        </section>

        {/* Prev / Next */}
        <nav className="flex items-center justify-between gap-2">
          <button
            onClick={() => prev && nav(`/adjectives/${prev.id}`)}
            disabled={!prev}
            className="btn-ghost disabled:opacity-40 disabled:hover:bg-white/5"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={() => next && nav(`/adjectives/${next.id}`)}
            disabled={!next}
            className="btn-ghost disabled:opacity-40 disabled:hover:bg-white/5"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      </main>
    </div>
  )
}

function ConjugationRow({ row }) {
  const isPositive = row.polarity === 'pos'
  const isPast     = row.tense   === 'past'

  return (
    <div className="glow-card p-4 space-y-3">
      {/* Header row: tense label + conjugated form */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full ${
              isPast
                ? 'bg-accent2/10 text-accent2'
                : 'bg-accent/10 text-accent'
            }`}
          >
            {isPast ? 'Past' : 'Present'}
          </span>
          <span
            className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-rose-500/10 text-rose-400'
            }`}
          >
            {isPositive ? 'Affirmative' : 'Negative'}
          </span>
        </div>
        <span className="font-mono text-sm font-semibold text-ink">
          {row.form}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-line" />

      {/* Example sentence */}
      <div className="space-y-1">
        <p className="text-sm font-medium">{row.example.romaji}</p>
        <p className="text-xs text-muted">{row.example.english}</p>
      </div>
      <div>
        <AudioButton text={row.example.romaji} size="sm" />
      </div>
    </div>
  )
}
