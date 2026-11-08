export interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeAmbiguous: boolean
}

export interface PasswordStrength {
  score: number // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong'
  entropyBits: number
  colorClass: string
  crackTimeEstimate: string
}

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz'
const NUMBER_CHARS = '0123456789'
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?~'

const AMBIGUOUS_CHARS = new Set(['i', 'I', 'l', '1', 'o', 'O', '0', '|', '`', "'", '"'])

/**
 * Filter ambiguous characters from a string
 */
function cleanPool(chars: string, excludeAmbiguous: boolean): string {
  if (!excludeAmbiguous) return chars
  return chars
    .split('')
    .filter((ch) => !AMBIGUOUS_CHARS.has(ch))
    .join('')
}

/**
 * Generates an unbiased cryptographically secure random integer in [0, max - 1]
 * using crypto.getRandomValues and rejection sampling to avoid modulo bias.
 */
function getRandomInt(max: number): number {
  if (max <= 0) return 0
  const randomBuffer = new Uint32Array(1)
  const maxUint32 = 0xffffffff
  const limit = maxUint32 - (maxUint32 % max)

  let randomValue: number
  do {
    window.crypto.getRandomValues(randomBuffer)
    randomValue = randomBuffer[0]
  } while (randomValue >= limit)

  return randomValue % max
}

/**
 * In-place cryptographically secure Fisher-Yates array shuffle
 */
function secureShuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

/**
 * Generates a cryptographically secure password based on provided options.
 * Uses window.crypto.getRandomValues() exclusively. Never uses Math.random().
 */
export function generateSecurePassword(options: PasswordOptions): string {
  const {
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeAmbiguous,
  } = options

  const safeLength = Math.max(4, Math.min(128, length))

  const upperPool = includeUppercase ? cleanPool(UPPERCASE_CHARS, excludeAmbiguous) : ''
  const lowerPool = includeLowercase ? cleanPool(LOWERCASE_CHARS, excludeAmbiguous) : ''
  const numberPool = includeNumbers ? cleanPool(NUMBER_CHARS, excludeAmbiguous) : ''
  const symbolPool = includeSymbols ? cleanPool(SYMBOL_CHARS, excludeAmbiguous) : ''

  const combinedPool = upperPool + lowerPool + numberPool + symbolPool
  if (combinedPool.length === 0) {
    return ''
  }

  const resultChars: string[] = []

  // Guarantee at least one character from each enabled set
  if (upperPool.length > 0) {
    resultChars.push(upperPool[getRandomInt(upperPool.length)])
  }
  if (lowerPool.length > 0) {
    resultChars.push(lowerPool[getRandomInt(lowerPool.length)])
  }
  if (numberPool.length > 0) {
    resultChars.push(numberPool[getRandomInt(numberPool.length)])
  }
  if (symbolPool.length > 0) {
    resultChars.push(symbolPool[getRandomInt(symbolPool.length)])
  }

  // Fill remaining length from combined pool
  while (resultChars.length < safeLength) {
    resultChars.push(combinedPool[getRandomInt(combinedPool.length)])
  }

  // Cryptographically shuffle positions so guaranteed characters are not at predictable indexes
  secureShuffle(resultChars)

  return resultChars.join('')
}

/**
 * Generates multiple secure passwords at once
 */
export function generateMultiplePasswords(options: PasswordOptions, count: number): string[] {
  const validCount = Math.max(1, Math.min(20, count))
  const passwords: string[] = []
  for (let i = 0; i < validCount; i++) {
    passwords.push(generateSecurePassword(options))
  }
  return passwords
}

/**
 * Calculates Shannon entropy and strength grading for a password
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: 'Very Weak',
      entropyBits: 0,
      colorClass: 'bg-rose-500',
      crackTimeEstimate: 'Instant',
    }
  }

  let poolSize = 0
  if (/[a-z]/.test(password)) poolSize += 26
  if (/[A-Z]/.test(password)) poolSize += 26
  if (/[0-9]/.test(password)) poolSize += 10
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32

  const entropy = Math.round(password.length * (poolSize > 0 ? Math.log2(poolSize) : 1))

  let label: PasswordStrength['label']
  let score: number
  let colorClass: string
  let crackTimeEstimate: string

  if (entropy < 36 || password.length < 8) {
    label = 'Very Weak'
    score = 0
    colorClass = 'bg-rose-500'
    crackTimeEstimate = 'Few milliseconds'
  } else if (entropy < 56 || password.length < 10) {
    label = 'Weak'
    score = 1
    colorClass = 'bg-orange-500'
    crackTimeEstimate = 'Few hours to days'
  } else if (entropy < 72 || password.length < 14) {
    label = 'Medium'
    score = 2
    colorClass = 'bg-amber-500'
    crackTimeEstimate = 'Months to few years'
  } else if (entropy < 90 || password.length < 18) {
    label = 'Strong'
    score = 3
    colorClass = 'bg-emerald-500'
    crackTimeEstimate = 'Centuries'
  } else {
    label = 'Very Strong'
    score = 4
    colorClass = 'bg-emerald-600'
    crackTimeEstimate = 'Millions of years'
  }

  return {
    score,
    label,
    entropyBits: entropy,
    colorClass,
    crackTimeEstimate,
  }
}
