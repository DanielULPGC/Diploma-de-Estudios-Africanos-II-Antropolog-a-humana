import { useState } from 'react';
import {
  SOURCES_DATA,
  SOURCES_ORDER,
  SOURCE_DIMENSIONS,
  type SourceId,
} from '../data/curriculum';
import { GlossaryTermTrigger } from './GlossaryContext';

interface HistoriographyModuleProps {
  onSendSourcesToSeminar?: (primary: SourceId, compare: SourceId | null) => void;
}

export function HistoriographyModule({ onSendSourcesToSeminar }: HistoriographyModuleProps) {
  const [primaryId, setPrimaryId] = useState<SourceId>('oral');
  const [compareId, setCompareId] = useState<SourceId | null>('arch');

  const primary = SOURCES_DATA[primaryId];
  const compare = compareId ? SOURCES_DATA[compareId] : null;

  const handlePrimarySelect = (id: SourceId) => {
    setPrimaryId(id);
    if (compareId === id) {
      setCompareId(null);
    }
  };

  const x0 = 236;
  const maxW = 318;

  return (
    <section
      id="sec-historiografia"
      className="pt-12 border-t border-hairline flex flex-col gap-7 scroll-mt-20"
    >
      <div className="flex flex-col gap-3">
        <div className="font-mono text-xs tracking-wide text-ochre">
          05. Epistemología e historiografía africana
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight tracking-tight text-ink max-w-3xl [text-wrap:balance]">
          ¿Cómo se escribe la historia precolonial? La triangulación de fuentes
        </h2>
        <div className="mt-1 py-3 px-4 bg-paper border-t border-b border-hairline max-w-3xl text-sm leading-relaxed text-ink-muted">
          <span className="font-mono text-xs font-medium text-ink mr-2">
            Objetivo de aprendizaje ·
          </span>
          Evaluar las fortalezas y sesgos de las cuatro grandes familias de fuentes empleadas por
          la escuela historiográfica africana moderna.
        </div>
      </div>

      <div className="flex flex-col gap-4 max-w-[68ch] text-base leading-[1.72] text-ink">
        <p>
          La renovación impulsada desde los años 1950–1980 por escuelas como las de Ibadán, Dakar,
          Dar es-Salam y el proyecto de la <em>Historia General de África</em> de la UNESCO
          (dirigido por figuras como Joseph Ki-Zerbo, Bethwell Ogot, Cheikh Anta Diop o Jan
          Vansina) demostró que la ausencia de archivos europeos no equivale a ausencia de
          historia. La clave metodológica es{' '}
          <strong>
            <GlossaryTermTrigger termId="triangulacion-fuentes" tone="lapis">
              triangular fuentes diversas
            </GlossaryTermTrigger>
          </strong>{' '}
          para corregir sus respectivos sesgos.
        </p>
      </div>

      <div className="py-7 border-t border-rule border-b border-b-hairline flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-display text-lg sm:text-xl font-semibold text-ink">
              Comparador de disciplinas y fuentes para la historia africana antigua
            </h3>
            <p className="font-mono text-xs text-ink-muted">
              Seleccione una fuente principal y superponga opcionalmente una segunda para visualizar
              cómo se compensan sus sesgos
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-xs text-ochre font-medium">
                Fuente principal (Ocre)
              </span>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Selector de fuente historiográfica principal"
              >
                {SOURCES_ORDER.map((id) => {
                  const isSel = id === primaryId;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handlePrimarySelect(id)}
                      aria-pressed={isSel}
                      className={`min-h-[40px] px-3.5 py-2 text-xs font-medium rounded border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        isSel
                          ? 'bg-ochre text-white border-ochre'
                          : 'bg-canvas text-ink border-hairline hover:border-ink hover:bg-paper'
                      }`}
                    >
                      {SOURCES_DATA[id].shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-xs text-lapis font-medium">
                Superponer contraste (Lapislázuli)
              </span>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Selector de segunda fuente para superponer"
              >
                <button
                  type="button"
                  onClick={() => setCompareId(null)}
                  aria-pressed={compareId === null}
                  className={`min-h-[40px] px-3 py-2 text-xs font-medium rounded border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    compareId === null
                      ? 'bg-ink text-white border-ink'
                      : 'bg-canvas text-ink-muted border-hairline hover:border-ink'
                  }`}
                >
                  Sin contraste
                </button>
                {SOURCES_ORDER.filter((id) => id !== primaryId).map((id) => {
                  const isComp = compareId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCompareId(id)}
                      aria-pressed={isComp}
                      className={`min-h-[40px] px-3 py-2 text-xs font-medium rounded border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        isComp
                          ? 'bg-lapis text-white border-lapis'
                          : 'bg-canvas text-ink border-hairline hover:border-lapis hover:bg-lapis-soft'
                      }`}
                    >
                      {SOURCES_DATA[id].shortLabel.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 w-full">
            <svg
              viewBox="0 0 640 305"
              className="w-full h-auto block"
              role="img"
              aria-label="Perfil metodológico comparado de las fuentes en historia africana"
            >
              <text x={0} y={18} className="font-mono" fontSize={11} fill="#575753">
                Perfil metodológico relativo · {primary.shortLabel}
                {compare ? ` vs. ${compare.shortLabel}` : ''}
              </text>

              {[0, 25, 50, 75, 100].map((t) => {
                const x = x0 + (t / 100) * maxW;
                return (
                  <g key={t}>
                    <line
                      x1={x}
                      y1={36}
                      x2={x}
                      y2={252}
                      stroke="#e2e2dd"
                      strokeWidth={1}
                      strokeDasharray="2 3"
                    />
                    <text
                      x={x}
                      y={270}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize={11}
                      fill="#575753"
                    >
                      {t}
                    </text>
                  </g>
                );
              })}

              <line x1={x0} y1={36} x2={x0} y2={252} stroke="#121212" strokeWidth={1} />

              {SOURCE_DIMENSIONS.map((dim, idx) => {
                const baseY = 62 + idx * 50;
                const valPrimary = primary.scores[dim.key];
                const wPrimary = (valPrimary / 100) * maxW;
                const valCompare = compare ? compare.scores[dim.key] : null;
                const wCompare = valCompare !== null ? (valCompare / 100) * maxW : 0;

                return (
                  <g key={dim.key}>
                    <text
                      x={x0 - 12}
                      y={baseY + 4}
                      textAnchor="end"
                      className="font-mono"
                      fontSize={11.5}
                      fill="#121212"
                    >
                      {dim.label}
                    </text>

                    {/* Primary line */}
                    <line
                      x1={x0}
                      y1={compare ? baseY - 6 : baseY}
                      x2={x0 + wPrimary}
                      y2={compare ? baseY - 6 : baseY}
                      stroke="#d95216"
                      strokeWidth={4}
                    />
                    <circle
                      cx={x0 + wPrimary}
                      cy={compare ? baseY - 6 : baseY}
                      r={5.5}
                      fill="#d95216"
                    />
                    <text
                      x={x0 + wPrimary + 10}
                      y={(compare ? baseY - 6 : baseY) + 4}
                      className="font-mono"
                      fontSize={11}
                      fontWeight={600}
                      fill="#b43c0b"
                    >
                      {valPrimary}
                    </text>

                    {/* Optional Compare line */}
                    {compare && valCompare !== null && (
                      <g>
                        <line
                          x1={x0}
                          y1={baseY + 9}
                          x2={x0 + wCompare}
                          y2={baseY + 9}
                          stroke="#1f5fa8"
                          strokeWidth={3.5}
                        />
                        <rect
                          x={x0 + wCompare - 4.5}
                          y={baseY + 4.5}
                          width={9}
                          height={9}
                          fill="#1f5fa8"
                        />
                        <text
                          x={x0 + wCompare + 10}
                          y={baseY + 13}
                          className="font-mono"
                          fontSize={11}
                          fontWeight={600}
                          fill="#1f5fa8"
                        >
                          {valCompare}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              <text
                x={x0 + maxW}
                y={292}
                textAnchor="end"
                className="font-mono"
                fontSize={10.5}
                fill="#73736e"
              >
                Valoración didáctica comparada (ninguna fuente basta por sí sola)
              </text>
            </svg>
          </div>

          <aside
            className="lg:col-span-5 bg-paper border-t-2 border-t-rule border-b border-b-hairline p-6 flex flex-col gap-3.5"
            aria-live="polite"
          >
            <div className="font-mono text-xs font-medium text-ochre">{primary.kicker}</div>
            <h4 className="font-display text-xl font-semibold text-ink leading-snug">
              {primary.title}
            </h4>
            <p className="text-sm leading-relaxed text-ink">{primary.desc}</p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 pt-3 border-t border-hairline m-0">
              <div className="flex flex-col gap-0.5">
                <dt className="font-mono text-[11px] text-ink-muted">Fortaleza principal</dt>
                <dd className="font-mono text-xs font-medium text-ink m-0">{primary.str}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="font-mono text-[11px] text-ink-muted">Cautela crítica</dt>
                <dd className="font-mono text-xs font-medium text-ink m-0">{primary.bias}</dd>
              </div>
            </dl>
            {compare && (() => {
              const bestGain = SOURCE_DIMENSIONS.map((d) => ({
                label: d.label,
                diff: compare.scores[d.key] - primary.scores[d.key],
                compScore: compare.scores[d.key],
              })).sort((a, b) => b.diff - a.diff)[0];
              return (
                <div className="bg-canvas border border-hairline p-3.5 flex flex-col gap-1.5 text-xs">
                  <div className="font-mono font-semibold text-lapis">
                    Síntesis de triangulación · + {compare.shortLabel}
                  </div>
                  <p className="text-ink leading-relaxed m-0">
                    {bestGain && bestGain.diff > 0 ? (
                      <>
                        Compensa el perfil de <em>{primary.shortLabel}</em> especialmente en{' '}
                        <strong>{bestGain.label.toLowerCase()}</strong> (
                        <span className="font-mono text-lapis font-semibold tabular-nums">
                          +{bestGain.diff} pts
                        </span>
                        ).{' '}
                      </>
                    ) : null}
                    Aporta: {compare.str.toLowerCase()}.
                  </p>
                </div>
              );
            })()}
            {onSendSourcesToSeminar && (
              <div className="pt-2 border-t border-hairline">
                <button
                  type="button"
                  onClick={() => onSendSourcesToSeminar(primaryId, compareId)}
                  className="min-h-[40px] px-3.5 py-2 text-xs font-medium text-ink bg-canvas border border-hairline rounded hover:border-ink hover:bg-surface transition-colors duration-150 whitespace-nowrap cursor-pointer"
                >
                  Llevar este par de fuentes al Taller de Ficha Crítica
                </button>
              </div>
            )}
          </aside>
        </div>

        <p className="font-mono text-xs text-ink-muted">
          Fuentes: Vansina (1985), <em>Oral Tradition as History</em>; Ki-Zerbo (1982),{' '}
          <em>Historia General de África, Vol. I: Metodología y prehistoria africana</em> (UNESCO).
        </p>
      </div>
    </section>
  );
}
