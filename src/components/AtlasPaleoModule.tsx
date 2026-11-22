import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ExternalLink, Search } from 'lucide-react';
import {
  ATLAS_FUENTES,
  ATLAS_REGIONES,
  ATLAS_TAXONES,
} from '../data/atlasPaleo';
import {
  clearPendingCourseDetail,
  consumePendingCourseDetail,
} from '../data/courseNavigation';
import { scheduleInstantScrollToElement } from '../utils/scrollPosition';
import { AtlasNarratedIntro } from './atlas/AtlasNarratedIntro';
import { AtlasChronologyView } from './atlas/AtlasChronologyView';
import type { AtlasTabId } from './atlas/AtlasAulaView';

const AtlasComparatorView = lazy(() =>
  import('./atlas/AtlasComparatorView').then((m) => ({ default: m.AtlasComparatorView }))
);
const AtlasPhylogenyView = lazy(() =>
  import('./atlas/AtlasPhylogenyView').then((m) => ({ default: m.AtlasPhylogenyView }))
);
const AtlasTerritoryView = lazy(() =>
  import('./atlas/AtlasTerritoryView').then((m) => ({ default: m.AtlasTerritoryView }))
);
const AtlasClimateView = lazy(() =>
  import('./atlas/AtlasClimateMethodsView').then((m) => ({ default: m.AtlasClimateView }))
);
const AtlasMethodsView = lazy(() =>
  import('./atlas/AtlasClimateMethodsView').then((m) => ({ default: m.AtlasMethodsView }))
);
const AtlasLabsArchiveView = lazy(() =>
  import('./atlas/AtlasLabsArchiveView').then((m) => ({ default: m.AtlasLabsArchiveView }))
);
const AtlasAulaView = lazy(() =>
  import('./atlas/AtlasAulaView').then((m) => ({ default: m.AtlasAulaView }))
);

const ATLAS_TABS: Array<{ id: AtlasTabId; label: string; cue: string }> = [
  {
    id: 'cronologia',
    label: 'Cronología y Fichas (52)',
    cue: 'Línea temporal estratigráfica (23–0 Ma) con filtros por clado, ámbito africano, estado de debate y ficha osteológica verificada.',
  },
  {
    id: 'comparar',
    label: 'Comparar y Reloj 24h',
    cue: 'Contraste directo de dos especies en tiempo y espacio junto a la escala del tiempo profundo comprimida en 24 horas.',
  },
  {
    id: 'parentesco',
    label: 'Parentesco',
    cue: 'Hipótesis filogenéticas de los cinco grandes clados y distinción entre evolución en árbol ramificado frente a escalera lineal.',
  },
  {
    id: 'territorio',
    label: 'Territorio y Rift (24)',
    cue: 'Cartografía Natural Earth 1:50m de África y Canarias con ampliación ×2,5 del Rift Oriental y proyección afroeurasiática.',
  },
  {
    id: 'clima',
    label: 'Clima y Ecología',
    cue: 'Selección por variabilidad, pulsos climáticos del Pleistoceno y sesgos tafonómicos de preservación fósil.',
  },
  {
    id: 'metodos',
    label: 'Métodos (4)',
    cue: 'Cómo inferimos el pasado: geocronología radiométrica, tafonomía, paleogenómica antigua y paleoproteómica del esmalte dental.',
  },
  {
    id: 'laboratorios',
    label: 'PaleoLab 3D y Archivo',
    cue: 'Cinco réplicas craneales 3D del Smithsonian Institution y sistematización hemerográfica del corpus Nutcracker Man.',
  },
  {
    id: 'aula',
    label: 'Sesiones DEA y Aula',
    cue: 'Itinerario de 6 sesiones guiadas DEA con cuaderno local, guía APA 7.ª, cuatro perfiles didácticos y situación LOMLOE.',
  },
];

