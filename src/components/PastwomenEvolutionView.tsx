import { useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Compass,
  ExternalLink,
  HeartHandshake,
  Layers,
  Map as MapIcon,
  Scale,
} from 'lucide-react';
import {
  MAINTENANCE_ACTIVITIES_MATRIX,
  PASTWOMEN_EVOLUTION_STAGES,
  PASTWOMEN_EVOLUTION_STATS,
  PASTWOMEN_MYTH_CONTRASTS,
  PASTWOMEN_PORTAL_URL,
  type MaintenanceActivityRow,
} from '../data/pastwomenEvolutionData';
import { GlossaryTermTrigger } from './GlossaryContext';

interface PastwomenEvolutionViewProps {
  onOpenTopic: (topicId: string, options?: { view3d?: boolean }) => void;
  onOpenMigrations?: () => void;
}

export function PastwomenEvolutionView({
  onOpenTopic,
  onOpenMigrations,
}: PastwomenEvolutionViewProps) {
  const [selectedStageId, setSelectedStageId] = useState<string>(PASTWOMEN_EVOLUTION_STAGES[0].id);
  const [selectedMythId, setSelectedMythId] = useState<string>(PASTWOMEN_MYTH_CONTRASTS[0].id);

  const activeStage =
    PASTWOMEN_EVOLUTION_STAGES.find((s) => s.id === selectedStageId) ??
    PASTWOMEN_EVOLUTION_STAGES[0];
  const activeMyth =
    PASTWOMEN_MYTH_CONTRASTS.find((m) => m.id === selectedMythId) ??
    PASTWOMEN_MYTH_CONTRASTS[0];

  const handleMaintenanceAction = (action: MaintenanceActivityRow['targetAction']) => {
    if (action.type === 'topic') {
      onOpenTopic(action.topicId, { view3d: action.view3d });
      return;
    }
    window.dispatchEvent(
      new CustomEvent('ulpgc:navigate-course', {
        detail: { sectionId: 'etologia', ethology: { tab: action.tab } },
      })
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Framing Banner + Direct Link to pastwomen.net */}
      <div className="bg-paper border border-hairline p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-rule pb-4">
          <div className="flex flex-col gap-1.5 max-w-[74ch]">
            <div className="flex items-center gap-2 font-mono text-xs text-ochre">
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Perspectiva integrada · Red Temática Pastwomen (Evolución Humana y Paleolítico)</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink m-0">
              Evolución humana desde las actividades de mantenimiento, el cuidado y la corporalidad
            </h3>
            <p className="text-sm leading-relaxed text-ink m-0">
              Los datos y materiales del proyecto interuniversitario <strong>Pastwomen</strong>{' '}
              revisan el proceso de{' '}
              <GlossaryTermTrigger termId="hominizacion-humanizacion" tone="ochre">
                hominización y humanización
              </GlossaryTermTrigger>{' '}
              a partir de evidencias osteológicas, isotópicas y arqueológicas: del bipedismo y
              pelvis de <em>Australopithecus afarensis</em> al dilema obstétrico, el parto asistido,
              la recolección vegetal, la infancia prolongada y la arqueología de los cuidados.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={PASTWOMEN_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[40px] px-4 py-2 font-mono text-xs text-white bg-ink border border-ink rounded hover:bg-ochre hover:border-ochre inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Abrir portal pastwomen.net</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
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

        {/* 4-Column Quantitative & Institutional Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PASTWOMEN_EVOLUTION_STATS.map((stat) => {
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

      {/* Section 1: 4-Stage Interactive Human Evolution Timeline (Pastwomen Synthesis) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-2">
          <div className="flex items-center gap-2 font-mono text-xs text-lapis">
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Cronología evolutiva revisada (4,2 Ma – 10 ka)</span>
          </div>
          <span className="font-mono text-[11px] text-ink-muted">
            Selecciona cada etapa para consultar datos osteológicos y lectura de Pastwomen
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Stage List */}
          <div
            className="lg:col-span-4 flex flex-col gap-2"
            role="listbox"
            aria-label="Etapas de evolución humana según Pastwomen"
          >
            {PASTWOMEN_EVOLUTION_STAGES.map((stage) => {
              const active = stage.id === activeStage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => setSelectedStageId(stage.id)}
                  className={`p-4 text-left border transition-colors cursor-pointer flex flex-col gap-1 ${
                    active
                      ? 'bg-paper border-ink'
                      : 'bg-canvas border-hairline hover:border-ink/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                    <span className="text-ochre font-semibold">{stage.chronology}</span>
                    <span className="text-ink-muted">{active ? 'Activa' : 'Ver'}</span>
                  </div>
                  <span className="font-display text-sm sm:text-base font-semibold text-ink leading-snug">
                    {stage.eraLabel}
                  </span>
                  <span className="font-mono text-[11px] italic text-ink-muted">
                    {stage.taxa}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Stage Dossier */}
          <article className="lg:col-span-8 bg-canvas border border-hairline p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1 border-b border-rule pb-4">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-ink-muted">
                <span className="text-ochre font-semibold">{activeStage.chronology}</span>
                <span aria-hidden="true">·</span>
                <span className="italic">{activeStage.taxa}</span>
                <span aria-hidden="true">·</span>
                <span>{activeStage.africanAndGlobalSites}</span>
              </div>
              <h4 className="font-display text-xl font-semibold text-ink m-0">
                {activeStage.title}
              </h4>
            </div>

            {/* Key Quantitative / Bioanthropological Data Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-paper border border-hairline p-3.5">
              {activeStage.keyMetrics.map((m) => (
                <div key={m.label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-[10.5px] text-ink-muted">{m.label}</span>
                  <span className="font-mono text-sm font-semibold tabular-nums text-ink">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm leading-relaxed">
              <div className="flex flex-col gap-1.5 border-t border-hairline pt-3">
                <span className="font-mono text-[11px] text-lapis font-semibold">
                  Evidencia biológica y arqueológica
                </span>
                <p className="text-ink m-0">{activeStage.biologicalAndMaterialEvidence}</p>
              </div>

              <div className="flex flex-col gap-1.5 border-t border-hairline pt-3">
                <span className="font-mono text-[11px] text-ochre font-semibold">
                  Lectura científica desde Pastwomen
                </span>
                <p className="text-ink m-0">{activeStage.pastwomenPerspective}</p>
              </div>
            </div>

            <div className="bg-paper border border-hairline p-3.5 text-xs leading-relaxed text-ink">
              <span className="font-mono text-[10.5px] text-forest font-semibold block mb-1">
                Actividades de mantenimiento destacadas en esta etapa
              </span>
              {activeStage.maintenanceFocus}
            </div>

            <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[11px] text-ink-muted">
                Fuentes: {activeStage.citation}
              </span>
              <button
                type="button"
                onClick={() => onOpenTopic(activeStage.linkedTopicId)}
                className="min-h-[36px] px-3 py-1.5 font-mono text-xs text-ink bg-paper border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Conectar con {activeStage.linkedTopicLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
              </button>
            </div>
          </article>
        </div>
      </div>

      {/* Section 2: Interactive Deconstruction of the "March of Progress" */}
      <div className="bg-paper border border-hairline p-5 sm:p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1 border-b border-hairline pb-3.5">
          <div className="flex items-center gap-2 font-mono text-xs text-ochre">
            <Scale className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Contraste interactivo · Deconstrucción de la «Marcha del Progreso»</span>
          </div>
          <h4 className="font-display text-lg sm:text-xl font-semibold text-ink m-0">
            Relato androcéntrico clásico frente a evidencia bioarqueológica (Pastwomen)
          </h4>
          <p className="text-xs sm:text-sm text-ink-muted m-0">
            Elige uno de los cinco ejes críticos para contrastar cómo la arqueología de género
            corrige los sesgos habituales en la enseñanza de la evolución humana.
          </p>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Ejes de contraste evolutivo">
          {PASTWOMEN_MYTH_CONTRASTS.map((item) => {
            const active = item.id === activeMyth.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedMythId(item.id)}
                className={`min-h-[38px] px-3.5 py-1.5 font-mono text-xs border rounded transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-ink text-white border-ink'
                    : 'bg-canvas text-ink border-hairline hover:border-ink'
                }`}
              >
                {item.axisShort}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-live="polite">
          <div className="bg-canvas border border-ochre/60 p-4 flex flex-col gap-2">
            <span className="font-mono text-[11px] font-semibold text-ochre">
              Sesgo tradicional · {activeMyth.axisTitle}
            </span>
            <p className="text-sm leading-relaxed text-ink m-0">{activeMyth.androcentricMyth}</p>
          </div>

          <div className="bg-canvas border border-forest/60 p-4 flex flex-col gap-2">
            <span className="font-mono text-[11px] font-semibold text-forest">
              Evidencia bioarqueológica y material
            </span>
            <p className="text-sm leading-relaxed text-ink m-0">
              {activeMyth.bioarchaeologicalEvidence}
            </p>
          </div>
        </div>

        <div className="bg-canvas border border-hairline p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div>
            <span className="font-mono text-[10.5px] text-lapis font-semibold block mb-0.5">
              Indicadores materiales verificables
            </span>
            <p className="text-ink m-0">{activeMyth.keyMaterialIndicators}</p>
          </div>
          <div>
            <span className="font-mono text-[10.5px] text-forest font-semibold block mb-0.5">
              Aporte didáctico de Pastwomen
            </span>
            <p className="text-ink m-0">{activeMyth.pastwomenImplication}</p>
          </div>
        </div>
      </div>

      {/* Section 3: Maintenance Activities Matrix with Direct Cross-Links */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-xs text-forest">
            <HeartHandshake className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Matriz de actividades de mantenimiento en evolución humana</span>
          </div>
          <span className="font-mono text-[11px] text-ink-muted">
            Conectada con los temas, laboratorios 3D y talleres del Diploma ULPGC
          </span>
        </div>

        <div className="overflow-x-auto border border-hairline bg-canvas">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-paper border-b border-rule font-mono text-[11px] tracking-wide text-ink-muted">
                <th className="py-3 px-4 font-semibold">Ámbito de mantenimiento</th>
                <th className="py-3 px-4 font-semibold">Papel en la evolución humana</th>
                <th className="py-3 px-4 font-semibold">Indicadores arqueológicos</th>
                <th className="py-3 px-4 font-semibold">Conexión en el curso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline text-xs leading-relaxed text-ink">
              {MAINTENANCE_ACTIVITIES_MATRIX.map((row) => (
                <tr key={row.id} className="align-top hover:bg-paper/60 transition-colors">
                  <td className="py-3.5 px-4 font-display text-sm font-semibold text-ink">
                    {row.sphere}
                  </td>
                  <td className="py-3.5 px-4">{row.evolutionaryRole}</td>
                  <td className="py-3.5 px-4 text-ink-muted">{row.archaeologicalTrace}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col items-start gap-2">
                      <span className="font-mono text-[10.5px] text-ink-muted">
                        {row.diplomaConnection}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleMaintenanceAction(row.targetAction)}
                        className="min-h-[40px] px-3 py-1.5 font-mono text-xs text-ink bg-paper border border-hairline rounded hover:border-ink inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <span>{row.targetAction.label}</span>
                        <ArrowUpRight className="w-3 h-3 text-ochre" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-ink-muted font-mono">
          <span className="inline-flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-lapis" aria-hidden="true" />
            <span>
              Recurso abierto de referencia: Red Temática Pastwomen (UAB, UJA, UGR, UAM, UPF, UV, UniOvi)
            </span>
          </span>
          <a
            href={PASTWOMEN_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lapis hover:text-ochre underline underline-offset-4 inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>Consultar láminas y cuadernos en pastwomen.net</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
