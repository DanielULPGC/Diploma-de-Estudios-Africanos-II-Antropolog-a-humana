import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Box,
  Check,
  Columns2,
  Copy,
  Layers,
  Search,
} from 'lucide-react';
import {
  COURSE_BLOCKS,
  COURSE_CHAPTERS,
  INTERACTIVE_LAB_SHORTCUTS,
  getBlockMeta,
  getChapterMeta,
  type CourseBlockId,
  type CourseDeepAction,
  type StudyViewMode,
} from '../data/courseNavigation';
import { prefetch3DScene } from '../utils/async3dLoader';
import {
  ReadingPrefsInlineStrip,
  type ReadingPrefs,
} from './ReadingPreferencesBar';

interface CourseStudyNavigatorProps {
  studyViewMode: StudyViewMode;
  activeBlockId: CourseBlockId;
  activeSectionId: string;
  visitedSections: string[];
  readingPrefs: ReadingPrefs;
  onChangeReadingPrefs: (next: ReadingPrefs) => void;
  onChangeViewMode: (mode: StudyViewMode) => void;
  onSelectBlock: (blockId: CourseBlockId) => void;
  onNavigate: (action: CourseDeepAction) => void;
  onOpenSearch: () => void;
}

export function CourseStudyNavigator({
  studyViewMode,
  activeBlockId,
  activeSectionId,
  visitedSections,
  readingPrefs,
  onChangeReadingPrefs,
  onChangeViewMode,
  onSelectBlock,
  onNavigate,
  onOpenSearch,
}: CourseStudyNavigatorProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const visitedSet = new Set(visitedSections);
  const visitedCount = COURSE_CHAPTERS.filter((c) => visitedSet.has(c.id)).length;
  const activeBlock = getBlockMeta(activeBlockId);
  const activeChapter = getChapterMeta(activeSectionId);

  const handleCopyLink = async () => {
    try {
      const url = new URL(window.location.href);
      url.hash = activeSectionId;
      await navigator.clipboard.writeText(url.toString());
      setCopiedLink(true);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        copyTimerRef.current = null;
        setCopiedLink(false);
      }, 2200);
    } catch {
      // Fallback: update URL hash silently so user can copy from address bar
      window.history.replaceState(null, '', `#${activeSectionId}`);
    }
  };

  const getBlockTopBorder = (accent: (typeof COURSE_BLOCKS)[number]['accent'], isActive: boolean) => {
    if (!isActive) return 'border-t-hairline';
    if (accent === 'lapis') return 'border-t-lapis';
    if (accent === 'forest') return 'border-t-forest';
    if (accent === 'plum') return 'border-t-plum';
    if (accent === 'ink') return 'border-t-ink';
    return 'border-t-ochre';
  };

  const getBlockRomanTone = (accent: (typeof COURSE_BLOCKS)[number]['accent']) => {
    if (accent === 'lapis') return 'text-lapis';
    if (accent === 'forest') return 'text-forest';
    if (accent === 'plum') return 'text-plum';
    if (accent === 'ink') return 'text-ink';
    return 'text-ochre';
  };

  return (
    <section
      aria-label="Mapa didáctico del Módulo I y accesos directos"
      className="flex flex-col gap-6 pb-8 border-b border-rule reading-mode-hide no-print"
    >
      {/* Top Study Control Bar: View Mode + Search + Active Location + Share */}
      <div className="bg-paper border border-hairline p-4 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[11px] text-ochre font-medium">
              Ruta de estudio · Módulo I ({COURSE_BLOCKS.length} bloques · {COURSE_CHAPTERS.length} apartados)
            </span>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-muted">
              <span>
                Ubicación actual:{' '}
                <strong className="text-ink font-semibold">
                  Bloque {activeBlock.roman}
                </strong>
              </span>
              <span aria-hidden="true">›</span>
              <span className="text-ink">{activeChapter.label}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {visitedCount}/{COURSE_CHAPTERS.length} recorridos
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Segmented Control */}
            <div
              role="group"
              aria-label="Modo de visualización de contenidos"
              className="inline-flex items-center p-0.5 bg-canvas border border-hairline rounded"
            >
              <button
                type="button"
                onClick={() => onChangeViewMode('completo')}
                aria-pressed={studyViewMode === 'completo'}
                className={`min-h-[38px] px-3 py-1 font-mono text-xs rounded-xs inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  studyViewMode === 'completo'
                    ? 'bg-ink text-white font-medium'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Recorrido completo</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeViewMode('bloque')}
                aria-pressed={studyViewMode === 'bloque'}
                className={`min-h-[38px] px-3 py-1 font-mono text-xs rounded-xs inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  studyViewMode === 'bloque'
                    ? 'bg-ochre text-white font-medium'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Por bloque (I–V)</span>
              </button>
            </div>

            {/* Quick Search Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="min-h-[40px] px-3.5 py-1.5 bg-canvas border border-ink text-ink hover:bg-ink hover:text-white rounded font-mono text-xs inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Buscar contenido</span>
              <span className="hidden sm:inline opacity-75 text-[11px]">Ctrl+K</span>
            </button>

            {/* Share Deep Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="min-h-[40px] px-3 py-1.5 bg-canvas border border-hairline hover:border-ink text-ink-muted hover:text-ink rounded font-mono text-xs inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Copiar enlace directo a la sección actual"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
                  <span className="text-forest">Enlace copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Copiar enlace</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Inline Reading Comfort Preferences (Font Size, Warm Paper, Spacing) */}
        <ReadingPrefsInlineStrip prefs={readingPrefs} onChange={onChangeReadingPrefs} />

        {/* 5 Academic Block Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {COURSE_BLOCKS.map((blk) => {
            const isBlockActive = blk.id === activeBlockId;
            const chapters = blk.chapterIds.map((id) => getChapterMeta(id));
            const blockMin = chapters.reduce((acc, ch) => acc + (ch.durationMin ?? 0), 0);
            const blockVisited = chapters.filter((ch) => visitedSet.has(ch.id)).length;

            return (
              <div
                key={blk.id}
                className={`bg-canvas border border-hairline border-t-2 p-4 flex flex-col justify-between gap-3 transition-colors ${getBlockTopBorder(
                  blk.accent,
                  isBlockActive
                )}`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectBlock(blk.id)}
                      className={`font-mono text-xs font-semibold hover:underline underline-offset-4 cursor-pointer text-left ${getBlockRomanTone(
                        blk.accent
                      )}`}
                    >
                      Bloque {blk.roman} · {blk.shortTitle}
                    </button>
                    <span className="font-mono text-[10.5px] text-ink-muted tabular-nums whitespace-nowrap">
                      {blockMin} min
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-ink-muted m-0">
                    {blk.description}
                  </p>

                  {/* Direct chapter links inside block (>=40px touch targets) */}
                  <ul className="m-0 pt-2 border-t border-hairline list-none flex flex-col gap-0.5">
                    {chapters.map((ch) => {
                      const isCurrent = ch.id === activeSectionId;
                      const isVisited = visitedSet.has(ch.id);
                      return (
                        <li key={ch.id}>
                          <button
                            type="button"
                            onClick={() => onNavigate({ sectionId: ch.id })}
                            className={`w-full min-h-[40px] py-2 px-2 -mx-2 rounded text-left text-xs sm:text-[13px] flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-ochre-soft text-ink font-semibold'
                                : 'text-ink hover:bg-paper hover:text-ochre'
                            }`}
                          >
                            <span className="flex items-baseline gap-2 min-w-0">
                              <span className="font-mono text-[11px] text-ink-muted shrink-0">
                                {ch.num}
                              </span>
                              <span className="truncate">{ch.shortLabel}</span>
                            </span>
                            {isVisited && (
                              <Check
                                className="w-3.5 h-3.5 text-forest shrink-0"
                                aria-label="Sección visitada"
                              />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="pt-2 border-t border-hairline flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-ink-muted tabular-nums">
                    {blockVisited}/{chapters.length} vistos
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectBlock(blk.id)}
                    className={`min-h-[36px] px-1 font-mono text-xs inline-flex items-center gap-1 cursor-pointer whitespace-nowrap transition-colors ${
                      studyViewMode === 'bloque' && isBlockActive
                        ? 'text-ochre font-semibold'
                        : 'text-ink hover:text-ochre'
                    }`}
                  >
                    <span>
                      {studyViewMode === 'bloque' && isBlockActive
                        ? 'Bloque activo'
                        : studyViewMode === 'bloque'
                          ? 'Estudiar bloque'
                          : 'Ir al bloque'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Access Strip to Interactive Labs & 3D Viewers */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-mono text-[11px] text-ink-muted">
            Acceso directo a laboratorios 3D y herramientas prácticas
          </span>
          <span className="font-mono text-[10.5px] text-ink-muted">
            Un clic abre la sección y activa la herramienta correspondiente
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {INTERACTIVE_LAB_SHORTCUTS.map((lab) => {
            const prefetchTarget =
              lab.id === 'lab-biomecanica-3d'
                ? 'biomechanics'
                : lab.id === 'lab-etologia-3d'
                  ? 'ethology'
                  : null;
            return (
              <button
                key={lab.id}
                type="button"
                onMouseEnter={() => {
                  if (prefetchTarget) prefetch3DScene(prefetchTarget);
                }}
                onFocus={() => {
                  if (prefetchTarget) prefetch3DScene(prefetchTarget);
                }}
                onClick={() => onNavigate(lab.action)}
                className="p-3 bg-canvas border border-hairline hover:border-ink text-left flex items-start justify-between gap-3 transition-colors cursor-pointer group"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {prefetchTarget && (
                      <Box className="w-3.5 h-3.5 text-ochre shrink-0" aria-hidden="true" />
                    )}
                    <span className="font-display text-sm font-semibold text-ink group-hover:text-ochre transition-colors truncate">
                      {lab.title}
                    </span>
                  </div>
                  <span className="text-xs text-ink-muted leading-snug line-clamp-1">
                    {lab.subtitle}
                  </span>
                  <span className="font-mono text-[10.5px] text-ink-muted pt-0.5">
                    {lab.tag}
                  </span>
                </div>
                <ArrowRight
                  className="w-4 h-4 text-ink-subtle group-hover:text-ochre group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
