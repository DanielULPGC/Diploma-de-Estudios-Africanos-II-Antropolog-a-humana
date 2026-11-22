import { createElement, lazy, type ComponentType, type LazyExoticComponent } from 'react';

export type Scene3DId = 'ethology' | 'biomechanics';

export interface Scene3DStageMeta {
  id: 'bundle' | 'environment' | 'geometry' | 'ready';
  label: string;
  detail: string;
}

export interface Scene3DProfileMeta {
  id: Scene3DId;
  kicker: string;
  title: string;
  subtitle: string;
  heightClass: string;
  stages: Scene3DStageMeta[];
}

export interface Scene3DLoadSnapshot {
  status: 'idle' | 'downloading' | 'hydrating' | 'ready' | 'error';
  progress: number;
  stageIndex: number;
  detail: string;
  attempt: number;
  errorMessage: string | null;
}

export const SCENE_3D_PROFILES: Record<Scene3DId, Scene3DProfileMeta> = {
  ethology: {
    id: 'ethology',
    kicker: 'Etología comparada · Estudio de campo 2026',
    title: 'Escenario 3D de percusión lítica',
    subtitle: 'Bloques de caliza y arenisca (6×6×4 cm), huellas de uso previo y vectores GLMM',
    heightClass: 'min-h-[450px]',
    stages: [
      {
        id: 'bundle',
        label: 'Módulo WebGL',
        detail: 'Descargando motor 3D y biblioteca de escena lítica',
      },
      {
        id: 'environment',
        label: 'Estudio PBR y texturas',
        detail: 'Sintetizando iluminación de estudio, caliza, arenisca y sustrato',
      },
      {
        id: 'geometry',
        label: 'Bloques y pistas sociales',
        detail: 'Construyendo geometría biselada, marcas de percusión y capas interactivas',
      },
      {
        id: 'ready',
        label: 'Calibración de cámara',
        detail: 'Compilando materiales y preparando el primer fotograma',
      },
    ],
  },
  biomechanics: {
    id: 'biomechanics',
    kicker: 'Tema 04 · Monos bípedos y carrera de resistencia',
    title: 'Laboratorio biomecánico 3D comparado',
    subtitle:
      'Superposición de Pan troglodytes vs. Homo sapiens con heatmaps dinámicos en pelvis y columna, además de A. afarensis',
    heightClass: 'min-h-[470px]',
    stages: [
      {
        id: 'bundle',
        label: 'Módulo WebGL',
        detail: 'Descargando motor 3D y módulo de anatomía comparada',
      },
      {
        id: 'environment',
        label: 'Estudio PBR y texturas óseas',
        detail: 'Preparando iluminación de tres puntos y texturas corticales',
      },
      {
        id: 'geometry',
        label: 'Esqueletos y heatmaps 3D',
        detail: 'Ensamblando pelvis, columna, arco plantar y mapas de tensión del ciclo de carrera',
      },
      {
        id: 'ready',
        label: 'Calibración anatómica',
        detail: 'Compilando materiales y activando los 6 nodos anatómicos',
      },
    ],
  },
};

function createInitialSnapshot(sceneId: Scene3DId): Scene3DLoadSnapshot {
  return {
    status: 'idle',
    progress: 0,
    stageIndex: 0,
    detail: SCENE_3D_PROFILES[sceneId].stages[0].detail,
    attempt: 1,
    errorMessage: null,
  };
}

const snapshots: Record<Scene3DId, Scene3DLoadSnapshot> = {
  ethology: createInitialSnapshot('ethology'),
  biomechanics: createInitialSnapshot('biomechanics'),
};

const listeners: Record<Scene3DId, Set<() => void>> = {
  ethology: new Set(),
  biomechanics: new Set(),
};

const inFlightChunks = new Map<Scene3DId, Promise<{ default: ComponentType<any> }>>();
const loadedChunks = new Set<Scene3DId>();

function emitSnapshot(sceneId: Scene3DId, patch: Partial<Scene3DLoadSnapshot>) {
  const prev = snapshots[sceneId];
  const next: Scene3DLoadSnapshot = {
    ...prev,
    ...patch,
    progress: Math.max(0, Math.min(100, Math.round(patch.progress ?? prev.progress))),
  };
  if (
    prev.status === next.status &&
    prev.progress === next.progress &&
    prev.stageIndex === next.stageIndex &&
    prev.detail === next.detail &&
    prev.attempt === next.attempt &&
    prev.errorMessage === next.errorMessage
  ) {
    return;
  }
  snapshots[sceneId] = next;
  listeners[sceneId].forEach((fn) => fn());
}

export function getScene3DLoadSnapshot(sceneId: Scene3DId): Scene3DLoadSnapshot {
  return snapshots[sceneId];
}

export function subscribeScene3DLoad(sceneId: Scene3DId, listener: () => void): () => void {
  listeners[sceneId].add(listener);
  return () => {
    listeners[sceneId].delete(listener);
  };
}

export function reportScene3DStage(
  sceneId: Scene3DId,
  stageIndex: number,
  progress: number,
  customDetail?: string
) {
  const profile = SCENE_3D_PROFILES[sceneId];
  const clampedStage = Math.max(0, Math.min(profile.stages.length - 1, stageIndex));
  const stageMeta = profile.stages[clampedStage];
  const isComplete = progress >= 100;

  emitSnapshot(sceneId, {
    status: isComplete ? 'ready' : 'hydrating',
    stageIndex: clampedStage,
    progress,
    detail: customDetail ?? stageMeta.detail,
    errorMessage: null,
  });
}

