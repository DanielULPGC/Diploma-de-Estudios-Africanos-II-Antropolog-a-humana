import { GLOSSARY_TERMS } from './glossary';
import { BIBLIOGRAPHY_ENTRIES, type KingdomId } from './curriculum';
import type { AtlasTabId } from '../components/atlas/AtlasAulaView';

const TOTAL_BIBLIOGRAPHY_COUNT = BIBLIOGRAPHY_ENTRIES.reduce(
  (acc, group) => acc + group.items.length,
  0
);

export type CourseBlockId = 'bloque-1' | 'bloque-2' | 'bloque-3' | 'bloque-4' | 'bloque-5';

export type StudyViewMode = 'completo' | 'bloque';

export interface CourseChapterMeta {
  id: string;
  num: string;
  label: string;
  shortLabel: string;
  summary: string;
  durationMin: number | null;
  blockId: CourseBlockId;
  hasInteractive3D?: boolean;
}

export interface CourseBlockMeta {
  id: CourseBlockId;
  roman: string;
  shortTitle: string;
  title: string;
  description: string;
  accent: 'ochre' | 'lapis' | 'forest' | 'plum' | 'ink';
  chapterIds: string[];
  learningOutcomes: string[];
  reflectionPrompts?: string[];
}

export interface CourseDeepAction {
  sectionId: string;
  anthropology?: {
    topicId?: string;
    view3d?: boolean;
    viewMode?: 'detalle' | 'mapa' | 'pastwomen' | 'smithsonian' | 'migraciones';
  };
  ethology?: {
    tab:
      | 'experimento'
      | 'primates'
      | 'aprendizaje'
      | 'parentesco'
      | 'olduvayense'
      | 'sociedad'
      | 'comunicacion'
      | 'culturas-taller'
      | 'taller-automedicacion';
    view3d?: boolean;
  };
  atlas?: {
    tab: AtlasTabId;
    taxonId?: string;
  };
  paleomolecular?: {
    tab: 'horizonte' | 'laboratorio' | 'firmas' | 'protocolos';
  };
  cannibalism?: {
    tab: 'galeria' | 'cronologia-critica' | 'genealogia' | 'iconos' | 'lexico' | 'ciencia-mito';
  };
  visualAnthropology?: {
    tab?: 'filmografia' | 'archivo-vivo' | 'autores-muestras';
    filmId?: string;
  };
  culturalStudies?: {
    tab?: 'marco-teorico' | 'genealogia-colonial' | 'tropos' | 'decodificador' | 'contranarrativas';
    tropeId?: string;
    phaseId?: string;
  };
  kingdomId?: KingdomId;
  glossaryTermId?: string;
}

export interface InteractiveLabShortcut {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  action: CourseDeepAction;
}

