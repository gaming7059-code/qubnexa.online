import React, { useState, useMemo } from 'react'
import {
  Mic,
  Copy,
  Check,
  Download,
  Video,
  Share2,
  Sparkles,
  Mail,
  Clock,
  FileText,
} from 'lucide-react'

export const PodcastContentRepurposer: React.FC = () => {
  // 1. Episode Details
  const [episodeTitle, setEpisodeTitle] = useState(
    'How Bootstrapped AI Tools Scale to $100k MRR Without Venture Capital'
  )
  const [guestName, setGuestName] = useState('Alex Rivera')
  const [guestTitle, setGuestTitle] = useState('Founder of PromptForge')
  const [episodeNumber, setEpisodeNumber] = useState('42')
  const [hostName, setHostName] = useState('Sarah Chen')

  // 2. Core Discussion Points / Transcript Notes
  const [rawNotes, setRawNotes] = useState(
    `Key conversation points:
- Alex bootstrapped PromptForge from a weekend prototype to $100k MRR in 14 months.
- The biggest mistake founders make: spending 6 months building before testing distribution.
- His exact customer acquisition channel: micro-influencers on X and open-source GitHub utilities.
- Organic SEO playbook: programmatic landing pages for specific developer workflows.
- How to price AI tools: switch from per-seat to usage-based value pricing early.
- Final advice: "The best product doesn't win; the fastest learner with direct distribution wins."`
  )

  // 3. UI State
  const [activeTab, setActiveTab] = useState<
    'shownotes' | 'timestamps' | 'hooks' | 'twitter' | 'linkedin' | 'newsletter'
  >('shownotes')
  const [copied, setCopied] = useState(false)

  // Asset 1: Show Notes & Summary
  const showNotes = useMemo(() => {
    return `# Episode #${episodeNumber}: ${episodeTitle}

**Host:** ${hostName} | **Featured Guest:** ${guestName} (${guestTitle})

---

## 🎙️ Episode Overview
In this deep-dive conversation, ${guestName} joins ${hostName} to unpack the real, unfiltered mechanics of scaling a modern technology product without outside venture capital. Discover the distribution-first frameworks, pricing transitions, and engineering shortcuts that transformed an idea into a category leader.

---

## 💡 What You'll Learn in This Episode:
- The critical inflection point: when to transition from building to aggressive distribution.
- How to leverage open-source tools and developer micro-influencers for zero-dollar CAC.
- Why per-seat pricing often caps revenue, and how to implement value-aligned pricing tiers.
- Pragmatic approaches to customer retention in high-churn software landscapes.
- ${guestName}'s personal productivity principles when managing engineering and marketing simultaneously.

---

## 🔗 Connect with ${guestName}:
- Follow on Twitter/X: @${guestName.toLowerCase().replace(/\s+/g, '')}
- Official Website: https://qubnexa.online

---
*Enjoyed this episode? Don't forget to subscribe, leave a 5-star review, and share with fellow builders!*`
  }, [episodeTitle, guestName, guestTitle, episodeNumber, hostName])

  // Asset 2: Timestamps / Chapters
  const timestamps = useMemo(() => {
    return `00:00 - Introduction & Welcome to Episode #${episodeNumber}
02:15 - Meet ${guestName}: From Weekend Hackathon to Market Leader
06:40 - The "Distribution First" Reality Check for Builders
14:10 - Zero-Dollar Customer Acquisition Playbook on X and GitHub
22:30 - Pricing Architecture: Why Usage-Based Pricing Beats Per-Seat
31:45 - Navigating Early Churn and Customer Feedback Loops
41:10 - Lightning Round & Final Advice for Founders
48:30 - Where to Connect with ${guestName} & Episode Wrap-up`
  }, [episodeNumber, guestName])

  // Asset 3: Short-Form Video Hooks (TikTok / Shorts / Reels)
  const videoHooks = useMemo(() => {
    return `🎬 Short-Form Video Scripts & Hook Frameworks (TikTok / Reels / Shorts)

---
HOOK #1: The Contrarian Reality
[Camera: Punchy close-up | Text on screen: "Stop building your SaaS product."]
Speaker: "If you're spending 6 months building an app before testing distribution, you've already lost. Here is what ${guestName} did instead to hit $100k MRR..."

---
HOOK #2: The Hidden Cost of Bad Pricing
[Camera: Medium shot | Text on screen: "Why your pricing is capping your growth"]
Speaker: "Most founders price per-seat because everyone else does. But when ${guestName} switched to value-based metrics, revenue instantly surged..."

---
HOOK #3: The Zero-Dollar CAC Playbook
[Camera: Fast zoom | Text on screen: "$0 Ad Spend Playbook"]
Speaker: "Here is the exact 3-step distribution playbook ${guestName} used to acquire their first 10,000 users without spending a single dollar on paid ads..."`
  }, [guestName])

  // Asset 4: Viral Twitter / X Thread
  const twitterThread = useMemo(() => {
    return `1/7 Most software founders spend 6 months building before they even validate if anyone wants to buy.

In Episode #${episodeNumber} of our show, @${guestName.toLowerCase().replace(/\s+/g, '')} revealed how they hit $100k MRR by doing the exact opposite.

Here are the 5 biggest takeaways: 🧵👇

2/7 Lesson 1: Distribution Eats Product for Breakfast
The market is full of superior engineering that died in obscurity. Your primary job in month one isn't perfection; it's proving that strangers will pay for the core outcome.

3/7 Lesson 2: Open Source as a Lead Magnet
Instead of paying Meta or Google for ads, create lightweight, useful developer utilities. Let developers experience immediate value, and enterprise upgrades will follow naturally.

4/7 Lesson 3: The Pricing Shift
Per-seat pricing punished their most engaged teams. Moving to usage and outcome-based pricing instantly doubled customer lifetime value (LTV).

5/7 Lesson 4: Micro-Communities over Mega-Influencers
Find the 10 people in your niche whose recommendations everyone trusts. A single authentic mention from a respected creator beats $10k in generic banner ads.

6/7 Lesson 5: Speed of Iteration
"The best product rarely wins; the fastest learner with direct distribution always wins."

7/7 Catch the full unedited conversation with ${guestName} on Episode #${episodeNumber}:
Listen here: https://qubnexa.online/tools

RT the first tweet if this was valuable! 🔁`
  }, [episodeNumber, guestName])

  // Asset 5: LinkedIn Thought Leadership Post
  const linkedinPost = useMemo(() => {
    return `Building a great product is no longer enough.

I recently sat down with ${guestName} (${guestTitle}) for Episode #${episodeNumber} of our show, and one quote stuck with me:

"The best product rarely wins. The fastest learner with direct distribution always wins."

Here were our 3 biggest takeaways on scaling sustainably in 2026:

1. Test distribution before code: If you cannot find 5 strangers willing to pre-commit or join a waitlist from a simple prototype, coding 10,000 lines of features won't fix the underlying demand gap.

2. Price on value, not arbitrary seats: When pricing aligns directly with the business outcome you deliver, enterprise contracts close faster with minimal negotiation friction.

3. Build transparently: High-growth teams leverage authentic developer discussions, transparent retrospectives, and customer feedback to earn long-term loyalty.

What's the best business insight you've heard recently?

Full episode link in the comments below! 👇

#Podcasting #Founders #SaaS #GrowthStrategy #Leadership`
  }, [guestName, guestTitle, episodeNumber])

  // Asset 6: Email Newsletter Blurb
  const newsletterBlurb = useMemo(() => {
    return `Subject: How ${guestName} scaled without spending on ads 🚀

Hey reader,

Most founders believe you need either millions in venture backing or a massive marketing budget to break out in tech today.

On this week's episode, ${guestName} proved that conventional wisdom wrong.

We broke down:
• How they reached $100k MRR in 14 months.
• The exact distribution channels that actually converted.
• Why pricing for outcomes fundamentally changes your cash flow.

If you're building a project or looking for actionable growth playbooks, this is one episode you don't want to skip.

👉 Listen to Episode #${episodeNumber} here: https://qubnexa.online

Best,
${hostName}`
  }, [guestName, hostName, episodeNumber])

  // Current active text based on tab
  const currentContent = useMemo(() => {
    switch (activeTab) {
      case 'shownotes':
        return showNotes
      case 'timestamps':
        return timestamps
      case 'hooks':
        return videoHooks
      case 'twitter':
        return twitterThread
      case 'linkedin':
        return linkedinPost
      case 'newsletter':
        return newsletterBlurb
      default:
        return showNotes
    }
  }, [activeTab, showNotes, timestamps, videoHooks, twitterThread, linkedinPost, newsletterBlurb])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const handleDownloadAll = () => {
    const fullBundle = `# Complete Repurposed Content Bundle for Episode #${episodeNumber}
Generated via QUBNEXA Podcast to Social Content Planner

==================================================
SHOW NOTES:
==================================================
${showNotes}

==================================================
TIMESTAMPS:
==================================================
${timestamps}

==================================================
VIDEO HOOKS:
==================================================
${videoHooks}

==================================================
TWITTER / X THREAD:
==================================================
${twitterThread}

==================================================
LINKEDIN POST:
==================================================
${linkedinPost}

==================================================
EMAIL NEWSLETTER:
==================================================
${newsletterBlurb}
`
    const blob = new Blob([fullBundle], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `podcast-bundle-ep${episodeNumber}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-500">
            <Mic className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Podcast to Multi-Channel Social Content Planner
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transform single podcast episodes into show notes, timestamps, video hooks, Twitter threads, LinkedIn stories, and newsletters.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadAll}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all self-start md:self-auto"
        >
          <Download className="h-4 w-4" />
          Download All Repurposed Assets (.md)
        </button>
      </div>

      {/* 2. Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Episode Metadata & Host Details
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Episode Title
                </label>
                <input
                  type="text"
                  value={episodeTitle}
                  onChange={(e) => setEpisodeTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Episode #
                  </label>
                  <input
                    type="text"
                    value={episodeNumber}
                    onChange={(e) => setEpisodeNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs text-center"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Host Name
                  </label>
                  <input
                    type="text"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Guest Title / Credential
                  </label>
                  <input
                    type="text"
                    value={guestTitle}
                    onChange={(e) => setGuestTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Transcript / Conversation Notes */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              Key Conversation Bullet Points & Quotes
            </h3>

            <textarea
              rows={8}
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder="Paste raw transcript excerpts, outline notes, or standout quotes..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all leading-relaxed"
            />
          </div>
        </div>

        {/* Right Output Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            {/* Asset Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveTab('shownotes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    activeTab === 'shownotes'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" /> Show Notes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('timestamps')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    activeTab === 'timestamps'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Clock className="h-3.5 w-3.5" /> Timestamps
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('hooks')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    activeTab === 'hooks'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Video className="h-3.5 w-3.5" /> Video Hooks
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('twitter')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    activeTab === 'twitter'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Share2 className="h-3.5 w-3.5" /> X Thread
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('linkedin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    activeTab === 'linkedin'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" /> LinkedIn
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('newsletter')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    activeTab === 'newsletter'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Mail className="h-3.5 w-3.5" /> Newsletter
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy Active Tab'}
              </button>
            </div>

            {/* Display Area */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-h-[640px] overflow-y-auto text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap select-all leading-relaxed">
              {currentContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PodcastContentRepurposer
