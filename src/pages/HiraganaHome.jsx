import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import ProgressBar from '../components/ProgressBar.jsx'
import { hiraRows, hiraWords, totalHiraCount } from '../lib/hiragana.js'
import { useStore } from '../lib/store.js'

const BASIC_LABEL = 'Basic'
const VOICED_LABEL = 'Voiced'
const COMBO_LABEL = 'Combinations'

export default function HiraganaHome() {
  const learnedHiragana = useStore((s) => s.learnedHiragana)
  const learnedSet = new Set(learnedHiragana)

  const basicRows  = hiraRows.filter((r) => r.group === 'basic')
  const voicedRows = hiraRows.filter((r) => r.group === 'voiced')
  const comboRows  = hiraRows.filter((r) => r.group === 'combo')

  const totalLearned = learnedSet.size

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
        <div
          className="relative max-w-3xl mx-auto px-4 pt-16 pb-10 text-center"
          style={{ paddingTop: 'max(4rem, calc(env(safe-area-inset-top) + 3rem))' }}
        >
          <div className="inline-flex items-center gap-2 pill mb-5 text-accent2 border-accent/20 bg-accent/5">
            あ い う え お
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight tracking-tight">
            Learn{' '}
            <span className="font-script italic font-medium text-accent2 text-5xl sm:text-7xl">
              hiragana
            </span>
            .
          </h1>
          <p className="mt-4 text-muted text-base sm:text-lg max-w-xl mx-auto">
            Master all {totalHiraCount} hiragana characters — by row, with pronunciation,
            quizzes, and reading practice.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/hiragana/row/a" className="btn-glow">
              Start from A Row
            </Link>
            <Link to="/hiragana/row/all/quiz" className="btn-ghost">
              Quiz all
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-3 max-w-md mx-auto gap-3 text-sm">
            <Stat label="Characters" value={totalHiraCount} />
            <Stat label="Learned" value={totalLearned} />
            <Stat label="Words" value={hiraWords.length} />
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-8">
        <SectionLabel title={BASIC_LABEL} sub="46 characters · あ through ん" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {basicRows.map((r) => (
            <RowCard key={r.id} row={r} learnedSet={learnedSet} />
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-8">
        <SectionLabel title={VOICED_LABEL} sub="25 characters · が through ぽ" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {voicedRows.map((r) => (
            <RowCard key={r.id} row={r} learnedSet={learnedSet} />
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-8">
        <SectionLabel title={COMBO_LABEL} sub="33 combinations · きゃ through ぴょ" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {comboRows.map((r) => (
            <RowCard key={r.id} row={r} learnedSet={learnedSet} />
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-24">
        <SectionLabel title="Practice Words" sub={`${hiraWords.length} words · reading & listening`} />
        <Link
          to="/hiragana/words"
          className="glow-card p-5 flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl shrink-0">
            <BookOpen className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold">Word Reading Practice</div>
            <div className="text-sm text-muted mt-0.5">
              {hiraWords.length} words — see hiragana, practice reading
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition" />
        </Link>
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

function RowCard({ row, learnedSet }) {
  const learned = row.characters.reduce((acc, c) => acc + (learnedSet.has(c.id) ? 1 : 0), 0)
  const total = row.characters.length
  const preview = row.characters.slice(0, 3).map((c) => c.hiragana).join('・')

  return (
    <Link to={`/hiragana/row/${row.id}`} className="glow-card p-5 flex flex-col gap-3 group">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">{row.name}</div>
          <div className="font-script text-3xl text-accent2 leading-none mt-1">{row.label}</div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition" />
      </div>
      <div className="text-sm text-muted">{preview}{total > 3 ? ' …' : ''}</div>
      <ProgressBar value={learned} total={total} />
      <div className="text-xs text-muted">{learned}/{total} learned</div>
    </Link>
  )
}
