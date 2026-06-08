import { useMockDbStore } from '@/lib/mock-db'
import { sleep } from '@/lib/utils'
import type { Payment } from '@/types'

export const paymentsApi = {
  getPayments: async (): Promise<Payment[]> => {
    await sleep(200)
    return useMockDbStore.getState().payments
  },

  createPayment: async (payment: Payment): Promise<Payment> => {
    await sleep(250)
    useMockDbStore.getState().addPayment(payment)
    // Return the updated payment, which now has a receipt number generated inside the store
    const updatedPayments = useMockDbStore.getState().payments
    return updatedPayments[0] || payment
  },
}
