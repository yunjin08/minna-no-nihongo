import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Volume2, ChevronRight, Check, X, RotateCw } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import AudioButton from '../components/AudioButton.jsx'
import { getRow, hiraWords } from '../lib/hiragana.js'
import { pickN, buildMCOptions } from '../lib/shuffle.js'
import { useStore } from '../lib/store.js'
import { speak } from '../lib/speech.js'

const QUIZ_LEN = 10

export default function HiraganaQuiz({ isWords = false }) {
  const { rowId, mode } = useParams()
  const nav = useNavigate()
  const recordHiraQuiz = useStore((s) => s.recordHiraQuiz)
  const audioSpeed = useStore((s) => s.settings.audioSpeed)

  const { pool, label, backPath, resultBase } = useMemo(() => {
    if (isWords) {
      return {
        pool: hiraWords,
        label: 'Words',
        backPath: '/hiragana/words',
        resultBase: `/hiragana/words/quiz/${mode}/result`,
      }
    }
    const row = getRow(rowId)
    return {
      pool: row?.characters ?? [],
      label: row ? `${row.label}` : '',
      backPath: `/hiragana/row/${rowId}`,
      resultBase: `/hiragana/row/${rowId}/quiz/${mode}/result`,
    }
  }, [isWords, rowId, mode])

  const questions = useMemo(() => {
    if (pool.length < 2) return []
    if (mode === 'flash') return pickN(pool, Math.min(pool.length, 20))
    const sample = pickN(pool, Math.min(QUIZ_LEN, pool.length))
    return sample.map((item) => ({
      item,
      options: buildMCOptions(item, pool, 4),
    }))
  }, [pool, mode])

  if (pool.length < 2) {
    return (
      <div className="p-6 text-center">
        Not enough items for a quiz.{' '}
        <Link to={backPath} className="text-accent underline">
          Back
        </Link>
      </div>
    )
  }

  function finish(score, wrong) {
    recordHiraQuiz({
      context: isWords ? 'words' : rowId,
      type: mode,
      score,
      total: questions.length,
      wrongIds: wrong,
    })
    nav(resultBase, {
      state: { score, total: questions.length, wrongIds: wrong, mode, isWords },
    })
  }

  if (mode === 'flash') {
    return (
      <FlashMode
        label={label}
        mode={mode}
        items={questions}
        isWords={isWords}
        onFinish={finish}
      />
    )
  }

  return (
    <MCMode
      label={label}
      mode={mode}
      questions={questions}
      isWords={isWords}
      onFinish={finish}
      audioSpeed={audioSpeed}
    />
  )
}

/* ─── Multiple Choice ─────────────────────────────────── */

