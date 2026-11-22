export type GalleryCategoryId =
  | 'todas'
  | 'ciencia-botica'
  | 'cartografia'
  | 'america-pacifico'
  | 'africa-vinetas'
  | 'caldero'
  | 'mirada-critica';

export type GenealogyPhaseId = 'america' | 'pacifico' | 'africa' | 'deconstruccion';

export type IconDeconstructionId = 'caldero' | 'explorador' | 'cartografia' | 'prensa-publicidad';

export type LexicalLemmaId = 'todos' | 'antropofago' | 'canibal' | 'salvaje';

export type CannibalismViewTab =
  | 'galeria'
  | 'cronologia-critica'
  | 'genealogia'
  | 'iconos'
  | 'lexico'
  | 'ciencia-mito';

export type CriticalRegionId =
  | 'todas'
  | 'nilo-cuerno'
  | 'occidental-sahel'
  | 'oriental-suajili'
  | 'austral-zimbabue'
  | 'central-congo'
  | 'panafricano';

export interface CriticalTimelineMilestone {
  id: string;
  orderIndex: number;
  regionId: Exclude<CriticalRegionId, 'todas'>;
  regionLabel: string;
  regionShort: string;
  periodLabel: string;
  axisYearLabel: string;
  synchronyTitle: string;
  synchronyThesis: string;
  myth: {
    shortLabel: string;
    source: string;
    dating: string;
    claim: string;
    ideologicalFunction: string;
    plateId: string;
  };
  archaeology: {
    shortLabel: string;
    sites: string;
    chronology: string;
    evidenceSummary: string;
    materialMarkers: string[];
    reference: string;
    bloque3Action: {
      label: string;
      sectionId: string;
      kingdomId?: 'kush' | 'aksum' | 'swahili' | 'mali' | 'zimbabwe' | 'benin';
    };
  };
}

export interface HistoricalPlate {
  id: string;
  src: string;
  accessionCode: string;
  title: string;
  source: string;
  dating: string;
  region: string;
  category: Exclude<GalleryCategoryId, 'todas'>;
  categoryLabel: string;
  phaseId?: GenealogyPhaseId;
  iconId?: IconDeconstructionId;
  visualSummary: string;
  criticalAnalysis: string;
  chartierLens: string;
}

export interface GenealogyPhase {
  id: GenealogyPhaseId;
  order: string;
  title: string;
  shortTitle: string;
  span: string;
  territories: string;
  thesis: string;
  narrative: string;
  keyMilestones: Array<{
    year: string;
    work: string;
    detail: string;
  }>;
  legitimationMechanism: string;
  plateIds: string[];
}

export interface IconDeconstruction {
  id: IconDeconstructionId;
  title: string;
  shortTitle: string;
  subtitle: string;
  europeanOrigin: string;
  visualTransformation: string;
  chartier: {
    practica: string;
    representacion: string;
    apropiacion: string;
  };
  documentedCases: string[];
  plateIds: string[];
}

export interface LexicalEntry {
  id: string;
  year: number;
  yearLabel: string;
  lemma: Exclude<LexicalLemmaId, 'todos'>;
  lemmaLabel: string;
  source: string;
  verbatimQuote: string;
  semanticShift: string;
}

export interface ScienceVsMythCase {
  id: string;
  domain: string;
  shortTitle: string;
  chronology: string;
  mythStatement: string;
  scientificEvidence: string;
  keySitesOrSources: Array<{
    name: string;
    detail: string;
  }>;
  academicTakeaway: string;
  plateIds: string[];
  crossModuleLink?: {
    label: string;
    sectionId: string;
    anthropologyView?: 'migraciones' | 'detalle';
    ethologyTab?: 'sociedad' | 'primates';
  };
}

export const GALLERY_CATEGORIES: Array<{ id: GalleryCategoryId; label: string }> = [
  { id: 'todas', label: 'Todas las láminas' },
  { id: 'ciencia-botica', label: 'Ciencia, botica y Europa' },
  { id: 'cartografia', label: 'Cartografía histórica' },
  { id: 'america-pacifico', label: 'América y Pacífico' },
  { id: 'africa-vinetas', label: 'África y viñetas' },
  { id: 'caldero', label: 'Genealogía del caldero' },
  { id: 'mirada-critica', label: 'Mirada crítica' },
];

