import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Search from './pages/Search'
import Trends from './pages/Trends'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import Home from './pages/Home'
import UserConfig from './pages/UserConfig'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import { getHealth } from './api/health'
import { useAuth } from './context/AuthContext'

function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const initials = user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center text-orange-500 font-bold text-sm hover:border-orange-500/50 transition-colors"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700/50 rounded-xl shadow-xl z-50 py-1">
          <div className="px-3 py-2 border-b border-gray-800">
            <p className="text-white text-sm font-medium truncate">{user.name || 'User'}</p>
            <p className="text-gray-500 text-xs truncate">{user.email}</p>
          </div>
          <button
            onClick={() => { navigate('/user'); setOpen(false) }}
            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account Settings
          </button>
          <div className="border-t border-gray-800 mt-1 pt-1">
            <button
              onClick={() => { logout(); setOpen(false) }}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  const health = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    refetchInterval: 30_000,
  })

  const { user, isLoading: authLoading } = useAuth()
  const isOnline = health.isSuccess && health.data?.status === 'OK'

  return (
    <div className="min-h-screen text-gray-100 flex flex-col">
      <nav className="bg-black/50 backdrop-blur-xl border-b border-orange-900/30 px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-6 sticky top-0 z-50 flex-wrap">
        <h1 className="text-base sm:text-lg font-bold text-orange-500 flex items-center gap-2 shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true">
            <rect width="24" height="24" rx="6" fill="#0d0200"/>
            <path d="M7 17L11 7L15 13L19 5" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="19" cy="5" r="2" fill="#f97316"/>
            <path d="M5 8L3 12L5 16" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5"/>
            <path d="M19 8L21 12L19 16" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5"/>
          </svg>
          <span className="hidden sm:inline">RepoTendency</span>
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
          <NavLink to="/tracking" className={({ isActive }) => `text-sm sm:text-base pb-1 border-b-2 transition-colors ${isActive ? 'text-white border-orange-500' : 'text-gray-500 hover:text-orange-400 border-transparent'}`}>
            Tracking
          </NavLink>
        )}

        <div className="ml-auto flex items-center gap-3">
          {!authLoading && (
            user ? (
              <UserMenu />
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
          <Route path="/tracking" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/user" element={<ProtectedRoute><UserConfig /></ProtectedRoute>} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
