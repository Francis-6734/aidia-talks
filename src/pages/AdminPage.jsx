import { useState, useEffect, useRef } from 'react'
import { useSEO } from '../hooks/useSEO'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../components/admin/AdminLayout'

export default function AdminPage() {
  useSEO({ title: 'Admin | Aidia Talks' })

  const { user, loading: authLoading, signIn, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [signingIn, setSigningIn] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const hasCleared = useRef(false)

  // Sign out any existing session when the admin page mounts,
  // so the admin must always enter credentials fresh.
  useEffect(() => {
    if (!authLoading && user && !authenticated && !hasCleared.current) {
      hasCleared.current = true
      signOut()
    }
  }, [authLoading, user, authenticated, signOut])

  if (authLoading || (user && !authenticated && !hasCleared.current)) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    )
  }

  if (user && authenticated) {
    return <AdminLayout />
  }

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setSigningIn(true)

    const { error: err } = await signIn(email, password)

    setSigningIn(false)
    if (err) {
      setError('Invalid email or password')
    } else {
      setAuthenticated(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 bg-gray-50 dark:bg-[#0f172a]">
      <div className="w-full max-w-sm mx-4">
        <div className="bg-white dark:bg-navy rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-navy dark:text-white">
              Aidia<span className="text-orange">Talks</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Admin Dashboard Login</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-navy dark:text-gray-300 mb-1.5">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-navy-dark dark:text-white focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none text-sm"
                placeholder="admin@aidiatalks.co.ke"
                required
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-navy dark:text-gray-300 mb-1.5">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-navy-dark dark:text-white focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none text-sm"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={signingIn}
              className="w-full bg-orange text-white py-3 rounded-xl font-semibold hover:bg-orange-dark transition-colors disabled:opacity-50"
            >
              {signingIn ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