export const HISTORICAL_PLATES: HistoricalPlate[] = [
  {
    id: 'lamina-06',
    src: '/assets/cannibalism-gallery/lamina-06.jpg',
    accessionCode: 'CAT-01 · Osteología',
    title: 'Marcas de corte y evidencia osteológica en la Prehistoria europea (Atapuerca)',
    source: 'IPHES / Universitat Rovira i Virgili (fotografía: P. Saladié)',
    dating: 'Pleistoceno Inferior – Edad del Bronce (Europa)',
    region: 'Península Ibérica / Europa',
    category: 'ciencia-botica',
    categoryLabel: 'Ciencia, botica y Europa',
    visualSummary:
      'Restos craneales y postcraneales con estrías lineales de corte lítico y fracturación antrópica documentados en yacimientos arqueológicos europeos.',
    criticalAnalysis:
      'Demuestra que la antropofagia no fue un fenómeno exclusivo de territorios extraeuropeos ni de sociedades «exóticas»: la tafonomía moderna la documenta en Gran Dolina (Atapuerca), El Sidrón, Moula-Guercy, Krapina y la Cueva de El Mirador.',
    chartierLens:
      'Práctica documentada empíricamente por la arqueología frente al discurso colonial que la borró de la propia memoria europea.',
  },
  {
    id: 'lamina-07',
    src: '/assets/cannibalism-gallery/lamina-07.jpg',
    accessionCode: 'CAT-02 · Farmacopea',
    title: 'Tarros de botica europeos: Mumia y Axungia hominis',
    source: 'Colecciones histórico-farmacéuticas europeas',
    dating: 'Edad Moderna (ss. XVI–XVIII)',
    region: 'Europa Occidental',
    category: 'ciencia-botica',
    categoryLabel: 'Ciencia, botica y Europa',
    visualSummary:
      'Albarelos y recipientes cerámicos de farmacia rotulados «MUMIA» (polvo de momia) y «AXUNG. HOMINIS» (grasa humana) utilizados como preparados medicinales.',
    criticalAnalysis:
      'Mientras cronistas y grabadores europeos estigmatizaban a poblaciones americanas, oceánicas y africanas como «caníbales», la propia farmacopea europea comercializaba y consumía derivados corporales humanos bajo el amparo de la medicina culta.',
    chartierLens:
      'Contraste entre una práctica medicinal normalizada en Europa y su criminalización simbólica al proyectarla sobre «el otro».',
  },
  {
    id: 'lamina-08',
    src: '/assets/cannibalism-gallery/lamina-08.jpg',
    accessionCode: 'CAT-03 · Manuscrito medieval',
    title: 'El Libro de las maravillas de Marco Polo (fol. 74v)',
    source: 'Bibliothèque Nationale de France, Département des manuscrits, Français 2810',
    dating: 'Inicios del s. XV (relato de finales del s. XIII)',
    region: 'Islas Andamán / Golfo de Bengala (imaginario europeo)',
    category: 'america-pacifico',
    categoryLabel: 'América y Pacífico',
    phaseId: 'america',
    visualSummary:
      'Miniatura medieval que representa a habitantes de los confines orientales en actitud antropofágica junto a figuras con rasgos de alteridad monstruosa.',
    criticalAnalysis:
      'El imaginario bajomedieval heredado de Marco Polo y Juan de Mandeville (cinocéfalos, tierras del Gran Can y pueblos devoradores en los márgenes del ecúmene) fue el filtro previo con el que Cristóbal Colón interpretó el Caribe en 1492.',
    chartierLens:
      'Representación medieval reutilizada como plantilla interpretativa al llegar a América.',
  },
  {
    id: 'lamina-09',
    src: '/assets/cannibalism-gallery/lamina-09.jpg',
    accessionCode: 'CAT-04 · Crónica medieval',
    title: 'Escena de antropofagia en la Chronica Maiora II de Mateo de París',
    source: 'Mateo de París, Chronica Maiora (Corpus Christi College, Cambridge)',
    dating: 'c. 1240–1253 (siglo XIII)',
    region: 'Europa / Próximo Oriente (Cruzadas y avance mongol)',
    category: 'ciencia-botica',
    categoryLabel: 'Ciencia, botica y Europa',
    visualSummary:
      'Ilustración marginal en tinta con guerreros asando a un cautivo en un espetón mientras otro devora una extremidad, acompañada de la leyenda «humanis carnibus vescentes».',
    criticalAnalysis:
      'Muestra el uso propagandístico temprano de la acusación de antropofagia contra enemigos militares y religiosos en la Edad Media europea, siglos antes de su fijación colonial sobre África.',
    chartierLens:
      'Representación retórica del enemigo absoluto para justificar la guerra y la deshumanización.',
  },
  {
    id: 'lamina-10',
    src: '/assets/cannibalism-gallery/lamina-10.jpg',
    accessionCode: 'CAT-05 · Hoja volante',
    title: 'Antropofagia de supervivencia durante la hambruna y peste en Lituania (1571)',
    source: 'Grabado alemán coloreado de hoja volante (s. XVI)',
    dating: '1571–1573',
    region: 'Lituania / Europa del Este',
    category: 'ciencia-botica',
    categoryLabel: 'Ciencia, botica y Europa',
    visualSummary:
      'Estampa narrativa con patíbulo, incendios y escenas de desmembramiento vinculadas a una crisis extrema de hambre y pestilencia en tierras europeas.',
    criticalAnalysis:
      'Evidencia que la propia Europa moderna conoció y difundió visualmente episodios de antropofagia por hambre, pero los categorizó como calamidad excepcional, jamás como «esencia cultural» de los europeos.',
    chartierLens:
      'Asimetría discursiva: en Europa es «crisis histórica»; en América o África se convierte en «rasgo identitario».',
  },
  {
    id: 'lamina-15',
    src: '/assets/cannibalism-gallery/lamina-15.jpg',
    accessionCode: 'CAT-06 · Cartografía XVI',
    title: 'Mapa de América (Terra Nova) en la Geographia de Ptolomeo editada por Miguel Servet',
    source: 'Miguel Servet (ed.), Geographia de Ptolomeo · Biblioteca del Museo de Valladolid (FA-42)',
    dating: 'Edición de 1541',
    region: 'América / Brasil',
    category: 'cartografia',
    categoryLabel: 'Cartografía histórica',
    phaseId: 'america',
    iconId: 'cartografia',
    visualSummary:
      'Detalle cartográfico con la inscripción «TERRA NOVA», una escena de despiece junto a un animal marsupial americano y el rótulo expreso «Antropophagi hic sunt».',
    criticalAnalysis:
      'Consolida el mecanismo cartográfico que transforma el rumor de conquista en verdad geográfica: situar «aquí hay antropófagos» sobre el mapa convierte el territorio en espacio abierto a la dominación europea.',
    chartierLens:
      'Cartografía como dispositivo de frontera y legitimación territorial (Becerra Romero, 2025).',
  },
  {
    id: 'lamina-12',
    src: '/assets/cannibalism-gallery/lamina-12.jpg',
    accessionCode: 'CAT-07 · Cartografía XVI',
    title: 'Descriptio Brasiliae: el territorio tupinambá cifrado en la antropofagia',
    source: 'Grabado cartográfico europeo de la costa de Brasil (s. XVI–XVII)',
    dating: 'Siglos XVI–XVII',
    region: 'Brasil (Tououpinambautii)',
    category: 'cartografia',
    categoryLabel: 'Cartografía histórica',
    phaseId: 'america',
    iconId: 'cartografia',
    visualSummary:
      'Mapa de la costa brasileña en cuyo interior se inserta la escena del descuartizamiento y la parrilla de madera («boucan») en el área etiquetada «Tououpinambautii».',
    criticalAnalysis:
      'Ejemplifica la máxima de Gombrich citada por Becerra Romero: las imágenes deben más a otras imágenes que a la observación directa. La parrilla de Hans Staden se incrusta directamente en la geografía para resumir todo un continente.',
    chartierLens:
      'Sinécdoque visual: un rito guerrero concreto es extrapolado como emblema total de América.',
  },
  {
    id: 'lamina-13',
    src: '/assets/cannibalism-gallery/lamina-13.jpg',
    accessionCode: 'CAT-08 · Grabado XVI',
    title: 'Hans Staden entre los tupinambás en la edición de América de Theodore de Bry',
    source: 'Theodore de Bry, Americae Tertia Pars (a partir del relato de Hans Staden)',
    dating: 'Finales del s. XVI (1592)',
    region: 'Brasil (vista desde taller europeo de Fráncfort)',
    category: 'america-pacifico',
    categoryLabel: 'América y Pacífico',
    phaseId: 'america',
    visualSummary:
      'Grabado coloreado que muestra al mercenario alemán Hans Staden (barbado y de piel clara) presenciando la preparación de un cuerpo sobre parrilla de madera por figuras indígenas.',
    criticalAnalysis:
      'Theodore de Bry jamás pisó América, pero sus planchas fijaron durante siglos el canon europeo de la «barbarie americana». Nótese que todavía aparece la parrilla de madera y no el caldero metálico del siglo XIX.',
    chartierLens:
      'Entre la realidad y el deseo: taller europeo que reelabora un testimonio para el público protestante y mercantil.',
  },
  {
    id: 'lamina-19',
    src: '/assets/cannibalism-gallery/lamina-19.jpg',
    accessionCode: 'CAT-09 · Cartel colonial',
    title: 'Male and Female Australian Cannibals (espectáculo de R. A. Cunningham)',
    source: 'Litografía promocional de R. A. Cunningham (Berlín / giras internacionales)',
    dating: 'c. 1885',
    region: 'Australia / Pacífico (exhibición en Europa y EE. UU.)',
    category: 'america-pacifico',
    categoryLabel: 'América y Pacífico',
    phaseId: 'pacifico',
    iconId: 'prensa-publicidad',
    visualSummary:
      'Cartel sensacionalista que escenifica a aborígenes australianos en torno a una hoguera y un cráneo mientras capturan a marineros europeos, acompañado de texto racista que los califica como «el orden más bajo de la humanidad».',
    criticalAnalysis:
      'Ilustra la segunda gran fase geográfica (Pacífico y Australia, ss. XVIII–XIX) y el vínculo entre espectáculos de «zoológicos humanos», racismo pseudocientífico y consumo masivo de sensacionalismo colonial.',
    chartierLens:
      'Apropiación comercial y espectacularización de la alteridad en pleno apogeo imperial.',
  },
  {
    id: 'lamina-20',
    src: '/assets/cannibalism-gallery/lamina-20.jpg',
    accessionCode: 'CAT-10 · Fotografía colonial',
    title: 'Fotografía escenificada en las Islas Fidji (finales del s. XIX)',
    source: 'Estudio fotográfico colonial del Pacífico Sur',
    dating: 'Finales del siglo XIX',
    region: 'Islas Fidji (Melanesia / Pacífico)',
    category: 'america-pacifico',
    categoryLabel: 'América y Pacífico',
    phaseId: 'pacifico',
    visualSummary:
      'Instantánea en sepia cuidadosamente posada en la que guerreros fiyianos rodean cuerpos tendidos junto a una columna de humo para simular una escena antropofágica.',
    criticalAnalysis:
      'Incluso un medio percibido como «objetivo» —la fotografía— fue empleado para fabricar postales y tarjetas estereoscópicas posadas que satisfacían las expectativas del mercado metropolitano.',
    chartierLens:
      'Puesta en escena fotográfica que confunde intencionadamente representación teatralizada con prueba documental.',
  },
  {
    id: 'lamina-28',
    src: '/assets/cannibalism-gallery/lamina-28.jpg',
    accessionCode: 'CAT-11 · Cartografía africana',
    title: 'Orbis Veteribus Notus (Jean-Baptiste B. D’Anville, 1794): Aethiopes Antropophagi',
    source: 'Jean-Baptiste Bourguignon d’Anville (ed. Londres, 1794)',
    dating: '1794',
    region: 'África Oriental / Azania / Agizymba',
    category: 'cartografia',
    categoryLabel: 'Cartografía histórica',
    phaseId: 'africa',
    iconId: 'cartografia',
    visualSummary:
      'Mapa del Mundo Antiguo con ampliación del litoral oriental africano (Azania, Menuthias/Zanzíbar) donde figura la inscripción latina «Aethiopes Antropophagi» al sur de Agizymba.',
    criticalAnalysis:
      'Marca la reactivación ilustrada de los topónimos clásicos ptolemaicos para proyectar la etiqueta de antropofagia sobre el África subsahariana en vísperas de la exploración colonial decimonónica.',
    chartierLens:
      'Herencia clásica reactivada por la cartografía ilustrada para demarcar el interior africano.',
  },
  {
    id: 'lamina-29',
    src: '/assets/cannibalism-gallery/lamina-29.jpg',
    accessionCode: 'CAT-12 · Cartografía africana',
    title: 'Mapa general de África (Clement Cruttwell, 1799): The Jages Antropophages or Men Eaters',
    source: 'Clement Cruttwell, Atlas geográfico publicado en Londres',
    dating: '1799',
    region: 'África Central y Oriental (entre Anziko y costa de Malindi/Zanzíbar)',
    category: 'cartografia',
    categoryLabel: 'Cartografía histórica',
    phaseId: 'africa',
    iconId: 'cartografia',
    visualSummary:
      'Carta continental africana con detalle ampliado de África Ecuatorial donde aparece el rótulo bilingüe «The Jages Antropophages or Men Eaters» sobre vastas regiones del interior.',
    criticalAnalysis:
      'Los «vacíos» del conocimiento geográfico europeo sobre el interior de África se rellenaban con etiquetas heredadas (como los míticos «Jagas») que presentaban el continente como territorio salvaje necesitado de intervención.',
    chartierLens:
      'El mapa llena la ignorancia cartográfica con estereotipos de violencia y barbarie.',
  },
  {
    id: 'lamina-30',
    src: '/assets/cannibalism-gallery/lamina-30.jpg',
    accessionCode: 'CAT-13 · Cartografía africana',
    title: 'Mapa general de África (Anthony Finley, 1827): «Cannibals» junto a Mozambique y Zimboo',
    source: 'Anthony Finley, Filadelfia',
    dating: '1827',
    region: 'África Austral / Mozambique / Mocaranga (Zimboo)',
    category: 'cartografia',
    categoryLabel: 'Cartografía histórica',
    phaseId: 'africa',
    iconId: 'cartografia',
    visualSummary:
      'Mapa estadounidense de África con detalle de la cuenca del Zambeze y Mozambique: junto a «Mocaranga» y «Zimboo» (referencia al Gran Zimbabue) corre en grandes letras el rótulo «Cannibals».',
    criticalAnalysis:
      'Puente directo con el Bloque III del curso: en el mismo mapa que menciona el área política de Zimbabue y las ciudades swahili (Quiloa/Kilwa), la cartografía occidental inscribe «Cannibals» como categoría étnica para deslegitimar la soberanía local.',
    chartierLens:
      'Coexistencia en un mismo documento de Estados africanos reales y etiquetas deshumanizadoras.',
  },
  {
    id: 'lamina-32',
    src: '/assets/cannibalism-gallery/lamina-32.jpg',
    accessionCode: 'CAT-14 · Cartografía XIX',
    title: 'Die Verbreitung der Anthropophagie (Dr. Fr. Umlauft, finales del s. XIX)',
    source: 'Dr. Friedrich Umlauft, Geographische Rundschau (A. Hartleben’s Verlag, Viena)',
    dating: 'Finales del siglo XIX',
    region: 'Planisferio (foco en África Central, Australia y Melanesia)',
    category: 'cartografia',
    categoryLabel: 'Cartografía histórica',
    phaseId: 'africa',
    iconId: 'cartografia',
    visualSummary:
      'Planisferio etnográfico alemán que distingue en verde áreas donde la antropofagia «existió en época histórica» (América) y en rosa áreas donde supuestamente seguía «en plena práctica» (África Central, Nueva Guinea y Australia).',
    criticalAnalysis:
      'Documento clave del desplazamiento geográfico del estereotipo: en pleno reparto colonial de África (Conferencia de Berlín), Europa aparece completamente blanca/«limpia», América pasa al pasado y África Central queda señalada en rosa como foco activo.',
    chartierLens:
      'Cartografía temática pseudocientífica al servicio de la «misión civilizadora» imperial.',
  },
  {
    id: 'lamina-45',
    src: '/assets/cannibalism-gallery/lamina-45.jpg',
    accessionCode: 'CAT-15 · Iconografía medieval',
    title: 'Origen europeo del caldero: Biblia de Holkham (c. 1327–1335) y grabado de brujas (c. 1489)',
    source: 'British Library, Add MS 47682, fol. 34r (Biblia de Holkham) y xilografía europea c. 1489',
    dating: 'c. 1327–1335 y c. 1489',
    region: 'Europa Occidental (Inglaterra / área germánica)',
    category: 'caldero',
    categoryLabel: 'Genealogía del caldero',
    iconId: 'caldero',
    visualSummary:
      'Díptico comparativo: a la izquierda, demonios cociendo condenados en un gran caldero infernal sobre las fauces del Leviatán; a la derecha, dos brujas arrojando animales a un caldero humeante.',
    criticalAnalysis:
      'Desmonta el icono más famoso de las viñetas de «caníbales africanos»: el caldero metálico donde se cuece a humanos no proviene de África ni de América, sino directamente de la iconografía europea del Infierno y la brujería bajomedieval.',
    chartierLens:
      'Migración iconográfica: un símbolo demonológico europeo se transfiere siglos después al imaginario colonial.',
  },
  {
    id: 'lamina-47',
    src: '/assets/cannibalism-gallery/lamina-47.jpg',
    accessionCode: 'CAT-16 · Sátira política',
    title: 'La marmita purificadora de los Jacobinos (Robespierre, 1793) y su eco contemporáneo',
    source: 'Caricatura contrarrevolucionaria francesa (1793) y performance satírica contemporánea',
    dating: '1793 y siglo XXI',
    region: 'Francia / Europa',
    category: 'caldero',
    categoryLabel: 'Genealogía del caldero',
    iconId: 'caldero',
    visualSummary:
      'Grabado satírico donde Robespierre remueve con una espumadera a ciudadanos dentro de una gran marmita, contrastado con una acción satírica actual de líderes mundiales con gorros de cocinero en torno a un caldero.',
    criticalAnalysis:
      'Confirma que la metáfora visual de «cocer personas en la olla» era ya un recurso consolidado de la sátira política europea a finales del siglo XVIII antes de convertirse en chiste recurrente sobre África.',
    chartierLens:
      'Reinterpretación política: la olla funciona como dispositivo transversal de crítica al poder.',
  },
  {
    id: 'lamina-49',
    src: '/assets/cannibalism-gallery/lamina-49.jpg',
    accessionCode: 'CAT-17 · Historieta XX',
    title: 'Little Nemo in Slumberland (Winsor McCay, 1907): consolidación del cliché del caldero',
    source: 'Winsor McCay, The New York Herald (página dominical)',
    dating: '1907',
    region: 'Estados Unidos (proyección sobre selva colonial genérica)',
    category: 'africa-vinetas',
    categoryLabel: 'África y viñetas',
    phaseId: 'africa',
    iconId: 'explorador',
    visualSummary:
      'Secuencia dominical en color donde personajes caricaturizados con faldellines de hojas y estética «minstrel» conducen a un visitante europeo directamente al interior de un gran caldero de hierro sobre fuego.',
    criticalAnalysis:
      'A comienzos del siglo XX la prensa y la historieta industrializan la plantilla completa: piel oscurecida con rasgos grotescos, faldellín vegetal, jefe tribal y marmita de hierro, molde que repetirán el cine animado de los años 20–30 y el tebeo europeo y latinoamericano.',
    chartierLens:
      'Fijación de un estereotipo de masas que homogeneiza África y el Pacífico en un único decorado caricaturesco.',
  },
  {
    id: 'lamina-67',
    src: '/assets/cannibalism-gallery/lamina-67.jpg',
    accessionCode: 'CAT-18 · Relativismo cultural',
    title: 'El cautivo (Jorge Zentner y Rubén Pellejero): inversión antropológica de la mirada',
    source: 'Jorge Zentner (guion) y Rubén Pellejero (dibujo), El cautivo (pág. 50 / pl. 43)',
    dating: 'Edición contemporánea (sobre el regreso de Hans Staden a Honfleur en 1555)',
    region: 'Normandía (Francia) frente a Brasil (tupinambás)',
    category: 'mirada-critica',
    categoryLabel: 'Mirada crítica',
    phaseId: 'deconstruccion',
    visualSummary:
      'Página de novela gráfica en composición especular: a izquierda y derecha del rostro de Staden se contraponen barcas normandas frente a canoas tupinambás, y familias europeas abrigadas frente a madres e hijos indígenas.',
    criticalAnalysis:
      'Cierra el recorrido con un ejercicio ejemplar de relativismo cultural: al regresar a Europa, Staden confiesa que «todo lo que me había sido familiar aparecía ante mis ojos como algo exótico, ajeno». El cómic también puede desmontar los mismos prejuicios que ayudó a difundir.',
    chartierLens:
      'Apropiación crítica y pedagógica de la viñeta para cuestionar el etnocentrismo y la construcción de «el otro».',
  },
];

