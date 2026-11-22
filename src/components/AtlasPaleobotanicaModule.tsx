import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Maximize2, RefreshCw, Search } from 'lucide-react';
import {
  ATLAS_CLADOS,
  ATLAS_CLIMA,
  ATLAS_FUENTES,
  ATLAS_REGIONES,
  ATLAS_TAXONES,
  CLIMA_NOTA_EPISTEMOLOGICA,
  type CladoId,
} from '../data/atlasPaleo';
import { getTaxonImage, INSTITUTIONAL_MEDIA } from '../data/taxonImages';
import { GlossaryTermTrigger } from './GlossaryContext';
import { useLightbox } from './LightboxContext';

const ULPGC_PORTAL_URL =
  'https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/atlas/recorrido/portada-sylva.html';
const ULPGC_CLIMA_URL =
  'https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/atlas/recorrido/clima.html';
const ULPGC_TAXONES_URL =
  'https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/atlas/data/taxones.json';

interface RemoteTaxonRecord {
  id: string;
  nombre: string;
  clado: CladoId;
  rangoMa: { desde: number; hasta: number };
  region: string;
  regionNombre: string;
  notaGeografica?: string;
  debatido?: boolean;
  nivelEvidencia?: string;
  gradoConsenso?: string;
  fuentePrincipal?: string;
  fuentes: string[];
  notasIncertidumbre: string;
}

interface PortalSummary {
  title: string;
  subtitle: string;
  climaNote: string;
  botanicalDisclaimer: string;
  datasetVersion: string;
}

type FloraCategoryId =
  | 'mioceno_c3'
  | 'mosaico_bosque'
  | 'sabana_c4'
  | 'corredores_variables';

type SpeciesFilterId = 'destacadas' | 'todas' | FloraCategoryId;

interface FloraEvolutionCategory {
  id: FloraCategoryId;
  index: string;
  title: string;
  era: string;
  floralSignal: string;
  proxies: string;
  summary: string;
  color: string;
  softBg: string;
}

const FLORA_CATEGORIES: FloraEvolutionCategory[] = [
  {
    id: 'mioceno_c3',
    index: '01',
    title: 'Bosque cerrado C3',
    era: '~23 – 6 Ma · Mioceno',
    floralSignal: 'Dosel arbóreo tropical y frutos C3',
    proxies: 'Hojas fósiles, madera silicificada e isótopos δ13C',
    summary:
      'Ecosistemas boscosos continuos y húmedos donde evolucionaron los hominoideos miocenos y los primeros homininos basales.',
    color: '#156f55',
    softBg: '#eef7f4',
  },
  {
    id: 'mosaico_bosque',
    index: '02',
    title: 'Bosque galería y mosaico',
    era: '~6 – 2,5 Ma · Mioceno final – Plioceno',
    floralSignal: 'Transición palmeras–higueras–claros herbáceos',
    proxies: 'Entorno botánico de Ar. ramidus (WoldeGabriel et al., 2009)',
    summary:
      'Paisajes heterogéneos con bosques ribereños y parches abiertos que favorecieron la locomoción mixta y dietas diversificadas.',
    color: '#b43c0b',
    softBg: '#fdf3ee',
  },
  {
    id: 'sabana_c4',
    index: '03',
    title: 'Sabana abierta y gramíneas C4',
    era: '~3,5 – 1,2 Ma · Plio-Pleistoceno',
    floralSignal: 'Expansión de pastos C4, ciperáceas y recursos subterráneos',
    proxies: 'Paleosuelos carbonatados, fitolitos, δ13C y microdesgaste dental',
    summary:
      'Aridificación regional progresiva asociada a aparatos masticatorios robustos especializados en vegetación fibrosa C4 (P. boisei) o dietas mixtas C3/C4 con alimentos más duros (P. robustus).',
    color: '#8a5a00',
    softBg: '#fbf6ec',
  },
  {
    id: 'corredores_variables',
    index: '04',
    title: 'Corredores climáticos variables',
    era: '~2,6 – 0 Ma · Pleistoceno y Holoceno',
    floralSignal: 'Alternancia húmedo/árido · Sáhara verde y Eurasia',
    proxies: 'Polvo eólico, sedimentos lacustres y ciclos orbitales',
    summary:
      'Oscilaciones rápidas de vegetación que seleccionaron versatilidad ecológica, movilidad intercontinental y ecosistemas insulares.',
    color: '#1f5fa8',
    softBg: '#eef5fc',
  },
];

