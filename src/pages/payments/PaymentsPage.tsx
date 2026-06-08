import { useState, useMemo } from 'react'
import {
  CreditCard,
  Plus,
  TrendingUp,
  DollarSign,
  Receipt,
  Download,
  Calendar,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { usePayments } from '@/features/payments/hooks/usePayments'
import { RecordPaymentModal } from '@/features/payments/components/RecordPaymentModal'
import { PaymentDetailDrawer } from '@/features/payments/components/PaymentDetailDrawer'
import { DataTable } from '@/organisms/DataTable/DataTable'
import type { ColumnDef } from '@/organisms/DataTable/types'
import type { Payment } from '@/types'

export function PaymentsPage() {
  const { data: payments = [], isLoading } = usePayments()

  const [showRecordModal, setShowRecordModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [methodFilter, setMethodFilter] = useState<string>('all')

  // Calculate top KPI stats from payments data
  const stats = useMemo(() => {
    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0)
    const count = payments.length
    
    // Payments by method
    const methodCounts: Record<string, number> = { upi: 0, cash: 0, bank_transfer: 0, card: 0 }
    payments.forEach((p) => {
      const m = p.payment_method.toLowerCase()
      if (m in methodCounts) {
        methodCounts[m] += p.amount
      }
    })

    return {
      totalCollected,
      count,
      methodCounts,
    }
  }, [payments])

  // Filter payments
  const filteredPayments = useMemo(() => {
    if (methodFilter === 'all') return payments
    return payments.filter((p) => p.payment_method === methodFilter)
  }, [payments, methodFilter])

  // Define Columns for generic DataTable
  const columns: ColumnDef<Payment>[] = [
    {
      key: 'receipt_number',
      header: 'Receipt No.',
      sortable: true,
      render: (payment) => (
        <span style={{ fontWeight: 600, color: 'var(--primary-600)', fontFamily: 'monospace' }}>
          {payment.receipt_number || 'Receipt Draft'}
        </span>
      ),
    },
    {
      key: 'member_name',
      header: 'Member',
      sortable: true,
      render: (payment) => (
        <div>
          <div style={{ fontWeight: 500 }}>{payment.member_name || 'Member'}</div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
            ID: {payment.member_id}
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (payment) => (
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          {formatCurrency(payment.amount)}
        </span>
      ),
    },
    {
      key: 'payment_method',
      header: 'Payment Method',
      render: (payment) => (
        <span className="badge badge-new" style={{ textTransform: 'uppercase', fontSize: '0.6875rem' }}>
          {payment.payment_method}
        </span>
      ),
    },
    {
      key: 'paid_at',
      header: 'Paid Date',
      sortable: true,
      render: (payment) => (
        <div className="flex items-center gap-1.5" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <Calendar size={12} style={{ color: 'var(--text-tertiary)' }} />
          {formatDate(payment.paid_at)}
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (payment) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }} className="truncate max-w-xs block">
          {payment.description || '—'}
        </span>
      ),
    },
  ]

  // Export payments list to CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,'
    csvContent += 'Receipt No,Member Name,Member ID,Amount,Payment Method,Date,Description\n'
    
    payments.forEach((p) => {
      csvContent += `"${p.receipt_number || ''}","${p.member_name || ''}","${p.member_id}",${p.amount},"${p.payment_method}","${formatDate(p.paid_at)}","${p.description || ''}"\n`
    })

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'gymos_payments_history.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="page-enter">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Payments Ledger</h1>
          <p className="page-subtitle">Track collections, view invoices, and record membership payments</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <Download size={16} />
            Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setShowRecordModal(true)}>
            <Plus size={16} />
            Record Collection
          </button>
        </div>
      </div>

      {/* KPI metrics cards */}
      <div className="grid-stats" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {/* Total Revenue */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--success-50)', color: 'var(--success-600)' }}>
            <DollarSign size={20} />
          </div>
          <div className="stat-card-value">{formatCurrency(stats.totalCollected)}</div>
          <div className="stat-card-label">Total Dues Collected</div>
          <div className="stat-card-sublabel">From {stats.count} transactions</div>
        </div>

        {/* UPI Payments */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-card-value">{formatCurrency(stats.methodCounts.upi)}</div>
          <div className="stat-card-label">UPI Transactions</div>
          <div className="stat-card-sublabel">Instant bank transfers</div>
        </div>

        {/* Cash Payments */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--warning-50)', color: 'var(--warning-600)' }}>
            <Receipt size={20} />
          </div>
          <div className="stat-card-value">{formatCurrency(stats.methodCounts.cash)}</div>
          <div className="stat-card-label">Cash In Hand</div>
          <div className="stat-card-sublabel">Physical handovers</div>
        </div>

        {/* Card/Bank Transfer */}
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--info-50)', color: 'var(--info-600)' }}>
            <CreditCard size={20} />
          </div>
          <div className="stat-card-value">{formatCurrency(stats.methodCounts.card + stats.methodCounts.bank_transfer)}</div>
          <div className="stat-card-label">Card & Transfers</div>
          <div className="stat-card-sublabel">Card payments and bank wires</div>
        </div>
      </div>

      {/* Filter Tabs & DataTable */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1rem' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)', marginBottom: '0.5rem' }}>
          {([
            { value: 'all', label: 'All Transactions' },
            { value: 'upi', label: 'UPI' },
            { value: 'cash', label: 'Cash' },
            { value: 'card', label: 'Card' },
            { value: 'bank_transfer', label: 'Bank Transfer' },
          ]).map((tab) => (
            <button
              key={tab.value}
              onClick={() => setMethodFilter(tab.value)}
              style={{
                padding: '0.75rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: methodFilter === tab.value ? 600 : 400,
                color: methodFilter === tab.value ? 'var(--primary-600)' : 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                borderBottom: methodFilter === tab.value ? '2px solid var(--primary-600)' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <DataTable
          data={filteredPayments}
          columns={columns}
          searchPlaceholder="Search by member name..."
          searchField="member_name"
          isLoading={isLoading}
          emptyState={{
            title: 'No payment logs found',
            message: 'No transactions match your current search/filter parameters.',
          }}
          rowActions={[
            {
              label: 'View Receipt',
              action: (payment) => setSelectedPayment(payment),
            },
          ]}
        />
      </div>

      {/* Record Payment Modal */}
      {showRecordModal && (
        <RecordPaymentModal onClose={() => setShowRecordModal(false)} />
      )}

      {/* Detail Drawer */}
      {selectedPayment && (
        <PaymentDetailDrawer
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  )
}
