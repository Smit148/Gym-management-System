import { useState, useMemo } from 'react'
import {
  Users,
  Plus,
  Phone,
  Snowflake,
} from 'lucide-react'
import { formatDate, formatPhone } from '@/lib/utils'
import {
  useMembers,
  useMemberships,
  useCreateMember,
  useUpdateMember,
  useUpdateMembership,
  useRenewMembership,
} from '@/features/members/hooks/useMembers'
import { MemberDetailDrawer } from '@/features/members/components/MemberDetailDrawer'
import { AddMemberDrawer } from '@/features/members/components/AddMemberDrawer'
import { DataTable } from '@/organisms/DataTable/DataTable'
import type { ColumnDef } from '@/organisms/DataTable/types'
import type { Member, MemberStatus, Membership } from '@/types'

type FilterTab = 'all' | MemberStatus | 'due'

const statusTabs: { label: string; value: FilterTab }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Expired', value: 'expired' },
  { label: 'Frozen', value: 'frozen' },
  { label: 'Due Soon', value: 'due' },
]

const statusBadgeClass: Record<MemberStatus, string> = {
  active: 'badge-active',
  inactive: 'badge-lost',
  expired: 'badge-expired',
  frozen: 'badge-frozen',
}

const statusLabels: Record<MemberStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  expired: 'Expired',
  frozen: 'Frozen',
}

