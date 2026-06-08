export const queryKeys = {
  members: {
    all: ['members'] as const,
    lists: () => ['members', 'list'] as const,
    list: (filters?: Record<string, any>) => ['members', 'list', filters || {}] as const,
    details: () => ['members', 'detail'] as const,
    detail: (id: string) => ['members', 'detail', id] as const,
  },
  memberships: {
    all: ['memberships'] as const,
    lists: () => ['memberships', 'list'] as const,
    list: (filters?: Record<string, any>) => ['memberships', 'list', filters || {}] as const,
    detail: (id: string) => ['memberships', 'detail', id] as const,
  },
  leads: {
    all: ['leads'] as const,
    lists: () => ['leads', 'list'] as const,
    list: (filters?: Record<string, any>) => ['leads', 'list', filters || {}] as const,
    details: () => ['leads', 'detail'] as const,
    detail: (id: string) => ['leads', 'detail', id] as const,
  },
  followups: {
    all: ['followups'] as const,
    list: (leadId?: string) => ['followups', 'list', { leadId }] as const,
  },
  trials: {
    all: ['trials'] as const,
    list: (leadId?: string) => ['trials', 'list', { leadId }] as const,
  },
  payments: {
    all: ['payments'] as const,
    lists: () => ['payments', 'list'] as const,
    list: (filters?: Record<string, any>) => ['payments', 'list', filters || {}] as const,
    detail: (id: string) => ['payments', 'detail', id] as const,
  },
  expenses: {
    all: ['expenses'] as const,
    lists: () => ['expenses', 'list'] as const,
    list: (filters?: Record<string, any>) => ['expenses', 'list', filters || {}] as const,
    detail: (id: string) => ['expenses', 'detail', id] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
  },
  reports: {
    all: ['reports'] as const,
  },
  activityEvents: {
    all: ['activityEvents'] as const,
  },
  attendance: {
    all: ['attendance'] as const,
  },
  settings: {
    all: ['settings'] as const,
  },
  tasks: {
    all: ['tasks'] as const,
  },
}
