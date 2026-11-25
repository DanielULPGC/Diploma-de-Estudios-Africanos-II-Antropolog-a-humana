import {
  AlignJustify,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Type,
  X,
} from 'lucide-react';
import {
  COURSE_CHAPTERS,
  getBlockMeta,
  type CourseBlockId,
} from '../data/courseNavigation';

export type FontScaleOption = 'normal' | 'large' | 'xlarge';
export type PaperToneOption = 'canvas' | 'warm' | 'contrast';
export type LineSpacingOption = 'standard' | 'relaxed';

export interface ReadingPrefs {
  fontScale: FontScaleOption;
  paperTone: PaperToneOption;
  lineSpacing: LineSpacingOption;
}

export const DEFAULT_READING_PREFS: ReadingPrefs = {
  fontScale: 'large',
  paperTone: 'canvas',
  lineSpacing: 'relaxed',
};

const READING_PREFS_KEY = 'ulpgc_dea_reading_prefs_v2';

export function loadReadingPrefs(): ReadingPrefs {
  if (typeof window === 'undefined') return DEFAULT_READING_PREFS;
  try {
    const raw = window.localStorage.getItem(READING_PREFS_KEY);
    if (!raw) return DEFAULT_READING_PREFS;
    const parsed = JSON.parse(raw) as Partial<ReadingPrefs>;
    const fontScale: FontScaleOption =
      parsed.fontScale === 'normal' ||
      parsed.fontScale === 'large' ||
      parsed.fontScale === 'xlarge'
        ? parsed.fontScale
        : DEFAULT_READING_PREFS.fontScale;
    const paperTone: PaperToneOption =
      parsed.paperTone === 'warm' || parsed.paperTone === 'contrast' ? parsed.paperTone : 'canvas';
    const lineSpacing: LineSpacingOption =
      parsed.lineSpacing === 'standard' || parsed.lineSpacing === 'relaxed'
        ? parsed.lineSpacing
        : DEFAULT_READING_PREFS.lineSpacing;
    return { fontScale, paperTone, lineSpacing };
  } catch {
    return DEFAULT_READING_PREFS;
  }
}

export function saveReadingPrefs(prefs: ReadingPrefs): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(READING_PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage failures in restricted contexts
  }
}

export function getReadingPrefsClassNames(prefs: ReadingPrefs): string {
  const classes: string[] = [];
  if (prefs.fontScale === 'large') classes.push('reading-scale-large');
  if (prefs.fontScale === 'xlarge') classes.push('reading-scale-xlarge');
  if (prefs.paperTone === 'warm') classes.push('reading-tone-warm');
  if (prefs.paperTone === 'contrast') classes.push('reading-tone-contrast');
  if (prefs.lineSpacing === 'relaxed') classes.push('reading-spacing-relaxed');
  return classes.join(' ');
}

interface ReadingPrefsInlineStripProps {
  prefs: ReadingPrefs;
  onChange: (next: ReadingPrefs) => void;
  compact?: boolean;
}

