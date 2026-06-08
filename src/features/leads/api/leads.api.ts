import { useMockDbStore } from '@/lib/mock-db'
import { sleep } from '@/lib/utils'
import type { Lead, LeadFollowup, TrialMember } from '@/types'

export const leadsApi = {
  getLeads: async (): Promise<Lead[]> => {
    await sleep(200)
    return useMockDbStore.getState().leads
  },

  getFollowups: async (): Promise<LeadFollowup[]> => {
    await sleep(200)
    return useMockDbStore.getState().followups
  },

  getTrials: async (): Promise<TrialMember[]> => {
    await sleep(200)
    return useMockDbStore.getState().trials
  },

  createLead: async (lead: Lead): Promise<Lead> => {
    await sleep(250)
    useMockDbStore.getState().addLead(lead)
    return lead
  },

  updateLead: async (lead: Lead): Promise<Lead> => {
    await sleep(250)
    useMockDbStore.getState().updateLead(lead)
    return lead
  },

  addFollowup: async (followup: LeadFollowup): Promise<LeadFollowup> => {
    await sleep(300)
    useMockDbStore.getState().addFollowup(followup)
    return followup
  },

  addTrial: async (trial: TrialMember): Promise<TrialMember> => {
    await sleep(300)
    useMockDbStore.getState().addTrial(trial)
    return trial
  },
}
