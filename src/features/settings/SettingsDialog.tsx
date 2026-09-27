import { useState, type FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ExternalLink, KeyRound, ShieldCheck } from 'lucide-react'
import { Dialog } from '../../components/ui/Dialog'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { setToken } from '../../lib/github'
import { useRateLimit, useToken } from '../../hooks/useGitHub'
import { formatRelative } from '../../lib/format'

const NEW_TOKEN_URL =
  'https://github.com/settings/personal-access-tokens/new?name=GitHubCrawler&description=Read-only%20public%20data'

export function SettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const token = useToken()
  const rate = useRateLimit()
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState('')

  const save = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.trim()) return
    setToken(draft)
    setDraft('')
    // Retry anything that failed under the old credentials.
    void queryClient.invalidateQueries({ predicate: (q) => q.state.status === 'error' })
    onClose()
  }

  const clear = () => {
    setToken(null)
    void queryClient.invalidateQueries({ predicate: (q) => q.state.status === 'error' })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="API access"
      description="Without a token, GitHub allows 60 requests an hour from your IP address. A personal token raises that to 5,000."
    >
      {rate && (
        <div className="mb-5 rounded-xl border border-border bg-surface-2 p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">Requests left</span>
            <span className="font-mono tabular">
              {rate.remaining} / {rate.limit}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-accent" style={{ width: `${(rate.remaining / rate.limit) * 100}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted">Resets {formatRelative(rate.resetAt)}</p>
        </div>
      )}

      {token ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="size-4 text-positive" aria-hidden />
            <span>
              Token saved <span className="font-mono text-muted">••••{token.slice(-4)}</span>
            </span>
          </div>
          <Button size="sm" onClick={clear}>
            Remove
          </Button>
        </div>
      ) : (
        <form onSubmit={save} className="space-y-3">
          <label htmlFor="gh-token" className="block text-sm font-medium">
            Personal access token
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden />
              <Input
                id="gh-token"
                type="password"
                autoComplete="off"
                spellCheck={false}
                placeholder="github_pat_…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full pl-9 font-mono"
              />
            </div>
            <Button type="submit" variant="primary" disabled={!draft.trim()}>
              Save
            </Button>
          </div>
        </form>
      )}

      <ul className="mt-5 space-y-1.5 text-xs text-muted">
        <li>• The token is kept in this browser's localStorage and sent only to api.github.com.</li>
        <li>• A fine-grained token with no permissions is enough, because everything here is public data.</li>
      </ul>
      <a
        href={NEW_TOKEN_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
      >
        Create a token on GitHub <ExternalLink className="size-3.5" aria-hidden />
      </a>
    </Dialog>
  )
}
