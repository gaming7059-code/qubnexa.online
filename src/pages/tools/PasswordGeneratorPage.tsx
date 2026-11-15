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
    route: '/tools/password-generator',
    path: '/tools/password-generator',
    description:
      'Generate cryptographically random passwords privately in your browser using Web Crypto. Custom lengths (4–128 characters), entropy indicators, and zero server transmission.',
    primaryCategory: 'utilities',
    secondaryCategories: ['text-writing'],
    categoryId: 'utilities',
    categoryIds: ['utilities', 'text-writing'],
    categoryName: 'Converters & Utilities',
    icon: 'KeyRound',
    status: 'live',
    releaseOrder: 14,
    createdAt: '2026-02-12',
    isPopular: true,
    isNew: true,
    badge: 'Security',
    tags: [
      'password generator',
      'strong password',
      'random password',
      'secure password',
      'web crypto entropy',
      'csprng password online',
    ],
    keywords: [
      'password generator',
      'strong password',
      'random password',
      'secure password',
      'web crypto entropy',
      'csprng password online',
    ],
  }

  const howToUseSteps = [
    'Choose your password length: Adjust the slider or type directly into the numeric box to set your desired length between 4 and 128 characters, or click quick length presets (12, 16, 24, or 32 characters).',
    'Select character groups: Toggle Uppercase letters (A–Z), Lowercase letters (a–z), Numbers (0–9), and Special Symbols (!@#$%^&*...) to match your target service requirements.',
    'Optionally exclude ambiguous characters: Check "Exclude Ambiguous Characters" to omit easily confusable glyphs (such as i, l, 1, I, o, 0, O, and |) for easier manual typing.',
    'Configure batch quantity: Adjust the batch slider to generate between 1 and 10 unique, cryptographically isolated passwords simultaneously.',
    'Inspect live entropy and strength rating: Review the real-time Shannon entropy (in bits), strength grade (Very Weak to Very Strong), and estimated brute-force crack time.',
    'Regenerate on demand: Click the refresh button or tweak any setting to immediately produce a fresh set of randomized passwords.',
    'Copy to clipboard: Click "Copy" on any individual password, or click "Copy All" to export your entire generated batch into an encrypted password manager.',
  ]

  const formulas = [
    {
      title: 'Shannon Information Entropy & Active Pool Size',
      formula: 'H = L × log₂(N) bits',
      explanation:
        'Calculates theoretical information entropy where L is password length and N is the active character pool size. The generator provides 26 lowercase, 26 uppercase, 10 digits, and 28 standard symbols (N = 90 total characters, yielding 6.49 bits/char and ~104 bits at 16 characters). The real-time strength meter evaluates character presence using standard 4-class ASCII heuristics (N = 94, displaying 105 bits for 16 chars, 157 bits for 24 chars, and 210 bits for 32 chars). Both measures exceed the 80–100 bit threshold for offline brute-force resistance.',
    },
    {
      title: 'CSPRNG Cryptographic Randomness',
      formula: 'R = crypto.getRandomValues(Uint32Array)',
      explanation:
        'Uses the Web Cryptography API (window.crypto.getRandomValues) to query operating system hardware entropy sources, completely avoiding predictable pseudorandom number generators like Math.random().',
    },
    {
      title: 'Rejection Sampling (Modulo Bias Elimination)',
      formula: 'Limit = 2³² − (2³² mod N) | Accept R if R < Limit',
      explanation:
        'Standard modulo reduction (R mod N) introduces statistical bias when the range of 2³² is not an exact multiple of the pool size N. Rejection sampling discards values at or above the threshold to ensure every character has a mathematically identical selection probability.',
    },
    {
      title: 'Guaranteed Set Inclusion & Fisher-Yates Shuffle',
      formula: 'Password = SecureShuffle([Char_Upper, Char_Lower, Char_Digit, Char_Symbol, ...])',
      explanation:
        'Guarantees at least one character from each enabled character set, then applies an unbiased in-place Fisher-Yates shuffle so guaranteed characters do not occupy predictable index positions.',
    },
    {
      title: 'Brute-Force Offline Cracking Resistance Model',
      formula: 'Average Time = 2^(H − 1) / Hash_Rate',
      explanation:
        'Estimates the time required to exhaust half the keyspace (2^(H − 1) attempts) against high-performance offline cracking rigs computing 100 billion (10¹¹) guesses per second.',
    },
    {
      title: 'Zero-Telemetry Client-Side Sandbox',
      formula: 'Data Path: Browser RAM → Clipboard (0 Network Requests)',
      explanation:
        'Every password is generated exclusively within volatile browser memory. Generated values are never transmitted over HTTP, never cached in local storage or cookies, and never logged to external servers.',
    },
  ]

  const examples = [
    {
      title: 'Standard Online Account Password (16 Characters)',
      description:
        'Ideal for social media, streaming services, and online shopping accounts.',
      input:
        'Length: 16 • Uppercase, Lowercase, Numbers, Symbols • All 90 characters active',
      output:
        'e.g. j#8K$vP3!wQ9@tR2 (105 bits live meter / 104 bits exact pool • Score: 3/4 Strong • Estimated crack time: Centuries)',
    },
    {
      title: 'Password Vault Master Password (24 Characters)',
      description:
        'Maximum resistance for master keys guarding password managers (Bitwarden, 1Password) and primary email vaults.',
      input:
        'Length: 24 • Uppercase, Lowercase, Numbers, Symbols',
      output:
        'e.g. k#9M$xP7!wQ2@vR8%tY4^uN1 (157 bits live meter / 156 bits exact pool • Score: 4/4 Very Strong • Estimated crack time: Millions of years)',
    },
    {
      title: 'High-Readability Device & Wi-Fi Passkey (16 Characters)',
      description:
        'Easy manual entry on smart TVs, router portals, and IoT hardware without visual ambiguity.',
      input:
        'Length: 16 • Exclude Ambiguous (82 active characters; omits i, l, 1, I, o, 0, O, |)',
      output:
        'e.g. 7kM#9xPq2vR8tY4u (105 bits live meter / 102 bits exact pool • Score: 3/4 Strong • Zero visual character confusion)',
    },
    {
      title: 'DevOps API Secret & Database Token (32 Characters)',
      description:
        'High-entropy machine-to-machine tokens, webhook signing secrets, and database administrative credentials.',
      input:
        'Length: 32 • Full alphanumeric and symbol pool',
      output:
        'e.g. m$9X#kP2!vR7@tY4%uN8^wQ1&zK5*pL3 (210 bits live meter / 208 bits exact pool • Score: 4/4 Very Strong • Very Strong estimated brute-force resistance under stated assumptions)',
    },
  ]

  const faqs = [
    {
      question: 'Is it safe to generate passwords using this online browser tool?',
      answer:
        'Yes, completely. QUBNEXA Password Generator executes 100% client-side in your local web browser. It uses the native Web Cryptography API (window.crypto.getRandomValues) inside volatile memory. Your generated passwords are never transmitted across the network, never saved to cookies or local storage, and never logged to any server.',
    },
    {
      question: 'How does crypto.getRandomValues() differ from standard Math.random()?',
      answer:
        'Standard JavaScript Math.random() is a pseudo-random number generator (PRNG) that is not cryptographically secure; its internal state can be deduced by attackers. In contrast, crypto.getRandomValues() draws true cryptographic entropy directly from your operating system’s kernel (such as /dev/urandom on Unix/Linux or CryptGenRandom/BCrypt on Windows), making each output unpredictable.',
    },
    {
      question: 'What is modulo bias and how does rejection sampling eliminate it?',
      answer:
        'When mapping a 32-bit random integer (0 to 4,294,967,295) onto a character pool size N using simple modulo (R % N), slight statistical favoritism occurs toward lower numbers whenever 2³² is not evenly divisible by N. QUBNEXA uses rejection sampling to discard numbers above the largest multiple of N, guaranteeing perfectly uniform probability for every character in the pool.',
    },
    {
      question: 'How does the generator guarantee character variety without creating predictable patterns?',
      answer:
        'When you select multiple character sets (e.g. uppercase, lowercase, numbers, and symbols), the engine guarantees at least one character from each enabled set is included. It then applies an unbiased in-place Fisher-Yates shuffle across the entire array, ensuring the guaranteed characters are distributed randomly rather than always appearing at the beginning.',
    },
    {
      question: 'What is Shannon entropy and how does it determine password strength?',
      answer:
        'Shannon entropy measures the uncertainty or unpredictability of a password in bits: H = Length × log₂(Pool Size). The higher the entropy, the more computational guesses an attacker requires. With 26 lowercase, 26 uppercase, 10 digits, and 28 symbols (90 active characters), each character adds ~6.49 bits of entropy (~104 bits for 16 characters; the live meter displays 105 bits under 94-char ASCII classification). Even at 100 billion offline guesses per second, testing 104+ bits of entropy requires centuries of compute time under stated assumptions.',
    },
    {
      question: 'Why and when should I use the "Exclude Ambiguous Characters" option?',
      answer:
        'Certain fonts and screens make characters like uppercase I, lowercase l, number 1, uppercase O, and number 0 look virtually identical. Enabling "Exclude Ambiguous Characters" removes these characters from the pool, making passwords much easier to read and transcribe manually onto smartphones, smart TVs, or Wi-Fi routers.',
    },
    {
      question: 'How long should a secure password be in 2026?',
      answer:
        'Cybersecurity standards (such as NIST SP 800-63B) recommend a minimum of 14 to 16 characters for standard consumer accounts. For master passwords guarding password vaults, primary email addresses, and cloud infrastructure, a length of 20 to 32 characters with diverse character sets is recommended for long-term cryptographic resilience.',
    },
    {
      question: 'Does QUBNEXA store, log, or transmit generated passwords to any server?',
      answer:
        'Never. There are zero tracking pixels, zero analytics scripts inspecting form data, and zero backend API calls connected to password generation. Once you refresh or close the tab, the generated passwords vanish from browser memory entirely.',
    },
    {
      question: 'Can I generate multiple passwords simultaneously for different accounts?',
      answer:
        'Yes. You can use the Quantity slider to generate up to 10 distinct, cryptographically isolated passwords at once. Each password in the batch is generated independently. You can copy individual passwords using their dedicated copy buttons or click "Copy All" to copy the entire batch separated by newlines.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Password Generator Online — Random & Secure Passwords | QUBNEXA"
      seoDescription="Generate strong, random passwords online with QUBNEXA. Free CSPRNG generator (4–128 chars) with custom symbols, live entropy scores, and 100% browser privacy."
      keywords="password generator, strong password, random password, secure password, csprng password online, password maker, generate passwords, random string generator, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['password-checker', 'qr-code-generator', 'word-counter', 'text-repeater', 'text-inverter', 'json-formatter']}
    >
      <PasswordGenerator />
    </ToolPageLayout>
  )
}
