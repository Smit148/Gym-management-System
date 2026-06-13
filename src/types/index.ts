/* ============================================
   GymOS — Shared Type Definitions
   ============================================ */

// ---- Enums ----

export type Theme = 'blue' | 'green' | 'orange' | 'purple'

export type UserRole = 'super_admin' | 'gym_owner' | 'staff' | 'trainer' | 'member'

export type LeadStatus = 'new' | 'contacted' | 'follow_up' | 'trial' | 'converted' | 'lost'

export type LeadSource = 'walk_in' | 'instagram' | 'google' | 'facebook' | 'referral' | 'whatsapp' | 'website' | 'other'

export type MemberStatus = 'active' | 'inactive' | 'expired' | 'frozen'

export type MembershipStatus = 'active' | 'expired' | 'frozen' | 'cancelled'

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'bank_transfer'

export type PaymentStatus = 'completed' | 'pending' | 'overdue' | 'refunded'

export type AttendanceMethod = 'manual' | 'qr' | 'receptionist' | 'mobile_app'

export type NotificationChannel = 'whatsapp' | 'sms' | 'email' | 'in_app'

export type TaskPriority = 'low' | 'medium' | 'high'

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export type ExpenseCategory =
  | 'rent'
  | 'electricity'
  | 'staff_salary'
  | 'equipment_repair'
  | 'cleaning'
  | 'supplements_purchase'
  | 'marketing'
  | 'maintenance'
  | 'water'
  | 'internet'
  | 'other'

export type FreezeReason = 'injury' | 'exams' | 'travel' | 'family_emergency' | 'other'

export type FollowupMethod = 'call' | 'whatsapp' | 'sms' | 'visit' | 'email'

export type FollowupOutcome = 'interested' | 'thinking' | 'not_interested' | 'no_response' | 'trial_scheduled'


// ---- Base Types ----

export interface BaseEntity {
  id: string
  tenant_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}


// ---- User ----

export interface User {
  id: string
  email: string
  phone: string
  first_name: string
  last_name: string
  avatar_url: string | null
  role: UserRole
  tenant_id: string | null
}


// ---- Lead ----

export interface Lead extends BaseEntity {
  first_name: string
  last_name: string
  phone: string
  email: string | null
  gender: 'male' | 'female' | 'other' | null
  age_range: string | null
  source: LeadSource
  referral_member_id: string | null
  interest: string | null
  status: LeadStatus
  lost_reason: string | null
  notes: string | null
  next_followup_at: string | null
  assigned_to: string | null
  converted_member_id: string | null
  converted_at: string | null
  created_by: string
}

export interface LeadFollowup {
  id: string
  lead_id: string
  contacted_by: string
  contact_method: FollowupMethod
  outcome: FollowupOutcome
  notes: string | null
  next_followup_at: string | null
  created_at: string
  contacted_by_name?: string
}

export interface TrialMember {
  id: string
  lead_id: string
  start_date: string
  end_date: string
  trial_days: number
  status: 'active' | 'completed' | 'converted' | 'expired'
  attendance_count: number
  feedback: string | null
}


// ---- Member ----

export interface Member extends BaseEntity {
  branch_id: string | null
  user_id: string | null
  lead_id: string | null
  member_code: string
  first_name: string
  last_name: string
  email: string | null
  phone: string
  date_of_birth: string | null
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
  address: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  photo_url: string | null
  blood_group: string | null
  medical_conditions: string | null
  source: string | null
  notes: string | null
  qr_code: string | null
  tags?: string[]
  status: MemberStatus
  joined_at: string
}


// ---- Membership ----

export interface MembershipPlan extends BaseEntity {
  name: string
  duration_days: number
  price: number
  description: string | null
  max_freeze_days: number
  is_active: boolean
}

export interface Membership extends BaseEntity {
  member_id: string
  plan_id: string
  plan_name?: string
  start_date: string
  end_date: string
  actual_price: number
  discount_amount: number
  status: MembershipStatus
  frozen_at: string | null
  frozen_until: string | null
  freeze_reason: FreezeReason | null
  freeze_days_used: number
  payment_status: 'pending' | 'partial' | 'paid'
}


// ---- Attendance ----

