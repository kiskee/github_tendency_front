import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'
import { getGithubTokenStatus, saveGithubToken, deleteGithubToken, updateProfile, getTrackedRepos } from '../api/user'

function ProfileSection() {
  const { user, refetchUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [company, setCompany] = useState(user?.company || '')
  const [country, setCountry] = useState(user?.country || '')
  const [saved, setSaved] = useState(false)

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await refetchUser()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  if (!user) return null

  const hasChanges = name !== (user.name || '') || phone !== (user.phone || '') || company !== (user.company || '') || country !== (user.country || '')

  return (
    <div className="bg-black/40 backdrop-blur-2xl rounded-2xl p-6 border border-white/[0.06]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Profile</h3>
          <p className="text-gray-500 text-xs">Manage your account information</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full bg-gray-900/40 border border-gray-800/30 rounded-xl px-4 py-2.5 text-gray-500 text-sm cursor-not-allowed"
            />
            <p className="text-[10px] text-gray-600 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Full name *</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setSaved(false) }}
              className="w-full bg-gray-900/60 border border-gray-800/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={e => { setPhone(e.target.value); setSaved(false) }}
              placeholder="+1 234 567 890"
              className="w-full bg-gray-900/60 border border-gray-800/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Company</label>
            <input
              type="text"
              value={company}
              onChange={e => { setCompany(e.target.value); setSaved(false) }}
              placeholder="Acme Inc."
              className="w-full bg-gray-900/60 border border-gray-800/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={e => { setCountry(e.target.value); setSaved(false) }}
              placeholder="United States"
              className="w-full bg-gray-900/60 border border-gray-800/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${user.email_verified ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-xs text-gray-500">{user.email_verified ? 'Email verified' : 'Email not verified'}</span>
          </div>
          <span className="text-gray-700">·</span>
          <span className="text-xs text-gray-500">Member since {new Date(user.created_at).toLocaleDateString()}</span>
          <span className="text-gray-700">·</span>
          <span className="px-2 py-0.5 text-[10px] font-medium text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-full">{user.role}</span>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => updateMutation.mutate({ name, phone, company, country })}
            disabled={!hasChanges || updateMutation.isPending}
            className="bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 rounded-xl font-medium transition-all text-sm"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && (
            <span className="text-green-400 text-sm">Changes saved!</span>
          )}
          {updateMutation.isError && (
            <span className="text-red-400 text-sm">{updateMutation.error instanceof Error ? updateMutation.error.message : 'Failed to save'}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function TokenSection() {
  const queryClient = useQueryClient()
  const [token, setToken] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['github-token-status'],
    queryFn: getGithubTokenStatus,
  })
  const saveMutation = useMutation({
    mutationFn: saveGithubToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-token-status'] })
      setToken('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteGithubToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github-token-status'] })
    },
  })

  return (
    <div className="bg-black/40 backdrop-blur-2xl rounded-2xl p-6 border border-white/[0.06]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">GitHub Token</h3>
          <p className="text-gray-500 text-xs">Required to track private repos or avoid rate limits</p>
        </div>
      </div>

      <p className="text-gray-500 text-sm mb-4">
        Stored encrypted with AES-256-GCM.{' '}
        <a
          href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-400 hover:underline"
        >
          Learn more
        </a>
      </p>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm mb-4">
          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm mb-4">
          <span className={`w-2 h-2 rounded-full ${data?.hasToken ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]'}`} />
          <span className="text-gray-400">{data?.hasToken ? `Connected: ${data.token}` : 'Not connected'}</span>
        </div>
      )}

      <form
        onSubmit={e => {
          e.preventDefault()
          if (token.trim()) saveMutation.mutate(token.trim())
        }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          type="password"
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="ghp_xxxx..."
          className="flex-1 bg-gray-900/60 border border-gray-800/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50 focus:ring-1 focus:ring-orange-600/20 transition-all"
        />
        <button
          type="submit"
          disabled={saveMutation.isPending || !token.trim()}
          className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 px-5 py-2.5 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-orange-600/20 active:scale-95"
        >
          {saveMutation.isPending ? 'Saving...' : 'Save Token'}
        </button>
      </form>

      {saveMutation.isSuccess && (
        <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          Token saved successfully!
        </div>
      )}

      {saveMutation.isError && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {saveMutation.error instanceof Error ? saveMutation.error.message : 'Failed to save token'}
        </div>
      )}

      {data?.hasToken && (
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Token'}
          </button>
          {deleteMutation.isSuccess && (
            <span className="text-green-400 text-sm ml-2">Token deleted</span>
          )}
        </div>
      )}
    </div>
  )
}

function PlanSection() {
  const { data: repos } = useQuery({
    queryKey: ['tracked-repos'],
    queryFn: getTrackedRepos,
  })
  const { user } = useAuth()
  const repoCount = repos?.data?.length || 0
  const repoLimit = user?.role === 'admin' ? 'Unlimited' : '1'

  return (
    <div className="bg-black/40 backdrop-blur-2xl rounded-2xl p-6 border border-white/[0.06]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Plan</h3>
          <p className="text-gray-500 text-xs">Your current subscription</p>
        </div>
      </div>

      <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-orange-500 font-bold text-lg">{user?.role === 'admin' ? 'Pro' : 'Free'}</span>
          <span className="px-2 py-0.5 text-[10px] font-medium text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-full">
            {user?.role === 'admin' ? 'Admin' : 'Active'}
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Repositories tracked</span>
            <span className="text-white">{repoCount} / {repoLimit}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Data refresh</span>
            <span className="text-white">Every hour</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Commits history</span>
            <span className="text-white">{user?.role === 'admin' ? 'Full' : 'Last 10'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UserConfig() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Helmet>
        <title>Account Settings — GitHub Tendency</title>
        <meta property="og:title" content="Account Settings — GitHub Tendency" />
        <meta name="twitter:title" content="Account Settings — GitHub Tendency" />
      </Helmet>

      <div className="flex items-center gap-4 justify-center">
        <div className="h-8 w-1 bg-gradient-to-b from-orange-500 to-red-600 rounded-full" />
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Account Settings
          </h2>
          <p className="text-gray-600 text-sm mt-0.5 text-center">Manage your account and settings</p>
        </div>
      </div>

      <ProfileSection />
      <TokenSection />
      <PlanSection />
    </div>
  )
}
