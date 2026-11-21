interface SvgProps {
  className?: string;
}

export function PostmarkSvg({ className = "" }: SvgProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="50"
        cy="50"
        r="39"
        fill="none"
        stroke="currentColor"
        strokeDasharray="2 2"
      />
      <path id="postmark-arc" d="M17 55a33 33 0 1 1 66 0" fill="none" />
      <text
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontSize="10.8"
        letterSpacing="2"
        fill="currentColor"
      >
        <textPath href="#postmark-arc" startOffset="50%" textAnchor="middle">
          VICE CITY
        </textPath>
      </text>
      <path
        d="M49 78Q50 64 48 52Q44 47 38 50Q39 45 46 47Q39 42 33 45Q35 39 42 42Q37 35 34 35Q42 34 47 42Q46 34 42 31Q49 31 51 43Q54 34 63 35Q58 37 55 44Q62 39 71 43Q63 43 57 48Q66 44 72 52Q63 48 56 52Q60 53 62 59Q56 55 52 55Q56 67 55 78Z"
        fill="currentColor"
        transform="translate(-7 -4)"
      />
      <path
        d="M49 78Q50 64 48 52Q44 47 38 50Q39 45 46 47Q39 42 33 45Q35 39 42 42Q37 35 34 35Q42 34 47 42Q46 34 42 31Q49 31 51 43Q54 34 63 35Q58 37 55 44Q62 39 71 43Q63 43 57 48Q66 44 72 52Q63 48 56 52Q60 53 62 59Q56 55 52 55Q56 67 55 78Z"
        fill="currentColor"
        transform="translate(87 14) scale(-0.64 0.74)"
      />
      <path
        d="M21 72q25 -8 58 0m-50 5q19-4 41 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <text
        x="50"
        y="86"
        fontFamily="Arial, sans-serif"
        fontSize="8"
        textAnchor="middle"
        fill="currentColor"
        letterSpacing="1"
      >
        LEONIDA
      </text>
    </svg>
  );
}

export function WaveSvg({ className = "" }: SvgProps) {
  return (
    <svg
      viewBox="0 0 90 30"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 5q10-6 22 0t22 0t22 0t24 0M0 15q10-6 22 0t22 0t22 0t24 0M0 25q10-6 22 0t22 0t22 0t24 0"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
      />
    </svg>
  );
}

export function SeaplaneSvg({ className = "" }: SvgProps) {
  return (
    <svg
      viewBox="0 0 220 130"
      className={`mix-blend-multiply ${className}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stylized Vice City seaplane cutout with duotone gradient */}
      <g fill="url(#viceSunsetGrad)">
        {/* Top sweeping wing */}
        <path d="M18 82 L198 16 L208 24 L42 94 Z" />
        {/* Fuselage */}
        <path d="M44 74 C68 62, 118 64, 154 78 C166 83, 170 92, 162 98 C144 106, 95 96, 56 84 Z" />
        {/* Tail fin */}
        <path d="M42 73 L24 44 L36 42 L58 68 Z" />
        {/* Pontoons / floats */}
        <path d="M62 102 L124 122 C133 125, 138 119, 130 113 L72 95 Z" />
        <path d="M84 95 L138 112 C145 114, 148 109, 142 105 L92 89 Z" opacity="0.72" />
        {/* Struts */}
        <path d="M88 85 L84 102 M114 91 L108 110 M112 52 L116 74" stroke="#5A48B8" strokeWidth="3.5" />
      </g>
    </svg>
  );
}

export function PalmTreeSvg({ className = "" }: SvgProps) {
  return (
    <svg
      viewBox="0 0 180 240"
      className={`mix-blend-multiply ${className}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="url(#viceSunsetGrad)">
        {/* Curved trunk */}
        <path d="M126 238 C124 190, 114 148, 98 104 L109 101 C128 148, 139 192, 142 238 Z" />
        {/* Fronds */}
        <path d="M102 102 C78 86, 44 88, 18 106 C45 96, 74 98, 98 110 Z" />
        <path d="M102 98 C72 68, 36 58, 8 68 C40 68, 72 78, 98 104 Z" />
        <path d="M104 94 C88 56, 62 32, 34 24 C64 42, 84 65, 98 98 Z" />
        <path d="M107 93 C106 54, 98 24, 82 6 C100 32, 108 60, 109 94 Z" />
        <path d="M110 95 C124 58, 146 36, 174 28 C148 46, 128 68, 114 98 Z" />
        <path d="M112 100 C138 78, 162 76, 178 88 C156 86, 134 90, 114 106 Z" />
        <path d="M111 106 C136 102, 158 114, 172 134 C152 120, 132 114, 110 113 Z" />
        <path d="M98 108 C76 116, 56 134, 46 156 C62 136, 80 122, 102 115 Z" />
      </g>
    </svg>
  );
}

export function Route95ShieldSvg({ className = "" }: SvgProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 10 C18 14, 26 14, 32 8 C38 14, 46 14, 56 10 L59 22 C58 42, 46 54, 32 60 C18 54, 6 42, 5 22 Z"
        fill="var(--stamp-crimson)"
        stroke="var(--ink-inverse)"
        strokeWidth="2.5"
      />
      <path d="M7 22 L57 22" stroke="var(--ink-inverse)" strokeWidth="2" />
      <text
        x="32"
        y="18.5"
        textAnchor="middle"
        fill="var(--ink-inverse)"
        fontSize="7"
        fontWeight="800"
        fontFamily="Barlow, sans-serif"
        letterSpacing="1"
      >
        LEONIDA
      </text>
      <text
        x="32"
        y="46"
        textAnchor="middle"
        fill="var(--ink-inverse)"
        fontSize="24"
        fontWeight="900"
        fontFamily="Archivo, Arial Black, sans-serif"
      >
        95
      </text>
    </svg>
  );
}

export function FlamingoSvg({ className = "" }: SvgProps) {
  return (
    <svg
      viewBox="0 0 64 88"
      className={`mix-blend-multiply ${className}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 14 C16 7, 25 6, 27 13 C28 19, 22 25, 25 32 C29 39, 44 38, 49 47 C53 54, 44 61, 34 60 L34 83 L31 83 L31 60 C27 60, 24 58, 23 55 L30 68 L22 72 L21 70 L27 67 L20 53 C17 47, 22 39, 21 32 C19 25, 24 19, 23 14 C22 11, 19 11, 18 14 C16 16, 13 17, 11 16 C12 13, 14 12, 16 14 Z"
        fill="url(#viceSunsetGrad)"
      />
    </svg>
  );
}

export function SeagullsSvg({ className = "" }: SvgProps) {
  return (
    <svg
      viewBox="0 0 120 42"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 24 Q18 14 26 22 Q34 14 44 20 Q34 18 26 26 Q18 19 8 24 Z"
        fill="var(--ink-primary)"
      />
      <path
        d="M66 13 Q74 5 81 12 Q88 6 96 11 Q88 10 81 15 Q74 10 66 13 Z"
        fill="var(--ink-primary)"
        opacity="0.82"
      />
      <path
        d="M90 32 Q97 25 103 31 Q109 26 116 30 Q109 29 103 34 Q97 29 90 32 Z"
        fill="var(--ink-primary)"
        opacity="0.7"
      />
    </svg>
  );
}
