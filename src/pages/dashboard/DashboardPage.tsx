import {
  Users,
  TrendingUp,
  AlertTriangle,
  Target,
  CreditCard,
  ClipboardCheck,
  ListTodo,
  Award,
  UserPlus as UserPlusIcon,
  ArrowUpFromLine,
  Loader2,
  ChevronRight,
  RefreshCw,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useDashboardData } from '@/features/dashboard/hooks/useDashboard'

export function DashboardPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useDashboardData()

  if (isLoading || !data) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        gap: '1rem',
        color: 'var(--text-secondary)'
      }}>
        <Loader2 size={36} className="animate-spin" style={{ color: 'var(--primary-500)' }} />
        <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>Recalculating dashboard metrics...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        gap: '1rem',
        textAlign: 'center'
      }}>
        <div style={{
          width: '56px', height: '56px', background: 'var(--danger-50)', borderRadius: 'var(--radius-full)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem'
        }}>
          <AlertTriangle size={28} style={{ color: 'var(--danger-600)' }} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Failed to load dashboard data</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px' }}>
          We encountered an issue retrieving your gym's data. Please check your connection or try again.
        </p>
        <button className="btn btn-primary" onClick={() => refetch()}>
          <RefreshCw size={16} />
          Retry Connection
        </button>
      </div>
    )
  }

  const { stats, referrers, activities, attendanceTrend } = data

  return (
    <div className="page-enter">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>

      {/* Today's Snapshot — 5 Stat Cards */}
      <div className="grid-stats" style={{ marginBottom: '1.5rem' }}>
        {/* Card 1: Members Present */}
        <div
          className="stat-card"
          onClick={() => navigate('/attendance')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/attendance'); } }}
          role="button"
          tabIndex={0}
          aria-label="View attendance"
        >
          <ChevronRight size={18} className="stat-chevron" />
          <div
            className="stat-card-icon"
            style={{ background: 'var(--success-50)', color: 'var(--success-600)' }}
          >
            <Users size={20} />
          </div>
          <div className="stat-card-value">{stats.members_present_today}</div>
          <div className="stat-card-label">Members Present</div>
          <div className="stat-card-sublabel">of {stats.total_active_members} active</div>
        </div>

        {/* Card 2: Net Income */}
        <div
          className="stat-card"
          onClick={() => navigate('/payments')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/payments'); } }}
          role="button"
          tabIndex={0}
          aria-label="View payments"
        >
          <ChevronRight size={18} className="stat-chevron" />
          <div
            className="stat-card-icon"
            style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}
          >
            <TrendingUp size={20} />
          </div>
          <div className="stat-card-value">{formatCurrency(stats.net_income_today)}</div>
          <div className="stat-card-label">Net Income Today</div>
          <div className="stat-card-sublabel">
            {formatCurrency(stats.revenue_today)} revenue − {formatCurrency(stats.expenses_today)} expenses
          </div>
        </div>

        {/* Card 3: Expiring This Week */}
        <div
          className="stat-card"
          onClick={() => navigate('/members?filter=expiring')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/members?filter=expiring'); } }}
          role="button"
          tabIndex={0}
          aria-label="View expiring memberships"
        >
          <ChevronRight size={18} className="stat-chevron" />
          <div
            className="stat-card-icon"
            style={{ background: 'var(--warning-50)', color: 'var(--warning-600)' }}
          >
            <AlertTriangle size={20} />
          </div>
          <div
            className="stat-card-value"
            style={{ color: stats.expiring_this_week > 5 ? 'var(--warning-600)' : undefined }}
          >
            {stats.expiring_this_week}
          </div>
          <div className="stat-card-label">Expiring This Week</div>
          <div className="stat-card-sublabel">
            {stats.expiring_this_week > 5 ? '⚠️ Needs attention' : 'Renewals pending'}
          </div>
        </div>

        {/* Card 4: Leads Overview */}
        <div
          className="stat-card"
          onClick={() => navigate('/leads')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/leads'); } }}
          role="button"
          tabIndex={0}
          aria-label="View leads"
        >
          <ChevronRight size={18} className="stat-chevron" />
          <div
            className="stat-card-icon"
            style={{ background: '#FDF4FF', color: '#9333EA' }}
          >
            <Target size={20} />
          </div>
          <div className="stat-card-value">
            {stats.new_enquiries_week + stats.followups_due_today}
          </div>
          <div className="stat-card-label">Active Leads</div>
          <div className="stat-card-sublabel">
            {stats.followups_due_today} follow-ups due · {stats.new_enquiries_week} new this week
          </div>
        </div>

        {/* Card 5: Pending Tasks */}
        <div
          className="stat-card"
          onClick={() => navigate('/tasks')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/tasks'); } }}
          role="button"
          tabIndex={0}
          aria-label="View tasks"
        >
          <ChevronRight size={18} className="stat-chevron" />
          <div
            className="stat-card-icon"
            style={{ background: 'var(--info-50)', color: 'var(--info-600)' }}
          >
            <ListTodo size={20} />
          </div>
          <div className="stat-card-value">{stats.tasks_due_today}</div>
          <div className="stat-card-label">Pending Tasks</div>
          <div className="stat-card-sublabel">Due today · {stats.conversion_rate}% lead conversion</div>
        </div>
      </div>

      {/* Needs Attention Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          Needs Attention
        </h2>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {stats.expiring_this_week > 0 && (
            <div
              className="alert-panel alert-panel-warning"
              onClick={() => navigate('/members?filter=expiring')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/members?filter=expiring'); } }}
              role="button"
              tabIndex={0}
              aria-label={`${stats.expiring_this_week} memberships expiring this week. Click to view.`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertTriangle size={20} />
                <span><strong>{stats.expiring_this_week} memberships</strong> expiring this week</span>
              </div>
              <ChevronRight size={18} style={{ opacity: 0.6 }} />
            </div>
          )}
          {stats.followups_due_today > 0 && (
            <div
              className="alert-panel alert-panel-info"
              onClick={() => navigate('/leads')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/leads'); } }}
              role="button"
              tabIndex={0}
              aria-label={`${stats.followups_due_today} lead follow-ups due today. Click to view.`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Target size={20} />
                <span><strong>{stats.followups_due_today} lead follow-ups</strong> due today</span>
              </div>
              <ChevronRight size={18} style={{ opacity: 0.6 }} />
            </div>
          )}
          {stats.tasks_due_today > 0 && (
            <div
              className="alert-panel alert-panel-info"
              onClick={() => navigate('/tasks')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/tasks'); } }}
              role="button"
              tabIndex={0}
              aria-label={`${stats.tasks_due_today} tasks due today. Click to view.`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ListTodo size={20} />
                <span><strong>{stats.tasks_due_today} tasks</strong> due today</span>
              </div>
              <ChevronRight size={18} style={{ opacity: 0.6 }} />
            </div>
          )}

          {stats.expiring_this_week === 0 && stats.followups_due_today === 0 && stats.tasks_due_today === 0 && (
            <div className="alert-panel alert-panel-success" style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ClipboardCheck size={20} />
                <span>You're all caught up! Nothing needs immediate attention right now.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          Quick Actions
        </h2>
        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => navigate('/members')}>
            <UserPlusIcon size={18} className="quick-action-btn-icon" />
            <span>Add Member</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/payments')}>
            <CreditCard size={18} className="quick-action-btn-icon" />
            <span>Record Payment</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/attendance')}>
            <ClipboardCheck size={18} className="quick-action-btn-icon" />
            <span>Mark Attendance</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/leads')}>
            <Target size={18} className="quick-action-btn-icon" />
            <span>Add Lead</span>
          </button>
          <button className="quick-action-btn" onClick={() => navigate('/expenses')}>
            <ArrowUpFromLine size={18} className="quick-action-btn-icon" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Bottom Section: 7-Day Trend + Referral Leaderboard + Activity Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Widget 1: 7-Day Attendance Trend */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '1.25rem' }}>
            <ClipboardCheck size={18} style={{ color: 'var(--success-500)' }} />
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>7-Day Footfall Trend</h3>
          </div>

          <div style={{
            height: '150px',
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            padding: '0 0.5rem',
            borderBottom: '1px solid var(--border-primary)',
            marginBottom: '0.75rem'
          }}>
            {attendanceTrend.map((t, idx) => {
              const maxCount = Math.max(...attendanceTrend.map(d => d.count), 5)
              const heightPct = (t.count / maxCount) * 100
              const isToday = idx === attendanceTrend.length - 1
              return (
                <div key={t.date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <span style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 600 }}>
                    {t.count}
                  </span>
                  <div
                    style={{
                      width: '16px',
                      height: `${heightPct * 0.9}%`,
                      background: isToday ? 'var(--success-600)' : 'var(--primary-400)',
                      borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                      minHeight: t.count > 0 ? '4px' : '1px'
                    }}
                    title={`${t.label}: ${t.count} members`}
                  />
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: isToday ? 600 : 400 }}>
                    {t.label}
                  </span>
                </div>
              )
            })}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 'auto' }}>
            Daily check-in counts over the past week.
          </div>
        </div>

        {/* Widget 2: Referral Leaderboard */}
        <div className="card" style={{ height: '100%' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
            <Award size={18} style={{ color: 'var(--warning-500)' }} />
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Top Referrers</h3>
          </div>

          {referrers.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {referrers.map((referrer, index) => (
                <div
                  key={referrer.member_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem 0',
                    borderBottom: index < referrers.length - 1 ? '1px solid var(--border-secondary)' : 'none',
                  }}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: 'var(--radius-full)',
                      background: index < 3 ? 'var(--warning-100)' : 'var(--gray-100)',
                      color: index < 3 ? 'var(--warning-700)' : 'var(--gray-500)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }} className="truncate">
                      {referrer.member_name}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {referrer.referral_count}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--success-600)' }}>
                      {referrer.converted_count} converted
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>No referral data yet.</p>
              <p>Add a referral source when creating new leads to track top referrers.</p>
            </div>
          )}

          {referrers.length > 0 && (
            <div style={{
              marginTop: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-primary)',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
            }}>
              <span>Overall Conversion</span>
              <span style={{ fontWeight: 600, color: 'var(--success-600)' }}>
                {Math.round(
                  referrers.reduce((sum, r) => sum + r.converted_count, 0) /
                  referrers.reduce((sum, r) => sum + r.referral_count, 0) * 100
                )}%
              </span>
            </div>
          )}
        </div>

        {/* Widget 3: Recent Activity */}
        <div className="card" style={{ height: '100%' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            Recent Activity
          </h3>

          {activities.length > 0 ? (
            <div className="activity-feed">
              {activities.map((item) => (
                <div key={item.id} className="activity-item">
                  <div className="activity-dot" style={{ background: item.color }} />
                  <div className="activity-content">
                    <div className="activity-text">{item.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                      {item.description}
                    </div>
                    <div className="activity-time">{formatDate(item.timestamp, 'relative')}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>No recent activity.</p>
              <p>Key actions like adding members or receiving payments will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