export const GENEALOGY_PHASES: GenealogyPhase[] = [
  {
    id: 'america',
    order: 'Fase I',
    title: 'América y la invención cartográfica del «caníbal»',
    shortTitle: 'I · América (ss. XVI–XVII)',
    span: '1492 – s. XVII',
    territories: 'Caribe (Antillas) · Costa de Brasil (Tupinambás) · Mesoamérica',
    thesis:
      'Un malentendido lingüístico colombino y el filtro literario medieval (Marco Polo, Mandeville) dan origen al neologismo «caníbal», rápidamente fijado por mapas y grabados de taller europeos.',
    narrative:
      'En noviembre de 1492, Cristóbal Colón escucha el etnónimo caribe/caniba y lo asocia al «Gran Can» y a los seres con cabeza de perro (cinocéfalos) de la tradición clásica y medieval. En pocas décadas, cartógrafos y grabadores que en muchos casos nunca cruzaron el Atlántico —como Lorenz Fries, Sebastian Münster, Miguel Servet o Theodore de Bry— incorporan escenas de descuartizamiento y parrillas de madera («boucan») dentro de los propios mapas de América, transformando el rumor en prueba visual.',
    keyMilestones: [
      {
        year: '1492',
        work: 'Diario de a bordo (Cristóbal Colón, 23 y 26 nov.)',
        detail:
          'Primera aparición de «caniba/canima», vinculado erróneamente al Gran Can y a hombres «con hocicos de perro» comedores de carne humana.',
      },
      {
        year: '1505–1532',
        work: 'Mundus Novus (Vespucci), L. Fries (1525) y Typus Cosmographicus (Münster/Holbein, 1532)',
        detail:
          'Las primeras estampas y mapamundis populares difunden la imagen de América como tierra de antropófagos.',
      },
      {
        year: '1541',
        work: 'Geographia de Ptolomeo editada por Miguel Servet (Terra Nova)',
        detail:
          'Inscribe la advertencia «Antropophagi hic sunt» directamente sobre la cartografía de Sudamérica.',
      },
      {
        year: '1557–1592',
        work: 'Hans Staden y América de Theodore de Bry (Descriptio Brasiliae)',
        detail:
          'De Bry reelabora desde Fráncfort el cautiverio de Staden entre los tupinambás, creando el arquetipo visual renacentista del canibalismo americano.',
      },
    ],
    legitimationMechanism:
      'Descalificación jurídica y moral de los pueblos americanos para legitimar la guerra justa, la esclavización de «caribes» y la ocupación territorial.',
    plateIds: ['lamina-08', 'lamina-15', 'lamina-12', 'lamina-13'],
  },
  {
    id: 'pacifico',
    order: 'Fase II',
    title: 'Desplazamiento hacia el Pacífico y Australia',
    shortTitle: 'II · Pacífico (ss. XVIII–XIX)',
    span: 'ss. XVIII – XIX',
    territories: 'Australia · Islas Fidji · Papúa Nueva Guinea · Marquesas · Salomón · Cook',
    thesis:
      'Cuando América queda consolidada en el orden colonial europeo, el foco del imaginario «salvaje» se traslada a las nuevas fronteras oceánicas mediante espectáculos, estampas y fotografía posada.',
    narrative:
      'Los viajes ilustrados y la expansión británica y francesa en Oceanía reubican el estereotipo en las islas del Pacífico y el continente australiano. La novedad tecnológica del siglo XIX —litografía en color, estampas populares de Épinal, exposiciones de seres humanos y fotografía comercial— multiplica el impacto: estudios coloniales escenifican escenas de «canibalismo» en Fidji o comercializan tarjetas estereoscópicas («Cannibal Tom», 1906) que el público europeo consume como documento verídico.',
    keyMilestones: [
      {
        year: 's. XIX',
        work: 'Estampas populares de Épinal y relatos de náufragos en Oceanía',
        detail:
          'Popularizan el tópico del europeo capturado en islas remotas del Pacífico Sur.',
      },
      {
        year: '1885',
        work: 'Cartel «Male and Female Australian Cannibals» (R. A. Cunningham)',
        detail:
          'Promociona exhibiciones ambulantes en Europa y EE. UU. presentando a aborígenes australianos como «el orden más bajo de la humanidad».',
      },
      {
        year: 'Fin s. XIX – 1906',
        work: 'Fotografía escenificada en Islas Fidji y tarjeta estereoscópica «Cannibal Tom»',
        detail:
          'Uso deliberado de puestas en escena fotográficas para validar visualmente el prejuicio colonial ante las metrópolis.',
      },
    ],
    legitimationMechanism:
      'Jerarquización racial evolucionista (escala de «salvajismo» a «civilización») y mercantilización de lo exótico en ferias, museos y postales.',
    plateIds: ['lamina-19', 'lamina-20'],
  },
  {
    id: 'africa',
    order: 'Fase III',
    title: 'Proyección sobre África, reparto colonial y cultura de masas',
    shortTitle: 'III · África (ss. XIX–XX)',
    span: '1794 – s. XX',
    territories: 'África Oriental, Central y Austral · Prensa, cómic y cine euro-estadounidense',
    thesis:
      'Entre los mapas ilustrados de finales del XVIII y la Conferencia de Berlín, el estereotipo se desplaza masivamente a África y cristaliza en el cómic, la animación y la publicidad del siglo XX.',
    narrative:
      'Mapas europeos como los de D’Anville (1794), Cruttwell (1799) y Finley (1827) inscriben «Aethiopes Antropophagi», «Jages Men Eaters» y «Cannibals» en el interior africano (incluso junto a Zimbabue y Kilwa). A finales del siglo XIX, el planisferio de Fr. Umlauft representa ya a América como fenómeno del pasado y colorea el corazón de África como foco activo. A partir de 1900, la prensa satírica, Winsor McCay (Little Nemo, 1907), los cortometrajes animados de los años 20–30, los tebeos hispanos y latinoamericanos (TBO, Pulgarcito, Zipi y Zape, Condorito) y anuncios como Chiquita Banana (1947) reducen el continente entero a un chiste repetitivo de exploradores con salacot y ollas humeantes.',
    keyMilestones: [
      {
        year: '1794–1827',
        work: 'Mapas de D’Anville (1794), Cruttwell (1799) y Anthony Finley (1827)',
        detail:
          'Rotulan extensas zonas de África Oriental, Central y Mozambique con etiquetas explícitas de antropofagia y «Cannibals».',
      },
      {
        year: 'Fin s. XIX',
        work: 'Planisferio de Dr. Fr. Umlauft (Die Verbreitung der Anthropophagie)',
        detail:
          'Consagra cartográficamente el desplazamiento: Europa en blanco, América en pasado histórico y África Central en actividad plena.',
      },
      {
        year: '1899–1933',
        work: 'Caras y Caretas, Winsor McCay (Little Nemo, 1907), Disney/Fleischer (1925–1932)',
        detail:
          'Consolidan el arquetipo visual definitivo: faldellín de hojas, hueso en el pelo, jefe caricaturesco y caldero de hierro.',
      },
      {
        year: '1947–1970s',
        work: 'Publicidad (Chiquita Banana, 1947), cine cómico y tebeos populares',
        detail:
          'Banalizan el estereotipo como gag humorístico cotidiano, perpetuando la imagen infantilizada y deshumanizada de África.',
      },
    ],
    legitimationMechanism:
      'Justificación moral del reparto colonial de África (1884–1885) como supuesta «misión civilizadora» y borrado de los Estados, redes comerciales y saberes africanos precoloniales.',
    plateIds: ['lamina-28', 'lamina-29', 'lamina-30', 'lamina-32', 'lamina-49'],
  },
  {
    id: 'deconstruccion',
    order: 'Fase IV',
    title: 'Deconstrucción crítica y relativismo cultural en la viñeta',
    shortTitle: 'IV · Mirada crítica',
    span: 'Finales s. XX – actualidad',
    territories: 'Diálogo intercontinental (Europa · América · África)',
    thesis:
      'La propia historieta y la antropología visual contemporánea permiten invertir el espejo, revelando que lo «exótico» o «bárbaro» depende siempre del lugar desde el que se mira.',
    narrative:
      'Frente a cinco siglos de imágenes repetidas sin contraste, obras como El cautivo (de Jorge Zentner y Rubén Pellejero) releen el testimonio original de Hans Staden desde una sensibilidad antropológica moderna. Al regresar a la Normandía de 1555, Staden contempla su propia sociedad europea con extrañamiento y la compara en paralelo con la comunidad tupinambá. El recurso docente demuestra al alumnado que la viñeta no es solo vehículo de prejuicios, sino también laboratorio crítico para practicar el relativismo cultural.',
    keyMilestones: [
      {
        year: '1968–2011',
        work: 'Antropología visual e historia cultural (Gombrich, Chartier, Belting, Bartra)',
        detail:
          'Proporcionan las herramientas para analizar las imágenes como construcciones culturales articuladas en práctica, representación y apropiación.',
      },
      {
        year: 'Novela gráfica',
        work: 'El cautivo (Jorge Zentner y Rubén Pellejero)',
        detail:
          'Contrapone visualmente la Europa del s. XVI y el mundo tupinambá en viñetas especulares para desmontar el mito del salvaje.',
      },
      {
        year: 'Aula ULPGC',
        work: 'Becerra Romero (2018, 2025)',
        detail:
          'Integra el análisis de mapas, grabados, diccionarios (NTLLE) y cómics en la didáctica crítica de la historia y la antropología.',
      },
    ],
    legitimationMechanism:
      'Alfabetización visual crítica: pasar del consumo acrítico de tópicos heredados a la interrogación histórica de sus fuentes y funciones políticas.',
    plateIds: ['lamina-67', 'lamina-45', 'lamina-47'],
  },
];

