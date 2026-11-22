import { useState } from 'react';
import { Landmark, Maximize2 } from 'lucide-react';
import type { EditorialPlateInfo } from '../data/curriculum';
import { useLightbox } from './LightboxContext';

interface EditorialPlateProps {
  plate: EditorialPlateInfo;
  fillHeight?: boolean;
  priority?: boolean;
}

export function EditorialPlate({
  plate,
  fillHeight = false,
  priority = false,
}: EditorialPlateProps) {
  const [failed, setFailed] = useState(false);
  const { openSingle } = useLightbox();

  const handleOpen = (opener?: HTMLElement | null) => {
    if (failed) return;
    openSingle(
      {
        src: plate.src,
        alt: plate.alt,
        title: plate.title,
        subtitle: `${plate.figLabel} · Lámina editorial (ULPGC)`,
        caption: plate.caption,
        credit: 'Lámina editorial · Diploma de Estudios Africanos (ULPGC)',
      },
      opener
    );
  };

  return (
    <figure className={`m-0 flex flex-col ${fillHeight ? 'h-full' : ''}`}>
      <div
        className={`group relative w-full overflow-hidden border border-hairline bg-paper ${
          fillHeight ? 'flex-1 min-h-[280px] lg:min-h-0' : plate.aspectClass
        }`}
      >
        {!failed ? (
          <>
            <img
              src={plate.src}
              alt={plate.alt}
              referrerPolicy="no-referrer"
              loading={priority ? 'eager' : 'lazy'}
              onError={() => setFailed(true)}
              onClick={(e) => handleOpen(e.currentTarget)}
              className={`w-full h-full object-cover cursor-zoom-in transition-transform duration-200 group-hover:scale-[1.015] ${
                fillHeight ? 'lg:absolute lg:inset-0' : ''
              }`}
            />
            <button
              type="button"
              onClick={(e) => handleOpen(e.currentTarget)}
              aria-label={`Ampliar lámina: ${plate.title}`}
              className="absolute bottom-2.5 right-2.5 min-h-[34px] px-2.5 py-1 bg-[#121212]/80 text-white border border-white/25 rounded font-mono text-[11px] inline-flex items-center gap-1.5 hover:bg-ochre hover:border-ochre transition-colors cursor-pointer no-print"
            >
              <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Ampliar</span>
            </button>
          </>
        ) : (
          <div className="w-full h-full min-h-[240px] flex flex-col items-center justify-center gap-3 p-8 text-center bg-gradient-to-br from-paper via-surface to-surface-high text-ink-muted">
            <Landmark className="w-8 h-8 text-ochre" strokeWidth={1.5} aria-hidden="true" />
            <div className="font-display text-lg font-semibold text-ink">{plate.title}</div>
            <p className="text-sm text-ink-muted max-w-md">{plate.caption}</p>
          </div>
        )}
      </div>
      <figcaption className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs leading-relaxed text-ink-muted">
        <span className="font-mono font-medium text-ink">{plate.figLabel}</span>
        <span aria-hidden="true">·</span>
        <span className="font-medium text-ink">{plate.title}</span>
        <span aria-hidden="true">—</span>
        <span className="italic">{plate.caption}</span>
      </figcaption>
    </figure>
  );
}
