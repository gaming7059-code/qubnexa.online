import React from 'react'
import { Link } from 'react-router-dom'
import {
  Monitor,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Film,
  Sparkles,
  Info,
  Maximize2,
} from 'lucide-react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { YouTubeThumbnailDownloader } from '../../tools/YouTubeThumbnailDownloader/YouTubeThumbnailDownloader'
import { ScrollReveal } from '../../components/common/ScrollReveal'
import { ALL_TOOLS } from '../../data/toolsData'

export const YouTubeThumbnailDownloaderPage: React.FC = () => {
  const tool = ALL_TOOLS.find((t) => t.slug === 'youtube-thumbnail-downloader')!

  const howToUseSteps = [
    'Copy the YouTube Video Link: Copy any YouTube video URL from your desktop browser address bar, mobile YouTube app Share menu, or YouTube Shorts screen (or copy the bare 11-character video ID).',
    'Paste into the Search Field: Click "Paste" or press Ctrl+V to enter the link into the YouTube Video URL box. The tool automatically detects standard watch links, youtu.be shortlinks, Shorts, and embed links.',
    'Click Get Thumbnails: Click the "Get Thumbnails" button or press Enter to extract the video ID and resolve all official Google CDN image endpoints.',
    'Inspect Resolution & Availability: Review the live cards for 1280×720 MaxRes HD, 640×480 SD, 480×360 HQ, 320×180 MQ, and 120×90 Default with automated offscreen placeholder verification.',
    'Download or Copy Direct URL: Click "Download JPG" to save the high-resolution JPEG directly to your device storage, or click "Copy Link" to copy the direct Google CDN image URL to your clipboard.',
    'Save on iPhone & Android Mobile: On Android, tap "Download JPG" to save directly to Downloads. On iOS Safari, tap "Open" or "Download JPG", long-press the preview, and tap "Save to Photos".',
  ]

  const formulas = [
    {
      title: 'Official Google CDN Image Endpoint Architecture',
      formula: 'Endpoint = https://i.ytimg.com/vi/{videoId}/{variant}.jpg',
      explanation:
        'Direct URL structure utilized by Google\'s global Content Delivery Network. Standard variants include maxresdefault (1280×720), sddefault (640×480), hqdefault (480×360), mqdefault (320×180), and default (120×90).',
    },
    {
      title: 'Offscreen Placeholder Detection & Dimension Probing',
      formula: 'IsAvailable = (Probe(maxresdefault).naturalWidth > 120 ∧ naturalHeight > 90)',
      explanation:
        'When an HD thumbnail is missing, YouTube serves a 120×90 pixel placeholder rather than an HTTP 404. QUBNEXA probes the asset offscreen to verify true natural dimensions before marking HD resolutions available.',
    },
    {
      title: 'Multi-Format Video ID Extraction & Normalization',
      formula: 'VideoID = Match(Input, /^[A-Za-z0-9_-]{11}$/ || UrlParams("v") || PathSegment(1))',
      explanation:
        'Strips timestamps (?t=...), playlist IDs (&list=...), and referral tracking parameters across watch, shorts, youtu.be, live, and embed links to isolate the canonical 11-character identifier.',
    },
    {
      title: 'Client-Side Direct Download & Origin Restriction',
      formula: 'Verified CDN Origin (i.ytimg.com) → Offscreen Canvas Blob → Direct File Download',
      explanation:
        'Image downloads stream directly from Google\'s verified CDN hosts to client memory as a JPEG Blob. Bypasses external proxies, protects user privacy, and prevents cross-origin spoofing.',
    },
  ]

  const examples = [
    {
      title: 'Standard YouTube Watch Link (Full HD Upload)',
      description: 'Extracting a high-definition 1280×720 cover thumbnail from a standard desktop or mobile watch link.',
      input: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      output: 'Extracts video ID "dQw4w9WgXcQ", verifies 1280×720 MaxRes availability, and provides direct JPEG download.',
    },
    {
      title: 'YouTube Shorts Video Link',
      description: 'Fetching official cover artwork from a vertical YouTube Shorts share link.',
      input: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
      output: 'Resolves Shorts route to video ID "dQw4w9WgXcQ" and retrieves all 5 official resolution tiers in landscape format.',
    },
    {
      title: 'Shortened youtu.be Mobile Share Link with Timestamps',
      description: 'Handling a mobile share URL with extra query parameters and tracking tags.',
      input: 'https://youtu.be/dQw4w9WgXcQ?t=42s&feature=share',
      output: 'Safely strips timestamps and query strings, extracting clean video ID and direct CDN image endpoints.',
    },
    {
      title: 'Raw 11-Character Video Identifier',
      description: 'Entering an 11-character video ID directly without any surrounding web address.',
      input: 'dQw4w9WgXcQ',
      output: 'Validates 11-character format and generates verified Google CDN image URLs instantly.',
    },
    {
      title: 'YouTube Live Broadcast Link',
      description: 'Retrieving the promotional cover thumbnail from an active or scheduled live stream link.',
      input: 'https://www.youtube.com/live/dQw4w9WgXcQ',
      output: 'Extracts stream ID from /live/ path and resolves official CDN cover graphics.',
    },
    {
      title: 'Embedded YouTube Video Player URL',
      description: 'Handling an embed player iframe source URL with autoplay or start parameters.',
      input: 'https://www.youtube.com/embed/dQw4w9WgXcQ?start=10',
      output: 'Normalizes /embed/ route, discards player parameters, and resolves all 5 thumbnail sizes.',
    },
  ]

  const faqs = [
    {
      question: 'How do I download a YouTube thumbnail?',
      answer:
        'Copy any YouTube video link from your browser or mobile app, paste it into the search box, and click "Get Thumbnails". The tool automatically extracts the video ID and presents all available Google CDN resolution cards. Click "Download JPG" on your preferred size (such as 1280×720 HD or 480×360 HQ) to save the JPEG image directly to your device.',
    },
    {
      question: 'What is the highest available thumbnail resolution?',
      answer:
        'The highest native raster resolution YouTube generates and hosts on its CDN is 1280×720 pixels (labeled "maxresdefault.jpg") in 16:9 aspect ratio. While some marketing tools advertise native 1080p or 4K thumbnails, YouTube CDN does not create 1920×1080 or 3840×2160 raster cover files; 1280×720 is the official maximum resolution asset provided by Google.',
    },
    {
      question: 'Why is HD thumbnail unavailable?',
      answer:
        'YouTube generates the 1280×720 "maxresdefault" image only when the original video was uploaded in 720p HD or higher, or when the creator uploaded a high-resolution custom thumbnail. For older videos or videos uploaded in 360p or 480p standard definition, YouTube does not create a MaxRes asset. QUBNEXA probes the asset offscreen to verify availability so you never download a low-resolution dummy placeholder.',
    },
    {
      question: 'Can I download Shorts thumbnails?',
      answer:
        'Yes. YouTube Shorts share links (youtube.com/shorts/VIDEO_ID) use standard 11-character video IDs. When you paste a Shorts link, the tool resolves the clean video ID and retrieves all available Google CDN cover artwork. Note that Google CDN stores Shorts thumbnails in standard 16:9 landscape format rather than vertical 9:16.',
    },
    {
      question: 'Does this support youtu.be links?',
      answer:
        'Yes. The tool supports standard desktop watch links (youtube.com/watch?v=...), mobile shortlinks (youtu.be/...), Shorts URLs, embed links (youtube.com/embed/...), Live broadcast URLs (youtube.com/live/...), and raw 11-character video IDs. Query strings such as timestamps (?t=...), tracking tags, and playlist indices are stripped automatically.',
    },
    {
      question: 'Can I use thumbnails commercially?',
      answer:
        'Thumbnail graphics remain the intellectual property of their original creators or copyright holders. Downloading thumbnails for offline reference, personal archiving, education, or fair use analysis is generally permitted, but commercial republication, monetization, or deceptive reuse of another creator\'s artwork without explicit permission may infringe copyright laws. We do not provide legal guarantees regarding commercial use.',
    },
    {
      question: 'How do I save thumbnails on mobile?',
      answer:
        'On Android, tap "Get Thumbnails", choose your resolution, and tap "Download JPG" to save the file to your device\'s Downloads folder. On iPhone and iPad, tap "Open" or "Download JPG" to view the image in Safari, long-press the thumbnail preview, and select "Save to Photos" from the iOS share sheet.',
    },
    {
      question: 'Can I download a 4K YouTube thumbnail?',
      answer:
        'YouTube does not generate native 1080p or 4K cover image files on its CDN. The maximum native resolution produced by YouTube is 1280×720 (720p HD). If you require higher resolution or high-DPI graphics for print or desktop display, you can download the 1280×720 image and enhance or upscale it using our Image Quality Increaser or adjust dimensions with our Image Resizer.',
    },
    {
      question: 'Does the tool store my video URLs?',
      answer:
        'No. URL validation and video ID extraction execute locally in your browser using JavaScript. Thumbnail image downloads stream directly from Google CDN servers (i.ytimg.com) to your browser\'s local memory. QUBNEXA does not route downloads through intermediary proxy servers or store your entered video links in a remote database.',
    },
    {
      question: 'What should I do if a thumbnail fails to load?',
      answer:
        'If a thumbnail card displays as unavailable, that specific resolution (such as 1280×720 MaxRes) was not generated by YouTube for that video; you can safely download the guaranteed 480×360 "High Quality" (HQ) card instead. If images fail to load altogether, check your internet connection, ensure the video is publicly accessible, or click "Open" to view the raw Google CDN link directly.',
    },
  ]

  const relatedSlugs = [
    'image-resizer',
    'image-quality-increaser',
    'video-downloader',
    'video-prompt-generator',
    'qr-code-generator',
    'audio-transcriber',
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="YouTube Thumbnail Downloader — Free HD Download | QUBNEXA"
      seoDescription="Free YouTube thumbnail downloader with instant preview. Free download of HD thumbnail images from videos, YouTube Shorts, and youtu.be links in clear CDN quality."
      keywords="youtube thumbnail downloader, download youtube thumbnail, youtube thumbnail hd, free youtube thumbnail download, youtube shorts thumbnail download, save youtube thumbnail, yt thumbnail download, 1280x720 youtube thumbnail"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={relatedSlugs}
    >
      <div className="space-y-10">
        {/* Above-the-fold Interactive Tool */}
        <YouTubeThumbnailDownloader />

        {/* 1. YouTube Thumbnail Resolution & Dimension Guide */}
        <ScrollReveal>
          <section
            aria-labelledby="resolution-guide-heading"
            className="xw-panel p-6 sm:p-8 shadow-2xs space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg">
                <Monitor className="h-5 w-5 text-blue-600 dark:text-[#00DFFF]" />
                <h2 id="resolution-guide-heading">YouTube Thumbnail Resolution Guide</h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-[#00DFFF] border border-blue-200 dark:border-blue-900/60 self-start sm:self-auto">
                Official Google CDN Variants
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              YouTube automatically processes video cover artwork into five standardized raster image variants hosted across Google&apos;s global Content Delivery Network (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-[#00DFFF] font-mono text-xs">i.ytimg.com</code>). Inspect the complete specification table below to choose the optimal resolution for your project:
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#050814]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-semibold">
                    <th className="py-3 px-4">Resolution Tier</th>
                    <th className="py-3 px-4">Dimensions</th>
                    <th className="py-3 px-4">Aspect Ratio</th>
                    <th className="py-3 px-4">CDN Filename</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4">Primary Use Case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-600 dark:text-slate-300">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-[#00DFFF]" />
                      Maximum Resolution (HD)
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-900 dark:text-slate-100 font-medium">1280 × 720</td>
                    <td className="py-3 px-4 font-mono">16:9 Widescreen</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-blue-700 dark:text-[#00DFFF]">maxresdefault.jpg</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
                        HD Uploads (720p+)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">Desktop screens, smart TVs, presentation decks, and graphic design analysis.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Standard Definition (SD)</td>
                    <td className="py-3 px-4 font-mono text-slate-900 dark:text-slate-100 font-medium">640 × 480</td>
                    <td className="py-3 px-4 font-mono">4:3 Box (Pillarboxed)</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-blue-700 dark:text-[#00DFFF]">sddefault.jpg</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/80">
                        Common
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">Medium tablet displays and embedded blog widgets.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">High Quality (HQ)</td>
                    <td className="py-3 px-4 font-mono text-slate-900 dark:text-slate-100 font-medium">480 × 360</td>
                    <td className="py-3 px-4 font-mono">4:3 Box (Pillarboxed)</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-blue-700 dark:text-[#00DFFF]">hqdefault.jpg</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
                        100% Guaranteed
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">Universal fallback image generated for every YouTube video without exception.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Medium Quality (MQ)</td>
                    <td className="py-3 px-4 font-mono text-slate-900 dark:text-slate-100 font-medium">320 × 180</td>
                    <td className="py-3 px-4 font-mono">16:9 Widescreen</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-blue-700 dark:text-[#00DFFF]">mqdefault.jpg</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
                        100% Guaranteed
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">Mobile search result lists and video recommendation carousels without letterboxing.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">Default Thumbnail</td>
                    <td className="py-3 px-4 font-mono text-slate-900 dark:text-slate-100 font-medium">120 × 90</td>
                    <td className="py-3 px-4 font-mono">4:3 Box</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-blue-700 dark:text-[#00DFFF]">default.jpg</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
                        100% Guaranteed
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">Compact sidebar history lists, playlist queues, and embedded chat snippets.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11182D] border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-[#00DFFF] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-900 dark:text-slate-200">Understanding Aspect Ratios &amp; Pillarboxing: </span>
                Notice that while <code className="font-mono text-slate-800 dark:text-slate-200">maxresdefault</code> (1280×720) and <code className="font-mono text-slate-800 dark:text-slate-200">mqdefault</code> (320×180) are true 16:9 widescreen formats, YouTube pads <code className="font-mono text-slate-800 dark:text-slate-200">sddefault</code> (640×480) and <code className="font-mono text-slate-800 dark:text-slate-200">hqdefault</code> (480×360) into a 4:3 canvas with black letterbox bars on the top and bottom for 16:9 videos. If you need clean 16:9 proportions without borders, select either the 1280×720 MaxRes or 320×180 MQ file.
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 2. Mobile Download Guide (Android & iPhone / iPad) */}
        <ScrollReveal delay={50}>
          <section
            aria-labelledby="mobile-guide-heading"
            className="xw-panel p-6 sm:p-8 shadow-2xs space-y-6"
          >
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg border-b border-slate-200 dark:border-slate-800 pb-4">
              <Smartphone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2 id="mobile-guide-heading">Mobile Download Guide: Saving on Android &amp; iPhone</h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Downloading YouTube video thumbnails directly to your smartphone or tablet works smoothly without installing third-party apps or browser extensions. Follow these platform-specific steps:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Android Guide Card */}
              <div className="xw-surface-muted p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Saving on Android (Chrome, Samsung Internet, Firefox)</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-1">
                  <li>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Copy Link:</span> Open the YouTube app, tap <strong className="font-semibold text-slate-800 dark:text-slate-200">Share</strong> below any video or Short, and tap <strong className="font-semibold text-slate-800 dark:text-slate-200">Copy Link</strong>.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Paste in QUBNEXA:</span> Open your browser, tap the search box, and tap the <strong className="font-semibold text-slate-800 dark:text-slate-200">Paste</strong> button or press and hold to paste the link.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Extract &amp; Select Quality:</span> Tap <strong className="font-semibold text-slate-800 dark:text-slate-200">Get Thumbnails</strong> to reveal the cards. Tap <strong className="font-semibold text-slate-800 dark:text-slate-200">Download JPG</strong> on the 1280×720 or 480×360 card.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Locate Image:</span> The file is saved directly to your device storage in the <strong className="font-semibold text-slate-800 dark:text-slate-200">Downloads</strong> folder, accessible in the Files app or Google Photos.
                  </li>
                </ol>
              </div>

              {/* iPhone Guide Card */}
              <div className="xw-surface-muted p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-[#00DFFF] flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Saving on iPhone &amp; iPad (Safari, Chrome iOS)</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-1">
                  <li>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Copy Link:</span> In the YouTube app, tap <strong className="font-semibold text-slate-800 dark:text-slate-200">Share</strong> and select <strong className="font-semibold text-slate-800 dark:text-slate-200">Copy Link</strong> (or copy from the Safari address bar).
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Paste in QUBNEXA:</span> Open QUBNEXA in Safari, paste your link into the field, and tap <strong className="font-semibold text-slate-800 dark:text-slate-200">Get Thumbnails</strong>.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Open or Download:</span> Tap <strong className="font-semibold text-slate-800 dark:text-slate-200">Download JPG</strong> or tap the <strong className="font-semibold text-slate-800 dark:text-slate-200">Open</strong> link to view the high-resolution file in full view.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Save to Photos:</span> Long-press the full-size thumbnail image and select <strong className="font-semibold text-slate-800 dark:text-slate-200">&quot;Save to Photos&quot;</strong> from the native iOS contextual menu.
                  </li>
                </ol>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 3. YouTube Shorts & Aspect Ratio Nuances */}
        <ScrollReveal delay={50}>
          <section
            aria-labelledby="shorts-guide-heading"
            className="xw-panel p-6 sm:p-8 shadow-2xs space-y-6"
          >
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg border-b border-slate-200 dark:border-slate-800 pb-4">
              <Film className="h-5 w-5 text-cyan-600 dark:text-[#00DFFF]" />
              <h2 id="shorts-guide-heading">Downloading YouTube Shorts Thumbnails</h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                YouTube Shorts are recorded and played vertically in a 9:16 portrait aspect ratio. However, Google CDN stores cover artwork for all videos—including Shorts—in standard 16:9 landscape format (<code className="font-mono text-blue-600 dark:text-[#00DFFF] text-xs">maxresdefault.jpg</code> and <code className="font-mono text-blue-600 dark:text-[#00DFFF] text-xs">hqdefault.jpg</code>).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11182D] border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    How to Extract a Shorts Thumbnail
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Simply copy the link from the Shorts share button (<code className="font-mono text-slate-700 dark:text-slate-300">youtube.com/shorts/VIDEO_ID</code>) and paste it into the field. The tool extracts the exact 11-character video ID and fetches the master cover artwork instantly.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11182D] border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-cyan-600 dark:text-[#00DFFF]" />
                    Need to Crop Back to Vertical 9:16 or Square 1:1?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    If you want to use the downloaded landscape thumbnail on Instagram stories, TikTok, or YouTube Shorts covers, use our free{' '}
                    <Link
                      to="/tools/image-resizer"
                      className="font-medium text-blue-600 dark:text-[#00DFFF] hover:underline inline-flex items-center gap-0.5"
                    >
                      Image Resizer
                      <ArrowRight className="w-3 h-3 inline" />
                    </Link>{' '}
                    to crop or adjust aspect ratios with precision lock.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 4. Troubleshooting Missing HD Thumbnails & High-DPI Upscaling */}
        <ScrollReveal delay={50}>
          <section
            aria-labelledby="troubleshooting-heading"
            className="xw-panel p-6 sm:p-8 shadow-2xs space-y-6"
          >
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg border-b border-slate-200 dark:border-slate-800 pb-4">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <h2 id="troubleshooting-heading">Troubleshooting Missing HD Thumbnails &amp; High-DPI Quality</h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                Occasionally, you may see an <strong className="font-semibold text-slate-800 dark:text-slate-200">&quot;Unavailable&quot;</strong> badge on the Maximum Resolution (1280×720) card. Here is why this happens and how to resolve it:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11182D] border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    Why is 1280×720 MaxRes Missing?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    YouTube only generates <code className="font-mono text-slate-700 dark:text-slate-300">maxresdefault.jpg</code> when the original video was uploaded at 720p resolution or higher, or when the creator uploaded custom HD artwork. For older 360p/480p videos, Google CDN does not produce an HD cover file.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11182D] border border-slate-200 dark:border-slate-800 space-y-2">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    How Dummy Placeholders are Filtered
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    When an HD asset does not exist, YouTube CDN returns a tiny 120×90 dummy image instead of an HTTP 404 error. QUBNEXA runs an offscreen dimension test before display. If dimensions measure 120×90, the card is marked unavailable to prevent downloading blurry placeholder images.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-[#00DFFF]" />
                    <span>Need 1080p, 2K, or 4K Resolution for Print or Desktop Displays?</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Because YouTube CDN does not create native 1080p or 4K raster covers, download the 1280×720 MaxRes (or 480×360 HQ) file and enhance its pixel clarity using our neural upscaler.
                  </p>
                </div>
                <Link
                  to="/tools/image-quality-increaser"
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 dark:bg-[#00DFFF] dark:hover:bg-cyan-400 text-white dark:text-slate-950 text-xs font-semibold shadow-xs transition-all"
                >
                  <span>Upscale with Image Quality Increaser</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </ToolPageLayout>
  )
}
