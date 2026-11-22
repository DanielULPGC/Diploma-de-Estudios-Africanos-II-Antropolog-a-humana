import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { ORIGINS_DATA, ORIGINS_ORDER, type OriginId } from '../data/curriculum';
import { INSTITUTIONAL_MEDIA, TAXON_IMAGES } from '../data/taxonImages';
import { GlossaryTermTrigger } from './GlossaryContext';
import { useLightbox } from './LightboxContext';

const ORIGIN_MEDIA: Record<
  OriginId,
  { src: string; alt: string; caption: string; credit: string }
> = {
  irhoud: {
    src: TAXON_IMAGES.jebel_irhoud.src,
    alt: TAXON_IMAGES.jebel_irhoud.alt,
    caption: TAXON_IMAGES.jebel_irhoud.objeto,
    credit: `${TAXON_IMAGES.jebel_irhoud.credito} · ${TAXON_IMAGES.jebel_irhoud.licencia}`,
  },
  omo: {
    src: TAXON_IMAGES.omo_i.src,
    alt: TAXON_IMAGES.omo_i.alt,
    caption: TAXON_IMAGES.omo_i.objeto,
    credit: `${TAXON_IMAGES.omo_i.credito} · ${TAXON_IMAGES.omo_i.licencia}`,
  },
  florisbad: {
    src: TAXON_IMAGES.helmei.src,
    alt: TAXON_IMAGES.helmei.alt,
    caption: TAXON_IMAGES.helmei.objeto,
    credit: `${TAXON_IMAGES.helmei.credito} · ${TAXON_IMAGES.helmei.licencia}`,
  },
  blombos: {
    src: INSTITUTIONAL_MEDIA.olduvaiChopper,
    alt: 'Industria lítica olduvayense de referencia (Garganta de Olduvai, ~1,8 Ma, Smithsonian Institution)',
    caption:
      'Imagen institucional de referencia lítica africana (canto tallado olduvayense de Olduvai, ~1,8 Ma, Smithsonian); los ocres grabados y el dibujo sobre silcreta de Blombos pertenecen al Paleolítico Medio Africano (MSA, ~100–73 ka).',
    credit: 'Smithsonian Institution · Referencia lítica comparativa',
  },
  ooa: {
    src: TAXON_IMAGES.sapiens.src,
    alt: TAXON_IMAGES.sapiens.alt,
    caption: TAXON_IMAGES.sapiens.objeto,
    credit: `${TAXON_IMAGES.sapiens.credito} · ${TAXON_IMAGES.sapiens.licencia}`,
  },
};

