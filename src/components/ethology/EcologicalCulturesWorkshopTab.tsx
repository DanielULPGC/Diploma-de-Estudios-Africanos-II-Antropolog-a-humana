import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Leaf,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import {
  AFRICAN_CULTURAL_VARIANTS,
  ECOLOGICAL_CULTURE_PILLARS,
  ETHOLOGY_WORKSHOP_CASES,
  type CulturalDomainId,
} from '../../data/ethologyExtendedData';
import { GlossaryTermTrigger } from '../GlossaryContext';
import { SavannaSelfMedicationWorksheet } from './SavannaSelfMedicationWorksheet';

const DOMAIN_FILTERS: Array<{ id: 'todos' | CulturalDomainId; label: string }> = [
  { id: 'todos', label: 'Todas las tradiciones (8)' },
  { id: 'vegetal', label: 'Cultura vegetal' },
  { id: 'sabana-caza', label: 'Sabana y caza' },
  { id: 'automedicacion', label: 'Automedicación' },
  { id: 'social-ritual', label: 'Tradición social' },
];

export function EcologicalCulturesWorkshopTab() {
  const [domainFilter, setDomainFilter] = useState<'todos' | CulturalDomainId>('todos');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const visibleVariants = useMemo(() => {
    if (domainFilter === 'todos') return AFRICAN_CULTURAL_VARIANTS;
    return AFRICAN_CULTURAL_VARIANTS.filter((item) => item.domain === domainFilter);
  }, [domainFilter]);

  const answeredCount = Object.keys(answers).length;
  const correctCount = useMemo(
    () =>
      ETHOLOGY_WORKSHOP_CASES.reduce(
        (acc, item) => (answers[item.id] === item.correctOptionId ? acc + 1 : acc),
        0
      ),
    [answers]
  );

  const handleSelectAnswer = (caseId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [caseId]: optionId }));
  };

  const handleResetWorkshop = () => {
    setAnswers({});
  };

  return (
    <div
      id="panel-etologia-culturas-taller"
      role="tabpanel"
      aria-labelledby="tab-etologia-culturas-taller"
      className="flex flex-col gap-8"
    >
      {/* Editorial Intro: Overcoming the Lithic Bias */}
      <div className="bg-paper border border-hairline p-5 flex flex-col gap-2">
        <div className="flex items-center gap-2 font-mono text-xs text-forest">
          <Leaf className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Más allá de la piedra · Culturas orgánicas, ecología de sabana y botánica primate</span>
        </div>
        <p className="text-sm leading-relaxed text-ink m-0 max-w-[78ch]">
          Aunque los yunques y percutores de piedra capturan la atención arqueológica por su
          durabilidad, la inmensa mayoría de la cultura material de los grandes simios africanos es
          vegetal y perecedera. Analizar los{' '}
          <GlossaryTermTrigger termId="kit-cultural-compuesto" tone="forest">
            kits culturales compuestos
          </GlossaryTermTrigger>{' '}
          de Goualougo, la{' '}
          <GlossaryTermTrigger termId="adaptacion-sabana-fongoli" tone="ochre">
            adaptación a la sabana de Fongoli
          </GlossaryTermTrigger>{' '}
          y la{' '}
          <GlossaryTermTrigger termId="zoofarmacognosia" tone="lapis">
            zoofarmacognosia
          </GlossaryTermTrigger>{' '}
          de Mahale y Kibale corrige el sesgo lítico y amplía nuestra reconstrucción de la vida
          hominina temprana en África.
        </p>
      </div>

      {/* 3 Visual Dossier Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {ECOLOGICAL_CULTURE_PILLARS.map((pillar) => (
          <article
            key={pillar.id}
            className="bg-canvas border border-hairline p-5 flex flex-col gap-3.5"
          >
            <div className="flex flex-col gap-1 border-b border-hairline pb-3">
              <span className="font-mono text-[11px] text-ochre">{pillar.kicker}</span>
              <h3 className="font-display text-lg font-semibold text-ink leading-snug m-0">
                {pillar.title}
              </h3>
              <span className="font-mono text-[11px] text-ink-muted">{pillar.africanSites}</span>
            </div>

            <p className="text-sm leading-relaxed text-ink m-0">{pillar.summary}</p>

            <p className="text-xs leading-relaxed text-ink-muted m-0">
              <strong className="text-ink">Evidencia de campo:</strong> {pillar.mechanismDetail}
            </p>

            <div className="bg-paper border border-hairline p-3 text-xs leading-relaxed text-ink">
              <span className="font-mono text-[10.5px] text-lapis block mb-1">
                Lectura para el Diploma de Estudios Africanos
              </span>
              {pillar.archaeologicalLesson}
            </div>

            <div className="pt-2.5 mt-auto border-t border-hairline flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-ink-muted">
              <span>{pillar.citation}</span>
              <GlossaryTermTrigger termId={pillar.glossaryTermId} tone="forest">
                {pillar.glossaryLabel}
              </GlossaryTermTrigger>
            </div>
          </article>
        ))}
      </div>

      {/* Complementary Reference Strip: Pastwomen (Material History of Women & Maintenance Activities) */}
      <div className="bg-paper border border-hairline p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-1.5 max-w-[74ch]">
          <div className="flex items-center gap-2 font-mono text-xs text-lapis">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Materiales de referencia complementarios · Red Temática Pastwomen</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-ink m-0">
            Para profundizar en cómo la tecnología orgánica perecedera, las actividades de
            mantenimiento, el cuidado y el protagonismo femenino y juvenil (como en Fongoli o en la
            hipótesis de la abuela) corrigen el sesgo androcéntrico en la Prehistoria, consulta las
            láminas científicas abiertas, los cuadernos didácticos y la bibliografía del proyecto
            interuniversitario <strong>Pastwomen</strong>.
          </p>
        </div>
        <a
          href="https://www.pastwomen.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[40px] px-4 py-2 font-mono text-xs text-ink bg-canvas border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 self-start md:self-center"
        >
          <span>Consultar pastwomen.net</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
        </a>
      </div>

      {/* Interactive Botanical Field Worksheet: Savanna Primate Self-Medication */}
      <SavannaSelfMedicationWorksheet />

      {/* Interactive African Non-Lithic Cultural Matrix */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-display text-xl font-semibold text-ink m-0">
              Matriz de tradiciones culturales africanas no líticas
            </h3>
            <span className="font-mono text-xs text-ink-muted">
              Variantes conductuales documentadas en reservas y bosques de África Occidental, Central
              y Oriental
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar tradiciones por dominio">
            {DOMAIN_FILTERS.map((f) => {
              const active = domainFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setDomainFilter(f.id)}
                  className={`min-h-[36px] px-3 py-1.5 font-mono text-xs border rounded transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-ink text-white border-ink'
                      : 'bg-paper text-ink-muted border-hairline hover:text-ink hover:border-ink'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto border border-hairline bg-canvas">
          <table className="w-full text-left border-collapse min-w-[740px]">
            <thead>
              <tr className="bg-paper border-b border-rule font-mono text-[11px] tracking-wide text-ink-muted">
                <th className="py-3 px-4 font-semibold">Tradición y dominio</th>
                <th className="py-3 px-4 font-semibold">Enclave africano</th>
                <th className="py-3 px-4 font-semibold">Descripción operativa</th>
                <th className="py-3 px-4 font-semibold">Clave cultural / transmisión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline text-xs leading-relaxed text-ink">
              {visibleVariants.map((row) => (
                <tr key={row.id} className="align-top hover:bg-paper/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-display text-sm font-semibold text-ink">{row.variant}</div>
                    <div className="font-mono text-[11px] text-ochre mt-0.5">
                      {row.domainLabel} · <em className="text-ink-muted">{row.species}</em>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-medium text-ink">{row.sites}</div>
                    <div className="font-mono text-[11px] text-ink-muted">{row.countryRegion}</div>
                  </td>
                  <td className="py-3 px-4">{row.description}</td>
                  <td className="py-3 px-4 text-ink-muted">{row.transmissionNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Classroom Practical Workshop (4 Guided Field Cases) */}
      <div className="bg-paper border border-hairline p-5 sm:p-6 flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-hairline pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 font-mono text-xs text-ochre">
              <ClipboardCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Taller práctico de aula · Diagnóstico de casos de campo africanos</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink m-0">
              Análisis etológico guiado para seminario universitario
            </h3>
            <p className="text-sm text-ink-muted m-0 max-w-[72ch]">
              Lee cada registro de campo y selecciona la interpretación científica rigurosa. Cada
              caso despliega fundamentación con citas verificadas y una pregunta abierta para
              discusión en clase.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="font-mono text-xs tabular-nums text-ink bg-canvas border border-hairline px-3 py-2">
              Resueltos: <strong>{answeredCount}</strong>/{ETHOLOGY_WORKSHOP_CASES.length} · Aciertos:{' '}
              <strong className="text-forest">{correctCount}</strong>
            </div>
            {answeredCount > 0 && (
              <button
                type="button"
                onClick={handleResetWorkshop}
                className="min-h-[38px] px-3 py-1.5 font-mono text-xs text-ink-muted bg-canvas border border-hairline rounded hover:border-ink hover:text-ink inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reiniciar taller</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {ETHOLOGY_WORKSHOP_CASES.map((item) => {
            const chosenId = answers[item.id];
            const isAnswered = Boolean(chosenId);
            const isCorrect = chosenId === item.correctOptionId;

            return (
              <article
                key={item.id}
                className="bg-canvas border border-hairline p-5 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1 border-b border-hairline pb-3">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px] text-ink-muted">
                    <span className="text-ochre font-semibold">{item.caseNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.site}</span>
                    <span aria-hidden="true">·</span>
                    <em className="italic">{item.species}</em>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-semibold text-ink m-0">
                    {item.title}
                  </h4>
                </div>

                <div className="bg-paper border border-hairline p-3.5 text-xs leading-relaxed text-ink">
                  <span className="font-mono text-[10.5px] text-ink-muted block mb-1">
                    Observación de campo
                  </span>
                  {item.fieldObservation}
                </div>

                <p className="text-sm font-semibold text-ink m-0">{item.question}</p>

                <div className="flex flex-col gap-2" role="radiogroup" aria-label={item.title}>
                  {item.options.map((opt) => {
                    const selected = chosenId === opt.id;
                    const optIsCorrect = opt.id === item.correctOptionId;

                    let buttonStyle =
                      'bg-canvas text-ink border-hairline hover:border-ink';
                    if (isAnswered) {
                      if (optIsCorrect) {
                        buttonStyle = 'bg-forest/10 text-ink border-forest';
                      } else if (selected && !optIsCorrect) {
                        buttonStyle = 'bg-ochre/10 text-ink border-ochre';
                      } else {
                        buttonStyle = 'bg-canvas text-ink-muted border-hairline opacity-75';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => handleSelectAnswer(item.id, opt.id)}
                        className={`min-h-[42px] px-3.5 py-2.5 text-left text-xs leading-snug border rounded transition-colors cursor-pointer flex items-start justify-between gap-2.5 ${buttonStyle}`}
                      >
                        <span>{opt.label}</span>
                        {isAnswered && optIsCorrect && (
                          <CheckCircle2
                            className="w-4 h-4 text-forest shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                        )}
                        {isAnswered && selected && !optIsCorrect && (
                          <XCircle
                            className="w-4 h-4 text-ochre shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div
                    className={`p-4 border text-xs leading-relaxed flex flex-col gap-2 ${
                      isCorrect
                        ? 'bg-forest/5 border-forest text-ink'
                        : 'bg-ochre/5 border-ochre text-ink'
                    }`}
                    aria-live="polite"
                  >
                    <div className="flex items-center gap-1.5 font-mono font-semibold">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
                          <span className="text-forest">Diagnóstico correcto</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
                          <span className="text-ochre">Revisa la evidencia etológica</span>
                        </>
                      )}
                    </div>
                    <p className="m-0">{item.explanation}</p>
                    <p className="m-0 text-ink-muted">
                      <strong className="text-ink">Puente evolutivo:</strong>{' '}
                      {item.evolutionaryBridge}
                    </p>
                    <p className="m-0 pt-2 border-t border-hairline text-ink">
                      {item.seminarPrompt}
                    </p>
                    <span className="font-mono text-[10.5px] text-ink-muted">
                      Referencia: {item.citation}
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
