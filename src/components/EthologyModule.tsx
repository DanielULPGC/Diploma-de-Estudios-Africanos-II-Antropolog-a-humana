import { Suspense, lazy, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  ArrowUpRight,
  Box,
  FileText,
  FlaskConical,
  Compass,
  Layers,
  Scale,
  RotateCcw,
} from 'lucide-react';
import {
  ETHOLOGY_STATS,
  HENKE_2026_META,
  HENKE_2026_TASKS,
  OLDOWAN_BRIDGE_CASES,
  PRIMATE_TRADITIONS,
  SOCIAL_LEARNING_MECHANISMS,
  evaluateLandscapeChoice,
  type ExperimentalStoneSpec,
  type HenkeTaskSpec,
  type SimulatorDecisionInput,
} from '../data/ethologyData';
import {
  clearPendingCourseDetail,
  consumePendingCourseDetail,
} from '../data/courseNavigation';
import { LazyEthologyArena3D, prefetch3DScene } from '../utils/async3dLoader';
import { scheduleInstantScrollToElement } from '../utils/scrollPosition';
import { GlossaryTermTrigger } from './GlossaryContext';
import { KinshipTreeExplorer } from './KinshipTreeExplorer';
import { Scene3DAsyncBoundary } from './Scene3DAsyncBoundary';

const loadSocialCooperationTab = () =>
  import('./ethology/SocialCooperationTab').then((m) => ({ default: m.SocialCooperationTab }));
const loadCommunicationComparatorTab = () =>
  import('./ethology/CommunicationComparatorTab').then((m) => ({
    default: m.CommunicationComparatorTab,
  }));
const loadEcologicalCulturesWorkshopTab = () =>
  import('./ethology/EcologicalCulturesWorkshopTab').then((m) => ({
    default: m.EcologicalCulturesWorkshopTab,
  }));
const loadTallerAutomedicacion = () =>
  import('./ethology/TallerAutomedicacion').then((m) => ({ default: m.TallerAutomedicacion }));

const LazySocialCooperationTab = lazy(loadSocialCooperationTab);
const LazyCommunicationComparatorTab = lazy(loadCommunicationComparatorTab);
const LazyEcologicalCulturesWorkshopTab = lazy(loadEcologicalCulturesWorkshopTab);
const LazyTallerAutomedicacion = lazy(loadTallerAutomedicacion);

function prefetchEthologyTab(tabId: EthologyTabId): void {
  if (tabId === 'sociedad') void loadSocialCooperationTab();
  else if (tabId === 'comunicacion') void loadCommunicationComparatorTab();
  else if (tabId === 'culturas-taller') void loadEcologicalCulturesWorkshopTab();
  else if (tabId === 'taller-automedicacion') void loadTallerAutomedicacion();
}

type EthologyTabId =
  | 'experimento'
  | 'primates'
  | 'aprendizaje'
  | 'parentesco'
  | 'olduvayense'
  | 'sociedad'
  | 'comunicacion'
  | 'culturas-taller'
  | 'taller-automedicacion';

const ETHOLOGY_TABS: Array<{ id: EthologyTabId; label: string }> = [
  { id: 'experimento', label: 'Estudio experimental (2026)' },
  { id: 'primates', label: 'Culturas primates y África' },
  { id: 'aprendizaje', label: 'Aprendizaje social y simulador' },
  { id: 'parentesco', label: 'Árbol de parentesco' },
  { id: 'olduvayense', label: 'Puente con el Olduvayense' },
  { id: 'sociedad', label: 'Sociedad y cooperación' },
  { id: 'comunicacion', label: 'Comunicación y comparador' },
  { id: 'culturas-taller', label: 'Culturas ecológicas y sabana' },
  { id: 'taller-automedicacion', label: 'Taller de Automedicación' },
];

const DEFAULT_SIMULATOR_STATE: SimulatorDecisionInput = {
  role: 'anvil',
  stationAMaterial: 'limestone',
  stationACues: false,
  stationAShells: false,
  stationBMaterial: 'sandstone',
  stationBCues: true,
  stationBShells: false,
};

