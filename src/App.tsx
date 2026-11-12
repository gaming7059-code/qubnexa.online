import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { ThemeProvider } from './context/ThemeContext'
import { LoadingFallback } from './components/common/LoadingFallback'

// Route-level code splitting using React.lazy()
const HomePage = React.lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })))
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
const GSTCalculatorPage = React.lazy(() => import('./pages/tools/GSTCalculatorPage').then((m) => ({ default: m.GSTCalculatorPage })))
const ProfitLossCalculatorPage = React.lazy(() => import('./pages/tools/ProfitLossCalculatorPage').then((m) => ({ default: m.ProfitLossCalculatorPage })))
const SalaryCalculatorPage = React.lazy(() => import('./pages/tools/SalaryCalculatorPage').then((m) => ({ default: m.SalaryCalculatorPage })))
const DateTimeCalculatorPage = React.lazy(() => import('./pages/tools/DateTimeCalculatorPage').then((m) => ({ default: m.DateTimeCalculatorPage })))
const QrCodeGeneratorPage = React.lazy(() => import('./pages/tools/QrCodeGeneratorPage').then((m) => ({ default: m.QrCodeGeneratorPage })))
const PasswordGeneratorPage = React.lazy(() => import('./pages/tools/PasswordGeneratorPage').then((m) => ({ default: m.PasswordGeneratorPage })))
const UnitConverterPage = React.lazy(() => import('./pages/tools/UnitConverterPage').then((m) => ({ default: m.UnitConverterPage })))
const WordCounterPage = React.lazy(() => import('./pages/tools/WordCounterPage').then((m) => ({ default: m.WordCounterPage })))
const TextRepeaterPage = React.lazy(() => import('./pages/tools/TextRepeaterPage').then((m) => ({ default: m.TextRepeaterPage })))
const TextInverterPage = React.lazy(() => import('./pages/tools/TextInverterPage').then((m) => ({ default: m.TextInverterPage })))
const PDFEditorPage = React.lazy(() => import('./pages/tools/PDFEditorPage').then((m) => ({ default: m.PDFEditorPage })))
const TextToSpeechPage = React.lazy(() => import('./pages/tools/TextToSpeechPage').then((m) => ({ default: m.TextToSpeechPage })))
const VideoPromptGeneratorPage = React.lazy(() => import('./pages/tools/VideoPromptGeneratorPage').then((m) => ({ default: m.VideoPromptGeneratorPage })))
const AudioStudioPage = React.lazy(() => import('./pages/tools/AudioStudioPage').then((m) => ({ default: m.AudioStudioPage })))
const AudioTranscriberPage = React.lazy(() => import('./pages/tools/AudioTranscriberPage').then((m) => ({ default: m.AudioTranscriberPage })))
const JpgToPdfPage = React.lazy(() => import('./pages/tools/JpgToPdfPage').then((m) => ({ default: m.JpgToPdfPage })))
const ImageQualityIncreaserPage = React.lazy(() => import('./pages/tools/ImageQualityIncreaserPage').then((m) => ({ default: m.ImageQualityIncreaserPage })))
const VideoDownloaderPage = React.lazy(() => import('./pages/tools/VideoDownloaderPage').then((m) => ({ default: m.VideoDownloaderPage })))
const GamesPage = React.lazy(() => import('./pages/GamesPage').then((m) => ({ default: m.GamesPage })))
const HexDriftPage = React.lazy(() => import('./pages/games/HexDriftPage').then((m) => ({ default: m.HexDriftPage })))

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <HomePage />
                </Suspense>
              }
            />
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
                  <DateTimeCalculatorPage />
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
              path="tools/pdf-editor"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <PDFEditorPage />
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
              path="tools/video-downloader"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <VideoDownloaderPage />
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
