import { Star } from 'lucide-react'
import type { GitHubRepo } from '../../lib/types'
import { topRepos } from '../../lib/stats'
import { formatCompact } from '../../lib/format'
import { Card, CardHeader } from '../../components/ui/Card'
import { LanguageDot } from './LanguageDot'

export function TopReposChart({ repos }: { repos: GitHubRepo[] }) {
  const top = topRepos(repos, 6).filter((r) => r.stargazers_count > 0)
  const max = top[0]?.stargazers_count ?? 0

  return (
    <Card className="flex flex-col">
      <CardHeader title="Most starred" description="Top original repositories by stars" />
      {top.length === 0 ? (
        <p className="p-5 text-sm text-muted">No starred repositories yet.</p>
      ) : (
        <ol className="space-y-3 p-5">
          {top.map((r, i) => (
            <li key={r.id}>
              <a href={r.html_url} target="_blank" rel="noreferrer" className="group block">
                <div className="mb-1 flex items-center gap-2 text-sm">
                  <LanguageDot language={r.language} className="size-2" />
                  <span className="flex-1 truncate font-medium group-hover:text-accent">{r.name}</span>
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-muted tabular">
                    <Star className="size-3" aria-hidden />
                    {formatCompact(r.stargazers_count)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full origin-left rounded-full bg-accent transition-transform duration-700 group-hover:opacity-80"
                    style={{ width: `${(r.stargazers_count / max) * 100}%`, opacity: 1 - i * 0.1 }}
                  />
                </div>
              </a>
            </li>
          ))}
        </ol>
      )}
    </Card>
  )
}
