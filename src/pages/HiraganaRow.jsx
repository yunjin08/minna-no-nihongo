import { useParams, useNavigate, Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import AudioButton from '../components/AudioButton.jsx'
import { getRow } from '../lib/hiragana.js'
import { useStore } from '../lib/store.js'

export default function HiraganaRow() {
  const { rowId } = useParams()
  const nav = useNavigate()
  const row = getRow(rowId)
  const learnedHiragana = useStore((s) => s.learnedHiragana)
  const toggleLearnedHira = useStore((s) => s.toggleLearnedHira)
  const learnedSet = new Set(learnedHiragana)

  if (!row) {
    return (
      <div className="p-6">
        Row not found.{' '}
        <Link to="/hiragana" className="text-accent underline">
          Go to Hiragana
        </Link>
      </div>
    )
  }

  const learned = row.characters.reduce((acc, c) => acc + (learnedSet.has(c.id) ? 1 : 0), 0)

  return (
    <div>
      <PageHeader
        title={`${row.label} — ${row.name}`}
        subtitle={`${learned}/${row.characters.length} characters learned`}
      />

      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        <ProgressBar value={learned} total={row.characters.length} />

        {row.id === 'combos' ? (
          <CombosGrid
            characters={row.characters}
            learnedSet={learnedSet}
            onToggle={toggleLearnedHira}
          />
        ) : (
          <CharGrid
            characters={row.characters}
            learnedSet={learnedSet}
            onToggle={toggleLearnedHira}
          />
        )}

        <div className="pb-24" />
      </main>

      <button
        onClick={() => nav(`/hiragana/row/${row.id}/quiz`)}
        className="btn-glow fixed bottom-24 right-4 sm:right-8 shadow-glowStrong z-30"
        aria-label="Start quiz"
      >
        <GraduationCap className="w-5 h-5" />
        Start Quiz
      </button>
    </div>
  )
}

function CharGrid({ characters, learnedSet, onToggle }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
      {characters.map((c) => (
        <CharCard key={c.id} char={c} learned={learnedSet.has(c.id)} onToggle={onToggle} />
      ))}
    </div>
  )
}

function CombosGrid({ characters, learnedSet, onToggle }) {
  // Group into sets of 3 (kya/kyu/kyo, sha/shu/sho, …)
  const groups = []
  for (let i = 0; i < characters.length; i += 3) {
    groups.push(characters.slice(i, i + 3))
  }
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group[0].id} className="grid grid-cols-3 gap-3">
          {group.map((c) => (
            <CharCard key={c.id} char={c} learned={learnedSet.has(c.id)} onToggle={onToggle} />
          ))}
        </div>
      ))}
    </div>
  )
}

function CharCard({ char, learned, onToggle }) {
  return (
    <div
      className={`glow-card p-4 flex flex-col items-center gap-2 text-center select-none ${
        learned ? '!border-accent/40 !bg-accent/5' : ''
      }`}
    >
      <div className="text-5xl font-bold leading-none">{char.hiragana}</div>
      <div className="text-sm text-muted font-medium tracking-wide">{char.romaji}</div>
      <div className="flex items-center gap-2 mt-1">
        <AudioButton text={char.romaji} size="sm" />
        <button
          onClick={() => onToggle(char.id)}
          className={`text-[11px] px-2 py-0.5 rounded-full border transition ${
            learned
              ? 'border-accent/40 text-accent bg-accent/10'
              : 'border-line text-muted hover:border-accent/30'
          }`}
          aria-label={learned ? 'Mark as not learned' : 'Mark as learned'}
        >
          {learned ? '✓' : '○'}
        </button>
      </div>
    </div>
  )
}
