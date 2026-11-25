export type VisualAnthropologyTabId = 'filmografia' | 'archivo-vivo' | 'autores-muestras';

export type AfricanVisualRegionId =
  | 'todas'
  | 'magreb-sahara'
  | 'africa-occidental'
  | 'africa-central-oriental'
  | 'diaspora-fronteras';

export type AfricanVisualThemeId =
  | 'todos'
  | 'ritual-cosmologia'
  | 'patrimonio-oralidad'
  | 'etnoficcion-cine'
  | 'fronteras-memoria';

export interface AfricanFilmEntry {
  id: string;
  wpId: number;
  title: string;
  director: string;
  year: number;
  duration: string;
  country: string;
  region: Exclude<AfricanVisualRegionId, 'todas'>;
  regionLabel: string;
  theme: Exclude<AfricanVisualThemeId, 'todos'>;
  themeLabel: string;
  peoplesAndContext: string;
  methodology: string;
  summary: string;
  ulpgcConnection: string;
  tags: string[];
  portalUrl: string;
  streamUrl?: string;
  institution?: string;
}

export interface PortalProfileOrCycle {
  id: string;
  kind: 'Festival' | 'Muestra' | 'Jornada' | 'Perfil de autoría';
  title: string;
  subtitle: string;
  locationAndYear: string;
  description: string;
  portalUrl: string;
}

export interface VisualMethodAxis {
  num: string;
  title: string;
  concept: string;
  africaApplication: string;
  keyFilms: string;
}

export interface LiveArchivePreset {
  id: string;
  label: string;
  description: string;
  queryType: 'tag' | 'search';
  queryValue: string;
  portalFallbackUrl: string;
}

export const ANTROPOLOGIA_VISUAL_PORTAL = {
  name: 'AntropologiaVisual.net',
  url: 'https://antropologiavisual.net/',
  africaArchiveUrl: 'https://antropologiavisual.net/archivo/africa/',
  documentalesUrl: 'https://antropologiavisual.net/fondo/documental/',
  apiBaseUrl: 'https://antropologiavisual.net/wp-json/wp/v2',
  africaTagId: 81,
  foundedYear: 2005,
  tagline: 'Archivo de cine y audiovisual etnográfico producido desde la perspectiva de la antropología',
} as const;

export const VISUAL_REGIONS: Array<{ id: AfricanVisualRegionId; label: string }> = [
  { id: 'todas', label: 'Todas las regiones' },
  { id: 'magreb-sahara', label: 'Magreb y Sáhara' },
  { id: 'africa-occidental', label: 'África Occidental' },
  { id: 'africa-central-oriental', label: 'África Central y Oriental' },
  { id: 'diaspora-fronteras', label: 'Diáspora y Fronteras' },
];

export const VISUAL_THEMES: Array<{ id: AfricanVisualThemeId; label: string }> = [
  { id: 'todos', label: 'Todos los ejes' },
  { id: 'ritual-cosmologia', label: 'Ritual y cosmología' },
  { id: 'patrimonio-oralidad', label: 'Patrimonio y oralidad' },
  { id: 'etnoficcion-cine', label: 'Etnoficción y cine' },
  { id: 'fronteras-memoria', label: 'Fronteras, memoria y diáspora' },
];

