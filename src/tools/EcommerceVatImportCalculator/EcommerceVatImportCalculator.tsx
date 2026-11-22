import React, { useState, useMemo } from 'react'
import {
  Calculator,
  FileSpreadsheet,
  Copy,
  Check,
  RefreshCw,
  HelpCircle,
  Layers,
} from 'lucide-react'

interface CountryPreset {
  country: string
  code: string
  vatRate: number
  currency: string
  description: string
}

const COUNTRY_PRESETS: CountryPreset[] = [
  { country: 'United Kingdom', code: 'UK', vatRate: 20.0, currency: 'GBP', description: 'Standard UK VAT (20%)' },
  { country: 'Germany (EU)', code: 'DE', vatRate: 19.0, currency: 'EUR', description: 'Standard German MwSt (19%)' },
  { country: 'France (EU)', code: 'FR', vatRate: 20.0, currency: 'EUR', description: 'Standard French TVA (20%)' },
  { country: 'Spain (EU)', code: 'ES', vatRate: 21.0, currency: 'EUR', description: 'Standard Spanish IVA (21%)' },
  { country: 'Italy (EU)', code: 'IT', vatRate: 22.0, currency: 'EUR', description: 'Standard Italian IVA (22%)' },
  { country: 'United States', code: 'US', vatRate: 0.0, currency: 'USD', description: 'No Federal VAT (State sales tax applies at retail)' },
  { country: 'Canada', code: 'CA', vatRate: 5.0, currency: 'CAD', description: 'Federal GST (5%) + Provincial tax' },
  { country: 'Australia', code: 'AU', vatRate: 10.0, currency: 'AUD', description: 'Australian GST (10%)' },
  { country: 'India', code: 'IN', vatRate: 18.0, currency: 'INR', description: 'Standard IGST on imports (18%)' },
  { country: 'Custom / Other', code: 'CUSTOM', vatRate: 15.0, currency: 'USD', description: 'User-specified VAT / GST rate' },
]

interface CategoryDutyPreset {
  name: string
  dutyRate: number
}

const DUTY_PRESETS: CategoryDutyPreset[] = [
  { name: 'Custom Rate', dutyRate: 0 },
  { name: 'Computers & Electronics (0.0%)', dutyRate: 0.0 },
  { name: 'Apparel & Clothing (12.0%)', dutyRate: 12.0 },
  { name: 'Footwear & Shoes (17.0%)', dutyRate: 17.0 },
  { name: 'Toys & Board Games (4.7%)', dutyRate: 4.7 },
  { name: 'Beauty & Cosmetics (6.5%)', dutyRate: 6.5 },
  { name: 'Automotive & Motorcycle Parts (3.0%)', dutyRate: 3.0 },
  { name: 'Kitchenware & Stainless Steel (4.0%)', dutyRate: 4.0 },
  { name: 'Jewelry & Watches (5.5%)', dutyRate: 5.5 },
]

