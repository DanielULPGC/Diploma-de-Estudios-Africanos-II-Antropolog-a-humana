import { resolveAssetUrl } from '../utils/assetUrl';

export type CulturalStudiesTabId =
  | 'marco-teorico'
  | 'genealogia-colonial'
  | 'tropos'
  | 'decodificador'
  | 'contranarrativas';

export type TropeMediumId =
  | 'todos'
  | 'literatura-prensa'
  | 'cine-comic'
  | 'turismo-publicidad'
  | 'archivo-museos';

export type HallReadingPosition = 'dominante' | 'negociada' | 'oposicional';

export type BinaryAxisId = 'todos' | 'epistemico' | 'politico' | 'estetico' | 'temporal';

export type CulturalVisualPlateId =
  | 'biblioteca-colonial'
  | 'archivo-colonial'
  | 'birmingham-prensa'
  | 'tratado-geografia-1850'
  | 'postales-africa-1905'
  | 'publicidad-colonial-1920'
  | 'restitucion-bronce-2018'
  | 'mapa-continente-oscuro'
  | 'zimbabue-arquitectura'
  | 'safari-postal-colonial'
  | 'exposicion-colonial-1900'
  | 'novela-aventuras-1890'
  | 'prensa-ilustrada-1884'
  | 'proyector-cine-colonial'
  | 'manuscritos-tombuctu'
  | 'estudio-bamako-cine'
  | 'arquitectura-afrofuturismo';

export interface CulturalVisualReferencePlate {
  id: CulturalVisualPlateId;
  section: CulturalStudiesTabId;
  sourceCode: string;
  datePeriod: string;
  sourceType: string;
  figureNum: string;
  kicker: string;
  title: string;
  caption: string;
  provenanceNote: string;
  analyticalFocus: string;
  credit: string;
  src: string;
  alt: string;
  compareWithId: CulturalVisualPlateId;
  linkedTab: CulturalStudiesTabId;
  linkedTheoristId?: string;
  linkedPhaseId?: string;
  linkedTropeId?: string;
  linkedArtifactId?: string;
  linkedDomainId?: string;
  linkedActionLabel: string;
}

export interface SectionGalleryMeta {
  kicker: string;
  title: string;
  intro: string;
}

export interface CulturalTheoristEntry {
  id: string;
  author: string;
  yearsAndOrigin: string;
  keyConcept: string;
  landmarkWork: string;
  visualPlateId: CulturalVisualPlateId;
  thesis: string;
  mysteryAfricaCritique: string;
  analyticalQuestion: string;
}

export interface ColonialGenealogyPhase {
  id: string;
  num: string;
  period: string;
  title: string;
  apparatus: string;
  visualPlateId: CulturalVisualPlateId;
  archiveQuote: string;
  archiveSource: string;
  summary: string;
  stereotypesForged: string[];
  materialInterests: string;
  historicalRefutation: string;
  linkedTropeIds: string[];
  glossaryTermId?: string;
  glossaryTermLabel?: string;
}

export interface ColonialBinaryPair {
  id: string;
  axis: Exclude<BinaryAxisId, 'todos'>;
  axisLabel: string;
  europePole: string;
  africaStereotypePole: string;
  colonialFunction: string;
  exampleInMedia: string;
  criticalReframing: string;
}

export interface MysteriousAfricaTrope {
  id: string;
  num: string;
  title: string;
  medium: Exclude<TropeMediumId, 'todos'>;
  mediumLabel: string;
  visualPlateId: CulturalVisualPlateId;
  clicheSignature: string;
  persistenceArc: string;
  historicalOrigin: string;
  culturalMechanism: string;
  examples: string;
  whatItErases: string;
  counterEvidence: string;
  linkedArtifactId?: string;
  tags: string[];
}

export interface DecodingArtifact {
  id: string;
  formatLabel: string;
  title: string;
  visualPlateId: CulturalVisualPlateId;
  sampleText: string;
  rhetoricalMarkers: Array<{ phrase: string; diagnosis: string }>;
  readings: Record<
    HallReadingPosition,
    {
      heading: string;
      summary: string;
      mechanism: string;
      classroomTakeaway: string;
    }
  >;
}

export interface CounterNarrativeDomain {
  id: string;
  num: string;
  domain: string;
  subtitle: string;
  visualPlateId: CulturalVisualPlateId;
  keyCreators: string;
  howItSubverts: string;
  landmarkWorks: string[];
  linkToModule: string;
}

export const SECTION_GALLERY_META: Record<CulturalStudiesTabId, SectionGalleryMeta> = {
  'marco-teorico': {
    kicker: 'Galería de fuentes históricas · Apartado I',
    title: 'Del gabinete colonial al seminario de Cultural Studies (ss. XIX–XX)',
    intro:
      'Tres fuentes visuales para rastrear cómo se fabricó la «biblioteca colonial» (Mudimbe), cómo la fotografía y el museo fijaron el «espectáculo del Otro» (Hall) y cómo la crítica cultural y poscolonial comenzó a desmontar esos códigos desde los años setenta.',
  },
  'genealogia-colonial': {
    kicker: 'Galería de fuentes históricas · Apartado II',
    title: 'Los soportes materiales del estereotipo colonial (1850–2018)',
    intro:
      'Cuatro fuentes documentales clave para observar cómo el imaginario del «África misteriosa» saltó de las sociedades geográficas a la vida cotidiana europea mediante álbumes de postales, envases de consumo colonial («commodity racism») y vitrinas museográficas hoy sujetas a investigación de procedencia y restitución.',
  },
  tropos: {
    kicker: 'Galería de fuentes históricas · Apartado III',
    title: 'Fuentes materiales e iconográficas de los 12 tropos coloniales',
    intro:
      'Cuatro testimonios de corte histórico —cartografía decimonónica, documentación arquitectónica del Gran Zimbabue, postales litográficas de safari y fotografía en albúmina de las Exposiciones Universales— para estudiar el origen concreto de los doce estereotipos analizados.',
  },
  decodificador: {
    kicker: 'Galería de fuentes históricas · Apartado IV',
    title: 'Soportes mediáticos de archivo para practicar la lectura crítica',
    intro:
      'Antes de analizar titulares, anuncios, cómics y campañas actuales, estas tres fuentes históricas muestran la matriz material donde nacieron los códigos estudiados con Stuart Hall: la novela ilustrada victoriana, la prensa del reparto de Berlín (1884) y los noticiarios fílmicos en 35 mm.',
  },
  contranarrativas: {
    kicker: 'Galería de fuentes históricas · Apartado V',
    title: 'El contra-archivo africano: manuscritos, estudios urbanos y futuro',
    intro:
      'Tres fuentes históricas y contemporáneas que devuelven la agencia intelectual, visual y proyectual al continente: la tradición manuscrita de Tombuctú junto a la literatura africana moderna, los estudios fotográficos y el cine de las independencias, y la arquitectura especulativa africana.',
  },
};

export const TROPE_MEDIUM_FILTERS: Array<{ id: TropeMediumId; label: string }> = [
  { id: 'todos', label: 'Todos los soportes' },
  { id: 'literatura-prensa', label: 'Literatura y prensa' },
  { id: 'cine-comic', label: 'Cine y cómic' },
  { id: 'turismo-publicidad', label: 'Turismo y publicidad' },
  { id: 'archivo-museos', label: 'Archivo colonial y museos' },
];

export const BINARY_AXIS_FILTERS: Array<{ id: BinaryAxisId; label: string }> = [
  { id: 'todos', label: 'Todos los ejes' },
  { id: 'epistemico', label: 'Epistémico (saber)' },
  { id: 'politico', label: 'Político (soberanía)' },
  { id: 'temporal', label: 'Temporal (alocronismo)' },
  { id: 'estetico', label: 'Estético (arte y cuerpo)' },
];

