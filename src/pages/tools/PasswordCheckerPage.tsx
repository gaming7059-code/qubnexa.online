import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { PasswordChecker } from '../../tools/PasswordChecker/PasswordChecker'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const PasswordCheckerPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'password-checker') || {
    id: 'password-checker',
    name: 'Smart Password Checker',
    slug: 'password-checker',
    path: '/tools/password-checker',
    description: 'Check your password strength instantly and generate stronger password alternatives privately in your browser.',
    categoryId: 'utilities',
    categoryIds: ['utilities'],
    categoryName: 'Utilities',
    icon: 'ShieldCheck',
    isPopular: true,
    isNew: true,
    isFunctional: true,
    badge: 'Security',
    keywords: ['password checker', 'password strength', 'password security test', 'test password', 'smart password checker', 'strong password generator', 'privacy'],
  }

  const howToUseSteps = [
    'Type or paste any password, passphrase, or secret string into the input box.',
    'Toggle the eye icon to show or hide plain text characters as needed.',
    'Review the live 5-tier strength meter, Shannon entropy bits, and estimated crack times across offline GPU and online attack scenarios.',
    'Inspect the 10-point security checklist to see if your password satisfies length, symbol variety, and sequence rules.',
    'Examine specific identified vulnerabilities and actionable improvement recommendations.',
    'Explore the Smart Password Suggestions generated independently with client-side Web Crypto entropy (never derived from your entered secret).',
    'Click "Copy" on any recommended alternative to use it immediately in your accounts.',
  ]

  const formulas = [
    {
      title: 'Shannon Information Entropy',
      formula: 'H = L × log₂(N) bits',
      explanation: 'Where L is the character length and N is the character pool size (lowercase, uppercase, numbers, symbols). Higher entropy exponentially increases the combinatorial search space.',
    },
    {
      title: 'Pattern & Sequence Penalties',
      formula: 'H_eff = H_pool - (Penalties_seq + Penalties_rep + Penalties_dict)',
      explanation: 'Penalizes predictable sequences (e.g. 12345, abcde, qwerty), repeating characters (e.g. aaaa), and known common password patterns that bypass pure brute force.',
    },
    {
      title: 'Brute-Force Attack Resistance',
      formula: 'Time to Crack = (2^(H - 1)) / Guess_Rate',
      explanation: 'Calculates the mathematical time needed by an offline GPU cluster capable of 100 billion guesses per second to crack the password by exhaustive search.',
    },
  ]

  const examples = [
    {
      title: 'Common Dictionary Password',
      description: 'Frequently targeted password with predictable word-and-number structure.',
      input: 'password123',
      output: 'Very Weak (12/100) • Crack Time: Instant • Matches common weak pattern',
    },
    {
      title: 'Medium Complexity Password',
      description: 'Capitalized word with numbers and symbol, but under 12 characters.',
      input: 'Summer2026!',
      output: 'Moderate (55/100) • Vulnerable to hybrid dictionary + rule-based attacks',
    },
    {
      title: 'Cryptographic Passphrase (5 Words)',
      description: 'Five randomized words from verified 2,048 BIP-39 dictionary with symbol and numbers.',
      input: 'beacon-velvet-galaxy-timber-harbor#84',
      output: 'Strong (72/100) • 65 bits true generator entropy • High memorability without cognitive strain',
    },
    {
      title: 'Ultra-Secure Alphanumeric Secret',
      description: '18-character cryptographically random string with full character sets.',
      input: 'k#9M$xP7!wQ2@vR8%t',
      output: 'Very Strong (98/100) • 109 bits generator entropy • Millennia-grade resistance against offline GPUs',
    },
  ]

  const faqs = [
    {
      question: 'Is it safe to check my password on QUBNEXA?',
      answer: 'Yes, 100%. All calculations, pattern detections, and entropy analyses are performed entirely within your browser’s volatile memory using client-side JavaScript. QUBNEXA does not store, log, cache, or transmit your passwords to any server.',
    },
    {
      question: 'Does the tool send my password across the internet or check breach databases?',
      answer: 'No. There are zero client-side HTTP requests, zero background network calls, and zero external database queries. Common weak passwords and leetspeak patterns are evaluated against an offline, in-memory curated list of 350+ common passwords and predictable variations.',
    },
    {
      question: 'How are the crack times calculated and are they guaranteed?',
      answer: 'Crack times are mathematical approximations assuming exhaustive brute-force guessing over calculated entropy. They do not account for dictionary attacks, leaked credentials, password reuse, or targeted social engineering, which can crack predictable passwords much faster. Real resistance depends on hashing algorithms (e.g. Argon2 vs MD5), salt uniqueness, and rate limiting.',
    },
    {
      question: 'How do the Smart Password Suggestions work and what is their true entropy?',
      answer: 'Suggestions are generated purely using the Web Cryptography API (crypto.getRandomValues) with unbiased rejection sampling. The alphanumeric option yields ~109 bits of true entropy. The passphrase option selects 5 independent words from the verified 2,048-word BIP-39 wordlist with symbols and numbers, providing ~65 bits of true generator entropy. Crucially, suggestions are 100% independent and never inspect or reuse your entered text.',
    },
    {
      question: 'Why does length matter more than character complexity?',
      answer: 'Because combinations scale exponentially with length (N^L). Adding 4 more characters to a password expands the search space far more drastically than simply swapping an "a" for an "@" in an 8-character word.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Smart Password Checker Online — Strength & Entropy Analyzer | QUBNEXA"
      seoDescription="Check password strength and entropy in real time with brute force crack time estimation. 100% private in-browser analysis with zero server storage."
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['password-generator', 'qr-code-generator', 'word-counter', 'text-repeater']}
    >
      <PasswordChecker />
    </ToolPageLayout>
  )
}
