import type { CladoId } from './atlasPaleo';

export type MolecularDiscipline = 'paleogenomica' | 'paleoproteomica';

export interface PreservationBand {
  id: string;
  name: string;
  discipline: MolecularDiscipline;
  tissue: string;
  coldMaxKa: number;
  tropicalAfricaMaxKa: number;
  typicalRangeLabel: string;
  africaRangeLabel: string;
  resolution: string;
  keyMechanism: string;
  color: string;
}

export interface MolecularCaseStudy {
  id: string;
  title: string;
  site: string;
  region: string;
  isAfrica: boolean;
  ageLabel: string;
  ageKa: number;
  discipline: MolecularDiscipline;
  technique: string;
  taxonId: string;
  clado: CladoId;
  specimenLabel: string;
  finding: string;
  significance: string;
  limitNote: string;
  citation: string;
  doi: string;
}

export type AgeBracketId = 'lt15k' | '15k_100k' | '100k_450k' | '450k_2500k' | 'gt2500k';
export type ThermalRegimeId = 'cold' | 'temperate' | 'tropical_africa';
export type TissueMatrixId = 'petrous' | 'enamel' | 'cortical_bone' | 'sediment';

export interface MethodViabilityResult {
  id: 'adn_nuclear' | 'adn_mt_seda' | 'colageno_zooms' | 'proteoma_esmalte';
  label: string;
  discipline: MolecularDiscipline;
  viabilityPct: number;
  status: 'Óptima' | 'Factible con cautela' | 'Límite extremo' | 'No viable';
  rationale: string;
}

export interface DiagnosticMarker {
  id: string;
  gene: string;
  tissue: string;
  role: string;
  signal: string;
  diagnosticNote: string;
}

export interface ProtocolComparisonRow {
  dimension: string;
  paleogenomics: string;
  paleoproteomics: string;
}

export const MOLECULAR_PRESERVATION_BANDS: PreservationBand[] = [
  {
    id: 'adn-nuclear',
    name: 'ADN nuclear antiguo (aDNA)',
    discipline: 'paleogenomica',
    tissue: 'Hueso petroso (oído interno), cemento dental y oscículos',
    coldMaxKa: 430,
    tropicalAfricaMaxKa: 15,
    typicalRangeLabel: 'Hasta ~430 ka en cuevas frías / >1 Ma en permafrost faunístico',
    africaRangeLabel: 'Hasta ~15 ka (Taforalt, Magreb) y ~8 ka en trópico (Shum Laka)',
    resolution: 'Máxima (~3.000 millones de pb; parentesco fino, mezcla y selección)',
    keyMechanism: 'Hidrólisis espontánea, fragmentación (<70 pb) y desaminación C→T aceleradas por el calor.',
    color: '#1f5fa8',
  },
  {
    id: 'adn-mt-seda',
    name: 'ADN mitocondrial y sedimentario (sedaDNA)',
    discipline: 'paleogenomica',
    tissue: 'Células óseas (miles de copias/célula) y arcillas de cuevas estratificadas',
    coldMaxKa: 450,
    tropicalAfricaMaxKa: 18,
    typicalRangeLabel: 'Hasta ~430–450 ka en cueva fría (Sima de los Huesos / Denisova)',
    africaRangeLabel: 'Hasta ~15–18 ka en abrigos secos o de altura africanos',
    resolution: 'Alta para linaje materno (ADNmt) o presencia taxonómica en capas sin huesos',
    keyMechanism: 'Mayor número de copias por célula y adsorción mineral en arcillas ricas en calcita/fosfato.',
    color: '#0e6d8c',
  },
  {
    id: 'colageno-zooms',
    name: 'Colágeno tipo I (ZooMS · MALDI-TOF)',
    discipline: 'paleoproteomica',
    tissue: 'Hueso cortical, dentina, asta y fragmentos no diagnósticos',
    coldMaxKa: 1200,
    tropicalAfricaMaxKa: 120,
    typicalRangeLabel: 'Hasta ~1 Ma en permafrost / ~100–300 ka en cuevas templadas',
    africaRangeLabel: 'Generalmente <50–120 ka en zonas tropicales (degradación térmica)',
    resolution: 'Media (cribado rápido de género/familia en miles de astillas óseas)',
    keyMechanism: 'Triple hélice de colágeno enlazada al mineral óseo; más resistente que el ADN pero sensible a hidrólisis cálida.',
    color: '#8a5a00',
  },
  {
    id: 'proteoma-esmalte',
    name: 'Proteoma del esmalte dental (LC-MS/MS)',
    discipline: 'paleoproteomica',
    tissue: 'Esmalte dental mineralizado (>95 % hidroxiapatita)',
    coldMaxKa: 3800,
    tropicalAfricaMaxKa: 3500,
    typicalRangeLabel: 'Hasta ~2,0–3,8 Ma (Pleistoceno Inferior y Plioceno)',
    africaRangeLabel: 'Confirmado en África hasta ~2,0–3,5 Ma (Swartkrans y Sterkfontein)',
    resolution: 'Selectiva (~10–15 proteínas: sexo cromosómico AMELX/AMELY y ramas principales)',
    keyMechanism: 'Encapsulación hermética de péptidos (amelogenina, enamelina, ameloblastina) dentro de cristales de hidroxiapatita.',
    color: '#b43c0b',
  },
];

