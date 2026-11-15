import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { UnitConverter } from '../../tools/UnitConverter/UnitConverter'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const UnitConverterPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'unit-converter')!

  const howToUseSteps = [
    'Choose a measurement category from the 8 top buttons: Length, Weight / Mass, Temperature, Area, Volume, Speed, Time, or Digital Storage.',
    'Select your source unit in the "Convert From" dropdown and your target unit in the "Converted To" dropdown.',
    'Enter your number in the value input. Decimal numbers, fractional values, and large numbers are calculated instantaneously as you type.',
    'Click the bidirectional swap button (⇄) between the units to invert the conversion direction instantly.',
    'Adjust decimal precision using the toolbar (Auto, 2 dp, 4 dp, or 6 dp) to control rounding based on your academic or engineering needs.',
    'Review the dynamic Conversion Formula callout and click "Copy" to copy the formatted equation directly to your clipboard.',
    'Explore the Instant Multi-Unit Comparison Grid below to see your entered value converted across all units in the selected category simultaneously.',
  ]

  const formulas = [
    {
      title: 'SI Base Unit Ratio Conversion Formula',
      formula: 'Result = Value × (From Unit Ratio / To Unit Ratio)',
      explanation:
        'Linear dimensions (length, weight, area, volume, speed, time, digital storage) convert through an international SI base unit. The source quantity is normalized to base units and then scaled to the target unit with zero rounding drift.',
    },
    {
      title: 'Temperature Conversion Formulas (°C, °F, K)',
      formula: '°F = (°C × 9/5) + 32  |  °C = (°F - 32) × 5/9  |  K = °C + 273.15',
      explanation:
        'Because temperature scales do not share a common zero point (water freezes at 0°C, 32°F, and 273.15 K), temperature conversions require both fractional scaling factors (9/5 or 5/9) and additive zero-point offsets.',
    },
    {
      title: 'Speed Unit Conversion (km/h, m/s, mph)',
      formula: '1 km/h = 1,000 m / 3,600 s = 5/18 m/s ≈ 0.2778 m/s  |  1 mph = 0.44704 m/s',
      explanation:
        'Converts terrestrial highway and vehicular velocities into physics metric units (m/s) or nautical knots (1 kn = 1.852 km/h).',
    },
    {
      title: 'Digital Storage Binary Architecture (JEDEC standard)',
      formula: '1 KB = 1,024 Bytes  |  1 MB = 1,024 KB  |  1 GB = 1,024 MB  |  1 TB = 1,024 GB',
      explanation:
        'Adheres to computer operating system binary conventions (2¹⁰ = 1,024) where each digital magnitude step represents a multiple of 1,024 rather than decimal thousands.',
    },
  ]

  const examples = [
    {
      title: 'Highway Velocity (Speed Converter)',
      description: 'Converting an expressway speed limit of 120 km/h into miles per hour (mph) and meters per second (m/s).',
      input: '120 km/h (Speed) → mph',
      output: '74.5645 mph • 33.3333 m/s • 64.7947 knots',
    },
    {
      title: 'Distance & Highway Metrication (Length Converter)',
      description: 'Converting a 100-kilometer highway journey into international imperial statute miles.',
      input: '100 km (Length) → mi',
      output: '62.1371 mi • 100,000 m • 328,083.99 ft',
    },
    {
      title: 'Weight & Mass Recipe Measure (Weight Converter)',
      description: 'Converting a 5-pound commercial packaging weight into metric kilograms and grams.',
      input: '5 lb (Weight / Mass) → kg',
      output: '2.2680 kg • 2,267.96 g • 80 oz',
    },
    {
      title: 'Normal Clinical Human Body Temperature (Temperature Converter)',
      description: 'Converting average human body temperature (37°C) into Fahrenheit and Kelvin.',
      input: '37 °C (Temperature) → °F',
      output: '98.60 °F • 310.15 K',
    },
    {
      title: 'Broadband & Cloud Storage Allocation (Digital Storage Converter)',
      description: 'Calculating the exact megabyte capacity of a 50-gigabyte cloud backup drive.',
      input: '50 GB (Digital Storage) → MB',
      output: '51,200 MB • 52,428,800 KB • 0.0488 TB',
    },
  ]

  const faqs = [
    {
      question: 'Which 8 measurement categories and units are supported by this converter?',
      answer:
        'QUBNEXA supports 8 major measurement categories containing 56 precision units: Length (mm, cm, m, km, in, ft, yd, mi, nmi), Weight / Mass (mg, g, kg, t, oz, lb, st), Temperature (°C, °F, K), Area (m², km², cm², ft², yd², mi², ac, ha), Volume (mL, L, m³, cm³, ft³, in³, US gal, UK imp gal, fl oz), Speed (m/s, km/h, mph, kn, ft/s), Time (ms, s, min, h, d, wk, mo, yr), and Digital Storage (bit, B, KB, MB, GB, TB, PB).',
    },
    {
      question: 'Why does temperature conversion use an additive formula instead of a direct ratio?',
      answer:
        'Unlike length or weight, temperature scales do not share a common zero point. Water freezes at 0°C, 32°F, and 273.15 Kelvin. Because of these distinct baseline offsets, converting between temperature units requires an additive shift (such as +32 or -273.15) combined with the degree scaling ratio (9/5 or 5/9).',
    },
    {
      question: 'Are digital storage conversions calculated using 1024 (binary) or 1000 (decimal)?',
      answer:
        'This converter follows standard binary computer architecture conventions (JEDEC / RAM standard) where 1 Kilobyte (KB) = 1,024 Bytes, 1 Megabyte (MB) = 1,024 KB, and 1 Gigabyte (GB) = 1,024 MB. This matches how Windows and computer operating systems report usable storage capacity.',
    },
    {
      question: 'What is the difference between a US gallon and an Imperial (UK) gallon?',
      answer:
        'A US liquid gallon is defined as 231 cubic inches, which equals approximately 3.78541 liters. An Imperial (UK) gallon is historically defined as the volume of 10 pounds of water at 62°F, which equals exactly 4.54609 liters. The converter supports both units independently to ensure global accuracy.',
    },
    {
      question: 'How do I quickly swap the "From" and "To" units?',
      answer:
        'Click the bidirectional swap button (⇄) located between the two unit selectors. It immediately exchanges your source and destination units and recalculates the result without requiring you to re-type your input number.',
    },
    {
      question: 'Can I control the number of decimal places displayed in the result?',
      answer:
        'Yes. Use the precision toolbar at the top of the converter card. You can choose "Auto" (which displays exact significant digits without trailing zeroes up to 8 places) or set fixed precision to 2 decimal places (2 dp), 4 decimal places (4 dp), or 6 decimal places (6 dp).',
    },
    {
      question: 'How does the Instant Multi-Unit Comparison Grid work?',
      answer:
        'Beneath the primary conversion card, QUBNEXA automatically renders a live cheat sheet displaying your entered value converted into every single available unit within that category. The source unit is highlighted in green and your target unit is highlighted in blue for effortless multi-unit comparison.',
    },
    {
      question: 'Are my conversion numbers or calculations logged or sent to external servers?',
      answer:
        'No. All conversions run 100% locally in your web browser using pure client-side TypeScript. No numbers, formulas, measurements, or session details are ever logged, tracked, or transmitted to any remote server.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Unit Converter Online — Length, Weight & Temperature | QUBNEXA"
      seoDescription="Convert units online across 8 categories: length, weight, temperature, area, volume, speed, time, and digital storage. Fast, accurate, and 100% free tool."
      keywords="unit converter online, length converter, weight converter, temperature converter, volume converter, speed converter, area converter, unit conversion calculator, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['percentage-calculator', 'age-calculator', 'date-difference-calculator', 'discount-calculator']}
    >
      <UnitConverter />
    </ToolPageLayout>
  )
}
