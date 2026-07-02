import { useQuery } from '@tanstack/react-query'
import { Routes, Route, NavLink, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Search from './pages/Search'
import Trends from './pages/Trends'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import Home from './pages/Home'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import { getHealth } from './api/health'
import { useAuth } from './context/AuthContext'

function App() {
  const health = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    refetchInterval: 30_000,
  })

  const { user, isLoading: authLoading, logout } = useAuth()
  const isOnline = health.isSuccess && health.data?.status === 'OK'

  return (
    <div className="min-h-screen text-gray-100 flex flex-col">
      <nav className="bg-black/50 backdrop-blur-xl border-b border-orange-900/30 px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-6 sticky top-0 z-50 flex-wrap">
        <h1 className="text-base sm:text-lg font-bold text-orange-500 flex items-center gap-2 shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 fill-current" aria-hidden="true">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          <span className="hidden sm:inline">GitHub Tendency</span>
        </h1>
        <NavLink to="/" end className={({ isActive }) => `text-sm sm:text-base pb-1 border-b-2 transition-colors ${isActive ? 'text-white border-orange-500' : 'text-gray-500 hover:text-orange-400 border-transparent'}`}>
          Dashboard
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => `text-sm sm:text-base pb-1 border-b-2 transition-colors ${isActive ? 'text-white border-orange-500' : 'text-gray-500 hover:text-orange-400 border-transparent'}`}>
          Search
        </NavLink>
        <NavLink to="/trends" className={({ isActive }) => `text-sm sm:text-base pb-1 border-b-2 transition-colors ${isActive ? 'text-white border-orange-500' : 'text-gray-500 hover:text-orange-400 border-transparent'}`}>
          Trends
        </NavLink>
        {user && (
          <NavLink to="/home" className={({ isActive }) => `text-sm sm:text-base pb-1 border-b-2 transition-colors ${isActive ? 'text-white border-orange-500' : 'text-gray-500 hover:text-orange-400 border-transparent'}`}>
            My Home
          </NavLink>
        )}

        <div className="ml-auto flex items-center gap-3">
          {!authLoading && (
            user ? (
              <button
                onClick={() => logout()}
                className="text-xs sm:text-sm text-gray-500 hover:text-orange-400 transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-xs sm:text-sm text-gray-500 hover:text-orange-400 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-xs sm:text-sm bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                  Register
                </Link>
              </div>
            )
          )}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]'}`} />
            <span className="text-gray-500 hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </nav>

      <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
