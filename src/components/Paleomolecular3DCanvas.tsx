import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type {
  CameraPresetId,
  Molecular3DHotspot,
  Molecular3DModelId,
  Molecular3DModelSpec,
} from '../data/paleomolecular3dModels';
import type { ProjectedARPoint } from './ARHotspotOverlay';

// Pre-allocated math helpers outside the render loop (zero per-frame GC)
const _vecA = new THREE.Vector3();
const _vecB = new THREE.Vector3();
const _mid = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();
const _mouse = new THREE.Vector2();
const _projVec = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
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

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(size / 2, size / 2, 10, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(6, 8, 12, 0.55)');
    grad.addColorStop(0.55, 'rgba(6, 8, 12, 0.22)');
    grad.addColorStop(1, 'rgba(6, 8, 12, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export interface Molecular3DHoverInfo {
  id: string;
  kind: 'hotspot' | 'structure';
  title: string;
  category: string;
  accent: string;
  biologicalFunction: string;
  paleoSignificance: string;
  x: number;
  y: number;
  containerWidth: number;
  containerHeight: number;
  clickableHotspotId?: string;
}

interface ExplodablePart {
  obj: THREE.Object3D;
  basePos: THREE.Vector3;
  explodeDir: THREE.Vector3;
}

interface BuiltModelHandle {
  spec: Molecular3DModelSpec;
  root: THREE.Group;
  explodables: ExplodablePart[];
  hitTargets: THREE.Object3D[];
  hoverTargets: THREE.Object3D[];
  hotspotRings: Map<string, THREE.Mesh>;
  applyVariant: (alternate: boolean, explodeAmount: number) => void;
  dispose: () => void;
}

function isObjectVisibleInHierarchy(obj: THREE.Object3D): boolean {
  let cur: THREE.Object3D | null = obj;
  while (cur) {
    if (!cur.visible) return false;
    cur = cur.parent;
  }
  return true;
}

function tagSubstructure(
  target: THREE.Object3D,
  substructureId: string,
  hoverTargets: THREE.Object3D[]
) {
  target.traverse((node) => {
    if (node instanceof THREE.Mesh) {
      node.layers.enable(2);
      node.userData.substructureId = substructureId;
      hoverTargets.push(node);
    }
  });
}

function addCylinderBetween(
  parent: THREE.Object3D,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  radius: number,
  material: THREE.Material,
  radialSegments = 10
): THREE.Mesh {
  _dir.subVectors(p2, p1);
  const len = _dir.length();
  const geo = new THREE.CylinderGeometry(radius, radius, len, radialSegments);
  const mesh = new THREE.Mesh(geo, material);
  _mid.addVectors(p1, p2).multiplyScalar(0.5);
  mesh.position.copy(_mid);
  _quat.setFromUnitVectors(_up, _dir.normalize());
  mesh.quaternion.copy(_quat);
  parent.add(mesh);
  return mesh;
}

function addHotspotMarkers(
  root: THREE.Group,
  hotspots: Molecular3DHotspot[],
  hitTargets: THREE.Object3D[],
  hotspotRings: Map<string, THREE.Mesh>
) {
  hotspots.forEach((hs) => {
    const markerGroup = new THREE.Group();
    markerGroup.position.set(hs.position[0], hs.position[1], hs.position[2]);

    // Outer subtle selection ring
    const ringGeo = new THREE.TorusGeometry(0.32, 0.032, 12, 32);
    const ringMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(hs.accent),
      emissive: new THREE.Color(hs.accent),
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.4,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    markerGroup.add(ring);
    hotspotRings.set(hs.id, ring);

    // Core indicator dot
    const coreGeo = new THREE.SphereGeometry(0.11, 14, 14);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: new THREE.Color(hs.accent),
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.1,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    markerGroup.add(core);

    // Invisible proxy hit sphere on Layer 1 for ergonomic picking
    const hitGeo = new THREE.SphereGeometry(0.46, 10, 10);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    hitMesh.layers.set(1);
    hitMesh.userData = { hotspotId: hs.id };
    markerGroup.add(hitMesh);
    hitTargets.push(hitMesh);

    root.add(markerGroup);
  });
}

function disposeGroupResources(root: THREE.Object3D) {
  const disposedGeos = new Set<THREE.BufferGeometry>();
  const disposedMats = new Set<THREE.Material>();
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      if (obj.geometry && !disposedGeos.has(obj.geometry)) {
        disposedGeos.add(obj.geometry);
        obj.geometry.dispose();
      }
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m) => {
        if (m && !disposedMats.has(m)) {
          disposedMats.add(m);
          m.dispose();
        }
      });
    }
  });
}

