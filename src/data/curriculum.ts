export type OriginId = 'irhoud' | 'florisbad' | 'omo' | 'blombos' | 'ooa';
export type ArchSiteId = 'nok' | 'jenne' | 'igbo' | 'mapungubwe';
export type KingdomId = 'kush' | 'aksum' | 'mali' | 'zimbabwe' | 'benin' | 'swahili';
export type TradeNetId = 'sahara' | 'indian';
export type TradeFlowId = 'out' | 'in';
export type SourceId = 'oral' | 'arch' | 'ling' | 'writ';

export interface EditorialPlateInfo {
  id: string;
  src: string;
  figLabel: string;
  title: string;
  caption: string;
  alt: string;
  aspectClass: string;
}

export const EDITORIAL_PLATES: Record<
  'hero' | 'metallurgy' | 'kingdoms' | 'trade',
  EditorialPlateInfo
> = {
  hero: {
    id: 'hero',
    src: '/src/assets/images/hero_african_heritage_1795177373504.jpg',
    figLabel: 'Fig. 1',
    title: 'Gran Recinto y Torre Cónica · Meseta de Zimbabue',
    caption:
      'Mampostería monumental en granito ensamblado en seco (ss. XI–XV d. C.), testimonio de arquitectura estatal autóctona en África Austral.',
    alt: 'Murallas monumentales de piedra granítica en seco y torre cónica del Gran Zimbabue bajo luz de tarde',
    aspectClass: 'aspect-[4/3]',
  },
  metallurgy: {
    id: 'metallurgy',
    src: '/src/assets/images/plate_archaeology_metallurgy_1795177375307.jpg',
    figLabel: 'Fig. 2',
    title: 'Tradición escultórica en terracota y bronce a la cera perdida',
    caption:
      'Horizontes artesanales y metalúrgicos de África Occidental (tradiciones Nok e Igbo-Ukwu), exponentes de especialización técnica anterior al siglo XI.',
    alt: 'Esculturas antiguas de terracota y vasijas de bronce patinado de África Occidental sobre plintos de piedra caliza en iluminación museográfica',
    aspectClass: 'aspect-[16/9]',
  },
  kingdoms: {
    id: 'kingdoms',
    src: '/src/assets/images/plate_precolonial_kingdoms_1795177373316.jpg',
    figLabel: 'Fig. 3',
    title: 'Pirámides reales de Meroe · Reino de Kush (Nubia / Sudán)',
    caption:
      'Necrópolis meridional kushita en arenisca con capillas funerarias orientadas al este, epicentro siderúrgico y dinástico del valle medio del Nilo.',
    alt: 'Pirámides empinadas de piedra arenisca de Meroe en Sudán proyectando sombras geométricas sobre arena dorada',
    aspectClass: 'aspect-[16/9]',
  },
  trade: {
    id: 'trade',
    src: '/src/assets/images/plate_sahara_indian_ocean_1795177376335.jpg',
    figLabel: 'Fig. 4',
    title: 'Navegación en dhow y arquitectura coralina · Costa Swahili',
    caption:
      'Embarcación tradicional de vela latina frente a fachadas de piedra de coral en el litoral del océano Índico, eje del comercio monzónico afroasiático.',
    alt: 'Embarcación tradicional dhow de vela latina navegando frente a edificios históricos de piedra de coral en la costa swahili al atardecer',
    aspectClass: 'aspect-[16/9]',
  },
};

export interface KeyStat {
  label: string;
  value: string;
  delta: string;
  accent: 'ochre' | 'lapis' | 'ink';
  barPercent?: number;
}

export const KEY_STATS: KeyStat[] = [
  {
    label: 'Homo sapiens más antiguo',
    value: '~300.000',
    delta: 'años · Jebel Irhoud (Marruecos)',
    accent: 'ochre',
    barPercent: 100,
  },
  {
    label: 'Diversidad genética global',
    value: '> 85%',
    delta: 'presente en poblaciones africanas',
    accent: 'ochre',
    barPercent: 85,
  },
  {
    label: 'Agrupaciones lingüísticas',
    value: '4 bloques*',
    delta: '~2.000 lenguas (revisión post-Greenberg)',
    accent: 'lapis',
  },
  {
    label: 'Manuscritos de Tombuctú',
    value: '~300.000+',
    delta: 'astronomía, derecho, historia y poesía',
    accent: 'ink',
  },
];

export interface OriginMilestone {
  id: OriginId;
  shortLabel: string;
  chartLabel: string;
  kicker: string;
  title: string;
  desc: string;
  region: string;
  evid: string;
  imp: string;
  ka: number;
}

export const ORIGINS_ORDER: OriginId[] = [
  'irhoud',
  'florisbad',
  'omo',
  'blombos',
  'ooa',
];

export const ORIGINS_DATA: Record<OriginId, OriginMilestone> = {
  irhoud: {
    id: 'irhoud',
    shortLabel: 'Jebel Irhoud (~300 ka)',
    chartLabel: 'Jebel Irhoud (Marruecos)',
    kicker: 'África del Norte · Marruecos',
    title: 'Jebel Irhoud (~300.000 años)',
    desc: 'Alberga los fósiles más antiguos atribuidos a nuestra especie. Sus rostros presentan rasgos modernos mientras la caja craneal conserva una forma más alargada, demostrando que la anatomía y el neurodesarrollo humanos evolucionaron de manera gradual en todo el continente.',
    region: 'Magreb',
    evid: 'Cráneos + industria lítica MSA',
    imp: 'Modelo multirregional panafricano',
    ka: 300,
  },
  florisbad: {
    id: 'florisbad',
    shortLabel: 'Florisbad (~260 ka)',
    chartLabel: 'Florisbad (Sudáfrica)',
    kicker: 'África Austral · Sudáfrica',
    title: 'Florisbad (~260.000 años)',
    desc: 'Cráneo fósil de transición hallado en el Estado Libre sudafricano. Su coexistencia temporal aproximada con Jebel Irhoud en el extremo opuesto del continente refuerza la idea de poblaciones africanas interconectadas que compartían innovaciones biológicas y culturales.',
    region: 'África Austral',
    evid: 'Cráneo de transición + puntas líticas',
    imp: 'Evolución paralela Norte–Sur',
    ka: 260,
  },
  omo: {
    id: 'omo',
    shortLabel: 'Omo Kibish (≥233 ka)',
    chartLabel: 'Omo Kibish (Etiopía)',
    kicker: 'África Oriental · Etiopía',
    title: 'Omo Kibish (≥ 233.000 años)',
    desc: 'Reevaluado mediante datación geoquímica de la toba volcánica suprayacente (Vidal et al., 2022), Omo I alcanza una edad mínima de 233 ± 22 ka y exhibe un cráneo claramente globular y moderno, confirmando el papel central del Cuerno de África como uno de los nodos clave —aunque no el único— de nuestra evolución temprana.',
    region: 'Valle del Rift',
    evid: 'Esqueleto Omo I (edad mínima ≥233 ka)',
    imp: 'Consolidación morfológica moderna',
    ka: 233,
  },
  blombos: {
    id: 'blombos',
    shortLabel: 'Blombos (~100–73 ka)',
    chartLabel: 'Cueva de Blombos (Sudáfrica)',
    kicker: 'África Austral · Costa del Cabo',
    title: 'Cueva de Blombos (~100.000–73.000 años)',
    desc: 'Evidencia inequívoca de cognición simbólica compleja en África mucho antes del arte rupestre paleolítico europeo: talleres de procesamiento de ocre en conchas de abulón (~100 ka), cuentas perforadas de Nassarius (~75 ka), bloques de ocre con grabados geométricos (~77 ka) y el dibujo en ocre sobre silcreta más antiguo conocido (~73 ka).',
    region: 'Sudáfrica',
    evid: 'Ocre grabado (~77 ka) + dibujo (~73 ka)',
    imp: 'Modernidad conductual temprana',
    ka: 85,
  },
  ooa: {
    id: 'ooa',
    shortLabel: 'Salida de África (~60 ka)',
    chartLabel: 'Salida principal de África',
    kicker: 'Dispersión global · ~70.000–50.000 años',
    title: 'Salida principal de África y efecto fundador',
    desc: 'Un subconjunto reducido de poblaciones africanas migró hacia Eurasia e hibridó puntualmente con neandertales y denisovanos. Al llevar consigo solo una fracción del acervo genético africano original, África retiene hoy más del 85 % de la diversidad genética humana global.',
    region: 'Corredor Sinaí / Bab el-Mandeb',
    evid: 'Genómica comparada global',
    imp: 'Unidad biológica de la humanidad',
    ka: 60,
  },
};

export interface IronSite {
  id: string;
  name: string;
  year: number;
  lbl: string;
  story: boolean;
  detail: string;
}

