import { GLOSSARY_TERMS } from './glossary';
import { BIBLIOGRAPHY_ENTRIES, type KingdomId } from './curriculum';
import type { AtlasTabId } from '../components/atlas/AtlasAulaView';

const TOTAL_BIBLIOGRAPHY_COUNT = BIBLIOGRAPHY_ENTRIES.reduce(
  (acc, group) => acc + group.items.length,
  0
);

export type CourseBlockId = 'bloque-1' | 'bloque-2' | 'bloque-3' | 'bloque-4';

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
  accent: 'ochre' | 'lapis' | 'forest' | 'ink';
  chapterIds: string[];
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
    blockId: 'bloque-3',
  },
  {
    id: 'sec-antropologia-visual',
    num: '05c',
    label: 'Antropología visual de África',
    shortLabel: 'Antrop. Visual',
    summary:
      'Archivo conectado con antropologiavisual.net: 13 documentales etnográficos de África, búsqueda en directo, Jean Rouch y método visual.',
    durationMin: 8,
    blockId: 'bloque-3',
  },
  {
    id: 'sec-cultural-studies',
    num: '05d',
    label: 'Cultural Studies: el «África misteriosa»',
    shortLabel: 'Cultural Studies',
    summary:
      'Genealogía colonial (1490–2025), matriz binaria de estereotipos, 12 tropos del «África misteriosa», 17 fuentes históricas, laboratorio de Stuart Hall y contra-narrativas africanas.',
    durationMin: 11,
    blockId: 'bloque-3',
  },
  {
    id: 'sec-bibliografia',
    num: '06',
    label: 'Bibliografía y repositorios',
    shortLabel: 'Bibliografía',
    summary: `${TOTAL_BIBLIOGRAPHY_COUNT} referencias verificadas APA 7.ª y portales científicos abiertos.`,
    durationMin: 4,
    blockId: 'bloque-4',
  },
  {
    id: 'sec-glosario',
    num: 'Glosario',
    label: `Glosario técnico (${GLOSSARY_TERMS.length} términos)`,
    shortLabel: 'Glosario',
    summary: 'Definiciones operativas A–Z vinculadas a lo largo de todo el temario.',
    durationMin: null,
    blockId: 'bloque-4',
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
  },
  {
    id: 'bloque-3',
    roman: 'III',
    shortTitle: 'Sociedades y Reinos',
    title: 'Tecnología, reinos y redes africanas',
    description:
      'Siderurgia y expansión bantú, seis grandes Estados, comercio, historiografía, estereotipos, antropología visual y Cultural Studies.',
    accent: 'forest',
    chapterIds: [
      'sec-tecnologia',
      'sec-reinos',
      'sec-comercio',
      'sec-historiografia',
      'sec-estereotipos-canibalismo',
      'sec-antropologia-visual',
      'sec-cultural-studies',
    ],
  },
  {
    id: 'bloque-4',
    roman: 'IV',
    shortTitle: 'Referencia y Glosario',
    title: 'Bibliografía y glosario técnico',
    description:
      'Bibliografía verificada APA 7.ª, repositorios científicos abiertos y glosario técnico A–Z.',
    accent: 'ink',
    chapterIds: ['sec-bibliografia', 'sec-glosario'],
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
    tag: 'Galería · Bloque III',
    action: {
      sectionId: 'sec-estereotipos-canibalismo',
      cannibalism: { tab: 'galeria' },
    },
  },
  {
    id: 'lab-cronologia-critica',
    title: 'Cronología Crítica: mitos vs. arqueología africana',
    subtitle: 'Doble carril interactivo en 6 regiones africanas (Kush, Aksum, Suajili, Zimbabue, Benín y Congo)',
    tag: 'Cronología · Bloque III',
    action: {
      sectionId: 'sec-estereotipos-canibalismo',
      cannibalism: { tab: 'cronologia-critica' },
    },
  },
  {
    id: 'lab-antropologia-visual-africa',
    title: 'Antropología visual de África (AntropologiaVisual.net)',
    subtitle: '13 documentales etnográficos africanos, reproducción en línea y consulta directa al archivo',
    tag: 'Archivo · Bloque III',
    action: {
      sectionId: 'sec-antropologia-visual',
      visualAnthropology: { tab: 'filmografia' },
    },
  },
  {
    id: 'lab-cultural-studies-africa',
    title: 'Cultural Studies: el «África misteriosa»',
    subtitle: '8 tropos coloniales, laboratorio de lectura de Stuart Hall y contra-narrativas africanas',
    tag: 'Cultural Studies · Bloque III',
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
