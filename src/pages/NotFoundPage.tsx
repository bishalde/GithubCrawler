import { Link } from 'react-router'
import { Compass } from 'lucide-react'
import { EmptyState } from '../components/ui/EmptyState'
import { buttonClass } from '../components/ui/buttonClass'

export function NotFoundPage() {
  return (
    <EmptyState
      icon={Compass}
      title="Page not found"
      className="py-28"
      action={
        <Link to="/" className={buttonClass('primary')}>
          Back to search
        </Link>
      }
    >
      That URL doesn’t match anything here.
    </EmptyState>
  )
}
