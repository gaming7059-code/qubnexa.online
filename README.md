# QUBNEXA

> **Explore. Create. Simplify.** — Your All-in-One Online Tools Platform.

All-in-one privacy-first platform of online calculators, unit converters, QR & security utilities, PDF studio, audio & voice tools, video utilities, image enhancers, AI tools, text writing utilities, and interactive browser games built for creators, students, developers, and professionals worldwide.

## 🚀 Features & Tools

- **Financial Calculators**: SIP Calculator, EMI Calculator, GST Calculator, Salary & Take-Home Calculator, Profit & Loss Calculator, Discount Calculator
- **Math & Date Calculators**: Percentage Calculator, Age Calculator, Date Difference Calculator
- **Utilities & Productivity**: Unit Converter, Word & Character Counter, Fancy Font Generator, JSON Formatter & Validator, Password Generator, Password Strength Checker, QR Code Generator, Text Repeater, Text Inverter
- **Document & PDF Studio**: In-browser PDF Editor (annotation, redaction, watermark, split & merge), PDF Text Cleaner, JPG to PDF Converter
- **Media & Image Utilities**: YouTube Thumbnail Downloader, Image Resizer, Image Quality Increaser & Enhancer, Universal Video Downloader
- **Audio & Speech AI**:
  - Advanced Hybrid Text-to-Speech Engine (browser voices + local Neural Edge-TTS companion)
  - Audio Studio & Voice Recorder
  - Audio Transcriber
- **Video Prompt Generator**: AI prompt crafting for video generation models
- **Arcade Games**: Hex Drift — Neon Void Runner (canvas arcade experience with boss battles, responsive touch/keyboard controls, high scores)

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4 + Lucide React icons
- **Linting**: Oxlint
- **Routing**: React Router 7
- **PDF Engine**: PDF.js + PDF-Lib
- **Neural TTS Companion**: FastAPI + Edge-TTS (optional Python local server under `/server`)

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- npm (or pnpm)

### Installation

```bash
# Install exact dependencies
npm ci
```

### Development Server

```bash
npm run dev
```

The application runs locally at `http://localhost:5173/`.

### Linting & Code Quality

```bash
npm run lint
```

### Production Build

```bash
npm run build
```

The compiled static assets will be output to the `dist/` directory, ready to be deployed to any modern static hosting service or CDN.

## 🐍 Optional Local Neural TTS Server

For high-fidelity local neural voice synthesis, start the companion server:

```bash
cd server
pip install -r requirements.txt
python tts_server.py
```
*(Runs on `http://127.0.0.1:8000`)*

## 📄 License

MIT License.
