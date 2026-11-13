import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { ImageResizer } from '../../tools/ImageResizer/ImageResizer'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const ImageResizerPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'image-resizer') || {
    id: 'image-resizer',
    name: 'Image Resizer',
    slug: 'image-resizer',
    route: '/tools/image-resizer',
    path: '/tools/image-resizer',
    description:
      'Resize JPG, PNG, and WebP images online with custom dimensions, aspect ratio lock, social media presets, and quality controls completely in your browser.',
    primaryCategory: 'image-tools',
    secondaryCategories: ['utilities'],
    categoryId: 'image-tools',
    categoryIds: ['image-tools', 'utilities'],
    categoryName: 'Image Tools',
    icon: 'Maximize2',
    status: 'live',
    releaseOrder: 30,
    createdAt: '2026-11-13',
    isPopular: true,
    isNew: true,
    badge: 'Canvas HD',
    tags: [
      'image resizer',
      'resize image',
      'resize photo',
      'photo resizer online',
      'resize image without losing quality',
      'instagram image resizer',
      'crop and resize image',
    ],
    keywords: [
      'image resizer',
      'resize image',
      'resize photo',
      'photo resizer online',
      'resize image without losing quality',
      'instagram image resizer',
      'crop and resize image',
    ],
  }

  const howToUseSteps = [
    'Upload your photo by dragging and dropping it into the workspace or clicking "Browse Image" (supports JPG, JPEG, PNG, and WebP up to 50 MB).',
    'Enter your desired Width and Height in pixels, or click a popular social preset such as Instagram Square (1080×1080), Instagram Portrait (1080×1350), or YouTube Thumbnail (1280×720).',
    'Toggle "Aspect Locked" if you wish to automatically preserve your original image proportions when adjusting width or height.',
    'Select your target output format (JPG, PNG, or WebP) and adjust the compression quality slider to balance file size and visual fidelity.',
    'Click "Download Image" to instantly save your resized graphic locally with zero server uploads.',
  ]

  const formulas = [
    {
      title: 'Proportional Aspect Ratio Scaling',
      formula: 'Target Height = Math.round(Target Width × (Original Height / Original Width))',
      explanation:
        'When aspect ratio lock is enabled, modifying either dimension proportionally recalculates the opposing dimension, preventing distortion, squishing, or stretching.',
    },
    {
      title: 'High-Precision Bilinear Canvas Resampling',
      formula: 'CanvasRenderingContext2D.imageSmoothingQuality = "high"',
      explanation:
        'The browser graphics engine performs hardware-accelerated multi-pass bilinear interpolation to sample and blend pixel values smoothly across resized dimensions.',
    },
    {
      title: 'Lossy vs. Lossless Output Compression',
      formula: 'Output Blob = canvas.toBlob(callback, mimeType, quality / 100)',
      explanation:
        'JPG and WebP leverage discrete cosine transform (DCT) or intra-frame compression with user-tuned quality, whereas PNG maintains bit-for-bit lossless pixel reproduction.',
    },
    {
      title: 'Client-Side Memory & Privacy Guard',
      formula: 'Local Execution = 100% In-Memory Canvas + Object URL Revocation (0 Network Uploads)',
      explanation:
        'Images are decoded and transformed entirely inside client browser memory; all temporary memory allocations are revoked upon file replacement or component unmount.',
    },
  ]

  const examples = [
    {
      title: 'Instagram Square Feed Optimization',
      description: 'Converting a high-resolution 4000×3000 DSLR landscape photo into a crisp 1080×1080 square format.',
      input: '4000 × 3000 px JPEG (6.4 MB)',
      output: '1080 × 1080 px WebP / JPEG (approx. 185 KB, -97% file size reduction)',
    },
    {
      title: 'YouTube Video Thumbnail Preparation',
      description: 'Adjusting custom graphic artwork to the standard 1280×720 16:9 thumbnail resolution.',
      input: '1920 × 1080 px PNG (1.8 MB)',
      output: '1280 × 720 px PNG (approx. 640 KB with lossless clarity)',
    },
    {
      title: 'Web Compression for Faster Page Loads',
      description: 'Downscaling large banner assets to 1200×630 for social sharing and web display with 85% WebP quality.',
      input: '3840 × 2160 px 4K PNG (8.2 MB)',
      output: '1200 × 630 px WebP (approx. 92 KB, ultra-fast load time)',
    },
  ]

  const faqs = [
    {
      question: 'Will resizing my image reduce its quality?',
      answer:
        'Downscaling (reducing dimensions) does not harm visual sharpness and often makes the image appear crisper because pixel density is condensed. Upscaling (increasing dimensions beyond original size) requires the browser to interpolate new pixels, which may result in slight softening. For AI-assisted upscaling without blurriness, use our Image Quality Increaser tool.',
    },
    {
      question: 'What happens when I enable or disable "Maintain Aspect Ratio"?',
      answer:
        'When aspect ratio is locked (default), changing the width automatically calculates the appropriate height (and vice versa) to prevent your image from looking squished or stretched. When unlocked, you can enter any custom width and height independently.',
    },
    {
      question: 'Which output format should I choose: JPG, PNG, or WebP?',
      answer:
        'Choose JPG for standard photographs and social media compatibility. Choose PNG when you have graphics, text, or logos that require 100% lossless clarity or transparent backgrounds. Choose WebP for the best balance of small file size and high visual quality on modern websites.',
    },
    {
      question: 'Are my uploaded photos sent to any server?',
      answer:
        'No. QUBNEXA operates 100% in your browser using the HTML5 Canvas API. Your photos never leave your device, ensuring complete privacy for personal documents, private photos, and sensitive graphics.',
    },
    {
      question: 'What is the maximum image size I can resize?',
      answer:
        'QUBNEXA supports images up to 50 MB in file size and dimensions up to 8192 × 8192 pixels. This covers almost all modern smartphone photos, DSLR RAW exports, and digital illustrations.',
    },
    {
      question: 'Can I convert image formats without changing dimensions?',
      answer:
        'Yes! Simply upload your image, leave the width and height unchanged, select your desired output format (JPG, PNG, or WebP), and click Download Image.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Image Resizer — Free Online Photo & Image Dimension Converter | QUBNEXA"
      seoDescription="Resize JPG, PNG, and WebP photos to exact dimensions or social media presets with aspect ratio lock, format conversion, and quality tuning. 100% private in-browser."
      keywords="image resizer, resize image online, change photo dimensions, instagram square resizer, youtube thumbnail resizer, free image resize, reduce image resolution, convert image format"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['image-quality-increaser', 'youtube-thumbnail-downloader', 'jpg-to-pdf', 'qr-code-generator']}
    >
      <ImageResizer />
    </ToolPageLayout>
  )
}
