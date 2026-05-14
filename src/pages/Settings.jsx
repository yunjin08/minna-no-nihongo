import { useEffect, useState } from 'react'
import { Moon, Sun, Trash2, Info, Smartphone, AlertTriangle } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import { useStore } from '../lib/store.js'
import { hasJapaneseVoice, isSpeechSupported } from '../lib/speech.js'
import { isIOS, isStandalone } from '../lib/install.js'

export default function Settings() {
  const settings = useStore((s) => s.settings)
  const updateSetting = useStore((s) => s.updateSetting)
  const clearAll = useStore((s) => s.clearAll)
  const [storageInfo, setStorageInfo] = useState(null)
  const [voiceMissing, setVoiceMissing] = useState(false)

  useEffect(() => {
    if (navigator.storage?.estimate) {
      navigator.storage.estimate().then((info) => {
        setStorageInfo({
          usedKb: Math.round((info.usage || 0) / 1024),
          quotaMb: Math.round((info.quota || 0) / 1048576),
        })
      })
    }
  }, [])

  useEffect(() => {
    if (!isSpeechSupported()) return
    const check = () => setVoiceMissing(!hasJapaneseVoice())
    check()
    // Voices may arrive async; re-check on the event.
    window.speechSynthesis.addEventListener?.('voiceschanged', check)
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', check)
  }, [])

  function handleClear() {
    if (confirm('Clear all progress, learned words, and quiz history? This cannot be undone.')) {
      clearAll()
      alert('Progress cleared.')
    }
  }

  return (
    <div>
      <PageHeader title="Settings" back={false} />
      <main className="max-w-3xl mx-auto px-4 pt-4 pb-24 space-y-6">
        <section className="glow-card p-5 space-y-4">
          <h2 className="font-semibold">Appearance</h2>
          <Row label="Dark mode" hint="Recommended for the HackerRank vibe">
            <Toggle
              value={settings.darkMode}
              onChange={(v) => updateSetting('darkMode', v)}
              iconOn={Moon}
              iconOff={Sun}
            />
          </Row>
          <Row label="Font size">
            <RadioGroup
              value={settings.fontSize}
              onChange={(v) => updateSetting('fontSize', v)}
              options={[
                { v: 'small', l: 'Small' },
                { v: 'medium', l: 'Medium' },
                { v: 'large', l: 'Large' },
              ]}
            />
          </Row>
        </section>

        <section className="glow-card p-5 space-y-4">
          <h2 className="font-semibold">Audio</h2>
          <Row label="Audio speed" hint={`${settings.audioSpeed.toFixed(2)}x`}>
            <RadioGroup
              value={String(settings.audioSpeed)}
              onChange={(v) => updateSetting('audioSpeed', Number(v))}
              options={[
                { v: '0.75', l: '0.75x' },
                { v: '1', l: '1x' },
                { v: '1.25', l: '1.25x' },
              ]}
            />
          </Row>
          <Row
            label="Auto-play in word detail"
            hint="Plays pronunciation when opening a word"
          >
            <Toggle
              value={settings.autoPlay}
              onChange={(v) => updateSetting('autoPlay', v)}
            />
          </Row>
          <p className="text-xs text-muted leading-relaxed">
            Audio uses your device's built-in Japanese voice (Web Speech API).
            Voice quality depends on your operating system.
          </p>
          {voiceMissing && (
            <div className="rounded-xl border border-warn/30 bg-warn/5 p-3 text-xs leading-relaxed">
              <div className="flex items-center gap-2 text-warn font-semibold mb-1">
                <AlertTriangle className="w-4 h-4" /> No Japanese voice detected
              </div>
              {isIOS ? (
                <p className="text-muted">
                  On iPhone/iPad, install a Japanese voice in:{' '}
                  <strong>Settings → Accessibility → Spoken Content → Voices → Japanese</strong>.
                  Pick any voice (e.g. Kyoko or Otoya). Then reopen this app.
                </p>
              ) : (
                <p className="text-muted">
                  Install a Japanese voice pack from your operating system's
                  language/accessibility settings, then reload the app.
                </p>
              )}
            </div>
          )}
        </section>

        <section className="glow-card p-5 space-y-4">
          <h2 className="font-semibold">Install</h2>
          <div className="text-sm text-muted">
            {isStandalone()
              ? 'Minna is installed and running in standalone mode. Nice.'
              : 'Add Minna to your home screen for fullscreen, offline-ready access.'}
          </div>
          {!isStandalone() && (
            <button
              onClick={() => {
                updateSetting('installPromptDismissed', false)
                window.dispatchEvent(new Event('mnn:show-install'))
              }}
              className="btn-ghost"
            >
              <Smartphone className="w-4 h-4" /> Show install instructions
            </button>
          )}
        </section>

        <section className="glow-card p-5 space-y-4">
          <h2 className="font-semibold">Data</h2>
          {storageInfo && (
            <p className="text-xs text-muted">
              Local storage: ~{storageInfo.usedKb} KB used of {storageInfo.quotaMb} MB available.
            </p>
          )}
          <button onClick={handleClear} className="btn-ghost text-danger border-danger/30 hover:bg-danger/10">
            <Trash2 className="w-4 h-4" /> Clear all progress
          </button>
        </section>

        <section className="glow-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-accent" />
            <h2 className="font-semibold">About</h2>
          </div>
          <div className="text-sm text-muted leading-relaxed space-y-1">
            <p>Minna no Nihongo — Interactive Study Guide v0.1.0</p>
            <p className="font-medium text-ink">Created by</p>
            <ul className="space-y-0.5 pl-3 border-l border-accent/30">
              {['Jed Donaire', 'Levi Bacarra', 'Jeric Rulete', 'Maxell Milay'].map((name) => (
                <li key={name} className="text-sm">{name}</li>
              ))}
            </ul>
            <p>Course: Japanese 10 — UP Cebu, Prof. Ma. Rosario Ballescas</p>
            <p>Data source: Minna no Nihongo I, 2nd Edition (Romanized Version)</p>
          </div>
        </section>
      </main>
    </div>
  )
}

function Row({ label, hint, children }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted">{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}

function Toggle({ value, onChange, iconOn, iconOff }) {
  const On = iconOn
  const Off = iconOff
  return (
    <button
      onClick={() => onChange(!value)}
      role="switch"
      aria-checked={value}
      className={`relative w-14 h-8 rounded-full transition border ${
        value ? 'bg-accent border-accent' : 'bg-white/5 border-line'
      }`}
    >
      <span
        className={`absolute top-1 w-6 h-6 rounded-full bg-bg shadow flex items-center justify-center transition-all ${
          value ? 'left-7' : 'left-1'
        }`}
      >
        {value && On ? (
          <On className="w-3 h-3 text-accent" />
        ) : Off ? (
          <Off className="w-3 h-3 text-muted" />
        ) : null}
      </span>
    </button>
  )
}

function RadioGroup({ value, onChange, options }) {
  return (
    <div className="flex rounded-xl border border-line overflow-hidden">
      {options.map(({ v, l }) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`px-3 py-2 text-sm transition ${
            value === v ? 'bg-accent text-bg font-medium' : 'bg-surface text-muted hover:bg-surface2'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
