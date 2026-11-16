import React from 'react'
import { Link } from 'react-router-dom'
import {
  Gamepad2,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Flame,
  RotateCcw,
  CheckCircle2,
  Layers,
  Award,
  Shield,
  Activity,
} from 'lucide-react'
import { GAMES_LIST } from '../../games/types'
import { GameCard } from '../../games/GameCard'
import { RockPaperScissorsGame } from '../../games/RockPaperScissors/RockPaperScissorsGame'
import { ScrollReveal } from '../../components/common/ScrollReveal'
import {
  usePageSEO,
  createWebApplicationSchema,
  createBreadcrumbSchema,
  createFAQSchema,
} from '../../utils/seo'

export const RockPaperScissorsPage: React.FC = () => {
  const otherGames = GAMES_LIST.filter((g) => g.id !== 'rock-paper-scissors')

  const faqs = [
    {
      question: 'How do I play Rock Paper Scissors on QUBNEXA?',
      answer:
        'Select your preferred match format (Endless, Best of 3, or Best of 5), then click one of the three hand gestures: Rock, Paper, or Scissors. After a brief 600ms countdown animation, the computer reveals its choice and the round winner is determined based on classic hand game rules.',
    },
    {
      question: 'What are the rules and win conditions for each gesture?',
      answer:
        'Rock beats Scissors (crushes), Paper beats Rock (covers), and Scissors beats Paper (cuts). If both you and the computer throw the identical gesture, the round ends in a draw, the score remains unchanged, and the active win streak resets to zero.',
    },
    {
      question: 'How do the Endless, Best of 3, and Best of 5 match modes work?',
      answer:
        'In Endless mode, you can play continuously with cumulative win, tie, and loss counters. In Best of 3 (BO3) mode, the first player to win 2 rounds wins the match. In Best of 5 (BO5) mode, the first player to win 3 rounds is crowned the tournament champion.',
    },
    {
      question: 'How does the computer decide which gesture to throw?',
      answer:
        'The computer selects its gesture in real time using the browser runtime standard Math.random() pseudo-random number generator across the three options with equal 1-in-3 theoretical probability. While Math.random() is distinct from cryptographic randomness, it provides fast, balanced, and unpredictable throws for casual gaming.',
    },
    {
      question: 'How are win streaks and all-time best records tracked?',
      answer:
        'Your active win streak increases by 1 with each consecutive victory against the computer. Draws and losses reset your active streak to zero. Whenever your active streak surpasses your previous high score, the record is stored locally in your browser localStorage under "qubnexa_rps_best_streak".',
    },
    {
      question: 'Do sound effects require downloading external audio files?',
      answer:
        'No. All sound effects—including click clicks, move sounds, victory chimes, and defeat tones—are synthesized dynamically in your browser using the Web Audio API oscillator. No audio media files are transferred across the network, and audio can be muted anytime using the sound toggle.',
    },
    {
      question: 'Is any gameplay data or personal information sent to servers?',
      answer:
        'No. The Rock Paper Scissors game engine runs entirely on the client side in your browser memory. Your choices, match scores, and streak records are processed locally and never transmitted to QUBNEXA servers. Standard HTTP network traffic on the website consists solely of loading application bundles and static assets.',
    },
    {
      question: 'Can I play Rock Paper Scissors on mobile touchscreens?',
      answer:
        'Yes. The game features large, responsive gesture buttons with touch feedback that adapt cleanly to smartphones, tablets, laptops, and desktop screens.',
    },
  ]

  usePageSEO({
    title: 'Play Rock Paper Scissors Online Free — Hand Game | QUBNEXA',
    description:
      'Play free Rock Paper Scissors online against the computer. Choose Endless, Best of 3, or Best of 5 modes with streak counters and instant browser play.',
    canonicalPath: '/games/rock-paper-scissors',
    keywords:
      'rock paper scissors, play rock paper scissors online, rps browser game, best of 3 rock paper scissors, rock paper scissors shoot, casual hand game, free online games, qubnexa',
    schema: [
      createWebApplicationSchema(
        'Rock Paper Scissors — QUBNEXA',
        'Free online browser Rock Paper Scissors game featuring Endless, Best of 3, and Best of 5 match modes against the computer with streak tracking.',
        '/games/rock-paper-scissors'
      ),
      createBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Games', path: '/games' },
        { name: 'Rock Paper Scissors', path: '/games/rock-paper-scissors' },
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
            <Link to="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/games" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Games
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-900 dark:text-white">Rock Paper Scissors</span>
          </nav>

          <Link
            to="/games"
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1020] px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-amber-500/60 dark:hover:border-amber-400/60 hover:text-amber-600 dark:hover:text-amber-400 shadow-2xs transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Browser Games</span>
          </Link>
        </div>
      </section>

      {/* 2. HERO & MAIN GAME ARENA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/40 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 shadow-2xs">
            <Gamepad2 className="h-3.5 w-3.5" />
            <span>Classic Hand Showdown • Instant Browser Play</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Free Online Rock Paper Scissors Game
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Challenge the computer in quick rounds or tournament showdowns. Choose Endless, Best of 3, or Best of 5 modes, test your intuition, and build your all-time winning streak.
          </p>
        </div>

        {/* Embedded Interactive Game Engine */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-4 sm:p-8 shadow-sm">
          <RockPaperScissorsGame />
        </div>
      </section>

      {/* 3. STEP-BY-STEP HOW TO PLAY GUIDE */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  How to Play Rock Paper Scissors
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Core rules, gesture hierarchy, and match formats
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/60 text-xs font-bold text-amber-700 dark:text-amber-300">
                  1
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Choose Match Mode</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Pick Endless for continuous play, Best of 3 (first to 2 wins), or Best of 5 (first to 3 wins) for tournament competition.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/60 text-xs font-bold text-amber-700 dark:text-amber-300">
                  2
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Throw Your Gesture</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Click Rock (✊), Paper (✋), or Scissors (✌️). A 600ms countdown animation plays as the computer makes its selection.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/60 text-xs font-bold text-amber-700 dark:text-amber-300">
                  3
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Evaluate Outcome</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Rock beats Scissors; Paper beats Rock; Scissors beats Paper. Matching throws result in a tie with no point awarded to either side.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/60 text-xs font-bold text-amber-700 dark:text-amber-300">
                  4
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Build Your Streak</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Win consecutive rounds to build your active streak. New personal best streaks are automatically saved in browser local storage.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. TECHNICAL MECHANICS & GAME THEORY */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Game Theory &amp; Mathematical Mechanics
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Mathematical principles, payoff matrices, and random selection algorithms
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Formula 1: Zero-Sum Payoff Matrix */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Activity className="h-4 w-4 text-amber-500" />
                  <span>3×3 Zero-Sum Payoff Matrix</span>
                </div>
                <div className="rounded-lg bg-white dark:bg-[#0B1020] p-3 font-mono text-xs text-amber-700 dark:text-amber-300 border border-slate-200/60 dark:border-slate-800 leading-relaxed">
                  Win: +1 Point | Tie: 0 Points | Loss: -1 Point
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Rock Paper Scissors is a symmetric, simultaneous, zero-sum game. Every option beats exactly one gesture, loses to one, and draws against itself.
                </p>
              </div>

              {/* Formula 2: Nash Equilibrium */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span>Mixed Strategy Nash Equilibrium</span>
                </div>
                <div className="rounded-lg bg-white dark:bg-[#0B1020] p-3 font-mono text-xs text-amber-700 dark:text-amber-300 border border-slate-200/60 dark:border-slate-800">
                  P(Rock) = P(Paper) = P(Scissors) = 1/3 (33.33%)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Under standard game theory, choosing each gesture with equal 1/3 probability creates an unexploitable strategy that neutralizes any predictive advantage.
                </p>
              </div>

              {/* Formula 3: PRNG Disclosure */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <RotateCcw className="h-4 w-4 text-blue-500" />
                  <span>Computer Choice Randomization</span>
                </div>
                <div className="rounded-lg bg-white dark:bg-[#0B1020] p-3 font-mono text-xs text-amber-700 dark:text-amber-300 border border-slate-200/60 dark:border-slate-800">
                  Choice Index = floor(Math.random() * 3) ∈ [0, 1, 2]
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  The computer selects its move in real time using the browser standard Math.random() pseudo-random number generator, providing fast and balanced selection for casual gaming rather than cryptographic randomness.
                </p>
              </div>

              {/* Formula 4: Streak Persistence */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Flame className="h-4 w-4 text-rose-500" />
                  <span>Local Streak &amp; Audio Architecture</span>
                </div>
                <div className="rounded-lg bg-white dark:bg-[#0B1020] p-3 font-mono text-xs text-amber-700 dark:text-amber-300 border border-slate-200/60 dark:border-slate-800">
                  Streak: localStorage[qubnexa_rps_best_streak] | Audio: Web Audio API
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Active scores and all-time best streaks are managed directly in browser memory and local storage without transmitting gameplay moves or results to QUBNEXA servers.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. STRATEGY & PSYCHOLOGY TIPS */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Strategy &amp; Behavioral Insights
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Interesting psychological patterns observed in casual Rock Paper Scissors play
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#050814]/40 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span>Win-Stay Heuristic</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Human players often repeat the winning gesture after a successful round. Recognizing this pattern helps in human matches, though the computer opponent generates moves independently.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#050814]/40 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span>Lose-Shift Behavior</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Players who lose a round tend to shift to the gesture that would have beaten their opponent previous throw. Shifting randomly avoids falling into predictable cyclical traps.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#050814]/40 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span>True Randomization</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Because the computer selects each move with equal independent probability, alternating your choices unpredictably prevents unconscious patterning across longer matches.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Common questions regarding match rules, scoring, and technical implementation
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
                    <span className="text-amber-600 dark:text-amber-400 font-mono text-xs">Q:</span>
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

      {/* 7. OTHER FREE BROWSER GAMES */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Play More Games
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Other Free Browser Games
              </h2>
            </div>

            <Link
              to="/games"
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
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
                  : `/games?play=${game.id}`
              }
              className="block h-full"
            >
              <GameCard game={game} />
            </Link>
          ))}
        </div>
      </section>

      {/* 8. POPULAR QUBNEXA TOOLS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-slate-800/80 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Featured Online Utilities
          </span>
          <Link
            to="/tools"
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
          >
            Explore all 30+ tools →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { name: 'Word Counter', path: '/tools/word-counter' },
            { name: 'Fancy Font Generator', path: '/tools/fancy-font-generator' },
            { name: 'Text Repeater', path: '/tools/text-repeater' },
            { name: 'Video Downloader', path: '/tools/video-downloader' },
            { name: 'QR Code Generator', path: '/tools/qr-code-generator' },
            { name: 'Password Generator', path: '/tools/password-generator' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0B1020] text-center hover:border-amber-300 dark:hover:border-amber-700/60 transition-colors shadow-2xs group"
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
