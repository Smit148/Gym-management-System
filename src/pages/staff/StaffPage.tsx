import { useState, useMemo } from 'react'
import {
  UserCog,
  Plus,
  Dumbbell,
  Users,
  UserX,
  Wallet,
  Phone,
  Mail,
  Clock,
  Edit2,
} from 'lucide-react'
import { formatCurrency, formatDate, formatPhone } from '@/lib/utils'
import { useStaff } from '@/features/staff/hooks/useStaff'
import { AddStaffDrawer } from '@/features/staff/components/AddStaffDrawer'
import { DataTable } from '@/organisms/DataTable/DataTable'
import type { ColumnDef } from '@/organisms/DataTable/types'
import type { Staff, StaffRole } from '@/types'

const roleLabels: Record<StaffRole, string> = {
  trainer: 'Trainer',
  receptionist: 'Receptionist',
  cleaning: 'Cleaning Staff',
  manager: 'Manager',
  other: 'Other',
}

const roleColors: Record<StaffRole, string> = {
  trainer: 'var(--primary-600)',
  receptionist: '#06B6D4',
  cleaning: '#F59E0B',
  manager: '#8B5CF6',
  other: 'var(--gray-500)',
}

const shiftLabels: Record<string, string> = {
  morning: 'Morning',
  evening: 'Evening',
  full_day: 'Full Day',
  flexible: 'Flexible',
}

const statusBadge: Record<string, { className: string; label: string }> = {
  active: { className: 'badge-active', label: 'Active' },
  on_leave: { className: 'badge-frozen', label: 'On Leave' },
  terminated: { className: 'badge-expired', label: 'Terminated' },
}

