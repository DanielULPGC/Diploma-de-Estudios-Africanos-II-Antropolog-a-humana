import { useMemo, useState } from 'react';
import { ChevronDown, ExternalLink, Maximize2, Search } from 'lucide-react';
import {
  ATLAS_CLADOS,
  ATLAS_FUENTES,
  ATLAS_META,
  ATLAS_REGIONES,
  ATLAS_SINONIMOS,
  ATLAS_TAXONES,
  CLADOS_ORDER,
  type CladoId,
  type TaxonPaleo,
} from '../../data/atlasPaleo';
import { getTaxonImage, INSTITUTIONAL_MEDIA } from '../../data/taxonImages';
import { useLightbox } from '../LightboxContext';

type TimeWindow = 'all' | 'hominin' | 'homo';

function formatMa(desde: number, hasta: number): string {
  const fmt = (n: number) => (n === 0 ? '0 (actual)' : `${n.toFixed(n < 1 ? 2 : 1)} Ma`);
  return `${fmt(desde)} – ${fmt(hasta)}`;
}

export function TaxonDossierCard({ taxon }: { taxon: TaxonPaleo }) {
  const clado = ATLAS_CLADOS[taxon.c];
  const region = ATLAS_REGIONES[taxon.region];
  const image = getTaxonImage(taxon.id, taxon.c);
  const { openSingle } = useLightbox();

  const handleOpenLightbox = (opener: HTMLElement | null) => {
    openSingle(
      {
        src: image.src,
        alt: image.alt,
        title: taxon.n,
        subtitle: `${clado.nombre} · ${formatMa(taxon.desde, taxon.hasta)}`,
        caption: image.isReference ? `Imagen de referencia · ${image.objeto}` : image.objeto,
        credit: image.credito,
        license: image.licencia,
        licenseUrl: image.licenciaUrl,
        sourceUrl: image.fuente,
      },
      opener
    );
  };

  return (
    <aside
      className="bg-paper border-t-2 border-t-rule border-b border-b-hairline p-6 flex flex-col gap-3.5"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs">
        <span style={{ color: clado.color }} className="font-medium">
          {clado.nombre}
        </span>
        <span aria-hidden="true" className="text-ink-subtle">
          ·
        </span>
        <span className="text-ink-muted tabular-nums">{formatMa(taxon.desde, taxon.hasta)}</span>
        {taxon.debatido && (
          <>
            <span aria-hidden="true" className="text-ink-subtle">
              ·
            </span>
            <span className="text-ochre font-medium">Posición o validez en debate</span>
          </>
        )}
      </div>

      <h4 className="font-display italic text-xl sm:text-2xl font-semibold text-ink leading-snug">
        {taxon.n}
      </h4>

      <figure className="m-0 flex flex-col gap-2">
        <button
          type="button"
          onClick={(e) => handleOpenLightbox(e.currentTarget)}
          aria-label={`Ampliar imagen del espécimen de ${taxon.n}`}
          className="group relative w-full aspect-[4/3] bg-[#eeede8] border border-hairline hover:border-ink overflow-hidden flex items-center justify-center p-2 cursor-zoom-in transition-colors"
        >
          <img
            src={image.src}
            alt={image.alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== INSTITUTIONAL_MEDIA.smithsonianCrania) {
                target.src = INSTITUTIONAL_MEDIA.smithsonianCrania;
              }
            }}
            className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
          />
          <span
            aria-hidden="true"
            className="no-print absolute bottom-2 right-2 px-2 py-1 rounded bg-[#121212]/80 text-white font-mono text-[10.5px] inline-flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Ampliar</span>
          </span>
        </button>
        <figcaption className="text-[11px] leading-snug text-ink-muted flex flex-col gap-0.5">
          <span>
            {image.isReference && (
              <strong className="font-mono text-ochre mr-1">Imagen de referencia ·</strong>
            )}
            {image.objeto}
          </span>
          <span className="font-mono text-[10px] text-ink-subtle flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span>{image.credito}</span>
            <span aria-hidden="true">·</span>
            <a
              href={image.licenciaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lapis hover:underline"
            >
              {image.licencia}
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={image.fuente}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lapis hover:underline"
            >
              Fuente
            </a>
          </span>
        </figcaption>
      </figure>

      <p className="text-sm leading-relaxed text-ink">{taxon.nota}</p>

      <dl className="grid grid-cols-1 gap-3 pt-3 border-t border-hairline m-0">
        {region && (
          <div className="flex flex-col gap-0.5">
            <dt className="font-mono text-[11px] text-ink-muted">Territorio / Yacimiento</dt>
            <dd className="text-xs text-ink m-0">
              <span className="font-mono font-medium">
                {region.nombre} ({region.continente})
              </span>
              {taxon.geoNota && (
                <span className="block text-ink-muted mt-0.5 leading-relaxed">{taxon.geoNota}</span>
              )}
            </dd>
          </div>
        )}

        {taxon.etimologia && (
          <div className="flex flex-col gap-0.5">
            <dt className="font-mono text-[11px] text-ink-muted">Etimología</dt>
            <dd className="text-xs leading-relaxed text-ink m-0">{taxon.etimologia}</dd>
          </div>
        )}

        <div className="flex flex-col gap-1.5 pt-2 border-t border-hairline">
          <dt className="font-mono text-[11px] text-ink-muted">
            Fuentes primarias verificadas ({taxon.fuentes.length})
          </dt>
          <dd className="m-0 flex flex-col gap-2">
            {taxon.fuentes.map((fKey) => {
              const ref = ATLAS_FUENTES[fKey];
              if (!ref) return null;
              return (
                <div key={fKey} className="text-xs leading-relaxed text-ink-muted">
                  <span>{ref.cita}</span>
                  {ref.doi && (
                    <a
                      href={`https://doi.org/${ref.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 ml-1.5 font-mono text-[11px] text-lapis hover:underline"
                    >
                      <span>DOI</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              );
            })}
          </dd>
        </div>
      </dl>
    </aside>
  );
}

export function AtlasChronologyView({
  selectedTaxonId,
  onSelectTaxon,
}: {
  selectedTaxonId: string;
  onSelectTaxon: (id: string) => void;
}) {
  const [cladoFilter, setCladoFilter] = useState<CladoId | 'todos'>('todos');
  const [windowScale, setWindowScale] = useState<TimeWindow>('hominin');
  const [onlyAfrica, setOnlyAfrica] = useState(false);
  const [onlyDebated, setOnlyDebated] = useState(false);
  const [query, setQuery] = useState('');

  const maxMa = windowScale === 'all' ? 24 : windowScale === 'hominin' ? 7.5 : 3.2;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ATLAS_TAXONES.filter((t) => {
      if (cladoFilter !== 'todos' && t.c !== cladoFilter) return false;
      if (onlyAfrica && !ATLAS_REGIONES[t.region]?.esAfrica) return false;
      if (onlyDebated && !t.debatido) return false;
      if (windowScale === 'hominin' && t.hasta > 7.5) return false;
      if (windowScale === 'homo' && t.hasta > 3.2) return false;
      if (q) {
        const reg = ATLAS_REGIONES[t.region]?.nombre.toLowerCase() ?? '';
        const match =
          t.n.toLowerCase().includes(q) ||
          t.nota.toLowerCase().includes(q) ||
          reg.includes(q) ||
          (t.etimologia?.toLowerCase().includes(q) ?? false);
        if (!match) return false;
      }
      return true;
    }).sort((a, b) => b.desde - a.desde);
  }, [cladoFilter, onlyAfrica, onlyDebated, windowScale, query]);

  const activeTaxon =
    filtered.find((t) => t.id === selectedTaxonId) ??
    ATLAS_TAXONES.find((t) => t.id === selectedTaxonId) ??
    ATLAS_TAXONES[0];

  const xStart = 200;
  const xEnd = 620;
  const plotW = xEnd - xStart;
  const rowH = 26;
  const svgHeight = Math.max(220, 44 + filtered.length * rowH + 34);

  const ticks =
    windowScale === 'all'
      ? [24, 20, 15, 10, 5, 0]
      : windowScale === 'hominin'
        ? [7, 6, 5, 4, 3, 2, 1, 0]
        : [3, 2.5, 2, 1.5, 1, 0.5, 0];

  const maToX = (ma: number) => {
    const clamped = Math.max(0, Math.min(maxMa, ma));
    return xStart + ((maxMa - clamped) / maxMa) * plotW;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-col gap-4 pb-4 border-b border-hairline">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-ink-muted">Filtrar por clado</span>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por clado">
              <button
                type="button"
                onClick={() => setCladoFilter('todos')}
                aria-pressed={cladoFilter === 'todos'}
                className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  cladoFilter === 'todos'
                    ? 'bg-ink text-white border-ink'
                    : 'bg-canvas text-ink border-hairline hover:border-ink'
                }`}
              >
                Todos ({ATLAS_TAXONES.length})
              </button>
              {CLADOS_ORDER.map((cid) => {
                const info = ATLAS_CLADOS[cid];
                const count = ATLAS_TAXONES.filter((t) => t.c === cid).length;
                const active = cladoFilter === cid;
                return (
                  <button
                    key={cid}
                    type="button"
                    onClick={() => setCladoFilter(cid)}
                    aria-pressed={active}
                    className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'text-white border-transparent'
                        : 'bg-canvas text-ink border-hairline hover:border-ink'
                    }`}
                    style={active ? { backgroundColor: info.color } : undefined}
                  >
                    {info.short} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-ink-muted">Ventana temporal</span>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Ventana temporal">
              {(
                [
                  { id: 'all', label: '23–0 Ma (Completo)' },
                  { id: 'hominin', label: '7.5–0 Ma (Homininos)' },
                  { id: 'homo', label: '3.2–0 Ma (Homo)' },
                ] as const
              ).map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWindowScale(w.id)}
                  aria-pressed={windowScale === w.id}
                  className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    windowScale === w.id
                      ? 'bg-ochre text-white border-ochre'
                      : 'bg-canvas text-ink border-hairline hover:border-ink'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search
              className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar especie, yacimiento o rasgo..."
              aria-label="Buscar táxon en el atlas"
              className="w-full min-h-[40px] pl-9 pr-3 py-1.5 text-sm bg-canvas border border-hairline rounded text-ink placeholder:text-ink-subtle focus:border-ink"
            />
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-ink cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyAfrica}
              onChange={(e) => setOnlyAfrica(e.target.checked)}
              className="accent-ochre w-4 h-4"
            />
            <span>Solo registro africano</span>
          </label>

          <label className="inline-flex items-center gap-2 text-xs text-ink cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyDebated}
              onChange={(e) => setOnlyDebated(e.target.checked)}
              className="accent-ochre w-4 h-4"
            />
            <span>Solo táxones en debate</span>
          </label>

          <span className="font-mono text-xs text-ink-muted tabular-nums ml-auto">
            Mostrando {filtered.length} de {ATLAS_TAXONES.length} entradas
          </span>
        </div>
      </div>

      {/* Main split: Stratigraphic timeline + Ficha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="p-8 border border-hairline bg-paper text-center flex flex-col items-center gap-3">
              <p className="text-sm text-ink-muted m-0">
                No hay táxones que coincidan con los filtros actuales. Amplíe la ventana temporal o
                limpie el término de búsqueda.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCladoFilter('todos');
                  setWindowScale('all');
                  setOnlyAfrica(false);
                  setOnlyDebated(false);
                  setQuery('');
                }}
                className="min-h-[38px] px-4 py-1.5 font-mono text-xs font-medium text-ink bg-canvas border border-ink rounded hover:bg-ink hover:text-white transition-colors cursor-pointer"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            <div className="max-h-[540px] overflow-y-auto border border-hairline bg-canvas p-3">
              <svg
                viewBox={`0 0 645 ${svgHeight}`}
                className="w-full h-auto block"
                role="img"
                aria-label="Línea temporal estratigráfica de los táxones del Atlas de Paleoantropología"
              >
                {/* Top axis ticks */}
                {ticks.map((t) => {
                  const x = maToX(t);
                  return (
                    <g key={t}>
                      <line
                        x1={x}
                        y1={24}
                        x2={x}
                        y2={svgHeight - 24}
                        stroke="#e8e8e4"
                        strokeWidth={1}
                        strokeDasharray="2 3"
                      />
                      <text
                        x={x}
                        y={16}
                        textAnchor="middle"
                        className="font-mono"
                        fontSize={10.5}
                        fill="#575753"
                      >
                        {t} Ma
                      </text>
                    </g>
                  );
                })}
                <line
                  x1={xStart}
                  y1={24}
                  x2={xEnd}
                  y2={24}
                  stroke="#121212"
                  strokeWidth={1}
                />

                {filtered.map((t, idx) => {
                  const y = 36 + idx * rowH;
                  const x1 = maToX(t.desde);
                  const x2 = maToX(t.hasta);
                  const barW = Math.max(7, x2 - x1);
                  const isSel = t.id === activeTaxon.id;
                  const cladoColor = ATLAS_CLADOS[t.c].color;

                  return (
                    <g
                      key={t.id}
                      onClick={() => onSelectTaxon(t.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectTaxon(t.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${t.n}: ${formatMa(t.desde, t.hasta)}`}
                      className="cursor-pointer"
                    >
                      <rect
                        x={0}
                        y={y - 4}
                        width={642}
                        height={rowH - 2}
                        fill={isSel ? '#fdf3ee' : idx % 2 === 0 ? '#fafaf8' : 'transparent'}
                      />
                      <text
                        x={xStart - 8}
                        y={y + 12}
                        textAnchor="end"
                        className="font-sans"
                        fontStyle="italic"
                        fontSize={11}
                        fontWeight={isSel ? 700 : 400}
                        fill={isSel ? '#121212' : '#3a3a37'}
                      >
                        {t.n.length > 27 ? `${t.n.slice(0, 26)}…` : t.n}
                      </text>
                      <rect
                        x={x1}
                        y={y + 3}
                        width={barW}
                        height={11}
                        rx={1.5}
                        fill={cladoColor}
                        fillOpacity={t.debatido ? 0.55 : 0.92}
                        stroke={isSel ? '#121212' : t.debatido ? cladoColor : 'none'}
                        strokeWidth={isSel ? 1.6 : t.debatido ? 1.1 : 0}
                        strokeDasharray={t.debatido && !isSel ? '3 2' : undefined}
                      />
                    </g>
                  );
                })}

                <text
                  x={xEnd}
                  y={svgHeight - 6}
                  textAnchor="end"
                  className="font-mono"
                  fontSize={10}
                  fill="#73736e"
                >
                  Millones de años antes del presente (Ma) · Barras con contorno discontinuo: táxon
                  debatido
                </text>
              </svg>
            </div>
          )}

          <p className="font-mono text-[11px] leading-relaxed text-ink-muted">
            {ATLAS_META.notaDatos}
          </p>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <TaxonDossierCard taxon={activeTaxon} />
        </div>
      </div>

      {/* Expandable 12 Historical Synonyms Table */}
      <details className="group bg-paper border-t border-hairline border-b border-b-hairline px-5 py-3.5">
        <summary className="list-none flex items-center justify-between gap-4 min-h-[40px] cursor-pointer font-display text-base font-semibold text-ink">
          <span>Tabla de sinónimos históricos y equivalencias nomenclaturales ({ATLAS_SINONIMOS.length})</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-normal text-ink-muted whitespace-nowrap shrink-0">
            <span>Desplegar</span>
            <ChevronDown
              className="w-4 h-4 transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </span>
        </summary>
        <div className="pt-3 mt-2 border-t border-hairline overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-rule font-mono text-ink-muted">
                <th className="py-2 pr-4 font-medium">Denominación histórica</th>
                <th className="py-2 pr-4 font-medium">Autor / Año</th>
                <th className="py-2 font-medium">Equivalencia habitual</th>
              </tr>
            </thead>
            <tbody>
              {ATLAS_SINONIMOS.map((syn) => (
                <tr key={syn.nombre} className="border-b border-hairline">
                  <td className="py-2.5 pr-4 italic font-medium text-ink">{syn.nombre}</td>
                  <td className="py-2.5 pr-4 font-mono text-ink-muted whitespace-nowrap">
                    {syn.autor}
                  </td>
                  <td className="py-2.5 text-ink">{syn.equivale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
