import type { SalaryRecord, ActivityEvent } from '@/types'

export const SalaryRepository = {
  addSalaryRecord: (
    state: { salaryRecords: SalaryRecord[]; activityEvents: ActivityEvent[] },
    record: SalaryRecord
  ) => {
    const newEvent: ActivityEvent = {
      id: `evt_${Date.now()}`,
      entity_type: 'expense' as const,
      entity_id: record.id,
      event_name: 'expense_recorded' as const,
      timestamp: new Date().toISOString(),
      title: 'Salary Recorded',
      description: `Salary entry created for ${record.staff_name || 'staff'} — ₹${record.amount} (${record.month}).`,
    }
    return {
      salaryRecords: [record, ...state.salaryRecords],
      activityEvents: [newEvent, ...state.activityEvents],
    }
  },

  updateSalaryRecord: (
    state: { salaryRecords: SalaryRecord[] },
    record: SalaryRecord
  ) => ({
    salaryRecords: state.salaryRecords.map((s) => (s.id === record.id ? record : s)),
  }),

  markAsPaid: (
    state: { salaryRecords: SalaryRecord[]; activityEvents: ActivityEvent[] },
    recordId: string,
    paidAmount: number,
    paymentMethod: SalaryRecord['payment_method']
  ) => {
    const record = state.salaryRecords.find((s) => s.id === recordId)
    if (!record) return {}

    const totalPaid = record.paid_amount + paidAmount
    const newStatus = totalPaid >= record.amount ? 'paid' as const : 'partial' as const

    const newEvent: ActivityEvent = {
      id: `evt_${Date.now()}`,
      entity_type: 'expense' as const,
      entity_id: recordId,
      event_name: 'expense_recorded' as const,
      timestamp: new Date().toISOString(),
      title: 'Salary Paid',
      description: `Paid ₹${paidAmount} to ${record.staff_name || 'staff'} for ${record.month}.`,
    }

    return {
      salaryRecords: state.salaryRecords.map((s) =>
        s.id === recordId
          ? {
              ...s,
              paid_amount: totalPaid,
              status: newStatus,
              paid_at: new Date().toISOString(),
              payment_method: paymentMethod,
              updated_at: new Date().toISOString(),
            }
          : s
      ),
      activityEvents: [newEvent, ...state.activityEvents],
    }
  },
}