const SPOTLIGHT_IDS = new Set([
  'proconsul',
  'sahelanthropus',
  'ardipithecus',
  'afarensis',
  'africanus',
  'boisei',
  'habilis',
  'ergaster',
  'erectus',
  'floresiensis',
  'neanderthalensis',
  'sapiens',
]);

function classifyFloraCategory(t: RemoteTaxonRecord): FloraCategoryId {
  if (t.id === 'ardipithecus' || t.id === 'kadabba') {
    return 'mosaico_bosque';
  }
  if (t.clado === 'basales') {
    return 'mioceno_c3';
  }
  if (t.clado === 'paran') {
    return 'sabana_c4';
  }
  if (t.clado === 'austra' || t.clado === 'kenya') {
    return t.rangoMa.desde <= 3.0 ? 'sabana_c4' : 'mosaico_bosque';
  }
  return 'corredores_variables';
}

function buildFallbackTaxones(): RemoteTaxonRecord[] {
  return ATLAS_TAXONES.map((t) => ({
    id: t.id,
    nombre: t.n,
    clado: t.c,
    rangoMa: { desde: t.desde, hasta: t.hasta },
    region: t.region,
    regionNombre: ATLAS_REGIONES[t.region]?.nombre ?? t.region,
    notaGeografica: t.geoNota ?? '',
    debatido: t.debatido,
    nivelEvidencia: t.debatido ? 'media' : 'alta',
    gradoConsenso: t.debatido ? 'bajo' : 'alto',
    fuentePrincipal: t.fuentes[0],
    fuentes: t.fuentes,
    notasIncertidumbre: t.nota,
  }));
}

const FALLBACK_PORTAL: PortalSummary = {
  title: 'Atlas de paleoantropología · Plataforma Paleobot (ULPGC)',
  subtitle:
    'Especies, parentesco, territorio y métodos de la evolución humana, con fuentes verificadas.',
  climaNote: CLIMA_NOTA_EPISTEMOLOGICA,
  botanicalDisclaimer:
    'Nota del portal Sylva (ULPGC): las reconstrucciones paleoambientales integran indicadores botánicos, isotópicos, paleosuelos y sedimentos lacustres; las fotografías vegetales del portal de entrada muestran vegetación actual, no paisajes del pasado.',
  datasetVersion: 'v0.1.1 (respaldo verificado)',
};

const ENVIRONMENTAL_PROXIES: Record<string, { proxy: string; taxaLink: string }> = {
  variabilidad: {
    proxy: 'Mosaicos bosque–sabana · dieta flexible · versatilidad adaptativa',
    taxaLink: 'Ardipithecus ramidus (WoldeGabriel et al., 2009) y radiación de Australopithecus',
  },
  pulsos: {
    proxy: 'Paleosuelos · sedimentos lacustres · flujo de polvo e isótopos marinos',
    taxaLink: 'Intervalos de alta variabilidad en el Rift oriental y emergencia del género Homo',
  },
  sesgo: {
    proxy: 'Preservación diferencial en cuencas lacustres y niveles volcánicos',
    taxaLink: 'Sobrerrepresentación del Rift frente a bosques húmedos ácidos de África Central',
  },
};

function formatRangeMa(desde: number, hasta: number): string {
  const fmt = (n: number) => (n === 0 ? 'Actual' : `${n.toFixed(n < 1 ? 2 : 1)} Ma`);
  return `${fmt(desde)} – ${fmt(hasta)}`;
}

