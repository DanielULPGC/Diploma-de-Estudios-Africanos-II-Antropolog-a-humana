import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Box,
  Compass,
  Globe2,
  HeartHandshake,
  LayoutGrid,
  ListChecks,
  Map as MapIcon,
  Table2,
} from 'lucide-react';
import {
  ANTHROPOLOGY_SYLLABUS_TOPICS,
  type AnthropologyTopic,
} from '../data/anthropologySyllabusData';
import {
  clearPendingCourseDetail,
  consumePendingCourseDetail,
} from '../data/courseNavigation';
import { LazyBiomechanics3D, prefetch3DScene } from '../utils/async3dLoader';
import { scheduleInstantScrollToElement } from '../utils/scrollPosition';
import { GlossaryTermTrigger } from './GlossaryContext';
import { Scene3DAsyncBoundary } from './Scene3DAsyncBoundary';

const loadPastwomenView = () =>
  import('./PastwomenEvolutionView').then((m) => ({ default: m.PastwomenEvolutionView }));
const loadSmithsonianView = () =>
  import('./SmithsonianHumanOriginsView').then((m) => ({ default: m.SmithsonianHumanOriginsView }));
const loadMigrationMapView = () =>
  import('./EvolutionMigrationMapD3').then((m) => ({ default: m.EvolutionMigrationMapD3 }));

const LazyPastwomenEvolutionView = lazy(loadPastwomenView);
const LazySmithsonianHumanOriginsView = lazy(loadSmithsonianView);
const LazyEvolutionMigrationMapD3 = lazy(loadMigrationMapView);

type ViewMode = 'detalle' | 'mapa' | 'pastwomen' | 'smithsonian' | 'migraciones';
type BlockFilter = 'todos' | AnthropologyTopic['block'];

const BLOCK_FILTERS: Array<{ id: BlockFilter; label: string }> = [
  { id: 'todos', label: 'Todos los temas (10)' },
  { id: 'Fundamentos y biología evolutiva', label: 'Temas 1–5 · Evolución y biología' },
  { id: 'Origen, mente y diversidad', label: 'Temas 6–7 · Mente y pluralidad' },
  { id: 'Cultura, parentesco y subsistencia', label: 'Temas 8–10 · Simbolismo, parentesco y dieta' },
];

