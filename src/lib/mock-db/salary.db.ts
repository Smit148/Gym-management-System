import type { SalaryRecord } from '@/types'

const TENANT = 'tenant_001'

function monthStr(monthsAgo: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - monthsAgo)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

// Generate salary records for each staff member for the last 3 months
export const initialSalaryRecords: SalaryRecord[] = [
  // Vikram Singh (staff_001) — ₹25,000
  {
    id: 'sal_001', tenant_id: TENANT, staff_id: 'staff_001', staff_name: 'Vikram Singh',
    amount: 25000, month: monthStr(2), status: 'paid', paid_amount: 25000,
    paid_at: daysAgo(60), payment_method: 'bank_transfer', notes: null,
    created_at: daysAgo(62), updated_at: daysAgo(60), deleted_at: null,
  },
  {
    id: 'sal_002', tenant_id: TENANT, staff_id: 'staff_001', staff_name: 'Vikram Singh',
    amount: 25000, month: monthStr(1), status: 'paid', paid_amount: 25000,
    paid_at: daysAgo(28), payment_method: 'bank_transfer', notes: null,
    created_at: daysAgo(32), updated_at: daysAgo(28), deleted_at: null,
  },
  {
    id: 'sal_003', tenant_id: TENANT, staff_id: 'staff_001', staff_name: 'Vikram Singh',
    amount: 25000, month: monthStr(0), status: 'pending', paid_amount: 0,
    paid_at: null, payment_method: null, notes: 'Due on 1st',
    created_at: daysAgo(2), updated_at: daysAgo(2), deleted_at: null,
  },

  // Pooja Mehta (staff_002) — ₹22,000
  {
    id: 'sal_004', tenant_id: TENANT, staff_id: 'staff_002', staff_name: 'Pooja Mehta',
    amount: 22000, month: monthStr(2), status: 'paid', paid_amount: 22000,
    paid_at: daysAgo(58), payment_method: 'upi', notes: null,
    created_at: daysAgo(62), updated_at: daysAgo(58), deleted_at: null,
  },
  {
    id: 'sal_005', tenant_id: TENANT, staff_id: 'staff_002', staff_name: 'Pooja Mehta',
    amount: 22000, month: monthStr(1), status: 'paid', paid_amount: 22000,
    paid_at: daysAgo(30), payment_method: 'upi', notes: null,
    created_at: daysAgo(32), updated_at: daysAgo(30), deleted_at: null,
  },
  {
    id: 'sal_006', tenant_id: TENANT, staff_id: 'staff_002', staff_name: 'Pooja Mehta',
    amount: 22000, month: monthStr(0), status: 'pending', paid_amount: 0,
    paid_at: null, payment_method: null, notes: null,
    created_at: daysAgo(2), updated_at: daysAgo(2), deleted_at: null,
  },

  // Ankit Verma (staff_003) — ₹15,000
  {
    id: 'sal_007', tenant_id: TENANT, staff_id: 'staff_003', staff_name: 'Ankit Verma',
    amount: 15000, month: monthStr(2), status: 'paid', paid_amount: 15000,
    paid_at: daysAgo(59), payment_method: 'cash', notes: null,
    created_at: daysAgo(62), updated_at: daysAgo(59), deleted_at: null,
  },
  {
    id: 'sal_008', tenant_id: TENANT, staff_id: 'staff_003', staff_name: 'Ankit Verma',
    amount: 15000, month: monthStr(1), status: 'paid', paid_amount: 15000,
    paid_at: daysAgo(29), payment_method: 'cash', notes: null,
    created_at: daysAgo(32), updated_at: daysAgo(29), deleted_at: null,
  },
  {
    id: 'sal_009', tenant_id: TENANT, staff_id: 'staff_003', staff_name: 'Ankit Verma',
    amount: 15000, month: monthStr(0), status: 'overdue', paid_amount: 0,
    paid_at: null, payment_method: null, notes: 'Overdue — remind accounts',
    created_at: daysAgo(5), updated_at: daysAgo(1), deleted_at: null,
  },

  // Ramesh Yadav (staff_004) — ₹10,000
  {
    id: 'sal_010', tenant_id: TENANT, staff_id: 'staff_004', staff_name: 'Ramesh Yadav',
    amount: 10000, month: monthStr(1), status: 'paid', paid_amount: 10000,
    paid_at: daysAgo(28), payment_method: 'cash', notes: null,
    created_at: daysAgo(32), updated_at: daysAgo(28), deleted_at: null,
  },
  {
    id: 'sal_011', tenant_id: TENANT, staff_id: 'staff_004', staff_name: 'Ramesh Yadav',
    amount: 10000, month: monthStr(0), status: 'pending', paid_amount: 0,
    paid_at: null, payment_method: null, notes: null,
    created_at: daysAgo(2), updated_at: daysAgo(2), deleted_at: null,
  },

  // Deepak Sharma (staff_005) — ₹35,000
  {
    id: 'sal_012', tenant_id: TENANT, staff_id: 'staff_005', staff_name: 'Deepak Sharma',
    amount: 35000, month: monthStr(1), status: 'paid', paid_amount: 35000,
    paid_at: daysAgo(27), payment_method: 'bank_transfer', notes: null,
    created_at: daysAgo(32), updated_at: daysAgo(27), deleted_at: null,
  },
  {
    id: 'sal_013', tenant_id: TENANT, staff_id: 'staff_005', staff_name: 'Deepak Sharma',
    amount: 35000, month: monthStr(0), status: 'partial', paid_amount: 15000,
    paid_at: daysAgo(3), payment_method: 'bank_transfer', notes: 'Advance paid, rest on 15th',
    created_at: daysAgo(5), updated_at: daysAgo(3), deleted_at: null,
  },

  // Neha Gupta (staff_006) — ₹20,000
  {
    id: 'sal_014', tenant_id: TENANT, staff_id: 'staff_006', staff_name: 'Neha Gupta',
    amount: 20000, month: monthStr(1), status: 'paid', paid_amount: 20000,
    paid_at: daysAgo(30), payment_method: 'upi', notes: null,
    created_at: daysAgo(32), updated_at: daysAgo(30), deleted_at: null,
  },
  {
    id: 'sal_015', tenant_id: TENANT, staff_id: 'staff_006', staff_name: 'Neha Gupta',
    amount: 20000, month: monthStr(0), status: 'pending', paid_amount: 0,
    paid_at: null, payment_method: null, notes: 'On leave — confirm before disbursement',
    created_at: daysAgo(2), updated_at: daysAgo(2), deleted_at: null,
  },
]
