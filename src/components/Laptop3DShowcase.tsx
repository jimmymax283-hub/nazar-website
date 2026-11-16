import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  createContactShadowTexture,
  createEmblemTexture,
  createHoloCardTexture,
} from '../utils/proceduralTextures';

interface Laptop3DShowcaseProps {
  monogram: string;
  primaryBlue: string;
  primaryPurple: string;
  badgeText: string;
  rotationSpeed?: number;
  floatIntensity?: number;
}

const _targetEuler = new THREE.Euler();

export const Laptop3DShowcase: React.FC<Laptop3DShowcaseProps> = ({
  monogram,
  primaryBlue,
  primaryPurple,
  badgeText,
  rotationSpeed = 1.0,
  floatIntensity = 1.0,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const configRef = useRef({
    monogram,
    primaryBlue,
    primaryPurple,
    badgeText,
    rotationSpeed,
    floatIntensity,
  });
  const updateTexturesRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    configRef.current = {
      monogram,
      primaryBlue,
      primaryPurple,
      badgeText,
      rotationSpeed,
      floatIntensity,
    };
    updateTexturesRef.current?.();
  }, [
    monogram,
    primaryBlue,
    primaryPurple,
    badgeText,
    rotationSpeed,
    floatIntensity,
  ]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = mount.clientWidth || 460;
    const height = mount.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0.3, 1.35, 6.2);
    camera.lookAt(0, 0.15, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    scene.add(new THREE.HemisphereLight(0xa5b4fc, 0x1e1b4b, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(4, 6, 5);
    scene.add(key);

    const blueLight = new THREE.PointLight(
      new THREE.Color(configRef.current.primaryBlue),
      7,
      12,
      1.6
    );
    blueLight.position.set(-2.5, 1.6, 2.5);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(
      new THREE.Color(configRef.current.primaryPurple),
      8,
      12,
      1.6
    );
    purpleLight.position.set(2.5, 1.0, 2.2);
    scene.add(purpleLight);

    const showcaseGroup = new THREE.Group();
    scene.add(showcaseGroup);

    // 1. Pedestal Disc & Dual Neon Glowing Rings
    const pedestalDiscGeo = new THREE.CylinderGeometry(1.95, 2.1, 0.14, 48);
    const pedestalDiscMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f0b24,
      metalness: 0.78,
      roughness: 0.25,
      clearcoat: 0.8,
    });
    const pedestalDisc = new THREE.Mesh(pedestalDiscGeo, pedestalDiscMat);
    pedestalDisc.position.set(0, -0.78, 0);
    showcaseGroup.add(pedestalDisc);

    const ring1Geo = new THREE.TorusGeometry(2.15, 0.04, 16, 80);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      emissive: new THREE.Color(configRef.current.primaryBlue),
      emissiveIntensity: 2.2,
      roughness: 0.2,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = -0.68;
    showcaseGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.45, 0.032, 16, 80);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xd8b4fe,
      emissive: new THREE.Color(configRef.current.primaryPurple),
      emissiveIntensity: 2.0,
      roughness: 0.2,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 2 - 0.14;
    ring2.rotation.y = 0.2;
    ring2.position.y = -0.58;
    showcaseGroup.add(ring2);

    const shadowTex = createContactShadowTexture();
    const glowPadGeo = new THREE.PlaneGeometry(5.2, 5.2);
    const glowPadMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    const glowPad = new THREE.Mesh(glowPadGeo, glowPadMat);
    glowPad.rotation.x = -Math.PI / 2;
    glowPad.position.y = -0.84;
    showcaseGroup.add(glowPad);

    // 2. Multi-Part 3D Laptop Group
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, -0.52, 0.08);
    laptopGroup.rotation.y = 0.34;
    showcaseGroup.add(laptopGroup);

    const metalMat = new THREE.MeshPhysicalMaterial({
      color: 0x334155,
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 0.4,
    });

    const baseGeo = new THREE.BoxGeometry(2.25, 0.09, 1.55);
    const baseMesh = new THREE.Mesh(baseGeo, metalMat);
    laptopGroup.add(baseMesh);

    const kbGeo = new THREE.BoxGeometry(1.92, 0.02, 0.72);
    const kbMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.55,
      metalness: 0.3,
    });
    const kbMesh = new THREE.Mesh(kbGeo, kbMat);
    kbMesh.position.set(0, 0.048, -0.22);
    laptopGroup.add(kbMesh);

    const kbGlowGeo = new THREE.BoxGeometry(1.94, 0.012, 0.74);
    const kbGlowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(configRef.current.primaryPurple),
      transparent: true,
      opacity: 0.55,
    });
    const kbGlow = new THREE.Mesh(kbGlowGeo, kbGlowMat);
    kbGlow.position.set(0, 0.042, -0.22);
    laptopGroup.add(kbGlow);

    const tpGeo = new THREE.BoxGeometry(0.68, 0.01, 0.42);
    const tpMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.25,
      metalness: 0.65,
    });
    const tpMesh = new THREE.Mesh(tpGeo, tpMat);
    tpMesh.position.set(0, 0.048, 0.44);
    laptopGroup.add(tpMesh);

    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.04, -0.76);
    lidGroup.rotation.x = -0.24;
    laptopGroup.add(lidGroup);

    const lidBackGeo = new THREE.BoxGeometry(2.25, 1.44, 0.06);
    const lidBack = new THREE.Mesh(lidBackGeo, metalMat);
    lidBack.position.set(0, 0.72, 0);
    lidGroup.add(lidBack);

    const bezelGeo = new THREE.BoxGeometry(2.14, 1.34, 0.02);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      roughness: 0.18,
      metalness: 0.5,
    });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, 0.72, 0.028);
    lidGroup.add(bezel);

    const screenTex = createEmblemTexture(
      configRef.current.monogram,
      configRef.current.primaryBlue,
      configRef.current.primaryPurple,
      maxAniso,
      'screen'
    );
    const screenGeo = new THREE.PlaneGeometry(2.02, 1.24);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTex,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0.72, 0.041);
    lidGroup.add(screenMesh);

    // 3. Floating Holographic Cards flanking the laptop
    const chartTex = createHoloCardTexture(
      'chart',
      'Analytics',
      configRef.current.primaryBlue,
      configRef.current.primaryPurple,
      maxAniso
    );
    const cardGeo = new THREE.BoxGeometry(0.86, 0.86, 0.04);
    const chartMat = new THREE.MeshStandardMaterial({
      map: chartTex,
      roughness: 0.2,
      metalness: 0.3,
      emissive: new THREE.Color(0x1e1b4b),
      emissiveIntensity: 0.4,
    });
    const chartCard = new THREE.Mesh(cardGeo, chartMat);
    chartCard.position.set(-1.72, 0.55, 0.35);
    chartCard.rotation.set(0.05, 0.35, -0.06);
    showcaseGroup.add(chartCard);

    const targetTex = createHoloCardTexture(
      'target',
      'Target',
      configRef.current.primaryBlue,
      configRef.current.primaryPurple,
      maxAniso
    );
    const targetMat = new THREE.MeshStandardMaterial({
      map: targetTex,
      roughness: 0.2,
      metalness: 0.3,
      emissive: new THREE.Color(0x1e1b4b),
      emissiveIntensity: 0.4,
    });
    const targetCard = new THREE.Mesh(cardGeo, targetMat);
    targetCard.position.set(1.65, 0.92, -0.15);
    targetCard.rotation.set(0.05, -0.3, 0.06);
    showcaseGroup.add(targetCard);

    const badgeTex = createHoloCardTexture(
      'badge',
      configRef.current.badgeText,
      configRef.current.primaryBlue,
      configRef.current.primaryPurple,
      maxAniso
    );
    const badgeGeo = new THREE.BoxGeometry(1.18, 0.6, 0.04);
    const badgeMat = new THREE.MeshStandardMaterial({
      map: badgeTex,
      roughness: 0.2,
      metalness: 0.3,
      emissive: new THREE.Color(0x1e1b4b),
      emissiveIntensity: 0.45,
    });
    const badgeCard = new THREE.Mesh(badgeGeo, badgeMat);
    badgeCard.position.set(1.88, -0.02, 0.55);
    badgeCard.rotation.set(0, -0.28, -0.04);
    showcaseGroup.add(badgeCard);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    updateTexturesRef.current = () => {
      const { monogram: m, primaryBlue: b, primaryPurple: p, badgeText: bt } =
        configRef.current;
      const nextScreen = createEmblemTexture(m, b, p, maxAniso, 'screen');
      const oldScreen = screenMat.map;
      screenMat.map = nextScreen;
      screenMat.needsUpdate = true;
      oldScreen?.dispose();

      const nextChart = createHoloCardTexture('chart', 'Analytics', b, p, maxAniso);
      const oldChart = chartMat.map;
      chartMat.map = nextChart;
      chartMat.needsUpdate = true;
      oldChart?.dispose();

      const nextTarget = createHoloCardTexture('target', 'Target', b, p, maxAniso);
      const oldTarget = targetMat.map;
      targetMat.map = nextTarget;
      targetMat.needsUpdate = true;
      oldTarget?.dispose();

      const nextBadge = createHoloCardTexture('badge', bt, b, p, maxAniso);
      const oldBadge = badgeMat.map;
      badgeMat.map = nextBadge;
      badgeMat.needsUpdate = true;
      oldBadge?.dispose();

      blueLight.color.set(b);
      purpleLight.color.set(p);
      ring1Mat.emissive.set(b);
      ring2Mat.emissive.set(p);
      kbGlowMat.color.set(p);
    };

    let pointerX = 0;
    let pointerY = 0;
    let isDragging = false;
    let dragOffsetY = 0;
    let lastX = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      if (isDragging) {
        dragOffsetY += (e.clientX - lastX) * 0.008;
        lastX = e.clientX;
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastX = e.clientX;
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 460;
      const h = mount.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const { rotationSpeed: speed, floatIntensity: floatAmt } =
        configRef.current;

      _targetEuler.set(
        pointerY * 0.15,
        pointerX * 0.32 + dragOffsetY + Math.sin(elapsed * 0.7 * speed) * 0.22,
        0
      );
      showcaseGroup.rotation.x = THREE.MathUtils.damp(
        showcaseGroup.rotation.x,
        _targetEuler.x,
        4.5,
        delta
      );
      showcaseGroup.rotation.y = THREE.MathUtils.damp(
        showcaseGroup.rotation.y,
        _targetEuler.y,
        4.0,
        delta
      );

      // Laptop gently levitates above its glowing rings
      laptopGroup.position.y = -0.52 + Math.sin(elapsed * 1.4) * 0.07 * floatAmt;
      laptopGroup.rotation.y = 0.34 + Math.sin(elapsed * 0.8 * speed) * 0.16;

      // Holographic cards bob & sway in 3D space
      chartCard.position.y = 0.55 + Math.sin(elapsed * 1.6) * 0.12 * floatAmt;
      chartCard.rotation.y = 0.35 + Math.sin(elapsed * 1.1) * 0.14;

      targetCard.position.y = 0.92 + Math.sin(elapsed * 1.8 + 1.2) * 0.12 * floatAmt;
      targetCard.rotation.y = -0.3 + Math.cos(elapsed * 1.0) * 0.14;

      badgeCard.position.y = -0.02 + Math.sin(elapsed * 1.5 + 2.4) * 0.1 * floatAmt;
      badgeCard.rotation.y = -0.28 + Math.sin(elapsed * 0.9 + 1.0) * 0.12;

      // Dual pedestal rings counter-rotate
      ring1.rotation.z = -elapsed * 0.4 * speed;
      ring2.rotation.z = elapsed * 0.55 * speed;

      renderer.render(scene, camera);
      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);

      pedestalDiscGeo.dispose();
      pedestalDiscMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      glowPadGeo.dispose();
      glowPadMat.dispose();
      shadowTex.dispose();
      baseGeo.dispose();
      metalMat.dispose();
      kbGeo.dispose();
      kbMat.dispose();
      kbGlowGeo.dispose();
      kbGlowMat.dispose();
      tpGeo.dispose();
      tpMat.dispose();
      lidBackGeo.dispose();
      bezelGeo.dispose();
      bezelMat.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      screenTex.dispose();
      cardGeo.dispose();
      chartMat.dispose();
      chartTex.dispose();
      targetMat.dispose();
      targetTex.dispose();
      badgeGeo.dispose();
      badgeMat.dispose();
      badgeTex.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[340px] sm:h-[380px] select-none cursor-grab active:cursor-grabbing">
      <div
        ref={mountRef}
        className="w-full h-full"
        aria-label="Interactive 3D Laptop Showcase"
      />
    </div>
  );
};
