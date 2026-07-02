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
        <title>Register — GitHub Tendency</title>
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
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-gray-900/60 border border-gray-800/50 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-600/50"
                />
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
