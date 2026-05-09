import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const today = () => new Date().toISOString().slice(0, 10)

export const useStore = create(
  persist(
    (set, get) => ({
      learnedWords: [],
      quizHistory: [],
      studyDates: [],
      settings: {
        darkMode: true,
        fontSize: 'medium',
        audioSpeed: 1,
        autoPlay: false,
      },

      isLearned: (id) => get().learnedWords.includes(id),

      toggleLearned: (id) => {
        const set_ = new Set(get().learnedWords)
        if (set_.has(id)) set_.delete(id)
        else set_.add(id)
        set({ learnedWords: [...set_] })
        get().touchStudyDate()
      },

      markLearned: (id, learned) => {
        const set_ = new Set(get().learnedWords)
        if (learned) set_.add(id)
        else set_.delete(id)
        set({ learnedWords: [...set_] })
        get().touchStudyDate()
      },

      recordQuiz: (entry) => {
        const next = [{ ...entry, date: entry.date || today() }, ...get().quizHistory].slice(0, 200)
        set({ quizHistory: next })
        get().touchStudyDate()
      },

      touchStudyDate: () => {
        const t = today()
        const dates = get().studyDates
        if (dates[dates.length - 1] === t) return
        const setOfDates = new Set(dates)
        setOfDates.add(t)
        set({ studyDates: [...setOfDates].sort() })
      },

      updateSetting: (key, value) =>
        set((s) => ({ settings: { ...s.settings, [key]: value } })),

      clearAll: () =>
        set({
          learnedWords: [],
          quizHistory: [],
          studyDates: [],
        }),
    }),
    {
      name: 'mnn-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
)