function MCMode({ label, mode, questions, isWords, onFinish, audioSpeed }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState([])
  const playedRef = useRef(false)

  const q = questions[i]
  const correctId = q.item.id
  const speakText = isWords ? q.item.romaji : q.item.romaji

  useEffect(() => {
    setPicked(null)
    playedRef.current = false
    if (mode === 'listen' || mode === 'word-listen') {
      const t = setTimeout(() => {
        playedRef.current = true
        speak(speakText, audioSpeed)
      }, 200)
      return () => clearTimeout(t)
    }
  }, [i, mode])

  function pick(opt) {
    if (picked) return
    setPicked(opt.id)
    if (opt.id === correctId) setScore((s) => s + 1)
    else setWrong((w) => [...w, q.item.id])
  }

  function next() {
    if (i + 1 >= questions.length) onFinish(score, wrong)
    else setI(i + 1)
  }

  const isListenMode = mode === 'listen' || mode === 'word-listen'

  // What to display as the prompt
  let promptContent
  if (isListenMode) {
    promptContent = (
      <button
        onClick={() => speak(speakText, audioSpeed)}
        className="btn-icon w-20 h-20 [&>svg]:w-8 [&>svg]:h-8 animate-pulse-glow border-accent/40"
        aria-label="Replay audio"
      >
        <Volume2 />
      </button>
    )
  } else if (mode === 'hira-ro') {
    // Show hiragana → pick romaji
    promptContent = (
      <h2 className="text-7xl sm:text-9xl font-bold">{q.item.hiragana}</h2>
    )
  } else if (mode === 'ro-hira') {
    // Show romaji → pick hiragana
    promptContent = (
      <h2 className="text-3xl sm:text-5xl font-bold">{q.item.romaji}</h2>
    )
  } else if (mode === 'word-ro') {
    // Show hiragana word → pick meaning
    promptContent = (
      <div className="space-y-1 text-center">
        <h2 className="text-5xl sm:text-7xl font-bold">{q.item.hiragana}</h2>
        <div className="flex justify-center">
          <AudioButton text={q.item.romaji} size="sm" />
        </div>
      </div>
    )
  }

  // What to display in each option button
  function optionText(opt) {
    if (mode === 'hira-ro') return opt.romaji
    if (mode === 'ro-hira') return opt.hiragana
    if (mode === 'listen') return opt.hiragana
    if (mode === 'word-ro') return opt.meaning
    if (mode === 'word-listen') return opt.hiragana
    return opt.romaji
  }

  const promptLabel = {
    'hira-ro': 'Choose the reading (romaji)',
    'ro-hira': 'Choose the hiragana character',
    'listen': 'Choose the hiragana you heard',
    'word-ro': 'Choose the meaning',
    'word-listen': 'Choose the hiragana word',
  }[mode] ?? 'Choose the answer'

  return (
    <div>
      <PageHeader
        title={`${label} — ${labelForMode(mode)}`}
        subtitle={`Question ${i + 1}/${questions.length}`}
      />
      <main className="max-w-3xl mx-auto px-4 pt-6 pb-24">
        <div className="glow-card p-6 sm:p-10 text-center mb-6">
          <div className="pill text-muted">{promptLabel}</div>
          <div className="mt-6 min-h-[100px] flex items-center justify-center">
            {promptContent}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-2">
          {q.options.map((opt) => {
            const text = optionText(opt)
            const isCorrect = opt.id === correctId
            const isPicked = picked === opt.id
            const showAnswer = !!picked
            let cls = 'glow-card p-4 text-left transition'
            if (showAnswer) {
              if (isCorrect) cls += ' !border-accent !bg-accent/15'
              else if (isPicked) cls += ' !border-danger !bg-danger/10'
              else cls += ' opacity-50'
            } else {
              cls += ' hover:!border-accent/40'
            }
            const isHiraOption = mode === 'ro-hira' || mode === 'listen' || mode === 'word-listen'
            return (
              <button
                key={opt.id}
                disabled={!!picked}
                onClick={() => pick(opt)}
                className={cls}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-medium ${isHiraOption ? 'text-2xl' : ''}`}>{text}</span>
                  {showAnswer && isCorrect && <Check className="w-5 h-5 text-accent shrink-0" />}
                  {showAnswer && isPicked && !isCorrect && <X className="w-5 h-5 text-danger shrink-0" />}
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

/* ─── Flashcard Mode ──────────────────────────────────── */

function FlashMode({ label, mode, items, isWords, onFinish }) {
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const [practice, setPractice] = useState(0)
  const markLearnedHira = useStore((s) => s.markLearnedHira)

  const item = items[i]

  function answer(isKnown) {
    const nextKnown = known + (isKnown ? 1 : 0)
    if (isKnown) setKnown(nextKnown)
    else setPractice((p) => p + 1)
    if (!isWords) markLearnedHira(item.id, isKnown)
    if (i + 1 >= items.length) {
      onFinish(nextKnown, [])
    } else {
      setI(i + 1)
      setFlipped(false)
    }
  }

  const frontContent = isWords ? item.hiragana : item.hiragana
  const backContent  = isWords ? item.meaning  : item.romaji
  const frontLabel   = isWords ? 'Hiragana · tap to flip' : 'Character · tap to flip'
  const backLabel    = isWords ? 'Meaning · tap to flip back' : 'Romaji · tap to flip back'

  return (
    <div>
      <PageHeader
        title={`${label} — Flashcards`}
        subtitle={`Card ${i + 1}/${items.length}`}
      />
      <main className="max-w-3xl mx-auto px-4 pt-6 pb-24">
        <div className="flip-container relative" style={{ aspectRatio: '4/3' }}>
          <div
            onClick={() => setFlipped(!flipped)}
            className={`flip-card absolute inset-0 cursor-pointer ${flipped ? 'flipped' : ''}`}
          >
            <div className="flip-face glow-card flex flex-col items-center justify-center p-6 text-center">
              <span className="pill text-muted mb-3">{frontLabel}</span>
              <h2 className={`font-bold leading-none ${isWords ? 'text-5xl sm:text-7xl' : 'text-7xl sm:text-9xl'}`}>
                {frontContent}
              </h2>
              {!isWords && (
                <div className="mt-6">
                  <AudioButton text={item.romaji} size="lg" />
                </div>
              )}
            </div>
            <div className="flip-back flip-face glow-card flex flex-col items-center justify-center p-6 text-center">
              <span className="pill text-muted mb-3">{backLabel}</span>
              <p className={`font-medium ${isWords ? 'text-2xl sm:text-4xl' : 'text-3xl sm:text-5xl'}`}>
                {backContent}
              </p>
              {isWords && (
                <p className="mt-2 text-muted text-sm">{item.romaji}</p>
              )}
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
      'hira-ro': 'Hiragana → Romaji',
      'ro-hira': 'Romaji → Hiragana',
      'listen':  'Listening',
      'word-ro': 'Word Reading',
      'word-listen': 'Word Listening',
      'flash':   'Flashcards',
    }[m] || 'Quiz'
  )
}
