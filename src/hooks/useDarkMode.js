import { useEffect } from 'react'
import { useStore } from '../lib/store.js'

export function useDarkMode() {
  const dark = useStore((s) => s.settings.darkMode)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
}
