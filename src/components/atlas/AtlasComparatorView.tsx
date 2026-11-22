import { useMemo, useState } from 'react';
import { Clock, GitCompareArrows, Maximize2 } from 'lucide-react';
import {
  ATLAS_CLADOS,
  ATLAS_REGIONES,
  ATLAS_TAXONES,
  type TaxonPaleo,
} from '../../data/atlasPaleo';
import { getTaxonImage } from '../../data/taxonImages';
import { useLightbox } from '../LightboxContext';
import { TaxonDossierCard } from './AtlasChronologyView';

function formatMa(ma: number): string {
  if (ma === 0) return 'hoy';
  if (ma < 1) {
    return `hace ${Math.round(ma * 1000).toLocaleString('es-ES')} ka`;
  }
  return `hace ${ma.toFixed(2).replace('.', ',')} Ma`;
}

function formatRangeShort(t: TaxonPaleo): string {
  const fmt = (v: number) => (v === 0 ? '0' : v.toFixed(v < 1 ? 2 : 1).replace('.', ','));
  return t.desde === t.hasta ? `${fmt(t.desde)} Ma` : `${fmt(t.desde)}–${fmt(t.hasta)} Ma`;
}

function formatClock24h(ma: number, totalMa: number): string {
  const clamped = Math.max(0, Math.min(totalMa, ma));
  const totalSec = Math.round((1 - clamped / totalMa) * 86400);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const hh = String(Math.min(23, h)).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  if (ma < 0.05) {
    return `${hh}:${mm}:${String(s).padStart(2, '0')}`;
  }
  return `${hh}:${mm}`;
}

const COMPARE_PRESETS: Array<{ label: string; a: string; b: string }> = [
  { label: 'P. boisei vs. H. erectus', a: 'boisei', b: 'erectus' },
  { label: 'H. sapiens vs. H. naledi', a: 'sapiens', b: 'naledi' },
  { label: 'H. sapiens vs. H. neanderthalensis', a: 'sapiens', b: 'neanderthalensis' },
  { label: 'A. afarensis vs. S. tchadensis', a: 'afarensis', b: 'sahelanthropus' },
];

