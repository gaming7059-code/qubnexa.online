import React, { useState, useMemo } from 'react'
import {
  Webhook,
  FileSpreadsheet,
  Copy,
  Check,
  Code2,
  RotateCcw,
  CheckSquare,
  Square,
  Terminal,
} from 'lucide-react'

interface FlattenedField {
  key: string
  sampleValue: string
  type: string
  sheetHeader: string
  selected: boolean
}

const PRESET_PAYLOADS = [
  {
    name: 'Stripe Payment Succeeded',
    json: JSON.stringify(
      {
        id: 'evt_1N4bXYZ987',
        type: 'payment_intent.succeeded',
        created: 1714567890,
        data: {
          object: {
            id: 'pi_3MtwLw2eZvKYlo2C0V8B0V1X',
            amount: 4900,
            currency: 'usd',
            status: 'succeeded',
            customer: {
              email: 'customer@example.com',
              name: 'Jane Doe',
            },
            shipping: {
              address: {
                city: 'San Francisco',
                country: 'US',
                postal_code: '94103',
              },
            },
          },
        },
      },
      null,
      2
    ),
  },
  {
    name: 'Shopify New Order',
    json: JSON.stringify(
      {
        id: 820982911946154500,
        email: 'jon@doe.ca',
        created_at: '2026-04-12T14:30:00-04:00',
        total_price: '199.50',
        currency: 'USD',
        financial_status: 'paid',
        customer: {
          first_name: 'Bob',
          last_name: 'Norman',
          orders_count: 3,
        },
        line_items_count: 2,
      },
      null,
      2
    ),
  },
  {
    name: 'Typeform Form Response',
    json: JSON.stringify(
      {
        event_id: '01HGBXYZ789',
        event_type: 'form_response',
        form_response: {
          form_id: 'contact_form_v2',
          submitted_at: '2026-05-18T10:15:22Z',
          answers: {
            full_name: 'Alice Cooper',
            work_email: 'alice@enterprise.org',
            company_size: '50-200',
            budget: '$10k-$25k',
          },
        },
      },
      null,
      2
    ),
  },
]

// Recursive flattening helper
function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey))
    } else if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object') {
        Object.assign(result, flattenObject(value[0] as Record<string, unknown>, `${newKey}[0]`))
      } else {
        result[newKey] = JSON.stringify(value)
      }
    } else {
      result[newKey] = value
    }
  }

  return result
}

