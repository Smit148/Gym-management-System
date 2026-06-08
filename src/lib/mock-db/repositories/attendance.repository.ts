import type { Attendance, ActivityEvent } from '@/types'

export const AttendanceRepository = {
  checkIn: (
    state: { attendance: Attendance[]; activityEvents: ActivityEvent[] },
    checkIn: Attendance
  ) => {
    const newEvent: ActivityEvent = {
      id: `evt_${Date.now()}`,
      entity_type: 'member',
      entity_id: checkIn.member_id,
      event_name: 'attendance_marked',
      timestamp: new Date().toISOString(),
      title: 'Attendance Marked',
      description: `${checkIn.member_name || 'Member'} checked in`,
    }

    return {
      attendance: [checkIn, ...state.attendance],
      activityEvents: [newEvent, ...state.activityEvents],
    }
  },

  checkOut: (
    state: { attendance: Attendance[]; activityEvents: ActivityEvent[] },
    id: string,
    checkOutTime: string
  ) => {
    const attendanceRecord = state.attendance.find((att) => att.id === id)
    const newEvents = [...state.activityEvents]
    if (attendanceRecord) {
      newEvents.unshift({
        id: `evt_${Date.now()}`,
        entity_type: 'member',
        entity_id: attendanceRecord.member_id,
        event_name: 'attendance_marked',
        timestamp: checkOutTime,
        title: 'Attendance Marked',
        description: `${attendanceRecord.member_name || 'Member'} checked out`,
      })
    }
    return {
      attendance: state.attendance.map((att) =>
        att.id === id ? { ...att, check_out_at: checkOutTime } : att
      ),
      activityEvents: newEvents,
    }
  },
}
