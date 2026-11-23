import React from 'react'
import { Link } from 'react-router-dom'
import {
  Gamepad2,
  ArrowLeft,
  HelpCircle,
  Flame,
  CheckCircle2,
  Layers,
  Award,
  Shield,
  Activity,
  ArrowUp,
  ArrowDown,
  Binary,
} from 'lucide-react'
import { GAMES_LIST } from '../../games/types'
import { GameCard } from '../../games/GameCard'
import { NumberGuessGame } from '../../games/NumberGuess/NumberGuessGame'
import { ScrollReveal } from '../../components/common/ScrollReveal'
import {
  usePageSEO,
  createWebApplicationSchema,
  createBreadcrumbSchema,
  createFAQSchema,
} from '../../utils/seo'

export const NumberGuessPage: React.FC = () => {
  const otherGames = GAMES_LIST.filter((g) => g.id !== 'number-guess')

  const faqs = [
    {
      question: 'How do I play the Number Guessing Game on QUBNEXA?',
      answer:
        'Select your preferred challenge range (1–50, 1–100, or 1–200), type an integer into the guess input, and submit. The game engine instantly compares your guess to the hidden secret number and returns directional hints (Too High or Too Low) along with temperature proximity clues.',
    },
    {
      question: 'What do the temperature feedback clues (Boiling, Warm, Cold, Freezing) mean?',
      answer:
        'Temperature clues reveal numerical proximity: "Boiling Hot" means your guess is within 3 numbers of the secret; "Warm" indicates a difference between 4 and 10; "Cold" means a difference between 11 and 25; and "Freezing" means your guess is more than 25 numbers away.',
    },
    {
      question: 'What are the three challenge difficulty modes and their attempt limits?',
      answer:
        'The Easy tier ranges from 1 to 50 with a maximum of 8 attempts. The Medium tier spans 1 to 100 with a 7-attempt limit. The Hard tier expands the range to 1 to 200 while maintaining a strict 7-attempt limit.',
    },
    {
      question: 'How does binary search apply to the challenge modes?',
      answer:
        'For 1–50, 6 binary-search guesses are sufficient in the worst case, while the game allows 8 attempts. For 1–100, 7 binary-search guesses are sufficient in the worst case, and the game allows 7 attempts. For 1–200, 7 binary-search guesses cannot guarantee finding every possible number using binary search alone; because the game allows 7 attempts, proximity and temperature clues can provide additional guidance. The number of attempts configured in the game is not identical to the theoretical minimum required by binary search.',
    },
    {
      question: 'How does the computer generate the mystery target number?',
      answer:
        'The mystery target value is generated on round start using the browser runtime pseudo-random number generator scaled across your selected range: floor(random * (max - min + 1)) + min. While standard browser pseudo-random selection is distinct from cryptographic security, it provides an even, unbiased distribution for casual logic puzzles.',
    },
    {
      question: 'How are win records and best attempt scores saved?',
      answer:
        'Your total wins, losses, and fewest attempts needed to solve a round are stored locally in your browser localStorage under the key "qubnexa_guess_stats". They persist across sessions without requiring an account or server login.',
    },
    {
      question: 'Where are game statistics and records stored?',
      answer:
        'As verified in the existing game engine, your game statistics—specifically total wins, losses, and best-attempt score—are stored locally in your browser localStorage under the key "qubnexa_guess_stats".',
    },
    {
      question: 'Can I play the Number Guessing Game on mobile devices and tablets?',
      answer:
        'Yes. The interface features large, touch-accessible number inputs, responsive buttons, and visual range bars that adapt smoothly across smartphones, tablets, and desktop displays.',
    },
  ]

  usePageSEO({
    title: 'Number Guessing Game Online Free — Play & Train Your Brain | QUBNEXA',
    description:
      'Play free Number Guessing Game online. Deduce secret numbers across 1–50, 1–100, and 1–200 challenge tiers with hot-and-cold clues and binary search strategy.',
    canonicalPath: '/games/number-guess',
    keywords:
      'number guessing game, play number guess online, high low game, guess the secret number, binary search game, math puzzle game, free browser games, qubnexa',
    schema: [
      createWebApplicationSchema(
        'Number Guessing Game — QUBNEXA',
        'Free online browser Number Guessing Game featuring 1-50, 1-100, and 1-200 challenge tiers with directional hints, temperature clues, and streak tracking.',
        '/games/number-guess'
      ),
      createBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Categories', path: '/categories' },
        { name: 'Games & Entertainment', path: '/categories/games' },
        { name: 'Number Guessing Game', path: '/games/number-guess' },
      ]),
      createFAQSchema(faqs) || {},
    ],
  })

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. BREADCRUMBS & TOP BAR */}
      <section className="border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#050814]/60 py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/categories/games" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
              Games &amp; Entertainment
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-900 dark:text-white">Number Guessing Game</span>
          </nav>

          <Link
            to="/games"
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1020] px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-rose-500/60 dark:hover:border-rose-400/60 hover:text-rose-600 dark:hover:text-rose-400 shadow-2xs transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Browser Games</span>
          </Link>
        </div>
      </section>

      {/* 2. HERO & MAIN GAME ARENA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/40 px-3.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300 shadow-2xs">
            <Gamepad2 className="h-3.5 w-3.5" />
            <span>High-Low Logic Puzzle • Instant Browser Play</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Free Online Number Guessing Game
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Deduce the mystery secret number using strategic bisection and temperature clues. Choose 1–50, 1–100, or 1–200 challenge tiers and test your mathematical intuition.
          </p>
        </div>

        {/* Embedded Interactive Game Engine */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-4 sm:p-8 shadow-sm">
          <NumberGuessGame />
        </div>
      </section>

      {/* 3. STEP-BY-STEP HOW TO PLAY GUIDE */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  How to Play the Number Guessing Game
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Four simple steps to hone your deduction strategy
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/60 text-xs font-bold text-rose-700 dark:text-rose-300">
                  1
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Choose Your Range</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Select 1–50 (8 tries), 1–100 (7 tries), or 1–200 (7 tries). The engine immediately picks a new secret integer.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/60 text-xs font-bold text-rose-700 dark:text-rose-300">
                  2
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Submit a Guess</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Type an integer within the current range. For optimal deduction, aim for the midpoint of the active boundary.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/60 text-xs font-bold text-rose-700 dark:text-rose-300">
                  3
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Read Clues</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Check directional arrows (Too High or Too Low) and color-coded temperature badges (Boiling, Warm, Cold, Freezing).
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/60 text-xs font-bold text-rose-700 dark:text-rose-300">
                  4
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Narrow &amp; Win</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Watch the dynamic range indicators update with each guess. Find the exact secret before running out of attempts.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. CHALLENGE TIERS COMPARISON TABLE */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Challenge Tiers &amp; Attempt Allowances
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Direct mathematical comparison of available ranges and difficulty parameters
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-3 font-semibold">Tier Mode</th>
                    <th className="py-3 px-3 font-semibold">Number Range</th>
                    <th className="py-3 px-3 font-semibold">Game Attempts</th>
                    <th className="py-3 px-3 font-semibold">Binary Search Worst-Case</th>
                    <th className="py-3 px-3 font-semibold">Deduction Analysis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-[#11182D]/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">Easy</td>
                    <td className="py-3 px-3 font-mono">1 – 50</td>
                    <td className="py-3 px-3 font-semibold">8 Attempts</td>
                    <td className="py-3 px-3 font-mono">6 Guesses</td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-medium">6 binary-search guesses are sufficient in the worst case; the game allows 8 attempts.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-[#11182D]/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-amber-600 dark:text-amber-400">Medium</td>
                    <td className="py-3 px-3 font-mono">1 – 100</td>
                    <td className="py-3 px-3 font-semibold">7 Attempts</td>
                    <td className="py-3 px-3 font-mono">7 Guesses</td>
                    <td className="py-3 px-3 text-amber-600 dark:text-amber-400 font-medium">7 binary-search guesses are sufficient in the worst case; the game allows 7 attempts.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-[#11182D]/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-rose-600 dark:text-rose-400">Hard</td>
                    <td className="py-3 px-3 font-mono">1 – 200</td>
                    <td className="py-3 px-3 font-semibold">7 Attempts</td>
                    <td className="py-3 px-3 font-mono">8 Guesses</td>
                    <td className="py-3 px-3 text-rose-600 dark:text-rose-400 font-medium">7 binary-search guesses cannot guarantee finding every possible number using binary search alone; the game allows 7 attempts, so proximity/temperature clues can provide additional guidance.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Note on Game Configuration vs. Theory: The number of attempts configured in the game is not identical to the theoretical minimum required by binary search. For 1–50, 6 binary-search guesses are sufficient in the worst case, while the game allows 8 attempts. For 1–100, 7 binary-search guesses are sufficient in the worst case, and the game allows 7 attempts. For 1–200, 7 binary-search guesses cannot guarantee finding every possible number using binary search alone; because the game allows 7 attempts, proximity and temperature clues provide additional guidance to help deduce the secret number.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. TEMPERATURE FEEDBACK & PROXIMITY TIERS */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Temperature Feedback &amp; Directional Clues
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  How hot-and-cold proximity badges guide your successive guesses
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-rose-200/60 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-700 dark:text-rose-300">Boiling Hot</span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                    diff ≤ 3
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your guess is exceptionally close! The hidden number is within 3 integers of your input (either above or below).
                </p>
              </div>

              <div className="rounded-xl border border-amber-200/60 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300">Warm</span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
                    diff ≤ 10
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  You are approaching the target. The secret number is between 4 and 10 numbers away from your guess.
                </p>
              </div>

              <div className="rounded-xl border border-cyan-200/60 dark:border-cyan-900/60 bg-cyan-50/50 dark:bg-cyan-950/30 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300">Cold</span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300">
                    diff ≤ 25
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  You are in the broader neighborhood, but still between 11 and 25 numbers away from the target integer.
                </p>
              </div>

              <div className="rounded-xl border border-blue-200/60 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Freezing</span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    diff &gt; 25
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your guess is far off target. The secret number is more than 25 numbers away in the indicated direction.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#050814]/40 border border-slate-100 dark:border-slate-800/80 flex items-start gap-3">
                <ArrowDown className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Too High Feedback (Arrow Down)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Indicates that your guess is greater than the secret number. The game automatically lowers your upper boundary to (guess - 1).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#050814]/40 border border-slate-100 dark:border-slate-800/80 flex items-start gap-3">
                <ArrowUp className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Too Low Feedback (Arrow Up)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Indicates that your guess is smaller than the secret number. The game automatically raises your lower boundary to (guess + 1).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 6. BINARY SEARCH STRATEGY & LOGARITHMIC PROOF */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Binary className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Optimal Deduction Strategy: Binary Search
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Why logarithmic bisection is mathematically unbeatable
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Activity className="h-4 w-4 text-rose-500" />
                  <span>The Bisection Principle: O(log N)</span>
                </div>
                <div className="rounded-lg bg-white dark:bg-[#0B1020] p-3 font-mono text-xs text-rose-700 dark:text-rose-300 border border-slate-200/60 dark:border-slate-800 leading-relaxed">
                  Next Guess = floor((CurrentMin + CurrentMax) / 2)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  By always guessing the central value of the active boundaries, you guarantee eliminating at least half of all possible values on every turn, regardless of whether the hint is higher or lower.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span>7-Step Walkthrough Example (Range 1–100)</span>
                </div>
                <div className="rounded-lg bg-white dark:bg-[#0B1020] p-3 font-mono text-xs text-rose-700 dark:text-rose-300 border border-slate-200/60 dark:border-slate-800">
                  Assume Secret = 73 | Remaining: 100 → 50 → 25 → 12 → 6 → 3 → 1
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Guess 50 (Too Low) → Guess 75 (Too High, Boiling Hot!) → Use Boiling Hot hint (diff ≤ 3) to test 73, solving the round in just 3 attempts!
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Local Game Statistics Storage</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                As verified in the existing game engine, your gameplay statistics (wins, losses, and best-attempt records) are stored in browser localStorage under <code className="text-rose-600 dark:text-rose-400">qubnexa_guess_stats</code>. Audio cues are generated locally through the Web Audio API oscillator.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Rules, deduction mechanics, temperature clues, and statistics tracking
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-1.5"
                >
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="text-rose-600 dark:text-rose-400 font-mono text-xs">Q:</span>
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 8. OTHER FREE BROWSER GAMES */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Play More Games
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Other Free Browser Games
              </h2>
            </div>

            <Link
              to="/games"
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View All Games Hub</span>
              <ArrowLeft className="h-3 w-3 rotate-180" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherGames.map((game) => (
            <Link
              key={game.id}
              to={
                game.id === 'hex-drift'
                  ? '/games/hex-drift'
                  : game.id === 'memory-match'
                  ? '/games/memory-match'
                  : game.id === 'rock-paper-scissors'
                  ? '/games/rock-paper-scissors'
                  : `/games?play=${game.id}`
              }
              className="block h-full"
            >
              <GameCard game={game} />
            </Link>
          ))}
        </div>
      </section>

      {/* 9. POPULAR QUBNEXA TOOLS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-slate-800/80 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Featured Online Utilities
          </span>
          <Link
            to="/tools"
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
          >
            Explore all 30+ tools →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { name: 'Word Counter', path: '/tools/word-counter' },
            { name: 'Percentage Calculator', path: '/tools/percentage-calculator' },
            { name: 'QR Code Generator', path: '/tools/qr-code-generator' },
            { name: 'Password Generator', path: '/tools/password-generator' },
            { name: 'Video Downloader', path: '/tools/video-downloader' },
            { name: 'Fancy Font Generator', path: '/tools/fancy-font-generator' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0B1020] text-center hover:border-rose-300 dark:hover:border-rose-700/60 transition-colors shadow-2xs group"
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-1">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
