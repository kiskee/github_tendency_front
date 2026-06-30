import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTrends } from '../api/trends'

export default function Trends() {
  const [keywordFilter, setKeywordFilter] = useState('')
  const [sort, setSort] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['trends', keywordFilter, sort],
    queryFn: () => getTrends({ keyword: keywordFilter || undefined, sort: sort || undefined }),
  })

  const totalStars = (repos: any[]) => repos.reduce((s: number, r: any) => s + (r.stars || 0), 0)

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-orange-500">Trends</h2>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
        <input
          type="text"
          value={keywordFilter}
          onChange={e => setKeywordFilter(e.target.value)}
          placeholder="Filter by keyword..."
          className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 flex-1 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all"
        />
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-600/50 transition-all w-full sm:w-auto"
        >
          <option value="">Latest</option>
          <option value="stars">Stars</option>
          <option value="count">Search Count</option>
        </select>
      </div>

      {isLoading && <p className="text-gray-500">Loading...</p>}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {data.data.map(trend => {
            const topRepos = trend.repositories
              .sort((a: any, b: any) => b.stars - a.stars)
              .slice(0, 5)

            return (
              <div key={trend.id} className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 sm:p-5 border border-orange-900/30 hover:border-orange-700/60 transition-all duration-300 hover:shadow-lg hover:shadow-orange-600/15 flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-orange-500">{trend.keyword}</h3>
                    <p className="text-xs text-gray-600 mt-0.5">Last: {new Date(trend.last_searched_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <span className="text-xs bg-gray-800/80 text-gray-400 px-2.5 py-1 rounded-full whitespace-nowrap">{trend.search_count}x searched</span>
                    <span className="text-xs bg-red-900/30 text-red-400 px-2.5 py-1 rounded-full whitespace-nowrap">⭐ {totalStars(trend.repositories)}</span>
                  </div>
                </div>

                  {topRepos.length > 0 && (
                  <div className="mt-auto space-y-1.5 sm:space-y-2">
                    {topRepos.map((repo: any, i: number) => (
                      <div key={repo.id} className="flex items-center gap-2 sm:gap-3 bg-black/30 rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 border border-gray-800/20 hover:border-gray-700/50 transition-all group">
                        <span className="text-xs text-gray-600 font-mono w-3 sm:w-4 shrink-0">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm text-orange-500 hover:underline font-medium truncate block"
                          >
                            {repo.full_name}
                          </a>
                        </div>
                        <span className="text-xs text-gray-500 hidden sm:inline">{repo.language}</span>
                        <span className="text-xs text-red-500 font-medium shrink-0">⭐ {repo.stars}</span>
                      </div>
                    ))}
                    {trend.repositories.length > 5 && (
                      <p className="text-xs text-gray-600 text-center pt-1">+{trend.repositories.length - 5} more</p>
                    )}
                  </div>
                )}

                {topRepos.length === 0 && (
                  <p className="text-sm text-gray-600 text-center py-4">No repositories collected</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
