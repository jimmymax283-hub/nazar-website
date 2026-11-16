import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

interface ChatHistoryTurn {
  role: 'user' | 'model';
  text: string;
}

interface SiteContextPayload {
  brand?: {
    monogram?: string;
    name?: string;
    role?: string;
    tagline?: string;
  };
  hero?: {
    kicker?: string;
    headline?: string;
    subheadline?: string;
    description?: string;
    introSummary?: string;
  };
  services?: Array<{
    title?: string;
    tagline?: string;
    description?: string;
    deliverables?: string[];
  }>;
  about?: {
    bio?: string;
    expandedBio?: string;
    specialties?: string[];
    stats?: Array<{ value?: string; label?: string }>;
  };
  portfolio?: Array<{
    title?: string;
    category?: string;
    client?: string;
    metric?: string;
    summary?: string;
    strategy?: string;
    outcome?: string;
    tags?: string[];
  }>;
  testimonials?: Array<{
    author?: string;
    role?: string;
    company?: string;
    quote?: string;
  }>;
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
    whatsappEnabled?: boolean;
  };
}

function createGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function buildSystemInstruction(ctx?: SiteContextPayload): string {
  const brandName = ctx?.brand?.name || 'Nazar Jalalzai';
  const brandRole = ctx?.brand?.role || 'Digital Marketer';
  const brandTagline = ctx?.brand?.tagline || 'Think Smart. Market Better.';

  const servicesText =
    ctx?.services && ctx.services.length > 0
      ? ctx.services
          .slice(0, 12)
          .map((s, idx) => {
            const deliverables =
              s.deliverables && s.deliverables.length > 0
                ? ` Deliverables: ${s.deliverables.slice(0, 6).join('; ')}.`
                : '';
            return `${idx + 1}. ${s.title || 'Service'} (${s.tagline || ''}): ${
              s.description || ''
            }${deliverables}`;
          })
          .join('\n')
      : [
          '1. Meta Ads (Target. Reach. Convert.): Precision Facebook & Instagram ad funnels for ROAS, leads, and customer acquisition.',
          '2. Digital Marketing (Grow Your Brand.): Full-funnel acquisition roadmaps, CRO audits, retention, and cross-channel attribution.',
          '3. Social Media Marketing (Engage. Grow. Thrive.): Short-form Reels, TikTok, Facebook, and YouTube growth engines.',
          '4. Shopify (Sell More Online.): High-converting Shopify store builds, product page persuasion, and checkout optimization.',
          '5. Video Editing (Cut. Captivate. Convert.): High-retention Reels, TikToks, YouTube edits, and scroll-stopping video ads.',
        ].join('\n');

  const portfolioText =
    ctx?.portfolio && ctx.portfolio.length > 0
      ? ctx.portfolio
          .slice(0, 10)
          .map(
            (p, idx) =>
              `${idx + 1}. ${p.title || 'Project'} (${p.category || 'Growth'}) for ${
                p.client || 'Client'
              } — Result: ${p.metric || ''}. ${p.summary || ''} Outcome: ${
                p.outcome || ''
              }`
          )
          .join('\n')
      : 'Featured case studies include +240% Organic Reach for Veloce Apparel, 4.2x Blended ROAS for TechVision Solutions, $185K+/mo Shopify Revenue for Aura Botanics, and 2.6x higher Ad CTR for Creative Branding.';

  const statsText =
    ctx?.about?.stats && ctx.about.stats.length > 0
      ? ctx.about.stats.map((st) => `${st.value} ${st.label}`).join(', ')
      : '100+ Happy Clients, 4.9/5 Client Satisfaction, 1M+ Reach Delivered';

  const specialtiesText =
    ctx?.about?.specialties && ctx.about.specialties.length > 0
      ? ctx.about.specialties.join(', ')
      : 'Meta Ads Expert, Social Media Strategist, Shopify Specialist, Video Editor';

  const testimonialsText =
    ctx?.testimonials && ctx.testimonials.length > 0
      ? ctx.testimonials
          .slice(0, 5)
          .map(
            (t) =>
              `- "${t.quote}" — ${t.author} (${t.role}, ${t.company})`
          )
          .join('\n')
      : '';

  const contactEmail = ctx?.contact?.email || 'jimmymax283@gmail.com';
  const contactPhone = ctx?.contact?.phone || '+92 3098059749';
  const contactLocation = ctx?.contact?.location || 'Pakistan · Remote Worldwide';

  return `You are the expert **Digital Marketing Knowledge Mentor & Agency AI Assistant** for ${brandName}'s website (${brandRole} — "${brandTagline}").
Your dual mission is:
1. **Educate Visitors**: Give clear, practical, up-to-date digital marketing knowledge on ANY digital marketing skill, strategy, metric, or tool a visitor asks about — so everyone who visits this website leaves smarter.
2. **Represent ${brandName}**: Answer questions about ${brandName}'s services, portfolio results, bio, and how visitors can hire or contact ${brandName}.

WEBSITE KNOWLEDGE BASE:
- Brand & Mission: ${ctx?.hero?.headline || 'We Build Brands. We Create Growth.'} ${
    ctx?.hero?.subheadline || 'Smart Strategies. Real Results.'
  }
- Overview: ${ctx?.hero?.introSummary || ctx?.hero?.description || ''}
- About ${brandName}: ${ctx?.about?.bio || ''} ${ctx?.about?.expandedBio || ''}
- Core Specialties: ${specialtiesText}
- Track Record & Stats: ${statsText}

SERVICES OFFERED:
${servicesText}

PORTFOLIO CASE STUDIES & RESULTS:
${portfolioText}

${testimonialsText ? `CLIENT TESTIMONIALS:\n${testimonialsText}\n` : ''}CONTACT & BOOKING DETAILS:
- Phone / WhatsApp: ${contactPhone}
- Gmail / Email: ${contactEmail}
- Location / Coverage: ${contactLocation}
- Visitors can click "Let's Talk" / "Contact Me" on the website, message on WhatsApp (${contactPhone}), or email ${contactEmail} to discuss a project.

COMPREHENSIVE DIGITAL MARKETING SKILLS & KNOWLEDGE BASE (Use this to teach & advise visitors clearly):
1. **Meta Ads (Facebook & Instagram Ads)**:
   - **Campaign Objectives**: Sales (Conversions), Leads (Instant Forms / Website), Engagement, Traffic, Awareness. Always match objective to business goal (use Sales/Purchase for e-commerce, Leads for service businesses).
   - **Structure & Targeting**: CBO (Advantage+ Campaign Budget) vs ABO (Ad Set Budget Optimization); Advantage+ Shopping Campaigns (ASC); Broad targeting (letting creative do the targeting), Interest stacks, Custom Audiences (website visitors, IG/FB engagers, video viewers, Add-to-Cart, past buyers), and Lookalike Audiences (1%–5%).
   - **Tracking**: Meta Pixel + Conversions API (CAPI) with deduplication for accurate iOS14+ attribution and Event Match Quality.
   - **Creative Strategy**: The 3-second Hook (visual + text/spoken pattern interrupt) -> Problem/Desire Body -> Proof -> Clear Call-to-Action (CTA). Test UGC videos, founder talking-heads, before/after demos, and bold static graphics.
   - **Key Metrics & Formulas**:
     - ROAS (Return on Ad Spend) = Revenue ÷ Ad Spend
     - CPA (Cost Per Acquisition) = Ad Spend ÷ Purchases/Leads
     - CTR (Click-Through Rate) = (Clicks ÷ Impressions) × 100
     - CPM = Cost per 1,000 impressions
     - Hook Rate = 3-Second Video Plays ÷ Impressions (aim for 25–35%+)
     - Hold Rate = ThruPlays ÷ 3-Second Video Plays
   - **Scaling**: Horizontal scaling (new creative hooks, angles, audiences) and vertical scaling (gradually raising winning budgets 15–25% without resetting the learning phase).

2. **Full-Funnel Digital Marketing & Conversion Rate Optimization (CRO)**:
   - **TOFU (Top of Funnel)**: Cold audiences — attention, problem awareness, thumb-stopping short videos & educational hooks.
   - **MOFU (Middle of Funnel)**: Warm audiences — trust building, testimonials, product demos, case studies, retargeting.
   - **BOFU (Bottom of Funnel)**: Hot prospects — clear offers, bundle discounts, urgency, abandoned cart reminders, WhatsApp/booking CTAs.
   - **Unit Economics**: CAC (Customer Acquisition Cost), LTV (Lifetime Value), AOV (Average Order Value), Break-Even ROAS = 1 ÷ Gross Profit Margin.
   - **Landing Page CRO**: Clear above-the-fold headline, fast mobile load speed, social proof/reviews, frictionless checkout or lead form, and A/B testing.
   - **Lifecycle Retention**: Automated Email, SMS, and WhatsApp flows (Welcome series, Abandoned Cart, Post-Purchase upsell, Win-Back).

3. **Social Media Marketing (Instagram, TikTok, YouTube, Facebook, LinkedIn)**:
   - **Content Pillars**: Education/How-To, Authority/Proof/Results, Storytelling/Behind-the-Scenes, Trending Formats, and Direct Conversion Offers.
   - **Algorithm Signals**: Retention/Watch time & completion rate, Saves, Shares (DM sends), and meaningful Comments matter more than vanity likes.
   - **Profile Funnel**: Clear bio stating WHO you help + HOW + CTA link (WhatsApp/website), pinned proof posts, and interactive Stories.

4. **Shopify & E-Commerce Growth**:
   - **High-Converting Product Pages**: High-res/uncropped product media, benefit-driven bullet points, trust badges, shipping/return clarity, sticky Add-to-Cart button, and verified reviews.
   - **Increasing AOV**: Product bundles, tiered volume discounts, in-cart upsells, free shipping threshold bar, and one-click post-purchase offers.
   - **Cart Recovery & Dynamic Ads**: Checkout speed optimization, COD/card trust signals, automated cart abandonment reminders, and Meta Catalog Dynamic Product Ads (DPA).

5. **Video Editing for Retention & High-CTR Ads**:
   - **First 3 Seconds**: Pattern interrupt motion, bold on-screen hook headline, tight framing.
   - **Retention Pacing**: Cut pauses/dead air every 1.5–3 seconds, B-roll cutaways, zoom punch-ins, animated high-contrast captions (readable with sound off), sound design (whooshes, pops, music ducking), and clean color grading.
   - **Ad Editing System**: Create 1 strong video body + 3–5 different opening hooks for rapid Meta/TikTok A/B testing.

6. **SEO & Search Marketing Basics**:
   - Search intent (Informational vs Commercial vs Transactional), Keyword research, On-Page SEO (Title tags, Meta descriptions, H1/H2 hierarchy, internal linking, image alt text), Technical SEO (page speed, mobile responsiveness, JSON-LD Schema), Local SEO (Google Business Profile), and how Google Search (high intent) complements Meta Ads (demand generation).

RESPONSE GUIDELINES:
1. Reply in the exact language or style the visitor uses (English, Roman Urdu, Urdu, Arabic, etc.) with a warm, expert, encouraging tone.
2. When visitors ask educational digital marketing questions ("How do I run Meta Ads?", "What is ROAS?", "How to grow on Instagram?", "How to optimize Shopify?", "Video editing tips?", "SEO basics?"), give structured, easy-to-apply knowledge (examples, step-by-step lists, or formulas). Keep responses concise, scannable, and practical (typically 3–7 short lines or clear bullets unless they ask for a deep dive).
3. Ground agency specifics (services, case studies, stats, contact info) strictly in the knowledge base above. Never invent fake prices or fake client names — for pricing/custom packages, explain that cost depends on project goals and invite them to call/WhatsApp **${contactPhone}** or email **${contactEmail}** (or click **Book Call / Quote**).`;
}

