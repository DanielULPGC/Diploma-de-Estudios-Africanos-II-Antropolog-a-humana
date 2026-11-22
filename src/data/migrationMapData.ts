export type MigrationWaveId =
  | 'ola-1-erectus'
  | 'ola-2-panafricana'
  | 'ola-3-eurasia-sahul'
  | 'ola-4-holoceno-americas';

export type EvidenceSourceLens = 'smithsonian' | 'pastwomen' | 'ambos';

export interface MigrationWave {
  id: MigrationWaveId;
  order: number;
  shortLabel: string;
  title: string;
  chronology: string;
  taxa: string;
  strokeColor: string;
  accentClass: string;
  summary: string;
  climateDriver: string;
  defaultFocusCenter: [number, number];
  defaultFocusScale: number;
}

export interface MigrationCorridor {
  id: string;
  waveId: MigrationWaveId;
  label: string;
  chronology: string;
  coordinates: Array<[number, number]>;
  dashed?: boolean;
  note: string;
}

export interface MigrationSiteNode {
  id: string;
  order: number;
  name: string;
  region: string;
  coordinates: [number, number]; // [lon, lat]
  chronology: string;
  ageSortMa: number;
  waveIds: MigrationWaveId[];
  primaryWaveId: MigrationWaveId;
  sourceLens: EvidenceSourceLens;
  taxa: string;
  headline: string;
  smithsonianEvidence: string;
  pastwomenEvidence: string;
  archaeologicalIndicators: Array<{ label: string; detail: string }>;
  environmentalContext: string;
  citation: string;
  atlasTaxonId?: string;
  linkedTopicId: string;
  linkedTopicLabel: string;
  externalRefUrl: string;
  externalRefLabel: string;
}

export const MIGRATION_WAVES: MigrationWave[] = [
  {
    id: 'ola-1-erectus',
    order: 1,
    shortLabel: '1. Salida H. erectus',
    title: 'Primera expansión africana y salida de Homo erectus',
    chronology: '4,4 Ma – 800 ka',
    taxa: 'Australopithecus · Homo habilis · Homo ergaster / erectus',
    strokeColor: '#b43c0b',
    accentClass: 'text-ochre',
    summary:
      'Consolidación del bipedismo y las primeras tecnologías líticas en el Rift africano, seguida de la expansión de Homo erectus fuera de África hacia el Cáucaso (Dmanisi) y el sudeste asiático (Java).',
    climateDriver:
      'Pulsos húmedo-secos del Plio-Pleistoceno que abrieron corredores de sabana arbolada desde el valle del Rift hasta Eurasia.',
    defaultFocusCenter: [45, 16],
    defaultFocusScale: 1.45,
  },
  {
    id: 'ola-2-panafricana',
    order: 2,
    shortLabel: '2. Red panafricana',
    title: 'Origen panafricano y redes de intercambio de Homo sapiens',
    chronology: '320 – 70 ka',
    taxa: 'Homo sapiens temprano',
    strokeColor: '#156f55',
    accentClass: 'text-forest',
    summary:
      'Poblaciones subdivididas de Homo sapiens distribuidas por todo el continente africano (Magreb, Rift Oriental y África Austral) intercambiaron genes, obsidiana, pigmentos y prácticas de cuidado infantil.',
    climateDriver:
      'Ciclos de variabilidad climática extrema y fases de «Sáhara verde» que conectaron y aislaron periódicamente poblaciones regionales (Hipótesis de Selección por Variabilidad, Potts).',
    defaultFocusCenter: [20, 0],
    defaultFocusScale: 1.85,
  },
  {
    id: 'ola-3-eurasia-sahul',
    order: 3,
    shortLabel: '3. Eurasia y Sahul',
    title: 'Dispersión de Homo sapiens hacia Eurasia, el Levante y Sahul',
    chronology: '120 – 45 ka',
    taxa: 'Homo sapiens (contacto con H. neanderthalensis y denisovanos)',
    strokeColor: '#1f5fa8',
    accentClass: 'text-lapis',
    summary:
      'Expansiones sostenidas a través del corredor levantino y las costas meridionales de Arabia e Índico hasta Europa, Asia interior y la travesía marítima planificada hacia Australia (Sahul).',
    climateDriver:
      'Ventanas húmedas interglaciales (MIS 5 y MIS 3) junto a descensos del nivel del mar que acortaron las distancias insulares hacia Sahul.',
    defaultFocusCenter: [65, 15],
    defaultFocusScale: 1.25,
  },
  {
    id: 'ola-4-holoceno-americas',
    order: 4,
    shortLabel: '4. Américas y Holoceno',
    title: 'Poblamiento de las Américas y redes del Holoceno africano',
    chronology: '30 – 8 ka',
    taxa: 'Homo sapiens',
    strokeColor: '#7d4ca5',
    accentClass: 'text-plum',
    summary:
      'Cruce de Beringia y expansión rápida a lo largo de las Américas hasta la Patagonia, en paralelo a la emergencia del pastoreo, la cerámica y la domesticación vegetal en el Sáhara Verde.',
    climateDriver:
      'Retirada glaciar del Pleistoceno final (corredores costeros del Pacífico) y Periodo Húmedo Africano (~11–5 ka).',
    defaultFocusCenter: [-18, 8],
    defaultFocusScale: 1.0,
  },
];

