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

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-orange-500">Trends</h2>

      <div className="flex gap-4 mb-8">
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
          className="bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-600/50 transition-all"
        >
          <option value="">Latest</option>
          <option value="stars">Stars</option>
          <option value="count">Search Count</option>
        </select>
      </div>

      {isLoading && <p className="text-gray-500">Loading...</p>}

      {data && (
        <div className="grid gap-5">
          {data.data.map(trend => (
            <div key={trend.id} className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-5 border border-orange-900/30 hover:border-orange-700/60 transition-all duration-300 hover:shadow-lg hover:shadow-orange-600/15">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium text-orange-500">{trend.keyword}</h3>
                <span className="text-sm text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">Searched {trend.search_count}x</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Last: {new Date(trend.last_searched_at).toLocaleString()}</p>
              {trend.repositories.length > 0 && (
                <div className="mt-4 grid gap-3">
                  {trend.repositories.map((repo: any) => (
                    <div key={repo.id} className="bg-black/30 rounded-xl p-3 text-sm border border-gray-800/30 hover:border-gray-700/50 transition-all">
                      <a href={repo.url} target="_blank" className="text-orange-500 hover:underline font-medium">{repo.full_name}</a>
                      <span className="text-red-500 ml-3">⭐ {repo.stars}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