function buildDnaModel(spec: Molecular3DModelSpec): BuiltModelHandle {
  const root = new THREE.Group();
  const explodables: ExplodablePart[] = [];
  const hitTargets: THREE.Object3D[] = [];
  const hoverTargets: THREE.Object3D[] = [];
  const hotspotRings = new Map<string, THREE.Mesh>();

  const strandAGroup = new THREE.Group();
  const strandBGroup = new THREE.Group();
  const rungsGroup = new THREE.Group();
  root.add(strandAGroup, strandBGroup, rungsGroup);

  const pairs = 18;
  const height = 6.2;
  const radius = 1.28;
  const turns = 1.65;

  const ptsA: THREE.Vector3[] = [];
  const ptsB: THREE.Vector3[] = [];

  for (let i = 0; i < pairs; i++) {
    const t = i / (pairs - 1);
    const y = (t - 0.5) * height;
    const angle = t * Math.PI * 2 * turns;
    ptsA.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    ptsB.push(
      new THREE.Vector3(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius)
    );
  }

  const matBackboneA = new THREE.MeshPhysicalMaterial({
    color: 0x2a6fb8,
    roughness: 0.28,
    metalness: 0.25,
    clearcoat: 0.65,
  });
  const matBackboneB = new THREE.MeshPhysicalMaterial({
    color: 0x5c7c99,
    roughness: 0.42,
    metalness: 0.15,
    clearcoat: 0.35,
  });
  const matPhosphate = new THREE.MeshStandardMaterial({
    color: 0xd9d4c7,
    roughness: 0.2,
    metalness: 0.65,
  });

  const curveA = new THREE.CatmullRomCurve3(ptsA);
  const curveB = new THREE.CatmullRomCurve3(ptsB);
  strandAGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curveA, 96, 0.11, 14, false), matBackboneA));
  strandBGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curveB, 96, 0.11, 14, false), matBackboneB));

  const beadGeo = new THREE.SphereGeometry(0.17, 14, 14);
  const damageMeshes: THREE.Mesh[] = [];

  const matAdenine = new THREE.MeshStandardMaterial({ color: 0x1c8b6a, roughness: 0.35, metalness: 0.15 });
  const matThymine = new THREE.MeshStandardMaterial({ color: 0xd6a442, roughness: 0.35, metalness: 0.15 });
  const matGuanine = new THREE.MeshStandardMaterial({ color: 0x3b86d1, roughness: 0.32, metalness: 0.2 });
  const matCytosine = new THREE.MeshStandardMaterial({ color: 0x9aa4b2, roughness: 0.38, metalness: 0.15 });
  const matDamageCT = new THREE.MeshStandardMaterial({
    color: 0xe65319,
    emissive: 0xb43c0b,
    emissiveIntensity: 0.55,
    roughness: 0.22,
    metalness: 0.25,
  });

  const baseSequence: Array<['A' | 'T' | 'G' | 'C', 'A' | 'T' | 'G' | 'C']> = [
    ['C', 'G'],
    ['C', 'G'],
    ['G', 'C'],
    ['A', 'T'],
    ['T', 'A'],
    ['C', 'G'],
    ['G', 'C'],
    ['A', 'T'],
    ['A', 'T'],
    ['T', 'A'],
    ['C', 'G'],
    ['G', 'C'],
    ['T', 'A'],
    ['A', 'T'],
    ['C', 'G'],
    ['G', 'C'],
    ['C', 'G'],
    ['C', 'G'],
  ];

  const matForBase = (b: 'A' | 'T' | 'G' | 'C') => {
    if (b === 'A') return matAdenine;
    if (b === 'T') return matThymine;
    if (b === 'G') return matGuanine;
    return matCytosine;
  };

  for (let i = 0; i < pairs; i++) {
    const pA = ptsA[i];
    const pB = ptsB[i];
    const mP = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);

    const beadA = new THREE.Mesh(beadGeo, matPhosphate);
    beadA.position.copy(pA);
    strandAGroup.add(beadA);

    const beadB = new THREE.Mesh(beadGeo, matPhosphate);
    beadB.position.copy(pB);
    strandBGroup.add(beadB);

    const isTerminal5Prime = i <= 1 || i >= pairs - 2;
    const [b1, b2] = baseSequence[i];

    const halfA = addCylinderBetween(
      rungsGroup,
      pA,
      mP,
      isTerminal5Prime ? 0.088 : 0.072,
      isTerminal5Prime ? matDamageCT : matForBase(b1),
      10
    );
    const halfB = addCylinderBetween(
      rungsGroup,
      mP,
      pB,
      0.072,
      matForBase(b2),
      10
    );
    if (isTerminal5Prime) {
      halfA.userData.cleanMaterial = matForBase(b1);
      halfA.userData.damageMaterial = matDamageCT;
      damageMeshes.push(halfA);
      tagSubstructure(halfA, 'dna-terminal', hoverTargets);
      tagSubstructure(halfB, 'dna-terminal', hoverTargets);
    } else {
      tagSubstructure(halfA, 'dna-basepair', hoverTargets);
      tagSubstructure(halfB, 'dna-basepair', hoverTargets);
    }

    // Hydrogen bond bridge bead in center
    const hBead = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 10, 10),
      isTerminal5Prime ? matDamageCT : matPhosphate
    );
    hBead.position.copy(mP);
    if (isTerminal5Prime) {
      hBead.userData.cleanMaterial = matPhosphate;
      hBead.userData.damageMaterial = matDamageCT;
      damageMeshes.push(hBead);
      tagSubstructure(hBead, 'dna-terminal', hoverTargets);
    } else {
      tagSubstructure(hBead, 'dna-basepair', hoverTargets);
    }
    rungsGroup.add(hBead);
  }

  tagSubstructure(strandAGroup, 'dna-backbone', hoverTargets);
  tagSubstructure(strandBGroup, 'dna-backbone', hoverTargets);

  explodables.push(
    { obj: strandAGroup, basePos: new THREE.Vector3(0, 0, 0), explodeDir: new THREE.Vector3(1.15, 0, 0.35) },
    { obj: strandBGroup, basePos: new THREE.Vector3(0, 0, 0), explodeDir: new THREE.Vector3(-1.15, 0, -0.35) },
    { obj: rungsGroup, basePos: new THREE.Vector3(0, 0, 0), explodeDir: new THREE.Vector3(0, 0.35, 0) }
  );

  addHotspotMarkers(root, spec.hotspots, hitTargets, hotspotRings);

  return {
    spec,
    root,
    explodables,
    hitTargets,
    hoverTargets,
    hotspotRings,
    applyVariant: (alternate) => {
      // alternate = ADN moderno (sin daño C->T)
      damageMeshes.forEach((mesh) => {
        mesh.material = alternate ? mesh.userData.cleanMaterial : mesh.userData.damageMaterial;
      });
    },
    dispose: () => disposeGroupResources(root),
  };
}

