export interface SocialSystemProfile {
  id: string;
  species: string;
  commonName: string;
  region: string;
  fieldSites: string;
  habitat: string;
  systemType: string;
  dispersalSex: string;
  hierarchyAndCoalitions: string;
  conflictResolution: string;
  cooperationAndSharing: string;
  evolutionaryInsight: string;
  citation: string;
  accent: 'ochre' | 'lapis' | 'forest' | 'plum';
}

export interface ConflictCooperationRow {
  id: string;
  species: string;
  structure: string;
  dispersal: string;
  conflictMechanism: string;
  cooperationMode: string;
  intergroupRelation: string;
}

export type ComparatorSpeciesId =
  | 'chimpance'
  | 'bonobo'
  | 'gorila'
  | 'babuino'
  | 'gelada';

export type ComparatorScenarioId =
  | 'conflicto-intragrupal'
  | 'encuentro-intergrupal'
  | 'reparto-alimento'
  | 'alerta-depredador'
  | 'coordinacion-desplazamiento';

export interface ComparatorMetricProfile {
  intergroupTolerance: number;
  gesturalFlexibility: number;
  vocalComplexity: number;
  trophicCooperation: number;
  reconciliationRate: number;
}

export interface SpeciesScenarioBehavior {
  primaryModality: string;
  gesturalAndTactile: string;
  vocalAndAcoustic: string;
  socialOutcome: string;
  fieldEvidence: string;
}

export interface ComparatorSpeciesSpec {
  id: ComparatorSpeciesId;
  scientificName: string;
  commonName: string;
  africanSites: string;
  ecology: string;
  socialUnit: string;
  accent: 'ochre' | 'lapis' | 'forest' | 'plum' | 'ink';
  metrics: ComparatorMetricProfile;
  repertoireHighlight: string;
  scenarios: Record<ComparatorScenarioId, SpeciesScenarioBehavior>;
}

export interface ComparatorScenarioSpec {
  id: ComparatorScenarioId;
  shortLabel: string;
  title: string;
  context: string;
  evolutionaryQuestion: string;
}

export interface CognitionCommunicationPillar {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  empiricalFinding: string;
  africanSites: string;
  citation: string;
  glossaryTermId: string;
  glossaryLabel: string;
}

export type CulturalDomainId =
  | 'vegetal'
  | 'sabana-caza'
  | 'automedicacion'
  | 'social-ritual';

export interface EcologicalCulturePillar {
  id: string;
  domain: CulturalDomainId;
  kicker: string;
  title: string;
  africanSites: string;
  summary: string;
  mechanismDetail: string;
  archaeologicalLesson: string;
  citation: string;
  glossaryTermId: string;
  glossaryLabel: string;
}

export interface AfricanCulturalVariant {
  id: string;
  variant: string;
  domain: CulturalDomainId;
  domainLabel: string;
  species: string;
  sites: string;
  countryRegion: string;
  description: string;
  transmissionNote: string;
}

export interface EthologyWorkshopOption {
  id: string;
  label: string;
}

export interface EthologyWorkshopCase {
  id: string;
  caseNumber: string;
  site: string;
  species: string;
  title: string;
  fieldObservation: string;
  question: string;
  options: EthologyWorkshopOption[];
  correctOptionId: string;
  explanation: string;
  evolutionaryBridge: string;
  seminarPrompt: string;
  citation: string;
}

export const SOCIAL_SYSTEM_PROFILES: SocialSystemProfile[] = [
  {
    id: 'social-pan-troglodytes',
    species: 'Pan troglodytes',
    commonName: 'Chimpancé común',
    region: 'África Occidental, Central y Oriental',
    fieldSites: 'Taï (Costa de Marfil), Gombe y Mahale (Tanzania), Ngogo y Kibale (Uganda)',
    habitat: 'Selva húmeda, bosque galería y mosaico de sabana',
    systemType: 'Fisión-fusión multimacho-multihembra patrilineal',
    dispersalSex: 'Hembras en la adolescencia; machos filopátricos',
    hierarchyAndCoalitions:
      'Alianzas masculinas estratégicas basadas en acicalamiento recíproco y apoyo agonístico; el macho alfa suele depender de coaliciones más que de la fuerza física aislada.',
    conflictResolution:
      'Reconciliación post-conflicto (abrazos, besos boca a boca, acicalamiento), consolación por terceros hacia la víctima y mediación ocasional de hembras de alto rango.',
    cooperationAndSharing:
      'Caza cooperativa de colobos rojos (con roles diferenciados en Taï: ojeadores, bloqueadores, emboscadores), patrullas fronterizas silenciosas y reparto de carne ligado a alianzas sociales.',
    evolutionaryInsight:
      'Muestra cómo la cooperación táctica y el reparto de recursos de alto valor pueden coexistir con territorialidad estricta y competencia coalicional.',
    citation: 'Boesch (1994); Mitani & Watts (2001); de Waal (2000)',
    accent: 'ochre',
  },
  {
    id: 'social-pan-paniscus',
    species: 'Pan paniscus',
    commonName: 'Bonobo',
    region: 'Cuenca del Congo (al sur del río Congo)',
    fieldSites: 'Wamba y LuiKotale (República Democrática del Congo)',
    habitat: 'Selva tropical densa con abundante vegetación herbácea terrestre',
    systemType: 'Fisión-fusión multimacho-multihembra con codominancia y coaliciones femeninas',
    dispersalSex: 'Hembras en la adolescencia, pero forjan alianzas rápidas no emparentadas',
    hierarchyAndCoalitions:
      'Las hembras inmigrantes construyen fuertes lazos de apoyo mutuo que limitan la monopolización agresiva por parte de los machos; las madres influyen decisivamente en el rango de sus hijos.',
    conflictResolution:
      'Desescalada rápida mediante contacto afiliativo y sociosexual, juego adulto y altas tasas de consolación empática hacia individuos estresados tras un altercado.',
    cooperationAndSharing:
      'Reparto voluntario de alimentos preciados (incluso con miembros de otras comunidades en experimentos y encuentros pacíficos en el campo) y acicalamiento intergrupal ocasional.',
    evolutionaryInsight:
      'Corrige cualquier modelo unilateral basado solo en la agresión: demuestra que en el linaje Pan evolucionó una vía paralela de alta tolerancia social y cooperación prosocial.',
    citation: 'Furuichi (2011); Clay & de Waal (2013); Tan & Hare (2013); Surbeck et al. (2017)',
    accent: 'lapis',
  },
  {
    id: 'social-gorilla',
    species: 'Gorilla beringei / Gorilla gorilla',
    commonName: 'Gorila de montaña y de llanura occidental',
    region: 'Macizo de Virunga, Bwindi y Cuenca del Congo',
    fieldSites: 'Karisoke (Ruanda), Bwindi (Uganda), Loango (Gabón), Mbeli Bai (Congo)',
    habitat: 'Bosque montano de niebla y selva baja con claros pantanosos (bais)',
    systemType: 'Grupos cohesivos estables (un macho o varios machos adultos)',
    dispersalSex: 'Hembras (elección activa de grupo) y muchos machos jóvenes',
    hierarchyAndCoalitions:
      'Un macho de espalda plateada lidera la cohesión, la defensa frente a depredadores e infanticidio y la mediación de disputas entre hembras; en Virunga hasta un 40 % de grupos son multimacho.',
    conflictResolution:
      'Baja frecuencia de violencia letal intragrupal; las disputas se contienen mediante exhibiciones posturales y golpes de pecho ritualizados, seguidos de proximidad tranquila y vocalizaciones suaves.',
    cooperationAndSharing:
      'Cohesión defensiva coordinada, cuidado tolerante de crías huérfanas por el espalda plateada y agregación pacífica temporal de múltiples grupos en claros minerales (bais) sin agresión letal.',
    evolutionaryInsight:
      'Ofrece un contrapunto estructural: gran tamaño corporal y folivoría reducen la competencia diaria por alimento concentrado y favorecen grupos cohesivos con liderazgo protector.',
    citation: 'Robbins & Robbins (2018); Morrison et al. (2021); Parnell (2002)',
    accent: 'forest',
  },
  {
    id: 'social-sabana-cercopitecos',
    species: 'Papio anubis / Theropithecus gelada',
    commonName: 'Babuino oliva y gelada etíope',
    region: 'Sabanas de África Oriental y altiplanos de Etiopía',
    fieldSites: 'Amboseli (Kenia), Gombe (Tanzania), Montes Simien y Guassa (Etiopía)',
    habitat: 'Sabanas abiertas, pastizales de altura y acantilados rocosos',
    systemType: 'Tropas matrilineales (Papio) y sociedad multinivel modular (Theropithecus)',
    dispersalSex: 'Machos al alcanzar la madurez; hembras filopátricas en matrilinajes',
    hierarchyAndCoalitions:
      'Redes estables de parentesco femenino heredado; en los geladas, unidades reproductoras básicas se ensamblan en bandas y manadas de cientos de individuos para forrajear con seguridad en abierto.',
    conflictResolution:
      'Reconciliación mediante gruñidos suaves de acercamiento, presentación de crías como amortiguador social y alianzas de apoyo entre parientes maternos.',
    cooperationAndSharing:
      'Vigilancia colectiva frente a grandes carnívoros de sabana, defensa cooperativa de crías y coordinación vocal constante en desplazamientos por espacios expuestos.',
    evolutionaryInsight:
      'Aunque pertenecen a los cercopitécidos (divergencia ~25 Ma), constituyen modelos ecológicos esenciales para entender cómo los homininos africanos afrontaron la depredación y la cohesión social en paisajes abiertos.',
    citation: 'Silk et al. (2003, 2009); Snyder-Mackler et al. (2012); Bergman (2010)',
    accent: 'plum',
  },
];

