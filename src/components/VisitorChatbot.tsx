import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  CalendarCheck2,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { SiteConfig } from '../types/siteConfig';
import { NJEmblem } from './NJEmblem';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

interface VisitorChatbotProps {
  config: SiteConfig;
  onOpenContact: (subject?: string) => void;
  hasBottomRightControls?: boolean;
}

const STARTER_QUESTIONS = [
  'What services do you offer?',
  'Teach me how Meta Ads & ROAS work',
  'How to boost Shopify store sales?',
  'Tips for Video Editing & viral Reels',
  'Explain Full-Funnel Digital Marketing',
  'How do I contact (+92 3098059749)?',
];

function formatMessageLine(line: string, lineIdx: number): React.ReactNode {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span key={lineIdx}>
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return (
            <strong key={idx} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </span>
  );
}

function renderFormattedText(text: string): React.ReactNode {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((rawLine, idx) => {
        const trimmed = rawLine.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
          const headingText = trimmed.replace(/^#{1,3}\s+/, '');
          return (
            <h4 key={idx} className="font-display font-semibold text-white pt-1">
              {formatMessageLine(headingText, idx)}
            </h4>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
          const content = trimmed.slice(2).trim();
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
              <div className="flex-1">{formatMessageLine(content, idx)}</div>
            </div>
          );
        }

        return <p key={idx}>{formatMessageLine(rawLine, idx)}</p>;
      })}
    </div>
  );
}

function buildSiteContext(config: SiteConfig) {
  return {
    brand: {
      monogram: config.brand.monogram,
      name: config.brand.name,
      role: config.brand.role,
      tagline: config.brand.tagline,
    },
    hero: {
      kicker: config.hero.kicker,
      headline: `${config.hero.headlineLine1} ${config.hero.headlineLine2}`.trim(),
      subheadline: config.hero.subheadline,
      description: config.hero.description,
      introSummary: config.hero.introSummary,
    },
    services: config.services.items.map((s) => ({
      title: s.title,
      tagline: s.tagline,
      description: s.description,
      deliverables: s.deliverables,
    })),
    about: {
      bio: config.about.bio,
      expandedBio: config.about.expandedBio,
      specialties: config.about.specialties,
      stats: config.about.stats.map((st) => ({
        value: st.value,
        label: st.label,
      })),
    },
    portfolio: config.portfolio.projects.map((p) => ({
      title: p.title,
      category: p.category,
      client: p.client,
      metric: p.metric,
      summary: p.summary,
      strategy: p.strategy,
      outcome: p.outcome,
      tags: p.tags,
    })),
    testimonials: config.testimonials.items.map((t) => ({
      author: t.author,
      role: t.role,
      company: t.company,
      quote: t.quote,
    })),
    contact: {
      email: config.contact.email,
      phone: config.contact.phone,
      location: config.contact.location,
      whatsappEnabled: config.contact.whatsappEnabled,
    },
  };
}