export const COURSE_CHAPTERS: CourseChapterMeta[] = [
  {
    id: 'sec-origenes',
    num: '01',
    label: 'Orígenes panafricanos',
    shortLabel: 'Orígenes',
    summary: 'Modelo multirregional panafricano, Jebel Irhoud y diversidad genética basal.',
    durationMin: 5,
    blockId: 'bloque-1',
  },
  {
    id: 'sec-antropologia',
    num: 'Temas 1–10',
    label: 'Antropología y evolución humana',
    shortLabel: 'Temas 1–10',
    summary:
      '10 temas, biomecánica 3D, dossiers Pastwomen y Smithsonian, y mapa migratorio D3.js.',
    durationMin: 18,
    blockId: 'bloque-1',
    hasInteractive3D: true,
  },
  {
    id: 'sec-atlas-paleo',
    num: 'Atlas',
    label: 'Atlas de Paleoantropología y DEA',
    shortLabel: 'Atlas Paleo',
    summary: '52 táxones fósiles, Reloj 24h, mapa del Rift, 5 cráneos 3D y 6 sesiones DEA.',
    durationMin: 10,
    blockId: 'bloque-1',
    hasInteractive3D: true,
  },
  {
    id: 'sec-atlas-paleobotanica',
    num: 'Botánica',
    label: 'Atlas de Paleobotánica',
    shortLabel: 'Paleobotánica',
    summary: 'Pólenes, fitolitos, paleopaisajes y reconstrucción ecológica de la evolución humana.',
    durationMin: 5,
    blockId: 'bloque-2',
  },
  {
    id: 'sec-paleomolecular',
    num: 'Molecular',
    label: 'Paleoproteómica y Paleogenómica',
    shortLabel: 'Paleomolecular',
    summary: 'Límites de preservación de ADN y proteínas, simulador de viabilidad y firmas bioquímicas.',
    durationMin: 6,
    blockId: 'bloque-2',
    hasInteractive3D: true,
  },
  {
    id: 'etologia',
    num: 'Etología',
    label: 'Etología y primatología africana',
    shortLabel: 'Etología',
    summary:
      'Percusión lítica 3D, sociedad y cooperación, comparador comunicativo, culturas ecológicas y taller.',
    durationMin: 14,
    blockId: 'bloque-2',
    hasInteractive3D: true,
  },
  {
    id: 'sec-tecnologia',
    num: '02',
    label: 'Hierro y expansión bantú',
    shortLabel: 'Hierro y bantú',
    summary: 'Metalurgia temprana independiente, agricultura forestal y difusión lingüística.',
    durationMin: 5,
    blockId: 'bloque-3',
  },
  {
    id: 'sec-reinos',
    num: '03',
    label: 'Seis grandes reinos',
    shortLabel: 'Reinos',
    summary: 'Kush, Aksum, Costa Suajili, Imperio de Malí, Gran Zimbabue y Reino de Benín.',
    durationMin: 8,
    blockId: 'bloque-3',
  },
  {
    id: 'sec-comercio',
    num: '04',
    label: 'Redes del Sáhara e Índico',
    shortLabel: 'Comercio',
    summary: 'Simulador de intercambios transaharianos y navegación monzónica del Índico.',
    durationMin: 5,
    blockId: 'bloque-3',
  },
  {
    id: 'sec-historiografia',
    num: '05',
    label: 'Fuentes e historiografía',
    shortLabel: 'Historiografía',
    summary: 'Tradición oral, manuscritos de Tombuctú, arqueología y triangulación de fuentes.',
    durationMin: 5,
    blockId: 'bloque-3',
  },
  {
    id: 'sec-estereotipos-canibalismo',
    num: '05b',
    label: 'Estereotipos sobre canibalismo',
    shortLabel: 'Estereotipos',
    summary:
      'Galería histórica (18 láminas), Cronología Crítica (mitos vs. arqueología africana), iconos, NTLLE y ciencia vs. mito.',
    durationMin: 9,
    blockId: 'bloque-4',
  },
  {
    id: 'sec-antropologia-visual',
    num: '05c',
    label: 'Antropología visual de África',
    shortLabel: 'Antrop. Visual',
    summary:
      'Archivo conectado con antropologiavisual.net: 13 documentales etnográficos de África, búsqueda en directo, Jean Rouch y método visual.',
    durationMin: 8,
    blockId: 'bloque-4',
  },
  {
    id: 'sec-cultural-studies',
    num: '05d',
    label: 'Cultural Studies: el «África misteriosa»',
    shortLabel: 'Cultural Studies',
    summary:
      'Genealogía colonial (1490–2025), matriz binaria de estereotipos, 12 tropos del «África misteriosa», 17 láminas didácticas de referencia, laboratorio de Stuart Hall y contra-narrativas africanas.',
    durationMin: 11,
    blockId: 'bloque-4',
  },
  {
    id: 'sec-bibliografia',
    num: '06',
    label: 'Bibliografía y repositorios',
    shortLabel: 'Bibliografía',
    summary: `${TOTAL_BIBLIOGRAPHY_COUNT} referencias verificadas APA 7.ª y portales científicos abiertos.`,
    durationMin: 4,
    blockId: 'bloque-5',
  },
  {
    id: 'sec-glosario',
    num: 'Glosario',
    label: `Glosario técnico (${GLOSSARY_TERMS.length} términos)`,
    shortLabel: 'Glosario',
    summary: 'Definiciones operativas A–Z vinculadas a lo largo de todo el temario.',
    durationMin: null,
    blockId: 'bloque-5',
  },
];

