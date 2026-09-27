import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeftRight, GitCompareArrows } from 'lucide-react'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { isValidLogin, normalizeLogin } from '../../lib/username'
import { useRecentSearches } from '../search/useRecentSearches'

export function ComparePicker({ initialA = '', initialB = '' }: { initialA?: string; initialB?: string }) {
  const navigate = useNavigate()
  const { recent } = useRecentSearches()
  const [a, setA] = useState(initialA)
  const [b, setB] = useState(initialB)
  const [error, setError] = useState<string | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const la = normalizeLogin(a)
    const lb = normalizeLogin(b)
    if (!isValidLogin(la) || !isValidLogin(lb)) {
      setError('Enter two valid GitHub usernames.')
      return
    }
    if (la.toLowerCase() === lb.toLowerCase()) {
      setError('Pick two different users.')
      return
    }
    navigate(`/compare/${la}/${lb}`)
  }

  const fill = (login: string) => {
    if (!a.trim()) setA(login)
    else if (!b.trim() && login.toLowerCase() !== normalizeLogin(a).toLowerCase()) setB(login)
    setError(null)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
      <div className="mx-auto grid size-12 place-items-center rounded-xl bg-accent-soft text-accent">
        <GitCompareArrows className="size-6" aria-hidden />
      </div>
      <h1 className="mt-5 text-3xl font-bold tracking-tight">Compare developers</h1>
      <p className="mt-2 text-muted">Put two GitHub profiles side by side.</p>

      <form onSubmit={submit} className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center" noValidate>
        <Input value={a} onChange={(e) => setA(e.target.value)} placeholder="First username" aria-label="First username" className="h-11 flex-1" autoFocus={!initialA} />
        <ArrowLeftRight className="mx-auto size-4 shrink-0 text-subtle" aria-hidden />
        <Input value={b} onChange={(e) => setB(e.target.value)} placeholder="Second username" aria-label="Second username" className="h-11 flex-1" autoFocus={!!initialA} />
        <Button type="submit" variant="primary" className="h-11">
          Compare
        </Button>
      </form>
      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}

      {recent.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted">Recent</span>
          {recent.map((u) => (
            <button
              key={u.login}
              type="button"
              onClick={() => fill(u.login)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface py-1 pl-1 pr-3 text-sm hover:border-accent hover:text-accent"
            >
              <img src={u.avatarUrl} alt="" className="size-5 rounded-full" /> {u.login}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
