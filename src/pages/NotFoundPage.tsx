import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Compass, ArrowRight } from 'lucide-react'
import { usePageSEO } from '../utils/seo'

export const NotFoundPage: React.FC = () => {
  usePageSEO({
    title: '404 — Page Not Found | Xenova-World',
    description: 'The requested page or tool could not be found on Xenova-World. Explore our free calculators and online tools.',
    noindex: true,
  })

  const popularTools = [
    { name: 'EMI Calculator', path: '/tools/emi-calculator', desc: 'Home, car & personal loan EMIs' },
    { name: 'GST Calculator', path: '/tools/gst-calculator', desc: 'Add or remove GST tax slabs' },
    { name: 'Salary Calculator', path: '/tools/salary-calculator', desc: 'In-hand take-home CTC pay' },
    { name: 'Percentage Calculator', path: '/tools/percentage-calculator', desc: 'Percentage growth & ratios' },
    { name: 'Age Calculator', path: '/tools/age-calculator', desc: 'Exact age in years, months & days' },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-8 animate-fade-in-up">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-[#11182D] border border-blue-100 dark:border-slate-800 text-blue-600 dark:text-[#00DFFF] mx-auto shadow-2xs">
        <Compass className="h-8 w-8" />
      </div>
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900/50">
          404 Error
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-3">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          The tool or page you are looking for does not exist or may have been moved.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="xw-btn-primary min-h-[44px] px-5 py-2.5 text-sm shadow-xs"
        >
          <Home className="h-4 w-4" />
          <span>Back to Homepage</span>
        </Link>
        <Link
          to="/tools"
          className="xw-btn-secondary min-h-[44px] px-5 py-2.5 text-sm"
        >
          <span>Browse All Tools</span>
        </Link>
        <Link
          to="/games"
          className="xw-btn-secondary min-h-[44px] px-5 py-2.5 text-sm"
        >
          <span>Play Free Games</span>
        </Link>
      </div>

      {/* Helpful Recommendations */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-left max-w-xl mx-auto">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 text-center">
          Looking for our most popular tools?
        </h2>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 xw-surface overflow-hidden shadow-2xs">
          {popularTools.map((t) => (
            <Link
              key={t.path}
              to={t.path}
              className="flex min-h-[56px] items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-[#11182D] transition-colors group"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-[#00DFFF] transition-colors">
                  {t.name}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{t.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-[#00DFFF] group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