export const CONFLICT_COOPERATION_MATRIX: ConflictCooperationRow[] = [
  {
    id: 'row-chimp',
    species: 'Pan troglodytes',
    structure: 'Fisión-fusión (20–150 ind.)',
    dispersal: 'Hembras',
    conflictMechanism: 'Reconciliación dirigida + consolación por terceros',
    cooperationMode: 'Caza cooperativa y patrullas territoriales',
    intergroupRelation: 'Hostilidad frecuente; defensa estricta de fronteras',
  },
  {
    id: 'row-bonobo',
    species: 'Pan paniscus',
    structure: 'Fisión-fusión (30–100 ind.)',
    dispersal: 'Hembras',
    conflictMechanism: 'Regulación afiliativa/sociosexual + alta consolación',
    cooperationMode: 'Coaliciones femeninas y reparto prosocial',
    intergroupRelation: 'Tolerancia frecuente; fusión pacífica y acicalamiento',
  },
  {
    id: 'row-gorila',
    species: 'Gorilla beringei',
    structure: 'Grupo cohesivo (8–35 ind.)',
    dispersal: 'Ambos sexos',
    conflictMechanism: 'Mediación del espalda plateada + exhibición ritual',
    cooperationMode: 'Defensa protectora y acogida de huérfanos',
    intergroupRelation: 'Evitación o exhibición sonora; tolerancia en bais',
  },
  {
    id: 'row-babuino',
    species: 'Papio anubis',
    structure: 'Tropa matrilineal (30–100 ind.)',
    dispersal: 'Machos',
    conflictMechanism: 'Gruñidos conciliadores + apoyo de matrilinaje',
    cooperationMode: 'Vigilancia colectiva y alianzas de hembras',
    intergroupRelation: 'Desplazamiento competitivo de áreas de forrajeo',
  },
  {
    id: 'row-gelada',
    species: 'Theropithecus gelada',
    structure: 'Sociedad multinivel (hasta >400 ind.)',
    dispersal: 'Machos',
    conflictMechanism: 'Vocalización continua + acicalamiento modular',
    cooperationMode: 'Forrajeo sincronizado y defensa frente a depredadores',
    intergroupRelation: 'Agregación pacífica de unidades en grandes bandas',
  },
];

export const COMPARATOR_METRIC_LABELS: Array<{
  key: keyof ComparatorMetricProfile;
  label: string;
  shortLabel: string;
  scaleHint: string;
}> = [
  {
    key: 'intergroupTolerance',
    label: 'Tolerancia intergrupal',
    shortLabel: 'Tolerancia',
    scaleHint: '0 = exclusión territorial estricta · 100 = fusión pacífica habitual',
  },
  {
    key: 'gesturalFlexibility',
    label: 'Plasticidad gestual intencional',
    shortLabel: 'Gestualidad',
    scaleHint: '0 = señales rígidas · 100 = repertorio amplio ajustado a la atención',
  },
  {
    key: 'vocalComplexity',
    label: 'Complejidad y ritmo vocal',
    shortLabel: 'Vocalización',
    scaleHint: '0 = llamadas breves · 100 = secuencias moduladas y diálogo grupal',
  },
  {
    key: 'trophicCooperation',
    label: 'Cooperación trófica y reparto',
    shortLabel: 'Cooperación',
    scaleHint: '0 = forrajeo individual · 100 = caza coordinada o reparto activo',
  },
  {
    key: 'reconciliationRate',
    label: 'Reconciliación y consolación',
    shortLabel: 'Reconciliación',
    scaleHint: '0 = dispersión tras conflicto · 100 = reparación rápida y consolación',
  },
];

export const COMPARATOR_SCENARIOS: ComparatorScenarioSpec[] = [
  {
    id: 'conflicto-intragrupal',
    shortLabel: 'Conflicto interno',
    title: 'Resolución de conflicto intragrupal',
    context:
      'Dos adultos disputan un recurso limitado o una posición jerárquica. ¿Cómo reparan el vínculo y contienen el estrés del grupo?',
    evolutionaryQuestion:
      'Ilumina el origen evolutivo de la mediación, la reparación relacional y la empatía consoladora.',
  },
  {
    id: 'encuentro-intergrupal',
    shortLabel: 'Encuentro vecinal',
    title: 'Encuentro entre comunidades vecinas',
    context:
      'Dos grupos coinciden en la zona fronteriza de sus áreas de campeo. ¿Predomina la defensa territorial o la tolerancia?',
    evolutionaryQuestion:
      'Clave para modelar el paso de fronteras cerradas a redes humanas de intercambio intergrupal.',
  },
  {
    id: 'reparto-alimento',
    shortLabel: 'Reparto trófico',
    title: 'Reparto de alimento de alto valor',
    context:
      'Un individuo obtiene una presa o fruto monopolizable ante la mirada cercana de otros miembros del grupo.',
    evolutionaryQuestion:
      'Permite contrastar la reciprocidad estratégica, el acoso tolerado y la prosocialidad voluntaria.',
  },
  {
    id: 'alerta-depredador',
    shortLabel: 'Alerta depredador',
    title: 'Detección de depredador y alerta',
    context:
      'Se detecta un leopardo, pitón o águila coronada en las inmediaciones. ¿Qué información transmite la señal?',
    evolutionaryQuestion:
      'Explica la transición desde alertas emocionalmente acopladas hacia señales intencionales dirigidas al receptor.',
  },
  {
    id: 'coordinacion-desplazamiento',
    shortLabel: 'Desplazamiento',
    title: 'Coordinación de desplazamiento y cohesión',
    context:
      'El subgrupo o tropa decide cuándo levantarse y en qué dirección moverse a través de la selva o la sabana.',
    evolutionaryQuestion:
      'Muestra cómo se toman decisiones colectivas sin lenguaje gramatical mediante gestos, vocalizaciones y consenso gradual.',
  },
];

