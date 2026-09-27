import { Link } from 'react-router'
import { AtSign, Building2, CalendarDays, GitCompareArrows, Link as LinkIcon, MapPin, Users } from 'lucide-react'
import type { GitHubUser } from '../../lib/types'
import { displayUrl, formatCompact, formatDate, normalizeUrl } from '../../lib/format'
import { buttonClass } from '../../components/ui/buttonClass'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { GitHubIcon } from '../../components/GitHubIcon'

export function ProfileHeader({ user }: { user: GitHubUser }) {
  const blog = normalizeUrl(user.blog)

  return (
    <section className="animate-fade-up flex flex-col gap-6 sm:flex-row sm:items-start">
      <img
        src={user.avatar_url}
        alt={`${user.login}'s avatar`}
        className="size-24 shrink-0 rounded-2xl border border-border sm:size-28"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{user.name ?? user.login}</h1>
          {user.type === 'Organization' && <Badge tone="accent">Organization</Badge>}
        </div>
        <p className="font-mono text-sm text-muted">@{user.login}</p>
        {user.bio && <p className="mt-3 max-w-2xl text-sm text-pretty">{user.bio}</p>}

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          {user.location && (
            <li className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden /> {user.location}
            </li>
          )}
          {user.company && (
            <li className="inline-flex items-center gap-1.5">
              <Building2 className="size-4" aria-hidden /> {user.company}
            </li>
          )}
          {blog && (
            <li>
              <a href={blog} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent">
                <LinkIcon className="size-4" aria-hidden /> {displayUrl(blog)}
              </a>
            </li>
          )}
          {user.twitter_username && (
            <li>
              <a
                href={`https://x.com/${user.twitter_username}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-accent"
              >
                <AtSign className="size-4" aria-hidden /> {user.twitter_username}
              </a>
            </li>
          )}
          <li className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden /> Joined {formatDate(user.created_at)}
          </li>
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <a href={`${user.html_url}?tab=followers`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent">
            <Users className="size-4 text-muted" aria-hidden />
            <span className="font-semibold tabular">{formatCompact(user.followers)}</span>
            <span className="text-muted">followers</span>
          </a>
          <a href={`${user.html_url}?tab=following`} target="_blank" rel="noreferrer" className="hover:text-accent">
            <span className="font-semibold tabular">{formatCompact(user.following)}</span> <span className="text-muted">following</span>
          </a>
        </div>
      </div>

      <div className="flex shrink-0 gap-2 sm:flex-col">
        <a href={user.html_url} target="_blank" rel="noreferrer" className={buttonClass('primary', 'md')}>
          <GitHubIcon /> View on GitHub
        </a>
        <Link to={`/compare/${user.login}`} className={buttonClass('secondary', 'md')}>
          <GitCompareArrows className="size-4" aria-hidden /> Compare
        </Link>
      </div>
    </section>
  )
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row" aria-busy aria-label="Loading profile">
      <Skeleton className="size-24 rounded-2xl sm:size-28" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-full max-w-lg" />
        <Skeleton className="h-4 w-80" />
      </div>
    </div>
  )
}
