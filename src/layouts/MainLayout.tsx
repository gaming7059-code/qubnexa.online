import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Header } from '../components/common/Header'
import { Footer } from '../components/common/Footer'
import { SearchModal } from '../components/common/SearchModal'
import { ToolPreviewModal } from '../components/common/ToolPreviewModal'
import { recordRecentTool } from '../utils/recentTools'
import type { Tool } from '../types/tools'

export interface LayoutContextType {
  openSearch: () => void
  openToolPreview: (tool: Tool) => void
}

export const MainLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [previewTool, setPreviewTool] = useState<Tool | null>(null)

  const handleOpenSearch = () => setIsSearchOpen(true)
  const handleCloseSearch = () => setIsSearchOpen(false)

  const handleOpenToolPreview = (tool: Tool) => {
    if (tool.isFunctional) {
      recordRecentTool(tool.id)
      navigate(tool.path)
    } else {
      setPreviewTool(tool)
    }
  }

  const handleCloseToolPreview = () => {
    setPreviewTool(null)
  }

  const handleSelectToolFromSearch = (tool: Tool) => {
    setIsSearchOpen(false)
    if (tool.isFunctional) {
      recordRecentTool(tool.id)
      navigate(tool.path)
    } else {
      setPreviewTool(tool)
    }
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-slate-50 dark:bg-[#050814] text-slate-900 dark:text-slate-100 selection:bg-cyan-100 dark:selection:bg-cyan-900/50 selection:text-cyan-900 dark:selection:text-cyan-100 transition-colors duration-200">
      <Header onOpenSearch={handleOpenSearch} />

      <main key={location.pathname} className="flex-1 animate-page-enter">
        <Outlet
          context={{
            openSearch: handleOpenSearch,
            openToolPreview: handleOpenToolPreview,
          } satisfies LayoutContextType}
        />
      </main>

      <Footer />

      {/* Global Search Dialog (Ctrl+K or Header trigger) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={handleCloseSearch}
        onSelectTool={handleSelectToolFromSearch}
      />

      {/* Step 1 Tool Preview Modal */}
      <ToolPreviewModal
        tool={previewTool}
        onClose={handleCloseToolPreview}
      />
    </div>
  )
}
