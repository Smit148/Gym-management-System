import { useMockDbStore } from '@/lib/mock-db'
import { sleep } from '@/lib/utils'
import type { Expense } from '@/types'

export const expensesApi = {
  getExpenses: async (): Promise<Expense[]> => {
    await sleep(200)
    return useMockDbStore.getState().expenses
  },

  createExpense: async (expense: Expense): Promise<Expense> => {
    await sleep(250)
    useMockDbStore.getState().addExpense(expense)
    return expense
  },
}
