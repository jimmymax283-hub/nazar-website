import React, { useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Download,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Layers,
  Palette,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  EditorSectionKey,
  PortfolioVisualType,
  ServiceIconKey,
  SiteConfig,
} from '../types/siteConfig';
import { compressImageFileToDataUrl } from '../utils/imageUpload';

interface SiteEditorDrawerProps {
  config: SiteConfig;
  activeTab: EditorSectionKey;
  onTabChange: (tab: EditorSectionKey) => void;
  onChange: (next: SiteConfig) => void;
  onReset: () => void;
  onClose: () => void;
}

const TABS: { key: EditorSectionKey; label: string }[] = [
  { key: 'brand', label: 'Brand' },
  { key: 'portrait', label: 'Front Image' },
  { key: 'hero', label: 'Hero' },
  { key: 'services', label: 'Services' },
  { key: 'about', label: 'About' },
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'testimonials', label: 'Reviews' },
  { key: 'contact', label: 'Contact & Map' },
  { key: 'layout', label: 'Layout' },
  { key: 'theme', label: '3D & Motion' },
];

const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  multiline?: boolean;
}> = ({ label, value, onChange, multiline = false }) => (
  <div className="space-y-1">
    <label className="block text-[11px] font-medium text-slate-300">
      {label}
    </label>
    {multiline ? (
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/15 text-xs text-white focus:outline-none focus:border-violet-400 resize-y"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/15 text-xs text-white focus:outline-none focus:border-violet-400"
      />
    )}
  </div>
);

