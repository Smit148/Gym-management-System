import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsApi } from '../api/settings.api'
import { queryKeys } from '@/lib/query-keys'
import type { GymSettings } from '@/types'

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings.all,
    queryFn: settingsApi.getSettings,
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (settings: GymSettings) => settingsApi.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all })
    },
  })
}
