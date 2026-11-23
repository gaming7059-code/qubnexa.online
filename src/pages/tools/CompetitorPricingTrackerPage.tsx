import React from 'react'
import { ToolPageLayout, type FAQItem, type FormulaItem, type ExampleItem } from '../../components/layout/ToolPageLayout'
import { CompetitorPricingTracker } from '../../tools/CompetitorPricingTracker/CompetitorPricingTracker'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const CompetitorPricingTrackerPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'competitor-pricing-tracker') || {
    id: 'competitor-pricing-tracker',
    name: 'Competitor Pricing Tracker',
    slug: 'competitor-pricing-tracker',
    path: '/tools/competitor-pricing-tracker',
    description:
      'Privacy-conscious competitor pricing comparison workspace. Log competitor prices, track historical drops or increases, evaluate your market positioning, and export clean CSV reports.',
    categoryId: 'calculators',
    categoryIds: ['calculators', 'utilities'],
    categoryName: 'Calculators & Finance',
    icon: 'TrendingUp',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    isFunctional: true,
    keywords: [
      'competitor pricing tracker',
      'price comparison tool',
      'market pricing analysis',
      'competitor benchmark',
      'saas price tracker',
      'ecommerce price comparison',
      'qubnexa',
    ],
  }

  const howToUseSteps = [
    'Log Competitor Prices: Enter the competitor or company name, the product or plan tier, their current price, and any baseline/previous price you observed previously.',
    'Select Currency & Add Notes: Choose your transaction currency (USD, EUR, GBP, INR, CAD, AUD) and add contextual notes (e.g. "Includes 5 user seats", "Annual billing discount").',
    'Evaluate Price Variance: Watch the tool instantly calculate the absolute dollar variance, percentage difference, and trend direction (Drop, Increase, or Unchanged).',
    'Benchmark Your Own Offering: Enter your own selling price in the "My Price" field to instantly see your market rank, whether you are cheaper or more expensive than the market average, and the exact dollar variance.',
    'Filter, Search & Sort: Use the search bar to find specific competitors or products, filter by currency, or sort by lowest price, highest price, or largest price drops.',
    'Export Data: Click "CSV" to export a clean spreadsheet for team reviews, or click "Copy" to copy a structured text summary directly to your clipboard.',
  ]

  const formulas: FormulaItem[] = [
    {
      title: 'Price Difference & Directional Change Formula',
      formula: 'Price Difference (Δ) = Current Price - Previous Price | % Change = (Δ / Previous Price) × 100',
      explanation:
        'Computes the exact magnitude and percentage change between historical baseline pricing and current observed market prices. Negative values represent competitor price drops; positive values indicate price hikes.',
    },
    {
      title: 'Market Baseline Average Price Formula',
      formula: 'Average Price (μ) = (Σ Current Price_i) / N (Total Competitors)',
      explanation:
        'Determines the unweighted central tendency of market prices across all active filtered offerings for that product or service tier.',
    },
    {
      title: 'Competitive Market Variance & Positioning Index',
      formula: 'Variance to Market = My Price - Average Price | Variance % = (Variance / Average Price) × 100',
      explanation:
        'Calculates whether your offering is positioned above (premium pricing) or below (value/penetration pricing) the prevailing market average, providing actionable intelligence for positioning strategy.',
    },
    {
      title: 'Price Spread / Range Formula',
      formula: 'Price Spread = Maximum Market Price - Minimum Market Price',
      explanation:
        'Measures market price elasticity and dispersion. A wide spread indicates high product differentiation; a narrow spread indicates commoditized pricing.',
    },
  ]

  const examples: ExampleItem[] = [
    {
      title: 'SaaS Startup Competitor Pricing Audit',
      description: 'A B2B SaaS founder wants to price their new team collaboration tool competitively against 4 established competitors.',
      input: 'Competitors logged at $49, $79, $35, and $65/mo. Founder enters My Price = $45/mo.',
      output: 'The tracker reveals a market average of $57.00. At $45/mo, the founder is 21.1% cheaper than the average market baseline, ranking as the 2nd most affordable option.',
    },
    {
      title: 'E-commerce Retail Seller Discount Tracking',
      description: 'An online merchant monitors seasonal discounts on a popular consumer electronics accessory.',
      input: 'Competitor A dropped from $59 to $49 (-16.9%); Competitor B stayed at $79 (0.0%).',
      output: 'The green drop indicator highlights Competitor A’s promotional pricing, allowing the merchant to adjust advertising copy and counter-promo timing.',
    },
  ]

  const whoShouldUse = [
    'B2B SaaS Founders & Product Managers setting tier pricing and packaging for newly launched software solutions.',
    'E-commerce Merchants & Marketplace Sellers monitoring rival promotional discounts, flash sales, and bundle pricing.',
    'Agency Owners & IT Consultants benchmarking hourly billable rates and fixed-scope retainers against market competitors.',
    'Enterprise Sales Reps needing fast competitive benchmark data to defend pricing proposals during procurement negotiations.',
  ]

  const problemsSolved = [
    'Centralizes competitor price intelligence into an organized, private local dashboard without expensive market-intel subscription fees.',
    'Calculates dynamic market baseline averages and percentage price variances instantly as you add or update quotes.',
    'Provides instant competitive positioning feedback: enter your own price to see exactly how your offer ranks against the market spread.',
    'Preserves business confidentiality by keeping all competitor intelligence 100% in local browser storage (localStorage) with zero server transmission.',
  ]

  const bestPractices = [
    'Track both monthly list prices and effective annual billing rates to understand true competitor cash flow incentives.',
    'Audit competitors on a consistent schedule (e.g. bi-weekly or monthly) to catch promotional discount tests before they become permanent.',
    'Look beyond raw dollar figures: note changes in user seat allowances, API call limits, or onboarding support tiers in the notes field.',
    'Export a CSV backup snapshot before clearing browser cookies or switching computers to maintain your historical pricing records.',
  ]

  const commonMistakes = [
    'Engaging in an aggressive "race to the bottom" by slashing prices without considering gross margins and customer support overhead.',
    'Assuming public website list prices reflect actual enterprise deal terms (large accounts frequently negotiate 20%–40% custom discounts).',
    'Failing to note currency exchange rate fluctuations when comparing international SaaS competitors against domestic offerings.',
    'Relying on memory instead of logging baseline prices, making it impossible to calculate true directional price changes over time.',
  ]

  const faqs: FAQItem[] = [
    {
      question: 'Is my competitor pricing data stored on Qubnexa servers or shared with anyone?',
      answer:
        'No. QUBNEXA operates with strict browser-first privacy. All price records, competitor names, notes, and benchmark prices are stored exclusively in your local web browser storage (localStorage). No data is ever transmitted to, saved on, or analyzed by remote servers.',
    },
    {
      question: 'Does this tool automatically scrape live website prices in real time?',
      answer:
        'No. This tool is an honest, privacy-first manual intelligence workspace designed for product managers, founders, and sales teams to log and analyze mystery shops, quote inquiries, and audit findings. We do not engage in unauthorized bot-scraping or brittle web scrapers.',
    },
    {
      question: 'How is Market Baseline Average and Price Spread calculated?',
      answer:
        'The market average is calculated as the arithmetic mean of all active competitor prices logged for that item. Price spread is the absolute difference between the highest and lowest market prices observed, reflecting market price elasticity.',
    },
    {
      question: 'How does the "My Price" benchmark calculation work?',
      answer:
        'When you enter your own selling price, the tracker calculates your dollar and percentage variance relative to the market average and displays your numerical competitive rank (e.g. "Rank 2 of 5 — 14.5% below market average").',
    },
    {
      question: 'Can I export my pricing data to Excel or Google Sheets?',
      answer:
        'Yes! Click the "CSV" button in the toolbar to immediately download a standard .csv spreadsheet file containing all competitor names, products, prices, percentage changes, dates, and notes.',
    },
    {
      question: 'Will my saved data disappear when I close or refresh the tab?',
      answer:
        'No. Your data is persisted in your local browser’s localStorage. As long as you use the same browser and device, your records remain intact across page reloads and browser sessions. You can also export to CSV anytime for external backups.',
    },
    {
      question: 'Can I track prices across multiple international currencies?',
      answer:
        'Yes. The tracker supports USD ($), EUR (€), GBP (£), INR (₹), CAD ($), and AUD ($). You can filter your view by specific currencies to maintain accurate apples-to-apples comparisons.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Competitor Pricing Tracker & Market Analysis | QUBNEXA"
      seoDescription="Free competitor pricing tracker. Monitor competitor prices, calculate price variance against your offers, and export CSV reports in your browser."
      keywords="competitor pricing tracker, pricing comparison tool, market pricing analysis, competitor benchmark, saas price tracker, ecommerce price comparison, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      whoShouldUse={whoShouldUse}
      problemsSolved={problemsSolved}
      bestPractices={bestPractices}
      commonMistakes={commonMistakes}
      relatedSlugs={['profit-loss-calculator', 'percentage-calculator', 'discount-calculator', 'gst-calculator']}
    >
      <CompetitorPricingTracker />
    </ToolPageLayout>
  )
}
