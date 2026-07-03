import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { getTrends, type TrendSearch, type TrendRepo } from '../api/trends'
import { TrendSkeleton } from '../components/Skeleton'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Go: '#00add8',
  Python: '#3572a5',
  Rust: '#dea584',
  Java: '#b07219',
  'C++': '#f34b7d',
  Ruby: '#e0115f',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Kotlin: '#a97bff',
  Swift: '#ffac45',
  Dart: '#00b4ab',
  Unknown: '#6b7280',
}

function LangDot({ lang }: { lang: string | null }) {
  const l = lang || 'Unknown'
  const color = LANG_COLORS[l] || '#6b7280'
  return (
    <span className="inline-flex items-center gap-1.5 text-gray-500 text-xs">
      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      {l}
    </span>
  )
}

const TAG_COLORS: Record<string, string> = {
  ai: '#8b5cf6', ml: '#8b5cf6', data: '#6366f1',
  web: '#0ea5e9', frontend: '#0ea5e9', ui: '#06b6d4',
  backend: '#10b981', api: '#10b981', devops: '#14b8a6',
  tool: '#f59e0b', cli: '#f59e0b', database: '#84cc16',
  default: '#f97316',
}

function tagColor(tag: string): string {
  const lower = tag.toLowerCase()
  for (const [key, color] of Object.entries(TAG_COLORS)) {
    if (lower.includes(key)) return color
  }
  return TAG_COLORS.default
}

const SORT_OPTIONS = [
  { value: '', label: 'Last searched' },
  { value: 'score', label: 'Trending score' },
  { value: 'stars', label: 'Max stars' },
  { value: 'count', label: 'Search count' },
]

const REPO_LIMIT_OPTIONS = [5, 10, 20, 50]

