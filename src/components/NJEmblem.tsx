import React from 'react';

interface NJEmblemProps {
  monogram?: string;
  size?: number;
  className?: string;
}

export const NJEmblem: React.FC<NJEmblemProps> = ({
  monogram = 'NJ',
  size = 44,
  className = '',
}) => {
  const firstChar = monogram.slice(0, 1) || 'N';
  const secondChar = monogram.slice(1, 2) || 'J';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`${monogram} Brand Mark`}
    >
      <defs>
        <linearGradient id="nj-purple-grad" x1="20" y1="20" x2="108" y2="105" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="45%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>
        <linearGradient id="nj-crown-grad" x1="28" y1="14" x2="62" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="nj-white-grad" x1="22" y1="36" x2="64" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <filter id="nj-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer subtle orbital swoosh */}
      <path
        d="M16 74C14 48 34 25 63 22C88 19 107 35 106 58C105 79 86 98 59 102"
        stroke="url(#nj-purple-grad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Crown perched above the first letter */}
      <g filter="url(#nj-glow)">
        <path
          d="M27 33L24 19L34 25L41 14L48 25L58 19L55 33H27Z"
          fill="url(#nj-crown-grad)"
          stroke="#FEF3C7"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="18" r="2.2" fill="#FDE68A" />
        <circle cx="41" cy="12.5" r="2.5" fill="#FDE68A" />
        <circle cx="58" cy="18" r="2.2" fill="#FDE68A" />
      </g>

      {/* Monogram Letters (styled N + glowing J swoosh) */}
      <text
        x="19"
        y="90"
        fill="url(#nj-white-grad)"
        fontFamily="Outfit, sans-serif"
        fontWeight="800"
        fontSize="58"
        letterSpacing="-3"
      >
        {firstChar}
      </text>
      <text
        x="55"
        y="92"
        fill="url(#nj-purple-grad)"
        fontFamily="Outfit, sans-serif"
        fontWeight="800"
        fontSize="62"
        fontStyle="italic"
        filter="url(#nj-glow)"
      >
        {secondChar}
      </text>

      {/* Futuristic accent slash */}
      <path
        d="M14 95C34 84 68 58 102 32"
        stroke="url(#nj-purple-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
};
