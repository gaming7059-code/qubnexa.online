import React, { useState, useMemo } from 'react'
import {
  FileText,
  Copy,
  Check,
  Download,
  Building2,
  TrendingUp,
  Quote,
} from 'lucide-react'

export const B2bCaseStudyGenerator: React.FC = () => {
  // 1. Client & Project Profile
  const [clientName, setClientName] = useState('FinScale Technologies')
  const [industry, setIndustry] = useState('B2B SaaS / Fintech')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [vendorName, setVendorName] = useState('Qubnexa Solutions')
  const [serviceName, setServiceName] = useState('Enterprise Cloud Workflow Automation')

  // 2. The Challenge & Situation
  const [challengeHeadline, setChallengeHeadline] = useState(
    'Manual reconciliation bottlenecks delayed monthly close by 14 days and leaked $250k in operational overhead'
  )
  const [challengeDetails, setChallengeDetails] = useState(
    'As FinScale scaled past 500,000 monthly transactions, their legacy spreadsheet workflows and fragmented billing databases could no longer keep pace. Finance teams spent over 120 engineer-hours every month manually cross-referencing ledger anomalies.'
  )

  // 3. The Solution & Deployment
  const [solutionDetails, setSolutionDetails] = useState(
    'FinScale implemented our real-time reconciliation pipeline. Integrated directly via webhook APIs in under 3 weeks, the system automated end-to-end exception matching, multi-currency conversion, and audit compliance logging without interrupting production billing.'
  )
  const [timeline, setTimeline] = useState('3 Weeks Deployment')

  // 4. Quantifiable ROI Metrics
  const [metric1Value, setMetric1Value] = useState('88%')
  const [metric1Label, setMetric1Label] = useState('Reduction in Monthly Close Time')
  const [metric2Value, setMetric2Value] = useState('$310,000')
  const [metric2Label, setMetric2Label] = useState('Annual Engineering Cost Savings')
  const [metric3Value, setMetric3Value] = useState('99.98%')
  const [metric3Label, setMetric3Label] = useState('Automated Ledger Accuracy Rate')

  // 5. Executive Quote
  const [quoteText, setQuoteText] = useState(
    'Partnering with Qubnexa transformed our financial operations. What used to take two grueling weeks now completes automatically before our morning standup.'
  )
  const [quoteAuthor, setQuoteAuthor] = useState('Elena Rostova')
  const [quoteTitle, setQuoteTitle] = useState('VP of Finance & Operations')

  // 6. View Format & UI State
  const [viewFormat, setViewFormat] = useState<'preview' | 'markdown' | 'social'>('preview')
  const [copied, setCopied] = useState(false)

  const effectiveClientName = isAnonymous ? `A Leading ${industry} Company` : clientName

  // Markdown Formatted Output
  const caseStudyMarkdown = useMemo(() => {
    return `# Case Study: How ${effectiveClientName} Achieved ${metric1Value} ${metric1Label} with ${vendorName}

**Industry:** ${industry} | **Solution:** ${serviceName} | **Timeline:** ${timeline}

---

## Executive Summary
${effectiveClientName} partnered with ${vendorName} to modernize their critical operational infrastructure. By deploying **${serviceName}**, the organization resolved long-standing transaction bottlenecks, achieved **${metric1Value} ${metric1Label}**, and generated **${metric2Value} ${metric2Label}** within the first 90 days.

---

## Key Results & ROI at a Glance

- **${metric1Value}** — ${metric1Label}
- **${metric2Value}** — ${metric2Label}
- **${metric3Value}** — ${metric3Label}

---

## The Challenge
> *"${challengeHeadline}"*

${challengeDetails}

Prior to the rollout, key friction points included:
- Severe human latency during peak volume periods.
- Expensive engineering interruptions pulled away from primary product roadmaps.
- Heightened audit risk from non-centralized data reconciliation.

---

## The Solution
To overcome these obstacles, ${effectiveClientName} selected ${vendorName}'s **${serviceName}** due to its privacy-first architecture, flexible APIs, and rapid deployment capabilities.

Key execution pillars:
1. **Rapid Zero-Downtime Migration:** Completed full integration within **${timeline}**.
2. **Deterministic Process Automation:** Eliminated brittle manual spreadsheets in favor of automated event pipelines.
3. **Continuous Real-Time Telemetry:** Enabled immediate anomaly detection and transparent executive reporting.

${solutionDetails}

---

## The Impact & Customer Testimonial

> "${quoteText}"
>
> — **${quoteAuthor}**, ${quoteTitle}, ${effectiveClientName}

By investing in scalable infrastructure, ${effectiveClientName} not only eliminated operational headaches but also freed internal teams to focus on high-margin commercial growth initiatives.

---
*Published by ${vendorName}. Case study created for commercial distribution and client sales enablement.*
`
  }, [
    effectiveClientName,
    vendorName,
    industry,
    serviceName,
    timeline,
    metric1Value,
    metric1Label,
    metric2Value,
    metric2Label,
    metric3Value,
    metric3Label,
    challengeHeadline,
    challengeDetails,
    solutionDetails,
    quoteText,
    quoteAuthor,
    quoteTitle,
  ])

  // Short LinkedIn/Social Sales Story
  const socialPost = useMemo(() => {
    return `How ${effectiveClientName} unlocked ${metric1Value} ${metric1Label} 👇

When scaling past high volume, their finance team hit a critical barrier:
"${challengeHeadline}"

The cost of inaction?
- Hundreds of wasted engineering hours
- Delayed reporting
- Revenue reconciliation blindspots

Enter ${vendorName}.

In just ${timeline}, we deployed ${serviceName}:
✅ ${metric1Value} ${metric1Label}
✅ ${metric2Value} ${metric2Label}
✅ ${metric3Value} ${metric3Label}

In the words of ${quoteAuthor} (${quoteTitle}):
"${quoteText}"

Want the same results for your organization? Send a DM or explore our customer stories.

#B2B #CaseStudy #Fintech #ROI #OperationalExcellence`
  }, [
    effectiveClientName,
    metric1Value,
    metric1Label,
    challengeHeadline,
    vendorName,
    timeline,
    serviceName,
    metric2Value,
    metric2Label,
    metric3Value,
    metric3Label,
    quoteAuthor,
    quoteTitle,
    quoteText,
  ])

  const currentContent = viewFormat === 'social' ? socialPost : caseStudyMarkdown

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
    const blob = new Blob([currentContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `case-study-${effectiveClientName.toLowerCase().replace(/\s+/g, '-')}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              B2B Case Study & Customer Success Story Generator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transform customer wins into high-converting sales assets, executive summaries, and viral social proof.
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
            onClick={() => setViewFormat('markdown')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewFormat === 'markdown'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Markdown (.md)
          </button>
          <button
            type="button"
            onClick={() => setViewFormat('social')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewFormat === 'social'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            LinkedIn Post
          </button>
        </div>
      </div>

      {/* 2. Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Client & Vendor Profile */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-500" />
              Client & Solution Details
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Client / Customer Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Anonymous Mode (e.g. "A Leading B2B SaaS Company")
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Industry / Vertical
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Your Company / Brand
                  </label>
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Solution Name
                  </label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Timeline
                  </label>
                  <input
                    type="text"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Core Challenge / Bottleneck Headline
                </label>
                <input
                  type="text"
                  value={challengeHeadline}
                  onChange={(e) => setChallengeHeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Challenge Background & Pain Points
                </label>
                <textarea
                  rows={2}
                  value={challengeDetails}
                  onChange={(e) => setChallengeDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Solution Deployment Details
                </label>
                <textarea
                  rows={2}
                  value={solutionDetails}
                  onChange={(e) => setSolutionDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Quantifiable ROI Metrics */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Quantifiable ROI Metrics
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={metric1Value}
                  onChange={(e) => setMetric1Value(e.target.value)}
                  placeholder="+145%"
                  className="px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold text-center"
                />
                <input
                  type="text"
                  value={metric1Label}
                  onChange={(e) => setMetric1Label(e.target.value)}
                  placeholder="Metric description"
                  className="col-span-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={metric2Value}
                  onChange={(e) => setMetric2Value(e.target.value)}
                  placeholder="$310k"
                  className="px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold text-center"
                />
                <input
                  type="text"
                  value={metric2Label}
                  onChange={(e) => setMetric2Label(e.target.value)}
                  placeholder="Metric description"
                  className="col-span-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={metric3Value}
                  onChange={(e) => setMetric3Value(e.target.value)}
                  placeholder="99.9%"
                  className="px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold text-center"
                />
                <input
                  type="text"
                  value={metric3Label}
                  onChange={(e) => setMetric3Label(e.target.value)}
                  placeholder="Metric description"
                  className="col-span-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Quote className="h-4 w-4 text-purple-500" />
              Executive Quote & Champion
            </h3>

            <div className="space-y-2.5">
              <textarea
                rows={3}
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                placeholder="Direct quotation from the client stakeholder..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={quoteAuthor}
                  onChange={(e) => setQuoteAuthor(e.target.value)}
                  placeholder="Leader Name"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
                <input
                  type="text"
                  value={quoteTitle}
                  onChange={(e) => setQuoteTitle(e.target.value)}
                  placeholder="Job Title"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Generated Case Study Asset
                </h3>
                <p className="text-xs text-slate-400">
                  Ready for sales decks, marketing collateral, or LinkedIn outreach.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy Content'}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download .md
                </button>
              </div>
            </div>

            {/* Visual Preview Mode */}
            {viewFormat === 'preview' ? (
              <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-h-[640px] overflow-y-auto space-y-6">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Customer Success Story • {industry}
                  </span>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    How {effectiveClientName} Achieved {metric1Value} {metric1Label} with {vendorName}
                  </h1>
                </div>

                {/* KPI Metrics Highlight Bar */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
                      {metric1Value}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{metric1Label}</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {metric2Value}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{metric2Label}</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">
                      {metric3Value}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{metric3Label}</div>
                  </div>
                </div>

                {/* Challenge Section */}
                <div className="space-y-2 text-xs">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">The Challenge</h3>
                  <p className="text-slate-600 dark:text-slate-400 italic font-medium bg-amber-50/60 dark:bg-amber-950/20 p-3 rounded-lg border-l-4 border-amber-500">
                    "{challengeHeadline}"
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{challengeDetails}</p>
                </div>

                {/* Solution Section */}
                <div className="space-y-2 text-xs">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">The Solution & Impact</h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{solutionDetails}</p>
                </div>

                {/* Quote Box */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <Quote className="h-5 w-5 text-blue-500" />
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic">"{quoteText}"</p>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    {quoteAuthor} — <span className="text-slate-400 font-normal">{quoteTitle}, {effectiveClientName}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-h-[640px] overflow-y-auto text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap select-all">
                {currentContent}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default B2bCaseStudyGenerator
