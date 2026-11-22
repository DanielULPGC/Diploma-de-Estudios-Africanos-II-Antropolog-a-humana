import type { RunningTelemetryFrame } from './comparativeBiomechanicsRig';
import type { BiomechanicsModeId, Hotspot3DInfo } from '../data/visualSchemas3dData';

export interface BiomechanicsCameraSnapshot {
  presetLabel: string;
  azimuthDeg: number;
  elevationDeg: number;
  distance: number;
  fovDeg: number;
  position: [number, number, number];
  target: [number, number, number];
}

export interface BiomechanicsReportSnapshot {
  capturedImageDataUrl: string;
  imageWidth: number;
  imageHeight: number;
  capturedAt: string;
  modeId: BiomechanicsModeId;
  modeLabel: string;
  speciesLabel: string;
  camera: BiomechanicsCameraSnapshot;
  layers: {
    skeleton: boolean;
    tendons: boolean;
    vectors: boolean;
    heatmap: boolean;
    outlines: boolean;
    outlineWeightLabel: string;
    arPins: boolean;
  };
  comparative: {
    isComparativeMode: boolean;
    superpositionPercent: number;
    superpositionLabel: string;
    gaitPhasePercent: number;
    gaitStageLabel: string;
    telemetry: RunningTelemetryFrame;
  };
  guidedTour: {
    active: boolean;
    stageLabel: string | null;
  };
  activeHotspot: Hotspot3DInfo;
  studentName: string;
  studentNotes: string;
}

function formatNum(value: number, decimals = 1): string {
  return value.toFixed(decimals).replace('.', ',');
}

function sanitizeUserText(input: string, maxLen: number): string {
  return input
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .replace(/\r\n?/g, '\n')
    .trim()
    .slice(0, maxLen);
}

function assertValidPngDataUrl(dataUrl: string): void {
  if (!dataUrl.startsWith('data:image/png;base64,')) {
    throw new Error('Captura 3D no válida para exportación');
  }
}

/**
 * Normalizes technical/editorial Unicode characters to WinAnsi/Latin-1-safe equivalents
 * so jsPDF's built-in Courier / Helvetica / Times fonts never render broken glyphs.
 */
function toPdfSafeText(input: string): string {
  return input
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .replace(/→/g, '->')
    .replace(/←/g, '<-')
    .replace(/↔/g, '<->')
    .replace(/≈/g, '~')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/±/g, '+/-')
    .replace(/…/g, '...')
    .replace(/[\u2212\u2013]/g, '-')
    .replace(/\u2014/g, ' - ')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/×/g, 'x')
    .replace(/✓/g, 'OK')
    .replace(/[^\u0009\u000a\u0020-\u007e\u00a0-\u00ff]/g, '');
}

function getHeatmapZoneLabel(load: number): string {
  if (load < 0.35) return 'Óptima (amortiguada)';
  if (load < 0.65) return 'Moderada';
  if (load < 0.82) return 'Elevada';
  return 'Sobrecarga crítica';
}

function getHeatmapHex(load: number): string {
  if (load < 0.35) return '#156f55';
  if (load < 0.65) return '#c88c14';
  if (load < 0.82) return '#d95216';
  return '#b42318';
}

function sanitizeFileSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);
}

