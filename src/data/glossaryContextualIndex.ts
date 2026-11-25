import { GLOSSARY_TERMS, type GlossaryTerm } from './glossary';
import { ETHOLOGY_GLOSSARY_TERMS } from './ethologyGlossary';
import {
  COURSE_CHAPTERS,
  getBlockForChapter,
  getBlockMeta,
  getChapterMeta,
  normalizeSearchText,
  type CourseDeepAction,
} from './courseNavigation';
import {
  IRON_SITES,
  KINGDOMS_DATA,
  KINGDOMS_ORDER,
  ORIGINS_DATA,
  ORIGINS_ORDER,
  SOURCES_DATA,
  SOURCES_ORDER,
  TRADE_DATA,
} from './curriculum';
import { ANTHROPOLOGY_SYLLABUS_TOPICS } from './anthropologySyllabusData';
import { ATLAS_TAXONES } from './atlasPaleo';
import { DIAGNOSTIC_MARKERS, MOLECULAR_CASE_STUDIES } from './paleomolecularData';
import {
  HENKE_2026_TASKS,
  OLDOWAN_BRIDGE_CASES,
  PRIMATE_TRADITIONS,
  SOCIAL_LEARNING_MECHANISMS,
} from './ethologyData';
import {
  AFRICAN_CULTURAL_VARIANTS,
  COGNITION_COMMUNICATION_PILLARS,
  ECOLOGICAL_CULTURE_PILLARS,
  SOCIAL_SYSTEM_PROFILES,
} from './ethologyExtendedData';
import {
  GENEALOGY_PHASES,
  ICON_DECONSTRUCTIONS,
  LEXICAL_ENTRIES,
  SCIENCE_VS_MYTH_CASES,
} from './cannibalismStereotypesData';
import {
  AFRICAN_VISUAL_FILMS,
  VISUAL_METHODOLOGY_AXES,
} from './visualAnthropologyAfricaData';
import {
  COUNTER_NARRATIVE_DOMAINS,
  CULTURAL_STUDIES_THEORISTS,
  DECODING_ARTIFACTS,
  MYSTERIOUS_AFRICA_TROPES,
} from './culturalStudiesAfricaData';
import { PASTWOMEN_EVOLUTION_STAGES } from './pastwomenEvolutionData';
import { SMITHSONIAN_MILESTONES } from './smithsonianHumanOriginsData';

export interface ContextualCourseMention {
  id: string;
  sectionId: string;
  blockRoman: string;
  blockTitle: string;
  sectionLabel: string;
  itemTitle: string;
  snippet: string;
  matchedPhrase: string;
  matchType: 'referencia-directa' | 'mencion-textual' | 'modulo-asociado';
  action: CourseDeepAction;
}

export interface ExtendedGlossaryProfile {
  extendedDefinition: string;
  keyPoints: string[];
  englishTerm?: string;
  domainContext?: string;
  relatedTerms: GlossaryTerm[];
  mentions: ContextualCourseMention[];
}

interface CuratedExtendedNote {
  extendedDefinition: string;
  keyPoints: string[];
  relatedTermIds: string[];
}

