import { Navigate, type RouteObject } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/pages/auth/LoginPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { LeadsPage } from '@/pages/leads/LeadsPage'
import { MembersPage } from '@/pages/members/MembersPage'
import { ReportsPage } from '@/pages/reports/ReportsPage'
import { PaymentsPage } from '@/pages/payments/PaymentsPage'
import { ExpensesPage } from '@/pages/expenses/ExpensesPage'
import { AttendancePage } from '@/pages/attendance/AttendancePage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { TasksPage } from '@/pages/tasks/TasksPage'
import { StaffPage } from '@/pages/staff/StaffPage'
import { SalaryPage } from '@/pages/salary/SalaryPage'
import { WhatsAppPage } from '@/pages/whatsapp/WhatsAppPage'
import { useAuthStore } from '@/store/auth.store'

// Auth guard wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

export const routes: RouteObject[] = [
  // Public routes
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },

  // Protected routes — inside AppShell
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'leads', element: <LeadsPage /> },
      { path: 'members', element: <MembersPage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'payments', element: <PaymentsPage /> },
      { path: 'expenses', element: <ExpensesPage /> },
      { path: 'staff', element: <StaffPage /> },
      { path: 'salary', element: <SalaryPage /> },
      { path: 'whatsapp', element: <WhatsAppPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },

  // Catch-all redirect
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]