export const AFRICAN_VISUAL_FILMS: AfricanFilmEntry[] = [
  {
    id: 'wodaabe-herdsmen-of-the-sun',
    wpId: 3530,
    title: 'Wodaabe: Herdsmen of the sun',
    director: 'Werner Herzog',
    year: 1989,
    duration: '52 min',
    country: 'Níger · Sahel (Chad, Camerún, Nigeria)',
    region: 'magreb-sahara',
    regionLabel: 'Magreb y Sáhara',
    theme: 'ritual-cosmologia',
    themeLabel: 'Ritual y cosmología',
    peoplesAndContext: 'Pastores nómadas Wodaabe (subgrupo Fulani / Bororo) del Sahel',
    methodology: 'Documental de observación poética sobre estética corporal y ritualidad nómada',
    summary:
      'Explora los rituales sociales y las celebraciones colectivas de los pastores nómadas Wodaabe al sur del Sáhara, con especial atención al Gerewol, un elaborado certamen masculino de canto, danza y estética facial en el que las mujeres eligen pareja.',
    ulpgcConnection:
      'Contrasta la complejidad simbólica y las normas de parentesco del pastoralismo saheliano frente a las miradas exotizantes analizadas en 05b.',
    tags: ['Wodaabe', 'Fulani', 'Gerewol', 'Níger', 'Sáhara', 'nómada', 'ritual'],
    portalUrl: 'https://antropologiavisual.net/documental/wodaabe-herdsmen-of-the-sun/',
    streamUrl: 'https://antropologiavisual.net/wp-content/uploads/Herdsmen-of-the-sun.mp4',
  },
  {
    id: 'shooting-freetown',
    wpId: 843,
    title: 'Shooting Freetown',
    director: 'Kieran Hanson',
    year: 2011,
    duration: '29 min',
    country: 'Sierra Leona (Freetown)',
    region: 'africa-occidental',
    regionLabel: 'África Occidental',
    theme: 'etnoficcion-cine',
    themeLabel: 'Etnoficción y cine',
    peoplesAndContext: 'Juventud urbana de Freetown en la posguerra de Sierra Leona',
    methodology: 'Etnoficción participativa inspirada en la antropología compartida de Jean Rouch',
    summary:
      'Una década después de la guerra civil en Sierra Leona, tres jóvenes construyen su propio relato mediante el cine y la música en Freetown. Siguiendo la estela de Jean Rouch, la cámara deja de observar desde fuera para convertirse en herramienta de agencia creativa.',
    ulpgcConnection:
      'Ejemplifica el giro metodológico de la antropología visual africana contemporánea: pasar de ser objeto filmado a sujeto autor de su propia representación.',
    tags: ['Sierra Leona', 'Freetown', 'etnoficción', 'Jean Rouch', 'posguerra', 'creatividad'],
    portalUrl: 'https://antropologiavisual.net/documental/shooting-freetown/',
    streamUrl: 'https://antropologiavisual.net/wp-content/uploads/Shooting-Freetown.mp4',
  },
  {
    id: 'hermandad-sangre-azande',
    wpId: 690,
    title: 'La hermandad de sangre de los Azande',
    director: 'Marcelo Domizi',
    year: 2009,
    duration: '14 min',
    country: 'Sudán del Sur (Morobo)',
    region: 'africa-central-oriental',
    regionLabel: 'África Central y Oriental',
    theme: 'ritual-cosmologia',
    themeLabel: 'Ritual y cosmología',
    peoplesAndContext: 'Comunidad Azande de Morobo; diálogo con la etnografía de E. E. Evans-Pritchard (1932)',
    methodology: 'Ficción etnográfica filmada en aldea Azande a partir de fuentes antropológicas clásicas',
    summary:
      'Interpretación audiovisual del pacto de hermandad de sangre entre los Azande, una alianza formalizada mediante ritual que establece obligaciones de reciprocidad, protección y justicia social mucho más allá de los vínculos de linaje.',
    ulpgcConnection:
      'Permite releer el archivo clásico de la antropología británica (Evans-Pritchard) y debatir cómo la reconstrucción fílmica traduce instituciones políticas y rituales africanas.',
    tags: ['Africa', 'Azande', 'Sudán', 'ritual', 'Evans-Pritchard'],
    portalUrl: 'https://antropologiavisual.net/documental/la-hermandad-de-sangre-de-los-azande/',
    streamUrl:
      'https://antropologiavisual.net/wp-content/uploads/La-hermandad-de-sangre-de-los-Azande.mp4',
  },
  {
    id: 'retorno-pais-almas',
    wpId: 481,
    title: 'Retorno al país de las almas',
    director: 'Jordi Esteva',
    year: 2009,
    duration: '70 min',
    country: 'Costa de Marfil (sureste)',
    region: 'africa-occidental',
    regionLabel: 'África Occidental',
    theme: 'ritual-cosmologia',
    themeLabel: 'Ritual y cosmología',
    peoplesAndContext: 'Comunidades Akan, sacerdotes komián, animismo y pensamiento de Jean-Marie Adiaffi',
    methodology: 'Ensayo documental fotográfico-cinematográfico en blanco y negro y escucha etnográfica',
    summary:
      'Retrata la vitalidad y resistencia del bosonismo y las creencias animistas en el sureste de Costa de Marfil a través de los sacerdotes komián, mediadores con los espíritus de los bosques y las aguas, dialogando con el legado intelectual marfileño de Jean-Marie Adiaffi.',
    ulpgcConnection:
      'Conecta la cosmovisión del África Occidental atlántica (región Akan) con los debates sobre patrimonio inmaterial, memoria y modernidades africanas del Bloque III.',
    tags: ['Africa', 'Akan', 'Côte d’Ivoire', 'animismo', 'bosonismo', 'komián', 'Jordi Esteva'],
    portalUrl: 'https://antropologiavisual.net/documental/retorno-al-pais-de-las-almas/',
  },
  {
    id: 'greniers-falaise-aoujgal',
    wpId: 343,
    title: 'Les greniers de Falaise d’Aoujgal',
    director: 'Jean-Paul Cheylan y Liliane Dumont',
    year: 2010,
    duration: '33 min',
    country: 'Marruecos (Alto Atlas)',
    region: 'magreb-sahara',
    regionLabel: 'Magreb y Sáhara',
    theme: 'patrimonio-oralidad',
    themeLabel: 'Patrimonio y oralidad',
    peoplesAndContext: 'Tribus amazighes / bereberes trashumantes del Alto Atlas marroquí',
    methodology: 'Documental etnográfico-geográfico universitario sobre arquitectura vernácula y gestión común',
    summary:
      'Documenta los graneros colectivos fortificados (igoudar) suspendidos a media altura en los acantilados de Aoujgal, utilizados durante siglos por comunidades trashumantes para resguardar cosechas, escrituras, bienes comunitarios y pactos sociales.',
    ulpgcConnection:
      'Se enlaza directamente con el estudio de tecnologías de almacenamiento, comercio transahariano y gobernanza comunal africana en los módulos 02 y 04.',
    tags: ['Africa', 'Magreb', 'Marruecos', 'Atlas', 'bereber', 'agricultura', 'patrimonio'],
    portalUrl: 'https://antropologiavisual.net/documental/greniers-daoujgal/',
    streamUrl: 'https://antropologiavisual.net/wp-content/uploads/Les-greniers-de-Falaise-dAoujgal.mp4',
    institution: 'Université d’Avignon',
  },
  {
    id: 'memorias-lomos-asno',
    wpId: 270,
    title: 'Memorias a lomos de un asno',
    director: 'Romain Simenel',
    year: 2008,
    duration: '28 min',
    country: 'Marruecos (Sidi Ifni)',
    region: 'magreb-sahara',
    regionLabel: 'Magreb y Sáhara',
    theme: 'patrimonio-oralidad',
    themeLabel: 'Patrimonio y oralidad',
    peoplesAndContext: 'Antiguos caravaneros de la costa atlántica marroquí, moussem y zocos de Sidi Ifni',
    methodology: 'Etnografía itinerante en cámara acompañando la transmisión oral intergeneracional',
    summary:
      'Acompañado por un joven de su aldea y un etnólogo, el anciano Mbark —antiguo caravanero— recorre a lomos de su asno el camino montañoso hacia el moussem (fiesta anual) y zoco del mausoleo de un santo en Sidi Ifni, narrando la historia inscrita en el paisaje.',
    ulpgcConnection:
      'Ilustra la metodología de historia oral y memoria del territorio de Jan Vansina trabajada en el módulo 05 (Historiografía africana).',
    tags: ['Marruecos', 'Sidi Ifni', 'historia', 'mausoleo', 'zoco', 'oralidad', 'Romain Simenel'],
    portalUrl: 'https://antropologiavisual.net/documental/memorias-a-lomos-de-un-asno/',
    streamUrl:
      'https://antropologiavisual.net/wp-content/uploads/Memorias-a-lomos-de-un-asno-2008-Romain-Simenel.mp4',
    institution: 'Université Paris 10',
  },
  {
    id: 'ibogaina-ritos-paso',
    wpId: 28,
    title: 'Ibogaina. Ritos de paso',
    director: 'Ben de Loenen',
    year: 2004,
    duration: '33 min',
    country: 'Gabón y Camerún',
    region: 'africa-central-oriental',
    regionLabel: 'África Central y Oriental',
    theme: 'ritual-cosmologia',
    themeLabel: 'Ritual y cosmología',
    peoplesAndContext: 'Pueblos Mitsogo (Gabón central) y Fang (norte de Gabón y Camerún); tradición Bwiti',
    methodology: 'Documental etnobotánico y antropológico sobre rituales iniciáticos y farmacopea ecuatorial',
    summary:
      'Analiza el uso tradicional de la corteza de Tabernanthe iboga dentro del ritual iniciático Bwiti de los bosques ecuatoriales centroafricanos, contrastando su sentido comunitario y terapéutico local con su apropiación biomédica occidental.',
    ulpgcConnection:
      'Tiende un puente directo entre el Bloque II (etnobotánica y saberes ecológicos africanos) y el Bloque III (sistemas rituales y apropiación epistemológica).',
    tags: ['Africa', 'Gabón', 'bwiti', 'fang', 'mitsogo', 'ibogaína'],
    portalUrl: 'https://antropologiavisual.net/documental/ibogaine-rites-of-passage/',
    streamUrl:
      'https://antropologiavisual.net/wp-content/uploads/Ibogaine-Rites-of-passage-2004-Ben-de-Loenen.mp4',
  },
  {
    id: 'djema-el-fna',
    wpId: 72,
    title: 'Djema el Fna. Los lenguajes del ágora',
    director: 'Juan Serrano y Ruth Castillo',
    year: 2005,
    duration: '23 min',
    country: 'Marruecos (Marrakech)',
    region: 'magreb-sahara',
    regionLabel: 'Magreb y Sáhara',
    theme: 'patrimonio-oralidad',
    themeLabel: 'Patrimonio y oralidad',
    peoplesAndContext: 'Narradores orales, músicos, mercados y espacio público patrimonial de Marrakech',
    methodology: 'Etnografía audiovisual del espacio público, la oralidad juglaresca y la sensorialidad urbana',
    summary:
      'Retrata la plaza de Jemaa el-Fna en Marrakech —declarada Patrimonio Oral e Inmaterial de la Humanidad— como un ágora viva donde confluyen cuentacuentos, tradiciones bereberes y árabes, gastronomía callejera y economía popular.',
    ulpgcConnection:
      'Complementa la sección de urbanismo africano y oralidad como archivo histórico vivo en el norte de África.',
    tags: ['Africa', 'Marruecos', 'Marrakech', 'bereber', 'mercado', 'oralidad'],
    portalUrl: 'https://antropologiavisual.net/documental/djema-el-fna-los-lenguajes-del-agora/',
    streamUrl:
      'https://antropologiavisual.net/wp-content/uploads/Djema-el-Fna.-Los-lenguajes-del-agora-2005-Juan-Serrano.mp4',
    institution: 'Universidad de Granada',
  },
  {
    id: 'dos-cuadernos-por-nino',
    wpId: 74,
    title: 'Dos cuadernos por niño',
    director: 'Miguel Ángel Baixauli',
    year: 2005,
    duration: '20 min',
    country: 'Senegal (periferia de Dakar)',
    region: 'africa-occidental',
    regionLabel: 'África Occidental',
    theme: 'etnoficcion-cine',
    themeLabel: 'Etnoficción y cine',
    peoplesAndContext: 'Escuelas primarias periféricas de Dakar, infancia y vida cotidiana escolar',
    methodology: 'Etnoficción mínima articulada sobre registro documental descriptivo y testado pedagógico',
    summary:
      'Aproximación descriptiva a los ritmos, códigos y precariedades materiales de dos pequeños colegios en los alrededores de Dakar, utilizando un ligero hilo narrativo para dar protagonismo al alumnado sin recurrir al paternalismo visual.',
    ulpgcConnection:
      'Herramienta didáctica ideal para debatir cómo filmar la infancia y la educación africana lejos del estereotipo asistencialista.',
    tags: ['Africa', 'Senegal', 'Dakar', 'educación', 'escuela', 'etnoficción'],
    portalUrl: 'https://antropologiavisual.net/documental/deux-cahiers-par-enfant/',
    streamUrl: 'https://antropologiavisual.net/wp-content/uploads/Deux-cahiers-par-enfant-2005.mp4',
  },
  {
    id: 'tabanca-guinea-bissau',
    wpId: 41,
    title: 'Tabanca',
    director: 'Ana Medeira y Juan A. Herrero Díez',
    year: 2005,
    duration: '28 min',
    country: 'Guinea-Bisáu · Diáspora en Barcelona',
    region: 'diaspora-fronteras',
    regionLabel: 'Diáspora y Fronteras',
    theme: 'fronteras-memoria',
    themeLabel: 'Fronteras, memoria y diáspora',
    peoplesAndContext: 'Memoria de la independencia de Guinea-Bisáu (1975) y comunidad guineana en Cataluña',
    methodology: 'Documental coral en cinco episodios sobre redes comunitarias transnacionales',
    summary:
      'Partiendo del legado de la guerra anticolonial contra Portugal cerrada en 1975, el film se divide en cinco piezas que dan voz a la comunidad de Guinea-Bisáu residente en Barcelona, mostrando vínculos familiares, identidad y memoria atlántica.',
    ulpgcConnection:
      'Conecta las independencias africanas con la antropología de las migraciones y la presencia africana contemporánea en España.',
    tags: ['Africa', 'Guinea Bissau', 'comunidad', 'guerra', 'inmigración'],
    portalUrl: 'https://antropologiavisual.net/documental/tabanca/',
    streamUrl: 'https://antropologiavisual.net/wp-content/uploads/Tabanca.mp4',
  },
  {
    id: 'la-foret-benyounes',
    wpId: 43,
    title: 'La forêt',
    director: 'Alex Muñoz',
    year: 2005,
    duration: '33 min',
    country: 'Marruecos · Frontera de Ceuta (Bosque de Benyounes)',
    region: 'diaspora-fronteras',
    regionLabel: 'Diáspora y Fronteras',
    theme: 'fronteras-memoria',
    themeLabel: 'Fronteras, memoria y diáspora',
    peoplesAndContext: 'Campamentos autoorganizados de migrantes del África subsahariana en la frontera sur europea',
    methodology: 'Etnografía visual comprometida en territorio fronterizo y derechos humanos',
    summary:
      'Documenta la organización social, la supervivencia cotidiana y la espera en el bosque de Benyounes —«la forêt» para sus habitantes—, última etapa de rutas transaharianas hacia Europa junto a la valla de Ceuta.',
    ulpgcConnection:
      'Aporta contexto audiovisual directo sobre las fronteras afro-europeas contemporáneas (pertinente para el estudio desde Canarias / ULPGC).',
    tags: ['Africa', 'Marruecos', 'frontera', 'inmigración', 'derechos humanos', 'territorio'],
    portalUrl: 'https://antropologiavisual.net/documental/la-foret/',
    streamUrl: 'https://antropologiavisual.net/wp-content/uploads/La-Foret-2005-La-Foret.mp4',
  },
  {
    id: 'gurumbe-memoria-negra',
    wpId: 3421,
    title: 'Gurumbé. Canciones de tu memoria negra',
    director: 'Miguel Ángel Rosales',
    year: 2016,
    duration: 'Tráiler (largometraje 72 min)',
    country: 'Diáspora africana en Andalucía (ss. XV–XIX)',
    region: 'diaspora-fronteras',
    regionLabel: 'Diáspora y Fronteras',
    theme: 'fronteras-memoria',
    themeLabel: 'Fronteras, memoria y diáspora',
    peoplesAndContext: 'Población negroafricana en la España moderna, trata atlántica y raíces africanas del flamenco',
    methodology: 'Documental histórico-etnomusicológico y memoria afroibérica',
    summary:
      'Recupera la historia silenciada de miles de personas africanas esclavizadas y libres que habitaron Andalucía entre los siglos XV y XIX, rastreando su impronta decisiva en la música, el fandango, las danzas y la cultura popular ibérica.',
    ulpgcConnection:
      'Resuena directamente con el módulo 05b (construcción de imaginarios raciales en la Edad Moderna) y con la historia atlántica afroibérica y canaria.',
    tags: ['Andalucía', 'esclavitud', 'flamenco', 'música', 'racismo', 'Miguel Ángel Rosales'],
    portalUrl: 'https://antropologiavisual.net/documental/gurumbe/',
    streamUrl: 'https://antropologiavisual.net/wp-content/uploads/Gurumbe-la-musica-olvidada.mp4',
  },
  {
    id: 'genocidio-ruanda-ub',
    wpId: 86,
    title: 'Genocidio. Preguntas sin respuestas',
    director: 'Isidor Fernàndez',
    year: 2005,
    duration: '20 min',
    country: 'Ruanda · Perspectiva comparada (Guatemala, Argentina)',
    region: 'africa-central-oriental',
    regionLabel: 'África Central y Oriental',
    theme: 'fronteras-memoria',
    themeLabel: 'Fronteras, memoria y diáspora',
    peoplesAndContext: 'Ensayo académico sobre el genocidio de Ruanda y categorías jurídicas y antropológicas',
    methodology: 'Ensayo audiovisual universitario de entrevistas comparadas (Dpto. Antropología Cultural e Historia de América y África, UB)',
    summary:
      'Producido en el Departamento de Antropología Cultural e Historia de América y África de la Universitat de Barcelona (dir. Dr. Joan Frigolé), contrasta testimonios y marcos analíticos sobre la memoria y definición del genocidio, incluyendo el caso ruandés.',
    ulpgcConnection:
      'Muestra cómo el ensayo audiovisual universitario se integra en la docencia de Antropología e Historia de África.',
    tags: ['Ruanda', 'genocidio', 'Universitat de Barcelona', 'Isidor Fernàndez', 'memoria'],
    portalUrl: 'https://antropologiavisual.net/documental/genocidio-preguntas-sin-respuestas/',
    streamUrl: 'https://antropologiavisual.net/wp-content/uploads/Genocidio-2005-Isidor-Fernàndez.mp4',
    institution: 'Universitat de Barcelona',
  },
];

