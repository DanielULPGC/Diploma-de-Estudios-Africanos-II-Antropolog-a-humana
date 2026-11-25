import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  Link2,
  Search,
  X,
} from 'lucide-react';
import { GLOSSARY_TERMS, type GlossaryTerm } from '../data/glossary';
import {
  getContextualProfileForTerm,
  type ContextualCourseMention,
} from '../data/glossaryContextualIndex';
import { normalizeSearchText, type CourseDeepAction } from '../data/courseNavigation';
import { useModalFocusTrap } from '../utils/useModalFocusTrap';

interface GlossaryContextualSidebarProps {
  term: GlossaryTerm | null;
  history: GlossaryTerm[];
  onSelectTerm: (term: GlossaryTerm, pushToHistory?: boolean) => void;
  onGoBack: () => void;
  onClose: () => void;
  onJumpToGlossary: (term: GlossaryTerm) => void;
  onNavigateCourse: (action: CourseDeepAction) => void;
}

function renderHighlightedSnippet(snippet: string, matchedPhrase: string) {
  if (!matchedPhrase) return snippet;
  const idx = snippet.toLowerCase().indexOf(matchedPhrase.toLowerCase());
  if (idx === -1) return snippet;
  const before = snippet.slice(0, idx);
  const match = snippet.slice(idx, idx + matchedPhrase.length);
  const after = snippet.slice(idx + matchedPhrase.length);
  return (
    <>
      {before}
      <mark className="bg-ochre-soft text-ink font-semibold px-0.5 rounded-[2px]">{match}</mark>
      {after}
    </>
  );
}

function categoryToneClass(cat: GlossaryTerm['category']): string {
  if (cat === 'paleobotanica') return 'text-forest';
  if (cat === 'metodos') return 'text-lapis';
  if (cat === 'etologia') return 'text-plum';
  return 'text-ochre';
}

function matchTypeLabel(type: ContextualCourseMention['matchType']): string {
  if (type === 'referencia-directa') return 'Referencia directa';
  if (type === 'mencion-textual') return 'Mención en temario';
  return 'Módulo asociado';
}

