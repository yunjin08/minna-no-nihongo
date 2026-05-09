let cachedJaVoice = null

function pickJaVoice() {
  if (cachedJaVoice) return cachedJaVoice
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices?.length) return null
  cachedJaVoice =
    voices.find((v) => v.lang === 'ja-JP') ||
    voices.find((v) => v.lang?.startsWith('ja')) ||
    null
  return cachedJaVoice
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedJaVoice = null
    pickJaVoice()
  }
}

export function speak(text, rate = 1) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return Promise.resolve(false)
  return new Promise((resolve) => {
    try {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      const voice = pickJaVoice()
      if (voice) u.voice = voice
      u.lang = 'ja-JP'
      u.rate = rate
      u.pitch = 1
      u.onend = () => resolve(true)
      u.onerror = () => resolve(false)
      window.speechSynthesis.speak(u)
    } catch {
      resolve(false)
    }
  })
}

export function cancelSpeech() {
  try {
    window.speechSynthesis?.cancel()
  } catch {}
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && !!window.speechSynthesis
}