export const MOLECULAR_CASE_STUDIES: MolecularCaseStudy[] = [
  {
    id: 'paranthropus-swartkrans',
    title: 'Proteoma de esmalte en Paranthropus robustus',
    site: 'Cueva de Swartkrans (Cuna de la Humanidad)',
    region: 'Sudáfrica · África Austral',
    isAfrica: true,
    ageLabel: '~2,0 Ma',
    ageKa: 2000,
    discipline: 'paleoproteomica',
    technique: 'Espectrometría de masas (LC-MS/MS) en esmalte dental',
    taxonId: 'robustus',
    clado: 'paran',
    specimenLabel: 'Cuatro individuos del Miembro 1 de Swartkrans (SK 830, SK 835, SK 850 y SK 14132)',
    finding:
      'Recuperó proteínas del esmalte (AMELX, AMELY, ENAM, AMBN) de hace ~2,0 Ma en África: identificó dos machos XY (SK 835 y SK 850) y dos hembras XX (SK 830 y SK 14132), reveló que SK 835 —antes inferido como hembra por su menor tamaño dental— era macho, detectó un polimorfismo diagnóstico en enamelina (ENAM pos. 137) en SK 835 y situó a P. robustus fuera del clado de Homo sapiens, neandertales y denisovanos.',
    significance:
      'Rompe la barrera térmica africana del ADN antiguo y demuestra tanto la cautela necesaria al inferir sexo solo por tamaño dental como la existencia de variabilidad o subestructura genética dentro de Paranthropus robustus.',
    limitNote:
      'El reducido número de posiciones de aminoácidos variables limita la resolución fina entre especies muy próximas de australopitecinos y exige muestras mayores para calibrar el polimorfismo ENAM.',
    citation:
      'Madupe, P. P., Koenig, C., Patramanis, I., et al. (2025). Enamel proteins reveal biological sex and genetic variability in southern African Paranthropus. Science, 388(6750), 969–973.',
    doi: '10.1126/science.adt9539',
  },
  {
    id: 'taforalt-adna',
    title: 'Los genomas antiguos más viejos de África (Taforalt)',
    site: 'Grotte des Pigeons, Taforalt',
    region: 'Marruecos · Magreb',
    isAfrica: true,
    ageLabel: '~15 ka',
    ageKa: 15,
    discipline: 'paleogenomica',
    technique: 'Secuenciación de ADN nuclear de hueso petroso',
    taxonId: 'sapiens',
    clado: 'homo',
    specimenLabel: 'Siete individuos iberomaurisienses del Pleistoceno Final',
    finding:
      'Secuenció los genomas nucleares más antiguos recuperados en África, mostrando una ascendencia compuesta (~63 % emparentada con cazadores-recolectores levantinos natufienses y ~37 % de ascendencia africana, interpretada hoy junto a Takarkori como reflejo de un linaje norteafricano ancestral profundo).',
    significance:
      'Demuestra que el Norte de África mantuvo redes demográficas complejas a ambos lados del Mediterráneo y un sustrato norteafricano muy antiguo miles de años antes de la neolitización.',
    limitNote:
      'Su conservación se vio favorecida por las condiciones secas y templadas de cueva caliza; en el trópico húmedo la ventana actual sigue siendo menor.',
    citation:
      'van de Loosdrecht, M., Bouzouggar, A., Humphrey, L., et al. (2018). Pleistocene North African genomes link Near Eastern and sub-Saharan African human populations. Science, 360(6388), 548-552.',
    doi: '10.1126/science.aar8380',
  },
  {
    id: 'shum-laka-ghost',
    title: 'Estructura poblacional profunda y linajes fantasma en Shum Laka',
    site: 'Abrigo rocoso de Shum Laka',
    region: 'Camerún · África Centro-Occidental',
    isAfrica: true,
    ageLabel: '~8 – 3 ka',
    ageKa: 8,
    discipline: 'paleogenomica',
    technique: 'ADN nuclear antiguo en entorno tropical (captura de SNP)',
    taxonId: 'sapiens',
    clado: 'homo',
    specimenLabel: 'Cuatro individuos infantiles del Holoceno medio y tardío',
    finding:
      'Reveló que los habitantes de la región considerada cuna de las lenguas bantúes poseían una ascendencia más cercana a cazadores-recolectores de África Central que a los hablantes bantúes actuales, y aportó evidencia de al menos cuatro grandes linajes basales africanos hace ~250–200 ka.',
    significance:
      'Respalda la evolución panafricana estructurada de Homo sapiens y confirma la existencia de «linajes fantasma» africanos sin fósiles secuenciados directamente.',
    limitNote:
      'La cobertura genómica en latitudes ecuatoriales húmedas exige técnicas de enriquecimiento dirigido sobre hueso petroso.',
    citation:
      'Lipson, M., Ribot, I., Mallick, S., et al. (2020). Ancient West African foragers in the context of African population history. Nature, 577(7792), 665-670.',
    doi: '10.1038/s41586-020-1929-1',
  },
  {
    id: 'ballito-bay',
    title: 'Divergencia profunda de Homo sapiens en Ballito Bay',
    site: 'Ballito Bay (KwaZulu-Natal)',
    region: 'Sudáfrica · África Austral',
    isAfrica: true,
    ageLabel: '~2 ka',
    ageKa: 2,
    discipline: 'paleogenomica',
    technique: 'Genoma antiguo de alta cobertura (13×)',
    taxonId: 'sapiens',
    clado: 'homo',
    specimenLabel: 'Individuo cazador-recolector pre-pastoril (BBAY-A)',
    finding:
      'Al carecer de mezcla posterior con pastores orientales y agricultores bantúes, permitió calibrar la divergencia genética más profunda entre poblaciones humanas modernas entre ~260 y 350 ka.',
    significance:
      'Alinea por fin el reloj paleogenómico con las fechas fósiles de Jebel Irhoud (~300 ka) y Florisbad (~260 ka), consolidando el origen panafricano profundo.',
    limitNote:
      'Las estimaciones de divergencia dependen de la tasa de mutación asumida y de los modelos de flujo génico continuo entre regiones africanas.',
    citation:
      'Schlebusch, C. M., Malmström, H., Günther, T., et al. (2017). Southern African ancient genomes estimate modern human divergence to 350,000 to 260,000 years ago. Science, 358(6363), 652-655.',
    doi: '10.1126/science.aao6266',
  },
  {
    id: 'takarkori-sahara',
    title: 'Linaje norteafricano aislado en el Sáhara Verde (Takarkori)',
    site: 'Abrigo de Takarkori (macizo de Acacus)',
    region: 'Libia · Sáhara Central',
    isAfrica: true,
    ageLabel: '~7 ka',
    ageKa: 7,
    discipline: 'paleogenomica',
    technique: 'Secuenciación paleogenómica de momias naturales saharianas',
    taxonId: 'sapiens',
    clado: 'homo',
    specimenLabel: 'Dos mujeres pastoras del Periodo Húmedo Africano',
    finding:
      'Identificó un linaje norteafricano ancestral divergido de las poblaciones subsaharianas hace ~50 ka (contemporáneo a la salida de África), que permaneció mayoritariamente aislado incluso durante el Sáhara Verde, portaba ~10 veces menos ADN neandertal que agricultores levantinos y adoptó el pastoreo sobre todo por difusión cultural.',
    significance:
      'Matiza la hipótesis de un gran corredor genético transahariano durante el Periodo Húmedo Africano y revela continuidad profunda con el componente norteafricano de Taforalt (~15 ka).',
    limitNote:
      'La muestra corresponde a dos individuos de un único abrigo; se requieren más genomas saharianos para trazar fronteras demográficas precisas.',
    citation:
      'Salem, N., van de Loosdrecht, M. S., Sümer, A. P., et al. (2025). Ancient DNA from the Green Sahara reveals ancestral North African lineage. Nature, 641(8061), 144–150.',
    doi: '10.1038/s41586-025-08793-7',
  },
  {
    id: 'australopithecus-sterkfontein',
    title: 'Péptidos de esmalte en Australopithecus africanus (Sts 63)',
    site: 'Cuevas de Sterkfontein (Miembro 4)',
    region: 'Sudáfrica · África Austral',
    isAfrica: true,
    ageLabel: '~3,5 – 2,0 Ma',
    ageKa: 2800,
    discipline: 'paleoproteomica',
    technique: 'Proteómica dental LC-MS/MS (péptidos de amelogenina AMELX/AMELY)',
    taxonId: 'africanus',
    clado: 'austra',
    specimenLabel: 'Espécimen Sts 63 (fragmento de esmalte, Miembro 4 de Sterkfontein)',
    finding:
      'Recuperó péptidos endógenos de amelogenina en el espécimen Sts 63 de Australopithecus africanus y confirmó de forma inequívoca su sexo cromosómico masculino (XY) mediante péptidos diagnósticos de AMELY.',
    significance:
      'Valida la supervivencia de proteínas del esmalte en el Miembro 4 de Sterkfontein y permite contrastar hipótesis clásicas sobre dimorfismo sexual y estructura social en australopitecos sin depender solo del tamaño dental.',
    limitNote:
      'La cronología exacta del Miembro 4 de Sterkfontein oscila entre ~2,01 y ~3,5 Ma según el método de datación aplicado (espeleotemas U-Pb frente a nucleidos cosmogénicos).',
    citation:
      'Madupe, P. P., Munir, F., Dickinson, M., et al. (2025). Results from an Australopithecus africanus dental enamel fragment confirm the potential of palaeoproteomics for South African Plio-Pleistocene fossil sites. South African Journal of Science, 121(1/2), Art. #18571.',
    doi: '10.17159/sajs.2025/18571',
  },
  {
    id: 'antecessor-atapuerca',
    title: 'Proteoma dental de Homo antecessor en Gran Dolina',
    site: 'Gran Dolina (TD6), Sierra de Atapuerca',
    region: 'España · Europa Occidental',
    isAfrica: false,
    ageLabel: '~0,8 Ma',
    ageKa: 800,
    discipline: 'paleoproteomica',
    technique: 'LC-MS/MS de alta resolución en esmalte dental',
    taxonId: 'antecessor',
    clado: 'homo',
    specimenLabel: 'Molar ATD6-92 de Homo antecessor',
    finding:
      'Reconstruyó cerca de 1.000 aminoácidos de 7 proteínas del esmalte, demostrando que Homo antecessor era un grupo hermano muy próximo al último antepasado común de Homo sapiens, neandertales y denisovanos.',
    significance:
      'Constituye el referente metodológico que validó el proteoma del esmalte para resolver relaciones filogenéticas del Pleistoceno Inferior fuera del alcance del ADN.',
    limitNote:
      'Las proteínas del esmalte no permiten detectar por sí solas episodios de hibridación o introgresión tardía entre linajes.',
    citation:
      'Welker, F., Ramos-Madrigal, J., Gutenbrunner, P., et al. (2020). The dental proteome of Homo antecessor. Nature, 580(7802), 235-238.',
    doi: '10.1038/s41586-020-2153-8',
  },
  {
    id: 'sima-huesos',
    title: 'El ADN nuclear homínino más antiguo (Sima de los Huesos)',
    site: 'Sima de los Huesos, Sierra de Atapuerca',
    region: 'España · Europa Occidental',
    isAfrica: false,
    ageLabel: '~430 ka',
    ageKa: 430,
    discipline: 'paleogenomica',
    technique: 'Secuenciación ultracorta de ADN nuclear y mitocondrial',
    taxonId: 'heidelbergensis',
    clado: 'homo',
    specimenLabel: 'Fémur XIII e incisivo de homininos del Pleistoceno Medio',
    finding:
      'Mostró que el ADN nuclear de la población de Sima de los Huesos pertenece claramente al linaje neandertal temprano, pese a que su ADN mitocondrial se asemejaba más al de los denisovanos.',
    significance:
      'Demuestra que la divergencia entre neandertales y Homo sapiens es anterior a 430 ka (probablemente ~550–765 ka) y prueba por qué el ADN mitocondrial aislado puede contar una historia distinta al genoma nuclear.',
    limitNote:
      'Solo fue posible gracias a la temperatura constante y fresca (~10 °C) de la galería subterránea y a protocolos de recuperación de fragmentos de ~30–40 pares de bases.',
    citation:
      'Meyer, M., Arsuaga, J. L., de Filippo, C., et al. (2016). Nuclear DNA sequences from the Middle Pleistocene Sima de los Huesos hominins. Nature, 531(7595), 504-507.',
    doi: '10.1038/nature17405',
  },
  {
    id: 'denisova-intro',
    title: 'Denisova, mestizaje arcaico y ADN sedimentario (sedaDNA)',
    site: 'Cueva de Denisova (Montes Altái)',
    region: 'Siberia · Asia Septentrional',
    isAfrica: false,
    ageLabel: '~200 – 50 ka',
    ageKa: 80,
    discipline: 'paleogenomica',
    technique: 'ADN nuclear de falange, cribado ZooMS y ADN sedimentario',
    taxonId: 'denisovanos',
    clado: 'homo',
    specimenLabel: 'Falange Denisova 3, híbrido Denisova 11 («Denny») y sedimentos',
    finding:
      'Permitió descubrir un linaje humano entero a partir de un fragmento diminuto, documentar a un individuo de primera generación con madre neandertal y padre denisovano (Denisova 11) y mapear ocupaciones sin fósiles mediante ADN del sedimento.',
    significance:
      'Confirmó el carácter reticulado de la evolución del género Homo y demostró la complementariedad entre ZooMS (que halló la astilla de Denny entre miles de huesos) y paleogenómica.',
    limitNote:
      'La ausencia de un cráneo completo inicialmente en Denisova impidió asignar una especie formal consensuada basada solo en morfología.',
    citation:
      'Krause, J., et al. (2010), Nature, 464, 894-897; Slon, V., et al. (2018), Nature, 561, 113-116.',
    doi: '10.1038/s41586-018-0455-x',
  },
  {
    id: 'xiahe-harbin',
    title: 'Mandíbula de Xiahe y cráneo de Harbin: proteoma denisovano',
    site: 'Cueva de Baishiya (Tíbet) y Harbin (Heilongjiang)',
    region: 'China · Asia Oriental',
    isAfrica: false,
    ageLabel: '~160 – 146 ka',
    ageKa: 155,
    discipline: 'paleoproteomica',
    technique: 'Proteómica de colágeno/dentina, esmalte y ADNmt en cálculo dental',
    taxonId: 'denisovanos',
    clado: 'homo',
    specimenLabel: 'Mandíbula de Xiahe (~160 ka) y cráneo de Harbin (>146 ka)',
    finding:
      'Identificó a los denisovanos en la meseta tibetana a 3.280 m de altitud mediante una sustitución diagnóstica en colágeno (COL1A2, Chen et al., 2019) y confirmó en 2025 la filiación denisovana del cráneo de Harbin mediante 95 proteínas endógenas (Science, 389(6761), 704–707; DOI 10.1126/science.adu9677) y ADN mitocondrial del cálculo dental (Cell, 188(15), 3919–3926.e9; DOI 10.1016/j.cell.2025.05.040).',
    significance:
      'Demuestra que la paleoproteómica y el ADNmt en cálculo dental permiten asignar fósiles clave a linajes genéticos cuando el ADN nuclear desaparece, conectando anatomía craneal asiática robusta con el clado denisovano.',
    limitNote:
      'Una sola variante peptídica (como en Xiahe) requiere siempre convergencia con morfología, contexto arqueológico y ADN sedimentario; en Harbin la nomenclatura formal de especie («Homo longi» frente a denisovanos) sigue en debate.',
    citation:
      'Chen, F., et al. (2019), Nature, 569, 409–412; Fu, Q., et al. (2025), Science, 389(6761), 704–707 y Cell, 188(15), 3919–3926.e9.',
    doi: '10.1126/science.adu9677',
  },
  {
    id: 'gigantopithecus-chuifeng',
    title: 'Proteoma de Gigantopithecus blacki en entorno subtropical',
    site: 'Cueva de Chuifeng (Guangxi)',
    region: 'Sur de China · Asia Oriental',
    isAfrica: false,
    ageLabel: '~1,9 Ma',
    ageKa: 1900,
    discipline: 'paleoproteomica',
    technique: 'Proteómica del esmalte dental (LC-MS/MS)',
    taxonId: 'proconsul',
    clado: 'basales',
    specimenLabel: 'Molar fósil del Pleistoceno Inferior subtropical',
    finding:
      'Recuperó seis proteínas del esmalte de un simio gigante extinto en una región cálida y húmeda, resolviendo un debate de décadas al situarlo como rama hermana de los orangutanes (Pongo, divergencia ~12–10 Ma).',
    significance:
      'Probó que las proteínas del esmalte sobreviven casi dos millones de años incluso en latitudes subtropicales adversas para el ADN, abriendo el camino directo a los estudios africanos.',
    limitNote:
      'Los péptidos presentan modificaciones químicas post mortem (desamidación de glutamina y asparagina) que sirven como prueba de autenticidad pero reducen la cobertura.',
    citation:
      'Welker, F., Ramos-Madrigal, J., Kuhlwilm, M., et al. (2019). Enamel proteome shows that Gigantopithecus was an early diverging pongine. Nature, 576(7786), 262-265.',
    doi: '10.1038/s41586-019-1728-8',
  },
  {
    id: 'zooms-cribado',
    title: 'ZooMS: cribado masivo de astillas óseas indetectables',
    site: 'Denisova, Bacho Kiro y Ranis (Eurasia)',
    region: 'Europa y Asia Septentrional',
    isAfrica: false,
    ageLabel: '~50 – 45 ka',
    ageKa: 47,
    discipline: 'paleoproteomica',
    technique: 'ZooMS (huella peptídica de colágeno por MALDI-TOF)',
    taxonId: 'neanderthalensis',
    clado: 'homo',
    specimenLabel: 'Miles de fragmentos óseos <3 cm sin rasgos morfológicos',
    finding:
      'Permitió examinar miles de pequeños fragmentos de hueso irreconocibles a simple vista, localizando restos humanos (Homo sapiens tempranos en Bacho Kiro y Ranis, y el híbrido Denisova 11) que habrían pasado inadvertidos.',
    significance:
      'Actúa como puente operativo entre excavación y paleogenómica: identifica con bajo coste y mínima muestra qué astillas merecen secuenciación de ADN antiguo.',
    limitNote:
      'En yacimientos africanos antiguos de clima cálido, la rápida pérdida del colágeno limita el éxito del ZooMS a niveles más recientes del Pleistoceno Superior y Holoceno.',
    citation:
      'Mylopotamitaki, D., Weiss, M., Fewlass, H., et al. (2024). Homo sapiens reached the higher latitudes of Europe by 45,000 years ago. Nature, 626(7998), 341-346.',
    doi: '10.1038/s41586-023-06923-7',
  },
];

