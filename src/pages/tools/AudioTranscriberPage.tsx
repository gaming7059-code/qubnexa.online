import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { AudioTranscriber } from '../../tools/AudioTranscriber/AudioTranscriber'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const AudioTranscriberPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'audio-transcriber') || {
    id: 'audio-transcriber',
    name: 'Audio & Speech Transcriber',
    slug: 'audio-transcriber',
    route: '/tools/audio-transcriber',
    path: '/tools/audio-transcriber',
    description:
      'Transcribe speech to text in real time with microphone dictation, slow down audio files for easy manual transcription, and export TXT or SRT subtitles.',
    primaryCategory: 'audio-tools',
    secondaryCategories: ['ai-tools', 'text-writing'],
    categoryId: 'audio-tools',
    categoryIds: ['audio-tools', 'ai-tools', 'text-writing'],
    categoryName: 'Voice & Audio',
    icon: 'Mic',
    status: 'live',
    releaseOrder: 20,
    createdAt: '2026-02-14',
    isPopular: true,
    isFunctional: true,
    badge: 'Live Voice',
    tags: [
      'speech to text',
      'audio transcriber',
      'voice dictation',
      'transcribe audio online',
      'hindi speech to text',
      'srt subtitle generator',
      'voice notes',
    ],
    keywords: [
      'speech to text free',
      'audio transcriber online',
      'voice dictation hindi',
      'bengali speech to text',
      'srt subtitle generator',
      'transcribe voice to text',
      'creator tools',
    ],
  }

  const howToUseSteps = [
    'Select Dictation Language: Choose your spoken dialect from the dropdown: English (India, US, UK), Hindi (हिंदी), Bengali (বাংলা), or Urdu (اردو).',
    'Grant Microphone Permission & Start Dictating: Click the circular microphone button and allow browser microphone access when prompted. Speak naturally into your device microphone.',
    'Real-Time Continuous Recognition: Watch spoken phrases convert to editable text in real time using the browser\'s native Web Speech Recognition engine.',
    'Upload Reference Audio for Manual Transcription: Click "Upload Audio File" to load any audio file (.mp3, .wav, .m4a, .ogg) into the client-side variable-speed player.',
    'Adjust Playback Speed & Insert Timestamps: Slow audio down to 0.5× or 0.75× speed, and click "Insert Timestamp" to add [MM:SS] markers directly into your working draft.',
    'Edit & Format Text: Refine your transcription, add headings, correct punctuation, and track word and character counts in real time.',
    'Export Plain Text, SRT Subtitles, or Send to TTS: Click "Download .TXT" for a plain text document, "Download .SRT Subtitles" to export sequential 4-second estimated pacing blocks (ready for timing adjustment in your video editor), or "Send to Text to Speech Tool" to re-synthesize audio.',
  ]

  const formulas = [
    {
      title: 'HTML5 Web Speech Recognition Engine',
      formula: 'window.SpeechRecognition || window.webkitSpeechRecognition → { continuous: true, interimResults: true, lang: BCP47 }',
      explanation:
        'Captures acoustic audio input directly through the browser speech recognition interface, receiving interim and final transcript tokens in real time without custom recording plugins.',
    },
    {
      title: 'SubRip Subtitle (.SRT) Time Sequencing Matrix',
      formula: 'Block[i] = Index[i] + formatTime(4 × (i − 1)) → formatTime(4 × i) + Text[i]',
      explanation:
        'Converts line-separated transcription paragraphs into sequential estimated 4-second pacing blocks (stripping inline timestamp tags). These provide an initial structured subtitle template rather than automatically synchronized speech timing, and can be retimed in your video editor.',
    },
    {
      title: 'Variable-Speed Pitch-Preserving Playback Rate',
      formula: 'HTMLAudioElement.playbackRate ∈ {0.5, 0.75, 1.0, 1.25}',
      explanation:
        'Adjusts audio playback frequency using browser-native pitch-preserving time-stretching, allowing slow-motion listening for difficult audio passages without altering voice pitch.',
    },
    {
      title: 'Client-Side Timestamp Interpolation',
      formula: 'Timestamp = [ ⌊t / 60⌋ : ⌊t mod 60⌋ ] (from HTMLAudioElement.currentTime)',
      explanation:
        'Reads current audio playback position in seconds, formats it as two-digit zero-padded [MM:SS], and appends it to the transcript editor for structured timestamped notes.',
    },
    {
      title: 'In-Memory Reference Audio Object URL Lifecycle',
      formula: 'File → URL.createObjectURL(File) → Audio.src → URL.revokeObjectURL(url)',
      explanation:
        'Loads local audio files entirely within browser memory using temporary Object URLs without uploading audio binaries to remote QUBNEXA servers.',
    },
    {
      title: 'Browser Speech Recognition Privacy & Architecture',
      formula: 'Recognition Architecture: Client Web Speech API → Browser / OS Engine (QUBNEXA: 0 Audio Calls)',
      explanation:
        'QUBNEXA operates zero intermediate audio processing or recording servers and never receives your audio or transcripts. Live dictation relies on your browser\'s native Web Speech API, whose processing and network behavior depend on your browser, operating system, and configured recognition engine (which may utilize local speech models or the browser vendor\'s recognition service). Locally loaded reference audio files remain 100% in browser memory.',
    },
  ]

  const examples = [
    {
      title: 'Live Multilingual Voice Dictation',
      description: 'Dictate blog drafts, articles, or emails in Hindi, Bengali, Urdu, or English using your smartphone or headset microphone.',
      input: 'Spoken Hindi or English audio captured live via microphone',
      output: 'Accurately transcribed text paragraphs ready to copy to clipboard',
    },
    {
      title: 'YouTube & Social Media Video Subtitles',
      description: 'Transcribe video voiceover lines and export a baseline .srt subtitle template with sequential estimated intervals for fine-tuning in video editing software.',
      input: 'Script voiceover lines dictated into the transcription editor',
      output: 'Formatted SubRip (.SRT) file with sequential estimated 4-second caption blocks ready for timing adjustments in Premiere Pro, DaVinci Resolve, or CapCut.',
    },
    {
      title: 'Slow-Speed Lecture & Meeting Annotation',
      description: 'Upload recorded lectures or Zoom meetings, slow playback to 0.75× speed, and insert [MM:SS] timestamps for study notes.',
      input: 'Recorded 45-minute audio lecture file loaded into slow-down player',
      output: 'Timestamped study notes with [12:34] bookmarks at key topic transitions',
    },
    {
      title: 'Voice-to-Voice Script Iteration',
      description: 'Dictate speech into text, edit phrasing, and click "Send to Text to Speech Tool" to re-generate neural synthetic voiceovers.',
      input: 'Spoken voice draft dictated into the transcript workbench',
      output: 'Clean text transferred into Text to Speech converter for neural voice synthesis',
    },
  ]

  const faqs = [
    {
      question: 'Which languages and dialects are supported for live speech dictation?',
      answer:
        'The dictation engine supports English (India en-IN, United States en-US, United Kingdom en-GB), Hindi (हिंदी hi-IN), Bengali (বাংলা bn-IN), and Urdu (اردو ur-PK). Recognition accuracy depends on your browser vendor\'s speech models and accent adaptation.',
    },
    {
      question: 'Does uploading an audio file automatically transcribe it into text?',
      answer:
        'No. The "Upload Audio File" feature provides a slow-down reference player (0.5×, 0.75×, 1.0×, 1.25×) and one-click timestamp insertion to assist you in manual transcription. Automated speech-to-text is performed via live microphone dictation using the Web Speech API.',
    },
    {
      question: 'How does microphone dictation work and which browsers are supported?',
      answer:
        'Live dictation uses the browser\'s native Web Speech Recognition API (SpeechRecognition / webkitSpeechRecognition). It is fully supported in Chromium-based browsers (Google Chrome, Microsoft Edge, Brave, Opera) and Safari on iOS/macOS. Mozilla Firefox does not currently support the Web Speech Recognition API by default.',
    },
    {
      question: 'Is my voice audio uploaded to QUBNEXA servers?',
      answer:
        'QUBNEXA operates zero intermediate speech-processing servers and never directly receives, records, stores, or logs your audio or transcripts. Live speech recognition is powered by the browser\'s native Web Speech API, where speech processing and network behavior depend on your specific browser, operating system, and configured recognition service (which may process speech via on-device speech packs or route requests through the browser vendor\'s service). In contrast, reference audio files uploaded for playback remain entirely local within your browser session and are never transmitted.',
    },
    {
      question: 'How do I enable microphone permissions if blocked?',
      answer:
        'Click the lock or site settings icon in your browser\'s address bar, find "Microphone", set it to "Allow", and reload the page. Ensure no other application has locked your microphone exclusively.',
    },
    {
      question: 'How are .SRT subtitles generated and are they automatically synchronized?',
      answer:
        'The tool splits your transcript by line breaks and assigns each line a sequential estimated 4-second interval (e.g. 00:00:00,000 --> 00:00:04,000, then 00:00:04,000 --> 00:00:08,000), while stripping any manual [MM:SS] timestamp markers. These fixed intervals provide a structured baseline subtitle file for video editors (such as Premiere Pro, DaVinci Resolve, or YouTube Studio), but they are estimated pacing intervals rather than automatically synchronized audio-speech alignment. You can easily adjust final timing markers in your video editor.',
    },
    {
      question: 'Can I send my transcription directly to other QUBNEXA tools?',
      answer:
        'Yes. Click the "Send to Text to Speech Tool" button to transfer your transcript directly into QUBNEXA\'s Text to Speech Converter to preview and synthesize neural audio.',
    },
    {
      question: 'Does this tool work on mobile phones and tablets?',
      answer:
        'Yes. The tool works on mobile browsers including Google Chrome on Android and Apple Safari on iPhone and iPad.',
    },
    {
      question: 'Are there file size or duration limits on uploaded audio files?',
      answer:
        'Since uploaded audio files are loaded locally as in-browser Object URLs, there are no strict server-imposed file size caps. However, large files (>100 MB) consume device RAM during playback. Standard formats supported by your browser\'s audio player (such as MP3, WAV, M4A, OGG, and WebM) are supported.',
    },
  ]

  const relatedSlugs = [
    'audio-studio',
    'text-to-speech',
    'subtitle-cleaner',
    'podcast-content-repurposer',
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Audio & Speech Transcriber — Voice Dictation & SRT | QUBNEXA"
      seoDescription="Transcribe speech to text in real time with live mic dictation. Supports English, Hindi, Bengali, and Urdu. Slow down audio and export clean TXT or SRT files."
      keywords="speech to text free, audio transcriber online, voice dictation hindi, bengali speech to text, srt subtitle generator, transcribe voice to text, creator tools"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={relatedSlugs}
    >
      <AudioTranscriber />
    </ToolPageLayout>
  )
}