export function MembersPage() {
  const { data: members = [], isLoading: membersLoading } = useMembers()
  const { data: memberships = [], isLoading: membershipsLoading } = useMemberships()

  const createMemberMutation = useCreateMember()
  const updateMemberMutation = useUpdateMember()
  const updateMembershipMutation = useUpdateMembership()
  const renewMembershipMutation = useRenewMembership()

  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [showAddDrawer, setShowAddDrawer] = useState(false)

  // Get active membership for a member
  const getMembership = (memberId: string) =>
    memberships.find((m) => m.member_id === memberId && m.status !== 'cancelled' && m.deleted_at === null)

  // Due soon: active membership ending within 7 days
  const isDueSoon = (memberId: string) => {
    const ms = getMembership(memberId)
    if (!ms || ms.status !== 'active') return false
    const daysLeft = Math.ceil(
      (new Date(ms.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    return daysLeft >= 0 && daysLeft <= 7
  }

  const handleUpdateMember = (updatedMember: Member) => {
    updateMemberMutation.mutate(updatedMember)
    setSelectedMember(updatedMember)
  }

  const handleUpdateMembership = (updatedMembership: Membership) => {
    updateMembershipMutation.mutate(updatedMembership)
  }

  const handleAddMembership = (newMembership: Membership) => {
    renewMembershipMutation.mutate(newMembership)
  }

  const handleAddMember = (newMember: Member, newMembership: Membership) => {
    createMemberMutation.mutate({ member: newMember, membership: newMembership })
    setShowAddDrawer(false)
  }

  const getDaysRemaining = (memberId: string): number | null => {
    const ms = getMembership(memberId)
    if (!ms) return null
    return Math.ceil(
      (new Date(ms.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  }

  // Filter members by Tab selection
  const tabFilteredMembers = useMemo(() => {
    if (activeTab === 'due') {
      return members.filter((m) => isDueSoon(m.id))
    } else if (activeTab !== 'all') {
      return members.filter((m) => m.status === activeTab)
    }
    return members
  }, [members, activeTab, memberships])

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: members.length,
      due: members.filter((m) => isDueSoon(m.id)).length,
    }
    for (const m of members) {
      counts[m.status] = (counts[m.status] || 0) + 1
    }
    return counts
  }, [members, memberships])

  // Define Columns for generic DataTable
  const columns: ColumnDef<Member>[] = [
    {
      key: 'first_name',
      header: 'Member',
      sortable: true,
      render: (member) => (
        <div className="flex items-center gap-3">
          <div className="avatar avatar-sm">
            {member.first_name[0]}{(member.last_name || '')[0] || ''}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>
              {member.first_name} {member.last_name || ''}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
              {member.member_code}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (member) => (
        <div className="flex items-center gap-1" style={{ fontSize: '0.8125rem' }}>
          <Phone size={12} style={{ color: 'var(--text-tertiary)' }} />
          {formatPhone(member.phone)}
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Plan',
      render: (member) => {
        const ms = getMembership(member.id)
        return (
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '0.8125rem' }}>
              {ms?.plan_name || '—'}
            </span>
            {ms && ms.payment_status !== 'paid' && (
              <span className={`badge ${ms.payment_status === 'partial' ? 'badge-pending' : 'badge-expired'}`} style={{ fontSize: '0.625rem' }}>
                {ms.payment_status}
              </span>
            )}
          </div>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (member) => (
        <div className="flex items-center gap-1">
          <span className={`badge ${statusBadgeClass[member.status]}`}>
            {member.status === 'frozen' && <Snowflake size={10} style={{ marginRight: '0.125rem' }} />}
            {statusLabels[member.status]}
          </span>
        </div>
      ),
    },
    {
      key: 'expires',
      header: 'Expires',
      render: (member) => {
        const ms = getMembership(member.id)
        return (
          <span style={{ fontSize: '0.8125rem' }}>
            {ms ? formatDate(ms.end_date) : '—'}
          </span>
        )
      },
    },
    {
      key: 'daysLeft',
      header: 'Days Left',
      render: (member) => {
        const daysLeft = getDaysRemaining(member.id)
        return daysLeft !== null ? (
          <span style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color:
              member.status === 'frozen' ? 'var(--info-600)' :
              member.status === 'expired' || daysLeft < 0 ? 'var(--danger-600)' :
              daysLeft <= 7 ? 'var(--warning-600)' :
              'var(--success-600)',
          }}>
            {member.status === 'frozen' ? (
              '❄️ Frozen'
            ) : daysLeft < 0 ? (
              `${Math.abs(daysLeft)}d overdue`
            ) : (
              `${daysLeft}d`
            )}
          </span>
        ) : (
          <span style={{ color: 'var(--text-tertiary)' }}>—</span>
        )
      },
    },
  ]

  const searchFilter = (member: Member, query: string) => {
    const code = member.member_code.toLowerCase()
    const name = `${member.first_name} ${member.last_name || ''}`.toLowerCase()
    const phone = member.phone
    const email = (member.email || '').toLowerCase()
    return name.includes(query) || code.includes(query) || phone.includes(query) || email.includes(query)
  }

  const isLoading = membersLoading || membershipsLoading

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Members</h1>
          <p className="page-subtitle">Manage gym members, plans, and renewals</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddDrawer(true)}>
          <Plus size={18} />
          Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid-stats" style={{ marginBottom: '1.25rem' }}>
        <div className="stat-card" style={{ cursor: 'default' }}>
          <div className="stat-card-value" style={{ fontSize: '1.5rem' }}>{members.length}</div>
          <div className="stat-card-label">Total Members</div>
        </div>
        <div className="stat-card" style={{ cursor: 'default' }}>
          <div className="stat-card-value" style={{ fontSize: '1.5rem', color: 'var(--success-600)' }}>
            {members.filter((m) => m.status === 'active').length}
          </div>
          <div className="stat-card-label">Active</div>
        </div>
        <div className="stat-card" style={{ cursor: 'default' }}>
          <div className="stat-card-value" style={{ fontSize: '1.5rem', color: 'var(--info-600)' }}>
            {members.filter((m) => m.status === 'frozen').length}
          </div>
          <div className="stat-card-label">Frozen</div>
        </div>
        <div className="stat-card" style={{ cursor: 'default' }}>
          <div className="stat-card-value" style={{ fontSize: '1.5rem', color: 'var(--warning-600)' }}>
            {members.filter((m) => isDueSoon(m.id)).length}
          </div>
          <div className="stat-card-label">Due This Week</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs" style={{ marginBottom: '1rem' }}>
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            className={`filter-tab ${activeTab === tab.value ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
            <span className="filter-tab-count">{tabCounts[tab.value] || 0}</span>
          </button>
        ))}
      </div>

      {/* Generic Data Table Component */}
      <div className="card">
        <DataTable<Member>
          data={tabFilteredMembers}
          columns={columns}
          searchPlaceholder="Search by name, phone, member code..."
          searchField={searchFilter}
          isLoading={isLoading}
          onRowClick={(row) => setSelectedMember(row)}
          emptyState={{
            title: 'No members found',
            message: 'Try adjusting your search filters or add a new member.',
            icon: <Users size={36} style={{ color: 'var(--text-tertiary)' }} />,
            actionButton: (
              <button className="btn btn-primary" onClick={() => setShowAddDrawer(true)}>
                <Plus size={18} />
                Add First Member
              </button>
            )
          }}
        />
      </div>

      {/* Member Detail Drawer */}
      {selectedMember && (
        <MemberDetailDrawer
          member={selectedMember}
          membership={getMembership(selectedMember.id) || null}
          onClose={() => setSelectedMember(null)}
          onUpdateMember={handleUpdateMember}
          onUpdateMembership={handleUpdateMembership}
          onAddMembership={handleAddMembership}
        />
      )}

      {/* Add Member Drawer */}
      {showAddDrawer && (
        <AddMemberDrawer
          onClose={() => setShowAddDrawer(false)}
          onSubmit={handleAddMember}
          existingMembersCount={members.length}
        />
      )}
    </div>
  )
}
