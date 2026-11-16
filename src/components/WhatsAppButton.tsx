import React from 'react';

interface WhatsAppButtonProps {
  phone: string;
  message: string;
  enabled: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phone,
  message,
  enabled,
}) => {
  if (!enabled) return null;

  const digits = phone.replace(/[^\d]/g, '');
  if (!digits) return null;

  const href = `https://wa.me/${digits}?text=${encodeURIComponent(
    message || 'Hi! I would like to discuss a digital marketing project.'
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-4 left-4 z-40 group inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 rounded-full bg-emerald-600/95 hover:bg-emerald-500 border border-emerald-300/40 text-white shadow-[0_8px_28px_rgba(16,185,129,0.4)] hover:shadow-[0_10px_34px_rgba(16,185,129,0.6)] transition-all whitespace-nowrap"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 shrink-0 fill-current"
        aria-hidden="true"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2Zm5.82 14.11c-.24.68-1.41 1.3-1.95 1.38-.52.08-1.18.11-1.9-.12-.44-.14-1-.33-1.72-.64-3.03-1.31-5-4.37-5.15-4.57-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.6-.38.8-.38.2 0 .4 0 .58.01.18.01.43-.07.67.51.25.6.84 2.05.91 2.2.08.15.13.33.02.53-.1.2-.15.33-.3.5-.15.18-.32.4-.45.53-.15.15-.31.32-.13.62.18.3.78 1.29 1.68 2.09 1.15 1.03 2.12 1.35 2.42 1.5.3.15.48.13.65-.08.18-.2.75-.88.95-1.18.2-.3.4-.25.68-.15.28.1 1.75.83 2.05.98.3.15.5.22.58.35.07.12.07.72-.17 1.4Z" />
      </svg>
      <span className="hidden sm:inline text-xs font-semibold">WhatsApp</span>
    </a>
  );
};
