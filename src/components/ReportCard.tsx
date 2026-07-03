import { useState } from 'react'
import type { PeriodicReport } from '../api/user'

function formatFreq(hours: number): string {
  if (hours >= 24) return `${Math.floor(hours / 24)}d`
  return `${hours}h`
}

function formatSentAt(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ReportCard({ report }: { report: PeriodicReport }) {
  const [expanded, setExpanded] = useState(false)
  const data = report.report_data

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-white/[0.06] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full">
                {formatFreq(report.period_hours)}
              </span>
              <span className="text-[11px] text-gray-600">
                {formatSentAt(report.sent_at)}
              </span>
            </div>
            <p className="text-sm text-white/90 leading-relaxed line-clamp-2">
              {data.summary.split('\n')[0]}
            </p>
          </div>
          <svg
            className={`w-4 h-4 text-gray-600 shrink-0 mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/[0.04]">
          <div className="grid grid-cols-4 gap-2 mt-3 mb-3">
            <StatBox label="Commits" value={data.total_commits} color="text-orange-400" />
            <StatBox label="PRs" value={data.total_prs_merged} color="text-green-400" />
            <StatBox label="Issues" value={data.total_issues_closed} color="text-purple-400" />
            <StatBox
              label="Stars"
              value={data.total_stars_change}
              color={data.total_stars_change >= 0 ? 'text-red-400' : 'text-gray-500'}
              prefix={data.total_stars_change > 0 ? '+' : ''}
            />
          </div>

          {data.most_active_repos.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Most Active</p>
              {data.most_active_repos.map((repo) => (
                <div key={repo.full_name} className="flex items-start gap-2 py-1.5 px-2 rounded-lg bg-white/[0.02]">
                  <span className="text-[11px] text-orange-400/80 font-mono shrink-0">{repo.full_name}</span>
                  <span className="text-[11px] text-gray-500">—</span>
                  <span className="text-[11px] text-gray-400">{repo.activity_summary}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-white/[0.04]">
            <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Full Summary</p>
            <pre className="text-[11px] text-gray-400 whitespace-pre-wrap font-mono leading-relaxed">
              {data.summary}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

function StatBox({ label, value, color, prefix }: { label: string; value: number; color: string; prefix?: string }) {
  return (
    <div className="bg-white/[0.03] rounded-lg p-2 border border-white/[0.04]">
      <p className="text-[10px] text-gray-600 uppercase tracking-wide">{label}</p>
      <p className={`text-sm font-bold mt-0.5 ${color}`}>
        {prefix}{value}
      </p>
    </div>
  )
}
