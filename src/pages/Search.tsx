import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchRepos } from '../api/search'
import { RepoSkeleton } from '../components/Skeleton'

const SUGGESTIONS = ['typescript', 'kubernetes', 'go', 'rust', 'python', 'react', 'tailwindcss', 'opentelemetry']

export default function Search() {
  const [keyword, setKeyword] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: () => searchRepos(searchTerm),
    enabled: searchTerm.length > 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (keyword.trim()) setSearchTerm(keyword.trim())
  }

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-orange-500">Search Repositories</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Enter keyword..."
          className="flex-1 bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all"
        />
        <button type="submit" className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-orange-600/20 active:scale-95 w-full sm:w-auto">
          Search
        </button>
      </form>

      {!searchTerm && !isLoading && (
        <div className="mb-8">
          <p className="text-gray-500 text-sm mb-3">Try searching for:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => { setKeyword(s); setSearchTerm(s) }}
                className="text-xs bg-gray-800/60 hover:bg-orange-600/20 text-gray-400 hover:text-orange-400 px-3 py-1.5 rounded-full border border-gray-700/50 hover:border-orange-700/50 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => <RepoSkeleton key={i} />)}
        </div>
      )}

      {data && (
        <div>
          <p className="text-gray-500 mb-4">{data.totalCount.toLocaleString()} repositories found</p>
          <div className="grid gap-4">
            {data.repositories.map((repo, i) => (
              <div key={repo.githubId} className={`bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 sm:p-5 border border-orange-900/30 hover:border-orange-700/60 transition-all duration-300 hover:shadow-lg hover:shadow-orange-600/15 animate-fade-up stagger-${Math.min(i, 8)}`}>
                <div className="flex items-start justify-between gap-3">
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-orange-500 font-medium hover:underline text-base sm:text-lg truncate block min-w-0">
                    {repo.fullName}
                  </a>
                  <svg className="w-4 h-4 text-gray-600 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed line-clamp-2 sm:line-clamp-none">{repo.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-gray-500">
                  <span className="text-red-500 font-medium">⭐ {repo.stars.toLocaleString()}</span>
                  <span>⑂ {repo.forks.toLocaleString()}</span>
                  <span className="text-orange-400/70">{repo.language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
