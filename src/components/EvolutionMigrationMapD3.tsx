import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { geoGraticule10, geoNaturalEarth1, geoPath as d3GeoPath, type GeoSphere } from 'd3-geo';
import { select, type Selection } from 'd3-selection';
import 'd3-transition';
import { easeCubicOut } from 'd3-ease';
import {
  zoom as d3Zoom,
  zoomIdentity,
  zoomTransform,
  type D3ZoomEvent,
  type ZoomBehavior,
} from 'd3-zoom';
import { feature, mesh } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import type { Feature, FeatureCollection, Geometry, LineString } from 'geojson';
import worldAtlasCountries from 'world-atlas/countries-110m.json';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Crosshair,
  ExternalLink,
  Globe2,
  HeartHandshake,
  Layers,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  MIGRATION_CORRIDORS,
  MIGRATION_NODES,
  MIGRATION_WAVES,
  type EvidenceSourceLens,
  type MigrationSiteNode,
  type MigrationWaveId,
} from '../data/migrationMapData';

interface EvolutionMigrationMapD3Props {
  onOpenTopic: (topicId: string, options?: { view3d?: boolean }) => void;
  onOpenDossier?: (mode: 'pastwomen' | 'smithsonian') => void;
}

type WaveFilter = 'todas' | MigrationWaveId;
type SourceFilter = 'todas' | EvidenceSourceLens;

interface HoverTooltipState {
  x: number;
  y: number;
  title: string;
  subtitle: string;
  meta: string;
}

const MAP_WIDTH = 960;
const MAP_HEIGHT = 510;

// ISO numeric codes for African countries to softly tint the cradle of humanity on the D3 basemap
const AFRICAN_ISO_IDS = new Set([
  '012', '024', '072', '108', '120', '132', '140', '148', '174', '178', '180', '204', '226',
  '231', '232', '262', '266', '270', '288', '324', '384', '404', '426', '430', '434', '450',
  '454', '466', '478', '504', '508', '516', '562', '566', '624', '646', '678', '686', '694',
  '706', '710', '716', '728', '729', '732', '748', '768', '788', '800', '818', '834', '854',
  '894',
]);

const WAVE_COLOR_MAP: Record<MigrationWaveId, string> = {
  'ola-1-erectus': '#b43c0b',
  'ola-2-panafricana': '#156f55',
  'ola-3-eurasia-sahul': '#1f5fa8',
  'ola-4-holoceno-americas': '#7d4ca5',
};

const SOURCE_LABELS: Record<EvidenceSourceLens, string> = {
  ambos: 'Smithsonian + Pastwomen',
  smithsonian: 'Smithsonian Human Origins',
  pastwomen: 'Pastwomen',
};

function formatCoordinates([lon, lat]: [number, number]): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'O';
  return `${Math.abs(lat).toFixed(2)}° ${latDir}, ${Math.abs(lon).toFixed(2)}° ${lonDir}`;
}

