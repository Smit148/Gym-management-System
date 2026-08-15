import { ChevronLeft, ChevronRight } from 'lucide-react'

/** Returns an array of page numbers to display, using -1 for ellipsis gaps. Max 7 slots. */
function getVisiblePages(current: number, total: number): number[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, 4, -1, total]
  if (current >= total - 2) return [1, -1, total - 3, total - 2, total - 1, total]
  return [1, -1, current - 1, current, current + 1, -1, total]
}

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
      flexWrap: 'wrap',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      borderTop: '1px solid var(--border-primary)',
      background: 'var(--gray-50)',
      borderBottomLeftRadius: 'var(--radius-xl)',
      borderBottomRightRadius: 'var(--radius-xl)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
          {startIdx}–{endIdx} of {totalItems}
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <button
          className="btn btn-ghost btn-sm btn-icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ padding: '0.5rem', minWidth: '36px', minHeight: '36px' }}
        >
          <ChevronLeft size={16} />
        </button>
        {getVisiblePages(currentPage, totalPages).map((pageNum, idx) =>
          pageNum === -1 ? (
            <span key={`ellipsis-${idx}`} style={{ padding: '0 0.25rem', color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>…</span>
          ) : (
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
                fontWeight: pageNum === currentPage ? 600 : 400,
                color: pageNum === currentPage ? 'var(--primary-600)' : 'var(--text-secondary)',
                background: pageNum === currentPage ? 'var(--primary-50)' : 'transparent',
                border: pageNum === currentPage ? '1px solid var(--primary-100)' : '1px solid transparent',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
              }}
            >
              {pageNum}
            </button>
          )
        )}
        <button
          className="btn btn-ghost btn-sm btn-icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ padding: '0.5rem', minWidth: '36px', minHeight: '36px' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