export const CULTURAL_STUDIES_VISUAL_PLATES: CulturalVisualReferencePlate[] = [
  // APARTADO I: MARCO TEÓRICO (3 fuentes históricas)
  {
    id: 'biblioteca-colonial',
    section: 'marco-teorico',
    sourceCode: 'Fuente CS-01',
    datePeriod: 'c. 1840–1910',
    sourceType: 'Folios de exploración, grabados y cartografía',
    figureNum: 'Lám. I.1',
    kicker: 'La «biblioteca colonial» (V.-Y. Mudimbe / E. Said)',
    title: 'Gabinete europeo de relatos de viaje, grabados y geografías imaginadas',
    caption:
      'Volúmenes encuadernados en piel de exploradores y misioneros, globo terráqueo de latón, planchas botánicas y grabados costumbristas que codificaron qué podía decirse sobre África en Europa.',
    provenanceNote:
      'Reconstrucción documental de gabinete geográfico europeo (siglo XIX) a partir de fondos de sociedades geográficas y relatos coloniales.',
    analyticalFocus:
      'Permite visualizar la tesis de Mudimbe (1988) y Said (1993): el «África misteriosa» se construyó primero en bibliotecas, mapas y libros de viajes europeos antes que en el terreno.',
    credit: 'Reconstrucción visual didáctica · Bloque IV · 05d (Apartado I)',
    src: resolveAssetUrl('src/assets/images/cs_fuente_biblioteca_colonial_1795521357533.jpg'),
    alt: 'Mesa de estudio decimonónica con volúmenes antiguos encuadernados en piel, globo terráqueo de latón, lupa, mapas plegados y láminas grabadas de botánica y paisajes africanos.',
    compareWithId: 'manuscritos-tombuctu',
    linkedTab: 'marco-teorico',
    linkedTheoristId: 'mudimbe',
    linkedActionLabel: 'Leer a Mudimbe',
  },
  {
    id: 'archivo-colonial',
    section: 'marco-teorico',
    sourceCode: 'Fuente CS-02',
    datePeriod: 'c. 1890–1935',
    sourceType: 'Placas de linterna mágica y registro museográfico',
    figureNum: 'Lám. I.2',
    kicker: 'Régimen de representación (Stuart Hall)',
    title: 'Dispositivos ópticos, placas sepia y clasificación colonial del «Otro»',
    caption:
      'Objetivo fotográfico de latón, bandeja de placas de linterna mágica en tonos sepia, libro de registro museográfico y lupa: el aparato técnico que fijó tipos humanos y culturales como estereotipos.',
    provenanceNote:
      'Tipología de archivo fotográfico y museográfico de época colonial (fines del s. XIX – primer tercio del s. XX).',
    analyticalFocus:
      'Ilustra «The Spectacle of the Other» (Stuart Hall, 1997): la cámara y la vitrina no solo registran, sino que producen diferencia y jerarquía simbólica.',
    credit: 'Reconstrucción visual didáctica · Bloque IV · 05d (Apartado I)',
    src: resolveAssetUrl('src/assets/images/cs_archivo_colonial_museo_1795520993284.jpg'),
    alt: 'Mesa de estudio de archivo histórico con cámara de latón del siglo XIX, bandeja de madera con placas fotográficas sepia de linterna mágica, libro de registro museográfico y lupa.',
    compareWithId: 'estudio-bamako-cine',
    linkedTab: 'marco-teorico',
    linkedTheoristId: 'stuart-hall',
    linkedActionLabel: 'Leer a Stuart Hall',
  },
  {
    id: 'birmingham-prensa',
    section: 'marco-teorico',
    sourceCode: 'Fuente CS-03',
    datePeriod: 'c. 1970–1985',
    sourceType: 'Hojas de contacto, prensa anotada y monografías (CCCS)',
    figureNum: 'Lám. I.3',
    kicker: 'Giro semiótico y crítica de medios (Birmingham / Poscolonial)',
    title: 'Mesa de análisis semiótico: prensa anotada, hojas de contacto y teoría crítica',
    caption:
      'Hojas de contacto fotográficas, recortes de prensa marcados con lápiz graso rojo, cuentahílos y monografías sobre representación, poder y medios: el método de los Cultural Studies.',
    provenanceNote:
      'Evocación documental del trabajo de seminario en el Centre for Contemporary Cultural Studies (Birmingham, años 70) y la crítica mediática africana posterior.',
    analyticalFocus:
      'Muestra el paso de consumir pasivamente titulares e imágenes sobre África a auditar sus encuadres, silencios y clichés (Hall, Wainaina, Adichie).',
    credit: 'Reconstrucción visual didáctica · Bloque IV · 05d (Apartado I)',
    src: resolveAssetUrl('src/assets/images/cs_fuente_birmingham_prensa_1795521357119.jpg'),
    alt: 'Fotografía documental en blanco y negro de una mesa de seminario universitario de los años setenta con hojas de contacto, recortes de prensa anotados en rojo, lupa cuentahílos y libros de Cultural Studies.',
    compareWithId: 'prensa-ilustrada-1884',
    linkedTab: 'marco-teorico',
    linkedTheoristId: 'wainaina',
    linkedActionLabel: 'Leer a Wainaina',
  },

  // APARTADO II: GENEALOGÍA COLONIAL DEL «ÁFRICA MISTERIOSA» (4 nuevas fuentes históricas)
  {
    id: 'tratado-geografia-1850',
    section: 'genealogia-colonial',
    sourceCode: 'Fuente CS-04',
    datePeriod: 'c. 1850–1878',
    sourceType: 'Atlas de sociedad geográfica y cuaderno de expedición',
    figureNum: 'Lám. II.1',
    kicker: 'Estrato 1788–1878 · Invención cartográfica de las «regiones inexploradas»',
    title: 'Atlas de expedición ecuatorial: la fabricación visual del «espacio vacío»',
    caption:
      'Folio abierto de una sociedad geográfica decimonónica que rotula la cuenca del Congo como «Régions inexplorées», junto a compás de latón, brújula de campaña y diario manuscrito de ruta.',
    provenanceNote:
      'Tipología documental de los boletines y atlas de la Royal Geographical Society y la Société de Géographie de París (1850–1878).',
    analyticalFocus:
      'Evidencia cómo el rótulo «inexplorado» transformó territorios densamente poblados y articulados comercialmente en lienzos disponibles para el «descubrimiento» y la anexión imperial.',
    credit: 'Reconstrucción visual didáctica · Bloque IV · 05d (Apartado II)',
    src: resolveAssetUrl('src/assets/images/cs_fuente_tratado_geografia_1850_1795626053307.jpg'),
    alt: 'Folio geográfico del siglo XIX abierto sobre mesa de lino mostrando un mapa grabado de la cuenca del Congo con zonas en blanco rotuladas como regiones inexploradas, acompañado de un compás de latón, brújula y cuaderno de campo manuscrito.',
    compareWithId: 'manuscritos-tombuctu',
    linkedTab: 'genealogia-colonial',
    linkedPhaseId: 'sociedades-geograficas',
    linkedActionLabel: 'Ver estrato 1788–1878',
  },
  {
    id: 'postales-africa-1905',
    section: 'genealogia-colonial',
    sourceCode: 'Fuente CS-05',
    datePeriod: 'c. 1903–1914',
    sourceType: 'Álbum filatélico de tarjetas postales coloniales',
    figureNum: 'Lám. II.2',
    kicker: 'Estrato 1884–1914 · La edad de oro de la tarjeta postal colonial',
    title: 'Álbum «Colonial Souvenirs»: Gorée, Argel, Tombuctú, Stone Town y Mombasa',
    caption:
      'Álbum de coleccionista europeo con postales sepia mataselladas de puertos, oasis y fortalezas costeras africanas, junto a guantes de archivo y lupa: el vehículo masivo del exotismo cotidiano.',
    provenanceNote:
      'Tipología de álbumes de tarjetas postales coloniales francesas y británicas (1900–1914), estudiadas por Malek Alloula y Nicolas Bancel.',
    analyticalFocus:
      'Millones de tarjetas postales convirtieron ciudades portuarias y sociedades africanas en «souvenirs» intercambiables que reforzaban en los hogares europeos la estética de la posesión imperial.',
    credit: 'Reconstrucción visual didáctica · Bloque IV · 05d (Apartado II)',
    src: resolveAssetUrl('src/assets/images/cs_fuente_postales_africa_1905_1795626075869.jpg'),
    alt: 'Álbum histórico de tarjetas postales coloniales abierto sobre escritorio de nogal con vistas en sepia de Gorée, Argel, Casablanca, Stone Town, Mombasa y Tombuctú, matasellos de época, guantes blancos de archivo y lupa de latón.',
    compareWithId: 'estudio-bamako-cine',
    linkedTab: 'genealogia-colonial',
    linkedPhaseId: 'reparto-berlin-exposiciones',
    linkedActionLabel: 'Ver estrato 1884–1914',
  },
  {
    id: 'publicidad-colonial-1920',
    section: 'genealogia-colonial',
    sourceCode: 'Fuente CS-06',
    datePeriod: 'c. 1918–1935',
    sourceType: 'Envases litografiados, láminas botánicas y manifiestos navieros',
    figureNum: 'Lám. II.3',
    kicker: 'Estrato 1918–1958 · «Commodity racism» y consumo doméstico imperial',
    title: 'Latas de cacao y aceite de palma, láminas botánicas y tráfico Accra–Liverpool',
    caption:
      'Latas comerciales litografiadas («Gold Coast Cocoa», «Liberian Palm Oil»), manifiestos marítimos de carga y cromolitografías botánicas: la estética imperial integrada en la despensa europea.',
    provenanceNote:
      'Reconstrucción visual didáctica inspirada en la efímera comercial y marítima del comercio colonial de entreguerras (África Occidental – puertos británicos y continentales, c. 1920).',
    analyticalFocus:
      'Ilustra el concepto de «racismo de mercancía» (Anne McClintock, 1995): el imperio dejó de ser solo política exterior para entrar en cocinas y comercios mediante envases, cromos y marcas exóticas.',
    credit: 'Reconstrucción visual didáctica · Bloque IV · 05d (Apartado II)',
    src: resolveAssetUrl('src/assets/images/cs_fuente_publicidad_colonial_1920_1795626055189.jpg'),
    alt: 'Conjunto museográfico sobre travertino con latas antiguas litografiadas de cacao de Costa de Oro y aceite de palma, láminas botánicas de cacao y café, manifiesto naviero de 1920 y caja marcada Accra a Liverpool.',
    compareWithId: 'arquitectura-afrofuturismo',
    linkedTab: 'genealogia-colonial',
    linkedPhaseId: 'cultura-masas-imperial',
    linkedActionLabel: 'Ver estrato 1918–1958',
  },
  {
    id: 'restitucion-bronce-2018',
    section: 'genealogia-colonial',
    sourceCode: 'Fuente CS-07',
    datePeriod: '1897 · Rev. 2018–2025',
    sourceType: 'Investigación de procedencia y conservación de bronces reales',
    figureNum: 'Lám. II.4',
    kicker: 'Estrato 2000–Presente · Del «arte primitivo» a la restitución patrimonial',
    title: 'Mesa de investigación de procedencia: bronces de África Occidental y expedientes',
    caption:
      'Vasija ceremonial y relieve de bronce fundido a la cera perdida junto a fichas catalográficas, calibres y expedientes de procedencia: la revisión crítica de colecciones formadas durante el saqueo colonial.',
    provenanceNote:
      'Reconstrucción visual didáctica de una mesa de investigación de procedencia museográfica contemporánea en el marco del informe Sarr–Savoy (2018) y las restituciones de bronces de Benín.',
    analyticalFocus:
      'Confronta la categoría colonial de «arte primitivo anónimo» con la historia real de las cortes reales africanas y el debate jurídico y ético actual sobre la devolución del patrimonio.',
    credit: 'Reconstrucción visual didáctica · Bloque IV · 05d (Apartado II)',
    src: resolveAssetUrl('src/assets/images/cs_fuente_restitucion_bronce_2018_1795626056907.jpg'),
    alt: 'Mesa de laboratorio de conservación museográfica con una vasija ceremonial y placa en relieve de bronce patinado de África Occidental sobre soportes de espuma neutra, calibres de latón, fichas de inventario y carpetas de procedencia.',
    compareWithId: 'exposicion-colonial-1900',
    linkedTab: 'genealogia-colonial',
    linkedPhaseId: 'algoritmos-restitucion',
    linkedActionLabel: 'Ver estrato 2000–Presente',
  },

  // APARTADO III: ANATOMÍA DE LOS 12 TROPOS (4 fuentes históricas)
  {
    id: 'mapa-continente-oscuro',
    section: 'tropos',
    sourceCode: 'Fuente CS-08',
    datePeriod: 'c. 1875–1899',
    sourceType: 'Cartografía comparada · Terra incognita vs. redes africanas',
    figureNum: 'Lám. III.1',
    kicker: 'Tropos 01 y 02 · «Continente Oscuro» y homogeneización',
    title: 'Del interior en blanco europeo a las rutas históricas del continente',
    caption:
      'Contraste entre la cartografía colonial decimonónica que rotulaba el interior africano como vacío («terra incognita») y las redes caravaneras, marítimas y astronómicas conocidas durante siglos por sus habitantes.',
    provenanceNote:
      'Contrapunto visual entre la tradición cartográfica europea posterior a Stanley (1878) y los saberes geográficos sahelianos e índicos.',
    analyticalFocus:
      'Demuestra que la «oscuridad» del mito de Stanley y Conrad no estaba en África, sino en los límites del archivo europeo del siglo XIX.',
    credit: 'Reconstrucción visual didáctica · Bloque IV · 05d (Apartado III)',
    src: resolveAssetUrl('src/assets/images/cs_continente_oscuro_mapa_1795520994428.jpg'),
    alt: 'Composición histórica que contrasta un mapa en pergamino del siglo XIX con el interior africano en blanco, compás de latón y cuaderno de campo frente a rutas iluminadas y un astrolabio de la cartografía africana medieval.',
    compareWithId: 'prensa-ilustrada-1884',
    linkedTab: 'tropos',
    linkedTropeId: 'continente-oscuro',
    linkedActionLabel: 'Analizar tropo 01',
  },
  {
    id: 'zimbabue-arquitectura',
    section: 'tropos',
    sourceCode: 'Fuente CS-09',
    datePeriod: 'Siglos XI–XV · Doc. 1929',
    sourceType: 'Fotografía arquitectónica monocroma de archivo',
    figureNum: 'Lám. III.2',
    kicker: 'Tropo 03 · «Ciudades perdidas» y mito difusionista',
    title: 'Gran Zimbabue: mampostería shona frente a la ficción de los constructores externos',
    caption:
      'Muros curvos de granito en piedra seca y torre cónica del Gran Zimbabue. La ficción imperial (Haggard) y la administración colonial negaron su origen africano hasta las excavaciones de Caton-Thompson (1929).',
    provenanceNote:
      'Reconstrucción visual didáctica en estética fotográfica monocroma del complejo monumental del Gran Zimbabue (África Austral).',
    analyticalFocus:
      'Prueba material decisiva contra el difusionismo racista que atribuía todo gran monumento africano a fenicios, egipcios o reinas legendarias.',
    credit: 'Reconstrucción visual didáctica · Bloque IV · 05d (Apartado III)',
    src: resolveAssetUrl('src/assets/images/cs_ciudades_perdidas_zimbabue_1795520994608.jpg'),
    alt: 'Fotografía arquitectónica monocroma de los altos muros curvos de granito en piedra seca y la torre cónica del Gran Zimbabue iluminados por luz rasante sobre la meseta.',
    compareWithId: 'novela-aventuras-1890',
    linkedTab: 'tropos',
    linkedTropeId: 'ciudades-perdidas-difusionismo',
    linkedActionLabel: 'Analizar tropo 03',
  },
  {
    id: 'safari-postal-colonial',
    section: 'tropos',
    sourceCode: 'Fuente CS-10',
    datePeriod: 'c. 1910–1935',
    sourceType: 'Litografía turística y colección de postales coloniales',
    figureNum: 'Lám. III.3',
    kicker: 'Tropos 04 y 11 · La sabana atemporal y el «buen salvaje» místico',
    title: 'Postales de viaje, acacias al atardecer y estética del safari colonial',
    caption:
      'Lámina litográfica de sabana deshabitada al ocaso, prismáticos de campaña en cuero, brújula y tarjetas postales sepia: la iconografía turística que congeló África en una naturaleza sin ciudad ni historia.',
    provenanceNote:
      'Reconstrucción visual didáctica inspirada en la efímera turística y postal de época colonial (África Oriental y Austral, décadas de 1910–1930).',
    analyticalFocus:
      'Conecta directamente con la sátira de Binyavanga Wainaina: acacias solitarias y cielos rojos usados como emblema único que borra a 1.400 millones de ciudadanos.',
    credit: 'Reconstrucción visual didáctica · Bloque IV · 05d (Apartado III)',
    src: resolveAssetUrl('src/assets/images/cs_fuente_safari_postal_colonial_1795521357360.jpg'),
    alt: 'Composición de archivo sobre tela de lino con una litografía antigua de acacias al atardecer en la sabana, prismáticos de latón y cuero, brújula y tarjetas postales coloniales amarillentas.',
    compareWithId: 'arquitectura-afrofuturismo',
    linkedTab: 'tropos',
    linkedTropeId: 'eden-sin-humanos-safari',
    linkedActionLabel: 'Analizar tropo 04',
  },
  {
    id: 'exposicion-colonial-1900',
    section: 'tropos',
    sourceCode: 'Fuente CS-11',
    datePeriod: 'c. 1900–1931',
    sourceType: 'Fotografía en papel a la albúmina · Exposiciones Universales',
    figureNum: 'Lám. III.4',
    kicker: 'Tropos 08, 09 y 12 · Exposiciones coloniales, vitrinas y saqueo',
    title: 'Pabellones y vitrinas museográficas de las Exposiciones Universales europeas',
    caption:
      'Vista histórica en albúmina sepia de una gran galería expositiva europea hacia 1900 con vitrinas de madera y cristal: el escenario donde objetos saqueados y pueblos colonizados se exhibieron como curiosidad imperial.',
    provenanceNote:
      'Tipología documental de álbum fotográfico de las Exposiciones Universales y Coloniales (París 1900 / 1931, Bruselas, Londres).',
    analyticalFocus:
      'Base histórica para analizar el espectáculo del cuerpo, la «misión civilizadora», la etiqueta de «arte primitivo» y los debates contemporáneos sobre restitución.',
    credit: 'Reconstrucción visual didáctica · Bloque IV · 05d (Apartado III)',
    src: resolveAssetUrl('src/assets/images/cs_fuente_exposicion_colonial_1900_1795521358176.jpg'),
    alt: 'Fotografía histórica en tonos sepia hacia 1900 del interior de un gran palacio expositivo europeo con bóveda de hierro y cristal, visitantes de época y hileras de vitrinas museográficas.',
    compareWithId: 'restitucion-bronce-2018',
    linkedTab: 'tropos',
    linkedTropeId: 'espectaculo-cuerpo-exposiciones',
    linkedActionLabel: 'Analizar tropo 08',
  },

  // APARTADO IV: LABORATORIO DE LECTURA · STUART HALL (3 fuentes históricas)
  {
    id: 'novela-aventuras-1890',
    section: 'decodificador',
    sourceCode: 'Fuente CS-12',
    datePeriod: 'c. 1885–1915',
    sourceType: 'Novela ilustrada victoriana · Grabado xilográfico',
    figureNum: 'Lám. IV.1',
    kicker: 'Soporte editorial · Ficción imperial y best-seller',
    title: 'Novela de aventuras ilustrada: el explorador ante las «ruinas perdidas»',
    caption:
      'Edición victoriana de cantos dorados abierta por un grabado xilográfico de un explorador con salacot frente a ruinas selváticas: el arquetipo narrativo que inauguró H. Rider Haggard y pervive en la ficción comercial y el cómic.',
    provenanceNote:
      'Tipología de novela colonial ilustrada británica y europea de finales del siglo XIX (tradición de King Solomon’s Mines, 1885).',
    analyticalFocus:
      'Sirve de fuente primaria para aplicar la lectura oposicional de Stuart Hall a sinopsis editoriales, álbumes de aventuras y películas de «templos olvidados».',
    credit: 'Reconstrucción visual didáctica · Bloque IV · 05d (Apartado IV)',
    src: resolveAssetUrl('src/assets/images/cs_fuente_novela_aventuras_1890_1795521358175.jpg'),
    alt: 'Libro antiguo de aventuras de finales del siglo XIX abierto sobre una mesa de madera junto a una lámpara de aceite, mostrando un grabado en blanco y negro de un explorador europeo ante ruinas cubiertas de selva.',
    compareWithId: 'zimbabue-arquitectura',
    linkedTab: 'decodificador',
    linkedArtifactId: 'portada-novela-misterio',
    linkedActionLabel: 'Decodificar sinopsis',
  },
  {
    id: 'prensa-ilustrada-1884',
    section: 'decodificador',
    sourceCode: 'Fuente CS-13',
    datePeriod: '1884–1885',
    sourceType: 'Prensa ilustrada y cartografía diplomática del reparto',
    figureNum: 'Lám. IV.2',
    kicker: 'Soporte hemerográfico · Conferencia de Berlín y prensa internacional',
    title: 'La prensa europea del reparto de África y el trazado de fronteras con regla',
    caption:
      'Mapa grabado de África surcado por líneas rectas en tinta carmesí junto a regla y compás de latón y un periódico ilustrado del Congreso de Berlín (1884–1885): el origen histórico de muchos titulares sobre «conflictos tribales».',
    provenanceNote:
      'Composición documental sobre prensa ilustrada y cartografía geopolítica europea durante el reparto colonial (Scramble for Africa, 1884–1885).',
    analyticalFocus:
      'Permite desmontar la falacia de los «odios ancestrales» en la prensa actual recordando la fabricación colonial moderna de fronteras y censos.',
    credit: 'Reconstrucción visual didáctica · Bloque IV · 05d (Apartado IV)',
    src: resolveAssetUrl('src/assets/images/cs_fuente_prensa_ilustrada_1884_1795521384497.jpg'),
    alt: 'Vista cenital de archivo sobre tapete verde con un mapa grabado de África de 1884 atravesado por líneas rojas, regla y compás de latón, tintero y un periódico ilustrado histórico sobre el Congreso de Berlín.',
    compareWithId: 'manuscritos-tombuctu',
    linkedTab: 'decodificador',
    linkedArtifactId: 'titular-prensa-conflictos',
    linkedActionLabel: 'Decodificar titular',
  },
  {
    id: 'proyector-cine-colonial',
    section: 'decodificador',
    sourceCode: 'Fuente CS-14',
    datePeriod: 'c. 1930–1960',
    sourceType: 'Archivo fílmico en 35 mm · Mesa de montaje y noticiarios',
    figureNum: 'Lám. IV.3',
    kicker: 'Soporte audiovisual · Cine colonial, noticiarios y Hollywood',
    title: 'Latas de 35 mm, celuloide en mesa de luz y montaje de la mirada fílmica',
    caption:
      'Latas metálicas de película de 35 mm, tiras de celuloide examinadas con lupa y guantes de archivo sobre mesa luminosa: recuerda que toda película sobre África es una construcción técnica, seleccionada y montada.',
    provenanceNote:
      'Reconstrucción visual didáctica de archivo fílmico y laboratorio de montaje de mediados del siglo XX, época de auge del cine colonial y los noticiarios europeos.',
    analyticalFocus:
      'Ilustra la fase de «codificación» (Hall): el encuadre, el montaje y la voz en off deciden quién habla como héroe y quién queda reducido a decorado.',
    credit: 'Reconstrucción visual didáctica · Bloque IV · 05d (Apartado IV)',
    src: resolveAssetUrl('src/assets/images/cs_fuente_proyector_cine_colonial_1795521389345.jpg'),
    alt: 'Mesa de archivo fílmico de mediados del siglo XX con pilas de latas metálicas de película de 35 mm, tiras de celuloide sobre una mesa luminosa, empalmadora mecánica y un archivista con guantes blancos sosteniendo una lupa.',
    compareWithId: 'estudio-bamako-cine',
    linkedTab: 'decodificador',
    linkedArtifactId: 'guion-cine-hollywood',
    linkedActionLabel: 'Decodificar guion',
  },

  // APARTADO V: CONTRA-NARRATIVAS Y CREACIÓN AFRICANA (3 fuentes históricas)
  {
    id: 'manuscritos-tombuctu',
    section: 'contranarrativas',
    sourceCode: 'Fuente CS-15',
    datePeriod: 'Siglos XV–XVII · Ed. 1958–1986',
    sourceType: 'Manuscrito saheliano y primeras ediciones literarias africanas',
    figureNum: 'Lám. V.1',
    kicker: 'Contra-archivo escrito · De Tombuctú a Achebe y Ngũgĩ',
    title: 'Manuscritos astronómicos del Sahel y biblioteca literaria africana moderna',
    caption:
      'Carpeta de cuero repujado con folios de tradición manuscrita de Tombuctú (diagramas astronómicos y tablas) junto a ediciones en tela de literatura africana moderna: continuidad intelectual frente al mito del «continente ágrafo».',
    provenanceNote:
      'Diálogo visual entre los fondos manuscritos históricos de África Occidental y el renacimiento editorial africano de la segunda mitad del siglo XX.',
    analyticalFocus:
      'Refuta de raíz la tesis colonial de un continente sin escritura ni pensamiento teórico y enmarca la respuesta literaria de Achebe, Mariama Bâ y Ngũgĩ.',
    credit: 'Reconstrucción visual didáctica · Bloque IV · 05d (Apartado V)',
    src: resolveAssetUrl('src/assets/images/cs_fuente_manuscritos_tombuctu_prensa_1795521389920.jpg'),
    alt: 'Mesa iluminada por luz natural con un manuscrito saheliano encuadernado en cuero geométrico abierto por diagramas astronómicos junto a una caja de archivo de madera y volúmenes de poesía y literatura africana.',
    compareWithId: 'biblioteca-colonial',
    linkedTab: 'contranarrativas',
    linkedDomainId: 'literatura-respuesta',
    linkedActionLabel: 'Ver literatura africana',
  },
  {
    id: 'estudio-bamako-cine',
    section: 'contranarrativas',
    sourceCode: 'Fuente CS-16',
    datePeriod: '1948–1975',
    sourceType: 'Fotografía de estudio urbano y cine independiente (FESPACO)',
    figureNum: 'Lám. V.2',
    kicker: 'Contra-archivo visual · Bamako, Dakar y Uagadugú',
    title: 'Estudio fotográfico de Bamako, bobinas de 35 mm y soberanía de la mirada',
    caption:
      'Telón textil índigo geométrico, cámara de formato medio sobre trípode de madera, latas de 35 mm y libros en un estudio de África Occidental de los años sesenta: el nacimiento de la autorrepresentación moderna.',
    provenanceNote:
      'Homenaje documental a la generación de las independencias: Seydou Keïta, Malick Sidibé, Ousmane Sembène, Safi Faye y el festival FESPACO (1969).',
    analyticalFocus:
      'Invierte por completo el régimen escópico de la Lám. I.2 y las postales de la Lám. II.2: aquí la ciudadanía africana controla la pose, el encuadre, la lengua y la pantalla.',
    credit: 'Reconstrucción visual didáctica · Bloque IV · 05d (Apartado V)',
    src: resolveAssetUrl('src/assets/images/cs_contranarrativas_bamako_cine_1795520995818.jpg'),
    alt: 'Estudio luminoso de fotografía y cine de África Occidental de los años sesenta con telón de tela índigo estampada, cámara de formato medio sobre trípode de madera, latas de película de 35 mm y libros de literatura africana.',
    compareWithId: 'postales-africa-1905',
    linkedTab: 'contranarrativas',
    linkedDomainId: 'fotografia-estudio-africana',
    linkedActionLabel: 'Ver cine y fotografía',
  },
  {
    id: 'arquitectura-afrofuturismo',
    section: 'contranarrativas',
    sourceCode: 'Fuente CS-17',
    datePeriod: 'Siglo XXI · Dakar, Lagos, Nairobi',
    sourceType: 'Maqueta arquitectónica y diseño especulativo africano',
    figureNum: 'Lám. V.3',
    kicker: 'Futuros africanos · Afrofuturismo y Africanfuturism',
    title: 'Estudio contemporáneo de arquitectura en tierra, celosías solares y diseño',
    caption:
      'Maqueta en tierra y madera que fusiona geometrías sahelianas con celosías solares contemporáneas sobre planos de sección y muestras de arcilla: África pensada como laboratorio del futuro y no como reliquia del pasado.',
    provenanceNote:
      'Referencia contemporánea de estudios de arquitectura sostenible, diseño y africanfuturismo en grandes capitales africanas del siglo XXI.',
    analyticalFocus:
      'Rompe la «negación de la coetaneidad» (Johannes Fabian) y dialoga con la obra de Nnedi Okorafor, Wanuri Kahiu y la arquitectura de Francis Kéré.',
    credit: 'Reconstrucción visual didáctica · Bloque IV · 05d (Apartado V)',
    src: resolveAssetUrl('src/assets/images/cs_fuente_arquitectura_afrofuturismo_1795521389160.jpg'),
    alt: 'Estudio contemporáneo de arquitectura africano iluminado por el sol con una maqueta de tierra y madera de formas orgánicas y cubierta solar geométrica sobre planos técnicos, compás de latón y muestras de arcilla.',
    compareWithId: 'safari-postal-colonial',
    linkedTab: 'contranarrativas',
    linkedDomainId: 'afrofuturismo-africanfuturismo',
    linkedActionLabel: 'Ver africanfuturismo',
  },
];

