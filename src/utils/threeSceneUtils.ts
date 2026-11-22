import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function detectSoftwareWebGL(): boolean {
  if (typeof document === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export interface StudioRendererBundle {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  isSoftwareGl: boolean;
  envTexture: THREE.Texture;
  disposeStudio: () => void;
}

export function createEditorialStudio(
  container: HTMLElement,
  backgroundHex = '#f5f4ef',
  fogNear = 11,
  fogFar = 26,
  studioTone: 'light' | 'dark' = 'light'
): StudioRendererBundle {
  const isSoftwareGl = detectSoftwareWebGL();
  const isDark = studioTone === 'dark';
  const width = Math.max(container.clientWidth, 320);
  const height = Math.max(container.clientHeight, 320);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isSoftwareGl,
    powerPreference: 'high-performance',
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = isDark ? 1.14 : 1.06;
  renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  renderer.shadowMap.enabled = !isSoftwareGl;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const bgColor = new THREE.Color(backgroundHex);
  scene.background = bgColor;
  scene.fog = new THREE.Fog(bgColor, fogNear, fogFar);

  // Studio environment reflection on all devices
  const pmrem = new THREE.PMREMGenerator(renderer);
  const roomEnv = new RoomEnvironment();
  const envTarget = pmrem.fromScene(roomEnv, 0.04);
  scene.environment = envTarget.texture;
  roomEnv.dispose();
  pmrem.dispose();

  // Balanced 3-point warm/cool studio lighting (<= 3 shadow casters)
  const hemi = new THREE.HemisphereLight(
    isDark ? 0xe0ecfc : 0xf2f6fc,
    isDark ? 0x262c38 : 0xd8cec0,
    isDark ? 0.85 : 0.95
  );
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(isDark ? 0xfff6e8 : 0xfff4e4, isDark ? 2.05 : 1.55);
  keyLight.position.set(5.5, 8.8, 6.2);
  if (!isSoftwareGl) {
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 24;
    const d = 6.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
  }
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(isDark ? 0xa3cbf7 : 0xd9e8fa, isDark ? 1.15 : 0.72);
  rimLight.position.set(-5.5, 5.2, -5.2);
  scene.add(rimLight);

  container.appendChild(renderer.domElement);

  const disposeStudio = () => {
    envTarget.texture.dispose();
    envTarget.dispose();
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };

  return {
    renderer,
    scene,
    isSoftwareGl,
    envTexture: envTarget.texture,
    disposeStudio,
  };
}

/**
 * Deterministic seeded PRNG for zero-404 procedural stone/soil/bone textures.
 */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createProceduralRockTexture(
  kind: 'limestone' | 'sandstone' | 'soil' | 'bone',
  maxAnisotropy = 4
): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const rng = mulberry32(
      kind === 'limestone' ? 101 : kind === 'sandstone' ? 202 : kind === 'soil' ? 303 : 404
    );

    if (kind === 'limestone') {
      ctx.fillStyle = '#ddd2bd';
      ctx.fillRect(0, 0, size, size);
      // Soft sedimentary strata and chalky fossil pores
      for (let i = 0; i < 42; i++) {
        ctx.fillStyle = rng() > 0.5 ? 'rgba(255,250,240,0.22)' : 'rgba(155,140,115,0.18)';
        ctx.fillRect(0, rng() * size, size, 2 + rng() * 6);
      }
      for (let i = 0; i < 360; i++) {
        const x = rng() * size;
        const y = rng() * size;
        const r = 0.8 + rng() * 2.4;
        ctx.fillStyle = rng() > 0.45 ? 'rgba(126,113,91,0.24)' : 'rgba(247,242,232,0.34)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (kind === 'sandstone') {
      ctx.fillStyle = '#9e6b50';
      ctx.fillRect(0, 0, size, size);
      // Coarse lithified quartz/iron-oxide grains
      for (let i = 0; i < 950; i++) {
        const x = rng() * size;
        const y = rng() * size;
        const r = 0.6 + rng() * 1.8;
        const roll = rng();
        ctx.fillStyle =
          roll > 0.66
            ? 'rgba(72,42,27,0.35)'
            : roll > 0.33
              ? 'rgba(205,158,125,0.28)'
              : 'rgba(180,60,11,0.16)';
        ctx.fillRect(x, y, r, r);
      }
    } else if (kind === 'soil') {
      ctx.fillStyle = '#e7e1d4';
      ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < 620; i++) {
        const x = rng() * size;
        const y = rng() * size;
        const r = 1 + rng() * 3.5;
        ctx.fillStyle =
          rng() > 0.5 ? 'rgba(168,154,132,0.16)' : 'rgba(198,186,164,0.18)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Cortical bone texture with fine longitudinal striation
      ctx.fillStyle = '#ebe4d6';
      ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < 120; i++) {
        ctx.fillStyle = rng() > 0.5 ? 'rgba(176,163,140,0.16)' : 'rgba(255,253,248,0.28)';
        ctx.fillRect(rng() * size, 0, 1 + rng() * 2, size);
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = Math.min(maxAnisotropy, 8);
  tex.needsUpdate = true;
  return tex;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(size / 2, size / 2, 12, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(18, 18, 18, 0.34)');
    grad.addColorStop(0.55, 'rgba(18, 18, 18, 0.14)');
    grad.addColorStop(1, 'rgba(18, 18, 18, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function disposeObject3DTree(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
      if (obj.geometry) geometries.add(obj.geometry);
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m) => {
        if (!m) return;
        materials.add(m);
        const std = m as THREE.MeshStandardMaterial;
        if (std.map) textures.add(std.map);
        if (std.normalMap) textures.add(std.normalMap);
        if (std.roughnessMap) textures.add(std.roughnessMap);
      });
    }
  });

  geometries.forEach((g) => g.dispose());
  textures.forEach((t) => t.dispose());
  materials.forEach((m) => m.dispose());
}

/**
 * Software-WebGL-safe GPU sync wait before scheduling the next animation step.
 */
export function scheduleAfterDraw(
  renderer: THREE.WebGLRenderer,
  cb: () => void,
  registerTimer: (id: number) => void
) {
  const gl = renderer.getContext() as WebGL2RenderingContext | null;
  if (!gl || typeof gl.fenceSync !== 'function') {
    registerTimer(window.setTimeout(cb, 80));
    return;
  }
  const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
  gl.flush();
  const poll = () => {
    const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
    if (state === gl.UNSIGNALED) {
      registerTimer(window.setTimeout(poll, 5));
    } else {
      if (sync) gl.deleteSync(sync);
      registerTimer(window.setTimeout(cb, 80));
    }
  };
  registerTimer(window.setTimeout(poll, 5));
}
