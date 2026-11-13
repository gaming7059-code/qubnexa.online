import React, { useState, useMemo, useId, useCallback } from 'react'
import {
  RotateCcw,
  TrendingUp,
  Sparkles,
  AlertCircle,
  Table,
  Wallet,
  Calendar,
  Info,
} from 'lucide-react'
import { calculateSIP, SIP_BOUNDS, type SipResult } from '../../utils/calculations/sip'
import { formatINR } from '../../utils/currency'
import { SipDonutChart } from './SipDonutChart'

interface PresetScenario {
  label: string
  monthly: number
  rate: number
  years: number
  description: string
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    label: 'Conservative Debt',
    monthly: 3000,
    rate: 8,
    years: 5,
    description: 'Debt / Liquid funds focused on steady preservation.',
  },
  {
    label: 'Moderate Equity',
    monthly: 5000,
    rate: 12,
    years: 10,
    description: 'Balanced index & large-cap funds with 10Y horizon.',
  },
  {
    label: 'Long-Term Wealth',
    monthly: 10000,
    rate: 14,
    years: 15,
    description: 'Diversified flexi-cap strategy for core milestone goals.',
  },
  {
    label: 'Aggressive Compounder',
    monthly: 15000,
    rate: 15,
    years: 20,
    description: 'High-growth mid & small-cap allocation over two decades.',
  },
]

const MONTHLY_PRESETS = [
  { label: '₹1,000', value: 1000 },
  { label: '₹2,500', value: 2500 },
  { label: '₹5,000', value: 5000 },
  { label: '₹10,000', value: 10000 },
  { label: '₹25,000', value: 25000 },
]

const TENURE_PRESETS = [
  { label: '5Y', value: 5 },
  { label: '10Y', value: 10 },
  { label: '15Y', value: 15 },
  { label: '20Y', value: 20 },
  { label: '25Y', value: 25 },
]

