import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion, MotionConfig, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  ArrowUp,
  Award,
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  Menu,
  Phone,
  Play,
  Plus,
  Star,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { compressImageFileToDataUrl } from './utils/imageUpload';
import { DEFAULT_SITE_CONFIG } from './data/defaultSiteConfig';
import {
  EditorSectionKey,
  PageSectionId,
  ServiceItem,
  SiteConfig,
  SocialPlatform,
} from './types/siteConfig';
import { NJEmblem } from './components/NJEmblem';
import { Hero3DLogo } from './components/Hero3DLogo';
import { FrontPortraitSection } from './components/FrontPortraitSection';
import { InteractiveParticleField } from './components/InteractiveParticleField';
import { NeonCursorEffect } from './components/NeonCursorEffect';
import { WhatsAppButton } from './components/WhatsAppButton';
import { VisitorChatbot } from './components/VisitorChatbot';
import {
  HandshakeGraphic,
  PortfolioSceneGraphic,
  ServiceIconGraphic,
} from './components/VisualGraphics';
import {
  AboutModal,
  ContactModal,
  IntroModal,
  PortfolioModal,
  ServiceDetailModal,
} from './components/Modals';
import { Motion3DCard } from './components/Motion3DCard';
import { InlineEditableText } from './components/InlineEditableText';

const AgencyLocationMap = lazy(() =>
  import('./components/AgencyLocationMap').then((m) => ({
    default: m.AgencyLocationMap,
  }))
);
const Laptop3DShowcase = lazy(() =>
  import('./components/Laptop3DShowcase').then((m) => ({
    default: m.Laptop3DShowcase,
  }))
);

const STORAGE_KEY = 'nj_agency_site_config_v1';

const SECTION_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SECTION_VIEWPORT = { once: true, amount: 0.12 } as const;

const SocialIconSvg: React.FC<{ platform: SocialPlatform }> = ({ platform }) => {
  switch (platform) {
    case 'facebook':
      return <span className="font-display font-bold text-sm">f</span>;
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M21.58 7.19a2.75 2.75 0 0 0-1.94-1.95C17.93 4.75 12 4.75 12 4.75s-5.93 0-7.64.49A2.75 2.75 0 0 0 2.42 7.2 28.7 28.7 0 0 0 2 12a28.7 28.7 0 0 0 .42 4.81 2.75 2.75 0 0 0 1.94 1.95c1.71.49 7.64.49 7.64.49s5.93 0 7.64-.49a2.75 2.75 0 0 0 1.94-1.95A28.7 28.7 0 0 0 22 12a28.7 28.7 0 0 0-.42-4.81ZM10 15.2V8.8l5.5 3.2L10 15.2Z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.34 0 .66.06.96.16V8.98a6.33 6.33 0 0 0-.96-.08A6.34 6.34 0 0 0 3 15.24 6.34 6.34 0 0 0 9.34 21.58a6.34 6.34 0 0 0 6.34-6.34V8.88a8.2 8.2 0 0 0 4.78 1.52V6.96c-.3 0-.59-.09-.87-.27Z" />
        </svg>
      );
    case 'linkedin':
      return <span className="font-display font-bold text-xs">in</span>;
    case 'x':
      return <span className="font-display font-bold text-xs">𝕏</span>;
  }
};

function mergeSiteConfig(raw: unknown): SiteConfig {
  if (!raw || typeof raw !== 'object') return DEFAULT_SITE_CONFIG;
  const parsed = raw as Partial<SiteConfig> & {
    layout?: { sections?: { id: PageSectionId; label: string; visible: boolean }[] };
    services?: { items?: ServiceItem[] };
    about?: { specialties?: string[] };
    contact?: Partial<SiteConfig['contact']>;
  };

  const savedSections: { id: PageSectionId; label: string; visible: boolean }[] =
    Array.isArray(parsed.layout?.sections) ? parsed.layout.sections : [];
  const existingIds = new Set(savedSections.map((s) => s.id));
  const frontDefaults = DEFAULT_SITE_CONFIG.layout.sections.filter(
    (s) =>
      (s.id === 'front-portrait' || s.id === 'hero') &&
      !existingIds.has(s.id)
  );
  const trailingDefaults = DEFAULT_SITE_CONFIG.layout.sections.filter(
    (s) => s.id === 'location-map' && !existingIds.has(s.id)
  );
  const mergedSections =
    savedSections.length > 0
      ? [...frontDefaults, ...savedSections, ...trailingDefaults]
      : DEFAULT_SITE_CONFIG.layout.sections;

  const videoEditingDefault =
    DEFAULT_SITE_CONFIG.services.items.find(
      (item) => item.id === 'srv-video-editing'
    ) ?? DEFAULT_SITE_CONFIG.services.items[4];

  const savedServicesItems: ServiceItem[] = Array.isArray(parsed.services?.items)
    ? parsed.services.items.map((item: ServiceItem) =>
        item.id === 'srv-graphic-design' ||
        item.title?.trim().toLowerCase() === 'graphic design'
          ? {
              ...videoEditingDefault,
              imageUrl: item.imageUrl,
              imageFit: item.imageFit,
            }
          : item
      )
    : DEFAULT_SITE_CONFIG.services.items;

  const savedSpecialties: string[] = Array.isArray(parsed.about?.specialties)
    ? parsed.about.specialties.map((s: string) =>
        s.trim().toLowerCase() === 'creative designer' ? 'Video Editor' : s
      )
    : DEFAULT_SITE_CONFIG.about.specialties;

  return {
    ...DEFAULT_SITE_CONFIG,
    ...parsed,
    brand: { ...DEFAULT_SITE_CONFIG.brand, ...parsed.brand },
    theme: { ...DEFAULT_SITE_CONFIG.theme, ...parsed.theme },
    portrait: { ...DEFAULT_SITE_CONFIG.portrait, ...parsed.portrait },
    services: {
      ...DEFAULT_SITE_CONFIG.services,
      ...parsed.services,
      items: savedServicesItems,
    },
    about: {
      ...DEFAULT_SITE_CONFIG.about,
      ...parsed.about,
      specialties: savedSpecialties,
    },
    contact: {
      ...DEFAULT_SITE_CONFIG.contact,
      ...parsed.contact,
      email:
        !parsed.contact?.email ||
        parsed.contact.email === 'hello@nazarjalalzai.com'
          ? DEFAULT_SITE_CONFIG.contact.email
          : parsed.contact.email,
      phone:
        !parsed.contact?.phone ||
        parsed.contact.phone === '+971 50 482 1930'
          ? DEFAULT_SITE_CONFIG.contact.phone
          : parsed.contact.phone,
      location:
        !parsed.contact?.location ||
        parsed.contact.location === 'Dubai · Remote Worldwide'
          ? DEFAULT_SITE_CONFIG.contact.location
          : parsed.contact.location,
      studioMap: {
        ...DEFAULT_SITE_CONFIG.contact.studioMap,
        ...parsed.contact?.studioMap,
      },
    },
    layout: { sections: mergedSections },
  };
}

