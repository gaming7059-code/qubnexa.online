import React from 'react'
import { ToolPageLayout, type FAQItem, type FormulaItem, type ExampleItem } from '../../components/layout/ToolPageLayout'
import B2bCaseStudyGenerator from '../../tools/B2bCaseStudyGenerator/B2bCaseStudyGenerator'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const B2bCaseStudyGeneratorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'b2b-case-study-generator') || {
    id: 'b2b-case-study-generator',
    name: 'B2B Case Study & Customer Success Story Generator',
    slug: 'b2b-case-study-generator',
    path: '/tools/b2b-case-study-generator',
    description:
      'Transform customer wins into high-converting B2B case studies, executive one-pagers, and viral social proof using the proven Problem-Solution-ROI framework.',
    categoryId: 'text-writing',
    categoryIds: ['text-writing', 'utilities'],
    categoryName: 'Marketing & SEO',
    icon: 'FileText',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    isFunctional: true,
    keywords: [
      'b2b case study generator',
      'customer success story builder',
      'case study template generator',
      'b2b sales enablement tool',
      'saas case study creator',
      'roi case study generator',
      'qubnexa',
    ],
  }

  const howToUseSteps = [
    'Define Customer & Project Profile: Enter your client’s name, their industry vertical, solution name, deployment timeline, or enable Anonymous Mode for confidential contracts.',
    'Articulate the Core Bottleneck: Describe the client’s legacy pain points, operational friction, and financial cost of inaction before discovering your solution.',
    'Detail the Solution & Rollout: Highlight key implementation milestones, zero-downtime integrations, or custom architecture features that unlocked success.',
    'Input Quantifiable ROI Metrics: Add up to 3 bold metrics (e.g., "88% Close Time Reduction", "$310,000 Annual Savings", "99.98% Accuracy") that prove tangible commercial value.',
    'Add an Executive Champion Quote: Include an authentic stakeholder testimonial from the client VP or founder.',
    'Switch Views & Export: Toggle between the formatted presentation preview, clean Markdown (.md) for GitHub or documentation sites, and a viral LinkedIn sales post summary.',
  ]

  const formulas: FormulaItem[] = [
    {
      title: 'STAR & BAB B2B Storytelling Framework',
      formula: 'Case Study = Situation (Context) + Challenge (Pain) + Solution (Bridge) + Quantifiable ROI (Result)',
      explanation:
        'Standard high-conversion sales enablement structure. Contrasting sharp operational friction against measurable financial payoff creates compelling enterprise buying urgency.',
    },
    {
      title: 'Quantified Return on Investment (ROI)',
      formula: 'Net ROI = [(Financial Gain or Overhead Saved - Solution Investment) / Solution Investment] × 100',
      explanation:
        'C-suite decision makers prioritize proof of payback period and bottom-line efficiency multiples over feature checklists.',
    },
  ]

  const examples: ExampleItem[] = [
    {
      title: 'Fintech Automated Ledger Reconciliation',
      description: 'A scale-up fintech eliminates 120 hours of monthly manual reconciliation with automated webhook pipelines.',
      input: 'Client: FinScale Tech | ROI: 88% Close Time Reduction, $310k Annual Savings, 3 Weeks Deployment',
      output: 'Generates a polished executive one-pager with highlight metric callouts and a ready-to-publish LinkedIn thought leadership post.',
    },
    {
      title: 'Healthcare AI Triage System Rollout',
      description: 'A regional hospital network accelerates patient triage response times by 65%.',
      input: 'Anonymous Mode enabled ("A Leading Healthcare Network").',
      output: 'Produces a HIPAA-conscious enterprise case study showcasing organizational throughput gains without revealing private entity identifiers.',
    },
  ]

  const faqs: FAQItem[] = [
    {
      question: 'Why are case studies so crucial for B2B sales?',
      answer:
        'Over 70% of B2B technology buyers consult peer case studies and ROI proof before signing contracts. A structured case study mitigates perceived risk and equips internal champions to justify budgets to CFOs.',
    },
    {
      question: 'Can I export the case study directly to Google Docs or Notion?',
      answer:
        'Yes! Click "Copy Content" or download the .md file. Markdown pastes seamlessly into Notion, Google Docs, Obsidian, Confluence, and modern CMS platforms.',
    },
    {
      question: 'Is client confidentiality protected when using this tool?',
      answer:
        'Yes. 100% of text composition executes locally in your browser. No client names, confidential metrics, or draft notes are transmitted to or stored on our servers.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="B2B Case Study & Customer Success Story Generator | QUBNEXA"
      seoDescription="Free B2B case study generator and customer success story builder. Transform client results into executive summaries, ROI metrics, and LinkedIn sales posts."
      keywords="b2b case study generator, customer success story builder, saas case study template, roi story generator, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['podcast-content-repurposer', 'privacy-policy-generator', 'bulk-utm-builder', 'competitor-pricing-tracker']}
    >
      <B2bCaseStudyGenerator />
    </ToolPageLayout>
  )
}

export default B2bCaseStudyGeneratorPage
