import type { GitHubRepo } from '../../lib/types'
import { languageBreakdown, OTHER_LANGUAGE } from '../../lib/stats'
import { Card, CardHeader } from '../../components/ui/Card'
import { languageColor } from '../../lib/languages'
import { MetricBars } from './MetricBars'

const pct = (n: number) => `${Math.round(n * 100)}%`

export function LanguageOverlap({ a, b }: { a: GitHubRepo[]; b: GitHubRepo[] }) {
  const la = new Map(languageBreakdown(a, 8).map((s) => [s.language, s.share]))
  const lb = new Map(languageBreakdown(b, 8).map((s) => [s.language, s.share]))
  const all = [...new Set([...la.keys(), ...lb.keys()])]
    .filter((l) => l !== OTHER_LANGUAGE)
    .sort((x, y) => (la.get(y) ?? 0) + (lb.get(y) ?? 0) - ((la.get(x) ?? 0) + (lb.get(x) ?? 0)))
    .slice(0, 8)
  const shared = all.filter((l) => la.has(l) && lb.has(l))

  return (
    <Card>
      <CardHeader
        title="Language mix"
        description={
          shared.length
            ? `${shared.length} shared: ${shared.slice(0, 4).join(', ')}${shared.length > 4 ? '…' : ''}`
            : 'No languages in common'
        }
      />
      {all.length === 0 ? (
        <p className="p-5 text-sm text-muted">No language data.</p>
      ) : (
        <div className="px-5 pb-2">
          <MetricBars
            competitive={false}
            metrics={all.map((l) => ({ label: l, a: la.get(l) ?? 0, b: lb.get(l) ?? 0, format: pct, color: languageColor(l) }))}
          />
        </div>
      )}
    </Card>
  )
}
