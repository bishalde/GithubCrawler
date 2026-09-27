import { Link } from 'react-router'

export function LogoMark({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id="ghc-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#ghc-g)" />
      <circle cx="14.5" cy="14.5" r="6" fill="none" stroke="#fff" strokeWidth="2.6" />
      <path d="M19 19l5 5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight" aria-label="GitHubCrawler home">
      <LogoMark />
      <span className="hidden sm:inline">
        GitHub<span className="text-muted">Crawler</span>
      </span>
    </Link>
  )
}
