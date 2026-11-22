import { useMemo, useState } from 'react';
import { GitFork, Info, Users } from 'lucide-react';
import {
  KINSHIP_MODELS,
  SOCIAL_ROLE_META,
  type KinshipModelId,
  type KinshipNode,
  type KinshipSocialRole,
} from '../data/kinshipTreeData';
import { GlossaryTermTrigger } from './GlossaryContext';

const TONE_FILL: Record<NonNullable<KinshipNode['highlightTone']>, string> = {
  ochre: '#b43c0b',
  forest: '#156f55',
  lapis: '#1f5fa8',
  plum: '#7d4ca5',
  neutral: '#ffffff',
};

const TONE_STROKE: Record<NonNullable<KinshipNode['highlightTone']>, string> = {
  ochre: '#7e2907',
  forest: '#0d4e3b',
  lapis: '#144277',
  plum: '#543072',
  neutral: '#6e6e68',
};

const ARROW_STROKE: Record<'ochre' | 'lapis' | 'forest' | 'plum', string> = {
  ochre: '#b43c0b',
  lapis: '#1f5fa8',
  forest: '#156f55',
  plum: '#7d4ca5',
};

/**
 * Custom editorial vector glyphs (24x24 coordinate space) representing social roles:
 * - elder: Ancestral wisdom staff & generational sun-arc (ochre #b43c0b)
 * - caregiver: Cupped nurturing hands cradling a central hearth/seed (forest #156f55)
 * - youth: Twin sprouting leaves of prolonged childhood & learning (lapis #1f5fa8)
 */
function SocialRoleGlyphPaths({ role, stroke }: { role: KinshipSocialRole; stroke: string }) {
  if (role === 'elder') {
    return (
      <g
        fill="none"
        stroke={stroke}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Generational sun-arc & three wisdom rays */}
        <path d="M 6.5 11.5 A 5.5 5.5 0 0 1 17.5 11.5" />
        <line x1="12" y1="3" x2="12" y2="5.2" />
        <line x1="6.4" y1="5.6" x2="7.9" y2="7.1" />
        <line x1="17.6" y1="5.6" x2="16.1" y2="7.1" />
        {/* Vertical ancestral staff with horizontal memory notch */}
        <line x1="12" y1="10.5" x2="12" y2="21" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </g>
    );
  }

  if (role === 'caregiver') {
    return (
      <g
        fill="none"
        stroke={stroke}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Central sheltered seed / child dot */}
        <circle cx="12" cy="9.2" r="2.6" fill={stroke} stroke="none" />
        {/* Left & right cradling protective arcs */}
        <path d="M 4.5 11.2 C 4.5 16.2, 8.2 18.8, 12 19.6" />
        <path d="M 19.5 11.2 C 19.5 16.2, 15.8 18.8, 12 19.6" />
        {/* Subtle cooperative bridge line */}
        <path d="M 7.8 14.2 C 9.4 15.5, 14.6 15.5, 16.2 14.2" />
      </g>
    );
  }

  // youth: twin sprouting leaves rising from ground line
  return (
    <g
      fill="none"
      stroke={stroke}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="20.2" x2="12" y2="11.2" />
      <path d="M 12 13.8 C 7.5 13.8, 5.4 10.6, 5.8 6.4 C 9.4 6.4, 11.8 8.7, 12 12.2" />
      <path d="M 12 12.6 C 16.4 12.6, 18.6 9.8, 18.2 5.8 C 14.6 5.8, 12.2 8.2, 12 11.6" />
      <line x1="8.2" y1="20.2" x2="15.8" y2="20.2" />
    </g>
  );
}

function SocialRoleIcon({
  role,
  size = 18,
  className = '',
}: {
  role: KinshipSocialRole;
  size?: number;
  className?: string;
}) {
  const meta = SOCIAL_ROLE_META[role];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <SocialRoleGlyphPaths role={role} stroke={meta.strokeHex} />
    </svg>
  );
}

/**
 * Miniature custom SVG role badge anchored cleanly to the top-right rim of a kinship node.
 */
function NodeRoleBadgeSvg({
  role,
  muted,
}: {
  role: KinshipSocialRole;
  muted?: boolean;
}) {
  const meta = SOCIAL_ROLE_META[role];
  return (
    <g transform="translate(17, -17)" opacity={muted ? 0.35 : 1} aria-hidden="true">
      <circle
        cx="0"
        cy="0"
        r="9.5"
        fill={meta.bgHex}
        stroke={meta.strokeHex}
        strokeWidth="1.3"
      />
      <g transform="translate(-7.2, -7.2) scale(0.6)">
        <SocialRoleGlyphPaths role={role} stroke={meta.strokeHex} />
      </g>
    </g>
  );
}

