import { useQuery } from '@tanstack/react-query'
import { getReport } from '../api/trends'
import CountUp from './CountUp'

function SidebarSkeleton() {
  return (
    <div className="bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/[0.06] p-5 space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-5 bg-gray-800/50 rounded w-16" />
        <div className="h-3 bg-gray-800/50 rounded w-32" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-800/30 rounded-lg p-2 space-y-1">
            <div className="h-2 bg-gray-800/50 rounded w-8" />
            <div className="h-4 bg-gray-800/50 rounded w-10" />
          </div>
        ))}
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-800/50 rounded w-24" />
          <div className="h-8 bg-gray-800/30 rounded-lg" />
          <div className="h-8 bg-gray-800/30 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-0.5 h-4 bg-gradient-to-b from-orange-500 to-red-600 rounded-full" />
      <h4 className="text-xs font-semibold text-white/80 uppercase tracking-[0.08em]">{children}</h4>
    </div>
  )
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export default function ReportSidebar() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['report'],
    queryFn: getReport,
    refetchInterval: 120_000,
  })

  if (isLoading) return <SidebarSkeleton />

  if (error || !data) return (
    <div className="bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/[0.06] p-5 text-center">
      <p className="text-red-400/70 text-xs mb-3">Report unavailable</p>
      <button
        onClick={() => refetch()}
        className="text-xs text-orange-500 hover:text-orange-400 underline underline-offset-2"
      >
        Retry
      </button>
    </div>
  )

  return (
    <div className="bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/[0.06] p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Report</h3>
          <p className="text-gray-700 text-[10px] mt-0.5">
            {formatTime(data.generated_at)} — {new Date(data.generated_at).toLocaleDateString()}
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-orange-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/[0.03] rounded-lg p-2.5 border border-white/[0.04]">
          <p className="text-gray-700 text-[10px] font-medium uppercase tracking-wide">Repos</p>
          <p className="text-sm font-bold text-white mt-0.5"><CountUp value={data.totals.total_repos} /></p>
        </div>
        <div className="bg-white/[0.03] rounded-lg p-2.5 border border-white/[0.04]">
          <p className="text-gray-700 text-[10px] font-medium uppercase tracking-wide">Keywords</p>
          <p className="text-sm font-bold text-white mt-0.5"><CountUp value={data.totals.total_keywords} /></p>
        </div>
        <div className="bg-white/[0.03] rounded-lg p-2.5 border border-white/[0.04]">
          <p className="text-gray-700 text-[10px] font-medium uppercase tracking-wide">Owners</p>
          <p className="text-sm font-bold text-white mt-0.5"><CountUp value={data.totals.total_owners} /></p>
        </div>
      </div>

      <div>
        <SectionHeader>Top Repos</SectionHeader>
        <div className="space-y-1.5">
          {data.top_repos.slice(0, 5).map((repo, i) => (
            <a key={repo.full_name} href={repo.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/[0.03] transition-all">
              <span className={`text-[10px] font-mono w-4 shrink-0 ${i < 3 ? 'text-orange-500' : 'text-gray-700'}`}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-orange-400/90 truncate group-hover:text-orange-400 transition-colors">{repo.full_name}</p>
                <p className="text-[10px] text-gray-700">{repo.language}</p>
              </div>
              <span className="text-[11px] text-red-500/90 font-semibold shrink-0">{repo.stars.toLocaleString()}</span>
            </a>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader>Top Owners</SectionHeader>
        <div className="space-y-1.5">
          {data.top_owners.slice(0, 5).map((owner, i) => (
            <div key={owner.owner} className="flex items-center gap-2 py-1.5 px-2 rounded-lg">
              <span className={`text-[10px] font-mono w-4 shrink-0 ${i < 3 ? 'text-orange-500' : 'text-gray-700'}`}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white/80 truncate">{owner.owner}</p>
                <p className="text-[10px] text-gray-700">{owner.repo_count} repos</p>
              </div>
              <span className="text-[11px] text-gray-500 shrink-0">⭐{owner.total_stars.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader>Languages</SectionHeader>
        <div className="space-y-2">
          {data.language_breakdown.slice(0, 6).map((lang) => (
            <div key={lang.language} className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[11px] text-gray-400">{lang.language}</span>
                  <span className="text-[10px] text-gray-700">{Number(lang.percentage).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-700"
                    style={{ width: `${lang.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader>Per Keyword</SectionHeader>
        <div className="space-y-1.5">
          {data.per_keyword.slice(0, 5).map((k) => (
            <div key={k.keyword} className="flex items-center gap-2 py-1.5 px-2 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white/80 truncate">{k.keyword}</p>
                <p className="text-[10px] text-gray-700">{k.total_repos} repos</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-red-500/90 font-medium">⭐{Math.round(k.avg_stars).toLocaleString()}</p>
                <p className="text-[9px] text-gray-700">avg</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
