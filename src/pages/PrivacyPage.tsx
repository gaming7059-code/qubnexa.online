import React from 'react'
import { Link } from 'react-router-dom'
import { LegalDocumentLayout, type LegalSectionTocItem } from '../components/common/LegalDocumentLayout'
import { usePageSEO, createBreadcrumbSchema } from '../utils/seo'

const PRIVACY_TOC: LegalSectionTocItem[] = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'information-collected', title: '2. Information We Collect' },
  { id: 'how-we-use', title: '3. How We Use Information' },
  { id: 'storage-and-cookies', title: '4. Browser Storage & Cookies' },
  { id: 'file-text-processing', title: '5. File & Text Processing' },
  { id: 'third-party-services', title: '6. Third-Party Services' },
  { id: 'data-retention', title: '7. Data Retention' },
  { id: 'data-security', title: '8. Data Security' },
  { id: 'childrens-privacy', title: '9. Children’s Privacy' },
  { id: 'user-rights', title: '10. User Rights & Controls' },
  { id: 'policy-updates', title: '11. Policy Updates' },
  { id: 'contact-info', title: '12. Contact Information' },
]

export const PrivacyPage: React.FC = () => {
  usePageSEO({
    title: 'Privacy Policy — How QUBNEXA Handles Data & Browser Storage',
    description:
      'Read the QUBNEXA Privacy Policy based on actual platform behavior: local browser processing, localStorage preferences, zero tracking cookies, and optional external endpoints.',
    canonicalPath: '/privacy',
    keywords:
      'qubnexa privacy policy, browser storage, client-side tools privacy, localstorage tools, third-party api disclosure',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'QUBNEXA Privacy Policy',
        description:
          'Accurate disclosure of QUBNEXA client-side processing, localStorage keys, third-party APIs, and user privacy controls.',
      },
      createBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Privacy Policy', path: '/privacy' },
      ]),
    ],
  })

  return (
    <LegalDocumentLayout
      eyebrow="Legal & Privacy"
      title="Privacy Policy"
      subtitle="A transparent breakdown of how QUBNEXA processes inputs, what stays in your browser, what is stored locally, and which optional features communicate with external services."
      lastUpdated="November 12, 2026"
      breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Privacy Policy' }]}
      tocItems={PRIVACY_TOC}
    >
      <div className="xw-panel p-6 sm:p-10 shadow-2xs space-y-8 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
        <section id="introduction" className="scroll-mt-24 space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            1. Introduction
          </h2>
          <p>
            QUBNEXA (&ldquo;Explore. Create. Simplify.&rdquo;) is a browser-based online tools
            platform providing calculators, converters, PDF utilities, image and audio tools, writing
            utilities, prompt builders, video link helpers, and mini-games. This Privacy Policy
            describes how data is handled across the QUBNEXA web application based on its actual
            technical implementation.
          </p>
        </section>

        <section id="information-collected" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            2. Information We Collect
          </h2>
          <p>
            QUBNEXA does not offer user accounts, logins, sign-up walls, or central database profiles,
            and we do not collect personal identification documents or payment card details.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li>
              <strong>No Tracking Telemetry by QUBNEXA:</strong> Code inspection confirms there are
              no Google Analytics, AdSense, advertising pixels, or behavioral tracking scripts
              embedded inside QUBNEXA.
            </li>
            <li>
              <strong>Hosting Infrastructure Logs:</strong> Like all websites, static hosting or CDN
              infrastructure (such as Cloudflare Pages or your deployment host) may automatically
              process standard HTTP request metadata (IP address, user-agent, requested path, and
              timestamp) to deliver files and protect against abuse.
            </li>
            <li>
              <strong>Contact Us Form:</strong> As detailed on the{' '}
              <Link to="/contact" className="text-blue-600 dark:text-[#00DFFF] underline">
                Contact Us
              </Link>{' '}
              page, QUBNEXA currently uses a frontend-only validation form with no live backend mail
              endpoint; entered fields stay in local React state in your tab and are not transmitted.
            </li>
          </ul>
        </section>

        <section id="how-we-use" className="scroll-mt-24 space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            3. How We Use Information
          </h2>
          <p>
            Information you enter into tools—such as numbers, text snippets, uploaded documents,
            images, or audio clips—is used solely to perform the action you requested inside the active
            tool (such as rendering calculations, converting formats, generating QR codes, or running
            client-side synthesis). Local preference values stored in your browser are used only to
            preserve theme selection, convenient shortcuts, game scores, or optional user-entered API
            settings between visits.
          </p>
        </section>

        <section id="storage-and-cookies" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            4. Browser Storage and Cookies
          </h2>
          <p>
            QUBNEXA application code does <strong>not</strong> set or read browser cookies (
            <code className="text-xs bg-slate-100 dark:bg-[#11182D] px-1.5 py-0.5 rounded">
              document.cookie
            </code>
            ). Instead, QUBNEXA uses browser{' '}
            <code className="text-xs bg-slate-100 dark:bg-[#11182D] px-1.5 py-0.5 rounded">
              localStorage
            </code>{' '}
            and Cache Storage strictly on your device:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li>
              <strong>Theme Preference (<code>smarttools_theme</code>):</strong> Stores your light or
              dark mode selection.
            </li>
            <li>
              <strong>Recently Used Tools (<code>xw_recent_tools_v1</code>):</strong> Remembers up
              to 6 recently opened tool IDs locally (with timestamps) to power the Quick Recent
              Tools strip and search shortcuts; you can clear this anytime via the UI or browser
              storage settings.
            </li>
            <li>
              <strong>PDF Editor Signatures (<code>smarttools_saved_signatures</code>):</strong>{' '}
              Stores drawn or typed signatures you choose to save for reuse inside the PDF Editor.
            </li>
            <li>
              <strong>Optional Cloud TTS Configuration (<code>smarttools_tts_cloud_config</code>):</strong>{' '}
              Stores an OpenAI or ElevenLabs provider preference and API key only if you enter one
              in Cloud Settings.
            </li>
            <li>
              <strong>Browser Games Storage:</strong> Saves local mute state (
              <code>smarttools_games_muted</code>) and local mini-game scores/stats (
              <code>smarttools_snake_highscore</code>, <code>smarttools_memory_best_moves</code>,{' '}
              <code>smarttools_rps_best_streak</code>, <code>smarttools_ttt_stats</code>,{' '}
              <code>smarttools_guess_stats</code>).
            </li>
            <li>
              <strong>Browser Cache Storage:</strong> Stores downloaded ONNX voice model weights
              when you load Offline Browser Neural TTS so models do not need to be re-downloaded
              each session.
            </li>
          </ul>
        </section>

        <section id="file-text-processing" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            5. File and Text Processing
          </h2>
          <p>
            It is important to distinguish between tools that process everything strictly in your
            local browser memory and features that initiate external network or native browser-engine
            calls:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li>
              <strong>Processed Locally in Browser Memory:</strong> Calculators (EMI, GST, Salary,
              Discount, Profit &amp; Loss, Percentage, Age, Date &amp; Time), Unit Converter, Word
              Counter, Text Repeater (unless you click Share to WhatsApp), Text Inverter (unless
              you click Share to WhatsApp), PDF Editor, JPG to PDF, Image Quality Increaser, Audio
              Studio DSP cleaning/trimming, QR Code Generator, and Password Generator run locally
              without uploading your files or text to a QUBNEXA server.
            </li>
            <li>
              <strong>Features With External or OS/Browser Transmission:</strong> Text-to-Speech
              cloud/neural options, Audio Transcriber live microphone dictation, PDF signature font
              loading, and Video Downloader URL analysis interact with external endpoints or browser
              speech engines as detailed in Section 6.
            </li>
          </ul>
        </section>

        <section id="third-party-services" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            6. Third-Party Services &amp; External Connections
          </h2>
          <p>
            Depending on which specific tool features you choose to run, your browser may connect
            directly to third-party services outside QUBNEXA&apos;s control:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li>
              <strong>Hugging Face Model Downloads (Browser Neural TTS):</strong> Choosing the
              offline ONNX Text-to-Speech engine downloads voice model weights (
              <code>Xenova/mms-tts-eng</code> / <code>Xenova/mms-tts-hin</code>) from Hugging Face
              CDN endpoints into your browser cache. Once downloaded, speech synthesis runs locally in
              WebAssembly.
            </li>
            <li>
              <strong>OpenAI Audio API (Optional BYOK Cloud Studio TTS):</strong> If you explicitly
              supply your own API key in Cloud Settings and synthesize audio with Cloud Studio,
              your browser sends the input text and your Authorization key directly to{' '}
              <code>https://api.openai.com/v1/audio/speech</code>.
            </li>
            <li>
              <strong>Local TTS Companion Server (Optional User-Run Service):</strong> If you start
              the optional local Python server on <code>http://127.0.0.1:8000</code>, text stays
              between your browser and localhost, while the companion server uses{' '}
              <code>edge-tts</code> (Microsoft Edge&apos;s online neural speech endpoint) to
              generate audio.
            </li>
            <li>
              <strong>Browser Web Speech &amp; Dictation Engines:</strong> Browser-native
              Text-to-Speech (<code>speechSynthesis</code>) and Audio Transcriber live dictation (
              <code>SpeechRecognition</code>) use your browser vendor or operating system speech
              engine, which in some browsers sends microphone audio to vendor servers (such as Google
              or Microsoft) for transcription.
            </li>
            <li>
              <strong>Google Fonts (PDF Editor Cursive Signatures):</strong> Opening typed cursive
              signature styles in PDF Editor requests font stylesheets from{' '}
              <code>fonts.googleapis.com</code>.
            </li>
            <li>
              <strong>Public Video Links &amp; YouTube Thumbnails (Video Downloader):</strong>{' '}
              Submitting a URL initiates a client-side HTTP request (with credentials omitted) to
              that user-specified public host to check stream availability, may load YouTube
              thumbnails from <code>i.ytimg.com</code>, and links to platform official data portals.
            </li>
            <li>
              <strong>WhatsApp Share Links (Text Repeater &amp; Text Inverter):</strong> Clicking the
              WhatsApp button opens <code>https://wa.me/?text=...</code> in a new tab with up to
              1,800 characters of generated output only when explicitly clicked.
            </li>
          </ul>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Third-party services operate under their own privacy policies and terms. QUBNEXA has no
            visibility into or control over external providers after your browser connects to them.
          </p>
        </section>

        <section id="data-retention" className="scroll-mt-24 space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            7. Data Retention
          </h2>
          <p>
            Temporary inputs inside tool workspaces exist only in active browser RAM and are cleared
            when you refresh or close the tab. Entries stored in{' '}
            <code className="text-xs bg-slate-100 dark:bg-[#11182D] px-1.5 py-0.5 rounded">
              localStorage
            </code>{' '}
            or browser Cache Storage remain on your device until you clear them using tool controls
            or your browser&apos;s site data settings. QUBNEXA does not maintain a central user data
            warehouse.
          </p>
        </section>

        <section id="data-security" className="scroll-mt-24 space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            8. Data Security
          </h2>
          <p>
            Processing files and inputs locally reduces exposure from server-side breaches on our
            part, and sensitive client-side features enforce URL safety validation (blocking private
            IP ranges and unsafe schemes like <code>javascript:</code>). However, because{' '}
            <code>localStorage</code> is accessible to scripts in the same origin and your own
            browser extensions, avoid storing sensitive API keys or personal signatures on shared or
            public computers.
          </p>
        </section>

        <section id="childrens-privacy" className="scroll-mt-24 space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            9. Children&apos;s Privacy
          </h2>
          <p>
            QUBNEXA provides general-purpose utility tools and casual browser games and does not
            knowingly collect personal registration data from children. Parents or guardians using
            shared devices can clear browser storage at any time.
          </p>
        </section>

        <section id="user-rights" className="scroll-mt-24 space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            10. User Rights &amp; Controls
          </h2>
          <p>
            Because QUBNEXA stores preferences only on your own device rather than on QUBNEXA user
            accounts, you hold direct control over your local data:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li>Clear Recently Used Tools history directly from the Recent Tools bar.</li>
            <li>Delete saved PDF signatures or remove your Cloud TTS API key inside those tools.</li>
            <li>Clear cached TTS voice models from the Neural Speech settings or browser Cache API.</li>
            <li>Clear all site data and storage anytime through your browser privacy controls.</li>
          </ul>
        </section>

        <section id="policy-updates" className="scroll-mt-24 space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            11. Policy Updates
          </h2>
          <p>
            We may update this Privacy Policy whenever QUBNEXA adds new tools, integrates analytics
            or backend contact services, or modifies how browser storage works. Any revisions will be
            reflected by updating the &ldquo;Last updated&rdquo; date at the top of this page.
          </p>
        </section>

        <section id="contact-info" className="scroll-mt-24 space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            12. Contact Information
          </h2>
          <p>
            You can review current inquiry and support channel status on the{' '}
            <Link to="/contact" className="text-blue-600 dark:text-[#00DFFF] underline">
              Contact Us
            </Link>{' '}
            page. Direct owner email or live messaging details will be published there once configured.
          </p>
        </section>
      </div>
    </LegalDocumentLayout>
  )
}
