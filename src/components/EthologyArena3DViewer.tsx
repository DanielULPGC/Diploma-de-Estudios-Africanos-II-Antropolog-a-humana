import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ChevronDown, ChevronUp, Crosshair, Eye, Layers, QrCode, RotateCcw } from 'lucide-react';
import type { ExperimentalStoneSpec, HenkeTaskSpec } from '../data/ethologyData';
import {
  ETHOLOGY_3D_CAMERAS,
  ETHOLOGY_TASK_3D_LAYOUTS,
  type EthologyStone3DSpec,
  type Hotspot3DInfo,
} from '../data/visualSchemas3dData';
import {
  createContactShadowTexture,
  createEditorialStudio,
  createProceduralRockTexture,
  disposeObject3DTree,
  scheduleAfterDraw,
} from '../utils/threeSceneUtils';
import { reportScene3DStage, yieldToPaint } from '../utils/async3dLoader';
import { Scene3DHydrationOverlay } from './Scene3DAsyncBoundary';
import { ARHotspotOverlay, type ProjectedARPoint } from './ARHotspotOverlay';
import { createBeveledLithicGeometry } from '../utils/lithicSpecimen3D';

const LazyLithicARModal = lazy(() => import('./LithicARModal'));
const LazyLithicWebXRExperience = lazy(() => import('./LithicWebXRExperience'));

THREE.Cache.enabled = true;

export interface EthologyArena3DViewerProps {
  task: HenkeTaskSpec;
  selectedStoneId: string | null;
  onSelectStone: (stone: ExperimentalStoneSpec) => void;
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

const LAYER_HOTSPOT = 1;
const LAYER_STONE = 2;

function buildStoneComposite(
  spec: EthologyStone3DSpec,
  stoneGeo: THREE.BufferGeometry,
  limestoneTex: THREE.CanvasTexture,
  sandstoneTex: THREE.CanvasTexture,
  shadowTex: THREE.CanvasTexture,
  isSoftwareGl: boolean
): {
  group: THREE.Group;
  wearGroup: THREE.Group;
  selectionRing: THREE.Mesh;
} {
  const group = new THREE.Group();
  group.position.set(spec.position[0], spec.position[1], spec.position[2]);
  group.rotation.y = spec.rotationY;

  const isLimestone = spec.material === 'limestone';
  const blockMat = new THREE.MeshStandardMaterial({
    map: isLimestone ? limestoneTex : sandstoneTex,
    color: isLimestone ? 0xf5efe2 : 0xdfb9a3,
    roughness: isLimestone ? 0.88 : 0.76,
    metalness: isLimestone ? 0.03 : 0.07,
  });

  const blockMesh = new THREE.Mesh(stoneGeo, blockMat);
  blockMesh.castShadow = !isSoftwareGl;
  blockMesh.receiveShadow = !isSoftwareGl;
  blockMesh.layers.enable(LAYER_STONE);
  blockMesh.userData = {
    pickKind: 'stone',
    stoneId: spec.id,
    title: spec.label,
    subtitle: isLimestone
      ? 'Caliza blanda · Dureza Equotip 27,05'
      : 'Arenisca dura · Dureza Equotip 57,09',
    accent: isLimestone ? '#156f55' : '#b43c0b',
  };
  group.add(blockMesh);

  // Subtle dark mineral basal lip for grounded visual weight
  const baseLipMat = new THREE.MeshStandardMaterial({
    color: isLimestone ? 0xa3957c : 0x623b2a,
    roughness: 0.94,
    metalness: 0.02,
  });
  const baseLip = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.03, 0.84), baseLipMat);
  baseLip.position.y = 0.015;
  baseLip.receiveShadow = !isSoftwareGl;
  group.add(baseLip);

  // Soft radial contact shadow on the earthen ground
  const shadowMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.42, 1.42),
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    })
  );
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.004;
  group.add(shadowMesh);

  // Selection highlight perimeter frame
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xb43c0b,
    roughness: 0.35,
    metalness: 0.12,
  });
  const selectionRing = new THREE.Mesh(new THREE.RingGeometry(0.56, 0.62, 4), ringMat);
  selectionRing.rotation.x = -Math.PI / 2;
  selectionRing.rotation.z = Math.PI / 4;
  selectionRing.position.y = 0.014;
  selectionRing.visible = false;
  group.add(selectionRing);

  // Subtle role accent bar on front face base
  if (spec.roleHighlight) {
    const roleColor =
      spec.roleHighlight === 'anvil'
        ? 0x156f55
        : spec.roleHighlight === 'hammer'
          ? 0xb43c0b
          : 0x7d4ca5;
    const tagBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.026, 0.035),
      new THREE.MeshStandardMaterial({ color: roleColor, roughness: 0.45, metalness: 0.05 })
    );
    tagBar.position.set(0, 0.02, 0.46);
    group.add(tagBar);
  }

  // Percussive wear cues sub-group (toggleable layer)
  const wearGroup = new THREE.Group();
  if (spec.modified) {
    const topY = 0.532;
    // Recessed circular impact crater rim
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

    // Darkened battered pit interior
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

    // Fractured mineral micro-pits & pale percussive powder flecks
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

    // Corner terracotta cue pin indicating prior social modification
    const pinStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8),
      new THREE.MeshStandardMaterial({ color: 0xb43c0b, roughness: 0.4, metalness: 0.15 })
    );
    pinStem.position.set(0.28, topY + 0.055, -0.26);
    wearGroup.add(pinStem);

    const pinCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.042, 14, 14),
      new THREE.MeshStandardMaterial({ color: 0xb43c0b, roughness: 0.35, metalness: 0.1 })
    );
    pinCap.position.set(0.28, topY + 0.12, -0.26);
    wearGroup.add(pinCap);
  }
  group.add(wearGroup);

  return { group, wearGroup, selectionRing };
}

