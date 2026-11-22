import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCopy,
  Download,
  FlaskConical,
  Leaf,
  MapPin,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import {
  MEDICATION_MECHANISM_OPTIONS,
  SAVANNA_BIOMES,
  SAVANNA_MEDICINAL_PLANT_CASES,
  type BotanicalIllustrationKind,
  type MedicationMechanismId,
  type SavannaBiomeId,
  type SavannaMedicinalPlantCase,
} from '../../data/savannaZoopharmacognosyData';
import { GlossaryTermTrigger } from '../GlossaryContext';

interface CaseAttemptState {
  selectedSpecies: string;
  selectedMechanism: MedicationMechanismId | '';
  submitted: boolean;
  studentNote: string;
}

const EMPTY_ATTEMPT: CaseAttemptState = {
  selectedSpecies: '',
  selectedMechanism: '',
  submitted: false,
  studentNote: '',
};

/**
 * Clean scientific editorial SVG sketch highlighting the key diagnostic botanical trait
 * (no decorative fluff — strictly functional morphological clues for identification).
 */
function BotanicalDiagnosticSketch({
  kind,
  label,
}: {
  kind: BotanicalIllustrationKind;
  label: string;
}) {
  return (
    <div className="bg-paper border border-hairline p-3 flex flex-col gap-2">
      <span className="font-mono text-[10.5px] text-ink-muted">
        Rasgo morfológico de campo · {label}
      </span>
      <svg
        viewBox="0 0 280 120"
        className="w-full h-auto block select-none"
        role="img"
        aria-label={`Esquema botánico diagnóstico: ${label}`}
      >
        <rect x="0" y="0" width="280" height="120" fill="#fbfbf9" />
        <line x1="12" y1="106" x2="268" y2="106" stroke="#e2e2dd" strokeWidth="1" />

        {kind === 'bitter-pith' && (
          <g>
            {/* Outer peeled bark flaps */}
            <path
              d="M 48 64 L 106 54 L 94 34 L 46 50 Z"
              fill="#5d7c52"
              stroke="#243a1f"
              strokeWidth="1.2"
            />
            <path
              d="M 48 68 L 106 78 L 94 94 L 46 78 Z"
              fill="#4d6b44"
              stroke="#243a1f"
              strokeWidth="1.2"
            />
            {/* Exposed bitter white pith core */}
            <rect
              x="98"
              y="52"
              width="126"
              height="24"
              rx="10"
              fill="#efe8d5"
              stroke="#7e715b"
              strokeWidth="1.3"
            />
            <line x1="112" y1="60" x2="210" y2="60" stroke="#c8bda5" strokeWidth="1" strokeDasharray="4 3" />
            <line x1="112" y1="68" x2="206" y2="68" stroke="#c8bda5" strokeWidth="1" strokeDasharray="3 3" />
            <text x="160" y="28" textAnchor="middle" fill="#b43c0b" fontSize="10" fontFamily="IBM Plex Mono, monospace">
              Médula interna pelada (amarga)
            </text>
            <line x1="160" y1="33" x2="160" y2="50" stroke="#b43c0b" strokeWidth="1" />
          </g>
        )}

        {kind === 'hispid-leaf' && (
          <g>
            {/* Folded accordion leaf silhouette */}
            <path
              d="M 42 74 Q 98 24 166 42 Q 198 52 222 68 Q 166 94 102 88 Q 66 84 42 74 Z"
              fill="#d8e3cf"
              stroke="#156f55"
              strokeWidth="1.4"
            />
            <path d="M 48 73 Q 126 58 214 67" fill="none" stroke="#156f55" strokeWidth="1.1" />
            {/* Microscopic bristles / hispid trichomes */}
            {[74, 96, 118, 140, 162, 184].map((x) => (
              <g key={x} stroke="#b43c0b" strokeWidth="1.2" fill="none">
                <path d={`M ${x} 48 L ${x - 3} 37 L ${x + 2} 35`} />
                <path d={`M ${x + 6} 76 L ${x + 9} 86`} />
              </g>
            ))}
            <text x="142" y="22" textAnchor="middle" fill="#b43c0b" fontSize="10" fontFamily="IBM Plex Mono, monospace">
              Tricomas rígidos · plegado sin masticar
            </text>
          </g>
        )}

        {kind === 'desert-date' && (
          <g>
            {/* Spiny branch */}
            <line x1="34" y1="62" x2="246" y2="62" stroke="#6c5844" strokeWidth="2.4" />
            <line x1="76" y1="62" x2="58" y2="34" stroke="#6c5844" strokeWidth="1.6" />
            <line x1="196" y1="62" x2="218" y2="36" stroke="#6c5844" strokeWidth="1.6" />
            {/* Drupe fruit */}
            <ellipse
              cx="140"
              cy="76"
              rx="28"
              ry="18"
              fill="#d4a441"
              stroke="#7e5814"
              strokeWidth="1.4"
            />
            <ellipse cx="140" cy="76" rx="14" ry="8" fill="none" stroke="#996b1a" strokeWidth="1" strokeDasharray="3 2" />
            <text x="140" y="24" textAnchor="middle" fill="#1f5fa8" fontSize="10" fontFamily="IBM Plex Mono, monospace">
              Rama espinosa + drupa con saponinas
            </text>
            <line x1="140" y1="29" x2="140" y2="56" stroke="#1f5fa8" strokeWidth="1" />
          </g>
        )}

        {kind === 'sandpaper-fig' && (
          <g>
            {/* Rough serrated fig leaf */}
            <path
              d="M 56 68 C 78 30 144 26 218 62 C 166 96 96 96 56 68 Z"
              fill="#cfe0cb"
              stroke="#156f55"
              strokeWidth="1.4"
            />
            <line x1="58" y1="68" x2="212" y2="62" stroke="#156f55" strokeWidth="1.2" />
            {/* Silica abrasive dots */}
            {[
              [96, 56],
              [116, 48],
              [136, 54],
              [158, 50],
              [176, 58],
              [112, 74],
              [142, 76],
              [168, 72],
            ].map(([cx, cy], idx) => (
              <circle key={idx} cx={cx} cy={cy} r="2.1" fill="#b43c0b" />
            ))}
            <text x="140" y="22" textAnchor="middle" fill="#b43c0b" fontSize="10" fontFamily="IBM Plex Mono, monospace">
              Superficie abrasiva con sílice (efecto lija)
            </text>
          </g>
        )}

        {kind === 'hooked-herb' && (
          <g>
            {/* Elongated herb leaf */}
            <path
              d="M 38 72 Q 134 38 236 66 Q 138 92 38 72 Z"
              fill="#dce6d2"
              stroke="#156f55"
              strokeWidth="1.3"
            />
            {/* Magnified uncinate hooks */}
            {[82, 114, 146, 178, 204].map((x) => (
              <path
                key={x}
                d={`M ${x} 54 L ${x} 40 C ${x} 34 ${x + 8} 34 ${x + 8} 40`}
                fill="none"
                stroke="#b43c0b"
                strokeWidth="1.4"
              />
            ))}
            <text x="140" y="22" textAnchor="middle" fill="#b43c0b" fontSize="10" fontFamily="IBM Plex Mono, monospace">
              Tricomas en gancho (arrastre físico)
            </text>
          </g>
        )}

        {kind === 'aromatic-shrub' && (
          <g>
            {/* Deeply veined rugose shrub leaf */}
            <path
              d="M 62 66 C 84 32 152 32 214 64 C 156 94 88 94 62 66 Z"
              fill="#d9e0c7"
              stroke="#4d6b44"
              strokeWidth="1.4"
            />
            <line x1="64" y1="66" x2="210" y2="64" stroke="#4d6b44" strokeWidth="1.4" />
            {[92, 116, 140, 164, 184].map((x) => (
              <g key={x} stroke="#4d6b44" strokeWidth="1">
                <line x1={x} y1="65" x2={x + 12} y2="46" />
                <line x1={x} y1="65" x2={x + 12} y2="82" />
              </g>
            ))}
            <text x="140" y="22" textAnchor="middle" fill="#156f55" fontSize="10" fontFamily="IBM Plex Mono, monospace">
              Hoja rugosa muy nervada (matorral de sabana)
            </text>
          </g>
        )}

        <text
          x="14"
          y="116"
          fill="#5a5a55"
          fontSize="9.5"
          fontFamily="IBM Plex Mono, monospace"
        >
          Escala diagnóstica esquemática · Ficha de zoofarmacognosia ULPGC
        </text>
      </svg>
    </div>
  );
}

