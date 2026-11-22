import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Compass, ShieldAlert, ZoomIn } from 'lucide-react';
import {
  CRITICAL_TIMELINE_MILESTONES,
  CRITICAL_TIMELINE_REGIONS,
  type CriticalRegionId,
  type CriticalTimelineMilestone,
  type HistoricalPlate,
} from '../data/cannibalismStereotypesData';
import type { CourseDeepAction } from '../data/courseNavigation';

interface CriticalTimelineViewProps {
  plateById: Map<string, HistoricalPlate>;
  onOpenPlate: (plate: HistoricalPlate, opener?: HTMLElement | null) => void;
  onNavigateCourse: (action: CourseDeepAction) => void;
}

const STAGGER_CLASSES = [
  'timeline-stagger-0',
  'timeline-stagger-1',
  'timeline-stagger-2',
  'timeline-stagger-3',
  'timeline-stagger-4',
  'timeline-stagger-5',
] as const;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function CriticalTimelineView({
  plateById,
  onOpenPlate,
  onNavigateCourse,
}: CriticalTimelineViewProps) {
  const [regionFilter, setRegionFilter] = useState<CriticalRegionId>('todas');
  const [selectedId, setSelectedId] = useState<string>(CRITICAL_TIMELINE_MILESTONES[3].id); // Default to Finley 1827 vs Gran Zimbabue (iconic Bloque III bridge)

  // Scroll-triggered reveal state for SVG nodes, comparison card, and matrix rows
  const [svgStageVisible, setSvgStageVisible] = useState<boolean>(() => prefersReducedMotion());
  const [cardVisible, setCardVisible] = useState<boolean>(() => prefersReducedMotion());
  const [visibleRowIds, setVisibleRowIds] = useState<Record<string, boolean>>(() => {
    if (!prefersReducedMotion()) return {};
    return Object.fromEntries(CRITICAL_TIMELINE_MILESTONES.map((m) => [m.id, true]));
  });

  const svgStageRef = useRef<HTMLDivElement | null>(null);
  const comparisonCardRef = useRef<HTMLElement | null>(null);
  const rowElementsRef = useRef<Map<string, HTMLTableRowElement>>(new Map());

  useEffect(() => {
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      setSvgStageVisible(true);
      setCardVisible(true);
      setVisibleRowIds(Object.fromEntries(CRITICAL_TIMELINE_MILESTONES.map((m) => [m.id, true])));
      return;
    }

    const stageObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (entry.target === svgStageRef.current) {
            setSvgStageVisible(true);
            stageObserver.unobserve(entry.target);
          } else if (entry.target === comparisonCardRef.current) {
            setCardVisible(true);
            stageObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.01, rootMargin: '60px 0px -10px 0px' }
    );

    if (svgStageRef.current) stageObserver.observe(svgStageRef.current);
    if (comparisonCardRef.current) stageObserver.observe(comparisonCardRef.current);

    const rowObserver = new IntersectionObserver(
      (entries) => {
        const newlyVisible: string[] = [];
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).dataset.milestoneId;
          if (id) {
            newlyVisible.push(id);
            rowObserver.unobserve(entry.target);
          }
        }
        if (newlyVisible.length > 0) {
          setVisibleRowIds((prev) => {
            const next = { ...prev };
            for (const id of newlyVisible) next[id] = true;
            return next;
          });
        }
      },
      { threshold: 0.01, rootMargin: '40px 0px -8px 0px' }
    );

    rowElementsRef.current.forEach((el) => rowObserver.observe(el));

    return () => {
      stageObserver.disconnect();
      rowObserver.disconnect();
    };
  }, []);

  const visibleMilestones = useMemo(() => {
    if (regionFilter === 'todas') return CRITICAL_TIMELINE_MILESTONES;
    return CRITICAL_TIMELINE_MILESTONES.filter((m) => m.regionId === regionFilter);
  }, [regionFilter]);

  const activeMilestone: CriticalTimelineMilestone = useMemo(() => {
    const inVisible = visibleMilestones.find((m) => m.id === selectedId);
    return inVisible ?? visibleMilestones[0] ?? CRITICAL_TIMELINE_MILESTONES[0];
  }, [visibleMilestones, selectedId]);

  const activePlate = plateById.get(activeMilestone.myth.plateId) ?? null;

  const handleRegionChange = (region: CriticalRegionId) => {
    setSvgStageVisible(true);
    setCardVisible(true);
    setRegionFilter(region);
    if (region !== 'todas') {
      const match = CRITICAL_TIMELINE_MILESTONES.find((m) => m.regionId === region);
      if (match) {
        setSelectedId(match.id);
        setVisibleRowIds((prev) => (prev[match.id] ? prev : { ...prev, [match.id]: true }));
      }
    }
  };

  // Concise 2-line SVG labels guaranteeing zero overlap across 154px columns
  const svgLabelsById: Record<string, { myth: [string, string]; arch: [string, string] }> = {
    'crit-occidental-sahel': {
      myth: ['Colón · De Bry', '(1492–1592)'],
      arch: ['Malí · Benín', 'Jenné-Jeno'],
    },
    'crit-nilo-cuerno': {
      myth: ['D’Anville (1794)', 'Aethiopes'],
      arch: ['Meroe (Kush)', 'y Aksum'],
    },
    'crit-oriental-suajili': {
      myth: ['Cruttwell (1799)', '«Men Eaters»'],
      arch: ['Kilwa Kisiwani', 'y Lamu'],
    },
    'crit-austral-zimbabue': {
      myth: ['Finley (1827)', 'Cannibals / Zimboo'],
      arch: ['Gran Zimbabue', 'y Mapungubwe'],
    },
    'crit-central-congo': {
      myth: ['Umlauft (s. XIX)', 'África Central'],
      arch: ['Mbanza Kongo', 'Siderurgia bantú'],
    },
    'crit-panafricano': {
      myth: ['McCay · RAE', '(1907–1970)'],
      arch: ['UNESCO / Ibadán', 'y Atapuerca'],
    },
  };

  // Balanced horizontal coordinates for the 6 chronological milestones along the SVG axis
  const svgWidth = 960;
  const svgHeight = 296;
  const xPositions = [96, 250, 404, 558, 712, 864];
  const yMyth = 92;
  const yAxis = 148;
  const yArch = 204;

  return (
    <div
      id="cannibalism-panel-cronologia-critica"
      role="tabpanel"
      aria-labelledby="cannibalism-tab-cronologia-critica"
      className="flex flex-col gap-6"
    >
      {/* Header & Pedagogical Purpose */}
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-xl font-semibold text-ink m-0">
          Cronología Crítica: coexistencia del mito caníbal frente a la arqueología africana
        </h3>
        <p className="text-sm text-ink-muted m-0 max-w-3xl">
          En un mismo eje temporal se superponen las etiquetas proyectadas por la cartografía, la
          prensa y los diccionarios europeos (carril superior, ocre) con las sociedades, Estados y
          evidencias arqueológicas reales que existían simultáneamente en cada región africana
          (carril inferior, bosque).
        </p>
      </div>

      {/* Regional Filter Strip */}
      <div
        role="group"
        aria-label="Filtrar la cronología crítica por región africana"
        className="flex flex-wrap items-center gap-2"
      >
        {CRITICAL_TIMELINE_REGIONS.map((reg) => {
          const isActive = regionFilter === reg.id;
          return (
            <button
              key={reg.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => handleRegionChange(reg.id)}
              className={`min-h-[40px] px-3 py-1.5 font-mono text-xs rounded border transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-ink text-white border-ink font-medium'
                  : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
              }`}
            >
              {reg.label}
            </button>
          );
        })}
      </div>

      {/* Dual-Track Interactive Chronological SVG Stage */}
      <div
        ref={svgStageRef}
        className="bg-paper border border-hairline border-t-2 border-t-rule p-4 sm:p-5 flex flex-col gap-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1.5 text-ochre font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-ochre inline-block" aria-hidden="true" />
              Carril superior: Mito y cartografía colonial
            </span>
            <span className="inline-flex items-center gap-1.5 text-forest font-medium">
              <span className="w-2.5 h-2.5 bg-forest inline-block" aria-hidden="true" />
              Carril inferior: Evidencia arqueológica africana
            </span>
          </div>
          <span className="text-ink-muted">Pulse un nodo o puente para inspeccionar la sincronía</span>
        </div>

        <div className="w-full overflow-x-auto pb-1">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full min-w-[720px] h-auto block select-none"
            role="img"
            aria-label="Cronología crítica en doble carril que compara mitos europeos sobre el canibalismo con evidencias arqueológicas reales en seis regiones africanas"
          >
            {/* Background subtle bands */}
            <rect x={16} y={18} width={svgWidth - 32} height={100} fill="#fbf5ef" stroke="#ead8ca" strokeWidth={1} />
            <rect x={16} y={178} width={svgWidth - 32} height={96} fill="#f1f7f4" stroke="#cfe2d8" strokeWidth={1} />

            {/* Track left-edge micro labels */}
            <text x={24} y={33} className="font-mono" fontSize={10} fontWeight={600} fill="#b43c0b">
              DISCURSO / MITO COLONIAL
            </text>
            <text x={24} y={266} className="font-mono" fontSize={10} fontWeight={600} fill="#1d6b4b">
              REGISTRO ARQUEOLÓGICO E HISTÓRICO AFRICANO
            </text>

            {/* Horizontal track lines & central time spine */}
            <line x1={48} y1={yMyth} x2={svgWidth - 48} y2={yMyth} stroke="#d95216" strokeWidth={1.5} strokeOpacity={0.35} />
            <line x1={48} y1={yAxis} x2={svgWidth - 48} y2={yAxis} stroke="#121212" strokeWidth={1.5} />
            <line x1={48} y1={yArch} x2={svgWidth - 48} y2={yArch} stroke="#1d6b4b" strokeWidth={1.5} strokeOpacity={0.35} />

            {/* Directional arrow on timeline spine */}
            <polygon points={`${svgWidth - 48},${yAxis - 4} ${svgWidth - 38},${yAxis} ${svgWidth - 48},${yAxis + 4}`} fill="#121212" />

            {CRITICAL_TIMELINE_MILESTONES.map((item, idx) => {
              const cx = xPositions[idx];
              const isSelected = item.id === activeMilestone.id;
              const isVisible = regionFilter === 'todas' || item.regionId === regionFilter;
              const opacity = isVisible ? 1 : 0.24;
              const labels = svgLabelsById[item.id] ?? {
                myth: [item.myth.shortLabel, ''],
                arch: [item.archaeology.shortLabel, ''],
              };

              return (
                <g
                  key={item.id}
                  role="button"
                  tabIndex={isVisible ? 0 : -1}
                  aria-pressed={isSelected}
                  aria-label={`${item.axisYearLabel} · ${item.regionLabel}: ${item.myth.shortLabel} frente a ${item.archaeology.shortLabel}`}
                  opacity={opacity}
                  onClick={() => {
                    if (!isVisible) setRegionFilter('todas');
                    setSelectedId(item.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (!isVisible) setRegionFilter('todas');
                      setSelectedId(item.id);
                    }
                  }}
                  className="cursor-pointer timeline-node-dim focus:outline-none focus-visible:outline-2 focus-visible:outline-ink"
                >
                  {/* Scroll-triggered opacity + slide-in wrapper per chronological node */}
                  <g
                    className={`timeline-node-reveal ${STAGGER_CLASSES[idx] ?? 'timeline-stagger-5'} ${
                      svgStageVisible ? 'is-visible' : ''
                    }`}
                  >
                  {/* Transparent hit target column */}
                  <rect x={cx - 72} y={18} width={144} height={256} fill="transparent" />

                  {/* Active highlight halo column */}
                  {isSelected && (
                    <rect
                      x={cx - 70}
                      y={18}
                      width={140}
                      height={256}
                      fill="#121212"
                      fillOpacity={0.04}
                      stroke="#121212"
                      strokeWidth={1.25}
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Vertical coexistence bridge connecting Myth <-> Archaeology */}
                  <line
                    x1={cx}
                    y1={yMyth + 8}
                    x2={cx}
                    y2={yArch - 8}
                    stroke={isSelected ? '#121212' : '#73736e'}
                    strokeWidth={isSelected ? 2 : 1.25}
                    strokeDasharray={isSelected ? undefined : '3 3'}
                  />

                  {/* Center date rectangular editorial badge on spine */}
                  <rect
                    x={cx - 46}
                    y={yAxis - 11}
                    width={92}
                    height={22}
                    rx={2}
                    fill={isSelected ? '#121212' : '#f8f7f3'}
                    stroke={isSelected ? '#121212' : '#9c9a92'}
                    strokeWidth={1}
                  />
                  <text
                    x={cx}
                    y={yAxis + 3.5}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize={10.5}
                    fontWeight={isSelected ? 600 : 500}
                    fill={isSelected ? '#ffffff' : '#121212'}
                  >
                    {item.axisYearLabel}
                  </text>

                  {/* Upper Myth Node (Circle) & 2-line label */}
                  <circle
                    cx={cx}
                    cy={yMyth}
                    r={isSelected ? 8.5 : 6}
                    fill={isSelected ? '#b43c0b' : '#ffffff'}
                    stroke="#b43c0b"
                    strokeWidth={2.2}
                  />
                  <text
                    x={cx}
                    y={yMyth - 27}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize={10}
                    fontWeight={isSelected ? 700 : 500}
                    fill="#8f2d06"
                  >
                    <tspan x={cx} dy={0}>
                      {labels.myth[0]}
                    </tspan>
                    {labels.myth[1] && (
                      <tspan x={cx} dy={12.5} fontWeight={500}>
                        {labels.myth[1]}
                      </tspan>
                    )}
                  </text>

                  {/* Lower Archaeology Node (Square) & 2-line label */}
                  <rect
                    x={cx - (isSelected ? 7.5 : 5.5)}
                    y={yArch - (isSelected ? 7.5 : 5.5)}
                    width={isSelected ? 15 : 11}
                    height={isSelected ? 15 : 11}
                    fill={isSelected ? '#1d6b4b' : '#ffffff'}
                    stroke="#1d6b4b"
                    strokeWidth={2.2}
                  />
                  <text
                    x={cx}
                    y={yArch + 21}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize={10}
                    fontWeight={isSelected ? 700 : 500}
                    fill="#145037"
                  >
                    <tspan x={cx} dy={0}>
                      {labels.arch[0]}
                    </tspan>
                    {labels.arch[1] && (
                      <tspan x={cx} dy={12.5} fontWeight={500}>
                        {labels.arch[1]}
                      </tspan>
                    )}
                  </text>

                  {/* Region caption under lower band */}
                  <text
                    x={cx}
                    y={289}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize={10}
                    fill={isSelected ? '#121212' : '#575753'}
                    fontWeight={isSelected ? 600 : 400}
                  >
                    {item.regionShort}
                  </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Mobile-friendly & keyboard-accessible quick milestone strip */}
        <div
          role="group"
          aria-label="Selector rápido de sincronías temporales"
          className="flex flex-wrap gap-1.5 pt-2 border-t border-hairline"
        >
          {visibleMilestones.map((item, idx) => {
            const isSelected = item.id === activeMilestone.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedId(item.id)}
                className={`timeline-slide-row ${STAGGER_CLASSES[idx] ?? 'timeline-stagger-5'} ${
                  svgStageVisible ? 'is-visible' : ''
                } min-h-[38px] px-3 py-1 font-mono text-xs rounded border cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-ochre text-white border-ochre font-medium'
                    : 'bg-canvas text-ink border-hairline hover:border-ink'
                }`}
              >
                <span className="tabular-nums">{item.axisYearLabel}</span> · {item.regionShort}
              </button>
            );
          })}
        </div>
      </div>

      {/* Synchronized Coexistence Comparison Card */}
      <article
        ref={comparisonCardRef}
        aria-live="polite"
        className={`timeline-slide-row ${
          cardVisible ? 'is-visible' : ''
        } bg-paper border border-hairline border-t-2 border-t-ink p-5 sm:p-6 flex flex-col gap-5`}
      >
        <div className="flex flex-col gap-2 pb-4 border-b border-hairline">
          <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs">
            <span className="text-ochre font-semibold inline-flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{activeMilestone.regionLabel}</span>
            </span>
            <span className="text-ink-muted tabular-nums">
              Ventana comparada: {activeMilestone.periodLabel}
            </span>
          </div>

          <h4 className="font-display text-xl sm:text-2xl font-semibold text-ink leading-snug m-0">
            {activeMilestone.synchronyTitle}
          </h4>

          <p className="text-sm text-ink bg-canvas border-l-2 border-l-lapis pl-3.5 py-2 m-0 leading-relaxed">
            <strong className="font-mono text-xs text-lapis mr-1.5">Sincronía crítica ·</strong>
            {activeMilestone.synchronyThesis}
          </p>
        </div>

        {/* Dual Column Confrontation: Myth vs Archaeological Reality */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* LEFT: Myth / Colonial Stereotype */}
          <div className="bg-canvas border border-hairline border-t-2 border-t-ochre p-4 sm:p-5 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-ochre inline-flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Mito y proyección colonial</span>
                </span>
                <span className="font-mono text-[11px] text-ink-muted tabular-nums">
                  {activeMilestone.myth.dating}
                </span>
              </div>

              <div className="font-display text-base font-semibold text-ink leading-snug">
                {activeMilestone.myth.source}
              </div>

              <p className="text-sm leading-relaxed text-ink m-0">{activeMilestone.myth.claim}</p>

              <div className="pt-2 border-t border-hairline flex flex-col gap-1">
                <span className="font-mono text-[11px] text-ink-muted">Función ideológica</span>
                <p className="text-xs sm:text-sm leading-relaxed text-ink-muted m-0">
                  {activeMilestone.myth.ideologicalFunction}
                </p>
              </div>
            </div>

            {activePlate && (
              <button
                type="button"
                onClick={(e) => onOpenPlate(activePlate, e.currentTarget)}
                className="group bg-paper border border-hairline hover:border-ochre p-2.5 text-left grid grid-cols-12 gap-3 items-center transition-colors cursor-pointer"
              >
                <div className="col-span-4 aspect-[4/3] bg-[#e9e3d5] border border-hairline overflow-hidden">
                  <img
                    src={activePlate.src}
                    alt={activePlate.title}
                    width={1150}
                    height={862}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="col-span-8 flex flex-col gap-1 min-w-0">
                  <span className="font-mono text-[10.5px] text-ochre">
                    {activePlate.accessionCode} · Fuente visual asociada
                  </span>
                  <span className="text-xs font-semibold text-ink group-hover:text-ochre leading-snug line-clamp-2">
                    {activePlate.title}
                  </span>
                  <span className="font-mono text-[11px] text-ink-muted inline-flex items-center gap-1">
                    <ZoomIn className="w-3 h-3" aria-hidden="true" />
                    <span>Ampliar documento histórico</span>
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* RIGHT: Real African Archaeological & Historical Evidence */}
          <div className="bg-canvas border border-hairline border-t-2 border-t-forest p-4 sm:p-5 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-forest inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Evidencia arqueológica e histórica real</span>
                </span>
                <span className="font-mono text-[11px] text-ink-muted tabular-nums">
                  {activeMilestone.archaeology.chronology}
                </span>
              </div>

              <div className="font-display text-base font-semibold text-ink leading-snug">
                {activeMilestone.archaeology.sites}
              </div>

              <p className="text-sm leading-relaxed text-ink m-0">
                {activeMilestone.archaeology.evidenceSummary}
              </p>

              <div className="pt-2 border-t border-hairline flex flex-col gap-1.5">
                <span className="font-mono text-[11px] font-semibold text-forest">
                  Marcadores materiales y documentales verificados
                </span>
                <ul className="m-0 pl-4 flex flex-col gap-1.5 text-xs sm:text-sm text-ink leading-relaxed">
                  {activeMilestone.archaeology.materialMarkers.map((marker) => (
                    <li key={marker}>{marker}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-hairline flex flex-col gap-3">
              <span className="font-mono text-[11px] text-ink-muted">
                Referencias: {activeMilestone.archaeology.reference}
              </span>
              <button
                type="button"
                onClick={() =>
                  onNavigateCourse({
                    sectionId: activeMilestone.archaeology.bloque3Action.sectionId,
                    kingdomId: activeMilestone.archaeology.bloque3Action.kingdomId,
                  })
                }
                className="min-h-[40px] px-3.5 py-2 text-xs font-medium text-ink bg-paper border border-hairline hover:border-forest hover:text-forest rounded inline-flex items-center justify-between gap-2 transition-colors cursor-pointer"
              >
                <span>{activeMilestone.archaeology.bloque3Action.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-forest shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Regional Synchrony Synthesis Matrix for Bloque III Consolidation */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-mono text-xs font-semibold text-ink">
            Matriz de consolidación del Bloque III (6 regiones africanas)
          </span>
          <span className="font-mono text-[11px] text-ink-muted">
            Pulse cualquier fila para centrar esa región en la cronología superior
          </span>
        </div>

        <div className="overflow-x-auto border border-hairline bg-canvas">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-paper border-b border-rule font-mono text-[11px] text-ink-muted">
                <th scope="col" className="py-2.5 px-3 font-semibold">
                  Región africana
                </th>
                <th scope="col" className="py-2.5 px-3 font-semibold whitespace-nowrap">
                  Eje temporal
                </th>
                <th scope="col" className="py-2.5 px-3 font-semibold text-ochre">
                  Mito / estereotipo proyectado
                </th>
                <th scope="col" className="py-2.5 px-3 font-semibold text-forest">
                  Evidencia arqueológica contemporánea
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {CRITICAL_TIMELINE_MILESTONES.map((row, idx) => {
                const isSelected = row.id === activeMilestone.id;
                const isRowVisible = Boolean(visibleRowIds[row.id]);
                return (
                  <tr
                    key={row.id}
                    data-milestone-id={row.id}
                    ref={(el) => {
                      if (el) {
                        rowElementsRef.current.set(row.id, el);
                      } else {
                        rowElementsRef.current.delete(row.id);
                      }
                    }}
                    onClick={() => {
                      setRegionFilter('todas');
                      setSelectedId(row.id);
                    }}
                    className={`timeline-slide-row ${STAGGER_CLASSES[idx] ?? 'timeline-stagger-5'} ${
                      isRowVisible ? 'is-visible' : ''
                    } cursor-pointer ${
                      isSelected ? 'bg-ochre-soft/55' : 'hover:bg-paper'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-medium text-ink align-top">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRegionFilter('todas');
                          setSelectedId(row.id);
                        }}
                        className="text-left font-semibold text-ink hover:text-ochre cursor-pointer focus:outline-none focus-visible:underline"
                      >
                        {row.regionLabel}
                      </button>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs text-ink-muted tabular-nums whitespace-nowrap align-top">
                      {row.axisYearLabel}
                    </td>
                    <td className="py-2.5 px-3 text-ink align-top">{row.myth.shortLabel}</td>
                    <td className="py-2.5 px-3 text-ink align-top">
                      {row.archaeology.shortLabel}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
