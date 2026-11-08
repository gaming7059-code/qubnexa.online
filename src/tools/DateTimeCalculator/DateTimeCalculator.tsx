import React, { useState, useEffect, useMemo } from 'react'
import {
  Briefcase,
  ArrowLeftRight,
  Plus,
  Minus,
  AlertCircle,
  Hourglass,
  CalendarDays,
  Copy,
  Check,
} from 'lucide-react'
import {
  calculateDateDifference,
  calculateAddSubtractDate,
  calculateLiveCountdown,
  formatLocalDateToISO,
  isLeapYear,
} from '../../utils/calculations/dateTimeCalculator'

type Mode = 'difference' | 'addSubtract' | 'countdown' | 'workingDays'

export const DateTimeCalculator: React.FC = () => {
  const [mode, setMode] = useState<Mode>('difference')

  const getTodayISO = () => formatLocalDateToISO(new Date())

  // Mode 1: Date Difference
  const [diffStartDate, setDiffStartDate] = useState<string>('2026-01-01')
  const [diffEndDate, setDiffEndDate] = useState<string>(getTodayISO())
  const [diffIncludeEnd, setDiffIncludeEnd] = useState<boolean>(false)

  // Mode 2: Add / Subtract
  const [baseDate, setBaseDate] = useState<string>(getTodayISO())
  const [addAmount, setAddAmount] = useState<number>(30)
  const [addUnit, setAddUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('days')
  const [addOperation, setAddOperation] = useState<'add' | 'subtract'>('add')
  const [skipWeekends, setSkipWeekends] = useState<boolean>(false)

  // Mode 3: Countdown
  const [countdownTarget, setCountdownTarget] = useState<string>('2027-01-01')
  const [liveSeconds, setLiveSeconds] = useState<number>(0)

  // Mode 4: Working Days
  const [workStart, setWorkStart] = useState<string>(getTodayISO())
  const [workEnd, setWorkEnd] = useState<string>('2026-12-31')
  const [workIncludeEnd, setWorkIncludeEnd] = useState<boolean>(true)

  // Feedback toast
  const [copied, setCopied] = useState(false)

  // Ticker for Live Countdown mode
  useEffect(() => {
    if (mode !== 'countdown') return
    const timer = setInterval(() => {
      setLiveSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [mode])

  // Computations
  const diffResult = useMemo(() => {
    if (!diffStartDate || !diffEndDate) return null
    return calculateDateDifference(diffStartDate, diffEndDate, diffIncludeEnd)
  }, [diffStartDate, diffEndDate, diffIncludeEnd])

  const addResult = useMemo(() => {
    if (!baseDate || isNaN(addAmount)) return null
    return calculateAddSubtractDate(baseDate, addAmount, addUnit, addOperation, skipWeekends)
  }, [baseDate, addAmount, addUnit, addOperation, skipWeekends])

  const countdownResult = useMemo(() => {
    // liveSeconds triggers re-computation
    void liveSeconds
    if (!countdownTarget) return null
    return calculateLiveCountdown(countdownTarget)
  }, [countdownTarget, liveSeconds])

  const workResult = useMemo(() => {
    if (!workStart || !workEnd) return null
    return calculateDateDifference(workStart, workEnd, workIncludeEnd)
  }, [workStart, workEnd, workIncludeEnd])

  // Swap dates
  const handleSwapDiffDates = () => {
    const temp = diffStartDate
    setDiffStartDate(diffEndDate)
    setDiffEndDate(temp)
  }

  // Copy result helper
  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. MODE TABS SELECTOR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'difference', label: 'Date Difference', icon: CalendarDays },
          { id: 'addSubtract', label: 'Add / Subtract Time', icon: Plus },
          { id: 'countdown', label: 'Milestone Countdown', icon: Hourglass },
          { id: 'workingDays', label: 'Working Days (Mon-Fri)', icon: Briefcase },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = mode === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id as Mode)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 select-none active:scale-95 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 2. MODE 1: DATE DIFFERENCE CALCULATOR */}
      {mode === 'difference' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-blue-500" />
                <span>Select Calendar Dates</span>
              </h2>

              <div className="space-y-4">
                {/* Start Date */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <label htmlFor="diffStartDateInput">Start Date</label>
                    <button
                      type="button"
                      onClick={() => setDiffStartDate(getTodayISO())}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Set Today
                    </button>
                  </div>
                  <input
                    id="diffStartDateInput"
                    type="date"
                    value={diffStartDate}
                    onChange={(e) => setDiffStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleSwapDiffDates}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/60 shadow-2xs transition-all active:scale-95"
                    title="Swap Start and End Dates"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>
                </div>

                {/* End Date */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <label htmlFor="diffEndDateInput">End Date</label>
                    <button
                      type="button"
                      onClick={() => setDiffEndDate(getTodayISO())}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Set Today
                    </button>
                  </div>
                  <input
                    id="diffEndDateInput"
                    type="date"
                    value={diffEndDate}
                    onChange={(e) => setDiffEndDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Include End Date Checkbox */}
                <label className="flex items-center gap-2.5 pt-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={diffIncludeEnd}
                    onChange={(e) => setDiffIncludeEnd(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Include end date in calculation (+1 full day)</span>
                </label>
              </div>

              {diffResult?.isReversed && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>Notice: End date is earlier than start date. Difference is computed directionally.</span>
                </div>
              )}
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-6">
            {diffResult && (
              <div className="rounded-3xl border border-blue-200 dark:border-blue-900/60 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Calculated Date Interval
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(`${diffResult.formattedSummary} (${diffResult.totalDays} Total Days)`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Breakdown'}</span>
                  </button>
                </div>

                {/* Big Breakdown Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50/60 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/50">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Exact Calendar Duration
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-blue-900 dark:text-blue-200 mt-1">
                    {diffResult.formattedSummary || '0 Days'}
                  </div>
                </div>

                {/* Grid of Metric Breakdown Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
                    <span className="text-[11px] text-slate-400">Total Calendar Days</span>
                    <div className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                      {diffResult.totalDays.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
                    <span className="text-[11px] text-slate-400">Weeks &amp; Days</span>
                    <div className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                      {diffResult.totalWeeks}w {diffResult.remainingDaysAfterWeeks}d
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/30">
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">Working Days (Mon-Fri)</span>
                    <div className="font-bold text-base text-emerald-900 dark:text-emerald-200 mt-0.5">
                      {diffResult.workingDays.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
                    <span className="text-[11px] text-slate-400">Weekend Days</span>
                    <div className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                      {diffResult.weekendDays}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
                    <span className="text-[11px] text-slate-400">Total Hours</span>
                    <div className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                      {diffResult.totalHours.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
                    <span className="text-[11px] text-slate-400">Total Minutes</span>
                    <div className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                      {diffResult.totalMinutes.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. MODE 2: ADD OR SUBTRACT DAYS */}
      {mode === 'addSubtract' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-500" />
                <span>Add or Subtract from Date</span>
              </h2>

              <div className="space-y-4">
                {/* Base Date */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <label htmlFor="baseDateInput">Starting Base Date</label>
                    <button
                      type="button"
                      onClick={() => setBaseDate(getTodayISO())}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Set Today
                    </button>
                  </div>
                  <input
                    id="baseDateInput"
                    type="date"
                    value={baseDate}
                    onChange={(e) => setBaseDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Operation Buttons */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Operation
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAddOperation('add')}
                      className={`inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        addOperation === 'add'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add (+) Time</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddOperation('subtract')}
                      className={`inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        addOperation === 'subtract'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Minus className="h-4 w-4" />
                      <span>Subtract (-) Time</span>
                    </button>
                  </div>
                </div>

                {/* Value & Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="addAmountInput" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Quantity
                    </label>
                    <input
                      id="addAmountInput"
                      type="number"
                      min="1"
                      max="10000"
                      value={addAmount}
                      onChange={(e) => setAddAmount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="addUnitSelect" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Unit
                    </label>
                    <select
                      id="addUnitSelect"
                      value={addUnit}
                      onChange={(e) => setAddUnit(e.target.value as 'days' | 'weeks' | 'months' | 'years')}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                </div>

                {/* Business days option */}
                {addUnit === 'days' && (
                  <label className="flex items-center gap-2.5 pt-1 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={skipWeekends}
                      onChange={(e) => setSkipWeekends(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Skip weekends (count Monday–Friday business days only)</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Result Column */}
          <div className="lg:col-span-6 space-y-6">
            {addResult && (
              <div className="rounded-3xl border border-blue-200 dark:border-blue-900/60 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Target Resulting Date
                </span>

                <div className="p-6 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50/60 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/50 space-y-2">
                  <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    {addResult.dayOfWeek} {addResult.isWeekend ? '(Weekend)' : '(Working Day)'}
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 dark:text-blue-100">
                    {addResult.formattedDate}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    ISO format: <code className="font-mono font-bold text-slate-700 dark:text-slate-300">{addResult.targetDate}</code>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Relative Interval</span>
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                      {addResult.relativeDays > 0 ? `+${addResult.relativeDays} days ahead` : `${addResult.relativeDays} days ago`}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Leap Year Status</span>
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                      {isLeapYear(parseInt(addResult.targetDate.slice(0, 4), 10)) ? 'Leap Year (366 days)' : 'Standard Year (365 days)'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. MODE 3: LIVE COUNTDOWN */}
      {mode === 'countdown' && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Hourglass className="h-4 w-4 text-purple-500 animate-pulse" />
                <span>Countdown to Event or Target Date</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time ticking countdown with working days estimation.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">Presets:</span>
              {[
                { label: 'New Year', date: '2027-01-01' },
                { label: 'Independence Day', date: '2026-08-15' },
                { label: 'Gandhi Jayanti', date: '2026-10-02' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setCountdownTarget(preset.date)}
                  className="min-h-[36px] sm:min-h-[30px] px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 transition-colors inline-flex items-center justify-center active:scale-95"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-md">
            <label htmlFor="countdownTargetInput" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Choose Target Milestone Date
            </label>
            <input
              id="countdownTargetInput"
              type="date"
              value={countdownTarget}
              onChange={(e) => setCountdownTarget(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Live Countdown Display */}
          {countdownResult && (
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-purple-50/70 via-indigo-50/50 to-blue-50/70 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-blue-950/40 border border-purple-200 dark:border-purple-900/50 text-center space-y-6">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80">
                {countdownResult.isPast ? 'Milestone Date Has Passed' : `Time Remaining Until ${countdownResult.formattedTarget}`}
              </span>

              {/* Ticking Digit Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800">
                  <div className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                    {countdownResult.days}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Days</div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800">
                  <div className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                    {countdownResult.hours}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Hours</div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800">
                  <div className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                    {countdownResult.minutes}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Minutes</div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800">
                  <div className="font-mono text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 animate-pulse">
                    {countdownResult.seconds}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Seconds</div>
                </div>
              </div>

              {!countdownResult.isPast && (
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Includes approximately <span className="font-bold text-slate-900 dark:text-white">{countdownResult.workingDaysLeft} Monday–Friday business days</span> remaining.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. MODE 4: WORKING DAYS (BUSINESS DAYS) */}
      {mode === 'workingDays' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-emerald-500" />
                <span>Working Days Calculator</span>
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="workStartInput" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Project Start Date
                  </label>
                  <input
                    id="workStartInput"
                    type="date"
                    value={workStart}
                    onChange={(e) => setWorkStart(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="workEndInput" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Project Target Date
                  </label>
                  <input
                    id="workEndInput"
                    type="date"
                    value={workEnd}
                    onChange={(e) => setWorkEnd(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <label className="flex items-center gap-2.5 pt-1 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={workIncludeEnd}
                    onChange={(e) => setWorkIncludeEnd(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Include target end date as a working day (+1 day)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            {workResult && (
              <div className="rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm space-y-5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Business Timeline Analysis
                </span>

                <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 space-y-1">
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    Total Mon–Fri Business Days
                  </span>
                  <div className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-200">
                    {workResult.workingDays.toLocaleString('en-IN')} Business Days
                  </div>
                  <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80 block">
                    Equivalent to ~{(workResult.workingDays * 8).toLocaleString('en-IN')} billable work hours (at 8h/day)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Total Calendar Days</span>
                    <div className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                      {workResult.totalDays} Days
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Excluded Weekend Days</span>
                    <div className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                      {workResult.weekendDays} Days
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
