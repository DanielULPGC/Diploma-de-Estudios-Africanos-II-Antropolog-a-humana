import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Columns2,
  Compass,
  Eye,
  FlaskConical,
  Image as ImageIcon,
  Layers,
  ZoomIn,
} from 'lucide-react';
import {
  GALLERY_CATEGORIES,
  GENEALOGY_PHASES,
  HISTORICAL_PLATES,
  ICON_DECONSTRUCTIONS,
  LEXICAL_ENTRIES,
  SCIENCE_VS_MYTH_CASES,
  type CannibalismViewTab,
  type GalleryCategoryId,
  type GenealogyPhaseId,
  type HistoricalPlate,
  type IconDeconstructionId,
  type LexicalLemmaId,
} from '../data/cannibalismStereotypesData';
import {
  clearPendingCourseDetail,
  consumePendingCourseDetail,
  type CourseDeepAction,
} from '../data/courseNavigation';
import { GlossaryTermTrigger } from './GlossaryContext';
import { useLightbox } from './LightboxContext';
import { scheduleInstantScrollToElement } from '../utils/scrollPosition';
import { CriticalTimelineView } from './CriticalTimelineView';

const VIEW_TABS: Array<{
  id: CannibalismViewTab;
  label: string;
  shortLabel: string;
}> = [
  { id: 'galeria', label: 'Galería histórica (18)', shortLabel: 'Galería (18)' },
  { id: 'cronologia-critica', label: 'Cronología crítica', shortLabel: 'Cronología' },
  { id: 'genealogia', label: 'Genealogía (4 fases)', shortLabel: 'Genealogía' },
  { id: 'iconos', label: 'Deconstrucción de iconos', shortLabel: 'Iconos' },
  { id: 'lexico', label: 'Evolución léxica (NTLLE)', shortLabel: 'Léxico NTLLE' },
  { id: 'ciencia-mito', label: 'Ciencia vs. Mito', shortLabel: 'Ciencia vs. Mito' },
];

const LEXICAL_FILTERS: Array<{ id: LexicalLemmaId; label: string }> = [
  { id: 'todos', label: 'Todos los lemas (10)' },
  { id: 'antropofago', label: 'Antropófago / Antropofagia' },
  { id: 'canibal', label: 'Caníbal' },
  { id: 'salvaje', label: 'Salvaje' },
];

const KEY_METRICS = [
  { label: 'Arco léxico NTLLE', value: '1492–1970', note: 'De Colón a la RAE del s. XX' },
  { label: 'Fases geográficas', value: '4 etapas', note: 'América · Pacífico · África · Crítica' },
  { label: 'Iconos deconstruidos', value: '4 tropos', note: 'Tríada de Roger Chartier' },
  { label: 'Galería catalogada', value: '18 láminas', note: 'Visor ampliable hasta 2,5×' },
];

