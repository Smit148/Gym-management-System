import { useState, useMemo } from 'react'
import { X, ClipboardCheck } from 'lucide-react'
import { useMembers } from '@/features/members/hooks/useMembers'
import { useAttendanceLogs, useCheckIn } from '../hooks/useAttendance'
import type { Attendance } from '@/types'

interface CheckInModalProps {
  onClose: () => void
}

export function CheckInModal({ onClose }: CheckInModalProps) {
  const { data: members = [] } = useMembers()
  const { data: attendanceLogs = [] } = useAttendanceLogs()
  const checkInMutation = useCheckIn()

  const [memberId, setMemberId] = useState('')
  const [method, setMethod] = useState<'receptionist' | 'manual' | 'qr'>('receptionist')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter only active members to check in
  const activeMembers = useMemo(() => {
    return members.filter(m => m.status === 'active')
  }, [members])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!memberId) {
      setError('Please select a member.')
      return
    }

    // Check if member is already checked in today (missing check_out_at)
    const todayStr = new Date().toISOString().split('T')[0]
    const alreadyCheckedIn = attendanceLogs.some(
      (log) =>
        log.member_id === memberId &&
        log.check_in_at.startsWith(todayStr) &&
        !log.check_out_at
    )

    if (alreadyCheckedIn) {
      setError('This member is already checked in for today and has not checked out yet.')
      return
    }

    const selectedMember = members.find(m => m.id === memberId)
    if (!selectedMember) {
      setError('Selected member not found.')
      return
    }

    setIsSubmitting(true)
    const newCheckIn: Attendance = {
      id: `att_${Date.now()}`,
      member_id: memberId,
      member_name: `${selectedMember.first_name} ${selectedMember.last_name || ''}`.trim(),
      member_code: selectedMember.member_code,
      check_in_at: new Date().toISOString(),
      method,
      notes: notes.trim() || undefined,
    }

    checkInMutation.mutate(newCheckIn, {
      onSuccess: () => {
        setIsSubmitting(false)
        onClose()
      },
      onError: () => {
        setIsSubmitting(false)
        setError('Failed to record check-in. Please try again.')
      }
    })
  }

  return (
    <>
      <div className="modal-overlay" style={{ zIndex: 1050 }} onClick={onClose} />
      <div className="modal" style={{ zIndex: 1060, maxWidth: '420px', width: '90%' }}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClipboardCheck size={18} style={{ color: 'var(--success-500)' }} />
            Mark Attendance Check-In
          </h3>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {error && (
              <div style={{
                padding: '0.75rem',
                background: 'var(--danger-50)',
                border: '1px solid var(--danger-100)',
                color: 'var(--danger-700)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            {/* Member Dropdown */}
            <div className="form-group">
              <label className="form-label form-label-required">Select Member</label>
              <select
                className="form-input form-select"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
              >
                <option value="">Select Member</option>
                {activeMembers.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.first_name} {m.last_name || ''} ({m.member_code})
                  </option>
                ))}
              </select>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: '0.25rem', display: 'block' }}>
                Only active members are eligible for check-in.
              </span>
            </div>

            {/* Check-in Method */}
            <div className="form-group">
              <label className="form-label form-label-required">Check-In Method</label>
              <select
                className="form-input form-select"
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
              >
                <option value="receptionist">Receptionist Manual Mark</option>
                <option value="manual">Member Self-Check-in</option>
                <option value="qr">Vantage QR Scan</option>
              </select>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <input
                className="form-input"
                placeholder="e.g. Guest Pass, Forgot Card, Trial User"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ background: 'var(--success-600)', borderColor: 'var(--success-600)' }} disabled={isSubmitting}>
              {isSubmitting ? 'Checking in...' : 'Check In Member'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
