import { describe, expect, it } from 'vitest'
import { DEFAULT_FILTERS, filterRepos, filtersFromParams, filtersToParams, repoLanguages } from './filterRepos'
import { makeRepo } from '../../test/fixtures'

const repos = [
  makeRepo({ name: 'beta', stargazers_count: 10, forks_count: 1, language: 'Go', pushed_at: '2024-03-01T00:00:00Z' }),
  makeRepo({ name: 'Alpha', stargazers_count: 2, forks_count: 9, language: 'Rust', description: 'CLI tool', pushed_at: '2024-05-01T00:00:00Z' }),
  makeRepo({ name: 'gamma', stargazers_count: 30, fork: true, language: 'Go', pushed_at: '2023-01-01T00:00:00Z' }),
  makeRepo({ name: 'delta', stargazers_count: 0, archived: true, language: null, topics: ['cli'], pushed_at: '2022-01-01T00:00:00Z' }),
]
const names = (list: typeof repos) => list.map((r) => r.name)

describe('filterRepos', () => {
  it('sorts by stars by default', () => {
    expect(names(filterRepos(repos, DEFAULT_FILTERS))).toEqual(['gamma', 'beta', 'Alpha', 'delta'])
  })

  it('supports other sorts', () => {
    expect(names(filterRepos(repos, { ...DEFAULT_FILTERS, sort: 'name' }))).toEqual(['Alpha', 'beta', 'delta', 'gamma'])
    expect(names(filterRepos(repos, { ...DEFAULT_FILTERS, sort: 'updated' }))).toEqual(['Alpha', 'beta', 'gamma', 'delta'])
    expect(names(filterRepos(repos, { ...DEFAULT_FILTERS, sort: 'forks' }))[0]).toBe('Alpha')
  })

  it('matches query against name, description and topics', () => {
    expect(names(filterRepos(repos, { ...DEFAULT_FILTERS, query: 'cli' }))).toEqual(['Alpha', 'delta'])
    expect(names(filterRepos(repos, { ...DEFAULT_FILTERS, query: '  BETA ' }))).toEqual(['beta'])
  })

  it('filters by language, forks and archived', () => {
    expect(names(filterRepos(repos, { ...DEFAULT_FILTERS, language: 'Go' }))).toEqual(['gamma', 'beta'])
    expect(names(filterRepos(repos, { ...DEFAULT_FILTERS, hideForks: true, hideArchived: true }))).toEqual(['beta', 'Alpha'])
  })

  it('does not mutate the input', () => {
    const before = names(repos)
    filterRepos(repos, { ...DEFAULT_FILTERS, sort: 'name' })
    expect(names(repos)).toEqual(before)
  })
})

describe('repoLanguages', () => {
  it('lists languages by frequency', () => {
    expect(repoLanguages(repos)).toEqual(['Go', 'Rust'])
  })
})

describe('URL param round-trip', () => {
  it('omits defaults and preserves other params', () => {
    const params = filtersToParams(DEFAULT_FILTERS, new URLSearchParams('tab=repos'))
    expect(params.toString()).toBe('tab=repos')
  })

  it('round-trips non-default filters', () => {
    const f = { query: 'cli', sort: 'updated' as const, language: 'Go', hideForks: true, hideArchived: true }
    expect(filtersFromParams(filtersToParams(f, new URLSearchParams()))).toEqual(f)
  })

  it('falls back on an invalid sort', () => {
    expect(filtersFromParams(new URLSearchParams('sort=bogus')).sort).toBe('stars')
  })
})
