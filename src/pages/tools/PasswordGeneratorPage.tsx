import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { PasswordGenerator } from '../../tools/PasswordGenerator/PasswordGenerator'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const PasswordGeneratorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'password-generator') || {
    id: 'password-generator',
    name: 'Password Generator',
    slug: 'password-generator',
    path: '/tools/password-generator',
    description: 'Generate ultra-secure, cryptographically random passwords with custom lengths (4–128 characters), entropy indicators, and zero server transmission.',
    categoryId: 'daily-utilities',
    categoryIds: ['daily-utilities', 'text-developer'],
    categoryName: 'Daily Utilities',
    icon: 'KeyRound',
    isPopular: true,
    isNew: true,
    isFunctional: true,
    keywords: ['password generator', 'random password', 'secure password', 'strong password generator', 'cryptographic password', 'csprng password online'],
  }

  const howToUseSteps = [
    'Use the slider or numeric input to choose your desired password length (from 4 up to 128 characters). 16 or 24 characters is recommended for high security.',
    'Toggle character groups on or off: Uppercase (A-Z), Lowercase (a-z), Numbers (0-9), and Special Symbols (!@#$%).',
    'Enable "Exclude Ambiguous Characters" if you want to avoid visually confusing letters and digits like 1, l, I, 0, and O.',
    'Choose your batch generation quantity (1 to 10 passwords) if you need multiple passwords at once.',
    'Review the live Shannon Entropy score and estimated brute-force crack time.',
    'Click "Copy" next to any generated password to securely copy it to your clipboard.',
  ]

  const formulas = [
    {
      title: 'Information Entropy (Shannon)',
      formula: 'H = L × log₂(N) bits',
      explanation: 'Where L is the password length and N is the total character pool size. A 16-character alphanumeric and symbol password yields ~105 bits of true entropy.',
    },
    {
      title: 'CSPRNG Randomness & Rejection Sampling',
      formula: 'Integer = crypto.getRandomValues(Uint32) mod N (unbiased)',
      explanation: 'Avoids algorithmic bias common with Math.random() by rejecting numbers outside uniform modular thresholds before assigning character indices.',
    },
    {
      title: 'Brute-Force Attack Resistance',
      formula: 'Time to Crack = (N^L) / (2 × Hash_Rate)',
      explanation: 'With 100 billion offline GPU guesses per second, a 16-character randomized password takes millions of years to crack by brute force.',
    },
  ]

  const examples = [
    {
      title: 'High-Security Master Password',
      description: 'Generating a primary password for your password manager (Bitwarden, 1Password, or Apple Keychain).',
      input: 'Length: 24 • Uppercase, Lowercase, Numbers, Symbols',
      output: 'e.g. k#9M$xP7!wQ2@vR8%tY4^uN1 (157 bits entropy • Century-grade resistance)',
    },
    {
      title: 'Wi-Fi & Router Admin Passkey',
      description: 'Creating an unambiguous router password that is easy to read without confusing 1 and l.',
      input: 'Length: 16 • Ambiguous characters excluded',
      output: 'e.g. 7kM#9xPq2vR8tY4u (102 bits entropy • High readability)',
    },
    {
      title: 'API Secret / Token Generation',
      description: 'Generating 64-character cryptographically random secrets for webhooks, JWT signing, or database credentials.',
      input: 'Length: 64 • Full alphanumeric & symbol pool',
      output: 'Cryptographically unpredictable string with over 400 bits entropy',
    },
  ]

  const faqs = [
    {
      question: 'Is it safe to generate passwords in this browser tool?',
      answer: 'Yes, absolutely. All passwords are generated purely client-side inside your browser’s volatile memory using the Web Cryptography API (crypto.getRandomValues). The passwords are never sent to our servers, never logged to the browser console, and never saved in cookies or storage.',
    },
    {
      question: 'Why does QUBNEXA avoid Math.random()?',
      answer: 'Standard Math.random() functions in JavaScript are pseudo-random number generators (PRNG) that are not cryptographically secure. Their internal seed state can potentially be deduced by attackers. In contrast, crypto.getRandomValues() queries your operating system’s cryptographic entropy pool, making outputs statistically unpredictable.',
    },
    {
      question: 'How long should my password be?',
      answer: 'For standard social media and online accounts, a minimum of 14–16 characters with symbols is recommended. For critical accounts like banking, email, cloud storage, and password managers, choose 20–32 characters.',
    },
    {
      question: 'Can I generate multiple passwords simultaneously?',
      answer: 'Yes. Use the "Quantity" slider to generate up to 10 distinct, cryptographically isolated passwords at once. You can copy individual passwords or click "Copy All".',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Strong Password Generator Online — Cryptographically Secure | QUBNEXA"
      seoDescription="Generate strong, secure passwords online using crypto.getRandomValues(). Custom lengths 4–128 chars, symbol choices, entropy meters, and 100% private in-browser generation."
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['qr-code-generator', 'word-counter', 'text-to-speech', 'pdf-editor']}
    >
      <PasswordGenerator />
    </ToolPageLayout>
  )
}
