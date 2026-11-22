import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Compass,
  Crosshair,
  Eye,
  FileDown,
  Flame,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Scan,
  SkipBack,
  SkipForward,
  X,
} from 'lucide-react';
import {
  BIOMECHANICS_3D_CAMERAS,
  BIOMECHANICS_HOTSPOTS,
  BIOMECHANICS_PROFILES,
  RUNNING_CYCLE_PHASES,
  type BiomechanicsModeId,
  type Hotspot3DInfo,
} from '../data/visualSchemas3dData';
import {
  createContactShadowTexture,
  createEditorialStudio,
  createProceduralRockTexture,
  disposeObject3DTree,
  scheduleAfterDraw,
} from '../utils/threeSceneUtils';
import {
  buildArticulatedComparativeRig,
  evaluateRunningTelemetry,
  type ArticulatedComparativeRig,
  type RunningTelemetryFrame,
} from '../utils/comparativeBiomechanicsRig';
import {
  attachBiomechanicsOutlineShader,
  type OutlineShaderBundle,
} from '../utils/outlineShaderUtils';
import { reportScene3DStage, yieldToPaint } from '../utils/async3dLoader';
import { Scene3DHydrationOverlay } from './Scene3DAsyncBoundary';
import {
  ARHotspotOverlay,
  type ProjectedARPoint,
} from './ARHotspotOverlay';
import { BiomechanicsReportModal } from './BiomechanicsReportModal';
import type { BiomechanicsReportSnapshot } from '../utils/biomechanicsReportExporter';

THREE.Cache.enabled = true;

export interface Biomechanics3DViewerProps {
  onFallbackTo2D?: () => void;
}

interface HoverTooltipState {
  title: string;
  subtitle: string;
  accent: string;
  x: number;
  y: number;
  containerWidth: number;
}

interface GuidedTourStopSpec {
  id: string;
  stepNumber: number;
  stageTitle: string;
  focusLabel: string;
  anatomicalCallout: string;
  targetPhase: number;
  superposition: number;
  hotspotId: string;
  target: [number, number, number];
  radius: number;
  elevation: number;
  azStart: number;
  azEnd: number;
}

const GUIDED_TOUR_STOPS: GuidedTourStopSpec[] = [
  {
    id: 'tour-strike-spine',
    stepNumber: 1,
    stageTitle: 'Contacto inicial e impacto',
    focusLabel: 'Columna lumbar en S vs. arco en C',
    anatomicalCallout:
      'Al impactar el pie, la columna rígida en C de Pan troglodytes concentra cizalla toracolumbar (~24° de inclinación), mientras la lordosis móvil en S de Homo sapiens amortigua el choque vertical.',
    targetPhase: 0.07,
    superposition: 0.16,
    hotspotId: 'bio-lumbar',
    target: [0, 1.88, 0],
    radius: 2.85,
    elevation: 2.02,
    azStart: 0.92,
    azEnd: 1.54,
  },
  {
    id: 'tour-midstance-pelvis',
    stepNumber: 2,
    stageTitle: 'Apoyo medio (carga máxima)',
    focusLabel: 'Pelvis en cuenca y estabilidad lateral',
    anatomicalCallout:
      'En apoyo monopodal máximo, los iliones planos de Pan se sobrecargan en rojo y basculan lateralmente; la pelvis corta en cuenca de Homo estabiliza la cadera mediante los glúteos medios.',
    targetPhase: 0.18,
    superposition: 0.36,
    hotspotId: 'bio-pelvis',
    target: [0, 1.56, 0],
    radius: 2.58,
    elevation: 1.72,
    azStart: -0.45,
    azEnd: 0.52,
  },
  {
    id: 'tour-toeoff-sagittal',
    stepNumber: 3,
    stageTitle: 'Despegue e impulso',
    focusLabel: 'Perfil sagital: pelvis, glúteo mayor y tronco erguido',
    anatomicalCallout:
      'En el despegue, el glúteo mayor de Homo frena el cabeceo anterior y mantiene el tronco erguido sobre la pelvis mientras el tendón de Aquiles libera energía elástica acumulada.',
    targetPhase: 0.29,
    superposition: 0.58,
    hotspotId: 'bio-pelvis',
    target: [0, 1.52, 0],
    radius: 3.15,
    elevation: 1.78,
    azStart: 1.12,
    azEnd: 1.82,
  },
  {
    id: 'tour-flight-counterrotation',
    stepNumber: 4,
    stageTitle: 'Fase aérea y contrarrotación',
    focusLabel: 'Cintura lumbar móvil y descarga pélvica',
    anatomicalCallout:
      'Durante el vuelo, la pelvis descarga y la cintura estrecha de Homo permite que tórax y brazos contrarroten frente a la cadera; en Pan los iliones altos bloquean la columna lumbar.',
    targetPhase: 0.42,
    superposition: 0.84,
    hotspotId: 'bio-lumbar',
    target: [0, 1.72, 0],
    radius: 3.35,
    elevation: 2.24,
    azStart: -0.78,
    azEnd: 0.2,
  },
];

const TOUR_MOVE_SECONDS = 1.45;
const TOUR_PAUSE_SECONDS = 6.2;

const LAYER_HOTSPOT = 1;

interface HomininRigHandles {
  root: THREE.Group;
  skeletonGroup: THREE.Group;
  tendonsGroup: THREE.Group;
  vectorsGroup: THREE.Group;
  heightScale: number;
}

function addSegmentMesh(
  parent: THREE.Object3D,
  from: THREE.Vector3,
  to: THREE.Vector3,
  rTop: number,
  rBot: number,
  mat: THREE.Material,
  castShadow: boolean
) {
  const dir = new THREE.Vector3().subVectors(to, from);
  const len = dir.length();
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, len, 14), mat);
  mesh.position.copy(from).add(to).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  mesh.castShadow = castShadow;
  mesh.receiveShadow = castShadow;
  parent.add(mesh);
  return mesh;
}

/**
 * Builds a composite multi-part anatomical hominin rig grounded strictly at y = 0.
 * Contrasts early bipedalism (Australopithecus afarensis) with endurance running (Homo erectus/sapiens).
 */
