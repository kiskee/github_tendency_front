import { useQuery } from '@tanstack/react-query'
import { getTrends } from '../api/trends'
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

export default function Trends() {
  const { data, isLoading } = useQuery({
    queryKey: ['trends'],
    queryFn: () => getTrends({}),
  })

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

  const trends = data.data

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-orange-500">Trends</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {trends.map((t: any, i: number) => (
          <div key={t.id} className={`bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 sm:p-5 border border-orange-900/30 hover:border-orange-700/60 transition-all duration-300 hover:shadow-lg hover:shadow-orange-600/15 animate-fade-up stagger-${Math.min(i, 8)}`}>
            <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-red-500">{t.keyword}</h3>
                <p className="text-gray-600 text-xs">{t.repositories.length} repos · {t.trending_since || 'recent'}</p>
              </div>
              <div className="flex gap-2 text-xs flex-wrap">
                {t.tags?.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="bg-orange-900/30 text-orange-500/80 px-2 py-0.5 rounded-full border border-orange-800/30">{tag}</span>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              {t.repositories.slice(0, 5).map((repo: any, j: number) => (
                <a
                  key={repo.id}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-black/30 hover:bg-black/50 rounded-lg px-3 py-2 border border-gray-800/30 hover:border-gray-700/50 transition-all group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-gray-600 text-xs font-mono w-4 shrink-0">{j + 1}</span>
                    <span className="text-orange-500 text-xs sm:text-sm truncate">{repo.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
                    <LangDot lang={repo.language} />
                    <span className="text-red-500 font-medium">⭐ {repo.stars}</span>
                    <svg className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