function buildAmelogeninModel(spec: Molecular3DModelSpec): BuiltModelHandle {
  const root = new THREE.Group();
  const explodables: ExplodablePart[] = [];
  const hitTargets: THREE.Object3D[] = [];
  const hoverTargets: THREE.Object3D[] = [];
  const hotspotRings = new Map<string, THREE.Mesh>();

  const mineralGroup = new THREE.Group();
  const amelxGroup = new THREE.Group();
  const amelyGroup = new THREE.Group();
  root.add(mineralGroup, amelxGroup, amelyGroup);

  // 1. Hexagonal Hydroxyapatite enamel prisms (mineral matrix base)
  const prismMat = new THREE.MeshPhysicalMaterial({
    color: 0xe6e1d3,
    roughness: 0.18,
    metalness: 0.12,
    clearcoat: 0.85,
    transparent: true,
    opacity: 0.78,
  });
  const prismEdgeMat = new THREE.MeshStandardMaterial({
    color: 0x9b9586,
    roughness: 0.55,
    metalness: 0.35,
  });

  const hexCoords: Array<[number, number, number]> = [
    [0, -1.9, 0],
    [0.92, -1.95, 0.52],
    [-0.92, -1.95, 0.52],
    [0.92, -2.0, -0.52],
    [-0.92, -2.0, -0.52],
    [0, -2.05, 1.04],
    [0, -2.05, -1.04],
  ];

  hexCoords.forEach(([x, y, z], i) => {
    const h = 1.55 + (i % 3) * 0.25;
    const prism = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, h, 6), prismMat);
    prism.position.set(x, y, z);
    mineralGroup.add(prism);

    const cap = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.025, 8, 6), prismEdgeMat);
    cap.rotation.x = Math.PI / 2;
    cap.position.set(x, y + h / 2, z);
    mineralGroup.add(cap);
  });

  // 2. AMELX peptide ribbon (SIRPPYPSY) — left helical fold in lapis blue
  const amelxPts: THREE.Vector3[] = [];
  for (let i = 0; i <= 26; i++) {
    const t = i / 26;
    const angle = t * Math.PI * 3.2;
    amelxPts.push(
      new THREE.Vector3(
        -1.35 + Math.cos(angle) * 0.52,
        -0.7 + t * 3.1,
        Math.sin(angle) * 0.58 + 0.15
      )
    );
  }
  const matAmelX = new THREE.MeshPhysicalMaterial({
    color: 0x266eb8,
    roughness: 0.25,
    metalness: 0.2,
    clearcoat: 0.7,
  });
  const matResidueX = new THREE.MeshStandardMaterial({
    color: 0x7cb3ea,
    roughness: 0.3,
    metalness: 0.35,
  });
  amelxGroup.add(
    new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(amelxPts), 84, 0.13, 14, false), matAmelX)
  );
  // 9 residues of SIRPPYPSY
  for (let r = 0; r < 9; r++) {
    const idx = Math.round((r / 8) * (amelxPts.length - 1));
    const p = amelxPts[idx];
    const side = new THREE.Vector3(p.x - 0.38 * Math.cos(r), p.y, p.z + 0.32 * Math.sin(r));
    addCylinderBetween(amelxGroup, p, side, 0.04, matResidueX, 8);
    const sph = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 14), matResidueX);
    sph.position.copy(side);
    amelxGroup.add(sph);
  }

  // 3. AMELY peptide ribbon (SMIRPPY) — right fold in ochre/copper (Y-chromosome diagnostic)
  const amelyPts: THREE.Vector3[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const angle = -t * Math.PI * 2.9 + 0.4;
    amelyPts.push(
      new THREE.Vector3(
        1.35 + Math.cos(angle) * 0.52,
        -0.5 + t * 2.85,
        Math.sin(angle) * 0.58 + 0.15
      )
    );
  }
  const matAmelY = new THREE.MeshPhysicalMaterial({
    color: 0xd95216,
    emissive: 0x6b2004,
    emissiveIntensity: 0.25,
    roughness: 0.22,
    metalness: 0.28,
    clearcoat: 0.7,
  });
  const matMetDiagnostic = new THREE.MeshStandardMaterial({
    color: 0xf4b63d,
    emissive: 0xa66900,
    emissiveIntensity: 0.45,
    roughness: 0.2,
    metalness: 0.5,
  });
  amelyGroup.add(
    new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(amelyPts), 80, 0.13, 14, false), matAmelY)
  );
  // 7 residues of SMIRPPY, highlighting Met at index 1 (position 2)
  for (let r = 0; r < 7; r++) {
    const idx = Math.round((r / 6) * (amelyPts.length - 1));
    const p = amelyPts[idx];
    const side = new THREE.Vector3(p.x + 0.42 * Math.cos(r + 0.5), p.y, p.z + 0.34 * Math.sin(r));
    const isMet = r === 1 || r === 2;
    addCylinderBetween(amelyGroup, p, side, isMet ? 0.055 : 0.04, isMet ? matMetDiagnostic : matAmelY, 8);
    const sph = new THREE.Mesh(
      new THREE.SphereGeometry(isMet ? 0.2 : 0.13, 14, 14),
      isMet ? matMetDiagnostic : matAmelY
    );
    sph.position.copy(side);
    amelyGroup.add(sph);
  }

  // Deamidation anchor bridge connecting the upper loop
  const bridgeMat = new THREE.MeshStandardMaterial({
    color: 0x1c8b6a,
    roughness: 0.35,
    metalness: 0.2,
  });
  const nqOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 1), bridgeMat);
  nqOrb.position.set(-0.45, 1.85, -0.25);
  amelxGroup.add(nqOrb);

  tagSubstructure(mineralGroup, 'amel-prism', hoverTargets);
  tagSubstructure(amelxGroup, 'amel-x', hoverTargets);
  nqOrb.userData.substructureId = 'amel-nq';
  tagSubstructure(amelyGroup, 'amel-y', hoverTargets);

  explodables.push(
    { obj: mineralGroup, basePos: new THREE.Vector3(0, 0, 0), explodeDir: new THREE.Vector3(0, -1.1, 0) },
    { obj: amelxGroup, basePos: new THREE.Vector3(0, 0, 0), explodeDir: new THREE.Vector3(-0.95, 0.45, 0.25) },
    { obj: amelyGroup, basePos: new THREE.Vector3(0, 0, 0), explodeDir: new THREE.Vector3(0.95, 0.45, -0.25) }
  );

  addHotspotMarkers(root, spec.hotspots, hitTargets, hotspotRings);

  return {
    spec,
    root,
    explodables,
    hitTargets,
    hoverTargets,
    hotspotRings,
    applyVariant: (alternate) => {
      // alternate = Perfil XX (sin AMELY)
      amelyGroup.visible = !alternate;
      const amelyRing = hotspotRings.get('amely-motif');
      if (amelyRing?.parent) {
        amelyRing.parent.visible = !alternate;
      }
    },
    dispose: () => disposeGroupResources(root),
  };
}

