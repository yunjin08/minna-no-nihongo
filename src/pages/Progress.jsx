import { Link } from 'react-router-dom'
import { Flame, Trophy, BookOpen, GraduationCap } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { chapters, totalWordCount, getChapter } from '../lib/data.js'
import { useStore } from '../lib/store.js'
import { calcStreak } from '../lib/streak.js'

export default function Progress() {
  const learnedWords = useStore((s) => s.learnedWords)
  const studyDates = useStore((s) => s.studyDates)
  const quizHistory = useStore((s) => s.quizHistory)
  const learnedSet = new Set(learnedWords)
  const streak = calcStreak(studyDates)
  const learnedCount = learnedWords.length
  const pct = totalWordCount > 0 ? Math.round((learnedCount / totalWordCount) * 100) : 0
  const recent = quizHistory.slice(0, 10)

  const bestPerChapter = {}
  for (const q of quizHistory) {
    const ratio = q.score / q.total
    if (!bestPerChapter[q.chapterId] || bestPerChapter[q.chapterId].ratio < ratio) {
      bestPerChapter[q.chapterId] = { ratio, score: q.score, total: q.total, type: q.type }
    }
  }

  return (
    <div>
      <PageHeader title="Progress" back={false} />
      <main className="max-w-3xl mx-auto px-4 pt-4 pb-24 space-y-6">
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat icon={BookOpen} label="Words learned" value={`${learnedCount}/${totalWordCount}`} hint={`${pct}%`} />
          <Stat icon={Flame} label="Day streak" value={`${streak}`} hint={streak === 1 ? 'day' : 'days'} />
          <Stat icon={GraduationCap} label="Quizzes taken" value={quizHistory.length} />
          <Stat
            icon={Trophy}
            label="Best score"
            value={
              quizHistory.length
                ? `${Math.round(
                    Math.max(...quizHistory.map((q) => q.score / q.total)) * 100,
                  )}%`
                : '—'
            }
          />
        </section>

        <section className="glow-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Overall progress</h2>
            <span className="text-sm text-muted">{pct}%</span>
          </div>
          <ProgressBar value={learnedCount} total={totalWordCount} />
        </section>

        <section>
          <h2 className="font-semibold mb-3">By chapter</h2>
          <div className="space-y-2">
            {chapters.map((c) => {
              const total = c.words.length
              const learned = c.words.reduce(
                (a, w) => a + (learnedSet.has(w.id) ? 1 : 0),
                0,
              )
              const best = bestPerChapter[c.id]
              return (
                <Link
                  key={c.id}
                  to={`/chapter/${c.id}`}
                  className="glow-card p-4 block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-script text-2xl text-accent2 leading-none">{c.code}</div>
                      <div className="text-xs text-muted mt-1">{c.name}</div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{learned}/{total}</div>
                      {best && (
                        <div className="text-xs text-muted">
                          best {Math.round(best.ratio * 100)}%
                        </div>
                      )}
                    </div>
                  </div>
                  <ProgressBar value={learned} total={total} />
                </Link>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-3">Recent quizzes</h2>
          {recent.length === 0 ? (
            <p className="text-muted text-sm">
              No quizzes yet — try one from any chapter!
            </p>
          ) : (
            <div className="space-y-2">
              {recent.map((q, i) => {
                const c = getChapter(q.chapterId)
                const ratio = q.score / q.total
                return (
                  <div key={i} className="glow-card p-3 flex items-center gap-3">
                    <div className="font-script text-xl text-accent2 w-20 shrink-0">
                      {c?.code}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium capitalize">
                        {labelForType(q.type)}
                      </div>
                      <div className="text-xs text-muted">{q.date}</div>
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        ratio >= 0.7 ? 'text-accent' : ratio >= 0.4 ? 'text-warn' : 'text-danger'
                      }`}
                    >
                      {q.score}/{q.total}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function labelForType(t) {
  return (
    {
      'mc-en': 'Multiple choice (English)',
      'mc-ro': 'Multiple choice (Romaji)',
      'listen': 'Listening',
      'flash': 'Flashcards',
    }[t] || t
  )
}

function Stat({ icon: Icon, label, value, hint }) {
  return (
    <div className="glow-card p-4">
      <Icon className="w-4 h-4 text-accent" />
      <div className="text-xl font-bold mt-1.5">{value}</div>
      <div className="text-xs text-muted">
        {label}
        {hint ? ` · ${hint}` : ''}
      </div>
    </div>
  )
}
