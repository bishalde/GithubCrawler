import { CircleAlert, Hourglass, KeyRound, UserX } from 'lucide-react'
import { Link } from 'react-router'
import { AuthError, NotFoundError, RateLimitError } from '../lib/github'
import { formatRelative } from '../lib/format'
import { Button } from './ui/Button'
import { buttonClass } from './ui/buttonClass'
import { EmptyState } from './ui/EmptyState'
import { useSettings } from '../features/settings/SettingsContext'

interface QueryErrorProps {
  error: unknown
  /** The login being looked up, for the not-found message. */
  login?: string
  onRetry?: () => void
  compact?: boolean
}

export function QueryError({ error, login, onRetry, compact }: QueryErrorProps) {
  const { openSettings } = useSettings()
  const className = compact ? 'py-8' : undefined

  if (error instanceof NotFoundError) {
    return (
      <EmptyState
        icon={UserX}
        title={login ? `No GitHub user “${login}”` : 'Not found'}
        className={className}
        action={
          <Link to="/" className={buttonClass('secondary')}>
            Search again
          </Link>
        }
      >
        Check the spelling. GitHub usernames are case-insensitive but must match exactly.
      </EmptyState>
    )
  }

  if (error instanceof RateLimitError) {
    return (
      <EmptyState
        icon={Hourglass}
        tone="warning"
        title="GitHub rate limit reached"
        className={className}
        action={
          <Button variant="primary" onClick={openSettings}>
            <KeyRound className="size-4" aria-hidden /> Add a token
          </Button>
        }
      >
        Unauthenticated requests are limited to 60 an hour. The quota resets {formatRelative(error.resetAt)}. You can also
        add a personal access token to get 5,000 requests an hour.
      </EmptyState>
    )
  }

  if (error instanceof AuthError) {
    return (
      <EmptyState
        icon={KeyRound}
        tone="danger"
        title="Your GitHub token was rejected"
        className={className}
        action={
          <Button variant="primary" onClick={openSettings}>
            Update token
          </Button>
        }
      >
        The token may have expired or been revoked. Replace or remove it to continue.
      </EmptyState>
    )
  }

  return (
    <EmptyState
      icon={CircleAlert}
      tone="danger"
      title="Something went wrong"
      className={className}
      action={onRetry && <Button onClick={onRetry}>Try again</Button>}
    >
      {error instanceof Error ? error.message : 'The request failed.'}
    </EmptyState>
  )
}
