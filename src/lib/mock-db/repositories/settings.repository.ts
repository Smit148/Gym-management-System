import type { GymSettings } from '@/types'

export const SettingsRepository = {
  updateSettings: (
    _state: { settings: GymSettings },
    settings: GymSettings
  ) => {
    return {
      settings,
    }
  },
}
