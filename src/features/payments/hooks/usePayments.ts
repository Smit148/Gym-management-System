import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paymentsApi } from '../api/payments.api'
import { queryKeys } from '@/lib/query-keys'
import type { Payment } from '@/types'

export function usePayments() {
  return useQuery({
    queryKey: queryKeys.payments.all,
    queryFn: paymentsApi.getPayments,
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payment: Payment) => paymentsApi.createPayment(payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.all })
      // Invalidating members is important as payment updates statuses
      queryClient.invalidateQueries({ queryKey: queryKeys.members.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.activityEvents.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    },
  })
}
