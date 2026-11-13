import { describe, it } from 'node:test'
import assert from 'node:assert'
import { calculateSIP } from './sip.ts'
import { formatINR } from '../currency.ts'

describe('SIP Calculator Engine', () => {
  it('should accurately calculate standard SIP for ₹5,000 at 12% for 10 years', () => {
    const res = calculateSIP(5000, 12, 10)
    assert.strictEqual(res.success, true)
    assert.ok(res.data !== undefined)

    const d = res.data!
    assert.strictEqual(d.totalMonths, 120)
    assert.strictEqual(d.totalInvested, 600000) // 5000 * 120
    // Standard annuity FV for 5000 @ 12% (1% monthly) for 120 months is approx 11,61,695
    assert.strictEqual(d.maturityValue, 1161695)
    assert.strictEqual(d.estimatedReturns, 561695) // 1161695 - 600000
    assert.strictEqual(d.investedPercentage, 51.6)
    assert.strictEqual(d.returnsPercentage, 48.4)
    assert.strictEqual(d.wealthMultiplier, 1.94)
  })

  it('should handle zero return rate correctly without division by zero', () => {
    const res = calculateSIP(10000, 0, 5)
    assert.strictEqual(res.success, true)
    assert.ok(res.data !== undefined)

    const d = res.data!
    assert.strictEqual(d.totalMonths, 60)
    assert.strictEqual(d.totalInvested, 600000)
    assert.strictEqual(d.maturityValue, 600000)
    assert.strictEqual(d.estimatedReturns, 0)
    assert.strictEqual(d.investedPercentage, 100)
    assert.strictEqual(d.returnsPercentage, 0)
    assert.strictEqual(d.wealthMultiplier, 1)
  })

  it('should handle minimum investment and tenure boundaries', () => {
    const res = calculateSIP(100, 5, 1)
    assert.strictEqual(res.success, true)
    assert.ok(res.data !== undefined)

    const d = res.data!
    assert.strictEqual(d.totalMonths, 12)
    assert.strictEqual(d.totalInvested, 1200)
    assert.ok(d.maturityValue > 1200)
    assert.ok(d.estimatedReturns > 0)
  })

  it('should handle upper boundary inputs safely (₹10L/mo, 50% return, 40 years)', () => {
    const res = calculateSIP(1000000, 50, 40)
    assert.strictEqual(res.success, true)
    assert.ok(res.data !== undefined)
    assert.ok(Number.isFinite(res.data!.maturityValue))
    assert.ok(res.data!.maturityValue > res.data!.totalInvested)
  })

  it('should reject invalid, negative or out-of-range inputs', () => {
    assert.strictEqual(calculateSIP(0, 12, 10).success, false)
    assert.strictEqual(calculateSIP(-5000, 12, 10).success, false)
    assert.strictEqual(calculateSIP(5000, -1, 10).success, false)
    assert.strictEqual(calculateSIP(5000, 55, 10).success, false) // > 50%
    assert.strictEqual(calculateSIP(5000, 12, 0).success, false) // < 1 yr
    assert.strictEqual(calculateSIP(5000, 12, 45).success, false) // > 40 yr
    assert.strictEqual(calculateSIP(NaN, 12, 10).success, false)
  })

  it('should calculate accurate year-wise growth breakdown matching final maturity', () => {
    const res = calculateSIP(5000, 12, 5)
    assert.strictEqual(res.success, true)
    const d = res.data!

    assert.strictEqual(d.yearlyBreakdown.length, 5)

    // Year 1
    assert.strictEqual(d.yearlyBreakdown[0].year, 1)
    assert.strictEqual(d.yearlyBreakdown[0].investedAmount, 60000)

    // Final Year matches overall maturity value
    const finalYear = d.yearlyBreakdown[4]
    assert.strictEqual(finalYear.year, 5)
    assert.strictEqual(finalYear.investedAmount, d.totalInvested)
    assert.strictEqual(finalYear.futureValue, d.maturityValue)
    assert.strictEqual(finalYear.estimatedReturns, d.estimatedReturns)
  })

  it('should provide periodic summary (monthly, quarterly, yearly deposits)', () => {
    const res = calculateSIP(5000, 12, 10)
    assert.strictEqual(res.success, true)
    const p = res.data!.periodicSummary
    assert.strictEqual(p.monthlyDeposit, 5000)
    assert.strictEqual(p.quarterlyDeposit, 15000)
    assert.strictEqual(p.yearlyDeposit, 60000)
  })

  it('should format values into standard Indian currency with formatINR', () => {
    assert.strictEqual(formatINR(1161695), '₹11,61,695')
    assert.strictEqual(formatINR(600000), '₹6,00,000')
    assert.strictEqual(formatINR(5000), '₹5,000')
  })
})
