/**
 * Pure Calculation Functions for SIP (Systematic Investment Plan) Calculator
 * Implements standard monthly future value annuity formula for wealth compounding.
 * 100% Client-side, pure TypeScript, zero external dependencies.
 */

export interface SipYearlyBreakdown {
  year: number
  investedAmount: number
  estimatedReturns: number
  futureValue: number
  wealthMultiplier: number
}

export interface SipCalculationResult {
  monthlyInvestment: number
  annualRate: number
  years: number
  totalMonths: number
  totalInvested: number
  estimatedReturns: number
  maturityValue: number
  investedPercentage: number
  returnsPercentage: number
  wealthMultiplier: number
  yearlyBreakdown: SipYearlyBreakdown[]
  periodicSummary: {
    monthlyDeposit: number
    quarterlyDeposit: number
    yearlyDeposit: number
  }
}

export interface SipResult {
  success: boolean
  data?: SipCalculationResult
  error?: string
}

export interface SipInputBounds {
  minMonthly: number
  maxMonthly: number
  minRate: number
  maxRate: number
  minYears: number
  maxYears: number
}

export const SIP_BOUNDS: SipInputBounds = {
  minMonthly: 100,
  maxMonthly: 10_00_000, // ₹10 Lakhs/month
  minRate: 0,
  maxRate: 50, // 50% max annual expected return
  minYears: 1,
  maxYears: 40,
}

/**
 * Calculates Future Value of a Monthly SIP
 * Formula: FV = P * [((1 + i)^n - 1) / i] * (1 + i)
 * For i = 0 (zero returns): FV = P * n
 */
export function calculateSIP(
  monthlyInvestment: number,
  annualRate: number,
  years: number
): SipResult {
  if (
    Number.isNaN(monthlyInvestment) ||
    Number.isNaN(annualRate) ||
    Number.isNaN(years) ||
    !Number.isFinite(monthlyInvestment) ||
    !Number.isFinite(annualRate) ||
    !Number.isFinite(years)
  ) {
    return { success: false, error: 'Please enter valid numerical values.' }
  }

  if (monthlyInvestment <= 0) {
    return { success: false, error: 'Monthly investment must be greater than ₹0.' }
  }

  if (annualRate < 0 || annualRate > 50) {
    return { success: false, error: 'Annual expected return rate must be between 0% and 50%.' }
  }

  if (years < 1 || years > 40) {
    return { success: false, error: 'Investment tenure must be between 1 and 40 years.' }
  }

  const roundedYears = Math.min(Math.max(Math.round(years), 1), 40)
  const totalMonths = roundedYears * 12
  const totalInvested = monthlyInvestment * totalMonths

  let maturityValue: number
  let estimatedReturns: number

  if (annualRate === 0) {
    // Zero return rate edge case
    maturityValue = totalInvested
    estimatedReturns = 0
  } else {
    // Standard annuity compounding formula
    const i = annualRate / 12 / 100
    const factor = Math.pow(1 + i, totalMonths)
    maturityValue = monthlyInvestment * ((factor - 1) / i) * (1 + i)
    estimatedReturns = Math.max(0, maturityValue - totalInvested)
  }

  // Calculate percentages cleanly preventing division by zero
  const safeMaturity = maturityValue > 0 ? maturityValue : 1
  const investedPercentage = Math.min(100, Math.max(0, (totalInvested / safeMaturity) * 100))
  const returnsPercentage = Math.min(100, Math.max(0, (estimatedReturns / safeMaturity) * 100))
  const wealthMultiplier = totalInvested > 0 ? maturityValue / totalInvested : 1

  // Year-by-year compounding progression
  const yearlyBreakdown: SipYearlyBreakdown[] = []
  const i = annualRate / 12 / 100

  for (let y = 1; y <= roundedYears; y++) {
    const yMonths = y * 12
    const yInvested = monthlyInvestment * yMonths
    let yMaturity: number

    if (annualRate === 0) {
      yMaturity = yInvested
    } else {
      const yFactor = Math.pow(1 + i, yMonths)
      yMaturity = monthlyInvestment * ((yFactor - 1) / i) * (1 + i)
    }

    const yReturns = Math.max(0, yMaturity - yInvested)
    const yMultiplier = yInvested > 0 ? yMaturity / yInvested : 1

    yearlyBreakdown.push({
      year: y,
      investedAmount: Math.round(yInvested),
      estimatedReturns: Math.round(yReturns),
      futureValue: Math.round(yMaturity),
      wealthMultiplier: Number(yMultiplier.toFixed(2)),
    })
  }

  return {
    success: true,
    data: {
      monthlyInvestment,
      annualRate,
      years: roundedYears,
      totalMonths,
      totalInvested: Math.round(totalInvested),
      estimatedReturns: Math.round(estimatedReturns),
      maturityValue: Math.round(maturityValue),
      investedPercentage: Number(investedPercentage.toFixed(1)),
      returnsPercentage: Number(returnsPercentage.toFixed(1)),
      wealthMultiplier: Number(wealthMultiplier.toFixed(2)),
      yearlyBreakdown,
      periodicSummary: {
        monthlyDeposit: monthlyInvestment,
        quarterlyDeposit: monthlyInvestment * 3,
        yearlyDeposit: monthlyInvestment * 12,
      },
    },
  }
}
