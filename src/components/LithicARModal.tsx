import { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  Box,
  Check,
  Copy,
  Download,
  QrCode,
  Smartphone,
  X,
} from 'lucide-react';
import type { HenkeTaskSpec } from '../data/ethologyData';
import type { EthologyStone3DSpec } from '../data/visualSchemas3dData';
import { useModalFocusTrap } from '../utils/useModalFocusTrap';

export interface LithicARModalProps {
  isOpen: boolean;
  task: HenkeTaskSpec;
  stones: EthologyStone3DSpec[];
  initialStoneId: string | null;
  onClose: () => void;
  onLaunchWebXRHere: (taskId: HenkeTaskSpec['id'], stoneId: string) => void;
}

export function LithicARModal({
  isOpen,
  task,
  stones,
  initialStoneId,
  onClose,
  onLaunchWebXRHere,
}: LithicARModalProps) {
  const [selectedStoneId, setSelectedStoneId] = useState<string>(
    () => initialStoneId ?? stones[0]?.id ?? 't1-s1'
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrError, setQrError] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (initialStoneId && stones.some((s) => s.id === initialStoneId)) {
      setSelectedStoneId(initialStoneId);
    } else if (stones[0]) {
      setSelectedStoneId(stones[0].id);
    }
  }, [isOpen, initialStoneId, stones]);

  const activeStone = useMemo(
    () => stones.find((s) => s.id === selectedStoneId) ?? stones[0],
    [stones, selectedStoneId]
  );

  const arDeepLinkUrl = useMemo(() => {
    if (typeof window === 'undefined' || !activeStone) return '';
    const url = new URL(window.location.href);
    url.hash = '';
    url.searchParams.set('ar', 'lithic');
    url.searchParams.set('task', task.id);
    url.searchParams.set('stone', activeStone.id);
    return url.toString();
  }, [task.id, activeStone]);

  // Dynamically generate high-contrast scannable QR code whenever specimen or task changes
  useEffect(() => {
    if (!isOpen || !arDeepLinkUrl) return;
    let cancelled = false;
    setQrError(false);

    QRCode.toDataURL(arDeepLinkUrl, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 260,
      color: {
        dark: '#14171d',
        light: '#ffffff',
      },
    })
      .then((dataUrl) => {
        if (!cancelled) {
          setQrDataUrl(dataUrl);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setQrError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, arDeepLinkUrl]);

  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  useModalFocusTrap({
    isOpen: isOpen && Boolean(activeStone),
    containerRef: dialogRef,
    onClose,
  });

  if (!isOpen || !activeStone) return null;

  const isLimestone = activeStone.material === 'limestone';

  const handleCopyLink = async () => {
    if (!arDeepLinkUrl) return;
    try {
      await navigator.clipboard.writeText(arDeepLinkUrl);
      setCopied(true);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        copyTimerRef.current = null;
        setCopied(false);
      }, 2200);
    } catch {
      setCopied(false);
    }
  };

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
        aria-labelledby="lithic-ar-modal-title"
        className="w-full max-w-[700px] max-h-[92vh] bg-canvas border border-ink border-t-4 border-t-ochre shadow-2xl flex flex-col overflow-hidden focus:outline-none"
      >
        {/* Sticky Modal Header */}
        <div className="px-4 sm:px-5 py-3.5 bg-paper border-b border-hairline flex items-start justify-between gap-3 shrink-0">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-mono text-xs text-ochre font-semibold inline-flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Realidad Aumentada WebXR · Escala real 1:1 (6 × 6 × 4 cm)</span>
            </span>
            <h3
              id="lithic-ar-modal-title"
              className="font-display text-lg sm:text-xl font-semibold text-ink m-0 leading-tight"
            >
              Visualizar herramienta lítica en tu escritorio
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana de realidad aumentada"
            className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center border border-hairline hover:border-ink bg-canvas text-ink rounded cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Left: Dynamic QR Code Card */}
          <div className="md:col-span-5 flex flex-col items-center gap-3 bg-paper border border-hairline p-4">
            <div className="w-[216px] h-[216px] bg-white border border-hairline flex items-center justify-center p-2">
              {qrError ? (
                <p className="font-mono text-xs text-ink-muted text-center px-2 m-0">
                  No se pudo generar el código QR. Usa el botón de enlace directo.
                </p>
              ) : qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`Código QR WebXR para proyectar ${activeStone.label} en realidad aumentada`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="font-mono text-xs text-ink-muted">Generando QR…</span>
              )}
            </div>

            <div className="text-center flex flex-col gap-0.5">
              <span className="font-mono text-xs font-semibold text-ink">
                {activeStone.label}
              </span>
              <span className="font-mono text-[11px] text-ink-muted">
                {isLimestone
                  ? 'Caliza blanda · Equotip 27,05'
                  : 'Arenisca dura · Equotip 57,09'}
                {activeStone.modified ? ' · Con hoyuelo de uso' : ' · Intacta'}
              </span>
            </div>

            <div className="w-full flex flex-col gap-1.5">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full min-h-[40px] px-3 py-1.5 font-mono text-xs bg-canvas hover:border-ink border border-hairline text-ink rounded inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
                    <span className="text-forest font-semibold">Enlace AR copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copiar enlace WebXR</span>
                  </>
                )}
              </button>
              <span className="sr-only" role="status" aria-live="polite">
                {copied ? 'Enlace de realidad aumentada copiado al portapapeles' : ''}
              </span>

              {qrDataUrl && !qrError && (
                <a
                  href={qrDataUrl}
                  download={`qr-webxr-${task.id}-${activeStone.id}.png`}
                  className="w-full min-h-[38px] px-3 py-1.5 font-mono text-xs bg-canvas hover:border-ink border border-hairline text-ink-muted hover:text-ink rounded inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Descargar QR (PNG)</span>
                </a>
              )}
            </div>
          </div>

          {/* Right: Specimen Switcher + Instructions + Direct Launch */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs font-semibold text-ink">
                1. Selecciona el bloque lítico a proyectar ({task.shortLabel})
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {stones.map((st) => {
                  const isSelected = st.id === activeStone.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStoneId(st.id)}
                      aria-pressed={isSelected}
                      className={`min-h-[40px] px-2.5 py-1.5 text-left font-mono text-[11.5px] border rounded cursor-pointer transition-colors flex flex-col gap-0.5 ${
                        isSelected
                          ? 'bg-ink text-white border-ink'
                          : 'bg-paper text-ink border-hairline hover:border-ink'
                      }`}
                    >
                      <span className="font-semibold truncate">{st.label}</span>
                      <span
                        className={`text-[11px] ${
                          isSelected ? 'text-white/90' : 'text-ink-muted'
                        }`}
                      >
                        {st.material === 'limestone' ? 'Yunque · 27,05' : 'Percutor · 57,09'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-paper border border-hairline p-3.5 flex flex-col gap-2">
              <span className="font-mono text-xs font-semibold text-ink inline-flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
                <span>2. Cómo proyectarlo sobre tu escritorio</span>
              </span>
              <ol className="m-0 pl-4 text-xs leading-relaxed text-ink-muted space-y-1">
                <li>
                  Escanea el <strong className="text-ink">código QR dinámico</strong> con la cámara
                  de tu teléfono móvil.
                </li>
                <li>
                  Pulsa <strong className="text-ink">Proyectar en escritorio (WebXR)</strong> (o{' '}
                  <strong className="text-ink">Proyectar con cámara AR</strong> en iOS) y apunta
                  lentamente a tu mesa hasta que aparezca la retícula de anclaje.
                </li>
                <li>
                  Toca la pantalla para fijar el bloque a{' '}
                  <strong className="text-ink">escala real 1:1 (6 × 6 × 4 cm)</strong> junto a su
                  escala arqueológica y examinar sus huellas de percusión.
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Pinned Action Footer */}
        <div className="px-4 sm:px-5 py-3.5 bg-paper border-t border-hairline flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onLaunchWebXRHere(task.id, activeStone.id)}
            className="min-h-[42px] px-4 py-2 font-mono text-xs font-semibold bg-ochre hover:bg-ink text-white border border-ochre hover:border-ink rounded inline-flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Box className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Abrir visor WebXR en este dispositivo</span>
          </button>
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

export default LithicARModal;
