import { useState } from 'react'
import { X, Calendar } from 'lucide-react'
import { useScheduleTrial } from '../hooks/useLeads'
import { trialSchema } from '../schemas/lead.schema'
import type { Lead, TrialMember } from '@/types'

interface TrialModalProps {
  lead: Lead
  onClose: () => void
}

export function TrialModal({ lead, onClose }: TrialModalProps) {
  const scheduleTrialMutation = useScheduleTrial()
  const [formData, setFormData] = useState({
    start_date: new Date().toISOString().split('T')[0],
    trial_days: 3,
    feedback: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    const result = trialSchema.safeParse(formData)
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
    const startDate = new Date(formData.start_date)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + formData.trial_days)

    const newTrial: TrialMember = {
      id: `trial_${Date.now()}`,
      lead_id: lead.id,
      start_date: formData.start_date,
      end_date: endDate.toISOString().split('T')[0],
      trial_days: formData.trial_days,
      status: 'active',
      attendance_count: 0,
      feedback: formData.feedback.trim() || null,
    }

    scheduleTrialMutation.mutate(newTrial, {
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
      <div className="modal" style={{ zIndex: 1060, maxWidth: '400px', width: '90%' }}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} style={{ color: 'var(--warning-500)' }} />
            Schedule Trial Session
          </h3>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Start Date */}
            <div className="form-group">
              <label className="form-label form-label-required">Trial Start Date</label>
              <input
                className={`form-input ${errors.start_date ? 'form-input-error' : ''}`}
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              />
              {errors.start_date && <span className="form-error">{errors.start_date}</span>}
            </div>

            {/* Duration */}
            <div className="form-group">
              <label className="form-label form-label-required">Duration</label>
              <select
                className="form-input form-select"
                value={formData.trial_days}
                onChange={(e) => setFormData(prev => ({ ...prev, trial_days: Number(e.target.value) }))}
              >
                <option value={3}>3 Days Free Trial</option>
                <option value={5}>5 Days Free Trial</option>
                <option value={7}>7 Days Premium Trial</option>
              </select>
            </div>

            {/* Notes / Goals */}
            <div className="form-group">
              <label className="form-label">Trial Target Goals / Notes</label>
              <textarea
                className="form-input"
                placeholder="e.g. Weight loss review, wants to try strength machines..."
                value={formData.feedback}
                onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Start Trial'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
