export default function ProgressBar({ value = 0, total = 1, className = '', showLabel = false }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className={className}>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent2 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-muted">
          {value}/{total} ({pct}%)
        </div>
      )}
    </div>
  )
}