function buildHotspotNode(info: Hotspot3DInfo): THREE.Group {
  const g = new THREE.Group();
  g.position.set(info.position[0], info.position[1], info.position[2]);

  const accentColor = new THREE.Color(info.accent);

  // Thin vertical editorial pointer stem down to object surface
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.009, 0.009, 0.24, 8),
    new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.5, metalness: 0.1 })
  );
  stem.position.y = -0.12;
  g.add(stem);

  // Outer ring marker
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.095, 0.022, 12, 24),
    new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.35, metalness: 0.12 })
  );
  ring.layers.enable(LAYER_HOTSPOT);
  ring.userData = { pickKind: 'hotspot', hotspot: info };
  g.add(ring);

  // Opaque white inner core for crisp readability against stone/soil
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.068, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.05 })
  );
  core.layers.enable(LAYER_HOTSPOT);
  core.userData = { pickKind: 'hotspot', hotspot: info };
  g.add(core);

  // Invisible slightly larger pick sphere for effortless pointer hit-testing
  const hitSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 10, 10),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  hitSphere.layers.enable(LAYER_HOTSPOT);
  hitSphere.userData = { pickKind: 'hotspot', hotspot: info };
  g.add(hitSphere);

  return g;
}

export function EthologyArena3DViewer({
  task,
  selectedStoneId,
  onSelectStone,
  onFallbackTo2D,
}: EthologyArena3DViewerProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [dockExpanded, setDockExpanded] = useState(true);
  const [activeCamId, setActiveCamId] = useState<string>('overview');
  const [showWearCues, setShowWearCues] = useState(true);
  const [showShellsLayer, setShowShellsLayer] = useState(true);
  const [showFlowVectors, setShowFlowVectors] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot3DInfo | null>(null);
  const [arPanelOpen, setArPanelOpen] = useState(false);
  const [showArPins, setShowArPins] = useState(true);
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  const [projectedPoints, setProjectedPoints] = useState<ProjectedARPoint[]>([]);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [tooltip, setTooltip] = useState<HoverTooltipState | null>(null);
  const [contextLost, setContextLost] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [arModalOpen, setArModalOpen] = useState(false);
  const [localWebXRTarget, setLocalWebXRTarget] = useState<{
    taskId: HenkeTaskSpec['id'];
    stoneId: string;
  } | null>(null);

  const layout = useMemo(() => ETHOLOGY_TASK_3D_LAYOUTS[task.id], [task.id]);

  // Flat stone lookup so clicking a 3D stone selects the exact ExperimentalStoneSpec in EthologyModule
  const stoneSpecMap = useMemo(() => {
    const map = new Map<string, ExperimentalStoneSpec>();
    task.zones.forEach((z) => {
      z.stones.forEach((s) => map.set(s.id, s));
    });
    return map;
  }, [task]);

  const onSelectStoneRef = useRef(onSelectStone);
  onSelectStoneRef.current = onSelectStone;
  const stoneSpecMapRef = useRef(stoneSpecMap);
  stoneSpecMapRef.current = stoneSpecMap;

  // Imperative scene refs for fast state sync without tearing down WebGL context
  const sceneRefs = useRef<{
    requestRender: () => void;
    flyToPreset: (presetId: string) => void;
    wearGroups: THREE.Group[];
    shellsGroup: THREE.Group | null;
    vectorsGroup: THREE.Group | null;
    selectionRings: Map<string, THREE.Mesh>;
  }>({
    requestRender: () => {},
    flyToPreset: () => {},
    wearGroups: [],
    shellsGroup: null,
    vectorsGroup: null,
    selectionRings: new Map(),
  });

  // Reset active hotspot when task changes
  useEffect(() => {
    setActiveHotspot(layout.hotspots[0] ?? null);
    setArPanelOpen(false);
    setTooltip(null);
    setHoveredHotspotId(null);
  }, [layout]);

  // Main Three.js scene lifecycle (staged async hydration so progress UI stays responsive)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let cancelled = false;
    let cleanupScene: (() => void) | null = null;
    setSceneReady(false);

    const bootstrapScene = async () => {
      reportScene3DStage('ethology', 1, 44);
      await yieldToPaint();
      if (cancelled) return;

      const studio = createEditorialStudio(container, '#181d25', 11.5, 28, 'dark');
      const { renderer, scene, isSoftwareGl, disposeStudio } = studio;

      const width = Math.max(container.clientWidth, 320);
      const height = Math.max(container.clientHeight, 320);
      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 40);
      const defaultCam = ETHOLOGY_3D_CAMERAS[0];
      camera.position.set(...defaultCam.position);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(...defaultCam.target);
      controls.enableDamping = !isSoftwareGl;
      controls.dampingFactor = 0.06;
      controls.minDistance = 2.6;
      controls.maxDistance = 11.2;
      controls.minPolarAngle = 0.15;
      controls.maxPolarAngle = Math.PI * 0.465;
      controls.update();

      reportScene3DStage('ethology', 1, 64);
      await yieldToPaint();
      if (cancelled) {
        controls.dispose();
        disposeStudio();
        return;
      }

      // Shared procedural textures
      const maxAniso = renderer.capabilities.getMaxAnisotropy();
      const soilTex = createProceduralRockTexture('soil', maxAniso);
      soilTex.repeat.set(3.2, 3.2);
      const limestoneTex = createProceduralRockTexture('limestone', maxAniso);
      const sandstoneTex = createProceduralRockTexture('sandstone', maxAniso);
      const shadowTex = createContactShadowTexture();

      reportScene3DStage('ethology', 2, 78);
      await yieldToPaint();
      if (cancelled) {
        controls.dispose();
        soilTex.dispose();
        limestoneTex.dispose();
        sandstoneTex.dispose();
        shadowTex.dispose();
        disposeStudio();
        return;
      }

      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

    // 1. Grounded circular field arena base (top surface at y = 0, dark slate-earth contrast)
    const ground = new THREE.Mesh(
      new THREE.CylinderGeometry(4.35, 4.55, 0.22, 64),
      new THREE.MeshStandardMaterial({
        map: soilTex,
        color: 0x474139,
        roughness: 0.92,
        metalness: 0.04,
      })
    );
    ground.position.y = -0.11;
    ground.receiveShadow = !isSoftwareGl;
    rootGroup.add(ground);

    // Crisp rim border around arena platform
    const rimRing = new THREE.Mesh(
      new THREE.TorusGeometry(4.36, 0.025, 10, 72),
      new THREE.MeshStandardMaterial({ color: 0x6b6358, roughness: 0.7, metalness: 0.12 })
    );
    rimRing.rotation.x = Math.PI / 2;
    rimRing.position.y = 0.002;
    rootGroup.add(rimRing);

    // Natural perimeter pebbles via InstancedMesh
    const pebbleGeo = new THREE.DodecahedronGeometry(0.095, 1);
    const pebbleMat = new THREE.MeshStandardMaterial({
      color: 0x7b7367,
      roughness: 0.88,
      metalness: 0.04,
    });
    const pebbleCount = 32;
    const pebbles = new THREE.InstancedMesh(pebbleGeo, pebbleMat, pebbleCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < pebbleCount; i++) {
      const angle = (i / pebbleCount) * Math.PI * 2 + (i % 3) * 0.05;
      const dist = 3.55 + ((i * 37) % 10) * 0.06;
      const sx = 0.75 + ((i * 19) % 7) * 0.14;
      const sy = 0.35 + ((i * 11) % 5) * 0.08;
      const sz = 0.75 + ((i * 23) % 7) * 0.12;
      dummy.position.set(Math.cos(angle) * dist, sy * 0.045, Math.sin(angle) * dist);
      dummy.rotation.set(0.2 * i, angle, 0.15 * i);
      dummy.scale.set(sx, sy, sz);
      dummy.updateMatrix();
      pebbles.setMatrixAt(i, dummy.matrix);
    }
    pebbles.instanceMatrix.needsUpdate = true;
    pebbles.computeBoundingSphere();
    rootGroup.add(pebbles);

    // Field-scale reference ruler bar at front edge (representing 6 cm stone scale)
    const scaleBarGroup = new THREE.Group();
    scaleBarGroup.position.set(0, 0.008, 2.05);
    const barLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.012, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x121212, roughness: 0.6 })
    );
    barLeft.position.x = -0.225;
    const barRight = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.012, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })
    );
    barRight.position.x = 0.225;
    scaleBarGroup.add(barLeft, barRight);
    rootGroup.add(scaleBarGroup);

    // Task 2 dual station floor rings (unused vs used)
    if (layout.taskId === 'task-2') {
      const intactRing = new THREE.Mesh(
        new THREE.RingGeometry(1.18, 1.24, 48),
        new THREE.MeshBasicMaterial({ color: 0x5ca3f5, side: THREE.DoubleSide })
      );
      intactRing.rotation.x = -Math.PI / 2;
      intactRing.position.set(-1.75, 0.008, 0);
      rootGroup.add(intactRing);

      const usedRing = new THREE.Mesh(
        new THREE.RingGeometry(1.18, 1.25, 48),
        new THREE.MeshBasicMaterial({ color: 0xe66832, side: THREE.DoubleSide })
      );
      usedRing.rotation.x = -Math.PI / 2;
      usedRing.position.set(1.75, 0.008, 0.02);
      rootGroup.add(usedRing);
    }

    // 2. Experimental 6x6x4 cm Stone Blocks
    const sharedStoneGeo = createBeveledLithicGeometry();
    const wearGroups: THREE.Group[] = [];
    const selectionRings = new Map<string, THREE.Mesh>();

    layout.stones.forEach((stoneSpec) => {
      const { group, wearGroup, selectionRing } = buildStoneComposite(
        stoneSpec,
        sharedStoneGeo,
        limestoneTex,
        sandstoneTex,
        shadowTex,
        isSoftwareGl
      );
      wearGroup.visible = showWearCues;
      selectionRing.visible = selectedStoneId === stoneSpec.id;
      wearGroups.push(wearGroup);
      selectionRings.set(stoneSpec.id, selectionRing);
      rootGroup.add(group);
    });

    // 3. Broken Nut Shells & Used Site Debris Layer (Task 2)
    const shellsGroup = new THREE.Group();
    shellsGroup.visible = showShellsLayer;
    if (layout.hasShellsZone) {
      const [cx, , cz] = layout.shellsCenter;
      const patch = new THREE.Mesh(
        new THREE.CircleGeometry(1.15, 36),
        new THREE.MeshStandardMaterial({
          color: 0x5e5144,
          roughness: 0.94,
          metalness: 0.02,
        })
      );
      patch.rotation.x = -Math.PI / 2;
      patch.position.set(cx - 0.1, 0.005, cz);
      shellsGroup.add(patch);

      const shellGeo = new THREE.SphereGeometry(0.075, 10, 6, 0, Math.PI, 0, Math.PI * 0.62);
      const shellMat = new THREE.MeshStandardMaterial({
        color: 0x8e5d32,
        roughness: 0.72,
        metalness: 0.04,
        side: THREE.DoubleSide,
      });
      const shellCount = 26;
      const shellsMesh = new THREE.InstancedMesh(shellGeo, shellMat, shellCount);
      for (let i = 0; i < shellCount; i++) {
        const theta = (i * 2.39996) % (Math.PI * 2);
        const rad = 0.28 + ((i * 29) % 10) * 0.088;
        const sx = cx - 0.1 + Math.cos(theta) * rad;
        const sz = cz + Math.sin(theta) * rad;
        // Skip direct center of stone footprints
        const nearStone = layout.stones.some(
          (st) => Math.hypot(sx - st.position[0], sz - st.position[2]) < 0.56
        );
        const finalX = nearStone ? sx + Math.cos(theta) * 0.45 : sx;
        const finalZ = nearStone ? sz + Math.sin(theta) * 0.45 : sz;
        dummy.position.set(finalX, 0.025, finalZ);
        dummy.rotation.set(
          Math.PI * (i % 2 === 0 ? 0.15 : 0.85),
          theta + i * 0.4,
          (i % 5) * 0.2
        );
        const sc = 0.85 + (i % 4) * 0.18;
        dummy.scale.set(sc, sc * 0.7, sc * 1.15);
        dummy.updateMatrix();
        shellsMesh.setMatrixAt(i, dummy.matrix);
      }
      shellsMesh.instanceMatrix.needsUpdate = true;
      shellsMesh.computeBoundingSphere();
      shellsGroup.add(shellsMesh);
    }
    rootGroup.add(shellsGroup);

    // 4. GLMM Preference Flow Arcs Layer
    const vectorsGroup = new THREE.Group();
    vectorsGroup.visible = showFlowVectors;
    layout.flowArcs.forEach((arc) => {
      const start = new THREE.Vector3(...arc.from);
      const end = new THREE.Vector3(...arc.to);
      const mid = start.clone().lerp(end, 0.5);
      mid.y += 0.65;
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 28, 0.02, 8, false),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(arc.color),
          roughness: 0.4,
          metalness: 0.1,
        })
      );
      vectorsGroup.add(tube);

      const tangent = curve.getTangent(0.96).normalize();
      const arrow = new THREE.Mesh(
        new THREE.ConeGeometry(0.065, 0.16, 12),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(arc.color),
          roughness: 0.35,
          metalness: 0.1,
        })
      );
      arrow.position.copy(end);
      arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
      vectorsGroup.add(arrow);
    });
    rootGroup.add(vectorsGroup);

    // 5. Interactive 3D Hotspots (Layer 1)
    const hotspotGroup = new THREE.Group();
    const hotspotNodes: Array<{ id: string; obj: THREE.Object3D }> = [];
    layout.hotspots.forEach((hs) => {
      const node = buildHotspotNode(hs);
      hotspotGroup.add(node);
      hotspotNodes.push({ id: hs.id, obj: node });
    });
    rootGroup.add(hotspotGroup);

    // Pre-allocated math helpers for zero per-frame allocations
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    const projScratch = new THREE.Vector3();
    const camGoal = new THREE.Vector3(...defaultCam.position);
    const targetGoal = new THREE.Vector3(...defaultCam.target);
    let isTransitioning = false;
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

    // Coalesced on-demand render loop
    let rafId: number | null = null;
    let pendingTimerId: number | null = null;
    const registerTimer = (id: number) => {
      if (pendingTimerId !== null) window.clearTimeout(pendingTimerId);
      pendingTimerId = id;
    };
    let lastClockMs = performance.now();

    const renderOnce = () => {
      rafId = null;
      const now = performance.now();
      const dt = Math.min((now - lastClockMs) / 1000, 0.05);
      lastClockMs = now;

      let needsMoreFrames = false;

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

      renderer.render(scene, camera);
      syncProjectedHotspots();

      if (needsMoreFrames) {
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

    const flyToPreset = (presetId: string) => {
      const preset = ETHOLOGY_3D_CAMERAS.find((p) => p.id === presetId) ?? ETHOLOGY_3D_CAMERAS[0];
      camGoal.set(...preset.position);
      targetGoal.set(...preset.target);
      isTransitioning = true;
      lastClockMs = performance.now();
      requestRender();
    };

    sceneRefs.current = {
      requestRender,
      flyToPreset,
      wearGroups,
      shellsGroup,
      vectorsGroup,
      selectionRings,
    };

    // Cancel camera transition as soon as the student grabs the viewport
    const onControlStart = () => {
      isTransitioning = false;
    };
    const onControlChange = () => {
      requestRender();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    // Raycast helper checking Layer 1 (hotspots) first, then Layer 2 (stones)
    const pickAtClientPoint = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.layers.set(LAYER_HOTSPOT);
      raycaster.setFromCamera(pointerNdc, camera);
      const hsHits = raycaster.intersectObjects(hotspotGroup.children, true);
      if (hsHits.length > 0) {
        const hs = hsHits[0].object.userData.hotspot as Hotspot3DInfo | undefined;
        if (hs) {
          return {
            kind: 'hotspot' as const,
            hotspot: hs,
            localX: clientX - rect.left,
            localY: clientY - rect.top,
            containerWidth: rect.width,
          };
        }
      }

      raycaster.layers.set(LAYER_STONE);
      raycaster.setFromCamera(pointerNdc, camera);
      const stoneHits = raycaster.intersectObjects(rootGroup.children, true);
      if (stoneHits.length > 0) {
        const ud = stoneHits[0].object.userData;
        if (ud?.pickKind === 'stone') {
          return {
            kind: 'stone' as const,
            stoneId: String(ud.stoneId),
            title: String(ud.title),
            subtitle: String(ud.subtitle),
            accent: String(ud.accent),
            localX: clientX - rect.left,
            localY: clientY - rect.top,
            containerWidth: rect.width,
          };
        }
      }
      return null;
    };

    let lastHoverTs = 0;
    let pointerDownPos: { x: number; y: number } | null = null;

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverTs < 40) return;
      lastHoverTs = now;
      const hit = pickAtClientPoint(e.clientX, e.clientY);
      if (!hit) {
        renderer.domElement.style.cursor = 'grab';
        setTooltip(null);
        setHoveredHotspotId(null);
        return;
      }
      renderer.domElement.style.cursor = 'pointer';
      if (hit.kind === 'hotspot') {
        setHoveredHotspotId(hit.hotspot.id);
        setTooltip({
          title: hit.hotspot.title,
          subtitle: hit.hotspot.subtitle,
          accent: hit.hotspot.accent,
          x: hit.localX,
          y: hit.localY,
          containerWidth: hit.containerWidth,
        });
      } else {
        setHoveredHotspotId(null);
        setTooltip({
          title: hit.title,
          subtitle: hit.subtitle,
          accent: hit.accent,
          x: hit.localX,
          y: hit.localY,
          containerWidth: hit.containerWidth,
        });
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!pointerDownPos) return;
      const moved = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      pointerDownPos = null;
      if (moved > 6) return;

      const hit = pickAtClientPoint(e.clientX, e.clientY);
      if (!hit) return;
      if (hit.kind === 'hotspot') {
        setActiveHotspot(hit.hotspot);
        setArPanelOpen(true);
      } else {
        const found = stoneSpecMapRef.current.get(hit.stoneId);
        if (found) {
          onSelectStoneRef.current(found);
        }
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

      // Pre-warm shaders on hardware GPUs and draw first frame
      reportScene3DStage('ethology', 3, 94);
      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
      }

      cleanupScene = () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        if (pendingTimerId !== null) window.clearTimeout(pendingTimerId);
        resizeObserver.disconnect();
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
        soilTex.dispose();
        limestoneTex.dispose();
        sandstoneTex.dispose();
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
        reportScene3DStage('ethology', 3, 100, 'Escena 3D lista para explorar');
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
  }, [layout]);

  // Sync toggleable layers and selected stone ring cleanly without recreating WebGL
  useEffect(() => {
    const refs = sceneRefs.current;
    refs.wearGroups.forEach((wg) => {
      wg.visible = showWearCues;
    });
    if (refs.shellsGroup) {
      refs.shellsGroup.visible = showShellsLayer;
    }
    if (refs.vectorsGroup) {
      refs.vectorsGroup.visible = showFlowVectors;
    }
    refs.selectionRings.forEach((ring, id) => {
      ring.visible = id === selectedStoneId;
    });
    refs.requestRender();
  }, [showWearCues, showShellsLayer, showFlowVectors, selectedStoneId]);

  const handleCameraPreset = (presetId: string) => {
    setActiveCamId(presetId);
    sceneRefs.current.flyToPreset(presetId);
  };

  return (
    <div className="bg-paper border border-hairline flex flex-col">
      {/* Compact Header Strip + WebXR Space Projection Trigger */}
      <div className="px-4 py-2.5 border-b border-hairline flex flex-wrap items-center justify-between gap-2.5 bg-paper">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[11px] tracking-wide text-ink font-medium">
            Escena 3D interactiva · {task.shortLabel} ({layout.stones.length} bloques 6×6×4 cm)
          </span>
          <span className="font-mono text-[10.5px] text-ink-muted">
            Arrastra para rotar · Rueda para zoom · Pulsa rocas o nodos
          </span>
        </div>

        <button
          type="button"
          onClick={() => setArModalOpen(true)}
          className="min-h-[38px] px-3.5 py-1.5 font-mono text-xs font-semibold bg-ochre hover:bg-ink text-white border border-ochre hover:border-ink rounded inline-flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap shrink-0"
        >
          <QrCode className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Visualizar en mi espacio</span>
        </button>
      </div>

      {/* Interactive 3D Viewport (100% Unobstructed High-Contrast Museum Display Stage) */}
      <div className="relative w-full h-[420px] sm:h-[460px] bg-[#181d25] overflow-hidden select-none">
        <div
          ref={mountRef}
          className="w-full h-full"
          aria-label={`Escenario 3D interactivo de percusión lítica para ${task.title}`}
        />

        {/* Branded Staged Hydration Overlay until First WebGL Frame */}
        <Scene3DHydrationOverlay
          sceneId="ethology"
          isReady={sceneReady}
          onFallbackTo2D={onFallbackTo2D}
        />

        {/* WebGL Context Lost Fallback */}
        {contextLost && (
          <div className="absolute inset-0 bg-[#181d25] text-[#f3efe6] flex flex-col items-center justify-center p-6 text-center gap-3 z-20">
            <p className="font-display text-lg font-semibold text-white m-0">
              El contexto WebGL 3D se ha interrumpido
            </p>
            <p className="text-sm text-[#c7c2b6] max-w-md m-0">
              Puedes continuar explorando los bloques de caliza y arenisca en el esquema vectorial 2D.
            </p>
            {onFallbackTo2D && (
              <button
                type="button"
                onClick={onFallbackTo2D}
                className="min-h-[40px] px-4 py-2 font-mono text-xs bg-white text-[#12161f] border border-white rounded cursor-pointer font-semibold"
              >
                Volver al esquema 2D
              </button>
            )}
          </div>
        )}

        {/* Solid Dark Studio Hover Tooltip (hidden while AR side drawer is open) */}
        {tooltip && !contextLost && !arPanelOpen && (
          <div
            className="pointer-events-none absolute z-10 max-w-[244px] bg-[#10141c] border border-white/30 px-3 py-2 shadow-lg text-[#f3efe6]"
            style={{
              left: `${Math.min(Math.max(tooltip.x + 14, 10), Math.max(10, tooltip.containerWidth - 258))}px`,
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
          </div>
        )}

        {/* Immersive AR Spatial Reticles, Non-Overlapping Callouts & Side Glossary Summary Window */}
        {!contextLost && sceneReady && (
          <ARHotspotOverlay
            hotspots={layout.hotspots}
            projectedPoints={projectedPoints}
            viewportSize={viewportSize}
            activeHotspotId={activeHotspot?.id ?? null}
            hoveredHotspotId={hoveredHotspotId}
            isPanelOpen={arPanelOpen}
            showSpatialPins={showArPins}
            theme="dark"
            sceneLabel={`Percusión 3D · ${task.shortLabel}`}
            onActivateHotspot={(id) => {
              const found = layout.hotspots.find((h) => h.id === id);
              if (found) {
                setActiveHotspot(found);
                setArPanelOpen(true);
              }
            }}
            onClosePanel={() => setArPanelOpen(false)}
          />
        )}
      </div>

      {/* Attached Studio Control Deck BELOW the 3D Viewport (Zero Canvas Occlusion) */}
      <div className="border-t border-hairline bg-canvas px-4 py-2.5 flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setDockExpanded((prev) => !prev)}
            aria-expanded={dockExpanded}
            className="min-h-[36px] px-3 py-1 bg-paper border border-hairline hover:border-ink font-mono text-xs text-ink inline-flex items-center gap-1.5 rounded cursor-pointer transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
            <span>{dockExpanded ? 'Ocultar controles 3D' : 'Mostrar controles 3D y capas'}</span>
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
              onClick={() => handleCameraPreset('overview')}
              className="min-h-[36px] px-2.5 py-1 font-mono text-xs text-ink-muted hover:text-ink border border-hairline hover:border-ink rounded inline-flex items-center gap-1.5 cursor-pointer bg-paper whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reiniciar vista</span>
            </button>
          </div>
        </div>

        {dockExpanded && (
          <div className="pt-2.5 border-t border-hairline flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-xs text-ink-muted mr-1">Cámara:</span>
              {ETHOLOGY_3D_CAMERAS.map((cam) => (
                <button
                  key={cam.id}
                  type="button"
                  onClick={() => handleCameraPreset(cam.id)}
                  aria-pressed={activeCamId === cam.id}
                  className={`min-h-[36px] px-2.5 py-1 font-mono text-xs border rounded cursor-pointer transition-colors ${
                    activeCamId === cam.id
                      ? 'bg-ink text-white border-ink'
                      : 'bg-paper text-ink border-hairline hover:border-ink'
                  }`}
                >
                  {cam.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-hairline">
              <span className="font-mono text-xs text-ink-muted inline-flex items-center gap-1 mr-1">
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Capas:</span>
              </span>
              <button
                type="button"
                onClick={() => setShowWearCues((v) => !v)}
                aria-pressed={showWearCues}
                className={`min-h-[36px] px-2.5 py-1 font-mono text-xs border rounded cursor-pointer transition-colors ${
                  showWearCues
                    ? 'bg-ochre text-white border-ochre'
                    : 'bg-paper text-ink-muted border-hairline hover:border-ink'
                }`}
              >
                Huellas de percusión
              </button>
              {layout.hasShellsZone && (
                <button
                  type="button"
                  onClick={() => setShowShellsLayer((v) => !v)}
                  aria-pressed={showShellsLayer}
                  className={`min-h-[36px] px-2.5 py-1 font-mono text-xs border rounded cursor-pointer transition-colors ${
                    showShellsLayer
                      ? 'bg-forest text-white border-forest'
                      : 'bg-paper text-ink-muted border-hairline hover:border-ink'
                  }`}
                >
                  Cáscaras y sitio
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowFlowVectors((v) => !v)}
                aria-pressed={showFlowVectors}
                className={`min-h-[36px] px-2.5 py-1 font-mono text-xs border rounded cursor-pointer transition-colors ${
                  showFlowVectors
                    ? 'bg-lapis text-white border-lapis'
                    : 'bg-paper text-ink-muted border-hairline hover:border-ink'
                }`}
              >
                Vectores GLMM
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Selected 3D Hotspot Evidence Readout (Below Canvas, Non-Occluding) */}
      <div className="border-t border-hairline bg-canvas p-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10.5px] tracking-wide text-ink-muted">
            Hotspots 3D del experimento:
          </span>
          {layout.hotspots.map((hs) => {
            const isSelected = activeHotspot?.id === hs.id;
            return (
              <button
                key={hs.id}
                type="button"
                onClick={() => {
                  setActiveHotspot(hs);
                  setArPanelOpen(true);
                }}
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

        {activeHotspot && (
          <div
            className="bg-paper border border-hairline border-t-2 p-3.5 flex flex-col gap-1"
            style={{ borderTopColor: activeHotspot.accent }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="font-display text-sm font-semibold text-ink m-0">
                {activeHotspot.title}
              </h4>
              <span className="font-mono text-[11px]" style={{ color: activeHotspot.accent }}>
                {activeHotspot.subtitle}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-ink m-0">{activeHotspot.detail}</p>
            <p className="font-mono text-[11px] text-ink-muted m-0">{activeHotspot.evidence}</p>
          </div>
        )}
      </div>

      {/* Dynamic QR Code Modal for Mobile WebXR Desk Projection (loaded strictly on demand) */}
      {arModalOpen && (
        <Suspense fallback={null}>
          <LazyLithicARModal
            isOpen={arModalOpen}
            task={task}
            stones={layout.stones}
            initialStoneId={selectedStoneId}
            onClose={() => setArModalOpen(false)}
            onLaunchWebXRHere={(taskId, stoneId) => {
              setArModalOpen(false);
              setLocalWebXRTarget({ taskId, stoneId });
            }}
          />
        </Suspense>
      )}

      {/* Full-Screen WebXR Experience launched directly on this device (loaded strictly on demand) */}
      {localWebXRTarget && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 bg-[#12161f] text-[#f3efe6] flex flex-col items-center justify-center p-6 text-center gap-2">
              <span className="font-mono text-xs text-[#f2c178]">WebXR Percusión Lítica</span>
              <p className="font-display text-base font-semibold text-white m-0">
                Preparando proyección a escala real 1:1…
              </p>
            </div>
          }
        >
          <LazyLithicWebXRExperience
            initialTaskId={localWebXRTarget.taskId}
            initialStoneId={localWebXRTarget.stoneId}
            onExit={() => setLocalWebXRTarget(null)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default EthologyArena3DViewer;
