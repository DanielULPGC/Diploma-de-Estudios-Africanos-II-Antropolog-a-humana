import { ChevronDown, ExternalLink } from 'lucide-react';
import { BIBLIOGRAPHY_ENTRIES } from '../data/curriculum';

export function QuizAndBibliography() {
  const totalRefs = BIBLIOGRAPHY_ENTRIES.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <section
      id="sec-bibliografia"
      className="pt-12 border-t border-hairline flex flex-col gap-6 scroll-mt-20"
    >
      <div className="flex flex-col gap-3">
        <div className="font-mono text-xs tracking-wide text-ochre">
          06. Referencias verificadas y repositorios abiertos
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight tracking-tight text-ink max-w-3xl [text-wrap:balance]">
          Bibliografía esencial APA 7.ª y portales científicos
        </h2>
        <p className="text-base leading-[1.7] text-ink-muted max-w-[68ch]">
          Corpus de {totalRefs} referencias verificadas en formato APA 7.ª edición organizadas por
          bloques temáticos junto a los repositorios abiertos de referencia empleados en el Módulo I
          del Diploma de Estudios Africanos (ULPGC).
        </p>
      </div>

      {/* Expandable Bibliography Drawer (open by default for direct reference) */}
      <details
        open
        className="group bg-paper border-t-2 border-t-rule border-b border-b-hairline px-6 py-4"
      >
        <summary className="list-none flex items-center justify-between gap-4 min-h-[44px] cursor-pointer font-display text-lg font-semibold text-ink">
          <span>Bibliografía esencial APA 7.ª del Módulo I</span>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-normal text-ink-muted whitespace-nowrap shrink-0">
            <span className="tabular-nums">{totalRefs} referencias</span>
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

          {/* Complementary Open Scientific Repositories: Pastwomen, Smithsonian & AntropologiaVisual.net */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl pt-2">
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

            <div className="bg-canvas border border-hairline p-4 flex flex-col justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[11px] font-semibold text-forest">
                  AntropologiaVisual.net · Archivo abierto de cine etnográfico
                </span>
                <p className="text-xs leading-relaxed text-ink m-0">
                  Archivo digital hispanohablante (desde 2005) de documental etnográfico,
                  etnoficción, muestras audiovisuales y perfiles de antropología visual con fondo
                  abierto sobre África, Magreb, Sahel y diáspora.
                </p>
              </div>
              <a
                href="https://antropologiavisual.net/archivo/africa/"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[38px] px-3.5 py-2 font-mono text-xs text-ink bg-paper border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors whitespace-nowrap self-start"
              >
                <span>Explorar antropologiavisual.net</span>
                <ExternalLink className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </details>
    </section>
  );
}
