import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { DiscountCalculator } from '../../tools/DiscountCalculator/DiscountCalculator'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const DiscountCalculatorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'discount-calculator')!

  const howToUseSteps = [
    'Select your calculation mode: "Calculate Sale Price & Savings" if you know the discount rate, or "Calculate Discount Percentage" to determine the discount between two known prices.',
    'Enter the original list price (MRP) in Indian Rupees (₹). Precise decimal amounts like ₹999.50 are fully supported.',
    'For Sale Price mode, enter the discount percentage or click any quick discount preset button (5%, 10%, 15%, 20%, 25%, 30%, 40%, 50%, or 70% off).',
    'For Discount Percentage mode, enter the final checkout or discounted sale price.',
    'Review the highlighted Hero Card showing the final payable price and your total savings amount.',
    'Examine the multi-card breakdown displaying Discount Amount, Amount Saved, and effective Savings Percentage.',
    'Click "Reset" to quickly clear all inputs and evaluate your next shopping deal or festive sale offer.',
  ]

  const formulas = [
    {
      title: 'Discount Amount Formula',
      formula: 'Discount Amount = (Original Price × Discount %) / 100',
      explanation:
        'Calculates the exact monetary concession deducted from the initial retail list price or MRP.',
    },
    {
      title: 'Final Discounted Sale Price',
      formula: 'Final Price = Original Price - Discount Amount',
      explanation:
        'The net payable checkout price after subtracting promotional concession from the original price.',
    },
    {
      title: 'Reverse Discount Percentage Formula',
      formula: 'Discount % = ((Original Price - Sale Price) / Original Price) × 100',
      explanation:
        'Determines the exact percentage markdown by dividing the total amount saved by the original list price.',
    },
    {
      title: 'Successive / Double Discount Math',
      formula: 'Effective Discount % = d1 + d2 - ((d1 × d2) / 100)',
      explanation:
        'For stacked discounts (e.g., 50% + 20% off), the second discount applies to the already reduced subtotal, yielding an effective 60% saving rather than 70%.',
    },
  ]

  const examples = [
    {
      title: 'Festival Electronics Sale (Diwali / Big Billion Days)',
      description: 'Buying a smart television listed at ₹45,000 with an instant 15% promotional discount.',
      input: 'Original Price: ₹45,000 • Discount: 15% (Mode 1)',
      output: 'Discount: ₹6,750 • You Save: ₹6,750 • Final Price: ₹38,250 (15% Off)',
    },
    {
      title: 'Apparel Clearance Flat Markdown',
      description: 'Branded denim jeans marked at ₹2,499 with an end-of-season 40% clearance discount.',
      input: 'Original Price: ₹2,499 • Discount: 40% (Mode 1)',
      output: 'Discount: ₹999.60 • You Save: ₹999.60 • Final Price: ₹1,499.40 (40% Off)',
    },
    {
      title: 'Finding Discount Rate on Book Offer (Reverse Mode)',
      description: 'A bookstore sells an academic textbook with an MRP of ₹800 at a checkout price of ₹640.',
      input: 'Original Price: ₹800 • Sale Price: ₹640 (Mode 2)',
      output: 'Calculated Discount Rate: 20% Off • Total Amount Saved: ₹160',
    },
    {
      title: 'Luxury Watch Special Promotion (Reverse Mode)',
      description: 'A designer timepiece retailing at ₹12,500 offered on sale for ₹8,750.',
      input: 'Original Price: ₹12,500 • Sale Price: ₹8,750 (Mode 2)',
      output: 'Calculated Discount Rate: 30% Off • Total Amount Saved: ₹3,750',
    },
  ]

  const faqs = [
    {
      question: 'How do I calculate a discount amount and final price manually?',
      answer:
        'To find the discount amount, multiply the original price by the discount percentage and divide by 100: Discount Amount = (Original Price × Discount %) / 100. Then subtract this discount from the original price to get the final sale price: Final Price = Original Price - Discount Amount. For example, a 20% discount on ₹1,500 is (1500 × 20) / 100 = ₹300, making the final price ₹1,200.',
    },
    {
      question: 'How do successive or double discounts work (e.g., 50% + 20% off)?',
      answer:
        'Retailers apply stacked discounts successively rather than adding them together. The first discount applies to the original list price, and the second applies to the already discounted subtotal. On a ₹1,000 product, 50% reduces it to ₹500, and an additional 20% off ₹500 saves ₹100, resulting in a final price of ₹400. This equals an effective 60% total discount, not 70%.',
    },
    {
      question: 'What is the formula to find the discount percentage if I know the original and sale price?',
      answer:
        'Subtract the sale price from the original price to find the amount saved, then divide by the original price and multiply by 100: Discount % = ((Original Price - Sale Price) / Original Price) × 100. For instance, if an item marked at ₹2,000 is sold for ₹1,500, you save ₹500, which equals (500 / 2000) × 100 = 25% discount.',
    },
    {
      question: 'Is the discount calculated before or after GST?',
      answer:
        'Under Indian consumer protection regulations and retail practice, printed MRPs on consumer goods are already inclusive of all taxes (GST). When e-commerce stores or retailers offer a discount on MRP, the percentage discount applies to the tax-inclusive retail price. For B2B commercial transactions, trade discounts under Section 15 of the CGST Act are deducted from the base price before GST is levied.',
    },
    {
      question: 'Can I calculate fractional percentages or decimal prices with paise?',
      answer:
        'Yes. The calculator fully supports decimal prices (e.g., ₹999.50) and fractional discount percentages (e.g., 12.5% or 7.25%). All values are rounded to two decimal places in accordance with standard financial accounting rules.',
    },
    {
      question: 'How does Buy 1 Get 1 Free (BOGO) translate into a percentage discount?',
      answer:
        'A standard Buy 1 Get 1 Free (BOGO) promotion offers two identical items for the price of one, which equals an exact 50% discount on both items combined. A Buy 2 Get 1 Free promotion gives you three items for the price of two, which equals a 33.33% discount across the items.',
    },
    {
      question: 'What is the difference between a discount and a markup?',
      answer:
        'A discount reduces the selling price below the original list price to incentivize purchase. A markup increases the price above the original cost price to generate a gross profit margin for the seller. A 20% markup on a ₹100 cost produces a ₹120 selling price, whereas a 20% discount on a ₹120 price reduces it back to ₹96.',
    },
    {
      question: 'Are my shopping prices or discount numbers saved or shared?',
      answer:
        'Never. QUBNEXA operates 100% client-side in your web browser. All calculations execute locally on your device CPU. No cart totals, merchant prices, or product numbers are ever transmitted, tracked, or saved on any server.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Discount Calculator Online — Sale Price & Percentage Off | QUBNEXA"
      seoDescription="Calculate sale prices, percentage discounts, and total savings instantly with QUBNEXA. Free discount calculator with quick percentage presets and reverse math."
      keywords="discount calculator, percentage discount calculator, sale price calculator, price after discount, discount percentage calculator, calculate savings, reverse discount, double discount, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['percentage-calculator', 'profit-loss-calculator', 'gst-calculator', 'salary-calculator']}
    >
      <DiscountCalculator />
    </ToolPageLayout>
  )
}
