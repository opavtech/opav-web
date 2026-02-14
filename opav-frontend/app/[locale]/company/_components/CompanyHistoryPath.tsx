"use client";

interface Props {
  pathRef: React.RefObject<SVGPathElement | null>;
}

export default function CompanyHistoryPath({ pathRef }: Props) {
  return (
    <svg
      className="history-path-svg"
      viewBox="0 0 100 100"
      fill="none"
      preserveAspectRatio="none"
    >
      {/* Gradiente corporativo Magenta */}
      <defs>
        <linearGradient
          id="historyGradient"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor="#a30045" />
          <stop offset="40%" stopColor="#d50058" />
          <stop offset="70%" stopColor="#e6307a" />
          <stop offset="100%" stopColor="#ff1a8c" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="pathGlow" x="-50%" y="-5%" width="200%" height="110%">
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 
        Path curvo que pasa por el centro (50%) donde están los hexágonos
        Los hexágonos están a: ~12.5%, ~37.5%, ~62.5%, ~87.5% de altura
        Las curvas van hacia los lados donde están las cards (alternando)
      */}
      <path
        ref={pathRef}
        d="M 50 0 
           L 50 12.5
           C 50 18, 45 20, 45 25
           C 45 30, 50 32, 50 37.5
           C 50 43, 55 45, 55 50
           C 55 55, 50 57, 50 62.5
           C 50 68, 45 70, 45 75
           C 45 80, 50 82, 50 87.5
           L 50 100"
        stroke="url(#historyGradient)"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
        filter="url(#pathGlow)"
      />
    </svg>
  );
}
