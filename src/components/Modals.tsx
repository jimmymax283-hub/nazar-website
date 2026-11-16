import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Mail,
  MapPin,
  Phone,
  Play,
  Sparkles,
  X,
} from 'lucide-react';
import {
  PortfolioProject,
  ServiceItem,
  SiteConfig,
} from '../types/siteConfig';
import { PortfolioSceneGraphic, ServiceIconGraphic } from './VisualGraphics';
import { NJEmblem } from './NJEmblem';

interface BaseModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl',
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidth} max-h-[88vh] overflow-y-auto rounded-2xl bg-[#0b081d] border border-violet-500/35 shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.22)] p-6 sm:p-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-violet-400"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const IntroModal: React.FC<{
  config: SiteConfig;
  onClose: () => void;
  onBookCall: () => void;
}> = ({ config, onClose, onBookCall }) => {
  const [playing, setPlaying] = useState(true);

  return (
    <BaseModal title={`${config.brand.name} — Agency Reel`} onClose={onClose}>
      <div className="space-y-6">
        <div className="relative aspect-video rounded-xl overflow-hidden border border-violet-500/30 bg-[#050311] flex flex-col items-center justify-center p-6 text-center">
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${config.theme.primaryBlue}55, transparent 55%), radial-gradient(circle at 75% 70%, ${config.theme.primaryPurple}66, transparent 55%)`,
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-4 max-w-md">
            <NJEmblem monogram={config.brand.monogram} size={68} />
            <p className="font-display text-2xl font-bold text-white">
              {config.hero.headlineLine1}{' '}
              <span className="neon-gradient-text">
                {config.hero.headlineLine2}
              </span>
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {config.hero.introSummary}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {playing ? 'Pause Reel Preview' : 'Resume Reel Preview'}
              </button>
              <span className="text-xs text-slate-400 tabular-nums">
                {playing ? '00:18 / 01:15' : 'Paused'}
              </span>
            </div>
          </div>
          {/* Animated subtle progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div
              className={`h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-1000 ${
                playing ? 'w-2/3' : 'w-1/3'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {config.about.stats.map((st) => (
            <div
              key={st.id}
              className="rounded-xl p-4 bg-white/[0.03] border border-white/10 text-center"
            >
              <div className="font-display text-xl sm:text-2xl font-bold text-white tabular-nums">
                {st.value}
              </div>
              <div className="text-xs text-slate-400 mt-1">{st.label}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onBookCall();
            }}
            className="neon-cta-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white"
          >
            {config.hero.primaryCtaText}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export const ServiceDetailModal: React.FC<{
  service: ServiceItem;
  onClose: () => void;
  onInquire: (serviceTitle: string) => void;
}> = ({ service, onClose, onInquire }) => {
  return (
    <BaseModal title={service.title} onClose={onClose}>
      <div className="space-y-6">
        {service.imageUrl ? (
          <div className="rounded-xl bg-white/[0.03] border border-violet-500/25 overflow-hidden">
            <div className="w-full bg-[#070416] border-b border-white/10">
              <img
                src={service.imageUrl}
                alt={service.title}
                referrerPolicy="no-referrer"
                className={
                  service.imageFit === 'cover'
                    ? 'w-full h-56 object-cover'
                    : 'w-full h-auto max-h-80 object-contain block mx-auto'
                }
              />
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold text-violet-300 mb-1">
                {service.tagline}
              </p>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 rounded-xl bg-white/[0.03] border border-violet-500/25">
            <div className="shrink-0">
              <ServiceIconGraphic iconKey={service.iconKey} />
            </div>
            <div>
              <p className="text-xs font-semibold text-violet-300 mb-1">
                {service.tagline}
              </p>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-display text-sm font-semibold text-slate-200 mb-3">
            Included Deliverables
          </h4>
          <ul className="space-y-2.5">
            {service.deliverables.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm text-slate-300"
              >
                <span className="mt-0.5 w-5 h-5 rounded-full bg-violet-500/20 border border-violet-400/40 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-violet-300" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Back to Services
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onInquire(service.title);
            }}
            className="neon-cta-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white"
          >
            Book {service.title}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export const PortfolioModal: React.FC<{
  projects: PortfolioProject[];
  initialProjectId: string | null;
  monogram: string;
  onClose: () => void;
  onInquire: (projectTitle: string) => void;
}> = ({ projects, initialProjectId, monogram, onClose, onInquire }) => {
  const [selectedId, setSelectedId] = useState<string | null>(initialProjectId);
  const selected = projects.find((p) => p.id === selectedId) || null;

  return (
    <BaseModal
      title={selected ? selected.title : 'All Portfolio Case Studies'}
      onClose={onClose}
      maxWidth="max-w-4xl"
    >
      {selected ? (
        <div className="space-y-6">
          {selected.imageUrl ? (
            <div className="rounded-xl overflow-hidden border border-violet-500/30 bg-[#070416]">
              <img
                src={selected.imageUrl}
                alt={selected.title}
                referrerPolicy="no-referrer"
                className={
                  selected.imageFit === 'cover'
                    ? 'w-full h-60 object-cover'
                    : 'w-full h-auto max-h-96 object-contain block mx-auto'
                }
              />
            </div>
          ) : (
            <div className="h-52 rounded-xl overflow-hidden border border-violet-500/30">
              <PortfolioSceneGraphic
                visualType={selected.visualType}
                monogram={monogram}
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div>
              <div className="text-xs text-slate-400">
                {selected.client} · {selected.category}
              </div>
              <div className="font-display text-lg sm:text-xl font-bold text-white mt-0.5">
                {selected.metric}
              </div>
            </div>
            <div className="text-xs text-slate-400">
              {selected.tags.join(' · ')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <h5 className="font-display text-sm font-semibold text-violet-300 mb-1.5">
                Challenge
              </h5>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selected.summary}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <h5 className="font-display text-sm font-semibold text-blue-300 mb-1.5">
                Strategy
              </h5>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selected.strategy}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <h5 className="font-display text-sm font-semibold text-emerald-300 mb-1.5">
                Impact
              </h5>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selected.outcome}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="px-4 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              View All Projects
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onInquire(selected.title);
              }}
              className="neon-cta-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white"
            >
              Build Similar Results
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {projects.map((proj) => (
            <button
              key={proj.id}
              type="button"
              onClick={() => setSelectedId(proj.id)}
              className="group text-left rounded-xl overflow-hidden border border-violet-500/25 bg-white/[0.02] hover:border-violet-400/60 transition-all"
            >
              {proj.imageUrl ? (
                <div className="w-full bg-[#070416] border-b border-white/10">
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className={
                      proj.imageFit === 'cover'
                        ? 'w-full h-40 object-cover'
                        : 'w-full h-auto max-h-64 object-contain block mx-auto'
                    }
                  />
                </div>
              ) : (
                <div className="h-40 w-full">
                  <PortfolioSceneGraphic
                    visualType={proj.visualType}
                    monogram={monogram}
                  />
                </div>
              )}
              <div className="p-4">
                <div className="text-xs text-slate-400 mb-1">
                  {proj.client} · {proj.category}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-display text-base font-semibold text-white group-hover:text-violet-300 transition-colors">
                    {proj.title}
                  </h4>
                  <ArrowRight className="w-4 h-4 text-violet-300 shrink-0" />
                </div>
                <p className="text-xs text-blue-300 font-medium mt-1.5">
                  {proj.metric}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </BaseModal>
  );
};

export const AboutModal: React.FC<{
  config: SiteConfig;
  onClose: () => void;
  onContact: () => void;
}> = ({ config, onClose, onContact }) => {
  return (
    <BaseModal
      title={`${config.about.headingPrefix} ${config.about.headingHighlight}`}
      onClose={onClose}
    >
      <div className="space-y-6">
        <p className="text-base text-slate-200 leading-relaxed">
          {config.about.bio}
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          {config.about.expandedBio}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {config.about.specialties.map((spec, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10"
            >
              <span className="w-6 h-6 rounded-full bg-violet-500/25 border border-violet-400/50 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-violet-200" />
              </span>
              <span className="text-sm font-medium text-white">{spec}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onContact();
            }}
            className="neon-cta-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white"
          >
            {config.contact.ctaText}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export const ContactModal: React.FC<{
  config: SiteConfig;
  defaultSubject?: string;
  onClose: () => void;
}> = ({ config, defaultSubject = '', onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(
    defaultSubject || config.services.items[0]?.title || 'Meta Ads'
  );
  const [budget, setBudget] = useState('$1,500 – $3,000 / mo');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!message.trim()) {
      setError('Please tell us briefly about your project goals.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const copyEmail = () => {
    navigator.clipboard?.writeText(config.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BaseModal
      title={`${config.contact.headingPrefix} ${config.contact.headingHighlight}`}
      onClose={onClose}
    >
      {submitted ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h4 className="font-display text-2xl font-bold text-white">
            Inquiry Received
          </h4>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Thank you, <span className="text-white font-semibold">{name}</span>.
            Your inquiry for <span className="text-violet-300">{service}</span>{' '}
            has been logged. {config.brand.name} will reply to{' '}
            <span className="text-white">{email}</span> within 24 hours.
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={onClose}
              className="neon-cta-btn px-6 py-2.5 rounded-full text-sm font-semibold text-white"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <button
              type="button"
              onClick={copyEmail}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-violet-400/40 text-left transition-colors"
            >
              <Mail className="w-4 h-4 text-violet-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-slate-400">Email</div>
                <div className="text-white font-medium truncate">
                  {config.contact.email}
                </div>
              </div>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              )}
            </button>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <Phone className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-slate-400">Phone</div>
                <div className="text-white font-medium truncate">
                  {config.contact.phone}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-slate-400">Location</div>
                <div className="text-white font-medium truncate">
                  {config.contact.location}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmed Khan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ahmed@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Service Interested In
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#130e2c] border border-white/15 text-sm text-white focus:outline-none focus:border-violet-400"
                >
                  {config.services.items.map((srv) => (
                    <option key={srv.id} value={srv.title}>
                      {srv.title}
                    </option>
                  ))}
                  <option value="Full Brand Growth Package">
                    Full Brand Growth Package
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Estimated Budget
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#130e2c] border border-white/15 text-sm text-white focus:outline-none focus:border-violet-400"
                >
                  <option>$500 – $1,500 / mo</option>
                  <option>$1,500 – $3,000 / mo</option>
                  <option>$3,000 – $7,500 / mo</option>
                  <option>$7,500+ Enterprise</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Project Details
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your brand, target audience, and timeline..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-400 resize-none"
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-rose-400">{error}</p>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                Free 20-min strategy audit included
              </span>
              <button
                type="submit"
                className="neon-cta-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white whitespace-nowrap"
              >
                Send Message
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </BaseModal>
  );
};