export const CULTURAL_STUDIES_THEORISTS: CulturalTheoristEntry[] = [
  {
    id: 'stuart-hall',
    author: 'Stuart Hall',
    yearsAndOrigin: '1932–2014 · Kingston (Jamaica) / Birmingham (CCCS)',
    keyConcept: 'Régimen de representación, estereotipación y codificación/decodificación',
    landmarkWork:
      'Encoding and Decoding in the Television Discourse (1973); Representation: Cultural Representations and Signifying Practices (1997)',
    visualPlateId: 'archivo-colonial',
    thesis:
      'La representación no refleja pasivamente una realidad previa: produce significados mediante códigos culturales ligados al poder. La estereotipación reduce a las personas a unos pocos rasgos esenciales, fija la diferencia y traza una frontera simbólica entre «nosotros» y el «Otro».',
    mysteryAfricaCritique:
      'En «The Spectacle of the Other», Hall demuestra cómo la publicidad imperial, el cine y la fotografía popular del siglo XIX y XX construyeron una «esencia» africana asociada a lo enigmático, lo instintivo o lo infantil para naturalizar jerarquías coloniales.',
    analyticalQuestion:
      '¿Qué código dominante intenta fijar esta imagen sobre África y qué lecturas oposicionales permiten desactivarlo?',
  },
  {
    id: 'mudimbe',
    author: 'Valentin-Yves Mudimbe',
    yearsAndOrigin: '1941–2025 · Likasi (R. D. Congo)',
    keyConcept: 'La «biblioteca colonial» y la invención epistemológica de África',
    landmarkWork: 'The Invention of Africa: Gnosis, Philosophy, and the Order of Knowledge (1988)',
    visualPlateId: 'biblioteca-colonial',
    thesis:
      'África fue construida en el discurso europeo moderno a través de una «biblioteca colonial» formada por relatos de exploradores, misioneros, etnógrafos y administradores que definieron qué podía decirse o pensarse sobre el continente.',
    mysteryAfricaCritique:
      'El «África misteriosa» no nace de la falta de historia africana, sino de un archivo occidental que clasificó sistemáticamente las sociedades africanas como prehistóricas, silenciosas o necesitadas de desciframiento externo.',
    analyticalQuestion:
      '¿Desde qué archivo («biblioteca») estamos hablando de África: desde categorías coloniales heredadas o desde epistemologías africanas?',
  },
  {
    id: 'edward-said',
    author: 'Edward W. Said',
    yearsAndOrigin: '1935–2003 · Jerusalén / Universidad de Columbia',
    keyConcept: 'Geografías imaginadas y vínculo entre cultura e imperialismo',
    landmarkWork: 'Orientalism (1978); Culture and Imperialism (1993)',
    visualPlateId: 'biblioteca-colonial',
    thesis:
      'Los imperios no se sostienen solo con ejércitos y comercio, sino con narrativas, novelas, mapas y exposiciones que hacen pensable, deseable y «natural» el dominio sobre territorios lejanos.',
    mysteryAfricaCritique:
      'La geografía imaginada del «África misteriosa» (especialmente visible en el norte de África y el África subsahariana en la novela de aventuras del siglo XIX) convierte paisajes habitados en escenarios vacíos para la épica del viajero europeo.',
    analyticalQuestion:
      '¿Qué papel cumple la literatura de viajes, la novela o el cine de aventuras en la legitimación de la intervención exterior?',
  },
  {
    id: 'adichie',
    author: 'Chimamanda Ngozi Adichie',
    yearsAndOrigin: '1977 · Enugu (Nigeria)',
    keyConcept: 'El peligro de la historia única (The Danger of a Single Story)',
    landmarkWork: 'The Danger of a Single Story (conferencia, 2009); Americanah (2013)',
    visualPlateId: 'birmingham-prensa',
    thesis:
      'Mostrar a un pueblo una y otra vez como una sola cosa termina convirtiéndolo en esa única cosa ante la mirada ajena. El problema de los estereotipos no es solo que sean falsos, sino que son incompletos: hacen de una sola historia la única historia.',
    mysteryAfricaCritique:
      'El relato único de África como tierra de catástrofe, misterio ininteligible o exotismo intemporal borra la vida cotidiana, la ciencia, la clase media urbana, la historia precolonial y la enorme diversidad entre 54 Estados.',
    analyticalQuestion:
      '¿Qué historias cotidianas, científicas o políticas quedan fuera de cuadro cuando repetimos un único relato sobre el continente?',
  },
  {
    id: 'wainaina',
    author: 'Binyavanga Wainaina',
    yearsAndOrigin: '1971–2019 · Nakuru (Kenia)',
    keyConcept: 'Anatomía satírica del cliché mediático sobre África',
    landmarkWork: 'How to Write About Africa (Granta 92, 2005)',
    visualPlateId: 'birmingham-prensa',
    thesis:
      'Mediante una sátira feroz convertida en clásico de los Estudios Culturales africanos, Wainaina expone las recetas repetitivas con las que la prensa, los best-sellers y el cine occidental describen el continente.',
    mysteryAfricaCritique:
      'Enumera con precisión quirúrgica los tics del «África misteriosa»: usar palabras como «oscuridad», «primordial», «tribal» o «atemporal»; poner atardeceres y acacias en portada; tratar África como un país; y situar siempre a un extranjero sensible en el centro de la trama.',
    analyticalQuestion:
      '¿Cuántos de los clichés denunciados por Wainaina siguen activos en titulares, documentales televisivos o catálogos turísticos actuales?',
  },
  {
    id: 'mbembe-ngugi',
    author: 'Achille Mbembe y Ngũgĩ wa Thiong’o',
    yearsAndOrigin: 'Camerún (1957) · Kenia (1938–2025)',
    keyConcept: 'Crítica de la poscolonia y descolonización de la mente',
    landmarkWork:
      'Decolonising the Mind (Ngũgĩ, 1986); On the Postcolony (Mbembe, 2001); Critique of Black Reason (Mbembe, 2017)',
    visualPlateId: 'manuscritos-tombuctu',
    thesis:
      'El colonialismo actuó sobre la lengua, la memoria y la imaginación; por ello la emancipación cultural exige devolver el centro de enunciación a las lenguas, archivos y filosofías africanas, reconociendo a África como sujeto histórico pleno.',
    mysteryAfricaCritique:
      'Mbembe subraya que Occidente suele hablar de África en clave de «falta» o «enigma» (lo que supuestamente no tiene), impidiendo pensar la contemporaneidad africana como laboratorio político, tecnológico y cultural del mundo actual.',
    analyticalQuestion:
      '¿Describimos las sociedades africanas desde sus propias categorías y agencia histórica o desde lo que supuestamente «les falta» frente a Europa?',
  },
];