export const IRON_SITES: IronSite[] = [
  {
    id: 'termit',
    name: 'Macizo de Termit (Níger)',
    year: -1000,
    lbl: '~1000 a. C.',
    story: true,
    detail:
      'Uno de los horizontes siderúrgicos más antiguos documentados en el Sahel central, con hornos de reducción temprana independientes de la ruta fenicia mediterránea.',
  },
  {
    id: 'nok-iron',
    name: 'Cultura Nok (Nigeria)',
    year: -900,
    lbl: '~900–400 a. C.',
    story: true,
    detail:
      'Dentro del horizonte Nok (c. 1500 a. C. – 1 d. C.), el periodo ~900–400 a. C. concentra hornos de chimenea asociados a aldeas agrícolas y esculturas huecas de terracota en el centro de Nigeria.',
  },
  {
    id: 'urewe',
    name: 'Urewe (Grandes Lagos)',
    year: -500,
    lbl: '~500 a. C.',
    story: true,
    detail:
      'Región clave de innovación siderúrgica con hornos de reducción directa capaces de producir acero al carbono (con debate arqueometalúrgico sobre el precalentamiento de toberas), vinculada a la expansión bantú oriental.',
  },
  {
    id: 'meroe-iron',
    name: 'Meroe (Nubia / Sudán)',
    year: -500,
    lbl: '~500 a. C.',
    story: false,
    detail:
      'Enormes montículos de escoria junto a la capital kushita evidencian producción siderúrgica estatal a gran escala en el valle del Nilo.',
  },
  {
    id: 'jenne-iron',
    name: 'Jenné-Jeno (Malí)',
    year: -250,
    lbl: '~250 a. C.',
    story: false,
    detail:
      'Los herreros formaron uno de los gremios fundadores de esta aglomeración urbana del delta interior del Níger, articulando intercambio regional.',
  },
  {
    id: 'natal',
    name: 'Natal (Sudáfrica)',
    year: 250,
    lbl: '~250 d. C.',
    story: false,
    detail:
      'Atestigua la llegada consolidada del paquete agrícola-siderúrgico y cerámico de comunidades bantúes hasta la costa sudoriental de África Austral.',
  },
];

export interface LanguageFamily {
  name: string;
  langs: string;
  pct: number;
  color: string;
}

export const LANGUAGE_FAMILIES: LanguageFamily[] = [
  {
    name: 'Níger-Congo (incl. Bantú)',
    langs: '~1.500 lenguas',
    pct: 72,
    color: '#d95216',
  },
  {
    name: 'Afroasiática (Árabe, Hausa, Amhárico)',
    langs: '~375 lenguas',
    pct: 18,
    color: '#2f6db5',
  },
  {
    name: 'Nilo-Sahariana* (Luo, Kanuri, Nubio)',
    langs: '~200 lenguas',
    pct: 8,
    color: '#156f55',
  },
  {
    name: 'Agrupación Joisán* (Khoe-Kwadi, Kx\'a, Tuu)',
    langs: '~30 lenguas',
    pct: 2,
    color: '#7d4ca5',
  },
];

export interface ArchSite {
  id: ArchSiteId;
  name: string;
  region: string;
  chronology: string;
  trait: string;
  category: string;
  categoryTone: 'ochre' | 'lapis' | 'forest';
  kicker: string;
  text: string;
}

export const ARCH_SITES: ArchSite[] = [
  {
    id: 'nok',
    name: 'Cultura Nok',
    region: 'Centro de Nigeria',
    chronology: 'c. 1500 a. C. – 1 d. C.',
    trait: 'Escultura monumental en terracota y fundición de hierro',
    category: 'Siderurgia · Arte',
    categoryTone: 'ochre',
    kicker: 'Expediente arqueológico · Cultura Nok (Nigeria, c. 1500 a. C. – 1 d. C.)',
    text: 'Documentada sistemáticamente por el Proyecto Nok de Fráncfort en el centro de Nigeria (con fase inicial ~1500–900 a. C. y apogeo escultórico y siderúrgico ~900–400 a. C.), la cultura Nok produjo esculturas huecas de terracota junto con fundición de hierro en hornos de chimenea, refutando la vieja tesis colonial difusionista.',
  },
  {
    id: 'jenne',
    name: 'Jenné-Jeno',
    region: 'Delta interior del Níger (Malí)',
    chronology: 'c. 250 a. C. – 1400 d. C.',
    trait: 'Urbanismo heterárquico sin monarquía centralizada',
    category: 'Urbanismo',
    categoryTone: 'lapis',
    kicker: 'Expediente arqueológico · Jenné-Jeno (Malí, c. 250 a. C. – 1400 d. C.)',
    text: 'Excavada por Susan y Roderick McIntosh, esta gran aglomeración urbana del delta interior del Níger alcanzó decenas de miles de habitantes organizados en barrios especializados (herreros, alfareros, pescadores) sin indicios de palacios, murallas represivas ni tumbas reales monumentales: un ejemplo clásico de urbanismo heterárquico.',
  },
  {
    id: 'igbo',
    name: 'Igbo-Ukwu',
    region: 'Sureste de Nigeria',
    chronology: 'c. siglo IX – X d. C.',
    trait: 'Bronce plomado a la cera perdida y cobre puro forjado',
    category: 'Metalurgia',
    categoryTone: 'ochre',
    kicker: 'Expediente arqueológico · Igbo-Ukwu (Nigeria, siglos IX–X d. C.)',
    text: 'Los hallazgos funerarios y santuarios de Igbo-Ukwu revelaron un control metalúrgico diferenciado: bronce plomado (aleación de cobre, estaño y plomo) fundido a la cera perdida para vasijas y ornamentos de extraordinario detalle, frente a cobre puro forjado para piezas martilladas, junto a cuentas de vidrio de intercambio a larga distancia y símbolos de autoridad ritual (Eze Nri) muy anteriores al comercio atlántico.',
  },
  {
    id: 'mapungubwe',
    name: 'Mapungubwe',
    region: 'Limpopo (Sudáfrica)',
    chronology: 'c. 1075 – 1290 d. C.',
    trait: 'Realeza sagrada, oro trabajado y comercio con el Índico',
    category: 'Proto-Estado',
    categoryTone: 'forest',
    kicker: 'Expediente arqueológico · Mapungubwe (Sudáfrica, c. 1075–1290 d. C.)',
    text: 'En la confluencia de los ríos Shashe y Limpopo, la élite ocupó la cima de la colina (separación espacial de clase), enterrando a sus gobernantes con objetos de oro laminado como el célebre rinoceronte de oro. Constituye el precursor inmediato del Gran Zimbabue y demuestra la profunda antigüedad estatal en África Austral.',
  },
];

export interface KingdomProfile {
  id: KingdomId;
  shortLabel: string;
  name: string;
  start: number;
  end: number;
  spanLabel: string;
  kicker: string;
  title: string;
  desc: string;
  econ: string;
  inst: string;
  pat: string;
  seminarFocus: string;
}

export const KINGDOMS_ORDER: KingdomId[] = [
  'kush',
  'aksum',
  'swahili',
  'zimbabwe',
  'benin',
  'mali',
];

export const KINGDOMS_BUTTON_ORDER: KingdomId[] = [
  'kush',
  'aksum',
  'mali',
  'zimbabwe',
  'benin',
  'swahili',
];

