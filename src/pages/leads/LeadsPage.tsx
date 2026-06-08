import { useState, useMemo } from 'react'
import {
  Target,
  Plus,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react'
import { formatDate, formatPhone } from '@/lib/utils'
import { useLeads, useCreateLead, useUpdateLead } from '@/features/leads/hooks/useLeads'
import { useMembers, useCreateMember } from '@/features/members/hooks/useMembers'
import { AddLeadDrawer } from '@/features/leads/components/AddLeadDrawer'
import { LeadDetailDrawer } from '@/features/leads/components/LeadDetailDrawer'
import { AddMemberDrawer } from '@/features/members/components/AddMemberDrawer'
import { DataTable } from '@/organisms/DataTable/DataTable'
import type { ColumnDef } from '@/organisms/DataTable/types'
import type { Lead, LeadStatus, LeadSource, Member, Membership } from '@/types'

type FilterTab = 'all' | LeadStatus

const statusTabs: { label: string; value: FilterTab }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Follow Up', value: 'follow_up' },
  { label: 'Trial', value: 'trial' },
  { label: 'Converted', value: 'converted' },
  { label: 'Lost', value: 'lost' },
]

const sourceLabels: Record<LeadSource, string> = {
  walk_in: 'Walk-in',
  instagram: 'Instagram',
  google: 'Google',
  facebook: 'Facebook',
  referral: 'Referral',
  whatsapp: 'WhatsApp',
  website: 'Website',
  other: 'Other',
}

const sourceBadgeClass: Record<LeadSource, string> = {
  walk_in: 'badge-walkin',
  instagram: 'badge-instagram',
  google: 'badge-google',
  facebook: 'badge-google',
  referral: 'badge-referral',
  whatsapp: 'badge-whatsapp',
  website: 'badge-google',
  other: 'badge-lost',
}

const statusBadgeClass: Record<LeadStatus, string> = {
  new: 'badge-new',
  contacted: 'badge-contacted',
  follow_up: 'badge-pending',
  trial: 'badge-trial',
  converted: 'badge-converted',
  lost: 'badge-lost',
}

const statusLabels: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  follow_up: 'Follow Up',
  trial: 'Trial',
  converted: 'Converted',
  lost: 'Lost',
}

