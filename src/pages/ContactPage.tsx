import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  Check,
  Copy,
  Info,
  Loader2,
  Mail,
  MessageSquare,
  Send,
} from 'lucide-react'
import { LegalDocumentLayout } from '../components/common/LegalDocumentLayout'
import { usePageSEO, createBreadcrumbSchema } from '../utils/seo'

interface ContactFormValues {
  name: string
  email: string
  subject: string
  message: string
  website?: string
}

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const OFFICIAL_EMAIL = 'qubnexa.official@gmail.com'

function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const subject = values.subject.trim()
  const message = values.message.trim()

  if (!name) {
    errors.name = 'Please enter your name.'
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters long.'
  }

  if (!email) {
    errors.email = 'Please enter your email address.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address (for example, name@example.com).'
  }

  if (!subject) {
    errors.subject = 'Please enter a subject for your inquiry.'
  } else if (subject.length < 3) {
    errors.subject = 'Subject must be at least 3 characters long.'
  }

  if (!message) {
    errors.message = 'Please enter your message or bug report details.'
  } else if (message.length < 10) {
    errors.message = 'Message must be at least 10 characters long so we have enough context.'
  }

  return errors
}

export const ContactPage: React.FC = () => {
  usePageSEO({
    title: 'Contact Us — Official Business Inquiries | QUBNEXA',
    description:
      'Contact QUBNEXA for tool requests, feedback, bug reports, and publisher inquiries. Direct email: qubnexa.official@gmail.com.',
    canonicalPath: '/contact',
    keywords: 'contact qubnexa, qubnexa official email, feedback, bug report, support, business inquiries',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact QUBNEXA',
        description:
          'QUBNEXA Contact Us page. Reach our team directly at qubnexa.official@gmail.com for support, bug reports, and business inquiries.',
      },
      createBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Contact Us', path: '/contact' },
      ]),
    ],
  })

  const [values, setValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '',
  })
  const [formLoadedAt] = useState<number>(() => Date.now())
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deliveryStatus, setDeliveryStatus] = useState<'idle' | 'success' | 'fallback'>('idle')
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [localResult, setLocalResult] = useState<ContactFormValues | null>(null)
  const [copiedSummary, setCopiedSummary] = useState(false)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const subjectRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const updateField = (field: keyof ContactFormValues, nextValue: string) => {
    setValues((prev) => ({ ...prev, [field]: nextValue }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateContactForm(values)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      if (validationErrors.name) nameRef.current?.focus()
      else if (validationErrors.email) emailRef.current?.focus()
      else if (validationErrors.subject) subjectRef.current?.focus()
      else if (validationErrors.message) messageRef.current?.focus()
      return
    }

    setErrors({})
    setIsSubmitting(true)
    setStatusMessage('')

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
      website: values.website?.trim() || '',
      timestamp: formLoadedAt,
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok && data.success) {
        setDeliveryStatus('success')
        setStatusMessage(
          data.message || `Your message has been sent successfully to ${OFFICIAL_EMAIL}.`
        )
      } else {
        // Honest fallback: backend not configured or returned error
        setDeliveryStatus('fallback')
        setStatusMessage(
          data.message ||
            `Direct server delivery is awaiting configuration. Please send your message directly to ${OFFICIAL_EMAIL} or copy the formatted draft below.`
        )
        setLocalResult(payload)
      }
    } catch {
      // Network or environment fallback
      setDeliveryStatus('fallback')
      setStatusMessage(
        `Unable to reach backend contact endpoint. Please send your inquiry directly via email to ${OFFICIAL_EMAIL}.`
      )
      setLocalResult(payload)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyFormatted = async () => {
    if (!localResult) return
    const formatted = [
      `To: ${OFFICIAL_EMAIL}`,
      `From: ${localResult.name} <${localResult.email}>`,
      `Subject: ${localResult.subject}`,
      '',
      localResult.message,
    ].join('\n')
    try {
      await navigator.clipboard.writeText(formatted)
      setCopiedSummary(true)
      setTimeout(() => setCopiedSummary(false), 2000)
    } catch {
      setCopiedSummary(false)
    }
  }

  const errorCount = Object.keys(errors).length

  return (
    <LegalDocumentLayout
      eyebrow="Support & Inquiries"
      title="Contact Us"
      subtitle="Send inquiries, bug reports, feature suggestions, or publisher questions to QUBNEXA."
      lastUpdated="November 23, 2026"
      breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Contact Us' }]}
    >
      <div className="space-y-6">
        {/* Direct Email Support & Inquiry Notice */}
        <div
          role="note"
          className="rounded-2xl border border-cyan-200 dark:border-cyan-800/70 bg-cyan-50/70 dark:bg-cyan-950/35 p-4 sm:p-5 flex items-start gap-3 text-xs sm:text-sm text-cyan-950 dark:text-cyan-200"
        >
          <Mail className="h-5 w-5 shrink-0 mt-0.5 text-cyan-600 dark:text-[#00DFFF]" />
          <div className="space-y-1">
            <p className="font-bold">Official Business &amp; Support Inquiries</p>
            <p className="leading-relaxed">
              For general inquiries, bug reports, tool suggestions, or publisher questions, reach our team directly at{' '}
              <a
                href={`mailto:${OFFICIAL_EMAIL}`}
                className="font-semibold underline text-cyan-800 dark:text-cyan-300 hover:text-cyan-900"
              >
                {OFFICIAL_EMAIL}
              </a>
              . You can also submit your inquiry through the contact form below.
            </p>
          </div>
        </div>

        {/* Form Card, Confirmed Success, or Honest Validated Fallback */}
        <div className="xw-panel p-6 sm:p-8 shadow-2xs">
          {deliveryStatus === 'success' ? (
            <div className="space-y-5" role="status" aria-live="polite">
              <div className="flex items-start gap-3 rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/30 p-4">
                <Check className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <div className="space-y-1 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  <p className="font-bold text-emerald-900 dark:text-emerald-200">Message Delivered Successfully</p>
                  <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                    {statusMessage ||
                      `Your message has been sent to our official business inbox at ${OFFICIAL_EMAIL}. We will review your message and reply as soon as possible.`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDeliveryStatus('idle')
                  setLocalResult(null)
                  setValues({ name: '', email: '', subject: '', message: '', website: '' })
                }}
                className="xw-btn-primary text-xs sm:text-sm"
              >
                Send Another Message
              </button>
            </div>
          ) : deliveryStatus === 'fallback' && localResult ? (
            <div className="space-y-5" role="status" aria-live="polite">
              <div className="flex items-start gap-3 rounded-xl border border-cyan-200 dark:border-cyan-500/30 bg-cyan-50/70 dark:bg-cyan-950/30 p-4">
                <Info className="h-5 w-5 shrink-0 mt-0.5 text-cyan-700 dark:text-[#00DFFF]" />
                <div className="space-y-1 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  <p className="font-bold">Inquiry Formatted &amp; Ready to Send</p>
                  <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                    {statusMessage}
                  </p>
                </div>
              </div>

              <div className="xw-surface-muted p-4 space-y-2 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400">To:</span>{' '}
                  <span className="text-slate-900 dark:text-white font-medium">{OFFICIAL_EMAIL}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Name:</span>{' '}
                  <span className="text-slate-900 dark:text-white">{localResult.name}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Email:</span>{' '}
                  <span className="text-slate-900 dark:text-white">{localResult.email}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Subject:</span>{' '}
                  <span className="text-slate-900 dark:text-white">{localResult.subject}</span>
                </div>
                <div className="pt-1 border-t border-slate-200/80 dark:border-slate-700/80 whitespace-pre-wrap text-slate-700 dark:text-slate-200">
                  {localResult.message}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${OFFICIAL_EMAIL}?subject=${encodeURIComponent(localResult.subject)}&body=${encodeURIComponent(
                    `From: ${localResult.name} <${localResult.email}>\n\n${localResult.message}`
                  )}`}
                  className="xw-btn-primary text-xs sm:text-sm inline-flex items-center gap-1.5"
                >
                  <Mail className="h-4 w-4" />
                  <span>Send via Email Client</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyFormatted}
                  className="xw-btn-secondary text-xs sm:text-sm"
                >
                  {copiedSummary ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedSummary ? 'Copied Draft!' : 'Copy Formatted Inquiry'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeliveryStatus('idle')
                  }}
                  className="xw-btn-secondary text-xs sm:text-sm"
                >
                  Edit Message
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeliveryStatus('idle')
                    setLocalResult(null)
                    setValues({ name: '', email: '', subject: '', message: '', website: '' })
                  }}
                  className="xw-btn-secondary text-xs sm:text-sm"
                >
                  Clear &amp; Start Over
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {errorCount > 0 && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-200 dark:border-rose-800/70 bg-rose-50 dark:bg-rose-950/40 p-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-rose-800 dark:text-rose-200"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                  <span>
                    Please fix the {errorCount} highlighted {errorCount === 1 ? 'field' : 'fields'} below before continuing.
                  </span>
                </div>
              )}

              {/* Anti-Spam Honeypot field (hidden from genuine users) */}
              <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <label htmlFor="contact-website">Website (leave blank)</label>
                <input
                  id="contact-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website || ''}
                  onChange={(e) => updateField('website', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    Your Name <span className="text-rose-600 dark:text-rose-400">*</span>
                  </label>
                  <input
                    ref={nameRef}
                    id="contact-name"
                    type="text"
                    required
                    value={values.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    placeholder="e.g. Ananya Sen"
                    className={`xw-input min-h-[44px] ${
                      errors.name ? 'border-rose-500 dark:border-rose-500' : ''
                    }`}
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                  >
                    Email Address <span className="text-rose-600 dark:text-rose-400">*</span>
                  </label>
                  <input
                    ref={emailRef}
                    id="contact-email"
                    type="email"
                    required
                    value={values.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    placeholder="name@example.com"
                    className={`xw-input min-h-[44px] ${
                      errors.email ? 'border-rose-500 dark:border-rose-500' : ''
                    }`}
                  />
                  {errors.email && (
                    <p id="contact-email-error" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Subject <span className="text-rose-600 dark:text-rose-400">*</span>
                </label>
                <input
                  ref={subjectRef}
                  id="contact-subject"
                  type="text"
                  required
                  value={values.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                  placeholder="e.g. Tool Suggestion, Bug Report, or Business Inquiry"
                  className={`xw-input min-h-[44px] ${
                    errors.subject ? 'border-rose-500 dark:border-rose-500' : ''
                  }`}
                />
                {errors.subject && (
                  <p id="contact-subject-error" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                    {errors.subject}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Message <span className="text-rose-600 dark:text-rose-400">*</span>
                </label>
                <textarea
                  ref={messageRef}
                  id="contact-message"
                  required
                  rows={5}
                  value={values.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  placeholder="Describe your question, issue, or partnership proposal in detail..."
                  className={`xw-input ${errors.message ? 'border-rose-500 dark:border-rose-500' : ''}`}
                />
                {errors.message && (
                  <p id="contact-message-error" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Protected with anti-spam &amp; SSL encryption
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="xw-btn-primary w-full sm:w-auto min-h-[44px] px-6 py-2.5 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Bottom Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="xw-surface flex items-start gap-2.5 p-4">
            <MessageSquare className="h-4 w-4 text-blue-600 dark:text-[#00DFFF] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Privacy Protected</p>
              <p className="mt-0.5 leading-relaxed">
                Contact submissions are kept confidential and used solely to reply to you. Learn more in our{' '}
                <Link to="/privacy" className="text-blue-600 dark:text-[#00DFFF] underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="xw-surface flex items-start gap-2.5 p-4">
            <Info className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Usage &amp; Service Terms</p>
              <p className="mt-0.5 leading-relaxed">
                Review platform usage terms and publisher policies in our{' '}
                <Link to="/terms" className="text-blue-600 dark:text-[#00DFFF] underline">
                  Terms &amp; Conditions
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </LegalDocumentLayout>
  )
}
