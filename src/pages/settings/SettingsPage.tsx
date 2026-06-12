import { useState, useEffect } from 'react'
import { Settings, Save, Sparkles, Loader2, CheckCircle2 } from 'lucide-react'
import { useSettings, useUpdateSettings } from '@/features/settings/hooks/useSettings'
import { useThemeStore } from '@/store/theme.store'
import type { GymSettings } from '@/types'

export function SettingsPage() {
  const { data: settings, isLoading } = useSettings()
  const updateSettingsMutation = useUpdateSettings()

  const [formData, setFormData] = useState<GymSettings>({
    gym_name: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    theme: 'blue',
    currency: 'INR',
  })
  
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [validationError, setValidationError] = useState('')

  // Prefill state once settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData(settings)
      useThemeStore.getState().setTheme(settings.theme)
    }
  }, [settings])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    if (!formData.gym_name.trim()) {
      setValidationError('Gym name is required.')
      return
    }

    updateSettingsMutation.mutate(formData, {
      onSuccess: () => {
        setShowSuccessToast(true)
        useThemeStore.getState().setTheme(formData.theme)
        setTimeout(() => setShowSuccessToast(false), 3000)
      },
    })
  }

  if (isLoading || !settings) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        gap: '1rem',
        color: 'var(--text-secondary)'
      }}>
        <Loader2 size={36} className="animate-spin" style={{ color: 'var(--primary-500)' }} />
        <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>Loading business settings...</p>
      </div>
    )
  }

  return (
    <div className="page-enter">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Gym Settings</h1>
          <p className="page-subtitle">Configure your gym name, contact profiles, currency symbol, and color layout</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Main Settings Form */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-secondary)', paddingBottom: '0.75rem' }}>
            <Settings size={18} style={{ color: 'var(--primary-500)' }} />
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Business Profile</h2>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {validationError && (
              <div style={{
                padding: '0.75rem',
                background: 'var(--danger-50)',
                color: 'var(--danger-700)',
                border: '1px solid var(--danger-100)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
              }}>
                {validationError}
              </div>
            )}

            {/* Gym Name */}
            <div className="form-group">
              <label className="form-label form-label-required">Gym/Club Name</label>
              <input
                className="form-input"
                placeholder="e.g. Iron Temple Gym"
                value={formData.gym_name}
                onChange={(e) => setFormData(prev => ({ ...prev, gym_name: e.target.value }))}
              />
            </div>

            {/* Phone & Email */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  className="form-input"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="e.g. info@irontemple.com"
                  value={formData.contact_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                />
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label">Physical Address</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Street address details..."
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                style={{ resize: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem' }}
              />
            </div>

            {/* Currency Dropdown */}
            <div className="form-group">
              <label className="form-label">Default Currency Symbol</label>
              <select
                className="form-input form-select"
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
              >
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
                <option value="GBP">£ GBP (British Pound)</option>
              </select>
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={updateSettingsMutation.isPending}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {updateSettingsMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save Settings
              </button>
            </div>
          </form>
        </div>

        {/* Visual Customizer Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Theme customizer */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-secondary)', paddingBottom: '0.75rem' }}>
              <Sparkles size={18} style={{ color: 'var(--warning-500)' }} />
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Brand Palette</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Select a visual highlight layout to brand your GymOS dashboard panel.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {([
                  { value: 'blue', name: 'Royal Blue', color: '#6366F1' },
                  { value: 'green', name: 'Emerald Green', color: '#10B981' },
                  { value: 'orange', name: 'Sunset Orange', color: '#F97316' },
                  { value: 'purple', name: 'Orchid Purple', color: '#8B5CF6' },
                ] as const).map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, theme: t.value }))}
                    style={{
                      border: formData.theme === t.value ? '2px solid var(--primary-600)' : '1px solid var(--border-primary)',
                      background: 'white',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.75rem',
                      fontWeight: formData.theme === t.value ? 600 : 400,
                    }}
                  >
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: t.color }} />
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Success Dialog Popup */}
          {showSuccessToast && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              background: 'var(--success-50)',
              border: '1px solid var(--success-100)',
              color: 'var(--success-800)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-md)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              animation: 'slideUp 0.3s ease',
            }}>
              <CheckCircle2 size={18} style={{ color: 'var(--success-600)' }} />
              Settings updated successfully! Theme color applied to system context.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
