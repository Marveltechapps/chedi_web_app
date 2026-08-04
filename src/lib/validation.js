/** Client-side validation helpers aligned with backend rules. */

/** Strip letters and other invalid chars from phone fields as the user types. */
export function sanitizePhoneInput(value) {
  const raw = String(value || '')
  // Digits, optional leading +, spaces, hyphens, parentheses only
  let out = ''
  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw[i]
    if (ch >= '0' && ch <= '9') out += ch
    else if (ch === '+' && out.length === 0) out += ch
    else if (ch === ' ' || ch === '-' || ch === '(' || ch === ')') out += ch
  }
  return out.slice(0, 18)
}

export function normalizePhone(input) {
  if (!input || typeof input !== 'string') return null
  let digits = input.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) {
    digits = '+' + digits.slice(1).replace(/\D/g, '')
  } else {
    digits = digits.replace(/\D/g, '')
  }
  if (digits.startsWith('+91') && digits.length === 13) return digits
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`
  if (/^\d{10}$/.test(digits)) return `+91${digits}`
  return null
}

export function isValidIndianMobile(value) {
  const e164 = normalizePhone(value)
  return /^\+91[6-9]\d{9}$/.test(e164 || '')
}

export function phoneValidationMessage(value) {
  const raw = String(value || '').trim()
  if (!raw) return 'Mobile number is required.'
  if (/[A-Za-z]/.test(raw)) return 'Mobile number cannot contain letters.'
  if (!isValidIndianMobile(raw)) {
    return 'Enter a valid 10-digit Indian mobile number (starting with 6–9).'
  }
  return ''
}

export function isValidEmail(value) {
  const email = String(value || '').trim()
  if (!email || email.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

export function isValidPin(value) {
  return /^\d{6}$/.test(String(value || '').trim())
}

export function isValidName(value) {
  const name = String(value || '').trim()
  return name.length >= 2 && name.length <= 80
}

export function isValidOtp(value) {
  return /^\d{4}$/.test(String(value || '').trim())
}

export function isValidCardNumber(value) {
  const digits = String(value || '').replace(/\s/g, '')
  return /^\d{15,16}$/.test(digits)
}

export function isValidCardExpiry(value) {
  const exp = String(value || '').trim()
  if (!/^\d{2}\/\d{2}$/.test(exp)) return false
  const month = Number(exp.slice(0, 2))
  return month >= 1 && month <= 12
}

export function isValidCvv(value) {
  return /^\d{3,4}$/.test(String(value || '').trim())
}

export function validateJoinForm(form) {
  const errors = {}
  if (!String(form.name || '').trim()) errors.name = 'Full name is required.'
  else if (!isValidName(form.name)) errors.name = 'Enter your full name (2–80 characters).'

  const phoneMsg = phoneValidationMessage(form.phone)
  if (phoneMsg) errors.phone = phoneMsg

  if (!String(form.email || '').trim()) errors.email = 'Email is required.'
  else if (!isValidEmail(form.email)) errors.email = 'Enter a valid email address.'

  if (!String(form.address || '').trim()) errors.address = 'Delivery address is required.'
  else if (String(form.address).trim().length < 5) errors.address = 'Enter a complete delivery address.'

  if (!String(form.city || '').trim()) errors.city = 'City is required.'
  else if (String(form.city).trim().length < 2) errors.city = 'Enter your city.'

  if (!String(form.pin || '').trim()) errors.pin = 'PIN is required.'
  else if (!isValidPin(form.pin)) errors.pin = 'PIN must be a 6-digit number.'

  return errors
}

export function validateAddressForm(addr) {
  const errors = {}
  if (!String(addr.line || '').trim()) errors.line = 'Address is required.'
  else if (String(addr.line).trim().length < 5) errors.line = 'Enter a complete address line.'

  if (!String(addr.city || '').trim()) errors.city = 'City is required.'
  else if (String(addr.city).trim().length < 2) errors.city = 'Enter your city.'

  if (!String(addr.pin || '').trim()) errors.pin = 'PIN is required.'
  else if (!isValidPin(addr.pin)) errors.pin = 'PIN must be a 6-digit number.'

  return errors
}

export function validateProfileDraft(draft) {
  const errors = {}
  if (!String(draft.name || '').trim()) errors.name = 'Full name is required.'
  else if (!isValidName(draft.name)) errors.name = 'Enter your full name (2–80 characters).'

  if (!String(draft.email || '').trim()) errors.email = 'Email is required.'
  else if (!isValidEmail(draft.email)) errors.email = 'Enter a valid email address.'

  return errors
}

export function validateCardFields({ name, number, expiry, cvv }) {
  const errors = {}
  if (!String(name || '').trim()) errors.name = 'Cardholder name is required.'
  if (!isValidCardNumber(number)) errors.number = 'Enter a valid 15–16 digit card number.'
  if (!isValidCardExpiry(expiry)) errors.expiry = 'Use MM/YY expiry format.'
  if (!isValidCvv(cvv)) errors.cvv = 'Enter a valid 3–4 digit CVV.'
  return errors
}

export function firstError(errors) {
  const keys = Object.keys(errors || {})
  return keys.length ? errors[keys[0]] : ''
}

/**
 * Map API error details / known codes onto field error objects for forms.
 */
export function mapApiFormErrors(err, fieldMap = {}) {
  const fieldErrors = {}
  ;(err?.details || []).forEach((d) => {
    if (!d?.field) return
    const key = fieldMap[d.field] || d.field
    fieldErrors[key] = d.message || 'Invalid value.'
  })

  const code = err?.code
  if (code === 'PHONE_ALREADY_REGISTERED' && !fieldErrors.phone) {
    fieldErrors.phone = err.message || 'This phone is already registered.'
  }
  if (code === 'EMAIL_ALREADY_REGISTERED' && !fieldErrors.email) {
    fieldErrors.email = err.message || 'This email is already registered.'
  }
  if (code === 'ALREADY_MEMBER' && !fieldErrors.email) {
    fieldErrors.email = err.message || 'This account is already a member. Please log in.'
  }

  return fieldErrors
}
