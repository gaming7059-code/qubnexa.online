import React, { useState, useCallback, useMemo } from 'react'
import {
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  Sparkles,
  Lock,
} from 'lucide-react'
import {
  type PasswordOptions,
  generateMultiplePasswords,
  calculatePasswordStrength,
} from '../../utils/passwordGenerator'

const LENGTH_PRESETS = [12, 16, 24, 32]

export const PasswordGenerator: React.FC = () => {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: false,
  })

  const [passwordCount, setPasswordCount] = useState<number>(1)
  const [generationCount, setGenerationCount] = useState<number>(0)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [isRotating, setIsRotating] = useState(false)

  // Validation: at least one character set must be selected
  const hasValidPool = useMemo(() => {
    return (
      options.includeUppercase ||
      options.includeLowercase ||
      options.includeNumbers ||
      options.includeSymbols
    )
  }, [options])

  // Derive passwords directly without useEffect setState waterfalls
  const passwords = useMemo(() => {
    if (!hasValidPool) return []
    void generationCount
    return generateMultiplePasswords(options, passwordCount)
  }, [options, passwordCount, hasValidPool, generationCount])

  // Generator trigger
  const handleGenerate = useCallback(() => {
    setIsRotating(true)
    setTimeout(() => setIsRotating(false), 350)
    setGenerationCount((c) => c + 1)
    setCopiedIndex(null)
  }, [])

  // Primary password strength
  const primaryPassword = passwords[0] || ''
  const strength = useMemo(() => {
    return calculatePasswordStrength(primaryPassword)
  }, [primaryPassword])

  // Copy handler
  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {
      // fallback
    }
  }

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(passwords.join('\n'))
      setCopiedIndex(-1)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. PRIMARY PASSWORD DISPLAY HERO CARD */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-blue-500" />
            <span>Generated Secure Password</span>
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            {options.length} Characters
          </span>
        </div>

        {/* Big Password Output Box */}
        {hasValidPool && primaryPassword ? (
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-2xl bg-slate-50 dark:bg-[#050814] border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
            <div className="font-mono text-lg sm:text-2xl font-bold tracking-wider text-slate-900 dark:text-slate-100 break-all select-all">
              {primaryPassword}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => handleCopy(primaryPassword, 0)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold shadow-xs transition-all ${
                  copiedIndex === 0
                    ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-95'
                }`}
                title="Copy Password"
              >
                {copiedIndex === 0 ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleGenerate}
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#11182D] text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 shadow-2xs transition-all active:scale-95"
                title="Regenerate New Password"
                aria-label="Regenerate Password"
              >
                <RefreshCw className={`h-4 w-4 ${isRotating ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 p-6 text-center space-y-2">
            <AlertTriangle className="h-6 w-6 text-rose-500 mx-auto" />
            <p className="text-sm font-bold text-rose-700 dark:text-rose-400">
              No Character Sets Selected
            </p>
            <p className="text-xs text-rose-600 dark:text-rose-400/80">
              Please check at least one option below (Uppercase, Lowercase, Numbers, or Symbols) to generate a password.
            </p>
          </div>
        )}

        {/* Strength Meter */}
        {hasValidPool && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">
                Security Strength:{' '}
                <span className="font-bold text-slate-900 dark:text-white">
                  {strength.label} ({strength.entropyBits} bits entropy)
                </span>
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Crack Time: <span className="font-medium text-slate-700 dark:text-slate-300">{strength.crackTimeEstimate}</span>
              </span>
            </div>

            {/* 5-Segment Strength Bar */}
            <div className="grid grid-cols-5 gap-1.5 h-2">
              {[0, 1, 2, 3, 4].map((seg) => {
                const isActive = strength.score >= seg
                return (
                  <div
                    key={seg}
                    className={`h-full rounded-full transition-all duration-300 ${
                      isActive ? strength.colorClass : 'bg-slate-200 dark:bg-[#11182D]'
                    }`}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. CONFIGURATION PANEL (2 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: LENGTH & OPTIONS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-7 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-blue-500" />
              <span>Password Length &amp; Rules</span>
            </h2>

            {/* Length Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="passwordLengthSlider" className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password Length
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="4"
                    max="128"
                    value={options.length}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10)
                      if (!isNaN(val)) {
                        setOptions({ ...options, length: Math.max(4, Math.min(128, val)) })
                      }
                    }}
                    className="w-16 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] px-2 py-1 text-center font-mono text-sm font-bold text-blue-600 dark:text-blue-400"
                  />
                  <span className="text-xs text-slate-500">chars</span>
                </div>
              </div>

              <input
                id="passwordLengthSlider"
                type="range"
                min="4"
                max="128"
                value={options.length}
                onChange={(e) =>
                  setOptions({ ...options, length: parseInt(e.target.value, 10) })
                }
                className="w-full accent-blue-600 cursor-pointer"
              />

              {/* Quick Presets */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-medium text-slate-400 mr-1">Presets:</span>
                {LENGTH_PRESETS.map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => setOptions({ ...options, length: len })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      options.length === len
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-[#11182D] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1B2748]'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            {/* Character Set Checkboxes */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Include Characters
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#050814]/40 hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={options.includeUppercase}
                    onChange={(e) =>
                      setOptions({ ...options, includeUppercase: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Uppercase Letters</span>
                    <span className="block font-mono text-[11px] text-slate-400 mt-0.5">A B C D E F ...</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#050814]/40 hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={options.includeLowercase}
                    onChange={(e) =>
                      setOptions({ ...options, includeLowercase: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Lowercase Letters</span>
                    <span className="block font-mono text-[11px] text-slate-400 mt-0.5">a b c d e f ...</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#050814]/40 hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={options.includeNumbers}
                    onChange={(e) =>
                      setOptions({ ...options, includeNumbers: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Numbers</span>
                    <span className="block font-mono text-[11px] text-slate-400 mt-0.5">0 1 2 3 4 5 6 7 8 9</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#050814]/40 hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={options.includeSymbols}
                    onChange={(e) =>
                      setOptions({ ...options, includeSymbols: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Special Symbols</span>
                    <span className="block font-mono text-[11px] text-slate-400 mt-0.5">! @ # $ % ^ &amp; * ( )</span>
                  </div>
                </label>
              </div>

              {/* Exclusion toggle */}
              <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#050814]/40 hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={options.excludeAmbiguous}
                  onChange={(e) =>
                    setOptions({ ...options, excludeAmbiguous: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    Exclude Ambiguous Characters
                  </span>
                  <span className="block font-mono text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Omits easily confused characters like i, l, 1, L, o, 0, O, and |
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MULTIPLE GENERATION & SECURITY SPECS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Multiple Passwords Batch */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Batch Generation</span>
              </h2>

              {passwords.length > 1 && (
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {copiedIndex === -1 ? 'All Copied!' : 'Copy All'}
                </button>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                <label htmlFor="passwordBatchCount">Quantity</label>
                <span className="font-mono text-blue-600 dark:text-blue-400">{passwordCount} {passwordCount === 1 ? 'Password' : 'Passwords'}</span>
              </div>
              <input
                id="passwordBatchCount"
                type="range"
                min="1"
                max="10"
                value={passwordCount}
                onChange={(e) => setPasswordCount(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* List of Batch Passwords */}
            {passwords.length > 1 && (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {passwords.map((pwd, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mr-2 select-all">
                      {pwd}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(pwd, idx)}
                      className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 shrink-0"
                      title="Copy this password"
                    >
                      {copiedIndex === idx ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cryptographic Security Details */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-7 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>CSPRNG Cryptographic Engine</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This tool utilizes the browser&apos;s native hardware <code className="font-mono text-[11px] bg-slate-100 dark:bg-[#11182D] px-1 py-0.5 rounded">window.crypto.getRandomValues()</code> implementation with rejection sampling to eliminate modulo bias.
            </p>

            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
              <li>Zero use of predictable <code className="font-mono text-[11px]">Math.random()</code>.</li>
              <li>Generated in memory only — never sent to a server.</li>
              <li>Guaranteed to contain all selected character sets.</li>
              <li>Zero storage in cookies or local storage.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
