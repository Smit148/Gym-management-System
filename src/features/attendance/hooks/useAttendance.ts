import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { attendanceApi } from '../api/attendance.api'
import { queryKeys } from '@/lib/query-keys'
import type { Attendance } from '@/types'

export function useAttendanceLogs() {
  return useQuery({
    queryKey: queryKeys.attendance.all,
    queryFn: attendanceApi.getAttendanceLogs,
  })
}

export function useCheckIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (checkIn: Attendance) => attendanceApi.checkIn(checkIn),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.activityEvents.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    },
  })
}

export function useCheckOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, checkOutTime }: { id: string; checkOutTime: string }) =>
      attendanceApi.checkOut(id, checkOutTime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.activityEvents.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    },
  })
}