export interface Attendance {
  id: string
  member_id: string
  member_name?: string
  member_code?: string
  check_in_at: string
  check_out_at?: string
  method: 'manual' | 'qr' | 'receptionist'
  branch_id?: string
  notes?: string
}


// ---- Payment ----

export interface Payment extends BaseEntity {
  member_id: string
  member_name?: string
  membership_id: string | null
  amount: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  reference_number: string | null
  receipt_number?: string
  description: string | null
  paid_at: string
}


// ---- Expense ----

export interface Expense extends BaseEntity {
  branch_id: string | null
  category: ExpenseCategory
  amount: number
  description: string | null
  receipt_url: string | null
  expense_date: string
  is_recurring: boolean
  frequency?: 'weekly' | 'monthly' | 'yearly' | null
  status?: 'planned' | 'recorded'
  recorded_by: string
}


// ---- Task ----

export interface Task {
  id: string
  title: string
  due_date: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'completed'
}


// ---- Dashboard ----

export interface DashboardStats {
  members_present_today: number
  total_active_members: number
  revenue_today: number
  expenses_today: number
  net_income_today: number
  expiring_this_week: number
  followups_due_today: number
  tasks_due_today: number
  new_enquiries_week: number
  conversion_rate: number
}

export interface TopReferrer {
  member_id: string
  member_name: string
  referral_count: number
  converted_count: number
  conversion_rate: number
}

export interface ActivityItem {
  id: string
  type: 'member_joined' | 'payment_received' | 'lead_added' | 'attendance_marked' | 'membership_renewed' | 'expense_recorded' | 'lead_converted'
  title: string
  description: string
  timestamp: string
  color: string
}

export interface ActivityEvent {
  id: string
  entity_type: 'member' | 'lead' | 'payment' | 'expense' | 'membership' | 'attendance'
  entity_id: string
  event_name:
    | 'joined'
    | 'renewed'
    | 'frozen'
    | 'unfrozen'
    | 'payment_received'
    | 'expense_recorded'
    | 'lead_added'
    | 'lead_converted'
    | 'lead_lost'
    | 'trial_scheduled'
    | 'attendance_marked'
    | 'followup_logged'
    | 'trial_started'
    | 'lead_note_updated'
  timestamp: string
  title: string
  description: string
  actor_id?: string
  metadata?: any
}


// ---- API Response ----

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}

export interface GymSettings {
  gym_name: string
  contact_phone: string
  contact_email: string
  address: string
  theme: 'blue' | 'green' | 'orange' | 'purple'
  currency: string
}


// ---- Staff ----

export type StaffRole = 'trainer' | 'receptionist' | 'cleaning' | 'manager' | 'other'

export type StaffStatus = 'active' | 'on_leave' | 'terminated'

export interface Staff extends BaseEntity {
  first_name: string
  last_name: string
  phone: string
  email: string | null
  role: StaffRole
  status: StaffStatus
  joined_at: string
  salary_amount: number
  salary_frequency: 'monthly'
  shift: 'morning' | 'evening' | 'full_day' | 'flexible'
  photo_url: string | null
  emergency_contact: string | null
  notes: string | null
}


// ---- Salary ----

export type SalaryStatus = 'paid' | 'pending' | 'overdue' | 'partial'

export interface SalaryRecord extends BaseEntity {
  staff_id: string
  staff_name?: string
  amount: number
  month: string
  status: SalaryStatus
  paid_amount: number
  paid_at: string | null
  payment_method: PaymentMethod | null
  notes: string | null
}


// ---- WhatsApp Reminder ----

export type ReminderType = 'membership_expiry' | 'payment_due' | 'birthday' | 'attendance_nudge' | 'custom'

export type ReminderStatus = 'scheduled' | 'sent' | 'failed' | 'cancelled'

export interface WhatsAppTemplate {
  id: string
  name: string
  type: ReminderType
  message: string
  is_active: boolean
  created_at: string
}

export interface WhatsAppReminder extends BaseEntity {
  template_id: string
  template_name?: string
  recipient_name: string
  recipient_phone: string
  message: string
  type: ReminderType
  status: ReminderStatus
  scheduled_at: string
  sent_at: string | null
}

