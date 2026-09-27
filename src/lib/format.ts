const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const full = new Intl.NumberFormat('en')
const dateFmt = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' })
const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function formatCompact(n: number): string {
  return n < 1000 ? full.format(n) : compact.format(n)
}

export function formatNumber(n: number): string {
  return full.format(n)
}

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso))
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
]

export function formatRelative(iso: string | number, now: number = Date.now()): string {
  const then = typeof iso === 'number' ? iso : Date.parse(iso)
  const seconds = Math.round((then - now) / 1000)
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit)
  }
  return relative.format(seconds, 'second')
}

/** Ensure a user-entered blog value is a navigable URL. */
export function normalizeUrl(value: string | null | undefined): string | null {
  const v = value?.trim()
  if (!v) return null
  const url = /^https?:\/\//i.test(v) ? v : `https://${v}`
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : null
  } catch {
    return null
  }
}

export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}
