import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { AgeCalculator } from '../../tools/AgeCalculator/AgeCalculator'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const AgeCalculatorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'age-calculator')!

  const howToUseSteps = [
    'Select your Date of Birth using the calendar input picker or typing in YYYY-MM-DD format.',
    'By default, the calculator computes your chronological age as of today. If evaluating competitive exam eligibility (UPSC, SSC, State PSC), school admissions, or superannuation milestones, enter a custom "Age on Date".',
    'Click "Set Today" at any time to instantly restore the target comparison date to the current calendar day.',
    'Review your primary Exact Age card, which highlights your completed chronological age in Years, Months, and Days.',
    'Examine the Total Lifetime Breakdown grid displaying your lifespan in Total Months, Total Weeks (+ remaining days), Total Days, and Total Hours.',
    'Check the Upcoming Birthday card showing the exact calendar date, day of the week, and live countdown in days remaining until your next celebration.',
    'Click "Reset Dates" to clear the form and quickly calculate ages for family members, friends, or historical milestones.',
  ]

  const formulas = [
    {
      title: 'Calendar Day & Month Borrowing Algorithm',
      formula: 'Years = tYear - bYear; Months = tMonth - bMonth; Days = tDay - bDay',
      explanation:
        'When target days are smaller than birth days, months are decremented and days are borrowed from the previous calendar month based on that month’s exact length (28, 29, 30, or 31 days). When target months are smaller than birth months, years are decremented by 1 and 12 months are added.',
    },
    {
      title: 'Leap Year Gregorian Rule & Feb 29 Birthday',
      formula: 'IsLeap = (Year % 4 === 0 && Year % 100 !== 0) || (Year % 400 === 0)',
      explanation:
        'A year is a leap year if divisible by 4, except for century years not divisible by 400. In leap years, February has 29 days; in common years, 28 days. For individuals born on February 29th, non-leap year birthdays are observed on February 28th in accordance with civil legal standards.',
    },
    {
      title: 'Total Elapsed Solar Days Formula',
      formula: 'Total Days = Math.round((Target Timestamp - Birth Timestamp) / 86,400,000 ms)',
      explanation:
        'Converts the exact millisecond difference between midnight local timestamps into standard 24-hour solar days, correctly accounting for all intervening leap days over decades.',
    },
    {
      title: 'Lifetime Granular Unit Conversions',
      formula: 'Total Months = (Years × 12) + Months; Weeks = ⌊Days / 7⌋; Hours = Days × 24',
      explanation:
        'Breaks down chronological lifespan into standard metrics for insurance actuaries, pediatric growth charts, and employment eligibility criteria.',
    },
  ]

  const examples = [
    {
      title: 'Exam or Government Job Eligibility (UPSC / SSC / State PSC)',
      description: 'Calculating precise age on August 1st cut-off date for Indian civil service examinations.',
      input: 'Date of Birth: 15 Oct 1998 • Target Date: 01 Aug 2026',
      output: '27 Years, 9 Months, 17 Days • 10,152 Total Days • Next Birthday in 75 days (Thursday)',
    },
    {
      title: 'Pediatric Vaccination & Infant Milestone',
      description: 'Checking an infant’s exact age for scheduled health immunizations and developmental milestones.',
      input: 'Date of Birth: 10 May 2025 • Target Date: 22 Sep 2026',
      output: '1 Year, 4 Months, 12 Days • 500 Total Days • 16 Months • 71 Weeks + 3 Days',
    },
    {
      title: 'Leap Year Birthday Calculation (Born February 29th)',
      description: 'Calculating exact chronological age for someone born on leap day (February 29th, 2000).',
      input: 'Date of Birth: 29 Feb 2000 • Target Date: 22 Sep 2026',
      output: '26 Years, 6 Months, 24 Days • 9,702 Total Days • Next Birthday on 28 Feb 2027 (Sunday)',
    },
    {
      title: 'Superannuation & Retirement Milestone',
      description: 'Determining exact 60-year retirement age milestone on the final day of the birth month.',
      input: 'Date of Birth: 05 Jul 1966 • Target Date: 31 Jul 2026',
      output: '60 Years, 0 Months, 26 Days • 21,941 Total Days • 720 Months • 526,584 Total Hours',
    },
  ]

  const faqs = [
    {
      question: 'How is exact chronological age calculated in years, months, and days?',
      answer:
        'Chronological age is calculated by subtracting the date of birth from the target reference date using Gregorian calendar borrowing. First, days are subtracted: if the target day is smaller than the birth day, days are borrowed from the preceding month based on its actual calendar length (28, 29, 30, or 31 days). Next, months are subtracted: if the target month is smaller than the birth month, 12 months are borrowed from the target year. Finally, years are subtracted. This ensures your age accurately reflects uneven calendar month lengths.',
    },
    {
      question: 'How does the age calculator handle leap years and February 29th birthdays?',
      answer:
        'The calculator strictly implements the astronomical Gregorian leap year rule: a year is a leap year if divisible by 4, except for century years not divisible by 400. In leap years, February is credited with 29 days; in common years, 28 days. For leaplings born on February 29th, the calculator tracks lifetime days with 100% precision and schedules upcoming non-leap year birthdays on February 28th (the legal observation date across most civil jurisdictions).',
    },
    {
      question: 'Why can’t I just divide total days by 365 or 365.25 to calculate age?',
      answer:
        'Dividing total days by 365 (common year) or 365.25 (Julian average) produces fractional decimal approximations (e.g., 25.43 years) rather than exact calendar milestones. Because calendar months vary between 28 and 31 days and leap years introduce an extra day every four years, simple division drifts by several days. Legal documentation, passport renewals, school admissions, and competitive exams mandate exact calendar years, months, and days.',
    },
    {
      question: 'How do competitive examinations (UPSC, SSC, Banking) calculate age eligibility?',
      answer:
        'Indian government notifications and statutory exam bodies (such as UPSC, SSC, IBPS, and State PSCs) prescribe a specific cut-off date (commonly August 1st or January 1st of the examination year). Candidates must be within the specified minimum (e.g., 21 years) and maximum (e.g., 32 years) age limits on that exact date. You can select the examination cut-off date in the "Age on Date" field to verify your eligibility down to the exact day.',
    },
    {
      question: 'Can I calculate my age on a past historical date or a future date?',
      answer:
        'Yes. By default, the calculator compares your birth date against today’s current date. However, you can change the "Age on Date" input to any future date (to see how old you will be when you graduate, buy a home, or retire) or any historical date (to check your age during a specific milestone, marriage, or employment joining date).',
    },
    {
      question: 'What is the difference between chronological age, gestational age, and biological age?',
      answer:
        'Chronological age is the exact time elapsed since birth according to the calendar. Gestational age is used in obstetrics and pediatrics, measured from the first day of the mother’s last menstrual period (LMP) to assess fetal maturity. Biological age measures physical cellular aging and physiological biomarkers, which may be younger or older than chronological age based on genetics, nutrition, and lifestyle.',
    },
    {
      question: 'How does the upcoming birthday countdown work?',
      answer:
        'The calculator checks your birth month and day against the target reference date. If your birthday has already passed in the current target year, it projects forward to the next calendar year. It calculates the remaining days using millisecond timestamp differences and identifies the exact day of the week (e.g., Saturday, Sunday) on which your next birthday falls.',
    },
    {
      question: 'Are my birth date or personal age details stored or tracked anywhere?',
      answer:
        'Never. QUBNEXA operates 100% client-side in your web browser. All date arithmetic and timestamp calculations occur locally in your browser’s JavaScript engine. No dates of birth, names, IP addresses, or age records are ever transmitted, logged, or stored on external servers.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Age Calculator Online — Exact Age by Date of Birth | QUBNEXA"
      seoDescription="Calculate your exact age in years, months, days, and hours from your date of birth. Free online age calculator with birthday countdown and leap year accuracy."
      keywords="age calculator, calculate age online, age calculator by date of birth, exact age calculator, age in years months days, date of birth calculator, how old am i calculator, birthday countdown, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['date-difference-calculator', 'percentage-calculator', 'emi-calculator', 'salary-calculator']}
    >
      <AgeCalculator />
    </ToolPageLayout>
  )
}