export const KINGDOMS_DATA: Record<KingdomId, KingdomProfile> = {
  kush: {
    id: 'kush',
    shortLabel: 'Kush / Meroe',
    name: 'Kush / Meroe',
    start: -1070,
    end: 350,
    spanLabel: '1070 a. C. – 350 d. C.',
    kicker: 'Nubia / Sudán · c. 1070 a. C. – 350 d. C.',
    title: 'Reino de Kush (Napata y Meroe)',
    desc: 'Potencia nilótica que gobernó Egipto como la Dinastía XXV (siglos VIII–VII a. C.) y consolidó luego su gran capital meridional en Meroe. Desarrolló el alfasilabario (abugida) meroítico —cuyos valores fonéticos están descifrados desde 1911, aunque la lengua y buena parte de su gramática siguen parcialmente comprendidas—, una poderosa siderurgia y un sistema político en el que las reinas madres (kandakes) ejercieron autoridad soberana.',
    econ: 'Hierro, oro, marfil y ruta del Nilo',
    inst: 'Monarquía sagrada y Kandakes',
    pat: 'Pirámides de Meroe y Jebel Barkal',
    seminarFocus:
      'el contraste entre las inscripciones egipcias/clásicas sobre Nubia, los textos en alfasilabario meroítico (fonéticamente leídos pero de lengua parcialmente comprendida) y los complejos siderúrgicos y piramidales de Meroe',
  },
  aksum: {
    id: 'aksum',
    shortLabel: 'Aksum',
    name: 'Reino de Aksum',
    start: 100,
    end: 940,
    spanLabel: '100 – 940 d. C.',
    kicker: 'Tierras Altas de Etiopía y Eritrea · c. 100 – 940 d. C.',
    title: 'Reino de Aksum',
    desc: "Considerado por el profeta Mani como uno de los cuatro grandes imperios del mundo antiguo (junto a Roma, Persia y China). Acuñó moneda propia en oro, plata y bronce, controló el mar Rojo desde el puerto de Adulis, desarrolló la escritura ge'ez y adoptó el cristianismo como religión oficial en el siglo IV bajo el rey Ezana.",
    econ: 'Comercio mar Rojo–Índico y moneda propia',
    inst: "Estado cristiano temprano y escritura ge'ez",
    pat: 'Estelas monolíticas gigantes de Aksum',
    seminarFocus:
      "las estelas trilingües en ge'ez, sabeo y griego y la numismática aksumita frente a la arqueología portuaria de Adulis y la memoria eclesiástica etíope",
  },
  mali: {
    id: 'mali',
    shortLabel: 'Imperio de Malí',
    name: 'Imperio de Malí',
    start: 1235,
    end: 1600,
    spanLabel: '1235 – 1600 d. C.',
    kicker: 'África Occidental / Cuenca del Níger · c. 1235 – 1600 d. C.',
    title: 'Imperio de Malí',
    desc: 'Fundado por Sundiata Keita tras la batalla de Kirina y asociado por la memoria oral mandinga a la Carta de Manden (Kouroukan Fouga, transmitida y reelaborada por los jeliw a lo largo de los siglos). Bajo gobernantes como Mansa Musa (siglo XIV), articuló una federación multiétnica próspera gracias al control del oro sudanés y convirtió a Tombuctú, Jenné y Gao en focos internacionales de erudición islámica.',
    econ: 'Oro (Bambuk/Buré), sal y agricultura',
    inst: 'Federación mandinga y Carta de Manden',
    pat: 'Mezquita de Djinguereber y manuscritos de Sankoré',
    seminarFocus:
      'la epopeya oral de Sundiata transmitida por los jeliw frente a relatos de viajeros árabes (Ibn Battuta, Al-Umari), crónicas de Tombuctú y excavaciones del valle del Níger',
  },
  zimbabwe: {
    id: 'zimbabwe',
    shortLabel: 'Gran Zimbabue',
    name: 'Gran Zimbabue',
    start: 1100,
    end: 1450,
    spanLabel: '1100 – 1450 d. C.',
    kicker: 'Meseta de Zimbabue · c. 1100 – 1450 d. C.',
    title: 'Gran Zimbabue',
    desc: 'Capital construida por antepasados del pueblo shona con monumentales murallas de granito ensambladas en seco (sin argamasa) de hasta 11 metros de altura. Durante la era colonial se negó falsamente su autoría africana; la arqueología demostró de forma concluyente su origen autóctono y su papel como gran proveedor de oro hacia el puerto de Sofala y Kilwa.',
    econ: 'Ganadería bovina y oro hacia el Índico',
    inst: 'Monarquía redistributiva y prestigio ritual',
    pat: 'Gran Recinto y aves talladas en esteatita',
    seminarFocus:
      'la refutación arqueológica del mito colonial no africano mediante estratigrafía local, cerámica shona, genealogías orales y bienes importados del Índico',
  },
  benin: {
    id: 'benin',
    shortLabel: 'Reino de Benín',
    name: 'Reino de Benín',
    start: 1180,
    end: 1897,
    spanLabel: '1180 – 1897 d. C.',
    kicker: 'Sur de Nigeria (Pueblo Edo) · c. 1180 – 1897 d. C.',
    title: 'Reino de Benín (Edo)',
    desc: 'Estado forestal gobernado por la dinastía del Oba, rodeado por el mayor sistema de murallas y fosos de tierra (Iya) del mundo preindustrial. Mantuvo relaciones diplomáticas soberanas con Portugal desde finales del siglo XV y creó placas de latón/bronce que funcionaban como archivo histórico palaciego hasta el saqueo colonial británico de 1897.',
    econ: 'Pimienta, marfil, tejidos y gremios reales',
    inst: 'Corte del Oba y gremios de fundidores',
    pat: 'Placas de bronce de Benín y red de murallas Iya',
    seminarFocus:
      'el archivo iconográfico en bronce y la tradición oral de la corte del Oba frente a las crónicas europeas tempranas y el levantamiento arqueológico de las murallas Iya',
  },
  swahili: {
    id: 'swahili',
    shortLabel: 'Costa Swahili',
    name: 'Costa Swahili',
    start: 900,
    end: 1500,
    spanLabel: '900 – 1500 d. C.',
    kicker: 'Litoral de Kenia, Tanzania y Mozambique · c. 900 – 1500 d. C.',
    title: 'Ciudades-Estado de la Costa Swahili (Kilwa, Lamu, Mombasa)',
    desc: 'Red de puertos cosmopolitas de lengua bantú (kiswahili) y fe islámica que levantaron palacios y mezquitas en piedra de coral —como Husuni Kubwa en Kilwa Kisiwani—. Lejos de ser «colonias árabes», la arqueología y el ADN antiguo (Brielle et al., 2023) confirman una base materna mayoritariamente africana (~90 %+) combinada con mestizaje paterno persa y árabe a partir de ~1000 d. C.',
    econ: 'Intermediación oro–marfil–porcelana',
    inst: 'Ciudades-estado mercantiles y moneda de Kilwa',
    pat: 'Ruinas de Kilwa Kisiwani y arquitectura coralina',
    seminarFocus:
      'la lingüística bantú del kiswahili y la estratigrafía urbana coralina frente a la Crónica de Kilwa y los relatos de viajeros árabes del Índico',
  },
};

export interface TradeStage {
  x: number;
  label: string;
  sub: string;
  item: string;
  roleNote: string;
}

export interface TradeScenario {
  title: string;
  sub: string;
  kicker: string;
  cardTitle: string;
  cardBody: string;
  tech: string;
  nodes: string;
  cult: string;
  arcLabel: string;
  institutionalNote: string;
  stages: TradeStage[];
}

