import { useQuery } from '@tanstack/react-query'
import { getTrendsStats, getTrends } from '../api/trends'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const PIE_COLORS = ['#f97316', '#ef4444', '#dc2626', '#ea580c', '#c2410c', '#b91c1c', '#9a3412', '#7f1d1d']

export default function Dashboard() {
  const stats = useQuery({ queryKey: ['trends-stats'], queryFn: getTrendsStats })
  const trends = useQuery({ queryKey: ['trends-all'], queryFn: () => getTrends({ limit: 50 }) })

  if (stats.isLoading) return <p className="text-gray-500">Loading...</p>
  if (!stats.data) return <p className="text-red-500">Failed to load stats</p>

  const trendsData = trends.data?.data || []
  const hoverClass = 'bg-gray-900/50 backdrop-blur-xl rounded-xl p-5 border border-orange-900/30 hover:border-orange-700/60 transition-all duration-300 hover:shadow-lg hover:shadow-orange-600/15'

  const starsPerKeyword = trendsData
    .map(t => ({
      keyword: t.keyword.length > 10 ? t.keyword.slice(0, 10) + '…' : t.keyword,
      stars: t.repositories.reduce((s: number, r: any) => s + (r.stars || 0), 0),
      raw: t.keyword,
    }))
    .sort((a, b) => b.stars - a.stars)

  const langCount: Record<string, number> = {}
  trendsData.forEach(t =>
    t.repositories.forEach((r: any) => {
      const lang = r.language || 'Unknown'
      langCount[lang] = (langCount[lang] || 0) + 1
    }),
  )
  const langData = Object.entries(langCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  const topRepos = trendsData
    .flatMap(t => t.repositories.map((r: any) => ({ ...r, keyword: t.keyword })))
    .filter((r, i, arr) => arr.findIndex(x => x.id === r.id) === i)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 8)

  const cards = [
    { label: 'Keywords', value: stats.data.total_keywords },
    { label: 'Repositories', value: stats.data.total_repositories },
    { label: 'Total Searches', value: stats.data.total_searches },
    { label: 'Max Stars', value: stats.data.max_stars },
    { label: 'Top Language', value: stats.data.top_language },
  ]

  return (
    <div className="space-y-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-orange-500">Dashboard</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {cards.map(c => (
          <div key={c.label} className={hoverClass}>
            <p className="text-gray-500 text-xs tracking-wide uppercase">{c.label}</p>
            <p className="text-xl sm:text-2xl font-bold mt-1 text-red-500">{c.value}</p>
          </div>
        ))}
      </div>

      {starsPerKeyword.length > 0 && (
        <div className={hoverClass}>
          <h3 className="text-base sm:text-lg font-semibold text-orange-500 mb-4">Stars per Keyword</h3>
          <div className="w-full" style={{ aspectRatio: '16 / 9', maxHeight: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={starsPerKeyword} margin={{ left: -20, right: 10 }}>
                <XAxis dataKey="keyword" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={{ stroke: '#374151' }} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={{ stroke: '#374151' }} tickLine={false} width={40} />
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid #7c2d12', borderRadius: 8, color: '#f3f4f6', fontSize: 12 }}
                  labelFormatter={(_, p) => p[0]?.payload?.raw || ''}
                />
                <Bar dataKey="stars" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {langData.length > 0 && (
          <div className={hoverClass}>
            <h3 className="text-base sm:text-lg font-semibold text-orange-500 mb-4">Languages</h3>
            <div className="w-full" style={{ aspectRatio: '4 / 3', maxHeight: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={langData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="70%" label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {langData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#111', border: '1px solid #7c2d12', borderRadius: 8, color: '#f3f4f6' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {topRepos.length > 0 && (
          <div className={hoverClass}>
            <h3 className="text-base sm:text-lg font-semibold text-orange-500 mb-4">Top Repositories</h3>
            <div className="space-y-2 sm:space-y-3">
              {topRepos.map((repo, i) => (
                <div key={repo.id} className="flex items-center justify-between bg-black/30 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-800/30">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="text-gray-600 text-xs sm:text-sm font-mono w-4 sm:w-5 shrink-0">{i + 1}</span>
                    <div className="min-w-0">
                      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline text-xs sm:text-sm font-medium truncate block">
                        {repo.full_name}
                      </a>
                      <span className="text-gray-600 text-xs">{repo.keyword}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm shrink-0">
                    <span className="text-gray-500 hidden sm:inline">{repo.language}</span>
                    <span className="text-red-500 font-medium">⭐ {repo.stars}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