export const DIAGNOSTIC_MARKERS: Record<MolecularDiscipline, DiagnosticMarker[]> = {
  paleogenomica: [
    {
      id: 'ct-deamination',
      gene: 'Desaminación C→T en extremos 5\'',
      tissue: 'ADN nuclear y mitocondrial',
      role: 'Autenticación de antigüedad',
      signal: 'Incremento exponencial (15–40 %) de sustituciones C→T en las últimas 1–5 bases del fragmento',
      diagnosticNote:
        'Es la «huella dactilar» bioquímica que distingue el ADN genuinamente antiguo de la contaminación con ADN humano moderno de excavadores o personal de laboratorio.',
    },
    {
      id: 'fragment-length',
      gene: 'Longitud modal de fragmentos (35–65 pb)',
      tissue: 'Hueso petroso y raíces dentales',
      role: 'Control diagenético',
      signal: 'Distribución muy sesgada hacia cadenas ultracortas por rotura espontánea del esqueleto azúcar-fosfato',
      diagnosticNote:
        'Cuanto mayor es la edad térmica del yacimiento, más cortos son los fragmentos supervivientes; la selección de bibliotecas monocatenarias (ssDNA) multiplica su recuperación.',
    },
    {
      id: 'introgression-dstat',
      gene: 'Bloques de introgresión y estadística D (ABBA-BABA)',
      tissue: 'Genoma nuclear completo o captura 1240k',
      role: 'Flujo génico y estructura poblacional',
      signal: 'Segmentos compartidos (~1,8–2,5 % neandertal fuera de África; linajes basales y fantasma dentro de África)',
      diagnosticNote:
        'Permite detectar cruces entre poblaciones separadas cientos de miles de años antes y estimar la fecha del contacto según la longitud de los bloques recombinados.',
    },
  ],
  paleoproteomica: [
    {
      id: 'amelx-amely',
      gene: 'Amelogenina (AMELX / AMELY)',
      tissue: 'Esmalte dental mineralizado',
      role: 'Determinación cromosómica del sexo',
      signal: 'Péptidos exclusivos del cromosoma Y (AMELY, p. ej. SMIRPPY) junto a AMELX confirman individuo XY',
      diagnosticNote:
        'Supera las ambigüedades del dimorfismo sexual en restos infantiles o fragmentarios; la ausencia de AMELY exige comprobar cobertura suficiente de AMELX para inferir XX con rigor estadístico.',
    },
    {
      id: 'enam-ambn',
      gene: 'Enamelina (ENAM) y Ameloblastina (AMBN)',
      tissue: 'Esmalte dental (LC-MS/MS)',
      role: 'Filogenia profunda (>400 ka – 3,5 Ma)',
      signal: 'Sustituciones no sinónimas de aminoácidos (SAP) que separan Pongo, Pan, Paranthropus y Homo',
      diagnosticNote:
        'Permitió ubicar a Gigantopithecus junto a los orangutanes, a Homo antecessor como rama hermana del clado sapiens-neandertal-denisovano y a Paranthropus robustus fuera de este.',
    },
    {
      id: 'deamidation-nq',
      gene: 'Desamidación de Asn (N) y Gln (Q)',
      tissue: 'Colágeno (COL1A1/A2) y proteínas del esmalte',
      role: 'Autenticación de proteínas antiguas',
      signal: 'Conversión progresiva post mortem de asparagina en ácido aspártico y glutamina en ácido glutámico',
      diagnosticNote:
        'Cumple un papel análogo al daño C→T del ADN: confirma que los péptidos secuenciados son realmente antiguos y descarta contaminación moderna por queratina o manipulación.',
    },
  ],
};

