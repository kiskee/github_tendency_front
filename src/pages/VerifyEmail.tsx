import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { verifyEmail } from '../api/auth'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    const token = params.get('token')
    if (!token) {
      setStatus('error')
      setMessage('Missing verification token.')
      return
    }

    verifyEmail(token)
      .then(() => {
        setStatus('success')
        setMessage('Email verified successfully. Redirecting to login...')
        setTimeout(() => navigate('/login'), 2000)
      })
      .catch((err: Error) => {
        setStatus('error')
        setMessage(err.message || 'Invalid or expired token.')
      })
  }, [params, navigate])

  return (
    <div className="max-w-md mx-auto">
      <Helmet>
        <title>Verify Email — GitHub Tendency</title>
      </Helmet>
      <div className="bg-black/40 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 border border-white/[0.06] text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-300">{message}</p>
          </div>
        )}
        {status === 'success' && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            {message}
          </div>
        )}
        {status === 'error' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {message}
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-orange-600 hover:bg-orange-700 px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-all"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
