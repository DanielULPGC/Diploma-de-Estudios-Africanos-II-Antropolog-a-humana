import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ArrowDownRight, BookOpen, X } from 'lucide-react';
import { findGlossaryTerm, type GlossaryTerm } from '../data/glossary';

export interface GlossaryJumpRequest {
  termId: string;
  query: string;
  nonce: number;
}

interface GlossaryContextValue {
  openTerm: (idOrName: string, opener?: HTMLElement | null) => void;
  closeTerm: () => void;
  jumpToGlossary: (term?: GlossaryTerm) => void;
  jumpRequest: GlossaryJumpRequest | null;
}

const GlossaryContext = createContext<GlossaryContextValue | null>(null);

export function useGlossary() {
  const ctx = useContext(GlossaryContext);
  if (!ctx) {
    throw new Error('useGlossary debe utilizarse dentro de GlossaryProvider');
  }
  return ctx;
}

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [activeTerm, setActiveTerm] = useState<GlossaryTerm | null>(null);
  const [jumpRequest, setJumpRequest] = useState<GlossaryJumpRequest | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const closeTerm = useCallback(() => {
    setActiveTerm(null);
    const opener = openerRef.current;
    openerRef.current = null;
    if (opener && typeof opener.focus === 'function') {
      requestAnimationFrame(() => opener.focus());
    }
  }, []);

  const openTerm = useCallback((idOrName: string, opener?: HTMLElement | null) => {
    const resolved = findGlossaryTerm(idOrName);
    if (!resolved) return;
    openerRef.current = opener ?? (document.activeElement as HTMLElement | null);
    setActiveTerm(resolved);
  }, []);

  const jumpToGlossary = useCallback((term?: GlossaryTerm) => {
    setActiveTerm(null);
    openerRef.current = null;
    setJumpRequest({
      termId: term?.id ?? '',
      query: term ? term.term.split('(')[0].trim() : '',
      nonce: Date.now(),
    });
    window.dispatchEvent(
      new CustomEvent('ulpgc:navigate-course', { detail: { sectionId: 'sec-glosario' } })
    );
  }, []);

  useEffect(() => {
    if (!activeTerm) return;
    requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closeTerm();
      }
    };
    const onPointerDown = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        closeTerm();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    const timer = window.setTimeout(() => {
      document.addEventListener('mousedown', onPointerDown);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [activeTerm, closeTerm]);

  const categoryColor = (cat: GlossaryTerm['category']) => {
    if (cat === 'paleobotanica') return 'text-forest';
    if (cat === 'metodos') return 'text-lapis';
    if (cat === 'etologia') return 'text-plum';
    return 'text-ochre';
  };

  return (
    <GlossaryContext.Provider value={{ openTerm, closeTerm, jumpToGlossary, jumpRequest }}>
      {children}

      {activeTerm && (
        <div
          className="fixed inset-x-0 bottom-4 sm:bottom-6 z-50 px-4 flex justify-center pointer-events-none no-print"
          role="presentation"
        >
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="false"
            aria-labelledby="contextual-glossary-title"
            className="pointer-events-auto w-full max-w-xl bg-canvas border border-ink border-t-2 border-t-ochre shadow-lg p-5 flex flex-col gap-3.5 focus:outline-none"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-xs text-ink-muted">
                  <span className={`font-medium ${categoryColor(activeTerm.category)}`}>
                    {activeTerm.categoryLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Glosario contextual</span>
                </div>
                <h3
                  id="contextual-glossary-title"
                  className="font-display text-lg sm:text-xl font-semibold text-ink leading-snug"
                >
                  {activeTerm.term}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeTerm}
                aria-label="Cerrar definición del glosario"
                className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded border border-hairline bg-paper text-ink hover:border-ink transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <p className="text-[15px] leading-relaxed text-ink m-0">{activeTerm.definition}</p>

            <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-xs text-ink-muted">
                {activeTerm.moduleContext}
              </span>

              <button
                type="button"
                onClick={() => jumpToGlossary(activeTerm)}
                className="min-h-[40px] px-3.5 py-1.5 font-mono text-xs font-medium text-ink bg-paper border border-hairline rounded hover:border-ink hover:bg-surface inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
                <span>Abrir en el glosario completo</span>
                <ArrowDownRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </GlossaryContext.Provider>
  );
}

interface GlossaryTermTriggerProps {
  termId: string;
  children: ReactNode;
  tone?: 'ochre' | 'lapis' | 'forest' | 'ink';
  className?: string;
}

export function GlossaryTermTrigger({
  termId,
  children,
  tone = 'ochre',
  className = '',
}: GlossaryTermTriggerProps) {
  const { openTerm } = useGlossary();

  const toneClass =
    tone === 'lapis'
      ? 'decoration-lapis/70 hover:text-lapis'
      : tone === 'forest'
        ? 'decoration-forest/70 hover:text-forest'
        : tone === 'ink'
          ? 'decoration-ink/50 hover:text-ochre'
          : 'decoration-ochre/70 hover:text-ochre';

  return (
    <button
      type="button"
      onClick={(e) => openTerm(termId, e.currentTarget)}
      title="Consultar definición en el glosario técnico"
      className={`inline p-0 m-0 bg-transparent border-0 font-inherit text-inherit underline decoration-dotted underline-offset-4 decoration-[1.5px] transition-colors cursor-help ${toneClass} ${className}`}
    >
      {children}
    </button>
  );
}
