import { useQuery } from '@tanstack/react-query'
import { useSyncExternalStore } from 'react'
import { getRepos, getUser, rateLimitStore, tokenStore } from '../lib/github'

export const userQueryKey = (login: string) => ['user', login.toLowerCase()] as const
export const reposQueryKey = (login: string) => ['repos', login.toLowerCase()] as const

export function useUser(login: string | undefined) {
  return useQuery({
    queryKey: userQueryKey(login ?? ''),
    queryFn: ({ signal }) => getUser(login!, signal),
    enabled: !!login,
  })
}

export function useRepos(login: string | undefined, enabled = true) {
  return useQuery({
    queryKey: reposQueryKey(login ?? ''),
    queryFn: ({ signal }) => getRepos(login!, signal),
    enabled: !!login && enabled,
  })
}

export function useRateLimit() {
  return useSyncExternalStore(rateLimitStore.subscribe, rateLimitStore.get)
}

export function useToken() {
  return useSyncExternalStore(tokenStore.subscribe, tokenStore.get)
}
