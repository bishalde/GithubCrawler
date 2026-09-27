import { Link } from 'react-router'
import { BarChart3, FolderGit2, GitCompareArrows, Sparkles } from 'lucide-react'
import { SearchBar } from '../features/search/SearchBar'
import { RecentSearches } from '../features/search/RecentSearches'

const EXAMPLES = ['bishalde', 'torvalds', 'gaearon', 'sindresorhus', 'yyx990803']

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Profile insights',
    body: 'Language mix, top repositories, total stars and a timeline of the repos someone has created.',
  },
  {
    icon: FolderGit2,
    title: 'Repo explorer',
    body: 'Every public repo in one place. Search, sort, filter by language and share the exact view.',
  },
  {
    icon: GitCompareArrows,
    title: 'Compare developers',
    body: 'Put two profiles side by side and see who leads on stars, followers, repos and languages.',
  },
]

export function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
        <div className="bg-glow absolute inset-0 -z-10" aria-hidden />

        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-16 pt-20 text-center sm:pt-28">
          <span className="animate-fade-up inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-medium text-muted backdrop-blur">
            <Sparkles className="size-3.5 text-accent" aria-hidden />
            Now with insights, compare and repo explorer
          </span>

          <h1 className="animate-fade-up mt-6 text-4xl font-extrabold tracking-tight text-balance [animation-delay:60ms] sm:text-6xl">
            Explore any GitHub profile{' '}
            <span className="bg-linear-to-r from-violet-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
              instantly
            </span>
          </h1>

          <p className="animate-fade-up mt-5 max-w-xl text-base text-muted text-pretty [animation-delay:120ms] sm:text-lg">
            See repositories, languages and stats for any GitHub user, and compare developers side by side. No sign-in
            needed.
          </p>

          <div className="animate-fade-up mt-9 w-full max-w-xl [animation-delay:180ms]">
            <SearchBar variant="hero" hotkey autoFocus />
          </div>

          <div className="animate-fade-up mt-6 space-y-4 [animation-delay:240ms]">
            <RecentSearches />
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-muted">Try</span>
              {EXAMPLES.map((login) => (
                <Link
                  key={login}
                  to={`/user/${login}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface py-1 pl-1 pr-3 text-sm transition-colors hover:border-accent hover:text-accent"
                >
                  <img src={`https://github.com/${login}.png?size=40`} alt="" className="size-5 rounded-full" loading="lazy" />
                  {login}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-24 sm:grid-cols-3 sm:px-6">
        {FEATURES.map(({ icon: Icon, title, body }, i) => (
          <div
            key={title}
            className="animate-fade-up rounded-2xl border border-border bg-surface p-5"
            style={{ animationDelay: `${300 + i * 60}ms` }}
          >
            <div className="grid size-9 place-items-center rounded-lg bg-accent-soft text-accent">
              <Icon className="size-4.5" aria-hidden />
            </div>
            <h2 className="mt-4 text-sm font-semibold">{title}</h2>
            <p className="mt-1.5 text-sm text-muted">{body}</p>
          </div>
        ))}
      </section>
    </>
  )
}
