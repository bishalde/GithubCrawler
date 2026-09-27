import { Archive, ExternalLink, GitFork, Star } from 'lucide-react'
import type { GitHubRepo } from '../../lib/types'
import { displayUrl, formatCompact, formatRelative, normalizeUrl } from '../../lib/format'
import { Badge } from '../../components/ui/Badge'
import { LanguageDot } from './LanguageDot'

export function RepoCard({ repo }: { repo: GitHubRepo }) {
  const homepage = normalizeUrl(repo.homepage)

  return (
    // The card is not itself a link, so the homepage link below isn't nested inside another anchor.
    // The title link's ::after stretches over the whole card to make it clickable.
    <article className="group relative flex flex-col rounded-2xl border border-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/40">
      <div className="flex items-start gap-2">
        <h3 className="min-w-0 flex-1 truncate font-semibold">
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="after:absolute after:inset-0 after:rounded-2xl group-hover:text-accent">
            {repo.name}
          </a>
        </h3>
        {repo.fork && <Badge>Fork</Badge>}
        {repo.archived && (
          <Badge tone="warning">
            <Archive className="size-3" aria-hidden /> Archived
          </Badge>
        )}
      </div>

      <p className="mt-1.5 line-clamp-2 min-h-10 text-sm text-muted">{repo.description ?? 'No description'}</p>

      {repo.topics && repo.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {repo.topics.slice(0, 4).map((t) => (
            <Badge key={t} tone="accent">
              {t}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-xs text-muted">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5">
            <LanguageDot language={repo.language} className="size-2" /> {repo.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1 tabular" title={`${repo.stargazers_count} stars`}>
          <Star className="size-3.5" aria-hidden /> {formatCompact(repo.stargazers_count)}
        </span>
        <span className="inline-flex items-center gap-1 tabular" title={`${repo.forks_count} forks`}>
          <GitFork className="size-3.5" aria-hidden /> {formatCompact(repo.forks_count)}
        </span>
        <span className="ml-auto">Updated {formatRelative(repo.pushed_at ?? repo.updated_at)}</span>
      </div>

      {homepage && (
        <a
          href={homepage}
          target="_blank"
          rel="noreferrer"
          className="relative z-10 mt-3 inline-flex w-fit max-w-full items-center gap-1 truncate text-xs font-medium text-accent hover:underline"
        >
          <ExternalLink className="size-3 shrink-0" aria-hidden />
          <span className="truncate">{displayUrl(homepage)}</span>
        </a>
      )}
    </article>
  )
}

export function RepoCardSkeleton() {
  return <div className="h-40 animate-pulse rounded-2xl border border-border bg-surface" aria-hidden />
}
