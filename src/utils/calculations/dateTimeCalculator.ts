/**
 * Date & Time Calculator Core Engine
 * Timezone-safe local calendar arithmetic, leap year validation, and business working days.
 */

export interface DateDifferenceResult {
  years: number
  months: number
  days: number
  totalDays: number
  totalWeeks: number
  remainingDaysAfterWeeks: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
  workingDays: number // Monday to Friday
  weekendDays: number // Saturday & Sunday
  isReversed: boolean
  formattedSummary: string
}

export interface AddSubtractResult {
  targetDate: string // YYYY-MM-DD
  formattedDate: string // e.g. Friday, 12 December 2026
  dayOfWeek: string
  isWeekend: boolean
  relativeDays: number
}

export interface CountdownResult {
  isPast: boolean
  days: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
  workingDaysLeft: number
  formattedTarget: string
}

/**
 * Checks whether a given year is a leap year in the Gregorian calendar
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * Returns exact days in a given month (0-indexed month)
 */
export function getDaysInMonth(year: number, monthIndex: number): number {
  const daysInMonths = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return daysInMonths[monthIndex] ?? 30
}

/**
 * Parses YYYY-MM-DD safely at local noon (12:00:00) to avoid any timezone boundary slips
 */
export function parseLocalDate(dateStr: string): Date {
  const parts = dateStr.split('-').map(Number)
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return new Date()
  }
  return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0)
}

/**
 * Formats a Date object to YYYY-MM-DD
 */
export function formatLocalDateToISO(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Formats a date into a human readable string (e.g., "Monday, 15 August 2026")
 */
export function formatHumanDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Calculates exact date difference with year/month/day breakdown and working days
 */
export function calculateDateDifference(
  startDateStr: string,
  endDateStr: string,
  includeEndDate = false
): DateDifferenceResult {
  let start = parseLocalDate(startDateStr)
  let end = parseLocalDate(endDateStr)

  const isReversed = start.getTime() > end.getTime()
  if (isReversed) {
    const temp = start
    start = end
    end = temp
  }

  // Exact calendar difference in years, months, and days
  let sYear = start.getFullYear()
  let sMonth = start.getMonth()
  let sDay = start.getDate()

  const eYear = end.getFullYear()
  const eMonth = end.getMonth()
  let eDay = end.getDate()

  if (includeEndDate) {
    eDay += 1
  }

  let years = eYear - sYear
  let months = eMonth - sMonth
  let days = eDay - sDay

  if (days < 0) {
    // Borrow days from previous month
    const prevMonth = (eMonth - 1 + 12) % 12
    const prevYear = eMonth === 0 ? eYear - 1 : eYear
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth)
    days += daysInPrevMonth
    months -= 1
  }

  if (months < 0) {
    months += 12
    years -= 1
  }

  // Total calendar days
  const oneDayMs = 24 * 60 * 60 * 1000
  let totalDays = Math.round((end.getTime() - start.getTime()) / oneDayMs)
  if (includeEndDate) {
    totalDays += 1
  }

  // Calculate working days (Monday-Friday) and weekend days (Saturday-Sunday)
  let workingDays = 0
  let weekendDays = 0
  const loopDate = new Date(start)
  const loopEnd = new Date(end)
  if (includeEndDate) {
    loopEnd.setDate(loopEnd.getDate() + 1)
  }

  while (loopDate < loopEnd) {
    const dayOfWeek = loopDate.getDay() // 0 = Sunday, 6 = Saturday
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++
    } else {
      workingDays++
    }
    loopDate.setDate(loopDate.getDate() + 1)
  }

  const totalWeeks = Math.floor(totalDays / 7)
  const remainingDaysAfterWeeks = totalDays % 7
  const totalHours = totalDays * 24
  const totalMinutes = totalHours * 60
  const totalSeconds = totalMinutes * 60

  const summaryParts: string[] = []
  if (years > 0) summaryParts.push(`${years} ${years === 1 ? 'Year' : 'Years'}`)
  if (months > 0) summaryParts.push(`${months} ${months === 1 ? 'Month' : 'Months'}`)
  if (days > 0 || summaryParts.length === 0) summaryParts.push(`${days} ${days === 1 ? 'Day' : 'Days'}`)

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    remainingDaysAfterWeeks,
    totalHours,
    totalMinutes,
    totalSeconds,
    workingDays,
    weekendDays,
    isReversed,
    formattedSummary: summaryParts.join(', '),
  }
}

/**
 * Adds or subtracts days, weeks, months, or years from a base date
 */
export function calculateAddSubtractDate(
  baseDateStr: string,
  amount: number,
  unit: 'days' | 'weeks' | 'months' | 'years',
  operation: 'add' | 'subtract',
  skipWeekends = false
): AddSubtractResult {
  const base = parseLocalDate(baseDateStr)
  const sign = operation === 'add' ? 1 : -1
  const target = new Date(base)

  if (skipWeekends && unit === 'days') {
    // Step by business days only
    let remaining = Math.abs(amount)
    while (remaining > 0) {
      target.setDate(target.getDate() + sign)
      const day = target.getDay()
      if (day !== 0 && day !== 6) {
        remaining--
      }
    }
  } else {
    switch (unit) {
      case 'days':
        target.setDate(target.getDate() + sign * amount)
        break
      case 'weeks':
        target.setDate(target.getDate() + sign * amount * 7)
        break
      case 'months': {
        const expectedMonth = target.getMonth() + sign * amount
        target.setMonth(expectedMonth)
        break
      }
      case 'years':
        target.setFullYear(target.getFullYear() + sign * amount)
        break
    }
  }

  const dayOfWeekName = target.toLocaleDateString('en-IN', { weekday: 'long' })
  const dayOfWeekIndex = target.getDay()
  const isWeekend = dayOfWeekIndex === 0 || dayOfWeekIndex === 6
  const diffDays = Math.round((target.getTime() - base.getTime()) / (24 * 60 * 60 * 1000))

  return {
    targetDate: formatLocalDateToISO(target),
    formattedDate: formatHumanDate(target),
    dayOfWeek: dayOfWeekName,
    isWeekend,
    relativeDays: diffDays,
  }
}

/**
 * Computes live countdown from now until target date
 */
export function calculateLiveCountdown(targetDateStr: string): CountdownResult {
  const target = parseLocalDate(targetDateStr)
  target.setHours(0, 0, 0, 0)
  const now = new Date()

  const diffMs = target.getTime() - now.getTime()
  const isPast = diffMs < 0
  const absSeconds = Math.floor(Math.abs(diffMs) / 1000)

  const days = Math.floor(absSeconds / 86400)
  const hours = Math.floor((absSeconds % 86400) / 3600)
  const minutes = Math.floor((absSeconds % 3600) / 60)
  const seconds = absSeconds % 60

  // Calculate working days left
  let workingDaysLeft = 0
  if (!isPast && days > 0) {
    const loop = new Date(now)
    while (loop < target) {
      const d = loop.getDay()
      if (d !== 0 && d !== 6) workingDaysLeft++
      loop.setDate(loop.getDate() + 1)
    }
  }

  return {
    isPast,
    days,
    hours,
    minutes,
    seconds,
    totalSeconds: absSeconds,
    workingDaysLeft,
    formattedTarget: formatHumanDate(target),
  }
}
