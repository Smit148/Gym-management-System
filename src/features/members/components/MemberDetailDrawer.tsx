import { useState } from 'react'
import {
  X,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  Clock,
  User,
  Activity,
  CreditCard,
  Gift,
  FileText,
  Snowflake,
  Play,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react'
import { formatDate, formatPhone, formatCurrency } from '@/lib/utils'
import { useMockDbStore } from '@/lib/mock-db'
import type { Member, Membership, Attendance, FreezeReason, PaymentMethod, MemberStatus } from '@/types'

interface MemberDetailDrawerProps {
  member: Member
  membership: Membership | null
  onClose: () => void
  onUpdateMember: (updatedMember: Member) => void
  onUpdateMembership: (updatedMembership: Membership) => void
  onAddMembership: (newMembership: Membership) => void
}

const statusLabels: Record<MemberStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  expired: 'Expired',
  frozen: 'Frozen',
}

const statusBadgeClass: Record<MemberStatus, string> = {
  active: 'badge-active',
  inactive: 'badge-lost',
  expired: 'badge-expired',
  frozen: 'badge-frozen',
}

const freezeReasonLabels: Record<FreezeReason, string> = {
  injury: 'Injury / Medical',
  exams: 'Student Exams',
  travel: 'Personal Travel',
  family_emergency: 'Family Emergency',
  other: 'Other Reason',
}