export function KinshipTreeExplorer() {
  const [activeModelId, setActiveModelId] = useState<KinshipModelId>('abuela');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ab-abuela-mat');
  const [showFlows, setShowFlows] = useState<boolean>(true);
  const [simulateNoGrandmother, setSimulateNoGrandmother] = useState<boolean>(false);
  const [roleHighlight, setRoleHighlight] = useState<KinshipSocialRole | 'todos'>('todos');

  const activeModel = useMemo(
    () => KINSHIP_MODELS.find((m) => m.id === activeModelId) ?? KINSHIP_MODELS[0],
    [activeModelId]
  );

  const selectedNode = useMemo(() => {
    const found = activeModel.nodes.find((n) => n.id === selectedNodeId);
    return found ?? activeModel.nodes[0];
  }, [activeModel, selectedNodeId]);

  const roleCounts = useMemo(() => {
    const counts: Record<KinshipSocialRole, number> = { elder: 0, caregiver: 0, youth: 0 };
    activeModel.nodes.forEach((n) => {
      counts[n.socialRole] += 1;
    });
    return counts;
  }, [activeModel]);

  const handleSelectModel = (modelId: KinshipModelId) => {
    setActiveModelId(modelId);
    setSimulateNoGrandmother(false);
    setRoleHighlight('todos');
    const nextModel = KINSHIP_MODELS.find((m) => m.id === modelId);
    if (nextModel) {
      const preferred = nextModel.nodes.find((n) => n.isEgo) ?? nextModel.nodes[0];
      setSelectedNodeId(modelId === 'abuela' ? 'ab-abuela-mat' : preferred.id);
    }
  };

  const nodeMap = useMemo(() => {
    const map = new Map<string, KinshipNode>();
    activeModel.nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [activeModel]);

  const visibleGenerations = useMemo(() => {
    const seen = new Map<string, number>();
    activeModel.nodes.forEach((n) => {
      if (!seen.has(n.generation)) {
        seen.set(n.generation, n.y);
      }
    });
    return Array.from(seen.entries());
  }, [activeModel]);

  const selectedRoleMeta = SOCIAL_ROLE_META[selectedNode.socialRole];

  return (
    <div className="flex flex-col gap-6">
      {/* Intro framing strip */}
      <div className="bg-paper border border-hairline p-4 sm:p-5 flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-xs text-ochre font-medium">
            <GitFork className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Árbol interactivo de parentesco y estructura social</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-ink-muted">
            <GlossaryTermTrigger termId="teoria-de-la-abuela" tone="ochre">
              Hipótesis de la abuela
            </GlossaryTermTrigger>
            <span aria-hidden="true">·</span>
            <GlossaryTermTrigger termId="parentesco-linaje" tone="forest">
              Sistemas de filiación
            </GlossaryTermTrigger>
            <span aria-hidden="true">·</span>
            <GlossaryTermTrigger termId="tolerancia-social-cooperacion" tone="lapis">
              Tolerancia social primate
            </GlossaryTermTrigger>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-ink m-0">
          Explora visualmente con notación genealógica antropológica estándar (círculo = mujer,
          triángulo = hombre, doble trazo = vínculo conyugal) e iconos vectoriales diferenciados por
          rol social (<strong>ancianos</strong>, <strong>cuidadores</strong> y{' '}
          <strong>jóvenes</strong>) cómo evolucionó la cooperación desde la filopatria primate y la{' '}
          <strong>teoría de la abuela</strong> hasta los sistemas africanos de filiación.
        </p>
      </div>

      {/* Model Selector & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Seleccionar estructura de parentesco"
        >
          {KINSHIP_MODELS.map((model) => {
            const isActive = model.id === activeModel.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => handleSelectModel(model.id)}
                aria-pressed={isActive}
                className={`min-h-[40px] px-3.5 py-2 font-mono text-xs border rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-ink text-white border-ink font-semibold'
                    : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
                }`}
              >
                {model.shortLabel}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFlows((prev) => !prev)}
            aria-pressed={showFlows}
            className={`min-h-[38px] px-3 py-1.5 font-mono text-[11px] border rounded transition-colors whitespace-nowrap cursor-pointer ${
              showFlows
                ? 'bg-paper text-ink border-ink'
                : 'bg-canvas text-ink-muted border-hairline hover:border-ink'
            }`}
          >
            {showFlows ? 'Ocultar flujos de cuidado/herencia' : 'Mostrar flujos de cuidado/herencia'}
          </button>

          {activeModel.supportsGrandmotherToggle && (
            <button
              type="button"
              onClick={() => setSimulateNoGrandmother((prev) => !prev)}
              aria-pressed={simulateNoGrandmother}
              className={`min-h-[38px] px-3 py-1.5 font-mono text-[11px] border rounded transition-colors whitespace-nowrap cursor-pointer ${
                simulateNoGrandmother
                  ? 'bg-ochre text-white border-ochre font-semibold'
                  : 'bg-canvas text-ochre border-ochre/60 hover:border-ochre'
              }`}
            >
              {simulateNoGrandmother
                ? 'Restaurar abuela materna'
                : 'Simular ausencia de abuela'}
            </button>
          )}
        </div>
      </div>

      {/* Social Role Vector Spotlight Bar */}
      <div
        className="flex flex-wrap items-center gap-2 pb-2 border-b border-hairline"
        role="group"
        aria-label="Resaltar nodos por rol social"
      >
        <span className="font-mono text-[11px] text-ink-muted mr-1">Resaltar rol social:</span>
        <button
          type="button"
          onClick={() => setRoleHighlight('todos')}
          aria-pressed={roleHighlight === 'todos'}
          className={`min-h-[36px] px-3 py-1 font-mono text-[11px] border rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            roleHighlight === 'todos'
              ? 'bg-ink text-white border-ink'
              : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
          }`}
        >
          Todos ({activeModel.nodes.length})
        </button>

        {(['elder', 'caregiver', 'youth'] as const).map((role) => {
          const meta = SOCIAL_ROLE_META[role];
          const isActive = roleHighlight === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => setRoleHighlight((prev) => (prev === role ? 'todos' : role))}
              aria-pressed={isActive}
              className={`min-h-[36px] px-3 py-1 font-mono text-[11px] border rounded inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-paper text-ink border-ink font-semibold'
                  : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
              }`}
            >
              <SocialRoleIcon role={role} size={15} />
              <span>
                {meta.pluralLabel} ({roleCounts[role]})
              </span>
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Interactive Tree + Role Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive SVG Kinship Diagram */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-paper border border-hairline p-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2 border-b border-hairline">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-semibold text-ink m-0">
                  {activeModel.title}
                </h3>
                <p className="font-mono text-[11px] text-ink-muted m-0 mt-0.5">
                  {activeModel.ethnographicFocus}
                </p>
              </div>
              <span className="font-mono text-[10.5px] text-ink-muted">
                Pulsa cada símbolo para inspeccionar
              </span>
            </div>

            <svg
              viewBox="0 0 650 406"
              className="w-full h-auto block select-none"
              role="img"
              aria-label={`Diagrama interactivo de parentesco con iconos de roles sociales: ${activeModel.title}`}
            >
              <defs>
                {(['ochre', 'lapis', 'forest', 'plum'] as const).map((tone) => (
                  <marker
                    key={tone}
                    id={`kin-arrow-${tone}`}
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill={ARROW_STROKE[tone]} />
                  </marker>
                ))}
              </defs>

              <rect x="0" y="0" width="650" height="406" fill="#ffffff" />

              {/* Subtle generational guide bands */}
              {visibleGenerations.map(([gen, gy]) => (
                <g key={gen} aria-hidden="true">
                  <line
                    x1="44"
                    y1={gy}
                    x2="634"
                    y2={gy}
                    stroke="#ecece7"
                    strokeWidth="1"
                    strokeDasharray="3 4"
                  />
                  <text
                    x="14"
                    y={gy + 4}
                    fill="#73736e"
                    fontSize="10.5"
                    fontWeight="600"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    {gen}
                  </text>
                </g>
              ))}

              {/* Orthogonal descent & sibling lines */}
              {activeModel.descentSegments.map((seg, idx) => (
                <path
                  key={idx}
                  d={seg.d}
                  fill="none"
                  stroke={seg.emphasized ? '#3f3f3b' : '#b2b2aa'}
                  strokeWidth={seg.emphasized ? '1.8' : '1.3'}
                  strokeDasharray={seg.emphasized ? undefined : '4 3'}
                />
              ))}

              {/* Marriage equal-sign (=) connectors */}
              {activeModel.marriages.map((m) => {
                const a = nodeMap.get(m.fromId);
                const b = nodeMap.get(m.toId);
                if (!a || !b) return null;
                const minX = Math.min(a.x, b.x) + 22;
                const maxX = Math.max(a.x, b.x) - 22;
                const midX = (a.x + b.x) / 2;
                return (
                  <g key={`${m.fromId}-${m.toId}`}>
                    <line x1={minX} y1={a.y - 3} x2={maxX} y2={b.y - 3} stroke="#121212" strokeWidth="1.6" />
                    <line x1={minX} y1={a.y + 3} x2={maxX} y2={b.y + 3} stroke="#121212" strokeWidth="1.6" />
                    {m.label && (
                      <text
                        x={midX}
                        y={a.y - 9}
                        textAnchor="middle"
                        fill="#b43c0b"
                        fontSize="9.5"
                        fontWeight="600"
                        fontFamily="IBM Plex Mono, monospace"
                      >
                        {m.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Care, energy, inheritance & migration flow arrows */}
              {showFlows &&
                activeModel.flowArrows.map((arrow) => {
                  const disabledBySimulation =
                    simulateNoGrandmother && arrow.requiresGrandmother;
                  if (disabledBySimulation) return null;
                  const stroke = ARROW_STROKE[arrow.tone];
                  return (
                    <g key={arrow.id} opacity={roleHighlight === 'todos' ? 1 : 0.45}>
                      <path
                        d={arrow.d}
                        fill="none"
                        stroke={stroke}
                        strokeWidth="1.8"
                        strokeDasharray={arrow.dashed ? '4 3' : undefined}
                        markerEnd={`url(#kin-arrow-${arrow.tone})`}
                      />
                      <text
                        x={arrow.labelX}
                        y={arrow.labelY}
                        textAnchor="middle"
                        fill={stroke}
                        fontSize="9.5"
                        fontWeight="600"
                        fontFamily="IBM Plex Mono, monospace"
                      >
                        {arrow.label}
                      </text>
                    </g>
                  );
                })}

              {/* Interactive anthropological symbols + custom social role vector badges */}
              {activeModel.nodes.map((node) => {
                const isSelected = node.id === selectedNode.id;
                const isAbsentGrandmother =
                  simulateNoGrandmother && node.id === 'ab-abuela-mat';
                const isDimmedByRole =
                  roleHighlight !== 'todos' && node.socialRole !== roleHighlight;
                const tone = node.highlightTone ?? 'neutral';
                const fill = isAbsentGrandmother
                  ? '#f7f7f5'
                  : node.inLineage || tone !== 'neutral'
                    ? TONE_FILL[tone]
                    : '#ffffff';
                const stroke = isAbsentGrandmother
                  ? '#b43c0b'
                  : isSelected
                    ? '#121212'
                    : TONE_STROKE[tone];
                const isFilledDark = !isAbsentGrandmother && fill !== '#ffffff';
                const roleMeta = SOCIAL_ROLE_META[node.socialRole];

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    opacity={isDimmedByRole ? 0.32 : 1}
                    onClick={() => setSelectedNodeId(node.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedNodeId(node.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${node.label} · ${roleMeta.label} (${node.generation})`}
                    className="cursor-pointer focus:outline-none transition-opacity duration-150"
                  >
                    {/* Selection outer ring */}
                    {isSelected && (
                      <circle
                        cx="0"
                        cy="0"
                        r="29"
                        fill="none"
                        stroke="#121212"
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                      />
                    )}

                    {/* EGO double outline */}
                    {node.isEgo &&
                      (node.sex === 'female' ? (
                        <circle
                          cx="0"
                          cy="0"
                          r="23"
                          fill="none"
                          stroke="#121212"
                          strokeWidth="1.4"
                        />
                      ) : (
                        <polygon
                          points="0,-25 -23,18 23,18"
                          fill="none"
                          stroke="#121212"
                          strokeWidth="1.4"
                        />
                      ))}

                    {/* Core anthropological shape */}
                    {node.sex === 'female' ? (
                      <circle
                        cx="0"
                        cy="0"
                        r="18"
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isSelected ? '2.2' : '1.7'}
                        strokeDasharray={isAbsentGrandmother ? '3 2' : undefined}
                      />
                    ) : (
                      <polygon
                        points="0,-20 -19,15 19,15"
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isSelected ? '2.2' : '1.7'}
                      />
                    )}

                    {/* Absent grandmother cross mark when simulating */}
                    {isAbsentGrandmother && (
                      <g stroke="#b43c0b" strokeWidth="1.8" aria-hidden="true">
                        <line x1="-10" y1="-10" x2="10" y2="10" />
                        <line x1="10" y1="-10" x2="-10" y2="10" />
                      </g>
                    )}

                    {/* Compact symbol code inside shape */}
                    {!isAbsentGrandmother && (
                      <text
                        x="0"
                        y={node.sex === 'female' ? '3.5' : '7'}
                        textAnchor="middle"
                        fill={isFilledDark ? '#ffffff' : '#121212'}
                        fontSize="8.5"
                        fontWeight="700"
                        fontFamily="IBM Plex Mono, monospace"
                      >
                        {node.isEgo ? 'EGO' : node.sex === 'female' ? '♀' : '♂'}
                      </text>
                    )}

                    {/* Custom SVG Social Role Vector Badge */}
                    <NodeRoleBadgeSvg role={node.socialRole} muted={isAbsentGrandmother} />

                    {/* Readable label below node */}
                    <text
                      x="0"
                      y="32"
                      textAnchor="middle"
                      fill="#121212"
                      fontSize="10.5"
                      fontWeight={isSelected ? '700' : '500'}
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      {node.shortLabel}
                    </text>
                  </g>
                );
              })}

              {/* Two-row clean legend: Row 1 Anthropological notation, Row 2 Custom Social Role Vector Icons */}
              <g
                transform="translate(16, 362)"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="9.2"
                fill="#5a5a55"
              >
                <line x1="0" y1="-8" x2="618" y2="-8" stroke="#ecece7" strokeWidth="1" />

                {/* Row 1: Standard kinship symbols */}
                <circle cx="6" cy="4" r="4.8" fill="#ffffff" stroke="#121212" strokeWidth="1.2" />
                <text x="15" y="7">Mujer</text>

                <polygon points="68,-1 62,9 74,9" fill="#ffffff" stroke="#121212" strokeWidth="1.2" />
                <text x="80" y="7">Hombre</text>

                <line x1="136" y1="2" x2="150" y2="2" stroke="#121212" strokeWidth="1.3" />
                <line x1="136" y1="6" x2="150" y2="6" stroke="#121212" strokeWidth="1.3" />
                <text x="156" y="7">Alianza</text>

                <rect
                  x="218"
                  y="-1"
                  width="10"
                  height="10"
                  fill={TONE_FILL[activeModel.accentTone]}
                />
                <text x="234" y="7">{activeModel.legendLineageLabel}</text>

                {/* Row 2: Custom SVG social role icons */}
                <g transform="translate(0, 22)">
                  <text x="0" y="7" fill="#121212" fontWeight="600">
                    Roles sociales:
                  </text>

                  {/* Elder legend emblem */}
                  <g transform="translate(108, 3)">
                    <circle cx="0" cy="0" r="8" fill="#fdf3ee" stroke="#b43c0b" strokeWidth="1.1" />
                    <g transform="translate(-6, -6) scale(0.5)">
                      <SocialRoleGlyphPaths role="elder" stroke="#b43c0b" />
                    </g>
                    <text x="13" y="3.5" fill="#b43c0b" fontWeight="600">
                      Anciano/a (bastón solar)
                    </text>
                  </g>

                  {/* Caregiver legend emblem */}
                  <g transform="translate(292, 3)">
                    <circle cx="0" cy="0" r="8" fill="#edf7f3" stroke="#156f55" strokeWidth="1.1" />
                    <g transform="translate(-6, -6) scale(0.5)">
                      <SocialRoleGlyphPaths role="caregiver" stroke="#156f55" />
                    </g>
                    <text x="13" y="3.5" fill="#156f55" fontWeight="600">
                      Cuidador/a (cuidado)
                    </text>
                  </g>

                  {/* Youth legend emblem */}
                  <g transform="translate(462, 3)">
                    <circle cx="0" cy="0" r="8" fill="#eef4fb" stroke="#1f5fa8" strokeWidth="1.1" />
                    <g transform="translate(-6, -6) scale(0.5)">
                      <SocialRoleGlyphPaths role="youth" stroke="#1f5fa8" />
                    </g>
                    <text x="13" y="3.5" fill="#1f5fa8" fontWeight="600">
                      Joven (brote aprendiz)
                    </text>
                  </g>
                </g>
              </g>
            </svg>

            {/* Counterfactual banner when grandmother absence is simulated */}
            {activeModel.supportsGrandmotherToggle && simulateNoGrandmother && (
              <div className="bg-canvas border border-ochre p-3.5 text-xs leading-relaxed text-ink flex items-start gap-2.5">
                <Users className="w-4 h-4 text-ochre shrink-0 mt-0.5" aria-hidden="true" />
                <p className="m-0">
                  <strong>Simulación contrafactual (sin apoyo de la abuela):</strong> al desaparecer
                  el flujo energético de tubérculos y supervisión infantil de G+2, la madre debe
                  prolongar la lactancia y el forrajeo directo para el hijo mayor (EGO),{' '}
                  <span className="text-ochre font-medium">
                    alargando el intervalo entre partos hacia niveles propios de grandes simios
                    (~5–6 años)
                  </span>{' '}
                  y reduciendo la supervivencia juvenil en épocas de escasez.
                </p>
              </div>
            )}
          </div>

          {/* 3-Column Key Structural Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {activeModel.keyMetrics.map((metric) => (
              <div
                key={metric.label}
                className="border-t border-rule pt-2.5 flex flex-col gap-1 bg-canvas"
              >
                <span className="font-mono text-[10.5px] text-ink-muted">{metric.label}</span>
                <span className="font-mono text-base font-semibold text-ink">{metric.value}</span>
                <span className="text-xs leading-snug text-ink-muted">{metric.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Node Anthropological Dossier */}
        <aside
          className="lg:col-span-5 bg-paper border border-hairline p-5 flex flex-col gap-4"
          aria-live="polite"
        >
          <div className="flex items-start gap-3.5 pb-3 border-b border-hairline">
            <div
              className="w-11 h-11 shrink-0 border flex items-center justify-center rounded"
              style={{
                backgroundColor: selectedRoleMeta.bgHex,
                borderColor: selectedRoleMeta.strokeHex,
              }}
              aria-hidden="true"
            >
              <SocialRoleIcon role={selectedNode.socialRole} size={24} />
            </div>

            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                <span className={`font-semibold ${selectedRoleMeta.textClass}`}>
                  {selectedRoleMeta.label} · {selectedNode.generation}
                </span>
                <span className="text-ink-muted">
                  {selectedNode.sex === 'female' ? '○ mujer' : '△ hombre'}
                </span>
              </div>
              <h4 className="font-display text-xl font-semibold text-ink m-0 leading-snug">
                {selectedNode.label}
              </h4>
              <span className="font-mono text-xs text-lapis font-medium">
                {selectedNode.statusTag}
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-ink m-0">{selectedNode.roleSummary}</p>

          <dl className="flex flex-col gap-3.5 m-0 text-xs leading-relaxed">
            <div className="bg-canvas border border-hairline p-3">
              <dt className="font-mono text-[11px] tracking-wide text-forest font-semibold mb-1">
                Función evolutiva o social
              </dt>
              <dd className="text-ink m-0">{selectedNode.evolutionaryOrSocialFunction}</dd>
            </div>

            <div className="bg-canvas border border-hairline p-3">
              <dt className="font-mono text-[11px] tracking-wide text-ochre font-semibold mb-1">
                Flujos que aporta o recibe
              </dt>
              <dd className="text-ink m-0">{selectedNode.flowsProvidedOrReceived}</dd>
            </div>

            <div className="bg-canvas border border-hairline p-3">
              <dt className="font-mono text-[11px] tracking-wide text-lapis font-semibold mb-1">
                Anclaje etnográfico africano
              </dt>
              <dd className="text-ink m-0">{selectedNode.ethnographicAnchor}</dd>
            </div>
          </dl>

          {/* Quick model synthesis & citation */}
          <div className="pt-3 border-t border-hairline flex flex-col gap-2">
            <div className="flex items-start gap-2 text-xs leading-relaxed text-ink-muted">
              <Info className="w-3.5 h-3.5 text-ink-subtle shrink-0 mt-0.5" aria-hidden="true" />
              <p className="m-0">{activeModel.overview}</p>
            </div>
            <span className="font-mono text-[10.5px] text-ink-subtle">
              Referencias: {activeModel.references}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