const CURATED_EXTENDED_NOTES: Record<string, CuratedExtendedNote> = {
  'adn-antiguo': {
    extendedDefinition:
      'En el estudio de África, la paleogenómica ha transformado nuestra comprensión de la historia humana profunda: la extracción de ADN endógeno en el hueso petroso de yacimientos como Taforalt (Marruecos, ~15 ka), Shum Laka (Camerún) y Ballito Bay (Sudáfrica) ha demostrado la enorme profundidad de las divergencias poblacionales dentro del continente, la presencia de «linajes fantasma» y los límites térmicos que hacen imprescindible complementar el ADN con la paleoproteómica en fósiles más antiguos.',
    keyPoints: [
      'Autenticado mediante firmas químicas de daño post mortem (desaminación C→T en extremos 5′).',
      'En climas cálidos africanos suele degradarse por debajo de ~20–50 ka, frente a >1 Ma en permafrost.',
      'Complementa la morfología craneal y la arqueología para reconstruir migraciones y mestizajes.',
    ],
    relatedTermIds: ['paleoproteomica', 'desaminacion-adn', 'hueso-petroso', 'linaje-fantasma'],
  },
  'bosque-galeria': {
    extendedDefinition:
      'Superando el viejo mito de que la evolución humana ocurrió únicamente en una sabana seca y uniforme, la paleobotánica africana demuestra que los primeros homininos (Sahelanthropus, Ardipithecus, Australopithecus) prosperaron en mosaicos dinámicos de bosques galería ribereños, arboledas abiertas y pastizales estacionales.',
    keyPoints: [
      'Combina recursos arbóreos (frutos, hojas, refugio nocturno) con alimentos de claros herbáceos.',
      'Se reconstruye mediante polen fósil, fitolitos de palmeras/gramíneas y paleosuelos carbonatados.',
    ],
    relatedTermIds: ['flora-c3-c4', 'fitolitos', 'palinologia', 'seleccion-variabilidad'],
  },
  'ciclos-orbitales': {
    extendedDefinition:
      'La precesión orbital (~23.000 años) intensifica periódicamente el monzón africano, transformando el desierto del Sáhara en una red de lagos, ríos y sabanas arboladas («Sáhara verde»). Estas ventanas húmedas actuaron como bombas climáticas que conectaron el Magreb, el Sahel y el Valle del Rift, haciendo viable tanto el origen panafricano de Homo sapiens como el pastoralismo temprano del Holoceno.',
    keyPoints: [
      'Explica los episodios del «Sáhara verde» documentados por paleolagos y arte rupestre (Tassili, Acacus).',
      'Alternó fases de conectividad genética continental con fases áridas de aislamiento poblacional.',
    ],
    relatedTermIds: [
      'modelo-multirregional-africano',
      'neolitizacion-africana',
      'seleccion-variabilidad',
    ],
  },
  clado: {
    extendedDefinition:
      'En sistemática filogenética moderna, la evolución humana ya no se representa como una escalera lineal («Marcha del Progreso»), sino como un árbol frondoso de clados coexistentes. Comprender la diferencia entre clados monofiléticos y grados adaptativos evita interpretar erróneamente especies contemporáneas como antepasados directos unos de otros.',
    keyPoints: [
      'Un clado válido incluye necesariamente al ancestro común y a todos sus descendientes sin excepción.',
      'En el Plio-Pleistoceno africano coexistieron varios linajes homininos en los mismos paisajes del Rift.',
    ],
    relatedTermIds: ['monofilia', 'hominino-hominoideo', 'taxon'],
  },
  'datacion-radiometrica': {
    extendedDefinition:
      'La geología tectónica del Valle del Rift de África Oriental ofrece una ventaja excepcional para la paleoantropología: las erupciones periódicas sellaron los yacimientos entre capas de ceniza volcánica (tobas) ricas en potasio. Al medir la desintegración de potasio-40 a argón-40 (40Ar/39Ar), se obtienen cronologías de alta precisión para fósiles como Australopithecus afarensis, Homo habilis u Omo I (≥233 ka).',
    keyPoints: [
      'Fecha las cenizas volcánicas que enmarcan los estratos fósiles (datación por acotación estratigráfica).',
      'Permitió reevaluar Omo Kibish I hasta ≥233 ± 22 ka (Vidal et al., 2022).',
    ],
    relatedTermIds: ['ma-ka', 'tafonomia', 'paleosuelos'],
  },
  'efecto-fundador': {
    extendedDefinition:
      'El patrón global de diversidad genética humana desciende de forma progresiva conforme aumenta la distancia geográfica desde África. Este gradiente demuestra que toda la humanidad fuera de África deriva de un subconjunto reducido de poblaciones africanas que se expandieron hace ~50–70 ka, confirmando que la mayor parte de la diversidad biológica de nuestra especie reside dentro del propio continente africano.',
    keyPoints: [
      'África concentra más del 85 % de la variabilidad genética humana actual.',
      'Desmonta científicamente el concepto biológico de «razas» humanas discretas.',
    ],
    relatedTermIds: ['modelo-multirregional-africano', 'flujo-genico', 'adn-antiguo'],
  },
  equifinalidad: {
    extendedDefinition:
      'Uno de los grandes retos de la arqueología y la tafonomía del Pleistoceno africano es evitar inferencias precipitadas: una fractura ósea, una acumulación de piedras o unas estrías superficiales pueden originarse por agentes muy distintos (carnívoros, pisoteo, corrientes fluviales o actividad hominina). La arqueología de primates añade una capa crucial al mostrar que chimpancés y capuchinos también producen lascas involuntarias por percusión sobre yunque.',
    keyPoints: [
      'Obliga a contrastar múltiples líneas de evidencia (microscopía, contexto sedimentario y experimentación).',
      'Clave en el debate sobre las marcas de corte tempranas y la identificación de industrias líticas.',
    ],
    relatedTermIds: ['tafonomia', 'arqueologia-primates', 'percusion-bipolar-yunque'],
  },
  fitolitos: {
    extendedDefinition:
      'A diferencia del polen orgánico —que se oxida rápidamente en suelos tropicales secos o alcalinos—, los fitolitos son cuerpos minerales de ópalo silíceo capaces de sobrevivir millones de años en sedimentos del Rift y en el sarro dental de homininos. Su morfología permite distinguir gramíneas de sabana abierta (C4), palmeras y árboles dicotiledóneos (C3).',
    keyPoints: [
      'Aportan una señal vegetal estrictamente local (in situ), complementaria al transporte aéreo del polen.',
      'Recuperados en cálculo dental fósil revelan plantas concretas consumidas por Australopithecus y Homo.',
    ],
    relatedTermIds: ['palinologia', 'flora-c3-c4', 'paleosuelos', 'isotopos-carbono'],
  },
  'flora-c3-c4': {
    extendedDefinition:
      'A partir de hace unos 8–4 millones de años, la expansión progresiva de gramíneas tropicales C4 reconfiguró los ecosistemas del este y sur de África. El análisis isotópico del esmalte dental muestra cómo muchos homininos tempranos incorporaron gradualmente recursos C4 (gramíneas, juncias, tubérculos o herbívoros que las consumían), ampliando su flexibilidad dietética frente a los grandes simios estrictamente forestales (C3).',
    keyPoints: [
      'Plantas C3: árboles, arbustos y frutos de dosel forestal (valores de δ13C más negativos).',
      'Plantas C4: gramíneas tropicales de sabana abierta y ciperáceas (valores de δ13C más elevados).',
    ],
    relatedTermIds: ['isotopos-carbono', 'fitolitos', 'bosque-galeria', 'seleccion-variabilidad'],
  },
  'flujo-genico': {
    extendedDefinition:
      'Lejos de un árbol con ramas completamente aisladas, la genómica antigua revela una historia reticulada («en trenza»): las poblaciones africanas de Homo sapiens intercambiaron genes periódicamente a escala continental, y tras la expansión fuera de África se produjeron episodios documentados de mestizaje con neandertales (~1–2 % en poblaciones euroasiáticas) y denisovanos (~3–5 % en Oceanía).',
    keyPoints: [
      'Explica la persistencia de variantes arcaicas beneficiosas (inmunidad, adaptación a la altitud).',
      'También ocurrió en sentido inverso («back-to-Africa») durante los últimos milenios.',
    ],
    relatedTermIds: ['adn-antiguo', 'modelo-multirregional-africano', 'linaje-fantasma'],
  },
  'hominino-hominoideo': {
    extendedDefinition:
      'La precisión terminológica es esencial en paleoantropología actual: antiguamente se empleaba «homínido» para referirse únicamente al linaje humano, pero la genética demostró que chimpancés y bonobos son más cercanos a nosotros que a los orangutanes. Por ello hoy Hominidae incluye a todos los grandes simios y humanos, mientras que la tribu Hominini («homininos») designa específicamente la rama humana posterior a la divergencia con Pan (~7–6 Ma).',
    keyPoints: [
      'Hominoideo (Hominoidea): gibones, orangutanes, gorilas, chimpancés, bonobos y humanos.',
      'Hominino (Hominini): Sahelanthropus, Orrorin, Ardipithecus, Australopithecus, Paranthropus y Homo.',
    ],
    relatedTermIds: ['clado', 'monofilia', 'hominizacion-humanizacion'],
  },
  'isotopos-carbono': {
    extendedDefinition:
      'Los isótopos estables de carbono (δ13C) conservados en los carbonatos de paleosuelos miden el porcentaje de cobertura arbórea frente a pradera en un paisaje pasado, mientras que medidos en el esmalte dental de un fósil indican directamente qué proporción de su dieta procedía de cadenas tróficas C3 (bosque) o C4 (sabana).',
    keyPoints: [
      'No requiere conservación de ADN ni proteínas: la señal mineral del esmalte sobrevive millones de años.',
      'Permitió descubrir que Paranthropus boisei consumía sobre todo plantas C4/ciperáceas y no solo frutos secos duros.',
    ],
    relatedTermIds: ['flora-c3-c4', 'paleosuelos', 'fitolitos'],
  },
  'ma-ka': {
    extendedDefinition:
      'Comprender las escalas temporales del tiempo profundo africano evita comprimir erróneamente procesos separados por millones de años. Mientras el bipedismo temprano se remonta a ~6–7 Ma y las primeras industrias líticas a ~3,3–2,6 Ma, la emergencia de Homo sapiens (~300 ka) ocupa apenas los últimos segundos en la metáfora del Reloj de 24 horas.',
    keyPoints: [
      '1 Ma = 1.000 ka = 1.000.000 de años antes del presente.',
      'Esencial para leer correctamente la cronología del Atlas de Paleoantropología y los límites moleculares.',
    ],
    relatedTermIds: ['datacion-radiometrica', 'modelo-multirregional-africano'],
  },
  'modelo-multirregional-africano': {
    extendedDefinition:
      'Formulado a raíz de los hallazgos de Jebel Irhoud (Marruecos, ~300 ka), Florisbad (Sudáfrica, ~260 ka) y Omo Kibish (Etiopía, ≥233 ka), este consenso científico sustituye la idea simplista de un «Edén puntual» en África Oriental por una red panafricana de poblaciones conectadas y desconectadas al ritmo de los ciclos climáticos, en la que los rasgos anatómicos y conductuales modernos aparecieron en mosaico.',
    keyPoints: [
      'Integra evidencias fósiles del Magreb, el Cuerno de África, el Rift y África Austral.',
      'Scerri et al. (2018) lo resumen como una «evolución humana estructurada en todo el continente africano».',
    ],
    relatedTermIds: ['efecto-fundador', 'ciclos-orbitales', 'flujo-genico', 'adn-antiguo'],
  },
  monofilia: {
    extendedDefinition:
      'Determinar si un género fósil es monofilético (un único origen común) o polifilético (rasgos similares adquiridos por convergencia) es uno de los debates centrales del Atlas de Paleoantropología, visible tanto en el género Paranthropus como en los primeros representantes atribuidos a Homo.',
    keyPoints: [
      'Exige diferenciar caracteres derivados compartidos (sinapomorfías) de meras convergencias adaptativas.',
    ],
    relatedTermIds: ['clado', 'taxon', 'convergencia-conductual'],
  },
  paleosuelos: {
    extendedDefinition:
      'Al quedar sepultados bajo cenizas volcánicas o sedimentos fluviales, los suelos del Plioceno y Pleistoceno africano preservan carbonatos pedogénicos, trazas de raíces (rizolitos) y microfósiles vegetales que permiten cartografiar con gran detalle dónde había lagos, bosques ribereños o praderas secas.',
    keyPoints: [
      'Aportan el contexto ecológico directo de yacimientos como Olduvai, Koobi Fora, Hadar y Olorgesailie.',
    ],
    relatedTermIds: ['isotopos-carbono', 'fitolitos', 'palinologia'],
  },
  palinologia: {
    extendedDefinition:
      'La pared externa del polen (exina) está compuesta por esporopolenina, uno de los polímeros biológicos más resistentes de la naturaleza. Analizada en testigos de lagos del Rift y sedimentos marinos frente a las costas africanas, ofrece series continuas de cambio climático y vegetal a lo largo de cientos de miles de años.',
    keyPoints: [
      'Complementa a los fitolitos aportando una señal regional de bosques, sabanas y montañas circundantes.',
    ],
    relatedTermIds: ['fitolitos', 'paleosuelos', 'bosque-galeria'],
  },
  'seleccion-variabilidad': {
    extendedDefinition:
      'Propuesta por Rick Potts (Smithsonian Human Origins Program) a partir de las largas secuencias sedimentarias de Olorgesailie (Kenia), esta hipótesis explica que las grandes innovaciones humanas —ampliación cerebral, movilidad, redes de intercambio y tecnología versátil— fueron seleccionadas precisamente por la inestabilidad ambiental extrema del Pleistoceno africano.',
    keyPoints: [
      'Supera la hipótesis rígida de la sabana como único motor de la evolución humana.',
      'Respaldada por la transición Achelense → Middle Stone Age documentada en Olorgesailie (~320 ka).',
    ],
    relatedTermIds: ['ciclos-orbitales', 'flora-c3-c4', 'bosque-galeria'],
  },
  tafonomia: {
    extendedDefinition:
      'Antes de afirmar que un conjunto fósil representa un campamento humano, un banquete ritual o un episodio de canibalismo, la tafonomía examina sistemáticamente las marcas superficiales, la meteorización, el grado de fragmentación y la selección anatómica de los huesos para reconstruir con rigor qué ocurrió tras la muerte.',
    keyPoints: [
      'Decisiva para distinguir canibalismo prehistórico documentado (Gran Dolina, El Sidrón) de mitos coloniales.',
      'Evita confundir la ausencia de restos preservados con ausencia histórica de poblaciones.',
    ],
    relatedTermIds: ['equifinalidad', 'datacion-radiometrica', 'antropofagia-canibalismo'],
  },
  taxon: {
    extendedDefinition:
      'En paleoantropología, el descubrimiento de nuevos fósiles suele generar revisiones taxonómicas entre especialistas «agrupadores» (lumpers) y «divisores» (splitters). Conocer las sinonimias históricas permite leer tanto la bibliografía clásica del siglo XX como las publicaciones recientes sin perder la referencia al mismo fósil.',
    keyPoints: [
      'Un mismo espécimen histórico puede aparecer en manuales antiguos bajo nombres hoy en desuso.',
    ],
    relatedTermIds: ['clado', 'monofilia', 'hominino-hominoideo'],
  },
  heterarquia: {
    extendedDefinition:
      'El hallazgo arqueológico de Jenné-Jeno (delta interior del Níger, Malí, c. 250 a.C.–1400 d.C.) por Susan y Roderick McIntosh revolucionó la teoría urbana mundial: demostró que existieron ciudades africanas de decenas de miles de habitantes, con barrios gremiales especializados y comercio a larga distancia, organizadas sin monumentos reales ni coerción piramidal.',
    keyPoints: [
      'Desmonta el modelo eurocéntrico único de «ciudad = palacio + templo + muralla centralizada».',
      'Muestra la diversidad institucional de África precolonial junto a Estados centralizados como Benín o Malí.',
    ],
    relatedTermIds: ['triangulacion-fuentes'],
  },
  'triangulacion-fuentes': {
    extendedDefinition:
      'Frente al prejuicio colonial que identificaba «historia» exclusivamente con archivos escritos europeos, la historiografía africana contemporánea (Jan Vansina, Joseph Ki-Zerbo, Cheikh Anta Diop, escuela de Ibadán) consolidó una metodología rigurosa basada en cruzar fuentes orales (griots), excavaciones arqueológicas, reconstrucciones lingüísticas y manuscritos árabes, ge’ez y ajami.',
    keyPoints: [
      'Ninguna fuente es autosuficiente: cada una corrige los silencios o sesgos cronológicos de las demás.',
      'Permitió reconstruir la historia de reinos como Malí, Gran Zimbabue, Benín y la Costa Suajili.',
    ],
    relatedTermIds: ['heterarquia', 'biblioteca-colonial'],
  },
  paleoproteomica: {
    extendedDefinition:
      'Cuando el calor tropical y el paso de cientos de miles de años impiden recuperar ADN antiguo en África, las proteínas atrapadas en los cristales de hidroxiapatita del esmalte dental —como la amelogenina y la enamelina— sobreviven millones de años. Esta revolución molecular ya ha permitido analizar fósiles sudafricanos de Paranthropus robustus (~2 Ma) y Australopithecus africanus (~3,5 Ma).',
    keyPoints: [
      'Aporta determinación fiable del sexo cromosómico (AMELX/AMELY) y secuencias filogenéticas profundas.',
      'Complementa la paleogenómica ampliando el horizonte molecular en climas cálidos africanos.',
    ],
    relatedTermIds: ['amelogenina', 'zooms', 'adn-antiguo'],
  },
  amelogenina: {
    extendedDefinition:
      'Debido al dimorfismo sexual variable y a la fragmentación de los fósiles plio-pleistocenos, durante décadas fue muy difícil asignar con certeza el sexo biológico de muchos homininos. Los péptidos diagnósticos de AMELX y AMELY en el esmalte dental resuelven ese problema directamente sobre un único diente fósil.',
    keyPoints: [
      'Presencia de AMELY + AMELX indica sexo cromosómico XY; solo AMELX con cobertura suficiente indica XX.',
      'Aplicada con éxito en Swartkrans (Paranthropus robustus) y Sterkfontein (Australopithecus africanus).',
    ],
    relatedTermIds: ['paleoproteomica', 'zooms'],
  },
  zooms: {
    extendedDefinition:
      'La mayoría de los restos óseos recuperados en excavaciones paleolíticas son astillas diminutas imposibles de clasificar visualmente. ZooMS analiza en minutos el espectro de masas del colágeno tipo I para cribar miles de fragmentos y localizar restos homininos excepcionales con mínimo daño destructivo.',
    keyPoints: [
      'Técnica de cribado rápido (MALDI-TOF) clave para descubrir fósiles humanos ocultos en faunas fragmentarias.',
    ],
    relatedTermIds: ['paleoproteomica', 'amelogenina', 'adn-antiguo'],
  },
  'adn-sedimentario': {
    extendedDefinition:
      'Incluso en estratos arqueológicos donde no aparece ningún esqueleto, la sangre, el sudor, la orina o los tejidos descompuestos de los ocupantes antiguos dejaron trazas microscópicas de ADN adheridas a minerales del suelo. El sedaDNA abre la puerta a rastrear la presencia humana en secuencias completas de cuevas sin destruir fósiles.',
    keyPoints: [
      'Permite detectar múltiples especies humanas y animales en una misma columna estratigráfica.',
      'Exige controles estrictos de sala blanca y verificación de patrones de daño post mortem.',
    ],
    relatedTermIds: ['adn-antiguo', 'desaminacion-adn', 'hueso-petroso'],
  },
  'desaminacion-adn': {
    extendedDefinition:
      'Uno de los principales obstáculos históricos del ADN antiguo fue la contaminación con ADN del personal de excavación o laboratorio. La cuantificación de la desaminación de citosinas (C→T) en los extremos de las moléculas cortas actúa como «huella digital de antigüedad» indispensable para validar cada genoma fósil.',
    keyPoints: [
      'Cuanto más antiguo y cálido el contexto, mayor suele ser la fragmentación (<50–70 pb) y la señal C→T.',
    ],
    relatedTermIds: ['adn-antiguo', 'hueso-petroso', 'adn-sedimentario'],
  },
  'hueso-petroso': {
    extendedDefinition:
      'El descubrimiento de que la porción petrosa del hueso temporal (cápsula ótica) conserva hasta cien veces más ADN endógeno que las costillas o fémures desbloqueó el estudio paleogenómico en regiones cálidas y tropicales de África, donde antes resultaba casi imposible secuenciar genomas completos.',
    keyPoints: [
      'Clave para los genomas antiguos de Taforalt (Marruecos), Shum Laka (Camerún) y África Austral.',
    ],
    relatedTermIds: ['adn-antiguo', 'desaminacion-adn', 'linaje-fantasma'],
  },
  'linaje-fantasma': {
    extendedDefinition:
      'El registro fósil africano sigue siendo incompleto en amplias regiones boscosas de África Occidental y Central debido a la acidez de los suelos. Los modelos estadísticos sobre genomas actuales y antiguos (como los niños de Shum Laka, Camerún) detectan aportes genéticos de ramas humanas basales todavía no identificadas anatómicamente.',
    keyPoints: [
      'Refuerza el modelo de orígenes panafricanos estructurados frente a escenarios lineales simples.',
    ],
    relatedTermIds: ['adn-antiguo', 'flujo-genico', 'modelo-multirregional-africano'],
  },
  'hominizacion-humanizacion': {
    extendedDefinition:
      'En el programa de Antropología (Temas 01–10), ambos procesos no se conciben como etapas separadas («primero el cuerpo, luego la cultura»), sino en coevolución biocultural constante: la tecnología lítica, el fuego, la cocina y la crianza cooperativa moldearon la anatomía dental, digestiva y cerebral tanto como la biología amplió nuestras posibilidades culturales.',
    keyPoints: [
      'Hominización: transformaciones anatómicas y fisiológicas del linaje hominino.',
      'Humanización: emergencia del simbolismo, lenguaje, normas, cuidados y cultura acumulativa.',
    ],
    relatedTermIds: ['cultura-antropologica', 'hominino-hominoideo', 'bipedismo-carrera-resistencia'],
  },
  'cultura-antropologica': {
    extendedDefinition:
      'Lejos del uso coloquial restringido a «alta cultura», la antropología define la cultura como el entramado simbólico y práctico mediante el cual toda sociedad humana organiza su subsistencia, parentesco, lengua, cosmos y ética. El diálogo con la primatología africana muestra raíces evolutivas de las tradiciones sociales, mientras subraya el salto humano hacia la acumulación simbólica e institucional.',
    keyPoints: [
      'Es aprendida, compartida, simbólica, dinámica e históricamente situada (nunca estática ni biológica).',
      'Impide clasificar sociedades africanas como «carentes de cultura» o detenidas en el tiempo.',
    ],
    relatedTermIds: ['hominizacion-humanizacion', 'ritos-de-paso', 'conformidad-cultural'],
  },
  'bipedismo-carrera-resistencia': {
    extendedDefinition:
      'La anatomía poscraneal del género Homo revela una transformación profunda respecto a los primeros bípedos facultativos: no solo caminamos erguidos con gran economía energética, sino que desarrollamos una arquitectura biomecánica singular para la carrera de resistencia bajo calor tropical (termoregulación por sudoración, tendón de Aquiles elástico, pelvis estabilizada y ligamento nucal).',
    keyPoints: [
      'Fase 1 (~7–3,6 Ma): bipedismo habitual en bosques-mosaico (Ardipithecus, Australopithecus, Laetoli).',
      'Fase 2 (~2 Ma): especialización corredora y migratoria en Homo erectus / ergaster.',
    ],
    relatedTermIds: [
      'pelvis-en-cuenca',
      'lordosis-lumbar',
      'foramen-magnum-ligamento-nucal',
      'tendon-aquiles-arco-plantar',
    ],
  },
  'ritos-de-paso': {
    extendedDefinition:
      'El antropólogo Victor Turner profundizó el esquema tripartito de Van Gennep a partir de su célebre trabajo de campo entre los ndembu de Zambia. Durante la fase liminal, quienes atraviesan el umbral ritual quedan suspendidos entre estatus sociales, generando lazos intensos de igualdad y solidaridad («communitas») que renuevan el orden comunitario.',
    keyPoints: [
      'Tres fases clásicas: separación, liminalidad (margen) y agregación.',
      'Muestra cómo el estudio etnográfico en África aportó conceptos universales a la teoría social.',
    ],
    relatedTermIds: ['cultura-antropologica', 'parentesco-linaje'],
  },
  'teoria-de-la-abuela': {
    extendedDefinition:
      'En contra de la visión androcéntrica que explicaba la evolución humana únicamente desde la «caza masculina», las investigaciones de Kristen Hawkes con los hadza de Tanzania y los enfoques de arqueología de los cuidados (Pastwomen) destacan el papel decisivo de la longevidad posreproductiva femenina y la crianza cooperativa (aloparentalidad) para sostener crías vulnerables y cerebros metabólicamente costosos.',
    keyPoints: [
      'Explica la rara longevidad humana tras la menopausia mediante la transferencia intergeneracional de cuidados y alimento.',
      'Conecta directamente la biología evolutiva (Tema 09) con la organización del parentesco y los cuidados.',
    ],
    relatedTermIds: ['parentesco-linaje', 'hominizacion-humanizacion'],
  },
  'parentesco-linaje': {
    extendedDefinition:
      'La antropología clásica construyó gran parte de su teoría del parentesco precisamente a partir de sociedades africanas (nuer, tallensi, akan, bemba, ashanti). Lejos de ser un dato meramente biológico, el parentesco estructura el acceso a la tierra, la mediación jurídica, la memoria genealógica y las alianzas políticas.',
    keyPoints: [
      'Distingue entre filiación unilineal (patrilineal o matrilineal), doble y bilateral.',
      'Desmonta la reducción simplista y colonial de las instituciones africanas a «tribus».',
    ],
    relatedTermIds: ['teoria-de-la-abuela', 'ritos-de-paso', 'cultura-antropologica'],
  },
  'neolitizacion-africana': {
    extendedDefinition:
      'África rompe el esquema euroasiático clásico («primero agricultura sedentaria, luego ganadería»). Durante el Sáhara verde, comunidades móviles domesticaron y gestionaron rebaños bovinos milenios antes de generalizar aldeas agrícolas, y posteriormente desarrollaron múltiples focos autónomos de domesticación vegetal adaptados a sabanas, bosques húmedos y tierras altas etíopes.',
    keyPoints: [
      'Cultivos domesticados en África: sorgo, mijo perla, arroz africano (Oryza glaberrima), teff, ñame y palma aceitera.',
      'El pastoralismo temprano dejó un archivo extraordinario en el arte rupestre sahariano y en la paleogenómica.',
    ],
    relatedTermIds: ['ciclos-orbitales', 'flora-c3-c4', 'paleosuelos'],
  },
  'foramen-magnum-ligamento-nucal': {
    extendedDefinition:
      'En el visor 3D de biomecánica del Tema 04 se observa con claridad cómo el desplazamiento anterior del foramen magnum permite equilibrar el cráneo sobre la columna sin grandes músculos nucales, mientras el ligamento nucal evita la oscilación brusca de la cabeza durante la carrera prolongada.',
    keyPoints: [
      'El foramen magnum adelantado ya aparece en homininos tempranos (~7–4 Ma).',
      'La inserción marcada del ligamento nucal se consolida en Homo erectus (~1,8 Ma).',
    ],
    relatedTermIds: ['bipedismo-carrera-resistencia', 'lordosis-lumbar', 'pelvis-en-cuenca'],
  },
  'lordosis-lumbar': {
    extendedDefinition:
      'La curvatura lumbar en S es una adaptación indispensable para la postura erguida sostenida y además presenta dimorfismo sexual funcional en Homo sapiens, permitiendo compensar el desplazamiento anterior del centro de gravedad durante el embarazo sin colapsar la biomecánica de la marcha.',
    keyPoints: [
      'Contrasta con la columna toracolumbar más rígida y curvada en C de los grandes simios africanos.',
    ],
    relatedTermIds: ['pelvis-en-cuenca', 'bipedismo-carrera-resistencia', 'angulo-valgo-femur'],
  },
  'pelvis-en-cuenca': {
    extendedDefinition:
      'La remodelación pélvica de los homininos representa uno de los compromisos evolutivos más célebres de nuestra especie («dilema obstétrico»): una pelvis estrecha y en cuenca optimiza la estabilidad abductora al caminar sobre dos piernas, mientras el aumento del tamaño cerebral fetal exige un canal del parto amplio y partos socialmente asistidos (enfoque Pastwomen).',
    keyPoints: [
      'Transforma los glúteos menor y medio en estabilizadores laterales durante el apoyo sobre una sola pierna.',
      'Vincula la biomecánica locomotora (Tema 04) con la cooperación social en el parto y los cuidados.',
    ],
    relatedTermIds: ['lordosis-lumbar', 'angulo-valgo-femur', 'bipedismo-carrera-resistencia'],
  },
  'angulo-valgo-femur': {
    extendedDefinition:
      'El ángulo bicondilar del fémur constituye una de las pruebas fósiles más directas de bipedismo habitual incluso cuando solo se conserva la rodilla o un fémur aislado, como ocurre en restos de Australopithecus afarensis (Hadar, ~3,2 Ma).',
    keyPoints: [
      'Sitúa los pies cerca de la línea media corporal, reduciendo el bamboleo lateral propio del chimpancé bípedo.',
    ],
    relatedTermIds: ['pelvis-en-cuenca', 'tendon-aquiles-arco-plantar', 'bipedismo-carrera-resistencia'],
  },
  'tendon-aquiles-arco-plantar': {
    extendedDefinition:
      'Mientras el pie de chimpancés y bonobos mantiene un dedo gordo oponible ideal para trepar, el pie humano perdió la capacidad prensil para convertirse en una palanca rígida y elástica capaz de reciclar energía mecánica en cada zancada.',
    keyPoints: [
      'El arco plantar y el tendón de Aquiles reducen notablemente el gasto energético en carreras largas.',
    ],
    relatedTermIds: ['bipedismo-carrera-resistencia', 'angulo-valgo-femur', 'foramen-magnum-ligamento-nucal'],
  },
  'antropofagia-canibalismo': {
    extendedDefinition:
      'Rastrear el paso de «antropófago» a «caníbal» en el Nuevo Tesoro Lexicográfico de la Lengua Española (NTLLE) y en la cartografía europea (1492–1970) demuestra cómo un malentendido lingüístico caribeño acabó trasladándose iconográficamente a África en el siglo XIX para justificar la conquista colonial, pese a la contemporaneidad de reinos complejos como Benín, Gran Zimbabue o Malí.',
    keyPoints: [
      'Separa la evidencia tafonómica prehistórica (p. ej., Gran Dolina, El Sidrón) de la propaganda imperial.',
      'Recuerda también la práctica europea de la medicina cadavérica (Mumia / Axungia hominis) en la Edad Moderna.',
    ],
    relatedTermIds: ['imaginario-colectivo', 'mito-del-salvaje', 'antropologia-visual', 'tafonomia'],
  },
  'antropologia-visual': {
    extendedDefinition:
      'En los módulos 05b y 05c, la antropología visual cumple una doble función: por un lado analiza críticamente el archivo colonial (mapas, grabados, postales y viñetas desde Roger Chartier), y por otro emplea el cine etnográfico contemporáneo (AntropologiaVisual.net, Jean Rouch, Jordi Esteva, cine africano) como forma de conocimiento compartido y diálogo intercultural.',
    keyPoints: [
      'Tríada de Chartier: prácticas materiales, representaciones simbólicas y apropiaciones por el público.',
      'Conecta el análisis de fuentes históricas (05b) con la filmografía etnográfica de África (05c).',
    ],
    relatedTermIds: ['etnoficcion', 'imaginario-colectivo', 'regimen-representacion'],
  },
  'imaginario-colectivo': {
    extendedDefinition:
      'Los imaginarios culturales sobre África —desde el «Continente Oscuro» hasta el caldero de las viñetas o el safari sin ciudadanos— no son meras fantasías inocentes: operan como filtros perceptivos que orientan la prensa, la cooperación internacional, el turismo y la memoria escolar, condicionando qué se vuelve visible y qué permanece invisibilizado.',
    keyPoints: [
      'Circula mediante iconos repetidos (grabados, novelas de aventuras, cine comercial, publicidad).',
      'Puede desactivarse contrastando el imaginario con fuentes arqueológicas y creación africana.',
    ],
    relatedTermIds: ['regimen-representacion', 'biblioteca-colonial', 'mito-del-salvaje'],
  },
  'mito-del-salvaje': {
    extendedDefinition:
      'Roger Bartra demostró que el «salvaje» europeo existía en la imaginación medieval mucho antes de los viajes ultramarinos y fue proyectado sucesivamente sobre América, el Pacífico y África. Hasta 1970 los diccionarios normativos aún asociaban «salvaje» a «pueblos sin cultura», legitimando simbólicamente la tutela colonial.',
    keyPoints: [
      'Funciona como espejo invertido para construir la identidad europea como polo «civilizado».',
      'Se desmonta comprobando la sofisticación política, jurídica y urbana de África precolonial.',
    ],
    relatedTermIds: ['antropofagia-canibalismo', 'imaginario-colectivo', 'biblioteca-colonial'],
  },
  'biblioteca-colonial': {
    extendedDefinition:
      'Valentin-Yves Mudimbe mostró que el colonialismo no solo ocupó territorios, sino también el orden del conocimiento (gnosis): enciclopedias, relatos de exploración, mapas con interiores en blanco y clasificaciones étnicas fabricaron un «África misteriosa» que todavía pesa sobre el discurso mediático y académico si no se contrasta con epistemologías y archivos africanos.',
    keyPoints: [
      'Dialoga con «geografías imaginadas» de Edward Said y la «historia única» de Chimamanda Ngozi Adichie.',
      'Su réplica histórica incluye los manuscritos de Tombuctú, la novela africana y el cine independiente.',
    ],
    relatedTermIds: ['regimen-representacion', 'codificacion-decodificacion', 'triangulacion-fuentes'],
  },
  'regimen-representacion': {
    extendedDefinition:
      'Stuart Hall analizó cómo la publicidad imperial, las exposiciones coloniales y el cine de masas no reflejan pasivamente la realidad africana, sino que producen un «espectáculo del Otro» mediante la naturalización de clichés (primitivismo, exotismo, pasividad). Cambiar las representaciones implica disputar el poder de narrar y ampliar el repertorio de voces.',
    keyPoints: [
      'Estereotipar = reducir a pocos rasgos + esencializar + fijar una frontera entre «nosotros» y el «Otro».',
      'La fotografía de estudio de Bamako (Keïta, Sidibé) y FESPACO invierten directamente este régimen.',
    ],
    relatedTermIds: ['codificacion-decodificacion', 'biblioteca-colonial', 'imaginario-colectivo'],
  },
  'codificacion-decodificacion': {
    extendedDefinition:
      'El modelo de Stuart Hall (1973) demuestra que los lectores y espectadores no son receptores pasivos: ante una portada de novela de aventuras, un titular sobre «conflictos tribales» o una campaña humanitaria paternalista, el público puede aceptar el código hegemónico (lectura dominante), matizarlo sin romper el marco (negociada) o desmontarlo críticamente desde el contra-archivo (oposicional).',
    keyPoints: [
      'Herramienta central del Laboratorio de lectura del apartado 05d (Cultural Studies).',
      'Convierte cualquier pieza cultural cotidiana en objeto de auditoría crítica en el aula.',
    ],
    relatedTermIds: ['regimen-representacion', 'biblioteca-colonial', 'antropologia-visual'],
  },
  etnoficcion: {
    extendedDefinition:
      'En películas clásicas rodadas en Níger, Ghana y Costa de Marfil (como Jaguar o Moi, un Noir), Jean Rouch integró el comentario y la imaginación de los propios participantes en el montaje final («antropología compartida»), abriendo un debate fecundo con los pioneros del cine africano independiente como Ousmane Sembène y Safi Faye.',
    keyPoints: [
      'Transforma la cámara en catalizador de diálogo intercultural y reflexividad metodológica.',
      'Eje central de la guía de método visual del apartado 05c (AntropologiaVisual.net).',
    ],
    relatedTermIds: ['antropologia-visual', 'regimen-representacion'],
  },
};

