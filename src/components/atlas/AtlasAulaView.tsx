import { useEffect, useState } from 'react';
import { Check, ChevronDown, Download, ExternalLink, RotateCcw } from 'lucide-react';
import {
  AULA_ITINERARIOS,
  AULA_NORMATIVA,
  AULA_PREGUNTAS_COMPRENSION,
  AULA_SITUACION_APRENDIZAJE,
} from '../../data/atlasPaleo';
import {
  DEA_GUIDED_SESSIONS,
  DEA_TRABAJO_INDIVIDUAL_GUIDE,
  PROPUESTA_DIDACTICA_PERFILES,
  type PropuestaDidacticaPerfil,
} from '../../data/deaPedagogyData';

export type AtlasTabId =
  | 'cronologia'
  | 'comparar'
  | 'parentesco'
  | 'territorio'
  | 'clima'
  | 'metodos'
  | 'laboratorios'
  | 'aula';

const NOTES_STORAGE_KEY = 'dea-ulpgc-session-notes-v1';
const DONE_STORAGE_KEY = 'dea-ulpgc-session-done-v1';

export function AtlasAulaView({
  onSwitchTab,
}: {
  onSwitchTab: (tab: AtlasTabId) => void;
}) {
  const [openQuestionIdx, setOpenQuestionIdx] = useState<number | null>(0);
  const [openSessionNum, setOpenSessionNum] = useState<number | null>(1);
  const [activeProfileId, setActiveProfileId] =
    useState<PropuestaDidacticaPerfil['id']>('universitario');

  const [sessionNotes, setSessionNotes] = useState<Record<number, string>>(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY) || '{}');
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
      const validIds = new Set(DEA_GUIDED_SESSIONS.map((s) => s.n));
      const sanitized: Record<number, string> = {};
      for (const [key, val] of Object.entries(parsed as Record<string, unknown>)) {
        const num = Number(key);
        if (Number.isInteger(num) && validIds.has(num) && typeof val === 'string') {
          sanitized[num] = val
            .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
            .slice(0, 4000);
        }
      }
      return sanitized;
    } catch {
      return {};
    }
  });

  const [completedSessions, setCompletedSessions] = useState<Record<number, boolean>>(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(DONE_STORAGE_KEY) || '{}');
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
      const validIds = new Set(DEA_GUIDED_SESSIONS.map((s) => s.n));
      const sanitized: Record<number, boolean> = {};
      for (const [key, val] of Object.entries(parsed as Record<string, unknown>)) {
        const num = Number(key);
        if (Number.isInteger(num) && validIds.has(num) && typeof val === 'boolean') {
          sanitized[num] = val;
        }
      }
      return sanitized;
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(sessionNotes));
    } catch {
      // ignore storage errors
    }
  }, [sessionNotes]);

  useEffect(() => {
    try {
      localStorage.setItem(DONE_STORAGE_KEY, JSON.stringify(completedSessions));
    } catch {
      // ignore storage errors
    }
  }, [completedSessions]);

  const completedCount = DEA_GUIDED_SESSIONS.filter((s) => completedSessions[s.n]).length;
  const activeProfile =
    PROPUESTA_DIDACTICA_PERFILES.find((p) => p.id === activeProfileId) ??
    PROPUESTA_DIDACTICA_PERFILES[2];
  const sa = AULA_SITUACION_APRENDIZAJE;

  const handleDownloadNotes = () => {
    const lines: string[] = [
      'DIPLOMA DE ESTUDIOS AFRICANOS · ULPGC',
      'Cuaderno de notas — Sesiones sobre Orígenes de la Humanidad en África',
      `Fecha de exportación: ${new Date().toLocaleDateString('es-ES')}`,
      '====================================================================',
      '',
    ];
    DEA_GUIDED_SESSIONS.forEach((s) => {
      const done = completedSessions[s.n] ? '[COMPLETADA]' : '[PENDIENTE]';
      lines.push(`SESIÓN ${s.n}: ${s.titulo} ${done}`);
      lines.push(`Pregunta: ${s.pregunta}`);
      lines.push(`Propuesta para el trabajo: ${s.trabajo}`);
      lines.push('Mis notas:');
      lines.push((sessionNotes[s.n] || '(Sin anotaciones todavía)').trim());
      lines.push('');
      lines.push('--------------------------------------------------------------------');
      lines.push('');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notas-sesiones-dea-ulpgc.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3 max-w-3xl">
        <div className="font-mono text-xs text-ochre">
          Bloque 05 · Sesiones DEA, Propuesta Didáctica por Perfiles y Aula (ULPGC)
        </div>
        <h3 className="font-display text-2xl font-semibold text-ink">
          Sesiones guiadas del DEA y transposición didáctica
        </h3>
        <p className="text-sm sm:text-base leading-relaxed text-ink">
          Integra el itinerario completo de las <strong>6 sesiones del Diploma de Estudios Africanos</strong>{' '}
          (con Patrimonio Mundial UNESCO, cuaderno de notas local y guía del trabajo individual en
          APA 7.ª), junto con la <strong>Propuesta Didáctica por 4 Perfiles</strong> y el modelo
          LOMLOE de transposición para Educación Primaria.
        </p>
      </div>

      {/* SECTION A: 6 Guided DEA Sessions + Local Notebook */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-rule pb-3">
          <div className="flex flex-col gap-1">
            <h4 className="font-display text-xl font-semibold text-ink">
              6 Sesiones guiadas del Diploma de Estudios Africanos (Antropología africana)
            </h4>
            <p className="font-mono text-xs text-ink-muted tabular-nums">
              Progreso local: {completedCount} de {DEA_GUIDED_SESSIONS.length} sesiones marcadas
              como completadas · Notas guardadas solo en este navegador
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadNotes}
              className="min-h-[36px] px-3 py-1.5 text-xs font-medium text-ink bg-paper border border-hairline rounded inline-flex items-center gap-1.5 hover:border-ink cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
              <span>Descargar mis notas (.txt)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSessionNotes({});
                setCompletedSessions({});
              }}
              className="min-h-[36px] px-3 py-1.5 text-xs font-medium text-ink-muted bg-canvas border border-hairline rounded inline-flex items-center gap-1.5 hover:text-ink hover:border-ink cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Limpiar notas</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-hairline border-b border-hairline">
          {DEA_GUIDED_SESSIONS.map((ses) => {
            const isOpen = openSessionNum === ses.n;
            const isDone = !!completedSessions[ses.n];
            return (
              <div key={ses.n} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenSessionNum(isOpen ? null : ses.n)}
                  aria-expanded={isOpen}
                  className="w-full text-left flex items-center justify-between gap-4 py-1 cursor-pointer group"
                >
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                    <span className="font-mono text-xs font-semibold text-ochre tabular-nums">
                      Sesión 0{ses.n}
                    </span>
                    <span className="font-display text-base sm:text-lg font-semibold text-ink group-hover:text-ochre transition-colors">
                      {ses.titulo}
                    </span>
                    <span className="text-xs text-ink-muted">— {ses.pregunta}</span>
                    {isDone && (
                      <span className="font-mono text-[11px] font-medium text-forest inline-flex items-center gap-1">
                        <Check className="w-3 h-3" aria-hidden="true" />
                        Hecha
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-ink-muted shrink-0 transition-transform duration-150 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div className="mt-3 bg-paper border-t border-hairline p-5 flex flex-col gap-4">
                    {/* Optional Highlighted Dossier (UNESCO sites / Historiographical cases) */}
                    {ses.destacadoItems && (
                      <div className="bg-canvas border border-hairline p-4 flex flex-col gap-2.5">
                        <h5 className="font-mono text-xs font-semibold text-lapis">
                          {ses.destacadoTitulo}
                        </h5>
                        <ul className="m-0 pl-4 flex flex-col gap-2 text-xs leading-relaxed text-ink">
                          {ses.destacadoItems.map((it) => (
                            <li key={it.titulo}>
                              <strong className="font-semibold">{it.titulo}:</strong> {it.texto}
                            </li>
                          ))}
                        </ul>
                        {ses.notaDestacado && (
                          <p className="font-mono text-[11px] text-ink-muted m-0">
                            {ses.notaDestacado}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Actionable Steps */}
                    <ol className="m-0 pl-5 flex flex-col gap-2.5 text-sm leading-relaxed text-ink">
                      {ses.pasos.map((paso, idx) => (
                        <li key={idx} className="pl-1">
                          <span>{paso.texto}</span>
                          {paso.targetTab && paso.targetLabel && (
                            <button
                              type="button"
                              onClick={() => onSwitchTab(paso.targetTab!)}
                              className="ml-2 font-mono text-xs text-lapis underline underline-offset-2 hover:text-ochre cursor-pointer"
                            >
                              {paso.targetLabel} →
                            </button>
                          )}
                        </li>
                      ))}
                    </ol>

                    {/* Proposal for individual coursework */}
                    <div className="pt-3 border-t border-hairline text-xs leading-relaxed text-ink">
                      <strong className="font-mono text-ochre mr-1.5">Para su trabajo ·</strong>
                      {ses.trabajo}
                    </div>

                    {/* External authoritative links (UNESCO, Smithsonian, BGS, Leakey) */}
                    {ses.fuentes && ses.fuentes.length > 0 && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 font-mono text-[11px]">
                        {ses.fuentes.map((f) => (
                          <a
                            key={f.url}
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-lapis hover:underline"
                          >
                            <span>{f.titulo}</span>
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Local notes + Mark done */}
                    <div className="pt-3 border-t border-hairline flex flex-col gap-2.5">
                      <label className="flex flex-col gap-1.5 text-xs">
                        <span className="font-mono font-medium text-ink-muted">
                          Notas personales de la Sesión 0{ses.n} (borrador para el trabajo individual)
                        </span>
                        <textarea
                          rows={3}
                          value={sessionNotes[ses.n] || ''}
                          onChange={(e) =>
                            setSessionNotes((prev) => ({ ...prev, [ses.n]: e.target.value }))
                          }
                          placeholder="Anote fechas, regiones, citas DOI o argumentos propios..."
                          className="w-full p-3 bg-canvas border border-hairline rounded text-sm text-ink placeholder:text-ink-subtle focus:border-ink"
                        />
                      </label>

                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setCompletedSessions((prev) => ({ ...prev, [ses.n]: !prev[ses.n] }))
                          }
                          aria-pressed={isDone}
                          className={`min-h-[36px] px-3.5 py-1.5 text-xs font-medium rounded border inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                            isDone
                              ? 'bg-forest text-white border-forest'
                              : 'bg-canvas text-ink border-hairline hover:border-ink'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{isDone ? 'Sesión marcada como hecha' : 'Marcar sesión hecha'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION B: Guía para el trabajo individual DEA */}
      <div className="border-t border-rule pt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs text-ochre">Orientaciones académicas · DEA</span>
          <h4 className="font-display text-xl font-semibold text-ink">
            Guía para el trabajo individual de la materia (APA 7.ª edición)
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEA_TRABAJO_INDIVIDUAL_GUIDE.map((step) => (
            <div
              key={step.num}
              className="bg-paper border-t border-rule p-4 flex flex-col gap-2"
            >
              <div className="font-mono text-xs font-semibold text-ochre tabular-nums">
                Paso {step.num}
              </div>
              <h5 className="font-display text-base font-semibold text-ink">{step.titulo}</h5>
              <ul className="m-0 pl-4 flex flex-col gap-1.5 text-xs leading-relaxed text-ink-muted">
                {step.puntos.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION C: Propuesta Didáctica por 4 Perfiles */}
      <div className="border-t border-rule pt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs text-lapis">
            Mediación pedagógica · Propuesta Didáctica oficial del Atlas
          </span>
          <h4 className="font-display text-xl font-semibold text-ink">
            Rutas por cuatro perfiles de uso educativo
          </h4>
        </div>

        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Perfiles didácticos">
          {PROPUESTA_DIDACTICA_PERFILES.map((perfil) => {
            const isSel = perfil.id === activeProfile.id;
            return (
              <button
                key={perfil.id}
                type="button"
                role="tab"
                aria-selected={isSel}
                onClick={() => setActiveProfileId(perfil.id)}
                className={`min-h-[38px] px-3.5 py-1.5 text-xs font-semibold rounded border cursor-pointer transition-colors ${
                  isSel
                    ? 'bg-ink text-white border-ink'
                    : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
                }`}
              >
                {perfil.label}
              </button>
            );
          })}
        </div>

        <div className="bg-paper border-t-2 border-t-rule border-b border-b-hairline p-5 sm:p-6 flex flex-col gap-5">
          <h5 className="font-display text-lg font-semibold text-ink">{activeProfile.titulo}</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs leading-relaxed">
            <div className="flex flex-col gap-1.5">
              <span className="font-mono font-semibold text-ochre">Itinerario de uso</span>
              <ol className="m-0 pl-4 flex flex-col gap-1 text-ink">
                {activeProfile.itinerario.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-mono font-semibold text-lapis">Objetivos de aprendizaje</span>
              <ul className="m-0 pl-4 flex flex-col gap-1 text-ink">
                {activeProfile.objetivos.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-mono font-semibold text-forest">Actividades sugeridas</span>
              <ul className="m-0 pl-4 flex flex-col gap-1 text-ink">
                {activeProfile.actividades.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-1.5 pt-3 border-t border-hairline">
              <span className="font-mono font-semibold text-ink">
                Preguntas de pensamiento científico
              </span>
              <ul className="m-0 pl-4 flex flex-col gap-1 text-ink-muted">
                {activeProfile.preguntas.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-1.5 pt-3 border-t border-hairline">
              <span className="font-mono font-semibold text-ink">Evidencias de aprendizaje</span>
              <ul className="m-0 pl-4 flex flex-col gap-1 text-ink-muted">
                {activeProfile.evidencias.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-1.5 pt-3 border-t border-hairline">
              <span className="font-mono font-semibold text-ink">Criterios de evaluación</span>
              <ul className="m-0 pl-4 flex flex-col gap-1 text-ink-muted">
                {activeProfile.criterios.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION D: 3 University Itineraries */}
      <div className="border-t border-hairline pt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h4 className="font-display text-xl font-semibold text-ink">
            Itinerarios rápidos para la docencia universitaria
          </h4>
          <p className="font-mono text-xs text-ink-muted">
            Tres rutas intencionadas según el objetivo epistemológico, metodológico o territorial
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AULA_ITINERARIOS.map((ruta) => (
            <article
              key={ruta.id}
              className="border-t-2 border-t-rule bg-paper p-5 flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] text-ochre">{ruta.indicadoPara}</span>
                <h5 className="font-display text-lg font-semibold text-ink leading-snug">
                  {ruta.titulo}
                </h5>
                <p className="text-sm text-ink leading-relaxed">{ruta.objetivo}</p>
                <p className="text-sm text-ink-muted leading-relaxed pt-2 border-t border-hairline">
                  <strong className="text-ink font-medium">Recorrido:</strong> {ruta.recorrido}
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => onSwitchTab(ruta.targetTab)}
                  className="min-h-[40px] px-3.5 py-2 text-xs font-medium text-ink bg-canvas border border-hairline rounded hover:border-ink transition-colors whitespace-nowrap cursor-pointer"
                >
                  {ruta.ctaLabel}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* SECTION E: Situación de Aprendizaje (LOMLOE / Canarias) */}
      <div className="border-t border-rule pt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs text-lapis">
            Modelo para la formación del profesorado · Educación Primaria
          </span>
          <h4 className="font-display text-xl font-semibold text-ink">
            Situación de aprendizaje: «{sa.titulo}»
          </h4>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-paper border-t border-b border-hairline p-5 flex flex-col gap-3.5 text-sm">
            <div>
              <span className="font-mono text-[11px] text-ink-muted block">Etapa y área</span>
              <span className="text-ink">{sa.etapaArea}</span>
            </div>
            <div className="pt-2.5 border-t border-hairline">
              <span className="font-mono text-[11px] text-ink-muted block">Marco</span>
              <span className="text-ink">{sa.marco}</span>
            </div>
            <div className="pt-2.5 border-t border-hairline">
              <span className="font-mono text-[11px] text-ink-muted block">Reto inicial</span>
              <span className="text-ink font-medium">{sa.retoInicial}</span>
            </div>
            <div className="pt-2.5 border-t border-hairline">
              <span className="font-mono text-[11px] text-ink-muted block">Producto final</span>
              <span className="text-ink">{sa.productoFinal}</span>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="flex flex-col gap-2.5">
              <h5 className="font-mono text-xs font-semibold text-ink">Secuencia didáctica</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {sa.secuencia.map((paso) => (
                  <div
                    key={paso.fase}
                    className="border border-hairline bg-canvas p-3.5 flex flex-col gap-1"
                  >
                    <span className="font-mono text-xs font-semibold text-ochre">{paso.fase}</span>
                    <p className="text-sm leading-relaxed text-ink m-0">{paso.texto}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <h5 className="font-mono text-xs font-semibold text-ink">
                Atención a la diversidad (DUA)
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {sa.dua.map((item) => (
                  <div key={item.eje} className="border-t border-hairline pt-2.5">
                    <span className="font-mono text-xs font-medium text-lapis block mb-1">
                      {item.eje}
                    </span>
                    <p className="text-sm leading-relaxed text-ink-muted m-0">{item.texto}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-hairline text-sm leading-relaxed text-ink">
              <strong className="font-mono text-xs text-ink mr-1.5">Evaluación ·</strong>
              {sa.evaluacion}
            </div>
          </div>
        </div>

        <p className="font-mono text-xs leading-relaxed text-ink-muted bg-paper border-t border-b border-hairline px-4 py-3 m-0">
          <strong className="text-ink">Alcance y honestidad normativa ·</strong> {sa.aviso}
        </p>
      </div>

      {/* SECTION F: 5 University Comprehension Questions */}
      <div className="border-t border-hairline pt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h4 className="font-display text-xl font-semibold text-ink">
            Preguntas de comprensión universitaria y andamiaje
          </h4>
          <p className="font-mono text-xs text-ink-muted">
            Pulse cada cuestión para desplegar la orientación académica de debate
          </p>
        </div>

        <div className="flex flex-col divide-y divide-hairline border-t border-b border-hairline">
          {AULA_PREGUNTAS_COMPRENSION.map((item, idx) => {
            const isOpen = openQuestionIdx === idx;
            return (
              <div key={item.pregunta} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenQuestionIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full min-h-[42px] text-left flex items-center justify-between gap-4 py-1 cursor-pointer"
                >
                  <span className="text-sm sm:text-[15px] font-medium text-ink">
                    <span className="font-mono text-xs text-ochre mr-2 tabular-nums">
                      0{idx + 1}.
                    </span>
                    {item.pregunta}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-ink-muted shrink-0 transition-transform duration-150 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <p className="mt-2.5 pl-7 text-sm leading-relaxed text-ink-muted max-w-[68ch]">
                    {item.orientacion}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION G: Normative References */}
      <div className="border-t border-hairline pt-5 flex flex-col gap-3">
        <h4 className="font-mono text-xs font-semibold text-ink">
          Marco y referencias normativas vigentes
        </h4>
        <ul className="m-0 p-0 list-none flex flex-col gap-2.5">
          {AULA_NORMATIVA.map((norm) => (
            <li key={norm.titulo} className="text-xs leading-relaxed text-ink-muted">
              <strong className="text-ink font-medium">{norm.titulo}:</strong> {norm.detalle}{' '}
              <a
                href={norm.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[11px] text-lapis hover:underline ml-1"
              >
                <span>Texto oficial</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
