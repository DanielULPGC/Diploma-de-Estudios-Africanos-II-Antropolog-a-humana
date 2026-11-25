import { resolveAssetUrl } from '../utils/assetUrl';

export type CulturalStudiesTabId =
  | 'marco-teorico'
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

export type CulturalVisualPlateId =
  | 'biblioteca-colonial'
  | 'archivo-colonial'
  | 'birmingham-prensa'
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

export interface MysteriousAfricaTrope {
  id: string;
  num: string;
  title: string;
  medium: Exclude<TropeMediumId, 'todos'>;
  mediumLabel: string;
  visualPlateId: CulturalVisualPlateId;
  historicalOrigin: string;
  culturalMechanism: string;
  examples: string;
  whatItErases: string;
  counterEvidence: string;
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
  tropos: {
    kicker: 'Galería de fuentes históricas · Apartado II',
    title: 'Fuentes materiales e iconográficas del «África misteriosa»',
    intro:
      'Cuatro testimonios de corte histórico —cartografía decimonónica, documentación arquitectónica del Gran Zimbabue, postales litográficas de safari y fotografía en albúmina de las Exposiciones Universales— para estudiar el origen concreto de los ocho tropos.',
  },
  decodificador: {
    kicker: 'Galería de fuentes históricas · Apartado III',
    title: 'Soportes mediáticos de archivo para practicar la lectura crítica',
    intro:
      'Antes de analizar titulares y campañas actuales, estas tres fuentes históricas muestran la matriz material donde nacieron los códigos analizados con el modelo de Stuart Hall: la novela ilustrada victoriana, la prensa del reparto de Berlín (1884) y los noticiarios fílmicos en 35 mm.',
  },
  contranarrativas: {
    kicker: 'Galería de fuentes históricas · Apartado IV',
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

export const CULTURAL_STUDIES_VISUAL_PLATES: CulturalVisualReferencePlate[] = [
  // APARTADO 1: MARCO TEÓRICO (3 fuentes históricas)
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
    credit: 'Archivo didáctico de fuentes · Bloque III · 05d (Apartado I)',
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
    credit: 'Archivo didáctico de fuentes · Bloque III · 05d (Apartado I)',
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
    credit: 'Archivo didáctico de fuentes · Bloque III · 05d (Apartado I)',
    src: resolveAssetUrl('src/assets/images/cs_fuente_birmingham_prensa_1795521357119.jpg'),
    alt: 'Fotografía documental en blanco y negro de una mesa de seminario universitario de los años setenta con hojas de contacto, recortes de prensa anotados en rojo, lupa cuentahílos y libros de Cultural Studies.',
    compareWithId: 'prensa-ilustrada-1884',
    linkedTab: 'marco-teorico',
    linkedTheoristId: 'wainaina',
    linkedActionLabel: 'Leer a Wainaina',
  },

  // APARTADO 2: ANATOMÍA DE LOS 8 TROPOS (4 fuentes históricas)
  {
    id: 'mapa-continente-oscuro',
    section: 'tropos',
    sourceCode: 'Fuente CS-04',
    datePeriod: 'c. 1875–1899',
    sourceType: 'Cartografía comparada · Terra incognita vs. redes africanas',
    figureNum: 'Lám. II.1',
    kicker: 'Tropos 01 y 02 · «Continente Oscuro» y homogeneización',
    title: 'Del interior en blanco europeo a las rutas históricas del continente',
    caption:
      'Contraste entre la cartografía colonial decimonónica que rotulaba el interior africano como vacío («terra incognita») y las redes caravaneras, marítimas y astronómicas conocidas durante siglos por sus habitantes.',
    provenanceNote:
      'Contrapunto visual entre la tradición cartográfica europea posterior a Stanley (1878) y los saberes geográficos sahelianos e índicos.',
    analyticalFocus:
      'Demuestra que la «oscuridad» del mito de Stanley y Conrad no estaba en África, sino en los límites del archivo europeo del siglo XIX.',
    credit: 'Archivo didáctico de fuentes · Bloque III · 05d (Apartado II)',
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
    sourceCode: 'Fuente CS-05',
    datePeriod: 'Siglos XI–XV · Doc. 1929',
    sourceType: 'Fotografía arquitectónica monocroma de archivo',
    figureNum: 'Lám. II.2',
    kicker: 'Tropo 03 · «Ciudades perdidas» y mito difusionista',
    title: 'Gran Zimbabue: mampostería shona frente a la ficción de los constructores externos',
    caption:
      'Muros curvos de granito en piedra seca y torre cónica del Gran Zimbabue. La ficción imperial (Haggard) y la administración colonial negaron su origen africano hasta las excavaciones de Caton-Thompson (1929).',
    provenanceNote:
      'Registro arquitectónico monocromo de corte monográfico del complejo monumental del Gran Zimbabue (África Austral).',
    analyticalFocus:
      'Prueba material decisiva contra el difusionismo racista que atribuía todo gran monumento africano a fenicios, egipcios o reinas legendarias.',
    credit: 'Archivo didáctico de fuentes · Bloque III · 05d (Apartado II)',
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
    sourceCode: 'Fuente CS-06',
    datePeriod: 'c. 1910–1935',
    sourceType: 'Litografía turística y colección de postales coloniales',
    figureNum: 'Lám. II.3',
    kicker: 'Tropo 04 · La sabana atemporal y el «Edén sin ciudadanos»',
    title: 'Postales de viaje, acacias al atardecer y estética del safari colonial',
    caption:
      'Lámina litográfica de sabana deshabitada al ocaso, prismáticos de campaña en cuero, brújula y tarjetas postales sepia: la iconografía turística que congeló África en una naturaleza sin ciudad ni historia.',
    provenanceNote:
      'Efímera turística y postal de época colonial (África Oriental y Austral, décadas de 1910–1930).',
    analyticalFocus:
      'Conecta directamente con la sátira de Binyavanga Wainaina: acacias solitarias y cielos rojos usados como emblema único que borra a 1.400 millones de ciudadanos.',
    credit: 'Archivo didáctico de fuentes · Bloque III · 05d (Apartado II)',
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
    sourceCode: 'Fuente CS-07',
    datePeriod: 'c. 1900–1931',
    sourceType: 'Fotografía en papel a la albúmina · Exposiciones Universales',
    figureNum: 'Lám. II.4',
    kicker: 'Tropos 05–08 · Exposiciones coloniales, vitrinas y alteridad',
    title: 'Pabellones y vitrinas museográficas de las Exposiciones Universales europeas',
    caption:
      'Vista histórica en albúmina sepia de una gran galería expositiva europea hacia 1900 con vitrinas de madera y cristal: el escenario donde objetos saqueados y pueblos colonizados se exhibieron como curiosidad imperial.',
    provenanceNote:
      'Tipología documental de álbum fotográfico de las Exposiciones Universales y Coloniales (París 1900 / 1931, Bruselas, Londres).',
    analyticalFocus:
      'Base histórica para analizar el espectáculo del cuerpo, la vitrina descontextualizada, la etiqueta «tribal» y los debates contemporáneos sobre restitución.',
    credit: 'Archivo didáctico de fuentes · Bloque III · 05d (Apartado II)',
    src: resolveAssetUrl('src/assets/images/cs_fuente_exposicion_colonial_1900_1795521358176.jpg'),
    alt: 'Fotografía histórica en tonos sepia hacia 1900 del interior de un gran palacio expositivo europeo con bóveda de hierro y cristal, visitantes de época y hileras de vitrinas museográficas.',
    compareWithId: 'estudio-bamako-cine',
    linkedTab: 'tropos',
    linkedTropeId: 'espectaculo-cuerpo-exposiciones',
    linkedActionLabel: 'Analizar tropo 08',
  },

  // APARTADO 3: LABORATORIO DE LECTURA · STUART HALL (3 fuentes históricas)
  {
    id: 'novela-aventuras-1890',
    section: 'decodificador',
    sourceCode: 'Fuente CS-08',
    datePeriod: 'c. 1885–1915',
    sourceType: 'Novela ilustrada victoriana · Grabado xilográfico',
    figureNum: 'Lám. III.1',
    kicker: 'Soporte editorial · Ficción imperial y best-seller',
    title: 'Novela de aventuras ilustrada: el explorador ante las «ruinas perdidas»',
    caption:
      'Edición victoriana de cantos dorados abierta por un grabado xilográfico de un explorador con salacot frente a ruinas selváticas: el arquetipo narrativo que inauguró H. Rider Haggard y pervive en la ficción comercial.',
    provenanceNote:
      'Tipología de novela colonial ilustrada británica y europea de finales del siglo XIX (tradición de King Solomon’s Mines, 1885).',
    analyticalFocus:
      'Sirve de fuente primaria para aplicar la lectura oposicional de Stuart Hall a sinopsis editoriales y películas de «templos olvidados».',
    credit: 'Archivo didáctico de fuentes · Bloque III · 05d (Apartado III)',
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
    sourceCode: 'Fuente CS-09',
    datePeriod: '1884–1885',
    sourceType: 'Prensa ilustrada y cartografía diplomática del reparto',
    figureNum: 'Lám. III.2',
    kicker: 'Soporte hemerográfico · Conferencia de Berlín y prensa internacional',
    title: 'La prensa europea del reparto de África y el trazado de fronteras con regla',
    caption:
      'Mapa grabado de África surcado por líneas rectas en tinta carmesí junto a regla y compás de latón y un periódico ilustrado del Congreso de Berlín (1884–1885): el origen histórico de muchos titulares sobre «conflictos tribales».',
    provenanceNote:
      'Composición documental sobre prensa ilustrada y cartografía geopolítica europea durante el reparto colonial (Scramble for Africa, 1884–1885).',
    analyticalFocus:
      'Permite desmontar la falacia de los «odios ancestrales» en la prensa actual recordando la fabricación colonial moderna de fronteras y censos.',
    credit: 'Archivo didáctico de fuentes · Bloque III · 05d (Apartado III)',
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
    sourceCode: 'Fuente CS-10',
    datePeriod: 'c. 1930–1960',
    sourceType: 'Archivo fílmico en 35 mm · Mesa de montaje y noticiarios',
    figureNum: 'Lám. III.3',
    kicker: 'Soporte audiovisual · Cine colonial, noticiarios y Hollywood',
    title: 'Latas de 35 mm, celuloide en mesa de luz y montaje de la mirada fílmica',
    caption:
      'Latas metálicas de película de 35 mm, tiras de celuloide examinadas con lupa y guantes de archivo sobre mesa luminosa: recuerda que toda película sobre África es una construcción técnica, seleccionada y montada.',
    provenanceNote:
      'Escena de archivo fílmico y laboratorio de montaje de mediados del siglo XX, época de auge del cine colonial y los noticiarios europeos.',
    analyticalFocus:
      'Ilustra la fase de «codificación» (Hall): el encuadre, el montaje y la voz en off deciden quién habla como héroe y quién queda reducido a decorado.',
    credit: 'Archivo didáctico de fuentes · Bloque III · 05d (Apartado III)',
    src: resolveAssetUrl('src/assets/images/cs_fuente_proyector_cine_colonial_1795521389345.jpg'),
    alt: 'Mesa de archivo fílmico de mediados del siglo XX con pilas de latas metálicas de película de 35 mm, tiras de celuloide sobre una mesa luminosa, empalmadora mecánica y un archivista con guantes blancos sosteniendo una lupa.',
    compareWithId: 'estudio-bamako-cine',
    linkedTab: 'decodificador',
    linkedArtifactId: 'guion-cine-hollywood',
    linkedActionLabel: 'Decodificar guion',
  },

  // APARTADO 4: CONTRA-NARRATIVAS Y CREACIÓN AFRICANA (3 fuentes históricas)
  {
    id: 'manuscritos-tombuctu',
    section: 'contranarrativas',
    sourceCode: 'Fuente CS-11',
    datePeriod: 'Siglos XV–XVII · Ed. 1958–1986',
    sourceType: 'Manuscrito saheliano y primeras ediciones literarias africanas',
    figureNum: 'Lám. IV.1',
    kicker: 'Contra-archivo escrito · De Tombuctú a Achebe y Ngũgĩ',
    title: 'Manuscritos astronómicos del Sahel y biblioteca literaria africana moderna',
    caption:
      'Carpeta de cuero repujado con folios de tradición manuscrita de Tombuctú (diagramas astronómicos y tablas) junto a ediciones en tela de literatura africana moderna: continuidad intelectual frente al mito del «continente ágrafo».',
    provenanceNote:
      'Diálogo visual entre los fondos manuscritos históricos de África Occidental y el renacimiento editorial africano de la segunda mitad del siglo XX.',
    analyticalFocus:
      'Refuta de raíz la tesis colonial de un continente sin escritura ni pensamiento teórico y enmarca la respuesta literaria de Achebe, Mariama Bâ y Ngũgĩ.',
    credit: 'Archivo didáctico de fuentes · Bloque III · 05d (Apartado IV)',
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
    sourceCode: 'Fuente CS-12',
    datePeriod: '1948–1975',
    sourceType: 'Fotografía de estudio urbano y cine independiente (FESPACO)',
    figureNum: 'Lám. IV.2',
    kicker: 'Contra-archivo visual · Bamako, Dakar y Uagadugú',
    title: 'Estudio fotográfico de Bamako, bobinas de 35 mm y soberanía de la mirada',
    caption:
      'Telón textil índigo geométrico, cámara de formato medio sobre trípode de madera, latas de 35 mm y libros en un estudio de África Occidental de los años sesenta: el nacimiento de la autorrepresentación moderna.',
    provenanceNote:
      'Homenaje documental a la generación de las independencias: Seydou Keïta, Malick Sidibé, Ousmane Sembène, Safi Faye y el festival FESPACO (1969).',
    analyticalFocus:
      'Invierte por completo el régimen escópico de la Lám. I.2: aquí la ciudadanía africana controla la pose, el encuadre, la lengua y la pantalla.',
    credit: 'Archivo didáctico de fuentes · Bloque III · 05d (Apartado IV)',
    src: resolveAssetUrl('src/assets/images/cs_contranarrativas_bamako_cine_1795520995818.jpg'),
    alt: 'Estudio luminoso de fotografía y cine de África Occidental de los años sesenta con telón de tela índigo estampada, cámara de formato medio sobre trípode de madera, latas de película de 35 mm y libros de literatura africana.',
    compareWithId: 'archivo-colonial',
    linkedTab: 'contranarrativas',
    linkedDomainId: 'fotografia-estudio-africana',
    linkedActionLabel: 'Ver cine y fotografía',
  },
  {
    id: 'arquitectura-afrofuturismo',
    section: 'contranarrativas',
    sourceCode: 'Fuente CS-13',
    datePeriod: 'Siglo XXI · Dakar, Lagos, Nairobi',
    sourceType: 'Maqueta arquitectónica y diseño especulativo africano',
    figureNum: 'Lám. IV.3',
    kicker: 'Futuros africanos · Afrofuturismo y Africanfuturism',
    title: 'Estudio contemporáneo de arquitectura en tierra, celosías solares y diseño',
    caption:
      'Maqueta en tierra y madera que fusiona geometrías sahelianas con celosías solares contemporáneas sobre planos de sección y muestras de arcilla: África pensada como laboratorio del futuro y no como reliquia del pasado.',
    provenanceNote:
      'Referencia contemporánea de estudios de arquitectura sostenible, diseño y africanfuturismo en grandes capitales africanas del siglo XXI.',
    analyticalFocus:
      'Rompe la «negación de la coetaneidad» (Johannes Fabian) y dialoga con la obra de Nnedi Okorafor, Wanuri Kahiu y la arquitectura de Francis Kéré.',
    credit: 'Archivo didáctico de fuentes · Bloque III · 05d (Apartado IV)',
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

export const MYSTERIOUS_AFRICA_TROPES: MysteriousAfricaTrope[] = [
  {
    id: 'continente-oscuro',
    num: '01',
    title: 'El «Continente Oscuro» y el «Corazón de las Tinieblas»',
    medium: 'literatura-prensa',
    mediumLabel: 'Literatura y prensa',
    visualPlateId: 'mapa-continente-oscuro',
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
    tags: ['Continente oscuro', 'Stanley', 'Conrad', 'Achebe', 'cartografía'],
  },
  {
    id: 'africa-como-pais',
    num: '02',
    title: 'África como «un solo país» homogéneo y ahistórico',
    medium: 'literatura-prensa',
    mediumLabel: 'Literatura y prensa',
    visualPlateId: 'mapa-continente-oscuro',
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
    tags: ['Homogeneización', '54 Estados', 'historia única', 'lenguas'],
  },
  {
    id: 'ciudades-perdidas-difusionismo',
    num: '03',
    title: 'Ciudades perdidas, tesoros ocultos y difusionismo externo',
    medium: 'cine-comic',
    mediumLabel: 'Cine y cómic',
    visualPlateId: 'zimbabue-arquitectura',
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
    tags: ['Haggard', 'Gran Zimbabue', 'difusionismo', 'ciudades perdidas', 'cómic'],
  },
  {
    id: 'eden-sin-humanos-safari',
    num: '04',
    title: 'La sabana atemporal y el «Edén sin ciudadanos»',
    medium: 'turismo-publicidad',
    mediumLabel: 'Turismo y publicidad',
    visualPlateId: 'safari-postal-colonial',
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
    tags: ['Safari', 'turismo', 'naturaleza', 'exotismo', 'atemporalidad'],
  },
  {
    id: 'salvador-blanco-afropesimismo',
    num: '05',
    title: 'El «salvador blanco» (White Savior) y el afropesimismo',
    medium: 'cine-comic',
    mediumLabel: 'Cine y cómic',
    visualPlateId: 'proyector-cine-colonial',
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
    tags: ['White savior', 'Tarzán', 'afropesimismo', 'Teju Cole', 'cine'],
  },
  {
    id: 'magia-brujeria-irracionalidad',
    num: '06',
    title: 'Brujería, «vudú» y el enigma de lo irracional',
    medium: 'cine-comic',
    mediumLabel: 'Cine y cómic',
    visualPlateId: 'novela-aventuras-1890',
    historicalOrigin:
      'Informes misioneros coloniales y prensa sensacionalista que tradujeron sistemas religiosos y jurídicos africanos como «fetichismo», «magia negra» o superstición peligrosa.',
    culturalMechanism:
      'Convierte rituales comunitarios, farmacopea tradicional y filosofías espirituales en espectáculo tenebroso, reduciendo la alteridad religiosa a amenaza o misterio inescrutable.',
    examples:
      'Películas de terror y aventuras sobre «maldiciones tribales», «hechiceros malignos» en tebeos clásicos y uso frívolo de la palabra «vudú» para descalificar cualquier práctica no occidental.',
    whatItErases:
      'La lógica interna, ética comunitaria y sofisticación cosmológica de tradiciones como el sistema Ifá yoruba, el bosonismo akan, el bwiti centroafricano o la causalidad social estudiada por Evans-Pritchard entre los azande.',
    counterEvidence:
      'Los documentales de 05c (*Retorno al país de las almas*, *Ibogaina*, *La hermandad de sangre de los Azande*) permiten observar estos sistemas desde la escucha etnográfica rigurosa.',
    tags: ['Cosmología', 'fetichismo', 'vudú', 'Evans-Pritchard', 'Akan'],
  },
  {
    id: 'tribalismo-conflictos-ancestrales',
    num: '07',
    title: 'La «tribu» primitiva y los «odios ancestrales»',
    medium: 'literatura-prensa',
    mediumLabel: 'Literatura y prensa',
    visualPlateId: 'prensa-ilustrada-1884',
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
    tags: ['Tribu', 'Berlín 1884', 'prensa', 'Mamdani', 'esencialismo'],
  },
  {
    id: 'espectaculo-cuerpo-exposiciones',
    num: '08',
    title: 'El espectáculo del cuerpo y las exposiciones coloniales',
    medium: 'archivo-museos',
    mediumLabel: 'Archivo colonial y museos',
    visualPlateId: 'exposicion-colonial-1900',
    historicalOrigin:
      'Exhibición de Saartjie Baartman en Londres y París (1810–1815), «aldeas negras» en Exposiciones Universales (París 1889, 1900, 1931; Barcelona; Bruselas 1958) y tarjetas postales coloniales.',
    culturalMechanism:
      'Transforma cuerpos africanos reales en objetos de curiosidad anatómica, espectáculo de feria o souvenir fotográfico, fundiendo ciencia racial decimonónica y entretenimiento de masas.',
    examples:
      '«Zoológicos humanos» visitados por millones de europeos; cromos, marcas comerciales (como el imaginario Banania analizado por Frantz Fanon) y vitrinas museográficas descontextualizadas.',
    whatItErases:
      'La biografía, dignidad, voz y derechos de las personas exhibidas, así como el saqueo patrimonial de objetos reales y sagrados (como los bronces de Benín de 1897) arrancados de su contexto.',
    counterEvidence:
      'Los estudios de Stuart Hall, Frantz Fanon (*Piel negra, máscaras blancas*, 1952) y Pascal Blanchard (*Zoos humains*), junto a los procesos actuales de restitución museográfica.',
    tags: ['Saartjie Baartman', 'exposiciones coloniales', 'Fanon', 'museos', 'restitución'],
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
    id: 'folleto-safari-turismo',
    formatLabel: 'Turismo y publicidad',
    title: 'Folleto turístico: «Regresa al origen del mundo · Safari auténtico»',
    visualPlateId: 'safari-postal-colonial',
    sampleText:
      '«Siente el latido primitivo de la sabana bajo el cielo rojo de África. Fotografía la fauna salvaje y convive con guerreros ancestrales que conservan intactas las costumbres de hace diez mil años.»',
    rhetoricalMarkers: [
      {
        phrase: 'latido primitivo / hace diez mil años',
        diagnosis: 'Arqueologización del presente: trata a ciudadanos contemporáneos como fósiles vivientes.',
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
        diagnosis: 'Arquetipo secundario sin arco propio cuya única función dramática es el crecimiento espiritual del héroe externo.',
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
    linkToModule: 'Contrasta directamente con los grabados y postales analizados en 05b.',
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
  'Blanchard, P., Bancel, N., Boëtsch, G., Deroo, É., Lemaire, S., y Forsdick, C. (Eds.). (2008). Human Zoos: Science and Spectacle in the Age of Colonial Empires. Liverpool University Press.',
  'Fabian, J. (1983). Time and the Other: How Anthropology Makes Its Object. Columbia University Press.',
  'Fanon, F. (1952). Peau noire, masques blancs. Éditions du Seuil.',
  'Hall, S. (1973). Encoding and Decoding in the Television Discourse. Centre for Contemporary Cultural Studies, University of Birmingham.',
  'Hall, S. (Ed.). (1997). Representation: Cultural Representations and Signifying Practices. Sage / Open University.',
  'Mbembe, A. (2001). On the Postcolony. University of California Press.',
  'Mudimbe, V.-Y. (1988). The Invention of Africa: Gnosis, Philosophy, and the Order of Knowledge. Indiana University Press.',
  'Ngũgĩ wa Thiong’o. (1986). Decolonising the Mind: The Politics of Language in African Literature. James Currey.',
  'Said, E. W. (1978). Orientalism. Pantheon Books.',
  'Wainaina, B. (2005). How to Write About Africa. Granta, 92, 91–95.',
];
