import React from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Zap,
  Laptop,
  Compass,
  Sparkles,
  Image as ImageIcon,
  Video,
  FileText,
  Mic,
  Calculator,
  Wrench,
  FileCode,
  Search,
  Gamepad2,
  RefreshCw,
} from 'lucide-react'
import { LegalDocumentLayout } from '../components/common/LegalDocumentLayout'
import { usePageSEO, createBreadcrumbSchema } from '../utils/seo'

const PLATFORM_CATEGORIES = [
  {
    name: 'AI Tools',
    summary: 'Structured prompt engineering and browser neural workflows.',
    path: '/categories/ai-tools',
    icon: Sparkles,
  },
  {
    name: 'Image Tools',
    summary: 'Client-side photo enhancement, upscaling, and sharpening.',
    path: '/categories/image-tools',
    icon: ImageIcon,
  },
  {
    name: 'Video Tools',
    summary: 'Public video link inspection and authorized direct download helpers.',
    path: '/categories/video-tools',
    icon: Video,
  },
  {
    name: 'PDF & Documents',
    summary: 'Browser-based PDF editing, signing, annotation, and JPG-to-PDF conversion.',
    path: '/categories/pdf-documents',
    icon: FileText,
  },
  {
    name: 'Audio & Music Tools',
    summary: 'Text-to-Speech voices, audio noise cleaning, EQ, and speech dictation.',
    path: '/categories/audio-tools',
    icon: Mic,
  },
  {
    name: 'Calculators & Finance',
    summary: 'EMI schedules, GST invoices, salary, discount, profit/loss, and date math.',
    path: '/categories/calculators',
    icon: Calculator,
  },
  {
    name: 'Converters & Utilities',
    summary: 'Unit conversion, QR code creation, and client-side password generation.',
    path: '/categories/utilities',
    icon: Wrench,
  },
  {
    name: 'Text & Writing Tools',
    summary: 'Word counting, text repetition, and Unicode-safe text inversion.',
    path: '/categories/text-writing',
    icon: FileCode,
  },
  {
    name: 'SEO & Developer Utilities',
    summary: 'Word and character metrics, URL-safe generators, and content formatters.',
    path: '/tools',
    icon: Search,
  },
  {
    name: 'Games & Entertainment',
    summary: 'Zero-install arcade and strategy mini-games built for desktop and mobile.',
    path: '/categories/games',
    icon: Gamepad2,
  },
] as const

export const AboutPage: React.FC = () => {
  usePageSEO({
    title: 'About Us — QUBNEXA | Your All-in-One Online Tools Platform',
    description:
      'Learn about QUBNEXA (Explore. Create. Simplify.) — an all-in-one browser-based platform offering calculators, AI tools, PDF editors, media utilities, text tools, and games.',
    canonicalPath: '/about',
    keywords:
      'about qubnexa, explore create simplify, all-in-one online tools platform, browser utilities, free online calculators',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About QUBNEXA',
        description:
          'QUBNEXA is an all-in-one online tools platform focused on fast, accessible browser-based productivity.',
      },
      createBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
      ]),
    ],
  })

  return (
    <LegalDocumentLayout
      eyebrow="Explore. Create. Simplify."
      title="About QUBNEXA"
      subtitle="Your All-in-One Online Tools Platform — bringing everyday calculators, media workflows, writing helpers, developer utilities, and browser games together in one clean workspace."
      lastUpdated="November 12, 2026"
      breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'About Us' }]}
    >
      <div className="text-slate-600 dark:text-slate-300 space-y-6 text-sm sm:text-base leading-relaxed">
        {/* Introduction & Overview */}
        <section className="xw-panel p-6 sm:p-8 space-y-4 shadow-2xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            What QUBNEXA Is Built For
          </h2>
          <p>
            Looking up a quick loan installment, cleaning a voice clip, editing a PDF, or repeating
            formatted text often forces people across dozens of cluttered sites filled with pop-ups,
            mandatory sign-ups, or confusing menus.
          </p>
          <p>
            <strong>QUBNEXA</strong> removes that friction. Guided by the tagline{' '}
            <em>&ldquo;Explore. Create. Simplify.&rdquo;</em>, the platform brings practical tools
            into a single consistent interface that opens directly in your browser without requiring
            account registration or paid subscriptions.
          </p>
        </section>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <section className="xw-surface p-6 space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
              <Compass className="h-5 w-5 text-cyan-600 dark:text-[#00DFFF]" />
              <h2>Our Mission</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Make everyday digital problem-solving effortless by organizing clear, fast, and
              accessible browser utilities for students, creators, developers, and professionals.
            </p>
          </section>

          <section className="xw-surface p-6 space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
              <Zap className="h-5 w-5 text-purple-600 dark:text-[#8B5CF6]" />
              <h2>Our Vision</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Build an intuitive, modern web toolkit where discovering a calculator, converter, or
              media utility takes seconds on mobile or desktop without unnecessary bloat.
            </p>
          </section>
        </div>

        {/* Core Platform Approach */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            How the Platform Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="xw-surface p-5 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-[#00DFFF]" />
                <span>Browser-First Execution</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Most calculators, text utilities, PDF edits, and image enhancers run locally in browser
                memory. Where a tool optionally uses an external endpoint (such as Bring-Your-Own-Key
                cloud speech or URL inspection), it is documented clearly in our Privacy Policy.
              </p>
            </div>

            <div className="xw-surface p-5 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <Laptop className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span>Responsive &amp; Accessible</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Every page supports light and dark themes, keyboard navigation, smart search
                shortcuts (<kbd className="px-1 py-0.5 text-[11px] rounded border border-slate-300 dark:border-slate-700">Ctrl K</kbd>),
                and mobile-friendly layouts.
              </p>
            </div>

            <div className="xw-surface p-5 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <RefreshCw className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span>Continuously Evolving</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Tools, algorithms, supported file formats, and interface features are updated over
                time and may change or expand as web standards evolve.
              </p>
            </div>
          </div>
        </section>

        {/* Tool Categories Covered */}
        <section className="xw-panel p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Main Tool Categories on QUBNEXA
            </h2>
            <Link
              to="/tools"
              className="text-xs font-semibold text-blue-600 dark:text-[#00DFFF] hover:underline"
            >
              Browse All Tools →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {PLATFORM_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.name}
                  to={cat.path}
                  className="flex items-start gap-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#11182D]/60 p-3.5 hover:border-blue-400 dark:hover:border-[#00DFFF]/50 transition-colors"
                >
                  <Icon className="h-5 w-5 shrink-0 mt-0.5 text-blue-600 dark:text-[#00DFFF]" />
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{cat.name}</div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {cat.summary}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="xw-result-hero flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Questions or Feedback?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
              Review our Privacy Policy, Terms &amp; Conditions, or reach our team directly at{' '}
              <a href="mailto:qubnexa.official@gmail.com" className="text-blue-600 dark:text-[#00DFFF] underline font-medium">
                qubnexa.official@gmail.com
              </a>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link to="/privacy" className="xw-btn-secondary text-xs sm:text-sm">
              Privacy Policy
            </Link>
            <Link to="/contact" className="xw-btn-primary text-xs sm:text-sm">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </LegalDocumentLayout>
  )
}
