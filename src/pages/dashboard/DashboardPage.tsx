import {
  Users,
  TrendingUp,
  AlertTriangle,
  PhoneCall,
  UserPlus,
  CreditCard,
  ClipboardCheck,
  Target,
  Award,
  UserPlus as UserPlusIcon,
  Loader2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useDashboardData } from '@/features/dashboard/hooks/useDashboard'

export function DashboardPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useDashboardData()

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
          role="button"
          tabIndex={0}
          aria-label="View attendance"
        >
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
          role="button"
          tabIndex={0}
          aria-label="View payments"
        >
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
          role="button"
          tabIndex={0}
          aria-label="View expiring memberships"
        >
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

        {/* Card 4: Follow-Ups Due Today */}
        <div
          className="stat-card"
          onClick={() => navigate('/leads?filter=followup')}
          role="button"
          tabIndex={0}
          aria-label="View follow-ups"
        >
          <div
            className="stat-card-icon"
            style={{ background: '#FDF4FF', color: '#9333EA' }}
          >
            <PhoneCall size={20} />
          </div>
          <div className="stat-card-value">
            {stats.followups_due_today + stats.tasks_due_today}
          </div>
          <div className="stat-card-label">Follow-Ups Due Today</div>
          <div className="stat-card-sublabel">
            {stats.followups_due_today} leads · {stats.tasks_due_today} tasks
          </div>
        </div>

        {/* Card 5: New Enquiries */}
        <div
          className="stat-card"
          onClick={() => navigate('/leads')}
          role="button"
          tabIndex={0}
          aria-label="View leads"
        >
          <div
            className="stat-card-icon"
            style={{ background: 'var(--info-50)', color: 'var(--info-600)' }}
          >
            <UserPlus size={20} />
          </div>
          <div className="stat-card-value">{stats.new_enquiries_week}</div>
          <div className="stat-card-label">New Enquiries</div>
          <div className="stat-card-sublabel">{stats.conversion_rate}% conversion rate</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '1.5rem' }}>
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
        </div>
      </div>

      {/* Bottom Section: 7-Day Trend + Referral Leaderboard + Activity Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
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
              No referral data logged yet.
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
              No recent activity events.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