function buildEnamelinModel(spec: Molecular3DModelSpec): BuiltModelHandle {
  const root = new THREE.Group();
  const explodables: ExplodablePart[] = [];
  const hitTargets: THREE.Object3D[] = [];
  const hoverTargets: THREE.Object3D[] = [];
  const hotspotRings = new Map<string, THREE.Mesh>();

  const coreFoldGroup = new THREE.Group();
  const sapLoopGroup = new THREE.Group();
  const calciumBaseGroup = new THREE.Group();
  root.add(coreFoldGroup, sapLoopGroup, calciumBaseGroup);

  // Folded multi-loop protein ribbon
  const corePts: THREE.Vector3[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const a = t * Math.PI * 4.5;
    corePts.push(
      new THREE.Vector3(
        Math.sin(a) * 1.45 - 0.35,
        (t - 0.5) * 4.2,
        Math.cos(a * 0.75) * 1.05
      )
    );
  }
  const matRibbon = new THREE.MeshPhysicalMaterial({
    color: 0x2a6fb8,
    roughness: 0.3,
    metalness: 0.22,
    clearcoat: 0.6,
  });
  coreFoldGroup.add(
    new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(corePts), 120, 0.14, 14, false), matRibbon)
  );

  // Conserved phylogenetic side chains along the core
  const matConserved = new THREE.MeshStandardMaterial({
    color: 0x9ec4eb,
    roughness: 0.35,
    metalness: 0.3,
  });
  [6, 12, 18, 26, 33].forEach((idx, k) => {
    const p = corePts[idx];
    const tip = new THREE.Vector3(p.x + (k % 2 === 0 ? -0.55 : 0.5), p.y + 0.15, p.z + 0.35);
    addCylinderBetween(coreFoldGroup, p, tip, 0.045, matConserved, 8);
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 14), matConserved);
    orb.position.copy(tip);
    coreFoldGroup.add(orb);
  });

  // Polymorphic ENAM-137 loop & side-chain assembly (SK 835)
  const sapAnchor = new THREE.Vector3(0.45, 0.85, 0.55);
  const sapTip = new THREE.Vector3(1.15, 1.05, 1.05);
  const matSapAlt = new THREE.MeshStandardMaterial({
    color: 0xe65319,
    emissive: 0x9e2d04,
    emissiveIntensity: 0.55,
    roughness: 0.2,
    metalness: 0.35,
  });
  const matSapBase = new THREE.MeshStandardMaterial({
    color: 0x6ea8df,
    emissive: 0x1a4475,
    emissiveIntensity: 0.25,
    roughness: 0.35,
    metalness: 0.2,
  });

  const sapBond = addCylinderBetween(sapLoopGroup, sapAnchor, sapTip, 0.065, matSapAlt, 10);
  const sapHead = new THREE.Mesh(new THREE.DodecahedronGeometry(0.32, 1), matSapAlt);
  sapHead.position.copy(sapTip);
  sapLoopGroup.add(sapHead);

  // Secondary branched lobe only prominent in SK 835 polymorphic variant
  const sapBranch = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 14), matSapAlt);
  sapBranch.position.set(1.42, 1.32, 0.85);
  sapLoopGroup.add(sapBranch);

  // Calcium-phosphate mineral interface plate below
  const matCaPlate = new THREE.MeshPhysicalMaterial({
    color: 0x1c8b6a,
    roughness: 0.3,
    metalness: 0.25,
    clearcoat: 0.5,
  });
  const matCaIon = new THREE.MeshStandardMaterial({
    color: 0xe2decb,
    roughness: 0.22,
    metalness: 0.65,
  });
  const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.12, 12, 36), matCaPlate);
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.set(0, -1.65, 0);
  calciumBaseGroup.add(baseRing);

  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const ca = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 14), matCaIon);
    ca.position.set(Math.cos(a) * 1.4, -1.65, Math.sin(a) * 1.4);
    calciumBaseGroup.add(ca);
  }

  tagSubstructure(coreFoldGroup, 'enam-core', hoverTargets);
  tagSubstructure(sapLoopGroup, 'enam-sap', hoverTargets);
  tagSubstructure(calciumBaseGroup, 'enam-calcium', hoverTargets);

  explodables.push(
    { obj: coreFoldGroup, basePos: new THREE.Vector3(0, 0, 0), explodeDir: new THREE.Vector3(-0.6, 0.2, 0) },
    { obj: sapLoopGroup, basePos: new THREE.Vector3(0, 0, 0), explodeDir: new THREE.Vector3(0.95, 0.55, 0.6) },
    { obj: calciumBaseGroup, basePos: new THREE.Vector3(0, 0, 0), explodeDir: new THREE.Vector3(0, -1.0, 0) }
  );

  addHotspotMarkers(root, spec.hotspots, hitTargets, hotspotRings);

  return {
    spec,
    root,
    explodables,
    hitTargets,
    hoverTargets,
    hotspotRings,
    applyVariant: (alternate) => {
      // default = SK 835 polymorphism; alternate = Swartkrans baseline sequence
      const mat = alternate ? matSapBase : matSapAlt;
      sapBond.material = mat;
      sapHead.material = mat;
      sapBranch.visible = !alternate;
      sapHead.scale.setScalar(alternate ? 0.72 : 1.0);
    },
    dispose: () => disposeGroupResources(root),
  };
}

