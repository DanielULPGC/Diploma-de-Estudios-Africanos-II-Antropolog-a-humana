import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  FlaskConical,
  Leaf,
  Link2,
  RotateCcw,
  Save,
  XCircle,
} from 'lucide-react';
import vernoniaImg from '../../assets/images/vernonia_amygdalina_specimen_1795350040204.jpg';
import aspiliaImg from '../../assets/images/aspilia_mossambicensis_specimen_1795350040226.jpg';
import balanitesImg from '../../assets/images/balanites_aegyptiaca_specimen_1795350038649.jpg';
import ficusImg from '../../assets/images/ficus_exasperata_specimen_1795350040825.jpg';
import { GlossaryTermTrigger } from '../GlossaryContext';

type PlantSpecimenId = 'vernonia' | 'aspilia' | 'balanites' | 'ficus';
type EthologicalUseId =
  | 'masticacion-medula'
  | 'deglucion-hispida'
  | 'profilaxis-saponinas'
  | 'lija-antimicrobiana';

interface PlantSpecimenCard {
  id: PlantSpecimenId;
  scientificName: string;
  commonName: string;
  africanEnclave: string;
  biome: string;
  primate: string;
  imageSrc: string;
  imageAlt: string;
  visualHint: string;
  correctUseId: EthologicalUseId;
  verifiedFeedback: string;
  activeMechanism: string;
  targetParasite: string;
  ethnobotanyNote: string;
  citation: string;
}

interface EthologicalUseOption {
  id: EthologicalUseId;
  code: string;
  title: string;
  mechanismTag: string;
  behavioralDescription: string;
  diagnosticCue: string;
}

interface TallerSessionState {
  selectedPlantId: PlantSpecimenId;
  pairings: Record<PlantSpecimenId, EthologicalUseId | ''>;
  checkedIds: PlantSpecimenId[];
  attemptsCount: number;
  revealedHints: PlantSpecimenId[];
  lastSavedAt: string | null;
}

const SESSION_STORAGE_KEY = 'ulpgc:etologia:taller-automedicacion:v1';

