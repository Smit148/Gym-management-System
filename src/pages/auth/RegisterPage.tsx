import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Dumbbell, User, Mail, Phone, Lock, Building2, Eye, EyeOff, CheckCircle } from 'lucide-react'

export function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState({
    gym_name: '',
    owner_name: '',
    email: '',
    phone: '',
    password: '',
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200))
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 50%, var(--gray-900) 100%)',
        padding: '1.25rem',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          animation: 'slideInUp var(--transition-slow) ease-out',
        }}>
          <div className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'var(--success-50)',
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <CheckCircle size={28} style={{ color: 'var(--success-600)' }} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Registration Successful!
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Your gym account has been created. You can now sign in with your credentials.
            </p>
            <button
              className="btn btn-primary w-full"
              onClick={() => navigate('/login')}
              style={{
                padding: '0.8125rem',
                fontSize: '0.9375rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                border: 'none',
              }}
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 50%, var(--gray-900) 100%)',
      padding: '1.25rem',
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
        maxWidth: '440px',
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
            Start managing your gym in minutes
          </p>
        </div>

        {/* Register Card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            Create your account
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Free to try. No credit card required.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Gym Name */}
            <div className="form-group" style={{ marginBottom: '0.875rem' }}>
              <label htmlFor="gym_name" className="form-label" style={{ fontWeight: 600 }}>Gym Name</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={16} style={{
                  position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)', pointerEvents: 'none',
                }} />
                <input
                  id="gym_name"
                  className="form-input"
                  placeholder="e.g. FitZone Gym"
                  value={formData.gym_name}
                  onChange={(e) => updateField('gym_name', e.target.value)}
                  required
                  aria-required="true"
                  autoFocus
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            {/* Owner Name */}
            <div className="form-group" style={{ marginBottom: '0.875rem' }}>
              <label htmlFor="owner_name" className="form-label" style={{ fontWeight: 600 }}>Owner Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{
                  position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)', pointerEvents: 'none',
                }} />
                <input
                  id="owner_name"
                  className="form-input"
                  placeholder="e.g. Rajesh Kumar"
                  value={formData.owner_name}
                  onChange={(e) => updateField('owner_name', e.target.value)}
                  required
                  aria-required="true"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group" style={{ marginBottom: '0.875rem' }}>
              <label htmlFor="reg_email" className="form-label" style={{ fontWeight: 600 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)', pointerEvents: 'none',
                }} />
                <input
                  id="reg_email"
                  type="email"
                  className="form-input"
                  placeholder="you@yourgym.com"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  required
                  aria-required="true"
                  autoComplete="email"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="form-group" style={{ marginBottom: '0.875rem' }}>
              <label htmlFor="reg_phone" className="form-label" style={{ fontWeight: 600 }}>Phone</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{
                  position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)', pointerEvents: 'none',
                }} />
                <input
                  id="reg_phone"
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  required
                  aria-required="true"
                  maxLength={13}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="reg_password" className="form-label" style={{ fontWeight: 600 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)', pointerEvents: 'none',
                }} />
                <input
                  id="reg_password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  required
                  aria-required="true"
                  minLength={6}
                  autoComplete="new-password"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-tertiary)', padding: '0.25rem',
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
              disabled={isSubmitting}
              style={{
                padding: '0.8125rem',
                fontSize: '0.9375rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                border: 'none',
              }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign in link */}
          <p style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            marginTop: '1.25rem',
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
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
