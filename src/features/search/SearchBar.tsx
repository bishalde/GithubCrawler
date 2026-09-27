import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, Search } from 'lucide-react'
import { cn } from '../../lib/cn'
import { isValidLogin, normalizeLogin } from '../../lib/username'

interface SearchBarProps {
  variant?: 'hero' | 'compact'
  /** Focus with "/" or ⌘K / Ctrl+K. */
  hotkey?: boolean
  autoFocus?: boolean
  className?: string
  /** Called with a valid login instead of navigating to the profile. */
  onSubmitLogin?: (login: string) => void
  placeholder?: string
}

const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)

export function SearchBar({ variant = 'hero', hotkey, autoFocus, className, onSubmitLogin, placeholder }: SearchBarProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const errorId = useId()
  const hero = variant === 'hero'

  useEffect(() => {
    if (!hotkey) return
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing = target?.closest('input, textarea, select, [contenteditable="true"]')
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hotkey])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const login = normalizeLogin(value)
    if (!login) {
      setError('Enter a GitHub username.')
      return
    }
    if (!isValidLogin(login)) {
      setError('Usernames use letters, numbers and single hyphens (max 39 characters).')
      return
    }
    setError(null)
    setValue('')
    inputRef.current?.blur()
    if (onSubmitLogin) onSubmitLogin(login)
    else navigate(`/user/${login}`)
  }

  return (
    <form onSubmit={submit} role="search" className={cn('relative w-full', className)} noValidate>
      <div
        className={cn(
          'group flex items-center rounded-xl border bg-surface transition-all',
          'focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15',
          error ? 'border-danger' : 'border-border hover:border-border-strong',
          hero ? 'h-14 pl-4 pr-1.5 shadow-lg shadow-black/5 dark:shadow-black/30' : 'h-9 pl-3 pr-1',
        )}
      >
        <Search className={cn('shrink-0 text-subtle', hero ? 'size-5' : 'size-4')} aria-hidden />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (error) setError(null)
          }}
          autoFocus={autoFocus}
          type="search"
          name="login"
          aria-label="GitHub username"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={placeholder ?? (hero ? 'Search a GitHub username or paste a profile URL' : 'Search users…')}
          className={cn(
            'h-full min-w-0 flex-1 bg-transparent px-3 text-fg placeholder:text-subtle focus:outline-none',
            '[&::-webkit-search-cancel-button]:hidden',
            hero ? 'text-base' : 'text-sm',
          )}
        />
        {hotkey && !value && (
          <kbd className="mr-2 hidden rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-muted sm:inline-block">
            {hero ? (isMac ? '⌘K' : 'Ctrl K') : '/'}
          </kbd>
        )}
        {hero && (
          <button
            type="submit"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-fg px-4 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            <span className="hidden sm:inline">Search</span>
            <ArrowRight className="size-4" aria-hidden />
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className={cn('text-danger', hero ? 'mt-2 text-sm' : 'absolute left-0 top-full mt-1 text-xs')}>
          {error}
        </p>
      )}
    </form>
  )
}