function buildHomininRig(
  profile: 'australopithecus' | 'homo',
  boneTex: THREE.CanvasTexture,
  shadowTex: THREE.CanvasTexture,
  isSoftwareGl: boolean
): HomininRigHandles {
  const isHomo = profile === 'homo';
  const castShadow = !isSoftwareGl;

  const root = new THREE.Group();
  const skeletonGroup = new THREE.Group();
  const tendonsGroup = new THREE.Group();
  const vectorsGroup = new THREE.Group();
  root.add(skeletonGroup, tendonsGroup, vectorsGroup);

  // Materials with realistic cortical bone, joint cartilage, elastic ochre tendons, and lapis CM axis
  const boneMat = new THREE.MeshStandardMaterial({
    map: boneTex,
    color: isHomo ? 0xf2ebdd : 0xe4d7be,
    roughness: 0.62,
    metalness: 0.04,
  });
  const jointMat = new THREE.MeshStandardMaterial({
    color: 0xd3c6ae,
    roughness: 0.48,
    metalness: 0.05,
  });
  const tendonOchreMat = new THREE.MeshStandardMaterial({
    color: 0xd95522,
    roughness: 0.4,
    metalness: 0.08,
  });
  const tendonForestMat = new THREE.MeshStandardMaterial({
    color: 0x28a47b,
    roughness: 0.44,
    metalness: 0.06,
  });
  const muscleSoftMat = new THREE.MeshStandardMaterial({
    color: 0xd96b3d,
    roughness: 0.54,
    metalness: 0.04,
    transparent: true,
    opacity: isHomo ? 0.88 : 0.52,
  });
  const vectorLapisMat = new THREE.MeshStandardMaterial({
    color: 0x5ba4f5,
    roughness: 0.34,
    metalness: 0.12,
  });

  // Key anatomical coordinates (strictly grounded at y = 0)
  const ankleY = 0.14;
  const kneeY = isHomo ? 0.86 : 0.64;
  const hipY = isHomo ? 1.56 : 1.18;
  const hipHalfW = isHomo ? 0.215 : 0.255; // Australopithecus has wider flared iliac basin
  const kneeHalfW = isHomo ? 0.105 : 0.11; // Both converge in bicondylar valgus angle!
  const ankleHalfW = 0.125;
  const waistY = isHomo ? 1.88 : 1.38;
  const shoulderY = isHomo ? 2.42 : 1.82;
  const shoulderHalfW = isHomo ? 0.31 : 0.285;
  const neckTopY = isHomo ? 2.66 : 2.02;
  const headCenterY = isHomo ? 2.86 : 2.21;

  // Ground contact shadow beneath both feet
  const footShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(0.95, 0.78),
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
    })
  );
  footShadow.rotation.x = -Math.PI / 2;
  footShadow.position.y = 0.004;
  root.add(footShadow);

  // ======================== 1. SKELETON LAYER ========================

  // Cranium + facial block + foramen magnum marker
  const craniumGroup = new THREE.Group();
  craniumGroup.position.set(0, headCenterY, isHomo ? 0.02 : 0.06);
  const skullVault = new THREE.Mesh(
    new THREE.SphereGeometry(isHomo ? 0.19 : 0.165, 22, 18),
    boneMat
  );
  skullVault.scale.set(0.88, isHomo ? 1.04 : 0.88, isHomo ? 1.08 : 1.04);
  skullVault.castShadow = castShadow;
  craniumGroup.add(skullVault);

  // Facial / maxillary contour (more prognathic in Australopithecus)
  const faceMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, isHomo ? 0.18 : 0.19, isHomo ? 0.13 : 0.18),
    boneMat
  );
  faceMesh.position.set(0, -0.09, isHomo ? 0.1 : 0.13);
  faceMesh.rotation.x = isHomo ? 0.05 : -0.14;
  faceMesh.castShadow = castShadow;
  craniumGroup.add(faceMesh);

  // Anterior foramen magnum ring at skull base
  const foramenRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.048, 0.014, 10, 20),
    new THREE.MeshStandardMaterial({ color: 0x156f55, roughness: 0.4 })
  );
  foramenRing.rotation.x = Math.PI / 2;
  foramenRing.position.set(0, -0.175, isHomo ? -0.01 : -0.045);
  craniumGroup.add(foramenRing);
  skeletonGroup.add(craniumGroup);

  // S-curved vertebral column (lumbar lordosis)
  const spineCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, hipY - 0.04, -0.06),
    new THREE.Vector3(0, waistY, isHomo ? 0.035 : 0.018), // Anterior lumbar lordosis
    new THREE.Vector3(0, shoulderY - 0.12, -0.075), // Thoracic kyphosis
    new THREE.Vector3(0, shoulderY + 0.08, -0.03),
    new THREE.Vector3(0, neckTopY + 0.03, isHomo ? 0.0 : 0.025),
  ]);
  const spineTube = new THREE.Mesh(new THREE.TubeGeometry(spineCurve, 28, 0.036, 12, false), boneMat);
  spineTube.castShadow = castShadow;
  skeletonGroup.add(spineTube);

  // Segmented vertebral rings along curve
  const vertGeo = new THREE.CylinderGeometry(0.05, 0.052, 0.028, 12);
  for (let i = 1; i <= 11; i++) {
    const t = i / 12;
    const pt = spineCurve.getPoint(t);
    const tang = spineCurve.getTangent(t);
    const disc = new THREE.Mesh(vertGeo, jointMat);
    disc.position.copy(pt);
    disc.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tang);
    skeletonGroup.add(disc);
  }

  // Ribcage (barrel-shaped in Homo vs slightly funnel-shaped in Australopithecus)
  for (let r = 0; r < 6; r++) {
    const frac = r / 5;
    const ry = shoulderY - 0.06 - frac * (isHomo ? 0.44 : 0.34);
    const rx = isHomo
      ? 0.23 - Math.abs(frac - 0.45) * 0.05
      : 0.19 + frac * 0.075; // Funnel widening downward in Australopithecus
    const rz = isHomo ? 0.15 : 0.14 + frac * 0.03;
    const rib = new THREE.Mesh(new THREE.TorusGeometry(1, 0.016 / rx, 8, 28), boneMat);
    rib.rotation.x = Math.PI / 2 + 0.08;
    rib.position.set(0, ry, -0.01);
    rib.scale.set(rx, rz, 1);
    rib.castShadow = castShadow;
    skeletonGroup.add(rib);
  }

  // Sternum plate
  const sternum = new THREE.Mesh(
    new THREE.BoxGeometry(0.065, isHomo ? 0.34 : 0.26, 0.026),
    boneMat
  );
  sternum.position.set(0, shoulderY - (isHomo ? 0.24 : 0.2), isHomo ? 0.135 : 0.145);
  skeletonGroup.add(sternum);

  // Sculpted Basin Pelvis (short, forward-curved iliac blades + sacrum)
  const pelvisGroup = new THREE.Group();
  pelvisGroup.position.set(0, hipY + 0.03, -0.02);

  const sacrum = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.22, 6), boneMat);
  sacrum.rotation.x = Math.PI;
  sacrum.position.set(0, 0.02, -0.06);
  pelvisGroup.add(sacrum);

  [-1, 1].forEach((side) => {
    const ilium = new THREE.Mesh(
      new THREE.CylinderGeometry(
        isHomo ? 0.13 : 0.145,
        isHomo ? 0.085 : 0.095,
        isHomo ? 0.24 : 0.19,
        14,
        1,
        false,
        0,
        Math.PI * 1.15
      ),
      boneMat
    );
    ilium.position.set(side * (hipHalfW * 0.68), 0.05, 0.0);
    ilium.rotation.y = side > 0 ? -Math.PI * 0.32 : Math.PI * 0.68;
    ilium.rotation.z = side * (isHomo ? -0.18 : -0.34);
    ilium.castShadow = castShadow;
    pelvisGroup.add(ilium);

    // Pubic symphysis bridge
    const pubis = new THREE.Mesh(new THREE.BoxGeometry(hipHalfW * 0.9, 0.048, 0.045), boneMat);
    pubis.position.set(side * (hipHalfW * 0.42), -0.06, 0.075);
    pubis.rotation.y = side * -0.22;
    pelvisGroup.add(pubis);
  });
  skeletonGroup.add(pelvisGroup);

  // Clavicles, Shoulders, and Arms (longer forearms in Australopithecus)
  [-1, 1].forEach((side) => {
    const clavStart = new THREE.Vector3(side * 0.04, shoulderY + 0.02, 0.11);
    const shoulderPt = new THREE.Vector3(side * shoulderHalfW, shoulderY, -0.01);
    addSegmentMesh(skeletonGroup, clavStart, shoulderPt, 0.022, 0.02, boneMat, castShadow);

    const shJoint = new THREE.Mesh(new THREE.SphereGeometry(0.058, 14, 14), jointMat);
    shJoint.position.copy(shoulderPt);
    skeletonGroup.add(shJoint);

    const elbowPt = new THREE.Vector3(
      side * (shoulderHalfW + 0.045),
      isHomo ? shoulderY - 0.56 : shoulderY - 0.52,
      isHomo ? -0.06 : 0.01
    );
    const wristPt = new THREE.Vector3(
      side * (shoulderHalfW + (isHomo ? 0.02 : 0.06)),
      isHomo ? shoulderY - 0.98 : shoulderY - 1.02, // Reaches lower near knee in Australopithecus
      isHomo ? 0.12 : 0.06
    );
    addSegmentMesh(skeletonGroup, shoulderPt, elbowPt, 0.036, 0.03, boneMat, castShadow);
    const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.044, 12, 12), jointMat);
    elbowJoint.position.copy(elbowPt);
    skeletonGroup.add(elbowJoint);
    addSegmentMesh(skeletonGroup, elbowPt, wristPt, 0.03, 0.024, boneMat, castShadow);

    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.13, 0.035), boneMat);
    hand.position.copy(wristPt).add(new THREE.Vector3(0, -0.07, 0.02));
    skeletonGroup.add(hand);
  });

  // Lower Limbs (Femoral Valgus + Knee + Tibia + Arched Foot grounded at y = 0)
  [-1, 1].forEach((side) => {
    const hipSocket = new THREE.Vector3(side * hipHalfW, hipY, 0);
    const trochanter = new THREE.Vector3(side * (hipHalfW + 0.065), hipY - 0.04, 0);
    const kneePt = new THREE.Vector3(side * kneeHalfW, kneeY, 0.03);
    const anklePt = new THREE.Vector3(side * ankleHalfW, ankleY, -0.02);

    // Hip ball + femoral neck
    const hipBall = new THREE.Mesh(new THREE.SphereGeometry(0.062, 14, 14), jointMat);
    hipBall.position.copy(hipSocket);
    skeletonGroup.add(hipBall);
    addSegmentMesh(skeletonGroup, hipSocket, trochanter, 0.032, 0.036, boneMat, castShadow);

    // Angled Valgus Femur converging toward midline knee
    addSegmentMesh(skeletonGroup, trochanter, kneePt, 0.048, 0.042, boneMat, castShadow);

    // Knee condyles + patella
    const kneeJoint = new THREE.Mesh(new THREE.SphereGeometry(0.058, 14, 14), jointMat);
    kneeJoint.position.copy(kneePt);
    skeletonGroup.add(kneeJoint);
    const patella = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), boneMat);
    patella.position.set(kneePt.x, kneePt.y + 0.01, kneePt.z + 0.058);
    patella.scale.set(0.95, 1.1, 0.55);
    skeletonGroup.add(patella);

    // Vertical Tibia + slender Fibula
    addSegmentMesh(skeletonGroup, kneePt, anklePt, 0.042, 0.032, boneMat, castShadow);
    const fibTop = kneePt.clone().add(new THREE.Vector3(side * 0.045, -0.05, -0.02));
    const fibBot = anklePt.clone().add(new THREE.Vector3(side * 0.035, 0.01, -0.02));
    addSegmentMesh(skeletonGroup, fibTop, fibBot, 0.014, 0.013, boneMat, castShadow);

    // Multi-part Plantar Arch Foot grounded at y = 0
    const footGroup = new THREE.Group();
    footGroup.position.set(anklePt.x, 0, anklePt.z);

    // Calcaneus (heel block seated on y = 0)
    const heel = new THREE.Mesh(new THREE.BoxGeometry(0.088, 0.09, 0.11), boneMat);
    heel.position.set(0, 0.045, -0.05);
    heel.castShadow = castShadow;
    footGroup.add(heel);

    // Talus ankle dome
    const talus = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 12), jointMat);
    talus.position.set(0, 0.115, 0.0);
    footGroup.add(talus);

    // Longitudinal plantar arch bridge (higher vault in Homo)
    const archPeakY = isHomo ? 0.095 : 0.068;
    const archCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.045, -0.04),
      new THREE.Vector3(0, archPeakY, 0.08),
      new THREE.Vector3(0, 0.032, 0.21),
    ]);
    const archBridge = new THREE.Mesh(
      new THREE.TubeGeometry(archCurve, 16, 0.036, 10, false),
      boneMat
    );
    archBridge.scale.set(1.25, 0.72, 1);
    archBridge.castShadow = castShadow;
    footGroup.add(archBridge);

    // Forefoot ball + aligned hallux (non-opposable big toe)
    const forefoot = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.042, 0.09), boneMat);
    forefoot.position.set(0, 0.021, 0.21);
    footGroup.add(forefoot);

    const hallux = new THREE.Mesh(new THREE.CapsuleGeometry(0.019, 0.055, 6, 10), boneMat);
    hallux.rotation.x = Math.PI / 2;
    hallux.position.set(-side * 0.034, 0.02, 0.285);
    footGroup.add(hallux);

    skeletonGroup.add(footGroup);
  });

  // ======================== 2. TENDONS & MUSCLES LAYER ========================

  // Nuchal Ligament (prominent elastic ribbon in Homo, thin/faint in Australopithecus)
  const nuchalCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, headCenterY - 0.04, isHomo ? -0.155 : -0.11),
    new THREE.Vector3(0, neckTopY - 0.04, -0.125),
    new THREE.Vector3(0, shoulderY + 0.05, -0.075),
  ]);
  const nuchalMesh = new THREE.Mesh(
    new THREE.TubeGeometry(nuchalCurve, 16, isHomo ? 0.026 : 0.009, 10, false),
    isHomo
      ? tendonOchreMat
      : new THREE.MeshStandardMaterial({
          color: 0xb43c0b,
          transparent: true,
          opacity: 0.35,
          roughness: 0.6,
        })
  );
  tendonsGroup.add(nuchalMesh);

  // Gluteus Maximus & Hip Stabilizers (hypertrophied in Homo for running trunk braking)
  [-1, 1].forEach((side) => {
    const glute = new THREE.Mesh(
      new THREE.SphereGeometry(isHomo ? 0.145 : 0.105, 16, 14),
      muscleSoftMat
    );
    glute.scale.set(0.85, isHomo ? 1.15 : 0.85, 0.72);
    glute.position.set(side * (hipHalfW * 0.62), hipY - 0.02, -0.125);
    tendonsGroup.add(glute);

    // Achilles Tendon elastic spring along posterior tibia to calcaneus heel
    const achillesTop = new THREE.Vector3(
      side * (ankleHalfW + 0.004),
      kneeY - (isHomo ? 0.16 : 0.25),
      -0.068
    );
    const achillesBot = new THREE.Vector3(side * ankleHalfW, 0.075, -0.11);
    const achillesCurve = new THREE.CatmullRomCurve3([
      achillesTop,
      new THREE.Vector3(side * ankleHalfW, (achillesTop.y + achillesBot.y) * 0.5, -0.095),
      achillesBot,
    ]);
    const achillesCord = new THREE.Mesh(
      new THREE.TubeGeometry(achillesCurve, 16, isHomo ? 0.024 : 0.011, 10, false),
      tendonOchreMat
    );
    tendonsGroup.add(achillesCord);

    // Calf gastrocnemius anchor above Achilles
    const calf = new THREE.Mesh(
      new THREE.SphereGeometry(isHomo ? 0.056 : 0.044, 12, 12),
      muscleSoftMat
    );
    calf.scale.set(0.8, 1.75, 0.78);
    calf.position.set(side * ankleHalfW, kneeY - (isHomo ? 0.18 : 0.14), -0.062);
    tendonsGroup.add(calf);

    // Plantar Fascia elastic bowstring beneath the foot arch
    const fasciaFrom = new THREE.Vector3(side * ankleHalfW, 0.028, -0.07);
    const fasciaTo = new THREE.Vector3(side * ankleHalfW, 0.024, 0.19);
    addSegmentMesh(
      tendonsGroup,
      fasciaFrom,
      fasciaTo,
      isHomo ? 0.014 : 0.008,
      isHomo ? 0.014 : 0.008,
      tendonForestMat,
      false
    );
  });

  // ======================== 3. CM AXIS & BIOMECHANICAL VECTORS LAYER ========================

  // Vertical Center of Mass (CM) plumb axis passing from skull base down between the feet
  const cmAxis = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, headCenterY + 0.25, 10),
    vectorLapisMat
  );
  cmAxis.position.set(0, (headCenterY + 0.25) * 0.5, 0.02);
  vectorsGroup.add(cmAxis);

  // Center of Mass sphere marker at anterior S2 pelvic level
  const cmSphere = new THREE.Mesh(new THREE.SphereGeometry(0.075, 18, 18), vectorLapisMat);
  cmSphere.position.set(0, hipY + 0.06, 0.02);
  vectorsGroup.add(cmSphere);

  // Ground-projection crosshairs under CM
  const cmGroundRing = new THREE.Mesh(
    new THREE.RingGeometry(0.09, 0.125, 24),
    new THREE.MeshBasicMaterial({ color: 0x1f5fa8, side: THREE.DoubleSide })
  );
  cmGroundRing.rotation.x = -Math.PI / 2;
  cmGroundRing.position.set(0, 0.01, 0.02);
  vectorsGroup.add(cmGroundRing);

  // Femoral Valgus Angle Reference Vertical & Convergence Arc on right leg
  const valgusRefLine = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.008, hipY - kneeY, 8),
    tendonForestMat
  );
  valgusRefLine.position.set(kneeHalfW, (hipY + kneeY) * 0.5, 0.03);
  vectorsGroup.add(valgusRefLine);

  const valgusArc = new THREE.Mesh(
    new THREE.TorusGeometry(0.24, 0.012, 8, 18, 0.24),
    tendonForestMat
  );
  valgusArc.position.set(kneeHalfW, kneeY, 0.045);
  valgusArc.rotation.z = Math.PI / 2 - 0.22;
  vectorsGroup.add(valgusArc);

  // Ground-reaction elastic rebound arrow behind heel
  const reboundStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, isHomo ? 0.36 : 0.2, 8),
    tendonOchreMat
  );
  reboundStem.position.set(ankleHalfW + 0.13, isHomo ? 0.18 : 0.1, -0.06);
  vectorsGroup.add(reboundStem);

  const reboundHead = new THREE.Mesh(new THREE.ConeGeometry(0.036, 0.09, 10), tendonOchreMat);
  reboundHead.position.set(ankleHalfW + 0.13, isHomo ? 0.39 : 0.22, -0.06);
  vectorsGroup.add(reboundHead);

  return {
    root,
    skeletonGroup,
    tendonsGroup,
    vectorsGroup,
    heightScale: isHomo ? 1 : 0.78,
  };
}

