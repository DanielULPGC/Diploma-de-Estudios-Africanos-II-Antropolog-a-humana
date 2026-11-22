import { useEffect, useState } from 'react';
import { CheckCircle2, ChevronDown, ExternalLink, RotateCcw, Shuffle, XCircle } from 'lucide-react';
import { BIBLIOGRAPHY_ENTRIES, QUIZ_QUESTIONS } from '../data/curriculum';
import {
  ATLAS_CLADOS,
  ATLAS_REGIONES,
  ATLAS_TAXONES,
  type TaxonPaleo,
} from '../data/atlasPaleo';

const QUIZ_STORAGE_KEY = 'ulpgc_dea_m1_quiz_v1';

interface DynamicQuestion {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function fmtInterval(t: TaxonPaleo): string {
  const f = (v: number) => (v === 0 ? 'hoy' : `${v.toFixed(v < 1 ? 2 : 1).replace('.', ',')} Ma`);
  return t.desde === t.hasta ? f(t.desde) : `${f(t.desde)}–${f(t.hasta)}`;
}

function generateAtlasDrillQuestions(): DynamicQuestion[] {
  const hominins = ATLAS_TAXONES.filter((t) => t.desde <= 7.5);
  const african = hominins.filter((t) => ATLAS_REGIONES[t.region]?.esAfrica);
  const nonAfrican = hominins.filter((t) => !ATLAS_REGIONES[t.region]?.esAfrica);
  const debated = hominins.filter((t) => t.debatido);
  const nonDebated = hominins.filter((t) => !t.debatido);
  const questions: DynamicQuestion[] = [];

  // Q1 & Q2: Region of a random African hominin
  const regionPicks = shuffle(african).slice(0, 2);
  regionPicks.forEach((target) => {
    const correctReg = ATLAS_REGIONES[target.region]?.nombre ?? target.region;
    const otherRegs = shuffle(
      Array.from(
        new Set(
          Object.values(ATLAS_REGIONES)
            .map((r) => r.nombre)
            .filter((n) => n !== correctReg)
        )
      )
    ).slice(0, 3);
    const opts = shuffle([correctReg, ...otherRegs]);
    questions.push({
      q: `¿En qué región principal del Atlas se documenta ${target.n}?`,
      options: opts,
      correct: opts.indexOf(correctReg),
      explanation: `${target.n} (${fmtInterval(target)}) se registra principalmente en ${correctReg}. ${target.nota}`,
    });
  });

  // Q3 & Q4: Oldest species among 4 candidates
  for (let k = 0; k < 2; k++) {
    const pool = shuffle(hominins);
    const chosen: TaxonPaleo[] = [];
    for (const t of pool) {
      if (chosen.every((c) => Math.abs(c.desde - t.desde) >= 0.6)) {
        chosen.push(t);
      }
      if (chosen.length === 4) break;
    }
    if (chosen.length === 4) {
      const oldest = [...chosen].sort((a, b) => b.desde - a.desde)[0];
      const opts = chosen.map((c) => c.n);
      questions.push({
        q: 'Según los intervalos cronológicos del Atlas, ¿cuál de estos táxones aparece antes en el registro fósil?',
        options: opts,
        correct: opts.indexOf(oldest.n),
        explanation: `${oldest.n} presenta la fecha inicial más antigua de la serie (${fmtInterval(
          oldest
        )}), frente a ${chosen
          .filter((c) => c.id !== oldest.id)
          .map((c) => `${c.n} (${fmtInterval(c)})`)
          .join(', ')}.`,
      });
    }
  }

  // Q5: Coexistence check
  const pairPool = shuffle(hominins);
  let pairA = pairPool[0];
  let pairB = pairPool[1];
  for (let i = 0; i < pairPool.length - 1; i++) {
    if (pairPool[i].id !== pairPool[i + 1].id) {
      pairA = pairPool[i];
      pairB = pairPool[i + 1];
      break;
    }
  }
  const overlapStart = Math.min(pairA.desde, pairB.desde);
  const overlapEnd = Math.max(pairA.hasta, pairB.hasta);
  const overlapped = overlapStart > overlapEnd;
  questions.push({
    q: `Según sus intervalos aproximados en el Atlas, ¿coincidieron en el tiempo ${pairA.n} y ${pairB.n}?`,
    options: [
      'Sí, sus intervalos cronológicos se superponen parcialmente',
      'No, sus intervalos conocidos no se superponen en el tiempo',
      'Son exactamente la misma especie con distinto nombre regional',
      'Ninguna de las dos cuenta con datación aproximada en el Atlas',
    ],
    correct: overlapped ? 0 : 1,
    explanation: `${pairA.n} (${fmtInterval(pairA)}) y ${pairB.n} (${fmtInterval(pairB)}) ${
      overlapped
        ? 'presentan solapamiento temporal aproximado, aunque coexistir en el tiempo no implica necesariamente contacto directo.'
        : 'no se solapan según las dataciones actuales del corpus.'
    }`,
  });

  // Q6: Clade membership
  const cladePick = shuffle(hominins)[0];
  const correctClade = ATLAS_CLADOS[cladePick.c]?.nombre ?? cladePick.c;
  const otherClades = shuffle(
    Object.values(ATLAS_CLADOS)
      .map((c) => c.nombre)
      .filter((n) => n !== correctClade)
  ).slice(0, 3);
  const cladeOpts = shuffle([correctClade, ...otherClades]);
  questions.push({
    q: `¿En qué agrupación o clado principal clasifica el Atlas a ${cladePick.n}?`,
    options: cladeOpts,
    correct: cladeOpts.indexOf(correctClade),
    explanation: `${cladePick.n} se agrupa en «${correctClade}» (${fmtInterval(cladePick)}).`,
  });

  // Q7: African vs Non-African provenance
  const africaTarget = shuffle(african)[0];
  const nonAfricaDistractors = shuffle(nonAfrican).slice(0, 3);
  if (africaTarget && nonAfricaDistractors.length === 3) {
    const provOpts = shuffle([africaTarget, ...nonAfricaDistractors]).map((t) => t.n);
    questions.push({
      q: '¿Cuál de estas especies u homininos se documenta en una región africana dentro del Atlas?',
      options: provOpts,
      correct: provOpts.indexOf(africaTarget.n),
      explanation: `${africaTarget.n} se documenta en ${
        ATLAS_REGIONES[africaTarget.region]?.nombre ?? africaTarget.region
      } (África), mientras que las otras tres entradas corresponden a regiones euroasiáticas.`,
    });
  }

  // Q8: Debated taxon identification
  const debTarget = shuffle(debated)[0];
  const clearDistractors = shuffle(nonDebated).slice(0, 3);
  if (debTarget && clearDistractors.length === 3) {
    const debOpts = shuffle([debTarget, ...clearDistractors]).map((t) => t.n);
    questions.push({
      q: '¿Cuál de las siguientes entradas aparece marcada explícitamente como «táxon o interpretación debatida» en el Atlas?',
      options: debOpts,
      correct: debOpts.indexOf(debTarget.n),
      explanation: `${debTarget.n} figura como debatido en el corpus: ${debTarget.nota}`,
    });
  }

  return questions.slice(0, 8);
}

export function QuizAndBibliography() {
  const [quizMode, setQuizMode] = useState<'modulo' | 'atlas-drill'>('modulo');

  // Mode 1: Fixed 12-question Module I quiz
  const [quizIdx, setQuizIdx] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [answers, setAnswers] = useState<Array<number | null>>(() => {
    try {
      const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed) && parsed.length <= QUIZ_QUESTIONS.length) {
          const migrated: Array<number | null> = new Array(QUIZ_QUESTIONS.length).fill(null);
          for (let i = 0; i < parsed.length; i++) {
            const val = parsed[i];
            if (
              typeof val === 'number' &&
              Number.isInteger(val) &&
              val >= 0 &&
              val < QUIZ_QUESTIONS[i].options.length
            ) {
              migrated[i] = val;
            }
          }
          return migrated;
        }
      }
    } catch {
      // Ignore storage errors
    }
    return new Array(QUIZ_QUESTIONS.length).fill(null);
  });

  // Mode 2: Dynamic 8-question ULPGC DEA Atlas drill
  const [drillQuestions, setDrillQuestions] = useState<DynamicQuestion[]>(() =>
    generateAtlasDrillQuestions()
  );
  const [drillIdx, setDrillIdx] = useState(0);
  const [drillShowSummary, setDrillShowSummary] = useState(false);
  const [drillAnswers, setDrillAnswers] = useState<Array<number | null>>(() =>
    new Array(8).fill(null)
  );

  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // Ignore storage quota errors
    }
  }, [answers]);

  const activeQuestions = quizMode === 'modulo' ? QUIZ_QUESTIONS : drillQuestions;
  const activeIdx = quizMode === 'modulo' ? quizIdx : drillIdx;
  const activeAnswers = quizMode === 'modulo' ? answers : drillAnswers;
  const activeShowSummary = quizMode === 'modulo' ? showSummary : drillShowSummary;

  const totalCorrect = activeAnswers.reduce<number>(
    (acc, ans, i) => acc + (activeQuestions[i] && ans === activeQuestions[i].correct ? 1 : 0),
    0
  );
  const answeredCount = activeAnswers.filter((a) => a !== null).length;

  const q = activeQuestions[activeIdx] ?? activeQuestions[0];
  const chosen = activeAnswers[activeIdx];
  const isRight = chosen === q.correct;
  const letters = ['A', 'B', 'C', 'D'];

  const handleAnswer = (optIdx: number) => {
    if (activeAnswers[activeIdx] !== null) return;
    if (quizMode === 'modulo') {
      setAnswers((prev) => {
        const next = [...prev];
        next[activeIdx] = optIdx;
        return next;
      });
    } else {
      setDrillAnswers((prev) => {
        const next = [...prev];
        next[activeIdx] = optIdx;
        return next;
      });
    }
  };

  const handleMove = (delta: number) => {
    if (quizMode === 'modulo') {
      if (showSummary && delta < 0) {
        setShowSummary(false);
        setQuizIdx(QUIZ_QUESTIONS.length - 1);
        return;
      }
      const next = quizIdx + delta;
      if (next >= 0 && next < QUIZ_QUESTIONS.length) {
        setShowSummary(false);
        setQuizIdx(next);
      } else if (next >= QUIZ_QUESTIONS.length) {
        setShowSummary(true);
      }
    } else {
      if (drillShowSummary && delta < 0) {
        setDrillShowSummary(false);
        setDrillIdx(drillQuestions.length - 1);
        return;
      }
      const next = drillIdx + delta;
      if (next >= 0 && next < drillQuestions.length) {
        setDrillShowSummary(false);
        setDrillIdx(next);
      } else if (next >= drillQuestions.length) {
        setDrillShowSummary(true);
      }
    }
  };

  const handleReset = () => {
    if (quizMode === 'modulo') {
      setQuizIdx(0);
      setShowSummary(false);
      setAnswers(new Array(QUIZ_QUESTIONS.length).fill(null));
    } else {
      const fresh = generateAtlasDrillQuestions();
      setDrillQuestions(fresh);
      setDrillIdx(0);
      setDrillShowSummary(false);
      setDrillAnswers(new Array(fresh.length).fill(null));
    }
  };

  const getSummaryFeedback = () => {
    const total = activeQuestions.length;
    let msg = `Has completado ${answeredCount} de ${total} preguntas con ${totalCorrect} aciertos.`;
    if (totalCorrect === total) {
      msg +=
        ' Dominio sobresaliente de la antropología, etología comparada, paleoantropología e historiografía africana.';
    } else if (totalCorrect >= Math.ceil(total * 0.6)) {
      msg +=
        ' Buen dominio conceptual; repasa las fichas interactivas de los módulos donde hayas dudado antes del seminario.';
    } else {
      msg +=
        ' Te recomendamos explorar nuevamente los módulos interactivos (Temas 1–10, Atlas Paleo, Etología, reinos y redes comerciales) y repetir el ejercicio.';
    }
    return msg;
  };

  return (
    <section
      id="sec-quiz"
      className="pt-12 border-t border-hairline flex flex-col gap-7 scroll-mt-20"
    >
      <div className="flex flex-col gap-3">
        <div className="font-mono text-xs tracking-wide text-ochre">
          06. Comprobación de aprendizajes y Repaso DEA
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight tracking-tight text-ink max-w-3xl [text-wrap:balance]">
          Autoevaluación formativa y repaso dinámico del Atlas
        </h2>
        <p className="text-base leading-[1.7] text-ink-muted max-w-[68ch]">
          Alterne entre la evaluación formativa general del Módulo I ({QUIZ_QUESTIONS.length}{' '}
          cuestiones fijas) y el <strong>repaso dinámico del Portal DEA</strong>, que genera baterías
          frescas de 8 preguntas directamente a partir de los 52 táxones y 24 regiones del Atlas.
        </p>

        {/* Mode Switcher */}
        <div className="flex flex-wrap gap-2 pt-1" role="tablist" aria-label="Modalidad de evaluación">
          <button
            type="button"
            role="tab"
            aria-selected={quizMode === 'modulo'}
            onClick={() => setQuizMode('modulo')}
            className={`min-h-[40px] px-4 py-1.5 text-xs font-semibold rounded border cursor-pointer transition-colors ${
              quizMode === 'modulo'
                ? 'bg-ink text-white border-ink'
                : 'bg-canvas text-ink border-hairline hover:border-ink'
            }`}
          >
            Autoevaluación Módulo I ({QUIZ_QUESTIONS.length} preguntas)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={quizMode === 'atlas-drill'}
            onClick={() => setQuizMode('atlas-drill')}
            className={`min-h-[40px] px-4 py-1.5 text-xs font-semibold rounded border cursor-pointer transition-colors ${
              quizMode === 'atlas-drill'
                ? 'bg-ink text-white border-ink'
                : 'bg-canvas text-ink border-hairline hover:border-ink'
            }`}
          >
            Repaso dinámico Atlas DEA (8 preguntas)
          </button>
        </div>
      </div>

      <div className="bg-paper border-t-2 border-t-rule border-b border-b-hairline p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-hairline">
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-xs font-medium text-ochre tabular-nums">
              {activeShowSummary
                ? 'Resumen final de la autoevaluación'
                : `Pregunta ${activeIdx + 1} de ${activeQuestions.length}`}
            </span>
            <span className="font-mono text-xs text-ink-muted tabular-nums">
              Aciertos acumulados: {totalCorrect} / {activeQuestions.length} · Respondidas:{' '}
              {answeredCount} / {activeQuestions.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleMove(-1)}
              disabled={!activeShowSummary && activeIdx === 0}
              className="min-h-[40px] px-3.5 py-2 text-xs font-medium rounded border border-hairline bg-canvas text-ink hover:border-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 whitespace-nowrap cursor-pointer"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => handleMove(1)}
              disabled={activeShowSummary}
              className="min-h-[40px] px-4 py-2 text-xs font-medium rounded border border-ink bg-ink text-white hover:bg-ink/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 whitespace-nowrap cursor-pointer"
            >
              {activeIdx === activeQuestions.length - 1 && !activeShowSummary
                ? 'Ver resumen'
                : 'Siguiente'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="min-h-[40px] px-3 py-2 text-xs font-medium rounded border border-hairline bg-canvas text-ink-muted hover:text-ink hover:border-ink inline-flex items-center gap-1.5 transition-colors duration-150 whitespace-nowrap cursor-pointer"
            >
              {quizMode === 'atlas-drill' ? (
                <>
                  <Shuffle className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
                  <span>Nuevas 8 preguntas</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reiniciar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Completion progress bar */}
        <div
          className="h-1.5 w-full bg-surface-high overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={activeQuestions.length}
          aria-valuenow={answeredCount}
          aria-label={`Progreso de la autoevaluación: ${answeredCount} de ${activeQuestions.length} respondidas`}
        >
          <div
            className="h-full bg-ochre transition-[width] duration-200"
            style={{ width: `${(answeredCount / Math.max(1, activeQuestions.length)) * 100}%` }}
          />
        </div>

        {/* Question stepper buttons */}
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Preguntas">
          {activeQuestions.map((item, i) => {
            const ans = activeAnswers[i];
            const isCurrent = !activeShowSummary && i === activeIdx;
            const isItemCorrect = ans !== null && ans === item.correct;
            const statusText =
              ans === null ? 'Sin responder' : isItemCorrect ? 'Correcta' : 'Incorrecta';
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-label={`Pregunta ${i + 1}: ${statusText}`}
                onClick={() => {
                  if (quizMode === 'modulo') {
                    setShowSummary(false);
                    setQuizIdx(i);
                  } else {
                    setDrillShowSummary(false);
                    setDrillIdx(i);
                  }
                }}
                className={`min-h-[38px] px-3 py-1 font-mono text-xs tabular-nums rounded border transition-colors duration-150 whitespace-nowrap cursor-pointer inline-flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-ink text-white border-ink'
                    : ans === null
                      ? 'bg-canvas text-ink-muted border-hairline hover:border-ink'
                      : isItemCorrect
                        ? 'bg-forest-soft text-forest border-forest/40'
                        : 'bg-crimson-soft text-crimson border-crimson/40'
                }`}
              >
                <span>P{i + 1}</span>
                {ans !== null && (
                  <span aria-hidden="true" className="font-bold">
                    {isItemCorrect ? '✓' : '✗'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div
          className="bg-canvas border border-hairline p-6 sm:p-7 flex flex-col gap-5"
          aria-live="polite"
        >
          {!activeShowSummary ? (
            <>
              <h3 className="font-display text-lg sm:text-xl font-semibold text-ink leading-snug">
                {q.q}
              </h3>
              <div className="flex flex-col gap-2.5">
                {q.options.map((opt, i) => {
                  const isCorrectOpt = i === q.correct;
                  const isWrongChosen = chosen === i && i !== q.correct;
                  let optStyle =
                    'bg-canvas border-hairline text-ink hover:border-ink hover:bg-paper';
                  if (chosen !== null) {
                    if (isCorrectOpt) {
                      optStyle = 'bg-forest-soft border-forest text-ink';
                    } else if (isWrongChosen) {
                      optStyle = 'bg-crimson-soft border-crimson text-ink';
                    } else {
                      optStyle = 'bg-canvas border-hairline text-ink-muted opacity-75';
                    }
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAnswer(i)}
                      disabled={chosen !== null}
                      className={`text-left min-h-[48px] px-4 py-3 border rounded flex items-start gap-3 transition-colors duration-150 ${optStyle} ${
                        chosen === null ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <span className="font-mono text-xs font-semibold text-ink-muted mt-0.5 shrink-0">
                        {letters[i]}.
                      </span>
                      <span className="text-sm leading-relaxed flex-1">{opt}</span>
                      {chosen !== null && isCorrectOpt && (
                        <CheckCircle2
                          className="w-4 h-4 text-forest shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                      )}
                      {chosen !== null && isWrongChosen && (
                        <XCircle
                          className="w-4 h-4 text-crimson shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {chosen !== null && (
                <div
                  className={`p-4 border rounded flex items-start gap-3 text-sm leading-relaxed ${
                    isRight
                      ? 'bg-forest-soft border-forest/40 text-ink'
                      : 'bg-crimson-soft border-crimson/40 text-ink'
                  }`}
                >
                  {isRight ? (
                    <CheckCircle2
                      className="w-5 h-5 text-forest shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  ) : (
                    <XCircle
                      className="w-5 h-5 text-crimson shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                  )}
                  <div>
                    <span
                      className={`font-mono text-xs font-semibold mr-2 ${
                        isRight ? 'text-forest' : 'text-crimson'
                      }`}
                    >
                      {isRight ? 'Respuesta correcta ·' : 'Revisa este punto ·'}
                    </span>
                    {q.explanation}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="font-mono text-xs font-medium text-ochre">
                {quizMode === 'modulo'
                  ? 'Resumen de autoevaluación · Módulo I'
                  : 'Resumen del repaso dinámico · Atlas DEA'}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink tabular-nums">
                Resultado final: {totalCorrect} / {activeQuestions.length}
              </h3>
              <p className="text-base leading-relaxed text-ink max-w-2xl">
                {getSummaryFeedback()}
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="min-h-[42px] px-4 py-2 text-xs font-medium rounded border border-ochre bg-ochre text-white hover:bg-ink hover:border-ink transition-colors duration-150 whitespace-nowrap cursor-pointer"
                >
                  {quizMode === 'atlas-drill'
                    ? 'Generar nueva batería de 8 preguntas'
                    : 'Intentar de nuevo'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (quizMode === 'modulo') {
                      setShowSummary(false);
                      setQuizIdx(0);
                    } else {
                      setDrillShowSummary(false);
                      setDrillIdx(0);
                    }
                  }}
                  className="min-h-[42px] px-4 py-2 text-xs font-medium rounded border border-hairline bg-canvas text-ink hover:border-ink transition-colors duration-150 whitespace-nowrap cursor-pointer"
                >
                  Revisar respuestas
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Bibliography Drawer */}
      <details className="group bg-paper border-t border-rule border-b border-b-hairline px-6 py-4">
        <summary className="list-none flex items-center justify-between gap-4 min-h-[44px] cursor-pointer font-display text-lg font-semibold text-ink">
          <span>Bibliografía esencial APA 7.ª y guía de seminario para el Diploma</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-normal text-ink-muted whitespace-nowrap shrink-0">
            <span className="tabular-nums">
              {BIBLIOGRAPHY_ENTRIES.reduce((acc, cat) => acc + cat.items.length, 0)} referencias
            </span>
            <ChevronDown
              className="w-4 h-4 transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </span>
        </summary>
        <div className="pt-4 mt-3 border-t border-hairline flex flex-col gap-5 text-sm leading-relaxed text-ink">
          {BIBLIOGRAPHY_ENTRIES.map((group) => (
            <div key={group.category} className="flex flex-col gap-2 max-w-4xl">
              <h3 className="font-mono text-xs font-semibold tracking-wide text-ochre m-0">
                {group.category}
              </h3>
              <ul className="m-0 pl-5 flex flex-col gap-1.5 text-xs sm:text-[13px] leading-relaxed text-ink">
                {group.items.map((item) => (
                  <li key={item.citation} className="pl-1">
                    <span>{item.citation}</span>
                    {item.doi && (
                      <a
                        href={`https://doi.org/${item.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 ml-1.5 font-mono text-[11px] text-lapis hover:underline"
                      >
                        <span>https://doi.org/{item.doi}</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    )}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 ml-1.5 font-mono text-[11px] text-lapis hover:underline"
                      >
                        <span>{item.urlLabel ?? item.url}</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Complementary Open Scientific Repositories: Pastwomen & Smithsonian Human Origins */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            <div className="bg-canvas border border-hairline p-4 flex flex-col justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[11px] font-semibold text-ochre">
                  Red Temática Pastwomen · Arqueología de género y evolución humana
                </span>
                <p className="text-xs leading-relaxed text-ink m-0">
                  Materiales abiertos de universidades españolas (UAB, UJA, UGR, UAM, UPF, UV,
                  UniOvi): láminas no androcéntricas, cuadernos didácticos y datos sobre actividades
                  de mantenimiento, parto asistido, cuidados e infancia en la Prehistoria.
                </p>
              </div>
              <a
                href="https://www.pastwomen.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[38px] px-3.5 py-2 font-mono text-xs text-ink bg-paper border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors whitespace-nowrap self-start"
              >
                <span>Explorar pastwomen.net</span>
                <ExternalLink className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
              </a>
            </div>

            <div className="bg-canvas border border-hairline p-4 flex flex-col justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[11px] font-semibold text-lapis">
                  Smithsonian Institution · Human Origins Program (NMNH)
                </span>
                <p className="text-xs leading-relaxed text-ink m-0">
                  Portal científico dirigido por Rick Potts: línea temporal interactiva de 6 Ma,
                  árbol familiar ramificado, catálogo de fósiles africanos, hipótesis de selección
                  por variabilidad en Olorgesailie y modelos craneales 3D.
                </p>
              </div>
              <a
                href="https://humanorigins.si.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[38px] px-3.5 py-2 font-mono text-xs text-ink bg-paper border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors whitespace-nowrap self-start"
              >
                <span>Explorar humanorigins.si.edu</span>
                <ExternalLink className="w-3.5 h-3.5 text-lapis" aria-hidden="true" />
              </a>
            </div>
          </div>

          <p className="font-mono text-xs text-ink-muted pt-3 border-t border-hairline max-w-4xl">
            <strong className="text-ink">Actividad recomendada de seminario:</strong> Utilice el
            Constructor de Ficha Crítica anterior para seleccionar uno de los seis reinos del
            Módulo 3 y contrastar al menos dos familias de fuentes del Módulo 5 antes de la sesión
            presencial.
          </p>
        </div>
      </details>
    </section>
  );
}
