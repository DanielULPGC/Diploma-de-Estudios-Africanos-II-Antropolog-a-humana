import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Eye, FileText, Printer, RotateCcw } from 'lucide-react';
import {
  KINGDOMS_BUTTON_ORDER,
  KINGDOMS_DATA,
  SOURCES_DATA,
  SOURCES_ORDER,
  SOURCE_DIMENSIONS,
  type KingdomId,
  type SourceId,
} from '../data/curriculum';

export interface SeminarDraft {
  studentName: string;
  kingdomId: KingdomId;
  sourceA: SourceId;
  sourceB: SourceId;
  thesis: string;
  contrastNotes: string;
  conclusion: string;
}

const STORAGE_KEY = 'ulpgc_dea_m1_seminar_draft_v1';

const DEFAULT_DRAFT: SeminarDraft = {
  studentName: '',
  kingdomId: 'mali',
  sourceA: 'oral',
  sourceB: 'arch',
  thesis: '',
  contrastNotes: '',
  conclusion: '',
};

interface SeminarCardBuilderProps {
  externalPreset?: {
    kingdomId?: KingdomId;
    sourceA?: SourceId;
    sourceB?: SourceId;
    nonce: number;
  } | null;
}

export function SeminarCardBuilder({ externalPreset }: SeminarCardBuilderProps) {
  const [draft, setDraft] = useState<SeminarDraft>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          const rec = parsed as Record<string, unknown>;
          const readStr = (key: string, maxLen: number): string =>
            typeof rec[key] === 'string'
              ? (rec[key] as string).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').slice(0, maxLen)
              : '';
          const validKingdom =
            typeof rec.kingdomId === 'string' && rec.kingdomId in KINGDOMS_DATA
              ? (rec.kingdomId as KingdomId)
              : DEFAULT_DRAFT.kingdomId;
          const validA =
            typeof rec.sourceA === 'string' && rec.sourceA in SOURCES_DATA
              ? (rec.sourceA as SourceId)
              : DEFAULT_DRAFT.sourceA;
          const validB =
            typeof rec.sourceB === 'string' &&
            rec.sourceB in SOURCES_DATA &&
            rec.sourceB !== validA
              ? (rec.sourceB as SourceId)
              : SOURCES_ORDER.find((id) => id !== validA) ?? DEFAULT_DRAFT.sourceB;
          return {
            studentName: readStr('studentName', 120),
            kingdomId: validKingdom,
            sourceA: validA,
            sourceB: validB,
            thesis: readStr('thesis', 4000),
            contrastNotes: readStr('contrastNotes', 4000),
            conclusion: readStr('conclusion', 4000),
          };
        }
      }
    } catch {
      // Ignore malformed storage
    }
    return DEFAULT_DRAFT;
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!externalPreset) return;
    setDraft((prev) => {
      const nextKingdom = externalPreset.kingdomId ?? prev.kingdomId;
      const nextA = externalPreset.sourceA ?? prev.sourceA;
      let nextB = externalPreset.sourceB ?? prev.sourceB;
      if (nextB === nextA) {
        nextB = SOURCES_ORDER.find((id) => id !== nextA) ?? 'arch';
      }
      return {
        ...prev,
        kingdomId: nextKingdom,
        sourceA: nextA,
        sourceB: nextB,
      };
    });
  }, [externalPreset]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Ignore storage quota errors
    }
  }, [draft]);

  const kingdom = KINGDOMS_DATA[draft.kingdomId];
  const srcA = SOURCES_DATA[draft.sourceA];
  const srcB = SOURCES_DATA[draft.sourceB];

  const handleSourceAChange = (nextA: SourceId) => {
    setDraft((prev) => ({
      ...prev,
      sourceA: nextA,
      sourceB: prev.sourceB === nextA ? prev.sourceA : prev.sourceB,
    }));
  };

  const handleSourceBChange = (nextB: SourceId) => {
    setDraft((prev) => ({
      ...prev,
      sourceB: nextB,
      sourceA: prev.sourceA === nextB ? prev.sourceB : prev.sourceA,
    }));
  };

  const completedFields = [draft.thesis, draft.contrastNotes, draft.conclusion].filter(
    (v) => v.trim().length >= 15
  ).length;

  const generateMarkdown = () => {
    const today = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return [
      `# Ficha Crítica de Seminario · Diploma de Estudios Africanos (ULPGC)`,
      `**Módulo I:** De la Cuna de la Humanidad a los Grandes Reinos Precoloniales`,
      `**Estudiante:** ${draft.studentName.trim() || 'Sin indicar'}  |  **Fecha:** ${today}`,
      ``,
      `## 1. Objeto de estudio y triangulación`,
      `- **Civilización seleccionada:** ${kingdom.title} (${kingdom.spanLabel})`,
      `- **Fuente A:** ${srcA.title} — *Fortaleza:* ${srcA.str} / *Cautela:* ${srcA.bias}`,
      `- **Fuente B:** ${srcB.title} — *Fortaleza:* ${srcB.str} / *Cautela:* ${srcB.bias}`,
      ``,
      `## 2. Hipótesis o tesis central`,
      draft.thesis.trim() || '(Pendiente de redacción)',
      ``,
      `## 3. Contraste crítico entre Fuente A y Fuente B`,
      draft.contrastNotes.trim() || '(Pendiente de redacción)',
      ``,
      `## 4. Conclusión metodológica`,
      draft.conclusion.trim() || '(Pendiente de redacción)',
    ].join('\n');
  };

  const copyTimerRef = useRef<number | null>(null);
  const printStartTimerRef = useRef<number | null>(null);
  const printCleanupTimerRef = useRef<number | null>(null);
  const afterPrintCleanupRef = useRef<(() => void) | null>(null);

  const scheduleCopiedReset = () => {
    setCopied(true);
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => {
      copyTimerRef.current = null;
      setCopied(false);
    }, 2400);
  };

  const handleCopy = async () => {
    const md = generateMarkdown();
    try {
      await navigator.clipboard.writeText(md);
      scheduleCopiedReset();
    } catch {
      // Fallback copy via textarea
      const ta = document.createElement('textarea');
      ta.value = md;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      scheduleCopiedReset();
    }
  };

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
      if (printStartTimerRef.current !== null) window.clearTimeout(printStartTimerRef.current);
      if (printCleanupTimerRef.current !== null) window.clearTimeout(printCleanupTimerRef.current);
      if (afterPrintCleanupRef.current) {
        window.removeEventListener('afterprint', afterPrintCleanupRef.current);
        afterPrintCleanupRef.current = null;
      }
      document.body.classList.remove('printing-seminar');
    };
  }, []);

  const handlePrint = () => {
    if (printStartTimerRef.current !== null) window.clearTimeout(printStartTimerRef.current);
    if (printCleanupTimerRef.current !== null) window.clearTimeout(printCleanupTimerRef.current);
    if (afterPrintCleanupRef.current) {
      window.removeEventListener('afterprint', afterPrintCleanupRef.current);
      afterPrintCleanupRef.current = null;
    }

    setPreviewMode(true);
    document.body.classList.add('printing-seminar');
    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      if (printCleanupTimerRef.current !== null) {
        window.clearTimeout(printCleanupTimerRef.current);
        printCleanupTimerRef.current = null;
      }
      document.body.classList.remove('printing-seminar');
      window.removeEventListener('afterprint', cleanup);
      if (afterPrintCleanupRef.current === cleanup) {
        afterPrintCleanupRef.current = null;
      }
    };
    afterPrintCleanupRef.current = cleanup;
    window.addEventListener('afterprint', cleanup, { once: true });
    printStartTimerRef.current = window.setTimeout(() => {
      printStartTimerRef.current = null;
      window.print();
      printCleanupTimerRef.current = window.setTimeout(cleanup, 1000);
    }, 150);
  };

  const handleReset = () => {
    setDraft(DEFAULT_DRAFT);
    setPreviewMode(false);
  };

  return (
    <section className="pt-12 border-t border-hairline flex flex-col gap-7">
      <div className="flex flex-col gap-3 no-print">
        <div className="font-mono text-xs tracking-wide text-ochre">
          Taller de seminario · Actividad práctica ULPGC
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight tracking-tight text-ink max-w-3xl [text-wrap:balance]">
          Constructor interactivo de ficha crítica de seminario
        </h2>
        <p className="text-base leading-[1.7] text-ink-muted max-w-[68ch]">
          Seleccione uno de los seis reinos del Módulo 3 y contraste dos familias de fuentes del
          Módulo 5. El borrador se guarda automáticamente en su navegador y puede copiarse o
          imprimirse en formato académico para entregar en el Campus Virtual.
        </p>
      </div>

      <div className="bg-paper border-t-2 border-t-rule border-b border-b-hairline p-6 sm:p-8 flex flex-col gap-6 seminar-print-sheet">
        {/* Top bar of builder */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-hairline no-print">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-ink-muted">
            <span className="text-ink font-medium">Borrador guardado automáticamente</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              Apartados redactados: {completedFields} / 3
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode((v) => !v)}
              className={`min-h-[40px] px-3.5 py-2 text-xs font-medium rounded border inline-flex items-center gap-2 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                previewMode
                  ? 'bg-ink text-white border-ink'
                  : 'bg-canvas text-ink border-hairline hover:border-ink'
              }`}
            >
              {previewMode ? (
                <>
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Volver a editar</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Vista previa formal</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[40px] px-3.5 py-2 text-xs font-medium rounded border border-hairline bg-canvas text-ink hover:border-ink inline-flex items-center gap-2 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
                  <span className="text-forest">Ficha copiada</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copiar texto</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[40px] px-3.5 py-2 text-xs font-medium rounded border border-ochre bg-ochre text-white hover:bg-ink hover:border-ink inline-flex items-center gap-2 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="min-h-[40px] px-3 py-2 text-xs font-medium rounded border border-hairline bg-canvas text-ink-muted hover:text-ink hover:border-ink inline-flex items-center gap-1.5 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Limpiar</span>
            </button>
          </div>
        </div>

        {!previewMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Selection & Triangulation Matrix */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="seminar-student"
                  className="font-mono text-xs font-medium text-ink"
                >
                  Estudiante / Grupo (opcional)
                </label>
                <input
                  id="seminar-student"
                  type="text"
                  value={draft.studentName}
                  onChange={(e) => setDraft({ ...draft, studentName: e.target.value })}
                  placeholder="Nombre y apellidos · Diploma Estudios Africanos"
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm bg-canvas border border-hairline rounded text-ink placeholder:text-ink-subtle focus:border-ink"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="seminar-kingdom"
                  className="font-mono text-xs font-medium text-ink"
                >
                  1. Reino o civilización a analizar
                </label>
                <select
                  id="seminar-kingdom"
                  value={draft.kingdomId}
                  onChange={(e) =>
                    setDraft({ ...draft, kingdomId: e.target.value as KingdomId })
                  }
                  className="w-full min-h-[42px] px-3.5 py-2 text-sm bg-canvas border border-hairline rounded text-ink focus:border-ink cursor-pointer"
                >
                  {KINGDOMS_BUTTON_ORDER.map((id) => (
                    <option key={id} value={id}>
                      {KINGDOMS_DATA[id].title} ({KINGDOMS_DATA[id].spanLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="seminar-src-a"
                    className="font-mono text-xs font-medium text-ochre"
                  >
                    2. Fuente A
                  </label>
                  <select
                    id="seminar-src-a"
                    value={draft.sourceA}
                    onChange={(e) => handleSourceAChange(e.target.value as SourceId)}
                    className="w-full min-h-[42px] px-3 py-2 text-xs bg-canvas border border-hairline rounded text-ink focus:border-ochre cursor-pointer"
                  >
                    {SOURCES_ORDER.map((id) => (
                      <option key={id} value={id}>
                        {SOURCES_DATA[id].shortLabel}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="seminar-src-b"
                    className="font-mono text-xs font-medium text-lapis"
                  >
                    3. Fuente B (contraste)
                  </label>
                  <select
                    id="seminar-src-b"
                    value={draft.sourceB}
                    onChange={(e) => handleSourceBChange(e.target.value as SourceId)}
                    className="w-full min-h-[42px] px-3 py-2 text-xs bg-canvas border border-hairline rounded text-ink focus:border-lapis cursor-pointer"
                  >
                    {SOURCES_ORDER.map((id) => (
                      <option key={id} value={id}>
                        {SOURCES_DATA[id].shortLabel}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Triangulation Matrix */}
              <div className="bg-canvas border border-hairline p-4 flex flex-col gap-3">
                <div className="font-mono text-xs font-medium text-ink">
                  Matriz de complementariedad · {srcA.shortLabel.split(' ')[0]} vs.{' '}
                  {srcB.shortLabel.split(' ')[0]}
                </div>
                <div className="flex flex-col gap-2.5">
                  {SOURCE_DIMENSIONS.map((dim) => {
                    const aVal = srcA.scores[dim.key];
                    const bVal = srcB.scores[dim.key];
                    const maxVal = Math.max(aVal, bVal);
                    return (
                      <div key={dim.key} className="flex flex-col gap-1">
                        <div className="flex justify-between font-mono text-[11px] tabular-nums">
                          <span className="text-ink-muted">{dim.shortLabel}</span>
                          <span>
                            <span className="text-ochre font-medium">{aVal}</span>
                            <span className="text-ink-subtle mx-1">/</span>
                            <span className="text-lapis font-medium">{bVal}</span>
                            <span className="text-ink-subtle mx-1">→</span>
                            <span className="text-forest font-semibold">
                              cobertura {maxVal}
                            </span>
                          </span>
                        </div>
                        <div className="h-1.5 bg-surface-high overflow-hidden flex">
                          <div
                            className="h-full bg-forest transition-all duration-200"
                            style={{ width: `${maxVal}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-2 border-t border-hairline text-xs leading-relaxed text-ink-muted">
                  <strong className="text-ink font-medium">Pista de seminario:</strong> Para{' '}
                  <em>{kingdom.name}</em>, examine {kingdom.seminarFocus}.
                </div>
              </div>
            </div>

            {/* Right: Guided Writing Fields */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="seminar-thesis"
                  className="font-mono text-xs font-medium text-ink"
                >
                  Apartado A · Hipótesis o tesis central sobre {kingdom.name}
                </label>
                <p className="text-xs text-ink-muted">
                  Formule en 2–3 líneas qué mito historiográfico o aspecto institucional desea
                  esclarecer sobre {kingdom.title}.
                </p>
                <textarea
                  id="seminar-thesis"
                  rows={3}
                  value={draft.thesis}
                  onChange={(e) => setDraft({ ...draft, thesis: e.target.value })}
                  placeholder={`Ej.: La trayectoria de ${kingdom.name} (${kingdom.spanLabel}) demuestra autonomía política y articulación regional frente a explicaciones difusionistas...`}
                  className="w-full p-3.5 text-sm leading-relaxed bg-canvas border border-hairline rounded text-ink placeholder:text-ink-subtle focus:border-ink resize-y"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="seminar-contrast"
                  className="font-mono text-xs font-medium text-ink"
                >
                  Apartado B · Contraste crítico ({srcA.shortLabel} frente a {srcB.shortLabel})
                </label>
                <p className="text-xs text-ink-muted">
                  ¿Qué aporta <strong>{srcA.shortLabel}</strong> ({srcA.str.toLowerCase()}) que
                  escapa a <strong>{srcB.shortLabel}</strong>, y cómo corrige la segunda cautelas
                  como «{srcA.bias.toLowerCase()}»?
                </p>
                <textarea
                  id="seminar-contrast"
                  rows={4}
                  value={draft.contrastNotes}
                  onChange={(e) => setDraft({ ...draft, contrastNotes: e.target.value })}
                  placeholder="Compare ambos registros indicando qué información confirma, matiza o corrige cada disciplina..."
                  className="w-full p-3.5 text-sm leading-relaxed bg-canvas border border-hairline rounded text-ink placeholder:text-ink-subtle focus:border-ink resize-y"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="seminar-conclusion"
                  className="font-mono text-xs font-medium text-ink"
                >
                  Apartado C · Conclusión metodológica y pregunta para el debate
                </label>
                <p className="text-xs text-ink-muted">
                  Sintetice qué imagen más equilibrada de {kingdom.name} emerge al triangular
                  ambas fuentes y proponga una cuestión abierta para el seminario.
                </p>
                <textarea
                  id="seminar-conclusion"
                  rows={3}
                  value={draft.conclusion}
                  onChange={(e) => setDraft({ ...draft, conclusion: e.target.value })}
                  placeholder="Conclusión metodológica y cuestión para discutir en clase..."
                  className="w-full p-3.5 text-sm leading-relaxed bg-canvas border border-hairline rounded text-ink placeholder:text-ink-subtle focus:border-ink resize-y"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Formal Academic Preview Sheet (also used for print/PDF) */
          <article className="bg-canvas border border-hairline p-6 sm:p-8 flex flex-col gap-6">
            <header className="pb-4 border-b border-rule flex flex-col gap-1.5">
              <div className="font-mono text-xs text-ochre">
                Universidad de Las Palmas de Gran Canaria · Diploma de Estudios Africanos · Módulo I
              </div>
              <h3 className="font-display text-2xl font-semibold text-ink">
                Ficha crítica de triangulación historiográfica · {kingdom.title}
              </h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-ink-muted">
                <span>Estudiante: {draft.studentName.trim() || 'Sin indicar'}</span>
                <span aria-hidden="true">·</span>
                <span>Cronología: {kingdom.spanLabel}</span>
                <span aria-hidden="true">·</span>
                <span>
                  Fuentes: {srcA.shortLabel} + {srcB.shortLabel}
                </span>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 border-b border-hairline text-xs">
              <div className="flex flex-col gap-1">
                <span className="font-mono font-medium text-ochre">Fuente A · {srcA.title}</span>
                <span className="text-ink-muted">
                  Fortaleza: {srcA.str} · Cautela: {srcA.bias}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono font-medium text-lapis">Fuente B · {srcB.title}</span>
                <span className="text-ink-muted">
                  Fortaleza: {srcB.str} · Cautela: {srcB.bias}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-5 text-sm leading-relaxed text-ink">
              <div>
                <h4 className="font-mono text-xs font-semibold text-ink mb-1.5">
                  1. Hipótesis o tesis central
                </h4>
                <p className="whitespace-pre-wrap text-ink">
                  {draft.thesis.trim() || '— Apartado pendiente de redacción —'}
                </p>
              </div>
              <div>
                <h4 className="font-mono text-xs font-semibold text-ink mb-1.5">
                  2. Contraste crítico de fuentes
                </h4>
                <p className="whitespace-pre-wrap text-ink">
                  {draft.contrastNotes.trim() || '— Apartado pendiente de redacción —'}
                </p>
              </div>
              <div>
                <h4 className="font-mono text-xs font-semibold text-ink mb-1.5">
                  3. Conclusión metodológica y pregunta de debate
                </h4>
                <p className="whitespace-pre-wrap text-ink">
                  {draft.conclusion.trim() || '— Apartado pendiente de redacción —'}
                </p>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