export function OriginsModule() {
  const { openSingle } = useLightbox();
  const [selected, setSelected] = useState<OriginId>('irhoud');
  const active = ORIGINS_DATA[selected];
  const activeMedia = ORIGIN_MEDIA[selected];

  const maxKa = 320;
  const xStart = 218;
  const xEnd = 588;
  const barW = xEnd - xStart;

  return (
    <section
      id="sec-origenes"
      className="pt-12 border-t border-hairline flex flex-col gap-7 scroll-mt-20"
    >
      <div className="flex flex-col gap-3">
        <div className="font-mono text-xs tracking-wide text-ochre">
          01. Evolución humana y diversidad genética
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight tracking-tight text-ink max-w-3xl [text-wrap:balance]">
          No hubo un único «Jardín del Edén»: el origen de nuestra especie fue panafricano
        </h2>
        <div className="mt-1 py-3 px-4 bg-paper border-t border-b border-hairline max-w-3xl text-sm leading-relaxed text-ink-muted">
          <span className="font-mono text-xs font-medium text-ink mr-2">
            Objetivo de aprendizaje ·
          </span>
          Distinguir el modelo evolutivo multirregional africano frente a modelos lineales
          antiguos y explicar por qué África concentra la mayor diversidad genética humana.
        </div>
      </div>

      <div className="flex flex-col gap-4 max-w-[68ch] text-base leading-[1.72] text-ink">
        <p>
          Hasta hace poco, los manuales solían ubicar el nacimiento de <em>Homo sapiens</em> en un
          único punto del valle del Rift en África Oriental hace unos 200.000 años. El
          redescubrimiento y datación de fósiles en{' '}
          <span className="hl-ochre">Jebel Irhoud (Marruecos, ~300.000 años)</span> junto con
          hallazgos en Sudáfrica y Etiopía consolidó el{' '}
          <strong>
            <GlossaryTermTrigger termId="modelo-multirregional-africano" tone="ochre">
              modelo multirregional africano
            </GlossaryTermTrigger>
          </strong>
          : poblaciones distribuidas por todo el continente evolucionaron en red, intercambiando
          genes y tecnologías líticas cuando los cambios climáticos abrían{' '}
          <GlossaryTermTrigger termId="ciclos-orbitales" tone="forest">
            corredores verdes en el Sáhara
          </GlossaryTermTrigger>
          .
        </p>
        <p>
          Cuando pequeños grupos salieron de África hace entre 50.000 y 70.000 años para poblar
          Eurasia, Oceanía y América, experimentaron un fuerte{' '}
          <span className="hl-lapis">
            <GlossaryTermTrigger termId="efecto-fundador" tone="lapis">
              efecto fundador (cuello de botella genético)
            </GlossaryTermTrigger>
          </span>
          . Por ello, dos personas de distintas regiones africanas pueden ser genéticamente más
          diversas entre sí que un europeo y un asiático oriental, refutando cualquier base
          biológica del concepto de «raza».
        </p>
      </div>

      <div className="py-7 border-t border-rule border-b border-b-hairline flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-display text-lg sm:text-xl font-semibold text-ink">
              Hitos paleogenómicos y arqueológicos del origen panafricano
            </h3>
            <p className="font-mono text-xs text-ink-muted">
              Escala cronológica aproximada (miles de años antes del presente, ka) · Seleccione un
              yacimiento o evento
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-ink-muted">Inspeccionar hito</span>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Selector de yacimientos paleolíticos"
            >
              {ORIGINS_ORDER.map((id) => {
                const item = ORIGINS_DATA[id];
                const isSelected = selected === id;
                const activeClasses =
                  id === 'ooa'
                    ? 'bg-lapis text-white border-lapis'
                    : 'bg-ochre text-white border-ochre';
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelected(id)}
                    aria-pressed={isSelected}
                    className={`min-h-[40px] px-3.5 py-2 text-xs font-medium rounded border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? activeClasses
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
              viewBox="0 0 640 296"
              className="w-full h-auto block"
              role="img"
              aria-label="Cronología interactiva de yacimientos clave del origen panafricano de Homo sapiens"
            >
              {[0, 100, 200, 300].map((tick) => {
                const x = xStart + (tick / maxKa) * barW;
                return (
                  <g key={tick}>
                    <line
                      x1={x}
                      y1={18}
                      x2={x}
                      y2={242}
                      stroke="#e2e2dd"
                      strokeWidth={1}
                      strokeDasharray="2 3"
                    />
                    <text
                      x={x}
                      y={262}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize={11}
                      fill="#575753"
                    >
                      {tick} ka
                    </text>
                  </g>
                );
              })}
              <line x1={xStart} y1={18} x2={xStart} y2={242} stroke="#121212" strokeWidth={1} />

              {ORIGINS_ORDER.map((id, idx) => {
                const item = ORIGINS_DATA[id];
                const y = 30 + idx * 42;
                const w = (item.ka / maxKa) * barW;
                const isSel = id === selected;
                const fill = isSel
                  ? id === 'ooa'
                    ? '#1f5fa8'
                    : '#d95216'
                  : '#c8c8c2';
                const textColor = isSel
                  ? id === 'ooa'
                    ? '#1f5fa8'
                    : '#b43c0b'
                  : '#575753';

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
                    aria-label={`${item.chartLabel}: aproximadamente ${item.ka} mil años`}
                    className="cursor-pointer transition-opacity duration-150 hover:opacity-90"
                  >
                    <rect
                      x={4}
                      y={y - 6}
                      width={632}
                      height={34}
                      fill={isSel ? '#f7f7f5' : 'transparent'}
                    />
                    <text
                      x={xStart - 10}
                      y={y + 15}
                      textAnchor="end"
                      className="font-mono"
                      fontSize={11.5}
                      fontWeight={isSel ? 600 : 400}
                      fill={isSel ? '#121212' : '#575753'}
                    >
                      {item.chartLabel}
                    </text>
                    <rect x={xStart} y={y + 2} width={w} height={18} fill={fill} />
                    <text
                      x={xStart + w + 8}
                      y={y + 15}
                      className="font-mono"
                      fontSize={11.5}
                      fontWeight={500}
                      fill={textColor}
                    >
                      {id === 'omo' ? `≥${item.ka} ka` : `~${item.ka} ka`}
                    </text>
                  </g>
                );
              })}

              <text
                x={xEnd}
                y={285}
                textAnchor="end"
                className="font-mono"
                fontSize={11}
                fill="#73736e"
              >
                Antigüedad aproximada en miles de años antes del presente (ka)
              </text>
            </svg>
          </div>

          <aside
            className="lg:col-span-5 bg-paper border-t-2 border-t-rule border-b border-b-hairline p-6 flex flex-col gap-3.5"
            aria-live="polite"
          >
            <div
              className={`font-mono text-xs font-medium ${
                selected === 'ooa' ? 'text-lapis' : 'text-ochre'
              }`}
            >
              {active.kicker}
            </div>
            <h4 className="font-display text-xl font-semibold text-ink leading-snug">
              {active.title}
            </h4>
            <figure className="m-0 flex flex-col gap-1.5">
              <div className="relative group w-full aspect-[4/3] bg-[#eeede8] border border-hairline overflow-hidden flex items-center justify-center p-2">
                <img
                  src={activeMedia.src}
                  alt={activeMedia.alt}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onClick={(e) =>
                    openSingle(
                      {
                        src: activeMedia.src,
                        alt: activeMedia.alt,
                        title: active.title,
                        subtitle: active.kicker,
                        caption: activeMedia.caption,
                        credit: activeMedia.credit,
                      },
                      e.currentTarget
                    )
                  }
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== INSTITUTIONAL_MEDIA.smithsonianCrania) {
                      target.src = INSTITUTIONAL_MEDIA.smithsonianCrania;
                    }
                  }}
                  className="max-w-full max-h-full w-auto h-auto object-contain cursor-zoom-in"
                />
                <button
                  type="button"
                  onClick={(e) =>
                    openSingle(
                      {
                        src: activeMedia.src,
                        alt: activeMedia.alt,
                        title: active.title,
                        subtitle: active.kicker,
                        caption: activeMedia.caption,
                        credit: activeMedia.credit,
                      },
                      e.currentTarget
                    )
                  }
                  aria-label={`Ampliar imagen de ${active.title}`}
                  className="absolute bottom-2 right-2 min-h-[32px] px-2 py-1 bg-[#121212]/80 text-white border border-white/25 rounded font-mono text-[10.5px] inline-flex items-center gap-1 hover:bg-ochre hover:border-ochre transition-colors cursor-pointer no-print"
                >
                  <Maximize2 className="w-3 h-3" aria-hidden="true" />
                  <span>Ampliar</span>
                </button>
              </div>
              <figcaption className="text-[11px] leading-snug text-ink-muted">
                <span>{activeMedia.caption}</span>
                <span className="block font-mono text-[10px] text-ink-subtle mt-0.5">
                  {activeMedia.credit}
                </span>
              </figcaption>
            </figure>
            <p className="text-sm leading-relaxed text-ink">{active.desc}</p>
            <dl className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4 pt-3 border-t border-hairline m-0">
              <div className="flex flex-col gap-0.5">
                <dt className="font-mono text-[11px] text-ink-muted">Región</dt>
                <dd className="font-mono text-xs font-medium text-ink m-0">{active.region}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="font-mono text-[11px] text-ink-muted">Evidencia clave</dt>
                <dd className="font-mono text-xs font-medium text-ink m-0">{active.evid}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="font-mono text-[11px] text-ink-muted">Implicación</dt>
                <dd className="font-mono text-xs font-medium text-ink m-0">{active.imp}</dd>
              </div>
            </dl>
          </aside>
        </div>

        <p className="font-mono text-xs text-ink-muted">
          Fuentes: Hublin et al. (2017), <em>Nature</em>; Scerri et al. (2018),{' '}
          <em>Trends in Ecology &amp; Evolution</em>; Vidal et al. (2022), <em>Nature</em>.
        </p>
      </div>
    </section>
  );
}
