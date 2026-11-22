export type SavannaBiomeId =
  | 'miombo-galeria'
  | 'rift-arido'
  | 'mosaico-uganda'
  | 'sabana-estacional';

export type MedicationMechanismId = 'quimico-pith' | 'mecanico-hojas' | 'profilaxis-riberena';

export type BotanicalIllustrationKind =
  | 'bitter-pith'
  | 'hispid-leaf'
  | 'desert-date'
  | 'sandpaper-fig'
  | 'hooked-herb'
  | 'aromatic-shrub';

export interface SavannaBiomeSpec {
  id: SavannaBiomeId;
  shortLabel: string;
  name: string;
  region: string;
  climateAndFlora: string;
  primateSpecies: string;
  parasitePressure: string;
}

export interface MedicationMechanismOption {
  id: MedicationMechanismId;
  label: string;
  shortLabel: string;
  description: string;
}

export interface SavannaMedicinalPlantCase {
  id: string;
  code: string;
  biomeId: SavannaBiomeId;
  biomeLabel: string;
  africanSite: string;
  country: string;
  primate: string;
  scientificName: string;
  commonName: string;
  family: string;
  plantPartUsed: string;
  illustration: BotanicalIllustrationKind;
  morphologicalClues: string[];
  fieldObservation: string;
  seasonality: string;
  correctMechanism: MedicationMechanismId;
  candidateSpecies: Array<{
    scientificName: string;
    commonName: string;
    morphologicalCue: string;
  }>;
  activeCompoundsOrStructure: string;
  targetParasite: string;
  behavioralExecution: string;
  ethnobotanicalConvergence: string;
  citation: string;
}

export const SAVANNA_BIOMES: SavannaBiomeSpec[] = [
  {
    id: 'miombo-galeria',
    shortLabel: 'Miombo y galería (Tanzania)',
    name: 'Sabana arbolada de miombo y bosque galería',
    region: 'Montes Mahale y Gombe · Cuenca del lago Tanganica (Tanzania)',
    climateAndFlora:
      'Estación seca prolongada y lluvias intensas; alternancia de bosques abiertos de Brachystegia (miombo) con franjas ribereñas densas.',
    primateSpecies: 'Pan troglodytes schweinfurthii',
    parasitePressure:
      'Picos estacionales de nematodos nodulares (Oesophagostomum stephanostomum) al inicio de las lluvias.',
  },
  {
    id: 'rift-arido',
    shortLabel: 'Sabana árida del Rift (Etiopía)',
    name: 'Sabana seca de acacias y valles ribereños del Rift',
    region: 'Parque Nacional de Awash · Valle del Rift (Etiopía)',
    climateAndFlora:
      'Sabana semiárida espinosa dominada por Acacia y Balanites con corredores fluviales cálidos.',
    primateSpecies: 'Papio hamadryas e híbridos con Papio anubis',
    parasitePressure:
      'Exposición diferencial al trematodo acuático Schistosoma mansoni aguas abajo de las cataratas de Awash.',
  },
  {
    id: 'mosaico-uganda',
    shortLabel: 'Mosaico sabana-bosque (Uganda)',
    name: 'Mosaico de sabana herbácea, claros y bosque semicaducifolio',
    region: 'Kibale y Budongo · Rift Occidental (Uganda)',
    climateAndFlora:
      'Bordes de sabana alta, claros secundarios húmedos y dosel semicaducifolio con abundante sotobosque híspido.',
    primateSpecies: 'Pan troglodytes schweinfurthii',
    parasitePressure:
      'Infecciones mixtas por nematodos gastrointestinales, tenias y bacterias oportunistas en heridas o tracto digestivo.',
  },
  {
    id: 'sabana-estacional',
    shortLabel: 'Sabana abierta estacional (Este/Oeste)',
    name: 'Sabana abierta estacional y matorral xerófilo',
    region: 'Corredores abiertos de Mahale–Ugalla (Tanzania) y sabanas sudano-guineanas',
    climateAndFlora:
      'Pastizales abiertos con arbustos aromáticos resistentes a la sequía y estrés térmico elevado.',
    primateSpecies: 'Pan troglodytes (poblaciones de sabana y borde)',
    parasitePressure:
      'Carga parasitaria modulada por la aridez, con brotes concentrados en charcas y comienzos del periodo húmedo.',
  },
];