const PLANT_SPECIMENS: PlantSpecimenCard[] = [
  {
    id: 'vernonia',
    scientificName: 'Vernonia amygdalina',
    commonName: 'Hoja amarga africana',
    africanEnclave: 'Montes Mahale · Tanzania',
    biome: 'Sabana arbolada de miombo',
    primate: 'Pan troglodytes schweinfurthii',
    imageSrc: vernoniaImg,
    imageAlt:
      'Ejemplar de Vernonia amygdalina en sabana arbolada africana mostrando hojas aserradas y un tallo joven con la corteza pelada y la médula interna blanquecina expuesta.',
    visualHint:
      'Observa el tallo joven pelado en el centro de la imagen: el primate descarta la corteza exterior y busca la médula interna amarga.',
    correctUseId: 'masticacion-medula',
    verifiedFeedback:
      'Relación exacta: en Mahale, individuos con letargo y alta carga parasitaria pelan brotes de Vernonia amygdalina y mastican la médula interna (escupiendo la fibra) para absorber lactonas sesquiterpénicas que reducen los huevos de nematodos en 24 horas.',
    activeMechanism: 'Acción fitoquímica antiparasitaria (vernodalina, vernolida y glucósidos esteroideos)',
    targetParasite: 'Nematodos nodulares (Oesophagostomum stephanostomum)',
    ethnobotanyNote:
      'Ampliamente utilizada en medicina tradicional de África Oriental («mululuza» / «mtugutu») contra parásitos intestinales y fiebres.',
    citation: 'Huffman & Seifu (1989); Huffman (1997, 2001)',
  },
  {
    id: 'aspilia',
    scientificName: 'Aspilia mossambicensis',
    commonName: 'Aspilia áspera de sabana',
    africanEnclave: 'Gombe y Mahale · Tanzania',
    biome: 'Claros de sabana arbolada',
    primate: 'Pan troglodytes schweinfurthii',
    imageSrc: aspiliaImg,
    imageAlt:
      'Fotografía botánica de Aspilia mossambicensis en un claro de sabana africana mostrando hojas verdes hirsutas cubiertas de pelos finos y flores amarillas.',
    visualHint:
      'Fíjate en la pilosidad fina (tricomas rígidos) que recubre tallos y hojas: actúa como un cepillo físico al tragarse sin masticar.',
    correctUseId: 'deglucion-hispida',
    verifiedFeedback:
      'Relación exacta: los chimpancés de Gombe y Mahale recogen hojas jóvenes de Aspilia mossambicensis al amanecer, las pliegan en acordeón con la lengua y las tragan enteras sin masticar para arrastrar físicamente gusanos intestinales en las heces.',
    activeMechanism: 'Expulsión mecánica física mediante tricomas híspidos y aceleración del tránsito',
    targetParasite: 'Nematodos adultos (Oesophagostomum) y proglótides de cestodos',
    ethnobotanyNote:
      'Empleada en comunidades rurales de África Oriental en infusiones para malestares abdominales y heridas.',
    citation: 'Wrangham & Nishida (1983); Huffman (1997)',
  },
  {
    id: 'balanites',
    scientificName: 'Balanites aegyptiaca',
    commonName: 'Dátil del desierto',
    africanEnclave: 'Parque Nacional de Awash · Etiopía',
    biome: 'Sabana árida de acacias del Rift',
    primate: 'Papio hamadryas / Papio anubis',
    imageSrc: balanitesImg,
    imageAlt:
      'Rama espinosa de Balanites aegyptiaca en sabana árida del Rift etíope con hojas coriáceas pareadas y dos frutos ovalados verdoso-dorados.',
    visualHint:
      'Observa las espinas pronunciadas y las drupas ovaladas dorado-verdosas: crecen en sabanas áridas del Rift y contienen saponinas esteroideas.',
    correctUseId: 'profilaxis-saponinas',
    verifiedFeedback:
      'Relación exacta: Jane Phillips-Conroy documentó que los babuinos situados aguas abajo de las cataratas de Awash —expuestos a esquistosomiasis— consumen selectivamente frutos y hojas de Balanites aegyptiaca ricos en diosgenina, a diferencia de tropas sin riesgo.',
    activeMechanism: 'Profilaxis fitoquímica mediante saponinas esteroideas (diosgenina y balanitin)',
    targetParasite: 'Trematodo sanguíneo Schistosoma mansoni (esquistosomiasis)',
    ethnobotanyNote:
      'Árbol clave de la farmacopea tradicional del Sahel, Sudán y Etiopía frente a parásitos y dolencias hepáticas.',
    citation: 'Phillips-Conroy (1986)',
  },
  {
    id: 'ficus',
    scientificName: 'Ficus exasperata',
    commonName: 'Higuera papel de lija',
    africanEnclave: 'Kibale y Budongo · Uganda',
    biome: 'Mosaico bosque-sabana del Rift Occidental',
    primate: 'Pan troglodytes schweinfurthii',
    imageSrc: ficusImg,
    imageAlt:
      'Detalle macro de hojas de Ficus exasperata en un borde de bosque-sabana de Uganda mostrando nervadura prominente y textura superficial rugosa semejante a papel de lija.',
    visualHint:
      'Observa la textura mate sumamente rugosa y granulada de la lámina foliar: contiene depósitos de sílice con efecto abrasivo tipo lija.',
    correctUseId: 'lija-antimicrobiana',
    verifiedFeedback:
      'Relación exacta: Ficus exasperata posee hojas altamente abrasivas ricas en sílice usadas en deglución entera para barrido intestinal; además, estudios en Budongo (2024) confirman actividad antibacteriana en sus extractos frente a patógenos digestivos.',
    activeMechanism: 'Barrido mecánico por tricomas silicificados + compuestos fenólicos antimicrobianos',
    targetParasite: 'Nematodos gastrointestinales y bacterias patógenas oportunistas',
    ethnobotanyNote:
      'Utilizada tradicionalmente en África Oriental y Occidental tanto como lija vegetal natural como en remedios gástricos.',
    citation: 'Huffman (1997); Freymann et al. (2024), PLOS ONE',
  },
];

