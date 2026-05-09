import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ProgressBar from './ProgressBar.jsx'

export default function ChapterCard({ chapter, learned, total }) {
  return (
    <Link
      to={`/chapter/${chapter.id}`}
      className="glow-card p-5 flex flex-col gap-3 group"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">
            {chapter.name}
          </div>
          <div className="font-script text-3xl text-accent2 leading-none mt-1">
            {chapter.code}
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition" />
      </div>
      <div className="text-sm text-muted">{total} words</div>
      <ProgressBar value={learned} total={total} />
      <div className="text-xs text-muted">
        {learned}/{total} learned
      </div>
    </Link>
  )
}
