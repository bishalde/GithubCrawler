import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeftRight } from 'lucide-react'
import { useRepos, useUser } from '../hooks/useGitHub'
import { ComparePicker } from '../features/compare/ComparePicker'
import { MetricBars, type Metric } from '../features/compare/MetricBars'
import { LanguageOverlap } from '../features/compare/LanguageOverlap'
import { QueryError } from '../components/QueryError'
import { Card, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { accountAge, compareMetric, totalForks, totalStars } from '../lib/stats'
import { formatCompact } from '../lib/format'
import type { GitHubUser } from '../lib/types'

export function ComparePage() {
  const { a, b } = useParams()
  if (!a || !b) return <ComparePicker key={a ?? ''} initialA={a} />
  return <Comparison a={a} b={b} />
}

const years = (u: GitHubUser) => {
  const { years, months } = accountAge(u.created_at)
  return years + months / 12
}

function Comparison({ a, b }: { a: string; b: string }) {
  const navigate = useNavigate()
  const userA = useUser(a)
  const userB = useUser(b)
  const reposA = useRepos(a, userA.isSuccess)
  const reposB = useRepos(b, userB.isSuccess)

  const failed = [
    { q: userA, login: a },
    { q: userB, login: b },
    { q: reposA, login: a },
    { q: reposB, login: b },
  ].find((x) => x.q.isError)
  if (failed) {
    return <QueryError error={failed.q.error} login={failed.login} onRetry={() => void failed.q.refetch()} />
  }

  const ua = userA.data
  const ub = userB.data
  const ra = reposA.data?.repos
  const rb = reposB.data?.repos

  const metrics: Metric[] | null =
    ua && ub && ra && rb
      ? [
          { label: 'Followers', a: ua.followers, b: ub.followers, format: formatCompact },
          { label: 'Total stars', a: totalStars(ra), b: totalStars(rb), format: formatCompact },
          { label: 'Total forks', a: totalForks(ra), b: totalForks(rb), format: formatCompact },
          { label: 'Public repos', a: ua.public_repos, b: ub.public_repos, format: formatCompact },
          { label: 'Public gists', a: ua.public_gists, b: ub.public_gists, format: formatCompact },
          { label: 'Years active', a: years(ua), b: years(ub), format: (n) => n.toFixed(1) },
        ]
      : null

  const wins = metrics?.reduce(
    (acc, m) => {
      const w = compareMetric(m.a, m.b)
      if (w !== 'tie') acc[w]++
      return acc
    },
    { a: 0, b: 0 },
  )

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
        <UserColumn user={ua} wins={wins?.a} align="right" />
        <Button variant="secondary" size="icon" onClick={() => navigate(`/compare/${b}/${a}`)} aria-label="Swap users" title="Swap users">
          <ArrowLeftRight className="size-4" />
        </Button>
        <UserColumn user={ub} wins={wins?.b} align="left" />
      </div>

      <Card>
        <CardHeader
          title="Head to head"
          description={
            wins && ua && ub
              ? wins.a === wins.b
                ? `Tied at ${wins.a} each`
                : `${wins.a > wins.b ? ua.login : ub.login} leads ${Math.max(wins.a, wins.b)} to ${Math.min(wins.a, wins.b)}`
              : 'Loading…'
          }
        />
        <div className="px-5 pb-2">
          {metrics ? (
            <MetricBars metrics={metrics} />
          ) : (
            <div className="space-y-4 py-4">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-5" />
              ))}
            </div>
          )}
        </div>
      </Card>

      {ra && rb ? <LanguageOverlap a={ra} b={rb} /> : <Skeleton className="h-64 rounded-2xl" />}
    </div>
  )
}

function UserColumn({ user, wins, align }: { user: GitHubUser | undefined; wins: number | undefined; align: 'left' | 'right' }) {
  const right = align === 'right'
  if (!user) {
    return (
      <div className={`flex flex-col gap-3 ${right ? 'items-end' : 'items-start'}`}>
        <Skeleton className="size-16 rounded-2xl sm:size-20" />
        <Skeleton className="h-5 w-32" />
      </div>
    )
  }
  return (
    <Link
      to={`/user/${user.login}`}
      className={`group animate-fade-up flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center ${right ? 'items-end text-right sm:flex-row-reverse' : 'items-start text-left'}`}
    >
      <img src={user.avatar_url} alt="" className="size-16 shrink-0 rounded-2xl border border-border sm:size-20" />
      <div className="min-w-0">
        <div className="truncate text-lg font-bold tracking-tight group-hover:text-accent sm:text-xl">{user.name ?? user.login}</div>
        <div className="truncate font-mono text-xs text-muted">@{user.login}</div>
        {wins !== undefined && (
          <div className="mt-1 text-xs text-muted">
            <span className="font-semibold text-accent tabular">{wins}</span> {wins === 1 ? 'win' : 'wins'}
          </div>
        )}
      </div>
    </Link>
  )
}
