import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { GitCompareArrows, Settings } from 'lucide-react'
import { GitHubIcon } from '../components/GitHubIcon'
import { Logo } from '../components/Logo'
import { Button } from '../components/ui/Button'
import { buttonClass } from '../components/ui/buttonClass'
import { SearchBar } from '../features/search/SearchBar'
import { ThemeToggle } from '../features/settings/ThemeToggle'
import { useSettings } from '../features/settings/SettingsContext'
import { useRateLimit } from '../hooks/useGitHub'
import { cn } from '../lib/cn'

const REPO_URL = 'https://github.com/bishalde/GithubCrawler'
const DEVELOPER_URL = 'https://bishalde.vercel.app'

export function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const { openSettings } = useSettings()

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/75 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Logo />
          {!isHome && <SearchBar variant="compact" hotkey className="mx-auto hidden max-w-sm md:block" />}
          <nav className="ml-auto flex items-center gap-1" aria-label="Main">
            <NavLink
              to="/compare"
              className={({ isActive }) =>
                cn(buttonClass('ghost', 'sm'), isActive && 'bg-surface-2 text-fg')
              }
            >
              <GitCompareArrows className="size-4" aria-hidden />
              <span className="hidden sm:inline">Compare</span>
            </NavLink>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={openSettings} aria-label="API settings" title="API settings">
              <Settings className="size-4" />
            </Button>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className={buttonClass('ghost', 'icon')}
              aria-label="Source code on GitHub"
              title="Source code on GitHub"
            >
              <GitHubIcon />
            </a>
          </nav>
        </div>
        {!isHome && (
          <div className="px-4 pb-3 md:hidden">
            <SearchBar variant="compact" />
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

function Footer() {
  const rate = useRateLimit()
  const { openSettings } = useSettings()
  const low = rate && rate.remaining / rate.limit < 0.2

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted sm:flex-row sm:px-6">
        <p>
          Built by{' '}
          <a href={DEVELOPER_URL} target="_blank" rel="noreferrer" className="font-medium text-fg hover:underline">
            Bishal De
          </a>{' '}
          · Data from the{' '}
          <a href="https://docs.github.com/rest" target="_blank" rel="noreferrer" className="hover:text-fg hover:underline">
            GitHub REST API
          </a>
        </p>
        <div className="flex items-center gap-4">
          {rate && (
            <button
              type="button"
              onClick={openSettings}
              className={cn('inline-flex items-center gap-2 font-mono tabular hover:text-fg', low && 'text-warning')}
              title="API quota. Click to add a token."
            >
              <span className={cn('size-1.5 rounded-full', low ? 'bg-warning' : 'bg-positive')} aria-hidden />
              {rate.remaining}/{rate.limit} requests left
            </button>
          )}
          <Link to="/" className="hover:text-fg">
            Home
          </Link>
        </div>
      </div>
    </footer>
  )
}
