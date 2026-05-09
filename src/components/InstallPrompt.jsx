import { useEffect, useState } from 'react'
import {
  X,
  Share,
  PlusSquare,
  MoreVertical,
  Download,
  Sparkles,
  AppWindow,
  Compass,
} from 'lucide-react'
import {
  detectPlatform,
  hasNativePrompt,
  onNativePromptChange,
  triggerNativePrompt,
} from '../lib/install.js'
import { useStore } from '../lib/store.js'

const SESSION_KEY = 'mnn-install-session-dismissed'

export default function InstallPrompt() {
  const dismissed = useStore((s) => s.settings.installPromptDismissed)
  const updateSetting = useStore((s) => s.updateSetting)

  const [open, setOpen] = useState(false)
  const [platform, setPlatform] = useState('desktop')
  const [nativeAvailable, setNativeAvailable] = useState(hasNativePrompt())

  useEffect(() => {
    const p = detectPlatform()
    setPlatform(p)
    if (p === 'installed') return
    if (dismissed) return
    if (sessionStorage.getItem(SESSION_KEY) === '1') return
    const t = setTimeout(() => setOpen(true), 1200)
    return () => clearTimeout(t)
  }, [dismissed])

  useEffect(() => onNativePromptChange(setNativeAvailable), [])

  // Listen for explicit "show install" requests (from Settings).
  useEffect(() => {
    const handler = () => {
      sessionStorage.removeItem(SESSION_KEY)
      setPlatform(detectPlatform())
      setOpen(true)
    }
    window.addEventListener('mnn:show-install', handler)
    return () => window.removeEventListener('mnn:show-install', handler)
  }, [])

  function dismissSession() {
    sessionStorage.setItem(SESSION_KEY, '1')
    setOpen(false)
  }

  function dismissForever() {
    updateSetting('installPromptDismissed', true)
    setOpen(false)
  }

  async function installNow() {
    const ok = await triggerNativePrompt()
    if (ok) setOpen(false)
  }

  if (!open || platform === 'installed') return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismissSession}
      />
      <div className="relative w-full sm:max-w-md sm:m-4 bg-surface border border-line sm:rounded-2xl rounded-t-3xl shadow-glowStrong overflow-hidden">
        <div className="absolute inset-0 bg-card-glow opacity-60 pointer-events-none" />
        <button
          onClick={dismissSession}
          className="absolute top-3 right-3 btn-icon w-9 h-9 z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="relative p-6 sm:p-7">
          <div className="inline-flex items-center gap-2 pill text-accent2 border-accent/20 bg-accent/5 mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Install as an app
          </div>
          <h2 id="install-title" className="text-2xl font-bold leading-tight">
            Add{' '}
            <span className="font-script italic font-medium text-accent2 text-3xl">
              Minna
            </span>{' '}
            to your home screen
          </h2>
          <p className="mt-2 text-sm text-muted">
            Works offline, launches fullscreen, no app store needed.
          </p>

          <div className="mt-5">
            {platform === 'ios-safari' && <IOSSafariInstructions />}
            {platform === 'ios-other-browser' && <IOSOtherBrowserNotice />}
            {platform === 'android' && (
              <AndroidInstructions native={nativeAvailable} onInstall={installNow} />
            )}
            {platform === 'desktop' && (
              <DesktopInstructions native={nativeAvailable} onInstall={installNow} />
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={dismissForever}
              className="text-xs text-muted underline underline-offset-4 hover:text-ink"
            >
              Don't show this again
            </button>
            <button onClick={dismissSession} className="btn-ghost">
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step({ n, icon: Icon, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center text-xs font-semibold shrink-0">
        {n}
      </div>
      <div className="text-sm leading-relaxed pt-0.5 flex-1">
        {children}
        {Icon && (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/5 border border-line ml-1 align-middle">
            <Icon className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </div>
  )
}

function IOSSafariInstructions() {
  return (
    <div className="space-y-3">
      <Step n={1} icon={Share}>
        Tap the <strong>Share</strong> button at the bottom of Safari
      </Step>
      <Step n={2} icon={PlusSquare}>
        Scroll down and tap <strong>Add to Home Screen</strong>
      </Step>
      <Step n={3}>Tap <strong>Add</strong> in the top-right</Step>
    </div>
  )
}

function IOSOtherBrowserNotice() {
  return (
    <div className="rounded-xl border border-warn/30 bg-warn/5 p-4 text-sm">
      <div className="flex items-center gap-2 text-warn font-semibold mb-1">
        <Compass className="w-4 h-4" /> Open in Safari
      </div>
      <p className="text-muted leading-relaxed">
        On iPhone and iPad, only <strong>Safari</strong> can install web apps to
        the home screen. Copy this URL and open it in Safari, then tap{' '}
        <strong>Share → Add to Home Screen</strong>.
      </p>
    </div>
  )
}

function AndroidInstructions({ native, onInstall }) {
  if (native) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted">
          Tap the button below to install Minna directly:
        </p>
        <button onClick={onInstall} className="btn-glow w-full">
          <Download className="w-4 h-4" /> Install app
        </button>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      <Step n={1} icon={MoreVertical}>
        Tap the <strong>menu</strong> (three dots) in Chrome
      </Step>
      <Step n={2}>
        Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>
      </Step>
      <Step n={3}>Confirm <strong>Install</strong></Step>
    </div>
  )
}

function DesktopInstructions({ native, onInstall }) {
  if (native) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted">
          Click below to install Minna as a desktop app:
        </p>
        <button onClick={onInstall} className="btn-glow w-full">
          <Download className="w-4 h-4" /> Install app
        </button>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      <Step n={1} icon={AppWindow}>
        Look for the <strong>install icon</strong> on the right side of your address bar
      </Step>
      <Step n={2}>
        Or open the browser menu and choose <strong>Install Minna no Nihongo…</strong>
      </Step>
      <p className="text-xs text-muted pt-1">
        Works in Chrome, Edge, Brave, and Arc.
      </p>
    </div>
  )
}
