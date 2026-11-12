import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { VideoDownloader } from '../../tools/VideoDownloader/VideoDownloader'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const VideoDownloaderPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'video-downloader') || {
    id: 'video-downloader',
    name: 'Video Downloader',
    slug: 'video-downloader',
    path: '/tools/video-downloader',
    description:
      'Analyze video links and download authorized direct MP4 and WebM media files in your browser with honest platform detection and live progress.',
    categoryId: 'image-media',
    categoryIds: ['image-media', 'daily-utilities'],
    categoryName: 'Image & Media',
    icon: 'Download',
    isPopular: true,
    isNew: true,
    isFunctional: true,
    keywords: [
      'video downloader',
      'mp4 downloader',
      'webm downloader',
      'download direct video',
      'save video online',
    ],
  }

  const howToUseSteps = [
    'Paste or type a direct video file URL (.mp4 or .webm) or a supported platform link into the Video URL box (you can also click the Paste button).',
    'Review the live source detection pill to see whether the URL is a direct media link or a third-party platform page.',
    'Click Analyze to inspect MIME Content-Type, CORS permission, Content-Disposition filename, file size, resolution, and duration.',
    'For CORS-enabled direct MP4/WebM files, select the source quality, verify or adjust the filename, and click Download Video to track live progress.',
    'For CORS-restricted servers or social platforms (YouTube, Instagram, Facebook, X, TikTok), use the official viewing, Studio, or account export routes provided.',
  ]

  const formulas = [
    {
      title: 'Client-Side Stream & Header Inspection',
      formula: 'HEAD / 1-Byte Range Probe → Content-Type ∈ {video/mp4, video/webm} + CORS Check',
      explanation:
        'Before buffering any bytes, QUBNEXA checks HTTP status, MIME headers, Content-Length, and Content-Disposition safely using fetch() with credentials omitted.',
    },
    {
      title: 'Honest Platform & CORS Distinction',
      formula: 'Playable Metadata Without CORS = Direct Browser Tab Save (No Fake Proxy)',
      explanation:
        'If a direct MP4/WebM host omits Access-Control-Allow-Origin headers, JavaScript cannot read response chunks. Rather than routing traffic through an open server proxy, we clearly report CORS status and link directly.',
    },
    {
      title: 'Filename & URL Security Guard',
      formula: 'Allowed Schemes ∈ {https:, http:} ∧ No Credentials ∧ No Private/Metadata IPs',
      explanation:
        'Unsafe schemes (javascript:, data:, file:, blob:) and cross-origin private or loopback hosts are rejected up front. Filenames strip path traversal sequences.',
    },
    {
      title: 'Browser Memory Safety Ceiling',
      formula: 'In-Memory Blob Buffer Cap = 512 MB (Warning > 250 MB)',
      explanation:
        'Because Blob downloads assemble chunks in browser RAM on static hosting, files over 250 MB display a warning and streams are safely capped at 512 MB.',
    },
  ]

  const examples = [
    {
      title: 'Authorized Direct MP4 / WebM Hosting',
      description: 'Saving a public lecture recording or sample MP4/WebM hosted on a CORS-enabled CDN.',
      input: 'https://cdn.example.com/clips/product-demo.mp4',
      output: 'Verifies video/mp4, captures frame preview, detects 1080p duration & size, and downloads with progress bar.',
    },
    {
      title: 'YouTube, Instagram, Facebook, X or TikTok URLs',
      description: 'Checking links from streaming or social networks that restrict direct third-party extraction.',
      input: 'https://www.youtube.com/watch?v=...',
      output: 'Identifies platform cleanly, explains platform/CORS boundaries honestly, and provides official YouTube / Studio / Takeout links.',
    },
  ]

  const faqs = [
    {
      question: 'Is the QUBNEXA Video Downloader completely free?',
      answer:
        'Yes. There are no logins, subscriptions, paid APIs, API keys, or hidden fees. All URL validation, metadata probing, and supported direct downloads run free in your browser.',
    },
    {
      question: 'Which video URLs can be downloaded directly with progress tracking?',
      answer:
        'Publicly accessible direct MP4 and WebM URLs hosted on servers that return valid video/mp4 or video/webm MIME headers and allow cross-origin browser requests (Access-Control-Allow-Origin) download directly inside QUBNEXA with real-time progress and Content-Disposition filenames.',
    },
    {
      question: 'Why does QUBNEXA not directly rip YouTube, Instagram, Facebook, X, or TikTok videos?',
      answer:
        'Those platforms use expiring signed manifests, authentication gates, DRM/encryption, or block CORS browser reads, and automating extraction violates their terms or requires an unrestricted server-side proxy. QUBNEXA strictly runs on static Cloudflare Pages hosting without DRM bypasses or unsafe proxies—so we accurately detect those platforms and link you directly to official viewing and creator archive/export routes.',
    },
    {
      question: 'What happens if a direct MP4 link blocks CORS?',
      answer:
        'We probe the media honestly. If the video metadata loads in your browser while JavaScript fetch() is blocked by CORS, we inform you clearly instead of faking a download failure or progress bar, and let you open the verified direct video file natively in a new tab.',
    },
    {
      question: 'Are pasted links stored or logged on any server?',
      answer:
        'No. Everything runs client-side in your browser session with zero database storage, zero user accounts, and zero URL logging.',
    },
  ]

  const relatedSlugs = ['video-prompt-generator', 'image-quality-increaser', 'audio-studio', 'jpg-to-pdf']

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Free Video Downloader — Direct MP4 & WebM Downloader Online | QUBNEXA"
      seoDescription="Download videos you own or are authorized to save from direct MP4 and WebM URLs with browser-side progress, Content-Disposition filenames, and honest platform detection. 100% free with zero login."
      keywords="video downloader, free video downloader, mp4 downloader, webm downloader, direct video download, online media saver, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={relatedSlugs}
    >
      <VideoDownloader />
    </ToolPageLayout>
  )
}
