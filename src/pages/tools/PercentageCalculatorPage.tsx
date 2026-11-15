import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { PercentageCalculator } from '../../tools/PercentageCalculator/PercentageCalculator'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const PercentageCalculatorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'percentage-calculator')!

  const howToUseSteps = [
    'Select your desired calculation mode from the top tab selector: "What is X% of Y?", "X is what % of Y?", "% Increase / Decrease", or "Find Original Value".',
    'For Mode 1 ("What is X% of Y?"), enter the percentage rate (e.g., 18%) and the total base number (e.g., 4,500) to find the fractional portion.',
    'For Mode 2 ("X is what % of Y?"), enter the specific value (X) and the whole total (Y) to calculate the proportional percentage rate.',
    'For Mode 3 ("% Increase / Decrease"), enter the original starting value and the new updated value to compute both the percentage change and the absolute difference.',
    'For Mode 4 ("Find Original Value"), supply the known percentage rate and the resulting value to determine the 100% original baseline amount.',
    'Review the highlighted calculation result card, which updates automatically in real-time as you type without requiring manual calculation clicks.',
    'Click "Reset" at any time to clear current inputs and evaluate another mathematical, academic, or financial scenario.',
  ]

  const formulas = [
    {
      title: 'Percentage of a Number Formula (X% of Y)',
      formula: 'Result = (Percentage / 100) × Total = (X / 100) × Y',
      explanation:
        'Converts the percentage rate into a decimal fraction by dividing by 100, then multiplies it by the base total number (e.g., 18% of 4,500 = 0.18 × 4,500 = 810).',
    },
    {
      title: 'Percentage Ratio / Proportion Formula (X is what % of Y)',
      formula: 'Percentage (%) = (Part / Total) × 100 = (X / Y) × 100',
      explanation:
        'Determines the relative share or proportion by dividing the part value (X) by the whole total (Y), then multiplying by 100 to express as a percentage (where Y ≠ 0).',
    },
    {
      title: 'Percentage Increase / Decrease Formula',
      formula: 'Change (%) = ((New Value - Original Value) / |Original Value|) × 100',
      explanation:
        'Measures the relative rate of change between two values. A positive result denotes percentage growth or inflation; a negative result denotes percentage reduction or discount.',
    },
    {
      title: 'Reverse Percentage Formula (Find Original Base)',
      formula: 'Original Value = Result / (Percentage / 100) = Y / (X / 100)',
      explanation:
        'Recovers the 100% baseline value when you only know a portion and its corresponding percentage share (e.g., if 15% equals ₹750, Original = 750 / 0.15 = ₹5,000).',
    },
  ]

  const examples = [
    {
      title: 'Calculating Sales Tax / Service GST (Mode 1: X% of Y)',
      description: 'Determining an 18% GST charge on a professional consulting invoice of ₹4,500.',
      input: 'Percentage: 18% • Base Total: ₹4,500',
      output: 'Calculated Tax: ₹810 • 18% of ₹4,500 is 810',
    },
    {
      title: 'Board Exam Academic Marks Percentage (Mode 2: X is what % of Y)',
      description: 'A student scores 495 aggregate marks out of a maximum total of 600 in university examinations.',
      input: 'Score (X): 495 • Total Marks (Y): 600',
      output: 'Score Percentage: 82.5% • 495 is 82.5% of 600',
    },
    {
      title: 'Annual Salary Hike / Compensation Growth (Mode 3: % Increase)',
      description: 'An employee receives an annual appraisal bumping their monthly salary from ₹45,000 to ₹54,000.',
      input: 'Original: ₹45,000 • New: ₹54,000',
      output: 'Percentage Change: +20% (INCREASE) • Absolute Difference: ₹9,000',
    },
    {
      title: 'Recovering Pre-Discount List Price (Mode 4: Reverse Percentage)',
      description: 'A shopper saves ₹750 during a promotional sale where the discount was advertised as 15% off the original price.',
      input: 'Percentage: 15% • Given Concession: ₹750',
      output: 'Original Full Price: ₹5,000 • If 15% is ₹750, 100% is ₹5,000',
    },
  ]

  const faqs = [
    {
      question: 'How do I calculate the percentage of a number manually without a calculator?',
      answer:
        'To calculate a percentage of any number manually, convert the percentage into a decimal fraction by dividing it by 100, then multiply by the total number: Result = (Percentage / 100) × Total. Alternatively, you can use mental math shortcuts: find 10% by shifting the decimal point one position to the left, 1% by shifting two positions to the left, and combine them. For example, to find 15% of 600: 10% is 60 and 5% is 30, giving 60 + 30 = 90.',
    },
    {
      question: 'What is the formula to find what percentage one number is of another?',
      answer:
        'Divide the specific part value (X) by the total reference number (Y) and multiply the result by 100: Percentage = (X / Y) × 100. For example, if a student scores 495 marks out of 600, divide 495 by 600 (which equals 0.825) and multiply by 100 to get 82.5%.',
    },
    {
      question: 'What is the difference between percentage change and percentage difference?',
      answer:
        'Percentage change is directional and compares an old starting value to a new ending value: ((New - Old) / |Old|) × 100. It measures growth or decline over time. Percentage difference is non-directional and compares two positive numbers without designating an "original" by dividing their absolute difference by their average: (|V1 - V2| / ((V1 + V2) / 2)) × 100. For growth, appraisals, and discounts, percentage change is the standard metric.',
    },
    {
      question: 'How does percentage increase differ from percentage points?',
      answer:
        'Percentage points measure the absolute arithmetic difference between two percentages, whereas percentage change measures relative proportional increase. For example, if an interest rate rises from 10% to 12%, it has increased by 2 percentage points (12 - 10 = 2). However, in relative terms, it represents a 20% percentage increase ((12 - 10) / 10 × 100 = 20%). Conflating the two is a common financial mistake.',
    },
    {
      question: 'How do I calculate reverse percentage to find the original value before tax or discount?',
      answer:
        'To find the original baseline number when you know a portion and its percentage rate, divide the given value by the decimal equivalent of the percentage: Original = Value / (Percentage / 100). For example, if ₹900 represents an 18% GST charge, the base product price is 900 / 0.18 = ₹5,000. If an item costs ₹800 after a 20% discount (meaning it is 80% of original price), the original price is 800 / 0.80 = ₹1,000.',
    },
    {
      question: 'Can percentages be greater than 100% or negative?',
      answer:
        'Yes. A percentage over 100% indicates that the value exceeds the baseline total (for example, achieving ₹15 lakh sales against a ₹10 lakh target represents 150% achievement). A negative percentage indicates a reduction or loss (for example, a company whose revenue dropped from ₹100 crore to ₹70 crore experienced a -30% change). However, for proportion checks like exam marks or probability, values are typically bounded between 0% and 100%.',
    },
    {
      question: 'How does the calculator handle zero denominators, invalid inputs, and decimal precision?',
      answer:
        'The calculator incorporates strict defensive mathematical safeguards. If a user enters zero as a denominator in "X is what % of Y" or as the original value in "% Increase / Decrease", the tool returns a clear contextual alert rather than displaying "NaN" or "Infinity". Decimal values with fractional paise or decimals (e.g., 18.75% or ₹1,299.50) are precision-rounded to up to 4 decimal places.',
    },
    {
      question: 'Are my calculation inputs, financial numbers, or exam scores stored on any server?',
      answer:
        'No. QUBNEXA operates 100% client-side inside your local browser runtime. All mathematical operations execute directly in your device’s memory using pure TypeScript. No inputs, financial figures, or results are ever logged, tracked, transmitted, or stored on external servers, ensuring complete privacy.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Percentage Calculator Online — Fast Percentage & Change | QUBNEXA"
      seoDescription="Calculate percentages, percentage increases, decreases, differences, and reverse values online with QUBNEXA. Free, instant, and 100% private math calculator."
      keywords="percentage calculator, percentage of a number calculator, calculate percentage online, percentage increase calculator, percentage decrease calculator, percentage difference calculator, what percentage is x of y, reverse percentage calculator, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['discount-calculator', 'gst-calculator', 'emi-calculator', 'profit-loss-calculator']}
    >
      <PercentageCalculator />
    </ToolPageLayout>
  )
}
