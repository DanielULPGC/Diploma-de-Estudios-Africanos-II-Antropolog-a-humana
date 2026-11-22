export interface SyllabusComparisonRow {
  dimension: string;
  colA: string;
  colB: string;
}

export interface SyllabusCrossLink {
  label: string;
  sectionId: string;
}

export interface AnthropologyTopic {
  num: string;
  id: string;
  shortTitle: string;
  officialTitle: string;
  block: 'Fundamentos y biología evolutiva' | 'Origen, mente y diversidad' | 'Cultura, parentesco y subsistencia';
  guidingQuestions: string[];
  leadSummary: string;
  bodyParagraphs: string[];
  glossaryTermIds: Array<{ id: string; label: string }>;
  comparisonTitle: string;
  comparisonHeaders: [string, string, string];
  comparisonRows: SyllabusComparisonRow[];
  africanCaseTitle: string;
  africanCaseRegion: string;
  africanCaseText: string;
  crossLinks: SyllabusCrossLink[];
  keyReferences: string;
}

export const ANTHROPOLOGY_SYLLABUS_TOPICS: AnthropologyTopic[] = [
  {
    num: '01',
    id: 'tema-01',
    shortTitle: 'Antropología, cultura y humanización',
    officialTitle:
      'La antropología: conceptos, teorías y herramientas de análisis. La noción de cultura y la cultura humana. La hominización y la humanización',
    block: 'Fundamentos y biología evolutiva',
    guidingQuestions: [
      '¿Qué estudia la antropología y con qué herramientas metodológicas analiza las sociedades humanas?',
      '¿Qué distingue la noción antropológica de cultura frente a su uso cotidiano o elitista?',
      '¿Cómo se articulan la hominización biológica y la humanización sociocultural?',
    ],
    leadSummary:
      'La antropología aborda al ser humano de forma holística integrando biología, historia, lenguaje y organización social. Superando el evolucionismo unilineal colonial, combina trabajo de campo etnográfico, método comparativo y registro arqueológico para comprender cómo biología y cultura coevolucionaron en África.',
    bodyParagraphs: [
      'Como disciplina moderna, la antropología se articula en cuatro grandes campos complementarios: antropología biológica o paleoantropología, arqueología, antropología lingüística y antropología social y cultural. A lo largo de los siglos XIX y XX sus marcos teóricos evolucionaron desde el evolucionismo unilineal —que jerarquizaba erróneamente a las sociedades africanas— hacia el particularismo histórico (Franz Boas), el funcionalismo y estructural-funcionalismo desarrollados en buena medida en África (Bronisław Malinowski, A. R. Radcliffe-Brown, E. E. Evans-Pritchard), el estructuralismo (Claude Lévi-Strauss) y la antropología simbólica e interpretativa (Victor Turner, Clifford Geertz). Sus herramientas centrales son la etnografía, la observación participante prolongada, el método genealógico, el análisis comparativo y la distinción entre perspectiva emic (categorías internas de la comunidad) y etic (análisis externo comparativo), guiadas por el relativismo metodológico.',
      'Desde la definición clásica de Edward B. Tylor hasta las formulaciones contemporáneas, la cultura no equivale a «erudición», sino al conjunto aprendido, compartido y simbólicamente estructurado de conocimientos, técnicas, normas, creencias e instituciones que cada generación transmite y transforma. La cultura humana destaca por su carácter acumulativo («efecto trinquete»): innovaciones sucesivas se conservan y perfeccionan colectivamente a escalas que ninguna otra especie alcanza.',
      'Para analizar el origen humano resulta imprescindible diferenciar dos procesos entrelazados pero analíticamente distintos: la hominización designa el proceso biológico-evolutivo de transformación anatómica y genética (bipedismo, reducción canina, encefalización, reorganización cerebral y manual); la humanización designa el proceso sociocultural, cognitivo y simbólico (lenguaje articulado, normas morales, parentesco, ritual, arte y producción de sentido) que retroalimenta a la propia biología mediante coevolución gen-cultura.',
    ],
    glossaryTermIds: [
      { id: 'hominizacion-humanizacion', label: 'Hominización y humanización' },
      { id: 'cultura-antropologica', label: 'Cultura en antropología' },
      { id: 'triangulacion-fuentes', label: 'Triangulación de fuentes' },
    ],
    comparisonTitle: 'Articulación analítica: Hominización frente a Humanización',
    comparisonHeaders: ['Dimensión', 'Hominización (eje biológico)', 'Humanización (eje sociocultural)'],
    comparisonRows: [
      {
        dimension: 'Naturaleza del proceso',
        colA: 'Cambios anatómicos, fisiológicos y genéticos moldeados por selección natural, deriva y flujo génico.',
        colB: 'Construcción de sistemas simbólicos, normas, lenguaje, instituciones y técnicas acumulativas.',
      },
      {
        dimension: 'Mecanismo de transmisión',
        colA: 'Herencia genética vertical entre progenitores y descendencia a escala de miles de generaciones.',
        colB: 'Aprendizaje social horizontal, oblicuo y vertical que permite cambios rápidos en pocas generaciones.',
      },
      {
        dimension: 'Evidencias principales',
        colA: 'Fósiles craneales y postcraneales, icnitas, paleogenómica y paleoproteómica.',
        colB: 'Industrias líticas complejas, pigmentos, adornos, enterramientos, tradiciones orales y etnografía.',
      },
      {
        dimension: 'Relación mutua',
        colA: 'Genera el sustrato neuroanatómico y biomecánico (mano prensil, aparato fonador, cerebro plástico).',
        colB: 'Modifica el nicho ecológico (cocinado, pastoralismo, cuidado social) alterando presiones selectivas.',
      },
    ],
    africanCaseTitle: 'África en el nacimiento de la etnografía moderna y su giro crítico',
    africanCaseRegion: 'África Oriental, Central y Occidental',
    africanCaseText:
      'Buena parte de la teoría antropológica del siglo XX —sistemas políticos sin Estado en los Nuer (Sudán del Sur), simbolismo ritual en los Ndembu (Zambia) o racionalidad mítica en los Azande— se forjó en trabajo de campo africano. Posteriormente, antropólogos e historiadores africanos (como Cheikh Anta Diop, Kwame Anthony Appiah, Archie Mafeje o Ifi Amadiume) cuestionaron los sesgos coloniales y renovaron la disciplina desde epistemologías propias del continente.',
    crossLinks: [
      { label: 'Ir a Historiografía y fuentes', sectionId: 'sec-historiografia' },
      { label: 'Ir a Atlas de Paleoantropología', sectionId: 'sec-atlas-paleo' },
    ],
    keyReferences:
      'Boas (1911); Geertz (1973); Kottak (2019); Tomasello (1999); Mafeje (1998).',
  },
  {
    num: '02',
    id: 'tema-02',
    shortTitle: '¿Somos primates? ¿Qué nos hace humanos?',
    officialTitle: '¿Somos primates? ¿Qué nos hace humanos?',
    block: 'Fundamentos y biología evolutiva',
    guidingQuestions: [
      '¿Qué lugar ocupamos dentro del orden de los primates y qué rasgos compartimos con los grandes simios africanos?',
      '¿Dónde reside la continuidad evolutiva y dónde emergen las singularidades humanas?',
    ],
    leadSummary:
      'Biológicamente somos primates catarrinos y grandes simios africanos: compartimos un ancestro común reciente (~7–6 Ma) con chimpancés y bonobos y más del 98,8 % de identidad en las regiones alineables del ADN. Lo humano no nace de una ruptura absoluta, sino de la amplificación sinérgica de capacidades primates.',
    bodyParagraphs: [
      'La taxonomía moderna nos sitúa dentro del orden Primates, suborden Haplorrhini, infraorden Simiiformes, superfamilia Hominoidea y familia Hominidae junto a orangutanes, gorilas, chimpancés y bonobos. Heredamos de nuestros antepasados arborícolas rasgos fundamentales: visión binocular y cromática con órbitas frontales, clavículas móviles, manos prensiles con pulgar oponible y uñas planas en lugar de garras, cerebros proporcionalmente grandes, gestación prolongada y una intensa vida social basada en alianzas y reconocimiento individual.',
      'La etología de campo en África (Jane Goodall en Gombe, Christophe Boesch en Taï, Takayoshi Kano en Wamba) desmontó viejas fronteras rígidas: los grandes simios africanos fabrican y seleccionan herramientas, transmiten tradiciones culturales entre generaciones, practican caza cooperativa, muestran empatía y negocian coaliciones políticas. Incluso los capuchinos neotropicales confirman por convergencia que las pistas sociales grabadas sobre piedras pueden pesar más que la propia dureza de la roca (Henke-von der Malsburg et al., 2026).',
      '¿Qué nos hace entonces singularmente humanos? No un único rasgo aislado, sino un paquete coevolutivo integrado: el bipedismo obligado eficiente, el lenguaje simbólico recursivo capaz de referirse a lo ausente o imaginario, la enseñanza activa y la cultura acumulativa de alta fidelidad, y una cooperación a gran escala entre individuos sin parentesco biológico directo sostenida por normas compartidas e instituciones.',
    ],
    glossaryTermIds: [
      { id: 'hominino-hominoideo', label: 'Hominino frente a Hominoideo' },
      { id: 'etologia-comparada', label: 'Etología comparada de primates' },
      { id: 'arqueologia-primates', label: 'Arqueología de primates' },
    ],
    comparisonTitle: 'Continuidad primate y singularidad emergente humana',
    comparisonHeaders: ['Ámbito', 'Herencia compartida con primates africanos', 'Innovación derivada en el linaje humano'],
    comparisonRows: [
      {
        dimension: 'Genética y filogenia',
        colA: 'Clado africano compartido con Pan troglodytes y Pan paniscus (~7–6 Ma); ~98,8 % de identidad de secuencia.',
        colB: 'Cambios regulatorios clave en desarrollo cortical, metabolismo cerebral, locomoción y fonación.',
      },
      {
        dimension: 'Tecnología y cultura',
        colA: 'Tradiciones locales de cascanueces líticos, pesca de termitas, conformidad cultural y facilitación local.',
        colB: 'Talla concoidea seriada, útiles compuestos, control del fuego y cultura acumulativa multigeneracional.',
      },
      {
        dimension: 'Comunicación',
        colA: 'Llamadas referenciales, gestos intencionales y lectura de estados de atención en congéneres.',
        colB: 'Lenguaje doblemente articulado, sintaxis recursiva, desplazamiento temporal y narrativa mítica.',
      },
      {
        dimension: 'Cooperación social',
        colA: 'Coaliciones, acicalamiento, reparto selectivo y defensa territorial en grupos pequeños.',
        colB: 'Aloparentalidad intensa, división del trabajo, redes de intercambio supralocales y normas morales.',
      },
    ],
    africanCaseTitle: 'El triángulo africano de los grandes simios: Taï, Gombe y Wamba',
    africanCaseRegion: 'Costa de Marfil, Tanzania y R. D. del Congo',
    africanCaseText:
      'Estudiar conjuntamente al chimpancé occidental de Taï (cascanueces con piedra y madera con más de 4.300 años de registro arqueológico), al chimpancé oriental de Gombe (cadenas operativas vegetales) y al bonobo de Wamba (alta tolerancia social y coaliciones femeninas) evita proyectar un único estereotipo sobre el último ancestro común entre humanos y paninos.',
    crossLinks: [
      { label: 'Explorar módulo de Etología (#etologia)', sectionId: 'etologia' },
      { label: 'Ver Parentesco en Atlas Paleo', sectionId: 'sec-atlas-paleo' },
    ],
    keyReferences:
      'Whiten et al. (1999); Tomasello (2014); Luncz et al. (2016); Henke-von der Malsburg et al. (2026).',
  },
  {
    num: '03',
    id: 'tema-03',
    shortTitle: 'África, cuna y mecanismos evolutivos',
    officialTitle:
      'África, la cuna de la humanidad: ¿por qué en África? ¿somos el resultado de la evolución? ¿cómo actúa la evolución en los humanos?',
    block: 'Fundamentos y biología evolutiva',
    guidingQuestions: [
      '¿Por qué los fósiles y genomas sitúan el origen de los homininos y de Homo sapiens en África?',
      '¿Somos la «meta» de la evolución o una rama contingente de un árbol muy ramificado?',
      '¿Cómo siguen actuando hoy la selección natural, la deriva y la coevolución gen-cultura en nuestra especie?',
    ],
    leadSummary:
      'África no es la cuna de la humanidad por azar geográfico, sino porque allí evolucionaron nuestros parientes hominoideos más próximos en un continente vasto, ecológicamente diverso y sometido a pulsos climáticos que favorecieron la innovación y la plasticidad adaptativa.',
    bodyParagraphs: [
      '¿Por qué en África? En primer lugar, por historia filogenética: los grandes simios más emparentados con nosotros (gorilas, chimpancés y bonobos) evolucionaron en África. En segundo lugar, por ecología y escala: la tectónica del Valle del Rift Oriental y las oscilaciones orbitales (ciclos de Milankovitch) crearon un mosaico dinámico de selvas, bosques galería, lagos cambiantes y sabanas abiertas que impulsaron la «selección por variabilidad» (Rick Potts), premiando la flexibilidad conductual y dietética. Además, las cuencas volcánicas del Rift y las cuevas kársticas de Sudáfrica ofrecieron condiciones geológicas idóneas para conservar y datar fósiles desde hace ~7 millones de años.',
      '¿Somos el resultado de la evolución? Sí, pero no su destino final ni la cumbre de una escalera predeterminada. Durante la mayor parte de los últimos 6 millones de años coexistieron varias especies de homininos a la vez (por ejemplo, Paranthropus boisei, Homo habilis y Homo erectus en Turkana y Olduvai). Nuestra condición de única especie humana viva actual es una anomalía muy reciente (~40–30 ka), fruto de contingencias demográficas, climáticas y evolutivas.',
      '¿Cómo actúa la evolución en los humanos? Operan los mismos mecanismos que en el resto de la biosfera —mutación, selección natural, deriva genética y flujo génico—, pero profundamente modulados por la cultura. África alberga ejemplos clásicos de evolución reciente y coevolución gen-cultura: la persistencia de la lactasa surgida de forma independiente en poblaciones ganaderas de África Oriental y el Sáhara; la selección equilibradora del alelo de la hemoglobina S (HbS) frente a la malaria por Plasmodium falciparum; la adaptación a la hipoxia en las tierras altas de Etiopía; y el gradiente latitudinal de pigmentación cutánea que equilibra la protección del folato frente a la radiación UV con la síntesis de vitamina D.',
    ],
    glossaryTermIds: [
      { id: 'seleccion-variabilidad', label: 'Selección por variabilidad' },
      { id: 'ciclos-orbitales', label: 'Ciclos orbitales y Sáhara verde' },
      { id: 'flujo-genico', label: 'Flujo génico (introgresión)' },
    ],
    comparisonTitle: 'Cómo actúa la evolución en poblaciones humanas: cuatro fuerzas clave',
    comparisonHeaders: ['Mecanismo evolutivo', 'Dinámica biológica', 'Ejemplo africano documentado'],
    comparisonRows: [
      {
        dimension: 'Selección natural y coevolución gen-cultura',
        colA: 'Aumenta la frecuencia de variantes ventajosas en un entorno ecológico o cultural concreto.',
        colB: 'Persistencia de la lactasa (variante C-14010 y otras) en pastores de África Oriental; protección frente a malaria (HbS, Duffy).',
      },
      {
        dimension: 'Selección por variabilidad ambiental',
        colA: 'Favorece la plasticidad dietética y cognitiva ante climas cambiantes en lugar de la hiperespecialización.',
        colB: 'Oscilaciones húmedo-áridas del Rift y del Sáhara verde durante el Plio-Pleistoceno.',
      },
      {
        dimension: 'Deriva genética y efecto fundador',
        colA: 'Cambios aleatorios en frecuencias alélicas amplificados al reducirse el tamaño poblacional.',
        colB: 'La salida fuera de África (~50–70 ka) redujo drásticamente la diversidad genética no africana frente al acervo africano.',
      },
      {
        dimension: 'Flujo génico e hibridación',
        colA: 'Intercambio genético entre subpoblaciones conectadas por corredores ecológicos.',
        colB: 'Estructura panafricana en red de Homo sapiens y señales de linajes profundos en África Occidental y Central (Shum Laka).',
      },
    ],
    africanCaseTitle: 'El caso de la persistencia de la lactasa y la hipoxia etíope',
    africanCaseRegion: 'África Oriental (Kenia, Tanzania y Etiopía)',
    africanCaseText:
      'La expansión del pastoralismo en África Oriental ilustra que la evolución humana no se detuvo con la cultura: cuando las comunidades domesticaron ganado bovino y consumieron leche fresca, distintas mutaciones reguladoras del gen LCT experimentaron una de las presiones de selección positiva más intensas detectadas en el genoma humano en los últimos ~7.000 años.',
    crossLinks: [
      { label: 'Ir a Atlas de Paleobotánica', sectionId: 'sec-atlas-paleobotanica' },
      { label: 'Ir a Aparato Paleomolecular', sectionId: 'sec-paleomolecular' },
    ],
    keyReferences:
      'Potts (1998); Tishkoff et al. (2007); Jablonski y Chaplin (2010); Scerri et al. (2018).',
  },
  {
    num: '04',
    id: 'tema-04',
    shortTitle: 'Bipedismo y «Nacidos para correr»',
    officialTitle:
      'El primer paso: Monos bípedos. ¿Dónde y por qué surge el bipedismo? Nacidos para correr.',
    block: 'Fundamentos y biología evolutiva',
    guidingQuestions: [
      '¿Qué transformaciones anatómicas permiten identificar el bipedismo temprano en el registro fósil africano?',
      '¿Por qué las pruebas paleobotánicas obligaron a revisar la vieja «hipótesis de la sabana»?',
      '¿Qué adaptaciones convirtieron a Homo erectus y Homo sapiens en corredores de resistencia?',
    ],
    leadSummary:
      'El bipedismo precedió en varios millones de años al gran cerebro y a la industria lítica compleja. Surgió en mosaicos arbolados africanos (~7–4 Ma) como locomoción mixta eficiente, y millones de años después (~2 Ma) dio paso a la biomecánica especializada de la carrera de resistencia.',
    bodyParagraphs: [
      'Las primeras pistas de postura erguida aparecen ya en homininos basales africanos: la posición más anterior del foramen magnum en Sahelanthropus tchadensis (~7–6 Ma, Chad), la morfología femoral de Orrorin tugenensis (~6 Ma, Kenia) y la pelvis en mosaico de Ardipithecus ramidus (~4,4 Ma, Etiopía), que combinaba desplazamiento bípedo en el suelo con un hallux (dedo gordo del pie) aún oponible para trepar. Con Australopithecus afarensis (Lucy, ~3,2 Ma) y las icnitas volcánicas de Laetoli (Tanzania, ~3,66 Ma) se constata un bipedismo habitual consolidado: pelvis corta y ancha en forma de cuenca, fémur inclinado hacia la rodilla (ángulo bicondilar o valgo), columna con curvatura lumbar y pie con arco longitudinal y dedo gordo alineado.',
      '¿Dónde y por qué surge el bipedismo? La hipótesis clásica de la sabana abierta ha sido matizada por la paleobotánica: Ardipithecus y los primeros Australopithecus vivieron en bosques galería y mosaicos arbolados. Hoy se consideran explicaciones multifactoriales: menor coste energético en desplazamientos entre parches de alimento (Rodman y McHenry), liberación de las manos para transportar comida y crías (Owen Lovejoy), mejor termorregulación corporal reduciendo la superficie expuesta al sol cenital (Peter Wheeler) y eficiencia al recolectar frutos en ramas bajas y el suelo (Kevin Hunt).',
      'Hace ~2 millones de años, con la expansión de sabanas abiertas y el surgimiento de Homo erectus/ergaster (como el joven de Nariokotome, Kenia), el cuerpo humano experimenta una segunda revolución locomotora sintetizada en la hipótesis «Nacidos para correr» (Bramble y Lieberman, 2004). Frente a la marcha austrolopitecina, el género Homo desarrolla piernas largas, un tendón de Aquiles elástico que almacena energía, arco plantar resiliente, ligamento nucal que estabiliza la cabeza al correr, glúteo mayor potente, cintura estrecha que contrarresta la torsión y millones de glándulas sudoríparas ecrinas sobre una piel casi sin pelo. Esta ingeniería convirtió a los humanos en corredores de resistencia capaces de practicar la caza por persistencia bajo el calor africano, agotando presas cuadrúpedas que solo pueden disipar calor jadeando.',
    ],
    glossaryTermIds: [
      { id: 'bipedismo-carrera-resistencia', label: 'Bipedismo y carrera de resistencia' },
      { id: 'bosque-galeria', label: 'Bosque galería y mosaico ecológico' },
      { id: 'paleosuelos', label: 'Paleosuelos' },
    ],
    comparisonTitle: 'De los «monos bípedos» a «nacidos para correr»: dos fases biomecánicas',
    comparisonHeaders: ['Rasgo anatómico / ecológico', 'Bipedismo temprano (Ardipithecus / Australopithecus)', 'Carrera de resistencia (Homo erectus / sapiens)'],
    comparisonRows: [
      {
        dimension: 'Hábitat principal',
        colA: 'Bosques galería, zonas lacustres y mosaicos arbolados (~6–3 Ma).',
        colB: 'Expansión de sabanas abiertas y ambientes estacionales cálidos (~2 Ma en adelante).',
      },
      {
        dimension: 'Proporciones corporales',
        colA: 'Estatura baja (~1,0–1,4 m), brazos relativamente largos y falanges aún curvas para trepar.',
        colB: 'Cuerpo estilizado y piernas largas; reducción de antebrazos y cintura estrecha móvil.',
      },
      {
        dimension: 'Pie y estabilización',
        colA: 'Transición de hallux oponible (Ardipithecus) a arco incipiente y pie rígido (Laetoli).',
        colB: 'Arco plantar elástico, tendón de Aquiles largo, ligamento nucal y conductos semicirculares ampliados.',
      },
      {
        dimension: 'Termorregulación y estrategia',
        colA: 'Reducción de radiación solar cenital en desplazamientos cortos entre recursos vegetales.',
        colB: 'Sudoración ecrina masiva sin pelaje denso: capacidad para carrera prolongada y caza por persistencia.',
      },
    ],
    africanCaseTitle: 'Las huellas de Laetoli (~3,66 Ma) y el joven de Nariokotome (~1,53 Ma)',
    africanCaseRegion: 'Tanzania y Lago Turkana (Kenia)',
    africanCaseText:
      'Las cenizas volcánicas húmedas de Laetoli preservaron una senda de 27 metros con pasos bípedos de dedo gordo alineado un millón de años antes de que el cerebro creciera significativamente. Dos millones de años después, el esqueleto casi completo de KNM-WT 15000 (Nariokotome) muestra ya proporciones modernas adaptadas a recorrer largas distancias bajo el sol ecuatorial.',
    crossLinks: [
      { label: 'Explorar fósiles en Atlas Paleo', sectionId: 'sec-atlas-paleo' },
      { label: 'Ver evolución de sabanas C4', sectionId: 'sec-atlas-paleobotanica' },
    ],
    keyReferences:
      'Lovejoy (1981, 2009); Leakey y Hay (1979); Bramble y Lieberman (2004); Lieberman (2013).',
  },
  {
    num: '05',
    id: 'tema-05',
    shortTitle: 'Primeras herramientas y carroñeros aptos',
    officialTitle:
      'Los primeros fabricantes de herramientas de África: carroñeros más aptos.',
    block: 'Fundamentos y biología evolutiva',
    guidingQuestions: [
      '¿Qué tecnologías líticas inauguran el registro arqueológico africano entre 3,3 y 1,7 Ma?',
      '¿Por qué las primeras herramientas permitieron convertirse en «carroñeros más aptos» y cómo impactó esto en la biología humana?',
    ],
    leadSummary:
      'Las lascas cortantes y los percutores de piedra funcionaron como dientes y garras extracorporales: permitieron a homininos sin grandes colmillos acceder a carne, tendones y, sobre todo, a la médula ósea y el encéfalo ricos en lípidos dentro de huesos inaccesibles para muchos carnívoros.',
    bodyParagraphs: [
      'La cronología de la tecnología lítica africana se extiende desde los grandes bloques tallados por percusión sobre yunque de Lomekwi 3 (Kenia, ~3,3 Ma) hasta la irrupción sistemática del Olduvayense (~2,6 Ma en Gona y Ledi-Geraru, Etiopía; Lokalalei y Kanjera South, Kenia; Garganta de Olduvai, Tanzania) y, posteriormente, la aparición del Achelense con grandes bifaces simétricos (~1,76 Ma en Kokiselei y Konso). Aunque tradicionalmente se vinculó el Olduvayense únicamente a Homo habilis, hoy sabemos que la fabricación lítica pudo ser compartida por varios taxones plio-pleistocenos, incluidos australopitecos tardíos o parántropos.',
      'El célebre debate tafonómico sobre «caza frente a carroñeo» (Lewis Binford, Robert Blumenschine, Henry Bunn, Manuel Domínguez-Rodrigo) reveló una clave ecológica decisiva: los primeros fabricantes de herramientas no necesitaban ser superdepredadores desde el inicio para transformar su nicho. Gracias a filos cortantes capaces de descarnar rápidamente y a cantos percutores capaces de fracturar huesos largos y cráneos abandonados por félidos, se convirtieron en carroñeros confrontacionales sumamente eficaces —y gradualmente en cazadores oportunistas— capaces de extraer médula ósea y tejido cerebral estéril, densos en calorías y ácidos grasos esenciales.',
      'Este salto dietético-tecnológico se vincula directamente con la hipótesis del tejido costoso (Leslie Aiello y Peter Wheeler): el cerebro humano consume ~20 % de la energía basal pese a representar solo ~2 % del peso corporal. El acceso regular a nutrientes de alta densidad calórica procesados externamente con piedras —y más tarde con fuego— permitió reducir el gasto metabólico del tracto digestivo y financiar la expansión cerebral del género Homo. A la vez, la arqueología de primates (Henke-von der Malsburg et al., 2026) muestra cómo los lugares reutilizados y las piedras ya percutidas pudieron servir como pistas sociales indirectas que concentraban el aprendizaje en el paisaje.',
    ],
    glossaryTermIds: [
      { id: 'tafonomia', label: 'Tafonomía' },
      { id: 'equifinalidad', label: 'Equifinalidad' },
      { id: 'cuarta-dimension-herramientas', label: 'Cuarta dimensión de las herramientas' },
    ],
    comparisonTitle: 'Tecnologías líticas tempranas en África y nicho trófico',
    comparisonHeaders: ['Tecnocomplejo africano', 'Cronología y yacimientos clave', 'Estrategia técnica y aprovechamiento'],
    comparisonRows: [
      {
        dimension: 'Lomekwiense',
        colA: '~3,3 Ma · Lomekwi 3 (Oeste de Turkana, Kenia).',
        colB: 'Percusión bipolar y pasiva sobre yunques pesados; grandes lascas previas a la aparición confirmada de Homo.',
      },
      {
        dimension: 'Olduvayense (Modo 1)',
        colA: '~2,6–1,7 Ma · Gona, Lokalalei, Kanjera South, Olduvai (Lecho I).',
        colB: 'Extracción controlada de filos cortantes, transporte selectivo de rocas isótropas y fractura sistemática de huesos por médula.',
      },
      {
        dimension: 'Achelense temprano (Modo 2)',
        colA: '~1,76 Ma · Kokiselei (Kenia), Konso (Etiopía), Olduvai (Lecho II).',
        colB: 'Grandes lascas conformadas en bifaces y hendedores con simetría bilateral; mayor planificación y procesamiento de fauna mayor.',
      },
      {
        dimension: 'Evidencia tafonómica clave',
        colA: 'Marcas de corte en V, percusión antrópica y superposición sobre marcas de carnívoros.',
        colB: 'Permite distinguir acceso primario (carroñeo confrontacional / caza temprana) frente a carroñeo pasivo tardío.',
      },
    ],
    africanCaseTitle: 'Kanjera South y el Lecho I de Olduvai: piedras, huesos y paisaje',
    africanCaseRegion: 'Kenia y Tanzania (~2,0–1,8 Ma)',
    africanCaseText:
      'En Kanjera South, homininos olduvayenses transportaron rocas duras y homogéneas desde más de 10 km para procesar pequeños bóvidos y gacelas con acceso temprano a la carne; en Olduvai, las concentraciones recurrentes de núcleos y huesos fracturados muestran puntos persistentes de abastecimiento en un paisaje compartido con leones y hienas.',
    crossLinks: [
      { label: 'Contrastar con Etología y Olduvayense', sectionId: 'etologia' },
      { label: 'Revisar métodos tafonómicos en Atlas Paleo', sectionId: 'sec-atlas-paleo' },
    ],
    keyReferences:
      'Blumenschine (1995); Aiello y Wheeler (1995); Domínguez-Rodrigo (2002); Braun et al. (2009); Harmand et al. (2015).',
  },
  {
    num: '06',
    id: 'tema-06',
    shortTitle: 'Cuerpos, mentes y primeras voces',
    officialTitle: 'Cuerpos humanos, mentes humanas: las primeras voces en África.',
    block: 'Origen, mente y diversidad',
    guidingQuestions: [
      '¿Cómo evolucionaron el tamaño y la organización del cerebro humano a lo largo del Pleistoceno africano?',
      '¿Qué evidencias anatómicas, genéticas y arqueológicas rastrean el origen del habla y el lenguaje en África?',
    ],
    leadSummary:
      'La mente humana no evolucionó solo aumentando el volumen craneal: requirió una profunda reorganización neuroanatómica, un desarrollo infantil prolongado y la coevolución de un aparato vocal-auditivo y cognitivo capaz de sostener el lenguaje articulado.',
    bodyParagraphs: [
      'El crecimiento cerebral humano fue gradual y no lineal: pasó de ~400–500 cm³ en Australopithecus a ~600–750 cm³ en Homo habilis, ~850–1.050 cm³ en Homo erectus y ~1.350–1.450 cm³ en Homo sapiens (con una ligera reducción holocena reciente asociada a reorganización y gracilización). Más decisiva aún que el volumen absoluto fue la reestructuración interna: expansión de la corteza prefrontal (planificación, inhibición y teoría de la mente), ampliación del lóbulo parietal y el cerebelo (integración visuomotora y memoria de trabajo) y consolidación de la asimetría hemisférica vinculada a las áreas del lenguaje (Broca y Wernicke), inferida en moldes endocraneales fósiles.',
      'Como el lenguaje no fosiliza directamente, su estudio combina evidencias indirectas convergentes: la configuración del tracto vocal supralaríngeo (descenso de la laringe y proporción de cavidades oral y faríngea), la morfología del hueso hioides (ya moderna en poblaciones del Pleistoceno Medio), el diámetro del canal vertebral torácico —necesario para el control fino de la respiración al hablar—, la sensibilidad del oído medio en el rango de frecuencias de la voz humana y variantes genéticas implicadas en el control motor del habla como el gen FOXP2.',
      'Desde la perspectiva socioevolutiva, la hipótesis del «cerebro social» (Robin Dunbar) plantea que, al crecer el tamaño de los grupos en paisajes abiertos africanos, el lenguaje emergió como un «acicalamiento vocal» eficiente capaz de mantener cohesión simultánea con múltiples individuos, coordinar cooperación y compartir información sobre terceros. Complementariamente, la complejidad creciente de las cadenas operativas líticas (del Achelense a la tecnología de puntas enmangadas del MSA africano) y la excepcional diversidad fonológica de las lenguas africanas —incluyendo los sistemas de consonantes clics en lenguas khoisan y del este de África— remiten a la profunda raíz africana de las primeras voces humanas.',
    ],
    glossaryTermIds: [
      { id: 'hominizacion-humanizacion', label: 'Hominización y humanización' },
      { id: 'adn-antiguo', label: 'ADN antiguo y paleogenómica' },
    ],
    comparisonTitle: 'Hitos anatómicos y cognitivos hacia las primeras voces en África',
    comparisonHeaders: ['Indicador evolutivo', 'Qué revela en el registro', 'Significado para la mente y el lenguaje'],
    comparisonRows: [
      {
        dimension: 'Moldes endocraneales (Broca / frontal)',
        colA: 'Reorganización del giro frontal inferior visible ya desde Homo temprano y consolidada en el Pleistoceno Medio.',
        colB: 'Sustrato neural para secuencias motoras jerárquicas compartidas entre talla lítica compleja y sintaxis.',
      },
      {
        dimension: 'Control respiratorio y oído medio',
        colA: 'Ensanchamiento del canal torácico y adaptación auditiva a 2–4 kHz en homininos del Pleistoceno Medio.',
        colB: 'Permite modular frases largas en espiración controlada y discriminar consonantes con alta precisión.',
      },
      {
        dimension: 'Desarrollo cerebral globular',
        colA: 'De cráneos alargados en Jebel Irhoud (~300 ka) a bóvedas globulares modernas (~100–35 ka).',
        colB: 'Refleja maduración postnatal lenta de áreas parietales y cerebelares vinculadas a cognición simbólica.',
      },
      {
        dimension: 'Diversidad fonológica africana',
        colA: 'África concentra los inventarios de fonemas más ricos del planeta (incluidos sistemas con chasquidos/clics).',
        colB: 'Concuerda con un origen africano profundo y efecto fundador fonémico serial fuera del continente.',
      },
    ],
    africanCaseTitle: 'De la globularización craneal en Jebel Irhoud a la riqueza fonémica africana',
    africanCaseRegion: 'Marruecos, África Oriental y África Austral',
    africanCaseText:
      'Los fósiles de Jebel Irhoud (~300 ka) muestran rostros ya modernos combinados con endocráneos aún alargados, evidenciando que la organización moderna del cerebro de Homo sapiens evolucionó de manera gradual en el propio continente africano en paralelo al florecimiento de las redes sociales de larga distancia del Paleolítico Medio Africano (MSA).',
    crossLinks: [
      { label: 'Inspeccionar Jebel Irhoud en Orígenes', sectionId: 'sec-origenes' },
      { label: 'Explorar Paleomolecular y neurogenética', sectionId: 'sec-paleomolecular' },
    ],
    keyReferences:
      'Dunbar (1996); Atkinson (2011); Dediu y Levinson (2013); Neubauer et al. (2018); Ponce de León et al. (2021).',
  },
  {
    num: '07',
    id: 'tema-07',
    shortTitle: 'Homo sapiens y pluralidad étnica africana',
    officialTitle:
      'El camino africano hacia Homo sapiens: ¿qué nos hizo Homo sapiens?, ¿por qué somos tan diversos? La pluralidad étnica africana.',
    block: 'Origen, mente y diversidad',
    guidingQuestions: [
      '¿Cómo consolidó el modelo panafricano en mosaico la aparición de Homo sapiens?',
      '¿Por qué África concentra la mayor diversidad genética y lingüística de la humanidad?',
      '¿Cómo se estructura la pluralidad étnica y lingüística africana sin caer en clichés coloniales sobre «tribus»?',
    ],
    leadSummary:
      'Homo sapiens emergió en una red de poblaciones interconectadas por toda África hace más de 300.000 años. Esa profundidad temporal explica por qué África alberga hoy más diversidad genética, lingüística y cultural que cualquier otro continente.',
    bodyParagraphs: [
      '¿Qué nos hizo Homo sapiens? La convergencia de fósiles en Marruecos (Jebel Irhoud, ~300 ka), Sudáfrica (Florisbad, ~259 ka), Etiopía (Omo I ≥233 ka y Herto ~160 ka) y la genómica moderna confirman que nuestra especie no nació de golpe en un único enclave, sino mediante evolución en mosaico a través de poblaciones africanas subdivididas que se conectaban cuando el clima abría corredores verdes en el Sáhara y el Rift. Lo decisivo fue la flexibilidad ecológica extrema —la ocupación simultánea de costas, desiertos, selvas y montañas— respaldada por redes sociales extendidas de intercambio de materias primas y bienes simbólicos.',
      '¿Por qué somos tan diversos? Porque la población ancestral vivió en África durante cientos de miles de años manteniendo tamaños efectivos elevados y subestructura geográfica, mientras que las poblaciones que salieron de África (~70–50 ka) representaron solo una fracción reducida (efecto fundador). En consecuencia, la inmensa mayoría de la variación genética humana es compartida dentro de los grupos y las diferencias entre dos poblaciones africanas suelen superar las existentes entre europeos y asiáticos, invalidando científicamente cualquier clasificación racial biológica.',
      'La pluralidad étnica africana refleja esa misma profundidad histórica y creativa. El continente alberga más de 2.000 lenguas vivas tradicionalmente agrupadas en cuatro grandes bloques —Níger-Congo (incluyendo las lenguas bantúes), Afroasiática, Nilo-Sahariana* y la Agrupación Joisán / Khoisan* (hoy reconocida como tres familias independientes: Kxʼa, Tuu y Khoe-Kwadi, revisión post-Greenberg)—, junto a una extraordinaria diversidad de etnias, economías y formas políticas: desde los reinos históricos yoruba, akan, etíopes o kongo hasta sociedades pastoriles fulani y maasai, redes mercantiles swahili y comunidades cazadoras-recolectoras san o bambuti. Frente al término colonial peyorativo de «tribu» —que sugería aislamiento estático—, la antropología contemporánea entiende la etnicidad africana como una identidad histórica, fluida y relacional.',
    ],
    glossaryTermIds: [
      { id: 'modelo-multirregional-africano', label: 'Modelo multirregional africano' },
      { id: 'efecto-fundador', label: 'Efecto fundador' },
      { id: 'linaje-fantasma', label: 'Linaje fantasma' },
    ],
    comparisonTitle: 'Los cuatro grandes bloques lingüísticos (revisión post-Greenberg) y la pluralidad africana',
    comparisonHeaders: ['Bloque lingüístico', 'Distribución geográfica principal', 'Pueblos, lenguas y dinamismo histórico'],
    comparisonRows: [
      {
        dimension: 'Níger-Congo (inc. Bantú)',
        colA: 'África Occidental, Central, Oriental y Austral (la más extensa en número de lenguas).',
        colB: 'Yoruba, Igbo, Akan, Wolof, Fulfulde, Swahili, Zulú, Xhosa, Lingala; expansión agrícola y metalúrgica bantú.',
      },
      {
        dimension: 'Afroasiática',
        colA: 'Norte de África, Cuerno de África y cuenca del lago Chad.',
        colB: 'Amazigh (bereber), egipcio antiguo/copto, amhárico, tigriña, oromo, somalí, hausa y árabe magrebí/sudanés.',
      },
      {
        dimension: 'Nilo-Sahariana*',
        colA: 'Sáhara central, cuenca del Nilo superior y valle del Rift oriental (*unidad filogenética aún debatida tras Greenberg).',
        colB: 'Songhai, kanuri, nubio, dinka, nuer, luo y maasai; tradiciones ribereñas, sahelianas y pastoriles.',
      },
      {
        dimension: 'Agrupación Joisán / Khoisan* (familias Kxʼa, Tuu, Khoe-Kwadi)',
        colA: 'África Austral (Kalahari) y enclaves orientales (Hadza y Sandawe en Tanzania; *agrupación areal, no familia única).',
        colB: 'Linajes genéticos más profundos de Homo sapiens; complejas lenguas con consonantes clics y gran conocimiento ecológico.',
      },
    ],
    africanCaseTitle: 'Más allá del mito de la «tribu»: redes multiétnicas en el Sahel y la costa Swahili',
    africanCaseRegion: 'África Occidental y África Oriental',
    africanCaseText:
      'A lo largo de la historia africana, grupos lingüísticos y ecológicos distintos —como agricultores mandé, pescadores bozo y pastores fulani en el delta interior del Níger— tejieron relaciones estables de complementariedad económica, matrimonios cruzados y pactos de broma (sanankuya) que desmienten la imagen colonial de etnias cerradas y homogéneas.',
    crossLinks: [
      { label: 'Revisar mapa cronológico en Orígenes', sectionId: 'sec-origenes' },
      { label: 'Ver expansión bantú y metalurgia', sectionId: 'sec-tecnologia' },
    ],
    keyReferences:
      'Greenberg (1963); Amselle y M’Bokolo (1985); Schlebusch et al. (2017); Scerri et al. (2018); Güldemann (2018).',
  },
  {
    num: '08',
    id: 'tema-08',
    shortTitle: 'Lo simbólico, religiones y ritos de paso',
    officialTitle:
      'Las primeras manifestaciones de lo simbólico en el contexto africano: ¿nacidos para creer? Comportamientos religiosos en las etnias africanas. Los ritos de paso y las personalidades sociales.',
    block: 'Cultura, parentesco y subsistencia',
    guidingQuestions: [
      '¿Cuáles son las evidencias arqueológicas más antiguas del comportamiento simbólico en África?',
      '¿Qué explicaciones evolutivas y cognitivas abordan la pregunta «¿nacidos para creer?»?',
      '¿Cómo se estructuran las religiones tradicionales africanas, los ritos de paso y la construcción de la persona social?',
    ],
    leadSummary:
      'Las primeras expresiones materiales del pensamiento simbólico —pigmentos de ocre, adornos personales, grabados geométricos y cuidados funerarios— afloran en África hace más de 100.000 años, inaugurando un universo de sentido que en las sociedades africanas cristaliza en ricas cosmologías y ritos de paso.',
    bodyParagraphs: [
      'Mucho antes del arte rupestre paleolítico europeo, África conserva los testimonios más antiguos de cultura simbólica: colecciones de pigmentos de ocre trabajados hace ~300–160 ka (Olorgesailie, Pinnacle Point), cuentas de concha perforada de Nassarius en Bizmoune (Marruecos, ~142 ka) y Blombos (Sudáfrica, ~75 ka), un taller de ocre de ~100 ka y un dibujo abstracto en silcreta de ~73 ka en Blombos, cáscaras de huevo de avestruz grabadas en Diepkloof (~60 ka) y el enterramiento deliberado del niño «Mtoto» en Panga ya Saidi (Kenia, ~78 ka). Estos objetos comunicaban identidad, pertenencia grupal, memoria y vínculos de intercambio a distancia.',
      'Ante la pregunta «¿nacidos para creer?», la antropología cognitiva y evolutiva (Pascal Boyer, Scott Atran, Harvey Whitehouse, Ara Norenzayan) señala que la religiosidad humana se apoya en predisposiciones cognitivas universales —como la teoría de la mente y la detección hiperactiva de intencionalidad en el entorno— canalizadas culturalmente hacia rituales colectivos que sincronizan emociones, refuerzan la confianza mutua y sostienen la cooperación moral en grupos amplios.',
      'En África, los comportamientos religiosos tradicionales son plurales pero comparten rasgos frecuentes: reconocimiento de una fuerza vital relacional (como el àṣẹ yoruba o el ntu bantú), un Ser Supremo creador acompañado de divinidades o espíritus intermediarios (orishas, vodun, espíritus de la naturaleza), veneración activa de los ancestros como garantes éticos de la comunidad, sistemas complejos de adivinación (como Ifá, patrimonio inmaterial) y prácticas terapéuticas integrales, todo ello en convivencia histórica de siglos con el cristianismo africano antiguo (Etiopía, Nubia) y el islam africano. En el corazón de esta vida ritual destacan los ritos de paso (nacimiento, iniciación juvenil, matrimonio, investidura y funerales), analizados por Arnold van Gennep y por Victor Turner entre los Ndembu de Zambia en tres fases —separación, margen o liminalidad (donde surge la communitas igualitaria) y agregación— mediante los cuales un individuo biológico se convierte progresivamente en persona social plena, proceso que se expresa también en las clases de edad (maasai, sistema Gadaa oromo), sociedades iniciáticas (Poro y Sande) y la ética relacional Ubuntu («soy porque somos»).',
    ],
    glossaryTermIds: [
      { id: 'ritos-de-paso', label: 'Ritos de paso y liminalidad' },
      { id: 'cultura-antropologica', label: 'Cultura en antropología' },
    ],
    comparisonTitle: 'Estructura de los ritos de paso y construcción de la persona social',
    comparisonHeaders: ['Fase ritual (Van Gennep / Turner)', 'Dinámica simbólica y social', 'Expresión en sociedades africanas'],
    comparisonRows: [
      {
        dimension: '1. Separación (pre-liminal)',
        colA: 'Ruptura simbólica y espacial con el estatus anterior (infancia, estado previo o mundo cotidiano).',
        colB: 'Retiro temporal al bosque sagrado o campamento iniciático (p. ej. Mukanda ndembu, sociedades Poro y Sande).',
      },
      {
        dimension: '2. Margen / Liminalidad',
        colA: 'Estado umbral «ni lo uno ni lo otro»: suspensión de jerarquías previas, pruebas, transmisión de saberes y communitas.',
        colB: 'Enseñanza de historia oral, ética comunitaria, máscaras rituales, cantos y solidaridad horizontal de cohorte.',
      },
      {
        dimension: '3. Agregación (post-liminal)',
        colA: 'Reintegración pública a la comunidad con nuevo estatus, derechos, responsabilidades y nombre o insignias.',
        colB: 'Entrada en nuevas clases de edad (sistema Gadaa oromo, guerreros y ancianos maasai) o consagración de ancestros.',
      },
      {
        dimension: 'Personalidad social',
        colA: 'La persona no nace acabada biológicamente: se construye relacionalmente a lo largo del ciclo vital.',
        colB: 'Principio comunitario Ubuntu en África Austral y centralidad del linaje y los antepasados en la identidad moral.',
      },
    ],
    africanCaseTitle: 'De Blombos y Panga ya Saidi a la liminalidad ndembu y el sistema Gadaa',
    africanCaseRegion: 'Sudáfrica, Kenia, Zambia y Etiopía',
    africanCaseText:
      'El estudio clásico de Victor Turner sobre el ritual de iniciación Mukanda y el simbolismo cromático (blanco, rojo y negro) entre los Ndembu de Zambia mostró que los rituales africanos no son «supersticiones arcaicas», sino sofisticados dispositivos pedagógicos, políticos y emocionales para resolver conflictos y forjar personas sociales responsables.',
    crossLinks: [
      { label: 'Ver Blombos en Orígenes', sectionId: 'sec-origenes' },
      { label: 'Explorar Reinos y espiritualidad', sectionId: 'sec-reinos' },
    ],
    keyReferences:
      'Van Gennep (1909); Turner (1967, 1969); Mbiti (1969); Boyer (2001); Henshilwood et al. (2018); Martinón-Torres et al. (2021).',
  },
  {
    num: '09',
    id: 'tema-09',
    shortTitle: 'Teoría de la abuela y parentesco',
    officialTitle:
      'La complejidad de las relaciones humanas: Desde la teoría de la abuela a la antropología del parentesco.',
    block: 'Cultura, parentesco y subsistencia',
    guidingQuestions: [
      '¿Qué explica la hipótesis de la abuela y la crianza cooperativa sobre nuestra longevidad e infancia prolongada?',
      '¿Cómo organizan las sociedades africanas el parentesco, la filiación, el matrimonio y la solidaridad colectiva?',
    ],
    leadSummary:
      'Ninguna madre humana cría sola a hijos de cerebros tan costosos y desarrollo tan lento: desde la cooperación intergeneracional explicada por la teoría de la abuela hasta los complejos sistemas africanos de filiación y linaje, el parentesco es la arquitectura fundacional de la vida social.',
    bodyParagraphs: [
      'Uno de los grandes enigmas evolutivos humanos es la longevidad post-reproductiva femenina: a diferencia de casi todos los demás primates, las mujeres viven varias décadas tras la menopausia. Basándose en años de observación cuantitativa entre los Hadza de Tanzania, Kristen Hawkes, James O’Connell y Nicholas Blurton Jones formularon la hipótesis de la abuela: al recolectar recursos estables como tubérculos y colaborar en el cuidado de los nietos, las mujeres mayores aumentan la supervivencia infantil y permiten a sus hijas acortar el intervalo entre nacimientos. Esta dinámica se integra en el marco más amplio de la crianza cooperativa o aloparentalidad (Sarah Blaffer Hrdy), donde padres, abuelas, hermanos mayores y parientes comparten el coste energético y educativo de una infancia larga e indispensable para adquirir cultura compleja.',
      'Sobre esa base biológica de interdependencia, las sociedades humanas construyen sistemas normativos de parentesco que definen quién es pariente, cómo se heredan tierra, títulos y responsabilidades, con quién está permitido o prohibido casarse (reglas de exogamia e incesto) y dónde reside la nueva familia. La antropología del parentesco distingue formas diversas de filiación: patrilineal (agnaticia, trazada por línea paterna, como en los Nuer o Zulú), matrilineal (uterina, trazada por línea materna donde el tío materno ocupa un papel clave en autoridad y herencia, como en los Akan/Ashanti de Ghana, los Bemba de Zambia o numerosos grupos tuareg), filiación doble (como los Yakö de Nigeria) y bilateral.',
      'En África, los sistemas de parentesco han funcionado históricamente como redes de seguridad económica, mediación jurídica y organización política (por ejemplo, los linajes segmentarios capaces de coordinar vastas poblaciones sin aparato burocrático estatal). Asimismo, instituciones como la riqueza de la novia o lobola —frecuentemente tergiversada en clave colonial como «compra»— constituyen en realidad alianzas recíprocas entre dos familias extensas que legitiman los derechos de la descendencia y aseguran protección mutua a lo largo de generaciones.',
    ],
    glossaryTermIds: [
      { id: 'teoria-de-la-abuela', label: 'Hipótesis de la abuela y crianza cooperativa' },
      { id: 'parentesco-linaje', label: 'Antropología del parentesco y filiación' },
    ],
    comparisonTitle: 'De la cooperación evolutiva a los sistemas africanos de parentesco',
    comparisonHeaders: ['Sistema / Concepto', 'Principio organizador', 'Ejemplos africanos y función social'],
    comparisonRows: [
      {
        dimension: 'Hipótesis de la abuela y aloparentalidad',
        colA: 'Transferencia intergeneracional de calorías, cuidados y conocimiento desde mujeres post-reproductivas y parientes.',
        colB: 'Documentada empíricamente entre los Hadza (Tanzania); sostiene infancias largas y alta supervivencia infantil.',
      },
      {
        dimension: 'Filiación patrilineal',
        colA: 'Pertenencia al linaje, apellido y derechos básicos transmitidos a través del padre y sus ascendientes varones.',
        colB: 'Nuer (Sudán del Sur), Zulú (Sudáfrica), Kikuyu (Kenia); estructura linajes segmentarios y acceso comunal a tierra/ganado.',
      },
      {
        dimension: 'Filiación matrilineal',
        colA: 'Pertenencia al clan, herencia y legitimidad transmitidas por línea materna (abusua); rol central del tío materno.',
        colB: 'Akan/Ashanti (Ghana), Bemba (Zambia), Chewa (Malaui); otorga centralidad política a la Reina Madre (Asantehemaa).',
      },
      {
        dimension: 'Alianza matrimonial y familia extensa',
        colA: 'El matrimonio vincula dos grupos de parentesco mediante intercambios simbólicos y económicos (lobola / bridewealth).',
        colB: 'Teje redes supralocales de apoyo mutuo, cuidado de menores y resolución pacífica de disputas.',
      },
    ],
    africanCaseTitle: 'Las abuelas hadza (Tanzania) y el «cinturón matrilineal» africano',
    africanCaseRegion: 'Tanzania, Ghana y África Central-Austral',
    africanCaseText:
      'Mientras la etnografía hadza revolucionó la antropología evolutiva al demostrar el aporte calórico decisivo de las mujeres mayores, el célebre «cinturón matrilineal» que atraviesa África Central —junto al reino Akan en África Occidental— evidencia la enorme plasticidad cultural con la que las sociedades africanas organizan autoridad, herencia y familia extensa.',
    crossLinks: [
      { label: 'Abrir Árbol de Parentesco interactivo', sectionId: 'etologia-parentesco' },
      { label: 'Ver estructuras políticas en Reinos', sectionId: 'sec-reinos' },
      { label: 'Explorar Historiografía y fuentes orales', sectionId: 'sec-historiografia' },
    ],
    keyReferences:
      'Evans-Pritchard (1940); Radcliffe-Brown y Forde (1950); Amadiume (1987); Hawkes et al. (1998); Hrdy (2009).',
  },
  {
    num: '10',
    id: 'tema-10',
    shortTitle: 'Dieta, cazadores, agricultura y ganadería',
    officialTitle:
      '¿Somos lo que comemos?: de cazadores-recolectores a agricultores y ganaderos en el continente africano.',
    block: 'Cultura, parentesco y subsistencia',
    guidingQuestions: [
      '¿Cómo moldearon la dieta omnívora, los tubérculos, los recursos acuáticos y el fuego nuestra biología?',
      '¿Qué particularidad diferencia la transición africana a la ganadería y la agricultura respecto a Eurasia?',
      '¿Qué cultivos africanos fueron domesticados de forma independiente en el continente?',
    ],
    leadSummary:
      'La dieta fue motor de nuestra evolución anatómica y social. En África, además, la llamada «neolitización» siguió una trayectoria singular: el pastoralismo en el Sáhara húmedo precedió en milenios a la agricultura sedentaria, y el continente albergó múltiples focos independientes de domesticación vegetal.',
    bodyParagraphs: [
      '«Somos lo que comemos» adquiere en antropología evolutiva un sentido literal: los isótopos estables de carbono (δ13C) y el microdesgaste dental muestran que nuestros antepasados pasaron de dietas forestales predominantemente C3 hacia una dieta omnívora y oportunista en mosaico que integró tubérculos y bulbos subterráneos, frutos, insectos, médula ósea, carne y recursos acuáticos (mariscos en Pinnacle Point hace ~164 ka y pesca especializada en Katanda, R. D. del Congo). A ello se sumó el control del fuego y el cocinado (hipótesis de Richard Wrangham), que gelatiniza almidones, desnaturaliza proteínas, elimina toxinas y libera energía vital para cerebros grandes reduciendo el tamaño mandibular y dental.',
      'Durante más del 95 % de la historia de Homo sapiens, toda la humanidad vivió de la caza, la pesca y la recolección. Las sociedades cazadoras-recolectoras africanas documentadas históricamente —como los San (Ju|’hoansi) del Kalahari, los Hadza de Tanzania o los Baka y Mbuti de la selva ecuatorial— no son «reliquias congeladas del Paleolítico», sino sociedades contemporáneas con profundos conocimientos botánicos, movilidad adaptativa, igualitarismo por reparto y relaciones históricas de intercambio con comunidades agrícolas y pastoriles vecinas.',
      'Frente al modelo euroasiático clásico (donde la agricultura precedió a la ganadería en el Creciente Fértil), África siguió una senda propia y fascinante: durante el Periodo Húmedo Africano («Sáhara verde», ~9.000–5.000 a.C.), las comunidades del Sáhara oriental y central adoptaron primero el pastoralismo móvil de bóvidos, ovejas y cabras junto a cerámica temprana y recolección intensiva de cereales silvestres. Solo más tarde —cuando la aridificación sahariana desplazó poblaciones hacia el Sahel, el valle del Nilo y las sabanas— florecieron varios centros independientes de domesticación vegetal africana: mijo perla (Pennisetum glaucum) y arroz africano (Oryza glaberrima) en África Occidental; sorgo (Sorghum bicolor) en el Sahel oriental/Sudán; teff (Eragrostis tef), enset y café en el Cuerno de África; y ñame (Dioscorea) junto a la palma aceitera (Elaeis guineensis) en los bordes forestales guineanos.',
    ],
    glossaryTermIds: [
      { id: 'neolitizacion-africana', label: 'Domesticación y pastoralismo africano' },
      { id: 'isotopos-carbono', label: 'Isótopos estables de carbono (δ13C)' },
      { id: 'flora-c3-c4', label: 'Flora C3 y gramíneas C4' },
    ],
    comparisonTitle: 'Trayectorias africanas de subsistencia: de la dieta forrajera a la producción de alimentos',
    comparisonHeaders: ['Sistema de subsistencia', 'Cronología y contextos africanos', 'Innovaciones biológicas y culturales'],
    comparisonRows: [
      {
        dimension: 'Forrajeo omnívoro, costas y fuego',
        colA: 'Pleistoceno (Olduvai ~1,8 Ma; Wonderwerk ~1 Ma; Pinnacle Point ~164 ka).',
        colB: 'Cocinado, explotación de mariscos y tubérculos; reducción del aparato masticatorio y expansión cerebral.',
      },
      {
        dimension: 'Pastoralismo sahariano temprano',
        colA: '~8.000–5.000 a.C. · Sáhara verde (Nabta Playa, Takarkori, Gobero).',
        colB: 'Ganadería bovina anterior a la agricultura sedentaria; cerámica temprana, arte rupestre y selección de lactasa.',
      },
      {
        dimension: 'Focos agrícolas del Sahel y África Occidental',
        colA: '~2.500–1.500 a.C. · Valle del Tilemsi, Delta interior del Níger, bosques guineanos.',
        colB: 'Domesticación independiente de mijo perla, sorgo, arroz africano (Oryza glaberrima), caupí, ñame y palma aceitera.',
      },
      {
        dimension: 'Foco de las tierras altas de Etiopía y expansión bantú',
        colA: '~2.000 a.C. – I milenio d.C. · Cuerno de África y África Central-Austral.',
        colB: 'Domesticación de teff, enset y café; integración agrícola-metalúrgica y mosaicos de intercambio con pastores y forrajeros.',
      },
    ],
    africanCaseTitle: 'El Sáhara verde y la inversión del «modelo neolítico» euroasiático',
    africanCaseRegion: 'Sáhara central, Sahel y Tierras Altas de Etiopía',
    africanCaseText:
      'Yacimientos como Takarkori (Libia) y Nabta Playa (Egipto/Sudán) demuestran que en África la cerámica, el procesamiento lácteo y el pastoreo móvil precedieron en miles de años a la agricultura cerealista, recordándonos que los procesos históricos africanos deben analizarse en sus propios términos ecológicos y no como copia tardía de Eurasia.',
    crossLinks: [
      { label: 'Explorar Atlas de Paleobotánica', sectionId: 'sec-atlas-paleobotanica' },
      { label: 'Ver agricultura y expansión bantú', sectionId: 'sec-tecnologia' },
    ],
    keyReferences:
      'Marshall y Hildebrand (2002); Wrangham (2009); Manning et al. (2011); Dunne et al. (2012); Fuller y Hildebrand (2013).',
  },
];
