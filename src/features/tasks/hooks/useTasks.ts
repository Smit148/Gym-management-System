import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '../api/tasks.api'
import { queryKeys } from '@/lib/query-keys'
import type { Task } from '@/types'

export function useTasks() {
  return useQuery({
    queryKey: queryKeys.tasks.all,
    queryFn: tasksApi.getTasks,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (task: Omit<Task, 'id'>) => tasksApi.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (task: Task) => tasksApi.updateTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    },
  })
}
