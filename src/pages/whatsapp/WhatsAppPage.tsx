import { useState, useMemo } from 'react'
import {
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Phone,
  FileText,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useWhatsAppReminders, useWhatsAppTemplates, useUpdateTemplate } from '@/features/whatsapp/hooks/useWhatsApp'
import { ComposeReminderModal } from '@/features/whatsapp/components/ComposeReminderModal'
import { DataTable } from '@/organisms/DataTable/DataTable'
import type { ColumnDef } from '@/organisms/DataTable/types'
import type { WhatsAppReminder, WhatsAppTemplate, ReminderType, ReminderStatus } from '@/types'

const typeLabels: Record<ReminderType, string> = {
  membership_expiry: 'Expiry Reminder',
  payment_due: 'Payment Due',
  birthday: 'Birthday Wish',
  attendance_nudge: 'Attendance Nudge',
  custom: 'Custom',
}

const typeColors: Record<ReminderType, string> = {
  membership_expiry: 'var(--warning-600)',
  payment_due: 'var(--danger-600)',
  birthday: '#EC4899',
  attendance_nudge: 'var(--primary-600)',
  custom: 'var(--gray-500)',
}

const typeEmoji: Record<ReminderType, string> = {
  membership_expiry: '🏋️',
  payment_due: '💰',
  birthday: '🎂',
  attendance_nudge: '💪',
  custom: '✏️',
}

const statusConfig: Record<ReminderStatus, { icon: typeof CheckCircle2; color: string; label: string; className: string }> = {
  sent: { icon: CheckCircle2, color: 'var(--success-600)', label: 'Sent', className: 'badge-active' },
  scheduled: { icon: Clock, color: 'var(--primary-600)', label: 'Scheduled', className: 'badge-trial' },
  failed: { icon: AlertTriangle, color: 'var(--danger-600)', label: 'Failed', className: 'badge-expired' },
  cancelled: { icon: XCircle, color: 'var(--gray-500)', label: 'Cancelled', className: 'badge-pending' },
}

