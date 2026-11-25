export interface EthologyStat {
  label: string;
  value: string;
  delta: string;
  accent?: 'ochre' | 'lapis' | 'forest' | 'ink';
}

export interface ExperimentalStoneSpec {
  id: string;
  material: 'limestone' | 'sandstone';
  modified: boolean;
  label: string;
  x: number;
  y: number;
}

export interface ExperimentalZoneSpec {
  title: string;
  subtitle: string;
  hasShells: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  stones: ExperimentalStoneSpec[];
}

export interface GlmmOutcomeMetric {
  role: 'Yunque (Anvil)' | 'Percutor (Hammer)' | 'Selección de sitio';
  winner: string;
  estimate: string;
  pValue: string;
  modelStats: string;
  significant: boolean;
  /** Visual preference strength (-100 soft/unmodified to +100 hard/modified) */
  barDirection: 'left' | 'right' | 'neutral';
  barMagnitude: number;
  leftLabel: string;
  rightLabel: string;
}

export interface HenkeTaskSpec {
  id: 'task-1' | 'task-2' | 'task-3';
  shortLabel: string;
  title: string;
  question: string;
  sampleSummary: string;
  setupDescription: string;
  keyFinding: string;
  evolutionaryImplication: string;
  zones: ExperimentalZoneSpec[];
  metrics: GlmmOutcomeMetric[];
}

export interface PrimateTradition {
  id: string;
  species: string;
  commonName: string;
  group: 'africa' | 'convergencia';
  region: string;
  fieldSites: string;
  rawMaterials: string;
  behavioralTradition: string;
  socialTransmission: string;
  archaeologicalTrace: string;
  keyReference: string;
}

export interface SocialMechanism {
  id: string;
  name: string;
  englishTerm: string;
  timescale: string;
  summary: string;
  example: string;
  archaeologicalVisibility: string;
}

export interface OldowanBridgeCase {
  id: string;
  site: string;
  country: string;
  ageMa: string;
  industry: string;
  lithicSignature: string;
  ethologicalParallel: string;
  criticalLimit: string;
}

export const HENKE_2026_META = {
  authors:
    'Johanna Henke-von der Malsburg, Jonathan S. Reeves, Tomos Proffitt, Tiago Falótico, Henrique Rufo y Lydia V. Luncz',
  year: 2026,
  title: 'Social cues on stone tools outweigh raw material properties in wild primates',
  journal: 'Proceedings of the Royal Society B, 293: 20260416',
  doi: 'https://doi.org/10.1098/rspb.2026.0416',
  institution:
    'Technological Primates Research Group (Max-Planck-Institute for Evolutionary Anthropology) · FBN · Universidade do Algarve · GWU · NPRG · USP',
  totalTrials: 501,
  excludedExternalTrials: 82,
  totalIndividuals: 27,
  stoneDimensions: '6 × 6 × 4 cm (cuboides estandarizados)',
  limestoneHardness: '27,05 ± 11,28',
  limestoneN: 69,
  sandstoneHardness: '57,09 ± 8,39',
  sandstoneN: 37,
  populations: [
    {
      code: 'SCNP',
      name: 'Parque Nacional Serra da Capivara (Brasil)',
      context: 'Silvestres · Sapajus libidinosus',
      individuals: '12 individuos (6 machos, 6 hembras)',
      trials: '304 ensayos (T1: 117 · T2: 122 · T3: 65)',
      naturalTools:
        'Percutores de cuarcita natural (dureza 69,79 ± 6,96) y yunques de roca sedimentaria (29,35 ± 6,30) sobre anacardos.',
      performance:
        'Mayor probabilidad de éxito (E = 1,54 ± 0,43; p < 0,001); en los ensayos exitosos no hubo diferencias significativas en latencia (p = 0,826) ni en número de golpes (p = 0,525).',
    },
    {
      code: 'PET',
      name: 'Parque Ecológico do Tietê (Brasil)',
      context: 'Semisilvestres / aprovisionados · S. libidinosus y S. nigritus',
      individuals: '15 individuos (7 machos, 8 hembras)',
      trials: '197 ensayos (T1: 82 · T2: 105 · T3: 10)',
      naturalTools:
        'Percutores de hormigón, granito o arenisca ferruginosa (37,67 ± 0,47) y yunques de hormigón (32,16 ± 6,56) sobre frutos de palma Syagrus.',
      performance:
        'Menor éxito inicial, pero con curva de aprendizaje compartida entre poblaciones a lo largo de los ensayos (E = 0,51 ± 0,17; p = 0,005).',
    },
  ],
};

