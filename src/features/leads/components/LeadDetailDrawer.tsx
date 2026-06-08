import { useState, useEffect } from 'react'
import {
  X,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  Clock,
  User,
  Check,
  Zap,
} from 'lucide-react'
import { formatDate, formatPhone } from '@/lib/utils'
import { useFollowups, useTrials, useUpdateLead } from '../hooks/useLeads'
import { FollowUpModal } from './FollowUpModal'
import { TrialModal } from './TrialModal'
import type { Lead, LeadStatus, LeadSource, FollowupMethod, FollowupOutcome } from '@/types'

interface LeadDetailDrawerProps {
  lead: Lead
  onClose: () => void
  onConvert?: (lead: Lead) => void
}

const sourceLabels: Record<LeadSource, string> = {
  walk_in: 'Walk-in', instagram: 'Instagram', google: 'Google',
  facebook: 'Facebook', referral: 'Referral', whatsapp: 'WhatsApp',
  website: 'Website', other: 'Other',
}

const statusLabels: Record<LeadStatus, string> = {
  new: 'New', contacted: 'Contacted', follow_up: 'Follow Up',
  trial: 'Trial', converted: 'Converted', lost: 'Lost',
}

const statusBadgeClass: Record<LeadStatus, string> = {
  new: 'badge-new', contacted: 'badge-contacted', follow_up: 'badge-pending',
  trial: 'badge-trial', converted: 'badge-converted', lost: 'badge-lost',
}

const methodIcons: Record<FollowupMethod, React.ReactNode> = {
  call: <Phone size={14} />,
  whatsapp: <MessageCircle size={14} />,
  sms: <MessageCircle size={14} />,
  visit: <User size={14} />,
  email: <Mail size={14} />,
}

const outcomeLabels: Record<FollowupOutcome, string> = {
  interested: 'Interested',
  thinking: 'Thinking',
  not_interested: 'Not Interested',
  no_response: 'No Response',
  trial_scheduled: 'Trial Scheduled',
}

const outcomeColors: Record<FollowupOutcome, string> = {
  interested: 'var(--success-600)',
  thinking: 'var(--warning-600)',
  not_interested: 'var(--danger-600)',
  no_response: 'var(--gray-500)',
  trial_scheduled: 'var(--primary-600)',
}

