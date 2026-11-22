export type EthologyGlossaryDomain =
  | 'aprendizaje-social'
  | 'tecnologia-litica'
  | 'ecologia-tradicion'
  | 'sociedad-comunicacion-ecologia';

export interface EthologyGlossaryEntry {
  id: string;
  term: string;
  englishTerm: string;
  domain: EthologyGlossaryDomain;
  domainLabel: string;
  definition: string;
  ethologyContext: string;
  moduleContext: string;
}

export const ETHOLOGY_GLOSSARY_DOMAINS: Array<{
  id: EthologyGlossaryDomain | 'todos';
  label: string;
}> = [
  { id: 'todos', label: 'Todos los conceptos' },
  { id: 'sociedad-comunicacion-ecologia', label: 'Sociedad, comunicación y ecología' },
  { id: 'aprendizaje-social', label: 'Aprendizaje social' },
  { id: 'tecnologia-litica', label: 'Tecnología lítica primate' },
  { id: 'ecologia-tradicion', label: 'Ecología y tradición' },
];

export const ETHOLOGY_GLOSSARY_TERMS: EthologyGlossaryEntry[] = [
  {
    id: 'etologia-comparada',
    term: 'Etología comparada de primates',
    englishTerm: 'Comparative primate ethology',
    domain: 'ecologia-tradicion',
    domainLabel: 'Ecología y tradición',
    definition:
      'Estudio científico del comportamiento animal en libertad que compara grandes simios africanos (chimpancés, bonobos, gorilas) y especies convergentes (como capuchinos y macacos) para modelar la evolución de la cognición técnica, la transmisión cultural y el uso del paisaje en homininos tempranos.',
    ethologyContext:
      'Permite contrastar rasgos homólogos en Pan troglodytes y Pan paniscus frente a modelos convergentes como Sapajus libidinosus.',
    moduleContext: 'Etología · Primatología comparada',
  },
  {
    id: 'arqueologia-primates',
    term: 'Arqueología de primates',
    englishTerm: 'Primate archaeology',
    domain: 'tecnologia-litica',
    domainLabel: 'Tecnología lítica primate',
    definition:
      'Disciplina interdisciplinar que aplica métodos de excavación, análisis lítico y tafonomía a los yacimientos producidos por primates no humanos (chimpancés de Taï, capuchinos de Serra da Capivara, macacos birmanos) para establecer referentes empíricos con los que interpretar el registro plio-pleistoceno africano.',
    ethologyContext:
      'Documenta talleres de cascanueces de ~4.300 años en Taï (Costa de Marfil) y >3.000 años en Serra da Capivara (Brasil).',
    moduleContext: 'Etología · Arqueología primate',
  },
  {
    id: 'facilitacion-local',
    term: 'Facilitación local y de estímulo',
    englishTerm: 'Local & stimulus enhancement',
    domain: 'aprendizaje-social',
    domainLabel: 'Aprendizaje social',
    definition:
      'Mecanismo de aprendizaje social indirecto por el cual la presencia de congéneres o de huellas visibles de su actividad —como rocas picoteadas o cáscaras partidas— atrae la atención de otros individuos hacia un punto concreto del paisaje o hacia un útil determinado.',
    ethologyContext:
      'Confirmado en la Tarea 2 de Henke-von der Malsburg et al. (2026): fuerte preferencia por estaciones con restos de uso previo (E = −1,86; p < 0,001).',
    moduleContext: 'Etología · Henke-von der Malsburg et al. (2026)',
  },
  {
    id: 'pistas-sociales-indirectas',
    term: 'Pistas sociales indirectas',
    englishTerm: 'Indirect social cues',
    domain: 'aprendizaje-social',
    domainLabel: 'Aprendizaje social',
    definition:
      'Señales materiales duraderas que permanecen sobre herramientas y emplazamientos tras la marcha del usuario —marcas de percusión, hoyuelos en yunques y residuos alimenticios— y que orientan las decisiones tecnológicas de otros individuos de forma asincrónica.',
    ethologyContext:
      'En la Tarea 3 (2026), las huellas de golpeo en yunques superaron estadísticamente a la dureza de la roca (E = +1,08; p = 0,003 frente a p = 0,255).',
    moduleContext: 'Etología · Laboratorio experimental (2026)',
  },
  {
    id: 'cuarta-dimension-herramientas',
    term: 'Cuarta dimensión del uso de herramientas',
    englishTerm: 'Fourth dimension of tool use',
    domain: 'aprendizaje-social',
    domainLabel: 'Aprendizaje social',
    definition:
      'Concepto formulado por Fragaszy et al. (2013) para describir cómo los útiles duraderos y residuos acumulados en el paisaje actúan como un nicho tecnológico persistente que transmite información social a través del tiempo, guiando el aprendizaje y la reutilización de enclaves durante generaciones.',
    ethologyContext:
      'Conecta la reutilización de yunques en primates actuales con los palimpsestos líticos del Olduvayense africano (Garganta de Olduvai).',
    moduleContext: 'Etología · Paisajes líticos persistentes',
  },
  {
    id: 'conformidad-cultural',
    term: 'Conformidad cultural intergrupal',
    englishTerm: 'Cultural conformity',
    domain: 'ecologia-tradicion',
    domainLabel: 'Ecología y tradición',
    definition:
      'Tendencia conductual por la cual un individuo adopta la variante técnica mayoritaria de su nuevo grupo social incluso cuando domina previamente otra técnica igual o más eficiente desde el punto de vista mecánico.',
    ethologyContext:
      'Observada en hembras inmigrantes de Pan troglodytes verus en el Parque Nacional de Taï (Luncz y Boesch), que ajustan su elección de percutores de piedra o madera al grupo receptor.',
    moduleContext: 'Etología · Culturas primates en África',
  },
  {
    id: 'emulacion-aprendizaje',
    term: 'Emulación y ensayo guiado socialmente',
    englishTerm: 'Emulation & socially scaffolded learning',
    domain: 'aprendizaje-social',
    domainLabel: 'Aprendizaje social',
    definition:
      'Modalidad de aprendizaje social en la que el aprendiz reconstruye el objetivo o las propiedades mecánicas de un útil a partir del resultado visible y la práctica repetida en un entorno enriquecido por herramientas ya seleccionadas por adultos.',
    ethologyContext:
      'Reflejada en la curva de aprendizaje del Modelo 4 (2026), donde los individuos aumentan su eficacia con los ensayos sucesivos (E = +0,51; p = 0,005).',
    moduleContext: 'Etología · Mecanismos de transmisión',
  },
  {
    id: 'percusion-bipolar-yunque',
    term: 'Percusión sobre yunque y dureza de rebote',
    englishTerm: 'Anvil percussion & rebound hardness',
    domain: 'tecnologia-litica',
    domainLabel: 'Tecnología lítica primate',
    definition:
      'Técnica extractiva que combina un soporte fijo o móvil (yunque) y una piedra activa (percutor) para fracturar frutos duros o núcleos. La dureza de rebote (medida con esclerómetro Equotip) cuantifica la elasticidad superficial de la roca y explica la preferencia por yunques más blandos que estabilizan el fruto y percutores más duros.',
    ethologyContext:
      'En el experimento de 2026 (Tarea 1), los primates distinguieron caliza blanda (27,05) como yunque (p = 0,002) y arenisca dura (57,09) como percutor (p = 0,001).',
    moduleContext: 'Etología · Propiedades de materia prima',
  },
  {
    id: 'lugares-persistentes',
    term: 'Lugares persistentes y acumulaciones líticas',
    englishTerm: 'Persistent places / stone accumulations',
    domain: 'tecnologia-litica',
    domainLabel: 'Tecnología lítica primate',
    definition:
      'Puntos concretos del paisaje que son visitados y reutilizados de forma reiterada a lo largo de décadas o milenios, generando densas concentraciones de piedras transportadas, yunques picoteados y restos orgánicos que estructuran el registro arqueológico.',
    ethologyContext:
      'Aporta una base conductual concreta a los modelos de acumulación de materias primas en el Lecho I de Olduvai (Potts, 1984; Schick, 1987).',
    moduleContext: 'Etología · Puente con el Olduvayense',
  },
  {
    id: 'transporte-decaimiento-distancia',
    term: 'Transporte lítico y decaimiento por distancia',
    englishTerm: 'Distance-decay stone transport',
    domain: 'tecnologia-litica',
    domainLabel: 'Tecnología lítica primate',
    definition:
      'Patrón espacial según el cual la frecuencia de materias primas seleccionadas disminuye progresivamente al aumentar la distancia desde su afloramiento geológico de origen, reflejando el equilibrio entre coste de transporte y utilidad técnica.',
    ethologyContext:
      'Documentado en chimpancés de Taï (~100–500 m) y contrastado con el salto de escala del Olduvayense africano en Kanjera South (>10 km).',
    moduleContext: 'Etología · Paisajes líticos africanos',
  },
  {
    id: 'convergencia-conductual',
    term: 'Convergencia conductual frente a homología',
    englishTerm: 'Behavioral convergence vs. homology',
    domain: 'ecologia-tradicion',
    domainLabel: 'Ecología y tradición',
    definition:
      'Distinción evolutiva fundamental al comparar especies: la homología refleja rasgos heredados de un ancestro común cercano (humanos y chimpancés), mientras que la convergencia refleja soluciones conductuales semejantes evolucionadas de manera independiente ante presiones ecológicas similares (capuchinos o macacos).',
    ethologyContext:
      'Garantiza rigor metodológico al usar a Sapajus libidinosus como modelo heurístico experimental sin equipararlo linealmente con homininos africanos.',
    moduleContext: 'Etología · Cautelas metodológicas',
  },
  {
    id: 'tolerancia-social-cooperacion',
    term: 'Tolerancia social y coaliciones',
    englishTerm: 'Social tolerance & coalitions',
    domain: 'ecologia-tradicion',
    domainLabel: 'Ecología y tradición',
    definition:
      'Grado de proximidad pacífica, reparto de alimento y baja agresión entre miembros de un grupo primate que amplía las oportunidades de observación cercana y aprendizaje social por parte de juveniles e inmigrantes.',
    ethologyContext:
      'Rasgo paradigmático de Pan paniscus (bonobos en Wamba y LuiKotale) que complementa los modelos centrados exclusivamente en chimpancés comunes.',
    moduleContext: 'Etología · Grandes simios africanos',
  },
  {
    id: 'fision-fusion',
    term: 'Sociedad de fisión-fusión',
    englishTerm: 'Fission-fusion society',
    domain: 'sociedad-comunicacion-ecologia',
    domainLabel: 'Sociedad, comunicación y ecología',
    definition:
      'Sistema de organización social dinámico en el que una comunidad grande se divide cotidianamente en subgrupos temporales (fisión) según la dispersión de frutos y se reúne periódicamente (fusión) para socializar, desplazarse o defender el territorio.',
    ethologyContext:
      'Caracteriza tanto a Pan troglodytes como a Pan paniscus y se considera un rasgo estructural compartido con las sociedades humanas cazadoras-recolectoras.',
    moduleContext: 'Etología · Sociedad y cooperación',
  },
  {
    id: 'reconciliacion-consolacion',
    term: 'Reconciliación y consolación post-conflicto',
    englishTerm: 'Post-conflict reconciliation & consolation',
    domain: 'sociedad-comunicacion-ecologia',
    domainLabel: 'Sociedad, comunicación y ecología',
    definition:
      'Interacciones afiliativas posteriores a un altercado: la reconciliación ocurre entre los antiguos contendientes para restaurar su alianza, mientras la consolación proviene de un tercero no implicado que abraza o acicala a la víctima para reducir su estrés.',
    ethologyContext:
      'Documentada en chimpancés, bonobos y babuinos; constituye una pieza clave en la evolución de la empatía dirigida y la cohesión grupal.',
    moduleContext: 'Etología · Resolución de conflictos',
  },
  {
    id: 'comunicacion-gestual-intencional',
    term: 'Comunicación gestual intencional',
    englishTerm: 'Intentional gestural communication',
    domain: 'sociedad-comunicacion-ecologia',
    domainLabel: 'Sociedad, comunicación y ecología',
    definition:
      'Uso flexible y dirigido a metas de gestos manuales y posturales ajustados al estado atencional del receptor: el emisor comprueba si el destinatario mira, espera respuesta y persiste o reformula el gesto si no logra el resultado esperado.',
    ethologyContext:
      'El Great Ape Dictionary documenta >66 gestos compartidos en Pan troglodytes y Pan paniscus, aportando pistas esenciales sobre las raíces gestuales del lenguaje.',
    moduleContext: 'Etología · Comunicación y cognición',
  },
  {
    id: 'teoria-mente-primates',
    term: 'Teoría de la mente y atribución de conocimiento',
    englishTerm: 'Theory of mind & knowledge attribution',
    domain: 'sociedad-comunicacion-ecologia',
    domainLabel: 'Sociedad, comunicación y ecología',
    definition:
      'Capacidad cognitiva de inferir estados mentales ajenos —como qué ve, ignora o pretende otro individuo— y ajustar la propia comunicación o conducta estratégica en consecuencia.',
    ethologyContext:
      'Evidenciada en chimpancés de Budongo que emiten alertas de serpiente específicamente ante compañeros desinformados y en pruebas de mirada anticipatoria.',
    moduleContext: 'Etología · Comunicación y cognición',
  },
  {
    id: 'caza-cooperativa-chimpances',
    term: 'Caza cooperativa por roles',
    englishTerm: 'Role-differentiated cooperative hunting',
    domain: 'sociedad-comunicacion-ecologia',
    domainLabel: 'Sociedad, comunicación y ecología',
    definition:
      'Estrategia depredadora grupal en la que varios individuos coordinan trayectorias complementarias (ojeador, bloqueador, perseguidor y emboscador) y posteriormente reparten la carne atendiendo a la participación y a las alianzas sociales.',
    ethologyContext:
      'Estudiada en profundidad en el Parque Nacional de Taï (Costa de Marfil) sobre colobos rojos (Piliocolobus badius) por Christophe Boesch.',
    moduleContext: 'Etología · Sociedad y cooperación',
  },
  {
    id: 'kit-cultural-compuesto',
    term: 'Kit cultural compuesto (herramientas secuenciales)',
    englishTerm: 'Composite sequential toolkit',
    domain: 'sociedad-comunicacion-ecologia',
    domainLabel: 'Sociedad, comunicación y ecología',
    definition:
      'Conjunto de dos o más útiles diferentes empleados en un orden fijo y complementario para completar una misma tarea extractiva, a menudo fabricados con materias primas vegetales distintas.',
    ethologyContext:
      'Ejemplificado por los chimpancés de Goualougo (Congo), que combinan palos perforadores y sondas herbáceas deshilachadas en pincel para pescar termitas.',
    moduleContext: 'Etología · Culturas ecológicas africanas',
  },
  {
    id: 'zoofarmacognosia',
    term: 'Zoofarmacognosia (automedicación animal)',
    englishTerm: 'Zoopharmacognosy / animal self-medication',
    domain: 'sociedad-comunicacion-ecologia',
    domainLabel: 'Sociedad, comunicación y ecología',
    definition:
      'Selección e ingestión —o aplicación tópica— de plantas, médulas amargas o insectos sin valor energético significativo con el fin de expulsar parásitos intestinales, aliviar infecciones o tratar heridas.',
    ethologyContext:
      'Documentada en Mahale, Kibale, Budongo y Loango (Vernonia amygdalina y deglución entera de hojas híspidas), con notables paralelismos con la farmacopea tradicional africana.',
    moduleContext: 'Etología · Culturas ecológicas africanas',
  },
  {
    id: 'adaptacion-sabana-fongoli',
    term: 'Adaptación primate a la sabana abierta',
    englishTerm: 'Savanna primate adaptation',
    domain: 'sociedad-comunicacion-ecologia',
    domainLabel: 'Sociedad, comunicación y ecología',
    definition:
      'Conjunto de respuestas conductuales y ecológicas que permiten a grandes simios habitar mosaicos secos de sabana con alto estrés térmico: uso de cuevas, actividad nocturna, áreas de campeo amplias y caza con lanzas de madera.',
    ethologyContext:
      'Observada en Fongoli (Senegal) por Jill Pruetz; constituye el principal modelo vivo de cómo los primeros homininos africanos colonizaron paisajes abiertos.',
    moduleContext: 'Etología · Culturas ecológicas africanas',
  },
];