export const EcommerceVatImportCalculator: React.FC = () => {
  // Inputs
  const [unitCost, setUnitCost] = useState<number>(25)
  const [quantity, setQuantity] = useState<number>(500)
  const [shippingCost, setShippingCost] = useState<number>(1200)
  const [insuranceCost, setInsuranceCost] = useState<number>(85)
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('UK')
  const [customVatRate, setCustomVatRate] = useState<number>(20.0)
  const [selectedDutyCategory, setSelectedDutyCategory] = useState<string>('Apparel & Clothing (12.0%)')
  const [dutyRate, setDutyRate] = useState<number>(12.0)
  const [clearanceFee, setClearanceFee] = useState<number>(150)
  const [targetRetailPrice, setTargetRetailPrice] = useState<number>(69.99)
  const [isCopied, setIsCopied] = useState<boolean>(false)

  // Handle Country Selection
  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code)
    const p = COUNTRY_PRESETS.find((c) => c.code === code)
    if (p) {
      setCustomVatRate(p.vatRate)
    }
  }

  // Handle Duty Category Selection
  const handleDutyCategoryChange = (catName: string) => {
    setSelectedDutyCategory(catName)
    const p = DUTY_PRESETS.find((d) => d.name === catName)
    if (p && p.name !== 'Custom Rate') {
      setDutyRate(p.dutyRate)
    }
  }

  // Active VAT rate
  const activeVatRate = useMemo(() => {
    return Math.max(0, Math.min(100, Number(customVatRate) || 0))
  }, [customVatRate])

  // Calculations
  const calculations = useMemo(() => {
    const qty = Math.max(1, Math.round(Number(quantity) || 1))
    const costPerItem = Math.max(0, Number(unitCost) || 0)
    const freight = Math.max(0, Number(shippingCost) || 0)
    const insurance = Math.max(0, Number(insuranceCost) || 0)
    const dutyPct = Math.max(0, Math.min(100, Number(dutyRate) || 0))
    const fees = Math.max(0, Number(clearanceFee) || 0)
    const retail = Math.max(0, Number(targetRetailPrice) || 0)

    // 1. Goods Subtotal (FOB)
    const totalGoodsFOB = costPerItem * qty

    // 2. Customs Assessable Value (CIF = FOB + Freight + Insurance)
    const cifValue = totalGoodsFOB + freight + insurance

    // 3. Customs Import Duty
    const dutyAmount = cifValue * (dutyPct / 100)

    // 4. Landed Base before VAT
    const baseBeforeVat = cifValue + dutyAmount + fees

    // 5. Import VAT / GST
    const vatAmount = baseBeforeVat * (activeVatRate / 100)

    // 6. Total Landed Cost
    const totalLandedCost = baseBeforeVat + vatAmount

    // 7. Per Unit Metrics
    const landedCostPerUnit = totalLandedCost / qty
    const dutyPerUnit = dutyAmount / qty
    const vatPerUnit = vatAmount / qty
    const shippingPerUnit = (freight + insurance) / qty
    const feesPerUnit = fees / qty

    // 8. Profit & Margin Analysis
    const profitPerUnit = retail - landedCostPerUnit
    const profitMarginPct = retail > 0 ? (profitPerUnit / retail) * 100 : 0
    const totalProjectedRevenue = retail * qty
    const totalProjectedProfit = profitPerUnit * qty
    const markupPct = landedCostPerUnit > 0 ? (profitPerUnit / landedCostPerUnit) * 100 : 0

    // 9. Cost Breakdown Percentages
    const pctGoods = totalLandedCost > 0 ? (totalGoodsFOB / totalLandedCost) * 100 : 0
    const pctShipping = totalLandedCost > 0 ? ((freight + insurance) / totalLandedCost) * 100 : 0
    const pctDuty = totalLandedCost > 0 ? (dutyAmount / totalLandedCost) * 100 : 0
    const pctVat = totalLandedCost > 0 ? (vatAmount / totalLandedCost) * 100 : 0
    const pctFees = totalLandedCost > 0 ? (fees / totalLandedCost) * 100 : 0

    return {
      qty,
      totalGoodsFOB,
      cifValue,
      dutyAmount,
      baseBeforeVat,
      vatAmount,
      totalLandedCost,
      landedCostPerUnit,
      dutyPerUnit,
      vatPerUnit,
      shippingPerUnit,
      feesPerUnit,
      profitPerUnit,
      profitMarginPct,
      totalProjectedRevenue,
      totalProjectedProfit,
      markupPct,
      pctGoods,
      pctShipping,
      pctDuty,
      pctVat,
      pctFees,
    }
  }, [unitCost, quantity, shippingCost, insuranceCost, dutyRate, activeVatRate, clearanceFee, targetRetailPrice])

  const activeCountry = useMemo(() => {
    return COUNTRY_PRESETS.find((c) => c.code === selectedCountryCode) || COUNTRY_PRESETS[0]
  }, [selectedCountryCode])

  const handleCopySummary = () => {
    let text = `QUBNEXA Ecommerce Landed Cost & VAT Summary\n`
    text += `Destination: ${activeCountry.country} (VAT: ${activeVatRate}%, Duty: ${dutyRate}%)\n`
    text += `Quantity: ${calculations.qty} units | Unit FOB Cost: $${Number(unitCost).toFixed(2)}\n\n`
    text += `• Total Goods (FOB): $${calculations.totalGoodsFOB.toFixed(2)}\n`
    text += `• Freight & Insurance: $${(Number(shippingCost) + Number(insuranceCost)).toFixed(2)}\n`
    text += `• Customs Duty: $${calculations.dutyAmount.toFixed(2)} (${dutyRate}%)\n`
    text += `• Customs Handling Fees: $${Number(clearanceFee).toFixed(2)}\n`
    text += `• Import VAT / GST: $${calculations.vatAmount.toFixed(2)} (${activeVatRate}%)\n`
    text += `--------------------------------------\n`
    text += `TOTAL LANDED COST: $${calculations.totalLandedCost.toFixed(2)}\n`
    text += `LANDED COST PER UNIT: $${calculations.landedCostPerUnit.toFixed(2)}\n`
    text += `Target Retail Price: $${Number(targetRetailPrice).toFixed(2)}\n`
    text += `Projected Profit / Unit: $${calculations.profitPerUnit.toFixed(2)} (${calculations.profitMarginPct.toFixed(1)}% margin)\n`

    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  const handleExportCSV = () => {
    const headers = ['Cost Component', 'Total Amount ($)', 'Per Unit ($)', '% of Total Landed Cost']
    const rows = [
      ['Product Goods (FOB)', calculations.totalGoodsFOB.toFixed(2), Number(unitCost).toFixed(2), `${calculations.pctGoods.toFixed(1)}%`],
      ['Freight & Cargo Insurance', (Number(shippingCost) + Number(insuranceCost)).toFixed(2), calculations.shippingPerUnit.toFixed(2), `${calculations.pctShipping.toFixed(1)}%`],
      [`Customs Duty (${dutyRate}%)`, calculations.dutyAmount.toFixed(2), calculations.dutyPerUnit.toFixed(2), `${calculations.pctDuty.toFixed(1)}%`],
      ['Brokerage & Handling Fees', Number(clearanceFee).toFixed(2), calculations.feesPerUnit.toFixed(2), `${calculations.pctFees.toFixed(1)}%`],
      [`Import VAT / GST (${activeVatRate}%)`, calculations.vatAmount.toFixed(2), calculations.vatPerUnit.toFixed(2), `${calculations.pctVat.toFixed(1)}%`],
      ['TOTAL LANDED COST', calculations.totalLandedCost.toFixed(2), calculations.landedCostPerUnit.toFixed(2), '100.0%'],
      ['TARGET RETAIL PRICE', (Number(targetRetailPrice) * calculations.qty).toFixed(2), Number(targetRetailPrice).toFixed(2), '—'],
      ['PROJECTED NET PROFIT', calculations.totalProjectedProfit.toFixed(2), calculations.profitPerUnit.toFixed(2), `${calculations.profitMarginPct.toFixed(1)}% margin`],
    ]

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `qubnexa-landed-cost-quote-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setUnitCost(25)
    setQuantity(500)
    setShippingCost(1200)
    setInsuranceCost(85)
    setSelectedCountryCode('UK')
    setCustomVatRate(20.0)
    setSelectedDutyCategory('Apparel & Clothing (12.0%)')
    setDutyRate(12.0)
    setClearanceFee(150)
    setTargetRetailPrice(69.99)
  }

  return (
    <div className="space-y-6">
      {/* 1. Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="xw-panel p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Landed Cost</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            ${calculations.totalLandedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">For {calculations.qty} units imported</span>
        </div>

        <div className="xw-panel p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Landed Cost / Unit</span>
          <div className="text-2xl font-bold text-blue-600 dark:text-cyan-400 mt-1">
            ${calculations.landedCostPerUnit.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">FOB: ${Number(unitCost).toFixed(2)} / unit</span>
        </div>

        <div className="xw-panel p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Profit / Unit</span>
          <div
            className={`text-2xl font-bold mt-1 ${
              calculations.profitPerUnit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            ${calculations.profitPerUnit.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            {calculations.profitMarginPct.toFixed(1)}% profit margin
          </span>
        </div>

        <div className="xw-panel p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Projected Profit</span>
          <div
            className={`text-2xl font-bold mt-1 ${
              calculations.totalProjectedProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            ${calculations.totalProjectedProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 mt-1">At ${Number(targetRetailPrice).toFixed(2)} retail</span>
        </div>
      </div>

      {/* 2. Visual Cost Breakdown Stack */}
      <div className="xw-panel p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-blue-600 dark:text-[#00DFFF]" />
            <span>Landed Cost Composition Breakdown</span>
          </span>
          <span className="font-mono text-slate-500">
            Total Base: ${calculations.totalLandedCost.toFixed(2)}
          </span>
        </div>

        {/* Stacked Percentage Bar */}
        <div className="h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${calculations.pctGoods}%` }}
            className="bg-blue-600 dark:bg-cyan-500"
            title={`Product Goods: ${calculations.pctGoods.toFixed(1)}%`}
          />
          <div
            style={{ width: `${calculations.pctShipping}%` }}
            className="bg-sky-500"
            title={`Freight & Insurance: ${calculations.pctShipping.toFixed(1)}%`}
          />
          <div
            style={{ width: `${calculations.pctDuty}%` }}
            className="bg-amber-500"
            title={`Customs Duty: ${calculations.pctDuty.toFixed(1)}%`}
          />
          <div
            style={{ width: `${calculations.pctVat}%` }}
            className="bg-purple-600"
            title={`Import VAT / GST: ${calculations.pctVat.toFixed(1)}%`}
          />
          <div
            style={{ width: `${calculations.pctFees}%` }}
            className="bg-emerald-600"
            title={`Port & Clearance Fees: ${calculations.pctFees.toFixed(1)}%`}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-cyan-500" />
            <span>Goods ({calculations.pctGoods.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
            <span>Freight ({calculations.pctShipping.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>Duty ({calculations.pctDuty.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-600" />
            <span>VAT / GST ({calculations.pctVat.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
            <span>Brokerage ({calculations.pctFees.toFixed(1)}%)</span>
          </div>
        </div>
      </div>

      {/* 3. Calculator Inputs Grid */}
      <div className="xw-panel p-4 sm:p-5 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-blue-600 dark:text-[#00DFFF]" />
            <span>Order, Shipping & Tax Parameters</span>
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
            title="Reset defaults"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Unit Cost */}
          <div className="space-y-1">
            <label htmlFor="unit-cost" className="font-semibold text-slate-700 dark:text-slate-300">
              Product FOB Cost / Unit ($)
            </label>
            <input
              id="unit-cost"
              type="number"
              step="0.01"
              min="0"
              value={unitCost}
              onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
              className="xw-input py-2 text-xs font-mono font-bold w-full"
              aria-label="Unit Cost in dollars"
            />
          </div>

          {/* Quantity */}
          <div className="space-y-1">
            <label htmlFor="order-qty" className="font-semibold text-slate-700 dark:text-slate-300">
              Order Quantity (Units)
            </label>
            <input
              id="order-qty"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
              className="xw-input py-2 text-xs font-mono font-bold w-full"
              aria-label="Order Quantity"
            />
          </div>

          {/* Shipping Cost */}
          <div className="space-y-1">
            <label htmlFor="shipping-cost" className="font-semibold text-slate-700 dark:text-slate-300">
              Total Freight / Shipping ($)
            </label>
            <input
              id="shipping-cost"
              type="number"
              min="0"
              value={shippingCost}
              onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
              className="xw-input py-2 text-xs font-mono font-bold w-full"
              aria-label="Shipping Cost"
            />
          </div>

          {/* Insurance Cost */}
          <div className="space-y-1">
            <label htmlFor="insurance-cost" className="font-semibold text-slate-700 dark:text-slate-300">
              Cargo Insurance ($)
            </label>
            <input
              id="insurance-cost"
              type="number"
              min="0"
              value={insuranceCost}
              onChange={(e) => setInsuranceCost(parseFloat(e.target.value) || 0)}
              className="xw-input py-2 text-xs font-mono font-bold w-full"
              aria-label="Insurance Cost"
            />
          </div>

          {/* Destination Country / VAT Preset */}
          <div className="space-y-1">
            <label htmlFor="country-preset" className="font-semibold text-slate-700 dark:text-slate-300">
              Destination Country & VAT
            </label>
            <select
              id="country-preset"
              value={selectedCountryCode}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="xw-input py-2 text-xs font-medium w-full"
              aria-label="Destination Country"
            >
              {COUNTRY_PRESETS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.country} ({c.vatRate}% VAT)
                </option>
              ))}
            </select>
          </div>

          {/* Custom VAT Rate */}
          <div className="space-y-1">
            <label htmlFor="vat-rate" className="font-semibold text-slate-700 dark:text-slate-300">
              Effective VAT / GST Rate (%)
            </label>
            <input
              id="vat-rate"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={customVatRate}
              onChange={(e) => setCustomVatRate(parseFloat(e.target.value) || 0)}
              className="xw-input py-2 text-xs font-mono font-bold w-full"
              aria-label="VAT Rate percentage"
            />
          </div>

          {/* Duty Category Preset */}
          <div className="space-y-1">
            <label htmlFor="duty-preset" className="font-semibold text-slate-700 dark:text-slate-300">
              Product Category Duty Preset
            </label>
            <select
              id="duty-preset"
              value={selectedDutyCategory}
              onChange={(e) => handleDutyCategoryChange(e.target.value)}
              className="xw-input py-2 text-xs font-medium w-full"
              aria-label="Product Duty Category Preset"
            >
              {DUTY_PRESETS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Duty Rate % */}
          <div className="space-y-1">
            <label htmlFor="duty-rate" className="font-semibold text-slate-700 dark:text-slate-300">
              Import Duty Rate (%)
            </label>
            <input
              id="duty-rate"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={dutyRate}
              onChange={(e) => {
                setSelectedDutyCategory('Custom Rate')
                setDutyRate(parseFloat(e.target.value) || 0)
              }}
              className="xw-input py-2 text-xs font-mono font-bold w-full"
              aria-label="Duty Rate percentage"
            />
          </div>

          {/* Customs Brokerage / Port Fees */}
          <div className="space-y-1">
            <label htmlFor="clearance-fee" className="font-semibold text-slate-700 dark:text-slate-300">
              Customs Brokerage & Port Fees ($)
            </label>
            <input
              id="clearance-fee"
              type="number"
              min="0"
              value={clearanceFee}
              onChange={(e) => setClearanceFee(parseFloat(e.target.value) || 0)}
              className="xw-input py-2 text-xs font-mono font-bold w-full"
              aria-label="Clearance Fee"
            />
          </div>

          {/* Target Selling Price */}
          <div className="space-y-1">
            <label htmlFor="retail-price" className="font-semibold text-slate-700 dark:text-slate-300">
              Target Retail Selling Price ($)
            </label>
            <input
              id="retail-price"
              type="number"
              step="0.01"
              min="0"
              value={targetRetailPrice}
              onChange={(e) => setTargetRetailPrice(parseFloat(e.target.value) || 0)}
              className="xw-input py-2 text-xs font-mono font-bold w-full"
              aria-label="Target Retail Selling Price"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#050814] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 font-semibold"
            aria-label="Copy Landed Cost Summary"
          >
            {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{isCopied ? 'Copied' : 'Copy Summary'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="xw-btn-primary px-4 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5"
            aria-label="Export quote to CSV"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4. Detailed Cost Schedule Table */}
      <div className="xw-panel overflow-hidden">
        <div className="p-3 bg-slate-50/70 dark:bg-[#050814] border-b border-slate-200/80 dark:border-slate-800 font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
          <span>Itemized Landed Cost Schedule</span>
          <span className="text-[11px] font-normal text-slate-500">Destination: {activeCountry.description}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#050814] border-b border-slate-200/80 dark:border-slate-800 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Component</th>
                <th className="py-2.5 px-3">Basis / Rate</th>
                <th className="py-2.5 px-3 text-right">Total ($)</th>
                <th className="py-2.5 px-3 text-right">Cost / Unit ($)</th>
                <th className="py-2.5 px-3 text-right">Share (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              <tr>
                <td className="py-2.5 px-3 text-slate-900 dark:text-white font-semibold">Product Goods (FOB)</td>
                <td className="py-2.5 px-3 text-slate-500">{calculations.qty} units @ ${Number(unitCost).toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right font-mono">${calculations.totalGoodsFOB.toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right font-mono">${Number(unitCost).toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-500">{calculations.pctGoods.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-900 dark:text-white font-semibold">Freight & Cargo Insurance</td>
                <td className="py-2.5 px-3 text-slate-500">Carrier shipment + policy</td>
                <td className="py-2.5 px-3 text-right font-mono">${(Number(shippingCost) + Number(insuranceCost)).toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right font-mono">${calculations.shippingPerUnit.toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-500">{calculations.pctShipping.toFixed(1)}%</td>
              </tr>
              <tr className="bg-slate-50/50 dark:bg-slate-900/20 text-slate-700 dark:text-slate-300">
                <td className="py-2.5 px-3 font-semibold text-blue-700 dark:text-cyan-400">Customs CIF Assessable Value</td>
                <td className="py-2.5 px-3 text-slate-500">FOB + Shipping + Insurance</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold">${calculations.cifValue.toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold">${(calculations.cifValue / calculations.qty).toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-500">—</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-900 dark:text-white font-semibold">Customs Import Duty</td>
                <td className="py-2.5 px-3 text-slate-500">{dutyRate}% of CIF value</td>
                <td className="py-2.5 px-3 text-right font-mono text-amber-600 dark:text-amber-400">${calculations.dutyAmount.toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-amber-600 dark:text-amber-400">${calculations.dutyPerUnit.toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-500">{calculations.pctDuty.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-900 dark:text-white font-semibold">Brokerage & Port Clearance Fees</td>
                <td className="py-2.5 px-3 text-slate-500">Fixed documentation fee</td>
                <td className="py-2.5 px-3 text-right font-mono">${Number(clearanceFee).toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right font-mono">${calculations.feesPerUnit.toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-500">{calculations.pctFees.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-900 dark:text-white font-semibold">Import VAT / GST</td>
                <td className="py-2.5 px-3 text-slate-500">{activeVatRate}% on (CIF + Duty + Fees)</td>
                <td className="py-2.5 px-3 text-right font-mono text-purple-600 dark:text-purple-400">${calculations.vatAmount.toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-purple-600 dark:text-purple-400">${calculations.vatPerUnit.toFixed(2)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-500">{calculations.pctVat.toFixed(1)}%</td>
              </tr>
              <tr className="bg-blue-50/50 dark:bg-[#050814] font-bold text-slate-900 dark:text-white border-t border-blue-200 dark:border-blue-900">
                <td className="py-3 px-3 text-blue-700 dark:text-[#00DFFF]">TOTAL LANDED COST</td>
                <td className="py-3 px-3">All import costs combined</td>
                <td className="py-3 px-3 text-right font-mono text-sm text-blue-700 dark:text-[#00DFFF]">${calculations.totalLandedCost.toFixed(2)}</td>
                <td className="py-3 px-3 text-right font-mono text-sm text-blue-700 dark:text-[#00DFFF]">${calculations.landedCostPerUnit.toFixed(2)}</td>
                <td className="py-3 px-3 text-right font-mono">100.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Legal Disclaimer */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#050814] border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
        <HelpCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Important Customs & Tax Planning Notice
          </p>
          <p>
            Calculations provided by this tool are estimates for commercial budgeting and inventory pricing analysis. Official tariff rates depend on exact Harmonized System (HS) code classifications, country-of-origin trade agreements, anti-dumping duties, and port of entry inspections. This tool does not constitute legal or tax advice.
          </p>
        </div>
      </div>
    </div>
  )
}

export default EcommerceVatImportCalculator
