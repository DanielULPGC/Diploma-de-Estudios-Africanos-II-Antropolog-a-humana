export interface SmithsonianMilestone {
  id: string;
  ageLabel: string;
  title: string;
  taxa: string;
  africanSites: string;
  brainRange: string;
  climateContext: string;
  evidenceSummary: string;
  smithsonianInsight: string;
  atlasTaxonId?: string;
  linkedTopicId: string;
}

export interface SmithsonianHumanTrait {
  id: string;
  englishName: string;
  spanishName: string;
  onsetMa: string;
  keyShift: string;
  africanEvidence: string;
  mosaicNote: string;
}

export interface OlorgesailiePhase {
  id: string;
  period: string;
  industry: string;
  transportDistance: string;
  pigmentsAndNetworks: string;
  environmentalShift: string;
}

export const SMITHSONIAN_PORTAL_URL = 'https://humanorigins.si.edu/';

export const SMITHSONIAN_STATS = [
  {
    label: 'Ventana evolutiva',
    value: '~6–7 Ma',
    detail: 'Árbol ramificado de homininos desde la divergencia con Pan',
    accent: 'lapis' as const,
  },
  {
    label: 'Rasgos en mosaico',
    value: '6 ejes',
    detail: 'Bipedismo, útiles, cuerpos, cerebros, vida social y símbolos',
    accent: 'ochre' as const,
  },
  {
    label: 'Registro Olorgesailie',
    value: '1,2 Ma – 320 ka',
    detail: 'Cuenca keniana del Rift excavada por el equipo de Rick Potts',
    accent: 'forest' as const,
  },
  {
    label: 'Red de intercambio MSA',
    value: '25 – 50+ km',
    detail: 'Transporte de obsidiana y pigmentos hace ~320–305 ka en Kenia',
    accent: 'ink' as const,
  },
];

export const SMITHSONIAN_MILESTONES: SmithsonianMilestone[] = [
  {
    id: 'si-6ma',
    ageLabel: '~6 Ma',
    title: 'Primeros homininos y bipedismo incipiente',
    taxa: 'Sahelanthropus tchadensis · Orrorin tugenensis · Ardipithecus kadabba / ramidus',
    africanSites: 'Toros-Menalla (Chad) · Colinas Tugen (Kenia) · Awash Medio (Etiopía)',
    brainRange: '~300–380 cm³',
    climateContext: 'Bosques cerrados y mosaicos arbolados del Mioceno final',
    evidenceSummary:
      'El árbol evolutivo humano se separa del linaje del chimpancé en África hace 6–7 Ma. Rasgos como la posición anterior del foramen magnum, el fémur proximal de Orrorin y la pelvis/pie de Ardipithecus ramidus (~4,4 Ma) documentan locomoción bípeda temprana combinada con trepa arbórea.',
    smithsonianInsight:
      'El Smithsonian subraya que el bipedismo fue la primera gran adaptación hominina y evolucionó en entornos arbolados diversos —no en una sabana uniforme—, millones de años antes de que creciera el cerebro.',
    atlasTaxonId: 'ardipithecus',
    linkedTopicId: 'tema-04',
  },
  {
    id: 'si-4ma',
    ageLabel: '~4 Ma',
    title: 'Consolidación del bipedismo habitual en hábitats cambiantes',
    taxa: 'Australopithecus anamensis · Australopithecus afarensis · Australopithecus africanus',
    africanSites: 'Kanapoi (Kenia) · Hadar (Etiopía) · Laetoli (Tanzania) · Sterkfontein (Sudáfrica)',
    brainRange: '~400–500 cm³',
    climateContext: 'Alternancia creciente entre bosque galería, matorral y sabana abierta',
    evidenceSummary:
      'Especies como Australopithecus afarensis (Lucy, AL 288-1) y las pisadas de Laetoli (~3,66 Ma) evidencian una marcha erguida eficiente con arco plantar y rodilla en valgo, manteniendo aún brazos largos útiles para trepar ante depredadores o buscar alimento arbóreo.',
    smithsonianInsight:
      'La coexistencia de múltiples especies de Australopithecus y posteriormente Paranthropus confirma que la evolución humana es un árbol frondoso y ramificado, nunca una escalera lineal.',
    atlasTaxonId: 'afarensis',
    linkedTopicId: 'tema-04',
  },
  {
    id: 'si-26ma',
    ageLabel: '~2,6 Ma',
    title: 'Tecnología lítica sistemática y ampliación de la dieta',
    taxa: 'Homo habilis · Homo rudolfensis · Paranthropus boisei (coexistentes)',
    africanSites: 'Gona y Hadar (Etiopía) · Lokalalei y Koobi Fora (Kenia) · Olduvai (Tanzania)',
    brainRange: '~510–750 cm³',
    climateContext: 'Incremento de la aridez y variabilidad estacional del Plio-Pleistoceno',
    evidenceSummary:
      'Las industrias olduvayenses (lascas cortantes, núcleos y percutores; con el precedente temprano de Lomekwi 3 a ~3,3 Ma) permiten cortar carne, fracturar huesos para extraer médula y procesar vegetales duros, ampliando drásticamente la flexibilidad dietética.',
    smithsonianInsight:
      'El acceso a alimentos de alta densidad calórica mediante herramientas redujo la dependencia de un único nicho vegetal y abrió un horizonte energético nuevo para el género Homo.',
    atlasTaxonId: 'habilis',
    linkedTopicId: 'tema-05',
  },
  {
    id: 'si-189ma',
    ageLabel: '~1,89 Ma',
    title: 'Cuerpos altos de larga distancia, Achelense y salida de África',
    taxa: 'Homo erectus / Homo ergaster',
    africanSites: 'Nariokotome / Turkana Occidental (KNM-WT 15000, Kenia) · Olorgesailie · Olduvai',
    brainRange: '~750–1.100 cm³',
    climateContext: 'Pulsos húmedo-secos intensos en el Rift Oriental',
    evidenceSummary:
      'Homo erectus presenta proporciones corporales plenamente terrestres (piernas largas y brazos más cortos, visibles en el joven de Turkana), fabrica bifaces achelenses (~1,76 Ma), comienza a controlar el fuego (~1,0–0,8 Ma) y se expande por primera vez fuera de África hacia Eurasia.',
    smithsonianInsight:
      'El aumento de tamaño corporal y cerebral elevó el gasto energético diario, haciendo indispensables el procesado de alimentos, el cuidado prolongado y la cooperación grupal.',
    atlasTaxonId: 'erectus',
    linkedTopicId: 'tema-04',
  },
  {
    id: 'si-800ka',
    ageLabel: '800 – 200 ka',
    title: 'Expansión cerebral acelerada bajo fluctuación climática extrema',
    taxa: 'Homo heidelbergensis · Homo naledi · Homo sapiens arcaico',
    africanSites: 'Olorgesailie (Kenia) · Bodo (Etiopía) · Kabwe (Zambia) · Rising Star (Sudáfrica)',
    brainRange: '~1.100–1.400 cm³',
    climateContext: 'Oscilaciones glaciales-interglaciales de gran amplitud (ciclos de 100 ka)',
    evidenceSummary:
      'Entre 800.000 y 200.000 años atrás se produce la aceleración más rápida en el tamaño cerebral humano, acompañada de hogares domésticos regulares, lanzas compuestas, caza cooperativa de fauna grande y mayor complejidad social.',
    smithsonianInsight:
      'Los datos paleoclimáticos recopilados por el Smithsonian muestran que el salto encefálico no coincidió con un clima estable, sino con el intervalo de mayor volatilidad ambiental de los últimos 6 Ma.',
    atlasTaxonId: 'heidelbergensis',
    linkedTopicId: 'tema-03',
  },
  {
    id: 'si-320ka',
    ageLabel: '320 – 300 ka',
    title: 'Innovación conductual africana: Olorgesailie y origen panafricano de Homo sapiens',
    taxa: 'Homo sapiens temprano',
    africanSites: 'Cuenca de Olorgesailie (Kenia) · Jebel Irhoud (Marruecos) · Omo Kibish (Etiopía)',
    brainRange: '~1.300–1.450 cm³',
    climateContext: 'Disrupción ambiental severa y fragmentación de lagos en el Rift keniano',
    evidenceSummary:
      'En Olorgesailie (~320–305 ka), el equipo del Smithsonian documentó la transición desde grandes bifaces achelenses hacia puntas finas del Paleolítico Medio Africano (MSA), transporte de obsidiana desde canteras a 25–50+ km y uso de pigmentos negros y rojos (manganeso y ocre), sincrónico con los fósiles de Jebel Irhoud (~315 ka).',
    smithsonianInsight:
      'Prueba que las redes sociales de intercambio a larga distancia y el uso simbólico de pigmentos surgieron en África como estrategia adaptativa frente a crisis ecológicas hace más de 300.000 años.',
    atlasTaxonId: 'sapiens',
    linkedTopicId: 'tema-07',
  },
  {
    id: 'si-12ka',
    ageLabel: '~12 ka – presente',
    title: 'Domesticación, redes globales y transformación planetaria',
    taxa: 'Homo sapiens',
    africanSites: 'Sáhara verde (Takarkori, Nabta Playa) · Valle de Tilemsi (Malí) · Tierras altas etíopes',
    brainRange: '~1.350 cm³ (media moderna)',
    climateContext: 'Estabilización del Holoceno y Periodo Húmedo Africano',
    evidenceSummary:
      'Tras dispersarse por todos los continentes, las poblaciones de Homo sapiens domesticaron de forma independiente plantas y animales —en África primero ganadería bovina y cerámica, seguidas de mijo perla, sorgo, arroz africano y teff— multiplicando la densidad demográfica.',
    smithsonianInsight:
      'De las más de 20 especies conocidas en nuestro árbol familiar, Homo sapiens es la única superviviente: el resultado de millones de años de adaptabilidad biológica, tecnológica y social nacida en África.',
    atlasTaxonId: 'sapiens',
    linkedTopicId: 'tema-10',
  },
];

