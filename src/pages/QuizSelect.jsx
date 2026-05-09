import { useNavigate, useParams } from 'react-router-dom'
import { ListChecks, Type, Headphones, Layers } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import { getChapter } from '../lib/data.js'

const MODES = [
  {
    key: 'mc-en',
    title: 'Multiple Choice',
    sub: 'See romaji → pick the English meaning',
    icon: ListChecks,
  },
  {
    key: 'mc-ro',
    title: 'Reverse Multiple Choice',
    sub: 'See English → pick the romaji',
    icon: Type,
  },
  {
    key: 'listen',
    title: 'Listening Quiz',
    sub: 'Hear the word → pick the correct romaji',
    icon: Headphones,
  },
  {
    key: 'flash',
    title: 'Flashcards',
    sub: 'Self-paced flip cards. Mark Know it / Need practice',
    icon: Layers,
  },
]

export default function QuizSelect() {
  const { id } = useParams()
  const nav = useNavigate()
  const chapter = getChapter(id)
  if (!chapter) return null

  return (
    <div>
      <PageHeader title={`${chapter.code} — Quiz`} subtitle="Pick a mode" />
      <main className="max-w-3xl mx-auto px-4 pt-4 pb-24 grid sm:grid-cols-2 gap-3">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => nav(`/chapter/${id}/quiz/${m.key}`)}
            className="glow-card p-5 text-left flex gap-4 items-start"
          >
            <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
              <m.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold">{m.title}</div>
              <div className="text-sm text-muted mt-0.5">{m.sub}</div>
            </div>
          </button>
        ))}
      </main>
    </div>
  )
}
