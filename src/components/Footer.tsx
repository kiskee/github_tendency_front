import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-orange-900/30 bg-black/30 backdrop-blur-xl mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <rect width="24" height="24" rx="6" fill="#0d0200"/>
                <path d="M7 17L11 7L15 13L19 5" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <circle cx="19" cy="5" r="2" fill="#f97316"/>
                <path d="M5 8L3 12L5 16" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5"/>
                <path d="M19 8L21 12L19 16" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5"/>
              </svg>
              <span className="font-semibold text-orange-500">RepoTendency</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Real-time GitHub repository trends and analytics. Track what's hot in the open-source world.
            </p>
          </div>

          <div>
            <h4 className="text-gray-400 font-medium text-sm uppercase tracking-wide mb-3">Data</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-500 hover:text-orange-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/search" className="text-gray-500 hover:text-orange-400 transition-colors">Search</Link></li>
              <li><Link to="/trends" className="text-gray-500 hover:text-orange-400 transition-colors">Trends</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-400 font-medium text-sm uppercase tracking-wide mb-3">Powered by</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-500">GitHub GraphQL API</li>
              <li className="text-gray-500">PostgreSQL + Redis</li>
              <li className="text-gray-500">OpenTelemetry</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/50 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} RepoTendency. Built for the open-source community.
          </p>
          <div className="flex items-center gap-4 text-gray-600 text-xs">
            <span>Data refreshed hourly via cron</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600/50 inline-block" title="Live" />
          </div>
        </div>
      </div>
    </footer>
  )
}