export function StaffPage() {
  const { data: staff = [], isLoading } = useStaff()
  const [showAddDrawer, setShowAddDrawer] = useState(false)
  const [editStaff, setEditStaff] = useState<Staff | null>(null)
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)

  const activeStaff = staff.filter(s => s.status !== 'terminated')

  // KPI stats
  const stats = useMemo(() => {
    const total = activeStaff.length
    const trainers = activeStaff.filter(s => s.role === 'trainer').length
    const onLeave = activeStaff.filter(s => s.status === 'on_leave').length
    const totalPayroll = activeStaff.reduce((sum, s) => sum + s.salary_amount, 0)
    return { total, trainers, onLeave, totalPayroll }
  }, [activeStaff])

  // Filter
  const filteredStaff = useMemo(() => {
    const base = staff.filter(s => s.status !== 'terminated')
    if (roleFilter === 'all') return base
    return base.filter(s => s.role === roleFilter)
  }, [staff, roleFilter])

  const columns: ColumnDef<Staff>[] = [
    {
      key: 'name',
      header: 'Staff Member',
      sortable: true,
      render: (s) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: 'var(--radius-full)',
            background: `${roleColors[s.role]}15`, color: roleColors[s.role],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8125rem', fontWeight: 700, flexShrink: 0,
          }}>
            {s.first_name[0]}{s.last_name[0]}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
              {s.first_name} {s.last_name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              Since {formatDate(s.joined_at)}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (s) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{
            display: 'inline-block', width: '8px', height: '8px',
            borderRadius: '50%', background: roleColors[s.role],
          }} />
          <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>
            {roleLabels[s.role]}
          </span>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Contact',
      render: (s) => (
        <div style={{ fontSize: '0.8125rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-primary)' }}>
            <Phone size={11} style={{ color: 'var(--text-tertiary)' }} />
            {formatPhone(s.phone)}
          </div>
          {s.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.125rem' }}>
              <Mail size={10} style={{ color: 'var(--text-tertiary)' }} />
              {s.email}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'shift',
      header: 'Shift',
      render: (s) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <Clock size={12} style={{ color: 'var(--text-tertiary)' }} />
          {shiftLabels[s.shift]}
        </span>
      ),
    },
    {
      key: 'salary_amount',
      header: 'Salary',
      sortable: true,
      render: (s) => (
        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
          {formatCurrency(s.salary_amount)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (s) => {
        const badge = statusBadge[s.status] || statusBadge.active
        return <span className={`badge ${badge.className}`}>{badge.label}</span>
      },
    },
    {
      key: 'actions',
      header: '',
      render: (s) => (
        <button
          onClick={(e) => { e.stopPropagation(); setEditStaff(s); setShowAddDrawer(true) }}
          style={{
            background: 'none', border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)', padding: '0.375rem',
            cursor: 'pointer', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center',
          }}
          title="Edit"
        >
          <Edit2 size={14} />
        </button>
      ),
    },
  ]

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Staff Management</h1>
          <p className="page-subtitle">Manage trainers, receptionists, and support staff</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditStaff(null); setShowAddDrawer(true) }}>
          <Plus size={16} />
          Add Staff
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid-stats" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
            <Users size={20} />
          </div>
          <div className="stat-card-value">{stats.total}</div>
          <div className="stat-card-label">Total Staff</div>
          <div className="stat-card-sublabel">Active employees</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--success-50)', color: 'var(--success-600)' }}>
            <Dumbbell size={20} />
          </div>
          <div className="stat-card-value">{stats.trainers}</div>
          <div className="stat-card-label">Trainers</div>
          <div className="stat-card-sublabel">Active trainers on floor</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--warning-50)', color: 'var(--warning-600)' }}>
            <UserX size={20} />
          </div>
          <div className="stat-card-value">{stats.onLeave}</div>
          <div className="stat-card-label">On Leave</div>
          <div className="stat-card-sublabel">Currently unavailable</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#FDF4FF', color: '#9333EA' }}>
            <Wallet size={20} />
          </div>
          <div className="stat-card-value">{formatCurrency(stats.totalPayroll)}</div>
          <div className="stat-card-label">Monthly Payroll</div>
          <div className="stat-card-sublabel">Total salary commitment</div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem' }}>
        {/* Tab filters */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)', marginBottom: '0.5rem', overflowX: 'auto' }}>
          {([
            { value: 'all', label: 'All Staff' },
            { value: 'trainer', label: 'Trainers' },
            { value: 'receptionist', label: 'Receptionists' },
            { value: 'manager', label: 'Managers' },
            { value: 'cleaning', label: 'Cleaning' },
          ]).map((tab) => (
            <button
              key={tab.value}
              onClick={() => setRoleFilter(tab.value)}
              style={{
                padding: '0.75rem 1rem', fontSize: '0.8125rem',
                fontWeight: roleFilter === tab.value ? 600 : 400,
                color: roleFilter === tab.value ? 'var(--primary-600)' : 'var(--text-secondary)',
                background: 'none', border: 'none',
                borderBottom: roleFilter === tab.value ? '2px solid var(--primary-600)' : '2px solid transparent',
                cursor: 'pointer', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <DataTable
          data={filteredStaff}
          columns={columns}
          searchPlaceholder="Search staff by name, role, phone..."
          searchField={(s: Staff, query: string) => {
            const name = `${s.first_name} ${s.last_name}`.toLowerCase()
            const role = roleLabels[s.role].toLowerCase()
            return name.includes(query) || role.includes(query) || s.phone.includes(query)
          }}
          isLoading={isLoading}
          onRowClick={(s) => setSelectedStaff(s)}
          emptyState={{
            title: 'No staff members found',
            message: 'Add your first staff member to get started.',
          }}
        />
      </div>

      {/* Staff Detail Drawer (simplified inline) */}
      {selectedStaff && (
        <>
          <div
            onClick={() => setSelectedStaff(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
              zIndex: 999, animation: 'fadeIn 0.2s ease',
            }}
          />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0,
            width: 'min(420px, 100vw)', background: 'white',
            zIndex: 1000, overflow: 'auto',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
            animation: 'slideInRight 0.3s ease',
          }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: 'var(--radius-full)',
                    background: `${roleColors[selectedStaff.role]}15`, color: roleColors[selectedStaff.role],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.125rem', fontWeight: 700,
                  }}>
                    {selectedStaff.first_name[0]}{selectedStaff.last_name[0]}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                      {selectedStaff.first_name} {selectedStaff.last_name}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <span className={`badge ${statusBadge[selectedStaff.status].className}`}>
                        {statusBadge[selectedStaff.status].label}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: roleColors[selectedStaff.role], fontWeight: 600 }}>
                        {roleLabels[selectedStaff.role]}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStaff(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  <UserCog size={0} style={{ display: 'none' }} />
                  ✕
                </button>
              </div>

              {/* Detail rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {([
                  { label: 'Phone', value: formatPhone(selectedStaff.phone) },
                  { label: 'Email', value: selectedStaff.email || '—' },
                  { label: 'Shift', value: shiftLabels[selectedStaff.shift] },
                  { label: 'Monthly Salary', value: formatCurrency(selectedStaff.salary_amount) },
                  { label: 'Joined', value: formatDate(selectedStaff.joined_at, 'long') },
                  { label: 'Emergency Contact', value: selectedStaff.emergency_contact ? formatPhone(selectedStaff.emergency_contact) : '—' },
                  { label: 'Notes', value: selectedStaff.notes || '—' },
                ] as const).map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0.5rem 0', borderBottom: '1px solid var(--border-secondary)' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{row.label}</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)', textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => { setEditStaff(selectedStaff); setSelectedStaff(null); setShowAddDrawer(true) }}
                >
                  <Edit2 size={14} /> Edit Details
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Drawer */}
      {showAddDrawer && (
        <AddStaffDrawer
          onClose={() => { setShowAddDrawer(false); setEditStaff(null) }}
          editStaff={editStaff}
        />
      )}
    </div>
  )
}
