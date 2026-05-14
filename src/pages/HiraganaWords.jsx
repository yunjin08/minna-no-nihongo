import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search as SearchIcon, GraduationCap } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import AudioButton from '../components/AudioButton.jsx'
import { hiraWords } from '../lib/hiragana.js'

export default function HiraganaWords() {
  const nav = useNavigate()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return hiraWords
    return hiraWords.filter(
      (w) =>
        w.hiragana.includes(q) ||
        w.romaji.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div>
      <PageHeader
        title="Practice Words"
        subtitle={`${hiraWords.length} words — hiragana reading`}
      />

      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search words…"
            className="input-base pl-9"
          />
        </div>

        <div className="space-y-2 pb-24">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted">No words match your search.</div>
          ) : (
            filtered.map((w) => <WordRow key={w.id} word={w} />)
          )}
        </div>
      </main>

      <button
        onClick={() => nav('/hiragana/words/quiz')}
        className="btn-glow fixed bottom-24 right-4 sm:right-8 shadow-glowStrong z-30"
        aria-label="Start quiz"
      >
        <GraduationCap className="w-5 h-5" />
        Start Quiz
      </button>
    </div>
  )
}

function WordRow({ word }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-line hover:border-accent/30 hover:bg-surface2 transition">
      <div className="flex-1 min-w-0">
        <div className="text-2xl font-bold leading-tight">{word.hiragana}</div>
        <div className="text-sm font-medium text-accent2 mt-0.5">{word.romaji}</div>
        <div className="text-sm text-muted truncate">{word.meaning}</div>
      </div>
      <AudioButton text={word.romaji} size="sm" />
    </div>
  )
}
