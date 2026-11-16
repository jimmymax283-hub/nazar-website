import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  createContactShadowTexture,
  createEmblemTexture,
} from '../utils/proceduralTextures';

interface Hero3DLogoProps {
  monogram: string;
  primaryBlue: string;
  primaryPurple: string;
  rotationSpeed: number;
  glowIntensity: number;
  full3DSpin?: boolean;
  floatIntensity?: number;
}

const _targetRot = new THREE.Euler();

export const Hero3DLogo: React.FC<Hero3DLogoProps> = ({
  monogram,
  primaryBlue,
  primaryPurple,
  rotationSpeed,
  glowIntensity,
  full3DSpin = true,
  floatIntensity = 1.0,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const configRef = useRef({
    monogram,
    primaryBlue,
    primaryPurple,
    rotationSpeed,
    glowIntensity,
    full3DSpin,
    floatIntensity,
  });
  const rebuildTextureRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    configRef.current = {
      monogram,
      primaryBlue,
      primaryPurple,
      rotationSpeed,
      glowIntensity,
      full3DSpin,
      floatIntensity,
    };
    rebuildTextureRef.current?.();
  }, [
    monogram,
    primaryBlue,
    primaryPurple,
    rotationSpeed,
    glowIntensity,
    full3DSpin,
    floatIntensity,
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
    const height = mount.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 6.4);

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
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    // 3-point neon + studio lighting rig
    const hemiLight = new THREE.HemisphereLight(0x818cf8, 0x1e1b4b, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xe0e7ff, 2.2);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = !isSoftwareGl;
    scene.add(keyLight);

    const bluePoint = new THREE.PointLight(
      new THREE.Color(configRef.current.primaryBlue),
      8,
      14,
      1.6
    );
    bluePoint.position.set(-2.6, 1.8, 2.8);
    scene.add(bluePoint);

    const purplePoint = new THREE.PointLight(
      new THREE.Color(configRef.current.primaryPurple),
      9,
      14,
      1.6
    );
    purplePoint.position.set(2.8, -0.8, 2.4);
    scene.add(purplePoint);

    const bottomGlow = new THREE.PointLight(0x38bdf8, 5, 8, 1.8);
    bottomGlow.position.set(0, -1.7, 1.2);
    scene.add(bottomGlow);

    // Master hero assembly
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // 1. Core Obsidian Sphere with Dual-Sided Emblem Texture
    const sphereGeo = new THREE.SphereGeometry(1.18, 64, 64);
    const emblemTex = createEmblemTexture(
      configRef.current.monogram,
      configRef.current.primaryBlue,
      configRef.current.primaryPurple,
      maxAniso,
      'sphere'
    );
    const coreMat = new THREE.MeshPhysicalMaterial({
      map: emblemTex,
      roughness: 0.14,
      metalness: 0.28,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.4,
    });
    const coreSphere = new THREE.Mesh(sphereGeo, coreMat);
    heroGroup.add(coreSphere);

    // 2. Outer Glossy Glass Shell
    const glassGeo = new THREE.SphereGeometry(1.24, 48, 48);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xc4b5fd,
      roughness: 0.06,
      metalness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.72,
      transparent: true,
      opacity: isSoftwareGl ? 0.18 : 0.35,
      ior: 1.5,
      clearcoat: 1.0,
      depthWrite: false,
    });
    const glassShell = new THREE.Mesh(glassGeo, glassMat);
    glassShell.renderOrder = 2;
    heroGroup.add(glassShell);

    // 3. Tilted Metallic Orbital Ring Assembly (3 distinct ring parts)
    const ringGroup = new THREE.Group();
    ringGroup.rotation.set(0.46, 0.25, -0.44);
    heroGroup.add(ringGroup);

    const mainRingGeo = new THREE.TorusGeometry(1.88, 0.13, 28, 96);
    const mainRingMat = new THREE.MeshPhysicalMaterial({
      color: 0x312e81,
      metalness: 0.92,
      roughness: 0.16,
      clearcoat: 0.8,
      emissive: new THREE.Color(configRef.current.primaryBlue),
      emissiveIntensity: 0.35,
    });
    const mainRing = new THREE.Mesh(mainRingGeo, mainRingMat);
    mainRing.scale.set(1, 1, 0.45);
    ringGroup.add(mainRing);

    const innerNeonGeo = new THREE.TorusGeometry(1.74, 0.028, 16, 96);
    const innerNeonMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      emissive: new THREE.Color(configRef.current.primaryBlue),
      emissiveIntensity: 2.3,
      roughness: 0.2,
    });
    const innerNeon = new THREE.Mesh(innerNeonGeo, innerNeonMat);
    ringGroup.add(innerNeon);

    const outerAccentGeo = new THREE.TorusGeometry(2.04, 0.018, 16, 96);
    const outerAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd8b4fe,
      emissive: new THREE.Color(configRef.current.primaryPurple),
      emissiveIntensity: 2.1,
      roughness: 0.2,
    });
    const outerAccent = new THREE.Mesh(outerAccentGeo, outerAccentMat);
    ringGroup.add(outerAccent);

    // 4. Secondary Counter-Rotating Orbit Track + Satellite Nodes
    const thinOrbitGroup = new THREE.Group();
    thinOrbitGroup.rotation.set(-0.58, 0.55, 0.3);
    heroGroup.add(thinOrbitGroup);

    const thinOrbitGeo = new THREE.TorusGeometry(2.35, 0.012, 12, 96);
    const thinOrbitMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.55,
    });
    const thinOrbit = new THREE.Mesh(thinOrbitGeo, thinOrbitMat);
    thinOrbitGroup.add(thinOrbit);

    // Orbiting glowing energy spheres along the outer track
    const satGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xe0e7ff,
      emissive: new THREE.Color(configRef.current.primaryBlue),
      emissiveIntensity: 2.8,
      roughness: 0.1,
    });
    const sat1 = new THREE.Mesh(satGeo, satMat);
    sat1.position.set(2.35, 0, 0);
    thinOrbitGroup.add(sat1);

    const sat2 = new THREE.Mesh(satGeo, satMat);
    sat2.position.set(-2.35, 0, 0);
    thinOrbitGroup.add(sat2);

    // 5. Actively Orbiting Faceted Crystals
    const crystalGroup = new THREE.Group();
    scene.add(crystalGroup);
    const crystalGeo = new THREE.OctahedronGeometry(0.24, 0);
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
      { radius: 2.35, angle: 0.6, yBase: 0.85, speed: 0.38, scale: [0.8, 1.35, 0.8] },
      { radius: 2.55, angle: 2.1, yBase: 1.15, speed: -0.32, scale: [1.0, 1.6, 1.0] },
      { radius: 2.45, angle: 3.7, yBase: -0.65, speed: 0.44, scale: [0.7, 1.15, 0.7] },
      { radius: 2.2, angle: 5.0, yBase: -0.55, speed: -0.35, scale: [0.65, 1.0, 0.65] },
      { radius: 1.95, angle: 1.4, yBase: 1.55, speed: 0.48, scale: [0.45, 0.8, 0.45] },
    ];
    const crystalMeshes: THREE.Mesh[] = crystalSpecs.map((spec) => {
      const m = new THREE.Mesh(crystalGeo, crystalMat);
      m.scale.set(spec.scale[0], spec.scale[1], spec.scale[2]);
      crystalGroup.add(m);
      return m;
    });

    // 6. Crystalline Obsidian Pedestal Terrain Underneath
    const terrainGroup = new THREE.Group();
    terrainGroup.position.set(0, -1.78, -0.2);
    scene.add(terrainGroup);

    const rockGeo = new THREE.ConeGeometry(0.9, 0.85, 6);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x0f0b24,
      roughness: 0.65,
      metalness: 0.45,
      flatShading: true,
    });
    const rockPositions = [
      [0, 0, 0, 2.2, 0.75, 1.4],
      [-1.1, -0.1, 0.25, 1.3, 0.85, 1.0],
      [1.2, -0.08, 0.2, 1.4, 0.9, 1.1],
      [-0.55, 0.06, 0.55, 0.85, 0.6, 0.85],
      [0.65, 0.05, 0.5, 0.9, 0.65, 0.85],
    ];
    rockPositions.forEach(([x, y, z, sx, sy, sz], idx) => {
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.position.set(x, y, z);
      rock.scale.set(sx, sy, sz);
      rock.rotation.y = idx * 0.8;
      terrainGroup.add(rock);
    });

    const shadowTex = createContactShadowTexture();
    const glowPlaneGeo = new THREE.PlaneGeometry(4.2, 2.0);
    const glowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const glowPlane = new THREE.Mesh(glowPlaneGeo, glowPlaneMat);
    glowPlane.rotation.x = -Math.PI / 2;
    glowPlane.position.set(0, 0.24, 0.1);
    terrainGroup.add(glowPlane);

    // 7. Ambient Orbital Star Particles (InstancedMesh)
    const particleCount = 60;
    const pGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const pMat = new THREE.MeshBasicMaterial({ color: 0xa5b4fc });
    const particles = new THREE.InstancedMesh(pGeo, pMat, particleCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 1.9 + (i % 6) * 0.34;
      dummy.position.set(
        Math.cos(angle) * radius,
        ((i % 7) - 3) * 0.5,
        Math.sin(angle) * radius * 0.72 - 0.2
      );
      const s = 0.5 + (i % 4) * 0.35;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      particles.setMatrixAt(i, dummy.matrix);
    }
    particles.computeBoundingSphere();
    scene.add(particles);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    rebuildTextureRef.current = () => {
      const { monogram: m, primaryBlue: b, primaryPurple: p, glowIntensity: g } =
        configRef.current;
      const newTex = createEmblemTexture(m, b, p, maxAniso, 'sphere');
      const oldTex = coreMat.map;
      coreMat.map = newTex;
      coreMat.needsUpdate = true;
      oldTex?.dispose();

      bluePoint.color.set(b);
      purplePoint.color.set(p);
      mainRingMat.emissive.set(b);
      innerNeonMat.emissive.set(b);
      satMat.emissive.set(b);
      outerAccentMat.emissive.set(p);
      crystalMat.emissive.set(p);
      bluePoint.intensity = 8 * g;
      purplePoint.intensity = 9 * g;
    };

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
        dragOffsetY += (e.clientX - lastX) * 0.008;
        dragOffsetX += (e.clientY - lastY) * 0.006;
        dragOffsetX = THREE.MathUtils.clamp(dragOffsetX, -0.55, 0.55);
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
      const h = mount.clientHeight || 480;
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
      const { rotationSpeed: speed, full3DSpin: spin360, floatIntensity: floatAmt } =
        configRef.current;

      // Smooth damped tilt toward mouse + drag
      _targetRot.set(
        pointerY * 0.24 + dragOffsetX,
        pointerX * 0.42 + dragOffsetY,
        0
      );
      heroGroup.rotation.x = THREE.MathUtils.damp(
        heroGroup.rotation.x,
        _targetRot.x,
        5,
        delta
      );
      heroGroup.rotation.y = THREE.MathUtils.damp(
        heroGroup.rotation.y,
        _targetRot.y,
        4.5,
        delta
      );

      // Levitation & multi-axis orbital motion
      heroGroup.position.y = Math.sin(elapsed * 1.6) * 0.12 * floatAmt + 0.15;

      // Core NJ Sphere rotation: full 360° spin or gentle front sweep
      if (spin360) {
        coreSphere.rotation.y += delta * 0.55 * speed;
      } else {
        coreSphere.rotation.y = Math.sin(elapsed * 0.85 * speed) * 0.36;
      }

      // Dynamic 3D gyroscopic ring movement
      ringGroup.rotation.z = -0.44 + Math.sin(elapsed * 0.9 * speed) * 0.16;
      ringGroup.rotation.x = 0.46 + Math.cos(elapsed * 0.7 * speed) * 0.12;
      ringGroup.rotation.y += delta * 0.75 * speed;

      thinOrbitGroup.rotation.z -= delta * 0.6 * speed;
      thinOrbitGroup.rotation.y += delta * 0.35 * speed;

      // Crystals orbiting smoothly in 3D paths around the sphere
      crystalMeshes.forEach((cm, idx) => {
        const spec = crystalSpecs[idx];
        const a = spec.angle + elapsed * spec.speed * speed;
        cm.position.set(
          Math.cos(a) * spec.radius,
          spec.yBase + Math.sin(elapsed * 1.8 + idx * 1.3) * 0.16 * floatAmt,
          Math.sin(a) * spec.radius * 0.55 - 0.3
        );
        cm.rotation.y += delta * (0.65 + idx * 0.12) * speed;
        cm.rotation.x += delta * 0.35 * speed;
      });

      // Dynamic particle drift
      particles.rotation.y = elapsed * 0.18 * speed;
      particles.rotation.z = Math.sin(elapsed * 0.4) * 0.08;

      // Orbit neon accent lights subtly for shimmering reflections
      bluePoint.position.x = -2.6 + Math.sin(elapsed * 0.8) * 0.6;
      purplePoint.position.x = 2.8 + Math.cos(elapsed * 0.8) * 0.6;

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

      sphereGeo.dispose();
      coreMat.dispose();
      emblemTex.dispose();
      glassGeo.dispose();
      glassMat.dispose();
      mainRingGeo.dispose();
      mainRingMat.dispose();
      innerNeonGeo.dispose();
      innerNeonMat.dispose();
      outerAccentGeo.dispose();
      outerAccentMat.dispose();
      thinOrbitGeo.dispose();
      thinOrbitMat.dispose();
      satGeo.dispose();
      satMat.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      rockGeo.dispose();
      rockMat.dispose();
      glowPlaneGeo.dispose();
      glowPlaneMat.dispose();
      shadowTex.dispose();
      pGeo.dispose();
      pMat.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[500px] select-none cursor-grab active:cursor-grabbing">
      <div
        ref={containerRef}
        className="w-full h-full"
        aria-label="Interactive 3D rotating NJ brand emblem"
      />
    </div>
  );
};
