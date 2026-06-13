import { useState, useMemo } from 'react'
import {
  Wallet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Calendar,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useSalaryRecords } from '@/features/salary/hooks/useSalary'
import { useStaff } from '@/features/staff/hooks/useStaff'
import { PaySalaryModal } from '@/features/salary/components/PaySalaryModal'
import { DataTable } from '@/organisms/DataTable/DataTable'
import type { ColumnDef } from '@/organisms/DataTable/types'
import type { SalaryRecord, SalaryStatus } from '@/types'

const statusConfig: Record<SalaryStatus, { className: string; label: string; color: string }> = {
  paid: { className: 'badge-active', label: 'Paid', color: 'var(--success-600)' },
  pending: { className: 'badge-pending', label: 'Pending', color: 'var(--warning-600)' },
  overdue: { className: 'badge-expired', label: 'Overdue', color: 'var(--danger-600)' },
  partial: { className: 'badge-trial', label: 'Partial', color: '#8B5CF6' },
}

function getMonthStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function formatMonthDisplay(monthStr: string): string {
  const [year, month] = monthStr.split('-')
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

export function SalaryPage() {
  const { data: salaryRecords = [], isLoading } = useSalaryRecords()
  const { data: staff = [] } = useStaff()
  const [payRecord, setPayRecord] = useState<SalaryRecord | null>(null)

  // Month picker state
  const [currentMonth, setCurrentMonth] = useState(() => getMonthStr(new Date()))

  const prevMonth = () => {
    const [y, m] = currentMonth.split('-').map(Number)
    const d = new Date(y, m - 2)
    setCurrentMonth(getMonthStr(d))
  }

  const nextMonth = () => {
    const [y, m] = currentMonth.split('-').map(Number)
    const d = new Date(y, m)
    setCurrentMonth(getMonthStr(d))
  }

  // Filter records by current month
  const monthRecords = useMemo(() => {
    return salaryRecords.filter(r => r.month === currentMonth)
  }, [salaryRecords, currentMonth])

  // KPI stats
  const stats = useMemo(() => {
    const totalPayroll = monthRecords.reduce((s, r) => s + r.amount, 0)
    const totalPaid = monthRecords.filter(r => r.status === 'paid').reduce((s, r) => s + r.amount, 0)
    const totalPending = monthRecords.filter(r => r.status === 'pending' || r.status === 'partial')
      .reduce((s, r) => s + (r.amount - r.paid_amount), 0)
    const overdueCount = monthRecords.filter(r => r.status === 'overdue').length
    return { totalPayroll, totalPaid, totalPending, overdueCount }
  }, [monthRecords])

  // Get role for each salary record
  const enrichedRecords = useMemo(() => {
    return monthRecords.map(r => {
      const staffMember = staff.find(s => s.id === r.staff_id)
      return {
        ...r,
        staff_name: r.staff_name || (staffMember ? `${staffMember.first_name} ${staffMember.last_name}` : 'Unknown'),
        _role: staffMember?.role || 'other',
      }
    })
  }, [monthRecords, staff])

  type EnrichedSalary = SalaryRecord & { _role: string }

  const columns: ColumnDef<EnrichedSalary>[] = [
    {
      key: 'staff_name',
      header: 'Staff Member',
      sortable: true,
      render: (r) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
            {r.staff_name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>
            {r._role}
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Salary',
      sortable: true,
      render: (r) => (
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          {formatCurrency(r.amount)}
        </span>
      ),
    },
    {
      key: 'paid_amount',
      header: 'Paid',
      render: (r) => (
        <span style={{ fontWeight: 500, color: r.paid_amount > 0 ? 'var(--success-600)' : 'var(--text-tertiary)' }}>
          {formatCurrency(r.paid_amount)}
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
      key: 'paid_at',
      header: 'Paid Date',
      render: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <Calendar size={12} style={{ color: 'var(--text-tertiary)' }} />
          {r.paid_at ? formatDate(r.paid_at) : '—'}
        </div>
      ),
    },
    {
      key: 'payment_method',
      header: 'Method',
      render: (r) => (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          {r.payment_method?.replace('_', ' ') || '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (r) => (
        r.status !== 'paid' ? (
          <button
            onClick={(e) => { e.stopPropagation(); setPayRecord(r) }}
            className="btn btn-primary"
            style={{
              padding: '0.375rem 0.75rem', fontSize: '0.75rem',
              background: 'var(--success-600)', borderColor: 'var(--success-600)',
            }}
          >
            <CreditCard size={12} />
            Pay
          </button>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--success-600)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <CheckCircle2 size={12} /> Done
          </span>
        )
      ),
    },
  ]

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Salary Tracker</h1>
          <p className="page-subtitle">Track monthly payroll disbursements and pending salaries</p>
        </div>

        {/* Month Picker */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--gray-50)', padding: '0.375rem 0.5rem',
          borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-primary)',
        }}>
          <button onClick={prevMonth} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', padding: '0.25rem',
            display: 'flex', alignItems: 'center',
          }}>
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontWeight: 600, fontSize: '0.875rem', minWidth: '140px', textAlign: 'center' }}>
            {formatMonthDisplay(currentMonth)}
          </span>
          <button onClick={nextMonth} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', padding: '0.25rem',
            display: 'flex', alignItems: 'center',
          }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-stats" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
            <Wallet size={20} />
          </div>
          <div className="stat-card-value">{formatCurrency(stats.totalPayroll)}</div>
          <div className="stat-card-label">Total Payroll</div>
          <div className="stat-card-sublabel">{formatMonthDisplay(currentMonth)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--success-50)', color: 'var(--success-600)' }}>
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-card-value">{formatCurrency(stats.totalPaid)}</div>
          <div className="stat-card-label">Paid</div>
          <div className="stat-card-sublabel">Disbursed this month</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--warning-50)', color: 'var(--warning-600)' }}>
            <Clock size={20} />
          </div>
          <div className="stat-card-value">{formatCurrency(stats.totalPending)}</div>
          <div className="stat-card-label">Pending</div>
          <div className="stat-card-sublabel">Awaiting disbursement</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--danger-50)', color: 'var(--danger-600)' }}>
            <AlertTriangle size={20} />
          </div>
          <div className="stat-card-value" style={{ color: stats.overdueCount > 0 ? 'var(--danger-600)' : undefined }}>
            {stats.overdueCount}
          </div>
          <div className="stat-card-label">Overdue</div>
          <div className="stat-card-sublabel">{stats.overdueCount > 0 ? '⚠️ Action needed' : 'All on track'}</div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: '1rem' }}>
        <DataTable
          data={enrichedRecords as EnrichedSalary[]}
          columns={columns}
          searchPlaceholder="Search by staff name..."
          searchField={(r: EnrichedSalary, query: string) => {
            return (r.staff_name || '').toLowerCase().includes(query)
          }}
          isLoading={isLoading}
          emptyState={{
            title: 'No salary records',
            message: `No salary records found for ${formatMonthDisplay(currentMonth)}.`,
          }}
        />
      </div>

      {/* Pay Modal */}
      {payRecord && (
        <PaySalaryModal
          record={payRecord}
          onClose={() => setPayRecord(null)}
        />
      )}
    </div>
  )
}