export const PORTAL_PROFILES_AND_CYCLES: PortalProfileOrCycle[] = [
  {
    id: 'festival-jean-rouch',
    kind: 'Festival',
    title: 'Festival International Jean Rouch',
    subtitle: 'Referente europeo de cine documental en ciencias sociales',
    locationAndYear: 'París · Fundado en 1982 por Jean Rouch',
    description:
      'Fundado por el antropólogo y cineasta Jean Rouch (1917–2004), cuya obra en Níger, Ghana y Malí transformó el cine etnográfico hacia la antropología compartida y la etnoficción colaborativa con cineastas africanos.',
    portalUrl: 'https://antropologiavisual.net/festival/festival-international-jean-rouch/',
  },
  {
    id: 'maam-afrika-mirada-diferente',
    kind: 'Muestra',
    title: 'IV Muestra de Antropología Audiovisual de Madrid (MAAM)',
    subtitle: 'Ciclo «Afrika, una mirada diferente» · Instituto Madrileño de Antropología',
    locationAndYear: 'Madrid · Octubre 2017',
    description:
      'Programación monográfica dedicada a desmontar visiones monolíticas sobre África a través de proyecciones y coloquios con cineastas, incluyendo «Gurumbé» (España) y «L’Eau sacrée» (Ruanda/Bélgica).',
    portalUrl:
      'https://antropologiavisual.net/noticias/iv-muestra-de-antropologia-audiovisual-de-madrid/',
  },
  {
    id: 'jornada-africa-lleida',
    kind: 'Jornada',
    title: '«África como nunca la has visto»',
    subtitle: 'Universitat de Lleida · Deconstrucción de estereotipos contemporáneos',
    locationAndYear: 'Lleida · Octubre 2015',
    description:
      'Jornada universitaria orientada a romper prejuicios mediáticos sobre el continente africano mediante testimonios directos sobre innovación tecnológica, ciencia, cultura y sociedad africana actual.',
    portalUrl: 'https://antropologiavisual.net/noticias/africa-como-nunca-la-has-visto/',
  },
  {
    id: 'perfil-jordi-esteva',
    kind: 'Perfil de autoría',
    title: 'Jordi Esteva',
    subtitle: 'Escritor, fotógrafo y documentalista de culturas africanas y orientales',
    locationAndYear: 'España · Egipto · Costa de Marfil',
    description:
      'Autor de «Retorno al país de las almas» y antiguo redactor en Radio Cairo Internacional durante cinco años. Su archivo fotográfico y fílmico explora el animismo, los oasis egipcios y la memoria del África Occidental.',
    portalUrl: 'https://antropologiavisual.net/nombres/jordi-esteva/',
  },
  {
    id: 'perfil-miguel-angel-rosales',
    kind: 'Perfil de autoría',
    title: 'Miguel Ángel Rosales',
    subtitle: 'Antropólogo visual y director de «Gurumbé»',
    locationAndYear: 'España · UNED / Universitat de Barcelona',
    description:
      'Cineasta y antropólogo especializado en patrimonio inmaterial, diásporas atlánticas y memoria afroandaluza. Su investigación audiovisual vincula archivo histórico, etnomusicología y crítica del racismo.',
    portalUrl: 'https://antropologiavisual.net/nombres/miguel-angel-rosales/',
  },
  {
    id: 'perfil-jorgelina-barrera',
    kind: 'Perfil de autoría',
    title: 'Jorgelina Barrera',
    subtitle: 'Investigadora audiovisual y codirectora del FICAA',
    locationAndYear: 'Argentina · Observatorio Sur / UBA',
    description:
      'Doctora en Ciencias Sociales (UBA) y codirectora del Festival Internacional de Cine Africano de Argentina (FICAA), ejemplo de circulación Sur-Sur del cine africano y afrodescendiente.',
    portalUrl: 'https://antropologiavisual.net/nombres/jorgelina-barrera/',
  },
];