interface IndexedCourseDocument {
  id: string;
  sectionId: string;
  sectionLabel: string;
  itemTitle: string;
  text: string;
  normalizedText: string;
  explicitGlossaryIds?: string[];
  action: CourseDeepAction;
}

const STOPWORDS = new Set([
  'para',
  'como',
  'sobre',
  'entre',
  'desde',
  'hasta',
  'frente',
  'contra',
  'todo',
  'toda',
  'todos',
  'todas',
  'este',
  'esta',
  'estos',
  'estas',
  'hacia',
  'unos',
  'unas',
  'del',
  'los',
  'las',
  'por',
  'con',
  'sin',
  'que',
  'una',
  'mas',
  'muy',
  'uso',
  'tipo',
  'forma',
  'parte',
  'modo',
  'caso',
  'zona',
  'nivel',
  'africa',
  'africano',
  'africana',
  'africanos',
  'africanas',
  'humano',
  'humana',
  'humanos',
  'humanas',
  'antiguo',
  'antigua',
  'modelo',
  'sistema',
  'proceso',
]);

let cachedCourseDocs: IndexedCourseDocument[] | null = null;

function pushDoc(
  docs: IndexedCourseDocument[],
  doc: Omit<IndexedCourseDocument, 'normalizedText'>
) {
  docs.push({
    ...doc,
    normalizedText: normalizeSearchText(`${doc.itemTitle} ${doc.text}`),
  });
}

