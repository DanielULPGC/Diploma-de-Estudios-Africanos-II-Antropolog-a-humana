import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  Film,
  Globe,
  Play,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import {
  AFRICAN_VISUAL_FILMS,
  ANTROPOLOGIA_VISUAL_PORTAL,
  LIVE_ARCHIVE_PRESETS,
  PORTAL_PROFILES_AND_CYCLES,
  VISUAL_METHODOLOGY_AXES,
  VISUAL_REGIONS,
  VISUAL_THEMES,
  type AfricanFilmEntry,
  type AfricanVisualRegionId,
  type AfricanVisualThemeId,
  type VisualAnthropologyTabId,
} from '../data/visualAnthropologyAfricaData';
import {
  clearPendingCourseDetail,
  consumePendingCourseDetail,
  normalizeSearchText,
} from '../data/courseNavigation';

interface LivePortalRecord {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  link: string;
  streamUrl?: string;
}

interface WpTermRaw {
  name?: string;
  taxonomy?: string;
}

interface WpPostRaw {
  id: number;
  date?: string;
  link?: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  _embedded?: {
    'wp:term'?: WpTermRaw[][];
  };
}

function isSafePortalUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'https:' &&
      (parsed.hostname === 'antropologiavisual.net' ||
        parsed.hostname === 'www.antropologiavisual.net')
    );
  } catch {
    return false;
  }
}

