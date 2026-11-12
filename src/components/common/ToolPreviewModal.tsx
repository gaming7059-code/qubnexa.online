import React from 'react'
import { X, Clock, CheckCircle2 } from 'lucide-react'
import type { Tool } from '../../types/tools'
import { DynamicIcon } from './DynamicIcon'

interface ToolPreviewModalProps {
  tool: Tool | null
  onClose: () => void
}

export const ToolPreviewModal: React.FC<ToolPreviewModalProps> = ({ tool, onClose }) => {
  if (!tool) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050814]/70 backdrop-blur-xs animate-fade-in">
      <div 
        className="xw-surface w-full max-w-lg p-6 shadow-2xl animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-[#11182D] text-blue-600 dark:text-[#00DFFF] border border-blue-100 dark:border-slate-800">
              <DynamicIcon name={tool.icon} className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-[#00DFFF]">
                {tool.categoryName}
              </span>
              <h3 id="modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                {tool.name}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[40px] min-w-[40px] cursor-pointer items-center justify-center rounded-xl p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#11182D] hover:text-slate-700 dark:hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {tool.description}
          </p>

          <div className="rounded-xl bg-cyan-50/70 dark:bg-cyan-950/35 border border-cyan-100 dark:border-[#00DFFF]/25 p-4">
            <div className="flex items-center gap-2 text-cyan-800 dark:text-[#00DFFF] font-semibold text-sm mb-1.5">
              <Clock className="h-4 w-4 text-cyan-600 dark:text-[#00DFFF]" />
              <span>QUBNEXA Module Preview</span>
            </div>
            <p className="text-xs text-cyan-800 dark:text-cyan-200 leading-relaxed">
              This utility is scheduled on the QUBNEXA platform roadmap for an upcoming release.
            </p>
          </div>

          <div className="xw-surface-muted p-3 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>100% Client-side processing (no database / no accounts)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Fast, responsive, and built for QUBNEXA users globally</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="xw-btn-secondary min-h-[44px] px-4 py-2 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
