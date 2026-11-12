import React from 'react'
import { ShieldCheck, Zap, Laptop, Users } from 'lucide-react'
import { usePageSEO, createBreadcrumbSchema } from '../utils/seo'

export const AboutPage: React.FC = () => {
  usePageSEO({
    title: 'About Us — Your All-in-One Online Tools Platform | QUBNEXA',
    description: 'Learn about QUBNEXA, our mission to build fast, privacy-first, client-side digital calculators and modern utility tools designed for users worldwide.',
    canonicalPath: '/about',
    keywords: 'about qubnexa, free online utilities, client-side calculators, modern digital ecosystem, private web utilities',
    schema: createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about' },
    ]),
  })
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 animate-fade-in-up">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-[#00DFFF]">
          Our Mission — Explore. Create. Simplify.
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1.5">
          About QUBNEXA
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          QUBNEXA was established with a singular objective: to deliver fast, free, futuristic, and reliable everyday digital tools for creators, students, developers, and professionals worldwide.
        </p>
      </div>

      <div className="text-slate-600 dark:text-slate-300 space-y-6 text-sm sm:text-base leading-relaxed">
        <section className="xw-panel p-6 sm:p-8 space-y-4 shadow-2xs">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Why We Built QUBNEXA
          </h2>
          <p>
            When searching for basic calculators online—such as calculating a loan EMI, finding tax rates, or converting units—users are frequently confronted with heavy ads, mandatory sign-up popups, slow loading speeds, and complex interfaces.
          </p>
          <p>
            QUBNEXA removes that friction. We believe essential computational and creative utilities should be as fast and effortless as opening a native workspace.
          </p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="xw-surface p-5 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-2 text-slate-900 dark:text-white font-semibold">
              <Zap className="h-5 w-5 text-amber-500" />
              <span>Speed and Simplicity</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Zero bloat, minimal dependencies, and lightning-fast loading across all networks including mobile 4G/5G connections.
            </p>
          </div>

          <div className="xw-surface p-5 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-2 text-slate-900 dark:text-white font-semibold">
              <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-[#00DFFF]" />
              <span>Client-Side Privacy</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Your inputs remain inside your browser. No personal finance information or dates are transmitted to remote servers.
            </p>
          </div>

          <div className="xw-surface p-5 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-2 text-slate-900 dark:text-white font-semibold">
              <Laptop className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span>Mobile-First Experience</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Designed from the ground up to be seamless on both modern handheld smartphones and large desktop screens.
            </p>
          </div>

          <div className="xw-surface p-5 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-2 text-slate-900 dark:text-white font-semibold">
              <Users className="h-5 w-5 text-purple-600 dark:text-[#8B5CF6]" />
              <span>Global Utility &amp; Tax Support</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Supports international metric/imperial units alongside specialized regional tax slabs (GST) and currency formatting.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
