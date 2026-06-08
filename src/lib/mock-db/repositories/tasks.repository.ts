import type { Task } from '@/types'

export const TasksRepository = {
  addTask: (
    state: { tasks: Task[] },
    task: Task
  ) => {
    return {
      tasks: [task, ...state.tasks],
    }
  },

  updateTask: (
    state: { tasks: Task[] },
    task: Task
  ) => {
    return {
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    }
  },
}
