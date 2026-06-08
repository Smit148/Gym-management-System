import { z } from 'zod'

export const leadDetailsSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional(),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  email: z.string().email('Invalid email address').or(z.literal('')),
  gender: z.enum(['male', 'female', 'other', '']).optional(),
  age_range: z.string().optional(),
  source: z.enum(['walk_in', 'instagram', 'google', 'facebook', 'referral', 'whatsapp', 'website', 'other']),
  interest: z.string().optional(),
  notes: z.string().optional(),
})

export const followupSchema = z.object({
  contact_method: z.enum(['call', 'whatsapp', 'sms', 'visit', 'email']),
  outcome: z.enum(['interested', 'thinking', 'not_interested', 'no_response', 'trial_scheduled']),
  notes: z.string().optional(),
  next_followup_at: z.string().optional(),
})

export const trialSchema = z.object({
  start_date: z.string().min(1, 'Start date is required'),
  trial_days: z.number().min(1, 'Trial must be at least 1 day'),
  feedback: z.string().optional(),
})
