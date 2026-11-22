import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Pause, Play, RotateCcw } from 'lucide-react';
import type { DnaBase, Molecular3DModelSpec } from '../data/paleomolecular3dModels';

export interface DnaReplicationDiagram2DProps {
  model: Molecular3DModelSpec;
  alternateVariant: boolean;
}

type ReplicationStageId = 0 | 1 | 2 | 3;

interface StageMeta {
  id: ReplicationStageId;
  shortLabel: string;
  title: string;
  explanation: string;
}

const STAGES: StageMeta[] = [
  {
    id: 0,
    shortLabel: '1. Dúplex parental',
    title: 'Doble hélice parental antiparalela (5\'→3\' / 3\'→5\')',
    explanation:
      'Las dos hebras parentales permanecen unidas mediante puentes de hidrógeno específicos (A=T con 2 puentes; G≡C con 3 puentes) antes del inicio de la horquilla.',
  },
  {
    id: 1,
    shortLabel: '2. Helicasa',
    title: 'Desenrollamiento por ADN Helicasa y estabilización SSB',
    explanation:
      'La ADN helicasa avanza rompiendo los puentes de hidrógeno para abrir la horquilla de replicación; las proteínas SSB impiden que las hebras monocatenarias vuelvan a hibridarse.',
  },
  {
    id: 2,
    shortLabel: '3. Polimerasa y Okazaki',
    title: 'Síntesis simultánea: hebra líder continua y rezagada discontinua',
    explanation:
      'La ADN polimerasa sintetiza siempre en sentido 5\'→3\': continua sobre el molde inferior (hebra líder) y por fragmentos de Okazaki con cebadores ARN y ADN ligasa sobre el molde superior (hebra rezagada).',
  },
  {
    id: 3,
    shortLabel: '4. Semiconservativa',
    title: 'Dos dúplex hijos semiconservativos completados',
    explanation:
      'Cada molécula hija conserva una hebra parental original y una hebra recién sintetizada, transmitiendo fielmente la secuencia (o emparejando uracilos post mortem con A en 1.ª ronda, fijando la transición C→T en 2.ª ronda y secuenciación).',
  },
];

// Palette tokens synchronized strictly with src/index.css (@theme)
const PALETTE = {
  canvas: '#ffffff',
  paper: '#f7f7f5',
  surface: '#f1f1ee',
  ink: '#121212',
  inkMuted: '#575753',
  inkSubtle: '#73736e',
  hairline: '#e2e2dd',
  ochre: '#b43c0b',
  ochreBright: '#d95216',
  ochreSoft: '#fdf3ee',
  lapis: '#1f5fa8',
  lapisSoft: '#eef5fc',
  forest: '#156f55',
  forestSoft: '#eef7f4',
  plum: '#7d4ca5',
  plumSoft: '#f5eff9',
  crimson: '#b42318',
  crimsonSoft: '#fdf1f0',
} as const;

type RenderBase = DnaBase | 'U';

function complementOf(base: DnaBase): DnaBase {
  switch (base) {
    case 'A':
      return 'T';
    case 'T':
      return 'A';
    case 'G':
      return 'C';
    case 'C':
      return 'G';
  }
}

function daughterBaseForTemplate(base: RenderBase): DnaBase {
  if (base === 'U') return 'A'; // DNA polymerase reads deaminated uracil as thymine -> incorporates A
  return complementOf(base);
}

function hydrogenBondsCount(b1: RenderBase, b2: RenderBase): number {
  if (b1 === 'U' || b2 === 'U') return 2;
  if ((b1 === 'G' && b2 === 'C') || (b1 === 'C' && b2 === 'G')) return 3;
  return 2;
}

function baseStyle(base: RenderBase): { fill: string; stroke: string; text: string; dashed?: boolean } {
  switch (base) {
    case 'A':
      return { fill: PALETTE.forestSoft, stroke: PALETTE.forest, text: PALETTE.forest };
    case 'T':
      return { fill: PALETTE.ochreSoft, stroke: PALETTE.ochre, text: PALETTE.ochre };
    case 'G':
      return { fill: PALETTE.lapisSoft, stroke: PALETTE.lapis, text: PALETTE.lapis };
    case 'C':
      return { fill: PALETTE.surface, stroke: PALETTE.inkMuted, text: PALETTE.ink };
    case 'U':
      return { fill: PALETTE.crimsonSoft, stroke: PALETTE.crimson, text: PALETTE.crimson, dashed: true };
  }
}

function baseFullName(base: RenderBase): string {
  switch (base) {
    case 'A':
      return 'Adenina (A)';
    case 'T':
      return 'Timina (T)';
    case 'G':
      return 'Guanina (G)';
    case 'C':
      return 'Citosina (C)';
    case 'U':
      return 'Uracilo post mortem (C→U)';
  }
}

