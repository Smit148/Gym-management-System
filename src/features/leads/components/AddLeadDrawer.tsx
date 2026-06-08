import { useState } from 'react'
import { X } from 'lucide-react'
import type { Lead, LeadSource } from '@/types'
import { leadDetailsSchema } from '../schemas/lead.schema'

interface AddLeadDrawerProps {
  onClose: () => void
  onSubmit: (lead: Lead) => void
}

const sources: { value: LeadSource; label: string }[] = [
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'google', label: 'Google' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'referral', label: 'Referral' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'website', label: 'Website' },
  { value: 'other', label: 'Other' },
]

export function AddLeadDrawer({ onClose, onSubmit }: AddLeadDrawerProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    age_range: '',
    source: 'walk_in' as LeadSource,
    interest: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const result = leadDetailsSchema.safeParse(formData)
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string
        newErrors[path] = issue.message
      })
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 500))

    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      tenant_id: 'tenant_001',
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      phone: formData.phone.startsWith('+91') ? formData.phone : `+91${formData.phone.replace(/\D/g, '')}`,
      email: formData.email || null,
      gender: formData.gender || null,
      age_range: formData.age_range || null,
      source: formData.source,
      referral_member_id: null,
      interest: formData.interest || null,
      status: 'new',
      lost_reason: null,
      notes: formData.notes || null,
      next_followup_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: 'usr_001',
      converted_member_id: null,
      converted_at: null,
      created_by: 'usr_001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }

    onSubmit(newLead)
    setIsSubmitting(false)
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-header">
          <h2 className="drawer-title">Add New Lead</h2>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="drawer-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Name row */}
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label form-label-required">First Name</label>
                  <input
                    className={`form-input ${errors.first_name ? 'form-input-error' : ''}`}
                    placeholder="e.g. Rahul"
                    value={formData.first_name}
                    onChange={(e) => updateField('first_name', e.target.value)}
                    autoFocus
                  />
                  {errors.first_name && <span className="form-error">{errors.first_name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Sharma"
                    value={formData.last_name}
                    onChange={(e) => updateField('last_name', e.target.value)}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label form-label-required">Phone Number</label>
                <input
                  className={`form-input ${errors.phone ? 'form-input-error' : ''}`}
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  type="tel"
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                  placeholder="rahul@gmail.com (optional)"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  type="email"
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              {/* Gender & Age */}
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-input form-select"
                    value={formData.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Age Range</label>
                  <select
                    className="form-input form-select"
                    value={formData.age_range}
                    onChange={(e) => updateField('age_range', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="15-20">15–20</option>
                    <option value="20-25">20–25</option>
                    <option value="25-30">25–30</option>
                    <option value="30-35">30–35</option>
                    <option value="35-40">35–40</option>
                    <option value="40-50">40–50</option>
                    <option value="50+">50+</option>
                  </select>
                </div>
              </div>

              {/* Source */}
              <div className="form-group">
                <label className="form-label">Lead Source</label>
                <select
                  className="form-input form-select"
                  value={formData.source}
                  onChange={(e) => updateField('source', e.target.value)}
                >
                  {sources.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Interest */}
              <div className="form-group">
                <label className="form-label">Interest / Goals</label>
                <input
                  className="form-input"
                  placeholder="e.g. Weight training, Yoga, Weight loss"
                  value={formData.interest}
                  onChange={(e) => updateField('interest', e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  placeholder="Any additional notes about this lead..."
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          <div className="drawer-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                  Saving...
                </>
              ) : (
                'Add Lead'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