export const COLONIAL_GENEALOGY_PHASES: ColonialGenealogyPhase[] = [
  {
    id: 'trata-exclusion-historia',
    num: '01',
    period: 'c. 1490–1780',
    title: 'De la admiración diplomática a la invención racial y la exclusión de la Historia',
    apparatus: 'Trata atlántica, códigos esclavistas y filosofía ilustrada europea',
    visualPlateId: 'biblioteca-colonial',
    archiveQuote:
      '«África propiamente dicha [...] no es una parte histórica del mundo; no muestra movimiento ni desarrollo alguno.»',
    archiveSource: 'G. W. F. Hegel, Lecciones sobre la filosofía de la historia universal (c. 1830), culminación de tres siglos de desplazamiento discursivo.',
    summary:
      'En los primeros contactos del siglo XV y XVI (embajadas entre el Reino del Kongo, Portugal y Roma; crónicas sobre la riqueza de Benín y el oro de Malí en el Atlas Catalán), los europeos reconocieron soberanías y cortes africanas. Sin embargo, al expandirse la trata atlántica de personas esclavizadas, el pensamiento europeo necesitó degradar simbólicamente a África para legitimar la esclavitud masiva, expulsándola de la «Historia universal».',
    stereotypesForged: [
      'Jerarquías raciales pseudonaturales y «maldición de Cam»',
      'Asociación de África con «estado de naturaleza» sin ley ni Estado',
      'Desplazamiento del estigma del canibalismo desde América hacia el interior africano',
    ],
    materialInterests:
      'Economía de plantación atlántica (azúcar, algodón, tabaco) y trata triangular de más de 12,5 millones de personas africanas deportadas.',
    historicalRefutation:
      'Durante esos mismos siglos florecieron los manuscritos de Tombuctú y Gao, la diplomacia escrita del rey Afonso I del Kongo (1526), la metalurgia cortesana de Benín y las ciudades-Estado suajilis del Índico (Bloque III · 03 y 04).',
    linkedTropeIds: ['continente-oscuro', 'africa-como-pais'],
    glossaryTermId: 'alocronismo',
    glossaryTermLabel: 'Alocronismo (negación de la coetaneidad)',
  },
  {
    id: 'sociedades-geograficas',
    num: '02',
    period: '1788–1878',
    title: 'Sociedades geográficas, exploradores y el mito del «Continente Oscuro»',
    apparatus: 'African Association (1788), Royal Geographical Society, relatos de viaje y mapas con vacíos',
    visualPlateId: 'tratado-geografia-1850',
    archiveQuote:
      '«Through the Dark Continent» — título de Henry Morton Stanley (1878) que consagró la metáfora de la oscuridad como sinónimo de África.',
    archiveSource: 'H. M. Stanley (1878) y boletines de las sociedades geográficas de Londres y París.',
    summary:
      'La creación de la African Association (1788) inauguró la era de los exploradores (Mungo Park, Burton, Speke, Livingstone, Stanley). Sus mapas eliminaron los topónimos locales y dejaron grandes espacios blancos («terra incognita» / «régions inexplorées»), presentando el «descubrimiento» de lagos, ríos y cascadas —que millones de africanos navegaban y nombraban desde milenios— como hazañas heroicas de hombres blancos solitarios.',
    stereotypesForged: [
      '«Continente Oscuro» y «tierra ignota» esperando ser descifrada',
      'El explorador europeo como descubridor de paisajes «vírgenes»',
      'Borrado de guías, intérpretes y soberanos africanos (como Sidi Mubarak Bombay) que hicieron posibles las expediciones',
    ],
    materialInterests:
      'Cartografía de cuencas fluviales (Níger, Nilo, Congo, Zambeze) para abrir rutas comerciales interiores hacia el marfil, el caucho, el aceite de palma y los minerales.',
    historicalRefutation:
      'Ningún gran río ni lago africano fue «descubierto» en el siglo XIX: eran arterias de Estados, mercados y rutas caravaneras e índicas documentadas en crónicas árabes, orales y arqueológicas siglos antes.',
    linkedTropeIds: ['continente-oscuro', 'ciudades-perdidas-difusionismo'],
    glossaryTermId: 'biblioteca-colonial',
    glossaryTermLabel: 'Biblioteca colonial (V.-Y. Mudimbe)',
  },
  {
    id: 'reparto-berlin-exposiciones',
    num: '03',
    period: '1884–1914',
    title: 'Conferencia de Berlín, ciencia racial, novela imperial y Exposiciones Coloniales',
    apparatus: 'Reparto colonial (Scramble for Africa), novela victoriana, postales sepia y «zoos humains»',
    visualPlateId: 'postales-africa-1905',
    archiveQuote:
      '«Asumid la carga del Hombre Blanco [...] vuestros nuevos pueblos cautivos y ariscos, mitad demonio y mitad niño.»',
    archiveSource: 'Rudyard Kipling, The White Man’s Burden (1899), manifiesto poético del paternalismo imperial.',
    summary:
      'Tras la Conferencia de Berlín (1884–1885), las potencias europeas ocuparon más del 90 % del continente en apenas dos décadas. Para justificar el dominio militar, el trabajo forzado (como el terror del caucho en el Congo de Leopoldo II) y el saqueo patrimonial (Benín, 1897), se desplegó una maquinaria cultural sin precedentes: novelas de ciudades perdidas (Haggard, 1885), *Heart of Darkness* (Conrad, 1899), tarjetas postales coloniales, craneometría racial y pabellones humanos en las Exposiciones Universales.',
    stereotypesForged: [
      '«Misión civilizadora» y paternalismo de la «carga del hombre blanco»',
      '«Ciudades perdidas» atribuidas a fenicios o reinas blancas (negación del Gran Zimbabue)',
      'Espectáculo del cuerpo colonizado en «aldeas negras» y postales exóticas',
      'Clasificación administrativa rígida en «tribus» (divide et impera)',
    ],
    materialInterests:
      'Extracción intensiva de caucho, oro, diamantes, cobre y cacao; trazado de fronteras coloniales y monopolio militar europeo.',
    historicalRefutation:
      'La resistencia armada y diplomática africana (victoria etíope de Adua en 1896, reino asante, Samori Touré, levantamiento Maji-Maji) y la arqueología de Caton-Thompson (1929) desmienten la imagen de pasividad o inferioridad técnica.',
    linkedTropeIds: [
      'ciudades-perdidas-difusionismo',
      'tribalismo-conflictos-ancestrales',
      'espectaculo-cuerpo-exposiciones',
      'mision-civilizadora-carga',
    ],
    glossaryTermId: 'mision-civilizadora',
    glossaryTermLabel: 'Misión civilizadora y paternalismo colonial',
  },
  {
    id: 'cultura-masas-imperial',
    num: '04',
    period: '1918–1958',
    title: 'Cultura de masas imperial: publicidad doméstica, Tarzán, cómic y cine colonial',
    apparatus: 'Marcas comerciales, cromos escolares, cómic juvenil, Hollywood y noticiarios en 35 mm',
    visualPlateId: 'publicidad-colonial-1920',
    archiveQuote:
      '«El imperio entra en la mesa del desayuno: el jabón, el cacao y el café convierten la jerarquía racial en mercancía cotidiana.»',
    archiveSource: 'Síntesis crítica de Anne McClintock, Imperial Leather (1995), y Stuart Hall (1997).',
    summary:
      'En el periodo de entreguerras el estereotipo colonial dejó de ser exclusivo de élites académicas y se masificó para niños y familias europeas y estadounidenses. Películas de *Tarzán* (desde 1932), álbumes como *Tintín en el Congo* (1930–31), campañas publicitarias de cacao, café y jabón (*Banania*, *Pears*), cromos de chocolate y la Exposición Colonial de París (1931, 8 millones de visitantes) fijaron en el inconsciente colectivo la figura del africano infantil, supersticioso o servicial frente al héroe blanco ingenioso.',
    stereotypesForged: [
      '«Racismo de mercancía» (commodity racism) en envases y publicidad de cacao, café y jabón',
      'Arquetipo del héroe blanco en la selva (Tarzán) que domina la naturaleza mejor que los nativos',
      'Infantilización lingüística («petit-nègre») y caricatura cómica en historietas y anuncios',
      'Parques nacionales coloniales concebidos como «Edén salvaje» tras expulsar a comunidades locales',
    ],
    materialInterests:
      'Consolidación de mercados metropolitanos para productos coloniales, consenso social proimperial en Europa y legitimación de la administración colonial tardía.',
    historicalRefutation:
      'Es exactamente el periodo en que surgen la Négritude (Césaire, Senghor, Damas), los movimientos sindicales y anticoloniales africanos y los estudios fotográficos urbanos de Bamako (Seydou Keïta, desde 1948).',
    linkedTropeIds: [
      'eden-sin-humanos-safari',
      'salvador-blanco-afropesimismo',
      'publicidad-exotismo-mercancia',
      'buen-salvaje-mistico',
    ],
    glossaryTermId: 'racismo-de-mercancia',
    glossaryTermLabel: 'Racismo de mercancía (Commodity racism)',
  },
  {
    id: 'poscolonia-mediatica',
    num: '05',
    period: '1960–1999',
    title: 'Poscolonia mediática: afropesimismo, «odios tribales» y salvador blanco televisivo',
    apparatus: 'Telediarios internacionales, campañas humanitarias de choque y turismo de safari de lujo',
    visualPlateId: 'prensa-ilustrada-1884',
    archiveQuote:
      '«El peligro de la historia única: mostrar a un pueblo una y otra vez como una sola cosa —catástrofe o exotismo— acaba convirtiéndolo en esa única cosa.»',
    archiveSource: 'Chimamanda Ngozi Adichie (2009) y Binyavanga Wainaina (2005) sobre la prensa internacional poscolonial.',
    summary:
      'Aunque la mayoría de países africanos alcanzaron la independencia entre 1957 y 1975, el régimen de representación occidental no se descolonizó al mismo ritmo. Desde la guerra de Biafra (1968) y la hambruna etíope (1984) hasta Ruanda (1994), la televisión global sustituyó el discurso imperial explícito por un afropesimismo compasivo: imágenes descontextualizadas de sufrimiento infantil, explicación de guerras de la Guerra Fría como «odios tribales ancestrales» y auge paralelo del safari de lujo como refugio atemporal.',
    stereotypesForged: [
      '«Pornografía de la pobreza» y figura del niño anónimo necesitado de rescate externo',
      'Complejo industrial del «salvador blanco» (White Savior) en cine y publicidad solidaria',
      'Reducción de crisis geopolíticas y extractivas a «guerras tribales milenarias»',
      'Bifurcación estética: África como catástrofe en las noticias o como paraíso vacío en las agencias de viajes',
    ],
    materialInterests:
      'Asimetrías en las agencias globales de noticias, injerencias de la Guerra Fría, programas de ajuste estructural y economía global del turismo exótico.',
    historicalRefutation:
      'Desde los años sesenta África construye su propio canon crítico: Ousmane Sembène, FESPACO (1969), Chinua Achebe, Mariama Bâ, la *Historia General de África* de la UNESCO y las escuelas historiográficas de Ibadán y Dakar.',
    linkedTropeIds: [
      'salvador-blanco-afropesimismo',
      'tribalismo-conflictos-ancestrales',
      'magia-brujeria-irracionalidad',
    ],
    glossaryTermId: 'alegoria-maniquea',
    glossaryTermLabel: 'Alegoría maniquea y binarismo colonial',
  },
  {
    id: 'algoritmos-restitucion',
    num: '06',
    period: '2000–Presente',
    title: 'Neoxotismo digital, sesgos algorítmicos y batalla por la restitución patrimonial',
    apparatus: 'Bancos de imágenes, redes sociales, IA generativa, museos globales y contra-archivos africanos',
    visualPlateId: 'restitucion-bronce-2018',
    archiveQuote:
      '«Restituir no es vaciar los museos europeos, sino reequilibrar la geografía mundial de la memoria y cerrar la violencia epistemológica colonial.»',
    archiveSource: 'Espíritu del informe de Felwine Sarr y Bénédicte Savoy (2018) sobre la restitución del patrimonio cultural africano.',
    summary:
      'En el siglo XXI los viejos clichés sobreviven reciclados en forma de filtros cinematográficos ocres, volunturismo en redes sociales y modelos de inteligencia artificial entrenados con archivos sesgados que, ante la palabra «África», siguen devolviendo sabanas, barro y pobreza en vez de universidades, metros o laboratorios. Sin embargo, hoy existe una respuesta vigorosa: campañas como #NoWhiteSaviors, el informe Sarr–Savoy (2018), la devolución de bronces de Benín, Nollywood, el cine de Mati Diop y el *africanfuturism*.',
    stereotypesForged: [
      'Reciclaje algorítmico de la «biblioteca colonial» en buscadores e IA generativa',
      '«Volunturismo» fotogénico en redes sociales que reproduce la narrativa del rescate',
      'Resistencia institucional a la restitución bajo el argumento paternalista de «conservación universal»',
    ],
    materialInterests:
      'Economía de plataformas digitales, industria turística global, cadenas extractivas de minerales tecnológicos (cobalto, coltán) y prestigio museográfico.',
    historicalRefutation:
      'Ecosistemas tecnológicos africanos (M-Pesa, Nairobi, Lagos, Kigali), restituciones efectivas a Benín y Nigeria, arquitectura de Francis Kéré (Premio Pritzker 2022) y soberanía narrativa africana contemporánea.',
    linkedTropeIds: ['arte-primitivo-saqueo-museos', 'africa-como-pais', 'buen-salvaje-mistico'],
    glossaryTermId: 'regimen-representacion',
    glossaryTermLabel: 'Régimen de representación (Stuart Hall)',
  },
];

