import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Camera,
  Check,
  Copy,
  Eye,
  FileDown,
  FileText,
  Flame,
  Image as ImageIcon,
  Layers,
  X,
} from 'lucide-react';
import {
  copyBiomechanicsReportPNGToClipboard,
  exportBiomechanicsReportPDF,
  exportBiomechanicsReportPNG,
  renderBiomechanicsReportPreviewDataUrl,
  type BiomechanicsReportSnapshot,
} from '../utils/biomechanicsReportExporter';
import { useModalFocusTrap } from '../utils/useModalFocusTrap';

export interface BiomechanicsReportModalProps {
  snapshot: BiomechanicsReportSnapshot | null;
  onClose: () => void;
}

export function BiomechanicsReportModal({ snapshot, onClose }: BiomechanicsReportModalProps) {
  const [studentName, setStudentName] = useState('');
  const [studentNotes, setStudentNotes] = useState('');
  const [busyAction, setBusyAction] = useState<'pdf' | 'png' | 'copy' | 'preview' | null>(null);
  const [exportedFeedback, setExportedFeedback] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [platePreviewUrl, setPlatePreviewUrl] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!snapshot) return;
    setExportedFeedback(null);
    setExportError(null);
    setPlatePreviewUrl(null);
  }, [snapshot]);

  const handleDismiss = useCallback(() => {
    if (platePreviewUrl) {
      setPlatePreviewUrl(null);
      return;
    }
    onClose();
  }, [platePreviewUrl, onClose]);

  useModalFocusTrap({
    isOpen: Boolean(snapshot),
    containerRef: dialogRef,
    onClose: handleDismiss,
  });

  if (!snapshot) return null;

  const enrichedSnapshot: BiomechanicsReportSnapshot = {
    ...snapshot,
    studentName,
    studentNotes,
  };

  const handleExport = async (format: 'pdf' | 'png') => {
    setBusyAction(format);
    setExportError(null);
    setExportedFeedback(null);
    try {
      const filename =
        format === 'pdf'
          ? await exportBiomechanicsReportPDF(enrichedSnapshot)
          : await exportBiomechanicsReportPNG(enrichedSnapshot);
      setExportedFeedback(
        format === 'pdf'
          ? `Informe PDF descargado (${filename})`
          : `Lámina PNG descargada (${filename})`
      );
    } catch {
      setExportError(
        'No se pudo generar el archivo en este navegador. Intenta con el formato alternativo.'
      );
    } finally {
      setBusyAction(null);
    }
  };

  const handleCopyImage = async () => {
    setBusyAction('copy');
    setExportError(null);
    setExportedFeedback(null);
    try {
      await copyBiomechanicsReportPNGToClipboard(enrichedSnapshot);
      setExportedFeedback('Lámina PNG copiada al portapapeles · Lista para pegar en clase');
    } catch (err) {
      const isUnsupported = err instanceof Error && err.message === 'CLIPBOARD_UNSUPPORTED';
      setExportError(
        isUnsupported
          ? 'Tu navegador no permite copiar imágenes al portapapeles. Usa «Descargar PNG» o «Proyectar lámina».'
          : 'El navegador bloqueó el acceso al portapapeles de imagen. Usa «Descargar PNG» como alternativa.'
      );
    } finally {
      setBusyAction(null);
    }
  };

  const handleToggleClassroomPreview = async () => {
    if (platePreviewUrl) {
      setPlatePreviewUrl(null);
      return;
    }
    setBusyAction('preview');
    setExportError(null);
    try {
      const dataUrl = await renderBiomechanicsReportPreviewDataUrl(enrichedSnapshot);
      setPlatePreviewUrl(dataUrl);
    } catch {
      setExportError('No se pudo generar la vista previa completa de la lámina.');
    } finally {
      setBusyAction(null);
    }
  };

  const visibleLayerSummary = [
    snapshot.layers.skeleton ? 'Esqueleto óseo' : null,
    snapshot.layers.tendons ? 'Tendones y músculos' : null,
    snapshot.layers.vectors ? 'Eje CM y vectores' : null,
    snapshot.comparative.isComparativeMode && snapshot.layers.heatmap
      ? 'Heatmaps pelvis/columna'
      : null,
    snapshot.layers.outlines ? `Contornos 3D (${snapshot.layers.outlineWeightLabel})` : null,
    snapshot.layers.arPins ? 'Etiquetas RA' : null,
  ].filter(Boolean) as string[];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#10141c]/82 flex items-center justify-center p-3 sm:p-4"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bio-report-modal-title"
        className={`w-full ${
          platePreviewUrl ? 'max-w-[920px]' : 'max-w-[820px]'
        } max-h-[92vh] bg-canvas border border-ink border-t-4 border-t-ochre shadow-2xl flex flex-col overflow-hidden focus:outline-none`}
      >
        {/* Sticky Header */}
        <div className="px-4 sm:px-5 py-3.5 bg-paper border-b border-hairline flex items-start justify-between gap-3 shrink-0">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-mono text-xs text-ochre font-semibold inline-flex items-center gap-1.5">
              <FileDown className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>
                {platePreviewUrl
                  ? 'Vista previa proyectable · Revisión rápida en aula'
                  : 'Ficha de trabajo del estudiante · Revisión en clase y exportación A4'}
              </span>
            </span>
            <h3
              id="bio-report-modal-title"
              className="font-display text-lg sm:text-xl font-semibold text-ink m-0 leading-tight"
            >
              {platePreviewUrl
                ? 'Lámina completa de análisis biomecánico 3D'
                : 'Exportar informe de análisis biomecánico 3D'}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={busyAction !== null}
              onClick={() => void handleToggleClassroomPreview()}
              aria-pressed={Boolean(platePreviewUrl)}
              className={`min-h-[40px] px-3 py-1.5 font-mono text-xs font-semibold rounded border inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                platePreviewUrl
                  ? 'bg-ink text-white border-ink'
                  : 'bg-canvas text-ink border-hairline hover:border-ink'
              }`}
            >
              <Eye className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>
                {busyAction === 'preview'
                  ? 'Preparando…'
                  : platePreviewUrl
                    ? 'Volver a editar'
                    : 'Proyectar lámina'}
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar ventana de exportación de informe"
              className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center border border-hairline hover:border-ink bg-canvas text-ink rounded cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {platePreviewUrl ? (
            <div className="flex flex-col items-center gap-3">
              <p className="font-mono text-xs text-ink-muted m-0 text-center">
                Vista exacta de la lámina A4 (1600 × 2260 px) lista para revisar en pantalla o
                proyectar en clase. Pulsa Escape para volver a los campos editables.
              </p>
              <div className="w-full max-w-[720px] bg-[#161b23] border border-ink p-2 sm:p-3 shadow-lg">
                <img
                  src={platePreviewUrl}
                  alt={`Vista previa completa del informe biomecánico 3D de ${snapshot.modeLabel}`}
                  className="w-full h-auto block bg-[#faf9f5]"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left: Captured 3D Viewport Thumbnail + Scene Metadata */}
              <div className="lg:col-span-6 flex flex-col gap-3">
                <div className="bg-[#161b23] border border-ink overflow-hidden">
                  <img
                    src={snapshot.capturedImageDataUrl}
                    alt={`Captura 3D de ${snapshot.modeLabel}`}
                    className="w-full h-[200px] sm:h-[220px] object-contain block"
                  />
                  <div className="px-3 py-2 bg-[#12161f] border-t border-white/15 font-mono text-xs text-[#f2c178] flex flex-wrap items-center justify-between gap-1.5">
                    <span className="truncate">{snapshot.modeLabel}</span>
                    <span className="tabular-nums text-[#e3dfd5] shrink-0">
                      {snapshot.capturedAt}
                    </span>
                  </div>
                </div>

                {/* Captured Configuration Summary */}
                <div className="bg-paper border border-hairline p-3.5 flex flex-col gap-2.5 text-xs">
                  <div className="flex items-start gap-2">
                    <Layers className="w-3.5 h-3.5 text-ochre shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-mono text-xs font-semibold text-ink">
                        Huesos y capas visibles ({visibleLayerSummary.length})
                      </span>
                      <span className="text-ink-muted leading-snug">
                        {visibleLayerSummary.length > 0
                          ? visibleLayerSummary.join(' · ')
                          : 'Ninguna capa anatómica activa'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-2 border-t border-hairline">
                    <Camera className="w-3.5 h-3.5 text-lapis shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-mono text-xs font-semibold text-ink">
                        Ángulos de cámara ({snapshot.camera.presetLabel})
                      </span>
                      <span className="font-mono text-[11.5px] text-ink-muted tabular-nums">
                        Azimut {snapshot.camera.azimuthDeg.toFixed(1)}° · Elevación{' '}
                        {snapshot.camera.elevationDeg.toFixed(1)}° · Dist.{' '}
                        {snapshot.camera.distance.toFixed(2)} m
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-2 border-t border-hairline">
                    <Flame className="w-3.5 h-3.5 text-crimson shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-mono text-xs font-semibold text-ink">
                        Heatmaps y ciclo de carrera
                      </span>
                      <span className="text-ink-muted leading-snug">
                        {snapshot.comparative.isComparativeMode
                          ? `${snapshot.layers.heatmap ? 'Activos' : 'Ocultos'} · Fase ${snapshot.comparative.gaitPhasePercent}% (${snapshot.comparative.gaitStageLabel}) · Pelvis Pan ${Math.round(snapshot.comparative.telemetry.primatePelvisLoad * 100)}% vs. Homo ${Math.round(snapshot.comparative.telemetry.homoPelvisLoad * 100)}%`
                          : 'Modo individual/fósil (sin heatmap comparativo)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Optional Student Worksheet Metadata */}
              <div className="lg:col-span-6 flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="bio-report-student-name"
                    className="font-mono text-xs font-semibold text-ink"
                  >
                    Nombre del estudiante o grupo (opcional)
                  </label>
                  <input
                    id="bio-report-student-name"
                    type="text"
                    maxLength={80}
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Ej.: Grupo 2 · Diploma de Estudios Africanos"
                    className="w-full min-h-[42px] px-3 py-2 text-sm bg-paper border border-hairline focus:border-ink focus:outline-none text-ink rounded"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="bio-report-student-notes"
                    className="font-mono text-xs font-semibold text-ink"
                  >
                    Observaciones para tu ficha de trabajo (opcional)
                  </label>
                  <textarea
                    id="bio-report-student-notes"
                    rows={4}
                    maxLength={480}
                    value={studentNotes}
                    onChange={(e) => setStudentNotes(e.target.value)}
                    placeholder="Resume qué diferencias observas en la inclinación del tronco, la carga sobre los iliones o la lordosis lumbar en esta fase…"
                    className="w-full px-3 py-2 text-sm bg-paper border border-hairline focus:border-ink focus:outline-none text-ink rounded resize-y leading-relaxed"
                  />
                  <span className="font-mono text-xs text-ink-muted text-right tabular-nums">
                    {studentNotes.length} / 480 caracteres
                  </span>
                </div>

                <p className="font-mono text-xs text-ink-muted m-0 leading-relaxed">
                  El informe reúne la captura 3D exacta, las capas anatómicas activas, los ángulos
                  de cámara, el estado del heatmap y las métricas comparadas. Usa{' '}
                  <strong className="text-ink">Proyectar lámina</strong> o{' '}
                  <strong className="text-ink">Copiar imagen</strong> para revisión inmediata en el
                  aula.
                </p>
              </div>
            </div>
          )}

          {/* Accessible Live Feedback Banner */}
          <div aria-live="polite" className="mt-4 empty:hidden">
            {exportedFeedback && (
              <div
                role="status"
                className="px-3.5 py-2.5 bg-forest/10 border border-forest text-forest font-mono text-xs flex items-center gap-2"
              >
                <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{exportedFeedback}</span>
              </div>
            )}

            {exportError && (
              <div
                role="alert"
                className="px-3.5 py-2.5 bg-crimson/10 border border-crimson text-crimson font-mono text-xs"
              >
                {exportError}
              </div>
            )}
          </div>
        </div>

        {/* Pinned Action Bar (always visible on 720p projectors and mobile screens) */}
        <div className="px-4 sm:px-5 py-3.5 bg-paper border-t border-hairline flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <button
              type="button"
              disabled={busyAction !== null}
              onClick={() => void handleExport('pdf')}
              className="min-h-[42px] px-4 py-2 font-mono text-xs font-semibold bg-ochre hover:bg-ink disabled:opacity-60 text-white border border-ochre hover:border-ink rounded inline-flex items-center justify-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
            >
              <FileText className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{busyAction === 'pdf' ? 'Generando PDF…' : 'Descargar PDF (A4)'}</span>
            </button>

            <button
              type="button"
              disabled={busyAction !== null}
              onClick={() => void handleExport('png')}
              className="min-h-[42px] px-4 py-2 font-mono text-xs font-semibold bg-canvas hover:bg-ink hover:text-white disabled:opacity-60 text-ink border border-ink rounded inline-flex items-center justify-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
            >
              <ImageIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{busyAction === 'png' ? 'Generando PNG…' : 'Descargar PNG'}</span>
            </button>

            <button
              type="button"
              disabled={busyAction !== null}
              onClick={() => void handleCopyImage()}
              className="min-h-[42px] px-3.5 py-2 font-mono text-xs font-semibold bg-canvas hover:border-ink disabled:opacity-60 text-ink border border-hairline rounded inline-flex items-center justify-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
            >
              <Copy className="w-4 h-4 shrink-0 text-lapis" aria-hidden="true" />
              <span>{busyAction === 'copy' ? 'Copiando…' : 'Copiar imagen'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-3.5 py-1.5 font-mono text-xs text-ink-muted hover:text-ink border border-hairline hover:border-ink rounded cursor-pointer bg-canvas"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default BiomechanicsReportModal;
