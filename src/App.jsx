import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home.jsx'
import Chapter from './pages/Chapter.jsx'
import WordDetail from './pages/WordDetail.jsx'
import QuizSelect from './pages/QuizSelect.jsx'
import Quiz from './pages/Quiz.jsx'
import QuizResult from './pages/QuizResult.jsx'
import Search from './pages/Search.jsx'
import Progress from './pages/Progress.jsx'
import Settings from './pages/Settings.jsx'
import HiraganaHome from './pages/HiraganaHome.jsx'
import HiraganaRow from './pages/HiraganaRow.jsx'
import HiraganaWords from './pages/HiraganaWords.jsx'
import HiraganaQuizSelect from './pages/HiraganaQuizSelect.jsx'
import HiraganaQuiz from './pages/HiraganaQuiz.jsx'
import HiraganaQuizResult from './pages/HiraganaQuizResult.jsx'
import BottomNav from './components/BottomNav.jsx'
import InstallPrompt from './components/InstallPrompt.jsx'
import { useFontScale } from './hooks/useFontScale.js'
import { useDarkMode } from './hooks/useDarkMode.js'
import { unlockSpeech } from './lib/speech.js'

export default function App() {
  useFontScale()
  useDarkMode()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Unlock iOS Safari TTS on the very first user interaction.
  useEffect(() => {
    const handler = () => unlockSpeech()
    const opts = { once: true, passive: true, capture: true }
    window.addEventListener('pointerdown', handler, opts)
    window.addEventListener('keydown', handler, opts)
    return () => {
      window.removeEventListener('pointerdown', handler, opts)
      window.removeEventListener('keydown', handler, opts)
    }
  }, [])

  return (
    <div className="min-h-screen pb-24 animate-fade-in">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chapter/:id" element={<Chapter />} />
        <Route path="/word/:wordId" element={<WordDetail />} />
        <Route path="/chapter/:id/quiz" element={<QuizSelect />} />
        <Route path="/chapter/:id/quiz/:mode" element={<Quiz />} />
        <Route path="/chapter/:id/quiz/:mode/result" element={<QuizResult />} />
        <Route path="/search" element={<Search />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />

        {/* Hiragana */}
        <Route path="/hiragana" element={<HiraganaHome />} />
        <Route path="/hiragana/row/:rowId" element={<HiraganaRow />} />
        <Route path="/hiragana/row/:rowId/quiz" element={<HiraganaQuizSelect />} />
        <Route path="/hiragana/row/:rowId/quiz/:mode" element={<HiraganaQuiz />} />
        <Route path="/hiragana/row/:rowId/quiz/:mode/result" element={<HiraganaQuizResult />} />
        <Route path="/hiragana/words" element={<HiraganaWords />} />
        <Route path="/hiragana/words/quiz" element={<HiraganaQuizSelect isWords />} />
        <Route path="/hiragana/words/quiz/:mode" element={<HiraganaQuiz isWords />} />
        <Route path="/hiragana/words/quiz/:mode/result" element={<HiraganaQuizResult isWords />} />

        <Route path="*" element={<Home />} />
      </Routes>
      <BottomNav />
      <InstallPrompt />
    </div>
  )
}
