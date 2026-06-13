import type { WhatsAppTemplate, WhatsAppReminder } from '@/types'

const TENANT = 'tenant_001'

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
}

export const initialWhatsAppTemplates: WhatsAppTemplate[] = [
  {
    id: 'tpl_001',
    name: 'Membership Expiry Reminder',
    type: 'membership_expiry',
    message: 'Hi {{name}}! 🏋️ Your gym membership is expiring on {{date}}. Renew now to continue your fitness journey without a break! Visit the front desk or call us. — {{gym_name}}',
    is_active: true,
    created_at: daysAgo(90),
  },
  {
    id: 'tpl_002',
    name: 'Payment Due Alert',
    type: 'payment_due',
    message: 'Hello {{name}}, this is a friendly reminder that your payment of ₹{{amount}} is due. Please clear the balance at the earliest. Thank you! — {{gym_name}}',
    is_active: true,
    created_at: daysAgo(90),
  },
  {
    id: 'tpl_003',
    name: 'Birthday Wish',
    type: 'birthday',
    message: 'Happy Birthday {{name}}! 🎂🎉 Wishing you a fit and fabulous year ahead! Enjoy a special birthday discount on your next renewal. — {{gym_name}}',
    is_active: true,
    created_at: daysAgo(60),
  },
  {
    id: 'tpl_004',
    name: 'Attendance Nudge',
    type: 'attendance_nudge',
    message: "Hey {{name}}, we noticed you haven't visited the gym in a while! 💪 Your health matters — come back and crush your goals. We're waiting for you! — {{gym_name}}",
    is_active: true,
    created_at: daysAgo(45),
  },
]

