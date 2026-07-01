import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { searchRepos } from '../api/search'
import { RepoSkeleton } from '../components/Skeleton'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f7df1e', Go: '#00add8', Python: '#3572a5',
  Rust: '#dea584', Java: '#b07219', 'C++': '#f34b7d', Ruby: '#e0115f',
  HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', Kotlin: '#a97bff',
  Swift: '#ffac45', Dart: '#00b4ab', Unknown: '#6b7280',
}

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
      <Helmet>
        <title>Search — GitHub Tendency</title>
        <meta property="og:title" content="Search — GitHub Tendency" />
        <meta name="twitter:title" content="Search — GitHub Tendency" />
      </Helmet>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-orange-500">Search Repositories</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Search repositories..."
            className="w-full bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all"
          />
        </div>
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
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm text-gray-400">{data.totalCount.toLocaleString()} repositories</span>
            <span className="px-2 py-0.5 text-[10px] font-medium text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-full">{searchTerm}</span>
          </div>
          <div className="grid gap-4">
            {data.repositories.map((repo) => {
            const langColor = LANG_COLORS[repo.language] || '#6b7280'
            const langs = repo.languages ?? []
            const totalBytes = langs.reduce((s, l) => s + l.size, 0)
            return (
              <div key={repo.githubId} className="bg-black/40 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border border-white/[0.06] hover:border-orange-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-orange-600/15 animate-fade-up">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={`https://avatars.githubusercontent.com/${repo.owner}?size=28`}
                      alt={repo.owner}
                      className="w-7 h-7 rounded-full shrink-0 ring-1 ring-white/10 mt-0.5"
                      loading="lazy"
                    />
                    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-orange-500 font-medium hover:underline text-base sm:text-lg truncate block min-w-0">
                      {repo.fullName}
                    </a>
                    {repo.isArchived && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700/60 text-gray-400 font-medium shrink-0">archived</span>
                    )}
                  </div>
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="shrink-0 mt-2">
                    <svg className="w-4 h-4 text-gray-600 hover:text-orange-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed line-clamp-2 sm:line-clamp-none">{repo.description}</p>

                {(repo.topics ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(repo.topics ?? []).slice(0, 8).map(t => (
                      <button key={t} onClick={() => { setKeyword(t); setSearchTerm(t) }} className="text-[11px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400/80 border border-orange-500/15 hover:bg-orange-500/20 hover:text-orange-300 transition-all cursor-pointer">{t}</button>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: langColor }} />
                    <span className="text-orange-400/70">{repo.language}</span>
                  </span>
                  <span title="Stars" className="text-red-500 font-medium">⭐ {repo.stars.toLocaleString()}</span>
                  <span title="Forks">⑂ {repo.forks.toLocaleString()} forks</span>
                  <span title="Watchers">👁 {repo.watchers.toLocaleString()} watchers</span>
                  <span title="Open issues">!{repo.openIssues.toLocaleString()} issues</span>
                  {repo.license && <span title="License" className="text-[11px] text-gray-600">⚖ {repo.license}</span>}
                  {!repo.license && <span className="text-[11px] text-gray-600">⚖ No license</span>}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
                  {repo.homepageUrl && (
                    <a href={repo.homepageUrl} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors truncate max-w-[240px]" title="Homepage">
                      🌐 {repo.homepageUrl}
                    </a>
                  )}
                  {repo.latestRelease && (
                    <span title="Latest release">🏷 {repo.latestRelease}</span>
                  )}
                  <span title="Created">📦 {new Date(repo.createdAt).toLocaleDateString()}</span>
                  <span title="Last push">📅 {new Date(repo.lastPush).toLocaleDateString()}</span>
                </div>

                {langs.length > 1 && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] text-gray-500 shrink-0">Lang:</span>
                    <div className="flex h-1.5 rounded-full overflow-hidden flex-1 max-w-[240px] bg-gray-800/60">
                      {langs.slice(0, 5).map(l => {
                        const pct = totalBytes > 0 ? (l.size / totalBytes) * 100 : 0
                        if (pct < 1) return null
                        return <div key={l.name} style={{ width: `${pct}%`, backgroundColor: LANG_COLORS[l.name] || '#6b7280' }} title={`${l.name}: ${pct.toFixed(1)}%`} />
                      })}
                    </div>
                    <span className="text-[11px] text-gray-600" title="Repository size">{repo.diskUsage ? (repo.diskUsage > 1024 ? `${(repo.diskUsage / 1024).toFixed(1)} MB` : `${repo.diskUsage} KB`) : '-'}</span>
                  </div>
                )}
              </div>
            )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