function getCourseCorpusDocs(): IndexedCourseDocument[] {
  if (cachedCourseDocs) return cachedCourseDocs;
  const docs: IndexedCourseDocument[] = [];

  // 1. Course chapters overview (excluding sec-glosario itself)
  COURSE_CHAPTERS.forEach((ch) => {
    if (ch.id === 'sec-glosario') return;
    pushDoc(docs, {
      id: `chapter-${ch.id}`,
      sectionId: ch.id,
      sectionLabel: `${ch.num} · ${ch.label}`,
      itemTitle: ch.label,
      text: ch.summary,
      action: { sectionId: ch.id },
    });
  });

  // 2. Bloque I · Origins milestones
  ORIGINS_ORDER.forEach((oid) => {
    const o = ORIGINS_DATA[oid];
    pushDoc(docs, {
      id: `origin-${oid}`,
      sectionId: 'sec-origenes',
      sectionLabel: '01 · Orígenes panafricanos',
      itemTitle: o.title,
      text: `${o.kicker}. ${o.desc} Evidencia: ${o.evid}. Impacto: ${o.imp}.`,
      explicitGlossaryIds:
        oid === 'irhoud' || oid === 'florisbad'
          ? ['modelo-multirregional-africano', 'ma-ka']
          : oid === 'ooa'
            ? ['efecto-fundador', 'flujo-genico', 'adn-antiguo']
            : oid === 'omo'
              ? ['datacion-radiometrica', 'ma-ka']
              : undefined,
      action: { sectionId: 'sec-origenes' },
    });
  });

  // 3. Bloque I · Anthropology 10 Syllabus Topics (with explicit glossaryTermIds!)
  ANTHROPOLOGY_SYLLABUS_TOPICS.forEach((topic) => {
    pushDoc(docs, {
      id: `anthro-${topic.id}`,
      sectionId: 'sec-antropologia',
      sectionLabel: `Temas 1–10 · Tema ${topic.num}`,
      itemTitle: `Tema ${topic.num} · ${topic.shortTitle}`,
      text: `${topic.officialTitle}. ${topic.leadSummary} ${topic.bodyParagraphs.join(' ')}`,
      explicitGlossaryIds: topic.glossaryTermIds.map((g) => g.id),
      action: {
        sectionId: 'sec-antropologia',
        anthropology: { topicId: topic.id, viewMode: 'detalle' },
      },
    });
  });

  // 4. Bloque I · Pastwomen & Smithsonian dossiers
  PASTWOMEN_EVOLUTION_STAGES.forEach((stage) => {
    pushDoc(docs, {
      id: `pastwomen-${stage.id}`,
      sectionId: 'sec-antropologia',
      sectionLabel: 'Antropología · Dossier Pastwomen',
      itemTitle: `${stage.eraLabel} · ${stage.title}`,
      text: `${stage.chronology}. ${stage.taxa} (${stage.africanAndGlobalSites}). ${stage.biologicalAndMaterialEvidence} ${stage.pastwomenPerspective} ${stage.maintenanceFocus}`,
      explicitGlossaryIds:
        stage.id.includes('obstetric') || stage.id.includes('parto')
          ? ['pelvis-en-cuenca', 'teoria-de-la-abuela']
          : undefined,
      action: {
        sectionId: 'sec-antropologia',
        anthropology: { viewMode: 'pastwomen' },
      },
    });
  });

  SMITHSONIAN_MILESTONES.forEach((m) => {
    pushDoc(docs, {
      id: `smithsonian-${m.id}`,
      sectionId: 'sec-antropologia',
      sectionLabel: 'Antropología · Dossier Smithsonian',
      itemTitle: `${m.ageLabel} · ${m.title}`,
      text: `${m.taxa} (${m.africanSites}). ${m.climateContext} ${m.evidenceSummary} ${m.smithsonianInsight}`,
      explicitGlossaryIds: m.title.toLowerCase().includes('variab')
        ? ['seleccion-variabilidad']
        : undefined,
      action: {
        sectionId: 'sec-antropologia',
        anthropology: { viewMode: 'smithsonian' },
      },
    });
  });

  // 5. Bloque I · Atlas de Paleoantropología (52 fossil taxa)
  ATLAS_TAXONES.forEach((taxon) => {
    pushDoc(docs, {
      id: `taxon-${taxon.id}`,
      sectionId: 'sec-atlas-paleo',
      sectionLabel: 'Atlas de Paleoantropología',
      itemTitle: `${taxon.n} (${taxon.desde}–${taxon.hasta} Ma)`,
      text: `${taxon.nota} ${taxon.geoNota ?? ''} ${taxon.etimologia ?? ''}`,
      action: {
        sectionId: 'sec-atlas-paleo',
        atlas: { tab: 'cronologia', taxonId: taxon.id },
      },
    });
  });

  // 6. Bloque II · Paleobotánica explicit anchor doc
  pushDoc(docs, {
    id: 'paleobotanica-core',
    sectionId: 'sec-atlas-paleobotanica',
    sectionLabel: 'Atlas de Paleobotánica',
    itemTitle: 'Flora C3/C4, fitolitos, palinología, paleosuelos y ciclos orbitales',
    text: 'Reconstrucción paleoambiental del Plioceno y Pleistoceno africano mediante granos de polen (palinología), fitolitos de sílice biogénico, carbonatos de paleosuelos, isótopos estables de carbono (δ13C), bosques galería en mosaico, expansión de gramíneas C4, ciclos orbitales de Milankovitch (Sáhara verde) y selección por variabilidad.',
    explicitGlossaryIds: [
      'bosque-galeria',
      'ciclos-orbitales',
      'fitolitos',
      'flora-c3-c4',
      'isotopos-carbono',
      'paleosuelos',
      'palinologia',
      'seleccion-variabilidad',
    ],
    action: { sectionId: 'sec-atlas-paleobotanica' },
  });

  // 7. Bloque II · Paleomolecular (case studies + diagnostic markers)
  MOLECULAR_CASE_STUDIES.forEach((cs) => {
    pushDoc(docs, {
      id: `mol-case-${cs.id}`,
      sectionId: 'sec-paleomolecular',
      sectionLabel: 'Paleoproteómica y Paleogenómica',
      itemTitle: `${cs.title} (${cs.ageLabel})`,
      text: `${cs.site}, ${cs.region}. ${cs.technique}. ${cs.finding} ${cs.significance} ${cs.limitNote}`,
      explicitGlossaryIds:
        cs.discipline === 'paleoproteomica'
          ? ['paleoproteomica', 'amelogenina', 'zooms']
          : ['adn-antiguo', 'hueso-petroso', 'desaminacion-adn'],
      action: { sectionId: 'sec-paleomolecular', paleomolecular: { tab: 'horizonte' } },
    });
  });

  (['paleogenomica', 'paleoproteomica'] as const).forEach((disc) => {
    DIAGNOSTIC_MARKERS[disc].forEach((mk) => {
      pushDoc(docs, {
        id: `mol-marker-${mk.id}`,
        sectionId: 'sec-paleomolecular',
        sectionLabel: 'Paleomolecular · Firmas bioquímicas',
        itemTitle: `${mk.gene} (${mk.tissue})`,
        text: `${mk.role}. ${mk.signal}. ${mk.diagnosticNote}`,
        explicitGlossaryIds:
          mk.id.includes('amel')
            ? ['amelogenina', 'paleoproteomica']
            : mk.id.includes('zooms') || mk.gene.toLowerCase().includes('col')
              ? ['zooms', 'paleoproteomica']
              : mk.id.includes('seda')
                ? ['adn-sedimentario', 'adn-antiguo']
                : ['desaminacion-adn', 'adn-antiguo'],
        action: { sectionId: 'sec-paleomolecular', paleomolecular: { tab: 'firmas' } },
      });
    });
  });

  // 8. Bloque II · Ethology (Henke tasks, traditions, learning, Oldowan bridge, extended tabs)
  HENKE_2026_TASKS.forEach((task) => {
    pushDoc(docs, {
      id: `etho-task-${task.id}`,
      sectionId: 'etologia',
      sectionLabel: 'Etología · Experimento lítico 3D',
      itemTitle: task.title,
      text: `${task.question} ${task.setupDescription} ${task.keyFinding} ${task.evolutionaryImplication}`,
      explicitGlossaryIds:
        task.id === 'task-1'
          ? ['percusion-bipolar-yunque', 'arqueologia-primates', 'etologia-comparada']
          : task.id === 'task-2'
            ? ['facilitacion-local', 'lugares-persistentes', 'cuarta-dimension-herramientas']
            : ['pistas-sociales-indirectas', 'emulacion-aprendizaje', 'cuarta-dimension-herramientas'],
      action: { sectionId: 'etologia', ethology: { tab: 'experimento' } },
    });
  });

  PRIMATE_TRADITIONS.forEach((tr) => {
    pushDoc(docs, {
      id: `etho-trad-${tr.id}`,
      sectionId: 'etologia',
      sectionLabel: 'Etología · Primates africanos y convergencia',
      itemTitle: `${tr.commonName} (${tr.species})`,
      text: `${tr.region} (${tr.fieldSites}). ${tr.behavioralTradition} ${tr.socialTransmission} ${tr.archaeologicalTrace}`,
      explicitGlossaryIds:
        tr.group === 'convergencia'
          ? ['convergencia-conductual', 'arqueologia-primates']
          : ['conformidad-cultural', 'tolerancia-social-cooperacion', 'etologia-comparada'],
      action: { sectionId: 'etologia', ethology: { tab: 'primates' } },
    });
  });

  SOCIAL_LEARNING_MECHANISMS.forEach((mech) => {
    pushDoc(docs, {
      id: `etho-learn-${mech.id}`,
      sectionId: 'etologia',
      sectionLabel: 'Etología · Aprendizaje social',
      itemTitle: `${mech.name} (${mech.englishTerm})`,
      text: `${mech.summary} ${mech.example} ${mech.archaeologicalVisibility}`,
      action: { sectionId: 'etologia', ethology: { tab: 'aprendizaje' } },
    });
  });

  OLDOWAN_BRIDGE_CASES.forEach((oc) => {
    pushDoc(docs, {
      id: `etho-oldowan-${oc.id}`,
      sectionId: 'etologia',
      sectionLabel: 'Etología · Puente Olduvayense',
      itemTitle: `${oc.site} (${oc.country}, ${oc.ageMa})`,
      text: `${oc.industry}. ${oc.lithicSignature} ${oc.ethologicalParallel} ${oc.criticalLimit}`,
      explicitGlossaryIds: [
        'lugares-persistentes',
        'transporte-decaimiento-distancia',
        'cuarta-dimension-herramientas',
      ],
      action: { sectionId: 'etologia', ethology: { tab: 'olduvayense' } },
    });
  });

  SOCIAL_SYSTEM_PROFILES.forEach((sp) => {
    pushDoc(docs, {
      id: `etho-soc-${sp.id}`,
      sectionId: 'etologia',
      sectionLabel: 'Etología · Sociedad y cooperación',
      itemTitle: `${sp.commonName} (${sp.species})`,
      text: `${sp.systemType} (${sp.fieldSites}). ${sp.hierarchyAndCoalitions} ${sp.cooperationAndSharing} ${sp.conflictResolution} ${sp.evolutionaryInsight}`,
      explicitGlossaryIds: ['fision-fusion', 'reconciliacion-consolacion', 'caza-cooperativa-chimpances'],
      action: { sectionId: 'etologia', ethology: { tab: 'sociedad' } },
    });
  });

  COGNITION_COMMUNICATION_PILLARS.forEach((p) => {
    pushDoc(docs, {
      id: `etho-cog-${p.id}`,
      sectionId: 'etologia',
      sectionLabel: 'Etología · Comunicación y cognición',
      itemTitle: p.title,
      text: `${p.subtitle}. ${p.summary} ${p.empiricalFinding} (${p.africanSites})`,
      explicitGlossaryIds: [p.glossaryTermId],
      action: { sectionId: 'etologia', ethology: { tab: 'comunicacion' } },
    });
  });

  ECOLOGICAL_CULTURE_PILLARS.forEach((p) => {
    pushDoc(docs, {
      id: `etho-eco-${p.id}`,
      sectionId: 'etologia',
      sectionLabel: 'Etología · Culturas ecológicas',
      itemTitle: p.title,
      text: `${p.summary} ${p.mechanismDetail} ${p.archaeologicalLesson} (${p.africanSites})`,
      explicitGlossaryIds: [p.glossaryTermId],
      action: { sectionId: 'etologia', ethology: { tab: 'culturas-taller' } },
    });
  });

  AFRICAN_CULTURAL_VARIANTS.forEach((v) => {
    pushDoc(docs, {
      id: `etho-var-${v.id}`,
      sectionId: 'etologia',
      sectionLabel: 'Etología · Culturas africanas',
      itemTitle: `${v.sites} (${v.countryRegion}) · ${v.variant}`,
      text: `${v.species} (${v.domainLabel}). ${v.description} ${v.transmissionNote}`,
      action: { sectionId: 'etologia', ethology: { tab: 'culturas-taller' } },
    });
  });

  // 9. Bloque III · Metallurgy, Kingdoms, Trade, Historiography
  IRON_SITES.forEach((site) => {
    pushDoc(docs, {
      id: `iron-${site.id}`,
      sectionId: 'sec-tecnologia',
      sectionLabel: '02 · Hierro y expansión bantú',
      itemTitle: `${site.name} (${site.lbl})`,
      text: `${site.name} (${site.lbl}). ${site.detail}`,
      explicitGlossaryIds: site.name.toLowerCase().includes('jenn') ? ['heterarquia'] : undefined,
      action: { sectionId: 'sec-tecnologia' },
    });
  });

  KINGDOMS_ORDER.forEach((kid) => {
    const k = KINGDOMS_DATA[kid];
    pushDoc(docs, {
      id: `kingdom-${kid}`,
      sectionId: 'sec-reinos',
      sectionLabel: '03 · Seis grandes reinos',
      itemTitle: `${k.name} (${k.spanLabel})`,
      text: `${k.title}. ${k.desc} Economía: ${k.econ}. Instituciones: ${k.inst}. Patrimonio: ${k.pat}.`,
      action: { sectionId: 'sec-reinos', kingdomId: kid },
    });
  });

  (['sahara', 'indian'] as const).forEach((net) => {
    const scenarios = TRADE_DATA[net];
    Object.entries(scenarios).forEach(([flowId, sc]) => {
      pushDoc(docs, {
        id: `trade-${net}-${flowId}`,
        sectionId: 'sec-comercio',
        sectionLabel: '04 · Redes del Sáhara e Índico',
        itemTitle: sc.title,
        text: `${sc.sub}. ${sc.cardTitle}. ${sc.cardBody} Tecnología: ${sc.tech}. Nodos: ${sc.nodes}. Intercambio cultural: ${sc.cult}.`,
        action: { sectionId: 'sec-comercio' },
      });
    });
  });

  SOURCES_ORDER.forEach((sid) => {
    const src = SOURCES_DATA[sid];
    pushDoc(docs, {
      id: `hist-${sid}`,
      sectionId: 'sec-historiografia',
      sectionLabel: '05 · Fuentes e historiografía',
      itemTitle: src.title,
      text: `${src.desc} Fortalezas: ${src.str}. Cautelas: ${src.bias}.`,
      explicitGlossaryIds: ['triangulacion-fuentes'],
      action: { sectionId: 'sec-historiografia' },
    });
  });

  // 10. Bloque III · 05b Cannibalism stereotypes
  GENEALOGY_PHASES.forEach((ph) => {
    pushDoc(docs, {
      id: `can-gene-${ph.id}`,
      sectionId: 'sec-estereotipos-canibalismo',
      sectionLabel: '05b · Estereotipos (Genealogía)',
      itemTitle: `${ph.title} (${ph.span})`,
      text: `${ph.thesis} ${ph.narrative}`,
      explicitGlossaryIds: ['antropofagia-canibalismo', 'imaginario-colectivo', 'mito-del-salvaje'],
      action: { sectionId: 'sec-estereotipos-canibalismo', cannibalism: { tab: 'genealogia' } },
    });
  });

  ICON_DECONSTRUCTIONS.forEach((ic) => {
    pushDoc(docs, {
      id: `can-icon-${ic.id}`,
      sectionId: 'sec-estereotipos-canibalismo',
      sectionLabel: '05b · Estereotipos (Iconos)',
      itemTitle: ic.title,
      text: `${ic.subtitle}. ${ic.europeanOrigin} ${ic.visualTransformation} ${ic.chartier.representacion}`,
      explicitGlossaryIds: ['antropologia-visual', 'imaginario-colectivo'],
      action: { sectionId: 'sec-estereotipos-canibalismo', cannibalism: { tab: 'iconos' } },
    });
  });

  LEXICAL_ENTRIES.slice(0, 6).forEach((lx) => {
    pushDoc(docs, {
      id: `can-lex-${lx.id}`,
      sectionId: 'sec-estereotipos-canibalismo',
      sectionLabel: '05b · Léxico NTLLE',
      itemTitle: `${lx.lemmaLabel} (${lx.yearLabel} · ${lx.source})`,
      text: `${lx.verbatimQuote} ${lx.semanticShift}`,
      explicitGlossaryIds: ['antropofagia-canibalismo', 'mito-del-salvaje'],
      action: { sectionId: 'sec-estereotipos-canibalismo', cannibalism: { tab: 'lexico' } },
    });
  });

  SCIENCE_VS_MYTH_CASES.forEach((sc) => {
    pushDoc(docs, {
      id: `can-sci-${sc.id}`,
      sectionId: 'sec-estereotipos-canibalismo',
      sectionLabel: '05b · Ciencia vs. Mito',
      itemTitle: `${sc.domain} (${sc.chronology})`,
      text: `Mito: ${sc.mythStatement} Evidencia: ${sc.scientificEvidence}`,
      explicitGlossaryIds: ['antropofagia-canibalismo', 'tafonomia'],
      action: { sectionId: 'sec-estereotipos-canibalismo', cannibalism: { tab: 'ciencia-mito' } },
    });
  });

  // 11. Bloque III · 05c Visual Anthropology of Africa
  AFRICAN_VISUAL_FILMS.forEach((film) => {
    pushDoc(docs, {
      id: `vis-film-${film.id}`,
      sectionId: 'sec-antropologia-visual',
      sectionLabel: '05c · Antropología visual (Filmografía)',
      itemTitle: `${film.title} (${film.year} · ${film.country})`,
      text: `${film.director}. ${film.peoplesAndContext}. ${film.methodology}. ${film.summary} ${film.ulpgcConnection}`,
      explicitGlossaryIds:
        film.tags.some((t) => normalizeSearchText(t).includes('etnoficcion')) ||
        normalizeSearchText(film.methodology).includes('rouch')
          ? ['etnoficcion', 'antropologia-visual']
          : ['antropologia-visual'],
      action: {
        sectionId: 'sec-antropologia-visual',
        visualAnthropology: { tab: 'filmografia', filmId: film.id },
      },
    });
  });

  VISUAL_METHODOLOGY_AXES.forEach((ax) => {
    pushDoc(docs, {
      id: `vis-axis-${ax.num}`,
      sectionId: 'sec-antropologia-visual',
      sectionLabel: '05c · Antropología visual (Método)',
      itemTitle: `${ax.num}. ${ax.title}`,
      text: `${ax.concept}. ${ax.africaApplication} Obras: ${ax.keyFilms}.`,
      explicitGlossaryIds: ax.num === '01' ? ['etnoficcion', 'antropologia-visual'] : ['antropologia-visual'],
      action: {
        sectionId: 'sec-antropologia-visual',
        visualAnthropology: { tab: 'autores-muestras' },
      },
    });
  });

  // 12. Bloque III · 05d Cultural Studies (Mysterious Africa)
  CULTURAL_STUDIES_THEORISTS.forEach((th) => {
    pushDoc(docs, {
      id: `cs-theorist-${th.id}`,
      sectionId: 'sec-cultural-studies',
      sectionLabel: '05d · Cultural Studies (Marco teórico)',
      itemTitle: `${th.author} · ${th.keyConcept}`,
      text: `${th.thesis} ${th.mysteryAfricaCritique} ${th.landmarkWork}`,
      explicitGlossaryIds:
        th.id === 'mudimbe'
          ? ['biblioteca-colonial']
          : th.id === 'stuart-hall'
            ? ['regimen-representacion', 'codificacion-decodificacion']
            : ['imaginario-colectivo'],
      action: {
        sectionId: 'sec-cultural-studies',
        culturalStudies: { tab: 'marco-teorico' },
      },
    });
  });

  MYSTERIOUS_AFRICA_TROPES.forEach((tr) => {
    pushDoc(docs, {
      id: `cs-trope-${tr.id}`,
      sectionId: 'sec-cultural-studies',
      sectionLabel: `05d · Cultural Studies (Tropo ${tr.num})`,
      itemTitle: `${tr.num}. ${tr.title}`,
      text: `${tr.historicalOrigin} ${tr.culturalMechanism} ${tr.examples} ${tr.whatItErases} ${tr.counterEvidence}`,
      explicitGlossaryIds: ['regimen-representacion', 'imaginario-colectivo'],
      action: {
        sectionId: 'sec-cultural-studies',
        culturalStudies: { tab: 'tropos', tropeId: tr.id },
      },
    });
  });

  DECODING_ARTIFACTS.forEach((art) => {
    pushDoc(docs, {
      id: `cs-dec-${art.id}`,
      sectionId: 'sec-cultural-studies',
      sectionLabel: '05d · Laboratorio Stuart Hall',
      itemTitle: `${art.formatLabel} · ${art.title}`,
      text: `${art.sampleText} ${art.readings.oposicional.summary} ${art.readings.oposicional.mechanism}`,
      explicitGlossaryIds: ['codificacion-decodificacion', 'regimen-representacion'],
      action: {
        sectionId: 'sec-cultural-studies',
        culturalStudies: { tab: 'decodificador' },
      },
    });
  });

  COUNTER_NARRATIVE_DOMAINS.forEach((dom) => {
    pushDoc(docs, {
      id: `cs-counter-${dom.id}`,
      sectionId: 'sec-cultural-studies',
      sectionLabel: '05d · Contra-narrativas africanas',
      itemTitle: `${dom.num}. ${dom.domain}`,
      text: `${dom.subtitle}. ${dom.howItSubverts} ${dom.keyCreators} ${dom.landmarkWorks.join(' ')}`,
      explicitGlossaryIds: ['biblioteca-colonial', 'regimen-representacion'],
      action: {
        sectionId: 'sec-cultural-studies',
        culturalStudies: { tab: 'contranarrativas' },
      },
    });
  });

  cachedCourseDocs = docs;
  return docs;
}

