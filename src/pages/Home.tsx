import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user, logout } = useAuth()

  return (
    <div>
      <Helmet>
        <title>My Home — GitHub Tendency</title>
      </Helmet>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-orange-500">My Home</h2>
        <button
          onClick={() => logout()}
          className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
        >
          Logout
        </button>
      </div>
      <div className="bg-black/40 backdrop-blur-2xl rounded-2xl p-6 border border-white/[0.06] max-w-xl">
        <p className="text-gray-300 text-lg">Welcome, <span className="text-orange-400 font-medium">{user?.name}</span>.</p>
        <div className="mt-4 space-y-1 text-sm text-gray-500">
          <p>Email: {user?.email}</p>
          {user?.phone && <p>Phone: {user.phone}</p>}
          {user?.company && <p>Company: {user.company}</p>}
          {user?.country && <p>Country: {user.country}</p>}
        </div>
        <p className="text-gray-600 text-sm mt-6">Your personal dashboard is coming soon.</p>
      </div>
    </div>
  )
}
