export type ServiceIconKey =
  | 'meta-ads'
  | 'digital-marketing'
  | 'social-media'
  | 'shopify'
  | 'video-editing'
  | 'graphic-design'
  | 'analytics';

export type PortfolioVisualType =
  | 'social-phone'
  | 'growth-bars'
  | 'ecommerce-cart'
  | 'brand-cube';

export type SocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'linkedin'
  | 'x';

export type PageSectionId =
  | 'front-portrait'
  | 'hero'
  | 'services'
  | 'about'
  | 'portfolio'
  | 'testimonials-contact'
  | 'location-map';

export interface SectionLayoutItem {
  id: PageSectionId;
  label: string;
  visible: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  iconKey: ServiceIconKey;
  imageUrl?: string;
  imageFit?: 'cover' | 'contain';
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  iconKey: 'clients' | 'rating' | 'reach';
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  visualType: PortfolioVisualType;
  imageUrl?: string;
  imageFit?: 'cover' | 'contain';
  metric: string;
  client: string;
  summary: string;
  strategy: string;
  outcome: string;
  tags: string[];
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  initials: string;
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  enabled: boolean;
}

export interface SiteConfig {
  brand: {
    monogram: string;
    name: string;
    role: string;
    tagline: string;
    copyright: string;
  };
  theme: {
    primaryBlue: string;
    primaryPurple: string;
    glowIntensity: number;
    rotationSpeed: number;
    full3DSpin: boolean;
    floatIntensity: number;
    cardTilt3D: boolean;
    customCursor: boolean;
  };
  layout: {
    sections: SectionLayoutItem[];
  };
  hero: {
    kicker: string;
    headlineLine1: string;
    headlineLine2: string;
    subheadline: string;
    description: string;
    primaryCtaText: string;
    secondaryCtaText: string;
    introSummary: string;
  };
  portrait: {
    imageDataUrl: string;
    caption: string;
    badgeText: string;
    headline: string;
    subtext: string;
    ctaText: string;
    imageFit: 'cover' | 'contain';
    scroll3DStrength: number;
  };
  services: {
    kicker: string;
    headingPrefix: string;
    headingHighlight: string;
    subtitle: string;
    items: ServiceItem[];
  };
  about: {
    kicker: string;
    headingPrefix: string;
    headingHighlight: string;
    bio: string;
    expandedBio: string;
    specialties: string[];
    ctaText: string;
    stats: StatItem[];
    hologramBadgeText: string;
  };
  portfolio: {
    kicker: string;
    headingPrefix: string;
    headingHighlight: string;
    subtitle: string;
    ctaText: string;
    projects: PortfolioProject[];
  };
  testimonials: {
    kicker: string;
    heading: string;
    subtitle: string;
    items: TestimonialItem[];
  };
  contact: {
    kicker: string;
    headingPrefix: string;
    headingHighlight: string;
    subtitle: string;
    ctaText: string;
    email: string;
    phone: string;
    location: string;
    whatsappEnabled: boolean;
    whatsappMessage: string;
    socials: SocialLink[];
    studioMap: {
      heading: string;
      subtitle: string;
      studioLabel: string;
      lat: number;
      lng: number;
      zoom: number;
    };
  };
}

export type EditorSectionKey =
  | 'brand'
  | 'portrait'
  | 'hero'
  | 'services'
  | 'about'
  | 'portfolio'
  | 'testimonials'
  | 'contact'
  | 'layout'
  | 'theme';
