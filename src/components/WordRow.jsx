import { Link } from 'react-router-dom'
import { Check, ChevronRight } from 'lucide-react'
import AudioButton from './AudioButton.jsx'
import { useStore } from '../lib/store.js'

export default function WordRow({ word, showChapter = false }) {
  const learned = useStore((s) => s.learnedWords.includes(word.id))
  return (
    <Link
      to={`/word/${word.id}`}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-line hover:border-accent/30 hover:bg-surface2 transition group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-base truncate">{word.romaji}</div>
          {learned && (
            <Check className="w-3.5 h-3.5 text-accent shrink-0" aria-label="Learned" />
          )}
        </div>
        <div className="text-sm text-muted truncate">{word.english}</div>
        {showChapter && word.chapterCode && (
          <div className="mt-1">
            <span className="pill text-[10px] text-muted">{word.chapterCode}</span>
          </div>
        )}
      </div>
      <AudioButton text={word.romaji} size="sm" />
      <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent transition" />
    </Link>
  )
}
