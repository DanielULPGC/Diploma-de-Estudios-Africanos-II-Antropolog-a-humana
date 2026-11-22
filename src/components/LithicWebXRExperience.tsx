import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Crosshair,
  Maximize2,
  RotateCw,
  Ruler,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { HENKE_2026_TASKS, type HenkeTaskSpec } from '../data/ethologyData';
import {
  ETHOLOGY_TASK_3D_LAYOUTS,
  type EthologyStone3DSpec,
} from '../data/visualSchemas3dData';
import {
  createContactShadowTexture,
  createProceduralRockTexture,
  detectSoftwareWebGL,
  disposeObject3DTree,
} from '../utils/threeSceneUtils';
import {
  buildArchaeologicalScaleBar,
  buildStandaloneLithicSpecimen,
} from '../utils/lithicSpecimen3D';
import { useModalFocusTrap } from '../utils/useModalFocusTrap';

export interface LithicWebXRExperienceProps {
  initialTaskId?: HenkeTaskSpec['id'];
  initialStoneId?: string;
  onExit: () => void;
}

type ARModeStatus = 'checking' | 'webxr-ready' | 'camera-fallback' | 'desk-preview';

export function LithicWebXRExperience({
  initialTaskId = 'task-1',
  initialStoneId,
  onExit,
}: LithicWebXRExperienceProps) {
  const validTask = useMemo(
    () => HENKE_2026_TASKS.find((t) => t.id === initialTaskId) ?? HENKE_2026_TASKS[0],
    [initialTaskId]
  );
  const taskLayout = ETHOLOGY_TASK_3D_LAYOUTS[validTask.id];

  const [selectedStoneId, setSelectedStoneId] = useState<string>(() => {
    if (initialStoneId && taskLayout.stones.some((s) => s.id === initialStoneId)) {
      return initialStoneId;
    }
    return taskLayout.stones[0].id;
  });

  const activeStone: EthologyStone3DSpec = useMemo(
    () => taskLayout.stones.find((s) => s.id === selectedStoneId) ?? taskLayout.stones[0],
    [taskLayout.stones, selectedStoneId]
  );

  const [arStatus, setArStatus] = useState<ARModeStatus>('checking');
  const [xrSessionActive, setXrSessionActive] = useState(false);
  const [placedInXR, setPlacedInXR] = useState(false);
  const [reticleDetected, setReticleDetected] = useState(false);
  const [cameraPassThroughActive, setCameraPassThroughActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scaleMultiplier, setScaleMultiplier] = useState<1 | 2>(1);
  const [showScaleBar, setShowScaleBar] = useState(true);
  const [rotationStep, setRotationStep] = useState(0);
  const [isInsecureContext] = useState<boolean>(
    () => typeof window !== 'undefined' && !window.isSecureContext
  );

  const mountRef = useRef<HTMLDivElement | null>(null);
  const overlayRootRef = useRef<HTMLDivElement | null>(null);
  const headerBarRef = useRef<HTMLElement | null>(null);
  const footerBarRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraPassThroughRef = useRef<boolean>(false);
  cameraPassThroughRef.current = cameraPassThroughActive;

  // Keep selected specimen aligned if launched with a different task/stone
  useEffect(() => {
    if (initialStoneId && taskLayout.stones.some((s) => s.id === initialStoneId)) {
      setSelectedStoneId(initialStoneId);
    } else if (taskLayout.stones[0]) {
      setSelectedStoneId(taskLayout.stones[0].id);
    }
  }, [initialStoneId, taskLayout]);

  // Prevent taps on WebXR DOM Overlay controls from firing XR 'select' and moving the anchored block
  useEffect(() => {
    const preventXrSelect = (ev: Event) => {
      ev.preventDefault();
    };
    const headerEl = headerBarRef.current;
    const footerEl = footerBarRef.current;
    headerEl?.addEventListener('beforexrselect', preventXrSelect);
    footerEl?.addEventListener('beforexrselect', preventXrSelect);
    return () => {
      headerEl?.removeEventListener('beforexrselect', preventXrSelect);
      footerEl?.removeEventListener('beforexrselect', preventXrSelect);
    };
  }, []);

  const xrSessionRef = useRef<XRSession | null>(null);
  const sceneControllerRef = useRef<{
    startWebXR: () => Promise<void>;
    endWebXR: () => Promise<void>;
    resetPlacement: () => void;
    swapSpecimen: (stone: EthologyStone3DSpec) => void;
    updateScaleAndRotation: (scaleMul: 1 | 2, rotRad: number, showBar: boolean) => void;
    setTransparentBackdrop: (transparent: boolean) => void;
  }>({
    startWebXR: async () => {},
    endWebXR: async () => {},
    resetPlacement: () => {},
    swapSpecimen: () => {},
    updateScaleAndRotation: () => {},
    setTransparentBackdrop: () => {},
  });

  // Check native WebXR immersive-ar support
  useEffect(() => {
    let mounted = true;
    const checkXR = async () => {
      if (typeof navigator !== 'undefined' && 'xr' in navigator && navigator.xr) {
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          if (mounted) {
            setArStatus(supported ? 'webxr-ready' : 'camera-fallback');
            return;
          }
        } catch {
          // Fall through to camera / desk preview fallback
        }
      }
      if (mounted) {
        setArStatus(
          typeof navigator !== 'undefined' &&
            typeof navigator.mediaDevices?.getUserMedia === 'function'
            ? 'camera-fallback'
            : 'desk-preview'
        );
      }
    };
    void checkXR();
    return () => {
      mounted = false;
    };
  }, []);

  const handleExitWithCleanup = useCallback(() => {
    void sceneControllerRef.current.endWebXR();
    onExit();
  }, [onExit]);

  useModalFocusTrap({
    isOpen: true,
    containerRef: overlayRootRef,
    onClose: handleExitWithCleanup,
  });

  // Cleanup camera passthrough tracks on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Persistent Three.js + WebXR Hit-Test scene (survives live specimen swaps without dropping XRSession)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.xr.enabled = true;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.01, 20);
    camera.position.set(0.14, 0.13, 0.2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.024, 0);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.minDistance = 0.08;
    controls.maxDistance = 0.65;
    controls.update();

    // Balanced daylight studio lighting for crisp rock grain & percussive pit visibility
    const hemi = new THREE.HemisphereLight(0xf5f8ff, 0x3b3630, 1.15);
    scene.add(hemi);
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.85);
    keyLight.position.set(0.6, 1.2, 0.8);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xa3cbf7, 0.85);
    rimLight.position.set(-0.7, 0.6, -0.6);
    scene.add(rimLight);

    // Procedural limestone, sandstone & grounded contact shadow textures (shared across swaps)
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const limestoneTex = createProceduralRockTexture('limestone', maxAniso);
    const sandstoneTex = createProceduralRockTexture('sandstone', maxAniso);
    const shadowTex = createContactShadowTexture();

    // Stylized physical desk reference grid (hidden automatically when WebXR or live camera is active)
    const deskStageGroup = new THREE.Group();
    const deskPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.19, 0.006, 48),
      new THREE.MeshStandardMaterial({
        color: 0x262b35,
        roughness: 0.88,
        metalness: 0.06,
      })
    );
    deskPlate.position.y = -0.003;
    deskStageGroup.add(deskPlate);

    const deskGrid = new THREE.GridHelper(0.3, 15, 0x5c687d, 0x363e4d);
    deskGrid.position.y = 0.0005;
    deskStageGroup.add(deskGrid);
    scene.add(deskStageGroup);

    // Specimen anchor group (physical 1:1 scale: 0.87 local units * 0.069 = 0.060 m = 6.0 cm!)
    const REAL_SCALE_1_TO_1 = 0.069;
    const specimenAnchor = new THREE.Group();
    const specimenSlot = new THREE.Group();
    const scaleBar = buildArchaeologicalScaleBar();
    scaleBar.visible = showScaleBar;
    specimenAnchor.add(specimenSlot, scaleBar);
    specimenAnchor.scale.setScalar(REAL_SCALE_1_TO_1 * scaleMultiplier);
    specimenAnchor.rotation.y = (rotationStep * Math.PI) / 4;
    scene.add(specimenAnchor);

    let disposed = false;
    let contextLost = false;
    let needsRender = true;
    const markDirty = () => {
      needsRender = true;
    };

    const handleContextLost = (ev: Event) => {
      ev.preventDefault();
      contextLost = true;
    };
    const handleContextRestored = () => {
      contextLost = false;
      markDirty();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const swapSpecimen = (stone: EthologyStone3DSpec) => {
      while (specimenSlot.children.length > 0) {
        const oldChild = specimenSlot.children[0];
        specimenSlot.remove(oldChild);
        const oldGeos = new Set<THREE.BufferGeometry>();
        const oldMats = new Set<THREE.Material>();
        oldChild.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            if (node.geometry) oldGeos.add(node.geometry);
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            mats.forEach((m) => {
              if (m) oldMats.add(m);
            });
          }
        });
        oldGeos.forEach((g) => g.dispose());
        oldMats.forEach((m) => m.dispose());
      }
      const { root: stoneRoot } = buildStandaloneLithicSpecimen({
        material: stone.material,
        modified: stone.modified,
        limestoneTex,
        sandstoneTex,
        shadowTex,
        isSoftwareGl,
      });
      specimenSlot.add(stoneRoot);
      markDirty();
    };
    swapSpecimen(activeStone);

    // WebXR Desk-Surface Placement Reticle (visible while scanning desk in immersive-ar)
    const reticle = new THREE.Group();
    const reticleRing = new THREE.Mesh(
      new THREE.RingGeometry(0.036, 0.044, 32),
      new THREE.MeshBasicMaterial({
        color: 0xf2a052,
        side: THREE.DoubleSide,
      })
    );
    reticleRing.rotation.x = -Math.PI / 2;
    const reticleInner = new THREE.Mesh(
      new THREE.RingGeometry(0.008, 0.012, 24),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      })
    );
    reticleInner.rotation.x = -Math.PI / 2;
    reticle.add(reticleRing, reticleInner);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    let hitTestSource: XRHitTestSource | null = null;
    let hitTestSourceRequested = false;
    let isCurrentlyPlaced = false;

    const onSelectXR = () => {
      if (!reticle.visible) return;
      specimenAnchor.position.setFromMatrixPosition(reticle.matrix);
      specimenAnchor.visible = true;
      isCurrentlyPlaced = true;
      setPlacedInXR(true);
    };

    let activeSessionEndHandler: (() => void) | null = null;

    const detachSessionListeners = (session: XRSession | null) => {
      if (!session) return;
      session.removeEventListener('select', onSelectXR);
      if (activeSessionEndHandler) {
        session.removeEventListener('end', activeSessionEndHandler);
        activeSessionEndHandler = null;
      }
    };

    const startWebXR = async () => {
      if (!navigator.xr || disposed) return;
      try {
        const sessionInit: XRSessionInit = {
          requiredFeatures: ['hit-test'],
          optionalFeatures: ['dom-overlay', 'local-floor'],
        };
        if (overlayRootRef.current) {
          (sessionInit as XRSessionInit & { domOverlay?: { root: HTMLElement } }).domOverlay = {
            root: overlayRootRef.current,
          };
        }

        const session = await navigator.xr.requestSession('immersive-ar', sessionInit);
        if (disposed) {
          void session.end();
          return;
        }
        xrSessionRef.current = session;
        hitTestSource = null;
        hitTestSourceRequested = false;
        isCurrentlyPlaced = false;
        setPlacedInXR(false);
        setReticleDetected(false);

        deskStageGroup.visible = false;
        specimenAnchor.visible = false;
        renderer.setClearAlpha(0);

        const onSessionEnd = () => {
          detachSessionListeners(session);
          xrSessionRef.current = null;
          hitTestSource = null;
          hitTestSourceRequested = false;
          reticle.visible = false;
          specimenAnchor.visible = true;
          specimenAnchor.position.set(0, 0, 0);
          deskStageGroup.visible = !cameraPassThroughRef.current;
          renderer.setClearColor(0x161b23, cameraPassThroughRef.current ? 0 : 1);
          markDirty();
          if (!disposed) {
            setXrSessionActive(false);
            setPlacedInXR(false);
            setReticleDetected(false);
          }
        };
        activeSessionEndHandler = onSessionEnd;

        session.addEventListener('select', onSelectXR);
        session.addEventListener('end', onSessionEnd);

        renderer.xr.setReferenceSpaceType('local');
        await renderer.xr.setSession(session);
        if (!disposed) {
          setXrSessionActive(true);
        }
      } catch {
        if (!disposed) {
          setCameraError(
            'No se pudo iniciar la sesión WebXR nativa en este navegador. Puedes usar la cámara AR o el visor interactivo.'
          );
        }
      }
    };

    const endWebXR = async () => {
      const session = xrSessionRef.current;
      if (session) {
        detachSessionListeners(session);
        xrSessionRef.current = null;
        try {
          await session.end();
        } catch {
          // Session may already be ending
        }
      }
    };

    const resetPlacement = () => {
      isCurrentlyPlaced = false;
      setPlacedInXR(false);
      if (xrSessionRef.current) {
        specimenAnchor.visible = false;
      } else {
        specimenAnchor.position.set(0, 0, 0);
        camera.position.set(0.14, 0.13, 0.2);
        controls.target.set(0, 0.024, 0);
        controls.update();
      }
      markDirty();
    };

    const updateScaleAndRotation = (scaleMul: 1 | 2, rotRad: number, showBar: boolean) => {
      specimenAnchor.scale.setScalar(REAL_SCALE_1_TO_1 * scaleMul);
      specimenAnchor.rotation.y = rotRad;
      scaleBar.visible = showBar;
      markDirty();
    };

    const setTransparentBackdrop = (transparent: boolean) => {
      deskStageGroup.visible = !transparent && !xrSessionRef.current;
      renderer.setClearColor(0x161b23, transparent ? 0 : 1);
      markDirty();
    };

    sceneControllerRef.current = {
      startWebXR,
      endWebXR,
      resetPlacement,
      swapSpecimen,
      updateScaleAndRotation,
      setTransparentBackdrop,
    };

    setTransparentBackdrop(cameraPassThroughRef.current);

    controls.addEventListener('change', markDirty);

    // Unified render loop: continuous during WebXR hit-test, battery-friendly on-demand outside WebXR
    let lastReticleState = false;
    renderer.setAnimationLoop((_timestamp, frame) => {
      if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (session && !hitTestSourceRequested) {
          session
            .requestReferenceSpace('viewer')
            .then((viewerSpace) => {
              if (session.requestHitTestSource) {
                return session.requestHitTestSource({ space: viewerSpace });
              }
              return null;
            })
            .then((source) => {
              hitTestSource = source ?? null;
            })
            .catch(() => {
              hitTestSource = null;
            });
          hitTestSourceRequested = true;
        }

        if (hitTestSource && referenceSpace) {
          const hitResults = frame.getHitTestResults(hitTestSource);
          if (hitResults.length > 0) {
            const pose = hitResults[0].getPose(referenceSpace);
            if (pose) {
              reticle.visible = true;
              reticle.matrix.fromArray(pose.transform.matrix);
              if (!lastReticleState) {
                lastReticleState = true;
                setReticleDetected(true);
              }
            }
          } else {
            reticle.visible = false;
            if (lastReticleState) {
              lastReticleState = false;
              setReticleDetected(false);
            }
          }
        }

        if (!isCurrentlyPlaced && xrSessionRef.current) {
          reticleRing.rotation.z += 0.015;
        }

        renderer.render(scene, camera);
        return;
      }

      if (document.hidden || contextLost || disposed) return;
      const dampingActive = controls.update();
      if (needsRender || dampingActive) {
        needsRender = false;
        renderer.render(scene, camera);
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      if (renderer.xr.isPresenting) return;
      const w = Math.max(container.clientWidth, 300);
      const h = Math.max(container.clientHeight, 300);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      markDirty();
    });
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      controls.removeEventListener('change', markDirty);
      renderer.setAnimationLoop(null);
      if (xrSessionRef.current) {
        const session = xrSessionRef.current;
        detachSessionListeners(session);
        xrSessionRef.current = null;
        void session.end().catch(() => {});
      }
      controls.dispose();
      disposeObject3DTree(scene);
      limestoneTex.dispose();
      sandstoneTex.dispose();
      shadowTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hot-swap lithic specimen cleanly without terminating an active WebXR session
  useEffect(() => {
    sceneControllerRef.current.swapSpecimen(activeStone);
  }, [activeStone]);

  // Sync scale, rotation, and scale bar cleanly without tearing down WebXR
  useEffect(() => {
    sceneControllerRef.current.updateScaleAndRotation(
      scaleMultiplier,
      (rotationStep * Math.PI) / 4,
      showScaleBar
    );
  }, [scaleMultiplier, rotationStep, showScaleBar]);

  // Sync transparent backdrop when live camera passthrough toggles
  useEffect(() => {
    sceneControllerRef.current.setTransparentBackdrop(cameraPassThroughActive);
  }, [cameraPassThroughActive]);

  const handleToggleCameraFallback = async () => {
    setCameraError(null);
    if (cameraPassThroughActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setCameraPassThroughActive(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraPassThroughActive(true);
    } catch {
      setCameraError(
        'No se pudo acceder a la cámara. Puedes inspeccionar el bloque a escala real sobre la mesa virtual 3D.'
      );
    }
  };

  const isLimestone = activeStone.material === 'limestone';

  return (
    <div
      ref={overlayRootRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`Visor WebXR de percusión lítica · ${activeStone.label}`}
      className="fixed inset-0 z-50 bg-[#12161f] text-[#f3efe6] flex flex-col select-none focus:outline-none"
    >
      {/* Top Bar (DOM Overlay compatible in WebXR) */}
      <header
        ref={headerBarRef}
        className="px-4 py-3 bg-[#10141c]/95 border-b border-white/15 flex items-center justify-between gap-3 shrink-0 z-20"
      >
        <button
          type="button"
          onClick={() => {
            void sceneControllerRef.current.endWebXR();
            onExit();
          }}
          className="min-h-[40px] px-3 py-1.5 font-mono text-xs bg-[#1b202b] hover:bg-white hover:text-[#12161f] text-white border border-white/25 rounded inline-flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Volver al curso</span>
        </button>

        <div className="min-w-0 flex flex-col text-right sm:text-left">
          <span className="font-mono text-[11px] text-[#f2c178] truncate">
            WebXR Percusión Lítica · {validTask.shortLabel}
          </span>
          <span className="font-display text-sm font-semibold text-white truncate">
            {activeStone.label} · {scaleMultiplier === 1 ? 'Escala 1:1 (6×6×4 cm)' : 'Escala 2× (12×12×8 cm)'}
          </span>
        </div>
      </header>

      {/* Main WebXR / AR Camera Viewport */}
      <div className="relative flex-1 overflow-hidden">
        {/* Rear Camera Passthrough Feed (used on iOS Safari / browsers without WebXR hit-test) */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
            cameraPassThroughActive ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        {/* Three.js WebGL / WebXR Canvas */}
        <div
          ref={mountRef}
          className="absolute inset-0 w-full h-full"
          aria-label={`Visor WebXR interactivo de ${activeStone.label}`}
        />

        {/* Live Guidance Banner for WebXR Desk Hit-Test */}
        {xrSessionActive && (
          <div className="pointer-events-none absolute top-3 left-3 right-3 flex justify-center z-20">
            <div className="bg-[#10141c]/95 border border-white/25 px-3.5 py-2 font-mono text-xs text-white flex items-center gap-2 shadow-lg">
              {placedInXR ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#7ae0ba] shrink-0" aria-hidden="true" />
                  <span>Bloque anclado en tu escritorio · Toca otra zona para moverlo</span>
                </>
              ) : reticleDetected ? (
                <>
                  <Crosshair className="w-4 h-4 text-[#f2c178] shrink-0" aria-hidden="true" />
                  <span>Superficie detectada · Toca la pantalla para proyectar el bloque</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-[#8ec4ff] shrink-0" aria-hidden="true" />
                  <span>Mueve el móvil lentamente apuntando a tu escritorio…</span>
                </>
              )}
            </div>
          </div>
        )}

        {!xrSessionActive && !cameraError && (
          <div className="pointer-events-none absolute top-3 left-3 right-3 flex flex-col items-center gap-1.5 z-20">
            <div className="bg-[#10141c]/90 border border-white/20 px-3 py-1.5 font-mono text-[11px] text-[#d4cfc3] shadow">
              {cameraPassThroughActive
                ? 'Cámara AR activa · Arrastra para girar · Pellizca para acercar'
                : 'Mesa de inspección 3D · Arrastra para girar · Pellizca o usa la rueda para zoom'}
            </div>
            {isInsecureContext && (
              <div className="bg-[#10141c] border border-[#f2c178]/70 px-3 py-1.5 font-mono text-[11px] text-[#f2c178] text-center max-w-md shadow">
                WebXR y la cámara requieren conexión segura (HTTPS). Mientras tanto puedes examinar el bloque a escala 1:1 en la mesa virtual.
              </div>
            )}
          </div>
        )}

        {cameraError && (
          <div className="absolute top-3 left-3 right-3 flex justify-center z-20">
            <div className="max-w-md bg-[#10141c] border border-[#e06636] px-3.5 py-2 font-mono text-xs text-[#f3efe6] shadow-lg">
              {cameraError}
            </div>
          </div>
        )}
      </div>

      {/* Bottom AR Control Deck (Specimen, Scale 1:1 / 2x, Rotate, Launch WebXR / Camera) */}
      <footer
        ref={footerBarRef}
        className="px-4 py-3 bg-[#10141c]/95 border-t border-white/15 flex flex-col gap-2.5 shrink-0 z-20"
      >
        {/* Specimen Quick Switcher */}
        <div className="flex flex-wrap items-center gap-1.5">
          {taskLayout.stones.map((st) => {
            const isSelected = st.id === activeStone.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStoneId(st.id)}
                aria-pressed={isSelected}
                className={`min-h-[36px] px-2.5 py-1 font-mono text-xs border rounded cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-white text-[#12161f] border-white font-semibold'
                    : 'bg-[#1b202b] text-[#d4cfc4] border-white/20 hover:border-white'
                }`}
              >
                {st.label}
              </button>
            );
          })}
          <span className="ml-auto font-mono text-[11px] text-[#c7c2b6] hidden sm:inline">
            {isLimestone
              ? 'Caliza fosilífera (yunque · Equotip 27,05)'
              : 'Arenisca litificada (percutor · Equotip 57,09)'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/15">
          <div className="flex flex-wrap items-center gap-1.5">
            {arStatus === 'checking' && !xrSessionActive && (
              <span className="min-h-[42px] px-3.5 py-2 font-mono text-xs text-[#c7c2b6] bg-[#1b202b] border border-white/20 rounded inline-flex items-center">
                Comprobando soporte WebXR…
              </span>
            )}

            {arStatus === 'webxr-ready' && !xrSessionActive && (
              <button
                type="button"
                onClick={() => void sceneControllerRef.current.startWebXR()}
                className="min-h-[42px] px-4 py-2 font-mono text-xs font-semibold bg-ochre hover:bg-[#d95216] text-white border border-ochre rounded inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Proyectar en escritorio (WebXR)</span>
              </button>
            )}

            {xrSessionActive && (
              <button
                type="button"
                onClick={() => void sceneControllerRef.current.endWebXR()}
                className="min-h-[42px] px-3.5 py-2 font-mono text-xs font-semibold bg-crimson text-white border border-crimson rounded cursor-pointer"
              >
                Salir de WebXR
              </button>
            )}

            {arStatus !== 'checking' && arStatus !== 'webxr-ready' && !xrSessionActive && (
              <button
                type="button"
                onClick={() => void handleToggleCameraFallback()}
                className={`min-h-[42px] px-3.5 py-2 font-mono text-xs font-semibold border rounded inline-flex items-center gap-2 cursor-pointer transition-colors ${
                  cameraPassThroughActive
                    ? 'bg-forest text-white border-forest'
                    : 'bg-ochre text-white border-ochre hover:bg-[#d95216]'
                }`}
              >
                <Camera className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>
                  {cameraPassThroughActive
                    ? 'Desactivar cámara AR'
                    : 'Proyectar con cámara AR'}
                </span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setScaleMultiplier((s) => (s === 1 ? 2 : 1))}
              className="min-h-[38px] px-2.5 py-1.5 font-mono text-xs bg-[#1b202b] hover:border-white text-[#f3efe6] border border-white/25 rounded inline-flex items-center gap-1.5 cursor-pointer tabular-nums"
              title="Cambiar escala física"
            >
              <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{scaleMultiplier === 1 ? '1:1 (6 cm)' : '2× (12 cm)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setRotationStep((r) => (r + 1) % 8)}
              className="min-h-[38px] px-2.5 py-1.5 font-mono text-xs bg-[#1b202b] hover:border-white text-[#f3efe6] border border-white/25 rounded inline-flex items-center gap-1.5 cursor-pointer"
              title="Rotar bloque 45°"
            >
              <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Rotar 45°</span>
            </button>

            <button
              type="button"
              onClick={() => setShowScaleBar((v) => !v)}
              aria-pressed={showScaleBar}
              className={`min-h-[38px] px-2.5 py-1.5 font-mono text-xs border rounded inline-flex items-center gap-1.5 cursor-pointer ${
                showScaleBar
                  ? 'bg-[#2a3345] border-[#8ec4ff]/70 text-white'
                  : 'bg-[#1b202b] border-white/25 text-[#c7c2b6]'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {scaleMultiplier === 1 ? 'Barra 6 cm (1:1)' : 'Barra 6 cm (vista 2×)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => sceneControllerRef.current.resetPlacement()}
              className="min-h-[38px] px-2.5 py-1.5 font-mono text-xs bg-[#1b202b] hover:border-white text-[#c7c2b6] hover:text-white border border-white/25 rounded cursor-pointer"
            >
              Recentrar
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LithicWebXRExperience;