export const VISUAL_METHODOLOGY_AXES: VisualMethodAxis[] = [
  {
    num: '01',
    title: 'De la mirada colonial a la antropología compartida',
    concept:
      'El cine colonial africano cosificaba a las poblaciones como especímenes inmóviles; la antropología compartida (Jean Rouch) exige devolver las imágenes a la comunidad filmada y construir el sentido en diálogo.',
    africaApplication:
      'Al analizar cualquier pieza sobre África conviene preguntar quién sostiene la cámara, en qué lengua se negocia el montaje y si los protagonistas intervienen en la interpretación.',
    keyFilms: 'Shooting Freetown (2011) · Festival International Jean Rouch',
  },
  {
    num: '02',
    title: 'Etnoficción y agencia narrativa africana',
    concept:
      'Combina investigación etnográfica rigurosa con una mínima puesta en escena colaborativa para mostrar realidades sociales sin reducir a las personas a víctimas pasivas.',
    africaApplication:
      'Frente a los marcos de «afropesimismo» en prensa y ONG, la etnoficción permite visibilizar humor, conflictos cotidianos, aspiraciones educativas y creatividad urbana en Dakar o Freetown.',
    keyFilms: 'Dos cuadernos por niño (2005) · Shooting Freetown (2011)',
  },
  {
    num: '03',
    title: 'Imagen en movimiento como archivo de oralidad y paisaje',
    concept:
      'La cámara registra gestos, cadencias vocales, arquitectura comunitaria y recorridos espaciales que el documento escrito suele omitir.',
    africaApplication:
      'En el Magreb y África Occidental, los documentales sobre plazas, zocos, graneros fortificados y rituales funcionan como complemento directo a la tradición oral estudiada en Historiografía.',
    keyFilms: 'Memorias a lomos de un asno (2008) · Les greniers de Falaise d’Aoujgal (2010) · Djema el Fna (2005)',
  },
  {
    num: '04',
    title: 'Fronteras, diáspora y memoria afroibérica',
    concept:
      'África no termina en sus límites geográficos: la antropología visual rastrea tanto las fronteras contemporáneas como la presencia histórica africana en Europa y América.',
    africaApplication:
      'Permite conectar la historia precolonial del Módulo I con las rutas fronterizas actuales en el eje Marruecos–Canarias–Península y con la memoria negra en España.',
    keyFilms: 'La forêt (2005) · Tabanca (2005) · Gurumbé (2016)',
  },
];

