import { useState } from 'react';
import { Users, ShieldCheck, Scale } from 'lucide-react';
import {
  CONFLICT_COOPERATION_MATRIX,
  SOCIAL_SYSTEM_PROFILES,
} from '../../data/ethologyExtendedData';
import { GlossaryTermTrigger } from '../GlossaryContext';

export function SocialCooperationTab() {
  const [selectedProfileId, setSelectedProfileId] = useState<string>(SOCIAL_SYSTEM_PROFILES[0].id);

  const activeProfile =
    SOCIAL_SYSTEM_PROFILES.find((p) => p.id === selectedProfileId) ?? SOCIAL_SYSTEM_PROFILES[0];

  const getAccentText = (accent: 'ochre' | 'lapis' | 'forest' | 'plum') => {
    if (accent === 'ochre') return 'text-ochre';
    if (accent === 'lapis') return 'text-lapis';
    if (accent === 'forest') return 'text-forest';
    return 'text-plum';
  };

  return (
    <div
      id="panel-etologia-sociedad"
      role="tabpanel"
      aria-labelledby="tab-etologia-sociedad"
      className="flex flex-col gap-6"
    >
      {/* Editorial framing strip */}
      <div className="bg-paper border border-hairline p-5 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 font-mono text-xs text-ochre">
          <Users className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Organización social, política primate y resolución de conflictos en África</span>
        </div>
        <p className="text-sm leading-relaxed text-ink m-0 max-w-[78ch]">
          La vida en grupo ofrece protección frente a depredadores y acceso compartido a información
          ecológica, pero genera competencia constante. Los primates africanos han evolucionado
          soluciones radicalmente distintas —desde las{' '}
          <GlossaryTermTrigger termId="fision-fusion" tone="ochre">
            sociedades de fisión-fusión
          </GlossaryTermTrigger>{' '}
          y la{' '}
          <GlossaryTermTrigger termId="caza-cooperativa-chimpances" tone="ochre">
            caza cooperativa por roles
          </GlossaryTermTrigger>{' '}
          de los chimpancés de Taï hasta las coaliciones femeninas de bonobos, la cohesión protectora
          de gorilas y las sociedades multinivel de los geladas etíopes— sostenidas por mecanismos
          activos de{' '}
          <GlossaryTermTrigger termId="reconciliacion-consolacion" tone="lapis">
            reconciliación y consolación
          </GlossaryTermTrigger>
          .
        </p>
      </div>

      {/* Interactive Selector + Detailed Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of 4 African Social Systems */}
        <div
          className="lg:col-span-4 flex flex-col gap-2.5"
          role="listbox"
          aria-label="Modelos de organización social africana"
        >
          {SOCIAL_SYSTEM_PROFILES.map((profile) => {
            const isSelected = profile.id === activeProfile.id;
            return (
              <button
                key={profile.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => setSelectedProfileId(profile.id)}
                className={`p-4 text-left border transition-colors cursor-pointer flex flex-col gap-1 ${
                  isSelected
                    ? 'bg-paper border-ink'
                    : 'bg-canvas border-hairline hover:border-ink/60'
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-base font-semibold text-ink">
                    {profile.commonName}
                  </span>
                  <span className={`font-mono text-[11px] shrink-0 ${getAccentText(profile.accent)}`}>
                    {isSelected ? 'En estudio' : 'Explorar'}
                  </span>
                </div>
                <span className="font-mono text-[11px] italic text-ink-muted">
                  {profile.species}
                </span>
                <span className="text-xs text-ink-muted leading-snug pt-0.5">
                  {profile.systemType}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Detailed Dossier */}
        <article className="lg:col-span-8 bg-canvas border border-hairline p-5 sm:p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1 border-b border-rule pb-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-ink-muted">
              <span className={getAccentText(activeProfile.accent)}>{activeProfile.region}</span>
              <span aria-hidden="true">·</span>
              <span>{activeProfile.habitat}</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink m-0">
              {activeProfile.commonName}{' '}
              <em className="font-normal text-ink-muted text-lg">({activeProfile.species})</em>
            </h3>
            <p className="font-mono text-xs text-ink-muted m-0">
              Enclaves de campo: {activeProfile.fieldSites}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-paper border border-hairline p-4 text-xs">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] text-ink-muted">Arquitectura social</span>
              <span className="font-semibold text-ink">{activeProfile.systemType}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] text-ink-muted">Patrón de dispersión sexual</span>
              <span className="font-semibold text-ink">{activeProfile.dispersalSex}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm leading-relaxed">
            <div className="flex flex-col gap-1.5 border-t border-hairline pt-3">
              <span className="font-mono text-[11px] text-ochre font-medium">
                Jerarquía, alianzas y coaliciones
              </span>
              <p className="text-ink m-0">{activeProfile.hierarchyAndCoalitions}</p>
            </div>

            <div className="flex flex-col gap-1.5 border-t border-hairline pt-3">
              <span className="font-mono text-[11px] text-lapis font-medium">
                Resolución de conflictos y reparación
              </span>
              <p className="text-ink m-0">{activeProfile.conflictResolution}</p>
            </div>

            <div className="flex flex-col gap-1.5 border-t border-hairline pt-3">
              <span className="font-mono text-[11px] text-forest font-medium">
                Cooperación, reparto y defensa
              </span>
              <p className="text-ink m-0">{activeProfile.cooperationAndSharing}</p>
            </div>

            <div className="flex flex-col gap-1.5 border-t border-hairline pt-3">
              <span className="font-mono text-[11px] text-plum font-medium">
                Aporte a la evolución social humana
              </span>
              <p className="text-ink m-0">{activeProfile.evolutionaryInsight}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted font-mono">
            <span>Fuentes primarias: {activeProfile.citation}</span>
          </div>
        </article>
      </div>

      {/* Comparative Synthesis Table */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-xs text-ink">
            <Scale className="w-3.5 h-3.5 text-lapis" aria-hidden="true" />
            <span>Cuadro comparado de sistemas sociales africanos</span>
          </div>
          <span className="font-mono text-[11px] text-ink-muted">
            Del dosel selvático a la sabana abierta y altiplanos etíopes
          </span>
        </div>

        <div className="overflow-x-auto border border-hairline bg-canvas">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-paper border-b border-rule font-mono text-[11px] tracking-wide text-ink-muted">
                <th className="py-3 px-4 font-semibold">Especie</th>
                <th className="py-3 px-4 font-semibold">Estructura y tamaño</th>
                <th className="py-3 px-4 font-semibold">Dispersión</th>
                <th className="py-3 px-4 font-semibold">Mecanismo de resolución</th>
                <th className="py-3 px-4 font-semibold">Cooperación dominante</th>
                <th className="py-3 px-4 font-semibold">Relación intergrupal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline text-xs leading-relaxed text-ink">
              {CONFLICT_COOPERATION_MATRIX.map((row) => (
                <tr key={row.id} className="align-top hover:bg-paper/60 transition-colors">
                  <td className="py-3 px-4 font-display font-semibold italic text-ink whitespace-nowrap">
                    {row.species}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11.5px] tabular-nums">
                    {row.structure}
                  </td>
                  <td className="py-3 px-4">{row.dispersal}</td>
                  <td className="py-3 px-4">{row.conflictMechanism}</td>
                  <td className="py-3 px-4">{row.cooperationMode}</td>
                  <td className="py-3 px-4 text-ink-muted">{row.intergroupRelation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodological Caution Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm leading-relaxed">
        <div className="border-t border-rule pt-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-forest font-medium">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Por qué importan tanto chimpancés como bonobos</span>
          </div>
          <p className="text-ink m-0">
            Humanos, chimpancés y bonobos comparten idéntica distancia filogenética respecto al
            ancestro común (~6–7 Ma). Contrastar la cooperación coalicional y territorial de{' '}
            <em>Pan troglodytes</em> con la{' '}
            <GlossaryTermTrigger termId="tolerancia-social-cooperacion" tone="lapis">
              tolerancia social
            </GlossaryTermTrigger>{' '}
            y el reparto prosocial de <em>Pan paniscus</em> evita proyecciones simplistas sobre una
            supuesta «naturaleza humana» únicamente agresiva o únicamente pacífica.
          </p>
        </div>

        <div className="border-t border-rule pt-3 flex flex-col gap-1.5">
          <span className="font-mono text-[11px] text-ochre font-medium">
            El valor ecológico de babuinos y geladas
          </span>
          <p className="text-ink m-0">
            Aunque más distantes evolutivamente que los grandes simios, babuinos (<em>Papio</em>) y
            geladas (<em>Theropithecus</em>) evolucionaron en las mismas sabanas y altiplanos de
            África Oriental donde surgieron los primeros homininos, mostrando cómo la depredación en
            espacios abiertos impulsa redes multinivel, vigilancia colectiva y coordinación vocal.
          </p>
        </div>
      </div>
    </div>
  );
}