export function ReadingPrefsInlineStrip({
  prefs,
  onChange,
  compact = false,
}: ReadingPrefsInlineStripProps) {
  const scaleOptions: Array<{ id: FontScaleOption; label: string; aria: string }> = [
    { id: 'normal', label: 'A', aria: 'Tamaño de letra estándar (17 px)' },
    { id: 'large', label: 'A+', aria: 'Tamaño de letra grande (18,5 px)' },
    { id: 'xlarge', label: 'A++', aria: 'Tamaño de letra muy grande (20,5 px)' },
  ];

  const toneOptions: Array<{ id: PaperToneOption; label: string }> = [
    { id: 'canvas', label: 'Blanco' },
    { id: 'warm', label: 'Papel cálido' },
    { id: 'contrast', label: 'Alto contraste' },
  ];

  return (
    <div
      role="group"
      aria-label="Preferencias de lectura: tamaño de texto, papel e interlineado"
      className={`flex flex-wrap items-center gap-2 ${compact ? '' : 'pt-3 border-t border-hairline'}`}
    >
      {!compact && (
        <span className="font-mono text-xs text-ink-muted inline-flex items-center gap-1.5 mr-1">
          <Type className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
          <span>Tamaño y lectura:</span>
        </span>
      )}

      {/* Font Size Scale */}
      <div
        role="group"
        aria-label="Tamaño de letra"
        className="inline-flex items-center p-0.5 bg-canvas border border-hairline rounded"
      >
        {scaleOptions.map((opt) => {
          const active = prefs.fontScale === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              aria-label={opt.aria}
              aria-pressed={active}
              onClick={() => onChange({ ...prefs, fontScale: opt.id })}
              className={`min-h-[36px] min-w-[40px] px-2.5 py-1 font-mono text-xs rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-ink text-white font-semibold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Paper Tone */}
      <div
        role="group"
        aria-label="Tono de papel"
        className="inline-flex items-center p-0.5 bg-canvas border border-hairline rounded"
      >
        {toneOptions.map((opt) => {
          const active = prefs.paperTone === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange({ ...prefs, paperTone: opt.id })}
              className={`min-h-[36px] px-2.5 py-1 font-mono text-xs rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-ochre text-white font-semibold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Line Spacing */}
      <button
        type="button"
        aria-pressed={prefs.lineSpacing === 'relaxed'}
        onClick={() =>
          onChange({
            ...prefs,
            lineSpacing: prefs.lineSpacing === 'relaxed' ? 'standard' : 'relaxed',
          })
        }
        className={`min-h-[38px] px-3 py-1 font-mono text-xs rounded border inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
          prefs.lineSpacing === 'relaxed'
            ? 'bg-ink text-white border-ink font-medium'
            : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
        }`}
      >
        <AlignJustify className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Interlineado</span>
      </button>
    </div>
  );
}

interface ReadingModeToolbarProps {
  prefs: ReadingPrefs;
  scrollProgress: number;
  activeSectionId: string;
  activeBlockId: CourseBlockId;
  onChangePrefs: (next: ReadingPrefs) => void;
  onNavigateChapter: (sectionId: string) => void;
  onOpenSearch: () => void;
  onOpenGlossary: () => void;
  onExitReadingMode: () => void;
}

export function ReadingModeToolbar({
  prefs,
  scrollProgress,
  activeSectionId,
  activeBlockId,
  onChangePrefs,
  onNavigateChapter,
  onExitReadingMode,
}: ReadingModeToolbarProps) {
  const activeIdx = Math.max(
    0,
    COURSE_CHAPTERS.findIndex((c) => c.id === activeSectionId)
  );
  const current = COURSE_CHAPTERS[activeIdx] ?? COURSE_CHAPTERS[0];
  const prev = activeIdx > 0 ? COURSE_CHAPTERS[activeIdx - 1] : null;
  const next = activeIdx < COURSE_CHAPTERS.length - 1 ? COURSE_CHAPTERS[activeIdx + 1] : null;
  const activeBlock = getBlockMeta(activeBlockId);
  const pct = Math.round(scrollProgress * 100);

  return (
    <div
      role="region"
      data-sticky-topbar="true"
      aria-label="Barra de herramientas de Modo solo lectura"
      className="sticky top-0 z-[45] bg-canvas/95 backdrop-blur-xs border-b border-hairline no-print shadow-xs"
    >
      <div className="max-w-[980px] mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Solo lectura indicator + Direct Chapter Selector + Prev/Next */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="hidden lg:inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-ochre pr-2 border-r border-hairline whitespace-nowrap">
            <BookOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Solo lectura · {pct}%</span>
          </span>

          <button
            type="button"
            disabled={!prev}
            onClick={() => prev && onNavigateChapter(prev.id)}
            aria-label={prev ? `Ir al apartado anterior: ${prev.label}` : 'Primer apartado'}
            className="min-h-[38px] min-w-[38px] inline-flex items-center justify-center rounded border border-hairline bg-paper text-ink hover:border-ink disabled:opacity-35 cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>

          <label className="sr-only" htmlFor="solo-lectura-chapter-select">
            Cambiar de apartado en modo solo lectura
          </label>
          <select
            id="solo-lectura-chapter-select"
            value={current.id}
            onChange={(e) => onNavigateChapter(e.target.value)}
            aria-label={`Apartado actual: Bloque ${activeBlock.roman}, ${current.label}`}
            className="min-h-[38px] max-w-[190px] sm:max-w-[230px] px-2.5 py-1 text-xs font-medium bg-paper text-ink border border-hairline rounded hover:border-ink cursor-pointer truncate"
          >
            {COURSE_CHAPTERS.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.num} · {ch.shortLabel}
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={!next}
            onClick={() => next && onNavigateChapter(next.id)}
            aria-label={next ? `Ir al siguiente apartado: ${next.label}` : 'Último apartado'}
            className="min-h-[38px] min-w-[38px] inline-flex items-center justify-center rounded border border-hairline bg-paper text-ink hover:border-ink disabled:opacity-35 cursor-pointer shrink-0"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Center: Compact reading ergonomics controls (A / A+ / A++ · Paper · Spacing) */}
        <ReadingPrefsInlineStrip prefs={prefs} onChange={onChangePrefs} compact />

        {/* Right: Exit Solo Lectura */}
        <button
          type="button"
          onClick={onExitReadingMode}
          className="min-h-[38px] px-3.5 py-1 text-xs font-semibold text-white bg-ink rounded inline-flex items-center gap-1.5 hover:bg-ochre transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          aria-label="Salir del Modo solo lectura (tecla Escape)"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Salir</span>
        </button>
      </div>

      {/* Reading progress hairline */}
      <div className="h-[2px] w-full bg-transparent overflow-hidden" aria-hidden="true">
        <div
          className="h-full w-full bg-ochre origin-left transition-transform duration-100"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>
    </div>
  );
}