export const SiteEditorDrawer: React.FC<SiteEditorDrawerProps> = ({
  config,
  activeTab,
  onTabChange,
  onChange,
  onReset,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const portraitInputRef = useRef<HTMLInputElement | null>(null);
  const serviceImageInputRef = useRef<HTMLInputElement | null>(null);
  const uploadingServiceIdxRef = useRef<number | null>(null);
  const portfolioImageInputRef = useRef<HTMLInputElement | null>(null);
  const uploadingProjectIdxRef = useRef<number | null>(null);
  const [importError, setImportError] = useState('');

  const handlePortraitUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await compressImageFileToDataUrl(file, 840, 0.86);
      onChange({
        ...config,
        portrait: {
          ...config.portrait,
          imageDataUrl: dataUrl,
        },
      });
    } catch {
      // Ignore invalid image files
    }
  };

  const handleServiceImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    const targetIdx = uploadingServiceIdxRef.current;
    e.target.value = '';
    if (!file || targetIdx === null) return;
    try {
      const dataUrl = await compressImageFileToDataUrl(file, 960, 0.86);
      const next = [...config.services.items];
      if (!next[targetIdx]) return;
      next[targetIdx] = {
        ...next[targetIdx],
        imageUrl: dataUrl,
        imageFit: 'contain',
      };
      onChange({
        ...config,
        services: { ...config.services, items: next },
      });
    } catch {
      // Ignore invalid image files
    } finally {
      uploadingServiceIdxRef.current = null;
    }
  };

  const handlePortfolioImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    const targetIdx = uploadingProjectIdxRef.current;
    e.target.value = '';
    if (!file || targetIdx === null) return;
    try {
      const dataUrl = await compressImageFileToDataUrl(file, 960, 0.86);
      const next = [...config.portfolio.projects];
      if (!next[targetIdx]) return;
      next[targetIdx] = {
        ...next[targetIdx],
        imageUrl: dataUrl,
        imageFit: 'contain',
      };
      onChange({
        ...config,
        portfolio: { ...config.portfolio, projects: next },
      });
    } catch {
      // Ignore invalid image files
    } finally {
      uploadingProjectIdxRef.current = null;
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.brand.monogram.toLowerCase()}-site-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed && parsed.hero && parsed.services && parsed.brand) {
          onChange(parsed);
          setImportError('');
        } else {
          setImportError('Invalid site configuration JSON.');
        }
      } catch {
        setImportError('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <aside
      className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[420px] bg-[#0a071b] border-l border-violet-500/35 shadow-[-16px_0_60px_rgba(0,0,0,0.85)] flex flex-col"
      aria-label="Website Visual Editor"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10">
        <div>
          <h3 className="font-display text-base font-bold text-white">
            Site Content Studio
          </h3>
          <p className="text-[11px] text-slate-400">
            Changes save automatically to your browser
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close editor"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onTabChange(t.key)}
            className={`px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap ${
              activeTab === t.key
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Scrollable Editor Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {activeTab === 'brand' && (
          <div className="space-y-4">
            <InputField
              label="3D Monogram Letters (e.g. NJ)"
              value={config.brand.monogram}
              onChange={(v) =>
                onChange({
                  ...config,
                  brand: { ...config.brand, monogram: v.slice(0, 3) },
                })
              }
            />
            <InputField
              label="Brand / Owner Name"
              value={config.brand.name}
              onChange={(v) =>
                onChange({ ...config, brand: { ...config.brand, name: v } })
              }
            />
            <InputField
              label="Role / Subtitle (Footer)"
              value={config.brand.role}
              onChange={(v) =>
                onChange({ ...config, brand: { ...config.brand, role: v } })
              }
            />
            <InputField
              label="Brand Tagline / Signature"
              value={config.brand.tagline}
              onChange={(v) =>
                onChange({ ...config, brand: { ...config.brand, tagline: v } })
              }
            />
            <InputField
              label="Footer Copyright"
              value={config.brand.copyright}
              onChange={(v) =>
                onChange({
                  ...config,
                  brand: { ...config.brand, copyright: v },
                })
              }
            />
          </div>
        )}

        {activeTab === 'portrait' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-violet-950/35 border border-violet-400/30 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <ImageIcon className="w-4 h-4 text-violet-300" />
                  Front Full Image Showcase
                </div>
                <select
                  value={config.portrait.imageFit}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      portrait: {
                        ...config.portrait,
                        imageFit: e.target.value as 'cover' | 'contain',
                      },
                    })
                  }
                  className="px-2 py-1 rounded-md bg-[#120d2c] border border-white/15 text-[11px] text-white"
                >
                  <option value="cover">Fill Frame (Cover)</option>
                  <option value="contain">Full Uncropped (Contain)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => portraitInputRef.current?.click()}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {config.portrait.imageDataUrl ? 'Change My Photo' : 'Upload My Photo'}
                </button>
                {config.portrait.imageDataUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...config,
                        portrait: { ...config.portrait, imageDataUrl: '' },
                      })
                    }
                    className="px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-rose-500/20 border border-white/10 text-xs text-slate-200"
                  >
                    Clear
                  </button>
                )}
              </div>
              <input
                ref={portraitInputRef}
                type="file"
                accept="image/*"
                onChange={handlePortraitUpload}
                className="hidden"
              />

              <InputField
                label="Or Paste Image URL"
                value={
                  config.portrait.imageDataUrl.startsWith('data:')
                    ? ''
                    : config.portrait.imageDataUrl
                }
                onChange={(v) =>
                  onChange({
                    ...config,
                    portrait: { ...config.portrait, imageDataUrl: v },
                  })
                }
              />

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Scroll 3D Movement</span>
                  <span className="text-violet-300 tabular-nums">
                    {Math.round(config.portrait.scroll3DStrength * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={0.1}
                  value={config.portrait.scroll3DStrength}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      portrait: {
                        ...config.portrait,
                        scroll3DStrength: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-violet-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <InputField
                label="Name Caption"
                value={config.portrait.caption}
                onChange={(v) =>
                  onChange({
                    ...config,
                    portrait: { ...config.portrait, caption: v },
                  })
                }
              />
              <InputField
                label="Role / Eyebrow"
                value={config.portrait.badgeText}
                onChange={(v) =>
                  onChange({
                    ...config,
                    portrait: { ...config.portrait, badgeText: v },
                  })
                }
              />
            </div>

            <InputField
              label="Section Headline"
              value={config.portrait.headline}
              onChange={(v) =>
                onChange({
                  ...config,
                  portrait: { ...config.portrait, headline: v },
                })
              }
            />
            <InputField
              label="Intro Description"
              value={config.portrait.subtext}
              multiline
              onChange={(v) =>
                onChange({
                  ...config,
                  portrait: { ...config.portrait, subtext: v },
                })
              }
            />
            <InputField
              label="Primary Button Text"
              value={config.portrait.ctaText}
              onChange={(v) =>
                onChange({
                  ...config,
                  portrait: { ...config.portrait, ctaText: v },
                })
              }
            />
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="space-y-4">
            <InputField
              label="Hero Eyebrow Kicker"
              value={config.hero.kicker}
              onChange={(v) =>
                onChange({ ...config, hero: { ...config.hero, kicker: v } })
              }
            />
            <InputField
              label="Headline Line 1 (White)"
              value={config.hero.headlineLine1}
              onChange={(v) =>
                onChange({
                  ...config,
                  hero: { ...config.hero, headlineLine1: v },
                })
              }
            />
            <InputField
              label="Headline Line 2 (Neon Gradient)"
              value={config.hero.headlineLine2}
              onChange={(v) =>
                onChange({
                  ...config,
                  hero: { ...config.hero, headlineLine2: v },
                })
              }
            />
            <InputField
              label="Subheadline"
              value={config.hero.subheadline}
              onChange={(v) =>
                onChange({
                  ...config,
                  hero: { ...config.hero, subheadline: v },
                })
              }
            />
            <InputField
              label="Description"
              value={config.hero.description}
              multiline
              onChange={(v) =>
                onChange({
                  ...config,
                  hero: { ...config.hero, description: v },
                })
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Primary CTA Label"
                value={config.hero.primaryCtaText}
                onChange={(v) =>
                  onChange({
                    ...config,
                    hero: { ...config.hero, primaryCtaText: v },
                  })
                }
              />
              <InputField
                label="Secondary CTA Label"
                value={config.hero.secondaryCtaText}
                onChange={(v) =>
                  onChange({
                    ...config,
                    hero: { ...config.hero, secondaryCtaText: v },
                  })
                }
              />
            </div>
            <InputField
              label="Intro Reel Summary"
              value={config.hero.introSummary}
              multiline
              onChange={(v) =>
                onChange({
                  ...config,
                  hero: { ...config.hero, introSummary: v },
                })
              }
            />
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-4">
            <input
              ref={serviceImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleServiceImageUpload}
              className="hidden"
            />
            <InputField
              label="Section Kicker"
              value={config.services.kicker}
              onChange={(v) =>
                onChange({
                  ...config,
                  services: { ...config.services, kicker: v },
                })
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Heading Prefix"
                value={config.services.headingPrefix}
                onChange={(v) =>
                  onChange({
                    ...config,
                    services: { ...config.services, headingPrefix: v },
                  })
                }
              />
              <InputField
                label="Heading Highlight"
                value={config.services.headingHighlight}
                onChange={(v) =>
                  onChange({
                    ...config,
                    services: { ...config.services, headingHighlight: v },
                  })
                }
              />
            </div>
            <InputField
              label="Section Subtitle"
              value={config.services.subtitle}
              onChange={(v) =>
                onChange({
                  ...config,
                  services: { ...config.services, subtitle: v },
                })
              }
            />

            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  Service Cards ({config.services.items.length})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...config,
                      services: {
                        ...config.services,
                        items: [
                          ...config.services.items,
                          {
                            id: `srv-${Date.now()}`,
                            title: 'New Service',
                            tagline: 'Strategy. Execute. Scale.',
                            description: 'Custom digital growth service.',
                            deliverables: ['Strategy audit', 'Monthly sprint'],
                            iconKey: 'analytics',
                            imageFit: 'contain',
                          },
                        ],
                      },
                    })
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-violet-600 hover:bg-violet-500 text-[11px] font-semibold text-white"
                >
                  <Plus className="w-3 h-3" /> Add Card
                </button>
              </div>

              {config.services.items.map((srv, idx) => (
                <div
                  key={srv.id}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-violet-300">
                      Card #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          if (idx === 0) return;
                          const next = [...config.services.items];
                          [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                          onChange({
                            ...config,
                            services: { ...config.services, items: next },
                          });
                        }}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        aria-label={`Move ${srv.title} up`}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === config.services.items.length - 1}
                        onClick={() => {
                          if (idx === config.services.items.length - 1) return;
                          const next = [...config.services.items];
                          [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                          onChange({
                            ...config,
                            services: { ...config.services, items: next },
                          });
                        }}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        aria-label={`Move ${srv.title} down`}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      {config.services.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            onChange({
                              ...config,
                              services: {
                                ...config.services,
                                items: config.services.items.filter(
                                  (item) => item.id !== srv.id
                                ),
                              },
                            })
                          }
                          className="p-1 text-slate-400 hover:text-rose-400"
                          aria-label={`Delete ${srv.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Custom Image Upload & Fit Controls */}
                  <div className="p-2.5 rounded-lg bg-[#0d0822] border border-violet-500/25 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-200">
                        <ImageIcon className="w-3.5 h-3.5 text-violet-300" />
                        Card Image
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            uploadingServiceIdxRef.current = idx;
                            serviceImageInputRef.current?.click();
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-violet-600 hover:bg-violet-500 text-[11px] font-semibold text-white transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                          {srv.imageUrl ? 'Replace' : 'Upload Image'}
                        </button>
                        {srv.imageUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...config.services.items];
                              next[idx] = { ...srv, imageUrl: undefined };
                              onChange({
                                ...config,
                                services: { ...config.services, items: next },
                              });
                            }}
                            className="px-2 py-1 rounded-md bg-white/[0.06] hover:bg-rose-500/20 border border-white/10 text-[11px] text-slate-300 hover:text-rose-200 transition-colors"
                          >
                            Use 3D Icon
                          </button>
                        )}
                      </div>
                    </div>

                    {srv.imageUrl && (
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-14 rounded-md overflow-hidden border border-white/15 bg-black/40 shrink-0">
                          <img
                            src={srv.imageUrl}
                            alt={srv.title}
                            className={`w-full h-full ${
                              srv.imageFit === 'cover'
                                ? 'object-cover'
                                : 'object-contain p-0.5'
                            }`}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="block text-[10px] font-medium text-slate-400">
                            Image Fit
                          </label>
                          <select
                            value={srv.imageFit ?? 'contain'}
                            onChange={(e) => {
                              const next = [...config.services.items];
                              next[idx] = {
                                ...srv,
                                imageFit: e.target.value as 'cover' | 'contain',
                              };
                              onChange({
                                ...config,
                                services: { ...config.services, items: next },
                              });
                            }}
                            className="w-full px-2 py-1 rounded-md bg-[#140f2e] border border-white/15 text-[11px] text-white"
                          >
                            <option value="contain">Contain (Full Image — No Crop)</option>
                            <option value="cover">Cover (Crop to Fill Frame)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <InputField
                      label="Or Paste Image URL"
                      value={srv.imageUrl?.startsWith('data:') ? '' : srv.imageUrl ?? ''}
                      onChange={(v) => {
                        const next = [...config.services.items];
                        next[idx] = {
                          ...srv,
                          imageUrl: v.trim() || undefined,
                        };
                        onChange({
                          ...config,
                          services: { ...config.services, items: next },
                        });
                      }}
                    />
                  </div>

                  <InputField
                    label="Title"
                    value={srv.title}
                    onChange={(v) => {
                      const next = [...config.services.items];
                      next[idx] = { ...srv, title: v };
                      onChange({
                        ...config,
                        services: { ...config.services, items: next },
                      });
                    }}
                  />
                  <InputField
                    label="Tagline"
                    value={srv.tagline}
                    onChange={(v) => {
                      const next = [...config.services.items];
                      next[idx] = { ...srv, tagline: v };
                      onChange({
                        ...config,
                        services: { ...config.services, items: next },
                      });
                    }}
                  />
                  {!srv.imageUrl && (
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        3D Icon Visual (when no image uploaded)
                      </label>
                      <select
                        value={srv.iconKey}
                        onChange={(e) => {
                          const next = [...config.services.items];
                          next[idx] = {
                            ...srv,
                            iconKey: e.target.value as ServiceIconKey,
                          };
                          onChange({
                            ...config,
                            services: { ...config.services, items: next },
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#140f2e] border border-white/15 text-xs text-white"
                      >
                        <option value="meta-ads">Megaphone (Meta Ads)</option>
                        <option value="digital-marketing">Rising Bar Chart</option>
                        <option value="social-media">Social App Tiles</option>
                        <option value="shopify">Shopify Bag</option>
                        <option value="video-editing">Video Editing Slate</option>
                        <option value="analytics">Analytics Orbit</option>
                      </select>
                    </div>
                  )}
                  <InputField
                    label="Modal Description"
                    value={srv.description}
                    multiline
                    onChange={(v) => {
                      const next = [...config.services.items];
                      next[idx] = { ...srv, description: v };
                      onChange({
                        ...config,
                        services: { ...config.services, items: next },
                      });
                    }}
                  />
                  <InputField
                    label="Deliverables (one per line)"
                    value={srv.deliverables.join('\n')}
                    multiline
                    onChange={(v) => {
                      const next = [...config.services.items];
                      next[idx] = {
                        ...srv,
                        deliverables: v
                          .split('\n')
                          .map((line) => line.trim())
                          .filter(Boolean),
                      };
                      onChange({
                        ...config,
                        services: { ...config.services, items: next },
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Heading Prefix"
                value={config.about.headingPrefix}
                onChange={(v) =>
                  onChange({
                    ...config,
                    about: { ...config.about, headingPrefix: v },
                  })
                }
              />
              <InputField
                label="Highlighted Name"
                value={config.about.headingHighlight}
                onChange={(v) =>
                  onChange({
                    ...config,
                    about: { ...config.about, headingHighlight: v },
                  })
                }
              />
            </div>
            <InputField
              label="Bio Summary"
              value={config.about.bio}
              multiline
              onChange={(v) =>
                onChange({ ...config, about: { ...config.about, bio: v } })
              }
            />
            <InputField
              label="3D Laptop Floating Badge Text"
              value={config.about.hologramBadgeText}
              onChange={(v) =>
                onChange({
                  ...config,
                  about: { ...config.about, hologramBadgeText: v },
                })
              }
            />
            <InputField
              label="Specialties (comma-separated)"
              value={config.about.specialties.join(', ')}
              onChange={(v) =>
                onChange({
                  ...config,
                  about: {
                    ...config.about,
                    specialties: v
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  },
                })
              }
            />

            <div className="space-y-3 pt-2">
              <span className="block text-xs font-semibold text-white">
                Impact Metrics
              </span>
              {config.about.stats.map((st, idx) => (
                <div
                  key={st.id}
                  className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/10"
                >
                  <InputField
                    label="Value"
                    value={st.value}
                    onChange={(v) => {
                      const next = [...config.about.stats];
                      next[idx] = { ...st, value: v };
                      onChange({
                        ...config,
                        about: { ...config.about, stats: next },
                      });
                    }}
                  />
                  <InputField
                    label="Label"
                    value={st.label}
                    onChange={(v) => {
                      const next = [...config.about.stats];
                      next[idx] = { ...st, label: v };
                      onChange({
                        ...config,
                        about: { ...config.about, stats: next },
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            <input
              ref={portfolioImageInputRef}
              type="file"
              accept="image/*"
              onChange={handlePortfolioImageUpload}
              className="hidden"
            />

            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Section Kicker"
                value={config.portfolio.kicker}
                onChange={(v) =>
                  onChange({
                    ...config,
                    portfolio: { ...config.portfolio, kicker: v },
                  })
                }
              />
              <InputField
                label="Button Label"
                value={config.portfolio.ctaText}
                onChange={(v) =>
                  onChange({
                    ...config,
                    portfolio: { ...config.portfolio, ctaText: v },
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Heading Prefix"
                value={config.portfolio.headingPrefix}
                onChange={(v) =>
                  onChange({
                    ...config,
                    portfolio: { ...config.portfolio, headingPrefix: v },
                  })
                }
              />
              <InputField
                label="Heading Highlight"
                value={config.portfolio.headingHighlight}
                onChange={(v) =>
                  onChange({
                    ...config,
                    portfolio: { ...config.portfolio, headingHighlight: v },
                  })
                }
              />
            </div>

            <InputField
              label="Section Subtitle"
              value={config.portfolio.subtitle}
              onChange={(v) =>
                onChange({
                  ...config,
                  portfolio: { ...config.portfolio, subtitle: v },
                })
              }
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-white">
                Projects ({config.portfolio.projects.length})
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...config,
                    portfolio: {
                      ...config.portfolio,
                      projects: [
                        ...config.portfolio.projects,
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
                  })
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-violet-600 hover:bg-violet-500 text-[11px] font-semibold text-white"
              >
                <Plus className="w-3 h-3" /> Add Project
              </button>
            </div>

            {config.portfolio.projects.map((proj, idx) => (
              <div
                key={proj.id}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-violet-300">
                    Project #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        if (idx === 0) return;
                        const next = [...config.portfolio.projects];
                        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                        onChange({
                          ...config,
                          portfolio: { ...config.portfolio, projects: next },
                        });
                      }}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                      aria-label={`Move ${proj.title} up`}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === config.portfolio.projects.length - 1}
                      onClick={() => {
                        if (idx === config.portfolio.projects.length - 1) return;
                        const next = [...config.portfolio.projects];
                        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                        onChange({
                          ...config,
                          portfolio: { ...config.portfolio, projects: next },
                        });
                      }}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                      aria-label={`Move ${proj.title} down`}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    {config.portfolio.projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          onChange({
                            ...config,
                            portfolio: {
                              ...config.portfolio,
                              projects: config.portfolio.projects.filter(
                                (p) => p.id !== proj.id
                              ),
                            },
                          })
                        }
                        className="p-1 text-slate-400 hover:text-rose-400"
                        aria-label={`Delete ${proj.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Custom Project Image Upload & Fit Controls */}
                <div className="p-2.5 rounded-lg bg-[#0d0822] border border-violet-500/25 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-200">
                      <ImageIcon className="w-3.5 h-3.5 text-violet-300" />
                      Project Image
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          uploadingProjectIdxRef.current = idx;
                          portfolioImageInputRef.current?.click();
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-violet-600 hover:bg-violet-500 text-[11px] font-semibold text-white transition-colors"
                      >
                        <Upload className="w-3 h-3" />
                        {proj.imageUrl ? 'Replace' : 'Upload Image'}
                      </button>
                      {proj.imageUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...config.portfolio.projects];
                            next[idx] = { ...proj, imageUrl: undefined };
                            onChange({
                              ...config,
                              portfolio: { ...config.portfolio, projects: next },
                            });
                          }}
                          className="px-2 py-1 rounded-md bg-white/[0.06] hover:bg-rose-500/20 border border-white/10 text-[11px] text-slate-300 hover:text-rose-200 transition-colors"
                        >
                          Use 3D Visual
                        </button>
                      )}
                    </div>
                  </div>

                  {proj.imageUrl && (
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-14 rounded-md overflow-hidden border border-white/15 bg-black/40 shrink-0">
                        <img
                          src={proj.imageUrl}
                          alt={proj.title}
                          referrerPolicy="no-referrer"
                          className={`w-full h-full ${
                            proj.imageFit === 'cover'
                              ? 'object-cover'
                              : 'object-contain p-0.5'
                          }`}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="block text-[10px] font-medium text-slate-400">
                          Image Fit
                        </label>
                        <select
                          value={proj.imageFit ?? 'contain'}
                          onChange={(e) => {
                            const next = [...config.portfolio.projects];
                            next[idx] = {
                              ...proj,
                              imageFit: e.target.value as 'cover' | 'contain',
                            };
                            onChange({
                              ...config,
                              portfolio: { ...config.portfolio, projects: next },
                            });
                          }}
                          className="w-full px-2 py-1 rounded-md bg-[#140f2e] border border-white/15 text-[11px] text-white"
                        >
                          <option value="contain">Contain (Full Image — No Crop)</option>
                          <option value="cover">Cover (Crop to Fill Frame)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <InputField
                    label="Or Paste Image URL"
                    value={proj.imageUrl?.startsWith('data:') ? '' : proj.imageUrl ?? ''}
                    onChange={(v) => {
                      const next = [...config.portfolio.projects];
                      next[idx] = {
                        ...proj,
                        imageUrl: v.trim() || undefined,
                      };
                      onChange({
                        ...config,
                        portfolio: { ...config.portfolio, projects: next },
                      });
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <InputField
                    label="Project Title"
                    value={proj.title}
                    onChange={(v) => {
                      const next = [...config.portfolio.projects];
                      next[idx] = { ...proj, title: v };
                      onChange({
                        ...config,
                        portfolio: { ...config.portfolio, projects: next },
                      });
                    }}
                  />
                  <InputField
                    label="Category"
                    value={proj.category}
                    onChange={(v) => {
                      const next = [...config.portfolio.projects];
                      next[idx] = { ...proj, category: v };
                      onChange({
                        ...config,
                        portfolio: { ...config.portfolio, projects: next },
                      });
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <InputField
                    label="Client"
                    value={proj.client}
                    onChange={(v) => {
                      const next = [...config.portfolio.projects];
                      next[idx] = { ...proj, client: v };
                      onChange({
                        ...config,
                        portfolio: { ...config.portfolio, projects: next },
                      });
                    }}
                  />
                  <InputField
                    label="Key Metric"
                    value={proj.metric}
                    onChange={(v) => {
                      const next = [...config.portfolio.projects];
                      next[idx] = { ...proj, metric: v };
                      onChange({
                        ...config,
                        portfolio: { ...config.portfolio, projects: next },
                      });
                    }}
                  />
                </div>
                {!proj.imageUrl && (
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      3D Card Visual (when no image uploaded)
                    </label>
                    <select
                      value={proj.visualType}
                      onChange={(e) => {
                        const next = [...config.portfolio.projects];
                        next[idx] = {
                          ...proj,
                          visualType: e.target.value as PortfolioVisualType,
                        };
                        onChange({
                          ...config,
                          portfolio: { ...config.portfolio, projects: next },
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#140f2e] border border-white/15 text-xs text-white"
                    >
                      <option value="social-phone">3D Social Smartphone</option>
                      <option value="growth-bars">Neon Growth Bars</option>
                      <option value="ecommerce-cart">E-commerce Cart & Bags</option>
                      <option value="brand-cube">3D Brand Cube</option>
                    </select>
                  </div>
                )}
                <InputField
                  label="Summary"
                  value={proj.summary}
                  multiline
                  onChange={(v) => {
                    const next = [...config.portfolio.projects];
                    next[idx] = { ...proj, summary: v };
                    onChange({
                      ...config,
                      portfolio: { ...config.portfolio, projects: next },
                    });
                  }}
                />
                <InputField
                  label="Strategy"
                  value={proj.strategy}
                  multiline
                  onChange={(v) => {
                    const next = [...config.portfolio.projects];
                    next[idx] = { ...proj, strategy: v };
                    onChange({
                      ...config,
                      portfolio: { ...config.portfolio, projects: next },
                    });
                  }}
                />
                <InputField
                  label="Outcome"
                  value={proj.outcome}
                  multiline
                  onChange={(v) => {
                    const next = [...config.portfolio.projects];
                    next[idx] = { ...proj, outcome: v };
                    onChange({
                      ...config,
                      portfolio: { ...config.portfolio, projects: next },
                    });
                  }}
                />
                <InputField
                  label="Tags (comma-separated)"
                  value={proj.tags.join(', ')}
                  onChange={(v) => {
                    const next = [...config.portfolio.projects];
                    next[idx] = {
                      ...proj,
                      tags: v
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean),
                    };
                    onChange({
                      ...config,
                      portfolio: { ...config.portfolio, projects: next },
                    });
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="space-y-4">
            <InputField
              label="Section Heading"
              value={config.testimonials.heading}
              onChange={(v) =>
                onChange({
                  ...config,
                  testimonials: { ...config.testimonials, heading: v },
                })
              }
            />
            <InputField
              label="Subtitle"
              value={config.testimonials.subtitle}
              onChange={(v) =>
                onChange({
                  ...config,
                  testimonials: { ...config.testimonials, subtitle: v },
                })
              }
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-white">
                Testimonials ({config.testimonials.items.length})
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...config,
                    testimonials: {
                      ...config.testimonials,
                      items: [
                        ...config.testimonials.items,
                        {
                          id: `test-${Date.now()}`,
                          quote:
                            'Working with Nazar elevated our campaigns and brought predictable ROI.',
                          author: 'New Client',
                          role: 'Founder',
                          company: 'Brand Co.',
                          rating: 5,
                          initials: 'NC',
                        },
                      ],
                    },
                  })
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-violet-600 hover:bg-violet-500 text-[11px] font-semibold text-white"
              >
                <Plus className="w-3 h-3" /> Add Review
              </button>
            </div>

            {config.testimonials.items.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-violet-300">
                    Review #{idx + 1}
                  </span>
                  {config.testimonials.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...config,
                          testimonials: {
                            ...config.testimonials,
                            items: config.testimonials.items.filter(
                              (t) => t.id !== item.id
                            ),
                          },
                        })
                      }
                      className="p-1 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <InputField
                  label="Quote"
                  value={item.quote}
                  multiline
                  onChange={(v) => {
                    const next = [...config.testimonials.items];
                    next[idx] = { ...item, quote: v };
                    onChange({
                      ...config,
                      testimonials: { ...config.testimonials, items: next },
                    });
                  }}
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <InputField
                    label="Author Name"
                    value={item.author}
                    onChange={(v) => {
                      const next = [...config.testimonials.items];
                      next[idx] = { ...item, author: v };
                      onChange({
                        ...config,
                        testimonials: { ...config.testimonials, items: next },
                      });
                    }}
                  />
                  <InputField
                    label="Role"
                    value={item.role}
                    onChange={(v) => {
                      const next = [...config.testimonials.items];
                      next[idx] = { ...item, role: v };
                      onChange({
                        ...config,
                        testimonials: { ...config.testimonials, items: next },
                      });
                    }}
                  />
                </div>
                <InputField
                  label="Company"
                  value={item.company}
                  onChange={(v) => {
                    const next = [...config.testimonials.items];
                    next[idx] = { ...item, company: v };
                    onChange({
                      ...config,
                      testimonials: { ...config.testimonials, items: next },
                    });
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Heading Prefix"
                value={config.contact.headingPrefix}
                onChange={(v) =>
                  onChange({
                    ...config,
                    contact: { ...config.contact, headingPrefix: v },
                  })
                }
              />
              <InputField
                label="Heading Highlight"
                value={config.contact.headingHighlight}
                onChange={(v) =>
                  onChange({
                    ...config,
                    contact: { ...config.contact, headingHighlight: v },
                  })
                }
              />
            </div>
            <InputField
              label="Subtitle"
              value={config.contact.subtitle}
              multiline
              onChange={(v) =>
                onChange({
                  ...config,
                  contact: { ...config.contact, subtitle: v },
                })
              }
            />
            <InputField
              label="Contact Button Text"
              value={config.contact.ctaText}
              onChange={(v) =>
                onChange({
                  ...config,
                  contact: { ...config.contact, ctaText: v },
                })
              }
            />
            <InputField
              label="Business Email"
              value={config.contact.email}
              onChange={(v) =>
                onChange({
                  ...config,
                  contact: { ...config.contact, email: v },
                })
              }
            />
            <InputField
              label="Phone / WhatsApp"
              value={config.contact.phone}
              onChange={(v) =>
                onChange({
                  ...config,
                  contact: { ...config.contact, phone: v },
                })
              }
            />
            <InputField
              label="Location"
              value={config.contact.location}
              onChange={(v) =>
                onChange({
                  ...config,
                  contact: { ...config.contact, location: v },
                })
              }
            />

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <span className="text-xs font-semibold text-white">
                  WhatsApp Floating Button
                </span>
                <input
                  type="checkbox"
                  checked={config.contact.whatsappEnabled}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      contact: {
                        ...config.contact,
                        whatsappEnabled: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </label>
              <InputField
                label="Default WhatsApp Greeting"
                value={config.contact.whatsappMessage}
                onChange={(v) =>
                  onChange({
                    ...config,
                    contact: { ...config.contact, whatsappMessage: v },
                  })
                }
              />
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <span className="block text-xs font-semibold text-white">
                Google Maps Studio Pin
              </span>
              <InputField
                label="Map Section Heading"
                value={config.contact.studioMap.heading}
                onChange={(v) =>
                  onChange({
                    ...config,
                    contact: {
                      ...config.contact,
                      studioMap: { ...config.contact.studioMap, heading: v },
                    },
                  })
                }
              />
              <InputField
                label="Pin Label"
                value={config.contact.studioMap.studioLabel}
                onChange={(v) =>
                  onChange({
                    ...config,
                    contact: {
                      ...config.contact,
                      studioMap: {
                        ...config.contact.studioMap,
                        studioLabel: v,
                      },
                    },
                  })
                }
              />
              <div className="grid grid-cols-2 gap-2.5">
                <InputField
                  label="Latitude"
                  value={String(config.contact.studioMap.lat)}
                  onChange={(v) => {
                    const num = Number(v);
                    if (!Number.isNaN(num)) {
                      onChange({
                        ...config,
                        contact: {
                          ...config.contact,
                          studioMap: { ...config.contact.studioMap, lat: num },
                        },
                      });
                    }
                  }}
                />
                <InputField
                  label="Longitude"
                  value={String(config.contact.studioMap.lng)}
                  onChange={(v) => {
                    const num = Number(v);
                    if (!Number.isNaN(num)) {
                      onChange({
                        ...config,
                        contact: {
                          ...config.contact,
                          studioMap: { ...config.contact.studioMap, lng: num },
                        },
                      });
                    }
                  }}
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <span className="block text-xs font-semibold text-white">
                Social Links
              </span>
              {config.contact.socials.map((soc, idx) => (
                <div key={soc.platform} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={soc.enabled}
                    onChange={(e) => {
                      const next = [...config.contact.socials];
                      next[idx] = { ...soc, enabled: e.target.checked };
                      onChange({
                        ...config,
                        contact: { ...config.contact, socials: next },
                      });
                    }}
                    className="rounded accent-violet-500"
                    aria-label={`Toggle ${soc.platform}`}
                  />
                  <span className="w-16 text-[11px] capitalize text-slate-300">
                    {soc.platform}
                  </span>
                  <input
                    type="text"
                    value={soc.url}
                    onChange={(e) => {
                      const next = [...config.contact.socials];
                      next[idx] = { ...soc, url: e.target.value };
                      onChange({
                        ...config,
                        contact: { ...config.contact, socials: next },
                      });
                    }}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/15 text-xs text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Layers className="w-4 h-4 text-violet-400" />
                Section Order & Visibility
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Reorder or hide landing page sections without losing any content.
              </p>
            </div>

            <div className="space-y-2.5">
              {config.layout.sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/10"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      {sec.label}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {sec.visible ? 'Visible on page' : 'Hidden'}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        if (idx === 0) return;
                        const next = [...config.layout.sections];
                        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                        onChange({ ...config, layout: { sections: next } });
                      }}
                      className="p-1.5 rounded-md bg-white/[0.06] hover:bg-white/15 disabled:opacity-30 text-slate-200"
                      aria-label={`Move ${sec.label} up`}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === config.layout.sections.length - 1}
                      onClick={() => {
                        if (idx === config.layout.sections.length - 1) return;
                        const next = [...config.layout.sections];
                        [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                        onChange({ ...config, layout: { sections: next } });
                      }}
                      className="p-1.5 rounded-md bg-white/[0.06] hover:bg-white/15 disabled:opacity-30 text-slate-200"
                      aria-label={`Move ${sec.label} down`}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...config.layout.sections];
                        next[idx] = { ...sec, visible: !sec.visible };
                        onChange({ ...config, layout: { sections: next } });
                      }}
                      className={`p-1.5 rounded-md border transition-colors ${
                        sec.visible
                          ? 'bg-violet-600/30 border-violet-400/40 text-violet-200'
                          : 'bg-white/[0.04] border-white/10 text-slate-500'
                      }`}
                      aria-label={`Toggle ${sec.label} visibility`}
                    >
                      {sec.visible ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Palette className="w-4 h-4 text-violet-400" />
                Neon Lighting Palette
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1.5">
                    Neon Blue Accent
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.theme.primaryBlue}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          theme: { ...config.theme, primaryBlue: e.target.value },
                        })
                      }
                      className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-300">
                      {config.theme.primaryBlue}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1.5">
                    Neon Purple Accent
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.theme.primaryPurple}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          theme: {
                            ...config.theme,
                            primaryPurple: e.target.value,
                          },
                        })
                      }
                      className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-300">
                      {config.theme.primaryPurple}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Sparkles className="w-4 h-4 text-blue-400" />
                3D Motion & Dynamics
              </div>

              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <span className="text-xs text-slate-200">
                  Full 360° Sphere Rotation
                </span>
                <input
                  type="checkbox"
                  checked={config.theme.full3DSpin}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      theme: { ...config.theme, full3DSpin: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-violet-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <span className="text-xs text-slate-200">
                  Interactive 3D Card Hover Tilt
                </span>
                <input
                  type="checkbox"
                  checked={config.theme.cardTilt3D}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      theme: { ...config.theme, cardTilt3D: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-violet-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <span className="text-xs text-slate-200">
                  Custom Neon Cursor Aura
                </span>
                <input
                  type="checkbox"
                  checked={config.theme.customCursor}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      theme: { ...config.theme, customCursor: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-violet-500 rounded"
                />
              </label>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">3D Orbit & Spin Speed</span>
                  <span className="text-violet-300 tabular-nums">
                    {config.theme.rotationSpeed.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2.5}
                  step={0.1}
                  value={config.theme.rotationSpeed}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      theme: {
                        ...config.theme,
                        rotationSpeed: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-violet-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">3D Floating Intensity</span>
                  <span className="text-indigo-300 tabular-nums">
                    {Math.round(config.theme.floatIntensity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2.0}
                  step={0.1}
                  value={config.theme.floatIntensity}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      theme: {
                        ...config.theme,
                        floatIntensity: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Neon Glow Intensity</span>
                  <span className="text-blue-300 tabular-nums">
                    {Math.round(config.theme.glowIntensity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.3}
                  max={1.6}
                  step={0.05}
                  value={config.theme.glowIntensity}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      theme: {
                        ...config.theme,
                        glowIntensity: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions: Export / Import / Reset */}
      <div className="p-4 border-t border-white/10 bg-white/[0.02] space-y-2.5">
        {importError && (
          <p className="text-[11px] text-rose-400">{importError}</p>
        )}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-white transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> Import
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/25 text-xs font-medium text-rose-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleImport}
          className="hidden"
        />
      </div>
    </aside>
  );
};