export const COLONIAL_BINARY_PAIRS: ColonialBinaryPair[] = [
  {
    id: 'bin-historia-naturaleza',
    axis: 'temporal',
    axisLabel: 'Eje temporal',
    europePole: 'Historia, progreso y modernidad',
    africaStereotypePole: 'Naturaleza, atemporalidad y «origen del mundo»',
    colonialFunction:
      'Aplica el «alocronismo» (Johannes Fabian): desplaza a poblaciones africanas contemporáneas a un pasado prehistórico para legitimar su tutela.',
    exampleInMedia:
      'Folletos de safari («viaja al alba de la humanidad») y documentales que ocultan ciudades, carreteras o teléfonos móviles del encuadre.',
    criticalReframing:
      'Reconocer la plena coetaneidad de las sociedades africanas, con historia precolonial dinámica y modernidades urbanas contemporáneas.',
  },
  {
    id: 'bin-nacion-tribu',
    axis: 'politico',
    axisLabel: 'Eje político',
    europePole: 'Naciones, Estados y partidos políticos',
    africaStereotypePole: '«Tribus», clanes y «odios ancestrales»',
    colonialFunction:
      'Despolitiza conflictos modernos y convierte a sociedades de millones de personas (yoruba, igbo, zulú, kikuyu, hausa) en entidades supuestamente arcaicas.',
    exampleInMedia:
      'Titulares que llaman «violencia tribal» a disputas electorales o extractivas en África, mientras usan «nacionalismo» o «tensiones regionales» en Europa.',
    criticalReframing:
      'Utilizar vocabulario político preciso: Estados, partidos, comunidades lingüísticas, actores económicos y procesos históricos fechables.',
  },
  {
    id: 'bin-ciencia-magia',
    axis: 'epistemico',
    axisLabel: 'Eje epistémico',
    europePole: 'Ciencia, razón y medicina',
    africaStereotypePole: '«Magia», brujería, «vudú» y superstición',
    colonialFunction:
      'Descalifica farmacopeas, saberes ecológicos, sistemas jurídicos y cosmologías africanas como irracionalidad o amenaza tenebrosa.',
    exampleInMedia:
      'Cine de aventuras y prensa sensacionalista que emplea «hechicero» o «vudú» como sinónimo de atraso o maldición exótica.',
    criticalReframing:
      'Estudiar cosmologías (Ifá, akan, azande) y saberes técnicos (siderurgia, astronomía de Tombuctú, etnobotánica) desde sus propias categorías epistémicas.',
  },
  {
    id: 'bin-arte-fetiche',
    axis: 'estetico',
    axisLabel: 'Eje estético',
    europePole: 'Bellas Artes con autor, fecha y estilo',
    africaStereotypePole: '«Arte primitivo», «fetiche» o artesanía anónima',
    colonialFunction:
      'Arranca esculturas, bronces y textiles de sus talleres, cortes y nombres de artistas para exhibirlos como expresión instintiva y atemporal.',
    exampleInMedia:
      'Cartelas museográficas históricas que solo indican «Máscara · África · Siglo XIX» frente a fichas detalladas para obras europeas contemporáneas.',
    criticalReframing:
      'Documentar talleres reales (como los gremios de fundidores Igun Eronmwon de Benín), biografías de creadores y debates de procedencia y restitución.',
  },
  {
    id: 'bin-explorador-nativo',
    axis: 'epistemico',
    axisLabel: 'Eje epistémico',
    europePole: 'Explorador, descubridor y sujeto con nombre',
    africaStereotypePole: '«Nativo», porteador anónimo o decorado silencioso',
    colonialFunction:
      'Monopoliza la capacidad de nombrar, cartografiar y narrar («el lago Victoria», «las cataratas Victoria»), borrando la agencia intelectual local.',
    exampleInMedia:
      'Manuales y documentales que aún dicen «Livingstone descubrió las cataratas» en lugar de «fue el primer europeo en visitar Mosi-oa-Tunya».',
    criticalReframing:
      'Recuperar toponimia africana (Mosi-oa-Tunya, Nyanza), guías históricos y fuentes locales orales y escritas.',
  },
  {
    id: 'bin-cultura-instinto',
    axis: 'estetico',
    axisLabel: 'Eje estético',
    europePole: 'Intelecto, contención y palabra escrita',
    africaStereotypePole: 'Cuerpo, ritmo «en la sangre» e instinto',
    colonialFunction:
      'Opera mediante la ambivalencia del estereotipo (Stuart Hall): incluso el «halago» esencialista encierra a las personas africanas en lo corporal y niega su trabajo técnico.',
    exampleInMedia:
      'Crónicas deportivas o musicales que atribuyen virtuosismo africano a «genética natural» en lugar de disciplina, escuelas musicales y entrenamiento.',
    criticalReframing:
      'Analizar la música, la danza, el deporte y las artes visuales africanas como disciplinas intelectuales y técnicas con escuelas e historia propias.',
  },
  {
    id: 'bin-salvador-victima',
    axis: 'politico',
    axisLabel: 'Eje político',
    europePole: 'Donante racional, cooperante y «salvador»',
    africaStereotypePole: 'Víctima pasiva, continente infantilizado',
    colonialFunction:
      'Sustituye relaciones de justicia económica y corresponsabilidad política por una jerarquía moral basada en la caridad unilateral.',
    exampleInMedia:
      'Campañas con retratos de menores anónimos bajo el lema «Solo tú puedes salvar su futuro» sin mencionar contrapartes ni causas estructurales.',
    criticalReframing:
      'Comunicación basada en derechos: visibilizar liderazgos africanos, instituciones locales y relaciones económicas globales.',
  },
  {
    id: 'bin-plural-singular',
    axis: 'temporal',
    axisLabel: 'Eje temporal',
    europePole: 'Diversidad de países, lenguas y épocas',
    africaStereotypePole: '«África» en singular como bloque homogéneo',
    colonialFunction:
      'Borra las fronteras entre 54 Estados, más de 2.000 lenguas y biomas contrastados para fabricar un mito único fácil de consumir.',
    exampleInMedia:
      'Titulares como «Brote en África», «Moda africana» o anuncios que mezclan fauna keniana con arquitectura marroquí.',
    criticalReframing:
      'Nombrar siempre el país, la ciudad, la lengua y el contexto histórico específico de cada fenómeno analizado.',
  },
];