export const COMPARATOR_SPECIES: Record<ComparatorSpeciesId, ComparatorSpeciesSpec> = {
  chimpance: {
    id: 'chimpance',
    scientificName: 'Pan troglodytes',
    commonName: 'Chimpancé común',
    africanSites: 'Taï · Gombe · Mahale · Budongo · Ngogo',
    ecology: 'Selva húmeda y mosaico bosque-sabana',
    socialUnit: 'Fisión-fusión patrilineal',
    accent: 'ochre',
    metrics: {
      intergroupTolerance: 18,
      gesturalFlexibility: 94,
      vocalComplexity: 78,
      trophicCooperation: 88,
      reconciliationRate: 76,
    },
    repertoireHighlight:
      '>66 gestos intencionales confirmados, pant-hoots individuales y tamborileo rítmico en contrafuertes arbóreos.',
    scenarios: {
      'conflicto-intragrupal': {
        primaryModality: 'Táctil y gestual (reconciliación + consolación)',
        gesturalAndTactile:
          'Extensión de mano abierta con palma hacia arriba, abrazo prolongado, beso boca a boca y acicalamiento reparador; terceros no implicados consuelan a la víctima.',
        vocalAndAcoustic:
          'Jadeos suaves de sumisión (pant-grunts) que restablecen el reconocimiento del estatus sin prolongar la agresión.',
        socialOutcome:
          'Restauración selectiva de alianzas valiosas; mayor probabilidad de reconciliación entre socios estratégicos.',
        fieldEvidence: 'Documentado sistemáticamente en Gombe, Mahale, Taï y colonias de referencia (de Waal, 2000).',
      },
      'encuentro-intergrupal': {
        primaryModality: 'Acústica a larga distancia y exhibición coalicional',
        gesturalAndTactile:
          'Desplazamiento en fila silenciosa durante patrullas fronterizas, piloerección y balanceo de ramas si superan en número al rival.',
        vocalAndAcoustic:
          'Coros de pant-hoots y tamborileo sobre contrafuertes de raíces para evaluar el tamaño numérico del grupo vecino.',
        socialOutcome:
          'Evitación mutua si las fuerzas son parejas; riesgo de ataques letales en desbalance numérico extremo.',
        fieldEvidence: 'Patrullas y vocalizaciones evaluadoras en Ngogo, Kanyawara y Taï (Wilson et al., 2014).',
      },
      'reparto-alimento': {
        primaryModality: 'Gestual de súplica + reparto condicionado por alianzas',
        gesturalAndTactile:
          'Gesto de mano extendida (begging), mirada fija al alimento y proximidad tolerada; el poseedor cede fragmentos a aliados o participantes de la caza.',
        vocalAndAcoustic:
          'Llamadas rugosas de alimento (rough grunts) moduladas según la calidad del recurso (más frecuentes en árboles frutales abundantes).',
        socialOutcome:
          'En Taï se recompensa a los participantes activos de la caza; en Ngogo se intercambia carne por apoyo político y acicalamiento.',
        fieldEvidence: 'Taï (Boesch, 1994) y Ngogo (Mitani & Watts, 2001).',
      },
      'alerta-depredador': {
        primaryModality: 'Vocal intencional ajustada al conocimiento del receptor',
        gesturalAndTactile:
          'Mirada alternante entre la serpiente y los compañeros que llegan, deteniendo el paso y señalando la dirección con la postura corporal.',
        vocalAndAcoustic:
          'Llamadas de alerta «hoo» emitidas con mayor intensidad cuando los compañeros cercanos aún no han visto la pitón o víbora.',
        socialOutcome:
          'Evitación rápida y aprendizaje social del peligro; evidencia de sensibilidad al estado de conocimiento ajeno.',
        fieldEvidence: 'Experimentos con modelos de serpiente en Budongo, Uganda (Crockford et al., 2012).',
      },
      'coordinacion-desplazamiento': {
        primaryModality: 'Combinación de gestos visuales, tamborileo y pant-hoots',
        gesturalAndTactile:
          'Gesto de «sígueme», mirada atrás repetida y arrastre de ramas para iniciar la marcha de un subgrupo.',
        vocalAndAcoustic:
          'Tamborileo con firmas individuales en raíces tabulares y pant-hoots de reunión que reagrupan subgrupos a >1 km.',
        socialOutcome:
          'Reagrupación flexible en función de la disponibilidad estacional de frutos y la seguridad del territorio.',
        fieldEvidence: 'Taï y Budongo (Boesch, 1991; Eleuteri et al., 2022).',
      },
    },
  },
  bonobo: {
    id: 'bonobo',
    scientificName: 'Pan paniscus',
    commonName: 'Bonobo',
    africanSites: 'Wamba · LuiKotale · Kokolopori (R. D. Congo)',
    ecology: 'Selva tropical densa con estrato herbáceo continuo',
    socialUnit: 'Fisión-fusión con coaliciones femeninas',
    accent: 'lapis',
    metrics: {
      intergroupTolerance: 86,
      gesturalFlexibility: 92,
      vocalComplexity: 82,
      trophicCooperation: 84,
      reconciliationRate: 95,
    },
    repertoireHighlight:
      'Amplia superposición gestual (~90 %) con chimpancés, vocalizaciones «peep» flexibles y uso intensivo de señales afiliativas.',
    scenarios: {
      'conflicto-intragrupal': {
        primaryModality: 'Táctil afiliativa y sociosexual de desescalada inmediata',
        gesturalAndTactile:
          'Contacto ventro-ventral, frotamiento genito-genital entre hembras, abrazos y acicalamiento casi inmediato tras el desacuerdo.',
        vocalAndAcoustic:
          'Chirridos breves y peeps de tono agudo que reducen la activación fisiológica y solicitan proximidad tranquila.',
        socialOutcome:
          'Contención veloz de la agresión y fuerte consolación dirigida hacia la víctima, especialmente por juveniles y hembras aliadas.',
        fieldEvidence: 'Wamba y Lola ya Bonobo (Furuichi, 2011; Clay & de Waal, 2013).',
      },
      'encuentro-intergrupal': {
        primaryModality: 'Vocalización de contacto + interacción afiliativa entre grupos',
        gesturalAndTactile:
          'Tras una fase inicial de tensión, las hembras inician contactos amistosos, juego y acicalamiento con miembros de la comunidad vecina.',
        vocalAndAcoustic:
          'Intercambio de llamadas de tono alto (high hoots) que permiten el acercamiento gradual sin emboscadas letales.',
        socialOutcome:
          'Coexistencia pacífica que puede durar horas o días, compartiendo áreas de alimentación y construyendo nidos cercanos.',
        fieldEvidence: 'Kokolopori y LuiKotale (Samuni & Surbeck, 2023; Lucchesi et al., 2020).',
      },
      'reparto-alimento': {
        primaryModality: 'Prosocialidad voluntaria y control femenino del recurso',
        gesturalAndTactile:
          'Aproximación calmada sin amenaza; las hembras suelen controlar frutos grandes o presas y reparten porciones con compañeras e incluso forasteros.',
        vocalAndAcoustic:
          'Secuencias combinadas de peeps y yelps cuya estructura cambia según la preferencia alimentaria y atrae al grupo.',
        socialOutcome:
          'Redistribución amplia que refuerza las coaliciones femeninas y minimiza la monopolización agresiva.',
        fieldEvidence: 'LuiKotale y estudios experimentales (Tan & Hare, 2013; Fruth & Hohmann, 2018).',
      },
      'alerta-depredador': {
        primaryModality: 'Vocalización combinada y reagrupamiento protector',
        gesturalAndTactile:
          'Agrupación rápida en el dosel medio y vigilancia mutua silenciosa con contacto visual entre hembras.',
        vocalAndAcoustic:
          'Ladridos de alarma combinados con peeps de contexto; menor presión histórica de grandes depredadores al sur del Congo pero alerta clara ante pitones y águilas.',
        socialOutcome:
          'Respuesta cohesionada sin fragmentación brusca del subgrupo.',
        fieldEvidence: 'LuiKotale y Wamba (Clay et al., 2015).',
      },
      'coordinacion-desplazamiento': {
        primaryModality: 'Vocalizaciones de contacto y gestos de invitación',
        gesturalAndTactile:
          'Gestos de contacto en la espalda, extensión de brazo y espera activa de hembras líderes para iniciar el traslado.',
        vocalAndAcoustic:
          'Combinaciones de low hoots y high hoots que sincronizan subgrupos grandes a través de la selva cerrada.',
        socialOutcome:
          'Desplazamientos con subgrupos más estables y mixtos que en chimpancés comunes.',
        fieldEvidence: 'Wamba y LuiKotale (Schamberg et al., 2017).',
      },
    },
  },
  gorila: {
    id: 'gorila',
    scientificName: 'Gorilla beringei',
    commonName: 'Gorila de montaña',
    africanSites: 'Virunga (Ruanda/RDC) · Bwindi (Uganda) · Loango (Gabón)',
    ecology: 'Bosque montano denso y claros herbáceos',
    socialUnit: 'Grupo cohesivo con espalda plateada',
    accent: 'forest',
    metrics: {
      intergroupTolerance: 48,
      gesturalFlexibility: 84,
      vocalComplexity: 64,
      trophicCooperation: 42,
      reconciliationRate: 62,
    },
    repertoireHighlight:
      'Golpeo de pecho acústico como señal honesta de tamaño corporal, vocalizaciones suaves de cohesión («belch») y más de 30 gestos táctiles.',
    scenarios: {
      'conflicto-intragrupal': {
        primaryModality: 'Mediación postural y vocal del espalda plateada',
        gesturalAndTactile:
          'Interposición física del macho dominante entre contendientes (intervención pacificadora) y reanudación del descanso en proximidad.',
        vocalAndAcoustic:
          'Gruñidos graves cortos de advertencia seguidos de vocalizaciones guturales tranquilizadoras (double grunts).',
        socialOutcome:
          'Resolución rápida sin escalada física grave; las hembras se mantienen cerca del macho protector.',
        fieldEvidence: 'Karisoke, Virunga (Watts, 1995; Robbins & Robbins, 2018).',
      },
      'encuentro-intergrupal': {
        primaryModality: 'Exhibición multimodal acústico-visual a distancia',
        gesturalAndTactile:
          'Marcha lateral rígida, arranque de vegetación y golpeo rítmico de pecho con manos ahuecadas.',
        vocalAndAcoustic:
          'Frecuencia de resonancia del golpeo de pecho (audible >1 km) que comunica honestamente el tamaño corporal y evita combates innecesarios.',
        socialOutcome:
          'Separación ritualizada en la mayoría de encuentros; en gorilas occidentales de llanura existen reuniones tolerantes en claros minerales (bais).',
        fieldEvidence: 'Volcanoes National Park (Wright et al., 2021) y Mbeli Bai (Parnell, 2002).',
      },
      'reparto-alimento': {
        primaryModality: 'Forrajeo paralelo de baja competencia',
        gesturalAndTactile:
          'Alimentación simultánea en parches vegetales abundantes; el reparto activo es raro salvo madres con crías pequeñas.',
        vocalAndAcoustic:
          'Murmullos de satisfacción alimentaria («food humming») que informan de la localización de brotes y tallos.',
        socialOutcome:
          'Baja tensión trófica diaria gracias a la abundancia de follaje, reduciendo la necesidad de reparto competitivo.',
        fieldEvidence: 'Bwindi y Mbeli Bai (Luef et al., 2016).',
      },
      'alerta-depredador': {
        primaryModality: 'Defensa grupal liderada y señal de alarma grave',
        gesturalAndTactile:
          'El espalda plateada se coloca en retaguardia frente a la amenaza mientras las hembras recogen a las crías.',
        vocalAndAcoustic:
          'Ladrido seco de alarma (alarm bark) seguido de rugido intimidatorio si el depredador persiste.',
        socialOutcome:
          'Protección eficaz de los inmaduros y retirada ordenada del grupo completo.',
        fieldEvidence: 'Virunga y Loango (Robbins & Robbins, 2018).',
      },
      'coordinacion-desplazamiento': {
        primaryModality: 'Consenso vocal gradual («votación» por gruñidos)',
        gesturalAndTactile:
          'Puesta en pie pausada del espalda plateada con pausas de espera hasta que el resto del grupo responde.',
        vocalAndAcoustic:
          'Aumento progresivo en la tasa de grunts suaves emitidos por múltiples adultos; el grupo solo parte cuando se alcanza un umbral de consenso.',
        socialOutcome:
          'Toma de decisiones parcialmente compartida pese a la fuerte asimetría física del macho líder.',
        fieldEvidence: 'Parque Nacional de los Volcanes, Ruanda (Stewart & Harcourt, 1994).',
      },
    },
  },
  babuino: {
    id: 'babuino',
    scientificName: 'Papio anubis',
    commonName: 'Babuino oliva',
    africanSites: 'Amboseli (Kenia) · Gombe (Tanzania) · Laikipia',
    ecology: 'Sabana abierta y bosque de acacias',
    socialUnit: 'Tropa matrilineal multimacho',
    accent: 'plum',
    metrics: {
      intergroupTolerance: 26,
      gesturalFlexibility: 52,
      vocalComplexity: 74,
      trophicCooperation: 46,
      reconciliationRate: 70,
    },
    repertoireHighlight:
      'Jerarquía matrilineal estricta, gruñidos conciliadores que predicen comportamiento pacífico y lazos femeninos que aumentan la supervivencia infantil.',
    scenarios: {
      'conflicto-intragrupal': {
        primaryModality: 'Vocalización conciliadora (grunt) + acicalamiento matrilineal',
        gesturalAndTactile:
          'Chasquido rápido de labios (lipsmacking), presentación sumisa y acicalamiento prolongado entre parientes.',
        vocalAndAcoustic:
          'Los gruñidos suaves emitidos por la agresora tras un conflicto señalan intención benigna y permiten el acercamiento de la subordinada.',
        socialOutcome:
          'Reconciliación focalizada en relaciones de alto valor cooperativo; los lazos sociales fuertes reducen el cortisol crónico.',
        fieldEvidence: 'Amboseli y Moremi (Silk et al., 2003; Cheney & Seyfarth, 2007).',
      },
      'encuentro-intergrupal': {
        primaryModality: 'Desplazamiento competitivo y exhibición vocal',
        gesturalAndTactile:
          'Bostezos exhibiendo caninos, persecuciones breves y retirada de la tropa de menor tamaño.',
        vocalAndAcoustic:
          'Ladridos potentes (wahoo calls) de los machos adultos que informan de condición física y capacidad combativa.',
        socialOutcome:
          'Defensa de dormideros y parches de agua sin patrullas letales organizadas como en chimpancés.',
        fieldEvidence: 'Amboseli y Okavango (Kitchen et al., 2003).',
      },
      'reparto-alimento': {
        primaryModality: 'Competencia jerárquica con tolerancia hacia crías',
        gesturalAndTactile:
          'Acceso prioritario según rango matrilineal; las hembras dominantes desplazan a subordinadas en parches pequeños.',
        vocalAndAcoustic:
          'Gruñidos de contacto que amortiguan la tensión cuando se forrajea cerca de una madre con cría.',
        socialOutcome:
          'Escaso reparto activo de carne entre adultos, contrastando fuertemente con Pan troglodytes y Pan paniscus.',
        fieldEvidence: 'Amboseli y Gilgil (Strum, 1981; Silk et al., 2009).',
      },
      'alerta-depredador': {
        primaryModality: 'Llamadas de alarma diferenciadas + defensa colectiva',
        gesturalAndTactile:
          'Escalada rápida a acacias o acantilados; varios machos pueden acosar conjuntamente a un leopardo.',
        vocalAndAcoustic:
          'Ladridos agudos de alarma que distinguen urgencia y tipo de depredador terrestre en sabana abierta.',
        socialOutcome:
          'Reducción notable del riesgo de depredación en terreno despejado mediante vigilancia distribuida.',
        fieldEvidence: 'Amboseli y Okavango (Cheney & Seyfarth, 2007).',
      },
      'coordinacion-desplazamiento': {
        primaryModality: 'Decisión democrática compartida por iniciadores',
        gesturalAndTactile:
          'Movimientos de «tirón» (pull) en una dirección: si varios individuos siguen un ángulo coherente, la tropa adopta esa ruta por mayoría.',
        vocalAndAcoustic:
          'Llamadas de contacto suaves (contact barks) cuando un individuo pierde visibilidad en la vegetación.',
        socialOutcome:
          'Navegación colectiva guiada por consenso de mayoría más que por el rango del macho dominante.',
        fieldEvidence: 'Seguimiento GPS de alta resolución en Mpala, Kenia (Strandburg-Peshkin et al., 2015).',
      },
    },
  },
  gelada: {
    id: 'gelada',
    scientificName: 'Theropithecus gelada',
    commonName: 'Gelada etíope',
    africanSites: 'Montes Simien · Guassa (Etiopía)',
    ecology: 'Praderas de alta montaña (>2.000 m) y escarpes rocosos',
    socialUnit: 'Sociedad multinivel modular',
    accent: 'ink',
    metrics: {
      intergroupTolerance: 90,
      gesturalFlexibility: 44,
      vocalComplexity: 92,
      trophicCooperation: 50,
      reconciliationRate: 78,
    },
    repertoireHighlight:
      'Ritmo vocal tipo «wobble» con cadencia silábica similar al habla humana (3–8 Hz) usado como «acicalamiento vocal» a distancia en grandes manadas.',
    scenarios: {
      'conflicto-intragrupal': {
        primaryModality: 'Vocalización continua y coaliciones de hembras emparentadas',
        gesturalAndTactile:
          'Acicalamiento intenso dentro de la unidad reproductora y apoyo inmediato entre hermanas para contener disputas.',
        vocalAndAcoustic:
          'Intercambios vocales rápidos de tono suave que amortiguan la tensión sin interrumpir el pastoreo manual.',
        socialOutcome:
          'Estabilidad interna de las unidades básicas incluso durante tomas de control por machos solteros.',
        fieldEvidence: 'Montes Simien, Etiopía (Bergman, 2010; Snyder-Mackler et al., 2012).',
      },
      'encuentro-intergrupal': {
        primaryModality: 'Agregación tolerante modular en supergrupos',
        gesturalAndTactile:
          'Coexistencia pacífica a pocos metros entre decenas de unidades familiares sobre las mismas praderas.',
        vocalAndAcoustic:
          'Coro continuo de vocalizaciones de contacto que mantiene la identidad de cada unidad dentro de manadas de >400 animales.',
        socialOutcome:
          'Modelo clave para entender cómo evolucionan sociedades multinivel sin violencia intergrupal crónica.',
        fieldEvidence: 'Simien y Guassa (Snyder-Mackler et al., 2012).',
      },
      'reparto-alimento': {
        primaryModality: 'Pastoreo sincronizado sin monopolización',
        gesturalAndTactile:
          'Recolección bimanual intensiva de gramíneas sentados; las manos quedan ocupadas cosechando mientras socializan por voz.',
        vocalAndAcoustic:
          'Uso del «acicalamiento vocal» (vocal grooming): charlas rítmicas que mantienen vínculos sociales mientras forrajean.',
        socialOutcome:
          'Ilustra la hipótesis de Dunbar sobre la transición del acicalamiento táctil a la comunicación vocal en grupos grandes.',
        fieldEvidence: 'Montes Simien (Gustison et al., 2012; Bergman, 2013).',
      },
      'alerta-depredador': {
        primaryModality: 'Vigilancia colectiva de cientos de ojos y retirada a acantilados',
        gesturalAndTactile:
          'Desplazamiento coordinado hacia el borde de los escarpes rocosos ante chacales, leopardos o hienas.',
        vocalAndAcoustic:
          'Ladridos agudos sincronizados que propagan la alarma en cadena por toda la banda.',
        socialOutcome:
          'Alta eficacia defensiva en terreno abierto sin necesidad de cobertura arbórea.',
        fieldEvidence: 'Guassa y Simien, Etiopía (Iwamoto et al., 1996).',
      },
      'coordinacion-desplazamiento': {
        primaryModality: 'Señales vocales rítmicas en cascada',
        gesturalAndTactile:
          'Avance en frente amplio sobre la pradera manteniendo la cohesión de cada unidad reproductora.',
        vocalAndAcoustic:
          'Llamadas rítmicas de transición al amanecer y atardecer para subir y bajar de los dormideros en acantilados.',
        socialOutcome:
          'Sincronización de cientos de individuos con mínima fricción interna.',
        fieldEvidence: 'Simien Mountains Gelada Research Project (Bergman, 2013).',
      },
    },
  },
};

