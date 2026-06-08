import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { membersApi } from '../api/members.api'
import type { Member, Membership } from '@/types'

export function useMembers() {
  return useQuery({
    queryKey: ['members'],
    queryFn: membersApi.getMembers,
  })
}

export function useMemberships() {
  return useQuery({
    queryKey: ['memberships'],
    queryFn: membersApi.getMemberships,
  })
}

export function useCreateMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ member, membership }: { member: Member; membership: Membership }) =>
      membersApi.createMember(member, membership),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
      queryClient.invalidateQueries({ queryKey: ['memberships'] })
      queryClient.invalidateQueries({ queryKey: ['activityEvents'] })
    },
  })
}

export function useUpdateMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (member: Member) => membersApi.updateMember(member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
  })
}

export function useUpdateMembership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (membership: Membership) => membersApi.updateMembership(membership),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] })
      queryClient.invalidateQueries({ queryKey: ['members'] })
      queryClient.invalidateQueries({ queryKey: ['activityEvents'] })
    },
  })
}

export function useRenewMembership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (membership: Membership) => membersApi.addMembership(membership),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] })
      queryClient.invalidateQueries({ queryKey: ['members'] })
      queryClient.invalidateQueries({ queryKey: ['activityEvents'] })
    },
  })
}
