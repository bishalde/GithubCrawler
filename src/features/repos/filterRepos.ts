import type { GitHubRepo } from '../../lib/types'

export type RepoSort = 'stars' | 'updated' | 'name' | 'forks'

export const REPO_SORTS: { value: RepoSort; label: string }[] = [
  { value: 'stars', label: 'Most stars' },
  { value: 'updated', label: 'Recently updated' },
  { value: 'forks', label: 'Most forks' },
  { value: 'name', label: 'Name' },
]

export interface RepoFilters {
  query: string
  sort: RepoSort
  /** Empty string means "any language". */
  language: string
  hideForks: boolean
  hideArchived: boolean
}

export const DEFAULT_FILTERS: RepoFilters = {
  query: '',
  sort: 'stars',
  language: '',
  hideForks: false,
  hideArchived: false,
}

const updatedAt = (r: GitHubRepo) => Date.parse(r.pushed_at ?? r.updated_at)

const comparators: Record<RepoSort, (a: GitHubRepo, b: GitHubRepo) => number> = {
  stars: (a, b) => b.stargazers_count - a.stargazers_count || updatedAt(b) - updatedAt(a),
  forks: (a, b) => b.forks_count - a.forks_count || b.stargazers_count - a.stargazers_count,
  updated: (a, b) => updatedAt(b) - updatedAt(a),
  name: (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
}

export function filterRepos(repos: GitHubRepo[], f: RepoFilters): GitHubRepo[] {
  const q = f.query.trim().toLowerCase()
  return repos
    .filter((r) => {
      if (f.hideForks && r.fork) return false
      if (f.hideArchived && r.archived) return false
      if (f.language && r.language !== f.language) return false
      if (q) {
        const haystack = `${r.name} ${r.description ?? ''} ${(r.topics ?? []).join(' ')}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
    .sort(comparators[f.sort])
}

/** Languages present in the list, most common first. */
export function repoLanguages(repos: GitHubRepo[]): string[] {
  const counts = new Map<string, number>()
  for (const r of repos) if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([l]) => l)
}

const SORT_VALUES = new Set<string>(REPO_SORTS.map((s) => s.value))

export function filtersFromParams(params: URLSearchParams): RepoFilters {
  const sort = params.get('sort') ?? ''
  return {
    query: params.get('q') ?? '',
    sort: SORT_VALUES.has(sort) ? (sort as RepoSort) : DEFAULT_FILTERS.sort,
    language: params.get('lang') ?? '',
    hideForks: params.get('forks') === 'hide',
    hideArchived: params.get('archived') === 'hide',
  }
}

/** Write filters into `params`, omitting defaults so URLs stay short. */
export function filtersToParams(f: RepoFilters, params: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(params)
  const set = (key: string, value: string, isDefault: boolean) =>
    isDefault ? next.delete(key) : next.set(key, value)
  set('q', f.query, f.query === '')
  set('sort', f.sort, f.sort === DEFAULT_FILTERS.sort)
  set('lang', f.language, f.language === '')
  set('forks', 'hide', !f.hideForks)
  set('archived', 'hide', !f.hideArchived)
  return next
}
