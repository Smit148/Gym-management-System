import { useMockDbStore } from '@/lib/mock-db'
import { sleep } from '@/lib/utils'
import type { GymSettings } from '@/types'

export const settingsApi = {
  getSettings: async (): Promise<GymSettings> => {
    await sleep(200)
    return useMockDbStore.getState().settings
  },

  updateSettings: async (settings: GymSettings): Promise<GymSettings> => {
    await sleep(250)
    useMockDbStore.getState().updateSettings(settings)
    return settings
  },
}
