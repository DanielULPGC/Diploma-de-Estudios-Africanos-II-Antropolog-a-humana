import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  ArrowUpRight,
  BookOpen,
  Clock,
  Eye,
  Image as ImageIcon,
  Layers,
  Scale,
  Search,
  Sparkles,
  X,
  ZoomIn,
} from 'lucide-react';
import {
  BINARY_AXIS_FILTERS,
  COLONIAL_BINARY_PAIRS,
  COLONIAL_GENEALOGY_PHASES,
  COUNTER_NARRATIVE_DOMAINS,
  CULTURAL_STUDIES_BIBLIOGRAPHY,
  CULTURAL_STUDIES_THEORISTS,
  CULTURAL_STUDIES_VISUAL_PLATES,
  DECODING_ARTIFACTS,
  MYSTERIOUS_AFRICA_TROPES,
  SECTION_GALLERY_META,
  TROPE_MEDIUM_FILTERS,
  type BinaryAxisId,
  type CulturalStudiesTabId,
  type CulturalVisualPlateId,
  type CulturalVisualReferencePlate,
  type HallReadingPosition,
  type TropeMediumId,
} from '../data/culturalStudiesAfricaData';
import {
  clearPendingCourseDetail,
  consumePendingCourseDetail,
  normalizeSearchText,
} from '../data/courseNavigation';
import { GlossaryTermTrigger } from './GlossaryContext';
import { useLightbox, type LightboxItem } from './LightboxContext';

const MODULE_TABS: Array<{ id: CulturalStudiesTabId; label: string }> = [
  { id: 'marco-teorico', label: 'I. Marco teórico · Cultural Studies' },
  { id: 'genealogia-colonial', label: 'II. Genealogía colonial (1490–2025)' },
  { id: 'tropos', label: 'III. Estereotipos del «África misteriosa» (12)' },
  { id: 'decodificador', label: 'IV. Laboratorio de lectura · Stuart Hall' },
  { id: 'contranarrativas', label: 'V. Contra-narrativas y creación africana' },
];

const HALL_POSITIONS: Array<{ id: HallReadingPosition; label: string; subtitle: string }> = [
  {
    id: 'dominante',
    label: '1. Lectura dominante',
    subtitle: 'Reproduce el código colonial',
  },
  {
    id: 'negociada',
    label: '2. Lectura negociada',
    subtitle: 'Matiza pero conserva el marco',
  },
  {
    id: 'oposicional',
    label: '3. Lectura oposicional',
    subtitle: 'Desmonta el estereotipo',
  },
];

function toLightboxItem(plate: CulturalVisualReferencePlate): LightboxItem {
  return {
    src: plate.src,
    alt: plate.alt,
    title: `${plate.sourceCode} (${plate.datePeriod}) · ${plate.title}`,
    subtitle: `${plate.figureNum} · ${plate.sourceType}`,
    caption: `${plate.caption} ${plate.analyticalFocus}`,
    credit: `${plate.provenanceNote} · ${plate.credit}`,
  };
}

interface HistoricalSourceGalleryProps {
  section: CulturalStudiesTabId;
  plates: CulturalVisualReferencePlate[];
  platesById: Record<CulturalVisualPlateId, CulturalVisualReferencePlate>;
  brokenPlates: Record<string, boolean>;
  onMarkBroken: (id: string) => void;
  onOpenSingle: (plate: CulturalVisualReferencePlate) => void;
  onOpenCompare: (plateA: CulturalVisualReferencePlate, plateB: CulturalVisualReferencePlate) => void;
  onSelectFromPlate?: (plate: CulturalVisualReferencePlate) => void;
  activeLinkedId?: string;
}

