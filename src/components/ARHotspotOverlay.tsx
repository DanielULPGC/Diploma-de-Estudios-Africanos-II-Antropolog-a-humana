import { useEffect, useMemo, useRef } from 'react';
import {
  ArrowDownRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  X,
} from 'lucide-react';
import { findGlossaryTerm, type GlossaryTerm } from '../data/glossary';
import { useGlossary } from './GlossaryContext';

export interface ARHotspotPayload {
  id: string;
  arCode?: string;
  shortLabel?: string;
  title: string;
  subtitle: string;
  accent: string;
  detail: string;
  evidence?: string;
  glossaryTermIds?: string[];
}

export interface ProjectedARPoint {
  id: string;
  x: number;
  y: number;
  visible: boolean;
}

export interface ARHotspotOverlayProps {
  hotspots: ARHotspotPayload[];
  projectedPoints: ProjectedARPoint[];
  viewportSize: { width: number; height: number };
  activeHotspotId: string | null;
  hoveredHotspotId?: string | null;
  isPanelOpen: boolean;
  showSpatialPins: boolean;
  theme?: 'light' | 'dark';
  sceneLabel: string;
  onActivateHotspot: (hotspotId: string) => void;
  onClosePanel: () => void;
}

interface RelaxedCalloutLayout {
  hotspot: ARHotspotPayload;
  index: number;
  code: string;
  displayLabel: string;
  pt: ProjectedARPoint;
  side: 'left' | 'right';
  chipEdgeX: number;
  chipY: number;
}

function relaxVerticalLane(
  items: Array<{ id: string; desiredY: number }>,
  minY: number,
  maxY: number,
  minGap: number
): Map<string, number> {
  const result = new Map<string, number>();
  if (items.length === 0) return result;

  const sorted = [...items].sort((a, b) => a.desiredY - b.desiredY);
  const ys = sorted.map((it) => Math.max(minY, Math.min(maxY, it.desiredY)));

  // Forward pass: push overlapping chips downward
  for (let i = 1; i < ys.length; i++) {
    if (ys[i] - ys[i - 1] < minGap) {
      ys[i] = ys[i - 1] + minGap;
    }
  }

  // Backward pass: clamp to bottom safe edge and gently push upward if needed
  if (ys[ys.length - 1] > maxY) {
    ys[ys.length - 1] = maxY;
    for (let i = ys.length - 2; i >= 0; i--) {
      if (ys[i + 1] - ys[i] < minGap) {
        ys[i] = ys[i + 1] - minGap;
      }
    }
  }

  // Final clamp safety
  for (let i = 0; i < sorted.length; i++) {
    result.set(sorted[i].id, Math.max(minY, Math.min(maxY, ys[i])));
  }
  return result;
}

