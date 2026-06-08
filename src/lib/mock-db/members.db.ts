import type { Member, Membership, MembershipPlan } from '@/types'

export const initialPlans: MembershipPlan[] = [
  { id: 'plan_001', tenant_id: 'tenant_001', name: '1 Month Basic', duration_days: 30, price: 1500, description: 'Basic gym access', max_freeze_days: 7, is_active: true, created_at: '', updated_at: '', deleted_at: null },
  { id: 'plan_002', tenant_id: 'tenant_001', name: '3 Month Standard', duration_days: 90, price: 4000, description: 'Full gym access with locker', max_freeze_days: 15, is_active: true, created_at: '', updated_at: '', deleted_at: null },
  { id: 'plan_003', tenant_id: 'tenant_001', name: '6 Month Premium', duration_days: 180, price: 7000, description: 'Full access + personal training sessions', max_freeze_days: 30, is_active: true, created_at: '', updated_at: '', deleted_at: null },
  { id: 'plan_004', tenant_id: 'tenant_001', name: '12 Month Annual', duration_days: 365, price: 12000, description: 'Annual membership with all benefits', max_freeze_days: 45, is_active: true, created_at: '', updated_at: '', deleted_at: null },
]

export const initialMembers: Member[] = [
  {
    id: 'mem_001', tenant_id: 'tenant_001', branch_id: null, user_id: null, lead_id: null,
    member_code: 'GYM-00001', first_name: 'Rahul', last_name: 'Sharma',
    email: 'rahul.sharma@gmail.com', phone: '+919876543201',
    date_of_birth: '1995-03-15', gender: 'male',
    address: 'A-12, Andheri West, Mumbai 400058',
    emergency_contact_name: 'Suman Sharma', emergency_contact_phone: '+919876543202',
    photo_url: null, blood_group: 'O+', medical_conditions: null,
    source: 'walk_in', notes: 'Loyal member. Refers friends regularly.',
    qr_code: null, status: 'active',
    joined_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deleted_at: null,
  },
  {
    id: 'mem_002', tenant_id: 'tenant_001', branch_id: null, user_id: null, lead_id: null,
    member_code: 'GYM-00002', first_name: 'Priya', last_name: 'Patel',
    email: 'priya.patel@yahoo.com', phone: '+919876543203',
    date_of_birth: '1998-07-22', gender: 'female',
    address: 'B-5, Powai, Mumbai 400076',
    emergency_contact_name: 'Rajesh Patel', emergency_contact_phone: '+919876543204',
    photo_url: null, blood_group: 'A+', medical_conditions: null,
    source: 'instagram', notes: null, qr_code: null, status: 'active',
    joined_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deleted_at: null,
  },
  {
    id: 'mem_003', tenant_id: 'tenant_001', branch_id: null, user_id: null, lead_id: null,
    member_code: 'GYM-00003', first_name: 'Amit', last_name: 'Kumar',
    email: null, phone: '+919876543205',
    date_of_birth: '1992-11-08', gender: 'male',
    address: 'C-18, Bandra East, Mumbai 400051',
    emergency_contact_name: null, emergency_contact_phone: null,
    photo_url: null, blood_group: 'B+', medical_conditions: 'Mild knee injury',
    source: 'referral', notes: 'Always pays late. Send reminder 5 days before due.',
    qr_code: null, status: 'active',
    joined_at: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    deleted_at: null,
  },
  {
    id: 'mem_004', tenant_id: 'tenant_001', branch_id: null, user_id: null, lead_id: null,
    member_code: 'GYM-00004', first_name: 'Sneha', last_name: 'Reddy',
    email: 'sneha.r@gmail.com', phone: '+919876543206',
    date_of_birth: '2000-01-12', gender: 'female',
    address: 'D-3, Juhu, Mumbai 400049',
    emergency_contact_name: 'Meera Reddy', emergency_contact_phone: '+919876543207',
    photo_url: null, blood_group: 'AB+', medical_conditions: null,
    source: 'google', notes: null, qr_code: null, status: 'frozen',
    joined_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deleted_at: null,
  },
  {
    id: 'mem_005', tenant_id: 'tenant_001', branch_id: null, user_id: null, lead_id: null,
    member_code: 'GYM-00005', first_name: 'Vikram', last_name: 'Singh',
    email: 'vikram.singh@outlook.com', phone: '+919876543208',
    date_of_birth: '1988-05-30', gender: 'male',
    address: 'E-22, Malad West, Mumbai 400064',
    emergency_contact_name: null, emergency_contact_phone: null,
    photo_url: null, blood_group: 'O-', medical_conditions: null,
    source: 'walk_in', notes: null, qr_code: null, status: 'expired',
    joined_at: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    deleted_at: null,
  },
  {
    id: 'mem_006', tenant_id: 'tenant_001', branch_id: null, user_id: null, lead_id: null,
    member_code: 'GYM-00006', first_name: 'Pooja', last_name: 'Deshmukh',
    email: 'pooja.d@gmail.com', phone: '+919876543209',
    date_of_birth: '1996-09-05', gender: 'female',
    address: 'F-7, Goregaon East, Mumbai 400063',
    emergency_contact_name: 'Sunil Deshmukh', emergency_contact_phone: '+919876543210',
    photo_url: null, blood_group: 'A-', medical_conditions: null,
    source: 'whatsapp', notes: 'Interested in personal training next month',
    qr_code: null, status: 'active',
    joined_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    deleted_at: null,
  },
]

