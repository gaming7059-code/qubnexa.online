import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { GSTCalculator } from '../../tools/GSTCalculator/GSTCalculator'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const GSTCalculatorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'gst-calculator')!

  const howToUseSteps = [
    'Choose your calculation mode: select "Add GST (Exclusive Amount)" to add tax on top of a net subtotal, or "Remove GST (Inclusive Amount)" to extract embedded tax from a gross MRP receipt.',
    'Enter your transaction amount in Indian Rupees (₹). Precise decimal amounts like ₹1,249.50 are fully supported.',
    'Select a standard Indian GST tax slab button (0%, 5%, 12%, 18%, or 28%) or type any custom percentage (e.g., 3% for gold, 0.25% for diamonds) into the custom rate box.',
    'Review the highlighted Hero Card showing the gross final amount (when adding GST) or net pre-tax base amount (when removing GST).',
    'Examine the three-card tax breakdown: Total GST Amount, Central GST (CGST: 50%), and State GST (SGST: 50%).',
    'Consult the inter-state reference note: for cross-border transactions across states, the full tax rate applies as Integrated GST (IGST).',
    'Click "Reset" to clear all fields and quickly calculate new invoice quotations, commercial bills, or retail receipts.',
  ]

  const formulas = [
    {
      title: 'Adding GST (Exclusive Tax Formula)',
      formula: 'GST Amount = (Base Amount × Rate) / 100 • Total = Base + GST',
      explanation:
        'Standard forward tax calculation. Applies the statutory GST percentage on top of the net commercial invoice subtotal to determine total billing amount.',
    },
    {
      title: 'Removing GST (Inclusive Reverse Tax Formula)',
      formula: 'Base = Total / (1 + Rate / 100) • GST Amount = Total - Base',
      explanation:
        'Reverse tax calculation. Extracts the original pre-tax base cost and embedded GST component from retail maximum retail prices (MRP) or gross commercial receipts.',
    },
    {
      title: 'Intra-State Dual Tax Split (CGST & SGST)',
      formula: 'CGST = GST Amount / 2 • SGST = GST Amount / 2',
      explanation:
        'For supply within the same Indian state or Union Territory (intra-state), tax revenue is divided equally (50:50) between the Central and State Governments.',
    },
    {
      title: 'Inter-State Integrated Tax (IGST)',
      formula: 'IGST = Total GST Amount (100% Statutory Rate)',
      explanation:
        'For goods or services supplied across state borders (inter-state) or imported into India, Integrated GST is levied in full by the Central Government and apportioned to the destination state.',
    },
  ]

  const examples = [
    {
      title: '18% GST on IT Consulting & Professional Services (Add Mode)',
      description: 'An independent software contractor or consulting firm billing a corporate client for technical services.',
      input: 'Base Amount: ₹50,000 • GST Slab: 18% (Exclusive)',
      output: 'GST Amount: ₹9,000 (CGST: ₹4,500, SGST: ₹4,500) • Total Invoice: ₹59,000',
    },
    {
      title: 'Removing 18% GST from Consumer Electronics MRP (Remove Mode)',
      description: 'Extracting the net pre-tax price and embedded tax from a smartphone accessory retail invoice.',
      input: 'Inclusive MRP: ₹11,800 • GST Slab: 18% (Inclusive)',
      output: 'Original Base Price: ₹10,000 • Embedded GST: ₹1,800 (CGST: ₹900, SGST: ₹900)',
    },
    {
      title: '5% GST on Restaurant Dining & Packaged Foods (Add Mode)',
      description: 'A restaurant billing a customer for dine-in services or packaged food supplies.',
      input: 'Base Amount: ₹2,500 • GST Slab: 5% (Exclusive)',
      output: 'GST Amount: ₹125 (CGST: ₹62.50, SGST: ₹62.50) • Total Bill: ₹2,625',
    },
    {
      title: '28% GST on Air Conditioners & Consumer Durables (Add Mode)',
      description: 'Wholesale distributor invoicing a retail merchant for commercial home appliances.',
      input: 'Base Amount: ₹35,000 • GST Slab: 28% (Exclusive)',
      output: 'GST Amount: ₹9,800 (CGST: ₹4,900, SGST: ₹4,900) • Total Bill: ₹44,800',
    },
  ]

  const faqs = [
    {
      question: 'What is the difference between GST Inclusive and GST Exclusive pricing?',
      answer:
        'GST Exclusive means the price quoted is the net base amount before taxes; GST is calculated and added on top to reach the final bill (Mode: Add GST). GST Inclusive means the displayed price (such as a printed retail MRP) already incorporates the tax; reverse calculation extracts the original pre-tax base cost and the embedded GST amount (Mode: Remove GST).',
    },
    {
      question: 'How is GST split between CGST, SGST, and IGST in India?',
      answer:
        'For intra-state supplies (seller and buyer located in the same state or union territory), the total GST rate is divided equally (50:50) into Central GST (CGST) and State GST (SGST/UTGST). For inter-state supplies (seller and buyer in different states or union territories), the full statutory rate is levied as Integrated GST (IGST) by the Central Government and apportioned to the destination state.',
    },
    {
      question: 'What are the official GST tax slabs in India and what do they cover?',
      answer:
        'India operates four primary tax brackets: 5% (household essentials, packaged basic foods, medicines, economy travel), 12% (processed foods, apparel above ₹1,000, business hardware), 18% (standard rate for commercial services, IT, financial services, telecom, capital goods), and 28% (luxury automobiles, aerated drinks, cement, consumer durables). Basic unbranded agricultural produce falls under 0% (exempt).',
    },
    {
      question: 'How do I calculate GST on discounted items or promotional sales?',
      answer:
        'Under Section 15 of the CGST Act, trade discounts given before or at the time of supply and recorded on the invoice must be deducted from the list price before calculating GST. Therefore, apply the discount to the original price first, and then input the discounted net subtotal into this calculator to determine the legally compliant GST liability.',
    },
    {
      question: 'What is the mathematical formula to remove GST from an inclusive amount?',
      answer:
        'To extract base price and embedded tax from a GST-inclusive figure, divide the total inclusive price by (1 + GST Rate / 100): Base = Total / (1 + Rate / 100). The embedded tax is then computed as: GST Amount = Total - Base Amount. For example, for a ₹1,180 item at 18% GST, Base = ₹1,180 / 1.18 = ₹1,000, and GST = ₹180.',
    },
    {
      question: 'Can I calculate custom GST rates like 3% on gold or 0.25% on diamonds?',
      answer:
        'Yes. While the calculator features quick preset buttons for the standard 0%, 5%, 12%, 18%, and 28% slabs, you can enter any custom percentage with up to two decimal places in the custom rate field. This allows instant calculations for special statutory rates such as 3% on gold and jewelry, or 0.25% on rough precious stones.',
    },
    {
      question: 'How does Input Tax Credit (ITC) work with GST?',
      answer:
        'Registered businesses can claim Input Tax Credit (ITC) on the GST paid when purchasing goods or services used for commercial operations. When generating customer invoices, the business charges output GST but can deduct the input tax already paid on raw materials, tools, and services, remitting only the balance difference to the government.',
    },
    {
      question: 'Are my business financial numbers or customer invoices logged or tracked?',
      answer:
        'No. QUBNEXA processes all GST computations completely client-side in your web browser. Your quotation numbers, bill amounts, and financial estimates are never uploaded, logged, or transmitted across any remote server, ensuring 100% financial confidentiality.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="GST Calculator — Add & Remove GST Online (CGST & SGST) | QUBNEXA"
      seoDescription="Calculate GST online with QUBNEXA. Add or remove GST from invoices with 5%, 12%, 18%, and 28% slabs. Instant CGST, SGST, IGST, and reverse tax breakdown."
      keywords="gst calculator, gst calculator india, add gst, remove gst, reverse gst calculator, gst inclusive calculator, gst exclusive calculator, cgst sgst calculator, igst calculator, 18 percent gst, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['discount-calculator', 'profit-loss-calculator', 'percentage-calculator', 'emi-calculator']}
    >
      <GSTCalculator />
    </ToolPageLayout>
  )
}
