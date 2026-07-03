import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import {
  getTrackedRepos,
  addTrackedRepo,
  removeTrackedRepo,
  getRepoHistory,
  getRepoCommits,
  refreshRepoCommits,
  refreshAllRepoData,
  getRepoPRs,
  getRepoIssues,
  getRepoBranches,
  getRepoReleases,
  getRepoActivity,
  getRepoScanHistory,
  type TrackedRepo,
  type SnapshotPoint,
  type CommitInfo,
  type PRInfo,
  type IssueInfo,
  type BranchInfo,
  type ReleaseInfo,
  type ScanHistoryEntry,
} from '../api/user'

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString()
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(iso)
}

function AddRepoSection() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [fullName, setFullName] = useState('')
  const { data: repos } = useQuery({
    queryKey: ['tracked-repos'],
    queryFn: getTrackedRepos,
  })
  const mutation = useMutation({
    mutationFn: addTrackedRepo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracked-repos'] })
      setFullName('')
    },
  })

  const isAdmin = user?.role === 'admin'
  const isLimitReached = !isAdmin && repos && repos.data && repos.data.length >= 1
  const isValidFormat = fullName.match(/^[^/]+\/[^/]+$/)

  return (
    <div className="bg-black/40 backdrop-blur-2xl rounded-2xl p-6 border border-white/[0.06] hover:border-orange-500/20 transition-all duration-300 animate-fade-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Track a repository</h3>
          <p className="text-gray-500 text-xs">
            {isLimitReached ? 'Free plan: 1 repository limit reached' : 'Add owner/repo to start tracking'}
          </p>
        </div>
      </div>

      {isLimitReached ? (
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm">
          You're tracking {repos.data![0].repository.fullName}. Upgrade your plan to track more repositories.
        </div>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault()
            if (fullName.trim() && isValidFormat) mutation.mutate(fullName.trim())
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="owner/repo"
              className="w-full bg-gray-900/60 border border-gray-800/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all"
            />
            {fullName && !isValidFormat && (
              <p className="text-red-400 text-xs mt-1">Format must be owner/repo</p>
            )}
          </div>
          <button
            type="submit"
            disabled={mutation.isPending || !fullName.trim() || !isValidFormat}
            className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 px-5 py-2.5 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-orange-600/20 active:scale-95"
          >
            {mutation.isPending ? 'Adding...' : 'Add Repository'}
          </button>
        </form>
      )}

      {mutation.isPending && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span>Fetching repository data...</span>
        </div>
      )}

      {mutation.isSuccess && (
        <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          Repository added successfully!
        </div>
      )}

      {mutation.isError && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {mutation.error instanceof Error ? mutation.error.message : 'Failed to add repository'}
        </div>
      )}
    </div>
  )
}

