import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Download,
  Layers,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { EDITORIAL_PLATES, KEY_STATS } from './data/curriculum';
import { findGlossaryTerm } from './data/glossary';
import {
  COURSE_BLOCKS,
  COURSE_CHAPTERS,
  dispatchCourseDetailEvent,
  getBlockForChapter,
  getBlockMeta,
  getChapterMeta,
  type CourseBlockId,
  type CourseDeepAction,
  type StudyViewMode,
} from './data/courseNavigation';
import { EditorialPlate } from './components/EditorialPlate';
import { OriginsModule } from './components/OriginsModule';
import { AnthropologySyllabusModule } from './components/AnthropologySyllabusModule';
import { MetallurgyModule } from './components/MetallurgyModule';
import { KingdomsModule } from './components/KingdomsModule';
import { TradeSimulatorModule } from './components/TradeSimulatorModule';
import { HistoriographyModule } from './components/HistoriographyModule';
import { QuizAndBibliography } from './components/QuizAndBibliography';
import { GlossaryDrawer } from './components/GlossaryDrawer';
import { GlossaryProvider, GlossaryTermTrigger, useGlossary } from './components/GlossaryContext';
import { LightboxProvider } from './components/LightboxContext';
import { ChapterIndexNav } from './components/ChapterIndexNav';
import { CourseStudyNavigator } from './components/CourseStudyNavigator';
import { CourseCommandPalette } from './components/CourseCommandPalette';
import {
  ReadingModeToolbar,
  getReadingPrefsClassNames,
  loadReadingPrefs,
  saveReadingPrefs,
  type ReadingPrefs,
} from './components/ReadingPreferencesBar';
import type { HenkeTaskSpec } from './data/ethologyData';
import { ETHOLOGY_TASK_3D_LAYOUTS } from './data/visualSchemas3dData';
import { cancelPendingScroll, scheduleInstantScrollToElement } from './utils/scrollPosition';

const LazyLithicWebXRExperience = lazy(() => import('./components/LithicWebXRExperience'));
const LazyAtlasPaleoModule = lazy(() =>
  import('./components/AtlasPaleoModule').then((m) => ({ default: m.AtlasPaleoModule }))
);
const LazyAtlasPaleobotanicaModule = lazy(() =>
  import('./components/AtlasPaleobotanicaModule').then((m) => ({
    default: m.AtlasPaleobotanicaModule,
  }))
);
const LazyPaleomolecularModule = lazy(() =>
  import('./components/PaleomolecularModule').then((m) => ({ default: m.PaleomolecularModule }))
);
const LazyEthologyModule = lazy(() =>
  import('./components/EthologyModule').then((m) => ({ default: m.EthologyModule }))
);
const LazyCannibalismStereotypesModule = lazy(
  () => import('./components/CannibalismStereotypesModule')
);
const LazyVisualAnthropologyAfricaModule = lazy(
  () => import('./components/VisualAnthropologyAfricaModule')
);
const LazyCulturalStudiesAfricaModule = lazy(
  () => import('./components/CulturalStudiesAfricaModule')
);

function LazySectionFallback({
  kicker,
  title,
  accentClass = 'text-ochre',
}: {
  kicker: string;
  title: string;
  accentClass?: string;
}) {
  return (
    <section className="pt-12 border-t border-hairline py-10 flex flex-col gap-2">
      <span className={`font-mono text-xs ${accentClass}`}>{kicker}</span>
      <p className="font-display text-lg text-ink-muted m-0">{title}</p>
    </section>
  );
}

const VISITED_STORAGE_KEY = 'ulpgc_dea_visited_sections_v1';
const LAST_SECTION_STORAGE_KEY = 'ulpgc_dea_last_section_v1';

interface ReturnReadingOrigin {
  sectionId: string;
  blockId: CourseBlockId;
  label: string;
  scrollY: number;
}

const TOP_NAV_LINKS: Array<{ id: string; blockId?: CourseBlockId; label: string }> = [
  { id: 'sec-origenes', blockId: 'bloque-1', label: 'Evolución' },
  { id: 'sec-atlas-paleobotanica', blockId: 'bloque-2', label: 'Ciencias' },
  { id: 'sec-tecnologia', blockId: 'bloque-3', label: 'Sociedades' },
  { id: 'sec-bibliografia', blockId: 'bloque-4', label: 'Bibliografía' },
  { id: 'sec-glosario', label: 'Glosario' },
];

