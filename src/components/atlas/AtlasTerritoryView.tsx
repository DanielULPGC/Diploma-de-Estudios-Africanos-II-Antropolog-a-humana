import { useMemo, useState } from 'react';
import { ATLAS_REGIONES, ATLAS_TAXONES } from '../../data/atlasPaleo';
import { AFRICA_VECTOR_MAP } from '../../data/africaMapData';
import { TaxonDossierCard } from './AtlasChronologyView';

// Afro-Eurasia projection: Lon -20 to 140 (span 160), Lat 60 to -38 (span 98)
function projectAfroEurasia(lat: number, lon: number) {
  const x = 30 + ((lon - -20) / 160) * 600;
  const y = 24 + ((60 - lat) / 98) * 332;
  return { x, y };
}

// Natural Earth 1:50m projection from ULPGC DEA: x = lon + 20, y = 38 - lat
function projectAfricaNE(lat: number, lon: number) {
  return { x: lon + 20, y: 38 - lat };
}

// East African Rift inset box (matching ULPGC dea.js RECUADRO)
const RIFT_BOX = { x0: 53, y0: 25.5, width: 9, height: 16, k: 2.5 };

export function AtlasTerritoryView({
  selectedTaxonId,
  onSelectTaxon,
}: {
  selectedTaxonId: string;
  onSelectTaxon: (id: string) => void;
}) {
  const [mapMode, setMapMode] = useState<'africa-ne' | 'afroeurasia'>('africa-ne');

  const regionsList = useMemo(() => {
    return Object.values(ATLAS_REGIONES)
      .map((reg) => ({
        ...reg,
        taxones: ATLAS_TAXONES.filter((t) => t.region === reg.id).sort(
          (a, b) => b.desde - a.desde
        ),
      }))
      .sort((a, b) => {
        if (a.esAfrica !== b.esAfrica) return a.esAfrica ? -1 : 1;
        return b.taxones.length - a.taxones.length;
      });
  }, []);

  const africanRegions = useMemo(
    () => regionsList.filter((r) => r.esAfrica),
    [regionsList]
  );

  // Separate overlapping Rift points gently for the x2.5 inset
  const riftPoints = useMemo(() => {
    const inside = africanRegions
      .map((reg, idx) => {
        const pt = projectAfricaNE(reg.lat, reg.lon);
        const inBox =
          pt.x >= RIFT_BOX.x0 &&
          pt.x <= RIFT_BOX.x0 + RIFT_BOX.width &&
          pt.y >= RIFT_BOX.y0 &&
          pt.y <= RIFT_BOX.y0 + RIFT_BOX.height;
        return {
          reg,
          num: idx + 1,
          rawX: (pt.x - RIFT_BOX.x0) * RIFT_BOX.k,
          rawY: (pt.y - RIFT_BOX.y0) * RIFT_BOX.k,
          x: (pt.x - RIFT_BOX.x0) * RIFT_BOX.k,
          y: (pt.y - RIFT_BOX.y0) * RIFT_BOX.k,
          inBox,
        };
      })
      .filter((p) => p.inBox);

    const minDist = 3.6;
    for (let iter = 0; iter < 80; iter++) {
      let moved = false;
      for (let i = 0; i < inside.length; i++) {
        for (let j = i + 1; j < inside.length; j++) {
          const dx = inside[j].x - inside[i].x;
          const dy = inside[j].y - inside[i].y;
          const dist = Math.hypot(dx, dy) || 0.01;
          if (dist < minDist) {
            const push = (minDist - dist) / 2;
            const ux = dx / dist;
            const uy = dy / dist;
            inside[i].x -= ux * push;
            inside[i].y -= uy * push;
            inside[j].x += ux * push;
            inside[j].y += uy * push;
            moved = true;
          }
        }
      }
      if (!moved) break;
    }
    return inside;
  }, [africanRegions]);

  const [selectedRegionId, setSelectedRegionId] = useState<string>('turkana');
  const activeRegion =
    regionsList.find((r) => r.id === selectedRegionId) ?? regionsList[0];

  const activeTaxon =
    ATLAS_TAXONES.find((t) => t.id === selectedTaxonId) ??
    activeRegion.taxones[0] ??
    ATLAS_TAXONES[0];

  const africaCount = ATLAS_TAXONES.filter(
    (t) => ATLAS_REGIONES[t.region]?.esAfrica
  ).length;
  const eurasiaCount = ATLAS_TAXONES.length - africaCount;
  const equatorY = projectAfroEurasia(0, 0).y;

  const selectRegion = (id: string) => {
    setSelectedRegionId(id);
    const found = regionsList.find((r) => r.id === id);
    if (found && !found.esAfrica && mapMode === 'africa-ne') {
      setMapMode('afroeurasia');
    }
    if (found?.taxones[0]) onSelectTaxon(found.taxones[0].id);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-paper border-t border-b border-hairline px-4 py-3 text-xs">
        <div className="text-ink">
          <span className="font-mono font-medium text-ochre mr-2">
            Centralidad africana del registro ·
          </span>
          De las {ATLAS_TAXONES.length} entradas del corpus,{' '}
          <strong className="font-mono tabular-nums">{africaCount}</strong> se documentan en 12
          regiones africanas (ocre) y{' '}
          <strong className="font-mono tabular-nums">{eurasiaCount}</strong> en 12 regiones de
          Eurasia y el Sudeste Asiático (lapislázuli).
        </div>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Modo de mapa">
          <button
            type="button"
            onClick={() => setMapMode('africa-ne')}
            aria-pressed={mapMode === 'africa-ne'}
            className={`min-h-[40px] px-3.5 py-1.5 text-xs font-medium rounded border cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              mapMode === 'africa-ne'
                ? 'bg-ink text-white border-ink'
                : 'bg-canvas text-ink border-hairline hover:border-ink'
            }`}
          >
            África, Canarias y Rift (Natural Earth)
          </button>
          <button
            type="button"
            onClick={() => setMapMode('afroeurasia')}
            aria-pressed={mapMode === 'afroeurasia'}
            className={`min-h-[40px] px-3.5 py-1.5 text-xs font-medium rounded border cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              mapMode === 'afroeurasia'
                ? 'bg-ink text-white border-ink'
                : 'bg-canvas text-ink border-hairline hover:border-ink'
            }`}
          >
            Afroeurasia (24 regiones)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-4">
          {mapMode === 'africa-ne' ? (
            <div className="border border-hairline bg-canvas p-4 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Main Africa + Canarias Natural Earth 1:50m SVG */}
                <div className="sm:col-span-8">
                  <svg
                    viewBox={AFRICA_VECTOR_MAP.viewBox}
                    className="w-full h-auto block max-h-[390px]"
                    role="img"
                    aria-label="Mapa vectorial Natural Earth 1:50m de África y Canarias con las 12 regiones fosilíferas africanas"
                  >
                    <rect x={0} y={0} width={75} height={76} fill="#f7f7f5" />
                    <path
                      d={AFRICA_VECTOR_MAP.africa}
                      fill="#ebe9e2"
                      stroke="#9e9c94"
                      strokeWidth={0.28}
                    />
                    <path
                      d={AFRICA_VECTOR_MAP.canarias}
                      fill="#d95216"
                      fillOpacity={0.35}
                      stroke="#b43c0b"
                      strokeWidth={0.24}
                    />

                    {/* Canarias label & leader line */}
                    <line
                      x1={3.6}
                      y1={4.1}
                      x2={3.6}
                      y2={8.6}
                      stroke="#73736e"
                      strokeWidth={0.22}
                      strokeDasharray="0.6 0.5"
                    />
                    <text
                      x={0.8}
                      y={3.2}
                      fontSize={2.2}
                      className="font-mono"
                      fill="#5f5f5a"
                    >
                      Canarias
                    </text>

                    {/* East African Rift highlight box */}
                    <rect
                      x={RIFT_BOX.x0}
                      y={RIFT_BOX.y0}
                      width={RIFT_BOX.width}
                      height={RIFT_BOX.height}
                      fill="#d95216"
                      fillOpacity={0.08}
                      stroke="#b43c0b"
                      strokeWidth={0.35}
                      strokeDasharray="0.9 0.6"
                    />

                    {/* 12 African regions plotted */}
                    {africanRegions.map((reg, idx) => {
                      const { x, y } = projectAfricaNE(reg.lat, reg.lon);
                      const isSel = reg.id === activeRegion.id;
                      const num = idx + 1;
                      return (
                        <g
                          key={reg.id}
                          onClick={() => selectRegion(reg.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              selectRegion(reg.id);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={`${num}. ${reg.nombre}: ${reg.taxones.length} táxones`}
                          className="cursor-pointer"
                        >
                          <title>{`${num}. ${reg.nombre} (${reg.taxones.length})`}</title>
                          {isSel && (
                            <circle
                              cx={x}
                              cy={y}
                              r={3.1}
                              fill="none"
                              stroke="#121212"
                              strokeWidth={0.45}
                            />
                          )}
                          <circle
                            cx={x}
                            cy={y}
                            r={2.05}
                            fill={isSel ? '#121212' : '#d95216'}
                            stroke="#ffffff"
                            strokeWidth={0.3}
                          />
                          <text
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={1.7}
                            fontWeight={700}
                            fill="#ffffff"
                            className="font-mono pointer-events-none"
                          >
                            {num}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Zoomed Inset: Ampliación del Rift Oriental (×2,5) */}
                <div className="sm:col-span-4 flex flex-col gap-2 bg-paper border border-hairline p-2.5">
                  <div className="font-mono text-[10px] font-semibold text-ochre leading-tight">
                    Ampliación · Rift Oriental (×2,5)
                  </div>
                  <svg
                    viewBox={`0 0 ${RIFT_BOX.width * RIFT_BOX.k} ${RIFT_BOX.height * RIFT_BOX.k}`}
                    className="w-full h-auto block bg-[#f7f7f5] border border-hairline"
                    role="img"
                    aria-label="Ampliación del Valle del Rift Oriental a escala 2,5x"
                  >
                    <g
                      transform={`scale(${RIFT_BOX.k}) translate(${-RIFT_BOX.x0} ${-RIFT_BOX.y0})`}
                      aria-hidden="true"
                    >
                      <path
                        d={AFRICA_VECTOR_MAP.africa}
                        fill="#ebe9e2"
                        stroke="#9e9c94"
                        strokeWidth={0.14}
                      />
                    </g>

                    {riftPoints.map((pt) => {
                      const isSel = pt.reg.id === activeRegion.id;
                      return (
                        <g
                          key={pt.reg.id}
                          onClick={() => selectRegion(pt.reg.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              selectRegion(pt.reg.id);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={`${pt.num}. ${pt.reg.nombre} (Rift)`}
                          className="cursor-pointer"
                        >
                          <title>{`${pt.num}. ${pt.reg.nombre}`}</title>
                          <line
                            x1={pt.rawX}
                            y1={pt.rawY}
                            x2={pt.x}
                            y2={pt.y}
                            stroke="#73736e"
                            strokeWidth={0.22}
                          />
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={1.65}
                            fill={isSel ? '#121212' : '#d95216'}
                            stroke="#ffffff"
                            strokeWidth={0.25}
                          />
                          <text
                            x={pt.x}
                            y={pt.y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={1.45}
                            fontWeight={700}
                            fill="#ffffff"
                            className="font-mono pointer-events-none"
                          >
                            {pt.num}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  <p className="font-mono text-[10px] leading-snug text-ink-muted">
                    Separa las cuencas próximas del Afar, Omo, Turkana, Tugen, Nakali y Victoria.
                  </p>
                </div>
              </div>

              {/* Numbered legend for the 12 African regions */}
              <div className="pt-3 border-t border-hairline flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[11px]">
                {africanRegions.map((reg, idx) => {
                  const isSel = reg.id === activeRegion.id;
                  return (
                    <button
                      key={reg.id}
                      type="button"
                      onClick={() => selectRegion(reg.id)}
                      className={`text-left cursor-pointer hover:text-ochre ${
                        isSel ? 'text-ink font-semibold underline underline-offset-2' : 'text-ink-muted'
                      }`}
                    >
                      <span className="text-ochre">{idx + 1}.</span> {reg.nombre} ({reg.taxones.length})
                    </button>
                  );
                })}
              </div>

              <p className="font-mono text-[10px] text-ink-muted">
                Cartografía: {AFRICA_VECTOR_MAP.nota}
              </p>
            </div>
          ) : (
            <div className="border border-hairline bg-canvas p-3">
              <svg
                viewBox="0 0 660 385"
                className="w-full h-auto block"
                role="img"
                aria-label="Mapa esquemático de las 24 regiones fosilíferas de África, Eurasia y el Sudeste Asiático"
              >
                <rect x={20} y={14} width={620} height={352} fill="#f7f7f5" stroke="#e2e2dd" />

                {[40, 20, 0, -20].map((lat) => {
                  const { y } = projectAfroEurasia(lat, 0);
                  return (
                    <g key={lat}>
                      <line
                        x1={20}
                        y1={y}
                        x2={640}
                        y2={y}
                        stroke={lat === 0 ? '#c8c8c2' : '#e8e8e4'}
                        strokeWidth={lat === 0 ? 1.2 : 1}
                        strokeDasharray={lat === 0 ? '4 3' : '2 4'}
                      />
                      <text
                        x={26}
                        y={y - 4}
                        className="font-mono"
                        fontSize={9.5}
                        fill="#73736e"
                      >
                        {lat === 0 ? 'Ecuador 0°' : `${lat > 0 ? `${lat}°N` : `${Math.abs(lat)}°S`}`}
                      </text>
                    </g>
                  );
                })}

                <path
                  d="M 70 116 L 105 104 L 155 110 L 210 124 L 236 128 L 252 162 L 292 184 L 270 225 L 256 270 L 232 318 L 195 344 L 166 320 L 155 274 L 146 232 L 106 218 L 76 206 L 54 176 L 56 144 Z"
                  fill="#edece7"
                  stroke="#b8b7b0"
                  strokeWidth={1.1}
                />
                <path
                  d="M 76 92 L 100 72 L 148 54 L 214 48 L 308 38 L 440 36 L 548 50 L 584 90 L 552 130 L 516 146 L 486 138 L 456 168 L 418 158 L 392 192 L 368 156 L 328 164 L 288 180 L 258 148 L 242 122 L 214 114 L 196 96 L 148 92 L 112 96 Z"
                  fill="#f0f0ec"
                  stroke="#c6c5be"
                  strokeWidth={1}
                />
                <path
                  d="M 488 214 L 545 232 L 582 238 M 552 160 L 568 188"
                  fill="none"
                  stroke="#c6c5be"
                  strokeWidth={4}
                  strokeLinecap="round"
                />

                <text
                  x={148}
                  y={equatorY + 34}
                  className="font-mono"
                  fontSize={10.5}
                  fontWeight={600}
                  fill="#8a867e"
                  letterSpacing={1.5}
                >
                  ÁFRICA
                </text>
                <text
                  x={365}
                  y={82}
                  className="font-mono"
                  fontSize={10}
                  fill="#8a867e"
                  letterSpacing={1.5}
                >
                  EURASIA
                </text>

                {regionsList.map((reg) => {
                  const { x, y } = projectAfroEurasia(reg.lat, reg.lon);
                  const isSel = reg.id === activeRegion.id;
                  const radius = Math.min(11, 4.5 + reg.taxones.length * 0.9);
                  const color = reg.esAfrica ? '#d95216' : '#1f5fa8';

                  return (
                    <g
                      key={reg.id}
                      onClick={() => selectRegion(reg.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          selectRegion(reg.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${reg.nombre}: ${reg.taxones.length} táxones`}
                      className="cursor-pointer"
                    >
                      {isSel && (
                        <circle
                          cx={x}
                          cy={y}
                          r={radius + 5}
                          fill="none"
                          stroke={color}
                          strokeWidth={1.6}
                        />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={radius}
                        fill={color}
                        fillOpacity={isSel ? 1 : 0.78}
                        stroke="#ffffff"
                        strokeWidth={1.2}
                      />
                      {isSel && (
                        <text
                          x={x > 460 ? x - radius - 8 : x + radius + 8}
                          y={y + 4}
                          textAnchor={x > 460 ? 'end' : 'start'}
                          className="font-mono"
                          fontSize={10.5}
                          fontWeight={600}
                          fill="#121212"
                        >
                          {reg.nombre}
                        </text>
                      )}
                    </g>
                  );
                })}

                <text x={24} y={379} className="font-mono" fontSize={10} fill="#73736e">
                  Coordenadas orientativas del corpus ULPGC · Radio proporcional al número de táxones
                </text>
              </svg>
            </div>
          )}

          {/* Selected Region Taxa Panel */}
          <div className="bg-paper border-t-2 border-t-rule p-5 flex flex-col gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <div
                  className={`font-mono text-xs font-medium ${
                    activeRegion.esAfrica ? 'text-ochre' : 'text-lapis'
                  }`}
                >
                  {activeRegion.continente} · {activeRegion.lat.toFixed(1)}°,{' '}
                  {activeRegion.lon.toFixed(1)}°
                </div>
                <h4 className="font-display text-lg font-semibold text-ink">
                  {activeRegion.nombre}
                </h4>
              </div>
              <span className="font-mono text-xs text-ink-muted tabular-nums">
                {activeRegion.taxones.length}{' '}
                {activeRegion.taxones.length === 1 ? 'entrada' : 'entradas'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeRegion.taxones.map((t) => {
                const isSel = t.id === activeTaxon.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectTaxon(t.id)}
                    className={`min-h-[36px] px-3 py-1 text-xs italic rounded border transition-colors cursor-pointer ${
                      isSel
                        ? 'bg-ink text-white border-ink font-medium'
                        : 'bg-canvas text-ink border-hairline hover:border-ink'
                    }`}
                  >
                    {t.n}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Full Taxon Dossier */}
        <div className="lg:col-span-5 lg:sticky lg:top-20">
          <TaxonDossierCard taxon={activeTaxon} />
        </div>
      </div>

      {/* Accessible Text Table of all 24 Regions */}
      <div className="pt-4 border-t border-hairline overflow-x-auto">
        <table
          className="w-full border-collapse text-left text-xs"
          aria-label="Tabla completa de las 24 regiones fosilíferas del atlas"
        >
          <thead>
            <tr className="border-b border-rule font-mono text-ink-muted">
              <th className="py-2.5 pr-4 font-medium whitespace-nowrap">Región</th>
              <th className="py-2.5 pr-4 font-medium whitespace-nowrap">Ámbito</th>
              <th className="py-2.5 pr-4 font-medium whitespace-nowrap">Entradas</th>
              <th className="py-2.5 font-medium">Táxones documentados</th>
            </tr>
          </thead>
          <tbody>
            {regionsList.map((reg) => {
              const isSel = reg.id === activeRegion.id;
              return (
                <tr
                  key={reg.id}
                  onClick={() => selectRegion(reg.id)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      selectRegion(reg.id);
                    }
                  }}
                  className={`border-b border-hairline cursor-pointer transition-colors ${
                    isSel ? 'bg-ochre-soft' : 'hover:bg-paper'
                  }`}
                >
                  <td className="py-2.5 pr-4 font-medium text-ink whitespace-nowrap">
                    {reg.nombre}
                  </td>
                  <td
                    className={`py-2.5 pr-4 font-mono whitespace-nowrap ${
                      reg.esAfrica ? 'text-ochre' : 'text-lapis'
                    }`}
                  >
                    {reg.continente}
                  </td>
                  <td className="py-2.5 pr-4 font-mono tabular-nums text-ink">
                    {reg.taxones.length}
                  </td>
                  <td className="py-2.5 text-ink-muted italic">
                    {reg.taxones.map((t) => t.n).join(' · ')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
