import { useState } from 'react'
import { X, ArrowUpFromLine } from 'lucide-react'
import { useCreateExpense } from '../hooks/useExpenses'
import { expenseSchema, expenseCategories } from '../schemas/expense.schema'
import type { Expense, ExpenseCategory } from '@/types'

interface AddExpenseModalProps {
  onClose: () => void
}

const categoryLabels: Record<ExpenseCategory, string> = {
  rent: 'Rent & Lease',
  electricity: 'Electricity Bill',
  staff_salary: 'Staff Salary',
  equipment_repair: 'Equipment Repair & Maintenance',
  cleaning: 'Cleaning & Sanitation',
  supplements_purchase: 'Supplements Purchase',
  marketing: 'Marketing & Ad Campaign',
  maintenance: 'General Maintenance',
  water: 'Water Supply',
  internet: 'Internet & WiFi Broadband',
  other: 'Other Miscellaneous',
}

export function AddExpenseModal({ onClose }: AddExpenseModalProps) {
  const createExpenseMutation = useCreateExpense()

  const [formData, setFormData] = useState({
    category: 'other' as ExpenseCategory,
    amount: 0,
    description: '',
    expense_date: new Date().toISOString().split('T')[0],
    is_recurring: false,
    frequency: 'monthly' as 'weekly' | 'monthly' | 'yearly',
    status: 'recorded' as 'planned' | 'recorded',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    const result = expenseSchema.safeParse({
      ...formData,
      amount: Number(formData.amount),
      frequency: formData.is_recurring ? formData.frequency : null,
    })

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string
        newErrors[path] = issue.message
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    const newExpense: Expense = {
      id: `exp_${Date.now()}`,
      tenant_id: 'tenant_001',
      branch_id: null,
      category: formData.category,
      amount: Number(formData.amount),
      description: formData.description.trim() || null,
      receipt_url: null,
      expense_date: formData.expense_date,
      is_recurring: formData.is_recurring,
      frequency: formData.is_recurring ? formData.frequency : null,
      status: formData.status,
      recorded_by: 'usr_001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }

    createExpenseMutation.mutate(newExpense, {
      onSuccess: () => {
        setIsSubmitting(false)
        onClose()
      },
      onError: () => {
        setIsSubmitting(false)
      },
    })
  }

  return (
    <>
      <div className="modal-overlay" style={{ zIndex: 1050 }} onClick={onClose} />
      <div className="modal" style={{ zIndex: 1060, maxWidth: '460px', width: '90%' }}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpFromLine size={18} style={{ color: 'var(--danger-500)' }} />
            Record Business Expense
          </h3>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Category */}
            <div className="form-group">
              <label className="form-label form-label-required">Expense Category</label>
              <select
                className={`form-input form-select ${errors.category ? 'form-input-error' : ''}`}
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as ExpenseCategory }))}
              >
                {expenseCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </option>
                ))}
              </select>
              {errors.category && <span className="form-error">{errors.category}</span>}
            </div>

            {/* Amount */}
            <div className="form-group">
              <label className="form-label form-label-required">Expense Amount (₹)</label>
              <input
                className={`form-input ${errors.amount ? 'form-input-error' : ''}`}
                type="number"
                value={formData.amount || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, amount: Number(e.target.value) }))}
                placeholder="e.g. 15000"
              />
              {errors.amount && <span className="form-error">{errors.amount}</span>}
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label form-label-required">Expense Date</label>
              <input
                className={`form-input ${errors.expense_date ? 'form-input-error' : ''}`}
                type="date"
                value={formData.expense_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, expense_date: e.target.value }))}
              />
              {errors.expense_date && <span className="form-error">{errors.expense_date}</span>}
            </div>

            {/* Status (Planned vs Recorded) */}
            <div className="form-group">
              <label className="form-label">Expense Status</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === 'recorded'}
                    onChange={() => setFormData((prev) => ({ ...prev, status: 'recorded' }))}
                  />
                  Paid & Recorded
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === 'planned'}
                    onChange={() => setFormData((prev) => ({ ...prev, status: 'planned' }))}
                  />
                  Planned / Budgeted
                </label>
              </div>
            </div>

            {/* Is Recurring */}
            <div style={{ borderTop: '1px solid var(--border-secondary)', paddingTop: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8125rem' }}>
                <input
                  type="checkbox"
                  checked={formData.is_recurring}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_recurring: e.target.checked }))}
                />
                Is this a recurring monthly/weekly business expense?
              </label>

              {formData.is_recurring && (
                <div className="form-group" style={{ marginTop: '0.75rem', paddingLeft: '1.25rem' }}>
                  <label className="form-label">Billing Frequency</label>
                  <select
                    className="form-input form-select"
                    value={formData.frequency}
                    onChange={(e) => setFormData((prev) => ({ ...prev, frequency: e.target.value as any }))}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}
            </div>

            {/* Notes / Description */}
            <div className="form-group">
              <label className="form-label">Notes / Description</label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="e.g. Paid to trainer Vikram for personal training sessions"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                style={{ resize: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem' }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
