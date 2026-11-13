import React, { useState } from 'react'
import { formatINR } from '../../utils/currency'

interface SipDonutChartProps {
  investedAmount: number
  estimatedReturns: number
  maturityValue: number
  investedPercentage: number
  returnsPercentage: number
}

export const SipDonutChart: React.FC<SipDonutChartProps> = ({
  investedAmount,
  estimatedReturns,
  maturityValue,
  investedPercentage,
  returnsPercentage,
}) => {
  const [activeSegment, setActiveSegment] = useState<'none' | 'invested' | 'returns'>('none')

  // SVG Geometry
  const size = 200
  const strokeWidth = 24
  const radius = (size - strokeWidth) / 2
  const center = size / 2
  const circumference = 2 * Math.PI * radius

  // Percentage segments
  const safeInvestedPct = Math.max(0, Math.min(100, investedPercentage))
  const safeReturnsPct = Math.max(0, Math.min(100, returnsPercentage))

  const investedDash = (safeInvestedPct / 100) * circumference
  const returnsDash = (safeReturnsPct / 100) * circumference

  // Rotations for stacking segments: starting from top (-90 deg)
  const investedOffset = 0
  const returnsOffset = -investedDash

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-[200px] h-[200px]">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
          role="img"
          aria-label={`Donut chart showing ${safeInvestedPct.toFixed(1)}% invested capital and ${safeReturnsPct.toFixed(1)}% estimated returns`}
        >
          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800/80"
          />

          {/* Invested Capital Arc (Blue/Indigo) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#3B82F6"
            strokeWidth={activeSegment === 'invested' ? strokeWidth + 4 : strokeWidth}
            strokeDasharray={`${investedDash} ${circumference}`}
            strokeDashoffset={investedOffset}
            strokeLinecap="butt"
            className="transition-all duration-500 ease-out cursor-pointer hover:opacity-90"
            onMouseEnter={() => setActiveSegment('invested')}
            onMouseLeave={() => setActiveSegment('none')}
          />

          {/* Estimated Returns Arc (Emerald) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#10B981"
            strokeWidth={activeSegment === 'returns' ? strokeWidth + 4 : strokeWidth}
            strokeDasharray={`${returnsDash} ${circumference}`}
            strokeDashoffset={returnsOffset}
            strokeLinecap="butt"
            className="transition-all duration-500 ease-out cursor-pointer hover:opacity-90"
            onMouseEnter={() => setActiveSegment('returns')}
            onMouseLeave={() => setActiveSegment('none')}
          />
        </svg>

        {/* Center Summary Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {activeSegment === 'invested'
              ? 'Invested'
              : activeSegment === 'returns'
                ? 'Est. Returns'
                : 'Maturity Value'}
          </span>
          <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5 tracking-tight">
            {activeSegment === 'invested'
              ? formatINR(investedAmount)
              : activeSegment === 'returns'
                ? formatINR(estimatedReturns)
                : formatINR(maturityValue)}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
            {activeSegment === 'invested'
              ? `${safeInvestedPct.toFixed(1)}%`
              : activeSegment === 'returns'
                ? `${safeReturnsPct.toFixed(1)}%`
                : '100%'}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
        <button
          type="button"
          onMouseEnter={() => setActiveSegment('invested')}
          onMouseLeave={() => setActiveSegment('none')}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
            activeSegment === 'invested'
              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
          <span>Invested ({safeInvestedPct.toFixed(1)}%)</span>
        </button>

        <button
          type="button"
          onMouseEnter={() => setActiveSegment('returns')}
          onMouseLeave={() => setActiveSegment('none')}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
            activeSegment === 'returns'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span>Est. Returns ({safeReturnsPct.toFixed(1)}%)</span>
        </button>
      </div>
    </div>
  )
}
