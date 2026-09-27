import { useCallback, useSyncExternalStore } from 'react'
import { readJSON, storageKeys, writeJSON } from '../../lib/storage'

export interface RecentUser {
  login: string
  avatarUrl: string
}

const MAX_RECENT = 8
const listeners = new Set<() => void>()
let cache: RecentUser[] | null = null

function read(): RecentUser[] {
  if (cache === null) {
    const stored = readJSON<unknown>(storageKeys.recent, [])
    cache = Array.isArray(stored)
      ? stored.filter((u): u is RecentUser => typeof u?.login === 'string' && typeof u?.avatarUrl === 'string')
      : []
  }
  return cache
}

function write(next: RecentUser[]) {
  cache = next
  writeJSON(storageKeys.recent, next)
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function addRecentSearch(user: RecentUser) {
  const rest = read().filter((u) => u.login.toLowerCase() !== user.login.toLowerCase())
  write([user, ...rest].slice(0, MAX_RECENT))
}

/** Test hook: forget the in-memory copy so the next read hits storage. */
export function resetRecentSearchCache() {
  cache = null
}

export function useRecentSearches() {
  const recent = useSyncExternalStore(subscribe, read, read)
  const remove = useCallback((login: string) => write(read().filter((u) => u.login !== login)), [])
  const clear = useCallback(() => write([]), [])
  return { recent, remove, clear }
}
