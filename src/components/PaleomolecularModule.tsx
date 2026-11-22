import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Dna,
  ExternalLink,
  FlaskConical,
  Maximize2,
  Microscope,
  ShieldCheck,
} from 'lucide-react';
import {
  DIAGNOSTIC_MARKERS,
  MOLECULAR_CASE_STUDIES,
  MOLECULAR_PRESERVATION_BANDS,
  PROTOCOL_COMPARISON_ROWS,
  evaluateMolecularStrategy,
  type AgeBracketId,
  type MolecularDiscipline,
  type ThermalRegimeId,
  type TissueMatrixId,
} from '../data/paleomolecularData';
import { getTaxonImage, INSTITUTIONAL_MEDIA } from '../data/taxonImages';
import {
  clearPendingCourseDetail,
  consumePendingCourseDetail,
} from '../data/courseNavigation';
import { scheduleInstantScrollToElement } from '../utils/scrollPosition';
import { GlossaryTermTrigger } from './GlossaryContext';
import { useLightbox } from './LightboxContext';

const PaleomolecularAnalysisPanel = lazy(() => import('./PaleomolecularAnalysisPanel'));

type MolecularTabId = 'horizonte' | 'laboratorio' | 'firmas' | 'protocolos';

const TABS: Array<{ id: MolecularTabId; label: string; cue: string }> = [
  {
    id: 'horizonte',
    label: 'Horizonte molecular y casos (12)',
    cue: 'Escala logarítmica de supervivencia de ADN frente a proteínas (1 ka – 4 Ma) y corpus verificado de hitos en África y Eurasia.',
  },
  {
    id: 'laboratorio',
    label: 'Simulador de viabilidad',
    cue: 'Evaluación interactiva del protocolo óptimo según antigüedad, régimen térmico (África tropical frente a cuevas frías) y tejido disponible.',
  },
  {
    id: 'firmas',
    label: 'Firmas diagnósticas (C→T y AMELX/Y)',
    cue: 'Lectura bioquímica de autenticación: desaminación post mortem en ADN antiguo frente a péptidos de amelogenina y desamidación en esmalte.',
  },
  {
    id: 'protocolos',
    label: 'Matriz comparada y ética',
    cue: 'Contraste sistemático entre paleogenómica y paleoproteómica, controles de sala blanca y estándares éticos de muestreo en África.',
  },
];

const SIMULATOR_PRESETS: Array<{
  label: string;
  age: AgeBracketId;
  regime: ThermalRegimeId;
  tissue: TissueMatrixId;
}> = [
  {
    label: 'Swartkrans (~2,0 Ma · África Austral)',
    age: '450k_2500k',
    regime: 'tropical_africa',
    tissue: 'enamel',
  },
  {
    label: 'Taforalt / Shum Laka (<15 ka · África)',
    age: 'lt15k',
    regime: 'tropical_africa',
    tissue: 'petrous',
  },
  {
    label: 'Sima de los Huesos (~430 ka · Cueva fría)',
    age: '100k_450k',
    regime: 'cold',
    tissue: 'petrous',
  },
  {
    label: 'Cueva de Denisova (Sedimento · ~80 ka)',
    age: '15k_100k',
    regime: 'cold',
    tissue: 'sediment',
  },
];

const LOG_MIN = Math.log10(1); // 1 ka
const LOG_MAX = Math.log10(4500); // 4.5 Ma

function kaToLogX(ka: number, xStart: number, width: number): number {
  const clamped = Math.max(1, Math.min(4500, ka));
  const ratio = (Math.log10(clamped) - LOG_MIN) / (LOG_MAX - LOG_MIN);
  return xStart + ratio * width;
}

