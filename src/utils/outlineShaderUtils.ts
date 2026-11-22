import * as THREE from 'three';

export type OutlinePresetProfile = 'homo' | 'australopithecus' | 'primate' | 'tendon';

export interface OutlineShaderBundle {
  setEnabled: (enabled: boolean) => void;
  setThicknessScale: (scale: number) => void;
  setOpacityScale: (scale: number) => void;
  updateDepthRange: (cameraDistance: number) => void;
}

interface OutlinePaletteSpec {
  hullNearColor: number;
  hullFarColor: number;
  rimColor: number;
  baseThickness: number;
  baseOpacity: number;
  rimPower: number;
  rimIntensity: number;
}

const OUTLINE_PALETTES: Record<OutlinePresetProfile, OutlinePaletteSpec> = {
  homo: {
    hullNearColor: 0xf7d79c, // Warm parchment-gold silhouette contour
    hullFarColor: 0x61594d, // Depth-attenuated warm slate for rear limbs
    rimColor: 0xfff2d6, // Crisp ivory grazing highlight along internal bone ridges
    baseThickness: 0.0105,
    baseOpacity: 0.92,
    rimPower: 2.85,
    rimIntensity: 0.62,
  },
  australopithecus: {
    hullNearColor: 0x7de0bc, // Fossil sage-emerald silhouette contour
    hullFarColor: 0x2c5c4c,
    rimColor: 0xc9f7e5,
    baseThickness: 0.0105,
    baseOpacity: 0.92,
    rimPower: 2.8,
    rimIntensity: 0.62,
  },
  primate: {
    hullNearColor: 0x80c6ff, // Luminous cobalt-cyan comparative silhouette
    hullFarColor: 0x2f537a,
    rimColor: 0xc4e4ff,
    baseThickness: 0.0108,
    baseOpacity: 0.88,
    rimPower: 2.55,
    rimIntensity: 0.68,
  },
  tendon: {
    hullNearColor: 0xffa070, // Warm elastic-tendon contour accent
    hullFarColor: 0x733a24,
    rimColor: 0xffc7a6,
    baseThickness: 0.0072,
    baseOpacity: 0.84,
    rimPower: 3.1,
    rimIntensity: 0.5,
  },
};

const NOOP_RAYCAST: THREE.Object3D['raycast'] = () => {};

/**
 * View-space-stabilized inverted-hull contour ShaderMaterial.
 * Extrudes along normalized view-space normals so non-uniformly scaled anatomical
 * meshes (pelvic blades, flattened ribs, cranial vaults) retain uniform stroke weight,
 * while attenuating color & opacity by view depth for clear foreground/background separation.
 */
function createInvertedHullOutlineMaterial(spec: OutlinePaletteSpec): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uNearColor: { value: new THREE.Color(spec.hullNearColor) },
      uFarColor: { value: new THREE.Color(spec.hullFarColor) },
      uThickness: { value: spec.baseThickness },
      uOpacity: { value: spec.baseOpacity },
      uDepthNear: { value: 2.6 },
      uDepthFar: { value: 6.8 },
    },
    vertexShader: /* glsl */ `
      uniform float uThickness;
      varying float vViewDepth;
      varying float vGrazing;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vec3 viewNormal = normalize(normalMatrix * normal);
        float viewDist = max(-mvPosition.z, 0.5);

        // Stabilize contour stroke across zoom levels (close-up pelvis vs full body)
        float distFactor = clamp(0.55 + viewDist * 0.105, 0.72, 1.55);
        float outlineWidth = uThickness * distFactor;

        mvPosition.xyz += viewNormal * outlineWidth;
        vViewDepth = max(-mvPosition.z, 0.0);
        vGrazing = clamp(1.0 - abs(dot(viewNormal, normalize(-mvPosition.xyz))), 0.0, 1.0);

        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uNearColor;
      uniform vec3 uFarColor;
      uniform float uOpacity;
      uniform float uDepthNear;
      uniform float uDepthFar;

      varying float vViewDepth;
      varying float vGrazing;

      void main() {
        float depthT = smoothstep(uDepthNear, uDepthFar, vViewDepth);
        vec3 contourColor = mix(uNearColor, uFarColor, depthT * 0.74);
        // Subtle boost along silhouette edge for sharp museum-plate definition
        contourColor *= mix(0.92, 1.08, vGrazing);
        float alpha = uOpacity * mix(1.0, 0.44, depthT);

        gl_FragColor = vec4(contourColor, alpha);
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: 2,
    polygonOffsetUnits: 2,
  });
}

/**
 * Front-face Fresnel anatomical ridge ShaderMaterial.
 * Highlights curved osteological boundaries (iliac crests, vertebral rims, condyles)
 * so overlapping bones separate cleanly in depth even when crossing directly in front
 * of one another.
 */
function createFresnelRidgeMaterial(spec: OutlinePaletteSpec): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uRimColor: { value: new THREE.Color(spec.rimColor) },
      uRimPower: { value: spec.rimPower },
      uRimIntensity: { value: spec.rimIntensity },
      uOpacity: { value: spec.baseOpacity },
      uDepthNear: { value: 2.6 },
      uDepthFar: { value: 6.8 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vViewNormal;
      varying vec3 vViewDir;
      varying float vViewDepth;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPosition.xyz);
        vViewDepth = max(-mvPosition.z, 0.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uRimColor;
      uniform float uRimPower;
      uniform float uRimIntensity;
      uniform float uOpacity;
      uniform float uDepthNear;
      uniform float uDepthFar;

      varying vec3 vViewNormal;
      varying vec3 vViewDir;
      varying float vViewDepth;

      void main() {
        vec3 N = normalize(vViewNormal);
        vec3 V = normalize(vViewDir);
        float ndotv = clamp(abs(dot(N, V)), 0.0, 1.0);
        float fresnel = pow(1.0 - ndotv, uRimPower);
        float ridgeMask = smoothstep(0.18, 0.92, fresnel);
        float depthAtten = mix(1.0, 0.4, smoothstep(uDepthNear, uDepthFar, vViewDepth));
        float alpha = ridgeMask * uRimIntensity * uOpacity * depthAtten;

        if (alpha < 0.015) discard;
        gl_FragColor = vec4(uRimColor, alpha);
      }
    `,
    side: THREE.FrontSide,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
}

