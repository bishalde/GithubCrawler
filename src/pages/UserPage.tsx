import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { Info } from 'lucide-react'
import { useRepos, useUser } from '../hooks/useGitHub'
import { ProfileHeader, ProfileHeaderSkeleton } from '../features/profile/ProfileHeader'
import { StatTiles } from '../features/profile/StatTiles'
import { LanguageChart } from '../features/profile/LanguageChart'
import { TopReposChart } from '../features/profile/TopReposChart'
import { ActivityChart } from '../features/profile/ActivityChart'
import { RepoCard, RepoCardSkeleton } from '../features/profile/RepoCard'
import { RepoExplorer } from '../features/repos/RepoExplorer'
import { addRecentSearch } from '../features/search/useRecentSearches'
import { QueryError } from '../components/QueryError'
import { Tabs } from '../components/ui/Tabs'
import { Skeleton } from '../components/ui/Skeleton'
import { topRepos } from '../lib/stats'
import { MAX_REPO_PAGES, REPOS_PER_PAGE, type RepoList } from '../lib/github'

type Tab = 'overview' | 'repositories'

export function UserPage() {
  const { login = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const tab: Tab = params.get('tab') === 'repositories' ? 'repositories' : 'overview'

  const user = useUser(login)
  const repos = useRepos(login, user.isSuccess)

  useEffect(() => {
    if (user.data) {
      addRecentSearch({ login: user.data.login, avatarUrl: user.data.avatar_url })
      document.title = `${user.data.name ?? user.data.login} (@${user.data.login}) · GitHubCrawler`
    }
    return () => {
      document.title = 'GitHubCrawler'
    }
  }, [user.data])

  const setTab = (next: Tab) => {
    // Switching tabs drops repo-explorer filters so the Overview URL stays clean.
    setParams(next === 'overview' ? {} : { tab: next }, { preventScrollReset: true })
  }

  if (user.isError) {
    return <QueryError error={user.error} login={login} onRetry={() => void user.refetch()} />
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      {user.data ? <ProfileHeader user={user.data} /> : <ProfileHeaderSkeleton />}

      {user.data ? (
        <StatTiles user={user.data} repos={repos.data?.repos} />
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      )}

      <div className="space-y-6">
        <Tabs
          label="Profile sections"
          idPrefix="profile"
          value={tab}
          onChange={setTab}
          items={[
            { value: 'overview', label: 'Overview' },
            { value: 'repositories', label: 'Repositories', count: repos.data?.repos.length },
          ]}
        />

        <div role="tabpanel" id={`profile-panel-${tab}`} aria-labelledby={`profile-tab-${tab}`}>
          {repos.isError ? (
            <QueryError error={repos.error} compact onRetry={() => void repos.refetch()} />
          ) : !repos.data ? (
            <RepoGridSkeleton />
          ) : (
            <>
              {repos.data.truncated && <TruncatedNotice />}
              {tab === 'overview' ? <Overview list={repos.data} /> : <RepoExplorer repos={repos.data.repos} />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Overview({ list }: { list: RepoList }) {
  const featured = topRepos(list.repos, 6)
  return (
    <div className="animate-fade-up space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <LanguageChart repos={list.repos} />
        <TopReposChart repos={list.repos} />
      </div>
      <ActivityChart repos={list.repos} />
      {featured.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold">Featured repositories</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {featured.map((r) => (
              <RepoCard key={r.id} repo={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function TruncatedNotice() {
  return (
    <p className="mb-5 flex items-start gap-2 rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted">
      <Info className="mt-px size-4 shrink-0" aria-hidden />
      Showing the {MAX_REPO_PAGES * REPOS_PER_PAGE} most recently updated repositories. Stats cover only these, to keep
      within GitHub’s rate limit.
    </p>
  )
}

function RepoGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy aria-label="Loading repositories">
      {Array.from({ length: 6 }, (_, i) => (
        <RepoCardSkeleton key={i} />
      ))}
    </div>
  )
}
