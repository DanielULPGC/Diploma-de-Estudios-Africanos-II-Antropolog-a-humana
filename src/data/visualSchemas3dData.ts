import type { HenkeTaskSpec } from './ethologyData';

export interface CameraPreset3D {
  id: string;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface Hotspot3DInfo {
  id: string;
  arCode?: string;
  shortLabel?: string;
  title: string;
  subtitle: string;
  accent: string;
  position: [number, number, number];
  detail: string;
  evidence: string;
  glossaryTermIds?: string[];
}

export interface EthologyStone3DSpec {
  id: string;
  material: 'limestone' | 'sandstone';
  modified: boolean;
  label: string;
  position: [number, number, number];
  rotationY: number;
  zone: 'main' | 'unused' | 'used';
  roleHighlight?: 'anvil' | 'hammer' | 'social-winner' | null;
}

export interface EthologyTask3DLayout {
  taskId: HenkeTaskSpec['id'];
  stones: EthologyStone3DSpec[];
  hasShellsZone: boolean;
  shellsCenter: [number, number, number];
  flowArcs: Array<{
    id: string;
    from: [number, number, number];
    to: [number, number, number];
    color: string;
    label: string;
  }>;
  hotspots: Hotspot3DInfo[];
}

export const ETHOLOGY_3D_CAMERAS: CameraPreset3D[] = [
  { id: 'overview', label: 'Vista general', position: [0.3, 4.4, 5.6], target: [0, 0.2, 0] },
  { id: 'low-angle', label: 'Ras de suelo', position: [-3.9, 1.85, 3.6], target: [0.2, 0.25, 0] },
  { id: 'top-down', label: 'Planta cenital', position: [0.01, 6.4, 1.4], target: [0, 0, 0] },
];

export const ETHOLOGY_TASK_3D_LAYOUTS: Record<HenkeTaskSpec['id'], EthologyTask3DLayout> = {
  'task-1': {
    taskId: 'task-1',
    hasShellsZone: false,
    shellsCenter: [0, 0, 0],
    stones: [
      {
        id: 't1-s1',
        material: 'limestone',
        modified: false,
        label: 'Caliza intacta',
        position: [-2.1, 0, 0.15],
        rotationY: 0.12,
        zone: 'main',
        roleHighlight: 'anvil',
      },
      {
        id: 't1-s2',
        material: 'sandstone',
        modified: false,
        label: 'Arenisca intacta',
        position: [-0.7, 0, -0.2],
        rotationY: -0.18,
        zone: 'main',
        roleHighlight: 'hammer',
      },
      {
        id: 't1-s3',
        material: 'limestone',
        modified: false,
        label: 'Caliza intacta',
        position: [0.7, 0, 0.2],
        rotationY: 0.22,
        zone: 'main',
        roleHighlight: 'anvil',
      },
      {
        id: 't1-s4',
        material: 'sandstone',
        modified: false,
        label: 'Arenisca intacta',
        position: [2.1, 0, -0.15],
        rotationY: -0.1,
        zone: 'main',
        roleHighlight: 'hammer',
      },
    ],
    flowArcs: [
      {
        id: 't1-arc-anvil',
        from: [-2.1, 0.45, 0.15],
        to: [0.7, 0.45, 0.2],
        color: '#156f55',
        label: 'Caliza blanda → yunque (p = 0,002)',
      },
      {
        id: 't1-arc-hammer',
        from: [-0.7, 0.48, -0.2],
        to: [2.1, 0.48, -0.15],
        color: '#b43c0b',
        label: 'Arenisca dura → percutor (p = 0,001)',
      },
    ],
    hotspots: [
      {
        id: 'hs-t1-caliza',
        arCode: 'ETO-01',
        shortLabel: 'Caliza blanda (yunque)',
        title: 'Caliza fosilífera blanda (yunque)',
        subtitle: 'Dureza Equotip 27,05 ± 11,28 · p = 0,002',
        accent: '#156f55',
        position: [-2.1, 0.72, 0.15],
        detail:
          'Sin pistas sociales previas, los primates eligen significativamente la caliza más blanda como yunque: cede ligeramente bajo el impacto y estabiliza el fruto.',
        evidence: 'Modelo 1a (n = 152): E_dura = −0,64 ± 0,24; χ²(4) = 15,03.',
        glossaryTermIds: ['percusion-bipolar-yunque', 'arqueologia-primates'],
      },
      {
        id: 'hs-t1-arenisca',
        arCode: 'ETO-02',
        shortLabel: 'Arenisca dura (percutor)',
        title: 'Arenisca litificada dura (percutor)',
        subtitle: 'Dureza Equotip 57,09 ± 8,39 · p = 0,001',
        accent: '#b43c0b',
        position: [2.1, 0.72, -0.15],
        detail:
          'Para percutir seleccionan la arenisca 2,1 veces más dura: maximiza la transferencia de energía cinética sin astillarse fácilmente.',
        evidence: 'Modelo 1b (n = 152): E_dura = +0,82 ± 0,32; p = 0,004.',
        glossaryTermIds: ['percusion-bipolar-yunque', 'etologia-comparada'],
      },
    ],
  },
  'task-2': {
    taskId: 'task-2',
    hasShellsZone: true,
    shellsCenter: [1.85, 0, 0.05],
    stones: [
      {
        id: 't2-a1',
        material: 'limestone',
        modified: false,
        label: 'Caliza intacta',
        position: [-2.35, 0, 0.12],
        rotationY: 0.08,
        zone: 'unused',
      },
      {
        id: 't2-a2',
        material: 'sandstone',
        modified: false,
        label: 'Arenisca intacta',
        position: [-1.15, 0, -0.12],
        rotationY: -0.14,
        zone: 'unused',
      },
      {
        id: 't2-b1',
        material: 'limestone',
        modified: true,
        label: 'Caliza marcada',
        position: [1.15, 0, 0.18],
        rotationY: 0.15,
        zone: 'used',
        roleHighlight: 'social-winner',
      },
      {
        id: 't2-b2',
        material: 'sandstone',
        modified: true,
        label: 'Arenisca marcada',
        position: [2.35, 0, -0.14],
        rotationY: -0.12,
        zone: 'used',
        roleHighlight: 'hammer',
      },
    ],
    flowArcs: [
      {
        id: 't2-arc-attract',
        from: [-1.75, 0.52, 0],
        to: [1.75, 0.52, 0],
        color: '#b43c0b',
        label: 'Atracción al sitio usado (p < 0,001)',
      },
    ],
    hotspots: [
      {
        id: 'hs-t2-intacto',
        arCode: 'ETO-03',
        shortLabel: 'Estación A · Intacta',
        title: 'Estación A · Enclave intacto',
        subtitle: 'Sin huellas ni cáscaras · Evitado',
        accent: '#1f5fa8',
        position: [-1.75, 0.72, 0],
        detail:
          'Aunque ofrece exactamente las mismas dos rocas de 6 × 6 × 4 cm, carece de señales de actividad previa y es elegida con mucha menor frecuencia.',
        evidence: 'Modelo 2a (n = 221): E_intacto = −1,86 ± 0,40; p < 0,001.',
        glossaryTermIds: ['facilitacion-local', 'pistas-sociales-indirectas'],
      },
      {
        id: 'hs-t2-usado',
        arCode: 'ETO-04',
        shortLabel: 'Estación B · Sitio usado',
        title: 'Estación B · Sitio usado (local enhancement)',
        subtitle: 'Marcas de golpeo + cáscaras partidas',
        accent: '#b43c0b',
        position: [1.75, 0.76, 0.05],
        detail:
          'Los restos visibles de frutos partidos y las concavidades de percusión actúan como balizas sociales que concentran la actividad y generan palimpsestos duraderos.',
        evidence: 'Dentro del sitio mantienen caliza como yunque (p = 0,001) y arenisca como percutor (p = 0,022).',
        glossaryTermIds: ['facilitacion-local', 'lugares-persistentes', 'cuarta-dimension-herramientas'],
      },
    ],
  },
  'task-3': {
    taskId: 'task-3',
    hasShellsZone: false,
    shellsCenter: [0, 0, 0],
    stones: [
      {
        id: 't3-s1',
        material: 'limestone',
        modified: false,
        label: 'Caliza intacta',
        position: [-2.1, 0, 0.16],
        rotationY: 0.1,
        zone: 'main',
      },
      {
        id: 't3-s2',
        material: 'limestone',
        modified: true,
        label: 'Caliza marcada',
        position: [-0.7, 0, -0.18],
        rotationY: -0.12,
        zone: 'main',
        roleHighlight: 'social-winner',
      },
      {
        id: 't3-s3',
        material: 'sandstone',
        modified: false,
        label: 'Arenisca intacta',
        position: [0.7, 0, 0.16],
        rotationY: 0.18,
        zone: 'main',
      },
      {
        id: 't3-s4',
        material: 'sandstone',
        modified: true,
        label: 'Arenisca marcada',
        position: [2.1, 0, -0.16],
        rotationY: -0.08,
        zone: 'main',
        roleHighlight: 'social-winner',
      },
    ],
    flowArcs: [
      {
        id: 't3-arc-override',
        from: [-0.7, 0.55, -0.18],
        to: [2.1, 0.55, -0.16],
        color: '#b43c0b',
        label: 'Pistas sociales anulan dureza en yunques (p = 0,003)',
      },
    ],
    hotspots: [
      {
        id: 'hs-t3-caliza-mod',
        arCode: 'ETO-05',
        shortLabel: 'Caliza con hoyuelo',
        title: 'Caliza con hoyuelo de percusión',
        subtitle: 'Pista social positiva · Yunque preferido',
        accent: '#b43c0b',
        position: [-0.7, 0.74, -0.18],
        detail:
          'Al competir rocas intactas y marcadas de ambas durezas, la huella visual de uso previo guía la elección de yunque.',
        evidence: 'Modelo 3a (n = 73): E_modif = +1,08 ± 0,30; p = 0,003.',
        glossaryTermIds: ['pistas-sociales-indirectas', 'emulacion-aprendizaje'],
      },
      {
        id: 'hs-t3-arenisca-mod',
        arCode: 'ETO-06',
        shortLabel: 'Arenisca marcada',
        title: 'Arenisca marcada · La pista social vence a la física',
        subtitle: 'Dureza deja de ser significativa (p = 0,255 n.s.)',
        accent: '#7d4ca5',
        position: [2.1, 0.74, -0.16],
        detail:
          'Incluso una arenisca dura —mecánicamente menos blanda como yunque— es seleccionada por encima de una caliza intacta cuando exhibe marcas de golpeo previas.',
        evidence: 'Prueba empírica de que la información social indirecta puede superar a la materia prima.',
        glossaryTermIds: ['pistas-sociales-indirectas', 'conformidad-cultural', 'cuarta-dimension-herramientas'],
      },
    ],
  },
};

/* ============================================================================
 * BIOMECHANICS 3D DATA (TEMA 04: MONOS BÍPEDOS Y NACIDOS PARA CORRER)
 * ============================================================================ */

export type BiomechanicsModeId =
  | 'australopithecus'
  | 'homo'
  | 'comparativa'
  | 'vista-comparativa';

export interface BiomechanicsProfileSpec {
  id: 'australopithecus' | 'homo' | 'primate';
  name: string;
  chronology: string;
  habitat: string;
  accentHex: string;
  summary: string;
  metrics: Array<{ label: string; value: string }>;
}

export const BIOMECHANICS_PROFILES: Record<
  'australopithecus' | 'homo' | 'primate',
  BiomechanicsProfileSpec
> = {
  australopithecus: {
    id: 'australopithecus',
    name: 'Bipedismo temprano (Australopithecus afarensis)',
    chronology: '~3,6–3,2 Ma · Laetoli y Hadar',
    habitat: 'Bosques galería y mosaicos arbolados',
    accentHex: '#156f55',
    summary:
      'Bipedismo habitual consolidado (A. afarensis, ya con hallux alineado en Laetoli, a diferencia del hallux oponible de Ardipithecus ramidus ~4,4 Ma), pelvis baja y ancha y fémur en valgo, pero conservando estatura reducida, antebrazos largos y menor elasticidad tendinosa.',
    metrics: [
      { label: 'Estatura estimada', value: '1,05–1,35 m' },
      { label: 'Ángulo bicondilar (valgo)', value: '9°–11°' },
      { label: 'Ligamento nucal / Aquiles', value: 'Rudimentario / corto' },
    ],
  },
  homo: {
    id: 'homo',
    name: 'Carrera de resistencia (Homo erectus / sapiens)',
    chronology: '~2,0 Ma – presente · Nariokotome y África Oriental',
    habitat: 'Sabanas abiertas y paisajes estacionales cálidos',
    accentHex: '#b43c0b',
    summary:
      'Segunda revolución locomotora («Nacidos para correr», Bramble y Lieberman, 2004): piernas largas, hombros bajos con movilidad torácica que contrarresta la torsión, ligamento nucal, cintura estrecha, glúteo mayor hipertrofiado, tendón de Aquiles elástico y arco plantar resiliente.',
    metrics: [
      { label: 'Estatura estimada', value: '1,65–1,85 m' },
      { label: 'Almacenamiento elástico', value: 'Aquiles + arco plantar' },
      { label: 'Termorregulación', value: 'Sudoración ecrina masiva' },
    ],
  },
  primate: {
    id: 'primate',
    name: 'Primate no humano (Pan troglodytes · referencia comparada)',
    chronology: 'Actual · África ecuatorial (bosques y sabanas arboladas)',
    habitat: 'Locomoción cuadrúpeda (nudillos), trepa arborícola y bipedismo facultativo',
    accentHex: '#1f5fa8',
    summary:
      'En desplazamiento bípedo, el chimpancé presenta iliones altos y planos, ausencia de lordosis lumbar (columna en C atrapada entre las palas ilíacas), inclinación anterior del tronco (~24°), postura con cadera y rodilla flexionadas y coste energético ~75 % superior al humano (Sockol et al., 2007).',
    metrics: [
      { label: 'Pelvis / Ilion', value: 'Alto, estrecho y plano' },
      { label: 'Columna lumbar', value: 'En C · sin lordosis móvil' },
      { label: 'Coste locomotor bípedo', value: '~4× vs. Homo sapiens' },
    ],
  },
};

export interface RunningCyclePhaseSpec {
  id: 'strike' | 'midstance' | 'toeoff' | 'flight';
  label: string;
  rangeLabel: string;
  biomechanicalNote: string;
}

export const RUNNING_CYCLE_PHASES: RunningCyclePhaseSpec[] = [
  {
    id: 'strike',
    label: 'Contacto inicial e impacto',
    rangeLabel: '0–22 % del ciclo',
    biomechanicalNote:
      'Al impactar el pie, la inclinación anterior del tronco de Pan troglodytes dispara la cizalla en la unión toracolumbar y sacroilíaca; en Homo sapiens, el glúteo mayor y la lordosis lumbar amortiguan el choque.',
  },
  {
    id: 'midstance',
    label: 'Apoyo medio (carga máxima)',
    rangeLabel: '22–46 % del ciclo',
    biomechanicalNote:
      'Máxima carga vertical sobre una sola pierna: la pelvis plana de Pan sufre fuerte basculación lateral y sobrecarga coxofemoral, mientras los iliones en cuenca de Homo estabilizan la cadera con mínima oscilación.',
  },
  {
    id: 'toeoff',
    label: 'Despegue e impulso',
    rangeLabel: '46–68 % del ciclo',
    biomechanicalNote:
      'Homo sapiens devuelve energía elástica desde el tendón de Aquiles y el arco plantar con la columna erguida; Pan depende de tracción muscular intensa con rodilla y cadera flexionadas.',
  },
  {
    id: 'flight',
    label: 'Fase aérea y contrarrotación',
    rangeLabel: '68–100 % del ciclo',
    biomechanicalNote:
      'Descarga transitoria de la pelvis: la cintura móvil de Homo permite que tórax y brazos contrarroten respecto a la pelvis; en Pan los iliones altos bloquean la región lumbar y el tronco rota en bloque.',
  },
];

export const BIOMECHANICS_3D_CAMERAS: CameraPreset3D[] = [
  { id: 'full', label: 'Cuerpo completo', position: [2.55, 2.02, 5.55], target: [0, 1.48, 0] },
  { id: 'pelvis', label: 'Pelvis y columna', position: [1.7, 1.82, 2.7], target: [0, 1.56, 0] },
  { id: 'sagittal', label: 'Perfil sagital', position: [4.25, 1.66, 0.35], target: [0, 1.46, 0] },
  { id: 'foot', label: 'Pie y Aquiles', position: [1.65, 0.62, 2.3], target: [0, 0.38, 0] },
  { id: 'head', label: 'Cráneo y nuca', position: [1.65, 2.68, 2.45], target: [0, 2.52, 0] },
];

export const BIOMECHANICS_HOTSPOTS: Hotspot3DInfo[] = [
  {
    id: 'bio-nuchal',
    arCode: 'BIO-01',
    shortLabel: 'Foramen magnum y nuca',
    title: 'Foramen magnum y ligamento nucal',
    subtitle: 'Estabilización cefálica en marcha y carrera',
    accent: '#e06636',
    position: [0.02, 2.78, -0.18],
    detail:
      'El desplazamiento anterior del foramen magnum equilibra el cráneo sobre la columna ya en homininos tempranos; en Homo, la inserción del ligamento nucal frena el cabeceo al correr.',
    evidence: 'Presente como cresta nucal marcada desde Homo erectus (~1,8 Ma); ausente en chimpancés y Australopithecus.',
    glossaryTermIds: ['foramen-magnum-ligamento-nucal', 'bipedismo-carrera-resistencia'],
  },
  {
    id: 'bio-lumbar',
    arCode: 'BIO-02',
    shortLabel: 'Columna en S (lordosis)',
    title: 'Columna vertebral en S (lordosis lumbar)',
    subtitle: 'Alineación del tronco sobre las caderas',
    accent: '#5ca3f5',
    position: [0.0, 2.02, -0.08],
    detail:
      'La curvatura lumbar sitúa el centro de masas directamente sobre la pelvis y absorbe las cargas compresivas verticales durante cada apoyo bípedo.',
    evidence: 'Documentada en vértebras lumbares de Australopithecus africanus (Sts 14) y A. sediba.',
    glossaryTermIds: ['lordosis-lumbar', 'hominino-hominoideo'],
  },
  {
    id: 'bio-pelvis',
    arCode: 'BIO-03',
    shortLabel: 'Pelvis en cuenca y glúteo',
    title: 'Pelvis en cuenca y glúteo mayor',
    subtitle: 'Estabilidad lateral y freno del tronco al correr',
    accent: '#e06636',
    position: [0.34, 1.62, -0.05],
    detail:
      'Los iliones cortos y curvados hacia delante convierten a los glúteos medios en estabilizadores de la cadera en apoyo monopodal; en Homo, el glúteo mayor se hipertrofia para frenar el torso durante la carrera.',
    evidence: 'Pelvis de A.L. 288-1 («Lucy», ~3,2 Ma) frente a la pelvis estrecha y alta de Nariokotome (~1,53 Ma).',
    glossaryTermIds: ['pelvis-en-cuenca', 'bipedismo-carrera-resistencia'],
  },
  {
    id: 'bio-valgus',
    arCode: 'BIO-04',
    shortLabel: 'Fémur valgo (bicondilar)',
    title: 'Fémur en ángulo bicondilar (valgo)',
    subtitle: 'Rodillas alineadas bajo el centro de gravedad',
    accent: '#2ea880',
    position: [0.18, 1.04, 0.08],
    detail:
      'A diferencia del fémur recto de los grandes simios, el fémur hominino converge hacia la línea media para que el pie apoye justo debajo del centro de masas sin balanceo lateral excesivo.',
    evidence: 'Presente en A. afarensis (Hadar) y perfeccionado con diáfisis largas en Homo erectus.',
    glossaryTermIds: ['angulo-valgo-femur', 'hominizacion-humanizacion'],
  },
  {
    id: 'bio-achilles',
    arCode: 'BIO-05',
    shortLabel: 'Tendón de Aquiles',
    title: 'Tendón de Aquiles elástico',
    subtitle: 'Muelle energético de la carrera de resistencia',
    accent: '#e06636',
    position: [0.16, 0.42, -0.17],
    detail:
      'Actúa como un resorte pasivo que almacena energía elástica al impactar el talón y la devuelve en el despegue, reduciendo hasta en ~35 % el coste metabólico de correr largas distancias.',
    evidence: 'Bramble y Lieberman (2004), Nature: rasgo clave ausente en grandes simios arborícolas.',
    glossaryTermIds: ['tendon-aquiles-arco-plantar', 'bipedismo-carrera-resistencia'],
  },
  {
    id: 'bio-arch',
    arCode: 'BIO-06',
    shortLabel: 'Arco plantar y hallux',
    title: 'Arco plantar y hallux alineado',
    subtitle: 'Palanca rígida y amortiguación (Laetoli → Homo)',
    accent: '#2ea880',
    position: [0.18, 0.1, 0.14],
    detail:
      'El dedo gordo alineado (no oponible) transforma el pie en una palanca propulsora, mientras el arco longitudinal elástico amortigua el impacto y devuelve energía en cada zancada.',
    evidence: 'Icnitas volcánicas de Laetoli (~3,66 Ma, Tanzania) y huella anatómica moderna en Homo.',
    glossaryTermIds: ['tendon-aquiles-arco-plantar', 'hominino-hominoideo'],
  },
];