export function DnaReplicationDiagram2D({
  model,
  alternateVariant,
}: DnaReplicationDiagram2DProps) {
  const [stage, setStage] = useState<ReplicationStageId>(2);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const locus = model.replicationLocus;
  const rawSeq = alternateVariant ? locus.alternateSequence5to3 : locus.defaultSequence5to3;

  const sequence = useMemo<DnaBase[]>(() => {
    return rawSeq
      .toUpperCase()
      .split('')
      .filter((ch): ch is DnaBase => ch === 'A' || ch === 'T' || ch === 'G' || ch === 'C');
  }, [rawSeq]);

  const deaminatedSet = useMemo(() => {
    if (alternateVariant) return new Set<number>();
    return new Set<number>(locus.deaminatedIndicesDefault ?? []);
  }, [alternateVariant, locus.deaminatedIndicesDefault]);

  const highlightSet = useMemo(() => {
    const indices = alternateVariant
      ? (locus.highlightIndicesAlternate ?? [])
      : (locus.highlightIndicesDefault ?? []);
    return new Set<number>(indices);
  }, [alternateVariant, locus.highlightIndicesAlternate, locus.highlightIndicesDefault]);

  // Reset base selection when model or variant changes
  useEffect(() => {
    setSelectedIndex(null);
  }, [model.id, alternateVariant]);

  // Step playback timer (respects prefers-reduced-motion)
  useEffect(() => {
    if (!isPlaying) return;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const intervalMs = reduced ? 3200 : 2200;
    const timer = window.setInterval(() => {
      setStage((prev) => ((prev + 1) % 4) as ReplicationStageId);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  // Computed biochemical telemetry from the live sequence
  const stats = useMemo(() => {
    let gcCount = 0;
    let totalHBonds = 0;
    sequence.forEach((b, i) => {
      const upper: RenderBase = deaminatedSet.has(i) ? 'U' : b;
      const lower = complementOf(b);
      if (b === 'G' || b === 'C') gcCount += 1;
      totalHBonds += hydrogenBondsCount(upper, lower);
    });
    const gcPercent = sequence.length > 0 ? Math.round((gcCount / sequence.length) * 100) : 0;
    return {
      length: sequence.length,
      gcPercent,
      totalHBonds,
      deaminatedCount: deaminatedSet.size,
    };
  }, [sequence, deaminatedSet]);

  const handleExportSvg = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgEl);
    if (!source.includes('xmlns="http://www.w3.org/2000/svg"')) {
      source = source.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `esquema-replicacion-adn-${model.id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // SVG Layout geometry
  const W = 980;
  const H = 396;
  const startX = 96;
  const stepX = 50;

  // Stage-specific geometry helpers
  const forkIndex = stage === 1 ? 9 : stage === 2 ? 12 : sequence.length;

  const getUpperParentY = (i: number): number => {
    if (stage === 0) return 146;
    if (stage === 3) return 82;
    // Stages 1 & 2: unwound left of fork, duplex right of fork
    if (i < forkIndex - 1) return stage === 1 ? 92 : 74;
    if (i === forkIndex - 1) return stage === 1 ? 116 : 108;
    return 146;
  };

  const getLowerParentY = (i: number): number => {
    if (stage === 0) return 246;
    if (stage === 3) return 312;
    if (i < forkIndex - 1) return stage === 1 ? 300 : 318;
    if (i === forkIndex - 1) return stage === 1 ? 276 : 284;
    return 246;
  };

  // Build smooth SVG polyline paths for parental backbones
  const upperParentPath = sequence
    .map((_, i) => `${i === 0 ? 'M' : 'L'} ${startX + i * stepX} ${getUpperParentY(i)}`)
    .join(' ');
  const lowerParentPath = sequence
    .map((_, i) => `${i === 0 ? 'M' : 'L'} ${startX + i * stepX} ${getLowerParentY(i)}`)
    .join(' ');

  const stageMeta = STAGES[stage];
  const inspectedIdx = selectedIndex;
  const inspectedInfo = useMemo(() => {
    if (inspectedIdx === null || !sequence[inspectedIdx]) return null;
    const orig = sequence[inspectedIdx];
    const isDeam = deaminatedSet.has(inspectedIdx);
    const upperBase: RenderBase = isDeam ? 'U' : orig;
    const lowerBase: DnaBase = complementOf(orig);
    const daughterOfUpper: DnaBase = daughterBaseForTemplate(upperBase);
    const daughterOfLower: DnaBase = complementOf(lowerBase);
    const isHl = highlightSet.has(inspectedIdx);
    return {
      pos: inspectedIdx + 1,
      upperBase,
      lowerBase,
      daughterOfUpper,
      daughterOfLower,
      bonds: hydrogenBondsCount(upperBase, lowerBase),
      isDeam,
      isHl,
    };
  }, [inspectedIdx, sequence, deaminatedSet, highlightSet]);

  const helicaseX = startX + (forkIndex - 0.5) * stepX;

  return (
    <div className="bg-paper border-t border-hairline">
      {/* Header & Stage Controls */}
      <div className="px-5 py-4 sm:px-6 border-b border-hairline flex flex-col gap-3.5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
          <div className="space-y-1 max-w-3xl">
            <div className="font-mono text-[11px] tracking-wide text-ink-muted">
              Esquema 2D dinámico de replicación de ADN · {locus.geneLabel}
            </div>
            <h4 className="font-display text-lg sm:text-xl font-semibold text-ink m-0 leading-snug">
              {stageMeta.title}
            </h4>
            <p className="text-xs text-ink-muted leading-relaxed m-0">
              {locus.contextNote}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              aria-pressed={isPlaying}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-mono border transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5 ${
                isPlaying
                  ? 'bg-ink text-canvas border-ink'
                  : 'bg-canvas text-ink border-hairline hover:border-ink'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <Play className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              )}
              <span>{isPlaying ? 'Pausar' : 'Animar pasos'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStage(0);
                setSelectedIndex(null);
              }}
              className="min-h-[36px] px-2.5 py-1.5 text-xs font-mono bg-canvas text-ink-muted hover:text-ink border border-hairline hover:border-ink transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1"
              title="Reiniciar al dúplex parental"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Inicio</span>
            </button>

            <button
              type="button"
              onClick={handleExportSvg}
              className="min-h-[36px] px-3 py-1.5 text-xs font-mono bg-canvas text-lapis border border-lapis/40 hover:border-lapis hover:bg-lapis-soft transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5"
              title="Descargar el esquema vectorial 2D generado dinámicamente"
            >
              <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Descargar SVG</span>
            </button>
          </div>
        </div>

        {/* 4 Progressive Stage Buttons + Inline Sequence Metrics */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div
            role="tablist"
            aria-label="Fases de replicación del ADN"
            className="flex flex-wrap items-center gap-1.5"
          >
            {STAGES.map((st) => {
              const active = st.id === stage;
              return (
                <button
                  key={st.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setIsPlaying(false);
                    setStage(st.id);
                  }}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-mono border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-ink text-canvas border-ink font-medium'
                      : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
                  }`}
                >
                  {st.shortLabel}
                </button>
              );
            })}
          </div>

          <div className="font-mono text-[11px] text-ink-muted tabular-nums flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span>{stats.length} pb</span>
            <span aria-hidden="true">·</span>
            <span>GC {stats.gcPercent} %</span>
            <span aria-hidden="true">·</span>
            <span>{stats.totalHBonds} puentes H</span>
            {stats.deaminatedCount > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-crimson font-medium">
                  {stats.deaminatedCount} desaminaciones 5&apos; C→U
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dynamically Generated 2D Editorial SVG Stage */}
      <div className="p-4 sm:p-5 bg-canvas">
        <div className="w-full overflow-x-auto border border-hairline bg-canvas">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full min-w-[760px] h-auto block"
            role="img"
            aria-label={`Esquema 2D de replicación de ADN para ${model.shortLabel}, fase ${stageMeta.shortLabel}`}
          >
            <defs>
              <marker
                id="arrow-forest"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill={PALETTE.forest} />
              </marker>
              <marker
                id="arrow-ochre"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill={PALETTE.ochre} />
              </marker>
            </defs>

            {/* Clean Architectural Paper Backdrop */}
            <rect x="0" y="0" width={W} height={H} fill={PALETTE.canvas} />
            <rect x="0" y="0" width={W} height="34" fill={PALETTE.paper} />
            <line x1="0" y1="34" x2={W} y2="34" stroke={PALETTE.hairline} strokeWidth="1" />

            {/* Top Plate Title inside SVG (so exported SVG is completely self-explanatory) */}
            <text
              x="20"
              y="21"
              fill={PALETTE.ink}
              fontSize="11"
              fontWeight="600"
              fontFamily="IBM Plex Mono, ui-monospace, monospace"
            >
              {locus.geneLabel}
            </text>
            <text
              x={W - 20}
              y="21"
              textAnchor="end"
              fill={PALETTE.inkMuted}
              fontSize="10.5"
              fontFamily="IBM Plex Mono, ui-monospace, monospace"
            >
              {stageMeta.shortLabel} · {alternateVariant ? model.variant.alternateLabel : model.variant.defaultLabel}
            </text>

            {/* Subtle vertical nucleotide position grid ticks */}
            {sequence.map((_, i) => {
              const x = startX + i * stepX;
              const isSelected = selectedIndex === i;
              const isHl = highlightSet.has(i);
              return (
                <g key={`grid-${i}`}>
                  {isSelected && (
                    <rect
                      x={x - 21}
                      y={36}
                      width={42}
                      height={H - 58}
                      fill={PALETTE.lapisSoft}
                      opacity={0.75}
                    />
                  )}
                  {!isSelected && isHl && (
                    <rect
                      x={x - 20}
                      y={36}
                      width={40}
                      height={H - 58}
                      fill={deaminatedSet.has(i) ? PALETTE.crimsonSoft : PALETTE.ochreSoft}
                      opacity={0.55}
                    />
                  )}
                  <text
                    x={x}
                    y={H - 8}
                    textAnchor="middle"
                    fill={isSelected ? PALETTE.ink : isHl ? PALETTE.ochre : PALETTE.inkSubtle}
                    fontSize="9.5"
                    fontWeight={isSelected || isHl ? '600' : '400'}
                    fontFamily="IBM Plex Mono, ui-monospace, monospace"
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}

            {/* Center Semiconservative Divider in Stage 4 */}
            {stage === 3 && (
              <g>
                <line
                  x1="28"
                  y1="198"
                  x2={W - 28}
                  y2="198"
                  stroke={PALETTE.hairline}
                  strokeWidth="1.2"
                  strokeDasharray="5 4"
                />
                <rect x="310" y="187" width="360" height="22" fill={PALETTE.canvas} />
                <text
                  x="490"
                  y="201"
                  textAnchor="middle"
                  fill={PALETTE.inkMuted}
                  fontSize="10.5"
                  fontWeight="600"
                  fontFamily="IBM Plex Mono, ui-monospace, monospace"
                >
                  2 dúplex hijos semiconservativos (50 % parental · 50 % nuevo)
                </text>
              </g>
            )}

            {/* Parental Backbone Ribbons */}
            <path
              d={upperParentPath}
              fill="none"
              stroke={PALETTE.lapis}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={lowerParentPath}
              fill="none"
              stroke={PALETTE.ink}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Polarity Labels on Parental Strands */}
            <text
              x="56"
              y={getUpperParentY(0) + 4}
              textAnchor="end"
              fill={PALETTE.lapis}
              fontSize="11.5"
              fontWeight="700"
              fontFamily="IBM Plex Mono, ui-monospace, monospace"
            >
              5&apos;
            </text>
            <text
              x={startX + (sequence.length - 1) * stepX + 32}
              y={getUpperParentY(sequence.length - 1) + 4}
              fill={PALETTE.lapis}
              fontSize="11.5"
              fontWeight="700"
              fontFamily="IBM Plex Mono, ui-monospace, monospace"
            >
              3&apos;
            </text>
            <text
              x="56"
              y={getLowerParentY(0) + 4}
              textAnchor="end"
              fill={PALETTE.ink}
              fontSize="11.5"
              fontWeight="700"
              fontFamily="IBM Plex Mono, ui-monospace, monospace"
            >
              3&apos;
            </text>
            <text
              x={startX + (sequence.length - 1) * stepX + 32}
              y={getLowerParentY(sequence.length - 1) + 4}
              fill={PALETTE.ink}
              fontSize="11.5"
              fontWeight="700"
              fontFamily="IBM Plex Mono, ui-monospace, monospace"
            >
              5&apos;
            </text>

            {/* Right-margin strand role labels */}
            <text
              x={W - 16}
              y={getUpperParentY(sequence.length - 1) + 4}
              textAnchor="end"
              fill={PALETTE.lapis}
              fontSize="9.5"
              fontFamily="IBM Plex Mono, ui-monospace, monospace"
            >
              Molde sup.
            </text>
            <text
              x={W - 16}
              y={getLowerParentY(sequence.length - 1) + 4}
              textAnchor="end"
              fill={PALETTE.inkMuted}
              fontSize="9.5"
              fontFamily="IBM Plex Mono, ui-monospace, monospace"
            >
              Molde inf.
            </text>

            {/* STAGE 1 & 2: Hydrogen Bonds on Intact Duplex Portions */}
            {sequence.map((b, i) => {
              const x = startX + i * stepX;
              const yTop = getUpperParentY(i);
              const yBot = getLowerParentY(i);
              const isZipped = stage === 0 || ((stage === 1 || stage === 2) && i >= forkIndex);
              if (!isZipped) return null;

              const upperBase: RenderBase = deaminatedSet.has(i) ? 'U' : b;
              const lowerBase = complementOf(b);
              const bonds = hydrogenBondsCount(upperBase, lowerBase);
              const offsets = bonds === 3 ? [-5, 0, 5] : [-3, 3];
              const bondColor = upperBase === 'U' ? PALETTE.crimson : PALETTE.inkSubtle;

              return (
                <g key={`hbond-parent-${i}`}>
                  {offsets.map((dx, k) => (
                    <line
                      key={k}
                      x1={x + dx}
                      y1={yTop + 16}
                      x2={x + dx}
                      y2={yBot - 16}
                      stroke={bondColor}
                      strokeWidth="1.2"
                      strokeDasharray={upperBase === 'U' ? '3 3' : '2 3'}
                    />
                  ))}
                </g>
              );
            })}

            {/* STAGE 2: Broken hydrogen bond indicators + SSB stabilizing proteins */}
            {stage === 1 && (
              <g>
                {[2, 6].map((idx) => {
                  const x = startX + idx * stepX;
                  return (
                    <g key={`ssb-${idx}`}>
                      <rect
                        x={x - 18}
                        y={52}
                        width={36}
                        height={16}
                        fill={PALETTE.surface}
                        stroke={PALETTE.inkMuted}
                        strokeWidth="1"
                      />
                      <text
                        x={x}
                        y={63}
                        textAnchor="middle"
                        fill={PALETTE.inkMuted}
                        fontSize="8.5"
                        fontWeight="600"
                        fontFamily="IBM Plex Mono, ui-monospace, monospace"
                      >
                        SSB
                      </text>

                      <rect
                        x={x - 18}
                        y={324}
                        width={36}
                        height={16}
                        fill={PALETTE.surface}
                        stroke={PALETTE.inkMuted}
                        strokeWidth="1"
                      />
                      <text
                        x={x}
                        y={335}
                        textAnchor="middle"
                        fill={PALETTE.inkMuted}
                        fontSize="8.5"
                        fontWeight="600"
                        fontFamily="IBM Plex Mono, ui-monospace, monospace"
                      >
                        SSB
                      </text>
                    </g>
                  );
                })}
                <text
                  x={startX + 4 * stepX}
                  y={199}
                  textAnchor="middle"
                  fill={PALETTE.ochre}
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="IBM Plex Mono, ui-monospace, monospace"
                >
                  Puentes de hidrógeno rotos · Moldes expuestos
                </text>
              </g>
            )}

            {/* STAGE 2 & 3: ADN Helicasa Enzymatic Wedge at the Replication Fork */}
            {(stage === 1 || stage === 2) && (
              <g>
                <polygon
                  points={`${helicaseX - 34},172 ${helicaseX + 26},196 ${helicaseX - 34},220`}
                  fill={PALETTE.ochre}
                  stroke={PALETTE.ink}
                  strokeWidth="1.2"
                />
                <text
                  x={helicaseX - 11}
                  y={199}
                  textAnchor="middle"
                  fill={PALETTE.canvas}
                  fontSize="9.5"
                  fontWeight="700"
                  fontFamily="IBM Plex Mono, ui-monospace, monospace"
                >
                  Helicasa
                </text>
                <line
                  x1={helicaseX + 34}
                  y1={196}
                  x2={helicaseX + 76}
                  y2={196}
                  stroke={PALETTE.ochre}
                  strokeWidth="2"
                  markerEnd="url(#arrow-ochre)"
                />
                <text
                  x={helicaseX + 55}
                  y={186}
                  textAnchor="middle"
                  fill={PALETTE.ochre}
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="IBM Plex Mono, ui-monospace, monospace"
                >
                  Avance
                </text>
              </g>
            )}

            {/* STAGE 3: Newly Synthesized Strands (Okazaki on Top, Leading on Bottom) */}
            {stage === 2 && (
              <g>
                {/* Upper Lagging Strand: Okazaki Fragment 1 (i=0..4) + Okazaki Fragment 2 (i=6..10) */}
                <line
                  x1={startX}
                  y1={134}
                  x2={startX + 4 * stepX}
                  y2={134}
                  stroke={PALETTE.forest}
                  strokeWidth="3.5"
                  markerStart="url(#arrow-forest)"
                />
                <line
                  x1={startX + 6 * stepX}
                  y1={134}
                  x2={startX + 10 * stepX}
                  y2={134}
                  stroke={PALETTE.forest}
                  strokeWidth="3.5"
                  markerStart="url(#arrow-forest)"
                />
                {/* Ligase sealing nick at i=5 */}
                <rect
                  x={startX + 5 * stepX - 24}
                  y={124}
                  width={48}
                  height={20}
                  fill={PALETTE.forestSoft}
                  stroke={PALETTE.forest}
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                />
                <text
                  x={startX + 5 * stepX}
                  y={137}
                  textAnchor="middle"
                  fill={PALETTE.forest}
                  fontSize="9"
                  fontWeight="700"
                  fontFamily="IBM Plex Mono, ui-monospace, monospace"
                >
                  Ligasa
                </text>

                {/* Upper Lagging Strand Labels */}
                <text
                  x="56"
                  y={138}
                  textAnchor="end"
                  fill={PALETTE.forest}
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="IBM Plex Mono, ui-monospace, monospace"
                >
                  3&apos;
                </text>
                <text
                  x={startX + 10 * stepX + 26}
                  y={138}
                  fill={PALETTE.plum}
                  fontSize="10.5"
                  fontWeight="700"
                  fontFamily="IBM Plex Mono, ui-monospace, monospace"
                >
                  5&apos; (ARN)
                </text>
                <text
                  x={startX + 4.5 * stepX}
                  y={168}
                  textAnchor="middle"
                  fill={PALETTE.inkMuted}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="IBM Plex Mono, ui-monospace, monospace"
                >
                  ← Hebra rezagada discontinua (5&apos;→3&apos; · Fragmentos de Okazaki + Primasa)
                </text>

                {/* Lower Leading Strand: continuous synthesis 5'->3' (i=0..10) */}
                <line
                  x1={startX}
                  y1={258}
                  x2={startX + 10 * stepX}
                  y2={258}
                  stroke={PALETTE.forest}
                  strokeWidth="3.5"
                  markerEnd="url(#arrow-forest)"
                />
                <text
                  x="56"
                  y={262}
                  textAnchor="end"
                  fill={PALETTE.forest}
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="IBM Plex Mono, ui-monospace, monospace"
                >
                  5&apos;
                </text>
                {/* ADN Polimerasa III ring on leading strand */}
                <rect
                  x={startX + 10 * stepX + 18}
                  y={245}
                  width={92}
                  height={24}
                  fill={PALETTE.lapis}
                  stroke={PALETTE.ink}
                  strokeWidth="1"
                />
                <text
                  x={startX + 10 * stepX + 64}
                  y={260}
                  textAnchor="middle"
                  fill={PALETTE.canvas}
                  fontSize="9.5"
                  fontWeight="700"
                  fontFamily="IBM Plex Mono, ui-monospace, monospace"
                >
                  ADN Polimerasa
                </text>
                <text
                  x={startX + 4.5 * stepX}
                  y={230}
                  textAnchor="middle"
                  fill={PALETTE.forest}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="IBM Plex Mono, ui-monospace, monospace"
                >
                  Hebra líder continua (síntesis 5&apos;→3&apos; hacia la horquilla) →
                </text>

                {/* Render synthesized daughter nucleotides for Stage 3 */}
                {sequence.map((b, i) => {
                  if (i > 10) return null;
                  const x = startX + i * stepX;
                  const upperTemplate: RenderBase = deaminatedSet.has(i) ? 'U' : b;
                  const lowerTemplate: DnaBase = complementOf(b);

                  const upperDaughter = daughterBaseForTemplate(upperTemplate);
                  const lowerDaughter = complementOf(lowerTemplate);

                  const isPrimerPos = i === 4 || i === 10;
                  const skipUpperLagging = i === 5; // nick being sealed by ligase
                  const upperDaughterStyle = isPrimerPos
                    ? { fill: PALETTE.plumSoft, stroke: PALETTE.plum, text: PALETTE.plum }
                    : upperTemplate === 'U'
                      ? { fill: PALETTE.crimsonSoft, stroke: PALETTE.crimson, text: PALETTE.crimson }
                      : baseStyle(upperDaughter);
                  const lowerDaughterStyle = baseStyle(lowerDaughter);

                  return (
                    <g key={`synth-s3-${i}`}>
                      {/* Upper lagging daughter base */}
                      {!skipUpperLagging && (
                        <>
                          <line
                            x1={x}
                            y1={90}
                            x2={x}
                            y2={119}
                            stroke={upperTemplate === 'U' ? PALETTE.crimson : PALETTE.forest}
                            strokeWidth="1.2"
                            strokeDasharray="2 2"
                          />
                          <rect
                            x={x - 13}
                            y={121}
                            width={26}
                            height={26}
                            fill={upperDaughterStyle.fill}
                            stroke={upperDaughterStyle.stroke}
                            strokeWidth={isPrimerPos || upperTemplate === 'U' ? '1.8' : '1.3'}
                          />
                          <text
                            x={x}
                            y={138}
                            textAnchor="middle"
                            fill={upperDaughterStyle.text}
                            fontSize="12"
                            fontWeight="700"
                            fontFamily="IBM Plex Mono, ui-monospace, monospace"
                          >
                            {upperDaughter}
                          </text>
                        </>
                      )}

                      {/* Lower leading daughter base */}
                      <line
                        x1={x}
                        y1={272}
                        x2={x}
                        y2={302}
                        stroke={PALETTE.forest}
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                      />
                      <rect
                        x={x - 13}
                        y={245}
                        width={26}
                        height={26}
                        fill={lowerDaughterStyle.fill}
                        stroke={lowerDaughterStyle.stroke}
                        strokeWidth="1.3"
                      />
                      <text
                        x={x}
                        y={262}
                        textAnchor="middle"
                        fill={lowerDaughterStyle.text}
                        fontSize="12"
                        fontWeight="700"
                        fontFamily="IBM Plex Mono, ui-monospace, monospace"
                      >
                        {lowerDaughter}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* STAGE 4: Two Complete Semiconservative Daughter Duplexes */}
            {stage === 3 && (
              <g>
                {/* Daughter Strand A (paired to upper parental 5'->3') */}
                <line
                  x1={startX}
                  y1={146}
                  x2={startX + (sequence.length - 1) * stepX}
                  y2={146}
                  stroke={PALETTE.forest}
                  strokeWidth="3.5"
                />
                <text
                  x="56"
                  y={150}
                  textAnchor="end"
                  fill={PALETTE.forest}
                  fontSize="11.5"
                  fontWeight="700"
                  fontFamily="IBM Plex Mono, ui-monospace, monospace"
                >
                  3&apos;
                </text>
                <text
                  x={startX + (sequence.length - 1) * stepX + 32}
                  y={150}
                  fill={PALETTE.forest}
                  fontSize="11.5"
                  fontWeight="700"
                  fontFamily="IBM Plex Mono, ui-monospace, monospace"
                >
                  5&apos;
                </text>
                <text
                  x={W - 16}
                  y={150}
                  textAnchor="end"
                  fill={PALETTE.forest}
                  fontSize="9.5"
                  fontFamily="IBM Plex Mono, ui-monospace, monospace"
                >
                  Nueva (A)
                </text>

                {/* Daughter Strand B (paired to lower parental 3'->5') */}
                <line
                  x1={startX}
                  y1={248}
                  x2={startX + (sequence.length - 1) * stepX}
                  y2={248}
                  stroke={PALETTE.forest}
                  strokeWidth="3.5"
                />
                <text
                  x="56"
                  y={252}
                  textAnchor="end"
                  fill={PALETTE.forest}
                  fontSize="11.5"
                  fontWeight="700"
                  fontFamily="IBM Plex Mono, ui-monospace, monospace"
                >
                  5&apos;
                </text>
                <text
                  x={startX + (sequence.length - 1) * stepX + 32}
                  y={252}
                  fill={PALETTE.forest}
                  fontSize="11.5"
                  fontWeight="700"
                  fontFamily="IBM Plex Mono, ui-monospace, monospace"
                >
                  3&apos;
                </text>
                <text
                  x={W - 16}
                  y={252}
                  textAnchor="end"
                  fill={PALETTE.forest}
                  fontSize="9.5"
                  fontFamily="IBM Plex Mono, ui-monospace, monospace"
                >
                  Nueva (B)
                </text>

                {/* Nucleotides & H-bonds for both completed daughter duplexes */}
                {sequence.map((b, i) => {
                  const x = startX + i * stepX;
                  const upperTemplate: RenderBase = deaminatedSet.has(i) ? 'U' : b;
                  const lowerTemplate: DnaBase = complementOf(b);
                  const daughterA = daughterBaseForTemplate(upperTemplate);
                  const daughterB = complementOf(lowerTemplate);

                  const styleA =
                    upperTemplate === 'U'
                      ? { fill: PALETTE.crimsonSoft, stroke: PALETTE.crimson, text: PALETTE.crimson }
                      : baseStyle(daughterA);
                  const styleB = baseStyle(daughterB);

                  const bondsA = hydrogenBondsCount(upperTemplate, daughterA);
                  const bondsB = hydrogenBondsCount(daughterB, lowerTemplate);

                  return (
                    <g key={`s4-daughters-${i}`}>
                      {(bondsA === 3 ? [-4, 0, 4] : [-2.5, 2.5]).map((dx, k) => (
                        <line
                          key={`ba-${k}`}
                          x1={x + dx}
                          y1={98}
                          x2={x + dx}
                          y2={132}
                          stroke={upperTemplate === 'U' ? PALETTE.crimson : PALETTE.inkSubtle}
                          strokeWidth="1.1"
                          strokeDasharray="2 2"
                        />
                      ))}
                      <rect
                        x={x - 13}
                        y={133}
                        width={26}
                        height={26}
                        fill={styleA.fill}
                        stroke={styleA.stroke}
                        strokeWidth={upperTemplate === 'U' ? '1.8' : '1.3'}
                      />
                      <text
                        x={x}
                        y={150}
                        textAnchor="middle"
                        fill={styleA.text}
                        fontSize="12"
                        fontWeight="700"
                        fontFamily="IBM Plex Mono, ui-monospace, monospace"
                      >
                        {daughterA}
                      </text>
                      {upperTemplate === 'U' && (
                        <text
                          x={x}
                          y={173}
                          textAnchor="middle"
                          fill={PALETTE.crimson}
                          fontSize="8.5"
                          fontWeight="700"
                          fontFamily="IBM Plex Mono, ui-monospace, monospace"
                        >
                          U:A→T
                        </text>
                      )}

                      {(bondsB === 3 ? [-4, 0, 4] : [-2.5, 2.5]).map((dx, k) => (
                        <line
                          key={`bb-${k}`}
                          x1={x + dx}
                          y1={264}
                          x2={x + dx}
                          y2={297}
                          stroke={PALETTE.inkSubtle}
                          strokeWidth="1.1"
                          strokeDasharray="2 2"
                        />
                      ))}
                      <rect
                        x={x - 13}
                        y={235}
                        width={26}
                        height={26}
                        fill={styleB.fill}
                        stroke={styleB.stroke}
                        strokeWidth="1.3"
                      />
                      <text
                        x={x}
                        y={252}
                        textAnchor="middle"
                        fill={styleB.text}
                        fontSize="12"
                        fontWeight="700"
                        fontFamily="IBM Plex Mono, ui-monospace, monospace"
                      >
                        {daughterB}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Parental Nucleotide Tiles (clickable columns across all 4 stages) */}
            {sequence.map((b, i) => {
              const x = startX + i * stepX;
              const yTop = getUpperParentY(i);
              const yBot = getLowerParentY(i);
              const upperBase: RenderBase = deaminatedSet.has(i) ? 'U' : b;
              const lowerBase: DnaBase = complementOf(b);
              const sTop = baseStyle(upperBase);
              const sBot = baseStyle(lowerBase);
              const isSelected = selectedIndex === i;

              return (
                <g
                  key={`parent-bases-${i}`}
                  onClick={() => setSelectedIndex((prev) => (prev === i ? null : i))}
                  className="cursor-pointer"
                >
                  {/* Transparent column hit strip for easy clicking */}
                  <rect x={x - 20} y={38} width={40} height={H - 58} fill="transparent" />

                  {/* Upper parental base */}
                  <rect
                    x={x - 13}
                    y={yTop - 13}
                    width={26}
                    height={26}
                    fill={sTop.fill}
                    stroke={isSelected ? PALETTE.ink : sTop.stroke}
                    strokeWidth={isSelected ? '2.2' : sTop.dashed ? '1.8' : '1.4'}
                    strokeDasharray={sTop.dashed ? '3 2' : undefined}
                  />
                  <text
                    x={x}
                    y={yTop + 4}
                    textAnchor="middle"
                    fill={sTop.text}
                    fontSize="12"
                    fontWeight="700"
                    fontFamily="IBM Plex Mono, ui-monospace, monospace"
                  >
                    {upperBase}
                  </text>

                  {/* Lower parental base */}
                  <rect
                    x={x - 13}
                    y={yBot - 13}
                    width={26}
                    height={26}
                    fill={sBot.fill}
                    stroke={isSelected ? PALETTE.ink : sBot.stroke}
                    strokeWidth={isSelected ? '2.2' : '1.4'}
                  />
                  <text
                    x={x}
                    y={yBot + 4}
                    textAnchor="middle"
                    fill={sBot.text}
                    fontSize="12"
                    fontWeight="700"
                    fontFamily="IBM Plex Mono, ui-monospace, monospace"
                  >
                    {lowerBase}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Interactive Base-Pair Inspector OR Active Stage / Polymerase Readout */}
        <div className="mt-3.5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-7 bg-paper border border-hairline px-3.5 py-3 space-y-1.5">
            {inspectedInfo ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] tracking-wide text-lapis font-medium">
                    Posición seleccionada · Par #{inspectedInfo.pos} de {stats.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(null)}
                    className="font-mono text-[11px] text-ink-muted hover:text-ink underline underline-offset-4 cursor-pointer"
                  >
                    Ver síntesis de fase
                  </button>
                </div>
                <p className="text-xs text-ink leading-relaxed m-0">
                  <strong>Molde superior (5&apos;→3&apos;):</strong>{' '}
                  {baseFullName(inspectedInfo.upperBase)} → hija incorpora{' '}
                  <strong>{baseFullName(inspectedInfo.daughterOfUpper)}</strong> ·{' '}
                  <strong>Molde inferior (3&apos;→5&apos;):</strong>{' '}
                  {baseFullName(inspectedInfo.lowerBase)} → hija incorpora{' '}
                  <strong>{baseFullName(inspectedInfo.daughterOfLower)}</strong> (
                  {inspectedInfo.bonds} puentes H).
                </p>
                {inspectedInfo.isDeam ? (
                  <p className="text-xs text-crimson leading-relaxed m-0">
                    Daño post mortem activo: la citosina desaminada a uracilo (U) es leída como
                    timina por la ADN polimerasa, que incorpora adenina (A) en la 1.ª ronda; en la
                    2.ª ronda y en la lectura de secuenciación ese par U:A se fija como la
                    transición diagnóstica C→T del ADN antiguo.
                  </p>
                ) : inspectedInfo.isHl ? (
                  <p className="text-xs text-ochre leading-relaxed m-0">
                    {alternateVariant ? locus.highlightLabelAlternate : locus.highlightLabelDefault}
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <div className="font-mono text-[11px] tracking-wide text-ink font-medium">
                  Mecanismo en esta fase · Clic en cualquier base (1–{stats.length}) para
                  inspeccionar
                </div>
                <p className="text-xs text-ink-muted leading-relaxed m-0">
                  {stageMeta.explanation}
                </p>
                <p className="text-xs text-ink leading-relaxed m-0 pt-1 border-t border-hairline">
                  <strong className="font-medium">Efecto sobre esta secuencia:</strong>{' '}
                  {alternateVariant ? locus.polymeraseNoteAlternate : locus.polymeraseNoteDefault}
                </p>
              </>
            )}
          </div>

          {/* Coherent Color Key & Locus Highlight */}
          <div className="lg:col-span-5 bg-paper border border-hairline px-3.5 py-3 space-y-2">
            <div className="font-mono text-[11px] tracking-wide text-ink-muted">
              Leyenda cromática (identidad editorial)
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[11px] text-ink">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-1 bg-lapis shrink-0" aria-hidden="true" />
                <span>Parental 5&apos;→3&apos;</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-1 bg-ink shrink-0" aria-hidden="true" />
                <span>Parental 3&apos;→5&apos;</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-1 bg-forest shrink-0" aria-hidden="true" />
                <span>Nueva síntesis</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-ochre shrink-0" aria-hidden="true" />
                <span>Helicasa / Timina</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-plum shrink-0" aria-hidden="true" />
                <span>Cebador ARN</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-crimson shrink-0" aria-hidden="true" />
                <span>Daño 5&apos; C→U</span>
              </span>
            </div>
            <div className="pt-1.5 border-t border-hairline font-mono text-[10.5px] text-ink-muted leading-snug">
              Zona destacada:{' '}
              <span className="text-ink">
                {alternateVariant ? locus.highlightLabelAlternate : locus.highlightLabelDefault}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DnaReplicationDiagram2D;