function buildSearchPhrases(term: GlossaryTerm, englishTerm?: string): string[] {
  const candidates: string[] = [];
  const raw = term.term;
  const mainPart = raw.split('(')[0].trim();
  const parenMatches = Array.from(raw.matchAll(/\(([^)]+)\)/g)).map((m) => m[1].trim());

  const addCandidate = (s: string) => {
    const norm = normalizeSearchText(s);
    if (norm.length >= 4 && !candidates.includes(norm)) {
      candidates.push(norm);
    }
  };

  addCandidate(mainPart);
  if (mainPart.includes(' frente a ')) {
    mainPart.split(' frente a ').forEach(addCandidate);
  }
  if (mainPart.includes(' y ')) {
    mainPart.split(' y ').forEach((part) => {
      if (normalizeSearchText(part).length >= 5) addCandidate(part);
    });
  }
  parenMatches.forEach((p) => {
    if (normalizeSearchText(p).length >= 4) addCandidate(p);
  });
  if (englishTerm) addCandidate(englishTerm);

  // Add significant individual tokens (length >= 6) as secondary fallback phrases
  const tokens = normalizeSearchText(mainPart)
    .split(/\s+/)
    .filter((tok) => tok.length >= 6 && !STOPWORDS.has(tok));
  tokens.forEach(addCandidate);

  return candidates;
}

