import { useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  Box,
  Compass,
  ExternalLink,
  Globe2,
  Layers,
  Map as MapIcon,
  Sparkles,
} from 'lucide-react';
import {
  OLORGESAILIE_TRANSITION_PHASES,
  SMITHSONIAN_HUMAN_TRAITS,
  SMITHSONIAN_MILESTONES,
  SMITHSONIAN_PORTAL_URL,
  SMITHSONIAN_STATS,
} from '../data/smithsonianHumanOriginsData';
import { GlossaryTermTrigger } from './GlossaryContext';

interface SmithsonianHumanOriginsViewProps {
  onOpenTopic: (topicId: string, options?: { view3d?: boolean }) => void;
  onOpenMigrations?: () => void;
}

export function SmithsonianHumanOriginsView({
  onOpenTopic,
  onOpenMigrations,
}: SmithsonianHumanOriginsViewProps) {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    SMITHSONIAN_MILESTONES[5].id
  );
  const [selectedTraitId, setSelectedTraitId] = useState<string>(SMITHSONIAN_HUMAN_TRAITS[0].id);

  const activeMilestone =
    SMITHSONIAN_MILESTONES.find((m) => m.id === selectedMilestoneId) ?? SMITHSONIAN_MILESTONES[0];
  const activeTrait =
    SMITHSONIAN_HUMAN_TRAITS.find((t) => t.id === selectedTraitId) ?? SMITHSONIAN_HUMAN_TRAITS[0];

  const openAtlasTarget = (tab: 'cronologia' | 'laboratorios' | 'clima', taxonId?: string) => {
    window.dispatchEvent(
      new CustomEvent('ulpgc:navigate-course', {
        detail: { sectionId: 'sec-atlas-paleo', atlas: { tab, taxonId } },
      })
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Editorial Masthead + Direct Link to humanorigins.si.edu */}
      <div className="bg-paper border border-hairline p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-rule pb-4">
          <div className="flex flex-col gap-1.5 max-w-[74ch]">
            <div className="flex items-center gap-2 font-mono text-xs text-lapis">
              <Globe2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                Smithsonian National Museum of Natural History · Human Origins Program (Dir. Rick Potts)
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink m-0">
              ¿Qué significa ser humano? Evolución en mosaico y selección por variabilidad
            </h3>
            <p className="text-sm leading-relaxed text-ink m-0">
              Los datos del <strong>Smithsonian Human Origins Program</strong> sintetizan seis
              millones de años de evidencia fósil, arqueológica y paleoclimática africana: un árbol
              familiar ramificado donde los rasgos humanos emergieron de forma escalonada y donde la{' '}
              <GlossaryTermTrigger termId="seleccion-variabilidad" tone="lapis">
                selección por variabilidad
              </GlossaryTermTrigger>{' '}
              —documentada en la cuenca keniana de Olorgesailie— premió la flexibilidad adaptativa
              frente a los cambios climáticos extremos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={SMITHSONIAN_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[40px] px-4 py-2 font-mono text-xs text-white bg-ink border border-ink rounded hover:bg-lapis hover:border-lapis inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Abrir humanorigins.si.edu</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => openAtlasTarget('laboratorios')}
              className="min-h-[40px] px-3.5 py-2 font-mono text-xs text-ink bg-canvas border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Box className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
              <span>Abrir 5 cráneos 3D (Smithsonian)</span>
            </button>
            {onOpenMigrations && (
              <button
                type="button"
                onClick={onOpenMigrations}
                className="min-h-[40px] px-3.5 py-2 font-mono text-xs text-forest bg-canvas border border-forest/60 rounded hover:bg-forest hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <MapIcon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Mapa migratorio (D3)</span>
              </button>
            )}
          </div>
        </div>

        {/* 4-Column Quantitative Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SMITHSONIAN_STATS.map((stat) => {
            const tone =
              stat.accent === 'ochre'
                ? 'text-ochre'
                : stat.accent === 'lapis'
                  ? 'text-lapis'
                  : stat.accent === 'forest'
                    ? 'text-forest'
                    : 'text-ink';
            return (
              <div key={stat.label} className="border-t border-hairline pt-2.5 flex flex-col gap-1">
                <span className="font-mono text-[11px] text-ink-muted">{stat.label}</span>
                <span className={`font-mono text-lg sm:text-xl font-semibold tabular-nums ${tone}`}>
                  {stat.value}
                </span>
                <span className="text-xs text-ink-muted leading-snug">{stat.detail}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 1: Interactive 6-Million-Year Smithsonian Timeline */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-2">
          <div className="flex items-center gap-2 font-mono text-xs text-lapis">
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Hitos evolutivos interactivos (6 Ma – presente)</span>
          </div>
          <span className="font-mono text-[11px] text-ink-muted">
            Basado en la Human Evolution Timeline del Smithsonian Institution
          </span>
        </div>

        {/* Horizontal Age Stepper Buttons */}
        <div
          className="flex items-center gap-2 overflow-x-auto sm:flex-wrap pb-1"
          role="listbox"
          aria-label="Hitos cronológicos del Smithsonian Human Origins"
        >
          {SMITHSONIAN_MILESTONES.map((ms) => {
            const active = ms.id === activeMilestone.id;
            return (
              <button
                key={ms.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => setSelectedMilestoneId(ms.id)}
                className={`min-h-[38px] px-3.5 py-1.5 font-mono text-xs border rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 tabular-nums ${
                  active
                    ? 'bg-lapis text-white border-lapis font-semibold'
                    : 'bg-paper text-ink border-hairline hover:border-ink'
                }`}
              >
                {ms.ageLabel}
              </button>
            );
          })}
        </div>

        {/* Active Milestone Dossier */}
        <article className="bg-canvas border border-hairline p-5 sm:p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1 border-b border-rule pb-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-ink-muted">
              <span className="text-lapis font-semibold tabular-nums">
                {activeMilestone.ageLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span className="italic">{activeMilestone.taxa}</span>
              <span aria-hidden="true">·</span>
              <span>{activeMilestone.africanSites}</span>
            </div>
            <h4 className="font-display text-xl font-semibold text-ink m-0">
              {activeMilestone.title}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-paper border border-hairline p-4 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[10.5px] text-ink-muted">
                Capacidad encefálica característica
              </span>
              <span className="font-mono text-sm font-semibold tabular-nums text-ink">
                {activeMilestone.brainRange}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[10.5px] text-ink-muted">
                Contexto climático y ecológico
              </span>
              <span className="font-semibold text-ink">{activeMilestone.climateContext}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm leading-relaxed">
            <div className="flex flex-col gap-1.5 border-t border-hairline pt-3">
              <span className="font-mono text-[11px] text-ochre font-semibold">
                Evidencia fósil y arqueológica africana
              </span>
              <p className="text-ink m-0">{activeMilestone.evidenceSummary}</p>
            </div>
            <div className="flex flex-col gap-1.5 border-t border-hairline pt-3">
              <span className="font-mono text-[11px] text-lapis font-semibold">
                Interpretación del Smithsonian Human Origins Program
              </span>
              <p className="text-ink m-0">{activeMilestone.smithsonianInsight}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenTopic(activeMilestone.linkedTopicId)}
                className="min-h-[36px] px-3 py-1.5 font-mono text-xs text-ink bg-paper border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Ver tema vinculado del temario</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
              </button>
              {activeMilestone.atlasTaxonId && (
                <button
                  type="button"
                  onClick={() => openAtlasTarget('cronologia', activeMilestone.atlasTaxonId)}
                  className="min-h-[36px] px-3 py-1.5 font-mono text-xs text-lapis bg-paper border border-hairline rounded hover:border-lapis inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Inspeccionar fósil en el Atlas</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
            <span className="font-mono text-[11px] text-ink-muted">
              Fuente: Smithsonian Human Origins (humanorigins.si.edu)
            </span>
          </div>
        </article>
      </div>

      {/* Section 2: The 6 Mosaic Human Characteristics */}
      <div className="bg-paper border border-hairline p-5 sm:p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1 border-b border-hairline pb-3.5">
          <div className="flex items-center gap-2 font-mono text-xs text-ochre">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Human Characteristics · Los 6 rasgos que evolucionaron en mosaico</span>
          </div>
          <h4 className="font-display text-lg sm:text-xl font-semibold text-ink m-0">
            Los rasgos humanos no aparecieron simultáneamente, sino escalonados durante 6 Ma
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SMITHSONIAN_HUMAN_TRAITS.map((trait) => {
            const active = trait.id === activeTrait.id;
            return (
              <button
                key={trait.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedTraitId(trait.id)}
                className={`p-4 text-left border transition-colors cursor-pointer flex flex-col gap-1.5 ${
                  active
                    ? 'bg-canvas border-ink'
                    : 'bg-canvas/70 border-hairline hover:border-ink/60'
                }`}
              >
                <div className="flex items-baseline justify-between gap-2 font-mono text-[11px]">
                  <span className="text-lapis font-semibold tabular-nums">{trait.onsetMa}</span>
                  <span className="text-ink-muted">{trait.englishName}</span>
                </div>
                <span className="font-display text-base font-semibold text-ink">
                  {trait.spanishName}
                </span>
                <span className="text-xs leading-snug text-ink-muted">{trait.keyShift}</span>
              </button>
            );
          })}
        </div>

        {/* Focused Readout for Active Trait */}
        <div
          className="bg-canvas border border-ink p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed"
          aria-live="polite"
        >
          <div>
            <span className="font-mono text-[10.5px] text-ochre font-semibold block mb-1">
              Evidencia africana ({activeTrait.spanishName} · {activeTrait.onsetMa})
            </span>
            <p className="text-ink m-0">{activeTrait.africanEvidence}</p>
          </div>
          <div>
            <span className="font-mono text-[10.5px] text-forest font-semibold block mb-1">
              Clave del patrón en mosaico
            </span>
            <p className="text-ink m-0">{activeTrait.mosaicNote}</p>
          </div>
        </div>
      </div>

      {/* Section 3: Variability Selection & Olorgesailie Basin (Kenya) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-2">
          <div className="flex items-center gap-2 font-mono text-xs text-forest">
            <Activity className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Selección por variabilidad y Cuenca de Olorgesailie (Kenia · Rick Potts)</span>
          </div>
          <button
            type="button"
            onClick={() => openAtlasTarget('clima')}
            className="font-mono text-xs text-lapis hover:text-ochre underline underline-offset-4 cursor-pointer"
          >
            Contrastar con Clima y Ecología del Atlas
          </button>
        </div>

        {/* Conceptual Climate Variability SVG Schematic */}
        <div className="bg-paper border border-hairline p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-mono text-xs font-semibold text-ink">
              Hipótesis de Selección por Variabilidad: «supervivencia de los más adaptables»
            </span>
            <span className="font-mono text-[11px] text-ink-muted">
              Potts (1998); Potts et al. (2018, 2020), Science / Science Advances
            </span>
          </div>

          <svg
            viewBox="0 0 720 154"
            className="w-full h-auto block select-none"
            role="img"
            aria-label="Esquema de amplitud climática creciente del Plio-Pleistoceno africano y correlación con innovaciones humanas según el Smithsonian"
          >
            <rect x="0" y="0" width="720" height="154" fill="#fbfbf9" />
            <line x1="44" y1="118" x2="690" y2="118" stroke="#c8c8c0" strokeWidth="1" />
            <line x1="44" y1="22" x2="44" y2="118" stroke="#c8c8c0" strokeWidth="1" />

            {/* Increasing climate oscillation wave from 6 Ma to 0 Ma */}
            <path
              d="M 52 74 Q 72 68 92 74 T 132 74 T 172 74 Q 192 62 212 75 T 252 75 Q 272 58 292 76 T 332 76 Q 352 50 372 78 T 412 78 Q 430 42 448 80 T 484 80 Q 500 32 516 86 T 548 86 Q 564 26 580 94 T 612 94 Q 628 24 644 100 T 676 96"
              fill="none"
              stroke="#1f5fa8"
              strokeWidth="2"
            />

            {/* Milestone markers */}
            {[
              { x: 64, label: '6 Ma', note: 'Bipedismo' },
              { x: 255, label: '2,6 Ma', note: 'Olduvayense' },
              { x: 374, label: '1,8 Ma', note: 'H. erectus' },
              { x: 520, label: '800 ka', note: 'Salto cerebral' },
              { x: 626, label: '320 ka', note: 'Olorgesailie MSA' },
            ].map((pt) => (
              <g key={pt.label}>
                <line
                  x1={pt.x}
                  y1="22"
                  x2={pt.x}
                  y2="118"
                  stroke="#b43c0b"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.7"
                />
                <circle cx={pt.x} cy="118" r="3.5" fill="#b43c0b" />
                <text
                  x={pt.x}
                  y="133"
                  textAnchor="middle"
                  fill="#121212"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {pt.label}
                </text>
                <text
                  x={pt.x}
                  y="146"
                  textAnchor="middle"
                  fill="#b43c0b"
                  fontSize="9.5"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {pt.note}
                </text>
              </g>
            ))}

            <text
              x="54"
              y="16"
              fill="#1f5fa8"
              fontSize="10"
              fontFamily="IBM Plex Mono, monospace"
            >
              Amplitud de fluctuación climática (húmedo ↔ seco · frío ↔ cálido)
            </text>
          </svg>
        </div>

        {/* Olorgesailie Basin 3-Phase Archaeological Table */}
        <div className="overflow-x-auto border border-hairline bg-canvas">
          <table className="w-full text-left border-collapse min-w-[740px]">
            <thead>
              <tr className="bg-paper border-b border-rule font-mono text-[11px] tracking-wide text-ink-muted">
                <th className="py-3 px-4 font-semibold">Fase en Olorgesailie</th>
                <th className="py-3 px-4 font-semibold">Industria y tecnología</th>
                <th className="py-3 px-4 font-semibold">Transporte de materias primas</th>
                <th className="py-3 px-4 font-semibold">Pigmentos y redes / ambiente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline text-xs leading-relaxed text-ink">
              {OLORGESAILIE_TRANSITION_PHASES.map((phase) => (
                <tr key={phase.id} className="align-top hover:bg-paper/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-lapis whitespace-nowrap tabular-nums">
                    {phase.period}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-ink">{phase.industry}</td>
                  <td className="py-3.5 px-4">{phase.transportDistance}</td>
                  <td className="py-3.5 px-4 text-ink-muted">
                    <span className="text-ink block">{phase.pigmentsAndNetworks}</span>
                    <span className="block mt-1">{phase.environmentalShift}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-ink-muted font-mono">
          <span className="inline-flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-lapis" aria-hidden="true" />
            <span>
              Datos científicos basados en Smithsonian Institution — National Museum of Natural History
            </span>
          </span>
          <a
            href={SMITHSONIAN_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lapis hover:text-ochre underline underline-offset-4 inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>Explorar fósiles y línea temporal en humanorigins.si.edu</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
