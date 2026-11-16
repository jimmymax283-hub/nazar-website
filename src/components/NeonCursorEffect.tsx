import React, { useEffect, useRef } from 'react';

interface NeonCursorEffectProps {
  primaryBlue: string;
  primaryPurple: string;
  enabled: boolean;
}

export const NeonCursorEffect: React.FC<NeonCursorEffectProps> = ({
  primaryBlue,
  primaryPurple,
  enabled,
}) => {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;

    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (!finePointer || reducedMotion) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let visible = false;
    let interactive = false;
    let pressed = false;
    let rafId = 0;

    const updateInteractive = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        interactive = false;
        return;
      }
      interactive = Boolean(
        target.closest(
          'a, button, [role="button"], input, textarea, select, label'
        )
      );
    };

    const onPointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        ringX = targetX;
        ringY = targetY;
        visible = true;
      }
      updateInteractive(e.target);
    };

    const onPointerDown = () => {
      pressed = true;
    };

    const onPointerUp = () => {
      pressed = false;
    };

    const onPointerLeave = () => {
      visible = false;
    };

    const tick = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;

      const opacity = visible ? 1 : 0;
      const ringScale = pressed ? 0.8 : interactive ? 1.48 : 1;
      const dotScale = pressed ? 1.4 : interactive ? 0.65 : 1;

      ring.style.opacity = String(opacity);
      ring.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0) scale(${ringScale})`;

      dot.style.opacity = String(opacity);
      dot.style.transform = `translate3d(${targetX - 4}px, ${targetY - 4}px, 0) scale(${dotScale})`;

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('mouseleave', onPointerLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[60] hidden md:block w-9 h-9 rounded-full opacity-0 transition-[border-color,box-shadow] duration-150 will-change-transform"
        style={{
          border: `1.5px solid ${primaryPurple}`,
          boxShadow: `0 0 18px ${primaryPurple}66, inset 0 0 10px ${primaryBlue}44`,
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[60] hidden md:block w-2 h-2 rounded-full opacity-0 will-change-transform"
        style={{
          background: `linear-gradient(135deg, ${primaryBlue}, ${primaryPurple})`,
          boxShadow: `0 0 10px ${primaryBlue}`,
        }}
      />
    </>
  );
};
