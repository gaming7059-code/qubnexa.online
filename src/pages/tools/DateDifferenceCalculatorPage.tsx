import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { DateDifferenceCalculator } from '../../tools/DateDifferenceCalculator/DateDifferenceCalculator'
import { ALL_TOOLS } from '../../data/toolsData'

export const DateDifferenceCalculatorPage: React.FC = () => {
  const tool = ALL_TOOLS.find((t) => t.slug === 'date-difference-calculator')!

  const howToUseSteps = [
    'Select Calculation Mode: Choose "Difference Between Two Dates" to measure the duration between milestones, or "Add or Subtract Days" to project future deadlines or past historical dates.',
    'Choose Start and End Dates: Pick dates using the native calendar picker or click the "Set Today" shortcut button to insert the current date instantly.',
    'Inspect Calendar Breakdown: Review the primary result displaying exact elapsed years, months, and days, which sequentially adjusts for differing calendar month lengths and leap years.',
    'Review Total Time Units: Check the aggregate scorecard for cumulative total days, full calendar weeks with leftover days, total months, and equivalent 24-hour days converted to hours.',
    'Automatic Sequence Inversion: If your start date is later than your end date, the calculator automatically detects the sequence and displays the positive elapsed span alongside a "Reversed" badge.',
    'Add or Subtract Day Offsets: In Mode 2, select "Add Days" or "Subtract Days", enter a custom day count, or click one of the quick preset buttons (7, 15, 30, 45, 60, 90, 180, or 365 days).',
    'Examine Target Milestone Date: Instantly inspect the computed destination date, complete with day of the week, standard ISO format (YYYY-MM-DD), and localized calendar presentation.',
    'Reset for New Calculations: Click "Reset Dates" or "Reset" at any time to clear inputs and return to today\'s default values.',
  ]

  const formulas = [
    {
      title: 'Total Elapsed Days Conversion',
      formula: 'Total Days = Math.round(|Timestamp_End - Timestamp_Start| / 86,400,000 ms)',
      explanation:
        'Converts the absolute millisecond timestamp difference between two midnight calendar dates into standard 24-hour solar days. Integer rounding neutralizes 1-hour daylight saving shifts.',
    },
    {
      title: 'Calendar Month & Year Amortization Heuristic',
      formula: 'ΔYears = eYear - sYear; ΔMonths = eMonth - sMonth; ΔDays = eDay - sDay (with borrow)',
      explanation:
        'Computes calendar differences sequentially. When day or month subtractions result in negative values, the algorithm borrows days from the preceding month (accounting for 28, 29, 30, or 31 days) and years into 12 months.',
    },
    {
      title: 'Gregorian Leap Year Compensation',
      formula: 'Leap Year = (Year % 4 === 0 && Year % 100 !== 0) || (Year % 400 === 0)',
      explanation:
        'Applies standard Gregorian calendar leap-year rules via browser-native Date arithmetic, properly factoring in 29 days for February in quadrennial and century leap years.',
    },
    {
      title: 'Weeks and Remaining Days Distribution',
      formula: 'Total Weeks = Math.floor(Total Days / 7); Remaining Days = Total Days % 7',
      explanation:
        'Deconstructs aggregate elapsed days into full 7-day calendar weeks plus leftover days, essential for milestone sprint tracking and work breakdown structures.',
    },
    {
      title: 'Day Offset Projection (Add / Subtract)',
      formula: 'Target Date = Base Date ± (Days × 86,400,000 ms)',
      explanation:
        'Applies positive or negative day counts to a starting calendar date using native JavaScript Date rollover, automatically adjusting month and year boundaries while determining the weekday.',
    },
    {
      title: 'Local Browser Date Calculation',
      formula: 'Local Browser Runtime → Pure JavaScript Evaluation → Date Inputs Remain in Local Browser Memory',
      explanation:
        'While static website assets are served from the hosting server, all date parsing, duration calculations, and milestone projections execute locally in your browser. Entered dates are not sent to a backend service to perform the calculations.',
    },
  ]

  const examples = [
    {
      title: 'Project Deadline & Sprint Planning',
      description:
        'Calculating calendar duration between a Q2 project kickoff on April 1, 2026, and a final milestone delivery on August 15, 2026.',
      input: 'Start Date: 2026-04-01, End Date: 2026-08-15',
      output: '4 Months, 14 Days (Total: 136 Days / 19 Weeks + 3d / 3,264 Hours)',
    },
    {
      title: '90-Day Travel Planning Date Offset',
      description:
        'Calculating the calendar date 90 days after arriving on November 1, 2026. This computes a standard 90-day date offset; it is not a legal determination of visa validity or official immigration day-counting rules.',
      input: 'Starting Date: 2026-11-01, Operation: Add Days, Days: 90',
      output: 'Target Date: Saturday, 30 January 2027 (ISO: 2027-01-30, +90 days)',
    },
    {
      title: 'Long-Term Contract & Lease Countdown',
      description:
        'Measuring the elapsed calendar duration between January 1, 2025, and June 30, 2026, for an equipment lease or warranty review.',
      input: 'Start Date: 2025-01-01, End Date: 2026-06-30',
      output: '1 Year, 5 Months, 29 Days (Total: 545 Days / 77 Weeks + 6d)',
    },
    {
      title: 'Historical Milestone Retrospective (Reversed Order)',
      description:
        'Evaluating the elapsed duration backwards from year-end December 31, 2026, to New Year\'s Day January 1, 2026, using automated sequence detection.',
      input: 'Start Date: 2026-12-31, End Date: 2026-01-01',
      output: '11 Months, 30 Days (Total: 364 Days) with "Reversed (Start is after End)" notice',
    },
    {
      title: 'Event Preparation Lookback (Subtracting Days)',
      description:
        'Determining the date exactly 45 days prior to an annual audit on October 15, 2026, to schedule documentation prep.',
      input: 'Starting Date: 2026-10-15, Operation: Subtract Days, Days: 45',
      output: 'Target Date: Monday, 31 August 2026 (ISO: 2026-08-31, -45 days)',
    },
  ]

  const faqs = [
    {
      question: 'Does this calculator account for leap years?',
      answer:
        'Yes. All leap years (such as 2024, 2028, and 2032) including February 29th are fully supported. The calculation uses standard Gregorian calendar rules where years divisible by 4 (and century years divisible by 400) receive 29 days in February.',
    },
    {
      question: 'Is the date difference calculation inclusive or exclusive of the end date?',
      answer:
        'The calculator measures elapsed calendar duration (the interval between two points in time). For instance, the difference between May 1st and May 2nd is calculated as 1 day. If your legal agreement or rental contract requires inclusive counting where both start and end days are counted as full active days, simply add 1 day to the total.',
    },
    {
      question: 'Does this tool calculate business days or exclude public holidays?',
      answer:
        'No. This calculator measures standard calendar days (including weekends and public holidays). It does not filter out Saturdays, Sundays, or regional bank holidays. For work-week scheduling, total days can be converted into calendar weeks plus remaining days.',
    },
    {
      question: 'How does the calculator handle reversed dates when the start date is after the end date?',
      answer:
        'If you select a start date that occurs after your end date, the calculator automatically detects the inversion, swaps the timestamps to compute the positive elapsed duration, and displays a "Reversed (Start is after End)" badge.',
    },
    {
      question: 'What is the difference between "Total Days" and the "Years, Months, Days" breakdown?',
      answer:
        'The "Years, Months, Days" breakdown provides a human-readable calendar interval by matching month lengths and year boundaries sequentially. "Total Days" measures the absolute cumulative 24-hour solar days between the two dates without dividing them into calendar months.',
    },
    {
      question: 'How does the "Add or Subtract Days" feature compute target dates?',
      answer:
        'In Add/Subtract mode, the tool applies an integer day offset to your starting calendar date. It handles month-end overflows, year-end rollovers, and leap years automatically, returning the final calendar date, formatted ISO string, and day of the week.',
    },
    {
      question: 'Can I calculate date differences across different centuries?',
      answer:
        'Yes. Standard historical and future Gregorian calendar dates are supported. The JavaScript Date engine parses and computes differences accurately across past, present, and future centuries.',
    },
    {
      question: 'Does daylight saving time (DST) affect the calculation?',
      answer:
        'Dates are parsed at local midnight, and the engine rounds the timestamp difference to whole 24-hour days using Math.round. Routine one-hour daylight saving transitions are typically handled by this rounding, but this tool is designed for calendar-day differences rather than precise elapsed-hour tracking across timezones.',
    },
    {
      question: 'Are my dates, project timelines, or calculations stored on any server?',
      answer:
        'Date calculations are performed locally in your browser using JavaScript. The calculator does not send your entered dates or calculation results to a backend service for processing.',
    },
    {
      question: 'Can I use quick presets for day addition and subtraction?',
      answer:
        'Yes. In Add/Subtract mode, quick preset buttons are available for common intervals including 7, 15, 30, 45, 60, 90, 180, and 365 days, allowing one-click scheduling without manual typing.',
    },
  ]

  const relatedSlugs = [
    'date-time-calculator',
    'age-calculator',
    'salary-calculator',
    'percentage-calculator',
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Days Between Dates Calculator — Exact Date Difference | QUBNEXA"
      seoDescription="Calculate the exact days, weeks, and months between two dates. Measure elapsed time between dates instantly with this free date difference calculator."
      keywords="days between dates, date difference calculator, days between two dates, elapsed time calculator, time between dates, calendar duration, date interval, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={relatedSlugs}
    >
      <DateDifferenceCalculator />
    </ToolPageLayout>
  )
}
