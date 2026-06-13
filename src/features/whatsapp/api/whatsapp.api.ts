import { useMockDbStore } from '@/lib/mock-db'
import { sleep } from '@/lib/utils'
import type { WhatsAppTemplate, WhatsAppReminder } from '@/types'

export const whatsappApi = {
  getTemplates: async (): Promise<WhatsAppTemplate[]> => {
    await sleep(200)
    return useMockDbStore.getState().whatsappTemplates
  },

  getReminders: async (): Promise<WhatsAppReminder[]> => {
    await sleep(200)
    return useMockDbStore.getState().whatsappReminders
  },

  createTemplate: async (template: WhatsAppTemplate): Promise<WhatsAppTemplate> => {
    await sleep(300)
    useMockDbStore.getState().addWhatsAppTemplate(template)
    return template
  },

  updateTemplate: async (template: WhatsAppTemplate): Promise<WhatsAppTemplate> => {
    await sleep(250)
    useMockDbStore.getState().updateWhatsAppTemplate(template)
    return template
  },

  sendReminder: async (reminder: WhatsAppReminder): Promise<WhatsAppReminder> => {
    await sleep(400)
    useMockDbStore.getState().addWhatsAppReminder(reminder)
    return reminder
  },

  markAsSent: async (reminderId: string): Promise<void> => {
    await sleep(200)
    useMockDbStore.getState().markReminderSent(reminderId)
  },

  cancelReminder: async (reminderId: string): Promise<void> => {
    await sleep(200)
    useMockDbStore.getState().cancelReminder(reminderId)
  },
}
