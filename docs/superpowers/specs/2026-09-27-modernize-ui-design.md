# GithubCrawler — Modernize UI & Add Features

**Date:** 2026-09-27 · **Status:** Approved in chat

## Goal

Turn GithubCrawler into a polished portfolio piece. A visitor can open a shared
link (e.g. `/user/torvalds`), see a good-looking dashboard in light or dark
mode, and explore or compare GitHub users without crashes or confusing errors.

## Decisions

- Stays a static client-side SPA (Vercel), using the public GitHub REST API.
- Stack: Vite 8, React 19, TypeScript 5.9, Tailwind CSS v4, React Router 7,
  TanStack Query 5 (cache persisted to sessionStorage), Recharts, lucide-react.
- Old SCSS and the compiled `.css`/`.map` files, the unused images and the
  `.eslintrc.cjs` config are removed. ESLint moves to a flat config.
- Rate limit: responses are cached, the remaining quota is shown in the footer,
  there are clear rate-limit and auth error states, and an optional personal
  token is stored only in localStorage and sent only to `api.github.com`.

## Pages

| Route | Contents |
|---|---|
| `/` | Hero, search (focus with `/` or ⌘K), recent-search chips (last 8, removable), "Try" example users |
| `/user/:login` | Profile header, stat tiles (stars, forks, repos, account age), tabs: **Overview** (language donut, top-repos bar chart, top repo cards) and **Repositories** (explorer) |
| `/compare/:a/:b?` | Two headers side by side, mirrored metric bars with each metric's winner highlighted, language overlap, swap button; second-user picker when `b` is missing |
| `*` | Not-found page |

Errors (user not found, rate limited with reset time, bad token) and loading
skeletons are handled in every page.

## Visual direction

A clean developer-tool look: zinc neutrals, a violet accent, green for
positive stats. Inter for UI text and JetBrains Mono for numbers. 1px borders
instead of heavy shadows, a subtle grid-and-glow hero background, restrained
motion. Light and dark themes come from CSS variables; the theme defaults to
the OS setting, and a manual choice is saved in localStorage. Mobile-first
layout.

## Data layer

- `lib/github.ts`: `ghFetch` adds the headers and the optional Bearer token,
  reads the `x-ratelimit-*` headers into a store, and maps responses to typed
  errors (`NotFoundError`, `RateLimitError`, `AuthError`, `GitHubError`).
  `getUser` and `getRepos` (per_page=100, follows `Link: rel="next"`, capped at
  5 pages).
- `lib/types.ts`: typed `GitHubUser` and `GitHubRepo` (only the fields we use).
- `hooks/useUser`, `hooks/useRepos`: TanStack Query, staleTime 10 min, no retry
  on the typed client errors.
- `lib/stats.ts` (pure functions): `totalStars`, `totalForks`,
  `languageBreakdown` (by primary language, top 6 plus "Other"), `topRepos`,
  `accountAge`, `compareMetric`.
- The per-repo `/languages` endpoint is not used (it would cost one call per
  repo).

## Repo explorer

Text filter (name and description), sort (stars, updated, name, forks),
language select, and toggles to hide forks and archived repos. All filter
state lives in the URL query string. A card is a single link (fixes the
nested-anchor bug), with the homepage link rendered outside the anchor. Shows
30 repos, then a "Show more" button.

## Testing

- Vitest + Testing Library + jsdom.
- Unit tests: `stats.ts`, `github.ts` (pagination, page cap, error mapping,
  rate-limit headers, token header), repo filter/sort logic, username
  validation.
- Component tests: SearchBar validation and navigation; RepoExplorer
  filtering.
- `npm run build`, `npm run lint` and `npm test` all pass; manual smoke test
  in a browser.
