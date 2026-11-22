import React, { useState, useMemo } from 'react'
import {
  Copy,
  Check,
  Download,
  Globe,
  Sliders,
  HelpCircle,
  Building2,
  Scale,
} from 'lucide-react'

export const PrivacyPolicyGenerator: React.FC = () => {
  // 1. General Profile
  const [siteName, setSiteName] = useState('My Awesome App')
  const [siteUrl, setSiteUrl] = useState('https://example.com')
  const [companyName, setCompanyName] = useState('Acme Inc.')
  const [contactEmail, setContactEmail] = useState('support@example.com')
  const [jurisdiction, setJurisdiction] = useState('United States & European Union (GDPR / CCPA)')

  // 2. Data Types Collected
  const [collectsName, setCollectsName] = useState(true)
  const [collectsEmail, setCollectsEmail] = useState(true)
  const [collectsPhone, setCollectsPhone] = useState(false)
  const [collectsAddress, setCollectsAddress] = useState(false)
  const [collectsPayment, setCollectsPayment] = useState(true)
  const [collectsIpAddress, setCollectsIpAddress] = useState(true)

  // 3. Cookies & Tracking
  const [usesCookies, setUsesCookies] = useState(true)
  const [usesGoogleAnalytics, setUsesGoogleAnalytics] = useState(true)
  const [usesMarketingPixels, setUsesMarketingPixels] = useState(false)

  // 4. Third-party processors
  const [hasPaymentProcessors, setHasPaymentProcessors] = useState(true)
  const [hasCloudHosting, setHasCloudHosting] = useState(true)
  const [hasEmailService, setHasEmailService] = useState(true)

  // 5. Compliance frameworks
  const [includeGdpr, setIncludeGdpr] = useState(true)
  const [includeCcpa, setIncludeCcpa] = useState(true)
  const [includeCoppa, setIncludeCoppa] = useState(true)

  // 6. UI state
  const [viewFormat, setViewFormat] = useState<'preview' | 'html' | 'markdown'>('preview')
  const [copied, setCopied] = useState(false)

  const effectiveDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }, [])

  // Generated Text Template
  const policyMarkdown = useMemo(() => {
    const dataList: string[] = []
    if (collectsName) dataList.push('- Name and contact credentials')
    if (collectsEmail) dataList.push('- Email address')
    if (collectsPhone) dataList.push('- Phone number')
    if (collectsAddress) dataList.push('- Billing and physical shipping address')
    if (collectsPayment) dataList.push('- Payment and transaction data (processed securely via PCI-compliant payment gateways)')
    if (collectsIpAddress) dataList.push('- IP address, browser type, device identifiers, and operating system telemetry')

    return `# Privacy Policy for ${siteName}

**Last Updated & Effective Date:** ${effectiveDate}

This Privacy Policy describes how **${companyName}** ("we", "us", or "our"), operating the website and services at **[${siteUrl}](${siteUrl})** (the "Service"), collects, uses, protects, and discloses your personal information.

By accessing or using our Service, you signify that you have read, understood, and agree to the collection and use of your information in accordance with this Privacy Policy.

---

## 1. Information We Collect

We collect information that you directly provide to us, as well as data gathered automatically when you navigate and interact with our Service:

### Personal Information You Provide Directly:
${dataList.length > 0 ? dataList.join('\n') : '- No sensitive personal information is actively requested from casual visitors.'}

${
  usesCookies
    ? `### Automatically Collected Log and Device Data:
When you browse the Service, our servers automatically log standard network metadata including your Internet Protocol (IP) address, browser version, pages visited, time and date of visits, and referring URLs.`
    : ''
}

---

## 2. How We Use Your Information

We use the collected information for specific, legitimate business purposes, including:
- Operating, maintaining, and improving our Service features.
- Processing your transactions, orders, and subscriptions safely.
- Sending transactional updates, service notices, and customer support communications.
- Detecting, investigating, and preventing fraudulent activities or security incidents.
- Complying with applicable legal, accounting, and regulatory obligations.

---

## 3. Third-Party Service Providers & Data Processors

We do not sell, rent, or trade your personal information. We may share limited data with trusted third-party service providers who assist us in operating our platform under strict confidentiality agreements:

${hasCloudHosting ? '- **Cloud Hosting & Infrastructure:** To securely store data and host website applications.' : ''}
${hasPaymentProcessors ? '- **Payment Gateways:** To process encrypted payment transactions without storing raw card numbers on our servers.' : ''}
${hasEmailService ? '- **Email Communications:** To deliver transactional notices and service messages.' : ''}
${usesGoogleAnalytics ? '- **Web Analytics (e.g. Google Analytics):** To analyze aggregate usage metrics and enhance user experience.' : ''}
${usesMarketingPixels ? '- **Advertising & Marketing Networks:** To measure campaign performance and deliver relevant promotions.' : ''}

---

## 4. Cookies and Tracking Technologies

${
  usesCookies
    ? `Our Service uses cookies and similar browser storage mechanisms (session cookies, persistent cookies, and local storage) to maintain user preferences, ensure site security, and analyze performance. You may configure your web browser to refuse all cookies or notify you when a cookie is sent; however, disabling essential cookies may impact certain platform functions.`
    : `Our Service does not rely on invasive tracking cookies for standard browsing.`
}

---

${
  includeGdpr
    ? `## 5. Your Rights Under General Data Protection Regulation (GDPR)

If you are a resident of the European Economic Area (EEA) or United Kingdom, you hold specific statutory data protection rights under the GDPR:
- **Right to Access:** Request copies of your personal data held by us.
- **Right to Rectification:** Request corrections of inaccurate or incomplete information.
- **Right to Erasure ("Right to be Forgotten"):** Request deletion of your personal data under certain conditions.
- **Right to Restrict Processing:** Request limitation of data processing under statutory grounds.
- **Right to Data Portability:** Receive your information in a structured, machine-readable format.
- **Right to Withdraw Consent:** Revoke previously granted consent at any time without retroactive penalties.

To exercise any of these rights, please contact our data team at **${contactEmail}**.`
    : ''
}

${
  includeCcpa
    ? `## 6. California Consumer Privacy Rights (CCPA / CPRA)

Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents are entitled to:
- Know what categories of personal information are collected and shared.
- Request deletion of personal information collected from them.
- Opt-out of the "sale" or "sharing" of personal information. **We do not sell your personal data.**
- Non-discrimination for exercising your statutory privacy rights.

Inquiries may be submitted via email to **${contactEmail}**.`
    : ''
}

${
  includeCoppa
    ? `## 7. Children's Online Privacy Protection (COPPA)

Our Service is not directed to individuals under the age of 13 (or under 16 in the European Union). We do not knowingly collect personal data from children. If you become aware that a child has provided us with personal information without parental verification, please contact us immediately so we can purge such records.`
    : ''
}

---

## 8. Data Security & Storage

We employ industry-standard technical and organizational security measures—including TLS/SSL cryptographic encryption, access control policies, and regular monitoring—to protect your personal information against unauthorized disclosure, loss, or alteration.

---

## 9. Contact Us

If you have questions, feedback, or requests regarding this Privacy Policy, please contact our privacy compliance team:

- **Company:** ${companyName}
- **Website:** [${siteUrl}](${siteUrl})
- **Email:** ${contactEmail}
- **Jurisdiction:** ${jurisdiction}
`
  }, [
    siteName,
    siteUrl,
    companyName,
    contactEmail,
    jurisdiction,
    effectiveDate,
    collectsName,
    collectsEmail,
    collectsPhone,
    collectsAddress,
    collectsPayment,
    collectsIpAddress,
    usesCookies,
    usesGoogleAnalytics,
    usesMarketingPixels,
    hasPaymentProcessors,
    hasCloudHosting,
    hasEmailService,
    includeGdpr,
    includeCcpa,
    includeCoppa,
  ])

  // HTML Formatted Output
  const policyHtml = useMemo(() => {
    return `<div class="privacy-policy-container" style="max-width:800px;margin:0 auto;font-family:sans-serif;line-height:1.6;color:#333;">
${policyMarkdown
  .replace(/^# (.*$)/gim, '<h1 style="color:#111;font-size:28px;margin-bottom:8px;">$1</h1>')
  .replace(/^## (.*$)/gim, '<h2 style="color:#222;font-size:20px;margin-top:24px;border-bottom:1px solid #eee;padding-bottom:6px;">$1</h2>')
  .replace(/^### (.*$)/gim, '<h3 style="color:#333;font-size:16px;margin-top:16px;">$1</h3>')
  .replace(/^\*\*([^*]+)\*\*/gim, '<strong>$1</strong>')
  .replace(/\n\n/g, '</p><p>')
  .replace(/^- (.*$)/gim, '<li>$1</li>')}
</div>`
  }, [policyMarkdown])

  const currentContent = viewFormat === 'html' ? policyHtml : policyMarkdown

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const handleDownload = () => {
    const ext = viewFormat === 'html' ? 'html' : 'md'
    const blob = new Blob([currentContent], {
      type: viewFormat === 'html' ? 'text/html' : 'text/markdown',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `privacy-policy-${siteName.toLowerCase().replace(/\s+/g, '-')}.${ext}`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Privacy Policy & Cookie Compliance Generator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate a legally informed, customizable privacy policy draft supporting GDPR, CCPA/CPRA, and COPPA standards.
            </p>
          </div>
        </div>

        {/* View Format Selector */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewFormat('preview')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewFormat === 'preview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Formatted Preview
          </button>
          <button
            type="button"
            onClick={() => setViewFormat('html')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewFormat === 'html'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            HTML Code
          </button>
          <button
            type="button"
            onClick={() => setViewFormat('markdown')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewFormat === 'markdown'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Markdown (.md)
          </button>
        </div>
      </div>

      {/* 2. Main Config Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Options (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* General Information */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-500" />
              Website & Entity Details
            </h3>

            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Website / App Name
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Legal Entity / Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Privacy Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Jurisdiction & Governing Law
                </label>
                <input
                  type="text"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Data Collected Checkboxes */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-purple-500" />
              Types of Data Collected
            </h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={collectsName}
                  onChange={(e) => setCollectsName(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                User Full Name & Credentials
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={collectsEmail}
                  onChange={(e) => setCollectsEmail(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Email Address
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={collectsPhone}
                  onChange={(e) => setCollectsPhone(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Phone Number
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={collectsAddress}
                  onChange={(e) => setCollectsAddress(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Physical / Shipping Address
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={collectsPayment}
                  onChange={(e) => setCollectsPayment(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Payment / Billing Information (Stripe, PayPal)
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={collectsIpAddress}
                  onChange={(e) => setCollectsIpAddress(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                IP Address & Device Logs
              </label>
            </div>
          </div>

          {/* Cookies & Third Parties */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-500" />
              Cookies & Service Providers
            </h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={usesCookies}
                  onChange={(e) => setUsesCookies(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Uses Cookies / Browser Local Storage
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={usesGoogleAnalytics}
                  onChange={(e) => setUsesGoogleAnalytics(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Web Analytics (Google Analytics, PostHog, Plausible)
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={usesMarketingPixels}
                  onChange={(e) => setUsesMarketingPixels(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Advertising Pixels (Meta Pixel, Google Ads)
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={hasCloudHosting}
                  onChange={(e) => setHasCloudHosting(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Cloud Hosting Infrastructure (AWS, Vercel, Cloudflare)
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={hasPaymentProcessors}
                  onChange={(e) => setHasPaymentProcessors(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Third-Party Payment Gateways (Stripe, PayPal)
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={hasEmailService}
                  onChange={(e) => setHasEmailService(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Transactional Email Services (Mailchimp, Resend)
              </label>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeGdpr}
                    onChange={(e) => setIncludeGdpr(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  Include European GDPR Consumer Rights Clause
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeCcpa}
                    onChange={(e) => setIncludeCcpa(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  Include California CCPA / CPRA Consumer Rights Clause
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeCoppa}
                    onChange={(e) => setIncludeCoppa(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  Include Children's Online Privacy (COPPA) Protection
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Generated Privacy Policy Draft
                </h3>
                <p className="text-xs text-slate-400">
                  Instant preview and code export ready for deployment.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download .{viewFormat === 'html' ? 'html' : 'md'}
                </button>
              </div>
            </div>

            {/* Content Display */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-h-[640px] overflow-y-auto text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono">
              {viewFormat === 'preview' ? (
                <div className="font-sans space-y-4">
                  {policyMarkdown.split('\n\n').map((para, i) => {
                    if (para.startsWith('# ')) {
                      return (
                        <h1 key={i} className="text-lg font-bold text-slate-900 dark:text-white border-b pb-2">
                          {para.replace('# ', '')}
                        </h1>
                      )
                    }
                    if (para.startsWith('## ')) {
                      return (
                        <h2 key={i} className="text-base font-bold text-slate-900 dark:text-white pt-2 border-b pb-1">
                          {para.replace('## ', '')}
                        </h2>
                      )
                    }
                    if (para.startsWith('### ')) {
                      return (
                        <h3 key={i} className="text-sm font-semibold text-slate-800 dark:text-slate-200 pt-1">
                          {para.replace('### ', '')}
                        </h3>
                      )
                    }
                    return (
                      <p key={i} className="text-slate-700 dark:text-slate-300">
                        {para}
                      </p>
                    )
                  })}
                </div>
              ) : (
                <pre className="whitespace-pre-wrap break-all">{currentContent}</pre>
              )}
            </div>
          </div>

          {/* Legal Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#050814] border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
            <HelpCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong>Disclaimer:</strong> This generator produces a standard reference draft based on common compliance frameworks (GDPR, CCPA, COPPA). It does not substitute for licensed legal counsel tailored to your specific commercial operations or cross-border data transfer mechanisms.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyGenerator
