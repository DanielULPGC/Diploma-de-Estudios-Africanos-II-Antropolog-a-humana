import * as THREE from 'three';

export interface LithicSpecimenVisualOptions {
  material: 'limestone' | 'sandstone';
  modified: boolean;
  limestoneTex: THREE.CanvasTexture;
  sandstoneTex: THREE.CanvasTexture;
  shadowTex?: THREE.CanvasTexture;
  isSoftwareGl?: boolean;
}

/**
 * Builds the characteristic 6x6x4 cm beveled experimental lithic block geometry
 * grounded strictly at y = 0 (local units: ~0.87 x 0.87 x 0.53).
 */
export function createBeveledLithicGeometry(): THREE.BufferGeometry {
  const half = 0.39;
  const radius = 0.06;
  const shape = new THREE.Shape();
  shape.moveTo(-half + radius, -half);
  shape.lineTo(half - radius, -half);
  shape.quadraticCurveTo(half, -half, half, -half + radius);
  shape.lineTo(half, half - radius);
  shape.quadraticCurveTo(half, half, half - radius, half);
  shape.lineTo(-half + radius, half);
  shape.quadraticCurveTo(-half, half, -half, half - radius);
  shape.lineTo(-half, -half + radius);
  shape.quadraticCurveTo(-half, -half, -half + radius, -half);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.44,
    bevelEnabled: true,
    bevelThickness: 0.045,
    bevelSize: 0.045,
    bevelSegments: 3,
    curveSegments: 8,
  });
  geo.rotateX(-Math.PI / 2);
  geo.computeBoundingBox();
  if (geo.boundingBox) {
    const minY = geo.boundingBox.min.y;
    geo.translate(0, -minY, 0);
  }
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds a complete standalone 3D lithic specimen (stone body + basal lip + optional
 * percussive wear crater, micro-pits & chalk powder flecks) for WebXR / AR desk projection.
 * Scaled cleanly so callers can apply real-world physical scaling (e.g. 0.069 -> 6x6x4 cm).
 */
export function buildStandaloneLithicSpecimen(opts: LithicSpecimenVisualOptions): {
  root: THREE.Group;
  wearGroup: THREE.Group;
} {
  const {
    material,
    modified,
    limestoneTex,
    sandstoneTex,
    shadowTex,
    isSoftwareGl = false,
  } = opts;
  const isLimestone = material === 'limestone';
  const root = new THREE.Group();

  const stoneGeo = createBeveledLithicGeometry();
  const blockMat = new THREE.MeshStandardMaterial({
    map: isLimestone ? limestoneTex : sandstoneTex,
    color: isLimestone ? 0xf5efe2 : 0xdfb9a3,
    roughness: isLimestone ? 0.86 : 0.74,
    metalness: isLimestone ? 0.04 : 0.08,
  });

  const blockMesh = new THREE.Mesh(stoneGeo, blockMat);
  blockMesh.castShadow = !isSoftwareGl;
  blockMesh.receiveShadow = !isSoftwareGl;
  root.add(blockMesh);

  // Dark mineral basal lip for grounded contact
  const baseLipMat = new THREE.MeshStandardMaterial({
    color: isLimestone ? 0xa3957c : 0x623b2a,
    roughness: 0.94,
    metalness: 0.02,
  });
  const baseLip = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.03, 0.84), baseLipMat);
  baseLip.position.y = 0.015;
  baseLip.receiveShadow = !isSoftwareGl;
  root.add(baseLip);

  // Subtle grounded contact shadow so the specimen visually rests on a real desk in WebXR / AR
  if (shadowTex) {
    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.38, 1.38),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.56,
        depthWrite: false,
      })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.002;
    root.add(contactShadow);
  }

  const wearGroup = new THREE.Group();
  if (modified) {
    const topY = 0.532;
    const craterRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.165, 0.024, 10, 28),
      new THREE.MeshStandardMaterial({
        color: isLimestone ? 0xc2b398 : 0x7d4c37,
        roughness: 0.92,
        metalness: 0.02,
      })
    );
    craterRim.rotation.x = Math.PI / 2;
    craterRim.position.set(0, topY, 0);
    wearGroup.add(craterRim);

    const pitInner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.155, 0.11, 0.022, 24),
      new THREE.MeshStandardMaterial({
        color: isLimestone ? 0x8f8068 : 0x523021,
        roughness: 0.96,
        metalness: 0.02,
      })
    );
    pitInner.position.set(0, topY - 0.006, 0);
    wearGroup.add(pitInner);

    const pitOffsets: Array<[number, number, number, boolean]> = [
      [-0.07, -0.04, 0.024, true],
      [0.05, 0.03, 0.028, true],
      [0.01, -0.06, 0.02, false],
      [0.08, -0.02, 0.018, true],
      [-0.04, 0.06, 0.022, false],
      [0.02, 0.01, 0.026, true],
      [-0.09, 0.02, 0.017, false],
    ];
    const darkFleckMat = new THREE.MeshStandardMaterial({
      color: 0x26211c,
      roughness: 0.95,
      metalness: 0.04,
    });
    const chalkFleckMat = new THREE.MeshStandardMaterial({
      color: 0xf4eee0,
      roughness: 0.9,
      metalness: 0.0,
    });
    const fleckGeo = new THREE.DodecahedronGeometry(1, 0);
    pitOffsets.forEach(([ox, oz, rad, dark]) => {
      const m = new THREE.Mesh(fleckGeo, dark ? darkFleckMat : chalkFleckMat);
      m.position.set(ox, topY + 0.008, oz);
      m.scale.set(rad, rad * 0.45, rad);
      wearGroup.add(m);
    });
  }
  root.add(wearGroup);

  return { root, wearGroup };
}

/**
 * Builds a physical 6 cm archaeological black-and-white scale bar next to the lithic block
 * (local length 0.87 matches the 6 cm width of the beveled block).
 */
export function buildArchaeologicalScaleBar(): THREE.Group {
  const group = new THREE.Group();
  const segCount = 6;
  const totalLen = 0.87;
  const segLen = totalLen / segCount;

  const blackMat = new THREE.MeshStandardMaterial({ color: 0x14171c, roughness: 0.55 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf5f2ea, roughness: 0.55 });

  for (let i = 0; i < segCount; i++) {
    const seg = new THREE.Mesh(
      new THREE.BoxGeometry(segLen, 0.016, 0.08),
      i % 2 === 0 ? blackMat : whiteMat
    );
    seg.position.set(-totalLen / 2 + segLen * (i + 0.5), 0.008, 0.64);
    group.add(seg);
  }
  return group;
}
