import { useState } from 'react';
import {
  EDITORIAL_PLATES,
  TRADE_DATA,
  type TradeFlowId,
  type TradeNetId,
} from '../data/curriculum';
import { EditorialPlate } from './EditorialPlate';

export function TradeSimulatorModule() {
  const [net, setNet] = useState<TradeNetId>('sahara');
  const [flow, setFlow] = useState<TradeFlowId>('out');
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(0);

  const scenario = TRADE_DATA[net][flow];
  const activeStage = scenario.stages[selectedStageIdx] ?? scenario.stages[0];

  const isOut = flow === 'out';
  const isSahara = net === 'sahara';
  const flowStroke = isOut ? '#d95216' : '#1f5fa8';
  const flowText = isOut ? '#b43c0b' : '#1f5fa8';
  const flowSoft = isOut ? '#fdf3ee' : '#eef5fc';

  const handleNetChange = (nextNet: TradeNetId) => {
    setNet(nextNet);
    setSelectedStageIdx(flow === 'out' ? 0 : 3);
  };

  const handleFlowChange = (nextFlow: TradeFlowId) => {
    setFlow(nextFlow);
    setSelectedStageIdx(nextFlow === 'out' ? 0 : 3);
  };

  return (
    <section
      id="sec-comercio"
      className="pt-12 border-t border-hairline flex flex-col gap-7 scroll-mt-20"
    >
      <div className="flex flex-col gap-3">
        <div className="font-mono text-xs tracking-wide text-ochre">
          04. Globalización medieval afroeurasiática
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight tracking-tight text-ink max-w-3xl [text-wrap:balance]">
          El Sáhara y el Índico: autopistas de oro, saber y diplomacia
        </h2>
        <div className="mt-1 py-3 px-4 bg-paper border-t border-b border-hairline max-w-3xl text-sm leading-relaxed text-ink-muted">
          <span className="font-mono text-xs font-medium text-ink mr-2">
            Objetivo de aprendizaje ·
          </span>
          Analizar cómo el dromedario en el Sáhara y los vientos monzónicos en el Índico
          convirtieron a África en el eje monetario y comercial del Viejo Mundo medieval.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 flex flex-col gap-4 text-base leading-[1.72] text-ink">
          <p>
            Lejos de ser barreras infranqueables, el desierto del Sáhara y el océano Índico
            funcionaron como «mares» de circulación intensa. Entre los siglos XI y XV, hasta{' '}
            <strong>
              dos tercios del oro que acuñaban las cecas del Mediterráneo islámico y europeo
            </strong>{' '}
            procedían de África Occidental (campos auríferos de Bambuk, Buré y Akan),
            intercambiado por sal gema sahariana, tejidos, caballos y libros.
          </p>
          <p>
            Al otro lado del continente, la regularidad de los{' '}
            <span className="hl-lapis">vientos monzónicos</span> (hacia el sur entre noviembre y
            marzo; hacia el norte entre abril y septiembre) enlazaba las ciudades-estado swahili y
            el oro del Gran Zimbabue con Arabia, Persia, la India y la China de las dinastías Song
            y Ming.
          </p>
        </div>
        <div className="lg:col-span-6 reading-mode-hide">
          <EditorialPlate plate={EDITORIAL_PLATES.trade} />
        </div>
      </div>

      <div className="py-7 border-t border-rule border-b border-b-hairline flex flex-col gap-5">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-display text-lg sm:text-xl font-semibold text-ink">
              {scenario.title}
            </h3>
            <p className="font-mono text-xs text-ink-muted">{scenario.sub}</p>
          </div>

          <div className="flex flex-wrap gap-5">
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-xs text-ink-muted">Sistema comercial</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Sistema comercial">
                <button
                  type="button"
                  onClick={() => handleNetChange('sahara')}
                  aria-pressed={net === 'sahara'}
                  className={`min-h-[40px] px-3.5 py-2 text-xs font-medium rounded border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    net === 'sahara'
                      ? 'bg-ochre text-white border-ochre'
                      : 'bg-canvas text-ink border-hairline hover:border-ink hover:bg-paper'
                  }`}
                >
                  Red Transahariana
                </button>
                <button
                  type="button"
                  onClick={() => handleNetChange('indian')}
                  aria-pressed={net === 'indian'}
                  className={`min-h-[40px] px-3.5 py-2 text-xs font-medium rounded border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    net === 'indian'
                      ? 'bg-ochre text-white border-ochre'
                      : 'bg-canvas text-ink border-hairline hover:border-ink hover:bg-paper'
                  }`}
                >
                  Red del Océano Índico
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-xs text-ink-muted">Flujo destacado</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Dirección del flujo">
                <button
                  type="button"
                  onClick={() => handleFlowChange('out')}
                  aria-pressed={flow === 'out'}
                  className={`min-h-[40px] px-3.5 py-2 text-xs font-medium rounded border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    flow === 'out'
                      ? 'bg-lapis text-white border-lapis'
                      : 'bg-canvas text-ink border-hairline hover:border-ink hover:bg-paper'
                  }`}
                >
                  Desde el interior africano
                </button>
                <button
                  type="button"
                  onClick={() => handleFlowChange('in')}
                  aria-pressed={flow === 'in'}
                  className={`min-h-[40px] px-3.5 py-2 text-xs font-medium rounded border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    flow === 'in'
                      ? 'bg-lapis text-white border-lapis'
                      : 'bg-canvas text-ink border-hairline hover:border-ink hover:bg-paper'
                  }`}
                >
                  Hacia el interior africano
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 flex flex-col gap-3">
            <svg
              viewBox="0 0 640 336"
              className="w-full h-auto block"
              role="img"
              aria-label="Diagrama interactivo de las rutas comerciales transaharianas y del océano Índico"
            >
              <text x={14} y={20} className="font-mono" fontSize={11} fill="#575753">
                {isSahara
                  ? 'Eje Transahariano (Dromedario)'
                  : 'Eje del Océano Índico (Vientos Monzónicos)'}{' '}
                · Dirección: {isOut ? 'Interior africano → Exterior' : 'Exterior → Interior africano'}
              </text>

              <rect
                x={14}
                y={36}
                width={612}
                height={208}
                fill="#f7f7f5"
                stroke="#e2e2dd"
                strokeWidth={1}
              />

              {/* Directional curved flow path + animated pulse */}
              {isOut ? (
                <g>
                  <path
                    d="M 88 112 C 185 48, 455 48, 550 112"
                    stroke={flowStroke}
                    strokeWidth={3}
                    fill="none"
                    opacity={0.3}
                  />
                  <path
                    d="M 88 112 C 185 48, 455 48, 550 112"
                    stroke={flowStroke}
                    strokeWidth={3}
                    fill="none"
                    className="animate-route-forward"
                  />
                  <polygon points="556,116 544,105 548,119" fill={flowStroke} />
                </g>
              ) : (
                <g>
                  <path
                    d="M 552 112 C 455 48, 185 48, 90 112"
                    stroke={flowStroke}
                    strokeWidth={3}
                    fill="none"
                    opacity={0.3}
                  />
                  <path
                    d="M 552 112 C 455 48, 185 48, 90 112"
                    stroke={flowStroke}
                    strokeWidth={3}
                    fill="none"
                    className="animate-route-forward"
                  />
                  <polygon points="84,116 96,105 92,119" fill={flowStroke} />
                </g>
              )}

              <text
                x={320}
                y={66}
                textAnchor="middle"
                className="font-mono"
                fontSize={11.5}
                fontWeight={600}
                fill={flowText}
              >
                {scenario.arcLabel}
              </text>

              {/* Connecting track between 4 nodes */}
              <line
                x1={80}
                y1={154}
                x2={560}
                y2={154}
                stroke="#121212"
                strokeWidth={1.4}
                strokeDasharray="4 3"
              />

              {scenario.stages.map((st, idx) => {
                const isSelectedNode = idx === selectedStageIdx;
                return (
                  <g
                    key={st.label}
                    onClick={() => setSelectedStageIdx(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedStageIdx(idx);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Escala ${idx + 1}: ${st.label} (${st.item})`}
                    className="cursor-pointer"
                  >
                    <rect
                      x={st.x - 66}
                      y={124}
                      width={132}
                      height={60}
                      fill={isSelectedNode ? flowSoft : '#ffffff'}
                      stroke={isSelectedNode ? flowStroke : '#121212'}
                      strokeWidth={isSelectedNode ? 2.2 : 1}
                    />
                    <text
                      x={st.x}
                      y={148}
                      textAnchor="middle"
                      className="font-display"
                      fontSize={12.5}
                      fontWeight={600}
                      fill="#121212"
                    >
                      {st.label}
                    </text>
                    <text
                      x={st.x}
                      y={166}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize={10.5}
                      fill="#575753"
                    >
                      {st.sub}
                    </text>

                    <rect x={st.x - 64} y={194} width={128} height={24} fill={flowSoft} />
                    <text
                      x={st.x}
                      y={210}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize={10.5}
                      fontWeight={500}
                      fill={flowText}
                    >
                      {st.item}
                    </text>
                  </g>
                );
              })}

              <line x1={14} y1={266} x2={626} y2={266} stroke="#121212" strokeWidth={1} />
              <text
                x={14}
                y={288}
                className="font-mono"
                fontSize={11}
                fontWeight={600}
                fill="#121212"
              >
                Clave institucional · Pulse en cualquiera de las 4 escalas para ver su función
              </text>
              <text x={14} y={310} className="font-mono" fontSize={10.5} fill="#575753">
                {scenario.institutionalNote}
              </text>
            </svg>

            <div
              className="bg-paper border-t border-b border-hairline px-4 py-3 text-xs leading-relaxed text-ink"
              aria-live="polite"
            >
              <span
                className={`font-mono font-medium mr-1.5 ${
                  isOut ? 'text-ochre' : 'text-lapis'
                }`}
              >
                Escala {selectedStageIdx + 1} · {activeStage.label} ({activeStage.item}) —
              </span>
              {activeStage.roleNote}
            </div>
          </div>

          <aside
            className="lg:col-span-5 bg-paper border-t-2 border-t-rule border-b border-b-hairline p-6 flex flex-col gap-3.5"
            aria-live="polite"
          >
            <div
              className={`font-mono text-xs font-medium ${isOut ? 'text-ochre' : 'text-lapis'}`}
            >
              {scenario.kicker}
            </div>
            <h4 className="font-display text-xl font-semibold text-ink leading-snug">
              {scenario.cardTitle}
            </h4>
            <p className="text-sm leading-relaxed text-ink">{scenario.cardBody}</p>
            <dl className="grid grid-cols-1 gap-3 pt-3 border-t border-hairline m-0">
              <div className="flex flex-col gap-0.5">
                <dt className="font-mono text-[11px] text-ink-muted">Tecnología clave</dt>
                <dd className="font-mono text-xs font-medium text-ink m-0">{scenario.tech}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="font-mono text-[11px] text-ink-muted">Nodos centrales</dt>
                <dd className="font-mono text-xs font-medium text-ink m-0">{scenario.nodes}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="font-mono text-[11px] text-ink-muted">Impacto cultural</dt>
                <dd className="font-mono text-xs font-medium text-ink m-0">{scenario.cult}</dd>
              </div>
            </dl>
          </aside>
        </div>

        <p className="font-mono text-xs text-ink-muted">
          Fuentes: Austen (2010), <em>Trans-Saharan Africa in World History</em>; Sheriff (2010),{' '}
          <em>Dhow Cultures of the Indian Ocean</em>; Lydon (2009).
        </p>
      </div>
    </section>
  );
}
