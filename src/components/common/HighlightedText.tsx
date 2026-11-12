import React from 'react'
import { splitHighlightParts } from '../../utils/toolSearch'

interface HighlightedTextProps {
  text: string
  query?: string
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({ text, query }) => {
  if (!query || !query.trim()) {
    return <>{text}</>
  }

  const parts = splitHighlightParts(text, query)
  return (
    <>
      {parts.map((part, idx) =>
        part.match ? (
          <mark
            key={idx}
            className="rounded bg-cyan-100/90 dark:bg-[#00DFFF]/25 px-0.5 text-inherit font-semibold"
          >
            {part.text}
          </mark>
        ) : (
          <React.Fragment key={idx}>{part.text}</React.Fragment>
        ),
      )}
    </>
  )
}