export function LeadsPage() {
  const { data: leads = [], isLoading: leadsLoading } = useLeads()
  const { data: members = [] } = useMembers()

  const createLeadMutation = useCreateLead()
  const updateLeadMutation = useUpdateLead()
  const createMemberMutation = useCreateMember()

  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [showAddDrawer, setShowAddDrawer] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  
  // Convert flow states
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null)
  const [showAddMemberDrawer, setShowAddMemberDrawer] = useState(false)

  // Filter leads by Tab
  const tabFilteredLeads = useMemo(() => {
    if (activeTab !== 'all') {
      return leads.filter((l) => l.status === activeTab)
    }
    return leads
  }, [leads, activeTab])

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length }
    for (const lead of leads) {
      counts[lead.status] = (counts[lead.status] || 0) + 1
    }
    return counts
  }, [leads])

  const handleAddLead = (newLead: Lead) => {
    createLeadMutation.mutate(newLead)
    setShowAddDrawer(false)
  }

  const handleStartConvert = (lead: Lead) => {
    setLeadToConvert(lead)
    setSelectedLead(null)
    setShowAddMemberDrawer(true)
  }

  const handleAddMemberFromLead = (newMember: Member, newMembership: Membership) => {
    // 1. Create the member
    createMemberMutation.mutate({ member: newMember, membership: newMembership })

    // 2. Update the lead status to converted
    if (leadToConvert) {
      updateLeadMutation.mutate({
        ...leadToConvert,
        status: 'converted',
        converted_member_id: newMember.id,
        converted_at: new Date().toISOString(),
      })
    }

    // 3. Clear convert flow states
    setLeadToConvert(null)
    setShowAddMemberDrawer(false)
  }

  const searchFilter = (lead: Lead, query: string) => {
    const name = `${lead.first_name} ${lead.last_name || ''}`.toLowerCase()
    return name.includes(query) || lead.phone.includes(query) || (lead.email || '').toLowerCase().includes(query)
  }

  // Define Columns for generic DataTable
  const columns: ColumnDef<Lead>[] = [
    {
      key: 'first_name',
      header: 'Name',
      sortable: true,
      render: (lead) => (
        <div className="flex items-center gap-3">
          <div className="avatar avatar-sm">
            {lead.first_name[0]}{(lead.last_name || '')[0] || ''}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>
              {lead.first_name} {lead.last_name || ''}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              {lead.age_range && `${lead.age_range} yrs`}
              {lead.gender && ` · ${lead.gender === 'male' ? '♂' : '♀'}`}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Contact',
      render: (lead) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1" style={{ fontSize: '0.8125rem' }}>
            <Phone size={12} style={{ color: 'var(--text-tertiary)' }} />
            {formatPhone(lead.phone)}
          </div>
          {lead.email && (
            <div className="flex items-center gap-1" style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              <Mail size={12} />
              {lead.email}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      sortable: true,
      render: (lead) => (
        <span className={`badge ${sourceBadgeClass[lead.source]}`}>
          {sourceLabels[lead.source]}
        </span>
      ),
    },
    {
      key: 'interest',
      header: 'Interest',
      render: (lead) => (
        <span className="truncate" style={{ maxWidth: '150px', display: 'inline-block', fontSize: '0.8125rem' }}>
          {lead.interest || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (lead) => (
        <span className={`badge ${statusBadgeClass[lead.status]}`}>
          {statusLabels[lead.status]}
        </span>
      ),
    },
    {
      key: 'next_followup_at',
      header: 'Next Follow-up',
      render: (lead) => {
        const isOverdue = lead.next_followup_at && new Date(lead.next_followup_at) < new Date()
        return lead.next_followup_at ? (
          <div className="flex items-center gap-1" style={{
            fontSize: '0.8125rem',
            color: isOverdue ? 'var(--danger-600)' : 'var(--text-secondary)',
            fontWeight: isOverdue ? 600 : 400,
          }}>
            <Calendar size={13} />
            {formatDate(lead.next_followup_at, 'short')}
            {isOverdue && (
              <span style={{ fontSize: '0.6875rem', color: 'var(--danger-600)', fontWeight: 600 }}>Overdue</span>
            )}
          </div>
        ) : (
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>—</span>
        )
      },
    },
  ]

  return (
    <div className="page-enter">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="page-subtitle">
            Track prospects from enquiry to conversion
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddDrawer(true)}>
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid-stats" style={{ marginBottom: '1.25rem' }}>
        <div className="stat-card" style={{ cursor: 'default' }}>
          <div className="stat-card-value" style={{ fontSize: '1.5rem' }}>{leads.length}</div>
          <div className="stat-card-label">Total Leads</div>
        </div>
        <div className="stat-card" style={{ cursor: 'default' }}>
          <div className="stat-card-value" style={{ fontSize: '1.5rem', color: 'var(--primary-600)' }}>
            {leads.filter((l) => l.status === 'new' || l.status === 'contacted' || l.status === 'follow_up').length}
          </div>
          <div className="stat-card-label">Active Leads</div>
        </div>
        <div className="stat-card" style={{ cursor: 'default' }}>
          <div className="stat-card-value" style={{ fontSize: '1.5rem', color: 'var(--success-600)' }}>
            {leads.filter((l) => l.status === 'converted').length}
          </div>
          <div className="stat-card-label">Converted</div>
        </div>
        <div className="stat-card" style={{ cursor: 'default' }}>
          <div className="stat-card-value" style={{ fontSize: '1.5rem', color: 'var(--warning-600)' }}>
            {leads.filter((l) => l.status === 'trial').length}
          </div>
          <div className="stat-card-label">On Trial</div>
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
        <DataTable<Lead>
          data={tabFilteredLeads}
          columns={columns}
          searchPlaceholder="Search by name, phone, email..."
          searchField={searchFilter}
          isLoading={leadsLoading}
          onRowClick={(row) => setSelectedLead(row)}
          emptyState={{
            title: 'No leads found',
            message: 'Try adjusting your filters or add a new lead.',
            icon: <Target size={36} style={{ color: 'var(--text-tertiary)' }} />,
            actionButton: (
              <button className="btn btn-primary" onClick={() => setShowAddDrawer(true)}>
                <Plus size={18} />
                Add Your First Lead
              </button>
            )
          }}
        />
      </div>

      {/* Add Lead Drawer */}
      {showAddDrawer && (
        <AddLeadDrawer
          onClose={() => setShowAddDrawer(false)}
          onSubmit={handleAddLead}
        />
      )}

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <LeadDetailDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onConvert={handleStartConvert}
        />
      )}

      {/* Convert Lead to Member Drawer wrapper */}
      {showAddMemberDrawer && leadToConvert && (
        <AddMemberDrawer
          onClose={() => {
            setLeadToConvert(null)
            setShowAddMemberDrawer(false)
          }}
          onSubmit={handleAddMemberFromLead}
          existingMembersCount={members.length}
          prefillLead={leadToConvert}
        />
      )}
    </div>
  )
}