export function LeadDetailDrawer({ lead, onClose, onConvert }: LeadDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'followups' | 'notes'>('info')
  const [showFollowupModal, setShowFollowupModal] = useState(false)
  const [showTrialModal, setShowTrialModal] = useState(false)

  // Notes editing state
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notesText, setNotesText] = useState(lead.notes || '')
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const updateLeadMutation = useUpdateLead()

  // Sync notes text when lead changes
  useEffect(() => {
    setNotesText(lead.notes || '')
    setIsEditingNotes(false)
  }, [lead.id, lead.notes])

  const handleSaveNotes = () => {
    setIsSavingNotes(true)
    updateLeadMutation.mutate(
      {
        ...lead,
        notes: notesText.trim() || null,
        updated_at: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setIsSavingNotes(false)
          setIsEditingNotes(false)
        },
        onError: () => {
          setIsSavingNotes(false)
        },
      }
    )
  }

  const handleCancelNotes = () => {
    setNotesText(lead.notes || '')
    setIsEditingNotes(false)
  }

  // Fetch followups & trials dynamically via hooks
  const { data: allFollowups = [] } = useFollowups()
  const { data: allTrials = [] } = useTrials()

  const followups = allFollowups.filter((f) => f.lead_id === lead.id)
  const trial = allTrials.find((t) => t.lead_id === lead.id && t.status === 'active')

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        {/* Header */}
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">{lead.first_name} {lead.last_name || ''}</h2>
            <div className="flex items-center gap-2" style={{ marginTop: '0.25rem' }}>
              <span className={`badge ${statusBadgeClass[lead.status]}`}>
                {statusLabels[lead.status]}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Added {formatDate(lead.created_at, 'relative')}
              </span>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)' }}>
          {(['info', 'followups', 'notes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '0.75rem',
                fontSize: '0.8125rem',
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? 'var(--primary-600)' : 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--primary-600)' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'followups' ? `Follow-ups (${followups.length})` : tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="drawer-body">
          {activeTab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Contact Info */}
              <div>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.75rem' }}>
                  Contact Information
                </h3>
                <div className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="flex items-center gap-3">
                      <Phone size={16} style={{ color: 'var(--text-tertiary)' }} />
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{formatPhone(lead.phone)}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Phone</div>
                      </div>
                      <a
                        href={`https://wa.me/${lead.phone.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm btn-icon"
                        style={{ marginLeft: 'auto', color: 'var(--success-600)' }}
                        title="Open WhatsApp"
                      >
                        <MessageCircle size={16} />
                      </a>
                    </div>
                    {lead.email && (
                      <div className="flex items-center gap-3">
                        <Mail size={16} style={{ color: 'var(--text-tertiary)' }} />
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{lead.email}</div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Email</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Lead Details */}
              <div>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.75rem' }}>
                  Lead Details
                </h3>
                <div className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Source</div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{sourceLabels[lead.source]}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Gender</div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 500, textTransform: 'capitalize' }}>{lead.gender || '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Age Range</div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{lead.age_range || '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Interest</div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{lead.interest || '—'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Trial Info */}
              {lead.status === 'trial' && trial && (
                <div>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.75rem' }}>
                    Active Trial Membership
                  </h3>
                  <div className="card" style={{ padding: '1rem', borderLeft: '3px solid var(--warning-500)', background: 'var(--warning-50)' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--warning-800)' }}>
                      {trial.trial_days}-Day Trial Active
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--warning-700)', marginTop: '0.25rem' }}>
                      Valid: {formatDate(trial.start_date)} to {formatDate(trial.end_date)}
                    </div>
                  </div>
                </div>
              )}

              {/* Next Follow-up */}
              {lead.next_followup_at && lead.status !== 'converted' && lead.status !== 'lost' && (
                <div>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.75rem' }}>
                    Next Follow-up
                  </h3>
                  <div className="card" style={{
                    padding: '1rem',
                    borderLeft: `3px solid ${new Date(lead.next_followup_at) < new Date() ? 'var(--danger-500)' : 'var(--primary-500)'}`,
                  }}>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} style={{ color: new Date(lead.next_followup_at) < new Date() ? 'var(--danger-600)' : 'var(--primary-600)' }} />
                      <span style={{ fontWeight: 500, fontSize: '0.8125rem' }}>
                        {formatDate(lead.next_followup_at, 'long')}
                      </span>
                      {new Date(lead.next_followup_at) < new Date() && (
                        <span className="badge badge-expired">Overdue</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {lead.status !== 'converted' && lead.status !== 'lost' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setShowFollowupModal(true)}>
                      <Phone size={16} />
                      Log Follow-up
                    </button>
                    {lead.status !== 'trial' && (
                      <button className="btn btn-warning" style={{ flex: 1 }} onClick={() => setShowTrialModal(true)}>
                        <Zap size={16} />
                        Start Trial
                      </button>
                    )}
                  </div>
                  <button className="btn btn-success w-full" onClick={() => onConvert?.(lead)}>
                    <Check size={16} />
                    Convert to Member
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'followups' && (
            <div>
              {/* Add Follow-up Button */}
              {lead.status !== 'converted' && lead.status !== 'lost' && (
                <button
                  className="btn btn-primary w-full"
                  style={{ marginBottom: '1rem' }}
                  onClick={() => setShowFollowupModal(true)}
                >
                  <Phone size={16} />
                  Log New Follow-up
                </button>
              )}

              {/* Follow-up Timeline */}
              {followups.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <Clock className="empty-state-icon" style={{ width: '48px', height: '48px' }} />
                  <div className="empty-state-title">No follow-ups yet</div>
                  <div className="empty-state-message">
                    Log your first follow-up to track the conversation history.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {followups.map((fu, index) => (
                    <div
                      key={fu.id}
                      style={{
                        display: 'flex',
                        gap: '0.75rem',
                        paddingBottom: '1.25rem',
                        position: 'relative',
                      }}
                    >
                      {/* Timeline line */}
                      {index < followups.length - 1 && (
                        <div style={{
                          position: 'absolute',
                          left: '15px',
                          top: '32px',
                          bottom: '0',
                          width: '2px',
                          background: 'var(--border-primary)',
                        }} />
                      )}

                      {/* Timeline dot */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--primary-50)',
                        color: 'var(--primary-600)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        zIndex: 1,
                      }}>
                        {methodIcons[fu.contact_method]}
                      </div>

                      {/* Content */}
                      <div className="card" style={{ flex: 1, padding: '0.875rem' }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: '0.375rem' }}>
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'capitalize' }}>
                              {fu.contact_method}
                            </span>
                            <span style={{
                              fontSize: '0.6875rem',
                              fontWeight: 500,
                              color: outcomeColors[fu.outcome],
                            }}>
                              • {outcomeLabels[fu.outcome]}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                            {formatDate(fu.created_at, 'relative')}
                          </span>
                        </div>
                        {fu.notes && (
                          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {fu.notes}
                          </p>
                        )}
                        {fu.contacted_by_name && (
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: '0.375rem' }}>
                            by {fu.contacted_by_name}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Edit / Add Notes Toggle Button */}
              {!isEditingNotes && (
                <button
                  className="btn btn-primary w-full"
                  onClick={() => setIsEditingNotes(true)}
                >
                  {lead.notes ? '✏️ Edit Notes' : '➕ Add Notes'}
                </button>
              )}

              {/* Editing Mode */}
              {isEditingNotes ? (
                <div className="card" style={{ padding: '1rem' }}>
                  <textarea
                    className="form-input"
                    rows={6}
                    placeholder="Write notes about this lead... e.g. Interested in weight loss program, prefers morning batch, budget ₹3000-5000/month"
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    style={{ resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', lineHeight: 1.6 }}
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={handleCancelNotes}
                      disabled={isSavingNotes}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleSaveNotes}
                      disabled={isSavingNotes}
                    >
                      {isSavingNotes ? 'Saving...' : 'Save Notes'}
                    </button>
                  </div>
                </div>
              ) : lead.notes ? (
                <div className="card" style={{ padding: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                    {lead.notes}
                  </p>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: '0.75rem' }}>
                    Last updated {formatDate(lead.updated_at, 'relative')}
                  </div>
                </div>
              ) : (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <div className="empty-state-title">No notes yet</div>
                  <div className="empty-state-message">
                    Click the button above to add notes about this lead.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sub Modals */}
      {showFollowupModal && (
        <FollowUpModal
          lead={lead}
          onClose={() => setShowFollowupModal(false)}
        />
      )}

      {showTrialModal && (
        <TrialModal
          lead={lead}
          onClose={() => setShowTrialModal(false)}
        />
      )}
    </>
  )
}
