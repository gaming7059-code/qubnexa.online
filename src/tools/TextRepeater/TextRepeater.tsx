import React, { useMemo, useState } from 'react'
import { Minus, Plus, SlidersHorizontal, ShieldCheck } from 'lucide-react'
import { TextInputPanel } from '../../components/text-tools/TextInputPanel'
import { TextOutputPanel } from '../../components/text-tools/TextOutputPanel'
import {
  MAX_REPEAT_COUNT,
  type RepeatSeparatorMode,
  type RepeatTransformMode,
  formatBytesCompact,
  getTextMetrics,
  repeatText,
} from '../../utils/textTransform'

const QUICK_PRESETS = [
  { label: '100 times', value: 100 },
  { label: '500 times', value: 500 },
  { label: '1,000 times', value: 1000 },
  { label: '100,000 times', value: 100_000 },
] as const

const SEPARATOR_OPTIONS: Array<{ id: RepeatSeparatorMode; label: string }> = [
  { id: 'newline', label: 'New Line' },
  { id: 'space', label: 'Space' },
  { id: 'nothing', label: 'Nothing' },
  { id: 'custom', label: 'Custom' },
]

const TRANSFORM_OPTIONS: Array<{ id: RepeatTransformMode; label: string }> = [
  { id: 'normal', label: 'Normal' },
  { id: 'upside-down', label: 'Upside Down' },
  { id: 'backwards', label: 'Backwards' },
  { id: 'bold', label: 'Bold' },
  { id: 'glitch', label: 'Glitch' },
]