export const PROTOCOL_COMPARISON_ROWS: ProtocolComparisonRow[] = [
  {
    dimension: 'Molécula analizada',
    paleogenomics: 'ADN nuclear (~3.000 Mb), ADN mitocondrial (~16,5 kb) y ADN sedimentario (sedaDNA).',
    paleoproteomics: 'Péptidos de colágeno tipo I (ZooMS) o proteoma del esmalte dental (~10–15 proteínas, LC-MS/MS).',
  },
  {
    dimension: 'Tejido más favorable',
    paleogenomics: 'Porción petrosa del hueso temporal (oído interno), cemento radicular dental y sedimentos ricos en fosfato/arcilla.',
    paleoproteomics: 'Esmalte dental (>95 % hidroxiapatita mineralizada) para tiempo profundo; hueso cortical para cribado ZooMS.',
  },
  {
    dimension: 'Horizonte en África tropical/cálida',
    paleogenomics: 'Hasta ~15 ka en cueva seca del Magreb (Taforalt) y ~8 ka en trópico húmedo (Shum Laka).',
    paleoproteomics: 'Confirmado hasta ~2,0–3,5 Ma en cuevas kársticas de África Austral (Paranthropus robustus, Australopithecus).',
  },
  {
    dimension: 'Horizonte en cuevas frías / Eurasia',
    paleogenomics: 'Hasta ~430 ka en homininos (Sima de los Huesos) y ~1–2 Ma en permafrost faunístico/ambiental.',
    paleoproteomics: 'Hasta ~1,9–3,8 Ma en esmalte (Gigantopithecus, Homo antecessor, fauna pliocena del Ártico).',
  },
  {
    dimension: 'Resolución evolutiva',
    paleogenomics: 'Muy alta: reconstruye demografía fina, mestizaje, parentesco familiar, selección natural y linajes fantasma.',
    paleoproteomics: 'Selectiva: determina sexo cromosómico (AMELX/AMELY), grandes ramas filogenéticas y cribado taxonómico rápido.',
  },
  {
    dimension: 'Firma de autenticación',
    paleogenomics: 'Fragmentación extrema (<70 pb) y desaminación C→T concentrada en los extremos 5\' de la molécula.',
    paleoproteomics: 'Desamidación elevada de glutamina (Q) y asparagina (N) y patrones de escisión no enzimática.',
  },
  {
    dimension: 'Impacto de muestreo y ética',
    paleogenomics: 'Microperforación controlada en petroso/raíz; el sedaDNA evita por completo tocar fósiles irreemplazables.',
    paleoproteomics: 'Requiere miligramos mínimos de esmalte o grabado ácido mínimamente invasivo que preserva la morfología dental.',
  },
];

