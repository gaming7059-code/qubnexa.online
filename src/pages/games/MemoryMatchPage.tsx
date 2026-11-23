import React from 'react'
import { Link } from 'react-router-dom'
import {
  Gamepad2,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Trophy,
  Brain,
  Clock,
  Layers,
  CheckCircle2,
  RotateCcw,
  Star,
} from 'lucide-react'
import { GAMES_LIST } from '../../games/types'
import { GameCard } from '../../games/GameCard'
import { MemoryMatchGame } from '../../games/MemoryMatch/MemoryMatchGame'
import { ScrollReveal } from '../../components/common/ScrollReveal'
import {
  usePageSEO,
  createWebApplicationSchema,
  createBreadcrumbSchema,
  createFAQSchema,
} from '../../utils/seo'

export const MemoryMatchPage: React.FC = () => {
  const otherGames = GAMES_LIST.filter((g) => g.id !== 'memory-match')

  const faqs = [
    {
      question: 'How do I play Memory Card Match on QUBNEXA?',
      answer:
        'Select your preferred difficulty (Easy, Medium, or Hard), then click any card to flip it and reveal its icon. Click a second card to find its matching twin. If the two cards match, they remain face-up. If they differ, they flip back after a brief pause. Continue until all pairs are discovered in the fewest moves possible.',
    },
    {
      question: 'What are the card grid sizes and difficulty levels?',
      answer:
        'Memory Card Match features three distinct difficulty levels: Easy has 6 pairs (12 cards total in a 3x4 grid); Medium has 8 pairs (16 cards total in a 4x4 grid); and Hard has 10 pairs (20 cards total in a 4x5 grid). Higher difficulty tiers test larger visual recall capacity.',
    },
    {
      question: 'How is the 3-star rating calculated?',
      answer:
        'Your star rating is determined by your total move count relative to the number of pairs on the board. You earn 3 stars if you finish in (Pairs + 2) moves or fewer, 2 stars for (Pairs + 7) moves or fewer, and 1 star for any higher move count.',
    },
    {
      question: 'How are card positions shuffled and randomized?',
      answer:
        'Card positions are shuffled before each round using the modern Fisher-Yates array permutation algorithm, powered by the browser\'s standard Math.random() pseudo-random number generator. While Math.random() is distinct from cryptographically secure entropy, it provides fast, uniform pseudo-random distributions suitable for casual card gameplay.',
    },
    {
      question: 'Are my best scores and move records saved?',
      answer:
        'Yes. When you complete a game with fewer moves than your previous best record, your new lowest move score is stored locally in your browser localStorage under "qubnexa_memory_best_moves". You can reset your best score anytime using the "Reset Best" button.',
    },
    {
      question: 'Do sound effects require downloading external audio files?',
      answer:
        'No. Sound effects for card flips, successful pair matches, and victory fanfare are synthesized in real time using the browser Web Audio API oscillator. No audio media files are downloaded across the network, and sounds can be muted with the audio toggle.',
    },
    {
      question: 'Is any gameplay data or personal information sent to servers?',
      answer:
        'No. The Memory Card Match game engine operates locally in your browser memory. Card shuffling, move counts, timer intervals, and best score persistence (via localStorage) are handled entirely on your device without transmitting gameplay moves or personal scores to QUBNEXA servers. Standard HTTP network traffic on the website consists of fetching web application assets.',
    },
    {
      question: 'Can I play Memory Card Match on mobile devices and touchscreens?',
      answer:
        'Yes. Memory Card Match is built with responsive grid layouts and touch-friendly tap targets that adapt smoothly to smartphones, tablets, laptops, and desktop monitors.',
    },
  ]

  usePageSEO({
    title: 'Memory Card Match Online Free — Brain Puzzle Game | QUBNEXA',
    description:
      'Play free Memory Card Match online. Flip and match pairs across Easy, Medium, and Hard grids. Test concentration and memory with zero downloads or registration.',
    canonicalPath: '/games/memory-match',
    keywords:
      'memory card match, concentration game, brain puzzle game, card matching game, memory game online, flip card game free, cognitive training game, qubnexa games',
    schema: [
      createWebApplicationSchema(
        'Memory Card Match — QUBNEXA',
        'Free online browser memory card matching game featuring Easy (12 cards), Medium (16 cards), and Hard (20 cards) grids with move tracking and local best scores.',
        '/games/memory-match'
      ),
      createBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Categories', path: '/categories' },
        { name: 'Games & Entertainment', path: '/categories/games' },
        { name: 'Memory Card Match', path: '/games/memory-match' },
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
            <Link to="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/categories/games" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Games &amp; Entertainment
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-900 dark:text-white">Memory Card Match</span>
          </nav>

          <Link
            to="/games"
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1020] px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-purple-500/60 dark:hover:border-purple-400/60 hover:text-purple-600 dark:hover:text-purple-400 shadow-2xs transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Browser Games</span>
          </Link>
        </div>
      </section>

      {/* 2. HERO & MAIN GAME ARENA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 dark:border-purple-900/60 bg-purple-50/80 dark:bg-purple-950/40 px-3.5 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 shadow-2xs">
            <Gamepad2 className="h-3.5 w-3.5" />
            <span>Classic Concentration Puzzle • Instant Browser Play</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Free Online Memory Card Match Game
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Test your visual recall and concentration across Easy (12 cards), Medium (16 cards), and Hard (20 cards) grid challenges. Flip pairs, beat the timer, and set new personal best move records.
          </p>
        </div>

        {/* Embedded Interactive Game Engine */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-4 sm:p-8 shadow-sm">
          <MemoryMatchGame />
        </div>
      </section>

      {/* 3. STEP-BY-STEP HOW TO PLAY GUIDE */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  How to Play Memory Card Match
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Step-by-step instructions to clear the board with peak efficiency
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/60 text-xs font-bold text-purple-700 dark:text-purple-300">
                  1
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Choose Difficulty</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Select Easy (6 pairs / 12 cards), Medium (8 pairs / 16 cards), or Hard (10 pairs / 20 cards) depending on your target challenge level.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/60 text-xs font-bold text-purple-700 dark:text-purple-300">
                  2
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Flip First Card</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tap or click any face-down card to reveal its icon. The game timer automatically starts on your first card interaction.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/60 text-xs font-bold text-purple-700 dark:text-purple-300">
                  3
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Find Matching Twin</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tap a second card. Matching cards turn green and lock face-up; mismatched pairs flip back after a 900ms visual review window.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/60 text-xs font-bold text-purple-700 dark:text-purple-300">
                  4
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Earn Stars &amp; Records</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Match all pairs to finish the round. Earn up to 3 stars based on move count and record your best score in browser storage.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. TECHNICAL MECHANICS & FORMULAS */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Game Mechanics &amp; Scoring Formulas
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Algorithmic foundations and mathematical thresholds powering Memory Card Match
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Formula 1: Star Rating */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>Star Rating Efficiency Threshold</span>
                </div>
                <div className="rounded-lg bg-white dark:bg-[#0B1020] p-3 font-mono text-xs text-purple-700 dark:text-purple-300 border border-slate-200/60 dark:border-slate-800">
                  Rating = 3★ if Moves ≤ (P + 2) | 2★ if Moves ≤ (P + 7) | 1★ otherwise
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Where P is the total number of pairs on the board (6 for Easy, 8 for Medium, 10 for Hard). Finishing in fewer attempts reflects higher spatial memory accuracy.
                </p>
              </div>

              {/* Formula 2: Fisher-Yates Shuffling */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <RotateCcw className="h-4 w-4 text-purple-500" />
                  <span>Fisher-Yates Deck Permutation</span>
                </div>
                <div className="rounded-lg bg-white dark:bg-[#0B1020] p-3 font-mono text-xs text-purple-700 dark:text-purple-300 border border-slate-200/60 dark:border-slate-800">
                  for i from (N-1) down to 1: swap(deck[i], deck[random(0, i)])
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Permutes the card array in O(N) linear time using the modern Fisher-Yates algorithm. Randomization relies on the browser runtime standard Math.random() pseudo-random number generator, providing fast and unpredictable card distribution for casual gaming rather than cryptographic randomness.
                </p>
              </div>

              {/* Formula 3: Move Bounds */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Trophy className="h-4 w-4 text-emerald-500" />
                  <span>Theoretical Move Limits</span>
                </div>
                <div className="rounded-lg bg-white dark:bg-[#0B1020] p-3 font-mono text-xs text-purple-700 dark:text-purple-300 border border-slate-200/60 dark:border-slate-800">
                  Theoretical Minimum = P moves | Expected Optimal ≤ (2P - 1) moves
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Under perfect luck, a player finds every pair on the first try in exactly P moves. Under perfect memory with zero luck, a player completes the board within (2P - 1) moves.
                </p>
              </div>

              {/* Formula 4: Client-Side Storage */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#050814]/40 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Client-Side Local Storage &amp; Audio Synthesis</span>
                </div>
                <div className="rounded-lg bg-white dark:bg-[#0B1020] p-3 font-mono text-xs text-purple-700 dark:text-purple-300 border border-slate-200/60 dark:border-slate-800">
                  Best Score: localStorage[qubnexa_memory_best_moves] | SFX: Web Audio API
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Personal best move records persist locally in browser localStorage without transmitting any gameplay moves or player scores to QUBNEXA servers.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 5. STRATEGY & COGNITIVE MEMORY TIPS */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Strategy &amp; Concentration Tips
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Practical recall techniques to lower your move count and beat your records
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#050814]/40 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>Quadrant Chunking</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Mentally divide the card grid into smaller sectors (e.g., top-left, bottom-right). Remembering positions by neighborhood reduces cognitive visual load.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#050814]/40 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>Systematic Row Scanning</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Open new unknown cards in orderly sequence rather than jumping erratically. This helps you map out new cards while recalling previously seen coordinates.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#050814]/40 border border-slate-100 dark:border-slate-800/80 space-y-1.5">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>Card Elimination</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  As matched cards lock into their green state, focus exclusively on the remaining face-down cards. Shrinking the candidate pool accelerates final matches.
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
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Answers to common questions about gameplay rules, scoring, and technical features
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
                    <span className="text-purple-600 dark:text-purple-400 font-mono text-xs">Q:</span>
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
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Play More Games
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Other Free Browser Games
              </h2>
            </div>

            <Link
              to="/games"
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
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
              to={game.id === 'hex-drift' ? '/games/hex-drift' : `/games?play=${game.id}`}
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
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
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
              className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0B1020] text-center hover:border-purple-300 dark:hover:border-purple-700/60 transition-colors shadow-2xs group"
            >
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
