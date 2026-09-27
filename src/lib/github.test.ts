import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  AuthError,
  GitHubError,
  MAX_REPO_PAGES,
  NotFoundError,
  RateLimitError,
  getRepos,
  getUser,
  parseNextLink,
  rateLimitStore,
  setToken,
} from './github'
import { makeRepo, makeUser } from '../test/fixtures'

function jsonResponse(body: unknown, init: { status?: number; headers?: Record<string, string> } = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { 'content-type': 'application/json', ...init.headers },
  })
}

const rateHeaders = (remaining: number, reset = 1_700_000_000) => ({
  'x-ratelimit-limit': '60',
  'x-ratelimit-remaining': String(remaining),
  'x-ratelimit-reset': String(reset),
})

const fetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
  setToken(null)
})

afterEach(() => {
  fetchMock.mockReset()
  vi.unstubAllGlobals()
})

describe('parseNextLink', () => {
  it('extracts the next URL', () => {
    const header =
      '<https://api.github.com/user/1/repos?page=2>; rel="next", <https://api.github.com/user/1/repos?page=5>; rel="last"'
    expect(parseNextLink(header)).toBe('https://api.github.com/user/1/repos?page=2')
  })
  it('returns null when there is no next', () => {
    expect(parseNextLink('<https://api.github.com/x?page=1>; rel="prev"')).toBeNull()
    expect(parseNextLink(null)).toBeNull()
  })
})

describe('getUser', () => {
  it('fetches the user and records the rate limit', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(makeUser({ login: 'octo' }), { headers: rateHeaders(42) }))
    const user = await getUser('octo')
    expect(user.login).toBe('octo')
    expect(String(fetchMock.mock.calls[0][0])).toBe('https://api.github.com/users/octo')
    expect(rateLimitStore.get()).toEqual({ limit: 60, remaining: 42, resetAt: 1_700_000_000_000 })
  })

  it('sends the saved token as a bearer header', async () => {
    setToken('  ghp_secret  ')
    fetchMock.mockResolvedValueOnce(jsonResponse(makeUser()))
    await getUser('octo')
    const headers = fetchMock.mock.calls[0][1]?.headers as Record<string, string>
    expect(headers.Authorization).toBe('Bearer ghp_secret')
  })

  it('omits the auth header without a token', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(makeUser()))
    await getUser('octo')
    const headers = fetchMock.mock.calls[0][1]?.headers as Record<string, string>
    expect(headers.Authorization).toBeUndefined()
  })

  it('maps 404 to NotFoundError', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'Not Found' }, { status: 404 }))
    await expect(getUser('nobody')).rejects.toBeInstanceOf(NotFoundError)
  })

  it('maps 401 to AuthError', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'Bad credentials' }, { status: 401 }))
    await expect(getUser('octo')).rejects.toBeInstanceOf(AuthError)
  })

  it('maps an exhausted 403 to RateLimitError with the reset time', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'rate limit' }, { status: 403, headers: rateHeaders(0, 1_800_000_000) }))
    const err = await getUser('octo').catch((e: unknown) => e)
    expect(err).toBeInstanceOf(RateLimitError)
    expect((err as RateLimitError).resetAt).toBe(1_800_000_000_000)
  })

  it('maps other failures to GitHubError with the API message', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'Server exploded' }, { status: 500 }))
    const err = await getUser('octo').catch((e: unknown) => e)
    expect(err).toBeInstanceOf(GitHubError)
    expect(err).not.toBeInstanceOf(RateLimitError)
    expect((err as GitHubError).message).toBe('Server exploded')
  })

  it('encodes the login in the path', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(makeUser()))
    await getUser('a/b')
    expect(String(fetchMock.mock.calls[0][0])).toBe('https://api.github.com/users/a%2Fb')
  })
})

describe('getRepos', () => {
  const page = (n: number) => `https://api.github.com/user/1/repos?per_page=100&page=${n}`

  it('follows Link headers across pages', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse([makeRepo(), makeRepo()], { headers: { link: `<${page(2)}>; rel="next"` } }))
      .mockResolvedValueOnce(jsonResponse([makeRepo()]))
    const result = await getRepos('octo')
    expect(result.repos).toHaveLength(3)
    expect(result.truncated).toBe(false)
    expect(String(fetchMock.mock.calls[0][0])).toContain('/users/octo/repos?per_page=100')
    expect(String(fetchMock.mock.calls[1][0])).toBe(page(2))
  })

  it('stops at the page cap and reports truncation', async () => {
    fetchMock.mockImplementation(async () => jsonResponse([makeRepo()], { headers: { link: `<${page(99)}>; rel="next"` } }))
    const result = await getRepos('octo')
    expect(fetchMock).toHaveBeenCalledTimes(MAX_REPO_PAGES)
    expect(result.repos).toHaveLength(MAX_REPO_PAGES)
    expect(result.truncated).toBe(true)
  })

  it('refuses to follow a next link to another host', async () => {
    setToken('ghp_secret')
    fetchMock.mockResolvedValueOnce(
      jsonResponse([makeRepo()], { headers: { link: '<https://evil.example.com/steal>; rel="next"' } }),
    )
    await expect(getRepos('octo')).rejects.toBeInstanceOf(GitHubError)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