function extractContextSnippet(
  originalText: string,
  normalizedPhrase: string
): { snippet: string; matchedPhrase: string } {
  const cleanText = originalText.replace(/\s+/g, ' ').trim();
  if (!normalizedPhrase) {
    const trimmed = cleanText.length > 175 ? `${cleanText.slice(0, 172).trim()}…` : cleanText;
    return { snippet: trimmed, matchedPhrase: '' };
  }

  // Build accent-insensitive index mapping back to original string positions
  let normStr = '';
  const mapToOrig: number[] = [];
  for (let i = 0; i < cleanText.length; i += 1) {
    const ch = cleanText[i]
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    for (let j = 0; j < ch.length; j += 1) {
      normStr += ch[j];
      mapToOrig.push(i);
    }
  }

  const idx = normStr.indexOf(normalizedPhrase);
  if (idx === -1) {
    const trimmed = cleanText.length > 175 ? `${cleanText.slice(0, 172).trim()}…` : cleanText;
    return { snippet: trimmed, matchedPhrase: '' };
  }

  const origStart = mapToOrig[idx] ?? 0;
  const origEnd = (mapToOrig[idx + normalizedPhrase.length - 1] ?? origStart) + 1;
  const matchedPhrase = cleanText.slice(origStart, origEnd);

  const windowStart = Math.max(0, origStart - 64);
  const windowEnd = Math.min(cleanText.length, origEnd + 96);

  let snippetStart = windowStart;
  if (windowStart > 0) {
    const nextSpace = cleanText.indexOf(' ', windowStart);
    if (nextSpace !== -1 && nextSpace < origStart) snippetStart = nextSpace + 1;
  }
  let snippetEnd = windowEnd;
  if (windowEnd < cleanText.length) {
    const prevSpace = cleanText.lastIndexOf(' ', windowEnd);
    if (prevSpace > origEnd) snippetEnd = prevSpace;
  }

  const prefix = snippetStart > 0 ? '…' : '';
  const suffix = snippetEnd < cleanText.length ? '…' : '';
  return {
    snippet: `${prefix}${cleanText.slice(snippetStart, snippetEnd).trim()}${suffix}`,
    matchedPhrase,
  };
}

