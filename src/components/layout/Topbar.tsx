import { useState, useRef, useEffect } from 'react'
import { Menu, Bell, BellOff } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { getInitials } from '@/lib/utils'

export function Topbar() {
  const { toggleSidebar } = useUIStore()
  const { user } = useAuthStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClick)
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showNotifications])

  return (
    <header className="app-topbar">
      {/* Mobile menu toggle */}
      <button
        className="btn btn-ghost btn-icon"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        style={{ marginRight: '0.75rem' }}
      >
        <Menu size={20} />
      </button>

      {/* Page breadcrumb or search can go here */}
      <div style={{ flex: 1 }} />

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost btn-icon"
            aria-label="Notifications"
            style={{ position: 'relative' }}
            onClick={() => setShowNotifications(!showNotifications)}
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

        {/* User avatar */}
        {user && (
          <div className="avatar avatar-sm" title={`${user.first_name} ${user.last_name}`}>
            {getInitials(user.first_name, user.last_name)}
          </div>
        )}
      </div>
    </header>
  )
}
