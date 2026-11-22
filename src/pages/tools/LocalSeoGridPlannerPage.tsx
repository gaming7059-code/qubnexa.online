import React from 'react'
import { ToolPageLayout, type FAQItem, type FormulaItem, type ExampleItem } from '../../components/layout/ToolPageLayout'
import LocalSeoGridPlanner from '../../tools/LocalSeoGridPlanner/LocalSeoGridPlanner'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const LocalSeoGridPlannerPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'local-seo-grid-planner') || {
    id: 'local-seo-grid-planner',
    name: 'Local SEO Geo-Grid Rank & Proximity Planner',
    slug: 'local-seo-grid-planner',
    path: '/tools/local-seo-grid-planner',
    description:
      'Plan, simulate, and analyze Google Map Pack local search rankings across customizable geographic radius grids. Interactive geo-coordinate matrix with CSV export.',
    categoryId: 'utilities',
    categoryIds: ['utilities', 'calculators'],
    categoryName: 'Marketing & SEO',
    icon: 'Compass',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    isFunctional: true,
    keywords: [
      'local seo grid planner',
      'geo grid rank tracker',
      'google map pack grid tool',
      'local proximity seo audit',
      'local search rank tracker',
      'google business profile rank checker',
      'qubnexa',
    ],
  }

  const howToUseSteps = [
    'Enter Business & Target Query: Input your business name, core service keyword (e.g., "invisalign dentist", "emergency plumber"), and starting latitude/longitude coordinates.',
    'Select Grid Matrix Size: Choose between 3x3 (9 pins), 5x5 (25 pins), or 7x7 (49 pins) depending on whether you are analyzing a neighborhood or a wider metropolitan region.',
    'Adjust Step Radius: Slide the distance step (0.25 to 5.0 miles) to simulate how your Map Pack presence expands or shrinks across geographical distances.',
    'Configure Local Authority Signals: Provide your current Google review count and average rating to simulate how profile prominence mitigates natural proximity decay.',
    'Inspect Interactive Geo Matrix: Tap on individual pins to inspect simulated rank numbers (Green = Top 3 Map Pack, Amber = Top 10, Red = 11+).',
    'Review Optimization Strategy: Follow the actionable recommendations to build neighborhood landing pages and geotagged citations for low-ranking pins.',
    'Export Coordinates CSV: Download the full coordinate table (lat, lng, cardinal direction, simulated rank) for external rank tracking audits.',
  ]

  const formulas: FormulaItem[] = [
    {
      title: 'Google Local Map Pack Proximity Decay Model',
      formula: 'Estimated Rank = Max(1, Floor[1 + (Distance × α) - AuthorityModifier])',
      explanation:
        'Models Google’s geographic proximity bias where user distance from the physical business epicenter acts as the primary ranking decay factor, mitigated by review velocity and authority signals.',
    },
    {
      title: 'Geographic Degree Offset Formula',
      formula: 'ΔLat = (Miles × RowOffset) / 69.0 | ΔLng = (Miles × ColOffset) / [69.0 × cos(Lat)]',
      explanation:
        'Converts Cartesian grid radius steps in miles into accurate spherical coordinates (WGS84 latitude and longitude offsets).',
    },
    {
      title: 'Map Pack Visibility Coverage Share',
      formula: 'Coverage % = (Pins with Rank ≤ 3 / Total Grid Pins) × 100',
      explanation:
        'Measures the percentage of geographic territory where your business captures 1st-page Google Maps 3-Pack traffic.',
    },
  ]

  const examples: ExampleItem[] = [
    {
      title: 'Dental Practice Proximity Expansion Audit',
      description: 'An orthodontic clinic in Austin, TX with 185 reviews analyzes why they rank #1 downtown but fall to #8 four miles north.',
      input: 'Center: Downtown Austin | Keyword: "invisalign dentist" | 5x5 Grid | 1.0 Mile Step',
      output: 'Reveals 44% Top 3 Map Pack coverage with a distinct drop-off past 2 miles north, highlighting the need for a dedicated North Austin service page.',
    },
    {
      title: 'Emergency HVAC Repair Service Radius',
      description: 'A heating and cooling company models service dispatch radiuses across a 15-mile suburban territory.',
      input: '7x7 Grid (49 points) with 2.0-mile steps.',
      output: 'Provides exact lat/long coordinate points to import into localized Google Ads campaigns and local directory citations.',
    },
  ]

  const faqs: FAQItem[] = [
    {
      question: 'What is a Local SEO Geo-Grid?',
      answer:
        'A geo-grid is a matrix of virtual search locations laid out in a grid pattern around a business. Because Google local search results change based on the searcher’s exact physical location, a geo-grid reveals where your business appears in the 3-Pack and where proximity decay drops you out of sight.',
    },
    {
      question: 'How does Google calculate Map Pack rankings?',
      answer:
        'Google’s local algorithm relies on three pillars: Relevance (how well your business matches the query), Distance (how far you are from the searcher or specified location), and Prominence (review volume, ratings, citations, and website domain authority).',
    },
    {
      question: 'Does this tool require expensive Google Maps API keys?',
      answer:
        'No! This planner utilizes mathematical coordinate modeling and proximity decay simulation entirely inside your browser, requiring zero API subscriptions or credit cards.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Local SEO Geo-Grid Rank & Proximity Planner | QUBNEXA"
      seoDescription="Free local SEO geo-grid rank planner. Simulate and analyze Google Map Pack rankings across geographic radius grids with interactive matrix visualization and CSV export."
      keywords="local seo grid planner, geo grid rank tracker, google map pack grid, local proximity seo audit, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['google-review-link-generator', 'bulk-utm-builder', 'competitor-pricing-tracker', 'b2b-case-study-generator']}
    >
      <LocalSeoGridPlanner />
    </ToolPageLayout>
  )
}

export default LocalSeoGridPlannerPage