export const VisitorChatbot: React.FC<VisitorChatbotProps> = ({
  config,
  onOpenContact,
  hasBottomRightControls = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const welcomeText = `Hi! Welcome to **${config.brand.name}**. Ask me anything about our **services**, **digital marketing skills** (Meta Ads, ROAS, Shopify, Video Editing, Social Media, SEO, Funnels), or contact us directly at **${config.contact.phone}**.`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: welcomeText,
    },
  ]);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  const handleReset = () => {
    if (isStreaming) return;
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: welcomeText,
      },
    ]);
  };

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };
    const botMsgId = `bot-${Date.now() + 1}`;
    const placeholderBot: ChatMessage = {
      id: botMsgId,
      role: 'model',
      text: '',
    };

    // Build history excluding welcome greeting and error notices
    const historyPayload = messages
      .filter((m) => m.id !== 'welcome' && !m.id.startsWith('welcome-') && !m.isError && m.text.trim().length > 0)
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, userMsg, placeholderBot]);
    setInput('');
    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload,
          siteContext: buildSiteContext(config),
        }),
      });

      if (!response.ok) {
        let errMessage = 'Unable to connect right now. Please try WhatsApp or Contact Me.';
        try {
          const data = (await response.json()) as { error?: string };
          if (data?.error) errMessage = data.error;
        } catch {
          // Use default fallback message
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId ? { ...m, text: errMessage, isError: true } : m
          )
        );
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No readable response stream');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const evt of events) {
          const line = evt
            .split('\n')
            .find((l) => l.startsWith('data:'));
          if (!line) continue;
          const jsonStr = line.slice(5).trim();
          if (!jsonStr) continue;

          try {
            const payload = JSON.parse(jsonStr) as {
              text?: string;
              error?: string;
              done?: boolean;
            };

            if (payload.error) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === botMsgId
                    ? { ...m, text: payload.error!, isError: true }
                    : m
                )
              );
              return;
            }

            if (payload.text) {
              accumulated += payload.text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === botMsgId ? { ...m, text: accumulated } : m
                )
              );
            }
          } catch {
            // Ignore malformed SSE chunk
          }
        }
      }

      if (!accumulated.trim()) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? {
                  ...m,
                  text: "I couldn't catch a response for that. Could you please rephrase your question?",
                  isError: true,
                }
              : m
          )
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId
            ? {
                ...m,
                text: 'Connection interrupted. Please try again or reach out via WhatsApp / Contact Me.',
                isError: true,
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const whatsappDigits = config.contact.phone.replace(/[^\d]/g, '');
  const whatsappHref = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
        config.contact.whatsappMessage ||
          'Hi! I visited your website and have a question about your services.'
      )}`
    : null;

  const hasUserMessages = messages.some((m) => m.role === 'user');

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <section
          aria-label="Website AI Assistant"
          className={`fixed ${
            hasBottomRightControls ? 'bottom-[7.25rem]' : 'bottom-20'
          } right-4 z-50 w-[calc(100vw-2rem)] sm:w-[395px] h-[min(540px,calc(100vh-8.5rem))] flex flex-col rounded-2xl bg-[#09051c]/95 backdrop-blur-xl border border-violet-400/35 shadow-[0_24px_75px_rgba(6,4,18,0.9),0_0_32px_rgba(139,92,246,0.22)] overflow-hidden`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#130b33] via-[#170d3b] to-[#0f163b] border-b border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <NJEmblem monogram={config.brand.monogram} size={32} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display text-sm font-bold text-white truncate">
                    {config.brand.monogram} Growth Assistant
                  </h3>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-400/30 text-[10px] font-semibold text-emerald-300">
                    <Sparkles className="w-2.5 h-2.5" />
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-300/85 truncate">
                  Digital marketing mentor & agency guide
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                disabled={isStreaming}
                title="Start new conversation"
                aria-label="Reset chat"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-40 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close assistant"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600/80 to-violet-600/80 border border-violet-300/40 flex items-center justify-center shrink-0 mb-0.5">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-br-sm shadow-[0_6px_20px_rgba(99,102,241,0.3)]'
                      : msg.isError
                      ? 'bg-rose-950/50 border border-rose-400/35 text-rose-100 rounded-bl-sm'
                      : 'bg-white/[0.06] border border-white/12 text-slate-200 rounded-bl-sm'
                  }`}
                >
                  {msg.text ? (
                    renderFormattedText(msg.text)
                  ) : (
                    <div className="flex items-center gap-1.5 py-1 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                        style={{ animationDelay: '120ms' }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-bounce"
                        style={{ animationDelay: '240ms' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Suggested Starter Prompts */}
            {!hasUserMessages && (
              <div className="pt-1 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-1">
                  Popular Questions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {STARTER_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void sendMessage(q)}
                      disabled={isStreaming}
                      className="text-left px-2.5 py-1.5 rounded-lg bg-violet-500/12 hover:bg-violet-500/25 border border-violet-400/30 text-[11px] font-medium text-violet-100 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Bar */}
          <div className="px-3.5 py-2 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenContact('Inquiry via AI Assistant');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-violet-600/25 hover:bg-violet-600/45 border border-violet-400/35 text-[11px] font-medium text-violet-100 transition-colors"
            >
              <CalendarCheck2 className="w-3.5 h-3.5 text-violet-300" />
              Book Call / Quote
            </button>

            {config.contact.whatsappEnabled && whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-[11px] font-medium text-emerald-200 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                WhatsApp Direct
              </a>
            )}
          </div>

          {/* Input Composer */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-white/10 bg-[#060314] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask digital marketing questions or about our services..."
              disabled={isStreaming}
              maxLength={1000}
              className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 focus:border-violet-400 focus:outline-none text-xs sm:text-sm text-white placeholder:text-slate-400 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              aria-label="Send message"
              className="neon-cta-btn w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white disabled:opacity-45 disabled:pointer-events-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>
      )}

      {/* Floating Chatbot Launcher */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        aria-expanded={isOpen}
        className={`fixed ${
          hasBottomRightControls ? 'bottom-[4.25rem]' : 'bottom-4'
        } right-4 z-40 inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-600/95 to-violet-600/95 hover:from-blue-500 hover:to-violet-500 border border-violet-300/45 text-white shadow-[0_10px_30px_rgba(99,102,241,0.45)] hover:shadow-[0_12px_36px_rgba(139,92,246,0.65)] transition-all whitespace-nowrap`}
      >
        {isOpen ? (
          <X className="w-4 h-4 shrink-0" />
        ) : (
          <Bot className="w-4 h-4 shrink-0" />
        )}
        <span className="text-xs font-semibold">
          {isOpen ? 'Close Chat' : 'Ask AI Assistant'}
        </span>
      </button>
    </>
  );
};