export function PaleomolecularModule() {
  const { openSingle } = useLightbox();
  const [activeTab, setActiveTab] = useState<MolecularTabId>('horizonte');
  const [disciplineFilter, setDisciplineFilter] = useState<'todos' | MolecularDiscipline>('todos');
  const [shouldMount3D, setShouldMount3D] = useState<boolean>(
    () =>
      typeof window !== 'undefined' &&
      (typeof IntersectionObserver === 'undefined' ||
        window.location.hash === '#sec-paleomolecular-3d')
  );
  const tabButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const viewerHostRef = useRef<HTMLDivElement | null>(null);
  const workspaceTopRef = useRef<HTMLDivElement | null>(null);

  const handleSelectTab = (tabId: MolecularTabId) => {
    setActiveTab(tabId);
    scheduleInstantScrollToElement(() => workspaceTopRef.current, {
      onlyIfAbove: true,
    });
  };

  useEffect(() => {
    const pending = consumePendingCourseDetail('paleomolecular');
    if (pending && TABS.some((t) => t.id === pending.tab)) {
      setActiveTab(pending.tab);
    }

    const onOpenTab = (event: Event) => {
      const tab = (event as CustomEvent<MolecularTabId>).detail;
      if (TABS.some((t) => t.id === tab)) {
        clearPendingCourseDetail('paleomolecular');
        setActiveTab(tab);
      }
    };
    const onHashChange = () => {
      if (window.location.hash === '#sec-paleomolecular-3d') {
        setShouldMount3D(true);
      }
    };
    window.addEventListener('ulpgc:open-paleomolecular-tab', onOpenTab);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('ulpgc:open-paleomolecular-tab', onOpenTab);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  useEffect(() => {
    if (shouldMount3D) return;
    const host = viewerHostRef.current;
    if (!host || typeof IntersectionObserver === 'undefined') {
      setShouldMount3D(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldMount3D(true);
          observer.disconnect();
        }
      },
      { rootMargin: '360px 0px' }
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, [shouldMount3D]);
  const [onlyAfrica, setOnlyAfrica] = useState(false);

  // Interactive simulator state
  const [simAge, setSimAge] = useState<AgeBracketId>('450k_2500k');
  const [simRegime, setSimRegime] = useState<ThermalRegimeId>('tropical_africa');
  const [simTissue, setSimTissue] = useState<TissueMatrixId>('enamel');

  // Interactive diagnostic signature inspector state
  const [signalMode, setSignalMode] = useState<MolecularDiscipline>('paleoproteomica');
  const [sexSample, setSexSample] = useState<'xy' | 'xx'>('xy');

  const activeTabMeta = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  const filteredCases = useMemo(() => {
    return MOLECULAR_CASE_STUDIES.filter((c) => {
      if (disciplineFilter !== 'todos' && c.discipline !== disciplineFilter) return false;
      if (onlyAfrica && !c.isAfrica) return false;
      return true;
    });
  }, [disciplineFilter, onlyAfrica]);

  const simResult = useMemo(
    () => evaluateMolecularStrategy(simAge, simRegime, simTissue),
    [simAge, simRegime, simTissue]
  );

  const africaCasesCount = MOLECULAR_CASE_STUDIES.filter((c) => c.isAfrica).length;
  const proteoCount = MOLECULAR_CASE_STUDIES.filter(
    (c) => c.discipline === 'paleoproteomica'
  ).length;
  const genoCount = MOLECULAR_CASE_STUDIES.length - proteoCount;

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight') {
      nextIdx = (idx + 1) % TABS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIdx = (idx - 1 + TABS.length) % TABS.length;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = TABS.length - 1;
    }
    if (nextIdx === null) return;
    e.preventDefault();
    setActiveTab(TABS[nextIdx].id);
    tabButtonRefs.current[nextIdx]?.focus();
  };

  return (
    <section className="pt-12 border-t border-hairline flex flex-col gap-7">
      {/* Editorial Section Masthead */}
      <div className="flex flex-col gap-3">
        <div className="font-mono text-xs tracking-wide text-lapis">
          Aparato biomolecular · Paleoproteómica y Paleogenómica humana (África y Eurasia)
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight tracking-tight text-ink max-w-4xl [text-wrap:balance]">
          Paleoproteómica y paleogenómica: cuando los genes y las proteínas escriben la historia
          profunda
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-ink-muted max-w-4xl">
          En África, el calor acelera la degradación del{' '}
          <GlossaryTermTrigger termId="adn-antiguo" tone="lapis">
            ADN antiguo
          </GlossaryTermTrigger>{' '}
          y restringe hoy los genomas humanos recuperados desde{' '}
          <GlossaryTermTrigger termId="hueso-petroso" tone="lapis">
            hueso petroso
          </GlossaryTermTrigger>{' '}
          a los últimos ~15.000 años. La{' '}
          <GlossaryTermTrigger termId="paleoproteomica" tone="ochre">
            paleoproteómica
          </GlossaryTermTrigger>{' '}
          del esmalte dental rompe esa barrera térmica y abre el análisis molecular de homininos
          africanos hasta hace 2–3,5 millones de años.
        </p>
      </div>

      {/* 4-Column Quantitative Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="border-t border-rule pt-3 flex flex-col gap-1">
          <span className="font-mono text-[11px] text-ink-muted">ADN antiguo en África</span>
          <span className="font-mono text-2xl font-medium tabular-nums text-lapis">~15 ka</span>
          <span className="font-mono text-xs text-ink-muted">
            Taforalt (Magreb) · ~8 ka en trópico (Shum Laka)
          </span>
        </div>

        <div className="border-t border-rule pt-3 flex flex-col gap-1">
          <span className="font-mono text-[11px] text-ink-muted">ADN homínino en cueva fría</span>
          <span className="font-mono text-2xl font-medium tabular-nums text-lapis">~430 ka</span>
          <span className="font-mono text-xs text-ink-muted">
            Sima de los Huesos (Atapuerca · 10 °C constantes)
          </span>
        </div>

        <div className="border-t border-rule pt-3 flex flex-col gap-1">
          <span className="font-mono text-[11px] text-ink-muted">
            Proteoma de esmalte africano
          </span>
          <span className="font-mono text-2xl font-medium tabular-nums text-ochre">
            ~2,0–3,5 Ma
          </span>
          <span className="font-mono text-xs text-ochre">
            Paranthropus robustus y Australopithecus
          </span>
        </div>

        <div className="border-t border-rule pt-3 flex flex-col gap-1">
          <span className="font-mono text-[11px] text-ink-muted">Corpus molecular verificado</span>
          <span className="font-mono text-2xl font-medium tabular-nums text-ink">
            {MOLECULAR_CASE_STUDIES.length} hitos
          </span>
          <span className="font-mono text-xs text-ink-muted tabular-nums">
            {africaCasesCount} africanos · {genoCount} ADN · {proteoCount} proteómica
          </span>
        </div>
      </div>

      {/* Tabbed Analytical Workspace */}
      <div
        ref={workspaceTopRef}
        tabIndex={-1}
        className="py-6 border-t border-rule border-b border-b-hairline flex flex-col gap-6 focus:outline-none"
      >
        <div className="flex flex-col gap-3 pb-4 border-b border-hairline">
          <div
            className="flex flex-wrap gap-1.5"
            role="tablist"
            aria-label="Vistas del aparato de paleoproteómica y paleogenómica"
          >
            {TABS.map((tab, idx) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabButtonRefs.current[idx] = el;
                  }}
                  id={`molecular-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  aria-selected={isActive}
                  aria-controls={`molecular-panel-${tab.id}`}
                  onClick={() => handleSelectTab(tab.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-ink text-white border-ink'
                      : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink hover:bg-paper'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
            <a
              href="#sec-paleomolecular-3d"
              onClick={() => setShouldMount3D(true)}
              className="min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded border border-lapis/40 bg-paper text-lapis hover:border-lapis hover:bg-canvas transition-colors duration-150 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 sm:ml-auto"
            >
              <Box className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Visor 3D molecular ↓</span>
            </a>
          </div>
          <p className="text-sm leading-relaxed text-ink-muted max-w-[70ch] m-0">
            <span className="font-mono text-xs font-medium text-ink mr-1.5">Guía de la vista ·</span>
            {activeTabMeta.cue}
          </p>
        </div>

        {/* TAB 1: HORIZONTE MOLECULAR Y CASOS CLAVE */}
        {activeTab === 'horizonte' && (
          <div
            id="molecular-panel-horizonte"
            role="tabpanel"
            aria-labelledby="molecular-tab-horizonte"
            className="flex flex-col gap-8"
          >
            {/* Logarithmic Preservation Horizon SVG */}
            <div className="bg-paper border-t border-b border-hairline p-5 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-ink">
                    Horizonte temporal de preservación biomolecular (escala logarítmica 1 ka – 4 Ma)
                  </h3>
                  <p className="font-mono text-xs text-ink-muted mt-0.5">
                    Barra sólida: alcance confirmado en África cálida/tropical · Barra atenuada:
                    alcance máximo en cuevas frías o permafrost
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <svg
                  viewBox="0 0 760 245"
                  className="w-full min-w-[600px] h-auto block"
                  role="img"
                  aria-label="Comparación logarítmica del alcance temporal de ADN nuclear, ADN mitocondrial y sedimentario, colágeno ZooMS y proteoma de esmalte dental"
                >
                  {/* Logarithmic vertical grid lines */}
                  {[
                    { ka: 1, label: '1 ka' },
                    { ka: 10, label: '10 ka' },
                    { ka: 100, label: '100 ka' },
                    { ka: 500, label: '500 ka' },
                    { ka: 1000, label: '1 Ma' },
                    { ka: 3500, label: '3,5 Ma' },
                  ].map((tick) => {
                    const x = kaToLogX(tick.ka, 235, 495);
                    return (
                      <g key={tick.ka}>
                        <line
                          x1={x}
                          y1={26}
                          x2={x}
                          y2={206}
                          stroke="#e2e2dc"
                          strokeWidth={1}
                          strokeDasharray="2 3"
                        />
                        <text
                          x={x}
                          y={16}
                          textAnchor="middle"
                          className="font-mono"
                          fontSize={10.5}
                          fill="#575753"
                        >
                          {tick.label}
                        </text>
                      </g>
                    );
                  })}

                  <line x1={235} y1={26} x2={235} y2={206} stroke="#121212" strokeWidth={1.2} />

                  {MOLECULAR_PRESERVATION_BANDS.map((band, idx) => {
                    const y = 42 + idx * 42;
                    const xStart = 235;
                    const plotW = 495;
                    const coldEndX = kaToLogX(band.coldMaxKa, xStart, plotW);
                    const africaEndX = kaToLogX(band.tropicalAfricaMaxKa, xStart, plotW);

                    return (
                      <g key={band.id}>
                        <text
                          x={224}
                          y={y + 8}
                          textAnchor="end"
                          className="font-sans"
                          fontSize={11.5}
                          fontWeight={600}
                          fill="#121212"
                        >
                          {band.name}
                        </text>
                        <text
                          x={224}
                          y={y + 22}
                          textAnchor="end"
                          className="font-mono"
                          fontSize={9.5}
                          fill="#575753"
                        >
                          {band.discipline === 'paleogenomica' ? 'Paleogenómica' : 'Paleoproteómica'}
                        </text>

                        {/* Track */}
                        <rect x={xStart} y={y} width={plotW} height={18} fill="#eeede8" />

                        {/* Cold / maximum reach */}
                        <rect
                          x={xStart}
                          y={y}
                          width={Math.max(4, coldEndX - xStart)}
                          height={18}
                          fill={band.color}
                          fillOpacity={0.28}
                        />

                        {/* African warm/tropical reach */}
                        <rect
                          x={xStart}
                          y={y}
                          width={Math.max(4, africaEndX - xStart)}
                          height={18}
                          fill={band.color}
                        />

                        {/* Africa boundary marker */}
                        <line
                          x1={africaEndX}
                          y1={y - 2}
                          x2={africaEndX}
                          y2={y + 20}
                          stroke="#121212"
                          strokeWidth={1.2}
                        />

                        {/* Cold ceiling label */}
                        <text
                          x={Math.min(752, coldEndX + 6)}
                          y={y + 13}
                          className="font-mono"
                          fontSize={9.5}
                          fill="#3a3a37"
                        >
                          {band.coldMaxKa >= 1000
                            ? `${(band.coldMaxKa / 1000).toFixed(1).replace('.', ',')} Ma`
                            : `${band.coldMaxKa} ka`}
                        </text>
                      </g>
                    );
                  })}

                  {/* Landmark callouts along bottom axis */}
                  {[
                    { ka: 15, label: 'Taforalt (15 ka)', color: '#1f5fa8' },
                    { ka: 430, label: 'Sima Huesos (430 ka)', color: '#1f5fa8' },
                    { ka: 2000, label: 'P. robustus (2 Ma)', color: '#b43c0b' },
                  ].map((pt) => {
                    const x = kaToLogX(pt.ka, 235, 495);
                    return (
                      <g key={pt.label}>
                        <circle cx={x} cy={214} r={3.5} fill={pt.color} />
                        <text
                          x={x}
                          y={232}
                          textAnchor="middle"
                          className="font-mono"
                          fontSize={9.5}
                          fill={pt.color}
                        >
                          {pt.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-hairline text-xs">
                {MOLECULAR_PRESERVATION_BANDS.map((b) => (
                  <div key={b.id} className="flex flex-col gap-1">
                    <span className="font-mono text-[11px] font-semibold" style={{ color: b.color }}>
                      {b.name}
                    </span>
                    <span className="text-ink leading-snug">{b.africaRangeLabel}</span>
                    <span className="text-ink-muted leading-snug">{b.keyMechanism}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filterable Case Studies Corpus */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrar casos moleculares">
                  {(
                    [
                      { id: 'todos', label: `Todos los hitos (${MOLECULAR_CASE_STUDIES.length})` },
                      { id: 'paleogenomica', label: `Paleogenómica (${genoCount})` },
                      { id: 'paleoproteomica', label: `Paleoproteómica (${proteoCount})` },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDisciplineFilter(opt.id)}
                      aria-pressed={disciplineFilter === opt.id}
                      className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        disciplineFilter === opt.id
                          ? opt.id === 'paleoproteomica'
                            ? 'bg-ochre text-white border-ochre'
                            : opt.id === 'paleogenomica'
                              ? 'bg-lapis text-white border-lapis'
                              : 'bg-ink text-white border-ink'
                          : 'bg-canvas text-ink border-hairline hover:border-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-xs text-ink cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={onlyAfrica}
                      onChange={(e) => setOnlyAfrica(e.target.checked)}
                      className="accent-ochre w-4 h-4"
                    />
                    <span>Solo yacimientos africanos ({africaCasesCount})</span>
                  </label>
                  <span className="font-mono text-xs text-ink-muted tabular-nums">
                    Mostrando {filteredCases.length} de {MOLECULAR_CASE_STUDIES.length}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCases.map((item) => {
                  const img = getTaxonImage(item.taxonId, item.clado);
                  const isProteo = item.discipline === 'paleoproteomica';

                  return (
                    <article
                      key={item.id}
                      className="bg-canvas border border-hairline border-t-2 p-5 flex flex-col justify-between gap-4 hover:border-ink transition-colors duration-150"
                      style={{ borderTopColor: isProteo ? '#b43c0b' : '#1f5fa8' }}
                    >
                      <div className="flex flex-col gap-2.5">
                        <figure className="m-0 flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={(e) =>
                              openSingle(
                                {
                                  src: img.src,
                                  alt: img.alt,
                                  title: item.title,
                                  subtitle: `${item.site} · ${item.ageLabel} · ${item.technique}`,
                                  caption: `${item.specimenLabel}. ${item.finding}`,
                                  credit: img.credito,
                                  license: img.licencia,
                                  licenseUrl: img.licenciaUrl,
                                  sourceUrl: `https://doi.org/${item.doi}`,
                                },
                                e.currentTarget
                              )
                            }
                            aria-label={`Ampliar imagen asociada a ${item.title}`}
                            className="group relative w-full aspect-[16/10] bg-[#eeede8] border border-hairline hover:border-ink overflow-hidden flex items-center justify-center p-1.5 cursor-zoom-in transition-colors"
                          >
                            <img
                              src={img.src}
                              alt={img.alt}
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (target.src !== INSTITUTIONAL_MEDIA.smithsonianCrania) {
                                  target.src = INSTITUTIONAL_MEDIA.smithsonianCrania;
                                }
                              }}
                              className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                            />
                            <span
                              aria-hidden="true"
                              className="no-print absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-[#121212]/80 text-white font-mono text-[10px] inline-flex items-center gap-1 opacity-90 group-hover:opacity-100"
                            >
                              <Maximize2 className="w-2.5 h-2.5" />
                              <span>Ampliar</span>
                            </span>
                          </button>
                          <figcaption className="font-mono text-[10px] text-ink-subtle truncate">
                            {item.specimenLabel}
                          </figcaption>
                        </figure>

                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-mono text-[11px] text-ink-muted">
                          <span
                            className={`font-medium ${isProteo ? 'text-ochre' : 'text-lapis'}`}
                          >
                            {isProteo ? 'Paleoproteómica' : 'Paleogenómica'}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums text-ink font-medium">{item.ageLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.region}</span>
                        </div>

                        <h4 className="font-display text-lg font-semibold text-ink leading-snug">
                          {item.title}
                        </h4>

                        <p className="text-sm leading-relaxed text-ink">{item.finding}</p>
                      </div>

                      <dl className="pt-3 border-t border-hairline flex flex-col gap-2 text-xs m-0">
                        <div>
                          <dt className="font-mono text-[10.5px] text-ink-muted">
                            Técnica y matriz
                          </dt>
                          <dd className="text-ink font-medium m-0 leading-snug">{item.technique}</dd>
                        </div>
                        <div className="pt-1.5 border-t border-hairline">
                          <dt className="font-mono text-[10.5px] text-forest">
                            Relevancia evolutiva
                          </dt>
                          <dd className="text-ink-muted m-0 leading-snug">{item.significance}</dd>
                        </div>
                        <div className="pt-1.5 border-t border-hairline">
                          <dt className="font-mono text-[10.5px] text-ochre">Límite y cautela</dt>
                          <dd className="text-ink-muted m-0 leading-snug">{item.limitNote}</dd>
                        </div>
                        <div className="pt-1.5 border-t border-hairline flex items-center justify-between gap-2">
                          <span className="font-mono text-[10.5px] text-ink-muted truncate">
                            {item.citation.split('(')[0].trim()} (
                            {item.citation.match(/\d{4}/)?.[0]})
                          </span>
                          <a
                            href={`https://doi.org/${item.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-lapis hover:underline whitespace-nowrap shrink-0"
                          >
                            <span>DOI</span>
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                        </div>
                      </dl>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SIMULADOR DE VIABILIDAD MOLECULAR */}
        {activeTab === 'laboratorio' && (
          <div
            id="molecular-panel-laboratorio"
            role="tabpanel"
            aria-labelledby="molecular-tab-laboratorio"
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2 max-w-3xl">
              <div className="font-mono text-xs text-ochre inline-flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Laboratorio de decisión biomolecular · Edad térmica y matriz fósil</span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-ink">
                ¿Qué técnica biomolecular es viable en este yacimiento?
              </h3>
              <p className="text-sm leading-relaxed text-ink-muted">
                Combine antigüedad, clima del depósito y tejido disponible para estimar la
                viabilidad relativa de la paleogenómica (
                <GlossaryTermTrigger termId="adn-antiguo" tone="lapis">
                  aDNA
                </GlossaryTermTrigger>
                ,{' '}
                <GlossaryTermTrigger termId="adn-sedimentario" tone="lapis">
                  sedaDNA
                </GlossaryTermTrigger>
                ) frente a la paleoproteómica (
                <GlossaryTermTrigger termId="zooms" tone="ochre">
                  ZooMS
                </GlossaryTermTrigger>{' '}
                y proteoma de esmalte).
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] text-ink-muted mr-1">
                Escenarios reales de referencia:
              </span>
              {SIMULATOR_PRESETS.map((pr) => {
                const isActive =
                  simAge === pr.age && simRegime === pr.regime && simTissue === pr.tissue;
                return (
                  <button
                    key={pr.label}
                    type="button"
                    onClick={() => {
                      setSimAge(pr.age);
                      setSimRegime(pr.regime);
                      setSimTissue(pr.tissue);
                    }}
                    className={`min-h-[34px] px-3 py-1 text-xs rounded border transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-ink text-white border-ink'
                        : 'bg-canvas text-ink border-hairline hover:border-ink'
                    }`}
                  >
                    {pr.label}
                  </button>
                );
              })}
            </div>

            {/* 3 Controls Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-paper border-t border-b border-hairline p-5">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs font-medium text-ink">
                  1. Antigüedad estimada
                </span>
                <div className="flex flex-col gap-1.5" role="group" aria-label="Antigüedad estimada">
                  {(
                    [
                      { id: 'lt15k', label: '< 15 ka (Holoceno / Pleistoceno Final)' },
                      { id: '15k_100k', label: '15 – 100 ka (Pleistoceno Superior)' },
                      { id: '100k_450k', label: '100 – 450 ka (Pleistoceno Medio)' },
                      { id: '450k_2500k', label: '450 ka – 2,5 Ma (Pleistoceno Inferior)' },
                      { id: 'gt2500k', label: '> 2,5 Ma (Plioceno tardío)' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSimAge(opt.id)}
                      aria-pressed={simAge === opt.id}
                      className={`min-h-[36px] px-3 py-1.5 text-left text-xs rounded border transition-colors cursor-pointer ${
                        simAge === opt.id
                          ? 'bg-ink text-white border-ink font-medium'
                          : 'bg-canvas text-ink border-hairline hover:border-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs font-medium text-ink">
                  2. Régimen térmico del yacimiento
                </span>
                <div className="flex flex-col gap-1.5" role="group" aria-label="Régimen térmico">
                  {(
                    [
                      {
                        id: 'tropical_africa',
                        label: 'África tropical / sabana / karst cálido',
                        sub: 'Alta velocidad de hidrólisis térmica',
                      },
                      {
                        id: 'temperate',
                        label: 'Cueva templada / karst mediterráneo',
                        sub: 'Preservación intermedia y heterogénea',
                      },
                      {
                        id: 'cold',
                        label: 'Cueva fría constante (~10 °C) / permafrost',
                        sub: 'Degradación química muy ralentizada',
                      },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSimRegime(opt.id)}
                      aria-pressed={simRegime === opt.id}
                      className={`min-h-[54px] px-3 py-2 text-left rounded border transition-colors cursor-pointer flex flex-col gap-0.5 ${
                        simRegime === opt.id
                          ? 'bg-ochre text-white border-ochre'
                          : 'bg-canvas text-ink border-hairline hover:border-ink'
                      }`}
                    >
                      <span className="text-xs font-medium">{opt.label}</span>
                      <span
                        className={`font-mono text-[10.5px] ${
                          simRegime === opt.id ? 'text-white/85' : 'text-ink-muted'
                        }`}
                      >
                        {opt.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs font-medium text-ink">
                  3. Tejido o matriz disponible
                </span>
                <div className="flex flex-col gap-1.5" role="group" aria-label="Tejido disponible">
                  {(
                    [
                      { id: 'enamel', label: 'Esmalte dental mineralizado' },
                      { id: 'petrous', label: 'Hueso petroso / cemento radicular' },
                      { id: 'cortical_bone', label: 'Hueso cortical / astilla sin rasgos' },
                      { id: 'sediment', label: 'Sedimento estratificado de cueva' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSimTissue(opt.id)}
                      aria-pressed={simTissue === opt.id}
                      className={`min-h-[40px] px-3 py-1.5 text-left text-xs rounded border transition-colors cursor-pointer ${
                        simTissue === opt.id
                          ? 'bg-lapis text-white border-lapis font-medium'
                          : 'bg-canvas text-ink border-hairline hover:border-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulator Results Output */}
            <div className="bg-canvas border border-hairline border-t-2 border-t-rule p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs text-forest font-medium">
                  Dictamen de estrategia biomolecular
                </span>
                <h4 className="font-display text-xl font-semibold text-ink leading-snug">
                  {simResult.summary}
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {simResult.methods.map((m) => {
                  const isRec = m.id === simResult.recommendedId && m.viabilityPct >= 35;
                  const barTone =
                    m.viabilityPct >= 65
                      ? 'bg-forest'
                      : m.viabilityPct >= 35
                        ? 'bg-lapis'
                        : m.viabilityPct >= 12
                          ? 'bg-ochre'
                          : 'bg-ink-subtle';

                  return (
                    <div
                      key={m.id}
                      className={`p-4 border flex flex-col gap-2.5 ${
                        isRec ? 'border-ink bg-paper' : 'border-hairline bg-canvas'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-display text-base font-semibold text-ink">
                          {m.label}
                        </span>
                        <span className="font-mono text-xs font-semibold tabular-nums text-ink">
                          {m.viabilityPct} % · {m.status}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-surface-high overflow-hidden" aria-hidden="true">
                        <span
                          className={`block h-full transition-all duration-200 ${barTone}`}
                          style={{ width: `${m.viabilityPct}%` }}
                        />
                      </div>
                      <p className="text-sm leading-relaxed text-ink-muted m-0">{m.rationale}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-hairline text-xs">
                <div className="flex flex-col gap-1">
                  <span className="font-mono font-medium text-ink">
                    Mecanismo diagenético y térmico
                  </span>
                  <p className="text-ink-muted leading-relaxed m-0">{simResult.diagenesisNote}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono font-medium text-ochre">
                    Control de calidad y cautela metodológica
                  </span>
                  <p className="text-ink-muted leading-relaxed m-0">{simResult.cautionNote}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FIRMAS DIAGNÓSTICAS (C→T Y AMELX/AMELY) */}
        {activeTab === 'firmas' && (
          <div
            id="molecular-panel-firmas"
            role="tabpanel"
            aria-labelledby="molecular-tab-firmas"
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-1.5 max-w-2xl">
                <div className="font-mono text-xs text-lapis inline-flex items-center gap-1.5">
                  <Microscope className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Lectura de señales bioquímicas y autenticación</span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-ink">
                  Cómo sabemos que una molécula es antigua y qué información codifica
                </h3>
              </div>

              <div
                className="flex flex-wrap gap-1.5"
                role="group"
                aria-label="Seleccionar modo de firma molecular"
              >
                <button
                  type="button"
                  onClick={() => setSignalMode('paleoproteomica')}
                  aria-pressed={signalMode === 'paleoproteomica'}
                  className={`min-h-[38px] px-3.5 py-1.5 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                    signalMode === 'paleoproteomica'
                      ? 'bg-ochre text-white border-ochre'
                      : 'bg-canvas text-ink border-hairline hover:border-ink'
                  }`}
                >
                  Esmalte: AMELX / AMELY
                </button>
                <button
                  type="button"
                  onClick={() => setSignalMode('paleogenomica')}
                  aria-pressed={signalMode === 'paleogenomica'}
                  className={`min-h-[38px] px-3.5 py-1.5 text-xs font-semibold rounded border transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                    signalMode === 'paleogenomica'
                      ? 'bg-lapis text-white border-lapis'
                      : 'bg-canvas text-ink border-hairline hover:border-ink'
                  }`}
                >
                  <Dna className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>ADN antiguo: Daño C→T</span>
                </button>
              </div>
            </div>

            {signalMode === 'paleoproteomica' ? (
              <div className="bg-paper border-t border-b border-hairline p-5 flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-display text-lg font-semibold text-ink">
                      Determinación cromosómica del sexo por{' '}
                      <GlossaryTermTrigger termId="amelogenina" tone="ochre">
                        amelogenina (AMELX / AMELY)
                      </GlossaryTermTrigger>
                    </h4>
                    <p className="font-mono text-[11px] text-ink-muted">
                      Simulación didáctica de intensidad peptídica en espectrometría LC-MS/MS de
                      esmalte fósil (modelo Swartkrans / Sterkfontein)
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5" role="group" aria-label="Elegir perfil cromosómico simulado">
                    <button
                      type="button"
                      onClick={() => setSexSample('xy')}
                      aria-pressed={sexSample === 'xy'}
                      className={`min-h-[34px] px-3 py-1 font-mono text-xs rounded border cursor-pointer ${
                        sexSample === 'xy'
                          ? 'bg-ink text-white border-ink'
                          : 'bg-canvas text-ink border-hairline hover:border-ink'
                      }`}
                    >
                      Espécimen XY (masculino)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSexSample('xx')}
                      aria-pressed={sexSample === 'xx'}
                      className={`min-h-[34px] px-3 py-1 font-mono text-xs rounded border cursor-pointer ${
                        sexSample === 'xx'
                          ? 'bg-ink text-white border-ink'
                          : 'bg-canvas text-ink border-hairline hover:border-ink'
                      }`}
                    >
                      Espécimen XX (femenino)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 bg-canvas border border-hairline p-4">
                    <svg
                      viewBox="0 0 540 190"
                      className="w-full h-auto block"
                      role="img"
                      aria-label={`Espectro simplificado de péptidos AMELX y AMELY para un individuo ${sexSample.toUpperCase()}`}
                    >
                      {/* Axes */}
                      <line x1={48} y1={150} x2={516} y2={150} stroke="#121212" strokeWidth={1.2} />
                      <line x1={48} y1={22} x2={48} y2={150} stroke="#121212" strokeWidth={1.2} />
                      <text x={282} y={178} textAnchor="middle" className="font-mono" fontSize={10} fill="#575753">
                        Relación masa / carga (m/z) · Péptidos diagnósticos del esmalte
                      </text>
                      <text
                        x={16}
                        y={88}
                        textAnchor="middle"
                        transform="rotate(-90 16 88)"
                        className="font-mono"
                        fontSize={10}
                        fill="#575753"
                      >
                        Intensidad relativa
                      </text>

                      {/* Background enamel structural peaks (ENAM / AMBN) */}
                      {[
                        { x: 110, h: 68, lbl: 'ENAM' },
                        { x: 350, h: 52, lbl: 'AMBN' },
                        { x: 455, h: 40, lbl: 'MMP20' },
                      ].map((pk) => (
                        <g key={pk.lbl}>
                          <line
                            x1={pk.x}
                            y1={150}
                            x2={pk.x}
                            y2={150 - pk.h}
                            stroke="#8a8a84"
                            strokeWidth={4}
                          />
                          <text
                            x={pk.x}
                            y={144 - pk.h}
                            textAnchor="middle"
                            className="font-mono"
                            fontSize={9.5}
                            fill="#575753"
                          >
                            {pk.lbl}
                          </text>
                        </g>
                      ))}

                      {/* AMELX peak (always present in XX and XY) */}
                      <line
                        x1={205}
                        y1={150}
                        x2={205}
                        y2={sexSample === 'xx' ? 36 : 48}
                        stroke="#1f5fa8"
                        strokeWidth={7}
                      />
                      <text
                        x={205}
                        y={sexSample === 'xx' ? 28 : 40}
                        textAnchor="middle"
                        className="font-mono"
                        fontSize={10.5}
                        fontWeight={600}
                        fill="#1f5fa8"
                      >
                        AMELX (SIRPPYPSY)
                      </text>

                      {/* AMELY peak (only in XY) */}
                      {sexSample === 'xy' ? (
                        <g>
                          <line x1={275} y1={150} x2={275} y2={62} stroke="#b43c0b" strokeWidth={7} />
                          <text
                            x={275}
                            y={54}
                            textAnchor="middle"
                            className="font-mono"
                            fontSize={10.5}
                            fontWeight={600}
                            fill="#b43c0b"
                          >
                            AMELY (SMIRPPY)
                          </text>
                        </g>
                      ) : (
                        <g>
                          <line
                            x1={275}
                            y1={150}
                            x2={275}
                            y2={145}
                            stroke="#b43c0b"
                            strokeWidth={2}
                            strokeDasharray="2 2"
                          />
                          <text
                            x={275}
                            y={136}
                            textAnchor="middle"
                            className="font-mono"
                            fontSize={9.5}
                            fill="#73736e"
                          >
                            AMELY ausente (0)
                          </text>
                        </g>
                      )}
                    </svg>
                  </div>

                  <div className="lg:col-span-5 flex flex-col gap-3 text-xs leading-relaxed">
                    <div className="font-mono text-[11px] font-semibold text-ochre">
                      Interpretación bioquímica ({sexSample === 'xy' ? 'Perfil XY' : 'Perfil XX'})
                    </div>
                    {sexSample === 'xy' ? (
                      <p className="text-ink m-0">
                        La detección simultánea de péptidos exclusivos de <strong>AMELY</strong>{' '}
                        (cromosoma Y, p. ej. el péptido con metionina <code>SMIRPPY</code>) y de{' '}
                        <strong>AMELX</strong> (cromosoma X, <code>SIRPPYPSY</code>) confirma de
                        forma directa un individuo cromosómicamente masculino (XY), incluso en
                        molares aislados o individuos juveniles sin pelvis conservada.
                      </p>
                    ) : (
                      <p className="text-ink m-0">
                        La presencia abundante de <strong>AMELX</strong> acompañada de ausencia total
                        de <strong>AMELY</strong> apunta a un individuo cromosómicamente femenino (XX).
                        Sin embargo, el protocolo exige verificar una intensidad mínima de AMELX para
                        descartar falsos negativos por baja conservación peptídica.
                      </p>
                    )}
                    <p className="text-ink-muted m-0 pt-2 border-t border-hairline">
                      Este principio permitió en 2025 asignar sexo cromosómico a cuatro ejemplares de{' '}
                      <em>Paranthropus robustus</em> de Swartkrans (SK 830, SK 835, SK 850 y SK
                      14132, ~2,0 Ma) y al espécimen Sts 63 de <em>Australopithecus africanus</em> en
                      Sterkfontein, demostrando que el tamaño dental por sí solo puede inducir a
                      error.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-paper border-t border-b border-hairline p-5 flex flex-col gap-5">
                <div>
                  <h4 className="font-display text-lg font-semibold text-ink">
                    Curva de autenticación por{' '}
                    <GlossaryTermTrigger termId="desaminacion-adn" tone="lapis">
                      desaminación post mortem (C→T)
                    </GlossaryTermTrigger>{' '}
                    en extremos 5&apos;
                  </h4>
                  <p className="font-mono text-[11px] text-ink-muted">
                    Tasa típica de sustitución C→T a lo largo de las 15 primeras bases de un fragmento
                    corto: ADN antiguo auténtico (azul lapislázuli) frente a contaminación moderna
                    (gris)
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 bg-canvas border border-hairline p-4">
                    <svg
                      viewBox="0 0 540 190"
                      className="w-full h-auto block"
                      role="img"
                      aria-label="Curva de desaminación C a T en los extremos 5 prima que distingue ADN antiguo auténtico de contaminación moderna"
                    >
                      <line x1={48} y1={150} x2={510} y2={150} stroke="#121212" strokeWidth={1.2} />
                      <line x1={48} y1={22} x2={48} y2={150} stroke="#121212" strokeWidth={1.2} />

                      {/* Horizontal grid */}
                      {[0, 10, 20, 30, 40].map((pct) => {
                        const y = 150 - (pct / 40) * 120;
                        return (
                          <g key={pct}>
                            <line
                              x1={48}
                              y1={y}
                              x2={510}
                              y2={y}
                              stroke="#e8e8e4"
                              strokeWidth={1}
                              strokeDasharray="2 3"
                            />
                            <text
                              x={40}
                              y={y + 3}
                              textAnchor="end"
                              className="font-mono"
                              fontSize={9.5}
                              fill="#575753"
                            >
                              {pct}%
                            </text>
                          </g>
                        );
                      })}

                      {/* Modern contamination flat baseline (~0.5%) */}
                      <path
                        d="M 60 148 L 500 148"
                        fill="none"
                        stroke="#8a8a84"
                        strokeWidth={2}
                        strokeDasharray="5 4"
                      />
                      <text x={355} y={140} className="font-mono" fontSize={9.5} fill="#575753">
                        ADN moderno / contaminación (&lt;1 %)
                      </text>

                      {/* Ancient DNA exponential 5' C->T deamination curve */}
                      <path
                        d="M 60 44 C 82 94, 118 124, 175 137 C 250 145, 360 146, 500 147"
                        fill="none"
                        stroke="#1f5fa8"
                        strokeWidth={2.8}
                      />
                      <circle cx={60} cy={44} r={4} fill="#1f5fa8" />
                      <circle cx={92} cy={104} r={3} fill="#1f5fa8" />
                      <circle cx={140} cy={131} r={3} fill="#1f5fa8" />
                      <text
                        x={72}
                        y={40}
                        className="font-mono"
                        fontSize={10}
                        fontWeight={600}
                        fill="#1f5fa8"
                      >
                        ADN antiguo auténtico (35 % en pos. 1)
                      </text>

                      {/* X-axis labels */}
                      {[1, 3, 5, 10, 15].map((pos) => {
                        const x = 60 + ((pos - 1) / 14) * 440;
                        return (
                          <text
                            key={pos}
                            x={x}
                            y={166}
                            textAnchor="middle"
                            className="font-mono"
                            fontSize={9.5}
                            fill="#575753"
                          >
                            {pos} pb
                          </text>
                        );
                      })}
                      <text
                        x={280}
                        y={184}
                        textAnchor="middle"
                        className="font-mono"
                        fontSize={9.5}
                        fill="#575753"
                      >
                        Distancia desde el extremo 5&apos; del fragmento secuenciado
                      </text>
                    </svg>
                  </div>

                  <div className="lg:col-span-5 flex flex-col gap-3 text-xs leading-relaxed">
                    <div className="font-mono text-[11px] font-semibold text-lapis">
                      Por qué el «daño» valida el hallazgo
                    </div>
                    <p className="text-ink m-0">
                      Paradójicamente, la degradación química es la mejor garantía de autenticidad en
                      paleogenómica. Cuando las cadenas rotas de ADN antiguo quedan con extremos
                      monocatenarios expuestos, la citosina pierde su grupo amino y se lee como timina
                      (<strong>C→T</strong>).
                    </p>
                    <p className="text-ink-muted m-0 pt-2 border-t border-hairline">
                      Una vez autenticado, el análisis de bloques compartidos permite rastrear tanto
                      el mestizaje neandertal/denisovano fuera de África como los{' '}
                      <GlossaryTermTrigger termId="linaje-fantasma" tone="lapis">
                        linajes fantasma
                      </GlossaryTermTrigger>{' '}
                      y la estructura poblacional panafricana (Taforalt, Shum Laka, Ballito Bay y
                      Takarkori).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3 Diagnostic Marker Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {DIAGNOSTIC_MARKERS[signalMode].map((mk) => (
                <article
                  key={mk.id}
                  className="bg-canvas border border-hairline border-t-2 p-5 flex flex-col gap-2.5"
                  style={{
                    borderTopColor: signalMode === 'paleoproteomica' ? '#b43c0b' : '#1f5fa8',
                  }}
                >
                  <div className="font-mono text-[11px] text-ink-muted">
                    {mk.role} · {mk.tissue}
                  </div>
                  <h4 className="font-display text-lg font-semibold text-ink leading-snug">
                    {mk.gene}
                  </h4>
                  <p className="font-mono text-xs text-ink bg-paper border border-hairline px-3 py-2 m-0 leading-relaxed">
                    {mk.signal}
                  </p>
                  <p className="text-sm leading-relaxed text-ink-muted m-0">{mk.diagnosticNote}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MATRIZ COMPARADA, PROTOCOLOS Y ÉTICA AFRICANA */}
        {activeTab === 'protocolos' && (
          <div
            id="molecular-panel-protocolos"
            role="tabpanel"
            aria-labelledby="molecular-tab-protocolos"
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2 max-w-3xl">
              <div className="font-mono text-xs text-forest inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Epistemología molecular, control de contaminación y ética patrimonial</span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-ink">
                Paleogenómica frente a paleoproteómica: alcances complementarios
              </h3>
            </div>

            {/* Clean Editorial Comparison Table */}
            <div className="overflow-x-auto border-t border-b border-rule">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-rule bg-paper font-mono text-xs">
                    <th className="py-3 px-4 font-semibold text-ink w-[22%]">Dimensión</th>
                    <th className="py-3 px-4 font-semibold text-lapis w-[39%]">
                      Paleogenómica (ADN antiguo)
                    </th>
                    <th className="py-3 px-4 font-semibold text-ochre w-[39%]">
                      Paleoproteómica (esmalte y colágeno)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {PROTOCOL_COMPARISON_ROWS.map((row) => (
                    <tr key={row.dimension} className="align-top">
                      <th scope="row" className="py-3 px-4 font-mono text-xs font-medium text-ink">
                        {row.dimension}
                      </th>
                      <td className="py-3 px-4 text-ink-muted leading-relaxed">
                        {row.paleogenomics}
                      </td>
                      <td className="py-3 px-4 text-ink-muted leading-relaxed">
                        {row.paleoproteomics}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 3 Governance & Methodological Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <article className="bg-paper border-t-2 border-t-lapis border-b border-b-hairline p-5 flex flex-col gap-2">
                <span className="font-mono text-xs text-lapis">01 · Sala blanca</span>
                <h4 className="font-display text-lg font-semibold text-ink">
                  Control estricto de contaminación
                </h4>
                <p className="text-sm leading-relaxed text-ink-muted m-0">
                  La extracción se realiza en instalaciones de presión positiva aisladas de cualquier
                  amplificación moderna (PCR), con blancos negativos en cada lote y controles
                  bioinformáticos de daño terminal C→T o desamidación N/Q.
                </p>
              </article>

              <article className="bg-paper border-t-2 border-t-ochre border-b border-b-hairline p-5 flex flex-col gap-2">
                <span className="font-mono text-xs text-ochre">
                  02 · Preservación patrimonial
                </span>
                <h4 className="font-display text-lg font-semibold text-ink">
                  Muestreo mínimamente invasivo
                </h4>
                <p className="text-sm leading-relaxed text-ink-muted m-0">
                  Antes de perforar cualquier resto irreemplazable se exige documentación 3D y
                  micro-TC. El{' '}
                  <GlossaryTermTrigger termId="adn-sedimentario" tone="ochre">
                    ADN sedimentario
                  </GlossaryTermTrigger>
                  , el cribado{' '}
                  <GlossaryTermTrigger termId="zooms" tone="ochre">
                    ZooMS
                  </GlossaryTermTrigger>{' '}
                  y el grabado ácido superficial del esmalte reducen drásticamente el impacto sobre
                  los fósiles.
                </p>
              </article>

              <article className="bg-paper border-t-2 border-t-forest border-b border-b-hairline p-5 flex flex-col gap-2">
                <span className="font-mono text-xs text-forest">
                  03 · Gobernanza y equidad en África
                </span>
                <h4 className="font-display text-lg font-semibold text-ink">
                  Liderazgo científico africano
                </h4>
                <p className="text-sm leading-relaxed text-ink-muted m-0">
                  Los consensos actuales (Prendergast &amp; Sawchuk; directrices de museos africanos)
                  exigen colaboración paritaria con instituciones locales, repatriación de restos y
                  datos, capacitación de especialistas africanos y consulta comunitaria en contextos
                  recientes.
                </p>
              </article>
            </div>
          </div>
        )}
      </div>

      {/* Dedicated 3D Paleomolecular Structural Laboratory (deferred until viewport proximity) */}
      <div
        ref={viewerHostRef}
        id={!shouldMount3D ? 'sec-paleomolecular-3d' : undefined}
        className="pt-8 scroll-mt-20"
      >
        {shouldMount3D ? (
          <Suspense
            fallback={
              <div className="bg-paper border border-hairline border-t-2 border-t-ink p-8 text-center flex flex-col items-center gap-2">
                <span className="font-mono text-xs text-lapis font-semibold">
                  Laboratorio estructural 3D · Paleomolecular
                </span>
                <p className="font-mono text-xs text-ink-muted m-0">
                  Cargando visor paleomolecular 3D interactivo…
                </p>
              </div>
            }
          >
            <PaleomolecularAnalysisPanel />
          </Suspense>
        ) : (
          <div className="bg-paper border border-hairline border-t-2 border-t-lapis p-8 flex flex-col items-center text-center gap-3">
            <span className="font-mono text-xs text-lapis font-semibold">
              Laboratorio estructural 3D · Carga diferida bajo demanda
            </span>
            <p className="font-display text-lg font-semibold text-ink m-0">
              Visor molecular 3D (ADN antiguo y proteómica del esmalte)
            </p>
            <p className="text-xs text-ink-muted max-w-lg m-0 leading-relaxed">
              El entorno WebGL se inicializa automáticamente al acercarte a esta sección para
              optimizar memoria gráfica y batería durante la lectura del curso.
            </p>
            <button
              type="button"
              onClick={() => setShouldMount3D(true)}
              className="min-h-[40px] px-4 py-2 font-mono text-xs font-semibold bg-ink text-white border border-ink rounded hover:bg-lapis hover:border-lapis transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <Box className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Activar visor 3D ahora</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
