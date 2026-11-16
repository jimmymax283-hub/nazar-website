import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  createContactShadowTexture,
  createEmblemTexture,
  createPortraitTexture,
} from '../utils/proceduralTextures';

interface Hero3DPortraitProps {
  imageDataUrl: string;
  caption: string;
  badgeText: string;
  monogram: string;
  primaryBlue: string;
  primaryPurple: string;
  rotationSpeed: number;
  glowIntensity: number;
  floatIntensity: number;
  scroll3DStrength: number;
}

const _targetRot = new THREE.Euler();

export const Hero3DPortrait: React.FC<Hero3DPortraitProps> = ({
  imageDataUrl,
  caption,
  badgeText,
  monogram,
  primaryBlue,
  primaryPurple,
  rotationSpeed,
  glowIntensity,
  floatIntensity,
  scroll3DStrength,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const configRef = useRef({
    imageDataUrl,
    caption,
    badgeText,
    monogram,
    primaryBlue,
    primaryPurple,
    rotationSpeed,
    glowIntensity,
    floatIntensity,
    scroll3DStrength,
  });
  const rebuildTexturesRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    configRef.current = {
      imageDataUrl,
      caption,
      badgeText,
      monogram,
      primaryBlue,
      primaryPurple,
      rotationSpeed,
      glowIntensity,
      floatIntensity,
      scroll3DStrength,
    };
    rebuildTexturesRef.current?.();
  }, [
    imageDataUrl,
    caption,
    badgeText,
    monogram,
    primaryBlue,
    primaryPurple,
    rotationSpeed,
    glowIntensity,
    floatIntensity,
    scroll3DStrength,
  ]);

  useEffect(() => {
    const mount = containerRef.current;
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

    const width = mount.clientWidth || 520;
    const height = mount.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 6.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
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

    // Lighting
    scene.add(new THREE.HemisphereLight(0xa5b4fc, 0x1e1b4b, 1.0));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const bluePoint = new THREE.PointLight(
      new THREE.Color(configRef.current.primaryBlue),
      8,
      14,
      1.6
    );
    bluePoint.position.set(-2.6, 1.6, 2.8);
    scene.add(bluePoint);

    const purplePoint = new THREE.PointLight(
      new THREE.Color(configRef.current.primaryPurple),
      9,
      14,
      1.6
    );
    purplePoint.position.set(2.8, -0.8, 2.5);
    scene.add(purplePoint);

    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // 1. Multi-Part 3D Portrait Monolith Group
    const portraitGroup = new THREE.Group();
    stageGroup.add(portraitGroup);

    // Outer metallic titanium/obsidian slab chassis
    const chassisGeo = new THREE.BoxGeometry(2.18, 2.72, 0.18);
    const chassisMat = new THREE.MeshPhysicalMaterial({
      color: 0x110c2b,
      metalness: 0.86,
      roughness: 0.18,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    portraitGroup.add(chassisMesh);

    // Glowing neon rim frame rails around the 3D slab
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      emissive: new THREE.Color(configRef.current.primaryBlue),
      emissiveIntensity: 2.0,
      roughness: 0.2,
    });
    const railPurpleMat = new THREE.MeshStandardMaterial({
      color: 0xd8b4fe,
      emissive: new THREE.Color(configRef.current.primaryPurple),
      emissiveIntensity: 2.0,
      roughness: 0.2,
    });

    const vRailGeo = new THREE.BoxGeometry(0.05, 2.76, 0.2);
    const leftRail = new THREE.Mesh(vRailGeo, railMat);
    leftRail.position.set(-1.1, 0, 0);
    portraitGroup.add(leftRail);

    const rightRail = new THREE.Mesh(vRailGeo, railPurpleMat);
    rightRail.position.set(1.1, 0, 0);
    portraitGroup.add(rightRail);

    const hRailGeo = new THREE.BoxGeometry(2.24, 0.05, 0.2);
    const topRail = new THREE.Mesh(hRailGeo, railMat);
    topRail.position.set(0, 1.37, 0);
    portraitGroup.add(topRail);

    const bottomRail = new THREE.Mesh(hRailGeo, railPurpleMat);
    bottomRail.position.set(0, -1.37, 0);
    portraitGroup.add(bottomRail);

    // Front & Back Portrait Screens
    let portraitTex = createPortraitTexture(
      configRef.current.imageDataUrl,
      configRef.current.caption,
      configRef.current.badgeText,
      configRef.current.primaryBlue,
      configRef.current.primaryPurple,
      maxAniso
    );
    const faceGeo = new THREE.PlaneGeometry(2.04, 2.58);
    const faceMat = new THREE.MeshPhysicalMaterial({
      map: portraitTex,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });
    const frontFace = new THREE.Mesh(faceGeo, faceMat);
    frontFace.position.set(0, 0, 0.095);
    portraitGroup.add(frontFace);

    const backFace = new THREE.Mesh(faceGeo, faceMat);
    backFace.position.set(0, 0, -0.095);
    backFace.rotation.y = Math.PI;
    portraitGroup.add(backFace);

    // 2. Orbiting Mini 3D NJ Crown Sphere (brand emblem orbiting the portrait!)
    const miniOrbGroup = new THREE.Group();
    miniOrbGroup.position.set(1.42, 1.08, 0.55);
    stageGroup.add(miniOrbGroup);

    let orbTex = createEmblemTexture(
      configRef.current.monogram,
      configRef.current.primaryBlue,
      configRef.current.primaryPurple,
      maxAniso,
      'sphere'
    );
    const miniOrbGeo = new THREE.SphereGeometry(0.42, 36, 36);
    const miniOrbMat = new THREE.MeshPhysicalMaterial({
      map: orbTex,
      roughness: 0.14,
      metalness: 0.3,
      clearcoat: 1.0,
    });
    const miniOrb = new THREE.Mesh(miniOrbGeo, miniOrbMat);
    miniOrbGroup.add(miniOrb);

    const miniRingGeo = new THREE.TorusGeometry(0.62, 0.032, 16, 64);
    const miniRingMat = new THREE.MeshStandardMaterial({
      color: 0xc4b5fd,
      emissive: new THREE.Color(configRef.current.primaryPurple),
      emissiveIntensity: 2.0,
      roughness: 0.2,
    });
    const miniRing = new THREE.Mesh(miniRingGeo, miniRingMat);
    miniRing.rotation.set(0.55, 0.2, -0.4);
    miniOrbGroup.add(miniRing);

    // 3. Large Gyroscopic Neon Orbital Rings surrounding the portrait
    const outerRingGroup = new THREE.Group();
    outerRingGroup.rotation.set(0.38, 0.2, -0.35);
    stageGroup.add(outerRingGroup);

    const mainRingGeo = new THREE.TorusGeometry(2.05, 0.055, 20, 96);
    const mainRingMat = new THREE.MeshPhysicalMaterial({
      color: 0x312e81,
      metalness: 0.9,
      roughness: 0.16,
      emissive: new THREE.Color(configRef.current.primaryBlue),
      emissiveIntensity: 0.8,
    });
    const mainRing = new THREE.Mesh(mainRingGeo, mainRingMat);
    mainRing.scale.set(1, 1, 0.5);
    outerRingGroup.add(mainRing);

    const innerGlowRingGeo = new THREE.TorusGeometry(1.94, 0.018, 12, 96);
    const innerGlowRing = new THREE.Mesh(innerGlowRingGeo, railMat);
    outerRingGroup.add(innerGlowRing);

    // 4. Orbiting Faceted Crystals
    const crystalGroup = new THREE.Group();
    stageGroup.add(crystalGroup);
    const crystalGeo = new THREE.OctahedronGeometry(0.2, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x6366f1,
      emissive: new THREE.Color(configRef.current.primaryPurple),
      emissiveIntensity: 0.65,
      roughness: 0.12,
      metalness: 0.35,
      clearcoat: 1.0,
      flatShading: true,
    });

    const crystalSpecs = [
      { radius: 2.25, angle: 0.5, yBase: 1.0, speed: 0.4, scale: [0.7, 1.2, 0.7] },
      { radius: 2.35, angle: 2.4, yBase: -0.95, speed: -0.35, scale: [0.85, 1.4, 0.85] },
      { radius: 2.15, angle: 4.1, yBase: -0.5, speed: 0.45, scale: [0.65, 1.0, 0.65] },
      { radius: 2.0, angle: 5.4, yBase: 1.35, speed: -0.38, scale: [0.5, 0.85, 0.5] },
    ];
    const crystalMeshes: THREE.Mesh[] = crystalSpecs.map((spec) => {
      const m = new THREE.Mesh(crystalGeo, crystalMat);
      m.scale.set(spec.scale[0], spec.scale[1], spec.scale[2]);
      crystalGroup.add(m);
      return m;
    });

    // 5. Obsidian Stage Pedestal Underneath
    const pedGeo = new THREE.CylinderGeometry(1.65, 1.85, 0.14, 48);
    const pedMat = new THREE.MeshPhysicalMaterial({
      color: 0x0b0720,
      metalness: 0.8,
      roughness: 0.25,
    });
    const pedMesh = new THREE.Mesh(pedGeo, pedMat);
    pedMesh.position.set(0, -1.78, 0);
    stageGroup.add(pedMesh);

    const pedRingGeo = new THREE.TorusGeometry(1.78, 0.025, 16, 80);
    const pedRing = new THREE.Mesh(pedRingGeo, railPurpleMat);
    pedRing.rotation.x = Math.PI / 2;
    pedRing.position.set(0, -1.7, 0);
    stageGroup.add(pedRing);

    const shadowTex = createContactShadowTexture();
    const glowPlaneGeo = new THREE.PlaneGeometry(4.4, 4.4);
    const glowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    const glowPlane = new THREE.Mesh(glowPlaneGeo, glowPlaneMat);
    glowPlane.rotation.x = -Math.PI / 2;
    glowPlane.position.set(0, -1.84, 0);
    stageGroup.add(glowPlane);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    rebuildTexturesRef.current = () => {
      const c = configRef.current;
      const nextPortrait = createPortraitTexture(
        c.imageDataUrl,
        c.caption,
        c.badgeText,
        c.primaryBlue,
        c.primaryPurple,
        maxAniso
      );
      const oldPortrait = faceMat.map;
      faceMat.map = nextPortrait;
      faceMat.needsUpdate = true;
      oldPortrait?.dispose();

      const nextOrb = createEmblemTexture(
        c.monogram,
        c.primaryBlue,
        c.primaryPurple,
        maxAniso,
        'sphere'
      );
      const oldOrb = miniOrbMat.map;
      miniOrbMat.map = nextOrb;
      miniOrbMat.needsUpdate = true;
      oldOrb?.dispose();

      bluePoint.color.set(c.primaryBlue);
      purplePoint.color.set(c.primaryPurple);
      railMat.emissive.set(c.primaryBlue);
      railPurpleMat.emissive.set(c.primaryPurple);
      miniRingMat.emissive.set(c.primaryPurple);
      mainRingMat.emissive.set(c.primaryBlue);
      crystalMat.emissive.set(c.primaryPurple);
      bluePoint.intensity = 8 * c.glowIntensity;
      purplePoint.intensity = 9 * c.glowIntensity;
    };

    // Scroll & Pointer state
    let scrollProgress = 0;
    const updateScroll = () => {
      scrollProgress = THREE.MathUtils.clamp(window.scrollY / 720, 0, 1.2);
    };
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });

    let pointerX = 0;
    let pointerY = 0;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let lastX = 0;
    let lastY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      if (isDragging) {
        dragOffsetY += (e.clientX - lastX) * 0.01;
        dragOffsetX += (e.clientY - lastY) * 0.007;
        dragOffsetX = THREE.MathUtils.clamp(dragOffsetX, -0.6, 0.6);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 520;
      const h = mount.clientHeight || 500;
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
      const {
        rotationSpeed: speed,
        floatIntensity: floatAmt,
        scroll3DStrength: scrollAmt,
      } = configRef.current;

      // Combine mouse parallax + drag + scroll-driven 3D rotation!
      const scrollRotY = scrollProgress * Math.PI * 0.65 * scrollAmt;
      const scrollRotX = scrollProgress * 0.28 * scrollAmt;
      const scrollZShift = Math.sin(scrollProgress * Math.PI) * 0.55 * scrollAmt;

      _targetRot.set(
        pointerY * 0.2 + dragOffsetX + scrollRotX,
        pointerX * 0.35 + dragOffsetY + scrollRotY + Math.sin(elapsed * 0.65 * speed) * 0.16,
        Math.sin(elapsed * 0.5) * 0.03
      );

      portraitGroup.rotation.x = THREE.MathUtils.damp(
        portraitGroup.rotation.x,
        _targetRot.x,
        5,
        delta
      );
      portraitGroup.rotation.y = THREE.MathUtils.damp(
        portraitGroup.rotation.y,
        _targetRot.y,
        5,
        delta
      );
      portraitGroup.rotation.z = THREE.MathUtils.damp(
        portraitGroup.rotation.z,
        _targetRot.z,
        5,
        delta
      );

      portraitGroup.position.y =
        Math.sin(elapsed * 1.5) * 0.12 * floatAmt + 0.05;
      portraitGroup.position.z = THREE.MathUtils.damp(
        portraitGroup.position.z,
        scrollZShift,
        5,
        delta
      );

      // Orbiting mini 3D NJ Crown Sphere
      miniOrbGroup.position.set(
        Math.cos(elapsed * 0.55 * speed) * 1.55,
        1.05 + Math.sin(elapsed * 1.4) * 0.14 * floatAmt,
        Math.sin(elapsed * 0.55 * speed) * 0.85 + 0.25
      );
      miniOrb.rotation.y += delta * 0.9 * speed;
      miniRing.rotation.z += delta * 0.8 * speed;

      // Gyroscopic outer neon rings
      outerRingGroup.rotation.y += delta * 0.55 * speed;
      outerRingGroup.rotation.z =
        -0.35 + Math.sin(elapsed * 0.8 * speed) * 0.14 + scrollProgress * 0.3 * scrollAmt;

      // Orbiting faceted crystals
      crystalMeshes.forEach((cm, idx) => {
        const spec = crystalSpecs[idx];
        const a = spec.angle + elapsed * spec.speed * speed;
        cm.position.set(
          Math.cos(a) * spec.radius,
          spec.yBase + Math.sin(elapsed * 1.7 + idx) * 0.15 * floatAmt,
          Math.sin(a) * spec.radius * 0.55 - 0.25
        );
        cm.rotation.y += delta * 0.7 * speed;
        cm.rotation.x += delta * 0.4 * speed;
      });

      pedRing.rotation.z = elapsed * 0.4 * speed;

      renderer.render(scene, camera);
      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('scroll', updateScroll);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);

      chassisGeo.dispose();
      chassisMat.dispose();
      vRailGeo.dispose();
      hRailGeo.dispose();
      railMat.dispose();
      railPurpleMat.dispose();
      faceGeo.dispose();
      faceMat.map?.dispose();
      faceMat.dispose();
      miniOrbGeo.dispose();
      miniOrbMat.map?.dispose();
      miniOrbMat.dispose();
      miniRingGeo.dispose();
      miniRingMat.dispose();
      mainRingGeo.dispose();
      mainRingMat.dispose();
      innerGlowRingGeo.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      pedGeo.dispose();
      pedMat.dispose();
      pedRingGeo.dispose();
      glowPlaneGeo.dispose();
      glowPlaneMat.dispose();
      shadowTex.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[410px] sm:h-[470px] lg:h-[520px] select-none cursor-grab active:cursor-grabbing">
      <div
        ref={containerRef}
        className="w-full h-full"
        aria-label="Interactive 3D Portrait Model"
      />
    </div>
  );
};
