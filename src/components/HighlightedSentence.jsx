export default function HighlightedSentence({ sentence, focal }) {
  if (!focal) return <span>{sentence.romaji}</span>
  const escaped = focal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(${escaped})`, 'gi')
  const parts = sentence.romaji.split(re)
  return (
    <div>
      <p className="text-base leading-relaxed">
        {parts.map((p, i) =>
          re.test(p) ? (
            <span key={i} className="font-bold text-accent2 underline decoration-accent/40 decoration-2 underline-offset-4">
              {p}
            </span>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
      </p>
      <p className="text-sm text-muted italic mt-1">{sentence.english}</p>
    </div>
  )
}
