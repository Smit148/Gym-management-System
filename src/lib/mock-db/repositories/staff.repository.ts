import type { Staff, ActivityEvent } from '@/types'

export const StaffRepository = {
  addStaff: (
    state: { staff: Staff[]; activityEvents: ActivityEvent[] },
    staffMember: Staff
  ) => {
    const newEvent: ActivityEvent = {
      id: `evt_${Date.now()}`,
      entity_type: 'member' as const,
      entity_id: staffMember.id,
      event_name: 'joined' as const,
      timestamp: new Date().toISOString(),
      title: 'Staff Onboarded',
      description: `${staffMember.first_name} ${staffMember.last_name} joined as ${staffMember.role}.`,
    }
    return {
      staff: [staffMember, ...state.staff],
      activityEvents: [newEvent, ...state.activityEvents],
    }
  },

  updateStaff: (
    state: { staff: Staff[] },
    staffMember: Staff
  ) => ({
    staff: state.staff.map((s) => (s.id === staffMember.id ? staffMember : s)),
  }),

  deleteStaff: (
    state: { staff: Staff[] },
    staffId: string
  ) => ({
    staff: state.staff.map((s) =>
      s.id === staffId
        ? { ...s, status: 'terminated' as const, deleted_at: new Date().toISOString() }
        : s
    ),
  }),
}
