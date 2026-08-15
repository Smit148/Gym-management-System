import { create } from 'zustand'
import { useEffect, useRef } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react'

// ─── Store ───
type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (type: ToastType, message: string, duration?: number) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>()((set) => ({
  toasts: [],
  addToast: (type, message, duration = 4000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    set((s) => ({ toasts: [...s.toasts, { id, type, message, duration }] }))
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

/** Convenience helpers */
export const toast = {
  success: (msg: string) => useToastStore.getState().addToast('success', msg),
  error: (msg: string) => useToastStore.getState().addToast('error', msg, 6000),
  warning: (msg: string) => useToastStore.getState().addToast('warning', msg),
  info: (msg: string) => useToastStore.getState().addToast('info', msg),
}

// ─── Icons & Colors ───
const toastConfig: Record<ToastType, { Icon: typeof CheckCircle2; bg: string; border: string; color: string }> = {
  success: { Icon: CheckCircle2, bg: 'var(--success-50)', border: 'var(--success-200)', color: 'var(--success-600)' },
  error: { Icon: XCircle, bg: 'var(--danger-50)', border: 'var(--danger-200)', color: 'var(--danger-600)' },
  warning: { Icon: AlertTriangle, bg: 'var(--warning-50)', border: 'var(--warning-200)', color: 'var(--warning-600)' },
  info: { Icon: Info, bg: 'var(--info-50)', border: 'var(--info-200)', color: 'var(--info-600)' },
}

// ─── Single Toast Item ───
function ToastItem({ t, onRemove }: { t: Toast; onRemove: () => void }) {
  const { Icon, bg, border, color } = toastConfig[t.type]
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!t.duration) return
    const timer = setTimeout(() => {
      if (ref.current) {
        ref.current.style.animation = 'toastSlideOut 0.25s ease forwards'
        setTimeout(onRemove, 260)
      }
    }, t.duration)
    return () => clearTimeout(timer)
  }, [t.duration, onRemove])

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.625rem',
        padding: '0.75rem 1rem',
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        animation: 'toastSlideIn 0.25s ease forwards',
        maxWidth: '380px',
        minWidth: '260px',
      }}
    >
      <Icon size={18} style={{ color, flexShrink: 0, marginTop: '1px' }} />
      <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.5, flex: 1 }}>
        {t.message}
      </span>
      <button
        onClick={onRemove}
        aria-label="Dismiss notification"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-tertiary)', flexShrink: 0 }}
      >
        <X size={14} />
      </button>
    </div>
  )
}

// ─── Container ───
export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  if (toasts.length === 0) return null

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        pointerEvents: 'auto',
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} t={t} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  )
}
