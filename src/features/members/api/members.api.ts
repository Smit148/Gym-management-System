import { useMockDbStore } from '@/lib/mock-db'
import { sleep } from '@/lib/utils'
import type { Member, Membership } from '@/types'

export const membersApi = {
  getMembers: async (): Promise<Member[]> => {
    await sleep(200)
    return useMockDbStore.getState().members
  },

  getMemberships: async (): Promise<Membership[]> => {
    await sleep(200)
    return useMockDbStore.getState().memberships
  },

  createMember: async (member: Member, membership: Membership): Promise<{ member: Member; membership: Membership }> => {
    await sleep(300)
    useMockDbStore.getState().addMember(member, membership)
    return { member, membership }
  },

  updateMember: async (member: Member): Promise<Member> => {
    await sleep(250)
    useMockDbStore.getState().updateMember(member)
    return member
  },

  updateMembership: async (membership: Membership): Promise<Membership> => {
    await sleep(250)
    useMockDbStore.getState().updateMembership(membership)
    return membership
  },

  addMembership: async (membership: Membership): Promise<Membership> => {
    await sleep(300)
    useMockDbStore.getState().addMembership(membership)
    return membership
  },
}
