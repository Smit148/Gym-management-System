import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { leadsApi } from '../api/leads.api'
import type { Lead, LeadFollowup, TrialMember } from '@/types'

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: leadsApi.getLeads,
  })
}

export function useFollowups() {
  return useQuery({
    queryKey: ['followups'],
    queryFn: leadsApi.getFollowups,
  })
}

export function useTrials() {
  return useQuery({
    queryKey: ['trials'],
    queryFn: leadsApi.getTrials,
  })
}

export function useCreateLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lead: Lead) => leadsApi.createLead(lead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['activityEvents'] })
    },
  })
}

export function useUpdateLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lead: Lead) => leadsApi.updateLead(lead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['activityEvents'] })
    },
  })
}

export function useLogFollowup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (followup: LeadFollowup) => leadsApi.addFollowup(followup),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followups'] })
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['activityEvents'] })
    },
  })
}

export function useScheduleTrial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (trial: TrialMember) => leadsApi.addTrial(trial),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trials'] })
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['activityEvents'] })
    },
  })
}
