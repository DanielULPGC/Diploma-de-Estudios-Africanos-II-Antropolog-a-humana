import * as THREE from 'three';

export interface RunningTelemetryFrame {
  phase: number;
  phaseIndex: 0 | 1 | 2 | 3;
  homoPelvisLoad: number;
  homoSpineLoad: number;
  primatePelvisLoad: number;
  primateSpineLoad: number;
  homoPelvicTiltDeg: number;
  primatePelvicTiltDeg: number;
  homoTrunkPitchDeg: number;
  primateTrunkPitchDeg: number;
}

export interface ArticulatedComparativeRig {
  species: 'homo' | 'primate';
  root: THREE.Group;
  skeletonGroup: THREE.Group;
  tendonsGroup: THREE.Group;
  vectorsGroup: THREE.Group;
  heatmapAuraGroup: THREE.Group;
  updateGait: (phase: number, showHeatmap: boolean, superpositionRatio: number) => void;
}

// Pre-allocated math helpers for zero per-frame garbage collection
const _heatLow = new THREE.Color('#156f55'); // Optimal load (Forest)
const _heatMid = new THREE.Color('#d49a1a'); // Moderate amortized load (Amber)
const _heatHigh = new THREE.Color('#d95216'); // High mechanical torque (Ochre bright)
const _heatPeak = new THREE.Color('#b42318'); // Critical shear / overload (Crimson)
const _tmpColor = new THREE.Color();
const _tmpEmissive = new THREE.Color();
const _homoBaseBone = new THREE.Color(0xf5edd9);
const _primateBaseBone = new THREE.Color(0x74b0ed);
const _upAxis = new THREE.Vector3(0, 1, 0);
const _segDir = new THREE.Vector3();
const _segMid = new THREE.Vector3();

/**
 * Evaluates a smooth 4-stop perceptual heatmap ramp for biomechanical stress [0..1].
 */
export function sampleBiomechanicalHeatmapColor(intensity: number, out: THREE.Color): THREE.Color {
  const t = Math.max(0, Math.min(1, intensity));
  if (t < 0.35) {
    return out.copy(_heatLow).lerp(_heatMid, t / 0.35);
  }
  if (t < 0.72) {
    return out.copy(_heatMid).lerp(_heatHigh, (t - 0.35) / 0.37);
  }
  return out.copy(_heatHigh).lerp(_heatPeak, (t - 0.72) / 0.28);
}

/**
 * Computes instantaneous biomechanical loads and kinematic angles for both
 * Homo sapiens and Pan troglodytes across a full running cycle phase in [0, 1).
 *
 * Cycle symmetry: right foot strike near phase = 0.08, left foot strike near phase = 0.58.
 */
export function evaluateRunningTelemetry(phase: number): RunningTelemetryFrame {
  const wrapped = ((phase % 1) + 1) % 1;
  // Half-cycle symmetric stance pulse (two foot strikes per full stride)
  const strideHalf = (wrapped * 2) % 1;

  // Foot-strike impact impulse peaking around strideHalf ~ 0.14
  const impactWave = Math.exp(-Math.pow((strideHalf - 0.14) / 0.13, 2));
  // Mid-stance vertical single-leg support peaking around strideHalf ~ 0.36
  const stanceWave = Math.exp(-Math.pow((strideHalf - 0.36) / 0.17, 2));
  // Toe-off propulsive peak around strideHalf ~ 0.58
  const pushWave = Math.exp(-Math.pow((strideHalf - 0.58) / 0.14, 2));

  // Homo sapiens: basin pelvis + lumbar S-lordosis + elastic Achilles attenuate peak stress
  const homoPelvisLoad = Math.min(
    0.58,
    0.18 + 0.16 * impactWave + 0.22 * stanceWave + 0.07 * pushWave
  );
  const homoSpineLoad = Math.min(
    0.52,
    0.15 + 0.2 * impactWave + 0.15 * stanceWave + 0.04 * pushWave
  );

  // Pan troglodytes: tall flat coronal ilia + forward-pitched C-spine + BHBK gait spike pelvic & lumbar shear
  const primatePelvisLoad = Math.min(
    0.98,
    0.42 + 0.28 * impactWave + 0.34 * stanceWave + 0.14 * pushWave
  );
  const primateSpineLoad = Math.min(
    0.96,
    0.38 + 0.34 * impactWave + 0.26 * stanceWave + 0.12 * pushWave
  );

  // Pelvic obliquity (Trendelenburg drop) & sagittal trunk forward pitch
  const latWave = Math.sin(wrapped * Math.PI * 2);
  const homoPelvicTiltDeg = Math.abs(latWave) * 3.8 + 0.6;
  const primatePelvicTiltDeg = Math.abs(latWave) * 11.4 + 2.2;

  const homoTrunkPitchDeg = 6.2 + 2.1 * impactWave;
  const primateTrunkPitchDeg = 23.5 + 5.8 * impactWave + 2.2 * stanceWave;

  let phaseIndex: 0 | 1 | 2 | 3 = 3;
  if (strideHalf < 0.22) phaseIndex = 0;
  else if (strideHalf < 0.46) phaseIndex = 1;
  else if (strideHalf < 0.68) phaseIndex = 2;
  else phaseIndex = 3;

  return {
    phase: wrapped,
    phaseIndex,
    homoPelvisLoad,
    homoSpineLoad,
    primatePelvisLoad,
    primateSpineLoad,
    homoPelvicTiltDeg,
    primatePelvicTiltDeg,
    homoTrunkPitchDeg,
    primateTrunkPitchDeg,
  };
}

