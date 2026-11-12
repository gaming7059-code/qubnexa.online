import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Search, Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { PRIMARY_CATEGORIES } from '../../data/categoriesData'

interface HeaderProps {
  onOpenSearch: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const pathname = location.pathname

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks: Array<{ to: string; label: string; exact?: boolean; matchPrefixes?: string[] }> = [
    { to: '/', label: 'Home', exact: true },
    { to: '/tools', label: 'All Tools', matchPrefixes: ['/tools'] },
    { to: '/categories', label: 'Categories', matchPrefixes: ['/categories'] },
    { to: '/popular', label: 'Popular', exact: true },
    { to: '/new-tools', label: 'New Tools', exact: true },
    { to: '/about', label: 'About', exact: true },
  ]

  const isLinkActive = (link: typeof navLinks[0]) => {
    if (link.to === '/') return pathname === '/'
    if (link.matchPrefixes) {
      return link.matchPrefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))
    }
    if (link.exact) return pathname === link.to
    return pathname.startsWith(link.to)
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ease-out ${
        isScrolled
          ? 'border-b border-slate-200/90 dark:border-cyan-500/20 bg-white/85 dark:bg-[#050814]/85 backdrop-blur-md shadow-md dark:shadow-[0_4px_24px_rgba(6,182,212,0.08)]'
          : 'border-b border-transparent bg-white/95 dark:bg-[#050814]/95 shadow-none'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link 
          to="/" 
          className="group flex items-center gap-2.5 shrink-0 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          aria-label="Xenova-World Homepage"
        >
          <img
            src={`${import.meta.env.BASE_URL}branding/xenova-world-icon.png`}
            alt="Xenova-World logo"
            width={40}
            height={40}
            className="h-9 w-9 sm:h-10 sm:w-10 object-contain rounded-full bg-[#050814] ring-1 ring-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)] transition-transform duration-300 group-hover:scale-105 shrink-0"
            loading="eager"
            decoding="async"
          />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight whitespace-nowrap">
              Xenova<span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">-World</span>
            </span>
            <span className="text-[10px] font-medium tracking-wider text-slate-500 dark:text-cyan-300/80 whitespace-nowrap hidden sm:block md:hidden lg:block">
              Explore Beyond Limits.
            </span>
          </div>
        </Link>

        {/* Desktop & Tablet Navigation */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
          {navLinks.map((link) => {
            const active = isLinkActive(link)
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`inline-flex min-h-[40px] items-center rounded-xl px-2.5 lg:px-3.5 py-1.5 text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-[#00DFFF] ${
                  active
                    ? 'bg-cyan-50 dark:bg-[#11182D] text-cyan-800 dark:text-[#00DFFF] font-semibold shadow-2xs border border-cyan-200/80 dark:border-[#00DFFF]/35'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#11182D] hover:text-slate-900 dark:hover:text-white border border-transparent'
                }`}
              >
                {link.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Right Actions: Search + Theme Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex min-h-[44px] min-w-[44px] md:min-h-[40px] md:min-w-0 justify-center cursor-pointer items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-[#11182D] px-2.5 lg:px-3 py-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-200 hover:border-blue-500/60 dark:hover:border-[#00DFFF]/60 hover:bg-slate-100 dark:hover:bg-[#16203B] transition-all duration-200 ease-out active:scale-[0.98] shadow-2xs whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-[#00DFFF]"
            aria-label="Search tools"
            title="Search tools (Ctrl+K)"
          >
            <Search className="h-4 w-4 text-slate-500 dark:text-[#00DFFF] transition-colors" />
            <span className="hidden lg:inline">Search tools...</span>
            <kbd className="hidden xl:inline-block rounded-md bg-white dark:bg-[#0B1020] px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Ctrl K
            </kbd>
          </button>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl p-2 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#11182D] transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-[#00DFFF]"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-[#050814]/98 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 shadow-xl animate-drawer-down">
          {navLinks.map((link) => {
            const active = isLinkActive(link)
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={`flex min-h-[44px] items-center rounded-xl px-3.5 py-2.5 text-base font-medium transition-all duration-200 ${
                  active
                    ? 'bg-cyan-50 dark:bg-[#11182D] text-cyan-800 dark:text-[#00DFFF] font-semibold border border-cyan-200/80 dark:border-[#00DFFF]/35'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#11182D] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </NavLink>
            )
          })}

          {/* Quick Categories in Mobile Menu */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <span className="block px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Browse Categories
            </span>
            <div className="mt-1.5 flex flex-wrap gap-2 px-3">
              {PRIMARY_CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  to={c.path}
                  onClick={closeMobileMenu}
                  className="inline-flex min-h-[38px] items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1020] px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-blue-500/40 dark:hover:border-[#00DFFF]/40 hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between px-3 py-1 text-sm text-slate-700 dark:text-slate-200">
            <span className="font-medium">Theme</span>
            <ThemeToggle showLabel />
          </div>
        </div>
      )}
    </header>
  )
}
