import {forwardRef} from 'react'

/** @public */
export const ContextIcon = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  function ContextIcon(_props, _ref) {
    return (
      <svg width="18" height="18" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#6366F1" />
            <stop offset="100%" stop-color="#06B6D4" />
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
          stroke-width="6"
        />
        <rect
          x="80"
          y="20"
          width="32"
          height="88"
          rx="8"
          fill="none"
          stroke="#06B6D4"
          stroke-width="6"
        />

        <path
          d="M48 64 C60 40, 68 88, 80 64"
          fill="none"
          stroke="url(#g)"
          stroke-width="6"
          stroke-linecap="round"
        />
      </svg>
    )
  },
)
