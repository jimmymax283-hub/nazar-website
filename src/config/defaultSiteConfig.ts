import { SiteConfig } from '../types/siteConfig';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brand: {
    monogram: 'NJ',
    name: 'Nazar Jalalzai',
    role: 'Digital Marketer',
    tagline: 'Think Smart. Market Better.',
    copyright: '© 2026 Nazar Jalalzai. All Rights Reserved.',
  },
  theme: {
    primaryBlue: '#3b82f6',
    primaryPurple: '#8b5cf6',
    glowIntensity: 0.9,
    rotationSpeed: 1.1,
    full3DSpin: true,
    floatIntensity: 1.0,
    cardTilt3D: true,
    customCursor: true,
  },
  layout: {
    sections: [
      { id: 'front-portrait', label: 'Front Full Image', visible: true },
      { id: 'hero', label: 'Hero & 3D NJ Logo', visible: true },
      { id: 'services', label: 'Our Services', visible: true },
      { id: 'about', label: 'About & 3D Laptop', visible: true },
      { id: 'portfolio', label: 'Latest Work Portfolio', visible: true },
      {
        id: 'testimonials-contact',
        label: 'Testimonials & Contact',
        visible: true,
      },
    ],
  },
  hero: {
    kicker: 'Digital Marketing Agency',
    headlineLine1: 'We Build Brands.',
    headlineLine2: 'We Create Growth.',
    subheadline: 'Smart Strategies. Real Results.',
    description:
      'From Meta Ads to Social Media Marketing, we help businesses grow in the digital world.',
    primaryCtaText: "Let's Grow Together",
    secondaryCtaText: 'Watch Intro',
    introSummary:
      'A full-funnel digital growth studio combining high-ROAS Meta advertising, viral social media systems, conversion-ready Shopify storefronts, and high-retention video editing.',
  },
  portrait: {
    imageDataUrl: '',
    caption: 'Nazar Jalalzai',
    badgeText: 'Founder & Lead Strategist',
    headline: 'Meet The Mind Behind The Growth',
    subtext:
      'Turning ambitious brands into category leaders through precision Meta Ads, high-converting Shopify experiences, and bold creative direction.',
    ctaText: 'Work With Me',
    imageFit: 'cover',
    scroll3DStrength: 1.1,
  },
  services: {
    kicker: 'Our Services',
    headingPrefix: 'What We',
    headingHighlight: 'Offer?',
    subtitle: 'Everything you need to grow your business online.',
    items: [
      {
        id: 'srv-meta-ads',
        title: 'Meta Ads',
        tagline: 'Target. Reach. Convert.',
        description:
          'Precision Facebook & Instagram ad funnels built for scalable ROAS, qualified leads, and profitable customer acquisition.',
        deliverables: [
          'Full-funnel campaign architecture (TOF / MOF / BOF)',
          'Scroll-stopping creative testing & hook iteration',
          'Pixel & Conversions API tracking setup',
          'Weekly ROAS & CPA optimization sprints',
        ],
        iconKey: 'meta-ads',
      },
      {
        id: 'srv-digital-marketing',
        title: 'Digital Marketing',
        tagline: 'Grow Your Brand.',
        description:
          'Holistic multi-channel acquisition systems aligning paid traffic, search intent, and lifecycle retention into measurable revenue.',
        deliverables: [
          'Go-to-market growth roadmap & KPI modeling',
          'Conversion rate audits & landing page flows',
          'Email & automated retention sequences',
          'Cross-channel attribution dashboards',
        ],
        iconKey: 'digital-marketing',
      },
      {
        id: 'srv-social-media',
        title: 'Social Media Marketing',
        tagline: 'Engage. Grow. Thrive.',
        description:
          'Platform-native content engines across Instagram, TikTok, Facebook, and YouTube that turn attention into loyal communities.',
        deliverables: [
          'Monthly content calendar & short-form scripts',
          'Reels & TikTok editing systems for organic reach',
          'Community growth & creator collaboration strategy',
          'Monthly audience & engagement analytics',
        ],
        iconKey: 'social-media',
      },
      {
        id: 'srv-shopify',
        title: 'Shopify',
        tagline: 'Sell More Online.',
        description:
          'High-converting Shopify stores engineered for fast checkout, clear product storytelling, and higher average order value.',
        deliverables: [
          'Custom Shopify theme setup & mobile UX polish',
          'Product page persuasion & bundle upsell flows',
          'Payment, shipping & analytics integration',
          'Cart abandonment recovery & speed tuning',
        ],
        iconKey: 'shopify',
      },
      {
        id: 'srv-video-editing',
        title: 'Video Editing',
        tagline: 'Cut. Captivate. Convert.',
        description:
          'High-retention Reels, TikToks, YouTube edits, and scroll-stopping video ads crafted to hook viewers and drive sales.',
        deliverables: [
          'Viral Reels, Shorts & TikTok edits with dynamic captions',
          'High-CTR Meta & YouTube video ad variations',
          'Color grading, pacing, sound design & motion overlays',
          'Hook A/B variations built for paid & organic growth',
        ],
        iconKey: 'video-editing',
      },
    ],
  },
  about: {
    kicker: 'About Me',
    headingPrefix: "Hi, I'm",
    headingHighlight: 'Nazar Jalalzai',
    bio: 'A passionate Digital Marketer, focused on helping businesses grow through creative strategies, data-driven marketing, and modern tools.',
    expandedBio:
      'Over the past several years, I have partnered with ambitious founders, e-commerce labels, and B2B teams worldwide to transform ad spend into predictable revenue. By pairing sharp creative direction with disciplined media buying and Shopify conversion engineering, every campaign is built to compound brand equity alongside immediate sales.',
    specialties: [
      'Meta Ads Expert',
      'Social Media Strategist',
      'Shopify Specialist',
      'Video Editor',
    ],
    ctaText: 'Know More About Me',
    stats: [
      {
        id: 'stat-clients',
        value: '100+',
        label: 'Happy Clients',
        iconKey: 'clients',
      },
      {
        id: 'stat-rating',
        value: '4.9/5',
        label: 'Client Satisfaction',
        iconKey: 'rating',
      },
      {
        id: 'stat-reach',
        value: '1M+',
        label: 'Reach Delivered',
        iconKey: 'reach',
      },
    ],
    hologramBadgeText: 'Grow Together',
  },
  portfolio: {
    kicker: 'My Portfolio',
    headingPrefix: 'Our',
    headingHighlight: 'Latest Work',
    subtitle: 'Creative projects. Real impact.',
    ctaText: 'View All Projects',
    projects: [
      {
        id: 'proj-social-campaign',
        title: 'Social Media Campaign',
        category: 'Social Media Marketing',
        visualType: 'social-phone',
        metric: '+240% Organic Reach in 90 Days',
        client: 'Veloce Apparel',
        summary:
          'Rebuilt short-form Reels and TikTok storytelling with creator-led hooks and interactive community challenges.',
        strategy:
          'Produced 24 modular vertical video hooks per month paired with retargeted engagement ads.',
        outcome:
          'Generated 1.4M+ organic views, tripled profile link clicks, and cut blended CAC by 34%.',
        tags: ['Instagram Reels', 'TikTok Growth', 'Content System'],
      },
      {
        id: 'proj-brand-growth',
        title: 'Brand Growth Strategy',
        category: 'Meta Ads & Funnels',
        visualType: 'growth-bars',
        metric: '4.2x Blended ROAS in 6 Months',
        client: 'TechVision Solutions',
        summary:
          'Scaled paid acquisition from regional testing to international lead & demo generation using dynamic creative testing.',
        strategy:
          'Segmented cold prospect angles by pain point and paired each ad set with dedicated high-speed landing pages.',
        outcome:
          'Delivered 310+ qualified SQLs per quarter at a 41% lower cost per booked call.',
        tags: ['Meta Ads', 'Lead Generation', 'Funnel CRO'],
      },
      {
        id: 'proj-ecommerce-store',
        title: 'E-commerce Store',
        category: 'Shopify & Paid Social',
        visualType: 'ecommerce-cart',
        metric: '$185K+ Monthly Store Revenue',
        client: 'Aura Botanics',
        summary:
          'Redesigned the full Shopify shopping experience with one-click bundle upsells and Meta catalog retargeting.',
        strategy:
          'Streamlined mobile product pages, added trust-first social proof blocks, and launched tiered cart incentives.',
        outcome:
          'Lifted store conversion rate from 1.7% to 3.4% and increased average order value by 28%.',
        tags: ['Shopify', 'CRO Design', 'Dynamic Ads'],
      },
      {
        id: 'proj-creative-branding',
        title: 'Creative Branding',
        category: 'Brand Identity & Design',
        visualType: 'brand-cube',
        metric: '2.6x Higher Ad Click-Through Rate',
        client: 'NJ Studio & Partners',
        summary:
          'Crafted a futuristic 3D visual language, neon-obsidian palette, and modular social ad template suite.',
        strategy:
          'Unified typography, 3D icon renders, and unmistakable brand marks across every touchpoint.',
        outcome:
          'Boosted ad thumbstop ratio to 44% and established instant visual recall across feeds.',
        tags: ['3D Branding', 'Ad Creatives', 'Visual System'],
      },
    ],
  },
  testimonials: {
    kicker: 'Testimonials',
    heading: 'What Our Clients Say',
    subtitle: 'Trusted by businesses and creators worldwide.',
    items: [
      {
        id: 'test-ahmed',
        quote:
          'Nazar Jalalzai transformed our online presence. His strategies are outstanding and delivered measurable growth within weeks.',
        author: 'Ahmed Khan',
        role: 'CEO',
        company: 'TechVision',
        rating: 5,
        initials: 'AK',
      },
      {
        id: 'test-sara',
        quote:
          'Our Shopify store conversion rate doubled after Nazar redesigned our funnel and took over our Meta Ads creative testing.',
        author: 'Sara Al-Mansoor',
        role: 'Founder',
        company: 'Aura Botanics',
        rating: 5,
        initials: 'SA',
      },
      {
        id: 'test-daniel',
        quote:
          'From brand visuals to daily social execution, Nazar brings rare clarity and speed. Every dollar spent is tracked to real ROI.',
        author: 'Daniel Brooks',
        role: 'Marketing Director',
        company: 'Veloce Apparel',
        rating: 5,
        initials: 'DB',
      },
    ],
  },
  contact: {
    kicker: 'Get In Touch',
    headingPrefix: "Let's Work",
    headingHighlight: 'Together!',
    subtitle: "Have a project in mind? Let's turn your ideas into success.",
    ctaText: 'Contact Me',
    email: 'jimmymax283@gmail.com',
    phone: '+92 3098059749',
    location: 'Pakistan · Remote Worldwide',
    whatsappEnabled: true,
    whatsappMessage: "Hi Nazar! I'd like to discuss growing my brand.",
    socials: [
      { platform: 'facebook', url: 'https://facebook.com', enabled: true },
      { platform: 'instagram', url: 'https://instagram.com', enabled: true },
      { platform: 'youtube', url: 'https://youtube.com', enabled: true },
      { platform: 'tiktok', url: 'https://tiktok.com', enabled: true },
      { platform: 'linkedin', url: 'https://linkedin.com', enabled: true },
      { platform: 'x', url: 'https://x.com', enabled: true },
    ],
    studioMap: {
      heading: 'Agency Studio & Global Coverage',
      subtitle:
        'Connect with our studio worldwide or open the map to view our hub and contact channels.',
      studioLabel: 'Nazar Jalalzai Studio',
      lat: 25.2048,
      lng: 55.2708,
      zoom: 11,
    },
  },
};
