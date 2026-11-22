import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ExternalLink, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import { INSTITUTIONAL_MEDIA } from '../data/taxonImages';

export interface LightboxItem {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  caption?: string;
  credit?: string;
  license?: string;
  licenseUrl?: string;
  sourceUrl?: string;
  fallbackSrc?: string;
}

interface LightboxState {
  mode: 'single' | 'compare';
  items: LightboxItem[];
}

interface LightboxContextValue {
  openSingle: (item: LightboxItem, opener?: HTMLElement | null) => void;
  openCompare: (itemA: LightboxItem, itemB: LightboxItem, opener?: HTMLElement | null) => void;
  closeLightbox: () => void;
}

const ZOOM_STEPS = [1, 1.75, 2.5] as const;

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) {
    throw new Error('useLightbox debe utilizarse dentro de LightboxProvider');
  }
  return ctx;
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LightboxState | null>(null);
  const [zoomIdx, setZoomIdx] = useState<number>(0);
  const openerRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const zoom = ZOOM_STEPS[zoomIdx];

  const closeLightbox = useCallback(() => {
    setState(null);
    setZoomIdx(0);
    const opener = openerRef.current;
    openerRef.current = null;
    if (opener && typeof opener.focus === 'function') {
      requestAnimationFrame(() => opener.focus());
    }
  }, []);

  const openSingle = useCallback((item: LightboxItem, opener?: HTMLElement | null) => {
    openerRef.current = opener ?? (document.activeElement as HTMLElement | null);
    setZoomIdx(0);
    setState({ mode: 'single', items: [item] });
  }, []);

  const openCompare = useCallback(
    (itemA: LightboxItem, itemB: LightboxItem, opener?: HTMLElement | null) => {
      openerRef.current = opener ?? (document.activeElement as HTMLElement | null);
      setZoomIdx(0);
      setState({ mode: 'compare', items: [itemA, itemB] });
    },
    []
  );

  useEffect(() => {
    if (!state) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => closeBtnRef.current?.focus());

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        closeLightbox();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusables.length > 0) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
        return;
      }
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setZoomIdx((idx) => Math.min(ZOOM_STEPS.length - 1, idx + 1));
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setZoomIdx((idx) => Math.max(0, idx - 1));
      } else if (e.key === '0') {
        e.preventDefault();
        setZoomIdx(0);
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [state, closeLightbox]);

  return (
    <LightboxContext.Provider value={{ openSingle, openCompare, closeLightbox }}>
      {children}

      {state && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-[60] bg-[#121212]/94 backdrop-blur-xs flex flex-col no-print"
          role="dialog"
          aria-modal="true"
          aria-label={
            state.mode === 'compare'
              ? 'Comparación visual ampliada de especímenes'
              : `Visor ampliado: ${state.items[0]?.title ?? 'Imagen'}`
          }
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          {/* Top toolbar */}
          <div className="px-4 sm:px-6 py-3.5 border-b border-white/15 flex flex-wrap items-center justify-between gap-3 bg-[#121212] text-white shrink-0">
            <div className="min-w-0 flex flex-col">
              <span className="font-mono text-xs text-white/85 tracking-wide">
                {state.mode === 'compare'
                  ? 'Comparación osteológica ampliada · Visor museográfico'
                  : state.items[0]?.subtitle || 'Visor museográfico ampliado'}
              </span>
              <h2 className="font-display text-base sm:text-lg font-semibold text-white truncate m-0">
                {state.mode === 'compare'
                  ? `${state.items[0]?.title} frente a ${state.items[1]?.title}`
                  : state.items[0]?.title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div
                className="inline-flex items-center gap-1 border border-white/20 rounded p-0.5 bg-white/5"
                role="group"
                aria-label="Controles de ampliación"
              >
                <button
                  type="button"
                  onClick={() => setZoomIdx((i) => Math.max(0, i - 1))}
                  disabled={zoomIdx === 0}
                  aria-label="Reducir ampliación"
                  className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded text-white hover:bg-white/15 disabled:opacity-35 cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" aria-hidden="true" />
                </button>
                {ZOOM_STEPS.map((step, i) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setZoomIdx(i)}
                    aria-pressed={zoomIdx === i}
                    className={`min-h-[36px] px-2.5 font-mono text-xs tabular-nums rounded transition-colors cursor-pointer ${
                      zoomIdx === i
                        ? 'bg-ochre text-white font-semibold'
                        : 'text-white/80 hover:bg-white/15'
                    }`}
                  >
                    {String(step).replace('.', ',')}×
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setZoomIdx((i) => Math.min(ZOOM_STEPS.length - 1, i + 1))}
                  disabled={zoomIdx === ZOOM_STEPS.length - 1}
                  aria-label="Aumentar ampliación"
                  className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded text-white hover:bg-white/15 disabled:opacity-35 cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" aria-hidden="true" />
                </button>
                {zoomIdx > 0 && (
                  <button
                    type="button"
                    onClick={() => setZoomIdx(0)}
                    aria-label="Restablecer zoom a 1×"
                    className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded text-white/80 hover:bg-white/15 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>

              <button
                ref={closeBtnRef}
                type="button"
                onClick={closeLightbox}
                className="min-h-[40px] px-3.5 py-1.5 text-xs font-semibold text-[#121212] bg-white rounded hover:bg-[#f1f1ee] inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
                <span>Cerrar</span>
                <span className="font-mono text-[11px] opacity-80 hidden sm:inline">Esc</span>
              </button>
            </div>
          </div>

          {/* Main Zoomable Stage */}
          <div
            className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeLightbox();
            }}
          >
            {state.mode === 'single' ? (
              <div className="max-w-6xl w-full flex flex-col items-center">
                <div
                  className={`w-full overflow-auto border border-white/15 bg-[#1b1b19] flex ${
                    zoom > 1 ? 'items-start justify-start' : 'items-center justify-center'
                  } p-3 sm:p-5 max-h-[68vh]`}
                >
                  <img
                    src={state.items[0].src}
                    alt={state.items[0].alt}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const fallback =
                        state.items[0].fallbackSrc ?? INSTITUTIONAL_MEDIA.smithsonianCrania;
                      if (target.src !== fallback) {
                        target.src = fallback;
                      }
                    }}
                    style={
                      zoom === 1
                        ? { maxHeight: '62vh', maxWidth: '100%' }
                        : { width: `${zoom * 100}%`, maxWidth: 'none' }
                    }
                    className="h-auto object-contain select-none transition-all duration-150"
                  />
                </div>
              </div>
            ) : (
              <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                {state.items.map((item, idx) => (
                  <figure
                    key={`${item.title}-${idx}`}
                    className="m-0 bg-[#1b1b19] border border-white/15 flex flex-col overflow-hidden"
                  >
                    <div className="px-4 py-2.5 border-b border-white/10 flex items-baseline justify-between gap-2">
                      <span className="font-display italic text-base font-semibold text-white">
                        {item.title}
                      </span>
                      {item.subtitle && (
                        <span className="font-mono text-[11px] text-white/70 tabular-nums shrink-0">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                    <div
                      className={`overflow-auto p-3 flex ${
                        zoom > 1 ? 'items-start justify-start' : 'items-center justify-center'
                      } h-[44vh] sm:h-[52vh] bg-[#242420]`}
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          const fallback =
                            item.fallbackSrc ?? INSTITUTIONAL_MEDIA.smithsonianCrania;
                          if (target.src !== fallback) {
                            target.src = fallback;
                          }
                        }}
                        style={
                          zoom === 1
                            ? { maxHeight: '100%', maxWidth: '100%' }
                            : { width: `${zoom * 100}%`, maxWidth: 'none' }
                        }
                        className="h-auto object-contain select-none"
                      />
                    </div>
                    <figcaption className="px-4 py-3 border-t border-white/15 text-xs text-white/90 flex flex-col gap-1">
                      {item.caption && <span className="leading-snug">{item.caption}</span>}
                      <span className="font-mono text-[11.5px] text-white/80 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        {item.credit && <span>{item.credit}</span>}
                        {item.license && item.licenseUrl ? (
                          <a
                            href={item.licenseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-white"
                          >
                            {item.license}
                          </a>
                        ) : (
                          item.license && <span>{item.license}</span>
                        )}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>

          {/* Curatorial footer strip (for single mode) */}
          {state.mode === 'single' && state.items[0] && (
            <div className="px-4 sm:px-6 py-3.5 border-t border-white/15 bg-[#121212] text-white/85 shrink-0">
              <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <p className="m-0 leading-relaxed text-white/90 max-w-3xl">
                  {state.items[0].caption || state.items[0].alt}
                </p>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-white/80 shrink-0">
                  {state.items[0].credit && <span>{state.items[0].credit}</span>}
                  {state.items[0].license && (
                    <>
                      <span aria-hidden="true">·</span>
                      {state.items[0].licenseUrl ? (
                        <a
                          href={state.items[0].licenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/90 underline hover:text-white"
                        >
                          {state.items[0].license}
                        </a>
                      ) : (
                        <span>{state.items[0].license}</span>
                      )}
                    </>
                  )}
                  {state.items[0].sourceUrl && (
                    <>
                      <span aria-hidden="true">·</span>
                      <a
                        href={state.items[0].sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-white/90 underline hover:text-white"
                      >
                        <span>Fuente</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </LightboxContext.Provider>
  );
}