export function AnthropologySyllabusModule() {
  const [viewMode, setViewMode] = useState<ViewMode>('detalle');
  const [blockFilter, setBlockFilter] = useState<BlockFilter>('todos');
  const [selectedId, setSelectedId] = useState<string>(ANTHROPOLOGY_SYLLABUS_TOPICS[0].id);
  const [tema4ViewMode, setTema4ViewMode] = useState<'2d' | '3d'>('3d');
  const workspaceTopRef = useRef<HTMLDivElement | null>(null);
  const topicArticleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const applyDetail = (detail?: {
      topicId?: string;
      view3d?: boolean;
      viewMode?: ViewMode;
    } | null) => {
      if (!detail) return;
      if (detail.topicId && ANTHROPOLOGY_SYLLABUS_TOPICS.some((t) => t.id === detail.topicId)) {
        setBlockFilter('todos');
        setSelectedId(detail.topicId);
        setViewMode(detail.viewMode ?? 'detalle');
      } else if (detail.viewMode) {
        setViewMode(detail.viewMode);
      }
      if (detail.view3d) {
        prefetch3DScene('biomechanics');
        setTema4ViewMode('3d');
      }
    };

    const pending = consumePendingCourseDetail('anthropology');
    if (pending) {
      applyDetail(pending);
    }

    const onOpenTarget = (event: Event) => {
      clearPendingCourseDetail('anthropology');
      applyDetail(
        (
          event as CustomEvent<{
            topicId?: string;
            view3d?: boolean;
            viewMode?: ViewMode;
          }>
        ).detail
      );
    };
    window.addEventListener('ulpgc:open-anthropology-target', onOpenTarget);
    return () => window.removeEventListener('ulpgc:open-anthropology-target', onOpenTarget);
  }, []);

  const visibleTopics = useMemo(() => {
    if (blockFilter === 'todos') return ANTHROPOLOGY_SYLLABUS_TOPICS;
    return ANTHROPOLOGY_SYLLABUS_TOPICS.filter((t) => t.block === blockFilter);
  }, [blockFilter]);

  const activeIndex = useMemo(() => {
    const idx = ANTHROPOLOGY_SYLLABUS_TOPICS.findIndex((t) => t.id === selectedId);
    return idx >= 0 ? idx : 0;
  }, [selectedId]);

  const activeTopic = ANTHROPOLOGY_SYLLABUS_TOPICS[activeIndex];
  const prevTopic = activeIndex > 0 ? ANTHROPOLOGY_SYLLABUS_TOPICS[activeIndex - 1] : null;
  const nextTopic =
    activeIndex < ANTHROPOLOGY_SYLLABUS_TOPICS.length - 1
      ? ANTHROPOLOGY_SYLLABUS_TOPICS[activeIndex + 1]
      : null;

  const scrollToTarget = (sectionId: string) => {
    if (sectionId === 'etologia-parentesco') {
      window.dispatchEvent(
        new CustomEvent('ulpgc:navigate-course', {
          detail: { sectionId: 'etologia', ethology: { tab: 'parentesco' } },
        })
      );
      return;
    }
    window.dispatchEvent(
      new CustomEvent('ulpgc:navigate-course', {
        detail: { sectionId },
      })
    );
  };

  const handleSwitchViewMode = (mode: ViewMode, alwaysScroll = false) => {
    setViewMode(mode);
    scheduleInstantScrollToElement(() => workspaceTopRef.current, {
      onlyIfAbove: !alwaysScroll,
      focusTarget: alwaysScroll,
    });
  };

  const handleSelectTopic = (id: string, alwaysScroll = true) => {
    setSelectedId(id);
    scheduleInstantScrollToElement(
      () => topicArticleRef.current ?? workspaceTopRef.current,
      {
        onlyIfAbove: !alwaysScroll,
        focusTarget: true,
      }
    );
  };

  const handleOpenTopic = (id: string, options?: { view3d?: boolean }) => {
    setBlockFilter('todos');
    setSelectedId(id);
    setViewMode('detalle');
    if (options?.view3d) {
      prefetch3DScene('biomechanics');
      setTema4ViewMode('3d');
    }
    scheduleInstantScrollToElement(
      () => topicArticleRef.current ?? workspaceTopRef.current,
      { focusTarget: true }
    );
  };

  return (
    <section
      id="sec-antropologia"
      aria-labelledby="antropologia-heading"
      className="pt-10 border-t-2 border-rule flex flex-col gap-8 scroll-mt-20"
    >
      {/* Editorial Masthead */}
      <div className="flex flex-col gap-4">
        <div
          ref={workspaceTopRef}
          tabIndex={-1}
          className="flex flex-wrap items-center justify-between gap-3 focus:outline-none"
        >
          <div className="font-mono text-xs tracking-wide text-ochre">
            Temario vertebrador · Antropología y Evolución Humana en África (Temas 1–10)
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleSwitchViewMode('detalle', false)}
              aria-pressed={viewMode === 'detalle'}
              className={`min-h-[40px] px-3.5 py-2 font-mono text-xs border rounded inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'detalle'
                  ? 'bg-ink text-white border-ink'
                  : 'bg-paper text-ink-muted border-hairline hover:border-ink hover:text-ink'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Estudio tema por tema</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchViewMode('mapa', false)}
              aria-pressed={viewMode === 'mapa'}
              className={`min-h-[40px] px-3.5 py-2 font-mono text-xs border rounded inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'mapa'
                  ? 'bg-ink text-white border-ink'
                  : 'bg-paper text-ink-muted border-hairline hover:border-ink hover:text-ink'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Programa completo (10 temas)</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchViewMode('pastwomen', false)}
              onMouseEnter={() => void loadPastwomenView()}
              onFocus={() => void loadPastwomenView()}
              aria-pressed={viewMode === 'pastwomen'}
              className={`min-h-[40px] px-3.5 py-2 font-mono text-xs border rounded inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'pastwomen'
                  ? 'bg-ochre text-white border-ochre'
                  : 'bg-paper text-ink-muted border-hairline hover:border-ink hover:text-ink'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Evolución humana · Pastwomen</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchViewMode('smithsonian', false)}
              onMouseEnter={() => void loadSmithsonianView()}
              onFocus={() => void loadSmithsonianView()}
              aria-pressed={viewMode === 'smithsonian'}
              className={`min-h-[40px] px-3.5 py-2 font-mono text-xs border rounded inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'smithsonian'
                  ? 'bg-lapis text-white border-lapis'
                  : 'bg-paper text-ink-muted border-hairline hover:border-ink hover:text-ink'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Smithsonian · Human Origins</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchViewMode('migraciones', false)}
              onMouseEnter={() => void loadMigrationMapView()}
              onFocus={() => void loadMigrationMapView()}
              aria-pressed={viewMode === 'migraciones'}
              className={`min-h-[40px] px-3.5 py-2 font-mono text-xs border rounded inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'migraciones'
                  ? 'bg-forest text-white border-forest'
                  : 'bg-paper text-ink-muted border-hairline hover:border-ink hover:text-ink'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Mapa migratorio (D3)</span>
            </button>
          </div>
        </div>

        <h2
          id="antropologia-heading"
          className="font-display text-2xl sm:text-4xl font-semibold tracking-tight leading-[1.12] text-ink max-w-4xl [text-wrap:balance]"
        >
          De la antropología y los primeros bípedos a las religiones, el parentesco y la subsistencia en África
        </h2>

        <p className="text-base leading-[1.72] text-ink max-w-[76ch] m-0">
          Este recorrido desarrolla íntegramente los <strong>diez temas fundamentales</strong> del
          programa de antropología africana y evolución humana: desde la distinción entre{' '}
          <GlossaryTermTrigger termId="hominizacion-humanizacion" tone="ochre">
            hominización y humanización
          </GlossaryTermTrigger>
          , el{' '}
          <GlossaryTermTrigger termId="bipedismo-carrera-resistencia" tone="lapis">
            bipedismo y la carrera de resistencia
          </GlossaryTermTrigger>
          , el lenguaje y la pluralidad étnica, hasta los{' '}
          <GlossaryTermTrigger termId="ritos-de-paso" tone="ochre">
            ritos de paso
          </GlossaryTermTrigger>
          , la{' '}
          <GlossaryTermTrigger termId="teoria-de-la-abuela" tone="forest">
            teoría de la abuela y el parentesco
          </GlossaryTermTrigger>{' '}
          y la{' '}
          <GlossaryTermTrigger termId="neolitizacion-africana" tone="forest">
            transición africana a la ganadería y la agricultura
          </GlossaryTermTrigger>
          .
        </p>
      </div>

      {/* Block Filter Bar (shown in topic study & full syllabus views) */}
      {(viewMode === 'detalle' || viewMode === 'mapa') && (
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-hairline">
          {BLOCK_FILTERS.map((flt) => {
            const isActive = blockFilter === flt.id;
            return (
              <button
                key={flt.id}
                type="button"
                onClick={() => {
                  setBlockFilter(flt.id);
                  if (flt.id !== 'todos') {
                    const firstMatch = ANTHROPOLOGY_SYLLABUS_TOPICS.find((t) => t.block === flt.id);
                    if (firstMatch && activeTopic.block !== flt.id) {
                      setSelectedId(firstMatch.id);
                    }
                  }
                }}
                aria-pressed={isActive}
                className={`min-h-[38px] px-3 py-1.5 font-mono text-xs border rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-ochre text-white border-ochre font-semibold'
                    : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
                }`}
              >
                {flt.label}
              </button>
            );
          })}
        </div>
      )}

      {viewMode === 'pastwomen' ? (
        <Suspense
          fallback={
            <div className="bg-paper border border-hairline p-8 font-mono text-xs text-ink-muted">
              Cargando dossier Evolución humana · Pastwomen…
            </div>
          }
        >
          <LazyPastwomenEvolutionView
            onOpenTopic={handleOpenTopic}
            onOpenMigrations={() => handleSwitchViewMode('migraciones', true)}
          />
        </Suspense>
      ) : viewMode === 'smithsonian' ? (
        <Suspense
          fallback={
            <div className="bg-paper border border-hairline p-8 font-mono text-xs text-ink-muted">
              Cargando dossier Smithsonian · Human Origins…
            </div>
          }
        >
          <LazySmithsonianHumanOriginsView
            onOpenTopic={handleOpenTopic}
            onOpenMigrations={() => handleSwitchViewMode('migraciones', true)}
          />
        </Suspense>
      ) : viewMode === 'migraciones' ? (
        <Suspense
          fallback={
            <div className="bg-paper border border-hairline p-8 font-mono text-xs text-ink-muted">
              Cargando cartografía migratoria D3.js (Natural Earth)…
            </div>
          }
        >
          <LazyEvolutionMigrationMapD3
            onOpenTopic={handleOpenTopic}
            onOpenDossier={(mode) => handleSwitchViewMode(mode, true)}
          />
        </Suspense>
      ) : viewMode === 'detalle' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 10-Theme Curriculum Selector */}
          <nav
            aria-label="Índice de los 10 temas de antropología africana"
            className="lg:col-span-4 flex flex-col gap-1.5"
          >
            {visibleTopics.map((topic) => {
              const isSelected = topic.id === activeTopic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleSelectTopic(topic.id, true)}
                  aria-current={isSelected ? 'step' : undefined}
                  className={`text-left p-3.5 border rounded transition-colors cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-paper border-ink'
                      : 'bg-canvas border-hairline hover:border-ink/60 hover:bg-paper/60'
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-semibold tabular-nums shrink-0 pt-0.5 ${
                      isSelected ? 'text-ochre' : 'text-ink-muted'
                    }`}
                  >
                    {topic.num}
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span
                      className={`text-sm leading-snug ${
                        isSelected ? 'font-semibold text-ink' : 'font-medium text-ink-muted'
                      }`}
                    >
                      {topic.shortTitle}
                    </span>
                    <span className="font-mono text-[10.5px] text-ink-subtle truncate">
                      {topic.block}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Right Column: Full Academic Dossier for Selected Theme */}
          <article
            ref={topicArticleRef}
            tabIndex={-1}
            className="lg:col-span-8 bg-canvas border border-hairline p-5 sm:p-7 flex flex-col gap-6 focus:outline-none"
          >
            {/* Theme Header */}
            <div className="flex flex-col gap-2.5 pb-4 border-b border-rule">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="text-ochre font-semibold">
                  Tema {activeTopic.num} de 10 · {activeTopic.block}
                </span>
                <span className="text-ink-muted">Diploma de Estudios Africanos · ULPGC</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl lg:text-[1.7rem] font-semibold leading-snug text-ink m-0">
                {activeTopic.num}. {activeTopic.officialTitle}
              </h3>
              <p className="font-display italic text-base leading-relaxed text-ink-muted m-0">
                {activeTopic.leadSummary}
              </p>
            </div>

            {/* Guiding Questions Box */}
            <div className="bg-paper border border-hairline p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-lapis font-semibold">
                <ListChecks className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Preguntas vertebradoras del tema</span>
              </div>
              <ul className="m-0 pl-4 flex flex-col gap-1.5 text-sm text-ink list-disc">
                {activeTopic.guidingQuestions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </div>

            {/* Core Academic Development */}
            <div className="flex flex-col gap-4 text-[15px] leading-[1.74] text-ink">
              {activeTopic.bodyParagraphs.map((para, idx) => (
                <p key={idx} className="m-0">
                  {para}
                </p>
              ))}
            </div>

            {/* Structured Comparison Matrix (with interactive 2D / 3D biomechanics switcher on Tema 04) */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="font-display text-lg font-semibold text-ink m-0">
                  {activeTopic.comparisonTitle}
                </h4>

                {activeTopic.id === 'tema-04' && (
                  <div
                    role="group"
                    aria-label="Modo de visualización biomecánica del Tema 4"
                    className="inline-flex items-center border border-hairline rounded bg-paper p-0.5 shrink-0"
                  >
                    <button
                      type="button"
                      onClick={() => setTema4ViewMode('2d')}
                      aria-pressed={tema4ViewMode === '2d'}
                      className={`min-h-[40px] px-3 py-1.5 font-mono text-xs rounded-sm transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                        tema4ViewMode === '2d'
                          ? 'bg-ink text-white font-medium'
                          : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      <Table2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Tabla 2D</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTema4ViewMode('3d')}
                      onMouseEnter={() => prefetch3DScene('biomechanics')}
                      onFocus={() => prefetch3DScene('biomechanics')}
                      aria-pressed={tema4ViewMode === '3d'}
                      className={`min-h-[40px] px-3 py-1.5 font-mono text-xs rounded-sm transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                        tema4ViewMode === '3d'
                          ? 'bg-ochre text-white font-medium'
                          : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      <Box className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Esquema 3D</span>
                    </button>
                  </div>
                )}
              </div>

              {activeTopic.id === 'tema-04' && tema4ViewMode === '3d' ? (
                <Scene3DAsyncBoundary
                  sceneId="biomechanics"
                  onFallbackTo2D={() => setTema4ViewMode('2d')}
                >
                  <LazyBiomechanics3D onFallbackTo2D={() => setTema4ViewMode('2d')} />
                </Scene3DAsyncBoundary>
              ) : (
                <div className="overflow-x-auto border border-hairline">
                  <table className="w-full text-left border-collapse min-w-[560px]">
                    <thead>
                      <tr className="bg-paper border-b border-rule font-mono text-[11px] tracking-wide text-ink-muted">
                        <th className="py-2.5 px-3.5 font-semibold w-[24%]">
                          {activeTopic.comparisonHeaders[0]}
                        </th>
                        <th className="py-2.5 px-3.5 font-semibold w-[38%]">
                          {activeTopic.comparisonHeaders[1]}
                        </th>
                        <th className="py-2.5 px-3.5 font-semibold w-[38%]">
                          {activeTopic.comparisonHeaders[2]}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline text-xs leading-relaxed text-ink">
                      {activeTopic.comparisonRows.map((row) => (
                        <tr key={row.dimension} className="align-top">
                          <td className="py-3 px-3.5 font-semibold text-ink bg-paper/45">
                            {row.dimension}
                          </td>
                          <td className="py-3 px-3.5">{row.colA}</td>
                          <td className="py-3 px-3.5">{row.colB}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* African Case Study Callout */}
            <div className="bg-paper border-t-2 border-t-forest border border-hairline p-4 sm:p-5 flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                <span className="text-forest font-semibold inline-flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Caso africano de referencia</span>
                </span>
                <span className="text-ink-muted">{activeTopic.africanCaseRegion}</span>
              </div>
              <h4 className="font-display text-base sm:text-lg font-semibold text-ink m-0">
                {activeTopic.africanCaseTitle}
              </h4>
              <p className="text-sm leading-relaxed text-ink m-0">{activeTopic.africanCaseText}</p>
            </div>

            {/* Contextual Glossary Terms + Cross-Module Links */}
            <div className="pt-4 border-t border-hairline flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                <span className="font-mono text-[11px] text-ink-muted">Glosario vinculado:</span>
                {activeTopic.glossaryTermIds.map((term) => (
                  <GlossaryTermTrigger
                    key={term.id}
                    termId={term.id}
                    tone="lapis"
                    className="font-mono text-xs"
                  >
                    {term.label}
                  </GlossaryTermTrigger>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {activeTopic.crossLinks.map((link) => (
                    <button
                      key={link.sectionId + link.label}
                      type="button"
                      onClick={() => scrollToTarget(link.sectionId)}
                      className="min-h-[36px] px-3 py-1.5 font-mono text-xs text-ink bg-paper border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
                    </button>
                  ))}
                  {['tema-04', 'tema-05', 'tema-06', 'tema-09'].includes(activeTopic.id) && (
                    <button
                      type="button"
                      onClick={() => handleSwitchViewMode('pastwomen', true)}
                      className="min-h-[36px] px-3 py-1.5 font-mono text-xs text-ochre bg-paper border border-ochre/60 rounded hover:bg-ochre hover:text-white inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Ver enfoque Evolución humana · Pastwomen</span>
                    </button>
                  )}
                  {['tema-01', 'tema-02', 'tema-03', 'tema-04', 'tema-05', 'tema-06', 'tema-07'].includes(
                    activeTopic.id
                  ) && (
                    <button
                      type="button"
                      onClick={() => handleSwitchViewMode('smithsonian', true)}
                      className="min-h-[36px] px-3 py-1.5 font-mono text-xs text-lapis bg-paper border border-lapis/60 rounded hover:bg-lapis hover:text-white inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <Globe2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Ver datos Smithsonian · Human Origins</span>
                    </button>
                  )}
                  {['tema-03', 'tema-04', 'tema-05', 'tema-06', 'tema-07', 'tema-10'].includes(
                    activeTopic.id
                  ) && (
                    <button
                      type="button"
                      onClick={() => handleSwitchViewMode('migraciones', true)}
                      className="min-h-[36px] px-3 py-1.5 font-mono text-xs text-forest bg-paper border border-forest/60 rounded hover:bg-forest hover:text-white inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <MapIcon className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Explorar rutas migratorias (D3)</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="font-mono text-[11px] text-ink-muted">
                Bibliografía base del tema: {activeTopic.keyReferences}
              </div>
            </div>

            {/* Previous / Next Theme Stepper */}
            <div className="pt-4 border-t border-rule flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                disabled={!prevTopic}
                onClick={() => prevTopic && handleSelectTopic(prevTopic.id, true)}
                className="min-h-[40px] px-3.5 py-2 font-mono text-xs border border-hairline rounded bg-canvas text-ink hover:border-ink disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{prevTopic ? `Tema ${prevTopic.num} · ${prevTopic.shortTitle}` : 'Inicio del programa'}</span>
              </button>

              <button
                type="button"
                disabled={!nextTopic}
                onClick={() => nextTopic && handleSelectTopic(nextTopic.id, true)}
                className="min-h-[40px] px-3.5 py-2 font-mono text-xs border border-ink rounded bg-ink text-white hover:bg-ochre hover:border-ochre disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{nextTopic ? `Tema ${nextTopic.num} · ${nextTopic.shortTitle}` : 'Fin del programa'}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </article>
        </div>
      ) : (
        /* Full 10-Topic Scannable Overview Matrix */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visibleTopics.map((topic) => (
            <article
              key={topic.id}
              className="bg-canvas border border-hairline p-5 flex flex-col justify-between gap-4 hover:border-ink transition-colors"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                  <span className="text-ochre font-semibold">Tema {topic.num}</span>
                  <span className="text-ink-muted">{topic.block}</span>
                </div>
                <h3 className="font-display text-lg font-semibold leading-snug text-ink m-0">
                  {topic.officialTitle}
                </h3>
                <p className="text-sm leading-relaxed text-ink-muted m-0">{topic.leadSummary}</p>
                <div className="pt-2 border-t border-hairline font-mono text-[11px] text-forest">
                  Caso africano: {topic.africanCaseTitle} ({topic.africanCaseRegion})
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-hairline">
                <span className="font-mono text-[11px] text-ink-subtle">
                  {topic.guidingQuestions.length} preguntas clave · tabla comparativa
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenTopic(topic.id)}
                  className="min-h-[36px] px-3 py-1 font-mono text-xs font-medium text-ink bg-paper border border-hairline rounded hover:border-ink hover:bg-ink hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                >
                  Abrir tema {topic.num}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
