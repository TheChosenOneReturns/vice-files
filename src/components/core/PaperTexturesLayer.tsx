export function PaperTexturesLayer() {
  return (
    <>
      {/* Global single-node paper grain overlay (< 1KB) */}
      <div className="paper-grain-overlay" aria-hidden="true" />

      {/* Shared SVG Filters & Vice Sunset Gradients */}
      <svg
        className="sr-only"
        aria-hidden="true"
        width="0"
        height="0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Shared Sunset Gradient for duotone vector illustrations (multiply on cream paper) */}
          <linearGradient id="viceSunsetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5A48B8" />
            <stop offset="48%" stopColor="#A24FA8" />
            <stop offset="82%" stopColor="#E65A9D" />
            <stop offset="100%" stopColor="#F28578" />
          </linearGradient>

          <linearGradient id="viceVerticalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5A48B8" />
            <stop offset="38%" stopColor="#8D51B5" />
            <stop offset="72%" stopColor="#E65A9D" />
            <stop offset="100%" stopColor="#F7C378" />
          </linearGradient>

          {/* Risograph Duotone Filter for evidence frames (never animate filter directly) */}
          <filter id="vice-risograph" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="
                0.33 0.33 0.33 0 0
                0.33 0.33 0.33 0 0
                0.33 0.33 0.33 0 0
                0    0    0    1 0"
              result="gray"
            />
            <feComponentTransfer in="gray" result="duotone">
              <feFuncR type="table" tableValues="0.27 0.88 0.97" />
              <feFuncG type="table" tableValues="0.20 0.35 0.66" />
              <feFuncB type="table" tableValues="0.62 0.63 0.74" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
    </>
  );
}