export function buildComparativeInsight(
  speciesAId: ComparatorSpeciesId,
  speciesBId: ComparatorSpeciesId,
  scenarioId: ComparatorScenarioId
): {
  headline: string;
  contrastSummary: string;
  evolutionaryTakeaway: string;
} {
  const a = COMPARATOR_SPECIES[speciesAId];
  const b = COMPARATOR_SPECIES[speciesBId];
  const scenario = COMPARATOR_SCENARIOS.find((s) => s.id === scenarioId) ?? COMPARATOR_SCENARIOS[0];

  if (speciesAId === speciesBId) {
    return {
      headline: `Perfil individual de ${a.commonName} (${a.scientificName})`,
      contrastSummary: `Selecciona una segunda especie diferente para contrastar cómo divergen la estructura social y la comunicación ante «${scenario.title.toLowerCase()}».`,
      evolutionaryTakeaway: scenario.evolutionaryQuestion,
    };
  }

  const pairKey = [speciesAId, speciesBId].sort().join('::');

  if (pairKey === 'bonobo::chimpance') {
    return {
      headline: 'Divergencia dentro del género Pan: dos soluciones con un mismo ancestro común (~1–2 Ma)',
      contrastSummary: `Frente a «${scenario.title.toLowerCase()}», chimpancés y bonobos comparten casi el 90 % de su repertorio gestual pero divergen drásticamente en tolerancia intergrupal (${COMPARATOR_SPECIES.chimpance.metrics.intergroupTolerance}/100 frente a ${COMPARATOR_SPECIES.bonobo.metrics.intergroupTolerance}/100) y en la arquitectura de coaliciones.`,
      evolutionaryTakeaway:
        'Para la paleoantropología africana, este contraste demuestra que el último ancestro común humano-Pan no puede reconstruirse a partir de una sola especie: la cooperación humana hereda tanto rasgos de coordinación estratégica como de prosocialidad tolerante.',
    };
  }

  if (pairKey === 'chimpance::gelada' || pairKey === 'bonobo::gelada') {
    return {
      headline: 'Plasticidad gestual en selva frente a «acicalamiento vocal» en sociedades multinivel de sabana',
      contrastSummary: `Mientras ${a.commonName} y ${b.commonName} muestran fortalezas inversas entre gestualidad intencional y vocalización rítmica (${a.metrics.vocalComplexity}/100 vs. ${b.metrics.vocalComplexity}/100), los geladas demuestran cómo los grupos muy numerosos en paisajes abiertos impulsan la comunicación vocal continua.`,
      evolutionaryTakeaway:
        'Sugiere que la evolución del lenguaje humano integró dos presiones complementarias: la intencionalidad gestual heredada de grandes simios y la necesidad de cohesión vocal a gran escala en entornos abiertos africanos.',
    };
  }

  const tolDiff = Math.abs(a.metrics.intergroupTolerance - b.metrics.intergroupTolerance);
  const gestDiff = Math.abs(a.metrics.gesturalFlexibility - b.metrics.gesturalFlexibility);
  const vocalDiff = Math.abs(a.metrics.vocalComplexity - b.metrics.vocalComplexity);

  const strongestAxis =
    tolDiff >= gestDiff && tolDiff >= vocalDiff
      ? `la tolerancia intergrupal (${a.metrics.intergroupTolerance} vs. ${b.metrics.intergroupTolerance})`
      : gestDiff >= vocalDiff
        ? `la flexibilidad gestual intencional (${a.metrics.gesturalFlexibility} vs. ${b.metrics.gesturalFlexibility})`
        : `la complejidad vocal (${a.metrics.vocalComplexity} vs. ${b.metrics.vocalComplexity})`;

  return {
    headline: `Contraste ${a.commonName} vs. ${b.commonName} · ${scenario.shortLabel}`,
    contrastSummary: `La brecha más pronunciada entre ambos modelos reside en ${strongestAxis}. En «${scenario.title.toLowerCase()}», ${a.commonName} prioriza ${a.scenarios[scenarioId].primaryModality.toLowerCase()}, mientras ${b.commonName} recurre a ${b.scenarios[scenarioId].primaryModality.toLowerCase()}.`,
    evolutionaryTakeaway: scenario.evolutionaryQuestion,
  };
}

