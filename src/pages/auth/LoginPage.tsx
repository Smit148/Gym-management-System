import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Dumbbell, Mail, Lock, Info } from 'lucide-react'
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
      setError('Invalid email or password. Try the demo credentials below.')
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 50%, var(--gray-900) 100%)',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        animation: 'slideInUp var(--transition-slow) ease-out',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo — compact */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
            borderRadius: 'var(--radius-xl)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
            boxShadow: '0 0 24px rgba(99, 102, 241, 0.3)',
          }}>
            <Dumbbell size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'white', letterSpacing: '-0.025em' }}>
            GymOS
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginTop: '0.25rem' }}>
            Trusted by 500+ gyms across India
          </p>
        </div>

        {/* Login Card */}
        <div className="card" style={{ padding: '1.75rem 2rem' }}>
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
              <label htmlFor="email" className="form-label" style={{ fontWeight: 600 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                  pointerEvents: 'none',
                }} />
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="you@yourgym.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '0.5rem' }}>
              <label htmlFor="password" className="form-label" style={{ fontWeight: 600 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                  pointerEvents: 'none',
                }} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
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

            {/* Forgot password link */}
            <div style={{ textAlign: 'right', marginBottom: '1.25rem' }}>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-600)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
              style={{
                padding: '0.8125rem',
                fontSize: '0.9375rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                border: 'none',
              }}
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

          {/* Demo credentials — prominent */}
          <div style={{
            marginTop: '1.25rem',
            padding: '0.75rem 1rem',
            background: 'var(--primary-50)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--primary-100)',
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.625rem',
          }}>
            <Info size={16} style={{ color: 'var(--primary-500)', flexShrink: 0, marginTop: '0.125rem' }} />
            <div>
              <strong style={{ color: 'var(--primary-700)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Demo Credentials</strong><br />
              <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>owner@gymfitzone.com</span> / <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>password123</span>
            </div>
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
