import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Globe,
  FileText,
  Wifi,
  Mail,
  Phone,
  User,
  Download,
  Copy,
  Check,
  Palette,
  ShieldCheck,
  AlertCircle,
  Eye,
  Lock,
} from 'lucide-react'
import {
  type QrType,
  type QrErrorCorrection,
  type WifiConfig,
  type EmailConfig,
  type VCardConfig,
  formatUrlPayload,
  formatWifiPayload,
  formatEmailPayload,
  formatPhonePayload,
  formatVCardPayload,
  renderQrToCanvas,
  generateQrSvgString,
  copyCanvasImageToClipboard,
} from '../../utils/qrCodeGenerator'

const COLOR_PRESETS = [
  { name: 'Classic Dark', dark: '#000000', light: '#ffffff' },
  { name: 'Deep Indigo', dark: '#1e1b4b', light: '#f5f3ff' },
  { name: 'Ocean Blue', dark: '#0369a1', light: '#f0f9ff' },
  { name: 'Emerald Mint', dark: '#065f46', light: '#ecfdf5' },
  { name: 'Midnight Violet', dark: '#581c87', light: '#faf5ff' },
  { name: 'Charcoal Dark', dark: '#0f172a', light: '#f8fafc' },
]

export const QrCodeGenerator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Active Type Tab
  const [activeType, setActiveType] = useState<QrType>('url')

  // Form States
  const defaultSampleUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://example.com'
  const [urlInput, setUrlInput] = useState(defaultSampleUrl)
  const [textInput, setTextInput] = useState('Welcome to QUBNEXA!')
  const [wifiConfig, setWifiConfig] = useState<WifiConfig>({
    ssid: 'Home_WiFi_5G',
    password: '',
    encryption: 'WPA',
    hidden: false,
  })
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    email: 'contact@example.com',
    subject: 'Inquiry',
    body: 'Hello from QUBNEXA!',
  })
  const [phoneInput, setPhoneInput] = useState('+91 98765 43210')
  const [vCardConfig, setVCardConfig] = useState<VCardConfig>({
    firstName: 'Rohan',
    lastName: 'Sharma',
    phone: '+91 98765 43210',
    email: 'rohan.sharma@example.com',
    company: 'Tech Solutions India',
    jobTitle: 'Software Architect',
    website: defaultSampleUrl,
    address: 'Bengaluru, Karnataka, India',
  })

  // Customization Settings
  const [darkColor, setDarkColor] = useState('#000000')
  const [lightColor, setLightColor] = useState('#ffffff')
  const [qrSize, setQrSize] = useState<number>(360)
  const [errorCorrection, setErrorCorrection] = useState<QrErrorCorrection>('M')
  const margin = 2

  // UI feedback states
  const [copiedStatus, setCopiedStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showWifiPassword, setShowWifiPassword] = useState(false)

  // Compute Active Payload
  const currentPayload = useMemo(() => {
    switch (activeType) {
      case 'url':
        return formatUrlPayload(urlInput)
      case 'text':
        return textInput.trim()
      case 'wifi':
        return formatWifiPayload(wifiConfig)
      case 'email':
        return formatEmailPayload(emailConfig)
      case 'phone':
        return formatPhonePayload(phoneInput)
      case 'vcard':
        return formatVCardPayload(vCardConfig)
      default:
        return ''
    }
  }, [activeType, urlInput, textInput, wifiConfig, emailConfig, phoneInput, vCardConfig])

  // Live Render QR Code to Canvas
  useEffect(() => {
    let isCancelled = false
    const render = async () => {
      if (!canvasRef.current) return
      setIsGenerating(true)
      try {
        await renderQrToCanvas(canvasRef.current, currentPayload, {
          width: qrSize,
          margin,
          color: { dark: darkColor, light: lightColor },
          errorCorrectionLevel: errorCorrection,
        })
      } catch (err) {
        console.error('QR rendering error:', err)
      } finally {
        if (!isCancelled) setIsGenerating(false)
      }
    }

    render()
    return () => {
      isCancelled = true
    }
  }, [currentPayload, qrSize, margin, darkColor, lightColor, errorCorrection])

  // Download Handlers
  const handleDownloadPng = () => {
    if (!canvasRef.current || !currentPayload) return
    const link = document.createElement('a')
    link.download = `qubnexa-qr-${activeType}.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  const handleDownloadSvg = async () => {
    if (!currentPayload) return
    try {
      const svgString = await generateQrSvgString(currentPayload, {
        width: qrSize,
        margin,
        color: { dark: darkColor, light: lightColor },
        errorCorrectionLevel: errorCorrection,
      })
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `qubnexa-qr-${activeType}.svg`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to export SVG:', err)
    }
  }

  const handleCopyImage = async () => {
    if (!canvasRef.current || !currentPayload) return
    const success = await copyCanvasImageToClipboard(canvasRef.current)
    if (success) {
      setCopiedStatus('copied')
      setTimeout(() => setCopiedStatus('idle'), 2500)
    } else {
      setCopiedStatus('error')
      setTimeout(() => setCopiedStatus('idle'), 3000)
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. TYPE SELECTOR TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'url', label: 'Website URL', icon: Globe },
          { id: 'text', label: 'Plain Text', icon: FileText },
          { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
          { id: 'email', label: 'Email Address', icon: Mail },
          { id: 'phone', label: 'Phone Call', icon: Phone },
          { id: 'vcard', label: 'Contact Card', icon: User },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeType === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveType(tab.id as QrType)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 select-none active:scale-95 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-[#16203B]/60'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 2. MAIN WORKSPACE (2 COLS ON DESKTOP) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: INPUTS & CUSTOMIZATION (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* CONTENT CARD */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-7 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              <span>QR Content &amp; Details</span>
            </h2>

            {/* URL Input */}
            {activeType === 'url' && (
              <div className="space-y-2">
                <label htmlFor="qrUrlInput" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Target Website URL
                </label>
                <div className="relative">
                  <Globe className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="qrUrlInput"
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-600 dark:focus:border-[#00DFFF] focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#00DFFF]/20"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tip: Scanners will directly launch this web address in mobile browsers.
                </p>
              </div>
            )}

            {/* Plain Text Input */}
            {activeType === 'text' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="qrTextInput" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Plain Text Message
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {textInput.length} characters
                  </span>
                </div>
                <textarea
                  id="qrTextInput"
                  rows={4}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter any text, instructions, serial codes, or messages..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] p-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-600 dark:focus:border-[#00DFFF] focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#00DFFF]/20"
                />
              </div>
            )}

            {/* Wi-Fi Network Form */}
            {activeType === 'wifi' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="wifiSsidInput" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Network Name (SSID) *
                    </label>
                    <input
                      id="wifiSsidInput"
                      type="text"
                      value={wifiConfig.ssid}
                      onChange={(e) => setWifiConfig({ ...wifiConfig, ssid: e.target.value })}
                      placeholder="MyHome_WiFi"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="wifiAuthSelect" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Security Type
                    </label>
                    <select
                      id="wifiAuthSelect"
                      value={wifiConfig.encryption}
                      onChange={(e) =>
                        setWifiConfig({ ...wifiConfig, encryption: e.target.value as 'WPA' | 'WEP' | 'nopass' })
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3 (Default)</option>
                      <option value="WEP">WEP (Legacy)</option>
                      <option value="nopass">None (Open Network)</option>
                    </select>
                  </div>
                </div>

                {wifiConfig.encryption !== 'nopass' && (
                  <div className="space-y-1.5">
                    <label htmlFor="wifiPassInput" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Network Password
                    </label>
                    <div className="relative">
                      <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="wifiPassInput"
                        type={showWifiPassword ? 'text' : 'password'}
                        value={wifiConfig.password || ''}
                        onChange={(e) => setWifiConfig({ ...wifiConfig, password: e.target.value })}
                        placeholder="Enter Wi-Fi password"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowWifiPassword(!showWifiPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                        aria-label="Toggle password visibility"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={wifiConfig.hidden || false}
                    onChange={(e) => setWifiConfig({ ...wifiConfig, hidden: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Hidden Network (SSID is not broadcasted)</span>
                </label>
              </div>
            )}

            {/* Email Form */}
            {activeType === 'email' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="emailRecipientInput" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Recipient Email *
                  </label>
                  <input
                    id="emailRecipientInput"
                    type="email"
                    value={emailConfig.email}
                    onChange={(e) => setEmailConfig({ ...emailConfig, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="emailSubjectInput" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Pre-filled Subject
                  </label>
                  <input
                    id="emailSubjectInput"
                    type="text"
                    value={emailConfig.subject || ''}
                    onChange={(e) => setEmailConfig({ ...emailConfig, subject: e.target.value })}
                    placeholder="Project Inquiry"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="emailBodyInput" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Pre-filled Email Body
                  </label>
                  <textarea
                    id="emailBodyInput"
                    rows={3}
                    value={emailConfig.body || ''}
                    onChange={(e) => setEmailConfig({ ...emailConfig, body: e.target.value })}
                    placeholder="Write default email message..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] p-3 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Phone Number Form */}
            {activeType === 'phone' && (
              <div className="space-y-2">
                <label htmlFor="phoneNumberInput" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="phoneNumberInput"
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Include international country codes (e.g. +91 for India) for seamless direct calling.
                </p>
              </div>
            )}

            {/* Contact Card (vCard) Form */}
            {activeType === 'vcard' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label htmlFor="vCardFirstInput" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      First Name *
                    </label>
                    <input
                      id="vCardFirstInput"
                      type="text"
                      value={vCardConfig.firstName}
                      onChange={(e) => setVCardConfig({ ...vCardConfig, firstName: e.target.value })}
                      placeholder="First Name"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="vCardLastInput" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Last Name
                    </label>
                    <input
                      id="vCardLastInput"
                      type="text"
                      value={vCardConfig.lastName}
                      onChange={(e) => setVCardConfig({ ...vCardConfig, lastName: e.target.value })}
                      placeholder="Last Name"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label htmlFor="vCardPhoneInput" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Phone Number
                    </label>
                    <input
                      id="vCardPhoneInput"
                      type="tel"
                      value={vCardConfig.phone || ''}
                      onChange={(e) => setVCardConfig({ ...vCardConfig, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="vCardEmailInput" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <input
                      id="vCardEmailInput"
                      type="email"
                      value={vCardConfig.email || ''}
                      onChange={(e) => setVCardConfig({ ...vCardConfig, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label htmlFor="vCardCompanyInput" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Organization / Company
                    </label>
                    <input
                      id="vCardCompanyInput"
                      type="text"
                      value={vCardConfig.company || ''}
                      onChange={(e) => setVCardConfig({ ...vCardConfig, company: e.target.value })}
                      placeholder="Company Name"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="vCardTitleInput" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Job Title
                    </label>
                    <input
                      id="vCardTitleInput"
                      type="text"
                      value={vCardConfig.jobTitle || ''}
                      onChange={(e) => setVCardConfig({ ...vCardConfig, jobTitle: e.target.value })}
                      placeholder="Director, Manager, Lead"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="vCardAddressInput" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Office / City Address
                  </label>
                  <input
                    id="vCardAddressInput"
                    type="text"
                    value={vCardConfig.address || ''}
                    onChange={(e) => setVCardConfig({ ...vCardConfig, address: e.target.value })}
                    placeholder="Street, City, State, Country"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* CUSTOMIZATION & STYLING CARD */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-7 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="h-4 w-4 text-purple-500" />
              <span>QR Styling &amp; Colors</span>
            </h2>

            {/* Quick Palette Presets */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Color Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setDarkColor(preset.dark)
                      setLightColor(preset.light)
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      darkColor === preset.dark && lightColor === preset.light
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-slate-300 shadow-2xs"
                      style={{ backgroundColor: preset.dark }}
                    />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Color Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="darkColorPicker" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Foreground (QR Pattern)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="darkColorPicker"
                    type="color"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent p-1"
                  />
                  <input
                    type="text"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="lightColorPicker" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="lightColorPicker"
                    type="color"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent p-1"
                  />
                  <input
                    type="text"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 uppercase"
                  />
                </div>
              </div>
            </div>

            {/* QR Size and Error Correction */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <label htmlFor="qrSizeSlider">Export Size</label>
                  <span className="font-mono text-blue-600 dark:text-blue-400">{qrSize} × {qrSize} px</span>
                </div>
                <input
                  id="qrSizeSlider"
                  type="range"
                  min="200"
                  max="800"
                  step="20"
                  value={qrSize}
                  onChange={(e) => setQrSize(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="errorCorrectionSelect" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Error Correction Level
                </label>
                <select
                  id="errorCorrectionSelect"
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value as QrErrorCorrection)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050814] px-3 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="L">Low (7% damaged recovery)</option>
                  <option value="M">Medium (15% - Recommended)</option>
                  <option value="Q">Quartile (25% recovery)</option>
                  <option value="H">High (30% best for printed tags)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE PREVIEW & DOWNLOAD ACTIONS (5 COLS) */}
        <div className="lg:col-span-5 sticky top-20 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-6 sm:p-7 shadow-sm text-center space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Live High-Res Preview
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>100% Client-Side</span>
              </span>
            </div>

            {/* QR Canvas Display */}
            <div className="flex items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-[#050814] border border-slate-100 dark:border-slate-800 min-h-[300px]">
              {currentPayload ? (
                <div className="relative group">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto rounded-xl shadow-md border border-slate-200/60 dark:border-slate-700/60 transition-transform duration-200 group-hover:scale-[1.01]"
                    style={{ width: '260px', height: '260px' }}
                  />
                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/70 dark:bg-[#0B1020]/70 backdrop-blur-2xs flex items-center justify-center rounded-xl">
                      <span className="text-xs font-semibold text-blue-600 animate-pulse">Rendering...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 px-4 space-y-2">
                  <AlertCircle className="h-8 w-8 text-amber-500 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Missing Input Information
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Please provide a URL, text, or Wi-Fi credentials to generate your live QR code.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  disabled={!currentPayload}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-3 text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PNG</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  disabled={!currentPayload}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-white dark:bg-[#11182D] disabled:opacity-50 text-slate-800 dark:text-slate-200 px-4 py-3 text-xs sm:text-sm font-bold shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Download className="h-4 w-4 text-purple-500" />
                  <span>Download SVG</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyImage}
                disabled={!currentPayload}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#16203B] disabled:opacity-50 text-slate-700 dark:text-slate-300 px-4 py-2.5 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                {copiedStatus === 'copied' ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Image Copied to Clipboard!</span>
                  </>
                ) : copiedStatus === 'error' ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span>Direct clipboard copy unsupported — please use Download PNG</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-slate-400" />
                    <span>Copy QR Image to Clipboard</span>
                  </>
                )}
              </button>
            </div>

            {/* Privacy Guarantee Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-left space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Data Transmission Guarantee</span>
              </div>
              <p className="leading-relaxed">
                All QR calculations, pixels, and vectors are computed directly in your web browser. Sensitive Wi-Fi passwords, contact cards, and text are never transmitted over the internet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