export function evaluateMolecularStrategy(
  age: AgeBracketId,
  regime: ThermalRegimeId,
  tissue: TissueMatrixId
): {
  methods: MethodViabilityResult[];
  recommendedId: MethodViabilityResult['id'];
  summary: string;
  diagenesisNote: string;
  cautionNote: string;
} {
  // Base age scores per method
  const ageScores: Record<AgeBracketId, { nuc: number; mt: number; zooms: number; enamel: number }> = {
    lt15k: { nuc: 92, mt: 96, zooms: 95, enamel: 96 },
    '15k_100k': { nuc: 72, mt: 82, zooms: 86, enamel: 94 },
    '100k_450k': { nuc: 38, mt: 54, zooms: 62, enamel: 90 },
    '450k_2500k': { nuc: 0, mt: 4, zooms: 16, enamel: 76 },
    gt2500k: { nuc: 0, mt: 0, zooms: 0, enamel: 42 },
  };

  // Thermal penalty factor
  const thermalFactor: Record<ThermalRegimeId, { dna: number; col: number; enamel: number }> = {
    cold: { dna: 1.0, col: 1.0, enamel: 1.0 },
    temperate: { dna: 0.72, col: 0.85, enamel: 0.96 },
    tropical_africa: { dna: 0.24, col: 0.42, enamel: 0.88 },
  };

  // Tissue compatibility multiplier
  const tissueFactor: Record<
    TissueMatrixId,
    { nuc: number; mt: number; zooms: number; enamel: number }
  > = {
    petrous: { nuc: 1.0, mt: 1.0, zooms: 0.85, enamel: 0.0 },
    enamel: { nuc: 0.08, mt: 0.12, zooms: 0.1, enamel: 1.0 },
    cortical_bone: { nuc: 0.45, mt: 0.65, zooms: 1.0, enamel: 0.0 },
    sediment: { nuc: 0.12, mt: 0.88, zooms: 0.0, enamel: 0.0 },
  };

  const base = ageScores[age];
  const therm = thermalFactor[regime];
  const tiss = tissueFactor[tissue];

  // Special case: African tropical <15 ka in petrous is tough but feasible (~45-65%)
  const clamp = (n: number) => Math.max(0, Math.min(98, Math.round(n)));

  let nucScore = clamp(base.nuc * therm.dna * tiss.nuc);
  let mtScore = clamp(base.mt * therm.dna * tiss.mt);
  let zoomsScore = clamp(base.zooms * therm.col * tiss.zooms);
  let enamelScore = clamp(base.enamel * therm.enamel * tiss.enamel);

  // Calibrate realistic empirical cases (e.g., Taforalt 15 ka / Shum Laka 8 ka in Africa)
  if (regime === 'tropical_africa' && age === 'lt15k' && tissue === 'petrous') {
    nucScore = 54;
    mtScore = 68;
    zoomsScore = 62;
  }
  if (regime === 'tropical_africa' && age === '15k_100k' && tissue === 'petrous') {
    nucScore = 10;
    mtScore = 18;
    zoomsScore = 34;
  }
  if (regime === 'temperate' && age === '100k_450k' && tissue === 'petrous') {
    nucScore = 24;
    mtScore = 38;
  }

  const toStatus = (v: number): MethodViabilityResult['status'] => {
    if (v >= 65) return 'Óptima';
    if (v >= 35) return 'Factible con cautela';
    if (v >= 12) return 'Límite extremo';
    return 'No viable';
  };

  const methods: MethodViabilityResult[] = [
    {
      id: 'adn_nuclear',
      label: 'ADN nuclear antiguo (aDNA)',
      discipline: 'paleogenomica',
      viabilityPct: nucScore,
      status: toStatus(nucScore),
      rationale:
        tissue !== 'petrous' && tissue !== 'cortical_bone'
          ? 'El esmalte y el sedimento apenas conservan ADN nuclear endógeno utilizable; se requiere hueso petroso o cemento dental.'
          : nucScore >= 35
            ? 'Permite reconstruir ascendencia, flujo génico y parentesco fino en sala blanca con bibliotecas monocatenarias.'
            : 'La edad térmica supera el umbral de supervivencia del ADN nuclear por hidrólisis y despurinación aceleradas.',
    },
    {
      id: 'adn_mt_seda',
      label: 'ADN mitocondrial / sedaDNA',
      discipline: 'paleogenomica',
      viabilityPct: mtScore,
      status: toStatus(mtScore),
      rationale:
        tissue === 'sediment'
          ? mtScore >= 35
            ? 'El ADN sedimentario permite detectar presencia de homininos y fauna en la estratigrafía sin destruir fósiles.'
            : 'Las temperaturas cálidas o edades superiores al Pleistoceno Medio degradan los fragmentos adsorbidos en sedimento.'
          : mtScore >= 35
            ? 'Su alto número de copias celulares ofrece mayor probabilidad de éxito que el ADN nuclear, pero solo traza el linaje materno.'
            : 'Incluso las múltiples copias mitocondriales desaparecen bajo esta combinación de antigüedad y régimen térmico.',
    },
    {
      id: 'colageno_zooms',
      label: 'Colágeno tipo I (ZooMS)',
      discipline: 'paleoproteomica',
      viabilityPct: zoomsScore,
      status: toStatus(zoomsScore),
      rationale:
        tissue === 'enamel' || tissue === 'sediment'
          ? 'ZooMS analiza colágeno óseo o dentina; no se aplica directamente a esmalte puro ni a sedimentos.'
          : zoomsScore >= 35
            ? 'Ideal para cribar rápidamente cientos de astillas óseas indetectables y seleccionar muestras candidatas antes de extraer ADN.'
            : 'El colágeno sufre hidrólisis severa en horizontes muy antiguos o climas tropicales prolongados.',
    },
    {
      id: 'proteoma_esmalte',
      label: 'Proteoma de esmalte (LC-MS/MS)',
      discipline: 'paleoproteomica',
      viabilityPct: enamelScore,
      status: toStatus(enamelScore),
      rationale:
        tissue !== 'enamel'
          ? 'Requiere esmalte dental mineralizado; si la excavación aporta dientes asociados, esta sería la vía prioritaria para tiempo profundo.'
          : enamelScore >= 35
            ? 'Los cristales de hidroxiapatita protegen péptidos de amelogenina y enamelina durante millones de años, incluso en África Austral.'
            : 'Incluso en esmalte, por encima de 3 Ma la recuperación es muy fragmentaria y requiere espectrometría de altísima sensibilidad.',
    },
  ];

  const sorted = [...methods].sort((a, b) => b.viabilityPct - a.viabilityPct);
  const top = sorted[0];

  const summary =
    top.viabilityPct >= 35
      ? `Estrategia prioritaria: ${top.label} (${top.viabilityPct} % de viabilidad estimada).`
      : `Escenario en el límite biomolecular actual: ninguna técnica con la matriz elegida supera el umbral rutinario; conviene buscar esmalte dental (para LC-MS/MS) o integrar morfología, datación radiométrica e isótopos estables.`;

  const diagenesisNote =
    regime === 'tropical_africa'
      ? 'La cinética térmica (ley de Arrhenius) acelera exponencialmente la rotura del ADN y del colágeno en climas africanos cálidos; por ello la paleogenómica africana se concentra hoy en los últimos ~15 ka, mientras el esmalte dental extiende el alcance hasta ~2–3,5 Ma.'
      : regime === 'cold'
        ? 'Las bajas temperaturas constantes (cuevas frías o permafrost) ralentizan drásticamente la hidrólisis espontánea y permiten recuperar ADN nuclear hasta ~430 ka en homininos y colágeno hasta ~1 Ma.'
        : 'En cuevas templadas o kársticas la preservación es heterogénea: el microclima interno, el pH alcalino y la ausencia de filtraciones marcan la diferencia entre éxito y degradación total.';

  const cautionNote =
    top.discipline === 'paleoproteomica'
      ? 'Recuerde que la paleoproteómica ofrece menos posiciones variables que un genoma completo: autentique siempre mediante desamidación N/Q y contraste con morfología comparada.'
      : 'Exija autenticación en sala blanca (tasa de desaminación C→T en extremos 5\', longitud <70 pb y estimación de contaminación moderna) y minimice el muestreo destructivo.';

  return {
    methods,
    recommendedId: top.id,
    summary,
    diagenesisNote,
    cautionNote,
  };
}
