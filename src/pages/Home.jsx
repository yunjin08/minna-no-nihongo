import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import ChapterCard from '../components/ChapterCard.jsx'
import { chapters, totalWordCount } from '../lib/data.js'
import { useStore } from '../lib/store.js'
import { calcStreak } from '../lib/streak.js'

export default function Home() {
  const learnedWords = useStore((s) => s.learnedWords)
  const studyDates = useStore((s) => s.studyDates)
  const streak = calcStreak(studyDates)
  const learnedSet = new Set(learnedWords)

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-10 text-center"
             style={{ paddingTop: 'max(4rem, calc(env(safe-area-inset-top) + 3rem))' }}>
          <div className="inline-flex items-center gap-2 pill mb-5 text-accent2 border-accent/20 bg-accent/5">
            <Sparkles className="w-3.5 h-3.5" /> Minna no Nihongo I
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight tracking-tight">
            Learn{' '}
            <span className="font-script italic font-medium text-accent2 text-5xl sm:text-7xl">
              japanese
            </span>{' '}
            faster.
          </h1>
          <p className="mt-4 text-muted text-base sm:text-lg max-w-xl mx-auto">
            An interactive study guide for chapters 1–8 of Minna no Nihongo I.
            Practice vocabulary, hear pronunciation, and quiz yourself — all offline.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/chapter/1" className="btn-glow">
              Start Studying
            </Link>
            <Link to="/progress" className="btn-ghost">
              View progress
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-3 max-w-md mx-auto gap-3 text-sm">
            <Stat label="Words" value={totalWordCount} />
            <Stat label="Learned" value={learnedSet.size} />
            <Stat label="Streak" value={`${streak}d`} />
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-semibold">Grammar</h2>
          <span className="text-xs text-muted">Conjugation practice</span>
        </div>
        <Link
          to="/adjectives"
          className="glow-card p-5 flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-accent2/10 border border-accent2/20 flex items-center justify-center text-xl shrink-0 font-bold text-accent2">
            い・な
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold">Adjectives</div>
            <div className="text-sm text-muted mt-0.5">
              15 i-adj + 9 na-adj · present &amp; past forms with example sentences
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition shrink-0" />
        </Link>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-semibold">Chapters</h2>
          <span className="text-xs text-muted">8 chapters · DAI-1 KA → DAI-8 KA</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {chapters.map((c) => {
            const learned = c.words.reduce(
              (acc, w) => acc + (learnedSet.has(w.id) ? 1 : 0),
              0,
            )
            return (
              <ChapterCard
                key={c.id}
                chapter={c}
                learned={learned}
                total={c.words.length}
              />
            )
          })}
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