// Add tags to mock members
initialMembers[0].tags = ['VIP', 'Weight Loss']
initialMembers[1].tags = ['Student', 'Zumba']
initialMembers[2].tags = ['Personal Training']
initialMembers[3].tags = ['Student', 'Exams']
initialMembers[4].tags = ['Bodybuilding']
initialMembers[5].tags = ['Personal Training']

export const initialMemberships: Membership[] = [
  { id: 'ms_001', tenant_id: 'tenant_001', member_id: 'mem_001', plan_id: 'plan_003', plan_name: '6 Month Premium', start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end_date: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], actual_price: 7000, discount_amount: 500, status: 'active', frozen_at: null, frozen_until: null, freeze_reason: null, freeze_days_used: 0, payment_status: 'paid', created_at: '', updated_at: '', deleted_at: null },
  { id: 'ms_002', tenant_id: 'tenant_001', member_id: 'mem_002', plan_id: 'plan_002', plan_name: '3 Month Standard', start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], actual_price: 4000, discount_amount: 0, status: 'active', frozen_at: null, frozen_until: null, freeze_reason: null, freeze_days_used: 0, payment_status: 'paid', created_at: '', updated_at: '', deleted_at: null },
  { id: 'ms_003', tenant_id: 'tenant_001', member_id: 'mem_003', plan_id: 'plan_004', plan_name: '12 Month Annual', start_date: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end_date: new Date(Date.now() + 165 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], actual_price: 12000, discount_amount: 1000, status: 'active', frozen_at: null, frozen_until: null, freeze_reason: null, freeze_days_used: 0, payment_status: 'paid', created_at: '', updated_at: '', deleted_at: null },
  { id: 'ms_004', tenant_id: 'tenant_001', member_id: 'mem_004', plan_id: 'plan_002', plan_name: '3 Month Standard', start_date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end_date: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], actual_price: 4000, discount_amount: 0, status: 'frozen', frozen_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), frozen_until: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), freeze_reason: 'exams', freeze_days_used: 5, payment_status: 'paid', created_at: '', updated_at: '', deleted_at: null },
  { id: 'ms_005', tenant_id: 'tenant_001', member_id: 'mem_005', plan_id: 'plan_001', plan_name: '1 Month Basic', start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], actual_price: 1500, discount_amount: 0, status: 'expired', frozen_at: null, frozen_until: null, freeze_reason: null, freeze_days_used: 0, payment_status: 'paid', created_at: '', updated_at: '', deleted_at: null },
  { id: 'ms_006', tenant_id: 'tenant_001', member_id: 'mem_006', plan_id: 'plan_002', plan_name: '3 Month Standard', start_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end_date: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], actual_price: 4000, discount_amount: 500, status: 'active', frozen_at: null, frozen_until: null, freeze_reason: null, freeze_days_used: 0, payment_status: 'partial', created_at: '', updated_at: '', deleted_at: null },
]