function getFallbackActionForTerm(term: GlossaryTerm): CourseDeepAction {
  const ctx = normalizeSearchText(term.moduleContext);
  if (ctx.includes('cultural studies') || ctx.includes('05d')) {
    return { sectionId: 'sec-cultural-studies' };
  }
  if (ctx.includes('antropologia visual') || ctx.includes('05c')) {
    return { sectionId: 'sec-antropologia-visual' };
  }
  if (ctx.includes('canibalismo') || ctx.includes('05b')) {
    return { sectionId: 'sec-estereotipos-canibalismo' };
  }
  if (ctx.includes('historiograf') || ctx.includes('05')) {
    return { sectionId: 'sec-historiografia' };
  }
  if (ctx.includes('etologia')) {
    return { sectionId: 'etologia' };
  }
  if (ctx.includes('molecular') || ctx.includes('proteom') || ctx.includes('genom')) {
    return { sectionId: 'sec-paleomolecular' };
  }
  if (ctx.includes('paleobotan') || term.category === 'paleobotanica') {
    return { sectionId: 'sec-atlas-paleobotanica' };
  }
  if (ctx.includes('tema 04') || ctx.includes('biomecanica')) {
    return {
      sectionId: 'sec-antropologia',
      anthropology: { topicId: 'tema-04', viewMode: 'detalle' },
    };
  }
  if (ctx.includes('programa de antropologia') || ctx.includes('tema ')) {
    return { sectionId: 'sec-antropologia' };
  }
  if (ctx.includes('modulo 01') || ctx.includes('origenes')) {
    return { sectionId: 'sec-origenes' };
  }
  if (ctx.includes('modulo 02') || ctx.includes('urbanismo')) {
    return { sectionId: 'sec-tecnologia' };
  }
  if (term.category === 'etologia') {
    return { sectionId: 'etologia' };
  }
  if (term.category === 'metodos') {
    return { sectionId: 'sec-paleomolecular' };
  }
  return { sectionId: 'sec-atlas-paleo' };
}

