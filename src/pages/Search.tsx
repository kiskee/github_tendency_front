import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchRepos } from '../api/search'

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
      <h2 className="text-3xl font-bold mb-6 text-orange-500">Search Repositories</h2>
      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Enter keyword..."
          className="flex-1 bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all"
        />
        <button type="submit" className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-orange-600/20 active:scale-95">
          Search
        </button>
      </form>

      {isLoading && <p className="text-gray-500">Searching...</p>}

      {data && (
        <div>
          <p className="text-gray-500 mb-4">{data.totalCount} repositories found</p>
          <div className="grid gap-4">
            {data.repositories.map(repo => (
              <div key={repo.githubId} className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-5 border border-orange-900/30 hover:border-orange-700/60 transition-all duration-300 hover:shadow-lg hover:shadow-orange-600/15">
                <a href={repo.url} target="_blank" className="text-orange-500 font-medium hover:underline text-lg">
                  {repo.fullName}
                </a>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">{repo.description}</p>
                <div className="flex gap-5 mt-3 text-sm text-gray-500">
                  <span className="text-red-500 font-medium">⭐ {repo.stars}</span>
                  <span>⑂ {repo.forks}</span>
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
