// Web Speech API wrapper with iOS Safari workarounds.
//
// Known iOS quirks handled here:
// 1. getVoices() returns [] until 'voiceschanged' fires — we eagerly trigger and re-pick.
// 2. The TTS engine is "locked" until the first user gesture — we unlock with a silent utterance.
// 3. cancel() + speak() in the same tick can leave the engine wedged — we only cancel if speaking.

let cachedJaVoice = null
let unlocked = false

function pickJaVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  if (cachedJaVoice) return cachedJaVoice
  const voices = window.speechSynthesis.getVoices()
  if (!voices?.length) return null
  cachedJaVoice =
    voices.find((v) => v.lang === 'ja-JP') ||
    voices.find((v) => v.lang?.toLowerCase().startsWith('ja')) ||
    null
  return cachedJaVoice
}

function refreshVoices() {
  cachedJaVoice = null
  pickJaVoice()
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  // Trigger async voice load (some browsers populate lazily).
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices)
  // Older browsers (Safari) only support assigning the property:
  if (!window.speechSynthesis.addEventListener) {
    window.speechSynthesis.onvoiceschanged = refreshVoices
  }
}

// Call from the first user gesture to unlock iOS TTS.
export function unlockSpeech() {
  if (unlocked) return
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  try {
    const u = new SpeechSynthesisUtterance('')
    u.volume = 0
    u.rate = 1
    u.lang = 'ja-JP'
    window.speechSynthesis.speak(u)
    unlocked = true
  } catch {
    /* noop */
  }
}

export function speak(text, rate = 1) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve(false)
  }
  return new Promise((resolve) => {
    try {
      // Only cancel if currently speaking; cancelling on idle iOS can wedge the engine.
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel()
      }
      const u = new SpeechSynthesisUtterance(text)
      const voice = pickJaVoice()
      if (voice) u.voice = voice
      u.lang = 'ja-JP'
      u.rate = rate
      u.pitch = 1
      u.onend = () => resolve(true)
      u.onerror = () => resolve(false)
      // Speak synchronously — must stay inside the user gesture for iOS.
      window.speechSynthesis.speak(u)
      // iOS Safari occasionally pauses speechSynthesis after backgrounding;
      // a defensive resume() is harmless when not paused.
      try { window.speechSynthesis.resume() } catch {}
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

export function hasJapaneseVoice() {
  return !!pickJaVoice()
}
