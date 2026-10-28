import { matchingStages } from './matching'

// Illustrative sample data for the matching simulation. None of it is real: 160 invented
// reports, laid out newest first, each removed by at most one of the seven backend criteria.
// The per-stage counts are chosen for teaching and say nothing about production volumes.
export const sampleSize = 160
export const stageCount = matchingStages.length
export const candidateLimit = 20

// How many records each of stages 1-6 removes. Stage 7 (the limit) removes whatever is left
// beyond the newest 20, so it is derived rather than listed.
const removedByStage = [76, 18, 14, 19, 2, 5]

export type SampleRecord = {
  // Position, newest first: 0 is the most recently created report.
  index: number
  // The stage (1-7) that removes this record, or null if it survives every stage.
  removedAt: number | null
}

// Small deterministic generator so the sample is identical on every visit.
function shuffled(length: number, seed: number) {
  const order = Array.from({ length }, (_, index) => index)
  let state = seed
  for (let i = order.length - 1; i > 0; i--) {
    state = (state * 16807) % 2147483647
    const j = state % (i + 1)
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

function buildRecords(): SampleRecord[] {
  const records: SampleRecord[] = Array.from({ length: sampleSize }, (_, index) => ({ index, removedAt: null }))
  const order = shuffled(sampleSize, 20260)
  let cursor = 0
  removedByStage.forEach((count, stageIndex) => {
    for (const position of order.slice(cursor, cursor + count)) records[position].removedAt = stageIndex + 1
    cursor += count
  })
  // Stage 7: of the records still standing, only the newest 20 stay.
  records.filter((record) => record.removedAt === null).forEach((record, rank) => {
    if (rank >= candidateLimit) record.removedAt = stageCount
  })
  return records
}

export const sampleRecords = buildRecords()

// A record is still standing after `stage` stages (0 = before any filter).
export const isRetained = (record: SampleRecord, stage: number) => record.removedAt === null || record.removedAt > stage

// Counts for stages 0..7: how many records remain after each.
export const remainingCounts = Array.from({ length: stageCount + 1 }, (_, stage) => sampleRecords.filter((record) => isRetained(record, stage)).length)

// The report the sample is matched against. Illustrative.
export const sampleQuery = { kind: 'Lost', item: 'black backpack', category: 'Bags', university: 'University A' }
