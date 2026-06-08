import { useState } from 'react'
import { X, MessageCircle, Phone, Mail, User } from 'lucide-react'
import { useLogFollowup } from '../hooks/useLeads'
import { followupSchema } from '../schemas/lead.schema'
import type { Lead, LeadFollowup, FollowupMethod, FollowupOutcome } from '@/types'

interface FollowUpModalProps {
  lead: Lead
  onClose: () => void
}

const methods: { value: FollowupMethod; label: string; icon: React.ReactNode }[] = [
  { value: 'call', label: 'Call', icon: <Phone size={14} /> },
  { value: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={14} /> },
  { value: 'sms', label: 'SMS', icon: <MessageCircle size={14} /> },
  { value: 'visit', label: 'In-person Visit', icon: <User size={14} /> },
  { value: 'email', label: 'Email', icon: <Mail size={14} /> },
]

const outcomes: { value: FollowupOutcome; label: string }[] = [
  { value: 'interested', label: 'Interested' },
  { value: 'thinking', label: 'Still Thinking / Undecided' },
  { value: 'trial_scheduled', label: 'Trial Scheduled' },
  { value: 'no_response', label: 'No Response' },
  { value: 'not_interested', label: 'Not Interested / Lost' },
]

export function FollowUpModal({ lead, onClose }: FollowUpModalProps) {
  const logFollowupMutation = useLogFollowup()
  const [formData, setFormData] = useState({
    contact_method: 'call' as FollowupMethod,
    outcome: 'interested' as FollowupOutcome,
    notes: '',
    next_followup_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    const result = followupSchema.safeParse(formData)
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
    const newFollowup: LeadFollowup = {
      id: `fu_${Date.now()}`,
      lead_id: lead.id,
      contacted_by: 'usr_001',
      contacted_by_name: 'Rajesh Kumar',
      contact_method: formData.contact_method,
      outcome: formData.outcome,
      notes: formData.notes.trim() || null,
      next_followup_at: formData.outcome === 'not_interested' ? null : new Date(formData.next_followup_at).toISOString(),
      created_at: new Date().toISOString(),
    }

    logFollowupMutation.mutate(newFollowup, {
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
            <Phone size={18} style={{ color: 'var(--primary-500)' }} />
            Log Follow-up
          </h3>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Contact Method */}
            <div className="form-group">
              <label className="form-label form-label-required">Contact Method</label>
              <select
                className="form-input form-select"
                value={formData.contact_method}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_method: e.target.value as FollowupMethod }))}
              >
                {methods.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            {/* Outcome */}
            <div className="form-group">
              <label className="form-label form-label-required">Outcome</label>
              <select
                className="form-input form-select"
                value={formData.outcome}
                onChange={(e) => setFormData(prev => ({ ...prev, outcome: e.target.value as FollowupOutcome }))}
              >
                {outcomes.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Next Follow-up Date */}
            {formData.outcome !== 'not_interested' && (
              <div className="form-group">
                <label className="form-label form-label-required">Next Follow-up Date</label>
                <input
                  className={`form-input ${errors.next_followup_at ? 'form-input-error' : ''}`}
                  type="date"
                  value={formData.next_followup_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, next_followup_at: e.target.value }))}
                />
                {errors.next_followup_at && <span className="form-error">{errors.next_followup_at}</span>}
              </div>
            )}

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Outcome Notes / Remarks</label>
              <textarea
                className="form-input"
                placeholder="Details of what was discussed..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
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
              {isSubmitting ? 'Saving...' : 'Log Follow-up'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
