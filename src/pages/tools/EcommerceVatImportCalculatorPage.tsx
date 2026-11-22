import React from 'react'
import { ToolPageLayout, type FAQItem, type FormulaItem, type ExampleItem } from '../../components/layout/ToolPageLayout'
import { EcommerceVatImportCalculator } from '../../tools/EcommerceVatImportCalculator/EcommerceVatImportCalculator'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const EcommerceVatImportCalculatorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'ecommerce-vat-import-calculator') || {
    id: 'ecommerce-vat-import-calculator',
    name: 'Ecommerce VAT & Import Cost Calculator',
    slug: 'ecommerce-vat-import-calculator',
    path: '/tools/ecommerce-vat-import-calculator',
    description:
      'Professional landed cost, customs tariff duty, import VAT/GST, and landed margin calculator for cross-border ecommerce sellers, dropshippers, and global retailers.',
    categoryId: 'calculators',
    categoryIds: ['calculators', 'utilities'],
    categoryName: 'Calculators & Finance',
    icon: 'Ship',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    isFunctional: true,
    keywords: [
      'ecommerce vat calculator',
      'landed cost calculator',
      'import duty calculator',
      'customs tariff calculator',
      'dropshipping margin calculator',
      'cif value calculator',
      'vat import calculator',
      'qubnexa',
    ],
  }

  const howToUseSteps = [
    'Select Destination Country & Incoterm: Choose the importing nation (UK, Germany, France, US, Australia, Canada, etc.) or enter a custom VAT/GST rate. Select your Incoterm (DDP, CIF, or FOB) to determine shipping liability.',
    'Enter Product Unit & Freight Costs: Input your supplier manufacturing/purchase cost per unit, international freight and handling, packaging costs, and transit insurance fees.',
    'Input Order Quantity & Customs Duty Rate: Specify batch units and select a product category preset (Electronics, Apparel, Footwear, Toys, etc.) or input an exact customs duty percentage.',
    'Add Local Clearance & Carrier Fees: Include customs broker clearance fees, port handling/storage charges, and last-mile domestic courier fulfillment fees.',
    'Review Landed Cost Breakdown: The interactive visual waterfall displays your base CIF Customs Value, Duty Payable, Import VAT/GST liability, Total Landed Cost, and Landed Cost Per Unit.',
    'Benchmark Retail Pricing & Margin: Enter your target consumer selling price (inclusive or exclusive of tax) to analyze your gross profit, landed margin percentage, and minimum breakeven retail price.',
    'Export Summary: Copy a clean Markdown/text breakdown directly to your clipboard or download a structured CSV spreadsheet report for supplier negotiations or accounting records.',
  ]

  const formulas: FormulaItem[] = [
    {
      title: 'CIF Customs Valuation Formula (Cost, Insurance & Freight)',
      formula: 'Customs Value (CIF) = (Unit Cost × Quantity) + Total Freight + Packaging + Transit Insurance',
      explanation:
        'Standard international customs valuation basis. Under WTO rules, customs duties and taxes are assessed upon the CIF value at the designated port or border of entry.',
    },
    {
      title: 'Customs Duty Payable Formula',
      formula: 'Customs Duty = Customs Value (CIF) × (Duty Rate % / 100)',
      explanation:
        'Computes the non-refundable tariff assessed by the border customs authority based on the product’s Harmonized System (HS) code classification.',
    },
    {
      title: 'Import VAT / GST Assessment Base Formula',
      formula: 'Import VAT = (Customs Value (CIF) + Customs Duty + Port Clearance Fees) × (VAT Rate % / 100)',
      explanation:
        'In most global jurisdictions (including the EU, UK, and Australia), import VAT is calculated on the cumulative sum of the CIF value PLUS the customs duty and direct border clearance charges.',
    },
    {
      title: 'Total Landed Cost & Landed Margin Formula',
      formula: 'Total Landed Cost = CIF Value + Duty + VAT (if DDP) + Local Clearance + Domestic Courier | Landed Margin % = [(Retail Net - Landed Cost/Unit) / Retail Net] × 100',
      explanation:
        'Reveals the complete real expenditure required to deliver the product ready-for-sale into your customer’s hands, preventing costly under-pricing in cross-border trade.',
    },
  ]

  const examples: ExampleItem[] = [
    {
      title: 'Apparel Import from Asia to the United Kingdom (DDP)',
      description: 'An online boutique imports 500 designer hoodies at $18.00 unit cost, with $1,200 air freight, $200 insurance, 12% UK apparel duty, and 20% UK VAT.',
      input: 'Qty: 500 | Unit Cost: $18.00 | Freight: $1,200 | Duty: 12% | VAT: 20% | Clearance: $150 | Target Retail: $65.00',
      output: 'CIF Value: $10,400.00. Customs Duty: $1,248.00. Import VAT: $2,359.60. Total Landed Cost: $14,157.60 ($28.32/unit). At $65.00 retail (ex-tax), gross profit is $36.68/unit (56.4% landed margin).',
    },
    {
      title: 'Electronics Accessory to Germany (EU MwSt)',
      description: 'A hardware brand imports 1,000 smart watch chargers into Hamburg. Electronics duty is 0.0%, German MwSt is 19.0%.',
      input: 'Qty: 1,000 | Unit Cost: $6.50 | Freight: $850 | Insurance: $50 | Duty: 0% | VAT: 19% | Clearance: $120',
      output: 'CIF Value: $7,400.00. Customs Duty: $0.00. Import VAT: $1,428.80. Total Landed Cost: $8,948.80 ($8.95/unit). Clear visibility ensures accurate Amazon FBA margin calculations.',
    },
  ]

  const faqs: FAQItem[] = [
    {
      question: 'What is the difference between FOB, CIF, and DDP in this calculator?',
      answer:
        'FOB (Free on Board) means the buyer pays shipping and insurance from the foreign port. CIF (Cost, Insurance & Freight) means the seller covers transport to the destination port, where customs duties begin. DDP (Delivered Duty Paid) means the seller or importer handles all tariffs, import VAT, and clearance costs directly.',
    },
    {
      question: 'Is Import VAT recoverable for registered businesses?',
      answer:
        'In the EU, UK, and many other jurisdictions, if your business is registered for VAT, import VAT paid upon clearance can frequently be reclaimed as input tax on your periodic VAT return (e.g. via UK C79 certificate or Postponed VAT Accounting). For B2C deliveries or unregistered sellers, import VAT represents a permanent cost.',
    },
    {
      question: 'How do I know my product’s exact duty rate?',
      answer:
        'Duty rates depend on your product’s 6 to 10-digit Harmonized Tariff Schedule (HTS) or HS code. This calculator provides average global benchmarks for common ecommerce categories (e.g., apparel, electronics, toys, cosmetics) and lets you enter the exact custom duty rate from your customs broker.',
    },
    {
      question: 'Are my landed costs and pricing inputs kept private?',
      answer:
        'Yes. 100% of calculations, product costs, freight figures, and margin analyses run locally in your browser. No financial data is sent to or stored on any server.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Ecommerce Landed Cost & Import Duty VAT Calculator | QUBNEXA"
      seoDescription="Free ecommerce landed cost & import VAT calculator. Compute customs duty, import taxes, CIF value, and profit margins with instant CSV export."
      keywords="ecommerce landed cost calculator, import duty calculator, customs vat calculator, cif value calculator, dropshipping margin calculator, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['competitor-pricing-tracker', 'profit-loss-calculator', 'gst-calculator', 'percentage-calculator']}
    >
      <EcommerceVatImportCalculator />
    </ToolPageLayout>
  )
}

export default EcommerceVatImportCalculatorPage
