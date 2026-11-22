import React, { useState, useMemo, useEffect } from 'react'
import {
  TrendingDown,
  TrendingUp,
  Minus,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  Search,
  Building2,
  RefreshCw,
  BarChart3,
  HelpCircle,
} from 'lucide-react'

export interface PriceEntry {
  id: string
  competitor: string
  product: string
  currentPrice: number
  previousPrice: number
  currency: string
  notes: string
  lastChecked: string
}

const DEFAULT_CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'INR', symbol: '₹' },
  { code: 'CAD', symbol: 'CA$' },
  { code: 'AUD', symbol: 'A$' },
]

const SAMPLE_ENTRIES: PriceEntry[] = [
  {
    id: 'sample-1',
    competitor: 'CloudFlow Pro',
    product: 'Team Plan (Monthly)',
    currentPrice: 49.0,
    previousPrice: 59.0,
    currency: 'USD',
    notes: 'Dropped price during Q4 promotional campaign. Annual billing gives 20% off.',
    lastChecked: '2026-11-20',
  },
  {
    id: 'sample-2',
    competitor: 'SaaSify Enterprise',
    product: 'Team Plan (Monthly)',
    currentPrice: 79.0,
    previousPrice: 79.0,
    currency: 'USD',
    notes: 'Includes 5 seats + priority phone support. Price unchanged for 6 months.',
    lastChecked: '2026-11-18',
  },
  {
    id: 'sample-3',
    competitor: 'CollabHub Starter',
    product: 'Team Plan (Monthly)',
    currentPrice: 35.0,
    previousPrice: 29.0,
    currency: 'USD',
    notes: 'Increased pricing by $6 recently after adding automated workflow features.',
    lastChecked: '2026-11-21',
  },
  {
    id: 'sample-4',
    competitor: 'WorkSphere Suite',
    product: 'Team Plan (Monthly)',
    currentPrice: 65.0,
    previousPrice: 70.0,
    currency: 'USD',
    notes: 'Recent price decrease to match market average. Unlimited integrations.',
    lastChecked: '2026-11-19',
  },
]