export const WebhookToSheetsPlanner: React.FC = () => {
  const [jsonInput, setJsonInput] = useState(PRESET_PAYLOADS[0].json)
  const [sheetName, setSheetName] = useState('Webhook Leads')
  const [activeTab, setActiveTab] = useState<'mapping' | 'appscript' | 'csv'>('mapping')

  const [fieldOverrides, setFieldOverrides] = useState<
    Record<string, { sheetHeader?: string; selected?: boolean }>
  >({})
  const [copiedScript, setCopiedScript] = useState(false)
  const [copiedHeaders, setCopiedHeaders] = useState(false)

  // Parse and flatten JSON
  const { flattenedFields, parseError } = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonInput)
      const flat = flattenObject(parsed)

      const fields: FlattenedField[] = Object.entries(flat).map(([key, val]) => {
        const valStr = val === null || val === undefined ? '' : String(val)
        const typeStr = typeof val

        // Default header: sanitize dot notation to readable title case
        const defaultHeader = key
          .replace(/\[\d+\]/g, '')
          .split('.')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

        const override = fieldOverrides[key]

        return {
          key,
          sampleValue: valStr,
          type: typeStr,
          sheetHeader: override?.sheetHeader !== undefined ? override.sheetHeader : defaultHeader,
          selected: override?.selected !== undefined ? override.selected : true,
        }
      })

      return { flattenedFields: fields, parseError: null }
    } catch (err: unknown) {
      return {
        flattenedFields: [],
        parseError: (err as Error).message || 'Invalid JSON syntax',
      }
    }
  }, [jsonInput, fieldOverrides])

  // Selected fields only
  const activeFields = useMemo(() => {
    return flattenedFields.filter((f) => f.selected)
  }, [flattenedFields])

  // Google Apps Script Code Generator (Direct Free Webhook Handler)
  const appsScriptCode = useMemo(() => {
    const fieldExtractors = activeFields
      .map((f) => {
        // Safe object navigation helper e.g. json.data?.object?.amount
        const pathSegments = f.key.replace(/\[\d+\]/g, '').split('.')
        const safeAccess = 'payload.' + pathSegments.join('?.')
        return `    row.push(${safeAccess} || ''); // ${f.sheetHeader}`
      })
      .join('\n')

    const headersList = activeFields.map((f) => `"${f.sheetHeader}"`).join(', ')

    return `/**
 * FREE Google Sheets Webhook Receiver
 * Generated by QUBNEXA Webhook-to-Sheets Planner
 * 
 * Instructions:
 * 1. In your Google Sheet, go to Extensions → Apps Script.
 * 2. Paste this entire code and save.
 * 3. Click "Deploy" → "New deployment" → Select "Web app".
 * 4. Set "Execute as": "Me" & "Who has access": "Anyone".
 * 5. Copy the generated Web App URL and paste it into Stripe / Shopify / Typeform webhooks.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("${sheetName}") || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Ensure header row exists
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([${headersList}]);
    }
    
    var payload = JSON.parse(e.postData.contents);
    var row = [];
    
${fieldExtractors}
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", rowAdded: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`
  }, [activeFields, sheetName])

  // CSV Headers and Sample Row
  const csvData = useMemo(() => {
    const headers = activeFields.map((f) => `"${f.sheetHeader.replace(/"/g, '""')}"`).join(',')
    const sampleRow = activeFields.map((f) => `"${f.sampleValue.replace(/"/g, '""')}"`).join(',')
    return `${headers}\n${sampleRow}`
  }, [activeFields])

  // Field update handlers
  const handleToggleSelect = (key: string, current: boolean) => {
    setFieldOverrides((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        selected: !current,
      },
    }))
  }

  const handleHeaderChange = (key: string, newHeader: string) => {
    setFieldOverrides((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        sheetHeader: newHeader,
      },
    }))
  }

  const handleSelectAll = (select: boolean) => {
    const newOverrides: Record<string, { sheetHeader?: string; selected?: boolean }> = {}
    flattenedFields.forEach((f) => {
      newOverrides[f.key] = {
        sheetHeader: f.sheetHeader,
        selected: select,
      }
    })
    setFieldOverrides(newOverrides)
  }

  const copyAppsScript = async () => {
    try {
      await navigator.clipboard.writeText(appsScriptCode)
      setCopiedScript(true)
      setTimeout(() => setCopiedScript(false), 2000)
    } catch {
      // fallback
    }
  }

  const copyCsv = async () => {
    try {
      await navigator.clipboard.writeText(csvData)
      setCopiedHeaders(true)
      setTimeout(() => setCopiedHeaders(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500">
            <Webhook className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Webhook to Google Sheets Data Planner & Script Generator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Flatten JSON payloads, map spreadsheet columns, and generate free Google Apps Script webhooks without paid automation tools.
            </p>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('mapping')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'mapping'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Column Mapping ({activeFields.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('appscript')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'appscript'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Google Apps Script
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('csv')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'csv'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            CSV Headers
          </button>
        </div>
      </div>

      {/* 2. Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-500" />
                Raw Event Data Payload (JSON)
              </label>
              <button
                type="button"
                onClick={() => setJsonInput('{}')}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" /> Clear
              </button>
            </div>

            <textarea
              rows={9}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste raw JSON event payload..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all leading-relaxed"
            />

            {parseError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
                JSON Syntax Error: {parseError}
              </div>
            )}

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 block">
                Load Sample Real-World Webhook:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_PAYLOADS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setJsonInput(preset.json)
                      setFieldOverrides({})
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-slate-700 transition-all font-medium"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sheet Target Settings */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
              Target Google Sheet Tab
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Tab / Worksheet Name
              </label>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                placeholder="e.g. Webhook Leads, Transactions"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Tab Content (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeTab === 'mapping' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Detected JSON Keys & Column Mapping ({flattenedFields.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Rename columns or uncheck fields you do not want in your spreadsheet.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSelectAll(true)}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <button
                    type="button"
                    onClick={() => handleSelectAll(false)}
                    className="text-slate-400 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Mapping Table */}
              <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                {flattenedFields.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-xl">
                    No valid JSON detected. Paste a payload on the left to map columns.
                  </div>
                ) : (
                  flattenedFields.map((field) => (
                    <div
                      key={field.key}
                      className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                        field.selected
                          ? 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40'
                          : 'border-slate-100 dark:border-slate-900 bg-slate-100/30 dark:bg-slate-950/20 opacity-60'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleSelect(field.key, field.selected)}
                        className="mt-1"
                      >
                        {field.selected ? (
                          <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-400" />
                        )}
                      </button>

                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {field.key}
                          </span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {field.type}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400 truncate">
                          Sample: <span className="font-mono text-slate-600 dark:text-slate-300">{field.sampleValue || '(empty)'}</span>
                        </div>

                        <div className="pt-1">
                          <input
                            type="text"
                            value={field.sheetHeader}
                            onChange={(e) => handleHeaderChange(field.key, e.target.value)}
                            placeholder="Spreadsheet Column Header"
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'appscript' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-emerald-500" />
                    Custom Google Apps Script Webhook Handler
                  </h3>
                  <p className="text-xs text-slate-400">
                    Zero-cost webhook listener. Runs natively inside your Google Sheet.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copyAppsScript}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  {copiedScript ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedScript ? 'Script Copied' : 'Copy Apps Script'}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200 max-h-[580px] overflow-y-auto whitespace-pre-wrap select-all">
                {appsScriptCode}
              </div>
            </div>
          )}

          {activeTab === 'csv' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    CSV Header & Sample Data Row
                  </h3>
                  <p className="text-xs text-slate-400">
                    Paste directly into Row 1 of your Google Sheet to create headers.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copyCsv}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  {copiedHeaders ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedHeaders ? 'Headers Copied' : 'Copy CSV'}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 max-h-[580px] overflow-y-auto whitespace-pre-wrap select-all">
                {csvData}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WebhookToSheetsPlanner