function HistoricalSourceGallery({
  section,
  plates,
  platesById,
  brokenPlates,
  onMarkBroken,
  onOpenSingle,
  onOpenCompare,
  onSelectFromPlate,
  activeLinkedId,
}: HistoricalSourceGalleryProps) {
  const meta = SECTION_GALLERY_META[section];
  const gridClass =
    plates.length >= 4
      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-3';

  return (
    <div
      aria-label={`${meta.kicker}: ${meta.title}`}
      className="pt-6 border-t border-rule flex flex-col gap-5"
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-mono text-xs text-ochre tabular-nums">
            {meta.kicker} · {plates.length} fuentes documentales
          </span>
          <span className="font-mono text-[11px] text-ink-muted">
            Pulse una lámina para ampliar o utilice «Contrastar» para comparar con su contra-fuente
          </span>
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink m-0 leading-snug">
          {meta.title}
        </h3>
        <p className="text-xs sm:text-sm leading-relaxed text-ink-muted max-w-[78ch] m-0">
          {meta.intro}
        </p>
      </div>

      <div className={`grid ${gridClass} gap-5`}>
        {plates.map((plate) => {
          const isBroken = Boolean(brokenPlates[plate.id]);
          const compareTarget = platesById[plate.compareWithId];
          const isLinkedActive =
            Boolean(activeLinkedId) &&
            (plate.linkedTheoristId === activeLinkedId ||
              plate.linkedPhaseId === activeLinkedId ||
              plate.linkedTropeId === activeLinkedId ||
              plate.linkedArtifactId === activeLinkedId ||
              plate.linkedDomainId === activeLinkedId);

          return (
            <figure
              key={plate.id}
              className={`m-0 bg-paper border flex flex-col justify-between overflow-hidden group transition-colors ${
                isLinkedActive ? 'border-ochre' : 'border-hairline'
              }`}
            >
              <div className="flex flex-col">
                <div className="px-3.5 py-2 bg-canvas border-b border-hairline font-mono text-[11px] flex items-center justify-between gap-2 tabular-nums">
                  <span className="font-semibold text-ink">{plate.sourceCode}</span>
                  <span className="text-ochre truncate">{plate.datePeriod}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenSingle(plate)}
                  aria-label={`Ampliar ${plate.sourceCode} (${plate.datePeriod}): ${plate.title}`}
                  className="relative w-full aspect-[4/3] bg-canvas overflow-hidden border-b border-hairline cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre"
                >
                  {!isBroken ? (
                    <img
                      src={plate.src}
                      alt={plate.alt}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={() => onMarkBroken(plate.id)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center text-ink-muted">
                      <ImageIcon className="w-6 h-6 text-ochre" aria-hidden="true" />
                      <span className="font-mono text-[11px]">
                        {plate.sourceCode} · {plate.datePeriod}
                      </span>
                    </div>
                  )}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-2.5 right-2.5 bg-ink/85 text-white px-2 py-1 text-[11px] font-mono inline-flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity"
                  >
                    <ZoomIn className="w-3 h-3" />
                    Ampliar
                  </span>
                </button>

                <figcaption className="p-4 flex flex-col gap-2">
                  <div className="font-mono text-[11px] text-lapis leading-snug">
                    {plate.figureNum} · {plate.sourceType}
                  </div>
                  <h4 className="font-display text-base font-semibold text-ink leading-snug m-0">
                    {plate.title}
                  </h4>
                  <p className="text-xs leading-relaxed text-ink m-0">{plate.caption}</p>

                  <div className="pt-2.5 mt-0.5 border-t border-hairline flex flex-col gap-1.5 text-[11px] leading-relaxed">
                    <p className="m-0 text-ink-muted">
                      <strong className="font-mono text-ink font-medium">Contexto de fuente:</strong>{' '}
                      {plate.provenanceNote}
                    </p>
                    <p className="m-0 text-ink-muted">
                      <strong className="font-mono text-ochre font-medium">Lectura crítica:</strong>{' '}
                      {plate.analyticalFocus}
                    </p>
                  </div>
                </figcaption>
              </div>

              <div className="px-3.5 py-2 border-t border-hairline bg-canvas flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenSingle(plate)}
                    className="min-h-[36px] text-xs font-mono text-ink hover:text-ochre transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Fuente</span>
                  </button>
                  {compareTarget && (
                    <button
                      type="button"
                      onClick={() => onOpenCompare(plate, compareTarget)}
                      title={`Comparar ${plate.sourceCode} frente a ${compareTarget.sourceCode}`}
                      className="min-h-[36px] text-xs font-mono text-forest hover:text-ink transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Contrastar</span>
                    </button>
                  )}
                </div>

                {onSelectFromPlate && (
                  <button
                    type="button"
                    onClick={() => onSelectFromPlate(plate)}
                    className="min-h-[36px] text-xs font-mono font-medium text-lapis hover:text-ink transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{plate.linkedActionLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </figure>
          );
        })}
      </div>
    </div>
  );
}

interface InlineSourceFigureProps {
  plate: CulturalVisualReferencePlate;
  compareTarget?: CulturalVisualReferencePlate;
  isBroken: boolean;
  onMarkBroken: (id: string) => void;
  onOpenSingle: (plate: CulturalVisualReferencePlate) => void;
  onOpenCompare: (plateA: CulturalVisualReferencePlate, plateB: CulturalVisualReferencePlate) => void;
  labelPrefix?: string;
}

function InlineSourceFigure({
  plate,
  compareTarget,
  isBroken,
  onMarkBroken,
  onOpenSingle,
  onOpenCompare,
  labelPrefix = 'Fuente histórica asociada',
}: InlineSourceFigureProps) {
  return (
    <figure className="m-0 bg-canvas border border-hairline grid grid-cols-1 sm:grid-cols-12 overflow-hidden">
      <button
        type="button"
        onClick={() => onOpenSingle(plate)}
        aria-label={`Ampliar ${plate.sourceCode}: ${plate.title}`}
        className="sm:col-span-5 relative aspect-[4/3] sm:aspect-auto sm:min-h-[164px] bg-paper overflow-hidden border-b sm:border-b-0 sm:border-r border-hairline cursor-pointer group"
      >
        {!isBroken ? (
          <img
            src={plate.src}
            alt={plate.alt}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => onMarkBroken(plate.id)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 p-4 text-ink-muted">
            <ImageIcon className="w-5 h-5 text-ochre" aria-hidden="true" />
            <span className="font-mono text-[11px]">{plate.sourceCode}</span>
          </div>
        )}
        <span
          aria-hidden="true"
          className="absolute bottom-2 right-2 bg-ink/85 text-white px-2 py-0.5 text-[11px] font-mono inline-flex items-center gap-1"
        >
          <ZoomIn className="w-3 h-3" />
          Ampliar
        </span>
      </button>

      <figcaption className="sm:col-span-7 p-4 flex flex-col justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="font-mono text-[11px] text-ochre flex flex-wrap items-center gap-x-1.5 tabular-nums">
            <span>{labelPrefix}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold">{plate.sourceCode}</span>
            <span aria-hidden="true">·</span>
            <span className="text-ink-muted">{plate.datePeriod}</span>
          </div>
          <p className="font-display text-sm font-semibold text-ink m-0 leading-snug">
            {plate.title}
          </p>
          <p className="text-xs leading-relaxed text-ink-muted m-0">{plate.analyticalFocus}</p>
        </div>

        <div className="pt-2 border-t border-hairline flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => onOpenSingle(plate)}
            className="min-h-[32px] text-ink hover:text-ochre inline-flex items-center gap-1 cursor-pointer"
          >
            <ZoomIn className="w-3 h-3" aria-hidden="true" />
            <span>Inspeccionar lámina</span>
          </button>
          {compareTarget && (
            <button
              type="button"
              onClick={() => onOpenCompare(plate, compareTarget)}
              className="min-h-[32px] text-forest hover:text-ink inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeftRight className="w-3 h-3" aria-hidden="true" />
              <span>Contrastar con {compareTarget.sourceCode}</span>
            </button>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

export function CulturalStudiesAfricaModule() {
  const { openSingle, openCompare } = useLightbox();
  const [activeTab, setActiveTab] = useState<CulturalStudiesTabId>('genealogia-colonial');
  const [selectedTheoristId, setSelectedTheoristId] = useState<string>(
    CULTURAL_STUDIES_THEORISTS[0].id
  );
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(
    COLONIAL_GENEALOGY_PHASES[2].id
  );
  const [selectedBinaryAxis, setSelectedBinaryAxis] = useState<BinaryAxisId>('todos');
  const [selectedMedium, setSelectedMedium] = useState<TropeMediumId>('todos');
  const [tropeQuery, setTropeQuery] = useState<string>('');
  const [selectedTropeId, setSelectedTropeId] = useState<string>(MYSTERIOUS_AFRICA_TROPES[0].id);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>(DECODING_ARTIFACTS[0].id);
  const [readingPosition, setReadingPosition] = useState<HallReadingPosition>('oposicional');
  const [brokenPlates, setBrokenPlates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const applyDetail = (detail?: {
      tab?: CulturalStudiesTabId;
      tropeId?: string;
      phaseId?: string;
    }) => {
      if (!detail) return;
      if (detail.tab) {
        setActiveTab(detail.tab);
      }
      if (detail.phaseId) {
        const foundPhase = COLONIAL_GENEALOGY_PHASES.some((p) => p.id === detail.phaseId);
        if (foundPhase) {
          setSelectedPhaseId(detail.phaseId);
        }
      }
      if (detail.tropeId) {
        const found = MYSTERIOUS_AFRICA_TROPES.some((t) => t.id === detail.tropeId);
        if (found) {
          setSelectedMedium('todos');
          setTropeQuery('');
          setSelectedTropeId(detail.tropeId);
        }
      }
    };

    const pending = consumePendingCourseDetail('culturalStudies');
    if (pending) {
      applyDetail(pending);
    }

    const onOpen = (evt: Event) => {
      const customEvt = evt as CustomEvent<{
        tab?: CulturalStudiesTabId;
        tropeId?: string;
        phaseId?: string;
      }>;
      clearPendingCourseDetail('culturalStudies');
      applyDetail(customEvt.detail);
    };

    window.addEventListener('ulpgc:open-cultural-studies-tab', onOpen);
    return () => {
      window.removeEventListener('ulpgc:open-cultural-studies-tab', onOpen);
    };
  }, []);

  const activeTheorist = useMemo(
    () =>
      CULTURAL_STUDIES_THEORISTS.find((t) => t.id === selectedTheoristId) ??
      CULTURAL_STUDIES_THEORISTS[0],
    [selectedTheoristId]
  );

  const activePhase = useMemo(
    () =>
      COLONIAL_GENEALOGY_PHASES.find((p) => p.id === selectedPhaseId) ??
      COLONIAL_GENEALOGY_PHASES[0],
    [selectedPhaseId]
  );

  const filteredBinaryPairs = useMemo(() => {
    if (selectedBinaryAxis === 'todos') return COLONIAL_BINARY_PAIRS;
    return COLONIAL_BINARY_PAIRS.filter((pair) => pair.axis === selectedBinaryAxis);
  }, [selectedBinaryAxis]);

  const filteredTropes = useMemo(() => {
    const q = normalizeSearchText(tropeQuery);
    return MYSTERIOUS_AFRICA_TROPES.filter((t) => {
      if (selectedMedium !== 'todos' && t.medium !== selectedMedium) return false;
      if (!q) return true;
      const hay = normalizeSearchText(
        `${t.num} ${t.title} ${t.clicheSignature} ${t.historicalOrigin} ${t.culturalMechanism} ${t.examples} ${t.tags.join(' ')}`
      );
      return hay.includes(q);
    });
  }, [selectedMedium, tropeQuery]);

  const activeTrope = useMemo(() => {
    return (
      filteredTropes.find((t) => t.id === selectedTropeId) ??
      filteredTropes[0] ??
      MYSTERIOUS_AFRICA_TROPES[0]
    );
  }, [filteredTropes, selectedTropeId]);

  const activeArtifact = useMemo(
    () => DECODING_ARTIFACTS.find((a) => a.id === selectedArtifactId) ?? DECODING_ARTIFACTS[0],
    [selectedArtifactId]
  );

  const activeReading = activeArtifact.readings[readingPosition];

  const platesById = useMemo(() => {
    const map = {} as Record<CulturalVisualPlateId, CulturalVisualReferencePlate>;
    for (const plate of CULTURAL_STUDIES_VISUAL_PLATES) {
      map[plate.id] = plate;
    }
    return map;
  }, []);

  const platesBySection = useMemo(() => {
    const grouped: Record<CulturalStudiesTabId, CulturalVisualReferencePlate[]> = {
      'marco-teorico': [],
      'genealogia-colonial': [],
      tropos: [],
      decodificador: [],
      contranarrativas: [],
    };
    for (const plate of CULTURAL_STUDIES_VISUAL_PLATES) {
      grouped[plate.section].push(plate);
    }
    return grouped;
  }, []);

  const tropesById = useMemo(() => {
    const map: Record<string, (typeof MYSTERIOUS_AFRICA_TROPES)[number]> = {};
    for (const t of MYSTERIOUS_AFRICA_TROPES) {
      map[t.id] = t;
    }
    return map;
  }, []);

  const activeTheoristPlate = platesById[activeTheorist.visualPlateId];
  const activePhasePlate = platesById[activePhase.visualPlateId];
  const activeTropePlate = platesById[activeTrope.visualPlateId];
  const activeArtifactPlate = platesById[activeArtifact.visualPlateId];

  const handleOpenPlateLightbox = (plate: CulturalVisualReferencePlate) => {
    openSingle(toLightboxItem(plate));
  };

  const handleComparePlates = (
    plateA: CulturalVisualReferencePlate,
    plateB: CulturalVisualReferencePlate
  ) => {
    openCompare(
      toLightboxItem(plateA),
      toLightboxItem(plateB),
      undefined,
      'Contraste de fuentes históricas · Visor museográfico'
    );
  };

  const handleJumpToTrope = (tropeId: string) => {
    setSelectedMedium('todos');
    setTropeQuery('');
    setSelectedTropeId(tropeId);
    setActiveTab('tropos');
    window.setTimeout(() => {
      document.getElementById('cs-trope-sheet')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
  };

  const handleJumpToArtifact = (artifactId: string) => {
    setSelectedArtifactId(artifactId);
    setReadingPosition('oposicional');
    setActiveTab('decodificador');
    window.setTimeout(() => {
      document
        .getElementById('cs-artifact-sheet')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
  };

  const handleSelectFromGalleryPlate = (plate: CulturalVisualReferencePlate) => {
    if (plate.linkedTheoristId) {
      setSelectedTheoristId(plate.linkedTheoristId);
      document
        .getElementById('cs-theorist-sheet')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (plate.linkedPhaseId) {
      setSelectedPhaseId(plate.linkedPhaseId);
      document
        .getElementById('cs-genealogy-sheet')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (plate.linkedTropeId) {
      setSelectedMedium('todos');
      setTropeQuery('');
      setSelectedTropeId(plate.linkedTropeId);
      document
        .getElementById('cs-trope-sheet')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (plate.linkedArtifactId) {
      setSelectedArtifactId(plate.linkedArtifactId);
      document
        .getElementById('cs-artifact-sheet')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (plate.linkedDomainId) {
      document
        .getElementById(`cs-domain-${plate.linkedDomainId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const markPlateBroken = (plateId: string) => {
    setBrokenPlates((prev) => (prev[plateId] ? prev : { ...prev, [plateId]: true }));
  };

  const mediumCounts = useMemo(() => {
    const counts: Record<TropeMediumId, number> = {
      todos: MYSTERIOUS_AFRICA_TROPES.length,
      'literatura-prensa': 0,
      'cine-comic': 0,
      'turismo-publicidad': 0,
      'archivo-museos': 0,
    };
    for (const trope of MYSTERIOUS_AFRICA_TROPES) {
      counts[trope.medium] += 1;
    }
    return counts;
  }, []);

  return (
    <section
      aria-labelledby="heading-cultural-studies"
      className="pt-12 border-t-2 border-rule flex flex-col gap-8"
    >
      {/* Editorial Masthead */}
      <div className="flex flex-col gap-4">
        <div className="font-mono text-xs tracking-wide text-ochre">
          05d. Cultural Studies y crítica poscolonial · Imaginarios y estereotipos coloniales de África
        </div>

        <h2
          id="heading-cultural-studies"
          className="font-display text-2xl sm:text-4xl font-semibold tracking-tight leading-[1.12] text-ink max-w-4xl [text-wrap:balance]"
        >
          El «África misteriosa»: genealogía colonial, imaginarios y estereotipos de la representación
        </h2>

        <p className="text-base leading-[1.72] text-ink-muted max-w-[76ch]">
          Desde los <em>Cultural Studies</em> (Stuart Hall) y la crítica africana y poscolonial
          (Mudimbe, Said, Achebe, Fanon, McClintock, Wainaina, Adichie y Mbembe), los estereotipos
          coloniales sobre África no son simples errores aislados, sino un{' '}
          <strong className="text-ink">
            <GlossaryTermTrigger termId="regimen-representacion" tone="ochre">
              régimen de representación
            </GlossaryTermTrigger>
          </strong>{' '}
          forjado durante cinco siglos en la{' '}
          <GlossaryTermTrigger termId="biblioteca-colonial" tone="lapis">
            biblioteca colonial
          </GlossaryTermTrigger>
          : desde los mapas de <em>terra incognita</em> y la{' '}
          <GlossaryTermTrigger termId="mision-civilizadora" tone="ochre">
            misión civilizadora
          </GlossaryTermTrigger>{' '}
          hasta las postales, el{' '}
          <GlossaryTermTrigger termId="racismo-de-mercancia" tone="lapis">
            racismo de mercancía
          </GlossaryTermTrigger>
          , el{' '}
          <GlossaryTermTrigger termId="alocronismo" tone="forest">
            alocronismo
          </GlossaryTermTrigger>{' '}
          y los algoritmos actuales. Cada uno de los cinco apartados integra su propia{' '}
          <strong className="text-ink">galería de fuentes históricas visuales</strong> para
          contrastar el archivo colonial con el contra-archivo africano.
        </p>

        {/* Quiet unboxed archival overview strip */}
        <div className="pt-3 border-t border-hairline flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-ink-muted tabular-nums">
          <span>
            <strong className="text-ink font-semibold">{COLONIAL_GENEALOGY_PHASES.length}</strong>{' '}
            estratos coloniales (1490–2025)
          </span>
          <span aria-hidden="true">·</span>
          <span>
            <strong className="text-ink font-semibold">{COLONIAL_BINARY_PAIRS.length}</strong> pares
            binarios de estereotipación
          </span>
          <span aria-hidden="true">·</span>
          <span>
            <strong className="text-ink font-semibold">{MYSTERIOUS_AFRICA_TROPES.length}</strong>{' '}
            tropos del «África misteriosa»
          </span>
          <span aria-hidden="true">·</span>
          <span>
            <strong className="text-ink font-semibold">{DECODING_ARTIFACTS.length}</strong> piezas
            en el laboratorio Stuart Hall
          </span>
          <span aria-hidden="true">·</span>
          <span>
            <strong className="text-ink font-semibold">
              {CULTURAL_STUDIES_VISUAL_PLATES.length}
            </strong>{' '}
            fuentes históricas en 5 galerías
          </span>
        </div>
      </div>

      {/* Section Tabs */}
      <div
        id="cs-module-tabs"
        role="tablist"
        aria-label="Apartados del módulo de Imaginarios y estereotipos coloniales de África"
        className="flex flex-wrap items-center gap-2 border-b border-hairline pb-3 scroll-mt-24"
      >
        {MODULE_TABS.map((tab) => {
          const selected = activeTab === tab.id;
          const galleryCount = platesBySection[tab.id].length;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-cs-${tab.id}`}
              aria-selected={selected}
              aria-controls={`panel-cs-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-2 ${
                selected
                  ? 'bg-ink text-white border-ink'
                  : 'bg-paper text-ink-muted border-hairline hover:border-ink hover:text-ink'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`font-mono text-[11px] tabular-nums ${
                  selected ? 'text-white/75' : 'text-ochre'
                }`}
              >
                ({galleryCount} fuentes)
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB I: THEORETICAL FRAMEWORK + HISTORICAL SOURCE GALLERY I */}
      {activeTab === 'marco-teorico' && (
        <div
          id="panel-cs-marco-teorico"
          role="tabpanel"
          aria-labelledby="tab-cs-marco-teorico"
          className="flex flex-col gap-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div
              className="lg:col-span-5 flex flex-col border-t border-rule"
              role="listbox"
              aria-label="Autores y conceptos clave de Cultural Studies"
            >
              {CULTURAL_STUDIES_THEORISTS.map((item) => {
                const isSelected = item.id === activeTheorist.id;
                const linkedPlate = platesById[item.visualPlateId];
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => setSelectedTheoristId(item.id)}
                    className={`text-left px-4 py-3.5 border-b border-hairline transition-colors cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-paper text-ink'
                        : 'bg-canvas text-ink-muted hover:bg-paper/70 hover:text-ink'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-display text-base font-semibold text-ink">
                        {item.author}
                      </span>
                      {linkedPlate && (
                        <span className="font-mono text-[10px] text-ink-muted shrink-0 tabular-nums">
                          {linkedPlate.sourceCode}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-ochre leading-snug">
                      {item.keyConcept}
                    </span>
                    <span className="text-xs text-ink-muted">{item.yearsAndOrigin}</span>
                  </button>
                );
              })}
            </div>

            <article
              id="cs-theorist-sheet"
              aria-live="polite"
              className="lg:col-span-7 bg-paper border border-hairline border-t-2 border-t-ochre p-6 sm:p-7 flex flex-col gap-5 scroll-mt-24"
            >
              <div className="flex flex-col gap-1.5 pb-4 border-b border-hairline">
                <span className="font-mono text-xs text-ochre">{activeTheorist.yearsAndOrigin}</span>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink m-0">
                  {activeTheorist.author}
                </h3>
                <p className="text-sm font-medium text-lapis m-0">{activeTheorist.keyConcept}</p>
              </div>

              {activeTheoristPlate && (
                <InlineSourceFigure
                  plate={activeTheoristPlate}
                  compareTarget={platesById[activeTheoristPlate.compareWithId]}
                  isBroken={Boolean(brokenPlates[activeTheoristPlate.id])}
                  onMarkBroken={markPlateBroken}
                  onOpenSingle={handleOpenPlateLightbox}
                  onOpenCompare={handleComparePlates}
                  labelPrefix="Fuente de referencia"
                />
              )}

              <div className="flex flex-col gap-4 text-sm sm:text-base leading-[1.72] text-ink">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[11px] text-ink-muted">
                    Tesis central en Cultural Studies
                  </span>
                  <p className="m-0">{activeTheorist.thesis}</p>
                </div>

                <div className="pt-4 border-t border-hairline flex flex-col gap-1">
                  <span className="font-mono text-[11px] text-ochre font-medium">
                    Cómo explica el mito del «África misteriosa»
                  </span>
                  <p className="m-0">{activeTheorist.mysteryAfricaCritique}</p>
                </div>
              </div>

              <div className="bg-canvas border border-hairline p-4 flex flex-col gap-1.5">
                <span className="font-mono text-[11px] font-semibold text-lapis">
                  Pregunta crítica para el análisis cultural
                </span>
                <p className="font-display italic text-base text-ink m-0">
                  «{activeTheorist.analyticalQuestion}»
                </p>
              </div>

              <div className="pt-3 border-t border-hairline font-mono text-xs text-ink-muted">
                <strong className="text-ink">Obra de referencia:</strong>{' '}
                {activeTheorist.landmarkWork}
              </div>
            </article>
          </div>

          <HistoricalSourceGallery
            section="marco-teorico"
            plates={platesBySection['marco-teorico']}
            platesById={platesById}
            brokenPlates={brokenPlates}
            onMarkBroken={markPlateBroken}
            onOpenSingle={handleOpenPlateLightbox}
            onOpenCompare={handleComparePlates}
            onSelectFromPlate={handleSelectFromGalleryPlate}
            activeLinkedId={activeTheorist.id}
          />
        </div>
      )}

      {/* TAB II: COLONIAL GENEALOGY & BINARY STEREOTYPE ARCHITECTURE + GALLERY II */}
      {activeTab === 'genealogia-colonial' && (
        <div
          id="panel-cs-genealogia-colonial"
          role="tabpanel"
          aria-labelledby="tab-cs-genealogia-colonial"
          className="flex flex-col gap-10"
        >
          {/* Part A: 6-Epoch Chronological Strata of the Colonial Imaginary */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 font-mono text-xs text-ochre">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Arqueología del estereotipo · Seis estratos históricos (1490–2025)</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink m-0">
                Cómo se fabricó el imaginario del «África misteriosa» paso a paso
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-ink-muted max-w-[78ch] m-0">
                Los estereotipos coloniales no nacieron de golpe ni son «prejuicios eternos»:
                respondieron en cada época a intereses económicos y aparatos mediáticos concretos
                (trata atlántica, sociedades geográficas, reparto de Berlín, publicidad de masas,
                televisión poscolonial e IA). Seleccione un estrato para examinar sus dispositivos y
                su refutación documental.
              </p>
            </div>

            {/* 6-Epoch Chronological Strip */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2"
              role="tablist"
              aria-label="Estratos cronológicos de los estereotipos coloniales sobre África"
            >
              {COLONIAL_GENEALOGY_PHASES.map((phase) => {
                const isSelected = phase.id === activePhase.id;
                return (
                  <button
                    key={phase.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedPhaseId(phase.id)}
                    className={`text-left px-3.5 py-3 border transition-colors cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-ink text-white border-ink'
                        : 'bg-paper text-ink border-hairline hover:border-ink'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2 font-mono text-[11px] tabular-nums">
                      <span className={isSelected ? 'text-white/75' : 'text-ochre font-semibold'}>
                        {phase.num}
                      </span>
                      <span className={isSelected ? 'text-white/90' : 'text-ink-muted'}>
                        {phase.period}
                      </span>
                    </div>
                    <span className="font-display text-xs font-semibold leading-snug line-clamp-2">
                      {phase.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Epoch Archival Dossier Sheet */}
            <article
              id="cs-genealogy-sheet"
              aria-live="polite"
              className="bg-paper border border-hairline border-t-2 border-t-ochre p-6 sm:p-7 flex flex-col gap-6 scroll-mt-24"
            >
              <div className="flex flex-col gap-2 pb-4 border-b border-hairline">
                <div className="font-mono text-xs text-ochre flex flex-wrap items-center gap-x-2 tabular-nums">
                  <span>Estrato {activePhase.num}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-ink">{activePhase.period}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-lapis">{activePhase.apparatus}</span>
                </div>
                <h4 className="font-display text-2xl sm:text-3xl font-semibold text-ink leading-tight m-0">
                  {activePhase.title}
                </h4>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 flex flex-col gap-5">
                  <p className="text-sm sm:text-base leading-[1.74] text-ink m-0">
                    {activePhase.summary}
                  </p>

                  {/* Historical Archival Pull Quote */}
                  <blockquote className="m-0 py-4 border-y border-hairline flex flex-col gap-1.5">
                    <p className="font-display italic text-base sm:text-lg leading-relaxed text-ink m-0">
                      {activePhase.archiveQuote}
                    </p>
                    <footer className="font-mono text-[11px] text-ink-muted">
                      Archivo documental · {activePhase.archiveSource}
                    </footer>
                  </blockquote>

                  {/* Material Interests vs Historical Refutation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-canvas border border-hairline p-4 flex flex-col gap-1.5">
                      <span className="font-mono text-[11px] font-semibold text-ochre">
                        Interés material y función colonial
                      </span>
                      <p className="text-xs sm:text-sm leading-relaxed text-ink m-0">
                        {activePhase.materialInterests}
                      </p>
                    </div>
                    <div className="bg-canvas border border-hairline p-4 flex flex-col gap-1.5">
                      <span className="font-mono text-[11px] font-semibold text-forest">
                        Desmentido histórico y contra-archivo
                      </span>
                      <p className="text-xs sm:text-sm leading-relaxed text-ink m-0">
                        {activePhase.historicalRefutation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Source Plate + Stereotypes Forged + Cross-links */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {activePhasePlate && (
                    <figure className="m-0 bg-canvas border border-hairline overflow-hidden">
                      <div className="px-3.5 py-2 border-b border-hairline font-mono text-[11px] flex items-center justify-between gap-2 tabular-nums">
                        <span className="font-semibold text-ink">
                          {activePhasePlate.sourceCode}
                        </span>
                        <span className="text-ochre">{activePhasePlate.datePeriod}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenPlateLightbox(activePhasePlate)}
                        aria-label={`Ampliar ${activePhasePlate.sourceCode}: ${activePhasePlate.title}`}
                        className="relative w-full aspect-[4/3] bg-paper overflow-hidden border-b border-hairline cursor-pointer group block"
                      >
                        {!brokenPlates[activePhasePlate.id] ? (
                          <img
                            src={activePhasePlate.src}
                            alt={activePhasePlate.alt}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={() => markPlateBroken(activePhasePlate.id)}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 p-4 text-ink-muted">
                            <ImageIcon className="w-5 h-5 text-ochre" aria-hidden="true" />
                            <span className="font-mono text-[11px]">
                              {activePhasePlate.sourceCode}
                            </span>
                          </div>
                        )}
                        <span
                          aria-hidden="true"
                          className="absolute bottom-2 right-2 bg-ink/85 text-white px-2 py-0.5 text-[11px] font-mono inline-flex items-center gap-1"
                        >
                          <ZoomIn className="w-3 h-3" />
                          Ampliar
                        </span>
                      </button>
                      <figcaption className="p-3.5 flex flex-col gap-2 text-xs leading-relaxed text-ink-muted">
                        <span className="font-display text-sm font-semibold text-ink leading-snug">
                          {activePhasePlate.title}
                        </span>
                        <span>{activePhasePlate.analyticalFocus}</span>
                        {platesById[activePhasePlate.compareWithId] && (
                          <button
                            type="button"
                            onClick={() =>
                              handleComparePlates(
                                activePhasePlate,
                                platesById[activePhasePlate.compareWithId]
                              )
                            }
                            className="self-start pt-1 font-mono text-[11px] text-forest hover:text-ink inline-flex items-center gap-1 cursor-pointer"
                          >
                            <ArrowLeftRight className="w-3 h-3" aria-hidden="true" />
                            <span>
                              Contrastar con {platesById[activePhasePlate.compareWithId].sourceCode}
                            </span>
                          </button>
                        )}
                      </figcaption>
                    </figure>
                  )}

                  <div className="bg-canvas border border-hairline p-4 flex flex-col gap-2">
                    <span className="font-mono text-[11px] font-semibold text-ink">
                      Estereotipos cristalizados en este estrato
                    </span>
                    <ul className="m-0 pl-4 flex flex-col gap-1.5 text-xs leading-relaxed text-ink">
                      {activePhase.stereotypesForged.map((st) => (
                        <li key={st}>{st}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Interactive Links to Tropes & Contextual Glossary */}
                  <div className="pt-2 border-t border-hairline flex flex-col gap-2.5">
                    {activePhase.glossaryTermId && activePhase.glossaryTermLabel && (
                      <div className="text-xs text-ink-muted flex flex-wrap items-center gap-x-2">
                        <span className="font-mono text-[11px]">Concepto clave:</span>
                        <GlossaryTermTrigger termId={activePhase.glossaryTermId} tone="lapis">
                          {activePhase.glossaryTermLabel}
                        </GlossaryTermTrigger>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      {activePhase.linkedTropeIds.map((tid) => {
                        const t = tropesById[tid];
                        if (!t) return null;
                        return (
                          <button
                            key={tid}
                            type="button"
                            onClick={() => handleJumpToTrope(tid)}
                            className="min-h-[34px] px-3 py-1 bg-canvas border border-hairline hover:border-ochre text-[11px] font-mono text-ink hover:text-ochre transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>
                              Tropo {t.num} · {t.title.split(' ').slice(0, 4).join(' ')}…
                            </span>
                            <ArrowUpRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Part B: Interactive Matrix of Colonial Binarisms ("Nosotros vs. El Otro") */}
          <div className="pt-8 border-t border-rule flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-mono text-xs text-lapis">
                <Scale className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  Gramática del estereotipo colonial ·{' '}
                  <GlossaryTermTrigger termId="alegoria-maniquea" tone="lapis">
                    Alegoría maniquea y binarismo
                  </GlossaryTermTrigger>{' '}
                  (JanMohamed / Hall / Fabian)
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink m-0">
                Matriz de dicotomías coloniales: «Nosotros» frente al «África misteriosa»
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-ink-muted max-w-[78ch] m-0">
                El discurso colonial rara vez inventa una imagen aislada: organiza el mundo en{' '}
                <strong className="text-ink">pares binarios asimétricos</strong> donde el primer
                término define a Europa (sujeto histórico) y el segundo encierra a África en la
                alteridad. Filtre por eje para inspeccionar cómo opera cada dicotomía y cómo
                reformularla con rigor académico.
              </p>
            </div>

            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label="Filtrar pares binarios coloniales por eje analítico"
            >
              {BINARY_AXIS_FILTERS.map((ax) => {
                const isActive = selectedBinaryAxis === ax.id;
                const count =
                  ax.id === 'todos'
                    ? COLONIAL_BINARY_PAIRS.length
                    : COLONIAL_BINARY_PAIRS.filter((p) => p.axis === ax.id).length;
                return (
                  <button
                    key={ax.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setSelectedBinaryAxis(ax.id)}
                    className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                      isActive
                        ? 'bg-lapis text-white border-lapis'
                        : 'bg-paper text-ink-muted border-hairline hover:border-ink hover:text-ink'
                    }`}
                  >
                    {ax.label} ({count})
                  </button>
                );
              })}
            </div>

            <div className="border-t border-rule overflow-x-auto">
              <table className="w-full border-collapse text-left min-w-[760px]">
                <thead>
                  <tr className="border-b border-rule bg-paper font-mono text-[11px] text-ink-muted">
                    <th className="py-3 px-4 font-semibold text-ink w-[19%]">
                      Polo «Europa / Nosotros»
                    </th>
                    <th className="py-3 px-4 font-semibold text-ochre w-[21%]">
                      Polo «África estereotipada»
                    </th>
                    <th className="py-3 px-4 font-semibold text-ink w-[30%]">
                      Función colonial y ejemplo mediático
                    </th>
                    <th className="py-3 px-4 font-semibold text-forest w-[30%]">
                      Relectura crítica (Diploma)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline text-xs leading-relaxed">
                  {filteredBinaryPairs.map((pair) => (
                    <tr key={pair.id} className="align-top bg-canvas hover:bg-paper/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-[10px] text-ink-muted mb-1">
                          {pair.axisLabel}
                        </div>
                        <div className="font-display text-sm font-semibold text-ink">
                          {pair.europePole}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-display text-sm font-semibold text-ochre">
                          {pair.africaStereotypePole}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-ink">
                        <p className="m-0 mb-1.5">{pair.colonialFunction}</p>
                        <p className="m-0 text-ink-muted italic">Ej.: {pair.exampleInMedia}</p>
                      </td>
                      <td className="py-3.5 px-4 text-ink">
                        <p className="m-0">{pair.criticalReframing}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Part C: Historical Source Gallery II (4 new archival plates) */}
          <HistoricalSourceGallery
            section="genealogia-colonial"
            plates={platesBySection['genealogia-colonial']}
            platesById={platesById}
            brokenPlates={brokenPlates}
            onMarkBroken={markPlateBroken}
            onOpenSingle={handleOpenPlateLightbox}
            onOpenCompare={handleComparePlates}
            onSelectFromPlate={handleSelectFromGalleryPlate}
            activeLinkedId={activePhase.id}
          />
        </div>
      )}

      {/* TAB III: ANATOMY OF 12 "MYSTERIOUS AFRICA" TROPES + HISTORICAL SOURCE GALLERY III */}
      {activeTab === 'tropos' && (
        <div
          id="panel-cs-tropos"
          role="tabpanel"
          aria-labelledby="tab-cs-tropos"
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-6">
            {/* Medium Filter & Keyword Search Bar */}
            <div className="bg-paper border border-hairline p-4 sm:p-5 flex flex-col gap-3.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div
                  className="flex flex-wrap items-center gap-1.5"
                  role="group"
                  aria-label="Filtrar tropos por soporte cultural"
                >
                  {TROPE_MEDIUM_FILTERS.map((flt) => {
                    const isActive = selectedMedium === flt.id;
                    return (
                      <button
                        key={flt.id}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setSelectedMedium(flt.id)}
                        className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                          isActive
                            ? 'bg-ochre text-white border-ochre'
                            : 'bg-canvas text-ink-muted border-hairline hover:border-ink hover:text-ink'
                        }`}
                      >
                        {flt.label} ({mediumCounts[flt.id]})
                      </button>
                    );
                  })}
                </div>
                <span className="font-mono text-xs text-ink-muted tabular-nums">
                  {filteredTropes.length} de {MYSTERIOUS_AFRICA_TROPES.length} tropos visibles
                </span>
              </div>

              <div className="relative max-w-md">
                <Search
                  className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={tropeQuery}
                  onChange={(e) => setTropeQuery(e.target.value)}
                  placeholder="Buscar por cliché, autor o caso (Conrad, Kipling, Banania, Benín, safari...)"
                  aria-label="Buscar dentro de los 12 tropos del África misteriosa"
                  className="w-full min-h-[40px] pl-9 pr-9 py-2 text-xs bg-canvas border border-hairline text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre"
                />
                {tropeQuery && (
                  <button
                    type="button"
                    onClick={() => setTropeQuery('')}
                    aria-label="Limpiar búsqueda de tropos"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink cursor-pointer p-1"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {filteredTropes.length === 0 ? (
              <div className="bg-paper border border-hairline p-8 text-center flex flex-col items-center gap-3">
                <p className="text-sm text-ink m-0">
                  No se encontraron tropos que coincidan con «{tropeQuery}».
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTropeQuery('');
                    setSelectedMedium('todos');
                  }}
                  className="min-h-[38px] px-4 py-1.5 text-xs font-mono bg-ink text-white cursor-pointer"
                >
                  Restablecer los 12 tropos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Trope Selector List */}
                <div
                  className="lg:col-span-5 flex flex-col border-t border-rule"
                  role="listbox"
                  aria-label="Catálogo de 12 tropos del África misteriosa"
                >
                  {filteredTropes.map((trope) => {
                    const isActive = trope.id === activeTrope.id;
                    const linkedPlate = platesById[trope.visualPlateId];
                    return (
                      <button
                        key={trope.id}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => setSelectedTropeId(trope.id)}
                        className={`text-left px-4 py-3.5 border-b border-hairline transition-colors cursor-pointer flex flex-col gap-1 ${
                          isActive
                            ? 'bg-paper text-ink'
                            : 'bg-canvas text-ink-muted hover:bg-paper/70 hover:text-ink'
                        }`}
                      >
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-xs font-semibold text-ochre tabular-nums">
                            {trope.num}.
                          </span>
                          <span className="font-display text-base font-semibold text-ink leading-snug">
                            {trope.title}
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-lapis pl-6 flex flex-wrap items-center gap-x-2">
                          <span>{trope.mediumLabel}</span>
                          {linkedPlate && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-ink-muted tabular-nums">
                                {linkedPlate.sourceCode}
                              </span>
                            </>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Trope Deconstruction Sheet */}
                <article
                  id="cs-trope-sheet"
                  aria-live="polite"
                  className="lg:col-span-7 bg-paper border border-hairline border-t-2 border-t-rule p-6 sm:p-7 flex flex-col gap-5 scroll-mt-24"
                >
                  <div className="flex flex-col gap-2 pb-4 border-b border-hairline">
                    <div className="font-mono text-xs text-ochre flex flex-wrap items-center gap-x-2 tabular-nums">
                      <span>Tropo {activeTrope.num} / 12</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeTrope.mediumLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-ink-muted">{activeTrope.persistenceArc}</span>
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink leading-tight m-0">
                      {activeTrope.title}
                    </h3>
                    <p className="font-display italic text-sm text-ink-muted m-0">
                      Fórmula cliché habitual: {activeTrope.clicheSignature}
                    </p>
                  </div>

                  {activeTropePlate && (
                    <InlineSourceFigure
                      plate={activeTropePlate}
                      compareTarget={platesById[activeTropePlate.compareWithId]}
                      isBroken={Boolean(brokenPlates[activeTropePlate.id])}
                      onMarkBroken={markPlateBroken}
                      onOpenSingle={handleOpenPlateLightbox}
                      onOpenCompare={handleComparePlates}
                    />
                  )}

                  <dl className="flex flex-col gap-4 text-sm leading-[1.7] text-ink m-0">
                    <div className="flex flex-col gap-1">
                      <dt className="font-mono text-[11px] text-ink-muted">
                        Genealogía histórica del imaginario
                      </dt>
                      <dd className="m-0">{activeTrope.historicalOrigin}</dd>
                    </div>

                    <div className="pt-3 border-t border-hairline flex flex-col gap-1">
                      <dt className="font-mono text-[11px] text-ink-muted">
                        Cómo opera el mecanismo cultural
                      </dt>
                      <dd className="m-0">{activeTrope.culturalMechanism}</dd>
                    </div>

                    <div className="pt-3 border-t border-hairline flex flex-col gap-1">
                      <dt className="font-mono text-[11px] text-ink-muted">
                        Ejemplos en la cultura popular, colonial y mediática
                      </dt>
                      <dd className="m-0">{activeTrope.examples}</dd>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-hairline">
                      <div className="bg-canvas border border-hairline p-4 flex flex-col gap-1">
                        <dt className="font-mono text-[11px] font-semibold text-ochre">
                          Qué invisibiliza o borra
                        </dt>
                        <dd className="text-xs sm:text-sm leading-relaxed text-ink m-0">
                          {activeTrope.whatItErases}
                        </dd>
                      </div>
                      <div className="bg-canvas border border-hairline p-4 flex flex-col gap-1">
                        <dt className="font-mono text-[11px] font-semibold text-forest">
                          Contra-archivo y evidencia crítica
                        </dt>
                        <dd className="text-xs sm:text-sm leading-relaxed text-ink m-0">
                          {activeTrope.counterEvidence}
                        </dd>
                      </div>
                    </div>
                  </dl>

                  <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono text-[11px] text-ink-muted">
                      Claves conceptuales: {activeTrope.tags.join(' · ')}
                    </span>
                    {activeTrope.linkedArtifactId && (
                      <button
                        type="button"
                        onClick={() => handleJumpToArtifact(activeTrope.linkedArtifactId!)}
                        className="min-h-[36px] px-3 py-1.5 bg-canvas border border-hairline hover:border-lapis text-xs font-mono font-medium text-lapis hover:text-ink transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Practicar decodificación (Stuart Hall)</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </article>
              </div>
            )}
          </div>

          <HistoricalSourceGallery
            section="tropos"
            plates={platesBySection.tropos}
            platesById={platesById}
            brokenPlates={brokenPlates}
            onMarkBroken={markPlateBroken}
            onOpenSingle={handleOpenPlateLightbox}
            onOpenCompare={handleComparePlates}
            onSelectFromPlate={handleSelectFromGalleryPlate}
            activeLinkedId={activeTrope.id}
          />
        </div>
      )}

      {/* TAB IV: STUART HALL DECODING LAB + HISTORICAL SOURCE GALLERY IV */}
      {activeTab === 'decodificador' && (
        <div
          id="panel-cs-decodificador"
          role="tabpanel"
          aria-labelledby="tab-cs-decodificador"
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-6">
            <div className="bg-paper border border-hairline p-5 sm:p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 font-mono text-xs text-lapis">
                  <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    Modelo de{' '}
                    <GlossaryTermTrigger termId="codificacion-decodificacion" tone="lapis">
                      Codificación / Decodificación
                    </GlossaryTermTrigger>{' '}
                    · Stuart Hall (1973)
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink m-0">
                  Analizador de piezas culturales sobre el «África misteriosa»
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted max-w-[74ch] m-0">
                  Seleccione uno de los {DECODING_ARTIFACTS.length} soportes mediáticos (novela
                  imperial, prensa, publicidad comercial, cómic colonial, folleto turístico,
                  campaña humanitaria y cine comercial) y alterne entre las tres posiciones de
                  lectura propuestas por Stuart Hall para observar cómo el mismo mensaje se
                  reproduce, matiza o desactiva críticamente.
                </p>
              </div>

              <div
                className="flex flex-wrap items-center gap-2"
                role="group"
                aria-label="Seleccionar pieza cultural para analizar"
              >
                {DECODING_ARTIFACTS.map((art) => {
                  const isSelected = art.id === activeArtifact.id;
                  return (
                    <button
                      key={art.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedArtifactId(art.id)}
                      className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-ink text-white border-ink'
                          : 'bg-canvas text-ink border-hairline hover:border-ink'
                      }`}
                    >
                      {art.formatLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div
                id="cs-artifact-sheet"
                className="lg:col-span-5 bg-paper border border-hairline p-6 flex flex-col gap-5 scroll-mt-24"
              >
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[11px] text-ochre">
                    Objeto cultural · {activeArtifact.formatLabel}
                  </span>
                  <h4 className="font-display text-xl font-semibold text-ink m-0">
                    {activeArtifact.title}
                  </h4>
                </div>

                <blockquote className="m-0 py-4 border-y border-hairline font-display italic text-base leading-relaxed text-ink">
                  {activeArtifact.sampleText}
                </blockquote>

                {activeArtifactPlate && (
                  <figure className="m-0 bg-canvas border border-hairline overflow-hidden">
                    <div className="px-3 py-1.5 border-b border-hairline font-mono text-[10px] flex items-center justify-between gap-2 tabular-nums">
                      <span className="font-semibold text-ink">
                        Matriz histórica · {activeArtifactPlate.sourceCode}
                      </span>
                      <span className="text-ochre">{activeArtifactPlate.datePeriod}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenPlateLightbox(activeArtifactPlate)}
                      aria-label={`Ampliar ${activeArtifactPlate.sourceCode}: ${activeArtifactPlate.title}`}
                      className="relative w-full aspect-[16/10] bg-paper overflow-hidden border-b border-hairline cursor-pointer group block"
                    >
                      {!brokenPlates[activeArtifactPlate.id] ? (
                        <img
                          src={activeArtifactPlate.src}
                          alt={activeArtifactPlate.alt}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={() => markPlateBroken(activeArtifactPlate.id)}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 p-4 text-ink-muted">
                          <ImageIcon className="w-5 h-5 text-ochre" aria-hidden="true" />
                          <span className="font-mono text-[11px]">
                            {activeArtifactPlate.sourceCode}
                          </span>
                        </div>
                      )}
                      <span
                        aria-hidden="true"
                        className="absolute bottom-2 right-2 bg-ink/85 text-white px-2 py-0.5 text-[11px] font-mono inline-flex items-center gap-1"
                      >
                        <ZoomIn className="w-3 h-3" />
                        Ampliar
                      </span>
                    </button>
                    <figcaption className="px-3.5 py-2.5 flex flex-col gap-1.5 text-[11px] leading-relaxed text-ink-muted">
                      <span>
                        <strong className="text-ink font-medium">
                          {activeArtifactPlate.figureNum}.
                        </strong>{' '}
                        {activeArtifactPlate.title}
                      </span>
                      {platesById[activeArtifactPlate.compareWithId] && (
                        <button
                          type="button"
                          onClick={() =>
                            handleComparePlates(
                              activeArtifactPlate,
                              platesById[activeArtifactPlate.compareWithId]
                            )
                          }
                          className="self-start font-mono text-[11px] text-forest hover:text-ink inline-flex items-center gap-1 cursor-pointer"
                        >
                          <ArrowLeftRight className="w-3 h-3" aria-hidden="true" />
                          <span>
                            Contrastar con {platesById[activeArtifactPlate.compareWithId].sourceCode}
                          </span>
                        </button>
                      )}
                    </figcaption>
                  </figure>
                )}

                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[11px] font-semibold text-ink-muted">
                    Marcas retóricas detectadas (Wainaina / McClintock / Adichie)
                  </span>
                  <ul className="m-0 p-0 list-none flex flex-col gap-3">
                    {activeArtifact.rhetoricalMarkers.map((marker) => (
                      <li
                        key={marker.phrase}
                        className="bg-canvas border border-hairline p-3 flex flex-col gap-1"
                      >
                        <span className="font-mono text-xs font-semibold text-ochre">
                          «{marker.phrase}»
                        </span>
                        <span className="text-xs leading-relaxed text-ink">{marker.diagnosis}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-7 bg-paper border border-hairline border-t-2 border-t-lapis p-6 flex flex-col gap-5">
                <div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                  role="tablist"
                  aria-label="Posiciones de lectura según Stuart Hall"
                >
                  {HALL_POSITIONS.map((pos) => {
                    const selected = readingPosition === pos.id;
                    return (
                      <button
                        key={pos.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setReadingPosition(pos.id)}
                        className={`text-left min-h-[54px] px-3.5 py-2.5 rounded border transition-colors cursor-pointer flex flex-col gap-0.5 ${
                          selected
                            ? 'bg-lapis text-white border-lapis'
                            : 'bg-canvas text-ink border-hairline hover:border-ink'
                        }`}
                      >
                        <span className="text-xs font-semibold whitespace-nowrap">{pos.label}</span>
                        <span
                          className={`text-[11px] ${selected ? 'text-white/85' : 'text-ink-muted'}`}
                        >
                          {pos.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div aria-live="polite" className="flex flex-col gap-4 pt-2">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-xs text-lapis">{activeReading.heading}</span>
                    <p className="text-sm sm:text-base leading-[1.72] text-ink m-0">
                      {activeReading.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-hairline flex flex-col gap-1">
                    <span className="font-mono text-[11px] text-ink-muted">
                      Mecanismo discursivo en juego
                    </span>
                    <p className="text-sm leading-relaxed text-ink m-0">{activeReading.mechanism}</p>
                  </div>

                  <div className="bg-canvas border border-hairline p-4 flex flex-col gap-1">
                    <span className="font-mono text-[11px] font-semibold text-forest">
                      Clave didáctica para seminario
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed text-ink m-0">
                      {activeReading.classroomTakeaway}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <HistoricalSourceGallery
            section="decodificador"
            plates={platesBySection.decodificador}
            platesById={platesById}
            brokenPlates={brokenPlates}
            onMarkBroken={markPlateBroken}
            onOpenSingle={handleOpenPlateLightbox}
            onOpenCompare={handleComparePlates}
            onSelectFromPlate={handleSelectFromGalleryPlate}
            activeLinkedId={activeArtifact.id}
          />
        </div>
      )}

      {/* TAB V: AFRICAN COUNTER-NARRATIVES + HISTORICAL SOURCE GALLERY V */}
      {activeTab === 'contranarrativas' && (
        <div
          id="panel-cs-contranarrativas"
          role="tabpanel"
          aria-labelledby="tab-cs-contranarrativas"
          className="flex flex-col gap-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {COUNTER_NARRATIVE_DOMAINS.map((item) => {
              const domainPlate = platesById[item.visualPlateId];
              const compareTarget = domainPlate ? platesById[domainPlate.compareWithId] : undefined;
              return (
                <article
                  key={item.id}
                  id={`cs-domain-${item.id}`}
                  className="bg-paper border border-hairline p-6 flex flex-col justify-between gap-4 scroll-mt-24"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs font-semibold text-ochre tabular-nums">
                        {item.num}.
                      </span>
                      <h3 className="font-display text-xl font-semibold text-ink m-0 leading-snug">
                        {item.domain}
                      </h3>
                    </div>
                    <p className="font-mono text-[11px] text-lapis m-0">{item.subtitle}</p>

                    {domainPlate && (
                      <div className="bg-canvas border border-hairline flex items-center gap-3 p-2.5">
                        <button
                          type="button"
                          onClick={() => handleOpenPlateLightbox(domainPlate)}
                          aria-label={`Ampliar ${domainPlate.sourceCode}: ${domainPlate.title}`}
                          className="w-24 h-[68px] shrink-0 overflow-hidden bg-paper border border-hairline cursor-pointer group relative"
                        >
                          {!brokenPlates[domainPlate.id] ? (
                            <img
                              src={domainPlate.src}
                              alt={domainPlate.alt}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onError={() => markPlateBroken(domainPlate.id)}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-ink-muted">
                              <ImageIcon className="w-4 h-4 text-ochre" aria-hidden="true" />
                            </div>
                          )}
                        </button>
                        <div className="min-w-0 flex flex-col gap-1">
                          <span className="font-mono text-[10px] text-forest tabular-nums">
                            {domainPlate.sourceCode} · {domainPlate.datePeriod}
                          </span>
                          <span className="text-xs font-medium text-ink leading-snug line-clamp-2">
                            {domainPlate.title}
                          </span>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[10px]">
                            <button
                              type="button"
                              onClick={() => handleOpenPlateLightbox(domainPlate)}
                              className="text-ink hover:text-ochre inline-flex items-center gap-1 cursor-pointer"
                            >
                              <ZoomIn className="w-3 h-3" aria-hidden="true" />
                              <span>Ampliar</span>
                            </button>
                            {compareTarget && (
                              <button
                                type="button"
                                onClick={() => handleComparePlates(domainPlate, compareTarget)}
                                className="text-forest hover:text-ink inline-flex items-center gap-1 cursor-pointer"
                              >
                                <ArrowLeftRight className="w-3 h-3" aria-hidden="true" />
                                <span>Contrastar</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="text-xs sm:text-sm leading-relaxed text-ink m-0">
                      {item.howItSubverts}
                    </p>

                    <div className="pt-3 border-t border-hairline flex flex-col gap-1">
                      <span className="font-mono text-[11px] text-ink-muted">
                        Creadores y voces de referencia
                      </span>
                      <p className="text-xs leading-relaxed text-ink m-0">{item.keyCreators}</p>
                    </div>

                    <div className="bg-canvas border border-hairline p-3.5 flex flex-col gap-1.5">
                      <span className="font-mono text-[11px] font-semibold text-ink">
                        Obras clave para desmontar el estereotipo
                      </span>
                      <ul className="m-0 pl-4 flex flex-col gap-1 text-xs leading-relaxed text-ink">
                        {item.landmarkWorks.map((work) => (
                          <li key={work}>{work}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-hairline font-mono text-[11px] text-forest flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{item.linkToModule}</span>
                  </div>
                </article>
              );
            })}
          </div>

          <HistoricalSourceGallery
            section="contranarrativas"
            plates={platesBySection.contranarrativas}
            platesById={platesById}
            brokenPlates={brokenPlates}
            onMarkBroken={markPlateBroken}
            onOpenSingle={handleOpenPlateLightbox}
            onOpenCompare={handleComparePlates}
            onSelectFromPlate={handleSelectFromGalleryPlate}
          />

          <div className="bg-paper border border-hairline border-t-2 border-t-rule p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 font-mono text-xs text-ochre">
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                Bibliografía fundamental · Cultural Studies, imaginarios coloniales y África (APA
                7.ª)
              </span>
            </div>
            <ul className="m-0 pl-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs leading-relaxed text-ink">
              {CULTURAL_STUDIES_BIBLIOGRAPHY.map((ref) => (
                <li key={ref} className="pl-1">
                  {ref}
                </li>
              ))}
            </ul>
            <div className="pt-3 border-t border-hairline flex items-center gap-2 font-mono text-[11px] text-ink-muted">
              <Sparkles className="w-3.5 h-3.5 text-lapis shrink-0" aria-hidden="true" />
              <span>
                Síntesis del Bloque III: historia precolonial (02–04) + crítica documental (05) +
                iconografía caníbal (05b) + archivo audiovisual (05c) + Cultural Studies y
                estereotipos coloniales (05d).
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CulturalStudiesAfricaModule;
