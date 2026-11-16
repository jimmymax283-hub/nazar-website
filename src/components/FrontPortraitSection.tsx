import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { ArrowDown, ArrowRight, Image as ImageIcon, Pencil, Upload } from 'lucide-react';
import { EditorSectionKey, SiteConfig } from '../types/siteConfig';
import { InlineEditableText } from './InlineEditableText';
import { NJEmblem } from './NJEmblem';

interface FrontPortraitSectionProps {
  config: SiteConfig;
  editMode: boolean;
  onChange: (next: SiteConfig) => void;
  onOpenEditor: (tab: EditorSectionKey) => void;
  onUploadPhoto: () => void;
  onContactClick: () => void;
}

export const FrontPortraitSection: React.FC<FrontPortraitSectionProps> = ({
  config,
  editMode,
  onChange,
  onOpenEditor,
  onUploadPhoto,
  onContactClick,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const strength = config.portrait.scroll3DStrength;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 22,
    mass: 0.45,
  });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { stiffness: 180, damping: 24 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 180, damping: 24 });

  // Scroll-driven 3D model tilt, depth scale & parallax lift
  const scrollRotY = useTransform(
    smoothScroll,
    [0, 0.5, 1],
    [-4 * strength, 9 * strength, -12 * strength]
  );
  const scrollRotX = useTransform(
    smoothScroll,
    [0, 0.5, 1],
    [2 * strength, -5 * strength, 8 * strength]
  );
  const scrollY = useTransform(
    smoothScroll,
    [0, 1],
    [0, 36 * strength]
  );
  const scrollScale = useTransform(
    smoothScroll,
    [0, 0.45, 1],
    [1, 1 + 0.03 * strength, Math.max(0.9, 1 - 0.05 * strength)]
  );
  const sheenX = useTransform(smoothScroll, [0, 1], ['-35%', '120%']);

  const combinedRotY = useTransform(
    [scrollRotY, smoothPointerX],
    ([sr, px]: number[]) => sr + px * 8
  );
  const combinedRotX = useTransform(
    [scrollRotX, smoothPointerY],
    ([sr, py]: number[]) => sr - py * 6
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    pointerX.set(nx);
    pointerY.set(ny);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const hasCustomImage = Boolean(config.portrait.imageDataUrl.trim());

  return (
    <section
      ref={sectionRef}
      id="portrait"
      className="relative pt-8 pb-12 lg:pt-10 lg:pb-16 overflow-x-clip"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left / Front Full Image 3D Stage */}
          <div
            className="lg:col-span-7 relative"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            {/* Ambient Neon Glow Ring Behind Full Photo */}
            <div
              className="pointer-events-none absolute -inset-4 rounded-[32px] opacity-60 blur-3xl"
              style={{
                background: `radial-gradient(circle at 30% 25%, ${config.theme.primaryBlue}55, transparent 60%), radial-gradient(circle at 75% 75%, ${config.theme.primaryPurple}60, transparent 65%)`,
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{
                transformPerspective: 1200,
                transformStyle: 'preserve-3d',
                rotateX: combinedRotX,
                rotateY: combinedRotY,
                y: scrollY,
                scale: scrollScale,
              }}
              className="relative rounded-3xl p-[2px] shadow-[0_24px_80px_rgba(59,130,246,0.22),0_18px_60px_rgba(139,92,246,0.28)]"
            >
              {/* Animated Neon Border Shell */}
              <div
                className="absolute inset-0 rounded-3xl opacity-85"
                style={{
                  background: `linear-gradient(135deg, ${config.theme.primaryBlue} 0%, #c084fc 50%, ${config.theme.primaryPurple} 100%)`,
                }}
              />

              {/* Full Image Glass Container */}
              <div className="relative rounded-[22px] overflow-hidden bg-[#070518] aspect-[4/3] sm:aspect-[16/10] w-full flex items-center justify-center">
                {hasCustomImage ? (
                  <img
                    src={config.portrait.imageDataUrl}
                    alt={`${config.portrait.caption} — ${config.portrait.badgeText}`}
                    className={`w-full h-full ${
                      config.portrait.imageFit === 'contain'
                        ? 'object-contain bg-[#060414]'
                        : 'object-cover object-top'
                    }`}
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0b0724] via-[#130d38] to-[#08051a]">
                    {/* Bespoke Studio Founder Portrait Artwork Fallback */}
                    <svg
                      viewBox="0 0 800 500"
                      className="w-full h-full"
                      preserveAspectRatio="xMidYMid slice"
                      aria-label="Founder Studio Portrait Frame"
                    >
                      <defs>
                        <radialGradient id="studioSpot" cx="50%" cy="32%" r="58%">
                          <stop
                            offset="0%"
                            stopColor={config.theme.primaryPurple}
                            stopOpacity="0.45"
                          />
                          <stop
                            offset="55%"
                            stopColor={config.theme.primaryBlue}
                            stopOpacity="0.2"
                          />
                          <stop offset="100%" stopColor="#060414" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1e1b4b" />
                          <stop offset="50%" stopColor="#0f0b29" />
                          <stop offset="100%" stopColor="#050312" />
                        </linearGradient>
                        <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={config.theme.primaryBlue} />
                          <stop offset="100%" stopColor={config.theme.primaryPurple} />
                        </linearGradient>
                      </defs>

                      <rect width="800" height="500" fill="#070518" />
                      <rect width="800" height="500" fill="url(#studioSpot)" />

                      {/* Subtle Architectural Grid Lines */}
                      <g stroke="#8b5cf6" strokeOpacity="0.1" strokeWidth="1">
                        <line x1="0" y1="390" x2="800" y2="390" />
                        <line x1="0" y1="435" x2="800" y2="435" />
                        <line x1="160" y1="0" x2="160" y2="500" />
                        <line x1="640" y1="0" x2="640" y2="500" />
                      </g>

                      {/* Glowing Studio Halo Behind Silhouette */}
                      <circle
                        cx="400"
                        cy="220"
                        r="142"
                        fill="none"
                        stroke="url(#rimGrad)"
                        strokeWidth="2.5"
                        strokeOpacity="0.55"
                      />
                      <circle
                        cx="400"
                        cy="220"
                        r="164"
                        fill="none"
                        stroke={config.theme.primaryBlue}
                        strokeWidth="1"
                        strokeOpacity="0.25"
                        strokeDasharray="8 10"
                      />

                      {/* Executive Silhouette */}
                      <path
                        d="M225 500 C230 398, 295 344, 400 344 C505 344, 570 398, 575 500 Z"
                        fill="url(#suitGrad)"
                        stroke="url(#rimGrad)"
                        strokeWidth="2.5"
                      />
                      {/* Lapel & Collar Accents */}
                      <path
                        d="M352 348 L400 442 L448 348"
                        fill="none"
                        stroke="#c4b5fd"
                        strokeOpacity="0.45"
                        strokeWidth="2"
                      />
                      {/* Neck & Head Silhouette */}
                      <rect
                        x="375"
                        y="272"
                        width="50"
                        height="84"
                        rx="22"
                        fill="#110d2e"
                      />
                      <ellipse
                        cx="400"
                        cy="210"
                        rx="66"
                        ry="78"
                        fill="#140f36"
                        stroke="url(#rimGrad)"
                        strokeWidth="2.5"
                      />
                    </svg>

                    {/* Studio Upload CTA Overlay inside Empty Portrait (Edit Mode only) */}
                    {editMode && (
                      <div className="absolute inset-0 flex flex-col items-center justify-end pb-14 px-6 text-center pointer-events-none">
                        <button
                          type="button"
                          onClick={onUploadPhoto}
                          className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-violet-600/80 border border-white/25 hover:border-violet-300 text-xs font-semibold text-white transition-colors shadow-lg"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Your Full Photo</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Subtle Bottom Readability Vignette */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050311]/90 via-[#050311]/45 to-transparent" />

                {/* Diagonal Scroll-Linked Holographic Light Sheen */}
                <motion.div
                  aria-hidden="true"
                  style={{ left: sheenX }}
                  className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/12 to-transparent -skew-x-12"
                />

                {/* Bottom Caption Bar inside Frame */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 pointer-events-none">
                  <div className="pointer-events-auto">
                    <div className="font-display text-lg sm:text-xl font-bold text-white leading-tight drop-shadow">
                      {config.portrait.caption}
                    </div>
                    <div className="text-xs text-violet-200/90 font-medium">
                      {config.portrait.badgeText}
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#07051a]/80 border border-white/15">
                    <NJEmblem monogram={config.brand.monogram} size={22} />
                    <span className="text-[11px] font-medium text-slate-200">
                      Scroll 3D View
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Edit Controls Below Image when Edit Mode Active */}
            {editMode && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onUploadPhoto}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {hasCustomImage ? 'Change My Photo' : 'Upload My Photo'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...config,
                      portrait: {
                        ...config.portrait,
                        imageFit:
                          config.portrait.imageFit === 'cover'
                            ? 'contain'
                            : 'cover',
                      },
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-medium text-slate-200 transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-blue-300" />
                  Fit:{' '}
                  {config.portrait.imageFit === 'cover'
                    ? 'Fill Frame'
                    : 'Full Uncropped'}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenEditor('portrait')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-medium text-slate-200 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5 text-violet-300" />
                  Edit Front Image
                </button>
              </div>
            )}
          </div>

          {/* Right Editorial Profile Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-5"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold tracking-wide text-violet-300">
                <span className="h-px w-7 bg-violet-400/70" />
                <InlineEditableText
                  value={config.portrait.badgeText}
                  editMode={editMode}
                  onChange={(v) =>
                    onChange({
                      ...config,
                      portrait: { ...config.portrait, badgeText: v },
                    })
                  }
                />
              </div>
              {editMode && (
                <button
                  type="button"
                  onClick={() => onOpenEditor('portrait')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-violet-600/90 hover:bg-violet-500 text-xs font-semibold text-white border border-violet-300/30"
                >
                  <Pencil className="w-3 h-3" />
                  Edit Section
                </button>
              )}
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight leading-[1.12] text-white text-balance">
              <InlineEditableText
                value={config.portrait.headline}
                editMode={editMode}
                onChange={(v) =>
                  onChange({
                    ...config,
                    portrait: { ...config.portrait, headline: v },
                  })
                }
              />
            </h2>

            <InlineEditableText
              as="p"
              multiline
              value={config.portrait.subtext}
              editMode={editMode}
              className="text-sm sm:text-base text-slate-300/90 leading-relaxed"
              onChange={(v) =>
                onChange({
                  ...config,
                  portrait: { ...config.portrait, subtext: v },
                })
              }
            />

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onContactClick}
                className="neon-cta-btn inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold text-white whitespace-nowrap shrink-0"
              >
                <span>{config.portrait.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#hero-brand"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/15 text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                <span>Explore 3D {config.brand.monogram} Brand</span>
                <ArrowDown className="w-3.5 h-3.5 text-violet-300" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
