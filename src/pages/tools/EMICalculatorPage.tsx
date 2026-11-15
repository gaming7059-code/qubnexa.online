import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { EMICalculator } from '../../tools/EMICalculator/EMICalculator'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const EMICalculatorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'emi-calculator')!

  const howToUseSteps = [
    'Enter your required Loan Amount in Indian Rupees (₹) directly or select a quick preset button (₹5L, ₹10L, ₹25L, ₹50L, or ₹1Cr).',
    'Input the annual interest rate quoted by your bank, housing finance company, or NBFC (e.g., 8.5% for Home Loans, 9.0% for Car Loans, or 12.5% for Personal Loans).',
    'Specify your desired loan tenure and use the toggle switch to input the duration in either Years or Months.',
    'Review the Monthly Loan EMI hero card displaying your exact monthly repayment obligation across the entire loan lifespan.',
    'Examine the three-card financial summary: borrowed Principal Amount, Total Interest Payable, and cumulative Total Payment (Principal + Interest).',
    'Inspect the interactive principal-vs-interest proportion bar to instantly evaluate what percentage of your payments goes toward debt reduction versus interest costs.',
    'Click Reset to test different down payment amounts, loan tenures, or interest rates to compare loan offers and find your ideal monthly budget.',
  ]

  const formulas = [
    {
      title: 'Standard Reducing Balance EMI Formula',
      formula: 'EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)',
      explanation:
        'Standard reducing balance amortization formula used by commercial banks and NBFCs under Reserve Bank of India (RBI) lending guidelines. P is Principal, r is periodic monthly rate (Annual Rate ÷ 12 ÷ 100), and n is total months (Years × 12). Monthly interest applies strictly to the remaining outstanding principal balance.',
    },
    {
      title: 'Periodic Monthly Interest Rate Conversion',
      formula: 'r = Annual Interest Rate (%) ÷ 12 ÷ 100',
      explanation:
        'Converts the nominal annual percentage rate (APR) into a monthly fractional decimal. For instance, an 8.50% annual interest rate equals a periodic monthly rate of r = 8.5 ÷ 1200 ≈ 0.007083.',
    },
    {
      title: 'Total Interest & Cumulative Repayment',
      formula: 'Total Payment = EMI × n  •  Total Interest = (EMI × n) - P',
      explanation:
        'Total repayment is the product of your monthly installment and total tenure months. Subtracting the initial principal reveals the true cost of borrowing charged by the lender over the loan lifespan.',
    },
    {
      title: 'Reducing Balance vs. Flat Rate Comparison',
      formula: 'Flat Rate Total Interest = P × (Annual Rate ÷ 100) × Years',
      explanation:
        'In flat-rate loans, interest is charged on the initial borrowed principal for the entire tenure regardless of monthly principal repayments. A flat rate of 8% is effectively equivalent to roughly 14% to 15% on a reducing balance basis.',
    },
  ]

  const examples = [
    {
      title: 'Home Loan (20-Year Mortgage)',
      description: 'Long-term residential property purchase financed through an Indian public or private sector housing finance bank.',
      input: 'Principal: ₹50,00,000 • Interest Rate: 8.50% p.a. • Tenure: 20 Years (240 Months)',
      output: 'Monthly EMI: ₹43,391 • Total Interest: ₹54,13,879 • Total Payment: ₹1,04,13,879 (52.0% Interest)',
    },
    {
      title: 'New Car Loan (5-Year Auto Finance)',
      description: 'Financing a passenger vehicle with a typical medium-term automobile loan structure.',
      input: 'Principal: ₹10,00,000 • Interest Rate: 9.00% p.a. • Tenure: 5 Years (60 Months)',
      output: 'Monthly EMI: ₹20,758 • Total Interest: ₹2,45,501 • Total Payment: ₹12,45,501 (19.7% Interest)',
    },
    {
      title: 'Unsecured Personal Loan (3-Year Term)',
      description: 'Urgent medical, wedding, or home renovation personal credit facility without collateral.',
      input: 'Principal: ₹3,00,000 • Interest Rate: 12.50% p.a. • Tenure: 3 Years (36 Months)',
      output: 'Monthly EMI: ₹10,036 • Total Interest: ₹61,299 • Total Payment: ₹3,61,299 (17.0% Interest)',
    },
    {
      title: 'Professional Higher Education Loan (7-Year Repayment)',
      description: 'Undergraduate or postgraduate degree financing with structured equal monthly amortization post-moratorium.',
      input: 'Principal: ₹15,00,000 • Interest Rate: 10.00% p.a. • Tenure: 7 Years (84 Months)',
      output: 'Monthly EMI: ₹24,902 • Total Interest: ₹5,91,749 • Total Payment: ₹20,91,749 (28.3% Interest)',
    },
  ]

  const faqs = [
    {
      question: 'What is an Equated Monthly Installment (EMI) and how does it work?',
      answer:
        'An Equated Monthly Installment (EMI) is a fixed sum paid by a borrower to a financial institution on a specific day of every calendar month until the loan is fully amortized. Each EMI payment contains two components: interest on the outstanding principal and a partial repayment of the principal itself. In the early stages of a loan, interest forms the largest chunk of the EMI; as the principal balance drops with each payment, the interest portion declines while the principal portion expands.',
    },
    {
      question: 'What is the difference between a Reducing Balance loan and a Flat Rate loan?',
      answer:
        'Under the reducing balance method (standard across Indian commercial banks), interest is computed every month solely on the remaining outstanding principal. As you pay down debt, interest charges decrease. Under the flat rate method, interest is charged on the initial borrowed principal for the entire loan life without acknowledging repayments. A flat rate of 8% often translates to an effective reducing rate of nearly 14% to 15%, making reducing balance loans much more borrower-friendly.',
    },
    {
      question: 'How does choosing a longer loan tenure affect monthly EMI and total interest?',
      answer:
        'A longer loan tenure divides your principal repayment across more months, resulting in a lower monthly EMI that is easier on your monthly cash flow. However, because interest accrues over a longer timeframe, the total interest paid rises dramatically. For example, a ₹50 Lakh home loan at 8.5% over 30 years costs ₹30 Lakh more in interest than the same loan repaid over 20 years. Borrowers should choose the shortest tenure their monthly budget comfortably accommodates.',
    },
    {
      question: 'How do part-prepayments impact an active loan?',
      answer:
        'Making partial prepayments directly reduces your outstanding loan principal. When you prepay, lenders typically offer two options: (1) keep the monthly EMI constant and reduce the total loan tenure (which saves maximum interest), or (2) keep the remaining tenure unchanged and lower the monthly EMI (which frees up monthly cash flow). Under Reserve Bank of India (RBI) regulatory guidelines, commercial banks and housing finance companies cannot charge prepayment penalties or foreclosure charges on floating-rate home loans sanctioned to individual borrowers, meaning prepaying even 5% to 10% of principal annually can save lakhs in interest.',
    },
    {
      question: 'How is the periodic monthly interest rate calculated from the annual interest rate?',
      answer:
        'To calculate monthly EMI, lenders divide the quoted annual interest rate by 12 months, and then divide by 100 to convert the percentage into a decimal. For example, if your bank quotes an annual interest rate of 9%, the periodic monthly rate is r = 9 ÷ (12 × 100) = 0.0075. This monthly rate is then applied to the mathematical amortization formula.',
    },
    {
      question: 'What is the recommended EMI-to-income ratio (FOIR) when taking a loan?',
      answer:
        'Financial advisers and credit underwriters recommend keeping your Fixed Obligation to Income Ratio (FOIR)—the percentage of your net monthly take-home salary spent on all active loan EMIs combined—between 40% and 50%. Exceeding 50% severely constrains emergency savings, discretionary spending, and retirement investments, and can lead to loan application rejections.',
    },
    {
      question: 'Does my EMI amount change if my loan has a floating interest rate?',
      answer:
        'Yes. Most retail home loans in India are tied to external benchmark lending rates (such as the RBI Repo Rate). When the central bank hikes or cuts the repo rate, your lender adjusts the interest rate accordingly. Typically, banks maintain the existing monthly EMI and adjust the total loan tenure. However, if the rate hike pushes the tenure beyond the maximum permitted lifespan (usually retirement age), the lender will increase the monthly EMI amount.',
    },
    {
      question: 'Are loan processing fees, insurance, and GST included in this calculator?',
      answer:
        'No. This calculator computes pure mathematical interest and principal amortization. Banks and NBFCs charge one-time administrative processing fees (usually 0.25% to 1% of the loan amount), mandatory 18% GST on fees, documentation fees, and property or credit insurance separately during loan sanction.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="EMI Calculator Online — Home, Car & Personal Loan EMI | QUBNEXA"
      seoDescription="Calculate monthly EMI for home loans, car loans, and personal loans with QUBNEXA. Free loan EMI calculator with instant interest and total repayment breakdown."
      keywords="emi calculator, loan emi calculator, home loan emi calculator, personal loan emi calculator, monthly emi calculator, car loan emi, loan interest calculator, reducing balance emi, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['sip-calculator', 'salary-calculator', 'gst-calculator', 'percentage-calculator']}
    >
      <EMICalculator />
    </ToolPageLayout>
  )
}
