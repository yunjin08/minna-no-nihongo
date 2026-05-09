import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Volume2, ChevronRight, Check, X, RotateCw } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import AudioButton from '../components/AudioButton.jsx'
import { getChapter } from '../lib/data.js'
import { pickN, buildMCOptions } from '../lib/shuffle.js'
import { useStore } from '../lib/store.js'
import { speak } from '../lib/speech.js'

const QUIZ_LEN = 10

export default function Quiz() {
  const { id, mode } = useParams()
  const nav = useNavigate()
  const chapter = getChapter(id)
  const recordQuiz = useStore((s) => s.recordQuiz)
  const audioSpeed = useStore((s) => s.settings.audioSpeed)

  const questions = useMemo(() => {
    if (!chapter) return []
    const wordsPool = chapter.words
    if (wordsPool.length < 2) return []
    if (mode === 'flash') return pickN(wordsPool, Math.min(wordsPool.length, 20))
    const sample = pickN(wordsPool, Math.min(QUIZ_LEN, wordsPool.length))
    return sample.map((w) => ({
      word: w,
      options: buildMCOptions(w, wordsPool, 4),
    }))
  }, [chapter?.id, mode])

  if (!chapter) return null
  if (questions.length === 0) {
    return (
      <div className="p-6 text-center">
        Not enough words in this chapter for a quiz.{' '}
        <Link to={`/chapter/${id}`} className="text-accent underline">
          Back
        </Link>
      </div>
    )
  }

  if (mode === 'flash') return <FlashcardMode chapter={chapter} words={questions} />

  return (
    <MCMode
      chapter={chapter}
      mode={mode}
      questions={questions}
      onFinish={(score, wrong) => {
        recordQuiz({
          chapterId: chapter.id,
          type: mode,
          score,
          total: questions.length,
          wrongWords: wrong,
        })
        nav(`/chapter/${chapter.id}/quiz/${mode}/result`, {
          state: {
            score,
            total: questions.length,
            wrongWords: wrong,
            mode,
          },
        })
      }}
      audioSpeed={audioSpeed}
    />
  )
}

