import data from '../data/adjectives.json'

export const adjectives = data.adjectives

export const iAdjectives  = adjectives.filter((a) => a.type === 'i')
export const naAdjectives = adjectives.filter((a) => a.type === 'na')

export function getAdjective(id) {
  return adjectives.find((a) => a.id === id) ?? null
}

/**
 * Returns the four conjugation rows for a given adjective.
 * Each row: { label, tense, polarity, form, example }
 */
export function getConjugations(adj) {
  if (adj.type === 'i') {
    const s = adj.stem
    return [
      { label: 'Present  (+)', tense: 'present', polarity: 'pos', form: `${s}i desu`,           example: adj.examples.presentPos },
      { label: 'Present  (−)', tense: 'present', polarity: 'neg', form: `${s}kunai desu`,        example: adj.examples.presentNeg },
      { label: 'Past  (+)',    tense: 'past',    polarity: 'pos', form: `${s}katta desu`,         example: adj.examples.pastPos },
      { label: 'Past  (−)',   tense: 'past',    polarity: 'neg', form: `${s}kunakatta desu`,     example: adj.examples.pastNeg },
    ]
  }
  // na-adjective
  const r = adj.romaji
  return [
    { label: 'Present  (+)', tense: 'present', polarity: 'pos', form: `${r} desu`,                    example: adj.examples.presentPos },
    { label: 'Present  (−)', tense: 'present', polarity: 'neg', form: `${r} ja arimasen`,             example: adj.examples.presentNeg },
    { label: 'Past  (+)',    tense: 'past',    polarity: 'pos', form: `${r} deshita`,                  example: adj.examples.pastPos },
    { label: 'Past  (−)',   tense: 'past',    polarity: 'neg', form: `${r} ja arimasendeshita`,       example: adj.examples.pastNeg },
  ]
}