export const MIGRATION_CORRIDORS: MigrationCorridor[] = [
  {
    id: 'corr-rift-core',
    waveId: 'ola-1-erectus',
    label: 'Corredor evolutivo del Rift Oriental (Laetoli → Turkana → Hadar)',
    chronology: '4,4 – 1,8 Ma',
    coordinates: [
      [35.35, -2.99],
      [36.44, -1.57],
      [36.05, 4.1],
      [40.58, 11.1],
    ],
    note: 'Eje tectónico y lacustre donde se documentan los primeros bípedos, el Olduvayense y el surgimiento de Homo ergaster/erectus.',
  },
  {
    id: 'corr-erectus-caucasus',
    waveId: 'ola-1-erectus',
    label: 'Primera salida de África hacia el Cáucaso (Dmanisi)',
    chronology: '~1,85 – 1,77 Ma',
    coordinates: [
      [40.58, 11.1],
      [38.5, 22.0],
      [35.5, 32.0],
      [44.2, 41.33],
    ],
    note: 'Expansión temprana de Homo erectus por el corredor levantino hasta el Cáucaso meridional.',
  },
  {
    id: 'corr-erectus-asia',
    waveId: 'ola-1-erectus',
    label: 'Dispersión asiática de Homo erectus hacia Sangiran (Java)',
    chronology: '~1,7 – 1,5 Ma',
    coordinates: [
      [44.2, 41.33],
      [66.0, 31.0],
      [82.0, 21.0],
      [100.5, 7.5],
      [110.83, -7.45],
    ],
    note: 'Ruta meridional asiática que llevó a Homo erectus a las llanuras de Sunda y Java durante descensos del nivel marino.',
  },
  {
    id: 'corr-panafrican-north',
    waveId: 'ola-2-panafricana',
    label: 'Corredor panafricano Rift ↔ Sáhara Verde ↔ Magreb (Jebel Irhoud)',
    chronology: '~320 – 150 ka',
    coordinates: [
      [36.44, -1.57],
      [27.0, 11.0],
      [10.5, 24.75],
      [-8.87, 31.85],
    ],
    note: 'Puentes húmedos transaharianos que conectaron las poblaciones tempranas de Homo sapiens de África Oriental y el Magreb.',
  },
  {
    id: 'corr-panafrican-south',
    waveId: 'ola-2-panafricana',
    label: 'Red meridional del Rift a Panga ya Saidi y el Cabo (Blombos)',
    chronology: '~320 – 73 ka',
    coordinates: [
      [36.44, -1.57],
      [39.81, -3.68],
      [31.5, -18.5],
      [21.22, -34.41],
    ],
    note: 'Circulación de redes tecnológicas MSA, pigmentos de ocre, adornos de conchas y prácticas funerarias infantiles.',
  },
  {
    id: 'corr-out-of-africa-levant',
    waveId: 'ola-3-eurasia-sahul',
    label: 'Corredor del Nilo y Levante hacia Europa y Asia occidental',
    chronology: '~120 – 45 ka',
    coordinates: [
      [40.58, 11.1],
      [33.5, 24.5],
      [35.29, 32.68],
      [22.0, 41.5],
      [-3.52, 42.35],
    ],
    note: 'Dispersión de Homo sapiens por el Levante hacia Europa occidental, coexistiendo e intercambiando genes con poblaciones neandertales.',
  },
  {
    id: 'corr-southern-coastal-sahul',
    waveId: 'ola-3-eurasia-sahul',
    label: 'Ruta costera del Índico y travesía marítima a Sahul (Australia)',
    chronology: '~70 – 50 ka',
    coordinates: [
      [40.58, 11.1],
      [45.0, 12.8],
      [58.5, 21.5],
      [77.0, 11.0],
      [102.0, 3.0],
      [118.0, -7.5],
      [132.89, -12.48],
    ],
    note: 'Expansión rápida siguiendo recursos costeros del océano Índico hasta alcanzar el continente de Sahul mediante navegación temprana.',
  },
  {
    id: 'corr-beringia-americas',
    waveId: 'ola-4-holoceno-americas',
    label: 'Ruta euroasiática septentrional, Beringia y corredor costero americano',
    chronology: '~30 – 14,5 ka',
    coordinates: [
      [35.29, 32.68],
      [68.0, 52.0],
      [115.0, 62.0],
      [165.0, 65.0],
    ],
    dashed: true,
    note: 'Tramo noreste asiático hacia el puente terrestre de Beringia durante el Último Máximo Glacial.',
  },
  {
    id: 'corr-americas-pacific',
    waveId: 'ola-4-holoceno-americas',
    label: 'Expansión por el continente americano hasta Monte Verde (Chile)',
    chronology: '~20 – 14,5 ka',
    coordinates: [
      [-164.0, 63.0],
      [-135.0, 54.0],
      [-115.0, 32.0],
      [-92.0, 15.0],
      [-79.0, -2.0],
      [-73.2, -41.5],
    ],
    dashed: true,
    note: 'Descenso costero y terrestre por América del Norte, Centroamérica y Sudamérica con aprovechamiento intensivo de plantas y fauna.',
  },
  {
    id: 'corr-green-sahara-holocene',
    waveId: 'ola-4-holoceno-americas',
    label: 'Redes pastoriles y agrícolas del Sáhara Verde y Sahel',
    chronology: '~10,5 – 5 ka',
    coordinates: [
      [32.0, 19.5],
      [22.5, 22.0],
      [10.5, 24.75],
      [-2.0, 17.0],
    ],
    note: 'Expansión holocena de grupos ganaderos y cerámicos a través de lagos y uadis fértiles del Periodo Húmedo Africano.',
  },
];

