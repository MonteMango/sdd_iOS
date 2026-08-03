/**
 * duration.ts — formatDuration(ms): render a millisecond duration as a short
 * human string. Scratch-log-walkthrough spec AC-01..AC-06.
 */
import { describe, it, expect } from 'bun:test'
import { formatDuration } from '../duration.ts'

describe('formatDuration', () => {
  it('renders sub-second durations as milliseconds (AC-01)', () => {
    expect(formatDuration(340)).toBe('340ms')
  })

  it('renders durations >= 1000ms as seconds with one decimal (AC-02)', () => {
    expect(formatDuration(1234)).toBe('1.2s')
  })

  it('throws naming the invalid input on a negative or non-finite duration (AC-03)', () => {
    expect(() => formatDuration(-5)).toThrow(/-5/)
    expect(() => formatDuration(NaN)).toThrow(/NaN/)
    expect(() => formatDuration(Infinity)).toThrow(/Infinity/)
  })

  it('renders exactly 0ms as "0ms" (AC-05)', () => {
    expect(formatDuration(0)).toBe('0ms')
  })

  it('renders exactly the 1000ms boundary as seconds, not milliseconds (AC-06)', () => {
    expect(formatDuration(1000)).toBe('1.0s')
  })
})
