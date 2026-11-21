export function PaperTexturesLayer() {
  return (
    <svg
      className="sr-only"
      aria-hidden="true"
      width="0"
      height="0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
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
      </defs>
    </svg>
  );
}
