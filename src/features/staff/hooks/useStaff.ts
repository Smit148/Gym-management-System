import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { staffApi } from '../api/staff.api'
import type { Staff } from '@/types'

export function useStaff() {
  return useQuery({
    queryKey: ['staff'],
    queryFn: staffApi.getStaff,
  })
}

export function useCreateStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (staff: Staff) => staffApi.createStaff(staff),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      queryClient.invalidateQueries({ queryKey: ['activityEvents'] })
    },
  })
}

export function useUpdateStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (staff: Staff) => staffApi.updateStaff(staff),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
    },
  })
}

export function useDeleteStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (staffId: string) => staffApi.deleteStaff(staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
    },
  })
}
