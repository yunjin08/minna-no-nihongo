import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { Trophy, RefreshCw, BookOpen } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import AudioButton from '../components/AudioButton.jsx'
import { getChar, getWord } from '../lib/hiragana.js'

export default function HiraganaQuizResult({ isWords = false }) {
  const { rowId, mode } = useParams()
  const { state } = useLocation()
  const nav = useNavigate()

  const backPath = isWords ? '/hiragana/words' : `/hiragana/row/${rowId}`
  const retryPath = isWords
    ? `/hiragana/words/quiz/${mode}`
    : `/hiragana/row/${rowId}/quiz/${mode}`
  const subtitle = isWords ? 'Words Quiz' : `Row Quiz`

  if (!state) {
    return (
      <div className="p-6">
        No result data.{' '}
        <Link to={backPath} className="text-accent underline">
          Back
        </Link>
      </div>
    )
  }

  const { score, total, wrongIds = [] } = state
  const pct = Math.round((score / total) * 100)
  const tone =
    pct >= 80
      ? { color: 'text-accent', label: 'Excellent!', shadow: 'shadow-glowStrong' }
      : pct >= 50
      ? { color: 'text-warn', label: 'Keep practicing', shadow: 'shadow-glowSoft' }
      : { color: 'text-danger', label: 'Try again', shadow: '' }

  const wrongItems = wrongIds
    .map((id) => (isWords ? getWord(id) : getChar(id)))
    .filter(Boolean)

  return (
    <div>
      <PageHeader title="Result" subtitle={subtitle} />
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
              onClick={() => nav(retryPath, { replace: true })}
              className="btn-glow"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
            <Link to={backPath} className="btn-ghost">
              <BookOpen className="w-4 h-4" /> Back
            </Link>
          </div>
        </section>

        {wrongItems.length > 0 && (
          <section>
            <h2 className="font-semibold mb-3">Review mistakes ({wrongItems.length})</h2>
            <div className="space-y-2">
              {wrongItems.map((item) =>
                isWords ? (
                  <WrongWordRow key={item.id} word={item} />
                ) : (
                  <WrongCharRow key={item.id} char={item} />
                ),
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

function WrongCharRow({ char }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-surface border border-danger/30 bg-danger/5">
      <div className="text-4xl font-bold w-12 text-center shrink-0">{char.hiragana}</div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold">{char.romaji}</div>
        {char.rowName && <div className="text-xs text-muted">{char.rowName}</div>}
      </div>
      <AudioButton text={char.romaji} size="sm" />
    </div>
  )
}

function WrongWordRow({ word }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-surface border border-danger/30 bg-danger/5">
      <div className="text-2xl font-bold shrink-0">{word.hiragana}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-accent2">{word.romaji}</div>
        <div className="text-sm text-muted">{word.meaning}</div>
      </div>
      <AudioButton text={word.romaji} size="sm" />
    </div>
  )
}
