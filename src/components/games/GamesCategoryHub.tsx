import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Gamepad2,
  Zap,
  Flame,
  Brain,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  BookOpen,
  Smartphone,
  Laptop,
  Cpu,
  Trophy,
  Target,
  ExternalLink,
  Info,
} from 'lucide-react'
import type { Category } from '../../types/tools'
import { CategoryCard } from '../common/CategoryCard'
import { GAMES_CATEGORY_FAQS } from './gamesCategoryData'

interface GamesCategoryHubProps {
  category: Category
  relatedCategories: Category[]
}

export const GamesCategoryHub: React.FC<GamesCategoryHubProps> = ({ category, relatedCategories }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* 1. BREADCRUMB */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
        <Link to="/categories" className="hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors">
          Categories
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
        <span className="font-semibold text-slate-900 dark:text-slate-200" aria-current="page">
          {category.name}
        </span>
      </nav>

      {/* 2. HERO / HUB HEADER */}
      <header className="xw-panel relative overflow-hidden p-6 sm:p-10 shadow-xs">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Games Discovery &amp; Strategy Guide Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Free Online Browser Games
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore zero-install, lightweight HTML5 browser games on QUBNEXA. Discover fast arcade runners, retro snake, memory challenges, and strategy board games. Compare game mechanics, review controls and winning strategies, and launch any title instantly on desktop or mobile.
            </p>
            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-[#11182D] px-2.5 py-1">
                <Gamepad2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                6 Instant Games
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-[#11182D] px-2.5 py-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Zero Downloads (0 MB)
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-[#11182D] px-2.5 py-1">
                <Smartphone className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
                Mobile &amp; Desktop Optimized
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-[#11182D] px-2.5 py-1">
                <Cpu className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                Client-Side Audio &amp; Storage
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href="#game-guides"
              className="xw-btn-secondary min-h-[46px] px-5 py-2.5 text-sm font-semibold justify-center"
            >
              <BookOpen className="h-4 w-4" />
              <span>Read Game Guides</span>
            </a>
            <Link
              to="/games"
              className="xw-btn-primary min-h-[46px] px-5 py-2.5 text-sm font-semibold justify-center shadow-md shadow-blue-500/20"
            >
              <Gamepad2 className="h-4 w-4" />
              <span>Launch Games Arena</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. GAME DISCOVERY BY GENRE */}
      <section aria-labelledby="game-catalog-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <h2 id="game-catalog-heading" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Browse Games by Genre
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Select any game below to play immediately or read its dedicated guide and controls breakdown.
            </p>
          </div>
          <Link
            to="/games"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 dark:text-[#00DFFF] hover:underline shrink-0"
          >
            <span>Open All in Interactive Arena</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Discovery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. HEX DRIFT */}
          <article className="xw-panel p-5 sm:p-6 flex flex-col justify-between hover:border-cyan-500/50 transition-all duration-200 shadow-xs">
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Zap className="h-6 w-6" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 text-[11px] font-bold text-purple-700 dark:text-purple-300">
                    Arcade &amp; Reflex
                  </span>
                  <span className="rounded-md bg-slate-100 dark:bg-[#11182D] px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    Boss Fights
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  HEX DRIFT: Neon Void Runner
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  High-speed cyber-minimalist sci-fi runner rendered on HTML5 canvas with weapon upgrades, shields, wave bosses, and WebAudio SFX.
                </p>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <p><strong className="text-slate-700 dark:text-slate-300">Controls:</strong> Arrow keys / WASD + Space (Fire) / Shift (Shield) or Touch Joystick</p>
                <p><strong className="text-slate-700 dark:text-slate-300">Pacing:</strong> Fast-Paced • 3–5 min sessions</p>
              </div>
            </div>
            <div className="pt-5 flex items-center gap-2.5">
              <Link to="/games/hex-drift" className="xw-btn-primary min-h-[42px] px-4 py-2 text-xs flex-1 justify-center">
                <span>Play HEX DRIFT</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a href="#guide-hex-drift" className="xw-btn-secondary min-h-[42px] px-3 py-2 text-xs">
                Guide
              </a>
            </div>
          </article>

          {/* 2. RETRO SNAKE */}
          <article className="xw-panel p-5 sm:p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-200 shadow-xs">
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Flame className="h-6 w-6" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                    Arcade &amp; Reflex
                  </span>
                  <span className="rounded-md bg-slate-100 dark:bg-[#11182D] px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    3 Speeds
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Retro Snake Game
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Steer the neon serpent across grid boundaries, collect energy pellets, and achieve high scores without colliding into walls or tail segments.
                </p>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <p><strong className="text-slate-700 dark:text-slate-300">Controls:</strong> Arrow keys / WASD or On-Screen Touch D-Pad</p>
                <p><strong className="text-slate-700 dark:text-slate-300">Pacing:</strong> Progressive • Customizable difficulty</p>
              </div>
            </div>
            <div className="pt-5 flex items-center gap-2.5">
              <Link to="/games?play=snake" className="xw-btn-primary min-h-[42px] px-4 py-2 text-xs flex-1 justify-center">
                <span>Play Snake</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a href="#guide-snake" className="xw-btn-secondary min-h-[42px] px-3 py-2 text-xs">
                Guide
              </a>
            </div>
          </article>

          {/* 3. NUMBER GUESSING */}
          <article className="xw-panel p-5 sm:p-6 flex flex-col justify-between hover:border-blue-500/50 transition-all duration-200 shadow-xs">
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300">
                    Puzzle &amp; Memory
                  </span>
                  <span className="rounded-md bg-slate-100 dark:bg-[#11182D] px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    Binary Search
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Number Guessing Game
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Deduce the secret number across 1–50, 1–100, and 1–200 difficulty tiers using color-coded temperature proximity hints.
                </p>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <p><strong className="text-slate-700 dark:text-slate-300">Controls:</strong> Numeric keyboard or Touch Keypad</p>
                <p><strong className="text-slate-700 dark:text-slate-300">Pacing:</strong> Thoughtful Logic • 1–3 min sessions</p>
              </div>
            </div>
            <div className="pt-5 flex items-center gap-2.5">
              <Link to="/games/number-guess" className="xw-btn-primary min-h-[42px] px-4 py-2 text-xs flex-1 justify-center">
                <span>Play Number Guess</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a href="#guide-number-guess" className="xw-btn-secondary min-h-[42px] px-3 py-2 text-xs">
                Guide
              </a>
            </div>
          </article>

          {/* 4. ROCK PAPER SCISSORS */}
          <article className="xw-panel p-5 sm:p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all duration-200 shadow-xs">
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                    Strategy &amp; Quick Fun
                  </span>
                  <span className="rounded-md bg-slate-100 dark:bg-[#11182D] px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    Streak Tracker
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Rock Paper Scissors
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Face off against predictive randomized AI in rapid matches with win/loss/tie counters, streak tracking, and instant feedback.
                </p>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <p><strong className="text-slate-700 dark:text-slate-300">Controls:</strong> Tap or click Rock, Paper, or Scissors</p>
                <p><strong className="text-slate-700 dark:text-slate-300">Pacing:</strong> Rapid • Under 1 min sessions</p>
              </div>
            </div>
            <div className="pt-5 flex items-center gap-2.5">
              <Link to="/games/rock-paper-scissors" className="xw-btn-primary min-h-[42px] px-4 py-2 text-xs flex-1 justify-center">
                <span>Play RPS</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a href="#guide-rock-paper-scissors" className="xw-btn-secondary min-h-[42px] px-3 py-2 text-xs">
                Guide
              </a>
            </div>
          </article>

          {/* 5. MEMORY CARD MATCH */}
          <article className="xw-panel p-5 sm:p-6 flex flex-col justify-between hover:border-purple-500/50 transition-all duration-200 shadow-xs">
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  <Brain className="h-6 w-6" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 text-[11px] font-bold text-purple-700 dark:text-purple-300">
                    Puzzle &amp; Memory
                  </span>
                  <span className="rounded-md bg-slate-100 dark:bg-[#11182D] px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    3 Grid Tiers
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Memory Card Match
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Exercise working memory and spatial pattern recall by flipping card pairs across 4x3, 4x4, and 6x4 difficulty grid layouts with move counters.
                </p>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <p><strong className="text-slate-700 dark:text-slate-300">Controls:</strong> Click or tap to flip card pairs</p>
                <p><strong className="text-slate-700 dark:text-slate-300">Pacing:</strong> Focused Memory • 2–4 min sessions</p>
              </div>
            </div>
            <div className="pt-5 flex items-center gap-2.5">
              <Link to="/games/memory-match" className="xw-btn-primary min-h-[42px] px-4 py-2 text-xs flex-1 justify-center">
                <span>Play Memory Match</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a href="#guide-memory-match" className="xw-btn-secondary min-h-[42px] px-3 py-2 text-xs">
                Guide
              </a>
            </div>
          </article>

          {/* 6. TIC-TAC-TOE */}
          <article className="xw-panel p-5 sm:p-6 flex flex-col justify-between hover:border-cyan-500/50 transition-all duration-200 shadow-xs">
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Gamepad2 className="h-6 w-6" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-cyan-100 dark:bg-cyan-950/60 px-2 py-0.5 text-[11px] font-bold text-cyan-700 dark:text-cyan-300">
                    Strategy &amp; Quick Fun
                  </span>
                  <span className="rounded-md bg-slate-100 dark:bg-[#11182D] px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    Minimax AI + 2P
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Tic-Tac-Toe Game
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Challenge a Minimax-based algorithm with adjustable difficulty across 3 tiers or play local 2-player pass-and-play matches with crisp session win tracking.
                </p>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <p><strong className="text-slate-700 dark:text-slate-300">Controls:</strong> Click or tap empty grid cells</p>
                <p><strong className="text-slate-700 dark:text-slate-300">Pacing:</strong> Turn-Based • 1–2 min sessions</p>
              </div>
            </div>
            <div className="pt-5 flex items-center gap-2.5">
              <Link to="/games?play=tic-tac-toe" className="xw-btn-primary min-h-[42px] px-4 py-2 text-xs flex-1 justify-center">
                <span>Play Tic-Tac-Toe</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a href="#guide-tic-tac-toe" className="xw-btn-secondary min-h-[42px] px-3 py-2 text-xs">
                Guide
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* 4. HOW QUBNEXA BROWSER GAMES WORK */}
      <section aria-labelledby="how-it-works-heading" className="xw-surface p-6 sm:p-10 space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-[#00DFFF]">
            <Info className="h-3.5 w-3.5" />
            <span>Architecture &amp; Player Benefits</span>
          </div>
          <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            How QUBNEXA Browser Games Work
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Unlike traditional desktop games that require multi-gigabyte downloads or proprietary app launchers, QUBNEXA games run natively in your web browser. Here is what powers our instant gaming experience:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <div className="xw-panel p-5 space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-[#00DFFF]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Zero Downloads
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every title executes via HTML5 Canvas, WebGL, and JavaScript. No installation packages, disk writes, or browser extensions required.
            </p>
          </div>

          <div className="xw-panel p-5 space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Client-Side Privacy
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              All state, collision detection, and high scores reside strictly inside your browser local storage. No player data is sent to external servers.
            </p>
          </div>

          <div className="xw-panel p-5 space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              WebAudio Synthesis
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Sound effects are procedurally generated in real time using the browser WebAudio API oscillator nodes, avoiding bulky audio file downloads.
            </p>
          </div>

          <div className="xw-panel p-5 space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Smartphone className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Touch &amp; Keyboard
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Play seamlessly on smartphones and tablets with on-screen D-pads and touch controls, or enjoy physical Arrow/WASD keys on desktop.
            </p>
          </div>
        </div>
      </section>

      {/* 5. HOW TO CHOOSE A GAME BY MOOD */}
      <section aria-labelledby="how-to-choose-heading" className="space-y-6">
        <div>
          <h2 id="how-to-choose-heading" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            How to Choose Your Next Game
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Match your available time, current mood, and preferred play style to the right QUBNEXA title.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="xw-panel p-5 space-y-2 border-l-4 border-l-cyan-500">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-cyan-500" />
              High-Speed Reflexes &amp; Adrenaline
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If you want rapid obstacle avoidance, weapon upgrades, and boss encounters, jump into <strong>HEX DRIFT: Neon Void Runner</strong>.
            </p>
          </div>

          <div className="xw-panel p-5 space-y-2 border-l-4 border-l-emerald-500">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-emerald-500" />
              Classic Arcade Flow
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If you want relaxed, nostalgic gaming with satisfying spatial growth and high-score chasing, play <strong>Retro Snake Game</strong> across 3 speeds.
            </p>
          </div>

          <div className="xw-panel p-5 space-y-2 border-l-4 border-l-blue-500">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-blue-500" />
              Brain Training &amp; Spatial Memory
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If you want to sharpen short-term recall and pattern recognition, test yourself on <strong>Memory Card Match</strong> with 4x3 to 6x4 grids.
            </p>
          </div>

          <div className="xw-panel p-5 space-y-2 border-l-4 border-l-purple-500">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-purple-500" />
              Logical Deduction &amp; Numbers
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If you enjoy math puzzles and binary search thinking, try <strong>Number Guessing Game</strong> using hot-and-cold temperature feedback.
            </p>
          </div>

          <div className="xw-panel p-5 space-y-2 border-l-4 border-l-amber-500">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Quick 30-Second Micro Break
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If you have under a minute between tasks, battle randomized AI and build an unbroken winning streak in <strong>Rock Paper Scissors</strong>.
            </p>
          </div>

          <div className="xw-panel p-5 space-y-2 border-l-4 border-l-cyan-600">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Gamepad2 className="h-4 w-4 text-cyan-600" />
              Tactical Duels or Two-Player Fun
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If you are sitting with a friend or want to test your strategic grid placements against Minimax AI, play <strong>Tic-Tac-Toe</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* 6. INDIVIDUAL GAME GUIDES (IN-DEPTH) */}
      <section id="game-guides" aria-labelledby="guides-heading" className="space-y-8 scroll-mt-24">
        <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <h2 id="guides-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Individual Game Guides &amp; Controls
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Detailed gameplay objectives, input controls, and strategy tips verified from each game engine.
          </p>
        </div>

        <div className="space-y-8">
          {/* Guide 1: HEX DRIFT */}
          <article id="guide-hex-drift" className="xw-panel p-6 sm:p-8 space-y-5 scroll-mt-28 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    HEX DRIFT: Neon Void Runner
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    HTML5 Canvas Sci-Fi Arcade Runner • Boss Waves • WebAudio SFX
                  </span>
                </div>
              </div>
              <Link to="/games/hex-drift" className="xw-btn-primary min-h-[42px] px-4 py-2 text-xs font-semibold shrink-0">
                <span>Play HEX DRIFT Fullscreen</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-cyan-500" />
                  Objective &amp; Mechanics
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Pilot your cyber starship through an infinite scrolling space lane. Dodge hexagonal laser gates and asteroid barriers, destroy enemy drones, and survive wave bosses such as the Level 5 Dreadnought.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Laptop className="h-4 w-4 text-cyan-500" />
                  Controls (Desktop &amp; Mobile)
                </h4>
                <ul className="text-slate-600 dark:text-slate-300 space-y-1">
                  <li><strong>Desktop:</strong> Left/Right Arrow or A/D to steer lane</li>
                  <li><strong>Fire Lasers:</strong> Spacebar</li>
                  <li><strong>Energy Shield:</strong> Shift key (temporary barrier)</li>
                  <li><strong>Mobile:</strong> On-screen virtual joystick + fire/shield buttons</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-cyan-500" />
                  Strategy &amp; Pro Tips
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Do not waste your energy shield on single debris. Save shield bursts for dense laser sweeps during Dreadnought boss encounters. Prioritize green weapon orbs early to upgrade projectile spread.
                </p>
              </div>
            </div>
          </article>

          {/* Guide 2: RETRO SNAKE */}
          <article id="guide-snake" className="xw-panel p-6 sm:p-8 space-y-5 scroll-mt-28 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Retro Snake Game
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Classic 2D Canvas Grid Arcade • 3 Speed Tiers • Local High Score
                  </span>
                </div>
              </div>
              <Link to="/games?play=snake" className="xw-btn-primary min-h-[42px] px-4 py-2 text-xs font-semibold shrink-0">
                <span>Play Snake in Arena</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-emerald-500" />
                  Objective &amp; Mechanics
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Navigate the neon snake across a bordered 2D canvas grid. Devour glowing food pellets to increase your score and body length without crashing into the perimeter walls or your own tail.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Laptop className="h-4 w-4 text-emerald-500" />
                  Controls &amp; Speed Tiers
                </h4>
                <ul className="text-slate-600 dark:text-slate-300 space-y-1">
                  <li><strong>Desktop:</strong> Arrow keys or W, A, S, D for turns</li>
                  <li><strong>Mobile:</strong> On-screen 4-way responsive touch D-pad</li>
                  <li><strong>Speed Selector:</strong> Slow (Casual), Medium (Classic), Fast (Arcade)</li>
                  <li><strong>Score Tracking:</strong> Current Score and Best Score saved locally</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-emerald-500" />
                  Strategy &amp; Pro Tips
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Adopt a clockwise or counter-clockwise perimeter loop. When the snake reaches long lengths (&gt;15 segments), avoid zigzagging down the center where you can easily box yourself into a dead end.
                </p>
              </div>
            </div>
          </article>

          {/* Guide 3: NUMBER GUESSING */}
          <article id="guide-number-guess" className="xw-panel p-6 sm:p-8 space-y-5 scroll-mt-28 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Number Guessing Game
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Mathematical Logic &amp; Deduction • Proximity Clues • 3 Difficulty Ranges
                  </span>
                </div>
              </div>
              <Link to="/games/number-guess" className="xw-btn-primary min-h-[42px] px-4 py-2 text-xs font-semibold shrink-0">
                <span>Play Number Guess</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-blue-500" />
                  Objective &amp; Feedback
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Identify the mystery number chosen by the computer before running out of attempts. Each guess receives instant directional feedback (Too High / Too Low) and a color-coded temperature badge.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Laptop className="h-4 w-4 text-blue-500" />
                  Difficulty Tiers &amp; Clues
                </h4>
                <ul className="text-slate-600 dark:text-slate-300 space-y-1">
                  <li><strong>Easy:</strong> Range 1–50 (10 attempts)</li>
                  <li><strong>Classic:</strong> Range 1–100 (7 attempts)</li>
                  <li><strong>Master:</strong> Range 1–200 (8 attempts)</li>
                  <li><strong>Temperature:</strong> Boiling Hot (&le;3 away), Warm (&le;10), Cold (&le;25), Freezing (&gt;25)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-blue-500" />
                  Optimal Strategy (Binary Search)
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Always guess the exact middle of the active range. In the 1–100 mode, start at 50. If too low, guess 75. If too high, guess 25. This binary search strategy guarantees victory in 7 moves or fewer!
                </p>
              </div>
            </div>
          </article>

          {/* Guide 4: ROCK PAPER SCISSORS */}
          <article id="guide-rock-paper-scissors" className="xw-panel p-6 sm:p-8 space-y-5 scroll-mt-28 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Rock Paper Scissors
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Rapid Hand Battle • Win Streak Tracker • Win Rate Analysis
                  </span>
                </div>
              </div>
              <Link to="/games/rock-paper-scissors" className="xw-btn-primary min-h-[42px] px-4 py-2 text-xs font-semibold shrink-0">
                <span>Play Rock Paper Scissors</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-amber-500" />
                  Objective &amp; Rules
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Defeat the computer across rapid rounds using the timeless tri-rule: Rock crushes Scissors, Scissors cut Paper, and Paper covers Rock. Build your highest unbroken win streak.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Laptop className="h-4 w-4 text-amber-500" />
                  Controls &amp; Metrics
                </h4>
                <ul className="text-slate-600 dark:text-slate-300 space-y-1">
                  <li><strong>Controls:</strong> One-click / one-tap hand card selection</li>
                  <li><strong>Tracked Stats:</strong> Wins, Losses, Ties, and Current Win Streak</li>
                  <li><strong>Win Rate:</strong> Live percentage calculated per session</li>
                  <li><strong>Visual FX:</strong> Dynamic card reveals and win/draw animations</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Strategy &amp; AI Patterns
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Humans tend to repeat the move that just won, or switch to the move that would have beaten the opponent's previous choice. Vary your selections unpredictably to avoid computer pattern matching.
                </p>
              </div>
            </div>
          </article>

          {/* Guide 5: MEMORY CARD MATCH */}
          <article id="guide-memory-match" className="xw-panel p-6 sm:p-8 space-y-5 scroll-mt-28 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Memory Card Match
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Visual Recall &amp; Pattern Recognition • 3D Card Flips • Timer &amp; Move Counter
                  </span>
                </div>
              </div>
              <Link to="/games/memory-match" className="xw-btn-primary min-h-[42px] px-4 py-2 text-xs font-semibold shrink-0">
                <span>Play Memory Match</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-purple-500" />
                  Objective &amp; Mechanics
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Flip face-down cards to discover matching pairs. Matching cards lock open, while non-matching cards flip back face-down after a brief moment. Complete the grid in the fewest moves possible.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Laptop className="h-4 w-4 text-purple-500" />
                  Grid Layouts &amp; Controls
                </h4>
                <ul className="text-slate-600 dark:text-slate-300 space-y-1">
                  <li><strong>Controls:</strong> Tap or click any two cards</li>
                  <li><strong>Easy:</strong> 4x3 grid (6 pairs, 12 cards)</li>
                  <li><strong>Medium:</strong> 4x4 grid (8 pairs, 16 cards)</li>
                  <li><strong>Hard:</strong> 6x4 grid (12 pairs, 24 cards)</li>
                  <li><strong>Telemetry:</strong> Live elapsed timer + total flip counter</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-purple-500" />
                  Recall &amp; Memory Tips
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Turn cards systematically in top-to-bottom rows rather than picking randomly across the board. Associate each revealed icon with its grid coordinate (e.g., "Star in top-left") to reinforce visual retention.
                </p>
              </div>
            </div>
          </article>

          {/* Guide 6: TIC-TAC-TOE */}
          <article id="guide-tic-tac-toe" className="xw-panel p-6 sm:p-8 space-y-5 scroll-mt-28 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Gamepad2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Tic-Tac-Toe Game
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Minimax AI Strategy • Local 2-Player Pass-and-Play • Score History
                  </span>
                </div>
              </div>
              <Link to="/games?play=tic-tac-toe" className="xw-btn-primary min-h-[42px] px-4 py-2 text-xs font-semibold shrink-0">
                <span>Play Tic-Tac-Toe in Arena</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-cyan-500" />
                  Objective &amp; Modes
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Align three identical symbols (X or O) horizontally, vertically, or diagonally on a 3x3 grid. Play solo against the AI or challenge a friend in local 2-player pass-and-play mode on the same device.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Laptop className="h-4 w-4 text-cyan-500" />
                  AI Tiers &amp; Controls
                </h4>
                <ul className="text-slate-600 dark:text-slate-300 space-y-1">
                  <li><strong>Controls:</strong> Tap or click any empty 3x3 grid square</li>
                  <li><strong>Easy AI:</strong> Casual moves with occasional random selections</li>
                  <li><strong>Medium AI:</strong> Blocks obvious forks, good balanced challenge</li>
                  <li><strong>Master AI:</strong> Powered by mathematically unbeatable Minimax algorithm</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-cyan-500" />
                  Minimax Strategy &amp; Draws
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  On Master tier, the Minimax AI can never be defeated. To guarantee a draw, take the center cell on move 1. If the AI claims the center, claim an opposite corner to neutralize double-threat forks.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section aria-labelledby="faq-heading" className="xw-surface p-6 sm:p-10 space-y-6">
        <div>
          <h2 id="faq-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Everything you need to know about playing free browser games on QUBNEXA.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {GAMES_CATEGORY_FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx
            return (
              <div
                key={faq.question}
                className="xw-panel overflow-hidden border border-slate-200/80 dark:border-slate-800 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600 dark:text-[#00DFFF]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 8. RELATED CATEGORIES */}
      {relatedCategories.length > 0 && (
        <section aria-labelledby="related-categories-heading" className="pt-8 border-t border-slate-200/80 dark:border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 id="related-categories-heading" className="text-xl font-bold text-slate-900 dark:text-white">
                Related Tool Categories
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Continue exploring other browser utility hubs on QUBNEXA.
              </p>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 dark:text-[#00DFFF] hover:underline"
            >
              <span>View all categories</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedCategories.map((relCat) => (
              <CategoryCard key={relCat.id} category={relCat} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