function isOutlineEligibleMesh(obj: THREE.Object3D): obj is THREE.Mesh {
  if (!(obj instanceof THREE.Mesh)) return false;
  if (obj.userData?.isOutlineHelper || obj.userData?.skipOutline) return false;
  const geo = obj.geometry;
  if (!geo) return false;
  // Skip flat decals, contact shadows, and floor rings
  if (geo instanceof THREE.PlaneGeometry || geo instanceof THREE.RingGeometry) {
    return false;
  }
  return true;
}

/**
 * Attaches custom GLSL silhouette + Fresnel contour meshes as direct children of all
 * anatomical meshes in `targetGroup`. Because they are parented directly to each mesh,
 * articulated joint rotations during the running cycle stay 100% synchronized automatically.
 * Shared materials are disposed cleanly via `disposeObject3DTree`.
 */
export function attachBiomechanicsOutlineShader(
  targetGroup: THREE.Object3D,
  profile: OutlinePresetProfile,
  options: {
    includeFresnelRidge?: boolean;
    initialEnabled?: boolean;
    initialThicknessScale?: number;
  } = {}
): OutlineShaderBundle {
  const {
    includeFresnelRidge = true,
    initialEnabled = true,
    initialThicknessScale = 1,
  } = options;

  const spec = OUTLINE_PALETTES[profile];
  const hullMat = createInvertedHullOutlineMaterial(spec);
  hullMat.uniforms.uThickness.value = spec.baseThickness * initialThicknessScale;

  const fresnelMat = includeFresnelRidge ? createFresnelRidgeMaterial(spec) : null;

  // Collect eligible anatomical meshes first so we never mutate scene graph mid-traversal
  const sourceMeshes: THREE.Mesh[] = [];
  targetGroup.traverse((obj) => {
    if (isOutlineEligibleMesh(obj)) {
      sourceMeshes.push(obj);
    }
  });

  const createdHelpers: THREE.Mesh[] = [];

  sourceMeshes.forEach((mesh) => {
    const hullMesh = new THREE.Mesh(mesh.geometry, hullMat);
    hullMesh.name = `${mesh.name || 'anatomy'}_outline_hull`;
    hullMesh.userData.isOutlineHelper = true;
    hullMesh.castShadow = false;
    hullMesh.receiveShadow = false;
    hullMesh.raycast = NOOP_RAYCAST;
    hullMesh.renderOrder = 2;
    hullMesh.visible = initialEnabled;
    mesh.add(hullMesh);
    createdHelpers.push(hullMesh);

    if (fresnelMat) {
      const ridgeMesh = new THREE.Mesh(mesh.geometry, fresnelMat);
      ridgeMesh.name = `${mesh.name || 'anatomy'}_fresnel_ridge`;
      ridgeMesh.userData.isOutlineHelper = true;
      ridgeMesh.castShadow = false;
      ridgeMesh.receiveShadow = false;
      ridgeMesh.raycast = NOOP_RAYCAST;
      ridgeMesh.renderOrder = 3;
      ridgeMesh.visible = initialEnabled;
      mesh.add(ridgeMesh);
      createdHelpers.push(ridgeMesh);
    }
  });

  let currentEnabled = initialEnabled;

  return {
    setEnabled(enabled: boolean) {
      if (currentEnabled === enabled) return;
      currentEnabled = enabled;
      for (let i = 0; i < createdHelpers.length; i++) {
        createdHelpers[i].visible = enabled;
      }
    },
    setThicknessScale(scale: number) {
      const clamped = Math.max(0.45, Math.min(2.0, scale));
      hullMat.uniforms.uThickness.value = spec.baseThickness * clamped;
      if (fresnelMat) {
        fresnelMat.uniforms.uRimIntensity.value = Math.min(
          1.0,
          spec.rimIntensity * (0.72 + clamped * 0.28)
        );
      }
    },
    setOpacityScale(scale: number) {
      const clamped = Math.max(0.15, Math.min(1.15, scale));
      hullMat.uniforms.uOpacity.value = Math.min(1.0, spec.baseOpacity * clamped);
      if (fresnelMat) {
        fresnelMat.uniforms.uOpacity.value = Math.min(1.0, spec.baseOpacity * clamped);
      }
    },
    updateDepthRange(cameraDistance: number) {
      // Center the depth-cueing gradient tightly around the skeleton's front-to-back thickness
      const near = Math.max(0.8, cameraDistance - 1.15);
      const far = near + 2.65;
      hullMat.uniforms.uDepthNear.value = near;
      hullMat.uniforms.uDepthFar.value = far;
      if (fresnelMat) {
        fresnelMat.uniforms.uDepthNear.value = near;
        fresnelMat.uniforms.uDepthFar.value = far;
      }
    },
  };
}
