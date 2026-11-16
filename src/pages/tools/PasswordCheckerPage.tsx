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
    route: '/tools/password-checker',
    path: '/tools/password-checker',
    description:
      'Check your password strength instantly and generate stronger password alternatives privately in your browser.',
    primaryCategory: 'utilities',
    secondaryCategories: ['utilities'],
    categoryId: 'utilities',
    categoryIds: ['utilities'],
    categoryName: 'Converters & Utilities',
    icon: 'ShieldCheck',
    status: 'live',
    releaseOrder: 28,
    createdAt: '2026-11-13',
    isNew: true,
    isPopular: true,
    badge: 'Security',
    tags: [
      'password checker',
      'password strength',
      'password security test',
      'test password',
      'smart password checker',
      'strong password generator',
      'privacy',
    ],
    keywords: [
      'password checker',
      'password strength',
      'password security test',
      'test password',
      'smart password checker',
      'strong password generator',
      'privacy',
    ],
  }

  const howToUseSteps = [
    'Enter a test password or passphrase: Type or paste a sample password pattern into the secure input box. (Never paste active credentials protecting critical financial or primary email accounts).',
    'Toggle character visibility: Click the eye icon to reveal or conceal plain text characters while inspecting character composition and syntax.',
    'Inspect the live 5-tier strength meter: Review the real-time heuristic strength score (0–100), strength level (Very Weak to Very Strong), character length, and Shannon entropy bits.',
    'Analyze multi-scenario crack time estimates: Compare estimated theoretical brute-force durations across Fast Hash GPU clusters (100B guesses/sec), Slow Memory-Hard KDFs (bcrypt/Argon2), and Online Throttled login portals.',
    'Review the 10-point security checklist: Verify whether your password satisfies length benchmarks (8+, 12+, 16+), character class variety, sequence avoidance, repeat avoidance, and common pattern rules.',
    'Examine identified vulnerabilities: Read specific detected weaknesses (such as dictionary roots, seasonal words, or keyboard walks) and follow actionable improvement tips.',
    'Explore independent Smart Suggestions: Copy cryptographically generated alternatives (18-character alphanumeric or 5-word BIP-39 passphrase) produced with Web Crypto CSPRNG with zero connection to your input.',
  ]

  const formulas = [
    {
      title: 'Shannon Information Entropy Model',
      formula: 'H = L × log₂(N) bits',
      explanation:
        'Calculates theoretical information entropy where L is password length and N is the active character pool size (up to 95 printable characters: 26 lowercase, 26 uppercase, 10 digits, and 33 punctuation symbols).',
    },
    {
      title: 'Structural Passphrase Entropy Bounding Heuristic',
      formula: 'H_passphrase = min(H_char, Words × 11.5 + Bonus_num + Bonus_sym)',
      explanation:
        'When delimiter-separated tokens are detected (spaces, hyphens, underscores), the engine bounds base entropy to Words × 11.5 bits plus numeric/symbol bonuses. This structural heuristic models typical dictionary entropy without performing actual dictionary lookups on user input.',
    },
    {
      title: 'Multi-Vector Vulnerability & Pattern Penalties',
      formula: 'H_eff = max(2, H_base − (Pen_seq + Pen_rep + Pen_common + Pen_diversity))',
      explanation:
        'Penalizes predictable sequential runs (e.g. 123, abc, qwerty walks), consecutive repeated characters (e.g. aaa, 111), low character class diversity, and common weak patterns compiled from an offline curated list of 350+ passwords with leetspeak normalization.',
    },
    {
      title: 'Three-Tier Brute-Force Crack Time Estimation',
      formula: 'Average Time = 2^(H_eff − 1) / Guess_Rate',
      explanation:
        'Estimates theoretical time to test half the keyspace (2^(H_eff − 1) attempts) across three attack scenarios: Fast Hash GPU clusters (10¹¹ guesses/sec for MD5/NTLM), Slow Memory-Hard KDFs (10⁴ guesses/sec for bcrypt/Argon2), and Online Throttled login forms (100 attempts/hour). These are mathematical models, not real-world security guarantees.',
    },
    {
      title: 'Heuristic Strength Scoring & Security Ceilings (0–100 Scale)',
      formula: 'Score = min(100, round(H_eff)) | Caps: Common ≤ 18, L < 6 ≤ 15, L < 8 ≤ 30',
      explanation:
        'Calculates an educational heuristic score (0–100) from effective entropy while enforcing hard security caps for known weak passwords and dangerously short lengths. This is a proprietary evaluation heuristic, not an internationally standardized or universal certification score.',
    },
    {
      title: 'Zero-Telemetry Client-Side Sandbox Guarantee',
      formula: 'Network I/O: 0 HTTP Requests | Storage: Volatile RAM Only',
      explanation:
        'All pattern matching, dictionary checks, entropy math, and suggestion generation occur 100% client-side inside your browser thread. No passwords or keystrokes are ever sent across the network or stored in cookies or local storage.',
    },
  ]

  const examples = [
    {
      title: 'Common Dictionary Password with Numbers (password123)',
      description:
        'Frequently targeted dictionary word combined with a predictable numeric ladder.',
      input:
        'password123 (11 characters • lowercase + digits)',
      output:
        'Score: 2/100 (Very Weak heuristic) • 2 bits entropy • Fast Hash: Instant (est.) • Identified as common compromised pattern with sequential run • Theoretical estimate, not a guarantee',
    },
    {
      title: 'Seasonal Word with Year & Symbol (Summer2026!)',
      description:
        'Capitalized seasonal word paired with current year and exclamation mark, typical of corporate quarterly resets.',
      input:
        'Summer2026! (11 characters • upper + lower + digits + symbol)',
      output:
        'Score: 18/100 (Very Weak heuristic) • 32 bits entropy • Fast Hash: < 1 sec (est.) • Capped by offline common password dictionary detection • Theoretical estimate, not a guarantee',
    },
    {
      title: 'Moderate Random Alphanumeric Key (G7#vK9!wX2)',
      description:
        'Randomized characters across all 4 character sets without dictionary roots, but under 12 characters.',
      input:
        'G7#vK9!wX2 (10 characters • all 4 character classes)',
      output:
        'Score: 66/100 (Moderate heuristic) • 66 bits entropy • Fast Hash: 12 years (est.) • Slow KDF: 117 million years (est.) • Warning: Under 12 characters • Theoretical estimate, not a guarantee',
    },
    {
      title: 'Multi-Word Passphrase Structure (beacon-velvet-galaxy-timber-harbor#84)',
      description:
        'Five hyphen-separated words with symbol and numbers, evaluated using the structural passphrase bounding heuristic.',
      input:
        'beacon-velvet-galaxy-timber-harbor#84 (37 characters • 5 word tokens + symbol + numbers)',
      output:
        'Score: 72/100 (Strong heuristic) • 67 bits entropy • Fast Hash: 23 years (est.) • Slow KDF: 234 million years (est.) • Structural heuristic bounding applied • Theoretical estimate, not a guarantee',
    },
    {
      title: 'High-Entropy 18-Character CSPRNG Random String (k#9M$xP7!wQ2@vR8%t)',
      description:
        '18 cryptographically random characters across all 4 sets with zero dictionary patterns.',
      input:
        'k#9M$xP7!wQ2@vR8%t (18 characters • all 4 character classes)',
      output:
        'Score: 100/100 (Very Strong heuristic) • 118 bits entropy • Fast Hash: 52+ billion years (est.) • Very Strong estimated brute-force resistance under stated assumptions (not an absolute guarantee)',
    },
  ]

  const faqs = [
    {
      question: 'Is it safe to test my actual passwords on this online tool?',
      answer:
        'We strongly recommend testing password patterns, structures, or variations rather than passwords currently protecting your critical accounts (such as banking, primary email, or password managers). Although QUBNEXA operates 100% client-side with zero network requests and zero logging, standard cybersecurity best practice advises never pasting active secrets into any web browser.',
    },
    {
      question: 'Does QUBNEXA send my password over the internet or check online breach databases?',
      answer:
        'No. There are zero HTTP requests, zero background network calls, and zero external database queries. Common weak passwords and leetspeak patterns are evaluated against an in-memory, curated offline list of ~350 common passwords and predictable variations entirely within your device’s JavaScript execution thread.',
    },
    {
      question: 'How are estimated crack times calculated and are they guaranteed?',
      answer:
        'Crack times are theoretical mathematical estimations assuming exhaustive brute-force search over effective entropy (2^(H − 1) average combinations across 100B guesses/sec for Fast Hash, 10,000/sec for Slow KDF, and 100/hr for Online Throttled). They are theoretical estimations, NOT operational guarantees. Real-world adversaries routinely bypass brute-force guessing using leaked password lists, credential stuffing, phishing, malware, or compromised session tokens.',
    },
    {
      question: 'How do the Smart Password Suggestions work, and do they use my entered password?',
      answer:
        'Smart Suggestions are generated purely using the Web Cryptography API (crypto.getRandomValues) with unbiased rejection sampling. The alphanumeric option yields ~109 bits of true entropy, while the passphrase option selects 5 independent words from the verified 2,048-word BIP-39 wordlist with symbols and numbers (~65 bits true generator entropy). Crucially, suggestions are 100% independent and never inspect, reuse, or derive from your entered text.',
    },
    {
      question: 'Does the checker verify passphrases against a 2,048-word BIP-39 dictionary?',
      answer:
        'No. The password analysis engine detects multi-word structures by delimiters (hyphens, spaces, underscores) and applies a conservative structural bounding formula (11.5 bits per word) to prevent inflating simple word combinations. It does not look up words in a dictionary during analysis. However, the Smart Suggestions generator specifically uses a verified 2,048-word BIP-39 list to produce genuinely random 5-word passphrases with ~65 bits of true generator entropy.',
    },
    {
      question: 'Why does length provide more security than substituting symbols (leetspeak)?',
      answer:
        'Password search space scales exponentially with length (N^L). Substituting an "a" with "@" or "e" with "3" in an 8-character word is easily cracked by dictionary permutation rules. Adding 4 to 8 additional random characters expands the keyspace by billions of times, creating vastly superior resistance against brute-force attacks.',
    },
    {
      question: 'What is leetspeak normalization and how does it detect common weaknesses?',
      answer:
        'Attackers routinely use automated permutation rules to substitute numbers and symbols for letters. QUBNEXA normalizes characters (e.g. @ → a, 3 → e, 0 → o, $ → s, 7 → t) and checks whether the underlying word matches common passwords like "password", "welcome", or "admin", penalizing predictable variations accordingly.',
    },
    {
      question: 'What makes a password "Very Strong" according to modern cybersecurity standards?',
      answer:
        'NIST SP 800-63B guidelines emphasize length, unpredictability, and resistance to common dictionary words. A "Very Strong" password has at least 16 characters, draws from multiple character sets without predictable sequential runs or repeats, and is completely unique across all your accounts.',
    },
    {
      question: 'How is the 0–100 score calculated and is it an official standard?',
      answer:
        'The 0–100 score is a proprietary educational heuristic designed by QUBNEXA to help users assess relative password quality. It starts from effective Shannon entropy, applies penalties for sequences, repetition, and weak patterns, and enforces hard security caps (such as a maximum of 18 for common passwords). It is an educational heuristic, not an official industry-standard or regulatory certification score.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Password Strength Checker — Test & Analyze Passwords | QUBNEXA"
      seoDescription="Check password strength, Shannon entropy, and estimated crack times online with QUBNEXA. 100% private in-browser analysis with zero logging or server transfer."
      keywords="password checker, password strength, password strength test, test password online, password security analyzer, shannon entropy password, brute force crack time, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['password-generator', 'qr-code-generator', 'word-counter', 'text-repeater', 'text-inverter', 'json-formatter']}
    >
      <PasswordChecker />
    </ToolPageLayout>
  )
}