export const ETHOLOGY_STATS: EthologyStat[] = [
  {
    label: 'Ensayos líticos (2026)',
    value: '501',
    delta: 'Pistas sociales en yunques: p = 0,003 (SCNP + PET)',
    accent: 'ochre',
  },
  {
    label: 'Repertorio gestual Pan',
    value: '>66 gestos',
    delta: '~90 % compartido entre chimpancés y bonobos',
    accent: 'lapis',
  },
  {
    label: 'Variantes culturales africanas',
    value: '39+',
    delta: 'Whiten et al.: útiles vegetales, caza y automedicación',
    accent: 'forest',
  },
  {
    label: 'Modelos sociales africanos',
    value: '5 especies',
    delta: 'Selva, bosque montano, sabana y puente 3,3–2,0 Ma',
    accent: 'ink',
  },
];

export const HENKE_2026_TASKS: HenkeTaskSpec[] = [
  {
    id: 'task-1',
    shortLabel: 'Tarea 1 · Materia prima',
    title: 'Selección mecánica sin pistas sociales previas',
    question:
      'Cuando todas las piedras son idénticas en tamaño (6 × 6 × 4 cm) y no existen huellas de uso previo, ¿discriminan los primates la dureza de la roca según su función?',
    sampleSummary: '199 ensayos registrados (SCNP: 117 · PET: 82) → n = 152 ensayos válidos en modelo',
    setupDescription:
      'Se disponen cuatro cuboides intactos sin marcas de percusión ni cáscaras alrededor: dos de caliza fosilífera blanda (dureza de rebote 27,05 ± 11,28) y dos de arenisca litificada dura (57,09 ± 8,39). El primate debe seleccionar libremente un yunque y un percutor para partir el fruto.',
    keyFinding:
      'Discriminación funcional clara: eligen caliza blanda como yunque (se deforma con facilidad y estabiliza el fruto en pequeñas concavidades) y arenisca dura como percutor (transmite mayor energía de impacto sin fracturarse).',
    evolutionaryImplication:
      'Demuestra que, en ausencia de tradición visual acumulada, los primates evalúan propiedades físico-mecánicas de la materia prima mediante exploración táctil y experiencia previa, de forma análoga a la selectividad lítica documentada en el Olduvayense africano.',
    zones: [
      {
        title: 'Estación experimental única (sin pistas sociales)',
        subtitle: '4 cuboides sin usar (2 calizas blandas + 2 areniscas duras) · Sin cáscaras',
        hasShells: false,
        x: 60,
        y: 36,
        width: 560,
        height: 188,
        stones: [
          { id: 't1-s1', material: 'limestone', modified: false, label: 'Caliza intacta', x: 150, y: 122 },
          { id: 't1-s2', material: 'sandstone', modified: false, label: 'Arenisca intacta', x: 275, y: 122 },
          { id: 't1-s3', material: 'limestone', modified: false, label: 'Caliza intacta', x: 405, y: 122 },
          { id: 't1-s4', material: 'sandstone', modified: false, label: 'Arenisca intacta', x: 530, y: 122 },
        ],
      },
    ],
    metrics: [
      {
        role: 'Yunque (Anvil)',
        winner: 'Caliza blanda (27,05)',
        estimate: 'E_dura = −0,64 ± 0,24',
        pValue: 'p = 0,002',
        modelStats: 'Modelo 1a · χ²(4) = 15,03 · p = 0,022 · R² = 0,04',
        significant: true,
        barDirection: 'left',
        barMagnitude: 68,
        leftLabel: 'Caliza blanda',
        rightLabel: 'Arenisca dura',
      },
      {
        role: 'Percutor (Hammer)',
        winner: 'Arenisca dura (57,09)',
        estimate: 'E_dura = +0,82 ± 0,32',
        pValue: 'p = 0,001',
        modelStats: 'Modelo 1b · χ²(4) = 1,56 · p = 0,004 · R² = 0,02',
        significant: true,
        barDirection: 'right',
        barMagnitude: 78,
        leftLabel: 'Caliza blanda',
        rightLabel: 'Arenisca dura',
      },
    ],
  },
  {
    id: 'task-2',
    shortLabel: 'Tarea 2 · Sitio usado',
    title: 'Atracción por lugares de actividad previa (local enhancement)',
    question:
      'Si se ofrece elegir entre un enclave intacto y un puesto con huellas visibles de uso anterior (marcas de percusión y cáscaras rotas), ¿qué factor guía la decisión espacial?',
    sampleSummary: 'n = 221 ensayos de elección de sitio · n = 189 de selección de útil',
    setupDescription:
      'Dos estaciones separadas: un sitio sin usar (1 caliza blanda + 1 arenisca dura intactas) frente a un sitio previamente usado (1 caliza blanda + 1 arenisca dura con marcas de golpeo y cáscaras partidas dispersas en el suelo).',
    keyFinding:
      'Fuerte preferencia por el sitio usado previamente (E_no_modificado = −1,86 ± 0,40; p < 0,001), confirmando la facilitación local. Además, dentro del sitio elegido mantuvieron la preferencia funcional: caliza blanda como yunque (p = 0,001) y arenisca dura como percutor (p = 0,022).',
    evolutionaryImplication:
      'Explica cómo los residuos duraderos en el suelo (rocas picoteadas y desechos alimenticios) funcionan como balizas sociales que concentran la actividad tecnológica en los mismos puntos del paisaje durante generaciones, formando palimpsestos arqueológicos.',
    zones: [
      {
        title: 'Sitio A · Intacto',
        subtitle: 'Piedras sin marcas · Suelo limpio',
        hasShells: false,
        x: 34,
        y: 36,
        width: 286,
        height: 188,
        stones: [
          { id: 't2-a1', material: 'limestone', modified: false, label: 'Caliza intacta', x: 112, y: 126 },
          { id: 't2-a2', material: 'sandstone', modified: false, label: 'Arenisca intacta', x: 242, y: 126 },
        ],
      },
      {
        title: 'Sitio B · Usado previamente',
        subtitle: 'Marcas de percusión + cáscaras rotas',
        hasShells: true,
        x: 360,
        y: 36,
        width: 286,
        height: 188,
        stones: [
          { id: 't2-b1', material: 'limestone', modified: true, label: 'Caliza marcada', x: 438, y: 126 },
          { id: 't2-b2', material: 'sandstone', modified: true, label: 'Arenisca marcada', x: 568, y: 126 },
        ],
      },
    ],
    metrics: [
      {
        role: 'Selección de sitio',
        winner: 'Sitio usado (pistas visuales)',
        estimate: 'E_intacto = −1,86 ± 0,40',
        pValue: 'p < 0,001',
        modelStats: 'Modelo 2a · χ²(4) = 14,19 · p = 0,007 · R² = 0,05',
        significant: true,
        barDirection: 'right',
        barMagnitude: 92,
        leftLabel: 'Sitio intacto',
        rightLabel: 'Sitio usado',
      },
      {
        role: 'Yunque (Anvil)',
        winner: 'Caliza blanda marcada',
        estimate: 'E_dura = −0,91 ± 0,20',
        pValue: 'p = 0,001',
        modelStats: 'Modelo 2b · preferencia simultánea por caliza y uso previo',
        significant: true,
        barDirection: 'left',
        barMagnitude: 80,
        leftLabel: 'Caliza blanda',
        rightLabel: 'Arenisca dura',
      },
      {
        role: 'Percutor (Hammer)',
        winner: 'Arenisca dura marcada',
        estimate: 'E_dura = +0,68 ± 0,34',
        pValue: 'p = 0,022',
        modelStats: 'Modelo 2c · mantiene selección mecánica de percutor',
        significant: true,
        barDirection: 'right',
        barMagnitude: 66,
        leftLabel: 'Caliza blanda',
        rightLabel: 'Arenisca dura',
      },
    ],
  },
  {
    id: 'task-3',
    shortLabel: 'Tarea 3 · Pistas vs. roca',
    title: 'Las pistas sociales superan a las propiedades de la materia prima',
    question:
      'Cuando compiten directamente en el mismo sitio rocas blandas y duras —unas intactas y otras con huellas de uso previo—, ¿prima la física de la piedra o la señal social grabada en ella?',
    sampleSummary: '75 ensayos registrados (SCNP: 65 · PET: 10) → n = 73 ensayos válidos en modelo',
    setupDescription:
      'En una sola estación se colocan cuatro cuboides: 1 caliza intacta, 1 caliza con marcas de percusión, 1 arenisca intacta y 1 arenisca con marcas de percusión. Ambas litologías portan huellas visibles de uso por congéneres.',
    keyFinding:
      'En la selección de yunques, la señal de uso previo domina por completo (E_modificada = +1,08 ± 0,30; p = 0,003), mientras la preferencia por la dureza desaparece (E_dura = −0,37 ± 0,35; p = 0,255). En los percutores no se observó preferencia estadísticamente significativa ni por dureza (p = 0,247) ni por modificación (p = 0,112).',
    evolutionaryImplication:
      'Cuestiona las lecturas estrictamente utilitarias del registro lítico antiguo: la reutilización de rocas subóptimas con trazas de golpeo puede responder a información social indirecta y no a ignorancia tecnológica ni a escasez geológica.',
    zones: [
      {
        title: 'Estación de competencia directa (roca × pista social)',
        subtitle: '2 intactas frente a 2 con huellas de percusión previa en ambas litologías',
        hasShells: false,
        x: 60,
        y: 36,
        width: 560,
        height: 188,
        stones: [
          { id: 't3-s1', material: 'limestone', modified: false, label: 'Caliza intacta', x: 150, y: 122 },
          { id: 't3-s2', material: 'limestone', modified: true, label: 'Caliza marcada', x: 275, y: 122 },
          { id: 't3-s3', material: 'sandstone', modified: false, label: 'Arenisca intacta', x: 405, y: 122 },
          { id: 't3-s4', material: 'sandstone', modified: true, label: 'Arenisca marcada', x: 530, y: 122 },
        ],
      },
    ],
    metrics: [
      {
        role: 'Yunque (Anvil)',
        winner: 'Roca marcada (pista social)',
        estimate: 'E_modif = +1,08 ± 0,30',
        pValue: 'p = 0,003',
        modelStats: 'Modelo 3a · χ²(5) = 5,00 · p = 0,004 · R² = 0,07 (dureza p = 0,255 n.s.)',
        significant: true,
        barDirection: 'right',
        barMagnitude: 86,
        leftLabel: 'Roca intacta',
        rightLabel: 'Con huellas de uso',
      },
      {
        role: 'Percutor (Hammer)',
        winner: 'Sin sesgo concluyente',
        estimate: 'E_modif = −0,65 · E_dura = +0,50',
        pValue: 'p = 0,112 / 0,247',
        modelStats: 'Modelo 3b · χ²(5) = 2,63 · p = 0,107 (no significativo)',
        significant: false,
        barDirection: 'neutral',
        barMagnitude: 28,
        leftLabel: 'Intacta / blanda',
        rightLabel: 'Marcada / dura',
      },
    ],
  },
];