export const SMITHSONIAN_HUMAN_TRAITS: SmithsonianHumanTrait[] = [
  {
    id: 'trait-walking',
    englishName: 'Walking Upright',
    spanishName: 'Caminar erguido',
    onsetMa: '~6 – 4 Ma',
    keyShift: 'Adaptación temprana a la locomoción bípeda con manos libres para portar alimento, útiles y crías.',
    africanEvidence: 'Foramen magnum de Sahelanthropus, pelvis de Ardipithecus y huellas de Laetoli (Tanzania).',
    mosaicNote: 'Aparece millones de años antes del gran aumento cerebral.',
  },
  {
    id: 'trait-tools',
    englishName: 'Tools & Food',
    spanishName: 'Herramientas y alimentación',
    onsetMa: '~3,3 – 2,6 Ma',
    keyShift: 'Transición de cantos y lascas olduvayenses a bifaces achelenses, puntas MSA y cocción al fuego.',
    africanEvidence: 'Lomekwi 3, Gona, Olduvai, Olorgesailie y hogares tempranos de Wonderwerk (Sudáfrica).',
    mosaicNote: 'Amplía radicalmente la variedad de recursos accesibles ante crisis estacionales.',
  },
  {
    id: 'trait-bodies',
    englishName: 'Bodies',
    spanishName: 'Cuerpos en transformación',
    onsetMa: '~1,9 Ma',
    keyShift: 'Extremidades inferiores largas, termorregulación por sudoración y aparato digestivo reducido.',
    africanEvidence: 'Esqueleto de Nariokotome (KNM-WT 15000, Kenia) adaptado a largas caminatas y carrera en sabana.',
    mosaicNote: 'Equilibra eficacia locomotora con restricciones obstétricas y coste metabólico.',
  },
  {
    id: 'trait-brains',
    englishName: 'Brains',
    spanishName: 'Cerebros grandes y complejos',
    onsetMa: '800 – 200 ka (pico)',
    keyShift: 'Triplicación progresiva del volumen encefálico respecto a los primeros homininos (~400 → 1.350 cm³).',
    africanEvidence: 'Serie craneal africana desde A. afarensis y H. habilis hasta Bodo y Jebel Irhoud.',
    mosaicNote: 'Su máxima aceleración coincide con las mayores oscilaciones climáticas del Pleistoceno.',
  },
  {
    id: 'trait-social',
    englishName: 'Social Life',
    spanishName: 'Vida social y redes de intercambio',
    onsetMa: 'Aceleración 800 – 300 ka',
    keyShift: 'Hogares compartidos, cuidado de infancia/mayores y alianzas intergrupales a decenas de kilómetros.',
    africanEvidence: 'Obsidiana transportada 25–50+ km en Olorgesailie (~320 ka) y cuidados paleopatológicos.',
    mosaicNote: 'Las redes sociales amortiguan el riesgo local cuando fallan los recursos de un territorio.',
  },
  {
    id: 'trait-symbols',
    englishName: 'Language & Symbols',
    spanishName: 'Lenguaje y pensamiento simbólico',
    onsetMa: '>300 – 73 ka',
    keyShift: 'Uso de pigmentos minerales, adornos personales, grabados abstractos y comunicación simbólica compleja.',
    africanEvidence: 'Pigmentos en Olorgesailie (~320 ka), cuentas y ocre grabado de Blombos (Sudáfrica, ~100–73 ka).',
    mosaicNote: 'Consolida identidades compartidas, memoria acumulativa y transmisión cultural rápida.',
  },
];

export const OLORGESAILIE_TRANSITION_PHASES: OlorgesailiePhase[] = [
  {
    id: 'olor-achelense',
    period: '1,2 Ma – 500 ka',
    industry: 'Achelense clásico (grandes bifaces de mano)',
    transportDistance: 'Local (<5 km de afloramientos volcánicos)',
    pigmentsAndNetworks: 'Sin evidencia sistemática de pigmentos ni redes de intercambio extensas',
    environmentalShift: 'Alternancia lacustre-fluvial moderada con fauna de grandes herbívoros especializados',
  },
  {
    id: 'olor-transicion',
    period: '500 – 320 ka',
    industry: 'Hiato erosivo y reorganización ecológica severa',
    transportDistance: 'Inestabilidad tectónica y climática extrema en el Rift keniano',
    pigmentsAndNetworks: 'Extinción o reemplazo de ~85 % de la megafauna herbívora local especializada',
    environmentalShift: 'Oscilaciones bruscas entre periodos muy húmedos y sequías prolongadas',
  },
  {
    id: 'olor-msa',
    period: '320 – 305 ka',
    industry: 'Paleolítico Medio Africano (MSA): puntas finas, lascas Levallois y útiles enmangables',
    transportDistance: 'Obsidiana importada desde 25–50+ km de distancia',
    pigmentsAndNetworks: 'Uso intencional de pigmentos negros (manganeso) y rojos (ocre) con trazas de raspado',
    environmentalShift: 'Respuesta humana mediante flexibilidad tecnológica y redes sociales de larga distancia',
  },
];
