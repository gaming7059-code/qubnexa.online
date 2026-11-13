import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

const footerNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-[32px] items-center rounded-md px-1 -mx-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-[#00DFFF] ${
    isActive
      ? 'text-blue-600 dark:text-[#00DFFF] font-semibold'
      : 'hover:text-blue-600 dark:hover:text-[#00DFFF]'
  }`

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
                <span>Browser-first execution • No sign-up • 100% Free</span>
              </div>
            </div>

            {/* Category Navigation Links */}
            <div className="col-span-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
                Categories
              </h4>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <NavLink to="/categories/calculators" className={footerNavLinkClass}>
                    Calculators &amp; Finance
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/categories/utilities" className={footerNavLinkClass}>
                    Converters &amp; Utilities
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/categories/text-writing" className={footerNavLinkClass}>
                    Text &amp; Writing
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/categories/pdf-documents" className={footerNavLinkClass}>
                    PDF &amp; Documents
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/categories/audio-tools" className={footerNavLinkClass}>
                    Audio &amp; Music Tools
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/categories/video-tools" className={footerNavLinkClass}>
                    Video Tools
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/categories/ai-tools" className={footerNavLinkClass}>
                    AI Tools
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/categories" end className={footerNavLinkClass}>
                    <span className="text-blue-600 dark:text-[#00DFFF] font-medium">All Categories →</span>
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Quick Navigation Links */}
            <div className="col-span-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
                Explore
              </h4>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <NavLink to="/tools" end className={footerNavLinkClass}>
                    All Tools
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/popular" end className={footerNavLinkClass}>
                    Popular Tools
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/new-tools" end className={footerNavLinkClass}>
                    New Tools
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/games" end className={footerNavLinkClass}>
                    Play Games
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/categories" end className={footerNavLinkClass}>
                    Categories
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Legal and Support Links */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
                Information &amp; Legal
              </h4>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <NavLink to="/about" end className={footerNavLinkClass}>
                    About Us
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact" end className={footerNavLinkClass}>
                    Contact Us
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/privacy" end className={footerNavLinkClass}>
                    Privacy Policy
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/terms" end className={footerNavLinkClass}>
                    Terms &amp; Conditions
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <p>© 2026 QUBNEXA. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-500 inline" />
              <span>Explore. Create. Simplify. • Browser-first tools</span>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  )
}
