import data from '../data/hiragana.json'

export const hiraRows = data.rows

export const hiraWords = data.words

export const hiraAllChars = hiraRows.flatMap((r) =>
  r.characters.map((c) => ({ ...c, rowId: r.id, rowName: r.name, rowLabel: r.label })),
)

export const totalHiraCount = hiraAllChars.length

export const totalWordCount = hiraWords.length

export function getRow(id) {
  if (id === 'all') {
    return {
      id: 'all',
      name: 'All Characters',
      label: 'ぜんぶ',
      group: 'all',
      characters: hiraAllChars,
    }
  }
  return hiraRows.find((r) => r.id === id) ?? null
}

export function getChar(charId) {
  return hiraAllChars.find((c) => c.id === charId) ?? null
}

export function getWord(wordId) {
  return hiraWords.find((w) => w.id === wordId) ?? null
}

export function rowStats(rowId, learnedSet) {
  const row = getRow(rowId)
  if (!row) return { learned: 0, total: 0 }
  const total = row.characters.length
  const learned = row.characters.reduce((acc, c) => acc + (learnedSet.has(c.id) ? 1 : 0), 0)
  return { learned, total }
}
