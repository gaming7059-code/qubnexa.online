import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import {
  Star,
  QrCode,
  Copy,
  Check,
  Download,
  ExternalLink,
  Store,
  Printer,
  Code2,
  Palette,
  HelpCircle,
} from 'lucide-react'

export const GoogleReviewLinkGenerator: React.FC = () => {
  // Input Method: 'place_id' | 'shortlink' | 'search_fallback'
  const [method, setMethod] = useState<'place_id' | 'shortlink' | 'search_fallback'>('place_id')

  // Inputs
  const [placeId, setPlaceId] = useState('ChIJN1t_tDeuEmsRUsoyG83frY4') // Example Place ID (Sydney Opera House)
  const [shortlinkCode, setShortlinkCode] = useState('CR123456789')
  const [businessName, setBusinessName] = useState('The Coffee Roastery')
  const [businessCity, setBusinessCity] = useState('Austin, TX')

  // QR Customization
  const [fgColor, setFgColor] = useState('#0f172a')
  const [bgColor, setBgColor] = useState('#ffffff')
  const qrSize = 256
  const [qrDataUrl, setQrDataUrl] = useState('')

  // Printable Card / Call To Action Text
  const [cardHeadline, setCardHeadline] = useState('Love our service?')
  const [cardSubtext, setCardSubtext] = useState('Scan with your smartphone camera to leave us a review on Google!')

  // UI state
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedHtml, setCopiedHtml] = useState(false)

  // Construct Direct Review Link
  const reviewLink = React.useMemo(() => {
    if (method === 'place_id') {
      const pid = placeId.trim()
      return pid ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(pid)}` : ''
    } else if (method === 'shortlink') {
      const code = shortlinkCode.trim().replace(/^https?:\/\/g\.page\/r\//, '').replace(/\/review$/, '')
      return code ? `https://g.page/r/${encodeURIComponent(code)}/review` : ''
    } else {
      const query = [businessName.trim(), businessCity.trim()].filter(Boolean).join(' ')
      return query
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
        : ''
    }
  }, [method, placeId, shortlinkCode, businessName, businessCity])

  // Generate QR code whenever link or styling changes
  useEffect(() => {
    let isCancelled = false

    if (reviewLink) {
      QRCode.toDataURL(reviewLink, {
        width: qrSize,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: 'M',
      })
        .then((url) => {
          if (!isCancelled) setQrDataUrl(url)
        })
        .catch((err) => console.error('QR generation error:', err))
    }

    return () => {
      isCancelled = true
    }
  }, [reviewLink, fgColor, bgColor])

  // Copy link
  const handleCopyLink = async () => {
    if (!reviewLink) return
    try {
      await navigator.clipboard.writeText(reviewLink)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch {
      // fallback
    }
  }

  // Copy HTML snippet
  const htmlSnippet = `<a href="${reviewLink}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background-color:#4285F4;color:#ffffff;border-radius:6px;text-decoration:none;font-family:sans-serif;font-weight:600;font-size:14px;">★ Review us on Google</a>`

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(htmlSnippet)
      setCopiedHtml(true)
      setTimeout(() => setCopiedHtml(false), 2000)
    } catch {
      // fallback
    }
  }

  // Download QR Code image
  const handleDownloadQr = () => {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.download = `google-review-qr-${businessName.toLowerCase().replace(/\s+/g, '-') || 'code'}.png`
    link.href = qrDataUrl
    link.click()
  }

  // Print review flyer
  const handlePrintFlyer = () => {
    window.print()
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500">
            <Star className="h-6 w-6 fill-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Google Review Direct Link & QR Code Generator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create instant 5-star review links, customized printable QR codes, and website review buttons.
            </p>
          </div>
        </div>

        {/* Method Selector Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold self-start md:self-auto">
          <button
            type="button"
            onClick={() => setMethod('place_id')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              method === 'place_id'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Google Place ID (Recommended)
          </button>
          <button
            type="button"
            onClick={() => setMethod('shortlink')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              method === 'shortlink'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            g.page Shortlink
          </button>
          <button
            type="button"
            onClick={() => setMethod('search_fallback')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              method === 'search_fallback'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Business Search
          </button>
        </div>
      </div>

      {/* 2. Main Config Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Store className="h-4 w-4 text-blue-500" />
              Business Identifier Details
            </h3>

            {method === 'place_id' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Google Place ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={placeId}
                    onChange={(e) => setPlaceId(e.target.value)}
                    placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Find your Place ID in your Google Business Profile dashboard or the official Google Place ID Finder map.
                  </p>
                </div>
              </div>
            )}

            {method === 'shortlink' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Google Business Profile Short Name / Handle
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 overflow-hidden text-xs">
                    <span className="px-3 py-2 text-slate-400 font-mono select-none">https://g.page/r/</span>
                    <input
                      type="text"
                      value={shortlinkCode}
                      onChange={(e) => setShortlinkCode(e.target.value)}
                      placeholder="YOUR_ID"
                      className="w-full py-2 pr-3 bg-transparent text-slate-900 dark:text-white font-mono focus:outline-none"
                    />
                    <span className="px-3 py-2 text-slate-400 font-mono select-none">/review</span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Found in Google Business Profile → "Ask for reviews" → Review link.
                  </p>
                </div>
              </div>
            )}

            {method === 'search_fallback' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Blue Bottle Coffee"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    City, State or Location
                  </label>
                  <input
                    type="text"
                    value={businessCity}
                    onChange={(e) => setBusinessCity(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Generated Link Display */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>Direct 1-Click Review Link</span>
              <span className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400 font-medium">
                Opens Review Dialog Directly
              </span>
            </h3>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
              {reviewLink || 'Please enter valid business details above...'}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyLink}
                disabled={!reviewLink}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedLink ? 'Link Copied!' : 'Copy Review Link'}
              </button>

              <a
                href={reviewLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all ${
                  !reviewLink ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Test Link
              </a>
            </div>
          </div>

          {/* Printable Card Customization */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Printer className="h-4 w-4 text-emerald-500" />
              Table Tent & Flyer Text Customization
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Card Headline
                </label>
                <input
                  type="text"
                  value={cardHeadline}
                  onChange={(e) => setCardHeadline(e.target.value)}
                  placeholder="e.g. Love our service?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Call-To-Action Subtitle
                </label>
                <input
                  type="text"
                  value={cardSubtext}
                  onChange={(e) => setCardSubtext(e.target.value)}
                  placeholder="e.g. Scan with your camera to review us on Google!"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* QR Code Color & Styling */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Palette className="h-4 w-4 text-purple-500" />
              QR Code Palette
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Foreground Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-8 w-10 p-0 rounded border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-8 w-10 p-0 rounded border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview Card & Print Display (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Visual Flyer / Counter Card Preview */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <QrCode className="h-4 w-4 text-blue-500" />
                Live Review Card Preview
              </h3>
              <button
                type="button"
                onClick={handlePrintFlyer}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Flyer
              </button>
            </div>

            {/* Counter Stand Mockup */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center space-y-4 shadow-sm">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="h-5 w-5 fill-amber-400" />
                <Star className="h-5 w-5 fill-amber-400" />
                <Star className="h-5 w-5 fill-amber-400" />
                <Star className="h-5 w-5 fill-amber-400" />
                <Star className="h-5 w-5 fill-amber-400" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{cardHeadline}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">{cardSubtext}</p>
              </div>

              {/* QR Image Box */}
              <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Google Review QR Code"
                    className="w-48 h-48 rounded-xl object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                    Generating QR...
                  </div>
                )}
              </div>

              <div className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                Google Customer Reviews
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadQr}
                disabled={!qrDataUrl}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Download PNG QR Code
              </button>
            </div>
          </div>

          {/* HTML Embed Snippet */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-cyan-500" />
              Website & Email Signature Badge
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Embed this button directly into your website footer, transactional emails, or invoice receipts.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all select-all">
              {htmlSnippet}
            </div>

            <button
              type="button"
              onClick={handleCopyHtml}
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all"
            >
              {copiedHtml ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedHtml ? 'HTML Copied!' : 'Copy Embed HTML'}
            </button>
          </div>
        </div>
      </div>

      {/* Google Account Requirement & Review Disclosure */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#050814] border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
        <HelpCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
        <p>
          <strong>Google Account Requirement:</strong> To leave a review or star rating, customers who scan your QR code or open your link must be signed in with an active Google Account (Gmail or Google Workspace). This is an unavoidable Google Maps security requirement designed to combat fake reviews and bot spam.
        </p>
      </div>
    </div>
  )
}

export default GoogleReviewLinkGenerator
