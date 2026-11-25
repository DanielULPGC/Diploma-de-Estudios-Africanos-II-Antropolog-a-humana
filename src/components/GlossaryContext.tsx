import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { findGlossaryTerm, type GlossaryTerm } from '../data/glossary';
import type { CourseDeepAction } from '../data/courseNavigation';
import { GlossaryContextualSidebar } from './GlossaryContextualSidebar';

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
  const [termHistory, setTermHistory] = useState<GlossaryTerm[]>([]);
  const [jumpRequest, setJumpRequest] = useState<GlossaryJumpRequest | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const closeTerm = useCallback(() => {
    setActiveTerm(null);
    setTermHistory([]);
    const opener = openerRef.current;
    openerRef.current = null;
    if (opener && typeof opener.focus === 'function') {
      requestAnimationFrame(() => opener.focus());
    }
  }, []);

  const openTerm = useCallback((idOrName: string, opener?: HTMLElement | null) => {
    const resolved = findGlossaryTerm(idOrName);
    if (!resolved) return;
    if (!openerRef.current) {
      openerRef.current = opener ?? (document.activeElement as HTMLElement | null);
    }
    setTermHistory([]);
    setActiveTerm(resolved);
  }, []);

  const handleSelectRelatedTerm = useCallback(
    (nextTerm: GlossaryTerm, pushToHistory = true) => {
      if (pushToHistory && activeTerm && activeTerm.id !== nextTerm.id) {
        setTermHistory((prev) => [...prev.slice(-8), activeTerm]);
      }
      setActiveTerm(nextTerm);
    },
    [activeTerm]
  );

  const handleGoBack = useCallback(() => {
    setTermHistory((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setActiveTerm(last);
      return prev.slice(0, -1);
    });
  }, []);

  const jumpToGlossary = useCallback((term?: GlossaryTerm) => {
    setActiveTerm(null);
    setTermHistory([]);
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

  const handleNavigateCourse = useCallback((action: CourseDeepAction) => {
    setActiveTerm(null);
    setTermHistory([]);
    openerRef.current = null;
    window.dispatchEvent(new CustomEvent('ulpgc:navigate-course', { detail: action }));
  }, []);

  return (
    <GlossaryContext.Provider value={{ openTerm, closeTerm, jumpToGlossary, jumpRequest }}>
      {children}

      <GlossaryContextualSidebar
        term={activeTerm}
        history={termHistory}
        onSelectTerm={handleSelectRelatedTerm}
        onGoBack={handleGoBack}
        onClose={closeTerm}
        onJumpToGlossary={jumpToGlossary}
        onNavigateCourse={handleNavigateCourse}
      />
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
      title="Abrir búsqueda contextual, definición extendida y enlaces al temario"
      className={`inline p-0 m-0 bg-transparent border-0 font-inherit text-inherit underline decoration-dotted underline-offset-4 decoration-[1.5px] transition-colors cursor-help ${toneClass} ${className}`}
    >
      {children}
    </button>
  );
}
