interface BrandLogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export function BrandLogo({ variant = 'light', className }: BrandLogoProps) {
  if (variant === 'dark') {
    return (
      <svg
        viewBox="0 0 360 95"
        className={className ?? 'h-9 sm:h-11 w-auto'}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="보험플러스 — 당신의 행복을 지키는 보험"
      >
        <path
          d="M52 27 C42 12, 16 14, 14 35 C12 54, 34 69, 51 82 C37 66, 26 51, 29 36 C31 25, 44 23, 52 27 Z"
          fill="#0ea5e9"
        />
        <path
          d="M52 27 C62 12, 88 14, 90 35 C92 54, 70 69, 44 85 C63 72, 78 55, 76 37 C74 25, 60 23, 52 27 Z"
          fill="#4ade80"
        />
        <circle cx="43" cy="39" r="4.5" fill="#38bdf8" />
        <path d="M35 55 C35 47, 51 47, 51 55 Z" fill="#38bdf8" />
        <circle cx="61" cy="40" r="4" fill="#4ade80" />
        <path d="M54 55 C54 48, 68 48, 68 55 Z" fill="#4ade80" />
        <circle cx="52" cy="47" r="3.2" fill="#7dd3fc" />
        <path d="M46 60 C46 54, 58 54, 58 60 Z" fill="#7dd3fc" />
        <path
          d="M89 8 L91.5 14.5 L98 17 L91.5 19.5 L89 26 L86.5 19.5 L80 17 L86.5 14.5 Z"
          fill="#fde047"
        />
        <text
          x="103"
          y="54"
          fontFamily="'Noto Sans KR', sans-serif"
          fontWeight="900"
          fontSize="34"
          fontStyle="italic"
          letterSpacing="-1.5"
        >
          <tspan fill="#ffffff">보험</tspan>
          <tspan fill="#fcd34d">플러스</tspan>
        </text>
        <path d="M312 18 H321 V9 H328 V18 H337 V25 H328 V34 H321 V25 H312 Z" fill="#fcd34d" />
        <path d="M98 66 Q220 55 344 66 Q220 60 98 66 Z" fill="#7dd3fc" />
        <text
          x="221"
          y="81"
          textAnchor="middle"
          fontFamily="'Noto Sans KR', sans-serif"
          fontWeight="500"
          fontSize="11.5"
          fill="#cbd5e1"
          letterSpacing="0.5"
        >
          — 당신의 행복을 지키는 보험 —
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 360 95"
      className={className ?? 'h-10 sm:h-12 w-auto'}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="보험플러스 — 당신의 행복을 지키는 보험"
    >
      <defs>
        <linearGradient id="heartBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="heartGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a3e635" />
          <stop offset="60%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="plusGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M52 27 C42 12, 16 14, 14 35 C12 54, 34 69, 51 82 C37 66, 26 51, 29 36 C31 25, 44 23, 52 27 Z"
        fill="url(#heartBlue)"
      />
      <path
        d="M52 27 C62 12, 88 14, 90 35 C92 54, 70 69, 44 85 C63 72, 78 55, 76 37 C74 25, 60 23, 52 27 Z"
        fill="url(#heartGreen)"
      />
      <circle cx="43" cy="39" r="4.5" fill="#0284c7" />
      <path d="M35 55 C35 47, 51 47, 51 55 Z" fill="#0284c7" />
      <circle cx="61" cy="40" r="4" fill="#16a34a" />
      <path d="M54 55 C54 48, 68 48, 68 55 Z" fill="#16a34a" />
      <circle cx="52" cy="47" r="3.2" fill="#0369a1" />
      <path d="M46 60 C46 54, 58 54, 58 60 Z" fill="#0369a1" />
      <path
        d="M89 8 L91.5 14.5 L98 17 L91.5 19.5 L89 26 L86.5 19.5 L80 17 L86.5 14.5 Z"
        fill="#facc15"
      />
      <text
        x="103"
        y="54"
        fontFamily="'Noto Sans KR', sans-serif"
        fontWeight="900"
        fontSize="34"
        fontStyle="italic"
        letterSpacing="-1.5"
      >
        <tspan fill="#0f172a">보험</tspan>
        <tspan fill="url(#plusGold)">플러스</tspan>
      </text>
      <path
        d="M312 18 H321 V9 H328 V18 H337 V25 H328 V34 H321 V25 H312 Z"
        fill="url(#plusGold)"
      />
      <path d="M98 66 Q220 55 344 66 Q220 60 98 66 Z" fill="#38bdf8" />
      <text
        x="221"
        y="81"
        textAnchor="middle"
        fontFamily="'Noto Sans KR', sans-serif"
        fontWeight="700"
        fontSize="11.5"
        fill="#475569"
        letterSpacing="0.5"
      >
        — 당신의 행복을 지키는 보험 —
      </text>
    </svg>
  );
}