export const ICON_DECONSTRUCTIONS: IconDeconstruction[] = [
  {
    id: 'caldero',
    title: 'El caldero, la olla metálica y la marmita',
    shortTitle: 'El caldero / marmita',
    subtitle: 'Del Infierno medieval europeo a la olla a presión en el cómic del siglo XX',
    europeanOrigin:
      'En los testimonios americanos del siglo XVI (Staden, De Bry) aparecían parrillas de madera («boucan») o vasijas de cerámica, nunca grandes calderos de fundición. El caldero metálico humeante proviene directamente de la iconografía europea del Infierno medieval (Biblia de Holkham, c. 1327–1335), de los grabados de aquelarres de brujas (c. 1489) y de la sátira política de la Revolución Francesa (La marmita purificadora de Robespierre, 1793).',
    visualTransformation:
      'Durante los siglos XIX y XX, ilustradores y dibujantes fusionan el caldero demonológico europeo con el escenario tropical colonial. La convención resulta tan poderosa que incluso se actualiza humorísticamente en olla a presión en revistas como Rico Tipo (1961) o Zipi y Zape.',
    chartier: {
      practica:
        'Existencia de objetos culinarios reales (cerámica, fogones, asadores) totalmente distintos del caldero de hierro fundido industrial.',
      representacion:
        'Transposición de un símbolo europeo de castigo infernal y brujería para señalar la supuesta naturaleza «demoníaca» o «primitiva» de pueblos colonizados.',
      apropiacion:
        'El público occidental adopta el caldero como taquigrafía visual instantánea del «caníbal africano», comprensible en un segundo sin necesidad de texto.',
    },
    documentedCases: [
      'Biblia de Holkham (British Library, Add MS 47682, fol. 34r, c. 1327–1335): condenados hervidos por demonios.',
      'Xilografía europea de brujas con caldero (c. 1489) e Infierno anónimo portugués (c. 1510–1520, Museo de Lisboa).',
      'Caricatura política de Robespierre (1793): «La marmita purificadora de los Jacobinos».',
      'Little Nemo (Winsor McCay, 1907), cine animado (1925–1932) y actualización irónica a olla a presión (Rico Tipo 1961, Zipi y Zape).',
    ],
    plateIds: ['lamina-45', 'lamina-47', 'lamina-49'],
  },
  {
    id: 'explorador',
    title: 'El explorador con salacot y el «jefe» con hueso y gorro de chef',
    shortTitle: 'Salacot y «jefe»',
    subtitle: 'El binomio visual «civilizado / salvaje» analizado por Roger Bartra',
    europeanOrigin:
      'Hereda la figura europea del «homo sylvestris» (hombre salvaje medieval) reformulada en el siglo XIX mediante el contraste escénico entre el colono, misionero o explorador completamente vestido (salacot, gafas, botas, cuaderno o cámara) y el habitante local representado semidesnudo.',
    visualTransformation:
      'Para reforzar el efecto cómico y la distancia jerárquica, las viñetas codifican atributos fijos: faldellín de paja u hojas, hueso atravesando el cabello o la nariz, collar de dientes, trono de cráneos y —en una paradoja satírica muy repetida— un gorro blanco de chef o manual de alta cocina francesa que ridiculiza el contraste entre «salvajismo» y «gastronomía».',
    chartier: {
      practica:
        'Encuentros coloniales asimétricos marcados por la expedición imperial, la violencia extractiva y la diversidad real de indumentarias e instituciones políticas africanas.',
      representacion:
        'Caricaturización polarizada que infantiliza a las autoridades africanas y presenta al europeo como víctima ingeniosa o portador de racionalidad.',
      apropiacion:
        'Circulación masiva en literatura infantil, tebeos (TBO, Pulgarcito, Mortadelo, Condorito) y películas cómicas (Abbott y Costello, 1949) que normalizan el prejuicio desde la infancia.',
    },
    documentedCases: [
      'Winsor McCay: Dreams of a Rarebit Fiend (1904) y Little Nemo in Slumberland (1907–1908).',
      'Animación clásica: Alice Cans the Cannibals (1925), Cannibal Capers (1930), Trader Mickey (1932) y Betty Boop (1932).',
      'Prensa y tebeo hispano-latinoamericano: Dominguín (1915), Virolet (1923), El DDT, Pulgarcito, Zipi y Zape, Patoruzú y Condorito.',
    ],
    plateIds: ['lamina-49', 'lamina-19', 'lamina-67'],
  },
  {
    id: 'cartografia',
    title: 'La cartografía como dispositivo de frontera y alteridad',
    shortTitle: 'Mapas de frontera',
    subtitle: 'Cómo una leyenda impresa convierte el prejuicio en geografía oficial',
    europeanOrigin:
      'Continúa la tradición clásica y medieval de situar pueblos monstruosos en los confines del mapa conocido («hic sunt leones», «antropophagi»). Con la imprenta del siglo XVI, el mapa adquiere aura de objetividad científica.',
    visualTransformation:
      'Del «Antropophagi hic sunt» en el Brasil de Miguel Servet (1541) y la parrilla de Descriptio Brasiliae se pasa, entre 1794 y 1827, a inscribir «Aethiopes Antropophagi» (D’Anville), «The Jages Men Eaters» (Cruttwell) y «Cannibals» junto a Mozambique y Zimbabue (Finley), culminando en el planisferio temático de Fr. Umlauft a fines del XIX.',
    chartier: {
      practica:
        'Desconocimiento europeo del interior africano y coexistencia real de reinos, ciudades portuarias y redes comerciales (Kilwa, Mocaranga/Zimbabue, Malí).',
      representacion:
        'Inscripción gráfica del «canibalismo» como atributo territorial estable en zonas que Europa ambiciona explorar o anexionar.',
      apropiacion:
        'Lectura acrítica de atlas escolares y enciclopedias decimonónicas que fijaron en la memoria colectiva el vínculo entre África y barbarie.',
    },
    documentedCases: [
      'Miguel Servet (1541), Geographia de Ptolomeo: «Antropophagi hic sunt» en Terra Nova.',
      'Descriptio Brasiliae (ss. XVI–XVII): inserción de la escena tupinambá dentro del contorno geográfico.',
      'Jean-Baptiste B. D’Anville (1794), Clement Cruttwell (1799) y Anthony Finley (1827) sobre África.',
      'Dr. Fr. Umlauft (fin s. XIX): planisferio «Die Verbreitung der Anthropophagie» en plena expansión imperial.',
    ],
    plateIds: ['lamina-15', 'lamina-12', 'lamina-28', 'lamina-29', 'lamina-30', 'lamina-32'],
  },
  {
    id: 'prensa-publicidad',
    title: 'Sátira política, prensa y mercantilización publicitaria',
    shortTitle: 'Prensa y publicidad',
    subtitle: 'Del ataque político al consumo turístico y comercial del cliché',
    europeanOrigin:
      'Aprovecha la fuerza visual instantánea del estereotipo caníbal —ya universalmente reconocible a finales del siglo XIX— para traducir conflictos políticos, denuncias antiimperialistas o mensajes comerciales.',
    visualTransformation:
      'El mismo icono cumple funciones opuestas según quién se lo apropie: puede servir para ridiculizar a políticos rivales «cocinados» en la olla (Caras y Caretas, 1899), denunciar satíricamente a las potencias europeas por «comerse los países crudos» (1906), vender plátanos (Chiquita Banana, 1947) o comercializar camisetas turísticas en las Islas Cook.',
    chartier: {
      practica:
        'Mercados editoriales de masas, agencias publicitarias modernas e industria del turismo poscolonial.',
      representacion:
        'Uso metafórico o humorístico del «caníbal» vaciado de historia real y convertido en reclamo gráfico de alto impacto.',
      apropiacion:
        'Incluso cuando se emplea con intención irónica o comercial, la repetición del tropo mantiene vigente la asociación visual colonial.',
    },
    documentedCases: [
      'Caras y Caretas (Buenos Aires, 1899): sátira política utilizando el imaginario del banquete antropófago.',
      'Caricatura crítica de 1906: inversión satírica que acusa al imperialismo de «comerse crudos» los territorios colonizados.',
      'Cartel de espectáculos etnográficos de R. A. Cunningham (1885) y publicidad de Chiquita Banana (1947).',
      'Pervivencia banalizada en recuerdos y camisetas turísticas contemporáneas (Islas Cook).',
    ],
    plateIds: ['lamina-47', 'lamina-19', 'lamina-20', 'lamina-49'],
  },
];

