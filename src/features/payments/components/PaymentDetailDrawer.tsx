import { X, Printer, Share2, User, CheckCircle2, FileText } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useMemberships } from '@/features/members/hooks/useMembers'
import type { Payment } from '@/types'

interface PaymentDetailDrawerProps {
  payment: Payment
  onClose: () => void
}

export function PaymentDetailDrawer({ payment, onClose }: PaymentDetailDrawerProps) {
  const { data: memberships = [] } = useMemberships()

  // Find associated membership plan details
  const membership = memberships.find((m) => m.id === payment.membership_id)

  const handlePrint = () => {
    // In a production app this would render a clean PDF or print view. We'll simulate it.
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${payment.receipt_number || payment.id}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: bold; color: #4f46e5; }
              .title { font-size: 28px; text-align: right; text-transform: uppercase; letter-spacing: 1px; color: #475569; }
              .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
              .meta-block h3 { margin-top: 0; color: #64748b; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; padding-bottom: 5px; }
              .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
              .table th { background: #f8fafc; text-align: left; padding: 12px; font-size: 14px; color: #475569; border-bottom: 1px solid #e2e8f0; }
              .table td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
              .totals { display: flex; flex-direction: column; align-items: flex-end; margin-top: 20px; }
              .total-row { display: flex; gap: 40px; font-size: 14px; margin-bottom: 8px; }
              .grand-total { font-size: 18px; font-weight: bold; color: #1e293b; margin-top: 10px; border-top: 2px solid #e2e8f0; padding-top: 10px; }
              .footer { text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 60px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="logo">GymOS</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 5px;">Enterprise Gym Management SaaS</div>
              </div>
              <div>
                <div class="title">Payment Receipt</div>
                <div style="font-size: 14px; font-weight: bold; color: #1e293b;">${payment.receipt_number || 'Receipt Draft'}</div>
              </div>
            </div>
            
            <div class="meta-grid">
              <div class="meta-block">
                <h3>Billed To</h3>
                <strong>${payment.member_name || 'Valued Member'}</strong><br/>
                Member ID: ${payment.member_id}<br/>
                Payment Date: ${formatDate(payment.paid_at)}
              </div>
              <div class="meta-block">
                <h3>Payment Info</h3>
                Method: ${payment.payment_method.toUpperCase()}<br/>
                Status: Completed<br/>
                ${payment.reference_number ? `Transaction Ref: ${payment.reference_number}` : ''}
              </div>
            </div>

            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>${membership?.plan_name || 'Gym Membership Renewal'}</strong><br/>
                    ${membership ? `Validity: ${formatDate(membership.start_date)} to ${formatDate(membership.end_date)}` : 'Manual charge / outstanding balance collection'}
                  </td>
                  <td style="text-align: right;">₹${payment.amount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>

            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <strong>₹${payment.amount.toLocaleString('en-IN')}</strong>
              </div>
              <div class="total-row">
                <span>Tax (0%):</span>
                <strong>₹0</strong>
              </div>
              <div class="total-row grand-total">
                <span>Total Paid:</span>
                <span>₹${payment.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div class="footer">
              Thank you for training with us! For support, contact info@gymos.co
            </div>
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const handleShareWhatsApp = () => {
    const message = `Hi ${payment.member_name || 'Member'}, we have received your payment of ₹${payment.amount} via ${payment.payment_method.toUpperCase()}. Receipt No: ${payment.receipt_number || 'Draft'}. Thank you for choosing GymOS!`
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer" style={{ maxWidth: '480px' }}>
        {/* Header */}
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} style={{ color: 'var(--primary-500)' }} />
              Invoice Receipt
            </h2>
            <div className="flex items-center gap-2" style={{ marginTop: '0.25rem' }}>
              <span className="badge badge-converted">
                <CheckCircle2 size={12} style={{ marginRight: '4px' }} />
                Paid
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                {payment.receipt_number || 'Receipt Draft'}
              </span>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.25rem' }}>
          
          {/* Amount Showcase Card */}
          <div style={{
            background: 'var(--primary-50)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            textAlign: 'center',
            border: '1px dashed var(--primary-200)',
          }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--primary-700)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Amount Collected
            </span>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary-900)', marginTop: '0.25rem' }}>
              {formatCurrency(payment.amount)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', marginTop: '0.25rem' }}>
              Paid via {payment.payment_method.toUpperCase()} on {formatDate(payment.paid_at, 'long')}
            </div>
          </div>

          {/* Member Details */}
          <div>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
              Member Details
            </h3>
            <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--gray-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)'
              }}>
                <User size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {payment.member_name || 'Member'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  ID: {payment.member_id}
                </div>
              </div>
            </div>
          </div>

          {/* Plan Breakdown */}
          {membership && (
            <div>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                Membership Association
              </h3>
              <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {membership.plan_name || 'Membership Plan'}
                  </span>
                  <span className="badge badge-new" style={{ fontSize: '0.6875rem' }}>
                    {formatCurrency(membership.actual_price - membership.discount_amount)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>Validity Dates:</span>
                  <strong>{formatDate(membership.start_date)} to {formatDate(membership.end_date)}</strong>
                </div>
                <div style={{ borderTop: '1px solid var(--border-secondary)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>Outstanding Payment Status:</span>
                  <strong style={{
                    color: membership.payment_status === 'paid' ? 'var(--success-600)' : 'var(--warning-600)'
                  }}>
                    {membership.payment_status.toUpperCase()}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Transaction Metadata */}
          <div>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
              Transaction Log
            </h3>
            <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="flex justify-between" style={{ fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Payment Mode</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  {payment.payment_method}
                </span>
              </div>
              <div className="flex justify-between" style={{ fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Transaction Ref</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                  {payment.reference_number || 'N/A'}
                </span>
              </div>
              {payment.description && (
                <div style={{ borderTop: '1px solid var(--border-secondary)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Notes</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{payment.description}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="drawer-footer" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handleShareWhatsApp}>
            <Share2 size={16} style={{ marginRight: '6px' }} />
            Share WhatsApp
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} style={{ marginRight: '6px' }} />
            Print Receipt
          </button>
        </div>
      </div>
    </>
  )
}
