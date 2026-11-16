import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { PortfolioVisualType, ServiceIconKey } from '../types/siteConfig';
import { NJEmblem } from './NJEmblem';

export const ServiceIconGraphic: React.FC<{ iconKey: ServiceIconKey }> = ({
  iconKey,
}) => {
  switch (iconKey) {
    case 'meta-ads':
      return (
        <svg viewBox="0 0 96 76" className="w-20 h-16 drop-shadow-[0_8px_20px_rgba(59,130,246,0.55)]" fill="none">
          <defs>
            <linearGradient id="mega-cone" x1="18" y1="20" x2="78" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="55%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
            <linearGradient id="mega-rim" x1="62" y1="12" x2="78" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
          </defs>
          {/* Sound waves */}
          <path d="M77 24C81 29 81 41 77 46" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <path d="M84 19C90 27 90 43 84 51" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
          {/* Handle */}
          <path d="M32 45L36 62C36.6 64.5 39 66 41.5 65.5C44 65 45.4 62.6 44.8 60L41 44" fill="#312E81" stroke="#60A5FA" strokeWidth="1.5" />
          {/* Rear cap */}
          <ellipse cx="22" cy="39" rx="6" ry="9" fill="#1E1B4B" stroke="#60A5FA" strokeWidth="1.5" />
          {/* Megaphone body */}
          <path d="M22 30L64 14V56L22 46V30Z" fill="url(#mega-cone)" />
          {/* Front mouth rim */}
          <ellipse cx="64" cy="35" rx="7.5" ry="21" fill="#1D4ED8" stroke="url(#mega-rim)" strokeWidth="2.5" />
          <ellipse cx="64" cy="35" rx="4" ry="12" fill="#0F172A" opacity="0.7" />
        </svg>
      );

    case 'digital-marketing':
      return (
        <svg viewBox="0 0 96 76" className="w-20 h-16 drop-shadow-[0_8px_20px_rgba(99,102,241,0.55)]" fill="none">
          <defs>
            <linearGradient id="bar-grad" x1="0" y1="10" x2="0" y2="66" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#312E81" />
            </linearGradient>
          </defs>
          <rect x="18" y="45" width="11" height="20" rx="3" fill="url(#bar-grad)" />
          <rect x="34" y="36" width="11" height="29" rx="3" fill="url(#bar-grad)" />
          <rect x="50" y="27" width="11" height="38" rx="3" fill="url(#bar-grad)" />
          <rect x="66" y="16" width="11" height="49" rx="3" fill="url(#bar-grad)" />
          {/* Rising neon arrow */}
          <path
            d="M15 41L36 28L47 32L74 11"
            stroke="#E0F2FE"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M65 10H75V20"
            stroke="#E0F2FE"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'social-media':
      return (
        <div className="grid grid-cols-2 gap-1.5 w-16 h-16 place-items-center">
          {/* Facebook */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-[0_4px_14px_rgba(59,130,246,0.5)]">
            f
          </div>
          {/* Instagram */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-[0_4px_14px_rgba(236,72,153,0.45)]">
            <div className="w-4 h-4 rounded border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
          {/* TikTok */}
          <div className="w-7 h-7 rounded-lg bg-slate-900 border border-cyan-400/50 flex items-center justify-center text-white font-bold text-xs shadow-[0_4px_14px_rgba(34,211,238,0.35)]">
            ♪
          </div>
          {/* YouTube */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center shadow-[0_4px_14px_rgba(239,68,68,0.45)]">
            <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5" />
          </div>
        </div>
      );

    case 'shopify':
      return (
        <svg viewBox="0 0 96 76" className="w-20 h-16 drop-shadow-[0_8px_20px_rgba(132,204,22,0.4)]" fill="none">
          <defs>
            <linearGradient id="shop-bag" x1="22" y1="18" x2="74" y2="68" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A3E635" />
              <stop offset="55%" stopColor="#65A30D" />
              <stop offset="100%" stopColor="#3F6212" />
            </linearGradient>
          </defs>
          {/* Bag handle */}
          <path d="M36 22C36 13 41 9 48 9C55 9 60 13 60 22" stroke="#D9F99D" strokeWidth="3.5" strokeLinecap="round" />
          {/* Bag body */}
          <path d="M25 22H71L76 64C76.3 66.5 74.4 68 72 68H24C21.6 68 19.7 66.5 20 64L25 22Z" fill="url(#shop-bag)" stroke="#BEF264" strokeWidth="1.5" />
          {/* Side fold */}
          <path d="M62 22L71 22L76 64L65 68L62 22Z" fill="#365314" opacity="0.35" />
          {/* Letter S */}
          <text
            x="47"
            y="53"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="Outfit, sans-serif"
            fontWeight="800"
            fontSize="28"
            fontStyle="italic"
          >
            S
          </text>
        </svg>
      );

    case 'video-editing':
      return (
        <svg viewBox="0 0 96 76" className="w-20 h-16 drop-shadow-[0_8px_20px_rgba(96,165,250,0.55)]" fill="none">
          <defs>
            <linearGradient id="video-frame-grad" x1="14" y1="12" x2="82" y2="62" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="55%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>
            <linearGradient id="video-play-grad" x1="40" y1="24" x2="58" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>
          {/* Main video editor frame */}
          <rect
            x="14"
            y="14"
            width="68"
            height="42"
            rx="8"
            fill="url(#video-frame-grad)"
            stroke="#93C5FD"
            strokeWidth="1.8"
          />
          {/* Film sprocket accents */}
          <rect x="20" y="19" width="6" height="4" rx="1" fill="#0F172A" opacity="0.65" />
          <rect x="30" y="19" width="6" height="4" rx="1" fill="#0F172A" opacity="0.65" />
          <rect x="60" y="19" width="6" height="4" rx="1" fill="#0F172A" opacity="0.65" />
          <rect x="70" y="19" width="6" height="4" rx="1" fill="#0F172A" opacity="0.65" />
          {/* Play button */}
          <circle cx="48" cy="36" r="11" fill="#0B081D" fillOpacity="0.6" stroke="#C4B5FD" strokeWidth="1.5" />
          <path d="M44.5 30.8L54 36L44.5 41.2V30.8Z" fill="url(#video-play-grad)" />
          {/* Timeline scrubber track below */}
          <rect x="18" y="61" width="60" height="6" rx="3" fill="#1E1B4B" stroke="#60A5FA" strokeWidth="1.2" />
          <rect x="22" y="62.5" width="24" height="3" rx="1.5" fill="#60A5FA" />
          <rect x="49" y="62.5" width="16" height="3" rx="1.5" fill="#A855F7" />
          <line x1="47" y1="58" x2="47" y2="70" stroke="#E0F2FE" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'graphic-design':
      return (
        <svg viewBox="0 0 96 76" className="w-20 h-16 drop-shadow-[0_8px_20px_rgba(96,165,250,0.5)]" fill="none">
          <defs>
            <linearGradient id="palette-grad" x1="16" y1="14" x2="72" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>
          </defs>
          {/* Artist Palette */}
          <path
            d="M46 14C29 14 17 25 17 39C17 53 29 64 46 64C51 64 55 61 55 56C55 53 53 50 53 47C53 43 56 41 61 41H66C73 41 78 36 78 30C78 21 63 14 46 14Z"
            fill="url(#palette-grad)"
            stroke="#93C5FD"
            strokeWidth="1.8"
          />
          <circle cx="31" cy="30" r="4" fill="#F472B6" />
          <circle cx="43" cy="24" r="4" fill="#FACC15" />
          <circle cx="56" cy="27" r="4" fill="#34D399" />
          <circle cx="28" cy="44" r="4" fill="#A78BFA" />
          <circle cx="40" cy="52" r="4.5" fill="#0B081D" stroke="#60A5FA" strokeWidth="1.2" />
          {/* Brush */}
          <path d="M51 54L77 18" stroke="#E0E7FF" strokeWidth="4" strokeLinecap="round" />
          <path d="M47 58C45 62 49 65 53 62L55 56L50 53L47 58Z" fill="#A855F7" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 96 76" className="w-20 h-16 drop-shadow-[0_8px_20px_rgba(139,92,246,0.5)]" fill="none">
          <circle cx="48" cy="38" r="24" stroke="#8B5CF6" strokeWidth="3" fill="#1E1B4B" />
          <path d="M34 44L44 34L51 40L63 26" stroke="#60A5FA" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
};

export const PortfolioSceneGraphic: React.FC<{
  visualType: PortfolioVisualType;
  monogram: string;
}> = ({ visualType, monogram }) => {
  switch (visualType) {
    case 'social-phone':
      return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_55%,rgba(99,102,241,0.35),rgba(11,8,29,0.95)_70%)]">
          {/* Glowing orbital ring behind phone */}
          <div className="absolute w-44 h-20 rounded-full border-2 border-violet-400/60 shadow-[0_0_24px_rgba(139,92,246,0.7)] -rotate-12" />
          {/* Tilted 3D Phone */}
          <div className="relative w-24 h-40 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-indigo-400/70 shadow-[0_14px_30px_rgba(59,130,246,0.45)] rotate-[24deg] p-2 flex flex-col justify-between">
            <div className="w-8 h-1 rounded-full bg-slate-600 mx-auto" />
            <div className="grid grid-cols-3 gap-1.5 my-auto">
              <div className="h-4 rounded bg-blue-500" />
              <div className="h-4 rounded bg-pink-500" />
              <div className="h-4 rounded bg-violet-500" />
              <div className="h-4 rounded bg-emerald-400" />
              <div className="h-4 rounded bg-amber-400" />
              <div className="h-4 rounded bg-cyan-400" />
              <div className="h-4 rounded bg-rose-500" />
              <div className="h-4 rounded bg-indigo-500" />
              <div className="h-4 rounded bg-purple-400" />
            </div>
            <div className="w-10 h-1 rounded-full bg-indigo-400/60 mx-auto" />
          </div>
        </div>
      );

    case 'growth-bars':
      return (
        <div className="relative w-full h-full flex items-end justify-center pb-5 px-6 overflow-hidden bg-[radial-gradient(circle_at_60%_40%,rgba(139,92,246,0.35),rgba(11,8,29,0.95)_70%)]">
          <svg viewBox="0 0 240 130" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="port-bar" x1="0" y1="20" x2="0" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="50%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#1E1B4B" />
              </linearGradient>
            </defs>
            <rect x="44" y="88" width="20" height="36" rx="4" fill="url(#port-bar)" />
            <rect x="74" y="74" width="20" height="50" rx="4" fill="url(#port-bar)" />
            <rect x="104" y="58" width="20" height="66" rx="4" fill="url(#port-bar)" />
            <rect x="134" y="42" width="20" height="82" rx="4" fill="url(#port-bar)" />
            <rect x="164" y="24" width="20" height="100" rx="4" fill="url(#port-bar)" />
            <path
              d="M36 74C75 68 120 48 188 18"
              stroke="#93C5FD"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M174 15L190 17L183 32"
              stroke="#E0F2FE"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'ecommerce-cart':
      return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.35),rgba(11,8,29,0.95)_70%)]">
          <svg viewBox="0 0 240 130" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="bag-violet" x1="30" y1="25" x2="105" y2="110" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#5B21B6" />
              </linearGradient>
            </defs>
            {/* Purple shopping bags */}
            <path d="M55 38C55 28 65 28 65 38" stroke="#E9D5FF" strokeWidth="3" strokeLinecap="round" />
            <rect x="38" y="38" width="44" height="56" rx="6" fill="url(#bag-violet)" stroke="#D8B4FE" strokeWidth="1.5" />
            <rect x="66" y="50" width="38" height="48" rx="6" fill="#7C3AED" stroke="#C4B5FD" strokeWidth="1.5" />
            {/* Metallic neon cart */}
            <path d="M110 42H124L136 86H192L204 52H130" stroke="#93C5FD" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="142" y1="68" x2="196" y2="68" stroke="#60A5FA" strokeWidth="2" />
            <circle cx="144" cy="99" r="7" fill="#3B82F6" stroke="#E0F2FE" strokeWidth="2" />
            <circle cx="186" cy="99" r="7" fill="#3B82F6" stroke="#E0F2FE" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'brand-cube':
    default:
      return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),rgba(11,8,29,0.96)_72%)]">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#1d1746] via-[#0a071c] to-[#050311] border-2 border-blue-400/60 shadow-[0_0_32px_rgba(99,102,241,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] flex items-center justify-center transform -rotate-3">
            <NJEmblem monogram={monogram} size={76} />
          </div>
        </div>
      );
  }
};

