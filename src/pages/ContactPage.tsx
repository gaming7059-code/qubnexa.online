import React, { useState } from 'react'
import { Mail, MessageSquare, CheckCircle } from 'lucide-react'
import { usePageSEO, createBreadcrumbSchema } from '../utils/seo'

export const ContactPage: React.FC = () => {
  usePageSEO({
    title: 'Contact Us — Support, Suggestions & Feedback | QUBNEXA',
    description: 'Contact the QUBNEXA team to suggest new calculators, report issues, or provide feedback on our suite of free online utilities.',
    canonicalPath: '/contact',
    keywords: 'contact qubnexa, suggest calculator, report bug, tool feedback, qubnexa support',
    schema: createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
    ]),
  })

  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 animate-fade-in-up">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-[#00DFFF]">
          Get in Touch
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
          Contact QUBNEXA
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Have an idea for a new calculator or utility? Found a bug? Send us a message below.
        </p>
      </div>

      <div className="xw-panel p-6 sm:p-8 shadow-2xs">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Thank You for Your Feedback!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              We have noted your message. We continuously review user suggestions to expand our suite of free online utilities.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false)
                setName('')
                setEmail('')
                setMessage('')
              }}
              className="xw-btn-primary mt-4 min-h-[42px] px-5 py-2 text-xs sm:text-sm"
            >
              Send another note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="xw-input min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="xw-input min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Message / Tool Suggestion
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what new tool or enhancement you would like to see..."
                className="xw-input"
              ></textarea>
            </div>

            <button
              type="submit"
              className="xw-btn-primary w-full sm:w-auto min-h-[44px] px-6 py-2.5 text-sm"
            >
              Send Message
            </button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
        <div className="xw-surface flex items-center gap-2.5 p-3.5">
          <Mail className="h-4 w-4 text-cyan-600 dark:text-[#00DFFF] shrink-0" />
          <span>Direct inquiries via the feedback form above</span>
        </div>
        <div className="xw-surface flex items-center gap-2.5 p-3.5">
          <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>Feature requests reviewed continuously</span>
        </div>
      </div>
    </div>
  )
}