export const MYSTERIOUS_AFRICA_TROPES: MysteriousAfricaTrope[] = [
  {
    id: 'continente-oscuro',
    num: '01',
    title: 'El «Continente Oscuro» y el «Corazón de las Tinieblas»',
    medium: 'literatura-prensa',
    mediumLabel: 'Literatura y prensa',
    visualPlateId: 'mapa-continente-oscuro',
    clicheSignature: '«En el corazón impenetrable y oscuro del continente…»',
    persistenceArc: '1878 (Stanley) → Prensa y ficción actual',
    historicalOrigin:
      'Popularizado por Henry Morton Stanley (Through the Dark Continent, 1878) y condensado literariamente en Heart of Darkness de Joseph Conrad (1899).',
    culturalMechanism:
      'Confunde el desconocimiento europeo del interior africano en el siglo XIX con una supuesta «oscuridad» moral, histórica o cognitiva inherente al propio continente.',
    examples:
      'Mapas con interiores en blanco rotulados como terra incognita; titulares contemporáneos que aún recurren a metáforas de «tinieblas», «abismo» o «tierra ignota» al cubrir África Central.',
    whatItErases:
      'Siglos de cartografía islámica, redes caravaneras, Estados del Congo, Kuba, Luba, Buganda y rutas comerciales interiores perfectamente conocidas por sus habitantes.',
    counterEvidence:
      'En su célebre ensayo «An Image of Africa» (1977), Chinua Achebe desmonta cómo Conrad convierte el río Congo en mero telón metafísico para la crisis psicológica europea, privando de lenguaje e historia a los africanos.',
    linkedArtifactId: 'portada-novela-misterio',
    tags: ['Continente oscuro', 'Stanley', 'Conrad', 'Achebe', 'cartografía'],
  },
  {
    id: 'africa-como-pais',
    num: '02',
    title: 'África como «un solo país» homogéneo y ahistórico',
    medium: 'literatura-prensa',
    mediumLabel: 'Literatura y prensa',
    visualPlateId: 'mapa-continente-oscuro',
    clicheSignature: '«Viajar a África», «la cultura africana», «el idioma africano»',
    persistenceArc: 'Siglo XVIII → Medios y cultura cotidiana',
    historicalOrigin:
      'Herencia de la clasificación racial y geográfica colonial que subsumía decenas de sociedades diversas bajo una etiqueta continental indiferenciada.',
    culturalMechanism:
      'Generaliza una noticia local (una sequía en una región concreta o un golpe de Estado) al conjunto de 30,3 millones de km², mientras que en Europa nadie confunde un suceso en Grecia con Noruega.',
    examples:
      'Expresiones cotidianas como «viajar a África», «la cultura africana» en singular, «el idioma africano» o campañas publicitarias que mezclan fauna del Serengeti con estética amazigh o zulú.',
    whatItErases:
      '54 Estados soberanos, más de 2.000 lenguas vivas, biomas que van del Mediterráneo al Cabo y realidades urbanas radicalmente distintas entre Dakar, Kigali, Johannesburgo, El Cairo o Adís Abeba.',
    counterEvidence:
      'El propio mapa histórico del Bloque III (Kush, Aksum, Suajili, Malí, Gran Zimbabue y Benín) demuestra la pluralidad política, religiosa y lingüística del continente durante milenios.',
    linkedArtifactId: 'titular-prensa-conflictos',
    tags: ['Homogeneización', '54 Estados', 'historia única', 'lenguas'],
  },
  {
    id: 'ciudades-perdidas-difusionismo',
    num: '03',
    title: 'Ciudades perdidas, tesoros ocultos y difusionismo externo',
    medium: 'cine-comic',
    mediumLabel: 'Cine y cómic',
    visualPlateId: 'zimbabue-arquitectura',
    clicheSignature: '«Ruinas imposibles levantadas por una civilización olvidada…»',
    persistenceArc: '1885 (Haggard) → Cine de aventuras y pseudohistoria',
    historicalOrigin:
      'Novela imperial británica del siglo XIX —especialmente King Solomon’s Mines (1885) y She (1887) de H. Rider Haggard— ligada a la expansión de Cecil Rhodes en África Austral.',
    culturalMechanism:
      'Ante monumentos africanos imponentes que contradicen el prejuicio racista, la ficción colonial inventa «reinas blancas perdidas», fenicios, egipcios o constructores misteriosos para negar la autoría africana.',
    examples:
      'Atribución colonial del Gran Zimbabue a la reina de Saba o a navegantes fenicios; relatos pulp, aventuras de cómic clásico y películas de «templos perdidos en la jungla».',
    whatItErases:
      'La ingeniería autóctona shona del Gran Zimbabue, la metalurgia de bronce de Ife y Benín, y los complejos arquitectónicos de piedra seca documentados por Gertrude Caton-Thompson (1929) y la arqueología africana.',
    counterEvidence:
      'Las excavaciones estratigráficas verificadas (Bloque III · Módulo 03) probaron hace casi un siglo el origen estrictamente africano y shona del Gran Zimbabue y de la escultura de Ife y Benín.',
    linkedArtifactId: 'portada-novela-misterio',
    tags: ['Haggard', 'Gran Zimbabue', 'difusionismo', 'ciudades perdidas', 'cómic'],
  },
  {
    id: 'eden-sin-humanos-safari',
    num: '04',
    title: 'La sabana atemporal y el «Edén sin ciudadanos»',
    medium: 'turismo-publicidad',
    mediumLabel: 'Turismo y publicidad',
    visualPlateId: 'safari-postal-colonial',
    clicheSignature: '«África eterna: naturaleza virgen detenida en el tiempo»',
    persistenceArc: '1890s (reservas coloniales) → Marketing turístico actual',
    historicalOrigin:
      'Creación colonial de reservas de caza y parques nacionales en África Oriental y Austral (mediados del s. XIX–XX) expulsando a pastores locales de sus tierras ancestrales.',
    culturalMechanism:
      'Presenta África como un santuario primordial detenido en el Pleistoceno: acacias al atardecer, fauna salvaje y pueblos reducidos a parte del paisaje natural («autenticidad inmutable»).',
    examples:
      'Folletería turística de safaris de lujo («África eterna», «regreso al origen de los tiempos»), anuncios de todoterrenos y películas donde los animales tienen nombre y personalidad, pero los habitantes locales no.',
    whatItErases:
      'La gestión ecológica milenaria de pastores maasáis, san y agricultores africanos, así como la vida contemporánea de megaciudades, universidades y ecosistemas tecnológicos (fintech, cine, arquitectura).',
    counterEvidence:
      'La paleobotánica y la historia ambiental demuestran que las sabanas africanas son paisajes coevolucionados con sociedades humanas durante milenios, no parques vacíos.',
    linkedArtifactId: 'folleto-safari-turismo',
    tags: ['Safari', 'turismo', 'naturaleza', 'exotismo', 'atemporalidad'],
  },
  {
    id: 'salvador-blanco-afropesimismo',
    num: '05',
    title: 'El «salvador blanco» (White Savior) y el afropesimismo',
    medium: 'cine-comic',
    mediumLabel: 'Cine y cómic',
    visualPlateId: 'proyector-cine-colonial',
    clicheSignature: '«Solo una mirada externa puede rescatar o explicar este lugar»',
    persistenceArc: '1912 (Tarzán) → Cine comercial y campañas de choque',
    historicalOrigin:
      'Del héroe civilizador victoriano (Tarzán de E. R. Burroughs, 1912; Allan Quatermain) a la iconografía humanitaria televisada desde la hambruna de Biafra (1968) y Etiopía (1984).',
    culturalMechanism:
      'Coloca a un protagonista europeo o estadounidense como único agente racional, valiente o compasivo capaz de rescatar a una población africana retratada como pasiva, sufriente o incapaz de autogobernarse.',
    examples:
      'Cine comercial ambientado en África centrado en el despertar moral de un periodista, médico o aventurero occidental; campañas visuales de «pornografía de la pobreza» sin contexto político ni económico.',
    whatItErases:
      'El protagonismo de médicos, periodistas, movimientos feministas, sindicatos, científicas y redes comunitarias africanas en la resolución de sus propios desafíos.',
    counterEvidence:
      'El escritor Teju Cole acuñó el concepto «White Savior Industrial Complex» (2012) para señalar cómo estas narrativas sustituyen la justicia estructural y la agencia africana por la satisfacción emocional del espectador externo.',
    linkedArtifactId: 'campana-ong-pobreza',
    tags: ['White savior', 'Tarzán', 'afropesimismo', 'Teju Cole', 'cine'],
  },
  {
    id: 'magia-brujeria-irracionalidad',
    num: '06',
    title: 'Brujería, «vudú» y el enigma de lo irracional',
    medium: 'cine-comic',
    mediumLabel: 'Cine y cómic',
    visualPlateId: 'novela-aventuras-1890',
    clicheSignature: '«Hechiceros siniestros, maldiciones oscuras y ritos secretos»',
    persistenceArc: 'Siglo XIX (informes misioneros) → Terror y cómic popular',
    historicalOrigin:
      'Informes misioneros coloniales y prensa sensacionalista que tradujeron sistemas religiosos y jurídicos africanos como «fetichismo», «magia negra» o superstición peligrosa.',
    culturalMechanism:
      'Convierte rituales comunitarios, farmacopea tradicional y filosofías espirituales en espectáculo tenebroso, reduciendo la alteridad religiosa a amenaza o misterio inescrutable.',
    examples:
      'Películas de terror y aventuras sobre «maldiciones tribales», «hechiceros malignos» en tebeos clásicos (como el brujo Muganga en el cómic colonial) y uso frívolo de la palabra «vudú» para descalificar prácticas no occidentales.',
    whatItErases:
      'La lógica interna, ética comunitaria y sofisticación cosmológica de tradiciones como el sistema Ifá yoruba, el bosonismo akan, el bwiti centroafricano o la causalidad social estudiada por Evans-Pritchard entre los azande.',
    counterEvidence:
      'Los documentales de 05c (*Retorno al país de las almas*, *Ibogaina*, *La hermandad de sangre de los Azande*) permiten observar estos sistemas desde la escucha etnográfica rigurosa.',
    linkedArtifactId: 'comic-aventuras-colonial',
    tags: ['Cosmología', 'fetichismo', 'vudú', 'Evans-Pritchard', 'Akan'],
  },
  {
    id: 'tribalismo-conflictos-ancestrales',
    num: '07',
    title: 'La «tribu» primitiva y los «odios ancestrales»',
    medium: 'literatura-prensa',
    mediumLabel: 'Literatura y prensa',
    visualPlateId: 'prensa-ilustrada-1884',
    clicheSignature: '«Estallan de nuevo las guerras tribales milenarias»',
    persistenceArc: '1884 (Berlín y censos coloniales) → Titulares internacionales',
    historicalOrigin:
      'Política colonial de gobierno indirecto (divide et impera) y censos étnicos rígidos (como la fijación administrativa de carnés hutu/tutsi en Ruanda bajo administración belga).',
    culturalMechanism:
      'Aplica sistemáticamente la palabra «tribu» a sociedades africanas de millones de personas (mientras en Europa se habla de «naciones», «regiones» o «partidos») y atribuye crisis modernas a «odios atávicos».',
    examples:
      'Coberturas informativas que explican disputas por coltán, petróleo o fronteras trazadas en la Conferencia de Berlín (1884–1885) como «guerras tribales milenarias».',
    whatItErases:
      'La geopolítica contemporánea, las cadenas globales de suministro extractivo, las instituciones estatales africanas y el origen histórico reciente de muchas polarizaciones identitarias.',
    counterEvidence:
      'Historiadores como Mahmood Mamdani y Terence Ranger han demostrado la «invención de la tradición» y la fabricación colonial de identidades étnicas politizadas.',
    linkedArtifactId: 'titular-prensa-conflictos',
    tags: ['Tribu', 'Berlín 1884', 'prensa', 'Mamdani', 'esencialismo'],
  },
  {
    id: 'espectaculo-cuerpo-exposiciones',
    num: '08',
    title: 'El espectáculo del cuerpo y las exposiciones coloniales',
    medium: 'archivo-museos',
    mediumLabel: 'Archivo colonial y museos',
    visualPlateId: 'exposicion-colonial-1900',
    clicheSignature: '«Pabellón de las colonias y aldeas vivientes en exhibición»',
    persistenceArc: '1810 (Saartjie Baartman) – 1958 (Bruselas) → Archivo crítico',
    historicalOrigin:
      'Exhibición de Saartjie Baartman en Londres y París (1810–1815), «aldeas negras» en Exposiciones Universales (París 1889, 1900, 1931; Barcelona; Bruselas 1958) y tarjetas postales coloniales.',
    culturalMechanism:
      'Transforma cuerpos africanos reales en objetos de curiosidad anatómica, espectáculo de feria o souvenir fotográfico, fundiendo ciencia racial decimonónica y entretenimiento de masas.',
    examples:
      '«Zoológicos humanos» visitados por millones de europeos; cromos, marcas comerciales (como el imaginario Banania analizado por Frantz Fanon) y vitrinas museográficas descontextualizadas.',
    whatItErases:
      'La biografía, dignidad, voz y derechos de las personas exhibidas, así como el saqueo patrimonial de objetos reales y sagrados arrancados de su contexto.',
    counterEvidence:
      'Los estudios de Stuart Hall, Frantz Fanon (*Piel negra, máscaras blancas*, 1952) y Pascal Blanchard (*Zoos humains*), junto a la repatriación de los restos de Saartjie Baartman a Sudáfrica (2002).',
    tags: ['Saartjie Baartman', 'exposiciones coloniales', 'Fanon', 'museos', 'zoos humanos'],
  },
  {
    id: 'mision-civilizadora-carga',
    num: '09',
    title: 'La «misión civilizadora» y la carga del hombre blanco',
    medium: 'archivo-museos',
    mediumLabel: 'Archivo colonial y museos',
    visualPlateId: 'postales-africa-1905',
    clicheSignature: '«Llevamos ferrocarriles, medicina, escuela y orden al caos»',
    persistenceArc: '1884–1960 → Nostalgia neocolonial y revisionismo mediático',
    historicalOrigin:
      'Doctrina oficial de la Tercera República francesa (*mission civilisatrice*) y del imperio británico (*White Man’s Burden* de Kipling, 1899; *Dual Mandate* de Lugard, 1922) para presentar la conquista como deber moral.',
    culturalMechanism:
      'Invierte la relación económica real: disfraza la extracción de materias primas y el trabajo forzado de «sacrificio filantrópico», presentando las infraestructuras de exportación (puertos, vías hacia minas) como «regalos civilizadores».',
    examples:
      'Postales coloniales de puentes y estaciones inauguradas por gobernadores; libros escolares europeos del siglo XX; discursos actuales que todavía defienden un supuesto «saldo positivo» del colonialismo.',
    whatItErases:
      'El carácter extractivo de las infraestructuras coloniales (trazadas de la mina al puerto, sin conectar regiones africanas entre sí), la destrucción de escuelas coránicas y sistemas educativos previos y la violencia fiscal y laboral.',
    counterEvidence:
      'Walter Rodney (*How Europe Underdeveloped Africa*, 1972) y Aimé Césaire (*Discurso sobre el colonialismo*, 1950) demostraron que el colonialismo desarticuló economías locales para subordinarlas a la metrópoli.',
    linkedArtifactId: 'comic-aventuras-colonial',
    tags: ['Misión civilizadora', 'Kipling', 'Aimé Césaire', 'paternalismo', 'postales'],
  },
  {
    id: 'publicidad-exotismo-mercancia',
    num: '10',
    title: 'Publicidad colonial, exotismo doméstico y «racismo de mercancía»',
    medium: 'turismo-publicidad',
    mediumLabel: 'Turismo y publicidad',
    visualPlateId: 'publicidad-colonial-1920',
    clicheSignature: '«El sabor exótico y misterioso del corazón de África en tu mesa»',
    persistenceArc: '1890s (Pears, Banania) → Branding contemporáneo de origen',
    historicalOrigin:
      'Auge de la litografía comercial y los productos coloniales de masas entre 1885 y 1950 (jabones *Pears*, *Banania*, chocolates, café, té, aceite de palma y caucho), estudiado por Anne McClintock (*Imperial Leather*, 1995).',
    culturalMechanism:
      'Traduce la ideología imperial a placer sensorial y consumo hogareño: asocia lo africano a exotismo sensual, sumisión sonriente o fuerza «salvaje» domada y empaquetada para el consumidor metropolitano.',
    examples:
      'Latas litografiadas, carteles de café y chocolate, cromos infantiles y anuncios contemporáneos de perfumes, especias o moda que siguen recurriendo al «misterio africano» como reclamo estético.',
    whatItErases:
      'Las condiciones laborales reales en plantaciones coloniales y cadenas actuales de valor (cacao en Costa de Marfil y Ghana, café en Etiopía), así como el valor añadido retenido fuera del continente.',
    counterEvidence:
      'El análisis semiótico de Stuart Hall (1997) y Anne McClintock (1995) revela cómo la publicidad cotidiana fue el mayor difusor masivo de estereotipos coloniales en Europa.',
    linkedArtifactId: 'publicidad-cacao-exotico',
    tags: ['Commodity racism', 'McClintock', 'Banania', 'publicidad', 'consumo'],
  },
  {
    id: 'buen-salvaje-mistico',
    num: '11',
    title: 'El «buen salvaje» místico y la ambivalencia del estereotipo',
    medium: 'turismo-publicidad',
    mediumLabel: 'Turismo y publicidad',
    visualPlateId: 'safari-postal-colonial',
    clicheSignature: '«No tienen nada, pero siempre sonríen y llevan el ritmo en la sangre»',
    persistenceArc: 'Siglo XVIII (Rousseau vulgarizado) → Turismo espiritual y redes',
    historicalOrigin:
      'Versión romántica y paternalista del estereotipo colonial que contrapone un Occidente «racional pero estresado» a un África supuestamente «pura, intuitiva, feliz en la pobreza y conectada con la madre tierra».',
    culturalMechanism:
      'Como advierte Stuart Hall, el estereotipo es ambivalente: oscila entre el miedo («salvaje feroz») y el deseo paternalista («buen salvaje noble»). Aunque suene elogioso, deshumaniza igual porque niega historia, conflictividad, ambición intelectual y derechos materiales.',
    examples:
      'Relatos de viajeros occidentales que «se encuentran a sí mismos» en África; tópicos sobre «el ritmo en la sangre», «la sonrisa pese a no tener nada» o la sabiduría mística genérica atribuida a cualquier anciano africano en el cine.',
    whatItErases:
      'La desigualdad económica real (romantizada como «sencillez feliz»), la diversidad psicológica y política de los individuos africanos y el carácter aprendido —no biológico— de las artes musicales y escénicas del continente.',
    counterEvidence:
      'Frantz Fanon, Stuart Hall y Binyavanga Wainaina señalan que el exotismo «benévolo» es la cara amable de la misma frontera esencialista que excluye a África de la modernidad plena.',
    linkedArtifactId: 'guion-cine-hollywood',
    tags: ['Buen salvaje', 'ambivalencia', 'esencialismo', 'exotismo benévolo', 'Hall'],
  },
  {
    id: 'arte-primitivo-saqueo-museos',
    num: '12',
    title: 'El «arte primitivo», el fetiche y el saqueo patrimonial museográfico',
    medium: 'archivo-museos',
    mediumLabel: 'Archivo colonial y museos',
    visualPlateId: 'restitucion-bronce-2018',
    clicheSignature: '«Máscara tribal anónima · Arte primitivo · Colección particular»',
    persistenceArc: '1897 (Saqueo de Benín) → Debate actual sobre restitución',
    historicalOrigin:
      'Expediciones punitivas coloniales (como la destrucción y saqueo británico de la ciudad de Benín en 1897 o la misión Dakar–Yibuti de 1931–1933) que trasladaron decenas de miles de piezas a museos europeos, junto a la etiqueta vanguardista de «art nègre / arte primitivo».',
    culturalMechanism:
      'Separa el objeto de su función política, jurídica, dinástica o espiritual y lo exhibe como «fetiche misterioso» o obra anónima fuera del tiempo, ocultando además cómo llegó a la vitrina europea.',
    examples:
      'Bronces de Benín dispersos en museos de Londres, Berlín y París; cartelas que omiten autoría, taller y contexto de expolio; mercado internacional de «arte tribal».',
    whatItErases:
      'Los gremios reales de fundidores y escultores (Ife, Benín, Kuba, Fang, Dogón), la función de archivo histórico de las placas de bronce de Benín y el derecho de las sociedades africanas a su propio patrimonio.',
    counterEvidence:
      'Sally Price (*Primitive Art in Civilized Places*, 1989), el informe Sarr–Savoy (2018) y el documental *Dahomey* (Mati Diop, Oso de Oro 2024) sobre la restitución de 26 tesoros reales a Abomey.',
    tags: ['Bronces de Benín', 'arte primitivo', 'Sally Price', 'Sarr-Savoy', 'restitución'],
  },
];

