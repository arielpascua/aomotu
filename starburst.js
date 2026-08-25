/* ==========================================================================
   AOMOTU — 3D starburst emblem
   The company mark from the profile cover, rendered as a slowly rotating
   metal burst. Gold core with alternating gold / near-black nodes on navy stems,
   matching the mark on the white ground.

   Degrades to nothing if WebGL or the CDN is unavailable — the canvas simply
   stays empty and the page is unaffected.
   ========================================================================== */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const GOLD = 0xffc909;
const NAVY = 0x0e275d;
const NEAR_BLACK = 0x080808;

function createStarburst(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const FOV = 34;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

  /* Procedural studio environment — warm, so the gold core keeps its lustre. */
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 16;
  envCanvas.height = 64;
  const ectx = envCanvas.getContext('2d');
  const grad = ectx.createLinearGradient(0, 0, 0, 64);
  grad.addColorStop(0.0, '#FFFBF2');
  grad.addColorStop(0.42, '#E8CE95');
  grad.addColorStop(1.0, '#4A2A22');
  ectx.fillStyle = grad;
  ectx.fillRect(0, 0, 16, 64);

  const envTex = new THREE.CanvasTexture(envCanvas);
  envTex.mapping = THREE.EquirectangularReflectionMapping;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromEquirectangular(envTex).texture;
  envTex.dispose();

  scene.add(new THREE.HemisphereLight(0xfff3de, 0x3a2018, 0.8));
  const key = new THREE.DirectionalLight(0xffffff, 3.0);
  key.position.set(2.5, 3.5, 2.5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xe8c06a, 1.15);
  rim.position.set(-3, -1, -2);
  scene.add(rim);

  const goldMat = new THREE.MeshStandardMaterial({
    color: GOLD, metalness: 1.0, roughness: 0.17,
    envMapIntensity: 1.75, emissive: 0x3a2a00, emissiveIntensity: 0.35,
  });
  const stemMat = new THREE.MeshStandardMaterial({
    color: NAVY, metalness: 0.9, roughness: 0.42, envMapIntensity: 0.9,
  });
  const nodeMat = new THREE.MeshStandardMaterial({
    color: NEAR_BLACK, metalness: 0.88, roughness: 0.34, envMapIntensity: 0.95,
  });

  const burst = new THREE.Group();
  scene.add(burst);

  const coreR = 0.5;
  burst.add(new THREE.Mesh(new THREE.SphereGeometry(coreR, 48, 48), goldMat));

  /* Spokes distributed on a Fibonacci sphere for an even 3D burst. */
  const N = 22;
  const STEM = 1.5;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const up = new THREE.Vector3(0, 1, 0);
  const ballGeo = new THREE.SphereGeometry(1, 20, 20);
  const rodGeo = new THREE.CylinderGeometry(1, 1, 1, 10);
  const inner = coreR * 0.85;
  let maxExtent = coreR;

  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = i * golden;
    const dir = new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).normalize();

    const baseReach = 1.18 + 0.16 * Math.sin(i * 1.7);
    const reach = inner + (baseReach - inner) * STEM;
    const ballR = 0.17 + (i % 3 === 0 ? 0.05 : 0) + (i % 5 === 0 ? 0.03 : 0);
    const isGold = i % 2 === 0;

    const spike = new THREE.Object3D();
    spike.quaternion.setFromUnitVectors(up, dir);

    const len = reach - inner;
    const rod = new THREE.Mesh(rodGeo, stemMat);
    rod.scale.set(0.035, len, 0.035);
    rod.position.y = inner + len / 2;
    spike.add(rod);

    const ball = new THREE.Mesh(ballGeo, isGold ? goldMat : nodeMat);
    ball.scale.setScalar(ballR);
    ball.position.y = reach;
    spike.add(ball);

    burst.add(spike);
    maxExtent = Math.max(maxExtent, reach + ballR);
  }

  /* Auto-frame so the burst always fits its canvas. */
  const halfFov = ((FOV * Math.PI) / 180) / 2;
  camera.position.set(0, 0, (maxExtent / Math.sin(halfFov)) * 1.08);
  camera.lookAt(0, 0, 0);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Reduced motion: render one static frame and stop. */
  if (reduced.matches) {
    burst.rotation.x = -0.32;
    burst.rotation.y = 0.4;
    renderer.render(scene, camera);
    return;
  }

  let running = false;
  const clock = new THREE.Clock();

  function frame() {
    if (!running) return;
    const t = clock.getElapsedTime();
    burst.rotation.y += 0.011;
    burst.rotation.x = -0.32 + Math.sin(t * 0.6) * 0.12;
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  const start = () => { if (!running) { running = true; clock.start(); frame(); } };
  const stop = () => { running = false; };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  new IntersectionObserver(
    (entries) => entries.forEach((e) => (e.isIntersecting && !document.hidden ? start() : stop())),
    { threshold: 0 }
  ).observe(canvas);

  start();
}

if (window.WebGLRenderingContext) {
  const canvas = document.getElementById('hero-logo-canvas');
  if (canvas) {
    try {
      createStarburst(canvas);
    } catch (err) {
      console.warn('Starburst emblem unavailable:', err);
    }
  }
}
