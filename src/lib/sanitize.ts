/**
 * Input sanitizer — strips dangerous HTML/script content from user inputs.
 * Prevents stored XSS attacks where malicious input is saved and rendered later.
 */

const DANGEROUS_PATTERNS = [
  /<script\b[^>]*>[\s\S]*?<\/script>/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi,
  /javascript\s*:/gi,
  /data\s*:\s*text\/html/gi,
  /vbscript\s*:/gi,
]

/** Strip dangerous HTML patterns from a string */
export function sanitizeInput(input: string): string {
  let clean = input
  for (const pattern of DANGEROUS_PATTERNS) {
    clean = clean.replace(pattern, '')
  }
  // Strip HTML tags but keep text content
  clean = clean.replace(/<[^>]*>/g, '')
  return clean.trim()
}

/** Sanitize all string values in an object (one level deep) */
export function sanitizeFormData<T extends Record<string, unknown>>(data: T): T {
  const sanitized = { ...data }
  for (const key of Object.keys(sanitized)) {
    const val = sanitized[key]
    if (typeof val === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeInput(val)
    }
  }
  return sanitized
}

/** Validate and sanitize a phone number — keep only digits and leading + */
export function sanitizePhone(phone: string): string {
  // Allow leading + for country code, then only digits
  const cleaned = phone.replace(/[^\d+]/g, '')
  // Ensure + is only at the start
  if (cleaned.startsWith('+')) {
    return '+' + cleaned.slice(1).replace(/\+/g, '')
  }
  return cleaned.replace(/\+/g, '')
}

/** Validate email format strictly */
export function isValidEmail(email: string): boolean {
  // RFC 5322 simplified — catches 99% of real emails
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return re.test(email)
}
