import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { whatsappApi } from '../api/whatsapp.api'
import type { WhatsAppTemplate, WhatsAppReminder } from '@/types'

export function useWhatsAppTemplates() {
  return useQuery({
    queryKey: ['whatsappTemplates'],
    queryFn: whatsappApi.getTemplates,
  })
}

export function useWhatsAppReminders() {
  return useQuery({
    queryKey: ['whatsappReminders'],
    queryFn: whatsappApi.getReminders,
  })
}

export function useCreateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (template: WhatsAppTemplate) => whatsappApi.createTemplate(template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsappTemplates'] })
    },
  })
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (template: WhatsAppTemplate) => whatsappApi.updateTemplate(template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsappTemplates'] })
    },
  })
}

export function useSendReminder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reminder: WhatsAppReminder) => whatsappApi.sendReminder(reminder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsappReminders'] })
      queryClient.invalidateQueries({ queryKey: ['activityEvents'] })
    },
  })
}

export function useCancelReminder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reminderId: string) => whatsappApi.cancelReminder(reminderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsappReminders'] })
    },
  })
}