export const PRIMATE_TRADITIONS: PrimateTradition[] = [
  {
    id: 'pan-verus',
    species: 'Pan troglodytes verus',
    commonName: 'Chimpancé occidental',
    group: 'africa',
    region: 'África Occidental (Bosques guineanos)',
    fieldSites: 'Parque Nacional de Taï (Costa de Marfil) y Bossou (Guinea)',
    rawMaterials: 'Percutores de granito, cuarcita y madera dura; yunques radiculares y pétreos.',
    behavioralTradition:
      'Cascanueces complejo sobre Coula edulis, Panda oleosa y Elaeis guineensis con selección específica de masa y dureza según la cáscara. Las hembras inmigrantes en Taï adoptan la materia prima preferida de su nuevo grupo incluso cuando disponen de rocas más eficaces.',
    socialTransmission:
      'Conformidad cultural entre comunidades vecinas y facilitación local en los talleres de cascanueces frecuentados durante décadas.',
    archaeologicalTrace:
      'Acumulaciones estratificadas de fragmentos líticos fracturados, yunques con hoyuelos de percusión y cáscaras carbonizadas datadas hasta ~4.300 años BP en Panda 100 (Taï).',
    keyReference: 'Boesch y Boesch (1983); Mercader et al. (2007); Luncz et al. (2012, 2016); Luncz y Boesch (2014).',
  },
  {
    id: 'pan-schweinfurthii',
    species: 'Pan troglodytes schweinfurthii',
    commonName: 'Chimpancé oriental',
    group: 'africa',
    region: 'África Oriental (Valle del Rift y bosques ribereños)',
    fieldSites: 'Gombe y Mahale (Tanzania), Kibale y Budongo (Uganda)',
    rawMaterials: 'Tallos flexibles, ramas deshojadas, esponjas vegetales y pértigas.',
    behavioralTradition:
      'Ausencia de cascanueces lítico pese a la disponibilidad local de frutos y piedras; en cambio, muestran cadenas operativas vegetales de múltiples pasos (pesca de termitas con sondas modificadas, extracción de miel, caza cooperativa de colobos).',
    socialTransmission:
      'Aprendizaje observacional prolongado de crías junto a sus madres y divergencia de repertorios culturales entre comunidades adyacentes.',
    archaeologicalTrace:
      'Baja preservación directa de herramientas orgánicas; subraya el sesgo tafonómico que invisibiliza la tecnología vegetal en el Plio-Pleistoceno africano.',
    keyReference: 'Goodall (1986); Whiten et al. (1999); Sanz y Morgan (2013).',
  },
  {
    id: 'pan-paniscus',
    species: 'Pan paniscus',
    commonName: 'Bonobo',
    group: 'africa',
    region: 'África Central (Cuenca del Congo, al sur del río Congo)',
    fieldSites: 'Wamba y LuiKotale (República Democrática del Congo)',
    rawMaterials: 'Ramas de señalización, hojas-paraguas y soportes vegetales en hábitats forestales.',
    behavioralTradition:
      'Menor dependencia del uso extractivo de herramientas líticas en libertad, compensada por una arquitectura socioecológica de alta tolerancia alimentaria, coaliciones femeninas y cooperación intergrupal poco habitual entre hominoideos.',
    socialTransmission:
      'Cohesión social, reparto de alimentos y aprendizaje en contextos de baja agresión que amplían la ventana de transmisión social.',
    archaeologicalTrace:
      'Modelo crítico para evitar proyectar un único arquetipo conductual de chimpancé común sobre el último ancestro común (LCA) de humanos y paninos (~7–6 Ma).',
    keyReference: 'Kano (1992); Hohmann y Fruth (2003); Surbeck et al. (2025).',
  },
  {
    id: 'gorilla',
    species: 'Gorilla gorilla y Gorilla beringei',
    commonName: 'Gorila occidental y oriental',
    group: 'africa',
    region: 'África Central y Montes Virunga',
    fieldSites: 'Mbeli Bai (República del Congo), Bwindi (Uganda), Karisoke (Ruanda)',
    rawMaterials: 'Bastones de sondeo en humedales, ramas estabilizadoras y procesamiento manual complejo.',
    behavioralTradition:
      'Procesamiento manual jerárquico y bimanual de plantas fibrosas o urticantes sin herramientas de piedra, combinado con uso puntual de pértigas para medir profundidad del agua o apoyar la postura en pantanos.',
    socialTransmission:
      'Forrajeo gregario en grupos estables donde juveniles adquieren secuencias motoras complejas por observación cercana.',
    archaeologicalTrace:
      'Muestra que la cognición técnica compleja y la manipulación bimanual fina preceden y desbordan la talla lítica conservada en el registro fósil.',
    keyReference: 'Byrne y Byrne (1993); Breuer et al. (2005).',
  },
  {
    id: 'sapajus-libidinosus',
    species: 'Sapajus libidinosus',
    commonName: 'Capuchino barbudo (modelo convergente)',
    group: 'convergencia',
    region: 'Neotrópico (Caatinga y Cerrado de Brasil)',
    fieldSites: 'Serra da Capivara (SCNP), Fazenda Boa Vista y Parque Ecológico do Tietê (PET)',
    rawMaterials: 'Cantos de cuarcita, arenisca dura y bloques sedimentarios o calizos.',
    behavioralTradition:
      'Uso habitual de percutores y yunques líticos para partir anacardos y frutos de palma, excavación con piedras y percusión piedra-contra-piedra que genera lascas con aristas cortantes de forma no intencional.',
    socialTransmission:
      'Facilitación local y de estímulo: las marcas de golpeo y las cáscaras en los yunques guían la selección de herramientas incluso por encima de la dureza óptima (Henke-von der Malsburg et al., 2026).',
    archaeologicalTrace:
      'Registro arqueológico excavado de >3.000 años en Serra da Capivara con cambios diacrónicos en el tamaño de los percutores (Falótico et al., 2019) y pseudo-lascas análogas a conjuntos arcaicos.',
    keyReference:
      'Fragaszy et al. (2013); Proffitt et al. (2016); Falótico et al. (2019); Henke-von der Malsburg et al. (2026).',
  },
  {
    id: 'macaca-aurea',
    species: 'Macaca fascicularis aurea',
    commonName: 'Macaco cangrejero birmano (modelo convergente)',
    group: 'convergencia',
    region: 'Sudeste Asiático (Costas del mar de Andamán)',
    fieldSites: 'Piak Nam Yai y Parque Nacional Ao Phang-Nga (Tailandia)',
    rawMaterials: 'Cantos costeros de caliza y arenisca seleccionados por masa y morfología.',
    behavioralTradition:
      'Percusión lítica intermareal sobre ostras, gasterópodos y frutos de palma aceitera; produce accidentalmente lascas bipolares y núcleos agotados muy similares en morfometría a los conjuntos líticos más tempranos.',
    socialTransmission:
      'Variaciones locales en la selección del peso de las piedras entre grupos vecinos que explotan los mismos recursos costeros.',
    archaeologicalTrace:
      'Yacimientos costeros con acumulación de cantos fracturados y lascas de percusión bipolar usados como referencia tafonómica para evaluar conjuntos plio-pleistocenos africanos.',
    keyReference: 'Haslam et al. (2016); Luncz et al. (2017, 2019); Proffitt et al. (2023).',
  },
];

