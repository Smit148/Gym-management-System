import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Target,
  Users,
  ClipboardCheck,
  CreditCard,
  ArrowUpFromLine,
  Dumbbell,
  ListTodo,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', section: 'main' },
  { label: 'Leads', icon: Target, path: '/leads', section: 'main', badge: undefined as string | number | undefined },
  { label: 'Members', icon: Users, path: '/members', section: 'main' },
  { label: 'Attendance', icon: ClipboardCheck, path: '/attendance', section: 'operations' },
  { label: 'Payments', icon: CreditCard, path: '/payments', section: 'operations' },
  { label: 'Expenses', icon: ArrowUpFromLine, path: '/expenses', section: 'operations' },
  { label: 'Trainers', icon: Dumbbell, path: '/trainers', section: 'team', badge: 'Soon' },
  { label: 'Tasks', icon: ListTodo, path: '/tasks', section: 'team' },
  { label: 'Reports', icon: BarChart3, path: '/reports', section: 'insights' },
  { label: 'Settings', icon: Settings, path: '/settings', section: 'system' },
]

const sectionLabels: Record<string, string> = {
  main: '',
  operations: 'Operations',
  team: 'Team',
  insights: 'Insights',
  system: 'System',
}

export function Sidebar() {
  const location = useLocation()
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const { logout, user } = useAuthStore()

  // Group items by section
  const sections = navItems.reduce<Record<string, typeof navItems>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {})

  const handleNavClick = () => {
    // Close sidebar on mobile after clicking a link
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">G</div>
          <span className="sidebar-logo-text">GymOS</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {Object.entries(sections).map(([section, items]) => (
            <div key={section}>
              {sectionLabels[section] && (
                <div className="sidebar-section-label">{sectionLabels[section]}</div>
              )}
              {items.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path ||
                  (item.path !== '/' && location.pathname.startsWith(item.path))

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={handleNavClick}
                  >
                    <Icon className="sidebar-link-icon" />
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className="sidebar-link-badge"
                        style={typeof item.badge === 'string' ? {
                          fontSize: '0.5625rem',
                          background: 'var(--gray-600)',
                          opacity: 0.7,
                          letterSpacing: '0.025em',
                        } : undefined}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer - User Info */}
        <div className="sidebar-footer">
          <button className="sidebar-link" onClick={logout}>
            <LogOut className="sidebar-link-icon" />
            <span>Logout</span>
          </button>
          {user && (
            <div style={{ padding: '0.5rem 0.75rem', marginTop: '0.25rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'white' }}>
                {user.first_name} {user.last_name}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--gray-400)' }}>
                {user.email}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
