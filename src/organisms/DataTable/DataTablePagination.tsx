import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DataTablePaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange?: (items: number) => void
}

export function DataTablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: DataTablePaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="data-table-pagination" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Showing {totalItems} of {totalItems} items
        </span>
      </div>
    )
  }

  const startIdx = (currentPage - 1) * itemsPerPage + 1
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="data-table-pagination" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem',
      borderTop: '1px solid var(--border-primary)',
      background: 'var(--gray-50)',
      borderBottomLeftRadius: 'var(--radius-xl)',
      borderBottomRightRadius: 'var(--radius-xl)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Showing {startIdx} to {endIdx} of {totalItems} items
        </span>
        {onItemsPerPageChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.8125rem',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                background: 'white',
                outline: 'none',
              }}
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        <button
          className="btn btn-ghost btn-sm btn-icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ padding: '0.5rem' }}
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1
          const isCurrent = pageNum === currentPage
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              style={{
                minWidth: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8125rem',
                fontWeight: isCurrent ? 600 : 400,
                color: isCurrent ? 'var(--primary-600)' : 'var(--text-secondary)',
                background: isCurrent ? 'var(--primary-50)' : 'transparent',
                border: isCurrent ? '1px solid var(--primary-100)' : '1px solid transparent',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
              }}
            >
              {pageNum}
            </button>
          )
        })}
        <button
          className="btn btn-ghost btn-sm btn-icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ padding: '0.5rem' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
