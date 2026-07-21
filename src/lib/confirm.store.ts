import { create } from 'zustand'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'primary' | 'danger'
  onConfirm: () => Promise<void> | void
}

interface ConfirmState {
  isOpen: boolean
  isLoading: boolean
  options: ConfirmOptions | null
  
  confirm: (options: ConfirmOptions) => void
  close: () => void
  setLoading: (loading: boolean) => void
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  isOpen: false,
  isLoading: false,
  options: null,

  confirm: (options) => set({ 
    isOpen: true, 
    isLoading: false, 
    options 
  }),
  
  close: () => set({ 
    isOpen: false, 
    isLoading: false, 
    // We intentionally don't clear options immediately so the exit animation 
    // doesn't flash empty content before the modal disappears.
    // It's safe because `confirm()` overwrites it fully next time.
  }),

  setLoading: (isLoading) => set({ isLoading }),
}))
