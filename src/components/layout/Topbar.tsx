import { useState, useRef, useEffect } from 'react'
import { Menu, Bell, BellOff, Settings, LogOut, User, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { getInitials } from '@/lib/utils'

export function Topbar() {
  const navigate = useNavigate()
  const { toggleSidebar, sidebarCollapsed, toggleSidebarCollapse } = useUIStore()
  const { user, logout } = useAuthStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setShowAccountMenu(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNotifications(false)
        setShowAccountMenu(false)
      }
    }
    if (showNotifications || showAccountMenu) {
      document.addEventListener('mousedown', handleClick)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showNotifications, showAccountMenu])

  return (
    <header className="app-topbar">
      {/* Mobile menu toggle */}
      <button
        className="btn btn-ghost btn-icon mobile-menu-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        style={{ marginRight: '0.75rem' }}
      >
        <Menu size={20} />
      </button>

      {/* Desktop collapse toggle */}
      <button
        className="btn btn-ghost btn-icon desktop-collapse-toggle"
        onClick={toggleSidebarCollapse}
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        style={{ marginRight: '0.5rem' }}
      >
        {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
      </button>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost btn-icon"
            aria-label="Notifications"
            style={{ position: 'relative' }}
            onClick={() => { setShowNotifications(!showNotifications); setShowAccountMenu(false) }}
          >
            <Bell size={20} />
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                background: 'var(--danger-500)',
                borderRadius: '50%',
                border: '2px solid var(--bg-primary)',
              }}
            />
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              marginTop: '0.5rem',
              width: '280px',
              maxWidth: 'calc(100vw - 2rem)',
              background: 'white',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 200,
              overflow: 'hidden',
              animation: 'slideUp 0.2s ease',
            }}>
              <div style={{
                padding: '0.875rem 1rem',
                borderBottom: '1px solid var(--border-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Notifications
                </span>
                <span className="badge badge-new" style={{ fontSize: '0.625rem' }}>Coming Soon</span>
              </div>
              <div style={{
                padding: '2rem 1rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <BellOff size={28} style={{ color: 'var(--text-tertiary)' }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  No new notifications
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                  Push notifications will appear here when enabled.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User avatar + Account Dropdown */}
        {user && (
          <div ref={accountRef} style={{ position: 'relative' }}>
            <button
              className="avatar avatar-sm"
              onClick={() => { setShowAccountMenu(!showAccountMenu); setShowNotifications(false) }}
              style={{ cursor: 'pointer', border: showAccountMenu ? '2px solid var(--primary-500)' : '2px solid transparent', transition: 'border-color 0.15s ease' }}
              title={`${user.first_name} ${user.last_name}`}
              aria-label={`Account menu for ${user.first_name} ${user.last_name}`}
              aria-expanded={showAccountMenu}
              aria-haspopup="true"
            >
              {getInitials(user.first_name, user.last_name)}
            </button>

            {/* Account Dropdown */}
            {showAccountMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: '0.5rem',
                width: '240px',
                maxWidth: 'calc(100vw - 2rem)',
                background: 'white',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 200,
                overflow: 'hidden',
                animation: 'slideUp 0.2s ease',
              }}>
                {/* User header */}
                <div style={{
                  padding: '1rem',
                  borderBottom: '1px solid var(--border-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                  <div className="avatar avatar-sm" style={{ flexShrink: 0 }}>
                    {getInitials(user.first_name, user.last_name)}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.first_name} {user.last_name}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div style={{ padding: '0.375rem' }}>
                  <button
                    onClick={() => { navigate('/settings'); setShowAccountMenu(false) }}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.8125rem',
                      textAlign: 'left',
                      border: 'none',
                      background: 'none',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-50)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <User size={15} style={{ color: 'var(--text-secondary)' }} />
                    My Profile
                  </button>
                  <button
                    onClick={() => { navigate('/settings'); setShowAccountMenu(false) }}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.8125rem',
                      textAlign: 'left',
                      border: 'none',
                      background: 'none',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-50)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <Settings size={15} style={{ color: 'var(--text-secondary)' }} />
                    Settings
                  </button>
                </div>

                <div style={{ borderTop: '1px solid var(--border-secondary)', padding: '0.375rem' }}>
                  <button
                    onClick={() => { logout(); setShowAccountMenu(false) }}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.8125rem',
                      textAlign: 'left',
                      border: 'none',
                      background: 'none',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--danger-600)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--danger-50)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
