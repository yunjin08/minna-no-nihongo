import { useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Search as SearchIcon, GraduationCap, ArrowUpDown } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import WordRow from '../components/WordRow.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { getChapter } from '../lib/data.js'
import { useStore } from '../lib/store.js'

export default function Chapter() {
  const { id } = useParams()
  const nav = useNavigate()
  const chapter = getChapter(id)
  const learnedWords = useStore((s) => s.learnedWords)
  const learnedSet = new Set(learnedWords)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('alpha')

  const filtered = useMemo(() => {
    if (!chapter) return []
    const q = query.trim().toLowerCase()
    let list = chapter.words
    if (q)
      list = list.filter(
        (w) =>
          w.romaji.toLowerCase().includes(q) || w.english.toLowerCase().includes(q),
      )
    if (sortBy === 'alpha') list = [...list].sort((a, b) => a.romaji.localeCompare(b.romaji))
    if (sortBy === 'page') list = [...list].sort((a, b) => a.page - b.page || a.romaji.localeCompare(b.romaji))
    return list
  }, [chapter, query, sortBy])

  if (!chapter)
    return (
      <div className="p-6">
        Chapter not found.{' '}
        <Link to="/" className="text-accent underline">
          Go home
        </Link>
      </div>
    )

  const learned = chapter.words.reduce((a, w) => a + (learnedSet.has(w.id) ? 1 : 0), 0)

  return (
    <div>
      <PageHeader
        title={chapter.code}
        subtitle={`${learned}/${chapter.words.length} words learned`}
      />

      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        <ProgressBar value={learned} total={chapter.words.length} />

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search this chapter..."
              className="input-base pl-9"
            />
          </div>
          <button
            onClick={() => setSortBy(sortBy === 'alpha' ? 'page' : 'alpha')}
            className="btn-ghost shrink-0"
            aria-label="Toggle sort"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortBy === 'alpha' ? 'A → Z' : 'By page'}
          </button>
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
        onClick={() => nav(`/chapter/${chapter.id}/quiz`)}
        className="btn-glow fixed bottom-24 right-4 sm:right-8 shadow-glowStrong z-30"
        aria-label="Start quiz"
      >
        <GraduationCap className="w-5 h-5" />
        Start Quiz
      </button>
    </div>
  )
}
