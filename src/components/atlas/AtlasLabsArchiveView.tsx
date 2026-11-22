import { useMemo, useState } from 'react';
import { Box, ExternalLink, Library, Maximize2, Search } from 'lucide-react';
import { NUTCRACKER_CORPUS, PALEOLAB_3D_DATA } from '../../data/deaArchiveData';
import { getTaxonImage, INSTITUTIONAL_MEDIA } from '../../data/taxonImages';
import { useLightbox } from '../LightboxContext';

export function AtlasLabsArchiveView({
  onInspectTaxon,
}: {
  onInspectTaxon: (taxonId: string) => void;
}) {
  const [selectedType, setSelectedType] = useState<string>('Todos');
  const [query, setQuery] = useState('');
  const { openSingle } = useLightbox();

  const resourceTypes = useMemo(() => {
    const types = Array.from(new Set(NUTCRACKER_CORPUS.resources.map((r) => r.type)));
    return ['Todos', ...types];
  }, []);

  const filteredResources = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NUTCRACKER_CORPUS.resources.filter((r) => {
      if (selectedType !== 'Todos' && r.type !== selectedType) return false;
      if (q) {
        const hay = `${r.title} ${r.note} ${r.type} ${r.date}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [selectedType, query]);

  const maxCategoryCount = Math.max(...NUTCRACKER_CORPUS.categories.map(([, c]) => c));

  return (
    <div className="flex flex-col gap-10">
      {/* PART 1: PaleoLab 3D (Smithsonian 3D Digitization) */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="font-mono text-xs text-ochre inline-flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5" aria-hidden="true" />
            <span>PaleoLab 3D · {PALEOLAB_3D_DATA.institution}</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-ink">
            Colección osteológica 3D verificada (réplicas craneales)
          </h3>
          <p className="text-sm leading-relaxed text-ink-muted">
            Acceso directo a los cinco especímenes craneales digitalizados en 3D integrados en la
            plataforma ULPGC. Permite inspeccionar morfología facial, cresta sagital, torus
            supraorbitario y capacidad craneal directamente en el visor institucional del
            Smithsonian.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PALEOLAB_3D_DATA.models.map((model) => {
            const linkedTaxonId = model.dataTaxonId ?? model.id;
            const specimenImg = getTaxonImage(linkedTaxonId);
            return (
              <article
                key={model.id}
                className="bg-paper border-t-2 border-t-rule border-b border-b-hairline p-5 flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={(e) =>
                      openSingle(
                        {
                          src: specimenImg.src,
                          alt: specimenImg.alt,
                          title: model.taxonName,
                          subtitle: `PaleoLab 3D · Espécimen ${model.specimen}`,
                          caption: model.note,
                          credit: specimenImg.credito,
                          license: specimenImg.licencia,
                          licenseUrl: specimenImg.licenciaUrl,
                          sourceUrl: model.url,
                        },
                        e.currentTarget
                      )
                    }
                    aria-label={`Ampliar réplica craneal de ${model.taxonName} (${model.specimen})`}
                    className="group relative w-full aspect-[4/3] bg-[#eeede8] border border-hairline hover:border-ink overflow-hidden flex items-center justify-center p-2 cursor-zoom-in transition-colors"
                  >
                    <img
                      src={specimenImg.src}
                      alt={specimenImg.alt}
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
                  <div className="font-mono text-[11px] text-ochre">
                    Espécimen · {model.specimen}
                  </div>
                  <h4 className="font-display text-lg font-semibold italic text-ink leading-snug">
                    {model.taxonName}
                  </h4>
                  <p className="text-xs leading-relaxed text-ink-muted">{model.note}</p>
                </div>

                <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onInspectTaxon(linkedTaxonId)}
                    className="min-h-[34px] px-2.5 py-1 text-xs font-medium text-ink bg-canvas border border-hairline rounded hover:border-ink transition-colors cursor-pointer"
                  >
                    Ver ficha en Atlas
                  </button>
                  <a
                    href={model.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs font-medium text-lapis hover:underline"
                  >
                    <span>Abrir modelo 3D</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <p className="font-mono text-[11px] text-ink-muted bg-paper border-t border-b border-hairline px-4 py-2.5">
          <strong className="text-ink">Derechos y verificación ({PALEOLAB_3D_DATA.updatedAt}):</strong>{' '}
          {PALEOLAB_3D_DATA.rightsNote}
        </p>
      </div>

      {/* PART 2: Nutcracker Man Hemerographic Corpus */}
      <div className="pt-8 border-t border-rule flex flex-col gap-6">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="font-mono text-xs text-lapis inline-flex items-center gap-1.5">
            <Library className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Archivo Hemerográfico · Corpus Nutcracker Man (2014–2026)</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-ink">
            Observatorio de actualidad, bioarqueología del cuidado y debates abiertos
          </h3>
          <p className="text-sm leading-relaxed text-ink-muted">
            Sistematización hemerográfica incorporada en el Atlas ULPGC a partir del archivo de
            divulgación científica <em>Nutcracker Man</em> (Roberto Sáez), con{' '}
            <strong className="font-mono text-ink tabular-nums">
              {NUTCRACKER_CORPUS.observedPosts}
            </strong>{' '}
            entradas analizadas ({NUTCRACKER_CORPUS.observedRange}) y{' '}
            <strong className="font-mono text-ink tabular-nums">
              {NUTCRACKER_CORPUS.resources.length}
            </strong>{' '}
            recursos curados para seminario universitario.
          </p>
        </div>

        {/* Quantitative Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="border-t border-rule pt-2.5">
            <span className="font-mono text-[11px] text-ink-muted block">Entradas analizadas</span>
            <span className="font-mono text-2xl font-semibold text-ink tabular-nums">
              {NUTCRACKER_CORPUS.observedPosts}
            </span>
            <span className="font-mono text-[11px] text-ink-muted block">
              {NUTCRACKER_CORPUS.observedRange}
            </span>
          </div>
          <div className="border-t border-rule pt-2.5">
            <span className="font-mono text-[11px] text-ink-muted block">
              Entradas con referencias primarias
            </span>
            <span className="font-mono text-2xl font-semibold text-ochre tabular-nums">
              {NUTCRACKER_CORPUS.postsWithExternalReferences}
            </span>
            <span className="font-mono text-[11px] text-ink-muted block">
              {NUTCRACKER_CORPUS.externalReferenceLinks} enlaces bibliográficos verificados
            </span>
          </div>
          <div className="border-t border-rule pt-2.5">
            <span className="font-mono text-[11px] text-ink-muted block">
              Recursos curados para docencia
            </span>
            <span className="font-mono text-2xl font-semibold text-lapis tabular-nums">
              {NUTCRACKER_CORPUS.resources.length}
            </span>
            <span className="font-mono text-[11px] text-ink-muted block">
              Revisión: {NUTCRACKER_CORPUS.reviewedAt}
            </span>
          </div>
        </div>

        {/* Category Distribution Bars + Top Tags */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-paper border-t border-b border-hairline p-5 flex flex-col gap-3">
            <h4 className="font-mono text-xs font-semibold text-ink">
              Distribución temática del corpus (11 categorías)
            </h4>
            <div className="flex flex-col gap-2">
              {NUTCRACKER_CORPUS.categories.map(([cat, count]) => (
                <div key={cat} className="grid grid-cols-12 items-center gap-3 text-xs">
                  <span className="col-span-5 sm:col-span-4 text-ink truncate">{cat}</span>
                  <div className="col-span-5 sm:col-span-6 h-2 bg-surface-high overflow-hidden">
                    <span
                      className="block h-full bg-lapis"
                      style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                    />
                  </div>
                  <span className="col-span-2 text-right font-mono text-ink-muted tabular-nums">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-paper border-t border-b border-hairline p-5 flex flex-col gap-3">
            <h4 className="font-mono text-xs font-semibold text-ink">
              Focos temáticos recurrentes (etiquetas principales)
            </h4>
            <div className="flex flex-col divide-y divide-hairline">
              {NUTCRACKER_CORPUS.topTags.map(([tag, count]) => (
                <div
                  key={tag}
                  className="py-1.5 flex items-center justify-between gap-2 text-xs"
                >
                  <span className="text-ink">{tag}</span>
                  <span className="font-mono text-ink-muted tabular-nums">{count} entradas</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Curated 28-Resource Directory */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {resourceTypes.map((type) => {
                const isActive = selectedType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    aria-pressed={isActive}
                    className={`min-h-[34px] px-3 py-1 text-xs font-medium rounded border transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-ink text-white border-ink'
                        : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>

            <div className="relative min-w-[220px] sm:w-64">
              <Search
                className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar en el archivo..."
                aria-label="Buscar recursos en el archivo Nutcracker Man"
                className="w-full min-h-[36px] pl-9 pr-3 py-1 text-xs bg-canvas border border-hairline rounded text-ink placeholder:text-ink-subtle focus:border-ink"
              />
            </div>
          </div>

          {filteredResources.length === 0 ? (
            <div className="p-8 border border-hairline bg-paper text-center flex flex-col items-center gap-3">
              <p className="text-sm text-ink-muted m-0">
                No se encontraron entradas en el archivo hemerográfico para «{query}».
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedType('Todos');
                  setQuery('');
                }}
                className="min-h-[38px] px-4 py-1.5 font-mono text-xs font-medium text-ink bg-canvas border border-ink rounded hover:bg-ink hover:text-white transition-colors cursor-pointer"
              >
                Ver todos los recursos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map((res) => (
              <article
                key={res.url}
                className="bg-canvas border border-hairline p-4 flex flex-col justify-between gap-3"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="font-mono text-[11px] text-ink-muted">
                    <span className="text-ochre font-medium">{res.type}</span>
                    <span aria-hidden="true"> · </span>
                    <span className="tabular-nums">{res.date}</span>
                  </div>
                  <h5 className="font-display text-base font-semibold text-ink leading-snug">
                    {res.title}
                  </h5>
                  <p className="text-xs leading-relaxed text-ink-muted">{res.note}</p>
                </div>

                <div className="pt-2 border-t border-hairline flex flex-wrap items-center gap-4 font-mono text-[11px]">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-lapis hover:underline"
                  >
                    <span>Artículo</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                  {res.primary && (
                    <a
                      href={res.primary}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-ochre hover:underline"
                    >
                      <span>Fuente primaria (DOI / artículo)</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