export const TRADE_DATA: Record<TradeNetId, Record<TradeFlowId, TradeScenario>> = {
  sahara: {
    out: {
      title: 'Red Transahariana: Flujo Sur → Norte (Desde África Occidental)',
      sub: 'Oro sudanés, marfil, cuero y nuez de cola hacia el Magreb y el Mediterráneo',
      kicker: 'Eje Sur → Norte · Motor monetario medieval',
      cardTitle: 'El oro del Sahel sostiene las monedas del Mediterráneo',
      cardBody:
        'Mercaderes wangara y soninké extraían oro en los bosques y sabanas húmedas y lo conducían a los emporios del río Níger (Jenné, Tombuctú, Gao). Desde allí, caravanas de miles de dromedarios cruzaban el Sáhara hasta Siyilmasa, Fez y El Cairo, financiando gran parte de la acuñación de dinares y florines medievales.',
      tech: 'Dromedario + guías tuareg + crédito (suftaja)',
      nodes: 'Bambuk/Akan → Tombuctú → Taghaza → Siyilmasa',
      cult: 'Diplomacia imperial (Mansa Musa, 1324)',
      arcLabel: 'Flujo Sur → Norte: Oro, marfil, cuero y cola',
      institutionalNote:
        'Los Estados del Sahel gravaban el paso de mercancías sin necesidad de conquistar directamente todas las minas de oro.',
      stages: [
        {
          x: 80,
          label: 'Bambuk / Akan',
          sub: 'Sabana y bosque',
          item: 'Oro · Nuez de cola',
          roleNote:
            'Zonas productoras auríferas y forestales donde comunidades locales mantenían autonomía extractiva frente a los imperios sahelianos.',
        },
        {
          x: 240,
          label: 'Jenné / Tombuctú',
          sub: 'Puertos del Sahel',
          item: 'Acopio y peajes',
          roleNote:
            'Bisagra ecológica entre la navegación fluvial del Níger y el transporte caravanero; sede de aduanas reales y gremios mercantiles.',
        },
        {
          x: 400,
          label: 'Taghaza / Oasis',
          sub: 'Sáhara central',
          item: 'Relevo de caravanas',
          roleNote:
            'Estación vital de agua, guías especializados y cambio de cargas en pleno desierto, articulada por redes tuareg y bereberes.',
        },
        {
          x: 560,
          label: 'Siyilmasa / Cairo',
          sub: 'Magreb y Mediterr.',
          item: 'Acuñación de oro',
          roleNote:
            'Emporios receptores del norte de África cuyas cecas abastecían de metal precioso al mundo islámico mediterráneo y a Europa.',
        },
      ],
    },
    in: {
      title: 'Red Transahariana: Flujo Norte → Sur (Hacia el Sahel)',
      sub: 'Sal gema, manuscritos, tejidos mediterráneos, cobre y derecho islámico',
      kicker: 'Eje Norte → Sur · Economía de la sal y el libro',
      cardTitle: 'Sal imprescindible para la vida y bibliotecas del desierto',
      cardBody:
        'En las zonas tropicales escasas en sal mineral, las placas extraídas en las minas saharianas de Taghaza y Taoudenni llegaban a intercambiarse a un altísimo valor relativo. Junto a tejidos, caballos y cobre, viajaba el bien más apreciado en Tombuctú según León el Africano: los libros manuscritos, base de las escuelas de Sankoré.',
      tech: 'Contratos escritos + red de juristas malikíes',
      nodes: 'Magreb / Al-Ándalus → Taghaza → Tombuctú → Sahel',
      cult: 'Bibliotecas de Tombuctú y ciencia astronómica',
      arcLabel: 'Flujo Norte → Sur: Sal gema, manuscritos, cobre y telas',
      institutionalNote:
        'La circulación jurídica y manuscrita creó una red letrada panafricana que abarató la confianza comercial a miles de kilómetros.',
      stages: [
        {
          x: 80,
          label: 'Sahel / Imperios',
          sub: 'Malí y Songhay',
          item: 'Consumo y saber',
          roleNote:
            'Demanda estructural de sal mineral para la alimentación y ganadería, junto a cobre para aleaciones y caballos de prestigio.',
        },
        {
          x: 240,
          label: 'Tombuctú / Gao',
          sub: 'Centros eruditos',
          item: 'Libros · Escuelas',
          roleNote:
            'Capitales intelectuales donde los manuscritos sobre jurisprudencia, astronomía y medicina generaban mayor margen que cualquier otra mercancía.',
        },
        {
          x: 400,
          label: 'Minas de Taghaza',
          sub: 'Sáhara',
          item: 'Placas de sal gema',
          roleNote:
            'Explotaciones salineras estratégicas cuyas losas estandarizadas servían tanto de bien de consumo como de reserva de valor en el Sahel.',
        },
        {
          x: 560,
          label: 'Fez / Al-Ándalus',
          sub: 'Norte de África',
          item: 'Manuscritos · Cobre',
          roleNote:
            'Centros productores de papel, copistas, manufacturas textiles y metalurgia de cobre que alimentaban las caravanas hacia el sur.',
        },
      ],
    },
  },
  indian: {
    out: {
      title: 'Red del Océano Índico: Flujo África → Asia (Monzón del Suroeste)',
      sub: 'Oro de Zimbabue, marfil, hierro de calidad y maderas de manglar',
      kicker: 'Monzón Abril–Septiembre · Navegación en Dhow',
      cardTitle: 'El interior austral conectado con Arabia, India y China',
      cardBody:
        'El oro extraído en la meseta del Gran Zimbabue descendía hacia el puerto de Sofala y de allí a la gran metrópoli isleña de Kilwa Kisiwani. Aprovechando los vientos regulares del monzón de verano, los navíos dhow de vela latina llevaban oro, marfil apreciado en la India y lingotes de hierro africano hacia Omán, Gujarat y Cantón.',
      tech: 'Vela latina (dhow) + brújula y astrolabio',
      nodes: 'Gran Zimbabue → Sofala → Kilwa → Gujarat / China',
      cult: 'Embajadas y fauna exótica (jirafa a corte Ming, 1414)',
      arcLabel: 'Monzón Suroeste (Abr–Sep): Oro, marfil y hierro',
      institutionalNote:
        'Las ciudades swahili operaban como intermediarias soberanas entre los reinos del interior y los navegantes del Índico.',
      stages: [
        {
          x: 80,
          label: 'Gran Zimbabue',
          sub: 'Meseta interior',
          item: 'Oro · Marfil',
          roleNote:
            'Eje político shona que canalizaba oro aluvial y de veta, marfil y ganado hacia los corredores fluviales del Zambeze y el Save.',
        },
        {
          x: 240,
          label: 'Sofala / Kilwa',
          sub: 'Costa Swahili',
          item: 'Aduanas y moneda',
          roleNote:
            'Puertos coralinos soberanos que cobraban derechos aduaneros, acuñaban moneda propia de cobre/plata y coordinaban el embarque oceánico.',
        },
        {
          x: 400,
          label: 'Omán / Yemen',
          sub: 'Península Arábiga',
          item: 'Reexportación',
          roleNote:
            'Escala marítima clave que absorbía vigas de manglar, hierro africano de alta calidad y marfil, redistribuyéndolos hacia Persia y Asia.',
        },
        {
          x: 560,
          label: 'India / China',
          sub: 'Gujarat · Ming',
          item: 'Manufactura asiática',
          roleNote:
            'Mercados finales de alto volumen donde el marfil africano —más fácil de tallar que el asiático— y el oro sostenían intercambios diplomáticos.',
        },
      ],
    },
    in: {
      title: 'Red del Océano Índico: Flujo Asia → África (Monzón del Noreste)',
      sub: 'Tejidos de algodón de la India, porcelana china, cuentas de vidrio y especias',
      kicker: 'Monzón Noviembre–Marzo · Intercambio cosmopolita',
      cardTitle: 'Porcelana Ming y textiles indios en palacios africanos',
      cardBody:
        'Durante el invierno boreal, los vientos invertían su dirección y traían de vuelta a las ciudades swahili cargamentos de telas de algodón de Cambay (India), porcelana celadón y azul-y-blanca china, cerámica persa y cuentas de vidrio que circulaban tierra adentro hasta Mapungubwe y el Gran Zimbabue como bienes de prestigio político.',
      tech: 'Calendario monzónico + alianzas matrimoniales',
      nodes: 'China / India → Golfo Pérsico → Kilwa → Interior',
      cult: 'Estética coralina swahili y lengua kiswahili',
      arcLabel: 'Monzón Noreste (Nov–Mar): Porcelana, algodón y cuentas',
      institutionalNote:
        'Los bienes asiáticos no eran mero consumo suntuario: al redistribuirse tierra adentro legitimaban alianzas políticas y rituales.',
      stages: [
        {
          x: 80,
          label: 'Interior Austral',
          sub: 'Élites shona',
          item: 'Prestigio político',
          roleNote:
            'Los soberanos de Mapungubwe y Gran Zimbabue redistribuían cuentas de vidrio y textiles importados para consolidar lealtades regionales.',
        },
        {
          x: 240,
          label: 'Kilwa / Lamu',
          sub: 'Puertos swahili',
          item: 'Porcelana en muros',
          roleNote:
            'Las familias patricias empotraban platos de porcelana china en bóvedas de mezquitas y tumbas como emblema visible de cosmopolitismo.',
        },
        {
          x: 400,
          label: 'Gujarat / Persia',
          sub: 'Índico norte',
          item: 'Algodón · Cuentas',
          roleNote:
            'Centros textiles y vidrieros que diseñaban calidades, colores y formatos adaptados específicamente al gusto de los mercados africanos.',
        },
        {
          x: 560,
          label: 'China Ming',
          sub: 'Fujian / Cantón',
          item: 'Porcelana celadón',
          roleNote:
            'Hornos imperiales y provinciales cuya cerámica de exportación llegó a África Oriental tanto vía intermediarios como en las flotas de Zheng He.',
        },
      ],
    },
  },
};

export interface HistoricalSource {
  id: SourceId;
  shortLabel: string;
  kicker: string;
  title: string;
  desc: string;
  str: string;
  bias: string;
  scores: {
    depth: number;
    internal: number;
    material: number;
    chronology: number;
  };
}

export const SOURCES_ORDER: SourceId[] = ['oral', 'arch', 'ling', 'writ'];

export const SOURCE_DIMENSIONS: Array<{
  key: keyof HistoricalSource['scores'];
  label: string;
  shortLabel: string;
}> = [
  { key: 'depth', label: 'Profundidad temporal (milenios)', shortLabel: 'Profundidad' },
  { key: 'internal', label: 'Perspectiva africana interna', shortLabel: 'Voz interna' },
  { key: 'material', label: 'Evidencia material / cotidiana', shortLabel: 'Base material' },
  { key: 'chronology', label: 'Precisión cronológica directa', shortLabel: 'Cronología' },
];

