import React from 'react'
import { ToolPageLayout, type FAQItem, type FormulaItem, type ExampleItem } from '../../components/layout/ToolPageLayout'
import GoogleReviewLinkGenerator from '../../tools/GoogleReviewLinkGenerator/GoogleReviewLinkGenerator'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const GoogleReviewLinkGeneratorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'google-review-link-generator') || {
    id: 'google-review-link-generator',
    name: 'Google Review Direct Link & QR Code Generator',
    slug: 'google-review-link-generator',
    path: '/tools/google-review-link-generator',
    description:
      'Generate direct 1-click 5-star Google review links, custom branded printable table tent QR codes, and email signature review badges for local businesses.',
    categoryId: 'utilities',
    categoryIds: ['utilities', 'image-tools'],
    categoryName: 'Marketing & SEO',
    icon: 'Star',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    isFunctional: true,
    keywords: [
      'google review link generator',
      'google review qr code generator',
      'google business review link',
      'direct review link google maps',
      'place id review generator',
      'table tent qr code review',
      'qubnexa',
    ],
  }

  const howToUseSteps = [
    'Select Identifier Method: Choose "Google Place ID" (most reliable), your Google Business short name (`g.page/r/.../review`), or search by Business Name & City.',
    'Enter Your Place ID: Input your unique Google Place ID. When customers tap this link, Google Maps immediately opens the 5-star rating and comment box directly without requiring them to search or navigate manually.',
    'Customize Printable Flyer & Table Tent: Edit the headline (e.g., "Love our service?") and call-to-action subtext to fit your restaurant tables, hotel reception, dental clinic checkout, or retail counter.',
    'Brand Your QR Code: Adjust the QR code foreground and background colors to match your brand palette, with automatic high-contrast scanning preservation.',
    'Test Your Live Link: Click "Test Link" to verify the review modal opens immediately on Google Maps or mobile browsers.',
    'Download or Print: Download high-resolution PNG QR codes for marketing materials, print ready-to-use table tent flyers, or copy the HTML badge snippet for website footers and invoice emails.',
  ]

  const formulas: FormulaItem[] = [
    {
      title: 'Google Maps Direct Review Dialog URL Protocol',
      formula: 'https://search.google.com/local/writereview?placeid={PLACE_ID}',
      explanation:
        'Official Google deep-link protocol. Directly bypasses business overview cards and directly prompts the authenticated user with a 5-star rating submission dialog.',
    },
    {
      title: 'Shortlink Google Profile Protocol',
      formula: 'https://g.page/r/{BUSINESS_SHORTLINK_ID}/review',
      explanation:
        'Official Google Business Profile redirect alias. Resolves dynamically to the customer review interface on both desktop and mobile Google Maps apps.',
    },
    {
      title: 'QR Code Reed-Solomon Error Correction Level M',
      formula: 'Recovery Capacity = ~15% Data Damage Tolerance',
      explanation:
        'Employs Level M error correction, ensuring fast camera scanning even if counter cards experience slight creasing, glare, or ambient lighting distortion.',
    },
  ]

  const examples: ExampleItem[] = [
    {
      title: 'Neighborhood Specialty Coffee Shop Table Tents',
      description: 'A cafe owner places acrylic QR stands at 12 dining tables to collect happy customer feedback during morning rushes.',
      input: 'Place ID: ChIJ... | Headline: "Enjoyed your brew?" | Subtext: "Scan with your phone to leave us a quick review on Google!"',
      output: 'Customers scan the QR code while waiting for their bill and submit 5-star ratings in less than 15 seconds without typing any URL.',
    },
    {
      title: 'Dental Practice Checkout & Email Receipt Badge',
      description: 'A cosmetic dental clinic adds a 1-click review button to their post-appointment confirmation SMS and email receipts.',
      input: 'Embedded HTML badge snippet copied into automated post-visit follow-up emails.',
      output: 'Drives a 40% increase in monthly Google Business reviews, climbing local Map Pack rankings for "dentist near me".',
    },
  ]

  const faqs: FAQItem[] = [
    {
      question: 'How do I find my Google Place ID?',
      answer:
        'You can find your Google Place ID directly in your Google Business Profile manager under "Get more reviews" or by searching your business on Google’s official Place ID Finder developer page. It is a unique 27+ character alphanumeric string starting with "ChIJ".',
    },
    {
      question: 'Does the customer need a Google account to leave a review?',
      answer:
        'Yes. Google requires reviewers to be signed into any Google/Gmail account to deter bot spam and maintain verified review integrity. When they click the link, their browser automatically uses their existing logged-in Google profile.',
    },
    {
      question: 'Can I print this QR code on menus, stickers, and business cards?',
      answer:
        'Absolutely! Click "Download PNG QR Code" to get a clean, high-resolution square image with standard quiet zones that works on printed menus, window decals, delivery bags, receipts, and table stands.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Google Review Direct Link & QR Code Generator | QUBNEXA"
      seoDescription="Free 1-click Google review link and QR code generator for local businesses. Generate direct Place ID review links, printable table tent cards, and email signature badges."
      keywords="google review link generator, google review qr code, direct review link google maps, place id review generator, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['bulk-utm-builder', 'qr-code-generator', 'url-encoder-decoder', 'competitor-pricing-tracker']}
    >
      <GoogleReviewLinkGenerator />
    </ToolPageLayout>
  )
}

export default GoogleReviewLinkGeneratorPage
