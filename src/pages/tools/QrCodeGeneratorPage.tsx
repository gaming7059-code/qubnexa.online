import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { QrCodeGenerator } from '../../tools/QrCodeGenerator/QrCodeGenerator'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const QrCodeGeneratorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'qr-code-generator') || {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    slug: 'qr-code-generator',
    path: '/tools/qr-code-generator',
    description: 'Create custom, high-resolution QR codes for websites, Wi-Fi networks, text, email, phone numbers, and vCard contacts with instant PNG/SVG downloads.',
    categoryId: 'daily-utilities',
    categoryIds: ['daily-utilities', 'text-developer'],
    categoryName: 'Daily Utilities',
    icon: 'QrCode',
    isPopular: true,
    isNew: true,
    isFunctional: true,
    keywords: ['qr code generator', 'free qr code', 'wifi qr code', 'vcard qr code', 'custom qr code', 'svg qr code', 'qr code maker online'],
  }

  const howToUseSteps = [
    'Choose your QR content type from the selector tabs: Website URL, Plain Text, Wi-Fi Network, Email, Phone Call, or vCard Contact Card.',
    'Enter your data into the corresponding input fields. Input is validated automatically in real time.',
    'Customize your QR code appearance using custom Foreground and Background color pickers or one-click preset themes.',
    'Adjust the export resolution slider (from 200px up to 800px) and select an Error Correction level (Low, Medium, Quartile, or High).',
    'Verify the high-resolution live preview on the right-hand panel.',
    'Click "Download PNG" for high-resolution raster images, "Download SVG" for infinite-scale vector designs, or "Copy QR Image" to copy directly to your clipboard.',
  ]

  const formulas = [
    {
      title: 'Reed-Solomon Error Correction',
      formula: 'Damage Resistance: L (7%) • M (15%) • Q (25%) • H (30%)',
      explanation: 'QR codes use Reed-Solomon polynomial math to restore corrupted, smudged, or partially occluded barcode areas without losing encoded data.',
    },
    {
      title: 'Standard Wi-Fi Payload Encoding',
      formula: 'WIFI:S:<SSID>;T:<WPA|WEP|nopass>;P:<Password>;H:<true|false>;;',
      explanation: 'Universal wireless format supported natively by iOS Camera, Android Wi-Fi QR scanners, and Google Lens for instant connection without typing passwords.',
    },
    {
      title: 'Electronic Business Card Standard',
      formula: 'BEGIN:VCARD ... FN:<Full Name> ... TEL:<Phone> ... EMAIL:<Email> ... END:VCARD',
      explanation: 'Standard vCard 3.0 specification recognized by Apple Contacts, Google Contacts, and Outlook address books.',
    },
  ]

  const examples = [
    {
      title: 'Restaurant Menu & Table Ordering',
      description: 'Creating a high-contrast laminated table sticker linking diners to a digital mobile menu.',
      input: 'URL: https://mycafe.in/menu • Theme: Ocean Blue • Size: 400px',
      output: 'High-res printable PNG with 15% error correction',
    },
    {
      title: 'Home / Office Wi-Fi Guest Pass',
      description: 'Enabling guests to scan and join high-speed WPA3 Wi-Fi instantly without sharing written passwords.',
      input: 'SSID: Starlink_Guest • Pass: SecurePass2026! • WPA',
      output: 'Standard universal WIFI URI QR code with instant mobile prompt',
    },
    {
      title: 'Conference Badge Contact Card',
      description: 'Printing a vCard on networking name badges to exchange phone, email, and LinkedIn profiles in seconds.',
      input: 'Name: Rajesh Patel • Title: Product Lead • Phone: +91 9876543210',
      output: 'vCard 3.0 vector SVG ready for badge printing',
    },
  ]

  const faqs = [
    {
      question: 'Do QR codes generated on SmartTools India ever expire?',
      answer: 'No. All QR codes generated here are static QR codes. The target website URL, text, Wi-Fi password, or vCard details are encoded directly into the black and white pixel patterns. They function permanently with zero expiration, zero server lookups, and zero scan limits.',
    },
    {
      question: 'Is it safe to generate Wi-Fi passwords and personal contact cards here?',
      answer: 'Yes, 100% safe. SmartTools India generates all QR codes completely client-side in your web browser. Your Wi-Fi network credentials, phone numbers, and contact names are never transmitted over the internet or logged on any external server.',
    },
    {
      question: 'Which format should I download: PNG or SVG?',
      answer: 'Download PNG for digital displays, email signatures, websites, social media, and desktop printing. Download SVG for commercial graphic design, billboard banners, merchandise, and professional vector printing because SVG can scale infinitely without pixelation.',
    },
    {
      question: 'What is Error Correction Level and which one should I pick?',
      answer: 'Error correction allows the QR code to be scanned even if part of it is dirty, damaged, or obscured. Medium (15%) is recommended for everyday use. High (30%) is best for outdoor printed stickers, business cards, or warehouse inventory tags.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Free QR Code Generator Online — URL, Wi-Fi, Text & vCard | SmartTools India"
      seoDescription="Generate custom QR codes online for free: website links, Wi-Fi passwords, contact vCards, phone numbers and plain text. Download high-res PNG & SVG vectors. 100% client-side & private."
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['image-quality-increaser', 'pdf-editor', 'word-counter', 'text-to-speech']}
    >
      <QrCodeGenerator />
    </ToolPageLayout>
  )
}
