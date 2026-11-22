import { DEA_RAW_GLOSSARY } from './deaGlossary';
import { ETHOLOGY_GLOSSARY_TERMS } from './ethologyGlossary';

export type GlossaryCategory = 'paleoantropologia' | 'paleobotanica' | 'metodos' | 'etologia';

export interface GlossaryTerm {
  id: string;
  term: string;
  category: GlossaryCategory;
  categoryLabel: string;
  definition: string;
  moduleContext: string;
}

export const GLOSSARY_CATEGORIES: Array<{ id: GlossaryCategory | 'todos'; label: string }> = [
  { id: 'todos', label: 'Todos los términos' },
  { id: 'paleoantropologia', label: 'Paleoantropología' },
  { id: 'paleobotanica', label: 'Paleobotánica y Clima' },
  { id: 'etologia', label: 'Etología y Primatología' },
  { id: 'metodos', label: 'Métodos y Datación' },
];

const CURATED_MODULE_TERMS: GlossaryTerm[] = [
  {
    id: 'adn-antiguo',
    term: 'ADN antiguo (paleogenómica)',
    category: 'metodos',
    categoryLabel: 'Métodos y Datación',
    definition:
      'Disciplina que recupera y secuencia fragmentos degradados de material genético conservados en restos fósiles o subfósiles. Permite reconstruir parentescos, migraciones y episodios de mestizaje invisibles para la morfología ósea, aunque su conservación decae con el calor y el paso del tiempo (alcanzando habitualmente cientos de miles de años).',
    moduleContext: 'Módulo 01 · Atlas Paleo (Métodos)',
  },
  {
    id: 'bosque-galeria',
    term: 'Bosque galería y mosaico ecológico',
    category: 'paleobotanica',
    categoryLabel: 'Paleobotánica y Clima',
    definition:
      'Formación vegetal ribereña densa que acompaña cursos fluviales o cuencas lacustres en medio de paisajes más abiertos. En el Plioceno africano, estos mosaicos combinaban dosel arbóreo (frutos, refugio) con claros herbáceos, clave para comprender el entorno de Ardipithecus y los primeros Australopithecus.',
    moduleContext: 'Atlas de Paleobotánica · Biomas',
  },
  {
    id: 'ciclos-orbitales',
    term: 'Ciclos orbitales (Milankovitch) y Sáhara verde',
    category: 'paleobotanica',
    categoryLabel: 'Paleobotánica y Clima',
    definition:
      'Variaciones periódicas en la órbita e inclinación terrestre que modulan la insolación estacional y el régimen monzónico africano. Estas oscilaciones abrieron periódicamente fases húmedas («Sáhara verde») con lagos, ríos y corredores vegetales que facilitaron la conectividad poblacional y las dispersiones.',
    moduleContext: 'Módulo 01 · Atlas de Paleobotánica',
  },
  {
    id: 'clado',
    term: 'Clado',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'Agrupación evolutiva formada por un antepasado común y la totalidad de sus descendientes. En el Atlas de Paleoantropología los grupos presentados (basales, Australopithecus, Kenyanthropus, Paranthropus y Homo) combinan clados bien apoyados con agrupaciones convencionales cuya monofilia sigue en debate.',
    moduleContext: 'Atlas Paleo · Cronología y Parentesco',
  },
  {
    id: 'datacion-radiometrica',
    term: 'Datación radiométrica (K-Ar y 40Ar/39Ar)',
    category: 'metodos',
    categoryLabel: 'Métodos y Datación',
    definition:
      'Conjunto de técnicas de datación absoluta basadas en la desintegración a ritmo constante de isótopos radiactivos en minerales volcánicos. En el Rift de África Oriental, el método potasio-argón y argón-argón fecha las capas de ceniza volcánica (tobas) situadas por encima y por debajo de los fósiles.',
    moduleContext: 'Atlas Paleo · Métodos inferenciales',
  },
  {
    id: 'efecto-fundador',
    term: 'Efecto fundador (cuello de botella genético)',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'Pérdida de diversidad genética que ocurre cuando una nueva población se establece a partir de un subconjunto reducido de una población mayor. Explica por qué la salida de pequeños grupos de Homo sapiens fuera de África (~50–70 ka) dejó en el continente africano más del 85 % de la variabilidad genética humana actual.',
    moduleContext: 'Módulo 01 · Orígenes panafricanos',
  },
  {
    id: 'equifinalidad',
    term: 'Equifinalidad',
    category: 'metodos',
    categoryLabel: 'Métodos y Datación',
    definition:
      'Principio tafonómico según el cual procesos distintos —por ejemplo, una herramienta lítica, la mordedura de un carnívoro o la abrasión por sedimentos— pueden producir marcas o patrones morfológicos semejantes sobre un hueso fósil, exigiendo análisis microscópicos y cautela interpretativa.',
    moduleContext: 'Atlas Paleo · Tafonomía',
  },
  {
    id: 'fitolitos',
    term: 'Fitolitos',
    category: 'paleobotanica',
    categoryLabel: 'Paleobotánica y Clima',
    definition:
      'Partículas microscópicas de sílice biogénico que se forman en las células de muchas plantas (especialmente gramíneas y palmeras) y se conservan en sedimentos, paleosuelos y cálculo dental fósil incluso cuando el polen se destruye. Permiten reconstruir la flora local y la dieta vegetal de homininos.',
    moduleContext: 'Atlas de Paleobotánica · Indicadores',
  },
  {
    id: 'flora-c3-c4',
    term: 'Flora C3 y gramíneas C4',
    category: 'paleobotanica',
    categoryLabel: 'Paleobotánica y Clima',
    definition:
      'Dos grandes rutas fotosintéticas de las plantas terrestres. Las plantas C3 predominan en árboles, arbustos y bosques templados o húmedos, mientras que las plantas C4 (principalmente gramíneas tropicales de sabana abierta y ciertas ciperáceas) prosperan en climas cálidos, soleados y más áridos.',
    moduleContext: 'Atlas de Paleobotánica · Evolución de la flora',
  },
  {
    id: 'flujo-genico',
    term: 'Flujo génico (introgresión)',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'Transferencia de variantes genéticas entre poblaciones o linajes diferenciados mediante cruzamiento. La paleogenómica ha confirmado episodios de flujo génico entre Homo sapiens que salieron de África, neandertales y denisovanos, así como interacciones profundas dentro de la propia África.',
    moduleContext: 'Módulo 01 · Atlas Paleo (Parentesco)',
  },
  {
    id: 'hominino-hominoideo',
    term: 'Hominino frente a Hominoideo',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      '«Hominoideo» designa a toda la superfamilia de simios sin cola (gibones, orangutanes, gorilas, chimpancés, humanos y sus parientes fósiles como Proconsul). «Hominino» se restringe a la rama evolutiva más próxima a nuestra especie tras la divergencia con el linaje de los chimpancés (~7–6 Ma).',
    moduleContext: 'Atlas Paleo · Cronología y Parentesco',
  },
  {
    id: 'isotopos-carbono',
    term: 'Isótopos estables de carbono (δ13C)',
    category: 'paleobotanica',
    categoryLabel: 'Paleobotánica y Clima',
    definition:
      'Proporción relativa entre los isótopos estables 13C y 12C medida en carbonatos de paleosuelos o en el esmalte dental fósil. Como las plantas C3 (bosque) y C4 (sabana) discriminan de manera distinta el 13C, su firma química revela tanto la cobertura vegetal del paisaje como la dieta de los homininos.',
    moduleContext: 'Atlas de Paleobotánica · Clima y dieta',
  },
  {
    id: 'ma-ka',
    term: 'Ma y ka (unidades geocronológicas)',
    category: 'metodos',
    categoryLabel: 'Métodos y Datación',
    definition:
      'Abreviaturas científicas internacionales para expresar edades antes del presente: «Ma» equivale a millones de años (p. ej., ~3,2 Ma para Australopithecus afarensis) y «ka» equivale a miles de años (p. ej., ~300 ka para Jebel Irhoud).',
    moduleContext: 'Módulo 01 · Atlas Paleo (Cronología)',
  },
  {
    id: 'modelo-multirregional-africano',
    term: 'Modelo multirregional africano (origen panafricano)',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'Marco evolutivo actual según el cual Homo sapiens no emergió en un único punto aislado de África Oriental, sino en una red de poblaciones subdivididas por todo el continente (Magreb, valle del Rift, África Austral) que evolucionaron en mosaico e intercambiaron genes cuando el clima abría corredores.',
    moduleContext: 'Módulo 01 · Orígenes panafricanos',
  },
  {
    id: 'monofilia',
    term: 'Monofilia',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'Propiedad de un grupo taxonómico cuyos miembros descienden todos de un mismo antepasado común exclusivo. En paleoantropología se debate, por ejemplo, si Paranthropus es monofilético o si sus rasgos masticatorios robustos surgieron de forma independiente por convergencia adaptativa.',
    moduleContext: 'Atlas Paleo · Parentesco',
  },
  {
    id: 'paleosuelos',
    term: 'Paleosuelos',
    category: 'paleobotanica',
    categoryLabel: 'Paleobotánica y Clima',
    definition:
      'Suelos antiguos sepultados y preservados en el registro geológico. Su mineralogía, nódulos de carbonato, marcas de raíces fósiles y contenido en fitolitos constituyen un archivo directo de la precipitación, la cubierta vegetal y el drenaje de los paisajes habitados por los homininos.',
    moduleContext: 'Atlas de Paleobotánica · Clima y ecología',
  },
  {
    id: 'palinologia',
    term: 'Palinología',
    category: 'paleobotanica',
    categoryLabel: 'Paleobotánica y Clima',
    definition:
      'Estudio de granos de polen y esporas fósiles recuperados de sedimentos lacustres, turberas o depósitos marinos. Permite reconstruir secuencias temporales de cambio florístico (expansión o retracción de bosques, palmeras y gramíneas) en relación con los ciclos climáticos.',
    moduleContext: 'Atlas de Paleobotánica · Proxies vegetales',
  },
  {
    id: 'seleccion-variabilidad',
    term: 'Selección por variabilidad',
    category: 'paleobotanica',
    categoryLabel: 'Paleobotánica y Clima',
    definition:
      'Hipótesis formulada por Rick Potts (1998) que propone que el motor ambiental clave de la evolución humana no fue la adaptación a un único hábitat estable (bosque o sabana), sino la fluctuación climática y vegetal constante, favoreciendo rasgos de flexibilidad dietética, conductual y cognitiva.',
    moduleContext: 'Atlas Paleo · Atlas de Paleobotánica',
  },
  {
    id: 'tafonomia',
    term: 'Tafonomía',
    category: 'metodos',
    categoryLabel: 'Métodos y Datación',
    definition:
      'Estudio de todos los procesos biológicos, químicos y geológicos que afectan a un resto orgánico (hueso o planta) desde la muerte hasta su descubrimiento en excavación. Es indispensable para separar la señal biológica o conductual del ruido introducido por el transporte, los carroñeros o la erosión.',
    moduleContext: 'Atlas Paleo · Métodos inferenciales',
  },
  {
    id: 'taxon',
    term: 'Táxon (y sinonimia taxonómica)',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'Unidad de clasificación biológica de cualquier rango (género, especie o población en estudio). La sinonimia histórica ocurre cuando un fósil recibió un nombre antiguo (como Pithecanthropus erectus o Zinjanthropus boisei) que hoy se agrupa dentro de otro táxon reconocido.',
    moduleContext: 'Atlas Paleo · Fichas y Sinónimos',
  },
  {
    id: 'heterarquia',
    term: 'Heterarquía urbana',
    category: 'metodos',
    categoryLabel: 'Métodos y Datación',
    definition:
      'Forma de organización social y urbana compleja en la que distintos grupos especializados (herreros, alfareros, pescadores, comerciantes) coordinan el poder y los recursos de manera horizontal o cooperativa sin un palacio central ni una monarquía piramidal. El caso paradigmático en África es Jenné-Jeno (Malí).',
    moduleContext: 'Módulo 02 · Urbanismo temprano',
  },
  {
    id: 'triangulacion-fuentes',
    term: 'Triangulación de fuentes historiográficas',
    category: 'metodos',
    categoryLabel: 'Métodos y Datación',
    definition:
      'Principio metodológico central de la escuela historiográfica africana moderna (Ibadán, Dakar, Historia General de África de la UNESCO) que cruza sistemáticamente tradición oral, arqueología, lingüística histórica y textos escritos para contrastar evidencias y neutralizar los sesgos propios de cada disciplina.',
    moduleContext: 'Módulo 05 · Historiografía africana',
  },
  {
    id: 'paleoproteomica',
    term: 'Paleoproteómica (esmalte dental y colágeno)',
    category: 'metodos',
    categoryLabel: 'Métodos y Datación',
    definition:
      'Análisis por espectrometría de masas (LC-MS/MS o MALDI-TOF) de proteínas antiguas conservadas en tejidos fósiles, especialmente en el esmalte dental mineralizado y el colágeno óseo. Al sobrevivir hasta 2–3,5 millones de años incluso en climas cálidos africanos, permite determinar sexo cromosómico y relaciones filogenéticas donde el ADN antiguo ya se ha destruido.',
    moduleContext: 'Aparato Molecular · Atlas Paleo (Métodos)',
  },
  {
    id: 'amelogenina',
    term: 'Amelogenina (AMELX / AMELY)',
    category: 'metodos',
    categoryLabel: 'Métodos y Datación',
    definition:
      'Proteína estructural mayoritaria del esmalte dental codificada por variantes distintas en los cromosomas sexuales X (AMELX) e Y (AMELY). La identificación de péptidos específicos de AMELY por paleoproteómica permite determinar el sexo cromosómico de fósiles homininos plio-pleistocenos como Paranthropus robustus o Australopithecus africanus.',
    moduleContext: 'Aparato Molecular · Paleoproteómica',
  },
  {
    id: 'zooms',
    term: 'ZooMS (Zooarqueología por Espectrometría de Masas)',
    category: 'metodos',
    categoryLabel: 'Métodos y Datación',
    definition:
      'Técnica rápida y de bajo coste basada en la huella peptídica del colágeno tipo I (MALDI-TOF) que clasifica taxonómicamente miles de astillas óseas sin morfología diagnóstica. Ha sido decisiva para localizar fragmentos humanos raros (como Denisova 11 o Ranis) antes de aplicar paleogenómica.',
    moduleContext: 'Aparato Molecular · Paleoproteómica',
  },
  {
    id: 'adn-sedimentario',
    term: 'ADN sedimentario antiguo (sedaDNA)',
    category: 'metodos',
    categoryLabel: 'Métodos y Datación',
    definition:
      'Material genético liberado por organismos en el pasado que queda adsorbido en partículas de arcilla, calcita o fosfato del sedimento arqueológico. Permite detectar la presencia de neandertales, denisovanos o Homo sapiens en capas de cuevas sin necesidad de encontrar ni destruir huesos fósiles.',
    moduleContext: 'Aparato Molecular · Paleogenómica',
  },
  {
    id: 'desaminacion-adn',
    term: 'Desaminación post mortem (C→T)',
    category: 'metodos',
    categoryLabel: 'Métodos y Datación',
    definition:
      'Alteración química espontánea de la citosina (C) en uracilo —leído como timina (T) al secuenciar— que se concentra en los extremos 5\' de los fragmentos cortos de ADN antiguo. Constituye el criterio principal para autenticar una secuencia fósil frente a la contaminación con ADN humano moderno.',
    moduleContext: 'Aparato Molecular · Autenticación en sala blanca',
  },
  {
    id: 'hueso-petroso',
    term: 'Hueso petroso (porción petrosa del temporal)',
    category: 'metodos',
    categoryLabel: 'Métodos y Datación',
    definition:
      'Región extremadamente densa del hueso temporal que alberga el oído interno. Su baja porosidad y reducida remodelación protegen excepcionalmente bien el ADN endógeno frente a la degradación microbiana y térmica, multiplicando el éxito de la paleogenómica en África (Taforalt, Shum Laka, Ballito Bay).',
    moduleContext: 'Aparato Molecular · Paleogenómica',
  },
  {
    id: 'linaje-fantasma',
    term: 'Linaje fantasma (población arcaica no muestreada)',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'Población humana antigua de la que todavía no se dispone de fósiles secuenciados directamente, pero cuya contribución genética se detecta de forma indirecta mediante patrones estadísticos en genomas antiguos y actuales (especialmente relevantes en África Occidental y Central, como en Shum Laka).',
    moduleContext: 'Aparato Molecular · Paleogenómica africana',
  },
  ...ETHOLOGY_GLOSSARY_TERMS.map((entry) => ({
    id: entry.id,
    term: entry.term,
    category: 'etologia' as const,
    categoryLabel: 'Etología y Primatología',
    definition: entry.definition,
    moduleContext: entry.moduleContext,
  })),
  {
    id: 'hominizacion-humanizacion',
    term: 'Hominización frente a humanización',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'Distinción analítica clave en antropología: la hominización designa la evolución biológica y anatómica del linaje humano (bipedismo, encefalización, mano prensil, aparato fonador), mientras que la humanización designa la construcción sociocultural y simbólica (lenguaje, normas, parentesco, ritual, arte y cultura acumulativa) en constante coevolución con la biología.',
    moduleContext: 'Programa de Antropología · Tema 01',
  },
  {
    id: 'cultura-antropologica',
    term: 'Cultura (noción antropológica)',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'Conjunto aprendido, compartido y simbólicamente organizado de saberes, técnicas, normas, valores, creencias e instituciones que cada sociedad transmite y transforma históricamente. En el ser humano adopta un carácter acumulativo («efecto trinquete») que permite multiplicar innovaciones a través de generaciones.',
    moduleContext: 'Programa de Antropología · Temas 01 y 08',
  },
  {
    id: 'bipedismo-carrera-resistencia',
    term: 'Bipedismo y carrera de resistencia («Nacidos para correr»)',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'Secuencia en dos fases de la locomoción humana en África: primero, el bipedismo habitual surgido en bosques-mosaico (~7–3,6 Ma, Australopithecus, Laetoli); después, la especialización del género Homo (~2 Ma) para la carrera prolongada mediante piernas largas, tendón de Aquiles elástico, ligamento nucal y sudoración ecrina masiva.',
    moduleContext: 'Programa de Antropología · Tema 04',
  },
  {
    id: 'ritos-de-paso',
    term: 'Ritos de paso y liminalidad',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'Ceremonias que acompañan las transiciones del ciclo vital y estatus social (nacimiento, iniciación, matrimonio, funerales). Analizados por Arnold van Gennep y Victor Turner (a partir de su etnografía ndembu en Zambia), constan de tres fases: separación, margen o liminalidad (donde emerge la communitas) y agregación como nueva persona social.',
    moduleContext: 'Programa de Antropología · Tema 08',
  },
  {
    id: 'teoria-de-la-abuela',
    term: 'Hipótesis de la abuela y crianza cooperativa',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'Modelo evolutivo (Hawkes, O’Connell y Blurton Jones, basado en los Hadza de Tanzania) que explica la prolongada vida humana tras la menopausia por el aporte calórico y de cuidados de las abuelas hacia sus nietos, dentro de un sistema más amplio de aloparentalidad indispensable para financiar cerebros grandes e infancias largas.',
    moduleContext: 'Programa de Antropología · Tema 09',
  },
  {
    id: 'parentesco-linaje',
    term: 'Antropología del parentesco y sistemas de filiación',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'Estudio de cómo cada cultura construye socialmente los vínculos familiares, la descendencia, el matrimonio y la herencia. En África coexisten sistemas patrilineales, matrilineales (como los Akan o Bemba), de filiación doble y bilaterales que articulan redes de solidaridad, tierra y autoridad política.',
    moduleContext: 'Programa de Antropología · Tema 09',
  },
  {
    id: 'neolitizacion-africana',
    term: 'Pastoralismo temprano y domesticación vegetal africana',
    category: 'paleobotanica',
    categoryLabel: 'Paleobotánica y Clima',
    definition:
      'Trayectoria singular de producción de alimentos en África: el pastoralismo móvil de ganado en el «Sáhara verde» (~8.000–5.000 a.C.) precedió en milenios a la agricultura sedentaria, y el continente albergó múltiples centros independientes de domesticación vegetal (sorgo, mijo perla, arroz africano, teff, enset, ñame y palma aceitera).',
    moduleContext: 'Programa de Antropología · Tema 10',
  },
  {
    id: 'foramen-magnum-ligamento-nucal',
    term: 'Foramen magnum y ligamento nucal',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'El foramen magnum es la abertura occipital por la que emerge la médula espinal; su posición anterior e inferior en homininos equilibra la cabeza sobre la columna erguida. El ligamento nucal, derivado en el género Homo (~1,8 Ma), actúa como tirante elástico pasivo que impide el cabeceo cefálico durante la carrera de resistencia.',
    moduleContext: 'Tema 04 · Biomecánica 3D del bipedismo',
  },
  {
    id: 'lordosis-lumbar',
    term: 'Lordosis lumbar (columna en S)',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'Curvatura anterior de la región lumbar exclusiva de los homininos bípedos. A diferencia de la columna rígida en C de los grandes simios (Pan troglodytes), sitúa el centro de masas del tronco sobre la pelvis, absorbe impactos verticales y permite la contrarrotación entre tórax y cadera al correr.',
    moduleContext: 'Tema 04 · Biomecánica 3D del bipedismo',
  },
  {
    id: 'pelvis-en-cuenca',
    term: 'Pelvis en cuenca y estabilidad abductora',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'Reorganización pélvica hominina caracterizada por iliones cortos, anchos y curvados hacia delante en forma de cuenca. Reposiciona los glúteos menor y medio como abductores que impiden el desplome lateral de la cadera en apoyo monopodal, reduciendo la sobrecarga sacroilíaca frente a la pelvis alta y plana de los primates no humanos.',
    moduleContext: 'Tema 04 · Biomecánica 3D del bipedismo',
  },
  {
    id: 'angulo-valgo-femur',
    term: 'Ángulo bicondilar (fémur en valgo)',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'Inclinación medial del fémur desde la cadera hacia la rodilla (9°–11° en homininos bípedos frente a casi 0° en chimpancés). Acerca las rodillas y los pies directamente bajo el centro de gravedad corporal, evitando el balanceo lateral costoso durante la marcha y la carrera.',
    moduleContext: 'Tema 04 · Biomecánica 3D del bipedismo',
  },
  {
    id: 'tendon-aquiles-arco-plantar',
    term: 'Tendón de Aquiles y arco plantar elástico',
    category: 'paleoantropologia',
    categoryLabel: 'Paleoantropología',
    definition:
      'Sistema de resortes tendinosos propio del género Homo (Bramble y Lieberman, 2004). El tendón de Aquiles alargado y la fascia del arco plantar longitudinal almacenan energía elástica en el impacto del pie y la devuelven en el despegue junto al hallux alineado, reduciendo drásticamente el coste metabólico de la carrera prolongada.',
    moduleContext: 'Tema 04 · Biomecánica 3D del bipedismo',
  },
  {
    id: 'antropofagia-canibalismo',
    term: 'Antropofagia frente a canibalismo',
    category: 'metodos',
    categoryLabel: 'Métodos y Datación',
    definition:
      'Distinción histórica y léxica clave: «antropofagia» es un helenismo clásico descriptivo (recogido ya en Covarrubias, 1611), mientras que «caníbal» nació del malentendido colombino de 1492 (caribe/caniba asociado al Gran Can y a cinocéfalos) y evolucionó en la lexicografía colonial hacia un estigma moral y racial.',
    moduleContext: 'Bloque III · 05b. Estereotipos sobre canibalismo',
  },
  {
    id: 'antropologia-visual',
    term: 'Antropología visual (y tríada de Roger Chartier)',
    category: 'metodos',
    categoryLabel: 'Métodos y Datación',
    definition:
      'Enfoque interdisciplinar que analiza imágenes, mapas, grabados, fotografías y viñetas como documentos culturales primarios. A partir de Gombrich, Belting y la tríada de Chartier (práctica, representación y apropiación), permite desenmascarar estereotipos heredados y su función política.',
    moduleContext: 'Bloque III · 05b. Estereotipos sobre canibalismo',
  },
  {
    id: 'imaginario-colectivo',
    term: 'Imaginario colectivo',
    category: 'metodos',
    categoryLabel: 'Métodos y Datación',
    definition:
      'Repertorio compartido de imágenes mentales, símbolos, tópicos y narrativas con los que una sociedad interpreta el pasado y clasifica la alteridad. En la expansión europea, los imaginarios impresos (grabados, mapas y viñetas) prevalecieron a menudo sobre la observación directa.',
    moduleContext: 'Bloque III · 05b. Estereotipos sobre canibalismo',
  },
  {
    id: 'mito-del-salvaje',
    term: 'Mito del salvaje (binomio civilizado / salvaje)',
    category: 'metodos',
    categoryLabel: 'Métodos y Datación',
    definition:
      'Construcción cultural europea estudiada por Roger Bartra (2011) que proyecta sobre pueblos colonizados la figura del «homo sylvestris» desprovisto de ley, ciudad o cultura (acepción vigente en la RAE hasta 1970) para definir por contraste la supuesta superioridad de la «civilización» occidental.',
    moduleContext: 'Bloque III · 05b. Estereotipos sobre canibalismo',
  },
];

function normalizeKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function classifyDeaTerm(term: string, definition: string): {
  category: GlossaryCategory;
  categoryLabel: string;
} {
  const hay = normalizeKey(`${term} ${definition}`);

  if (
    /\b(clima|climatic|paleobotanic|flora|sabana|bosque|selva|polen|fitolito|paleosuelo|vegetacion|aridez|glaciacion|interglacial|monzon|orbital|ecologic|ecosistema|bioma|palinolog|ambiente|ambiental|pluvial|c3|c4|herbace|arbore|graminea|estepa|desierto|lacustre)\b/.test(
      hay
    )
  ) {
    return { category: 'paleobotanica', categoryLabel: 'Paleobotánica y Clima' };
  }

  if (
    /\b(datacion|radiometr|argon|potasio|carbono 14|radiocarbono|estratigraf|tafonom|luminiscencia|osl|esr|uranio|paleomagnet|adn|genom|isotop|proteom|microscop|tomografia|escaner|metodo|muestreo|calibracion|cronolog|geolog|sediment|toba|karst|brecha|cueva|excavacion|lito|industria|achelense|oldoway|musteri|lascas|biface|nucleo|percutor|talla)\b/.test(
      hay
    )
  ) {
    return { category: 'metodos', categoryLabel: 'Métodos y Datación' };
  }

  return { category: 'paleoantropologia', categoryLabel: 'Paleoantropología' };
}

