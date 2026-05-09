import { useEffect } from 'react'
import { useStore } from '../lib/store.js'

const SCALES = { small: 0.9, medium: 1, large: 1.15 }

export function useFontScale() {
  const fontSize = useStore((s) => s.settings.fontSize)
  useEffect(() => {
    const scale = SCALES[fontSize] ?? 1
    document.documentElement.style.setProperty('--font-scale', String(scale))
  }, [fontSize])
}
