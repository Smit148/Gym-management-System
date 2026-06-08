import type { Expense, ActivityEvent } from '@/types'

export const ExpensesRepository = {
  addExpense: (
    state: { expenses: Expense[]; activityEvents: ActivityEvent[] },
    expense: Expense
  ) => {
    const newEvent: ActivityEvent = {
      id: `evt_${Date.now()}`,
      entity_type: 'expense',
      entity_id: expense.id,
      event_name: 'expense_recorded',
      timestamp: new Date().toISOString(),
      title: 'Expense Recorded',
      description: `Recorded expense for ${expense.category.replace('_', ' ')}: ₹${expense.amount}.`,
      actor_id: expense.recorded_by,
    }
    return {
      expenses: [expense, ...state.expenses],
      activityEvents: [newEvent, ...state.activityEvents],
    }
  },
}