function buildMergedGlossary(): GlossaryTerm[] {
  const seen = new Set<string>();
  const merged: GlossaryTerm[] = [];

  for (const item of CURATED_MODULE_TERMS) {
    const baseKey = normalizeKey(item.term.split('(')[0]);
    seen.add(baseKey);
    seen.add(normalizeKey(item.term));
    merged.push(item);
  }

  DEA_RAW_GLOSSARY.forEach(([rawTerm, rawDef], idx) => {
    const key = normalizeKey(rawTerm);
    if (seen.has(key)) return;
    seen.add(key);

    const { category, categoryLabel } = classifyDeaTerm(rawTerm, rawDef);
    merged.push({
      id: `dea-${idx}-${key.replace(/\s+/g, '-').slice(0, 32)}`,
      term: rawTerm.charAt(0).toUpperCase() + rawTerm.slice(1),
      category,
      categoryLabel,
      definition: rawDef,
      moduleContext: 'Corpus Glosario DEA · ULPGC',
    });
  });

  return merged.sort((a, b) => a.term.localeCompare(b.term, 'es'));
}

export const GLOSSARY_TERMS: GlossaryTerm[] = buildMergedGlossary();

export function findGlossaryTerm(idOrName: string): GlossaryTerm | undefined {
  const byId = GLOSSARY_TERMS.find((t) => t.id === idOrName);
  if (byId) return byId;
  const target = normalizeKey(idOrName);
  return (
    GLOSSARY_TERMS.find((t) => normalizeKey(t.term) === target) ??
    GLOSSARY_TERMS.find((t) => normalizeKey(t.term.split('(')[0]) === target) ??
    GLOSSARY_TERMS.find((t) => normalizeKey(t.term).includes(target))
  );
}
