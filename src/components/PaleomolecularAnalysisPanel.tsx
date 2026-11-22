import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Compass,
  Crosshair,
  Dna,
  ExternalLink,
  FlaskConical,
  GitBranch,
  Layers,
  Pause,
  Play,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import {
  PALEOMOLECULAR_3D_MODELS,
  getMolecular3DModel,
  type CameraPresetId,
  type Molecular3DModelId,
} from '../data/paleomolecular3dModels';
import { DnaReplicationDiagram2D } from './DnaReplicationDiagram2D';
import { GlossaryTermTrigger } from './GlossaryContext';
import {
  ARHotspotOverlay,
  type ARHotspotPayload,
  type ProjectedARPoint,
} from './ARHotspotOverlay';
import {
  Paleomolecular3DCanvas,
  type Molecular3DHoverInfo,
} from './Paleomolecular3DCanvas';

const MOLECULAR_GLOSSARY_MAP: Record<Molecular3DModelId, string[]> = {
  'adn-taforalt': ['desaminacion-adn', 'adn-antiguo', 'hueso-petroso'],
  'amelogenina-swartkrans': ['amelogenina', 'paleoproteomica'],
  'enamelina-enam137': ['paleoproteomica', 'taxon'],
  'colageno-zooms': ['zooms', 'paleoproteomica'],
};

export interface PaleomolecularAnalysisPanelProps {
  initialModelId?: Molecular3DModelId;
}

const CAMERA_PRESET_ORDER: CameraPresetId[] = ['frontal', 'axial', 'detalle', 'reset'];

