import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Dumbbell } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [email, setEmail] = useState('owner@gymfitzone.com')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Mock login — simulate API call
    await new Promise((r) => setTimeout(r, 800))

    if (email === 'owner@gymfitzone.com' && password === 'password123') {
      login({
        id: 'usr_001',
        email: 'owner@gymfitzone.com',
        phone: '+919876543210',
        first_name: 'Rajesh',
        last_name: 'Kumar',
        avatar_url: null,
        role: 'gym_owner',
        tenant_id: 'tenant_001',
      })
      navigate('/', { replace: true })
    } else {
      setError('Invalid email or password. Try owner@gymfitzone.com / password123')
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%)',
      padding: '1rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        animation: 'slideInUp var(--transition-slow) ease-out',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
            borderRadius: 'var(--radius-xl)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-glow)',
          }}>
            <Dumbbell size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', letterSpacing: '-0.025em' }}>
            GymOS
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)', marginTop: '0.25rem' }}>
            Gym Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            Welcome back
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Sign in to your gym dashboard
          </p>

          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'var(--danger-50)',
              border: '1px solid var(--danger-100)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--danger-700)',
              fontSize: '0.8125rem',
              marginBottom: '1rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@yourgym.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="password" className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-tertiary)',
                    padding: '0.25rem',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
              style={{ padding: '0.75rem', fontSize: '0.9375rem' }}
            >
              {isLoading ? (
                <>
                  <span className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            padding: '0.75rem',
            background: 'var(--gray-50)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            textAlign: 'center',
          }}>
            <strong>Demo credentials:</strong><br />
            owner@gymfitzone.com / password123
          </div>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--gray-500)',
          marginTop: '1.5rem',
        }}>
          © 2026 GymOS. Built for Indian gyms.
        </p>
      </div>
    </div>
  )
}