function buildHotspotNode(info: Hotspot3DInfo, pos: [number, number, number]): THREE.Group {
  const g = new THREE.Group();
  g.position.set(pos[0], pos[1], pos[2]);

  const accentColor = new THREE.Color(info.accent);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.075, 0.018, 10, 22),
    new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.35, metalness: 0.1 })
  );
  ring.layers.enable(LAYER_HOTSPOT);
  ring.userData = { pickKind: 'hotspot', hotspot: info };
  g.add(ring);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.052, 14, 14),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.05 })
  );
  core.layers.enable(LAYER_HOTSPOT);
  core.userData = { pickKind: 'hotspot', hotspot: info };
  g.add(core);

  const hit = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 10, 10),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  hit.layers.enable(LAYER_HOTSPOT);
  hit.userData = { pickKind: 'hotspot', hotspot: info };
  g.add(hit);

  return g;
}

export function Biomechanics3DViewer({ onFallbackTo2D }: Biomechanics3DViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<BiomechanicsModeId>('vista-comparativa');
  const [dockExpanded, setDockExpanded] = useState(true);
  const [activeCamId, setActiveCamId] = useState<string>('full');
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showTendons, setShowTendons] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showOutlines, setShowOutlines] = useState(true);
  const [outlinePreset, setOutlinePreset] = useState<'fine' | 'standard' | 'bold'>('standard');
  const [superposition, setSuperposition] = useState(0); // 0 = superimposed, 1 = side-by-side
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [playbackSpeed, setPlaybackSpeed] = useState<0.5 | 1>(0.5);
  const [liveTelemetry, setLiveTelemetry] = useState<RunningTelemetryFrame>(() =>
    evaluateRunningTelemetry(0.14)
  );
  const [activeHotspot, setActiveHotspot] = useState<Hotspot3DInfo>(BIOMECHANICS_HOTSPOTS[2]);
  const [arPanelOpen, setArPanelOpen] = useState(false);
  const [showArPins, setShowArPins] = useState(true);
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  const [projectedPoints, setProjectedPoints] = useState<ProjectedARPoint[]>([]);
  const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [tooltip, setTooltip] = useState<HoverTooltipState | null>(null);
  const [contextLost, setContextLost] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  // Guided Tour ("Visita Guiada") state
  const [guidedTourActive, setGuidedTourActive] = useState(false);
  const [guidedTourPaused, setGuidedTourPaused] = useState(false);
  const [guidedStopIndex, setGuidedStopIndex] = useState(0);
  const [guidedSubPhase, setGuidedSubPhase] = useState<'moving' | 'paused'>('moving');
  const [guidedProgress, setGuidedProgress] = useState(0);
  const [reportSnapshot, setReportSnapshot] = useState<BiomechanicsReportSnapshot | null>(null);

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const playbackSpeedRef = useRef(playbackSpeed);
  playbackSpeedRef.current = playbackSpeed;
  const showHeatmapRef = useRef(showHeatmap);
  showHeatmapRef.current = showHeatmap;
  const showOutlinesRef = useRef(showOutlines);
  showOutlinesRef.current = showOutlines;
  const outlineScale = outlinePreset === 'fine' ? 0.7 : outlinePreset === 'bold' ? 1.45 : 1.05;
  const outlineScaleRef = useRef(outlineScale);
  outlineScaleRef.current = outlineScale;
  const superpositionRef = useRef(superposition);
  superpositionRef.current = superposition;
  const gaitPhaseRef = useRef(0.14);

  const guidedTourActiveRef = useRef(guidedTourActive);
  guidedTourActiveRef.current = guidedTourActive;
  const guidedTourPausedRef = useRef(guidedTourPaused);
  guidedTourPausedRef.current = guidedTourPaused;
  const tourRuntimeRef = useRef<{
    stopIndex: number;
    subPhase: 'moving' | 'paused';
    elapsed: number;
    startGaitPhase: number;
  }>({
    stopIndex: 0,
    subPhase: 'moving',
    elapsed: 0,
    startGaitPhase: 0.14,
  });

  const activeGuidedStop = GUIDED_TOUR_STOPS[guidedStopIndex] ?? GUIDED_TOUR_STOPS[0];

  const activeProfileSpec = useMemo(() => {
    if (mode === 'australopithecus') return BIOMECHANICS_PROFILES.australopithecus;
    if (mode === 'vista-comparativa') return BIOMECHANICS_PROFILES.primate;
    return BIOMECHANICS_PROFILES.homo;
  }, [mode]);

  const activeRunningPhase = RUNNING_CYCLE_PHASES[liveTelemetry.phaseIndex];

  const sceneRefs = useRef<{
    requestRender: () => void;
    flyTo: (pos: [number, number, number], target: [number, number, number]) => void;
    captureFrameAndCamera: () => {
      dataUrl: string;
      width: number;
      height: number;
      camera: {
        azimuthDeg: number;
        elevationDeg: number;
        distance: number;
        fovDeg: number;
        position: [number, number, number];
        target: [number, number, number];
      };
    } | null;
    rigs: HomininRigHandles[];
    comparativeRigs: ArticulatedComparativeRig[];
    outlineBundles: OutlineShaderBundle[];
  }>({
    requestRender: () => {},
    flyTo: () => {},
    captureFrameAndCamera: () => null,
    rigs: [],
    comparativeRigs: [],
    outlineBundles: [],
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let cancelled = false;
    let cleanupScene: (() => void) | null = null;
    setSceneReady(false);

    const bootstrapScene = async () => {
      reportScene3DStage('biomechanics', 1, 44);
      await yieldToPaint();
      if (cancelled) return;

      const studio = createEditorialStudio(container, '#161b23', 10.5, 25, 'dark');
      const { renderer, scene, isSoftwareGl, disposeStudio } = studio;

      const width = Math.max(container.clientWidth, 320);
      const height = Math.max(container.clientHeight, 320);
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 40);

      const isFossilComparative = mode === 'comparativa';
      const isSuperimposedComparative = mode === 'vista-comparativa';
      const initialPos: [number, number, number] = isFossilComparative
        ? [0.15, 2.15, 5.95]
        : isSuperimposedComparative
          ? [3.25, 1.92, 4.15]
          : BIOMECHANICS_3D_CAMERAS[0].position;
      const initialTarget: [number, number, number] = isFossilComparative
        ? [0, 1.45, 0]
        : isSuperimposedComparative
          ? [0, 1.44, 0]
          : BIOMECHANICS_3D_CAMERAS[0].target;

      camera.position.set(...initialPos);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(...initialTarget);
      controls.enableDamping = !isSoftwareGl;
      controls.dampingFactor = 0.06;
      controls.minDistance = 1.65;
      controls.maxDistance = 9.5;
      controls.minPolarAngle = 0.15;
      controls.maxPolarAngle = Math.PI * 0.49;
      controls.update();

      reportScene3DStage('biomechanics', 1, 64);
      await yieldToPaint();
      if (cancelled) {
        controls.dispose();
        disposeStudio();
        return;
      }

      const maxAniso = renderer.capabilities.getMaxAnisotropy();
      const boneTex = createProceduralRockTexture('bone', maxAniso);
      const shadowTex = createContactShadowTexture();

      reportScene3DStage('biomechanics', 2, 78);
      await yieldToPaint();
      if (cancelled) {
        controls.dispose();
        boneTex.dispose();
        shadowTex.dispose();
        disposeStudio();
        return;
      }

      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

    // Grounded museum-grade circular plinth (top surface strictly at y = 0)
    const plinthRadius = isFossilComparative || isSuperimposedComparative ? 2.55 : 1.75;
    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(plinthRadius, plinthRadius + 0.12, 0.18, 64),
      new THREE.MeshStandardMaterial({
        color: 0x222834,
        roughness: 0.85,
        metalness: 0.08,
      })
    );
    plinth.position.y = -0.09;
    plinth.receiveShadow = !isSoftwareGl;
    rootGroup.add(plinth);

    const plinthBorder = new THREE.Mesh(
      new THREE.TorusGeometry(plinthRadius, 0.016, 10, 64),
      new THREE.MeshStandardMaterial({ color: 0x4c586e, roughness: 0.55, metalness: 0.18 })
    );
    plinthBorder.rotation.x = Math.PI / 2;
    plinthBorder.position.y = 0.003;
    rootGroup.add(plinthBorder);

    // Subtle metric reference grid rings on floor
    [0.65, 1.25].forEach((r) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(r, r + 0.012, 48),
        new THREE.MeshBasicMaterial({ color: 0x3b4659, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.004;
      rootGroup.add(ring);
    });

    // Build rig(s) according to active mode
    const rigs: HomininRigHandles[] = [];
    const comparativeRigs: ArticulatedComparativeRig[] = [];
    const outlineBundles: OutlineShaderBundle[] = [];
    let primateOutlineBundle: OutlineShaderBundle | null = null;
    let sagittalGridPlane: THREE.Mesh | null = null;
    const outlineOpts = {
      includeFresnelRidge: !isSoftwareGl,
      initialEnabled: showOutlinesRef.current,
      initialThicknessScale: outlineScaleRef.current,
    };

    if (mode === 'vista-comparativa') {
      const primateRig = buildArticulatedComparativeRig(
        'primate',
        boneTex,
        shadowTex,
        isSoftwareGl
      );
      const homoRig = buildArticulatedComparativeRig('homo', boneTex, shadowTex, isSoftwareGl);

      // Attach species-coded custom GLSL outline + Fresnel ridge contour shaders
      primateOutlineBundle = attachBiomechanicsOutlineShader(
        primateRig.skeletonGroup,
        'primate',
        outlineOpts
      );
      outlineBundles.push(
        primateOutlineBundle,
        attachBiomechanicsOutlineShader(homoRig.skeletonGroup, 'homo', outlineOpts),
        attachBiomechanicsOutlineShader(homoRig.tendonsGroup, 'tendon', outlineOpts)
      );

      const initSep = superpositionRef.current * 0.78;
      primateRig.root.position.set(-initSep, 0, 0);
      homoRig.root.position.set(initSep, 0, 0);

      rootGroup.add(primateRig.root, homoRig.root);
      comparativeRigs.push(primateRig, homoRig);

      // Subtle translucent sagittal alignment reference plane when superimposed
      sagittalGridPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 2.9),
        new THREE.MeshBasicMaterial({
          color: 0x6baaf5,
          transparent: true,
          opacity: 0.075,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      sagittalGridPlane.rotation.y = Math.PI / 2;
      sagittalGridPlane.position.set(0, 1.45, 0);
      rootGroup.add(sagittalGridPlane);

      // Floor running stride axis direction indicator
      const strideAxis = new THREE.Mesh(
        new THREE.PlaneGeometry(0.03, 2.4),
        new THREE.MeshBasicMaterial({
          color: 0xe66832,
          transparent: true,
          opacity: 0.55,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      strideAxis.rotation.x = -Math.PI / 2;
      strideAxis.position.set(0, 0.006, 0.15);
      rootGroup.add(strideAxis);

      comparativeRigs.forEach((r) => {
        r.skeletonGroup.visible = showSkeleton;
        r.tendonsGroup.visible = showTendons;
        r.vectorsGroup.visible = showVectors;
        r.updateGait(gaitPhaseRef.current, showHeatmapRef.current, superpositionRef.current);
      });
    } else if (mode === 'comparativa') {
      const ausRig = buildHomininRig('australopithecus', boneTex, shadowTex, isSoftwareGl);
      ausRig.root.position.set(-0.98, 0, 0);
      ausRig.root.rotation.y = 0.16;
      rootGroup.add(ausRig.root);
      rigs.push(ausRig);

      const homoRig = buildHomininRig('homo', boneTex, shadowTex, isSoftwareGl);
      homoRig.root.position.set(0.98, 0, 0);
      homoRig.root.rotation.y = -0.16;
      rootGroup.add(homoRig.root);
      rigs.push(homoRig);

      outlineBundles.push(
        attachBiomechanicsOutlineShader(ausRig.skeletonGroup, 'australopithecus', outlineOpts),
        attachBiomechanicsOutlineShader(ausRig.tendonsGroup, 'tendon', outlineOpts),
        attachBiomechanicsOutlineShader(homoRig.skeletonGroup, 'homo', outlineOpts),
        attachBiomechanicsOutlineShader(homoRig.tendonsGroup, 'tendon', outlineOpts)
      );

      // Central height comparison stadiometer bar (0 to 1.80 m scale)
      const rodMat = new THREE.MeshStandardMaterial({ color: 0xb8b2a6, roughness: 0.55 });
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 3.05, 8), rodMat);
      rod.position.set(0, 1.525, -0.55);
      rootGroup.add(rod);
      [0.85, 1.56, 2.21, 2.95].forEach((tickY) => {
        const tick = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.012, 0.012), rodMat);
        tick.position.set(0, tickY, -0.55);
        rootGroup.add(tick);
      });
    } else {
      const rig = buildHomininRig(mode, boneTex, shadowTex, isSoftwareGl);
      rootGroup.add(rig.root);
      rigs.push(rig);

      outlineBundles.push(
        attachBiomechanicsOutlineShader(
          rig.skeletonGroup,
          mode === 'australopithecus' ? 'australopithecus' : 'homo',
          outlineOpts
        ),
        attachBiomechanicsOutlineShader(rig.tendonsGroup, 'tendon', outlineOpts)
      );
    }

    // Apply initial layer visibility
    rigs.forEach((r) => {
      r.skeletonGroup.visible = showSkeleton;
      r.tendonsGroup.visible = showTendons;
      r.vectorsGroup.visible = showVectors;
    });

    // Place 6 anatomical hotspots aligned to active figure geometry
    const hotspotGroup = new THREE.Group();
    const hotspotNodes: Array<{ id: string; obj: THREE.Object3D }> = [];
    const xOffset = mode === 'comparativa' ? 0.98 : 0;
    const yScale = mode === 'australopithecus' ? 0.78 : 1.0;

    BIOMECHANICS_HOTSPOTS.forEach((hs) => {
      const adjustedPos: [number, number, number] = [
        hs.position[0] + xOffset,
        hs.position[1] * yScale,
        hs.position[2],
      ];
      const node = buildHotspotNode(hs, adjustedPos);
      hotspotGroup.add(node);
      hotspotNodes.push({ id: hs.id, obj: node });
    });
    rootGroup.add(hotspotGroup);

    // Pre-allocated math helpers
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    const projScratch = new THREE.Vector3();
    const camGoal = new THREE.Vector3(...initialPos);
    const targetGoal = new THREE.Vector3(...initialTarget);
    let isTransitioning = false;
    let smoothedSep = superpositionRef.current;
    let lastProjected: ProjectedARPoint[] = [];
    let currentViewW = width;
    let currentViewH = height;
    setViewportSize({ width, height });

    const syncProjectedHotspots = () => {
      let changed = lastProjected.length !== hotspotNodes.length;
      const next: ProjectedARPoint[] = hotspotNodes.map((item, idx) => {
        item.obj.getWorldPosition(projScratch);
        projScratch.project(camera);
        const visible = projScratch.z >= -1 && projScratch.z <= 1;
        const x = (projScratch.x * 0.5 + 0.5) * currentViewW;
        const y = (-projScratch.y * 0.5 + 0.5) * currentViewH;
        const prev = lastProjected[idx];
        if (
          !prev ||
          prev.visible !== visible ||
          Math.abs(prev.x - x) > 1.5 ||
          Math.abs(prev.y - y) > 1.5
        ) {
          changed = true;
        }
        return { id: item.id, x, y, visible };
      });
      if (changed) {
        lastProjected = next;
        setProjectedPoints(next);
      }
    };

    let rafId: number | null = null;
    let pendingTimerId: number | null = null;
    const registerTimer = (id: number) => {
      if (pendingTimerId !== null) window.clearTimeout(pendingTimerId);
      pendingTimerId = id;
    };
    let isInViewport = true;
    let isPageVisible = typeof document === 'undefined' ? true : !document.hidden;
    let lastClockMs = performance.now();
    let lastTelemetrySyncMs = 0;
    let lastTourUiSyncMs = 0;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderOnce = () => {
      rafId = null;
      const now = performance.now();
      const dt = Math.min((now - lastClockMs) / 1000, 0.05);
      lastClockMs = now;

      let needsMoreFrames = false;

      if (comparativeRigs.length === 2) {
        if (guidedTourActiveRef.current && !guidedTourPausedRef.current) {
          const rt = tourRuntimeRef.current;
          const stop = GUIDED_TOUR_STOPS[rt.stopIndex] ?? GUIDED_TOUR_STOPS[0];
          needsMoreFrames = true;

          if (rt.subPhase === 'moving') {
            rt.elapsed += dt;
            const t = prefersReducedMotion ? 1 : Math.min(1, rt.elapsed / TOUR_MOVE_SECONDS);
            const ease = t * t * (3 - 2 * t);

            let deltaPhase = stop.targetPhase - rt.startGaitPhase;
            if (deltaPhase < 0) deltaPhase += 1;
            const isSamePhase = deltaPhase < 0.015 || deltaPhase > 0.985;
            gaitPhaseRef.current = isSamePhase
              ? stop.targetPhase
              : (rt.startGaitPhase + deltaPhase * ease) % 1;

            const targetAz = prefersReducedMotion
              ? (stop.azStart + stop.azEnd) * 0.5
              : stop.azStart;
            const desiredX = stop.target[0] + Math.sin(targetAz) * stop.radius;
            const desiredY = stop.elevation;
            const desiredZ = stop.target[2] + Math.cos(targetAz) * stop.radius;

            if (isSoftwareGl || prefersReducedMotion) {
              camera.position.set(desiredX, desiredY, desiredZ);
              controls.target.set(stop.target[0], stop.target[1], stop.target[2]);
            } else {
              camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredX, 5.2, dt);
              camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredY, 5.2, dt);
              camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredZ, 5.2, dt);
              controls.target.x = THREE.MathUtils.damp(controls.target.x, stop.target[0], 6.0, dt);
              controls.target.y = THREE.MathUtils.damp(controls.target.y, stop.target[1], 6.0, dt);
              controls.target.z = THREE.MathUtils.damp(controls.target.z, stop.target[2], 6.0, dt);
            }

            if (t >= 1) {
              gaitPhaseRef.current = stop.targetPhase;
              rt.subPhase = 'paused';
              rt.elapsed = 0;
              setGuidedSubPhase('paused');
              setGuidedProgress(0);
              setLiveTelemetry(evaluateRunningTelemetry(stop.targetPhase));
            } else if (now - lastTelemetrySyncMs > 90) {
              lastTelemetrySyncMs = now;
              setLiveTelemetry(evaluateRunningTelemetry(gaitPhaseRef.current));
            }
          } else {
            // Paused cleanly on the biomechanical peak while gently orbiting camera around pelvis/spine
            rt.elapsed += dt;
            gaitPhaseRef.current = stop.targetPhase;
            const t = Math.min(1, rt.elapsed / TOUR_PAUSE_SECONDS);
            const az = prefersReducedMotion
              ? (stop.azStart + stop.azEnd) * 0.5
              : THREE.MathUtils.lerp(stop.azStart, stop.azEnd, t);
            const desiredX = stop.target[0] + Math.sin(az) * stop.radius;
            const desiredY = stop.elevation;
            const desiredZ = stop.target[2] + Math.cos(az) * stop.radius;

            if (isSoftwareGl || prefersReducedMotion) {
              camera.position.set(desiredX, desiredY, desiredZ);
              controls.target.set(stop.target[0], stop.target[1], stop.target[2]);
            } else {
              camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredX, 4.8, dt);
              camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredY, 4.8, dt);
              camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredZ, 4.8, dt);
              controls.target.x = THREE.MathUtils.damp(controls.target.x, stop.target[0], 6.0, dt);
              controls.target.y = THREE.MathUtils.damp(controls.target.y, stop.target[1], 6.0, dt);
              controls.target.z = THREE.MathUtils.damp(controls.target.z, stop.target[2], 6.0, dt);
            }

            if (now - lastTourUiSyncMs > 90) {
              lastTourUiSyncMs = now;
              setGuidedProgress(t);
            }

            if (t >= 1) {
              const nextIdx = (rt.stopIndex + 1) % GUIDED_TOUR_STOPS.length;
              const nextStop = GUIDED_TOUR_STOPS[nextIdx];
              rt.stopIndex = nextIdx;
              rt.subPhase = 'moving';
              rt.elapsed = 0;
              rt.startGaitPhase = gaitPhaseRef.current;
              setGuidedStopIndex(nextIdx);
              setGuidedSubPhase('moving');
              setGuidedProgress(0);
              setSuperposition(nextStop.superposition);
              const hs = BIOMECHANICS_HOTSPOTS.find((h) => h.id === nextStop.hotspotId);
              if (hs) setActiveHotspot(hs);
            }
          }
        } else if (isPlayingRef.current) {
          gaitPhaseRef.current =
            (gaitPhaseRef.current + dt * playbackSpeedRef.current * 0.62) % 1;
          needsMoreFrames = true;
        }

        const sepTarget = superpositionRef.current;
        if (isSoftwareGl) {
          smoothedSep = sepTarget;
        } else if (Math.abs(smoothedSep - sepTarget) > 0.002) {
          smoothedSep = THREE.MathUtils.damp(smoothedSep, sepTarget, 8, dt);
          needsMoreFrames = true;
        } else {
          smoothedSep = sepTarget;
        }

        const halfDist = smoothedSep * 0.78;
        comparativeRigs[0].root.position.x = -halfDist;
        comparativeRigs[1].root.position.x = halfDist;
        hotspotGroup.position.x = halfDist;
        if (sagittalGridPlane) {
          sagittalGridPlane.visible = smoothedSep < 0.25;
        }

        comparativeRigs[0].updateGait(gaitPhaseRef.current, showHeatmapRef.current, smoothedSep);
        comparativeRigs[1].updateGait(gaitPhaseRef.current, showHeatmapRef.current, smoothedSep);
        if (primateOutlineBundle) {
          primateOutlineBundle.setOpacityScale(THREE.MathUtils.lerp(0.68, 1.0, smoothedSep));
        }

        if (!guidedTourActiveRef.current && isPlayingRef.current && now - lastTelemetrySyncMs > 90) {
          lastTelemetrySyncMs = now;
          setLiveTelemetry(evaluateRunningTelemetry(gaitPhaseRef.current));
        }
      }

      if (isTransitioning) {
        if (isSoftwareGl) {
          camera.position.copy(camGoal);
          controls.target.copy(targetGoal);
          isTransitioning = false;
        } else {
          camera.position.x = THREE.MathUtils.damp(camera.position.x, camGoal.x, 7, dt);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, camGoal.y, 7, dt);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, camGoal.z, 7, dt);
          controls.target.x = THREE.MathUtils.damp(controls.target.x, targetGoal.x, 7, dt);
          controls.target.y = THREE.MathUtils.damp(controls.target.y, targetGoal.y, 7, dt);
          controls.target.z = THREE.MathUtils.damp(controls.target.z, targetGoal.z, 7, dt);
          if (
            camera.position.distanceTo(camGoal) < 0.015 &&
            controls.target.distanceTo(targetGoal) < 0.015
          ) {
            camera.position.copy(camGoal);
            controls.target.copy(targetGoal);
            isTransitioning = false;
          } else {
            needsMoreFrames = true;
          }
        }
      }

      if (controls.enableDamping) {
        if (controls.update()) {
          needsMoreFrames = true;
        }
      } else {
        controls.update();
      }

      // Calibrate outline shader depth-cueing gradient to live camera orbit distance (zero allocations)
      if (showOutlinesRef.current && outlineBundles.length > 0) {
        const camDist = camera.position.distanceTo(controls.target);
        for (let i = 0; i < outlineBundles.length; i++) {
          outlineBundles[i].updateDepthRange(camDist);
        }
      }

      renderer.render(scene, camera);
      syncProjectedHotspots();

      if (needsMoreFrames && isInViewport && isPageVisible) {
        if (isSoftwareGl) {
          scheduleAfterDraw(renderer, requestRender, registerTimer);
        } else {
          requestRender();
        }
      }
    };

    const requestRender = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(renderOnce);
    };

    const flyTo = (pos: [number, number, number], target: [number, number, number]) => {
      camGoal.set(...pos);
      targetGoal.set(...target);
      isTransitioning = true;
      lastClockMs = performance.now();
      requestRender();
    };

    const captureFrameAndCamera = () => {
      renderer.render(scene, camera);
      const dataUrl = renderer.domElement.toDataURL('image/png');
      const dx = camera.position.x - controls.target.x;
      const dy = camera.position.y - controls.target.y;
      const dz = camera.position.z - controls.target.z;
      const distance = Math.hypot(dx, dy, dz);
      const horiz = Math.hypot(dx, dz);
      const azimuthDeg = (Math.atan2(dx, dz) * 180) / Math.PI;
      const elevationDeg = (Math.atan2(dy, Math.max(horiz, 0.0001)) * 180) / Math.PI;
      return {
        dataUrl,
        width: renderer.domElement.width,
        height: renderer.domElement.height,
        camera: {
          azimuthDeg,
          elevationDeg,
          distance,
          fovDeg: camera.fov,
          position: [camera.position.x, camera.position.y, camera.position.z] as [
            number,
            number,
            number,
          ],
          target: [controls.target.x, controls.target.y, controls.target.z] as [
            number,
            number,
            number,
          ],
        },
      };
    };

    sceneRefs.current = {
      requestRender,
      flyTo,
      captureFrameAndCamera,
      rigs,
      comparativeRigs,
      outlineBundles,
    };

    const onControlStart = () => {
      isTransitioning = false;
      setActiveCamId('custom');
      // Pause guided tour gracefully if the student manually drags the 3D scene
      if (guidedTourActiveRef.current && !guidedTourPausedRef.current) {
        setGuidedTourPaused(true);
      }
    };
    const onControlChange = () => {
      requestRender();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    const pickHotspot = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.layers.set(LAYER_HOTSPOT);
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(hotspotGroup.children, true);
      if (hits.length === 0) return null;
      const hs = hits[0].object.userData.hotspot as Hotspot3DInfo | undefined;
      if (!hs) return null;
      return {
        hotspot: hs,
        localX: clientX - rect.left,
        localY: clientY - rect.top,
        containerWidth: rect.width,
      };
    };

    let lastHoverTs = 0;
    let pointerDownPos: { x: number; y: number } | null = null;

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverTs < 40) return;
      lastHoverTs = now;
      const hit = pickHotspot(e.clientX, e.clientY);
      if (!hit) {
        renderer.domElement.style.cursor = 'grab';
        setTooltip(null);
        setHoveredHotspotId(null);
        return;
      }
      renderer.domElement.style.cursor = 'pointer';
      setHoveredHotspotId(hit.hotspot.id);
      setTooltip({
        title: hit.hotspot.title,
        subtitle: hit.hotspot.subtitle,
        accent: hit.hotspot.accent,
        x: hit.localX,
        y: hit.localY,
        containerWidth: hit.containerWidth,
      });
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!pointerDownPos) return;
      const moved = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      pointerDownPos = null;
      if (moved > 6) return;
      const hit = pickHotspot(e.clientX, e.clientY);
      if (hit) {
        if (guidedTourActiveRef.current) {
          setGuidedTourPaused(true);
        }
        setActiveHotspot(hit.hotspot);
        setArPanelOpen(true);
      }
    };

    const onPointerLeave = () => {
      setTooltip(null);
      setHoveredHotspotId(null);
    };
    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
      requestRender();
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const resizeObserver = new ResizeObserver(() => {
      const w = Math.max(container.clientWidth, 300);
      const h = Math.max(container.clientHeight, 300);
      currentViewW = w;
      currentViewH = h;
      setViewportSize({ width: w, height: h });
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      requestRender();
    });
    resizeObserver.observe(container);

    const visibilityObserver =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              const visible = entries.some((entry) => entry.isIntersecting);
              isInViewport = visible;
              if (visible && isPageVisible) {
                lastClockMs = performance.now();
                requestRender();
              }
            },
            { threshold: 0.01 }
          )
        : null;
    visibilityObserver?.observe(container);

    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible && isInViewport) {
        lastClockMs = performance.now();
        requestRender();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

      reportScene3DStage('biomechanics', 3, 94);
      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
      }

      cleanupScene = () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        if (pendingTimerId !== null) window.clearTimeout(pendingTimerId);
        resizeObserver.disconnect();
        visibilityObserver?.disconnect();
        document.removeEventListener('visibilitychange', onVisibilityChange);
        controls.removeEventListener('start', onControlStart);
        controls.removeEventListener('change', onControlChange);
        controls.dispose();
        renderer.domElement.removeEventListener('pointermove', onPointerMove);
        renderer.domElement.removeEventListener('pointerdown', onPointerDown);
        renderer.domElement.removeEventListener('pointerup', onPointerUp);
        renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
        renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
        renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
        disposeObject3DTree(rootGroup);
        boneTex.dispose();
        shadowTex.dispose();
        disposeStudio();
      };

      if (cancelled) {
        cleanupScene();
        cleanupScene = null;
        return;
      }

      requestRender();
      await yieldToPaint();
      if (!cancelled) {
        reportScene3DStage('biomechanics', 3, 100, 'Laboratorio biomecánico 3D listo');
        setSceneReady(true);
      }
    };

    void bootstrapScene();

    return () => {
      cancelled = true;
      if (cleanupScene) {
        cleanupScene();
        cleanupScene = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Sync anatomical layer toggles, outline shader, heatmap, superposition & playback without tearing down WebGL
  useEffect(() => {
    sceneRefs.current.rigs.forEach((r) => {
      r.skeletonGroup.visible = showSkeleton;
      r.tendonsGroup.visible = showTendons;
      r.vectorsGroup.visible = showVectors;
    });
    sceneRefs.current.comparativeRigs.forEach((r) => {
      r.skeletonGroup.visible = showSkeleton;
      r.tendonsGroup.visible = showTendons;
      r.vectorsGroup.visible = showVectors;
    });
    sceneRefs.current.outlineBundles.forEach((bundle) => {
      bundle.setEnabled(showOutlines);
      bundle.setThicknessScale(outlineScale);
    });
    sceneRefs.current.requestRender();
  }, [
    showSkeleton,
    showTendons,
    showVectors,
    showHeatmap,
    showOutlines,
    outlineScale,
    superposition,
    isPlaying,
    playbackSpeed,
    guidedTourActive,
    guidedTourPaused,
    guidedStopIndex,
  ]);

  const jumpToGuidedStop = (index: number) => {
    const safeIdx = ((index % GUIDED_TOUR_STOPS.length) + GUIDED_TOUR_STOPS.length) % GUIDED_TOUR_STOPS.length;
    const stop = GUIDED_TOUR_STOPS[safeIdx];
    tourRuntimeRef.current = {
      stopIndex: safeIdx,
      subPhase: 'moving',
      elapsed: 0,
      startGaitPhase: gaitPhaseRef.current,
    };
    setGuidedStopIndex(safeIdx);
    setGuidedSubPhase('moving');
    setGuidedProgress(0);
    setGuidedTourPaused(false);
    setSuperposition(stop.superposition);
    const hs = BIOMECHANICS_HOTSPOTS.find((h) => h.id === stop.hotspotId);
    if (hs) setActiveHotspot(hs);
    sceneRefs.current.requestRender();
  };

  const handleToggleGuidedTour = () => {
    if (guidedTourActive) {
      setGuidedTourActive(false);
      setGuidedTourPaused(false);
      setGuidedProgress(0);
      return;
    }
    if (mode !== 'vista-comparativa') {
      setMode('vista-comparativa');
    }
    setShowSkeleton(true);
    setShowHeatmap(true);
    setShowOutlines(true);
    setIsPlaying(false);
    setArPanelOpen(false);
    setGuidedTourActive(true);
    jumpToGuidedStop(0);
  };

  const handleScrubPhase = (nextPhase: number) => {
    const clamped = Math.max(0, Math.min(0.99, nextPhase));
    if (guidedTourActive) setGuidedTourPaused(true);
    gaitPhaseRef.current = clamped;
    setIsPlaying(false);
    setLiveTelemetry(evaluateRunningTelemetry(clamped));
    sceneRefs.current.requestRender();
  };

  const handleCameraPreset = (presetId: string) => {
    if (guidedTourActive) setGuidedTourPaused(true);
    setActiveCamId(presetId);
    const preset =
      BIOMECHANICS_3D_CAMERAS.find((p) => p.id === presetId) ?? BIOMECHANICS_3D_CAMERAS[0];
    if (mode === 'comparativa' && presetId === 'full') {
      sceneRefs.current.flyTo([0.15, 2.15, 5.95], [0, 1.45, 0]);
      return;
    }
    if (mode === 'vista-comparativa' && presetId === 'full') {
      sceneRefs.current.flyTo([3.25, 1.92, 4.15], [0, 1.44, 0]);
      return;
    }
    const xShift = mode === 'comparativa' ? 0.98 : 0;
    const yScale = mode === 'australopithecus' ? 0.8 : 1;
    sceneRefs.current.flyTo(
      [preset.position[0] + xShift, preset.position[1] * yScale, preset.position[2]],
      [preset.target[0] + xShift, preset.target[1] * yScale, preset.target[2]]
    );
  };

  const handleFocusHotspot = (hs: Hotspot3DInfo, openArDrawer = true) => {
    if (guidedTourActive) setGuidedTourPaused(true);
    setActiveHotspot(hs);
    if (openArDrawer) {
      setArPanelOpen(true);
    }
    const xShift =
      mode === 'comparativa'
        ? 0.98
        : mode === 'vista-comparativa'
          ? superposition * 0.78
          : 0;
    const yScale = mode === 'australopithecus' ? 0.78 : 1;
    const ty = hs.position[1] * yScale;
    sceneRefs.current.flyTo([1.45 + xShift, ty + 0.25, 2.3], [xShift, ty, 0]);
  };

  const handleActivateHotspotById = (id: string) => {
    const found = BIOMECHANICS_HOTSPOTS.find((h) => h.id === id);
    if (found) {
      handleFocusHotspot(found, true);
    }
  };

  const handleOpenReportExport = () => {
    const isTourSnapshot = guidedTourActive;
    if (isTourSnapshot) setGuidedTourPaused(true);
    const captured = sceneRefs.current.captureFrameAndCamera();
    if (!captured) return;

    const modeLabels: Record<BiomechanicsModeId, { label: string; species: string }> = {
      'vista-comparativa': {
        label: 'Vista comparativa (Primate no humano vs. Homo sapiens)',
        species: 'Pan troglodytes vs. Homo sapiens',
      },
      homo: {
        label: 'Carrera de resistencia (Homo sapiens)',
        species: 'Homo sapiens',
      },
      australopithecus: {
        label: 'Bipedismo temprano (Australopithecus afarensis)',
        species: 'Australopithecus afarensis',
      },
      comparativa: {
        label: 'Comparativa fósil (A. afarensis vs. Homo)',
        species: 'A. afarensis vs. Homo',
      },
    };

    const camPreset = BIOMECHANICS_3D_CAMERAS.find((p) => p.id === activeCamId);
    const presetLabel = isTourSnapshot
      ? `Visita guiada · Etapa ${activeGuidedStop.stepNumber}`
      : camPreset?.label ?? 'Vista orbital personalizada';

    const outlineWeightLabel =
      outlinePreset === 'fine' ? 'Fino' : outlinePreset === 'bold' ? 'Marcado' : 'Medio';

    const telemetryNow = evaluateRunningTelemetry(gaitPhaseRef.current);
    const stageMeta = RUNNING_CYCLE_PHASES[telemetryNow.phaseIndex] ?? RUNNING_CYCLE_PHASES[0];
    const supPct = Math.round(superposition * 100);
    const supLabel =
      supPct <= 15
        ? 'Esqueletos superpuestos (0% separación)'
        : supPct >= 85
          ? 'Vista lado a lado (100% separación)'
          : `Separación intermedia (${supPct}%)`;

    const now = new Date();
    const capturedAt = now.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setReportSnapshot({
      capturedImageDataUrl: captured.dataUrl,
      imageWidth: captured.width,
      imageHeight: captured.height,
      capturedAt,
      modeId: mode,
      modeLabel: modeLabels[mode].label,
      speciesLabel: modeLabels[mode].species,
      camera: {
        ...captured.camera,
        presetLabel,
      },
      layers: {
        skeleton: showSkeleton,
        tendons: showTendons,
        vectors: showVectors,
        heatmap: showHeatmap,
        outlines: showOutlines,
        outlineWeightLabel,
        arPins: showArPins,
      },
      comparative: {
        isComparativeMode: mode === 'vista-comparativa',
        superpositionPercent: supPct,
        superpositionLabel: supLabel,
        gaitPhasePercent: Math.round(telemetryNow.phase * 100),
        gaitStageLabel: stageMeta.label,
        telemetry: telemetryNow,
      },
      guidedTour: {
        active: guidedTourActive,
        stageLabel: guidedTourActive ? activeGuidedStop.stageTitle : null,
      },
      activeHotspot,
      studentName: '',
      studentNotes: '',
    });
  };

  const isComparativeOverlay = mode === 'vista-comparativa';

  return (
    <div className="bg-paper border border-hairline flex flex-col">
      {/* Mode Selector Bar */}
      <div className="p-3.5 border-b border-hairline bg-paper flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              {
                id: 'vista-comparativa',
                label: 'Vista comparativa (Primate vs. H. sapiens)',
              },
              { id: 'homo', label: 'Carrera de resistencia (Homo)' },
              { id: 'australopithecus', label: 'Bipedismo temprano (A. afarensis)' },
              { id: 'comparativa', label: 'Comparativa fósil (A. afarensis vs. Homo)' },
            ] as const
          ).map((item) => {
            const isSelected = mode === item.id;
            const isFlagship = item.id === 'vista-comparativa';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id !== 'vista-comparativa' && guidedTourActive) {
                    setGuidedTourActive(false);
                  }
                  setMode(item.id);
                  setActiveCamId('full');
                }}
                aria-pressed={isSelected}
                className={`min-h-[36px] px-3 py-1.5 font-mono text-xs border rounded cursor-pointer transition-colors text-left sm:whitespace-nowrap ${
                  isSelected
                    ? isFlagship
                      ? 'bg-ochre text-white border-ochre font-semibold'
                      : 'bg-ink text-white border-ink'
                    : 'bg-canvas text-ink border-hairline hover:border-ink'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleToggleGuidedTour}
            aria-pressed={guidedTourActive}
            className={`min-h-[38px] px-3.5 py-1.5 font-mono text-xs font-semibold border rounded cursor-pointer transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 ${
              guidedTourActive
                ? 'bg-forest text-white border-forest'
                : 'bg-ink text-white border-ink hover:bg-ochre hover:border-ochre'
            }`}
          >
            <Compass className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>
              {guidedTourActive ? 'Visita guiada activa' : 'Visita guiada (pelvis y columna)'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleOpenReportExport}
            disabled={!sceneReady || contextLost}
            className="min-h-[38px] px-3.5 py-1.5 font-mono text-xs font-semibold bg-paper hover:bg-ink hover:text-white disabled:opacity-50 text-ink border border-ink rounded cursor-pointer transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <FileDown className="w-3.5 h-3.5 shrink-0 text-ochre" aria-hidden="true" />
            <span>Exportar informe</span>
          </button>
        </div>
      </div>

      {/* Non-Occluding Species / Comparative Legend Strip ABOVE the 3D Stage */}
      {(isComparativeOverlay || mode === 'comparativa') && (
        <div className="px-4 py-2.5 bg-[#12161f] border-b border-white/15 flex flex-wrap items-center justify-between gap-2.5 text-[#f3efe6]">
          {isComparativeOverlay ? (
            <>
              <div className="font-mono text-[11.5px] flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-[#74b0ed] border border-white/60 shrink-0" />
                <span>
                  <strong className="text-[#8ec4ff]">Pan troglodytes</strong>{' '}
                  <span className="text-[#c7c2b6]">
                    (primate no humano · pelvis plana, columna en C)
                  </span>
                </span>
              </div>
              <div className="font-mono text-[11.5px] flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-[#f5edd9] border border-[#e06636] shrink-0" />
                <span>
                  <strong className="text-[#f2c178]">Homo sapiens</strong>{' '}
                  <span className="text-[#c7c2b6]">(pelvis en cuenca, lordosis en S)</span>
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="font-mono text-[11.5px] text-[#7ae0ba]">
                Izq.: <em>Australopithecus afarensis</em> (~3,2 Ma · 1,25 m)
              </div>
              <div className="font-mono text-[11.5px] text-[#f2c178]">
                Der.: <em>Homo erectus / sapiens</em> (~1,8 Ma–hoy · 1,75 m)
              </div>
            </>
          )}
        </div>
      )}

      {/* 3D Biomechanical Canvas (100% Unobstructed High-Contrast Museum Display Stage) */}
      <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[520px] bg-[#161b23] overflow-hidden select-none">
        <div
          ref={mountRef}
          className="w-full h-full"
          aria-label="Esquema biomecánico 3D interactivo del bipedismo y la carrera de resistencia"
        />

        {/* Branded Staged Hydration Overlay until First WebGL Frame */}
        <Scene3DHydrationOverlay
          sceneId="biomechanics"
          isReady={sceneReady}
          onFallbackTo2D={onFallbackTo2D}
        />

        {/* WebGL Context Lost Fallback */}
        {contextLost && (
          <div className="absolute inset-0 bg-[#161b23] text-[#f3efe6] flex flex-col items-center justify-center p-6 text-center gap-3 z-20">
            <p className="font-display text-lg font-semibold text-white m-0">
              No se pudo mantener el visor WebGL 3D
            </p>
            <p className="text-sm text-[#c7c2b6] max-w-md m-0">
              Puedes consultar todos los rasgos anatómicos comparados en la tabla 2D del Tema 04.
            </p>
            {onFallbackTo2D && (
              <button
                type="button"
                onClick={onFallbackTo2D}
                className="min-h-[40px] px-4 py-2 font-mono text-xs bg-white text-[#12161f] border border-white rounded cursor-pointer font-semibold"
              >
                Volver a la tabla comparativa 2D
              </button>
            )}
          </div>
        )}

        {/* Hover Tooltip (only when AR side drawer is closed to avoid double overlays) */}
        {tooltip && !contextLost && !arPanelOpen && (
          <div
            className="pointer-events-none absolute z-10 max-w-[248px] bg-[#10141c] border border-white/30 px-3 py-2 shadow-lg text-[#f3efe6]"
            style={{
              left: `${Math.min(Math.max(tooltip.x + 14, 10), Math.max(10, tooltip.containerWidth - 262))}px`,
              top: `${Math.max(tooltip.y - 54, 10)}px`,
            }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 shrink-0"
                style={{ backgroundColor: tooltip.accent }}
              />
              <span className="font-display text-xs font-semibold text-white leading-tight">
                {tooltip.title}
              </span>
            </div>
            <div className="font-mono text-[10.5px] text-[#c7c2b6] mt-0.5 leading-snug">
              {tooltip.subtitle}
            </div>
            <div className="font-mono text-[10px] text-[#f2c178] mt-1">
              Pulsa para abrir ficha RA del glosario
            </div>
          </div>
        )}

        {/* Immersive AR Spatial Reticles, Non-Overlapping Callouts & Side Glossary Summary Window */}
        {!contextLost && sceneReady && (
          <ARHotspotOverlay
            hotspots={BIOMECHANICS_HOTSPOTS}
            projectedPoints={projectedPoints}
            viewportSize={viewportSize}
            activeHotspotId={activeHotspot.id}
            hoveredHotspotId={hoveredHotspotId}
            isPanelOpen={arPanelOpen}
            showSpatialPins={showArPins}
            theme="dark"
            sceneLabel="Biomecánica 3D · RA"
            onActivateHotspot={handleActivateHotspotById}
            onClosePanel={() => setArPanelOpen(false)}
          />
        )}
      </div>

      {/* Non-Occluding Guided Tour ("Visita Guiada") Stage Narration & Stepper Strip */}
      {guidedTourActive && isComparativeOverlay && (
        <div
          role="region"
          aria-label="Narración de la visita guiada biomecánica"
          className="bg-[#12161f] text-[#f3efe6] border-t border-white/15 px-4 sm:px-5 py-3.5 flex flex-col gap-3"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1 min-w-0 max-w-3xl" aria-live="polite" aria-atomic="true">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="px-2 py-0.5 bg-ochre text-white font-semibold tabular-nums">
                  Etapa {activeGuidedStop.stepNumber} / {GUIDED_TOUR_STOPS.length}
                </span>
                <span className="text-[#f2c178] font-semibold">
                  {activeGuidedStop.stageTitle}
                </span>
                <span className="text-white/40" aria-hidden="true">
                  ·
                </span>
                <span className="text-[#8ec4ff]">
                  {guidedTourPaused
                    ? 'En pausa manual (control libre de cámara)'
                    : guidedSubPhase === 'moving'
                      ? 'Avanzando ciclo de carrera y encuadre…'
                      : 'Pausa en pico biomecánico · Rotando cámara 3D'}
                </span>
              </div>
              <div className="font-display text-sm sm:text-base font-semibold text-white leading-snug">
                {activeGuidedStop.focusLabel}
              </div>
              <p data-keep-compact="true" className="text-xs sm:text-[13px] leading-relaxed text-[#d4cfc3] m-0">
                {activeGuidedStop.anatomicalCallout}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setGuidedTourPaused(true);
                  const hs = BIOMECHANICS_HOTSPOTS.find(
                    (h) => h.id === activeGuidedStop.hotspotId
                  );
                  if (hs) setActiveHotspot(hs);
                  setArPanelOpen(true);
                }}
                className="min-h-[36px] px-2.5 py-1 font-mono text-xs bg-[#222938] hover:border-[#f2c178] text-[#f2c178] border border-[#f2c178]/50 rounded inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ficha anatómica</span>
              </button>

              <button
                type="button"
                onClick={() => jumpToGuidedStop(guidedStopIndex - 1)}
                aria-label="Etapa anterior de la visita guiada"
                className="min-h-[36px] px-2.5 py-1 font-mono text-xs bg-[#1b202b] hover:border-white text-[#f3efe6] border border-white/25 rounded inline-flex items-center gap-1 cursor-pointer"
              >
                <SkipBack className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Anterior</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGuidedTourPaused((p) => !p);
                  sceneRefs.current.requestRender();
                }}
                className="min-h-[36px] px-3 py-1 font-mono text-xs bg-white text-[#12161f] border border-white rounded font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                {guidedTourPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Reanudar</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Pausar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => jumpToGuidedStop(guidedStopIndex + 1)}
                aria-label="Siguiente etapa de la visita guiada"
                className="min-h-[36px] px-2.5 py-1 font-mono text-xs bg-[#1b202b] hover:border-white text-[#f3efe6] border border-white/25 rounded inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Siguiente</span>
                <SkipForward className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => setGuidedTourActive(false)}
                aria-label="Salir del modo visita guiada"
                className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center bg-[#1b202b] hover:border-white text-[#c7c2b6] hover:text-white border border-white/25 rounded cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* 4-Stage Interactive Progress Stepper */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {GUIDED_TOUR_STOPS.map((stop, idx) => {
              const isCurrent = idx === guidedStopIndex;
              const isDone = idx < guidedStopIndex;
              return (
                <button
                  key={stop.id}
                  type="button"
                  onClick={() => jumpToGuidedStop(idx)}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`text-left px-2.5 py-1.5 border rounded cursor-pointer transition-colors flex flex-col gap-1 ${
                    isCurrent
                      ? 'bg-[#1b2230] border-[#f2c178] text-white'
                      : 'bg-[#161b23] border-white/15 text-[#c7c2b6] hover:border-white/40'
                  }`}
                >
                  <span className="font-mono text-[10.5px] truncate">
                    {stop.stepNumber}. {stop.stageTitle}
                  </span>
                  <div className="h-1 w-full bg-white/15 overflow-hidden">
                    <div
                      className="h-full bg-[#e06636] origin-left transition-transform duration-100 motion-reduce:transition-none"
                      style={{
                        transform: `scaleX(${
                          isDone ? 1 : isCurrent ? (guidedSubPhase === 'paused' ? guidedProgress : 0.08) : 0
                        })`,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Attached Studio Control Deck BELOW the 3D Viewport (Zero Canvas Occlusion) */}
      <div className="border-t border-hairline bg-canvas px-4 py-2.5 flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setDockExpanded((v) => !v)}
            aria-expanded={dockExpanded}
            className="min-h-[36px] px-3 py-1 bg-paper border border-hairline hover:border-ink font-mono text-xs text-ink inline-flex items-center gap-1.5 rounded cursor-pointer transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
            <span>
              {dockExpanded ? 'Ocultar controles 3D' : 'Mostrar controles 3D, capas y ciclo de carrera'}
            </span>
            {dockExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </button>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowArPins((v) => !v)}
              aria-pressed={showArPins}
              className={`min-h-[36px] px-2.5 py-1 font-mono text-xs border rounded cursor-pointer transition-colors inline-flex items-center gap-1.5 whitespace-nowrap ${
                showArPins
                  ? 'bg-forest text-white border-forest'
                  : 'bg-paper text-ink-muted border-hairline hover:border-ink'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Etiquetas RA</span>
            </button>

            <button
              type="button"
              onClick={() => handleCameraPreset('full')}
              className="min-h-[36px] px-2.5 py-1 font-mono text-xs text-ink-muted hover:text-ink border border-hairline hover:border-ink rounded inline-flex items-center gap-1.5 cursor-pointer bg-paper whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reiniciar vista</span>
            </button>
          </div>
        </div>

        {dockExpanded && (
          <div className="pt-2.5 border-t border-hairline flex flex-col gap-2.5">
            {/* Row 1: Camera Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-xs text-ink-muted mr-1">Enfoque:</span>
              {BIOMECHANICS_3D_CAMERAS.map((cam) => (
                <button
                  key={cam.id}
                  type="button"
                  onClick={() => handleCameraPreset(cam.id)}
                  aria-pressed={activeCamId === cam.id}
                  className={`min-h-[36px] px-2.5 py-1 font-mono text-xs border rounded cursor-pointer transition-colors whitespace-nowrap ${
                    activeCamId === cam.id
                      ? 'bg-ink text-white border-ink'
                      : 'bg-paper text-ink border-hairline hover:border-ink'
                  }`}
                >
                  {cam.label}
                </button>
              ))}
            </div>

            {/* Row 2: Anatomical Layers + Dynamic Heatmap Toggle */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-hairline">
              <span className="font-mono text-xs text-ink-muted inline-flex items-center gap-1 mr-1">
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Capas:</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSkeleton((v) => !v)}
                aria-pressed={showSkeleton}
                className={`min-h-[36px] px-2.5 py-1 font-mono text-xs border rounded cursor-pointer transition-colors whitespace-nowrap ${
                  showSkeleton
                    ? 'bg-ink text-white border-ink'
                    : 'bg-paper text-ink-muted border-hairline hover:border-ink'
                }`}
              >
                Esqueleto óseo
              </button>
              <button
                type="button"
                onClick={() => setShowTendons((v) => !v)}
                aria-pressed={showTendons}
                className={`min-h-[36px] px-2.5 py-1 font-mono text-xs border rounded cursor-pointer transition-colors whitespace-nowrap ${
                  showTendons
                    ? 'bg-ochre text-white border-ochre'
                    : 'bg-paper text-ink-muted border-hairline hover:border-ink'
                }`}
              >
                Tendones y músculos
              </button>
              <button
                type="button"
                onClick={() => setShowVectors((v) => !v)}
                aria-pressed={showVectors}
                className={`min-h-[36px] px-2.5 py-1 font-mono text-xs border rounded cursor-pointer transition-colors whitespace-nowrap ${
                  showVectors
                    ? 'bg-lapis text-white border-lapis'
                    : 'bg-paper text-ink-muted border-hairline hover:border-ink'
                }`}
              >
                Eje CM y vectores
              </button>
              {isComparativeOverlay && (
                <button
                  type="button"
                  onClick={() => setShowHeatmap((v) => !v)}
                  aria-pressed={showHeatmap}
                  className={`min-h-[36px] px-2.5 py-1 font-mono text-xs border rounded cursor-pointer transition-colors inline-flex items-center gap-1.5 whitespace-nowrap ${
                    showHeatmap
                      ? 'bg-crimson text-white border-crimson'
                      : 'bg-paper text-ink-muted border-hairline hover:border-ink'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Heatmap pelvis/columna</span>
                </button>
              )}

              {/* Custom GLSL Outline Shader Toggle + Contour Stroke Weight Selector */}
              <button
                type="button"
                onClick={() => setShowOutlines((v) => !v)}
                aria-pressed={showOutlines}
                className={`min-h-[36px] px-2.5 py-1 font-mono text-xs border rounded cursor-pointer transition-colors inline-flex items-center gap-1.5 whitespace-nowrap ${
                  showOutlines
                    ? 'bg-ink text-white border-ink'
                    : 'bg-paper text-ink-muted border-hairline hover:border-ink'
                }`}
              >
                <Scan className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Contornos 3D</span>
              </button>

              {showOutlines && (
                <div
                  role="group"
                  aria-label="Grosor del shader de contorno anatómico"
                  className="inline-flex items-center border border-hairline rounded overflow-hidden bg-paper"
                >
                  {(
                    [
                      { id: 'fine', label: 'Fino' },
                      { id: 'standard', label: 'Medio' },
                      { id: 'bold', label: 'Marcado' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setOutlinePreset(opt.id)}
                      aria-pressed={outlinePreset === opt.id}
                      className={`min-h-[34px] px-2 py-1 font-mono text-[11px] cursor-pointer transition-colors whitespace-nowrap ${
                        outlinePreset === opt.id
                          ? 'bg-ochre text-white font-semibold'
                          : 'bg-paper text-ink-muted hover:text-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Row 3: Running Cycle Kinematics & Skeleton Superposition Controls */}
            {isComparativeOverlay && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-2 border-t border-hairline">
                <div className="md:col-span-7 flex flex-wrap sm:flex-nowrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isPlaying && guidedTourActive) {
                        setGuidedTourActive(false);
                        setGuidedTourPaused(false);
                      }
                      setIsPlaying((p) => !p);
                    }}
                    className="min-h-[36px] px-3 py-1 font-mono text-xs bg-ink text-white border border-ink rounded hover:bg-ochre hover:border-ochre transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Pausar</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Correr</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlaybackSpeed((s) => (s === 0.5 ? 1 : 0.5))}
                    className="min-h-[36px] px-2.5 py-1 font-mono text-xs bg-paper text-ink border border-hairline hover:border-ink rounded cursor-pointer tabular-nums whitespace-nowrap shrink-0"
                    title="Velocidad del ciclo de carrera"
                  >
                    {playbackSpeed === 0.5 ? '0,5×' : '1,0×'}
                  </button>
                  <label className="flex-1 flex items-center gap-2 min-w-[160px]">
                    <span className="font-mono text-xs text-ink-muted whitespace-nowrap">
                      Ciclo
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={99}
                      step={1}
                      value={Math.round(liveTelemetry.phase * 100)}
                      onChange={(e) => handleScrubPhase(Number(e.target.value) / 100)}
                      aria-label="Fase del ciclo de carrera"
                      className="w-full accent-[#b43c0b] cursor-pointer"
                    />
                    <span className="font-mono text-xs font-semibold text-ink tabular-nums w-9 text-right shrink-0">
                      {Math.round(liveTelemetry.phase * 100)}%
                    </span>
                  </label>
                </div>

                <div className="md:col-span-5 flex items-center gap-2 border-t md:border-t-0 md:border-l border-hairline pt-2 md:pt-0 md:pl-3">
                  <button
                    type="button"
                    onClick={() => setSuperposition(0)}
                    className={`min-h-[36px] px-1.5 font-mono text-xs cursor-pointer whitespace-nowrap ${
                      superposition < 0.25 ? 'text-ochre font-semibold' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Superpuestos
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={Math.round(superposition * 100)}
                    onChange={(e) => setSuperposition(Number(e.target.value) / 100)}
                    aria-label="Separación entre el esqueleto del primate no humano y Homo sapiens"
                    className="flex-1 accent-[#1f5fa8] cursor-pointer min-w-[60px]"
                  />
                  <button
                    type="button"
                    onClick={() => setSuperposition(1)}
                    className={`min-h-[36px] px-1.5 font-mono text-xs cursor-pointer whitespace-nowrap ${
                      superposition > 0.75 ? 'text-lapis font-semibold' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Paralelos
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dynamic Pelvis & Spine Biomechanical Heatmap Readout (Below Canvas, Non-Occluding) */}
      {isComparativeOverlay && (
        <div className="border-t border-hairline bg-paper p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-hairline">
            <div className="flex flex-col gap-0.5">
              <div className="font-mono text-[11px] text-ochre font-semibold">
                Mapa de calor dinámico · {activeRunningPhase.label} ({activeRunningPhase.rangeLabel})
              </div>
              <p className="text-xs leading-relaxed text-ink-muted max-w-[76ch] m-0">
                {activeRunningPhase.biomechanicalNote}
              </p>
            </div>

            {/* Scientific Thermal Scale Bar */}
            <div className="flex flex-col gap-1 min-w-[210px] shrink-0">
              <div className="flex justify-between font-mono text-[10px] text-ink-muted">
                <span>Carga óptima</span>
                <span>Moderada</span>
                <span>Cizalla crítica</span>
              </div>
              <div
                className="h-2.5 w-full border border-hairline"
                style={{
                  background:
                    'linear-gradient(90deg, #156f55 0%, #d49a1a 38%, #d95216 72%, #b42318 100%)',
                }}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pelvis Stress Comparison */}
            <div className="bg-canvas border border-hairline p-3.5 flex flex-col gap-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-sm font-semibold text-ink">
                  Pelvis · Estabilidad lateral y articulación sacroilíaca
                </span>
                <span className="font-mono text-[10.5px] text-ink-muted tabular-nums">
                  Basculación: {liveTelemetry.primatePelvicTiltDeg.toFixed(1)}° vs.{' '}
                  {liveTelemetry.homoPelvicTiltDeg.toFixed(1)}°
                </span>
              </div>

              <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-32 text-lapis shrink-0">Pan troglodytes</span>
                  <div className="flex-1 h-2 bg-surface-high overflow-hidden">
                    <div
                      className="h-full w-full bg-crimson origin-left transition-transform duration-100 motion-reduce:transition-none"
                      style={{ transform: `scaleX(${liveTelemetry.primatePelvisLoad})` }}
                    />
                  </div>
                  <span className="w-10 text-right tabular-nums font-semibold text-crimson">
                    {Math.round(liveTelemetry.primatePelvisLoad * 100)}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-32 text-forest shrink-0">Homo sapiens</span>
                  <div className="flex-1 h-2 bg-surface-high overflow-hidden">
                    <div
                      className="h-full w-full bg-forest origin-left transition-transform duration-100 motion-reduce:transition-none"
                      style={{ transform: `scaleX(${liveTelemetry.homoPelvisLoad})` }}
                    />
                  </div>
                  <span className="w-10 text-right tabular-nums font-semibold text-forest">
                    {Math.round(liveTelemetry.homoPelvisLoad * 100)}%
                  </span>
                </div>
              </div>
              <p className="text-[11.5px] leading-snug text-ink-muted m-0">
                Los iliones altos y planos de <em>Pan</em> pierden ventaja mecánica abductora; la
                pelvis en cuenca y el glúteo mayor de <em>Homo</em> reducen el pico de cizalla en
                apoyo monopodal.
              </p>
            </div>

            {/* Spine Stress Comparison */}
            <div className="bg-canvas border border-hairline p-3.5 flex flex-col gap-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-sm font-semibold text-ink">
                  Columna · Lordosis lumbar en S vs. arco en C
                </span>
                <span className="font-mono text-[10.5px] text-ink-muted tabular-nums">
                  Inclinación tronco: {liveTelemetry.primateTrunkPitchDeg.toFixed(0)}° vs.{' '}
                  {liveTelemetry.homoTrunkPitchDeg.toFixed(0)}°
                </span>
              </div>

              <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-32 text-lapis shrink-0">Pan troglodytes</span>
                  <div className="flex-1 h-2 bg-surface-high overflow-hidden">
                    <div
                      className="h-full w-full bg-ochre origin-left transition-transform duration-100 motion-reduce:transition-none"
                      style={{ transform: `scaleX(${liveTelemetry.primateSpineLoad})` }}
                    />
                  </div>
                  <span className="w-10 text-right tabular-nums font-semibold text-ochre">
                    {Math.round(liveTelemetry.primateSpineLoad * 100)}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-32 text-forest shrink-0">Homo sapiens</span>
                  <div className="flex-1 h-2 bg-surface-high overflow-hidden">
                    <div
                      className="h-full w-full bg-forest origin-left transition-transform duration-100 motion-reduce:transition-none"
                      style={{ transform: `scaleX(${liveTelemetry.homoSpineLoad})` }}
                    />
                  </div>
                  <span className="w-10 text-right tabular-nums font-semibold text-forest">
                    {Math.round(liveTelemetry.homoSpineLoad * 100)}%
                  </span>
                </div>
              </div>
              <p className="text-[11.5px] leading-snug text-ink-muted m-0">
                La onda compresiva recorre las vértebras lumbares al impactar el talón: la columna
                móvil en S amortigua y contrarrota el tórax, mientras la columna rígida en C
                concentra la torsión en la unión toracolumbar.
              </p>
            </div>
          </div>

          <div className="font-mono text-[10.5px] text-ink-muted">
            Base biomecánica: Bramble y Lieberman (2004), <em>Nature</em> 432(7015), 345–352 ·
            Sockol, Raichlen y Pontzer (2007), <em>PNAS</em> 104(30), 12265–12269.
          </div>
        </div>
      )}

      {/* Anatomical Hotspot Inspector + Profile Synthesis (Below Viewport) */}
      <div className="border-t border-hairline bg-canvas p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10.5px] tracking-wide text-ink-muted mr-1">
            Nodos anatómicos (6):
          </span>
          {BIOMECHANICS_HOTSPOTS.map((hs) => {
            const isSelected = activeHotspot.id === hs.id;
            return (
              <button
                key={hs.id}
                type="button"
                onClick={() => handleFocusHotspot(hs)}
                aria-pressed={isSelected}
                className={`px-2.5 py-1 font-mono text-[11px] border rounded cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-ink text-white border-ink'
                    : 'bg-paper text-ink border-hairline hover:border-ink'
                }`}
              >
                {hs.title}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          {/* Active Hotspot Evidence Card */}
          <div
            className="md:col-span-7 bg-paper border border-hairline border-t-2 p-3.5 flex flex-col gap-1.5"
            style={{ borderTopColor: activeHotspot.accent }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="font-display text-base font-semibold text-ink m-0">
                {activeHotspot.title}
              </h4>
              <span className="font-mono text-[11px]" style={{ color: activeHotspot.accent }}>
                {activeHotspot.subtitle}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-ink m-0">{activeHotspot.detail}</p>
            <p className="font-mono text-[11px] text-ink-muted m-0">
              Evidencia fósil: {activeHotspot.evidence}
            </p>
          </div>

          {/* Active Biomechanical Profile Metrics */}
          <div className="md:col-span-5 bg-paper border border-hairline p-3.5 flex flex-col gap-2">
            <div className="font-mono text-[11px] tracking-wide text-ochre font-semibold">
              {mode === 'comparativa'
                ? 'Síntesis comparada · A. afarensis → Homo'
                : mode === 'vista-comparativa'
                  ? 'Contraste anatómico · Pan troglodytes vs. Homo sapiens'
                  : activeProfileSpec.name}
            </div>
            <p className="text-xs leading-relaxed text-ink-muted m-0">
              {mode === 'comparativa'
                ? 'El paso de bosques galería a sabanas abiertas alargó las extremidades inferiores, estrechó la pelvis, descendió los hombros e incorporó muelles tendinosos (nuca, Aquiles, arco plantar) para la carrera de resistencia.'
                : activeProfileSpec.summary}
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-hairline">
              {activeProfileSpec.metrics.map((m) => (
                <div key={m.label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-[9.5px] text-ink-muted leading-tight">
                    {m.label}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-ink leading-tight">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Report Export Modal (PDF A4 & High-Res PNG Worksheet) */}
      <BiomechanicsReportModal
        snapshot={reportSnapshot}
        onClose={() => setReportSnapshot(null)}
      />
    </div>
  );
}

export default Biomechanics3DViewer;
