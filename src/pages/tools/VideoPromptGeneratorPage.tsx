import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { VideoPromptGenerator } from '../../tools/VideoPromptGenerator/VideoPromptGenerator'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const VideoPromptGeneratorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'video-prompt-generator') || {
    id: 'ai-video-prompt-generator',
    name: 'AI Video Prompt Generator',
    slug: 'video-prompt-generator',
    route: '/tools/video-prompt-generator',
    path: '/tools/video-prompt-generator',
    description:
      'Build structured cinematic video prompts for OpenAI Sora, Runway Gen-3, Kling AI, and Midjourney v6.1 with camera, lighting, and aspect ratio controls.',
    primaryCategory: 'ai-tools',
    secondaryCategories: ['video-tools'],
    categoryId: 'ai-tools',
    categoryIds: ['ai-tools', 'video-tools'],
    categoryName: 'AI & Creator Tools',
    icon: 'Sparkles',
    status: 'live',
    releaseOrder: 21,
    createdAt: '2026-03-18',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    badge: 'Prompt Builder',
    tags: [
      'ai video prompt',
      'sora prompt generator',
      'runway gen 3 prompt',
      'kling ai prompt',
      'cinematography prompt',
      'midjourney video prompt',
    ],
    keywords: [
      'ai video prompt generator',
      'sora prompt generator',
      'runway gen 3 prompt',
      'kling ai prompt',
      'video prompt reverse engineering',
      'cinematography prompt maker',
      'creator tools',
    ],
  }

  const howToUseSteps = [
    'Select Target AI Video Engine: Choose your target generator tab: OpenAI Sora, Runway Gen-3, Kling AI, or Midjourney v6.1.',
    'Choose a Creative Preset (Optional): Click quick presets like Wildlife, Cyberpunk, Handicraft, Product Reel, or Sci-Fi to populate director parameters.',
    'Define Subject & Action: Enter your main character or object (e.g. cybernetic courier) and their core behavior (e.g. navigating an electric hover-bike).',
    'Set Setting & Atmosphere: Detail the location and environment (e.g. dystopian mega-city alleyways in heavy rain).',
    'Configure Cinematography & Lighting: Specify camera movement (presets: Dolly In, Drone Aerial, Steadicam, Low Angle, Macro Focus, 360 Orbit) and lighting mood (presets: Golden Hour, Neon Cyber, Chiaroscuro, Soft Overcast, Studio Rim).',
    'Select Visual Style & Technical Specs: Choose film aesthetic presets (Cinematic 35mm, Documentary, Anime Dream, Commercial CGI, IMAX Epic), aspect ratio (16:9, 9:16, 1:1, 2.39:1), frame rate (24fps, 30fps, 60fps), and resolution (1080p, 4K, 8K).',
    'Copy Compiled Prompt & Negative Prompt: Click "Copy Prompt" to copy the formatted text prompt. If using a platform that supports negative prompts, click "Copy Negative" to copy recommended negative guidance keywords.',
  ]

  const formulas = [
    {
      title: 'Hierarchical Directing Syntax Decomposition',
      formula: 'Prompt = [Subject + Action] + [Setting] + [Camera Vector] + [Lighting Mood] + [Aesthetic Specs]',
      explanation:
        'Decomposes scene descriptions into structured semantic tokens that guide video diffusion models, helping reduce erratic subject changes and chaotic camera pans.',
    },
    {
      title: 'Model-Specific Parameter Flag Formatting',
      formula: 'Runway: Prompt --ar AR --fps FPS --motion 5 | Midjourney: /imagine Prompt --ar AR --v 6.1 --style raw',
      explanation:
        'Formats prompt strings to model conventions: generates CLI parameter tags for Runway and Midjourney v6.1, while assembling natural language descriptive sentences for OpenAI Sora and Kling AI. The Runway flags (--fps, --motion 5, --upscale) are custom template-formatted parameter tags assembled for user convenience, not direct API integration.',
    },
    {
      title: 'Cinematic Camera Movement Structuring',
      formula: 'Camera Direction = Motion Vector ∈ {Dolly, Pan, Orbit, Aerial} + Framing ∈ {Macro, Low-Angle, POV}',
      explanation:
        'Providing explicit camera movement keywords gives diffusion models clear spatial context, encouraging smoother and more intentional scene composition.',
    },
    {
      title: 'Aspect Ratio Formatting Matrix',
      formula: 'AR ∈ {16:9 (Widescreen), 9:16 (Vertical Reels/Shorts), 1:1 (Square), 2.39:1 (Cinemascope)}',
      explanation:
        'Appends standardized ratio flags (--ar 16:9, --ar 9:16, --ar 1:1, --ar 2.39:1) or natural language framing descriptions to tailor composition to target display formats.',
    },
    {
      title: 'Negative Prompt Keyword Guidance',
      formula: 'Negative Keywords = Artifacts + Anatomical Deformities + Morphing Flaws + Watermarks',
      explanation:
        'Supplies descriptive negative tokens to steer generative models away from common flaws like unnatural limb anatomy, morphing, plastic skin textures, and watermarks. These negative keywords act as prompt guidance on supported platforms, not an absolute guarantee against generative defects.',
    },
    {
      title: 'Client-Side Prompt Composition Architecture',
      formula: 'User Input → Local React State → useMemo String Assembly (Client-Side Memory)',
      explanation:
        'All prompt concatenation, preset switching, and string formatting execute purely in browser memory. User inputs and creative prompts are not transmitted to or stored on QUBNEXA servers.',
    },
  ]

  const examples = [
    {
      title: 'Commercial Product Showcase (Runway Gen-3)',
      description: 'Matte-black smartwatch rotating in zero gravity for luxury brand advertising in 9:16 vertical video format.',
      input: 'Smartwatch rotating in studio cyclorama with studio rim lighting, 9:16 vertical aspect ratio, and 60fps.',
      output: 'A sleek matte-black titanium smartwatch with water droplets on the sapphire glass rotating gracefully in zero gravity with magnetic straps clasping seamlessly, set in Minimalist studio cyclorama with floating geometric glass prisms. Camera: 360-degree orbital turntable sweep with dynamic focal rack. Lighting: Ultra-clean commercial studio key light with sharp rim highlights. Style & Rendering: Apple product launch style, crisp hyper-detailed CGI realism, razor sharp focus --ar 9:16 --fps 60 --motion 5 --upscale 4K',
    },
    {
      title: 'Cinematic Documentary & Wildlife (OpenAI Sora)',
      description: 'Royal Bengal Tiger moving stealthily through morning mist in 16:9 widescreen format.',
      input: 'Royal Bengal tiger prowling in mangrove delta with golden dawn lighting, 35mm film grain, and 24fps.',
      output: 'Photorealistic cinematic video: A majestic royal Bengal tiger prowling stealthily through lush mangrove waterways, set in Sundarbans delta forest during golden dawn mist. Camera: Low-angle tracking shot moving parallel at ground level. Lighting: Golden hour amber sunlight filtering through morning haze. Style & Rendering: Cinematic 35mm film grain, National Geographic documentary look, photorealistic 8K. Master shot, natural physics, fluid motion, authentic reflections, 4K UHD, 24fps, aspect ratio 16:9.',
    },
    {
      title: 'Cyberpunk Sci-Fi Chase (Runway Gen-3)',
      description: 'Anamorphic 2.39:1 cinemascope high-speed drone chase through futuristic rain-slicked mega-city.',
      input: 'Cybernetic courier on hover-bike in rainy neon metropolis with volumetric lighting and 30fps.',
      output: 'A futuristic cybernetic courier wearing a reflective holographic jacket navigating an electric hover-bike through towering neon skyscrapers in heavy rain, set in Dystopian mega-city alleyways illuminated by giant Japanese and Hindi billboards. Camera: High-speed drone chase diving from rooftops down into congested traffic. Lighting: Volumetric neon magenta and cyan street glow reflecting on wet asphalt. Style & Rendering: Blade Runner 2049 aesthetic, anamorphic lens flares, shallow depth of field --ar 2.39:1 --fps 30 --motion 5 --upscale 4K',
    },
    {
      title: 'Atmospheric Sci-Fi Exploration (Kling AI)',
      description: 'Interstellar astronaut discovering an alien crystalline canyon under three ringed moons.',
      input: 'Interstellar explorer approaching glowing monolith with panoramic boom camera motion and 16:9 aspect ratio.',
      output: 'A lone interstellar astronaut exploring a canyon of crystalline formations walking towards a glowing ancient monolith emitting rhythmic bioluminescent pulses, set in Alien desert planet under a sky with three orbiting ringed moons, . Camera: Wide panoramic boom up revealing the vast extraterrestrial horizon, . Lighting: Starlight ambiance paired with deep violet and emerald bioluminescence, cinematic masterpiece, high dynamic range, 4K, --ar 16:9',
    },
  ]

  const faqs = [
    {
      question: 'Does this tool directly generate or render video files?',
      answer:
        'No. QUBNEXA\'s AI Video Prompt Generator is a prompt engineering and structuring tool. It formats text prompts and negative guidance keywords to be copied and pasted into external AI video platforms such as OpenAI Sora, Runway Gen-3, Kling AI, or Midjourney v6.1. It does not render video or interact with model APIs directly.',
    },
    {
      question: 'Which AI video generators and models are supported?',
      answer:
        'The tool provides dedicated formatting templates for OpenAI Sora, Runway Gen-3, Kling AI, and Midjourney v6.1. Selecting a model updates the output format, such as appending Midjourney CLI flags (/imagine ... --v 6.1 --style raw), Runway template tags, or natural language physical scene descriptions for Sora and Kling.',
    },
    {
      question: 'Are the Runway parameter flags (--fps, --motion 5, --upscale) official API commands?',
      answer:
        'No. The generated Runway flags represent custom template conventions designed for user reference and consistency when copying prompts into Runway workflows. They are not direct API parameters or universally supported Runway CLI syntax. Actual generation settings such as motion intensity and resolution should always be confirmed within Runway\'s web interface.',
    },
    {
      question: 'Why should I specify camera motion in my video prompts?',
      answer:
        'Providing explicit camera movement instructions (such as "Dolly push-in", "Steadicam tracking", or "Drone aerial") gives AI video models clear directorial context. This helps guide the model toward coherent, directional camera flow rather than unmotivated camera drift.',
    },
    {
      question: 'What is a negative prompt and does it guarantee artifact-free video?',
      answer:
        'A negative prompt provides text guidance on elements to avoid, such as deformed hands, morphing artifacts, jerky camera shakes, and watermarks. While negative prompts help steer diffusion models toward cleaner results on platforms with negative input fields, they are a guiding heuristic and cannot guarantee the complete elimination of AI generation anomalies.',
    },
    {
      question: 'What are the best aspect ratios for different platforms?',
      answer:
        'Use 16:9 for widescreen platforms like YouTube and desktop displays; 9:16 for vertical mobile formats including Instagram Reels, TikTok, and YouTube Shorts; 1:1 for square social media feeds; and 2.39:1 (Cinemascope) for cinematic widescreen aesthetics.',
    },
    {
      question: 'Do I need an account, subscription, or API key to use this prompt generator?',
      answer:
        'No. This tool operates directly in your web browser with no registration, login, account creation, or API keys required. You can freely compose, customize, and copy as many video prompts as you need.',
    },
    {
      question: 'Are my prompt ideas or text inputs sent to QUBNEXA servers?',
      answer:
        'No. All prompt assembly and parameter formatting occur strictly client-side within your browser\'s local memory. QUBNEXA servers do not receive, store, or analyze your entered text. Standard web requests occur solely to load the application\'s static assets from our hosting infrastructure.',
    },
    {
      question: 'Which Midjourney version is formatted by the generator?',
      answer:
        'The generator specifically formats prompts for Midjourney v6.1, appending the exact flags --v 6.1 --style raw along with your chosen aspect ratio. It does not format syntax for older Midjourney versions (such as v5) or unreleased iterations.',
    },
    {
      question: 'Can I customize the camera, lighting, and style fields beyond the preset options?',
      answer:
        'Yes. While the dropdown menus provide quick cinematic presets, each field is a standard editable text input. You can type custom camera rigs, specific lens focal lengths (such as 85mm anamorphic), or unique lighting setups at any time.',
    },
  ]

  const relatedSlugs = [
    'video-downloader',
    'audio-transcriber',
    'text-to-speech',
    'word-counter',
    'fancy-font-generator',
    'text-repeater',
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="AI Video Prompt Generator — Sora, Runway & Kling | QUBNEXA"
      seoDescription="Build structured cinematic video prompts for OpenAI Sora, Runway Gen-3, Kling, and Midjourney v6.1. Customize camera angles, lighting, and aspect ratios."
      keywords="ai video prompt generator, sora prompt generator, runway gen 3 prompt, kling ai prompt, video prompt reverse engineering, cinematography prompt maker, creator tools"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={relatedSlugs}
    >
      <VideoPromptGenerator />
    </ToolPageLayout>
  )
}
