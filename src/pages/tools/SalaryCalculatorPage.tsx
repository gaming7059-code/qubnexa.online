import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { SalaryCalculator } from '../../tools/SalaryCalculator/SalaryCalculator'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const SalaryCalculatorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'salary-calculator')!

  const howToUseSteps = [
    'Enter your annual Cost to Company (CTC) package in Indian Rupees (₹) or click a quick preset button (e.g., ₹3 LPA, ₹6 LPA, ₹10 LPA, ₹15 LPA, or ₹25 LPA).',
    'Review or adjust the Basic Salary percentage (standard Indian compensation structures typically allocate 40% to 50% of CTC to Basic).',
    'Specify the House Rent Allowance (HRA) percentage (typically 50% of Basic for metro cities or 40% for non-metro locations).',
    'Input any monthly other allowances, special allowances, or flexible benefits provided by your employer.',
    'Confirm your statutory deductions: Employee Provident Fund (statutory EPF is 12% of Basic) and monthly Professional Tax (usually ₹200/month).',
    'Review the highlighted Hero Card displaying your estimated monthly in-hand take-home pay and projected annual net earnings.',
    'Inspect the detailed salary breakdown table separating Gross Earnings (Basic, HRA, Other Allowances) from Standard Deductions (EPF, PT).',
    'Use the Reset button to experiment with different CTC offers, bonus structures, or variable allowance configurations.',
  ]

  const formulas = [
    {
      title: 'Basic Salary & HRA Distribution',
      formula: 'Basic = (Annual CTC × Basic %) / 12  •  HRA = Basic × (HRA % / 100)',
      explanation:
        'Basic salary serves as the foundational wage component in Indian payroll, determining statutory contributions including EPF, gratuity, and HRA limits.',
    },
    {
      title: 'Monthly & Annual Gross Salary Formula',
      formula: 'Gross Salary = Monthly Basic + Monthly HRA + Other Monthly Allowances',
      explanation:
        'Total cash earnings credited on your salary slip before employee statutory payroll deductions and taxes are subtracted.',
    },
    {
      title: 'Employee Provident Fund (EPF) Contribution',
      formula: 'Monthly Employee PF = Monthly Basic × (PF % / 100)',
      explanation:
        'Standard retirement savings deduction under EPFO regulations (typically 12% of Basic salary for covered establishments, or capped at statutory wage ceilings depending on company policy) matched by employer contribution.',
    },
    {
      title: 'Estimated In-Hand Take-Home Salary',
      formula: 'Net Take-Home = Monthly Gross - (Employee PF + Professional Tax)',
      explanation:
        'The actual net liquid salary deposited directly into your bank account each month after mandatory payroll deductions.',
    },
  ]

  const examples = [
    {
      title: '₹6 LPA Junior Software Engineer Offer',
      description: 'Standard IT service or startup fresher package with 50% Basic, 50% HRA, ₹5,000 monthly allowances, 12% PF, and ₹200 PT.',
      input: 'CTC: ₹6,00,000 / year • Basic: 50% • HRA: 50% • Allowances: ₹5,000/mo • PF: 12% • PT: ₹200/mo',
      output: 'Monthly Gross: ₹42,500 • Deductions: ₹3,200 • Estimated Take-Home: ₹39,300/mo (Annual: ₹4,71,600)',
    },
    {
      title: '₹12 LPA Mid-Level Specialist Offer',
      description: 'Experienced developer package with 40% Basic, 50% HRA, ₹10,000 other allowances, 12% PF, and ₹200 PT.',
      input: 'CTC: ₹12,00,000 / year • Basic: 40% • HRA: 50% • Allowances: ₹10,000/mo • PF: 12% • PT: ₹200/mo',
      output: 'Monthly Gross: ₹70,000 • Deductions: ₹5,000 • Estimated Take-Home: ₹65,000/mo (Annual: ₹7,80,000)',
    },
    {
      title: '₹3.6 LPA Entry-Level Associate Offer',
      description: 'Starter corporate compensation with 50% Basic, 40% non-metro HRA, ₹2,000 allowances, 12% PF, and ₹200 PT.',
      input: 'CTC: ₹3,60,000 / year • Basic: 50% • HRA: 40% • Allowances: ₹2,000/mo • PF: 12% • PT: ₹200/mo',
      output: 'Monthly Gross: ₹23,000 • Deductions: ₹2,000 • Estimated Take-Home: ₹21,000/mo (Annual: ₹2,52,000)',
    },
    {
      title: '₹24 LPA Senior Engineering Lead Offer',
      description: 'Leadership compensation with 40% Basic, 50% HRA, ₹25,000 special allowances, 12% PF, and ₹200 PT.',
      input: 'CTC: ₹24,00,000 / year • Basic: 40% • HRA: 50% • Allowances: ₹25,000/mo • PF: 12% • PT: ₹200/mo',
      output: 'Monthly Gross: ₹1,45,000 • Deductions: ₹9,800 • Estimated Take-Home: ₹1,35,200/mo (Annual: ₹16,22,400)',
    },
  ]

  const faqs = [
    {
      question: 'What is the difference between CTC, Gross Salary, and In-Hand Salary?',
      answer:
        'Cost to Company (CTC) is the total annual expenditure an employer commits to spend on you, including employer retirement benefits and allowances. Gross Salary is the total earnings credited each month (Basic + HRA + Special Allowances) before any deductions. In-Hand (Take-Home) Salary is the actual liquid amount deposited into your salary bank account each month after subtracting employee statutory deductions like EPF and Professional Tax.',
    },
    {
      question: 'Why is my in-hand salary significantly lower than CTC divided by 12?',
      answer:
        'A common misconception is that monthly in-hand salary equals CTC divided by 12. In reality, CTC includes employer expenses that are never paid out in monthly cash—such as the Employer PF contribution (12%), gratuity accrual (~4.81% of basic), annual performance bonuses, and group medical insurance premiums—in addition to employee deductions like Employee PF and Professional Tax.',
    },
    {
      question: 'How is Basic Salary calculated and why does its percentage matter?',
      answer:
        'In Indian corporate compensation structures, Basic Salary is typically set between 40% and 50% of your total CTC. Basic salary is the foundational benchmark for multiple statutory benefits: Employee & Employer PF (12% of basic), HRA limits (40% to 50% of basic), and gratuity calculations. A higher basic increases long-term retirement savings but slightly reduces immediate monthly in-hand cash flow.',
    },
    {
      question: 'What is House Rent Allowance (HRA) and how is it structured?',
      answer:
        'House Rent Allowance (HRA) is an allowance paid by employers to help employees meet accommodation rental costs. In salary structures, it is typically set to 50% of Basic salary for metro cities (Delhi, Mumbai, Kolkata, Chennai) or 40% of Basic for non-metro cities. Under the Old Tax Regime, employees paying house rent can claim tax exemptions on HRA under Section 10(13A). Under the default New Tax Regime (Section 115BAC), HRA is treated as part of taxable income with no rent exemption.',
    },
    {
      question: 'How is Employee Provident Fund (EPF) calculated?',
      answer:
        'For establishments covered under EPFO with 20 or more employees, the standard employee deduction is 12% of monthly Basic salary. Many corporate employers calculate 12% on actual Basic salary, while some restrict mandatory contributions to the statutory wage ceiling of ₹15,000 per month (₹1,800/month). Your employer matches this contribution (split between EPF and the Employee Pension Scheme / EPS), accumulating compound interest exempt from tax up to statutory limits.',
    },
    {
      question: 'What is Professional Tax (PT) and how much is deducted?',
      answer:
        'Professional Tax is a state-level deduction levied only by certain Indian states (including Maharashtra, Karnataka, Telangana, Tamil Nadu, Gujarat, and West Bengal). States like Delhi, Haryana, and Uttar Pradesh do not levy Professional Tax. Where applicable, Article 276(2) of the Indian Constitution caps annual PT at ₹2,500, commonly deducted as ₹200 per month (with ₹300 in one month). Employees working in states without PT can set this input to 0.',
    },
    {
      question: 'Does this calculator deduct Income Tax (TDS)?',
      answer:
        'This calculator models the baseline compensation and statutory deduction structure (EPF and Professional Tax) to provide an accurate estimate of pre-TDS take-home pay. Actual monthly Income Tax (TDS) depends on your chosen tax regime (New Section 115BAC vs Old Regime), declaration of Section 80C/80D investments, NPS contributions, home loan interest exemptions, and individual tax slabs.',
    },
    {
      question: 'Can I adjust the PF and HRA percentages to match my offer letter?',
      answer:
        'Yes. All input fields—including Basic salary percentage (0%–100%), HRA percentage (0%–100%), other allowances, Employee PF percentage, and Professional Tax—are fully customizable. You can adjust the exact figures to reflect your company offer letter or salary slip.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Salary Calculator India — CTC to In-Hand Take-Home Pay | QUBNEXA"
      seoDescription="Calculate your monthly in-hand take-home salary from your annual CTC with QUBNEXA. Free salary calculator India with EPF, HRA, PT, and gross-to-net breakdown."
      keywords="salary calculator india, in hand salary calculator, ctc to in hand salary, monthly salary calculator, gross salary calculator, net take home pay, epf deduction, professional tax, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['emi-calculator', 'sip-calculator', 'percentage-calculator', 'gst-calculator']}
    >
      <SalaryCalculator />
    </ToolPageLayout>
  )
}
