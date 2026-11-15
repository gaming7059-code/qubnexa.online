import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { SipCalculator } from '../../tools/SipCalculator/SipCalculator'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const SipCalculatorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'sip-calculator') || {
    id: 'sip-calculator',
    name: 'SIP Calculator',
    slug: 'sip-calculator',
    route: '/tools/sip-calculator',
    path: '/tools/sip-calculator',
    description:
      'Calculate mutual fund SIP maturity value, wealth multiplier, and wealth gains online. Includes interactive donut chart, year-wise compounding table, and Indian Rupee formatting.',
    primaryCategory: 'calculators',
    secondaryCategories: ['utilities'],
    categoryId: 'calculators',
    categoryIds: ['calculators', 'utilities'],
    categoryName: 'Calculators & Finance',
    icon: 'TrendingUp',
    status: 'live',
    releaseOrder: 33,
    createdAt: '2026-11-13',
    isPopular: true,
    isNew: true,
    badge: 'Growth Chart',
    tags: [
      'sip calculator',
      'mutual fund calculator',
      'systematic investment plan',
      'investment calculator',
      'sip return calculator',
      'wealth calculator',
      'cagr calculator',
      'sip compounding',
      'mutual fund returns',
    ],
    keywords: [
      'sip calculator',
      'mutual fund calculator',
      'systematic investment plan',
      'investment calculator',
      'sip return calculator',
      'wealth calculator',
      'cagr calculator',
      'sip compounding',
      'mutual fund returns',
    ],
  }

  const howToUseSteps = [
    'Enter your intended monthly SIP contribution in Indian Rupees (₹) using the slider or numeric box, or choose a preset like ₹5,000 or ₹10,000.',
    'Input your expected annual rate of return (%) based on your asset class (e.g. 12% for equity mutual funds or 8% for debt funds).',
    'Select your investment duration in years (e.g. 5, 10, 15, or 20 years) with the tenure controls.',
    'View the estimated maturity amount, total capital invested, wealth gain, and interactive donut chart instantaneously.',
    'Expand the Year-Wise Growth Projection table to examine how compounding accelerates returns over each year of the investment tenure.',
  ]

  const formulas = [
    {
      title: 'Monthly Future Value Annuity Formula',
      formula: 'FV = P × [((1 + i)^n − 1) / i] × (1 + i)',
      explanation:
        'Computes the compounded future value of periodic monthly deposits where P is monthly investment, i is the monthly interest rate, and n is the total number of monthly payments.',
    },
    {
      title: 'Periodic Monthly Yield Conversion',
      formula: 'i = Annual Rate / (12 × 100)',
      explanation:
        'Converts the annualized expected return rate into its monthly equivalent decimal rate for accurate monthly compounding cycles.',
    },
    {
      title: 'Total Capital Investment',
      formula: 'Invested Capital = P × (Years × 12)',
      explanation:
        'Calculates the total out-of-pocket principal deposited across all monthly installments throughout the entire tenure.',
    },
    {
      title: 'Estimated Wealth Gains & Multiplier',
      formula: 'Wealth Gain = FV − Invested Capital, Multiplier = FV / Invested Capital',
      explanation:
        'Quantifies the net capital appreciation generated through compounding and the multiple by which your invested money grew.',
    },
  ]

  const examples = [
    {
      title: 'Moderate Long-Term Equity SIP',
      description: 'Disciplined monthly investment into balanced index funds.',
      input: '₹5,000 / month, 12% annual return, 10 Years tenure',
      output: 'Invested: ₹6,00,000 | Est. Returns: ₹5,61,695 | Maturity: ₹11,61,695 (1.94x)',
    },
    {
      title: 'High-Growth 15-Year Horizon',
      description: 'Mid-cap and flexi-cap mutual fund strategy for education or home purchase.',
      input: '₹10,000 / month, 14% annual return, 15 Years tenure',
      output: 'Invested: ₹18,00,000 | Est. Returns: ₹43,28,538 | Maturity: ₹61,28,538 (3.41x)',
    },
    {
      title: 'Retirement Wealth Multiplier',
      description: 'Long-term equity allocation compounding over two decades.',
      input: '₹15,000 / month, 15% annual return, 20 Years tenure',
      output: 'Invested: ₹36,00,000 | Est. Returns: ₹1,91,39,376 | Maturity: ₹2,27,39,376 (6.32x)',
    },
  ]

  const faqs = [
    {
      question: 'What is a Systematic Investment Plan (SIP)?',
      answer:
        'A Systematic Investment Plan (SIP) is an investment vehicle offered by mutual funds that allows you to invest a fixed amount of money at regular monthly intervals into a mutual fund scheme, promoting disciplined long-term investing and rupee-cost averaging.',
    },
    {
      question: 'Are SIP returns guaranteed?',
      answer:
        'No. Mutual fund investments are subject to market risks, and returns are not guaranteed. Actual returns depend on market performance, economic conditions, and scheme fund management. The 12% or 14% rate used in calculators is an assumed historical benchmark rate for long-term equity compounding.',
    },
    {
      question: 'Does this calculator deduct taxes or expense ratios?',
      answer:
        'No. The calculator displays gross returns before taxes. In India, equity mutual fund capital gains above ₹1.25 lakh per financial year are subject to 12.5% Long-Term Capital Gains (LTCG) tax (effective post-Finance Act 2024), and mutual fund NAVs already reflect net daily expense ratios.',
    },
    {
      question: 'What happens if the expected return rate is set to 0%?',
      answer:
        'At 0% annual return, no compounding or interest occurs. The calculator accurately computes maturity value as exactly equal to total invested capital (P × n) with zero returns, without division-by-zero errors.',
    },
    {
      question: 'Can I increase, decrease, or pause my SIP during the tenure?',
      answer:
        'Yes. Most asset management companies allow step-up SIPs (annual percentage increases) or pausing SIP installments without penalty. This calculator assumes a constant monthly contribution over the selected tenure.',
    },
    {
      question: 'How is SIP different from a lumpsum investment?',
      answer:
        'A lumpsum investment involves committing your entire capital in a single one-off payment, which carries market timing risk. A SIP distributes your investment monthly, buying more units when prices fall and fewer when prices rise (rupee-cost averaging).',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="SIP Calculator — Calculate Mutual Fund SIP Returns & Wealth Growth | QUBNEXA"
      seoDescription="Calculate mutual fund SIP maturity values, compounding growth, and total wealth gains with an interactive chart, year-wise table, and Indian Rupee formatting."
      keywords="sip calculator, mutual fund calculator, systematic investment plan, investment calculator, sip return calculator, wealth calculator, cagr calculator, sip compounding, mutual fund returns"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['emi-calculator', 'percentage-calculator', 'gst-calculator', 'salary-calculator']}
    >
      <SipCalculator />
    </ToolPageLayout>
  )
}