export const COURSE_BLOCKS: CourseBlockMeta[] = [
  {
    id: 'bloque-1',
    roman: 'I',
    shortTitle: 'Evolución',
    title: 'Evolución humana y paleoantropología',
    description:
      'Origen panafricano, los 10 temas de antropología evolutiva, biomecánica 3D y el Atlas fósil.',
    accent: 'ochre',
    chapterIds: ['sec-origenes', 'sec-antropologia', 'sec-atlas-paleo'],
    learningOutcomes: [
      'Argumentar por qué el origen de Homo sapiens responde a un modelo panafricano estructurado y no a una única «cuna» puntual.',
      'Relacionar la evidencia fósil africana, la biomecánica del bipedismo y los cuidados sociales (enfoque Pastwomen) con las grandes dispersiones humanas.',
    ],
    reflectionPrompts: [
      '¿Qué consecuencias científicas tiene situar fósiles como Jebel Irhoud (~300 ka) en Marruecos frente a la antigua idea de un único foco en África Oriental?',
      '¿Cómo corrige el concepto de actividades de mantenimiento (Pastwomen) el sesgo androcéntrico en las reconstrucciones clásicas de la evolución humana?',
    ],
  },
  {
    id: 'bloque-2',
    roman: 'II',
    shortTitle: 'Ciencias y Etología',
    title: 'Ecología, evidencia molecular y conducta',
    description:
      'Paleobotánica, límites del ADN antiguo y proteínas, percusión lítica 3D y parentesco.',
    accent: 'lapis',
    chapterIds: ['sec-atlas-paleobotanica', 'sec-paleomolecular', 'etologia'],
    learningOutcomes: [
      'Distinguir los límites reales de preservación del ADN antiguo y la paleoproteómica en contextos cálidos africanos.',
      'Interpretar el papel de la reconstrucción paleoambiental, la tecnología lítica y la primatología comparada para comprender la cultura y la cooperación humanas.',
    ],
    reflectionPrompts: [
      '¿Por qué en latitudes tropicales africanas el ADN antiguo rara vez supera el Holoceno/Pleistoceno final y qué aporta la paleoproteómica de esmalte frente a ese límite?',
      '¿Qué evidencias de aprendizaje social, automedicación y uso de herramientas en primates africanos obligan a matizar la frontera rígida entre naturaleza y cultura?',
    ],
  },
  {
    id: 'bloque-3',
    roman: 'III',
    shortTitle: 'Sociedades y Reinos',
    title: 'Tecnología, reinos precoloniales e historiografía',
    description:
      'Siderurgia y expansión bantú, seis grandes Estados, comercio transahariano e índico y metodología de fuentes.',
    accent: 'forest',
    chapterIds: ['sec-tecnologia', 'sec-reinos', 'sec-comercio', 'sec-historiografia'],
    learningOutcomes: [
      'Evaluar la innovación tecnológica, la diversidad estatal y la integración comercial precolonial de África en las redes del Sáhara y el océano Índico.',
      'Triangular fuentes orales, manuscritos africanos y registro arqueológico para refutar el mito historiográfico de un «continente sin historia».',
    ],
    reflectionPrompts: [
      '¿Qué demuestra la convivencia de ciudades sin jerarquía estatal clásica (Jenné-Jeno) junto a reinos monumentales (Kush, Aksum, Malí, Gran Zimbabue, Benín) sobre la diversidad política africana?',
      '¿Por qué resulta metodológicamente insuficiente estudiar África precolonial solo a partir de crónicas externas sin contrastarlas con la arqueología y la tradición oral?',
    ],
  },
  {
    id: 'bloque-4',
    roman: 'IV',
    shortTitle: 'Imaginarios y Visual',
    title: 'Estereotipos coloniales, antropología visual y Cultural Studies',
    description:
      'Deconstrucción del canibalismo colonial, archivo de antropologiavisual.net y crítica cultural del «África misteriosa».',
    accent: 'plum',
    chapterIds: [
      'sec-estereotipos-canibalismo',
      'sec-antropologia-visual',
      'sec-cultural-studies',
    ],
    learningOutcomes: [
      'Identificar los mecanismos históricos, visuales y lingüísticos que fabricaron los estereotipos coloniales y el mito del «África misteriosa».',
      'Aplicar el modelo de decodificación de Stuart Hall y los principios de la antropología visual compartida para analizar fuentes mediáticas y cine etnográfico africano.',
    ],
    reflectionPrompts: [
      '¿Qué función política y económica cumplió la invención europea del «África misteriosa» y del alocronismo durante el reparto colonial y qué restos persisten en el turismo o la prensa actual?',
      '¿De qué manera el cine etnográfico participativo y las contra-narrativas africanas desplazan la posición del continente de «objeto observado» a «sujeto autor»?',
    ],
  },
  {
    id: 'bloque-5',
    roman: 'V',
    shortTitle: 'Referencia y Glosario',
    title: 'Bibliografía verificada y glosario técnico',
    description:
      'Bibliografía consolidada APA 7.ª de todo el módulo, repositorios abiertos y glosario técnico A–Z con búsqueda contextual.',
    accent: 'ink',
    chapterIds: ['sec-bibliografia', 'sec-glosario'],
    learningOutcomes: [
      'Localizar literatura científica verificada (APA 7.ª) y archivos digitales abiertos para ampliar cualquier eje del Módulo I.',
      'Navegar el vocabulario especializado del curso mediante la vista lateral de búsqueda contextual conectada a cada sección.',
    ],
  },
];

