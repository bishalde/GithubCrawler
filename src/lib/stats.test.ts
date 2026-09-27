import { describe, expect, it } from 'vitest'
import { accountAge, compareMetric, languageBreakdown, topRepos, totalForks, totalStars } from './stats'
import { makeRepo } from '../test/fixtures'

describe('totals', () => {
  it('sums stars and forks', () => {
    const repos = [makeRepo({ stargazers_count: 3, forks_count: 1 }), makeRepo({ stargazers_count: 7, forks_count: 4 })]
    expect(totalStars(repos)).toBe(10)
    expect(totalForks(repos)).toBe(5)
    expect(totalStars([])).toBe(0)
  })
})

describe('languageBreakdown', () => {
  it('counts primary languages, skipping forks and nulls', () => {
    const repos = [
      makeRepo({ language: 'Go' }),
      makeRepo({ language: 'Go' }),
      makeRepo({ language: 'Rust' }),
      makeRepo({ language: 'Rust', fork: true }),
      makeRepo({ language: null }),
    ]
    expect(languageBreakdown(repos)).toEqual([
      { language: 'Go', count: 2, share: 2 / 3 },
      { language: 'Rust', count: 1, share: 1 / 3 },
    ])
  })

  it('folds languages beyond the limit into Other', () => {
    const repos = ['A', 'A', 'B', 'C', 'D'].map((language) => makeRepo({ language }))
    const result = languageBreakdown(repos, 2)
    expect(result.map((s) => [s.language, s.count])).toEqual([
      ['A', 2],
      ['B', 1],
      ['Other', 2],
    ])
  })

  it('returns empty for no languages', () => {
    expect(languageBreakdown([makeRepo({ language: null })])).toEqual([])
  })
})

describe('topRepos', () => {
  it('orders by stars, excludes forks, limits count', () => {
    const a = makeRepo({ stargazers_count: 5 })
    const b = makeRepo({ stargazers_count: 50 })
    const fork = makeRepo({ stargazers_count: 500, fork: true })
    const c = makeRepo({ stargazers_count: 1 })
    expect(topRepos([a, b, fork, c], 2)).toEqual([b, a])
  })

  it('does not mutate the input', () => {
    const repos = [makeRepo({ stargazers_count: 1 }), makeRepo({ stargazers_count: 2 })]
    const copy = [...repos]
    topRepos(repos, 2)
    expect(repos).toEqual(copy)
  })
})

describe('accountAge', () => {
  it('computes whole years and months', () => {
    expect(accountAge('2015-06-15T00:00:00Z', new Date('2024-09-20T00:00:00Z'))).toEqual({ years: 9, months: 3 })
    expect(accountAge('2015-06-15T00:00:00Z', new Date('2024-09-10T00:00:00Z'))).toEqual({ years: 9, months: 2 })
    expect(accountAge('2024-09-01T00:00:00Z', new Date('2024-09-02T00:00:00Z'))).toEqual({ years: 0, months: 0 })
  })
})

describe('compareMetric', () => {
  it('picks the larger side', () => {
    expect(compareMetric(3, 1)).toBe('a')
    expect(compareMetric(1, 3)).toBe('b')
    expect(compareMetric(2, 2)).toBe('tie')
  })
})

describe('reposPerYear', () => {
  it('buckets by creation year and fills gaps', async () => {
    const { reposPerYear } = await import('./stats')
    const repos = [
      makeRepo({ created_at: '2019-02-01T00:00:00Z' }),
      makeRepo({ created_at: '2021-05-01T00:00:00Z' }),
      makeRepo({ created_at: '2021-12-31T00:00:00Z' }),
      makeRepo({ created_at: '2018-01-01T00:00:00Z', fork: true }),
    ]
    expect(reposPerYear(repos)).toEqual([
      { year: 2019, count: 1 },
      { year: 2020, count: 0 },
      { year: 2021, count: 2 },
    ])
    expect(reposPerYear([])).toEqual([])
  })
})