export const SOURCES_DATA: Record<SourceId, HistoricalSource> = {
  oral: {
    id: 'oral',
    shortLabel: 'Tradición oral (Griots)',
    kicker: 'Memoria institucionalizada · Profundidad típica: siglos XIII–XX',
    title: 'Tradición oral y especialistas de la memoria (Jeliw / Griots)',
    desc: 'En numerosas sociedades africanas la transmisión oral estaba profesionalizada y regulada por linajes específicos. Permite acceder a la mentalidad interna, las normas constitucionales (como la Carta de Manden) y las genealogías, aunque exige análisis crítico para detectar desplazamientos cronológicos o reelaboraciones dinásticas. Como señaló Amadou Hampâté Bâ: «En África, un anciano que muere es una biblioteca que arde».',
    str: 'Voz africana interna, normas e identidad',
    bias: 'Telescopaje temporal y legitimación política',
    scores: { depth: 45, internal: 96, material: 28, chronology: 42 },
  },
  arch: {
    id: 'arch',
    shortLabel: 'Arqueología',
    kicker: 'Registro material directo · Profundidad: 300.000 años – presente',
    title: 'Arqueología, paleogenómica y arqueometría',
    desc: 'Única disciplina capaz de cubrir desde el Paleolítico hasta la Edad Media sin depender de la escritura. Revela la vida cotidiana de la gente común (dieta, vivienda, talleres de hierro, urbanismo heterárquico como Jenné-Jeno) que las crónicas cortesanas suelen ignorar.',
    str: 'Datación absoluta y cultura material cotidiana',
    bias: 'Conservación desigual en suelos ácidos/húmedos',
    scores: { depth: 98, internal: 55, material: 98, chronology: 90 },
  },
  ling: {
    id: 'ling',
    shortLabel: 'Lingüística histórica',
    kicker: 'Historia de las palabras · Profundidad: ~10.000 a. C. – presente',
    title: 'Lingüística histórica y glotocronología',
    desc: 'Reconstruyendo vocabulario ancestral compartido (por ejemplo, términos para «hierro», «sorgo», «vaca» o «canoa» en proto-bantú), la lingüística histórica permite trazar migraciones milenarias, contactos culturales y adopción de cultivos allí donde faltan textos.',
    str: 'Rastrea migraciones y préstamos culturales antiguos',
    bias: 'No aporta fechas exactas por sí sola',
    scores: { depth: 82, internal: 72, material: 48, chronology: 50 },
  },
  writ: {
    id: 'writ',
    shortLabel: 'Fuentes escritas africanas/árabes',
    kicker: 'Archivos propios y externos · Profundidad: ~3000 a. C. – siglo XIX',
    title: "Fuentes escritas africanas (Ge'ez, Ajami, Meroítico) y árabes",
    desc: "África posee milenios de escritura autóctona: jeroglíficos egipcios y meroíticos, etíope ge'ez, tifinagh bereber y el vasto corpus ajami (lenguas africanas escritas en alfabeto árabe), junto a crónicas de Tombuctú (Tarikh al-Sudan) y viajeros árabes (Al-Bakri, Ibn Battuta).",
    str: 'Cronologías precisas, derecho y diplomacia',
    bias: 'Foco en élites urbanas y mirada externa en viajeros',
    scores: { depth: 68, internal: 78, material: 52, chronology: 95 },
  },
};

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    q: '¿Qué demostró el hallazgo y datación de los fósiles de Jebel Irhoud (~300.000 años) en Marruecos respecto al origen de nuestra especie?',
    options: [
      'Que Homo sapiens surgió exclusivamente en el norte de África y migró luego al valle del Rift.',
      'Que nuestra especie evolucionó en red en múltiples regiones del continente africano (modelo multirregional africano) y no en un único punto aislado.',
      'Que los humanos modernos evolucionaron en Europa y regresaron posteriormente al continente africano.',
      'Que la diversidad genética humana es mayor fuera de África debido a la adaptación a climas fríos.',
    ],
    correct: 1,
    explanation:
      'Jebel Irhoud (~300 ka), junto con Florisbad (~260 ka) y Omo Kibish (edad mínima ≥233 ka), respalda el modelo multirregional panafricano: poblaciones estructuradas en todo el continente evolucionaron en mosaico e intercambiaron genes a lo largo de cientos de miles de años.',
  },
  {
    q: '¿Por qué el yacimiento de Jenné-Jeno (Malí) desafió los modelos clásicos sobre el surgimiento de las ciudades antiguas?',
    options: [
      'Porque fue fundado por navegantes portugueses antes del siglo XV.',
      'Porque carecía por completo de agricultura y metalurgia del hierro.',
      'Porque muestra un urbanismo complejo y denso de carácter heterárquico (organizado en gremios) sin palacios monumentales ni monarquía centralizada.',
      'Porque sus murallas fueron construidas en piedra de coral traída desde el océano Índico.',
    ],
    correct: 2,
    explanation:
      'Las excavaciones en Jenné-Jeno demostraron que la urbanización africana en el delta interior del Níger surgió de forma autóctona (~250 a. C.) y funcionó durante siglos mediante redes cooperativas de comunidades especializadas sin coerción palaciega central.',
  },
  {
    q: '¿Qué característica distinguió al Reino de Aksum (Etiopía/Eritrea) entre los siglos III y VII d. C.?',
    options: [
      'Su aislamiento total respecto a las rutas marítimas del mar Rojo y el océano Índico.',
      "La acuñación de moneda propia en oro, plata y bronce, el uso de la escritura ge'ez y la adopción oficial temprana del cristianismo.",
      'El control exclusivo de las minas de sal gema de Taghaza en el Sáhara Occidental.',
      'La construcción de las murallas de granito en seco del Gran Recinto.',
    ],
    correct: 1,
    explanation:
      "Aksum fue una gran potencia comercial del mar Rojo y el Índico, acuñó su propia moneda (único Estado del África subsahariana antigua en hacerlo a esa escala), utilizó escritura ge'ez y adoptó el cristianismo en el siglo IV bajo el rey Ezana.",
  },
  {
    q: 'En las redes comerciales de la Edad Media africana, ¿qué factor ambiental permitió la regularidad de los intercambios entre la Costa Swahili, Arabia, la India y China?',
    options: [
      'El régimen estacional reversible de los vientos monzónicos del océano Índico.',
      'La navegación fluvial continua desde el río Níger hasta el río Zambeze.',
      'El congelamiento invernal del canal de Mozambique.',
      'La introducción temprana de barcos de vapor en el puerto de Kilwa.',
    ],
    correct: 0,
    explanation:
      'Los vientos monzónicos soplan hacia África Oriental entre noviembre y marzo y se invierten hacia Asia entre abril y septiembre, permitiendo a los navíos dhow realizar travesías previsibles de ida y vuelta cada año.',
  },
  {
    q: 'Según la metodología consolidada por la Historia General de África de la UNESCO y escuelas como Ibadán o Dakar, ¿cuál es el principio esencial para investigar el pasado precolonial africano?',
    options: [
      'Limitarse únicamente a los diarios de exploradores europeos del siglo XIX por ser escritos.',
      'Sustituir por completo la arqueología por relatos mitológicos sin contraste crítico.',
      'Triangular críticamente fuentes complementarias: arqueología, tradición oral, lingüística histórica y textos africanos y árabes.',
      'Considerar que África no tuvo historia política antes de la Conferencia de Berlín.',
    ],
    correct: 2,
    explanation:
      "Ninguna fuente por sí sola está libre de sesgos: la fuerza de la historiografía africana contemporánea radica en cruzar evidencia material (arqueología), memoria interna (tradición oral), historia léxica (lingüística) y corpus escritos (ge'ez, ajami, crónicas árabes).",
  },
  {
    q: '¿Por qué la paleoproteómica del esmalte dental resulta especialmente decisiva en la paleoantropología africana frente al ADN antiguo?',
    options: [
      'Porque el ADN nuclear se conserva sin degradación durante más de 5 millones de años en la sabana africana.',
      'Porque los cristales de hidroxiapatita del esmalte protegen péptidos (como la amelogenina AMELX/AMELY) hasta ~2–3,5 Ma en climas cálidos donde el ADN se degrada rápidamente.',
      'Porque las proteínas del esmalte contienen más pares de bases que el genoma nuclear completo.',
      'Porque la paleoproteómica sustituye por completo a la datación radiométrica y a la estratigrafía.',
    ],
    correct: 1,
    explanation:
      'En climas cálidos africanos la hidrólisis térmica destruye el ADN en decenas de miles de años (el más antiguo en África es Taforalt, ~15 ka). En cambio, el esmalte mineralizado preserva proteínas durante millones de años, permitiendo determinar sexo cromosómico y relaciones evolutivas en Paranthropus robustus (~2 Ma) y Australopithecus.',
  },
  {
    q: '¿Qué indicador bioquímico principal utilizan los laboratorios de paleogenómica en sala blanca para autenticar que una secuencia de ADN es genuinamente antigua y no contaminación moderna?',
    options: [
      'La presencia de fragmentos largos superiores a 5.000 pares de bases sin roturas.',
      'La ausencia total de diferencias respecto al genoma de referencia humano actual.',
      'El patrón de fragmentos ultracortos (<70 pb) acompañado de desaminación post mortem (sustituciones C→T concentradas en los extremos 5\').',
      'La presencia exclusiva de colágeno tipo I en el esmalte dental.',
    ],
    correct: 2,
    explanation:
      'El ADN antiguo se caracteriza por su fragmentación extrema y por la desaminación espontánea de citosinas (C→T) en los extremos de la molécula; en paleoproteómica, un criterio análogo de autenticidad es la elevada desamidación de glutamina y asparagina.',
  },
  {
    q: 'En el estudio experimental de campo de Henke-von der Malsburg et al. (2026) sobre primates silvestres, ¿qué ocurrió en la Tarea 3 cuando compitieron rocas intactas y rocas con marcas de percusión previa?',
    options: [
      'Los primates ignoraron por completo las huellas de uso y eligieron siempre la roca más dura como yunque.',
      'En la selección de yunques, las pistas sociales de uso previo (p = 0,003) superaron a la dureza de la materia prima (p = 0,255 n.s.), ilustrando la «cuarta dimensión» de las herramientas.',
      'Los primates rechazaron cualquier piedra marcada por congéneres para evitar contaminación.',
      'La dureza de la roca resultó irrelevante en las tres tareas, incluso sin huellas previas.',
    ],
    correct: 1,
    explanation:
      'Mientras que sin pistas sociales (Tarea 1) los primates discriminan funcionalmente caliza blanda como yunque y arenisca dura como percutor, en la Tarea 3 las huellas visibles de percusión previa dominan la elección del yunque (E_modif = +1,08; p = 0,003) anulando el efecto de la dureza (p = 0,255), lo que matiza lecturas estrictamente utilitarias del Olduvayense.',
  },
  {
    q: 'Según el registro fósil africano y la hipótesis «Nacidos para correr» (Bramble y Lieberman, 2004), ¿qué diferencia la fase del bipedismo temprano frente a la carrera de resistencia?',
    options: [
      'El bipedismo surgió únicamente tras la aparición de cerebros mayores de 1.300 cm³ en sabanas abiertas.',
      'El bipedismo temprano (p. ej. Australopithecus afarensis y Laetoli, ~3,6–3,2 Ma) surgió en mosaicos arbolados millones de años antes del gran cerebro; la carrera de resistencia en Homo (~2 Ma) añadió piernas largas, ligamento nucal, tendón de Aquiles elástico, arco plantar y sudoración ecrina masiva.',
      'Australopithecus carecía de curvatura lumbar y de fémur en valgo, rasgos exclusivos de Homo sapiens.',
      'La carrera de resistencia eliminó el uso del arco plantar y del glúteo mayor para ahorrar energía.',
    ],
    correct: 1,
    explanation:
      'El bipedismo habitual apareció en mosaicos arbolados africanos varios millones de años antes de la encefalización. Con la expansión de sabanas abiertas y el género Homo (~2 Ma), un paquete biomecánico y termorregulador específico (tendón de Aquiles elástico, ligamento nucal, hombros bajos, cintura estrecha y sudoración ecrina) posibilitó la carrera prolongada.',
  },
  {
    q: 'En el análisis antropológico de los ritos de paso (Arnold van Gennep y Victor Turner entre los Ndembu de Zambia), ¿cuál es la función de la fase intermedia o de liminalidad?',
    options: [
      'Aislar permanentemente al individuo del grupo sin posibilidad de reintegración social.',
      'Suspender temporalmente las jerarquías previas en un estado umbral donde surgen la communitas, la transmisión de saberes éticos y la transformación hacia una nueva persona social.',
      'Sustituir las redes de parentesco y las clases de edad por una burocracia escrita estatal.',
      'Demostrar que el pensamiento simbólico africano apareció después del arte rupestre europeo.',
    ],
    correct: 1,
    explanation:
      'Los ritos de paso se estructuran en separación, margen o liminalidad y agregación. Durante la liminalidad se suspende el estatus anterior, se refuerza la solidaridad horizontal (communitas) y se transmiten valores y memorias colectivas antes de reintegrar al iniciado con plena responsabilidad social.',
  },
  {
    q: '¿Qué aportan conjuntamente la hipótesis de la abuela (Hawkes et al., Hadza de Tanzania) y el estudio de los sistemas africanos de filiación como el abusua akan (Ghana)?',
    options: [
      'Que la menopausia humana es una anomalía sin valor adaptativo y que «matrilineal» equivale a matriarcado.',
      'Que las transferencias intergeneracionales de cuidados y calorías de mujeres post-reproductivas (aloparentalidad) sostienen infancias largas, y que la filiación matrilineal organiza pertenencia y herencia por línea materna con un papel clave del tío materno.',
      'Que todas las sociedades precoloniales africanas compartían un único modelo nuclear patrilineal.',
      'Que la riqueza de la novia (lobola) funcionaba como compraventa mercantil sin vínculos entre linajes.',
    ],
    correct: 1,
    explanation:
      'La etnografía hadza respalda que las mujeres post-reproductivas aumentan la supervivencia infantil mediante forrajeo estable y aloparentalidad. En el plano sociocultural, los sistemas matrilineales africanos (como el abusua akan o los bemba) trazan linaje y herencia por vía materna con centralidad del tío materno y figuras como la Reina Madre (Asantehemaa), sin confundirse con «matriarcado».',
  },
  {
    q: '¿Qué rasgo histórico singular distingue la transición africana hacia la producción de alimentos frente al modelo euroasiático clásico del Creciente Fértil?',
    options: [
      'En África todos los cultivos y el ganado fueron introducidos desde Eurasia en época moderna.',
      'En el Sáhara húmedo (~8.000–5.000 a. C., Takarkori, Nabta Playa) el pastoralismo móvil y la cerámica precedieron en milenios a la agricultura sedentaria, y el continente albergó focos independientes de domesticación (sorgo, mijo perla, arroz Oryza glaberrima, teff y ñame).',
      'Las sociedades cazadoras-recolectoras africanas nunca mantuvieron contacto con agricultores ni pastores.',
      'La agricultura cerealista comenzó en la selva ecuatorial antes de existir cerámica en el Sáhara.',
    ],
    correct: 1,
    explanation:
      'Durante el Periodo Húmedo Africano («Sáhara verde»), la ganadería móvil de bóvidos y la cerámica se consolidaron milenios antes que la agricultura sedentaria de cereales. Posteriormente, varios focos africanos domesticaron de forma independiente mijo perla, sorgo, arroz africano, teff, enset, ñame y palma aceitera.',
  },
  {
    q: 'Según el análisis histórico, léxico (NTLLE) e iconográfico de los estereotipos sobre el canibalismo, ¿qué demuestra el rastreo de sus fuentes visuales y cartográficas?',
    options: [
      'Que el estereotipo nació en la África precolonial y el caldero metálico era un objeto cotidiano exclusivamente africano.',
      'Que el término «caníbal» surgió de un malentendido colombino de 1492 en América, el caldero procede de la iconografía europea del Infierno y la brujería (como la Biblia de Holkham), y el estigma se desplazó cartográficamente hacia África en los siglos XIX–XX.',
      'Que en la Prehistoria y la Edad Moderna europeas nunca existieron ni evidencias arqueológicas de antropofagia ni preparados medicinales como Mumia o Axungia hominis.',
      'Que la RAE eliminó en el siglo XVIII cualquier acepción de «salvaje» vinculada a la supuesta ausencia de cultura.',
    ],
    correct: 1,
    explanation:
      'La antropología visual y el NTLLE muestran que «caníbal» nace en el Caribe en 1492, que el caldero deriva de la iconografía medieval europea del Infierno y la sátira política (Robespierre, 1793), y que mientras Europa practicaba la farmacopea con Mumia/Axungia hominis y alberga evidencias prehistóricas (Atapuerca, El Sidrón), proyectó el estereotipo sobre América, el Pacífico y finalmente África durante el reparto colonial.',
  },
];

