import type { CSSProperties } from 'react'

/** Shared Recharts tooltip styling that follows the theme tokens. */
export const tooltipStyle: CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  fontSize: 12,
  color: 'var(--fg)',
  boxShadow: '0 8px 24px rgb(0 0 0 / 0.12)',
}