/**
 * Yields to the browser paint pipeline between heavy procedural 3D creation stages
 * so the progress bar updates smoothly without blocking main-thread rendering.
 */
export function yieldToPaint(): Promise<void> {
  if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

function loadChunkWithTracking<T extends ComponentType<any>>(
  sceneId: Scene3DId,
  importer: () => Promise<{ default: T }>,
  maxRetries = 2
): Promise<{ default: T }> {
  const existing = inFlightChunks.get(sceneId) as Promise<{ default: T }> | undefined;
  if (existing) {
    return existing;
  }

  const profile = SCENE_3D_PROFILES[sceneId];

  // Smoothly advance download telemetry up to 34% while the async JS chunk resolves
  let trickleTimer: number | null = null;
  let trickleProgress = loadedChunks.has(sceneId) ? 35 : 8;

  if (!loadedChunks.has(sceneId)) {
    emitSnapshot(sceneId, {
      status: 'downloading',
      stageIndex: 0,
      progress: trickleProgress,
      detail: profile.stages[0].detail,
      attempt: 1,
      errorMessage: null,
    });

    if (typeof window !== 'undefined') {
      trickleTimer = window.setInterval(() => {
        trickleProgress = Math.min(34, trickleProgress + 5);
        if (snapshots[sceneId].status === 'downloading') {
          emitSnapshot(sceneId, { progress: trickleProgress });
        }
      }, 120);
    }
  }

  const stopTrickle = () => {
    if (trickleTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(trickleTimer);
      trickleTimer = null;
    }
  };

  const attemptImport = async (): Promise<{ default: T }> => {
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        if (attempt > 1) {
          emitSnapshot(sceneId, {
            status: 'downloading',
            stageIndex: 0,
            progress: 14,
            attempt,
            detail: `Reintentando descarga del módulo 3D (intento ${attempt} de ${maxRetries + 1})...`,
            errorMessage: null,
          });
        }
        const mod = await importer();
        stopTrickle();
        loadedChunks.add(sceneId);
        emitSnapshot(sceneId, {
          status: 'hydrating',
          stageIndex: 1,
          progress: Math.max(snapshots[sceneId].progress, 38),
          detail: profile.stages[1].detail,
          errorMessage: null,
        });
        return mod;
      } catch (err) {
        lastError = err;
        if (attempt <= maxRetries) {
          await new Promise((r) => window.setTimeout(r, 450 * attempt));
        }
      }
    }

    stopTrickle();
    inFlightChunks.delete(sceneId);
    const message =
      lastError instanceof Error
        ? lastError.message
        : 'No se pudo descargar el módulo interactivo 3D.';
    emitSnapshot(sceneId, {
      status: 'error',
      errorMessage: message,
    });
    throw lastError;
  };

  const promise = attemptImport();
  inFlightChunks.set(sceneId, promise);
  return promise;
}

const SCENE_IMPORTERS = {
  ethology: () => import('../components/EthologyArena3DViewer'),
  biomechanics: () => import('../components/Biomechanics3DViewer'),
} as const;

type EthologyProps = import('../components/EthologyArena3DViewer').EthologyArena3DViewerProps;
type BiomechanicsProps = import('../components/Biomechanics3DViewer').Biomechanics3DViewerProps;

const lazyCache: {
  ethology: LazyExoticComponent<ComponentType<EthologyProps>>;
  biomechanics: LazyExoticComponent<ComponentType<BiomechanicsProps>>;
} = {
  ethology: lazy(() => loadChunkWithTracking('ethology', SCENE_IMPORTERS.ethology)),
  biomechanics: lazy(() => loadChunkWithTracking('biomechanics', SCENE_IMPORTERS.biomechanics)),
};

export function LazyEthologyArena3D(props: EthologyProps) {
  const Component = lazyCache.ethology;
  return createElement(Component, props);
}

export function LazyBiomechanics3D(props: BiomechanicsProps) {
  const Component = lazyCache.biomechanics;
  return createElement(Component, props);
}

/**
 * Proactively warms the 3D scene chunk (and shared Three.js chunk) on pointer hover
 * or keyboard focus of the 2D/3D switcher, while respecting Save-Data preferences.
 */
export function prefetch3DScene(sceneId: Scene3DId): void {
  if (typeof navigator !== 'undefined') {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
  }
  if (loadedChunks.has(sceneId) || inFlightChunks.has(sceneId)) return;

  const importer = SCENE_IMPORTERS[sceneId];
  void loadChunkWithTracking(sceneId, importer, 1).catch(() => {
    // Silent prefetch failure; active Suspense mount will retry and display recovery UI if needed
  });
}

/**
 * Clears cached error state and rebuilds the React.lazy wrapper so the user can
 * genuinely retry a failed dynamic import without refreshing the page.
 */
export function resetScene3DLoadState(sceneId: Scene3DId): void {
  inFlightChunks.delete(sceneId);
  if (sceneId === 'ethology') {
    lazyCache.ethology = lazy(() => loadChunkWithTracking('ethology', SCENE_IMPORTERS.ethology));
  } else {
    lazyCache.biomechanics = lazy(() =>
      loadChunkWithTracking('biomechanics', SCENE_IMPORTERS.biomechanics)
    );
  }
  emitSnapshot(sceneId, createInitialSnapshot(sceneId));
}