export function AtlasPaleoModule() {
  const [activeTab, setActiveTab] = useState<AtlasTabId>('cronologia');
  const [selectedTaxonId, setSelectedTaxonId] = useState<string>('sapiens');
  const [bibQuery, setBibQuery] = useState('');
  const workspaceTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const applyDetail = (detail?: AtlasTabId | { tab: AtlasTabId; taxonId?: string } | null) => {
      if (!detail) return;
      const tab = typeof detail === 'string' ? detail : detail.tab;
      if (tab && ATLAS_TABS.some((t) => t.id === tab)) {
        setActiveTab(tab);
      }
      if (typeof detail === 'object' && detail.taxonId) {
        setSelectedTaxonId(detail.taxonId);
      }
    };

    const pending = consumePendingCourseDetail('atlas');
    if (pending) {
      applyDetail(pending);
    }

    const onOpenAtlas = (event: Event) => {
      clearPendingCourseDetail('atlas');
      applyDetail(
        (event as CustomEvent<AtlasTabId | { tab: AtlasTabId; taxonId?: string }>).detail
      );
    };
    window.addEventListener('ulpgc:open-atlas-tab', onOpenAtlas);
    return () => window.removeEventListener('ulpgc:open-atlas-tab', onOpenAtlas);
  }, []);

  const allSources = useMemo(() => {
    const entries = Object.entries(ATLAS_FUENTES).map(([id, ref]) => ({ id, ...ref }));
    const q = bibQuery.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.cita.toLowerCase().includes(q) ||
        (e.doi?.toLowerCase().includes(q) ?? false)
    );
  }, [bibQuery]);

  const totalRegions = Object.keys(ATLAS_REGIONES).length;
  const totalSources = Object.keys(ATLAS_FUENTES).length;
  const activeTabMeta = ATLAS_TABS.find((t) => t.id === activeTab) ?? ATLAS_TABS[0];

  const handleSelectTab = (tab: AtlasTabId, alwaysScroll = false) => {
    setActiveTab(tab);
    scheduleInstantScrollToElement(() => workspaceTopRef.current, {
      onlyIfAbove: !alwaysScroll,
      focusTarget: alwaysScroll,
    });
  };

  const handleInspectTaxonFromLab = (taxonId: string) => {
    setSelectedTaxonId(taxonId);
    handleSelectTab('cronologia', true);
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const nextIdx = (idx + delta + ATLAS_TABS.length) % ATLAS_TABS.length;
    handleSelectTab(ATLAS_TABS[nextIdx].id, false);
  };

  return (
    <section className="pt-12 border-t border-hairline flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <div className="font-mono text-xs tracking-wide text-lapis">
          Corpus documental integrado · Atlas de Paleoantropología y Portal DEA (ULPGC)
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight tracking-tight text-ink max-w-4xl [text-wrap:balance]">
          Especies, comparador, reloj de 24 horas, territorio, PaleoLab 3D y sesiones DEA
        </h2>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-ink-muted">
          <span className="tabular-nums">{ATLAS_TAXONES.length} táxones documentados</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{totalRegions} regiones fosilíferas + Rift ×2,5</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">5 cráneos 3D (Smithsonian)</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">6 sesiones guiadas DEA</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{totalSources} fuentes con DOI</span>
        </div>
      </div>

      {/* 2-minute Narrated Introduction piece */}
      <AtlasNarratedIntro />

      {/* Main tabbed workspace */}
      <div
        ref={workspaceTopRef}
        tabIndex={-1}
        className="py-6 border-t border-rule border-b border-b-hairline flex flex-col gap-5 focus:outline-none"
      >
        <div className="flex flex-col gap-3 pb-4 border-b border-hairline">
          <div
            className="flex flex-wrap gap-1.5"
            role="tablist"
            aria-label="Vistas documentales del Atlas de Paleoantropología"
          >
            {ATLAS_TABS.map((tab, idx) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`atlas-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`atlas-panel-${tab.id}`}
                  onClick={() => handleSelectTab(tab.id, false)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-ink text-white border-ink'
                      : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink hover:bg-paper'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs leading-relaxed text-ink-muted m-0">
            <span className="font-mono font-medium text-ink mr-1.5">Guía de la vista ·</span>
            {activeTabMeta.cue}
          </p>
        </div>

        <div
          id={`atlas-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`atlas-tab-${activeTab}`}
        >
          <Suspense
            fallback={
              <div className="py-12 px-4 text-center font-mono text-xs text-ink-muted bg-paper border border-hairline">
                Cargando módulo documental del Atlas…
              </div>
            }
          >
            {activeTab === 'cronologia' && (
              <AtlasChronologyView
                selectedTaxonId={selectedTaxonId}
                onSelectTaxon={setSelectedTaxonId}
              />
            )}
            {activeTab === 'comparar' && (
              <AtlasComparatorView onSelectTaxon={setSelectedTaxonId} />
            )}
            {activeTab === 'parentesco' && (
              <AtlasPhylogenyView
                selectedTaxonId={selectedTaxonId}
                onSelectTaxon={setSelectedTaxonId}
              />
            )}
            {activeTab === 'territorio' && (
              <AtlasTerritoryView
                selectedTaxonId={selectedTaxonId}
                onSelectTaxon={setSelectedTaxonId}
              />
            )}
            {activeTab === 'clima' && <AtlasClimateView />}
            {activeTab === 'metodos' && <AtlasMethodsView />}
            {activeTab === 'laboratorios' && (
              <AtlasLabsArchiveView onInspectTaxon={handleInspectTaxonFromLab} />
            )}
            {activeTab === 'aula' && (
              <AtlasAulaView onSwitchTab={(tab) => handleSelectTab(tab, true)} />
            )}
          </Suspense>
        </div>
      </div>

      {/* Searchable Drawer of all 46 Verified DOI Primary Sources */}
      <details className="group bg-paper border-t border-rule border-b border-b-hairline px-6 py-4">
        <summary className="list-none flex items-center justify-between gap-4 min-h-[44px] cursor-pointer font-display text-lg font-semibold text-ink">
          <span>
            Corpus bibliográfico verificado del Atlas de Paleoantropología ({totalSources} fuentes
            con DOI)
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-normal text-ink-muted whitespace-nowrap shrink-0">
            <span>Consultar DOI</span>
            <ChevronDown
              className="w-4 h-4 transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </span>
        </summary>
        <div className="pt-4 mt-3 border-t border-hairline flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search
                className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={bibQuery}
                onChange={(e) => setBibQuery(e.target.value)}
                placeholder="Filtrar por autor, año, revista o DOI..."
                aria-label="Filtrar bibliografía del Atlas de Paleoantropología"
                className="w-full min-h-[38px] pl-9 pr-3 py-1.5 text-xs bg-canvas border border-hairline rounded text-ink placeholder:text-ink-subtle focus:border-ink"
              />
            </div>
            <span className="font-mono text-xs text-ink-muted tabular-nums">
              {allSources.length} de {totalSources} referencias
            </span>
          </div>

          <ol className="m-0 pl-5 flex flex-col gap-2 text-xs leading-relaxed text-ink">
            {allSources.map((src) => (
              <li key={src.id} className="pl-1">
                <span>{src.cita}</span>
                {src.doi && (
                  <a
                    href={`https://doi.org/${src.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 ml-1.5 font-mono text-[11px] text-lapis hover:underline"
                  >
                    <span>https://doi.org/{src.doi}</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                )}
              </li>
            ))}
          </ol>

          <p className="font-mono text-[11px] text-ink-muted pt-3 border-t border-hairline">
            Corpus integrado del Atlas de Paleoantropología y Portal DEA · Facultad de Ciencias de
            la Educación · Universidad de Las Palmas de Gran Canaria (ULPGC) · Licencia{' '}
            <a
              href="https://creativecommons.org/licenses/by-nc/4.0/deed.es"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lapis hover:underline"
            >
              CC BY-NC 4.0
            </a>
            .
          </p>
        </div>
      </details>
    </section>
  );
}
