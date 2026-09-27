import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Search, SearchX } from 'lucide-react'
import type { GitHubRepo } from '../../lib/types'
import { DEFAULT_FILTERS, REPO_SORTS, filterRepos, repoLanguages, type RepoSort } from './filterRepos'
import { useRepoFilters } from './useRepoFilters'
import { Checkbox, Input, Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { RepoCard } from '../profile/RepoCard'

const PAGE_SIZE = 30

export function RepoExplorer({ repos }: { repos: GitHubRepo[] }) {
  const [filters, update] = useRepoFilters()
  // Local input state keeps typing snappy; the URL is updated from the deferred value.
  const [query, setQuery] = useState(filters.query)
  const deferredQuery = useDeferredValue(query)
  const [visible, setVisible] = useState(PAGE_SIZE)

  useEffect(() => {
    if (deferredQuery !== filters.query) update({ query: deferredQuery })
  }, [deferredQuery, filters.query, update])

  const languages = useMemo(() => repoLanguages(repos), [repos])
  const results = useMemo(() => filterRepos(repos, { ...filters, query: deferredQuery }), [repos, filters, deferredQuery])
  const isFiltered =
    deferredQuery.trim() !== '' || filters.language !== '' || filters.hideForks || filters.hideArchived

  // Start from the first page whenever the result set changes shape.
  const resultKey = `${deferredQuery}|${filters.sort}|${filters.language}|${filters.hideForks}|${filters.hideArchived}`
  const [prevKey, setPrevKey] = useState(resultKey)
  if (prevKey !== resultKey) {
    setPrevKey(resultKey)
    setVisible(PAGE_SIZE)
  }

  const reset = () => {
    setQuery('')
    update({ ...DEFAULT_FILTERS, sort: filters.sort })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a repository…"
            aria-label="Filter repositories"
            className="w-full pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select
            aria-label="Language"
            value={filters.language}
            onChange={(e) => update({ language: e.target.value })}
          >
            <option value="">All languages</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
          <Select aria-label="Sort by" value={filters.sort} onChange={(e) => update({ sort: e.target.value as RepoSort })}>
            {REPO_SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
          <Checkbox label="Hide forks" checked={filters.hideForks} onChange={(e) => update({ hideForks: e.target.checked })} />
          <Checkbox
            label="Hide archived"
            checked={filters.hideArchived}
            onChange={(e) => update({ hideArchived: e.target.checked })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted">
        <p aria-live="polite">
          Showing <span className="font-medium text-fg tabular">{Math.min(visible, results.length)}</span> of{' '}
          <span className="tabular">{results.length}</span>
          {isFiltered && <> matching · {repos.length} total</>} repositories
        </p>
        {isFiltered && (
          <button type="button" onClick={reset} className="hover:text-fg hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <EmptyState icon={SearchX} title="No repositories match" className="py-10" action={<Button onClick={reset}>Clear filters</Button>}>
          Try a different search term or remove a filter.
        </EmptyState>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.slice(0, visible).map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
          {visible < results.length && (
            <div className="flex justify-center">
              <Button onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Show {Math.min(PAGE_SIZE, results.length - visible)} more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
