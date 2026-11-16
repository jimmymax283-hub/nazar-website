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
      const dx = targetX - ringX;
      const dy = targetY - ringY;
      ringX += dx * 0.22;
      ringY += dy * 0.22;

      const opacity = visible ? 1 : 0;
      const ringScale = pressed ? 0.8 : interactive ? 1.48 : 1;
      const dotScale = pressed ? 1.4 : interactive ? 0.65 : 1;

      ring.style.opacity = String(opacity);
      ring.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0) scale(${ringScale})`;

      dot.style.opacity = String(opacity);
      dot.style.transform = `translate3d(${targetX - 4}px, ${targetY - 4}px, 0) scale(${dotScale})`;

      if (visible && (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15)) {
        rafId = requestAnimationFrame(tick);
      } else {
        ringX = targetX;
        ringY = targetY;
        rafId = 0;
      }
    };

    const wake = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onPointerMoveWake = (e: PointerEvent) => {
      onPointerMove(e);
      wake();
    };
    const onPointerDownWake = () => {
      onPointerDown();
      wake();
    };
    const onPointerUpWake = () => {
      onPointerUp();
      wake();
    };
    const onPointerLeaveWake = () => {
      onPointerLeave();
      wake();
    };

    window.addEventListener('pointermove', onPointerMoveWake, { passive: true });
    window.addEventListener('pointerdown', onPointerDownWake, { passive: true });
    window.addEventListener('pointerup', onPointerUpWake, { passive: true });
    document.addEventListener('mouseleave', onPointerLeaveWake);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMoveWake);
      window.removeEventListener('pointerdown', onPointerDownWake);
      window.removeEventListener('pointerup', onPointerUpWake);
      document.removeEventListener('mouseleave', onPointerLeaveWake);
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