export function AtlasComparatorView({
  onSelectTaxon,
}: {
  onSelectTaxon: (id: string) => void;
}) {
  const sortedTaxa = useMemo(
    () => [...ATLAS_TAXONES].sort((a, b) => b.desde - a.desde || b.hasta - a.hasta),
    []
  );

  const africanTaxa = useMemo(
    () => sortedTaxa.filter((t) => ATLAS_REGIONES[t.region]?.esAfrica),
    [sortedTaxa]
  );
  const nonAfricanTaxa = useMemo(
    () => sortedTaxa.filter((t) => !ATLAS_REGIONES[t.region]?.esAfrica),
    [sortedTaxa]
  );

  const [idA, setIdA] = useState<string>('boisei');
  const [idB, setIdB] = useState<string>('erectus');
  const [clockFocusId, setClockFocusId] = useState<string>('sapiens');
  const { openCompare } = useLightbox();

  const taxonA = sortedTaxa.find((t) => t.id === idA) ?? sortedTaxa[0];
  const taxonB = sortedTaxa.find((t) => t.id === idB) ?? sortedTaxa[1];

  const handleOpenCompareLightbox = (opener: HTMLElement | null) => {
    const imgA = getTaxonImage(taxonA.id, taxonA.c);
    const imgB = getTaxonImage(taxonB.id, taxonB.c);
    openCompare(
      {
        src: imgA.src,
        alt: imgA.alt,
        title: taxonA.n,
        subtitle: `${ATLAS_CLADOS[taxonA.c]?.short ?? taxonA.c} · ${formatRangeShort(taxonA)}`,
        caption: imgA.isReference ? `Imagen de referencia · ${imgA.objeto}` : imgA.objeto,
        credit: imgA.credito,
        license: imgA.licencia,
        licenseUrl: imgA.licenciaUrl,
        sourceUrl: imgA.fuente,
      },
      {
        src: imgB.src,
        alt: imgB.alt,
        title: taxonB.n,
        subtitle: `${ATLAS_CLADOS[taxonB.c]?.short ?? taxonB.c} · ${formatRangeShort(taxonB)}`,
        caption: imgB.isReference ? `Imagen de referencia · ${imgB.objeto}` : imgB.objeto,
        credit: imgB.credito,
        license: imgB.licencia,
        licenseUrl: imgB.licenciaUrl,
        sourceUrl: imgB.fuente,
      },
      opener
    );
  };

  const comparison = useMemo(() => {
    const same = taxonA.id === taxonB.id;
    const maxRaw = Math.max(taxonA.desde, taxonB.desde);
    const axisMax =
      maxRaw < 1 ? Math.ceil(maxRaw * 10) / 10 + 0.1 : Math.ceil(maxRaw * 1.12);

    const overlapStart = Math.min(taxonA.desde, taxonB.desde);
    const overlapEnd = Math.max(taxonA.hasta, taxonB.hasta);

    let status: 'misma' | 'coinciden' | 'limite' | 'separadas' = 'separadas';
    let verdict = '';
    if (same) {
      status = 'misma';
      verdict = 'Ha elegido dos veces la misma especie.';
    } else if (overlapStart > overlapEnd) {
      status = 'coinciden';
      verdict =
        overlapEnd === 0
          ? `Coincidieron en el tiempo, aproximadamente desde ${formatMa(overlapStart)} hasta hoy.`
          : `Coincidieron en el tiempo, aproximadamente entre ${formatMa(overlapStart)} y ${formatMa(overlapEnd)}.`;
    } else if (overlapStart === overlapEnd) {
      status = 'limite';
      verdict = `Sus intervalos se tocan hacia ${formatMa(overlapStart)}: con las fechas actuales no puede afirmarse convivencia.`;
    } else {
      const gap = overlapEnd - overlapStart;
      const gapStr =
        gap < 1
          ? `${Math.round(gap * 1000).toLocaleString('es-ES')} mil años`
          : `${gap.toFixed(2).replace('.', ',')} millones de años`;
      verdict = `No coincidieron en el tiempo: entre ambos intervalos median unos ${gapStr}.`;
    }

    const regA = ATLAS_REGIONES[taxonA.region]?.nombre ?? taxonA.region;
    const regB = ATLAS_REGIONES[taxonB.region]?.nombre ?? taxonB.region;
    const placeSummary =
      taxonA.region === taxonB.region
        ? `Se documentan en la misma región: ${regA}.`
        : `Se documentan en regiones distintas: ${regA} y ${regB}.`;

    return { same, axisMax, overlapStart, overlapEnd, status, verdict, placeSummary };
  }, [taxonA, taxonB]);

  // 24-hour evolutionary clock (last ~7 Ma based on Sahelanthropus tchadensis)
  const totalClockMa = useMemo(() => {
    const sah = ATLAS_TAXONES.find((t) => t.id === 'sahelanthropus');
    return sah ? sah.desde : 7;
  }, []);

  const clockMilestones = useMemo(() => {
    const picks: Array<{ id: string; note: string }> = [
      { id: 'sahelanthropus', note: 'el hominino más antiguo propuesto' },
      { id: 'ardipithecus', note: 'bipedismo temprano en bosque' },
      { id: 'afarensis', note: 'la especie de «Lucy» y Laetoli' },
      { id: 'habilis', note: 'primeros representantes de Homo' },
      { id: 'erectus', note: 'primera gran expansión afroeurasiática' },
      { id: 'sapiens', note: 'nuestra especie (Jebel Irhoud ~300 ka)' },
    ];
    return picks
      .map((p) => {
        const t = ATLAS_TAXONES.find((x) => x.id === p.id);
        if (!t || t.desde > totalClockMa) return null;
        return {
          taxon: t,
          note: p.note,
          clockStr: t.desde === totalClockMa ? '00:00' : formatClock24h(t.desde, totalClockMa),
          pct: (1 - t.desde / totalClockMa) * 100,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [totalClockMa]);

  const focusedClockTaxon =
    ATLAS_TAXONES.find((t) => t.id === clockFocusId) ??
    ATLAS_TAXONES.find((t) => t.id === 'sapiens') ??
    ATLAS_TAXONES[0];

  const last2000YearsSec = Math.max(1, Math.round((2000 / (totalClockMa * 1e6)) * 86400));

  return (
    <div className="flex flex-col gap-10">
      {/* PART 1: Two-species comparator */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="font-mono text-xs text-ochre inline-flex items-center gap-1.5">
            <GitCompareArrows className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Comparador de dos especies · Recurso DEA (ULPGC)</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-ink">
            ¿Coincidieron dos especies en el tiempo y el espacio?
          </h3>
          <p className="text-sm leading-relaxed text-ink-muted">
            Seleccione dos especies del corpus para contrastar sus intervalos cronológicos sobre un
            eje común, identificar posibles franjas de coexistencia y comparar sus regiones de
            hallazgo.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-ink-muted mr-1">
            Comparaciones sugeridas (Sesión 3):
          </span>
          {COMPARE_PRESETS.map((pr) => {
            const active = idA === pr.a && idB === pr.b;
            return (
              <button
                key={pr.label}
                type="button"
                onClick={() => {
                  setIdA(pr.a);
                  setIdB(pr.b);
                  onSelectTaxon(pr.a);
                }}
                className={`min-h-[34px] px-3 py-1 text-xs rounded border transition-colors cursor-pointer ${
                  active
                    ? 'bg-ink text-white border-ink'
                    : 'bg-canvas text-ink border-hairline hover:border-ink'
                }`}
              >
                {pr.label}
              </button>
            );
          })}
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-paper border-t border-b border-hairline p-4">
          <label className="flex flex-col gap-1.5 text-xs">
            <span className="font-mono font-medium text-ochre">Primera especie</span>
            <select
              value={idA}
              onChange={(e) => {
                setIdA(e.target.value);
                onSelectTaxon(e.target.value);
              }}
              className="min-h-[40px] px-3 py-1.5 bg-canvas border border-hairline rounded text-sm text-ink focus:border-ink"
            >
              <optgroup label="África">
                {africanTaxa.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.n} ({formatRangeShort(t)})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Fuera de África">
                {nonAfricanTaxa.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.n} ({formatRangeShort(t)})
                  </option>
                ))}
              </optgroup>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs">
            <span className="font-mono font-medium text-lapis">Segunda especie</span>
            <select
              value={idB}
              onChange={(e) => setIdB(e.target.value)}
              className="min-h-[40px] px-3 py-1.5 bg-canvas border border-hairline rounded text-sm text-ink focus:border-ink"
            >
              <optgroup label="África">
                {africanTaxa.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.n} ({formatRangeShort(t)})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Fuera de África">
                {nonAfricanTaxa.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.n} ({formatRangeShort(t)})
                  </option>
                ))}
              </optgroup>
            </select>
          </label>
        </div>

        {/* Comparison verdict & aligned dual timeline chart */}
        <div className="bg-canvas border border-hairline border-t-2 border-t-rule p-5 sm:p-6 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="font-mono text-xs font-medium text-ink-muted">
                {comparison.status === 'coinciden' && (
                  <span className="text-forest">Veredicto · Coexistencia temporal probable</span>
                )}
                {comparison.status === 'separadas' && (
                  <span className="text-ochre">Veredicto · Sin solapamiento temporal</span>
                )}
                {comparison.status === 'limite' && (
                  <span className="text-lapis">Veredicto · Intervalos tangentes</span>
                )}
                {comparison.status === 'misma' && (
                  <span className="text-ink-muted">Veredicto · Misma entrada seleccionada</span>
                )}
              </div>
              <h4 className="font-display text-xl sm:text-2xl font-semibold text-ink leading-snug">
                {comparison.verdict}
              </h4>
              {!comparison.same && (
                <p className="text-sm text-ink-muted">{comparison.placeSummary}</p>
              )}
            </div>

            {!comparison.same && (
              <button
                type="button"
                onClick={(e) => handleOpenCompareLightbox(e.currentTarget)}
                className="no-print self-start min-h-[40px] px-3.5 py-2 font-mono text-xs font-medium text-ink bg-paper border border-ink rounded hover:bg-ink hover:text-white inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Comparar especímenes en pantalla completa</span>
              </button>
            )}
          </div>

          {/* Aligned timeline bars */}
          <div className="relative bg-paper border border-hairline px-4 py-5 flex flex-col gap-4">
            {/* Overlap shaded band */}
            {comparison.status === 'coinciden' && (
              <div
                aria-hidden="true"
                className="absolute top-0 bottom-7 bg-forest/15 border-x border-forest/50 pointer-events-none"
                style={{
                  left: `calc(1rem + ${(comparison.axisMax - comparison.overlapStart) / comparison.axisMax} * (100% - 2rem))`,
                  width: `calc(${(comparison.overlapStart - comparison.overlapEnd) / comparison.axisMax} * (100% - 2rem))`,
                }}
              />
            )}

            {(comparison.same ? [taxonA] : [taxonA, taxonB]).map((t, i) => {
              const leftPct =
                ((comparison.axisMax - Math.min(t.desde, comparison.axisMax)) /
                  comparison.axisMax) *
                100;
              const widthPct = Math.max(
                ((Math.min(t.desde, comparison.axisMax) - t.hasta) / comparison.axisMax) * 100,
                1.2
              );
              const barColor = i === 0 ? 'bg-ochre' : 'bg-lapis';
              const clado = ATLAS_CLADOS[t.c]?.nombre ?? t.c;
              return (
                <div key={`${t.id}-${i}`} className="relative z-10 flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
                    <div>
                      <span className="italic font-semibold text-ink">{t.n}</span>
                      <span className="font-mono text-ink-muted ml-2">
                        · {clado} · {ATLAS_REGIONES[t.region]?.nombre ?? t.region}
                      </span>
                    </div>
                    <span className="font-mono text-ink tabular-nums">
                      {formatRangeShort(t)}
                      {t.debatido ? ' · Debatido' : ''}
                    </span>
                  </div>
                  <div className="relative h-3.5 bg-surface-high overflow-hidden">
                    <span
                      className={`absolute top-0 bottom-0 ${barColor} ${
                        t.debatido ? 'opacity-75' : ''
                      }`}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Axis ticks */}
            <div className="relative z-10 flex items-center justify-between pt-2 border-t border-hairline font-mono text-[11px] text-ink-muted tabular-nums">
              <span>{comparison.axisMax.toFixed(1).replace('.', ',')} Ma</span>
              <span>{(comparison.axisMax * 0.5).toFixed(1).replace('.', ',')} Ma</span>
              <span>Hoy (0 Ma)</span>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-ink-muted">
            <strong className="text-ink">Cautela metodológica:</strong> coincidir en el tiempo no
            significa necesariamente que dos poblaciones se encontraran; también cuentan la
            geografía, las barreras ecológicas y el carácter incompleto del registro fósil. Todas
            las fechas son aproximadas.
          </p>
        </div>

        {/* Side-by-side Dossiers */}
        {!comparison.same && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TaxonDossierCard taxon={taxonA} />
            <TaxonDossierCard taxon={taxonB} />
          </div>
        )}
      </div>

      {/* PART 2: 24-Hour Evolutionary Clock */}
      <div className="pt-8 border-t border-rule flex flex-col gap-6">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="font-mono text-xs text-lapis inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Escala del tiempo profundo · Reloj evolutivo de 24 horas</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-ink">
            ¿Cuánto es un millón de años? Imagine un solo día
          </h3>
          <p className="text-sm leading-relaxed text-ink-muted">
            Si los últimos{' '}
            <strong className="font-mono text-ink tabular-nums">
              {totalClockMa.toFixed(1).replace('.', ',')} millones de años
            </strong>{' '}
            (desde <em>Sahelanthropus tchadensis</em> hasta hoy) se comprimieran en un único día de
            24 horas que empezara a medianoche (00:00), así se distribuirían los principales hitos
            de la evolución humana:
          </p>
        </div>

        {/* Visual 24-hour horizontal ruler */}
        <div className="bg-paper border-t border-b border-hairline p-5 flex flex-col gap-5">
          <div className="relative pt-6 pb-8">
            <div className="h-2 w-full bg-surface-high relative">
              {/* Highlight focused taxon */}
              {focusedClockTaxon.desde <= totalClockMa && (
                <div
                  className="absolute top-0 bottom-0 bg-ochre/35"
                  style={{
                    left: `${(1 - focusedClockTaxon.desde / totalClockMa) * 100}%`,
                    width: `${Math.max(
                      0.8,
                      ((focusedClockTaxon.desde - focusedClockTaxon.hasta) / totalClockMa) * 100
                    )}%`,
                  }}
                />
              )}

              {clockMilestones.map((ms, idx) => {
                const isSel = ms.taxon.id === focusedClockTaxon.id;
                return (
                  <button
                    key={ms.taxon.id}
                    type="button"
                    onClick={() => setClockFocusId(ms.taxon.id)}
                    style={{ left: `${ms.pct}%` }}
                    title={`${ms.clockStr} · ${ms.taxon.n}`}
                    className={`absolute -top-2 -translate-x-1/2 w-6 h-6 rounded-full border text-[10px] font-mono font-semibold flex items-center justify-center cursor-pointer transition-transform ${
                      isSel
                        ? 'bg-ochre text-white border-ink scale-110 z-20'
                        : 'bg-canvas text-ink border-ink hover:bg-ink hover:text-white z-10'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-3 font-mono text-[11px] text-ink-muted tabular-nums">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00 (hoy)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <ol className="lg:col-span-7 m-0 p-0 list-none flex flex-col divide-y divide-hairline border-t border-b border-hairline">
              {clockMilestones.map((ms, idx) => {
                const isSel = ms.taxon.id === focusedClockTaxon.id;
                return (
                  <li key={ms.taxon.id}>
                    <button
                      type="button"
                      onClick={() => setClockFocusId(ms.taxon.id)}
                      className={`w-full text-left py-2.5 px-2 flex flex-wrap items-baseline justify-between gap-2 text-xs sm:text-sm cursor-pointer transition-colors ${
                        isSel ? 'bg-ochre-soft' : 'hover:bg-canvas'
                      }`}
                    >
                      <span>
                        <span className="font-mono text-xs text-ochre mr-2 tabular-nums">
                          {idx + 1}. {ms.clockStr}
                        </span>
                        <em className="font-medium text-ink">{ms.taxon.n}</em>
                        <span className="text-ink-muted"> — {ms.note}</span>
                      </span>
                      <span className="font-mono text-[11px] text-ink-muted tabular-nums">
                        {formatMa(ms.taxon.desde)}
                      </span>
                    </button>
                  </li>
                );
              })}
              <li className="py-2.5 px-2 text-xs sm:text-sm bg-canvas">
                <span className="font-mono text-xs text-lapis font-semibold mr-2 tabular-nums">
                  Últimos {last2000YearsSec} s
                </span>
                <span className="text-ink">
                  Los últimos 2.000 años de historia humana caben en apenas{' '}
                  <strong className="font-mono tabular-nums">{last2000YearsSec} segundos</strong>{' '}
                  antes de la medianoche final.
                </span>
              </li>
            </ol>

            {/* Interactive Taxon-to-Clock Converter */}
            <div className="lg:col-span-5 bg-canvas border border-hairline p-4 flex flex-col gap-3">
              <div className="font-mono text-[11px] text-ink-muted">
                Calculadora de hora evolutiva (homininos ≤ {totalClockMa} Ma)
              </div>
              <select
                value={focusedClockTaxon.id}
                onChange={(e) => setClockFocusId(e.target.value)}
                aria-label="Seleccionar especie para calcular su hora en el reloj de 24 horas"
                className="min-h-[38px] px-3 py-1.5 bg-paper border border-hairline rounded text-xs text-ink"
              >
                {sortedTaxa
                  .filter((t) => t.desde <= totalClockMa)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.n} ({formatRangeShort(t)})
                    </option>
                  ))}
              </select>

              <div className="pt-2 border-t border-hairline flex items-baseline justify-between gap-2">
                <span className="text-xs text-ink-muted">Aparición aproximada en el día:</span>
                <span className="font-mono text-2xl font-semibold text-ochre tabular-nums">
                  {formatClock24h(focusedClockTaxon.desde, totalClockMa)} h
                </span>
              </div>
              <p className="text-xs leading-relaxed text-ink-muted">
                <em className="text-ink font-medium">{focusedClockTaxon.n}</em> (
                {formatRangeShort(focusedClockTaxon)}) se sitúa entre las{' '}
                <strong className="font-mono text-ink tabular-nums">
                  {formatClock24h(focusedClockTaxon.desde, totalClockMa)}
                </strong>{' '}
                y las{' '}
                <strong className="font-mono text-ink tabular-nums">
                  {focusedClockTaxon.hasta === 0
                    ? '24:00'
                    : formatClock24h(focusedClockTaxon.hasta, totalClockMa)}
                </strong>{' '}
                de este reloj de 24 horas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
