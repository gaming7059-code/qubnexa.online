import React from 'react'
import { ToolPageLayout, type FAQItem, type FormulaItem, type ExampleItem } from '../../components/layout/ToolPageLayout'
import ImageBackgroundExtender from '../../tools/ImageBackgroundExtender/ImageBackgroundExtender'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const ImageBackgroundExtenderPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'image-background-extender') || {
    id: 'image-background-extender',
    name: 'Image Canvas Background Extender & Aspect Ratio Expander',
    slug: 'image-background-extender',
    path: '/tools/image-background-extender',
    description:
      'Expand images into 16:9 landscape, 9:16 vertical reels, 1:1 square, or custom aspect ratios without cropping out the subject. Features ambient blurred backdrops, depth shadows, and gradient extensions via HTML5 Canvas (no AI distortion or cloud uploads).',
    categoryId: 'image-tools',
    categoryIds: ['image-tools', 'utilities'],
    categoryName: 'Image Tools',
    icon: 'Maximize2',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    isFunctional: true,
    keywords: [
      'image background extender',
      'expand image canvas',
      'unclip image outpainting tool',
      'fit square image to 16:9',
      'instagram reel image background expander',
      'ambient blur background image',
      'qubnexa',
    ],
  }

  const howToUseSteps = [
    'Upload Source Image: Select or drag-and-drop any PNG, JPG, or WebP graphic (photo, product snapshot, logo, screenshot).',
    'Choose Target Aspect Ratio: Pick a pre-calibrated canvas preset: 16:9 Landscape (YouTube/Desktop), 9:16 Vertical (TikTok/Reels/Shorts), 1:1 Square, 4:5 Instagram Portrait, or 2:1 X/Twitter header.',
    'Select Extension Fill Style: Choose "Ambient Blur" (popular studio video technique that scales and softens original colors), "Dark Gradient", or "Solid Tone" color matching.',
    'Fine-Tune Subject Scale & Depth: Adjust the subject scale slider (40% to 100%), background blur intensity, rounded border corners, and realistic drop shadow depth.',
    'Download Extended Image: Export high-resolution, uncompressed PNG files directly to your device ready for social posting or web publishing.',
  ]

  const formulas: FormulaItem[] = [
    {
      title: 'Aspect Ratio Preservation & Outpainting Scale',
      formula: 'ScaleFactor = Min(TargetWidth / SourceWidth, TargetHeight / SourceHeight) × SubjectScale%',
      explanation:
        'Calculates exact geometric scaling coordinates so the subject remains centered and undistorted while filling the outer canvas padding.',
    },
    {
      title: 'Ambient Cover Blur Equation',
      formula: 'CoverScale = Max(TargetWidth / SourceWidth, TargetHeight / SourceHeight) × 1.2',
      explanation:
        'Ensures the ambient backdrop completely covers the extended canvas boundaries prior to applying the Gaussian blur filter.',
    },
  ]

  const examples: ExampleItem[] = [
    {
      title: 'Transform Square Product Photo into 16:9 Website Banner',
      description: 'An ecommerce store owner has a 1080x1080 product photo that needs to fit a 1920x1080 desktop hero section.',
      input: 'Square 1080x1080 image | Preset: 16:9 Landscape | Fill: Ambient Blur',
      output: 'Produces an elegant studio-quality widescreen banner with the crisp product centered and complementary blurred background tones.',
    },
    {
      title: 'Horizontal Photo to 9:16 Instagram Reel & Story',
      description: 'A creator wants to post a horizontal landscape camera shot on vertical TikTok without awkward black bars or severe cropping.',
      input: 'Horizontal photo | Preset: 9:16 Vertical | Fill: Ambient Blur with Drop Shadow',
      output: 'Creates a modern aesthetic vertical post where the horizontal photo is highlighted with depth over a soft ambient background.',
    },
  ]

  const faqs: FAQItem[] = [
    {
      question: 'Are my private photos uploaded to a remote AI server?',
      answer:
        'No! 100% of image rendering, scaling, blurring, and canvas operations happen entirely in your local browser using the HTML5 Canvas API. Your photos never leave your device.',
    },
    {
      question: 'Does this tool crop out parts of my original image?',
      answer:
        'No! Unlike simple cropping tools that slice off sides of your photos, this tool preserves 100% of your original image and extends the canvas outwards with ambient background treatments.',
    },
    {
      question: 'What is the maximum download resolution?',
      answer:
        'The canvas exports up to 1920x1080 (Full HD) for landscape or 1080x1920 for vertical reels, delivering crystal-clear quality for all major social networks.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Image Canvas Background Extender & Aspect Ratio Expander | QUBNEXA"
      seoDescription="Free image canvas and background extender. Fit images to 16:9, 9:16 vertical, or square without cropping. Features ambient blur backdrops and instant PNG download."
      keywords="image background extender, expand image canvas, fit square image to 16:9, ambient blur image, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['social-video-safe-zone-preview', 'html-content-cleaner', 'bulk-utm-builder', 'podcast-content-repurposer']}
    >
      <ImageBackgroundExtender />
    </ToolPageLayout>
  )
}

export default ImageBackgroundExtenderPage
