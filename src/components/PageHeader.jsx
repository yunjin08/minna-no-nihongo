import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PageHeader({ title, subtitle, right, back = true }) {
  const nav = useNavigate()
  return (
    <header className="sticky top-0 z-20 bg-bg/85 backdrop-blur-md border-b border-line">
      <div
        className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        {back && (
          <button onClick={() => nav(-1)} className="btn-icon" aria-label="Back">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{title}</div>
          {subtitle && <div className="text-xs text-muted truncate">{subtitle}</div>}
        </div>
        {right}
      </div>
    </header>
  )
}