export const TextRepeater: React.FC = () => {
  const [text, setText] = useState<string>('QUBNEXA — Explore. Create. Simplify.')
  const [countInput, setCountInput] = useState<string>('5')
  const [separatorMode, setSeparatorMode] = useState<RepeatSeparatorMode>('newline')
  const [customSeparator, setCustomSeparator] = useState<string>(', ')
  const [transformMode, setTransformMode] = useState<RepeatTransformMode>('normal')

  const parsedCount = useMemo(() => {
    const trimmed = countInput.trim()
    if (!trimmed || !/^-?\d+$/.test(trimmed)) return NaN
    return Number(trimmed)
  }, [countInput])

  const inputMetrics = useMemo(() => getTextMetrics(text), [text])

  const repeatResult = useMemo(
    () =>
      repeatText({
        text,
        count: parsedCount,
        separatorMode,
        customSeparator,
        transformMode,
      }),
    [text, parsedCount, separatorMode, customSeparator, transformMode],
  )

  const handleStep = (delta: number) => {
    const base = Number.isInteger(parsedCount) && parsedCount >= 1 ? parsedCount : 1
    const next = Math.max(1, Math.min(MAX_REPEAT_COUNT, base + delta))
    setCountInput(String(next))
  }

  return (
    <div className="space-y-5">
      {/* Desktop: Input (Left) + Options (Right); Mobile: Vertical Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7">
          <TextInputPanel
            id="text-repeater-input"
            label="Input Text"
            value={text}
            onChange={setText}
            metrics={inputMetrics}
            placeholder="Type or paste any word, message, emoji, or paragraph to repeat..."
            sampleText={'Explore. Create. Simplify.\nবাংলা • हिन्दी • QUBNEXA 🚀'}
          />
        </div>

        <aside
          aria-label="Repeat Options"
          className="lg:col-span-5 xw-surface p-4 sm:p-5 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-blue-600 dark:text-[#00DFFF]" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Repeat Settings</h2>
            </div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Max {MAX_REPEAT_COUNT.toLocaleString()}x
            </span>
          </div>

          {/* Repeat Count Stepper */}
          <div className="space-y-2">
            <label
              htmlFor="repeat-count-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
            >
              Repeat Count
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStep(-1)}
                disabled={Number.isInteger(parsedCount) && parsedCount <= 1}
                aria-label="Decrease repeat count"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 transition-colors dark:border-slate-700 dark:bg-[#11182D] dark:text-slate-200 dark:hover:border-[#00DFFF]"
              >
                <Minus className="h-4 w-4" />
              </button>

              <input
                id="repeat-count-input"
                type="number"
                inputMode="numeric"
                min={1}
                max={MAX_REPEAT_COUNT}
                value={countInput}
                onChange={(e) => setCountInput(e.target.value)}
                aria-invalid={!repeatResult.isCountValid}
                className="xw-input text-center font-bold tabular-nums min-h-[44px]"
              />

              <button
                type="button"
                onClick={() => handleStep(1)}
                disabled={Number.isInteger(parsedCount) && parsedCount >= MAX_REPEAT_COUNT}
                aria-label="Increase repeat count"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 transition-colors dark:border-slate-700 dark:bg-[#11182D] dark:text-slate-200 dark:hover:border-[#00DFFF]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {repeatResult.countError && (
              <p role="alert" className="text-xs font-medium text-rose-600 dark:text-rose-400">
                {repeatResult.countError}
              </p>
            )}
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Quick Presets
            </span>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_PRESETS.map((preset) => {
                const isActive = parsedCount === preset.value
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setCountInput(String(preset.value))}
                    className={`min-h-[40px] rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-400 hover:text-blue-600 dark:border-slate-800 dark:bg-[#11182D] dark:text-slate-200 dark:hover:border-[#00DFFF]/60'
                    }`}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Separators */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Separator
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SEPARATOR_OPTIONS.map((opt) => {
                const isActive = separatorMode === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSeparatorMode(opt.id)}
                    aria-pressed={isActive}
                    className={`min-h-[40px] rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-400 dark:border-slate-800 dark:bg-[#11182D] dark:text-slate-200 dark:hover:border-[#00DFFF]/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>

            {separatorMode === 'custom' && (
              <div className="pt-1">
                <label htmlFor="custom-separator-input" className="sr-only">
                  Custom separator text
                </label>
                <input
                  id="custom-separator-input"
                  type="text"
                  value={customSeparator}
                  onChange={(e) => setCustomSeparator(e.target.value)}
                  maxLength={50}
                  placeholder="Enter custom separator (e.g. , or | )"
                  className="xw-input text-xs sm:text-sm"
                />
              </div>
            )}
          </div>

          {/* Text Transform */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Text Style Transform
            </span>
            <div className="flex flex-wrap gap-2">
              {TRANSFORM_OPTIONS.map((opt) => {
                const isActive = transformMode === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTransformMode(opt.id)}
                    aria-pressed={isActive}
                    className={`min-h-[38px] rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-purple-400 dark:border-slate-800 dark:bg-[#11182D] dark:text-slate-200 dark:hover:border-purple-400/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Estimated Output Size Indicator */}
          <div
            className={`rounded-xl border px-3.5 py-2.5 text-xs ${
              repeatResult.exceedsLimit
                ? 'border-rose-200 bg-rose-50/80 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200'
                : 'border-cyan-200/80 bg-cyan-50/60 text-slate-700 dark:border-cyan-500/20 dark:bg-[#11182D]/70 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-600 dark:text-[#00DFFF]" />
                <span>Estimated Output</span>
              </span>
              <span className="font-bold tabular-nums">
                {repeatResult.isCountValid && text
                  ? `${formatBytesCompact(repeatResult.estimatedBytes)} (${repeatResult.estimatedChars.toLocaleString()} chars)`
                  : '0 B'}
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* Full-Width Output Panel Underneath */}
      <TextOutputPanel
        id="text-repeater-output"
        title="Repeated Output"
        fullOutput={repeatResult.output}
        previewOutput={repeatResult.previewOutput}
        isPreviewTruncated={repeatResult.isPreviewTruncated}
        downloadFilename="qubnexa-repeated-text.txt"
        emptyPlaceholder="Your repeated text will appear here instantaneously..."
        onUseResultAsInput={(next) => {
          setText(next)
          setCountInput('1')
        }}
        errorBanner={repeatResult.countError || repeatResult.limitReason}
      />
    </div>
  )
}
