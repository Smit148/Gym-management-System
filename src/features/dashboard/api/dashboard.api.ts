import { useMockDbStore } from '@/lib/mock-db'
import { sleep } from '@/lib/utils'
import { DashboardAggregator } from '../services/dashboard-aggregator'
import type { DashboardStats, TopReferrer, ActivityItem } from '@/types'

export interface DashboardPayload {
  stats: DashboardStats
  referrers: TopReferrer[]
  activities: ActivityItem[]
  attendanceTrend: { date: string; label: string; count: number }[]
}

export const dashboardApi = {
  getDashboardData: async (): Promise<DashboardPayload> => {
    await sleep(200)
    const state = useMockDbStore.getState()
    
    const stats = DashboardAggregator.getStats(
      state.members,
      state.memberships,
      state.leads,
      state.payments,
      state.expenses,
      state.activityEvents,
      state.attendance,
      state.tasks
    )

    const referrers = DashboardAggregator.getTopReferrers(state.members, state.leads)
    const activities = DashboardAggregator.getRecentActivities(state.activityEvents)
    const attendanceTrend = DashboardAggregator.getAttendanceTrend(state.attendance)

    return {
      stats,
      referrers,
      activities,
      attendanceTrend,
    }
  },
}