// Intentionally non-aligned order so students reason from visual and behavioral cues
const ETHOLOGICAL_USE_OPTIONS: EthologicalUseOption[] = [
  {
    id: 'deglucion-hispida',
    code: 'Uso A',
    title: 'Deglución entera en acordeón para arrastre mecánico de nematodos',
    mechanismTag: 'Acción mecánica · Hojas híspidas',
    behavioralDescription:
      'El primate recoge hojas jóvenes ásperas una a una con el estómago vacío, las pliega con la lengua sin masticar y las expulsa intactas atrapando parásitos en sus pelos microscópicos.',
    diagnosticCue: 'Requiere hojas herbáceas cubiertas de tricomas rígidos visibles.',
  },
  {
    id: 'profilaxis-saponinas',
    code: 'Uso B',
    title: 'Consumo selectivo de frutos ricos en saponinas frente a esquistosomiasis',
    mechanismTag: 'Profilaxis fitoquímica · Drupas de sabana árida',
    behavioralDescription:
      'Tropas ribereñas en zonas endémicas de Schistosoma mansoni incorporan frutos y hojas amargas con diosgenina que grupos vecinos fuera del foco infeccioso apenas consumen.',
    diagnosticCue: 'Propia de un árbol espinoso de sabana árida con frutos ovalados.',
  },
  {
    id: 'lija-antimicrobiana',
    code: 'Uso C',
    title: 'Barrido digestivo con hojas silicificadas tipo «papel de lija» y efecto antibacteriano',
    mechanismTag: 'Mecánico + antimicrobiano · Hojas abrasivas',
    behavioralDescription:
      'Deglución sin trituración de hojas arbóreas muy rasposas con depósitos de sílice en bordes de bosque-sabana, combinando fricción intestinal y compuestos que inhiben bacterias.',
    diagnosticCue: 'Hojas grandes, mates y densamente nervadas de tacto muy abrasivo.',
  },
  {
    id: 'masticacion-medula',
    code: 'Uso D',
    title: 'Pelado de brotes jóvenes y masticación lenta de médula amarga',
    mechanismTag: 'Acción química · Médula interna',
    behavioralDescription:
      'Individuos con letargo pelan cuidadosamente la corteza exterior de tallos tiernos y absorben el jugo amargo de la médula rica en lactonas sesquiterpénicas, escupiendo la fibra.',
    diagnosticCue: 'Se reconoce por el tallo joven pelado que deja expuesta la médula blanca.',
  },
];

const DEFAULT_SESSION_STATE: TallerSessionState = {
  selectedPlantId: 'vernonia',
  pairings: {
    vernonia: '',
    aspilia: '',
    balanites: '',
    ficus: '',
  },
  checkedIds: [],
  attemptsCount: 0,
  revealedHints: [],
  lastSavedAt: null,
};

const VALID_PLANT_IDS: PlantSpecimenId[] = ['vernonia', 'aspilia', 'balanites', 'ficus'];
const VALID_USE_IDS: EthologicalUseId[] = [
  'masticacion-medula',
  'deglucion-hispida',
  'profilaxis-saponinas',
  'lija-antimicrobiana',
];

