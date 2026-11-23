import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { QrCodeGenerator } from '../../tools/QrCodeGenerator/QrCodeGenerator'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const QrCodeGeneratorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'qr-code-generator')!

  const howToUseSteps = [
    'Select your content format from the top tabs: Website URL, Plain Text, Wi-Fi Network credentials, Email message, Phone Call, or vCard Contact Card.',
    'Enter your data into the corresponding input fields. Input is validated automatically in real time.',
    'Customize the QR code styling by selecting custom Foreground (dark) and Background (light) colors or picking from preset contrast-checked color themes.',
    'Adjust the export resolution slider (200px to 800px) and choose an Error Correction level (Low 7%, Medium 15%, Quartile 25%, or High 30%).',
    'Verify the real-time visual preview on the right-hand panel before downloading.',
    'Click "Download PNG" for high-resolution raster images, "Download SVG" for infinite-scale vector printing, or "Copy Image" to copy directly to your clipboard.',
  ]

  const formulas = [
    {
      title: 'Reed-Solomon Error Correction Math',
      formula: 'Damage Resistance: L (7%) • M (15%) • Q (25%) • H (30%)',
      explanation: 'Uses polynomial Galois Field GF(2^8) arithmetic to generate redundant parity blocks. This enables mobile camera scanners to completely reconstruct smudged, dirty, or partially occluded QR codes without loss of data.',
    },
    {
      title: 'Universal Wi-Fi Protocol URI Encoding',
      formula: 'WIFI:S:<SSID>;T:<WPA|WEP|nopass>;P:<Password>;H:<true|false>;;',
      explanation: 'Standardized wireless connection format recognized natively by iOS Camera, Android Wi-Fi QR scanners, and Google Lens for instant 1-tap network access without typing complex passwords.',
    },
    {
      title: 'Electronic Business Card Standard (vCard 3.0)',
      formula: 'BEGIN:VCARD • VERSION:3.0 • FN:<Full Name> • TEL:<Phone> • EMAIL:<Email> • END:VCARD',
      explanation: 'Standard RFC 2426 electronic contact format. Scanning immediately prompts mobile address books (Apple Contacts, Google Contacts, and Outlook) to import name, phone, title, company, and email.',
    },
    {
      title: 'Scanning Contrast & Quiet Zone Standard',
      formula: 'Quiet Zone ≥ 4 Modules • Contrast Ratio ≥ 4:1 (Luminance Δ > 50%)',
      explanation: 'ISO/IEC 18004 mandates a blank border of at least 4 module widths around the QR matrix (the quiet zone) and high luminance contrast between dark and light modules to ensure fast optical sensor capture under uneven ambient light.',
    },
  ]

  const examples = [
    {
      title: 'Hospitality & Restaurant Contactless Menu',
      description: 'Printing a laminated acrylic table standee directing diners to a mobile ordering menu.',
      input: 'Type: Website URL • Target: https://example.com/menu • Theme: Ocean Blue • Size: 500px • ECC: M (15%)',
      output: 'Crisp 500x500 PNG ready for tabletop displays, table stickers, and printed laminate menus.',
    },
    {
      title: 'Home & Office Guest Wi-Fi Access Pass',
      description: 'Enabling guests to connect to WPA2/WPA3 Wi-Fi instantly without sharing written network passwords.',
      input: 'Type: Wi-Fi • SSID: QUBNEXA_Guest • Pass: Secure@Net2026 • Encryption: WPA • ECC: Q (25%)',
      output: 'Universal WIFI URI QR code scanned by iPhone and Android camera apps for instant 1-tap connection.',
    },
    {
      title: 'Professional Business Card & Event Badge',
      description: 'Printing a vCard on networking cards or conference badges to exchange phone, email, and company details in seconds.',
      input: 'Type: vCard • Name: Rohan Sharma • Company: QUBNEXA • Phone: +91 98765 43210 • Email: qubnexa.official@gmail.com',
      output: 'Infinitely scalable SVG vector graphic ready for commercial CMYK offset printing.',
    },
    {
      title: 'Direct Customer Support Email QR',
      description: 'Placing a sticker on product packaging that drafts a pre-filled support ticket in the customer email client.',
      input: 'Type: Email • To: qubnexa.official@gmail.com • Subject: Product Inquiry • Body: Hello Support Team',
      output: 'Standard mailto URI that opens default mobile and desktop email applications automatically.',
    },
  ]

  const faqs = [
    {
      question: 'Do QR codes generated on QUBNEXA ever expire?',
      answer: 'No. All QR codes generated here are static QR codes. The target website URL, text, Wi-Fi password, or vCard details are encoded directly into the black and white pixel matrix. Because there is no intermediate redirect server or database lookup, the QR codes work permanently with zero expiration, zero server dependency, and unlimited lifetime scans.',
    },
    {
      question: 'Are my Wi-Fi credentials or personal contact details stored on your servers?',
      answer: 'No. QUBNEXA operates 100% client-side inside your web browser. All matrix rendering, color styling, and image generation execute using your device local CPU and canvas engine. Your Wi-Fi network passwords, email addresses, and contact numbers never touch our servers or leave your device.',
    },
    {
      question: 'What is the difference between static and dynamic QR codes?',
      answer: 'Static QR codes encode data directly into the pixel pattern. They are permanent, private, free forever, and require no account. Dynamic QR codes encode a short redirect URL pointing to a subscription server where the destination can be edited later. QUBNEXA generates static QR codes, guaranteeing zero subscription fees, zero tracking, and zero risk of broken links if a service shuts down.',
    },
    {
      question: 'What is the minimum recommended print size for a QR code?',
      answer: 'For short URLs (under 30 characters), the minimum reliable scanning size is 2 x 2 cm (0.8 x 0.8 inches) from a scanning distance of 20 cm. For denser payloads like vCards or Wi-Fi configurations, we recommend a minimum print size of 3 x 3 cm (1.2 x 1.2 inches). A useful rule of thumb is a 10:1 ratio: print width should be at least 1/10th of the intended scanning distance.',
    },
    {
      question: 'Which format should I download: PNG or SVG?',
      answer: 'Download PNG for digital screens, websites, email signatures, presentation slides, and standard desktop printing. Download SVG (Scalable Vector Graphics) for commercial graphic design, brochures, laser engraving, packaging, billboard banners, and merchandise, because SVG vector files scale infinitely to any resolution without pixelation or blurriness.',
    },
    {
      question: 'How does Error Correction Level affect scanning?',
      answer: 'QR codes use Reed-Solomon error correction to recover data if part of the code is damaged, dirty, or obstructed. Level L recovers up to 7% damage, Level M recovers 15%, Level Q recovers 25%, and Level H recovers 30%. Level M is recommended for general digital use, while Level H is ideal for outdoor stickers, warehouse labels, or codes featuring custom logos placed in the center.',
    },
    {
      question: 'Can I use custom brand colors, and will it still scan reliably?',
      answer: 'Yes! You can customize both foreground and background colors. However, optical scanners require strong luminance contrast to decode modules. Always ensure the foreground (dots) is significantly darker than the background, and avoid inverted color schemes (such as white dots on a dark background) because many older smartphone camera apps struggle to detect inverted finder patterns.',
    },
    {
      question: 'Why is my QR code not scanning?',
      answer: 'Common scanning issues include: (1) low contrast between foreground and background colors; (2) printing too small for the amount of data encoded; (3) insufficient margin/quiet zone around the code; or (4) glare and reflections on glossy laminated surfaces. Increasing the error correction level to Q or H and ensuring high-contrast colors will resolve most scanning failures.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Free QR Code Generator Online — URL, Wi-Fi, Text & vCard | QUBNEXA"
      seoDescription="Generate custom QR codes for free: website links, Wi-Fi passwords, contact vCards, and text. Download high-res PNG & SVG vectors. 100% client-side & private."
      keywords="free qr code generator, qr code generator online, wifi qr code generator, vcard qr code, svg vector qr code, custom qr code with colors, high resolution qr code, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['password-generator', 'image-resizer', 'pdf-editor', 'image-quality-increaser']}
    >
      <QrCodeGenerator />
    </ToolPageLayout>
  )
}
