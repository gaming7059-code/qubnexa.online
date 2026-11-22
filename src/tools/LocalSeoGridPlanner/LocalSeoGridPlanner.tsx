import React, { useState, useMemo } from 'react'
import {
  MapPin,
  Grid,
  Compass,
  Copy,
  Check,
  Sparkles,
  Award,
  FileSpreadsheet,
  HelpCircle,
} from 'lucide-react'

interface GridNode {
  id: string
  row: number
  col: number
  lat: number
  lng: number
  distanceMiles: number
  cardinal: string
  simulatedRank: number
  status: 'top3' | 'top10' | 'top20' | 'unranked'
}

export const LocalSeoGridPlanner: React.FC = () => {
  // Business and Keyword configuration
  const [businessName, setBusinessName] = useState('Apex Dental & Orthodontics')
  const [keyword, setKeyword] = useState('invisalign dentist')
  const [centerLat, setCenterLat] = useState(30.2672) // Austin, TX default
  const [centerLng, setCenterLng] = useState(-97.7431)

  // Grid Configuration
  const [gridSize, setGridSize] = useState<3 | 5 | 7>(5)
  const [stepRadiusMiles, setStepRadiusMiles] = useState(1.0) // distance between grid points

  // Local Authority Factors for Proximity Decay Simulation
  const [reviewCount, setReviewCount] = useState(185)
  const [avgRating, setAvgRating] = useState(4.9)
  const [profileOptimized, setProfileOptimized] = useState(true)

  // UI state
  const [selectedNode, setSelectedNode] = useState<GridNode | null>(null)
  const [copied, setCopied] = useState(false)

  // Cardinal direction helper
  const getCardinal = (rowOffset: number, colOffset: number): string => {
    if (rowOffset === 0 && colOffset === 0) return 'Center'
    const northSouth = rowOffset < 0 ? 'N' : rowOffset > 0 ? 'S' : ''
    const eastWest = colOffset > 0 ? 'E' : colOffset < 0 ? 'W' : ''
    return `${northSouth}${eastWest}` || 'Center'
  }

  // Calculate Grid Nodes & Proximity Decay Simulation
  const gridNodes: GridNode[] = useMemo(() => {
    const nodes: GridNode[] = []
    const half = Math.floor(gridSize / 2)

    // Miles to approximate Lat/Lng degree offsets:
    // 1 deg lat ~= 69 miles; 1 deg lng ~= 69 * cos(lat) miles
    const latMilesDeg = 69.0
    const lngMilesDeg = 69.0 * Math.cos((centerLat * Math.PI) / 180)

    // Baseline rank modifier based on authority factors
    let authorityBonus = 0
    if (reviewCount >= 100) authorityBonus += 2
    if (reviewCount >= 250) authorityBonus += 2
    if (avgRating >= 4.7) authorityBonus += 2
    if (profileOptimized) authorityBonus += 2

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const rowOffset = r - half // negative = north, positive = south
        const colOffset = c - half // positive = east, negative = west

        const distMiles = Math.sqrt(
          Math.pow(rowOffset * stepRadiusMiles, 2) + Math.pow(colOffset * stepRadiusMiles, 2)
        )

        const nodeLat = centerLat - (rowOffset * stepRadiusMiles) / latMilesDeg
        const nodeLng = centerLng + (colOffset * stepRadiusMiles) / lngMilesDeg

        // Proximity Decay Rank Calculation:
        // Rank 1 at epicenter (dist 0) with strong authority;
        // Drops ~1.8 ranks per mile away from center, softened by authorityBonus
        let estimatedRank = Math.round(1 + distMiles * 2.2 - authorityBonus)
        if (estimatedRank < 1) estimatedRank = 1
        if (estimatedRank > 25) estimatedRank = 25

        let status: 'top3' | 'top10' | 'top20' | 'unranked' = 'unranked'
        if (estimatedRank <= 3) status = 'top3'
        else if (estimatedRank <= 10) status = 'top10'
        else if (estimatedRank <= 20) status = 'top20'

        nodes.push({
          id: `node_${r}_${c}`,
          row: r,
          col: c,
          lat: Number(nodeLat.toFixed(5)),
          lng: Number(nodeLng.toFixed(5)),
          distanceMiles: Number(distMiles.toFixed(2)),
          cardinal: getCardinal(rowOffset, colOffset),
          simulatedRank: estimatedRank,
          status,
        })
      }
    }

    return nodes
  }, [gridSize, stepRadiusMiles, centerLat, centerLng, reviewCount, avgRating, profileOptimized])

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = gridNodes.length
    const top3Count = gridNodes.filter((n) => n.status === 'top3').length
    const top10Count = gridNodes.filter((n) => n.status === 'top10' || n.status === 'top3').length
    const avgRank = (gridNodes.reduce((acc, n) => acc + n.simulatedRank, 0) / total).toFixed(1)
    const mapPackCoveragePct = Math.round((top3Count / total) * 100)

    return { total, top3Count, top10Count, avgRank, mapPackCoveragePct }
  }, [gridNodes])

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Row', 'Col', 'Cardinal', 'Distance (Miles)', 'Latitude', 'Longitude', 'Simulated Rank', 'Status']
    const rows = gridNodes.map((n) => [
      n.row,
      n.col,
      `"${n.cardinal}"`,
      n.distanceMiles,
      n.lat,
      n.lng,
      n.simulatedRank,
      `"${n.status}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `local_seo_grid_${keyword.replace(/\s+/g, '_')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Copy Summary
  const handleCopySummary = async () => {
    const text = `Local SEO Geo-Grid Audit Summary:
Business: ${businessName}
Target Keyword: "${keyword}"
Grid Size: ${gridSize}x${gridSize} (${summaryMetrics.total} coordinate points)
Radius Step: ${stepRadiusMiles} miles
Map Pack Top 3 Visibility: ${summaryMetrics.mapPackCoveragePct}% (${summaryMetrics.top3Count}/${summaryMetrics.total} pins)
Top 10 Visibility: ${summaryMetrics.top10Count}/${summaryMetrics.total} pins
Average Geo Rank: #${summaryMetrics.avgRank}`

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Local SEO Geo-Grid Rank & Proximity Planner
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Plan, simulate, and analyze Google Map Pack local search rankings across customizable geographic radius grids.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Summary Copied' : 'Copy Summary'}
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Export Grid Coordinates CSV
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">Map Pack Share (Top 3)</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {summaryMetrics.mapPackCoveragePct}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {summaryMetrics.top3Count} of {summaryMetrics.total} pins
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">Top 10 Reach</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {summaryMetrics.top10Count}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Points in local contention</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">Average Geo-Rank</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            #{summaryMetrics.avgRank}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across entire radius</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">Grid Radius Diameter</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {((gridSize - 1) * stepRadiusMiles).toFixed(1)} mi
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{stepRadiusMiles} mi per step</div>
        </div>
      </div>

      {/* 3. Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              Location & Target Search Query
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Target Service / Local Keyword
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. emergency plumber, personal injury lawyer"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Center Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={centerLat}
                    onChange={(e) => setCenterLat(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Center Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={centerLng}
                    onChange={(e) => setCenterLng(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Grid Dimensions & Proximity Step */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Grid className="h-4 w-4 text-purple-500" />
              Geo-Grid Dimensions & Step Radius
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Grid Matrix Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([3, 5, 7] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setGridSize(sz)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        gridSize === sz
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {sz} x {sz} ({sz * sz} Pins)
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Step Distance Between Pins: <span className="font-bold text-blue-600">{stepRadiusMiles} miles</span>
                  </label>
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="5.0"
                  step="0.25"
                  value={stepRadiusMiles}
                  onChange={(e) => setStepRadiusMiles(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0.25 mi (Hyper-local)</span>
                  <span>2.5 mi</span>
                  <span>5.0 mi (Metropolitan)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Local Authority & Signal Inputs */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              Simulated Authority Signals
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Google Review Count
                  </label>
                  <input
                    type="number"
                    value={reviewCount}
                    onChange={(e) => setReviewCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Average Star Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={avgRating}
                    onChange={(e) => setAvgRating(parseFloat(e.target.value) || 5.0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 pt-1">
                <input
                  type="checkbox"
                  checked={profileOptimized}
                  onChange={(e) => setProfileOptimized(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Primary category & Google Business Profile fully optimized
              </label>
            </div>
          </div>
        </div>

        {/* Right Interactive Grid Visualizer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Simulated Map Pack Rank Matrix
                </h3>
                <p className="text-xs text-slate-400">
                  Click any coordinate node to inspect distance and simulated rank.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 text-[10px] font-semibold">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> 1-3 (Map Pack)
                </span>
                <span className="flex items-center gap-1 text-amber-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> 4-10
                </span>
                <span className="flex items-center gap-1 text-rose-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> 11+
                </span>
              </div>
            </div>

            {/* Grid Container */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
              <div
                className="grid gap-2.5"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                }}
              >
                {gridNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id
                  const isCenter = node.cardinal === 'Center'

                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSelectedNode(node)}
                      className={`h-11 w-11 sm:h-13 sm:w-13 rounded-xl flex flex-col items-center justify-center transition-all relative ${
                        node.status === 'top3'
                          ? 'bg-emerald-500 text-white shadow-sm hover:bg-emerald-600'
                          : node.status === 'top10'
                          ? 'bg-amber-500 text-white shadow-sm hover:bg-amber-600'
                          : 'bg-rose-500 text-white shadow-sm hover:bg-rose-600'
                      } ${isSelected ? 'ring-4 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 scale-105' : ''}`}
                    >
                      <span className="text-xs sm:text-sm font-bold font-mono">#{node.simulatedRank}</span>
                      <span className="text-[9px] opacity-80 uppercase leading-none mt-0.5">{node.cardinal}</span>
                      {isCenter && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selected Node Details Drawer */}
            {selectedNode && (
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Pin {selectedNode.cardinal} ({selectedNode.distanceMiles} mi from center)</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedNode.status === 'top3'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedNode.status === 'top10'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      Rank #{selectedNode.simulatedRank}
                    </span>
                  </div>
                  <div className="font-mono text-slate-500 text-[11px]">
                    Lat: {selectedNode.lat} | Lng: {selectedNode.lng}
                  </div>
                </div>

                <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                  {selectedNode.status === 'top3'
                    ? 'Dominant Map Pack visibility. High consumer click-through.'
                    : selectedNode.status === 'top10'
                    ? 'Within 1st page of expanded maps. Needs citations and reviews.'
                    : 'Proximity decay barrier. Needs localized landing pages.'}
                </div>
              </div>
            )}
          </div>

          {/* Local SEO Strategy Playbook */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              Proximity Expansion Action Plan
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">
                  1. City & Neighborhood Specific Landing Pages
                </strong>
                Create dedicated service pages targeting outer grid coordinates (e.g., "{keyword} in North Austin") with localized Schema.org markup.
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">
                  2. Geotagged Customer Reviews
                </strong>
                Encourage reviewers to mention specific neighborhood names or suburbs to strengthen relevance beyond the 1-mile epicenter.
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">
                  3. Local Citations & Chamber of Commerce Backlinks
                </strong>
                Build structured citations on local business directories across all surrounding postal codes to combat abrupt proximity falloff.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notice & Mathematical Model Disclaimer */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#050814] border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
        <HelpCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          <strong>Simulated Estimation Notice:</strong> Grid ranks displayed above are mathematical projections calculated from geographic distance decay and local authority weighting (reviews, ratings, category optimization). This tool does not scrape or represent real-time Google Maps search results, which fluctuate continuously based on personalized search history, device GPS precision, and dynamic algorithmic updates.
        </p>
      </div>
    </div>
  )
}

export default LocalSeoGridPlanner
