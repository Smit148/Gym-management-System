import { Users, ClipboardCheck, CreditCard, ArrowUpFromLine, BarChart3 } from 'lucide-react'

interface PlaceholderProps {
  title: string
  subtitle: string
  icon: React.ReactNode
}

function PlaceholderPage({ title, subtitle, icon }: PlaceholderProps) {
  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--primary-50)',
          color: 'var(--primary-500)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
        }}>
          {icon}
        </div>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          {title} Module
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto' }}>
          {subtitle}. This module is being built and will be available soon.
        </p>
        <div style={{
          marginTop: '1.5rem',
          padding: '0.75rem 1.25rem',
          background: 'var(--gray-50)',
          borderRadius: 'var(--radius-lg)',
          display: 'inline-block',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
        }}>
          🚧 Under Construction
        </div>
      </div>
    </div>
  )
}

export function MembersPage() {
  return <PlaceholderPage title="Members" subtitle="Manage your gym members, plans, and renewals" icon={<Users size={28} />} />
}

export function AttendancePage() {
  return <PlaceholderPage title="Attendance" subtitle="Mark and track daily gym attendance" icon={<ClipboardCheck size={28} />} />
}

export function PaymentsPage() {
  return <PlaceholderPage title="Payments" subtitle="Record payments and track revenue" icon={<CreditCard size={28} />} />
}

export function ExpensesPage() {
  return <PlaceholderPage title="Expenses" subtitle="Track gym expenses and monitor profit" icon={<ArrowUpFromLine size={28} />} />
}

export function ReportsPage() {
  return <PlaceholderPage title="Reports" subtitle="Revenue, member, and lead analytics" icon={<BarChart3 size={28} />} />
}
