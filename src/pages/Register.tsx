import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { register } from '../api/auth'

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    country: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await register({
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone || undefined,
        company: form.company || undefined,
        country: form.country || undefined,
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Helmet>
        <title>Register — RepoTendency</title>
      </Helmet>
      <div className="bg-black/40 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 border border-white/[0.06]">
        <h2 className="text-2xl font-bold text-orange-500 mb-2">Create account</h2>
        <p className="text-gray-500 text-sm mb-6">Start tracking your favorite repositories.</p>

        {success ? (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            Registration successful. Check your email to verify your account before logging in.
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm text-gray-400 mb-1">Full name *</label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  required
                  minLength={2}
                  className="w-full bg-gray-900/60 border border-gray-800/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-gray-400 mb-1">Email *</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  required
                  className="w-full bg-gray-900/60 border border-gray-800/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm text-gray-400 mb-1">Password *</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-gray-900/60 border border-gray-800/50 rounded-xl px-4 py-2.5 pr-10 text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-400 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm text-gray-400 mb-1">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    className="w-full bg-gray-900/60 border border-gray-800/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm text-gray-400 mb-1">Country</label>
                  <input
                    id="country"
                    type="text"
                    value={form.country}
                    onChange={e => update('country', e.target.value)}
                    className="w-full bg-gray-900/60 border border-gray-800/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="company" className="block text-sm text-gray-400 mb-1">Company</label>
                <input
                  id="company"
                  type="text"
                  value={form.company}
                  onChange={e => update('company', e.target.value)}
                  className="w-full bg-gray-900/60 border border-gray-800/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 px-6 py-3 rounded-xl font-medium transition-all"
              >
                {isSubmitting ? 'Creating account...' : 'Register'}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}
