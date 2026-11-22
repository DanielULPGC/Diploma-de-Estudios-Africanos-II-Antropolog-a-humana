import {
  Component,
  Suspense,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import { AlertTriangle, Check, RotateCcw } from 'lucide-react';
import {
  SCENE_3D_PROFILES,
  getScene3DLoadSnapshot,
  prefetch3DScene,
  resetScene3DLoadState,
  subscribeScene3DLoad,
  type Scene3DId,
} from '../utils/async3dLoader';

function useScene3DLoadState(sceneId: Scene3DId) {
  return useSyncExternalStore(
    (onStoreChange) => subscribeScene3DLoad(sceneId, onStoreChange),
    () => getScene3DLoadSnapshot(sceneId),
    () => getScene3DLoadSnapshot(sceneId)
  );
}

function DiplomaSceneEmblem({ sceneId }: { sceneId: Scene3DId }) {
  if (sceneId === 'ethology') {
    return (
      <svg
        viewBox="0 0 88 64"
        className="w-16 h-12 shrink-0 text-ink"
        aria-hidden="true"
      >
        {/* Isometric stone cuboid & anvil percussion wave schematic */}
        <ellipse
          cx="44"
          cy="49"
          rx="32"
          ry="8"
          fill="none"
          stroke="#e2e2dd"
          strokeWidth="1.2"
        />
        <ellipse
          cx="44"
          cy="49"
          rx="21"
          ry="5"
          fill="none"
          stroke="#b43c0b"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
        <polygon
          points="44,16 66,26 44,36 22,26"
          fill="#f7f7f5"
          stroke="#121212"
          strokeWidth="1.35"
        />
        <polygon
          points="22,26 44,36 44,50 22,40"
          fill="#ece9e0"
          stroke="#121212"
          strokeWidth="1.35"
        />
        <polygon
          points="44,36 66,26 66,40 44,50"
          fill="#dfd8c8"
          stroke="#121212"
          strokeWidth="1.35"
        />
        <ellipse cx="44" cy="26" rx="7.5" ry="3.6" fill="#b43c0b" fillOpacity="0.22" stroke="#b43c0b" strokeWidth="1.2" />
        <line x1="44" y1="6" x2="44" y2="17" stroke="#156f55" strokeWidth="1.2" strokeDasharray="2 2" />
        <circle cx="44" cy="6" r="2.5" fill="#156f55" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 88 64"
      className="w-16 h-12 shrink-0 text-ink"
      aria-hidden="true"
    >
      {/* Sagittal bipedal axis, pelvic cradle and elastic tendon arc */}
      <line x1="44" y1="6" x2="44" y2="58" stroke="#1f5fa8" strokeWidth="1.15" strokeDasharray="3 2.5" />
      <circle cx="44" cy="11" r="4.5" fill="#f7f7f5" stroke="#121212" strokeWidth="1.35" />
      <path
        d="M44 16 C40 21, 47 26, 43 32"
        fill="none"
        stroke="#121212"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <ellipse cx="44" cy="33" rx="8" ry="3.5" fill="#f7f7f5" stroke="#121212" strokeWidth="1.3" />
      <path
        d="M39 35 L42 46 L40 56 M49 35 L46 46 L48 56"
        fill="none"
        stroke="#121212"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M52 44 C56 48, 56 53, 50 56"
        fill="none"
        stroke="#b43c0b"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line x1="22" y1="57" x2="66" y2="57" stroke="#e2e2dd" strokeWidth="1.3" />
    </svg>
  );
}

interface Scene3DProgressCardProps {
  sceneId: Scene3DId;
  onFallbackTo2D?: () => void;
  compact?: boolean;
}

/**
 * Editorial progress card aligned with the Diploma de Estudios Africanos · ULPGC
 * visual identity (Fraunces + Plus Jakarta Sans + IBM Plex Mono, ochre/forest/lapis tokens).
 */
export function Scene3DProgressCard({
  sceneId,
  onFallbackTo2D,
  compact = false,
}: Scene3DProgressCardProps) {
  const profile = SCENE_3D_PROFILES[sceneId];
  const snapshot = useScene3DLoadState(sceneId);
  const progress = Math.max(snapshot.progress, snapshot.status === 'idle' ? 12 : snapshot.progress);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`bg-paper border border-hairline flex flex-col justify-between ${
        compact ? 'w-full h-full' : profile.heightClass
      }`}
    >
      {/* Editorial Diploma Masthead Strip */}
      <div className="px-4 py-2.5 border-b border-hairline bg-canvas flex flex-wrap items-center justify-between gap-2">
        <div className="font-mono text-[11px] text-ink-muted flex items-center gap-2">
          <span className="text-ink font-medium">Diploma de Estudios Africanos · ULPGC</span>
          <span aria-hidden="true">·</span>
          <span>Carga asíncrona 3D</span>
        </div>
        <span className="font-mono text-[11px] font-semibold text-ochre tabular-nums">
          {progress}%
        </span>
      </div>

      {/* Centered Editorial Progress Block */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-lg bg-canvas border border-hairline border-t-2 border-t-rule p-5 sm:p-6 flex flex-col gap-5">
          <div className="flex items-start gap-4">
            <DiplomaSceneEmblem sceneId={sceneId} />
            <div className="flex flex-col gap-1 min-w-0">
              <span className="font-mono text-[11px] text-ochre">{profile.kicker}</span>
              <h4 className="font-display text-lg sm:text-xl font-semibold text-ink leading-snug m-0">
                {profile.title}
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed m-0">{profile.subtitle}</p>
            </div>
          </div>

          {/* Determinate Progress Bar (Compositor-only scaleX transform) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3 font-mono text-[11px]">
              <span className="text-ink truncate">{snapshot.detail}</span>
              <span className="text-ink font-semibold tabular-nums shrink-0">{progress}%</span>
            </div>
            <div
              role="progressbar"
              aria-label={`Progreso de carga de ${profile.title}`}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="w-full h-2 bg-surface-high border border-hairline overflow-hidden"
            >
              <div
                className="h-full w-full bg-ochre origin-left transition-transform duration-200 ease-out motion-reduce:transition-none"
                style={{ transform: `scaleX(${Math.max(0.06, progress / 100)})` }}
              />
            </div>
          </div>

          {/* 4-Stage Pipeline Indicator */}
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-3 border-t border-hairline m-0 p-0 list-none">
            {profile.stages.map((stage, idx) => {
              const isDone = idx < snapshot.stageIndex || progress >= 100;
              const isCurrent = idx === snapshot.stageIndex && progress < 100;
              return (
                <li
                  key={stage.id}
                  className="flex items-center gap-2 font-mono text-[11px] min-w-0"
                >
                  <span
                    className={`w-4 h-4 shrink-0 border flex items-center justify-center text-[10px] tabular-nums ${
                      isDone
                        ? 'bg-forest text-white border-forest'
                        : isCurrent
                          ? 'bg-ochre-soft text-ochre border-ochre font-semibold'
                          : 'bg-paper text-ink-subtle border-hairline'
                    }`}
                  >
                    {isDone ? <Check className="w-2.5 h-2.5" aria-hidden="true" /> : idx + 1}
                  </span>
                  <span
                    className={`truncate ${
                      isDone
                        ? 'text-forest'
                        : isCurrent
                          ? 'text-ink font-semibold'
                          : 'text-ink-subtle'
                    }`}
                  >
                    {stage.label}
                  </span>
                </li>
              );
            })}
          </ol>

          {onFallbackTo2D && (
            <div className="pt-2 border-t border-hairline flex items-center justify-between gap-3">
              <span className="font-mono text-[10.5px] text-ink-subtle">
                Motor Three.js · Carga diferida bajo demanda
              </span>
              <button
                type="button"
                onClick={onFallbackTo2D}
                className="font-mono text-[11px] text-ink-muted hover:text-ink underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
              >
                Volver a vista 2D
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Seamless in-viewport hydration overlay shown while WebGL studio, procedural textures,
 * and 3D geometry finish assembling before the first frame is presented.
 */
export function Scene3DHydrationOverlay({
  sceneId,
  isReady,
  onFallbackTo2D,
}: {
  sceneId: Scene3DId;
  isReady: boolean;
  onFallbackTo2D?: () => void;
}) {
  if (isReady) return null;

  return (
    <div className="absolute inset-0 z-20 bg-paper">
      <Scene3DProgressCard sceneId={sceneId} onFallbackTo2D={onFallbackTo2D} compact />
    </div>
  );
}

interface Scene3DErrorBoundaryProps {
  sceneId: Scene3DId;
  onFallbackTo2D?: () => void;
  children: ReactNode;
}

interface Scene3DErrorBoundaryState {
  hasError: boolean;
  retryKey: number;
}

class Scene3DErrorBoundary extends Component<Scene3DErrorBoundaryProps, Scene3DErrorBoundaryState> {
  state: Scene3DErrorBoundaryState = { hasError: false, retryKey: 0 };

  static getDerivedStateFromError(): Partial<Scene3DErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[Scene3D:${this.props.sceneId}] Error al cargar el visor 3D:`, error, info);
  }

  handleRetry = () => {
    resetScene3DLoadState(this.props.sceneId);
    this.setState((prev) => ({ hasError: false, retryKey: prev.retryKey + 1 }));
  };

  render() {
    if (this.state.hasError) {
      const profile = SCENE_3D_PROFILES[this.props.sceneId];
      return (
        <div
          className={`bg-paper border border-hairline ${profile.heightClass} flex flex-col items-center justify-center p-6 text-center`}
        >
          <div className="max-w-md bg-canvas border border-hairline border-t-2 border-t-ochre p-6 flex flex-col items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-ochre" aria-hidden="true" />
            <h4 className="font-display text-lg font-semibold text-ink m-0">
              No se pudo cargar el módulo 3D
            </h4>
            <p className="text-xs leading-relaxed text-ink-muted m-0">
              Se ha interrumpido la carga asíncrona de <strong>{profile.title}</strong>. Puedes
              reintentar la descarga del motor WebGL o continuar en la vista 2D.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleRetry}
                className="min-h-[38px] px-3.5 py-1.5 font-mono text-xs bg-ink text-white border border-ink rounded hover:bg-ochre hover:border-ochre transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reintentar carga 3D</span>
              </button>
              {this.props.onFallbackTo2D && (
                <button
                  type="button"
                  onClick={this.props.onFallbackTo2D}
                  className="min-h-[38px] px-3.5 py-1.5 font-mono text-xs bg-paper text-ink border border-hairline rounded hover:border-ink transition-colors cursor-pointer"
                >
                  Volver a vista 2D
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return <div key={this.state.retryKey}>{this.props.children}</div>;
  }
}

export function Scene3DAsyncBoundary({
  sceneId,
  onFallbackTo2D,
  deferUntilNearViewport = true,
  children,
}: {
  sceneId: Scene3DId;
  onFallbackTo2D?: () => void;
  deferUntilNearViewport?: boolean;
  children: ReactNode;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [shouldMount, setShouldMount] = useState<boolean>(
    () => !deferUntilNearViewport || typeof IntersectionObserver === 'undefined'
  );

  useEffect(() => {
    if (shouldMount) return;
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShouldMount(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          prefetch3DScene(sceneId);
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: '360px 0px', threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sceneId, shouldMount]);

  return (
    <div ref={hostRef}>
      {shouldMount ? (
        <Scene3DErrorBoundary sceneId={sceneId} onFallbackTo2D={onFallbackTo2D}>
          <Suspense
            fallback={<Scene3DProgressCard sceneId={sceneId} onFallbackTo2D={onFallbackTo2D} />}
          >
            {children}
          </Suspense>
        </Scene3DErrorBoundary>
      ) : (
        <Scene3DProgressCard sceneId={sceneId} onFallbackTo2D={onFallbackTo2D} />
      )}
    </div>
  );
}
