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
    'Input your JSON data: Paste raw JSON into the editor, type directly, click "Paste" from clipboard, or click "Sample JSON" to test with a rich multi-type API payload.',
    'Real-time syntax validation: Watch the status badge update live. Valid JSON receives an instant green badge; invalid JSON displays the exact error message with line and column pointers.',
    'Configure indentation & key sorting: Select your preferred indentation (2 Spaces, 4 Spaces, or Tab) and optionally toggle "Sort Keys" to arrange object properties alphabetically.',
    'Format or Minify: Click "Format / Pretty" for clean structured indentation, or "Minify" to strip whitespace and compress into a single-line payload.',
    'Escape or Unescape strings: Use "Escape" to wrap JSON for embedding inside programming strings or shell commands, or "Unescape" to decode serialized JSON strings.',
    'Explore interactive tree & search: Switch between "Editor View" and "Tree Explorer" with real-time key/value search and collapsible node branches.',
    'Review structural metrics & export: Inspect total characters, lines, objects, arrays, keys, max depth, and UTF-8 size, then click "Copy", "Copy Minified", or "Download" (data.json).',
  ]

  const formulas = [
    {
      title: 'RFC 8259 & ECMA-404 Specification Conformance',
      formula: 'JSON-Value = false | true | null | Object | Array | Number | String',
      explanation:
        'Validates against strict JSON interchange specifications. All keys must be double-quoted strings, unquoted trailing commas are rejected, single quotes and comments (// or /* */) are strictly prohibited, and numbers conform to standard decimal notation without leading zeros or hex notation.',
    },
    {
      title: 'Line & Column Syntax Error Localization Algorithm',
      formula: 'Line = \\n count(0, pos) + 1 | Column = pos - lastIndexOf(\\n, pos)',
      explanation:
        'When JSON.parse throws a SyntaxError, the engine captures the character offset (position) and calculates the exact line and column coordinates across V8 and SpiderMonkey error formats, pinpointing missing commas, unclosed brackets, or unquoted identifiers in seconds.',
    },
    {
      title: 'Recursive Alphabetical Object Key Sorting (Array Invariant)',
      formula: 'Sort(Obj) = { sorted(keys(Obj)).map(k => [k, Sort(Obj[k])]) } | Sort(Arr) = Arr.map(Sort)',
      explanation:
        'Recursively sorts dictionary keys alphabetically to produce deterministic, git-diff friendly JSON payloads. Crucially, array element indices are strictly preserved to maintain list order semantics.',
    },
    {
      title: 'Single-Line Whitespace Stripping & Minification Math',
      formula: 'Minified = JSON.stringify(JSON.parse(rawText))',
      explanation:
        'Removes all structural whitespace, tab characters, and carriage returns outside quoted string literals. Reduces network payload weight by 20% to 50% for optimal API transmission throughput.',
    },
    {
      title: 'Hierarchical Tree Traversal & Structural Metrics Algorithm',
      formula: 'Depth = max(depth(node)), Total Keys = sum(Object.keys(node).length)',
      explanation:
        'Recursively traverses the parsed object graph to compute structural statistics: object count, array count, total property keys, maximum nesting depth, and exact UTF-8 byte weight using TextEncoder.',
    },
    {
      title: 'Zero-Telemetry Client-Side Sandbox',
      formula: 'Data Transfer: Browser Local Memory (V8 Engine) → Screen (0 HTTP Calls)',
      explanation:
        'Every format, minify, and validation calculation executes entirely within your browser memory. Sensitive tokens, credentials, and private customer payloads are never transmitted across the network or logged to external servers.',
    },
  ]

  const examples = [
    {
      title: 'REST API Response Formatting (2-Space Indentation)',
      description:
        'Converting an unformatted single-line API response into clean, indented JSON with nested objects.',
      input:
        'Raw: {"status":"success","code":200,"data":{"id":42,"name":"QUBNEXA"}}',
      output:
        '{\\n  "status": "success",\\n  "code": 200,\\n  "data": {\\n    "id": 42,\\n    "name": "QUBNEXA"\\n  }\\n} (8 lines, 2 objects, 5 keys)',
    },
    {
      title: 'Payload Minification for Network Transfer',
      description:
        'Compressing indented JSON by stripping all optional whitespace and line breaks for fast API throughput.',
      input:
        '{\\n  "mode": "production",\\n  "cache": true,\\n  "retries": 3,\\n  "timeoutMs": 5000\\n}',
      output:
        '{"mode":"production","cache":true,"retries":3,"timeoutMs":5000} (Single line, 63 characters, 0 whitespace overhead)',
    },
    {
      title: 'Recursive Object Key Sorting (Deterministic Diffs & Array Invariance)',
      description:
        'Alphabetizing object keys alphabetically while strictly preserving the item sequence inside arrays.',
      input:
        '{"z":1,"a":2,"items":[{"y":10,"b":20},3,2,1],"m":{"c":1,"b":2}}',
      output:
        '{"a":2,"items":[{"b":20,"y":10},3,2,1],"m":{"b":2,"c":1},"z":1} (Keys a, items, m, z sorted; array items 3, 2, 1 order preserved)',
    },
    {
      title: 'Syntax Error Detection with Line & Column Coordinates (Trailing Comma)',
      description:
        'Detecting an illegal trailing comma in an object and extracting exact line and column pointers.',
      input:
        '{\\n  "name": "QUBNEXA",\\n  "version": 2.0,\\n}',
      output:
        'Syntax Error: Line 4, Column 1 (Position 41) — "Expected double-quoted property name in JSON at position 41 (line 4 column 1)"',
    },
  ]

  const faqs = [
    {
      question: 'What is an online JSON formatter and validator, and why is it used?',
      answer:
        'A JSON formatter and validator is a developer tool that validates whether a text string adheres strictly to RFC 8259 JSON standards, formats unreadable one-line payloads into neatly indented readable structures (Pretty Print), and compresses formatted JSON by removing unnecessary whitespace (Minify). Developers and QA engineers use it to debug API responses, inspect nested data structures, and verify payload syntax.',
    },
    {
      question: 'How does the validator pinpoint exact line and column numbers for syntax errors?',
      answer:
        'When JSON.parse encounters invalid syntax (such as missing commas, unquoted keys, or unclosed brackets), QUBNEXA captures the error offset and maps the character position directly back to input line breaks. This provides exact Line and Column pointers to unclosed quotes, missing commas, or trailing commas.',
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
    {
      question: 'How do the "Escape" and "Unescape" features work?',
      answer:
        'The "Escape" button wraps your JSON into a single valid JSON string literal by escaping internal double quotes (\\") and newlines (\\n), making it ready for insertion into cURL commands, shell environment variables, or programming string variables. "Unescape" reverses this process, converting escaped string literals back into raw JSON.',
    },
    {
      question: 'Does the JSON formatter support or strip comments (// or /* */)?',
      answer:
        'No. The official JSON specification (RFC 8259 and ECMA-404) explicitly forbids comments. Native browser JSON parsers reject text containing single-line (//) or multi-line (/* */) comments with a syntax error. QUBNEXA strictly complies with RFC 8259 and does not parse or automatically strip comments. Ensure you remove comments or convert from JSONC/JSON5 before formatting.',
    },
    {
      question: 'Is my JSON data, confidential API payload, or private token sent to any external server?',
      answer:
        'Never. QUBNEXA operates 100% client-side in your local web browser. All parsing, validation, formatting, minification, tree exploration, and file downloads execute exclusively within your device’s JavaScript engine. Zero bytes are transmitted to any remote server or stored in any database.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="JSON Formatter Online — Pretty Print, Minify & Validate | QUBNEXA"
      seoDescription="Format, minify, and validate JSON online with QUBNEXA. Free JSON formatter with line and column syntax error detection, collapsible tree view, and key sorting."
      keywords="json formatter, json validator, pretty print json, json minifier, json viewer, json tree view, format json online, validate json, json parser, json lint, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['text-repeater', 'text-inverter', 'word-counter', 'percentage-calculator', 'unit-converter', 'qr-code-generator']}
    >
      <JsonFormatter />
    </ToolPageLayout>
  )
}
