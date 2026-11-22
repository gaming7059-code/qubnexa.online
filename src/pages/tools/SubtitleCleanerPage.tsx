import React from 'react'
import { ToolPageLayout, type FAQItem, type FormulaItem, type ExampleItem } from '../../components/layout/ToolPageLayout'
import SubtitleCleaner from '../../tools/SubtitleCleaner/SubtitleCleaner'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const SubtitleCleanerPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'subtitle-cleaner') || {
    id: 'subtitle-cleaner',
    name: 'SRT & VTT Subtitle Cleaner & Text Extractor',
    slug: 'subtitle-cleaner',
    path: '/tools/subtitle-cleaner',
    description:
      'Strip timestamps, cue markers, sound effect brackets, and speaker tags from SRT and VTT subtitles to produce clean readable transcripts or re-synced video captions.',
    categoryId: 'utilities',
    categoryIds: ['utilities', 'image-tools'],
    categoryName: 'General Utilities',
    icon: 'AlignLeft',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    isFunctional: true,
    keywords: [
      'subtitle cleaner',
      'srt to text converter',
      'remove timestamps from srt',
      'vtt to txt cleaner',
      'strip sound effects subtitles',
      'subtitle resync tool',
      'qubnexa',
    ],
  }

  const howToUseSteps = [
    'Paste or Upload Subtitle File: Import any .srt or .vtt file, or paste raw subtitle text into the editor.',
    'Select Cleaning Rules: Toggle off timestamps (00:01:23,000 --> 00:01:25,000), sequence indices, bracketed sound cues ([Laughter], (Applause)), speaker labels, and HTML tags.',
    'Deduplicate and Flow: Enable duplicate removal to eliminate repetitive lines typical of auto-generated YouTube captions, or merge into continuous reading paragraphs.',
    'Time Offset Adjustment (Optional): If preserving timestamps, adjust the time-shift slider to delay or advance all subtitle cues by fractions of a second to fix out-of-sync audio.',
    'Copy or Download: One-click copy the clean plain text to your clipboard or download a cleaned .txt or .srt file.',
  ]

  const formulas: FormulaItem[] = [
    {
      title: 'SRT Timestamp Parsing Regex',
      formula: 'Pattern = /^\\d{2}:\\d{2}:\\d{2}[,.]\\d{3}\\s*-->\\s*\\d{2}:\\d{2}:\\d{2}[,.]\\d{3}$/',
      explanation:
        'Standard SubRip (SRT) and WebVTT (VTT) timing arrow delimiter syntax. Accurately matched to strip or calculate time offset shifts.',
    },
    {
      title: 'Hearing Impaired Sound Cue Stripping',
      formula: 'SanitizedText = Raw.replace(/\\[[^\\]]*\\]/g, "").replace(/\\([^)]*\\)/g, "")',
      explanation:
        'Removes parenthetical and bracketed ambient sound cues ([music], [laughter], (applause)) for cleaner written article transcripts.',
    },
  ]

  const examples: ExampleItem[] = [
    {
      title: 'Convert YouTube Auto-Generated Captions into a Blog Post',
      description: 'A video creator downloads auto-generated video captions cluttered with numbers and repetitive timestamps.',
      input: 'Cluttered 1,200-line SRT file with line numbers and [Music playing] cues.',
      output: 'Produces a cohesive, readable 1,800-word essay transcript with zero timestamps, ready for publication as an article.',
    },
    {
      title: 'Re-Syncing Subtitles Delayed by 2.5 Seconds',
      description: 'A foreign film subtitle track appears 2.5 seconds too early.',
      input: 'Keep timestamps enabled, apply +2.5s time shift slider.',
      output: 'Outputs re-calculated SRT timestamps synchronized with audio tracks.',
    },
  ]

  const faqs: FAQItem[] = [
    {
      question: 'Does this tool support both SRT and VTT formats?',
      answer:
        'Yes! The cleaner supports SubRip (.srt), WebVTT (.vtt), and generic subtitle transcripts with automatic header detection.',
    },
    {
      question: 'Can I re-sync an entire subtitle file without losing timing?',
      answer:
        'Yes. Keep "Remove Timestamps" unchecked and use the Time Shift slider to advance or delay every timestamp in the file by up to +/- 10 seconds.',
    },
    {
      question: 'Are my video scripts or subtitles uploaded to a server?',
      answer:
        'Never. 100% of text parsing, regex stripping, and file downloads execute inside your web browser. No text is transmitted or logged.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="SRT & VTT Subtitle Cleaner & Text Extractor | QUBNEXA"
      seoDescription="Free online subtitle cleaner. Strip timestamps, sound effect brackets, and speaker tags from SRT and VTT subtitles to produce clean readable transcripts."
      keywords="subtitle cleaner, srt to text, remove timestamps srt, vtt cleaner, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['podcast-content-repurposer', 'html-content-cleaner', 'ai-prompt-injection-scanner', 'social-video-safe-zone-preview']}
    >
      <SubtitleCleaner />
    </ToolPageLayout>
  )
}

export default SubtitleCleanerPage
