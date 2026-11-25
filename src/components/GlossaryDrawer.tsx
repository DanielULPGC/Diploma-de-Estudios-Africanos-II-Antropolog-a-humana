import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ChevronDown, PanelRightOpen, Search } from 'lucide-react';
import {
  GLOSSARY_CATEGORIES,
  GLOSSARY_TERMS,
  type GlossaryCategory,
} from '../data/glossary';
import { ETHOLOGY_GLOSSARY_TERMS } from '../data/ethologyGlossary';
import { useGlossary } from './GlossaryContext';
import { EthologyGlossary } from './EthologyGlossary';

const PAGE_STEP = 40;

function firstLetter(term: string): string {
  const norm = term
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .charAt(0)
    .toUpperCase();
  return /[A-Z]/.test(norm) ? norm : '#';
}

export function GlossaryDrawer() {
  const { jumpRequest, openTerm } = useGlossary();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [category, setCategory] = useState<GlossaryCategory | 'todos'>('todos');
  const [activeLetter, setActiveLetter] = useState<string>('TODAS');
  const [query, setQuery] = useState('');
  const [visibleLimit, setVisibleLimit] = useState(PAGE_STEP);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(['flora-c3-c4', 'tafonomia'])
  );

  useEffect(() => {
    if (!jumpRequest) return;
    setIsDrawerOpen(true);
    const isEthologyTerm = ETHOLOGY_GLOSSARY_TERMS.some((t) => t.id === jumpRequest.termId);
    setCategory(isEthologyTerm ? 'etologia' : 'todos');
    setActiveLetter('TODAS');
    setVisibleLimit(PAGE_STEP);
    setQuery(isEthologyTerm ? '' : jumpRequest.query);
    if (jumpRequest.termId) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.add(jumpRequest.termId);
        return next;
      });
    }
  }, [jumpRequest]);

  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    GLOSSARY_TERMS.forEach((t) => {
      if (category === 'todos' || t.category === category) {
        set.add(firstLetter(t.term));
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));
  }, [category]);

  const filteredTerms = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY_TERMS.filter((item) => {
      if (category !== 'todos' && item.category !== category) return false;
      if (activeLetter !== 'TODAS' && firstLetter(item.term) !== activeLetter) return false;
      if (q) {
        const match =
          item.term.toLowerCase().includes(q) ||
          item.definition.toLowerCase().includes(q) ||
          item.moduleContext.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [category, activeLetter, query]);

  const visibleTerms = filteredTerms.slice(0, visibleLimit);

  const toggleTerm = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allVisibleExpanded =
    visibleTerms.length > 0 && visibleTerms.every((t) => expandedIds.has(t.id));

  const toggleAllVisible = () => {
    if (allVisibleExpanded) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(visibleTerms.map((t) => t.id)));
    }
  };

  const categoryColor = (cat: GlossaryCategory) => {
    if (cat === 'paleobotanica') return 'text-forest';
    if (cat === 'metodos') return 'text-lapis';
    if (cat === 'etologia') return 'text-plum';
    return 'text-ochre';
  };

  return (
    <section
      id="sec-glosario"
      className="pt-10 border-t border-hairline scroll-mt-20 hide-when-printing-seminar no-print"
      aria-label="Glosario técnico desplegable de paleoantropología, paleobotánica y etología"
    >
      <div className="bg-paper border-t-2 border-t-rule border-b border-b-hairline">
        {/* Main collapsible header */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen((o) => !o)}
          aria-expanded={isDrawerOpen}
          aria-controls="glossary-drawer-panel"
          className="w-full px-6 py-5 flex flex-wrap items-center justify-between gap-4 text-left cursor-pointer hover:bg-surface/60 transition-colors duration-150"
        >
          <div className="flex items-start gap-3.5">
            <BookOpen className="w-5 h-5 text-ochre shrink-0 mt-1" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-xs text-ink-muted">
                <span className="text-ochre font-medium">Apéndice conceptual completo DEA</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{GLOSSARY_TERMS.length} términos técnicos</span>
                <span aria-hidden="true">·</span>
                <span>
                  Índice alfabético A–Z · Paleoantropología, Paleobotánica, Etología y Métodos
                </span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink leading-snug">
                Glosario técnico de paleoantropología, paleobotánica y etología
              </h2>
              <p className="text-xs text-ink-muted m-0">
                Haga clic en cualquier término para abrir la vista lateral de búsqueda contextual
                con definición extendida y enlaces directos a las secciones del curso.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-ink whitespace-nowrap shrink-0">
            <span>{isDrawerOpen ? 'Contraer glosario' : 'Desplegar glosario'}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isDrawerOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </span>
        </button>

        {/* Expanded glossary body */}
        {isDrawerOpen && (
          <div
            id="glossary-drawer-panel"
            className="px-6 pb-7 pt-5 border-t border-hairline flex flex-col gap-5"
          >
            {/* Filter bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div
                className="flex flex-wrap gap-1.5"
                role="group"
                aria-label="Filtrar glosario por disciplina"
              >
                {GLOSSARY_CATEGORIES.map((c) => {
                  const isActive = category === c.id;
                  const count =
                    c.id === 'todos'
                      ? GLOSSARY_TERMS.length
                      : GLOSSARY_TERMS.filter((t) => t.category === c.id).length;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setCategory(c.id);
                        setActiveLetter('TODAS');
                        setVisibleLimit(PAGE_STEP);
                      }}
                      aria-pressed={isActive}
                      className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-ink text-white border-ink'
                          : 'bg-canvas text-ink border-hairline hover:border-ink'
                      }`}
                    >
                      {c.label} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[210px] sm:w-64">
                  <Search
                    className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setVisibleLimit(PAGE_STEP);
                    }}
                    placeholder={`Buscar entre ${GLOSSARY_TERMS.length} términos...`}
                    aria-label="Buscar en el glosario técnico"
                    className="w-full min-h-[38px] pl-9 pr-3 py-1.5 text-xs bg-canvas border border-hairline rounded text-ink placeholder:text-ink-subtle focus:border-ink"
                  />
                </div>

                {category !== 'etologia' && (
                  <button
                    type="button"
                    onClick={toggleAllVisible}
                    className="min-h-[38px] px-3 py-1.5 font-mono text-xs text-ink bg-canvas border border-hairline rounded hover:border-ink transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {allVisibleExpanded ? 'Contraer visibles' : 'Expandir visibles'}
                  </button>
                )}
              </div>
            </div>

            {/* A-Z Quick Jump Index */}
            <div
              className="flex flex-wrap items-center gap-1 pt-1 border-t border-hairline"
              role="group"
              aria-label="Índice alfabético A–Z"
            >
              <button
                type="button"
                onClick={() => {
                  setActiveLetter('TODAS');
                  setVisibleLimit(PAGE_STEP);
                }}
                aria-pressed={activeLetter === 'TODAS'}
                className={`min-h-[40px] px-3 py-1 font-mono text-xs rounded border cursor-pointer whitespace-nowrap ${
                  activeLetter === 'TODAS'
                    ? 'bg-ink text-white border-ink'
                    : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
                }`}
              >
                Todas
              </button>
              {availableLetters.map((letter) => {
                const isSel = activeLetter === letter;
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => {
                      setActiveLetter(letter);
                      setVisibleLimit(PAGE_STEP);
                    }}
                    aria-pressed={isSel}
                    className={`min-h-[40px] min-w-[38px] px-2 py-1 font-mono text-xs rounded border cursor-pointer ${
                      isSel
                        ? 'bg-ochre text-white border-ochre'
                        : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
              <span className="ml-auto font-mono text-xs text-ink-muted tabular-nums">
                Mostrando {visibleTerms.length} de {filteredTerms.length}
              </span>
            </div>

            {/* Specialized EthologyGlossary view OR general accordion list */}
            {category === 'etologia' ? (
              <EthologyGlossary
                searchQuery={query}
                activeLetter={activeLetter}
                highlightedTermId={jumpRequest?.termId ?? ''}
                onResetFilters={() => {
                  setActiveLetter('TODAS');
                  setQuery('');
                }}
              />
            ) : filteredTerms.length === 0 ? (
              <div className="p-6 border border-hairline bg-canvas text-center flex flex-col items-center gap-3">
                <p className="text-sm text-ink-muted m-0">
                  No se encontraron términos que coincidan con los filtros actuales
                  {query ? ` («${query}»)` : ''}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCategory('todos');
                    setActiveLetter('TODAS');
                    setQuery('');
                    setVisibleLimit(PAGE_STEP);
                  }}
                  className="min-h-[38px] px-4 py-1.5 font-mono text-xs font-medium text-ink bg-paper border border-ink rounded hover:bg-ink hover:text-white transition-colors cursor-pointer"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              <>
                <dl className="m-0 bg-canvas border border-hairline divide-y divide-hairline">
                  {visibleTerms.map((item) => {
                    const isOpen = expandedIds.has(item.id);
                    return (
                      <div key={item.id} className="px-4 sm:px-5 py-2.5">
                        <dt className="flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={(e) => openTerm(item.id, e.currentTarget)}
                            className="flex-1 min-w-0 py-1 text-left cursor-pointer group flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5"
                            title="Abrir búsqueda contextual, definición extendida y enlaces al temario"
                          >
                            <span className="font-display text-base font-semibold text-ink group-hover:text-ochre underline decoration-dotted decoration-hairline group-hover:decoration-ochre underline-offset-4 transition-colors">
                              {item.term}
                            </span>
                            <span
                              className={`font-mono text-[11px] font-medium ${categoryColor(
                                item.category
                              )}`}
                            >
                              {item.categoryLabel}
                            </span>
                          </button>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => openTerm(item.id, e.currentTarget)}
                              className="min-h-[34px] px-2.5 py-1 font-mono text-[11px] text-lapis hover:text-ink bg-paper border border-hairline hover:border-ink rounded inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                              aria-label={`Abrir búsqueda contextual de ${item.term}`}
                            >
                              <PanelRightOpen className="w-3.5 h-3.5" aria-hidden="true" />
                              <span className="hidden sm:inline">Búsqueda contextual</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleTerm(item.id)}
                              aria-expanded={isOpen}
                              aria-label={`${isOpen ? 'Contraer' : 'Ver'} resumen rápido de ${item.term}`}
                              className="min-h-[34px] min-w-[34px] inline-flex items-center justify-center rounded border border-hairline bg-paper text-ink-muted hover:text-ink hover:border-ink transition-colors cursor-pointer"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-150 ${
                                  isOpen ? 'rotate-180' : ''
                                }`}
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </dt>

                        {isOpen && (
                          <dd className="m-0 pt-2 pb-1.5 flex flex-col gap-2 text-[15px] leading-relaxed text-ink max-w-[68ch]">
                            <p className="m-0">{item.definition}</p>
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                              <span className="font-mono text-xs text-ink-muted">
                                Fuente · {item.moduleContext}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => openTerm(item.id, e.currentTarget)}
                                className="font-mono text-xs text-ochre hover:text-ink underline underline-offset-4 inline-flex items-center gap-1 cursor-pointer"
                              >
                                <PanelRightOpen className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Ver definición extendida y menciones en el curso</span>
                              </button>
                            </div>
                          </dd>
                        )}
                      </div>
                    );
                  })}
                </dl>

                {visibleLimit < filteredTerms.length && (
                  <div className="flex justify-center pt-1">
                    <button
                      type="button"
                      onClick={() => setVisibleLimit((n) => n + PAGE_STEP)}
                      className="min-h-[38px] px-4 py-1.5 font-mono text-xs font-medium text-ink bg-canvas border border-ink rounded hover:bg-ink hover:text-white transition-colors cursor-pointer"
                    >
                      Mostrar {Math.min(PAGE_STEP, filteredTerms.length - visibleLimit)} términos
                      más ({filteredTerms.length - visibleLimit} restantes)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