export const MIGRATION_NODES: MigrationSiteNode[] = [
  {
    id: 'node-hadar',
    order: 1,
    name: 'Hadar y Awash Medio',
    region: 'Etiopía · Triángulo de Afar',
    coordinates: [40.58, 11.1],
    chronology: '4,4 – 3,2 Ma',
    ageSortMa: 3.8,
    waveIds: ['ola-1-erectus'],
    primaryWaveId: 'ola-1-erectus',
    sourceLens: 'ambos',
    taxa: 'Ardipithecus ramidus · Australopithecus afarensis',
    headline: 'Cuna del bipedismo temprano: Ardi y Lucy (AL 288-1)',
    smithsonianEvidence:
      'El Smithsonian destaca el Awash Medio y Hadar como prueba de que caminar erguido evolucionó hace más de 4,4 Ma en mosaicos arbolados, millones de años antes del gran cerebro (~400–450 cm³).',
    pastwomenEvidence:
      'Pastwomen reexamina a AL 288-1 («Lucy») y la pelvis de A. afarensis superando la pasividad de la iconografía clásica: subraya la movilidad diaria femenina, el transporte de crías y la recolección vegetal estable.',
    archaeologicalIndicators: [
      { label: 'Fósiles clave', detail: 'AL 288-1 («Lucy», ~3,2 Ma) y ARA-VP-6/500 («Ardi», ~4,4 Ma).' },
      { label: 'Morfología pélvica', detail: 'Ilion ancho y bajo con reorientación glútea para equilibrio bípedo.' },
      { label: 'Dieta y entorno', detail: 'Bosques galería y sabanas arboladas; dieta omnívora predominantemente vegetal.' },
    ],
    environmentalContext: 'Mosaico húmedo-arbolado del Plioceno con fluctuaciones estacionales en el Afar.',
    citation: 'Smithsonian Human Origins (Early Hominins); Pastwomen (Evolución Humana · Lucy).',
    atlasTaxonId: 'afarensis',
    linkedTopicId: 'tema-04',
    linkedTopicLabel: 'Tema 04 · Bipedismo y biomecánica',
    externalRefUrl: 'https://humanorigins.si.edu/',
    externalRefLabel: 'Smithsonian Human Origins',
  },
  {
    id: 'node-laetoli-olduvai',
    order: 2,
    name: 'Laetoli y Garganta de Olduvai',
    region: 'Tanzania · Rift Oriental',
    coordinates: [35.35, -2.99],
    chronology: '3,66 – 1,8 Ma',
    ageSortMa: 2.6,
    waveIds: ['ola-1-erectus'],
    primaryWaveId: 'ola-1-erectus',
    sourceLens: 'ambos',
    taxa: 'Australopithecus afarensis · Homo habilis · Paranthropus boisei',
    headline: 'Huellas colectivas volcánicas y revolución lítica olduvayense',
    smithsonianEvidence:
      'En Laetoli, tres individuos caminaron erguidos sobre ceniza volcánica hace 3,66 Ma; en Olduvai (~1,9–1,7 Ma), los conjuntos olduvayenses documentan lascas cortantes y percutores que diversificaron la dieta.',
    pastwomenEvidence:
      'Pastwomen resalta las pistas de Laetoli como evidencia directa de desplazamiento colectivo intergeneracional (adultos y juveniles) y amplía la lectura tecnológica de Olduvai hacia el procesado vegetal y de médula.',
    archaeologicalIndicators: [
      { label: 'Icnología', detail: 'Rastro de ~27 m en Laetoli con arco plantar y dedo gordo alineado.' },
      { label: 'Industria lítica', detail: 'Cantos tallados y lascas olduvayenses con marcas de corte en huesos.' },
      { label: 'Coexistencia', detail: 'Homo habilis convivió en el mismo paisaje con Paranthropus boisei.' },
    ],
    environmentalContext: 'Llanuras volcánicas y márgenes lacustres sometidos a progresiva aridificación.',
    citation: 'Smithsonian Human Origins (Tools & Food); Pastwomen (Crítica a la Marcha del Progreso).',
    atlasTaxonId: 'habilis',
    linkedTopicId: 'tema-05',
    linkedTopicLabel: 'Tema 05 · Herramientas y subsistencia',
    externalRefUrl: 'https://www.pastwomen.net/',
    externalRefLabel: 'Pastwomen · Paleolítico',
  },
  {
    id: 'node-turkana',
    order: 3,
    name: 'Turkana Occidental y Koobi Fora',
    region: 'Kenia · Cuenca del Turkana',
    coordinates: [36.05, 4.1],
    chronology: '1,9 – 1,5 Ma',
    ageSortMa: 1.85,
    waveIds: ['ola-1-erectus'],
    primaryWaveId: 'ola-1-erectus',
    sourceLens: 'ambos',
    taxa: 'Homo ergaster / Homo erectus',
    headline: 'Cuerpos de larga distancia, Achelense y dilema obstétrico',
    smithsonianEvidence:
      'El esqueleto de Nariokotome (KNM-WT 15000, ~1,53 Ma) revela proporciones modernas adaptadas a largas caminatas y carrera de resistencia, junto a los bifaces achelenses más tempranos de Kokiselei (~1,76 Ma).',
    pastwomenEvidence:
      'Pastwomen analiza el estrechamiento pélvico y la expansión cerebral (600 → 1.000 cm³) como origen del dilema obstétrico, el parto socialmente asistido y las redes de aloparentalidad.',
    archaeologicalIndicators: [
      { label: 'Postcráneo', detail: 'KNM-WT 15000 («Niño de Turkana»): piernas largas, termorregulación eficiente.' },
      { label: 'Tecnología', detail: 'Primeros grandes bifaces achelenses (~1,76 Ma) en Kokiselei.' },
      { label: 'Socialización', detail: 'Aumento de dependencia neonatal y necesidad de cuidados cooperativos.' },
    ],
    environmentalContext: 'Sabanas abiertas con cauces fluviales estacionales y fuerte insolación.',
    citation: 'Smithsonian Human Origins (Bodies); Pastwomen (Maternidad, parto y cuidados).',
    atlasTaxonId: 'erectus',
    linkedTopicId: 'tema-09',
    linkedTopicLabel: 'Tema 09 · Teoría de la abuela y parentesco',
    externalRefUrl: 'https://humanorigins.si.edu/',
    externalRefLabel: 'Smithsonian Human Origins',
  },
  {
    id: 'node-dmanisi',
    order: 4,
    name: 'Dmanisi',
    region: 'Georgia · Cáucaso Meridional',
    coordinates: [44.2, 41.33],
    chronology: '~1,77 Ma',
    ageSortMa: 1.77,
    waveIds: ['ola-1-erectus'],
    primaryWaveId: 'ola-1-erectus',
    sourceLens: 'ambos',
    taxa: 'Homo erectus (georgicus)',
    headline: 'Primera salida confirmada de África y cuidados a la vulnerabilidad',
    smithsonianEvidence:
      'Cinco cráneos fósiles y útiles olduvayenses demuestran que los primeros grupos salieron de África con cerebros aún modestos (~546–730 cm³), impulsados por flexibilidad ecológica y no por un gran encéfalo.',
    pastwomenEvidence:
      'El individuo D3444/D3900 sobrevivió años tras perder casi toda su dentición: Pastwomen y la bioarqueología del cuidado lo citan como prueba temprana de alimentación asistida y solidaridad grupal.',
    archaeologicalIndicators: [
      { label: 'Serie craneal', detail: '5 cráneos con amplia variación morfológica dentro de una sola población.' },
      { label: 'Bioarqueología del cuidado', detail: 'Cráneo D3444 edéntulo con reabsorción alveolar completa (supervivencia asistida).' },
      { label: 'Utillaje', detail: 'Lascas y núcleos de tradición olduvayense sobre basaltos locales.' },
    ],
    environmentalContext: 'Praderas y bosques templados caucásicos con fauna euroasiática y africana.',
    citation: 'Smithsonian Human Origins (Early Dispersals); Pastwomen (Arqueología de los cuidados).',
    atlasTaxonId: 'erectus',
    linkedTopicId: 'tema-04',
    linkedTopicLabel: 'Tema 04 · Evolución y dispersión',
    externalRefUrl: 'https://humanorigins.si.edu/',
    externalRefLabel: 'Smithsonian Human Origins',
  },
  {
    id: 'node-sangiran',
    order: 5,
    name: 'Sangiran y Liang Bua',
    region: 'Indonesia · Java y Flores',
    coordinates: [110.83, -7.45],
    chronology: '1,6 Ma – 50 ka',
    ageSortMa: 1.5,
    waveIds: ['ola-1-erectus', 'ola-3-eurasia-sahul'],
    primaryWaveId: 'ola-1-erectus',
    sourceLens: 'smithsonian',
    taxa: 'Homo erectus · Homo floresiensis',
    headline: 'Alcance asiático de Homo erectus y evolución insular',
    smithsonianEvidence:
      'Sangiran (Java) documenta una ocupación prolongada de Homo erectus desde hace ~1,5–1,6 Ma, mientras Liang Bua (isla de Flores) muestra la ramificación extrema del árbol hominino con H. floresiensis (~100–50 ka).',
    pastwomenEvidence:
      'La persistencia de poblaciones en entornos insulares y tropicales subraya la importancia de la recolección forestal, el uso de recursos costeros y la transmisión cultural estable entre generaciones.',
    archaeologicalIndicators: [
      { label: 'Dispersión temprana', detail: 'Fósiles de Homo erectus en terrazas fluviales de Java (~1,5 Ma).' },
      { label: 'Enanismo insular', detail: 'Homo floresiensis (~1,06 m, ~380–420 cm³) con talla lítica asociada.' },
      { label: 'Árbol ramificado', detail: 'Coexistencia tardía de varios linajes humanos en el sudeste asiático.' },
    ],
    environmentalContext: 'Plataforma de Sunda expuesta en fases glaciares e islas tropicales de Wallacea.',
    citation: 'Smithsonian Human Origins (Homo erectus & Homo floresiensis).',
    atlasTaxonId: 'floresiensis',
    linkedTopicId: 'tema-03',
    linkedTopicLabel: 'Tema 03 · Proceso de hominización',
    externalRefUrl: 'https://humanorigins.si.edu/',
    externalRefLabel: 'Smithsonian Human Origins',
  },
  {
    id: 'node-olorgesailie',
    order: 6,
    name: 'Cuenca de Olorgesailie',
    region: 'Kenia · Rift Meridional',
    coordinates: [36.44, -1.57],
    chronology: '1,2 Ma – 305 ka',
    ageSortMa: 0.32,
    waveIds: ['ola-1-erectus', 'ola-2-panafricana'],
    primaryWaveId: 'ola-2-panafricana',
    sourceLens: 'smithsonian',
    taxa: 'Homo erectus → Homo sapiens temprano',
    headline: 'Transición Achelense → MSA, obsidiana lejana y pigmentos',
    smithsonianEvidence:
      'Excavada durante décadas por Rick Potts (Smithsonian), registra el reemplazo de grandes bifaces achelenses por puntas finas MSA (~320–305 ka), obsidiana transportada desde 25–50+ km y pigmentos de manganeso y ocre.',
    pastwomenEvidence:
      'Las redes de intercambio a larga distancia demuestran que la supervivencia frente a crisis climáticas dependió de alianzas sociales, reciprocidad y cooperación intergrupal más allá del núcleo local.',
    archaeologicalIndicators: [
      { label: 'Salto tecnológico', detail: 'Puntas MSA enmangables sustituyendo a los bifaces achelenses (~320 ka).' },
      { label: 'Redes sociales', detail: 'Obsidiana importada desde canteras situadas a 25–50+ km.' },
      { label: 'Pigmentos', detail: 'Bloques de manganeso negro y ocre rojo con estrías de raspado.' },
    ],
    environmentalContext: 'Fragmentación lacustre severa y recambio del ~85 % de la megafauna herbívora.',
    citation: 'Potts et al. (2018), Science 360(6384); Smithsonian Human Origins Program.',
    atlasTaxonId: 'sapiens',
    linkedTopicId: 'tema-07',
    linkedTopicLabel: 'Tema 07 · Diversidad y origen panafricano',
    externalRefUrl: 'https://humanorigins.si.edu/',
    externalRefLabel: 'Smithsonian · Olorgesailie',
  },
  {
    id: 'node-jebel-irhoud',
    order: 7,
    name: 'Jebel Irhoud',
    region: 'Marruecos · Magreb Atlántico',
    coordinates: [-8.87, 31.85],
    chronology: '~315 ka',
    ageSortMa: 0.315,
    waveIds: ['ola-2-panafricana'],
    primaryWaveId: 'ola-2-panafricana',
    sourceLens: 'ambos',
    taxa: 'Homo sapiens temprano',
    headline: 'Origen panafricano en mosaico de Homo sapiens',
    smithsonianEvidence:
      'Los restos datados por termoluminiscencia en ~315 ka combinan rostro y dentición modernos con bóveda craneal aún alargada, demostrando que Homo sapiens evolucionó en red por toda África y no en un único «Edén» oriental.',
    pastwomenEvidence:
      'La serie incluye individuos adultos y un menor (Irhoud 3) cuyo desarrollo dental confirma una maduración infantil más lenta y prolongada, clave para el aprendizaje cultural descrito por Pastwomen.',
    archaeologicalIndicators: [
      { label: 'Datación', detail: '~315 ± 34 ka sobre sílex quemados en hogares asociados a los fósiles.' },
      { label: 'Mosaico anatómico', detail: 'Cara retraída moderna + neurocráneo arcaico (~1.300–1.400 cm³).' },
      { label: 'Industria MSA', detail: 'Lascas y puntas Levallois sobre sílex importado de alta calidad.' },
    ],
    environmentalContext: 'Corredores verdes saharianos que conectaban el Magreb con el África subsahariana.',
    citation: 'Hublin et al. (2017), Nature; Smithsonian Human Origins; Pastwomen (Infancia).',
    atlasTaxonId: 'sapiens',
    linkedTopicId: 'tema-07',
    linkedTopicLabel: 'Tema 07 · Origen panafricano',
    externalRefUrl: 'https://humanorigins.si.edu/',
    externalRefLabel: 'Smithsonian Human Origins',
  },
  {
    id: 'node-atapuerca-sidron',
    order: 8,
    name: 'Atapuerca y El Sidrón',
    region: 'Península Ibérica · Europa Occidental',
    coordinates: [-3.52, 42.35],
    chronology: '800 – 49 ka',
    ageSortMa: 0.43,
    waveIds: ['ola-3-eurasia-sahul'],
    primaryWaveId: 'ola-3-eurasia-sahul',
    sourceLens: 'pastwomen',
    taxa: 'Homo antecessor · H. heidelbergensis · H. neanderthalensis',
    headline: 'Actividades de mantenimiento, botánica medicinal y cuidado comunitario',
    smithsonianEvidence:
      'La secuencia ibérica ilustra la profundidad de la ocupación europea previa a Homo sapiens y la complejidad conductual de los linajes hermanos euroasiáticos (especialmente neandertales).',
    pastwomenEvidence:
      'Eje central de Pastwomen: cráneos infantiles con craneosinostosis («Benjamina» en Atapuerca) y el cálculo dental de El Sidrón (con camomila, milenrama y álamo) prueban cuidados prolongados, gestión de salud y dietas vegetales ricas.',
    archaeologicalIndicators: [
      { label: 'Cuidado infantil', detail: 'Supervivencia de individuos con patologías graves gracias a atención grupal.' },
      { label: 'Cálculo dental', detail: 'Restos vegetales cocinados y plantas medicinales en El Sidrón (~49 ka).' },
      { label: 'Fuego y mantenimiento', detail: 'Hogares estructurados, procesado de pieles y curado de alimentos.' },
    ],
    environmentalContext: 'Alternancia de bosques templados y estepas frías del Pleistoceno Medio y Superior.',
    citation: 'Pastwomen (Actividades de mantenimiento y cuidados); Sánchez Romero (2022).',
    atlasTaxonId: 'neanderthalensis',
    linkedTopicId: 'tema-05',
    linkedTopicLabel: 'Tema 05 · Subsistencia y cuidados',
    externalRefUrl: 'https://www.pastwomen.net/',
    externalRefLabel: 'Pastwomen · Cuidados',
  },
  {
    id: 'node-blombos',
    order: 9,
    name: 'Blombos, Klasies River y Wonderwerk',
    region: 'Sudáfrica · Costa del Cabo e Interior',
    coordinates: [21.22, -34.41],
    chronology: '1,0 Ma – 73 ka',
    ageSortMa: 0.1,
    waveIds: ['ola-2-panafricana'],
    primaryWaveId: 'ola-2-panafricana',
    sourceLens: 'ambos',
    taxa: 'Homo erectus → Homo sapiens',
    headline: 'Fuego temprano, talleres de ocre, adornos y dieta costera-vegetal',
    smithsonianEvidence:
      'Wonderwerk preserva indicios de fuego controlado hace ~1 Ma; Blombos (~100–73 ka) documenta kits de pintura de ocre en conchas de abulón, grabados geométricos y cuentas perforadas de Nassarius.',
    pastwomenEvidence:
      'Pastwomen y la arqueología sudafricana destacan la recolección sistemática de moluscos y raíces asadas (como rizomas ricos en almidón en Klasies River/Border Cave) como sostén calórico diario y transmisión simbólica.',
    archaeologicalIndicators: [
      { label: 'Simbolismo temprano', detail: 'Bloque de ocre grabado (~77 ka) y trazo geométrico sobre lasca (~73 ka).' },
      { label: 'Adornos personales', detail: 'Más de 40 cuentas perforadas de concha marina con restos de ocre.' },
      { label: 'Nutrición y fuego', detail: 'Cenizas vegetales en Wonderwerk y tubérculos asados en Klasies River.' },
    ],
    environmentalContext: 'Ecosistema fynbos del Cabo con enorme riqueza en geófitos (raíces) y fauna intermareal.',
    citation: 'Smithsonian Human Origins (Language & Symbols); Pastwomen (Alimentación y fuego).',
    atlasTaxonId: 'sapiens',
    linkedTopicId: 'tema-06',
    linkedTopicLabel: 'Tema 06 · Mente y simbolismo',
    externalRefUrl: 'https://humanorigins.si.edu/',
    externalRefLabel: 'Smithsonian · Blombos',
  },
  {
    id: 'node-levant-shanidar',
    order: 10,
    name: 'Skhul, Qafzeh y Shanidar',
    region: 'Levante Mediterráneo y Montes Zagros',
    coordinates: [35.29, 32.68],
    chronology: '120 – 45 ka',
    ageSortMa: 0.11,
    waveIds: ['ola-3-eurasia-sahul'],
    primaryWaveId: 'ola-3-eurasia-sahul',
    sourceLens: 'ambos',
    taxa: 'Homo sapiens · Homo neanderthalensis',
    headline: 'Puerta levantina de salida de África y encuentro poblacional',
    smithsonianEvidence:
      'Skhul y Qafzeh (~120–90 ka) registran las primeras dispersiones de Homo sapiens hacia el Levante, con sepulturas acompañadas de ocre y conchas marinas, en la zona de contacto e hibridación con neandertales.',
    pastwomenEvidence:
      'En Shanidar (Irak), el individuo Shanidar 1 sobrevivió décadas pese a fractura craneal, ceguera parcial y amputación de un brazo, demostrando redes de cuidados sostenidos, eje clave del enfoque Pastwomen.',
    archaeologicalIndicators: [
      { label: 'Enterramientos', detail: 'Inhumaciones tempranas de H. sapiens en Qafzeh (incluyendo sepultura doble adulto-infantil).' },
      { label: 'Flujo génico', detail: 'Región puente asociada al mestizaje entre H. sapiens y neandertales (~60–50 ka).' },
      { label: 'Atención a la discapacidad', detail: 'Supervivencia prolongada de Shanidar 1 documentada por paleopatología.' },
    ],
    environmentalContext: 'Corredor levantino-árabe activado durante fases climáticas húmedas interglaciales.',
    citation: 'Smithsonian Human Origins (Skhul/Qafzeh & Shanidar); Pastwomen (Cuidados).',
    atlasTaxonId: 'neanderthalensis',
    linkedTopicId: 'tema-07',
    linkedTopicLabel: 'Tema 07 · Expansión e hibridación',
    externalRefUrl: 'https://humanorigins.si.edu/',
    externalRefLabel: 'Smithsonian · Shanidar',
  },
  {
    id: 'node-panga-ya-saidi',
    order: 11,
    name: 'Panga ya Saidi',
    region: 'Kenia · Costa Suajili',
    coordinates: [39.81, -3.68],
    chronology: '~78 ka',
    ageSortMa: 0.078,
    waveIds: ['ola-2-panafricana', 'ola-3-eurasia-sahul'],
    primaryWaveId: 'ola-2-panafricana',
    sourceLens: 'pastwomen',
    taxa: 'Homo sapiens',
    headline: '«Mtoto»: el enterramiento infantil más antiguo conocido en África',
    smithsonianEvidence:
      'La larga secuencia estratigráfica (~78–4 ka) documenta una transición fluida del MSA al Paleolítico Superior Africano (LSA), con cuentas de concha, puntas miniaturizadas y ocupación continua en bosque costero.',
    pastwomenEvidence:
      'Referente emblemático de Pastwomen sobre la infancia prehistórica: una criatura de 2,5–3 años («Mtoto») depositada en fosa excavada, envuelta en un sudario perecedero y con la cabeza apoyada sobre un soporte orgánico.',
    archaeologicalIndicators: [
      { label: 'Ritual funerario', detail: 'Fosa deliberada y posición flexionada que sugiere envoltura textil/piel.' },
      { label: 'Infancia y afecto', detail: 'Centralidad social de las criaturas en comunidades africanas de hace 78 ka.' },
      { label: 'Continuidad ecológica', detail: 'Refugio estable de selva costera durante crisis climáticas continentales.' },
    ],
    environmentalContext: 'Ecotono de bosque tropical costero y sabana en el litoral del océano Índico.',
    citation: 'Martinón-Torres et al. (2021), Nature; Pastwomen (Arqueología de la infancia).',
    atlasTaxonId: 'sapiens',
    linkedTopicId: 'tema-06',
    linkedTopicLabel: 'Tema 06 · Infancia y simbolismo',
    externalRefUrl: 'https://www.pastwomen.net/',
    externalRefLabel: 'Pastwomen · Infancia',
  },
  {
    id: 'node-madjedbebe',
    order: 12,
    name: 'Madjedbebe (Sahul)',
    region: 'Australia · Tierra de Arnhem',
    coordinates: [132.89, -12.48],
    chronology: '~65 – 50 ka',
    ageSortMa: 0.065,
    waveIds: ['ola-3-eurasia-sahul'],
    primaryWaveId: 'ola-3-eurasia-sahul',
    sourceLens: 'smithsonian',
    taxa: 'Homo sapiens',
    headline: 'Navegación planificada hacia Sahul y procesado temprano de plantas',
    smithsonianEvidence:
      'Atestigua que poblaciones de Homo sapiens cruzaron múltiples brazos de mar abierto (hasta ~90 km) desde Wallacea hacia Sahul hace más de 50–65 ka, demostrando planificación marítima y cooperación demográfica.',
    pastwomenEvidence:
      'Incluye algunas de las piedras de moler más antiguas del mundo, restos carbonizados de tubérculos, semillas y abundantes pigmentos de ocre molido: evidencia material de tareas cotidianas de procesado y mantenimiento.',
    archaeologicalIndicators: [
      { label: 'Travesía oceánica', detail: 'Llegada a Sahul requiriendo embarcaciones capaces de transportar grupos viables.' },
      { label: 'Molienda vegetal', detail: 'Muelas líticas para semillas y procesamiento de plantas ricas en carbohidratos.' },
      { label: 'Hachas y pigmentos', detail: 'Hachas de filo pulido temprano y ocre reflectante.' },
    ],
    environmentalContext: 'Sabanas tropicales del norte de Sahul con nivel del mar ~60–80 m más bajo que hoy.',
    citation: 'Clarkson et al. (2017), Nature; Smithsonian Human Origins (Global Dispersal).',
    atlasTaxonId: 'sapiens',
    linkedTopicId: 'tema-07',
    linkedTopicLabel: 'Tema 07 · Dispersión global',
    externalRefUrl: 'https://humanorigins.si.edu/',
    externalRefLabel: 'Smithsonian Human Origins',
  },
  {
    id: 'node-monte-verde',
    order: 13,
    name: 'Corredor Pacífico y Monte Verde',
    region: 'América del Sur · Sur de Chile',
    coordinates: [-73.2, -41.5],
    chronology: '~14,5 ka',
    ageSortMa: 0.0145,
    waveIds: ['ola-4-holoceno-americas'],
    primaryWaveId: 'ola-4-holoceno-americas',
    sourceLens: 'ambos',
    taxa: 'Homo sapiens',
    headline: 'Poblamiento americano y preservación excepcional de tecnología orgánica',
    smithsonianEvidence:
      'Confirma la presencia de Homo sapiens en el extremo austral de Sudamérica hace ~14.500 años, respaldando una migración rápida desde Beringia a lo largo de corredores costeros ricos en algas y recursos marinos.',
    pastwomenEvidence:
      'La turbera conservó lo que suele desaparecer en otros yacimientos y reivindica Pastwomen: cordelería vegetal, estructuras de madera y piel, más de 20 especies de plantas medicinales/comestibles y algas masticadas.',
    archaeologicalIndicators: [
      { label: 'Tecnología perecedera', detail: 'Cuerdas de juncos, estacas de madera, restos de pieles y morteros.' },
      { label: 'Botánica medicinal', detail: 'Boldo, algas marinas (Durvillaea) y plantas terapéuticas transportadas desde la costa.' },
      { label: 'Campamento familiar', detail: 'Viviendas alargadas con hogares domésticos y huellas infantiles en arcilla.' },
    ],
    environmentalContext: 'Bosque templado húmedo y turberas subantárticas al oeste de los Andes.',
    citation: 'Smithsonian Human Origins (Peopling of the Americas); Pastwomen (Tecnologías orgánicas).',
    atlasTaxonId: 'sapiens',
    linkedTopicId: 'tema-10',
    linkedTopicLabel: 'Tema 10 · Subsistencia y entorno',
    externalRefUrl: 'https://humanorigins.si.edu/',
    externalRefLabel: 'Smithsonian Human Origins',
  },
  {
    id: 'node-takarkori',
    order: 14,
    name: 'Takarkori y Sáhara Verde',
    region: 'Libia · Macizo de Tadrart Acacus',
    coordinates: [10.5, 24.75],
    chronology: '~10,2 – 5 ka',
    ageSortMa: 0.01,
    waveIds: ['ola-2-panafricana', 'ola-4-holoceno-americas'],
    primaryWaveId: 'ola-4-holoceno-americas',
    sourceLens: 'ambos',
    taxa: 'Homo sapiens',
    headline: 'Cerámica temprana, pastoreo sahariano y redes del Holoceno',
    smithsonianEvidence:
      'Documenta la transformación africana del Holoceno temprano: antes de la agricultura cerealista, grupos móviles del Sáhara Verde fabricaron cerámica (~10 ka), recolectaron gramíneas silvestres y adoptaron la ganadería lechera.',
    pastwomenEvidence:
      'Los análisis de residuos lipídicos en cerámica (procesado de leche y plantas), la cestería preservada y las sepulturas de mujeres y criaturas en Takarkori visibilizan el papel central de las actividades de mantenimiento en la neolitización africana.',
    archaeologicalIndicators: [
      { label: 'Cerámica y cocina', detail: 'Recipientes cerámicos con residuos de plantas cocinadas y grasas lácteas (~7 ka).' },
      { label: 'Cestería y fibras', detail: 'Tejidos vegetales y contenedores conservados por la posterior aridez.' },
      { label: 'Genómica reciente', detail: 'ADN antiguo de Takarkori revela un linaje norteafricano profundo y distintivo.' },
    ],
    environmentalContext: 'Periodo Húmedo Africano con lagos, sabanas y ríos activos en el actual desierto del Sáhara.',
    citation: 'Smithsonian Human Origins (Domestication); Pastwomen (Neolítico y cerámica); Dunne et al. (2012).',
    atlasTaxonId: 'sapiens',
    linkedTopicId: 'tema-10',
    linkedTopicLabel: 'Tema 10 · Neolitización africana',
    externalRefUrl: 'https://www.pastwomen.net/',
    externalRefLabel: 'Pastwomen · Neolítico',
  },
];
