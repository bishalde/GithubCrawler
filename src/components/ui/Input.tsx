import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

const field =
  'h-9 rounded-lg border border-border bg-surface px-3 text-sm text-fg placeholder:text-subtle ' +
  'transition-colors hover:border-border-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(field, className)} {...props} />
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(field, 'cursor-pointer pr-8', className)} {...props} />
}

export function Checkbox({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-2 text-sm text-muted hover:text-fg">
      <input type="checkbox" className="size-4 cursor-pointer rounded accent-(--accent)" {...props} />
      {label}
    </label>
  )
}
