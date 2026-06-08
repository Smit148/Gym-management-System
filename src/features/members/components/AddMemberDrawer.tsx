import { useState, useEffect } from 'react'
import { X, ShieldAlert, Check, Calendar, CreditCard, ChevronRight, ChevronLeft } from 'lucide-react'
import { useMockDbStore } from '@/lib/mock-db'
import { formatDate, formatPhone, formatCurrency, generateMemberCode } from '@/lib/utils'
import type { Member, Membership, PaymentMethod, MembershipStatus, Lead } from '@/types'
import { personalDetailsSchema, planDetailsSchema, paymentDetailsSchema } from '../schemas/member.schema'

interface AddMemberDrawerProps {
  onClose: () => void
  onSubmit: (member: Member, membership: Membership) => void
  existingMembersCount: number
  prefillLead?: Lead
}

type FormStep = 'personal' | 'plan' | 'payment' | 'review'

export function AddMemberDrawer({ onClose, onSubmit, existingMembersCount, prefillLead }: AddMemberDrawerProps) {
  const plans = useMockDbStore((state) => state.plans)
  const [step, setStep] = useState<FormStep>('personal')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form State
  const [personalData, setPersonalData] = useState({
    first_name: prefillLead?.first_name || '',
    last_name: prefillLead?.last_name || '',
    phone: prefillLead?.phone ? prefillLead.phone.replace('+91', '') : '',
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

  const [planData, setPlanData] = useState(() => {
    const p = useMockDbStore.getState().plans
    return {
      selectedPlanId: p[0]?.id || '',
      start_date: new Date().toISOString().split('T')[0],
      actual_price: p[0]?.price || 0,
      discount_amount: 0,
      discount_reason: '',
    }
  })

  const [paymentData, setPaymentData] = useState(() => {
    const p = useMockDbStore.getState().plans
    return {
      amount_paid: p[0]?.price || 0,
      payment_method: 'upi' as PaymentMethod,
    }
  })

  // Watch for plan changes to update pricing
  useEffect(() => {
    const plan = plans.find(p => p.id === planData.selectedPlanId)
    if (plan) {
      setPlanData(prev => ({
        ...prev,
        actual_price: plan.price,
        discount_amount: 0,
        discount_reason: '',
      }))
      setPaymentData(prev => ({
        ...prev,
        amount_paid: plan.price,
      }))
    }
  }, [planData.selectedPlanId, plans])

  // Watch for discount/price changes to update default payment amount
  const netPrice = Math.max(0, planData.actual_price - planData.discount_amount)

  useEffect(() => {
    setPaymentData(prev => ({
      ...prev,
      amount_paid: netPrice,
    }))
  }, [netPrice])

  // Validation
  const validateStep = (currentStep: FormStep): boolean => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 'personal') {
      const result = personalDetailsSchema.safeParse(personalData)
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          const path = issue.path[0] as string
          newErrors[path] = issue.message
        })
      }
    }

    if (currentStep === 'plan') {
      const result = planDetailsSchema.safeParse(planData)
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          const path = issue.path[0] as string
          newErrors[path] = issue.message
        })
      }
    }

    if (currentStep === 'payment') {
      const result = paymentDetailsSchema.safeParse(paymentData)
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          const path = issue.path[0] as string
          newErrors[path] = issue.message
        })
      }
      if (paymentData.amount_paid > netPrice) {
        newErrors.amount_paid = 'Amount paid cannot exceed net payable amount'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep(step)) return
    if (step === 'personal') setStep('plan')
    else if (step === 'plan') setStep('payment')
    else if (step === 'payment') setStep('review')
  }

  const handleBack = () => {
    if (step === 'plan') setStep('personal')
    else if (step === 'payment') setStep('plan')
    else if (step === 'review') setStep('payment')
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep('review')) return

    setIsSubmitting(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const selectedPlan = plans.find(p => p.id === planData.selectedPlanId)!
    const calculatedEndDate = new Date(planData.start_date)
    calculatedEndDate.setDate(calculatedEndDate.getDate() + selectedPlan.duration_days)

    const memberId = `mem_${Date.now()}`
    const membershipId = `ms_${Date.now()}`
    const newMemberCode = generateMemberCode(existingMembersCount + 1)

    const tagsArray = personalData.tags
      ? personalData.tags.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
      : []

    // Construct Member Object
    const newMember: Member = {
      id: memberId,
      tenant_id: 'tenant_001',
      branch_id: null,
      user_id: null,
      lead_id: null,
      member_code: newMemberCode,
      first_name: personalData.first_name.trim(),
      last_name: personalData.last_name.trim(),
      phone: personalData.phone.startsWith('+91') ? personalData.phone : `+91${personalData.phone.replace(/\D/g, '')}`,
      email: personalData.email.trim() || null,
      gender: personalData.gender || null,
      date_of_birth: personalData.date_of_birth || null,
      address: personalData.address.trim() || null,
      emergency_contact_name: personalData.emergency_contact_name.trim() || null,
      emergency_contact_phone: personalData.emergency_contact_phone ? (personalData.emergency_contact_phone.startsWith('+91') ? personalData.emergency_contact_phone : `+91${personalData.emergency_contact_phone.replace(/\D/g, '')}`) : null,
      photo_url: null,
      blood_group: personalData.blood_group || null,
      medical_conditions: personalData.medical_conditions.trim() || null,
      source: personalData.source || 'walk_in',
      notes: personalData.notes.trim() || null,
      qr_code: null,
      tags: tagsArray,
      status: 'active',
      joined_at: new Date(planData.start_date).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }

    // Determine status & payment status
    let payment_status: 'paid' | 'partial' | 'pending' = 'pending'
    if (paymentData.amount_paid === netPrice && netPrice > 0) {
      payment_status = 'paid'
    } else if (paymentData.amount_paid > 0) {
      payment_status = 'partial'
    }

    // Construct Membership Object
    const newMembership: Membership = {
      id: membershipId,
      tenant_id: 'tenant_001',
      member_id: memberId,
      plan_id: selectedPlan.id,
      plan_name: selectedPlan.name,
      start_date: planData.start_date,
      end_date: calculatedEndDate.toISOString().split('T')[0],
      actual_price: planData.actual_price,
      discount_amount: planData.discount_amount,
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

    onSubmit(newMember, newMembership)
    setIsSubmitting(false)
  }

  const updatePersonalField = (field: string, value: string) => {
    setPersonalData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const selectedPlan = plans.find(p => p.id === planData.selectedPlanId)

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer" style={{ maxWidth: '500px' }}>
        {/* Header */}
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">Add New Member</h2>
            <div className="flex items-center gap-1" style={{ marginTop: '0.25rem' }}>
              <span className={`step-badge ${step === 'personal' ? 'active' : ''}`}>1. Personal</span>
              <ChevronRight size={10} style={{ color: 'var(--text-tertiary)' }} />
              <span className={`step-badge ${step === 'plan' ? 'active' : ''}`}>2. Plan</span>
              <ChevronRight size={10} style={{ color: 'var(--text-tertiary)' }} />
              <span className={`step-badge ${step === 'payment' ? 'active' : ''}`}>3. Payment</span>
              <ChevronRight size={10} style={{ color: 'var(--text-tertiary)' }} />
              <span className={`step-badge ${step === 'review' ? 'active' : ''}`}>4. Review</span>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Step Content */}
        <div className="drawer-body">
          {step === 'personal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Name Row */}
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label form-label-required">First Name</label>
                  <input
                    className={`form-input ${errors.first_name ? 'form-input-error' : ''}`}
                    placeholder="e.g. Karan"
                    value={personalData.first_name}
                    onChange={(e) => updatePersonalField('first_name', e.target.value)}
                    autoFocus
                  />
                  {errors.first_name && <span className="form-error">{errors.first_name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Malhotra"
                    value={personalData.last_name}
                    onChange={(e) => updatePersonalField('last_name', e.target.value)}
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="form-group">
                <label className="form-label form-label-required">Phone Number</label>
                <input
                  className={`form-input ${errors.phone ? 'form-input-error' : ''}`}
                  placeholder="+91 99999 88888"
                  value={personalData.phone}
                  onChange={(e) => updatePersonalField('phone', e.target.value)}
                  type="tel"
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                  placeholder="karan@example.com (optional)"
                  value={personalData.email}
                  onChange={(e) => updatePersonalField('email', e.target.value)}
                  type="email"
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              {/* Gender, DOB & Blood Group */}
              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-input form-select"
                    value={personalData.gender}
                    onChange={(e) => updatePersonalField('gender', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Declined</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Birth Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={personalData.date_of_birth}
                    onChange={(e) => updatePersonalField('date_of_birth', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <select
                    className="form-input form-select"
                    value={personalData.blood_group}
                    onChange={(e) => updatePersonalField('blood_group', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="grid-2" style={{ padding: '0.875rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)' }}>
                <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Emergency Contact</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Name</label>
                  <input
                    className="form-input"
                    placeholder="Relation Name"
                    value={personalData.emergency_contact_name}
                    onChange={(e) => updatePersonalField('emergency_contact_name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    className={`form-input ${errors.emergency_contact_phone ? 'form-input-error' : ''}`}
                    placeholder="Phone number"
                    value={personalData.emergency_contact_phone}
                    onChange={(e) => updatePersonalField('emergency_contact_phone', e.target.value)}
                    type="tel"
                  />
                  {errors.emergency_contact_phone && <span className="form-error">{errors.emergency_contact_phone}</span>}
                </div>
              </div>

              {/* Address */}
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  className="form-input"
                  placeholder="Apt, street, locality..."
                  value={personalData.address}
                  onChange={(e) => updatePersonalField('address', e.target.value)}
                />
              </div>

              {/* Medical Conditions */}
              <div className="form-group">
                <label className="form-label">Medical Conditions / Injuries</label>
                <input
                  className="form-input"
                  placeholder="e.g. Asthma, Knee pain, Hypertension (optional)"
                  value={personalData.medical_conditions}
                  onChange={(e) => updatePersonalField('medical_conditions', e.target.value)}
                />
              </div>

              {/* Source & Notes */}
              <div className="form-group">
                <label className="form-label">How did they find us?</label>
                <select
                  className="form-input form-select"
                  value={personalData.source}
                  onChange={(e) => updatePersonalField('source', e.target.value)}
                >
                  <option value="walk_in">Walk-in</option>
                  <option value="instagram">Instagram</option>
                  <option value="google">Google Search</option>
                  <option value="referral">Member Referral</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input
                  className="form-input"
                  placeholder="e.g. VIP, Personal Training, Weight Loss"
                  value={personalData.tags}
                  onChange={(e) => updatePersonalField('tags', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  placeholder="Any extra info about the member..."
                  value={personalData.notes}
                  onChange={(e) => updatePersonalField('notes', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}

          {step === 'plan' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Select Plan */}
              <div className="form-group">
                <label className="form-label form-label-required">Membership Plan</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {plans.map((plan) => (
                    <label
                      key={plan.id}
                      className={`card select-plan-card ${planData.selectedPlanId === plan.id ? 'selected' : ''}`}
                      style={{
                        padding: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'between',
                        alignItems: 'center',
                        borderWidth: planData.selectedPlanId === plan.id ? '2px' : '1px',
                        borderColor: planData.selectedPlanId === plan.id ? 'var(--primary-600)' : 'var(--border-primary)',
                      }}
                    >
                      <input
                        type="radio"
                        name="selectedPlanId"
                        value={plan.id}
                        checked={planData.selectedPlanId === plan.id}
                        onChange={() => setPlanData(prev => ({ ...prev, selectedPlanId: plan.id }))}
                        className="sr-only"
                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{plan.name}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>({plan.duration_days} days)</span>
                        </div>
                        {plan.description && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                            {plan.description}
                          </div>
                        )}
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--primary-700)', fontSize: '1rem' }}>
                        {formatCurrency(plan.price)}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Start Date */}
              <div className="form-group">
                <label className="form-label form-label-required">Membership Start Date</label>
                <input
                  className={`form-input ${errors.start_date ? 'form-input-error' : ''}`}
                  type="date"
                  value={planData.start_date}
                  onChange={(e) => setPlanData(prev => ({ ...prev, start_date: e.target.value }))}
                />
                {selectedPlan && planData.start_date && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.375rem' }}>
                    <Calendar size={12} />
                    Ends on {formatDate(new Date(new Date(planData.start_date).getTime() + selectedPlan.duration_days * 24 * 60 * 60 * 1000))}
                  </div>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="card" style={{ padding: '1rem', background: 'var(--gray-50)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="flex justify-between" style={{ fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Base Price</span>
                    <span style={{ fontWeight: 500 }}>{formatCurrency(planData.actual_price)}</span>
                  </div>

                  {/* Apply Discount */}
                  <div className="grid-2" style={{ alignItems: 'start', gap: '0.5rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Discount Amount (₹)</label>
                      <input
                        className={`form-input ${errors.discount_amount ? 'form-input-error' : ''}`}
                        type="number"
                        placeholder="0"
                        value={planData.discount_amount || ''}
                        onChange={(e) => setPlanData(prev => ({ ...prev, discount_amount: Number(e.target.value) }))}
                      />
                      {errors.discount_amount && <span className="form-error">{errors.discount_amount}</span>}
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Discount Reason</label>
                      <input
                        className={`form-input ${errors.discount_reason ? 'form-input-error' : ''}`}
                        placeholder="e.g. Friend offer, Student discount"
                        value={planData.discount_reason}
                        onChange={(e) => setPlanData(prev => ({ ...prev, discount_reason: e.target.value }))}
                        disabled={!planData.discount_amount}
                      />
                      {errors.discount_reason && <span className="form-error">{errors.discount_reason}</span>}
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-primary)', margin: '0.25rem 0' }} />

                  <div className="flex justify-between" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    <span>Net Payable</span>
                    <span style={{ color: 'var(--primary-600)' }}>{formatCurrency(netPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="card" style={{ padding: '1rem', background: 'var(--primary-50)', color: 'var(--primary-900)', border: '1px solid var(--primary-100)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.8 }}>Total Net Payable</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrency(netPrice)}</div>
                  </div>
                  <CreditCard size={32} style={{ opacity: 0.5 }} />
                </div>
              </div>

              {/* Amount Paid */}
              <div className="form-group">
                <label className="form-label form-label-required">Amount Paid Now (₹)</label>
                <input
                  className={`form-input ${errors.amount_paid ? 'form-input-error' : ''}`}
                  type="number"
                  placeholder={netPrice.toString()}
                  value={paymentData.amount_paid}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, amount_paid: Number(e.target.value) }))}
                />
                {errors.amount_paid && <span className="form-error">{errors.amount_paid}</span>}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    onClick={() => setPaymentData(prev => ({ ...prev, amount_paid: netPrice }))}
                  >
                    Pay Full (₹{netPrice})
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    onClick={() => setPaymentData(prev => ({ ...prev, amount_paid: 0 }))}
                  >
                    Pay Later (₹0)
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-input form-select"
                  value={paymentData.payment_method}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, payment_method: e.target.value as PaymentMethod }))}
                  disabled={paymentData.amount_paid === 0}
                >
                  <option value="upi">UPI (GPay, PhonePe, Paytm)</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              {/* Pending Due alert */}
              {netPrice - paymentData.amount_paid > 0 && (
                <div className="flex gap-2" style={{ padding: '0.875rem', background: 'var(--warning-50)', color: 'var(--warning-800)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--warning-100)', fontSize: '0.8125rem' }}>
                  <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--warning-600)' }} />
                  <div>
                    <span style={{ fontWeight: 600 }}>Partial Payment.</span> Remaining balance of{' '}
                    <span style={{ fontWeight: 700 }}>{formatCurrency(netPrice - paymentData.amount_paid)}</span> will be tracked as a pending due on the membership.
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'review' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Member profile summary */}
              <div>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>Member Profile</h3>
                <div className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="avatar avatar-md" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                      {personalData.first_name[0] || '?'}{personalData.last_name[0] || ''}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{personalData.first_name} {personalData.last_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{formatPhone(personalData.phone)}</div>
                    </div>
                  </div>
                  {personalData.email && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      <strong>Email:</strong> {personalData.email}
                    </div>
                  )}
                  {(personalData.emergency_contact_name || personalData.medical_conditions) && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-primary)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                      {personalData.medical_conditions && <div><strong>Medical:</strong> {personalData.medical_conditions}</div>}
                      {personalData.emergency_contact_name && <div><strong>Emergency:</strong> {personalData.emergency_contact_name} ({formatPhone(personalData.emergency_contact_phone)})</div>}
                    </div>
                  )}
                </div>
              </div>

              {/* Plan Summary */}
              <div>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>Plan & Pricing</h3>
                <div className="card" style={{ padding: '1rem' }}>
                  <div className="flex justify-between" style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span>{selectedPlan?.name}</span>
                    <span>{formatCurrency(planData.actual_price)}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div><strong>Duration:</strong> {selectedPlan?.duration_days} Days</div>
                    <div><strong>Validity:</strong> {formatDate(planData.start_date)} to {selectedPlan ? formatDate(new Date(new Date(planData.start_date).getTime() + selectedPlan.duration_days * 24 * 60 * 60 * 1000)) : ''}</div>
                    {planData.discount_amount > 0 && (
                      <div style={{ color: 'var(--warning-700)', display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-primary)', paddingTop: '0.25rem', marginTop: '0.25rem' }}>
                        <span>Discount: {planData.discount_reason ? `(${planData.discount_reason})` : ''}</span>
                        <span>- {formatCurrency(planData.discount_amount)}</span>
                      </div>
                    )}
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-primary)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                      <span>Net Price:</span>
                      <span>{formatCurrency(netPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>Payment Status</h3>
                <div className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="flex justify-between" style={{ fontSize: '0.8125rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Amount Paid:</span>
                      <span style={{ fontWeight: 600, color: 'var(--success-600)' }}>{formatCurrency(paymentData.amount_paid)}</span>
                    </div>
                    {paymentData.amount_paid > 0 && (
                      <div className="flex justify-between" style={{ fontSize: '0.8125rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Payment Method:</span>
                        <span style={{ fontWeight: 500, textTransform: 'uppercase' }}>{paymentData.payment_method}</span>
                      </div>
                    )}
                    <div className="flex justify-between" style={{ fontSize: '0.8125rem', borderTop: '1px dashed var(--border-primary)', paddingTop: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Pending Balance:</span>
                      <span style={{ fontWeight: 600, color: netPrice - paymentData.amount_paid > 0 ? 'var(--danger-600)' : 'var(--text-secondary)' }}>
                        {formatCurrency(netPrice - paymentData.amount_paid)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="drawer-footer">
          {step !== 'personal' ? (
            <button type="button" className="btn btn-secondary" onClick={handleBack} disabled={isSubmitting}>
              <ChevronLeft size={16} />
              Back
            </button>
          ) : (
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          )}

          {step !== 'review' ? (
            <button type="button" className="btn btn-primary" onClick={handleNext}>
              Next
              <ChevronRight size={16} />
            </button>
          ) : (
            <button type="button" className="btn btn-success" onClick={handleFormSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Register Member
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
