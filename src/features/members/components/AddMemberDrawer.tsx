import { useState, useEffect } from 'react'
import { FocusTrap } from 'focus-trap-react'
import { X, Check, User, ExternalLink, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { toast } from '@/components/Toast'
import { sanitizeInput, sanitizePhone } from '@/lib/sanitize'
import { useMockDbStore } from '@/lib/mock-db'
import { generateMemberCode } from '@/lib/utils'
import type { Member, Membership, PaymentMethod, MembershipStatus, Lead } from '@/types'
import { useNavigate } from 'react-router-dom'

interface AddMemberDrawerProps {
  onClose: () => void
  onSubmit: (member: Member, membership: Membership) => void
  existingMembersCount: number
  prefillLead?: Lead
}

export function AddMemberDrawer({ onClose, onSubmit, existingMembersCount, prefillLead }: AddMemberDrawerProps) {
  const navigate = useNavigate()
  const plans = useMockDbStore((state) => state.plans).filter(p => p.is_active)
  const members = useMockDbStore((state) => state.members)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [createdMemberId, setCreatedMemberId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: prefillLead ? `${prefillLead.first_name} ${prefillLead.last_name || ''}`.trim() : '',
    phone: prefillLead?.phone ? prefillLead.phone.replace('+91', '') : '',
    selectedPlanId: sessionStorage.getItem('last_selected_plan') || '',
    amount_paid: 0,
    payment_method: 'cash' as PaymentMethod,
    // Advanced
    email: prefillLead?.email || '',
    gender: (prefillLead?.gender || '') as any,
    date_of_birth: '',
    blood_group: '',
    medical_conditions: '',
    source: prefillLead?.source || 'walk_in',
    notes: prefillLead?.notes || '',
    tags: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  })

  // Auto-update amount paid when plan changes
  useEffect(() => {
    const plan = plans.find(p => p.id === formData.selectedPlanId)
    if (plan) {
      setFormData(prev => ({ ...prev, amount_paid: plan.price }))
    }
  }, [formData.selectedPlanId, plans])

  const normalizePhone = (p: string) => {
    let clean = p.replace(/\D/g, '')
    if (clean.startsWith('91') && clean.length === 12) clean = clean.substring(2)
    else if (clean.startsWith('0') && clean.length === 11) clean = clean.substring(1)
    return clean
  }

  const existingDuplicate = members.find(m => {
    const cleanInput = normalizePhone(formData.phone)
    if (cleanInput.length < 10) return false
    return normalizePhone(m.phone) === cleanInput
  })

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (existingDuplicate) {
      toast.error('This phone number is already registered.')
      return
    }

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.selectedPlanId) {
      toast.error('Please fill all required fields.')
      return
    }

    setIsSubmitting(true)

    // Split name safely
    const nameParts = formData.fullName.trim().split(' ')
    const first_name = nameParts[0]
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

    const selectedPlan = plans.find(p => p.id === formData.selectedPlanId)!
    sessionStorage.setItem('last_selected_plan', selectedPlan.id)
    
    const start_date = new Date()
    const calculatedEndDate = new Date(start_date)
    calculatedEndDate.setDate(calculatedEndDate.getDate() + selectedPlan.duration_days)

    const memberId = `mem_${Date.now()}`
    const membershipId = `ms_${Date.now()}`
    const newMemberCode = generateMemberCode(existingMembersCount + 1)

    const tagsArray = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
      : []

    // Construct Member Object
    const newMember: Member = {
      id: memberId,
      tenant_id: 'tenant_001',
      branch_id: null,
      user_id: null,
      lead_id: prefillLead?.id || null,
      member_code: newMemberCode,
      first_name: sanitizeInput(first_name),
      last_name: sanitizeInput(last_name),
      phone: sanitizePhone(formData.phone.startsWith('+91') ? formData.phone : `+91${formData.phone.replace(/\D/g, '')}`),
      email: formData.email.trim() || null,
      gender: formData.gender || null,
      date_of_birth: formData.date_of_birth || null,
      address: formData.address ? sanitizeInput(formData.address) : null,
      emergency_contact_name: formData.emergency_contact_name ? sanitizeInput(formData.emergency_contact_name) : null,
      emergency_contact_phone: formData.emergency_contact_phone ? sanitizePhone(formData.emergency_contact_phone.startsWith('+91') ? formData.emergency_contact_phone : `+91${formData.emergency_contact_phone.replace(/\D/g, '')}`) : null,
      photo_url: null,
      blood_group: formData.blood_group || null,
      medical_conditions: formData.medical_conditions ? sanitizeInput(formData.medical_conditions) : null,
      source: formData.source || 'walk_in',
      notes: formData.notes ? sanitizeInput(formData.notes) : null,
      qr_code: null,
      tags: tagsArray,
      status: 'active',
      joined_at: start_date.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }

    // Determine payment status
    let payment_status: 'paid' | 'partial' | 'pending' = 'pending'
    if (formData.amount_paid >= selectedPlan.price) {
      payment_status = 'paid'
    } else if (formData.amount_paid > 0) {
      payment_status = 'partial'
    }

    // Construct Membership Object
    const newMembership: Membership = {
      id: membershipId,
      tenant_id: 'tenant_001',
      member_id: memberId,
      plan_id: selectedPlan.id,
      plan_name: selectedPlan.name,
      start_date: start_date.toISOString().split('T')[0],
      end_date: calculatedEndDate.toISOString().split('T')[0],
      actual_price: selectedPlan.price,
      discount_amount: 0,
      status: 'active' as MembershipStatus,
      frozen_at: null,
      frozen_until: null,
      freeze_reason: null,
      freeze_days_used: 0,
      payment_status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }

    // Wait slightly to show saving state (UX)
    await new Promise(resolve => setTimeout(resolve, 300))

    onSubmit(newMember, newMembership)
    setCreatedMemberId(memberId)
    setIsSuccess(true)
    setIsSubmitting(false)
  }

  const handleReset = () => {
    setFormData({
      fullName: '',
      phone: '',
      selectedPlanId: sessionStorage.getItem('last_selected_plan') || '',
      amount_paid: 0,
      payment_method: 'cash',
      email: '',
      gender: '' as any,
      date_of_birth: '',
      blood_group: '',
      medical_conditions: '',
      source: 'walk_in',
      notes: '',
      tags: '',
      address: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
    })
    setIsSuccess(false)
    setCreatedMemberId(null)
    setShowAdvanced(false)
  }

  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <FocusTrap focusTrapOptions={{
        onDeactivate: onClose,
        initialFocus: isSuccess ? '#member-success-btn' : '#member-full-name',
        fallbackFocus: '.drawer',
        clickOutsideDeactivates: true
      }}>
      <div className="drawer" style={{ maxWidth: '450px' }} role="dialog" aria-modal="true" aria-labelledby="add-member-title">
        <div className="drawer-header">
          <h2 id="add-member-title" className="drawer-title">Add New Member</h2>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose} type="button" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3rem 1.5rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--success-100)', color: 'var(--success-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Check size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Member Added Successfully!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              The member profile, active plan, and payment receipt have been generated.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
              <button id="member-success-btn" className="btn btn-primary" onClick={handleReset} style={{ width: '100%', justifyContent: 'center' }}>
                <User size={18} />
                Record Another Member
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  onClose()
                  if (createdMemberId) {
                    navigate(`/members?id=${createdMemberId}`)
                  }
                }} 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <ExternalLink size={18} />
                View Member Profile
              </button>
            </div>
          </div>
        ) : (
          <form id="add-member-form" className="drawer-body" onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Quick Entry Fields */}
            <div className="form-group">
              <label className="form-label form-label-required">Full Name</label>
              <input
                id="member-full-name"
                className="form-input"
                placeholder="e.g. Karan Malhotra"
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Phone Number</label>
              <input
                className="form-input"
                placeholder="e.g. 9999988888"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                type="tel"
                maxLength={10}
                required
              />
              {existingDuplicate && (
                <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'var(--warning-50)', border: '1px solid var(--warning-200)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--warning-800)', fontSize: '0.8125rem' }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontWeight: 500, lineHeight: 1.4 }}>
                      Phone number already belongs to <strong>{existingDuplicate.first_name} {existingDuplicate.last_name}</strong>.
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-sm" 
                    style={{ background: 'white', border: '1px solid var(--warning-300)', color: 'var(--warning-800)', alignSelf: 'flex-start' }}
                    onClick={() => {
                      onClose()
                      navigate(`/members?id=${existingDuplicate.id}`)
                    }}
                  >
                    Open Existing Profile
                  </button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Membership Plan</label>
              <select
                className="form-input form-select"
                value={formData.selectedPlanId}
                onChange={(e) => updateField('selectedPlanId', e.target.value)}
                required
              >
                <option value="" disabled>Select a plan...</option>
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} (₹{plan.price})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label form-label-required">Amount Received (₹)</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  value={formData.amount_paid}
                  onChange={(e) => updateField('amount_paid', Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Payment Method</label>
                <select
                  className="form-input form-select"
                  value={formData.payment_method}
                  onChange={(e) => updateField('payment_method', e.target.value)}
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI (GPay/PhonePe)</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            {(() => {
              const selectedPlan = plans.find(p => p.id === formData.selectedPlanId)
              if (selectedPlan && formData.amount_paid < selectedPlan.price) {
                const balance = selectedPlan.price - formData.amount_paid
                return (
                  <div style={{ marginTop: '-0.5rem', padding: '0.75rem', background: 'var(--warning-50)', border: '1px solid var(--warning-200)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning-800)', fontSize: '0.8125rem' }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                    <span style={{ fontWeight: 500, lineHeight: 1.4 }}>
                      Partial Payment: <strong>₹{balance}</strong> will be marked as pending due.
                    </span>
                  </div>
                )
              }
              return null
            })()}

            {/* Advanced Section Toggle */}
            <div style={{ borderTop: '1px solid var(--border-secondary)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  width: '100%', 
                  background: 'none', 
                  border: 'none', 
                  padding: '0.5rem', 
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  fontSize: '0.875rem'
                }}
              >
                Complete Profile (Optional)
                {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Advanced Details */}
            {showAdvanced && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.2s ease-out' }}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="karan@example.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                </div>

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
                    <label className="form-label">Birth Date</label>
                    <input
                      className="form-input"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => updateField('date_of_birth', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select
                      className="form-input form-select"
                      value={formData.blood_group}
                      onChange={(e) => updateField('blood_group', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option><option value="A-">A-</option>
                      <option value="B+">B+</option><option value="B-">B-</option>
                      <option value="AB+">AB+</option><option value="AB-">AB-</option>
                      <option value="O+">O+</option><option value="O-">O-</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Source</label>
                    <select
                      className="form-input form-select"
                      value={formData.source}
                      onChange={(e) => updateField('source', e.target.value)}
                    >
                      <option value="walk_in">Walk-in</option>
                      <option value="instagram">Instagram</option>
                      <option value="google">Google</option>
                      <option value="referral">Referral</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Medical Conditions</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Asthma, Knee pain"
                    value={formData.medical_conditions}
                    onChange={(e) => updateField('medical_conditions', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    className="form-input"
                    placeholder="Local address..."
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Emergency Name</label>
                    <input
                      className="form-input"
                      placeholder="Name"
                      value={formData.emergency_contact_name}
                      onChange={(e) => updateField('emergency_contact_name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Emergency Phone</label>
                    <input
                      className="form-input"
                      type="tel"
                      placeholder="Phone"
                      value={formData.emergency_contact_phone}
                      onChange={(e) => updateField('emergency_contact_phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* The invisible submit is removed. The main button uses type="submit" */}
          </form>
        )}

        {/* Footer */}
        {!isSuccess && (
          <div className="drawer-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button 
              type="submit" 
              form="add-member-form"
              className="btn btn-primary" 
              onClick={handleFormSubmit} 
              disabled={isSubmitting || !!existingDuplicate}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Save Member
                </>
              )}
            </button>
          </div>
        )}
      </div>
      </FocusTrap>
    </>
  )
}