export default function Trends() {
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState('score')
  const [page, setPage] = useState(1)
  const [repoLimit, setRepoLimit] = useState(10)

  const { data, isLoading } = useQuery({
    queryKey: ['trends', { keyword, sort, page, repoLimit }],
    queryFn: () => getTrends({ keyword, sort, page, limit: 6, repoLimit }),
  })

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0

  const handleKeywordChange = (value: string) => {
    setKeyword(value)
    setPage(1)
  }

  if (isLoading) return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-orange-500">Trends</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => <TrendSkeleton key={i} />)}
      </div>
    </div>
  )

  if (!data || data.data.length === 0) return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg mb-2">No trends data yet</p>
      <p className="text-gray-600 text-sm">Run a collection from the backend to populate trends</p>
    </div>
  )

  return (
    <div>
      <Helmet>
        <title>Trends — RepoTendency</title>
        <meta property="og:title" content="Trends — RepoTendency" />
        <meta name="twitter:title" content="Trends — RepoTendency" />
      </Helmet>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-orange-500">Trends</h2>
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={keyword}
              onChange={e => handleKeywordChange(e.target.value)}
              placeholder="Filter keywords..."
              className="w-full bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-gray-500">Sort:</label>
              <select
                id="sort"
                value={sort}
                onChange={e => { setSort(e.target.value); setPage(1) }}
                className="bg-gray-900/60 border border-gray-800/50 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-orange-600/50"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="repoLimit" className="text-gray-500">Repos/keyword:</label>
              <select
                id="repoLimit"
                value={repoLimit}
                onChange={e => { setRepoLimit(Number(e.target.value)); setPage(1) }}
                className="bg-gray-900/60 border border-gray-800/50 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-orange-600/50"
              >
                {REPO_LIMIT_OPTIONS.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-gray-500 text-sm">
              {data.total} keywords
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-700/60 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm"
              >
                Prev
              </button>
              <span className="text-gray-400 text-sm">
                Page {data.page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-700/60 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {data.data.map((t: TrendSearch) => {
          const maxScore = Math.max(...t.repositories.map(r => r.score || 0), 1)
          return (
            <div key={t.id} className="bg-black/40 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border border-white/[0.06] hover:border-orange-500/20 transition-all duration-300 animate-fade-up">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-red-500">{t.keyword}</h3>
                  <p className="text-gray-600 text-xs">{t.repositories.length} repos shown · {t.search_count} searches</p>
                </div>
                <div className="flex gap-2 text-xs flex-wrap">
                  {t.repositories.slice(0, 3).flatMap(r => r.topics ?? []).slice(0, 3).map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full border" style={{ backgroundColor: `${tagColor(tag)}20`, color: tagColor(tag), borderColor: `${tagColor(tag)}40` }}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {t.repositories.map((repo: TrendRepo, j: number) => {
                  const langs = repo.languages ?? []
                  const topics = repo.topics ?? []
                  return (
                    <div key={repo.githubId} className="bg-black/30 hover:bg-black/50 rounded-lg px-3 py-2.5 border border-gray-800/30 hover:border-gray-700/50 transition-all group">
                      <div className="flex items-start gap-2">
                        <img
                          src={`https://avatars.githubusercontent.com/${repo.owner}?size=20`}
                          alt=""
                          className="w-4 h-4 rounded-full shrink-0 ring-1 ring-white/10 mt-0.5"
                          loading="lazy"
                        />
                        <span className="text-gray-600 text-[10px] font-mono w-3 shrink-0 mt-0.5">{j + 1}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-orange-500 text-xs sm:text-sm font-medium hover:underline truncate">
                              {repo.fullName}
                            </a>
                            {repo.isArchived && (
                              <span className="text-[9px] px-1 py-0.5 rounded bg-gray-700/60 text-gray-400 shrink-0">archived</span>
                            )}
                            {repo.latestRelease && (
                              <span className="text-[9px] text-gray-600 shrink-0">🏷 {repo.latestRelease}</span>
                            )}
                            {repo.homepageUrl && (
                              <a href={repo.homepageUrl} target="_blank" rel="noopener noreferrer" className="text-[9px] text-gray-600 hover:text-orange-400 truncate max-w-[120px]">🌐</a>
                            )}
                          </div>
                          {topics.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {topics.slice(0, 4).map(t => (
                                <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400/70 border border-orange-500/15">{t}</span>
                              ))}
                            </div>
                          )}
                          <p className="text-gray-500 text-[11px] mt-1 leading-relaxed line-clamp-1">{repo.description}</p>
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-1.5 text-[11px] text-gray-500">
                            <LangDot lang={repo.language} />
                            <span className="text-red-500 font-medium">⭐ {repo.stars.toLocaleString()}</span>
                            <span>⑂ {repo.forks.toLocaleString()} forks</span>
                            {repo.watchers != null && <span>👁 {repo.watchers.toLocaleString()} watchers</span>}
                            {repo.openIssues != null && <span>!{repo.openIssues.toLocaleString()} issues</span>}
                            {repo.license && <span className="text-gray-600">⚖ {repo.license}</span>}
                            {!repo.license && <span className="text-gray-600">⚖ No license</span>}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2.5 mt-1 text-[10px] text-gray-500">
                            <span title="Score" className="text-orange-400 font-medium">🔥 {repo.score?.toLocaleString() || 0}</span>
                            <span title="Stars last 24h">+24h {repo.stars24h?.toLocaleString() || 0}</span>
                            <span title="Stars last 7d">+7d {repo.stars7d?.toLocaleString() || 0}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2.5 mt-1 text-[10px] text-gray-600">
                            <span title="Created">📦 {repo.createdAt ? new Date(repo.createdAt).toLocaleDateString() : '-'}</span>
                            <span title="Last push">📅 {repo.lastPush ? new Date(repo.lastPush).toLocaleDateString() : '-'}</span>
                          </div>
                          {langs.length > 1 && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="text-[10px] text-gray-600 shrink-0">Lang:</span>
                              <div className="flex h-1 rounded-full overflow-hidden flex-1 max-w-[160px] bg-gray-800/60">
                                {(() => {
                                  const tb = langs.reduce((s, l) => s + l.size, 0)
                                  return langs.slice(0, 5).map(l => {
                                    const pct = tb > 0 ? (l.size / tb) * 100 : 0
                                    if (pct < 1) return null
                                    return <div key={l.name} style={{ width: `${pct}%`, backgroundColor: LANG_COLORS[l.name] || '#6b7280' }} title={`${l.name}: ${pct.toFixed(1)}%`} />
                                  })
                                })()}
                              </div>
                              <span className="text-[10px] text-gray-600">{repo.diskUsage ? (repo.diskUsage > 1024 ? `${(repo.diskUsage / 1024).toFixed(1)} MB` : `${repo.diskUsage} KB`) : '-'}</span>
                            </div>
                          )}
                        </div>
                        <div className="hidden sm:flex w-12 shrink-0 flex-col items-end gap-1 pt-1">
                          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all" style={{ width: `${(repo.score / maxScore) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