export interface BibliographyItem {
  citation: string;
  doi?: string;
  url?: string;
  urlLabel?: string;
}

export interface BibliographyCategory {
  category: string;
  items: BibliographyItem[];
}

export const BIBLIOGRAPHY_ENTRIES: BibliographyCategory[] = [
  {
    category: 'Obras de síntesis general y metodología historiográfica',
    items: [
      {
        citation:
          'UNESCO. (1982–1993 [ed. orig. 1981–1993]). Historia General de África (vols. I–VIII; dirs. J. Ki-Zerbo, G. Mokhtar, M. El Fasi y D. T. Niane). Madrid: Tecnos / UNESCO.',
      },
      {
        citation:
          'Ehret, C. (2002). The Civilizations of Africa: A History to 1800. Charlottesville: University Press of Virginia.',
      },
      {
        citation:
          'Fauvelle, F.-X. (2018). El rinoceronte de oro. Historias de la Edad Media africana. Barcelona: Crítica.',
      },
      {
        citation:
          'Vansina, J. (1985). Oral Tradition as History. Madison: University of Wisconsin Press.',
      },
    ],
  },
  {
    category: 'Orígenes humanos, arqueología africana y lingüística histórica',
    items: [
      {
        citation:
          'Harmand, S., Lewis, J. E., Feibel, C. S., et al. (2015). 3.3-million-year-old stone tools from Lomekwi 3, West Turkana, Kenya. Nature, 521(7552), 310–315.',
        doi: '10.1038/nature14464',
      },
      {
        citation:
          'Hublin, J.-J., Ben-Ncer, A., Bailey, S. E., et al. (2017). New fossils from Jebel Irhoud, Morocco and the pan-African origin of Homo sapiens. Nature, 546(7657), 289–292.',
        doi: '10.1038/nature22336',
      },
      {
        citation:
          'Scerri, E. M. L., Thomas, M. G., Manica, A., et al. (2018). Did our species evolve in subdivided populations across Africa, and why does it matter? Trends in Ecology & Evolution, 33(8), 582–594.',
        doi: '10.1016/j.tree.2018.05.005',
      },
      {
        citation:
          'Henshilwood, C. S., d’Errico, F., van Niekerk, K. L., et al. (2018). An abstract drawing from the 73,000-year-old levels at Blombos Cave, South Africa. Nature, 562(7725), 115–118.',
        doi: '10.1038/s41586-018-0514-3',
      },
      {
        citation:
          'Martinón-Torres, M., d’Errico, F., Santos, E., et al. (2021). Earliest known human burial in Africa. Nature, 593(7857), 95–100.',
        doi: '10.1038/s41586-021-03457-8',
      },
      {
        citation:
          'Vidal, C. M., Lane, C. S., Asrat, A., et al. (2022). Age of the oldest known Homo sapiens from eastern Africa. Nature, 601(7894), 579–583.',
        doi: '10.1038/s41586-021-04275-8',
      },
      {
        citation:
          'Potts, R., Behrensmeyer, A. K., Faith, J. T., Tryon, C. A., Brooks, A. S., Yellen, J. E., Deino, A. L., Kinyanjui, R., Clark, J. B., Haradon, C. M., Levin, N. E., Meijer, H. J. M., Veatch, E. G., Owen, R. B., y Renaut, R. W. (2018). Environmental dynamics during the onset of the Middle Stone Age in eastern Africa. Science, 360(6384), 86–90.',
        doi: '10.1126/science.aao2200',
      },
      {
        citation:
          'Smithsonian Institution, National Museum of Natural History. (2010–actualidad). Human Origins Program: What Does It Mean to Be Human? (Dir. R. Potts) [Base de datos de fósiles, línea temporal de 6 Ma, árbol familiar y colección 3D].',
        url: 'https://humanorigins.si.edu/',
        urlLabel: 'https://humanorigins.si.edu/',
      },
      {
        citation:
          'Lordkipanidze, D., Vekua, A., Ferring, R., Rightmire, G. P., Agusti, J., Kiladze, G., Mouskhelishvili, A., Nioradze, M., Ponce de León, M. S., Tappen, M., y Zollikofer, C. P. E. (2005). The earliest toothless hominin skull. Nature, 434(7034), 717–718.',
        doi: '10.1038/434717b',
      },
      {
        citation:
          'Clarkson, C., Jacobs, Z., Marwick, B., Fullagar, R., Wallis, L., Smith, M., Roberts, R. G., Hayes, E., Lowe, K., Carah, X., Florin, S. A., McNeil, J., Cox, D., Arnold, L. J., Hua, Q., Huntley, J., Brand, H. E. A., Manne, T., Fairbairn, A., … Pardoe, C. (2017). Human occupation of northern Australia by 65,000 years ago. Nature, 547(7663), 306–310.',
        doi: '10.1038/nature22968',
      },
      {
        citation:
          'Dillehay, T. D., Ramírez, C., Pino, M., Collins, M. B., Rossen, J., y Pino-Navarro, J. D. (2008). Monte Verde: Seaweed, food, medicine, and the peopling of South America. Science, 320(5877), 784–786.',
        doi: '10.1126/science.1156533',
      },
      {
        citation:
          'McIntosh, S. K. (Ed.). (1999). Beyond Chiefdoms: Pathways to Complexity in Africa. Cambridge: Cambridge University Press.',
      },
      {
        citation:
          'Breunig, P. (Ed.). (2014). Nok: African Sculpture in Archaeological Context. Fráncfort del Meno: Africa Magna Verlag.',
      },
      {
        citation:
          'Güldemann, T. (Ed.). (2018). The Languages and Linguistics of Africa. Berlín / Boston: De Gruyter Mouton.',
      },
    ],
  },
  {
    category: 'Paleogenómica y paleoproteómica humana',
    items: [
      {
        citation:
          'Schlebusch, C. M., Malmström, H., Günther, T., et al. (2017). Southern African ancient genomes estimate modern human divergence to 350,000 to 260,000 years ago. Science, 358(6363), 652–655.',
        doi: '10.1126/science.aao6266',
      },
      {
        citation:
          'van de Loosdrecht, M., Bouzouggar, A., Humphrey, L., et al. (2018). Pleistocene North African genomes link Near Eastern and sub-Saharan African human populations. Science, 360(6388), 548–552.',
        doi: '10.1126/science.aar8380',
      },
      {
        citation:
          'Lipson, M., Ribot, I., Mallick, S., et al. (2020). Ancient West African foragers in the context of African population history. Nature, 577(7792), 665–670.',
        doi: '10.1038/s41586-020-1929-1',
      },
      {
        citation:
          'Welker, F., Ramos-Madrigal, J., Gutenbrunner, P., et al. (2020). The dental proteome of Homo antecessor. Nature, 580(7802), 235–238.',
        doi: '10.1038/s41586-020-2153-8',
      },
      {
        citation:
          'Brielle, E. S., Fleisher, J., Wynne-Jones, S., et al. (2023). Entwined African and Asian genetic roots of medieval peoples of the Swahili coast. Nature, 615(7954), 866–873.',
        doi: '10.1038/s41586-023-05754-w',
      },
      {
        citation:
          'Salem, N., van de Loosdrecht, M. S., Sümer, A. P., et al. (2025). Ancient DNA from the Green Sahara reveals ancestral North African lineage. Nature, 641(8061), 144–150.',
        doi: '10.1038/s41586-025-08793-7',
      },
      {
        citation:
          'Madupe, P. P., Koenig, C., Patramanis, I., et al. (2025). Enamel proteins reveal biological sex and genetic variability in southern African Paranthropus. Science, 388(6750), 969–973.',
        doi: '10.1126/science.adt9539',
      },
      {
        citation:
          'Madupe, P. P., Munir, F., Dickinson, M., et al. (2025). Results from an Australopithecus africanus dental enamel fragment confirm the potential of palaeoproteomics for South African Plio-Pleistocene fossil sites. South African Journal of Science, 121(1/2), Art. #18571.',
        doi: '10.17159/sajs.2025/18571',
      },
      {
        citation:
          'Fu, Q., et al. (2025). The proteome of the late Middle Pleistocene Harbin individual. Science, 389(6761), 704–707.',
        doi: '10.1126/science.adu9677',
      },
      {
        citation:
          'Fu, Q., et al. (2025). Denisovan mitochondrial DNA from dental calculus of the >146,000-year-old Harbin cranium. Cell, 188(15), 3919–3926.e9.',
        doi: '10.1016/j.cell.2025.05.040',
      },
    ],
  },
  {
    category: 'Antropología, etología comparada, parentesco y subsistencia africana',
    items: [
      {
        citation:
          'Henke-von der Malsburg, J., Reeves, J. S., Proffitt, T., Falótico, T., Rufo, H., y Luncz, L. V. (2026). Social cues on stone tools outweigh raw material properties in wild primates. Proceedings of the Royal Society B, 293, 20260416.',
        doi: '10.1098/rspb.2026.0416',
      },
      {
        citation:
          'Fragaszy, D. M., Biro, D., Eshchar, Y., Humle, T., Izar, P., Resende, B., y Visalberghi, E. (2013). The fourth dimension of tool use: Temporally enduring artefacts aid primates learning to use tools. Philosophical Transactions of the Royal Society B, 368(1630), 20120410.',
        doi: '10.1098/rstb.2012.0410',
      },
      {
        citation:
          'Surbeck, M., Cheng, L., Kreyer, M., Gort, G., Mundry, R., Hohmann, G., y Fruth, B. (2025). Drivers of female power in bonobos. Communications Biology, 8, 550.',
        doi: '10.1038/s42003-025-07900-8',
      },
      {
        citation:
          'Bramble, D. M., y Lieberman, D. E. (2004). Endurance running and the evolution of Homo. Nature, 432(7015), 345–352.',
        doi: '10.1038/nature03052',
      },
      {
        citation:
          'Domínguez-Rodrigo, M. (2002). Hunting and scavenging by early humans: The state of the debate. Journal of World Prehistory, 16(1), 1–54.',
        doi: '10.1023/A:1014507129795',
      },
      {
        citation:
          'Tishkoff, S. A., Reed, F. A., Ranciaro, A., et al. (2007). Convergent adaptation of human lactase persistence in Africa and Europe. Nature Genetics, 39(1), 31–40.',
        doi: '10.1038/ng1946',
      },
      {
        citation:
          'Hawkes, K., O’Connell, J. F., Blurton Jones, N. G., Alvarez, H., y Charnov, E. L. (1998). Grandmothering, menopause, and the evolution of human life histories. Proceedings of the National Academy of Sciences (PNAS), 95(3), 1336–1339.',
        doi: '10.1073/pnas.95.3.1336',
      },
      {
        citation:
          'Hrdy, S. B. (2009). Mothers and Others: The Evolutionary Origins of Mutual Understanding. Cambridge, MA: Harvard University Press.',
      },
      {
        citation:
          'Red Temática Pastwomen. (2010–actualidad). Pastwomen: Historia material de las mujeres. Recursos para la investigación, la docencia y la divulgación de la arqueología de las mujeres y del género en la Prehistoria y la Antigüedad [Plataforma interuniversitaria UAB, UJA, UGR, UAM, UPF, UV y Universidad de Oviedo].',
        url: 'https://www.pastwomen.net/',
        urlLabel: 'https://www.pastwomen.net/',
      },
      {
        citation:
          'González Marcén, P., Montón Subías, S., y Picazo, M. (Eds.). (2008). Engendering Social Dynamics: The Archaeology of Maintenance Activities (BAR International Series 1862). Oxford: Archaeopress.',
      },
      {
        citation:
          'Sánchez Romero, M. (2022). Prehistorias de mujeres: Descubre lo que no te han contado sobre nosotras. Barcelona: Destino.',
      },
      {
        citation:
          'Rosenberg, K., y Trevathan, W. (2002). Birth, obstetrics and human evolution. BJOG: An International Journal of Obstetrics & Gynaecology, 109(11), 1199–1206.',
        doi: '10.1046/j.1471-0528.2002.00010.x',
      },
      {
        citation:
          'Spikins, P., Needham, A., Tilley, L., y Hitchens, G. (2018). Calculated or caring? Neanderthal healthcare in social context. World Archaeology, 50(3), 384–403.',
        doi: '10.1080/00438243.2018.1433060',
      },
      {
        citation:
          'Huffman, M. A. (1997). Current evidence for self-medication in primates: A multidisciplinary perspective. Yearbook of Physical Anthropology, 40, 171–200.',
        doi: '10.1002/(SICI)1096-8644(1997)25+<171::AID-AJPA7>3.0.CO;2-7',
      },
      {
        citation:
          'Pruetz, J. D., y Bertolani, P. (2007). Savanna chimpanzees, Pan troglodytes verus, hunt with tools. Current Biology, 17(5), 412–417.',
        doi: '10.1016/j.cub.2006.12.042',
      },
      {
        citation:
          'Sanz, C. M., y Morgan, D. B. (2007). Chimpanzee tool technology in the Goualougo Triangle, Republic of Congo. Journal of Human Evolution, 52(4), 420–433.',
        doi: '10.1016/j.jhevol.2006.11.001',
      },
      {
        citation:
          'Hobaiter, C., y Byrne, R. W. (2014). The meanings of chimpanzee gestures. Current Biology, 24(14), 1596–1600.',
        doi: '10.1016/j.cub.2014.05.066',
      },
      {
        citation:
          'Turner, V. (1969). The Ritual Process: Structure and Anti-Structure. Chicago: Aldine Publishing.',
      },
      {
        citation:
          'Evans-Pritchard, E. E. (1940). The Nuer: A Description of the Modes of Livelihood and Political Institutions of a Nilotic People. Oxford: Clarendon Press.',
      },
      {
        citation:
          'Marshall, F., y Hildebrand, E. (2002). Cattle before crops: The beginnings of food production in Africa. Journal of World Prehistory, 16(2), 99–143.',
        doi: '10.1023/A:1019954903395',
      },
      {
        citation:
          'Manning, K., Pelling, R., Higham, T., Schwenniger, J.-L., y Fuller, D. Q. (2011). 4500-year old domesticated pearl millet (Pennisetum glaucum) from the Tilemsi Valley, Mali: New insights into an alternative cereal domestication pathway. Journal of Archaeological Science, 38(2), 312–322.',
        doi: '10.1016/j.jas.2010.09.007',
      },
      {
        citation:
          'Dunne, J., Evershed, R. P., Salque, M., et al. (2012). First dairying in green Saharan Africa in the fifth millennium BC. Nature, 486(7403), 390–394.',
        doi: '10.1038/nature11186',
      },
    ],
  },
  {
    category: 'Comercio transregional y Estados precoloniales',
    items: [
      {
        citation:
          'Green, T. (2019). A Fistful of Shells: West Africa from the Rise of the Slave Trade to the Age of Revolution. Chicago: University of Chicago Press.',
      },
      {
        citation:
          'Lydon, G. (2009). On Trans-Saharan Trails: Islamic Law, Trade Networks, and Cross-Cultural Exchange in Nineteenth-Century Western Africa. Cambridge: Cambridge University Press.',
      },
      {
        citation:
          'Sheriff, A. (2010). Dhow Cultures of the Indian Ocean: Cosmopolitanism, Commerce and Islam. Londres: Hurst.',
      },
      {
        citation:
          'Austen, R. A. (2010). Trans-Saharan Africa in World History. Oxford: Oxford University Press.',
      },
    ],
  },
  {
    category: 'Antropología visual, imaginarios y deconstrucción de estereotipos',
    items: [
      {
        citation:
          'Becerra Romero, D. (2025). Imaginarios y viñetas como recurso para la recreación de la Historia de Canarias en Historia Moderna. Entre la realidad y el deseo. Hipogrifo. Revista de literatura y cultura del Siglo de Oro, 13(2), 307–323.',
        doi: '10.13035/H.2025.13.02.21',
      },
      {
        citation:
          'Becerra Romero, D. (2018). Antropofagia y viñeta: visión y enseñanza de y desde América Latina. En Á. Mateo del Pino y M. N. Pascual Soler (Eds.), Pasión caníbal. Documentos de cultura y de barbarie en América Latina (pp. 195–218). Buenos Aires: Ediciones Katatay.',
      },
      {
        citation:
          'Bartra, R. (2011). El mito del salvaje. Ciudad de México: Fondo de Cultura Económica.',
      },
      {
        citation:
          'Belting, H. (2010). Antropología de la imagen. Buenos Aires / Madrid: Katz Editores.',
      },
      {
        citation:
          'Chartier, R. (1992). El mundo como representación. Estudios sobre historia cultural. Barcelona: Gedisa.',
      },
      {
        citation:
          'Saladié, P., Huguet, R., Rodríguez-Hidalgo, A., Cáceres, I., Esteban-Nadal, M., Arsuaga, J. L., Bermúdez de Castro, J. M., y Carbonell, E. (2012). Intergroup cannibalism in the European Early Pleistocene: The range expansion and imbalance of power hypotheses. Journal of Human Evolution, 63(5), 682–695.',
        doi: '10.1016/j.jhevol.2012.07.004',
      },
      {
        citation:
          'Cáceres, I., Lozano, M., y Saladié, P. (2007). Evidence for Bronze Age cannibalism in El Mirador Cave (Sierra de Atapuerca, Burgos, Spain). American Journal of Physical Anthropology, 133(3), 899–917.',
        doi: '10.1002/ajpa.20610',
      },
      {
        citation:
          'Norikoshi, K. (1982). One observed case of cannibalism among wild chimpanzees of the Mahale Mountains. Primates, 23(1), 66–74.',
        doi: '10.1007/BF02381438',
      },
      {
        citation:
          'Sherrow, H. M., y Amsler, S. J. (2007). New intercommunity infanticides by the chimpanzees of Ngogo, Kibale National Park, Uganda. International Journal of Primatology, 28(1), 9–22.',
        doi: '10.1007/s10764-006-9112-6',
      },
    ],
  },
];
