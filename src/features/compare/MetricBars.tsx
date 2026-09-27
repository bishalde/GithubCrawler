import { Trophy } from 'lucide-react'
import { compareMetric } from '../../lib/stats'
import { cn } from '../../lib/cn'

export interface Metric {
  label: string
  a: number
  b: number
  format: (n: number) => string
  /** Bar color for non-competitive rows (e.g. a language color). */
  color?: string
}

/** Mirrored bar rows: user A grows left from the center, user B grows right. */
export function MetricBars({ metrics, competitive = true }: { metrics: Metric[]; competitive?: boolean }) {
  return (
    <ul className="divide-y divide-border">
      {metrics.map((m) => {
        const winner = competitive ? compareMetric(m.a, m.b) : 'tie'
        const max = Math.max(m.a, m.b, 1)
        return (
          <li key={m.label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3 sm:gap-5">
            <Side value={m.a} max={max} win={winner === 'a'} color={m.color} format={m.format} align="right" />
            <span className="w-20 text-center text-xs font-medium text-muted sm:w-28">{m.label}</span>
            <Side value={m.b} max={max} win={winner === 'b'} color={m.color} format={m.format} align="left" />
          </li>
        )
      })}
    </ul>
  )
}

function Side({
  value,
  max,
  win,
  color,
  format,
  align,
}: {
  value: number
  max: number
  win: boolean
  color?: string
  format: (n: number) => string
  align: 'left' | 'right'
}) {
  const right = align === 'right'
  return (
    <div className={cn('flex items-center gap-3', right && 'flex-row-reverse')}>
      <div className={cn('flex h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2', right && 'justify-end')}>
        <div
          className={cn('h-full rounded-full transition-all duration-700', !color && (win ? 'bg-accent' : 'bg-border-strong'))}
          style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
        />
      </div>
      <span
        className={cn(
          'inline-flex min-w-16 items-center gap-1 font-mono text-sm tabular',
          right ? 'justify-end' : 'justify-start',
          win || (color && value > 0) ? 'font-semibold text-fg' : 'text-muted',
        )}
      >
        {win && right && <Trophy className="size-3.5 text-accent" aria-label="Leader" />}
        {format(value)}
        {win && !right && <Trophy className="size-3.5 text-accent" aria-label="Leader" />}
      </span>
    </div>
  )
}
