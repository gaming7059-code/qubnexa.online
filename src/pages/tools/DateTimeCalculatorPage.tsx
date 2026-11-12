import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { DateTimeCalculator } from '../../tools/DateTimeCalculator/DateTimeCalculator'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const DateTimeCalculatorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'date-time-calculator') || {
    id: 'date-time-calculator',
    name: 'Date & Time Calculator',
    slug: 'date-time-calculator',
    path: '/tools/date-time-calculator',
    description: 'Calculate date intervals in years, months and days, add or subtract days with business day skipping, count down to events, and calculate working days.',
    categoryId: 'calculators',
    categoryIds: ['calculators', 'daily-utilities', 'date-time'],
    categoryName: 'Calculators',
    icon: 'Calendar',
    isPopular: true,
    isNew: true,
    isFunctional: true,
    keywords: ['date calculator', 'date difference calculator', 'days between dates', 'add days to date', 'working days calculator', 'business days calculator', 'countdown to date'],
  }

  const howToUseSteps = [
    'Choose your calculator mode: "Date Difference", "Add / Subtract Time", "Milestone Countdown", or "Working Days (Mon-Fri)".',
    'Select your start date and end/target dates using the calendar date pickers, or click "Set Today" for fast entry.',
    'Use the swap button (⇄) if you want to invert start and end dates.',
    'Check "Include end date in calculation" if you want both boundaries included (+1 calendar day).',
    'In "Add / Subtract" mode, specify the quantity, choose your unit (Days, Weeks, Months, or Years), and toggle "Skip weekends" for business scheduling.',
    'In "Countdown" mode, view live real-time ticking seconds and remaining business days until your target date.',
    'Click "Copy Breakdown" to easily paste results into project management trackers, emails, or spreadsheets.',
  ]

  const formulas = [
    {
      title: 'Gregorian Calendar Leap Year Rule',
      formula: 'Leap Year = (Year % 4 == 0 && Year % 100 != 0) || (Year % 400 == 0)',
      explanation: 'Every year divisible by 4 is a leap year, except century years unless divisible by 400. 2000 and 2024 were leap years; 1900 and 2100 are not.',
    },
    {
      title: 'Calendar Month Transition Math',
      formula: 'Days = EndDay - StartDay (borrow DaysInMonth(PreviousMonth) if negative)',
      explanation: 'Accurately handles calendar months with variable lengths (28, 29, 30, or 31 days) without naive 30-day rounding.',
    },
    {
      title: 'Business Working Days Calculation',
      formula: 'Working Days = Total Calendar Days - (Saturday Count + Sunday Count)',
      explanation: 'Iterates through local calendar dates between boundaries, separating Monday–Friday commercial business days from weekend days.',
    },
  ]

  const examples = [
    {
      title: 'Employment Notice Period & Exit Date',
      description: 'Calculating the exact exit date for a 90-day contractual notice period starting today.',
      input: 'Base Date: Today • Operation: Add 90 Days • Calendar Days',
      output: 'Exact target calendar date with day of the week',
    },
    {
      title: 'Sprint & Project Working Days',
      description: 'Determining billable workdays between project kickoff and quarterly delivery.',
      input: 'Start: 1 Oct 2026 • End: 31 Dec 2026 • Mode: Working Days',
      output: '66 Business Working Days (excluding 26 weekend days)',
    },
    {
      title: 'Child School Admission Age Milestone',
      description: 'Calculating exact age on the cutoff date of 31st March.',
      input: 'DOB: 15 July 2020 • Cutoff: 31 March 2026',
      output: '5 Years, 8 Months, 16 Days',
    },
  ]

  const faqs = [
    {
      question: 'How are calendar leap years handled?',
      answer: 'This tool implements the complete Gregorian leap year algorithm. February is automatically calculated as 29 days in leap years (such as 2024 and 2028) and 28 days in common years, ensuring zero off-by-one errors.',
    },
    {
      question: 'Why does timezone matter in date calculations?',
      answer: 'Standard browser dates often parse ISO strings in UTC midnight, which causes off-by-one errors in positive timezones like Indian Standard Time (+05:30) or negative timezones like US Eastern (-05:00). QUBNEXA parses local year, month, and day components at local noon, completely preventing timezone shifting.',
    },
    {
      question: 'What is the difference between calendar days and working days?',
      answer: 'Calendar days include every day of the week (Monday through Sunday). Working days (also known as business days) count only Monday through Friday, automatically excluding Saturdays and Sundays.',
    },
    {
      question: 'Can I add or subtract business days only?',
      answer: 'Yes! In the "Add / Subtract Time" mode, check the "Skip weekends" box when working with days. The calculator will advance only through Monday–Friday dates, which is perfect for legal filings, shipping deadlines, and project milestones.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Free Date & Time Calculator — Days Between, Add Days, Working Days | QUBNEXA"
      seoDescription="Calculate exact days between two dates, add or subtract days, weeks and months, countdown to events, and compute Monday–Friday working days. 100% free and private."
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['age-calculator', 'unit-converter', 'percentage-calculator', 'emi-calculator']}
    >
      <DateTimeCalculator />
    </ToolPageLayout>
  )
}