export const LEXICAL_ENTRIES: LexicalEntry[] = [
  {
    id: 'lex-1492',
    year: 1492,
    yearLabel: '1492',
    lemma: 'canibal',
    lemmaLabel: 'Caníbal (génesis)',
    source: 'Cristóbal Colón · Diario de a bordo (23 y 26 de noviembre)',
    verbatimQuote:
      '«Gente de Caniba o Canima […] que tenían un ojo y otros con hocicos de perros que comían los hombres […] y creía que eran del Gran Can».',
    semanticShift:
      'Nacimiento del neologismo a partir de una deformación fonética de «caribe» mezclada con las lecturas colombinas de Marco Polo y los monstruos clásicos.',
  },
  {
    id: 'lex-1611',
    year: 1611,
    yearLabel: '1611',
    lemma: 'antropofago',
    lemmaLabel: 'Antropófago',
    source: 'Sebastián de Covarrubias · Tesoro de la lengua castellana (NTLLE)',
    verbatimQuote:
      '«El que come carne humana» (término de raíz griega clásica ya consolidado; la voz «caníbal» todavía no figura en el diccionario).',
    semanticShift:
      'Durante los siglos XVI–XVIII la lexicografía castellana culta mantiene el helenismo «antropófago», mientras «caníbal» circula en crónicas y traducciones antes de entrar en la RAE.',
  },
  {
    id: 'lex-1788',
    year: 1788,
    yearLabel: '1788',
    lemma: 'salvaje',
    lemmaLabel: 'Salvaje',
    source: 'Real Academia Española · NTLLE (ed. 1788)',
    verbatimQuote:
      '«Feroz, que no está domesticado. Por alusión se dice de los hombres errantes que viven en los bosques, sin habitación reglada, leyes políticas ni religión».',
    semanticShift:
      'Fija la oposición jurídica y moral entre «civilizado» (con ley, ciudad y religión reconocibles por Europa) y «salvaje» (definido por carencia y animalidad).',
  },
  {
    id: 'lex-1825',
    year: 1825,
    yearLabel: '1825',
    lemma: 'canibal',
    lemmaLabel: 'Caníbal / Antropófago',
    source: 'Diccionarios del s. XIX · NTLLE (1825)',
    verbatimQuote:
      '«Nación antropófaga de América» · «El hombre que come carne humana».',
    semanticShift:
      'Incorporación lexicográfica explícita de «caníbal» en el siglo XIX, todavía anclada geográficamente en su origen americano.',
  },
  {
    id: 'lex-1832',
    year: 1832,
    yearLabel: '1832',
    lemma: 'canibal',
    lemmaLabel: 'Caníbal',
    source: 'Real Academia Española · NTLLE (1832)',
    verbatimQuote: '«Caribe. Antropófago».',
    semanticShift:
      'Equiparación directa y reductora entre un etnónimo concreto (caribe) y la práctica de la antropofagia.',
  },
  {
    id: 'lex-1853',
    year: 1853,
    yearLabel: '1853',
    lemma: 'canibal',
    lemmaLabel: 'Caníbal',
    source: 'Diccionario enciclopédico / NTLLE (1853)',
    verbatimQuote:
      '«Antiguo habitante antropófago de las Antillas. Fig. Cruel, feroz, desalmado».',
    semanticShift:
      'Paso clave hacia el sentido figurado moral: el término se desprende del contexto etnográfico y pasa a designar crueldad inhumana en general.',
  },
  {
    id: 'lex-1869',
    year: 1869,
    yearLabel: '1869',
    lemma: 'canibal',
    lemmaLabel: 'Caníbal',
    source: 'Real Academia Española · NTLLE (1869)',
    verbatimQuote: '«Nombre dado a los antropófagos de América».',
    semanticShift:
      'Reconoce implícitamente su carácter de exónimo («nombre dado a»), aunque mantiene el foco en el estereotipo americano.',
  },
  {
    id: 'lex-1895',
    year: 1895,
    yearLabel: '1895',
    lemma: 'canibal',
    lemmaLabel: 'Caníbal',
    source: 'Diccionario / NTLLE (1895)',
    verbatimQuote:
      '«Dícese de los antiguos caribes de las Antillas y San Vicente […] En sentido proverbial equivale a hombre cruel, feroz, inhumano».',
    semanticShift:
      'En pleno auge del imperialismo europeo, el adjetivo ya opera como estigma universal de deshumanización transferible a cualquier población colonizada.',
  },
  {
    id: 'lex-1914',
    year: 1914,
    yearLabel: '1914',
    lemma: 'antropofago',
    lemmaLabel: 'Antropofagia',
    source: 'Real Academia Española · NTLLE (1914)',
    verbatimQuote: '«Costumbre que tienen algunos salvajes de comer carne humana».',
    semanticShift:
      'Nótese el enlace lexicográfico explícito entre «antropofagia» y «salvajes», excluyendo tácitamente la prehistoria europea, la botica medicinal o las hambrunas europeas.',
  },
  {
    id: 'lex-1970',
    year: 1970,
    yearLabel: 'Hasta 1970',
    lemma: 'salvaje',
    lemmaLabel: 'Salvaje',
    source: 'Real Academia Española · NTLLE (pervivencia hasta 1970)',
    verbatimQuote:
      'Mantuvo hasta la edición de 1970 la acepción aplicada a «pueblos sin cultura».',
    semanticShift:
      'Demuestra la extraordinaria inercia institucional de los prejuicios decimonónicos: la antropología moderna había desmontado hacía décadas la noción de «pueblos sin cultura».',
  },
];

