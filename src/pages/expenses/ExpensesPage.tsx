import { useState, useMemo } from 'react'
import {
  ArrowUpFromLine,
  Plus,
  TrendingUp,
  Download,
  Calendar,
  AlertTriangle,
  Repeat,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useExpenses } from '@/features/expenses/hooks/useExpenses'
import { AddExpenseModal } from '@/features/expenses/components/AddExpenseModal'
import { DataTable } from '@/organisms/DataTable/DataTable'
import type { ColumnDef } from '@/organisms/DataTable/types'
import type { Expense, ExpenseCategory } from '@/types'
import { exportExpensesPDF } from '@/lib/exports/expenses-pdf'

const categoryLabels: Record<ExpenseCategory, string> = {
  rent: 'Rent & Lease',
  electricity: 'Electricity Bill',
  staff_salary: 'Staff Salary',
  equipment_repair: 'Equipment Repair',
  cleaning: 'Cleaning',
  supplements_purchase: 'Supplements',
  marketing: 'Marketing',
  maintenance: 'Maintenance',
  water: 'Water',
  internet: 'Internet/WiFi',
  other: 'Other Misc',
}

const categoryColors: Record<ExpenseCategory, string> = {
  rent: 'var(--primary-600)',
  electricity: 'var(--warning-600)',
  staff_salary: 'var(--success-600)',
  equipment_repair: 'var(--danger-600)',
  cleaning: '#06B6D4', // Cyan
  supplements_purchase: '#8B5CF6', // Purple
  marketing: '#EC4899', // Pink
  maintenance: '#F59E0B', // Amber
  water: '#3B82F6', // Blue
  internet: '#10B981', // Emerald
  other: 'var(--gray-500)',
}

