import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { Trophy, RefreshCw, BookOpen } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import WordRow from '../components/WordRow.jsx'
import { getChapter, getWord } from '../lib/data.js'

export default function QuizResult() {
  const { id, mode } = useParams()
  const { state } = useLocation()
  const nav = useNavigate()
  const chapter = getChapter(id)
  if (!state || !chapter) {
    return (
      <div className="p-6">
        No result data.{' '}
        <Link to={`/chapter/${id}`} className="text-accent underline">
          Back to chapter
        </Link>
      </div>
    )
  }

  const { score, total, wrongWords = [] } = state
  const pct = Math.round((score / total) * 100)
  const tone =
    pct >= 80
      ? { color: 'text-accent', label: 'Excellent', shadow: 'shadow-glowStrong' }
      : pct >= 50
      ? { color: 'text-warn', label: 'Keep practicing', shadow: 'shadow-glowSoft' }
      : { color: 'text-danger', label: 'Try again', shadow: '' }

  return (
    <div>
      <PageHeader title="Result" subtitle={chapter.code} />
      <main className="max-w-3xl mx-auto px-4 pt-6 pb-24 space-y-6">
        <section className={`glow-card p-8 text-center ${tone.shadow}`}>
          <Trophy className={`w-10 h-10 mx-auto ${tone.color}`} />
          <div className="mt-3 text-sm uppercase tracking-[0.2em] text-muted">
            {tone.label}
          </div>
          <div className={`mt-2 text-6xl font-bold ${tone.color}`}>{pct}%</div>
          <div className="mt-1 text-muted">
            {score} of {total} correct
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => nav(`/chapter/${id}/quiz/${mode}`, { replace: true })}
              className="btn-glow"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
            <Link to={`/chapter/${id}`} className="btn-ghost">
              <BookOpen className="w-4 h-4" /> Back to chapter
            </Link>
          </div>
        </section>

        {wrongWords.length > 0 && (
          <section>
            <h2 className="font-semibold mb-3">Review mistakes ({wrongWords.length})</h2>
            <div className="space-y-2">
              {wrongWords.map((wid) => {
                const w = getWord(wid)
                return w ? <WordRow key={wid} word={w} /> : null
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