function MCMode({ chapter, mode, questions, onFinish, audioSpeed }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState([])
  const playedRef = useRef(false)

  const q = questions[i]
  const correctId = q.word.id

  useEffect(() => {
    setPicked(null)
    playedRef.current = false
    if (mode === 'listen') {
      const t = setTimeout(() => {
        playedRef.current = true
        speak(q.word.romaji, audioSpeed)
      }, 200)
      return () => clearTimeout(t)
    }
  }, [i, mode])

  function pick(opt) {
    if (picked) return
    setPicked(opt.id)
    if (opt.id === correctId) setScore((s) => s + 1)
    else setWrong((w) => [...w, q.word.id])
  }

  function next() {
    if (i + 1 >= questions.length) onFinish(score, wrong)
    else setI(i + 1)
  }

  const promptText =
    mode === 'mc-ro' ? q.word.english : q.word.romaji

  return (
    <div>
      <PageHeader
        title={`${chapter.code} — ${labelForMode(mode)}`}
        subtitle={`Question ${i + 1}/${questions.length}`}
      />
      <main className="max-w-3xl mx-auto px-4 pt-6 pb-24">
        <div className="glow-card p-6 sm:p-10 text-center mb-6">
          <div className="pill text-muted">
            {mode === 'mc-en' && 'Choose the English meaning'}
            {mode === 'mc-ro' && 'Choose the romaji'}
            {mode === 'listen' && 'Choose the romaji you heard'}
          </div>
          <div className="mt-6 min-h-[80px] flex items-center justify-center">
            {mode === 'listen' ? (
              <button
                onClick={() => speak(q.word.romaji, audioSpeed)}
                className="btn-icon w-20 h-20 [&>svg]:w-8 [&>svg]:h-8 animate-pulse-glow border-accent/40"
                aria-label="Replay audio"
              >
                <Volume2 />
              </button>
            ) : (
              <h2 className="text-3xl sm:text-5xl font-bold break-words">
                {promptText}
              </h2>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-2">
          {q.options.map((opt) => {
            const text = mode === 'mc-en' ? opt.english : opt.romaji
            const isCorrect = opt.id === correctId
            const isPicked = picked === opt.id
            const showAnswer = !!picked
            let cls =
              'glow-card p-4 text-left transition'
            if (showAnswer) {
              if (isCorrect) cls += ' !border-accent !bg-accent/15'
              else if (isPicked) cls += ' !border-danger !bg-danger/10'
              else cls += ' opacity-50'
            } else {
              cls += ' hover:!border-accent/40'
            }
            return (
              <button
                key={opt.id}
                disabled={!!picked}
                onClick={() => pick(opt)}
                className={cls}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{text}</span>
                  {showAnswer && isCorrect && <Check className="w-5 h-5 text-accent" />}
                  {showAnswer && isPicked && !isCorrect && (
                    <X className="w-5 h-5 text-danger" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted">
            Score: <span className="text-ink font-semibold">{score}</span>
          </div>
          <button
            onClick={next}
            disabled={!picked}
            className="btn-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:scale-100"
          >
            {i + 1 >= questions.length ? 'Finish' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  )
}

function FlashcardMode({ chapter, words }) {
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const [practice, setPractice] = useState(0)
  const markLearned = useStore((s) => s.markLearned)
  const recordQuiz = useStore((s) => s.recordQuiz)
  const nav = useNavigate()
  const w = words[i]

  function answer(isKnown) {
    const nextKnown = known + (isKnown ? 1 : 0)
    if (isKnown) setKnown(nextKnown)
    else setPractice((p) => p + 1)
    markLearned(w.id, isKnown)
    if (i + 1 >= words.length) {
      recordQuiz({
        chapterId: chapter.id,
        type: 'flash',
        score: nextKnown,
        total: words.length,
        wrongWords: [],
      })
      nav(`/chapter/${chapter.id}/quiz/flash/result`, {
        state: { score: nextKnown, total: words.length, mode: 'flash' },
      })
    } else {
      setI(i + 1)
      setFlipped(false)
    }
  }

  return (
    <div>
      <PageHeader title={`${chapter.code} — Flashcards`} subtitle={`Card ${i + 1}/${words.length}`} />
      <main className="max-w-3xl mx-auto px-4 pt-6 pb-24">
        <div className="flip-container relative" style={{ aspectRatio: '4/3' }}>
          <div
            onClick={() => setFlipped(!flipped)}
            className={`flip-card absolute inset-0 cursor-pointer ${flipped ? 'flipped' : ''}`}
          >
            <div className="flip-face glow-card flex flex-col items-center justify-center p-6 text-center">
              <span className="pill text-muted mb-3">Romaji · tap to flip</span>
              <h2 className="text-4xl sm:text-6xl font-bold">{w.romaji}</h2>
              <div className="mt-6">
                <AudioButton text={w.romaji} size="lg" />
              </div>
            </div>
            <div className="flip-back flip-face glow-card flex flex-col items-center justify-center p-6 text-center">
              <span className="pill text-muted mb-3">English · tap to flip back</span>
              <p className="text-2xl sm:text-4xl font-medium">{w.english}</p>
              <p className="mt-3 text-muted text-sm">Page {w.page}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            onClick={() => answer(false)}
            className="glow-card p-4 hover:!border-warn/40 hover:!bg-warn/10"
          >
            <div className="flex items-center justify-center gap-2 text-warn">
              <RotateCw className="w-4 h-4" /> Need practice
            </div>
          </button>
          <button
            onClick={() => answer(true)}
            className="glow-card p-4 hover:!border-accent/40 hover:!bg-accent/10"
          >
            <div className="flex items-center justify-center gap-2 text-accent">
              <Check className="w-4 h-4" /> Know it
            </div>
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-muted">
          Known: <span className="text-accent font-semibold">{known}</span> · Practice:{' '}
          <span className="text-warn font-semibold">{practice}</span>
        </div>
      </main>
    </div>
  )
}

function labelForMode(m) {
  return (
    {
      'mc-en': 'Multiple Choice',
      'mc-ro': 'Reverse MC',
      'listen': 'Listening',
      'flash': 'Flashcards',
    }[m] || 'Quiz'
  )
}
