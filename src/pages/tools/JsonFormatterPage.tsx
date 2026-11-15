import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { JsonFormatter } from '../../tools/JsonFormatter/JsonFormatter'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const JsonFormatterPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'json-formatter') || {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    slug: 'json-formatter',
    route: '/tools/json-formatter',
    path: '/tools/json-formatter',
    description:
      'Format, minify, and validate JSON online with syntax error detection (line & column), collapsible tree view, key sorting, and structural statistics. 100% private in-browser.',
    primaryCategory: 'utilities',
    secondaryCategories: ['text-writing'],
    categoryId: 'utilities',
    categoryIds: ['utilities', 'text-writing'],
    categoryName: 'Converters & Utilities',
    icon: 'Code',
    status: 'live',
    releaseOrder: 32,
    createdAt: '2026-11-13',
    isPopular: true,
    isNew: true,
    badge: 'Tree View & Stats',
    tags: [
      'json formatter',
      'json validator',
      'json pretty print',
      'json minifier',
      'json viewer',
      'json tree view',
      'validate json online',
      'format json',
      'json parser',
    ],
    keywords: [
      'json formatter',
      'json validator',
      'json pretty print',
      'json minifier',
      'json viewer',
      'json tree view',
      'validate json online',
      'format json',
      'json parser',
    ],
  }

  const howToUseSteps = [
    'Paste or type your raw JSON into the Input Editor, or click "Sample JSON" to load an example payload.',
    'Inspect the real-time syntax badge: valid JSON is validated instantaneously, while invalid JSON displays the exact line and column numbers.',
    'Choose your preferred indentation (2 Spaces, 4 Spaces, or Tabs) and optionally enable "Sort Keys" to order object properties alphabetically.',
    'Click "Format / Pretty" for clean structured indentation, or "Minify" to strip whitespace for compact network payloads.',
    'Switch to "Tree Explorer" to search keys and collapse/expand nested objects, or click "Copy" or "Download" to save your result as .json.',
  ]

  const formulas = [
    {
      title: 'RFC 8259 & ECMA-404 Conformance',
      formula: 'JSON = Object | Array | String | Number | Boolean | null',
      explanation:
        'Validates against strict JSON interchange specifications. All keys must be double-quoted strings, unquoted trailing commas are rejected, and numbers conform to standard decimal notation.',
    },
    {
      title: 'Accurate Line & Column Syntax Localization',
      formula: 'Line = \\n count(0, pos) + 1, Column = pos - lastIndexOf(\\n)',
      explanation:
        'When syntax errors occur, the engine calculates the exact line and column coordinates from character byte offsets so syntax flaws can be pinpointed and repaired in seconds.',
    },
    {
      title: 'Alphabetical Object Key Sorting',
      formula: 'f(Obj) = { sorted(keys(Obj)).map(k => [k, f(Obj[k])]) }, Array Order Invariant',
      explanation:
        'Recursively sorts dictionary keys to produce deterministic, git-diff friendly JSON while strictly preserving the sequential index order of arrays.',
    },
    {
      title: 'Zero-Telemetry Client-Side Sandbox',
      formula: 'Data Transfer: Browser Memory (V8 Engine) → Screen (0 HTTP Calls)',
      explanation:
        'Every format, minify, and validation calculation is executed entirely within your browser memory. Sensitive tokens, passwords, and private API responses never leave your device.',
    },
  ]

  const examples = [
    {
      title: 'REST API Response Formatting',
      description: 'Unreadable one-line API payloads are formatted into readable indented blocks.',
      input: '{"status":"success","code":200,"data":{"id":42,"username":"alex_m"}}',
      output:
        '{\n  "status": "success",\n  "code": 200,\n  "data": {\n    "id": 42,\n    "username": "alex_m"\n  }\n}',
    },
    {
      title: 'Payload Minification for Network Transfer',
      description: 'Removes all optional indentation and newlines to compress file size.',
      input: '{\n  "mode": "production",\n  "cache": true\n}',
      output: '{"mode":"production","cache":true}',
    },
    {
      title: 'JSON String Literal Escaping',
      description: 'Escapes internal quotes and backslashes for insertion into code or shell scripts.',
      input: '{"message": "Hello \\"World\\""}',
      output: '"{\\"message\\": \\"Hello \\\\\\"World\\\\\\"\\"}"',
    },
  ]

  const faqs = [
    {
      question: 'Is my JSON payload or confidential data sent to external servers?',
      answer:
        'No, absolutely not. All parsing, validation, formatting, minification, and tree generation occur strictly inside your web browser using native JavaScript engines. No data is transmitted over the network or stored in external databases.',
    },
    {
      question: 'How does the validator calculate line and column numbers for syntax errors?',
      answer:
        'When JSON.parse encounters invalid syntax, QUBNEXA captures the error offset and maps the character position directly back to input line breaks. This provides exact Line and Column pointers to unclosed quotes, missing commas, or trailing commas.',
    },
    {
      question: 'Does the "Sort Keys" option alter the order of items inside arrays?',
      answer:
        'No. Key sorting operates exclusively on JSON objects (dictionaries). Arrays are sequential lists whose order has semantic meaning, so array item positions remain completely invariant.',
    },
    {
      question: 'What is the difference between Pretty Print and Minify?',
      answer:
        'Pretty Print adds structured indentation (2 spaces, 4 spaces, or tabs) and line breaks to maximize readability for humans. Minify removes all redundant spaces, tabs, and line breaks to minimize payload size for HTTP transmissions.',
    },
    {
      question: 'Can this tool handle large JSON files or complex schemas?',
      answer:
        'Yes. Because QUBNEXA uses native browser JSON serialization, payloads up to tens of megabytes are processed quickly without UI blocking.',
    },
    {
      question: 'How does the Tree Explorer search feature work?',
      answer:
        'The Tree Explorer allows you to search across both object keys and scalar values. As you type into the search bar, branches matching your query highlight automatically and expand so you can find specific properties in deep hierarchies.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="JSON Formatter & Validator — Format, Minify, Tree View & Validate JSON | QUBNEXA"
      seoDescription="Format, minify, and validate JSON online with syntax error detection, collapsible tree view, and key sorting. 100% private and instant in your browser."
      keywords="json formatter, json validator, pretty print json, json minifier, json viewer, json tree view, format json online, validate json, json parser, json lint"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['qr-code-generator', 'word-counter', 'unit-converter', 'password-generator']}
    >
      <JsonFormatter />
    </ToolPageLayout>
  )
}
