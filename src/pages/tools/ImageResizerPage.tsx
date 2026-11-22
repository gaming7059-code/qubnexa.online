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
    'Upload Image File: Drag and drop your photo into the workspace or click "Browse Image" (supports JPG, PNG, and WebP up to 50 MB).',
    'Choose Dimensions or Preset: Enter your target Width and Height in pixels (1 to 8192 px), or click one of the six social media presets (Instagram Square, Instagram Portrait, YouTube Thumbnail, Full HD 1080p, Facebook Post, or X / Twitter Banner).',
    'Set Aspect Ratio Lock: Toggle the "Aspect Locked" button to automatically preserve original proportions, or unlock it to set custom non-proportional dimensions freely.',
    'Select Format & Adjust Quality: Choose your target output format (JPG, PNG, or WebP) and adjust the compression quality slider (10% to 100%) to balance file size against visual clarity.',
    'Download Resized Image: Review the live preview and file size comparison indicator, then click "Download Image" to save the resized graphic directly to your device.',
  ]

  const formulas = [
    {
      title: 'Proportional Aspect Ratio Scaling',
      formula: 'Target Height = Math.round(Target Width × (Original Height / Original Width))',
      explanation:
        'When aspect ratio lock is enabled, modifying either dimension proportionally recalculates the opposing dimension, preventing visual distortion, squishing, or stretching.',
    },
    {
      title: 'High-Precision Bilinear Canvas Resampling',
      formula: 'CanvasRenderingContext2D.imageSmoothingQuality = "high"',
      explanation:
        'The browser graphics engine performs hardware-accelerated multi-pass bilinear interpolation to sample and blend pixel values smoothly across resized dimensions.',
    },
    {
      title: 'Dimension Clamping & Size Boundaries',
      formula: 'Clamped Dimension = Math.min(8192, Math.max(1, Math.round(Value)))',
      explanation:
        'Input pixel dimensions are clamped between 1 px and 8,192 px to prevent canvas memory allocation overflows, and file uploads are bounded at a maximum of 50 MB.',
    },
    {
      title: 'Client-Side Blob Export & Memory Revocation',
      formula: 'canvas.toBlob(callback, mimeType, quality / 100) → URL.revokeObjectURL()',
      explanation:
        'Images are decoded and transformed entirely in client memory; object URLs are revoked upon file replacement or component unmount to ensure zero memory leaks.',
    },
  ]

  const examples = [
    {
      title: 'Instagram Square Feed Optimization',
      description: 'Converting a high-resolution 4000×3000 DSLR landscape photo into a crisp 1080×1080 square format with aspect ratio unlock.',
      input: '4000 × 3000 px JPEG (6.4 MB)',
      output: '1080 × 1080 px WebP (approx. 185 KB, -97% file size reduction)',
    },
    {
      title: 'YouTube Video Thumbnail Preparation',
      description: 'Adjusting custom graphic artwork to the standard 1280×720 (16:9 widescreen) thumbnail dimension for YouTube.',
      input: '1920 × 1080 px PNG (1.8 MB)',
      output: '1280 × 720 px PNG (approx. 640 KB with lossless clarity)',
    },
    {
      title: 'High-Definition Web Banner Compression',
      description: 'Downscaling large 4K hero assets to 1200×630 for Facebook link shares and website display using 85% WebP quality.',
      input: '3840 × 2160 px 4K PNG (8.2 MB)',
      output: '1200 × 630 px WebP (approx. 92 KB, ultra-fast load time)',
    },
  ]

  const faqs = [
    {
      question: 'Will resizing my image reduce its visual quality?',
      answer:
        'Downscaling (reducing pixel dimensions) condenses existing pixels and generally keeps the image crisp and sharp. Upscaling (increasing dimensions beyond original resolution) requires the browser canvas to interpolate new pixels, which can cause slight softening. For algorithmic image enhancement, consider using our Image Quality Increaser tool.',
    },
    {
      question: 'How does the aspect ratio lock work when resizing?',
      answer:
        'When aspect ratio lock is enabled (the default setting), entering a new width automatically calculates the proportionate height based on the original image ratio, and vice versa. This prevents your photos from appearing squished or stretched. If you want custom non-proportional dimensions, simply click the lock icon to unlock the aspect ratio.',
    },
    {
      question: 'Which output format should I choose: JPG, PNG, or WebP?',
      answer:
        'Choose JPG for standard photos and social media compatibility where small file sizes are preferred. Choose PNG when you need bit-for-bit lossless clarity, crisp line art, logos, or transparent backgrounds. Choose WebP for modern websites and web applications, offering superior compression efficiency with high visual quality.',
    },
    {
      question: 'How does the image quality slider affect file size and clarity?',
      answer:
        'The quality slider ranges from 10% to 100% (defaulting to 90%). For lossy formats like JPG and WebP, adjusting this slider controls the compression ratio, allowing you to balance visual clarity against output file size. For PNG exports, compression is always lossless, so the quality slider does not alter PNG pixel data.',
    },
    {
      question: 'What are the six social media presets and when should I use them?',
      answer:
        'The tool includes six quick presets: Instagram Square (1080×1080, 1:1), Instagram Portrait (1080×1350, 4:5), YouTube Thumbnail (1280×720, 16:9), Full HD (1920×1080, 16:9), Facebook Post (1200×630, 1.91:1), and X / Twitter Banner (1500×500, 3:1). Clicking any preset instantly populates the exact dimensions.',
    },
    {
      question: 'What are the maximum file size and dimension limits for uploading images?',
      answer:
        'QUBNEXA supports image files up to 50 MB and allows target dimensions between 1 px and 8,192 px. These limits accommodate modern high-resolution smartphone photos, digital camera exports, and detailed design illustrations while keeping browser canvas operations responsive.',
    },
    {
      question: 'Can I convert image file formats without changing pixel dimensions?',
      answer:
        'Yes. When you load an image, the width and height default to your original image dimensions. To convert formats without resizing, keep the dimensions unchanged, select your target output format (JPG, PNG, or WebP), and click "Download Image".',
    },
    {
      question: 'How does the tool handle browser memory and image cleanup?',
      answer:
        'When you upload an image or render a resized preview, the tool creates localized object URLs via URL.createObjectURL(). Whenever you upload a new photo, change settings, or navigate away from the page, the previous object URLs are revoked via URL.revokeObjectURL() to free client system memory.',
    },
    {
      question: 'Are my uploaded photos sent to or stored on QUBNEXA servers?',
      answer:
        'No. Image decoding, resizing, and format conversions are performed entirely inside your browser using the HTML5 Canvas API and client-side object URLs. Your photo files are not transmitted to or stored on QUBNEXA backend servers for resizing. Standard website browsing assets and analytics adhere to standard web traffic protocols.',
    },
    {
      question: 'Can I resize transparent PNG graphics or illustrations?',
      answer:
        'Yes. When resizing transparent PNG files, selecting PNG or WebP output preserves alpha channel transparency. If you choose JPG output, any transparent background areas will automatically be rendered with a solid background because the JPEG standard does not support transparency.',
    },
  ]

  const relatedSlugs = [
    'image-quality-increaser',
    'image-background-extender',
    'jpg-to-pdf',
    'youtube-thumbnail-downloader',
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Image Resizer — Online Photo Dimension Tool | QUBNEXA"
      seoDescription="Resize JPG, PNG, and WebP images online with custom dimensions, aspect ratio lock, and social presets. Fast, client-side photo resizing on QUBNEXA."
      keywords="image resizer, resize image online, change photo dimensions, instagram image resizer, youtube thumbnail resizer, free photo resizer, reduce image size, webp image resizer"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={relatedSlugs}
    >
      <ImageResizer />
    </ToolPageLayout>
  )
}
