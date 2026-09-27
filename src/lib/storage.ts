// localStorage can throw (private mode, blocked storage), so every access is guarded.

const PREFIX = 'ghc:'

export const storageKeys = {
  theme: 'theme',
  token: 'token',
  recent: 'recent',
} as const

export function readString(key: string): string | null {
  try {
    return localStorage.getItem(PREFIX + key)
  } catch {
    return null
  }
}

export function writeString(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(PREFIX + key)
    else localStorage.setItem(PREFIX + key, value)
  } catch {
    // Ignore: preferences are a convenience, not required state.
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  const raw = readString(key)
  if (raw === null) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJSON(key: string, value: unknown): void {
  writeString(key, JSON.stringify(value))
}