export const DECODING_ARTIFACTS: DecodingArtifact[] = [
  {
    id: 'portada-novela-misterio',
    formatLabel: 'Ficción y best-seller',
    title: 'Sinopsis editorial: «Secretos del África inmemorial»',
    visualPlateId: 'novela-aventuras-1890',
    sampleText:
      '«En el corazón impenetrable de África, donde el tiempo parece haberse detenido desde el alba de la humanidad, una joven arqueóloga europea descubre las ruinas de una ciudad olvidada que desafía el misterio ancestral de la selva y sus tribus silenciosas.»',
    rhetoricalMarkers: [
      {
        phrase: 'corazón impenetrable de África',
        diagnosis: 'Eco directo del «Continente Oscuro» y Conrad (1899): África como espacio opaco y sin nombre de país.',
      },
      {
        phrase: 'donde el tiempo parece haberse detenido',
        diagnosis: 'Negación de la coetaneidad (Johannes Fabian): expulsa a las sociedades africanas del tiempo histórico presente.',
      },
      {
        phrase: 'arqueóloga europea descubre… tribus silenciosas',
        diagnosis: 'Borrado de la agencia local: solo la mirada externa «descubre» lo que las poblaciones locales habitan y conocen.',
      },
    ],
    readings: {
      dominante: {
        heading: 'Lectura dominante (hegemónica)',
        summary:
          'Acepta el código de la novela de aventuras clásica: el continente aparece como un escenario enigmático y pasivo que cobra sentido cuando un protagonista occidental lo descifra.',
        mechanism:
          'Activa la nostalgia imperial y el placer de lo exótico sin cuestionar por qué no se nombra ningún país ni se reconoce a investigadores africanos.',
        classroomTakeaway:
          'Así opera el sentido común naturalizado que Stuart Hall identifica en la cultura de masas.',
      },
      negociada: {
        heading: 'Lectura negociada',
        summary:
          'Reconoce que el lenguaje es exagerado por motivos comerciales («es solo entretenimiento»), pero sigue asumiendo de fondo que África es un lugar esencialmente remoto y enigmático.',
        mechanism:
          'Separa el «cliché literario» de la realidad, pero mantiene intacto el marco mental del «África misteriosa» como telón de fondo válido.',
        classroomTakeaway:
          'Es la recepción más frecuente: se detecta el tópico, pero se le resta importancia política y cultural.',
      },
      oposicional: {
        heading: 'Lectura oposicional (Cultural Studies / descolonial)',
        summary:
          'Desmonta la «biblioteca colonial» (Mudimbe) presente en el texto: cuestiona el borrado de los 54 Estados, la atribución externa del patrimonio y el uso del adjetivo «tribal» como marcador de inferioridad.',
        mechanism:
          'Exige situar las ruinas en su contexto arqueológico real (p. ej., Gran Zimbabue, Jenné-Jeno o Aksum) y dar protagonismo a la arqueología africana contemporánea.',
        classroomTakeaway:
          'Transforma un texto comercial en objeto de análisis crítico sobre poder, memoria y representación.',
      },
    },
  },
  {
    id: 'titular-prensa-conflictos',
    formatLabel: 'Prensa internacional',
    title: 'Titular mediático: «Estallan de nuevo los odios tribales en África»',
    visualPlateId: 'prensa-ilustrada-1884',
    sampleText:
      '«Una nueva ola de violencia ancestral sacude el corazón de África, atrapada una vez más entre rivalidades tribales milenarias y la incapacidad crónica para salir del caos.»',
    rhetoricalMarkers: [
      {
        phrase: 'en África (sin país ni región)',
        diagnosis: 'Efecto «África como un país»: contagia la imagen de inestabilidad a todo el continente.',
      },
      {
        phrase: 'violencia ancestral / rivalidades tribales milenarias',
        diagnosis: 'Esencialismo cultural: oculta intereses económicos, recursos minerales y fronteras coloniales modernas.',
      },
      {
        phrase: 'incapacidad crónica para salir del caos',
        diagnosis: 'Afropesimismo determinista: presenta la crisis como destino inevitable y no como proceso histórico reversible.',
      },
    ],
    readings: {
      dominante: {
        heading: 'Lectura dominante (hegemónica)',
        summary:
          'Asume que los conflictos en países africanos responden a pasiones irracionales y atávicas ajenas a la política moderna y a la economía global.',
        mechanism:
          'Despolitiza la violencia y exime de análisis a las cadenas globales de extracción, venta de armas o herencias coloniales.',
        classroomTakeaway:
          'Produce fatiga informativa e indiferencia cívica bajo la idea de que «siempre ha sido así».',
      },
      negociada: {
        heading: 'Lectura negociada',
        summary:
          'Advierte que el titular generaliza demasiado al hablar de «África», pero acepta parcialmente la explicación étnica («tribal») como causa principal del conflicto.',
        mechanism:
          'Corrige el error geográfico sin desmontar la categoría colonial de «tribu» ni indagar en causas políticas o económicas.',
        classroomTakeaway:
          'Muestra lo arraigada que está la palabra «tribal» en el vocabulario informativo cotidiano.',
      },
      oposicional: {
        heading: 'Lectura oposicional (Cultural Studies / descolonial)',
        summary:
          'Reescribe el encuadre exigiendo precisión geográfica, actores políticos concretos, historia colonial de las fronteras, economía de recursos y cobertura de las iniciativas africanas de paz.',
        mechanism:
          'Aplica la crítica de Adichie y Wainaina: sustituye la «historia única del caos» por un análisis geopolítico equivalente al que se usa para Europa o Asia.',
        classroomTakeaway:
          'Permite auditar noticias reales en clase comparando titulares sobre África con titulares sobre conflictos europeos.',
      },
    },
  },
  {
    id: 'publicidad-cacao-exotico',
    formatLabel: 'Publicidad y marcas',
    title: 'Anuncio comercial: «Origen salvaje · El elixir misterioso de la selva africana»',
    visualPlateId: 'publicidad-colonial-1920',
    sampleText:
      '«Déjate seducir por el secreto mejor guardado del África profunda. Recolectado a mano al ritmo de la tierra virgen, nuestro cacao trae a tu cocina toda la magia indómita y el exotismo ancestral del continente.»',
    rhetoricalMarkers: [
      {
        phrase: 'secreto mejor guardado del África profunda',
        diagnosis: 'Recicla el tropo del «África misteriosa» como argumento de deseo comercial (commodity racism).',
      },
      {
        phrase: 'al ritmo de la tierra virgen / magia indómita',
        diagnosis: 'Naturaliza el trabajo agrícola especializado convirtiendo a agricultores en extensión mística de la selva.',
      },
      {
        phrase: 'trae a tu cocina el exotismo ancestral',
        diagnosis: 'Consumo doméstico del imperio (Anne McClintock): el placer metropolitano borra el precio en origen y las cadenas globales.',
      },
    ],
    readings: {
      dominante: {
        heading: 'Lectura dominante (hegemónica)',
        summary:
          'Asocia el producto con autenticidad exótica, placer sensorial y naturaleza pura, percibiendo la campaña como un homenaje estético a África.',
        mechanism:
          'Usa el exotismo «positivo» para elevar el valor percibido de la marca sin revelar país, cooperativa ni reparto económico real.',
        classroomTakeaway:
          'Demuestra cómo el estereotipo colonial sobrevive en los lineales de supermercado bajo estética gourmet.',
      },
      negociada: {
        heading: 'Lectura negociada',
        summary:
          'Percibe la retórica de «magia indómita» como exageración publicitaria, pero compra el producto por su promesa de «origen natural» o comercio justo genérico.',
        mechanism:
          'Acepta el lenguaje exotizante como convención inofensiva del marketing alimentario.',
        classroomTakeaway:
          'Invita a comparar envases de cacao o café africano con los de vino o aceite europeos (que siempre citan denominación, historia y técnica).',
      },
      oposicional: {
        heading: 'Lectura oposicional (Cultural Studies / descolonial)',
        summary:
          'Identifica la genealogía directa con las latas coloniales de 1920 (Fuente CS-06) y exige transparencia sobre país (p. ej., cooperativas de Ghana o Costa de Marfil), transformación industrial en origen y dignidad de los productores.',
        mechanism:
          'Aplica el concepto de «racismo de mercancía» (McClintock) para sustituir el misterio exótico por trazabilidad técnica y justicia comercial.',
        classroomTakeaway:
          'Excelente ejercicio práctico: llevar al aula 3 anuncios actuales de café, chocolate o cosmética y auditar sus clichés.',
      },
    },
  },
  {
    id: 'comic-aventuras-colonial',
    formatLabel: 'Cómic y cultura juvenil',
    title: 'Álbum clásico de aventuras: «El joven explorador, el porteador ingenuo y el hechicero»',
    visualPlateId: 'novela-aventuras-1890',
    sampleText:
      '«El intrépido reportero europeo llega en barco de vapor con salacot y maleta. Los lugareños hablan un idioma infantilizado, temen a un brujo embaucador y aclaman al visitante cuando les enseña geografía y repara una locomotora.»',
    rhetoricalMarkers: [
      {
        phrase: 'idioma infantilizado («petit-nègre»)',
        diagnosis: 'Marca lingüística colonial que representa a adultos africanos como niños necesitados de tutela.',
      },
      {
        phrase: 'brujo embaucador frente al visitante racional',
        diagnosis: 'Alegoría maniquea clásica: opone ciencia/modernidad blanca a superstición/engaño local.',
      },
      {
        phrase: 'les enseña geografía y repara una locomotora',
        diagnosis: 'Puesta en escena didáctica de la «misión civilizadora» (Kipling / propaganda colonial de entreguerras).',
      },
    ],
    readings: {
      dominante: {
        heading: 'Lectura dominante (hegemónica)',
        summary:
          'Lee la historieta como una aventura simpática e inofensiva donde el protagonista moderno ayuda generosamente a poblaciones atrasadas.',
        mechanism:
          'La comedia gráfica y la nostalgia infantil naturalizan la jerarquía colonial como benevolencia paternal.',
        classroomTakeaway:
          'Explica por qué los tebeos coloniales (como Tintín en el Congo, 1930–31) moldearon imaginarios durante varias generaciones.',
      },
      negociada: {
        heading: 'Lectura negociada',
        summary:
          'Admite que las caricaturas resultan incómodas hoy, pero las despacha con la fórmula «era cosa de su época» sin analizar qué discurso político cumplían en 1930.',
        mechanism:
          'Relativiza la obra sin contextualizarla dentro de la propaganda real del Congo Belga y los imperios europeos.',
        classroomTakeaway:
          'Historicizar no significa excusar ni ocultar: significa explicar el contexto colonial que produjo la obra.',
      },
      oposicional: {
        heading: 'Lectura oposicional (Cultural Studies / descolonial)',
        summary:
          'Conserva la obra como documento histórico de la propaganda colonial de entreguerras y la acompaña de aparato crítico y cómic africano contemporáneo (p. ej., Marguerite Abouet en Aya de Yopougon o autores congoleños de Kinshasa).',
        mechanism:
          'Convierte el álbum colonial en fuente primaria para enseñar alfabetización visual crítica en lugar de consumirlo acríticamente.',
        classroomTakeaway:
          'Conecta la pedagogía crítica del archivo con la vitalidad de la historieta africana actual.',
      },
    },
  },
  {
    id: 'folleto-safari-turismo',
    formatLabel: 'Turismo y publicidad',
    title: 'Folleto turístico: «Regresa al origen del mundo · Safari auténtico»',
    visualPlateId: 'safari-postal-colonial',
    sampleText:
      '«Siente el latido primitivo de la sabana bajo el cielo rojo de África. Fotografía la fauna salvaje y convive con guerreros ancestrales que conservan intactas las costumbres de hace diez mil años.»',
    rhetoricalMarkers: [
      {
        phrase: 'latido primitivo / hace diez mil años',
        diagnosis: 'Arqueologización del presente (alocronismo): trata a ciudadanos contemporáneos como fósiles vivientes.',
      },
      {
        phrase: 'fauna salvaje y guerreros ancestrales',
        diagnosis: 'Yuxtaposición clásica señalada por Wainaina: equipara a comunidades humanas con la fauna del parque.',
      },
      {
        phrase: 'fotografía… convive (mirada consumidora)',
        diagnosis: 'Economía visual del exotismo: la cultura local se convierte en decorado fotogénico para el visitante.',
      },
    ],
    readings: {
      dominante: {
        heading: 'Lectura dominante (hegemónica)',
        summary:
          'Consume el paquete como una experiencia emocional de «autenticidad pura» lejos de la modernidad urbana occidental.',
        mechanism:
          'Convierte la desigualdad histórica y la performatividad turística en prueba de un pasado supuestamente intacto.',
        classroomTakeaway:
          'Conecta directamente con el documental Cannibal Tours y el análisis de la mirada turística.',
      },
      negociada: {
        heading: 'Lectura negociada',
        summary:
          'Sabe que el folleto usa hipérbole publicitaria y que los anfitriones usan teléfonos móviles o trabajan en el sector turístico, pero aun así busca esa estética «sin signos de modernidad» en sus fotos.',
        mechanism:
          'Mantiene la demanda de «autenticidad arcaica» que obliga a las comunidades a escenificar el estereotipo para obtener ingresos.',
        classroomTakeaway:
          'Evidencia cómo el estereotipo no es solo discursivo: también organiza mercados turísticos reales.',
      },
      oposicional: {
        heading: 'Lectura oposicional (Cultural Studies / descolonial)',
        summary:
          'Reconoce la contemporaneidad plena de las sociedades pastoriles y urbanas africanas, analiza el impacto histórico de la expulsión de tierras para parques y propone un turismo cultural basado en el patrimonio vivo y el respeto.',
        mechanism:
          'Rompe la falsa dicotomía entre «Europa moderna» y «África ancestral».',
        classroomTakeaway:
          'Integra el debate sobre turismo responsable y derechos territoriales en África Oriental y Austral.',
      },
    },
  },
  {
    id: 'campana-ong-pobreza',
    formatLabel: 'Comunicación humanitaria',
    title: 'Cartel de campaña: «Solo tú puedes salvar su futuro»',
    visualPlateId: 'birmingham-prensa',
    sampleText:
      '«Un niño anónimo con mirada triste ocupa todo el plano en blanco y negro. El lema reza: “África no puede esperar. Con tu ayuda hoy cambiarás su destino”. Sin nombre, país ni explicación del proyecto local.»',
    rhetoricalMarkers: [
      {
        phrase: 'niño anónimo sin nombre ni contexto',
        diagnosis: 'Infantilización simbólica del continente: reduce sociedades adultas y complejas a la figura del niño desvalido.',
      },
      {
        phrase: 'Solo tú puedes salvar su futuro',
        diagnosis: 'Estructura del «salvador blanco»: concentra toda la capacidad de acción en el donante externo.',
      },
      {
        phrase: 'sin explicación del proyecto ni contrapartes locales',
        diagnosis: 'Invisibilización de los profesionales, cooperativas y administraciones africanas que lideran el trabajo sobre el terreno.',
      },
    ],
    readings: {
      dominante: {
        heading: 'Lectura dominante (hegemónica)',
        summary:
          'Responde con compasión inmediata desde la culpa o la caridad, asumiendo que África depende estructuralmente de la generosidad occidental para sobrevivir.',
        mechanism:
          'Moviliza emociones rápidas a costa de reforzar la jerarquía entre un Norte activo/salvador y un Sur pasivo/receptor.',
        classroomTakeaway:
          'Los códigos de ética de comunicación de ONG modernas ya cuestionan frontalmente estas campañas.',
      },
      negociada: {
        heading: 'Lectura negociada',
        summary:
          'Considera que la imagen es dura o paternalista, pero la justifica como «mal necesario» para recaudar fondos urgentes.',
        mechanism:
          'Acepta el daño simbólico a largo plazo (consolidar el afropesimismo) como precio aceptable de la eficacia publicitaria a corto plazo.',
        classroomTakeaway:
          'Permite debatir la ética de la imagen: ¿se puede defender la dignidad humana usando imágenes que la erosionan?',
      },
      oposicional: {
        heading: 'Lectura oposicional (Cultural Studies / descolonial)',
        summary:
          'Reclama comunicación basada en derechos, dignidad y corresponsabilidad: nombrar país y comunidad, mostrar liderazgo local, explicar causas estructurales y ceder la narrativa a protagonistas africanos.',
        mechanism:
          'Sustituye la caridad vertical por solidaridad horizontal y justicia epistémica.',
        classroomTakeaway:
          'Conecta directamente con la experiencia de *Dos cuadernos por niño* (05c) y el movimiento #NoWhiteSaviors.',
      },
    },
  },
  {
    id: 'guion-cine-hollywood',
    formatLabel: 'Cine comercial',
    title: 'Estreno cinematográfico: «Misión en la tierra olvidada»',
    visualPlateId: 'proyector-cine-colonial',
    sampleText:
      '«Un reportero desencantado viaja a un país africano ficticio en guerra, descubre el valor de la vida gracias a un sabio anciano local que muere a mitad de película y logra sacar la verdad al mundo.»',
    rhetoricalMarkers: [
      {
        phrase: 'país africano ficticio genérico',
        diagnosis: 'Intercambiabilidad geográfica: África como decorado abstracto sin historia ni geografía real.',
      },
      {
        phrase: 'sabio anciano local que guía al protagonista',
        diagnosis: 'Arquetipo secundario («buen salvaje místico») cuya única función dramática es el crecimiento espiritual del héroe externo.',
      },
      {
        phrase: 'logra sacar la verdad al mundo',
        diagnosis: 'Monopolio de la voz: la verdad africana solo existe cuando un mediador occidental la valida y la narra.',
      },
    ],
    readings: {
      dominante: {
        heading: 'Lectura dominante (hegemónica)',
        summary:
          'Se identifica con el arco emocional del reportero y siente que la película «conciencia» sobre los problemas de África.',
        mechanism:
          'El espectador occidental se ve reflejado como testigo moral y héroe, manteniendo a los personajes africanos en el margen.',
        classroomTakeaway:
          'Incluso películas con «buenas intenciones» pueden reproducir el régimen colonial de la mirada.',
      },
      negociada: {
        heading: 'Lectura negociada',
        summary:
          'Nota que los personajes africanos tienen poco desarrollo, pero valora que la película al menos «ponga el foco» en el continente.',
        mechanism:
          'Tolera la asimetría narrativa como condición industrial del cine comercial internacional.',
        classroomTakeaway:
          'Ayuda a diferenciar entre visibilidad cuantitativa y calidad de la representación.',
      },
      oposicional: {
        heading: 'Lectura oposicional (Cultural Studies / descolonial)',
        summary:
          'Invierte el punto de vista y acude al cine dirigido y escrito desde África (Ousmane Sembène, Djibril Diop Mambéty, Safi Faye, Mati Diop, Abderrahmane Sissako) donde la complejidad psicológica y política reside en protagonistas africanos.',
        mechanism:
          'Descentraliza el canon audiovisual y demuestra que África lleva más de seis décadas narrándose a sí misma en el cine.',
        classroomTakeaway:
          'Enlaza directamente con la pestaña de Contra-narrativas y con el archivo de 05c.',
      },
    },
  },
];

