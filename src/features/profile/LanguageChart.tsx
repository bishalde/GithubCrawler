import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { GitHubRepo } from '../../lib/types'
import { languageBreakdown } from '../../lib/stats'
import { languageColor } from '../../lib/languages'
import { Card, CardHeader } from '../../components/ui/Card'
import { LanguageDot } from './LanguageDot'
import { tooltipStyle } from './charts'

export function LanguageChart({ repos }: { repos: GitHubRepo[] }) {
  const data = languageBreakdown(repos)
  const total = data.reduce((s, d) => s + d.count, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader title="Languages" description="Primary language of each original (non-fork) repo" />
      {data.length === 0 ? (
        <p className="p-5 text-sm text-muted">No language data yet.</p>
      ) : (
        <div className="flex flex-1 flex-col items-center gap-6 p-5 sm:flex-row">
          <div className="relative size-44 shrink-0" role="img" aria-label="Language breakdown donut chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="language"
                  innerRadius="68%"
                  outerRadius="100%"
                  paddingAngle={2}
                  stroke="none"
                  isAnimationActive
                >
                  {data.map((d) => (
                    <Cell key={d.language} fill={languageColor(d.language)} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  itemStyle={{ color: 'var(--fg)' }}
                  formatter={(value) => [`${value} repos`, '']}
                  separator=""
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="font-mono text-2xl font-semibold tabular">{total}</div>
                <div className="text-[11px] text-muted">repos</div>
              </div>
            </div>
          </div>
          <ul className="w-full space-y-2 text-sm">
            {data.map((d) => (
              <li key={d.language} className="flex items-center gap-2">
                <LanguageDot language={d.language} />
                <span className="flex-1 truncate">{d.language}</span>
                <span className="font-mono text-xs text-muted tabular">{Math.round(d.share * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
