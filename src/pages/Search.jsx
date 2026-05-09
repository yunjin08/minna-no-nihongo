import { useMemo, useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import WordRow from '../components/WordRow.jsx'
import { allWords, chapters } from '../lib/data.js'
import { useStore } from '../lib/store.js'

export default function Search() {
  const [q, setQ] = useState('')
  const [chapterFilter, setChapterFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const learnedWords = useStore((s) => s.learnedWords)
  const learnedSet = new Set(learnedWords)

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    let list = allWords
    if (chapterFilter !== 'all') list = list.filter((w) => w.chapterId === Number(chapterFilter))
    if (statusFilter === 'learned') list = list.filter((w) => learnedSet.has(w.id))
    if (statusFilter === 'unlearned') list = list.filter((w) => !learnedSet.has(w.id))
    if (query)
      list = list.filter(
        (w) =>
          w.romaji.toLowerCase().includes(query) ||
          w.english.toLowerCase().includes(query),
      )
    return list.slice(0, 200)
  }, [q, chapterFilter, statusFilter, learnedWords])

  return (
    <div>
      <PageHeader title="Search" back={false} />
      <main className="max-w-3xl mx-auto px-4 pt-4 pb-24 space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search romaji or English across all chapters..."
            className="input-base pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1">
          <select
            value={chapterFilter}
            onChange={(e) => setChapterFilter(e.target.value)}
            className="input-base !py-2 !px-3 text-sm shrink-0"
          >
            <option value="all">All chapters</option>
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}
              </option>
            ))}
          </select>
          <div className="flex rounded-xl border border-line overflow-hidden shrink-0">
            {[
              { v: 'all', l: 'All' },
              { v: 'learned', l: 'Learned' },
              { v: 'unlearned', l: 'Not yet' },
            ].map(({ v, l }) => (
              <button
                key={v}
                onClick={() => setStatusFilter(v)}
                className={`px-3 py-2 text-sm transition ${
                  statusFilter === v ? 'bg-accent text-bg font-medium' : 'bg-surface text-muted hover:bg-surface2'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <div className="text-5xl font-script text-accent2 mb-3 opacity-50">無</div>
            No words found.
          </div>
        ) : (
          <div className="space-y-2">
            {results.map((w) => (
              <WordRow key={w.id} word={w} showChapter />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