export const SOCIAL_LEARNING_MECHANISMS: SocialMechanism[] = [
  {
    id: 'local-enhancement',
    name: 'Facilitación local y de estímulo',
    englishTerm: 'Local & stimulus enhancement',
    timescale: 'Inmediata (minutos a días)',
    summary:
      'La atención de un individuo se dirige hacia un lugar concreto o hacia un objeto específico debido a la presencia de congéneres o de los rastros materiales que estos han dejado tras su actividad.',
    example:
      'En la Tarea 2 (2026), los capuchinos eligieron abrumadoramente los sitios con piedras picoteadas y cáscaras partidas frente a estaciones limpias idénticas (p < 0,001).',
    archaeologicalVisibility:
      'Muy alta: concentra la actividad en puntos recurrentes («lugares persistentes») generando densas acumulaciones líticas en el paisaje.',
  },
  {
    id: 'fourth-dimension',
    name: 'La «cuarta dimensión» de las herramientas',
    englishTerm: 'Fourth dimension of tool use (Fragaszy et al., 2013)',
    timescale: 'Intergeneracional (décadas a milenios)',
    summary:
      'Los útiles duraderos y los residuos abandonados en el paisaje construyen un nicho tecnológico persistente que transmite información social de manera asincrónica, sin necesidad de contacto directo entre maestro y aprendiz.',
    example:
      'Un yunque con hoyuelos de percusión o un taller de cascanueces en Taï y Serra da Capivara guía el aprendizaje de juveniles nacidos años después.',
    archaeologicalVisibility:
      'Directa: explica palimpsestos reutilizados durante >3.000 años en primates y posiblemente durante miles de años en el valle del Rift.',
  },
  {
    id: 'conformity',
    name: 'Conformidad cultural intergrupal',
    englishTerm: 'Cultural conformity',
    timescale: 'Biográfica (migración entre grupos)',
    summary:
      'Los individuos modifican sus hábitos técnicos para ajustarse a la norma mayoritaria del grupo receptor, incluso cuando su técnica original era igualmente eficaz o superior desde el punto de vista biomecánico.',
    example:
      'Hembras de Pan troglodytes verus que migran entre grupos del bosque de Taï cambian de percutores de piedra a madera (o viceversa) para alinearse con el grupo residente.',
    archaeologicalVisibility:
      'Moderada: puede detectarse cuando grupos contemporáneos en entornos geológicos idénticos mantienen elecciones de materia prima divergentes.',
  },
  {
    id: 'emulation',
    name: 'Emulación y aprendizaje por ensayo guiado',
    englishTerm: 'Emulation & socially scaffolded trial-and-error',
    timescale: 'Ontogenética (años de maduración)',
    summary:
      'El aprendiz reconstruye el objetivo o las propiedades mecánicas del útil observando el resultado y practicando repetidamente en un entorno enriquecido por herramientas ya seleccionadas por adultos.',
    example:
      'En el Modelo 4 (2026), tanto los capuchinos silvestres como los semisilvestres mejoraron significativamente su éxito a lo largo de los ensayos sucesivos (E = 0,51; p = 0,005).',
    archaeologicalVisibility:
      'Indirecta: se infiere mediante remontajes líticos con diferencias de pericia técnica (aprendices frente a talladores expertos) en un mismo nivel excavado.',
  },
];

