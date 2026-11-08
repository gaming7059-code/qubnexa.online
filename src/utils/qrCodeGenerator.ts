import QRCode from 'qrcode'

export type QrType = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'vcard'

export type QrErrorCorrection = 'L' | 'M' | 'Q' | 'H'

export interface QrRenderOptions {
  width: number
  margin: number
  color: {
    dark: string
    light: string
  }
  errorCorrectionLevel: QrErrorCorrection
}

export interface WifiConfig {
  ssid: string
  password?: string
  encryption: 'WPA' | 'WEP' | 'nopass'
  hidden?: boolean
}

export interface EmailConfig {
  email: string
  subject?: string
  body?: string
}

export interface VCardConfig {
  firstName: string
  lastName: string
  phone?: string
  email?: string
  company?: string
  jobTitle?: string
  website?: string
  address?: string
}

/**
 * Escapes special characters for Wi-Fi QR strings
 */
function escapeWifiString(str: string): string {
  return str.replace(/([\\;,":])/g, '\\$1')
}

/**
 * Formats a valid URL payload
 */
export function formatUrlPayload(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`
  }
  return trimmed
}

/**
 * Formats a standard Wi-Fi configuration string
 */
export function formatWifiPayload(config: WifiConfig): string {
  const { ssid, password, encryption, hidden } = config
  if (!ssid.trim()) return ''
  const enc = encryption === 'nopass' ? 'nopass' : encryption
  const pass = password ? escapeWifiString(password) : ''
  const h = hidden ? 'true' : 'false'
  return `WIFI:S:${escapeWifiString(ssid.trim())};T:${enc};P:${pass};H:${h};;`
}

/**
 * Formats a mailto URI
 */
export function formatEmailPayload(config: EmailConfig): string {
  const { email, subject, body } = config
  if (!email.trim()) return ''
  const params: string[] = []
  if (subject?.trim()) params.push(`subject=${encodeURIComponent(subject.trim())}`)
  if (body?.trim()) params.push(`body=${encodeURIComponent(body.trim())}`)
  const query = params.length > 0 ? `?${params.join('&')}` : ''
  return `mailto:${email.trim()}${query}`
}

/**
 * Formats a telephone link
 */
export function formatPhonePayload(phone: string): string {
  const cleaned = phone.replace(/[^\d+*#]/g, '')
  if (!cleaned) return ''
  return `tel:${cleaned}`
}

/**
 * Formats a standard vCard 3.0 contact string
 */
export function formatVCardPayload(card: VCardConfig): string {
  const fn = `${card.firstName.trim()} ${card.lastName.trim()}`.trim()
  if (!fn) return ''

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${card.lastName.trim()};${card.firstName.trim()};;;`,
    `FN:${fn}`,
  ]

  if (card.company?.trim()) lines.push(`ORG:${card.company.trim()}`)
  if (card.jobTitle?.trim()) lines.push(`TITLE:${card.jobTitle.trim()}`)
  if (card.phone?.trim()) lines.push(`TEL;TYPE=CELL:${card.phone.trim()}`)
  if (card.email?.trim()) lines.push(`EMAIL;TYPE=INTERNET:${card.email.trim()}`)
  if (card.website?.trim()) lines.push(`URL:${formatUrlPayload(card.website.trim())}`)
  if (card.address?.trim()) lines.push(`ADR;TYPE=WORK:;;${card.address.trim().replace(/\n/g, ', ')};;;;`)

  lines.push('END:VCARD')
  return lines.join('\n')
}

/**
 * Renders a QR code onto an HTML canvas element
 */
export async function renderQrToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  options: QrRenderOptions
): Promise<void> {
  if (!text) {
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    return
  }

  await QRCode.toCanvas(canvas, text, {
    width: options.width,
    margin: options.margin,
    color: {
      dark: options.color.dark,
      light: options.color.light,
    },
    errorCorrectionLevel: options.errorCorrectionLevel,
  })
}

/**
 * Generates an SVG string representation of the QR code
 */
export async function generateQrSvgString(
  text: string,
  options: QrRenderOptions
): Promise<string> {
  return await QRCode.toString(text, {
    type: 'svg',
    width: options.width,
    margin: options.margin,
    color: {
      dark: options.color.dark,
      light: options.color.light,
    },
    errorCorrectionLevel: options.errorCorrectionLevel,
  })
}

/**
 * Copies canvas image to the system clipboard
 */
export async function copyCanvasImageToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  return new Promise((resolve) => {
    if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
      resolve(false)
      return
    }

    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve(false)
        return
      }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        resolve(true)
      } catch {
        resolve(false)
      }
    }, 'image/png')
  })
}