function buildCollagenModel(spec: Molecular3DModelSpec): BuiltModelHandle {
  const root = new THREE.Group();
  const explodables: ExplodablePart[] = [];
  const hitTargets: THREE.Object3D[] = [];
  const hoverTargets: THREE.Object3D[] = [];
  const hotspotRings = new Map<string, THREE.Mesh>();

  const chain1Group = new THREE.Group();
  const chain2Group = new THREE.Group();
  const chainA2Group = new THREE.Group();
  const crossLinksGroup = new THREE.Group();
  root.add(chain1Group, chain2Group, chainA2Group, crossLinksGroup);

  const steps = 42;
  const height = 6.2;
  const r = 0.78;
  const turns = 2.2;

  const buildHelixPts = (phase: number) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const y = (t - 0.5) * height;
      const angle = t * Math.PI * 2 * turns + phase;
      // Subtle supercoil modulation
      const subAngle = t * Math.PI * 10 + phase;
      pts.push(
        new THREE.Vector3(
          Math.cos(angle) * r + Math.cos(subAngle) * 0.14,
          y,
          Math.sin(angle) * r + Math.sin(subAngle) * 0.14
        )
      );
    }
    return pts;
  };

  const pts1 = buildHelixPts(0);
  const pts2 = buildHelixPts((Math.PI * 2) / 3);
  const ptsA2 = buildHelixPts((Math.PI * 4) / 3);

  const matCol1A = new THREE.MeshPhysicalMaterial({
    color: 0xc96228,
    roughness: 0.32,
    metalness: 0.2,
    clearcoat: 0.5,
  });
  const matCol1B = new THREE.MeshPhysicalMaterial({
    color: 0xa67c37,
    roughness: 0.42,
    metalness: 0.25,
    clearcoat: 0.35,
  });
  const matColA2Highlight = new THREE.MeshPhysicalMaterial({
    color: 0x1c9b76,
    emissive: 0x0b4f3b,
    emissiveIntensity: 0.4,
    roughness: 0.22,
    metalness: 0.28,
    clearcoat: 0.75,
  });
  const matColA2Unified = new THREE.MeshPhysicalMaterial({
    color: 0x8f8878,
    roughness: 0.4,
    metalness: 0.2,
    clearcoat: 0.3,
  });
  const matBond = new THREE.MeshStandardMaterial({
    color: 0xe6d6a8,
    roughness: 0.3,
    metalness: 0.45,
  });

  chain1Group.add(
    new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts1), 110, 0.13, 12, false), matCol1A)
  );
  chain2Group.add(
    new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts2), 110, 0.13, 12, false), matCol1B)
  );
  const a2Tube = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsA2), 110, 0.14, 12, false),
    matColA2Highlight
  );
  chainA2Group.add(a2Tube);

  // Gly-X-Y cross-link struts
  for (let i = 4; i < steps - 3; i += 4) {
    addCylinderBetween(crossLinksGroup, pts1[i], pts2[i], 0.032, matBond, 6);
    addCylinderBetween(crossLinksGroup, pts2[i], ptsA2[i], 0.032, matBond, 6);
    addCylinderBetween(crossLinksGroup, ptsA2[i], pts1[i], 0.032, matBond, 6);
  }

  tagSubstructure(chain1Group, 'col-a1', hoverTargets);
  tagSubstructure(chain2Group, 'col-a1', hoverTargets);
  tagSubstructure(chainA2Group, 'col-a2', hoverTargets);
  tagSubstructure(crossLinksGroup, 'col-crosslink', hoverTargets);

  explodables.push(
    { obj: chain1Group, basePos: new THREE.Vector3(0, 0, 0), explodeDir: new THREE.Vector3(1.1, 0, 0.6) },
    { obj: chain2Group, basePos: new THREE.Vector3(0, 0, 0), explodeDir: new THREE.Vector3(-1.1, 0, 0.6) },
    { obj: chainA2Group, basePos: new THREE.Vector3(0, 0, 0), explodeDir: new THREE.Vector3(0, 0, -1.25) },
    { obj: crossLinksGroup, basePos: new THREE.Vector3(0, 0, 0), explodeDir: new THREE.Vector3(0, 0.4, 0) }
  );

  addHotspotMarkers(root, spec.hotspots, hitTargets, hotspotRings);

  return {
    spec,
    root,
    explodables,
    hitTargets,
    hoverTargets,
    hotspotRings,
    applyVariant: (alternate) => {
      a2Tube.material = alternate ? matColA2Unified : matColA2Highlight;
    },
    dispose: () => disposeGroupResources(root),
  };
}

function buildModelById(spec: Molecular3DModelSpec): BuiltModelHandle {
  switch (spec.id) {
    case 'adn-taforalt':
      return buildDnaModel(spec);
    case 'amelogenina-swartkrans':
      return buildAmelogeninModel(spec);
    case 'enamelina-enam137':
      return buildEnamelinModel(spec);
    case 'colageno-zooms':
      return buildCollagenModel(spec);
  }
}

export interface Paleomolecular3DCanvasProps {
  model: Molecular3DModelSpec;
  explodeAmount: number; // 0..1
  alternateVariant: boolean;
  autoRotate: boolean;
  cameraCommand: { preset: CameraPresetId; nonce: number } | null;
  selectedHotspotId: string | null;
  onSelectHotspot: (hotspotId: string) => void;
  onHoverChange?: (hover: Molecular3DHoverInfo | null) => void;
  onProjectedHotspotsChange?: (
    points: ProjectedARPoint[],
    size: { width: number; height: number }
  ) => void;
}

