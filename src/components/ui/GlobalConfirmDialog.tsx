import { AlertTriangle, Loader2 } from 'lucide-react'
import { FocusTrap } from 'focus-trap-react'
import { useConfirmStore } from '@/lib/confirm.store'

export function GlobalConfirmDialog() {
  const { isOpen, isLoading, options, close, setLoading } = useConfirmStore()

  if (!isOpen || !options) return null

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await options.onConfirm()
      close()
    } catch (error) {
      console.error('Confirmation action failed:', error)
      // We always close it to prevent getting stuck in a loading state. 
      // Individual actions should trigger their own toast errors.
      close()
    }
  }

  return (
    <div className="drawer-overlay" style={{ opacity: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 1000 }}>
      <FocusTrap focusTrapOptions={{
        onDeactivate: close,
        initialFocus: '#global-confirm-cancel',
        fallbackFocus: '.card',
        clickOutsideDeactivates: true
      }}>
      <div 
        className="card" 
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          padding: '1.5rem', 
          animation: 'slideUp 0.2s ease-out',
          position: 'relative'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: options.variant === 'danger' ? 'var(--danger-50)' : 'var(--primary-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertTriangle size={20} style={{ color: options.variant === 'danger' ? 'var(--danger-600)' : 'var(--primary-600)' }} />
          </div>
          <div>
            <h3 id="confirm-dialog-title" style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {options.title}
            </h3>
            {options.description && (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {options.description}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button 
            id="global-confirm-cancel"
            className="btn btn-secondary" 
            onClick={close}
            disabled={isLoading}
          >
            {options.cancelLabel || 'Cancel'}
          </button>
          
          <button 
            className={`btn ${options.variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleConfirm}
            disabled={isLoading}
            style={{ minWidth: '100px', display: 'flex', justifyContent: 'center' }}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              options.confirmLabel || 'Confirm'
            )}
          </button>
        </div>
      </div>
      </FocusTrap>
    </div>
  )
}
