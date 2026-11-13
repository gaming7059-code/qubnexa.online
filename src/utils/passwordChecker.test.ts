import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  analyzePassword,
  estimateCrackTimes,
  generateSmartSuggestions,
  getSecureRandomInt,
  hasRepeatedCharacters,
  hasSequentialPattern,
  isCommonPassword,
  normalizeLeetspeak,
} from './passwordChecker.ts'
import {
  PASSPHRASE_WORDLIST,
  PASSPHRASE_WORDLIST_SIZE,
} from './passphraseWordlist.ts'

test('wordlist satisfies minimum size and 100% uniqueness (FIND-01)', () => {
  assert.ok(PASSPHRASE_WORDLIST_SIZE >= 2048, `Wordlist size ${PASSPHRASE_WORDLIST_SIZE} must be >= 2048`)
  assert.equal(PASSPHRASE_WORDLIST.length, 2048)

  const uniqueSet = new Set(PASSPHRASE_WORDLIST)
  assert.equal(uniqueSet.size, 2048, 'Wordlist must contain 2048 unique words with zero duplicates')

  // Verify all words are lowercase and trimmed
  for (const word of PASSPHRASE_WORDLIST) {
    assert.equal(word, word.toLowerCase().trim())
    assert.ok(word.length >= 3 && word.length <= 10)
  }
})

test('passphrase theoretical generator entropy calculation (FIND-01 & FIND-02)', () => {
  // 5 words selected without replacement from 2048 words:
  // log2(2048) = 11 bits per word. 5 words = 55.0 bits
  // 2 digits (10-99 = 90 choices) = ~6.49 bits
  // 1 symbol (8 choices) = 3.0 bits
  // Total = 55 + 6.49 + 3.0 = ~64.49 bits
  const wordEntropy = 5 * Math.log2(PASSPHRASE_WORDLIST_SIZE)
  assert.equal(wordEntropy, 55.0)

  const totalGeneratorEntropy = Math.round(wordEntropy + Math.log2(90) + Math.log2(8))
  assert.ok(totalGeneratorEntropy >= 64, `Total generator entropy ${totalGeneratorEntropy} must be >= 64 bits`)
})

