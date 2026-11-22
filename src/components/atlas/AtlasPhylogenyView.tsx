import {
  ATLAS_CLADOS,
  ATLAS_TAXONES,
  CLADOS_ORDER,
  PARENTESCO_ADVERTENCIA,
  PARENTESCO_SYNTHESIS,
} from '../../data/atlasPaleo';
import { TaxonDossierCard } from './AtlasChronologyView';

export function AtlasPhylogenyView({
  selectedTaxonId,
  onSelectTaxon,
}: {
  selectedTaxonId: string;
  onSelectTaxon: (id: string) => void;
}) {
  const activeTaxon =
    ATLAS_TAXONES.find((t) => t.id === selectedTaxonId) ?? ATLAS_TAXONES[0];

  const grouped = CLADOS_ORDER.map((cid) => ({
    clado: ATLAS_CLADOS[cid],
    items: ATLAS_TAXONES.filter((t) => t.c === cid).sort((a, b) => b.desde - a.desde),
  }));

  // Compute SVG layout: 5 horizontal clade branches stacked vertically
  const trunkX = 32;
  const branchStartX = 112;
  const svgW = 660;
  let currentY = 30;

  const groupLayouts = grouped.map((g) => {
    const cols = 4;
    const rows = Math.ceil(g.items.length / cols);
    const headerY = currentY;
    const nodesStartY = headerY + 26;
    const blockH = rows * 38 + 26;
    currentY += blockH + 18;
    return { ...g, headerY, nodesStartY, cols };
  });

  const totalH = currentY + 10;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-paper border-t border-b border-hairline px-4 py-3 text-xs leading-relaxed text-ink-muted">
        <span className="font-mono font-medium text-ink mr-2">Advertencia epistémica ·</span>
        {PARENTESCO_ADVERTENCIA}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="border border-hairline bg-canvas p-3 overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgW} ${totalH}`}
              className="w-full h-auto block min-w-[540px]"
              role="img"
              aria-label="Diagrama pedagógico de afinidades convencionales y diversidad de los 52 táxones"
            >
              {/* Main vertical hypothetical evolutionary trunk (dashed to indicate open phylogeny) */}
              <line
                x1={trunkX}
                y1={groupLayouts[0].headerY}
                x2={trunkX}
                y2={groupLayouts[groupLayouts.length - 1].headerY}
                stroke="#8a8a85"
                strokeWidth={1.6}
                strokeDasharray="4 4"
              />

              {groupLayouts.map((g) => {
                const colWidth = (svgW - branchStartX - 16) / g.cols;
                return (
                  <g key={g.clado.id}>
                    {/* Branch connector from trunk */}
                    <line
                      x1={trunkX}
                      y1={g.headerY}
                      x2={branchStartX - 10}
                      y2={g.headerY}
                      stroke={g.clado.color}
                      strokeWidth={1.6}
                      strokeDasharray="3 3"
                    />
                    <circle cx={trunkX} cy={g.headerY} r={3.5} fill={g.clado.color} />
                    <text
                      x={branchStartX - 2}
                      y={g.headerY + 4}
                      className="font-mono"
                      fontSize={11}
                      fontWeight={600}
                      fill={g.clado.color}
                    >
                      {g.clado.nombre} ({g.items.length})
                    </text>

                    {g.items.map((t, idx) => {
                      const col = idx % g.cols;
                      const row = Math.floor(idx / g.cols);
                      const cx = branchStartX + col * colWidth + 8;
                      const cy = g.nodesStartY + row * 38;
                      const isSel = t.id === activeTaxon.id;
                      const shortName = t.n
                        .replace('Australopithecus ', 'Au. ')
                        .replace('Paranthropus ', 'P. ')
                        .replace('Homo ', 'H. ')
                        .replace('Ardipithecus ', 'Ar. ')
                        .replace('Sahelanthropus ', 'S. ')
                        .replace('Kenyanthropus ', 'K. ');

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
                          aria-label={`${t.n}, ${g.clado.nombre}`}
                          className="cursor-pointer"
                        >
                          <rect
                            x={cx - 10}
                            y={cy - 14}
                            width={colWidth - 6}
                            height={30}
                            rx={3}
                            fill={isSel ? '#fdf3ee' : 'transparent'}
                            stroke={isSel ? g.clado.color : 'transparent'}
                            strokeWidth={1.2}
                          />
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isSel ? 5.5 : 4.5}
                            fill={t.debatido ? '#ffffff' : g.clado.color}
                            stroke={g.clado.color}
                            strokeWidth={t.debatido ? 1.8 : 1.2}
                            strokeDasharray={t.debatido ? '2 2' : undefined}
                          />
                          <text
                            x={cx + 10}
                            y={cy + 3}
                            className="font-sans"
                            fontStyle="italic"
                            fontSize={10.5}
                            fontWeight={isSel ? 700 : 400}
                            fill={isSel ? '#121212' : '#3a3a37'}
                          >
                            {shortName.length > 18 ? `${shortName.slice(0, 17)}…` : shortName}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="font-mono text-[11px] text-ink-muted">
            Círculo relleno: posición convencional en el corpus · Círculo con contorno discontinuo:
            posición o validez taxonómica especialmente debatida.
          </p>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <TaxonDossierCard taxon={activeTaxon} />
        </div>
      </div>

      {/* Textual Alternative: Relaciones establecidas y cuestiones abiertas */}
      <div className="pt-5 border-t border-hairline flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h4 className="font-display text-lg font-semibold text-ink">
            Relaciones establecidas y cuestiones abiertas
          </h4>
          <p className="font-mono text-xs text-ink-muted">
            Alternativa textual del diagrama · Distingue lo razonablemente sostenido de lo que
            permanece en debate
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PARENTESCO_SYNTHESIS.map((item) => (
            <div
              key={item.titulo}
              className="border-t border-rule pt-3 flex flex-col gap-1.5"
            >
              <h5 className="font-display text-base font-semibold text-ink">{item.titulo}</h5>
              <p className="text-sm leading-relaxed text-ink-muted">{item.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
