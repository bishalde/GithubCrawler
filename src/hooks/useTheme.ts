import { useCallback, useSyncExternalStore } from 'react'
import { readString, storageKeys, writeString } from '../lib/storage'

export type Theme = 'light' | 'dark'

const listeners = new Set<() => void>()

function currentTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  listeners.forEach((l) => l())
}

// Follow OS changes until the user picks a theme explicitly.
if (typeof window !== 'undefined' && window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!readString(storageKeys.theme)) applyTheme(e.matches ? 'dark' : 'light')
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => 'dark' as Theme)
  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
    writeString(storageKeys.theme, next)
    applyTheme(next)
  }, [])
  return { theme, toggle }
}