function loadSessionState(): TallerSessionState {
  if (typeof window === 'undefined') return DEFAULT_SESSION_STATE;
  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return DEFAULT_SESSION_STATE;
    const parsed = JSON.parse(raw) as Partial<TallerSessionState>;
    const selectedPlantId = VALID_PLANT_IDS.includes(parsed.selectedPlantId as PlantSpecimenId)
      ? (parsed.selectedPlantId as PlantSpecimenId)
      : 'vernonia';

    const pairings: Record<PlantSpecimenId, EthologicalUseId | ''> = {
      vernonia: '',
      aspilia: '',
      balanites: '',
      ficus: '',
    };
    if (parsed.pairings && typeof parsed.pairings === 'object') {
      VALID_PLANT_IDS.forEach((pid) => {
        const val = (parsed.pairings as Record<string, unknown>)[pid];
        if (typeof val === 'string' && VALID_USE_IDS.includes(val as EthologicalUseId)) {
          pairings[pid] = val as EthologicalUseId;
        }
      });
    }

    const checkedIds = Array.isArray(parsed.checkedIds)
      ? parsed.checkedIds.filter((id): id is PlantSpecimenId =>
          VALID_PLANT_IDS.includes(id as PlantSpecimenId)
        )
      : [];

    const revealedHints = Array.isArray(parsed.revealedHints)
      ? parsed.revealedHints.filter((id): id is PlantSpecimenId =>
          VALID_PLANT_IDS.includes(id as PlantSpecimenId)
        )
      : [];

    const attemptsCount =
      typeof parsed.attemptsCount === 'number' && Number.isFinite(parsed.attemptsCount)
        ? Math.max(0, Math.floor(parsed.attemptsCount))
        : 0;

    const lastSavedAt = typeof parsed.lastSavedAt === 'string' ? parsed.lastSavedAt : null;

    return {
      selectedPlantId,
      pairings,
      checkedIds,
      attemptsCount,
      revealedHints,
      lastSavedAt,
    };
  } catch {
    return DEFAULT_SESSION_STATE;
  }
}

function formatCurrentTimeLabel(): string {
  try {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());
  } catch {
    return 'guardado';
  }
}