export const SCIENCE_VS_MYTH_CASES: ScienceVsMythCase[] = [
  {
    id: 'prehistoria-europea',
    domain: 'Paleoantropología y arqueología europea',
    shortTitle: 'Prehistoria europea',
    chronology: '~800.000 años – Edad del Bronce',
    mythStatement:
      'El estereotipo colonial presenta la antropofagia como rasgo exclusivo de pueblos «primitivos» extraeuropeos (América, Pacífico y África), situando a Europa en un linaje ajeno a esa práctica.',
    scientificEvidence:
      'La tafonomía y la arqueología moderna documentan marcas de descarnado, desarticulación y fractura ósea antrópica en numerosos yacimientos europeos desde el Pleistoceno Inferior hasta la Prehistoria reciente, tanto por subsistencia como en contextos rituales o de conflicto.',
    keySitesOrSources: [
      {
        name: 'Gran Dolina · Sierra de Atapuerca (España)',
        detail:
          'Homo antecessor (~800 ka): marcas de corte y procesado sistemático en restos humanos (Saladié et al., 2012).',
      },
      {
        name: 'Cueva de El Sidrón (Asturias) y Moula-Guercy (Francia)',
        detail:
          'Evidencias tafonómicas claras de antropofagia entre grupos neandertales europeos (Defleur et al., 1999; Rosas et al., 2011).',
      },
      {
        name: 'Krapina (Croacia) y Cueva de El Mirador (Atapuerca)',
        detail:
          'Documentación desde el Paleolítico Medio hasta la Edad del Bronce (Cáceres, Lozano y Saladié, 2007).',
      },
    ],
    academicTakeaway:
      'La antropofagia prehistórica está más intensamente documentada por la arqueología en Europa que en muchas regiones africanas a las que luego se colgó el estigma.',
    plateIds: ['lamina-06'],
    crossModuleLink: {
      label: 'Ver Atapuerca y El Sidrón en el Mapa Migratorio (Bloque I)',
      sectionId: 'sec-antropologia',
      anthropologyView: 'migraciones',
    },
  },
  {
    id: 'botica-europea',
    domain: 'Historia de la medicina y farmacopea europea',
    shortTitle: 'Botica europea (Mumia)',
    chronology: 'Siglos XVI – XVIII',
    mythStatement:
      'Los relatos europeos de la Edad Moderna erigían el rechazo absoluto a ingerir sustancias corporales humanas como frontera moral infranqueable entre «civilización europea» y «barbarie».',
    scientificEvidence:
      'Durante los mismos siglos en que Europa estigmatizaba a los pueblos americanos y africanos, las farmacias y farmacopeas europeas oficiales almacenaban y recetaban Mumia (restos momificados pulverizados), Axungia hominis (grasa humana), cráneo pulverizado y sangre como remedios terapéuticos.',
    keySitesOrSources: [
      {
        name: 'Mumia en boticas europeas',
        detail:
          'Comercializada durante siglos como panacea frente a hemorragias, golpes y dolencias internas; generó un intenso tráfico desde Egipto.',
      },
      {
        name: 'Axungia hominis (grasa humana)',
        detail:
          'Conservada en albarelos cerámicos rotulados en farmacias europeas para ungüentos analgésicos y reumáticos.',
      },
    ],
    academicTakeaway:
      'Lo que definía al «caníbal» en el discurso europeo no era el acto material en sí, sino quién lo practicaba y bajo qué categoría cultural se justificaba.',
    plateIds: ['lamina-07'],
  },
  {
    id: 'primatologia-africana',
    domain: 'Etología y primatología comparada',
    shortTitle: 'Primatología (Mahale y Kibale)',
    chronology: 'Estudios de campo (1982 – actualidad)',
    mythStatement:
      'Se suele confundir la conducta biológica documentada en fauna silvestre con metáforas morales o esencialismos aplicados a poblaciones humanas.',
    scientificEvidence:
      'La etología científica ha registrado episodios puntuales de infanticidio y canibalismo intraespecífico en poblaciones silvestres de chimpancés (Pan troglodytes) en reservas africanas estudiadas longitudinalmente, explicados por dinámicas ecológicas, demográficas y de competencia social, sin relación alguna con categorías morales humanas.',
    keySitesOrSources: [
      {
        name: 'Montes Mahale (Tanzania)',
        detail:
          'Observación científica de campo documentada por Norikoshi (1982) sobre conducta intraespecífica en chimpancés salvajes.',
      },
      {
        name: 'Ngogo · Parque Nacional de Kibale (Uganda)',
        detail:
          'Estudio de Sherrow y Amsler (2007) sobre agresión intergrupal y episodios documentados en comunidades de chimpancés.',
      },
    ],
    academicTakeaway:
      'Separar el análisis etológico riguroso de las proyecciones racistas decimonónicas evita confundir biología comparada con discursos coloniales.',
    plateIds: ['lamina-06'],
    crossModuleLink: {
      label: 'Contrastar con sociedades primates en Etología (Bloque II)',
      sectionId: 'etologia',
      ethologyTab: 'sociedad',
    },
  },
  {
    id: 'europa-historica',
    domain: 'Antigüedad clásica, Edad Media y crisis europeas',
    shortTitle: 'Europa histórica y mito',
    chronology: 'Antigüedad – s. XX',
    mythStatement:
      'Los mapas del siglo XIX (como el de Fr. Umlauft) dejan Europa completamente en blanco, sugiriendo que la antropofagia solo perteneció a pueblos colonizados.',
    scientificEvidence:
      'Desde la mitología griega (Crono devorando a sus hijos en la Teogonía de Hesíodo, inmortalizado por Rubens y Goya) hasta los asedios de Numancia y Calahorra, las crónicas de las Cruzadas (Mateo de París, s. XIII), las hambrunas europeas (Lituania, 1571) o tragedias modernas de supervivencia (Andes, 1972), la historia occidental está atravesada por el motivo y por episodios documentados de necesidad extrema.',
    keySitesOrSources: [
      {
        name: 'Hesíodo (Teogonía) · Rubens (1636) · Goya (1820–1823)',
        detail:
          'El mito fundacional de Saturno/Crono demuestra la centralidad simbólica de la devoración en la propia tradición cultural europea.',
      },
      {
        name: 'Asedios de Numancia y Calahorra · Chronica Maiora (s. XIII)',
        detail:
          'Fuentes clásicas y crónicas medievales documentan episodios de hambre extrema y acusaciones bélicas dentro del ámbito europeo y mediterráneo.',
      },
      {
        name: 'Hambruna y peste en Lituania (1571) y tragedias contemporáneas',
        detail:
          'Casos de antropofagia de supervivencia tratados históricamente como tragedia circunstancial, nunca como estigma racial.',
      },
    ],
    academicTakeaway:
      'Comparar cómo Europa narra sus propias crisis frente a cómo representa a América, Oceanía y África desenmascara la doble vara de medir del eurocentrismo.',
    plateIds: ['lamina-09', 'lamina-10', 'lamina-32'],
  },
];