test('generateSmartSuggestions produces high-entropy candidates with zero input dependency (FIND-01)', () => {
  const userInput = 'UserSecretTargetWord999!'
  const suggestions = generateSmartSuggestions(userInput)

  assert.equal(suggestions.length, 2)

  // Candidate 1: Ultra-Secure Alphanumeric
  const complex = suggestions[0]
  assert.equal(complex.type, 'complex')
  assert.ok(complex.password.length >= 18)
  assert.ok(complex.entropyBits >= 100)
  assert.equal(complex.level, 'very-strong')
  assert.equal(complex.password.includes('UserSecret'), false)
  assert.equal(complex.password.includes('TargetWord'), false)

  // Candidate 2: Cryptographic Passphrase (5 words)
  const passphrase = suggestions[1]
  assert.equal(passphrase.type, 'passphrase')
  assert.ok(passphrase.entropyBits >= 64)
  assert.equal(passphrase.level, 'strong')
  assert.equal(passphrase.score, 72)

  const parts = passphrase.password.split('-')
  assert.equal(parts.length, 5, 'Passphrase must contain exactly 5 words separated by hyphens')

  // Verify all 5 words belong to the verified wordlist
  for (let i = 0; i < 4; i++) {
    assert.ok(PASSPHRASE_WORDLIST.includes(parts[i] as any))
  }
  // Fifth part contains trailing symbol and 2 digits
  const lastWord = parts[4].replace(/[!@#$%^&*][0-9]{2}$/, '')
  assert.ok(PASSPHRASE_WORDLIST.includes(lastWord as any))

  assert.equal(passphrase.password.includes('UserSecret'), false)
  assert.equal(passphrase.password.includes('TargetWord'), false)
})

test('common weak password detection catches variations and leetspeak (FIND-03)', () => {
  // Exact matches
  assert.equal(isCommonPassword('password'), true)
  assert.equal(isCommonPassword('admin'), true)
  assert.equal(isCommonPassword('123456'), true)
  assert.equal(isCommonPassword('dragon'), true)

  // Leetspeak normalized
  assert.equal(normalizeLeetspeak('P@ssw0rd'), 'password')
  assert.equal(isCommonPassword('P@ssw0rd'), true)
  assert.equal(isCommonPassword('Adm1n'), true)
  assert.equal(isCommonPassword('Tru$tN01'), true)

  // Suffix numbers and symbols
  assert.equal(isCommonPassword('password123'), true)
  assert.equal(isCommonPassword('admin2026'), true)
  assert.equal(isCommonPassword('welcome1!'), true)
  assert.equal(isCommonPassword('dragon99'), true)
  assert.equal(isCommonPassword('qwerty1234'), true)

  // Strong random password should NOT be flagged as common
  assert.equal(isCommonPassword('k#9M$xP7!wQ2@vR8%t'), false)
  assert.equal(isCommonPassword('z7#Pq9*Lv2$Rw8!m'), false)
})

test('incidental sequences in long random CSPRNG passwords are not excessively penalized (FIND-04)', () => {
  // A 20-character CSPRNG password that happens to contain an incidental '123'
  const longWithIncidental = 'k#9M$xP7!wQ2123R8%tY'
  const analysis = analyzePassword(longWithIncidental)

  // Should remain Strong/Very Strong (>= 80 score) and NOT drop to Weak
  assert.ok(analysis.score >= 80, `Score ${analysis.score} should be >= 80`)
  assert.ok(analysis.level === 'strong' || analysis.level === 'very-strong')

  // Check that the checklist accommodates minor incidental sequences in 16+ char random passwords
  const seqCriterion = analysis.criteria.find(c => c.id === 'no-sequences')
  assert.ok(seqCriterion, 'Criteria should include no-sequences')
  assert.equal(seqCriterion?.met, true, 'Long random password with incidental 3-char run should satisfy criteria')

  // Contrast with a truly dominant predictable sequence
  const predictable = 'Password123'
  const predAnalysis = analyzePassword(predictable)
  assert.ok(predAnalysis.score < 25)
  assert.equal(predAnalysis.level, 'very-weak')
  const predCriterion = predAnalysis.criteria.find(c => c.id === 'no-sequences')
  assert.equal(predCriterion?.met, false)
})

test('analyzePassword handles empty string correctly', () => {
  const result = analyzePassword('')
  assert.equal(result.score, 0)
  assert.equal(result.level, 'very-weak')
  assert.equal(result.passwordLength, 0)
  assert.equal(result.entropyBits, 0)
  assert.equal(result.crackTime.fastHashOnline, 'Instant')
  assert.ok(result.criteria.length >= 8)
})

test('detects sequential alphabetic, numeric and keyboard patterns', () => {
  assert.equal(hasSequentialPattern('abc'), true)
  assert.equal(hasSequentialPattern('xyz'), true)
  assert.equal(hasSequentialPattern('cba'), true)
  assert.equal(hasSequentialPattern('123'), true)
  assert.equal(hasSequentialPattern('987'), true)
  assert.equal(hasSequentialPattern('qwerty'), true)
  assert.equal(hasSequentialPattern('asdf'), true)
  assert.equal(hasSequentialPattern('zxcv'), true)

  assert.equal(hasSequentialPattern('k9#q'), false)
  assert.equal(hasSequentialPattern('x8@m'), false)
})

test('detects repeated characters and patterns', () => {
  assert.equal(hasRepeatedCharacters('aaa'), true)
  assert.equal(hasRepeatedCharacters('1111'), true)
  assert.equal(hasRepeatedCharacters('$$$$'), true)
  assert.equal(hasRepeatedCharacters('ababab'), true)

  assert.equal(hasRepeatedCharacters('ab'), false)
  assert.equal(hasRepeatedCharacters('a1b2c3'), false)
})

test('getSecureRandomInt produces values within [0, max - 1]', () => {
  for (let i = 0; i < 50; i++) {
    const val = getSecureRandomInt(10)
    assert.ok(val >= 0 && val < 10)
  }
  assert.equal(getSecureRandomInt(0), 0)
  assert.equal(getSecureRandomInt(1), 0)
})

test('estimateCrackTimes produces realistic durations', () => {
  const zero = estimateCrackTimes(0)
  assert.equal(zero.fastHashOnline, 'Instant')

  const moderate = estimateCrackTimes(50)
  assert.ok(moderate.onlineThrottled.includes('centuries') || moderate.onlineThrottled.includes('millennia') || moderate.onlineThrottled.includes('year'))

  const ultra = estimateCrackTimes(120)
  assert.ok(ultra.fastHashOnline.includes('billion') || ultra.fastHashOnline.includes('million'))
})