export default function CannibalismStereotypesModule() {
  const { openSingle, openCompare } = useLightbox();
  const workbenchRef = useRef<HTMLDivElement | null>(null);

  const [activeTab, setActiveTab] = useState<CannibalismViewTab>(() => {
    const pending = consumePendingCourseDetail('cannibalism');
    return pending?.tab ?? 'galeria';
  });
  const [galleryFilter, setGalleryFilter] = useState<GalleryCategoryId>('todas');
  const [activePhaseId, setActivePhaseId] = useState<GenealogyPhaseId>('america');
  const [activeIconId, setActiveIconId] = useState<IconDeconstructionId>('caldero');
  const [lexicalFilter, setLexicalFilter] = useState<LexicalLemmaId>('todos');
  const [activeCaseId, setActiveCaseId] = useState<string>(SCIENCE_VS_MYTH_CASES[0].id);

  const plateById = useMemo(() => {
    const map = new Map<string, HistoricalPlate>();
    HISTORICAL_PLATES.forEach((p) => map.set(p.id, p));
    return map;
  }, []);

  const filteredPlates = useMemo(() => {
    if (galleryFilter === 'todas') return HISTORICAL_PLATES;
    return HISTORICAL_PLATES.filter((p) => p.category === galleryFilter);
  }, [galleryFilter]);

  const activePhase = useMemo(
    () => GENEALOGY_PHASES.find((p) => p.id === activePhaseId) ?? GENEALOGY_PHASES[0],
    [activePhaseId]
  );

  const activeIcon = useMemo(
    () => ICON_DECONSTRUCTIONS.find((i) => i.id === activeIconId) ?? ICON_DECONSTRUCTIONS[0],
    [activeIconId]
  );

  const filteredLexical = useMemo(() => {
    if (lexicalFilter === 'todos') return LEXICAL_ENTRIES;
    return LEXICAL_ENTRIES.filter((entry) => entry.lemma === lexicalFilter);
  }, [lexicalFilter]);

  const activeCase = useMemo(
    () => SCIENCE_VS_MYTH_CASES.find((c) => c.id === activeCaseId) ?? SCIENCE_VS_MYTH_CASES[0],
    [activeCaseId]
  );

  useEffect(() => {
    const handleDeepOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ tab?: CannibalismViewTab }>).detail;
      if (detail?.tab) {
        clearPendingCourseDetail('cannibalism');
        setActiveTab(detail.tab);
      }
    };
    window.addEventListener('ulpgc:open-cannibalism-tab', handleDeepOpen);
    return () => window.removeEventListener('ulpgc:open-cannibalism-tab', handleDeepOpen);
  }, []);

  const handleSelectTab = (tab: CannibalismViewTab) => {
    setActiveTab(tab);
    scheduleInstantScrollToElement(() => workbenchRef.current);
  };

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight') nextIdx = (currentIndex + 1) % VIEW_TABS.length;
    else if (e.key === 'ArrowLeft') nextIdx = (currentIndex - 1 + VIEW_TABS.length) % VIEW_TABS.length;
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = VIEW_TABS.length - 1;
    if (nextIdx !== null) {
      e.preventDefault();
      const targetTab = VIEW_TABS[nextIdx];
      handleSelectTab(targetTab.id);
      requestAnimationFrame(() => {
        document.getElementById(`cannibalism-tab-${targetTab.id}`)?.focus();
      });
    }
  };

  const openPlateLightbox = (plate: HistoricalPlate, opener?: HTMLElement | null) => {
    openSingle(
      {
        src: plate.src,
        alt: `${plate.title}. ${plate.visualSummary}`,
        title: plate.title,
        subtitle: `${plate.accessionCode} · ${plate.dating} · ${plate.region}`,
        caption: plate.criticalAnalysis,
        credit: `Fuente: ${plate.source}`,
      },
      opener
    );
  };

  const openCuratedCompare = (
    plateAId: string,
    plateBId: string,
    opener?: HTMLElement | null
  ) => {
    const a = plateById.get(plateAId);
    const b = plateById.get(plateBId);
    if (!a || !b) return;
    openCompare(
      {
        src: a.src,
        alt: a.title,
        title: a.title,
        subtitle: a.dating,
        caption: a.criticalAnalysis,
        credit: a.source,
      },
      {
        src: b.src,
        alt: b.title,
        title: b.title,
        subtitle: b.dating,
        caption: b.criticalAnalysis,
        credit: b.source,
      },
      opener
    );
  };

  const triggerCourseNavigation = (action: CourseDeepAction) => {
    window.dispatchEvent(new CustomEvent<CourseDeepAction>('ulpgc:navigate-course', { detail: action }));
  };

  return (
    <section
      aria-labelledby="titulo-estereotipos-canibalismo"
      className="pt-12 border-t border-hairline flex flex-col gap-7"
    >
      {/* Editorial Section Header */}
      <div className="flex flex-col gap-3">
        <div className="font-mono text-xs tracking-wide text-ochre">
          05b. Antropología visual e imaginarios coloniales
        </div>
        <h2
          id="titulo-estereotipos-canibalismo"
          className="font-display text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight tracking-tight text-ink max-w-3xl [text-wrap:balance]"
        >
          De la palabra al caldero: estereotipos sobre el canibalismo y su proyección sobre África
        </h2>
        <div className="mt-1 py-3 px-4 bg-paper border-t border-b border-hairline max-w-3xl text-sm leading-relaxed text-ink-muted">
          <span className="font-mono text-xs font-medium text-ink mr-2">
            Objetivo de aprendizaje ·
          </span>
          Deconstruir críticamente el origen léxico, cartográfico e iconográfico del estereotipo
          caníbal —desde el Caribe del siglo XVI hasta la África colonial y el cómic del siglo XX—
          contrastándolo con la evidencia arqueológica, médica y etológica.
        </div>
      </div>

      {/* Key Quantitative Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {KEY_METRICS.map((m) => (
          <div key={m.label} className="border-t border-rule pt-3 flex flex-col gap-1">
            <span className="font-mono text-[11px] text-ink-muted">{m.label}</span>
            <span className="font-mono text-xl sm:text-2xl font-medium tabular-nums text-ink leading-none">
              {m.value}
            </span>
            <span className="font-mono text-xs text-ink-muted">{m.note}</span>
          </div>
        ))}
      </div>

      {/* Theoretical Synthesis + Ethical/Academic Context Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 flex flex-col gap-4 text-base leading-[1.72] text-ink">
          <p className="m-0">
            Al analizar los estereotipos coloniales sobre África conviene aplicar las mismas reglas
            de{' '}
            <GlossaryTermTrigger termId="triangulacion-fuentes" tone="lapis">
              crítica de fuentes
            </GlossaryTermTrigger>{' '}
            a mapas, grabados, diccionarios y viñetas. Como recuerda la{' '}
            <GlossaryTermTrigger termId="antropologia-visual" tone="ochre">
              antropología visual
            </GlossaryTermTrigger>{' '}
            a partir de E. H. Gombrich, <em>«todas las imágenes deben más a otras imágenes que a la
            naturaleza»</em>: numerosos grabadores e ilustradores europeos que jamás pisaron América,
            Oceanía ni África copiaron convenciones previas para fijar un{' '}
            <GlossaryTermTrigger termId="imaginario-colectivo" tone="ochre">
              imaginario colectivo
            </GlossaryTermTrigger>{' '}
            basado en el{' '}
            <GlossaryTermTrigger termId="mito-del-salvaje" tone="lapis">
              mito del salvaje
            </GlossaryTermTrigger>
            .
          </p>
          <p className="m-0">
            Siguiendo la tríada de Roger Chartier —<strong>práctica</strong> (el hecho histórico o
            material), <strong>representación</strong> (el discurso o imagen construida) y{' '}
            <strong>apropiación</strong> (cómo el público la lee y reutiliza)—, este módulo recorre
            cómo la acusación de{' '}
            <GlossaryTermTrigger termId="antropofagia-canibalismo" tone="ochre">
              antropofagia y canibalismo
            </GlossaryTermTrigger>{' '}
            migró desde el malentendido colombino de 1492 hasta convertirse, durante el reparto
            colonial africano de los siglos XIX y XX, en un dispositivo para deshumanizar a las
            sociedades africanas e invisibilizar su historia política.
          </p>
        </div>

        <aside
          aria-label="Encuadre crítico y metodológico de las imágenes históricas"
          className="lg:col-span-5 bg-paper border border-hairline border-t-2 border-t-ochre p-5 flex flex-col gap-2.5"
        >
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-ochre">
            <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Encuadre crítico de fuentes visuales</span>
          </div>
          <p className="text-sm leading-relaxed text-ink m-0">
            Las láminas de la galería histórica incluyen mapas coloniales, grabados modernos,
            fotografía posada del siglo XIX y caricaturas de prensa que reproducen prejuicios
            racistas de su época.
          </p>
          <p className="text-xs leading-relaxed text-ink-muted m-0">
            Se presentan exclusivamente como <strong>documentación histórica primaria</strong> para
            ejercitar la deconstrucción antropológica en el aula universitaria, conforme a las
            investigaciones de D. Becerra Romero (ULPGC).
          </p>
        </aside>
      </div>

      {/* Interactive Workbench */}
      <div
        ref={workbenchRef}
        className="py-7 border-t border-rule border-b border-b-hairline flex flex-col gap-6 scroll-mt-20"
      >
        {/* Workbench Navigation Tabs */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs text-ink-muted">
            Ejes de análisis e investigación visual (seleccione una vista):
          </span>
          <div
            role="tablist"
            aria-label="Vistas analíticas sobre los estereotipos del canibalismo"
            className="flex flex-wrap gap-2"
          >
            {VIEW_TABS.map((tab, idx) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`cannibalism-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`cannibalism-panel-${tab.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`min-h-[42px] px-3.5 py-2 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-ink text-white border-ink'
                      : 'bg-canvas text-ink border-hairline hover:border-ink hover:bg-paper'
                  }`}
                >
                  {tab.id === 'galeria' && <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />}
                  {tab.id === 'cronologia-critica' && (
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  {tab.id === 'genealogia' && <Compass className="w-3.5 h-3.5" aria-hidden="true" />}
                  {tab.id === 'iconos' && <Layers className="w-3.5 h-3.5" aria-hidden="true" />}
                  {tab.id === 'lexico' && <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />}
                  {tab.id === 'ciencia-mito' && (
                    <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            TAB 2: CRONOLOGÍA CRÍTICA (MITO VS. ARQUEOLOGÍA AFRICANA)
            ============================================================ */}
        {activeTab === 'cronologia-critica' && (
          <CriticalTimelineView
            plateById={plateById}
            onOpenPlate={openPlateLightbox}
            onNavigateCourse={triggerCourseNavigation}
          />
        )}

        {/* ============================================================
            TAB 1: GALERÍA HISTÓRICA COMENTADA (SOLO GALERÍA HISTÓRICA)
            ============================================================ */}
        {activeTab === 'galeria' && (
          <div
            id="cannibalism-panel-galeria"
            role="tabpanel"
            aria-labelledby="cannibalism-tab-galeria"
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-hairline">
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display text-xl font-semibold text-ink m-0">
                  Catálogo comentado de fuentes visuales históricas
                </h3>
                <p className="text-sm text-ink-muted m-0 max-w-2xl">
                  18 láminas seleccionadas desde la osteología prehistórica europea y los mapas del
                  siglo XVI hasta la cartografía africana decimonónica y la novela gráfica crítica.
                  Pulse cualquier lámina para inspeccionar detalles en el visor ampliable (hasta
                  2,5×).
                </p>
              </div>

              {/* Curated Side-by-Side Lightbox Comparisons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => openCuratedCompare('lamina-45', 'lamina-49', e.currentTarget)}
                  className="min-h-[40px] px-3 py-1.5 text-xs font-medium text-ink bg-paper border border-hairline hover:border-ochre hover:text-ochre rounded inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Columns2 className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
                  <span>Comparar: Holkham (s. XIV) vs. Little Nemo (1907)</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => openCuratedCompare('lamina-15', 'lamina-30', e.currentTarget)}
                  className="min-h-[40px] px-3 py-1.5 text-xs font-medium text-ink bg-paper border border-hairline hover:border-lapis hover:text-lapis rounded inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Columns2 className="w-3.5 h-3.5 text-lapis" aria-hidden="true" />
                  <span>Comparar: Servet (1541) vs. Finley (1827)</span>
                </button>
              </div>
            </div>

            {/* Category Filter Controls */}
            <div
              role="group"
              aria-label="Filtrar láminas históricas por categoría"
              className="flex flex-wrap items-center gap-2"
            >
              {GALLERY_CATEGORIES.map((cat) => {
                const isActive = galleryFilter === cat.id;
                const count =
                  cat.id === 'todas'
                    ? HISTORICAL_PLATES.length
                    : HISTORICAL_PLATES.filter((p) => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setGalleryFilter(cat.id)}
                    className={`min-h-[40px] px-3 py-1.5 font-mono text-xs rounded border transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-ochre text-white border-ochre font-medium'
                        : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
                    }`}
                  >
                    {cat.label} <span className="tabular-nums opacity-85">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Archival Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPlates.map((plate) => (
                <article
                  key={plate.id}
                  className="bg-paper border border-hairline flex flex-col justify-between overflow-hidden"
                >
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={(e) => openPlateLightbox(plate, e.currentTarget)}
                      aria-label={`Ampliar lámina: ${plate.title}`}
                      className="group relative aspect-[4/3] w-full bg-[#e9e3d5] border-b border-hairline overflow-hidden text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ochre"
                    >
                      <img
                        src={plate.src}
                        alt={plate.title}
                        width={1150}
                        height={862}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain p-1.5 transition-transform duration-200 group-hover:scale-[1.02]"
                      />
                      <span className="absolute bottom-2 right-2 px-2.5 py-1 bg-ink/85 text-white font-mono text-[11px] rounded inline-flex items-center gap-1 opacity-90 group-hover:bg-ochre transition-colors">
                        <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Ampliar</span>
                      </span>
                    </button>

                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex items-baseline justify-between gap-2 font-mono text-[11px]">
                        <span className="text-ochre font-medium">{plate.accessionCode}</span>
                        <span className="text-ink-muted tabular-nums">{plate.dating}</span>
                      </div>

                      <h4 className="font-display text-base font-semibold text-ink leading-snug m-0">
                        {plate.title}
                      </h4>

                      <p className="text-sm leading-relaxed text-ink m-0">{plate.criticalAnalysis}</p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-3 border-t border-hairline flex flex-col gap-2.5 bg-canvas/60">
                    <dl className="grid grid-cols-1 gap-1.5 text-xs m-0">
                      <div className="flex flex-col">
                        <dt className="font-mono text-[10.5px] text-ink-muted">Fuente / archivo</dt>
                        <dd className="text-ink m-0">{plate.source}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="font-mono text-[10.5px] text-ink-muted">Ámbito geográfico</dt>
                        <dd className="text-ink m-0">{plate.region}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="font-mono text-[10.5px] text-lapis">Lectura crítica</dt>
                        <dd className="text-ink-muted m-0 leading-snug">{plate.chartierLens}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 2: GENEALOGÍA INTERACTIVA DEL ESTEREOTIPO (4 FASES)
            ============================================================ */}
        {activeTab === 'genealogia' && (
          <div
            id="cannibalism-panel-genealogia"
            role="tabpanel"
            aria-labelledby="cannibalism-tab-genealogia"
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1.5">
              <h3 className="font-display text-xl font-semibold text-ink m-0">
                Desplazamiento geográfico e histórico del estereotipo (1492 – actualidad)
              </h3>
              <p className="text-sm text-ink-muted m-0 max-w-3xl">
                El imaginario europeo del «caníbal» no nació en África: surgió en el Caribe y Brasil
                en el siglo XVI, migró al Pacífico y Australia en los siglos XVIII–XIX y se fijó
                sobre África en el umbral del reparto colonial. Recorra las cuatro etapas:
              </p>
            </div>

            {/* 4-Stage Horizontal Selector */}
            <div
              role="group"
              aria-label="Fases de la genealogía geográfica del estereotipo"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
            >
              {GENEALOGY_PHASES.map((phase) => {
                const isSelected = phase.id === activePhase.id;
                return (
                  <button
                    key={phase.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setActivePhaseId(phase.id)}
                    className={`min-h-[76px] p-3.5 text-left border transition-colors cursor-pointer flex flex-col justify-between gap-1 ${
                      isSelected
                        ? 'bg-paper border-ink border-t-2 border-t-ochre'
                        : 'bg-canvas border-hairline hover:border-ink hover:bg-paper/60'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2 w-full">
                      <span
                        className={`font-mono text-xs font-semibold ${
                          isSelected ? 'text-ochre' : 'text-ink-muted'
                        }`}
                      >
                        {phase.order}
                      </span>
                      <span className="font-mono text-[11px] text-ink-muted tabular-nums">
                        {phase.span}
                      </span>
                    </div>
                    <span className="font-display text-sm font-semibold text-ink leading-snug">
                      {phase.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Phase Detail Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
              <div className="lg:col-span-7 bg-paper border border-hairline border-t-2 border-t-rule p-5 sm:p-6 flex flex-col gap-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs">
                  <span className="text-ochre font-semibold">
                    {activePhase.order} · {activePhase.span}
                  </span>
                  <span className="text-ink-muted">{activePhase.territories}</span>
                </div>

                <h4 className="font-display text-xl sm:text-2xl font-semibold text-ink leading-snug m-0">
                  {activePhase.title}
                </h4>

                <p className="text-sm font-medium text-ink bg-canvas border-l-2 border-l-ochre pl-3.5 py-2 m-0 leading-relaxed">
                  {activePhase.thesis}
                </p>

                <p className="text-sm leading-relaxed text-ink m-0">{activePhase.narrative}</p>

                <div className="pt-3 border-t border-hairline flex flex-col gap-3">
                  <span className="font-mono text-xs font-semibold text-ink">
                    Hitos documentales y cartográficos
                  </span>
                  <ol className="m-0 p-0 list-none flex flex-col gap-2.5">
                    {activePhase.keyMilestones.map((ms) => (
                      <li
                        key={`${ms.year}-${ms.work}`}
                        className="bg-canvas border border-hairline p-3 flex flex-col gap-1"
                      >
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="font-mono text-xs font-semibold text-ochre tabular-nums">
                            {ms.year}
                          </span>
                          <span className="text-sm font-semibold text-ink">{ms.work}</span>
                        </div>
                        <p className="text-xs leading-relaxed text-ink-muted m-0">{ms.detail}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="pt-3 border-t border-hairline flex flex-col gap-1">
                  <span className="font-mono text-[11px] font-semibold text-lapis">
                    Función política y legitimadora
                  </span>
                  <p className="text-sm text-ink leading-relaxed m-0">
                    {activePhase.legitimationMechanism}
                  </p>
                </div>
              </div>

              {/* Linked Plates Column */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-ink">
                    Láminas asociadas a esta fase ({activePhase.plateIds.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryFilter('todas');
                      handleSelectTab('galeria');
                    }}
                    className="font-mono text-xs text-ochre hover:underline underline-offset-4 cursor-pointer"
                  >
                    Abrir galería completa
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {activePhase.plateIds.map((pid) => {
                    const plate = plateById.get(pid);
                    if (!plate) return null;
                    return (
                      <button
                        key={plate.id}
                        type="button"
                        onClick={(e) => openPlateLightbox(plate, e.currentTarget)}
                        className="group bg-paper border border-hairline hover:border-ink p-3 text-left grid grid-cols-12 gap-3 items-center transition-colors cursor-pointer"
                      >
                        <div className="col-span-4 aspect-[4/3] bg-[#e9e3d5] border border-hairline overflow-hidden">
                          <img
                            src={plate.src}
                            alt={plate.title}
                            width={1150}
                            height={862}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="col-span-8 flex flex-col gap-1 min-w-0">
                          <span className="font-mono text-[10.5px] text-ochre">
                            {plate.accessionCode} · {plate.dating}
                          </span>
                          <span className="font-display text-sm font-semibold text-ink group-hover:text-ochre leading-snug line-clamp-2">
                            {plate.title}
                          </span>
                          <span className="font-mono text-[11px] text-ink-muted inline-flex items-center gap-1">
                            <ZoomIn className="w-3 h-3" aria-hidden="true" />
                            <span>Inspeccionar en visor ampliado</span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 3: DECONSTRUCCIÓN DE ICONOS (TRÍADA DE CHARTIER)
            ============================================================ */}
        {activeTab === 'iconos' && (
          <div
            id="cannibalism-panel-iconos"
            role="tabpanel"
            aria-labelledby="cannibalism-tab-iconos"
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1.5">
              <h3 className="font-display text-xl font-semibold text-ink m-0">
                Anatomía visual del estereotipo: cuatro dispositivos recurrentes
              </h3>
              <p className="text-sm text-ink-muted m-0 max-w-3xl">
                Cada motivo gráfico del cliché colonial posee una genealogía europea rastreable.
                Seleccione un icono para analizar su origen y su lectura a través de la tríada de
                Roger Chartier (<em>práctica, representación, apropiación</em>).
              </p>
            </div>

            {/* 4 Icon Selectors */}
            <div
              role="group"
              aria-label="Selector de icono a deconstruir"
              className="flex flex-wrap gap-2"
            >
              {ICON_DECONSTRUCTIONS.map((icon) => {
                const isSelected = icon.id === activeIcon.id;
                return (
                  <button
                    key={icon.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setActiveIconId(icon.id)}
                    className={`min-h-[42px] px-4 py-2 text-xs font-medium rounded border transition-colors cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-ochre text-white border-ochre'
                        : 'bg-canvas text-ink border-hairline hover:border-ink hover:bg-paper'
                    }`}
                  >
                    {icon.shortTitle}
                  </button>
                );
              })}
            </div>

            {/* Active Icon Deconstruction Workbench */}
            <div className="bg-paper border border-hairline border-t-2 border-t-rule p-5 sm:p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-xs text-ochre font-semibold">
                  Deconstrucción iconográfica · {activeIcon.shortTitle}
                </span>
                <h4 className="font-display text-xl sm:text-2xl font-semibold text-ink m-0">
                  {activeIcon.title}
                </h4>
                <p className="font-display italic text-base text-ink-muted m-0">
                  {activeIcon.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-canvas border border-hairline p-4 flex flex-col gap-1.5">
                  <span className="font-mono text-xs font-semibold text-ink">
                    1. Origen iconográfico europeo
                  </span>
                  <p className="text-sm leading-relaxed text-ink m-0">{activeIcon.europeanOrigin}</p>
                </div>
                <div className="bg-canvas border border-hairline p-4 flex flex-col gap-1.5">
                  <span className="font-mono text-xs font-semibold text-ink">
                    2. Mutación visual y consolidación del cliché
                  </span>
                  <p className="text-sm leading-relaxed text-ink m-0">
                    {activeIcon.visualTransformation}
                  </p>
                </div>
              </div>

              {/* Roger Chartier 3-Column Analytical Triad */}
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-xs font-semibold text-lapis">
                  Análisis mediante la tríada cultural de Roger Chartier (1992)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-canvas border border-hairline border-t-2 border-t-forest p-4 flex flex-col gap-1.5">
                    <span className="font-mono text-xs font-semibold text-forest">
                      Práctica (lo real)
                    </span>
                    <p className="text-sm leading-relaxed text-ink m-0">
                      {activeIcon.chartier.practica}
                    </p>
                  </div>
                  <div className="bg-canvas border border-hairline border-t-2 border-t-ochre p-4 flex flex-col gap-1.5">
                    <span className="font-mono text-xs font-semibold text-ochre">
                      Representación (el discurso)
                    </span>
                    <p className="text-sm leading-relaxed text-ink m-0">
                      {activeIcon.chartier.representacion}
                    </p>
                  </div>
                  <div className="bg-canvas border border-hairline border-t-2 border-t-lapis p-4 flex flex-col gap-1.5">
                    <span className="font-mono text-xs font-semibold text-lapis">
                      Apropiación y reinterpretación
                    </span>
                    <p className="text-sm leading-relaxed text-ink m-0">
                      {activeIcon.chartier.apropiacion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Documented Cases + Linked Plates */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-hairline">
                <div className="lg:col-span-6 flex flex-col gap-2">
                  <span className="font-mono text-xs font-semibold text-ink">
                    Ejemplos documentados en la investigación
                  </span>
                  <ul className="m-0 pl-5 flex flex-col gap-2 text-sm text-ink leading-relaxed">
                    {activeIcon.documentedCases.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-6 flex flex-col gap-2.5">
                  <span className="font-mono text-xs font-semibold text-ink">
                    Láminas relacionadas (clic para ampliar)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeIcon.plateIds.slice(0, 4).map((pid) => {
                      const plate = plateById.get(pid);
                      if (!plate) return null;
                      return (
                        <button
                          key={plate.id}
                          type="button"
                          onClick={(e) => openPlateLightbox(plate, e.currentTarget)}
                          className="group bg-canvas border border-hairline hover:border-ink p-2.5 text-left flex flex-col gap-2 transition-colors cursor-pointer"
                        >
                          <div className="aspect-[4/3] w-full bg-[#e9e3d5] border border-hairline overflow-hidden">
                            <img
                              src={plate.src}
                              alt={plate.title}
                              width={1150}
                              height={862}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <span className="font-mono text-[10.5px] text-ochre">
                            {plate.dating}
                          </span>
                          <span className="text-xs font-semibold text-ink group-hover:text-ochre leading-snug line-clamp-2">
                            {plate.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 4: EVOLUCIÓN LÉXICA DEL NTLLE (1492–1970)
            ============================================================ */}
        {activeTab === 'lexico' && (
          <div
            id="cannibalism-panel-lexico"
            role="tabpanel"
            aria-labelledby="cannibalism-tab-lexico"
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1.5">
              <h3 className="font-display text-xl font-semibold text-ink m-0">
                Evolución lexicográfica (NTLLE / RAE): antropófago, caníbal y salvaje
              </h3>
              <p className="text-sm text-ink-muted m-0 max-w-3xl">
                El Nuevo Tesoro Lexicográfico de la Lengua Española (NTLLE) revela cómo las
                definiciones oficiales construyeron y prolongaron la asociación entre etnónimos
                colonizados, crueldad moral y la idea decimonónica de «pueblos sin cultura» hasta
                1970.
              </p>
            </div>

            {/* 3-Lemma Contrast Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-paper border border-hairline border-t-2 border-t-lapis p-4 flex flex-col gap-1.5">
                <span className="font-mono text-xs font-semibold text-lapis">Antropófago</span>
                <p className="text-xs leading-relaxed text-ink m-0">
                  Helenismo clásico ya presente en Covarrubias (1611). En 1914 la RAE vincula
                  explícitamente «antropofagia» a la costumbre de «algunos salvajes».
                </p>
              </div>
              <div className="bg-paper border border-hairline border-t-2 border-t-ochre p-4 flex flex-col gap-1.5">
                <span className="font-mono text-xs font-semibold text-ochre">Caníbal</span>
                <p className="text-xs leading-relaxed text-ink m-0">
                  Neologismo surgido del error colombino de 1492 (<em>caniba / Gran Can</em>). No
                  entra en los diccionarios castellanos hasta el siglo XIX (1825–1895), adoptando
                  sentido figurado de «cruel, feroz, inhumano».
                </p>
              </div>
              <div className="bg-paper border border-hairline border-t-2 border-t-ink p-4 flex flex-col gap-1.5">
                <span className="font-mono text-xs font-semibold text-ink">Salvaje</span>
                <p className="text-xs leading-relaxed text-ink m-0">
                  Definido en 1788 por carencia de ley, habitación reglada y religión; mantuvo en la
                  RAE la acepción de «pueblos sin cultura» hasta la edición de 1970.
                </p>
              </div>
            </div>

            {/* Lemma Filter Buttons */}
            <div
              role="group"
              aria-label="Filtrar cronología léxica por lema"
              className="flex flex-wrap gap-2"
            >
              {LEXICAL_FILTERS.map((flt) => {
                const isActive = lexicalFilter === flt.id;
                return (
                  <button
                    key={flt.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setLexicalFilter(flt.id)}
                    className={`min-h-[40px] px-3.5 py-1.5 font-mono text-xs rounded border transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-ink text-white border-ink font-medium'
                        : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
                    }`}
                  >
                    {flt.label}
                  </button>
                );
              })}
            </div>

            {/* Chronological NTLLE Timeline */}
            <div className="flex flex-col divide-y divide-hairline border-t border-b border-hairline bg-paper">
              {filteredLexical.map((entry) => {
                const lemmaTone =
                  entry.lemma === 'canibal'
                    ? 'text-ochre'
                    : entry.lemma === 'antropofago'
                      ? 'text-lapis'
                      : 'text-ink';
                return (
                  <article
                    key={entry.id}
                    className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 items-start"
                  >
                    <div className="md:col-span-3 flex flex-col gap-1">
                      <span className="font-mono text-lg font-semibold tabular-nums text-ink leading-none">
                        {entry.yearLabel}
                      </span>
                      <span className={`font-mono text-xs font-semibold ${lemmaTone}`}>
                        {entry.lemmaLabel}
                      </span>
                      <span className="font-mono text-[11px] text-ink-muted leading-snug">
                        {entry.source}
                      </span>
                    </div>

                    <div className="md:col-span-5">
                      <blockquote className="m-0 pl-3.5 border-l-2 border-l-rule font-display italic text-base leading-relaxed text-ink">
                        {entry.verbatimQuote}
                      </blockquote>
                    </div>

                    <div className="md:col-span-4 flex flex-col gap-1">
                      <span className="font-mono text-[10.5px] text-ink-muted">
                        Desplazamiento semántico
                      </span>
                      <p className="text-xs sm:text-sm leading-relaxed text-ink-muted m-0">
                        {entry.semanticShift}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 5: CONTRASTE CIENCIA VS. MITO
            ============================================================ */}
        {activeTab === 'ciencia-mito' && (
          <div
            id="cannibalism-panel-ciencia-mito"
            role="tabpanel"
            aria-labelledby="cannibalism-tab-ciencia-mito"
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1.5">
              <h3 className="font-display text-xl font-semibold text-ink m-0">
                Desmontando la exclusividad «exótica»: evidencia científica e histórica frente al mito
              </h3>
              <p className="text-sm text-ink-muted m-0 max-w-3xl">
                El contraste interdisciplinar con la paleoantropología europea, la historia de la
                farmacia moderna, la primatología de campo y las crónicas europeas evidencia el
                carácter ideológico de la proyección colonial.
              </p>
            </div>

            {/* 4 Domain Selectors */}
            <div
              role="group"
              aria-label="Seleccionar ámbito de contraste ciencia frente a mito"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
            >
              {SCIENCE_VS_MYTH_CASES.map((item) => {
                const isSelected = item.id === activeCase.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setActiveCaseId(item.id)}
                    className={`min-h-[68px] p-3.5 text-left border transition-colors cursor-pointer flex flex-col justify-between gap-1 ${
                      isSelected
                        ? 'bg-paper border-ink border-t-2 border-t-forest'
                        : 'bg-canvas border-hairline hover:border-ink hover:bg-paper/60'
                    }`}
                  >
                    <span className="font-mono text-[11px] text-ink-muted tabular-nums">
                      {item.chronology}
                    </span>
                    <span className="font-display text-sm font-semibold text-ink leading-snug">
                      {item.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Contrast Panel */}
            <div className="bg-paper border border-hairline border-t-2 border-t-rule p-5 sm:p-6 flex flex-col gap-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-display text-xl font-semibold text-ink m-0">
                  {activeCase.domain}
                </h4>
                <span className="font-mono text-xs text-ink-muted tabular-nums">
                  {activeCase.chronology}
                </span>
              </div>

              {/* Dual Column: Myth vs Evidence */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-canvas border border-hairline border-t-2 border-t-ochre p-4 sm:p-5 flex flex-col gap-2">
                  <span className="font-mono text-xs font-semibold text-ochre">
                    Estereotipo / mito colonial
                  </span>
                  <p className="text-sm leading-relaxed text-ink m-0">{activeCase.mythStatement}</p>
                </div>

                <div className="bg-canvas border border-hairline border-t-2 border-t-forest p-4 sm:p-5 flex flex-col gap-2">
                  <span className="font-mono text-xs font-semibold text-forest">
                    Evidencia científica e histórica
                  </span>
                  <p className="text-sm leading-relaxed text-ink m-0">
                    {activeCase.scientificEvidence}
                  </p>
                </div>
              </div>

              {/* Sites / Empirical Cases + Linked Plates */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 flex flex-col gap-3">
                  <span className="font-mono text-xs font-semibold text-ink">
                    Yacimientos, fuentes y estudios clave
                  </span>
                  <dl className="m-0 flex flex-col gap-2.5">
                    {activeCase.keySitesOrSources.map((site) => (
                      <div key={site.name} className="bg-canvas border border-hairline p-3.5">
                        <dt className="text-sm font-semibold text-ink mb-1">{site.name}</dt>
                        <dd className="text-xs sm:text-sm leading-relaxed text-ink-muted m-0">
                          {site.detail}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="bg-canvas border-l-2 border-l-lapis pl-3.5 py-2 text-sm text-ink leading-relaxed">
                    <strong className="font-mono text-xs text-lapis block mb-0.5">
                      Conclusión docente
                    </strong>
                    {activeCase.academicTakeaway}
                  </div>

                  {activeCase.crossModuleLink && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const link = activeCase.crossModuleLink!;
                          if (link.anthropologyView) {
                            triggerCourseNavigation({
                              sectionId: link.sectionId,
                              anthropology: { viewMode: link.anthropologyView },
                            });
                          } else if (link.ethologyTab) {
                            triggerCourseNavigation({
                              sectionId: link.sectionId,
                              ethology: { tab: link.ethologyTab },
                            });
                          } else {
                            triggerCourseNavigation({ sectionId: link.sectionId });
                          }
                        }}
                        className="min-h-[40px] px-3.5 py-2 text-xs font-medium text-ink bg-canvas border border-hairline hover:border-ink hover:bg-surface rounded inline-flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <span>{activeCase.crossModuleLink.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5 flex flex-col gap-2.5">
                  <span className="font-mono text-xs font-semibold text-ink">
                    Soporte documental en la galería
                  </span>
                  <div className="flex flex-col gap-3">
                    {activeCase.plateIds.map((pid) => {
                      const plate = plateById.get(pid);
                      if (!plate) return null;
                      return (
                        <button
                          key={plate.id}
                          type="button"
                          onClick={(e) => openPlateLightbox(plate, e.currentTarget)}
                          className="group bg-canvas border border-hairline hover:border-ink p-3 text-left flex flex-col gap-2 transition-colors cursor-pointer"
                        >
                          <div className="aspect-[16/10] w-full bg-[#e9e3d5] border border-hairline overflow-hidden">
                            <img
                              src={plate.src}
                              alt={plate.title}
                              width={1150}
                              height={862}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-contain p-1 group-hover:scale-[1.03] transition-transform"
                            />
                          </div>
                          <span className="font-mono text-[11px] text-ochre">
                            {plate.accessionCode} · {plate.dating}
                          </span>
                          <span className="font-display text-sm font-semibold text-ink group-hover:text-ochre leading-snug">
                            {plate.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Academic Attribution Footer */}
        <p className="font-mono text-xs text-ink-muted m-0">
          Fuentes principales: Becerra Romero, D. (2025),{' '}
          <em>
            Imaginarios y viñetas como recurso para la recreación de la Historia de Canarias en
            Historia Moderna
          </em>{' '}
          (Hipogrifo, 13(2), 307–323); Becerra Romero, D. (2018),{' '}
          <em>Antropofagia y viñeta</em> en Á. Mateo del Pino y M. N. Pascual Soler (Eds.),{' '}
          <em>Pasión caníbal</em> (pp. 195–218, Ediciones Katatay); Bartra (2011); Chartier (1992);
          Belting (2010); NTLLE (RAE).
        </p>
      </div>
    </section>
  );
}
