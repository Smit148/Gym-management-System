import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme } from '@/types'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'blue',

      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme)
        set({ theme })
      },
    }),
    {
      name: 'gymos-theme',
      onRehydrateStorage: () => {
        return (state) => {
          // Apply theme on page load
          if (state?.theme) {
            document.documentElement.setAttribute('data-theme', state.theme)
          }
        }
      },
    }
  )
)
