import { useMockDbStore } from '@/lib/mock-db'
import { sleep } from '@/lib/utils'
import type { Attendance } from '@/types'

export const attendanceApi = {
  getAttendanceLogs: async (): Promise<Attendance[]> => {
    await sleep(200)
    return useMockDbStore.getState().attendance
  },

  checkIn: async (checkIn: Attendance): Promise<Attendance> => {
    await sleep(250)
    useMockDbStore.getState().checkInMember(checkIn)
    return checkIn
  },

  checkOut: async (id: string, checkOutTime: string): Promise<void> => {
    await sleep(200)
    useMockDbStore.getState().checkOutMember(id, checkOutTime)
  },
}
