import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { toast } from '@/components/Toast'
import { sanitizeInput, sanitizePhone } from '@/lib/sanitize'
import { useCreateStaff, useUpdateStaff } from '../hooks/useStaff'
import type { Staff, StaffRole } from '@/types'

interface AddStaffDrawerProps {
  onClose: () => void
  editStaff?: Staff | null
}

const roleOptions: { value: StaffRole; label: string }[] = [
  { value: 'trainer', label: 'Trainer' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'cleaning', label: 'Cleaning Staff' },
  { value: 'manager', label: 'Manager' },
  { value: 'other', label: 'Other' },
]

const shiftOptions = [
  { value: 'morning', label: 'Morning (6AM–2PM)' },
  { value: 'evening', label: 'Evening (2PM–10PM)' },
  { value: 'full_day', label: 'Full Day (9AM–6PM)' },
  { value: 'flexible', label: 'Flexible' },
  { value: 'custom', label: 'Custom Time Range' },
] as const

export function AddStaffDrawer({ onClose, editStaff }: AddStaffDrawerProps) {
  const createMutation = useCreateStaff()
  const updateMutation = useUpdateStaff()
  const isEdit = !!editStaff

  const [formData, setFormData] = useState({
    first_name: editStaff?.first_name || '',
    last_name: editStaff?.last_name || '',
    phone: editStaff?.phone || '',
    email: editStaff?.email || '',
    role: editStaff?.role || 'trainer' as StaffRole,
    shift: editStaff?.shift || 'morning' as Staff['shift'],
    shift_start: (editStaff as any)?.shift_start || '13:00',
    shift_end: (editStaff as any)?.shift_end || '17:00',
    salary_amount: editStaff?.salary_amount || 15000,
    emergency_contact: editStaff?.emergency_contact || '',
    notes: editStaff?.notes || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.first_name.trim()) errs.first_name = 'First name is required'
    if (!formData.last_name.trim()) errs.last_name = 'Last name is required'
    if (!formData.phone.trim()) errs.phone = 'Phone number is required'
    else if (formData.phone.replace(/\D/g, '').length < 10) errs.phone = 'Phone must be at least 10 digits'
    if (formData.salary_amount <= 0) errs.salary_amount = 'Salary must be greater than 0'
    if (formData.shift === 'custom') {
      if (!formData.shift_start) errs.shift_start = 'Start time is required'
      if (!formData.shift_end) errs.shift_end = 'End time is required'
      if (formData.shift_start && formData.shift_end && formData.shift_start >= formData.shift_end) {
        errs.shift_end = 'End time must be after start time'
      }
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const staffData: Staff = {
      id: editStaff?.id || `staff_${Date.now()}`,
      tenant_id: 'tenant_001',
      first_name: sanitizeInput(formData.first_name),
      last_name: sanitizeInput(formData.last_name),
      phone: sanitizePhone(formData.phone),
      email: formData.email.trim() || null,
      role: formData.role,
      status: editStaff?.status || 'active',
      joined_at: editStaff?.joined_at || new Date().toISOString(),
      salary_amount: formData.salary_amount,
      salary_frequency: 'monthly',
      shift: formData.shift,
      photo_url: null,
      emergency_contact: formData.emergency_contact ? sanitizePhone(formData.emergency_contact) : null,
      notes: formData.notes ? sanitizeInput(formData.notes) : null,
      created_at: editStaff?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }

    if (isEdit) {
      updateMutation.mutate(staffData, { onSuccess: () => { toast.success(`Staff "${formData.first_name}" updated successfully!`); onClose() } })
    } else {
      createMutation.mutate(staffData, { onSuccess: () => { toast.success(`Staff "${formData.first_name}" added successfully!`); onClose() } })
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <>
      {/* Backdrop */}
      <div
        className="drawer-backdrop visible"
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          zIndex: 999, animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Drawer */}
      <div
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-staff-title"
        onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(480px, 100vw)', background: 'white',
          zIndex: 1000, display: 'flex', flexDirection: 'column',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
          animation: 'slideInRight 0.3s ease',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-primary)',
        }}>
          <div>
            <h2 id="add-staff-title" style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {isEdit ? 'Edit Staff Member' : 'Add Staff Member'}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
              {isEdit ? 'Update staff details below.' : 'Fill in the details to onboard a new staff member.'}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', padding: '0.25rem',
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
        >
          <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Name fields */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label form-label-required">First Name</label>
              <input
                className="form-input"
                placeholder="e.g. Vikram"
                value={formData.first_name}
                onChange={(e) => setFormData(p => ({ ...p, first_name: e.target.value }))}
              />
              {errors.first_name && <span style={{ fontSize: '0.6875rem', color: 'var(--danger-600)' }}>{errors.first_name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label form-label-required">Last Name</label>
              <input
                className="form-input"
                placeholder="e.g. Singh"
                value={formData.last_name}
                onChange={(e) => setFormData(p => ({ ...p, last_name: e.target.value }))}
              />
              {errors.last_name && <span style={{ fontSize: '0.6875rem', color: 'var(--danger-600)' }}>{errors.last_name}</span>}
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label form-label-required">Phone</label>
              <input
                className="form-input"
                placeholder="+91 98765 43210"
                value={formData.phone}
                maxLength={13}
                onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
              />
              {errors.phone && <span style={{ fontSize: '0.6875rem', color: 'var(--danger-600)' }}>{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="email@gym.com"
                value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
              />
            </div>
          </div>

          {/* Role & Shift */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label form-label-required">Role</label>
              <select
                className="form-input form-select"
                value={formData.role}
                onChange={(e) => setFormData(p => ({ ...p, role: e.target.value as StaffRole }))}
              >
                {roleOptions.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Shift</label>
              <select
                className="form-input form-select"
                value={formData.shift}
                onChange={(e) => setFormData(p => ({ ...p, shift: e.target.value as Staff['shift'] }))}
              >
                {shiftOptions.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom shift time pickers */}
          {formData.shift === 'custom' && (
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label form-label-required">Shift Start Time</label>
                <input
                  className={`form-input ${errors.shift_start ? 'form-input-error' : ''}`}
                  type="time"
                  value={formData.shift_start}
                  onChange={(e) => setFormData(p => ({ ...p, shift_start: e.target.value }))}
                />
                {errors.shift_start && <span style={{ fontSize: '0.6875rem', color: 'var(--danger-600)' }}>{errors.shift_start}</span>}
              </div>
              <div className="form-group">
                <label className="form-label form-label-required">Shift End Time</label>
                <input
                  className={`form-input ${errors.shift_end ? 'form-input-error' : ''}`}
                  type="time"
                  value={formData.shift_end}
                  onChange={(e) => setFormData(p => ({ ...p, shift_end: e.target.value }))}
                />
                {errors.shift_end && <span style={{ fontSize: '0.6875rem', color: 'var(--danger-600)' }}>{errors.shift_end}</span>}
              </div>
            </div>
          )}

          {/* Salary */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label form-label-required">Monthly Salary (₹)</label>
              <input
                className="form-input"
                type="number"
                min={0}
                value={formData.salary_amount}
                onChange={(e) => setFormData(p => ({ ...p, salary_amount: Number(e.target.value) }))}
              />
              {errors.salary_amount && <span style={{ fontSize: '0.6875rem', color: 'var(--danger-600)' }}>{errors.salary_amount}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Emergency Contact</label>
              <input
                className="form-input"
                placeholder="+91 ..."
                value={formData.emergency_contact}
                maxLength={13}
                onChange={(e) => setFormData(p => ({ ...p, emergency_contact: e.target.value }))}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Certifications, specializations, etc."
              value={formData.notes}
              onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
              style={{ resize: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem' }}
            />
          </div>

          </div>

          {/* Action buttons */}
          <div className="drawer-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
              {isEdit ? 'Save Changes' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
