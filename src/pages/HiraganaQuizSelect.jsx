import { useNavigate, useParams } from 'react-router-dom'
import { Type, Headphones, Layers, AlignLeft } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import { getRow } from '../lib/hiragana.js'

const CHAR_MODES = [
  {
    key: 'hira-ro',
    title: 'Hiragana → Romaji',
    sub: 'See character → pick the correct reading',
    icon: Type,
  },
  {
    key: 'ro-hira',
    title: 'Romaji → Hiragana',
    sub: 'See reading → pick the correct character',
    icon: AlignLeft,
  },
  {
    key: 'listen',
    title: 'Listening',
    sub: 'Hear the sound → pick the correct character',
    icon: Headphones,
  },
  {
    key: 'flash',
    title: 'Flashcards',
    sub: 'Self-paced flip cards — character ↔ romaji',
    icon: Layers,
  },
]

const WORD_MODES = [
  {
    key: 'word-ro',
    title: 'Word Reading',
    sub: 'See hiragana word → pick the meaning',
    icon: Type,
  },
  {
    key: 'word-listen',
    title: 'Listening',
    sub: 'Hear the word → pick the hiragana',
    icon: Headphones,
  },
  {
    key: 'flash',
    title: 'Flashcards',
    sub: 'Self-paced flip cards — hiragana ↔ meaning',
    icon: Layers,
  },
]

export default function HiraganaQuizSelect({ isWords = false }) {
  const { rowId } = useParams()
  const nav = useNavigate()

  const modes = isWords ? WORD_MODES : CHAR_MODES
  const basePath = isWords ? '/hiragana/words/quiz' : `/hiragana/row/${rowId}/quiz`

  let title = 'Quiz'
  let subtitle = 'Pick a mode'
  if (!isWords) {
    const row = getRow(rowId)
    if (row) title = `${row.label} — Quiz`
  } else {
    title = 'Words Quiz'
  }

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <main className="max-w-3xl mx-auto px-4 pt-4 pb-24 grid sm:grid-cols-2 gap-3">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => nav(`${basePath}/${m.key}`)}
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