export function PaleomolecularAnalysisPanel({
  initialModelId = 'adn-taforalt',
}: PaleomolecularAnalysisPanelProps = {}) {
  const [selectedModelId, setSelectedModelId] = useState<Molecular3DModelId>(initialModelId);
  const [explodeAmount, setExplodeAmount] = useState<number>(0);
  const [alternateVariant, setAlternateVariant] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [cameraCommand, setCameraCommand] = useState<{
    preset: CameraPresetId;
    nonce: number;
  } | null>(null);
  const [controlsCollapsed, setControlsCollapsed] = useState<boolean>(false);
  const [hoverInfo, setHoverInfo] = useState<Molecular3DHoverInfo | null>(null);
  const [showArPins, setShowArPins] = useState<boolean>(true);
  const [arPanelOpen, setArPanelOpen] = useState<boolean>(false);
  const [projectedPoints, setProjectedPoints] = useState<ProjectedARPoint[]>([]);
  const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [showReplication2D, setShowReplication2D] = useState<boolean>(true);
  const replicationRef = useRef<HTMLDivElement | null>(null);

  const model = getMolecular3DModel(selectedModelId);
  const activeHotspot =
    model.hotspots.find((hs) => hs.id === selectedHotspotId) ?? null;

  const arHotspots = useMemo<ARHotspotPayload[]>(() => {
    const baseGlossaryIds = MOLECULAR_GLOSSARY_MAP[model.id] ?? [model.glossaryTermId];
    return model.hotspots.map((hs, idx) => ({
      id: hs.id,
      arCode: `MOL-0${idx + 1}`,
      title: hs.label,
      subtitle: `${hs.shortTag} · ${model.shortLabel}`,
      accent: hs.accent,
      detail: `${hs.biologicalFunction} ${hs.summary}`,
      evidence: `${hs.biochemicalDetail} (${model.citation})`,
      glossaryTermIds: baseGlossaryIds,
    }));
  }, [model]);

  const handleProjectedHotspotsChange = useCallback(
    (points: ProjectedARPoint[], size: { width: number; height: number }) => {
      setProjectedPoints(points);
      setViewportSize(size);
    },
    []
  );

  const handleToggleReplication2D = useCallback(() => {
    setShowReplication2D((prev) => {
      const next = !prev;
      if (next) {
        window.requestAnimationFrame(() => {
          replicationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }
      return next;
    });
  }, []);

  const handleSelectModel = useCallback((id: Molecular3DModelId) => {
    setSelectedModelId(id);
    setExplodeAmount(0);
    setAlternateVariant(false);
    setSelectedHotspotId(null);
    setArPanelOpen(false);
    setCameraCommand(null);
    setHoverInfo(null);
  }, []);

  const handleCameraPreset = useCallback((preset: CameraPresetId) => {
    if (preset === 'reset' || preset === 'frontal' || preset === 'axial') {
      setSelectedHotspotId(null);
      setArPanelOpen(false);
    }
    if (preset === 'reset') {
      setExplodeAmount(0);
    }
    setCameraCommand((prev) => ({
      preset,
      nonce: (prev?.nonce ?? 0) + 1,
    }));
  }, []);

  const handleSelectHotspot = useCallback((hotspotId: string) => {
    setSelectedHotspotId(hotspotId);
    setArPanelOpen(true);
    setHoverInfo(null);
  }, []);

  // Keyboard shortcut 'H' to toggle the bottom control dock cleanly
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key !== 'h' && event.key !== 'H') return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      setControlsCollapsed((prev) => !prev);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const isGenomics = model.discipline === 'paleogenomica';
  const accentTextClass = isGenomics ? 'text-lapis' : 'text-ochre';
  const accentBorderTopClass = isGenomics ? 'border-t-lapis' : 'border-t-ochre';

  return (
    <section
      id="sec-paleomolecular-3d"
      aria-labelledby="paleomolecular-3d-heading"
      className="bg-paper border border-hairline border-t-2 border-t-ink"
    >
      {/* Editorial Header + Model Selector */}
      <div className="p-5 sm:p-6 border-b border-hairline space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <p className="font-mono text-xs tracking-wide text-ink-muted m-0">
              Laboratorio estructural 3D · Modelos procedimentales de referencia
            </p>
            <h3
              id="paleomolecular-3d-heading"
              className="font-display text-2xl sm:text-[1.75rem] font-semibold tracking-tight text-ink leading-tight m-0 [text-wrap:balance]"
            >
              Visor paleomolecular 3D: ADN antiguo y proteómica en la evolución africana
            </h3>
            <p className="text-sm sm:text-[15px] text-ink-muted leading-relaxed max-w-[68ch] m-0">
              Explora modelos tridimensionales interactivos de secuencias de ADN antiguo y
              estructuras peptídicas clave del registro africano. Rota, acerca, despieza las
              subunidades e inspecciona cada locus bioquímico de autenticación y filogenia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleReplication2D}
              aria-expanded={showReplication2D}
              aria-controls="paleomolecular-replication-2d"
              className={`min-h-[40px] px-3.5 py-2 text-xs font-mono border transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-2 ${
                showReplication2D
                  ? 'bg-lapis text-canvas border-lapis hover:bg-lapis-bright'
                  : 'bg-canvas text-lapis border-lapis/50 hover:border-lapis hover:bg-lapis-soft'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>
                {showReplication2D
                  ? 'Esquema 2D de replicación activo'
                  : 'Generar esquema 2D de replicación'}
              </span>
            </button>
            <span className="font-mono text-[11px] text-ink-muted">
              4 estructuras interactivas · Placeholder esquemático WebGL
            </span>
          </div>
        </div>

        {/* 4 Single-line Model Selector Buttons */}
        <div
          role="tablist"
          aria-label="Selección de modelo molecular 3D"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2"
        >
          {PALEOMOLECULAR_3D_MODELS.map((item) => {
            const isActive = item.id === model.id;
            const itemGenomics = item.discipline === 'paleogenomica';
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectModel(item.id)}
                className={`min-h-[44px] px-3.5 py-2.5 text-left border transition-colors cursor-pointer flex items-center justify-between gap-2.5 ${
                  isActive
                    ? 'bg-ink text-canvas border-ink'
                    : 'bg-canvas text-ink border-hairline hover:border-ink/45'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  {itemGenomics ? (
                    <Dna
                      className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#8ec0ff]' : 'text-lapis'}`}
                      aria-hidden="true"
                    />
                  ) : (
                    <FlaskConical
                      className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#f2a06b]' : 'text-ochre'}`}
                      aria-hidden="true"
                    />
                  )}
                  <span className="text-xs font-medium truncate">{item.shortLabel}</span>
                </span>
                <span
                  className={`font-mono text-[10px] whitespace-nowrap shrink-0 tabular-nums ${
                    isActive ? 'text-canvas/75' : 'text-ink-muted'
                  }`}
                >
                  {item.ageLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dedicated Specimen Spec Bar ABOVE the 3D Stage (Zero Viewport Occlusion) */}
      <div className="px-4 sm:px-5 py-2.5 bg-[#121419] border-b border-white/15 flex flex-wrap items-center justify-between gap-3 text-[#f4f1ea]">
        <div className="min-w-0 flex flex-col gap-0.5">
          <div className="font-mono text-[11px] tracking-wide text-[#c7c2b6] truncate">
            {isGenomics ? 'Paleogenómica' : 'Paleoproteómica'} · {model.ageLabel} ·{' '}
            {model.siteContext}
          </div>
          <div className="font-display text-sm sm:text-[15px] font-semibold text-white leading-snug truncate">
            {model.title}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-[#c7c2b6] shrink-0">
          <Compass className="w-3.5 h-3.5 text-[#e2b46b] shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">
            Clic en pin RA: ficha técnica y glosario · Arrastrar: rotar
          </span>
        </div>
      </div>

      {/* Unobstructed Interactive 3D Viewport Stage */}
      <div className="relative w-full h-[440px] sm:h-[500px] bg-[#15181e] overflow-hidden select-none">
        <Paleomolecular3DCanvas
          model={model}
          explodeAmount={explodeAmount}
          alternateVariant={alternateVariant}
          autoRotate={autoRotate}
          cameraCommand={cameraCommand}
          selectedHotspotId={selectedHotspotId}
          onSelectHotspot={handleSelectHotspot}
          onHoverChange={setHoverInfo}
          onProjectedHotspotsChange={handleProjectedHotspotsChange}
        />

        {/* AR Spatial Reticles, Non-Overlapping Callouts & Emergent Glossary Side Drawer */}
        <ARHotspotOverlay
          hotspots={arHotspots}
          projectedPoints={projectedPoints}
          viewportSize={viewportSize}
          activeHotspotId={selectedHotspotId}
          hoveredHotspotId={hoverInfo?.clickableHotspotId ?? null}
          isPanelOpen={arPanelOpen}
          showSpatialPins={showArPins}
          theme="dark"
          sceneLabel={`${isGenomics ? 'Paleogenómica' : 'Paleoproteómica'} · ${model.shortLabel}`}
          onActivateHotspot={handleSelectHotspot}
          onClosePanel={() => setArPanelOpen(false)}
        />

        {/* Interactive 3D Hover Technical Tooltip (Opaque studio card, smart viewport clamping) */}
        {hoverInfo &&
          !arPanelOpen &&
          (() => {
            const tooltipWidth = Math.min(324, Math.max(220, hoverInfo.containerWidth - 24));
            const estimatedHeight = hoverInfo.clickableHotspotId ? 210 : 186;
            const bottomSafeMargin = 16;

            let left = hoverInfo.x + 18;
            if (left + tooltipWidth > hoverInfo.containerWidth - 12) {
              left = hoverInfo.x - tooltipWidth - 18;
            }
            left = Math.max(12, Math.min(left, hoverInfo.containerWidth - tooltipWidth - 12));

            let top = hoverInfo.y - 24;
            const maxTop = Math.max(
              12,
              hoverInfo.containerHeight - bottomSafeMargin - estimatedHeight
            );
            top = Math.max(12, Math.min(top, maxTop));

            return (
              <div
                role="tooltip"
                aria-live="polite"
                className="pointer-events-none absolute z-20 bg-[#121419]/96 border border-white/25 text-[#f4f1ea] shadow-xl"
                style={{
                  left: `${Math.round(left)}px`,
                  top: `${Math.round(top)}px`,
                  width: `${Math.round(tooltipWidth)}px`,
                }}
              >
                <div
                  className="h-[3px] w-full"
                  style={{ backgroundColor: hoverInfo.accent }}
                  aria-hidden="true"
                />
                <div className="p-3 space-y-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-[#c7c2b6]">
                      <span
                        className="w-2 h-2 shrink-0"
                        style={{ backgroundColor: hoverInfo.accent }}
                        aria-hidden="true"
                      />
                      <span className="truncate">{hoverInfo.category}</span>
                    </div>
                    <div className="font-display text-sm font-semibold text-white leading-snug">
                      {hoverInfo.title}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="font-mono text-[11px] text-[#e2b46b]">
                      Función biológica
                    </div>
                    <p data-keep-compact="true" className="text-xs leading-relaxed text-[#e8e4da] m-0">
                      {hoverInfo.biologicalFunction}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-white/10 space-y-0.5">
                    <div className="font-mono text-[11px] text-[#9eb4d0]">
                      Lectura paleomolecular
                    </div>
                    <p data-keep-compact="true" className="text-xs leading-relaxed text-[#c4bfb3] m-0">
                      {hoverInfo.paleoSignificance}
                    </p>
                  </div>

                  {hoverInfo.clickableHotspotId && (
                    <div className="pt-1 border-t border-white/10 font-mono text-[11px] text-[#e2b46b]">
                      Clic para enfocar cámara y abrir ficha del locus
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
      </div>

      {/* Attached Studio Control Deck BELOW the 3D Stage (Zero Canvas Occlusion) */}
      <div className="bg-[#121419] border-t border-white/15 border-b border-hairline px-4 sm:px-5 py-3 text-[#f4f1ea] flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setControlsCollapsed((prev) => !prev)}
            aria-expanded={!controlsCollapsed}
            aria-controls="paleomolecular-3d-dock"
            className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1 bg-[#1b1f27] border border-white/20 text-[#e8e4da] hover:text-white hover:border-white/40 font-mono text-xs whitespace-nowrap cursor-pointer transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{controlsCollapsed ? 'Mostrar controles 3D (H)' : 'Ocultar controles 3D (H)'}</span>
            {controlsCollapsed ? (
              <ChevronDown className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            )}
          </button>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setAutoRotate((prev) => !prev)}
              aria-pressed={autoRotate}
              className={`min-h-[36px] px-2.5 py-1.5 border font-mono text-xs whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5 transition-colors ${
                autoRotate
                  ? 'bg-[#2a3242] border-[#7eb6ff]/60 text-white'
                  : 'bg-[#1b1f27] border-white/15 text-[#c7c2b6] hover:border-white/35'
              }`}
              title={autoRotate ? 'Pausar rotación automática' : 'Activar rotación automática'}
            >
              {autoRotate ? (
                <Pause className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <Play className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              )}
              <span>{autoRotate ? 'Girar' : 'Pausa'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowArPins((prev) => !prev)}
              aria-pressed={showArPins}
              className={`min-h-[36px] px-2.5 py-1.5 border font-mono text-xs whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5 transition-colors ${
                showArPins
                  ? 'bg-[#2a3242] border-[#e2b46b]/70 text-white'
                  : 'bg-[#1b1f27] border-white/15 text-[#c7c2b6] hover:border-white/35'
              }`}
              title={
                showArPins
                  ? 'Ocultar etiquetas de realidad aumentada'
                  : 'Mostrar etiquetas de realidad aumentada'
              }
            >
              <Crosshair className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Etiquetas RA</span>
            </button>
          </div>
        </div>

        {!controlsCollapsed && (
          <div
            id="paleomolecular-3d-dock"
            className="pt-3 border-t border-white/15"
          >
            <div
              data-preserve-grid="true"
              className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center"
            >
              {/* 1. Variant / Biochemical State Toggle */}
              <div className="lg:col-span-5 flex flex-col gap-1">
                <span className="font-mono text-[11px] text-[#c7c2b6]">
                  Estado o variante molecular
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setAlternateVariant(false);
                      setHoverInfo(null);
                    }}
                    aria-pressed={!alternateVariant}
                    className={`min-h-[36px] px-2.5 py-1.5 text-xs font-mono border transition-colors cursor-pointer truncate ${
                      !alternateVariant
                        ? 'bg-[#f4f1ea] text-[#121419] border-[#f4f1ea] font-semibold'
                        : 'bg-[#1b1f27] text-[#d4cfc4] border-white/15 hover:border-white/35'
                    }`}
                    title={model.variant.defaultLabel}
                  >
                    {model.variant.defaultLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAlternateVariant(true);
                      setHoverInfo(null);
                    }}
                    aria-pressed={alternateVariant}
                    className={`min-h-[36px] px-2.5 py-1.5 text-xs font-mono border transition-colors cursor-pointer truncate ${
                      alternateVariant
                        ? 'bg-[#f4f1ea] text-[#121419] border-[#f4f1ea] font-semibold'
                        : 'bg-[#1b1f27] text-[#d4cfc4] border-white/15 hover:border-white/35'
                    }`}
                    title={model.variant.alternateLabel}
                  >
                    {model.variant.alternateLabel}
                  </button>
                </div>
              </div>

              {/* 2. Exploded View Slider */}
              <div className="lg:col-span-3 flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="molecular-explode-range"
                    className="font-mono text-[11px] text-[#c7c2b6] truncate flex items-center gap-1"
                  >
                    <Layers className="w-3 h-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">{model.explodeLabel}</span>
                  </label>
                  <span className="font-mono text-[11px] tabular-nums text-[#f4f1ea] shrink-0">
                    {Math.round(explodeAmount * 100)} %
                  </span>
                </div>
                <div className="min-h-[36px] flex items-center px-2.5 bg-[#1b1f27] border border-white/15">
                  <input
                    id="molecular-explode-range"
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round(explodeAmount * 100)}
                    onChange={(e) => setExplodeAmount(Number(e.target.value) / 100)}
                    className="w-full accent-[#d95216] cursor-pointer"
                  />
                </div>
              </div>

              {/* 3. Camera Presets */}
              <div className="lg:col-span-4 flex flex-col gap-1">
                <span className="font-mono text-[11px] text-[#c7c2b6]">
                  Encuadre de cámara
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {CAMERA_PRESET_ORDER.map((presetId) => {
                    const preset = model.cameraPresets[presetId];
                    const isReset = presetId === 'reset';
                    return (
                      <button
                        key={presetId}
                        type="button"
                        onClick={() => handleCameraPreset(presetId)}
                        className="min-h-[36px] px-2.5 py-1.5 bg-[#1b1f27] hover:bg-[#272c38] border border-white/15 hover:border-white/35 text-[#e8e4da] font-mono text-xs whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1 transition-colors"
                        title={preset.label}
                      >
                        {isReset && <RotateCcw className="w-3 h-3 shrink-0" aria-hidden="true" />}
                        <span>{isReset ? 'Reset' : preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Below-Canvas 2-Column Editorial Analysis Panel (Unobstructed Scientific Context) */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-paper">
        {/* Left Column: Sequence Readout + Clickable Molecular Loci */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-canvas border border-hairline px-4 py-3 space-y-1">
            <div className="font-mono text-xs text-ink-muted">
              {model.sequenceLabel}
            </div>
            <div className="font-mono text-xs sm:text-[13px] text-ink break-words leading-relaxed">
              {model.sequenceReadout}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-ink-muted">
                Loci y marcadores interactivos ({model.hotspots.length})
              </span>
              {selectedHotspotId && (
                <button
                  type="button"
                  onClick={() => handleCameraPreset('reset')}
                  className="font-mono text-xs text-ink-muted hover:text-ink underline underline-offset-4 cursor-pointer"
                >
                  Vista general
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {model.hotspots.map((hs) => {
                const isSelected = hs.id === selectedHotspotId;
                return (
                  <button
                    key={hs.id}
                    type="button"
                    onClick={() => handleSelectHotspot(hs.id)}
                    aria-pressed={isSelected}
                    className={`w-full min-h-[44px] text-left px-3.5 py-2.5 border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-canvas border-ink text-ink'
                        : 'bg-paper border-hairline text-ink hover:border-ink/40'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 shrink-0"
                        style={{ backgroundColor: hs.accent }}
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium leading-snug">{hs.label}</span>
                    </span>
                    <span className="font-mono text-[11px] text-ink-muted whitespace-nowrap shrink-0">
                      {hs.shortTag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-ink-muted leading-relaxed m-0 pt-2 border-t border-hairline">
            {model.placeholderNote}
          </p>
        </div>

        {/* Right Column: Active Locus Inspector + Variant Interpretation + Evolutionary Synthesis */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            {/* Active Hotspot Detail Card (if selected) */}
            {activeHotspot && (
              <div className={`bg-canvas border border-hairline border-t-2 ${accentBorderTopClass} p-4 sm:p-5 space-y-2.5`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-ink-muted flex items-center gap-2">
                    <span
                      className="w-2 h-2 shrink-0"
                      style={{ backgroundColor: activeHotspot.accent }}
                      aria-hidden="true"
                    />
                    <span>Locus seleccionado · {activeHotspot.shortTag}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHotspotId(null);
                      setArPanelOpen(false);
                    }}
                    className="font-mono text-xs text-ink-muted hover:text-ink underline underline-offset-4 cursor-pointer"
                  >
                    Cerrar foco
                  </button>
                </div>
                <h4 className="font-display text-lg font-semibold text-ink m-0">
                  {activeHotspot.label}
                </h4>
                <p className="text-sm text-ink leading-relaxed max-w-[65ch] m-0">
                  <strong className="font-semibold">Función biológica:</strong>{' '}
                  {activeHotspot.biologicalFunction}
                </p>
                <p className="text-sm text-ink-muted leading-relaxed max-w-[65ch] m-0">
                  {activeHotspot.summary}
                </p>
                <p className="text-sm text-ink-muted leading-relaxed max-w-[65ch] m-0 pt-2 border-t border-hairline">
                  <strong className="text-ink font-semibold">Lectura bioquímica:</strong>{' '}
                  {activeHotspot.biochemicalDetail}
                </p>
              </div>
            )}

            {/* Active 3D Variant Readout */}
            <div className="bg-canvas border border-hairline p-4 sm:p-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`font-mono text-xs font-medium ${accentTextClass}`}>
                  Estado activo en visor ·{' '}
                  {alternateVariant ? model.variant.alternateLabel : model.variant.defaultLabel}
                </span>
                <span className="font-mono text-xs text-ink-muted tabular-nums">
                  Despiece: {Math.round(explodeAmount * 100)} %
                </span>
              </div>
              <p className="text-sm text-ink-muted leading-relaxed max-w-[65ch] m-0">
                {alternateVariant
                  ? model.variant.alternateDescription
                  : model.variant.defaultDescription}
              </p>
            </div>

            {/* Evolutionary Significance & Methodological Limit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <h4 className="font-mono text-xs font-semibold text-ink m-0">
                  Relevancia en la evolución africana
                </h4>
                <p className="text-sm text-ink-muted leading-relaxed m-0">
                  {model.evolutionaryRelevance}
                </p>
              </div>
              <div className="space-y-1.5">
                <h4 className="font-mono text-xs font-semibold text-ink m-0">
                  Límite físico-químico y control
                </h4>
                <p className="text-sm text-ink-muted leading-relaxed m-0">{model.methodLimit}</p>
              </div>
            </div>
          </div>

          {/* Primary Reference + Glossary Link */}
          <div className="pt-3.5 border-t border-hairline flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-muted">
              <span className="font-mono text-[11px]">{model.citation}</span>
              <a
                href={`https://doi.org/${model.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[11px] text-lapis hover:underline underline-offset-4"
              >
                <span>DOI</span>
                <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
              </a>
            </div>

            <div className="text-ink-muted font-mono text-[11px]">
              Glosario:{' '}
              <GlossaryTermTrigger
                termId={model.glossaryTermId}
                tone={isGenomics ? 'lapis' : 'ochre'}
              >
                definición técnica
              </GlossaryTermTrigger>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamically Generated 2D DNA Replication Visual Diagram */}
      {showReplication2D && (
        <div ref={replicationRef} id="paleomolecular-replication-2d">
          <DnaReplicationDiagram2D model={model} alternateVariant={alternateVariant} />
        </div>
      )}
    </section>
  );
}

export default PaleomolecularAnalysisPanel;
