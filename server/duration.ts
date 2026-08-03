/** Render a millisecond duration as a short human string, e.g. "340ms" / "1.2s". */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) {
    throw new Error(`formatDuration: invalid duration ${ms}`)
  }
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(1)}s`
}
