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
import BottomNav from './components/BottomNav.jsx'
import { useFontScale } from './hooks/useFontScale.js'
import { useDarkMode } from './hooks/useDarkMode.js'

export default function App() {
  useFontScale()
  useDarkMode()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

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
        <Route path="*" element={<Home />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