export const COGNITION_COMMUNICATION_PILLARS: CognitionCommunicationPillar[] = [
  {
    id: 'cog-gestos',
    title: 'Repertorio gestual intencional compartido',
    subtitle: 'Great Ape Dictionary · Flexibilidad y ajuste al receptor',
    summary:
      'A diferencia de muchas llamadas vocales rígidas, los grandes simios africanos emplean entre 66 y 80 gestos manuales y posturales de uso intencional: esperan respuesta, persisten si no logran su meta y eligen gestos visuales solo cuando el destinatario está mirando.',
    empiricalFinding:
      'Chimpancés y bonobos comparten cerca del 90 % de los tipos de gestos y una gran parte de sus significados operativos; incluso humanos adultos comprenden intuitivamente más del 50 % de gestos de grandes simios en pruebas experimentales.',
    africanSites: 'Budongo (Uganda), Wamba (RDC), Loango (Gabón)',
    citation: 'Hobaiter & Byrne (2011, 2014); Graham et al. (2018, 2023)',
    glossaryTermId: 'comunicacion-gestual-intencional',
    glossaryLabel: 'comunicación gestual intencional',
  },
  {
    id: 'cog-acustica',
    title: 'Comunicación acústica y percusión en selva',
    subtitle: 'Pant-hoots, llamadas combinadas y tamborileo arbóreo',
    summary:
      'En selvas densas donde la visibilidad no supera los 20 metros, los chimpancés combinan vocalizaciones de largo alcance (pant-hoots) con golpes rítmicos en raíces tabulares que portan firmas individuales y regionales, permitiendo coordinar la fisión-fusión a más de un kilómetro.',
    empiricalFinding:
      'Estudios recientes demuestran combinaciones sintácticas simples de llamadas (por ejemplo, «alarm-huu + waa-bark» en Taï) que generan significados compuestos más allá de cada llamada aislada.',
    africanSites: 'Taï (Costa de Marfil), Budongo (Uganda), Simien (Etiopía)',
    citation: 'Eleuteri et al. (2022); Girard-Buttoz et al. (2022); Bergman (2013)',
    glossaryTermId: 'fision-fusion',
    glossaryLabel: 'sociedades de fisión-fusión',
  },
  {
    id: 'cog-teoria-mente',
    title: 'Teoría de la mente y atribución de conocimiento',
    subtitle: 'Más allá de la lectura de conducta observable',
    summary:
      'Los grandes simios siguen la mirada tras barreras opacas, distinguen si un compañero «sabe» o «ignora» la presencia de una amenaza y anticipan acciones basadas en creencias falsas en pruebas de seguimiento ocular.',
    empiricalFinding:
      'En Budongo, los chimpancés emiten alertas de serpiente específicamente cuando llegan individuos que no presenciaron el peligro; en pruebas de mirada anticipatoria, chimpancés, bonobos y orangutanes superan tareas implícitas de falsa creencia.',
    africanSites: 'Budongo (Uganda), Ngamba Island, santuarios africanos',
    citation: 'Crockford et al. (2012); Krupenye et al. (2016)',
    glossaryTermId: 'teoria-mente-primates',
    glossaryLabel: 'teoría de la mente',
  },
  {
    id: 'cog-empatia',
    title: 'Empatía dirigida, consolación y sentido de equidad',
    subtitle: 'Regulación emocional y mantenimiento de alianzas',
    summary:
      'Tras una pelea, terceros no implicados se acercan espontáneamente a la víctima para abrazarla o acicalarla, reduciendo sus marcadores conductuales de estrés. Esta consolación depende del vínculo social previo y es especialmente intensa en bonobos y juveniles.',
    empiricalFinding:
      'La reconciliación selectiva y la consolación muestran que la cooperación primate requiere mecanismos afectivos que amortigüen los costes inevitables de vivir en grupo.',
    africanSites: 'Wamba y Lola ya Bonobo (RDC), Gombe y Mahale (Tanzania)',
    citation: 'de Waal (2000); Fraser et al. (2008); Clay & de Waal (2013)',
    glossaryTermId: 'reconciliacion-consolacion',
    glossaryLabel: 'reconciliación y consolación',
  },
];

