import React from 'react'
import { ToolPageLayout, type FAQItem, type FormulaItem, type ExampleItem } from '../../components/layout/ToolPageLayout'
import { SocialVideoSafeZonePreview } from '../../tools/SocialVideoSafeZonePreview/SocialVideoSafeZonePreview'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const SocialVideoSafeZonePreviewPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'social-video-safe-zone-preview') || {
    id: 'social-video-safe-zone-preview',
    name: 'Universal Social Media Safe Zone Studio',
    slug: 'social-video-safe-zone-preview',
    path: '/tools/social-video-safe-zone-preview',
    description:
      'Universal social media safe zone preview & studio. Simulate platform UI overlays for TikTok, Instagram Reels, YouTube Shorts, Facebook, X, LinkedIn, Snapchat, Pinterest, and 15+ networks. Live margin editing, obstruction blocks, and transparent PNG template exports.',
    categoryId: 'video-tools',
    categoryIds: ['video-tools', 'utilities', 'image-tools'],
    categoryName: 'Video Tools',
    icon: 'Video',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    isFunctional: true,
    keywords: [
      'social video safe zone',
      'universal safe zone studio',
      'reels safe zone preview',
      'tiktok safe zone overlay',
      'youtube shorts safe margin',
      'instagram story safe zone',
      'facebook reels safe area',
      'linkedin video dimensions',
      'x twitter video safe zone',
      'snapchat safe margin',
      '9:16 safe zone png',
      'video overlay simulator',
      'qubnexa',
    ],
  }

  const howToUseSteps = [
    'Select Category & Social Platform: Choose from 15+ networks organized into Short-Form Video (TikTok, Reels, Shorts), Social Feeds (Facebook, X, LinkedIn, Pinterest, Threads), Professional & Messaging (WhatsApp, Telegram, Reddit), Live & Community (Twitch, Discord, Kick), or Custom Platform Builder.',
    'Choose Content Format & Aspect Ratio: Pick from 30+ platform-specific presets including 9:16 vertical video, 16:9 widescreen, 4:5 portrait feed, 1:1 square, and banner formats with accurate native dimensions.',
    'Upload Video or Test Sample Stage: Click "Upload Video" or drag and drop an MP4, WebM, or MOV file (up to 500 MB). The video is parsed 100% locally in your browser memory. You can also explore the sample stage without uploading any file.',
    'Select Overlay View Mode: Switch between "Both" (safe zone borders + simulated UI buttons), "Safe Zone Boundaries Only", "Platform UI Simulation Only", "Text Placement Guides", or "Clean Video".',
    'Toggle Composition Guides: Enable the Rule of Thirds grid for balanced focal points, Center Crosshair for horizon and subject alignment, margin dimension lines, and obstruction zone labels.',
    'Fine-Tune Margins & Obstructions: Adjust top, bottom, left, and right safe margins using live percentage sliders, modify the caution buffer (0% to 10%), or add custom draggable/editable obstruction blocks.',
    'Export Production Templates: Click "Download Safe Zone (PNG)" with either transparent overlay or dark background to generate high-resolution PNG guides ready for CapCut, Adobe Premiere Pro, DaVinci Resolve, Final Cut Pro, or Canva.',
  ]

  const formulas: FormulaItem[] = [
    {
      title: 'Universal Aspect Ratio & Resolution Formulas',
      formula: 'Aspect Ratio = Width / Height | 9:16 (0.5625) = 1080×1920 | 16:9 (1.7778) = 1920×1080 | 4:5 (0.8000) = 1080×1350 | 1:1 (1.0000) = 1080×1080',
      explanation:
        'Standardized aspect ratios govern where video frames get cropped, letterboxed, or pillarboxed across mobile and desktop social feeds. Adhering to native resolutions prevents compression artifacts and unexpected edge cropping.',
    },
    {
      title: 'Vertical Short-Form Safe Zone Margins (TikTok, Reels, Shorts)',
      formula: 'TikTok: Top 8.5% (~163px), Bottom 21% (~403px), Right 14% (~151px) | Reels: Top 7.5% (~144px), Bottom 23% (~442px), Right 14% (~151px) | Shorts: Top 7.5% (~144px), Bottom 19% (~365px), Right 14% (~151px)',
      explanation:
        'Vertical short-form formats require substantial top headers (search, following/FYP tabs), dense right action rails (likes, comments, share, remix, audio pill), and tall bottom footers (creator handle, captions, sound tickers, app navigation).',
    },
    {
      title: 'Caution Buffer & Multi-Device Screen Bleed Variance',
      formula: 'Caution Boundary = Base Margin ± Caution% (Default: 3.0%) | Variance Range: 16:9 (1.78) to 20:9 (2.22) Device Displays',
      explanation:
        'Modern smartphone displays vary from classic 16:9 screens to tall 19.5:9 and 20:9 OLED panels with rounded corners, camera punch-holes, and dynamic islands. A 3% caution buffer ensures captions remain readable on every screen variant.',
    },
    {
      title: 'Social Feed & Landscape Formats (LinkedIn, X, Facebook, Reddit)',
      formula: 'Landscape (16:9): Top 6% (~65px), Bottom 10% (~108px), Right 5% (~96px), Left 5% (~96px) | Portrait (4:5): Top 6% (~81px), Bottom 12% (~162px)',
      explanation:
        'Feed posts have lower bottom obstruction compared to full-screen vertical stories, but desktop and tablet viewers display persistent scrubber timelines, volume pills, and platform engagement bars that encroach on bottom edge content.',
    },
    {
      title: 'Custom Obstruction Collision Box Geometry',
      formula: 'Zone Area = Width% × Height% | Top-Left Anchor: (X%, Y%) | Bounding Box = [X, Y, X + Width, Y + Height]',
      explanation:
        'Custom obstruction zones simulate sponsored overlays, creator watermarks, channel badges, and non-standard device notches, allowing precise bounding box validation before publishing.',
    },
    {
      title: 'Zero-Server In-Browser Video Processing Architecture',
      formula: 'User File → HTML5 File API → URL.createObjectURL(blob) → HTMLVideoElement (In-Memory) → URL.revokeObjectURL()',
      explanation:
        'All video decoding, timeline scrubbing, canvas rendering, and PNG generation occur 100% locally on your device within browser memory. No media frames, audio streams, or user files are ever transmitted to or stored on external servers.',
    },
  ]

  const examples: ExampleItem[] = [
    {
      title: 'TikTok Tutorial with Lower-Third Subtitles',
      description: 'A creator wants to position custom animated subtitles in an educational tutorial without being obscured by TikTok’s caption text.',
      input: '1080 × 1920 MP4 vertical video with subtitles positioned 300px from the bottom.',
      output: 'The safe zone preview flags that subtitles in the bottom 400px will collide with TikTok’s username and sound marquee. The creator raises the subtitle position to the green safe area, ensuring 100% legibility on mobile.',
    },
    {
      title: 'Instagram Reels E-Commerce Product Demo',
      description: 'An online business publishes a product showcase video highlighting discount codes and "Link in Bio" callouts.',
      input: 'Vertical video clip showcasing discount code badges anchored to the right side of the frame.',
      output: 'The overlay shows the right 14% is occupied by Instagram’s like, comment, and share icons. Moving the discount code badge to the center-left safe zone prevents critical text from being hidden behind social icons.',
    },
    {
      title: 'YouTube Shorts Talking-Head Video',
      description: 'A podcast host edits a short video hook and wants to ensure the guest’s face and microphone framing are well-balanced.',
      input: '9:16 mobile clip with framing aligned using the center crosshair guideline.',
      output: 'The preview confirms the subject’s eyes align with the center crosshair, well above YouTube Shorts’ bottom channel handle and Subscribe button, guaranteeing an uncluttered viewer presentation.',
    },
    {
      title: 'LinkedIn B2B Thought-Leadership Video',
      description: 'A company posts an executive interview in 4:5 portrait ratio and needs speaker title cards to remain visible on mobile feeds.',
      input: '1080 × 1350 video with lower-third title card positioned near the bottom edge.',
      output: 'The LinkedIn 4:5 safe zone shows the native play/pause controls and feed post title bar will cover the speaker name. Shifting the lower-third 160px upward keeps the speaker credential completely visible.',
    },
    {
      title: 'Multi-Platform Campaign Cross-Check (TikTok + Reels + Shorts)',
      description: 'A social media agency produces one vertical video asset intended for simultaneous cross-posting across TikTok, Instagram Reels, and YouTube Shorts.',
      input: 'Single 1080 × 1920 video master tested across all three platform presets.',
      output: 'By comparing overlays, the editor identifies a universal safe zone (Top: 8.5%, Bottom: 23%, Right: 14%, Left: 6%) that satisfies all three platforms simultaneously without creating multiple cut versions.',
    },
  ]

  const faqs: FAQItem[] = [
    {
      question: 'Which social media platforms and formats are supported?',
      answer:
        'The studio supports 15+ major platforms: TikTok (Video, Profile, Ads), Instagram (Reels, Stories, Feed 4:5, Square 1:1, Landscape 16:9), YouTube (Shorts, Video 16:9, Thumbnail, Banner), Facebook (Reels, Stories, Feed, Video), Snapchat (Spotlight, Stories), X / Twitter (Vertical, Landscape, Square), LinkedIn (Video, Square, Portrait), Pinterest (Pins, Video Pins), Threads, WhatsApp (Status), Telegram (Stories), Reddit (Video Feed), Twitch (VOD, Stream), Discord (Clips), Kick (Clips), plus a Custom Platform Builder with user-defined dimensions.',
    },
    {
      question: 'Are safe zones identical across TikTok, Instagram Reels, and YouTube Shorts?',
      answer:
        'No. While all three platforms utilize vertical 9:16 video (typically 1080 × 1920), their interface overlays differ. Instagram Reels has a taller bottom caption and profile footer area (~23%), TikTok features a dense right engagement rail and bottom sound disc (~21%), and YouTube Shorts places distinctive thumbs up/down and remix buttons on the right (~19%). This studio provides dedicated, individually calibrated overlays for each platform.',
    },
    {
      question: 'How do I use the downloaded PNG safe zone template in my video editor?',
      answer:
        'When you click "Download Safe Zone (PNG)" with the "Transparent PNG overlay" option, the studio exports a full-resolution PNG file (e.g. 1080 × 1920) with transparent background and crisp guide lines. Import this file into your editing timeline (CapCut, Adobe Premiere Pro, DaVinci Resolve, Final Cut Pro, or Canva) as a top video track. Use it as a visual guide while positioning text, logos, and subtitles, then hide or delete the overlay track before exporting your final video.',
    },
    {
      question: 'Can I test custom canvas dimensions or non-standard aspect ratios?',
      answer:
        'Yes. You can switch to the "Custom Platform Builder" preset or directly edit the Canvas Width and Height inputs (from 320px to 3840px). The studio dynamically recalculates the exact aspect ratio (e.g., 9:16, 16:9, 4:5, 1:1, 21:9) and adapts the preview stage in real time.',
    },
    {
      question: 'What are Caution Buffers and why do they appear around the safe area?',
      answer:
        'Caution Buffers (shown as a yellow/amber dashed zone) represent the transition between safe content and obstruction danger areas. Because smartphone screen aspect ratios range from 16:9 to tall 20:9 with varied bezel thickness and hardware notches, placing content right at the border risks edge clipping. The adjustable caution buffer (default 3%) gives your text a reliable safety margin.',
    },
    {
      question: 'How does the Custom Obstruction Zone feature work?',
      answer:
        'The studio allows you to define your own custom obstruction blocks. You can specify the label, anchor position (top-left, top-right, bottom-left, bottom-right, or center), width and height percentages, and severity level (Obstruction vs. Caution). You can toggle visibility or remove zones at any time, which is ideal for testing custom sponsors, channel watermarks, or app-specific banners.',
    },
    {
      question: 'Is my uploaded video uploaded to any server or accessible to anyone else?',
      answer:
        'No. QUBNEXA operates with strict browser-first privacy. Your video file is read entirely in local browser memory using the HTML5 File API and temporary Object URLs. No video data, audio tracks, or frames are ever uploaded, saved, or analyzed on remote servers.',
    },
    {
      question: 'Can I preview safe zones if my video is not in 9:16 vertical format?',
      answer:
        'Yes. You can switch between "Cover" mode (which fills the frame as it would on mobile feeds, cropping outer edges) and "Contain" mode (which letterboxes the video so you can inspect how widescreen 16:9 or square 1:1 footage aligns inside the selected preset).',
    },
    {
      question: 'Can I download the safe zone template without uploading a video?',
      answer:
        'Yes! You can explore all 15+ platform safe zones, adjust custom margins, add obstruction zones, and download high-resolution PNG templates immediately upon loading the page without needing to upload any video file.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Social Video Safe Zone Studio — TikTok, Reels & Shorts | QUBNEXA"
      seoDescription="Free universal social media safe zone studio. Test vertical videos, stories, and ads with accurate overlays for TikTok, Reels, Shorts, and X. Export PNGs."
      keywords="social video safe zone, universal safe zone studio, reels safe zone preview, tiktok safe zone overlay, youtube shorts safe margin, instagram story safe zone, facebook reels safe area, linkedin video dimensions, x twitter video safe zone, snapchat safe margin, 9:16 safe zone png, video overlay simulator, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['video-downloader', 'youtube-thumbnail-downloader', 'video-prompt-generator', 'image-resizer']}
    >
      <SocialVideoSafeZonePreview />
    </ToolPageLayout>
  )
}
