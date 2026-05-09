import vocab from '../data/vocabulary.json'

export const chapters = vocab.chapters

export const allWords = chapters.flatMap((c) =>
  c.words.map((w) => ({ ...w, chapterId: c.id, chapterCode: c.code })),
)

export const totalWordCount = allWords.length

export function getChapter(id) {
  return chapters.find((c) => c.id === Number(id))
}

export function getWord(wordId) {
  for (const c of chapters) {
    const w = c.words.find((w) => w.id === wordId)
    if (w) return { ...w, chapterId: c.id, chapterCode: c.code, chapterName: c.name }
  }
  return null
}

export function chapterStats(chapterId, learnedSet) {
  const c = getChapter(chapterId)
  if (!c) return { learned: 0, total: 0 }
  const total = c.words.length
  const learned = c.words.reduce((acc, w) => acc + (learnedSet.has(w.id) ? 1 : 0), 0)
  return { learned, total }
}

export function findSentencesForWord(chapterId, romaji) {
  const c = getChapter(chapterId)
  if (!c?.sentences) return []
  const target = romaji.toLowerCase()
  const tokens = target.split(/\s+/).filter(Boolean)
  return c.sentences.filter((s) => {
    const lower = s.romaji.toLowerCase()
    if (lower.includes(target)) return true
    if (tokens.length > 0 && tokens.every((t) => lower.includes(t))) return true
    return false
  })
}