export const CRITICAL_TIMELINE_REGIONS: Array<{ id: CriticalRegionId; label: string }> = [
  { id: 'todas', label: 'Todas las regiones africanas' },
  { id: 'nilo-cuerno', label: 'Nilo y Cuerno de África' },
  { id: 'occidental-sahel', label: 'África Occidental y Sahel' },
  { id: 'oriental-suajili', label: 'África Oriental y Suajili' },
  { id: 'austral-zimbabue', label: 'África Austral y Zimbabue' },
  { id: 'central-congo', label: 'África Central y Congo' },
  { id: 'panafricano', label: 'Panorámica panafricana' },
];

export const CRITICAL_TIMELINE_MILESTONES: CriticalTimelineMilestone[] = [
  {
    id: 'crit-occidental-sahel',
    orderIndex: 0,
    regionId: 'occidental-sahel',
    regionLabel: 'África Occidental y el Sahel',
    regionShort: 'Áfr. Occidental',
    periodLabel: 'Siglos XIV – XVII',
    axisYearLabel: '1492–1650',
    synchronyTitle: 'Invención del «caníbal» frente a Tombuctú, Jenné-Jeno y los bronces de Benín',
    synchronyThesis:
      'Mientras Europa acuña el término «caníbal» (1492) y el binomio «civilizado / salvaje» en grabados de taller, África Occidental despliega bibliotecas manuscritas, urbanismo heterárquico y la metalurgia del bronce más refinada de su tiempo.',
    myth: {
      shortLabel: 'Colón (1492) · De Bry (1592)',
      source: 'Diario de Colón (1492), Miguel Servet (1541) y taller de Theodore de Bry (1592)',
      dating: '1492 – s. XVI',
      claim:
        'Consolida el arquetipo europeo de los territorios extraeuropeos como espacio de «antropófagos» sin ley ni escritura, molde iconográfico que luego se transferirá íntegramente a África.',
      ideologicalFunction:
        'Legitima la expansión atlántica y la trata mediante la descalificación cultural de sociedades no europeas.',
      plateId: 'lamina-15',
    },
    archaeology: {
      shortLabel: 'Malí · Benín · Jenné-Jeno',
      sites: 'Tombuctú, Jenné-Jeno (Malí), Ife y Ciudad de Benín (Nigeria)',
      chronology: 'c. 250 a. C. – s. XVII d. C.',
      evidenceSummary:
        'Las excavaciones arqueológicas y el corpus manuscrito confirman siglos de urbanismo complejo, redes transaharianas, derecho islámico y fundición de bronce a la cera perdida en los palacios de Benín.',
      materialMarkers: [
        'Placas de bronce de Benín (ss. XVI–XVII) con escenas cortesanas, diplomacia y metalurgia de precisión.',
        'Manuscritos de Tombuctú (Tarikh al-Sudan) y centros docentes de Sankore.',
        'Urbanismo heterárquico de Jenné-Jeno y siderurgia temprana del Sahel y Nok.',
      ],
      reference: 'McIntosh (1999); Fauvelle (2018); Green (2019).',
      bloque3Action: {
        label: 'Contrastar en Bloque III: Reino de Benín y Malí',
        sectionId: 'sec-reinos',
        kingdomId: 'benin',
      },
    },
  },
  {
    id: 'crit-nilo-cuerno',
    orderIndex: 1,
    regionId: 'nilo-cuerno',
    regionLabel: 'Valle del Nilo y Cuerno de África',
    regionShort: 'Nilo y Cuerno',
    periodLabel: 'Herencia clásica – 1794',
    axisYearLabel: '1794',
    synchronyTitle: '«Aethiopes Antropophagi» de D’Anville frente a la profundidad monumental de Kush y Aksum',
    synchronyThesis:
      'Al reactivar en 1794 la etiqueta ptolemaica «Aethiopes Antropophagi» al sur del África oriental, la cartografía ilustrada ocultaba milenios de monarquías letradas, moneda propia y arquitectura monumental del Nilo y Etiopía.',
    myth: {
      shortLabel: 'D’Anville (1794): Aethiopes',
      source: 'Jean-Baptiste B. D’Anville, Orbis Veteribus Notus (ed. Londres, 1794)',
      dating: '1794',
      claim:
        'Inscribe el rótulo latino «Aethiopes Antropophagi» al sur de Agizymba y la costa de Azania, proyectando tópicos antiguos de monstruosidad sobre el África subsahariana.',
      ideologicalFunction:
        'Presenta el interior africano como frontera arcaica inmutable, desconectada de las civilizaciones del mar Rojo y el Nilo.',
      plateId: 'lamina-28',
    },
    archaeology: {
      shortLabel: 'Meroe (Kush) · Aksum',
      sites: 'Meroe, Napata (Sudán) · Aksum, Adulis, Lalibela y Gondar (Etiopía/Eritrea)',
      chronology: 'c. 800 a. C. – s. XVIII d. C.',
      evidenceSummary:
        'El registro arqueológico e inscripcional documenta las pirámides y hornos de hierro de Meroe (escritura meroítica), los obeliscos y monedas de oro de Aksum (escritura ge’ez) y los recintos palaciegos etíopes de época moderna.',
      materialMarkers: [
        'Acuñación monetaria soberana en oro, plata y bronce en Aksum (ss. III–VII) con leyendas en ge’ez y griego.',
        'Escorias y altos hornos siderúrgicos de Meroe y necrópolis reales de Kush.',
        'Tradición manuscrita e historiográfica etíope continua hasta los castillos de Gondar (ss. XVII–XVIII).',
      ],
      reference: 'Ehret (2002); UNESCO, Historia General de África (Vol. II).',
      bloque3Action: {
        label: 'Contrastar en Bloque III: Reino de Aksum y Kush',
        sectionId: 'sec-reinos',
        kingdomId: 'aksum',
      },
    },
  },
  {
    id: 'crit-oriental-suajili',
    orderIndex: 2,
    regionId: 'oriental-suajili',
    regionLabel: 'África Oriental y Costa Suajili',
    regionShort: 'Costa Suajili',
    periodLabel: '1794 – 1799 (ss. XI–XVIII)',
    axisYearLabel: '1799',
    synchronyTitle: '«Men Eaters» tras Melinda y Zanzíbar frente al cosmopolitismo de Kilwa y el Índico',
    synchronyThesis:
      'En el mismo mapa donde Clement Cruttwell (1799) dibuja los puertos de Malindi, Pate, Lamu y Zanzíbar, rellena su interior inmediato con el rótulo «Antropophages or Men Eaters», borrando siglos de comercio afroasiático.',
    myth: {
      shortLabel: 'Cruttwell (1799): Men Eaters',
      source: 'Clement Cruttwell, Mapa general de África (Londres, 1799)',
      dating: '1799',
      claim:
        'Rotula con letras destacadas «The Jages Antropophages or Men Eaters» tierra adentro desde la costa de Melinda y Zanzíbar, reforzando la oposición entre costa comercial y supuesto interior salvaje.',
      ideologicalFunction:
        'Sustituye la falta de exploración europea directa del interior oriental africano por una geografía del miedo.',
      plateId: 'lamina-29',
    },
    archaeology: {
      shortLabel: 'Kilwa Kisiwani · Lamu',
      sites: 'Kilwa Kisiwani (Tanzania), Lamu, Gedi, Shanga (Kenia) y Zanzíbar',
      chronology: 'ss. IX – XVIII d. C.',
      evidenceSummary:
        'Las excavaciones en la costa suajili y los estudios paleogenómicos (Brielle et al., 2023) revelan ciudades-Estado africanas en piedra de coral integradas en redes con el interior y con Arabia, India y la China Ming.',
      materialMarkers: [
        'Gran Mezquita y palacio Husuni Kubwa de Kilwa Kisiwani construidos en piedra de coral tallada.',
        'Monedas propias de cobre y plata de Kilwa halladas junto a porcelana celadón y azul-y-blanca Ming.',
        'Evidencia arqueológica y genética de vínculos continuos entre puertos suajili y rutas del interior africano.',
      ],
      reference: 'Sheriff (2010); Brielle et al. (2023, Nature).',
      bloque3Action: {
        label: 'Contrastar en Bloque III: Costa Suajili y red del Índico',
        sectionId: 'sec-reinos',
        kingdomId: 'swahili',
      },
    },
  },
  {
    id: 'crit-austral-zimbabue',
    orderIndex: 3,
    regionId: 'austral-zimbabue',
    regionLabel: 'África Austral y Meseta de Zimbabue',
    regionShort: 'Áfr. Austral',
    periodLabel: '1827 (ss. XI–XIX)',
    axisYearLabel: '1827',
    synchronyTitle: '«Cannibals» junto a «Zimboo» (Finley, 1827) frente a la arquitectura monumental del Gran Zimbabue',
    synchronyThesis:
      'El contraste más contundente del Bloque III: en 1827 Anthony Finley imprime «Cannibals» inmediatamente al lado de «Zimboo» y «Mocaranga», la región donde la arqueología documenta la mayor arquitectura lítica subsahariana.',
    myth: {
      shortLabel: 'Finley (1827): Cannibals / Zimboo',
      source: 'Anthony Finley, Mapa general de África (Filadelfia, 1827)',
      dating: '1827',
      claim:
        'Estampa el rótulo «Cannibals» atravesando Mozambique entre el río Cuama (Zambeze), «Zimboo» y «Mocaranga», normalizando el prejuicio en los atlas escolares y comerciales del siglo XIX.',
      ideologicalFunction:
        'Deslegitima las entidades políticas shona/mutapa y prepara el terreno para negar la autoría africana del Gran Zimbabue durante el periodo colonial.',
      plateId: 'lamina-30',
    },
    archaeology: {
      shortLabel: 'Gran Zimbabue · Mapungubwe',
      sites: 'Mapungubwe (Sudáfrica), Gran Zimbabue, Khami (Zimbabue) y Sofala (Mozambique)',
      chronology: 'ss. XI – XIX d. C.',
      evidenceSummary:
        'Las excavaciones estratigráficas (desde Gertrude Caton-Thompson en 1929 hasta la arqueología contemporánea) demuestran el origen estrictamente africano (shona) del Gran Zimbabue, su minería de oro y su red estatal hasta el Imperio Mutapa.',
      materialMarkers: [
        'Murallas del Gran Recinto y Torre Cónica (hasta 11 m de altura) en sillares de granito ajustados en seco sin mortero.',
        'Aves talladas en esteatita, lingotes de cobre, oro trabajado y cuentas de vidrio asiáticas en Mapungubwe y Gran Zimbabue.',
        'Continuidad política y metalúrgica en los reinos de Mutapa y Rozvi-Khami contemporáneos a los mapas europeos.',
      ],
      reference: 'Fauvelle (2018); Ehret (2002); UNESCO, Historia General de África (Vol. IV).',
      bloque3Action: {
        label: 'Contrastar en Bloque III: Gran Zimbabue',
        sectionId: 'sec-reinos',
        kingdomId: 'zimbabwe',
      },
    },
  },
  {
    id: 'crit-central-congo',
    orderIndex: 4,
    regionId: 'central-congo',
    regionLabel: 'África Central y Cuenca del Congo',
    regionShort: 'Áfr. Central',
    periodLabel: 'Finales del s. XIX (ss. XVI–XIX)',
    axisYearLabel: 'c. 1885–1895',
    synchronyTitle: 'La mancha rosa de Umlauft frente a la siderurgia bantú, Mbanza Kongo y los reinos Luba-Lunda',
    synchronyThesis:
      'En plena Conferencia de Berlín (1884–1885), el planisferio de Fr. Umlauft colorea la cuenca del Congo como foco activo de antropofagia, ocultando siglos de diplomacia, urbanismo y metalurgia centroafricana.',
    myth: {
      shortLabel: 'Umlauft (fin s. XIX): África Central',
      source: 'Dr. Friedrich Umlauft, Die Verbreitung der Anthropophagie (Viena, fin s. XIX)',
      dating: 'Finales del siglo XIX',
      claim:
        'Deja Europa completamente blanca, relega América al pasado histórico (verde) y destaca en rosa vivo el corazón de África Central como zona donde la antropofagia seguiría «en plena práctica».',
      ideologicalFunction:
        'Coincide con el reparto imperial de África Central (Estado Libre del Congo) y sirve de coartada «civilizadora» para la explotación colonial.',
      plateId: 'lamina-32',
    },
    archaeology: {
      shortLabel: 'Mbanza Kongo · Siderurgia bantú',
      sites: 'Mbanza Kongo (Angola/RDC), cuenca del río Congo, depresión de Upemba (Luba)',
      chronology: 'I milenio a. C. – s. XIX d. C.',
      evidenceSummary:
        'La arqueología de África Central documenta una metalurgia del hierro y el cobre muy temprana, necrópolis complejas de la depresión de Upemba (origen del Estado Luba), el centro urbano de Mbanza Kongo y diplomacia escrita desde 1506.',
      materialMarkers: [
        'Hornos de fundición de hierro y lingotes de cobre (cruces de Katanga) empleados como moneda regional en Upemba.',
        'Excavaciones en Mbanza Kongo (Patrimonio Mundial) y cartas diplomáticas en portugués del rey Afonso I (1506–1543).',
        'Tablas mnemotécnicas lukasa de la corte Luba y textiles de rafia de prestigio técnico.',
      ],
      reference: 'Ehret (2002); Vansina (1985); Güldemann (2018).',
      bloque3Action: {
        label: 'Contrastar en Bloque III: Hierro y expansión bantú',
        sectionId: 'sec-tecnologia',
      },
    },
  },
  {
    id: 'crit-panafricano',
    orderIndex: 5,
    regionId: 'panafricano',
    regionLabel: 'Escala Panafricana y Contraste Europeo',
    regionShort: 'Panafricano',
    periodLabel: '1900 – 1970 (y revisión actual)',
    axisYearLabel: '1907–1970',
    synchronyTitle: 'El caldero en la historieta y la RAE (hasta 1970) frente a la revolución arqueológica e historiográfica',
    synchronyThesis:
      'Mientras la cultura de masas del s. XX (Little Nemo, animación, publicidad) y el diccionario RAE («pueblos sin cultura» hasta 1970) blindaban el estereotipo, la escuela historiográfica africana y la arqueología demostraron que Europa —y no África— acumulaba la mayor evidencia osteológica prehistórica y de botica humana.',
    myth: {
      shortLabel: 'McCay (1907) · RAE (1970)',
      source: 'Winsor McCay (Little Nemo, 1907), cine colonial (1925–1949) y NTLLE/RAE (hasta 1970)',
      dating: '1907 – 1970',
      claim:
        'Homogeneiza todo el continente africano bajo la plantilla cómica del caldero de hierro (de origen medieval europeo), el hueso y la etiqueta de «pueblos sin cultura».',
      ideologicalFunction:
        'Perpetúa la infantilización de África en la cultura popular incluso durante las independencias africanas.',
      plateId: 'lamina-49',
    },
    archaeology: {
      shortLabel: 'Escuelas de Ibadán/UNESCO · Atapuerca',
      sites: 'Corpus panafricano (UNESCO) contrastado con Gran Dolina/Atapuerca, El Sidrón y boticas europeas',
      chronology: '1950 – actualidad',
      evidenceSummary:
        'La triangulación de fuentes impulsada por Ibadán, Dakar y la Historia General de África (UNESCO) restituye la historia precolonial africana, mientras la tafonomía europea (Atapuerca, El Sidrón, El Mirador) y los tarros de Mumia/Axungia desmontan la excepcionalidad moral europea.',
      materialMarkers: [
        'Historia General de África (UNESCO, vols. I–VIII) y metodología de triangulación de tradición oral, arqueología y lingüística.',
        'Evidencia osteológica europea de antropofagia en Gran Dolina (~800 ka), El Sidrón y El Mirador (Saladié et al., 2012).',
        'Tarros de botica europeos Mumia y Axungia hominis (ss. XVI–XVIII) y relectura crítica en El cautivo.',
      ],
      reference: 'UNESCO (1982–1993); Saladié et al. (2012); Becerra Romero (2018, 2025).',
      bloque3Action: {
        label: 'Contrastar en Bloque III: Triangulación historiográfica',
        sectionId: 'sec-historiografia',
      },
    },
  },
];

