import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (format === 'relative') {
    return getRelativeTime(d)
  }

  if (format === 'long') {
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay === 1) return 'yesterday'
  if (diffDay < 7) return `${diffDay}d ago`
  return formatDate(date, 'short')
}

export function formatPhone(phone: string): string {
  if (phone.startsWith('+91') && phone.length === 13) {
    return `+91 ${phone.slice(3, 8)} ${phone.slice(8)}`
  }
  return phone
}

export function getInitials(firstName: string, lastName?: string): string {
  const first = firstName.charAt(0).toUpperCase()
  const last = lastName ? lastName.charAt(0).toUpperCase() : ''
  return `${first}${last}`
}

export function generateMemberCode(sequence: number): string {
  return `GYM-${String(sequence).padStart(5, '0')}`
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
