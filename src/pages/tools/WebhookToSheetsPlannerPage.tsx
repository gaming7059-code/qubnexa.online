import React from 'react'
import { ToolPageLayout, type FAQItem, type FormulaItem, type ExampleItem } from '../../components/layout/ToolPageLayout'
import WebhookToSheetsPlanner from '../../tools/WebhookToSheetsPlanner/WebhookToSheetsPlanner'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const WebhookToSheetsPlannerPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'webhook-to-sheets-planner') || {
    id: 'webhook-to-sheets-planner',
    name: 'Webhook to Google Sheets Data Planner & Script Generator',
    slug: 'webhook-to-sheets-planner',
    path: '/tools/webhook-to-sheets-planner',
    description:
      'Flatten complex JSON webhook payloads, map Google Sheets spreadsheet columns, and generate free Google Apps Script webhook listeners without paid automation subscriptions.',
    categoryId: 'utilities',
    categoryIds: ['utilities', 'ai-tools'],
    categoryName: 'Developer Tools',
    icon: 'Webhook',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    isFunctional: true,
    keywords: [
      'webhook to google sheets planner',
      'json to google sheets generator',
      'google apps script webhook receiver',
      'free zapier alternative google sheets',
      'flatten json payload spreadsheet',
      'stripe webhook to sheets',
      'qubnexa',
    ],
  }

  const howToUseSteps = [
    'Paste Webhook JSON or Load Sample: Input your raw webhook payload from Stripe, Shopify, Typeform, Calendly, or GitHub. Or choose one of our real-world presets.',
    'Review Automatically Flattened Fields: The tool recursively traverses nested JSON objects and arrays, generating clean dot-notation keys (e.g. data.object.customer.email).',
    'Customize Spreadsheet Columns: Rename any header column to human-friendly titles (e.g. "Customer Email", "Order Amount") and uncheck fields you do not wish to track.',
    'Specify Target Worksheet Tab: Name the destination tab within your Google Spreadsheet (e.g. "Webhook Leads").',
    'Copy Google Apps Script: Switch to the "Google Apps Script" tab and copy the generated JavaScript code.',
    'Deploy Free Webhook Endpoint: Open your Google Sheet, navigate to Extensions → Apps Script, paste the code, and click Deploy → New Deployment → Web App. Copy the resulting URL into your webhook provider settings with zero monthly automation subscription fees!',
  ]

  const formulas: FormulaItem[] = [
    {
      title: 'Recursive JSON Dot-Notation Flattening',
      formula: 'FlatKey = ParentKey ? `${ParentKey}.${CurrentKey}` : CurrentKey',
      explanation:
        'Traverses arbitrary tree-depth JSON hierarchies to produce uniform 2-dimensional rows suitable for tabular relational databases and Google Sheets.',
    },
    {
      title: 'Serverless Google Apps Script doPost Protocol',
      formula: 'doPost(e) → ContentService.createTextOutput(JSON.stringify({ status: "success" }))',
      explanation:
        'Standard HTTP POST listener executed serverless within Google Workspace infrastructure, receiving JSON payloads and appending rows in real time.',
    },
  ]

  const examples: ExampleItem[] = [
    {
      title: 'Stripe Payment Notification to Finance Sheet',
      description: 'A SaaS founder logs new Stripe payments directly into Google Sheets without paying for Zapier.',
      input: 'Stripe payment_intent.succeeded webhook payload with nested customer and amount fields.',
      output: 'Generates ready-to-run Google Apps Script and formatted column headers ("Event ID", "Amount", "Currency", "Customer Email", "Status").',
    },
    {
      title: 'Shopify New Order Fulfillment Tracker',
      description: 'An ecommerce team streams customer addresses and order totals to their warehouse fulfillment sheet.',
      input: 'Shopify order creation JSON payload.',
      output: 'Produces CSV header row and automated Google Apps Script listener in under 60 seconds.',
    },
  ]

  const whoShouldUse = [
    'Full-Stack Developers & DevOps Engineers seeking lightweight serverless data loggers without maintaining backend servers.',
    'Startup Founders & Solopreneurs looking to eliminate $50–$200/month Zapier or Make.com bills for simple webhook-to-sheet logging.',
    'E-commerce Store Owners (Shopify, WooCommerce, Stripe) streaming order confirmations, customer shipping details, and refund alerts to operations sheets.',
    'Growth Marketers & Lead Gen Teams capturing lead submissions from Typeform, Webflow, Calendly, and Tally in real time.',
  ]

  const problemsSolved = [
    'Eliminates third-party automation subscription costs by harnessing Google Apps Script\'s built-in free serverless execution environment.',
    'Flattens deeply nested JSON objects and arrays into human-readable 2-dimensional spreadsheet columns with dot-notation keys.',
    'Auto-generates production-ready, error-handled Google Apps Script doPost(e) code that automatically appends incoming rows in real time.',
    'Eliminates manual CSV importing by turning any standard Google Spreadsheet into a live, authenticated HTTP POST endpoint.',
  ]

  const bestPractices = [
    'When deploying Apps Script, select "Execute as: Me" and "Who has access: Anyone" so external webhook providers can post data without Google login prompts.',
    'Include a secret token verification check (e.g. payload.token === "MY_SECRET") in your script to reject unauthorized HTTP requests.',
    'Freeze the top header row in your Google Sheet (View → Freeze → 1 row) to keep column headers visible as hundreds of rows append.',
    'Always click Deploy → New Deployment (or Manage Deployments → Edit → New Version) whenever you modify Apps Script code, otherwise Google serves the previous build.',
  ]

  const commonMistakes = [
    'Modifying Apps Script code and saving it without deploying a New Version (Google Apps Script web endpoints only execute deployed versions).',
    'Exceeding Google Workspace daily quotas by routing ultra-high-frequency firehoses (>50,000 daily requests) to a personal Gmail account.',
    'Renaming spreadsheet columns in your Google Sheet without updating the corresponding key mapping in the Apps Script doPost function.',
    'Testing webhook URLs without passing valid JSON headers (Content-Type: application/json), causing parser exceptions.',
  ]

  const faqs: FAQItem[] = [
    {
      question: 'Do I have to pay for Zapier or Make.com to send webhooks to Google Sheets?',
      answer:
        'No! Google Sheets includes a built-in serverless runtime called Google Apps Script. By deploying the free script generated by this tool as a Web App, your spreadsheet can receive incoming HTTP POST webhooks directly with zero monthly software subscription fees.',
    },
    {
      question: 'Can this tool handle deeply nested JSON arrays and objects?',
      answer:
        'Yes. The recursive flattening algorithm traverses arbitrary JSON hierarchies, converting nested objects (e.g. data.customer.address.city) and indexed arrays into clean, tabular spreadsheet headers.',
    },
    {
      question: 'What are the free Google Apps Script execution quotas and limits?',
      answer:
        'Free Google accounts typically permit up to 20,000 URL fetch and script executions per day, with execution time limits of 6 minutes per request. For standard business webhooks (hundreds or low thousands of events daily), Google Apps Script operates reliably within free tier limits.',
    },
    {
      question: 'How do I secure my Google Apps Script webhook from spam or unauthorized posts?',
      answer:
        'You can pass a custom secret query parameter in your webhook URL (e.g. https://script.google.com/.../exec?token=YOUR_PASSPHRASE) and add a one-line if-condition in the generated doPost(e) function to verify the token before appending rows.',
    },
    {
      question: 'Is my webhook data or customer information sent to your server?',
      answer:
        'Never. 100% of JSON parsing, object flattening, column mapping, and script generation runs locally in your browser thread. No private customer records, payload samples, or API data ever touch our servers.',
    },
    {
      question: 'What happens if a webhook payload contains new fields not in my original sample?',
      answer:
        'The generated Google Apps Script maps fields dynamically based on the header array. If an incoming payload contains unmapped fields, it logs existing fields safely without crashing, and you can re-run this planner to add new column headers at any time.',
    },
    {
      question: 'Can I send webhooks from Stripe, Shopify, GitHub, and Typeform simultaneously?',
      answer:
        'Yes! You can either route multiple providers into distinct sheet tabs (by passing a sheet parameter in the script) or deploy separate Apps Script web endpoints for each provider within the same Google Spreadsheet.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Webhook to Google Sheets Data Planner & Script Generator | QUBNEXA"
      seoDescription="Free webhook to Google Sheets planner. Flatten complex JSON, map spreadsheet columns, and generate free Google Apps Script webhooks without paid subscriptions."
      keywords="webhook to google sheets, json to google sheets, google apps script webhook, zapier alternative free, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      whoShouldUse={whoShouldUse}
      problemsSolved={problemsSolved}
      bestPractices={bestPractices}
      commonMistakes={commonMistakes}
      relatedSlugs={['html-content-cleaner', 'ai-prompt-injection-scanner', 'bulk-utm-builder', 'ecommerce-vat-import-calculator']}
    >
      <WebhookToSheetsPlanner />
    </ToolPageLayout>
  )
}

export default WebhookToSheetsPlannerPage