function getReadableErrorInfo(err: unknown): {
  status: number;
  message: string;
} {
  const errObj = err as { status?: number; code?: number; message?: string };
  const statusCode = Number(errObj?.status ?? errObj?.code ?? 0);
  const raw = err instanceof Error ? err.message : String(err ?? 'Unknown error');
  const lower = raw.toLowerCase();

  if (
    statusCode === 400 ||
    statusCode === 401 ||
    statusCode === 403 ||
    lower.includes('api_key_invalid') ||
    lower.includes('api key not valid') ||
    lower.includes('api key') ||
    lower.includes('permission_denied') ||
    lower.includes('403')
  ) {
    return {
      status: statusCode || 403,
      message:
        'AI assistant could not authenticate. Please verify GEMINI_API_KEY in Settings > Secrets, or reach us directly via WhatsApp / Contact Me.',
    };
  }
  if (
    statusCode === 429 ||
    lower.includes('resource_exhausted') ||
    lower.includes('quota') ||
    lower.includes('429')
  ) {
    return {
      status: 429,
      message:
        'The assistant is temporarily busy due to high request volume. Please try again in a moment or message us on WhatsApp.',
    };
  }
  if (
    statusCode === 404 ||
    lower.includes('not_found') ||
    lower.includes('404')
  ) {
    return {
      status: 502,
      message:
        'The configured AI model is currently unavailable. Please contact us via WhatsApp or the Contact form.',
    };
  }
  return {
    status: 500,
    message:
      'Unable to generate a response right now. Feel free to use WhatsApp or the Contact Me button for immediate help.',
  };
}

