import { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Layers,
  List,
  Search,
  X,
} from 'lucide-react';
import {
  COURSE_BLOCKS,
  COURSE_CHAPTERS,
  getBlockMeta,
  getChapterMeta,
  type CourseBlockId,
  type StudyViewMode,
} from '../data/courseNavigation';
import type { FontScaleOption, ReadingPrefs } from './ReadingPreferencesBar';

interface ChapterIndexNavProps {
  activeChapterId: string;
  activeBlockId: CourseBlockId;
  studyViewMode: StudyViewMode;
  visitedSections: string[];
  scrollProgress: number;
  readingPrefs: ReadingPrefs;
  onChangeReadingPrefs: (next: ReadingPrefs) => void;
  onSelectChapter: (id: string) => void;
  onChangeViewMode: (mode: StudyViewMode) => void;
  onOpenSearch: () => void;
  onEnableReadingMode: () => void;
  onOpenGlossary: () => void;
}

export function ChapterIndexNav({
  activeChapterId,
  activeBlockId,
  studyViewMode,
  visitedSections,
  scrollProgress,
  readingPrefs,
  onChangeReadingPrefs,
  onSelectChapter,
  onChangeViewMode,
  onOpenSearch,
  onEnableReadingMode,
  onOpenGlossary,
}: ChapterIndexNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const drawerRef = useRef<HTMLElement | null>(null);
  const triggerBtnRef = useRef<HTMLButtonElement | null>(null);

  const visitedSet = new Set(visitedSections);
  const visitedCount = COURSE_CHAPTERS.filter((c) => visitedSet.has(c.id)).length;

  const activeIndex = Math.max(
    0,
    COURSE_CHAPTERS.findIndex((c) => c.id === activeChapterId)
  );
  const activeChapter = COURSE_CHAPTERS[activeIndex] ?? COURSE_CHAPTERS[0];
  const activeBlock = getBlockMeta(activeBlockId);
  const prevChapter = activeIndex > 0 ? COURSE_CHAPTERS[activeIndex - 1] : null;
  const nextChapter =
    activeIndex < COURSE_CHAPTERS.length - 1 ? COURSE_CHAPTERS[activeIndex + 1] : null;
  const pct = Math.round(scrollProgress * 100);

  useEffect(() => {
    if (!isOpen) return;
    const focusTimer = window.setTimeout(() => {
      drawerRef.current?.focus();
    }, 10);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        setIsOpen(false);
        requestAnimationFrame(() => triggerBtnRef.current?.focus());
      }
    };
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 no-print reading-mode-hide"
    >
      {isOpen && (
        <nav
          ref={drawerRef}
          tabIndex={-1}
          aria-label="Índice estructurado por bloques del Módulo I"
          className="w-[min(calc(100vw-2rem),352px)] max-h-[76vh] overflow-y-auto bg-canvas border border-ink border-t-2 border-t-ochre shadow-lg flex flex-col focus:outline-none"
        >
          {/* Drawer Header */}
          <div className="px-4 py-3 border-b border-hairline bg-paper flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="font-mono text-[10.5px] text-ochre font-medium">
                Índice por bloques · ULPGC
              </span>
              <span className="font-mono text-[11px] text-ink-muted tabular-nums">
                {visitedCount}/{COURSE_CHAPTERS.length} apartados · Lectura {pct} %
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenSearch();
                }}
                aria-label="Abrir buscador rápido (Ctrl+K)"
                title="Buscar contenido (Ctrl+K)"
                className="min-h-[34px] px-2.5 inline-flex items-center gap-1.5 rounded border border-hairline bg-canvas text-ink hover:border-ink font-mono text-[11px] cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
                <span>Buscar</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  requestAnimationFrame(() => triggerBtnRef.current?.focus());
                }}
                aria-label="Cerrar índice de capítulos"
                className="min-h-[34px] min-w-[34px] inline-flex items-center justify-center rounded border border-hairline bg-canvas text-ink hover:border-ink cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Compact Study Mode & Font Size Toggle */}
          <div className="px-3 py-2.5 border-b border-hairline bg-canvas flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center p-0.5 bg-paper border border-hairline rounded">
              <button
                type="button"
                onClick={() => onChangeViewMode('completo')}
                aria-pressed={studyViewMode === 'completo'}
                className={`min-h-[34px] px-2.5 py-0.5 font-mono text-[11px] rounded-xs inline-flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
                  studyViewMode === 'completo'
                    ? 'bg-ink text-white font-medium'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Layers className="w-3 h-3" aria-hidden="true" />
                <span>Completa</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeViewMode('bloque')}
                aria-pressed={studyViewMode === 'bloque'}
                className={`min-h-[34px] px-2.5 py-0.5 font-mono text-[11px] rounded-xs inline-flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
                  studyViewMode === 'bloque'
                    ? 'bg-ochre text-white font-medium'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Columns2 className="w-3 h-3" aria-hidden="true" />
                <span>Por bloque</span>
              </button>
            </div>

            <div
              role="group"
              aria-label="Tamaño de letra rápido"
              className="inline-flex items-center p-0.5 bg-paper border border-hairline rounded"
            >
              {(
                [
                  { id: 'normal', label: 'A' },
                  { id: 'large', label: 'A+' },
                  { id: 'xlarge', label: 'A++' },
                ] as Array<{ id: FontScaleOption; label: string }>
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={readingPrefs.fontScale === opt.id}
                  onClick={() =>
                    onChangeReadingPrefs({ ...readingPrefs, fontScale: opt.id })
                  }
                  className={`min-h-[34px] min-w-[34px] px-2 font-mono text-[11px] rounded-xs transition-colors cursor-pointer ${
                    readingPrefs.fontScale === opt.id
                      ? 'bg-ink text-white font-semibold'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grouped Chapters by 4 Academic Blocks */}
          <div className="p-2 flex flex-col gap-3">
            {COURSE_BLOCKS.map((blk) => (
              <div key={blk.id} className="flex flex-col gap-0.5">
                <div className="px-2 py-1 font-mono text-[11px] font-semibold text-ink-muted flex items-center justify-between">
                  <span>
                    Bloque {blk.roman} · {blk.shortTitle}
                  </span>
                  {studyViewMode === 'bloque' && blk.id === activeBlockId && (
                    <span className="text-ochre">Activo</span>
                  )}
                </div>
                <ul className="m-0 p-0 list-none flex flex-col gap-0.5">
                  {blk.chapterIds.map((chId) => {
                    const ch = getChapterMeta(chId);
                    const isCurrent = ch.id === activeChapter.id;
                    const isVisited = visitedSet.has(ch.id);
                    return (
                      <li key={ch.id}>
                        <button
                          type="button"
                          aria-current={isCurrent ? 'location' : undefined}
                          onClick={() => {
                            onSelectChapter(ch.id);
                            setIsOpen(false);
                          }}
                          className={`w-full min-h-[40px] px-2.5 py-2 text-left text-xs sm:text-[13px] rounded flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-ochre-soft text-ink font-semibold'
                              : 'text-ink-muted hover:bg-paper hover:text-ink'
                          }`}
                        >
                          <span className="flex items-baseline gap-2 min-w-0">
                            <span
                              className={`font-mono text-[11px] shrink-0 w-12 tabular-nums ${
                                isCurrent ? 'text-ochre font-semibold' : 'text-ink-subtle'
                              }`}
                            >
                              {ch.num}
                            </span>
                            <span className="truncate">{ch.label}</span>
                          </span>
                          {isVisited && (
                            <Check
                              className="w-3.5 h-3.5 text-forest shrink-0"
                              aria-label="Visitado"
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Prev / Next quick chapter stepping */}
          <div className="px-3 py-2 border-t border-hairline bg-paper flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={!prevChapter}
              onClick={() => {
                if (!prevChapter) return;
                onSelectChapter(prevChapter.id);
                setIsOpen(false);
              }}
              className="min-h-[34px] px-2.5 py-1 text-[11px] font-mono text-ink bg-canvas border border-hairline rounded hover:border-ink disabled:opacity-35 inline-flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Anterior</span>
            </button>
            <button
              type="button"
              disabled={!nextChapter}
              onClick={() => {
                if (!nextChapter) return;
                onSelectChapter(nextChapter.id);
                setIsOpen(false);
              }}
              className="min-h-[34px] px-2.5 py-1 text-[11px] font-mono text-ink bg-canvas border border-hairline rounded hover:border-ink disabled:opacity-35 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Utility actions */}
          <div className="px-3 py-2.5 border-t border-hairline bg-canvas flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onEnableReadingMode();
              }}
              className="min-h-[34px] px-2.5 py-1 text-[11px] font-medium text-ink bg-paper border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
              <span>Modo Lectura</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenGlossary();
              }}
              className="min-h-[34px] px-2.5 py-1 text-[11px] font-medium text-ink bg-paper border border-hairline rounded hover:border-ink cursor-pointer"
            >
              Glosario
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="Volver al inicio de la página"
              className="min-h-[34px] px-2.5 py-1 text-[11px] font-mono text-ink-muted bg-canvas border border-hairline rounded hover:text-ink hover:border-ink inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Inicio</span>
            </button>
          </div>
        </nav>
      )}

      {/* Compact single-line floating trigger bar (height 42px, <6% mobile viewport) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Abrir buscador rápido del módulo"
          className="md:hidden min-h-[42px] min-w-[42px] px-3 py-2 bg-canvas text-ink border border-ink rounded shadow-md hover:bg-paper transition-colors duration-150 inline-flex items-center justify-center gap-1.5 text-xs font-medium cursor-pointer"
        >
          <Search className="w-4 h-4 text-ochre shrink-0" aria-hidden="true" />
          <span className="sr-only">Buscar</span>
        </button>

        <button
          ref={triggerBtnRef}
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          aria-expanded={isOpen}
          aria-label={`Abrir índice rápido por bloques (actual: Bloque ${activeBlock.roman}, ${activeChapter.label})`}
          className="min-h-[42px] max-w-[260px] sm:max-w-[290px] px-3.5 py-2 bg-ink text-white border border-ink rounded shadow-md hover:bg-ochre hover:border-ochre transition-colors duration-150 inline-flex items-center gap-2 text-xs font-medium cursor-pointer"
        >
          <List className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="font-mono text-[11px] text-white/85 shrink-0 tabular-nums">
            B.{activeBlock.roman}
          </span>
          <span className="truncate">{activeChapter.shortLabel}</span>
        </button>
      </div>
    </div>
  );
}