export function Paleomolecular3DCanvas({
  model,
  explodeAmount,
  alternateVariant,
  autoRotate,
  cameraCommand,
  selectedHotspotId,
  onSelectHotspot,
  onHoverChange,
  onProjectedHotspotsChange,
}: Paleomolecular3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  // Mutable state refs so React updates never tear down the WebGL context
  const stateRef = useRef({
    modelId: model.id as Molecular3DModelId,
    explodeTarget: explodeAmount,
    explodeCurrent: explodeAmount,
    alternateVariant,
    autoRotate,
    selectedHotspotId,
    hoveredHotspotId: null as string | null,
    onSelectHotspot,
    onHoverChange,
    onProjectedHotspotsChange,
    isVisible: true,
  });

  const sceneApiRef = useRef<{
    loadModel: (spec: Molecular3DModelSpec) => void;
    flyTo: (pos: [number, number, number], target: [number, number, number]) => void;
    requestRender: () => void;
    syncVariantAndSelection: () => void;
  } | null>(null);

  stateRef.current.explodeTarget = explodeAmount;
  stateRef.current.alternateVariant = alternateVariant;
  stateRef.current.autoRotate = autoRotate;
  stateRef.current.selectedHotspotId = selectedHotspotId;
  stateRef.current.onSelectHotspot = onSelectHotspot;
  stateRef.current.onHoverChange = onHoverChange;
  stateRef.current.onProjectedHotspotsChange = onProjectedHotspotsChange;

  // Initialize WebGLRenderer & studio scene once
  useEffect(() => {
    const mount = containerRef.current;
    if (!mount) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = Math.max(mount.clientWidth, 320);
    const height = Math.max(mount.clientHeight, 360);
    renderer.setSize(width, height, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.setAttribute(
      'aria-label',
      'Lienzo interactivo 3D de modelos moleculares africanos (arrastre para rotar, rueda para acercar)'
    );
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const bgHex = 0x15181e;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.032);

    // Mandatory studio environment reflection via RoomEnvironment on all devices
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 80);
    camera.position.set(...model.defaultCamera.position);

    // 3-point warm/cool studio lighting rig
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.2);
    keyLight.position.set(6, 9, 7);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const hemiFill = new THREE.HemisphereLight(0xb8d4f4, 0x2a241d, 0.85);
    scene.add(hemiFill);

    const rimLight = new THREE.DirectionalLight(0x7eb6ff, 1.15);
    rimLight.position.set(-7, 3, -6);
    scene.add(rimLight);

    // Grounded contact shadow plane + subtle drafting reference ring
    const shadowTex = createContactShadowTexture();
    const contactPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(7.2, 7.2),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.72,
      })
    );
    contactPlane.rotation.x = -Math.PI / 2;
    contactPlane.position.y = -3.72;
    scene.add(contactPlane);

    const stageRingGeo = new THREE.RingGeometry(2.65, 2.71, 64);
    const stageRingMat = new THREE.MeshBasicMaterial({
      color: 0x3b4250,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const stageRing = new THREE.Mesh(stageRingGeo, stageRingMat);
    stageRing.rotation.x = -Math.PI / 2;
    stageRing.position.y = -3.7;
    scene.add(stageRing);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 3.2;
    controls.maxDistance = 17;
    controls.enablePan = true;
    controls.target.set(...model.defaultCamera.target);
    controls.update();

    // Camera transition state (damped, cancelled immediately on manual OrbitControls start)
    let cameraTransition: { pos: THREE.Vector3; target: THREE.Vector3 } | null = null;
    const cancelCameraTransition = () => {
      cameraTransition = null;
    };
    controls.addEventListener('start', cancelCameraTransition);

    let currentHandle: BuiltModelHandle | null = null;
    const modelHost = new THREE.Group();
    scene.add(modelHost);

    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);

    let disposed = false;
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const status = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
          if (status === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function applyExplodeAndSelection(delta: number): boolean {
      let needsMore = false;
      const st = stateRef.current;

      // Damped exploded view
      const nextExplode = THREE.MathUtils.damp(st.explodeCurrent, st.explodeTarget, 7, delta);
      if (Math.abs(nextExplode - st.explodeTarget) > 0.001) {
        st.explodeCurrent = nextExplode;
        needsMore = true;
      } else {
        st.explodeCurrent = st.explodeTarget;
      }

      if (currentHandle) {
        currentHandle.explodables.forEach((part) => {
          _vecA.copy(part.explodeDir).multiplyScalar(st.explodeCurrent);
          part.obj.position.copy(part.basePos).add(_vecA);
        });

        // Highlight selected or hovered hotspot ring smoothly
        currentHandle.hotspotRings.forEach((ring, id) => {
          const isSel = id === st.selectedHotspotId;
          const isHov = id === st.hoveredHotspotId;
          const targetScale = isSel ? 1.45 : isHov ? 1.24 : 1.0;
          const s = THREE.MathUtils.damp(ring.scale.x, targetScale, 8, delta);
          ring.scale.setScalar(s);
          ring.lookAt(camera.position);
          if (Math.abs(s - targetScale) > 0.01) needsMore = true;
        });
      }

      // Smooth damped camera preset / hotspot fly-to
      if (cameraTransition) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, cameraTransition.pos.x, 6.5, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, cameraTransition.pos.y, 6.5, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraTransition.pos.z, 6.5, delta);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, cameraTransition.target.x, 6.5, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, cameraTransition.target.y, 6.5, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, cameraTransition.target.z, 6.5, delta);

        const posDist = camera.position.distanceTo(cameraTransition.pos);
        const tgtDist = controls.target.distanceTo(cameraTransition.target);
        if (posDist < 0.03 && tgtDist < 0.03) {
          camera.position.copy(cameraTransition.pos);
          controls.target.copy(cameraTransition.target);
          cameraTransition = null;
        } else {
          needsMore = true;
        }
      }

      // Gentle auto-rotation only when GPU + visible + enabled + not reduced motion
      if (st.autoRotate && st.isVisible && !isSoftwareGl && !prefersReducedMotion) {
        modelHost.rotation.y += delta * 0.24;
        needsMore = true;
      }

      return needsMore;
    }

    let lastProjW = 0;
    let lastProjH = 0;
    let lastProjected: ProjectedARPoint[] = [];

    function syncProjectedHotspots() {
      const cb = stateRef.current.onProjectedHotspotsChange;
      if (!cb || !currentHandle) return;
      const w = renderer.domElement.clientWidth;
      const h = renderer.domElement.clientHeight;
      if (w < 10 || h < 10) return;

      const next: ProjectedARPoint[] = [];
      currentHandle.hotspotRings.forEach((ring, id) => {
        if (!isObjectVisibleInHierarchy(ring)) {
          next.push({ id, x: -999, y: -999, visible: false });
          return;
        }
        ring.getWorldPosition(_projVec);
        _projVec.project(camera);
        const visible = _projVec.z >= -1 && _projVec.z <= 1;
        const x = (_projVec.x * 0.5 + 0.5) * w;
        const y = (-_projVec.y * 0.5 + 0.5) * h;
        next.push({ id, x, y, visible });
      });

      let changed = w !== lastProjW || h !== lastProjH || next.length !== lastProjected.length;
      if (!changed) {
        for (let i = 0; i < next.length; i++) {
          const a = next[i];
          const b = lastProjected[i];
          if (
            !b ||
            a.id !== b.id ||
            a.visible !== b.visible ||
            Math.abs(a.x - b.x) > 1.5 ||
            Math.abs(a.y - b.y) > 1.5
          ) {
            changed = true;
            break;
          }
        }
      }

      if (changed) {
        lastProjW = w;
        lastProjH = h;
        lastProjected = next;
        cb(next, { width: w, height: h });
      }
    }

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = window.requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        const now = performance.now();
        const delta = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        const stillMoving = applyExplodeAndSelection(delta);
        const controlsMoved = controls.update();
        renderer.render(scene, camera);
        syncProjectedHotspots();

        const done = () => {
          renderBusy = false;
          if (disposed) return;
          if (renderDirty || stillMoving || (controls.enableDamping && controlsMoved)) {
            requestRender();
          }
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    const syncVariantAndSelection = () => {
      if (currentHandle) {
        currentHandle.applyVariant(stateRef.current.alternateVariant, stateRef.current.explodeCurrent);
      }
      requestRender();
    };

    const loadModel = (spec: Molecular3DModelSpec) => {
      if (currentHandle) {
        modelHost.remove(currentHandle.root);
        currentHandle.dispose();
        currentHandle = null;
      }
      modelHost.rotation.set(0, 0, 0);
      currentHandle = buildModelById(spec);
      modelHost.add(currentHandle.root);
      currentHandle.applyVariant(stateRef.current.alternateVariant, stateRef.current.explodeCurrent);
      cameraTransition = {
        pos: new THREE.Vector3(...spec.defaultCamera.position),
        target: new THREE.Vector3(...spec.defaultCamera.target),
      };
      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
      }
      requestRender();
    };

    const flyTo = (pos: [number, number, number], target: [number, number, number]) => {
      cameraTransition = {
        pos: new THREE.Vector3(pos[0], pos[1], pos[2]),
        target: new THREE.Vector3(target[0], target[1], target[2]),
      };
      requestRender();
    };

    sceneApiRef.current = {
      loadModel,
      flyTo,
      requestRender,
      syncVariantAndSelection,
    };

    // Load initial model
    loadModel(model);

    controls.addEventListener('change', requestRender);

    // Throttled pointer hover & click raycasting on Layer 1 (hotspots) and Layer 2 (substructures)
    let lastHoverTs = 0;
    let pointerDownX = 0;
    let pointerDownY = 0;
    let hasActiveHover = false;

    const clearHover = () => {
      if (stateRef.current.hoveredHotspotId !== null) {
        stateRef.current.hoveredHotspotId = null;
        requestRender();
      }
      if (hasActiveHover) {
        hasActiveHover = false;
        stateRef.current.onHoverChange?.(null);
      }
      renderer.domElement.style.cursor = 'grab';
    };

    const updateMouseNDC = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      return rect;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownX = e.clientX;
      pointerDownY = e.clientY;
      clearHover();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.buttons !== 0) {
        clearHover();
        return;
      }
      const now = performance.now();
      if (now - lastHoverTs < 40 || !currentHandle) return;
      lastHoverTs = now;
      const rect = updateMouseNDC(e.clientX, e.clientY);
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      // 1. Prioritize clickable hotspot rings on Layer 1
      raycaster.layers.set(1);
      raycaster.setFromCamera(_mouse, camera);
      const hotspotHits = raycaster
        .intersectObjects(currentHandle.hitTargets, false)
        .filter((h) => isObjectVisibleInHierarchy(h.object));

      if (hotspotHits.length > 0) {
        const hsId = hotspotHits[0].object.userData?.hotspotId as string | undefined;
        const hs = currentHandle.spec.hotspots.find((item) => item.id === hsId);
        if (hs) {
          if (stateRef.current.hoveredHotspotId !== hs.id) {
            stateRef.current.hoveredHotspotId = hs.id;
            requestRender();
          }
          renderer.domElement.style.cursor = 'pointer';
          hasActiveHover = true;
          stateRef.current.onHoverChange?.({
            id: hs.id,
            kind: 'hotspot',
            title: hs.label,
            category: `Locus diagnóstico · ${hs.shortTag}`,
            accent: hs.accent,
            biologicalFunction: hs.biologicalFunction,
            paleoSignificance: hs.summary,
            x: relX,
            y: relY,
            containerWidth: rect.width,
            containerHeight: rect.height,
            clickableHotspotId: hs.id,
          });
          return;
        }
      }

      // Reset hotspot hover scale if cursor left the ring
      if (stateRef.current.hoveredHotspotId !== null) {
        stateRef.current.hoveredHotspotId = null;
        requestRender();
      }

      // 2. Inspect 3D molecular substructures on Layer 2
      raycaster.layers.set(2);
      raycaster.setFromCamera(_mouse, camera);
      const structureHits = raycaster
        .intersectObjects(currentHandle.hoverTargets, false)
        .filter((h) => isObjectVisibleInHierarchy(h.object));

      if (structureHits.length > 0) {
        const subId = structureHits[0].object.userData?.substructureId as string | undefined;
        const sub = subId ? currentHandle.spec.substructures[subId] : undefined;
        if (sub) {
          const useAlt = stateRef.current.alternateVariant;
          renderer.domElement.style.cursor = sub.relatedHotspotId ? 'pointer' : 'help';
          hasActiveHover = true;
          stateRef.current.onHoverChange?.({
            id: sub.id,
            kind: 'structure',
            title: (useAlt && sub.alternateTitle) || sub.title,
            category: sub.category,
            accent: sub.accent,
            biologicalFunction:
              (useAlt && sub.alternateBiologicalFunction) || sub.biologicalFunction,
            paleoSignificance:
              (useAlt && sub.alternatePaleoSignificance) || sub.paleoSignificance,
            x: relX,
            y: relY,
            containerWidth: rect.width,
            containerHeight: rect.height,
            clickableHotspotId: sub.relatedHotspotId,
          });
          return;
        }
      }

      clearHover();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!currentHandle) return;
      const moved = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
      if (moved > 6) return; // Ignore orbit drag releases
      updateMouseNDC(e.clientX, e.clientY);

      raycaster.layers.set(1);
      raycaster.setFromCamera(_mouse, camera);
      const hotspotHits = raycaster
        .intersectObjects(currentHandle.hitTargets, false)
        .filter((h) => isObjectVisibleInHierarchy(h.object));
      if (hotspotHits.length > 0) {
        const hsId = hotspotHits[0].object.userData?.hotspotId as string | undefined;
        if (hsId) {
          stateRef.current.onSelectHotspot(hsId);
          return;
        }
      }

      // Clicking directly on a tagged molecular substructure focuses its related locus
      raycaster.layers.set(2);
      raycaster.setFromCamera(_mouse, camera);
      const structureHits = raycaster
        .intersectObjects(currentHandle.hoverTargets, false)
        .filter((h) => isObjectVisibleInHierarchy(h.object));
      if (structureHits.length > 0) {
        const subId = structureHits[0].object.userData?.substructureId as string | undefined;
        const sub = subId ? currentHandle.spec.substructures[subId] : undefined;
        if (sub?.relatedHotspotId) {
          stateRef.current.onSelectHotspot(sub.relatedHotspotId);
        }
      }
    };

    const onPointerLeave = () => {
      clearHover();
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      clearHover();
      setWebglUnavailable(true);
    };
    const onContextRestored = () => {
      setWebglUnavailable(false);
      requestRender();
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    // ResizeObserver for responsive container
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || disposed) return;
      const w = Math.max(Math.round(entry.contentRect.width), 280);
      const h = Math.max(Math.round(entry.contentRect.height), 320);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      requestRender();
    });
    resizeObserver.observe(mount);

    // Pause idle rotation when scrolled off-screen
    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              stateRef.current.isVisible = entries[0]?.isIntersecting ?? true;
              if (stateRef.current.isVisible) requestRender();
            },
            { threshold: 0.05 }
          )
        : null;
    io?.observe(mount);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      resizeObserver.disconnect();
      io?.disconnect();
      controls.removeEventListener('change', requestRender);
      controls.removeEventListener('start', cancelCameraTransition);
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      if (currentHandle) {
        currentHandle.dispose();
      }
      shadowTex.dispose();
      contactPlane.geometry.dispose();
      (contactPlane.material as THREE.Material).dispose();
      stageRingGeo.dispose();
      stageRingMat.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
      sceneApiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap 3D model cleanly without recreating the WebGLRenderer
  useEffect(() => {
    if (stateRef.current.modelId !== model.id) {
      stateRef.current.modelId = model.id;
      sceneApiRef.current?.loadModel(model);
    }
  }, [model]);

  // Sync variant, explode slider, autoRotate, and hotspot selection
  useEffect(() => {
    sceneApiRef.current?.syncVariantAndSelection();
  }, [explodeAmount, alternateVariant, autoRotate, selectedHotspotId]);

  // Handle explicit camera preset commands
  useEffect(() => {
    if (!cameraCommand) return;
    const preset = model.cameraPresets[cameraCommand.preset];
    if (preset) {
      sceneApiRef.current?.flyTo(preset.position, preset.target);
    }
  }, [cameraCommand, model]);

  // Fly camera gently toward newly selected hotspot
  useEffect(() => {
    if (!selectedHotspotId) return;
    const hs = model.hotspots.find((h) => h.id === selectedHotspotId);
    if (!hs) return;
    _vecB.set(
      hs.position[0] + hs.cameraOffset[0],
      hs.position[1] + hs.cameraOffset[1],
      hs.position[2] + hs.cameraOffset[2]
    );
    sceneApiRef.current?.flyTo([_vecB.x, _vecB.y, _vecB.z], hs.position);
  }, [selectedHotspotId, model]);

  if (webglUnavailable) {
    return (
      <div className="w-full h-full bg-[#15181e] text-[#f3f2ed] flex flex-col items-center justify-center p-6 text-center gap-3">
        <div className="font-mono text-xs text-[#d98c16]">
          Vista esquemática 2D (WebGL no disponible en este navegador)
        </div>
        <div className="font-display text-lg font-semibold max-w-md">{model.title}</div>
        <p className="text-xs text-[#b7bcc6] max-w-md leading-relaxed">{model.placeholderNote}</p>
        <div className="font-mono text-xs bg-[#1e232c] border border-[#343b49] px-3 py-2 text-[#e8eaee]">
          {model.sequenceReadout}
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
}