export const LIVE_ARCHIVE_PRESETS: LiveArchivePreset[] = [
  {
    id: 'tag-africa',
    label: 'Etiqueta oficial: África',
    description: 'Registros clasificados directamente bajo /archivo/africa/ en AntropologiaVisual.net.',
    queryType: 'tag',
    queryValue: String(ANTROPOLOGIA_VISUAL_PORTAL.africaTagId),
    portalFallbackUrl: 'https://antropologiavisual.net/archivo/africa/',
  },
  {
    id: 'marruecos-magreb',
    label: 'Marruecos y Magreb',
    description: 'Atlas, Sidi Ifni, Marrakech y campamentos fronterizos del norte de África.',
    queryType: 'search',
    queryValue: 'Marruecos',
    portalFallbackUrl: 'https://antropologiavisual.net/?s=Marruecos',
  },
  {
    id: 'jean-rouch',
    label: 'Jean Rouch y etnoficción',
    description: 'Festival Jean Rouch, Sierra Leona, Senegal y genealogía del cine etnográfico.',
    queryType: 'search',
    queryValue: 'Jean Rouch',
    portalFallbackUrl: 'https://antropologiavisual.net/?s=Jean+Rouch',
  },
  {
    id: 'ritual-africa',
    label: 'Rituales y cosmología',
    description: 'Wodaabe, Azande, Akan y Bwiti en África Occidental, Central y Sahel.',
    queryType: 'search',
    queryValue: 'Wodaabe',
    portalFallbackUrl: 'https://antropologiavisual.net/?s=Wodaabe',
  },
  {
    id: 'diaspora-frontera',
    label: 'Fronteras y memoria negra',
    description: 'Migraciones subsaharianas, Guinea-Bisáu y memoria afroandaluza (Gurumbé).',
    queryType: 'search',
    queryValue: 'Gurumbé',
    portalFallbackUrl: 'https://antropologiavisual.net/?s=Gurumb%C3%A9',
  },
];