function BlockHeaderBand({
  blockId,
  showBlockSwitch,
  onSelectBlock,
  onSwitchToFull,
}: {
  blockId: CourseBlockId;
  showBlockSwitch: boolean;
  onSelectBlock: (id: CourseBlockId) => void;
  onSwitchToFull: () => void;
}) {
  const block = getBlockMeta(blockId);
  const accentText =
    block.accent === 'lapis'
      ? 'text-lapis'
      : block.accent === 'forest'
        ? 'text-forest'
        : block.accent === 'ink'
          ? 'text-ink'
          : 'text-ochre';

  return (
    <div
      id={`cabecera-${block.id}`}
      tabIndex={-1}
      className="pt-4 pb-3 border-b-2 border-rule flex flex-col gap-3 scroll-mt-20 hide-when-printing-seminar focus:outline-none"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className={`font-mono text-xs font-semibold tracking-wide ${accentText}`}>
            Bloque {block.roman} de IV · {block.shortTitle}
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink tracking-tight m-0">
            {block.title}
          </h2>
        </div>
        {showBlockSwitch && (
          <button
            type="button"
            onClick={onSwitchToFull}
            className="min-h-[40px] px-3.5 py-1.5 font-mono text-xs text-ink-muted hover:text-ink bg-paper border border-hairline hover:border-ink rounded inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer no-print"
          >
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Ver los 4 bloques juntos</span>
          </button>
        )}
      </div>

      {showBlockSwitch && (
        <div
          role="navigation"
          aria-label="Cambio rápido entre bloques temáticos"
          className="flex flex-wrap items-center gap-2 pt-1 no-print"
        >
          {COURSE_BLOCKS.map((blk) => {
            const isCurrent = blk.id === blockId;
            return (
              <button
                key={blk.id}
                type="button"
                aria-current={isCurrent ? 'step' : undefined}
                onClick={() => onSelectBlock(blk.id)}
                className={`min-h-[40px] px-3.5 py-1.5 font-mono text-xs rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'bg-ink text-white border-ink font-medium'
                    : 'bg-paper text-ink-muted border-hairline hover:border-ink hover:text-ink'
                }`}
              >
                Bloque {blk.roman} · {blk.shortTitle}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AppShell() {
  const { jumpToGlossary, openTerm } = useGlossary();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-origenes');
  const [studyViewMode, setStudyViewMode] = useState<StudyViewMode>('completo');
  const [activeBlockId, setActiveBlockId] = useState<CourseBlockId>('bloque-1');
  const [readingMode, setReadingMode] = useState(false);
  const [readingPrefs, setReadingPrefs] = useState<ReadingPrefs>(() => loadReadingPrefs());
  const [searchOpen, setSearchOpen] = useState(false);
  const [returnOrigin, setReturnOrigin] = useState<ReturnReadingOrigin | null>(null);
  const [lastSavedSectionId, setLastSavedSectionId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = window.localStorage.getItem(LAST_SECTION_STORAGE_KEY);
      if (saved && COURSE_CHAPTERS.some((c) => c.id === saved)) {
        return saved;
      }
    } catch {
      // Ignore storage errors
    }
    return null;
  });
  const [visitedSections, setVisitedSections] = useState<string[]>(() => {
    if (typeof window === 'undefined') return ['sec-origenes'];
    try {
      const raw = window.localStorage.getItem(VISITED_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : null;
      if (Array.isArray(parsed)) {
        const validIds = new Set(COURSE_CHAPTERS.map((c) => c.id));
        const filtered = Array.from(
          new Set(
            parsed.filter((x): x is string => typeof x === 'string' && validIds.has(x))
          )
        );
        return filtered.length > 0 ? filtered : ['sec-origenes'];
      }
    } catch {
      // Ignore storage failures in restricted contexts
    }
    return ['sec-origenes'];
  });

  const studyViewModeRef = useRef(studyViewMode);
  studyViewModeRef.current = studyViewMode;
  const activeSectionRef = useRef(activeSectionId);
  activeSectionRef.current = activeSectionId;
  const activeBlockRef = useRef(activeBlockId);
  activeBlockRef.current = activeBlockId;
  const scrollSpyLockUntilRef = useRef<number>(0);

  const lockScrollSpy = useCallback((durationMs = 360) => {
    scrollSpyLockUntilRef.current = Date.now() + durationMs;
  }, []);

  const handleChangeReadingPrefs = useCallback((next: ReadingPrefs) => {
    setReadingPrefs(next);
    saveReadingPrefs(next);
  }, []);

  const handleEnterSoloReadingMode = useCallback(() => {
    setReadingMode(true);
    setReadingPrefs((prev) => {
      const next: ReadingPrefs = {
        fontScale: prev.fontScale === 'normal' ? 'large' : prev.fontScale,
        paperTone: prev.paperTone === 'canvas' ? 'warm' : prev.paperTone,
        lineSpacing: 'relaxed',
      };
      saveReadingPrefs(next);
      return next;
    });
  }, []);

  // Sync font-scale, paper-tone, spacing, and reading-mode onto <html> so all rem units & portals scale globally
  useEffect(() => {
    const root = document.documentElement;
    const managed = [
      'reading-scale-large',
      'reading-scale-xlarge',
      'reading-tone-warm',
      'reading-tone-contrast',
      'reading-spacing-relaxed',
      'reading-mode',
    ];
    root.classList.remove(...managed);
    const activeClasses = getReadingPrefsClassNames(readingPrefs).split(' ').filter(Boolean);
    if (readingMode) activeClasses.push('reading-mode');
    if (activeClasses.length > 0) {
      root.classList.add(...activeClasses);
    }
    return () => {
      root.classList.remove(...managed);
    };
  }, [readingPrefs, readingMode]);

  const markSectionVisited = useCallback((sectionId: string) => {
    setLastSavedSectionId(sectionId);
    try {
      window.localStorage.setItem(LAST_SECTION_STORAGE_KEY, sectionId);
    } catch {
      // Ignore storage quota errors
    }
    setVisitedSections((prev) => {
      if (prev.includes(sectionId)) return prev;
      const next = [...prev, sectionId];
      try {
        window.localStorage.setItem(VISITED_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota errors
      }
      return next;
    });
  }, []);

  const navigateToCourseTarget = useCallback(
    (action: CourseDeepAction) => {
      if (action.glossaryTermId) {
        const term = findGlossaryTerm(action.glossaryTermId);
        if (term) {
          openTerm(term.id);
          return;
        }
      }

      const targetId = action.sectionId;
      const targetBlock = getBlockForChapter(targetId);

      // Save return point when jumping to Glossary or across blocks via deep link
      if (targetId === 'sec-glosario' && activeSectionRef.current !== 'sec-glosario') {
        const prevChapter = getChapterMeta(activeSectionRef.current);
        setReturnOrigin({
          sectionId: activeSectionRef.current,
          blockId: activeBlockRef.current,
          label: prevChapter.shortLabel,
          scrollY: typeof window !== 'undefined' ? window.scrollY : 0,
        });
      }

      lockScrollSpy(400);
      setActiveSectionId(targetId);
      setActiveBlockId(targetBlock);
      markSectionVisited(targetId);

      if (typeof window !== 'undefined' && window.location.hash !== `#${targetId}`) {
        window.history.replaceState(null, '', `#${targetId}`);
      }

      // Wait for React commit + layout so newly mounted block components register their
      // listeners before dispatching detail events and jumping instantaneously.
      scheduleInstantScrollToElement(() => document.getElementById(targetId), {
        focusTarget: true,
        onBeforeScroll: () => dispatchCourseDetailEvent(action),
      });
    },
    [lockScrollSpy, markSectionVisited, openTerm]
  );

  const handleReturnToOrigin = useCallback(() => {
    if (!returnOrigin) return;
    const origin = returnOrigin;
    setReturnOrigin(null);
    lockScrollSpy(400);
    setActiveBlockId(origin.blockId);
    setActiveSectionId(origin.sectionId);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${origin.sectionId}`);
    }
    if (studyViewModeRef.current === 'completo' && origin.scrollY > 0) {
      cancelPendingScroll();
      const targetY = origin.scrollY;
      window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
    } else {
      scheduleInstantScrollToElement(() => document.getElementById(origin.sectionId), {
        focusTarget: true,
      });
    }
  }, [lockScrollSpy, returnOrigin]);

  // Listen to cross-module deep navigation requests (e.g., Glossary or Anthropology cross-links)
  useEffect(() => {
    const onGlobalNav = (event: Event) => {
      const detail = (event as CustomEvent<CourseDeepAction>).detail;
      if (!detail?.sectionId) return;
      navigateToCourseTarget(detail);
    };
    window.addEventListener('ulpgc:navigate-course', onGlobalNav);
    return () => window.removeEventListener('ulpgc:navigate-course', onGlobalNav);
  }, [navigateToCourseTarget]);

  // Global Ctrl+K / Cmd+K quick search shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Track visible section & block automatically during scroll
  useEffect(() => {
    const ids = COURSE_CHAPTERS.map((c) => c.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < scrollSpyLockUntilRef.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const topId = visible[0]?.target.id;
        if (topId) {
          setActiveSectionId(topId);
          setActiveBlockId(getBlockForChapter(topId));
          markSectionVisited(topId);
        }
      },
      { rootMargin: '-18% 0px -62% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [studyViewMode, activeBlockId, markSectionVisited]);

  useEffect(() => {
    if (!readingMode) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) {
        setReadingMode(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [readingMode]);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress(Math.min(1, Math.max(0, scrollTop / docHeight)));
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [studyViewMode, activeBlockId]);

  useEffect(() => {
    const validChapterIds = new Set(COURSE_CHAPTERS.map((c) => c.id));
    const scrollToHash = () => {
      const hashId = window.location.hash.replace(/^#/, '');
      if (!hashId || !validChapterIds.has(hashId)) return;
      const block = getBlockForChapter(hashId);
      lockScrollSpy(400);
      setActiveBlockId(block);
      setActiveSectionId(hashId);
      markSectionVisited(hashId);
      scheduleInstantScrollToElement(() => document.getElementById(hashId));
    };
    const timer = window.setTimeout(scrollToHash, 60);
    window.addEventListener('hashchange', scrollToHash);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, [lockScrollSpy, markSectionVisited]);

  const handleSelectBlock = (blockId: CourseBlockId) => {
    const blk = getBlockMeta(blockId);
    const firstChapterId = blk.chapterIds[0];
    lockScrollSpy(400);
    setActiveBlockId(blockId);
    setActiveSectionId(firstChapterId);
    markSectionVisited(firstChapterId);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${firstChapterId}`);
    }
    scheduleInstantScrollToElement(
      () =>
        document.getElementById(`cabecera-${blockId}`) ??
        document.getElementById(firstChapterId),
      { focusTarget: true }
    );
  };

  const handleChangeViewMode = (mode: StudyViewMode) => {
    const currentBlock = getBlockForChapter(activeSectionRef.current);
    lockScrollSpy(400);
    setStudyViewMode(mode);
    setActiveBlockId(currentBlock);
    scheduleInstantScrollToElement(
      () =>
        document.getElementById(`cabecera-${currentBlock}`) ??
        document.getElementById(activeSectionRef.current),
      { focusTarget: true }
    );
  };

  const showBlock = (blockId: CourseBlockId) =>
    studyViewMode === 'completo' || activeBlockId === blockId;

  const activeBlockIndex = COURSE_BLOCKS.findIndex((b) => b.id === activeBlockId);
  const prevBlock = activeBlockIndex > 0 ? COURSE_BLOCKS[activeBlockIndex - 1] : null;
  const nextBlock =
    activeBlockIndex >= 0 && activeBlockIndex < COURSE_BLOCKS.length - 1
      ? COURSE_BLOCKS[activeBlockIndex + 1]
      : null;

  const readingPrefsClasses = getReadingPrefsClassNames(readingPrefs);
  const resumeChapter =
    lastSavedSectionId && lastSavedSectionId !== 'sec-origenes'
      ? getChapterMeta(lastSavedSectionId)
      : null;

  return (
    <div
      id="top"
      className={`min-h-screen bg-canvas text-ink ${readingMode ? 'reading-mode' : ''} ${readingPrefsClasses}`}
    >
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:px-4 focus:py-2 focus:bg-ink focus:text-white focus:rounded focus:text-xs focus:font-semibold no-print"
      >
        Saltar al contenido principal
      </a>

      {/* Strict 3-Zone Top Bar Contract + Reading Progress Hairline */}
      {!readingMode ? (
        <header
          data-sticky-topbar="true"
          className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-xs border-b border-hairline no-print"
        >
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-8">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-display text-base sm:text-lg font-semibold tracking-tight text-ink whitespace-nowrap shrink-0"
            >
              Estudios Africanos · ULPGC
            </a>

            <nav
              className="hidden lg:flex items-center gap-5 text-sm font-medium text-ink-muted"
              aria-label="Navegación por bloques del módulo"
            >
              {TOP_NAV_LINKS.map((link) => {
                const isCurrent = link.blockId
                  ? activeBlockId === link.blockId && activeSectionId !== 'sec-glosario'
                  : activeSectionId === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    aria-current={isCurrent ? 'location' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      if (link.blockId) {
                        handleSelectBlock(link.blockId);
                      } else {
                        navigateToCourseTarget({ sectionId: link.id });
                      }
                    }}
                    className={`transition-colors duration-150 whitespace-nowrap shrink-0 py-1 border-b ${
                      isCurrent
                        ? 'text-ink font-semibold border-ochre'
                        : 'text-ink-muted border-transparent hover:text-ink hover:border-ink'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <div className="shrink-0 flex items-center gap-2">
              {import.meta.env.DEV && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch('/diploma-estudios-africanos-moodle.zip');
                      if (!res.ok) throw new Error(`HTTP ${res.status}`);
                      const blob = await res.blob();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'diploma-estudios-africanos-moodle.zip';
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
                    } catch {
                      const fallback = document.createElement('a');
                      fallback.href = '/diploma-estudios-africanos-moodle.zip';
                      fallback.download = 'diploma-estudios-africanos-moodle.zip';
                      document.body.appendChild(fallback);
                      fallback.click();
                      fallback.remove();
                    }
                  }}
                  className="min-h-[40px] px-3 py-1.5 text-xs font-semibold text-ochre bg-paper border border-ochre rounded hover:bg-ochre hover:text-white transition-colors duration-150 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>ZIP Moodle</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleEnterSoloReadingMode}
                className="min-h-[40px] px-3.5 py-1.5 text-xs font-semibold text-white bg-ink rounded hover:bg-ochre transition-colors duration-150 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Solo lectura</span>
              </button>
            </div>
          </div>

          {/* Thin reading depth indicator (compositor-only scaleX) */}
          <div className="h-[2px] w-full bg-transparent overflow-hidden" aria-hidden="true">
            <div
              className="h-full w-full bg-ochre origin-left transition-transform duration-100"
              style={{ transform: `scaleX(${scrollProgress})` }}
            />
          </div>
        </header>
      ) : (
        <ReadingModeToolbar
          prefs={readingPrefs}
          scrollProgress={scrollProgress}
          activeSectionId={activeSectionId}
          activeBlockId={activeBlockId}
          onChangePrefs={handleChangeReadingPrefs}
          onNavigateChapter={(id) => navigateToCourseTarget({ sectionId: id })}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenGlossary={() => jumpToGlossary()}
          onExitReadingMode={() => setReadingMode(false)}
        />
      )}

      <main
        id="contenido-principal"
        tabIndex={-1}
        className={`${
          readingMode ? 'max-w-[780px] pt-8 sm:pt-12' : 'max-w-[1200px] pt-10 sm:pt-14'
        } mx-auto px-5 sm:px-8 pb-24 flex flex-col gap-12 transition-[max-width] duration-200 focus:outline-none`}
      >
        {/* Editorial Hero: Balanced 2-Column Split */}
        <section className="pb-10 border-b border-rule hide-when-printing-seminar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <div className="font-mono text-xs tracking-wide text-ochre">
                  Universidad de Las Palmas de Gran Canaria · Diploma de Estudios Africanos ·
                  Módulo I
                </div>
                <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.35rem] font-semibold leading-[1.06] tracking-tight text-ink [text-wrap:balance]">
                  De la cuna de la humanidad a los grandes reinos precoloniales
                </h1>
                <p className="font-display italic text-lg sm:text-xl leading-relaxed text-ink-muted max-w-[58ch]">
                  Un recorrido interactivo por 300.000 años de profundidad histórica africana: desde
                  el origen panafricano de nuestra especie y el corpus completo del Atlas de
                  Paleoantropología hasta los imperios del Sahel, la meseta de Zimbabue y las redes
                  globales del Sáhara y el océano Índico.
                </p>
              </div>

              <div className="flex flex-col gap-4 pt-4 border-t border-hairline">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-ink-muted">
                  <span>4 bloques temáticos · {COURSE_CHAPTERS.length} módulos</span>
                  <span aria-hidden="true">·</span>
                  <span>Atlas de Paleoantropología (ULPGC)</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">Tiempo estimado: 45–60 min</span>
                </div>

                {!readingMode && (
                  <div className="flex flex-wrap items-center gap-2.5 no-print">
                    <button
                      type="button"
                      onClick={() => handleSelectBlock('bloque-1')}
                      className="min-h-[42px] px-4 py-2 text-xs font-semibold text-white bg-ink rounded hover:bg-ochre transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Comenzar Bloque I</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>

                    {resumeChapter && (
                      <button
                        type="button"
                        onClick={() => navigateToCourseTarget({ sectionId: resumeChapter.id })}
                        className="min-h-[42px] px-3.5 py-2 text-xs font-semibold text-ochre bg-ochre-soft border border-ochre/40 rounded inline-flex items-center gap-2 hover:border-ochre transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span className="max-w-[200px] truncate">
                          Retomar: {resumeChapter.shortLabel}
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSearchOpen(true)}
                      className="min-h-[42px] px-3.5 py-2 text-xs font-medium text-ink bg-paper border border-hairline rounded inline-flex items-center gap-2 hover:border-ink hover:bg-surface transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
                      <span>Buscar en el módulo</span>
                      <span className="font-mono text-[11px] text-ink-muted hidden sm:inline">
                        Ctrl+K
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleEnterSoloReadingMode}
                      aria-pressed={readingMode}
                      className="min-h-[42px] px-3.5 py-2 text-xs font-semibold text-ochre bg-ochre-soft border border-ochre/40 rounded inline-flex items-center gap-2 hover:border-ochre transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Modo solo lectura</span>
                    </button>

                    <div
                      role="group"
                      aria-label="Cambiar tamaño de letra rápidamente"
                      className="inline-flex items-center p-0.5 bg-paper border border-hairline rounded"
                    >
                      {(
                        [
                          { id: 'normal', label: 'A', aria: 'Letra estándar' },
                          { id: 'large', label: 'A+', aria: 'Letra grande' },
                          { id: 'xlarge', label: 'A++', aria: 'Letra muy grande' },
                        ] as const
                      ).map((opt) => {
                        const active = readingPrefs.fontScale === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            aria-label={opt.aria}
                            aria-pressed={active}
                            onClick={() =>
                              handleChangeReadingPrefs({ ...readingPrefs, fontScale: opt.id })
                            }
                            className={`min-h-[38px] min-w-[38px] px-2.5 py-1 font-mono text-xs rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                              active
                                ? 'bg-ink text-white font-semibold'
                                : 'text-ink-muted hover:text-ink'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 reading-mode-hide">
              <EditorialPlate plate={EDITORIAL_PLATES.hero} fillHeight priority />
            </div>
          </div>
        </section>

        {/* Structured Course Roadmap, View Mode Switcher, Reading Preferences & Direct Lab Shortcuts */}
        <CourseStudyNavigator
          studyViewMode={studyViewMode}
          activeBlockId={activeBlockId}
          activeSectionId={activeSectionId}
          visitedSections={visitedSections}
          readingPrefs={readingPrefs}
          onChangeReadingPrefs={handleChangeReadingPrefs}
          onChangeViewMode={handleChangeViewMode}
          onSelectBlock={handleSelectBlock}
          onNavigate={navigateToCourseTarget}
          onOpenSearch={() => setSearchOpen(true)}
        />

        {/* Full-Width 4-Column Quantitative Strip + Opening Narrative (shown in Full mode or Block I) */}
        {showBlock('bloque-1') && (
          <section
            aria-label="Magnitudes históricas clave"
            className="flex flex-col gap-8 hide-when-printing-seminar"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {KEY_STATS.map((st) => {
                const numTone =
                  st.accent === 'ochre'
                    ? 'text-ochre'
                    : st.accent === 'lapis'
                      ? 'text-lapis'
                      : 'text-ink';
                const deltaTone = st.accent === 'ochre' ? 'text-ochre' : 'text-ink-muted';

                return (
                  <div
                    key={st.label}
                    className="border-t border-rule pt-3 flex flex-col gap-1.5"
                  >
                    <span className="font-mono text-[11px] tracking-wide text-ink-muted">
                      {st.label}
                    </span>
                    <span
                      className={`font-mono text-2xl sm:text-3xl font-medium tabular-nums tracking-tight leading-none ${numTone}`}
                    >
                      {st.value}
                    </span>
                    <span className={`font-mono text-xs ${deltaTone}`}>{st.delta}</span>
                    {typeof st.barPercent === 'number' && (
                      <div
                        className="h-1.5 bg-surface-high mt-1.5 overflow-hidden"
                        aria-hidden="true"
                      >
                        <span
                          className="block h-full bg-ochre-bright"
                          style={{ width: `${st.barPercent}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-4 max-w-[68ch] text-base leading-[1.74] text-ink">
              <p>
                Durante el siglo XIX y buena parte del XX, la historiografía colonial —bajo la
                sombra de prejuicios como la afirmación hegeliana de un «continente sin historia»—
                redujo el pasado de África al momento del contacto europeo. Sin embargo, los avances
                convergentes de la{' '}
                <strong>
                  paleogenómica, la arqueología de campo, la lingüística histórica y el rescate de
                  manuscritos
                </strong>{' '}
                han desmontado por completo esa visión.
              </p>
              <p>
                Comprender el África contemporánea exige reconocer dos realidades fundacionales:
                primero, que toda la humanidad moderna desciende de poblaciones estructuradas a lo
                largo y ancho del continente africano, como confirma la{' '}
                <GlossaryTermTrigger termId="adn-antiguo" tone="lapis">
                  paleogenómica
                </GlossaryTermTrigger>
                ; segundo, que mucho antes de 1500, África albergaba{' '}
                <span className="hl-ochre">
                  Estados complejos, urbanismo diverso y sistemas jurídicos propios
                </span>{' '}
                integrados en el corazón del comercio afroeurasiático.
              </p>
            </div>
          </section>
        )}

        {/* BLOQUE I: Evolución humana y paleoantropología */}
        {showBlock('bloque-1') && (
          <div className="flex flex-col gap-12 hide-when-printing-seminar">
            <BlockHeaderBand
              blockId="bloque-1"
              showBlockSwitch={studyViewMode === 'bloque'}
              onSelectBlock={handleSelectBlock}
              onSwitchToFull={() => handleChangeViewMode('completo')}
            />
            <OriginsModule />
            <AnthropologySyllabusModule />
            <div
              id="sec-atlas-paleo"
              tabIndex={-1}
              className="scroll-mt-20 focus:outline-none"
            >
              <Suspense
                fallback={
                  <LazySectionFallback
                    kicker="Atlas de Paleoantropología y Portal DEA"
                    title="Cargando especies fósiles, comparador, reloj de 24 h y PaleoLab 3D…"
                    accentClass="text-lapis"
                  />
                }
              >
                <LazyAtlasPaleoModule />
              </Suspense>
            </div>
          </div>
        )}

        {/* BLOQUE II: Ecología, evidencia molecular y conducta */}
        {showBlock('bloque-2') && (
          <div className="flex flex-col gap-12 hide-when-printing-seminar">
            <BlockHeaderBand
              blockId="bloque-2"
              showBlockSwitch={studyViewMode === 'bloque'}
              onSelectBlock={handleSelectBlock}
              onSwitchToFull={() => handleChangeViewMode('completo')}
            />
            <div
              id="sec-atlas-paleobotanica"
              tabIndex={-1}
              className="scroll-mt-20 focus:outline-none"
            >
              <Suspense
                fallback={
                  <LazySectionFallback
                    kicker="Atlas de Paleobotánica"
                    title="Cargando panel paleoambiental y evolución de la flora africana…"
                    accentClass="text-forest"
                  />
                }
              >
                <LazyAtlasPaleobotanicaModule />
              </Suspense>
            </div>
            <div
              id="sec-paleomolecular"
              tabIndex={-1}
              className="scroll-mt-20 focus:outline-none"
            >
              <Suspense
                fallback={
                  <LazySectionFallback
                    kicker="Aparato biomolecular · Paleoproteómica y Paleogenómica"
                    title="Cargando horizonte de preservación, laboratorio de viabilidad y firmas bioquímicas…"
                    accentClass="text-lapis"
                  />
                }
              >
                <LazyPaleomolecularModule />
              </Suspense>
            </div>
            <div
              id="etologia"
              tabIndex={-1}
              className="scroll-mt-20 focus:outline-none"
            >
              <Suspense
                fallback={
                  <LazySectionFallback
                    kicker="Etología · Primatología comparada y arqueología de primates"
                    title="Cargando experimento lítico 3D, árbol de parentesco y talleres etológicos…"
                    accentClass="text-ochre"
                  />
                }
              >
                <LazyEthologyModule />
              </Suspense>
            </div>
          </div>
        )}

        {/* BLOQUE III: Tecnología, reinos y redes africanas */}
        {showBlock('bloque-3') && (
          <div className="flex flex-col gap-12 hide-when-printing-seminar">
            <BlockHeaderBand
              blockId="bloque-3"
              showBlockSwitch={studyViewMode === 'bloque'}
              onSelectBlock={handleSelectBlock}
              onSwitchToFull={() => handleChangeViewMode('completo')}
            />
            <MetallurgyModule />
            <KingdomsModule />
            <TradeSimulatorModule />
            <HistoriographyModule />
            <div
              id="sec-estereotipos-canibalismo"
              tabIndex={-1}
              className="scroll-mt-20 focus:outline-none"
            >
              <Suspense
                fallback={
                  <LazySectionFallback
                    kicker="05b. Antropología visual e imaginarios coloniales"
                    title="Cargando galería histórica, Cronología Crítica y banco de análisis sobre estereotipos del canibalismo…"
                    accentClass="text-ochre"
                  />
                }
              >
                <LazyCannibalismStereotypesModule />
              </Suspense>
            </div>
            <div
              id="sec-antropologia-visual"
              tabIndex={-1}
              className="scroll-mt-20 focus:outline-none"
            >
              <Suspense
                fallback={
                  <LazySectionFallback
                    kicker="05c. Antropología visual y cine etnográfico · AntropologiaVisual.net"
                    title="Cargando filmografía africana, conexión directa con antropologiavisual.net y guía visual…"
                    accentClass="text-lapis"
                  />
                }
              >
                <LazyVisualAnthropologyAfricaModule />
              </Suspense>
            </div>
            <div
              id="sec-cultural-studies"
              tabIndex={-1}
              className="scroll-mt-20 focus:outline-none"
            >
              <Suspense
                fallback={
                  <LazySectionFallback
                    kicker="05d. Cultural Studies y crítica poscolonial"
                    title="Cargando análisis del «África misteriosa», tropos, decodificador de Stuart Hall y contra-narrativas…"
                    accentClass="text-ochre"
                  />
                }
              >
                <LazyCulturalStudiesAfricaModule />
              </Suspense>
            </div>
          </div>
        )}

        {/* BLOQUE IV: Bibliografía y referencia */}
        {showBlock('bloque-4') && (
          <div className="flex flex-col gap-12">
            <BlockHeaderBand
              blockId="bloque-4"
              showBlockSwitch={studyViewMode === 'bloque'}
              onSelectBlock={handleSelectBlock}
              onSwitchToFull={() => handleChangeViewMode('completo')}
            />

            {/* Módulo 06: Bibliografía y repositorios */}
            <div className="hide-when-printing-seminar">
              <QuizAndBibliography />
            </div>

            {/* Glosario técnico desplegable */}
            <GlossaryDrawer />
          </div>
        )}

        {/* Sequential Block Stepper when studying by focused block */}
        {studyViewMode === 'bloque' && (
          <nav
            aria-label="Avance secuencial entre bloques temáticos"
            className="pt-8 border-t-2 border-rule flex flex-wrap items-center justify-between gap-4 hide-when-printing-seminar no-print"
          >
            {prevBlock ? (
              <button
                type="button"
                onClick={() => handleSelectBlock(prevBlock.id)}
                className="min-h-[42px] px-4 py-2 bg-paper border border-hairline hover:border-ink rounded text-left inline-flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-ochre shrink-0" aria-hidden="true" />
                <span className="flex flex-col">
                  <span className="font-mono text-[10.5px] text-ink-muted">Bloque anterior</span>
                  <span className="text-xs font-semibold text-ink">
                    Bloque {prevBlock.roman} · {prevBlock.shortTitle}
                  </span>
                </span>
              </button>
            ) : (
              <span />
            )}

            <button
              type="button"
              onClick={() => handleChangeViewMode('completo')}
              className="min-h-[40px] px-3.5 py-2 font-mono text-xs text-ink-muted hover:text-ink border border-hairline hover:border-ink rounded transition-colors whitespace-nowrap cursor-pointer"
            >
              Mostrar recorrido completo
            </button>

            {nextBlock ? (
              <button
                type="button"
                onClick={() => handleSelectBlock(nextBlock.id)}
                className="min-h-[42px] px-4 py-2 bg-ink text-white border border-ink hover:bg-ochre hover:border-ochre rounded text-right inline-flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <span className="flex flex-col">
                  <span className="font-mono text-[10.5px] text-white/80">Siguiente bloque</span>
                  <span className="text-xs font-semibold text-white">
                    Bloque {nextBlock.roman} · {nextBlock.shortTitle}
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            ) : (
              <span />
            )}
          </nav>
        )}
      </main>

      {/* Quiet Institutional Footer */}
      <footer className="border-t border-hairline bg-paper no-print reading-mode-hide">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-ink-muted">
          <div className="flex flex-col gap-1">
            <span className="font-display text-sm font-semibold text-ink">
              Diploma de Estudios Africanos · Universidad de Las Palmas de Gran Canaria (ULPGC)
            </span>
            <span className="font-mono text-[11px]">
              Módulo I · De la Cuna de la Humanidad a los Grandes Reinos Precoloniales
            </span>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="self-start sm:self-auto font-mono text-xs text-ink hover:text-ochre underline underline-offset-4 cursor-pointer whitespace-nowrap"
          >
            Volver al inicio
          </button>
        </div>
      </footer>

      {/* Global Quick Search & Jump Command Palette (Ctrl+K) */}
      <CourseCommandPalette
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigateToCourseTarget}
      />

      {/* Return-to-Reading-Point Floating Bar after jumping to Glossary */}
      {returnOrigin && (
        <div
          role="region"
          aria-label="Volver al punto de lectura anterior"
          className="fixed bottom-16 left-4 sm:bottom-4 z-40 max-w-[min(calc(100vw-2rem),340px)] sm:max-w-[min(calc(100vw-18.5rem),340px)] bg-canvas border border-ink border-t-2 border-t-ochre shadow-md px-3 py-2 flex items-center gap-2 no-print"
        >
          <button
            type="button"
            onClick={handleReturnToOrigin}
            className="min-h-[38px] text-left inline-flex items-center gap-2 text-xs font-medium text-ink hover:text-ochre transition-colors min-w-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-ochre shrink-0" aria-hidden="true" />
            <span className="flex flex-col min-w-0">
              <span className="font-mono text-[11px] text-ink-muted leading-none">
                Volver a la lectura
              </span>
              <span className="truncate font-semibold text-ink">{returnOrigin.label}</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setReturnOrigin(null)}
            aria-label="Descartar aviso de retorno"
            className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded border border-hairline text-ink-muted hover:text-ink hover:border-ink shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Floating Mobile & Desktop Block-Grouped Chapter Navigator */}
      <ChapterIndexNav
        activeChapterId={activeSectionId}
        activeBlockId={activeBlockId}
        studyViewMode={studyViewMode}
        visitedSections={visitedSections}
        scrollProgress={scrollProgress}
        readingPrefs={readingPrefs}
        onChangeReadingPrefs={handleChangeReadingPrefs}
        onSelectChapter={(id) => navigateToCourseTarget({ sectionId: id })}
        onChangeViewMode={handleChangeViewMode}
        onOpenSearch={() => setSearchOpen(true)}
        onEnableReadingMode={handleEnterSoloReadingMode}
        onOpenGlossary={() => jumpToGlossary()}
      />
    </div>
  );
}

function parseInitialLithicARParams(): {
  taskId: HenkeTaskSpec['id'];
  stoneId?: string;
} | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get('ar') !== 'lithic') return null;
  const rawTask = params.get('task');
  const taskId: HenkeTaskSpec['id'] =
    rawTask === 'task-1' || rawTask === 'task-2' || rawTask === 'task-3' ? rawTask : 'task-1';
  const rawStone = params.get('stone');
  const validStones = ETHOLOGY_TASK_3D_LAYOUTS[taskId]?.stones ?? [];
  const stoneId =
    rawStone && validStones.some((s) => s.id === rawStone) ? rawStone : undefined;
  return { taskId, stoneId };
}

export default function App() {
  const [qrArSession, setQrArSession] = useState<{
    taskId: HenkeTaskSpec['id'];
    stoneId?: string;
  } | null>(() => parseInitialLithicARParams());

  const handleExitQrArSession = useCallback(() => {
    setQrArSession(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('ar');
      url.searchParams.delete('task');
      url.searchParams.delete('stone');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  if (qrArSession) {
    return (
      <Suspense
        fallback={
          <div className="fixed inset-0 z-50 bg-[#12161f] text-[#f3efe6] flex flex-col items-center justify-center p-6 text-center gap-3">
            <span className="font-mono text-xs text-[#f2c178]">
              Diploma de Estudios Africanos · ULPGC
            </span>
            <p className="font-display text-lg font-semibold text-white m-0">
              Preparando visor WebXR de percusión lítica…
            </p>
            <p className="font-mono text-xs text-[#c7c2b6] m-0">
              Cargando bloque a escala real 1:1 (6 × 6 × 4 cm)
            </p>
          </div>
        }
      >
        <LazyLithicWebXRExperience
          initialTaskId={qrArSession.taskId}
          initialStoneId={qrArSession.stoneId}
          onExit={handleExitQrArSession}
        />
      </Suspense>
    );
  }

  return (
    <LightboxProvider>
      <GlossaryProvider>
        <AppShell />
      </GlossaryProvider>
    </LightboxProvider>
  );
}
