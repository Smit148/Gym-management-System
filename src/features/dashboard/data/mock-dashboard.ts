import type {
  DashboardStats,
  TopReferrer,
  ActivityItem,
} from '@/types'

// ---- Mock Dashboard Data ----

export const mockDashboardStats: DashboardStats = {
  members_present_today: 38,
  total_active_members: 156,
  revenue_today: 12500,
  expenses_today: 3200,
  net_income_today: 9300,
  expiring_this_week: 8,
  followups_due_today: 5,
  tasks_due_today: 3,
  new_enquiries_week: 12,
  conversion_rate: 40,
}

export const mockTopReferrers: TopReferrer[] = [
  { member_id: '1', member_name: 'Rahul Sharma', referral_count: 5, converted_count: 3, conversion_rate: 60 },
  { member_id: '2', member_name: 'Priya Patel', referral_count: 4, converted_count: 2, conversion_rate: 50 },
  { member_id: '3', member_name: 'Amit Kumar', referral_count: 3, converted_count: 2, conversion_rate: 67 },
  { member_id: '4', member_name: 'Sneha Reddy', referral_count: 2, converted_count: 1, conversion_rate: 50 },
  { member_id: '5', member_name: 'Vikram Singh', referral_count: 2, converted_count: 1, conversion_rate: 50 },
]

export const mockRecentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'attendance_marked',
    title: 'Rahul Sharma checked in',
    description: 'Manual check-in',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    color: 'var(--success-500)',
  },
  {
    id: '2',
    type: 'payment_received',
    title: 'Payment ₹2,500 from Priya Patel',
    description: 'Membership renewal via UPI',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    color: 'var(--primary-500)',
  },
  {
    id: '3',
    type: 'lead_added',
    title: 'New lead: Amit Kumar',
    description: 'Source: Instagram',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    color: 'var(--warning-500)',
  },
  {
    id: '4',
    type: 'membership_renewed',
    title: 'Membership renewed: Sneha Reddy',
    description: '3-month plan — ₹4,500',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    color: 'var(--success-500)',
  },
  {
    id: '5',
    type: 'expense_recorded',
    title: 'Expense: Electricity Bill',
    description: '₹3,200 recorded',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    color: 'var(--danger-500)',
  },
  {
    id: '6',
    type: 'lead_converted',
    title: 'Lead converted: Rohan Mehta',
    description: 'Joined with 6-month plan',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    color: 'var(--success-500)',
  },
  {
    id: '7',
    type: 'attendance_marked',
    title: 'Vikram Singh checked in',
    description: 'QR check-in',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    color: 'var(--success-500)',
  },
]
