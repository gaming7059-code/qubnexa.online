export interface FAQItem {
  question: string
  answer: string
}

export const GAMES_CATEGORY_FAQS: FAQItem[] = [
  {
    question: 'Can I play QUBNEXA games without downloading any apps or extensions?',
    answer:
      'Yes. Every game runs natively in your web browser using HTML5 Canvas, WebGL, and modern JavaScript. There are zero installers, APKs, or browser extensions required.',
  },
  {
    question: 'Do QUBNEXA browser games work on smartphones and tablets?',
    answer:
      'Yes. All six games feature responsive layouts and touch-optimized controls—including on-screen D-pads, virtual joysticks, and touch selectors designed for iOS and Android devices.',
  },
  {
    question: 'Are all games completely free with no paywalls or sign-ups?',
    answer:
      'All games are 100% free with no in-app purchases, microtransactions, subscriptions, or mandatory account logins.',
  },
  {
    question: 'Where are my high scores and game settings saved?',
    answer:
      'Scores, records, and sound preferences are stored privately in your browser local storage on your device. No game state is transmitted to external servers.',
  },
  {
    question: 'What is the difference between this Games Guide and the Games Arena?',
    answer:
      'This Games Category page (/categories/games) is a comprehensive discovery hub where you can compare games, learn objectives, and read controls and strategy tips. The Games Arena (/games) is the interactive playable player where you can switch and play all games fullscreen with sound.',
  },
]