export const ECOLOGICAL_CULTURE_PILLARS: EcologicalCulturePillar[] = [
  {
    id: 'eco-vegetal',
    domain: 'vegetal',
    kicker: 'Eje 01 · Tecnología orgánica y cadenas operativas',
    title: 'Culturas vegetales y kits de herramientas compuestas',
    africanSites: 'Goualougo (Rep. del Congo) · Gombe · Bossou · Taï',
    summary:
      'El 90 % del equipamiento material de los grandes simios africanos es perecedero (madera, tallos, hojas, cortezas). En el triángulo de Goualougo, los chimpancés fabrican kits secuenciales de dos herramientas: primero perforan termiteros subterráneos con un palo rígido y después introducen una sonda herbácea previamente deshilachada con los dientes en forma de pincel, que multiplica el rendimiento de captura.',
    mechanismDetail:
      'La síntesis panafricana de Whiten et al. (1999) documentó 39 variantes culturales independientes entre comunidades africanas (pesca de termitas, recolección de hormigas bravas, esponjas de hojas, limpieza con hojas, danza de la lluvia), demostrando diversidad cultural no explicable únicamente por ecología.',
    archaeologicalLesson:
      'Advierte a la prehistoria africana contra el «sesgo lítico»: las industrias en piedra conservadas desde hace 3,3–2,6 Ma representan solo la fracción mineral de repertorios probablemente mucho más ricos en madera, fibras y vegetación.',
    citation: 'Whiten et al. (1999); Sanz & Morgan (2007, 2013)',
    glossaryTermId: 'kit-cultural-compuesto',
    glossaryLabel: 'kit cultural compuesto',
  },
  {
    id: 'eco-sabana',
    domain: 'sabana-caza',
    kicker: 'Eje 02 · Ecología de paisajes abiertos',
    title: 'Adaptación a la sabana y caza con lanzas en Fongoli',
    africanSites: 'Fongoli (sureste de Senegal) · Ugalla (Tanzania)',
    summary:
      'Frente al estereotipo de que los chimpancés solo habitan selvas cerradas, la comunidad de Fongoli vive en una sabana seca arbolada con temperaturas extremas (>40 °C). Allí fabrican rutinariamente lanzas o jabalinas de madera en hasta cinco pasos (selección de rama, deshojado, descortezado y afilado de la punta con los dientes) para cazar gálagos del Senegal ocultos en huecos de troncos.',
    mechanismDetail:
      'Curiosamente, hembras y juveniles lideran la caza con herramientas en Fongoli, compensando la ventaja física masculina en la caza manual. Además, emplean cuevas para termorregulación, se sumergen en charcas y extienden su actividad a la noche en la estación seca.',
    archaeologicalLesson:
      'Constituye el referente vivo más directo para modelar cómo los primeros homininos africanos (Australopithecus, Homo temprano) resolvieron el estrés térmico, la escasez de agua y la obtención de proteína animal al expandirse por mosaicos de sabana.',
    citation: 'Pruetz & Bertolani (2007); Pruetz et al. (2015)',
    glossaryTermId: 'adaptacion-sabana-fongoli',
    glossaryLabel: 'adaptación a la sabana',
  },
  {
    id: 'eco-automedicacion',
    domain: 'automedicacion',
    kicker: 'Eje 03 · Botánica aplicada y salud primate',
    title: 'Zoofarmacognosia y automedicación africana',
    africanSites: 'Mahale (Tanzania) · Kibale y Budongo (Uganda) · Loango (Gabón)',
    summary:
      'Chimpancés, bonobos y gorilas africanos emplean plantas sin valor calórico relevante para combatir parásitos y dolores digestivos. Se distinguen dos estrategias clásicas: la deglución mecánica sin masticar de hojas híspidas (Aspilia, Aneilema) que arrastran físicamente nematodos intestinales, y la masticación química de la médula intensamente amarga de Vernonia amygdalina rica en compuestos antiparasitarios.',
    mechanismDetail:
      'En 2022, el equipo del proyecto Ozouga en Loango (Gabón) documentó además la aplicación tópica de insectos machacados sobre heridas propias y ajenas, ampliando el debate sobre conductas prosociales de cuidado sanitario.',
    archaeologicalLesson:
      'Conecta directamente la etología con la paleobotánica y la etnobotánica africana: varios taxones usados por grandes simios (como Vernonia amygdalina) forman parte también de la farmacopea tradicional de comunidades humanas de África Oriental y Central.',
    citation: 'Huffman (1997, 2001); Mascaro et al. (2022); Freymann et al. (2024)',
    glossaryTermId: 'zoofarmacognosia',
    glossaryLabel: 'zoofarmacognosia',
  },
];

