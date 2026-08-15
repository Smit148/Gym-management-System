import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { GlobalConfirmDialog } from '@/components/ui/GlobalConfirmDialog'
import { useUIStore } from '@/store/ui.store'

export function AppShell() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <main id="main-content" className="app-content page-enter">
          <Outlet />
        </main>
      </div>
      <GlobalConfirmDialog />
    </div>
  )
}
