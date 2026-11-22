import { useEffect, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import {
  EDITORIAL_PLATES,
  KINGDOMS_BUTTON_ORDER,
  KINGDOMS_DATA,
  KINGDOMS_ORDER,
  type KingdomId,
} from '../data/curriculum';
import {
  clearPendingCourseDetail,
  consumePendingCourseDetail,
} from '../data/courseNavigation';
import { EditorialPlate } from './EditorialPlate';
import { useLightbox } from './LightboxContext';

const KINGDOM_IMAGES: Record<
  KingdomId,
  { src: string; alt: string; caption: string }
> = {
  kush: {
    src: '/src/assets/images/ficha_reino_kush_1795186076315.jpg',
    alt: 'Lámina editorial de las pirámides de arenisca de Meroe en el antiguo Reino de Kush junto al Nilo',
    caption: 'Pirámides reales de Meroe (Reino de Kush, Sudán actual) · Lámina editorial',
  },
  aksum: {
    src: '/src/assets/images/ficha_reino_aksum_1795186075964.jpg',
    alt: 'Lámina editorial de las estelas monolíticas de granito del antiguo Reino de Aksum en el altiplano etíope',
    caption: 'Estelas monolíticas de granito de Aksum (Etiopía) · Lámina editorial',
  },
  swahili: {
    src: '/src/assets/images/ficha_reino_swahili_1795186189712.jpg',
    alt: 'Lámina editorial de arquitectura en piedra coralina y dhows del océano Índico en Kilwa Kisiwani (Costa Suajili)',
    caption: 'Kilwa Kisiwani, arquitectura coralina y navegación monzónica (Ciudades-Estado Suajili) · Lámina editorial',
  },
  mali: {
    src: '/src/assets/images/ficha_reino_mali_1795186075923.jpg',
    alt: 'Lámina editorial de la arquitectura de adobe sudano-saheliana y eruditos de Tombuctú en el Imperio de Malí',
    caption: 'Arquitectura sudano-saheliana y centros de estudio de Tombuctú (Imperio de Malí) · Lámina editorial',
  },
  zimbabwe: {
    src: '/src/assets/images/ficha_reino_zimbabue_1795186075308.jpg',
    alt: 'Lámina editorial del Gran Recinto de piedra seca y la torre cónica del Gran Zimbabue',
    caption: 'Gran Recinto y torre cónica de granito en piedra seca (Gran Zimbabue) · Lámina editorial',
  },
  benin: {
    src: '/src/assets/images/ficha_reino_benin_1795186075727.jpg',
    alt: 'Lámina editorial de cabeza real conmemorativa y placa en relieve de latón del Reino de Benín',
    caption: 'Escultura real y placas en relieve de latón a la cera perdida (Reino de Benín) · Lámina editorial',
  },
};

interface KingdomsModuleProps {
  onSendToSeminar?: (kingdomId: KingdomId) => void;
}

export function KingdomsModule({ onSendToSeminar }: KingdomsModuleProps) {
  const { openSingle } = useLightbox();
  const [selected, setSelected] = useState<KingdomId>(() => {
    const pending = consumePendingCourseDetail('kingdomId');
    return pending && pending in KINGDOMS_DATA ? pending : 'kush';
  });
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const onOpenKingdom = (event: Event) => {
      const id = (event as CustomEvent<KingdomId>).detail;
      if (id && id in KINGDOMS_DATA) {
        clearPendingCourseDetail('kingdomId');
        setSelected(id);
      }
    };
    window.addEventListener('ulpgc:open-kingdom', onOpenKingdom);
    return () => window.removeEventListener('ulpgc:open-kingdom', onOpenKingdom);
  }, []);
  const active = KINGDOMS_DATA[selected];
  const activeImage = KINGDOM_IMAGES[selected];

  const minYear = -1200;
  const maxYear = 2000;
  const xStart = 148;
  const xEnd = 612;
  const wSpan = xEnd - xStart;
  const x1500 = xStart + ((1500 - minYear) / (maxYear - minYear)) * wSpan;

  return (
    <section
      id="sec-reinos"
      className="pt-12 border-t border-hairline flex flex-col gap-7 scroll-mt-20"
    >
      <div className="flex flex-col gap-3">
        <div className="font-mono text-xs tracking-wide text-ochre">
          03. Formación estatal y diversidad política
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight tracking-tight text-ink max-w-3xl [text-wrap:balance]">
          Seis grandes civilizaciones africanas antes de la colonización europea
        </h2>
        <div className="mt-1 py-3 px-4 bg-paper border-t border-b border-hairline max-w-3xl text-sm leading-relaxed text-ink-muted">
          <span className="font-mono text-xs font-medium text-ink mr-2">
            Objetivo de aprendizaje ·
          </span>
          Comparar las bases ecológicas, institucionales y culturales de seis formaciones
          políticas africanas de distintas regiones y épocas.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 flex flex-col gap-4 text-base leading-[1.72] text-ink">
          <p>
            Desde los faraones nubios de la Dinastía XXV en el valle del Nilo hasta las monedas de
            oro de Aksum, las universidades de Tombuctú, los recintos graníticos del Gran Zimbabue
            y las murallas de Benín, los Estados africanos diseñaron soluciones políticas
            originales adaptadas a cada ecosistema: sabana, bosque tropical, altiplano y litoral
            marítimo.
          </p>
          <p className="text-sm text-ink-muted leading-relaxed">
            La línea discontinua vertical en <span className="font-mono text-lapis">~1500</span>{' '}
            marca el inicio del contacto atlántico europeo y permite apreciar visualmente más de
            dos milenios de estatalidad africana previa.
          </p>
        </div>
        <div className="lg:col-span-7 reading-mode-hide">
          <EditorialPlate plate={EDITORIAL_PLATES.kingdoms} />
        </div>
      </div>

      <div className="py-7 border-t border-rule border-b border-b-hairline flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-display text-lg sm:text-xl font-semibold text-ink">
              Línea temporal comparada de seis grandes formaciones estatales africanas
            </h3>
            <p className="font-mono text-xs text-ink-muted">
              Duración aproximada (1070 a. C. – 1897 d. C.) · Haga clic en una barra o botón para
              abrir su ficha académica
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-ink-muted">Seleccionar civilización</span>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Selector de reinos precoloniales"
            >
              {KINGDOMS_BUTTON_ORDER.map((id) => {
                const item = KINGDOMS_DATA[id];
                const isSelected = id === selected;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelected(id)}
                    aria-pressed={isSelected}
                    className={`min-h-[40px] px-3.5 py-2 text-xs font-medium rounded border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-ochre text-white border-ochre'
                        : 'bg-canvas text-ink border-hairline hover:border-ink hover:bg-paper'
                    }`}
                  >
                    {item.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 w-full">
            <svg
              viewBox="0 0 640 322"
              className="w-full h-auto block"
              role="img"
              aria-label="Línea temporal comparada de seis grandes reinos precoloniales africanos"
            >
              {[-1000, -500, 0, 500, 1000, 1500, 1900].map((yTick) => {
                const x = xStart + ((yTick - minYear) / (maxYear - minYear)) * wSpan;
                const lbl =
                  yTick < 0 ? `${Math.abs(yTick)} a.C.` : yTick === 0 ? '0' : `${yTick}`;
                return (
                  <g key={yTick}>
                    <line
                      x1={x}
                      y1={24}
                      x2={x}
                      y2={274}
                      stroke="#e2e2dd"
                      strokeWidth={1}
                      strokeDasharray="2 3"
                    />
                    <text
                      x={x}
                      y={294}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize={11}
                      fill="#575753"
                    >
                      {lbl}
                    </text>
                  </g>
                );
              })}

              <line x1={xStart} y1={274} x2={xEnd} y2={274} stroke="#121212" strokeWidth={1} />

              <line
                x1={x1500}
                y1={18}
                x2={x1500}
                y2={274}
                stroke="#1f5fa8"
                strokeWidth={1.3}
                strokeDasharray="4 3"
              />
              <text
                x={x1500 - 5}
                y={14}
                textAnchor="end"
                className="font-mono"
                fontSize={10.5}
                fontWeight={500}
                fill="#1f5fa8"
              >
                ~1500 (contacto atlántico)
              </text>

              {KINGDOMS_ORDER.map((id, idx) => {
                const item = KINGDOMS_DATA[id];
                const y = 34 + idx * 39;
                const x1 = xStart + ((item.start - minYear) / (maxYear - minYear)) * wSpan;
                const x2 = xStart + ((item.end - minYear) / (maxYear - minYear)) * wSpan;
                const isSel = id === selected;

                return (
                  <g
                    key={id}
                    onClick={() => setSelected(id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelected(id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.title}: ${item.spanLabel}`}
                    className="cursor-pointer transition-opacity duration-150 hover:opacity-90"
                  >
                    <rect
                      x={4}
                      y={y - 6}
                      width={632}
                      height={32}
                      fill={isSel ? '#f7f7f5' : 'transparent'}
                    />
                    <text
                      x={xStart - 10}
                      y={y + 14}
                      textAnchor="end"
                      className="font-mono"
                      fontSize={11.5}
                      fontWeight={isSel ? 600 : 400}
                      fill={isSel ? '#121212' : '#575753'}
                    >
                      {item.name}
                    </text>
                    <rect
                      x={x1}
                      y={y + 2}
                      width={Math.max(10, x2 - x1)}
                      height={16}
                      fill={isSel ? '#d95216' : '#c8c8c2'}
                    />
                    {isSel && (
                      <text
                        x={Math.min(x2 + 6, 488)}
                        y={y + 14}
                        className="font-mono"
                        fontSize={10.5}
                        fontWeight={600}
                        fill="#b43c0b"
                      >
                        {item.spanLabel}
                      </text>
                    )}
                  </g>
                );
              })}

              <text
                x={xEnd}
                y={314}
                textAnchor="end"
                className="font-mono"
                fontSize={11}
                fill="#73736e"
              >
                Escala cronológica aproximada (a. C. / d. C.)
              </text>
            </svg>
          </div>

          <aside
            className="lg:col-span-5 bg-paper border-t-2 border-t-rule border-b border-b-hairline p-6 flex flex-col gap-3.5"
            aria-live="polite"
          >
            <div className="font-mono text-xs font-medium text-ochre">{active.kicker}</div>
            <h4 className="font-display text-xl font-semibold text-ink leading-snug">
              {active.title}
            </h4>
            <figure className="m-0 flex flex-col gap-1.5">
              <div className="relative group w-full aspect-[3/2] bg-[#eeede8] border border-hairline overflow-hidden flex items-center justify-center">
                {!failedImages[selected] ? (
                  <>
                    <img
                      src={activeImage.src}
                      alt={activeImage.alt}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onClick={(e) =>
                        openSingle(
                          {
                            src: activeImage.src,
                            alt: activeImage.alt,
                            title: active.title,
                            subtitle: `${active.kicker} · ${active.spanLabel}`,
                            caption: activeImage.caption,
                            credit: 'Lámina editorial · Diploma de Estudios Africanos (ULPGC)',
                          },
                          e.currentTarget
                        )
                      }
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [selected]: true }))
                      }
                      className="w-full h-full object-cover cursor-zoom-in transition-transform duration-200 group-hover:scale-[1.015]"
                    />
                    <button
                      type="button"
                      onClick={(e) =>
                        openSingle(
                          {
                            src: activeImage.src,
                            alt: activeImage.alt,
                            title: active.title,
                            subtitle: `${active.kicker} · ${active.spanLabel}`,
                            caption: activeImage.caption,
                            credit: 'Lámina editorial · Diploma de Estudios Africanos (ULPGC)',
                          },
                          e.currentTarget
                        )
                      }
                      aria-label={`Ampliar lámina de ${active.title}`}
                      className="absolute bottom-2 right-2 min-h-[32px] px-2 py-1 bg-[#121212]/80 text-white border border-white/25 rounded font-mono text-[10.5px] inline-flex items-center gap-1 hover:bg-ochre hover:border-ochre transition-colors cursor-pointer no-print"
                    >
                      <Maximize2 className="w-3 h-3" aria-hidden="true" />
                      <span>Ampliar</span>
                    </button>
                  </>
                ) : (
                  <div className="p-6 text-center flex flex-col gap-1">
                    <span className="font-display text-base font-semibold text-ink">
                      {active.title}
                    </span>
                    <span className="font-mono text-xs text-ink-muted">{active.spanLabel}</span>
                  </div>
                )}
              </div>
              <figcaption className="font-mono text-[10.5px] leading-snug text-ink-muted">
                {activeImage.caption}
              </figcaption>
            </figure>
            <p className="text-sm leading-relaxed text-ink">{active.desc}</p>
            <dl className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4 pt-3 border-t border-hairline m-0">
              <div className="flex flex-col gap-0.5">
                <dt className="font-mono text-[11px] text-ink-muted">Base económica</dt>
                <dd className="font-mono text-xs font-medium text-ink m-0">{active.econ}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="font-mono text-[11px] text-ink-muted">Hito institucional</dt>
                <dd className="font-mono text-xs font-medium text-ink m-0">{active.inst}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="font-mono text-[11px] text-ink-muted">Patrimonio clave</dt>
                <dd className="font-mono text-xs font-medium text-ink m-0">{active.pat}</dd>
              </div>
            </dl>
            {onSendToSeminar && (
              <div className="pt-2 border-t border-hairline">
                <button
                  type="button"
                  onClick={() => onSendToSeminar(selected)}
                  className="min-h-[40px] px-3.5 py-2 text-xs font-medium text-ink bg-canvas border border-hairline rounded hover:border-ink hover:bg-surface transition-colors duration-150 whitespace-nowrap cursor-pointer"
                >
                  Analizar este reino en la Ficha de Seminario
                </button>
              </div>
            )}
          </aside>
        </div>

        <p className="font-mono text-xs text-ink-muted">
          Fuentes: <em>Historia General de África</em> (UNESCO, vols. II–IV); Fauvelle (2018),{' '}
          <em>El rinoceronte de oro</em>; Green (2019), <em>A Fistful of Shells</em>.
        </p>
      </div>
    </section>
  );
}
