import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { getTrendsStats, getTrends, type TrendRepo } from '../api/trends'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { CardSkeleton } from '../components/Skeleton'
import CountUp from '../components/CountUp'
import ReportSidebar from '../components/ReportSidebar'

const PIE_COLORS = ['#f97316', '#ef4444', '#dc2626', '#ea580c', '#c2410c', '#b91c1c', '#9a3412', '#7f1d1d']
const CARD_BG = 'bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/[0.06] hover:border-orange-500/20 transition-all duration-500 group'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f7df1e', Go: '#00add8', Python: '#3572a5',
  Rust: '#dea584', Java: '#b07219', 'C++': '#f34b7d', Ruby: '#e0115f',
  HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', Kotlin: '#a97bff',
  Swift: '#ffac45', Dart: '#00b4ab', Unknown: '#6b7280',
}

interface TooltipPayloadItem {
  value: number
  payload: {
    raw?: string
    forks?: number
    watchers?: number
    repoCount?: number
    avgStars?: number
  }
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) {
  if (active && payload?.length) {
    const p = payload[0].payload
    return (
      <div className="bg-black/80 backdrop-blur-xl border border-orange-500/30 rounded-xl px-4 py-3 shadow-2xl shadow-orange-600/10 space-y-1">
        <p className="text-white/90 text-sm font-medium">{p.raw || label}</p>
        <p className="text-orange-500 text-lg font-bold">{payload[0].value.toLocaleString()} ⭐ stars</p>
        <div className="text-[11px] text-gray-400 space-y-0.5">
          {p.repoCount != null && <p>📦 {p.repoCount} repos</p>}
          {p.forks != null && <p>⑂ {p.forks.toLocaleString()} forks</p>}
          {p.watchers != null && <p>👁 {p.watchers.toLocaleString()} watchers</p>}
          {p.avgStars != null && <p>⭐ avg {p.avgStars.toLocaleString(undefined, { maximumFractionDigits: 0 })} / repo</p>}
        </div>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const stats = useQuery({ queryKey: ['trends-stats'], queryFn: getTrendsStats })
  const trends = useQuery({ queryKey: ['trends-all'], queryFn: () => getTrends({ limit: 50 }) })

  if (stats.isLoading) return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-8 w-1 bg-orange-500 rounded-full animate-pulse" />
        <div className="h-8 w-48 bg-gray-800/50 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  )

  if (!stats.data) return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p className="text-red-400/80 text-lg font-medium">Failed to load stats</p>
      <button onClick={() => stats.refetch()} className="bg-orange-600 hover:bg-orange-500 px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-orange-600/25 active:scale-[0.97]">
        Retry
      </button>
    </div>
  )

  const trendsData = trends.data?.data || []

  const starsPerKeyword = trendsData
    .map(t => {
      const repos = t.repositories
      const totalStars = repos.reduce((s: number, r: TrendRepo) => s + (r.stars || 0), 0)
      return {
        keyword: t.keyword.length > 10 ? t.keyword.slice(0, 10) + '…' : t.keyword,
        stars: totalStars,
        forks: repos.reduce((s: number, r: TrendRepo) => s + (r.forks || 0), 0),
        watchers: repos.reduce((s: number, r: TrendRepo) => s + (r.watchers || 0), 0),
        repoCount: repos.length,
        avgStars: repos.length > 0 ? Math.round(totalStars / repos.length) : 0,
        raw: t.keyword,
      }
    })
    .sort((a, b) => b.stars - a.stars)

  const langMap = new Map<string, number>()
  trendsData.forEach(t =>
    t.repositories.forEach((r: TrendRepo) => {
      const lang = r.language || 'Unknown'
      langMap.set(lang, (langMap.get(lang) || 0) + 1)
    }),
  )
  const langData = [...langMap.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  const topRepos = trendsData
    .flatMap(t => t.repositories.map((r: TrendRepo) => ({ ...r, keyword: t.keyword })))
    .filter((r, i, arr) => {
      const rid = r.id ?? r.github_id
      if (rid == null) return true
      return arr.findIndex(x => (x.id ?? x.github_id) === rid) === i
    })
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 10)

  const statIcons: Record<string, React.ReactNode> = {
    'Keywords': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>,
    'Repositories': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>,
    'Searches': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg>,
    'Max Stars': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
    'Top Lang': <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>,
  }

  const cards = [
    { key: 'Keywords', label: 'Keywords', value: Number(stats.data.total_keywords), detail: `${trendsData.filter(t => t.repositories.length > 0).length} active` },
    { key: 'Repositories', label: 'Repositories', value: Number(stats.data.total_repositories), detail: `across ${stats.data.total_keywords} keywords` },
    { key: 'Searches', label: 'Searches', value: Number(stats.data.total_searches), detail: `since start` },
    { key: 'Max Stars', label: 'Max Stars', value: Number(stats.data.max_stars), detail: `single repo` },
    { key: 'Top Lang', label: 'Top Lang', value: stats.data.top_language, detail: `${langData.find(l => l.name === stats.data.top_language)?.value || 0} repos` },
  ]

  return (
    <div className="space-y-6 pb-8">
      <Helmet>
        <title>Dashboard — GitHub Tendency</title>
        <meta property="og:title" content="Dashboard — GitHub Tendency" />
        <meta name="twitter:title" content="Dashboard — GitHub Tendency" />
      </Helmet>
      <div className="flex items-center gap-4">
        <div className="h-8 w-1 bg-gradient-to-b from-orange-500 to-red-600 rounded-full" />
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Dashboard</h2>
          <p className="text-gray-600 text-sm mt-0.5">Real-time overview of tracked GitHub trends</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] gap-6 items-start">
        <div className="lg:sticky lg:top-24 lg:self-start min-w-0">
          <ReportSidebar />
        </div>

        <div className="space-y-10 min-w-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {cards.map((c, i) => {
          const langColor = c.key === 'Top Lang' ? LANG_COLORS[String(c.value)] || '#6b7280' : undefined
          return (
            <div key={c.key} className={`${CARD_BG} animate-fade-up stagger-${i} relative overflow-hidden flex flex-col`}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-5 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500/70 group-hover:bg-orange-500/20 group-hover:border-orange-500/30 transition-all duration-300">
                    {statIcons[c.key]}
                  </div>
                  <span className="text-gray-600 text-[11px] font-medium uppercase tracking-[0.12em]">{c.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {c.key === 'Top Lang' && langColor && (
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: langColor }} />
                  )}
                  <p className={`font-bold text-white tracking-tight ${c.key === 'Top Lang' ? 'text-base sm:text-lg lg:text-xl break-words' : 'text-xl sm:text-2xl lg:text-3xl truncate'}`}>
                    {typeof c.value === 'number' ? <CountUp value={c.value} /> : c.value}
                  </p>
                </div>
                <p className="text-gray-700 text-xs mt-1.5 group-hover:text-gray-500 transition-colors duration-300">{c.detail}</p>
              </div>
              {c.key !== 'Top Lang' && starsPerKeyword.length > 0 && (
                <div className="h-10 mx-2 mb-1 opacity-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={starsPerKeyword}>
                      <defs>
                        <linearGradient id={`sparkGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="stars" stroke="#f97316" strokeWidth={1.5} fill={`url(#sparkGrad-${i})`} dot={false} isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="relative bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className={`${CARD_BG} lg:col-span-3 animate-fade-up stagger-5 overflow-hidden`}>
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-red-600 rounded-full" />
                <h3 className="text-base font-semibold text-white/90">Stars per Keyword</h3>
                <span className="text-gray-700 text-xs ml-auto">{starsPerKeyword.length} keywords</span>
              </div>
              <div className="w-full" style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={starsPerKeyword} margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="50%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="keyword"
                      tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                      axisLine={{ stroke: '#1f2937', strokeWidth: 1 }}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      axisLine={{ stroke: '#1f2937', strokeWidth: 1 }}
                      tickLine={false}
                      width={50}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="stars" fill="url(#barGradient)" radius={[6, 6, 0, 0]} animationBegin={300} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {starsPerKeyword.length > 0 && (() => {
                const totalStars = starsPerKeyword.reduce((s, k) => s + k.stars, 0)
                const top = starsPerKeyword[0]
                const avg = Math.round(totalStars / starsPerKeyword.length)
                const mostRepos = [...starsPerKeyword].sort((a, b) => (b.repoCount ?? 0) - (a.repoCount ?? 0))[0]
                const topLegend = starsPerKeyword.slice(0, 5)
                return (
                  <div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                    <div className="bg-white/[0.03] rounded-xl p-3">
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">Top keyword</p>
                      <p className="text-orange-400 text-sm font-semibold truncate mt-0.5" title={top.raw}>{top.raw}</p>
                      <p className="text-gray-500 text-[11px] mt-0.5">{top.stars.toLocaleString()} ⭐</p>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-3">
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">Avg stars</p>
                      <p className="text-white text-sm font-semibold mt-0.5">{avg.toLocaleString()} ⭐</p>
                      <p className="text-gray-500 text-[11px] mt-0.5">per keyword</p>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-3">
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">Total stars</p>
                      <p className="text-white text-sm font-semibold mt-0.5">{totalStars.toLocaleString()} ⭐</p>
                      <p className="text-gray-500 text-[11px] mt-0.5">across {starsPerKeyword.length} keywords</p>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-3">
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">Most repos</p>
                      <p className="text-orange-400 text-sm font-semibold truncate mt-0.5" title={mostRepos.raw}>{mostRepos.raw}</p>
                      <p className="text-gray-500 text-[11px] mt-0.5">{mostRepos.repoCount ?? 0} repos</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 pt-4 border-t border-white/[0.06] text-[11px] text-gray-500">
                    <span className="text-gray-600 text-[10px] uppercase tracking-wider mr-1">Top keywords</span>
                    {topLegend.map((k, i) => (
                      <span key={k.raw} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: i === 0 ? '#f97316' : i === 1 ? '#ef4444' : i === 2 ? '#dc2626' : '#6b7280' }} />
                        <span className="text-gray-400">{k.raw}</span>
                        <span className="text-gray-600">{k.stars.toLocaleString()} ⭐</span>
                      </span>
                    ))}
                  </div>
                  </div>
                )
              })()}
            </div>
          </div>

          {langData.length > 0 && (
            <div className={`${CARD_BG} lg:col-span-2 animate-fade-up stagger-6`}>
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-red-600 rounded-full" />
                  <h3 className="text-base font-semibold text-white/90">Languages</h3>
                </div>
                  <div className="flex flex-col items-center gap-5">
                  <div className="relative w-full max-w-[200px]" style={{ aspectRatio: '1 / 1' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          {PIE_COLORS.map((_color, i) => (
                            <filter key={i} id={`glow-${i}`}>
                              <feGaussianBlur stdDeviation="2" result="blur" />
                              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                          ))}
                        </defs>
                        <Pie
                          data={langData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius="85%"
                          innerRadius="45%"
                          paddingAngle={3}
                          strokeWidth={0}
                        >
                          {langData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} filter={`url(#glow-${i})`} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: '#000000cc', backdropFilter: 'blur(12px)', border: '1px solid rgba(234,88,12,0.3)', borderRadius: 12, color: '#f3f4f6', fontSize: 13 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold text-white"><CountUp value={stats.data.total_repositories} /></span>
                      <span className="text-[10px] text-gray-600 uppercase tracking-wider">total</span>
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    {langData.map((l, i) => (
                      <div key={l.name} className="flex items-center gap-3 py-1.5 px-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-black" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-gray-400 text-sm flex-1">{l.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 sm:w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${(l.value / langData[0].value) * 100}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                            />
                          </div>
                          <span className="text-gray-500 text-xs font-mono w-6 text-right">{l.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {topRepos.length > 0 && (
          <div className={`${CARD_BG} animate-fade-up stagger-7`}>
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-red-600 rounded-full" />
                <h3 className="text-base font-semibold text-white/90">Top Repositories</h3>
                <span className="text-gray-700 text-xs ml-auto">by stars</span>
              </div>
              <div className="space-y-1.5">
                  {topRepos.map((repo, i) => {
                  const langColor = LANG_COLORS[repo.language] || '#6b7280'
                  return (
                  <div
                    key={repo.id ?? repo.github_id ?? `${repo.full_name}-${i}`}
                    className="group px-4 py-3 rounded-xl hover:bg-white/[0.03] transition-all duration-200 relative overflow-hidden"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-full transition-all duration-300 group-hover:opacity-100 ${i < 3 ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: langColor }} />
                      <img
                        src={`https://avatars.githubusercontent.com/${repo.owner}?size=24`}
                        alt={repo.owner}
                        className="w-6 h-6 rounded-full shrink-0 ring-1 ring-white/10 mt-1"
                        loading="lazy"
                      />
                      <div className={`
                        w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5
                        ${i < 3
                          ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-500'
                          : 'bg-white/[0.04] border border-white/[0.06] text-gray-600'
                        }
                      `}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-orange-400/90 hover:text-orange-400 text-sm font-medium truncate transition-colors">
                            {repo.full_name}
                          </a>
                          {repo.is_archived && <span className="text-[9px] px-1 py-0.5 rounded bg-gray-700/60 text-gray-400 shrink-0">archived</span>}
                          {repo.latest_release && <span className="text-[9px] text-gray-600 shrink-0">🏷 {repo.latest_release}</span>}
                        </div>
                        {repo.description && <p className="text-gray-500 text-[11px] mt-0.5 leading-relaxed line-clamp-1">{repo.description}</p>}
                        {(repo.topics ?? []).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(repo.topics ?? []).slice(0, 4).map(t => (
                              <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400/70 border border-orange-500/15">{t}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: langColor }} />
                          <span className="text-gray-600 text-xs">{repo.language || 'Unknown'}</span>
                          <span className="text-gray-700 text-xs">· {repo.keyword}</span>
                          {repo.license && <span className="text-gray-600 text-[10px]">⚖ {repo.license}</span>}
                        </div>
                        {(repo.languages ?? []).length > 1 && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] text-gray-600 shrink-0">Lang:</span>
                            <div className="flex h-1 rounded-full overflow-hidden flex-1 max-w-[140px] bg-gray-800/60">
                              {(() => {
                                const tb = (repo.languages ?? []).reduce((s, l) => s + l.size, 0)
                                return (repo.languages ?? []).slice(0, 5).map(l => {
                                  const pct = tb > 0 ? (l.size / tb) * 100 : 0
                                  if (pct < 1) return null
                                  return <div key={l.name} style={{ width: `${pct}%`, backgroundColor: LANG_COLORS[l.name] || '#6b7280' }} title={`${l.name}: ${pct.toFixed(1)}%`} />
                                })
                              })()}
                            </div>
                            <span className="text-[10px] text-gray-600">{repo.disk_usage ? (repo.disk_usage > 1024 ? `${(repo.disk_usage / 1024).toFixed(1)} MB` : `${repo.disk_usage} KB`) : '-'}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="flex items-center gap-1.5 text-red-500/90 text-sm font-semibold whitespace-nowrap">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                          {repo.stars.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                          <span title="Forks">⑂ {repo.forks?.toLocaleString()}</span>
                          {repo.watchers != null && <span title="Watchers">👁 {repo.watchers.toLocaleString()}</span>}
                        </div>
                        <svg className="w-4 h-4 text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
