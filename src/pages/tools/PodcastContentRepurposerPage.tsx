import React from 'react'
import { ToolPageLayout, type FAQItem, type FormulaItem, type ExampleItem } from '../../components/layout/ToolPageLayout'
import PodcastContentRepurposer from '../../tools/PodcastContentRepurposer/PodcastContentRepurposer'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const PodcastContentRepurposerPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'podcast-content-repurposer') || {
    id: 'podcast-content-repurposer',
    name: 'Podcast to Multi-Channel Social Content Planner',
    slug: 'podcast-content-repurposer',
    path: '/tools/podcast-content-repurposer',
    description:
      'Transform single podcast episodes and audio transcripts into SEO show notes, YouTube timestamps, short-form video hooks, Twitter threads, LinkedIn stories, and email newsletters.',
    categoryId: 'audio-tools',
    categoryIds: ['audio-tools', 'text-writing'],
    categoryName: 'Marketing & SEO',
    icon: 'Mic',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    isFunctional: true,
    keywords: [
      'podcast content repurposer',
      'podcast to social media planner',
      'show notes generator',
      'youtube timestamps generator',
      'podcast video hooks',
      'podcast to twitter thread',
      'qubnexa',
    ],
  }

  const howToUseSteps = [
    'Enter Episode Information: Specify your episode title, episode number, podcast host name, and guest credentials.',
    'Paste Key Discussion Points & Quotes: Enter raw conversation highlights, interview outlines, or transcript snippets.',
    'Switch Repurposed Asset Views: Explore automatically formatted Show Notes, YouTube/Spotify chapter timestamps, short-form vertical video hook scripts (for TikTok/Reels/Shorts), a 7-part viral Twitter/X thread, an executive LinkedIn story, and an email newsletter summary.',
    'Copy Assets Individually: One-click copy any active tab to paste directly into your social schedulers (Buffer, Hootsuite, Typefully) or podcast hosting feeds (Transistor, Spotify for Podcasters, Libsyn).',
    'Download Complete Bundle: Click "Download All Repurposed Assets" to export a unified Markdown document containing the complete promotional campaign.',
  ]

  const formulas: FormulaItem[] = [
    {
      title: 'Content Multiplier Leverage Ratio',
      formula: 'Repurposing Output Ratio = 1 Core Episode → 6 Derivative Channels (Notes + Timestamps + Hooks + Threads + LinkedIn + Newsletter)',
      explanation:
        'Maximizes audio production return-on-time. Recording a 45-minute episode generates a full week of multi-channel organic distribution without incremental recording time.',
    },
    {
      title: 'Short-Form Hook Retention Framework',
      formula: 'Hook Retention = Contrarian Proposition (0-3s) + Core Stakeholder Proof (4-15s) + Value Bridge (16-45s)',
      explanation:
        'Vertical video algorithms reward fast pattern interrupts within the first 3 seconds to keep viewer retention above 75% across TikTok, Instagram Reels, and YouTube Shorts.',
    },
  ]

  const examples: ExampleItem[] = [
    {
      title: 'Bootstrapped Founder Growth Interview',
      description: 'A podcast host records an episode with a SaaS founder who grew to $100k MRR without funding.',
      input: 'Title: "How Bootstrapped AI Tools Scale" | Guest: Alex Rivera | 6 outline points pasted.',
      output: 'Generates structured show notes, 7 timestamped chapters, 3 video hook scripts, a 7-tweet viral thread, a LinkedIn post, and a newsletter blurb in seconds.',
    },
    {
      title: 'Solo Podcast Commentary Episode',
      description: 'A creator records a 20-minute solo analysis of new search engine ranking factors.',
      input: 'Solo format with bulleted takeaways.',
      output: 'Creates a concise executive newsletter and vertical video hooks ready for Instagram Reels.',
    },
  ]

  const faqs: FAQItem[] = [
    {
      question: 'Do I need a paid AI API key or OpenAI subscription to use this tool?',
      answer:
        'No! The tool uses fast, privacy-first procedural formatting templates directly in your web browser. No API accounts or subscriptions are required.',
    },
    {
      question: 'Are my unpublished podcast transcripts or guest details saved anywhere?',
      answer:
        'No. 100% of formatting and text generation executes client-side. No notes, transcripts, or unreleased episode titles are transmitted or logged on any server.',
    },
    {
      question: 'Can I customize the timestamps for my specific recording lengths?',
      answer:
        'Yes. You can edit the text directly or copy the generated chapter template and adjust the minute and second markers to match your exact audio editing timeline.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Podcast to Multi-Channel Social Content Planner | QUBNEXA"
      seoDescription="Free podcast content repurposing planner. Turn podcast transcripts into show notes, YouTube timestamps, TikTok video hooks, Twitter threads, and LinkedIn posts."
      keywords="podcast content repurposer, show notes generator, podcast timestamps, viral video hooks, podcast to linkedin, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['b2b-case-study-generator', 'social-video-safe-zone-preview', 'bulk-utm-builder', 'subtitle-cleaner']}
    >
      <PodcastContentRepurposer />
    </ToolPageLayout>
  )
}

export default PodcastContentRepurposerPage
