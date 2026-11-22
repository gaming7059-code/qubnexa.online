import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { ThemeProvider } from './context/ThemeContext'
import { LoadingFallback } from './components/common/LoadingFallback'

// Route-level code splitting using React.lazy()
import { HomePage } from './pages/HomePage'
const ToolsPage = React.lazy(() => import('./pages/ToolsPage').then((m) => ({ default: m.ToolsPage })))
const CategoriesPage = React.lazy(() => import('./pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage })))
const CategoryDetailPage = React.lazy(() => import('./pages/CategoryDetailPage').then((m) => ({ default: m.CategoryDetailPage })))
const AboutPage = React.lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const ContactPage = React.lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })))
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })))
const TermsPage = React.lazy(() => import('./pages/TermsPage').then((m) => ({ default: m.TermsPage })))
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

// Specialized Tool & Calculator Pages (Lazy-loaded on demand)
const PercentageCalculatorPage = React.lazy(() => import('./pages/tools/PercentageCalculatorPage').then((m) => ({ default: m.PercentageCalculatorPage })))
const AgeCalculatorPage = React.lazy(() => import('./pages/tools/AgeCalculatorPage').then((m) => ({ default: m.AgeCalculatorPage })))
const DiscountCalculatorPage = React.lazy(() => import('./pages/tools/DiscountCalculatorPage').then((m) => ({ default: m.DiscountCalculatorPage })))
const EMICalculatorPage = React.lazy(() => import('./pages/tools/EMICalculatorPage').then((m) => ({ default: m.EMICalculatorPage })))
const SipCalculatorPage = React.lazy(() => import('./pages/tools/SipCalculatorPage').then((m) => ({ default: m.SipCalculatorPage })))
const GSTCalculatorPage = React.lazy(() => import('./pages/tools/GSTCalculatorPage').then((m) => ({ default: m.GSTCalculatorPage })))
const ProfitLossCalculatorPage = React.lazy(() => import('./pages/tools/ProfitLossCalculatorPage').then((m) => ({ default: m.ProfitLossCalculatorPage })))
const SalaryCalculatorPage = React.lazy(() => import('./pages/tools/SalaryCalculatorPage').then((m) => ({ default: m.SalaryCalculatorPage })))
const DateTimeCalculatorPage = React.lazy(() => import('./pages/tools/DateTimeCalculatorPage').then((m) => ({ default: m.DateTimeCalculatorPage })))
const DateDifferenceCalculatorPage = React.lazy(() => import('./pages/tools/DateDifferenceCalculatorPage').then((m) => ({ default: m.DateDifferenceCalculatorPage })))
const QrCodeGeneratorPage = React.lazy(() => import('./pages/tools/QrCodeGeneratorPage').then((m) => ({ default: m.QrCodeGeneratorPage })))
const PasswordGeneratorPage = React.lazy(() => import('./pages/tools/PasswordGeneratorPage').then((m) => ({ default: m.PasswordGeneratorPage })))
const PasswordCheckerPage = React.lazy(() => import('./pages/tools/PasswordCheckerPage').then((m) => ({ default: m.PasswordCheckerPage })))
const UnitConverterPage = React.lazy(() => import('./pages/tools/UnitConverterPage').then((m) => ({ default: m.UnitConverterPage })))
const WordCounterPage = React.lazy(() => import('./pages/tools/WordCounterPage').then((m) => ({ default: m.WordCounterPage })))
const TextRepeaterPage = React.lazy(() => import('./pages/tools/TextRepeaterPage').then((m) => ({ default: m.TextRepeaterPage })))
const TextInverterPage = React.lazy(() => import('./pages/tools/TextInverterPage').then((m) => ({ default: m.TextInverterPage })))
const FancyFontGeneratorPage = React.lazy(() => import('./pages/tools/FancyFontGeneratorPage').then((m) => ({ default: m.FancyFontGeneratorPage })))
const JsonFormatterPage = React.lazy(() => import('./pages/tools/JsonFormatterPage').then((m) => ({ default: m.JsonFormatterPage })))
const PDFEditorPage = React.lazy(() => import('./pages/tools/PDFEditorPage').then((m) => ({ default: m.PDFEditorPage })))
const PdfTextCleanerPage = React.lazy(() => import('./pages/tools/PdfTextCleanerPage').then((m) => ({ default: m.PdfTextCleanerPage })))
const TextToSpeechPage = React.lazy(() => import('./pages/tools/TextToSpeechPage').then((m) => ({ default: m.TextToSpeechPage })))
const VideoPromptGeneratorPage = React.lazy(() => import('./pages/tools/VideoPromptGeneratorPage').then((m) => ({ default: m.VideoPromptGeneratorPage })))
const AudioStudioPage = React.lazy(() => import('./pages/tools/AudioStudioPage').then((m) => ({ default: m.AudioStudioPage })))
const AudioTranscriberPage = React.lazy(() => import('./pages/tools/AudioTranscriberPage').then((m) => ({ default: m.AudioTranscriberPage })))
const JpgToPdfPage = React.lazy(() => import('./pages/tools/JpgToPdfPage').then((m) => ({ default: m.JpgToPdfPage })))
const ImageQualityIncreaserPage = React.lazy(() => import('./pages/tools/ImageQualityIncreaserPage').then((m) => ({ default: m.ImageQualityIncreaserPage })))
const ImageResizerPage = React.lazy(() => import('./pages/tools/ImageResizerPage').then((m) => ({ default: m.ImageResizerPage })))
const VideoDownloaderPage = React.lazy(() => import('./pages/tools/VideoDownloaderPage').then((m) => ({ default: m.VideoDownloaderPage })))
const YouTubeThumbnailDownloaderPage = React.lazy(() => import('./pages/tools/YouTubeThumbnailDownloaderPage').then((m) => ({ default: m.YouTubeThumbnailDownloaderPage })))
const SocialVideoSafeZonePreviewPage = React.lazy(() => import('./pages/tools/SocialVideoSafeZonePreviewPage').then((m) => ({ default: m.SocialVideoSafeZonePreviewPage })))
const CompetitorPricingTrackerPage = React.lazy(() => import('./pages/tools/CompetitorPricingTrackerPage').then((m) => ({ default: m.CompetitorPricingTrackerPage })))
const WebhookToSheetsPlannerPage = React.lazy(() => import('./pages/tools/WebhookToSheetsPlannerPage').then((m) => ({ default: m.WebhookToSheetsPlannerPage })))
const EcommerceVatImportCalculatorPage = React.lazy(() => import('./pages/tools/EcommerceVatImportCalculatorPage').then((m) => ({ default: m.EcommerceVatImportCalculatorPage })))
const AiPromptInjectionScannerPage = React.lazy(() => import('./pages/tools/AiPromptInjectionScannerPage').then((m) => ({ default: m.AiPromptInjectionScannerPage })))
const PrivacyPolicyGeneratorPage = React.lazy(() => import('./pages/tools/PrivacyPolicyGeneratorPage').then((m) => ({ default: m.PrivacyPolicyGeneratorPage })))
const LocalSeoGridPlannerPage = React.lazy(() => import('./pages/tools/LocalSeoGridPlannerPage').then((m) => ({ default: m.LocalSeoGridPlannerPage })))
const B2bCaseStudyGeneratorPage = React.lazy(() => import('./pages/tools/B2bCaseStudyGeneratorPage').then((m) => ({ default: m.B2bCaseStudyGeneratorPage })))
const PodcastContentRepurposerPage = React.lazy(() => import('./pages/tools/PodcastContentRepurposerPage').then((m) => ({ default: m.PodcastContentRepurposerPage })))
const ImageBackgroundExtenderPage = React.lazy(() => import('./pages/tools/ImageBackgroundExtenderPage').then((m) => ({ default: m.ImageBackgroundExtenderPage })))
const PkpassToPdfPage = React.lazy(() => import('./pages/tools/PkpassToPdfPage').then((m) => ({ default: m.PkpassToPdfPage })))
const SubtitleCleanerPage = React.lazy(() => import('./pages/tools/SubtitleCleanerPage').then((m) => ({ default: m.SubtitleCleanerPage })))
const BulkUtmBuilderPage = React.lazy(() => import('./pages/tools/BulkUtmBuilderPage').then((m) => ({ default: m.BulkUtmBuilderPage })))
const HtmlContentCleanerPage = React.lazy(() => import('./pages/tools/HtmlContentCleanerPage').then((m) => ({ default: m.HtmlContentCleanerPage })))
const GoogleReviewLinkGeneratorPage = React.lazy(() => import('./pages/tools/GoogleReviewLinkGeneratorPage').then((m) => ({ default: m.GoogleReviewLinkGeneratorPage })))
const GamesPage = React.lazy(() => import('./pages/GamesPage').then((m) => ({ default: m.GamesPage })))
const HexDriftPage = React.lazy(() => import('./pages/games/HexDriftPage').then((m) => ({ default: m.HexDriftPage })))
const MemoryMatchPage = React.lazy(() => import('./pages/games/MemoryMatchPage').then((m) => ({ default: m.MemoryMatchPage })))
const RockPaperScissorsPage = React.lazy(() => import('./pages/games/RockPaperScissorsPage').then((m) => ({ default: m.RockPaperScissorsPage })))
const NumberGuessPage = React.lazy(() => import('./pages/games/NumberGuessPage').then((m) => ({ default: m.NumberGuessPage })))
import { AnalyticsTracker } from './components/common/AnalyticsTracker'

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route
              path="tools"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ToolsPage />
                </Suspense>
              }
            />
            <Route
              path="tools/percentage-calculator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <PercentageCalculatorPage />
                </Suspense>
              }
            />
            <Route
              path="tools/age-calculator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AgeCalculatorPage />
                </Suspense>
              }
            />
            <Route
              path="tools/discount-calculator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <DiscountCalculatorPage />
                </Suspense>
              }
            />
            <Route
              path="tools/emi-calculator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <EMICalculatorPage />
                </Suspense>
              }
            />
            <Route
              path="tools/sip-calculator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <SipCalculatorPage />
                </Suspense>
              }
            />
            <Route
              path="tools/gst-calculator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <GSTCalculatorPage />
                </Suspense>
              }
            />
            <Route
              path="tools/profit-loss-calculator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProfitLossCalculatorPage />
                </Suspense>
              }
            />
            <Route path="tools/profit-and-loss-calculator" element={<Navigate to="/tools/profit-loss-calculator" replace />} />
            <Route
              path="tools/salary-calculator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <SalaryCalculatorPage />
                </Suspense>
              }
            />
            <Route
              path="tools/date-time-calculator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <DateTimeCalculatorPage />
                </Suspense>
              }
            />
            <Route
              path="tools/date-difference-calculator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <DateDifferenceCalculatorPage />
                </Suspense>
              }
            />
            <Route path="tools/date-calculator" element={<Navigate to="/tools/date-time-calculator" replace />} />
            <Route
              path="tools/qr-code-generator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <QrCodeGeneratorPage />
                </Suspense>
              }
            />
            <Route
              path="tools/password-generator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <PasswordGeneratorPage />
                </Suspense>
              }
            />
            <Route
              path="tools/password-checker"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <PasswordCheckerPage />
                </Suspense>
              }
            />
            <Route
              path="tools/unit-converter"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <UnitConverterPage />
                </Suspense>
              }
            />
            <Route
              path="tools/word-counter"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <WordCounterPage />
                </Suspense>
              }
            />
            <Route
              path="tools/text-repeater"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <TextRepeaterPage />
                </Suspense>
              }
            />
            <Route
              path="tools/text-inverter"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <TextInverterPage />
                </Suspense>
              }
            />
            <Route
              path="tools/fancy-font-generator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <FancyFontGeneratorPage />
                </Suspense>
              }
            />
            <Route
              path="tools/json-formatter"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <JsonFormatterPage />
                </Suspense>
              }
            />
            <Route
              path="tools/pdf-editor"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <PDFEditorPage />
                </Suspense>
              }
            />
            <Route
              path="tools/pdf-text-cleaner"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <PdfTextCleanerPage />
                </Suspense>
              }
            />
            <Route
              path="tools/text-to-speech"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <TextToSpeechPage />
                </Suspense>
              }
            />
            <Route
              path="tools/video-prompt-generator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <VideoPromptGeneratorPage />
                </Suspense>
              }
            />
            <Route
              path="tools/audio-studio"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AudioStudioPage />
                </Suspense>
              }
            />
            <Route
              path="tools/audio-transcriber"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AudioTranscriberPage />
                </Suspense>
              }
            />
            <Route
              path="tools/jpg-to-pdf"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <JpgToPdfPage />
                </Suspense>
              }
            />
            <Route
              path="tools/image-quality-increaser"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ImageQualityIncreaserPage />
                </Suspense>
              }
            />
            <Route
              path="tools/image-resizer"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ImageResizerPage />
                </Suspense>
              }
            />
            <Route
              path="tools/video-downloader"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <VideoDownloaderPage />
                </Suspense>
              }
            />
            <Route
              path="tools/youtube-thumbnail-downloader"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <YouTubeThumbnailDownloaderPage />
                </Suspense>
              }
            />
            <Route
              path="tools/social-video-safe-zone-preview"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <SocialVideoSafeZonePreviewPage />
                </Suspense>
              }
            />
            <Route
              path="tools/competitor-pricing-tracker"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <CompetitorPricingTrackerPage />
                </Suspense>
              }
            />
            <Route
              path="tools/webhook-to-sheets-planner"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <WebhookToSheetsPlannerPage />
                </Suspense>
              }
            />
            <Route
              path="tools/ecommerce-vat-import-calculator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <EcommerceVatImportCalculatorPage />
                </Suspense>
              }
            />
            <Route
              path="tools/ai-prompt-injection-scanner"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AiPromptInjectionScannerPage />
                </Suspense>
              }
            />
            <Route
              path="tools/privacy-policy-generator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <PrivacyPolicyGeneratorPage />
                </Suspense>
              }
            />
            <Route
              path="tools/local-seo-grid-planner"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <LocalSeoGridPlannerPage />
                </Suspense>
              }
            />
            <Route
              path="tools/b2b-case-study-generator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <B2bCaseStudyGeneratorPage />
                </Suspense>
              }
            />
            <Route
              path="tools/podcast-content-repurposer"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <PodcastContentRepurposerPage />
                </Suspense>
              }
            />
            <Route
              path="tools/image-background-extender"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ImageBackgroundExtenderPage />
                </Suspense>
              }
            />
            <Route
              path="tools/pkpass-to-pdf"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <PkpassToPdfPage />
                </Suspense>
              }
            />
            <Route
              path="tools/subtitle-cleaner"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <SubtitleCleanerPage />
                </Suspense>
              }
            />
            <Route
              path="tools/bulk-utm-builder"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <BulkUtmBuilderPage />
                </Suspense>
              }
            />
            <Route
              path="tools/html-content-cleaner"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <HtmlContentCleanerPage />
                </Suspense>
              }
            />
            <Route
              path="tools/google-review-link-generator"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <GoogleReviewLinkGeneratorPage />
                </Suspense>
              }
            />
            <Route
              path="games"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <GamesPage />
                </Suspense>
              }
            />
            <Route
              path="games/hex-drift"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <HexDriftPage />
                </Suspense>
              }
            />
            <Route
              path="games/memory-match"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <MemoryMatchPage />
                </Suspense>
              }
            />
            <Route
              path="games/rock-paper-scissors"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <RockPaperScissorsPage />
                </Suspense>
              }
            />
            <Route
              path="games/number-guess"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <NumberGuessPage />
                </Suspense>
              }
            />
            <Route
              path="categories"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <CategoriesPage />
                </Suspense>
              }
            />
            <Route
              path="categories/:categorySlug"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <CategoryDetailPage />
                </Suspense>
              }
            />
            <Route
              path="popular"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ToolsPage presetFilter="popular" presetSort="featured" />
                </Suspense>
              }
            />
            <Route
              path="new-tools"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ToolsPage presetFilter="new" presetSort="newest" />
                </Suspense>
              }
            />
            <Route
              path="about"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AboutPage />
                </Suspense>
              }
            />
            <Route
              path="contact"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ContactPage />
                </Suspense>
              }
            />
            <Route
              path="privacy"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <PrivacyPage />
                </Suspense>
              }
            />
            <Route
              path="terms"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <TermsPage />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <NotFoundPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