export function AtlasPaleobotanicaModule() {
  const [status, setStatus] = useState<'loading' | 'live' | 'fallback'>('loading');
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [portal, setPortal] = useState<PortalSummary>(FALLBACK_PORTAL);
  const [taxones, setTaxones] = useState<RemoteTaxonRecord[]>(() => buildFallbackTaxones());

  const [activeFilter, setActiveFilter] = useState<SpeciesFilterId>('destacadas');
  const [evidenceFilter, setEvidenceFilter] = useState<'todas' | 'alta' | 'debatido'>('todas');
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const { openSingle } = useLightbox();
  const abortRef = useRef<AbortController | null>(null);

  const loadFromULPGC = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    setStatus('loading');
    try {
      const [portalRes, climaRes, taxonesRes] = await Promise.all([
        fetch(ULPGC_PORTAL_URL, { mode: 'cors', signal: controller.signal }),
        fetch(ULPGC_CLIMA_URL, { mode: 'cors', signal: controller.signal }),
        fetch(ULPGC_TAXONES_URL, { mode: 'cors', signal: controller.signal }),
      ]);

      if (!portalRes.ok || !taxonesRes.ok) {
        throw new Error('No se pudo obtener respuesta válida del portal ULPGC.');
      }

      const [portalHtml, climaHtml, taxonesJson] = await Promise.all([
        portalRes.text(),
        climaRes.ok ? climaRes.text() : Promise.resolve(''),
        taxonesRes.json() as Promise<{
          meta?: { version?: string; fechaGeneracion?: string };
          taxones?: RemoteTaxonRecord[];
        }>,
      ]);

      if (controller.signal.aborted) return;

      const parser = new DOMParser();
      const portalDoc = parser.parseFromString(portalHtml, 'text/html');
      const h1Text = portalDoc.querySelector('h1')?.textContent?.trim();
      const ledeText = portalDoc.querySelector('.lede')?.textContent?.trim();

      let parsedClimaNote = CLIMA_NOTA_EPISTEMOLOGICA;
      if (climaHtml) {
        const climaDoc = parser.parseFromString(climaHtml, 'text/html');
        const paragraphs = Array.from(climaDoc.querySelectorAll('p')).map(
          (p) => p.textContent?.replace(/\s+/g, ' ').trim() ?? ''
        );
        const foundNote = paragraphs.find((t) => t.startsWith('Nota epistemológica'));
        if (foundNote) {
          parsedClimaNote = foundNote.replace(/^Nota epistemológica\.\s*/i, '');
        }
      }

      const remoteTaxones =
        Array.isArray(taxonesJson.taxones) && taxonesJson.taxones.length > 0
          ? taxonesJson.taxones
          : buildFallbackTaxones();

      setPortal({
        title: h1Text ? `${h1Text} · Plataforma Paleobot (ULPGC)` : FALLBACK_PORTAL.title,
        subtitle: ledeText || FALLBACK_PORTAL.subtitle,
        climaNote: parsedClimaNote,
        botanicalDisclaimer: FALLBACK_PORTAL.botanicalDisclaimer,
        datasetVersion: taxonesJson.meta?.version
          ? `v${taxonesJson.meta.version} (${taxonesJson.meta.fechaGeneracion ?? 'ULPGC'})`
          : 'ULPGC en directo',
      });
      setTaxones(remoteTaxones);
      setStatus('live');
      setLastFetched(
        new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      );
    } catch {
      if (abortRef.current !== controller) return;
      setPortal(FALLBACK_PORTAL);
      setTaxones(buildFallbackTaxones());
      setStatus('fallback');
    } finally {
      window.clearTimeout(timeoutId);
    }
  }, []);

  useEffect(() => {
    void loadFromULPGC();
    return () => {
      abortRef.current?.abort();
    };
  }, [loadFromULPGC]);

  // Categorical aggregations for Flora Evolution Dashboard
  const categoryStats = useMemo(() => {
    return FLORA_CATEGORIES.map((cat) => {
      const members = taxones.filter((t) => classifyFloraCategory(t) === cat.id);
      const africaMembers = members.filter((t) => ATLAS_REGIONES[t.region]?.esAfrica).length;
      const eurasiaMembers = members.length - africaMembers;
      const debatedMembers = members.filter((t) => t.debatido).length;
      return {
        ...cat,
        count: members.length,
        africaCount: africaMembers,
        eurasiaCount: eurasiaMembers,
        debatedCount: debatedMembers,
        sharePct: taxones.length > 0 ? Math.round((members.length / taxones.length) * 100) : 0,
      };
    });
  }, [taxones]);

  const dashboardMetrics = useMemo(() => {
    const africaTotal = taxones.filter((t) => ATLAS_REGIONES[t.region]?.esAfrica).length;
    const highEvidence = taxones.filter(
      (t) => t.nivelEvidencia?.toLowerCase() === 'alta'
    ).length;
    const debatedTotal = taxones.filter((t) => t.debatido).length;
    return {
      total: taxones.length,
      africaTotal,
      eurasiaTotal: taxones.length - africaTotal,
      highEvidence,
      debatedTotal,
    };
  }, [taxones]);

  const filteredSpecies = useMemo(() => {
    const q = query.trim().toLowerCase();
    return taxones.filter((t) => {
      const catId = classifyFloraCategory(t);
      if (activeFilter === 'destacadas' && !SPOTLIGHT_IDS.has(t.id)) return false;
      if (
        activeFilter !== 'destacadas' &&
        activeFilter !== 'todas' &&
        catId !== activeFilter
      ) {
        return false;
      }

      if (evidenceFilter === 'alta' && t.nivelEvidencia?.toLowerCase() !== 'alta') {
        return false;
      }
      if (evidenceFilter === 'debatido' && !t.debatido) {
        return false;
      }

      if (q) {
        const cat = FLORA_CATEGORIES.find((c) => c.id === catId);
        const hay =
          t.nombre.toLowerCase().includes(q) ||
          t.regionNombre.toLowerCase().includes(q) ||
          t.notasIncertidumbre.toLowerCase().includes(q) ||
          (cat?.title.toLowerCase().includes(q) ?? false) ||
          (cat?.floralSignal.toLowerCase().includes(q) ?? false);
        if (!hay) return false;
      }
      return true;
    });
  }, [taxones, activeFilter, evidenceFilter, query]);

  const displayedSpecies =
    activeFilter === 'todas' ? filteredSpecies.slice(0, visibleCount) : filteredSpecies;

  const maxCatCount = Math.max(1, ...categoryStats.map((c) => c.count));

  return (
    <section className="pt-12 border-t border-hairline flex flex-col gap-7">
      {/* Dashboard Masthead */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono text-xs tracking-wide text-forest">
            Atlas de Paleobotánica · Panel paleoambiental y evolución de la flora (ULPGC)
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-ink-muted">
            <span>
              {status === 'loading'
                ? 'Consultando fuente ULPGC...'
                : status === 'live'
                  ? `Datos en directo desde ULPGC${lastFetched ? ` (${lastFetched})` : ''}`
                  : 'Vista sincronizada con copia local verificada'}
            </span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => void loadFromULPGC()}
              disabled={status === 'loading'}
              className="inline-flex items-center gap-1.5 text-ink hover:text-ochre disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${status === 'loading' ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.2rem] font-semibold leading-tight tracking-tight text-ink max-w-4xl [text-wrap:balance]">
          Atlas de Paleobotánica: evolución de la flora, biomas y registro de especies
        </h2>

        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-ink-muted">
          <span>Fuente: {portal.title}</span>
          <span aria-hidden="true">·</span>
          <span>Dataset {portal.datasetVersion}</span>
          <span aria-hidden="true">·</span>
          <a
            href={ULPGC_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-lapis hover:underline"
          >
            <span>Abrir portal Sylva ULPGC</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* 4-Column Dashboard KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="border-t border-rule pt-3 flex flex-col gap-1">
          <span className="font-mono text-[11px] text-ink-muted">Especies analizadas</span>
          <span className="font-mono text-2xl font-medium tabular-nums text-ink">
            {dashboardMetrics.total}
          </span>
          <span className="font-mono text-xs text-ink-muted tabular-nums">
            {dashboardMetrics.africaTotal} África · {dashboardMetrics.eurasiaTotal} Eurasia/SE Asia
          </span>
        </div>

        <div className="border-t border-rule pt-3 flex flex-col gap-1">
          <span className="font-mono text-[11px] text-ink-muted">Categorías de flora</span>
          <span className="font-mono text-2xl font-medium tabular-nums text-forest">
            4 biomas
          </span>
          <span className="font-mono text-xs text-forest">
            De bosque cerrado C3 a sabana C4
          </span>
        </div>

        <div className="border-t border-rule pt-3 flex flex-col gap-1">
          <span className="font-mono text-[11px] text-ink-muted">Evidencia alta (JSON ULPGC)</span>
          <span className="font-mono text-2xl font-medium tabular-nums text-lapis">
            {dashboardMetrics.highEvidence} / {dashboardMetrics.total}
          </span>
          <span className="font-mono text-xs text-ink-muted tabular-nums">
            {dashboardMetrics.debatedTotal} entradas con posición debatida
          </span>
        </div>

        <div className="border-t border-rule pt-3 flex flex-col gap-1">
          <span className="font-mono text-[11px] text-ink-muted">Profundidad paleoambiental</span>
          <span className="font-mono text-2xl font-medium tabular-nums text-ochre">
            23 – 0 Ma
          </span>
          <span className="font-mono text-xs text-ink-muted">
            Mioceno, Plioceno y Pleistoceno
          </span>
        </div>
      </div>

      {/* Portal Editorial Synthesis & Disclaimer */}
      <div className="bg-paper border-t border-b border-hairline px-5 py-4 flex flex-col gap-2.5 text-sm sm:text-[15px] leading-relaxed text-ink">
        <p className="max-w-[68ch] m-0">
          <strong className="font-semibold text-ink">Síntesis del portal fuente:</strong>{' '}
          {portal.subtitle} {portal.botanicalDisclaimer}
        </p>
        <p className="text-sm text-ink-muted max-w-[68ch] m-0">
          <span className="font-mono text-xs font-medium text-ink mr-1.5">Criterio paleoambiental ·</span>
          {portal.climaNote}
        </p>
      </div>

      {/* Categorical Flora Evolution Grid + Live Distribution Visualization */}
      <div className="py-6 border-t border-rule border-b border-b-hairline flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="font-display text-xl font-semibold text-ink">
              Evolución categórica de la flora y distribución de especies
            </h3>
            <p className="font-mono text-xs text-ink-muted">
              Pulse una categoría vegetal o una barra del gráfico para filtrar el panel de especies
              inferior
            </p>
          </div>
          {activeFilter !== 'destacadas' && activeFilter !== 'todas' && (
            <button
              type="button"
              onClick={() => setActiveFilter('destacadas')}
              className="self-start md:self-auto font-mono text-xs text-ink hover:text-ochre underline underline-offset-4 cursor-pointer whitespace-nowrap"
            >
              Ver todas las categorías
            </button>
          )}
        </div>

        {/* 4-Column Responsive Categorical Flora Evolution Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryStats.map((cat) => {
            const isSelected = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveFilter(isSelected ? 'destacadas' : cat.id);
                  setVisibleCount(12);
                }}
                aria-pressed={isSelected}
                className={`text-left p-5 border border-t-2 flex flex-col justify-between gap-4 transition-colors duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-ink bg-paper'
                    : 'border-hairline bg-canvas hover:border-ink hover:bg-paper/60'
                }`}
                style={{ borderTopColor: cat.color }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-2 font-mono text-[11px]">
                    <span className="font-medium" style={{ color: cat.color }}>
                      {cat.index}. {cat.era}
                    </span>
                    <span className="tabular-nums text-ink font-semibold">
                      {cat.count} esp. ({cat.sharePct}%)
                    </span>
                  </div>

                  <h4 className="font-display text-lg font-semibold text-ink leading-snug">
                    {cat.title}
                  </h4>

                  <p className="text-sm leading-relaxed text-ink-muted m-0">{cat.summary}</p>
                </div>

                <div className="pt-3 border-t border-hairline flex flex-col gap-2 w-full">
                  <div className="text-xs leading-snug">
                    <span className="font-mono text-[11px] text-ink-muted block">Señal botánica</span>
                    <span className="text-ink font-medium">{cat.floralSignal}</span>
                  </div>
                  <div className="text-xs leading-snug">
                    <span className="font-mono text-[11px] text-ink-muted block">Indicadores</span>
                    <span className="text-ink-muted">{cat.proxies}</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-high overflow-hidden mt-1" aria-hidden="true">
                    <div
                      className="h-full transition-all duration-200"
                      style={{ width: `${cat.sharePct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Visual Breakdown Chart: Species Count by Flora Category (Africa vs Eurasia) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
          <div className="lg:col-span-8">
            <svg
              viewBox="0 0 640 198"
              className="w-full h-auto block"
              role="img"
              aria-label="Distribución de especies por categoría de flora comparando África y Eurasia"
            >
              <text x={0} y={14} className="font-mono" fontSize={11} fill="#575753">
                Distribución del corpus por categoría de flora · África (color del bioma) vs.
                Eurasia/SE Asia (trama suave)
              </text>

              {categoryStats.map((cat, idx) => {
                const y = 34 + idx * 38;
                const xStart = 205;
                const maxBarW = 365;
                const totalW = (cat.count / maxCatCount) * maxBarW;
                const africaW = (cat.africaCount / maxCatCount) * maxBarW;
                const eurasiaW = Math.max(0, totalW - africaW);
                const isSel = activeFilter === cat.id;

                return (
                  <g
                    key={cat.id}
                    onClick={() => setActiveFilter(isSel ? 'destacadas' : cat.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveFilter(isSel ? 'destacadas' : cat.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${cat.title}: ${cat.count} especies (${cat.africaCount} en África, ${cat.eurasiaCount} en Eurasia)`}
                    className="cursor-pointer"
                  >
                    <rect
                      x={0}
                      y={y - 6}
                      width={636}
                      height={30}
                      fill={isSel ? '#f7f7f5' : 'transparent'}
                    />
                    <text
                      x={xStart - 10}
                      y={y + 13}
                      textAnchor="end"
                      className="font-mono"
                      fontSize={11}
                      fontWeight={isSel ? 600 : 400}
                      fill={isSel ? '#121212' : '#575753'}
                    >
                      {cat.title}
                    </text>
                    <rect x={xStart} y={y + 1} width={maxBarW} height={16} fill="#f1f1ee" />
                    <rect x={xStart} y={y + 1} width={africaW} height={16} fill={cat.color} />
                    {eurasiaW > 0 && (
                      <rect
                        x={xStart + africaW}
                        y={y + 1}
                        width={eurasiaW}
                        height={16}
                        fill={cat.color}
                        fillOpacity={0.32}
                      />
                    )}
                    <text
                      x={xStart + totalW + 8}
                      y={y + 13}
                      className="font-mono"
                      fontSize={11}
                      fontWeight={500}
                      fill="#121212"
                    >
                      {cat.count} ({cat.africaCount} Áfr.)
                    </text>
                  </g>
                );
              })}

              <line x1={205} y1={24} x2={205} y2={184} stroke="#121212" strokeWidth={1} />
            </svg>
          </div>

          <div className="lg:col-span-4 bg-paper border-t border-b border-hairline p-4 flex flex-col gap-3 text-xs">
            <div className="font-mono font-medium text-ink">
              Lectura paleoambiental del panel
            </div>
            <p className="text-ink-muted leading-relaxed">
              Los biomas del Mioceno y Plioceno africano (
              <GlossaryTermTrigger termId="flora-c3-c4" tone="forest">
                bosque C3
              </GlossaryTermTrigger>
              ,{' '}
              <GlossaryTermTrigger termId="bosque-galeria" tone="forest">
                bosque galería
              </GlossaryTermTrigger>{' '}
              y{' '}
              <GlossaryTermTrigger termId="flora-c3-c4" tone="forest">
                sabana C4
              </GlossaryTermTrigger>
              , reconstruidos mediante{' '}
              <GlossaryTermTrigger termId="fitolitos" tone="forest">
                fitolitos
              </GlossaryTermTrigger>{' '}
              y{' '}
              <GlossaryTermTrigger termId="paleosuelos" tone="forest">
                paleosuelos
              </GlossaryTermTrigger>
              ) concentran el origen de todos los linajes basales, australopitecos y parántropos. La
              expansión eurasiática e insular se vincula al cuarto bloque de{' '}
              <strong className="text-ink font-medium">corredores climáticos variables</strong>.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-ink-muted pt-2 border-t border-hairline">
              <span>Sólido: registro africano</span>
              <span>·</span>
              <span>Atenuado: Eurasia / SE Asia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Frameworks Grid (3 Cards from clima.html / datos.js) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-xl font-semibold text-ink">
            Marcos ecológicos y clima del corpus ULPGC
          </h3>
          <p className="font-mono text-xs text-ink-muted">
            Variabilidad ambiental,{' '}
            <GlossaryTermTrigger termId="ciclos-orbitales" tone="forest">
              ciclos orbitales
            </GlossaryTermTrigger>{' '}
            y sesgos de{' '}
            <GlossaryTermTrigger termId="tafonomia" tone="forest">
              tafonomía
            </GlossaryTermTrigger>{' '}
            en la conservación vegetal y fósil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ATLAS_CLIMA.map((item, idx) => {
            const extra = ENVIRONMENTAL_PROXIES[item.id];
            return (
              <article
                key={item.id}
                className="bg-canvas border border-hairline border-t-2 border-t-forest p-5 flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="font-mono text-[11px] text-forest tabular-nums">
                    Eje ecológico 0{idx + 1}
                  </div>
                  <h4 className="font-display text-lg font-semibold text-ink leading-snug">
                    {item.titulo}
                  </h4>
                  <p className="text-sm leading-relaxed text-ink-muted">{item.idea}</p>
                </div>

                <div className="pt-3 border-t border-hairline flex flex-col gap-2 text-xs">
                  {extra && (
                    <>
                      <div>
                        <span className="font-mono text-[11px] text-ink font-medium block">
                          Indicadores botánicos y geológicos
                        </span>
                        <span className="text-ink-muted">{extra.proxy}</span>
                      </div>
                      <div>
                        <span className="font-mono text-[11px] text-ink font-medium block">
                          Anclaje en el registro
                        </span>
                        <span className="text-ink-muted">{extra.taxaLink}</span>
                      </div>
                    </>
                  )}
                  <div className="pt-2 border-t border-hairline flex flex-wrap gap-x-3 gap-y-1">
                    {item.fuentes.map((fKey) => {
                      const ref = ATLAS_FUENTES[fKey];
                      if (!ref) return null;
                      return (
                        <a
                          key={fKey}
                          href={ref.doi ? `https://doi.org/${ref.doi}` : ULPGC_PORTAL_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-lapis hover:underline"
                        >
                          <span>
                            {ref.cita.split('(')[0].trim()} ({ref.cita.match(/\d{4}/)?.[0]})
                          </span>
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Responsive Card-Based Species Explorer */}
      <div className="pt-6 border-t border-rule flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-display text-xl font-semibold text-ink">
              Tarjetas de especies por categoría de flora y evidencia
            </h3>
            <p className="font-mono text-xs text-ink-muted">
              Datos estructurados recuperados de la plataforma ULPGC · Filtre por bioma, nivel de
              evidencia o búsqueda libre
            </p>
          </div>

          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Filtros por categoría de flora"
          >
            {(
              [
                { id: 'destacadas', label: 'Selección clave (12)' },
                { id: 'mioceno_c3', label: 'Bosque C3' },
                { id: 'mosaico_bosque', label: 'Mosaico bosque' },
                { id: 'sabana_c4', label: 'Sabana C4' },
                { id: 'corredores_variables', label: 'Corredores variables' },
                { id: 'todas', label: `Todas (${taxones.length})` },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setActiveFilter(opt.id);
                  setVisibleCount(12);
                }}
                aria-pressed={activeFilter === opt.id}
                className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeFilter === opt.id
                    ? 'bg-forest text-white border-forest'
                    : 'bg-canvas text-ink border-hairline hover:border-ink hover:bg-paper'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search
                className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar especie, bioma o región..."
                aria-label="Buscar especies en el Atlas de Paleobotánica"
                className="w-full min-h-[40px] pl-9 pr-3 py-1.5 text-sm bg-canvas border border-hairline rounded text-ink placeholder:text-ink-subtle focus:border-ink"
              />
            </div>

            <div className="flex items-center gap-1.5" role="group" aria-label="Filtro de evidencia">
              {(
                [
                  { id: 'todas', label: 'Cualquier evidencia' },
                  { id: 'alta', label: 'Evidencia alta' },
                  { id: 'debatido', label: 'En debate' },
                ] as const
              ).map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => setEvidenceFilter(ev.id)}
                  aria-pressed={evidenceFilter === ev.id}
                  className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    evidenceFilter === ev.id
                      ? 'bg-ink text-white border-ink'
                      : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
                  }`}
                >
                  {ev.label}
                </button>
              ))}
            </div>
          </div>

          <span className="font-mono text-xs text-ink-muted tabular-nums">
            Mostrando {displayedSpecies.length} de {filteredSpecies.length} tarjetas
          </span>
        </div>

        {/* Card grid (renders immediately from verified corpus while live ULPGC sync runs) */}
        {displayedSpecies.length === 0 ? (
          <div className="p-8 border border-hairline bg-paper text-center flex flex-col items-center gap-3">
            <p className="text-sm text-ink-muted m-0">
              No se encontraron especies con los filtros actuales. Pruebe otro bioma, limpie la
              búsqueda o seleccione «Todas».
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveFilter('todas');
                setEvidenceFilter('todas');
                setQuery('');
                setVisibleCount(12);
              }}
              className="min-h-[38px] px-4 py-1.5 font-mono text-xs font-medium text-ink bg-canvas border border-ink rounded hover:bg-ink hover:text-white transition-colors cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedSpecies.map((t) => {
              const cladoInfo = ATLAS_CLADOS[t.clado];
              const floraCat =
                FLORA_CATEGORIES.find((c) => c.id === classifyFloraCategory(t)) ??
                FLORA_CATEGORIES[0];
              const primaryRefKey = t.fuentePrincipal ?? t.fuentes[0];
              const primaryRef = primaryRefKey ? ATLAS_FUENTES[primaryRefKey] : undefined;
              const speciesImg = getTaxonImage(t.id, t.clado);

              return (
                <article
                  key={t.id}
                  className="bg-canvas border border-hairline p-5 flex flex-col justify-between gap-4 hover:border-ink transition-colors duration-150"
                >
                  <div className="flex flex-col gap-2.5">
                    <figure className="m-0 flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={(e) =>
                          openSingle(
                            {
                              src: speciesImg.src,
                              alt: speciesImg.alt,
                              title: t.nombre,
                              subtitle: `${floraCat.title} · ${formatRangeMa(t.rangoMa.desde, t.rangoMa.hasta)}`,
                              caption: speciesImg.isReference
                                ? `Imagen de referencia · ${speciesImg.objeto}`
                                : speciesImg.objeto,
                              credit: speciesImg.credito,
                              license: speciesImg.licencia,
                              licenseUrl: speciesImg.licenciaUrl,
                              sourceUrl: speciesImg.fuente,
                            },
                            e.currentTarget
                          )
                        }
                        aria-label={`Ampliar imagen del espécimen de ${t.nombre}`}
                        className="group relative w-full aspect-[16/10] bg-[#eeede8] border border-hairline hover:border-ink overflow-hidden flex items-center justify-center p-1.5 cursor-zoom-in transition-colors"
                      >
                        <img
                          src={speciesImg.src}
                          alt={speciesImg.alt}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src !== INSTITUTIONAL_MEDIA.smithsonianCrania) {
                              target.src = INSTITUTIONAL_MEDIA.smithsonianCrania;
                            }
                          }}
                          className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                        />
                        <span
                          aria-hidden="true"
                          className="no-print absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-[#121212]/80 text-white font-mono text-[10px] inline-flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity"
                        >
                          <Maximize2 className="w-2.5 h-2.5" />
                          <span>Ampliar</span>
                        </span>
                      </button>
                      <figcaption className="font-mono text-[10px] text-ink-subtle truncate">
                        {speciesImg.credito} · {speciesImg.licencia}
                      </figcaption>
                    </figure>

                    {/* Zero-pill unboxed metadata header */}
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-mono text-[11px] text-ink-muted">
                      <span
                        className="font-medium"
                        style={{ color: cladoInfo?.color ?? '#121212' }}
                      >
                        {cladoInfo?.short ?? t.clado}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {formatRangeMa(t.rangoMa.desde, t.rangoMa.hasta)}
                      </span>
                      {t.debatido && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-ochre font-medium">En debate</span>
                        </>
                      )}
                    </div>

                    <h4 className="font-display italic text-lg font-semibold text-ink leading-snug">
                      {t.nombre}
                    </h4>

                    <p className="text-sm leading-relaxed text-ink">{t.notasIncertidumbre}</p>
                  </div>

                  <dl className="pt-3 border-t border-hairline flex flex-col gap-2 text-xs m-0">
                    <div>
                      <dt className="font-mono text-[10.5px] text-ink-muted">
                        Categoría de flora y hábitat
                      </dt>
                      <dd className="leading-snug m-0">
                        <span className="font-medium" style={{ color: floraCat.color }}>
                          {floraCat.title}
                        </span>
                        <span className="text-ink-muted"> · {floraCat.floralSignal}</span>
                      </dd>
                    </div>

                    <div className="flex items-baseline justify-between gap-2 pt-1.5 border-t border-hairline">
                      <div className="min-w-0">
                        <dt className="font-mono text-[10.5px] text-ink-muted">Región</dt>
                        <dd className="font-mono text-[11px] text-ink truncate m-0">
                          {t.regionNombre}
                        </dd>
                      </div>
                      {(t.nivelEvidencia || t.gradoConsenso) && (
                        <div className="text-right shrink-0">
                          <dt className="font-mono text-[10.5px] text-ink-muted">
                            Evidencia / Consenso
                          </dt>
                          <dd className="font-mono text-[11px] text-ink m-0">
                            {t.nivelEvidencia ?? 'media'} · {t.gradoConsenso ?? 'medio'}
                          </dd>
                        </div>
                      )}
                    </div>

                    {primaryRef && (
                      <div className="pt-1.5 border-t border-hairline flex items-center justify-between gap-2">
                        <span className="font-mono text-[10.5px] text-ink-muted truncate">
                          {primaryRef.cita.split('.')[0]}
                        </span>
                        {primaryRef.doi && (
                          <a
                            href={`https://doi.org/${primaryRef.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-lapis hover:underline whitespace-nowrap shrink-0"
                          >
                            <span>DOI</span>
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    )}
                  </dl>
                </article>
              );
            })}
          </div>
        )}

        {activeFilter === 'todas' && visibleCount < filteredSpecies.length && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + 12)}
              className="min-h-[42px] px-5 py-2 text-xs font-semibold text-ink bg-canvas border border-hairline rounded hover:border-ink hover:bg-paper transition-colors whitespace-nowrap cursor-pointer"
            >
              Mostrar más especies ({filteredSpecies.length - visibleCount} restantes)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
