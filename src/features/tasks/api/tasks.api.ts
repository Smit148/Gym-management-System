import { useMockDbStore } from '@/lib/mock-db'
import { sleep } from '@/lib/utils'
import type { Task } from '@/types'

export const tasksApi = {
  getTasks: async (): Promise<Task[]> => {
    await sleep(200)
    return useMockDbStore.getState().tasks
  },

  createTask: async (task: Omit<Task, 'id'>): Promise<Task> => {
    await sleep(250)
    const newTask: Task = {
      ...task,
      id: `tsk_${Date.now()}`,
    }
    useMockDbStore.getState().addTask(newTask)
    return newTask
  },

  updateTask: async (task: Task): Promise<Task> => {
    await sleep(200)
    useMockDbStore.getState().updateTask(task)
    return task
  },
}
