import React, { useMemo, useState } from 'react'
import { FlipVertical2, Globe2 } from 'lucide-react'
import { TextInputPanel } from '../../components/text-tools/TextInputPanel'
import { TextOutputPanel } from '../../components/text-tools/TextOutputPanel'
import {
  type TextInverterMode,
  getTextMetrics,
  invertText,
} from '../../utils/textTransform'

const INVERTER_MODES: Array<{
  id: TextInverterMode
  title: string
  description: string
  preview: string
}> = [
  {
    id: 'upside-down',
    title: 'Upside Down',
    description: 'Flips supported letters, digits & punctuation 180° using Unicode.',
    preview: '∀XƎNᗺ∩Ό',
  },
  {
    id: 'backwards',
    title: 'Backwards',
    description: 'Reverses the entire text character-by-character while keeping lines.',
    preview: 'AXENBUQ',
  },
  {
    id: 'reverse-each-word',
    title: 'Reverse Each Word',
    description: 'Flips spelling inside every word while preserving word sequence.',
    preview: 'olleH dlroW',
  },
  {
    id: 'reverse-word-order',
    title: 'Reverse Word Order',
    description: 'Reverses word placement while keeping each word spelled cleanly.',
    preview: 'World Hello',
  },
]

export const TextInverter: React.FC = () => {
  const [text, setText] = useState<string>('QUBNEXA — Explore. Create. Simplify!')
  const [mode, setMode] = useState<TextInverterMode>('upside-down')

  const inputMetrics = useMemo(() => getTextMetrics(text), [text])
  const invertResult = useMemo(() => invertText(text, mode), [text, mode])

  const unsupportedNotice = useMemo(() => {
    if (mode !== 'upside-down' || !invertResult.hasUnsupportedForUpsideDown) {
      return null
    }
    const sampleChars = invertResult.unsupportedChars.slice(0, 8).join(' ')
    const extraCount = invertResult.unsupportedChars.length - 8
    const suffix = extraCount > 0 ? ` (+${extraCount} more)` : ''
    return `Some characters (${sampleChars}${suffix}) do not have an upside-down Unicode equivalent and were preserved safely without deletion.`
  }, [mode, invertResult])

  return (
    <div className="space-y-5">
      {/* Desktop: Input (Left) + Mode Options (Right); Mobile: Vertical Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7">
          <TextInputPanel
            id="text-inverter-input"
            label="Input Text"
            value={text}
            onChange={setText}
            metrics={inputMetrics}
            placeholder="Type or paste English, Bengali (বাংলা), Hindi (हिन्दी), emoji, or multi-line text..."
            sampleText={'Hello QUBNEXA 2026!\nবাংলা ও हिन्दी पाठ सुरक्षित रूप से\nLaunch 🚀 Tools'}
          />
        </div>

        <aside
          aria-label="Inversion Modes"
          className="lg:col-span-5 xw-surface p-4 sm:p-5 space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
            <FlipVertical2 className="h-4 w-4 text-blue-600 dark:text-[#00DFFF]" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Inversion Mode</h2>
          </div>

          <div role="radiogroup" aria-label="Choose text inversion mode" className="space-y-2.5">
            {INVERTER_MODES.map((opt) => {
              const isSelected = mode === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setMode(opt.id)}
                  className={`w-full text-left rounded-xl border p-3.5 transition-all min-h-[56px] ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 shadow-xs dark:border-[#00DFFF] dark:bg-cyan-950/35'
                      : 'border-slate-200 bg-slate-50/70 hover:border-blue-300 dark:border-slate-800 dark:bg-[#11182D]/60 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {opt.title}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-mono ${
                        isSelected
                          ? 'bg-blue-600 text-white dark:bg-[#00DFFF] dark:text-[#050814] font-semibold'
                          : 'bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {opt.preview}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {opt.description}
                  </p>
                </button>
              )
            })}
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-[#11182D]/60 dark:text-slate-300">
            <div className="flex items-start gap-2">
              <Globe2 className="h-4 w-4 shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
              <span>
                Unicode grapheme-aware: safely preserves Bengali, Hindi, combining marks, and multi-codepoint emojis.
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* Full-Width Output Panel Underneath */}
      <TextOutputPanel
        id="text-inverter-output"
        title="Inverted Output"
        fullOutput={invertResult.output}
        downloadFilename="qubnexa-inverted-text.txt"
        emptyPlaceholder="Your flipped or reversed text appears here live..."
        onUseResultAsInput={setText}
        infoBanner={unsupportedNotice}
      />
    </div>
  )
}
