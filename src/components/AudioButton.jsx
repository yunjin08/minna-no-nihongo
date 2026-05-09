import { Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'
import { speak, isSpeechSupported } from '../lib/speech.js'
import { useStore } from '../lib/store.js'

export default function AudioButton({ text, size = 'md', className = '' }) {
  const rate = useStore((s) => s.settings.audioSpeed)
  const [busy, setBusy] = useState(false)
  const supported = isSpeechSupported()

  const sizes = {
    sm: 'w-8 h-8 [&>svg]:w-4 [&>svg]:h-4',
    md: 'w-10 h-10 [&>svg]:w-5 [&>svg]:h-5',
    lg: 'w-16 h-16 [&>svg]:w-7 [&>svg]:h-7',
    xl: 'w-20 h-20 [&>svg]:w-8 [&>svg]:h-8',
  }

  async function onClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!supported || busy) return
    setBusy(true)
    await speak(text, rate)
    setBusy(false)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Play pronunciation: ${text}`}
      title={supported ? 'Play pronunciation' : 'Speech not supported on this device'}
      className={`btn-icon ${sizes[size]} ${busy ? 'animate-pulse-glow border-accent/40' : ''} ${className}`}
    >
      {supported ? <Volume2 /> : <VolumeX />}
    </button>
  )
}