function ExperimentalArenaSvg({
  task,
  selectedStoneId,
  onSelectStone,
}: {
  task: HenkeTaskSpec;
  selectedStoneId: string | null;
  onSelectStone: (stone: ExperimentalStoneSpec) => void;
}) {
  return (
    <div className="bg-paper border border-hairline p-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-hairline">
        <span className="font-mono text-[11px] tracking-wide text-ink-muted">
          Esquema de campo · {HENKE_2026_META.stoneDimensions}
        </span>
        <span className="font-mono text-[11px] text-ink-muted">
          Pulsa cualquier bloque para inspeccionar dureza y huellas
        </span>
      </div>

      <svg
        viewBox="0 0 680 256"
        className="w-full h-auto block select-none"
        role="img"
        aria-label={`Disposición experimental de la ${task.shortLabel}: ${task.title}`}
      >
        {/* Subtle ground grid */}
        <rect x="0" y="0" width="680" height="256" fill="#f7f7f5" />
        <line x1="20" y1="242" x2="660" y2="242" stroke="#e2e2dd" strokeWidth="1" />

        {task.zones.map((zone) => (
          <g key={zone.title}>
            {/* Experimental zone boundary */}
            <rect
              x={zone.x}
              y={zone.y}
              width={zone.width}
              height={zone.height}
              rx="4"
              fill={zone.hasShells ? '#f3ece4' : '#ffffff'}
              stroke={zone.hasShells ? '#b43c0b' : '#c8c8c0'}
              strokeWidth={zone.hasShells ? '1.5' : '1'}
              strokeDasharray={zone.hasShells ? undefined : '4 3'}
            />

            {/* Zone title */}
            <text
              x={zone.x + 14}
              y={zone.y + 22}
              fill="#121212"
              fontSize="12"
              fontWeight="600"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              {zone.title}
            </text>
            <text
              x={zone.x + 14}
              y={zone.y + 38}
              fill="#5a5a55"
              fontSize="10.5"
              fontFamily="IBM Plex Mono, monospace"
            >
              {zone.subtitle}
            </text>

            {/* Scattered broken nut shells for used site in Task 2 */}
            {zone.hasShells && (
              <g aria-hidden="true">
                {[
                  [zone.x + 42, zone.y + 152, -18],
                  [zone.x + 76, zone.y + 166, 25],
                  [zone.x + 132, zone.y + 158, -8],
                  [zone.x + 156, zone.y + 169, 42],
                  [zone.x + 214, zone.y + 154, -30],
                  [zone.x + 245, zone.y + 166, 15],
                  [zone.x + 188, zone.y + 68, 12],
                  [zone.x + 96, zone.y + 72, -22],
                ].map(([sx, sy, rot], idx) => (
                  <path
                    key={idx}
                    d="M -6 2 Q 0 -6 7 1 Q 1 5 -6 2 Z"
                    transform={`translate(${sx}, ${sy}) rotate(${rot})`}
                    fill="#9c6b3d"
                    stroke="#5c3b1e"
                    strokeWidth="0.9"
                    opacity="0.88"
                  />
                ))}
                <text
                  x={zone.x + zone.width - 14}
                  y={zone.y + zone.height - 10}
                  textAnchor="end"
                  fill="#b43c0b"
                  fontSize="9.5"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  Cáscaras partidas (pista de sitio)
                </text>
              </g>
            )}

            {/* Stone cuboids (isometric 6x6x4 cm representation) */}
            {zone.stones.map((stone) => {
              const isLimestone = stone.material === 'limestone';
              const isSelected = selectedStoneId === stone.id;
              const topFill = isLimestone ? '#e4dac6' : '#a97458';
              const frontFill = isLimestone ? '#cbbda3' : '#85553e';
              const sideFill = isLimestone ? '#b7a68a' : '#6c422f';
              const strokeColor = isSelected ? '#121212' : isLimestone ? '#7e715b' : '#4f2e1f';

              return (
                <g
                  key={stone.id}
                  transform={`translate(${stone.x}, ${stone.y})`}
                  onClick={() => onSelectStone(stone)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${stone.label} (${isLimestone ? 'caliza blanda 27,05' : 'arenisca dura 57,09'}${stone.modified ? ', con huellas de percusión previa' : ', sin marcas de uso'})`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectStone(stone);
                    }
                  }}
                  className="cursor-pointer focus:outline-none"
                >
                  {/* Selection halo */}
                  {isSelected && (
                    <rect
                      x="-44"
                      y="-34"
                      width="88"
                      height="82"
                      rx="4"
                      fill="none"
                      stroke="#b43c0b"
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                    />
                  )}

                  {/* Ground shadow */}
                  <ellipse cx="3" cy="24" rx="33" ry="7" fill="#121212" opacity="0.1" />

                  {/* Isometric cuboid faces */}
                  <polygon
                    points="-28,-10 0,-23 28,-10 0,3"
                    fill={topFill}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? '1.6' : '1.1'}
                  />
                  <polygon
                    points="-28,-10 0,3 0,21 -28,8"
                    fill={frontFill}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? '1.6' : '1.1'}
                  />
                  <polygon
                    points="0,3 28,-10 28,8 0,21"
                    fill={sideFill}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? '1.6' : '1.1'}
                  />

                  {/* Percussive wear / battering pit cues */}
                  {stone.modified && (
                    <g aria-hidden="true">
                      <ellipse
                        cx="0"
                        cy="-10"
                        rx="11"
                        ry="5.5"
                        fill={isLimestone ? '#b5a284' : '#6c422f'}
                        opacity="0.72"
                      />
                      <circle cx="-4" cy="-11" r="1.4" fill="#121212" opacity="0.65" />
                      <circle cx="3" cy="-9" r="1.6" fill="#121212" opacity="0.65" />
                      <circle cx="0" cy="-12" r="1.2" fill="#f7f7f5" opacity="0.8" />
                      <circle cx="6" cy="-11" r="1.1" fill="#121212" opacity="0.55" />
                      <circle cx="-2" cy="-7" r="1.1" fill="#121212" opacity="0.55" />
                      {/* Cue indicator tick */}
                      <circle cx="24" cy="-21" r="4.5" fill="#b43c0b" />
                      <line x1="21.5" y1="-21" x2="26.5" y2="-21" stroke="#ffffff" strokeWidth="1.2" />
                      <line x1="24" y1="-23.5" x2="24" y2="-18.5" stroke="#ffffff" strokeWidth="1.2" />
                    </g>
                  )}

                  {/* Label beneath stone */}
                  <text
                    x="0"
                    y="38"
                    textAnchor="middle"
                    fill="#121212"
                    fontSize="10"
                    fontWeight={isSelected ? '700' : '500'}
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    {stone.label}
                  </text>
                </g>
              );
            })}
          </g>
        ))}

        {/* Compact bottom legend */}
        <g transform="translate(24, 232)" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="#5a5a55">
          <rect x="0" y="0" width="12" height="10" fill="#e4dac6" stroke="#7e715b" strokeWidth="1" />
          <text x="18" y="9">Caliza blanda (27,05)</text>

          <rect x="168" y="0" width="12" height="10" fill="#a97458" stroke="#4f2e1f" strokeWidth="1" />
          <text x="186" y="9">Arenisca dura (57,09)</text>

          <circle cx="348" cy="5" r="4.5" fill="#b43c0b" />
          <text x="359" y="9">Huellas previas de percusión (pista social)</text>
        </g>
      </svg>
    </div>
  );
}

export function EthologyModule() {
  const [activeTab, setActiveTab] = useState<EthologyTabId>('experimento');
  const [activeTaskId, setActiveTaskId] = useState<HenkeTaskSpec['id']>('task-3');
  const [arenaViewMode, setArenaViewMode] = useState<'2d' | '3d'>('3d');
  const [selectedStone, setSelectedStone] = useState<ExperimentalStoneSpec | null>(
    HENKE_2026_TASKS[2].zones[0].stones[3]
  );
  const [primateFilter, setPrimateFilter] = useState<'todos' | 'africa' | 'convergencia'>('todos');
  const [selectedTraditionId, setSelectedTraditionId] = useState<string>(PRIMATE_TRADITIONS[0].id);
  const [simInput, setSimInput] = useState<SimulatorDecisionInput>(DEFAULT_SIMULATOR_STATE);
  const tabButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const applyDetail = (
      detail?: EthologyTabId | { tab: EthologyTabId; view3d?: boolean } | null
    ) => {
      if (!detail) return;
      const tabId = typeof detail === 'string' ? detail : detail.tab;
      if (tabId && ETHOLOGY_TABS.some((t) => t.id === tabId)) {
        setActiveTab(tabId);
      }
      if (typeof detail === 'object' && detail.view3d) {
        prefetch3DScene('ethology');
        setArenaViewMode('3d');
      }
    };

    const pending = consumePendingCourseDetail('ethology');
    if (pending) {
      applyDetail(pending);
    }

    const onOpenTab = (event: Event) => {
      clearPendingCourseDetail('ethology');
      applyDetail(
        (event as CustomEvent<EthologyTabId | { tab: EthologyTabId; view3d?: boolean }>).detail
      );
    };
    window.addEventListener('ulpgc:open-ethology-tab', onOpenTab);
    return () => window.removeEventListener('ulpgc:open-ethology-tab', onOpenTab);
  }, []);

  const activeTask = useMemo(
    () => HENKE_2026_TASKS.find((t) => t.id === activeTaskId) ?? HENKE_2026_TASKS[0],
    [activeTaskId]
  );

  const filteredTraditions = useMemo(() => {
    if (primateFilter === 'todos') return PRIMATE_TRADITIONS;
    return PRIMATE_TRADITIONS.filter((t) => t.group === primateFilter);
  }, [primateFilter]);

  const activeTradition = useMemo(() => {
    const match = filteredTraditions.find((t) => t.id === selectedTraditionId);
    return match ?? filteredTraditions[0] ?? PRIMATE_TRADITIONS[0];
  }, [filteredTraditions, selectedTraditionId]);

  const simulatorResult = useMemo(() => evaluateLandscapeChoice(simInput), [simInput]);

  const workspaceTopRef = useRef<HTMLDivElement | null>(null);

  const handleSelectTab = (tabId: EthologyTabId) => {
    setActiveTab(tabId);
    scheduleInstantScrollToElement(() => workspaceTopRef.current, {
      onlyIfAbove: true,
    });
  };

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % ETHOLOGY_TABS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + ETHOLOGY_TABS.length) % ETHOLOGY_TABS.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = ETHOLOGY_TABS.length - 1;
    }
    if (nextIndex === null) return;
    e.preventDefault();
    const next = ETHOLOGY_TABS[nextIndex];
    handleSelectTab(next.id);
    tabButtonRefs.current[nextIndex]?.focus();
  };

  const handleSwitchTask = (taskId: HenkeTaskSpec['id']) => {
    setActiveTaskId(taskId);
    const nextTask = HENKE_2026_TASKS.find((t) => t.id === taskId);
    if (nextTask) {
      const firstZone = nextTask.zones[nextTask.zones.length - 1];
      setSelectedStone(firstZone.stones[firstZone.stones.length - 1] ?? null);
    }
  };

  return (
    <section
      aria-labelledby="etologia-heading"
      className="pt-10 border-t-2 border-rule flex flex-col gap-8"
    >
      {/* Editorial Masthead */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono text-xs tracking-wide text-ochre">
            Etología · Primatología comparada y arqueología de primates
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={HENKE_2026_META.doi}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[36px] px-3 py-1.5 font-mono text-xs text-ink bg-paper border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
              <span>Artículo original · DOI (2026)</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <h2
          id="etologia-heading"
          className="font-display text-2xl sm:text-4xl font-semibold tracking-tight leading-[1.12] text-ink"
        >
          Etología comparada, sociedad, comunicación y culturas primates en África
        </h2>

        <div className="flex flex-col gap-3 max-w-[76ch] text-base leading-[1.72] text-ink">
          <p>
            El registro fósil conserva huesos y piedras, pero rara vez captura directamente el
            comportamiento, la política social o la cultura orgánica que los sostuvieron. Para
            reconstruir cómo evolucionaron la cooperación, la comunicación y el uso del paisaje en
            África, la{' '}
            <GlossaryTermTrigger termId="etologia-comparada" tone="ochre">
              etología comparada
            </GlossaryTermTrigger>{' '}
            y la{' '}
            <GlossaryTermTrigger termId="arqueologia-primates" tone="lapis">
              arqueología de primates
            </GlossaryTermTrigger>{' '}
            integran ocho ejes de estudio: desde las tradiciones líticas experimentales (Henke-von
            der Malsburg et al., 2026) hasta las{' '}
            <GlossaryTermTrigger termId="fision-fusion" tone="ochre">
              sociedades de fisión-fusión
            </GlossaryTermTrigger>
            , la{' '}
            <GlossaryTermTrigger termId="comunicacion-gestual-intencional" tone="lapis">
              comunicación gestual intencional
            </GlossaryTermTrigger>
            , las culturas vegetales de Goualougo, la caza con lanzas en la sabana de Fongoli y la{' '}
            <GlossaryTermTrigger termId="zoofarmacognosia" tone="forest">
              zoofarmacognosia
            </GlossaryTermTrigger>
            .
          </p>
          <p>
            En el plano tecnológico, el estudio publicado en{' '}
            <em>Proceedings of the Royal Society B</em> (2026) demuestra que las{' '}
            <GlossaryTermTrigger termId="facilitacion-local" tone="forest">
              pistas sociales indirectas
            </GlossaryTermTrigger>{' '}
            grabadas sobre herramientas{' '}
            <span className="hl-ochre">
              llegan a imponerse sobre las propiedades físicas de la materia prima
            </span>
            , reforzando la{' '}
            <GlossaryTermTrigger termId="cuarta-dimension-herramientas" tone="lapis">
              «cuarta dimensión» del uso de herramientas
            </GlossaryTermTrigger>
            . A su vez, el contraste entre chimpancés, bonobos, gorilas, babuinos y geladas amplía
            el enfoque desde la piedra hacia la cooperación, la resolución de conflictos y el origen
            de la cultura africana.
          </p>
        </div>
      </div>

      {/* 4-Column Quantitative Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ETHOLOGY_STATS.map((st) => {
          const accentTone =
            st.accent === 'ochre'
              ? 'text-ochre'
              : st.accent === 'lapis'
                ? 'text-lapis'
                : st.accent === 'forest'
                  ? 'text-forest'
                  : 'text-ink';

          return (
            <div key={st.label} className="border-t border-rule pt-3 flex flex-col gap-1.5">
              <span className="font-mono text-[11px] tracking-wide text-ink-muted">
                {st.label}
              </span>
              <span
                className={`font-mono text-2xl sm:text-3xl font-medium tabular-nums tracking-tight leading-none ${accentTone}`}
              >
                {st.value}
              </span>
              <span className="font-mono text-xs text-ink-muted">{st.delta}</span>
            </div>
          );
        })}
      </div>

      {/* Interactive Workspace Tab Navigation */}
      <div ref={workspaceTopRef} tabIndex={-1} className="flex flex-col gap-6 focus:outline-none">
        <div
          role="tablist"
          aria-label="Secciones del módulo de etología"
          className="flex items-center gap-2 overflow-x-auto sm:flex-wrap pb-3 border-b border-hairline"
        >
          {ETHOLOGY_TABS.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabButtonRefs.current[idx] = el;
                }}
                type="button"
                role="tab"
                id={`tab-etologia-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-etologia-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleSelectTab(tab.id)}
                onMouseEnter={() => prefetchEthologyTab(tab.id)}
                onFocus={() => prefetchEthologyTab(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                className={`min-h-[40px] px-3.5 py-2 text-xs sm:text-sm font-medium border rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-ink text-white border-ink'
                    : 'bg-paper text-ink-muted border-hairline hover:text-ink hover:border-ink'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: HENKE-VON DER MALSBURG ET AL. (2026) INTERACTIVE EXPERIMENT EXPLORER */}
        {activeTab === 'experimento' && (
          <div
            id="panel-etologia-experimento"
            role="tabpanel"
            aria-labelledby="tab-etologia-experimento"
            className="flex flex-col gap-6"
          >
            {/* Primary Paper Citation Strip */}
            <div className="bg-paper border border-hairline p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 font-mono text-[11px] text-ochre">
                  <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Artículo de referencia integrado · Open Access CC BY 4.0</span>
                </div>
                <p className="text-sm font-semibold text-ink m-0">
                  {HENKE_2026_META.authors} ({HENKE_2026_META.year}).{' '}
                  <em className="font-normal">{HENKE_2026_META.title}</em>.{' '}
                  <span className="font-mono text-xs text-ink-muted">{HENKE_2026_META.journal}</span>
                </p>
                <p className="font-mono text-[11px] text-ink-muted m-0">
                  {HENKE_2026_META.institution}
                </p>
              </div>
              <a
                href={HENKE_2026_META.doi}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-lapis hover:text-ochre underline underline-offset-4 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <span>DOI: 10.1098/rspb.2026.0416</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>

            {/* Task Selector Bar */}
            <div className="flex flex-wrap items-center gap-2">
              {HENKE_2026_TASKS.map((task) => {
                const isSelected = task.id === activeTask.id;
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => handleSwitchTask(task.id)}
                    aria-pressed={isSelected}
                    className={`min-h-[40px] px-3.5 py-2 text-xs font-mono border rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-ochre text-white border-ochre font-semibold'
                        : 'bg-canvas text-ink border-hairline hover:border-ink'
                    }`}
                  >
                    {task.shortLabel}
                  </button>
                );
              })}
            </div>

            {/* Main 2-Column Experiment Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: 2D / 3D Arena + Selected Stone Inspector */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1.5 max-w-[52ch]">
                    <span className="font-mono text-[11px] text-ochre">{activeTask.sampleSummary}</span>
                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">
                      {activeTask.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-muted m-0">{activeTask.question}</p>
                  </div>

                  {/* 2D / 3D View Switcher */}
                  <div
                    role="group"
                    aria-label="Modo de visualización del escenario experimental"
                    className="inline-flex items-center border border-hairline rounded bg-paper p-0.5 shrink-0"
                  >
                    <button
                      type="button"
                      onClick={() => setArenaViewMode('2d')}
                      aria-pressed={arenaViewMode === '2d'}
                      className={`min-h-[34px] px-3 py-1 font-mono text-xs rounded-sm transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                        arenaViewMode === '2d'
                          ? 'bg-ink text-white font-medium'
                          : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Esquema 2D</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setArenaViewMode('3d')}
                      onMouseEnter={() => prefetch3DScene('ethology')}
                      onFocus={() => prefetch3DScene('ethology')}
                      aria-pressed={arenaViewMode === '3d'}
                      className={`min-h-[34px] px-3 py-1 font-mono text-xs rounded-sm transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                        arenaViewMode === '3d'
                          ? 'bg-ochre text-white font-medium'
                          : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      <Box className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Escena 3D</span>
                    </button>
                  </div>
                </div>

                {arenaViewMode === '2d' ? (
                  <ExperimentalArenaSvg
                    task={activeTask}
                    selectedStoneId={selectedStone?.id ?? null}
                    onSelectStone={setSelectedStone}
                  />
                ) : (
                  <Scene3DAsyncBoundary
                    sceneId="ethology"
                    onFallbackTo2D={() => setArenaViewMode('2d')}
                  >
                    <LazyEthologyArena3D
                      task={activeTask}
                      selectedStoneId={selectedStone?.id ?? null}
                      onSelectStone={setSelectedStone}
                      onFallbackTo2D={() => setArenaViewMode('2d')}
                    />
                  </Scene3DAsyncBoundary>
                )}

                {/* Stone Inspector Readout */}
                {selectedStone && (
                  <div className="bg-canvas border border-hairline p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[11px] tracking-wide text-ink-muted">
                        Bloque inspeccionado · {selectedStone.label}
                      </span>
                      <p className="text-sm text-ink m-0">
                        {selectedStone.material === 'limestone'
                          ? 'Caliza fosilífera blanda: se deforma con mayor facilidad bajo percusión, creando pequeñas depresiones que estabilizan el fruto como yunque.'
                          : 'Arenisca litificada dura: elevada resistencia mecánica y mayor rebote elástico, óptima para transmitir energía de impacto como percutor.'}
                      </p>
                    </div>
                    <div className="flex sm:flex-col gap-4 sm:gap-1 shrink-0 sm:text-right border-t sm:border-t-0 sm:border-l border-hairline pt-3 sm:pt-0 sm:pl-4">
                      <div>
                        <div className="font-mono text-[10.5px] text-ink-muted">
                          Dureza de rebote
                        </div>
                        <div className="font-mono text-base font-semibold text-ink tabular-nums">
                          {selectedStone.material === 'limestone'
                            ? HENKE_2026_META.limestoneHardness
                            : HENKE_2026_META.sandstoneHardness}
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[10.5px] text-ink-muted">
                          Pista social
                        </div>
                        <div
                          className={`font-mono text-xs font-medium ${
                            selectedStone.modified ? 'text-ochre' : 'text-ink-muted'
                          }`}
                        >
                          {selectedStone.modified ? 'Con marcas previas' : 'Superficie intacta'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-hairline pt-4 flex flex-col gap-2 text-sm leading-relaxed text-ink">
                  <p className="m-0">
                    <strong>Diseño experimental:</strong> {activeTask.setupDescription}
                  </p>
                  <p className="m-0 text-ink-muted">
                    <strong className="text-ink">Lectura evolutiva:</strong>{' '}
                    {activeTask.evolutionaryImplication}
                  </p>
                </div>
              </div>

              {/* Right: GLMM Statistical Evidence Panel */}
              <div className="lg:col-span-5 bg-paper border border-hairline p-5 flex flex-col gap-5">
                <div className="flex flex-col gap-1 pb-3 border-b border-hairline">
                  <span className="font-mono text-[11px] tracking-wide text-lapis font-medium">
                    Resultados estadísticos (GLMM binomial)
                  </span>
                  <p className="text-sm leading-relaxed text-ink m-0">{activeTask.keyFinding}</p>
                </div>

                <div className="flex flex-col gap-4">
                  {activeTask.metrics.map((metric) => (
                    <div
                      key={metric.role}
                      className="bg-canvas border border-hairline p-3.5 flex flex-col gap-2.5"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-mono text-xs font-semibold text-ink">
                          {metric.role}
                        </span>
                        <span
                          className={`font-mono text-xs font-semibold tabular-nums ${
                            metric.significant ? 'text-ochre' : 'text-ink-muted'
                          }`}
                        >
                          {metric.pValue}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-ink">
                        <span className="font-medium">{metric.winner}</span>
                        <span className="font-mono text-[11px] text-ink-muted tabular-nums">
                          {metric.estimate}
                        </span>
                      </div>

                      {/* Directional visual bar */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between font-mono text-[10px] text-ink-muted">
                          <span>{metric.leftLabel}</span>
                          <span>{metric.rightLabel}</span>
                        </div>
                        <div
                          className="relative h-2 bg-surface-high overflow-hidden"
                          aria-hidden="true"
                        >
                          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-ink/35" />
                          {metric.barDirection === 'left' && (
                            <div
                              className="absolute top-0 bottom-0 bg-forest"
                              style={{
                                right: '50%',
                                width: `${metric.barMagnitude / 2}%`,
                              }}
                            />
                          )}
                          {metric.barDirection === 'right' && (
                            <div
                              className="absolute top-0 bottom-0 bg-ochre"
                              style={{
                                left: '50%',
                                width: `${metric.barMagnitude / 2}%`,
                              }}
                            />
                          )}
                          {metric.barDirection === 'neutral' && (
                            <div
                              className="absolute top-0 bottom-0 bg-ink-muted/45"
                              style={{
                                left: `${50 - metric.barMagnitude / 4}%`,
                                width: `${metric.barMagnitude / 2}%`,
                              }}
                            />
                          )}
                        </div>
                      </div>

                      <div className="font-mono text-[10.5px] text-ink-muted leading-snug">
                        {metric.modelStats}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hardness Ratio Quick Strip */}
                <div className="pt-3 border-t border-hairline flex flex-col gap-2">
                  <div className="flex justify-between font-mono text-[11px] text-ink-muted">
                    <span>Dureza de rebote (Equotip)</span>
                    <span className="tabular-nums">2,1× más dura la arenisca</span>
                  </div>
                  <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-24 text-ink-muted shrink-0">Caliza (n=69)</span>
                      <div className="flex-1 h-2 bg-surface-high">
                        <div className="h-full bg-forest" style={{ width: '39%' }} />
                      </div>
                      <span className="w-12 text-right tabular-nums text-ink">27,05</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-24 text-ink-muted shrink-0">Arenisca (n=37)</span>
                      <div className="flex-1 h-2 bg-surface-high">
                        <div className="h-full bg-ochre" style={{ width: '82%' }} />
                      </div>
                      <span className="w-12 text-right tabular-nums text-ink">57,09</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SCNP vs PET Comparison & Learning Curve */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {HENKE_2026_META.populations.map((pop) => (
                <div
                  key={pop.code}
                  className="bg-canvas border border-hairline p-4 flex flex-col gap-2"
                >
                  <div className="flex items-baseline justify-between gap-2 border-b border-hairline pb-2">
                    <h4 className="font-display text-base font-semibold text-ink m-0">
                      {pop.name}
                    </h4>
                    <span className="font-mono text-xs font-semibold text-ochre">{pop.code}</span>
                  </div>
                  <div className="font-mono text-[11px] text-ink-muted">
                    {pop.context} · {pop.individuals}
                  </div>
                  <div className="font-mono text-[11px] text-lapis">{pop.trials}</div>
                  <p className="text-xs leading-relaxed text-ink m-0">{pop.naturalTools}</p>
                  <p className="text-xs leading-relaxed text-ink-muted m-0">{pop.performance}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: AFRICAN GREAT APES & CONVERGENT PRIMATE CULTURES */}
        {activeTab === 'primates' && (
          <div
            id="panel-etologia-primates"
            role="tabpanel"
            aria-labelledby="tab-etologia-primates"
            className="flex flex-col gap-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { id: 'todos', label: 'Todos los modelos (6)' },
                    { id: 'africa', label: 'Grandes simios africanos (4)' },
                    { id: 'convergencia', label: 'Convergencia lítica (2)' },
                  ] as const
                ).map((flt) => {
                  const active = primateFilter === flt.id;
                  return (
                    <button
                      key={flt.id}
                      type="button"
                      onClick={() => setPrimateFilter(flt.id)}
                      aria-pressed={active}
                      className={`min-h-[38px] px-3.5 py-1.5 font-mono text-xs border rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-ink text-white border-ink'
                          : 'bg-paper text-ink-muted border-hairline hover:border-ink hover:text-ink'
                      }`}
                    >
                      {flt.label}
                    </button>
                  );
                })}
              </div>
              <span className="font-mono text-xs text-ink-muted">
                Homología evolutiva (África) + analogía convergente (Neotrópico y Asia)
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Species selector column */}
              <div className="lg:col-span-5 flex flex-col gap-2">
                {filteredTraditions.map((item) => {
                  const isCurrent = item.id === activeTradition.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedTraditionId(item.id)}
                      className={`text-left p-4 border rounded transition-colors cursor-pointer flex flex-col gap-1 ${
                        isCurrent
                          ? 'bg-paper border-ink'
                          : 'bg-canvas border-hairline hover:border-ink/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-base font-semibold text-ink">
                          {item.commonName}
                        </span>
                        <span
                          className={`font-mono text-[10.5px] ${
                            item.group === 'africa' ? 'text-forest' : 'text-lapis'
                          }`}
                        >
                          {item.group === 'africa' ? 'África' : 'Convergencia'}
                        </span>
                      </div>
                      <span className="font-display italic text-xs text-ink-muted">
                        {item.species}
                      </span>
                      <span className="font-mono text-[11px] text-ink-muted">{item.region}</span>
                    </button>
                  );
                })}
              </div>

              {/* Detailed dossier panel */}
              <div className="lg:col-span-7 bg-paper border border-hairline p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-1 border-b border-hairline pb-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-ochre">
                    <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{activeTradition.region}</span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-ink">
                    {activeTradition.commonName}{' '}
                    <span className="italic font-normal text-ink-muted text-xl">
                      ({activeTradition.species})
                    </span>
                  </h3>
                  <div className="font-mono text-xs text-ink-muted">
                    Estaciones de campo clave: {activeTradition.fieldSites}
                  </div>
                </div>

                <dl className="grid grid-cols-1 gap-4 text-sm leading-relaxed">
                  <div className="border-b border-hairline pb-3">
                    <dt className="font-mono text-[11px] tracking-wide text-ink-muted font-medium mb-1">
                      Repertorio técnico y tradición conductual
                    </dt>
                    <dd className="text-ink m-0">{activeTradition.behavioralTradition}</dd>
                  </div>

                  <div className="border-b border-hairline pb-3">
                    <dt className="font-mono text-[11px] tracking-wide text-ink-muted font-medium mb-1">
                      Materias primas y soportes
                    </dt>
                    <dd className="text-ink m-0">{activeTradition.rawMaterials}</dd>
                  </div>

                  <div className="border-b border-hairline pb-3">
                    <dt className="font-mono text-[11px] tracking-wide text-forest font-medium mb-1">
                      Mecanismo de transmisión social
                    </dt>
                    <dd className="text-ink m-0">{activeTradition.socialTransmission}</dd>
                  </div>

                  <div className="border-b border-hairline pb-3">
                    <dt className="font-mono text-[11px] tracking-wide text-lapis font-medium mb-1">
                      Firma arqueológica y alcance tafonómico
                    </dt>
                    <dd className="text-ink m-0">{activeTradition.archaeologicalTrace}</dd>
                  </div>
                </dl>

                <div className="font-mono text-[11px] text-ink-muted">
                  Referencias clave: {activeTradition.keyReference}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SOCIAL LEARNING MECHANISMS & INTERACTIVE LANDSCAPE SIMULATOR */}
        {activeTab === 'aprendizaje' && (
          <div
            id="panel-etologia-aprendizaje"
            role="tabpanel"
            aria-labelledby="tab-etologia-aprendizaje"
            className="flex flex-col gap-6"
          >
            {/* Interactive Landscape Choice Simulator */}
            <div className="bg-paper border border-hairline p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline pb-4">
                <div className="flex flex-col gap-1 max-w-[65ch]">
                  <div className="flex items-center gap-2 font-mono text-xs text-ochre">
                    <Scale className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Simulador didáctico · Basado en los modelos GLMM de 2026</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink">
                    ¿Qué piedra elegirá el primate en el paisaje?
                  </h3>
                  <p className="text-sm text-ink-muted m-0">
                    Combina dureza de la roca, huellas previas de percusión y presencia de cáscaras
                    para contrastar la selección mecánica frente a las pistas sociales indirectas.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSimInput(DEFAULT_SIMULATOR_STATE)}
                  className="min-h-[38px] px-3 py-1.5 font-mono text-xs text-ink bg-canvas border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Escenario Tarea 3</span>
                </button>
              </div>

              {/* Function Selector */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-ink-muted">Función requerida:</span>
                {(
                  [
                    { id: 'anvil', label: 'Yunque (soporte inferior)' },
                    { id: 'hammer', label: 'Percutor (piedra activa)' },
                  ] as const
                ).map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSimInput((prev) => ({ ...prev, role: role.id }))}
                    aria-pressed={simInput.role === role.id}
                    className={`min-h-[38px] px-3.5 py-1.5 font-mono text-xs border rounded transition-colors whitespace-nowrap cursor-pointer ${
                      simInput.role === role.id
                        ? 'bg-ink text-white border-ink'
                        : 'bg-canvas text-ink border-hairline hover:border-ink'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>

              {/* Station A vs Station B Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(
                  [
                    {
                      key: 'A' as const,
                      title: 'Estación A',
                      material: simInput.stationAMaterial,
                      cues: simInput.stationACues,
                      shells: simInput.stationAShells,
                      score: simulatorResult.scoreA,
                    },
                    {
                      key: 'B' as const,
                      title: 'Estación B',
                      material: simInput.stationBMaterial,
                      cues: simInput.stationBCues,
                      shells: simInput.stationBShells,
                      score: simulatorResult.scoreB,
                    },
                  ]
                ).map((st) => {
                  const isWinner = simulatorResult.winner === st.key;
                  return (
                    <div
                      key={st.key}
                      className={`bg-canvas border p-4 flex flex-col gap-3.5 ${
                        isWinner ? 'border-ochre' : 'border-hairline'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-hairline">
                        <span className="font-display text-base font-semibold text-ink">
                          {st.title}
                        </span>
                        <span
                          className={`font-mono text-xs tabular-nums font-semibold ${
                            isWinner ? 'text-ochre' : 'text-ink-muted'
                          }`}
                        >
                          Índice de atracción: {st.score}/100
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="font-mono text-[11px] text-ink-muted">Materia prima</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setSimInput((prev) =>
                                st.key === 'A'
                                  ? { ...prev, stationAMaterial: 'limestone' }
                                  : { ...prev, stationBMaterial: 'limestone' }
                              )
                            }
                            aria-pressed={st.material === 'limestone'}
                            className={`min-h-[38px] px-2.5 py-1.5 font-mono text-xs border rounded cursor-pointer transition-colors ${
                              st.material === 'limestone'
                                ? 'bg-forest text-white border-forest'
                                : 'bg-paper text-ink border-hairline hover:border-ink'
                            }`}
                          >
                            Caliza blanda (27)
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setSimInput((prev) =>
                                st.key === 'A'
                                  ? { ...prev, stationAMaterial: 'sandstone' }
                                  : { ...prev, stationBMaterial: 'sandstone' }
                              )
                            }
                            aria-pressed={st.material === 'sandstone'}
                            className={`min-h-[38px] px-2.5 py-1.5 font-mono text-xs border rounded cursor-pointer transition-colors ${
                              st.material === 'sandstone'
                                ? 'bg-ochre text-white border-ochre'
                                : 'bg-paper text-ink border-hairline hover:border-ink'
                            }`}
                          >
                            Arenisca dura (57)
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 text-xs text-ink">
                        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={st.cues}
                            onChange={(e) =>
                              setSimInput((prev) =>
                                st.key === 'A'
                                  ? { ...prev, stationACues: e.target.checked }
                                  : { ...prev, stationBCues: e.target.checked }
                              )
                            }
                            className="w-4 h-4 accent-[#b43c0b]"
                          />
                          <span>Huellas visibles de percusión previa en la roca</span>
                        </label>
                        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={st.shells}
                            onChange={(e) =>
                              setSimInput((prev) =>
                                st.key === 'A'
                                  ? { ...prev, stationAShells: e.target.checked }
                                  : { ...prev, stationBShells: e.target.checked }
                              )
                            }
                            className="w-4 h-4 accent-[#b43c0b]"
                          />
                          <span>Cáscaras partidas dispersas alrededor (sitio usado)</span>
                        </label>
                      </div>

                      <div className="h-2 bg-surface-high overflow-hidden" aria-hidden="true">
                        <div
                          className={`h-full transition-all duration-200 ${
                            isWinner ? 'bg-ochre' : 'bg-ink-muted/50'
                          }`}
                          style={{ width: `${st.score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Outcome Readout */}
              <div className="bg-canvas border border-ink p-4 flex flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-ochre">
                    Predicción:{' '}
                    {simulatorResult.winner === 'tie'
                      ? 'Sin sesgo dominante (elección equilibrada)'
                      : `Preferencia por Estación ${simulatorResult.winner} · ${simulatorResult.dominantDriver}`}
                  </span>
                  <span className="font-mono text-[11px] text-lapis">
                    {simulatorResult.matchingTask}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-ink m-0">
                  {simulatorResult.explanation}
                </p>
              </div>
            </div>

            {/* 4 Mechanisms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SOCIAL_LEARNING_MECHANISMS.map((mech) => (
                <article
                  key={mech.id}
                  className="bg-canvas border border-hairline p-5 flex flex-col gap-3"
                >
                  <div className="flex flex-col gap-0.5 border-b border-hairline pb-2.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="font-display text-lg font-semibold text-ink m-0">
                        {mech.name}
                      </h4>
                      <span className="font-mono text-[11px] text-ochre shrink-0">
                        {mech.timescale}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-ink-muted">{mech.englishTerm}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-ink m-0">{mech.summary}</p>
                  <p className="text-xs leading-relaxed text-ink-muted m-0">
                    <strong className="text-ink">Evidencia empírica:</strong> {mech.example}
                  </p>
                  <div className="pt-2 border-t border-hairline font-mono text-[11px] text-lapis">
                    Visibilidad arqueológica: {mech.archaeologicalVisibility}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: INTERACTIVE KINSHIP TREE (GRANDMOTHER HYPOTHESIS & AFRICAN KINSHIP) */}
        {activeTab === 'parentesco' && (
          <div
            id="panel-etologia-parentesco"
            role="tabpanel"
            aria-labelledby="tab-etologia-parentesco"
          >
            <KinshipTreeExplorer />
          </div>
        )}

        {/* TAB 5: BRIDGE TO AFRICAN PLIO-PLEISTOCENE OLDOWAN SITES */}
        {activeTab === 'olduvayense' && (
          <div
            id="panel-etologia-olduvayense"
            role="tabpanel"
            aria-labelledby="tab-etologia-olduvayense"
            className="flex flex-col gap-6"
          >
            <div className="bg-paper border border-hairline p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2 font-mono text-xs text-lapis">
                <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                <span>De la etología primate a la arqueología africana temprana</span>
              </div>
              <p className="text-sm leading-relaxed text-ink m-0">
                La etología comparada no equipara a los primates actuales con «ancestros congelados»
                ni ignora el riesgo de{' '}
                <GlossaryTermTrigger termId="equifinalidad" tone="ochre">
                  equifinalidad
                </GlossaryTermTrigger>
                . Su valor científico reside en aislar mecanismos conductuales medibles —como la
                interacción entre dureza lítica y pistas sociales duraderas— que ayudan a formular
                hipótesis contrastables sobre los yacimientos más antiguos de África Oriental.
              </p>
            </div>

            <div className="overflow-x-auto border border-hairline bg-canvas">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="bg-paper border-b border-rule font-mono text-[11px] tracking-wide text-ink-muted">
                    <th className="py-3 px-4 font-semibold">Yacimiento y cronología</th>
                    <th className="py-3 px-4 font-semibold">Firma lítica africana</th>
                    <th className="py-3 px-4 font-semibold">Aporte etológico comparado</th>
                    <th className="py-3 px-4 font-semibold">Límite metodológico</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline text-xs leading-relaxed text-ink">
                  {OLDOWAN_BRIDGE_CASES.map((row) => (
                    <tr key={row.id} className="align-top hover:bg-paper/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-display text-sm font-semibold text-ink">
                          {row.site}
                        </div>
                        <div className="font-mono text-[11px] text-ochre mt-0.5">
                          {row.ageMa} · {row.country}
                        </div>
                        <div className="font-mono text-[10.5px] text-ink-muted mt-0.5">
                          {row.industry}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{row.lithicSignature}</td>
                      <td className="py-3.5 px-4 text-ink">{row.ethologicalParallel}</td>
                      <td className="py-3.5 px-4 text-ink-muted">{row.criticalLimit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm leading-relaxed">
              <div className="border-t border-rule pt-3 flex flex-col gap-1.5">
                <span className="font-mono text-[11px] tracking-wide text-forest font-medium">
                  Qué sí explica el modelo etológico (2026)
                </span>
                <p className="text-ink m-0">
                  Explica por qué los enclaves líticos se concentran reiteradamente en los mismos
                  puntos del paisaje incluso cuando existen rocas equivalentes a pocos metros: las
                  trazas de uso previo y los residuos acumulados actúan como memoria espacial
                  social que reduce costes de exploración y estabiliza tradiciones locales.
                </p>
              </div>
              <div className="border-t border-rule pt-3 flex flex-col gap-1.5">
                <span className="font-mono text-[11px] tracking-wide text-ochre font-medium">
                  Qué exige cautela científica
                </span>
                <p className="text-ink m-0">
                  Capuchinos y humanos divergieron hace más de 35–40 Ma y la talla concoidea
                  olduvayense —con extracción seriada de lascas cortantes y transporte de kilómetros
                  como en Kanjera South— supera la percusión nutricia primate. La comparación es una
                  herramienta heurística, nunca una equivalencia evolutiva lineal.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AFRICAN PRIMATE SOCIAL ORGANIZATION, COOPERATION & CONFLICT RESOLUTION */}
        {activeTab === 'sociedad' && (
          <Suspense
            fallback={
              <div className="bg-paper border border-hairline p-8 font-mono text-xs text-ink-muted">
                Cargando organización social y cooperación primate…
              </div>
            }
          >
            <LazySocialCooperationTab />
          </Suspense>
        )}

        {/* TAB 7: COMMUNICATION, COGNITION & INTERACTIVE SOCIAL/COMMUNICATION COMPARATOR */}
        {activeTab === 'comunicacion' && (
          <Suspense
            fallback={
              <div className="bg-paper border border-hairline p-8 font-mono text-xs text-ink-muted">
                Cargando comparador interactivo de comunicación primate…
              </div>
            }
          >
            <LazyCommunicationComparatorTab />
          </Suspense>
        )}

        {/* TAB 8: NON-LITHIC AFRICAN CULTURES (PLANT TOOLKITS, SAVANNA HUNTING, ZOOPHARMACOGNOSY) & CLASSROOM WORKSHOP */}
        {activeTab === 'culturas-taller' && (
          <Suspense
            fallback={
              <div className="bg-paper border border-hairline p-8 font-mono text-xs text-ink-muted">
                Cargando culturas ecológicas, sabana y ficha de automedicación…
              </div>
            }
          >
            <LazyEcologicalCulturesWorkshopTab />
          </Suspense>
        )}

        {/* TAB 9: VISUAL MATCHING WORKSHOP — TALLER DE AUTOMEDICACIÓN (WITH SESSION PROGRESS) */}
        {activeTab === 'taller-automedicacion' && (
          <Suspense
            fallback={
              <div className="bg-paper border border-hairline p-8 font-mono text-xs text-ink-muted">
                Cargando Taller de Automedicación (ejemplares botánicos africanos)…
              </div>
            }
          >
            <LazyTallerAutomedicacion />
          </Suspense>
        )}
      </div>
    </section>
  );
}