export const INTERACTIVE_LAB_SHORTCUTS: InteractiveLabShortcut[] = [
  {
    id: 'lab-biomecanica-3d',
    title: 'Biomecánica 3D y Visita guiada',
    subtitle: 'Primate vs. H. sapiens · Visita guiada pelvis/columna, heatmaps y contornos 3D',
    tag: 'Visor 3D · Tema 04',
    action: {
      sectionId: 'sec-antropologia',
      anthropology: { topicId: 'tema-04', view3d: true, viewMode: 'detalle' },
    },
  },
  {
    id: 'lab-mapa-migraciones-d3',
    title: 'Mapa migratorio humano (D3.js)',
    subtitle: '4 olas migratorias y 14 nodos arqueológicos de Smithsonian Human Origins y Pastwomen',
    tag: 'Mapa D3 · Evolución',
    action: {
      sectionId: 'sec-antropologia',
      anthropology: { viewMode: 'migraciones' },
    },
  },
  {
    id: 'lab-etologia-3d',
    title: 'Percusión lítica 3D + WebXR',
    subtitle: 'Bloques 6×6×4 cm, pistas sociales GLMM y proyección QR en tu escritorio',
    tag: '3D + WebXR · Etología',
    action: {
      sectionId: 'etologia',
      ethology: { tab: 'experimento', view3d: true },
    },
  },
  {
    id: 'lab-etologia-comparador',
    title: 'Comparador social y comunicativo',
    subtitle: 'Chimpancé, bonobo, gorila, babuino y gelada frente a 5 escenarios de campo',
    tag: 'Laboratorio · Etología',
    action: {
      sectionId: 'etologia',
      ethology: { tab: 'comunicacion' },
    },
  },
  {
    id: 'lab-taller-automedicacion',
    title: 'Taller de Automedicación',
    subtitle: 'Relaciona imágenes de plantas africanas con su uso etológico y guarda tu progreso',
    tag: 'Taller visual · Etología',
    action: {
      sectionId: 'etologia',
      ethology: { tab: 'taller-automedicacion' },
    },
  },
  {
    id: 'lab-parentesco',
    title: 'Árbol de parentesco',
    subtitle: 'Teoría de la abuela, roles sociales y aloparentalidad',
    tag: 'Interactivo · Etología',
    action: {
      sectionId: 'etologia',
      ethology: { tab: 'parentesco' },
    },
  },
  {
    id: 'lab-paleolab-3d',
    title: 'PaleoLab 3D y Reloj 24h',
    subtitle: 'Réplicas craneales del Smithsonian y escala evolutiva',
    tag: 'Atlas · 3D y Tiempo',
    action: {
      sectionId: 'sec-atlas-paleo',
      atlas: { tab: 'laboratorios' },
    },
  },
  {
    id: 'lab-comercio',
    title: 'Simulador comercial',
    subtitle: 'Caravanas del Sáhara y navegación monzónica del Índico',
    tag: 'Simulador · Bloque III',
    action: {
      sectionId: 'sec-comercio',
    },
  },
  {
    id: 'lab-estereotipos-canibalismo',
    title: 'Galería histórica: estereotipos del canibalismo',
    subtitle: '18 láminas comentadas, genealogía colonial, iconos (Chartier), léxico NTLLE y ciencia vs. mito',
    tag: 'Galería · Bloque IV',
    action: {
      sectionId: 'sec-estereotipos-canibalismo',
      cannibalism: { tab: 'galeria' },
    },
  },
  {
    id: 'lab-cronologia-critica',
    title: 'Cronología Crítica: mitos vs. arqueología africana',
    subtitle: 'Doble carril interactivo en 6 regiones africanas (Kush, Aksum, Suajili, Zimbabue, Benín y Congo)',
    tag: 'Cronología · Bloque IV',
    action: {
      sectionId: 'sec-estereotipos-canibalismo',
      cannibalism: { tab: 'cronologia-critica' },
    },
  },
  {
    id: 'lab-antropologia-visual-africa',
    title: 'Antropología visual de África (AntropologiaVisual.net)',
    subtitle: '13 documentales etnográficos africanos, reproducción en línea y consulta directa al archivo',
    tag: 'Archivo · Bloque IV',
    action: {
      sectionId: 'sec-antropologia-visual',
      visualAnthropology: { tab: 'filmografia' },
    },
  },
  {
    id: 'lab-cultural-studies-africa',
    title: 'Cultural Studies: el «África misteriosa»',
    subtitle: '6 fases coloniales, 12 tropos, 17 láminas de referencia, laboratorio de Stuart Hall y contra-narrativas',
    tag: 'Cultural Studies · Bloque IV',
    action: {
      sectionId: 'sec-cultural-studies',
      culturalStudies: { tab: 'decodificador' },
    },
  },
];