export const AFRICAN_CULTURAL_VARIANTS: AfricanCulturalVariant[] = [
  {
    id: 'var-goualougo-pincel',
    variant: 'Sondas deshilachadas en pincel y perforadores',
    domain: 'vegetal',
    domainLabel: 'Cultura vegetal',
    species: 'Pan troglodytes troglodytes',
    sites: 'Triángulo de Goualougo',
    countryRegion: 'República del Congo',
    description:
      'Secuencia estandarizada de dos útiles (palo rígido perforador + tallo herbáceo de Marantaceae deshilachado en punta) para extraer termitas subterráneas.',
    transmissionNote: 'Madres ceden útiles usados a sus crías (transferencia tolerada).',
  },
  {
    id: 'var-bossou-esponja',
    variant: 'Machacado de médula de palma con «majadero»',
    domain: 'vegetal',
    domainLabel: 'Cultura vegetal',
    species: 'Pan troglodytes verus',
    sites: 'Bossou',
    countryRegion: 'Guinea',
    description:
      'Uso del pecíolo desprendido de la palma de aceite (Elaeis guineensis) como mano de mortero para triturar el corazón fibroso del tronco.',
    transmissionNote: 'Tradición local exclusiva ausente en poblaciones vecinas con la misma palma.',
  },
  {
    id: 'var-fongoli-lanzas',
    variant: 'Lanzas de madera afiladas para caza de gálagos',
    domain: 'sabana-caza',
    domainLabel: 'Sabana y caza',
    species: 'Pan troglodytes verus',
    sites: 'Fongoli',
    countryRegion: 'Senegal',
    description:
      'Fabricación multietapa de varas puntiagudas introducidas con fuerza en cavidades arbóreas para cazar prosimios nocturnos en sabana abierta.',
    transmissionNote: 'Mayor frecuencia en hembras y juveniles; adaptación conductual a sabana seca.',
  },
  {
    id: 'var-tai-caza',
    variant: 'Caza cooperativa de colobos por roles',
    domain: 'sabana-caza',
    domainLabel: 'Sabana y caza',
    species: 'Pan troglodytes verus',
    sites: 'Parque Nacional de Taï',
    countryRegion: 'Costa de Marfil',
    description:
      'Coordinación en selva alta con distribución dinámica de funciones (conductor, bloqueador, perseguidor y emboscador) y reparto de carne ligado a la participación.',
    transmissionNote: 'Contrasta con la caza más oportunista en el bosque abierto de Gombe.',
  },
  {
    id: 'var-mahale-vernonia',
    variant: 'Masticación de médula amarga de Vernonia',
    domain: 'automedicacion',
    domainLabel: 'Automedicación',
    species: 'Pan troglodytes schweinfurthii',
    sites: 'Montes Mahale y Kibale',
    countryRegion: 'Tanzania y Uganda',
    description:
      'Pelado meticuloso de brotes jóvenes de Vernonia amygdalina para absorber jugos con lactonas sesquiterpénicas contra infecciones parasitarias estacionales.',
    transmissionNote: 'Concentrado en época de lluvias; convergencia con medicina tradicional africana.',
  },
  {
    id: 'var-budongo-hojas',
    variant: 'Deglución entera de hojas ásperas',
    domain: 'automedicacion',
    domainLabel: 'Automedicación',
    species: 'Pan troglodytes / Pan paniscus / Gorilla',
    sites: 'Gombe, Mahale, Budongo, Wamba, Kahuzi-Biega',
    countryRegion: 'África Oriental y Central',
    description:
      'Ingestión sin masticar de hojas dobladas con tricomas rígidos que estimulan la motilidad intestinal y expulsan nematodos (Oesophagostomum).',
    transmissionNote: 'Efecto puramente físico presente en los tres géneros de simios africanos.',
  },
  {
    id: 'var-loango-heridas',
    variant: 'Aplicación tópica de insectos sobre heridas',
    domain: 'automedicacion',
    domainLabel: 'Automedicación',
    species: 'Pan troglodytes troglodytes',
    sites: 'Parque Nacional de Loango',
    countryRegion: 'Gabón',
    description:
      'Captura, inmovilización entre labios y aplicación directa de insectos sobre lesiones cutáneas propias y, en varios casos, de otros miembros del grupo.',
    transmissionNote: 'Evidencia reciente de cuidado prosocial de heridas en libertad.',
  },
  {
    id: 'var-mahale-acicalamiento',
    variant: 'Acicalamiento con manos entrelazadas en alto',
    domain: 'social-ritual',
    domainLabel: 'Tradición social',
    species: 'Pan troglodytes schweinfurthii',
    sites: 'Mahale, Kibale, Taï',
    countryRegion: 'Tanzania, Uganda y Costa de Marfil',
    description:
      'Dos individuos se acicalan mutuamente mientras sostienen una mano unida por encima de la cabeza; variante cultural puramente social sin función trófica.',
    transmissionNote: 'Difiere incluso en la forma del agarre (palma o muñeca) entre comunidades vecinas.',
  },
];