export const HandshakeGraphic: React.FC<{
  primaryBlue: string;
  primaryPurple: string;
  floatIntensity?: number;
  rotationSpeed?: number;
}> = ({
  primaryBlue,
  primaryPurple,
  floatIntensity = 1,
  rotationSpeed = 1,
}) => {
  const [pulseBoost, setPulseBoost] = useState(0);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 200, damping: 24 });
  const smoothY = useSpring(pointerY, { stiffness: 200, damping: 24 });

  const tiltX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const tiltY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const cycleDuration = Math.max(2.2, 4.4 / Math.max(0.3, rotationSpeed));
  const amp = Math.max(0.25, floatIntensity);

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={() => setPulseBoost((n) => n + 1)}
      className="relative flex items-center justify-center w-full max-w-[380px] mx-auto h-[265px] sm:h-[290px] select-none cursor-pointer"
      aria-label="Human and digital collaboration handshake"
    >
      {/* Soft Multi-Layered Neon Aura Backdrop */}
      <motion.div
        animate={{
          scale: [0.95, 1.07, 0.95],
          opacity: [0.42, 0.65, 0.42],
        }}
        transition={{
          repeat: Infinity,
          duration: cycleDuration * 1.15,
          ease: 'easeInOut',
        }}
        className="absolute w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${primaryPurple} 0%, ${primaryBlue} 50%, transparent 74%)`,
        }}
      />

      {/* Interactive 2.5D Perspective Stage */}
      <motion.div
        style={{
          transformPerspective: 1000,
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <svg
          viewBox="0 0 380 260"
          className="relative w-full h-full overflow-visible drop-shadow-[0_18px_40px_rgba(88,28,135,0.45)]"
          fill="none"
        >
          <defs>
            <linearGradient id="hs-ribbon-back" x1="35" y1="45" x2="345" y2="215" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={primaryBlue} stopOpacity="0.15" />
              <stop offset="35%" stopColor={primaryPurple} stopOpacity="0.88" />
              <stop offset="70%" stopColor={primaryBlue} stopOpacity="0.92" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="hs-ribbon-front" x1="36" y1="130" x2="344" y2="128" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={primaryBlue} stopOpacity="0.08" />
              <stop offset="28%" stopColor="#818CF8" stopOpacity="0.92" />
              <stop offset="55%" stopColor="#C084FC" stopOpacity="0.95" />
              <stop offset="82%" stopColor={primaryBlue} stopOpacity="0.85" />
              <stop offset="100%" stopColor={primaryBlue} stopOpacity="0.05" />
            </linearGradient>

            <linearGradient id="hs-human-skin" x1="78" y1="104" x2="214" y2="178" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F6CBAE" />
              <stop offset="45%" stopColor="#E2A47E" />
              <stop offset="85%" stopColor="#C6815B" />
              <stop offset="100%" stopColor="#9C5D3D" />
            </linearGradient>

            <linearGradient id="hs-human-shadow" x1="120" y1="130" x2="210" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D6946E" />
              <stop offset="100%" stopColor="#8E5236" />
            </linearGradient>

            <linearGradient id="hs-sleeve" x1="8" y1="150" x2="108" y2="186" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#090D1A" />
              <stop offset="55%" stopColor="#161D36" />
              <stop offset="100%" stopColor="#0D1224" />
            </linearGradient>

            <linearGradient id="hs-robot-armor" x1="180" y1="74" x2="365" y2="148" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="30%" stopColor="#94A3B8" />
              <stop offset="68%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <linearGradient id="hs-robot-dark" x1="168" y1="90" x2="335" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="55%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#090D18" />
            </linearGradient>

            <radialGradient id="hs-clasp-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
              <stop offset="35%" stopColor={primaryBlue} stopOpacity="0.45" />
              <stop offset="70%" stopColor={primaryPurple} stopOpacity="0.2" />
              <stop offset="100%" stopColor={primaryPurple} stopOpacity="0" />
            </radialGradient>

            <filter id="hs-soft-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Back Orbital Energy Rings (Counter-drifting subtly) */}
          <motion.g
            animate={{
              rotate: [-1.5, 1.5, -1.5],
              scale: [0.99, 1.02, 0.99],
            }}
            transition={{
              repeat: Infinity,
              duration: cycleDuration * 1.6,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '190px 130px' }}
          >
            <path
              d="M42 128C48 64 128 34 222 48C302 60 344 102 332 146"
              stroke="url(#hs-ribbon-back)"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.45"
              filter="url(#hs-soft-glow)"
            />
            <path
              d="M42 128C48 64 128 34 222 48C302 60 344 102 332 146"
              stroke="#C4B5FD"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.75"
            />
            <ellipse
              cx="190"
              cy="130"
              rx="154"
              ry="84"
              transform="rotate(9 190 130)"
              stroke={primaryBlue}
              strokeWidth="1.4"
              strokeDasharray="8 10"
              opacity="0.42"
            />
          </motion.g>

          {/* Animated Handshake Assembly (Organic Pump + Breathing Clasp) */}
          <motion.g
            key={pulseBoost}
            initial={pulseBoost > 0 ? { scale: 0.96, y: 5 } : false}
            animate={{
              y: [-4 * amp, 4 * amp, -4 * amp],
              rotate: [-1.8 * amp, 1.6 * amp, -1.8 * amp],
              scale: 1,
            }}
            transition={{
              y: {
                repeat: Infinity,
                duration: cycleDuration,
                ease: 'easeInOut',
              },
              rotate: {
                repeat: Infinity,
                duration: cycleDuration,
                ease: 'easeInOut',
              },
              scale: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
            }}
            style={{ transformOrigin: '192px 132px' }}
          >
            {/* Expanding Clasp Resonance Halo */}
            <motion.circle
              cx="192"
              cy="132"
              r="36"
              fill="url(#hs-clasp-aura)"
              animate={{
                scale: [0.85, 1.32, 0.85],
                opacity: [0.32, 0.68, 0.32],
              }}
              transition={{
                repeat: Infinity,
                duration: cycleDuration,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '192px 132px' }}
            />

            {/* LEFT: HUMAN FOREARM + SUIT CUFF + ANATOMICAL HAND */}
            <motion.g
              animate={{ rotate: [-0.8, 1.1, -0.8] }}
              transition={{
                repeat: Infinity,
                duration: cycleDuration,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '165px 135px' }}
            >
              {/* Tailored Navy Suit Sleeve */}
              <path
                d="M12 162L92 134L109 178L24 208Z"
                fill="url(#hs-sleeve)"
                stroke="#334155"
                strokeWidth="1.2"
              />
              {/* Subtle Sleeve Rim Highlight */}
              <path
                d="M16 164L91 137"
                stroke="#818CF8"
                strokeOpacity="0.45"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Dress Shirt Cuff */}
              <path
                d="M88 132L104 127L120 173L104 178Z"
                fill="#E2E8F0"
                stroke="#CBD5E1"
                strokeWidth="1"
              />
              {/* Metallic Cufflink */}
              <circle cx="102" cy="164" r="3.2" fill="#94A3B8" stroke="#F8FAFC" strokeWidth="0.9" />

              {/* Human Wrist & Sculpted Palm */}
              <path
                d="M106 130C128 117 150 104 171 102C186 101 200 109 213 121C222 129 221 144 211 151L176 170C156 179 135 178 117 170L106 130Z"
                fill="url(#hs-human-skin)"
              />
              {/* Soft Inner Palm Highlight */}
              <path
                d="M116 134C135 123 153 113 170 112"
                stroke="#FDE6D4"
                strokeOpacity="0.55"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Curved Human Thumb Reaching Over Top */}
              <path
                d="M144 109C159 95 182 94 196 104C202 108 197 119 185 119C174 119 162 117 150 121Z"
                fill="url(#hs-human-skin)"
                stroke="#B07352"
                strokeWidth="0.9"
              />
              {/* Human Fingers Wrapping Under & Around */}
              <path
                d="M174 156C181 163 191 164 198 159C204 155 203 147 195 144"
                fill="url(#hs-human-shadow)"
                stroke="#9C5D3D"
                strokeWidth="0.9"
              />
              <path
                d="M161 161C168 169 178 171 186 166C191 162 190 155 182 152"
                fill="url(#hs-human-shadow)"
                stroke="#9C5D3D"
                strokeWidth="0.9"
              />
            </motion.g>

            {/* RIGHT: CYBERNETIC ROBOTIC FOREARM + ARTICULATED HAND */}
            <motion.g
              animate={{ rotate: [0.9, -1.0, 0.9] }}
              transition={{
                repeat: Infinity,
                duration: cycleDuration,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '215px 125px' }}
            >
              {/* Robotic Forearm Inner Chassis */}
              <path
                d="M242 94L352 46L368 92L255 130Z"
                fill="url(#hs-robot-dark)"
                stroke="#64748B"
                strokeWidth="1.2"
              />
              {/* Sculpted Brushed Titanium Outer Armor Plate */}
              <path
                d="M250 96L348 54L356 76L258 114Z"
                fill="url(#hs-robot-armor)"
              />
              {/* Glowing Neon Blue Conduit Along Forearm */}
              <path
                d="M258 112L348 73"
                stroke={primaryBlue}
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#hs-soft-glow)"
              />
              <path
                d="M262 112L346 75"
                stroke="#E0F2FE"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* Circular Mechanical Wrist Servo Ring */}
              <ellipse
                cx="248"
                cy="111"
                rx="11"
                ry="21"
                transform="rotate(-22 248 111)"
                fill="#0F172A"
                stroke={primaryBlue}
                strokeWidth="2.4"
              />
              <circle cx="248" cy="111" r="5" fill={primaryPurple} filter="url(#hs-soft-glow)" />

              {/* Robotic Armored Palm */}
              <path
                d="M174 108C194 94 222 89 245 96L255 129C236 142 216 153 196 156C182 158 168 144 170 127Z"
                fill="url(#hs-robot-armor)"
                stroke="#94A3B8"
                strokeWidth="1.1"
              />
              {/* Dark Cybernetic Palm Plate & Glowing Reactor Node */}
              <path
                d="M192 106C209 98 228 97 240 105L244 124C231 134 214 140 198 140Z"
                fill="url(#hs-robot-dark)"
                stroke="#475569"
                strokeWidth="1"
              />
              <circle
                cx="222"
                cy="117"
                r="6.5"
                fill="#090D18"
                stroke={primaryBlue}
                strokeWidth="2"
                filter="url(#hs-soft-glow)"
              />
              <circle cx="222" cy="117" r="2.6" fill="#E0F2FE" />

              {/* Robotic Thumb Interlocking cleanly */}
              <path
                d="M175 107C186 96 205 94 214 104C217 108 210 115 198 114L180 116Z"
                fill="url(#hs-robot-armor)"
                stroke="#CBD5E1"
                strokeWidth="0.9"
              />

              {/* 4 Smoothly Curved Articulated Cyber Fingers Wrapping Human Hand */}
              {[
                { x: 168, y: 132, w: 28, h: 10.5, rot: -20, glow: primaryBlue },
                { x: 177, y: 143, w: 28, h: 10.5, rot: -18, glow: primaryBlue },
                { x: 187, y: 153, w: 26, h: 10, rot: -17, glow: primaryPurple },
                { x: 198, y: 162, w: 22, h: 9, rot: -15, glow: primaryPurple },
              ].map((f, idx) => (
                <g key={idx} transform={`rotate(${f.rot} ${f.x} ${f.y})`}>
                  <rect
                    x={f.x}
                    y={f.y}
                    width={f.w}
                    height={f.h}
                    rx={f.h / 2}
                    fill="url(#hs-robot-armor)"
                    stroke={f.glow}
                    strokeWidth="1.2"
                  />
                  <circle cx={f.x + f.w * 0.48} cy={f.y + f.h / 2} r="2.1" fill={f.glow} />
                </g>
              ))}
            </motion.g>
          </motion.g>

          {/* Front Sweeping Glossy Neon Portal Ribbon (Overlaps Arms for 3D Depth) */}
          <motion.g
            animate={{
              y: [1.5, -2.5, 1.5],
              opacity: [0.82, 1, 0.82],
            }}
            transition={{
              repeat: Infinity,
              duration: cycleDuration * 1.4,
              ease: 'easeInOut',
            }}
          >
            <path
              d="M42 142C94 212 252 216 336 138"
              stroke="url(#hs-ribbon-front)"
              strokeWidth="13"
              strokeLinecap="round"
              opacity="0.48"
              filter="url(#hs-soft-glow)"
            />
            <path
              d="M42 142C94 212 252 216 336 138"
              stroke="url(#hs-ribbon-front)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </motion.g>

          {/* Subtle Floating Neon Energy Motes */}
          {[
            { cx: 88, cy: 76, r: 2.8, delay: 0, color: '#93C5FD' },
            { cx: 294, cy: 176, r: 2.5, delay: 0.9, color: '#C084FC' },
            { cx: 142, cy: 196, r: 2.2, delay: 1.5, color: '#60A5FA' },
            { cx: 244, cy: 62, r: 2.6, delay: 2.1, color: '#E9D5FF' },
          ].map((dot, idx) => (
            <motion.circle
              key={idx}
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              fill={dot.color}
              animate={{
                y: [-5, 5, -5],
                opacity: [0.35, 0.95, 0.35],
              }}
              transition={{
                repeat: Infinity,
                duration: 3.2 + idx * 0.5,
                delay: dot.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
};
