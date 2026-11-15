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
    description:
      'Calculate date intervals in years, months and days, add or subtract days with business day skipping, count down to events, and calculate working days.',
    categoryId: 'calculators',
    categoryIds: ['calculators', 'daily-utilities', 'date-time'],
    categoryName: 'Calculators',
    icon: 'Calendar',
    isPopular: true,
    isNew: true,
    isFunctional: true,
    keywords: [
      'date calculator',
      'date difference calculator',
      'days between dates',
      'add days to date',
      'working days calculator',
      'business days calculator',
      'countdown to date',
    ],
  }

  const howToUseSteps = [
    'Choose your calculator mode from the top tabs: "Date Difference", "Add / Subtract Time", "Milestone Countdown", or "Working Days (Mon-Fri)".',
    'In Date Difference mode, select your start and end dates using the calendar date pickers, or click "Set Today" for fast entry.',
    'Use the bidirectional swap button (⇄) if you want to invert start and end dates instantly.',
    'Check "Include end date in calculation" (+1 day) when both dates are active working days, contractual milestones, or rental periods.',
    'In Add / Subtract mode, specify the quantity, choose your unit (Days, Weeks, Months, or Years), and toggle "Skip weekends" for commercial deadlines.',
    'In Countdown mode, view live real-time ticking seconds and remaining business days until your target milestone date.',
    'Click "Copy Breakdown" to easily paste results into project management trackers, emails, or spreadsheets.',
  ]

  const formulas = [
    {
      title: 'Gregorian Calendar Leap Year Algorithm',
      formula: 'IsLeap = (Year % 4 === 0 && Year % 100 !== 0) || (Year % 400 === 0)',
      explanation:
        'Every year divisible by 4 is a leap year, except century years unless divisible by 400. February counts 29 days in leap years (2024, 2028) and 28 days in common years, preventing astronomical calendar drift.',
    },
    {
      title: 'Calendar Day & Month Borrowing Algorithm',
      formula: 'Days = EndDay - StartDay (borrow DaysInMonth(PrevMonth) if negative)',
      explanation:
        'Handles variable calendar month lengths (28, 29, 30, or 31 days) without naive 30-day rounding. Days borrow from the preceding month’s exact length, and negative months borrow 12 months from the target year.',
    },
    {
      title: 'Business Working Days Algorithm (Mon–Fri)',
      formula: 'Working Days = Total Days - (Saturday Count + Sunday Count)',
      explanation:
        'Iterates across individual dates within the selected range, incrementing working days for weekdays (Day 1–5) and separating weekend days (Day 0 & 6) for accurate payroll and sprint velocity planning.',
    },
    {
      title: 'Calendar Addition & Subtraction Math',
      formula: 'Target Date = Base Date ± (Duration × Unit Scale Factor)',
      explanation:
        'Advances or rewinds calendar dates across month and year boundaries. When "Skip weekends" is enabled, the algorithm advances solely through Monday–Friday dates, adding 2 weekend days for every Saturday/Sunday encountered.',
    },
  ]

  const examples = [
    {
      title: 'Date Interval & Elapsed Duration (Mode 1: Date Difference)',
      description: 'Measuring exact elapsed time between New Year’s Day and Indian Independence Day.',
      input: 'Start: 01 Jan 2026 • End: 15 Aug 2026 • Exclude End Date',
      output: '7 Months, 14 Days • 226 Total Days (32 Weeks + 2 Days) • 162 Working Days • 64 Weekend Days',
    },
    {
      title: 'Legal Notice Period & Exit Date (Mode 2: Add Calendar Days)',
      description: 'Calculating the exact formal release date for a 90-day contractual notice period.',
      input: 'Base: 01 Sep 2026 • Operation: Add 90 Days • Calendar Days',
      output: 'Target Date: Monday, 30 November 2026 (90 Calendar Days)',
    },
    {
      title: 'Commercial Business Days Deadline (Mode 2: Add Business Days / Skip Weekends)',
      description: 'Projecting a 45-working-day review or delivery window excluding all Saturdays and Sundays (public holidays not excluded).',
      input: 'Base: 01 Apr 2026 • Operation: Add 45 Days • Skip Weekends: Yes',
      output: 'Target Date: Wednesday, 3 June 2026 (63 Calendar Days Elapsed • 45 Business Days)',
    },
    {
      title: 'Quarterly Billable Workdays (Mode 4: Working Days)',
      description: 'Determining total billable project days in Q4 with inclusive date boundaries.',
      input: 'Start: 01 Oct 2026 • End: 31 Dec 2026 • Include End Date: Yes',
      output: '66 Working Days • 26 Weekend Days • 92 Total Calendar Days • 2 Months, 31 Days',
    },
  ]

  const faqs = [
    {
      question: 'How are calendar leap years calculated in date differences?',
      answer:
        'The calculator strictly implements the astronomical Gregorian leap year rule: a year is a leap year if divisible by 4, except for century years unless divisible by 400. In leap years (e.g., 2024, 2028), February is assigned 29 days; in common years, 28 days. This prevents off-by-one errors when calculating spans across February.',
    },
    {
      question: 'Why does timezone-safe local noon parsing matter for date calculations?',
      answer:
        'Standard JavaScript and browser dates parse ISO strings (like "2026-05-15") at UTC midnight (00:00:00). In positive timezones like Indian Standard Time (UTC+05:30) or negative timezones like US Eastern (UTC-05:00), daylight saving or timezone offsets frequently shift the date backward or forward by one day. QUBNEXA explicitly anchors all date parsing at local noon (12:00:00), completely eliminating timezone boundary slips.',
    },
    {
      question: 'What is the difference between calendar days and working days?',
      answer:
        'Calendar days count every consecutive 24-hour day from Monday through Sunday, including weekends and holidays. Working days (also called business days) count standard business weekdays (Monday through Friday), automatically excluding Saturdays and Sundays only. Please note that regional public, bank, or gazetted statutory holidays are not excluded automatically, as holiday schedules vary across different jurisdictions and organizations.',
    },
    {
      question: 'How does "Skip weekends" work in Add / Subtract mode?',
      answer:
        'When "Skip weekends" is toggled on, the calculator advances or rewinds solely through weekdays (Monday through Friday). For example, adding 5 business days to a Friday does not land on the following Wednesday (5 calendar days later), but advances across the weekend to land on the following Friday (7 calendar days later).',
    },
    {
      question: 'When should I check "Include end date in calculation"?',
      answer:
        'By default, date differences are calculated as elapsed intervals (Target Date minus Start Date), which excludes the start day itself. Check "Include end date in calculation" (+1 day) when both dates are active working days—such as project contracts, employee leave requests, hotel stays, or academic terms where both the first and last day count.',
    },
    {
      question: 'Can I calculate future dates by adding months or years?',
      answer:
        'Yes. In the "Add / Subtract Time" tab, select "Months" or "Years" from the unit dropdown. The calculator adds calendar months and years directly using standard calendar arithmetic rather than fixed 30-day or 365-day multipliers. For example, adding 1 month to January 15th lands on February 15th, and adding 1 year to a non-leap date lands on the exact same calendar day.',
    },
    {
      question: 'How does the Milestone Countdown mode work?',
      answer:
        'Milestone Countdown calculates the live duration remaining from the current second until midnight on your target date. It displays a ticking countdown in days, hours, minutes, and seconds, alongside a calculation of how many business working days remain until that date.',
    },
    {
      question: 'Are my entered dates, project schedules, or milestone details stored on any server?',
      answer:
        'Never. QUBNEXA operates 100% client-side in your local web browser. All calendar arithmetic, day iterations, and countdown timers run directly in your device’s JavaScript engine. No dates, notes, or schedules are ever tracked, logged, or sent to external servers.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Date & Time Calculator — Days Between Dates & Add Days | QUBNEXA"
      seoDescription="Calculate days between dates, add or subtract days, count down to events, and compute working business days online with QUBNEXA. Free, fast, and 100% private."
      keywords="date calculator, date and time calculator, add days to date, subtract days from date, days between dates, calculate future date, date calculator online, working days calculator, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['age-calculator', 'date-difference-calculator', 'unit-converter', 'percentage-calculator']}
    >
      <DateTimeCalculator />
    </ToolPageLayout>
  )
}
