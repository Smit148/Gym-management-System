import { useMockDbStore } from '@/lib/mock-db'
import { sleep } from '@/lib/utils'
import type { Staff } from '@/types'

export const staffApi = {
  getStaff: async (): Promise<Staff[]> => {
    await sleep(200)
    return useMockDbStore.getState().staff
  },

  createStaff: async (staff: Staff): Promise<Staff> => {
    await sleep(300)
    useMockDbStore.getState().addStaff(staff)
    return staff
  },

  updateStaff: async (staff: Staff): Promise<Staff> => {
    await sleep(250)
    useMockDbStore.getState().updateStaff(staff)
    return staff
  },

  deleteStaff: async (staffId: string): Promise<void> => {
    await sleep(250)
    useMockDbStore.getState().deleteStaff(staffId)
  },
}