export function ARHotspotOverlay({
  hotspots,
  projectedPoints,
  viewportSize,
  activeHotspotId,
  hoveredHotspotId = null,
  isPanelOpen,
  showSpatialPins,
  theme = 'light',
  sceneLabel,
  onActivateHotspot,
  onClosePanel,
}: ARHotspotOverlayProps) {
  const { jumpToGlossary } = useGlossary();

  const pointById = useMemo(() => {
    const map = new Map<string, ProjectedARPoint>();
    projectedPoints.forEach((p) => map.set(p.id, p));
    return map;
  }, [projectedPoints]);

  const activeIndex = useMemo(
    () => (activeHotspotId ? hotspots.findIndex((h) => h.id === activeHotspotId) : -1),
    [hotspots, activeHotspotId]
  );

  const activeHotspot = activeIndex >= 0 ? hotspots[activeIndex] : null;
  const activePoint = activeHotspot ? pointById.get(activeHotspot.id) ?? null : null;

  const resolvedGlossaryTerms = useMemo<GlossaryTerm[]>(() => {
    if (!activeHotspot?.glossaryTermIds?.length) return [];
    const unique: GlossaryTerm[] = [];
    const seen = new Set<string>();
    activeHotspot.glossaryTermIds.forEach((id) => {
      const found = findGlossaryTerm(id);
      if (found && !seen.has(found.id)) {
        seen.add(found.id);
        unique.push(found);
      }
    });
    return unique;
  }, [activeHotspot]);

  const asideRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const wasPanelOpenRef = useRef(false);

  // Move keyboard focus into emergent AR side panel when opened & restore on close
  useEffect(() => {
    if (isPanelOpen && !wasPanelOpenRef.current) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      requestAnimationFrame(() => {
        asideRef.current?.focus();
      });
    } else if (!isPanelOpen && wasPanelOpenRef.current) {
      const prev = previousFocusRef.current;
      previousFocusRef.current = null;
      if (prev && typeof prev.focus === 'function' && document.contains(prev)) {
        requestAnimationFrame(() => prev.focus());
      }
    }
    wasPanelOpenRef.current = isPanelOpen;
  }, [isPanelOpen]);

  // Close emergent AR side panel cleanly on Escape (capture phase avoids cascading outer closes)
  useEffect(() => {
    if (!isPanelOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) {
        e.preventDefault();
        e.stopImmediatePropagation();
        onClosePanel();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [isPanelOpen, onClosePanel]);

  const isDark = theme === 'dark';
  const drawerWidth = Math.min(368, Math.max(264, viewportSize.width - 24));
  const drawerLeftX = Math.max(12, viewportSize.width - drawerWidth - 12);
  const drawerAnchorY = Math.min(Math.max(88, viewportSize.height * 0.28), viewportSize.height - 96);

  const canDrawSideTether =
    isPanelOpen &&
    Boolean(activeHotspot) &&
    Boolean(activePoint?.visible) &&
    viewportSize.width >= 560 &&
    (activePoint?.x ?? 0) < drawerLeftX - 18;

  // Compute collision-free left/right spatial callout layout for all visible 3D pins
  const calloutLayouts = useMemo<RelaxedCalloutLayout[]>(() => {
    if (!showSpatialPins || viewportSize.width < 120 || viewportSize.height < 120) return [];

    const visibleEntries: Array<{
      hotspot: ARHotspotPayload;
      index: number;
      pt: ProjectedARPoint;
    }> = [];

    hotspots.forEach((hotspot, index) => {
      const pt = pointById.get(hotspot.id);
      if (!pt || !pt.visible) return;
      if (pt.y < 14 || pt.y > viewportSize.height - 14) return;
      if (pt.x < 14 || pt.x > viewportSize.width - 14) return;
      if (isPanelOpen && viewportSize.width >= 560 && pt.x > drawerLeftX - 24) return;
      visibleEntries.push({ hotspot, index, pt });
    });

    if (visibleEntries.length === 0) return [];

    const isNarrow = viewportSize.width < 640;
    const estChipWidth = isNarrow ? 82 : 244;
    const centerX = viewportSize.width * 0.5;
    const safeMinY = 24;
    const safeMaxY = Math.max(safeMinY + 24, viewportSize.height - 24);
    const minGap = isNarrow ? 34 : 40;

    // Sort top-to-bottom to alternate cleanly when nodes share a central axis (e.g., skeleton spine)
    const sortedByY = [...visibleEntries].sort((a, b) => a.pt.y - b.pt.y);
    let centralAltToggle = 0;

    const leftLane: Array<{ id: string; desiredY: number }> = [];
    const rightLane: Array<{ id: string; desiredY: number }> = [];
    const sideById = new Map<string, 'left' | 'right'>();

    sortedByY.forEach(({ hotspot, pt }) => {
      let side: 'left' | 'right';
      if (isPanelOpen && viewportSize.width >= 560) {
        // When right drawer is open, prefer left side unless reticle is very close to left wall
        side = pt.x > estChipWidth + 32 ? 'left' : 'right';
      } else if (pt.x < centerX - 44 && pt.x > estChipWidth + 24) {
        side = 'left';
      } else if (pt.x > centerX + 44 && viewportSize.width - pt.x > estChipWidth + 24) {
        side = 'right';
      } else {
        // Central axis node: alternate left / right like an anatomical museum plate
        const preferLeft = centralAltToggle % 2 === 0;
        centralAltToggle += 1;
        if (preferLeft && pt.x > estChipWidth + 22) {
          side = 'left';
        } else if (!preferLeft && viewportSize.width - pt.x > estChipWidth + 22) {
          side = 'right';
        } else {
          side = pt.x >= centerX ? 'left' : 'right';
        }
      }

      sideById.set(hotspot.id, side);
      if (side === 'left') {
        leftLane.push({ id: hotspot.id, desiredY: pt.y });
      } else {
        rightLane.push({ id: hotspot.id, desiredY: pt.y });
      }
    });

    const leftYMap = relaxVerticalLane(leftLane, safeMinY, safeMaxY, minGap);
    const rightYMap = relaxVerticalLane(rightLane, safeMinY, safeMaxY, minGap);

    const leadOffset = isNarrow ? 24 : 38;
    const maxAllowedRightEdge =
      isPanelOpen && viewportSize.width >= 560 ? drawerLeftX - 14 : viewportSize.width - 12;

    return visibleEntries.map(({ hotspot, index, pt }) => {
      const side = sideById.get(hotspot.id) ?? 'right';
      const chipY = (side === 'left' ? leftYMap.get(hotspot.id) : rightYMap.get(hotspot.id)) ?? pt.y;

      let chipEdgeX: number;
      if (side === 'left') {
        chipEdgeX = Math.max(estChipWidth + 12, pt.x - leadOffset);
      } else {
        chipEdgeX = Math.min(maxAllowedRightEdge - estChipWidth, pt.x + leadOffset);
        chipEdgeX = Math.max(pt.x + 22, chipEdgeX);
      }

      return {
        hotspot,
        index,
        code: hotspot.arCode ?? `RA-0${index + 1}`,
        displayLabel: hotspot.shortLabel ?? hotspot.title,
        pt,
        side,
        chipEdgeX,
        chipY,
      };
    });
  }, [hotspots, pointById, showSpatialPins, viewportSize, isPanelOpen, drawerLeftX]);

  const handleStep = (delta: number) => {
    if (hotspots.length === 0) return;
    const base = activeIndex >= 0 ? activeIndex : 0;
    const nextIdx = (base + delta + hotspots.length) % hotspots.length;
    onActivateHotspot(hotspots[nextIdx].id);
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* 1. Real-Time Projected SVG AR Reticles, Callout Leader Ticks & Active Drawer Tether */}
      {viewportSize.width > 0 && viewportSize.height > 0 && (
        <svg
          width={viewportSize.width}
          height={viewportSize.height}
          viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          {/* Active AR Leader Line connecting 3D hotspot point directly to the emergent side window */}
          {canDrawSideTether && activeHotspot && activePoint && (
            <g>
              {(() => {
                const elbowX = Math.min(
                  drawerLeftX - 24,
                  activePoint.x + Math.max(36, (drawerLeftX - activePoint.x) * 0.45)
                );
                const elbowY = drawerAnchorY;
                const pointsStr = `${activePoint.x.toFixed(1)},${activePoint.y.toFixed(1)} ${elbowX.toFixed(1)},${elbowY.toFixed(1)} ${drawerLeftX.toFixed(1)},${elbowY.toFixed(1)}`;
                return (
                  <>
                    <polyline
                      points={pointsStr}
                      fill="none"
                      stroke={isDark ? '#0b0e14' : '#ffffff'}
                      strokeWidth="3.5"
                      strokeLinejoin="miter"
                      opacity="0.78"
                    />
                    <polyline
                      points={pointsStr}
                      fill="none"
                      stroke={activeHotspot.accent}
                      strokeWidth="1.6"
                      strokeDasharray="5 3"
                      strokeLinejoin="miter"
                    />
                    <circle
                      cx={drawerLeftX}
                      cy={elbowY}
                      r="4"
                      fill={activeHotspot.accent}
                      stroke={isDark ? '#121419' : '#fbfaf6'}
                      strokeWidth="1.5"
                    />
                  </>
                );
              })()}
            </g>
          )}

          {/* Crisp Leader Lines connecting each 3D reticle to its relaxed floating chip */}
          {showSpatialPins &&
            calloutLayouts.map(({ hotspot, pt, side, chipEdgeX, chipY }) => {
              const isSelected = isPanelOpen && activeHotspotId === hotspot.id;
              const isHovered = hoveredHotspotId === hotspot.id;
              const startOffsetX = side === 'left' ? -13 : 13;
              const startX = pt.x + startOffsetX;
              const startY = pt.y;
              const elbowX =
                side === 'left'
                  ? Math.max(chipEdgeX + 8, (startX + chipEdgeX) * 0.5)
                  : Math.min(chipEdgeX - 8, (startX + chipEdgeX) * 0.5);
              const linePts = `${startX.toFixed(1)},${startY.toFixed(1)} ${elbowX.toFixed(1)},${chipY.toFixed(1)} ${chipEdgeX.toFixed(1)},${chipY.toFixed(1)}`;

              return (
                <g key={`leader-${hotspot.id}`}>
                  <polyline
                    points={linePts}
                    fill="none"
                    stroke={isDark ? '#0c1017' : '#ffffff'}
                    strokeWidth={isSelected || isHovered ? '3.4' : '2.6'}
                    opacity="0.75"
                  />
                  <polyline
                    points={linePts}
                    fill="none"
                    stroke={
                      isSelected || isHovered
                        ? hotspot.accent
                        : isDark
                          ? 'rgba(232, 228, 218, 0.65)'
                          : 'rgba(27, 26, 24, 0.55)'
                    }
                    strokeWidth={isSelected || isHovered ? '1.6' : '1.15'}
                  />
                </g>
              );
            })}

          {/* Spatial Targeting Reticles on all visible 3D hotspots */}
          {showSpatialPins &&
            calloutLayouts.map(({ hotspot: hs, pt }) => {
              const isSelected = isPanelOpen && activeHotspotId === hs.id;
              const isHovered = hoveredHotspotId === hs.id;
              const r = isSelected ? 15 : isHovered ? 13.5 : 10.5;
              const b = isSelected ? 5.5 : 4;

              return (
                <g
                  key={hs.id}
                  transform={`translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`}
                >
                  {/* Contrast halo behind reticle for dark/light clarity */}
                  <circle
                    r={r - 1.5}
                    fill={isDark ? 'rgba(14, 18, 26, 0.55)' : 'rgba(255, 255, 255, 0.55)'}
                    stroke="none"
                  />
                  {/* Concentric precision ring */}
                  <circle
                    r={r - 2.5}
                    fill="none"
                    stroke={hs.accent}
                    strokeWidth={isSelected ? '1.7' : '1.25'}
                    strokeDasharray={isSelected ? undefined : '2.5 2.5'}
                    opacity={isSelected || isHovered ? 1 : 0.85}
                  />
                  {/* 4 AR Corner Brackets */}
                  <path
                    d={`M ${-r} ${-r + b} L ${-r} ${-r} L ${-r + b} ${-r}
                        M ${r - b} ${-r} L ${r} ${-r} L ${r} ${-r + b}
                        M ${-r} ${r - b} L ${-r} ${r} L ${-r + b} ${r}
                        M ${r - b} ${r} L ${r} ${r} L ${r} ${r - b}`}
                    fill="none"
                    stroke={isSelected || isHovered ? hs.accent : isDark ? '#f4f1ea' : '#1b1a18'}
                    strokeWidth={isSelected ? '1.8' : '1.3'}
                    opacity={isSelected || isHovered ? 1 : 0.86}
                  />
                  {/* Center coordinate diamond */}
                  <rect
                    x="-2.4"
                    y="-2.4"
                    width="4.8"
                    height="4.8"
                    transform="rotate(45)"
                    fill={hs.accent}
                    stroke={isDark ? '#121419' : '#ffffff'}
                    strokeWidth="1"
                  />
                </g>
              );
            })}
        </svg>
      )}

      {/* 2. Interactive Projected AR Reticle Hit Zones + Collision-Free Floating Callout Chips */}
      {showSpatialPins &&
        calloutLayouts.map(({ hotspot: hs, code, displayLabel, pt, side, chipEdgeX, chipY }) => {
          const isSelected = isPanelOpen && activeHotspotId === hs.id;
          const isHovered = hoveredHotspotId === hs.id;

          return (
            <div key={hs.id}>
              {/* Direct 36px reticle click hit zone centered on the 3D coordinate */}
              <button
                type="button"
                onClick={() => onActivateHotspot(hs.id)}
                aria-label={`Inspeccionar nodo ${code}: ${hs.title}`}
                aria-expanded={isSelected}
                style={{
                  transform: `translate3d(${Math.round(pt.x)}px, ${Math.round(pt.y)}px, 0)`,
                }}
                className="pointer-events-auto absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-9 h-9 cursor-pointer bg-transparent border-0 focus-visible:outline-2 focus-visible:outline-white"
              />

              {/* Collision-relaxed floating AR callout chip connected by SVG leader line */}
              <button
                type="button"
                onClick={() => onActivateHotspot(hs.id)}
                aria-label={`Abrir ficha de realidad aumentada y glosario para ${hs.title}`}
                aria-expanded={isSelected}
                style={{
                  left: `${Math.round(chipEdgeX)}px`,
                  top: `${Math.round(chipY)}px`,
                  transform: side === 'left' ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
                }}
                className={`pointer-events-auto absolute flex items-center gap-1.5 px-2.5 py-1.5 border shadow-md transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 ${
                  isDark
                    ? isSelected || isHovered
                      ? 'bg-[#10141c] border-white text-white focus-visible:outline-white'
                      : 'bg-[#12161f] border-white/30 text-[#f3efe6] hover:border-white focus-visible:outline-white'
                    : isSelected || isHovered
                      ? 'bg-ink border-ink text-white focus-visible:outline-ink'
                      : 'bg-canvas border-ink/50 text-ink hover:border-ink focus-visible:outline-ink'
                }`}
              >
                <span
                  className="inline-block w-1.5 h-3.5 shrink-0"
                  style={{ backgroundColor: hs.accent }}
                  aria-hidden="true"
                />
                <span
                  className={`font-mono text-[11.5px] font-semibold tabular-nums ${
                    isSelected || isHovered
                      ? isDark
                        ? 'text-[#f2c178]'
                        : 'text-white/95'
                      : isDark
                        ? 'text-[#e3dfd5]'
                        : 'text-ink-muted'
                  }`}
                >
                  {code}
                </span>
                <span className="hidden sm:inline font-sans text-xs font-medium max-w-[168px] truncate">
                  {displayLabel}
                </span>
              </button>
            </div>
          );
        })}

      {/* 3. Emergent AR Side Summary Window (Glossary-backed Drawer) */}
      {isPanelOpen && activeHotspot && (
        <aside
          ref={asideRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="false"
          aria-label={`Ficha de realidad aumentada: ${activeHotspot.title}`}
          className={`pointer-events-auto absolute top-3 right-3 bottom-3 z-30 flex flex-col border border-t-2 shadow-xl overflow-hidden transition-transform duration-150 motion-reduce:transition-none focus:outline-none ${
            isDark
              ? 'bg-[#121419] border-white/25 text-[#f4f1ea]'
              : 'bg-canvas border-ink text-ink'
          }`}
          style={{
            width: `${drawerWidth}px`,
            borderTopColor: activeHotspot.accent,
          }}
        >
          {/* AR Top Spec Header */}
          <div
            className={`px-4 py-3 border-b flex items-start justify-between gap-2.5 shrink-0 ${
              isDark ? 'bg-[#171a21] border-white/15' : 'bg-paper border-hairline'
            }`}
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide">
                <Crosshair
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: activeHotspot.accent }}
                  aria-hidden="true"
                />
                <span style={{ color: activeHotspot.accent }} className="font-semibold">
                  {activeHotspot.arCode ?? `RA-0${activeIndex + 1}`}
                </span>
                <span className={isDark ? 'text-white/40' : 'text-ink-muted'} aria-hidden="true">
                  ·
                </span>
                <span className={`truncate ${isDark ? 'text-[#e0dcd1]' : 'text-ink-muted'}`}>
                  {sceneLabel}
                </span>
              </div>
              <h4
                className={`font-display text-base font-semibold leading-snug m-0 ${
                  isDark ? 'text-white' : 'text-ink'
                }`}
              >
                {activeHotspot.title}
              </h4>
              <span
                className={`font-mono text-xs leading-snug ${
                  isDark ? 'text-[#ddd8cc]' : 'text-ink-muted'
                }`}
              >
                {activeHotspot.subtitle}
              </span>
            </div>

            <button
              type="button"
              onClick={onClosePanel}
              aria-label="Cerrar ficha lateral de realidad aumentada"
              className={`min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded border shrink-0 cursor-pointer transition-colors ${
                isDark
                  ? 'border-white/25 bg-[#121419] text-[#e8e4da] hover:border-white hover:text-white'
                  : 'border-hairline bg-canvas text-ink hover:border-ink'
              }`}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Scrollable Summary + Glossary Body */}
          <div className="flex-1 overflow-y-auto px-4 py-3.5 flex flex-col gap-4">
            {/* 3D Spatial Observation */}
            <div className="flex flex-col gap-1.5">
              <span
                className={`font-mono text-xs tracking-wide font-semibold ${
                  isDark ? 'text-[#e2b46b]' : 'text-ochre'
                }`}
              >
                Lectura en el modelo 3D
              </span>
              <p
                data-keep-compact="true"
                className={`text-sm leading-relaxed m-0 ${
                  isDark ? 'text-[#edeae1]' : 'text-ink'
                }`}
              >
                {activeHotspot.detail}
              </p>
              {activeHotspot.evidence && (
                <p
                  data-keep-compact="true"
                  className={`font-mono text-xs leading-relaxed m-0 pt-1 ${
                    isDark ? 'text-[#ddd8cc]' : 'text-ink-muted'
                  }`}
                >
                  Evidencia: {activeHotspot.evidence}
                </p>
              )}
            </div>

            {/* Technical Glossary Summary Cards */}
            <div
              className={`pt-3.5 border-t flex flex-col gap-3 ${
                isDark ? 'border-white/15' : 'border-hairline'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`font-mono text-xs font-semibold inline-flex items-center gap-1.5 ${
                    isDark ? 'text-[#8ec0ff]' : 'text-lapis'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Ficha del glosario técnico</span>
                </span>
                <span
                  className={`font-mono text-xs tabular-nums ${
                    isDark ? 'text-[#c2bdb0]' : 'text-ink-muted'
                  }`}
                >
                  {resolvedGlossaryTerms.length}{' '}
                  {resolvedGlossaryTerms.length === 1 ? 'entrada' : 'entradas'}
                </span>
              </div>

              {resolvedGlossaryTerms.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {resolvedGlossaryTerms.map((term) => (
                    <div
                      key={term.id}
                      className={`p-3 border flex flex-col gap-2 ${
                        isDark
                          ? 'bg-[#191d25] border-white/15'
                          : 'bg-paper border-hairline'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`font-mono text-[11px] font-medium ${
                            isDark ? 'text-[#e2b46b]' : 'text-ochre'
                          }`}
                        >
                          {term.categoryLabel}
                        </span>
                        <span
                          className={`font-display text-sm font-semibold leading-snug ${
                            isDark ? 'text-white' : 'text-ink'
                          }`}
                        >
                          {term.term}
                        </span>
                      </div>

                      <p
                        data-keep-compact="true"
                        className={`text-[13.5px] leading-relaxed m-0 ${
                          isDark ? 'text-[#e3dfd5]' : 'text-ink'
                        }`}
                      >
                        {term.definition}
                      </p>

                      <div
                        className={`pt-2 border-t flex items-center justify-between gap-2 ${
                          isDark ? 'border-white/10' : 'border-hairline'
                        }`}
                      >
                        <span
                          className={`font-mono text-[11.5px] truncate ${
                            isDark ? 'text-[#d4cfc3]' : 'text-ink-muted'
                          }`}
                        >
                          {term.moduleContext}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onClosePanel();
                            jumpToGlossary(term);
                          }}
                          className={`min-h-[32px] px-1.5 font-mono text-xs font-medium inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer hover:underline underline-offset-4 ${
                            isDark ? 'text-[#8ec0ff]' : 'text-lapis'
                          }`}
                        >
                          <span>Glosario</span>
                          <ArrowDownRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  data-keep-compact="true"
                  className={`text-sm m-0 ${
                    isDark ? 'text-[#c2bdb0]' : 'text-ink-muted'
                  }`}
                >
                  Consulta el glosario técnico completo para ampliar los términos asociados a este
                  punto de observación.
                </p>
              )}
            </div>
          </div>

          {/* Sequential AR Hotspot Stepper Footer */}
          {hotspots.length > 1 && (
            <div
              className={`px-3.5 py-2.5 border-t flex items-center justify-between gap-2 shrink-0 ${
                isDark ? 'bg-[#171a21] border-white/15' : 'bg-paper border-hairline'
              }`}
            >
              <button
                type="button"
                onClick={() => handleStep(-1)}
                className={`min-h-[36px] px-2.5 py-1 font-mono text-xs rounded border inline-flex items-center gap-1 cursor-pointer transition-colors ${
                  isDark
                    ? 'bg-[#121419] border-white/20 text-[#e8e4da] hover:border-white'
                    : 'bg-canvas border-hairline text-ink hover:border-ink'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Anterior</span>
              </button>

              <span
                className={`font-mono text-xs tabular-nums ${
                  isDark ? 'text-[#c7c2b6]' : 'text-ink-muted'
                }`}
              >
                {activeIndex + 1} / {hotspots.length}
              </span>

              <button
                type="button"
                onClick={() => handleStep(1)}
                className={`min-h-[36px] px-2.5 py-1 font-mono text-xs rounded border inline-flex items-center gap-1 cursor-pointer transition-colors ${
                  isDark
                    ? 'bg-[#121419] border-white/20 text-[#e8e4da] hover:border-white'
                    : 'bg-canvas border-hairline text-ink hover:border-ink'
                }`}
              >
                <span>Siguiente</span>
                <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
