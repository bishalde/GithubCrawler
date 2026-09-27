# GitHubCrawler

Explore any GitHub profile: stats, language breakdown, a searchable repository explorer, and side-by-side comparison of two developers.

## Features

- **Profile insights.** Total stars and forks, account age, a language donut chart, the most-starred repos, and a chart of repos created per year.
- **Repo explorer.** All public repos (up to 500), with text search, sort (stars, updated, forks, name), a language filter, and toggles to hide forks and archived repos. Filters are kept in the URL, so a filtered view can be shared.
- **Compare.** `/compare/:a/:b` puts two profiles head to head: followers, stars, forks, repos, gists, years active and language mix.
- **Shareable links.** `/user/torvalds`, `/user/torvalds?tab=repositories&lang=C`.
- **Recent searches**, **light and dark themes** (the default follows your OS), and keyboard search with `/` or `⌘K`.
- **Rate-limit aware.** Responses are cached for the browser session and the footer shows the remaining quota. You can add an optional personal token (stored only in your browser) to raise the limit from 60 to 5,000 requests an hour.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · React Router · TanStack Query · Recharts · Vitest + Testing Library

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # unit + component tests
npm run lint
npm run build    # type-check + production build to dist/
```

## Project layout

```
src/
  app/          providers, router, layout (header/footer)
  pages/        HomePage, UserPage, ComparePage, NotFoundPage
  features/     search, profile, repos, compare, settings
  components/   shared UI primitives (Button, Card, Tabs, Dialog, …)
  lib/          GitHub API client, types, stats, formatting, storage
  hooks/        data hooks (useUser, useRepos), theme
```

## Deploying

This is a static SPA. `vercel.json` rewrites every path to `index.html` so deep links work on Vercel. Other hosts need an equivalent SPA fallback.
