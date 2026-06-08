import type { ReactNode } from 'react'

export interface ColumnDef<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (row: T) => ReactNode
}

export interface FilterDef {
  key: string
  label: string
  options: { label: string; value: string }[]
}

export interface RowAction<T> {
  label: string
  icon?: ReactNode
  action: (row: T) => void
  variant?: 'danger' | 'default'
  visible?: (row: T) => boolean
}

export interface BulkAction<T> {
  label: string
  icon?: ReactNode
  action: (selectedRows: T[]) => void
}

export interface EmptyStateConfig {
  title: string
  message: string
  icon?: ReactNode
  actionButton?: ReactNode
}