export const CompetitorPricingTracker: React.FC = () => {
  const [entries, setEntries] = useState<PriceEntry[]>(() => {
    try {
      const saved = localStorage.getItem('qubnexa_pricing_tracker')
      if (saved) return JSON.parse(saved)
    } catch {
      // Fallback
    }
    return SAMPLE_ENTRIES
  })

  useEffect(() => {
    try {
      localStorage.setItem('qubnexa_pricing_tracker', JSON.stringify(entries))
    } catch {
      // Storage unavailable or quota exceeded
    }
  }, [entries])

  // Form State
  const [competitor, setCompetitor] = useState('')
  const [product, setProduct] = useState('')
  const [currentPrice, setCurrentPrice] = useState('')
  const [previousPrice, setPreviousPrice] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [notes, setNotes] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState('ALL')
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'change' | 'recent'>('recent')

  // My Price Benchmark State
  const [myPrice, setMyPrice] = useState<string>('45')

  const currencySymbol = useMemo(() => {
    return DEFAULT_CURRENCIES.find((c) => c.code === currency)?.symbol || '$'
  }, [currency])

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanComp = competitor.trim()
    const cleanProd = product.trim()
    const numCurr = parseFloat(currentPrice)
    const numPrev = previousPrice.trim() !== '' ? parseFloat(previousPrice) : numCurr

    if (!cleanComp) {
      setFormError('Please enter a competitor or company name.')
      return
    }
    if (!cleanProd) {
      setFormError('Please enter the product or tier name.')
      return
    }
    if (isNaN(numCurr) || numCurr < 0) {
      setFormError('Please enter a valid positive current price.')
      return
    }

    setFormError(null)
    const newEntry: PriceEntry = {
      id: `price-${Date.now()}`,
      competitor: cleanComp,
      product: cleanProd,
      currentPrice: numCurr,
      previousPrice: isNaN(numPrev) ? numCurr : numPrev,
      currency,
      notes: notes.trim(),
      lastChecked: new Date().toISOString().split('T')[0],
    }

    setEntries((prev) => [newEntry, ...prev])
    setCompetitor('')
    setProduct('')
    setCurrentPrice('')
    setPreviousPrice('')
    setNotes('')
  }

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((item) => item.id !== id))
  }

  const handleResetToSample = () => {
    setEntries(SAMPLE_ENTRIES)
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all tracked pricing records?')) {
      setEntries([])
    }
  }

  // Filtered & Sorted Entries
  const filteredEntries = useMemo(() => {
    return entries
      .filter((item) => {
        const matchesSearch =
          item.competitor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.notes.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCurr = selectedCurrency === 'ALL' || item.currency === selectedCurrency
        return matchesSearch && matchesCurr
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.currentPrice - b.currentPrice
        if (sortBy === 'price-desc') return b.currentPrice - a.currentPrice
        if (sortBy === 'change') {
          const changeA = a.currentPrice - a.previousPrice
          const changeB = b.currentPrice - b.previousPrice
          return changeA - changeB
        }
        return new Date(b.lastChecked).getTime() - new Date(a.lastChecked).getTime()
      })
  }, [entries, searchQuery, selectedCurrency, sortBy])

  // Metrics
  const stats = useMemo(() => {
    if (filteredEntries.length === 0) {
      return { count: 0, min: 0, max: 0, avg: 0, spread: 0, lowestCompetitor: 'None' }
    }
    const prices = filteredEntries.map((e) => e.currentPrice)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const sum = prices.reduce((a, b) => a + b, 0)
    const avg = sum / prices.length
    const lowestItem = filteredEntries.find((e) => e.currentPrice === min)

    return {
      count: filteredEntries.length,
      min,
      max,
      avg,
      spread: max - min,
      lowestCompetitor: lowestItem ? `${lowestItem.competitor} (${lowestItem.currency} ${min})` : 'None',
    }
  }, [filteredEntries])

  // My Price Positioning Analysis
  const myBenchmark = useMemo(() => {
    const val = parseFloat(myPrice)
    if (isNaN(val) || val <= 0 || stats.count === 0) return null
    const diffFromAvg = val - stats.avg
    const pctFromAvg = (diffFromAvg / stats.avg) * 100
    const cheaperThanCount = filteredEntries.filter((e) => val < e.currentPrice).length
    const rank = filteredEntries.filter((e) => e.currentPrice < val).length + 1

    return {
      price: val,
      diffFromAvg,
      pctFromAvg,
      cheaperThanCount,
      rank,
      total: stats.count + 1,
    }
  }, [myPrice, stats, filteredEntries])

  // Export CSV
  const handleExportCSV = () => {
    if (filteredEntries.length === 0) return
    const headers = ['Competitor', 'Product', 'Current Price', 'Previous Price', 'Currency', 'Difference', '% Change', 'Last Checked', 'Notes']
    const rows = filteredEntries.map((e) => {
      const diff = e.currentPrice - e.previousPrice
      const pct = e.previousPrice > 0 ? ((diff / e.previousPrice) * 100).toFixed(1) : '0.0'
      return [
        `"${e.competitor.replace(/"/g, '""')}"`,
        `"${e.product.replace(/"/g, '""')}"`,
        e.currentPrice.toFixed(2),
        e.previousPrice.toFixed(2),
        e.currency,
        diff.toFixed(2),
        `${pct}%`,
        e.lastChecked,
        `"${e.notes.replace(/"/g, '""')}"`,
      ].join(',')
    })

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `qubnexa-competitor-pricing-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Copy Summary
  const handleCopySummary = () => {
    if (filteredEntries.length === 0) return
    let text = `QUBNEXA Competitor Pricing Summary (${new Date().toLocaleDateString()})\n`
    text += `Total Tracked: ${stats.count} | Avg Price: ${stats.avg.toFixed(2)} | Min: ${stats.min.toFixed(2)} | Max: ${stats.max.toFixed(2)}\n\n`
    filteredEntries.forEach((e) => {
      const diff = e.currentPrice - e.previousPrice
      const pct = e.previousPrice > 0 ? ((diff / e.previousPrice) * 100).toFixed(1) : '0'
      const changeStr = diff === 0 ? 'Unchanged' : diff < 0 ? `Dropped ${Math.abs(diff).toFixed(2)} (${pct}%)` : `Increased +${diff.toFixed(2)} (+${pct}%)`
      text += `• ${e.competitor} — ${e.product}: ${e.currency} ${e.currentPrice.toFixed(2)} (${changeStr})\n`
    })

    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  return (
    <div className="space-y-6">
      {/* 1. Header & Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="xw-panel p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Tracked</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {stats.count} <span className="text-xs font-normal text-slate-500">competitors</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Across active filters</span>
        </div>

        <div className="xw-panel p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average Price</span>
          <div className="text-2xl font-bold text-blue-600 dark:text-cyan-400 mt-1">
            {stats.count > 0 ? stats.avg.toFixed(2) : '0.00'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Market baseline</span>
        </div>

        <div className="xw-panel p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Lowest Price</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.count > 0 ? stats.min.toFixed(2) : '0.00'}
          </div>
          <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 truncate mt-1" title={stats.lowestCompetitor}>
            {stats.lowestCompetitor}
          </span>
        </div>

        <div className="xw-panel p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Price Spread</span>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {stats.count > 0 ? stats.spread.toFixed(2) : '0.00'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">High/Low gap</span>
        </div>
      </div>

      {/* 2. Position Benchmark Analyzer */}
      <div className="xw-panel p-4 sm:p-5 bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/50 dark:from-[#050814] dark:via-[#090D20] dark:to-[#050814] border border-blue-200/80 dark:border-blue-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600 dark:text-[#00DFFF]" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Your Competitive Market Position</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enter your own offering price to evaluate how you compare against tracked competitors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="my-price-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              My Price:
            </label>
            <div className="relative w-28">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
              <input
                id="my-price-input"
                type="number"
                min="0"
                step="0.01"
                value={myPrice}
                onChange={(e) => setMyPrice(e.target.value)}
                className="xw-input pl-6 py-1.5 text-xs font-mono font-bold"
                aria-label="My Product Price"
                placeholder="49.00"
              />
            </div>
          </div>
        </div>

        {myBenchmark && (
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Variance to Market:</span>
              <span
                className={`font-mono font-bold ${
                  myBenchmark.diffFromAvg < 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : myBenchmark.diffFromAvg > 0
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-600'
                }`}
              >
                {myBenchmark.diffFromAvg < 0 ? '-' : '+'}
                {Math.abs(myBenchmark.diffFromAvg).toFixed(2)} ({Math.abs(myBenchmark.pctFromAvg).toFixed(1)}%{' '}
                {myBenchmark.diffFromAvg < 0 ? 'lower' : 'higher'})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Cheaper Than:</span>
              <span className="font-mono font-bold text-blue-600 dark:text-cyan-400">
                {myBenchmark.cheaperThanCount} of {stats.count} competitors
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Market Rank:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                #{myBenchmark.rank} lowest of {myBenchmark.total} options
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Add Competitor Price Entry Form */}
      <div className="xw-panel p-4 sm:p-5">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Plus className="h-4 w-4 text-blue-600 dark:text-[#00DFFF]" />
          <span>Add Competitor Price Observation</span>
        </h3>

        {formError && (
          <div className="mb-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-400">
            {formError}
          </div>
        )}

        <form onSubmit={handleAddEntry} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label htmlFor="comp-name" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Competitor Name *
              </label>
              <input
                id="comp-name"
                type="text"
                value={competitor}
                onChange={(e) => setCompetitor(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="xw-input py-1.5 text-xs w-full"
                aria-label="Competitor Name"
                required
              />
            </div>

            <div>
              <label htmlFor="prod-name" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Product / Plan *
              </label>
              <input
                id="prod-name"
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g. Pro Plan, 1kg Bag"
                className="xw-input py-1.5 text-xs w-full"
                aria-label="Product or Plan Name"
                required
              />
            </div>

            <div>
              <label htmlFor="curr-price" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Current Price ({currencySymbol}) *
              </label>
              <input
                id="curr-price"
                type="number"
                step="0.01"
                min="0"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="49.99"
                className="xw-input py-1.5 text-xs w-full font-mono"
                aria-label="Current Price"
                required
              />
            </div>

            <div>
              <label htmlFor="prev-price" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Previous Price ({currencySymbol})
              </label>
              <input
                id="prev-price"
                type="number"
                step="0.01"
                min="0"
                value={previousPrice}
                onChange={(e) => setPreviousPrice(e.target.value)}
                placeholder="Optional baseline"
                className="xw-input py-1.5 text-xs w-full font-mono"
                aria-label="Previous Price"
              />
            </div>

            <div>
              <label htmlFor="entry-currency" className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Currency
              </label>
              <select
                id="entry-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="xw-input py-1.5 text-xs w-full font-medium"
                aria-label="Currency"
              >
                {DEFAULT_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="w-full sm:flex-1">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Pricing notes, promo details, discounts or billing frequency..."
                className="xw-input py-1.5 text-xs w-full"
                aria-label="Pricing Notes"
              />
            </div>
            <button
              type="submit"
              className="xw-btn-primary px-4 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap w-full sm:w-auto"
            >
              Add Price Record
            </button>
          </div>
        </form>
      </div>

      {/* 4. Controls Bar (Search, Filter, Export, Reset) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search competitor, product, or notes..."
              className="xw-input pl-8 py-1.5 text-xs w-full"
              aria-label="Search entries"
            />
          </div>

          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="xw-input py-1.5 text-xs whitespace-nowrap"
            aria-label="Filter Currency"
          >
            <option value="ALL">All Currencies</option>
            {DEFAULT_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="xw-input py-1.5 text-xs whitespace-nowrap"
            aria-label="Sort By"
          >
            <option value="recent">Most Recent</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="change">Price Drop First</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end flex-wrap">
          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#050814] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 font-semibold"
            aria-label="Copy summary report"
          >
            {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#050814] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 font-semibold"
            aria-label="Export to CSV"
          >
            <Download className="h-3.5 w-3.5" />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={handleResetToSample}
            className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            title="Reset to sample dataset"
            aria-label="Reset to sample dataset"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>

          {entries.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-2.5 py-1.5 rounded-xl text-red-500 hover:text-red-700 transition-colors"
              title="Clear all records"
              aria-label="Clear all records"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 5. Competitor Pricing Records Table */}
      <div className="xw-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#050814] border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Competitor</th>
                <th className="py-2.5 px-3">Product / Tier</th>
                <th className="py-2.5 px-3">Current Price</th>
                <th className="py-2.5 px-3">Baseline / Prev</th>
                <th className="py-2.5 px-3">Change</th>
                <th className="py-2.5 px-3">Checked</th>
                <th className="py-2.5 px-3">Notes</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No competitor price records match your filter criteria. Click "Reset to sample" or add a new entry.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((item) => {
                  const diff = item.currentPrice - item.previousPrice
                  const pct = item.previousPrice > 0 ? (diff / item.previousPrice) * 100 : 0

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{item.competitor}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{item.product}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        {item.currency} {item.currentPrice.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">
                        {item.currency} {item.previousPrice.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3">
                        {diff < 0 ? (
                          <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[11px] bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                            <TrendingDown className="h-3 w-3" />
                            {diff.toFixed(2)} ({pct.toFixed(1)}%)
                          </span>
                        ) : diff > 0 ? (
                          <span className="inline-flex items-center gap-0.5 text-red-600 dark:text-red-400 font-mono font-bold text-[11px] bg-red-50 dark:bg-red-950/60 px-1.5 py-0.5 rounded">
                            <TrendingUp className="h-3 w-3" />
                            +{diff.toFixed(2)} (+{pct.toFixed(1)}%)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-slate-400 font-mono text-[11px]">
                            <Minus className="h-3 w-3" /> 0.00
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px] font-mono">{item.lastChecked}</td>
                      <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 max-w-xs truncate" title={item.notes}>
                        {item.notes || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteEntry(item.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete entry"
                          aria-label={`Delete ${item.competitor} ${item.product}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Honest Workspace Disclaimer Banner */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#050814] border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
        <HelpCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Privacy-First Manual Market Intelligence Workspace
          </p>
          <p>
            All price entries are stored solely in your local browser storage (<code className="font-mono">localStorage</code>). No competitor data is ever transmitted to Qubnexa servers or scraped automatically. Use this tracker to log mystery shops, subscription audits, and product pricing revisions securely.
          </p>
        </div>
      </div>
    </div>
  )
}