export const OLDOWAN_BRIDGE_CASES: OldowanBridgeCase[] = [
  {
    id: 'lomekwi',
    site: 'Lomekwi 3 (Oeste de Turkana)',
    country: 'Kenia',
    ageMa: '~3,3 Ma',
    industry: 'Lomekwiense',
    lithicSignature:
      'Grandes bloques de basalto y fonolita tallados mediante percusión bipolar sobre yunque y golpeo pasivo sobre bloque fijo; pesados percutores con claras trazas de machacado.',
    ethologicalParallel:
      'Comparte con la percusión lítica de chimpancés y capuchinos el apoyo sobre yunques pesados y la selección de grandes bloques locales para fractura por impacto.',
    criticalLimit:
      'Presenta extracción intencional de lascas cortantes de gran formato, rasgo ausente en la cadena operativa habitual de primates no humanos.',
  },
  {
    id: 'gona',
    site: 'Gona (Afar)',
    country: 'Etiopía',
    ageMa: '~2,6–2,5 Ma',
    industry: 'Olduvayense temprano',
    lithicSignature:
      'Control preciso de ángulos de plataforma (<90°), selección preferente de traquita y riolita de grano fino en gravas fluviales para obtener filos cortantes estandarizados.',
    ethologicalParallel:
      'Confirma que la discriminación de propiedades mecánicas de la roca (dureza y fractura) existía ya en la base del comportamiento lítico hominino, ampliando capacidades observadas en Tarea 1.',
    criticalLimit:
      'La talla concoidea planificada implica coordinación bimanual asimétrica y previsión geométrica que superan la percusión nutricia primate.',
  },
  {
    id: 'lokalalei',
    site: 'Lokalalei 2C (Oeste de Turkana)',
    country: 'Kenia',
    ageMa: '~2,34 Ma',
    industry: 'Olduvayense',
    lithicSignature:
      'Remontajes excepcionales de decenas de lascas desde un mismo núcleo y selección rigurosa de lavas homogéneas frente a rocas fisuradas presentes en el mismo cauce.',
    ethologicalParallel:
      'Ilustra la interacción entre disponibilidad geológica, aprendizaje técnico sostenido y retorno a enclaves favorables con acumulaciones previas.',
    criticalLimit:
      'Las secuencias de más de 50 extracciones ordenadas sobre un solo núcleo revelan una planificación secuencial exclusiva del linaje hominino.',
  },
  {
    id: 'kanjera',
    site: 'Kanjera South (Lago Victoria)',
    country: 'Kenia',
    ageMa: '~2,0 Ma',
    industry: 'Olduvayense',
    lithicSignature:
      'Transporte selectivo de materias primas duras e isótropas (cuarcita, riolita, basalto fino) desde más de 10 km, rechazando conglomerados locales más blandos.',
    ethologicalParallel:
      'Citado directamente por Henke-von der Malsburg et al. (2026): muestra cómo los homininos evaluaban la dureza y tenacidad de la roca, pero exige considerar también si las acumulaciones previas atrajeron el regreso reiterado al sitio.',
    criticalLimit:
      'El transporte de larga distancia (>10 km) supera en varios órdenes de magnitud las distancias de transporte documentadas en chimpancés de Taï (~100–500 m).',
  },
  {
    id: 'olduvai',
    site: 'Garganta de Olduvai (Lecho I)',
    country: 'Tanzania',
    ageMa: '~1,9–1,8 Ma',
    industry: 'Olduvayense clásico',
    lithicSignature:
      'Concentraciones densas de núcleos, lascas, percutores y fauna procesada («lugares persistentes» o puntos de acumulación de materias primas en el paisaje, Potts 1984).',
    ethologicalParallel:
      'La hipótesis de la «cuarta dimensión» y la Tarea 2 (2026) aportan un mecanismo conductual concreto: las rocas ya usadas y los residuos orgánicos actúan como pistas sociales indirectas que refuerzan la reutilización del lugar.',
    criticalLimit:
      'La acumulación en Olduvai integra carnicería con filos cortantes y transporte de carcasas, introduciendo presiones de depredación y cooperación social sin equivalente directo en capuchinos.',
  },
];

