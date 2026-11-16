import React, { useEffect, useRef } from 'react';

interface InteractiveParticleFieldProps {
  primaryBlue: string;
  primaryPurple: string;
  glowIntensity: number;
  floatIntensity: number;
  count?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ox: number;
  oy: number;
  radius: number;
  depth: number;
  alpha: number;
  phase: number;
  tone: 'blue' | 'purple' | 'white';
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const parsed = parseInt(full, 16);
  if (Number.isNaN(parsed)) return [139, 92, 246];
  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255];
}

export const InteractiveParticleField: React.FC<
  InteractiveParticleFieldProps
> = ({
  primaryBlue,
  primaryPurple,
  glowIntensity,
  floatIntensity,
  count = 46,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const propsRef = useRef({
    primaryBlue,
    primaryPurple,
    glowIntensity,
    floatIntensity,
  });

  useEffect(() => {
    propsRef.current = {
      primaryBlue,
      primaryPurple,
      glowIntensity,
      floatIntensity,
    };
  }, [primaryBlue, primaryPurple, glowIntensity, floatIntensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = host.clientWidth || 1200;
    let height = host.clientHeight || 560;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const particles: Particle[] = Array.from({ length: count }, (_, i) => {
      const tone: Particle['tone'] =
        i % 5 === 0 ? 'white' : i % 2 === 0 ? 'blue' : 'purple';
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.24 - 0.05,
        ox: 0,
        oy: 0,
        radius: 1.2 + Math.random() * 2.1,
        depth: 0.35 + Math.random() * 0.65,
        alpha: 0.28 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        tone,
      };
    });

    const resizeCanvas = () => {
      const nextW = host.clientWidth || 1200;
      const nextH = host.clientHeight || 560;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Rescale existing particle coordinates proportionally so there is no pop
      if (width > 0 && height > 0) {
        const sx = nextW / width;
        const sy = nextH / height;
        for (let i = 0; i < particles.length; i++) {
          particles[i].x *= sx;
          particles[i].y *= sy;
        }
      }

      width = nextW;
      height = nextH;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    const pointer = {
      x: width * 0.5,
      y: height * 0.5,
      targetNormX: 0,
      targetNormY: 0,
      normX: 0,
      normY: 0,
      active: false,
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.targetNormX = ((pointer.x / Math.max(1, rect.width)) - 0.5) * 2;
      pointer.targetNormY = ((pointer.y / Math.max(1, rect.height)) - 0.5) * 2;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.targetNormX = 0;
      pointer.targetNormY = 0;
    };

    host.addEventListener('pointermove', onPointerMove, { passive: true });
    host.addEventListener('pointerleave', onPointerLeave, { passive: true });

    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    resizeObserver.observe(host);

    let isVisible = true;
    let rafId = 0;
    let lastTime = performance.now();

    const drawFrame = (now: number, animate: boolean) => {
      const dt = Math.min((now - lastTime) / 16.67, 2.5);
      lastTime = now;
      const elapsed = now * 0.001;

      const {
        primaryBlue: blueHex,
        primaryPurple: purpleHex,
        glowIntensity: glowAmt,
        floatIntensity: floatAmt,
      } = propsRef.current;

      const [br, bg, bb] = hexToRgb(blueHex);
      const [pr, pg, pb] = hexToRgb(purpleHex);

      ctx.clearRect(0, 0, width, height);

      // Smooth pointer parallax easing
      pointer.normX += (pointer.targetNormX - pointer.normX) * 0.08 * dt;
      pointer.normY += (pointer.targetNormY - pointer.normY) * 0.08 * dt;

      const motionScale = animate ? Math.max(0.15, floatAmt) : 0;
      const repulseRadius = 135;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (animate && floatAmt > 0) {
          p.x += p.vx * motionScale * dt;
          p.y += p.vy * motionScale * dt;

          if (p.x < -20) p.x = width + 20;
          else if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          else if (p.y > height + 20) p.y = -20;
        }

        // 3D depth parallax offset + gentle pointer repulsion
        const parallaxX = pointer.normX * 18 * p.depth;
        const parallaxY = pointer.normY * 14 * p.depth;

        let targetOx = parallaxX;
        let targetOy = parallaxY;
        let proxBoost = 0;

        if (pointer.active && animate) {
          const dx = p.x + p.ox - pointer.x;
          const dy = p.y + p.oy - pointer.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < repulseRadius * repulseRadius && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / repulseRadius) * 28 * p.depth;
            targetOx += (dx / dist) * force;
            targetOy += (dy / dist) * force;
            proxBoost = (1 - dist / repulseRadius) * 0.45;
          }
        }

        p.ox += (targetOx - p.ox) * 0.12 * dt;
        p.oy += (targetOy - p.oy) * 0.12 * dt;

        const drawX = p.x + p.ox;
        const drawY = p.y + p.oy;
        const twinkle =
          0.78 + Math.sin(elapsed * 1.4 + p.phase) * 0.22;
        const finalAlpha = Math.min(
          0.92,
          (p.alpha * twinkle + proxBoost) * Math.min(1.25, 0.55 + glowAmt * 0.55)
        );

        let r = 226;
        let g = 232;
        let b = 255;
        if (p.tone === 'blue') {
          r = br;
          g = bg;
          b = bb;
        } else if (p.tone === 'purple') {
          r = pr;
          g = pg;
          b = pb;
        }

        // Subtle outer glow halo
        const haloRadius = p.radius * (3.2 + proxBoost * 3.0);
        const grad = ctx.createRadialGradient(
          drawX,
          drawY,
          0,
          drawX,
          drawY,
          haloRadius
        );
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${finalAlpha})`);
        grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${finalAlpha * 0.32})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(drawX, drawY, haloRadius, 0, Math.PI * 2);
        ctx.fill();

        // Crisp glowing core dot
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.95, finalAlpha * 0.9)})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.radius * (0.62 + proxBoost * 0.35), 0, Math.PI * 2);
        ctx.fill();

        // Subtle filament link to cursor when very close
        if (proxBoost > 0.12) {
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${proxBoost * 0.42})`;
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          ctx.moveTo(drawX, drawY);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }
    };

    const tick = (now: number) => {
      if (!isVisible) return;
      drawFrame(now, true);
      rafId = requestAnimationFrame(tick);
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible && !prefersReducedMotion) {
          lastTime = performance.now();
          rafId = requestAnimationFrame(tick);
        } else if (!isVisible) {
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.02 }
    );
    intersectionObserver.observe(host);

    if (prefersReducedMotion) {
      drawFrame(performance.now(), false);
    } else {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(rafId);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full z-0"
    />
  );
};