function buildReportFilename(snapshot: BiomechanicsReportSnapshot, ext: 'pdf' | 'png'): string {
  const modeSlug = sanitizeFileSlug(snapshot.modeId);
  const cleanName = sanitizeUserText(snapshot.studentName, 80);
  const nameSlug = cleanName ? `-${sanitizeFileSlug(cleanName)}` : '';
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}`;
  return `informe-biomecanica-${modeSlug}${nameSlug}-${ymd}.${ext}`;
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo leer la captura 3D'));
    img.src = src;
  });
}

async function waitForWebFonts(): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts?.ready) return;
  await Promise.race([
    document.fonts.ready.then(() => undefined),
    new Promise<void>((resolve) => window.setTimeout(resolve, 600)),
  ]);
}

function truncateCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  const ellipsis = '…';
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    const candidate = `${text.slice(0, mid).trimEnd()}${ellipsis}`;
    if (ctx.measureText(candidate).width <= maxWidth) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  return `${text.slice(0, lo).trimEnd()}${ellipsis}`;
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  const words = clean.split(' ');
  const lines: string[] = [];
  let current = words[0];

  for (let i = 1; i < words.length; i++) {
    const candidate = `${current} ${words[i]}`;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines;
}

/**
 * Renders the complete high-resolution A4-proportioned PNG analysis worksheet (1600x2260 px)
 * onto an offscreen canvas after verifying capture integrity and webfont readiness.
 */
async function renderBiomechanicsReportCanvas(
  snapshot: BiomechanicsReportSnapshot
): Promise<HTMLCanvasElement> {
  assertValidPngDataUrl(snapshot.capturedImageDataUrl);
  await waitForWebFonts();

  const cleanStudentName = sanitizeUserText(snapshot.studentName, 80);
  const cleanStudentNotes = sanitizeUserText(snapshot.studentNotes, 480);
  const hasTourLine = Boolean(snapshot.guidedTour.active && snapshot.guidedTour.stageLabel);

  const W = 1600;
  const H = 2260;
  const pad = 76;
  const contentW = W - pad * 2;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Contexto Canvas 2D no disponible');
  }

  // Editorial warm ivory canvas background
  ctx.fillStyle = '#faf9f5';
  ctx.fillRect(0, 0, W, H);

  // Top ochre institutional accent bar
  ctx.fillStyle = '#b43c0b';
  ctx.fillRect(0, 0, W, 14);

  let y = 66;

  // Masthead
  ctx.fillStyle = '#b43c0b';
  ctx.font = '600 20px "IBM Plex Mono", monospace';
  ctx.fillText('UNIVERSIDAD DE LAS PALMAS DE GRAN CANARIA · DIPLOMA DE ESTUDIOS AFRICANOS', pad, y);

  ctx.fillStyle = '#5a5a55';
  ctx.textAlign = 'right';
  ctx.fillText(`Fecha: ${snapshot.capturedAt}`, W - pad, y);
  ctx.textAlign = 'left';

  y += 44;
  ctx.fillStyle = '#121212';
  ctx.font = '700 40px "Fraunces", Georgia, serif';
  ctx.fillText('Informe de análisis biomecánico 3D', pad, y);

  y += 34;
  ctx.fillStyle = '#4a4a44';
  ctx.font = '500 22px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(
    truncateCanvasText(ctx, `Ficha de trabajo · ${snapshot.modeLabel}`, contentW),
    pad,
    y
  );

  y += 22;
  ctx.fillStyle = '#121212';
  ctx.fillRect(pad, y, contentW, 2.5);
  y += 28;

  // Student identification strip (with explicit column budgets so left & right never collide)
  ctx.fillStyle = '#f2f0e8';
  ctx.fillRect(pad, y, contentW, 64);
  ctx.strokeStyle = '#d7d5cc';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(pad, y, contentW, 64);

  ctx.font = '600 17px "IBM Plex Mono", monospace';
  const speciesText = `ESPECIES: ${snapshot.speciesLabel}`;
  const speciesMeasuredW = Math.min(contentW * 0.44, ctx.measureText(speciesText).width);

  ctx.fillStyle = '#5a5a55';
  ctx.fillText('ESTUDIANTE / GRUPO:', pad + 20, y + 39);

  const studentMaxW = Math.max(240, contentW - 255 - speciesMeasuredW - 44);
  ctx.fillStyle = '#121212';
  ctx.font = '600 21px "Plus Jakarta Sans", system-ui, sans-serif';
  const studentDisplay =
    cleanStudentName || 'Sin especificar (ficha de práctica individual)';
  ctx.fillText(truncateCanvasText(ctx, studentDisplay, studentMaxW), pad + 255, y + 40);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#1f5fa8';
  ctx.font = '600 17px "IBM Plex Mono", monospace';
  ctx.fillText(
    truncateCanvasText(ctx, speciesText, contentW * 0.44),
    W - pad - 20,
    y + 39
  );
  ctx.textAlign = 'left';

  y += 88;

  // 3D Capture Frame (shrinks cleanly by 30px when guided tour adds a second caption line)
  const imgBoxH = hasTourLine ? 650 : 680;
  const captionH = hasTourLine ? 76 : 46;
  ctx.fillStyle = '#161b23';
  ctx.fillRect(pad, y, contentW, imgBoxH);

  const img = await loadImageElement(snapshot.capturedImageDataUrl);
  const scale = Math.min(contentW / img.width, imgBoxH / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const drawX = pad + (contentW - drawW) * 0.5;
  const drawY = y + (imgBoxH - drawH) * 0.5;
  ctx.drawImage(img, drawX, drawY, drawW, drawH);

  ctx.strokeStyle = '#121212';
  ctx.lineWidth = 2;
  ctx.strokeRect(pad, y, contentW, imgBoxH);

  // Caption bar beneath 3D capture (two dedicated rows when guided tour is active: zero overlap)
  y += imgBoxH;
  ctx.fillStyle = '#12161f';
  ctx.fillRect(pad, y, contentW, captionH);
  ctx.fillStyle = '#f2c178';
  ctx.font = '600 16px "IBM Plex Mono", monospace';
  const primaryCaption = `ENCUADRE: ${snapshot.camera.presetLabel} · Azimut ${formatNum(snapshot.camera.azimuthDeg)}° · Elevación ${formatNum(snapshot.camera.elevationDeg)}° · Dist. ${formatNum(snapshot.camera.distance, 2)} m`;
  ctx.fillText(truncateCanvasText(ctx, primaryCaption, contentW - 36), pad + 18, y + 29);

  if (hasTourLine && snapshot.guidedTour.stageLabel) {
    ctx.fillStyle = '#7ae0ba';
    ctx.font = '600 15.5px "IBM Plex Mono", monospace';
    ctx.fillText(
      truncateCanvasText(
        ctx,
        `VISITA GUIADA ACTIVA · ${snapshot.guidedTour.stageLabel}`,
        contentW - 36
      ),
      pad + 18,
      y + 59
    );
  }

  y += captionH + 28;

  // Two-column structured configuration cards
  const colGap = 28;
  const colW = (contentW - colGap) / 2;
  const cardH = 335;

  // Left card: Visible bones & anatomical layers
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(pad, y, colW, cardH);
  ctx.strokeStyle = '#d7d5cc';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(pad, y, colW, cardH);
  ctx.fillStyle = '#121212';
  ctx.fillRect(pad, y, colW, 5);

  ctx.fillStyle = '#b43c0b';
  ctx.font = '600 16px "IBM Plex Mono", monospace';
  ctx.fillText('01 · ESTRUCTURAS Y CAPAS VISIBLES', pad + 22, y + 36);

  const layerItems: Array<[string, boolean, string]> = [
    ['Esqueleto óseo (cráneo, columna, pelvis, fémur)', snapshot.layers.skeleton, ''],
    ['Tendones y musculatura elástica', snapshot.layers.tendons, ''],
    ['Eje de centro de masas (CM) y vectores', snapshot.layers.vectors, ''],
    [
      'Heatmaps dinámicos de pelvis y columna',
      snapshot.comparative.isComparativeMode && snapshot.layers.heatmap,
      snapshot.comparative.isComparativeMode ? '' : '(solo modo comparativo)',
    ],
    [
      `Contornos anatómicos 3D (${snapshot.layers.outlineWeightLabel})`,
      snapshot.layers.outlines,
      '',
    ],
    ['Etiquetas espaciales RA en pantalla', snapshot.layers.arPins, ''],
  ];

  let ly = y + 76;
  layerItems.forEach(([label, enabled, suffix]) => {
    ctx.fillStyle = enabled ? '#156f55' : '#9c9b94';
    ctx.fillRect(pad + 22, ly - 15, 18, 18);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 14px "IBM Plex Mono", monospace';
    ctx.fillText(enabled ? '✓' : '–', pad + 26, ly - 1);

    ctx.fillStyle = enabled ? '#121212' : '#76756f';
    ctx.font = enabled
      ? '600 18px "Plus Jakarta Sans", system-ui, sans-serif'
      : '400 18px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(
      truncateCanvasText(ctx, `${label}${suffix ? ` ${suffix}` : ''}`, colW - 72),
      pad + 52,
      ly
    );
    ly += 42;
  });

  // Right card: Camera angles & coordinates
  const rightX = pad + colW + colGap;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(rightX, y, colW, cardH);
  ctx.strokeStyle = '#d7d5cc';
  ctx.strokeRect(rightX, y, colW, cardH);
  ctx.fillStyle = '#1f5fa8';
  ctx.fillRect(rightX, y, colW, 5);

  ctx.fillStyle = '#1f5fa8';
  ctx.font = '600 16px "IBM Plex Mono", monospace';
  ctx.fillText('02 · TELEMETRÍA DE CÁMARA 3D', rightX + 22, y + 36);

  const camRows: Array<[string, string]> = [
    ['Enfoque / preset', snapshot.camera.presetLabel],
    ['Ángulo azimutal (horizontal)', `${formatNum(snapshot.camera.azimuthDeg)}°`],
    ['Ángulo de elevación (vertical)', `${formatNum(snapshot.camera.elevationDeg)}°`],
    ['Distancia orbital al objetivo', `${formatNum(snapshot.camera.distance, 2)} m`],
    ['Campo de visión (FOV)', `${formatNum(snapshot.camera.fovDeg, 0)}°`],
    [
      'Posición (X, Y, Z)',
      `(${formatNum(snapshot.camera.position[0], 2)}, ${formatNum(snapshot.camera.position[1], 2)}, ${formatNum(snapshot.camera.position[2], 2)})`,
    ],
    [
      'Punto objetivo (X, Y, Z)',
      `(${formatNum(snapshot.camera.target[0], 2)}, ${formatNum(snapshot.camera.target[1], 2)}, ${formatNum(snapshot.camera.target[2], 2)})`,
    ],
  ];

  let cy = y + 74;
  camRows.forEach(([k, v]) => {
    ctx.fillStyle = '#5a5a55';
    ctx.font = '500 17px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(k, rightX + 22, cy);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#121212';
    ctx.font = '600 17px "IBM Plex Mono", monospace';
    ctx.fillText(truncateCanvasText(ctx, v, colW * 0.56), rightX + colW - 22, cy);
    ctx.textAlign = 'left';
    cy += 37;
  });

  y += cardH + 28;

  // Section 03: Heatmap & Running Cycle Telemetry Card
  const heatCardH = 335;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(pad, y, contentW, heatCardH);
  ctx.strokeStyle = '#d7d5cc';
  ctx.strokeRect(pad, y, contentW, heatCardH);
  ctx.fillStyle = '#b42318';
  ctx.fillRect(pad, y, contentW, 5);

  ctx.fillStyle = '#b42318';
  ctx.font = '600 16px "IBM Plex Mono", monospace';
  ctx.fillText('03 · ESTADO DE LOS HEATMAPS Y CICLO DE CARRERA', pad + 24, y + 36);

  const heatStatusText = !snapshot.comparative.isComparativeMode
    ? 'Modo individual/fósil (sin mapa térmico comparativo activo)'
    : snapshot.layers.heatmap
      ? `ACTIVO · Fase ${snapshot.comparative.gaitPhasePercent}% (${snapshot.comparative.gaitStageLabel}) · ${snapshot.comparative.superpositionLabel}`
      : `DESACTIVADO · Fase ${snapshot.comparative.gaitPhasePercent}% (${snapshot.comparative.gaitStageLabel}) · ${snapshot.comparative.superpositionLabel}`;

  ctx.fillStyle = '#121212';
  ctx.font = '600 19px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(truncateCanvasText(ctx, heatStatusText, contentW - 48), pad + 24, y + 72);

  // Comparative stress bars (Pan vs Homo)
  const tel = snapshot.comparative.telemetry;
  const barMetrics: Array<{ label: string; value: number; note: string }> = [
    {
      label: 'Pan troglodytes · Carga en pelvis (iliones planos)',
      value: tel.primatePelvisLoad,
      note: `${Math.round(tel.primatePelvisLoad * 100)}% · Basculación ${formatNum(tel.primatePelvicTiltDeg)}° · ${getHeatmapZoneLabel(tel.primatePelvisLoad)}`,
    },
    {
      label: 'Homo sapiens · Carga en pelvis (cuenca corta)',
      value: tel.homoPelvisLoad,
      note: `${Math.round(tel.homoPelvisLoad * 100)}% · Basculación ${formatNum(tel.homoPelvicTiltDeg)}° · ${getHeatmapZoneLabel(tel.homoPelvisLoad)}`,
    },
    {
      label: 'Pan troglodytes · Cizalla columna lumbar (arco en C)',
      value: tel.primateSpineLoad,
      note: `${Math.round(tel.primateSpineLoad * 100)}% · Inclinación tronco ${formatNum(tel.primateTrunkPitchDeg)}° · ${getHeatmapZoneLabel(tel.primateSpineLoad)}`,
    },
    {
      label: 'Homo sapiens · Cizalla columna lumbar (lordosis en S)',
      value: tel.homoSpineLoad,
      note: `${Math.round(tel.homoSpineLoad * 100)}% · Inclinación tronco ${formatNum(tel.homoTrunkPitchDeg)}° · ${getHeatmapZoneLabel(tel.homoSpineLoad)}`,
    },
  ];

  let by = y + 114;
  const barFullW = contentW - 48;
  barMetrics.forEach((m) => {
    ctx.fillStyle = '#121212';
    ctx.font = '600 17px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(truncateCanvasText(ctx, m.label, barFullW * 0.54), pad + 24, by);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#4a4a44';
    ctx.font = '600 15px "IBM Plex Mono", monospace';
    ctx.fillText(truncateCanvasText(ctx, m.note, barFullW * 0.45), W - pad - 24, by);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#ecebe4';
    ctx.fillRect(pad + 24, by + 9, barFullW, 14);
    ctx.fillStyle = getHeatmapHex(m.value);
    ctx.fillRect(pad + 24, by + 9, Math.max(8, barFullW * Math.min(1, m.value)), 14);
    by += 52;
  });

  y += heatCardH + 28;

  // Section 04: Active Anatomical Node + Student Observations
  const notesCardH = 420;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(pad, y, contentW, notesCardH);
  ctx.strokeStyle = '#d7d5cc';
  ctx.strokeRect(pad, y, contentW, notesCardH);
  ctx.fillStyle = '#156f55';
  ctx.fillRect(pad, y, contentW, 5);

  ctx.fillStyle = '#156f55';
  ctx.font = '600 16px "IBM Plex Mono", monospace';
  ctx.fillText(
    `04 · NODO ANATÓMICO DESTACADO (${snapshot.activeHotspot.arCode ?? 'BIO'}) Y ANOTACIONES DE LA FICHA`,
    pad + 24,
    y + 36
  );

  ctx.fillStyle = '#121212';
  ctx.font = '700 22px "Fraunces", Georgia, serif';
  ctx.fillText(
    truncateCanvasText(
      ctx,
      `${snapshot.activeHotspot.title} — ${snapshot.activeHotspot.subtitle}`,
      contentW - 48
    ),
    pad + 24,
    y + 72
  );

  ctx.fillStyle = '#33332f';
  ctx.font = '400 18px "Plus Jakarta Sans", system-ui, sans-serif';
  const detailLines = wrapCanvasText(ctx, snapshot.activeHotspot.detail, contentW - 48).slice(0, 3);
  let ny = y + 104;
  detailLines.forEach((line) => {
    ctx.fillText(line, pad + 24, ny);
    ny += 26;
  });

  if (snapshot.activeHotspot.evidence) {
    ctx.fillStyle = '#5a5a55';
    ctx.font = '500 15px "IBM Plex Mono", monospace';
    const evLines = wrapCanvasText(
      ctx,
      `Evidencia fósil / biomecánica: ${snapshot.activeHotspot.evidence}`,
      contentW - 48
    ).slice(0, 2);
    ny += 6;
    evLines.forEach((line) => {
      ctx.fillText(line, pad + 24, ny);
      ny += 22;
    });
  }

  // Divider before Student Notes
  ny = Math.max(ny + 14, y + 232);
  ctx.strokeStyle = '#e2e0d8';
  ctx.beginPath();
  ctx.moveTo(pad + 24, ny);
  ctx.lineTo(W - pad - 24, ny);
  ctx.stroke();

  ny += 30;
  ctx.fillStyle = '#b43c0b';
  ctx.font = '600 15px "IBM Plex Mono", monospace';
  ctx.fillText('OBSERVACIONES DEL ESTUDIANTE:', pad + 24, ny);

  ny += 28;
  ctx.fillStyle = '#121212';
  ctx.font = '400 18px "Plus Jakarta Sans", system-ui, sans-serif';
  const notesText =
    cleanStudentNotes ||
    'Espacio reservado para conclusiones sobre la eficiencia mecánica de la pelvis en cuenca, la lordosis lumbar en S y el gasto energético en la carrera de resistencia.';
  const noteLines = wrapCanvasText(ctx, notesText, contentW - 48).slice(0, 4);
  noteLines.forEach((line) => {
    ctx.fillText(line, pad + 24, ny);
    ny += 26;
  });

  // Footer
  ctx.fillStyle = '#76756f';
  ctx.font = '500 15px "IBM Plex Mono", monospace';
  ctx.fillText(
    'Diploma de Estudios Africanos (ULPGC) · Módulo I · Tema 04: Biomecánica del bipedismo y carrera de resistencia',
    pad,
    H - 42
  );

  return canvas;
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('No se pudo generar la imagen PNG'));
    }, 'image/png');
  });
}

/**
 * Generates an in-memory PNG data URL of the complete A4 editorial report plate
 * for instant full-screen classroom projection without saving files to disk.
 */
export async function renderBiomechanicsReportPreviewDataUrl(
  snapshot: BiomechanicsReportSnapshot
): Promise<string> {
  const canvas = await renderBiomechanicsReportCanvas(snapshot);
  return canvas.toDataURL('image/png');
}

/**
 * Copies the full formatted A4 PNG plate directly to the system clipboard
 * for quick pasting into classroom slides or virtual campus submissions.
 */
export async function copyBiomechanicsReportPNGToClipboard(
  snapshot: BiomechanicsReportSnapshot
): Promise<void> {
  if (
    typeof navigator === 'undefined' ||
    !navigator.clipboard ||
    typeof navigator.clipboard.write !== 'function' ||
    typeof ClipboardItem === 'undefined'
  ) {
    throw new Error('CLIPBOARD_UNSUPPORTED');
  }
  const canvas = await renderBiomechanicsReportCanvas(snapshot);
  const blob = await canvasToPngBlob(canvas);
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}

/**
 * Exports a high-resolution A4-proportioned PNG analysis worksheet (1600x2260 px)
 * combining the live 3D capture, visible bones/layers, camera angles, heatmap telemetry,
 * and student notes.
 */
export async function exportBiomechanicsReportPNG(
  snapshot: BiomechanicsReportSnapshot
): Promise<string> {
  const canvas = await renderBiomechanicsReportCanvas(snapshot);
  const blob = await canvasToPngBlob(canvas);
  const filename = buildReportFilename(snapshot, 'png');
  triggerBlobDownload(blob, filename);
  return filename;
}

/**
 * Exports a clean, print-ready A4 PDF academic report using dynamically imported jsPDF
 * (zero bundle weight until the student clicks download), with WinAnsi-safe typography
 * and collision-free column/ribbon layout.
 */
export async function exportBiomechanicsReportPDF(
  snapshot: BiomechanicsReportSnapshot
): Promise<string> {
  assertValidPngDataUrl(snapshot.capturedImageDataUrl);

  const cleanStudentName = sanitizeUserText(snapshot.studentName, 80);
  const cleanStudentNotes = sanitizeUserText(snapshot.studentNotes, 480);
  const hasTourLine = Boolean(snapshot.guidedTour.active && snapshot.guidedTour.stageLabel);

  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const fitPdfLine = (raw: string, maxWidthMm: number): string => {
    const safe = toPdfSafeText(raw);
    if (doc.getTextWidth(safe) <= maxWidthMm) return safe;
    const ellipsis = '...';
    let lo = 0;
    let hi = safe.length;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      const candidate = `${safe.slice(0, mid).trimEnd()}${ellipsis}`;
      if (doc.getTextWidth(candidate) <= maxWidthMm) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }
    return `${safe.slice(0, lo).trimEnd()}${ellipsis}`;
  };

  const pageW = 210;
  const pageH = 297;
  const margin = 14;
  const contentW = pageW - margin * 2;

  // Warm paper background & top ochre accent strip
  doc.setFillColor(250, 249, 245);
  doc.rect(0, 0, pageW, pageH, 'F');
  doc.setFillColor(180, 60, 11);
  doc.rect(0, 0, pageW, 2.5, 'F');

  let y = 11.5;

  // Institutional masthead
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 60, 11);
  doc.text(
    toPdfSafeText('UNIVERSIDAD DE LAS PALMAS DE GRAN CANARIA · DIPLOMA DE ESTUDIOS AFRICANOS'),
    margin,
    y
  );

  doc.setTextColor(95, 95, 88);
  doc.text(toPdfSafeText(`Fecha: ${snapshot.capturedAt}`), pageW - margin, y, { align: 'right' });

  y += 6.5;
  doc.setFont('times', 'bold');
  doc.setFontSize(16.5);
  doc.setTextColor(18, 18, 18);
  doc.text(toPdfSafeText('Informe de análisis biomecánico 3D'), margin, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(78, 78, 72);
  doc.text(fitPdfLine(`Ficha de trabajo del estudiante · ${snapshot.modeLabel}`, contentW), margin, y);

  y += 2.8;
  doc.setDrawColor(18, 18, 18);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 4;

  // Student ID bar (strict left/right width budgets so long names never collide with species label)
  doc.setFillColor(242, 240, 232);
  doc.setDrawColor(215, 213, 204);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, contentW, 9.5, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  const speciesSafe = fitPdfLine(snapshot.speciesLabel, 68);
  const speciesW = doc.getTextWidth(speciesSafe);

  doc.setTextColor(95, 95, 88);
  doc.text('ESTUDIANTE:', margin + 3, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(18, 18, 18);
  const studentDisplay =
    cleanStudentName || 'Sin especificar (práctica de laboratorio 3D)';
  const studentMaxMm = Math.max(40, contentW - 25 - speciesW - 8);
  doc.text(fitPdfLine(studentDisplay, studentMaxMm), margin + 25, y + 6);

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(31, 95, 168);
  doc.text(speciesSafe, pageW - margin - 3, y + 6, { align: 'right' });

  y += 12.5;

  // 3D Capture Box (adjusts cleanly when guided tour adds a dedicated second caption row)
  const imgBoxH = hasTourLine ? 78 : 82;
  const ribbonH = hasTourLine ? 10.5 : 6.5;
  doc.setFillColor(22, 27, 35);
  doc.rect(margin, y, contentW, imgBoxH, 'F');

  const aspect =
    snapshot.imageWidth > 0 && snapshot.imageHeight > 0
      ? snapshot.imageWidth / snapshot.imageHeight
      : 16 / 9;
  let drawW = contentW;
  let drawH = drawW / aspect;
  if (drawH > imgBoxH) {
    drawH = imgBoxH;
    drawW = drawH * aspect;
  }
  const drawX = margin + (contentW - drawW) * 0.5;
  const drawY = y + (imgBoxH - drawH) * 0.5;
  doc.addImage(snapshot.capturedImageDataUrl, 'PNG', drawX, drawY, drawW, drawH, undefined, 'FAST');

  doc.setDrawColor(18, 18, 18);
  doc.setLineWidth(0.4);
  doc.rect(margin, y, contentW, imgBoxH, 'S');

  // Dark caption ribbon below capture (two rows when guided tour is active -> zero collision)
  y += imgBoxH;
  doc.setFillColor(18, 22, 31);
  doc.rect(margin, y, contentW, ribbonH, 'F');
  doc.setFont('courier', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(242, 193, 120);
  doc.text(
    fitPdfLine(
      `Encuadre: ${snapshot.camera.presetLabel} | Azimut ${formatNum(snapshot.camera.azimuthDeg)}° | Elevación ${formatNum(snapshot.camera.elevationDeg)}° | Dist. ${formatNum(snapshot.camera.distance, 2)} m`,
      contentW - 6
    ),
    margin + 3,
    y + 4.4
  );
  if (hasTourLine && snapshot.guidedTour.stageLabel) {
    doc.setTextColor(122, 224, 186);
    doc.text(
      fitPdfLine(`Visita guiada activa: ${snapshot.guidedTour.stageLabel}`, contentW - 6),
      margin + 3,
      y + 8.6
    );
  }

  y += ribbonH + 3.5;

  // Two-column cards: 01 Visible Structures & 02 Camera Angles
  const colGap = 4;
  const colW = (contentW - colGap) / 2;
  const cardH = 47;

  // Card 01: Visible Structures
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(215, 213, 204);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, colW, cardH, 'FD');
  doc.setFillColor(18, 18, 18);
  doc.rect(margin, y, colW, 1, 'F');

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 60, 11);
  doc.text(toPdfSafeText('01 · ESTRUCTURAS Y CAPAS VISIBLES'), margin + 3, y + 5.5);

  const layersList: Array<[string, boolean]> = [
    ['Esqueleto óseo completo', snapshot.layers.skeleton],
    ['Tendones y músculos elásticos', snapshot.layers.tendons],
    ['Eje de centro de masas y vectores', snapshot.layers.vectors],
    [
      'Heatmaps pelvis y columna',
      snapshot.comparative.isComparativeMode && snapshot.layers.heatmap,
    ],
    [`Contornos 3D (${snapshot.layers.outlineWeightLabel})`, snapshot.layers.outlines],
    ['Etiquetas espaciales RA', snapshot.layers.arPins],
  ];

  let ly = y + 11.5;
  layersList.forEach(([label, active]) => {
    doc.setFillColor(active ? 21 : 165, active ? 111 : 165, active ? 85 : 158);
    doc.rect(margin + 3, ly - 2.6, 3.2, 3.2, 'F');
    doc.setFont('helvetica', active ? 'bold' : 'normal');
    doc.setFontSize(8);
    doc.setTextColor(active ? 18 : 120, active ? 18 : 120, active ? 18 : 114);
    doc.text(fitPdfLine(`${label} (${active ? 'Visible' : 'Oculto'})`, colW - 11), margin + 8, ly);
    ly += 5.7;
  });

  // Card 02: Camera Telemetry
  const rx = margin + colW + colGap;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(215, 213, 204);
  doc.rect(rx, y, colW, cardH, 'FD');
  doc.setFillColor(31, 95, 168);
  doc.rect(rx, y, colW, 1, 'F');

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(31, 95, 168);
  doc.text(toPdfSafeText('02 · ÁNGULOS Y PARÁMETROS DE CÁMARA'), rx + 3, y + 5.5);

  const camList: Array<[string, string]> = [
    ['Preset / enfoque', snapshot.camera.presetLabel],
    ['Azimut (horizontal)', `${formatNum(snapshot.camera.azimuthDeg)}°`],
    ['Elevación (vertical)', `${formatNum(snapshot.camera.elevationDeg)}°`],
    ['Distancia al modelo', `${formatNum(snapshot.camera.distance, 2)} m`],
    ['Campo de visión', `${formatNum(snapshot.camera.fovDeg, 0)}°`],
    [
      'Posición cámara',
      `(${formatNum(snapshot.camera.position[0], 2)}, ${formatNum(snapshot.camera.position[1], 2)}, ${formatNum(snapshot.camera.position[2], 2)})`,
    ],
    [
      'Objetivo (target)',
      `(${formatNum(snapshot.camera.target[0], 2)}, ${formatNum(snapshot.camera.target[1], 2)}, ${formatNum(snapshot.camera.target[2], 2)})`,
    ],
  ];

  let cy = y + 11.2;
  camList.forEach(([k, v]) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(92, 92, 86);
    doc.text(toPdfSafeText(k), rx + 3, cy);
    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(18, 18, 18);
    doc.text(fitPdfLine(v, colW * 0.56), rx + colW - 3, cy, { align: 'right' });
    cy += 5.1;
  });

  y += cardH + 4;

  // Card 03: Heatmaps & Running Cycle Telemetry
  const heatH = 47;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(215, 213, 204);
  doc.rect(margin, y, contentW, heatH, 'FD');
  doc.setFillColor(180, 35, 24);
  doc.rect(margin, y, contentW, 1, 'F');

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 35, 24);
  doc.text(
    toPdfSafeText('03 · ESTADO DE HEATMAPS DINÁMICOS Y TELEMETRÍA DEL CICLO DE CARRERA'),
    margin + 3,
    y + 5.5
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(18, 18, 18);
  const heatSummary = !snapshot.comparative.isComparativeMode
    ? 'Vista individual/fósil - sin heatmap comparativo activo'
    : `Heatmap: ${snapshot.layers.heatmap ? 'ACTIVO' : 'DESACTIVADO'} · Fase ${snapshot.comparative.gaitPhasePercent}% (${snapshot.comparative.gaitStageLabel}) · ${snapshot.comparative.superpositionLabel}`;
  doc.text(fitPdfLine(heatSummary, contentW - 6), margin + 3, y + 11);

  const tel = snapshot.comparative.telemetry;
  const pdfBars: Array<{ label: string; value: number; detail: string }> = [
    {
      label: 'Pan troglodytes · Pelvis (iliones planos)',
      value: tel.primatePelvisLoad,
      detail: `${Math.round(tel.primatePelvisLoad * 100)}% · Basc. ${formatNum(tel.primatePelvicTiltDeg)}° · ${getHeatmapZoneLabel(tel.primatePelvisLoad)}`,
    },
    {
      label: 'Homo sapiens · Pelvis (en cuenca)',
      value: tel.homoPelvisLoad,
      detail: `${Math.round(tel.homoPelvisLoad * 100)}% · Basc. ${formatNum(tel.homoPelvicTiltDeg)}° · ${getHeatmapZoneLabel(tel.homoPelvisLoad)}`,
    },
    {
      label: 'Pan troglodytes · Columna lumbar (en C)',
      value: tel.primateSpineLoad,
      detail: `${Math.round(tel.primateSpineLoad * 100)}% · Tronco ${formatNum(tel.primateTrunkPitchDeg)}° · ${getHeatmapZoneLabel(tel.primateSpineLoad)}`,
    },
    {
      label: 'Homo sapiens · Columna lumbar (en S)',
      value: tel.homoSpineLoad,
      detail: `${Math.round(tel.homoSpineLoad * 100)}% · Tronco ${formatNum(tel.homoTrunkPitchDeg)}° · ${getHeatmapZoneLabel(tel.homoSpineLoad)}`,
    },
  ];

  let by = y + 16.8;
  const barW = contentW - 6;
  pdfBars.forEach((b) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(18, 18, 18);
    doc.text(fitPdfLine(b.label, barW * 0.52), margin + 3, by);

    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 74);
    doc.text(fitPdfLine(b.detail, barW * 0.46), pageW - margin - 3, by, { align: 'right' });

    doc.setFillColor(236, 235, 228);
    doc.rect(margin + 3, by + 1.4, barW, 2.5, 'F');

    const hex = getHeatmapHex(b.value);
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const bl = parseInt(hex.slice(5, 7), 16);
    doc.setFillColor(r, g, bl);
    doc.rect(margin + 3, by + 1.4, Math.max(2, barW * Math.min(1, b.value)), 2.5, 'F');
    by += 7.4;
  });

  y += heatH + 4;

  // Card 04: Active Anatomical Node + Student Observations Worksheet Box
  const remainingH = Math.max(46, pageH - y - 13);
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(215, 213, 204);
  doc.rect(margin, y, contentW, remainingH, 'FD');
  doc.setFillColor(21, 111, 85);
  doc.rect(margin, y, contentW, 1, 'F');

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(21, 111, 85);
  doc.text(
    toPdfSafeText(
      `04 · NODO ANATÓMICO SELECCIONADO (${snapshot.activeHotspot.arCode ?? 'BIO'}) Y OBSERVACIONES`
    ),
    margin + 3,
    y + 5.5
  );

  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(18, 18, 18);
  doc.text(
    fitPdfLine(`${snapshot.activeHotspot.title} — ${snapshot.activeHotspot.subtitle}`, contentW - 6),
    margin + 3,
    y + 11.2
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 46);
  const splitDetail = doc.splitTextToSize(
    toPdfSafeText(snapshot.activeHotspot.detail),
    contentW - 6
  ) as string[];
  doc.text(splitDetail.slice(0, 3), margin + 3, y + 16);

  let ny = y + 16 + Math.min(3, splitDetail.length) * 3.8 + 1.5;
  if (snapshot.activeHotspot.evidence) {
    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(92, 92, 86);
    const evSplit = doc.splitTextToSize(
      toPdfSafeText(`Evidencia: ${snapshot.activeHotspot.evidence}`),
      contentW - 6
    ) as string[];
    doc.text(evSplit.slice(0, 2), margin + 3, ny);
    ny += Math.min(2, evSplit.length) * 3.4 + 2;
  }

  doc.setDrawColor(225, 224, 218);
  doc.line(margin + 3, ny, pageW - margin - 3, ny);
  ny += 4.5;

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(180, 60, 11);
  doc.text('NOTAS DE ANÁLISIS DEL ESTUDIANTE:', margin + 3, ny);
  ny += 4.2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(18, 18, 18);
  const notesBody =
    cleanStudentNotes ||
    'Espacio reservado en la ficha de trabajo para argumentar el papel de la pelvis en cuenca, la lordosis lumbar en S y los tendones elásticos en la evolución del bipedismo y la carrera de resistencia.';
  const notesLines = doc.splitTextToSize(toPdfSafeText(notesBody), contentW - 6) as string[];
  doc.text(notesLines.slice(0, 5), margin + 3, ny);

  // Institutional Footer
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 114);
  doc.text(
    toPdfSafeText(
      'Diploma de Estudios Africanos · ULPGC · Módulo I · Tema 04: Biomecánica del bipedismo y carrera de resistencia'
    ),
    margin,
    pageH - 7
  );

  const filename = buildReportFilename(snapshot, 'pdf');
  doc.save(filename);
  return filename;
}
