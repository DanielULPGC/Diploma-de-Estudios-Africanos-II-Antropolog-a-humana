import { useState } from 'react';
import {
  ARCH_SITES,
  EDITORIAL_PLATES,
  IRON_SITES,
  LANGUAGE_FAMILIES,
  type ArchSiteId,
} from '../data/curriculum';
import { EditorialPlate } from './EditorialPlate';
import { GlossaryTermTrigger } from './GlossaryContext';

export function MetallurgyModule() {
  const [selectedIronId, setSelectedIronId] = useState<string>(IRON_SITES[0].id);
  const [selectedArchId, setSelectedArchId] = useState<ArchSiteId>('nok');

  const activeIron = IRON_SITES.find((s) => s.id === selectedIronId) ?? IRON_SITES[0];
  const activeArch = ARCH_SITES.find((s) => s.id === selectedArchId) ?? ARCH_SITES[0];

  const x0 = 185;
  const maxW = 290;
  const minY = -1200;
  const maxY = 500;

  return (
    <section
      id="sec-tecnologia"
      className="pt-12 border-t border-hairline flex flex-col gap-7 scroll-mt-20"
    >
      <div className="flex flex-col gap-3">
        <div className="font-mono text-xs tracking-wide text-ochre">
          02. Innovación tecnológica, lenguas y urbanismo temprano
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight tracking-tight text-ink max-w-3xl [text-wrap:balance]">
          Metalurgia del hierro, expansión bantú y ciudades sin reyes
        </h2>
        <div className="mt-1 py-3 px-4 bg-paper border-t border-b border-hairline max-w-3xl text-sm leading-relaxed text-ink-muted">
          <span className="font-mono text-xs font-medium text-ink mr-2">
            Objetivo de aprendizaje ·
          </span>
          Cuestionar el difusionismo eurocéntrico mediante la cronología temprana de la siderurgia
          africana, los flujos bantúes y modelos urbanos heterárquicos como Jenné-Jeno.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 flex flex-col gap-4 text-base leading-[1.72] text-ink">
          <p>
            A diferencia de Europa y Asia Occidental —donde el bronce precedió extensamente al
            hierro—, en buena parte del África subsahariana las sociedades pasaron directamente de
            la tecnología lítica a una <strong>siderurgia altamente sofisticada</strong> durante
            el primer milenio a. C. (con indicios debatidos aún más antiguos en África Central y el
            macizo de Termit en Níger). Los hornos africanos de reducción directa alcanzaban
            temperaturas capaces de producir acero al carbono mucho antes de la era industrial, con
            una extraordinaria diversidad de diseños regionales todavía objeto de estudio
            arqueometalúrgico.
          </p>
          <p>
            En paralelo, a partir de ~3000–2000 a. C., comunidades hablantes de lenguas{' '}
            <strong>bantúes</strong> (rama de la familia Níger-Congo) comenzaron una expansión
            milenaria desde la frontera entre Camerún y Nigeria hacia el centro, este y sur del
            continente. No fue una «invasión militar», sino un proceso gradual de migración
            agrícola, interacción con poblaciones cazadoras-recolectoras (joisán y pueblos del
            bosque) e intercambio tecnológico.
          </p>
        </div>
        <div className="lg:col-span-6 reading-mode-hide">
          <EditorialPlate plate={EDITORIAL_PLATES.metallurgy} />
        </div>
      </div>

      <div className="py-7 border-t border-rule border-b border-b-hairline flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-lg sm:text-xl font-semibold text-ink">
            Focos tempranos de metalurgia (izquierda) y grandes troncos lingüísticos africanos
            (derecha)
          </h3>
          <p className="font-mono text-xs text-ink-muted">
            Pulse cualquier foco siderúrgico para consultar su contexto técnico · Clasificación
            lingüística de Greenberg revisada
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-3">
            <svg
              viewBox="0 0 520 282"
              className="w-full h-auto block"
              role="img"
              aria-label="Cronología interactiva de sitios tempranos de metalurgia del hierro en África"
            >
              <text
                x={0}
                y={16}
                className="font-display"
                fontWeight={600}
                fontSize={13.5}
                fill="#121212"
              >
                Focos tempranos de siderurgia africana
              </text>

              {[-1000, -500, 0, 500].map((t) => {
                const x = x0 + ((t - minY) / (maxY - minY)) * maxW;
                const txt = t < 0 ? `${Math.abs(t)} a.C.` : t === 0 ? '0' : `${t} d.C.`;
                return (
                  <g key={t}>
                    <line
                      x1={x}
                      y1={30}
                      x2={x}
                      y2={244}
                      stroke="#e2e2dd"
                      strokeWidth={1}
                      strokeDasharray="2 3"
                    />
                    <text
                      x={x}
                      y={264}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize={11}
                      fill="#575753"
                    >
                      {txt}
                    </text>
                  </g>
                );
              })}

              <line x1={x0} y1={244} x2={x0 + maxW} y2={244} stroke="#121212" strokeWidth={1} />

              {IRON_SITES.map((s, idx) => {
                const y = 46 + idx * 32;
                const xPos = x0 + ((s.year - minY) / (maxY - minY)) * maxW;
                const xEnd = x0 + maxW;
                const isSel = s.id === selectedIronId;
                const col = s.story ? '#d95216' : '#1f5fa8';

                return (
                  <g
                    key={s.id}
                    onClick={() => setSelectedIronId(s.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedIronId(s.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${s.name}, datado en ${s.lbl}`}
                    className="cursor-pointer"
                  >
                    <rect
                      x={0}
                      y={y - 14}
                      width={516}
                      height={28}
                      fill={isSel ? '#f7f7f5' : 'transparent'}
                    />
                    <text
                      x={x0 - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="font-mono"
                      fontSize={11}
                      fontWeight={isSel ? 600 : 400}
                      fill={isSel ? '#121212' : '#575753'}
                    >
                      {s.name}
                    </text>
                    <line
                      x1={xPos}
                      y1={y}
                      x2={xEnd}
                      y2={y}
                      stroke={col}
                      strokeWidth={isSel ? 3 : 2}
                      opacity={isSel ? 0.65 : 0.3}
                    />
                    <circle
                      cx={xPos}
                      cy={y}
                      r={isSel ? 6.5 : 5}
                      fill={col}
                      stroke={isSel ? '#121212' : 'none'}
                      strokeWidth={1.5}
                    />
                    <text
                      x={xPos + 10}
                      y={y - 6}
                      className="font-mono"
                      fontSize={10.5}
                      fontWeight={isSel ? 600 : 500}
                      fill={s.story ? '#b43c0b' : '#1f5fa8'}
                    >
                      {s.lbl}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div
              className="bg-paper border-t border-b border-hairline px-4 py-3 text-xs leading-relaxed text-ink"
              aria-live="polite"
            >
              <span className="font-mono font-medium text-ochre mr-1.5">
                {activeIron.name} ({activeIron.lbl}) ·
              </span>
              {activeIron.detail}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <svg
              viewBox="0 0 520 282"
              className="w-full h-auto block"
              role="img"
              aria-label="Distribución aproximada de las cuatro grandes familias lingüísticas africanas"
            >
              <text
                x={0}
                y={16}
                className="font-display"
                fontWeight={600}
                fontSize={13.5}
                fill="#121212"
              >
                Cuatro grandes bloques lingüísticos (~2.000 lenguas)
              </text>

              {LANGUAGE_FAMILIES.map((f, idx) => {
                const y = 46 + idx * 52;
                return (
                  <g key={f.name}>
                    <text
                      x={0}
                      y={y}
                      className="font-mono"
                      fontSize={11}
                      fontWeight={500}
                      fill="#121212"
                    >
                      {f.name}
                    </text>
                    <text
                      x={508}
                      y={y}
                      textAnchor="end"
                      className="font-mono"
                      fontSize={11}
                      fill="#575753"
                    >
                      {f.langs}
                    </text>
                    <rect x={0} y={y + 8} width={508} height={15} fill="#e8e8e4" />
                    <rect
                      x={0}
                      y={y + 8}
                      width={Math.max(16, 508 * (f.pct / 100))}
                      height={15}
                      fill={f.color}
                    />
                  </g>
                );
              })}

              <line x1={0} y1={254} x2={508} y2={254} stroke="#e2e2dd" strokeWidth={1} />
              <text x={0} y={272} className="font-mono" fontSize={10.2} fill="#575753">
                *Revisión actual: «Joisán» agrupa 3 familias independientes (Khoe-Kwadi, Kx&apos;a, Tuu) + aisladas.
              </text>
            </svg>
            <div className="bg-paper border-t border-b border-hairline px-4 py-3 text-xs leading-relaxed text-ink">
              <span className="font-mono font-medium text-lapis mr-1.5">
                Matiz lingüístico (post-Greenberg) ·
              </span>
              La lingüística histórica actual (Güldemann, 2018) trata «Joisán» como agrupación areal
              de tres familias independientes (Khoe-Kwadi, Kx&apos;a y Tuu) más las aisladas hadza y
              sandawe, y señala debate sobre la unidad genealógica de Nilo-Sahariana. Las lenguas
              bantúes forman una subrama de Níger-Congo difundida en ~4.000 años.
            </div>
          </div>
        </div>

        <p className="font-mono text-xs text-ink-muted">
          Fuentes: Ehret (2002), <em>The Civilizations of Africa</em>; Holl (2020),{' '}
          <em>The Origins of African Metallurgies</em>; Güldemann (2018); McIntosh (1999).
        </p>
      </div>

      <div className="flex flex-col gap-3 max-w-[68ch]">
        <h3 className="font-display text-xl font-semibold text-ink">
          Cuatro horizontes arqueológicos que transformaron la arqueología africana
        </h3>
        <p className="text-base leading-[1.7] text-ink-muted">
          El urbanismo y la complejidad social africana adoptaron formas sumamente diversas
          —incluyendo ciudades organizadas en gremios cooperativos sin un palacio central («
          <GlossaryTermTrigger termId="heterarquia" tone="ochre">
            heterarquía
          </GlossaryTermTrigger>
          »)—. Seleccione una fila para explorar cada yacimiento:
        </p>
      </div>

      <div className="py-6 border-t border-rule border-b border-b-hairline flex flex-col gap-5">
        <div className="w-full overflow-x-auto">
          <table
            className="w-full border-collapse text-left"
            aria-label="Yacimientos arqueológicos clave de la África antigua"
          >
            <thead>
              <tr className="border-b border-rule font-mono text-xs text-ink-muted">
                <th className="py-3 pr-4 font-medium whitespace-nowrap">Cultura / Sitio</th>
                <th className="py-3 pr-4 font-medium whitespace-nowrap">Región actual</th>
                <th className="py-3 pr-4 font-medium whitespace-nowrap">Cronología</th>
                <th className="py-3 pr-4 font-medium">Rasgo distintivo</th>
                <th className="py-3 font-medium whitespace-nowrap">Categoría</th>
              </tr>
            </thead>
            <tbody>
              {ARCH_SITES.map((site) => {
                const isSelected = site.id === selectedArchId;
                const toneColor =
                  site.categoryTone === 'ochre'
                    ? 'text-ochre'
                    : site.categoryTone === 'lapis'
                      ? 'text-lapis'
                      : 'text-forest';
                return (
                  <tr
                    key={site.id}
                    onClick={() => setSelectedArchId(site.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedArchId(site.id);
                      }
                    }}
                    tabIndex={0}
                    aria-selected={isSelected}
                    className={`border-b border-hairline cursor-pointer transition-colors duration-150 ${
                      isSelected ? 'bg-ochre-soft' : 'hover:bg-paper'
                    }`}
                  >
                    <td className="py-4 pr-4 text-sm font-semibold text-ink whitespace-nowrap">
                      {site.name}
                    </td>
                    <td className="py-4 pr-4 text-sm text-ink">{site.region}</td>
                    <td className="py-4 pr-4 font-mono text-xs tabular-nums text-ink whitespace-nowrap">
                      {site.chronology}
                    </td>
                    <td className="py-4 pr-4 text-sm text-ink">{site.trait}</td>
                    <td
                      className={`py-4 font-mono text-xs font-medium whitespace-nowrap ${toneColor}`}
                    >
                      {site.category}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div
          className="bg-paper border-t-2 border-t-rule p-5 flex flex-col gap-2"
          aria-live="polite"
        >
          <div className="font-mono text-xs font-medium text-ochre">{activeArch.kicker}</div>
          <p className="text-sm leading-relaxed text-ink max-w-4xl">{activeArch.text}</p>
        </div>
      </div>
    </section>
  );
}
