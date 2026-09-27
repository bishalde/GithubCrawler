import type { GitHubRepo, GitHubUser } from './types'

export function totalStars(repos: GitHubRepo[]): number {
  return repos.reduce((sum, r) => sum + r.stargazers_count, 0)
}

export function totalForks(repos: GitHubRepo[]): number {
  return repos.reduce((sum, r) => sum + r.forks_count, 0)
}

export interface LanguageSlice {
  language: string
  count: number
  /** 0–1 share of repos that have a known primary language. */
  share: number
}

export const OTHER_LANGUAGE = 'Other'

/**
 * Count repos by primary language. Forks are excluded (they reflect someone
 * else's work). Languages past `limit` are folded into "Other".
 */
export function languageBreakdown(repos: GitHubRepo[], limit = 6): LanguageSlice[] {
  const counts = new Map<string, number>()
  for (const repo of repos) {
    if (repo.fork || !repo.language) continue
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1)
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0)
  if (total === 0) return []

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  const head = sorted.slice(0, limit)
  const rest = sorted.slice(limit).reduce((sum, [, c]) => sum + c, 0)
  if (rest > 0) head.push([OTHER_LANGUAGE, rest])

  return head.map(([language, count]) => ({ language, count, share: count / total }))
}

/** Most-starred non-fork repos, ties broken by most recently pushed. */
export function topRepos(repos: GitHubRepo[], n: number): GitHubRepo[] {
  return repos
    .filter((r) => !r.fork)
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        Date.parse(b.pushed_at ?? b.updated_at) - Date.parse(a.pushed_at ?? a.updated_at),
    )
    .slice(0, n)
}

/** Whole years (and remaining months) since the account was created. */
export function accountAge(createdAt: string, now: Date = new Date()): { years: number; months: number } {
  const created = new Date(createdAt)
  let months = (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth())
  if (now.getDate() < created.getDate()) months--
  months = Math.max(0, months)
  return { years: Math.floor(months / 12), months: months % 12 }
}

export type Winner = 'a' | 'b' | 'tie'

export function compareMetric(a: number, b: number): Winner {
  if (a === b) return 'tie'
  return a > b ? 'a' : 'b'
}

export interface ProfileMetrics {
  followers: number
  following: number
  publicRepos: number
  stars: number
  forks: number
  gists: number
}

export function profileMetrics(user: GitHubUser, repos: GitHubRepo[]): ProfileMetrics {
  return {
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    stars: totalStars(repos),
    forks: totalForks(repos),
    gists: user.public_gists,
  }
}

/** Count of non-fork repos created per calendar year, oldest first, with empty years filled in. */
export function reposPerYear(repos: GitHubRepo[]): { year: number; count: number }[] {
  const counts = new Map<number, number>()
  for (const r of repos) {
    if (r.fork) continue
    const year = new Date(r.created_at).getUTCFullYear()
    counts.set(year, (counts.get(year) ?? 0) + 1)
  }
  if (counts.size === 0) return []
  const years = [...counts.keys()]
  const result: { year: number; count: number }[] = []
  for (let y = Math.min(...years); y <= Math.max(...years); y++) result.push({ year: y, count: counts.get(y) ?? 0 })
  return result
}