export const MEDICATION_MECHANISM_OPTIONS: MedicationMechanismOption[] = [
  {
    id: 'quimico-pith',
    label: 'Acción química antiparasitaria (masticación de médula amarga)',
    shortLabel: 'Acción química (médula)',
    description:
      'Extracción de metabolitos secundarios bioactivos (lactonas sesquiterpénicas, glucósidos) descartando la fibra.',
  },
  {
    id: 'mecanico-hojas',
    label: 'Expulsión mecánica intestinal (deglución entera de hojas ásperas)',
    shortLabel: 'Expulsión mecánica (hojas)',
    description:
      'Ingestión sin masticar de hojas plegadas con tricomas rígidos que arrastran físicamente nematodos vivos.',
  },
  {
    id: 'profilaxis-riberena',
    label: 'Profilaxis y control químico mediante frutos/hojas con saponinas',
    shortLabel: 'Profilaxis fitoquímica (saponinas)',
    description:
      'Consumo selectivo de frutos u órganos vegetales ricos en saponinas esteroideas en focos de riesgo parasitario.',
  },
];

export const SAVANNA_MEDICINAL_PLANT_CASES: SavannaMedicinalPlantCase[] = [
  {
    id: 'plant-vernonia',
    code: 'Muestra 01',
    biomeId: 'miombo-galeria',
    biomeLabel: 'Sabana arbolada de miombo y galería',
    africanSite: 'Montes Mahale',
    country: 'Tanzania',
    primate: 'Pan troglodytes schweinfurthii',
    scientificName: 'Vernonia amygdalina',
    commonName: 'Hoja amarga africana (bitter leaf)',
    family: 'Asteraceae',
    plantPartUsed: 'Médula interna de brotes jóvenes (corteza externa descartada)',
    illustration: 'bitter-pith',
    morphologicalClues: [
      'Arbusto de sabana arbolada y claros con tallos jóvenes pelables.',
      'El primate retira minuciosamente hojas y corteza externa antes de masticar el núcleo.',
      'Sabor intensamente amargo; escaso valor calórico, consumo restringido a individuos enfermos.',
    ],
    fieldObservation:
      'En plena estación lluviosa en Mahale, una hembra con letargo acusado, diarrea y alta carga de huevos de Oesophagostomum selecciona tallos jóvenes de un arbusto de borde de miombo, pela la corteza con los dientes y mastica lentamente la médula blanca amarga, escupiendo las fibras secas. A las 24 horas su actividad y recuento parasitario mejoran de forma drástica.',
    seasonality: 'Estación de lluvias (pico de nematodos)',
    correctMechanism: 'quimico-pith',
    candidateSpecies: [
      {
        scientificName: 'Vernonia amygdalina',
        commonName: 'Hoja amarga africana',
        morphologicalCue: 'Brotes pelables con médula intensamente amarga',
      },
      {
        scientificName: 'Aspilia mossambicensis',
        commonName: 'Aspilia áspera',
        morphologicalCue: 'Hojas híspidas con tricomas en gancho tragadas enteras',
      },
      {
        scientificName: 'Balanites aegyptiaca',
        commonName: 'Dátil del desierto',
        morphologicalCue: 'Árbol espinoso de sabana árida con drupas ricas en saponinas',
      },
      {
        scientificName: 'Ficus exasperata',
        commonName: 'Higuera papel de lija',
        morphologicalCue: 'Hojas muy abrasivas silicificadas de textura rugosa',
      },
    ],
    activeCompoundsOrStructure:
      'Lactonas sesquiterpénicas (vernodalina, vernolida) y glucósidos esteroideos (vernionósidos) con potente actividad antiparasitaria y antiplasmodial.',
    targetParasite: 'Nematodos gastrointestinales (Oesophagostomum stephanostomum)',
    behavioralExecution:
      'Pelado selectivo de corteza y hojas para evitar toxinas excesivas, masticación prolongada de la médula suculenta y eyección del bagazo fibroso.',
    ethnobotanicalConvergence:
      'Conocida localmente en África Oriental como «mululuza» o «mtugutu»; utilizada ampliamente en la medicina tradicional africana contra parásitos intestinales, fiebres y malestar estomacal.',
    citation: 'Huffman & Seifu (1989); Huffman (1997, 2001), BioScience',
  },
  {
    id: 'plant-aspilia',
    code: 'Muestra 02',
    biomeId: 'miombo-galeria',
    biomeLabel: 'Sabana arbolada de miombo y galería',
    africanSite: 'Gombe y Mahale',
    country: 'Tanzania',
    primate: 'Pan troglodytes schweinfurthii',
    scientificName: 'Aspilia mossambicensis',
    commonName: 'Aspilia áspera de sabana',
    family: 'Asteraceae',
    plantPartUsed: 'Hojas jóvenes enteras cubiertas de tricomas rígidos',
    illustration: 'hispid-leaf',
    morphologicalClues: [
      'Hierba arbustiva frecuente en claros de sabana arbolada y laderas de Gombe.',
      'Superficie foliar áspera cubierta de pelos microscópicos (tricomas híspidos).',
      'Las hojas aparecen intactas y plegadas en las heces sin signos de masticación.',
    ],
    fieldObservation:
      'Al amanecer en Gombe, un macho adulto con el estómago vacío selecciona una a una hojas rugosas de un matorral de ladera, las introduce despacio en la boca, las dobla en acordeón con la lengua y las traga enteras sin masticar. Horas después se recuperan hojas intactas en las heces con nematodos adultos adheridos físicamente a su superficie.',
    seasonality: 'Inicio de lluvias y transición estacional',
    correctMechanism: 'mecanico-hojas',
    candidateSpecies: [
      {
        scientificName: 'Vernonia amygdalina',
        commonName: 'Hoja amarga africana',
        morphologicalCue: 'Médula amarga de tallos jóvenes masticada',
      },
      {
        scientificName: 'Aspilia mossambicensis',
        commonName: 'Aspilia áspera de sabana',
        morphologicalCue: 'Hojas híspidas plegadas en acordeón y tragadas enteras',
      },
      {
        scientificName: 'Balanites aegyptiaca',
        commonName: 'Dátil del desierto',
        morphologicalCue: 'Frutos amargos de sabana semiárida del Rift',
      },
      {
        scientificName: 'Aneilema aequinoctiale',
        commonName: 'Aneilema de bordes',
        morphologicalCue: 'Herbácea rastrera de claros húmedos de Uganda',
      },
    ],
    activeCompoundsOrStructure:
      'Tricomas epidérmicos rígidos y ásperos que generan efecto «velcro» físico y estimulan la motilidad intestinal para acelerar el tránsito (~6 horas).',
    targetParasite: 'Nematodos adultos (Oesophagostomum) y proglótides de cestodos (Bertiella)',
    behavioralExecution:
      'Recolección lenta y deliberada hoja por hoja (generalmente con estómago vacío), plegado lingual en acordeón y deglución intacta sin trituración molar.',
    ethnobotanicalConvergence:
      'Empleada en comunidades rurales de Tanzania y Kenia en infusiones para aliviar dolores abdominales, afecciones gástricas y cicatrización.',
    citation: 'Wrangham & Nishida (1983); Huffman (1997), Yearbook of Physical Anthropology',
  },
  {
    id: 'plant-balanites',
    code: 'Muestra 03',
    biomeId: 'rift-arido',
    biomeLabel: 'Sabana árida de acacias y valles del Rift',
    africanSite: 'Parque Nacional de Awash',
    country: 'Etiopía',
    primate: 'Papio hamadryas / Papio anubis (híbridos)',
    scientificName: 'Balanites aegyptiaca',
    commonName: 'Dátil del desierto (desert date)',
    family: 'Zygophyllaceae',
    plantPartUsed: 'Frutos (drupas) y hojas jóvenes',
    illustration: 'desert-date',
    morphologicalClues: [
      'Árbol espinoso muy resistente a la sequía propio de sabanas áridas del Sahel y el Rift.',
      'Produce frutos verdoso-amarillentos de pulpa oleosa y sabor agridulce/amargo.',
      'Consumido selectivamente solo por tropas expuestas a aguas con caracoles vectores de esquistosomiasis.',
    ],
    fieldObservation:
      'En el valle del río Awash (Etiopía), las tropas de babuinos situadas aguas abajo de las cataratas —donde las aguas remansadas albergan caracoles vectores de Schistosoma mansoni— incluyen regularmente en su dieta frutos y hojas de un árbol espinoso de sabana seca, mientras las tropas situadas aguas arriba (sin riesgo de esquistosomiasis) apenas los consumen pese a tener acceso al mismo árbol.',
    seasonality: 'Consumo focalizado en zonas endémicas ribereñas durante todo el año',
    correctMechanism: 'profilaxis-riberena',
    candidateSpecies: [
      {
        scientificName: 'Balanites aegyptiaca',
        commonName: 'Dátil del desierto',
        morphologicalCue: 'Árbol espinoso del Rift con frutos ricos en saponinas (diosgenina)',
      },
      {
        scientificName: 'Vernonia amygdalina',
        commonName: 'Hoja amarga africana',
        morphologicalCue: 'Arbusto de miombo cuya médula se pela y mastica',
      },
      {
        scientificName: 'Lippia plicata',
        commonName: 'Lippia aromática de sabana',
        morphologicalCue: 'Arbusto aromático de hojas rugosas tragadas enteras',
      },
      {
        scientificName: 'Ficus exasperata',
        commonName: 'Higuera papel de lija',
        morphologicalCue: 'Árbol de mosaico forestal con hojas abrasivas',
      },
    ],
    activeCompoundsOrStructure:
      'Saponinas esteroideas (diosgenina y balanitin) con actividad molusquicida y capacidad probada en laboratorio para interferir en el desarrollo de Schistosoma.',
    targetParasite: 'Trematodo sanguíneo Schistosoma mansoni (esquistosomiasis / bilharzia)',
    behavioralExecution:
      'Inclusión selectiva de frutos y hojas en la dieta cotidiana de las poblaciones ribereñas de alto riesgo, actuando como estrategia profiláctica o moduladora de la infección.',
    ethnobotanicalConvergence:
      'Árbol emblemático de la medicina tradicional del Sahel, Sudán y Etiopía (usado contra parásitos intestinales, esquistosomiasis y afecciones hepáticas).',
    citation: 'Phillips-Conroy (1986), en Current Perspectives in Primate Social Dynamics',
  },
  {
    id: 'plant-ficus',
    code: 'Muestra 04',
    biomeId: 'mosaico-uganda',
    biomeLabel: 'Mosaico de sabana herbácea y bosque (Uganda)',
    africanSite: 'Kibale y Budongo',
    country: 'Uganda',
    primate: 'Pan troglodytes schweinfurthii',
    scientificName: 'Ficus exasperata',
    commonName: 'Higuera papel de lija (sandpaper fig)',
    family: 'Moraceae',
    plantPartUsed: 'Hojas abrasivas enteras y corteza joven',
    illustration: 'sandpaper-fig',
    morphologicalClues: [
      'Árbol común en bordes de bosque galería, claros y transición a sabana.',
      'Hojas extremadamente ásperas al tacto por depósitos de sílice (cistolitos y tricomas rígidos).',
      'Empleada en deglución entera y registrada también por propiedades antibacterianas en extractos.',
    ],
    fieldObservation:
      'En los bordes de sabana y claros secundarios de Budongo y Kibale, un chimpancé con signos de malestar abdominal recoge hojas jóvenes extremadamente rasposas —de tacto semejante a papel de lija fino—, las dobla sin morderlas y las deglute enteras. Análisis recientes en Budongo muestran además que extractos de esta especie inhiben bacterias patógenas intestinales.',
    seasonality: 'Frecuente en periodos húmedos y brotes gastrointestinales',
    correctMechanism: 'mecanico-hojas',
    candidateSpecies: [
      {
        scientificName: 'Ficus exasperata',
        commonName: 'Higuera papel de lija',
        morphologicalCue: 'Hojas muy abrasivas con sílice usadas en deglución entera',
      },
      {
        scientificName: 'Balanites aegyptiaca',
        commonName: 'Dátil del desierto',
        morphologicalCue: 'Árbol espinoso con drupas ricas en diosgenina en Etiopía',
      },
      {
        scientificName: 'Vernonia amygdalina',
        commonName: 'Hoja amarga africana',
        morphologicalCue: 'Médula de brotes amargos masticada para extraer jugo',
      },
      {
        scientificName: 'Aspilia mossambicensis',
        commonName: 'Aspilia áspera',
        morphologicalCue: 'Hierba arbustiva de Gombe y Mahale',
      },
    ],
    activeCompoundsOrStructure:
      'Tricomas silicificados altamente abrasivos (efecto de barrido mecánico intestinal) combinados con compuestos fenólicos de actividad antimicrobiana.',
    targetParasite: 'Nematodos intestinales y patógenos bacterianos oportunistas',
    behavioralExecution:
      'Deglución de hojas enteras sin masticación para maximizar la fricción superficial en el lumen intestinal sin destruir la estructura foliar.',
    ethnobotanicalConvergence:
      'Hojas empleadas tradicionalmente en África Oriental y Occidental tanto como lija vegetal para pulir madera como en remedios para úlceras y trastornos digestivos.',
    citation: 'Huffman (1997); Freymann et al. (2024), PLOS ONE (Budongo)',
  },
  {
    id: 'plant-aneilema',
    code: 'Muestra 05',
    biomeId: 'mosaico-uganda',
    biomeLabel: 'Mosaico de sabana herbácea y bosque (Uganda)',
    africanSite: 'Kibale, Budongo y Mahale',
    country: 'Uganda y Tanzania',
    primate: 'Pan troglodytes schweinfurthii',
    scientificName: 'Aneilema aequinoctiale',
    commonName: 'Aneilema híspida de claros',
    family: 'Commelinaceae',
    plantPartUsed: 'Hojas enteras cubiertas de pelos en gancho',
    illustration: 'hooked-herb',
    morphologicalClues: [
      'Planta herbácea trepadora o rastrera de bordes de sabana húmeda y claros de galería.',
      'Sus hojas poseen tricomas microscópicos en forma de gancho que se adhieren fácilmente a tejidos.',
      'Presenta valor nutricional prácticamente nulo cuando atraviesa el intestino intacta.',
    ],
    fieldObservation:
      'En los márgenes herbáceos de Kibale, un chimpancé adulto aparta frutos cercanos y se detiene a arrancar diez hojas alargadas de una herbácea adherente. En lugar de mascarlas, las enrolla cuidadosamente sobre el paladar y las traga enteras; el examen microscópico de las hojas expulsadas revela gusanos nematodos enredados en los ganchos foliares.',
    seasonality: 'Picos de humedad en claros y bordes de galería',
    correctMechanism: 'mecanico-hojas',
    candidateSpecies: [
      {
        scientificName: 'Aneilema aequinoctiale',
        commonName: 'Aneilema híspida de claros',
        morphologicalCue: 'Herbácea de bordes con tricomas microscópicos en gancho',
      },
      {
        scientificName: 'Vernonia amygdalina',
        commonName: 'Hoja amarga africana',
        morphologicalCue: 'Arbusto leñoso cuya médula amarga se mastica',
      },
      {
        scientificName: 'Balanites aegyptiaca',
        commonName: 'Dátil del desierto',
        morphologicalCue: 'Árbol espinoso de sabana árida etíope',
      },
      {
        scientificName: 'Lippia plicata',
        commonName: 'Lippia aromática de sabana',
        morphologicalCue: 'Arbusto aromático de sabana abierta seca',
      },
    ],
    activeCompoundsOrStructure:
      'Tricomas uncinados (en forma de gancho) que atrapan mecánicamente nematodos intestinales y aceleran su expulsión física sin absorción química significativa.',
    targetParasite: 'Nematodos intestinales (Oesophagostomum) y fragmentos de cestodos',
    behavioralExecution:
      'Selección táctil con labios y lengua de la textura áspera antes de plegar y tragar intactas entre 5 y 20 hojas en una sola sesión.',
    ethnobotanicalConvergence:
      'Varias Commelinaceae africanas (géneros Aneilema y Commelina) se emplean en medicina local de África Oriental para afecciones intestinales y dérmicas.',
    citation: 'Huffman & Caton (2001), International Journal of Primatology',
  },
  {
    id: 'plant-lippia',
    code: 'Muestra 06',
    biomeId: 'sabana-estacional',
    biomeLabel: 'Sabana abierta estacional y matorral xerófilo',
    africanSite: 'Corredores abiertos de Mahale y Gombe',
    country: 'Tanzania',
    primate: 'Pan troglodytes schweinfurthii',
    scientificName: 'Lippia plicata',
    commonName: 'Lippia rugosa de sabana',
    family: 'Verbenaceae',
    plantPartUsed: 'Hojas rugosas enteras de matorral abierto',
    illustration: 'aromatic-shrub',
    morphologicalClues: [
      'Arbusto aromático típico de sabanas abiertas y laderas soleadas de África Oriental.',
      'Hojas muy nervadas, arrugadas y pubescentes de textura áspera.',
      'Integrada en el repertorio local de deglución entera cuando escasean otras especies de galería.',
    ],
    fieldObservation:
      'Al desplazarse por una ladera abierta de sabana herbácea fuera del bosque galería, un individuo con signos de infección parasitaria se detiene junto a un arbusto aromático de hojas gruesas, profundamente nervadas y ásperas. Pliega varias hojas sin masticar y las deglute íntegras, sustituyendo a las especies ribereñas ausentes en la sabana abierta.',
    seasonality: 'Transición seca-lluviosa en hábitats abiertos de sabana',
    correctMechanism: 'mecanico-hojas',
    candidateSpecies: [
      {
        scientificName: 'Lippia plicata',
        commonName: 'Lippia rugosa de sabana',
        morphologicalCue: 'Arbusto aromático de sabana abierta con hojas muy nervadas y ásperas',
      },
      {
        scientificName: 'Balanites aegyptiaca',
        commonName: 'Dátil del desierto',
        morphologicalCue: 'Árbol espinoso con frutos ricos en saponinas contra esquistosomiasis',
      },
      {
        scientificName: 'Vernonia amygdalina',
        commonName: 'Hoja amarga africana',
        morphologicalCue: 'Masticación de médula blanca amarga de brotes pelados',
      },
      {
        scientificName: 'Aneilema aequinoctiale',
        commonName: 'Aneilema híspida de claros',
        morphologicalCue: 'Herbácea rastrera de claros húmedos en Uganda',
      },
    ],
    activeCompoundsOrStructure:
      'Superficie foliar densamente pubescente y nervadura prominente que funciona como trampa mecánica intestinal; además contiene aceites esenciales estudiados en farmacopea regional.',
    targetParasite: 'Nematodos gastrointestinales en poblaciones de sabana abierta',
    behavioralExecution:
      'Ilustra la flexibilidad ecológica de la zoofarmacognosia: los primates transfieren el mismo patrón motor de deglución entera a taxones botánicos locales disponibles en cada tipo de sabana.',
    ethnobotanicalConvergence:
      'Las especies de Lippia de sabana africana (L. plicata, L. javanica) son ampliamente empleadas en infusiones antiparasitarias, respiratorias y febrífugas en África Oriental y Austral.',
    citation: 'Takasaki & Hunt (1987); Huffman (1997); Pruetz & Johnson-Fulton (2003)',
  },
];
