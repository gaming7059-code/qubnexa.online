import React, { useState, useMemo } from 'react'
import {
  ArrowLeftRight,
  RotateCcw,
  Copy,
  Check,
  X,
  Sliders,
  Layers,
  Ruler,
  Scale,
  Thermometer,
  Maximize2,
  FlaskConical,
  Gauge,
  Clock,
  HardDrive,
} from 'lucide-react'
import {
  UNIT_CATEGORIES,
  convertUnit,
  getAllCategoryConversions,
} from '../../utils/calculations/unitConverter'

const renderCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'length':
      return <Ruler className="h-4 w-4 shrink-0" />
    case 'weight':
      return <Scale className="h-4 w-4 shrink-0" />
    case 'temperature':
      return <Thermometer className="h-4 w-4 shrink-0" />
    case 'area':
      return <Maximize2 className="h-4 w-4 shrink-0" />
    case 'volume':
      return <FlaskConical className="h-4 w-4 shrink-0" />
    case 'speed':
      return <Gauge className="h-4 w-4 shrink-0" />
    case 'time':
      return <Clock className="h-4 w-4 shrink-0" />
    case 'digital':
      return <HardDrive className="h-4 w-4 shrink-0" />
    default:
      return <Layers className="h-4 w-4 shrink-0" />
  }
}

