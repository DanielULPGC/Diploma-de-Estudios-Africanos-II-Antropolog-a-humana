import { ExternalLink } from 'lucide-react';
import {
  ATLAS_CLIMA,
  ATLAS_FUENTES,
  ATLAS_METODOS,
  CLIMA_NOTA_EPISTEMOLOGICA,
  METODOS_NOTA_EPISTEMOLOGICA,
} from '../../data/atlasPaleo';
import { GlossaryTermTrigger } from '../GlossaryContext';

export function AtlasClimateView() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 max-w-3xl">
        <div className="font-mono text-xs text-ochre">Bloque 03 · Clima y ecología evolutiva</div>
        <h3 className="font-display text-2xl font-semibold text-ink">En qué mundo vivieron</h3>
        <p className="text-sm sm:text-base leading-relaxed text-ink">
          El clima no es un simple telón de fondo de la evolución humana, sino uno de los factores
          que la contextualizan. La investigación reciente ha desplazado el foco de los paisajes
          fijos a la{' '}
          <GlossaryTermTrigger termId="seleccion-variabilidad" tone="ochre">
            variabilidad ambiental
          </GlossaryTermTrigger>{' '}
          como marco de la adaptación, ponderando siempre los sesgos de la{' '}
          <GlossaryTermTrigger termId="tafonomia" tone="ochre">
            tafonomía
          </GlossaryTermTrigger>
          .
        </p>
      </div>

      <div className="bg-paper border-t border-b border-hairline px-4 py-3 text-xs leading-relaxed text-ink-muted max-w-4xl">
        <span className="font-mono font-medium text-ink mr-2">Nota epistemológica ·</span>
        {CLIMA_NOTA_EPISTEMOLOGICA}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ATLAS_CLIMA.map((marco, idx) => (
          <article
            key={marco.id}
            className="border-t-2 border-t-rule bg-paper p-5 flex flex-col justify-between gap-4"
          >
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-xs text-ochre tabular-nums">
                0{idx + 1}. Marco ecológico
              </span>
              <h4 className="font-display text-lg font-semibold text-ink leading-snug">
                {marco.titulo}
              </h4>
              <p className="text-sm leading-relaxed text-ink">{marco.idea}</p>
            </div>

            <div className="pt-3 border-t border-hairline flex flex-col gap-1.5">
              <span className="font-mono text-[11px] text-ink-muted">Referencias primarias</span>
              {marco.fuentes.map((fKey) => {
                const ref = ATLAS_FUENTES[fKey];
                if (!ref) return null;
                return (
                  <div key={fKey} className="text-[11px] leading-relaxed text-ink-muted">
                    <span>{ref.cita}</span>
                    {ref.doi && (
                      <a
                        href={`https://doi.org/${ref.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 ml-1.5 font-mono text-lapis hover:underline"
                      >
                        <span>DOI</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function AtlasMethodsView() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-3 max-w-3xl">
          <div className="font-mono text-xs text-lapis">
            Bloque 04 · Métodos inferenciales de la paleoantropología
          </div>
          <h3 className="font-display text-2xl font-semibold text-ink">Cómo lo sabemos</h3>
          <p className="text-sm sm:text-base leading-relaxed text-ink">
            La paleoantropología no adivina: infiere, con disciplina, a partir de indicios. Cuatro
            vías principales —
            <GlossaryTermTrigger termId="datacion-radiometrica" tone="lapis">
              datación radiométrica
            </GlossaryTermTrigger>
            ,{' '}
            <GlossaryTermTrigger termId="tafonomia" tone="lapis">
              tafonomía
            </GlossaryTermTrigger>
            ,{' '}
            <GlossaryTermTrigger termId="adn-antiguo" tone="lapis">
              ADN antiguo
            </GlossaryTermTrigger>{' '}
            y{' '}
            <GlossaryTermTrigger termId="paleoproteomica" tone="ochre">
              paleoproteómica
            </GlossaryTermTrigger>
            — convergen para ordenar el registro africano y eurasiático.
          </p>
        </div>

        <a
          href="#sec-paleomolecular"
          onClick={(e) => {
            e.preventDefault();
            window.dispatchEvent(
              new CustomEvent('ulpgc:navigate-course', {
                detail: { sectionId: 'sec-paleomolecular' },
              })
            );
          }}
          className="self-start sm:self-end min-h-[38px] px-3.5 py-1.5 font-mono text-xs font-medium text-ink bg-paper border border-ink rounded hover:bg-ink hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          Ir al aparato molecular completo →
        </a>
      </div>

      <div className="bg-paper border-t border-b border-hairline px-4 py-3 text-xs leading-relaxed text-ink-muted max-w-4xl">
        <span className="font-mono font-medium text-ink mr-2">Nota epistemológica ·</span>
        {METODOS_NOTA_EPISTEMOLOGICA}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ATLAS_METODOS.map((m, idx) => (
          <article
            key={m.id}
            className="border-t-2 border-t-rule bg-paper p-5 flex flex-col justify-between gap-4"
          >
            <div className="flex flex-col gap-3">
              <div>
                <span className="font-mono text-xs text-lapis tabular-nums">
                  0{idx + 1}. {m.pregunta}
                </span>
                <h4 className="font-display text-xl font-semibold text-ink mt-1">{m.nombre}</h4>
              </div>

              <dl className="flex flex-col gap-3 text-sm m-0">
                <div>
                  <dt className="font-mono text-[11px] font-medium text-ink mb-0.5">
                    Cómo funciona
                  </dt>
                  <dd className="text-ink-muted leading-relaxed m-0">{m.como}</dd>
                </div>
                <div className="pt-2 border-t border-hairline">
                  <dt className="font-mono text-[11px] font-medium text-forest mb-0.5">
                    Qué aporta
                  </dt>
                  <dd className="text-ink leading-relaxed m-0">{m.aporta}</dd>
                </div>
                <div className="pt-2 border-t border-hairline">
                  <dt className="font-mono text-[11px] font-medium text-ochre mb-0.5">
                    Límites y cautelas
                  </dt>
                  <dd className="text-ink-muted leading-relaxed m-0">{m.limita}</dd>
                </div>
              </dl>
            </div>

            <div className="pt-3 border-t border-hairline flex flex-col gap-1.5">
              <span className="font-mono text-[11px] text-ink-muted">Referencias primarias</span>
              {m.fuentes.map((fKey) => {
                const ref = ATLAS_FUENTES[fKey];
                if (!ref) return null;
                return (
                  <div key={fKey} className="text-[11px] leading-relaxed text-ink-muted">
                    <span>{ref.cita}</span>
                    {ref.doi && (
                      <a
                        href={`https://doi.org/${ref.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 ml-1.5 font-mono text-lapis hover:underline"
                      >
                        <span>DOI</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