export function TallerAutomedicacion() {
  const [sessionState, setSessionState] = useState<TallerSessionState>(() => loadSessionState());
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Persist session progress cleanly in sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionState));
    } catch {
      // Ignore storage quota / strict privacy errors silently
    }
  }, [sessionState]);

  const activePlant = useMemo(
    () =>
      PLANT_SPECIMENS.find((p) => p.id === sessionState.selectedPlantId) ?? PLANT_SPECIMENS[0],
    [sessionState.selectedPlantId]
  );

  const stats = useMemo(() => {
    const pairedCount = VALID_PLANT_IDS.filter((id) => Boolean(sessionState.pairings[id])).length;
    const checkedCount = sessionState.checkedIds.length;
    const correctCount = PLANT_SPECIMENS.filter(
      (p) =>
        sessionState.checkedIds.includes(p.id) && sessionState.pairings[p.id] === p.correctUseId
    ).length;
    return {
      pairedCount,
      checkedCount,
      correctCount,
      allCorrect: correctCount === PLANT_SPECIMENS.length,
    };
  }, [sessionState.pairings, sessionState.checkedIds]);

  const handleSelectPlant = (plantId: PlantSpecimenId) => {
    setSessionState((prev) => ({
      ...prev,
      selectedPlantId: plantId,
      lastSavedAt: formatCurrentTimeLabel(),
    }));
  };

  const handleAssignUseToActivePlant = (useId: EthologicalUseId) => {
    setSessionState((prev) => {
      const targetPlantId = prev.selectedPlantId;
      const nextPairings = { ...prev.pairings };

      // Keep 1-to-1 correspondence clean: if another plant already had this use, free it
      VALID_PLANT_IDS.forEach((pid) => {
        if (pid !== targetPlantId && nextPairings[pid] === useId) {
          nextPairings[pid] = '';
        }
      });
      nextPairings[targetPlantId] = useId;

      const nextChecked = prev.checkedIds.filter(
        (pid) => pid !== targetPlantId && nextPairings[pid] !== ''
      );

      return {
        ...prev,
        pairings: nextPairings,
        checkedIds: nextChecked,
        lastSavedAt: formatCurrentTimeLabel(),
      };
    });
  };

  const handleCheckActivePlant = () => {
    setSessionState((prev) => {
      const pid = prev.selectedPlantId;
      if (!prev.pairings[pid]) return prev;
      const nextChecked = prev.checkedIds.includes(pid)
        ? prev.checkedIds
        : [...prev.checkedIds, pid];
      return {
        ...prev,
        checkedIds: nextChecked,
        attemptsCount: prev.attemptsCount + 1,
        lastSavedAt: formatCurrentTimeLabel(),
      };
    });
  };

  const handleCheckAllPaired = () => {
    setSessionState((prev) => {
      const pairedIds = VALID_PLANT_IDS.filter((pid) => Boolean(prev.pairings[pid]));
      if (pairedIds.length === 0) return prev;
      return {
        ...prev,
        checkedIds: pairedIds,
        attemptsCount: prev.attemptsCount + 1,
        lastSavedAt: formatCurrentTimeLabel(),
      };
    });
  };

  const handleToggleHint = (plantId: PlantSpecimenId) => {
    setSessionState((prev) => {
      const exists = prev.revealedHints.includes(plantId);
      const nextHints = exists
        ? prev.revealedHints.filter((id) => id !== plantId)
        : [...prev.revealedHints, plantId];
      return {
        ...prev,
        revealedHints: nextHints,
        lastSavedAt: formatCurrentTimeLabel(),
      };
    });
  };

  const handleResetSession = () => {
    const fresh: TallerSessionState = {
      ...DEFAULT_SESSION_STATE,
      lastSavedAt: formatCurrentTimeLabel(),
    };
    setSessionState(fresh);
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  const activeAssignedUseId = sessionState.pairings[activePlant.id];
  const activeAssignedUse = ETHOLOGICAL_USE_OPTIONS.find((u) => u.id === activeAssignedUseId);
  const activeIsChecked = sessionState.checkedIds.includes(activePlant.id);
  const activeIsCorrect = activeIsChecked && activeAssignedUseId === activePlant.correctUseId;
  const activeHintOpen = sessionState.revealedHints.includes(activePlant.id);

  return (
    <div
      id="panel-etologia-taller-automedicacion"
      role="tabpanel"
      aria-labelledby="tab-etologia-taller-automedicacion"
      className="flex flex-col gap-6"
    >
      {/* Editorial Header & Session Progress Bar */}
      <div className="bg-paper border border-hairline p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-rule pb-4">
          <div className="flex flex-col gap-1.5 max-w-[74ch]">
            <div className="flex items-center gap-2 font-mono text-xs text-forest">
              <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Taller de Automedicación · Relación visual planta africana ↔ uso etológico</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink m-0">
              Identificación visual de farmacopea primate en África
            </h3>
            <p className="text-sm leading-relaxed text-ink-muted m-0">
              Selecciona cada fotografía botánica de campo y relaciónala con su conducta terapéutica
              correspondiente en{' '}
              <GlossaryTermTrigger termId="zoofarmacognosia" tone="forest">
                zoofarmacognosia africana
              </GlossaryTermTrigger>
              . Tu avance y comprobaciones se guardan automáticamente en el estado de la sesión.
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="bg-canvas border border-hairline px-3.5 py-2 font-mono text-xs tabular-nums text-ink flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>
                Emparejadas: <strong>{stats.pairedCount}</strong>/{PLANT_SPECIMENS.length}
              </span>
              <span aria-hidden="true" className="text-ink-muted">
                ·
              </span>
              <span>
                Correctas: <strong className="text-forest">{stats.correctCount}</strong>/
                {PLANT_SPECIMENS.length}
              </span>
              <span aria-hidden="true" className="text-ink-muted">
                ·
              </span>
              <span>
                Intentos: <strong>{sessionState.attemptsCount}</strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5 text-lapis" aria-hidden="true" />
                <span>
                  {sessionState.lastSavedAt
                    ? `Guardado en sesión (${sessionState.lastSavedAt})`
                    : 'Progreso activo en sesión'}
                </span>
              </span>
              {(stats.pairedCount > 0 || sessionState.attemptsCount > 0) && (
                <button
                  type="button"
                  onClick={handleResetSession}
                  className="inline-flex items-center gap-1 text-ochre hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  <span>Reiniciar sesión</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Visual Progress Meter */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between font-mono text-[11px] text-ink-muted tabular-nums">
            <span>Progreso validado del taller</span>
            <span>{Math.round((stats.correctCount / PLANT_SPECIMENS.length) * 100)} % completado</span>
          </div>
          <div className="h-2 bg-canvas border border-hairline overflow-hidden" aria-hidden="true">
            <div
              className="h-full bg-forest transition-all duration-200"
              style={{ width: `${(stats.correctCount / PLANT_SPECIMENS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two-Zone Interactive Matching Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Zone 1: Visual Botanical Specimen Cards (4:3 photographs) */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-mono text-xs font-semibold text-ink">
              1. Selecciona una planta africana fotografiada
            </span>
            <span className="font-mono text-[11px] text-ink-muted">
              4 ejemplares de campo
            </span>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
            role="listbox"
            aria-label="Ejemplares botánicos africanos"
          >
            {PLANT_SPECIMENS.map((plant) => {
              const isSelected = plant.id === activePlant.id;
              const pairedUseId = sessionState.pairings[plant.id];
              const pairedUse = ETHOLOGICAL_USE_OPTIONS.find((u) => u.id === pairedUseId);
              const isChecked = sessionState.checkedIds.includes(plant.id);
              const isCorrect = isChecked && pairedUseId === plant.correctUseId;
              const isImageBroken = Boolean(brokenImages[plant.id]);

              return (
                <button
                  key={plant.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectPlant(plant.id)}
                  className={`text-left border transition-colors cursor-pointer flex flex-col overflow-hidden bg-canvas ${
                    isSelected
                      ? 'border-ink ring-1 ring-ink'
                      : isCorrect
                        ? 'border-forest'
                        : isChecked && !isCorrect
                          ? 'border-ochre'
                          : 'border-hairline hover:border-ink/70'
                  }`}
                >
                  {/* 4:3 Botanical Field Image with Resilient Fallback */}
                  <div className="relative aspect-[4/3] w-full bg-paper overflow-hidden border-b border-hairline">
                    {!isImageBroken ? (
                      <img
                        src={plant.imageSrc}
                        alt={plant.imageAlt}
                        width={800}
                        height={600}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                        onError={() =>
                          setBrokenImages((prev) => ({ ...prev, [plant.id]: true }))
                        }
                        className="w-full h-full object-cover block"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 bg-paper text-ink-muted">
                        <Leaf className="w-6 h-6 text-forest" aria-hidden="true" />
                        <span className="font-display text-sm italic text-ink">
                          {plant.scientificName}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 py-2 flex items-end justify-between gap-2">
                      <span className="font-mono text-[10.5px] text-white/95">
                        {plant.africanEnclave}
                      </span>
                      {isSelected && (
                        <span className="font-mono text-[10px] font-semibold text-white">
                          Activa
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Typography & Pairing Status */}
                  <div className="p-3.5 flex flex-col gap-1.5 flex-1">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-display text-sm font-semibold italic text-ink leading-snug">
                        {plant.scientificName}
                      </span>
                      <span className="font-mono text-[11px] text-ink-muted">
                        {plant.commonName} · {plant.biome}
                      </span>
                    </div>

                    <div className="mt-auto pt-2 border-t border-hairline font-mono text-[11px] flex items-center justify-between gap-2">
                      {isChecked ? (
                        isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-forest font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            <span>Correcta ({pairedUse?.code})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-ochre font-semibold">
                            <XCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            <span>Revisar ({pairedUse?.code})</span>
                          </span>
                        )
                      ) : pairedUse ? (
                        <span className="inline-flex items-center gap-1 text-lapis font-medium">
                          <Link2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>Emparejada: {pairedUse.code}</span>
                        </span>
                      ) : (
                        <span className="text-ink-muted">Sin emparejar</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Zone 2: Ethological Use Interactive Selector & Dynamic Feedback */}
        <div className="lg:col-span-6 bg-canvas border border-hairline p-5 flex flex-col gap-5">
          {/* Active Plant Context Header */}
          <div className="flex flex-col gap-1.5 border-b border-rule pb-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-ink-muted">
              <span>
                Ejemplar seleccionado · <em className="text-ink">{activePlant.primate}</em>
              </span>
              <button
                type="button"
                onClick={() => handleToggleHint(activePlant.id)}
                aria-expanded={activeHintOpen}
                className="inline-flex items-center gap-1 text-lapis hover:text-ochre cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{activeHintOpen ? 'Ocultar pista visual' : 'Ver pista morfológica'}</span>
              </button>
            </div>
            <h4 className="font-display text-lg sm:text-xl font-semibold text-ink m-0">
              <em className="italic">{activePlant.scientificName}</em>{' '}
              <span className="font-normal text-ink-muted text-base">
                ({activePlant.commonName})
              </span>
            </h4>
            <span className="font-mono text-xs text-ink-muted">
              {activePlant.africanEnclave} · {activePlant.biome}
            </span>

            {activeHintOpen && (
              <p className="mt-1.5 bg-paper border border-hairline p-3 text-xs leading-relaxed text-ink m-0">
                <strong className="text-ochre">Pista de observación:</strong>{' '}
                {activePlant.visualHint}
              </p>
            )}
          </div>

          {/* Interactive Selector of 4 Ethological Uses */}
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-xs font-semibold text-ink">
              2. Asigna el uso etológico correspondiente a esta planta
            </span>
            <div
              className="flex flex-col gap-2"
              role="radiogroup"
              aria-label={`Seleccionar uso etológico para ${activePlant.scientificName}`}
            >
              {ETHOLOGICAL_USE_OPTIONS.map((useOpt) => {
                const isAssignedHere = activeAssignedUseId === useOpt.id;
                const assignedElsewhere = PLANT_SPECIMENS.find(
                  (p) => p.id !== activePlant.id && sessionState.pairings[p.id] === useOpt.id
                );

                let btnStyle = 'bg-paper border-hairline text-ink hover:border-ink';
                if (activeIsChecked && isAssignedHere) {
                  btnStyle = activeIsCorrect
                    ? 'bg-forest/10 border-forest text-ink'
                    : 'bg-ochre/10 border-ochre text-ink';
                } else if (isAssignedHere) {
                  btnStyle = 'bg-ink text-white border-ink';
                }

                return (
                  <button
                    key={useOpt.id}
                    type="button"
                    role="radio"
                    aria-checked={isAssignedHere}
                    onClick={() => handleAssignUseToActivePlant(useOpt.id)}
                    className={`p-3.5 text-left border rounded transition-colors cursor-pointer flex flex-col gap-1 ${btnStyle}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                      <span
                        className={
                          isAssignedHere && !activeIsChecked
                            ? 'text-white/90 font-semibold'
                            : 'text-ochre font-semibold'
                        }
                      >
                        {useOpt.code} · {useOpt.mechanismTag}
                      </span>
                      {assignedElsewhere && (
                        <span
                          className={
                            isAssignedHere && !activeIsChecked
                              ? 'text-white/80'
                              : 'text-ink-muted italic'
                          }
                        >
                          Asignado a {assignedElsewhere.scientificName}
                        </span>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold leading-snug">
                      {useOpt.title}
                    </span>
                    <span
                      className={`text-xs leading-relaxed ${
                        isAssignedHere && !activeIsChecked ? 'text-white/85' : 'text-ink-muted'
                      }`}
                    >
                      {useOpt.behavioralDescription}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-hairline">
            <button
              type="button"
              disabled={!activeAssignedUseId}
              onClick={handleCheckActivePlant}
              className="min-h-[40px] px-4 py-2 font-mono text-xs font-semibold text-white bg-ink border border-ink rounded hover:bg-ochre hover:border-ochre disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
            >
              Comprobar esta planta
            </button>

            <button
              type="button"
              disabled={stats.pairedCount === 0}
              onClick={handleCheckAllPaired}
              className="min-h-[40px] px-4 py-2 font-mono text-xs text-ink bg-paper border border-hairline rounded hover:border-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
            >
              Comprobar todas ({stats.pairedCount}/{PLANT_SPECIMENS.length})
            </button>
          </div>

          {/* Dynamic Contrastive Feedback Region */}
          {activeIsChecked && activeAssignedUse && (
            <div
              className={`p-4 border flex flex-col gap-2.5 text-xs leading-relaxed ${
                activeIsCorrect ? 'bg-forest/5 border-forest' : 'bg-ochre/5 border-ochre'
              }`}
              aria-live="polite"
            >
              <div className="flex items-center gap-2 font-mono font-semibold">
                {activeIsCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-forest shrink-0" aria-hidden="true" />
                    <span className="text-forest">
                      Correspondencia correcta · {activePlant.scientificName} ↔{' '}
                      {activeAssignedUse.code}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-ochre shrink-0" aria-hidden="true" />
                    <span className="text-ochre">
                      No coincide · {activeAssignedUse.code} corresponde a otro rasgo botánico
                    </span>
                  </>
                )}
              </div>

              {activeIsCorrect ? (
                <>
                  <p className="text-ink m-0">{activePlant.verifiedFeedback}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-hairline text-ink">
                    <div>
                      <span className="font-mono text-[10.5px] text-forest block">
                        Mecanismo verificado
                      </span>
                      <span>{activePlant.activeMechanism}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[10.5px] text-ochre block">
                        Parásito / patógeno diana
                      </span>
                      <span>{activePlant.targetParasite}</span>
                    </div>
                  </div>
                  <p className="text-ink-muted m-0 pt-2 border-t border-hairline">
                    <strong className="text-ink">Paralelismo etnobotánico:</strong>{' '}
                    {activePlant.ethnobotanyNote}
                  </p>
                  <span className="font-mono text-[10.5px] text-ink-muted">
                    Referencia: {activePlant.citation}
                  </span>
                </>
              ) : (
                <>
                  <p className="text-ink m-0">
                    Has seleccionado <strong>{activeAssignedUse.title}</strong> (
                    {activeAssignedUse.diagnosticCue.toLowerCase()}). Vuelve a inspeccionar la
                    fotografía de <em>{activePlant.scientificName}</em>:
                  </p>
                  <p className="text-ink m-0 bg-canvas border border-hairline p-2.5">
                    <strong className="text-ochre">Clave visual para corregir:</strong>{' '}
                    {activePlant.visualHint}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Workshop Completion Synthesis Banner */}
      {stats.allCorrect && (
        <div
          className="bg-canvas border border-forest p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          aria-live="polite"
        >
          <div className="flex flex-col gap-1.5 max-w-[74ch]">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-forest">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>
                Taller de Automedicación completado · 4/4 relaciones verificadas en{' '}
                {sessionState.attemptsCount}{' '}
                {sessionState.attemptsCount === 1 ? 'comprobación' : 'comprobaciones'}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-ink m-0">
              Has relacionado correctamente estrategias químicas (<em>Vernonia amygdalina</em>),
              mecánicas por tricomas (<em>Aspilia mossambicensis</em> y <em>Ficus exasperata</em>) y
              profilaxis con saponinas en sabanas áridas (<em>Balanites aegyptiaca</em>). Estas
              cuatro especies ilustran cómo la etología africana y la farmacopea tradicional humana
              convergen sobre los mismos recursos vegetales del continente.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetSession}
            className="min-h-[40px] px-4 py-2 font-mono text-xs text-ink bg-paper border border-hairline rounded hover:border-ink inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start md:self-center"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Practicar de nuevo</span>
          </button>
        </div>
      )}
    </div>
  );
}