export function ExpensesPage() {
  const { data: expenses = [], isLoading } = useExpenses()
  const [showAddModal, setShowAddModal] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Calculate summary KPI stats
  const stats = useMemo(() => {
    const totalRecorded = expenses
      .filter((e) => e.status !== 'planned')
      .reduce((sum, e) => sum + e.amount, 0)
    const totalPlanned = expenses
      .filter((e) => e.status === 'planned')
      .reduce((sum, e) => sum + e.amount, 0)
    const recurringCount = expenses.filter((e) => e.is_recurring).length
    
    // Sum of salaries & rent
    const majorOpex = expenses
      .filter((e) => (e.category === 'rent' || e.category === 'staff_salary') && e.status !== 'planned')
      .reduce((sum, e) => sum + e.amount, 0)

    return {
      totalRecorded,
      totalPlanned,
      recurringCount,
      majorOpex,
    }
  }, [expenses])

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    if (categoryFilter === 'all') return expenses
    return expenses.filter((e) => e.category === categoryFilter)
  }, [expenses, categoryFilter])

  // Define columns for DataTable
  const columns: ColumnDef<Expense>[] = [
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (expense) => (
        <div className="flex items-center gap-2">
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: categoryColors[expense.category] || 'var(--gray-400)',
            }}
          />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {categoryLabels[expense.category] || expense.category}
          </span>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (expense) => (
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          {formatCurrency(expense.amount)}
        </span>
      ),
    },
    {
      key: 'expense_date',
      header: 'Billing Date',
      sortable: true,
      render: (expense) => (
        <div className="flex items-center gap-1.5" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <Calendar size={12} style={{ color: 'var(--text-tertiary)' }} />
          {formatDate(expense.expense_date)}
        </div>
      ),
    },
    {
      key: 'is_recurring',
      header: 'Billing Cycle',
      render: (expense) =>
        expense.is_recurring ? (
          <span className="badge badge-trial" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Repeat size={10} />
            {expense.frequency?.toUpperCase() || 'RECURRING'}
          </span>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>One-time</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (expense) => (
        <span className={`badge ${expense.status === 'planned' ? 'badge-pending' : 'badge-expired'}`}>
          {expense.status === 'planned' ? 'Planned' : 'Paid'}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (expense) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }} className="truncate max-w-xs block">
          {expense.description || '—'}
        </span>
      ),
    },
  ]

  // Export to CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,'
    csvContent += 'Category,Amount,Date,Recurring,Frequency,Status,Description\n'
    
    expenses.forEach((e) => {
      csvContent += `"${categoryLabels[e.category] || e.category}",${e.amount},"${formatDate(e.expense_date)}",${e.is_recurring},"${e.frequency || ''}","${e.status || 'recorded'}","${e.description || ''}"\n`
    })

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'gymos_expenses_ledger.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportPDF = () => {
    exportExpensesPDF(expenses, stats.totalRecorded, stats.totalPlanned)
  }

  return (
    <div className="page-enter">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses Ledger</h1>
          <p className="page-subtitle">Track operational cash outflows, scheduled vendor bills, and payroll</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={16} />
            Export CSV
          </button>
          <button className="btn btn-secondary" onClick={handleExportPDF}>
            <Download size={16} />
            Export PDF
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ background: 'var(--danger-600)', borderColor: 'var(--danger-600)' }}>
            <Plus size={16} />
            Record Expense
          </button>
        </div>
      </div>

      {/* KPI statistics cards */}
      <div className="grid-stats" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))' }}>
        {/* Total Expenses */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--danger-50)', color: 'var(--danger-600)' }}>
            <ArrowUpFromLine size={20} />
          </div>
          <div className="stat-card-value">{formatCurrency(stats.totalRecorded)}</div>
          <div className="stat-card-label">Total Outflows Paid</div>
          <div className="stat-card-sublabel">Completed settlements</div>
        </div>

        {/* Major Opex */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-card-value">{formatCurrency(stats.majorOpex)}</div>
          <div className="stat-card-label">Rent & Salaries</div>
          <div className="stat-card-sublabel">Core premise/staff opex</div>
        </div>

        {/* Recurring Bills */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--info-50)', color: 'var(--info-600)' }}>
            <Repeat size={20} />
          </div>
          <div className="stat-card-value">{stats.recurringCount}</div>
          <div className="stat-card-label">Recurring Profiles</div>
          <div className="stat-card-sublabel">Subscriptions / monthly leases</div>
        </div>

        {/* Budgeted / Planned */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--warning-50)', color: 'var(--warning-600)' }}>
            <AlertTriangle size={20} />
          </div>
          <div className="stat-card-value">{formatCurrency(stats.totalPlanned)}</div>
          <div className="stat-card-label">Planned & Budgeted</div>
          <div className="stat-card-sublabel">Upcoming expected liabilities</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)', marginBottom: '0.5rem', overflowX: 'auto' }}>
          {([
            { value: 'all', label: 'All Expenses' },
            { value: 'rent', label: 'Premises Rent' },
            { value: 'staff_salary', label: 'Staff Payroll' },
            { value: 'electricity', label: 'Electricity' },
            { value: 'equipment_repair', label: 'Equipment Repair' },
            { value: 'marketing', label: 'Marketing' },
            { value: 'other', label: 'Other Misc' },
          ]).map((tab) => (
            <button
              key={tab.value}
              onClick={() => setCategoryFilter(tab.value)}
              style={{
                padding: '0.75rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: categoryFilter === tab.value ? 600 : 400,
                color: categoryFilter === tab.value ? 'var(--primary-600)' : 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                borderBottom: categoryFilter === tab.value ? '2px solid var(--primary-600)' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <DataTable
          data={filteredExpenses}
          columns={columns}
          searchPlaceholder="Search by category or description..."
          searchField={(expense: Expense, query: string) => {
            const cat = (categoryLabels[expense.category] || expense.category).toLowerCase()
            const desc = (expense.description || '').toLowerCase()
            return cat.includes(query) || desc.includes(query)
          }}
          isLoading={isLoading}
          emptyState={{
            title: 'No expenses logged',
            message: 'There are no logged items matching your search/filters.',
          }}
        />
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <AddExpenseModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  )
}