function RepoHistory({ repoId }: { repoId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['repo-history', repoId],
    queryFn: () => getRepoHistory(repoId),
  })
  const { data: scanData, isLoading: scanLoading } = useQuery({
    queryKey: ['repo-scan-history', repoId],
    queryFn: () => getRepoScanHistory(repoId, 10),
  })

  if (isLoading || scanLoading) {
    return (
      <div className="flex items-center gap-2 py-4">
        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-500 text-xs">Loading history...</span>
      </div>
    )
  }

  const hasChartData = data && data.data.length >= 2
  const hasScans = scanData && scanData.data.length > 0

  if (!hasChartData && !hasScans) {
    return (
      <div className="py-4 text-center">
        <p className="text-gray-500 text-xs">Not enough history yet. Check back later.</p>
        <p className="text-gray-600 text-[10px] mt-1">History updates every hour with new snapshots.</p>
      </div>
    )
  }

  const chartData = hasChartData ? data.data.map((s: SnapshotPoint) => ({
    date: formatDate(s.collectedAt),
    stars: s.stars,
    forks: s.forks,
  })) : []

  const statusColors: Record<string, string> = {
    success: 'bg-green-500',
    error: 'bg-red-500',
  }

  return (
    <div className="mt-4 pt-4 border-t border-white/[0.06]">
      {hasChartData && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Stars & Forks History</p>
            <span className="text-gray-600 text-[10px]">{data.data.length} data points</span>
          </div>
          <div className="h-48 bg-gray-900/40 rounded-xl p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#374151' }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#374151' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.75rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)' }}
                  labelStyle={{ color: '#9ca3af' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Line type="monotone" dataKey="stars" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', strokeWidth: 0, r: 3 }} activeDot={{ r: 5, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} />
                <Line type="monotone" dataKey="forks" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }} activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2 justify-center">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-orange-500" /><span className="text-gray-500 text-[10px]">Stars</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" /><span className="text-gray-500 text-[10px]">Forks</span></div>
          </div>
        </>
      )}

      {hasScans && (
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Scan History</p>
            <span className="text-gray-600 text-[10px]">{scanData.total} scans</span>
          </div>
          <div className="space-y-2">
            {scanData.data.map((scan: ScanHistoryEntry) => (
              <div key={scan.id} className="bg-black/30 rounded-lg p-3 border border-gray-800/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusColors[scan.status] || 'bg-gray-500'}`} />
                    <span className="text-gray-300 text-xs font-medium">
                      {new Date(scan.scanned_at).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-gray-600 text-[10px]">{scan.duration_ms}ms</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px]">
                  <div className="text-center">
                    <p className="text-orange-400 font-medium">{scan.commits_found}</p>
                    <p className="text-gray-600">Commits</p>
                  </div>
                  <div className="text-center">
                    <p className="text-green-400 font-medium">{scan.prs_merged}</p>
                    <p className="text-gray-600">PRs Merged</p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-400 font-medium">{scan.issues_closed}</p>
                    <p className="text-gray-600">Issues Closed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-red-500 font-medium">+{scan.stars_delta_24h}</p>
                    <p className="text-gray-600">Stars 24h</p>
                  </div>
                </div>
                {scan.error_message && (
                  <p className="text-red-400 text-[10px] mt-2">{scan.error_message}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function RepoCommits({ repoId, fullName }: { repoId: number; fullName: string }) {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const limit = 10
  
  const { data, isLoading } = useQuery({
    queryKey: ['repo-commits', repoId, page],
    queryFn: () => getRepoCommits(repoId, limit, page * limit),
  })

  const refreshMutation = useMutation({
    mutationFn: () => refreshRepoCommits(repoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repo-commits', repoId] })
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4">
        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-500 text-xs">Loading commits...</span>
      </div>
    )
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-gray-500 text-xs">No commits found yet.</p>
        <p className="text-gray-600 text-[10px] mt-1">Commits will appear after the next hourly scan.</p>
        <button
          onClick={() => refreshMutation.mutate()}
          disabled={refreshMutation.isPending}
          className="mt-2 px-3 py-1.5 text-[10px] text-orange-400 hover:text-orange-300 border border-orange-500/30 rounded-lg hover:bg-orange-500/10 transition-all disabled:opacity-50"
        >
          {refreshMutation.isPending ? 'Fetching...' : 'Fetch Commits Now'}
        </button>
      </div>
    )
  }

  const totalPages = Math.ceil(data.total / limit)

  return (
    <div className="mt-4 pt-4 border-t border-white/[0.06]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Recent commits for {fullName}</p>
        <span className="text-gray-600 text-[10px]">{data.total} total commits</span>
      </div>
      
      <div className="space-y-2">
        {data.data.map((commit: CommitInfo) => (
          <div key={commit.sha} className="bg-black/30 rounded-lg p-3 border border-gray-800/30">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-gray-300 text-xs font-medium line-clamp-2">{commit.message}</p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-500">
                  <span className="text-orange-400">{commit.authorName || 'Unknown'}</span>
                  <span>·</span>
                  <span>{commit.authorDate ? new Date(commit.authorDate).toLocaleDateString() : 'Unknown date'}</span>
                  <span>·</span>
                  <a 
                    href={commit.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-orange-400 transition-colors"
                  >
                    {commit.sha.substring(0, 7)}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="text-xs text-gray-400 hover:text-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Newer
          </button>
          <span className="text-gray-500 text-[10px]">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="text-xs text-gray-400 hover:text-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Older →
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================
// Activity Summary Card
// ============================================

function ActivityCard({ repoId }: { repoId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ['repo-activity', repoId],
    queryFn: () => getRepoActivity(repoId),
  })

  if (isLoading) {
    return <div className="flex items-center gap-2 py-2"><div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /><span className="text-gray-500 text-xs">Loading activity...</span></div>
  }

  if (!data) return null

  const items = [
    { label: 'Commits (7d)', value: data.commits7d, color: 'text-orange-400' },
    { label: 'PRs Merged', value: data.prsMerged7d, color: 'text-green-400' },
    { label: 'PRs Open', value: data.totalOpenPrs, color: 'text-blue-400' },
    { label: 'Issues Open', value: data.totalOpenIssues, color: 'text-yellow-400' },
    { label: 'Issues Closed', value: data.issuesClosed7d, color: 'text-purple-400' },
    { label: 'Branches', value: data.totalBranches, color: 'text-gray-400' },
  ]

  return (
    <div className="mt-3 pt-3 border-t border-white/[0.06]">
      <p className="text-gray-500 text-[10px] font-medium uppercase tracking-wider mb-2">Activity (7d)</p>
      <div className="grid grid-cols-3 gap-2">
        {items.map(item => (
          <div key={item.label} className="text-center">
            <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
            <p className="text-gray-600 text-[9px]">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// PRs Section
// ============================================

function RepoPRs({ repoId, fullName }: { repoId: number; fullName: string }) {
  const [page, setPage] = useState(0)
  const [stateFilter, setStateFilter] = useState<string>('')
  const limit = 10

  const { data, isLoading } = useQuery({
    queryKey: ['repo-prs', repoId, page, stateFilter],
    queryFn: () => getRepoPRs(repoId, stateFilter || undefined, limit, page * limit),
  })

  if (isLoading) return <div className="flex items-center gap-2 py-4"><div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /><span className="text-gray-500 text-xs">Loading PRs...</span></div>

  if (!data || data.data.length === 0) {
    return <div className="py-4 text-center"><p className="text-gray-500 text-xs">No pull requests found.</p></div>
  }

  const stateColors: Record<string, string> = {
    OPEN: 'text-green-400 bg-green-500/10',
    CLOSED: 'text-red-400 bg-red-500/10',
    MERGED: 'text-purple-400 bg-purple-500/10',
  }

  const totalPages = Math.ceil(data.total / limit)

  return (
    <div className="mt-4 pt-4 border-t border-white/[0.06]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Pull Requests · {fullName}</p>
        <div className="flex gap-1">
          {['', 'OPEN', 'MERGED', 'CLOSED'].map(s => (
            <button key={s} onClick={() => { setStateFilter(s); setPage(0) }}
              className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${stateFilter === s ? 'bg-orange-500/20 text-orange-400' : 'text-gray-600 hover:text-gray-400'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {data.data.map((pr: PRInfo) => (
          <a key={pr.number} href={pr.url} target="_blank" rel="noopener noreferrer"
            className="block bg-black/30 rounded-lg p-3 border border-gray-800/30 hover:border-orange-500/20 transition-all">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${stateColors[pr.state] || 'text-gray-400'}`}>{pr.state}</span>
                  <span className="text-gray-500 text-[10px]">#{pr.number}</span>
                </div>
                <p className="text-gray-300 text-xs font-medium mt-1 line-clamp-1">{pr.title}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-600">
                  <span className="text-orange-400">{pr.author_login}</span>
                  <span>· {new Date(pr.created_at).toLocaleDateString()}</span>
                  {pr.labels.slice(0, 3).map(l => <span key={l} className="px-1 py-0.5 rounded bg-gray-800 text-gray-500">{l}</span>)}
                </div>
              </div>
              <div className="text-[10px] text-gray-600 shrink-0 text-right">
                <p className="text-green-400">+{pr.additions}</p>
                <p className="text-red-400">-{pr.deletions}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="text-[10px] text-gray-400 hover:text-orange-400 disabled:opacity-40">← Newer</button>
          <span className="text-gray-500 text-[10px]">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="text-[10px] text-gray-400 hover:text-orange-400 disabled:opacity-40">Older →</button>
        </div>
      )}
    </div>
  )
}

// ============================================
// Issues Section
// ============================================

function RepoIssues({ repoId, fullName }: { repoId: number; fullName: string }) {
  const [page, setPage] = useState(0)
  const [stateFilter, setStateFilter] = useState<string>('')
  const limit = 10

  const { data, isLoading } = useQuery({
    queryKey: ['repo-issues', repoId, page, stateFilter],
    queryFn: () => getRepoIssues(repoId, stateFilter || undefined, limit, page * limit),
  })

  if (isLoading) return <div className="flex items-center gap-2 py-4"><div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /><span className="text-gray-500 text-xs">Loading issues...</span></div>

  if (!data || data.data.length === 0) {
    return <div className="py-4 text-center"><p className="text-gray-500 text-xs">No issues found.</p></div>
  }

  const totalPages = Math.ceil(data.total / limit)

  return (
    <div className="mt-4 pt-4 border-t border-white/[0.06]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Issues · {fullName}</p>
        <div className="flex gap-1">
          {['', 'OPEN', 'CLOSED'].map(s => (
            <button key={s} onClick={() => { setStateFilter(s); setPage(0) }}
              className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${stateFilter === s ? 'bg-orange-500/20 text-orange-400' : 'text-gray-600 hover:text-gray-400'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {data.data.map((issue: IssueInfo) => (
          <a key={issue.number} href={issue.url} target="_blank" rel="noopener noreferrer"
            className="block bg-black/30 rounded-lg p-3 border border-gray-800/30 hover:border-orange-500/20 transition-all">
            <div className="flex items-start gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${issue.state === 'OPEN' ? 'bg-green-500' : 'bg-purple-500'}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-[10px]">#{issue.number}</span>
                </div>
                <p className="text-gray-300 text-xs font-medium mt-1 line-clamp-1">{issue.title}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-600">
                  <span className="text-orange-400">{issue.author_login}</span>
                  <span>· {new Date(issue.created_at).toLocaleDateString()}</span>
                  <span>💬 {issue.comments_count}</span>
                  {issue.labels.slice(0, 3).map(l => <span key={l} className="px-1 py-0.5 rounded bg-gray-800 text-gray-500">{l}</span>)}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="text-[10px] text-gray-400 hover:text-orange-400 disabled:opacity-40">← Newer</button>
          <span className="text-gray-500 text-[10px]">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="text-[10px] text-gray-400 hover:text-orange-400 disabled:opacity-40">Older →</button>
        </div>
      )}
    </div>
  )
}

// ============================================
// Branches Section
// ============================================

function RepoBranches({ repoId, fullName }: { repoId: number; fullName: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['repo-branches', repoId],
    queryFn: () => getRepoBranches(repoId),
  })

  if (isLoading) return <div className="flex items-center gap-2 py-4"><div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /><span className="text-gray-500 text-xs">Loading branches...</span></div>

  if (!data || data.data.length === 0) {
    return <div className="py-4 text-center"><p className="text-gray-500 text-xs">No branches found.</p></div>
  }

  return (
    <div className="mt-4 pt-4 border-t border-white/[0.06]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Branches · {fullName}</p>
        <span className="text-gray-600 text-[10px]">{data.total} total</span>
      </div>
      <div className="space-y-1.5">
        {data.data.map((branch: BranchInfo) => (
          <div key={branch.name} className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2 border border-gray-800/30">
            <div className="flex items-center gap-2 min-w-0">
              {branch.is_default && <span className="text-[9px] px-1 py-0.5 rounded bg-orange-500/20 text-orange-400 shrink-0">default</span>}
              <span className="text-gray-300 text-xs font-mono truncate">{branch.name}</span>
              {branch.has_open_pr && <span className="text-[9px] px-1 py-0.5 rounded bg-blue-500/20 text-blue-400 shrink-0">PR</span>}
            </div>
            <div className="text-[10px] text-gray-600 shrink-0">
              {branch.last_commit_date && <span>{new Date(branch.last_commit_date).toLocaleDateString()}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Releases Section
// ============================================

function RepoReleases({ repoId, fullName }: { repoId: number; fullName: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['repo-releases', repoId],
    queryFn: () => getRepoReleases(repoId),
  })

  if (isLoading) return <div className="flex items-center gap-2 py-4"><div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /><span className="text-gray-500 text-xs">Loading releases...</span></div>

  if (!data || data.data.length === 0) {
    return <div className="py-4 text-center"><p className="text-gray-500 text-xs">No releases found.</p></div>
  }

  return (
    <div className="mt-4 pt-4 border-t border-white/[0.06]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Releases · {fullName}</p>
        <span className="text-gray-600 text-[10px]">{data.total} total</span>
      </div>
      <div className="space-y-2">
        {data.data.map((release: ReleaseInfo) => (
          <a key={release.tag_name} href={release.url} target="_blank" rel="noopener noreferrer"
            className="block bg-black/30 rounded-lg p-3 border border-gray-800/30 hover:border-orange-500/20 transition-all">
            <div className="flex items-center gap-2">
              <span className="text-orange-400 text-xs font-medium">🏷 {release.tag_name}</span>
              {release.is_prerelease && <span className="text-[9px] px-1 py-0.5 rounded bg-yellow-500/20 text-yellow-400">pre-release</span>}
              {release.is_draft && <span className="text-[9px] px-1 py-0.5 rounded bg-gray-600/20 text-gray-400">draft</span>}
            </div>
            {release.name && <p className="text-gray-300 text-xs mt-1">{release.name}</p>}
            <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-600">
              {release.author_login && <span className="text-orange-400">{release.author_login}</span>}
              <span>· {release.published_at ? new Date(release.published_at).toLocaleDateString() : 'Not published'}</span>
            </div>
            {release.body && <p className="text-gray-500 text-[10px] mt-1 line-clamp-2">{release.body}</p>}
          </a>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Repo List (Updated)
// ============================================

function RepoList() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['tracked-repos'],
    queryFn: getTrackedRepos,
  })
  type SectionType = 'history' | 'commits' | 'prs' | 'issues' | 'branches' | 'releases'
  const [expandedId, setExpandedId] = useState<{ repoId: number; type: SectionType } | null>(null)
  const removeMutation = useMutation({
    mutationFn: removeTrackedRepo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tracked-repos'] }),
  })
  const refreshAllMutation = useMutation({
    mutationFn: refreshAllRepoData,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tracked-repos'] }),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const repos = data?.data ?? []

  if (repos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/60 flex items-center justify-center text-gray-600">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm mb-1">No repositories tracked yet</p>
        <p className="text-gray-600 text-xs">Add a repository above to start tracking.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {repos.map((repo: TrackedRepo) => {
        const langColor = LANG_COLORS[repo.repository.language] || '#6b7280'
        return (
          <div
            key={repo.id}
            className="bg-black/30 hover:bg-black/50 rounded-xl p-4 border border-gray-800/30 hover:border-orange-500/20 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <img
                  src={`https://avatars.githubusercontent.com/${repo.repository.owner}?size=32`}
                  alt=""
                  className="w-8 h-8 rounded-full shrink-0 ring-1 ring-white/10 mt-0.5"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <a
                      href={repo.repository.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 font-medium hover:underline truncate"
                    >
                      {repo.repository.fullName}
                    </a>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: langColor }} />
                    <span className="text-gray-600 text-xs">{repo.repository.language}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{repo.repository.description}</p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs">
                    <span className="text-red-500 font-medium">⭐ {formatNumber(repo.repository.stars)}</span>
                    <span className="text-gray-500">⑂ {formatNumber(repo.repository.forks)} forks</span>
                    <span className="text-orange-400 font-medium">🔥 {repo.repository.score.toLocaleString()}</span>
                    <span className="text-green-400">+24h {repo.repository.stars24h}</span>
                    <span className="text-blue-400">+7d {repo.repository.stars7d}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[10px] text-gray-600">
                    {repo.repository.openIssues != null && <span>!{repo.repository.openIssues.toLocaleString()} issues</span>}
                    {repo.repository.watchers != null && <span>👁 {repo.repository.watchers.toLocaleString()} watchers</span>}
                    {repo.repository.license && <span>⚖ {repo.repository.license}</span>}
                    {repo.repository.latestRelease && <span>🏷 {repo.repository.latestRelease}</span>}
                    {repo.repository.isArchived && <span className="text-gray-500">archived</span>}
                    {repo.repository.collectedAt && (
                      <span title={`Last updated: ${new Date(repo.repository.collectedAt).toLocaleString()}`}>
                        🔄 {formatRelativeTime(repo.repository.collectedAt)}
                      </span>
                    )}
                  </div>

                  {repo.repository.topics && repo.repository.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {repo.repository.topics.slice(0, 4).map((topic: string) => (
                        <span key={topic} className="text-[9px] px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400/70 border border-orange-500/15">{topic}</span>
                      ))}
                    </div>
                  )}

                  {repo.repository.homepageUrl && (
                    <a href={repo.repository.homepageUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-600 hover:text-orange-400 mt-1 inline-block truncate max-w-[200px]">
                      🌐 {repo.repository.homepageUrl}
                    </a>
                  )}
                </div>
              </div>

              {/* Activity Summary Card */}
              {expandedId?.repoId === repo.id && <ActivityCard repoId={repo.id} />}

              <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                {(['history', 'commits', 'prs', 'issues', 'branches', 'releases'] as SectionType[]).map(type => {
                  const labels: Record<SectionType, string> = {
                    history: 'History', commits: 'Commits', prs: 'PRs',
                    issues: 'Issues', branches: 'Branches', releases: 'Releases',
                  }
                  const isActive = expandedId?.repoId === repo.id && expandedId?.type === type
                  return (
                    <button key={type}
                      onClick={() => setExpandedId(isActive ? null : { repoId: repo.id, type })}
                      className={`text-[10px] transition-colors px-1.5 py-0.5 rounded ${isActive ? 'text-orange-400 bg-orange-500/10' : 'text-gray-500 hover:text-orange-400 hover:bg-orange-500/10'}`}>
                      {labels[type]}
                    </button>
                  )
                })}
                <button
                  onClick={() => refreshAllMutation.mutate(repo.id)}
                  disabled={refreshAllMutation.isPending}
                  className="text-[10px] text-gray-500 hover:text-green-400 transition-colors px-1.5 py-0.5 rounded hover:bg-green-500/10 disabled:opacity-40"
                  title="Refresh all data"
                >
                  {refreshAllMutation.isPending ? '...' : '↻'}
                </button>
                <button
                  onClick={() => removeMutation.mutate(repo.id)}
                  disabled={removeMutation.isPending}
                  className="text-[10px] text-red-400 hover:text-red-300 transition-colors px-1.5 py-0.5 rounded hover:bg-red-500/10"
                >
                  ✕
                </button>
              </div>
            </div>

            {expandedId?.repoId === repo.id && expandedId?.type === 'history' && (
              <RepoHistory repoId={repo.id} />
            )}
            {expandedId?.repoId === repo.id && expandedId?.type === 'commits' && (
              <RepoCommits repoId={repo.id} fullName={repo.repository.fullName} />
            )}
            {expandedId?.repoId === repo.id && expandedId?.type === 'prs' && (
              <RepoPRs repoId={repo.id} fullName={repo.repository.fullName} />
            )}
            {expandedId?.repoId === repo.id && expandedId?.type === 'issues' && (
              <RepoIssues repoId={repo.id} fullName={repo.repository.fullName} />
            )}
            {expandedId?.repoId === repo.id && expandedId?.type === 'branches' && (
              <RepoBranches repoId={repo.id} fullName={repo.repository.fullName} />
            )}
            {expandedId?.repoId === repo.id && expandedId?.type === 'releases' && (
              <RepoReleases repoId={repo.id} fullName={repo.repository.fullName} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Home() {
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Tracking — RepoTendency</title>
        <meta property="og:title" content="Tracking — RepoTendency" />
        <meta name="twitter:title" content="Tracking — RepoTendency" />
      </Helmet>

      <div className="flex items-center gap-4">
        <div className="h-8 w-1 bg-gradient-to-b from-orange-500 to-red-600 rounded-full" />
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Tracking
          </h2>
          <p className="text-gray-600 text-sm mt-0.5">Track your repositories and monitor their growth</p>
        </div>
      </div>

      <div className="space-y-6">
        <AddRepoSection />

        <div className="bg-black/40 backdrop-blur-2xl rounded-2xl p-6 border border-white/[0.06] hover:border-orange-500/20 transition-all duration-300 animate-fade-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Tracked repositories</h3>
              <p className="text-gray-500 text-xs">Your tracked repositories with real-time data</p>
            </div>
          </div>
          <RepoList />
        </div>
      </div>
    </div>
  )
}
