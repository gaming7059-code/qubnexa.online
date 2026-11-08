/**
 * Pure Calculation Functions for Comprehensive Multi-Category Unit Converter
 * Handles 8 categories with high-precision ratios and exact temperature formulas.
 */

export interface UnitDefinition {
  id: string
  name: string
  symbol: string
  ratioToBase?: number // Multiplier to convert to base unit
}

export interface UnitCategory {
  id: string
  name: string
  emoji: string
  units: UnitDefinition[]
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length',
    emoji: '📏',
    units: [
      { id: 'mm', name: 'Millimeter', symbol: 'mm', ratioToBase: 0.001 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', ratioToBase: 0.01 },
      { id: 'm', name: 'Meter (Base)', symbol: 'm', ratioToBase: 1 },
      { id: 'km', name: 'Kilometer', symbol: 'km', ratioToBase: 1000 },
      { id: 'in', name: 'Inch', symbol: 'in', ratioToBase: 0.0254 },
      { id: 'ft', name: 'Foot', symbol: 'ft', ratioToBase: 0.3048 },
      { id: 'yd', name: 'Yard', symbol: 'yd', ratioToBase: 0.9144 },
      { id: 'mi', name: 'Mile', symbol: 'mi', ratioToBase: 1609.344 },
      { id: 'nm', name: 'Nautical Mile', symbol: 'nmi', ratioToBase: 1852 },
    ],
  },
  {
    id: 'weight',
    name: 'Weight / Mass',
    emoji: '⚖️',
    units: [
      { id: 'mg', name: 'Milligram', symbol: 'mg', ratioToBase: 0.000001 },
      { id: 'g', name: 'Gram', symbol: 'g', ratioToBase: 0.001 },
      { id: 'kg', name: 'Kilogram (Base)', symbol: 'kg', ratioToBase: 1 },
      { id: 't', name: 'Tonne (Metric)', symbol: 't', ratioToBase: 1000 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', ratioToBase: 0.028349523125 },
      { id: 'lb', name: 'Pound', symbol: 'lb', ratioToBase: 0.45359237 },
      { id: 'st', name: 'Stone (UK)', symbol: 'st', ratioToBase: 6.35029318 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    emoji: '🌡️',
    units: [
      { id: 'celsius', name: 'Celsius', symbol: '°C' },
      { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F' },
      { id: 'kelvin', name: 'Kelvin', symbol: 'K' },
    ],
  },
  {
    id: 'area',
    name: 'Area',
    emoji: '📐',
    units: [
      { id: 'sq_m', name: 'Square meter (Base)', symbol: 'm²', ratioToBase: 1 },
      { id: 'sq_km', name: 'Square kilometer', symbol: 'km²', ratioToBase: 1000000 },
      { id: 'sq_cm', name: 'Square centimeter', symbol: 'cm²', ratioToBase: 0.0001 },
      { id: 'sq_ft', name: 'Square foot', symbol: 'ft²', ratioToBase: 0.09290304 },
      { id: 'sq_yd', name: 'Square yard', symbol: 'yd²', ratioToBase: 0.83612736 },
      { id: 'sq_mi', name: 'Square mile', symbol: 'mi²', ratioToBase: 2589988.110336 },
      { id: 'acre', name: 'Acre', symbol: 'ac', ratioToBase: 4046.8564224 },
      { id: 'hectare', name: 'Hectare', symbol: 'ha', ratioToBase: 10000 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    emoji: '🧪',
    units: [
      { id: 'ml', name: 'Milliliter', symbol: 'mL', ratioToBase: 0.001 },
      { id: 'l', name: 'Liter (Base)', symbol: 'L', ratioToBase: 1 },
      { id: 'cu_m', name: 'Cubic meter', symbol: 'm³', ratioToBase: 1000 },
      { id: 'cu_cm', name: 'Cubic centimeter', symbol: 'cm³', ratioToBase: 0.001 },
      { id: 'cu_ft', name: 'Cubic foot', symbol: 'ft³', ratioToBase: 28.316846592 },
      { id: 'cu_in', name: 'Cubic inch', symbol: 'in³', ratioToBase: 0.016387064 },
      { id: 'gal_us', name: 'Gallon (US)', symbol: 'gal', ratioToBase: 3.785411784 },
      { id: 'gal_uk', name: 'Gallon (Imperial/UK)', symbol: 'imp gal', ratioToBase: 4.54609 },
      { id: 'fl_oz', name: 'Fluid Ounce (US)', symbol: 'fl oz', ratioToBase: 0.0295735295625 },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    emoji: '🚀',
    units: [
      { id: 'm_s', name: 'Meter per second (Base)', symbol: 'm/s', ratioToBase: 1 },
      { id: 'km_h', name: 'Kilometer per hour', symbol: 'km/h', ratioToBase: 1 / 3.6 },
      { id: 'mph', name: 'Mile per hour', symbol: 'mph', ratioToBase: 0.44704 },
      { id: 'knot', name: 'Knot (Nautical mi/h)', symbol: 'kn', ratioToBase: 0.5144444444444445 },
      { id: 'ft_s', name: 'Foot per second', symbol: 'ft/s', ratioToBase: 0.3048 },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    emoji: '⏱️',
    units: [
      { id: 'ms', name: 'Milliseconds', symbol: 'ms', ratioToBase: 0.001 },
      { id: 's', name: 'Seconds (Base)', symbol: 's', ratioToBase: 1 },
      { id: 'min', name: 'Minutes', symbol: 'min', ratioToBase: 60 },
      { id: 'h', name: 'Hours', symbol: 'h', ratioToBase: 3600 },
      { id: 'd', name: 'Days', symbol: 'd', ratioToBase: 86400 },
      { id: 'wk', name: 'Weeks', symbol: 'wk', ratioToBase: 604800 },
      { id: 'mo', name: 'Months (30.4 days avg)', symbol: 'mo', ratioToBase: 2629800 },
      { id: 'yr', name: 'Years (365.25 days)', symbol: 'yr', ratioToBase: 31557600 },
    ],
  },
  {
    id: 'digital',
    name: 'Digital Storage',
    emoji: '💾',
    units: [
      { id: 'bit', name: 'Bit', symbol: 'b', ratioToBase: 0.125 },
      { id: 'b', name: 'Byte (Base)', symbol: 'B', ratioToBase: 1 },
      { id: 'kb', name: 'Kilobyte (KB)', symbol: 'KB', ratioToBase: 1024 },
      { id: 'mb', name: 'Megabyte (MB)', symbol: 'MB', ratioToBase: 1048576 },
      { id: 'gb', name: 'Gigabyte (GB)', symbol: 'GB', ratioToBase: 1073741824 },
      { id: 'tb', name: 'Terabyte (TB)', symbol: 'TB', ratioToBase: 1099511627776 },
      { id: 'pb', name: 'Petabyte (PB)', symbol: 'PB', ratioToBase: 1125899906842624 },
    ],
  },
]

export interface ConversionResult {
  success: boolean
  result?: number
  formatted?: string
  formula?: string
  error?: string
}

/**
 * Formats clean readable number with appropriate decimals
 */
export function formatCleanNumber(num: number, precision: 'auto' | 2 | 4 | 6 | 8 = 'auto'): string {
  if (Math.abs(num) < 1e-9 && num !== 0) {
    return num.toExponential(4)
  }
  if (Math.abs(num) >= 1e12) {
    return num.toExponential(6)
  }

  if (precision === 'auto') {
    // Round to max 8 decimal places and strip trailing zeros
    const rounded = Math.round(num * 1e8) / 1e8
    return rounded.toLocaleString('en-IN', {
      maximumFractionDigits: 8,
    })
  }

  return num.toLocaleString('en-IN', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })
}

/**
 * Converts Temperature via exact non-linear formulas
 */
function convertTemperature(
  value: number,
  fromId: string,
  toId: string,
  fromSymbol: string,
  toSymbol: string,
  precision: 'auto' | 2 | 4 | 6 | 8 = 'auto'
): ConversionResult {
  let inCelsius = value

  // Convert source to Celsius
  if (fromId === 'celsius') {
    inCelsius = value
  } else if (fromId === 'fahrenheit') {
    inCelsius = (value - 32) * (5 / 9)
  } else if (fromId === 'kelvin') {
    inCelsius = value - 273.15
  }

  // Convert Celsius to target
  let finalResult = inCelsius
  let formulaStr = ''

  if (toId === 'celsius') {
    finalResult = inCelsius
    if (fromId === 'fahrenheit') formulaStr = `(°F - 32) × 5/9 = °C`
    else if (fromId === 'kelvin') formulaStr = `K - 273.15 = °C`
  } else if (toId === 'fahrenheit') {
    finalResult = inCelsius * (9 / 5) + 32
    if (fromId === 'celsius') formulaStr = `(°C × 9/5) + 32 = °F`
    else if (fromId === 'kelvin') formulaStr = `(K - 273.15) × 9/5 + 32 = °F`
  } else if (toId === 'kelvin') {
    finalResult = inCelsius + 273.15
    if (fromId === 'celsius') formulaStr = `°C + 273.15 = K`
    else if (fromId === 'fahrenheit') formulaStr = `(°F - 32) × 5/9 + 273.15 = K`
  }

  return {
    success: true,
    result: finalResult,
    formatted: formatCleanNumber(finalResult, precision),
    formula: formulaStr || `1 ${fromSymbol} = ${formatCleanNumber(finalResult, precision)} ${toSymbol}`,
  }
}

/**
 * Converts a numeric value between two units within an 8-category domain
 */
export function convertUnit(
  value: number,
  fromUnitId: string,
  toUnitId: string,
  categoryId: string,
  precision: 'auto' | 2 | 4 | 6 | 8 = 'auto'
): ConversionResult {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return { success: false, error: 'Please enter a valid numeric value.' }
  }

  const category = UNIT_CATEGORIES.find((c) => c.id === categoryId)
  if (!category) {
    return { success: false, error: 'Invalid conversion category.' }
  }

  const fromUnit = category.units.find((u) => u.id === fromUnitId)
  const toUnit = category.units.find((u) => u.id === toUnitId)

  if (!fromUnit || !toUnit) {
    return { success: false, error: 'Invalid units selected.' }
  }

  if (fromUnitId === toUnitId) {
    return {
      success: true,
      result: value,
      formatted: formatCleanNumber(value, precision),
      formula: `1 ${fromUnit.symbol} = 1 ${toUnit.symbol}`,
    }
  }

  // Handle Temperature via exact non-linear formulas
  if (categoryId === 'temperature') {
    return convertTemperature(value, fromUnitId, toUnitId, fromUnit.symbol, toUnit.symbol, precision)
  }

  // Standard multiplier-based conversion via base unit
  const baseValue = value * (fromUnit.ratioToBase ?? 1)
  const result = baseValue / (toUnit.ratioToBase ?? 1)

  // Construct readable formula
  const ratio = (fromUnit.ratioToBase ?? 1) / (toUnit.ratioToBase ?? 1)
  const formula = `1 ${fromUnit.symbol} = ${formatCleanNumber(ratio)} ${toUnit.symbol}`

  return {
    success: true,
    result,
    formatted: formatCleanNumber(result, precision),
    formula,
  }
}

/**
 * Returns batch conversions for all units in a category (for quick reference grid)
 */
export function getAllCategoryConversions(
  value: number,
  fromUnitId: string,
  categoryId: string,
  precision: 'auto' | 2 | 4 | 6 | 8 = 'auto'
): Array<{ unit: UnitDefinition; formatted: string }> {
  const category = UNIT_CATEGORIES.find((c) => c.id === categoryId)
  if (!category || Number.isNaN(value) || !Number.isFinite(value)) return []

  return category.units.map((unit) => {
    const conv = convertUnit(value, fromUnitId, unit.id, categoryId, precision)
    return {
      unit,
      formatted: conv.success && conv.formatted ? conv.formatted : '—',
    }
  })
}
