import { useState } from 'react'
import { X, ClipboardList } from 'lucide-react'
import { useCreateTask } from '../hooks/useTasks'
import type { Task } from '@/types'

interface AddTaskModalProps {
  onClose: () => void
}

export function AddTaskModal({ onClose }: AddTaskModalProps) {
  const createTaskMutation = useCreateTask()

  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0])
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Task title is required.')
      return
    }

    if (!dueDate) {
      setError('Due date is required.')
      return
    }

    setIsSubmitting(true)
    createTaskMutation.mutate(
      {
        title: title.trim(),
        due_date: dueDate,
        priority,
        status: 'pending',
      },
      {
        onSuccess: () => {
          setIsSubmitting(false)
          onClose()
        },
        onError: () => {
          setIsSubmitting(false)
          setError('Failed to create task. Please try again.')
        },
      }
    )
  }

  return (
    <>
      <div className="modal-overlay" style={{ zIndex: 1050 }} onClick={onClose} />
      <div className="modal" style={{ zIndex: 1060, maxWidth: '420px', width: '90%' }} role="dialog" aria-modal="true" aria-labelledby="add-task-title" onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}>
        <div className="modal-header">
          <h3 id="add-task-title" className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClipboardList size={18} style={{ color: 'var(--primary-500)' }} />
            Create Todo Task
          </h3>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {error && (
              <div role="alert" style={{
                padding: '0.75rem',
                background: 'var(--danger-50)',
                border: '1px solid var(--danger-100)',
                color: 'var(--danger-700)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            {/* Task Title */}
            <div className="form-group">
              <label htmlFor="task-title" className="form-label form-label-required">Task Title</label>
              <input
                id="task-title"
                className="form-input"
                placeholder="e.g. Call Rahul Sharma for renewal details"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                aria-required="true"
              />
            </div>

            {/* Due Date */}
            <div className="form-group">
              <label htmlFor="task-due" className="form-label form-label-required">Due Date</label>
              <input
                id="task-due"
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                aria-required="true"
              />
            </div>

            {/* Priority */}
            <div className="form-group">
              <label htmlFor="task-priority" className="form-label form-label-required">Priority</label>
              <select
                id="task-priority"
                className="form-input form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                aria-required="true"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
