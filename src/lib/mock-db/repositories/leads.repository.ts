import type { Lead, LeadFollowup, TrialMember, ActivityEvent, LeadStatus } from '@/types'

export const LeadsRepository = {
  addLead: (
    state: { leads: Lead[]; activityEvents: ActivityEvent[] },
    lead: Lead
  ) => {
    const newEvent: ActivityEvent = {
      id: `evt_${Date.now()}`,
      entity_type: 'lead',
      entity_id: lead.id,
      event_name: 'lead_added',
      timestamp: new Date().toISOString(),
      title: 'New Lead Added',
      description: `${lead.first_name} ${lead.last_name} enquired via ${lead.source}.`,
      actor_id: lead.created_by,
    }
    return {
      leads: [lead, ...state.leads],
      activityEvents: [newEvent, ...state.activityEvents],
    }
  },

  updateLead: (
    state: { leads: Lead[]; activityEvents: ActivityEvent[] },
    lead: Lead
  ) => {
    const oldLead = state.leads.find((l) => l.id === lead.id)
    const newEvents: ActivityEvent[] = []

    if (lead.status === 'converted' && oldLead?.status !== 'converted') {
      newEvents.push({
        id: `evt_${Date.now()}`,
        entity_type: 'lead',
        entity_id: lead.id,
        event_name: 'lead_converted',
        timestamp: new Date().toISOString(),
        title: 'Lead Converted',
        description: `${lead.first_name} ${lead.last_name} became an active member.`,
        actor_id: lead.assigned_to || undefined,
      })
    } else if (lead.status === 'lost' && oldLead?.status !== 'lost') {
      newEvents.push({
        id: `evt_${Date.now()}`,
        entity_type: 'lead',
        entity_id: lead.id,
        event_name: 'lead_lost',
        timestamp: new Date().toISOString(),
        title: 'Lead Lost',
        description: `${lead.first_name} ${lead.last_name} marked lost. Reason: ${lead.lost_reason}.`,
        actor_id: lead.assigned_to || undefined,
      })
    }

    // Notes updated event
    if (lead.notes !== oldLead?.notes) {
      newEvents.push({
        id: `evt_${Date.now()}_notes`,
        entity_type: 'lead',
        entity_id: lead.id,
        event_name: 'lead_note_updated',
        timestamp: new Date().toISOString(),
        title: 'Lead Notes Updated',
        description: `Notes ${oldLead?.notes ? 'updated' : 'added'} for ${lead.first_name} ${lead.last_name}.`,
        actor_id: lead.assigned_to || undefined,
      })
    }

    return {
      leads: state.leads.map((l) => (l.id === lead.id ? lead : l)),
      activityEvents: [...newEvents, ...state.activityEvents],
    }
  },

  addFollowup: (
    state: { leads: Lead[]; followups: LeadFollowup[]; activityEvents: ActivityEvent[] },
    followup: LeadFollowup
  ) => {
    const lead = state.leads.find((l) => l.id === followup.lead_id)
    const newEvent: ActivityEvent = {
      id: `evt_${Date.now()}`,
      entity_type: 'lead',
      entity_id: followup.lead_id,
      event_name: followup.outcome === 'trial_scheduled' ? 'trial_scheduled' : 'followup_logged',
      timestamp: new Date().toISOString(),
      title: followup.outcome === 'trial_scheduled' ? 'Trial Scheduled' : 'Follow-up Logged',
      description: `${lead ? `${lead.first_name} ${lead.last_name}` : 'Lead'} contacted via ${followup.contact_method}. Outcome: ${followup.outcome}.`,
      actor_id: followup.contacted_by,
    }
    return {
      followups: [followup, ...state.followups],
      leads: state.leads.map((l) =>
        l.id === followup.lead_id
          ? {
              ...l,
              status: (followup.outcome === 'trial_scheduled' ? 'trial' : 'follow_up') as LeadStatus,
              next_followup_at: followup.next_followup_at,
              updated_at: new Date().toISOString(),
            }
          : l
      ),
      activityEvents: [newEvent, ...state.activityEvents],
    }
  },

  addTrial: (
    state: { leads: Lead[]; trials: TrialMember[]; activityEvents: ActivityEvent[] },
    trial: TrialMember
  ) => {
    const lead = state.leads.find((l) => l.id === trial.lead_id)
    const newEvent: ActivityEvent = {
      id: `evt_${Date.now()}`,
      entity_type: 'lead',
      entity_id: trial.lead_id,
      event_name: 'trial_scheduled',
      timestamp: new Date().toISOString(),
      title: 'Trial Started',
      description: `${lead ? `${lead.first_name} ${lead.last_name}` : 'Lead'} started a ${trial.trial_days}-day trial.`,
    }
    return {
      trials: [trial, ...state.trials],
      leads: state.leads.map((l) =>
        l.id === trial.lead_id ? { ...l, status: 'trial' as const, updated_at: new Date().toISOString() } : l
      ),
      activityEvents: [newEvent, ...state.activityEvents],
    }
  },
}
