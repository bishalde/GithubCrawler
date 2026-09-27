import { BookMarked, CalendarDays, GitFork, Star, type LucideIcon } from 'lucide-react'
import type { GitHubRepo, GitHubUser } from '../../lib/types'
import { accountAge, totalForks, totalStars } from '../../lib/stats'
import { formatCompact, formatNumber } from '../../lib/format'
import { Skeleton } from '../../components/ui/Skeleton'

interface Tile {
  icon: LucideIcon
  label: string
  value: string | null
  title?: string
  hint?: string
}

export function StatTiles({ user, repos }: { user: GitHubUser; repos: GitHubRepo[] | undefined }) {
  const age = accountAge(user.created_at)
  const stars = repos && totalStars(repos)
  const forks = repos && totalForks(repos)

  const tiles: Tile[] = [
    { icon: Star, label: 'Total stars', value: stars === undefined ? null : formatCompact(stars), title: stars === undefined ? undefined : formatNumber(stars) },
    { icon: GitFork, label: 'Total forks', value: forks === undefined ? null : formatCompact(forks), title: forks === undefined ? undefined : formatNumber(forks) },
    { icon: BookMarked, label: 'Public repos', value: formatNumber(user.public_repos), hint: `${formatNumber(user.public_gists)} gists` },
    {
      icon: CalendarDays,
      label: 'On GitHub',
      value: age.years > 0 ? `${age.years}y ${age.months}m` : `${age.months}mo`,
    },
  ]

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map(({ icon: Icon, label, value, title, hint }, i) => (
        <div
          key={label}
          className="animate-fade-up rounded-2xl border border-border bg-surface p-4"
          style={{ animationDelay: `${60 + i * 40}ms` }}
        >
          <dt className="flex items-center gap-2 text-xs font-medium text-muted">
            <Icon className="size-3.5" aria-hidden /> {label}
          </dt>
          <dd className="mt-2 font-mono text-2xl font-semibold tracking-tight tabular" title={title}>
            {value ?? <Skeleton className="h-8 w-16" />}
          </dd>
          {hint && <p className="mt-0.5 text-xs text-subtle">{hint}</p>}
        </div>
      ))}
    </dl>
  )
}
