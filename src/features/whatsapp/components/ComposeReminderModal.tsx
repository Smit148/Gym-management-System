import { useState } from 'react'
import { FocusTrap } from 'focus-trap-react'
import { X, Loader2, Send } from 'lucide-react'
import { useSendReminder, useWhatsAppTemplates } from '../hooks/useWhatsApp'
import type { WhatsAppReminder, ReminderType } from '@/types'

interface ComposeReminderModalProps {
  onClose: () => void
}

export function ComposeReminderModal({ onClose }: ComposeReminderModalProps) {
  const { data: templates = [] } = useWhatsAppTemplates()
  const sendMutation = useSendReminder()

  const activeTemplates = templates.filter(t => t.is_active)

  const [selectedTemplateId, setSelectedTemplateId] = useState(activeTemplates[0]?.id || '')
  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId)

  const getResolvedMessage = () => {
    if (!selectedTemplate) return customMessage
    return selectedTemplate.message
      .replace(/\{\{name\}\}/g, recipientName || '{{name}}')
      .replace(/\{\{gym_name\}\}/g, 'Iron Temple Gym')
      .replace(/\{\{date\}\}/g, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }))
      .replace(/\{\{amount\}\}/g, '5,000')
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!recipientName.trim()) errs.recipientName = 'Recipient name is required'
    if (!recipientPhone.trim()) {
      errs.recipientPhone = 'Phone number is required'
    } else {
      const digits = recipientPhone.replace(/\D/g, '')
      if (digits.length < 10) {
        errs.recipientPhone = 'Phone number must be at least 10 digits'
      }
    }
    if (!selectedTemplateId && !customMessage.trim()) errs.message = 'Select a template or write a message'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const reminderMessage = getResolvedMessage()

    const reminder: WhatsAppReminder = {
      id: `wa_${Date.now()}`,
      tenant_id: 'tenant_001',
      template_id: selectedTemplateId || 'custom',
      template_name: selectedTemplate?.name || 'Custom Message',
      recipient_name: recipientName.trim(),
      recipient_phone: recipientPhone.trim(),
      message: reminderMessage,
      type: (selectedTemplate?.type || 'custom') as ReminderType,
      status: 'sent',
      scheduled_at: new Date().toISOString(),
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }

    sendMutation.mutate(reminder, {
      onSuccess: () => {
        const phoneDigits = recipientPhone.replace(/\D/g, '')
        const phoneWithCountry = phoneDigits.startsWith('91') && phoneDigits.length > 10 ? phoneDigits : `91${phoneDigits.slice(-10)}`
        const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(reminderMessage)}`
        window.open(url, '_blank')
        onClose()
      }
    })
  }

  return (
    <>
      <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1050 }} onClick={onClose} />
      <FocusTrap focusTrapOptions={{
        onDeactivate: onClose,
        initialFocus: '#reminder-template',
        fallbackFocus: '.modal',
        clickOutsideDeactivates: true
      }}>
      <div 
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="compose-reminder-title"
        style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(520px, 92vw)', maxHeight: '90vh', overflow: 'auto',
        background: 'white', borderRadius: 'var(--radius-xl)', zIndex: 1000,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        animation: 'slideUp 0.3s ease',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-primary)',
        }}>
          <div>
            <h2 id="compose-reminder-title" style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.125rem' }} aria-hidden="true">💬</span> Compose WhatsApp Reminder
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
              Send a reminder message via WhatsApp
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Free Info Alert */}
          <div style={{
            padding: '0.75rem 1rem',
            background: 'var(--primary-50)',
            border: '1px solid var(--primary-100)',
            color: 'var(--primary-700)',
            borderRadius: 'var(--radius-lg)',
            fontSize: '0.75rem',
            lineHeight: 1.4,
          }}>
            💡 <strong>100% Free:</strong> This opens WhatsApp with your pre-filled message. No WhatsApp API costs or setup charges apply!
          </div>

          {/* Template Selector */}
          <div className="form-group">
            <label htmlFor="reminder-template" className="form-label">Message Template</label>
            <select
              id="reminder-template"
              className="form-input form-select"
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
            >
              {activeTemplates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
              <option value="">✏️ Custom Message</option>
            </select>
          </div>

          {/* Recipient */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label form-label-required">Recipient Name</label>
              <input
                className="form-input"
                placeholder="e.g. Rahul Sharma"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
              {errors.recipientName && <span style={{ fontSize: '0.6875rem', color: 'var(--danger-600)' }}>{errors.recipientName}</span>}
            </div>
            <div className="form-group">
              <label className="form-label form-label-required">WhatsApp Number</label>
              <input
                className="form-input"
                placeholder="+91 98765 43210"
                value={recipientPhone}
                maxLength={13}
                onChange={(e) => setRecipientPhone(e.target.value)}
              />
              {errors.recipientPhone && <span style={{ fontSize: '0.6875rem', color: 'var(--danger-600)' }}>{errors.recipientPhone}</span>}
            </div>
          </div>

          {/* Custom message when no template */}
          {!selectedTemplateId && (
            <div className="form-group">
              <label className="form-label form-label-required">Custom Message</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Write your WhatsApp message here..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                style={{ resize: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem' }}
              />
              {errors.message && <span style={{ fontSize: '0.6875rem', color: 'var(--danger-600)' }}>{errors.message}</span>}
            </div>
          )}

          {/* Preview */}
          <div style={{
            background: '#DCF8C6',
            border: '1px solid #C5E1A5',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
          }}>
            <div style={{ fontSize: '0.6875rem', color: '#558B2F', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Message Preview
            </div>
            <div style={{
              fontSize: '0.8125rem', color: '#1B5E20',
              lineHeight: 1.5, whiteSpace: 'pre-wrap',
            }}>
              {getResolvedMessage() || 'Select a template or write a custom message...'}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={sendMutation.isPending}
              style={{ background: '#25D366', borderColor: '#25D366', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {sendMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
              Send via WhatsApp
            </button>
          </div>
        </form>
      </div>
      </FocusTrap>
    </>
  )
}
