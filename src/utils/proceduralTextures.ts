import * as THREE from 'three';

function drawEmblemMark(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  monogram: string,
  primaryBlue: string,
  primaryPurple: string
) {
  const firstChar = (monogram.slice(0, 1) || 'N').toUpperCase();
  const secondChar = (monogram.slice(1, 2) || 'J').toUpperCase();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Outer glowing swoosh arc
  const arcGrad = ctx.createLinearGradient(-220, -180, 220, 180);
  arcGrad.addColorStop(0, primaryBlue);
  arcGrad.addColorStop(0.5, primaryPurple);
  arcGrad.addColorStop(1, '#c084fc');

  ctx.strokeStyle = arcGrad;
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.shadowColor = primaryPurple;
  ctx.shadowBlur = 28;
  ctx.beginPath();
  ctx.arc(0, -10, 220, Math.PI * 0.68, Math.PI * 2.18);
  ctx.stroke();

  // Golden Crown above first letter
  const crownGrad = ctx.createLinearGradient(-130, -210, -20, -130);
  crownGrad.addColorStop(0, '#fef08a');
  crownGrad.addColorStop(0.5, '#f59e0b');
  crownGrad.addColorStop(1, '#d97706');

  ctx.fillStyle = crownGrad;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.moveTo(-132, -118);
  ctx.lineTo(-148, -176);
  ctx.lineTo(-102, -148);
  ctx.lineTo(-76, -198);
  ctx.lineTo(-48, -148);
  ctx.lineTo(-4, -176);
  ctx.lineTo(-22, -118);
  ctx.closePath();
  ctx.fill();

  for (const [jx, jy] of [
    [-148, -178],
    [-76, -202],
    [-4, -178],
  ]) {
    ctx.beginPath();
    ctx.arc(jx, jy, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#fef9c3';
    ctx.fill();
  }

  // White crisp first letter ('N')
  ctx.shadowColor = 'rgba(255,255,255,0.45)';
  ctx.shadowBlur = 24;
  const letterWhite = ctx.createLinearGradient(-150, -90, -20, 120);
  letterWhite.addColorStop(0, '#ffffff');
  letterWhite.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = letterWhite;
  ctx.font = '800 220px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(firstChar, -75, 16);

  // Neon purple-blue italic second letter ('J')
  ctx.shadowColor = primaryPurple;
  ctx.shadowBlur = 36;
  ctx.fillStyle = arcGrad;
  ctx.font = 'italic 800 240px Outfit, sans-serif';
  ctx.fillText(secondChar, 78, 22);

  // Diagonal dynamic swoosh cut
  ctx.strokeStyle = arcGrad;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(-185, 105);
  ctx.quadraticCurveTo(0, 20, 185, -115);
  ctx.stroke();

  ctx.restore();
}

export function createEmblemTexture(
  monogram: string,
  primaryBlue: string,
  primaryPurple: string,
  maxAnisotropy: number,
  variant: 'sphere' | 'screen' = 'sphere'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');

  if (variant === 'sphere') {
    // 2:1 equirectangular canvas with emblem on front (u=0.25) and back (u=0.75) for clean 360° 3D rotation
    const w = 2048;
    const h = 1024;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#070418');
    bg.addColorStop(0.5, '#140e38');
    bg.addColorStop(1, '#04020d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Subtle futuristic latitude/longitude lines across sphere
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.16)';
    ctx.lineWidth = 2;
    for (let y = 160; y < h; y += 140) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    for (let x = 0; x < w; x += 256) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Dual radial glow spots + dual emblems so 360 spin always shows crisp logo
    for (const cx of [512, 1536]) {
      const aura = ctx.createRadialGradient(cx, 512, 30, cx, 512, 360);
      aura.addColorStop(0, `${primaryPurple}55`);
      aura.addColorStop(0.55, `${primaryBlue}22`);
      aura.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = aura;
      ctx.fillRect(cx - 400, 100, 800, 824);

      drawEmblemMark(ctx, cx, 520, 0.92, monogram, primaryBlue, primaryPurple);
    }
  } else {
    const size = 1024;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const screenBg = ctx.createLinearGradient(0, 0, size, size);
    screenBg.addColorStop(0, '#070416');
    screenBg.addColorStop(0.5, '#130b33');
    screenBg.addColorStop(1, '#08051a');
    ctx.fillStyle = screenBg;
    ctx.fillRect(0, 0, size, size);

    const aura = ctx.createRadialGradient(512, 500, 20, 512, 500, 380);
    aura.addColorStop(0, `${primaryPurple}66`);
    aura.addColorStop(0.5, `${primaryBlue}26`);
    aura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, size, size);

    drawEmblemMark(ctx, 512, 530, 1.0, monogram, primaryBlue, primaryPurple);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

export function createHoloCardTexture(
  kind: 'chart' | 'target' | 'badge',
  label: string,
  primaryBlue: string,
  primaryPurple: string,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = kind === 'badge' ? 256 : 512;
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#1b1444');
  bg.addColorStop(1, '#09061a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = primaryPurple;
  ctx.lineWidth = 10;
  ctx.strokeRect(12, 12, w - 24, h - 24);

  if (kind === 'chart') {
    const bars = [120, 175, 240, 320];
    const barGrad = ctx.createLinearGradient(0, 420, 0, 110);
    barGrad.addColorStop(0, primaryPurple);
    barGrad.addColorStop(1, primaryBlue);
    ctx.fillStyle = barGrad;
    ctx.shadowColor = primaryBlue;
    ctx.shadowBlur = 18;
    bars.forEach((bh, idx) => {
      const bx = 86 + idx * 92;
      const by = 410 - bh;
      ctx.fillRect(bx, by, 56, bh);
    });
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(82, 270);
    ctx.lineTo(220, 185);
    ctx.lineTo(300, 210);
    ctx.lineTo(415, 92);
    ctx.stroke();
  } else if (kind === 'target') {
    const cx = w / 2;
    const cy = h / 2;
    ctx.shadowColor = primaryPurple;
    ctx.shadowBlur = 24;
    for (const [r, col] of [
      [175, primaryPurple],
      [125, '#e2e8f0'],
      [78, primaryBlue],
      [34, '#f8fafc'],
    ] as const) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    }
    ctx.strokeStyle = '#c4b5fd';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + 150, cy - 150);
    ctx.lineTo(cx + 10, cy - 10);
    ctx.stroke();
  } else {
    ctx.shadowColor = primaryPurple;
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 54px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const words = label.split(' ');
    if (words.length >= 2) {
      ctx.fillText(words[0], w / 2 - 20, h / 2 - 34);
      ctx.fillStyle = '#c4b5fd';
      ctx.fillText(words.slice(1).join(' '), w / 2 - 20, h / 2 + 34);
    } else {
      ctx.fillText(label, w / 2, h / 2);
    }
    ctx.strokeStyle = primaryBlue;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(w - 110, h / 2 + 32);
    ctx.lineTo(w - 75, h / 2 + 6);
    ctx.lineTo(w - 58, h / 2 + 16);
    ctx.lineTo(w - 34, h / 2 - 18);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  grad.addColorStop(0, 'rgba(59, 130, 246, 0.45)');
  grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.2)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createPortraitTexture(
  imageDataUrl: string,
  name: string,
  badgeText: string,
  primaryBlue: string,
  primaryPurple: string,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const w = 768;
  const h = 960;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const drawFallbackPortrait = () => {
    // Rich dark studio backdrop with neon blue + purple rim glow
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#0c0824');
    bg.addColorStop(0.5, '#17103f');
    bg.addColorStop(1, '#070415');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const glowL = ctx.createRadialGradient(150, 260, 20, 150, 260, 380);
    glowL.addColorStop(0, `${primaryBlue}66`);
    glowL.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glowL;
    ctx.fillRect(0, 0, w, h);

    const glowR = ctx.createRadialGradient(620, 420, 20, 620, 420, 400);
    glowR.addColorStop(0, `${primaryPurple}77`);
    glowR.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glowR;
    ctx.fillRect(0, 0, w, h);

    // Subtle geometric studio grid lines
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.1)';
    ctx.lineWidth = 2;
    for (let y = 120; y < h; y += 120) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Stylized 3D Executive Silhouette (Head, Shoulders, Suit Collar)
    ctx.save();
    // Outer neon halo behind head
    const headHalo = ctx.createRadialGradient(w / 2, 330, 50, w / 2, 330, 210);
    headHalo.addColorStop(0, `${primaryPurple}55`);
    headHalo.addColorStop(0.6, `${primaryBlue}22`);
    headHalo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = headHalo;
    ctx.fillRect(0, 80, w, 500);

    // Tailored suit shoulders
    const suitGrad = ctx.createLinearGradient(140, 520, 628, 920);
    suitGrad.addColorStop(0, '#1e293b');
    suitGrad.addColorStop(0.5, '#0f172a');
    suitGrad.addColorStop(1, '#090d1a');
    ctx.fillStyle = suitGrad;
    ctx.strokeStyle = primaryBlue;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(115, h);
    ctx.quadraticCurveTo(130, 610, 275, 560);
    ctx.lineTo(493, 560);
    ctx.quadraticCurveTo(638, 610, 653, h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Crisp shirt V-neck & tie accent
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(325, 560);
    ctx.lineTo(384, 710);
    ctx.lineTo(443, 560);
    ctx.closePath();
    ctx.fill();

    const tieGrad = ctx.createLinearGradient(384, 575, 384, 720);
    tieGrad.addColorStop(0, primaryPurple);
    tieGrad.addColorStop(1, primaryBlue);
    ctx.fillStyle = tieGrad;
    ctx.beginPath();
    ctx.moveTo(372, 575);
    ctx.lineTo(396, 575);
    ctx.lineTo(404, 675);
    ctx.lineTo(384, 712);
    ctx.lineTo(364, 675);
    ctx.closePath();
    ctx.fill();

    // Neck & Head
    const skinGrad = ctx.createLinearGradient(320, 220, 450, 480);
    skinGrad.addColorStop(0, '#334155');
    skinGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = skinGrad;
    ctx.fillRect(344, 465, 80, 105);

    ctx.beginPath();
    ctx.ellipse(w / 2, 345, 118, 145, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = primaryPurple;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Styled hair crown silhouette
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(w / 2, 238, 116, 62, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawBottomOverlay = () => {
    // Bottom measured contrast scrim + name plate
    const scrim = ctx.createLinearGradient(0, h - 260, 0, h);
    scrim.addColorStop(0, 'rgba(5, 3, 17, 0)');
    scrim.addColorStop(0.55, 'rgba(5, 3, 17, 0.78)');
    scrim.addColorStop(1, 'rgba(5, 3, 17, 0.96)');
    ctx.fillStyle = scrim;
    ctx.fillRect(0, h - 260, w, 260);

    // Subtle neon frame border
    const borderGrad = ctx.createLinearGradient(0, 0, w, h);
    borderGrad.addColorStop(0, primaryBlue);
    borderGrad.addColorStop(0.5, primaryPurple);
    borderGrad.addColorStop(1, '#c084fc');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, w - 10, h - 10);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 44px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name || 'Nazar Jalalzai', w / 2, h - 96);

    ctx.fillStyle = '#c4b5fd';
    ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(badgeText || 'Founder & Digital Marketer', w / 2, h - 48);
  };

  drawFallbackPortrait();
  drawBottomOverlay();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;

  if (imageDataUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Cover-crop uploaded photo into 768x960 portrait frame
      ctx.clearRect(0, 0, w, h);
      const scale = Math.max(w / img.width, h / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
      drawBottomOverlay();
      texture.needsUpdate = true;
    };
    img.src = imageDataUrl;
  }

  return texture;
}
