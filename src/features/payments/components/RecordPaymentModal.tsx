import { useState, useMemo, useEffect } from 'react'
import { X, CreditCard } from 'lucide-react'
import { useMembers, useMemberships } from '@/features/members/hooks/useMembers'
import { usePayments, useCreatePayment } from '../hooks/usePayments'
import { recordPaymentSchema } from '../schemas/payment.schema'
import { formatCurrency } from '@/lib/utils'
import type { Payment, PaymentMethod } from '@/types'

interface RecordPaymentModalProps {
  onClose: () => void
  prefilledMemberId?: string
}

export function RecordPaymentModal({ onClose, prefilledMemberId }: RecordPaymentModalProps) {
  const { data: members = [] } = useMembers()
  const { data: memberships = [] } = useMemberships()
  const { data: payments = [] } = usePayments()
  const createPaymentMutation = useCreatePayment()

  const [formData, setFormData] = useState({
    member_id: prefilledMemberId || '',
    amount: 0,
    payment_method: 'upi' as PaymentMethod,
    reference_number: '',
    description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Find active membership and remaining dues for selected member
  const memberDuesDetails = useMemo(() => {
    if (!formData.member_id) return null
    
    const selectedMember = members.find(m => m.id === formData.member_id)
    if (!selectedMember) return null

    const ms = memberships.find(m => m.member_id === formData.member_id && m.status === 'active')
    if (!ms) return { memberName: `${selectedMember.first_name} ${selectedMember.last_name || ''}`, activeMembership: null, netPayable: 0, totalPaid: 0, balance: 0 }

    const netPayable = ms.actual_price - ms.discount_amount
    const totalPaid = payments
      .filter(p => p.membership_id === ms.id)
      .reduce((sum, p) => sum + p.amount, 0)
    const balance = Math.max(0, netPayable - totalPaid)

    return {
      memberName: `${selectedMember.first_name} ${selectedMember.last_name || ''}`,
      activeMembership: ms,
      netPayable,
      totalPaid,
      balance,
    }
  }, [formData.member_id, members, memberships, payments])

  // Pre-fill amount when member is selected
  useEffect(() => {
    if (memberDuesDetails && memberDuesDetails.balance > 0) {
      setFormData(prev => ({ ...prev, amount: memberDuesDetails.balance }))
    } else {
      setFormData(prev => ({ ...prev, amount: 0 }))
    }
  }, [memberDuesDetails])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    const result = recordPaymentSchema.safeParse({
      ...formData,
      amount: Number(formData.amount),
    })

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string
        newErrors[path] = issue.message
      })
    }

    if (memberDuesDetails && Number(formData.amount) > memberDuesDetails.balance) {
      newErrors.amount = `Amount paid cannot exceed outstanding due of ${formatCurrency(memberDuesDetails.balance)}`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !memberDuesDetails) return

    setIsSubmitting(true)
    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      tenant_id: 'tenant_001',
      member_id: formData.member_id,
      member_name: memberDuesDetails.memberName,
      membership_id: memberDuesDetails.activeMembership?.id || null,
      amount: Number(formData.amount),
      payment_method: formData.payment_method,
      payment_status: 'completed',
      reference_number: formData.reference_number.trim() || null,
      description: formData.description.trim() || `Payment for ${memberDuesDetails.activeMembership?.plan_name || 'membership'}`,
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }

    createPaymentMutation.mutate(newPayment, {
      onSuccess: () => {
        setIsSubmitting(false)
        onClose()
      },
      onError: () => {
        setIsSubmitting(false)
      }
    })
  }

  return (
    <>
      <div className="modal-overlay" style={{ zIndex: 1050 }} onClick={onClose} />
      <div className="modal" style={{ zIndex: 1060, maxWidth: '450px', width: '90%' }}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={18} style={{ color: 'var(--primary-500)' }} />
            Record Payment Collection
          </h3>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Member Selector */}
            <div className="form-group">
              <label className="form-label form-label-required">Select Member</label>
              <select
                className={`form-input form-select ${errors.member_id ? 'form-input-error' : ''}`}
                value={formData.member_id}
                onChange={(e) => setFormData(prev => ({ ...prev, member_id: e.target.value }))}
                disabled={!!prefilledMemberId}
              >
                <option value="">Select Member</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.first_name} {m.last_name || ''} ({m.member_code})
                  </option>
                ))}
              </select>
              {errors.member_id && <span className="form-error">{errors.member_id}</span>}
            </div>

            {/* Dues Context Alert */}
            {memberDuesDetails && (
              <div style={{
                padding: '0.875rem',
                background: memberDuesDetails.balance > 0 ? 'var(--warning-50)' : 'var(--success-50)',
                color: memberDuesDetails.balance > 0 ? 'var(--warning-800)' : 'var(--success-800)',
                border: `1px solid ${memberDuesDetails.balance > 0 ? 'var(--warning-100)' : 'var(--success-100)'}`,
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.8125rem',
              }}>
                {memberDuesDetails.activeMembership ? (
                  <div>
                    <strong>Active Plan:</strong> {memberDuesDetails.activeMembership.plan_name}
                    <div className="grid-2" style={{ gap: '0.25rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                      <div>Total Price: {formatCurrency(memberDuesDetails.netPayable)}</div>
                      <div>Total Paid: {formatCurrency(memberDuesDetails.totalPaid)}</div>
                      <div style={{ gridColumn: 'span 2', marginTop: '0.25rem', fontWeight: 600 }}>
                        {memberDuesDetails.balance > 0
                          ? `Outstanding Balance: ${formatCurrency(memberDuesDetails.balance)}`
                          : 'No outstanding dues! Membership fully paid.'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>No active plan assigned to this member. You can record a manual payment anyway.</div>
                )}
              </div>
            )}

            {/* Payment Amount */}
            <div className="form-group">
              <label className="form-label form-label-required">Payment Amount (₹)</label>
              <input
                className={`form-input ${errors.amount ? 'form-input-error' : ''}`}
                type="number"
                value={formData.amount || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                placeholder="e.g. 5000"
              />
              {errors.amount && <span className="form-error">{errors.amount}</span>}
            </div>

            {/* Payment Method */}
            <div className="form-group">
              <label className="form-label form-label-required">Payment Method</label>
              <select
                className="form-input form-select"
                value={formData.payment_method}
                onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value as PaymentMethod }))}
              >
                <option value="upi">UPI (GPay, PhonePe, Paytm)</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            {/* Transaction Ref Number */}
            <div className="form-group">
              <label className="form-label">Reference / Txn ID (Optional)</label>
              <input
                className="form-input"
                placeholder="e.g. UPI881726510"
                value={formData.reference_number}
                onChange={(e) => setFormData(prev => ({ ...prev, reference_number: e.target.value }))}
              />
            </div>

            {/* Notes / Description */}
            <div className="form-group">
              <label className="form-label">Notes</label>
              <input
                className="form-input"
                placeholder="e.g. Monthly instalment payment"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || !!(memberDuesDetails && memberDuesDetails.activeMembership && memberDuesDetails.balance === 0)}>
              {isSubmitting ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