export const ETHOLOGY_WORKSHOP_CASES: EthologyWorkshopCase[] = [
  {
    id: 'case-fongoli',
    caseNumber: 'Caso 01',
    site: 'Fongoli · Sureste de Senegal',
    species: 'Pan troglodytes verus',
    title: 'Fabricación de lanzas y uso de cuevas en sabana seca',
    fieldObservation:
      'Durante la estación seca (>40 °C), una hembra juvenil selecciona una rama recta, retira hojas y corteza, afila la punta con los incisivos y sondea repetidamente la cavidad de un baobab para capturar un gálago. Al mediodía el grupo se refugia en una cueva fresca.',
    question:
      '¿Qué implicación metodológica principal tiene esta observación para la paleoantropología africana?',
    options: [
      {
        id: 'opt-a',
        label: 'Confirma que la caza con herramientas en homininos fue exclusiva de machos adultos.',
      },
      {
        id: 'opt-b',
        label:
          'Demuestra que la adaptación primate a sabanas abiertas pudo incluir útiles de madera perecederos y protagonismo femenino/juvenil.',
      },
      {
        id: 'opt-c',
        label:
          'Prueba que la tecnología en piedra evolucionó antes que cualquier manipulación de madera.',
      },
      {
        id: 'opt-d',
        label: 'Indica que los chimpancés de sabana no utilizan aprendizaje social.',
      },
    ],
    correctOptionId: 'opt-b',
    explanation:
      'En Fongoli, hembras y juveniles realizan la mayoría de capturas con lanzas de madera (Pruetz & Bertolani, 2007). Esto cuestiona los modelos clásicos centrados solo en el «hombre cazador» y recuerda que las armas vegetales tempranas rara vez fosilizan.',
    evolutionaryBridge:
      'Ayuda a modelar estrategias de termorregulación y obtención proteica en Australopithecus y Homo temprano antes de la aparición de puntas líticas enmangadas.',
    seminarPrompt:
      'Debate en aula: ¿cómo distorsiona el registro fósil el hecho de que las herramientas orgánicas de madera desaparezcan en pocos años mientras la piedra dura millones?',
    citation: 'Pruetz & Bertolani (2007), Current Biology; Pruetz et al. (2015), Royal Society Open Science',
  },
  {
    id: 'case-wamba',
    caseNumber: 'Caso 02',
    site: 'Wamba y LuiKotale · R. D. del Congo',
    species: 'Pan paniscus',
    title: 'Encuentro pacífico y reparto de alimento entre comunidades vecinas',
    fieldObservation:
      'Dos comunidades de bonobos coinciden en un parche frutal fronterizo. Tras vocalizaciones iniciales de alerta, varias hembras se aproximan, establecen contacto afiliativo, comparten frutos de Treculia africana y pasan la noche anidando en el mismo sector.',
    question:
      '¿Qué concepto etológico explica mejor esta dinámica frente al patrón territorial típico de los chimpancés comunes?',
    options: [
      {
        id: 'opt-a',
        label: 'Tolerancia intergrupal mediada por coaliciones femeninas y regulación afiliativa.',
      },
      {
        id: 'opt-b',
        label: 'Ausencia total de jerarquía o reconocimiento individual dentro del grupo.',
      },
      {
        id: 'opt-c',
        label: 'Monopolización defensiva por un único macho de espalda plateada.',
      },
      {
        id: 'opt-d',
        label: 'Facilitación local puramente lítica basada en yunques de arenisca.',
      },
    ],
    correctOptionId: 'opt-a',
    explanation:
      'Los bonobos combinan una ecología con abundante vegetación herbácea y sólidas coaliciones entre hembras no emparentadas, lo que rebaja los costes de la proximidad intergrupal y favorece el intercambio prosocial.',
    evolutionaryBridge:
      'Demuestra que la evolución de redes de intercambio entre grupos humanos tuvo bases conductuales posibles ya en el clado Pan-Homo, no solo hostilidad intergrupal.',
    seminarPrompt:
      'Debate en aula: ¿por qué es científicamente arriesgado reconstruir el comportamiento de los primeros homininos usando únicamente al chimpancé común e ignorando al bonobo?',
    citation: 'Furuichi (2011); Tan & Hare (2013); Samuni & Surbeck (2023), Science',
  },
  {
    id: 'case-budongo',
    caseNumber: 'Caso 03',
    site: 'Bosque de Budongo · Uganda',
    species: 'Pan troglodytes schweinfurthii',
    title: 'Llamadas de alerta moduladas según el conocimiento del compañero',
    fieldObservation:
      'Un chimpancé descubre una pitón parcialmente oculta en la hojarasca. Permanece atento y emite repetidas llamadas suaves «alert-hoo» mirando alternativamente hacia la serpiente y hacia los individuos recién llegados que todavía no la han visto, pero calla cuando todos ya la observaron.',
    question:
      '¿Qué capacidad sociocognitiva está poniendo de manifiesto esta conducta de campo?',
    options: [
      {
        id: 'opt-a',
        label: 'Un reflejo involuntario automático disparado únicamente por el miedo personal.',
      },
      {
        id: 'opt-b',
        label: 'Comunicación intencional sensible al estado atencional y de conocimiento del receptor.',
      },
      {
        id: 'opt-c',
        label: 'Zoofarmacognosia preventiva frente a toxinas vegetales.',
      },
      {
        id: 'opt-d',
        label: 'Conformidad cultural sobre elección de materias primas.',
      },
    ],
    correctOptionId: 'opt-b',
    explanation:
      'Los experimentos controlados en Budongo (Crockford et al., 2012) probaron que la emisión de la alerta no dependía solo del nivel de excitación del emisor, sino de si los compañeros cercanos ignoraban o conocían la presencia de la amenaza.',
    evolutionaryBridge:
      'Señala un precursor crítico de la pragmática del lenguaje humano: informar intencionalmente para rellenar una laguna de conocimiento en otro individuo.',
    seminarPrompt:
      'Debate en aula: ¿qué distancia existe entre alertar intencionalmente a un compañero informado/desinformado y enseñar activamente una técnica compleja?',
    citation: 'Crockford et al. (2012), Current Biology; Hobaiter & Byrne (2014)',
  },
  {
    id: 'case-mahale',
    caseNumber: 'Caso 04',
    site: 'Montes Mahale · Tanzania',
    species: 'Pan troglodytes schweinfurthii',
    title: 'Consumo selectivo de Vernonia amygdalina y hojas enteras en estación lluviosa',
    fieldObservation:
      'Una hembra con signos visibles de letargo e infección parasitaria pela cuidadosamente brotes jóvenes de Vernonia amygdalina, descarta la corteza y mastica despacio la médula extremadamente amarga; al día siguiente traga sin masticar doce hojas ásperas dobladas.',
    question:
      '¿Cómo clasifica la etología comparada este patrón conductual observado en libertad?',
    options: [
      {
        id: 'opt-a',
        label: 'Forrajeo calórico ordinario por escasez de fruta madura.',
      },
      {
        id: 'opt-b',
        label: 'Zoofarmacognosia combinada: acción química antiparasitaria y barrido mecánico intestinal.',
      },
      {
        id: 'opt-c',
        label: 'Exhibición ritual de reconciliación tras un conflicto jerárquico.',
      },
      {
        id: 'opt-d',
        label: 'Caza cooperativa indirecta de insectos sociales.',
      },
    ],
    correctOptionId: 'opt-b',
    explanation:
      'Huffman (1997, 2001) demostró mediante análisis coprológicos y fitoquímicos que la médula de Vernonia reduce drásticamente la carga de huevos de nematodos en 24 horas, complementando la expulsión física producida por hojas híspidas enteras.',
    evolutionaryBridge:
      'Sugiere que el conocimiento botánico medicinal africano tiene raíces evolutivas profundas anteriores al surgimiento de Homo sapiens.',
    seminarPrompt:
      'Debate en aula: ¿cómo pueden dialogar la etología de grandes simios, la paleobotánica y la medicina tradicional africana para rastrear el uso humano antiguo de plantas medicinales?',
    citation: 'Huffman (1997), Yearbook of Physical Anthropology; Huffman (2001), BioScience',
  },
];