function addLocalBoneSegment(
  parent: THREE.Object3D,
  from: THREE.Vector3,
  to: THREE.Vector3,
  rTop: number,
  rBot: number,
  mat: THREE.Material,
  castShadow: boolean
): THREE.Mesh {
  _segDir.subVectors(to, from);
  const len = Math.max(_segDir.length(), 0.001);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, len, 12), mat);
  _segMid.copy(from).add(to).multiplyScalar(0.5);
  mesh.position.copy(_segMid);
  mesh.quaternion.setFromUnitVectors(_upAxis, _segDir.normalize());
  mesh.castShadow = castShadow;
  mesh.receiveShadow = castShadow;
  parent.add(mesh);
  return mesh;
}

/**
 * Builds an articulated, running-capable comparative osteological rig for either
 * Homo sapiens (bipedal endurance runner) or Pan troglodytes (non-human primate)
 * with dynamic PBR heatmaps mapped across pelvic blades, sacroiliac joint, and vertebral column.
 */
export function buildArticulatedComparativeRig(
  species: 'homo' | 'primate',
  boneTex: THREE.CanvasTexture,
  shadowTex: THREE.CanvasTexture,
  isSoftwareGl: boolean
): ArticulatedComparativeRig {
  const isHomo = species === 'homo';
  const castShadow = !isSoftwareGl;

  const root = new THREE.Group();
  const skeletonGroup = new THREE.Group();
  const tendonsGroup = new THREE.Group();
  const vectorsGroup = new THREE.Group();
  const heatmapAuraGroup = new THREE.Group();
  root.add(skeletonGroup, tendonsGroup, vectorsGroup, heatmapAuraGroup);

  // Base osteological materials (primate renders in luminous steel-blue for crisp separation against dark studio & ivory Homo)
  const boneMat = new THREE.MeshStandardMaterial({
    map: boneTex,
    color: isHomo ? _homoBaseBone.clone() : _primateBaseBone.clone(),
    roughness: isHomo ? 0.56 : 0.48,
    metalness: isHomo ? 0.05 : 0.1,
    transparent: !isHomo,
    opacity: isHomo ? 0.98 : 0.78,
  });

  const jointMat = new THREE.MeshStandardMaterial({
    color: isHomo ? 0xd9ccb2 : 0x5c96d4,
    roughness: 0.46,
    metalness: 0.08,
    transparent: !isHomo,
    opacity: isHomo ? 0.98 : 0.78,
  });

  const tendonOchreMat = new THREE.MeshStandardMaterial({
    color: isHomo ? 0xd95522 : 0x4b81bc,
    roughness: 0.42,
    metalness: 0.08,
    transparent: !isHomo,
    opacity: isHomo ? 0.95 : 0.62,
  });

  const tendonForestMat = new THREE.MeshStandardMaterial({
    color: isHomo ? 0x269e77 : 0x4f8bc2,
    roughness: 0.44,
    metalness: 0.06,
    transparent: !isHomo,
    opacity: isHomo ? 0.94 : 0.6,
  });

  const vectorMat = new THREE.MeshStandardMaterial({
    color: isHomo ? 0xe0602b : 0x5ba4f5,
    roughness: 0.34,
    metalness: 0.12,
    transparent: true,
    opacity: isHomo ? 0.94 : 0.82,
  });

  // Dynamic PBR heatmap materials for pelvis (sacrum + left/right ilia + hip sockets)
  const pelvisCenterHeatMat = new THREE.MeshStandardMaterial({
    map: boneTex,
    color: isHomo ? _homoBaseBone.clone() : _primateBaseBone.clone(),
    emissive: new THREE.Color(0x000000),
    emissiveIntensity: 0,
    roughness: 0.46,
    metalness: 0.08,
    transparent: !isHomo,
    opacity: isHomo ? 0.99 : 0.92,
  });
  const pelvisLeftHeatMat = pelvisCenterHeatMat.clone();
  const pelvisRightHeatMat = pelvisCenterHeatMat.clone();

  // Dynamic PBR heatmap materials for spine tube + 12 vertebral segments (spatial load gradient!)
  const spineCoreHeatMat = pelvisCenterHeatMat.clone();
  const vertebraHeatMats: THREE.MeshStandardMaterial[] = [];
  for (let i = 0; i < 12; i++) {
    vertebraHeatMats.push(pelvisCenterHeatMat.clone());
  }

  // Ground contact shadow beneath feet
  const shadowMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.15, 0.95),
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: isHomo ? 0.52 : 0.36,
      depthWrite: false,
    })
  );
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = isHomo ? 0.004 : 0.002;
  root.add(shadowMesh);

  // Anatomical proportions grounded around hip pivot height
  const baseHipY = isHomo ? 1.48 : 1.02;
  const hipHalfW = isHomo ? 0.21 : 0.245;
  const thighLen = isHomo ? 0.72 : 0.48;
  const shinLen = isHomo ? 0.68 : 0.44;
  const torsoHeight = isHomo ? 0.88 : 0.86;
  const shoulderHalfW = isHomo ? 0.305 : 0.315;
  const upperArmLen = isHomo ? 0.48 : 0.58;
  const forearmLen = isHomo ? 0.42 : 0.56;

  // Pelvis root pivot (moves vertically, tilts laterally, and rotates axially during running)
  const pelvisPivot = new THREE.Group();
  pelvisPivot.position.set(0, baseHipY, 0);
  skeletonGroup.add(pelvisPivot);

  // ======================== PELVIS (DYNAMIC HEATMAP ZONE) ========================
  const pelvisGeometryGroup = new THREE.Group();
  pelvisPivot.add(pelvisGeometryGroup);

  // Sacrum (wider & shorter in Homo; narrower & deeper in Pan)
  const sacrum = new THREE.Mesh(
    new THREE.ConeGeometry(isHomo ? 0.11 : 0.082, isHomo ? 0.21 : 0.26, 6),
    pelvisCenterHeatMat
  );
  sacrum.rotation.x = Math.PI;
  sacrum.position.set(0, isHomo ? 0.03 : 0.08, -0.065);
  sacrum.castShadow = castShadow;
  pelvisGeometryGroup.add(sacrum);

  // Left & right iliac blades + ischial tuberosities
  [-1, 1].forEach((side) => {
    const sideMat = side < 0 ? pelvisLeftHeatMat : pelvisRightHeatMat;

    if (isHomo) {
      // Short, broad, curved basin-shaped Homo sapiens ilium
      const ilium = new THREE.Mesh(
        new THREE.CylinderGeometry(0.135, 0.088, 0.23, 14, 1, false, 0, Math.PI * 1.15),
        sideMat
      );
      ilium.position.set(side * (hipHalfW * 0.72), 0.06, 0.0);
      ilium.rotation.y = side > 0 ? -Math.PI * 0.32 : Math.PI * 0.68;
      ilium.rotation.z = side * -0.18;
      ilium.castShadow = castShadow;
      pelvisGeometryGroup.add(ilium);

      // Anterior iliac crest rim
      const crest = new THREE.Mesh(
        new THREE.TorusGeometry(0.125, 0.02, 8, 18, Math.PI * 0.9),
        sideMat
      );
      crest.rotation.x = Math.PI / 2;
      crest.rotation.z = side > 0 ? -0.45 : Math.PI - 0.45;
      crest.position.set(side * (hipHalfW * 0.74), 0.17, 0.01);
      pelvisGeometryGroup.add(crest);
    } else {
      // Tall, narrow, flat coronally-oriented Pan troglodytes iliac blade (~1.9x height!)
      const tallIlium = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.44, 0.042), sideMat);
      tallIlium.position.set(side * (hipHalfW * 0.68), 0.19, -0.055);
      tallIlium.rotation.y = side * -0.18;
      tallIlium.rotation.z = side * -0.11;
      tallIlium.castShadow = castShadow;
      pelvisGeometryGroup.add(tallIlium);

      // Long chimpanzee ischium extending downward posteriorly (high hamstring lever)
      const ischium = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.044, 0.2, 10), sideMat);
      ischium.position.set(side * (hipHalfW * 0.56), -0.1, -0.065);
      ischium.rotation.x = 0.24;
      pelvisGeometryGroup.add(ischium);
    }

    // Pubic symphysis bridge
    const pubis = new THREE.Mesh(new THREE.BoxGeometry(hipHalfW * 0.88, 0.046, 0.042), sideMat);
    pubis.position.set(side * (hipHalfW * 0.42), -0.05, 0.07);
    pubis.rotation.y = side * -0.22;
    pelvisGeometryGroup.add(pubis);
  });

  // ======================== SPINE & THORAX (DYNAMIC HEATMAP ZONE) ========================
  const spinePivot = new THREE.Group();
  spinePivot.position.set(0, 0.06, -0.04);
  pelvisPivot.add(spinePivot);

  // S-shaped lumbar lordosis in Homo sapiens vs C-shaped kyphotic arch in Pan troglodytes
  const spineCurve = isHomo
    ? new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.0, -0.02), // S1
        new THREE.Vector3(0, 0.24, 0.065), // L3 anterior lordosis peak
        new THREE.Vector3(0, 0.54, -0.055), // Mid-thoracic kyphosis
        new THREE.Vector3(0, torsoHeight - 0.08, -0.02), // T1/C7
        new THREE.Vector3(0, torsoHeight + 0.14, 0.015), // Atlas C1
      ])
    : new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.02, -0.02), // S1 entrapped between tall iliac blades
        new THREE.Vector3(0, 0.24, -0.055), // Flat/kyphotic entrapped lumbar (NO lordosis!)
        new THREE.Vector3(0, 0.54, -0.065), // Pronounced C-curve thoracic arch
        new THREE.Vector3(0, torsoHeight - 0.08, 0.02), // Forward-pitched upper spine
        new THREE.Vector3(0, torsoHeight + 0.11, 0.1), // Posteriorly offset skull base
      ]);

  const spineTube = new THREE.Mesh(
    new THREE.TubeGeometry(spineCurve, 28, isHomo ? 0.036 : 0.038, 12, false),
    spineCoreHeatMat
  );
  spineTube.castShadow = castShadow;
  spinePivot.add(spineTube);

  // 12 individual vertebral segments with independent heatmap materials for spatial shockwave gradient
  const discGeo = new THREE.CylinderGeometry(0.052, 0.055, 0.032, 12);
  const spinousGeo = new THREE.BoxGeometry(0.016, 0.024, 0.055);
  for (let i = 0; i < 12; i++) {
    const t = (i + 0.5) / 12.5;
    const pt = spineCurve.getPoint(t);
    const tang = spineCurve.getTangent(t);
    const mat = vertebraHeatMats[i];
    const disc = new THREE.Mesh(discGeo, mat);
    disc.position.copy(pt);
    disc.quaternion.setFromUnitVectors(_upAxis, tang);
    spinePivot.add(disc);

    // Dorsal spinous process for realistic osteological silhouette
    const proc = new THREE.Mesh(spinousGeo, mat);
    proc.position.set(pt.x, pt.y, pt.z - 0.042);
    spinePivot.add(proc);
  }

  // Thorax counter-rotation pivot (Homo counter-rotates freely via mobile waist; Pan rotates stiffly)
  const thoraxPivot = new THREE.Group();
  thoraxPivot.position.set(0, 0.36, 0);
  spinePivot.add(thoraxPivot);

  // Ribcage (barrel-shaped in Homo vs wide funnel-shaped flaring down to tall ilia in Pan)
  for (let r = 0; r < 6; r++) {
    const frac = r / 5;
    const ry = torsoHeight - 0.42 - frac * (isHomo ? 0.4 : 0.44);
    const rx = isHomo ? 0.225 - Math.abs(frac - 0.45) * 0.045 : 0.18 + frac * 0.11;
    const rz = isHomo ? 0.145 : 0.155 + frac * 0.035;
    const rib = new THREE.Mesh(new THREE.TorusGeometry(1, 0.015 / rx, 8, 24), boneMat);
    rib.rotation.x = Math.PI / 2 + (isHomo ? 0.07 : 0.14);
    rib.position.set(0, ry, isHomo ? 0.02 : 0.015);
    rib.scale.set(rx, rz, 1);
    rib.castShadow = castShadow;
    thoraxPivot.add(rib);
  }

  // Sternum
  const sternum = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, isHomo ? 0.32 : 0.29, 0.024),
    boneMat
  );
  sternum.position.set(0, torsoHeight - 0.6, isHomo ? 0.16 : 0.17);
  thoraxPivot.add(sternum);

  // Head & Cranium (anterior foramen magnum in Homo vs posterior foramen + prognathic muzzle in Pan)
  const headPivot = new THREE.Group();
  headPivot.position.set(0, torsoHeight - 0.14, isHomo ? 0.03 : 0.11);
  thoraxPivot.add(headPivot);

  const cranium = new THREE.Mesh(
    new THREE.SphereGeometry(isHomo ? 0.185 : 0.148, 20, 16),
    boneMat
  );
  cranium.scale.set(0.88, isHomo ? 1.04 : 0.82, isHomo ? 1.08 : 1.06);
  cranium.position.set(0, 0.12, isHomo ? 0.0 : -0.02);
  cranium.castShadow = castShadow;
  headPivot.add(cranium);

  const face = new THREE.Mesh(
    new THREE.BoxGeometry(0.165, isHomo ? 0.17 : 0.18, isHomo ? 0.12 : 0.21),
    boneMat
  );
  face.position.set(0, 0.02, isHomo ? 0.1 : 0.12);
  face.rotation.x = isHomo ? 0.05 : -0.22;
  headPivot.add(face);

  // Brow ridge on primate for instant morphological distinction
  if (!isHomo) {
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.036, 0.065), boneMat);
    brow.position.set(0, 0.11, 0.145);
    headPivot.add(brow);
  }

  // Articulated Arms
  interface ArmJoints {
    shoulderPivot: THREE.Group;
    elbowPivot: THREE.Group;
  }
  const arms: ArmJoints[] = [];
  [-1, 1].forEach((side) => {
    const shY = isHomo ? torsoHeight - 0.42 : torsoHeight - 0.36;
    addLocalBoneSegment(
      thoraxPivot,
      new THREE.Vector3(side * 0.04, shY + 0.01, 0.13),
      new THREE.Vector3(side * shoulderHalfW, shY, 0.01),
      0.02,
      0.018,
      boneMat,
      castShadow
    );

    const shoulderPivot = new THREE.Group();
    shoulderPivot.position.set(side * shoulderHalfW, shY, 0.01);
    thoraxPivot.add(shoulderPivot);

    const shBall = new THREE.Mesh(new THREE.SphereGeometry(0.052, 12, 12), jointMat);
    shoulderPivot.add(shBall);

    addLocalBoneSegment(
      shoulderPivot,
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -upperArmLen, 0),
      0.034,
      0.028,
      boneMat,
      castShadow
    );

    const elbowPivot = new THREE.Group();
    elbowPivot.position.set(0, -upperArmLen, 0);
    shoulderPivot.add(elbowPivot);

    const elbBall = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 12), jointMat);
    elbowPivot.add(elbBall);

    addLocalBoneSegment(
      elbowPivot,
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -forearmLen, 0),
      0.028,
      0.022,
      boneMat,
      castShadow
    );

    const hand = new THREE.Mesh(
      new THREE.BoxGeometry(0.052, isHomo ? 0.12 : 0.17, 0.034),
      boneMat
    );
    hand.position.set(0, -forearmLen - (isHomo ? 0.06 : 0.09), 0.01);
    elbowPivot.add(hand);

    arms.push({ shoulderPivot, elbowPivot });
  });

  // ======================== ARTICULATED LOWER LIMBS ========================
  interface LegJoints {
    hipPivot: THREE.Group;
    kneePivot: THREE.Group;
    anklePivot: THREE.Group;
  }
  const legs: LegJoints[] = [];

  [-1, 1].forEach((side) => {
    const hipPivot = new THREE.Group();
    hipPivot.position.set(side * hipHalfW, -0.02, 0);
    pelvisPivot.add(hipPivot);

    const hipBall = new THREE.Mesh(new THREE.SphereGeometry(0.058, 12, 12), jointMat);
    hipPivot.add(hipBall);

    // Femoral valgus convergence in Homo vs straight/slightly varus femur in Pan
    const kneeLocalX = isHomo ? -side * 0.105 : side * 0.015;
    const kneePos = new THREE.Vector3(kneeLocalX, -thighLen, 0);

    addLocalBoneSegment(
      hipPivot,
      new THREE.Vector3(side * 0.045, -0.02, 0),
      kneePos,
      0.045,
      0.039,
      boneMat,
      castShadow
    );

    const kneePivot = new THREE.Group();
    kneePivot.position.copy(kneePos);
    hipPivot.add(kneePivot);

    const kneeBall = new THREE.Mesh(new THREE.SphereGeometry(0.054, 12, 12), jointMat);
    kneePivot.add(kneeBall);

    const anklePos = new THREE.Vector3(0, -shinLen, 0);
    addLocalBoneSegment(
      kneePivot,
      new THREE.Vector3(0, 0, 0),
      anklePos,
      0.039,
      0.03,
      boneMat,
      castShadow
    );

    // Achilles tendon spring attached to shin in tendonsGroup? Keep articulated on kneePivot!
    const achilles = new THREE.Mesh(
      new THREE.CylinderGeometry(isHomo ? 0.019 : 0.008, isHomo ? 0.022 : 0.009, shinLen * 0.72, 8),
      tendonOchreMat
    );
    achilles.position.set(0, -shinLen * 0.56, -0.055);
    achilles.userData.isTendonPart = true;
    kneePivot.add(achilles);

    const anklePivot = new THREE.Group();
    anklePivot.position.copy(anklePos);
    kneePivot.add(anklePivot);

    // Foot: longitudinal plantar arch + aligned hallux (Homo) vs flat grasping foot + divergent hallux (Pan)
    const heel = new THREE.Mesh(new THREE.BoxGeometry(0.082, 0.075, 0.1), boneMat);
    heel.position.set(0, -0.035, -0.04);
    anklePivot.add(heel);

    const midfoot = new THREE.Mesh(
      new THREE.BoxGeometry(0.088, isHomo ? 0.052 : 0.038, 0.18),
      boneMat
    );
    midfoot.position.set(0, isHomo ? -0.024 : -0.048, 0.09);
    anklePivot.add(midfoot);

    const hallux = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.018, isHomo ? 0.05 : 0.068, 6, 8),
      boneMat
    );
    if (isHomo) {
      hallux.rotation.x = Math.PI / 2;
      hallux.position.set(-side * 0.032, -0.046, 0.21);
    } else {
      // Divergent opposable hallux angled ~45° medially in chimpanzee!
      hallux.rotation.x = Math.PI / 2;
      hallux.rotation.z = side * 0.72;
      hallux.position.set(-side * 0.08, -0.048, 0.12);
    }
    anklePivot.add(hallux);

    legs.push({ hipPivot, kneePivot, anklePivot });
  });

  // ======================== TENDONS & GLUTEAL STABILIZERS ========================
  const nuchalCord = new THREE.Mesh(
    new THREE.CylinderGeometry(isHomo ? 0.022 : 0.007, isHomo ? 0.024 : 0.007, 0.28, 8),
    tendonOchreMat
  );
  nuchalCord.position.set(0, torsoHeight - 0.18, -0.11);
  nuchalCord.rotation.x = isHomo ? 0.12 : 0.35;
  tendonsGroup.add(nuchalCord);

  // Gluteal stabilizers mounted in pelvis local space (syncs via pelvisPivot position in updateGait)
  const glutesHolder = new THREE.Group();
  glutesHolder.position.copy(pelvisPivot.position);
  tendonsGroup.add(glutesHolder);
  [-1, 1].forEach((side) => {
    const glute = new THREE.Mesh(
      new THREE.SphereGeometry(isHomo ? 0.13 : 0.085, 14, 12),
      tendonForestMat
    );
    glute.scale.set(0.82, isHomo ? 1.08 : 0.78, 0.65);
    glute.position.set(side * (hipHalfW * 0.64), -0.01, -0.12);
    glutesHolder.add(glute);
  });

  // ======================== CM PLUMB AXIS & VECTORS ========================
  const cmAxisHeight = isHomo ? 2.8 : 2.15;
  const cmAxis = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, cmAxisHeight, 8),
    vectorMat
  );
  cmAxis.position.set(0, cmAxisHeight * 0.5, isHomo ? 0.02 : 0.11);
  vectorsGroup.add(cmAxis);

  const cmMarker = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 14), vectorMat);
  cmMarker.position.set(0, baseHipY + 0.06, isHomo ? 0.02 : 0.11);
  vectorsGroup.add(cmMarker);

  // ======================== 3D THERMAL STRESS AURA RINGS (PELVIS & LUMBAR) ========================
  const pelvisAuraMat = new THREE.MeshBasicMaterial({
    color: _heatLow.clone(),
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const pelvisAuraRing = new THREE.Mesh(
    new THREE.RingGeometry(hipHalfW * 1.15, hipHalfW * 1.52, 36),
    pelvisAuraMat
  );
  pelvisAuraRing.rotation.x = Math.PI / 2;
  pelvisAuraRing.position.set(0, baseHipY + (isHomo ? 0.06 : 0.16), -0.02);
  heatmapAuraGroup.add(pelvisAuraRing);

  const lumbarAuraMat = new THREE.MeshBasicMaterial({
    color: _heatLow.clone(),
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const lumbarAuraRing = new THREE.Mesh(new THREE.RingGeometry(0.11, 0.21, 32), lumbarAuraMat);
  lumbarAuraRing.rotation.y = Math.PI / 2;
  lumbarAuraRing.position.set(0, baseHipY + 0.34, -0.04);
  heatmapAuraGroup.add(lumbarAuraRing);

  // Collect articulated tendon children on legs so tendonsGroup visibility controls them too
  const legTendonMeshes: THREE.Mesh[] = [];
  skeletonGroup.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.userData.isTendonPart) {
      legTendonMeshes.push(obj);
    }
  });

  // ======================== PER-FRAME KINEMATIC + HEATMAP UPDATER ========================
  const updateGait = (phase: number, showHeatmap: boolean, superpositionRatio: number) => {
    const tel = evaluateRunningTelemetry(phase);
    const omega = tel.phase * Math.PI * 2;

    // 1. Pelvis vertical running bounce, lateral Trendelenburg drop & axial rotation
    const bounce = Math.abs(Math.sin(omega)) * (isHomo ? 0.095 : 0.065);
    const pelvicObliquity = Math.sin(omega) * (isHomo ? 0.065 : 0.195); // ~3.7° Homo vs ~11.2° Pan
    const pelvicYaw = Math.cos(omega) * (isHomo ? 0.14 : 0.19);
    const baseTilt = isHomo ? 0.09 : 0.36; // Forward sagittal running lean (~5° Homo vs ~21° Pan)

    pelvisPivot.position.y = baseHipY + bounce;
    pelvisPivot.rotation.set(baseTilt * 0.45, pelvicYaw, pelvicObliquity);

    // Sync glutes & thermal rings cleanly with moving pelvis
    glutesHolder.position.copy(pelvisPivot.position);
    glutesHolder.rotation.copy(pelvisPivot.rotation);
    cmMarker.position.y = pelvisPivot.position.y + 0.06;

    // 2. Spine sagittal pitch & thoracic counter-rotation
    const strideHalf = (tel.phase * 2) % 1;
    const impactPulse = Math.exp(-Math.pow((strideHalf - 0.14) / 0.13, 2));
    spinePivot.rotation.x = isHomo ? 0.06 + impactPulse * 0.04 : 0.28 + impactPulse * 0.11;
    spinePivot.rotation.z = -pelvicObliquity * (isHomo ? 0.72 : 0.35);

    // Homo sapiens counter-rotates thorax cleanly opposite to pelvis; Pan rotates almost en bloc!
    thoraxPivot.rotation.y = isHomo ? -pelvicYaw * 1.45 : -pelvicYaw * 0.25;
    // Head stabilization via nuchal ligament in Homo vs bobbing in Pan
    headPivot.rotation.x = isHomo ? -spinePivot.rotation.x * 0.75 : impactPulse * 0.14;

    // 3. Articulated Legs (Left & Right 180° out of phase)
    legs.forEach((leg, idx) => {
      const legPhase = omega + idx * Math.PI;
      const swing = Math.sin(legPhase);
      const lift = Math.max(0, Math.cos(legPhase));

      if (isHomo) {
        // Extended hip + bouncy mid-stance knee flexion + full swing recovery
        leg.hipPivot.rotation.x = -swing * 0.62 - 0.08;
        leg.kneePivot.rotation.x = 0.22 + lift * 0.92 + Math.max(0, -swing) * 0.18;
        leg.anklePivot.rotation.x = -0.15 + swing * 0.28;
      } else {
        // Bent-hip, bent-knee (BHBK) chimpanzee bipedal running gait!
        leg.hipPivot.rotation.x = -swing * 0.46 - 0.56;
        leg.kneePivot.rotation.x = 0.78 + lift * 0.58;
        leg.anklePivot.rotation.x = -0.28 + swing * 0.22;
      }
    });

    // 4. Articulated Arms (opposite to ipsilateral leg)
    arms.forEach((arm, idx) => {
      const armPhase = omega + (1 - idx) * Math.PI;
      const swing = Math.sin(armPhase);
      if (isHomo) {
        arm.shoulderPivot.rotation.x = -swing * 0.58;
        arm.elbowPivot.rotation.x = -1.32 - Math.max(0, swing) * 0.22;
      } else {
        // Raised/flailing wide balance arms typical of chimpanzee bipedal running
        const side = idx === 0 ? -1 : 1;
        arm.shoulderPivot.rotation.x = -swing * 0.42 - 0.18;
        arm.shoulderPivot.rotation.z = side * (0.28 + Math.abs(swing) * 0.12);
        arm.elbowPivot.rotation.x = -0.62;
      }
    });

    // Sync articulated leg tendons with tendons layer toggle
    legTendonMeshes.forEach((m) => {
      m.visible = tendonsGroup.visible;
    });

    // 5. Superposition visual transparency calibration (0 = superimposed, 1 = side-by-side)
    const primateOpacity = THREE.MathUtils.lerp(0.54, 0.94, superpositionRatio);
    const primateHeatOpacity = THREE.MathUtils.lerp(0.84, 0.98, superpositionRatio);
    if (!isHomo) {
      boneMat.opacity = primateOpacity;
      jointMat.opacity = primateOpacity;
      pelvisCenterHeatMat.opacity = primateHeatOpacity;
      pelvisLeftHeatMat.opacity = primateHeatOpacity;
      pelvisRightHeatMat.opacity = primateHeatOpacity;
      spineCoreHeatMat.opacity = primateHeatOpacity;
      vertebraHeatMats.forEach((m) => {
        m.opacity = primateHeatOpacity;
      });
    }

    // 6. Dynamic Pelvis & Spine Biomechanical Heatmaps
    heatmapAuraGroup.visible = showHeatmap && skeletonGroup.visible;

    const pelvisLoad = isHomo ? tel.homoPelvisLoad : tel.primatePelvisLoad;
    const spineLoad = isHomo ? tel.homoSpineLoad : tel.primateSpineLoad;

    // Asymmetric left/right stance weighting so the weight-bearing hip lights up hotter!
    const rightSupport = Math.max(0, Math.sin(omega + 0.4));
    const leftSupport = Math.max(0, -Math.sin(omega + 0.4));
    const leftPelvisStress = Math.min(1, pelvisLoad * (0.76 + 0.34 * leftSupport));
    const rightPelvisStress = Math.min(1, pelvisLoad * (0.76 + 0.34 * rightSupport));

    if (showHeatmap) {
      // Sacrum / pelvis center
      sampleBiomechanicalHeatmapColor(pelvisLoad, _tmpColor);
      pelvisCenterHeatMat.color.copy(_tmpColor);
      pelvisCenterHeatMat.emissive.copy(_tmpColor);
      pelvisCenterHeatMat.emissiveIntensity = 0.16 + pelvisLoad * 0.34;

      // Left iliac blade
      sampleBiomechanicalHeatmapColor(leftPelvisStress, _tmpColor);
      pelvisLeftHeatMat.color.copy(_tmpColor);
      pelvisLeftHeatMat.emissive.copy(_tmpColor);
      pelvisLeftHeatMat.emissiveIntensity = 0.14 + leftPelvisStress * 0.36;

      // Right iliac blade
      sampleBiomechanicalHeatmapColor(rightPelvisStress, _tmpColor);
      pelvisRightHeatMat.color.copy(_tmpColor);
      pelvisRightHeatMat.emissive.copy(_tmpColor);
      pelvisRightHeatMat.emissiveIntensity = 0.14 + rightPelvisStress * 0.36;

      // Spine core & 12 individual vertebral segments (traveling lumbar compressive gradient)
      sampleBiomechanicalHeatmapColor(spineLoad, _tmpColor);
      spineCoreHeatMat.color.copy(_tmpColor);
      spineCoreHeatMat.emissive.copy(_tmpColor);
      spineCoreHeatMat.emissiveIntensity = 0.14 + spineLoad * 0.32;

      const waveCenter = 0.18 + strideHalf * 0.42; // shock propagates upward from L5 → T10
      for (let i = 0; i < 12; i++) {
        const heightFrac = i / 11; // 0 = lower lumbar S1/L5, 1 = cervical
        // Lumbar/thoracolumbar junction carries maximum compressive/shear stress
        const anatomicalFocus = isHomo
          ? Math.exp(-Math.pow((heightFrac - 0.24) / 0.34, 2))
          : Math.exp(-Math.pow((heightFrac - 0.36) / 0.36, 2));
        const travelingWave = 0.16 * Math.exp(-Math.pow((heightFrac - waveCenter) / 0.22, 2));
        const segIntensity = Math.min(1, spineLoad * (0.45 + 0.65 * anatomicalFocus) + travelingWave);

        sampleBiomechanicalHeatmapColor(segIntensity, _tmpColor);
        const m = vertebraHeatMats[i];
        m.color.copy(_tmpColor);
        m.emissive.copy(_tmpColor);
        m.emissiveIntensity = 0.14 + segIntensity * 0.38;
      }

      // Dynamic 3D thermal stress rings around pelvis & lumbar spine
      sampleBiomechanicalHeatmapColor(pelvisLoad, _tmpEmissive);
      pelvisAuraMat.color.copy(_tmpEmissive);
      pelvisAuraMat.opacity = 0.16 + pelvisLoad * 0.42;
      pelvisAuraRing.position.set(0, pelvisPivot.position.y + (isHomo ? 0.06 : 0.18), -0.02);
      pelvisAuraRing.rotation.z = pelvicObliquity;
      const pScale = 0.92 + pelvisLoad * 0.2;
      pelvisAuraRing.scale.set(pScale, pScale, 1);

      sampleBiomechanicalHeatmapColor(spineLoad, _tmpEmissive);
      lumbarAuraMat.color.copy(_tmpEmissive);
      lumbarAuraMat.opacity = 0.14 + spineLoad * 0.4;
      lumbarAuraRing.position.set(
        0,
        pelvisPivot.position.y + (isHomo ? 0.34 : 0.42),
        isHomo ? 0.02 : -0.04
      );
      const sScale = 0.88 + spineLoad * 0.28;
      lumbarAuraRing.scale.set(sScale, sScale, 1);
    } else {
      // Revert cleanly to natural osteological bone tint when heatmap layer is hidden
      const baseBone = isHomo ? _homoBaseBone : _primateBaseBone;
      [pelvisCenterHeatMat, pelvisLeftHeatMat, pelvisRightHeatMat, spineCoreHeatMat].forEach((m) => {
        m.color.copy(baseBone);
        m.emissive.setHex(0x000000);
        m.emissiveIntensity = 0;
      });
      vertebraHeatMats.forEach((m) => {
        m.color.copy(baseBone);
        m.emissive.setHex(0x000000);
        m.emissiveIntensity = 0;
      });
    }
  };

  return {
    species,
    root,
    skeletonGroup,
    tendonsGroup,
    vectorsGroup,
    heatmapAuraGroup,
    updateGait,
  };
}
