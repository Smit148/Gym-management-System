import { z } from 'zod'

export const expenseCategories = [
  'rent',
  'electricity',
  'staff_salary',
  'equipment_repair',
  'cleaning',
  'supplements_purchase',
  'marketing',
  'maintenance',
  'water',
  'internet',
  'other',
] as const

export const expenseSchema = z.object({
  category: z.enum([
    'rent',
    'electricity',
    'staff_salary',
    'equipment_repair',
    'cleaning',
    'supplements_purchase',
    'marketing',
    'maintenance',
    'water',
    'internet',
    'other',
  ], {
    message: 'Please select a valid expense category',
  }),
  amount: z.number().min(1, 'Amount must be greater than zero'),
  description: z.string().optional(),
  expense_date: z.string().min(1, 'Please select a date'),
  is_recurring: z.boolean().default(false),
  frequency: z.enum(['weekly', 'monthly', 'yearly']).nullable().optional(),
  status: z.enum(['planned', 'recorded']).default('recorded'),
})
