import {useId} from 'react'

/** @public */
export function ContextIcon(props: React.SVGProps<SVGSVGElement>) {
  // SVG ids are document-global and the gradient is referenced by `url(#...)`, so it has to be
  // unique per instance. `useId` returns colons, which are legal in an id but trip up selectors.
  const gradientId = `sanity-context-gradient-${useId().replace(/:/g, '')}`

  return (
    <svg width="18" height="18" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      <rect
        x="16"
        y="20"
        width="32"
        height="88"
        rx="8"
        fill="none"
        stroke="#6366F1"
        strokeWidth="6"
      />
      <rect
        x="80"
        y="20"
        width="32"
        height="88"
        rx="8"
        fill="none"
        stroke="#06B6D4"
        strokeWidth="6"
      />

      <path
        d="M48 64 C60 40, 68 88, 80 64"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  )
}
