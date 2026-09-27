import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { filtersFromParams, filtersToParams, type RepoFilters } from './filterRepos'

/** Repo filter state stored in the URL query string (shareable, back-button friendly). */
export function useRepoFilters() {
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => filtersFromParams(params), [params])

  const update = useCallback(
    (patch: Partial<RepoFilters>) => {
      setParams((prev) => filtersToParams({ ...filtersFromParams(prev), ...patch }, prev), {
        replace: true,
        preventScrollReset: true,
      })
    },
    [setParams],
  )

  return [filters, update] as const
}