export function GlossaryContextualSidebar({
  term,
  history,
  onSelectTerm,
  onGoBack,
  onClose,
  onJumpToGlossary,
  onNavigateCourse,
}: GlossaryContextualSidebarProps) {
  const [quickQuery, setQuickQuery] = useState('');
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<string>('TODOS');
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const scrollBodyRef = useRef<HTMLDivElement | null>(null);

  useModalFocusTrap({
    isOpen: Boolean(term),
    containerRef: panelRef,
    initialFocusRef: closeBtnRef,
    onClose,
  });

  useEffect(() => {
    setQuickQuery('');
    setSelectedBlockFilter('TODOS');
    if (scrollBodyRef.current) {
      scrollBodyRef.current.scrollTop = 0;
    }
  }, [term?.id]);

  const profile = useMemo(() => {
    if (!term) return null;
    return getContextualProfileForTerm(term);
  }, [term]);

  const quickSearchMatches = useMemo(() => {
    const q = normalizeSearchText(quickQuery);
    if (!q) return [];
    return GLOSSARY_TERMS.filter((t) => {
      if (term && t.id === term.id) return false;
      return (
        normalizeSearchText(t.term).includes(q) ||
        normalizeSearchText(t.definition).includes(q) ||
        normalizeSearchText(t.moduleContext).includes(q)
      );
    }).slice(0, 6);
  }, [quickQuery, term]);

  const availableBlocks = useMemo(() => {
    if (!profile) return [];
    const seen = new Map<string, string>();
    profile.mentions.forEach((m) => {
      if (!seen.has(m.blockRoman)) {
        seen.set(m.blockRoman, m.blockTitle);
      }
    });
    return Array.from(seen.entries()).map(([roman, title]) => ({ roman, title }));
  }, [profile]);

  const visibleMentions = useMemo(() => {
    if (!profile) return [];
    if (selectedBlockFilter === 'TODOS') return profile.mentions;
    return profile.mentions.filter((m) => m.blockRoman === selectedBlockFilter);
  }, [profile, selectedBlockFilter]);

  if (!term || !profile) return null;

  const previousTerm = history.length > 0 ? history[history.length - 1] : null;

  return (
    <div
      className="fixed inset-0 z-[55] flex justify-end bg-ink/35 backdrop-blur-[1px] no-print"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contextual-glossary-sidebar-title"
        className="w-full max-w-[540px] h-full bg-canvas border-l-2 border-l-ink shadow-2xl flex flex-col focus:outline-none"
      >
        {/* Top Sticky Header */}
        <header className="px-5 sm:px-6 pt-5 pb-4 bg-paper border-b border-hairline flex flex-col gap-3 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1 min-w-0">
              {previousTerm && (
                <button
                  type="button"
                  onClick={onGoBack}
                  className="self-start mb-1 font-mono text-[11px] text-lapis hover:text-ink inline-flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3 shrink-0" aria-hidden="true" />
                  <span className="truncate max-w-[300px]">
                    Volver a {previousTerm.term.split('(')[0].trim()}
                  </span>
                </button>
              )}

              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px] text-ink-muted">
                <span className={`font-semibold ${categoryToneClass(term.category)}`}>
                  {term.categoryLabel}
                </span>
                <span aria-hidden="true">·</span>
                <span>Búsqueda contextual del glosario</span>
              </div>

              <h2
                id="contextual-glossary-sidebar-title"
                className="font-display text-2xl sm:text-[1.65rem] font-semibold text-ink leading-tight m-0"
              >
                {term.term}
              </h2>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px] text-ink-muted">
                <span>{term.moduleContext}</span>
                {profile.englishTerm && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="italic">{profile.englishTerm}</span>
                  </>
                )}
              </div>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Cerrar vista lateral de búsqueda contextual"
              className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded border border-hairline bg-canvas text-ink hover:border-ink transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Instant Contextual Term Switcher */}
          <div className="relative">
            <Search
              className="w-3.5 h-3.5 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder={`Consultar otro término (${GLOSSARY_TERMS.length} disponibles)…`}
              aria-label="Buscar otro término del glosario desde la vista lateral"
              className="w-full min-h-[38px] pl-9 pr-3 py-1.5 text-xs bg-canvas border border-hairline rounded text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none"
            />
            {quickSearchMatches.length > 0 && (
              <ul
                role="listbox"
                aria-label="Resultados rápidos del glosario"
                className="absolute left-0 right-0 top-full mt-1 z-20 bg-canvas border border-ink shadow-lg divide-y divide-hairline m-0 p-0 list-none max-h-60 overflow-y-auto"
              >
                {quickSearchMatches.map((match) => (
                  <li key={match.id}>
                    <button
                      type="button"
                      onClick={() => onSelectTerm(match, true)}
                      className="w-full px-3.5 py-2.5 text-left hover:bg-paper flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="min-w-0 flex flex-col">
                        <span className="font-display text-sm font-semibold text-ink truncate">
                          {match.term}
                        </span>
                        <span className="font-mono text-[10.5px] text-ink-muted truncate">
                          {match.categoryLabel} · {match.moduleContext}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-ochre shrink-0" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        {/* Scrollable Editorial Body */}
        <div
          ref={scrollBodyRef}
          className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 flex flex-col gap-6"
        >
          {/* 1. Core + Extended Definition */}
          <section aria-label="Definición y ampliación conceptual" className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] font-semibold text-ochre">
                Definición operativa
              </span>
              <p className="text-[15px] leading-[1.7] text-ink m-0">{term.definition}</p>
            </div>

            <div className="bg-paper border border-hairline border-t-2 border-t-ochre p-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-ink">
                <BookOpen className="w-3.5 h-3.5 text-ochre shrink-0" aria-hidden="true" />
                <span>Definición extendida y alcance en el Diploma</span>
              </div>
              <p className="text-xs sm:text-sm leading-[1.68] text-ink m-0">
                {profile.extendedDefinition}
              </p>

              {profile.keyPoints.length > 0 && (
                <ul className="m-0 pt-2.5 border-t border-hairline pl-4 flex flex-col gap-1.5 text-xs leading-relaxed text-ink-muted">
                  {profile.keyPoints.map((pt) => (
                    <li key={pt} className="text-ink">
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* 2. Contextual Mentions Across Course Sections */}
          <section
            aria-label="Secciones del curso donde se menciona este término"
            className="flex flex-col gap-3.5 pt-5 border-t border-hairline"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-lapis">
                <Compass className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Dónde aparece en el curso</span>
              </div>
              <span className="font-mono text-[11px] text-ink-muted tabular-nums">
                {profile.mentions.length}{' '}
                {profile.mentions.length === 1 ? 'enlace directo' : 'enlaces directos'}
              </span>
            </div>

            {availableBlocks.length > 1 && (
              <div
                className="flex flex-wrap items-center gap-1.5"
                role="group"
                aria-label="Filtrar menciones por bloque del curso"
              >
                <button
                  type="button"
                  aria-pressed={selectedBlockFilter === 'TODOS'}
                  onClick={() => setSelectedBlockFilter('TODOS')}
                  className={`min-h-[32px] px-2.5 py-1 font-mono text-[11px] rounded border transition-colors cursor-pointer ${
                    selectedBlockFilter === 'TODOS'
                      ? 'bg-ink text-white border-ink'
                      : 'bg-paper text-ink-muted border-hairline hover:border-ink hover:text-ink'
                  }`}
                >
                  Todos ({profile.mentions.length})
                </button>
                {availableBlocks.map((blk) => {
                  const isActive = selectedBlockFilter === blk.roman;
                  const cnt = profile.mentions.filter((m) => m.blockRoman === blk.roman).length;
                  return (
                    <button
                      key={blk.roman}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setSelectedBlockFilter(blk.roman)}
                      className={`min-h-[32px] px-2.5 py-1 font-mono text-[11px] rounded border transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-lapis text-white border-lapis'
                          : 'bg-paper text-ink-muted border-hairline hover:border-ink hover:text-ink'
                      }`}
                    >
                      Bloque {blk.roman} ({cnt})
                    </button>
                  );
                })}
              </div>
            )}

            <ul className="m-0 p-0 list-none flex flex-col gap-3">
              {visibleMentions.map((mention) => (
                <li
                  key={mention.id}
                  className="bg-paper border border-hairline hover:border-ink transition-colors p-4 flex flex-col gap-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-ink-muted">
                    <span className="text-ink font-medium">
                      Bloque {mention.blockRoman} · {mention.sectionLabel}
                    </span>
                    <span
                      className={
                        mention.matchType === 'referencia-directa'
                          ? 'text-forest font-medium'
                          : 'text-ink-subtle'
                      }
                    >
                      {matchTypeLabel(mention.matchType)}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-semibold text-ink leading-snug m-0">
                    {mention.itemTitle}
                  </h3>

                  <p className="text-xs leading-relaxed text-ink-muted m-0">
                    {renderHighlightedSnippet(mention.snippet, mention.matchedPhrase)}
                  </p>

                  <div className="pt-2 border-t border-hairline flex justify-end">
                    <button
                      type="button"
                      onClick={() => onNavigateCourse(mention.action)}
                      className="min-h-[36px] px-3 py-1 font-mono text-xs font-medium text-ink bg-canvas border border-hairline rounded hover:border-ochre hover:text-ochre inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Ir a esta sección</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Related Glossary Terms (Conceptual Network) */}
          {profile.relatedTerms.length > 0 && (
            <section
              aria-label="Términos relacionados del glosario"
              className="flex flex-col gap-3 pt-5 border-t border-hairline"
            >
              <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-ink">
                <Link2 className="w-3.5 h-3.5 text-ochre shrink-0" aria-hidden="true" />
                <span>Red conceptual · Términos relacionados</span>
              </div>

              <div className="flex flex-col border-t border-hairline">
                {profile.relatedTerms.map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => onSelectTerm(rel, true)}
                    className="py-2.5 px-3 border-b border-hairline text-left hover:bg-paper transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="min-w-0 flex flex-col gap-0.5">
                      <span className="font-display text-sm font-semibold text-ink group-hover:text-ochre transition-colors">
                        {rel.term}
                      </span>
                      <span className="font-mono text-[10.5px] text-ink-muted truncate">
                        {rel.categoryLabel} · {rel.moduleContext}
                      </span>
                    </div>
                    <ArrowRight
                      className="w-3.5 h-3.5 text-ink-subtle group-hover:text-ochre shrink-0 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky Footer */}
        <footer className="px-5 sm:px-6 py-3.5 bg-paper border-t border-hairline flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onJumpToGlossary(term)}
            className="min-h-[40px] px-3.5 py-1.5 font-mono text-xs font-medium text-ink bg-canvas border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
            <span>Ver en el glosario A–Z</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-3.5 py-1.5 font-mono text-xs font-semibold text-white bg-ink rounded hover:bg-ochre transition-colors cursor-pointer"
          >
            Cerrar · Esc
          </button>
        </footer>
      </aside>
    </div>
  );
}
