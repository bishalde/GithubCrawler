import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Tone = 'neutral' | 'accent' | 'positive' | 'warning'

const tones: Record<Tone, string> = {
  neutral: 'border-border text-muted',
  accent: 'border-transparent bg-accent-soft text-accent',
  positive: 'border-transparent bg-positive-soft text-positive',
  warning: 'border-transparent bg-warning-soft text-warning',
}

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium', tones[tone], className)}>
      {children}
    </span>
  )
}
