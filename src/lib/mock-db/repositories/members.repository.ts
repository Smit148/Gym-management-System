import type { Member, Membership, ActivityEvent } from '@/types'

export const MembersRepository = {
  addMember: (
    state: { members: Member[]; memberships: Membership[]; activityEvents: ActivityEvent[] },
    member: Member,
    membership: Membership
  ) => {
    const newEvent: ActivityEvent = {
      id: `evt_${Date.now()}`,
      entity_type: 'member',
      entity_id: member.id,
      event_name: 'joined',
      timestamp: new Date().toISOString(),
      title: 'Member Registered',
      description: `${member.first_name} ${member.last_name} registered with ${membership.plan_name}.`,
    }
    return {
      members: [member, ...state.members],
      memberships: [membership, ...state.memberships],
      activityEvents: [newEvent, ...state.activityEvents],
    }
  },

  updateMember: (
    state: { members: Member[] },
    member: Member
  ) => {
    return {
      members: state.members.map((m) => (m.id === member.id ? member : m)),
    }
  },

  addMembership: (
    state: { members: Member[]; memberships: Membership[]; activityEvents: ActivityEvent[] },
    membership: Membership
  ) => {
    const member = state.members.find((m) => m.id === membership.member_id)
    const newEvent: ActivityEvent = {
      id: `evt_${Date.now()}`,
      entity_type: 'membership',
      entity_id: membership.id,
      event_name: 'renewed',
      timestamp: new Date().toISOString(),
      title: 'Membership Renewed',
      description: `${member ? `${member.first_name} ${member.last_name}` : 'Member'} renewed plan to ${membership.plan_name}.`,
    }
    return {
      memberships: [membership, ...state.memberships],
      activityEvents: [newEvent, ...state.activityEvents],
    }
  },

  updateMembership: (
    state: { members: Member[]; memberships: Membership[]; activityEvents: ActivityEvent[] },
    membership: Membership
  ) => {
    const member = state.members.find((m) => m.id === membership.member_id)
    let eventName: 'frozen' | 'unfrozen' | 'renewed' = 'renewed'
    let title = 'Membership Updated'
    let desc = `Membership for ${member ? member.first_name : 'Member'} updated.`

    const prevMembership = state.memberships.find(m => m.id === membership.id)

    if (membership.status === 'frozen') {
      eventName = 'frozen'
      title = 'Membership Frozen'
      desc = `${member ? `${member.first_name} ${member.last_name}` : 'Member'} suspended membership due to ${membership.freeze_reason}.`
    } else if (membership.status === 'active' && prevMembership?.status === 'frozen') {
      eventName = 'unfrozen'
      title = 'Membership Unfrozen'
      desc = `${member ? `${member.first_name} ${member.last_name}` : 'Member'} resumed membership.`
    }

    const newEvent: ActivityEvent = {
      id: `evt_${Date.now()}`,
      entity_type: 'membership',
      entity_id: membership.id,
      event_name: eventName,
      timestamp: new Date().toISOString(),
      title,
      description: desc,
    }

    return {
      memberships: state.memberships.map((m) => (m.id === membership.id ? membership : m)),
      activityEvents: [newEvent, ...state.activityEvents],
    }
  },
}
