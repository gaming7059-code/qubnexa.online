import React from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { LegalDocumentLayout, type LegalSectionTocItem } from '../components/common/LegalDocumentLayout'
import { usePageSEO, createBreadcrumbSchema } from '../utils/seo'

const TERMS_TOC: LegalSectionTocItem[] = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'description', title: '2. Description of Services' },
  { id: 'permitted-use', title: '3. Permitted Use' },
  { id: 'prohibited-activities', title: '4. Prohibited Activities' },
  { id: 'user-content', title: '5. User Content & Uploaded Files' },
  { id: 'intellectual-property', title: '6. Intellectual Property' },
  { id: 'third-party-services', title: '7. Third-Party Services' },
  { id: 'ai-disclaimer', title: '8. AI Content Disclaimer' },
  { id: 'accuracy-reliability', title: '9. Accuracy & Reliability' },
  { id: 'service-availability', title: '10. Service Availability' },
  { id: 'limitation-liability', title: '11. Limitation of Liability' },
  { id: 'indemnification', title: '12. Indemnification' },
  { id: 'changes-to-terms', title: '13. Changes to Terms' },
  { id: 'governing-law', title: '14. Governing Law' },
  { id: 'contact-info', title: '15. Contact Information' },
]

export const TermsPage: React.FC = () => {
  usePageSEO({
    title: 'Terms & Conditions — Usage Guidelines & Disclaimers | QUBNEXA',
    description:
      'Read the QUBNEXA Terms & Conditions covering permitted use, uploaded files, AI and calculator disclaimers, third-party services, and service limitations.',
    canonicalPath: '/terms',
    keywords:
      'qubnexa terms and conditions, terms of service, online tools disclaimer, permitted use guidelines',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'QUBNEXA Terms & Conditions',
        description:
          'Terms & Conditions governing use of QUBNEXA calculators, text, PDF, audio, video, AI prompt tools, and browser games.',
      },
      createBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Terms & Conditions', path: '/terms' },
      ]),
    ],
  })

  return (
    <LegalDocumentLayout
      eyebrow="Legal Agreement"
      title="Terms & Conditions"
      subtitle="General terms, permitted usage guidelines, and informational disclaimers governing your access to QUBNEXA."
      lastUpdated="November 23, 2026"
      breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Terms & Conditions' }]}
      tocItems={TERMS_TOC}
    >
      <div className="space-y-6">
        {/* General Disclaimer Highlight */}
        <div
          role="note"
          className="rounded-2xl border border-blue-200 dark:border-cyan-500/30 bg-blue-50/70 dark:bg-[#0E1833]/80 p-4 sm:p-5 flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-blue-600 dark:text-[#00DFFF]" />
          <div className="space-y-1">
            <p className="font-bold text-slate-900 dark:text-white">General Informational Disclaimer</p>
            <p className="leading-relaxed">
              QUBNEXA provides general-purpose calculation, conversion, media, writing, and
              entertainment utilities strictly for informational and convenience purposes. Nothing on
              this platform constitutes legal, tax, financial, accounting, medical, or certified
              professional advice.
            </p>
          </div>
        </div>

        <div className="xw-panel p-6 sm:p-10 shadow-2xs space-y-8 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          <section id="acceptance" className="scroll-mt-24 space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or using any tool or page on QUBNEXA (&ldquo;the
              Platform&rdquo;), you acknowledge that you have read and agree to comply with these
              Terms &amp; Conditions. If you do not agree with these terms, please stop using the
              Platform immediately.
            </p>
          </section>

          <section id="description" className="scroll-mt-24 space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. Description of Services
            </h2>
            <p>
              QUBNEXA offers free, browser-accessible online utilities across categories including
              calculators, unit and date converters, PDF and image workflows, audio studio and speech
              tools, text tools, video link inspection utilities, AI video prompt builders, and HTML5
              mini-games. Access requires no paid subscription or account registration.
            </p>
          </section>

          <section id="permitted-use" className="scroll-mt-24 space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. Permitted Use
            </h2>
            <p>
              You may use QUBNEXA for lawful personal, educational, creative, and ordinary business
              productivity tasks—provided your use respects all intellectual property rights, local
              laws, and third-party terms applicable to any files, links, or keys you supply.
            </p>
          </section>

          <section id="prohibited-activities" className="scroll-mt-24 space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              4. Prohibited Activities
            </h2>
            <p>When using QUBNEXA, you agree not to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>
                Use tools (such as Video Downloader or Text Repeater) to infringe copyrights, bypass
                technological access controls, spam, harass recipients, or violate third-party
                platform terms.
              </li>
              <li>
                Attempt to disrupt hosting infrastructure, scrape pages destructively, probe
                restricted networks, or inject malicious payloads.
              </li>
              <li>
                Misrepresent outputs from calculators, converters, or AI prompt helpers as audited
                financial statements, certified legal filings, or official records.
              </li>
            </ul>
          </section>

          <section id="user-content" className="scroll-mt-24 space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              5. User Content and Uploaded Files
            </h2>
            <p>
              You retain full ownership and responsibility for any text, PDFs, images, audio files,
              URLs, or API keys you input or open in QUBNEXA tools. You represent that you hold all
              necessary rights or authorization to process or download any media or documents you use
              with our utilities.
            </p>
          </section>

          <section id="intellectual-property" className="scroll-mt-24 space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              6. Intellectual Property
            </h2>
            <p>
              The QUBNEXA brand name, tagline (&ldquo;Explore. Create. Simplify.&rdquo;), custom
              visual assets, interface design, and original source documentation are protected under
              applicable copyright and trademark principles. Open-source packages and libraries used
              by the Platform remain governed by their respective licenses.
            </p>
          </section>

          <section id="third-party-services" className="scroll-mt-24 space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              7. Third-Party Services
            </h2>
            <p>
              Certain features and advertising networks connect directly from your browser to external services or
              public endpoints (including Google AdSense advertising services, OpenAI BYOK speech APIs, Hugging Face ONNX model downloads,
              Google Fonts, browser Web Speech services, external media links, or WhatsApp Web share
              links). QUBNEXA does not endorse, control, or assume responsibility for third-party
              websites, APIs, pricing, or service policies.
            </p>
          </section>

          <section id="ai-disclaimer" className="scroll-mt-24 space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              8. AI-Generated Content Disclaimer
            </h2>
            <p>
              Prompts, speech audio, transcriptions, or text outputs generated with AI-assisted or
              neural browser features may contain inaccuracies, pronunciation artifacts, or unintended
              results. Always review generated outputs carefully before publishing, relying on them,
              or submitting them to external AI platforms.
            </p>
          </section>

          <section id="accuracy-reliability" className="scroll-mt-24 space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              9. Accuracy and Reliability
            </h2>
            <p>
              While we aim for accurate formulas across financial, GST, salary, date, and unit tools,
              rounding differences, statutory rule changes, browser differences, or user input errors
              can occur. Always verify critical calculations independently or consult a qualified
              accountant, tax advisor, engineer, or legal professional before making financial or
              compliance decisions.
            </p>
          </section>

          <section id="service-availability" className="scroll-mt-24 space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              10. Service Availability
            </h2>
            <p>
              All tools on QUBNEXA are provided on an &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; basis. Features, limits, performance, or individual tools may change,
              be paused, or be discontinued at any time without prior notice.
            </p>
          </section>

          <section id="limitation-liability" className="scroll-mt-24 space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              11. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, QUBNEXA and its maintainers shall
              not be liable for any indirect, incidental, special, consequential, or financial
              damages, data loss, lost profits, or business interruptions arising out of your use or
              inability to use any tool or output on the Platform.
            </p>
          </section>

          <section id="indemnification" className="scroll-mt-24 space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              12. Indemnification
            </h2>
            <p>
              You agree to indemnify and hold harmless QUBNEXA and its maintainers from any claims,
              losses, liabilities, or expenses arising from your misuse of the Platform, violation of
              these Terms, or infringement of third-party rights through files or links you process.
            </p>
          </section>

          <section id="changes-to-terms" className="scroll-mt-24 space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              13. Changes to Terms
            </h2>
            <p>
              We may revise these Terms &amp; Conditions periodically as features evolve. Continued
              use of QUBNEXA after updated terms are posted constitutes acceptance of the revised
              terms.
            </p>
          </section>

          <section id="governing-law" className="scroll-mt-24 space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              14. Governing Law &amp; Jurisdiction Notice
            </h2>
            <p>
              These Terms &amp; Conditions are provided without specifying an assumed corporate entity
              or court jurisdiction. Where local mandatory consumer laws apply, those statutory rights
              remain unaffected.{' '}
              <strong>
                Owner confirmation note: the platform owner should confirm and specify the exact
                operating entity name and governing country/state jurisdiction prior to commercial or
                formal legal reliance.
              </strong>
            </p>
          </section>

          <section id="contact-info" className="scroll-mt-24 space-y-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              15. Contact Information
            </h2>
            <p>
              Questions or feedback regarding these Terms &amp; Conditions can be reviewed via our{' '}
              <Link to="/contact" className="text-blue-600 dark:text-[#00DFFF] underline">
                Contact Us
              </Link>{' '}
              page (where direct owner support details will appear once configured).
            </p>
          </section>
        </div>
      </div>
    </LegalDocumentLayout>
  )
}
