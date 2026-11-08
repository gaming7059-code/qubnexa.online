import React, { useState } from 'react'
import { Sparkles, Cpu, Cloud, Settings2, Server, HardDrive, Volume2, ChevronDown, ChevronUp, Info, CheckCircle2 } from 'lucide-react'
import type { TTSProviderId, CompanionServerStatus } from '../types'

interface EngineSelectorProps {
  activeEngine: TTSProviderId
  onSelectEngine: (id: TTSProviderId) => void
  onOpenCloudConfig: () => void
  isCloudConfigured: boolean
  companionStatus?: CompanionServerStatus
  onToggleModelManager?: () => void
  isModelManagerOpen?: boolean
}

export const EngineSelector: React.FC<EngineSelectorProps> = ({
  activeEngine,
  onSelectEngine,
  onOpenCloudConfig,
  isCloudConfigured,
  companionStatus,
  onToggleModelManager,
  isModelManagerOpen,
}) => {
  const [showDetails, setShowDetails] = useState(false)
  const isCompanionUp = companionStatus?.isAvailable ?? false

  const engines = [
    {
      id: 'companion' as TTSProviderId,
      name: 'Companion Neural',
      icon: Server,
      badge: isCompanionUp ? '24kHz Studio' : 'Localhost',
      badgeColor: isCompanionUp
        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300',
      activeColor: 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20 text-emerald-700 dark:text-emerald-400',
      tagline: 'High-fidelity natural voices for Bengali, Hindi, English & Urdu via local Python FastAPI companion.',
      details: 'Runs entirely on your local PC via `run_tts.bat`. Uses Kokoro / Edge-TTS / Piper models for crystal-clear 24kHz audio without GPU requirements.',
    },
    {
      id: 'local-neural' as TTSProviderId,
      name: 'In-Browser Neural',
      icon: Cpu,
      badge: 'VITS ONNX',
      badgeColor: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300',
      activeColor: 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 text-indigo-700 dark:text-indigo-400',
      tagline: '100% Client-side WebAssembly execution (Meta MMS-TTS). Generates uncompressed 16-bit PCM WAV.',
      details: 'Executed in-browser with WebAssembly ONNX Runtime. Once the voice model is downloaded, works 100% offline with zero server calls.',
    },
    {
      id: 'browser' as TTSProviderId,
      name: 'Free Browser Voice',
      icon: Volume2,
      badge: '0 MB • Instant',
      badgeColor: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
      activeColor: 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-500/20 text-blue-700 dark:text-blue-400',
      tagline: 'Standard Web Speech API voices. Instant playback for all system languages with zero download.',
      details: 'Directly uses your operating system and browser speech synthesis engine (Windows SAPI, Android TTS, Apple voices). Zero setup, zero download.',
    },
    {
      id: 'cloud-neural' as TTSProviderId,
      name: 'Cloud Studio (BYOK)',
      icon: Cloud,
      badge: isCloudConfigured ? 'Ready' : 'BYOK',
      badgeColor: isCloudConfigured
        ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
      activeColor: 'border-purple-600 bg-purple-50/80 dark:bg-purple-950/60 ring-2 ring-purple-500/20 text-purple-700 dark:text-purple-400',
      tagline: 'Direct client calls with your private OpenAI or ElevenLabs key. 100% private in browser.',
      details: 'Enter your OpenAI or ElevenLabs API key for ultra-lifelike cloud synthesis. Your key is stored solely in local browser storage.',
    },
  ]

  const activeEngineObj = engines.find((e) => e.id === activeEngine) || engines[0]

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 sm:p-4 shadow-2xs space-y-3.5">
      {/* Top Header: Title, Active Badge, Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            Speech Synthesis Engine
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40">
            Active: {activeEngineObj.name}
          </span>
          {isCompanionUp && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Companion Online
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onToggleModelManager && (
            <button
              type="button"
              onClick={onToggleModelManager}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                isModelManagerOpen
                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              <HardDrive className="h-3.5 w-3.5" />
              <span>Model Storage</span>
            </button>
          )}

          {activeEngine === 'cloud-neural' && (
            <button
              type="button"
              onClick={onOpenCloudConfig}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
              title="Configure API key"
            >
              <Settings2 className="h-3.5 w-3.5" />
              <span>{isCloudConfigured ? 'Configured' : 'Setup Key'}</span>
            </button>
          )}

          {/* Progressive Disclosure Toggle */}
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Toggle technical engine details"
          >
            <Info className="h-3.5 w-3.5 text-slate-400" />
            <span>{showDetails ? 'Hide Specs' : 'Engine Specs'}</span>
            {showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Primary Engine Selector Pills: 1-Click Responsive Switcher */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {engines.map((engine) => {
          const isSelected = activeEngine === engine.id
          const Icon = engine.icon
          return (
            <button
              key={engine.id}
              type="button"
              onClick={() => onSelectEngine(engine.id)}
              className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-200 select-none active:scale-[0.98] min-h-[52px] flex flex-col justify-between ${
                isSelected
                  ? engine.activeColor
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon className={`h-4 w-4 shrink-0 ${isSelected ? '' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span className={`text-xs font-bold truncate ${isSelected ? '' : 'text-slate-800 dark:text-slate-200'}`}>
                    {engine.name}
                  </span>
                </div>
                {isSelected && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-current" />}
              </div>
              <div className="flex items-center justify-between gap-1">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${engine.badgeColor}`}>
                  {engine.badge}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Progressive Disclosure Section: Deep Technical Specifications */}
      {showDetails && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Architecture &amp; Engine Comparison</span>
            <span className="text-[11px] font-normal">Click any engine above to switch active synthesis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {engines.map((engine) => {
              const isSelected = activeEngine === engine.id
              return (
                <div
                  key={engine.id}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 transition-colors ${
                    isSelected
                      ? 'border-blue-300 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{engine.name}</span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full ${engine.badgeColor}`}>
                      {engine.badge}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    {engine.details}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
