import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  children?: ReactNode
  action?: ReactNode
  tone?: 'neutral' | 'danger' | 'warning'
  className?: string
}

const iconTones = {
  neutral: 'bg-surface-2 text-muted',
  danger: 'bg-danger-soft text-danger',
  warning: 'bg-warning-soft text-warning',
}

export function EmptyState({ icon: Icon, title, children, action, tone = 'neutral', className }: EmptyStateProps) {
  return (
    <div className={cn('mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center animate-fade-up', className)}>
      <div className={cn('mb-4 grid size-12 place-items-center rounded-xl', iconTones[tone])}>
        <Icon className="size-6" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      {children && <div className="mt-2 text-sm text-muted">{children}</div>}
      {action && <div className="mt-6 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  )
}
