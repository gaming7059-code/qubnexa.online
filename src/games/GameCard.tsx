import React from 'react'
import { Play, Sparkles } from 'lucide-react'
import type { GameInfo } from './types'
import { GameIcon } from './GameIcon'

interface GameCardProps {
  game: GameInfo
  isActive?: boolean
  onSelect?: (game: GameInfo) => void
}

export const GameCard: React.FC<GameCardProps> = ({ game, isActive = false, onSelect }) => {
  return (
    <div
      onClick={() => onSelect?.(game)}
      className={`card-lift group relative flex h-full flex-col justify-between rounded-2xl border p-5 transition-all duration-300 ease-out cursor-pointer overflow-hidden ${
        isActive
          ? 'border-blue-600 dark:border-[#00DFFF] bg-blue-50/60 dark:bg-[#11182D] ring-2 ring-blue-500/20 dark:ring-[#00DFFF]/25 shadow-lg'
          : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0B1020] hover:border-blue-500/70 dark:hover:border-[#00DFFF]/60 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-[0_12px_30px_rgba(0,223,255,0.08)]'
      }`}
    >
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00DFFF] via-blue-500 to-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <GameIcon gameId={game.id} size="md" withContainer />
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-[#11182D] border border-blue-200/70 dark:border-[#00DFFF]/30 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-[#00DFFF]">
              <Sparkles className="h-2.5 w-2.5" /> {game.tag}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {game.category} {game.tag ? `• ${game.tag}` : ''}
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#00DFFF] transition-colors">
            {game.title}
          </h3>
          {game.subtitle && (
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-[#00DFFF]/90">
              {game.subtitle}
            </p>
          )}
        </div>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {game.description}
        </p>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Instant Browser Play
        </span>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-[#00DFFF] group-hover:text-blue-700 dark:group-hover:text-cyan-300 transition-colors">
          <span>{isActive ? 'PLAYING' : 'PLAY NOW'}</span>
          <Play className="h-3.5 w-3.5 fill-current group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  )
}
