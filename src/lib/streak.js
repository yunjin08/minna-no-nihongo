function dayDiff(a, b) {
  return Math.round((new Date(a) - new Date(b)) / 86400000)
}

export function calcStreak(studyDates) {
  if (!studyDates?.length) return 0
  const sorted = [...new Set(studyDates)].sort()
  const today = new Date().toISOString().slice(0, 10)
  const last = sorted[sorted.length - 1]
  const gap = dayDiff(today, last)
  if (gap > 1) return 0
  let streak = 1
  for (let i = sorted.length - 2; i >= 0; i--) {
    if (dayDiff(sorted[i + 1], sorted[i]) === 1) streak++
    else break
  }
  return streak
}
