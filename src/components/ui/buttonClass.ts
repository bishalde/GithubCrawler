import { cn } from '../../lib/cn'

export type Variant = 'primary' | 'secondary' | 'ghost'
export type Size = 'sm' | 'md' | 'icon'

const variants: Record<Variant, string> = {
  primary: 'bg-fg text-bg hover:opacity-90 shadow-sm',
  secondary: 'border border-border bg-surface text-fg hover:bg-surface-2 hover:border-border-strong',
  ghost: 'text-muted hover:text-fg hover:bg-surface-2',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  icon: 'size-9',
}

export function buttonClass(variant: Variant = 'secondary', size: Size = 'md', className?: string) {
  return cn(
    'inline-flex shrink-0 items-center justify-center rounded-lg font-medium transition-colors',
    'disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )
}