export function WhatsAppPage() {
  const { data: reminders = [], isLoading: loadingReminders } = useWhatsAppReminders()
  const { data: templates = [], isLoading: loadingTemplates } = useWhatsAppTemplates()
  const updateTemplateMutation = useUpdateTemplate()

  const [activeTab, setActiveTab] = useState<'log' | 'templates'>('log')
  const [showComposeModal, setShowComposeModal] = useState(false)

  // KPI stats
  const stats = useMemo(() => {
    const totalSent = reminders.filter(r => r.status === 'sent').length
    const scheduled = reminders.filter(r => r.status === 'scheduled').length
    const failed = reminders.filter(r => r.status === 'failed').length
    return { totalSent, scheduled, failed }
  }, [reminders])

  // Toggle template active/inactive
  const handleToggleTemplate = (template: WhatsAppTemplate) => {
    updateTemplateMutation.mutate({
      ...template,
      is_active: !template.is_active,
    })
  }

  // Reminder columns
  const reminderColumns: ColumnDef<WhatsAppReminder>[] = [
    {
      key: 'recipient_name',
      header: 'Recipient',
      sortable: true,
      render: (r) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
            {r.recipient_name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            <Phone size={10} />
            {r.recipient_phone}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{ fontSize: '0.875rem' }}>{typeEmoji[r.type]}</span>
          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: typeColors[r.type] }}>
            {typeLabels[r.type]}
          </span>
        </div>
      ),
    },
    {
      key: 'message',
      header: 'Message',
      render: (r) => (
        <span
          style={{
            fontSize: '0.8125rem', color: 'var(--text-secondary)',
            display: 'block', maxWidth: '250px',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}
          title={r.message}
        >
          {r.message}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => {
        const cfg = statusConfig[r.status]
        return <span className={`badge ${cfg.className}`}>{cfg.label}</span>
      },
    },
    {
      key: 'scheduled_at',
      header: 'Date',
      sortable: true,
      render: (r) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          {formatDate(r.sent_at || r.scheduled_at, 'relative')}
        </span>
      ),
    },
  ]

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💬</span> WhatsApp Reminders
          </h1>
          <p className="page-subtitle">Send automated reminders to members via WhatsApp</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowComposeModal(true)}
          style={{ background: '#25D366', borderColor: '#25D366' }}
        >
          <Send size={16} />
          Compose Reminder
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid-stats" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#E8F5E9', color: '#25D366' }}>
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-card-value">{stats.totalSent}</div>
          <div className="stat-card-label">Total Sent</div>
          <div className="stat-card-sublabel">Messages delivered</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
            <Clock size={20} />
          </div>
          <div className="stat-card-value">{stats.scheduled}</div>
          <div className="stat-card-label">Scheduled</div>
          <div className="stat-card-sublabel">Queued for delivery</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--danger-50)', color: 'var(--danger-600)' }}>
            <AlertTriangle size={20} />
          </div>
          <div className="stat-card-value" style={{ color: stats.failed > 0 ? 'var(--danger-600)' : undefined }}>
            {stats.failed}
          </div>
          <div className="stat-card-label">Failed</div>
          <div className="stat-card-sublabel">{stats.failed > 0 ? 'Needs retry' : 'All clear'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#FDF4FF', color: '#9333EA' }}>
            <FileText size={20} />
          </div>
          <div className="stat-card-value">{templates.filter(t => t.is_active).length}</div>
          <div className="stat-card-label">Active Templates</div>
          <div className="stat-card-sublabel">of {templates.length} total</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)', marginBottom: '1rem' }}>
          {([
            { key: 'log' as const, label: '📋 Reminder Log', count: reminders.length },
            { key: 'templates' as const, label: '📄 Templates', count: templates.length },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '0.75rem 1.25rem', fontSize: '0.8125rem',
                fontWeight: activeTab === tab.key ? 600 : 400,
                color: activeTab === tab.key ? '#25D366' : 'var(--text-secondary)',
                background: 'none', border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid #25D366' : '2px solid transparent',
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}
            >
              {tab.label}
              <span style={{
                background: activeTab === tab.key ? '#E8F5E9' : 'var(--gray-100)',
                color: activeTab === tab.key ? '#25D366' : 'var(--text-tertiary)',
                fontSize: '0.6875rem', fontWeight: 600,
                padding: '0.125rem 0.5rem', borderRadius: 'var(--radius-full)',
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Reminder Log Tab */}
        {activeTab === 'log' && (
          <DataTable
            data={reminders}
            columns={reminderColumns}
            searchPlaceholder="Search by name, phone, or type..."
            searchField={(r: WhatsAppReminder, query: string) => {
              return r.recipient_name.toLowerCase().includes(query) ||
                r.recipient_phone.includes(query) ||
                typeLabels[r.type].toLowerCase().includes(query)
            }}
            isLoading={loadingReminders}
            emptyState={{
              title: 'No reminders sent yet',
              message: 'Compose your first WhatsApp reminder to get started.',
            }}
          />
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          loadingTemplates ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1rem' }}>
              {templates.map(template => (
                <div
                  key={template.id}
                  style={{
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    background: template.is_active ? 'white' : 'var(--gray-50)',
                    opacity: template.is_active ? 1 : 0.7,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Template header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '1rem' }}>{typeEmoji[template.type]}</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {template.name}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.6875rem', color: typeColors[template.type],
                        fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.03em',
                      }}>
                        {typeLabels[template.type]}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleTemplate(template)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: template.is_active ? '#25D366' : 'var(--gray-400)',
                        padding: '0.125rem',
                      }}
                      title={template.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {template.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </div>

                  {/* Message preview */}
                  <div style={{
                    background: '#DCF8C6',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    fontSize: '0.75rem',
                    color: '#1B5E20',
                    lineHeight: 1.6,
                    maxHeight: '100px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    {template.message}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      height: '30px',
                      background: 'linear-gradient(transparent, #DCF8C6)',
                    }} />
                  </div>

                  {/* Footer */}
                  <div style={{
                    marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', fontSize: '0.6875rem', color: 'var(--text-tertiary)',
                  }}>
                    <span>Created {formatDate(template.created_at, 'relative')}</span>
                    <span className={`badge ${template.is_active ? 'badge-active' : 'badge-pending'}`}
                      style={{ fontSize: '0.625rem' }}
                    >
                      {template.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <ComposeReminderModal onClose={() => setShowComposeModal(false)} />
      )}
    </div>
  )
}
