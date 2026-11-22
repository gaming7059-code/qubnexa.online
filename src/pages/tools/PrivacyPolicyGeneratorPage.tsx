import React from 'react'
import { ToolPageLayout, type FAQItem, type FormulaItem, type ExampleItem } from '../../components/layout/ToolPageLayout'
import PrivacyPolicyGenerator from '../../tools/PrivacyPolicyGenerator/PrivacyPolicyGenerator'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const PrivacyPolicyGeneratorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'privacy-policy-generator') || {
    id: 'privacy-policy-generator',
    name: 'Privacy Policy & Cookie Compliance Generator',
    slug: 'privacy-policy-generator',
    path: '/tools/privacy-policy-generator',
    description:
      'Generate customizable, legally informed privacy policy drafts supporting GDPR, CCPA/CPRA, and COPPA standards for websites, SaaS applications, and ecommerce shops.',
    categoryId: 'text-writing',
    categoryIds: ['text-writing', 'utilities'],
    categoryName: 'General Utilities',
    icon: 'Scale',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    isFunctional: true,
    keywords: [
      'privacy policy generator',
      'gdpr privacy policy generator',
      'ccpa privacy generator',
      'cookie policy generator',
      'saas privacy policy template',
      'terms and privacy generator',
      'qubnexa',
    ],
  }

  const howToUseSteps = [
    'Enter Entity Information: Fill in your website name, public domain URL, legal business entity name, support email, and governing jurisdiction.',
    'Select Types of Data Collected: Toggle checkboxes for personal data (name, email, phone, address, payment processing, IP/device identifiers) to accurately reflect your data ingestion footprint.',
    'Declare Tracking & Cookies: Specify whether your site utilizes cookies, third-party analytics (Google Analytics, PostHog), or advertising retargeting pixels (Meta Pixel, Google Ads).',
    'Select Compliance Frameworks: Enable relevant international consumer privacy sections (European GDPR, California CCPA/CPRA, Children’s COPPA).',
    'Preview and Inspect: Toggle between "Formatted Preview", "HTML Code" (styled for immediate website embedding), and "Markdown (.md)" (ideal for GitHub docs and static site generators).',
    'Copy or Download: One-click copy the text or download the finalized .html or .md file directly to your project repository.',
  ]

  const formulas: FormulaItem[] = [
    {
      title: 'GDPR Article 13 & 14 Transparency Principle',
      formula: 'Disclosure Requirement = Data Controller Identity + Processing Legal Basis + Data Retention Period + Third-Party Disclosures + Data Subject Rights',
      explanation:
        'EU Regulation 2016/679 mandates clear, concise, transparent, and easily accessible notices regarding personal data collection and statutory withdrawal rights.',
    },
    {
      title: 'CCPA / CPRA Section 1798.100 Disclosure Framework',
      formula: 'Consumer Notice = Categories of Personal Data Collected + Business Commercial Purposes + Opt-Out of "Sale/Share" Disclosures',
      explanation:
        'California consumer privacy requirements mandate prominent notice of categories of personal information collected and an affirmative statement that personal data is not sold without consent.',
    },
  ]

  const examples: ExampleItem[] = [
    {
      title: 'B2B SaaS Web Application Launch',
      description: 'An indie developer launches a productivity tool with user logins, Stripe billing, and Google Analytics.',
      input: 'Collects: Name, Email, Payment (Stripe), IP. Uses: Cookies, GA. Enables: GDPR & CCPA.',
      output: 'Generates a 9-section structured policy with direct third-party processor declarations, ready to paste into /privacy.',
    },
    {
      title: 'Content Creator Blog & Newsletter',
      description: 'A creator operates a content blog and collects subscriber emails for a Substack/Mailchimp list.',
      input: 'Collects: Email only. Disables payment fields and physical address requirements.',
      output: 'Produces a lightweight, non-intimidating transparency policy focused on subscriber consent and opt-out rights.',
    },
  ]

  const faqs: FAQItem[] = [
    {
      question: 'Is a privacy policy legally required for my website?',
      answer:
        'Yes. If your website collects any personal information—even something as simple as email addresses through a contact form or visitor IP addresses through Google Analytics—global regulations (GDPR, CCPA, CalOPPA) legally require you to post a conspicuous privacy notice.',
    },
    {
      question: 'Does this generator cover mobile applications on iOS and Android?',
      answer:
        'Yes. Both Apple App Store and Google Play require all app submissions to provide a public privacy policy URL detailing data collection and third-party SDK analytics.',
    },
    {
      question: 'Is my company data sent to external servers or logged in a database?',
      answer:
        'No. 100% of policy text assembly occurs entirely inside your local browser. No company names, emails, or operational details are transmitted to or stored on any server.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Free Privacy Policy & Cookie Compliance Generator | QUBNEXA"
      seoDescription="Free privacy policy generator. Create legally informed drafts supporting GDPR, CCPA/CPRA, and COPPA standards for websites, apps, and ecommerce stores."
      keywords="privacy policy generator, gdpr privacy generator, ccpa policy creator, cookie policy draft, terms and privacy, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['ai-prompt-injection-scanner', 'bulk-utm-builder', 'b2b-case-study-generator', 'html-content-cleaner']}
    >
      <PrivacyPolicyGenerator />
    </ToolPageLayout>
  )
}

export default PrivacyPolicyGeneratorPage
