import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { expensesApi } from '../api/expenses.api'
import { queryKeys } from '@/lib/query-keys'
import type { Expense } from '@/types'

export function useExpenses() {
  return useQuery({
    queryKey: queryKeys.expenses.all,
    queryFn: expensesApi.getExpenses,
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (expense: Expense) => expensesApi.createExpense(expense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.activityEvents.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
    },
  })
}
