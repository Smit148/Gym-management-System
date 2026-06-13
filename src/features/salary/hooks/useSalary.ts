import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { salaryApi } from '../api/salary.api'
import type { SalaryRecord } from '@/types'

export function useSalaryRecords() {
  return useQuery({
    queryKey: ['salaryRecords'],
    queryFn: salaryApi.getSalaryRecords,
  })
}

export function useCreateSalaryRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (record: SalaryRecord) => salaryApi.createSalaryRecord(record),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaryRecords'] })
      queryClient.invalidateQueries({ queryKey: ['activityEvents'] })
    },
  })
}

export function useMarkSalaryPaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      recordId,
      paidAmount,
      paymentMethod,
    }: {
      recordId: string
      paidAmount: number
      paymentMethod: SalaryRecord['payment_method']
    }) => salaryApi.markAsPaid(recordId, paidAmount, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaryRecords'] })
      queryClient.invalidateQueries({ queryKey: ['activityEvents'] })
    },
  })
}
