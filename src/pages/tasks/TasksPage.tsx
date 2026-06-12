import { useState, useMemo } from 'react'
import {
  ListTodo,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useTasks, useUpdateTask } from '@/features/tasks/hooks/useTasks'
import { AddTaskModal } from '@/features/tasks/components/AddTaskModal'
import { DataTable } from '@/organisms/DataTable/DataTable'
import type { ColumnDef, FilterDef } from '@/organisms/DataTable/types'
import type { Task } from '@/types'

export function TasksPage() {
  const { data: tasks = [], isLoading } = useTasks()
  const updateTaskMutation = useUpdateTask()

  const [showAddModal, setShowAddModal] = useState(false)

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  // Calculate task KPI stats
  const stats = useMemo(() => {
    const total = tasks.length
    const pending = tasks.filter((t) => t.status === 'pending').length
    const completed = tasks.filter((t) => t.status === 'completed').length
    const overdue = tasks.filter((t) => t.status === 'pending' && t.due_date < todayStr).length

    return {
      total,
      pending,
      completed,
      overdue,
    }
  }, [tasks, todayStr])

  const toggleTaskStatus = (task: Task) => {
    updateTaskMutation.mutate({
      ...task,
      status: task.status === 'pending' ? 'completed' : 'pending',
    })
  }

  // Define table columns
  const columns: ColumnDef<Task>[] = [
    {
      key: 'title',
      header: 'Task Title',
      sortable: true,
      render: (task) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={() => toggleTaskStatus(task)}
            style={{
              width: '16px',
              height: '16px',
              cursor: 'pointer',
              accentColor: 'var(--primary-600)',
            }}
          />
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
            color: task.status === 'completed' ? 'var(--text-tertiary)' : 'var(--text-primary)',
          }}>
            {task.title}
          </span>
        </div>
      ),
    },
    {
      key: 'due_date',
      header: 'Due Date',
      sortable: true,
      render: (task) => {
        const isOverdue = task.status === 'pending' && task.due_date < todayStr
        return (
          <div className="flex items-center gap-1.5" style={{
            fontSize: '0.8125rem',
            color: isOverdue ? 'var(--danger-600)' : 'var(--text-secondary)',
            fontWeight: isOverdue ? 600 : 400,
          }}>
            <Calendar size={12} />
            {formatDate(task.due_date)}
            {isOverdue && (
              <span className="badge badge-expired" style={{ fontSize: '0.625rem', padding: '0.125rem 0.375rem' }}>
                Overdue
              </span>
            )}
          </div>
        )
      },
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (task) => {
        let badgeClass = 'badge-active'
        if (task.priority === 'high') badgeClass = 'badge-expired'
        if (task.priority === 'low') badgeClass = 'badge-frozen'

        return (
          <span className={`badge ${badgeClass}`} style={{ textTransform: 'uppercase', fontSize: '0.6875rem' }}>
            {task.priority}
          </span>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (task) => (
        <span className={`badge ${task.status === 'completed' ? 'badge-active' : 'badge-new'}`} style={{ textTransform: 'uppercase', fontSize: '0.6875rem' }}>
          {task.status}
        </span>
      ),
    },
  ]

  // Define dropdown filters
  const filters: FilterDef[] = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'All Statuses', value: '' },
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    {
      key: 'priority',
      label: 'Priority',
      options: [
        { label: 'All Priorities', value: '' },
        { label: 'High', value: 'high' },
        { label: 'Medium', value: 'medium' },
        { label: 'Low', value: 'low' },
      ],
    },
  ]

  return (
    <div className="page-enter">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Gym Tasks & Reminders</h1>
          <p className="page-subtitle">Track staff operations, member callbacks, and administrative actions</p>
        </div>
        <div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Create Todo
          </button>
        </div>
      </div>

      {/* KPI statistics cards */}
      <div className="grid-stats" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))' }}>
        {/* Total Tasks */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
            <ListTodo size={20} />
          </div>
          <div className="stat-card-value">{stats.total}</div>
          <div className="stat-card-label">Total Reminders</div>
          <div className="stat-card-sublabel">Total tasks created</div>
        </div>

        {/* Pending Tasks */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--warning-50)', color: 'var(--warning-600)' }}>
            <Clock size={20} />
          </div>
          <div className="stat-card-value">{stats.pending}</div>
          <div className="stat-card-label">Pending Checklist</div>
          <div className="stat-card-sublabel">Action items waiting</div>
        </div>

        {/* Overdue Tasks */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--danger-50)', color: 'var(--danger-600)' }}>
            <AlertCircle size={20} />
          </div>
          <div className="stat-card-value" style={{ color: stats.overdue > 0 ? 'var(--danger-600)' : undefined }}>
            {stats.overdue}
          </div>
          <div className="stat-card-label">Overdue Tasks</div>
          <div className="stat-card-sublabel">Tasks past due date</div>
        </div>

        {/* Completed Tasks */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--success-50)', color: 'var(--success-600)' }}>
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-card-value">{stats.completed}</div>
          <div className="stat-card-label">Completed Tasks</div>
          <div className="stat-card-sublabel">Finished operations</div>
        </div>
      </div>

      {/* Main Checklist Card */}
      <div className="card" style={{ padding: '1rem' }}>
        <DataTable
          data={tasks}
          columns={columns}
          filters={filters}
          searchPlaceholder="Search task title..."
          searchField="title"
          isLoading={isLoading}
          emptyState={{
            title: 'No tasks found',
            message: 'Create a new todo to start organizing your daily operations.',
          }}
          rowActions={[
            {
              label: 'Mark Completed',
              action: (task) => toggleTaskStatus(task),
              icon: <CheckCircle2 size={14} style={{ color: 'var(--success-600)' }} />,
              visible: (task) => task.status === 'pending',
            },
            {
              label: 'Mark Pending',
              action: (task) => toggleTaskStatus(task),
              icon: <Clock size={14} style={{ color: 'var(--warning-600)' }} />,
              visible: (task) => task.status === 'completed',
            },
          ]}
        />
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <AddTaskModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  )
}