export const UnitConverter: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('length')
  const [inputValue, setInputValue] = useState<string>('1')
  const [precision, setPrecision] = useState<'auto' | 2 | 4 | 6>('auto')
  const [copiedState, setCopiedState] = useState(false)

  const currentCategory = useMemo(() => {
    return UNIT_CATEGORIES.find((c) => c.id === activeCategoryId) || UNIT_CATEGORIES[0]
  }, [activeCategoryId])

  const [fromUnitId, setFromUnitId] = useState<string>(currentCategory.units[0]?.id || 'm')
  const [toUnitId, setToUnitId] = useState<string>(currentCategory.units[1]?.id || 'km')

  // Switch category updates default units
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategoryId(categoryId)
    const cat = UNIT_CATEGORIES.find((c) => c.id === categoryId) || UNIT_CATEGORIES[0]
    setFromUnitId(cat.units[0]?.id || '')
    setToUnitId(cat.units[1]?.id || cat.units[0]?.id || '')
  }

  // Swap units
  const handleSwapUnits = () => {
    const prevFrom = fromUnitId
    setFromUnitId(toUnitId)
    setToUnitId(prevFrom)
  }

  const handleReset = () => {
    setInputValue('1')
    setPrecision('auto')
  }

  const handleClear = () => {
    setInputValue('')
  }

  // Live Conversion
  const conversionResult = useMemo(() => {
    if (inputValue === '' || inputValue === undefined) return null
    const num = parseFloat(inputValue)
    return convertUnit(num, fromUnitId, toUnitId, activeCategoryId, precision)
  }, [inputValue, fromUnitId, toUnitId, activeCategoryId, precision])

  // Multi-unit comparison cheat sheet
  const allConversions = useMemo(() => {
    const num = parseFloat(inputValue || '0')
    if (isNaN(num)) return []
    return getAllCategoryConversions(num, fromUnitId, activeCategoryId, precision)
  }, [inputValue, fromUnitId, activeCategoryId, precision])

  const fromUnitObj = currentCategory.units.find((u) => u.id === fromUnitId)
  const toUnitObj = currentCategory.units.find((u) => u.id === toUnitId)

  // Copy result
  const handleCopyResult = async () => {
    if (!conversionResult?.formatted) return
    try {
      const copyText = `${inputValue} ${fromUnitObj?.symbol} = ${conversionResult.formatted} ${toUnitObj?.symbol}`
      await navigator.clipboard.writeText(copyText)
      setCopiedState(true)
      setTimeout(() => setCopiedState(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. CATEGORY PILLS SELECTOR (8 CATEGORIES) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-7 shadow-xs space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Select Measurement Category (8 Categories)
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {UNIT_CATEGORIES.map((cat) => {
            const isSelected = activeCategoryId === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all select-none active:scale-95 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                    : 'bg-slate-50 dark:bg-[#11182D] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1B2748]/60 border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                {renderCategoryIcon(cat.id)}
                <span>{cat.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. CONVERTER WORKSPACE (INTERACTIVE CARD) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Precision & Reset Options Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <Sliders className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600 dark:text-slate-400">Decimals:</span>
            {(['auto', 2, 4, 6] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrecision(p)}
                className={`min-h-[30px] px-2.5 py-1 rounded-lg font-mono text-xs font-semibold transition-colors inline-flex items-center justify-center ${
                  precision === p
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-[#11182D] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1B2748]'
                }`}
              >
                {p === 'auto' ? 'Auto' : `${p} dp`}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-[36px] cursor-pointer items-center gap-1 rounded-lg px-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Default</span>
          </button>
        </div>

        {/* Input & Unit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
          {/* FROM COLUMN (3 COLS) */}
          <div className="md:col-span-3 space-y-2">
            <label htmlFor="fromValInput" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Convert From ({fromUnitObj?.name})
            </label>
            <div className="space-y-2.5">
              <div className="relative">
                <input
                  id="fromValInput"
                  type="number"
                  step="any"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter numeric value"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] pl-4 pr-10 py-3 text-lg font-bold text-slate-900 dark:text-slate-100 focus:border-blue-600 dark:focus:border-[#00DFFF] focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#00DFFF]/20"
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Clear input"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <select
                value={fromUnitId}
                onChange={(e) => setFromUnitId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#050814] px-3.5 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                {currentCategory.units.map((unit) => (
                  <option key={unit.id} value={unit.id} className="dark:bg-[#0B1020]">
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SWAP BUTTON (1 COL) */}
          <div className="md:col-span-1 flex justify-center pt-2 md:pt-6">
            <button
              type="button"
              onClick={handleSwapUnits}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#11182D] text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800 transition-all shadow-xs hover:scale-105 active:scale-95"
              title="Swap From and To Units"
              aria-label="Swap units"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </button>
          </div>

          {/* TO COLUMN (3 COLS) */}
          <div className="md:col-span-3 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="toUnitDropdown" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Converted To ({toUnitObj?.name})
              </label>
              {conversionResult?.success && (
                <button
                  type="button"
                  onClick={handleCopyResult}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {copiedState ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 px-4 py-3 min-h-[52px]">
                <span className="text-lg font-extrabold text-blue-950 dark:text-blue-200 truncate select-all">
                  {conversionResult?.success && conversionResult.formatted !== undefined
                    ? conversionResult.formatted
                    : '—'}
                </span>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 shrink-0 ml-2">
                  {toUnitObj?.symbol}
                </span>
              </div>

              <select
                id="toUnitDropdown"
                value={toUnitId}
                onChange={(e) => setToUnitId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#050814] px-3.5 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 focus:border-blue-500 focus:outline-none"
              >
                {currentCategory.units.map((unit) => (
                  <option key={unit.id} value={unit.id} className="dark:bg-[#0B1020]">
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live Formula Callout */}
        {conversionResult?.formula && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#050814]/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Conversion Formula:</span>
            <span className="font-mono font-bold text-blue-700 dark:text-blue-300">{conversionResult.formula}</span>
          </div>
        )}
      </div>

      {/* 3. MULTI-UNIT LIVE CHEAT SHEET (QUICK REFERENCE TABLE) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-500" />
            <span>Instant Multi-Unit Comparison ({currentCategory.name})</span>
          </h2>
          <span className="text-xs text-slate-400">
            Base: {inputValue || '1'} {fromUnitObj?.symbol}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {allConversions.map(({ unit, formatted }) => {
            const isSource = unit.id === fromUnitId
            const isTarget = unit.id === toUnitId
            return (
              <div
                key={unit.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isTarget
                    ? 'border-blue-400 bg-blue-50/70 dark:bg-blue-950/40'
                    : isSource
                    ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/30'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#050814]/40'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  <span>{unit.name}</span>
                  <span className="font-mono text-slate-400">{unit.symbol}</span>
                </div>
                <div className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100 truncate select-all">
                  {formatted}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
