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
    'Enter your intended monthly investment: Type your planned monthly contribution in Indian Rupees (₹) or adjust the slider anywhere between ₹100 and ₹10,00,000, or choose quick presets (₹1,000 to ₹25,000).',
    'Set your expected annual return rate: Input your expected CAGR (%) based on your asset class (e.g. 7%–9% for conservative debt funds, 11%–13% for diversified index funds, or 13%–15% for mid/small-cap funds).',
    'Select your investment duration: Choose your investment horizon from 1 to 40 years using the duration slider or click quick tenure shortcuts (5Y, 10Y, 15Y, 20Y, or 25Y).',
    'Inspect real-time maturity breakdown: View your total invested capital, estimated returns, total maturity amount, and wealth multiplier updated instantaneously.',
    'Examine the interactive visualizer: Check the dynamic donut chart comparing invested principal against accumulated compound interest gains.',
    'Review the periodic deposit summary: Check your committed capital broken down across monthly, quarterly (3 months), and annual (12 months) contribution milestones.',
    'Explore the year-wise compounding table: Expand the detailed year-by-year schedule to trace how compound interest accelerates your portfolio growth over time.',
  ]

  const formulas = [
    {
      title: 'Monthly Future Value Annuity Formula (Annuity Due)',
      formula: 'FV = P × [((1 + i)^n − 1) / i] × (1 + i)',
      explanation:
        'Calculates the compounded maturity value of monthly contributions assuming deposits occur at the beginning of each month (annuity due convention). P is the monthly investment, i is the periodic monthly rate, and n is the total number of monthly payments (Years × 12).',
    },
    {
      title: 'Periodic Monthly Yield Conversion',
      formula: 'i = Annual Rate / (12 × 100)',
      explanation:
        'Converts the nominal annualized expected return rate into its monthly decimal equivalent for month-by-month compounding cycles.',
    },
    {
      title: 'Total Out-of-Pocket Principal Deposited',
      formula: 'Invested Capital = P × (Years × 12)',
      explanation:
        'Calculates total principal deposited across all monthly installments throughout the investment tenure, excluding any compound returns.',
    },
    {
      title: 'Compounded Wealth Gains & Multiplier',
      formula: 'Wealth Gain = FV − Invested Capital | Multiplier = FV / Invested Capital',
      explanation:
        'Quantifies net capital appreciation generated purely through compounding and the ratio of final maturity value relative to out-of-pocket principal.',
    },
    {
      title: 'Zero-Return Linear Boundary (0% p.a. Edge Case)',
      formula: 'FV = P × n = Invested Capital (when Annual Rate = 0%)',
      explanation:
        'When the expected return rate is 0%, interest compounding is zero. The engine evaluates this boundary linearly to prevent division-by-zero errors, keeping maturity value exactly equal to principal.',
    },
    {
      title: 'Estimation Model & Market Volatility Disclaimer',
      formula: 'Projected Value = Mathematical Compounding Model (Non-Guaranteed)',
      explanation:
        'SIP calculations assume a constant annual return compounded monthly. Actual mutual fund NAVs fluctuate daily with market volatility. Returns are gross estimates before fund management expense ratios and taxes.',
    },
  ]

  const examples = [
    {
      title: 'Balanced Index Fund SIP (10-Year Horizon)',
      description: 'Moderate equity allocation compounding steadily over a decade.',
      input: 'Monthly: ₹5,000 • Expected Return: 12% p.a. • Duration: 10 Years (120 Months)',
      output: 'Invested: ₹6,00,000 • Est. Returns: ₹5,61,695 • Maturity: ₹11,61,695 • Multiplier: 1.94x (51.6% Principal / 48.4% Gains)',
    },
    {
      title: 'Diversified Flexi-Cap Growth SIP (15-Year Horizon)',
      description: 'Goal-oriented wealth accumulation for higher education or home ownership.',
      input: 'Monthly: ₹10,000 • Expected Return: 14% p.a. • Duration: 15 Years (180 Months)',
      output: 'Invested: ₹18,00,000 • Est. Returns: ₹43,28,538 • Maturity: ₹61,28,538 • Multiplier: 3.40x (29.4% Principal / 70.6% Gains)',
    },
    {
      title: 'Aggressive Long-Term Retirement SIP (20-Year Horizon)',
      description: 'Two-decade equity allocation harnessing the exponential curve of compounding.',
      input: 'Monthly: ₹15,000 • Expected Return: 15% p.a. • Duration: 20 Years (240 Months)',
      output: 'Invested: ₹36,00,000 • Est. Returns: ₹1,91,39,325 • Maturity: ₹2,27,39,325 • Multiplier: 6.32x (15.8% Principal / 84.2% Gains)',
    },
    {
      title: 'Capital Preservation & Zero-Return Baseline (0% p.a.)',
      description: 'Mathematical verification of total capital invested with zero interest or compounding.',
      input: 'Monthly: ₹10,000 • Expected Return: 0% p.a. • Duration: 5 Years (60 Months)',
      output: 'Invested: ₹6,00,000 • Est. Returns: ₹0 • Maturity: ₹6,00,000 • Multiplier: 1.00x (100% Principal / 0% Gains)',
    },
  ]

  const faqs = [
    {
      question: 'What is a Systematic Investment Plan (SIP) and how does it build wealth?',
      answer:
        'A Systematic Investment Plan (SIP) is an investment method offered by mutual funds allowing investors to deposit a fixed amount periodically (typically monthly) into a chosen mutual fund scheme. SIP instills financial discipline and leverages rupee-cost averaging by buying more units when market prices are low and fewer units when prices are high, eliminating the need to time market cycles.',
    },
    {
      question: 'How does this SIP calculator determine the final maturity value?',
      answer:
        'The calculator uses the standard future value formula for an annuity due: FV = P × [((1 + i)^n − 1) / i] × (1 + i), where P is the monthly investment amount, i is the monthly interest rate (Annual Rate / 12 / 100), and n is the total number of months (Years × 12). The additional (1 + i) factor accounts for payments deposited at the beginning of each monthly compounding period.',
    },
    {
      question: 'Are projected SIP returns guaranteed or fixed?',
      answer:
        'No. Mutual fund investments are subject to market risks, and returns are never guaranteed. The annual return percentage entered into the calculator is an assumed benchmark rate for planning purposes. In reality, equity and debt market returns vary from year to year depending on economic conditions, corporate earnings, and interest rate cycles.',
    },
    {
      question: 'Does this calculator account for mutual fund expense ratios or exit loads?',
      answer:
        'No. The calculator displays gross compounding returns. Mutual fund Net Asset Values (NAVs) are already declared net of the Total Expense Ratio (TER) deducted daily by asset management companies. Exit loads (if applicable for premature redemptions) are not deducted.',
    },
    {
      question: 'How does capital gains taxation impact mutual fund SIP returns in India?',
      answer:
        'This calculator computes gross investment estimates and does not deduct taxes. In India, equity mutual fund redemptions are subject to capital gains tax based on holding periods (with each monthly installment evaluated individually), where gains over 12 months are treated as long-term and gains under 12 months as short-term under applicable tax law. Because tax rates, exemptions, and fund classifications vary and are subject to legislative change, consult a certified financial or tax advisor for current tax rules applicable to your individual circumstances.',
    },
    {
      question: 'What happens to the calculation if I set the expected return rate to 0%?',
      answer:
        'If the expected annual return is set to 0%, the calculator executes a linear boundary calculation where estimated returns equal ₹0 and maturity value exactly equals total invested capital (Monthly Deposit × Total Months), preventing any division-by-zero errors.',
    },
    {
      question: 'How does the Year-Wise Growth Projection table calculate annual milestones?',
      answer:
        'The yearly schedule runs the compounding formula iteratively for each year (y from 1 to the selected tenure), computing the exact principal invested (P × y × 12), the compounded future value at that specific annual milestone, and the corresponding wealth multiplier.',
    },
    {
      question: 'How is a SIP different from a lumpsum mutual fund investment?',
      answer:
        'A lumpsum investment commits the entire capital upfront at a single market point, which carries entry timing risk. A SIP distributes deposits over time, reducing volatility through rupee-cost averaging and making regular investing accessible without requiring large initial capital.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="SIP Calculator Online — Mutual Fund Returns & Wealth | QUBNEXA"
      seoDescription="Calculate mutual fund SIP maturity returns, compounding wealth growth, and total gains online with QUBNEXA. Free SIP calculator with year-wise table and chart."
      keywords="sip calculator, mutual fund calculator, systematic investment plan, sip return calculator, mutual fund sip, wealth calculator, investment return calculator, sip compounding, cagr calculator, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['emi-calculator', 'percentage-calculator', 'gst-calculator', 'salary-calculator', 'discount-calculator', 'word-counter']}
    >
      <SipCalculator />
    </ToolPageLayout>
  )
}
