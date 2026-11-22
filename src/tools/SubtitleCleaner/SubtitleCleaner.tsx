import React, { useState, useMemo } from 'react'
import {
  FileText,
  Copy,
  Check,
  Download,
  Sliders,
  Upload,
  AlignLeft,
  Clock,
} from 'lucide-react'

const SAMPLE_SRT = `1
00:00:01,200 --> 00:00:03,800
[Music playing]
NARRATOR: Welcome to the future of technology.

2
00:00:04,100 --> 00:00:06,500
(Audience cheering)
In this video, we're going to explore AI tools.

3
00:00:06,900 --> 00:00:09,400
SPEAKER 1: <i>Did you know that 80% of tasks</i>
can now be automated in seconds?

4
00:00:09,800 --> 00:00:12,100
[Laughter]
SPEAKER 2: That sounds almost impossible!

5
00:00:12,500 --> 00:00:15,000
NARRATOR: Let's look at the real data together.`

export const SubtitleCleaner: React.FC = () => {
  const [rawSubtitles, setRawSubtitles] = useState(SAMPLE_SRT)

  // Cleaning options
  const [removeTimestamps, setRemoveTimestamps] = useState(true)
  const [removeSequenceNumbers, setRemoveSequenceNumbers] = useState(true)
  const [removeSoundEffects, setRemoveSoundEffects] = useState(true) // [music], (applause)
  const [removeSpeakerLabels, setRemoveSpeakerLabels] = useState(true) // NARRATOR:, SPEAKER 1:
  const [removeHtmlTags, setRemoveHtmlTags] = useState(true) // <i>, <font>
  const [removeDuplicateLines, setRemoveDuplicateLines] = useState(true)
  const [joinAsParagraphs, setJoinAsParagraphs] = useState(false)

  // Timing shift option (only when timestamps kept)
  const [timeOffsetSeconds, setTimeOffsetSeconds] = useState(0.0)

  // UI state
  const [copied, setCopied] = useState(false)

  // Time shift helper for SRT timestamps (00:00:01,200)
  const shiftTimestamp = (timeStr: string, offsetSec: number): string => {
    const parts = timeStr.trim().replace(',', '.').split(':')
    if (parts.length < 3) return timeStr

    const hours = parseFloat(parts[0]) || 0
    const minutes = parseFloat(parts[1]) || 0
    const seconds = parseFloat(parts[2]) || 0

    const totalSeconds = Math.max(0, hours * 3600 + minutes * 60 + seconds + offsetSec)

    const newH = Math.floor(totalSeconds / 3600)
    const newM = Math.floor((totalSeconds % 3600) / 60)
    const newS = totalSeconds % 60
    const secWhole = Math.floor(newS)
    const ms = Math.round((newS - secWhole) * 1000)

    const pad = (n: number, z = 2) => String(n).padStart(z, '0')
    return `${pad(newH)}:${pad(newM)}:${pad(secWhole)},${pad(ms, 3)}`
  }

  // Clean Subtitle Algorithm
  const cleanedResult = useMemo(() => {
    if (!rawSubtitles.trim()) return ''

    const lines = rawSubtitles.split(/\r?\n/)
    const outputLines: string[] = []

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim()

      if (!line) {
        if (!joinAsParagraphs && outputLines.length > 0 && outputLines[outputLines.length - 1] !== '') {
          outputLines.push('')
        }
        continue
      }

      // Ignore WEBVTT headers
      if (line.startsWith('WEBVTT') || line.startsWith('NOTE') || line.startsWith('STYLE')) {
        continue
      }

      // 1. Remove Sequence numbers (lone integers)
      if (removeSequenceNumbers && /^\d+$/.test(line)) {
        continue
      }

      // 2. Handle Timestamp line (00:00:01,000 --> 00:00:04,000)
      if (line.includes('-->')) {
        if (removeTimestamps) {
          continue
        } else if (timeOffsetSeconds !== 0) {
          // Shift time
          const arrowSplit = line.split('-->')
          if (arrowSplit.length === 2) {
            line = `${shiftTimestamp(arrowSplit[0], timeOffsetSeconds)} --> ${shiftTimestamp(
              arrowSplit[1],
              timeOffsetSeconds
            )}`
          }
        }
      }

      // 3. Strip HTML Tags
      if (removeHtmlTags) {
        line = line.replace(/<\/?[^>]+(>|$)/g, '')
      }

      // 4. Strip Sound Effect cues [laughter], (applause), [MUSIC PLAYING]
      if (removeSoundEffects) {
        line = line.replace(/\[[^\]]*\]/g, '').replace(/\([^)]*\)/g, '').trim()
      }

      // 5. Strip Speaker Labels (e.g. "SPEAKER 1:", "NARRATOR:", "JOHN SMITH:")
      if (removeSpeakerLabels) {
        line = line.replace(/^(?:>>\s*)?[A-Z0-9\s._'-]{2,25}:\s*/i, '').trim()
      }

      if (!line) continue

      // 6. Deduplicate repeated consecutive lines
      if (removeDuplicateLines && outputLines.length > 0 && outputLines[outputLines.length - 1] === line) {
        continue
      }

      outputLines.push(line)
    }

    if (joinAsParagraphs) {
      return outputLines.filter(Boolean).join(' ')
    }

    return outputLines.join('\n')
  }, [
    rawSubtitles,
    removeTimestamps,
    removeSequenceNumbers,
    removeSoundEffects,
    removeSpeakerLabels,
    removeHtmlTags,
    removeDuplicateLines,
    joinAsParagraphs,
    timeOffsetSeconds,
  ])

  // File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      if (text) setRawSubtitles(text)
    }
    reader.readAsText(file)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanedResult)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const handleDownload = () => {
    const isSrt = !removeTimestamps
    const ext = isSrt ? 'srt' : 'txt'
    const blob = new Blob([cleanedResult], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `cleaned-subtitles.${ext}`
    link.click()
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500">
            <AlignLeft className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              SRT & VTT Subtitle Cleaner & Text Extractor
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Strip timestamps, cue markers, sound effect brackets, and speaker tags to produce clean readable transcripts or re-synced SRTs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy Clean Text'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            Download {removeTimestamps ? '.txt' : '.srt'}
          </button>
        </div>
      </div>

      {/* 2. Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input & Settings (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* File Upload & Input */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                Raw Subtitle Content (.srt / .vtt)
              </label>
              <label className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1">
                <Upload className="h-3.5 w-3.5" />
                Import File
                <input type="file" accept=".srt,.vtt,.txt" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <textarea
              rows={8}
              value={rawSubtitles}
              onChange={(e) => setRawSubtitles(e.target.value)}
              placeholder="Paste SRT or VTT subtitle content..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all leading-relaxed"
            />
          </div>

          {/* Cleaning Rules */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-purple-500" />
              Cleaning & Formatting Options
            </h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={removeTimestamps}
                  onChange={(e) => setRemoveTimestamps(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Remove Timestamps (00:01:23,000 &rarr; 00:01:25,000)
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={removeSequenceNumbers}
                  onChange={(e) => setRemoveSequenceNumbers(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Remove Subtitle Sequence Numbers (1, 2, 3...)
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={removeSoundEffects}
                  onChange={(e) => setRemoveSoundEffects(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Remove Sound Effect Cues ([Music], (Applause), [Laughter])
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={removeSpeakerLabels}
                  onChange={(e) => setRemoveSpeakerLabels(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Remove Speaker Names & Labels (NARRATOR:, SPEAKER 1:)
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={removeHtmlTags}
                  onChange={(e) => setRemoveHtmlTags(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Strip HTML Formatting Tags (&lt;i&gt;, &lt;b&gt;, &lt;font&gt;)
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={removeDuplicateLines}
                  onChange={(e) => setRemoveDuplicateLines(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Deduplicate Consecutive Repeating Lines
              </label>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={joinAsParagraphs}
                    onChange={(e) => setJoinAsParagraphs(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  Merge into a Single Flowing Reading Paragraph
                </label>
              </div>

              {/* Time Shift Control (when timestamps are preserved) */}
              {!removeTimestamps && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-blue-500" />
                      Time Shift / Delay (+/- Seconds)
                    </span>
                    <span className="font-mono text-blue-600 font-bold">{timeOffsetSeconds.toFixed(1)}s</span>
                  </div>
                  <input
                    type="range"
                    min="-10.0"
                    max="10.0"
                    step="0.5"
                    value={timeOffsetSeconds}
                    onChange={(e) => setTimeOffsetSeconds(parseFloat(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Output Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Cleaned Transcript Output
                </h3>
                <p className="text-xs text-slate-400">
                  {cleanedResult.split(/\s+/).filter(Boolean).length} words • {cleanedResult.length} characters
                </p>
              </div>

              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
                {removeTimestamps ? 'Plain Text Mode' : 'Clean SRT Mode'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 max-h-[580px] overflow-y-auto whitespace-pre-wrap select-all leading-relaxed">
              {cleanedResult || 'Paste subtitles on the left to see cleaned results.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubtitleCleaner
