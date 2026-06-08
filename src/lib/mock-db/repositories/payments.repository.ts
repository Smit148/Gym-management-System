import type { Payment, Membership, ActivityEvent } from '@/types'

export const PaymentsRepository = {
  addPayment: (
    state: { payments: Payment[]; memberships: Membership[]; activityEvents: ActivityEvent[]; receipt_sequence: number },
    payment: Payment
  ) => {
    const seq = state.receipt_sequence
    const receipt_number = `GYM-2026-${String(seq).padStart(4, '0')}`
    const fullPayment: Payment = {
      ...payment,
      receipt_number,
    }

    const newEvent: ActivityEvent = {
      id: `evt_${Date.now()}`,
      entity_type: 'payment',
      entity_id: payment.id,
      event_name: 'payment_received',
      timestamp: new Date().toISOString(),
      title: 'Payment Received',
      description: `Received ₹${payment.amount} from ${payment.member_name || 'Member'} via ${payment.payment_method.toUpperCase()}. Receipt: ${receipt_number}`,
    }

    // If membership_id is associated, check and update its payment status
    const updatedMemberships = state.memberships.map((m) => {
      if (m.id === payment.membership_id) {
        const netPayable = m.actual_price - m.discount_amount
        // Calculate total payments made for this membership
        const existingPayments = state.payments
          .filter((p) => p.membership_id === m.id)
          .reduce((sum, p) => sum + p.amount, 0)
        const totalPaid = existingPayments + payment.amount

        let payStatus: 'paid' | 'partial' | 'pending' = 'pending'
        if (totalPaid >= netPayable) {
          payStatus = 'paid'
        } else if (totalPaid > 0) {
          payStatus = 'partial'
        }

        return { ...m, payment_status: payStatus, updated_at: new Date().toISOString() }
      }
      return m
    })

    return {
      payments: [fullPayment, ...state.payments],
      memberships: updatedMemberships,
      activityEvents: [newEvent, ...state.activityEvents],
      receipt_sequence: seq + 1,
    }
  },
}
