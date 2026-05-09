// Platform detection + beforeinstallprompt capture for the PWA install drive.

const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''

export const isIOS = /iPad|iPhone|iPod/.test(ua) && !window?.MSStream
export const isAndroid = /Android/i.test(ua)
export const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/i.test(ua)
export const isIOSChrome = isIOS && /CriOS/i.test(ua)
export const isIOSFirefox = isIOS && /FxiOS/i.test(ua)

export function isStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

let deferredPrompt = null
const listeners = new Set()

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    listeners.forEach((cb) => cb(true))
  })
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    listeners.forEach((cb) => cb(false))
  })
}

export function hasNativePrompt() {
  return !!deferredPrompt
}

export function onNativePromptChange(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export async function triggerNativePrompt() {
  if (!deferredPrompt) return false
  try {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    deferredPrompt = null
    listeners.forEach((cb) => cb(false))
    return outcome === 'accepted'
  } catch {
    return false
  }
}

export function detectPlatform() {
  if (isStandalone()) return 'installed'
  if (isIOS && (isIOSChrome || isIOSFirefox)) return 'ios-other-browser'
  if (isIOS) return 'ios-safari'
  if (isAndroid) return 'android'
  return 'desktop'
}
