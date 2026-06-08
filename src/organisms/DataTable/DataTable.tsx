import { useState, useMemo } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, MoreVertical, ShieldAlert } from 'lucide-react'
import { DataTableToolbar } from './DataTableToolbar'
import { DataTablePagination } from './DataTablePagination'
import type { ColumnDef, FilterDef, RowAction, BulkAction, EmptyStateConfig } from './types'

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  searchPlaceholder?: string
  searchField?: keyof T | ((row: T, query: string) => boolean)
  filters?: FilterDef[]
  rowActions?: RowAction<T>[]
  bulkActions?: BulkAction<T>[]
  emptyState?: EmptyStateConfig
  isLoading?: boolean
  onRowClick?: (row: T) => void
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  searchField,
  filters = [],
  rowActions = [],
  bulkActions = [],
  emptyState,
  isLoading = false,
  onRowClick,
}: DataTableProps<T>) {
  // Local States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({})
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set())
  const [activeActionsMenu, setActiveActionsMenu] = useState<string | null>(null)

  // Handlers
  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    setCurrentPage(1)
  }

  // Filtered & Sorted data computation
  const processedData = useMemo(() => {
    let result = [...data]

    // 1. Text Search Filter
    if (searchQuery.trim() && searchField) {
      const query = searchQuery.toLowerCase()
      result = result.filter((row) => {
        if (typeof searchField === 'function') {
          return searchField(row, query)
        }
        const val = row[searchField]
        return val ? String(val).toLowerCase().includes(query) : false
      })
    }

    // 2. Dropdown Select Filters
    Object.entries(selectedFilters).forEach(([key, val]) => {
      if (val) {
        result = result.filter((row: any) => String(row[key]) === val)
      }
    })

    // 3. Sorting
    if (sortConfig) {
      result.sort((a: any, b: any) => {
        const valA = a[sortConfig.key]
        const valB = b[sortConfig.key]

        if (valA === undefined || valA === null) return 1
        if (valB === undefined || valB === null) return -1

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortConfig.direction === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA)
        }

        return sortConfig.direction === 'asc'
          ? (valA > valB ? 1 : -1)
          : (valA < valB ? 1 : -1)
      })
    }

    return result
  }, [data, searchQuery, searchField, selectedFilters, sortConfig, columns])

  // Pagination bounds
  const totalPages = Math.ceil(processedData.length / itemsPerPage)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return processedData.slice(start, start + itemsPerPage)
  }, [processedData, currentPage, itemsPerPage])

  // Bulk Selection functions
  const isAllSelected = paginatedData.length > 0 && paginatedData.every(row => selectedRowIds.has(row.id))
  const toggleSelectAll = () => {
    const next = new Set(selectedRowIds)
    if (isAllSelected) {
      paginatedData.forEach(row => next.delete(row.id))
    } else {
      paginatedData.forEach(row => next.add(row.id))
    }
    setSelectedRowIds(next)
  }

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = new Set(selectedRowIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedRowIds(next)
  }

  const selectedRows = useMemo(() => {
    return data.filter(row => selectedRowIds.has(row.id))
  }, [data, selectedRowIds])

  return (
    <div style={{ position: 'relative' }}>
      {/* Table Toolbar */}
      {searchField && (
        <DataTableToolbar
          searchPlaceholder={searchPlaceholder}
          onSearchChange={setSearchQuery}
          filters={filters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* Floating Bulk Action Bar */}
      {bulkActions.length > 0 && selectedRowIds.size > 0 && (
        <div style={{
          position: 'absolute',
          top: '-3.5rem',
          right: 0,
          background: 'var(--primary-600)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.8125rem',
          zIndex: 10,
          boxShadow: 'var(--shadow-lg)',
        }}>
          <span>{selectedRowIds.size} row(s) selected</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {bulkActions.map((action, i) => (
              <button
                key={i}
                onClick={() => {
                  action.action(selectedRows)
                  setSelectedRowIds(new Set())
                }}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSelectedRowIds(new Set())}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              fontSize: '0.75rem',
            }}
          >
            Deselect
          </button>
        </div>
      )}

      {/* Data Table */}
      <div className="data-table-wrapper" style={{ position: 'relative' }}>
        {isLoading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255,255,255,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
          }}>
            <span className="spinner spinner-primary" />
          </div>
        )}

        <table className="data-table">
          <thead>
            <tr>
              {/* Checkbox column */}
              {bulkActions.length > 0 && (
                <th style={{ width: '40px', paddingLeft: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
              )}

              {/* Header columns */}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{ cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {col.header}
                    {col.sortable && (
                      <span style={{ color: 'var(--text-tertiary)' }}>
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                        ) : (
                          <ArrowUpDown size={12} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}

              {/* Action column header */}
              {rowActions.length > 0 && <th style={{ width: '60px' }}></th>}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0) + (rowActions.length > 0 ? 1 : 0)}>
                  {emptyState ? (
                    <div className="empty-state" style={{ padding: '3rem 1.5rem' }}>
                      <div className="empty-state-icon" style={{ margin: '0 auto 1rem', display: 'flex', justifyContent: 'center' }}>
                        {emptyState.icon || <ShieldAlert size={36} style={{ color: 'var(--text-tertiary)' }} />}
                      </div>
                      <div className="empty-state-title" style={{ fontSize: '1rem', fontWeight: 600 }}>{emptyState.title}</div>
                      <div className="empty-state-message" style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>{emptyState.message}</div>
                      {emptyState.actionButton && <div style={{ marginTop: '1.25rem' }}>{emptyState.actionButton}</div>}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      No data found
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {/* Checkbox column cell */}
                  {bulkActions.length > 0 && (
                    <td onClick={(e) => toggleSelectRow(row.id, e)} style={{ paddingLeft: '1rem' }}>
                      <input
                        type="checkbox"
                        checked={selectedRowIds.has(row.id)}
                        onChange={() => {}} // Controlled via toggleSelectRow
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                  )}

                  {/* Data columns cells */}
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : String((row as any)[col.key] || '—')}
                    </td>
                  ))}

                  {/* Options action cell */}
                  {rowActions.length > 0 && (
                    <td onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
                      {rowActions.filter((act) => !act.visible || act.visible(row)).length > 0 && (
                        <button
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => setActiveActionsMenu(activeActionsMenu === row.id ? null : row.id)}
                        >
                          <MoreVertical size={16} />
                        </button>
                      )}

                      {/* Dropdown Menu */}
                      {activeActionsMenu === row.id && (
                        <>
                          <div
                            style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                            onClick={() => setActiveActionsMenu(null)}
                          />
                          <div style={{
                            position: 'absolute',
                            right: '0.5rem',
                            top: '2.5rem',
                            background: 'white',
                            border: '1px solid var(--border-primary)',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-md)',
                            zIndex: 100,
                            minWidth: '120px',
                            padding: '0.25rem',
                          }}>
                            {rowActions
                              .filter((act) => !act.visible || act.visible(row))
                              .map((act, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    act.action(row)
                                    setActiveActionsMenu(null)
                                  }}
                                  style={{
                                    width: '100%',
                                    padding: '0.5rem 0.75rem',
                                    fontSize: '0.8125rem',
                                    textAlign: 'left',
                                    border: 'none',
                                    background: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    color: act.variant === 'danger' ? 'var(--danger-600)' : 'var(--text-primary)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-50)'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                >
                                  {act.icon}
                                  {act.label}
                                </button>
                              ))}
                          </div>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={processedData.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  )
}
