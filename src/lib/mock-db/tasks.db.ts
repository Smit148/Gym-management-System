import type { Task } from '@/types'

export const initialTasks: Task[] = [
  {
    id: 'tsk_001',
    title: 'Call Rahul Sharma for plan renewal details',
    due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'high',
    status: 'pending',
  },
  {
    id: 'tsk_002',
    title: 'Check treadmill belt alignment',
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium',
    status: 'pending',
  },
  {
    id: 'tsk_003',
    title: 'Follow up with Pooja Deshmukh on trial satisfaction',
    due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'low',
    status: 'completed',
  },
]
