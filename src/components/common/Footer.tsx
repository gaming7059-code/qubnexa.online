import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B1020] text-slate-600 dark:text-slate-400 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            {/* Brand and Description */}
            <div className="col-span-2 md:col-span-2 space-y-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-90"
                aria-label="QUBNEXA Homepage"
              >
                <img
                  src={`${import.meta.env.BASE_URL}branding/qubnexa-icon.png`}
                  alt="QUBNEXA logo"
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain rounded-full bg-[#050814] ring-1 ring-cyan-500/35 shadow-[0_0_12px_rgba(0,223,255,0.18)] shrink-0"
                  loading="lazy"
                  decoding="async"
                />
                <div className="flex flex-col">
                  <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                    QUB<span className="text-cyan-600 dark:text-[#00DFFF]">NEXA</span>
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-[#00DFFF]/80">
                    Explore. Create. Simplify.
                  </span>
                </div>
              </Link>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
                Your All-in-One Online Tools Platform. Explore free AI tools, calculators, PDF utilities, image and video tools, audio studio, converters, and browser games on QUBNEXA.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Client-side execution • No sign-up • 100% Free</span>
              </div>
            </div>

            {/* Category Navigation Links */}
            <div className="col-span-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
                Categories
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/categories/calculators" className="hover:text-blue-600 dark:hover:text-[#00DFFF] inline-block transition-colors duration-200">
                    Calculators &amp; Finance
                  </Link>
                </li>
                <li>
                  <Link to="/categories/utilities" className="hover:text-blue-600 dark:hover:text-[#00DFFF] inline-block transition-colors duration-200">
                    Converters &amp; Utilities
                  </Link>
                </li>
                <li>
                  <Link to="/categories/pdf-documents" className="hover:text-blue-600 dark:hover:text-[#00DFFF] inline-block transition-colors duration-200">
                    PDF &amp; Documents
                  </Link>
                </li>
                <li>
                  <Link to="/categories/audio-tools" className="hover:text-blue-600 dark:hover:text-[#00DFFF] inline-block transition-colors duration-200">
                    Audio &amp; Music Tools
                  </Link>
                </li>
                <li>
                  <Link to="/categories/video-tools" className="hover:text-blue-600 dark:hover:text-[#00DFFF] inline-block transition-colors duration-200">
                    Video Tools
                  </Link>
                </li>
                <li>
                  <Link to="/categories/ai-tools" className="hover:text-blue-600 dark:hover:text-[#00DFFF] inline-block transition-colors duration-200">
                    AI Tools
                  </Link>
                </li>
                <li>
                  <Link to="/categories/games" className="hover:text-blue-600 dark:hover:text-[#00DFFF] inline-block transition-colors duration-200">
                    Games Arena
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="text-blue-600 dark:text-[#00DFFF] font-medium hover:underline inline-block transition-colors duration-200">
                    All Categories →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Navigation Links */}
            <div className="col-span-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
                Explore
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/tools" className="hover:text-blue-600 dark:hover:text-[#00DFFF] inline-block transition-colors duration-200">
                    All Tools
                  </Link>
                </li>
                <li>
                  <Link to="/popular" className="hover:text-blue-600 dark:hover:text-[#00DFFF] inline-block transition-colors duration-200">
                    Popular Tools
                  </Link>
                </li>
                <li>
                  <Link to="/new-tools" className="hover:text-blue-600 dark:hover:text-[#00DFFF] inline-block transition-colors duration-200">
                    New Tools
                  </Link>
                </li>
                <li>
                  <Link to="/games" className="hover:text-blue-600 dark:hover:text-[#00DFFF] inline-block transition-colors duration-200">
                    Play Games
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="hover:text-blue-600 dark:hover:text-[#00DFFF] inline-block transition-colors duration-200">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-blue-600 dark:hover:text-[#00DFFF] inline-block transition-colors duration-200">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal and Support Links */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
                Information
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/contact" className="hover:text-blue-600 dark:hover:text-[#00DFFF] inline-block transition-colors duration-200">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-[#00DFFF] inline-block transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-blue-600 dark:hover:text-[#00DFFF] inline-block transition-colors duration-200">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <p>© 2026 QUBNEXA. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-500 inline" />
              <span>Explore. Create. Simplify. • Built for privacy &amp; speed</span>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  )
}