export interface SimulatorDecisionInput {
  role: 'anvil' | 'hammer';
  stationAMaterial: 'limestone' | 'sandstone';
  stationACues: boolean;
  stationAShells: boolean;
  stationBMaterial: 'limestone' | 'sandstone';
  stationBCues: boolean;
  stationBShells: boolean;
}

export interface SimulatorDecisionOutput {
  winner: 'A' | 'B' | 'tie';
  scoreA: number;
  scoreB: number;
  dominantDriver: string;
  explanation: string;
  matchingTask: string;
}

/**
 * Evaluates a didactic landscape choice scenario grounded qualitatively and directionally
 * in the GLMM results of Henke-von der Malsburg et al. (2026), Proc. R. Soc. B 293: 20260416.
 */
export function evaluateLandscapeChoice(
  input: SimulatorDecisionInput
): SimulatorDecisionOutput {
  const computeScore = (
    material: 'limestone' | 'sandstone',
    cues: boolean,
    shells: boolean
  ): number => {
    let score = 50;

    // Task 2: Site-level local enhancement from broken shells + prior traces (strongest effect: E = -1.86, p < 0.001)
    if (shells) score += 26;

    if (input.role === 'anvil') {
      // Task 3: On anvils, prior percussive cues (E = +1.08, p = 0.003) outweigh raw material hardness (p = 0.255)
      if (cues) score += 28;
      // Material effect applies clearly when social cues are equal (Task 1: E_hard = -0.64, p = 0.002)
      const cuesDiffer = input.stationACues !== input.stationBCues;
      if (material === 'limestone') {
        score += cuesDiffer ? 6 : 18;
      } else {
        score -= cuesDiffer ? 4 : 12;
      }
    } else {
      // Hammerstones: Task 1 (E_hard = +0.82, p = 0.001) and Task 2 (E_hard = +0.68, p = 0.022) favor harder sandstone,
      // while Task 3 shows no significant cue override (p = 0.112).
      if (material === 'sandstone') {
        score += 18;
      } else {
        score -= 12;
      }
      if (cues) score += 6;
    }

    return Math.max(8, Math.min(96, Math.round(score)));
  };

  const scoreA = computeScore(
    input.stationAMaterial,
    input.stationACues,
    input.stationAShells
  );
  const scoreB = computeScore(
    input.stationBMaterial,
    input.stationBCues,
    input.stationBShells
  );

  const winner: 'A' | 'B' | 'tie' =
    Math.abs(scoreA - scoreB) <= 3 ? 'tie' : scoreA > scoreB ? 'A' : 'B';

  const shellsDiffer = input.stationAShells !== input.stationBShells;
  const cuesDiffer = input.stationACues !== input.stationBCues;
  const materialsDiffer = input.stationAMaterial !== input.stationBMaterial;

  let dominantDriver = 'Equilibrio de factores';
  let matchingTask = 'Comparación integrada (Modelos 1–3, 2026)';
  let explanation =
    'Ambas estaciones ofrecen señales equivalentes; el modelo predice una selección distribuida sin sesgo fuerte hacia una única piedra.';

  if (shellsDiffer) {
    dominantDriver = 'Facilitación local por sitio usado (cáscaras y contexto)';
    matchingTask = 'Paralelo directo con Tarea 2 (Modelo 2a · E = −1,86 · p < 0,001)';
    explanation =
      'La presencia de restos de cáscaras partidas señaliza un emplazamiento de actividad exitosa previa y ejerce el mayor poder de atracción espacial, dirigiendo al primate hacia esa estación antes incluso de evaluar la dureza de la roca.';
  } else if (input.role === 'anvil' && cuesDiffer && materialsDiffer) {
    dominantDriver = 'Primacía de pistas sociales sobre la materia prima';
    matchingTask = 'Paralelo directo con Tarea 3 (Modelo 3a · E_modif = +1,08 · p = 0,003)';
    explanation =
      'Para la función de yunque, las huellas visibles de percusión dejadas por congéneres anulan la preferencia natural por la caliza blanda (dureza p = 0,255 n.s.). Incluso una arenisca más dura es elegida si exhibe señales de uso previo.';
  } else if (input.role === 'anvil' && cuesDiffer) {
    dominantDriver = 'Pistas visuales de percusión en el yunque';
    matchingTask = 'Paralelo con Tareas 2 y 3 (Modelo 3a · p = 0,003)';
    explanation =
      'Con la misma litología en ambas opciones, las marcas de picoteo actúan como señal social indirecta («cuarta dimensión») que concentra la reutilización sobre el yunque ya trabajado.';
  } else if (input.role === 'hammer' && materialsDiffer) {
    dominantDriver = 'Propiedades físico-mecánicas del percutor';
    matchingTask = 'Paralelo con Tareas 1 y 2 (Modelos 1b y 2c · p = 0,001 / p = 0,022)';
    explanation =
      'A diferencia de los yunques, en la selección de percutores las marcas sociales no llegan a imponerse estadísticamente (Tarea 3, p = 0,112); la ventaja mecánica de la arenisca dura (57,09 frente a 27,05) sigue orientando la elección.';
  } else if (input.role === 'anvil' && materialsDiffer) {
    dominantDriver = 'Discriminación mecánica de dureza (sin conflicto social)';
    matchingTask = 'Paralelo directo con Tarea 1 (Modelo 1a · E_dura = −0,64 · p = 0,002)';
    explanation =
      'Al igualarse las pistas sociales, el primate discrimina la dureza y prefiere la caliza blanda como yunque porque se ahueca ligeramente y estabiliza el fruto durante el impacto.';
  }

  return {
    winner,
    scoreA,
    scoreB,
    dominantDriver,
    explanation,
    matchingTask,
  };
}
