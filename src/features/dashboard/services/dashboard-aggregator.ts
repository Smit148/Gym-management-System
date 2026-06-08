import type { Member, Membership, Lead, Payment, Expense, ActivityEvent, TopReferrer, ActivityItem, DashboardStats, Attendance, Task } from '@/types'

export const DashboardAggregator = {
  getStats: (
    members: Member[],
    memberships: Membership[],
    leads: Lead[],
    payments: Payment[],
    expenses: Expense[],
    _activityEvents: ActivityEvent[],
    attendance: Attendance[],
    tasks: Task[]
  ): DashboardStats => {
    const todayStr = new Date().toISOString().split('T')[0]
    
    // 1. Total Active Members
    const total_active_members = members.filter(m => m.status === 'active').length

    // 2. Members Present Today (From live attendance state today)
    const members_present_today = attendance.filter(
      (a) => a.check_in_at.startsWith(todayStr)
    ).length

    // 3. Revenue Today
    const revenue_today = payments
      .filter((p) => p.paid_at.startsWith(todayStr))
      .reduce((sum, p) => sum + p.amount, 0)

    // 4. Expenses Today
    const expenses_today = expenses
      .filter((e) => e.expense_date.startsWith(todayStr) && e.status !== 'planned')
      .reduce((sum, e) => sum + e.amount, 0)

    // 5. Net Income Today
    const net_income_today = revenue_today - expenses_today

    // 6. Expiring This Week
    const oneWeekFromNow = new Date()
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
    const expiring_this_week = memberships.filter((m) => {
      if (m.status !== 'active') return false
      const endDate = new Date(m.end_date)
      return endDate >= new Date() && endDate <= oneWeekFromNow
    }).length

    // 7. Follow-ups Due Today
    const followups_due_today = leads.filter((l) => {
      if (!l.next_followup_at) return false
      return l.next_followup_at.startsWith(todayStr) && l.status !== 'converted' && l.status !== 'lost'
    }).length

    // 8. Tasks Due Today (From live tasks list pending today)
    const tasks_due_today = tasks.filter((t) => t.due_date === todayStr && t.status === 'pending').length

    // 9. New Enquiries (Leads registered in last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const new_enquiries_week = leads.filter((l) => new Date(l.created_at) >= sevenDaysAgo).length

    // 10. Lead Conversion Rate
    const totalLeads = leads.length
    const convertedLeads = leads.filter((l) => l.status === 'converted').length
    const conversion_rate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0

    return {
      members_present_today,
      total_active_members,
      revenue_today,
      expenses_today,
      net_income_today,
      expiring_this_week,
      followups_due_today,
      tasks_due_today,
      new_enquiries_week,
      conversion_rate,
    }
  },

  getTopReferrers: (members: Member[], leads: Lead[]): TopReferrer[] => {
    const referrerMap: Record<string, { referral_count: number; converted_count: number }> = {}

    leads.forEach((lead) => {
      const refId = lead.referral_member_id
      if (!refId) return
      
      if (!referrerMap[refId]) {
        referrerMap[refId] = { referral_count: 0, converted_count: 0 }
      }
      
      referrerMap[refId].referral_count += 1
      if (lead.status === 'converted') {
        referrerMap[refId].converted_count += 1
      }
    })

    const topReferrers: TopReferrer[] = Object.keys(referrerMap).map((memberId) => {
      const member = members.find((m) => m.id === memberId)
      const name = member ? `${member.first_name} ${member.last_name || ''}`.trim() : 'Unknown Member'
      const { referral_count, converted_count } = referrerMap[memberId]
      const conversion_rate = referral_count > 0 ? Math.round((converted_count / referral_count) * 100) : 0
      
      return {
        member_id: memberId,
        member_name: name,
        referral_count,
        converted_count,
        conversion_rate,
      }
    })

    return topReferrers
      .sort((a, b) => b.referral_count - a.referral_count)
      .slice(0, 5)
  },

  getRecentActivities: (events: ActivityEvent[]): ActivityItem[] => {
    return events.slice(0, 10).map((event) => {
      let type: ActivityItem['type'] = 'attendance_marked'
      let color = 'var(--gray-500)'

      switch (event.event_name) {
        case 'joined':
          type = 'member_joined'
          color = 'var(--success-500)'
          break
        case 'payment_received':
          type = 'payment_received'
          color = 'var(--primary-500)'
          break
        case 'expense_recorded':
          type = 'expense_recorded'
          color = 'var(--danger-500)'
          break
        case 'lead_added':
          type = 'lead_added'
          color = 'var(--warning-500)'
          break
        case 'lead_converted':
          type = 'lead_converted'
          color = 'var(--success-500)'
          break
        case 'renewed':
          type = 'membership_renewed'
          color = 'var(--success-500)'
          break
        case 'frozen':
          type = 'membership_renewed'
          color = 'var(--info-500)'
          break
        case 'unfrozen':
          type = 'membership_renewed'
          color = 'var(--info-500)'
          break
        case 'attendance_marked':
          type = 'attendance_marked'
          color = 'var(--success-500)'
          break
      }

      return {
        id: event.id,
        type,
        title: event.title,
        description: event.description,
        timestamp: event.timestamp,
        color,
      }
    })
  },

  getAttendanceTrend: (attendance: Attendance[]): { date: string; label: string; count: number }[] => {
    const days = []
    const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const label = weekdayLabels[d.getDay()]!
      
      const count = attendance.filter((a) => a.check_in_at.startsWith(dateStr)).length
      days.push({
        date: dateStr,
        label,
        count,
      })
    }
    return days
  },
}
