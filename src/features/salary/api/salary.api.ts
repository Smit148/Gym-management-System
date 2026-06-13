import { useMockDbStore } from '@/lib/mock-db'
import { sleep } from '@/lib/utils'
import type { SalaryRecord } from '@/types'

export const salaryApi = {
  getSalaryRecords: async (): Promise<SalaryRecord[]> => {
    await sleep(200)
    return useMockDbStore.getState().salaryRecords
  },

  createSalaryRecord: async (record: SalaryRecord): Promise<SalaryRecord> => {
    await sleep(300)
    useMockDbStore.getState().addSalaryRecord(record)
    return record
  },

  updateSalaryRecord: async (record: SalaryRecord): Promise<SalaryRecord> => {
    await sleep(250)
    useMockDbStore.getState().updateSalaryRecord(record)
    return record
  },

  markAsPaid: async (
    recordId: string,
    paidAmount: number,
    paymentMethod: SalaryRecord['payment_method']
  ): Promise<void> => {
    await sleep(300)
    useMockDbStore.getState().markSalaryAsPaid(recordId, paidAmount, paymentMethod)
  },
}
