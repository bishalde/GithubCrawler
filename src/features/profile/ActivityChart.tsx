import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { GitHubRepo } from '../../lib/types'
import { reposPerYear } from '../../lib/stats'
import { Card, CardHeader } from '../../components/ui/Card'
import { tooltipStyle } from './charts'

export function ActivityChart({ repos }: { repos: GitHubRepo[] }) {
  const data = reposPerYear(repos)
  const total = data.reduce((s, d) => s + d.count, 0)
  const peak = data.reduce((best, d) => (d.count > best.count ? d : best), data[0] ?? { year: 0, count: 0 })

  return (
    <Card>
      <CardHeader
        title="Repos created per year"
        description={total ? `${total} original repos · busiest year ${peak.year} (${peak.count})` : undefined}
      />
      {data.length === 0 ? (
        <p className="p-5 text-sm text-muted">No repositories yet.</p>
      ) : (
        <div className="h-56 p-3 pr-5" role="img" aria-label={`Bar chart of repositories created per year, peaking in ${peak.year}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: -16 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} width={40} />
              <Tooltip
                cursor={{ fill: 'var(--surface-2)' }}
                contentStyle={tooltipStyle}
                labelStyle={{ color: 'var(--muted)' }}
                itemStyle={{ color: 'var(--fg)' }}
                formatter={(value) => [value, 'Repos']}
              />
              <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
