import { Link } from 'react-router'
import { History, X } from 'lucide-react'
import { useRecentSearches } from './useRecentSearches'

export function RecentSearches() {
  const { recent, remove, clear } = useRecentSearches()
  if (recent.length === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-xs text-muted">
        <History className="size-3.5" aria-hidden /> Recent
      </span>
      {recent.map((u) => (
        <span
          key={u.login}
          className="group inline-flex items-center rounded-full border border-border bg-surface pr-1 text-sm transition-colors hover:border-border-strong"
        >
          <Link to={`/user/${u.login}`} className="inline-flex items-center gap-1.5 py-1 pl-1 pr-1.5">
            <img src={u.avatarUrl} alt="" className="size-5 rounded-full" loading="lazy" />
            {u.login}
          </Link>
          <button
            type="button"
            onClick={() => remove(u.login)}
            className="grid size-5 place-items-center rounded-full text-subtle hover:bg-surface-2 hover:text-fg"
            aria-label={`Remove ${u.login} from recent searches`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <button type="button" onClick={clear} className="text-xs text-muted hover:text-fg hover:underline">
        Clear
      </button>
    </div>
  )
}