export function getBlockForChapter(chapterId: string): CourseBlockId {
  const found = COURSE_CHAPTERS.find((c) => c.id === chapterId);
  return found?.blockId ?? 'bloque-1';
}

export function getChapterMeta(chapterId: string): CourseChapterMeta {
  return COURSE_CHAPTERS.find((c) => c.id === chapterId) ?? COURSE_CHAPTERS[0];
}

export function getBlockMeta(blockId: CourseBlockId): CourseBlockMeta {
  return COURSE_BLOCKS.find((b) => b.id === blockId) ?? COURSE_BLOCKS[0];
}

export function normalizeSearchText(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export interface CourseDetailChannelMap {
  anthropology: NonNullable<CourseDeepAction['anthropology']>;
  ethology: NonNullable<CourseDeepAction['ethology']>;
  atlas: NonNullable<CourseDeepAction['atlas']>;
  paleomolecular: NonNullable<CourseDeepAction['paleomolecular']>;
  cannibalism: NonNullable<CourseDeepAction['cannibalism']>;
  visualAnthropology: NonNullable<CourseDeepAction['visualAnthropology']>;
  culturalStudies: NonNullable<CourseDeepAction['culturalStudies']>;
  kingdomId: KingdomId;
}

export type CourseDetailChannel = keyof CourseDetailChannelMap;

const PENDING_DETAIL_TTL_MS = 10_000;

interface PendingDetailEntry<K extends CourseDetailChannel> {
  payload: CourseDetailChannelMap[K];
  timestamp: number;
}

const pendingCourseDetails: Partial<{
  [K in CourseDetailChannel]: PendingDetailEntry<K>;
}> = {};

function storePendingCourseDetail<K extends CourseDetailChannel>(
  channel: K,
  payload: CourseDetailChannelMap[K]
): void {
  pendingCourseDetails[channel] = {
    payload,
    timestamp: Date.now(),
  } as (typeof pendingCourseDetails)[K];
}

export function clearPendingCourseDetail(channel: CourseDetailChannel): void {
  delete pendingCourseDetails[channel];
}

export function consumePendingCourseDetail<K extends CourseDetailChannel>(
  channel: K
): CourseDetailChannelMap[K] | null {
  const entry = pendingCourseDetails[channel] as PendingDetailEntry<K> | undefined;
  delete pendingCourseDetails[channel];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > PENDING_DETAIL_TTL_MS) return null;
  return entry.payload;
}

export function dispatchCourseDetailEvent(action: CourseDeepAction): void {
  if (typeof window === 'undefined') return;

  if (action.anthropology) {
    storePendingCourseDetail('anthropology', action.anthropology);
    window.dispatchEvent(
      new CustomEvent('ulpgc:open-anthropology-target', { detail: action.anthropology })
    );
  }
  if (action.ethology) {
    storePendingCourseDetail('ethology', action.ethology);
    window.dispatchEvent(
      new CustomEvent('ulpgc:open-ethology-tab', { detail: action.ethology })
    );
  }
  if (action.atlas) {
    storePendingCourseDetail('atlas', action.atlas);
    window.dispatchEvent(new CustomEvent('ulpgc:open-atlas-tab', { detail: action.atlas }));
  }
  if (action.paleomolecular) {
    storePendingCourseDetail('paleomolecular', action.paleomolecular);
    window.dispatchEvent(
      new CustomEvent('ulpgc:open-paleomolecular-tab', { detail: action.paleomolecular.tab })
    );
  }
  if (action.cannibalism) {
    storePendingCourseDetail('cannibalism', action.cannibalism);
    window.dispatchEvent(
      new CustomEvent('ulpgc:open-cannibalism-tab', { detail: action.cannibalism })
    );
  }
  if (action.visualAnthropology) {
    storePendingCourseDetail('visualAnthropology', action.visualAnthropology);
    window.dispatchEvent(
      new CustomEvent('ulpgc:open-visual-anthropology-tab', {
        detail: action.visualAnthropology,
      })
    );
  }
  if (action.culturalStudies) {
    storePendingCourseDetail('culturalStudies', action.culturalStudies);
    window.dispatchEvent(
      new CustomEvent('ulpgc:open-cultural-studies-tab', {
        detail: action.culturalStudies,
      })
    );
  }
  if (action.kingdomId) {
    storePendingCourseDetail('kingdomId', action.kingdomId);
    window.dispatchEvent(new CustomEvent('ulpgc:open-kingdom', { detail: action.kingdomId }));
  }
}
