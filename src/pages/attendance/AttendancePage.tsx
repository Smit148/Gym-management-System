import { useState, useMemo } from 'react'
import {
  Plus,
  Users,
  Clock,
  LogOut,
  Download,
  Calendar,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useAttendanceLogs, useCheckOut } from '@/features/attendance/hooks/useAttendance'
import { CheckInModal } from '@/features/attendance/components/CheckInModal'
import { DataTable } from '@/organisms/DataTable/DataTable'
import type { ColumnDef } from '@/organisms/DataTable/types'
import type { Attendance } from '@/types'

export function AttendancePage() {
  const { data: logs = [], isLoading } = useAttendanceLogs()
  const checkOutMutation = useCheckOut()

  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'today' | 'active' | 'history'>('today')

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  // Calculate metrics for today
  const stats = useMemo(() => {
    const todayLogs = logs.filter((l) => l.check_in_at.startsWith(todayStr))
    const totalPresentToday = todayLogs.length
    const activeSessions = todayLogs.filter((l) => !l.check_out_at).length
    const checkedOutToday = todayLogs.filter((l) => !!l.check_out_at).length

    return {
      totalPresentToday,
      activeSessions,
      checkedOutToday,
    }
  }, [logs, todayStr])

  // Filter logs for table
  const filteredLogs = useMemo(() => {
    switch (activeTab) {
      case 'today':
        return logs.filter((l) => l.check_in_at.startsWith(todayStr))
      case 'active':
        return logs.filter((l) => l.check_in_at.startsWith(todayStr) && !l.check_out_at)
      case 'history':
        return logs.filter((l) => !l.check_in_at.startsWith(todayStr))
      default:
        return logs
    }
  }, [logs, activeTab, todayStr])

  const handleCheckOut = (log: Attendance) => {
    checkOutMutation.mutate({
      id: log.id,
      checkOutTime: new Date().toISOString(),
    })
  }

  // Define columns for DataTable
  const columns: ColumnDef<Attendance>[] = [
    {
      key: 'member_name',
      header: 'Member',
      sortable: true,
      render: (log) => (
        <div>
          <div style={{ fontWeight: 500 }}>{log.member_name || 'Member'}</div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
            Code: {log.member_code || '—'}
          </div>
        </div>
      ),
    },
    {
      key: 'check_in_at',
      header: 'Check-In Time',
      sortable: true,
      render: (log) => {
        const checkInTime = new Date(log.check_in_at).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        })
        return (
          <div className="flex items-center gap-1.5" style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
            <Clock size={12} style={{ color: 'var(--text-tertiary)' }} />
            {checkInTime}
          </div>
        )
      },
    },
    {
      key: 'check_out_at',
      header: 'Check-Out Time',
      sortable: true,
      render: (log) => {
        if (!log.check_out_at) {
          return (
            <span className="badge badge-active" style={{ fontSize: '0.6875rem' }}>
              Checked In
            </span>
          )
        }
        const checkOutTime = new Date(log.check_out_at).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        })
        return (
          <div className="flex items-center gap-1.5" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <LogOut size={12} style={{ color: 'var(--text-tertiary)' }} />
            {checkOutTime}
          </div>
        )
      },
    },
    {
      key: 'method',
      header: 'Method',
      render: (log) => (
        <span className="badge badge-new" style={{ textTransform: 'uppercase', fontSize: '0.6875rem' }}>
          {log.method}
        </span>
      ),
    },
    {
      key: 'notes',
      header: 'Notes',
      render: (log) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }} className="truncate max-w-xs block">
          {log.notes || '—'}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (log) => (
        <div className="flex items-center gap-1.5" style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
          <Calendar size={12} />
          {formatDate(log.check_in_at)}
        </div>
      ),
    },
  ]

  // Export to CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,'
    csvContent += 'Name,Code,CheckIn Time,CheckOut Time,Method,Notes,Date\n'

    logs.forEach((l) => {
      const checkInTime = new Date(l.check_in_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      const checkOutTime = l.check_out_at ? new Date(l.check_out_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Inside'
      csvContent += `"${l.member_name || ''}","${l.member_code || ''}","${checkInTime}","${checkOutTime}","${l.method}","${l.notes || ''}","${formatDate(l.check_in_at)}"\n`
    })

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'gymos_attendance_logs.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="page-enter">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Daily Attendance Desk</h1>
          <p className="page-subtitle">Track today's footfalls, manage checked-in sessions, and audit entries</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={16} />
            Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setShowCheckInModal(true)} style={{ background: 'var(--success-600)', borderColor: 'var(--success-600)' }}>
            <Plus size={16} />
            Check In Member
          </button>
        </div>
      </div>

      {/* KPI statistics cards */}
      <div className="grid-stats" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {/* Total Footfall */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
            <Users size={20} />
          </div>
          <div className="stat-card-value">{stats.totalPresentToday}</div>
          <div className="stat-card-label">Total Footfalls Today</div>
          <div className="stat-card-sublabel">Total entries recorded</div>
        </div>

        {/* Active Sessions */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--success-50)', color: 'var(--success-600)' }}>
            <Clock size={20} />
          </div>
          <div className="stat-card-value">{stats.activeSessions}</div>
          <div className="stat-card-label">Members Inside</div>
          <div className="stat-card-sublabel">Currently training sessions</div>
        </div>

        {/* Checked Out */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--gray-50)', color: 'var(--gray-600)' }}>
            <LogOut size={20} />
          </div>
          <div className="stat-card-value">{stats.checkedOutToday}</div>
          <div className="stat-card-label">Checked Out Today</div>
          <div className="stat-card-sublabel">Finished training</div>
        </div>
      </div>

      {/* Filter Tabs & DataTable */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)', marginBottom: '0.5rem' }}>
          {[
            { value: 'today', label: "Today's Logs" },
            { value: 'active', label: 'Currently Inside' },
            { value: 'history', label: 'Historic Logs' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as any)}
              style={{
                padding: '0.75rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: activeTab === tab.value ? 600 : 400,
                color: activeTab === tab.value ? 'var(--primary-600)' : 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.value ? '2px solid var(--primary-600)' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <DataTable
          data={filteredLogs}
          columns={columns}
          searchPlaceholder="Search by member name..."
          isLoading={isLoading}
          emptyState={{
            title: 'No check-in logs found',
            message: 'There are no active attendance records matching your criteria.',
          }}
          rowActions={[
            {
              label: 'Check Out Member',
              action: (log) => handleCheckOut(log),
              icon: <LogOut size={14} />,
              visible: (log) => !log.check_out_at,
            },
          ]}
        />
      </div>

      {/* Check In Modal */}
      {showCheckInModal && (
        <CheckInModal onClose={() => setShowCheckInModal(false)} />
      )}
    </div>
  )
}