export function MemberDetailDrawer({
  member,
  membership,
  onClose,
  onUpdateMember,
  onUpdateMembership,
  onAddMembership,
}: MemberDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'membership' | 'attendance' | 'payments' | 'referrals' | 'notes' | 'timeline'>('profile')

  // Sub-modal states
  const [showFreezeModal, setShowFreezeModal] = useState(false)
  const [showUnfreezeModal, setShowUnfreezeModal] = useState(false)
  const [showRenewModal, setShowRenewModal] = useState(false)

  // Get stores data
  const plans = useMockDbStore((state) => state.plans)
  const allPayments = useMockDbStore((state) => state.payments)
  const allLeads = useMockDbStore((state) => state.leads)
  const allEvents = useMockDbStore((state) => state.activityEvents)

  // Freeze Form State
  const [freezeData, setFreezeData] = useState({
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reason: 'travel' as FreezeReason,
    notes: '',
  })
  const [freezeErrors, setFreezeErrors] = useState<Record<string, string>>({})

  // Renewal Form State
  const [renewData, setRenewData] = useState({
    selectedPlanId: plans[0]?.id || '',
    start_date: membership
      ? new Date(Math.max(new Date().getTime(), new Date(membership.end_date).getTime() + 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    actual_price: plans[0]?.price || 0,
    discount_amount: 0,
    discount_reason: '',
    amount_paid: plans[0]?.price || 0,
    payment_method: 'upi' as PaymentMethod,
  })
  const [renewErrors, setRenewErrors] = useState<Record<string, string>>({})

  // Dynamic lists from mock database
  const memberPayments = allPayments.filter((p) => p.member_id === member.id)

  const mockCheckIns: Attendance[] = [
    {
      id: 'att_001',
      member_id: member.id,
      check_in_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000).toISOString(),
      method: 'qr'
    },
    {
      id: 'att_002',
      member_id: member.id,
      check_in_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
      method: 'receptionist'
    },
    {
      id: 'att_003',
      member_id: member.id,
      check_in_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000).toISOString(),
      method: 'qr'
    }
  ]

  const memberReferrals = allLeads
    .filter((l) => l.referral_member_id === member.id)
    .map((l) => ({
      name: `${l.first_name} ${l.last_name}`,
      phone: l.phone,
      status: l.status,
      date: l.created_at.split('T')[0],
    }))

  const memberEvents = allEvents.filter(
    (e) => e.entity_id === member.id || e.description.includes(member.first_name)
  )

  // Calculations for Freeze Extension Preview
  const getFreezeDays = () => {
    if (!freezeData.start_date || !freezeData.end_date) return 0
    const start = new Date(freezeData.start_date)
    const end = new Date(freezeData.end_date)
    const diffTime = end.getTime() - start.getTime()
    if (diffTime < 0) return 0
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const freezeDays = getFreezeDays()

  // Maximum allowed freeze days calculation
  const getMaxAllowedFreezeDays = () => {
    if (!membership) return 0
    const plan = plans.find(p => p.id === membership.plan_id)
    return plan?.max_freeze_days || 0
  }

  const maxAllowed = getMaxAllowedFreezeDays()
  const remainingFreezeDays = Math.max(0, maxAllowed - (membership?.freeze_days_used || 0))

  // Validate Freeze Form
  const validateFreeze = () => {
    const errs: Record<string, string> = {}
    if (!freezeData.start_date) errs.start_date = 'Start date is required'
    if (!freezeData.end_date) errs.end_date = 'End date is required'
    if (new Date(freezeData.start_date) > new Date(freezeData.end_date)) {
      errs.end_date = 'End date cannot be before start date'
    }
    if (freezeDays > remainingFreezeDays) {
      errs.end_date = `Cannot exceed remaining freeze allowance of ${remainingFreezeDays} days`
    }
    setFreezeErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Calculate health
  const health = (() => {
    if (member.status === 'frozen') {
      return { label: 'Frozen', class: 'badge-frozen', icon: '❄️' }
    }
    if (member.status === 'expired') {
      return { label: 'At Risk', class: 'badge-expired', icon: '🔴' }
    }
    if (!membership) {
      return { label: 'At Risk', class: 'badge-expired', icon: '🔴' }
    }
    const daysLeft = Math.ceil(
      (new Date(membership.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    const hasDues = membership.payment_status === 'pending' || membership.payment_status === 'partial'

    if (daysLeft <= 7 || hasDues) {
      return { label: 'Attention', class: 'badge-pending', icon: '🟡' }
    }
    return { label: 'Healthy', class: 'badge-active', icon: '🟢' }
  })()

  const handleApplyFreeze = () => {
    if (!validateFreeze() || !membership) return

    const currentEnd = new Date(membership.end_date)
    currentEnd.setDate(currentEnd.getDate() + freezeDays)

    const updatedMembership: Membership = {
      ...membership,
      status: 'frozen',
      frozen_at: new Date(freezeData.start_date).toISOString(),
      frozen_until: new Date(freezeData.end_date).toISOString(),
      freeze_reason: freezeData.reason,
      freeze_days_used: (membership.freeze_days_used || 0) + freezeDays,
      end_date: currentEnd.toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    }

    const updatedMember: Member = {
      ...member,
      status: 'frozen',
      updated_at: new Date().toISOString(),
    }

    onUpdateMembership(updatedMembership)
    onUpdateMember(updatedMember)
    setShowFreezeModal(false)
  }

  const handleApplyUnfreeze = () => {
    if (!membership) return

    let adjustedEndDate = membership.end_date
    if (membership.frozen_until) {
      const scheduledEnd = new Date(membership.frozen_until)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (today < scheduledEnd) {
        const unusedMs = scheduledEnd.getTime() - today.getTime()
        const unusedDays = Math.max(0, Math.floor(unusedMs / (1000 * 60 * 60 * 24)))
        if (unusedDays > 0) {
          const currentEnd = new Date(membership.end_date)
          currentEnd.setDate(currentEnd.getDate() - unusedDays)
          adjustedEndDate = currentEnd.toISOString().split('T')[0]
        }
      }
    }

    const updatedMembership: Membership = {
      ...membership,
      status: 'active',
      frozen_at: null,
      frozen_until: null,
      freeze_reason: null,
      end_date: adjustedEndDate,
      updated_at: new Date().toISOString(),
    }

    const updatedMember: Member = {
      ...member,
      status: 'active',
      updated_at: new Date().toISOString(),
    }

    onUpdateMembership(updatedMembership)
    onUpdateMember(updatedMember)
    setShowUnfreezeModal(false)
  }

  const handleRenewPlanChange = (planId: string) => {
    const plan = plans.find(p => p.id === planId)
    if (plan) {
      setRenewData(prev => ({
        ...prev,
        selectedPlanId: planId,
        actual_price: plan.price,
        discount_amount: 0,
        discount_reason: '',
        amount_paid: plan.price,
      }))
    }
  }

  const netRenewPrice = Math.max(0, renewData.actual_price - renewData.discount_amount)

  const handleRenewSubmit = () => {
    const errs: Record<string, string> = {}
    if (renewData.discount_amount > renewData.actual_price) {
      errs.discount_amount = 'Discount exceeds price'
    }
    if (renewData.discount_amount > 0 && !renewData.discount_reason.trim()) {
      errs.discount_reason = 'Reason required'
    }
    if (renewData.amount_paid < 0 || renewData.amount_paid > netRenewPrice) {
      errs.amount_paid = 'Invalid payment amount'
    }

    setRenewErrors(errs)
    if (Object.keys(errs).length > 0) return

    const selectedPlan = plans.find(p => p.id === renewData.selectedPlanId)!
    const calculatedEndDate = new Date(renewData.start_date)
    calculatedEndDate.setDate(calculatedEndDate.getDate() + selectedPlan.duration_days)

    let payment_status: 'paid' | 'partial' | 'pending' = 'pending'
    if (renewData.amount_paid === netRenewPrice && netRenewPrice > 0) {
      payment_status = 'paid'
    } else if (renewData.amount_paid > 0) {
      payment_status = 'partial'
    }

    const newMembership: Membership = {
      id: `ms_${Date.now()}`,
      tenant_id: 'tenant_001',
      member_id: member.id,
      plan_id: selectedPlan.id,
      plan_name: selectedPlan.name,
      start_date: renewData.start_date,
      end_date: calculatedEndDate.toISOString().split('T')[0],
      actual_price: renewData.actual_price,
      discount_amount: renewData.discount_amount,
      status: 'active',
      frozen_at: null,
      frozen_until: null,
      freeze_reason: null,
      freeze_days_used: 0,
      payment_status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }

    const updatedMember: Member = {
      ...member,
      status: 'active',
      updated_at: new Date().toISOString(),
    }

    onAddMembership(newMembership)
    onUpdateMember(updatedMember)
    setShowRenewModal(false)
  }

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        {/* Header */}
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">{member.first_name} {member.last_name}</h2>
            <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: '0.25rem' }}>
              <span className={`badge ${statusBadgeClass[member.status]}`}>
                {member.status === 'frozen' && <Snowflake size={10} style={{ marginRight: '0.125rem' }} />}
                {statusLabels[member.status]}
              </span>
              <span className={`badge ${health.class}`}>
                <span style={{ marginRight: '0.125rem' }}>{health.icon}</span>
                {health.label}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Code: {member.member_code}
              </span>
            </div>
            {member.tags && member.tags.length > 0 && (
              <div className="flex items-center gap-1" style={{ marginTop: '0.375rem', flexWrap: 'wrap' }}>
                {member.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.625rem',
                      background: 'var(--gray-100)',
                      color: 'var(--text-secondary)',
                      padding: '0.125rem 0.375rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 500,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)', overflowX: 'auto' }}>
          {([
            { id: 'profile', label: 'Profile', icon: <User size={13} /> },
            { id: 'membership', label: 'Membership', icon: <Play size={13} /> },
            { id: 'attendance', label: 'Check-Ins', icon: <Activity size={13} /> },
            { id: 'payments', label: 'Payments', icon: <CreditCard size={13} /> },
            { id: 'referrals', label: 'Referrals', icon: <Gift size={13} /> },
            { id: 'timeline', label: 'Timeline', icon: <Clock size={13} /> },
            { id: 'notes', label: 'Notes', icon: <FileText size={13} /> },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '0.75rem 0.5rem',
                fontSize: '0.8125rem',
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? 'var(--primary-600)' : 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--primary-600)' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                minWidth: '90px',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="drawer-body">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.75rem' }}>
                  Personal Information
                </h3>
                <div className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="flex items-center gap-3">
                      <Phone size={16} style={{ color: 'var(--text-tertiary)' }} />
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{formatPhone(member.phone)}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Phone</div>
                      </div>
                      <a
                        href={`https://wa.me/${member.phone.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm btn-icon"
                        style={{ marginLeft: 'auto', color: 'var(--success-600)' }}
                        title="Open WhatsApp"
                      >
                        <MessageCircle size={16} />
                      </a>
                    </div>

                    {member.email && (
                      <div className="flex items-center gap-3">
                        <Mail size={16} style={{ color: 'var(--text-tertiary)' }} />
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{member.email}</div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Email</div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Calendar size={16} style={{ color: 'var(--text-tertiary)' }} />
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{formatDate(member.joined_at, 'long')}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Joined Date</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio details */}
              <div className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Gender</div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 500, textTransform: 'capitalize' }}>{member.gender || '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Blood Group</div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{member.blood_group || '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Date of Birth</div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{member.date_of_birth ? formatDate(member.date_of_birth) : '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Source</div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 500, textTransform: 'capitalize' }}>{member.source || 'Walk-in'}</div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              {member.emergency_contact_name && (
                <div>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>Emergency Contact</h3>
                  <div className="card" style={{ padding: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Contact Name</div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{member.emergency_contact_name}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Contact Phone</div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{member.emergency_contact_phone ? formatPhone(member.emergency_contact_phone) : '—'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Medical conditions */}
              {member.medical_conditions && (
                <div className="card" style={{ padding: '1rem', background: 'var(--danger-50)', color: 'var(--danger-900)', border: '1px solid var(--danger-100)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--danger-800)', marginBottom: '0.25rem' }}>Medical Issues / Injuries</div>
                  <div style={{ fontSize: '0.8125rem' }}>{member.medical_conditions}</div>
                </div>
              )}
            </div>
          )}

          {/* MEMBERSHIP TAB */}
          {activeTab === 'membership' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {membership ? (
                <>
                  <div className={`card ${member.status === 'frozen' ? 'border-frozen' : ''}`} style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
                    {member.status === 'frozen' && (
                      <div style={{ position: 'absolute', right: '-15px', top: '-15px', background: 'var(--info-50)', color: 'var(--info-500)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Snowflake size={24} style={{ transform: 'translate(-5px, 5px)' }} />
                      </div>
                    )}
                    <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Current Active Plan</div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginTop: '0.125rem', color: 'var(--text-primary)' }}>{membership.plan_name}</h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem', fontSize: '0.8125rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-secondary)' }}>Validity:</span>
                        <div style={{ fontWeight: 500 }}>{formatDate(membership.start_date)} - {formatDate(membership.end_date)}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-secondary)' }}>Price Paid:</span>
                        <div style={{ fontWeight: 600, color: 'var(--primary-700)' }}>{formatCurrency(membership.actual_price - membership.discount_amount)}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-secondary)' }}>Freeze Allowance:</span>
                        <div style={{ fontWeight: 500 }}>
                          {membership.freeze_days_used} days used / {maxAllowed} allowed
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-secondary)' }}>Payment Status:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span className={`badge ${membership.payment_status === 'paid' ? 'badge-active' : 'badge-pending'}`} style={{ fontSize: '0.6875rem' }}>
                            {membership.payment_status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Frozen details */}
                    {membership.status === 'frozen' && membership.frozen_until && (
                      <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--info-50)', borderRadius: 'var(--radius-lg)', color: 'var(--info-800)', border: '1px solid var(--info-100)', fontSize: '0.75rem' }}>
                        <strong>❄️ Frozen Membership:</strong> Frozen on{' '}
                        {formatDate(membership.frozen_at || '')} due to{' '}
                        <strong>{membership.freeze_reason ? freezeReasonLabels[membership.freeze_reason] : 'other'}</strong>. Scheduled to resume on{' '}
                        <strong>{formatDate(membership.frozen_until)}</strong>.
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {member.status === 'frozen' ? (
                      <button className="btn btn-primary" onClick={() => setShowUnfreezeModal(true)}>
                        <Play size={16} />
                        Unfreeze Membership
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-info"
                          onClick={() => setShowFreezeModal(true)}
                          disabled={remainingFreezeDays <= 0}
                          style={{
                            color: remainingFreezeDays <= 0 ? 'var(--text-tertiary)' : 'var(--info-700)',
                            background: remainingFreezeDays <= 0 ? 'var(--gray-50)' : 'var(--info-50)',
                          }}
                        >
                          <Snowflake size={16} />
                          Freeze Membership ({remainingFreezeDays} days left)
                        </button>

                        <button className="btn btn-primary" onClick={() => setShowRenewModal(true)}>
                          <RotateCcw size={16} />
                          Renew / Change Plan
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <AlertTriangle className="empty-state-icon" style={{ color: 'var(--warning-500)' }} />
                  <div className="empty-state-title">No Active Plan</div>
                  <div className="empty-state-message">
                    This member does not have any active membership plan currently.
                  </div>
                  <button className="btn btn-primary" onClick={() => setShowRenewModal(true)}>
                    Assign Membership Plan
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ATTENDANCE TAB */}
          {activeTab === 'attendance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                Recent Check-Ins
              </div>
              {mockCheckIns.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <Clock className="empty-state-icon" />
                  <div className="empty-state-title">No attendance logs</div>
                  <div className="empty-state-message">This member hasn't checked in yet.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {mockCheckIns.map(ci => (
                    <div key={ci.id} className="card" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="flex items-center gap-3">
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'var(--success-500)'
                        }} />
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{formatDate(ci.check_in_at, 'long')}</div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                            Check-in time: {new Date(ci.check_in_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <span className="badge badge-walkin" style={{ fontSize: '0.625rem', textTransform: 'uppercase' }}>
                        {ci.method}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                Payment History
              </div>
              {memberPayments.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <CreditCard className="empty-state-icon" />
                  <div className="empty-state-title">No payments logged</div>
                  <div className="empty-state-message">No transaction history found for this member.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {memberPayments.map(pay => (
                    <div key={pay.id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(pay.amount)}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{pay.description}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                          Paid {formatDate(pay.paid_at)} via <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{pay.payment_method}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '0.25rem' }}>
                        <span className="badge badge-active" style={{ fontSize: '0.625rem' }}>{pay.payment_status}</span>
                        {pay.reference_number && (
                          <span style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>Ref: {pay.reference_number}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REFERRALS TAB */}
          {activeTab === 'referrals' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="card" style={{ flex: 1, padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                    {memberReferrals.length}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Total Referrals</div>
                </div>
                <div className="card" style={{ flex: 1, padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success-600)' }}>
                    {memberReferrals.filter(r => r.status === 'converted').length}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Converted</div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                Referrals List
              </div>
              {memberReferrals.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <Gift className="empty-state-icon" />
                  <div className="empty-state-title">No referrals yet</div>
                  <div className="empty-state-message">This member has not referred any prospects yet.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {memberReferrals.map((ref, idx) => (
                    <div key={idx} className="card" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{ref.name}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>{formatPhone(ref.phone)}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '0.25rem' }}>
                        <span className={`badge ${ref.status === 'converted' ? 'badge-active' : 'badge-trial'}`} style={{ fontSize: '0.625rem' }}>
                          {ref.status === 'converted' ? 'Converted' : 'On Trial'}
                        </span>
                        <span style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)' }}>{formatDate(ref.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TIMELINE TAB */}
          {activeTab === 'timeline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                Activity History
              </div>
              {memberEvents.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <Clock className="empty-state-icon" />
                  <div className="empty-state-title">No activity logged</div>
                  <div className="empty-state-message">No timeline events recorded for this member.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {memberEvents.map((evt, index) => (
                    <div
                      key={evt.id}
                      style={{
                        display: 'flex',
                        gap: '0.75rem',
                        paddingBottom: '1.25rem',
                        position: 'relative',
                      }}
                    >
                      {/* Timeline line */}
                      {index < memberEvents.length - 1 && (
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
                        fontSize: '0.75rem',
                      }}>
                        {evt.event_name === 'joined' && '🎉'}
                        {evt.event_name === 'renewed' && '🔄'}
                        {evt.event_name === 'frozen' && '❄️'}
                        {evt.event_name === 'unfrozen' && '▶️'}
                        {evt.event_name === 'payment_received' && '💰'}
                        {evt.event_name === 'lead_converted' && '🤝'}
                        {evt.event_name === 'attendance_marked' && '✓'}
                      </div>

                      {/* Content */}
                      <div className="card" style={{ flex: 1, padding: '0.875rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                            {evt.title}
                          </span>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                            {formatDate(evt.timestamp, 'relative')}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {evt.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* NOTES TAB */}
          {activeTab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="card" style={{ padding: '1rem' }}>
                <p style={{ fontSize: '0.8125rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                  {member.notes || 'No notes added yet for this member. You can edit the member profile to add administrative notes.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 1. FREEZE MEMBERSHIP MODAL */}
      {showFreezeModal && membership && (
        <>
          <div className="modal-overlay" style={{ zIndex: 1050 }} onClick={() => setShowFreezeModal(false)} />
          <div className="modal" style={{ zIndex: 1060, maxWidth: '400px', width: '90%' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Snowflake size={18} style={{ color: 'var(--info-500)' }} />
                Freeze Membership
              </h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowFreezeModal(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Temporary freeze will pause this member's plan and extend their expiry date.
              </div>

              {/* Start Date */}
              <div className="form-group">
                <label className="form-label form-label-required">Freeze Start Date</label>
                <input
                  className={`form-input ${freezeErrors.start_date ? 'form-input-error' : ''}`}
                  type="date"
                  value={freezeData.start_date}
                  onChange={(e) => setFreezeData(prev => ({ ...prev, start_date: e.target.value }))}
                />
                {freezeErrors.start_date && <span className="form-error">{freezeErrors.start_date}</span>}
              </div>

              {/* End Date */}
              <div className="form-group">
                <label className="form-label form-label-required">Freeze End Date (Inclusive)</label>
                <input
                  className={`form-input ${freezeErrors.end_date ? 'form-input-error' : ''}`}
                  type="date"
                  value={freezeData.end_date}
                  onChange={(e) => setFreezeData(prev => ({ ...prev, end_date: e.target.value }))}
                />
                {freezeErrors.end_date && <span className="form-error">{freezeErrors.end_date}</span>}
              </div>

              {/* Reason */}
              <div className="form-group">
                <label className="form-label">Reason for Freeze</label>
                <select
                  className="form-input form-select"
                  value={freezeData.reason}
                  onChange={(e) => setFreezeData(prev => ({ ...prev, reason: e.target.value as FreezeReason }))}
                >
                  <option value="travel">Personal Travel</option>
                  <option value="exams">Student Exams</option>
                  <option value="injury">Injury / Medical Reason</option>
                  <option value="family_emergency">Family Emergency</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Extended Validity Preview */}
              {freezeDays > 0 && !freezeErrors.end_date && (
                <div className="card" style={{ padding: '0.75rem', background: 'var(--info-50)', color: 'var(--info-900)', border: '1px solid var(--info-100)', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div><strong>Freeze Duration:</strong> {freezeDays} Days</div>
                    <div><strong>Current Expiry:</strong> {formatDate(membership.end_date)}</div>
                    <div style={{ color: 'var(--success-700)' }}>
                      <strong>Extended Expiry:</strong> {formatDate(new Date(new Date(membership.end_date).getTime() + freezeDays * 24 * 60 * 60 * 1000))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowFreezeModal(false)}>Cancel</button>
              <button className="btn btn-info" onClick={handleApplyFreeze} disabled={freezeDays <= 0 || !!freezeErrors.end_date}>
                Apply Freeze
              </button>
            </div>
          </div>
        </>
      )}

      {/* 2. UNFREEZE MEMBERSHIP CONFIRMATION */}
      {showUnfreezeModal && membership && (
        <>
          <div className="modal-overlay" style={{ zIndex: 1050 }} onClick={() => setShowUnfreezeModal(false)} />
          <div className="modal" style={{ zIndex: 1060, maxWidth: '400px', width: '90%' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Play size={18} style={{ color: 'var(--success-500)' }} />
                Unfreeze Membership
              </h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowUnfreezeModal(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Are you sure you want to unfreeze <strong>{member.first_name}'s</strong> membership?
              </div>

              {membership.frozen_until && new Date() < new Date(membership.frozen_until) ? (
                <div style={{ padding: '0.75rem', background: 'var(--success-50)', color: 'var(--success-800)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--success-100)', fontSize: '0.75rem' }}>
                  <strong>Early Unfreeze Discount:</strong> The remaining freeze period has been cut short. The membership expiry will be adjusted back to match the actual freeze days used.
                </div>
              ) : (
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  This will resume the membership status to <strong>Active</strong> starting today.
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowUnfreezeModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={handleApplyUnfreeze}>Confirm Unfreeze</button>
            </div>
          </div>
        </>
      )}

      {/* 3. RENEW MEMBERSHIP / CHANGE PLAN MODAL */}
      {showRenewModal && (
        <>
          <div className="modal-overlay" style={{ zIndex: 1050 }} onClick={() => setShowRenewModal(false)} />
          <div className="modal" style={{ zIndex: 1060, maxWidth: '450px', width: '90%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RotateCcw size={18} style={{ color: 'var(--primary-500)' }} />
                Renew / Change Plan
              </h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowRenewModal(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1 }}>
              {/* Select Plan */}
              <div className="form-group">
                <label className="form-label form-label-required">Choose Membership Plan</label>
                <select
                  className="form-input form-select"
                  value={renewData.selectedPlanId}
                  onChange={(e) => handleRenewPlanChange(e.target.value)}
                >
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatCurrency(p.price)} ({p.duration_days}d)
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div className="form-group">
                <label className="form-label form-label-required">New Plan Start Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={renewData.start_date}
                  onChange={(e) => setRenewData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>

              {/* Discount */}
              <div className="grid-2" style={{ gap: '0.5rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Discount (₹)</label>
                  <input
                    className={`form-input ${renewErrors.discount_amount ? 'form-input-error' : ''}`}
                    type="number"
                    placeholder="0"
                    value={renewData.discount_amount || ''}
                    onChange={(e) => setRenewData(prev => ({ ...prev, discount_amount: Number(e.target.value) }))}
                  />
                  {renewErrors.discount_amount && <span className="form-error">{renewErrors.discount_amount}</span>}
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Reason</label>
                  <input
                    className={`form-input ${renewErrors.discount_reason ? 'form-input-error' : ''}`}
                    placeholder="Reason"
                    value={renewData.discount_reason}
                    onChange={(e) => setRenewData(prev => ({ ...prev, discount_reason: e.target.value }))}
                    disabled={!renewData.discount_amount}
                  />
                  {renewErrors.discount_reason && <span className="form-error">{renewErrors.discount_reason}</span>}
                </div>
              </div>

              <div className="card" style={{ padding: '0.75rem', background: 'var(--gray-50)', fontSize: '0.8125rem' }}>
                <div className="flex justify-between" style={{ fontWeight: 600 }}>
                  <span>Net Payable Amount:</span>
                  <span style={{ color: 'var(--primary-600)' }}>{formatCurrency(netRenewPrice)}</span>
                </div>
              </div>

              {/* Amount Paid & Method */}
              <div className="grid-2" style={{ gap: '0.5rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label form-label-required">Amount Paid</label>
                  <input
                    className={`form-input ${renewErrors.amount_paid ? 'form-input-error' : ''}`}
                    type="number"
                    value={renewData.amount_paid}
                    onChange={(e) => setRenewData(prev => ({ ...prev, amount_paid: Number(e.target.value) }))}
                  />
                  {renewErrors.amount_paid && <span className="form-error">{renewErrors.amount_paid}</span>}
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Method</label>
                  <select
                    className="form-input form-select"
                    value={renewData.payment_method}
                    onChange={(e) => setRenewData(prev => ({ ...prev, payment_method: e.target.value as PaymentMethod }))}
                    disabled={renewData.amount_paid === 0}
                  >
                    <option value="upi">UPI</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              {netRenewPrice - renewData.amount_paid > 0 && (
                <div style={{ padding: '0.75rem', background: 'var(--warning-50)', color: 'var(--warning-800)', borderRadius: 'var(--radius-lg)', fontSize: '0.75rem' }}>
                  ⚠️ Due amount of <strong>{formatCurrency(netRenewPrice - renewData.amount_paid)}</strong> will remain pending.
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowRenewModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={handleRenewSubmit}>
                Confirm Renewal
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