export default function App() {
  const hasSavedLocalConfigRef = useRef(false);
  const allowServerSyncRef = useRef(false);

  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        hasSavedLocalConfigRef.current = true;
        return mergeSiteConfig(JSON.parse(saved));
      }
    } catch {
      // Fallback to default
    }
    return DEFAULT_SITE_CONFIG;
  });

  const persistConfigToServer = async (nextConfig: SiteConfig) => {
    try {
      await fetch('/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: nextConfig }),
      });
    } catch {
      // Non-blocking fallback; localStorage remains intact
    }
  };

  useEffect(() => {
    let active = true;
    const syncInitialServerConfig = async () => {
      try {
        let loadedConfig: unknown = null;
        let hasRemote = false;

        try {
          const res = await fetch('/api/site-config');
          const contentType = res.headers.get('content-type') || '';
          if (res.ok && contentType.includes('application/json')) {
            const data = (await res.json()) as {
              exists?: boolean;
              config?: unknown;
            };
            if (data.exists && data.config) {
              loadedConfig = data.config;
              hasRemote = true;
            }
          }
        } catch {
          // API route unavailable on static hosts like GitHub Pages
        }

        // Static hosting fallback (GitHub Pages ./site-config.json)
        if (!hasRemote) {
          try {
            const staticRes = await fetch('./site-config.json');
            const staticType = staticRes.headers.get('content-type') || '';
            if (staticRes.ok && staticType.includes('application/json')) {
              const staticData = (await staticRes.json()) as Record<string, unknown>;
              if (staticData && staticData.brand && staticData.services) {
                loadedConfig = staticData;
                hasRemote = true;
              }
            }
          } catch {
            // Optional static config absent
          }
        }

        if (!active) return;

        if (hasRemote && loadedConfig) {
          if (!hasSavedLocalConfigRef.current) {
            const hydrated = mergeSiteConfig(loadedConfig);
            setConfig(hydrated);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(hydrated));
            } catch {
              // Ignore quota errors
            }
          }
        } else if (hasSavedLocalConfigRef.current) {
          // Promote pre-existing local edits to server persistence automatically
          await persistConfigToServer(config);
        }
      } catch {
        // Ignore network errors during initial hydration
      }
    };
    void syncInitialServerConfig();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Ignore storage quota errors
    }

    if (!allowServerSyncRef.current) return;
    const timer = window.setTimeout(() => {
      void persistConfigToServer(config);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [config]);

  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);
  useEffect(() => {
    const onQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () =>
      window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  useEffect(() => {
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`;
    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    let ogUrl = document.querySelector<HTMLMetaElement>(
      'meta[property="og:url"]'
    );
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = canonicalUrl;
  }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const editMode = false;

  // Interactive modals
  const [introOpen, setIntroOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [portfolioModalState, setPortfolioModalState] = useState<{
    open: boolean;
    projectId: string | null;
  }>({ open: false, projectId: null });
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalState, setContactModalState] = useState<{
    open: boolean;
    subject: string;
  }>({ open: false, subject: '' });

  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const quickPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const servicePhotoInputRef = useRef<HTMLInputElement | null>(null);
  const uploadingServiceIdRef = useRef<string | null>(null);
  const portfolioPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const uploadingProjectIdRef = useRef<string | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroSectionRef,
    offset: ['start start', 'end start'],
  });
  const heroStageY = useTransform(heroScrollProgress, [0, 1], [0, 36]);
  const heroStageScale = useTransform(heroScrollProgress, [0, 1], [1, 0.95]);

  const handleQuickPhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await compressImageFileToDataUrl(file, 1200, 0.88);
      setConfig((prev) => ({
        ...prev,
        portrait: {
          ...prev.portrait,
          imageDataUrl: dataUrl,
        },
      }));
    } catch {
      // Ignore invalid image files
    }
  };

  const handleServicePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    const targetId = uploadingServiceIdRef.current;
    e.target.value = '';
    if (!file || !targetId) return;
    try {
      const dataUrl = await compressImageFileToDataUrl(file, 960, 0.86);
      setConfig((prev) => ({
        ...prev,
        services: {
          ...prev.services,
          items: prev.services.items.map((item) =>
            item.id === targetId
              ? {
                  ...item,
                  imageUrl: dataUrl,
                  imageFit: 'contain',
                }
              : item
          ),
        },
      }));
    } catch {
      // Ignore invalid image files
    } finally {
      uploadingServiceIdRef.current = null;
    }
  };

  const handlePortfolioPhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    const targetId = uploadingProjectIdRef.current;
    e.target.value = '';
    if (!file || !targetId) return;
    try {
      const dataUrl = await compressImageFileToDataUrl(file, 960, 0.86);
      setConfig((prev) => ({
        ...prev,
        portfolio: {
          ...prev.portfolio,
          projects: prev.portfolio.projects.map((proj) =>
            proj.id === targetId
              ? {
                  ...proj,
                  imageUrl: dataUrl,
                  imageFit: 'contain',
                }
              : proj
          ),
        },
      }));
    } catch {
      // Ignore invalid image files
    } finally {
      uploadingProjectIdRef.current = null;
    }
  };

  const safeTestimonialIdx =
    config.testimonials.items.length > 0
      ? testimonialIdx % config.testimonials.items.length
      : 0;
  const activeTestimonial = config.testimonials.items[safeTestimonialIdx];

  const openEditorSection = (_tab: EditorSectionKey) => {};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const EditBadge: React.FC<{ section: EditorSectionKey; label: string }> = () =>
    null;

  const renderSection = (sectionId: PageSectionId) => {
    switch (sectionId) {
      case 'front-portrait':
        return (
          <FrontPortraitSection
            key="front-portrait"
            config={config}
            editMode={editMode}
            onChange={setConfig}
            onOpenEditor={openEditorSection}
            onUploadPhoto={() => quickPhotoInputRef.current?.click()}
            onContactClick={() =>
              setContactModalState({ open: true, subject: '' })
            }
          />
        );

      case 'hero':
        return (
          <section
            key="hero"
            id="hero-brand"
            ref={heroSectionRef}
            className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-20"
          >
            <InteractiveParticleField
              primaryBlue={config.theme.primaryBlue}
              primaryPurple={config.theme.primaryPurple}
              glowIntensity={config.theme.glowIntensity}
              floatIntensity={config.theme.floatIntensity}
              count={52}
            />
            <div className="relative z-10 max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
                {/* Left Copy Column */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={SECTION_VIEWPORT}
                  transition={{ duration: 0.5, ease: SECTION_EASE }}
                  className="lg:col-span-6 space-y-6"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <InlineEditableText
                      value={config.hero.kicker}
                      editMode={editMode}
                      className="text-xs sm:text-sm font-semibold tracking-wide text-violet-300"
                      onChange={(v) =>
                        setConfig((c) => ({
                          ...c,
                          hero: { ...c.hero, kicker: v },
                        }))
                      }
                    />
                    <EditBadge section="hero" label="Hero" />
                  </div>

                  <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.08] text-white text-balance">
                    <InlineEditableText
                      as="span"
                      value={config.hero.headlineLine1}
                      editMode={editMode}
                      className="block"
                      onChange={(v) =>
                        setConfig((c) => ({
                          ...c,
                          hero: { ...c.hero, headlineLine1: v },
                        }))
                      }
                    />
                    <span
                      className="block mt-1"
                      style={{
                        backgroundImage: `linear-gradient(95deg, ${config.theme.primaryPurple} 0%, #c084fc 50%, ${config.theme.primaryBlue} 100%)`,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      <InlineEditableText
                        value={config.hero.headlineLine2}
                        editMode={editMode}
                        className={editMode ? 'text-violet-300' : ''}
                        onChange={(v) =>
                          setConfig((c) => ({
                            ...c,
                            hero: { ...c.hero, headlineLine2: v },
                          }))
                        }
                      />
                    </span>
                  </h1>

                  <InlineEditableText
                    as="p"
                    value={config.hero.subheadline}
                    editMode={editMode}
                    className="font-display text-lg sm:text-xl font-medium text-slate-200"
                    onChange={(v) =>
                      setConfig((c) => ({
                        ...c,
                        hero: { ...c.hero, subheadline: v },
                      }))
                    }
                  />

                  <InlineEditableText
                    as="p"
                    multiline
                    value={config.hero.description}
                    editMode={editMode}
                    className="text-sm sm:text-base text-slate-300/90 max-w-lg leading-relaxed"
                    onChange={(v) =>
                      setConfig((c) => ({
                        ...c,
                        hero: { ...c.hero, description: v },
                      }))
                    }
                  />

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setContactModalState({ open: true, subject: '' })
                      }
                      className="neon-cta-btn inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold text-white whitespace-nowrap shrink-0"
                    >
                      <span>{config.hero.primaryCtaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIntroOpen(true)}
                      className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors whitespace-nowrap shrink-0"
                    >
                      <span className="w-9 h-9 rounded-full border border-white/25 bg-white/[0.05] flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </span>
                      <span>{config.hero.secondaryCtaText}</span>
                    </button>
                  </div>
                </motion.div>

                {/* Right 3D Rotating NJ Logo Sphere Focal Anchor */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={SECTION_VIEWPORT}
                  transition={{ duration: 0.55, delay: 0.08, ease: SECTION_EASE }}
                  style={{ y: heroStageY, scale: heroStageScale }}
                  className="lg:col-span-6 relative"
                >
                  <Hero3DLogo
                    monogram={config.brand.monogram}
                    primaryBlue={config.theme.primaryBlue}
                    primaryPurple={config.theme.primaryPurple}
                    rotationSpeed={config.theme.rotationSpeed}
                    glowIntensity={config.theme.glowIntensity}
                    full3DSpin={config.theme.full3DSpin}
                    floatIntensity={config.theme.floatIntensity}
                  />
                  <p className="text-center text-xs text-slate-400 mt-1">
                    Drag to rotate 3D {config.brand.monogram} emblem
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Neon Wave Horizon Divider */}
            <div className="mt-10 pointer-events-none">
              <svg
                viewBox="0 0 1440 70"
                className="w-full h-12 sm:h-16"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d="M0 38C240 12 480 62 720 38C960 14 1200 56 1440 28"
                  stroke={config.theme.primaryPurple}
                  strokeOpacity="0.45"
                  strokeWidth="2"
                />
                <path
                  d="M0 48C320 68 620 12 960 44C1180 62 1340 34 1440 42"
                  stroke={config.theme.primaryBlue}
                  strokeOpacity="0.35"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </section>
        );

      case 'services':
        return (
          <motion.section
            key="services"
            id="services"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={SECTION_VIEWPORT}
            transition={{ duration: 0.55, ease: SECTION_EASE }}
            className="py-16 lg:py-20"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
                <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-medium text-slate-300">
                  <span className="h-px w-8 bg-violet-400/50" />
                  <InlineEditableText
                    value={config.services.kicker}
                    editMode={editMode}
                    onChange={(v) =>
                      setConfig((c) => ({
                        ...c,
                        services: { ...c.services, kicker: v },
                      }))
                    }
                  />
                  <span className="h-px w-8 bg-violet-400/50" />
                </div>

                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white text-balance">
                  <InlineEditableText
                    value={config.services.headingPrefix}
                    editMode={editMode}
                    onChange={(v) =>
                      setConfig((c) => ({
                        ...c,
                        services: { ...c.services, headingPrefix: v },
                      }))
                    }
                  />{' '}
                  <InlineEditableText
                    value={config.services.headingHighlight}
                    editMode={editMode}
                    className="neon-gradient-text"
                    onChange={(v) =>
                      setConfig((c) => ({
                        ...c,
                        services: { ...c.services, headingHighlight: v },
                      }))
                    }
                  />
                </h2>

                <InlineEditableText
                  as="p"
                  value={config.services.subtitle}
                  editMode={editMode}
                  className="text-sm sm:text-base text-slate-300/90"
                  onChange={(v) =>
                    setConfig((c) => ({
                      ...c,
                      services: { ...c.services, subtitle: v },
                    }))
                  }
                />

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <EditBadge section="services" label="Services" />
                  {editMode && (
                    <button
                      type="button"
                      onClick={() =>
                        setConfig((c) => ({
                          ...c,
                          services: {
                            ...c.services,
                            items: [
                              ...c.services.items,
                              {
                                id: `srv-${Date.now()}`,
                                title: 'New Service',
                                tagline: 'Strategy. Execute. Scale.',
                                description: 'Custom digital growth service.',
                                deliverables: [
                                  'Strategy audit',
                                  'Monthly sprint',
                                ],
                                iconKey: 'analytics',
                                imageFit: 'contain',
                              },
                            ],
                          },
                        }))
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.08] hover:bg-violet-600/80 text-xs font-semibold text-white border border-white/15 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Service Card
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                {config.services.items.map((service, idx) => (
                  <Motion3DCard
                    key={service.id}
                    delay={idx * 0.06}
                    enabled={config.theme.cardTilt3D}
                    onClick={() => setSelectedService(service)}
                    className="glass-service-card group relative rounded-2xl p-4 flex flex-col items-center text-center min-h-[260px] justify-between focus-visible:outline-2 focus-visible:outline-violet-400"
                  >
                    <div className="w-full flex flex-col items-center gap-3.5 pt-1">
                      {service.imageUrl ? (
                        <div
                          className={`w-full rounded-xl overflow-hidden border border-violet-400/25 bg-[#080417]/80 transition-transform duration-200 group-hover:scale-[1.02] ${
                            service.imageFit === 'cover' ? 'aspect-[4/3]' : ''
                          }`}
                        >
                          <img
                            src={service.imageUrl}
                            alt={service.title}
                            referrerPolicy="no-referrer"
                            className={
                              service.imageFit === 'cover'
                                ? 'w-full h-full object-cover'
                                : 'w-full h-auto max-h-72 object-contain block mx-auto'
                            }
                          />
                        </div>
                      ) : (
                        <div className="h-24 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                          <ServiceIconGraphic iconKey={service.iconKey} />
                        </div>
                      )}

                      {editMode && (
                        <div
                          className="w-full flex flex-wrap items-center justify-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              uploadingServiceIdRef.current = service.id;
                              servicePhotoInputRef.current?.click();
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-violet-600/90 hover:bg-violet-500 text-[11px] font-semibold text-white border border-violet-300/30 transition-colors"
                          >
                            <Upload className="w-3 h-3" />
                            {service.imageUrl ? 'Change Image' : 'Upload Image'}
                          </button>
                          {service.imageUrl && (
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfig((c) => ({
                                    ...c,
                                    services: {
                                      ...c.services,
                                      items: c.services.items.map((item) =>
                                        item.id === service.id
                                          ? {
                                              ...item,
                                              imageFit:
                                                item.imageFit === 'cover'
                                                  ? 'contain'
                                                  : 'cover',
                                            }
                                          : item
                                      ),
                                    },
                                  }));
                                }}
                                className="px-2 py-1 rounded-md bg-white/[0.08] hover:bg-white/15 text-[10px] font-medium text-slate-200 border border-white/15 transition-colors"
                                title="Toggle full image vs cropped fill"
                              >
                                {service.imageFit === 'cover'
                                  ? 'Fit: Crop'
                                  : 'Fit: Full'}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfig((c) => ({
                                    ...c,
                                    services: {
                                      ...c.services,
                                      items: c.services.items.map((item) =>
                                        item.id === service.id
                                          ? { ...item, imageUrl: undefined }
                                          : item
                                      ),
                                    },
                                  }));
                                }}
                                className="px-2 py-1 rounded-md bg-white/[0.06] hover:bg-rose-500/25 text-[10px] font-medium text-slate-300 hover:text-rose-200 border border-white/10 transition-colors"
                                title="Switch back to 3D icon"
                              >
                                Icon
                              </button>
                            </>
                          )}
                          {config.services.items.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfig((c) => ({
                                  ...c,
                                  services: {
                                    ...c.services,
                                    items: c.services.items.filter(
                                      (item) => item.id !== service.id
                                    ),
                                  },
                                }));
                              }}
                              className="p-1 rounded-md bg-white/[0.06] hover:bg-rose-500/25 text-slate-300 hover:text-rose-300 border border-white/10 transition-colors"
                              aria-label={`Delete ${service.title}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}

                      <div
                        className="space-y-1.5 w-full"
                        onClick={(e) => {
                          if (editMode) e.stopPropagation();
                        }}
                      >
                        <h3 className="font-display text-base font-bold text-white leading-snug">
                          <InlineEditableText
                            value={service.title}
                            editMode={editMode}
                            onChange={(v) =>
                              setConfig((c) => ({
                                ...c,
                                services: {
                                  ...c.services,
                                  items: c.services.items.map((item) =>
                                    item.id === service.id
                                      ? { ...item, title: v }
                                      : item
                                  ),
                                },
                              }))
                            }
                          />
                        </h3>
                        <div className="text-xs text-slate-300/85 leading-relaxed">
                          <InlineEditableText
                            as="p"
                            value={service.tagline}
                            editMode={editMode}
                            onChange={(v) =>
                              setConfig((c) => ({
                                ...c,
                                services: {
                                  ...c.services,
                                  items: c.services.items.map((item) =>
                                    item.id === service.id
                                      ? { ...item, tagline: v }
                                      : item
                                  ),
                                },
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex items-center justify-between pt-4">
                      {editMode ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditorSection('services');
                          }}
                          className="text-[11px] font-medium text-violet-300 hover:text-white underline underline-offset-2"
                        >
                          Edit details
                        </button>
                      ) : (
                        <span />
                      )}
                      <span className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-400/40 group-hover:bg-violet-500 group-hover:border-violet-300 flex items-center justify-center transition-colors">
                        <ArrowRight className="w-4 h-4 text-violet-200 group-hover:text-white" />
                      </span>
                    </div>
                  </Motion3DCard>
                ))}
              </div>
            </div>
          </motion.section>
        );

      case 'about':
        return (
          <motion.section
            key="about"
            id="about"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={SECTION_VIEWPORT}
            transition={{ duration: 0.55, ease: SECTION_EASE }}
            className="py-16 lg:py-24"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* Left: Interactive 3D Laptop Showcase */}
                <div className="lg:col-span-5">
                  <Suspense
                    fallback={
                      <div className="w-full h-[380px] sm:h-[420px] rounded-2xl bg-white/[0.02] border border-white/10" />
                    }
                  >
                    <Laptop3DShowcase
                      monogram={config.brand.monogram}
                      primaryBlue={config.theme.primaryBlue}
                      primaryPurple={config.theme.primaryPurple}
                      badgeText={config.about.hologramBadgeText}
                      rotationSpeed={config.theme.rotationSpeed}
                      floatIntensity={config.theme.floatIntensity}
                    />
                  </Suspense>
                </div>

                {/* Center: About Me Bio & Specialties */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-300">
                      <span className="h-px w-6 bg-violet-400/60" />
                      <InlineEditableText
                        value={config.about.kicker}
                        editMode={editMode}
                        onChange={(v) =>
                          setConfig((c) => ({
                            ...c,
                            about: { ...c.about, kicker: v },
                          }))
                        }
                      />
                    </div>
                    <EditBadge section="about" label="About & Stats" />
                  </div>

                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight text-balance">
                    <InlineEditableText
                      value={config.about.headingPrefix}
                      editMode={editMode}
                      onChange={(v) =>
                        setConfig((c) => ({
                          ...c,
                          about: { ...c.about, headingPrefix: v },
                        }))
                      }
                    />{' '}
                    <InlineEditableText
                      value={config.about.headingHighlight}
                      editMode={editMode}
                      className="neon-gradient-text"
                      onChange={(v) =>
                        setConfig((c) => ({
                          ...c,
                          about: { ...c.about, headingHighlight: v },
                        }))
                      }
                    />
                  </h2>

                  <InlineEditableText
                    as="p"
                    multiline
                    value={config.about.bio}
                    editMode={editMode}
                    className="text-sm sm:text-base text-slate-300 leading-relaxed"
                    onChange={(v) =>
                      setConfig((c) => ({
                        ...c,
                        about: { ...c.about, bio: v },
                      }))
                    }
                  />

                  <ul className="space-y-2.5 pt-1">
                    {config.about.specialties.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-sm font-medium text-slate-100"
                      >
                        <span className="w-5 h-5 rounded-full bg-violet-600/80 border border-violet-300/40 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setAboutModalOpen(true)}
                      className="neon-cta-btn inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold text-white whitespace-nowrap shrink-0"
                    >
                      <span>{config.about.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right: Impact Stats Card & Handwritten Tagline */}
                <div className="lg:col-span-3 space-y-5">
                  <div className="glass-panel rounded-2xl p-6 space-y-6">
                    {config.about.stats.map((stat, idx) => (
                      <div
                        key={stat.id}
                        className={
                          idx !== 0 ? 'pt-5 border-t border-white/10' : ''
                        }
                      >
                        <div className="flex items-center gap-3 mb-1">
                          {stat.iconKey === 'clients' && (
                            <Users className="w-5 h-5 text-violet-400" />
                          )}
                          {stat.iconKey === 'rating' && (
                            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                          )}
                          {stat.iconKey === 'reach' && (
                            <Award className="w-5 h-5 text-amber-300" />
                          )}
                          <span className="font-display text-2xl sm:text-3xl font-bold text-white tabular-nums">
                            {stat.value}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300/90">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Stylized Brand Signature */}
                  <div className="text-center lg:text-right pr-2">
                    <InlineEditableText
                      as="p"
                      value={config.brand.tagline}
                      editMode={editMode}
                      className="font-display italic font-semibold text-xl sm:text-2xl text-slate-200 tracking-tight -rotate-3 inline-block"
                      onChange={(v) =>
                        setConfig((c) => ({
                          ...c,
                          brand: { ...c.brand, tagline: v },
                        }))
                      }
                    />
                    <div className="h-0.5 w-36 bg-gradient-to-r from-transparent via-violet-400 to-blue-400 ml-auto mt-1 rounded-full opacity-70" />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        );

      case 'portfolio':
        return (
          <motion.section
            key="portfolio"
            id="portfolio"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={SECTION_VIEWPORT}
            transition={{ duration: 0.55, ease: SECTION_EASE }}
            className="relative overflow-hidden py-16 lg:py-20"
          >
            <InteractiveParticleField
              primaryBlue={config.theme.primaryBlue}
              primaryPurple={config.theme.primaryPurple}
              glowIntensity={config.theme.glowIntensity}
              floatIntensity={config.theme.floatIntensity}
              count={44}
            />
            <div className="relative z-10 max-w-7xl mx-auto px-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-300">
                      <span className="h-px w-6 bg-violet-400/60" />
                      <InlineEditableText
                        value={config.portfolio.kicker}
                        editMode={editMode}
                        onChange={(v) =>
                          setConfig((c) => ({
                            ...c,
                            portfolio: { ...c.portfolio, kicker: v },
                          }))
                        }
                      />
                    </div>
                    <EditBadge section="portfolio" label="Portfolio" />
                    {editMode && (
                      <button
                        type="button"
                        onClick={() =>
                          setConfig((c) => ({
                            ...c,
                            portfolio: {
                              ...c.portfolio,
                              projects: [
                                ...c.portfolio.projects,
                                {
                                  id: `proj-${Date.now()}`,
                                  title: 'New Growth Case Study',
                                  category: 'Performance Marketing',
                                  visualType: 'growth-bars',
                                  imageFit: 'contain',
                                  metric: '+180% Revenue Growth',
                                  client: 'Client Brand',
                                  summary: 'Full-funnel digital transformation.',
                                  strategy: 'Paid social + landing page testing.',
                                  outcome: 'Scaled monthly revenue profitably.',
                                  tags: ['Meta Ads', 'Strategy'],
                                },
                              ],
                            },
                          }))
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.08] hover:bg-violet-600/80 text-xs font-semibold text-white border border-white/15 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Project
                      </button>
                    )}
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-white text-balance">
                    <InlineEditableText
                      value={config.portfolio.headingPrefix}
                      editMode={editMode}
                      onChange={(v) =>
                        setConfig((c) => ({
                          ...c,
                          portfolio: { ...c.portfolio, headingPrefix: v },
                        }))
                      }
                    />{' '}
                    <InlineEditableText
                      value={config.portfolio.headingHighlight}
                      editMode={editMode}
                      className="neon-gradient-text"
                      onChange={(v) =>
                        setConfig((c) => ({
                          ...c,
                          portfolio: { ...c.portfolio, headingHighlight: v },
                        }))
                      }
                    />
                  </h2>
                  <InlineEditableText
                    as="p"
                    value={config.portfolio.subtitle}
                    editMode={editMode}
                    className="text-sm sm:text-base text-slate-300/90"
                    onChange={(v) =>
                      setConfig((c) => ({
                        ...c,
                        portfolio: { ...c.portfolio, subtitle: v },
                      }))
                    }
                  />
                </div>

                {editMode ? (
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/15 text-xs sm:text-sm font-medium text-white whitespace-nowrap shrink-0 self-start sm:self-auto">
                    <InlineEditableText
                      value={config.portfolio.ctaText}
                      editMode={editMode}
                      onChange={(v) =>
                        setConfig((c) => ({
                          ...c,
                          portfolio: { ...c.portfolio, ctaText: v },
                        }))
                      }
                    />
                    <ArrowRight className="w-4 h-4" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setPortfolioModalState({ open: true, projectId: null })
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/15 text-xs sm:text-sm font-medium text-white transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
                  >
                    <span>{config.portfolio.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
                {config.portfolio.projects.map((project, idx) => (
                  <Motion3DCard
                    key={project.id}
                    delay={idx * 0.06}
                    enabled={config.theme.cardTilt3D}
                    onClick={() =>
                      setPortfolioModalState({ open: true, projectId: project.id })
                    }
                    className="glass-service-card group rounded-2xl overflow-hidden text-left flex flex-col focus-visible:outline-2 focus-visible:outline-violet-400"
                  >
                    {project.imageUrl ? (
                      <div
                        className={`w-full border-b border-white/10 bg-[#080417]/85 overflow-hidden ${
                          project.imageFit === 'cover' ? 'h-44' : ''
                        }`}
                      >
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          referrerPolicy="no-referrer"
                          className={
                            project.imageFit === 'cover'
                              ? 'w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]'
                              : 'w-full h-auto max-h-72 object-contain block mx-auto transition-transform duration-200 group-hover:scale-[1.02]'
                          }
                        />
                      </div>
                    ) : (
                      <div className="h-44 w-full border-b border-white/10">
                        <PortfolioSceneGraphic
                          visualType={project.visualType}
                          monogram={config.brand.monogram}
                        />
                      </div>
                    )}

                    {editMode && (
                      <div
                        className="w-full px-3 pt-3 flex flex-wrap items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            uploadingProjectIdRef.current = project.id;
                            portfolioPhotoInputRef.current?.click();
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-violet-600/90 hover:bg-violet-500 text-[11px] font-semibold text-white border border-violet-300/30 transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                          {project.imageUrl ? 'Change Image' : 'Upload Image'}
                        </button>
                        {project.imageUrl && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfig((c) => ({
                                  ...c,
                                  portfolio: {
                                    ...c.portfolio,
                                    projects: c.portfolio.projects.map((p) =>
                                      p.id === project.id
                                        ? {
                                            ...p,
                                            imageFit:
                                              p.imageFit === 'cover'
                                                ? 'contain'
                                                : 'cover',
                                          }
                                        : p
                                    ),
                                  },
                                }));
                              }}
                              className="px-2 py-1 rounded-md bg-white/[0.08] hover:bg-white/15 text-[10px] font-medium text-slate-200 border border-white/15 transition-colors"
                              title="Toggle full image vs cropped fill"
                            >
                              {project.imageFit === 'cover'
                                ? 'Fit: Crop'
                                : 'Fit: Full'}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfig((c) => ({
                                  ...c,
                                  portfolio: {
                                    ...c.portfolio,
                                    projects: c.portfolio.projects.map((p) =>
                                      p.id === project.id
                                        ? { ...p, imageUrl: undefined }
                                        : p
                                    ),
                                  },
                                }));
                              }}
                              className="px-2 py-1 rounded-md bg-white/[0.06] hover:bg-rose-500/25 text-[10px] font-medium text-slate-300 hover:text-rose-200 border border-white/10 transition-colors"
                              title="Switch back to 3D visual"
                            >
                              3D Visual
                            </button>
                          </>
                        )}
                        {config.portfolio.projects.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfig((c) => ({
                                ...c,
                                portfolio: {
                                  ...c.portfolio,
                                  projects: c.portfolio.projects.filter(
                                    (p) => p.id !== project.id
                                  ),
                                },
                              }));
                            }}
                            className="p-1 rounded-md bg-white/[0.06] hover:bg-rose-500/25 text-slate-300 hover:text-rose-300 border border-white/10 transition-colors ml-auto"
                            aria-label={`Delete ${project.title}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}

                    <div className="p-4 flex items-center justify-between gap-3 w-full">
                      <div
                        className="min-w-0 flex-1"
                        onClick={(e) => {
                          if (editMode) e.stopPropagation();
                        }}
                      >
                        <h3 className="font-display text-sm sm:text-base font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
                          <InlineEditableText
                            value={project.title}
                            editMode={editMode}
                            onChange={(v) =>
                              setConfig((c) => ({
                                ...c,
                                portfolio: {
                                  ...c.portfolio,
                                  projects: c.portfolio.projects.map((p) =>
                                    p.id === project.id ? { ...p, title: v } : p
                                  ),
                                },
                              }))
                            }
                          />
                        </h3>
                        <div className="text-xs text-slate-400 truncate mt-0.5">
                          <InlineEditableText
                            as="p"
                            value={project.metric}
                            editMode={editMode}
                            onChange={(v) =>
                              setConfig((c) => ({
                                ...c,
                                portfolio: {
                                  ...c.portfolio,
                                  projects: c.portfolio.projects.map((p) =>
                                    p.id === project.id ? { ...p, metric: v } : p
                                  ),
                                },
                              }))
                            }
                          />
                        </div>
                        {editMode && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditorSection('portfolio');
                            }}
                            className="mt-1.5 text-[11px] font-medium text-violet-300 hover:text-white underline underline-offset-2"
                          >
                            Edit details
                          </button>
                        )}
                      </div>
                      <span className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/15 group-hover:bg-violet-600 group-hover:border-violet-400 flex items-center justify-center shrink-0 transition-colors">
                        <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-white" />
                      </span>
                    </div>
                  </Motion3DCard>
                ))}
              </div>
            </div>
          </motion.section>
        );

      case 'testimonials-contact':
        return (
          <motion.section
            key="testimonials-contact"
            id="testimonials"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={SECTION_VIEWPORT}
            transition={{ duration: 0.55, ease: SECTION_EASE }}
            className="py-16 lg:py-24"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left: Testimonials Carousel */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-300">
                        <span className="h-px w-6 bg-violet-400/60" />
                        <InlineEditableText
                          value={config.testimonials.kicker}
                          editMode={editMode}
                          onChange={(v) =>
                            setConfig((c) => ({
                              ...c,
                              testimonials: { ...c.testimonials, kicker: v },
                            }))
                          }
                        />
                      </div>
                      <EditBadge section="testimonials" label="Reviews" />
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-white text-balance">
                      <InlineEditableText
                        value={config.testimonials.heading}
                        editMode={editMode}
                        onChange={(v) =>
                          setConfig((c) => ({
                            ...c,
                            testimonials: { ...c.testimonials, heading: v },
                          }))
                        }
                      />
                    </h2>
                    <InlineEditableText
                      as="p"
                      value={config.testimonials.subtitle}
                      editMode={editMode}
                      className="text-xs sm:text-sm text-slate-300/85"
                      onChange={(v) =>
                        setConfig((c) => ({
                          ...c,
                          testimonials: { ...c.testimonials, subtitle: v },
                        }))
                      }
                    />
                  </div>

                  {activeTestimonial && (
                    <div className="glass-panel rounded-2xl p-6 space-y-5">
                      <div className="text-violet-400 font-display text-3xl leading-none select-none">
                        &ldquo;
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed min-h-[68px]">
                        {activeTestimonial.quote}
                      </p>

                      <div
                        className="flex items-center gap-1"
                        aria-label={`${activeTestimonial.rating} out of 5 stars`}
                      >
                        {Array.from({ length: activeTestimonial.rating }).map(
                          (_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-amber-400 fill-amber-400"
                            />
                          )
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-display font-bold text-xs text-white shrink-0">
                            {activeTestimonial.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-white truncate">
                              {activeTestimonial.author}
                            </div>
                            <div className="text-xs text-slate-400 truncate">
                              {activeTestimonial.role} ·{' '}
                              {activeTestimonial.company}
                            </div>
                          </div>
                        </div>

                        {config.testimonials.items.length > 1 && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setTestimonialIdx((prev) =>
                                  prev === 0
                                    ? config.testimonials.items.length - 1
                                    : prev - 1
                                )
                              }
                              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                              aria-label="Previous testimonial"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setTestimonialIdx(
                                  (prev) =>
                                    (prev + 1) %
                                    config.testimonials.items.length
                                )
                              }
                              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                              aria-label="Next testimonial"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {config.testimonials.items.length > 1 && (
                        <div className="flex items-center justify-center gap-1.5 pt-1">
                          {config.testimonials.items.map((t, i) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setTestimonialIdx(i)}
                              aria-label={`View testimonial from ${t.author}`}
                              className={`h-1.5 rounded-full transition-all ${
                                i === safeTestimonialIdx
                                  ? 'w-6 bg-violet-400'
                                  : 'w-2 bg-white/20 hover:bg-white/40'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Center: Aesthetic Motion-Enabled Human & Robotic Handshake */}
                <div className="lg:col-span-4 flex items-center justify-center">
                  <HandshakeGraphic
                    primaryBlue={config.theme.primaryBlue}
                    primaryPurple={config.theme.primaryPurple}
                    floatIntensity={config.theme.floatIntensity}
                    rotationSpeed={config.theme.rotationSpeed}
                  />
                </div>

                {/* Right: Let's Work Together Contact Section */}
                <div id="contact" className="lg:col-span-4 space-y-5">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-300">
                        <span className="h-px w-6 bg-violet-400/60" />
                        <InlineEditableText
                          value={config.contact.kicker}
                          editMode={editMode}
                          onChange={(v) =>
                            setConfig((c) => ({
                              ...c,
                              contact: { ...c.contact, kicker: v },
                            }))
                          }
                        />
                      </div>
                      <EditBadge section="contact" label="Contact" />
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-white text-balance">
                      <InlineEditableText
                        value={config.contact.headingPrefix}
                        editMode={editMode}
                        onChange={(v) =>
                          setConfig((c) => ({
                            ...c,
                            contact: { ...c.contact, headingPrefix: v },
                          }))
                        }
                      />{' '}
                      <InlineEditableText
                        value={config.contact.headingHighlight}
                        editMode={editMode}
                        className="neon-gradient-text"
                        onChange={(v) =>
                          setConfig((c) => ({
                            ...c,
                            contact: { ...c.contact, headingHighlight: v },
                          }))
                        }
                      />
                    </h2>
                    <InlineEditableText
                      as="p"
                      multiline
                      value={config.contact.subtitle}
                      editMode={editMode}
                      className="text-sm sm:text-base text-slate-300/90 leading-relaxed"
                      onChange={(v) =>
                        setConfig((c) => ({
                          ...c,
                          contact: { ...c.contact, subtitle: v },
                        }))
                      }
                    />
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        setContactModalState({ open: true, subject: '' })
                      }
                      className="neon-cta-btn inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold text-white whitespace-nowrap shrink-0"
                    >
                      <span>{config.contact.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <a
                      href={`tel:${config.contact.phone.replace(/[^\d+]/g, '')}`}
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-violet-400" />
                      <span>{config.contact.phone}</span>
                    </a>
                    <a
                      href={`mailto:${config.contact.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      <span>{config.contact.email}</span>
                    </a>
                    <span className="text-slate-400">{config.contact.location}</span>
                  </div>

                  {/* Social Icons */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    {config.contact.socials
                      .filter((s) => s.enabled)
                      .map((soc) => (
                        <a
                          key={soc.platform}
                          href={soc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={soc.platform}
                          className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-violet-600/80 border border-white/15 hover:border-violet-400 flex items-center justify-center text-slate-200 hover:text-white transition-colors"
                        >
                          <SocialIconSvg platform={soc.platform} />
                        </a>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        );

      case 'location-map':
        return (
          <motion.section
            key="location-map"
            id="studio-location"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={SECTION_VIEWPORT}
            transition={{ duration: 0.55, ease: SECTION_EASE }}
            className="py-12 lg:py-16"
          >
            <div className="max-w-7xl mx-auto px-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-300">
                      <span className="h-px w-6 bg-violet-400/60" />
                      <span>Studio Location</span>
                    </div>
                    <EditBadge section="contact" label="Map Pin" />
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white text-balance">
                    <InlineEditableText
                      value={config.contact.studioMap.heading}
                      editMode={editMode}
                      onChange={(v) =>
                        setConfig((c) => ({
                          ...c,
                          contact: {
                            ...c.contact,
                            studioMap: { ...c.contact.studioMap, heading: v },
                          },
                        }))
                      }
                    />
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300/85">
                    {config.contact.studioMap.subtitle}
                  </p>
                </div>
              </div>

              <Suspense
                fallback={
                  <div className="w-full h-[340px] sm:h-[400px] rounded-2xl bg-white/[0.02] border border-white/10" />
                }
              >
                <AgencyLocationMap
                  config={config}
                  editMode={editMode}
                  onChange={setConfig}
                />
              </Suspense>
            </div>
          </motion.section>
        );
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        id="top"
        className="relative min-h-screen bg-[#050311] text-slate-100 overflow-x-clip"
      >
        {/* Ambient Neon Blue + Purple Atmospheric Backlights */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{ opacity: Math.min(1, config.theme.glowIntensity * 0.75) }}
        >
          <div
            className="absolute -top-32 left-1/4 w-[620px] h-[520px] rounded-full blur-[140px]"
            style={{ background: `${config.theme.primaryBlue}24` }}
          />
          <div
            className="absolute top-16 right-0 w-[680px] h-[560px] rounded-full blur-[150px]"
            style={{ background: `${config.theme.primaryPurple}2c` }}
          />
          <div
            className="absolute top-[48%] -left-24 w-[520px] h-[520px] rounded-full blur-[150px]"
            style={{ background: `${config.theme.primaryBlue}1f` }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[620px] h-[420px] rounded-full blur-[150px]"
            style={{ background: `${config.theme.primaryPurple}24` }}
          />
        </div>

        {/* Google Maps Platform Case A Demo Quota Banner */}
        {mapsQuotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        {/* Hidden Global Photo Uploader Inputs */}
        <input
          ref={quickPhotoInputRef}
          type="file"
          accept="image/*"
          onChange={handleQuickPhotoUpload}
          className="hidden"
        />
        <input
          ref={servicePhotoInputRef}
          type="file"
          accept="image/*"
          onChange={handleServicePhotoUpload}
          className="hidden"
        />
        <input
          ref={portfolioPhotoInputRef}
          type="file"
          accept="image/*"
          onChange={handlePortfolioPhotoUpload}
          className="hidden"
        />

        {/* TOP NAVIGATION BAR — Strictly adheres to 3-Zone Top Bar Contract */}
        <header className="sticky top-0 z-40 bg-[#050311]/90 border-b border-white/[0.07]">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
            {/* Zone 1: Single-line Brand Wordmark */}
            <a
              href="#top"
              className="inline-flex items-center gap-2.5 text-lg font-display font-bold tracking-tight text-white whitespace-nowrap shrink-0"
            >
              <NJEmblem monogram={config.brand.monogram} size={36} />
              <span>{config.brand.name}</span>
            </a>

            {/* Zone 2: 5 Concise Single-Line Nav Links */}
            <nav
              className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
              aria-label="Primary Navigation"
            >
              <a
                href="#services"
                className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-violet-400"
              >
                Services
              </a>
              <a
                href="#portfolio"
                className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-violet-400"
              >
                Portfolio
              </a>
              <a
                href="#about"
                className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-violet-400"
              >
                About
              </a>
              <a
                href="#testimonials"
                className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-violet-400"
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-violet-400"
              >
                Contact
              </a>
            </nav>

            {/* Zone 3: 1 Primary CTA Button (+ mobile hamburger) */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setContactModalState({ open: true, subject: '' })
                }
                className="neon-cta-btn hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white whitespace-nowrap shrink-0"
              >
                <span>Let&apos;s Talk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden px-6 pb-5 pt-2 border-t border-white/10 bg-[#08051a] space-y-2">
              {[
                { label: 'Services', href: '#services' },
                { label: 'Portfolio', href: '#portfolio' },
                { label: 'About', href: '#about' },
                { label: 'Testimonials', href: '#testimonials' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-slate-200 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setContactModalState({ open: true, subject: '' });
                }}
                className="neon-cta-btn w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
              >
                Let&apos;s Talk
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </header>

        {/* Inline Edit Mode Helper Strip */}
        {editMode && (
          <div className="relative z-30 bg-violet-950/90 border-b border-violet-400/35 px-6 py-2 text-center text-xs text-violet-100">
            Edit Mode Active — Click any dashed text on the page to edit directly, or use the Studio Panel to manage cards, layout order, and 3D motion.
          </div>
        )}

        <main className="relative z-10">
          {/* DYNAMICALLY ORDERED & EDITABLE SECTIONS (Front Full Image + 3D Hero Logo + Agency Sections + Map) */}
          {config.layout.sections
            .filter((sec) => sec.visible)
            .map((sec) => renderSection(sec.id))}
        </main>

        {/* FOOTER */}
        <motion.footer
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={SECTION_VIEWPORT}
          transition={{ duration: 0.5, ease: SECTION_EASE }}
          className="relative z-10 border-t border-white/10 bg-[#04020d]"
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Brand Lockup */}
              <div className="flex items-center gap-3">
                <NJEmblem monogram={config.brand.monogram} size={38} />
                <div>
                  <div className="font-display text-base font-bold text-white leading-tight">
                    <InlineEditableText
                      value={config.brand.name}
                      editMode={editMode}
                      onChange={(v) =>
                        setConfig((c) => ({
                          ...c,
                          brand: { ...c.brand, name: v },
                        }))
                      }
                    />
                  </div>
                  <div className="text-xs text-slate-400">
                    <InlineEditableText
                      value={config.brand.role}
                      editMode={editMode}
                      onChange={(v) =>
                        setConfig((c) => ({
                          ...c,
                          brand: { ...c.brand, role: v },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Center Motto */}
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-200">
                <TrendingUp className="w-4 h-4 text-violet-400" />
                <span>{config.brand.tagline}</span>
              </div>

              {/* Footer Nav + Scroll to Top */}
              <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-slate-300">
                <a href="#top" className="hover:text-white transition-colors">
                  Home
                </a>
                <a
                  href="#services"
                  className="hover:text-white transition-colors"
                >
                  Services
                </a>
                <a
                  href="#portfolio"
                  className="hover:text-white transition-colors"
                >
                  Portfolio
                </a>
                <a href="#about" className="hover:text-white transition-colors">
                  About
                </a>
                <a
                  href="#contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-violet-600 border border-white/15 flex items-center justify-center text-white transition-colors"
                  aria-label="Scroll to top"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-300">
                {editMode ? (
                  <>
                    <div className="inline-flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <InlineEditableText
                        value={config.contact.phone}
                        editMode={editMode}
                        onChange={(v) =>
                          setConfig((c) => ({
                            ...c,
                            contact: { ...c.contact, phone: v },
                          }))
                        }
                      />
                    </div>
                    <div className="inline-flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <InlineEditableText
                        value={config.contact.email}
                        editMode={editMode}
                        onChange={(v) =>
                          setConfig((c) => ({
                            ...c,
                            contact: { ...c.contact, email: v },
                          }))
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <a
                      href={`tel:${config.contact.phone.replace(/[^\d+]/g, '')}`}
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span>{config.contact.phone}</span>
                    </a>
                    <a
                      href={`mailto:${config.contact.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{config.contact.email}</span>
                    </a>
                  </>
                )}
              </div>

              <div className="text-slate-500 text-center sm:text-right flex items-center gap-2 justify-center sm:justify-end">
                <InlineEditableText
                  value={config.brand.copyright}
                  editMode={editMode}
                  onChange={(v) =>
                    setConfig((c) => ({
                      ...c,
                      brand: { ...c.brand, copyright: v },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </motion.footer>

        {/* CUSTOM NEON CURSOR AURA */}
        <NeonCursorEffect
          primaryBlue={config.theme.primaryBlue}
          primaryPurple={config.theme.primaryPurple}
          enabled={config.theme.customCursor}
        />

        {/* FLOATING WHATSAPP CONTACT BUTTON */}
        <WhatsAppButton
          phone={config.contact.phone}
          message={config.contact.whatsappMessage}
          enabled={config.contact.whatsappEnabled}
        />

        {/* FLOATING AI VISITOR CHATBOT */}
        <VisitorChatbot
          config={config}
          hasBottomRightControls={false}
          onOpenContact={(subject) =>
            setContactModalState({ open: true, subject: subject || '' })
          }
        />

        {/* INTERACTIVE MODALS */}
        {introOpen && (
          <IntroModal
            config={config}
            onClose={() => setIntroOpen(false)}
            onBookCall={() => setContactModalState({ open: true, subject: '' })}
          />
        )}

        {selectedService && (
          <ServiceDetailModal
            service={
              config.services.items.find((s) => s.id === selectedService.id) ??
              selectedService
            }
            onClose={() => setSelectedService(null)}
            onInquire={(srvTitle) =>
              setContactModalState({ open: true, subject: srvTitle })
            }
          />
        )}

        {portfolioModalState.open && (
          <PortfolioModal
            projects={config.portfolio.projects}
            initialProjectId={portfolioModalState.projectId}
            monogram={config.brand.monogram}
            onClose={() =>
              setPortfolioModalState({ open: false, projectId: null })
            }
            onInquire={(projTitle) =>
              setContactModalState({ open: true, subject: projTitle })
            }
          />
        )}

        {aboutModalOpen && (
          <AboutModal
            config={config}
            onClose={() => setAboutModalOpen(false)}
            onContact={() => setContactModalState({ open: true, subject: '' })}
          />
        )}

        {contactModalState.open && (
          <ContactModal
            config={config}
            defaultSubject={contactModalState.subject}
            onClose={() => setContactModalState({ open: false, subject: '' })}
          />
        )}
      </div>
    </MotionConfig>
  );
}
