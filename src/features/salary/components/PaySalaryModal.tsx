import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { useMarkSalaryPaid } from '../hooks/useSalary'
import type { SalaryRecord, PaymentMethod } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface PaySalaryModalProps {
  record: SalaryRecord
  onClose: () => void
}

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'card', label: 'Card' },
]

export function PaySalaryModal({ record, onClose }: PaySalaryModalProps) {
  const markPaidMutation = useMarkSalaryPaid()
  const remaining = record.amount - record.paid_amount

  const [paidAmount, setPaidAmount] = useState(remaining)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (paidAmount <= 0) {
      setError('Amount must be greater than 0.')
      return
    }
    if (paidAmount > remaining) {
      setError(`Amount cannot exceed remaining balance of ${formatCurrency(remaining)}.`)
      return
    }

    markPaidMutation.mutate(
      { recordId: record.id, paidAmount, paymentMethod },
      { onSuccess: onClose }
    )
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          zIndex: 999, animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(440px, 90vw)', background: 'white',
        borderRadius: 'var(--radius-xl)', zIndex: 1000,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        animation: 'slideUp 0.3s ease',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-primary)',
        }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Pay Salary</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
              {record.staff_name} — {record.month}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Summary */}
        <div style={{ padding: '1rem 1.5rem', background: 'var(--gray-50)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Salary</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(record.amount)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Already Paid</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success-600)' }}>{formatCurrency(record.paid_amount)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Remaining</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: remaining > 0 ? 'var(--warning-600)' : 'var(--success-600)' }}>
              {formatCurrency(remaining)}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <div style={{
              padding: '0.625rem 0.75rem', background: 'var(--danger-50)',
              color: 'var(--danger-700)', border: '1px solid var(--danger-100)',
              borderRadius: 'var(--radius-md)', fontSize: '0.75rem',
            }}>
              {error}
            </div>
          )}

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label form-label-required">Amount (₹)</label>
              <input
                className="form-input"
                type="number"
                min={1}
                max={remaining}
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label className="form-label form-label-required">Payment Method</label>
              <select
                className="form-input form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              >
                {paymentMethods.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={markPaidMutation.isPending}
              style={{ background: 'var(--success-600)', borderColor: 'var(--success-600)' }}
            >
              {markPaidMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : null}
              Pay {formatCurrency(paidAmount)}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