function decodeHtmlToPlainText(htmlString: string | undefined): string {
  if (!htmlString) return '';
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
  }
  return htmlString
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractSafeMp4Url(contentHtml: string | undefined): string | undefined {
  if (!contentHtml) return undefined;
  const match = contentHtml.match(/https:\/\/(?:www\.)?antropologiavisual\.net\/[^\s"'<>]+\.mp4/i);
  if (!match) return undefined;
  return isSafePortalUrl(match[0]) ? match[0] : undefined;
}

function formatIsoDateEs(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate.slice(0, 10);
  return parsed.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const SECTION_TABS: Array<{ id: VisualAnthropologyTabId; label: string }> = [
  { id: 'filmografia', label: 'Filmografía africana (13 obras)' },
  { id: 'archivo-vivo', label: 'Conexión directa · AntropologiaVisual.net' },
  { id: 'autores-muestras', label: 'Autores, muestras y método visual' },
];

export function VisualAnthropologyAfricaModule() {
  const [activeTab, setActiveTab] = useState<VisualAnthropologyTabId>('filmografia');
  const [selectedRegion, setSelectedRegion] = useState<AfricanVisualRegionId>('todas');
  const [selectedTheme, setSelectedTheme] = useState<AfricanVisualThemeId>('todos');
  const [localQuery, setLocalQuery] = useState('');
  const [selectedFilmId, setSelectedFilmId] = useState<string>(AFRICAN_VISUAL_FILMS[0].id);
  const [showInlinePlayer, setShowInlinePlayer] = useState(false);
  const [videoLoadError, setVideoLoadError] = useState(false);

  // Live WordPress REST API state for antropologiavisual.net
  const [activePresetId, setActivePresetId] = useState<string>(LIVE_ARCHIVE_PRESETS[0].id);
  const [liveSearchInput, setLiveSearchInput] = useState('');
  const [liveQueryLabel, setLiveQueryLabel] = useState<string>(LIVE_ARCHIVE_PRESETS[0].label);
  const [livePortalFallbackUrl, setLivePortalFallbackUrl] = useState<string>(
    LIVE_ARCHIVE_PRESETS[0].portalFallbackUrl
  );
  const [liveRecords, setLiveRecords] = useState<LivePortalRecord[]>([]);
  const [liveStatus, setLiveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [liveErrorMessage, setLiveErrorMessage] = useState<string | null>(null);
  const [activeLiveStreamId, setActiveLiveStreamId] = useState<number | null>(null);
  const liveAbortRef = useRef<AbortController | null>(null);

  // Deep navigation subscription (Command Palette / shortcuts)
  useEffect(() => {
    const applyDetail = (detail?: { tab?: VisualAnthropologyTabId; filmId?: string }) => {
      if (!detail) return;
      if (detail.tab) {
        setActiveTab(detail.tab);
      }
      if (detail.filmId) {
        const exists = AFRICAN_VISUAL_FILMS.some((f) => f.id === detail.filmId);
        if (exists) {
          setSelectedRegion('todas');
          setSelectedTheme('todos');
          setLocalQuery('');
          setSelectedFilmId(detail.filmId);
          setShowInlinePlayer(false);
          setVideoLoadError(false);
        }
      }
    };

    const pending = consumePendingCourseDetail('visualAnthropology');
    if (pending) {
      applyDetail(pending);
    }

    const onOpen = (evt: Event) => {
      const customEvt = evt as CustomEvent<{ tab?: VisualAnthropologyTabId; filmId?: string }>;
      clearPendingCourseDetail('visualAnthropology');
      applyDetail(customEvt.detail);
    };

    window.addEventListener('ulpgc:open-visual-anthropology-tab', onOpen);
    return () => {
      window.removeEventListener('ulpgc:open-visual-anthropology-tab', onOpen);
    };
  }, []);

  // Abort any in-flight live request on unmount
  useEffect(() => {
    return () => {
      liveAbortRef.current?.abort();
    };
  }, []);

  const fetchLiveArchive = useCallback(
    async (params: {
      queryType: 'tag' | 'search';
      queryValue: string;
      label: string;
      fallbackUrl: string;
    }) => {
      liveAbortRef.current?.abort();
      const controller = new AbortController();
      liveAbortRef.current = controller;

      setLiveStatus('loading');
      setLiveErrorMessage(null);
      setLiveQueryLabel(params.label);
      setLivePortalFallbackUrl(params.fallbackUrl);
      setActiveLiveStreamId(null);

      const endpoint =
        params.queryType === 'tag'
          ? `${ANTROPOLOGIA_VISUAL_PORTAL.apiBaseUrl}/posts?tags=${encodeURIComponent(
              params.queryValue
            )}&per_page=15&_embed=wp:term`
          : `${ANTROPOLOGIA_VISUAL_PORTAL.apiBaseUrl}/posts?search=${encodeURIComponent(
              params.queryValue
            )}&per_page=15&_embed=wp:term`;

      try {
        const response = await fetch(endpoint, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`El portal respondió con HTTP ${response.status}`);
        }
        const rawPosts = (await response.json()) as WpPostRaw[];
        const parsed: LivePortalRecord[] = rawPosts
          .filter((post) => isSafePortalUrl(post.link))
          .map((post) => {
            const termGroups = post._embedded?.['wp:term'] ?? [];
            const categories: string[] = [];
            const tags: string[] = [];
            for (const group of termGroups) {
              for (const term of group) {
                if (term.taxonomy === 'category' && term.name) categories.push(term.name);
                if (term.taxonomy === 'post_tag' && term.name) tags.push(term.name);
              }
            }
            return {
              id: post.id,
              date: post.date ?? '',
              title: decodeHtmlToPlainText(post.title?.rendered) || 'Entrada sin título',
              excerpt: decodeHtmlToPlainText(post.excerpt?.rendered),
              categories,
              tags,
              link: post.link as string,
              streamUrl: extractSafeMp4Url(post.content?.rendered),
            };
          });

        setLiveRecords(parsed);
        setLiveStatus('success');
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setLiveStatus('error');
        setLiveErrorMessage(
          'No se pudo establecer conexión directa en este momento (entorno sin conexión o restricción de red). Puede consultar las 13 fichas curadas en la pestaña Filmografía o abrir el archivo directamente en antropologiavisual.net.'
        );
      }
    },
    []
  );

  // Trigger initial live load the first time the user enters the live archive tab
  useEffect(() => {
    if (activeTab === 'archivo-vivo' && liveStatus === 'idle') {
      const preset = LIVE_ARCHIVE_PRESETS[0];
      void fetchLiveArchive({
        queryType: preset.queryType,
        queryValue: preset.queryValue,
        label: preset.label,
        fallbackUrl: preset.portalFallbackUrl,
      });
    }
  }, [activeTab, liveStatus, fetchLiveArchive]);

  const filteredFilms = useMemo(() => {
    const q = normalizeSearchText(localQuery.trim());
    return AFRICAN_VISUAL_FILMS.filter((film) => {
      if (selectedRegion !== 'todas' && film.region !== selectedRegion) return false;
      if (selectedTheme !== 'todos' && film.theme !== selectedTheme) return false;
      if (!q) return true;
      const haystack = normalizeSearchText(
        [
          film.title,
          film.director,
          film.country,
          film.peoplesAndContext,
          film.summary,
          film.tags.join(' '),
        ].join(' ')
      );
      return haystack.includes(q);
    });
  }, [selectedRegion, selectedTheme, localQuery]);

  const activeFilm: AfricanFilmEntry = useMemo(() => {
    const exact = filteredFilms.find((f) => f.id === selectedFilmId);
    return exact ?? filteredFilms[0] ?? AFRICAN_VISUAL_FILMS[0];
  }, [filteredFilms, selectedFilmId]);

  const handleSelectFilm = (filmId: string) => {
    setSelectedFilmId(filmId);
    setShowInlinePlayer(false);
    setVideoLoadError(false);
  };

  const handleLiveSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = liveSearchInput.trim();
    if (!trimmed) return;
    setActivePresetId('custom');
    void fetchLiveArchive({
      queryType: 'search',
      queryValue: trimmed,
      label: `Búsqueda en directo: «${trimmed}»`,
      fallbackUrl: `https://antropologiavisual.net/?s=${encodeURIComponent(trimmed)}`,
    });
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = LIVE_ARCHIVE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePresetId(preset.id);
    setLiveSearchInput('');
    void fetchLiveArchive({
      queryType: preset.queryType,
      queryValue: preset.queryValue,
      label: preset.label,
      fallbackUrl: preset.portalFallbackUrl,
    });
  };

  const regionCounts = useMemo(() => {
    const map: Record<AfricanVisualRegionId, number> = {
      todas: AFRICAN_VISUAL_FILMS.length,
      'magreb-sahara': 0,
      'africa-occidental': 0,
      'africa-central-oriental': 0,
      'diaspora-fronteras': 0,
    };
    for (const film of AFRICAN_VISUAL_FILMS) {
      map[film.region] += 1;
    }
    return map;
  }, []);

  return (
    <section
      aria-labelledby="heading-antropologia-visual"
      className="pt-12 border-t-2 border-rule flex flex-col gap-8"
    >
      {/* Curatorial Editorial Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs tracking-wide text-lapis">
            05c. Antropología visual y cine etnográfico · Archivo conectado con AntropologiaVisual.net
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={ANTROPOLOGIA_VISUAL_PORTAL.africaArchiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[38px] px-3.5 py-1.5 font-mono text-xs text-ink bg-paper border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Globe className="w-3.5 h-3.5 text-lapis" aria-hidden="true" />
              <span>Archivo África en antropologiavisual.net</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <h2
          id="heading-antropologia-visual"
          className="font-display text-2xl sm:text-4xl font-semibold tracking-tight leading-[1.12] text-ink max-w-4xl [text-wrap:balance]"
        >
          Antropología visual de África: cine etnográfico, etnoficción y archivo abierto
        </h2>

        <p className="text-base leading-[1.72] text-ink-muted max-w-[74ch]">
          Frente a los estereotipos coloniales examinados en el módulo anterior, la antropología
          visual contemporánea utiliza la cámara como instrumento de investigación, escucha y
          memoria compartida. Este apartado conecta directamente con el archivo abierto de{' '}
          <a
            href={ANTROPOLOGIA_VISUAL_PORTAL.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lapis underline underline-offset-4 hover:text-ink"
          >
            antropologiavisual.net
          </a>{' '}
          (fundado en 2005) para explorar su fondo documental sobre el continente africano y su
          diáspora, con fichas curadas por región, reproducción en línea y consulta directa al
          catálogo del portal.
        </p>

        {/* Quiet unboxed archival summary strip (zero pills) */}
        <div className="pt-3 border-t border-hairline flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-ink-muted tabular-nums">
          <span>
            <strong className="text-ink font-semibold">{AFRICAN_VISUAL_FILMS.length}</strong>{' '}
            documentales y etnoficciones sobre África
          </span>
          <span aria-hidden="true">·</span>
          <span>
            <strong className="text-ink font-semibold">4</strong> grandes ejes territoriales
          </span>
          <span aria-hidden="true">·</span>
          <span>
            <strong className="text-ink font-semibold">{PORTAL_PROFILES_AND_CYCLES.length}</strong>{' '}
            festivales, muestras y autorías vinculadas
          </span>
          <span aria-hidden="true">·</span>
          <span>Fuente: antropologiavisual.net (acceso abierto)</span>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div
        role="tablist"
        aria-label="Vistas del módulo de Antropología visual de África"
        className="flex flex-wrap items-center gap-2 border-b border-hairline pb-3"
      >
        {SECTION_TABS.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-visual-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`panel-visual-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[40px] px-4 py-2 text-xs font-semibold rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-ink text-white border-ink'
                  : 'bg-paper text-ink-muted border-hairline hover:border-ink hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: CURATED AFRICAN ETHNOGRAPHIC FILM ARCHIVE */}
      {activeTab === 'filmografia' && (
        <div
          id="panel-visual-filmografia"
          role="tabpanel"
          aria-labelledby="tab-visual-filmografia"
          className="flex flex-col gap-6"
        >
          {/* Regional & Thematic Filter Bar */}
          <div className="bg-paper border border-hairline p-5 flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrar por región africana">
                {VISUAL_REGIONS.map((reg) => {
                  const active = selectedRegion === reg.id;
                  return (
                    <button
                      key={reg.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedRegion(reg.id)}
                      className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                        active
                          ? 'bg-lapis text-white border-lapis'
                          : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
                      }`}
                    >
                      {reg.label} ({regionCounts[reg.id]})
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full lg:w-72">
                <Search
                  className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder="Filtrar pueblo, país o director…"
                  aria-label="Filtrar filmografía africana por palabra clave"
                  className="w-full min-h-[40px] pl-9 pr-8 py-1.5 text-xs bg-canvas text-ink border border-hairline rounded focus:outline-none focus:border-ink"
                />
                {localQuery && (
                  <button
                    type="button"
                    onClick={() => setLocalQuery('')}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrar por eje temático">
                {VISUAL_THEMES.map((theme) => {
                  const active = selectedTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`min-h-[36px] px-3 py-1 text-xs rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-ink text-white border-ink font-medium'
                          : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
                      }`}
                    >
                      {theme.label}
                    </button>
                  );
                })}
              </div>
              <span className="font-mono text-xs text-ink-muted tabular-nums">
                Mostrando {filteredFilms.length} de {AFRICAN_VISUAL_FILMS.length} obras
              </span>
            </div>
          </div>

          {/* 2-Column Editorial Catalog + Accession Detail Sheet */}
          {filteredFilms.length === 0 ? (
            <div className="bg-paper border border-hairline p-8 flex flex-col items-start gap-3">
              <p className="text-sm text-ink m-0">
                No hay obras que coincidan con los filtros seleccionados.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedRegion('todas');
                  setSelectedTheme('todos');
                  setLocalQuery('');
                }}
                className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-ink rounded hover:bg-ochre transition-colors cursor-pointer"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Rail: Compact Catalog List */}
              <div
                className="lg:col-span-5 flex flex-col border-t border-rule"
                role="listbox"
                aria-label="Catálogo de filmografía africana de AntropologiaVisual.net"
              >
                {filteredFilms.map((film) => {
                  const isActive = film.id === activeFilm.id;
                  return (
                    <button
                      key={film.id}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onClick={() => handleSelectFilm(film.id)}
                      className={`text-left px-4 py-3.5 border-b border-hairline transition-colors cursor-pointer flex flex-col gap-1 ${
                        isActive
                          ? 'bg-paper text-ink'
                          : 'bg-canvas text-ink-muted hover:bg-paper/70 hover:text-ink'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span
                          className={`font-display text-base leading-snug ${
                            isActive ? 'font-semibold text-ink' : 'font-medium text-ink'
                          }`}
                        >
                          {film.title}
                        </span>
                        <span className="font-mono text-[11px] text-ink-muted tabular-nums shrink-0">
                          {film.year}
                        </span>
                      </div>
                      <div className="text-xs text-ink-muted flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span>{film.director}</span>
                        <span aria-hidden="true">·</span>
                        <span>{film.country}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[11px] tabular-nums">{film.duration}</span>
                      </div>
                      <div className="font-mono text-[11px] text-lapis flex items-center gap-2 pt-0.5">
                        <span>{film.themeLabel}</span>
                        {film.streamUrl && (
                          <>
                            <span aria-hidden="true" className="text-ink-muted">
                              ·
                            </span>
                            <span className="text-forest">Vídeo en archivo</span>
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Panel: Curatorial Accession Sheet & On-Demand Video Player */}
              <article
                aria-live="polite"
                className="lg:col-span-7 bg-paper border border-hairline border-t-2 border-t-lapis p-6 sm:p-7 flex flex-col gap-6"
              >
                <div className="flex flex-col gap-2 pb-4 border-b border-hairline">
                  <div className="font-mono text-xs text-lapis flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>Ficha #{activeFilm.wpId}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeFilm.regionLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeFilm.themeLabel}</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink leading-tight m-0">
                    {activeFilm.title}
                  </h3>
                  <div className="text-sm text-ink-muted flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-medium text-ink">{activeFilm.director}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-xs tabular-nums">{activeFilm.year}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-xs tabular-nums">{activeFilm.duration}</span>
                    {activeFilm.institution && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{activeFilm.institution}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* On-demand MP4 stream viewer directly from antropologiavisual.net */}
                {activeFilm.streamUrl && (
                  <div className="bg-canvas border border-hairline p-4 flex flex-col gap-3">
                    {!showInlinePlayer ? (
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-xs font-semibold text-ink">
                            Archivo audiovisual en acceso abierto
                          </span>
                          <span className="text-xs text-ink-muted">
                            Reproducción directa desde antropologiavisual.net bajo demanda (sin
                            carga automática).
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoLoadError(false);
                            setShowInlinePlayer(true);
                          }}
                          className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-ink rounded hover:bg-lapis transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Reproducir en línea</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] text-ink-muted">
                            Streaming directo · antropologiavisual.net
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowInlinePlayer(false)}
                            className="min-h-[32px] px-2.5 py-1 text-xs text-ink-muted hover:text-ink border border-hairline rounded inline-flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Cerrar reproductor</span>
                          </button>
                        </div>
                        {videoLoadError ? (
                          <div className="p-4 bg-paper border border-hairline text-xs text-ink-muted flex flex-col gap-2">
                            <p className="m-0">
                              El navegador no pudo cargar el vídeo directamente en esta red. Puede
                              ver la obra completa en su ficha oficial de AntropologiaVisual.net.
                            </p>
                            <a
                              href={activeFilm.portalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-xs text-lapis underline underline-offset-4 self-start"
                            >
                              Abrir ficha en antropologiavisual.net
                            </a>
                          </div>
                        ) : (
                          <video
                            key={activeFilm.streamUrl}
                            src={activeFilm.streamUrl}
                            controls
                            preload="metadata"
                            playsInline
                            onError={() => setVideoLoadError(true)}
                            className="w-full aspect-video bg-ink rounded border border-hairline"
                          >
                            Su navegador no admite reproducción HTML5 directa. Puede abrir la obra
                            en antropologiavisual.net.
                          </video>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <p className="text-sm sm:text-base leading-[1.72] text-ink m-0">
                  {activeFilm.summary}
                </p>

                {/* Accession Metadata Definition List */}
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-hairline text-xs m-0">
                  <div className="flex flex-col gap-1">
                    <dt className="font-mono text-[11px] text-ink-muted">Territorio y escenario</dt>
                    <dd className="text-ink leading-relaxed m-0">{activeFilm.country}</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="font-mono text-[11px] text-ink-muted">
                      Pueblos, contextos y referentes
                    </dt>
                    <dd className="text-ink leading-relaxed m-0">{activeFilm.peoplesAndContext}</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="font-mono text-[11px] text-ink-muted">Enfoque audiovisual</dt>
                    <dd className="text-ink leading-relaxed m-0">{activeFilm.methodology}</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="font-mono text-[11px] text-ochre font-medium">
                      Conexión con el Diploma ULPGC
                    </dt>
                    <dd className="text-ink leading-relaxed m-0">{activeFilm.ulpgcConnection}</dd>
                  </div>
                </dl>

                {/* Quiet text descriptors + Primary Portal Link */}
                <div className="pt-4 border-t border-hairline flex flex-wrap items-center justify-between gap-4">
                  <div className="font-mono text-[11px] text-ink-muted">
                    Descriptores: {activeFilm.tags.join(' · ')}
                  </div>
                  <a
                    href={activeFilm.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-ink rounded hover:bg-ochre transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Film className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Abrir ficha en antropologiavisual.net</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </article>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LIVE CONNECTION TO ANTROPOLOGIAVISUAL.NET REST API */}
      {activeTab === 'archivo-vivo' && (
        <div
          id="panel-visual-archivo-vivo"
          role="tabpanel"
          aria-labelledby="tab-visual-archivo-vivo"
          className="flex flex-col gap-6"
        >
          <div className="bg-paper border border-hairline p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs text-lapis">
                  Consulta en tiempo real · API pública de antropologiavisual.net
                </span>
                <h3 className="font-display text-xl font-semibold text-ink m-0">
                  Explorar el archivo vivo sobre África en AntropologiaVisual.net
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted max-w-[68ch] m-0">
                  Esta vista consulta directamente los registros publicados en{' '}
                  <code>antropologiavisual.net</code> para recuperar documentales, convocatorias,
                  festivales y perfiles vinculados a África.
                </p>
              </div>
              <a
                href={livePortalFallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[40px] px-3.5 py-2 font-mono text-xs text-ink bg-canvas border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 whitespace-nowrap self-start shrink-0"
              >
                <span>Ver consulta en la web</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-lapis" aria-hidden="true" />
              </a>
            </div>

            {/* Preset Query Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {LIVE_ARCHIVE_PRESETS.map((preset) => {
                const isSelected = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-lapis text-white border-lapis'
                        : 'bg-canvas text-ink border-hairline hover:border-ink'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Live Search Form */}
            <form onSubmit={handleLiveSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search
                  className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={liveSearchInput}
                  onChange={(e) => setLiveSearchInput(e.target.value)}
                  placeholder="Buscar término africano en antropologiavisual.net (ej. Senegal, Azande, Sahara, Akan, Ruanda…)"
                  aria-label="Buscar en directo en antropologiavisual.net"
                  className="w-full min-h-[42px] pl-9 pr-3 py-2 text-xs sm:text-sm bg-canvas text-ink border border-hairline rounded focus:outline-none focus:border-ink"
                />
              </div>
              <button
                type="submit"
                disabled={liveStatus === 'loading' || !liveSearchInput.trim()}
                className="min-h-[42px] px-5 py-2 text-xs font-semibold text-white bg-ink rounded hover:bg-lapis disabled:opacity-45 disabled:cursor-not-allowed transition-colors whitespace-nowrap cursor-pointer"
              >
                Consultar archivo
              </button>
            </form>
          </div>

          {/* Results Area */}
          <div className="flex flex-col gap-4" aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-ink-muted">
              <span>{liveQueryLabel}</span>
              {liveStatus === 'success' && (
                <span className="tabular-nums">
                  {liveRecords.length}{' '}
                  {liveRecords.length === 1 ? 'registro encontrado' : 'registros encontrados'}
                </span>
              )}
            </div>

            {liveStatus === 'loading' && (
              <div className="bg-paper border border-hairline p-8 flex items-center gap-3 text-sm text-ink-muted">
                <RefreshCw className="w-4 h-4 animate-spin text-lapis" aria-hidden="true" />
                <span>Consultando entradas en antropologiavisual.net…</span>
              </div>
            )}

            {liveStatus === 'error' && (
              <div className="bg-paper border border-hairline p-6 flex flex-col gap-3">
                <div className="flex items-start gap-2.5 text-sm text-ink">
                  <AlertCircle className="w-4 h-4 text-ochre shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="m-0 leading-relaxed">{liveErrorMessage}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(activePresetId === 'custom' ? 'tag-africa' : activePresetId)}
                    className="min-h-[38px] px-4 py-1.5 text-xs font-semibold text-white bg-ink rounded hover:bg-lapis transition-colors cursor-pointer"
                  >
                    Reintentar conexión
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('filmografia')}
                    className="min-h-[38px] px-4 py-1.5 text-xs font-medium text-ink bg-canvas border border-hairline rounded hover:border-ink transition-colors cursor-pointer"
                  >
                    Ver catálogo curado sin conexión (13 obras)
                  </button>
                </div>
              </div>
            )}

            {liveStatus === 'success' && liveRecords.length === 0 && (
              <div className="bg-paper border border-hairline p-6 text-sm text-ink-muted">
                No se devolvieron registros para esa consulta. Prueba con otro país, etnia o autor
                (por ejemplo: <em>Marruecos</em>, <em>Senegal</em>, <em>Azande</em> o{' '}
                <em>Jean Rouch</em>).
              </div>
            )}

            {liveStatus === 'success' && liveRecords.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveRecords.map((record) => {
                  const isStreaming = activeLiveStreamId === record.id;
                  return (
                    <article
                      key={record.id}
                      className="bg-paper border border-hairline p-5 flex flex-col justify-between gap-4"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="font-mono text-[11px] text-ink-muted flex flex-wrap items-center gap-x-2 gap-y-0.5 tabular-nums">
                          {record.categories.length > 0 && (
                            <span className="text-lapis font-medium">
                              {record.categories.join(' / ')}
                            </span>
                          )}
                          {record.categories.length > 0 && record.date && (
                            <span aria-hidden="true">·</span>
                          )}
                          {record.date && <span>{formatIsoDateEs(record.date)}</span>}
                        </div>

                        <h4 className="font-display text-lg font-semibold text-ink leading-snug m-0">
                          {record.title}
                        </h4>

                        {record.excerpt && (
                          <p className="text-xs sm:text-sm leading-relaxed text-ink-muted m-0">
                            {record.excerpt}
                          </p>
                        )}

                        {record.tags.length > 0 && (
                          <p className="font-mono text-[11px] text-ink-muted m-0 pt-1">
                            {record.tags.slice(0, 6).join(' · ')}
                          </p>
                        )}

                        {isStreaming && record.streamUrl && (
                          <div className="pt-2">
                            <video
                              src={record.streamUrl}
                              controls
                              preload="metadata"
                              playsInline
                              className="w-full aspect-video bg-ink rounded border border-hairline"
                            />
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-2">
                        <a
                          href={record.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[36px] px-3 py-1.5 font-mono text-xs text-ink bg-canvas border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                        >
                          <span>Abrir en portal</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-lapis" aria-hidden="true" />
                        </a>
                        {record.streamUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveLiveStreamId(isStreaming ? null : record.id)
                            }
                            className="min-h-[36px] px-3 py-1.5 font-mono text-xs text-white bg-ink rounded hover:bg-lapis inline-flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{isStreaming ? 'Ocultar vídeo' : 'Ver vídeo'}</span>
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AUTHORS, FESTIVALS, CYCLES & VISUAL ANTHROPOLOGY METHODOLOGY */}
      {activeTab === 'autores-muestras' && (
        <div
          id="panel-visual-autores-muestras"
          role="tabpanel"
          aria-labelledby="tab-visual-autores-muestras"
          className="flex flex-col gap-8"
        >
          {/* Festivals, Cycles & Author Profiles from AntropologiaVisual.net */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 font-mono text-xs text-ochre">
              <Users className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Festivales, muestras universitarias y autorías en antropologiavisual.net</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PORTAL_PROFILES_AND_CYCLES.map((item) => (
                <article
                  key={item.id}
                  className="bg-paper border border-hairline p-5 flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="font-mono text-[11px] text-ink-muted flex flex-wrap items-center gap-x-2">
                      <span className="text-lapis font-semibold">{item.kind}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.locationAndYear}</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-ink leading-snug m-0">
                      {item.title}
                    </h3>
                    <p className="text-xs font-medium text-ink-muted m-0">{item.subtitle}</p>
                    <p className="text-xs sm:text-sm leading-relaxed text-ink m-0">
                      {item.description}
                    </p>
                  </div>
                  <a
                    href={item.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[38px] px-3.5 py-1.5 font-mono text-xs text-ink bg-canvas border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors whitespace-nowrap self-start"
                  >
                    <span>Consultar en portal</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-lapis" aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </div>

          {/* 4-Axis Visual Ethnography Reading Framework for ULPGC Students */}
          <div className="bg-paper border border-hairline border-t-2 border-t-rule p-6 sm:p-7 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 font-mono text-xs text-lapis">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Guía de lectura crítica audiovisual · Diploma de Estudios Africanos</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink m-0">
                Cuatro claves para analizar cine etnográfico sobre África
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {VISUAL_METHODOLOGY_AXES.map((axis) => (
                <div
                  key={axis.num}
                  className="pt-4 border-t border-hairline flex flex-col gap-2"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs font-semibold text-ochre tabular-nums">
                      {axis.num}.
                    </span>
                    <h4 className="font-display text-base sm:text-lg font-semibold text-ink m-0">
                      {axis.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-ink m-0">{axis.concept}</p>
                  <p className="text-xs leading-relaxed text-ink-muted m-0">
                    <strong className="text-ink">Aplicación en aula:</strong>{' '}
                    {axis.africaApplication}
                  </p>
                  <span className="font-mono text-[11px] text-lapis pt-0.5">
                    Obras de referencia: {axis.keyFilms}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default VisualAnthropologyAfricaModule;
