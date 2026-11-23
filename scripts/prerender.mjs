import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { createServer } from 'vite';

/**
 * Prerender configuration for QUBNEXA routes.
 * Covers 100% of canonical URLs in public/sitemap.xml (69 total routes).
 */
const PRERENDER_ROUTES = [
  // 1. Homepage (P0 Core Entrypoint)
  { path: '/', modulePath: '/src/pages/HomePage.tsx', exportName: 'HomePage', priority: 'P0' },

  // 2. 5 Highest-Priority Indexing Recovery Tool Routes (P0)
  { path: '/tools/jpg-to-pdf', modulePath: '/src/pages/tools/JpgToPdfPage.tsx', exportName: 'JpgToPdfPage', priority: 'P0' },
  { path: '/tools/audio-transcriber', modulePath: '/src/pages/tools/AudioTranscriberPage.tsx', exportName: 'AudioTranscriberPage', priority: 'P0' },
  { path: '/tools/image-quality-increaser', modulePath: '/src/pages/tools/ImageQualityIncreaserPage.tsx', exportName: 'ImageQualityIncreaserPage', priority: 'P0' },
  { path: '/tools/pdf-text-cleaner', modulePath: '/src/pages/tools/PdfTextCleanerPage.tsx', exportName: 'PdfTextCleanerPage', priority: 'P0' },
  { path: '/tools/text-to-speech', modulePath: '/src/pages/tools/TextToSpeechPage.tsx', exportName: 'TextToSpeechPage', priority: 'P0' },

  // 3. Key GSC "Crawled - currently not indexed" Tool Routes (P1)
  { path: '/tools/youtube-thumbnail-downloader', modulePath: '/src/pages/tools/YouTubeThumbnailDownloaderPage.tsx', exportName: 'YouTubeThumbnailDownloaderPage', priority: 'P1' },
  { path: '/tools/audio-studio', modulePath: '/src/pages/tools/AudioStudioPage.tsx', exportName: 'AudioStudioPage', priority: 'P1' },
  { path: '/tools/fancy-font-generator', modulePath: '/src/pages/tools/FancyFontGeneratorPage.tsx', exportName: 'FancyFontGeneratorPage', priority: 'P1' },
  { path: '/tools/sip-calculator', modulePath: '/src/pages/tools/SipCalculatorPage.tsx', exportName: 'SipCalculatorPage', priority: 'P1' },
  { path: '/tools/date-difference-calculator', modulePath: '/src/pages/tools/DateDifferenceCalculatorPage.tsx', exportName: 'DateDifferenceCalculatorPage', priority: 'P1' },
  { path: '/tools/password-generator', modulePath: '/src/pages/tools/PasswordGeneratorPage.tsx', exportName: 'PasswordGeneratorPage', priority: 'P1' },
  { path: '/tools/json-formatter', modulePath: '/src/pages/tools/JsonFormatterPage.tsx', exportName: 'JsonFormatterPage', priority: 'P1' },
  { path: '/tools/image-resizer', modulePath: '/src/pages/tools/ImageResizerPage.tsx', exportName: 'ImageResizerPage', priority: 'P1' },
  { path: '/tools/qr-code-generator', modulePath: '/src/pages/tools/QrCodeGeneratorPage.tsx', exportName: 'QrCodeGeneratorPage', priority: 'P1' },
  { path: '/tools/video-downloader', modulePath: '/src/pages/tools/VideoDownloaderPage.tsx', exportName: 'VideoDownloaderPage', priority: 'P1' },

  // 4. Additional High-Value Productivity & Calculator Tools (P1)
  { path: '/tools/percentage-calculator', modulePath: '/src/pages/tools/PercentageCalculatorPage.tsx', exportName: 'PercentageCalculatorPage', priority: 'P1' },
  { path: '/tools/age-calculator', modulePath: '/src/pages/tools/AgeCalculatorPage.tsx', exportName: 'AgeCalculatorPage', priority: 'P1' },
  { path: '/tools/emi-calculator', modulePath: '/src/pages/tools/EMICalculatorPage.tsx', exportName: 'EMICalculatorPage', priority: 'P1' },
  { path: '/tools/gst-calculator', modulePath: '/src/pages/tools/GSTCalculatorPage.tsx', exportName: 'GSTCalculatorPage', priority: 'P1' },
  { path: '/tools/salary-calculator', modulePath: '/src/pages/tools/SalaryCalculatorPage.tsx', exportName: 'SalaryCalculatorPage', priority: 'P1' },
  { path: '/tools/discount-calculator', modulePath: '/src/pages/tools/DiscountCalculatorPage.tsx', exportName: 'DiscountCalculatorPage', priority: 'P1' },
  { path: '/tools/date-time-calculator', modulePath: '/src/pages/tools/DateTimeCalculatorPage.tsx', exportName: 'DateTimeCalculatorPage', priority: 'P1' },
  { path: '/tools/word-counter', modulePath: '/src/pages/tools/WordCounterPage.tsx', exportName: 'WordCounterPage', priority: 'P1' },
  { path: '/tools/text-repeater', modulePath: '/src/pages/tools/TextRepeaterPage.tsx', exportName: 'TextRepeaterPage', priority: 'P1' },
  { path: '/tools/text-inverter', modulePath: '/src/pages/tools/TextInverterPage.tsx', exportName: 'TextInverterPage', priority: 'P1' },
  { path: '/tools/unit-converter', modulePath: '/src/pages/tools/UnitConverterPage.tsx', exportName: 'UnitConverterPage', priority: 'P1' },
  { path: '/tools/password-checker', modulePath: '/src/pages/tools/PasswordCheckerPage.tsx', exportName: 'PasswordCheckerPage', priority: 'P1' },
  { path: '/tools/pdf-editor', modulePath: '/src/pages/tools/PDFEditorPage.tsx', exportName: 'PDFEditorPage', priority: 'P1' },
  { path: '/tools/social-video-safe-zone-preview', modulePath: '/src/pages/tools/SocialVideoSafeZonePreviewPage.tsx', exportName: 'SocialVideoSafeZonePreviewPage', priority: 'P1' },
  { path: '/tools/video-prompt-generator', modulePath: '/src/pages/tools/VideoPromptGeneratorPage.tsx', exportName: 'VideoPromptGeneratorPage', priority: 'P1' },
  { path: '/tools/profit-loss-calculator', modulePath: '/src/pages/tools/ProfitLossCalculatorPage.tsx', exportName: 'ProfitLossCalculatorPage', priority: 'P1' },

  // 5. New Business & Productivity Suite Tools (P2)
  { path: '/tools/competitor-pricing-tracker', modulePath: '/src/pages/tools/CompetitorPricingTrackerPage.tsx', exportName: 'CompetitorPricingTrackerPage', priority: 'P2' },
  { path: '/tools/webhook-to-sheets-planner', modulePath: '/src/pages/tools/WebhookToSheetsPlannerPage.tsx', exportName: 'WebhookToSheetsPlannerPage', priority: 'P2' },
  { path: '/tools/ecommerce-vat-import-calculator', modulePath: '/src/pages/tools/EcommerceVatImportCalculatorPage.tsx', exportName: 'EcommerceVatImportCalculatorPage', priority: 'P2' },
  { path: '/tools/ai-prompt-injection-scanner', modulePath: '/src/pages/tools/AiPromptInjectionScannerPage.tsx', exportName: 'AiPromptInjectionScannerPage', priority: 'P2' },
  { path: '/tools/privacy-policy-generator', modulePath: '/src/pages/tools/PrivacyPolicyGeneratorPage.tsx', exportName: 'PrivacyPolicyGeneratorPage', priority: 'P2' },
  { path: '/tools/local-seo-grid-planner', modulePath: '/src/pages/tools/LocalSeoGridPlannerPage.tsx', exportName: 'LocalSeoGridPlannerPage', priority: 'P2' },
  { path: '/tools/b2b-case-study-generator', modulePath: '/src/pages/tools/B2bCaseStudyGeneratorPage.tsx', exportName: 'B2bCaseStudyGeneratorPage', priority: 'P2' },
  { path: '/tools/podcast-content-repurposer', modulePath: '/src/pages/tools/PodcastContentRepurposerPage.tsx', exportName: 'PodcastContentRepurposerPage', priority: 'P2' },
  { path: '/tools/image-background-extender', modulePath: '/src/pages/tools/ImageBackgroundExtenderPage.tsx', exportName: 'ImageBackgroundExtenderPage', priority: 'P2' },
  { path: '/tools/pkpass-to-pdf', modulePath: '/src/pages/tools/PkpassToPdfPage.tsx', exportName: 'PkpassToPdfPage', priority: 'P2' },
  { path: '/tools/subtitle-cleaner', modulePath: '/src/pages/tools/SubtitleCleanerPage.tsx', exportName: 'SubtitleCleanerPage', priority: 'P2' },
  { path: '/tools/bulk-utm-builder', modulePath: '/src/pages/tools/BulkUtmBuilderPage.tsx', exportName: 'BulkUtmBuilderPage', priority: 'P2' },
  { path: '/tools/html-content-cleaner', modulePath: '/src/pages/tools/HtmlContentCleanerPage.tsx', exportName: 'HtmlContentCleanerPage', priority: 'P2' },
  { path: '/tools/google-review-link-generator', modulePath: '/src/pages/tools/GoogleReviewLinkGeneratorPage.tsx', exportName: 'GoogleReviewLinkGeneratorPage', priority: 'P2' },

  // 6. Directory and Informational Hubs (P1-P3)
  { path: '/tools', modulePath: '/src/pages/ToolsPage.tsx', exportName: 'ToolsPage', priority: 'P1' },
  { path: '/popular', modulePath: '/src/pages/ToolsPage.tsx', exportName: 'ToolsPage', priority: 'P1' },
  { path: '/new-tools', modulePath: '/src/pages/ToolsPage.tsx', exportName: 'ToolsPage', priority: 'P1' },
  { path: '/categories', modulePath: '/src/pages/CategoriesPage.tsx', exportName: 'CategoriesPage', priority: 'P1' },
  { path: '/about', modulePath: '/src/pages/AboutPage.tsx', exportName: 'AboutPage', priority: 'P2' },
  { path: '/contact', modulePath: '/src/pages/ContactPage.tsx', exportName: 'ContactPage', priority: 'P3' },
  { path: '/privacy', modulePath: '/src/pages/PrivacyPage.tsx', exportName: 'PrivacyPage', priority: 'P3' },
  { path: '/terms', modulePath: '/src/pages/TermsPage.tsx', exportName: 'TermsPage', priority: 'P3' },
  { path: '/games', modulePath: '/src/pages/GamesPage.tsx', exportName: 'GamesPage', priority: 'P2' },

  // 7. Individual Browser Games (P2)
  { path: '/games/hex-drift', modulePath: '/src/pages/games/HexDriftPage.tsx', exportName: 'HexDriftPage', priority: 'P2' },
  { path: '/games/memory-match', modulePath: '/src/pages/games/MemoryMatchPage.tsx', exportName: 'MemoryMatchPage', priority: 'P2' },
  { path: '/games/rock-paper-scissors', modulePath: '/src/pages/games/RockPaperScissorsPage.tsx', exportName: 'RockPaperScissorsPage', priority: 'P2' },
  { path: '/games/number-guess', modulePath: '/src/pages/games/NumberGuessPage.tsx', exportName: 'NumberGuessPage', priority: 'P2' },

  // 8. Category Detail Hubs (P2)
  { path: '/categories/pdf-documents', modulePath: '/src/pages/CategoryDetailPage.tsx', exportName: 'CategoryDetailPage', priority: 'P2' },
  { path: '/categories/calculators', modulePath: '/src/pages/CategoryDetailPage.tsx', exportName: 'CategoryDetailPage', priority: 'P2' },
  { path: '/categories/utilities', modulePath: '/src/pages/CategoryDetailPage.tsx', exportName: 'CategoryDetailPage', priority: 'P2' },
  { path: '/categories/audio-tools', modulePath: '/src/pages/CategoryDetailPage.tsx', exportName: 'CategoryDetailPage', priority: 'P2' },
  { path: '/categories/video-tools', modulePath: '/src/pages/CategoryDetailPage.tsx', exportName: 'CategoryDetailPage', priority: 'P2' },
  { path: '/categories/image-tools', modulePath: '/src/pages/CategoryDetailPage.tsx', exportName: 'CategoryDetailPage', priority: 'P2' },
  { path: '/categories/ai-tools', modulePath: '/src/pages/CategoryDetailPage.tsx', exportName: 'CategoryDetailPage', priority: 'P2' },
  { path: '/categories/date-time', modulePath: '/src/pages/CategoryDetailPage.tsx', exportName: 'CategoryDetailPage', priority: 'P2' },
  { path: '/categories/text-writing', modulePath: '/src/pages/CategoryDetailPage.tsx', exportName: 'CategoryDetailPage', priority: 'P2' },
  { path: '/categories/games', modulePath: '/src/pages/CategoryDetailPage.tsx', exportName: 'CategoryDetailPage', priority: 'P2' },
];

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function main() {
  console.log('===========================================================');
  console.log('QUBNEXA Build-Time Static Prerendering (SSG Engine)');
  console.log(`Starting prerender process for ${PRERENDER_ROUTES.length} routes...`);
  console.log('===========================================================');

  const templatePath = path.resolve(process.cwd(), 'dist/index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error('dist/index.html was not found. Please run "vite build" before prerendering.');
  }
  const baseHtml = fs.readFileSync(templatePath, 'utf8');

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const summary = [];

  try {
    const { MainLayout } = await vite.ssrLoadModule('/src/layouts/MainLayout.tsx');
    const { ThemeProvider } = await vite.ssrLoadModule('/src/context/ThemeContext.tsx');
    const { getFullUrl, getSsrMetadata, clearSsrMetadata } = await vite.ssrLoadModule('/src/utils/seo.ts');

    for (const route of PRERENDER_ROUTES) {
      try {
        clearSsrMetadata();

        const pageMod = await vite.ssrLoadModule(route.modulePath);
        const Component = pageMod[route.exportName];
        if (!Component) {
          throw new Error(`Export "${route.exportName}" not found in module "${route.modulePath}"`);
        }

        const isRoot = route.path === '/';
        const isCategoryDetail = route.path.startsWith('/categories/') && route.path !== '/categories';
        const routePathPattern = isCategoryDetail ? 'categories/:categorySlug' : route.path.replace(/^\//, '');

        const bodyHtml = renderToString(
          React.createElement(ThemeProvider, null,
            React.createElement(MemoryRouter, { initialEntries: [route.path] },
              React.createElement(Routes, null,
                React.createElement(Route, { path: '/', element: React.createElement(MainLayout) },
                  isRoot
                    ? React.createElement(Route, { index: true, element: React.createElement(Component) })
                    : React.createElement(Route, {
                        path: routePathPattern,
                        element: React.createElement(Component),
                      })
                )
              )
            )
          )
        );

        const meta = getSsrMetadata() || {};
        const canonicalUrl = getFullUrl(route.path);

        let finalHtml = baseHtml;

        // 1. Inject Title
        if (meta.title) {
          finalHtml = finalHtml.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
        }

        // 2. Inject Meta Description
        if (meta.description) {
          finalHtml = finalHtml.replace(
            /<meta name="description" content=".*?" \/>/,
            `<meta name="description" content="${escapeAttr(meta.description)}" />`
          );
        }

        // 3. Inject Keywords
        if (meta.keywords) {
          finalHtml = finalHtml.replace(
            /<meta name="keywords" content=".*?" \/>/,
            `<meta name="keywords" content="${escapeAttr(meta.keywords)}" />`
          );
        }

        // 4. Inject Canonical Tag
        if (!finalHtml.includes('rel="canonical"')) {
          finalHtml = finalHtml.replace(
            '</head>',
            `    <link rel="canonical" href="${canonicalUrl}" />\n  </head>`
          );
        } else {
          finalHtml = finalHtml.replace(
            /<link rel="canonical" href=".*?" \/>/,
            `<link rel="canonical" href="${canonicalUrl}" />`
          );
        }

        // 5. Inject Open Graph Tags
        if (meta.title) {
          finalHtml = finalHtml.replace(
            /<meta property="og:title" content=".*?" \/>/,
            `<meta property="og:title" content="${escapeAttr(meta.title)}" />`
          );
        }
        if (meta.description) {
          finalHtml = finalHtml.replace(
            /<meta property="og:description" content=".*?" \/>/,
            `<meta property="og:description" content="${escapeAttr(meta.description)}" />`
          );
        }
        finalHtml = finalHtml.replace(
          /<meta property="og:url" content=".*?" \/>/,
          `<meta property="og:url" content="${canonicalUrl}" />`
        );

        // 6. Inject Twitter Cards
        if (meta.title) {
          finalHtml = finalHtml.replace(
            /<meta name="twitter:title" content=".*?" \/>/,
            `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`
          );
        }
        if (meta.description) {
          finalHtml = finalHtml.replace(
            /<meta name="twitter:description" content=".*?" \/>/,
            `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`
          );
        }

        // 7. Inject JSON-LD Structured Data Schema
        if (meta.schema) {
          let schemaContent = '';
          if (Array.isArray(meta.schema)) {
            const validItems = meta.schema.filter(Boolean);
            if (validItems.length === 1) {
              schemaContent = JSON.stringify(validItems[0]);
            } else if (validItems.length > 1) {
              schemaContent = JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': validItems.map((item) => {
                  const { ['@context']: _, ...rest } = item;
                  return rest;
                }),
              });
            }
          } else {
            schemaContent = JSON.stringify(meta.schema);
          }

          if (schemaContent) {
            finalHtml = finalHtml.replace(
              '</head>',
              `    <script type="application/ld+json" id="structured-data">${schemaContent}</script>\n  </head>`
            );
          }
        }

        // 8. Inject Prerendered React DOM into root container
        finalHtml = finalHtml.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

        // 9. Write to dist directory
        const outDir = isRoot
          ? path.join(process.cwd(), 'dist')
          : path.join(process.cwd(), 'dist', ...route.path.split('/').filter(Boolean));
        fs.mkdirSync(outDir, { recursive: true });
        const outFile = path.join(outDir, 'index.html');
        fs.writeFileSync(outFile, finalHtml, 'utf8');

        // Estimate word count of visible body
        const strippedBody = bodyHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const wordCount = strippedBody.split(' ').filter(Boolean).length;

        summary.push({
          Route: route.path,
          Priority: route.priority,
          Size: `${(finalHtml.length / 1024).toFixed(1)} KB`,
          Words: wordCount,
          Canonical: canonicalUrl,
          Status: 'SUCCESS',
        });
      } catch (routeErr) {
        console.error(`Error prerendering ${route.path}:`, routeErr.message);
        summary.push({
          Route: route.path,
          Priority: route.priority,
          Size: '0 KB',
          Words: 0,
          Canonical: 'FAILED',
          Status: `FAILED: ${routeErr.message}`,
        });
      }
    }

    console.log('\nPrerendering complete! Summary:');
    console.table(summary);

    const failures = summary.filter((s) => s.Status !== 'SUCCESS');
    if (failures.length > 0) {
      console.warn(`Warning: ${failures.length} route(s) failed during prerendering.`);
      process.exit(1);
    } else {
      console.log(`\nAll ${summary.length} routes prerendered with 100% success!`);
    }
  } finally {
    await vite.close();
  }
}

main().catch((err) => {
  console.error('Fatal prerender error:', err);
  process.exit(1);
});