export const initialWhatsAppReminders: WhatsAppReminder[] = [
  {
    id: 'wa_001', tenant_id: TENANT,
    template_id: 'tpl_001', template_name: 'Membership Expiry Reminder',
    recipient_name: 'Rahul Sharma', recipient_phone: '+919876500101',
    message: 'Hi Rahul Sharma! 🏋️ Your gym membership is expiring on 15 Jun 2026. Renew now to continue your fitness journey without a break! Visit the front desk or call us. — Iron Temple Gym',
    type: 'membership_expiry', status: 'sent',
    scheduled_at: daysAgo(3), sent_at: daysAgo(3),
    created_at: daysAgo(3), updated_at: daysAgo(3), deleted_at: null,
  },
  {
    id: 'wa_002', tenant_id: TENANT,
    template_id: 'tpl_002', template_name: 'Payment Due Alert',
    recipient_name: 'Priya Patel', recipient_phone: '+919876500102',
    message: 'Hello Priya Patel, this is a friendly reminder that your payment of ₹6,500 is due. Please clear the balance at the earliest. Thank you! — Iron Temple Gym',
    type: 'payment_due', status: 'sent',
    scheduled_at: daysAgo(5), sent_at: daysAgo(5),
    created_at: daysAgo(5), updated_at: daysAgo(5), deleted_at: null,
  },
  {
    id: 'wa_003', tenant_id: TENANT,
    template_id: 'tpl_003', template_name: 'Birthday Wish',
    recipient_name: 'Amit Kumar', recipient_phone: '+919876500103',
    message: 'Happy Birthday Amit Kumar! 🎂🎉 Wishing you a fit and fabulous year ahead! Enjoy a special birthday discount on your next renewal. — Iron Temple Gym',
    type: 'birthday', status: 'sent',
    scheduled_at: daysAgo(1), sent_at: daysAgo(1),
    created_at: daysAgo(1), updated_at: daysAgo(1), deleted_at: null,
  },
  {
    id: 'wa_004', tenant_id: TENANT,
    template_id: 'tpl_004', template_name: 'Attendance Nudge',
    recipient_name: 'Sneha Reddy', recipient_phone: '+919876500104',
    message: "Hey Sneha Reddy, we noticed you haven't visited the gym in a while! 💪 Your health matters — come back and crush your goals. We're waiting for you! — Iron Temple Gym",
    type: 'attendance_nudge', status: 'sent',
    scheduled_at: daysAgo(2), sent_at: daysAgo(2),
    created_at: daysAgo(2), updated_at: daysAgo(2), deleted_at: null,
  },
  {
    id: 'wa_005', tenant_id: TENANT,
    template_id: 'tpl_001', template_name: 'Membership Expiry Reminder',
    recipient_name: 'Karan Malhotra', recipient_phone: '+919876500105',
    message: 'Hi Karan Malhotra! 🏋️ Your gym membership is expiring on 18 Jun 2026. Renew now to continue your fitness journey without a break! Visit the front desk or call us. — Iron Temple Gym',
    type: 'membership_expiry', status: 'scheduled',
    scheduled_at: hoursFromNow(4), sent_at: null,
    created_at: hoursAgo(1), updated_at: hoursAgo(1), deleted_at: null,
  },
  {
    id: 'wa_006', tenant_id: TENANT,
    template_id: 'tpl_002', template_name: 'Payment Due Alert',
    recipient_name: 'Meera Joshi', recipient_phone: '+919876500106',
    message: 'Hello Meera Joshi, this is a friendly reminder that your payment of ₹4,000 is due. Please clear the balance at the earliest. Thank you! — Iron Temple Gym',
    type: 'payment_due', status: 'scheduled',
    scheduled_at: hoursFromNow(8), sent_at: null,
    created_at: hoursAgo(2), updated_at: hoursAgo(2), deleted_at: null,
  },
  {
    id: 'wa_007', tenant_id: TENANT,
    template_id: 'tpl_001', template_name: 'Membership Expiry Reminder',
    recipient_name: 'Ravi Teja', recipient_phone: '+919876500107',
    message: 'Hi Ravi Teja! 🏋️ Your gym membership is expiring on 20 Jun 2026. Renew now to continue your fitness journey without a break! Visit the front desk or call us. — Iron Temple Gym',
    type: 'membership_expiry', status: 'failed',
    scheduled_at: daysAgo(1), sent_at: null,
    created_at: daysAgo(1), updated_at: daysAgo(1), deleted_at: null,
  },
  {
    id: 'wa_008', tenant_id: TENANT,
    template_id: 'tpl_004', template_name: 'Attendance Nudge',
    recipient_name: 'Ananya Singh', recipient_phone: '+919876500108',
    message: "Hey Ananya Singh, we noticed you haven't visited the gym in a while! 💪 Your health matters — come back and crush your goals. We're waiting for you! — Iron Temple Gym",
    type: 'attendance_nudge', status: 'sent',
    scheduled_at: daysAgo(7), sent_at: daysAgo(7),
    created_at: daysAgo(7), updated_at: daysAgo(7), deleted_at: null,
  },
  {
    id: 'wa_009', tenant_id: TENANT,
    template_id: 'tpl_002', template_name: 'Payment Due Alert',
    recipient_name: 'Suresh Nair', recipient_phone: '+919876500109',
    message: 'Hello Suresh Nair, this is a friendly reminder that your payment of ₹8,000 is due. Please clear the balance at the earliest. Thank you! — Iron Temple Gym',
    type: 'payment_due', status: 'cancelled',
    scheduled_at: daysAgo(4), sent_at: null,
    created_at: daysAgo(4), updated_at: daysAgo(3), deleted_at: null,
  },
  {
    id: 'wa_010', tenant_id: TENANT,
    template_id: 'tpl_003', template_name: 'Birthday Wish',
    recipient_name: 'Divya Kapoor', recipient_phone: '+919876500110',
    message: 'Happy Birthday Divya Kapoor! 🎂🎉 Wishing you a fit and fabulous year ahead! Enjoy a special birthday discount on your next renewal. — Iron Temple Gym',
    type: 'birthday', status: 'scheduled',
    scheduled_at: hoursFromNow(2), sent_at: null,
    created_at: hoursAgo(3), updated_at: hoursAgo(3), deleted_at: null,
  },
]