export const COUNTER_NARRATIVE_DOMAINS: CounterNarrativeDomain[] = [
  {
    id: 'literatura-respuesta',
    num: '01',
    domain: 'Literatura africana y respuesta al canon colonial',
    subtitle: 'De la réplica a Conrad hasta la polifonía contemporánea',
    visualPlateId: 'manuscritos-tombuctu',
    keyCreators:
      'Chinua Achebe (Nigeria) · Ngũgĩ wa Thiong’o (Kenia) · Mariama Bâ (Senegal) · Chimamanda Ngozi Adichie (Nigeria) · Abdulrazak Gurnah (Tanzania, Nobel 2021)',
    howItSubverts:
      'Frente a la narrativa del «África misteriosa» y silenciosa, la novela africana moderna reconstruye desde dentro la complejidad jurídica, filosófica, íntima y política de sus sociedades, respondiendo directamente a la «biblioteca colonial».',
    landmarkWorks: [
      'Things Fall Apart / Todo se desmorona (Chinua Achebe, 1958)',
      'Une si longue lettre / Mi carta más larga (Mariama Bâ, 1979)',
      'Decolonising the Mind (Ngũgĩ wa Thiong’o, 1986)',
      'Paradise / Paraíso (Abdulrazak Gurnah, 1994 · redes del Índico)',
    ],
    linkToModule: 'Dialoga con 05. Historiografía y 05b. Estereotipos sobre canibalismo.',
  },
  {
    id: 'cine-africano-fespaco',
    num: '02',
    domain: 'Cine africano independiente y FESPACO',
    subtitle: '«La escuela vespertina» y la soberanía de la mirada',
    visualPlateId: 'estudio-bamako-cine',
    keyCreators:
      'Ousmane Sembène (Senegal) · Safi Faye (Senegal) · Djibril Diop Mambéty (Senegal) · Souleymane Cissé (Malí) · Abderrahmane Sissako (Mauritania) · Mati Diop (Senegal/Francia)',
    howItSubverts:
      'Ousmane Sembène rechazó el papel de objeto etnográfico («nos miráis como a insectos») y fundó un cine africano moderno con lenguas locales, sátira poscolonial y crítica de clase, consolidado en el festival panafricano FESPACO de Uagadugú (desde 1969).',
    landmarkWorks: [
      'La Noire de… (Ousmane Sembène, 1966)',
      'Touki Bouki (Djibril Diop Mambéty, 1973)',
      'Kaddu Beykat / Carta campesina (Safi Faye, 1975)',
      'Timbuktu (Abderrahmane Sissako, 2014) · Dahomey (Mati Diop, 2024)',
    ],
    linkToModule: 'Complementa la filmografía del archivo abierto en 05c. Antropología visual.',
  },
  {
    id: 'fotografia-estudio-africana',
    num: '03',
    domain: 'Fotografía de estudio y autorrepresentación',
    subtitle: 'Del retrato postal colonial a la modernidad urbana de Bamako',
    visualPlateId: 'estudio-bamako-cine',
    keyCreators:
      'Seydou Keïta (Malí) · Malick Sidibé (Malí) · Samuel Fosso (Camerún/R. Centroafricana) · Zanele Muholi (Sudáfrica) · Omar Victor Diop (Senegal)',
    howItSubverts:
      'Mientras la fotografía colonial clasificaba tipos raciales y cuerpos pasivos, los retratistas africanos de los años 50–70 en Bamako, Dakar o Lagos inmortalizaron la elegancia, la música, las independencias y la autodeterminación estética de la ciudadanía africana.',
    landmarkWorks: [
      'Retratos de estudio de Bamako (Seydou Keïta, 1948–1962)',
      'Nuits de Bamako (Malick Sidibé, 1960–1975)',
      'Proyecto Diaspora (Omar Victor Diop, 2014 · relectura de africanos en la pintura europea)',
    ],
    linkToModule: 'Contrasta directamente con los grabados y postales analizados en 05b y 05d.',
  },
  {
    id: 'afrofuturismo-africanfuturismo',
    num: '04',
    domain: 'Afrofuturismo y Africanfuturism',
    subtitle: 'Romper la condena del continente al «pasado inmóvil»',
    visualPlateId: 'arquitectura-afrofuturismo',
    keyCreators:
      'Nnedi Okorafor (Nigeria/EE. UU.) · Wanuri Kahiu (Kenia) · Sun Ra · Kodwo Eshun · colectivos de diseño, cómic y arquitectura especulativa en Lagos, Nairobi y Ciudad del Cabo',
    howItSubverts:
      'Si el tropo del «África misteriosa» encierra al continente en una prehistoria perpetua, el africanfuturismo (concepto acuñado por Nnedi Okorafor) imagina futuros tecnológicos, ecológicos y espaciales anclados en historias, lenguas y epistemologías africanas.',
    landmarkWorks: [
      'Pumzi (Wanuri Kahiu, 2009 · cortometraje de ciencia ficción en Kenia)',
      'Trilogía Binti y Lagoon (Nnedi Okorafor, 2014–2018)',
      'Further Considerations on Afrofuturism (Kodwo Eshun, 2003)',
    ],
    linkToModule: 'Proyecta los saberes tecnológicos de 02. Metalurgia y 03. Reinos hacia el futuro.',
  },
];

export const CULTURAL_STUDIES_BIBLIOGRAPHY = [
  'Achebe, C. (1977). An Image of Africa: Racism in Conrad’s Heart of Darkness. The Massachusetts Review, 18(4), 782–794.',
  'Adichie, C. N. (2009). The Danger of a Single Story [Conferencia]. TEDGlobal.',
  'Bhabha, H. K. (1994). The Location of Culture. Routledge.',
  'Blanchard, P., Bancel, N., Boëtsch, G., Deroo, É., Lemaire, S., y Forsdick, C. (Eds.). (2008). Human Zoos: Science and Spectacle in the Age of Colonial Empires. Liverpool University Press.',
  'Césaire, A. (1950). Discours sur le colonialisme. Éditions Réclame / Présence Africaine.',
  'Fabian, J. (1983). Time and the Other: How Anthropology Makes Its Object. Columbia University Press.',
  'Fanon, F. (1952). Peau noire, masques blancs. Éditions du Seuil.',
  'Hall, S. (1973). Encoding and Decoding in the Television Discourse. Centre for Contemporary Cultural Studies, University of Birmingham.',
  'Hall, S. (Ed.). (1997). Representation: Cultural Representations and Signifying Practices. Sage / Open University.',
  'JanMohamed, A. R. (1985). The Economy of Manichean Allegory: The Function of Racial Difference in Colonialist Literature. Critical Inquiry, 12(1), 59–87.',
  'Mbembe, A. (2001). On the Postcolony. University of California Press.',
  'McClintock, A. (1995). Imperial Leather: Race, Gender and Sexuality in the Colonial Contest. Routledge.',
  'Mudimbe, V.-Y. (1988). The Invention of Africa: Gnosis, Philosophy, and the Order of Knowledge. Indiana University Press.',
  'Ngũgĩ wa Thiong’o. (1986). Decolonising the Mind: The Politics of Language in African Literature. James Currey.',
  'Price, S. (1989). Primitive Art in Civilized Places. University of Chicago Press.',
  'Said, E. W. (1978). Orientalism. Pantheon Books.',
  'Sarr, F., y Savoy, B. (2018). Rapport sur la restitution du patrimoine culturel africain: Vers une nouvelle éthique relationnelle. Ministère de la Culture (Francia).',
  'Wainaina, B. (2005). How to Write About Africa. Granta, 92, 91–95.',
];
