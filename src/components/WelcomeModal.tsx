import { createPortal } from 'react-dom'

interface WelcomeModalProps {
  onDismiss: () => void
}

export default function WelcomeModal({ onDismiss }: WelcomeModalProps) {
  return createPortal(
    <div className="fixed top-0 left-0 z-[100] min-h-[100dvh] w-screen flex items-start sm:items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg my-auto bg-black/80 backdrop-blur-2xl rounded-2xl border border-orange-500/20 shadow-2xl shadow-orange-600/10 p-6 sm:p-8 animate-fade-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-orange-500" aria-hidden="true">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Welcome to GitHub Tendency
          </h2>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          This dashboard tracks real-time trends across open-source repositories on GitHub.
          Explore live statistics, discover popular projects, and search by the technologies you care about.
        </p>

        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white/90">Dashboard</h3>
              <p className="text-gray-500 text-xs mt-0.5">
                Get a live overview with stats cards, star charts per keyword, language breakdowns, and the top trending repositories.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white/90">Search</h3>
              <p className="text-gray-500 text-xs mt-0.5">
                Search repositories by keyword and inspect stars, forks, languages, licenses, topics, and more for each project.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white/90">Trends</h3>
              <p className="text-gray-500 text-xs mt-0.5">
                Browse the keywords we are tracking and uncover the most relevant repositories in each category.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-orange-600/25 active:scale-[0.97]"
        >
          Got it
        </button>
        <p className="text-center text-gray-600 text-xs mt-3">
          This message will not be shown again.
        </p>
      </div>
    </div>,
    document.body,
  )
}
