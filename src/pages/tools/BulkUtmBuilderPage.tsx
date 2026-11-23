import React from 'react'
import { ToolPageLayout, type FAQItem, type FormulaItem, type ExampleItem } from '../../components/layout/ToolPageLayout'
import BulkUtmBuilder from '../../tools/BulkUtmBuilder/BulkUtmBuilder'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const BulkUtmBuilderPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'bulk-utm-builder') || {
    id: 'bulk-utm-builder',
    name: 'Bulk UTM Link Builder & Matrix',
    slug: 'bulk-utm-builder',
    path: '/tools/bulk-utm-builder',
    description:
      'Generate, sanitize, and export high-conversion UTM campaign tracking links across 12+ channels simultaneously. Free bulk URL builder with instant CSV export.',
    categoryId: 'utilities',
    categoryIds: ['utilities', 'calculators'],
    categoryName: 'Marketing & SEO',
    icon: 'Link',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    isFunctional: true,
    keywords: [
      'bulk utm builder',
      'utm generator',
      'campaign url builder',
      'bulk campaign link creator',
      'google analytics utm builder',
      'utm tracking link matrix',
      'qubnexa',
    ],
  }

  const howToUseSteps = [
    'Choose Matrix vs. Bulk Mode: Select "Multi-Channel Matrix" to generate UTM URLs across multiple ad networks (Google, Meta, LinkedIn, TikTok, Email) for one or more landing pages, or choose "Bulk URL List" to tag a list of diverse URLs with uniform parameters.',
    'Enter Target Landing Page URLs: Paste your base URLs into the text area (one per line). The tool supports both root domains and deep landing pages with existing query strings.',
    'Define Campaign Attributes: Specify your required utm_campaign parameter, and optionally define utm_term (keywords) and utm_content (ad creative variants).',
    'Select Target Ad & Social Channels: Toggle the exact channels you intend to run (e.g. Google Search CPC, Meta Feed, LinkedIn Sponsored, Email Newsletter, YouTube Description).',
    'Configure URL Hygiene & Normalization: Keep lowercase enforcement enabled to avoid fragmented analytics reporting in Google Analytics 4 (GA4). Choose your space delimiter (- or _).',
    'Review, Test & Copy: Test individual links with one-click opening, copy specific tagged URLs with a single tap, or copy all generated links to your clipboard.',
    'Export CSV: Download a formatted spreadsheet containing original URLs, parameters, and final tagged links ready for Google Ads, Facebook Ads Manager, or marketing dashboards.',
  ]

  const formulas: FormulaItem[] = [
    {
      title: 'Standard UTM Parameter Architecture',
      formula: 'https://example.com/page?utm_source={source}&utm_medium={medium}&utm_campaign={campaign}&utm_term={term}&utm_content={content}',
      explanation:
        'Standard Google Analytics taxonomy for cross-channel attribution. Query parameters inform web analytics suites exactly which marketing touchpoint motivated a visit or conversion.',
    },
    {
      title: 'Query String Concatenation & Parsing Logic',
      formula: 'Delimiter = URL.hasSearchParams() ? "&" : "?"',
      explanation:
        'Ensures existing search parameters (such as referral codes or pre-existing tracking IDs) are safely preserved without creating malformed double-question-mark URL syntax.',
    },
    {
      title: 'Analytics Case Hygiene Rule',
      formula: 'Sanitized Parameter = RawInput.trim().toLowerCase().replace(/\\s+/g, "-")',
      explanation:
        'Standardizes casing and whitespace. In GA4, "Newsletter", "newsletter", and "NewsLetter" are treated as three disparate sources unless normalized during URL creation.',
    },
  ]

  const examples: ExampleItem[] = [
    {
      title: 'Omnichannel Product Launch Campaign',
      description: 'A marketing team launches a new feature and needs tracking links for Google Search, Meta Ads, and their weekly email newsletter.',
      input: 'URL: https://qubnexa.online/tools | Campaign: launch_v2 | Channels: Google Ads CPC, Meta Paid Social, Email Newsletter',
      output: 'Generates 3 tagged links with consistent lowercase naming conventions, ready for ad campaign attribution.',
    },
    {
      title: 'Affiliate & Influencer Partner Tracking',
      description: 'An ecommerce brand creates custom referral links for 5 YouTube creators promoting their holiday collection.',
      input: 'URL: https://qubnexa.online/store | Campaign: holiday_2026 | Medium: video | Content: creator_name',
      output: 'Generates distinct utm_content tags for each partner, allowing the finance team to calculate exact return on ad spend (ROAS).',
    },
  ]

  const whoShouldUse = [
    'Performance Marketers & Paid Media Specialists running omnichannel campaigns across Google Ads, Meta, TikTok, LinkedIn, and X.',
    'Email Marketers & Lifecycle Growth Managers tagging weekly newsletter links, transactional emails, and automated onboarding drips.',
    'Affiliate Managers & Influencer Marketing Leads generating unique, attributable tracking links for dozens of creator partners simultaneously.',
    'E-commerce Merchandisers tracking seasonal promotional campaigns across promotional banners, SMS marketing, and push notifications.',
  ]

  const problemsSolved = [
    'Eliminates Google Analytics 4 (GA4) data fragmentation caused by inconsistent casing (e.g. "facebook", "Facebook", and "FB" treated as separate channels).',
    'Solves the time drain of manual single-link builders by generating 12+ channel variants across multiple landing pages in one click.',
    'Preserves existing URL query parameters and hashes, preventing broken redirect chains and malformed double-question-mark URLs.',
    'Outputs clean, standardized CSV matrices ready for immediate import into Google Sheets, Excel, or marketing dashboards.',
  ]

  const bestPractices = [
    'Enforce lowercase parameters across all channels to maintain consolidated, clean attribution buckets in GA4.',
    'Use hyphens (-) to separate multi-word parameter values (e.g. utm_campaign=summer-clearance-2026) for optimal readability.',
    'Never use UTM parameters on internal website navigation links, as doing so overwrites the original session attribution source.',
    'Test generated URLs through your tracking redirects in an incognito window to verify that server redirects preserve query strings.',
  ]

  const commonMistakes = [
    'Inconsistent capitalization (e.g. "email" vs "Email" vs "Newsletter"), which fragments reporting in analytics platforms.',
    'Tagging internal site links with UTMs, which resets user session metrics and destroys organic bounce rate tracking.',
    'Failing to URL-encode special characters or spaces, which can break browser links and destination redirects.',
    'Relying on server redirects (301/302) that drop query parameters between HTTP and HTTPS or apex and www domains.',
  ]

  const faqs: FAQItem[] = [
    {
      question: 'Why should I generate UTM links in bulk instead of one at a time?',
      answer:
        'Manual UTM builders are error-prone and time-consuming. Building links in bulk guarantees standardized naming conventions, prevents typographical errors, avoids duplicate campaign fragments in Google Analytics 4, and lets you export full campaign matrices directly to your team spreadsheets in seconds.',
    },
    {
      question: 'What is the standard Google Analytics 4 (GA4) UTM hierarchy?',
      answer:
        'The standard hierarchy consists of: utm_source (platform identifying where traffic originates, e.g. google, newsletter, linkedin), utm_medium (high-level marketing channel, e.g. cpc, email, paid-social), utm_campaign (individual promotional initiative, e.g. spring_sale_2026), utm_term (search keywords or audience segments), and utm_content (specific ad creative variant or button callout).',
    },
    {
      question: 'Why does inconsistent casing (e.g. Facebook vs. facebook) ruin analytics reports?',
      answer:
        'Google Analytics 4 is strictly case-sensitive. If one campaign uses utm_source=Facebook and another uses utm_source=facebook, GA4 treats them as two completely separate traffic channels, making it difficult to calculate true return on ad spend (ROAS) without manual spreadsheet reconciliation.',
    },
    {
      question: 'Should I ever put UTM tracking parameters on internal website links?',
      answer:
        'No, never! Placing UTM tags on internal links (such as a homepage banner linking to a product page) immediately overwrites the visitor\'s original acquisition source (such as Google Organic Search) and triggers a new artificial session, corrupting your organic conversion data.',
    },
    {
      question: 'Will this tool overwrite pre-existing parameters in my URL?',
      answer:
        'No. The tool parses URLs using standard browser URL APIs. Pre-existing query parameters (such as ?ref=partner or ?locale=en) are preserved, while UTM tags are cleanly merged or updated.',
    },
    {
      question: 'How do 301 and 302 redirects affect UTM campaign tracking?',
      answer:
        'If your tagged URL redirects to another page (for example, from http:// to https:// or from example.com/blog to example.com/blog/), ensure your web server is configured with query string appending ($request_uri / QSA). Otherwise, the server may drop the UTM parameters during the redirect.',
    },
    {
      question: 'Are my campaign links sent to external servers or tracking databases?',
      answer:
        'Never. 100% of link generation, sanitization, and CSV formatting executes client-side in your browser. None of your marketing URLs, client names, or campaign strategies are recorded or transmitted.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Bulk UTM Link Builder & Campaign URL Matrix | QUBNEXA"
      seoDescription="Free bulk UTM builder and campaign tracking matrix. Build, sanitize, and export marketing campaign URLs for Google Ads, Meta, and Email to CSV."
      keywords="bulk utm builder, campaign url builder, utm generator, ga4 utm matrix, marketing link tracking, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      whoShouldUse={whoShouldUse}
      problemsSolved={problemsSolved}
      bestPractices={bestPractices}
      commonMistakes={commonMistakes}
      relatedSlugs={['google-review-link-generator', 'local-seo-grid-planner', 'competitor-pricing-tracker', 'qr-code-generator']}
    >
      <BulkUtmBuilder />
    </ToolPageLayout>
  )
}

export default BulkUtmBuilderPage
