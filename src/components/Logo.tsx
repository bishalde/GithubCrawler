import { useId } from 'react'
import { Link } from 'react-router'

/** "Branch lens": a git branch whose tip is a magnifying lens. Keep in sync with public/favicon.svg. */
export function LogoMark({ className = 'size-7' }: { className?: string }) {
  // Unique gradient id so several marks on one page don't collide.
  const gradientId = useId()
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#${gradientId})`} />
      <g transform="translate(-1.5 -0.5)">
        <g fill="none" stroke="#fff" strokeWidth="2.7" strokeLinecap="round">
          <path d="M10.5 7.5v12.5" />
          <path d="M20.5 16.8c0 4-5 4.2-10 6.2" />
          <circle cx="20.5" cy="12" r="4.6" />
          <path d="M24 15.5l2.7 2.7" />
        </g>
        <circle cx="10.5" cy="24.2" r="2.7" fill="#fff" />
      </g>
    </svg>
  )
}

export function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2 font-semibold tracking-tight" aria-label="GitHubCrawler home">
      <LogoMark className="size-7 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105" />
      <span className="hidden text-[15px] sm:inline">
        GitHub<span className="text-muted transition-colors group-hover:text-accent">Crawler</span>
      </span>
    </Link>
  )
}