export function SavannaSelfMedicationWorksheet() {
  const [viewMode, setViewMode] = useState<'diagnostico' | 'herbario'>('diagnostico');
  const [selectedBiome, setSelectedBiome] = useState<'todos' | SavannaBiomeId>('todos');
  const [activeCaseId, setActiveCaseId] = useState<string>(SAVANNA_MEDICINAL_PLANT_CASES[0].id);
  const [attempts, setAttempts] = useState<Record<string, CaseAttemptState>>({});
  const [herbariumMechanismFilter, setHerbariumMechanismFilter] = useState<
    'todos' | MedicationMechanismId
  >('todos');
  const [copiedSummary, setCopiedSummary] = useState(false);

  const visibleCases = useMemo(() => {
    if (selectedBiome === 'todos') return SAVANNA_MEDICINAL_PLANT_CASES;
    return SAVANNA_MEDICINAL_PLANT_CASES.filter((c) => c.biomeId === selectedBiome);
  }, [selectedBiome]);

  const activeCase: SavannaMedicinalPlantCase = useMemo(() => {
    const found = visibleCases.find((c) => c.id === activeCaseId);
    return found ?? visibleCases[0] ?? SAVANNA_MEDICINAL_PLANT_CASES[0];
  }, [visibleCases, activeCaseId]);

  const activeBiomeInfo = useMemo(
    () => SAVANNA_BIOMES.find((b) => b.id === activeCase.biomeId) ?? SAVANNA_BIOMES[0],
    [activeCase]
  );

  const activeAttempt: CaseAttemptState = attempts[activeCase.id] ?? EMPTY_ATTEMPT;

  const progressStats = useMemo(() => {
    let submittedCount = 0;
    let fullCorrectCount = 0;
    SAVANNA_MEDICINAL_PLANT_CASES.forEach((item) => {
      const att = attempts[item.id];
      if (att?.submitted) {
        submittedCount += 1;
        if (
          att.selectedSpecies === item.scientificName &&
          att.selectedMechanism === item.correctMechanism
        ) {
          fullCorrectCount += 1;
        }
      }
    });
    return { submittedCount, fullCorrectCount };
  }, [attempts]);

  const filteredHerbarium = useMemo(() => {
    return SAVANNA_MEDICINAL_PLANT_CASES.filter((item) => {
      const biomeOk = selectedBiome === 'todos' || item.biomeId === selectedBiome;
      const mechOk =
        herbariumMechanismFilter === 'todos' || item.correctMechanism === herbariumMechanismFilter;
      return biomeOk && mechOk;
    });
  }, [selectedBiome, herbariumMechanismFilter]);

  const updateAttempt = (caseId: string, patch: Partial<CaseAttemptState>) => {
    setAttempts((prev) => ({
      ...prev,
      [caseId]: {
        ...(prev[caseId] ?? EMPTY_ATTEMPT),
        ...patch,
      },
    }));
  };

  const handleSelectBiome = (biome: 'todos' | SavannaBiomeId) => {
    setSelectedBiome(biome);
    const matching =
      biome === 'todos'
        ? SAVANNA_MEDICINAL_PLANT_CASES
        : SAVANNA_MEDICINAL_PLANT_CASES.filter((c) => c.biomeId === biome);
    if (matching.length > 0 && !matching.some((c) => c.id === activeCaseId)) {
      setActiveCaseId(matching[0].id);
    }
  };

  const handleValidateActiveCase = () => {
    if (!activeAttempt.selectedSpecies || !activeAttempt.selectedMechanism) return;
    updateAttempt(activeCase.id, { submitted: true });
  };

  const handleResetWorksheet = () => {
    setAttempts({});
    setCopiedSummary(false);
  };

  const buildWorksheetTextReport = () => {
    const lines: string[] = [
      'DIPLOMA DE ESTUDIOS AFRICANOS · ULPGC — FICHA DE TALLER DE ETOLOGÍA',
      'Identificación de plantas de automedicación (zoofarmacognosia) en sabanas africanas',
      `Progreso: ${progressStats.submittedCount}/${SAVANNA_MEDICINAL_PLANT_CASES.length} muestras validadas · Aciertos completos: ${progressStats.fullCorrectCount}`,
      '--------------------------------------------------------------------',
    ];

    SAVANNA_MEDICINAL_PLANT_CASES.forEach((item) => {
      const att = attempts[item.id];
      const mechLabel =
        MEDICATION_MECHANISM_OPTIONS.find((m) => m.id === item.correctMechanism)?.shortLabel ??
        item.correctMechanism;
      const chosenMechLabel =
        MEDICATION_MECHANISM_OPTIONS.find((m) => m.id === att?.selectedMechanism)?.shortLabel ??
        'Sin responder';
      const status = !att?.submitted
        ? 'Pendiente'
        : att.selectedSpecies === item.scientificName &&
            att.selectedMechanism === item.correctMechanism
          ? 'Correcto (especie + mecanismo)'
          : 'Revisar diagnóstico';

      lines.push(
        `\n${item.code} · ${item.africanSite} (${item.country}) — ${item.biomeLabel}`,
        `  Primate: ${item.primate}`,
        `  Respuesta estudiante: ${att?.selectedSpecies || 'Sin responder'} | Mecanismo: ${chosenMechLabel}`,
        `  Estado: ${status}`,
        `  Referencia verificada: ${item.scientificName} (${item.commonName}) · ${mechLabel}`,
        `  Nota de campo del estudiante: ${att?.studentNote?.trim() || '(sin observaciones registradas)'}`,
        `  Cita: ${item.citation}`
      );
    });

    return lines.join('\n');
  };

  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyWorksheetSummary = async () => {
    const text = buildWorksheetTextReport();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSummary(true);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        copyTimerRef.current = null;
        setCopiedSummary(false);
      }, 2600);
    } catch {
      // Fallback: trigger clean local file download if clipboard is blocked by browser policy
      handleDownloadWorksheet();
    }
  };

  const handleDownloadWorksheet = () => {
    const text = buildWorksheetTextReport();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ficha-taller-zoofarmacognosia-sabanas-africanas.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const speciesIsCorrect =
    activeAttempt.submitted && activeAttempt.selectedSpecies === activeCase.scientificName;
  const mechanismIsCorrect =
    activeAttempt.submitted && activeAttempt.selectedMechanism === activeCase.correctMechanism;
  const fullyCorrect = speciesIsCorrect && mechanismIsCorrect;

  return (
    <section
      id="taller-zoofarmacognosia"
      aria-labelledby="taller-zoofarmacognosia-heading"
      className="bg-paper border border-hairline p-5 sm:p-6 flex flex-col gap-5 scroll-mt-24"
    >
      {/* Worksheet Masthead */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-rule pb-4">
        <div className="flex flex-col gap-1.5 max-w-[74ch]">
          <div className="flex items-center gap-2 font-mono text-xs text-forest">
            <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Ficha de taller interactiva · Zoofarmacognosia en sabanas africanas</span>
          </div>
          <h3
            id="taller-zoofarmacognosia-heading"
            className="font-display text-xl sm:text-2xl font-semibold text-ink m-0"
          >
            Identificación botánica de plantas usadas en automedicación primate
          </h3>
          <p className="text-sm leading-relaxed text-ink-muted m-0">
            Selecciona un entorno de sabana africana, analiza la observación clínica y los rasgos
            morfológicos de la muestra vegetal e identifica tanto la{' '}
            <strong className="text-ink">especie botánica</strong> como su{' '}
            <GlossaryTermTrigger termId="zoofarmacognosia" tone="forest">
              mecanismo de automedicación
            </GlossaryTermTrigger>
            .
          </p>
        </div>

        {/* Mode Switcher & Progress */}
        <div className="flex flex-col items-start sm:items-end gap-2.5">
          <div className="flex items-center gap-1 p-1 bg-canvas border border-hairline rounded">
            <button
              type="button"
              aria-pressed={viewMode === 'diagnostico'}
              onClick={() => setViewMode('diagnostico')}
              className={`min-h-[40px] px-3 py-1.5 font-mono text-xs rounded transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'diagnostico'
                  ? 'bg-ink text-white'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Ficha de diagnóstico (6)
            </button>
            <button
              type="button"
              aria-pressed={viewMode === 'herbario'}
              onClick={() => setViewMode('herbario')}
              className={`min-h-[40px] px-3 py-1.5 font-mono text-xs rounded transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'herbario'
                  ? 'bg-ink text-white'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Herbario comparado
            </button>
          </div>

          <div className="font-mono text-xs tabular-nums text-ink">
            Validadas: <strong>{progressStats.submittedCount}</strong>/
            {SAVANNA_MEDICINAL_PLANT_CASES.length} · Aciertos completos:{' '}
            <strong className="text-forest">{progressStats.fullCorrectCount}</strong>
          </div>
        </div>
      </div>

      {/* Savanna Environment Filter Strip */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
          <MapPin className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
          <span>Filtrar por entorno de sabana africana:</span>
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Entornos de sabana africana"
        >
          <button
            type="button"
            aria-pressed={selectedBiome === 'todos'}
            onClick={() => handleSelectBiome('todos')}
            className={`min-h-[38px] px-3 py-1.5 font-mono text-xs border rounded transition-colors cursor-pointer whitespace-nowrap ${
              selectedBiome === 'todos'
                ? 'bg-ink text-white border-ink'
                : 'bg-canvas text-ink border-hairline hover:border-ink'
            }`}
          >
            Todas las sabanas (6)
          </button>
          {SAVANNA_BIOMES.map((biome) => {
            const count = SAVANNA_MEDICINAL_PLANT_CASES.filter(
              (c) => c.biomeId === biome.id
            ).length;
            const active = selectedBiome === biome.id;
            return (
              <button
                key={biome.id}
                type="button"
                aria-pressed={active}
                onClick={() => handleSelectBiome(biome.id)}
                className={`min-h-[38px] px-3 py-1.5 font-mono text-xs border rounded transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-forest text-white border-forest'
                    : 'bg-canvas text-ink border-hairline hover:border-ink'
                }`}
              >
                {biome.shortLabel} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {viewMode === 'diagnostico' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Sample Selector List + Biome Context */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div
              className="flex flex-col gap-2"
              role="listbox"
              aria-label="Muestras botánicas de campo"
            >
              {visibleCases.map((item) => {
                const isSelected = item.id === activeCase.id;
                const att = attempts[item.id];
                const done = Boolean(att?.submitted);
                const ok =
                  done &&
                  att.selectedSpecies === item.scientificName &&
                  att.selectedMechanism === item.correctMechanism;

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => setActiveCaseId(item.id)}
                    className={`p-3.5 text-left border transition-colors cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-canvas border-ink'
                        : 'bg-canvas/70 border-hairline hover:border-ink/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                      <span className="text-ochre font-semibold">{item.code}</span>
                      {done ? (
                        <span
                          className={`inline-flex items-center gap-1 font-medium ${
                            ok ? 'text-forest' : 'text-ochre'
                          }`}
                        >
                          {ok ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Identificada</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Revisar</span>
                            </>
                          )}
                        </span>
                      ) : (
                        <span className="text-ink-muted">Pendiente</span>
                      )}
                    </div>
                    <span className="font-display text-sm font-semibold text-ink">
                      {item.africanSite} ({item.country})
                    </span>
                    <span className="font-mono text-[11px] text-ink-muted italic">
                      {item.primate}
                    </span>
                    <span className="text-[11.5px] text-ink-muted leading-snug">
                      {item.biomeLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Savanna Biome Profile */}
            <div className="bg-canvas border border-hairline p-4 flex flex-col gap-2 text-xs leading-relaxed">
              <span className="font-mono text-[11px] text-forest font-semibold">
                Contexto ecológico · {activeBiomeInfo.shortLabel}
              </span>
              <p className="text-ink m-0">
                <strong>Vegetación y clima:</strong> {activeBiomeInfo.climateAndFlora}
              </p>
              <p className="text-ink-muted m-0">
                <strong className="text-ink">Presión parasitaria:</strong>{' '}
                {activeBiomeInfo.parasitePressure}
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Field Identification Worksheet */}
          <div className="lg:col-span-8 bg-canvas border border-hairline p-5 flex flex-col gap-5">
            {/* Case Header & Morphological Clues */}
            <div className="flex flex-col gap-3 border-b border-hairline pb-4">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-ink-muted">
                <span className="text-ochre font-semibold">{activeCase.code}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {activeCase.africanSite}, {activeCase.country}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeCase.seasonality}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-7 flex flex-col gap-2.5">
                  <div className="bg-paper border border-hairline p-3.5 text-xs sm:text-sm leading-relaxed text-ink">
                    <span className="font-mono text-[10.5px] text-ink-muted block mb-1">
                      Registro de observación en campo ({activeCase.primate})
                    </span>
                    {activeCase.fieldObservation}
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[11px] text-forest font-medium">
                      Pistas botánicas observables en la muestra:
                    </span>
                    <ul className="m-0 pl-4 flex flex-col gap-1 text-xs leading-relaxed text-ink">
                      {activeCase.morphologicalClues.map((clue) => (
                        <li key={clue}>{clue}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="md:col-span-5">
                  <BotanicalDiagnosticSketch
                    kind={activeCase.illustration}
                    label={activeCase.plantPartUsed}
                  />
                </div>
              </div>
            </div>

            {/* Step 1: Identify Plant Species */}
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-xs font-semibold text-ink">
                Paso 1 · Identifica la especie vegetal recolectada
              </span>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                role="radiogroup"
                aria-label={`Identificar especie vegetal para ${activeCase.code}`}
              >
                {activeCase.candidateSpecies.map((cand) => {
                  const selected = activeAttempt.selectedSpecies === cand.scientificName;
                  const isCorrectOpt = cand.scientificName === activeCase.scientificName;

                  let style = 'bg-paper border-hairline text-ink hover:border-ink';
                  if (activeAttempt.submitted) {
                    if (isCorrectOpt) {
                      style = 'bg-forest/10 border-forest text-ink';
                    } else if (selected && !isCorrectOpt) {
                      style = 'bg-ochre/10 border-ochre text-ink';
                    } else {
                      style = 'bg-paper/60 border-hairline text-ink-muted opacity-75';
                    }
                  } else if (selected) {
                    style = 'bg-ink text-white border-ink';
                  }

                  return (
                    <button
                      key={cand.scientificName}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() =>
                        updateAttempt(activeCase.id, {
                          selectedSpecies: cand.scientificName,
                          submitted: false,
                        })
                      }
                      className={`p-3 text-left border rounded transition-colors cursor-pointer flex flex-col gap-0.5 ${style}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-sm font-semibold italic">
                          {cand.scientificName}
                        </span>
                        {activeAttempt.submitted && isCorrectOpt && (
                          <CheckCircle2 className="w-4 h-4 text-forest shrink-0" aria-hidden="true" />
                        )}
                        {activeAttempt.submitted && selected && !isCorrectOpt && (
                          <XCircle className="w-4 h-4 text-ochre shrink-0" aria-hidden="true" />
                        )}
                      </div>
                      <span
                        className={`font-mono text-[11px] ${
                          selected && !activeAttempt.submitted ? 'text-white/80' : 'text-ink-muted'
                        }`}
                      >
                        {cand.commonName}
                      </span>
                      <span
                        className={`text-[11px] leading-snug pt-0.5 ${
                          selected && !activeAttempt.submitted ? 'text-white/90' : 'text-ink-muted'
                        }`}
                      >
                        {cand.morphologicalCue}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Identify Therapeutic Mechanism */}
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-xs font-semibold text-ink">
                Paso 2 · Clasifica el mecanismo de automedicación
              </span>
              <div
                className="flex flex-col gap-2"
                role="radiogroup"
                aria-label={`Clasificar mecanismo de automedicación para ${activeCase.code}`}
              >
                {MEDICATION_MECHANISM_OPTIONS.map((mech) => {
                  const selected = activeAttempt.selectedMechanism === mech.id;
                  const isCorrectMech = mech.id === activeCase.correctMechanism;

                  let style = 'bg-paper border-hairline text-ink hover:border-ink';
                  if (activeAttempt.submitted) {
                    if (isCorrectMech) {
                      style = 'bg-forest/10 border-forest text-ink';
                    } else if (selected && !isCorrectMech) {
                      style = 'bg-ochre/10 border-ochre text-ink';
                    } else {
                      style = 'bg-paper/60 border-hairline text-ink-muted opacity-75';
                    }
                  } else if (selected) {
                    style = 'bg-lapis text-white border-lapis';
                  }

                  return (
                    <button
                      key={mech.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() =>
                        updateAttempt(activeCase.id, {
                          selectedMechanism: mech.id,
                          submitted: false,
                        })
                      }
                      className={`p-3 text-left border rounded transition-colors cursor-pointer flex items-start justify-between gap-3 ${style}`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold">{mech.label}</span>
                        <span
                          className={`text-[11px] leading-snug ${
                            selected && !activeAttempt.submitted ? 'text-white/85' : 'text-ink-muted'
                          }`}
                        >
                          {mech.description}
                        </span>
                      </div>
                      {activeAttempt.submitted && isCorrectMech && (
                        <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" aria-hidden="true" />
                      )}
                      {activeAttempt.submitted && selected && !isCorrectMech && (
                        <XCircle className="w-4 h-4 text-ochre shrink-0 mt-0.5" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Optional Student Field Note + Validation Action */}
            <div className="flex flex-col gap-3 pt-2 border-t border-hairline">
              <label className="flex flex-col gap-1.5 text-xs text-ink">
                <span className="font-mono text-[11px] text-ink-muted">
                  Anotación de cuaderno de campo (opcional, se incluye al exportar la ficha):
                </span>
                <textarea
                  rows={2}
                  value={activeAttempt.studentNote}
                  onChange={(e) => updateAttempt(activeCase.id, { studentNote: e.target.value })}
                  placeholder="Ej.: Relación entre la estacionalidad de la sabana, el parásito diana y el saber botánico local..."
                  className="w-full p-2.5 text-xs bg-paper border border-hairline rounded text-ink placeholder:text-ink-muted/70 focus:outline-none focus:border-ink resize-y"
                />
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={!activeAttempt.selectedSpecies || !activeAttempt.selectedMechanism}
                  onClick={handleValidateActiveCase}
                  className="min-h-[42px] px-5 py-2 font-mono text-xs font-semibold text-white bg-ink border border-ink rounded hover:bg-ochre hover:border-ochre disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                >
                  Validar identificación de {activeCase.code}
                </button>

                <span className="font-mono text-[11px] text-ink-muted">
                  {!activeAttempt.selectedSpecies || !activeAttempt.selectedMechanism
                    ? 'Selecciona especie y mecanismo para validar'
                    : activeAttempt.submitted
                      ? 'Muestra validada · puedes revisar la ficha fitoquímica debajo'
                      : 'Listo para validar'}
                </span>
              </div>
            </div>

            {/* Validated Scientific & Ethnobotanical Feedback */}
            {activeAttempt.submitted && (
              <div
                className={`p-4 sm:p-5 border flex flex-col gap-3 text-xs leading-relaxed ${
                  fullyCorrect ? 'bg-forest/5 border-forest' : 'bg-ochre/5 border-ochre'
                }`}
                aria-live="polite"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-2.5">
                  <div className="flex items-center gap-2 font-mono font-semibold">
                    {fullyCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-forest" aria-hidden="true" />
                        <span className="text-forest">
                          Identificación completa correcta: {activeCase.scientificName}
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-ochre" aria-hidden="true" />
                        <span className="text-ochre">
                          Revisión necesaria · Especie: {speciesIsCorrect ? 'Correcta' : 'Incorrecta'} ·
                          Mecanismo: {mechanismIsCorrect ? 'Correcto' : 'Incorrecto'}
                        </span>
                      </>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-ink-muted">
                    Familia {activeCase.family}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-ink">
                  <div>
                    <span className="font-mono text-[10.5px] text-forest block">
                      Base fitoquímica o estructural
                    </span>
                    <p className="m-0">{activeCase.activeCompoundsOrStructure}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10.5px] text-ochre block">
                      Parásito diana y ejecución conductual
                    </span>
                    <p className="m-0">
                      <strong>{activeCase.targetParasite}.</strong> {activeCase.behavioralExecution}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-hairline text-ink">
                  <span className="font-mono text-[10.5px] text-lapis block mb-0.5">
                    Convergencia con la farmacopea tradicional africana
                  </span>
                  <p className="m-0">{activeCase.ethnobotanicalConvergence}</p>
                </div>

                <span className="font-mono text-[10.5px] text-ink-muted">
                  Fuente verificada: {activeCase.citation}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Mode 2: Comparative African Savanna Herbarium */
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 font-mono text-xs text-ink">
              <BookOpen className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
              <span>Herbario comparado de referencia ({filteredHerbarium.length} especies)</span>
            </div>

            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar herbario por mecanismo">
              <button
                type="button"
                aria-pressed={herbariumMechanismFilter === 'todos'}
                onClick={() => setHerbariumMechanismFilter('todos')}
                className={`min-h-[40px] px-3 py-1.5 font-mono text-xs border rounded cursor-pointer whitespace-nowrap ${
                  herbariumMechanismFilter === 'todos'
                    ? 'bg-ink text-white border-ink'
                    : 'bg-canvas text-ink-muted border-hairline hover:text-ink'
                }`}
              >
                Todos los mecanismos
              </button>
              {MEDICATION_MECHANISM_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={herbariumMechanismFilter === m.id}
                  onClick={() => setHerbariumMechanismFilter(m.id)}
                  className={`min-h-[40px] px-3 py-1.5 font-mono text-xs border rounded cursor-pointer whitespace-nowrap ${
                    herbariumMechanismFilter === m.id
                      ? 'bg-lapis text-white border-lapis'
                      : 'bg-canvas text-ink-muted border-hairline hover:text-ink'
                  }`}
                >
                  {m.shortLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHerbarium.map((plant) => {
              const mechLabel =
                MEDICATION_MECHANISM_OPTIONS.find((m) => m.id === plant.correctMechanism)
                  ?.shortLabel ?? plant.correctMechanism;
              return (
                <article
                  key={plant.id}
                  className="bg-canvas border border-hairline p-4 flex flex-col gap-3"
                >
                  <div className="flex flex-col gap-0.5 border-b border-hairline pb-2.5">
                    <span className="font-mono text-[10.5px] text-ochre">
                      {plant.africanSite} ({plant.country}) · {mechLabel}
                    </span>
                    <h4 className="font-display text-base font-semibold italic text-ink m-0">
                      {plant.scientificName}
                    </h4>
                    <span className="font-mono text-[11px] text-ink-muted">
                      {plant.commonName} · {plant.family}
                    </span>
                  </div>

                  <BotanicalDiagnosticSketch
                    kind={plant.illustration}
                    label={plant.plantPartUsed}
                  />

                  <div className="flex flex-col gap-1.5 text-xs leading-relaxed text-ink">
                    <p className="m-0">
                      <strong>Primate y sabana:</strong> <em>{plant.primate}</em> ({plant.biomeLabel}
                      ).
                    </p>
                    <p className="m-0 text-ink-muted">
                      <strong className="text-ink">Acción:</strong>{' '}
                      {plant.activeCompoundsOrStructure}
                    </p>
                    <p className="m-0 text-ink-muted">
                      <strong className="text-ink">Etnobotánica:</strong>{' '}
                      {plant.ethnobotanicalConvergence}
                    </p>
                  </div>

                  <div className="mt-auto pt-2 border-t border-hairline flex items-center justify-between gap-2 font-mono text-[10.5px] text-ink-muted">
                    <span>{plant.citation}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCaseId(plant.id);
                        setViewMode('diagnostico');
                      }}
                      className="text-lapis hover:text-ochre underline underline-offset-2 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Practicar ficha
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Worksheet Export / Reset Action Strip */}
      <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[11px] text-ink-muted">
          <Leaf className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
          <span>
            Exporta tus respuestas y notas de campo para la sesión presencial de seminario
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyWorksheetSummary}
            className="min-h-[38px] px-3.5 py-1.5 font-mono text-xs text-ink bg-canvas border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            {copiedSummary ? (
              <>
                <Check className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
                <span className="text-forest">Resumen copiado</span>
              </>
            ) : (
              <>
                <ClipboardCopy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copiar ficha</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadWorksheet}
            className="min-h-[38px] px-3.5 py-1.5 font-mono text-xs text-ink bg-canvas border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-lapis" aria-hidden="true" />
            <span>Descargar ficha (.txt)</span>
          </button>

          {progressStats.submittedCount > 0 && (
            <button
              type="button"
              onClick={handleResetWorksheet}
              className="min-h-[38px] px-3 py-1.5 font-mono text-xs text-ink-muted bg-canvas border border-hairline rounded hover:border-ink hover:text-ink inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reiniciar</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
