import { useMemo, useState } from 'react';
import { ArrowLeftRight, MessageSquare, RotateCcw, Sparkles } from 'lucide-react';
import {
  COGNITION_COMMUNICATION_PILLARS,
  COMPARATOR_METRIC_LABELS,
  COMPARATOR_SCENARIOS,
  COMPARATOR_SPECIES,
  buildComparativeInsight,
  type ComparatorScenarioId,
  type ComparatorSpeciesId,
} from '../../data/ethologyExtendedData';
import { GlossaryTermTrigger } from '../GlossaryContext';

const SPECIES_ORDER: ComparatorSpeciesId[] = ['chimpance', 'bonobo', 'gorila', 'babuino', 'gelada'];

export function CommunicationComparatorTab() {
  const [speciesAId, setSpeciesAId] = useState<ComparatorSpeciesId>('chimpance');
  const [speciesBId, setSpeciesBId] = useState<ComparatorSpeciesId>('bonobo');
  const [scenarioId, setScenarioId] = useState<ComparatorScenarioId>('conflicto-intragrupal');

  const speciesA = COMPARATOR_SPECIES[speciesAId];
  const speciesB = COMPARATOR_SPECIES[speciesBId];
  const activeScenario =
    COMPARATOR_SCENARIOS.find((s) => s.id === scenarioId) ?? COMPARATOR_SCENARIOS[0];

  const comparativeInsight = useMemo(
    () => buildComparativeInsight(speciesAId, speciesBId, scenarioId),
    [speciesAId, speciesBId, scenarioId]
  );

  const handleSwapSpecies = () => {
    setSpeciesAId(speciesBId);
    setSpeciesBId(speciesAId);
  };

  const handleReset = () => {
    setSpeciesAId('chimpance');
    setSpeciesBId('bonobo');
    setScenarioId('conflicto-intragrupal');
  };

  return (
    <div
      id="panel-etologia-comunicacion"
      role="tabpanel"
      aria-labelledby="tab-etologia-comunicacion"
      className="flex flex-col gap-7"
    >
      {/* Interactive Comparator Sandbox (Two-Zone Architecture) */}
      <div className="bg-paper border border-hairline p-5 sm:p-6 flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-hairline pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 font-mono text-xs text-lapis">
              <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Laboratorio interactivo · Comparador de sistemas sociales y comunicación</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink m-0">
              Contraste conductual cara a cara en primates africanos
            </h3>
            <p className="text-sm text-ink-muted m-0 max-w-[74ch]">
              Selecciona dos especies africanas y un escenario de campo para comparar sus perfiles
              sociales, sus señales gestuales y vocales y su significado para la evolución de la
              comunicación humana.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSwapSpecies}
              className="min-h-[38px] px-3 py-1.5 font-mono text-xs text-ink bg-canvas border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Intercambiar A/B</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="min-h-[38px] px-3 py-1.5 font-mono text-xs text-ink-muted bg-canvas border border-hairline rounded hover:border-ink hover:text-ink inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Pan vs. Pan</span>
            </button>
          </div>
        </div>

        {/* Control Deck: Species A, Species B & Field Scenario */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Species A Selector */}
          <div className="bg-canvas border border-hairline p-4 flex flex-col gap-2.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-[11px] font-semibold text-ochre">
                Modelo A · Referente principal
              </span>
              <span className="font-mono text-[11px] text-ink-muted italic">
                {speciesA.scientificName}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Seleccionar especie A">
              {SPECIES_ORDER.map((spId) => {
                const sp = COMPARATOR_SPECIES[spId];
                const active = speciesAId === spId;
                return (
                  <button
                    key={spId}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSpeciesAId(spId)}
                    className={`min-h-[36px] px-3 py-1.5 font-mono text-xs border rounded transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-ochre text-white border-ochre'
                        : 'bg-paper text-ink border-hairline hover:border-ink'
                    }`}
                  >
                    {sp.commonName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Species B Selector */}
          <div className="bg-canvas border border-hairline p-4 flex flex-col gap-2.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-[11px] font-semibold text-lapis">
                Modelo B · Especie de contraste
              </span>
              <span className="font-mono text-[11px] text-ink-muted italic">
                {speciesB.scientificName}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Seleccionar especie B">
              {SPECIES_ORDER.map((spId) => {
                const sp = COMPARATOR_SPECIES[spId];
                const active = speciesBId === spId;
                return (
                  <button
                    key={spId}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSpeciesBId(spId)}
                    className={`min-h-[36px] px-3 py-1.5 font-mono text-xs border rounded transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-lapis text-white border-lapis'
                        : 'bg-paper text-ink border-hairline hover:border-ink'
                    }`}
                  >
                    {sp.commonName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scenario Selector Bar */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] text-ink-muted">
            Escenario ecológico-social de observación:
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Escenario conductual">
            {COMPARATOR_SCENARIOS.map((sc) => {
              const active = sc.id === scenarioId;
              return (
                <button
                  key={sc.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setScenarioId(sc.id)}
                  className={`min-h-[38px] px-3.5 py-1.5 font-mono text-xs border rounded transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-ink text-white border-ink'
                      : 'bg-canvas text-ink border-hairline hover:border-ink'
                  }`}
                >
                  {sc.shortLabel}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-ink-muted m-0 pt-1">
            <strong className="text-ink">{activeScenario.title}:</strong> {activeScenario.context}
          </p>
        </div>

        {/* Visual Stage 1: Quantitative Comparative Bars (Tabular Numerals) */}
        <div className="bg-canvas border border-hairline p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-2.5">
            <span className="font-mono text-xs font-semibold text-ink">
              Perfil comparado en 5 dimensiones etológicas (escala relativa 0–100)
            </span>
            <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-ochre font-medium">
                <span className="w-3 h-2 bg-ochre inline-block" aria-hidden="true" />
                A: {speciesA.commonName}
              </span>
              <span className="inline-flex items-center gap-1.5 text-lapis font-medium">
                <span className="w-3 h-2 bg-lapis inline-block" aria-hidden="true" />
                B: {speciesB.commonName}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {COMPARATOR_METRIC_LABELS.map((metric) => {
              const valA = speciesA.metrics[metric.key];
              const valB = speciesB.metrics[metric.key];
              const delta = valA - valB;
              return (
                <div
                  key={metric.key}
                  className="flex flex-col gap-2 border-t border-hairline pt-2.5 md:border-t-0 md:pt-0"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-ink leading-tight">
                      {metric.shortLabel}
                    </span>
                    <span className="font-mono text-[10.5px] text-ink-muted tabular-nums">
                      Δ A−B: {delta > 0 ? `+${delta}` : delta} pts
                    </span>
                  </div>

                  {/* Bar A */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between font-mono text-[11px] tabular-nums">
                      <span className="text-ochre font-medium">A</span>
                      <span className="text-ink font-semibold">{valA}/100</span>
                    </div>
                    <div className="h-2 bg-paper border border-hairline overflow-hidden" aria-hidden="true">
                      <div
                        className="h-full bg-ochre transition-all duration-200"
                        style={{ width: `${valA}%` }}
                      />
                    </div>
                  </div>

                  {/* Bar B */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between font-mono text-[11px] tabular-nums">
                      <span className="text-lapis font-medium">B</span>
                      <span className="text-ink font-semibold">{valB}/100</span>
                    </div>
                    <div className="h-2 bg-paper border border-hairline overflow-hidden" aria-hidden="true">
                      <div
                        className="h-full bg-lapis transition-all duration-200"
                        style={{ width: `${valB}%` }}
                      />
                    </div>
                  </div>

                  <span className="text-[10.5px] leading-snug text-ink-muted">
                    {metric.scaleHint}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="font-mono text-[10.5px] text-ink-muted m-0 border-t border-hairline pt-2">
            Nota docente: los índices sintetizan tendencias relativas documentadas en literatura de
            campo comparada para facilitar la lectura visual en aula; consulta las respuestas
            conductuales detalladas debajo.
          </p>
        </div>

        {/* Visual Stage 2: Side-by-Side Scenario Behavior Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" aria-live="polite">
          {(
            [
              { slot: 'A' as const, spec: speciesA, labelTone: 'text-ochre', borderTone: 'border-ochre/60' },
              { slot: 'B' as const, spec: speciesB, labelTone: 'text-lapis', borderTone: 'border-lapis/60' },
            ] as const
          ).map(({ slot, spec, labelTone, borderTone }) => {
            const behavior = spec.scenarios[scenarioId];
            return (
              <article
                key={`${slot}-${spec.id}`}
                className={`bg-canvas border ${borderTone} p-5 flex flex-col gap-3.5`}
              >
                <div className="flex flex-col gap-0.5 border-b border-hairline pb-3">
                  <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                    <span className={`font-semibold ${labelTone}`}>
                      Modelo {slot} · {spec.socialUnit}
                    </span>
                    <span className="text-ink-muted">{spec.africanSites}</span>
                  </div>
                  <h4 className="font-display text-lg font-semibold text-ink m-0">
                    {spec.commonName}{' '}
                    <em className="font-normal text-sm text-ink-muted">({spec.scientificName})</em>
                  </h4>
                  <p className="text-xs text-ink-muted m-0">{spec.repertoireHighlight}</p>
                </div>

                <div className="flex flex-col gap-2.5 text-xs leading-relaxed">
                  <div>
                    <span className="font-mono text-[11px] text-ink-muted block">
                      Modalidad dominante en este escenario
                    </span>
                    <strong className="text-ink text-sm">{behavior.primaryModality}</strong>
                  </div>

                  <div>
                    <span className="font-mono text-[11px] text-ochre block">
                      Señales gestuales, posturales y táctiles
                    </span>
                    <p className="text-ink m-0">{behavior.gesturalAndTactile}</p>
                  </div>

                  <div>
                    <span className="font-mono text-[11px] text-lapis block">
                      Señales vocales y acústicas
                    </span>
                    <p className="text-ink m-0">{behavior.vocalAndAcoustic}</p>
                  </div>

                  <div>
                    <span className="font-mono text-[11px] text-forest block">
                      Resultado social observado
                    </span>
                    <p className="text-ink m-0">{behavior.socialOutcome}</p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-hairline font-mono text-[11px] text-ink-muted">
                  Evidencia de campo: {behavior.fieldEvidence}
                </div>
              </article>
            );
          })}
        </div>

        {/* Dynamic Anthropological Synthesis Banner */}
        <div className="bg-canvas border border-ink p-4 sm:p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-ochre">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Síntesis comparada · {comparativeInsight.headline}</span>
          </div>
          <p className="text-sm leading-relaxed text-ink m-0">
            {comparativeInsight.contrastSummary}
          </p>
          <p className="text-xs leading-relaxed text-ink-muted m-0 pt-1 border-t border-hairline">
            <strong className="text-ink">Clave evolutiva:</strong>{' '}
            {comparativeInsight.evolutionaryTakeaway}
          </p>
        </div>
      </div>

      {/* Multimodal Communication & Social Cognition Editorial Dossier */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-2">
          <h3 className="font-display text-xl font-semibold text-ink m-0">
            Gestos intencionales, comunicación acústica y cognición social
          </h3>
          <span className="font-mono text-xs text-ink-muted">
            4 pilares empíricos de la primatología cognitiva africana
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {COGNITION_COMMUNICATION_PILLARS.map((pillar) => (
            <article
              key={pillar.id}
              className="bg-canvas border border-hairline p-5 flex flex-col gap-3"
            >
              <div className="flex flex-col gap-0.5 border-b border-hairline pb-2.5">
                <h4 className="font-display text-lg font-semibold text-ink m-0">
                  {pillar.title}
                </h4>
                <span className="font-mono text-[11px] text-lapis">{pillar.subtitle}</span>
              </div>

              <p className="text-sm leading-relaxed text-ink m-0">{pillar.summary}</p>

              <p className="text-xs leading-relaxed text-ink-muted m-0">
                <strong className="text-ink">Hallazgo clave:</strong> {pillar.empiricalFinding}
              </p>

              <div className="pt-2.5 mt-auto border-t border-hairline flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-ink-muted">
                <span>
                  {pillar.africanSites} · {pillar.citation}
                </span>
                <GlossaryTermTrigger termId={pillar.glossaryTermId} tone="ochre">
                  Glosario: {pillar.glossaryLabel}
                </GlossaryTermTrigger>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