function findRelatedTerms(term: GlossaryTerm, curatedIds?: string[]): GlossaryTerm[] {
  const resolved: GlossaryTerm[] = [];
  const seen = new Set<string>([term.id]);

  if (curatedIds) {
    for (const id of curatedIds) {
      if (seen.has(id)) continue;
      const found = GLOSSARY_TERMS.find((t) => t.id === id);
      if (found) {
        seen.add(found.id);
        resolved.push(found);
      }
    }
  }

  if (resolved.length >= 4) return resolved.slice(0, 5);

  // Automatic semantic/lexical relatedness for remaining slots
  const sourceWords = new Set(
    normalizeSearchText(`${term.term} ${term.definition}`)
      .split(/\s+/)
      .filter((w) => w.length >= 5 && !STOPWORDS.has(w))
  );

  const scored: Array<{ item: GlossaryTerm; score: number }> = [];
  for (const candidate of GLOSSARY_TERMS) {
    if (seen.has(candidate.id)) continue;
    let score = candidate.category === term.category ? 2 : 0;
    const candText = normalizeSearchText(`${candidate.term} ${candidate.definition}`);
    for (const w of sourceWords) {
      if (candText.includes(w)) score += 3;
    }
    if (score >= 5) {
      scored.push({ item: candidate, score });
    }
  }

  scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5 - resolved.length)
    .forEach((entry) => {
      if (!seen.has(entry.item.id)) {
        seen.add(entry.item.id);
        resolved.push(entry.item);
      }
    });

  return resolved;
}

export function getContextualProfileForTerm(term: GlossaryTerm): ExtendedGlossaryProfile {
  const docs = getCourseCorpusDocs();
  const ethologyEntry = ETHOLOGY_GLOSSARY_TERMS.find((e) => e.id === term.id);
  const curated = CURATED_EXTENDED_NOTES[term.id];

  const phrases = buildSearchPhrases(term, ethologyEntry?.englishTerm);
  const primaryPhrase = phrases[0] ?? '';

  const scoredMentions: Array<{
    doc: IndexedCourseDocument;
    score: number;
    matchedPhrase: string;
    matchType: ContextualCourseMention['matchType'];
  }> = [];

  for (const doc of docs) {
    const isExplicit = Boolean(doc.explicitGlossaryIds?.includes(term.id));
    let matchedPhrase = '';
    let textScore = 0;

    for (let i = 0; i < phrases.length; i += 1) {
      const p = phrases[i];
      if (doc.normalizedText.includes(p)) {
        const isMultiWord = p.includes(' ');
        const candidateScore = i === 0 ? 70 : isMultiWord ? 55 : 30;
        if (candidateScore > textScore) {
          textScore = candidateScore;
          matchedPhrase = p;
        }
      }
    }

    if (isExplicit || textScore > 0) {
      scoredMentions.push({
        doc,
        score: (isExplicit ? 100 : 0) + textScore,
        matchedPhrase: matchedPhrase || primaryPhrase,
        matchType: isExplicit ? 'referencia-directa' : 'mencion-textual',
      });
    }
  }

  scoredMentions.sort((a, b) => b.score - a.score);

  // Deduplicate by target destination (keep highest-ranked occurrence per unique section/subview)
  const mentions: ContextualCourseMention[] = [];
  const seenKeys = new Set<string>();
  const sectionCounts: Record<string, number> = {};

  for (const entry of scoredMentions) {
    const actionKey = JSON.stringify(entry.doc.action);
    if (seenKeys.has(actionKey)) continue;
    const perSectionCount = sectionCounts[entry.doc.sectionId] ?? 0;
    if (perSectionCount >= 3) continue; // Keep diversity across blocks/sections

    seenKeys.add(actionKey);
    sectionCounts[entry.doc.sectionId] = perSectionCount + 1;

    const blockId = getBlockForChapter(entry.doc.sectionId);
    const blockMeta = getBlockMeta(blockId);
    const { snippet, matchedPhrase } = extractContextSnippet(entry.doc.text, entry.matchedPhrase);

    mentions.push({
      id: entry.doc.id,
      sectionId: entry.doc.sectionId,
      blockRoman: blockMeta.roman,
      blockTitle: blockMeta.shortTitle,
      sectionLabel: entry.doc.sectionLabel,
      itemTitle: entry.doc.itemTitle,
      snippet,
      matchedPhrase,
      matchType: entry.matchType,
      action: entry.doc.action,
    });

    if (mentions.length >= 10) break;
  }

  // Always guarantee at least 1 relevant direct module link even for rare DEA corpus terms
  if (mentions.length === 0) {
    const fallbackAction = getFallbackActionForTerm(term);
    const chapter = getChapterMeta(fallbackAction.sectionId);
    const blockMeta = getBlockMeta(chapter.blockId);
    mentions.push({
      id: `fallback-${term.id}`,
      sectionId: chapter.id,
      blockRoman: blockMeta.roman,
      blockTitle: blockMeta.shortTitle,
      sectionLabel: `${chapter.num} · ${chapter.label}`,
      itemTitle: chapter.label,
      snippet: chapter.summary,
      matchedPhrase: '',
      matchType: 'modulo-asociado',
      action: fallbackAction,
    });
  }

  const relatedTerms = findRelatedTerms(term, curated?.relatedTermIds);

  // Build extended academic definition & takeaways
  let extendedDefinition = curated?.extendedDefinition ?? '';
  let keyPoints = curated?.keyPoints ?? [];

  if (!extendedDefinition && ethologyEntry) {
    extendedDefinition = `${ethologyEntry.ethologyContext} En el marco del Diploma de Estudios Africanos, este concepto vincula la observación de campo en primates africanos con la interpretación del comportamiento, el paisaje y la cultura material en los orígenes humanos.`;
    keyPoints = [
      `Ámbito etológico: ${ethologyEntry.domainLabel} (${ethologyEntry.englishTerm}).`,
      `Referencia del curso: ${ethologyEntry.moduleContext}.`,
    ];
  }

  if (!extendedDefinition) {
    const firstMention = mentions[0];
    const relatedNames = relatedTerms
      .slice(0, 3)
      .map((t) => t.term.split('(')[0].trim())
      .join(', ');
    extendedDefinition = `Término técnico del corpus de ${term.categoryLabel} (${term.moduleContext}). En el temario del Módulo I se relaciona directamente con ${firstMention.sectionLabel} (${firstMention.itemTitle})${
      relatedNames ? ` y dialoga conceptualmente con ${relatedNames}.` : '.'
    }`;
    keyPoints = [
      `Disciplina principal: ${term.categoryLabel}.`,
      `Sección prioritaria de consulta: Bloque ${firstMention.blockRoman} · ${firstMention.sectionLabel}.`,
    ];
  }

  return {
    extendedDefinition,
    keyPoints,
    englishTerm: ethologyEntry?.englishTerm,
    domainContext: ethologyEntry?.domainLabel,
    relatedTerms,
    mentions,
  };
}
