import { z } from 'zod'

export const personalDetailsSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional(),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  email: z.string().email('Invalid email address').or(z.literal('')),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say', '']).optional(),
  date_of_birth: z.string().optional(),
  blood_group: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().min(10, 'Emergency contact phone must be at least 10 digits').or(z.literal('')),
  address: z.string().optional(),
  medical_conditions: z.string().optional(),
  source: z.string().default('walk_in'),
  notes: z.string().optional(),
})

export const planDetailsSchema = z.object({
  selectedPlanId: z.string().min(1, 'Please select a plan'),
  start_date: z.string().min(1, 'Start date is required'),
  actual_price: z.number().min(0, 'Price cannot be negative'),
  discount_amount: z.number().min(0, 'Discount cannot be negative').default(0),
  discount_reason: z.string().optional(),
}).refine((data) => {
  if (data.discount_amount > data.actual_price) {
    return false
  }
  return true
}, {
  message: 'Discount cannot exceed plan price',
  path: ['discount_amount'],
}).refine((data) => {
  if (data.discount_amount > 0 && (!data.discount_reason || !data.discount_reason.trim())) {
    return false
  }
  return true
}, {
  message: 'Reason is required for applying discount',
  path: ['discount_reason'],
})

export const paymentDetailsSchema = z.object({
  amount_paid: z.number().min(0, 'Amount paid cannot be negative'),
  payment_method: z.enum(['cash', 'upi', 'card', 'bank_transfer']),
})
