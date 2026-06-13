import type { WhatsAppTemplate, WhatsAppReminder, ActivityEvent } from '@/types'

export const WhatsAppRepository = {
  addTemplate: (
    state: { whatsappTemplates: WhatsAppTemplate[] },
    template: WhatsAppTemplate
  ) => ({
    whatsappTemplates: [template, ...state.whatsappTemplates],
  }),

  updateTemplate: (
    state: { whatsappTemplates: WhatsAppTemplate[] },
    template: WhatsAppTemplate
  ) => ({
    whatsappTemplates: state.whatsappTemplates.map((t) =>
      t.id === template.id ? template : t
    ),
  }),

  addReminder: (
    state: { whatsappReminders: WhatsAppReminder[]; activityEvents: ActivityEvent[] },
    reminder: WhatsAppReminder
  ) => {
    const newEvent: ActivityEvent = {
      id: `evt_${Date.now()}`,
      entity_type: 'member' as const,
      entity_id: reminder.id,
      event_name: 'followup_logged' as const,
      timestamp: new Date().toISOString(),
      title: 'WhatsApp Reminder Sent',
      description: `${reminder.type.replace('_', ' ')} reminder sent to ${reminder.recipient_name}.`,
    }
    return {
      whatsappReminders: [reminder, ...state.whatsappReminders],
      activityEvents: [newEvent, ...state.activityEvents],
    }
  },

  markAsSent: (
    state: { whatsappReminders: WhatsAppReminder[] },
    reminderId: string
  ) => ({
    whatsappReminders: state.whatsappReminders.map((r) =>
      r.id === reminderId
        ? { ...r, status: 'sent' as const, sent_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        : r
    ),
  }),

  cancelReminder: (
    state: { whatsappReminders: WhatsAppReminder[] },
    reminderId: string
  ) => ({
    whatsappReminders: state.whatsappReminders.map((r) =>
      r.id === reminderId
        ? { ...r, status: 'cancelled' as const, updated_at: new Date().toISOString() }
        : r
    ),
  }),
}