export const SipCalculator: React.FC = () => {
  const monthlyId = useId()
  const rateId = useId()
  const yearsId = useId()

  // Default: ₹5,000 / month, 12% p.a., 10 Years
  const [monthlyAmount, setMonthlyAmount] = useState<string>('5000')
  const [expectedRate, setExpectedRate] = useState<string>('12')
  const [tenureYears, setTenureYears] = useState<string>('10')
  const [showFullTable, setShowFullTable] = useState<boolean>(false)

  // Parse numbers safely
  const parsedMonthly = parseFloat(monthlyAmount)
  const parsedRate = parseFloat(expectedRate)
  const parsedYears = parseFloat(tenureYears)

  // Compute SIP result
  const sipResult: SipResult = useMemo(() => {
    if (isNaN(parsedMonthly) || isNaN(parsedRate) || isNaN(parsedYears)) {
      return { success: false, error: 'Please enter valid numbers for all fields.' }
    }
    return calculateSIP(parsedMonthly, parsedRate, parsedYears)
  }, [parsedMonthly, parsedRate, parsedYears])

  const handleReset = useCallback(() => {
    setMonthlyAmount('5000')
    setExpectedRate('12')
    setTenureYears('10')
    setShowFullTable(false)
  }, [])

  const applyScenario = useCallback((scenario: PresetScenario) => {
    setMonthlyAmount(String(scenario.monthly))
    setExpectedRate(String(scenario.rate))
    setTenureYears(String(scenario.years))
  }, [])

  return (
    <div className="w-full space-y-8">
      {/* Top Scenarios Quick Bar */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Popular Investment Strategies
            </span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_SCENARIOS.map((sc) => {
            const isActive =
              parsedMonthly === sc.monthly && parsedRate === sc.rate && parsedYears === sc.years

            return (
              <button
                key={sc.label}
                type="button"
                onClick={() => applyScenario(sc)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#11182D] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                  {sc.label}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  ₹{sc.monthly.toLocaleString()} • {sc.rate}% • {sc.years}Y
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  {sc.description}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Interactive Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Sliders & Numeric Inputs (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-500" />
              SIP Investment Parameters
            </h2>
            <span className="text-xs text-slate-400">Monthly Compounding</span>
          </div>

          {/* 1. Monthly Investment Amount */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor={monthlyId}
                className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400"
              >
                Monthly Investment (₹)
              </label>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-slate-400">₹</span>
                <input
                  id={monthlyId}
                  type="number"
                  min={SIP_BOUNDS.minMonthly}
                  max={SIP_BOUNDS.maxMonthly}
                  step={500}
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(e.target.value)}
                  className="w-28 sm:w-36 text-right font-bold text-slate-900 dark:text-slate-100 text-base bg-slate-50 dark:bg-[#11182D] border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={500}
              max={100000}
              step={500}
              value={isNaN(parsedMonthly) ? 5000 : Math.min(parsedMonthly, 100000)}
              onChange={(e) => setMonthlyAmount(e.target.value)}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {MONTHLY_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setMonthlyAmount(String(p.value))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    parsedMonthly === p.value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Expected Annual Return Rate */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor={rateId}
                className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400"
              >
                Expected Annual Return Rate (%)
              </label>
              <div className="flex items-center gap-1">
                <input
                  id={rateId}
                  type="number"
                  min={SIP_BOUNDS.minRate}
                  max={SIP_BOUNDS.maxRate}
                  step={0.5}
                  value={expectedRate}
                  onChange={(e) => setExpectedRate(e.target.value)}
                  className="w-20 sm:w-24 text-right font-bold text-slate-900 dark:text-slate-100 text-base bg-slate-50 dark:bg-[#11182D] border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-sm font-semibold text-slate-400">%</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={1}
              max={30}
              step={0.5}
              value={isNaN(parsedRate) ? 12 : Math.min(parsedRate, 30)}
              onChange={(e) => setExpectedRate(e.target.value)}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>0% (Zero Return)</span>
              <span>12% (Equity Benchmark)</span>
              <span>30% (High Growth)</span>
            </div>
          </div>

          {/* 3. Investment Duration */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor={yearsId}
                className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400"
              >
                Investment Duration (Years)
              </label>
              <div className="flex items-center gap-1">
                <input
                  id={yearsId}
                  type="number"
                  min={SIP_BOUNDS.minYears}
                  max={SIP_BOUNDS.maxYears}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(e.target.value)}
                  className="w-20 sm:w-24 text-right font-bold text-slate-900 dark:text-slate-100 text-base bg-slate-50 dark:bg-[#11182D] border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-400">Yrs</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={isNaN(parsedYears) ? 10 : Math.min(parsedYears, 40)}
              onChange={(e) => setTenureYears(e.target.value)}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {TENURE_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setTenureYears(String(p.value))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    parsedYears === p.value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Pane: Results & Donut Chart (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] p-6 shadow-xs flex flex-col justify-between space-y-6">
          {sipResult.success && sipResult.data ? (
            <>
              {/* Hero Maturity Card */}
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 dark:to-[#11182D] border border-emerald-500/20 p-5 text-center">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Estimated Maturity Value
                </span>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
                  {formatINR(sipResult.data.maturityValue)}
                </div>
                <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{sipResult.data.wealthMultiplier}x Wealth Multiplier</span>
                </div>
              </div>

              {/* Donut Chart Visualizer */}
              <SipDonutChart
                investedAmount={sipResult.data.totalInvested}
                estimatedReturns={sipResult.data.estimatedReturns}
                maturityValue={sipResult.data.maturityValue}
                investedPercentage={sipResult.data.investedPercentage}
                returnsPercentage={sipResult.data.returnsPercentage}
              />

              {/* Key Summary Breakdown Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#11182D] border border-slate-100 dark:border-slate-800/80">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Total Invested
                  </div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {formatINR(sipResult.data.totalInvested)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {sipResult.data.totalMonths} monthly installments
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Est. Wealth Gain
                  </div>
                  <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {formatINR(sipResult.data.estimatedReturns)}
                  </div>
                  <div className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
                    +{sipResult.data.returnsPercentage}% return on maturity
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-rose-500 flex flex-col items-center justify-center space-y-2">
              <AlertCircle className="w-6 h-6" />
              <p className="text-xs font-semibold">{sipResult.error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Periodic Deposit Summary Bar */}
      {sipResult.success && sipResult.data && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <h3 className="font-semibold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Contribution Cadence Schedule
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#11182D] border border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-400">Monthly Contribution</span>
              <div className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {formatINR(sipResult.data.periodicSummary.monthlyDeposit)}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#11182D] border border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-400">Quarterly Outflow (3 Months)</span>
              <div className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {formatINR(sipResult.data.periodicSummary.quarterlyDeposit)}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#11182D] border border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-400">Annual Outflow (12 Months)</span>
              <div className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {formatINR(sipResult.data.periodicSummary.yearlyDeposit)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Year-by-Year Growth Table */}
      {sipResult.success && sipResult.data && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-emerald-500" />
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                Year-Wise Investment Growth Projection
              </h3>
            </div>
            {sipResult.data.yearlyBreakdown.length > 5 && (
              <button
                type="button"
                onClick={() => setShowFullTable(!showFullTable)}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                {showFullTable
                  ? 'Show First 5 Years'
                  : `Show All ${sipResult.data.yearlyBreakdown.length} Years`}
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 text-slate-400 font-semibold uppercase text-[11px]">
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3">Invested Capital</th>
                  <th className="py-2.5 px-3">Estimated Returns</th>
                  <th className="py-2.5 px-3">Maturity Balance</th>
                  <th className="py-2.5 px-3 text-right">Wealth Multiple</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {(showFullTable
                  ? sipResult.data.yearlyBreakdown
                  : sipResult.data.yearlyBreakdown.slice(0, 5)
                ).map((row) => (
                  <tr
                    key={row.year}
                    className="hover:bg-slate-50 dark:hover:bg-[#11182D]/60 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-800 dark:text-slate-200">
                      Year {row.year}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                      {formatINR(row.investedAmount)}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-medium">
                      +{formatINR(row.estimatedReturns)}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                      {formatINR(row.futureValue)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500 font-sans font-medium">
                      {row.wealthMultiplier}x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!showFullTable && sipResult.data.yearlyBreakdown.length > 5 && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowFullTable(true)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Expand all {sipResult.data.yearlyBreakdown.length} years of projections
              </button>
            </div>
          )}
        </div>
      )}

      {/* Statutory Disclaimer Card */}
      <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
          <div className="font-semibold">Regulatory & Investment Disclaimer</div>
          <p className="text-amber-700 dark:text-amber-300/90 leading-relaxed text-[11px]">
            Mutual fund investments are subject to market risks. Read all scheme-related documents
            carefully before investing. Past returns do not guarantee future performance. These
            calculated figures are mathematical projections based on assumed compound annual growth
            rates (CAGR) and do not account for capital gains taxes (LTCG / STCG), scheme expense
            ratios, exit loads, or inflation.
          </p>
        </div>
      </div>
    </div>
  )
}