export function EvolutionMigrationMapD3({
  onOpenTopic,
  onOpenDossier,
}: EvolutionMigrationMapD3Props) {
  const [waveFilter, setWaveFilter] = useState<WaveFilter>('todas');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('todas');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-olorgesailie');
  const [isPlayingTour, setIsPlayingTour] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [tooltip, setTooltip] = useState<HoverTooltipState | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const zoomLayerRef = useRef<Selection<SVGGElement, unknown, null, undefined> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Static bundled Natural Earth 110m geometry decoded once via topojson-client
  const worldGeo = useMemo(() => {
    const topology = worldAtlasCountries as unknown as Topology<{
      countries: GeometryCollection<{ name?: string }>;
      land?: GeometryCollection;
    }>;
    const countries = feature(
      topology,
      topology.objects.countries
    ) as FeatureCollection<Geometry, { name?: string }>;
    const borders = mesh(topology, topology.objects.countries, (a, b) => a !== b);
    const landOutline = topology.objects.land
      ? (feature(topology, topology.objects.land) as unknown as Feature<Geometry>)
      : null;
    return { countries, borders, landOutline };
  }, []);

  // Natural Earth projection rotated to keep Africa centered & Beringia cleanly split at antimeridian
  const projection = useMemo(() => {
    return geoNaturalEarth1()
      .rotate([-18, 0])
      .fitExtent(
        [
          [18, 18],
          [MAP_WIDTH - 18, MAP_HEIGHT - 18],
        ],
        { type: 'Sphere' }
      );
  }, []);

  const geoPath = useMemo(() => d3GeoPath(projection), [projection]);

  const visibleNodes = useMemo(() => {
    return MIGRATION_NODES.filter((node) => {
      const waveMatch = waveFilter === 'todas' || node.waveIds.includes(waveFilter);
      const sourceMatch =
        sourceFilter === 'todas'
          ? true
          : sourceFilter === 'ambos'
            ? node.sourceLens === 'ambos'
            : node.sourceLens === sourceFilter || node.sourceLens === 'ambos';
      return waveMatch && sourceMatch;
    });
  }, [waveFilter, sourceFilter]);

  const visibleCorridors = useMemo(() => {
    if (waveFilter === 'todas') return MIGRATION_CORRIDORS;
    return MIGRATION_CORRIDORS.filter((c) => c.waveId === waveFilter);
  }, [waveFilter]);

  const activeNode: MigrationSiteNode = useMemo(() => {
    return (
      visibleNodes.find((n) => n.id === selectedNodeId) ??
      visibleNodes[0] ??
      MIGRATION_NODES[0]
    );
  }, [visibleNodes, selectedNodeId]);

  useEffect(() => {
    if (visibleNodes.length > 0 && !visibleNodes.some((n) => n.id === selectedNodeId)) {
      setSelectedNodeId(visibleNodes[0].id);
    }
  }, [visibleNodes, selectedNodeId]);

  const activeNodeIndex = useMemo(() => {
    const idx = visibleNodes.findIndex((n) => n.id === activeNode.id);
    return idx >= 0 ? idx : 0;
  }, [visibleNodes, activeNode]);

  const activeWaveMeta = useMemo(() => {
    if (waveFilter !== 'todas') {
      return MIGRATION_WAVES.find((w) => w.id === waveFilter) ?? MIGRATION_WAVES[0];
    }
    return (
      MIGRATION_WAVES.find((w) => w.id === activeNode.primaryWaveId) ?? MIGRATION_WAVES[0]
    );
  }, [waveFilter, activeNode]);

  const announceNode = useCallback((node: MigrationSiteNode) => {
    setLiveAnnouncement(
      `Yacimiento seleccionado: ${node.name}, ${node.region}, ${node.chronology}. Fuente: ${SOURCE_LABELS[node.sourceLens]}.`
    );
  }, []);

  const flyToCoordinates = useCallback(
    (coords: [number, number], scale: number) => {
      if (!svgRef.current || !zoomBehaviorRef.current) return;
      const projected = projection(coords);
      if (!projected) return;
      const [px, py] = projected;
      const clampedScale = Math.max(1, Math.min(5, scale));
      const tx = MAP_WIDTH / 2 - px * clampedScale;
      const ty = MAP_HEIGHT / 2 - py * clampedScale;
      const targetTransform = zoomIdentity.translate(tx, ty).scale(clampedScale);

      const svgSel = select(svgRef.current);
      if (prefersReducedMotion) {
        svgSel.call(zoomBehaviorRef.current.transform, targetTransform);
      } else {
        svgSel
          .transition()
          .duration(520)
          .ease(easeCubicOut)
          .call(zoomBehaviorRef.current.transform, targetTransform);
      }
    },
    [projection, prefersReducedMotion]
  );

  const resetMapView = useCallback(() => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svgSel = select(svgRef.current);
    if (prefersReducedMotion) {
      svgSel.call(zoomBehaviorRef.current.transform, zoomIdentity);
    } else {
      svgSel
        .transition()
        .duration(480)
        .ease(easeCubicOut)
        .call(zoomBehaviorRef.current.transform, zoomIdentity);
    }
  }, [prefersReducedMotion]);

  const stepZoom = useCallback(
    (factor: number) => {
      if (!svgRef.current || !zoomBehaviorRef.current) return;
      const svgSel = select(svgRef.current);
      if (prefersReducedMotion) {
        svgSel.call(zoomBehaviorRef.current.scaleBy, factor);
      } else {
        svgSel
          .transition()
          .duration(280)
          .ease(easeCubicOut)
          .call(zoomBehaviorRef.current.scaleBy, factor);
      }
    },
    [prefersReducedMotion]
  );

  // Guided classroom step tour timer
  useEffect(() => {
    if (!isPlayingTour || visibleNodes.length <= 1) return;
    const timer = window.setInterval(() => {
      setSelectedNodeId((prevId) => {
        const idx = visibleNodes.findIndex((n) => n.id === prevId);
        const nextNode = visibleNodes[(idx + 1) % visibleNodes.length];
        if (nextNode) {
          announceNode(nextNode);
          return nextNode.id;
        }
        return prevId;
      });
    }, 4500);
    return () => window.clearInterval(timer);
  }, [isPlayingTour, visibleNodes, announceNode]);

  // Initialize D3 static basemap, defs, and zoom behavior once
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = select(svgRef.current);
    svg.selectAll('defs, g.d3-map-viewport').remove();

    const defs = svg.append('defs');

    // Directional arrowheads per migration wave
    MIGRATION_WAVES.forEach((wave) => {
      defs
        .append('marker')
        .attr('id', `arrow-${wave.id}`)
        .attr('viewBox', '0 -4 8 8')
        .attr('refX', 6.5)
        .attr('refY', 0)
        .attr('markerWidth', 5.5)
        .attr('markerHeight', 5.5)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-3.5L7.5,0L0,3.5Z')
        .attr('fill', wave.strokeColor);
    });

    // Clip path to Sphere
    defs
      .append('clipPath')
      .attr('id', 'd3-migration-sphere-clip')
      .append('path')
      .datum({ type: 'Sphere' } as GeoSphere)
      .attr('d', geoPath);

    const viewport = svg.append('g').attr('class', 'd3-map-viewport');
    zoomLayerRef.current = viewport;

    // 1. Ocean Sphere (adaptive CSS custom properties)
    viewport
      .append('path')
      .datum({ type: 'Sphere' } as GeoSphere)
      .attr('d', geoPath)
      .attr('fill', 'var(--map-ocean)')
      .attr('stroke', 'var(--map-ocean-stroke)')
      .attr('stroke-width', 1.1);

    // 2. Graticule meridians and parallels
    viewport
      .append('path')
      .datum(geoGraticule10())
      .attr('d', geoPath)
      .attr('clip-path', 'url(#d3-migration-sphere-clip)')
      .attr('fill', 'none')
      .attr('stroke', 'var(--map-graticule)')
      .attr('stroke-width', 0.55)
      .attr('stroke-dasharray', '2 3');

    // 3. Countries landmass layer (Africa softly highlighted via CSS custom property)
    const landGroup = viewport
      .append('g')
      .attr('class', 'd3-land-layer')
      .attr('clip-path', 'url(#d3-migration-sphere-clip)');

    landGroup
      .selectAll<SVGPathElement, Feature<Geometry, { name?: string }>>('path.d3-country')
      .data(worldGeo.countries.features)
      .join('path')
      .attr('class', 'd3-country')
      .attr('d', (d) => geoPath(d) ?? '')
      .attr('fill', (d) => {
        const idStr = String(d.id ?? '').padStart(3, '0');
        return AFRICAN_ISO_IDS.has(idStr) ? 'var(--map-africa)' : 'var(--map-land)';
      })
      .attr('stroke', 'none');

    // Country interior hairlines
    landGroup
      .append('path')
      .datum(worldGeo.borders)
      .attr('d', geoPath)
      .attr('fill', 'none')
      .attr('stroke', 'var(--map-border)')
      .attr('stroke-width', 0.45);

    // Crisp coastline silhouette
    if (worldGeo.landOutline) {
      landGroup
        .append('path')
        .datum(worldGeo.landOutline)
        .attr('d', geoPath)
        .attr('fill', 'none')
        .attr('stroke', 'var(--map-coast)')
        .attr('stroke-width', 0.75);
    }

    // High-contrast continental anchor caption for Africa (WCAG AA compliant)
    const africaLabelPos = projection([18, 8]);
    if (africaLabelPos) {
      viewport
        .append('text')
        .attr('x', africaLabelPos[0])
        .attr('y', africaLabelPos[1])
        .attr('text-anchor', 'middle')
        .attr('font-family', 'IBM Plex Mono, monospace')
        .attr('font-size', '9.5px')
        .attr('font-weight', '600')
        .attr('letter-spacing', '0.16em')
        .attr('fill', 'var(--map-africa-label)')
        .style('pointer-events', 'none')
        .text('ÁFRICA · CUNA EVOLUTIVA');
    }

    // Dynamic layers updated by reactive effect
    viewport
      .append('g')
      .attr('class', 'd3-corridors-layer')
      .attr('clip-path', 'url(#d3-migration-sphere-clip)');
    viewport.append('g').attr('class', 'd3-nodes-layer');

    // Configure D3 Zoom & Pan
    const zoomBehavior = d3Zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 5.5])
      .translateExtent([
        [0, 0],
        [MAP_WIDTH, MAP_HEIGHT],
      ])
      .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        viewport.attr('transform', event.transform.toString());
        const k = event.transform.k;
        setZoomLevel(Number(k.toFixed(2)));
        // Keep node markers and corridors optically balanced when zoomed
        viewport.selectAll<SVGGElement, MigrationSiteNode>('g.d3-node-group').each(function (d) {
          const pos = projection(d.coordinates);
          if (!pos) return;
          const invScale = 1 / Math.pow(k, 0.55);
          select(this).attr('transform', `translate(${pos[0]},${pos[1]}) scale(${invScale})`);
        });
        viewport
          .selectAll<SVGPathElement, unknown>('path.d3-corridor-base, path.d3-corridor-flow')
          .attr('stroke-width', 2.2 / Math.pow(k, 0.45));
      });

    zoomBehaviorRef.current = zoomBehavior;
    svg.call(zoomBehavior);

    return () => {
      svg.interrupt();
      svg.on('.zoom', null);
    };
  }, [geoPath, projection, worldGeo]);

  // Helper to compute relative tooltip coordinates inside container
  const updateTooltipPosition = useCallback(
    (event: MouseEvent, title: string, subtitle: string, meta: string) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = event.clientX - rect.left;
      const rawY = event.clientY - rect.top;
      setTooltip({
        x: Math.max(12, Math.min(rect.width - 245, rawX + 14)),
        y: Math.max(12, Math.min(rect.height - 96, rawY - 12)),
        title,
        subtitle,
        meta,
      });
    },
    []
  );

  // Reactive D3 data-join for migration corridors & interactive archaeological nodes
  useEffect(() => {
    const viewport = zoomLayerRef.current;
    if (!viewport) return;

    const currentTransform = svgRef.current ? zoomTransform(svgRef.current) : zoomIdentity;
    const invNodeScale = 1 / Math.pow(currentTransform.k, 0.55);
    const strokeW = 2.2 / Math.pow(currentTransform.k, 0.45);

    // 1. Render Geodesic Migration Corridors
    const corridorsLayer = viewport.select<SVGGElement>('g.d3-corridors-layer');
    corridorsLayer.selectAll('*').remove();

    visibleCorridors.forEach((corridor) => {
      const lineFeature: Feature<LineString> = {
        type: 'Feature',
        properties: { id: corridor.id },
        geometry: {
          type: 'LineString',
          coordinates: corridor.coordinates,
        },
      };
      const dPath = geoPath(lineFeature);
      if (!dPath) return;

      const color = WAVE_COLOR_MAP[corridor.waveId];
      const isRelatedToSelected = activeNode.waveIds.includes(corridor.waveId);
      const baseOpacity = waveFilter === 'todas' ? (isRelatedToSelected ? 0.58 : 0.28) : 0.62;

      const group = corridorsLayer.append('g').attr('class', 'd3-corridor-group');

      group
        .append('path')
        .attr('class', 'd3-corridor-base')
        .attr('d', dPath)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', strokeW)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-opacity', baseOpacity)
        .attr('stroke-dasharray', corridor.dashed ? '5 4' : 'none')
        .attr('marker-end', `url(#arrow-${corridor.waveId})`);

      if (!prefersReducedMotion && isRelatedToSelected) {
        group
          .append('path')
          .attr('class', 'd3-corridor-flow animate-route-forward')
          .attr('d', dPath)
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', strokeW)
          .attr('stroke-linecap', 'round')
          .attr('stroke-opacity', 0.92)
          .style('pointer-events', 'none');
      }

      // Generous invisible hit area for hovering & filtering corridors
      group
        .append('path')
        .attr('d', dPath)
        .attr('fill', 'none')
        .attr('stroke', 'transparent')
        .attr('stroke-width', 12)
        .style('cursor', 'pointer')
        .on('mouseenter', function (event: MouseEvent) {
          group.select('.d3-corridor-base').attr('stroke-opacity', 0.95);
          updateTooltipPosition(event, corridor.label, corridor.note, corridor.chronology);
        })
        .on('mousemove', function (event: MouseEvent) {
          updateTooltipPosition(event, corridor.label, corridor.note, corridor.chronology);
        })
        .on('mouseleave', function () {
          group.select('.d3-corridor-base').attr('stroke-opacity', baseOpacity);
          setTooltip(null);
        })
        .on('click', () => {
          setWaveFilter(corridor.waveId);
          setLiveAnnouncement(`Ruta filtrada: ${corridor.label}.`);
        });
    });

    // 2. Render Geographic Archaeological Nodes via D3 Data Join
    const nodesLayer = viewport.select<SVGGElement>('g.d3-nodes-layer');
    nodesLayer.selectAll('*').remove();

    const nodeGroups = nodesLayer
      .selectAll<SVGGElement, MigrationSiteNode>('g.d3-node-group')
      .data(visibleNodes, (d) => d.id)
      .join('g')
      .attr('class', 'd3-node-group')
      .attr('role', 'button')
      .attr('tabindex', 0)
      .attr(
        'aria-label',
        (d) => `${d.name} (${d.region}), ${d.chronology}. Fuente: ${SOURCE_LABELS[d.sourceLens]}`
      )
      .attr('aria-pressed', (d) => (d.id === activeNode.id ? 'true' : 'false'))
      .attr('transform', (d) => {
        const pos = projection(d.coordinates);
        return pos ? `translate(${pos[0]},${pos[1]}) scale(${invNodeScale})` : 'translate(-999,-999)';
      })
      .style('cursor', 'pointer')
      .on('click', (_event, d) => {
        setIsPlayingTour(false);
        setSelectedNodeId(d.id);
        announceNode(d);
      })
      .on('keydown', (event: KeyboardEvent, d) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setIsPlayingTour(false);
          setSelectedNodeId(d.id);
          announceNode(d);
        }
      })
      .on('mouseenter', function (event: MouseEvent, d) {
        select(this).select('.d3-node-hover-ring').attr('opacity', 1);
        updateTooltipPosition(
          event,
          d.name,
          d.headline,
          `${d.chronology} · ${SOURCE_LABELS[d.sourceLens]}`
        );
      })
      .on('mousemove', function (event: MouseEvent, d) {
        updateTooltipPosition(
          event,
          d.name,
          d.headline,
          `${d.chronology} · ${SOURCE_LABELS[d.sourceLens]}`
        );
      })
      .on('mouseleave', function () {
        select(this).select('.d3-node-hover-ring').attr('opacity', 0);
        setTooltip(null);
      });

    nodeGroups.each(function (d) {
      const g = select(this);
      const isSelected = d.id === activeNode.id;
      const waveColor = WAVE_COLOR_MAP[d.primaryWaveId];

      // Generous invisible hit circle for easy clicking/tapping
      g.append('circle').attr('r', 15).attr('fill', 'transparent');

      // Keyboard focus ring (shown via CSS :focus-visible)
      g.append('circle')
        .attr('class', 'd3-node-focus-ring')
        .attr('r', isSelected ? 15.5 : 13)
        .attr('fill', 'none')
        .attr('stroke', '#121212')
        .attr('stroke-width', 2)
        .attr('opacity', 0);

      // Hover ring
      g.append('circle')
        .attr('class', 'd3-node-hover-ring')
        .attr('r', isSelected ? 13 : 10)
        .attr('fill', 'none')
        .attr('stroke', '#121212')
        .attr('stroke-width', 1.2)
        .attr('stroke-dasharray', '2 2')
        .attr('opacity', 0);

      // Selected halo
      if (isSelected) {
        g.append('circle')
          .attr('r', 12)
          .attr('fill', waveColor)
          .attr('fill-opacity', 0.18)
          .attr('stroke', waveColor)
          .attr('stroke-width', 1.5);
      }

      // Dual-coded symbol geometry by source lens (not hue-only)
      if (d.sourceLens === 'pastwomen') {
        const size = isSelected ? 10 : 8;
        g.append('rect')
          .attr('x', -size / 2)
          .attr('y', -size / 2)
          .attr('width', size)
          .attr('height', size)
          .attr('transform', 'rotate(45)')
          .attr('fill', waveColor)
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 1.6);
      } else if (d.sourceLens === 'ambos') {
        g.append('circle')
          .attr('r', isSelected ? 7.2 : 5.8)
          .attr('fill', waveColor)
          .attr('stroke', '#121212')
          .attr('stroke-width', 1.5);
        g.append('circle')
          .attr('r', isSelected ? 2.6 : 2.1)
          .attr('fill', '#ffffff');
      } else {
        g.append('circle')
          .attr('r', isSelected ? 6.8 : 5.2)
          .attr('fill', waveColor)
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 1.6);
      }

      // Clamped high-contrast cartographic callout for selected node
      if (isSelected) {
        const labelGroup = g.append('g').style('pointer-events', 'none');
        const labelText = `${d.order < 10 ? `0${d.order}` : d.order} · ${d.name}`;
        const approxW = Math.min(220, Math.max(96, labelText.length * 6.3 + 16));
        const pos = projection(d.coordinates);

        // Clamp horizontally and vertically inside MAP_WIDTH x MAP_HEIGHT
        let offsetX = 12;
        let offsetY = -12;
        if (pos) {
          if (pos[0] + 12 + approxW > MAP_WIDTH - 14) {
            offsetX = -approxW - 12;
          }
          if (pos[0] + offsetX < 14) {
            offsetX = 14 - pos[0];
          }
          if (pos[1] - 12 < 16) {
            offsetY = 14;
          } else if (pos[1] + 14 > MAP_HEIGHT - 16) {
            offsetY = -36;
          }
        }

        labelGroup
          .append('rect')
          .attr('x', offsetX)
          .attr('y', offsetY)
          .attr('width', approxW)
          .attr('height', 24)
          .attr('rx', 2)
          .attr('fill', '#121212')
          .attr('fill-opacity', 0.94);

        labelGroup
          .append('text')
          .attr('x', offsetX + 8)
          .attr('y', offsetY + 15.5)
          .attr('font-family', 'IBM Plex Mono, monospace')
          .attr('font-size', '10px')
          .attr('font-weight', '600')
          .attr('fill', '#ffffff')
          .text(labelText);
      }
    });
  }, [
    visibleCorridors,
    visibleNodes,
    activeNode,
    waveFilter,
    geoPath,
    projection,
    prefersReducedMotion,
    updateTooltipPosition,
    announceNode,
  ]);

  const openAtlasTaxon = (taxonId?: string) => {
    window.dispatchEvent(
      new CustomEvent('ulpgc:navigate-course', {
        detail: { sectionId: 'sec-atlas-paleo', atlas: { tab: 'cronologia', taxonId } },
      })
    );
  };

  const handleSelectWave = (nextWave: WaveFilter) => {
    setWaveFilter(nextWave);
    setIsPlayingTour(false);
    if (nextWave === 'todas') {
      resetMapView();
      setLiveAnnouncement('Mostrando todas las olas migratorias y yacimientos.');
      return;
    }
    const wave = MIGRATION_WAVES.find((w) => w.id === nextWave);
    if (wave) {
      flyToCoordinates(wave.defaultFocusCenter, wave.defaultFocusScale);
      setLiveAnnouncement(`Ola seleccionada: ${wave.title} (${wave.chronology}).`);
    }
  };

  const handleStepNode = (delta: -1 | 1) => {
    if (visibleNodes.length === 0) return;
    setIsPlayingTour(false);
    const nextIdx = (activeNodeIndex + delta + visibleNodes.length) % visibleNodes.length;
    const nextNode = visibleNodes[nextIdx];
    setSelectedNodeId(nextNode.id);
    announceNode(nextNode);
  };

  const handleMapContainerKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      stepZoom(1.35);
    } else if (e.key === '-') {
      e.preventDefault();
      stepZoom(1 / 1.35);
    } else if (e.key === '0') {
      e.preventDefault();
      resetMapView();
    }
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Dedicated Screen-Reader Live Region (silent during hover, active on selection/filter) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      {/* Editorial Masthead + Quantitative Strip */}
      <div className="bg-paper border border-hairline p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-rule pb-4">
          <div className="flex flex-col gap-1.5 max-w-[74ch]">
            <div className="flex items-center gap-2 font-mono text-xs text-forest">
              <Compass className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                Cartografía interactiva D3.js · Síntesis Smithsonian Human Origins &amp; Pastwomen
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink m-0 [text-wrap:balance]">
              Rutas migratorias humanas y nodos arqueológicos de evidencia
            </h3>
            <p className="text-sm leading-relaxed text-ink m-0">
              Explora las dispersiones de las poblaciones humanas desde el corredor del Rift
              africano hasta todos los continentes mediante proyección geodésica{' '}
              <strong>Natural Earth (D3.js)</strong>. Selecciona cualquier nodo geográfico para
              contrastar el registro fósil y paleoclimático del{' '}
              <strong>Smithsonian Human Origins Program</strong> con la bioarqueología de cuidados,
              infancia y actividades de mantenimiento de <strong>Pastwomen</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenDossier && (
              <>
                <button
                  type="button"
                  onClick={() => onOpenDossier('pastwomen')}
                  className="min-h-[40px] px-3.5 py-2 font-mono text-xs text-ochre bg-canvas border border-ochre/60 rounded hover:bg-ochre hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <HeartHandshake className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Dossier Pastwomen</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenDossier('smithsonian')}
                  className="min-h-[40px] px-3.5 py-2 font-mono text-xs text-lapis bg-canvas border border-lapis/60 rounded hover:bg-lapis hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Globe2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Dossier Smithsonian</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 4-Column Quantitative Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="border-t border-hairline pt-2.5 flex flex-col gap-0.5">
            <span className="font-mono text-[11px] text-ink-muted">Olas de dispersión</span>
            <span className="font-mono text-lg sm:text-xl font-semibold tabular-nums text-ochre">
              4 fases
            </span>
            <span className="text-xs text-ink-muted">De H. erectus al Holoceno global</span>
          </div>
          <div className="border-t border-hairline pt-2.5 flex flex-col gap-0.5">
            <span className="font-mono text-[11px] text-ink-muted">Nodos arqueológicos</span>
            <span className="font-mono text-lg sm:text-xl font-semibold tabular-nums text-forest">
              {visibleNodes.length} / {MIGRATION_NODES.length}
            </span>
            <span className="text-xs text-ink-muted">Yacimientos clave interactivos</span>
          </div>
          <div className="border-t border-hairline pt-2.5 flex flex-col gap-0.5">
            <span className="font-mono text-[11px] text-ink-muted">Horizonte temporal</span>
            <span className="font-mono text-lg sm:text-xl font-semibold tabular-nums text-lapis">
              4,4 Ma – 5 ka
            </span>
            <span className="text-xs text-ink-muted">Escala evolutiva africana y global</span>
          </div>
          <div className="border-t border-hairline pt-2.5 flex flex-col gap-0.5">
            <span className="font-mono text-[11px] text-ink-muted">Fuentes cruzadas</span>
            <span className="font-mono text-lg sm:text-xl font-semibold tabular-nums text-ink">
              2 corpus
            </span>
            <span className="text-xs text-ink-muted">humanorigins.si.edu · pastwomen.net</span>
          </div>
        </div>
      </div>

      {/* Filter & Controls Toolbar */}
      <div className="flex flex-col gap-3 pb-3 border-b border-hairline">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Migration Wave Selector */}
          <div
            role="group"
            aria-label="Filtrar rutas por ola migratoria"
            className="flex flex-wrap items-center gap-1.5"
          >
            <button
              type="button"
              onClick={() => handleSelectWave('todas')}
              aria-pressed={waveFilter === 'todas'}
              className={`min-h-[40px] px-3.5 py-2 font-mono text-xs border rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                waveFilter === 'todas'
                  ? 'bg-ink text-white border-ink font-medium'
                  : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
              }`}
            >
              Todas las rutas (4)
            </button>
            {MIGRATION_WAVES.map((wave) => {
              const isActive = waveFilter === wave.id;
              return (
                <button
                  key={wave.id}
                  type="button"
                  onClick={() => handleSelectWave(wave.id)}
                  aria-pressed={isActive}
                  className={`min-h-[40px] px-3.5 py-2 font-mono text-xs border rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-2 ${
                    isActive
                      ? 'bg-paper text-ink border-ink font-semibold'
                      : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
                  }`}
                >
                  <span
                    className="w-2.5 h-0.5 shrink-0"
                    style={{ backgroundColor: wave.strokeColor }}
                    aria-hidden="true"
                  />
                  <span>{wave.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Source Lens Filter */}
          <div
            role="group"
            aria-label="Filtrar nodos según fuente científica"
            className="inline-flex flex-wrap items-center gap-1 bg-paper border border-hairline p-1 rounded"
          >
            {(
              [
                { id: 'todas', label: 'Todas las fuentes' },
                { id: 'smithsonian', label: 'Smithsonian' },
                { id: 'pastwomen', label: 'Pastwomen' },
                { id: 'ambos', label: 'Convergencia' },
              ] as Array<{ id: SourceFilter; label: string }>
            ).map((opt) => {
              const isActive = sourceFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSourceFilter(opt.id);
                    setLiveAnnouncement(`Filtro de fuente científica: ${opt.label}.`);
                  }}
                  aria-pressed={isActive}
                  className={`min-h-[40px] px-3 py-1.5 font-mono text-xs rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-ink text-white font-medium'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Two-Zone Interactive Sandbox: D3 Map (8 cols) + Evidence Inspector (4 cols) */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        data-preserve-grid="true"
      >
        {/* Left Zone: D3.js Cartographic Stage */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="bg-canvas border border-hairline flex flex-col">
            {/* Stage Top Action Bar */}
            <div className="px-4 py-2.5 border-b border-hairline bg-paper flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px] text-ink-muted">
                <span className="font-semibold text-ink">{activeWaveMeta.title}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{activeWaveMeta.chronology}</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => flyToCoordinates([20, 2], 2.05)}
                  className="min-h-[40px] px-3 py-1.5 font-mono text-xs text-ink bg-canvas border border-hairline rounded hover:border-ink transition-colors whitespace-nowrap cursor-pointer"
                >
                  Foco África
                </button>
                <button
                  type="button"
                  onClick={() => flyToCoordinates(activeNode.coordinates, 2.75)}
                  title="Centrar en el yacimiento seleccionado"
                  className="min-h-[40px] px-3 py-1.5 font-mono text-xs text-ink bg-canvas border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Crosshair className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
                  <span>Centrar nodo</span>
                </button>
                <button
                  type="button"
                  onClick={() => stepZoom(1.35)}
                  aria-label="Acercar mapa (atajo +)"
                  title="Acercar (+)"
                  className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center bg-canvas border border-hairline rounded text-ink hover:border-ink cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => stepZoom(1 / 1.35)}
                  aria-label="Alejar mapa (atajo -)"
                  title="Alejar (-)"
                  className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center bg-canvas border border-hairline rounded text-ink hover:border-ink cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={resetMapView}
                  aria-label="Reiniciar encuadre global (atajo 0)"
                  title="Vista global (0)"
                  className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center bg-canvas border border-hairline rounded text-ink hover:border-ink cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* D3 SVG Canvas */}
            <div
              ref={containerRef}
              onKeyDown={handleMapContainerKeyDown}
              className="relative w-full overflow-hidden select-none"
              style={{ backgroundColor: 'var(--map-ocean)' }}
            >
              <svg
                ref={svgRef}
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                role="group"
                aria-labelledby="d3-migration-map-title"
                aria-describedby="d3-migration-map-desc"
                className="w-full h-auto block touch-none"
              >
                <title id="d3-migration-map-title">
                  Mapa interactivo de rutas migratorias humanas (Smithsonian Human Origins y Pastwomen)
                </title>
                <desc id="d3-migration-map-desc">
                  Proyección Natural Earth con cuatro fases migratorias desde África hacia Eurasia,
                  Sahul y las Américas y catorce nodos arqueológicos seleccionables por ratón,
                  pantalla táctil o teclado. Usa las teclas más, menos y cero para controlar el zoom.
                </desc>
              </svg>

              {/* Presentational Hover Tooltip (non-live to prevent screen-reader spam) */}
              {tooltip && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute z-20 max-w-[235px] bg-ink text-white px-3 py-2 shadow-lg border border-white/15"
                  style={{ left: tooltip.x, top: tooltip.y }}
                >
                  <div className="font-mono text-[10px] text-amber-300 tabular-nums">
                    {tooltip.meta}
                  </div>
                  <div className="text-xs font-semibold leading-snug mt-0.5">{tooltip.title}</div>
                  <div className="text-[11px] text-white/80 leading-snug mt-0.5 line-clamp-2">
                    {tooltip.subtitle}
                  </div>
                </div>
              )}

              {/* Subtle Scale / Interaction Hint */}
              <div className="pointer-events-none absolute bottom-2.5 left-3 bg-canvas/95 border border-hairline px-2.5 py-1 font-mono text-[10.5px] text-ink-muted tabular-nums">
                Natural Earth · Zoom ×{zoomLevel.toFixed(1)} · Arrastra, usa rueda o teclas + / − / 0
              </div>
            </div>

            {/* Clean Unboxed Cartographic Legend + Playback Stepper */}
            <div className="px-4 py-3 border-t border-hairline bg-paper flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <circle cx="7" cy="7" r="5" fill="#121212" />
                    <circle cx="7" cy="7" r="2" fill="#ffffff" />
                  </svg>
                  <span>Smithsonian + Pastwomen</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <circle cx="7" cy="7" r="4.8" fill="#1f5fa8" stroke="#ffffff" strokeWidth="1.2" />
                  </svg>
                  <span>Foco Smithsonian</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <rect
                      x="3.2"
                      y="3.2"
                      width="7.6"
                      height="7.6"
                      transform="rotate(45 7 7)"
                      fill="#b43c0b"
                      stroke="#ffffff"
                      strokeWidth="1.2"
                    />
                  </svg>
                  <span>Foco Pastwomen</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleStepNode(-1)}
                  aria-label="Yacimiento anterior"
                  className="min-h-[40px] px-3 py-1.5 font-mono text-xs bg-canvas text-ink border border-hairline rounded hover:border-ink inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Anterior</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlayingTour((prev) => !prev)}
                  aria-pressed={isPlayingTour}
                  className={`min-h-[40px] px-3.5 py-1.5 font-mono text-xs border rounded inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                    isPlayingTour
                      ? 'bg-ochre text-white border-ochre font-medium'
                      : 'bg-canvas text-ink border-hairline hover:border-ink'
                  }`}
                >
                  {isPlayingTour ? (
                    <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <Play className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span>{isPlayingTour ? 'Pausar recorrido' : 'Recorrido guiado'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStepNode(1)}
                  aria-label="Yacimiento siguiente"
                  className="min-h-[40px] px-3 py-1.5 font-mono text-xs bg-canvas text-ink border border-hairline rounded hover:border-ink inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Wave Context Summary Strip */}
          <div className="bg-paper border border-hairline px-4 py-3.5 flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
              <span className={`font-semibold ${activeWaveMeta.accentClass}`}>
                Contexto de la fase · {activeWaveMeta.shortLabel}
              </span>
              <span className="text-ink-muted">{activeWaveMeta.taxa}</span>
            </div>
            <p className="text-xs leading-relaxed text-ink m-0">{activeWaveMeta.summary}</p>
            <p className="text-xs leading-relaxed text-ink-muted m-0">
              <strong className="text-ink font-medium">Motor paleoclimático:</strong>{' '}
              {activeWaveMeta.climateDriver}
            </p>
          </div>
        </div>

        {/* Right Zone: Archaeological Evidence Inspector for Selected Node */}
        <aside
          aria-label="Evidencia arqueológica del nodo geográfico seleccionado"
          className="lg:col-span-4 bg-canvas border border-hairline p-5 flex flex-col gap-4"
        >
          {/* Node Header */}
          <div className="flex flex-col gap-1.5 pb-3.5 border-b border-rule">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-ink-muted">
              <span className="text-ochre font-semibold tabular-nums">
                Nodo {activeNode.order < 10 ? `0${activeNode.order}` : activeNode.order} de{' '}
                {MIGRATION_NODES.length}
              </span>
              <span className="tabular-nums">{activeNode.chronology}</span>
            </div>

            <h4 className="font-display text-xl font-semibold text-ink leading-snug m-0">
              {activeNode.name}
            </h4>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px] text-ink-muted">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-ochre" aria-hidden="true" />
                <span>{activeNode.region}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{formatCoordinates(activeNode.coordinates)}</span>
            </div>

            <div className="font-mono text-[11px] text-lapis pt-0.5">
              {activeNode.taxa} · Fuente: {SOURCE_LABELS[activeNode.sourceLens]}
            </div>
          </div>

          {/* Site Headline */}
          <p className="font-display italic text-[15px] leading-snug text-ink m-0">
            {activeNode.headline}
          </p>

          {/* Dual Corpus Contrast: Smithsonian + Pastwomen */}
          <div className="flex flex-col gap-3">
            <div className="bg-paper border border-hairline p-3.5 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-lapis">
                <Globe2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Registro Smithsonian Human Origins</span>
              </div>
              <p className="text-xs leading-relaxed text-ink m-0">
                {activeNode.smithsonianEvidence}
              </p>
            </div>

            <div className="bg-paper border border-hairline p-3.5 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-ochre">
                <HeartHandshake className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Enfoque bioarqueológico Pastwomen</span>
              </div>
              <p className="text-xs leading-relaxed text-ink m-0">
                {activeNode.pastwomenEvidence}
              </p>
            </div>
          </div>

          {/* Specific Archaeological Indicators */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-forest">
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Evidencias arqueológicas específicas</span>
            </div>
            <dl className="m-0 divide-y divide-hairline border-t border-b border-hairline">
              {activeNode.archaeologicalIndicators.map((ind) => (
                <div key={ind.label} className="py-2 flex flex-col gap-0.5">
                  <dt className="font-mono text-[11px] font-semibold text-ink">{ind.label}</dt>
                  <dd className="m-0 text-xs leading-relaxed text-ink-muted">{ind.detail}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Paleoenvironment & Citation */}
          <div className="flex flex-col gap-1.5 text-xs text-ink-muted">
            <p className="m-0 leading-relaxed">
              <strong className="text-ink font-medium">Entorno:</strong>{' '}
              {activeNode.environmentalContext}
            </p>
            <p className="m-0 font-mono text-[10.5px] leading-relaxed text-ink-subtle">
              Ref.: {activeNode.citation}
            </p>
          </div>

          {/* Deep Actions */}
          <div className="pt-3 border-t border-hairline flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onOpenTopic(activeNode.linkedTopicId)}
              className="min-h-[40px] px-3.5 py-2 font-mono text-xs text-white bg-ink border border-ink rounded hover:bg-ochre hover:border-ochre inline-flex items-center justify-between gap-2 transition-colors cursor-pointer"
            >
              <span className="truncate">{activeNode.linkedTopicLabel}</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              {activeNode.atlasTaxonId && (
                <button
                  type="button"
                  onClick={() => openAtlasTaxon(activeNode.atlasTaxonId)}
                  className="min-h-[40px] px-3 py-1.5 font-mono text-xs text-ink bg-paper border border-hairline rounded hover:border-ink inline-flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Ver en Atlas</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
                </button>
              )}
              <a
                href={activeNode.externalRefUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[40px] px-3 py-1.5 font-mono text-xs text-ink bg-paper border border-hairline rounded hover:border-ink inline-flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
              >
                <span className="truncate">{activeNode.externalRefLabel}</span>
                <ExternalLink className="w-3.5 h-3.5 text-lapis shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Interactive Chronological Directory of Geographic Nodes */}
      <div className="flex flex-col gap-3 pt-2 border-t border-hairline">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h4 className="font-display text-lg font-semibold text-ink m-0">
            Índice cronológico de nodos geográficos ({visibleNodes.length})
          </h4>
          <span className="font-mono text-[11px] text-ink-muted">
            Haz clic en cualquier yacimiento para inspeccionar sus evidencias y centrarlo en el mapa
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {visibleNodes.map((node) => {
            const isSelected = node.id === activeNode.id;
            const waveColor = WAVE_COLOR_MAP[node.primaryWaveId];
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => {
                  setIsPlayingTour(false);
                  setSelectedNodeId(node.id);
                  announceNode(node);
                  flyToCoordinates(node.coordinates, 2.35);
                }}
                aria-current={isSelected ? 'location' : undefined}
                className={`min-h-[76px] text-left p-3 border rounded transition-colors cursor-pointer flex flex-col gap-1 ${
                  isSelected
                    ? 'bg-paper border-ink'
                    : 'bg-canvas border-hairline hover:border-ink/60 hover:bg-paper/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 font-mono text-[10.5px]">
                  <span className="font-semibold tabular-nums" style={{ color: waveColor }}>
                    {node.order < 10 ? `0${node.order}` : node.order} · {node.chronology}
                  </span>
                  <span className="text-ink-subtle truncate">
                    {node.sourceLens === 'ambos'
                      ? 'SI + PW'
                      : node.sourceLens === 'smithsonian'
                        ? 'Smithsonian'
                        : 'Pastwomen'}
                  </span>
                </div>
                <span className="text-sm font-semibold text-ink leading-snug">{node.name}</span>
                <span className="text-xs text-ink-muted line-clamp-1">{node.region}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
