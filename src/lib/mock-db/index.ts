import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Member,
  Membership,
  MembershipPlan,
  Lead,
  LeadFollowup,
  TrialMember,
  Payment,
  Expense,
  ActivityEvent,
  Attendance,
  Task,
  GymSettings,
} from '@/types'
import { initialMembers, initialMemberships, initialPlans } from './members.db'
import { initialLeads, initialFollowups, initialTrialMembers } from './leads.db'
import { initialPayments } from './payments.db'
import { initialExpenses } from './expenses.db'
import { initialAttendance } from './attendance.db'
import { initialTasks } from './tasks.db'
import { initialSettings } from './settings.db'

import { MembersRepository } from './repositories/members.repository'
import { LeadsRepository } from './repositories/leads.repository'
import { PaymentsRepository } from './repositories/payments.repository'
import { ExpensesRepository } from './repositories/expenses.repository'
import { AttendanceRepository } from './repositories/attendance.repository'
import { SettingsRepository } from './repositories/settings.repository'
import { TasksRepository } from './repositories/tasks.repository'

interface MockDbState {
  members: Member[]
  memberships: Membership[]
  plans: MembershipPlan[]
  leads: Lead[]
  followups: LeadFollowup[]
  trials: TrialMember[]
  payments: Payment[]
  expenses: Expense[]
  activityEvents: ActivityEvent[]
  attendance: Attendance[]
  tasks: Task[]
  settings: GymSettings
  receipt_sequence: number

  // Mutations
  addMember: (member: Member, membership: Membership) => void
  updateMember: (member: Member) => void
  addMembership: (membership: Membership) => void
  updateMembership: (membership: Membership) => void
  addLead: (lead: Lead) => void
  updateLead: (lead: Lead) => void
  addFollowup: (followup: LeadFollowup) => void
  addTrial: (trial: TrialMember) => void
  addPayment: (payment: Payment) => void
  addExpense: (expense: Expense) => void
  checkInMember: (checkIn: Attendance) => void
  checkOutMember: (id: string, checkOutTime: string) => void
  updateSettings: (settings: GymSettings) => void
  addTask: (task: Task) => void
  updateTask: (task: Task) => void
  addActivityEvent: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void
  resetDb: () => void
}

const getInitialEvents = (): ActivityEvent[] => {
  const events: ActivityEvent[] = [
    {
      id: 'evt_001',
      entity_type: 'member',
      entity_id: 'mem_001',
      event_name: 'joined',
      timestamp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      title: 'Member Registered',
      description: 'Rahul Sharma was registered as a new member.',
    },
    {
      id: 'evt_002',
      entity_type: 'member',
      entity_id: 'mem_002',
      event_name: 'joined',
      timestamp: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      title: 'Member Registered',
      description: 'Priya Patel was registered as a new member.',
    },
    {
      id: 'evt_003',
      entity_type: 'member',
      entity_id: 'mem_004',
      event_name: 'joined',
      timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      title: 'Member Registered',
      description: 'Sneha Reddy was registered as a new member.',
    },
    {
      id: 'evt_004',
      entity_type: 'member',
      entity_id: 'mem_004',
      event_name: 'frozen',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      title: 'Membership Frozen',
      description: 'Sneha Reddy frozen membership due to student exams.',
      metadata: { reason: 'exams', duration: 15 },
    },
    {
      id: 'evt_005',
      entity_type: 'payment',
      entity_id: 'pay_001',
      event_name: 'payment_received',
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      title: 'Payment Received',
      description: 'Received ₹6,500 from Rahul Sharma via UPI.',
    },
    {
      id: 'evt_006',
      entity_type: 'expense',
      entity_id: 'exp_001',
      event_name: 'expense_recorded',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      title: 'Expense Recorded',
      description: 'Recorded rent expense of ₹25,000.',
    },
    {
      id: 'evt_007',
      entity_type: 'lead',
      entity_id: 'lead_005',
      event_name: 'lead_converted',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      title: 'Lead Converted',
      description: 'Vikram Joshi converted to an active member.',
    },
  ]
  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export const useMockDbStore = create<MockDbState>()(
  persist(
    (set) => ({
      members: initialMembers,
      memberships: initialMemberships,
      plans: initialPlans,
      leads: initialLeads,
      followups: initialFollowups,
      trials: initialTrialMembers,
      payments: initialPayments,
      expenses: initialExpenses,
      activityEvents: getInitialEvents(),
      attendance: initialAttendance,
      tasks: initialTasks,
      settings: initialSettings,
      receipt_sequence: initialPayments.length + 1,

      addMember: (member, membership) =>
        set((state) => MembersRepository.addMember(state, member, membership)),

      updateMember: (member) =>
        set((state) => MembersRepository.updateMember(state, member)),

      addMembership: (membership) =>
        set((state) => MembersRepository.addMembership(state, membership)),

      updateMembership: (membership) =>
        set((state) => MembersRepository.updateMembership(state, membership)),

      addLead: (lead) =>
        set((state) => LeadsRepository.addLead(state, lead)),

      updateLead: (lead) =>
        set((state) => LeadsRepository.updateLead(state, lead)),

      addFollowup: (followup) =>
        set((state) => LeadsRepository.addFollowup(state, followup)),

      addTrial: (trial) =>
        set((state) => LeadsRepository.addTrial(state, trial)),

      addPayment: (payment) =>
        set((state) => PaymentsRepository.addPayment(state, payment)),

      addExpense: (expense) =>
        set((state) => ExpensesRepository.addExpense(state, expense)),

      checkInMember: (checkIn) =>
        set((state) => AttendanceRepository.checkIn(state, checkIn)),

      checkOutMember: (id, checkOutTime) =>
        set((state) => AttendanceRepository.checkOut(state, id, checkOutTime)),

      updateSettings: (settings) =>
        set((state) => SettingsRepository.updateSettings(state, settings)),

      addTask: (task) =>
        set((state) => TasksRepository.addTask(state, task)),

      updateTask: (task) =>
        set((state) => TasksRepository.updateTask(state, task)),

      addActivityEvent: (event) =>
        set((state) => {
          const fullEvent: ActivityEvent = {
            ...event,
            id: `evt_${Date.now()}`,
            timestamp: new Date().toISOString(),
          }
          return {
            activityEvents: [fullEvent, ...state.activityEvents],
          }
        }),

      resetDb: () =>
        set({
          members: initialMembers,
          memberships: initialMemberships,
          plans: initialPlans,
          leads: initialLeads,
          followups: initialFollowups,
          trials: initialTrialMembers,
          payments: initialPayments,
          expenses: initialExpenses,
          activityEvents: getInitialEvents(),
          attendance: initialAttendance,
          tasks: initialTasks,
          settings: initialSettings,
          receipt_sequence: initialPayments.length + 1,
        }),
    }),
    {
      name: 'gymos-mock-db',
    }
  )
)
