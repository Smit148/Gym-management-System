import { z } from 'zod'

export const recordPaymentSchema = z.object({
  member_id: z.string().min(1, 'Please select a member'),
  amount: z.number().min(1, 'Amount must be greater than zero'),
  payment_method: z.enum(['cash', 'upi', 'card', 'bank_transfer']),
  reference_number: z.string().optional(),
  description: z.string().optional(),
})
