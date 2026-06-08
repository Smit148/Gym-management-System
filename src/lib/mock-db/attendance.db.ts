import type { Attendance } from '@/types'

// Setup dates for the last few days to populate charts
const getPastDateStr = (daysAgo: number, timeStr: string) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return `${d.toISOString().split('T')[0]}T${timeStr}`
}

export const initialAttendance: Attendance[] = [
  // Today's active check-ins (some checked out, some checked in)
  {
    id: 'att_001',
    member_id: 'mem_001',
    member_name: 'Rahul Sharma',
    member_code: 'GYM-2026-0001',
    check_in_at: getPastDateStr(0, '07:30:00.000Z'),
    check_out_at: getPastDateStr(0, '09:00:00.000Z'),
    method: 'qr',
  },
  {
    id: 'att_002',
    member_id: 'mem_002',
    member_name: 'Priya Patel',
    member_code: 'GYM-2026-0002',
    check_in_at: getPastDateStr(0, '08:15:00.000Z'),
    method: 'receptionist',
    notes: 'Forgot membership card',
  },
  {
    id: 'att_003',
    member_id: 'mem_005',
    member_name: 'Vikram Joshi',
    member_code: 'GYM-2026-0005',
    check_in_at: getPastDateStr(0, '09:00:00.000Z'),
    check_out_at: getPastDateStr(0, '10:30:00.000Z'),
    method: 'manual',
  },
  {
    id: 'att_004',
    member_id: 'mem_006',
    member_name: 'Pooja Deshmukh',
    member_code: 'GYM-2026-0006',
    check_in_at: getPastDateStr(0, '17:00:00.000Z'),
    method: 'qr',
  },

  // 1 Day Ago logs
  {
    id: 'att_005',
    member_id: 'mem_001',
    member_name: 'Rahul Sharma',
    member_code: 'GYM-2026-0001',
    check_in_at: getPastDateStr(1, '07:32:00.000Z'),
    check_out_at: getPastDateStr(1, '09:05:00.000Z'),
    method: 'qr',
  },
  {
    id: 'att_006',
    member_id: 'mem_002',
    member_name: 'Priya Patel',
    member_code: 'GYM-2026-0002',
    check_in_at: getPastDateStr(1, '08:00:00.000Z'),
    check_out_at: getPastDateStr(1, '09:15:00.000Z'),
    method: 'receptionist',
  },
  {
    id: 'att_007',
    member_id: 'mem_003',
    member_name: 'Amit Kumar',
    member_code: 'GYM-2026-0003',
    check_in_at: getPastDateStr(1, '18:30:00.000Z'),
    check_out_at: getPastDateStr(1, '20:00:00.000Z'),
    method: 'manual',
  },

  // 2 Days Ago logs
  {
    id: 'att_008',
    member_id: 'mem_001',
    member_name: 'Rahul Sharma',
    member_code: 'GYM-2026-0001',
    check_in_at: getPastDateStr(2, '07:25:00.000Z'),
    check_out_at: getPastDateStr(2, '08:45:00.000Z'),
    method: 'qr',
  },
  {
    id: 'att_009',
    member_id: 'mem_005',
    member_name: 'Vikram Joshi',
    member_code: 'GYM-2026-0005',
    check_in_at: getPastDateStr(2, '09:10:00.000Z'),
    check_out_at: getPastDateStr(2, '10:40:00.000Z'),
    method: 'manual',
  },

  // 3 Days Ago logs
  {
    id: 'att_010',
    member_id: 'mem_002',
    member_name: 'Priya Patel',
    member_code: 'GYM-2026-0002',
    check_in_at: getPastDateStr(3, '08:05:00.000Z'),
    check_out_at: getPastDateStr(3, '09:30:00.000Z'),
    method: 'receptionist',
  },
  {
    id: 'att_011',
    member_id: 'mem_003',
    member_name: 'Amit Kumar',
    member_code: 'GYM-2026-0003',
    check_in_at: getPastDateStr(3, '18:00:00.000Z'),
    check_out_at: getPastDateStr(3, '19:45:00.000Z'),
    method: 'manual',
  },
  {
    id: 'att_012',
    member_id: 'mem_006',
    member_name: 'Pooja Deshmukh',
    member_code: 'GYM-2026-0006',
    check_in_at: getPastDateStr(3, '17:15:00.000Z'),
    check_out_at: getPastDateStr(3, '18:45:00.000Z'),
    method: 'qr',
  },

  // 4 Days Ago logs
  {
    id: 'att_013',
    member_id: 'mem_001',
    member_name: 'Rahul Sharma',
    member_code: 'GYM-2026-0001',
    check_in_at: getPastDateStr(4, '07:30:00.000Z'),
    check_out_at: getPastDateStr(4, '09:00:00.000Z'),
    method: 'qr',
  },
  {
    id: 'att_014',
    member_id: 'mem_005',
    member_name: 'Vikram Joshi',
    member_code: 'GYM-2026-0005',
    check_in_at: getPastDateStr(4, '08:50:00.000Z'),
    check_out_at: getPastDateStr(4, '10:20:00.000Z'),
    method: 'manual',
  },

  // 5 Days Ago logs
  {
    id: 'att_015',
    member_id: 'mem_002',
    member_name: 'Priya Patel',
    member_code: 'GYM-2026-0002',
    check_in_at: getPastDateStr(5, '08:10:00.000Z'),
    check_out_at: getPastDateStr(5, '09:40:00.000Z'),
    method: 'receptionist',
  },
  {
    id: 'att_016',
    member_id: 'mem_003',
    member_name: 'Amit Kumar',
    member_code: 'GYM-2026-0003',
    check_in_at: getPastDateStr(5, '18:15:00.000Z'),
    check_out_at: getPastDateStr(5, '19:30:00.000Z'),
    method: 'manual',
  },

  // 6 Days Ago logs
  {
    id: 'att_017',
    member_id: 'mem_001',
    member_name: 'Rahul Sharma',
    member_code: 'GYM-2026-0001',
    check_in_at: getPastDateStr(6, '07:40:00.000Z'),
    check_out_at: getPastDateStr(6, '09:10:00.000Z'),
    method: 'qr',
  },
  {
    id: 'att_018',
    member_id: 'mem_006',
    member_name: 'Pooja Deshmukh',
    member_code: 'GYM-2026-0006',
    check_in_at: getPastDateStr(6, '17:30:00.000Z'),
    check_out_at: getPastDateStr(6, '18:50:00.000Z'),
    method: 'qr',
  },
]
