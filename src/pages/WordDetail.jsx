import { useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import AudioButton from '../components/AudioButton.jsx'
import HighlightedSentence from '../components/HighlightedSentence.jsx'
import { getWord, getChapter, findSentencesForWord } from '../lib/data.js'
import { useStore } from '../lib/store.js'
import { speak } from '../lib/speech.js'

export default function WordDetail() {
  const { wordId } = useParams()
  const nav = useNavigate()
  const word = getWord(wordId)
  const chapter = word && getChapter(word.chapterId)
  const learned = useStore((s) => s.learnedWords.includes(wordId))
  const toggleLearned = useStore((s) => s.toggleLearned)
  const autoPlay = useStore((s) => s.settings.autoPlay)
  const audioSpeed = useStore((s) => s.settings.audioSpeed)

  const idx = useMemo(() => {
    if (!chapter || !word) return -1
    return chapter.words.findIndex((w) => w.id === word.id)
  }, [chapter, word])

  useEffect(() => {
    if (autoPlay && word) {
      const t = setTimeout(() => speak(word.romaji, audioSpeed), 250)
      return () => clearTimeout(t)
    }
  }, [wordId, autoPlay, audioSpeed, word])

  if (!word || !chapter)
    return (
      <div className="p-6">
        Word not found.{' '}
        <Link to="/" className="text-accent underline">
          Go home
        </Link>
      </div>
    )

  const prev = idx > 0 ? chapter.words[idx - 1] : null
  const next = idx < chapter.words.length - 1 ? chapter.words[idx + 1] : null
  const sentences = findSentencesForWord(chapter.id, word.romaji)

  return (
    <div>
      <PageHeader
        title={chapter.code}
        subtitle={`${idx + 1} of ${chapter.words.length}`}
      />

      <main className="max-w-3xl mx-auto px-4 pt-6 pb-24 space-y-6">
        <section className="glow-card p-8 sm:p-10 text-center relative">
          <span className="pill text-muted">Page {word.page}</span>
          <h1 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight break-words">
            {word.romaji}
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-muted">{word.english}</p>

          <div className="mt-6 flex items-center justify-center">
            <AudioButton text={word.romaji} size="xl" />
          </div>

          <button
            onClick={() => toggleLearned(word.id)}
            className={`mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border transition ${
              learned
                ? 'bg-accent text-bg border-accent shadow-glowSoft'
                : 'border-line bg-white/5 hover:bg-white/10'
            }`}
          >
            <Check className="w-4 h-4" />
            {learned ? 'Marked as learned' : 'Mark as learned'}
          </button>
        </section>

        {sentences.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm uppercase tracking-[0.18em] text-muted">
              Example sentences
            </h2>
            <div className="space-y-2">
              {sentences.map((s, i) => (
                <div
                  key={i}
                  className="glow-card p-4"
                >
                  <HighlightedSentence sentence={s} focal={word.romaji} />
                  <div className="mt-2">
                    <AudioButton text={s.romaji} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <nav className="flex items-center justify-between gap-2">
          <button
            onClick={() => prev && nav(`/word/${prev.id}`)}
            disabled={!prev}
            className="btn-ghost disabled:opacity-40 disabled:hover:bg-white/5"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={() => next && nav(`/word/${next.id}`)}
            disabled={!next}
            className="btn-ghost disabled:opacity-40 disabled:hover:bg-white/5"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      </main>
    </div>
  )
}
