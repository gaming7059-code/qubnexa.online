import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lock,
  KeyRound,
  Trash2,
  Sparkles,
  Clock,
  Cpu,
  Globe,
  Info,
} from 'lucide-react'
import {
  analyzePassword,
  generateSmartSuggestions,
  type PasswordAnalysisResult,
  type PasswordSuggestion,
} from '../../utils/passwordChecker'

export const PasswordChecker: React.FC = () => {
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<PasswordSuggestion[]>(() => generateSmartSuggestions(''))
  const [isRefreshingSuggestions, setIsRefreshingSuggestions] = useState<boolean>(false)

  // Zero-persistence hygiene: Wipe sensitive input from memory on component unmount
  useEffect(() => {
    return () => {
      setPassword('')
    }
  }, [])

  // Live real-time analysis
  const analysis: PasswordAnalysisResult = useMemo(() => {
    return analyzePassword(password)
  }, [password])

  // Regenerate suggestions on demand
  const refreshSuggestions = useCallback(() => {
    setIsRefreshingSuggestions(true)
    const newSuggestions = generateSmartSuggestions(password)
    setSuggestions(newSuggestions)
    setTimeout(() => setIsRefreshingSuggestions(false), 300)
  }, [password])

  const handleClear = () => {
    setPassword('')
  }

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // Fallback if clipboard API is restricted
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. HERO INPUT & LIVE METER CARD */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Password Security & Entropy Analyzer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Type or paste a passkey for real-time cryptographic audit
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>100% In-Browser • Zero Server Transfer</span>
          </span>
        </div>

        {/* Password Input Box */}
        <div className="relative">
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter text to check strength..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#050814] px-4 py-3.5 pr-28 font-mono text-base sm:text-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <div className="absolute right-2.5 flex items-center gap-1">
              {password && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                  title="Clear Input"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                title={showPassword ? 'Hide characters' : 'Show characters'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* 5-Segment Strength Meter Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Strength Level:
              </span>
              <span className={`px-2.5 py-0.5 rounded-md font-bold text-xs border ${analysis.color.badgeClass}`}>
                {analysis.levelLabel} ({analysis.score}/100)
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {analysis.passwordLength} chars • {analysis.entropyBits} bits entropy
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 h-2.5">
            {[1, 2, 3, 4, 5].map((segmentIndex) => {
              const activeCount = Math.ceil((analysis.score / 100) * 5)
              const isActive = password.length > 0 && segmentIndex <= activeCount

              let segmentBg = 'bg-slate-200 dark:bg-slate-800'
              if (isActive) {
                if (activeCount <= 1) segmentBg = 'bg-rose-500'
                else if (activeCount === 2) segmentBg = 'bg-orange-500'
                else if (activeCount === 3) segmentBg = 'bg-amber-500'
                else if (activeCount === 4) segmentBg = 'bg-emerald-500'
                else segmentBg = 'bg-teal-500'
              }

              return (
                <div
                  key={segmentIndex}
                  className={`rounded-full transition-all duration-300 ${segmentBg}`}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* 2. BRUTE FORCE CRACK TIME ESTIMATES */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>Estimated Brute-Force Crack Times</span>
          </h3>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Info className="h-3.5 w-3.5" />
            <span>Mathematical estimation</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Cpu className="h-3.5 w-3.5 text-rose-500" />
              <span className="font-semibold">Fast Hash (GPU Cluster)</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {analysis.crackTime.fastHashOnline}
            </div>
            <p className="text-[11px] text-slate-400">
              100 Billion offline guesses/sec (MD5 / NTLM fast hashes)
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Lock className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-semibold">Slow Key Derivation</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {analysis.crackTime.slowHashKDF}
            </div>
            <p className="text-[11px] text-slate-400">
              10,000 guesses/sec (bcrypt / Argon2 memory-hard KDFs)
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Globe className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-semibold">Online Throttled Form</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {analysis.crackTime.onlineThrottled}
            </div>
            <p className="text-[11px] text-slate-400">
              100 attempts/hr (Standard rate-limited login form)
            </p>
          </div>
        </div>

        {/* Visible Crack-Time Disclaimer (FIND-05) */}
        <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 text-xs text-amber-900/90 dark:text-amber-300/90 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            These estimates assume exhaustive brute-force guessing. Dictionary attacks, password reuse, phishing, malware and targeted guessing can compromise passwords much faster. Actual results depend on hashing algorithms, hardware and rate limits.
          </p>
        </div>
      </div>

      {/* 3. SECURITY CRITERIA & VULNERABILITIES DUAL COLUMN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Security Criteria Checklist */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Security Criteria Checklist</span>
          </h3>

          <div className="space-y-2.5">
            {analysis.criteria.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
              >
                {item.met ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span className={item.met ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}>
                      {item.label}
                    </span>
                    {item.importance === 'critical' && !item.met && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400">
                        Critical
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Weaknesses & Actionable Recommendations */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 shadow-sm space-y-6">
          {/* Weaknesses List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              <span>Identified Vulnerabilities</span>
            </h3>

            {analysis.weaknesses.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>No obvious security vulnerabilities or predictable patterns detected.</span>
              </div>
            ) : (
              <ul className="space-y-2">
                {analysis.weaknesses.map((w, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2"
                  >
                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actionable Tips */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span>Improvement Recommendations</span>
            </h3>

            <ul className="space-y-2">
              {analysis.suggestions.map((s, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#050814] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 4. SMART PASSWORD SUGGESTIONS GENERATOR */}
      <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-[#070D1E] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
                <Sparkles className="h-4 w-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Smart Strong Passkey Alternatives
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Cryptographically generated alternatives using pure Web Crypto entropy (zero connection to your input)
            </p>
          </div>

          <button
            type="button"
            onClick={refreshSuggestions}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition-all active:scale-95"
            title="Generate New Alternatives"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-blue-500 ${isRefreshingSuggestions ? 'animate-spin' : ''}`} />
            <span>Generate Another</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((sug) => (
            <div
              key={sug.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-4 sm:p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-blue-500" />
                  <span>{sug.title}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {sug.levelLabel} ({sug.score}/100)
                </span>
              </div>

              {/* Password string with copy button */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-50 dark:bg-[#050814] border border-slate-200 dark:border-slate-800">
                <span className="font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 break-all select-all">
                  {sug.password}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(sug.password, sug.id)}
                  className={`inline-flex items-center gap-1.5 shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    copiedId === sug.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-95'
                  }`}
                  title="Copy Suggestion"
                >
                  {copiedId === sug.id ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {sug.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. PRIVACY & ARCHITECTURAL GUARANTEE BANNER */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 sm:p-6 space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
            QUBNEXA 100% Client-Side Privacy Guarantee
          </h4>
        </div>
        <p className="text-xs text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
          Your input is evaluated solely in your browser's temporary execution thread. It is never logged to the developer console, never cached in cookies or persistent storage, and never transmitted over the network. When you close or refresh this tab, all analyzed state is immediately discarded.
        </p>
      </div>
    </div>
  )
}
