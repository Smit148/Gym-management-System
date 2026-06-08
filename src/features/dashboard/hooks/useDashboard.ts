import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboard.api'
import { queryKeys } from '@/lib/query-keys'

export function useDashboardData() {
  return useQuery({
    queryKey: queryKeys.dashboard.all,
    queryFn: dashboardApi.getDashboardData,
  })
}
