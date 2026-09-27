import type { GitHubRepo, GitHubUser, RateLimit } from './types'
import { readString, storageKeys, writeString } from './storage'

export const API_BASE = 'https://api.github.com'
export const REPOS_PER_PAGE = 100
/** Hard cap on repo pages so one huge account can't drain the hourly quota. */
export const MAX_REPO_PAGES = 5

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class GitHubError extends Error {
  readonly status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'GitHubError'
    this.status = status
  }
}

export class NotFoundError extends GitHubError {
  constructor(message = 'Not found') {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}

export class RateLimitError extends GitHubError {
  /** Unix epoch ms when requests are allowed again. */
  readonly resetAt: number
  constructor(resetAt: number, status: number) {
    super('GitHub API rate limit exceeded', status)
    this.name = 'RateLimitError'
    this.resetAt = resetAt
  }
}

export class AuthError extends GitHubError {
  constructor() {
    super('The saved GitHub token was rejected', 401)
    this.name = 'AuthError'
  }
}

/** Errors that retrying won't fix. */
export function isPermanentError(error: unknown): boolean {
  return error instanceof NotFoundError || error instanceof RateLimitError || error instanceof AuthError
}

// ---------------------------------------------------------------------------
// Tiny external stores (token + rate limit), consumable via useSyncExternalStore
// ---------------------------------------------------------------------------

function createStore<T>(initial: T) {
  let value = initial
  const listeners = new Set<() => void>()
  return {
    get: () => value,
    set(next: T) {
      value = next
      listeners.forEach((l) => l())
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

export const rateLimitStore = createStore<RateLimit | null>(null)

export const tokenStore = createStore<string | null>(readString(storageKeys.token))

export function setToken(token: string | null) {
  const trimmed = token?.trim() || null
  writeString(storageKeys.token, trimmed)
  tokenStore.set(trimmed)
  // Quota differs per token, so the old reading no longer applies.
  rateLimitStore.set(null)
}

// ---------------------------------------------------------------------------
// Fetching
// ---------------------------------------------------------------------------

function readRateLimit(headers: Headers): RateLimit | null {
  const limit = headers.get('x-ratelimit-limit')
  const remaining = headers.get('x-ratelimit-remaining')
  const reset = headers.get('x-ratelimit-reset')
  if (limit === null || remaining === null || reset === null) return null
  return { limit: Number(limit), remaining: Number(remaining), resetAt: Number(reset) * 1000 }
}

/** Parse the `rel="next"` URL out of a GitHub `Link` header. */
export function parseNextLink(header: string | null): string | null {
  if (!header) return null
  for (const part of header.split(',')) {
    const match = part.match(/<([^>]+)>\s*;\s*rel="next"/)
    if (match) return match[1]
  }
  return null
}

interface GhResponse<T> {
  data: T
  headers: Headers
}

export async function ghFetch<T>(pathOrUrl: string, signal?: AbortSignal): Promise<GhResponse<T>> {
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : API_BASE + pathOrUrl
  // Never send the token anywhere but the GitHub API.
  if (!url.startsWith(API_BASE + '/')) throw new GitHubError(`Refusing to fetch ${url}`, 0)

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const token = tokenStore.get()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(url, { headers, signal })

  const rate = readRateLimit(res.headers)
  if (rate) rateLimitStore.set(rate)

  if (res.ok) return { data: (await res.json()) as T, headers: res.headers }

  if (res.status === 404) throw new NotFoundError()
  if (res.status === 401) throw new AuthError()
  if (res.status === 429 || (res.status === 403 && (rate?.remaining === 0 || res.headers.has('retry-after')))) {
    const retryAfter = Number(res.headers.get('retry-after'))
    const resetAt = retryAfter > 0 ? Date.now() + retryAfter * 1000 : (rate?.resetAt ?? Date.now() + 60_000)
    throw new RateLimitError(resetAt, res.status)
  }

  let message = `GitHub responded with ${res.status}`
  try {
    const body = (await res.json()) as { message?: string }
    if (body.message) message = body.message
  } catch {
    // Non-JSON error body; keep the generic message.
  }
  throw new GitHubError(message, res.status)
}

export async function getUser(login: string, signal?: AbortSignal): Promise<GitHubUser> {
  const { data } = await ghFetch<GitHubUser>(`/users/${encodeURIComponent(login)}`, signal)
  return data
}

export interface RepoList {
  repos: GitHubRepo[]
  /** True when the page cap stopped us before the last page. */
  truncated: boolean
}

export async function getRepos(login: string, signal?: AbortSignal): Promise<RepoList> {
  let next: string | null =
    `/users/${encodeURIComponent(login)}/repos?per_page=${REPOS_PER_PAGE}&sort=updated&type=owner`
  const repos: GitHubRepo[] = []
  let pages = 0

  while (next && pages < MAX_REPO_PAGES) {
    const { data, headers }: GhResponse<GitHubRepo[]> = await ghFetch<GitHubRepo[]>(next, signal)
    repos.push(...data)
    pages++
    next = parseNextLink(headers.get('link'))
  }

  return { repos, truncated: next !== null }
}
