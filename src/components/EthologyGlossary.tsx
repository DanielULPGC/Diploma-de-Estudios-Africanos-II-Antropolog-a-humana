import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ChevronDown, Compass } from 'lucide-react';
import {
  ETHOLOGY_GLOSSARY_DOMAINS,
  ETHOLOGY_GLOSSARY_TERMS,
  type EthologyGlossaryDomain,
} from '../data/ethologyGlossary';

interface EthologyGlossaryProps {
  searchQuery?: string;
  activeLetter?: string;
  highlightedTermId?: string;
  onResetFilters?: () => void;
}

function firstLetter(term: string): string {
  const norm = term
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .charAt(0)
    .toUpperCase();
  return /[A-Z]/.test(norm) ? norm : '#';
}

export function EthologyGlossary({
  searchQuery = '',
  activeLetter = 'TODAS',
  highlightedTermId = '',
  onResetFilters,
}: EthologyGlossaryProps) {
  const [domainFilter, setDomainFilter] = useState<EthologyGlossaryDomain | 'todos'>('todos');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(['facilitacion-local', 'pistas-sociales-indirectas', 'cuarta-dimension-herramientas'])
  );

  useEffect(() => {
    if (!highlightedTermId) return;
    const exists = ETHOLOGY_GLOSSARY_TERMS.some((t) => t.id === highlightedTermId);
    if (!exists) return;
    setDomainFilter('todos');
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.add(highlightedTermId);
      return next;
    });
  }, [highlightedTermId]);

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ETHOLOGY_GLOSSARY_TERMS.filter((entry) => {
      if (domainFilter !== 'todos' && entry.domain !== domainFilter) return false;
      if (activeLetter !== 'TODAS' && firstLetter(entry.term) !== activeLetter) return false;
      if (q) {
        const match =
          entry.term.toLowerCase().includes(q) ||
          entry.englishTerm.toLowerCase().includes(q) ||
          entry.definition.toLowerCase().includes(q) ||
          entry.ethologyContext.toLowerCase().includes(q) ||
          entry.domainLabel.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    }).sort((a, b) => a.term.localeCompare(b.term, 'es'));
  }, [domainFilter, activeLetter, searchQuery]);

  const allExpanded =
    filteredEntries.length > 0 && filteredEntries.every((entry) => expandedIds.has(entry.id));

  const toggleEntry = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(filteredEntries.map((entry) => entry.id)));
    }
  };

  const scrollToEthologyModule = () => {
    window.dispatchEvent(
      new CustomEvent('ulpgc:navigate-course', {
        detail: { sectionId: 'etologia' },
      })
    );
  };

  const domainColor = (domain: EthologyGlossaryDomain) => {
    if (domain === 'aprendizaje-social') return 'text-plum';
    if (domain === 'tecnologia-litica') return 'text-ochre';
    return 'text-forest';
  };

  return (
    <div
      className="bg-canvas border border-hairline p-4 sm:p-5 flex flex-col gap-4"
      aria-label="Glosario especializado de etología y primatología"
    >
      {/* Header strip */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-hairline">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-plum font-medium">
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Glosario conductual · Módulo de Etología y Primatología</span>
          </div>
          <h3 className="font-display text-lg font-semibold text-ink m-0">
            Términos clave de comportamiento primate y arqueología lítica
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleAll}
            className="min-h-[36px] px-3 py-1 font-mono text-[11px] text-ink bg-paper border border-hairline rounded hover:border-ink transition-colors whitespace-nowrap cursor-pointer"
          >
            {allExpanded ? 'Contraer todos' : 'Expandir todos'}
          </button>
          <button
            type="button"
            onClick={scrollToEthologyModule}
            className="min-h-[36px] px-3 py-1 font-mono text-[11px] text-ink bg-paper border border-hairline rounded hover:border-ink inline-flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>Ir al módulo #etologia</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-ochre" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Sub-domain filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label="Filtrar términos etológicos por ámbito"
        >
          {ETHOLOGY_GLOSSARY_DOMAINS.map((dom) => {
            const isActive = domainFilter === dom.id;
            const count =
              dom.id === 'todos'
                ? ETHOLOGY_GLOSSARY_TERMS.length
                : ETHOLOGY_GLOSSARY_TERMS.filter((t) => t.domain === dom.id).length;
            return (
              <button
                key={dom.id}
                type="button"
                onClick={() => setDomainFilter(dom.id)}
                aria-pressed={isActive}
                className={`min-h-[36px] px-3 py-1 font-mono text-[11px] rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-plum text-white border-plum font-medium'
                    : 'bg-paper text-ink-muted border-hairline hover:border-ink hover:text-ink'
                }`}
              >
                {dom.label} ({count})
              </button>
            );
          })}
        </div>

        <span className="font-mono text-[11px] text-ink-muted tabular-nums">
          {filteredEntries.length} de {ETHOLOGY_GLOSSARY_TERMS.length} términos conductuales
        </span>
      </div>

      {/* Accordion list */}
      {filteredEntries.length === 0 ? (
        <div className="p-5 bg-paper border border-hairline text-center flex flex-col items-center gap-2.5">
          <p className="text-xs text-ink-muted m-0">
            No hay términos etológicos que coincidan con el filtro actual
            {searchQuery ? ` («${searchQuery}»)` : ''}.
          </p>
          <button
            type="button"
            onClick={() => {
              setDomainFilter('todos');
              onResetFilters?.();
            }}
            className="min-h-[36px] px-3.5 py-1 font-mono text-xs text-ink bg-canvas border border-ink rounded hover:bg-ink hover:text-white transition-colors cursor-pointer"
          >
            Mostrar todos los términos etológicos
          </button>
        </div>
      ) : (
        <dl className="m-0 border border-hairline divide-y divide-hairline bg-canvas">
          {filteredEntries.map((entry) => {
            const isOpen = expandedIds.has(entry.id);
            const isHighlighted = highlightedTermId === entry.id;
            return (
              <div
                key={entry.id}
                className={`px-4 py-2.5 transition-colors ${isHighlighted ? 'bg-paper' : ''}`}
              >
                <dt>
                  <button
                    type="button"
                    onClick={() => toggleEntry(entry.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 py-1 text-left cursor-pointer group"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                      <span className="font-display text-base font-semibold text-ink group-hover:text-plum transition-colors">
                        {entry.term}
                      </span>
                      <span className="font-mono text-[11px] text-ink-subtle">
                        {entry.englishTerm}
                      </span>
                      <span
                        className={`font-mono text-[11px] font-medium ${domainColor(entry.domain)}`}
                      >
                        {entry.domainLabel}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-ink-muted shrink-0 transition-transform duration-150 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </dt>

                {isOpen && (
                  <dd className="m-0 pt-2 pb-1 flex flex-col gap-2 text-sm leading-relaxed text-ink max-w-4xl">
                    <p className="m-0">{entry.definition}</p>
                    <div className="p-2.5 bg-paper border border-hairline text-xs text-ink">
                      <span className="font-mono text-[11px] text-plum font-medium mr-1.5">
                        Aplicación en Etología ·
                      </span>
                      {entry.ethologyContext}
                    </div>
                    <span className="font-mono text-[11px] text-ink-muted">
                      Contexto · {entry.moduleContext}
                    </span>
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
      )}
    </div>
  );
}