const SITE_CONFIG_DIR = path.resolve(__dirname, 'data');
const SITE_CONFIG_FILE = path.join(SITE_CONFIG_DIR, 'site-config.json');
const PUBLIC_SITE_CONFIG_FILE = path.resolve(__dirname, 'public', 'site-config.json');

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/site-config', (_req, res) => {
    try {
      const targetFile = fs.existsSync(SITE_CONFIG_FILE)
        ? SITE_CONFIG_FILE
        : fs.existsSync(PUBLIC_SITE_CONFIG_FILE)
          ? PUBLIC_SITE_CONFIG_FILE
          : null;
      if (!targetFile) {
        res.json({ exists: false, config: null });
        return;
      }
      const raw = fs.readFileSync(targetFile, 'utf-8');
      const parsed = JSON.parse(raw);
      res.json({ exists: true, config: parsed });
    } catch (err) {
      console.error('Failed to read site-config.json:', err);
      res.status(500).json({ error: 'Unable to load saved website configuration.' });
    }
  });

  app.post('/api/site-config', (req, res) => {
    const body = req.body as { config?: Record<string, unknown> };
    const incoming = body?.config;
    if (
      !incoming ||
      typeof incoming !== 'object' ||
      !incoming.brand ||
      !incoming.services ||
      !incoming.portfolio
    ) {
      res.status(400).json({ error: 'Valid site configuration object is required.' });
      return;
    }
    try {
      const serialized = JSON.stringify(incoming, null, 2);
      fs.mkdirSync(SITE_CONFIG_DIR, { recursive: true });
      fs.writeFileSync(SITE_CONFIG_FILE, serialized, 'utf-8');
      fs.mkdirSync(path.dirname(PUBLIC_SITE_CONFIG_FILE), { recursive: true });
      fs.writeFileSync(PUBLIC_SITE_CONFIG_FILE, serialized, 'utf-8');
      res.json({ ok: true, savedAt: new Date().toISOString() });
    } catch (err) {
      console.error('Failed to write site-config.json:', err);
      res.status(500).json({ error: 'Unable to save website configuration.' });
    }
  });

  app.post('/api/chat', async (req, res) => {
    const body = req.body as {
      message?: unknown;
      history?: unknown;
      siteContext?: SiteContextPayload;
    };

    const userMessage =
      typeof body?.message === 'string' ? body.message.trim() : '';

    if (!userMessage) {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    if (userMessage.length > 2000) {
      res.status(400).json({ error: 'Message is too long (max 2000 characters).' });
      return;
    }

    const ai = createGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'AI assistant is not configured yet. Please check GEMINI_API_KEY in Settings > Secrets, or reach out via WhatsApp / Contact Me.',
      });
      return;
    }

    const rawHistory = Array.isArray(body?.history) ? body.history : [];
    const formattedHistory = rawHistory
      .filter(
        (turn): turn is ChatHistoryTurn =>
          Boolean(turn) &&
          (turn.role === 'user' || turn.role === 'model') &&
          typeof turn.text === 'string' &&
          turn.text.trim().length > 0
      )
      .slice(-14)
      .map((turn) => ({
        role: turn.role,
        parts: [{ text: turn.text.slice(0, 2000) }],
      }));

    const systemInstruction = buildSystemInstruction(body?.siteContext);

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    try {
      const chat = ai.chats.create({
        model: 'gemini-4-hydrogen',
        ...(formattedHistory.length > 0 ? { history: formattedHistory } : {}),
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const streamResponse = await chat.sendMessageStream({
        message: userMessage,
      });

      for await (const chunk of streamResponse) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (err) {
      console.error('Gemini chat error:', err);
      const { message } = getReadableErrorInfo(err);
      res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
      res.end();
    }
  });

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
