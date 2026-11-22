import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { VideoDownloader } from '../../tools/VideoDownloader/VideoDownloader'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const VideoDownloaderPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'video-downloader') || {
    id: 'video-downloader',
    name: 'Universal Video Downloader',
    slug: 'video-downloader',
    path: '/tools/video-downloader',
    description:
      'Inspect video links, detect authorized direct MP4/WebM streams, preview playback, and download files without logins.',
    categoryId: 'video-tools',
    categoryIds: ['video-tools', 'utilities'],
    categoryName: 'Video Tools',
    icon: 'Download',
    isPopular: true,
    isNew: true,
    isFunctional: true,
    keywords: [
      'video downloader',
      'direct video downloader',
      'mp4 downloader',
      'webm downloader',
      'download direct video',
      'save video online',
    ],
  }

  const howToUseSteps = [
    'Verify Your Video Link: Ensure you have an authorized, publicly accessible direct media URL (.mp4 or .webm) or a supported platform link.',
    'Paste the Web Address: Click "Paste" or press Ctrl+V to enter the URL into the Video Media URL input field.',
    'Check the Live Platform Badge: Review the instant detection badge to see whether the address is a direct MP4/WebM file, a generic CDN endpoint, or a social network link.',
    'Click Analyze: QUBNEXA dispatches an asynchronous pre-flight HEAD or 1-byte Range probe to inspect MIME headers, file size, duration, and CORS permissions.',
    'Inspect Stream Metadata: Review the video resolution, duration, file size, and embedded playback preview.',
    'Customize Output Filename: If desired, adjust the output filename (pre-populated from server Content-Disposition headers) while retaining the safe extension.',
    'Download or Open Directly: For CORS-enabled sources, click "Download Video" to stream with live progress. For CORS-restricted sources, click "Open Direct URL" to save natively in your browser.',
    'Use Official Routes for Social Media: For restricted platforms (YouTube, Instagram, Facebook, X, TikTok), follow the provided official viewing or creator archive export links.',
  ]

  const formulas = [
    {
      title: 'Pre-Flight Stream & MIME Inspection',
      formula: 'HEAD / GET Range: bytes=0-1 → Validate Content-Type ∈ {video/mp4, video/webm, application/mp4}',
      explanation:
        'Probes remote media headers to inspect MIME types, Content-Length, and CORS permissions before streaming any data. A 1-byte Range GET verifies hosts that reject HEAD requests with HTTP 405 or 501.',
    },
    {
      title: 'CORS Policy Evaluation & Native Fallback',
      formula: 'CORS Headers ∋ Permitted Origin | Fallback: HTMLVideoElement(preload="metadata")',
      explanation:
        'Verifies cross-origin permissions for in-browser JavaScript chunk reading. If CORS is omitted, the tool assesses playable status via native video element probing and offers a direct new-tab link.',
    },
    {
      title: 'Protocol Security & SSRF Prevention Filter',
      formula: 'Scheme ∈ {https:, http:} ∧ Host ∉ {localhost, 127.0.0.1, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16}',
      explanation:
        'Rejects non-HTTP schemes (javascript:, file:, data:, blob:) and internal private/loopback IP addresses upfront to prevent SSRF vulnerabilities and client-side script injection.',
    },
    {
      title: 'Content-Disposition Parsing & Filename Sanitization',
      formula: 'Filename = Sanitize(RFC5987(filename*) || Standard(filename) || URLPathLeaf)',
      explanation:
        'Decodes UTF-8 and quoted server filename headers while stripping directory traversal sequences (../), control characters, and OS-reserved characters (<>:"/\\|?*).',
    },
    {
      title: 'In-Memory Stream Chunking & RAM Safety Ceiling',
      formula: 'Buffer Limit ≤ 512 MB (Warning > 250 MB) | ReadableStream → Uint8Array[] → Blob(type) → ObjectURL',
      explanation:
        'Streams response chunks into browser memory with real-time percentage and byte counters. Buffering is capped at 512 MB to safeguard against browser tab crashes and memory exhaustion.',
    },
    {
      title: 'Restricted Platform Detection & Official Routing',
      formula: 'Platform ∈ {YouTube, Instagram, Facebook, X, TikTok} → Direct Extraction Restricted → Official Routes',
      explanation:
        'Accurately identifies proprietary streaming domains and displays official creator export routes (such as YouTube Studio, Google Takeout, and Meta Accounts Center) instead of attempting unauthorized extraction.',
    },
  ]

  const examples = [
    {
      title: 'Public Direct MP4 Video on CORS-Enabled CDN',
      description: 'Saving an open-access instructional video or presentation recording hosted on a CORS-compliant CDN.',
      input: 'https://cdn.example.com/media/lecture-session-01.mp4',
      output: 'Verifies video/mp4, detects 1080p Full HD resolution, extracts duration, and streams in-memory blob with live progress to lecture-session-01.mp4.',
    },
    {
      title: 'CORS-Restricted Direct Media Host',
      description: 'Analyzing an MP4 file hosted on a server that omits Access-Control-Allow-Origin response headers.',
      input: 'https://media.example.com/archive/conference-talk.mp4 (Omitted CORS headers)',
      output: 'Probes HTML5 metadata, identifies live 720p stream, reports CORS limitation honestly, and provides "Open Direct Video in New Tab" for native saving.',
    },
    {
      title: 'YouTube Video Link',
      description: 'Checking a video link from YouTube or YouTube Shorts with platform detection.',
      input: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      output: 'Detects YouTube (11-character video ID), displays thumbnail preview, and provides official links to watch on YouTube and export via YouTube Studio.',
    },
    {
      title: 'Unsafe Protocol or Private Network Address',
      description: 'Submitting a local network webcam URL or unsafe script scheme.',
      input: 'http://192.168.1.1/cam.mp4 or javascript:alert(1)',
      output: 'Blocked immediately before network dispatch with SSRF protection alert explaining private IP restriction.',
    },
  ]

  const faqs = [
    {
      question: 'What is a direct video URL and how is it different from a webpage link?',
      answer:
        'A direct video URL points directly to an actual media file hosted on a content delivery network or server, typically ending in a media extension like .mp4 or .webm and returning a media MIME type such as video/mp4. In contrast, a webpage link (such as a social media post, blog page, or streaming portal) returns an HTML document containing web code, stylesheets, and embedded players. QUBNEXA is designed to inspect and download direct media streams, rather than scraping web pages.',
    },
    {
      question: 'Which video formats and codecs can be downloaded directly in the browser?',
      answer:
        'QUBNEXA supports direct downloading for MP4 (H.264/AAC or AV1) and WebM (VP8, VP9, or AV1) video streams that are hosted on servers returning standard video/mp4, video/webm, or application/mp4 MIME headers. The media host must also permit cross-origin browser access (CORS). Unsupported formats or files returned as generic text/html cannot be downloaded as video streams.',
    },
    {
      question: 'How does the pre-flight HEAD and 1-byte Range probe work?',
      answer:
        'Before downloading any media bytes, QUBNEXA sends a lightweight HTTP HEAD request with credentials omitted to check the server status, Content-Type, Content-Length, and CORS permissions. If a CDN rejects HEAD requests with status 405 or 501 or omits the Content-Type header, our analyzer dispatches a fallback GET request with a Range header of "bytes=0-1". As soon as headers are verified, the response stream is immediately cancelled, ensuring zero wasted bandwidth and no accidental full downloads during link analysis.',
    },
    {
      question: 'What is CORS and why does it affect video downloading?',
      answer:
        'Cross-Origin Resource Sharing (CORS) is a fundamental web browser security standard. When a web application running on one domain (like qubnexa.online) requests data from a different domain, the destination server must include an "Access-Control-Allow-Origin" header permitting the read. If the video host omits this header, the browser blocks client-side JavaScript from reading the stream chunks into memory for Blob assembly. When this occurs, QUBNEXA uses native video element probing to verify if the video is playable and provides a direct link so you can open or save the file natively in a new tab.',
    },
    {
      question: 'Why does QUBNEXA not download videos directly from YouTube, Instagram, Facebook, X, or TikTok?',
      answer:
        'Major social and streaming platforms use dynamic, short-lived signed URLs, authentication cookies, encrypted streaming protocols (such as DASH or HLS), and strict CORS boundaries. Downloading from these platforms without authorization violates their terms of service, and doing so client-side is technically blocked by browser security policies. QUBNEXA operates purely on static client-side hosting without proxy bypasses or DRM circumvention. Instead, we detect these platforms honestly and provide links to official viewing and authorized creator export routes (such as YouTube Studio, Google Takeout, Meta Accounts Center, and X Data Archives).',
    },
    {
      question: 'What are the memory limits and thresholds for downloading videos?',
      answer:
        'Because QUBNEXA runs entirely within your browser without an intermediary server, video streams are assembled in client RAM as a Blob before being saved to disk. To maintain system stability, the tool provides a warning for videos larger than 250 MB and enforces a hard ceiling of 512 MB. Files exceeding 512 MB cannot be assembled in-browser and should be opened directly in a new tab to download using your browser\'s native file saving pipeline.',
    },
    {
      question: 'How does Content-Disposition filename extraction and sanitization work?',
      answer:
        'When analyzing a media stream, QUBNEXA checks the server\'s Content-Disposition response header for both standard filenames (filename="...") and modern RFC 5987 UTF-8 encoded names (filename*=UTF-8\'\'...). If found, the tool automatically sanitizes the filename by stripping directory traversal sequences (such as ../), ASCII control characters, and reserved operating system symbols (<>:"/\\|?*), ensuring safe saving across Windows, macOS, Linux, Android, and iOS. If no header is sent, a clean filename is derived from the URL path.',
    },
    {
      question: 'What security protections are applied to user-submitted URLs?',
      answer:
        'QUBNEXA validates submitted URLs against strict security rules before making any network requests. Only standard https:// and http:// schemes are allowed. Unsafe schemes such as javascript:, data:, file:, blob:, and ftp: are blocked immediately. Furthermore, URLs with embedded user credentials (user:pass@) and destinations resolving to private, loopback, or link-local IP addresses (such as localhost, 127.0.0.1, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, and 169.254.0.0/16) are rejected to prevent local network probing and Server-Side Request Forgery (SSRF) style abuse.',
    },
    {
      question: 'How should I troubleshoot a network error, 403 Forbidden, or timeout?',
      answer:
        'If a link analysis fails, check the following: 1) Verify that the URL begins with https:// or http:// and points to a direct video file rather than a webpage. 2) Ensure the link has not expired, as temporary CDN URLs frequently expire after a few minutes. 3) HTTP 401 or 403 indicates the server requires authentication, signed session cookies, or referrer tokens that public browser tools cannot provide. 4) If the probe times out after 12 seconds, the remote host may be slow, blocking automated requests, or experiencing downtime.',
    },
    {
      question: 'How are video URLs and media streams processed by this tool?',
      answer:
        'Video inspection and download processing are performed by the browser where supported. Browser security policies and the source server\'s CORS configuration determine which operations are available. Direct HTTP requests to probe or stream media are dispatched directly from your browser to the destination media host, meaning the remote server receives standard web traffic headers as with any direct web request.',
    },
  ]

  const relatedSlugs = [
    'youtube-thumbnail-downloader',
    'social-video-safe-zone-preview',
    'audio-transcriber',
    'subtitle-cleaner',
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Direct Video Downloader — Save MP4 & WebM Streams | QUBNEXA"
      seoDescription="Save direct MP4 and WebM video streams in your browser with live progress, metadata inspection, and filename parsing. 100% free with zero login or setup."
      keywords="video downloader, direct video downloader, mp4 downloader, webm downloader, save video online, video link inspector, stream downloader, qubnexa"
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
