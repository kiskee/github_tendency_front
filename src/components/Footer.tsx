import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-orange-900/30 bg-black/30 backdrop-blur-xl mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-orange-500" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="font-semibold text-orange-500">GitHub Tendency</span>
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
            &copy; {new Date().getFullYear()} GitHub Tendency. Built for the open-source community.
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
