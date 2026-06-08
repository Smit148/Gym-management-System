import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { FilterDef } from './types'

interface DataTableToolbarProps {
  searchPlaceholder?: string
  onSearchChange: (query: string) => void
  filters?: FilterDef[]
  selectedFilters: Record<string, string>
  onFilterChange: (key: string, value: string) => void
}

export function DataTableToolbar({
  searchPlaceholder = 'Search...',
  onSearchChange,
  filters = [],
  selectedFilters,
  onFilterChange,
}: DataTableToolbarProps) {
  const [searchValue, setSearchValue] = useState('')

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(searchValue)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [searchValue, onSearchChange])

  const hasActiveFilters = Object.values(selectedFilters).some(v => v !== '' && v !== 'all')

  const clearAllFilters = () => {
    filters.forEach(f => onFilterChange(f.key, ''))
    setSearchValue('')
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      padding: '1rem',
      background: 'white',
      borderTopLeftRadius: 'var(--radius-xl)',
      borderTopRightRadius: 'var(--radius-xl)',
      borderBottom: '1px solid var(--border-primary)',
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
      }}>
        {/* Search */}
        <div className="search-bar" style={{ maxWidth: '360px', flex: 1, margin: 0 }}>
          <Search className="search-bar-icon" size={16} />
          <input
            className="search-bar-input"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue('')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters Selectors */}
        {filters.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              color: 'var(--text-secondary)',
              fontSize: '0.8125rem',
              marginRight: '0.25rem',
            }}>
              <SlidersHorizontal size={14} />
              <span>Filters:</span>
            </div>

            {filters.map((filter) => (
              <select
                key={filter.key}
                value={selectedFilters[filter.key] || ''}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                style={{
                  padding: '0.375rem 1.75rem 0.375rem 0.75rem',
                  fontSize: '0.8125rem',
                  color: 'var(--text-primary)',
                  background: 'white',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-lg)',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">All {filter.label}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}

            {hasActiveFilters && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={clearAllFilters}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', color: 'var(--danger-600)' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
