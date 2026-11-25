import type { AtlasTabId } from '../components/atlas/AtlasAulaView';

export interface IntroScene {
  id: number;
  startMs: number;
  endMs: number;
  rotulo: string;
  narracion: string;
  subtitulos: Array<{ t0: number; t1: number; txt: string }>;
  visualHint: string;
}

export const INTRO_NARRATED_SCENES: IntroScene[] = [
  {
    id: 0,
    startMs: 0,
    endMs: 12000,
    rotulo: 'Un árbol, no una escalera',
    narracion:
      'Durante millones de años, muchas especies humanas caminaron sobre la Tierra. No una tras otra, en fila, sino a la vez: ramas distintas de un mismo árbol.',
    subtitulos: [
      {
        t0: 0,
        t1: 5000,
        txt: 'Durante millones de años, muchas especies humanas caminaron sobre la Tierra.',
      },
      {
        t0: 5000,
        t1: 12000,
        txt: 'No una tras otra, en fila, sino a la vez: ramas distintas de un mismo árbol.',
      },
    ],
    visualHint: 'Coexistencia de linajes paralelos frente al mito lineal de la «marcha del progreso».',
  },
  {
    id: 1,
    startMs: 12000,
    endMs: 26000,
    rotulo: 'Los vestigios',
    narracion:
      'La paleoantropología es la ciencia que estudia ese árbol. Reconstruye nuestro pasado más profundo a partir de huesos, dientes, huellas y herramientas de piedra que el tiempo, casi siempre, ha dispersado o destruido.',
    subtitulos: [
      {
        t0: 12000,
        t1: 18500,
        txt: 'La paleoantropología es la ciencia que estudia ese árbol.',
      },
      {
        t0: 18500,
        t1: 26000,
        txt: 'Reconstruye nuestro pasado a partir de huesos, dientes, huellas y herramientas de piedra.',
      },
    ],
    visualHint: 'Cuatro vestigios básicos: cráneos y huesos, dientes, icnitas (huellas) e industria lítica.',
  },
  {
    id: 2,
    startMs: 26000,
    endMs: 42000,
    rotulo: 'La hipótesis',
    narracion:
      'Por eso no ofrece un relato cerrado, sino hipótesis que se revisan. Cada hallazgo puede confirmar lo que creíamos saber, o obligarnos a repensarlo por completo.',
    subtitulos: [
      {
        t0: 26000,
        t1: 34000,
        txt: 'Por eso no ofrece un relato cerrado, sino hipótesis que se revisan.',
      },
      {
        t0: 34000,
        t1: 42000,
        txt: 'Cada hallazgo puede confirmar lo que creíamos saber, o hacernos repensarlo por completo.',
      },
    ],
    visualHint: 'Interpretación A frente a Interpretación B: conocimiento científico falsable y revisable.',
  },
  {
    id: 3,
    startMs: 42000,
    endMs: 60000,
    rotulo: 'El punto de partida',
    narracion:
      '¿Quiénes fueron aquellas especies? ¿Dónde vivieron y por qué desaparecieron todas menos una? ¿Y cómo lo sabemos? Estas son las preguntas con las que empieza el viaje.',
    subtitulos: [
      {
        t0: 42000,
        t1: 50500,
        txt: '¿Quiénes fueron aquellas especies? ¿Dónde vivieron y por qué desaparecieron todas menos una?',
      },
      {
        t0: 50500,
        t1: 60000,
        txt: '¿Y cómo lo sabemos? Estas son las preguntas con las que empieza el viaje.',
      },
    ],
    visualHint: 'Cuatro preguntas vertebradoras del curso: quiénes, dónde, por qué y cómo lo sabemos.',
  },
  {
    id: 4,
    startMs: 60000,
    endMs: 76000,
    rotulo: 'El método',
    narracion:
      '¿Cómo se sabe todo esto a partir de unos pocos restos? La respuesta está en el método. La paleoantropología no adivina: infiere, con disciplina, a partir de indicios.',
    subtitulos: [
      {
        t0: 60000,
        t1: 68000,
        txt: '¿Cómo se sabe todo esto a partir de unos pocos restos? La respuesta está en el método.',
      },
      {
        t0: 68000,
        t1: 76000,
        txt: 'La paleoantropología no adivina: infiere, con disciplina, a partir de indicios.',
      },
    ],
    visualHint: 'Inferencia disciplinada a partir de convergencia de pruebas independientes.',
  },
  {
    id: 5,
    startMs: 76000,
    endMs: 94000,
    rotulo: 'El tiempo',
    narracion:
      'Primero, el tiempo. Ciertas rocas volcánicas funcionan como relojes: la desintegración de sus átomos permite fechar las capas donde yacen los fósiles, a veces con millones de años de antigüedad.',
    subtitulos: [
      {
        t0: 76000,
        t1: 85000,
        txt: 'Primero, el tiempo. Ciertas rocas volcánicas funcionan como relojes:',
      },
      {
        t0: 85000,
        t1: 94000,
        txt: 'fechan las capas donde yacen los fósiles, a veces con millones de años de antigüedad.',
      },
    ],
    visualHint: 'Relojes radiométricos en tobas volcánicas (K-Ar y 40Ar/39Ar) entre 0,5 y 3,5+ Ma.',
  },
  {
    id: 6,
    startMs: 94000,
    endMs: 110000,
    rotulo: 'El contexto',
    narracion:
      'Después, el contexto. La tafonomía estudia qué le ocurrió a cada resto desde la muerte hasta el hallazgo, para separar lo que nos dice del organismo de lo que solo refleja el azar.',
    subtitulos: [
      {
        t0: 94000,
        t1: 102000,
        txt: 'Después, el contexto. La tafonomía estudia qué le ocurrió a cada resto,',
      },
      {
        t0: 102000,
        t1: 110000,
        txt: 'para separar lo que nos dice del organismo de lo que solo refleja el azar.',
      },
    ],
    visualHint: 'Tafonomía: discriminar la señal biológica y conductual frente al ruido del azar.',
  },
  {
    id: 7,
    startMs: 110000,
    endMs: 120000,
    rotulo: 'Los genes',
    narracion:
      'Y hoy, además, los genes. El ADN antiguo revela encuentros entre especies que los huesos, por sí solos, jamás habrían contado.',
    subtitulos: [
      {
        t0: 110000,
        t1: 115000,
        txt: 'Y hoy, además, los genes.',
      },
      {
        t0: 115000,
        t1: 120000,
        txt: 'El ADN antiguo revela encuentros que los huesos, por sí solos, jamás habrían contado.',
      },
    ],
    visualHint: 'Paleogenómica e introgresión entre Homo sapiens, neandertales y denisovanos.',
  },
];

export interface DeaGuidedSession {
  n: number;
  titulo: string;
  pregunta: string;
  destacadoTitulo?: string;
  destacadoItems?: Array<{ titulo: string; texto: string }>;
  notaDestacado?: string;
  pasos: Array<{ texto: string; targetTab?: AtlasTabId; targetLabel?: string }>;
  trabajo: string;
  fuentes?: Array<{ titulo: string; url: string }>;
}

export const DEA_GUIDED_SESSIONS: DeaGuidedSession[] = [
  {
    n: 1,
    titulo: 'Seis millones de años en África',
    pregunta: '¿Dónde y cuándo vivieron los primeros homininos?',
    pasos: [
      {
        texto:
          'En Cronología, filtre por África, busque la especie más antigua de la lista (Sahelanthropus tchadensis) y anote su intervalo aproximado.',
        targetTab: 'cronologia',
        targetLabel: 'Ir a Cronología',
      },
      {
        texto:
          'En Territorio (Mapa de África), localice las regiones del Chad, el Afar, Turkana y Sudáfrica. ¿Qué especies se documentan en cada una?',
        targetTab: 'territorio',
        targetLabel: 'Ir a Territorio',
      },
      {
        texto:
          'Abra dos fichas de especies africanas y anote su región, sus fechas y si su validez taxonómica está debatida.',
        targetTab: 'cronologia',
        targetLabel: 'Consultar fichas',
      },
    ],
    trabajo:
      'Elabore una línea del tiempo con cinco especies africanas, con el lugar de hallazgo y las fechas aproximadas.',
  },
  {
    n: 2,
    titulo: '¿Cómo lo sabemos?',
    pregunta: '¿Cómo se sabe la edad de un fósil y qué se puede afirmar a partir de él?',
    pasos: [
      {
        texto:
          'En Métodos, lea las cuatro tarjetas inferenciales (datación, tafonomía, ADN antiguo y paleoproteómica) y anote qué aporta y qué limita cada método.',
        targetTab: 'metodos',
        targetLabel: 'Ir a Métodos',
      },
      {
        texto:
          'En Cronología, busque una ficha marcada como «Debatido» y explique con sus palabras por qué se discute su interpretación.',
        targetTab: 'cronologia',
        targetLabel: 'Ver táxones debatidos',
      },
      {
        texto:
          'En cualquier ficha, separe lo que es un dato empírico (lugar, fechas, restos) de lo que es una interpretación.',
      },
    ],
    trabajo:
      'Explique con un ejemplo concreto la diferencia entre un dato y una interpretación en el estudio de los orígenes humanos.',
  },
  {
    n: 3,
    titulo: 'Muchos parientes, una sola humanidad',
    pregunta: '¿Ha existido siempre una sola especie humana a la vez?',
    pasos: [
      {
        texto:
          'En Cronología, observe el periodo entre hace 2,5 y 1,5 millones de años. ¿Cuántas especies africanas se superponen en el tiempo?',
        targetTab: 'cronologia',
        targetLabel: 'Explorar 2,5–1,5 Ma',
      },
      {
        texto:
          'En Comparador de dos especies, elija Paranthropus boisei y Homo erectus. ¿Coincidieron en el tiempo?',
        targetTab: 'comparar',
        targetLabel: 'Abrir Comparador',
      },
      {
        texto:
          'Compare después Homo sapiens y Homo naledi. ¿Qué dice el resultado sobre la idea de una «escalera» evolutiva?',
        targetTab: 'comparar',
        targetLabel: 'Comparar sapiens y naledi',
      },
    ],
    trabajo:
      'Argumente por qué se habla de un árbol, y no de una escalera, para explicar la evolución humana.',
  },
  {
    n: 4,
    titulo: 'Paisajes y climas del origen',
    pregunta: '¿Influyó el ambiente en la evolución humana? ¿De qué manera?',
    pasos: [
      {
        texto:
          'En Clima y Ecología, lea las tres grandes ideas marco y resuma cada una en una frase propia.',
        targetTab: 'clima',
        targetLabel: 'Ir a Clima y Ecología',
      },
      {
        texto:
          'En Territorio, observe en qué zonas de África se concentran las regiones de hallazgos fósiles (especialmente en la ampliación del Rift Oriental).',
        targetTab: 'territorio',
        targetLabel: 'Ver mapa del Rift',
      },
      {
        texto:
          'Relacione la tercera idea («El ambiente condiciona lo que se conserva») con el mapa: ¿por qué hay tantos hallazgos en el Rift y el karst sudafricano, y tan pocos en selvas ecuatoriales?',
      },
    ],
    trabajo:
      'Comente cómo el clima y el paisaje condicionan tanto la evolución humana como lo que hoy podemos encontrar. Puede relacionarlo con la materia de Geografía africana.',
  },
  {
    n: 5,
    titulo: 'Patrimonio de la humanidad en África',
    pregunta: '¿Quién conserva, estudia y cuenta hoy esta historia?',
    destacadoTitulo: 'Cinco sitios del Patrimonio Mundial (UNESCO) ligados a los orígenes humanos',
    destacadoItems: [
      {
        titulo: 'Bajo valle del Awash (Etiopía · 1980)',
        texto:
          'Allí apareció en 1974 «Lucy», un esqueleto parcial de Australopithecus afarensis.',
      },
      {
        titulo: 'Bajo valle del Omo (Etiopía · 1980)',
        texto:
          'Según la UNESCO, conserva fósiles de Australopithecus y de Homo, y herramientas de piedra de hace unos 2,4 millones de años.',
      },
      {
        titulo: 'Parques nacionales del lago Turkana (Kenia · 1997)',
        texto:
          'Incluyen los depósitos de Koobi Fora, clave para el registro de homininos plio-pleistocenos.',
      },
      {
        titulo: 'Área de conservación del Ngorongoro (Tanzania · 1979 / amp. 2010)',
        texto:
          'Inscrita por su naturaleza y ampliada por sus valores culturales; comprende la garganta de Olduvai y las huellas de Laetoli.',
      },
      {
        titulo: 'Sitios de homínidos fósiles de Sudáfrica (1999 / amp. 2005)',
        texto:
          'Sterkfontein, Swartkrans, Kromdraai y alrededores, ampliados con el valle de Makapan y el yacimiento del cráneo de Taung.',
      },
    ],
    notaDestacado:
      'Los nombres en español son traducciones orientativas; las denominaciones oficiales de la UNESCO constan en inglés y francés.',
    pasos: [
      {
        texto:
          'En Territorio, localice las regiones del Afar, el Omo, Turkana y Sudáfrica. ¿Qué sitio UNESCO de la lista corresponde a cada una?',
        targetTab: 'territorio',
        targetLabel: 'Localizar en Territorio',
      },
      {
        texto:
          'En Cronología, anote qué especies del recurso se documentan en dos de esas regiones.',
        targetTab: 'cronologia',
        targetLabel: 'Consultar especies',
      },
      {
        texto:
          'Reflexione sobre quién estudia, conserva y explica hoy estos fósiles: museos, universidades, investigadores africanos y extranjeros, y comunidades locales.',
      },
    ],
    trabajo:
      'Elija uno de los cinco sitios y elabore una ficha: país, año de inscripción, qué se encontró allí y por qué es patrimonio de toda la humanidad. Consulte su página oficial en la web de la UNESCO.',
    fuentes: [
      { titulo: 'Lista del Patrimonio Mundial de la UNESCO', url: 'https://whc.unesco.org/es/list/' },
      { titulo: 'Lower Valley of the Awash (UNESCO n.º 10)', url: 'https://whc.unesco.org/es/list/10' },
      { titulo: 'Lower Valley of the Omo (UNESCO n.º 17)', url: 'https://whc.unesco.org/es/list/17' },
      { titulo: 'Lake Turkana National Parks (UNESCO n.º 801)', url: 'https://whc.unesco.org/es/list/801' },
      { titulo: 'Ngorongoro Conservation Area (UNESCO n.º 39)', url: 'https://whc.unesco.org/es/list/39' },
      { titulo: 'Fossil Hominid Sites of South Africa (UNESCO n.º 915)', url: 'https://whc.unesco.org/es/list/915' },
    ],
  },
  {
    n: 6,
    titulo: 'Imágenes de nuestros orígenes',
    pregunta: '¿Cómo se ha representado el origen humano y qué imagen de África ha transmitido?',
    destacadoTitulo: 'Tres casos historiográficos para pensar',
    destacadoItems: [
      {
        titulo: 'Piltdown (Inglaterra, 1912–1953)',
        texto:
          'Presentado en 1912 como el «eslabón perdido», en 1953 se demostró que era una falsificación: un cráneo humano combinado con la mandíbula de un simio moderno (probablemente un orangután).',
      },
      {
        titulo: 'El niño de Taung (Sudáfrica, 1925)',
        texto:
          'Raymond Dart lo describió en Nature como Australopithecus africanus: un ser bípedo de cerebro pequeño que situaba el origen humano en África. Muchos colegas lo rechazaron por prejuicios eurocéntricos y porque Piltdown parecía confirmar un origen europeo o asiático.',
      },
      {
        titulo: 'Investigación hecha desde África (Turkana Boy y Selam)',
        texto:
          'El niño de Turkana (Homo erectus/ergaster, 1,5–1,6 Ma) fue hallado en 1984 por el keniano Kamoya Kimeu en Nariokotome. Selam (A. afarensis, ~3,3 Ma) fue hallada en 2000 en Dikika por el equipo del etíope Zeresenay Alemseged.',
      },
    ],
    pasos: [
      {
        texto:
          'En Cronología, busque Australopithecus africanus y Homo erectus: ¿qué dicen sus fichas y sus fechas?',
        targetTab: 'cronologia',
        targetLabel: 'Buscar especies',
      },
      {
        texto:
          'Compare la línea del tiempo ramificada del Atlas con el icono popular de la «marcha del progreso». ¿En qué se diferencian?',
        targetTab: 'parentesco',
        targetLabel: 'Ver Parentesco',
      },
      {
        texto:
          'Analice una representación del origen humano en un manual o documental y examine qué imagen transmite sobre África.',
      },
    ],
    trabajo:
      'Analice, con un caso concreto, cómo ha cambiado la imagen de África en la investigación sobre los orígenes humanos. Puede relacionarlo con la materia El imaginario africano.',
    fuentes: [
      {
        titulo: 'Piltdown Man forgery (British Geological Survey)',
        url: 'https://earthwise.bgs.ac.uk/index.php/Piltdown_Man_forgery',
      },
      {
        titulo: 'The discovery of Australopithecus (Leakey Foundation)',
        url: 'https://leakeyfoundation.org/the-discovery-of-australopithecus-and-its-implications/',
      },
      {
        titulo: 'KNM-WT 15000, Turkana Boy (Smithsonian)',
        url: 'https://si.edu/object/knm-wt-15000a-knm-wt-15000-turkana-boy-human-fossil:nmnheducation_13109587',
      },
      {
        titulo: 'Zeresenay Alemseged y Selam (Univ. of Chicago)',
        url: 'https://news.uchicago.edu/story/paleoanthropologist-explores-roots-evolution',
      },
    ],
  },
];

export interface TrabajoGuideStep {
  num: string;
  titulo: string;
  puntos: string[];
}

export const DEA_TRABAJO_INDIVIDUAL_GUIDE: TrabajoGuideStep[] = [
  {
    num: '01',
    titulo: 'Elija una pregunta concreta',
    puntos: [
      '¿Qué nos dicen cinco especies africanas sobre seis millones de años de evolución?',
      '¿Por qué se habla de un árbol, y no de una escalera, en la evolución humana?',
      '¿Qué sitio del Patrimonio Mundial africano explica mejor el origen de la humanidad, y por qué?',
    ],
  },
  {
    num: '02',
    titulo: 'Organice el texto académico',
    puntos: [
      'Título claro que anticipe la respuesta o tesis.',
      'Introducción: la pregunta seleccionada y su relevancia histórica o antropológica.',
      'Desarrollo: datos del recurso (fechas, lugares, especies) diferenciados de sus interpretaciones, señalando siempre qué fechas o táxones siguen debatidos.',
      'Conclusión y listado completo de fuentes citadas.',
    ],
  },
  {
    num: '03',
    titulo: 'Use fuentes fiables y trazables',
    puntos: [
      'Priorice artículos científicos revisados por pares, libros especializados, museos y organismos oficiales como la UNESCO.',
      'Compruebe autoría, fecha de publicación y evidencia empírica; parta de los 46 DOI verificados de este Atlas.',
    ],
  },
  {
    num: '04',
    titulo: 'Cite con normas APA (7.ª edición)',
    puntos: [
      'Artículo con DOI: Wood, B., y Boyle, E. K. (2016). Hominin taxic diversity: Fact or fantasy? American Journal of Physical Anthropology, 159(S61), S37–S78. https://doi.org/10.1002/ajpa.22902',
      'Recurso web ULPGC: Facultad de Ciencias de la Educación, Universidad de Las Palmas de Gran Canaria. (2026). África, cuna de la humanidad [Recurso web]. https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/dea/',
    ],
  },
  {
    num: '05',
    titulo: 'Verificación antes de entregar',
    puntos: [
      '¿Responde de forma directa a la pregunta del título?',
      '¿Distingue con rigor los datos empíricos de las interpretaciones y modelos?',
      '¿Se presentan las fechas como aproximadas cuando lo son y constan todas las citas?',
    ],
  },
];

export interface PropuestaDidacticaPerfil {
  id: 'primaria' | 'futuro-docente' | 'universitario' | 'general';
  label: string;
  titulo: string;
  itinerario: string[];
  objetivos: string[];
  actividades: string[];
  preguntas: string[];
  evidencias: string[];
  criterios: string[];
}

export const PROPUESTA_DIDACTICA_PERFILES: PropuestaDidacticaPerfil[] = [
  {
    id: 'primaria',
    label: 'Educación Primaria',
    titulo: 'Perfil 1 · Estudiante de Educación Primaria',
    itinerario: [
      'Entrar por la vista de Cronología y observar el reloj de 24 horas en nivel básico.',
      'Identificar 3 o 4 táxones muy separados en el tiempo.',
      'Abrir una ficha y localizar nombre, antigüedad aproximada y lugar.',
      'Pasar al mapa de Territorio para situar los hallazgos africanos.',
      'Cerrar con una pregunta oral o escrita sobre cambios y permanencias.',
    ],
    objetivos: [
      'Reconocer que la evolución humana se estudia con evidencias fósiles y contextuales.',
      'Ordenar hechos y táxones de forma aproximada en una escala temporal.',
      'Localizar yacimientos o regiones en un mapa sin confundirlo con la cronología.',
      'Distinguir observación, inferencia y opinión en explicaciones sencillas.',
    ],
    actividades: [
      'Línea del tiempo cooperativa con tarjetas de táxones.',
      '«Detectives de evidencias»: buscar en una ficha qué datos proceden de fósiles, fechas o lugares.',
      'Mapa mural: ubicar regiones de hallazgo y comentar distancias.',
      'Comparación guiada de dos fichas con una tabla de semejanzas y diferencias.',
    ],
    preguntas: [
      '¿Qué dato nos ayuda a saber si un táxon es más antiguo o más reciente?',
      '¿Qué cosas sabemos con seguridad y cuáles son interpretaciones?',
      '¿Por qué no basta con mirar una sola imagen para explicar un fósil?',
      '¿Cómo cambia una explicación cuando aparecen nuevas evidencias?',
    ],
    evidencias: [
      'Línea temporal ordenada con justificación breve.',
      'Mapa con localizaciones básicas.',
      'Ficha de comparación entre dos táxones.',
      'Respuesta oral o escrita diferenciando dato e interpretación.',
    ],
    criterios: [
      'Ordena táxones de forma coherente en una escala temporal aproximada.',
      'Usa vocabulario básico con corrección: fósil, evidencia, especie, yacimiento.',
      'Localiza regiones principales sin confundir mapa y cronología.',
      'Explica una idea científica apoyándose en al menos una evidencia visible en el atlas.',
    ],
  },
  {
    id: 'futuro-docente',
    label: 'Futuro docente',
    titulo: 'Perfil 2 · Futuro docente (Grado en Educación)',
    itinerario: [
      'Revisar el bloque de Docencia y Aula y la normativa vigente (LOMLOE / Canarias).',
      'Seleccionar una ruta de itinerarios como secuencia didáctica breve.',
      'Contrastar la ruta con Cronología, Territorio, Comparador y fichas.',
      'Diseñar una actividad con pregunta investigable, producto y criterio de evaluación.',
      'Revisar accesibilidad (DUA), complejidad del lenguaje y andamiaje para el aula.',
    ],
    objetivos: [
      'Transformar contenido científico riguroso en una secuencia enseñable.',
      'Diseñar actividades que diferencien datos, modelos e incertidumbres.',
      'Usar el atlas para promover alfabetización científica y pensamiento histórico.',
      'Adaptar tareas a edad, tiempo disponible y necesidades de accesibilidad.',
    ],
    actividades: [
      'Microdiseño de una sesión de 30–45 minutos con una vista principal y una evidencia final.',
      'Análisis de una ficha para detectar conceptos que necesitan mediación docente.',
      'Elaboración de una rúbrica breve para comparar táxones.',
      'Debate simulado sobre cómo explicar la incertidumbre científica sin simplificar en exceso.',
    ],
    preguntas: [
      '¿Qué contenido conviene convertir en pregunta y cuál en información de apoyo?',
      '¿Qué evidencia debe mirar primero el alumnado para no memorizar sin interpretar?',
      '¿Cómo evitar una explicación lineal o finalista de la evolución humana?',
      '¿Qué apoyos visuales o lingüísticos necesita cada grupo?',
    ],
    evidencias: [
      'Secuencia didáctica breve con objetivos, actividad, recurso y evaluación.',
      'Rúbrica o lista de cotejo para una tarea con el atlas.',
      'Justificación pedagógica de la vista elegida.',
      'Adaptación de una actividad para distintos niveles de complejidad.',
    ],
    criterios: [
      'Formula objetivos observables y coherentes con la actividad.',
      'Integra fuentes del atlas sin alterar ni simplificar incorrectamente el contenido científico.',
      'Incluye una evidencia de aprendizaje verificable.',
      'Considera accesibilidad, tiempo real de aula y diversidad del alumnado.',
    ],
  },
  {
    id: 'universitario',
    label: 'Profesorado universitario',
    titulo: 'Perfil 3 · Profesorado universitario y Seminario DEA',
    itinerario: [
      'Iniciar desde Parentesco, Métodos (datación/tafonomía/ADNa) o Comparador según la asignatura.',
      'Seleccionar un problema interpretativo: cronología, clasificación, evidencia o incertidumbre.',
      'Comparar fichas, clados, mapas, PaleoLab 3D y contexto ambiental/paleobotánico.',
      'Solicitar al alumnado una argumentación basada en evidencias del atlas y DOI externos.',
      'Cerrar con discusión metodológica sobre límites de los datos y sesgos tafonómicos.',
    ],
    objetivos: [
      'Analizar relaciones entre evidencia, método e interpretación paleoantropológica.',
      'Evaluar niveles de consenso, incertidumbre y calidad de las evidencias.',
      'Conectar escala temporal, distribución geográfica, contexto ambiental y clasificación.',
      'Usar el atlas como entorno de exploración previa, seminario o evaluación formativa.',
    ],
    actividades: [
      'Seminario comparativo sobre un grupo de táxones con posiciones filogenéticas discutidas.',
      'Práctica de lectura crítica de fichas: datación, yacimiento, rasgos, DOI e incertidumbres.',
      'Debate metodológico sobre qué cambia cuando se incorpora nueva evidencia (p. ej. paleogenómica).',
      'Ensayo breve o Ficha Crítica de Seminario con tesis, evidencias del atlas y límites.',
    ],
    preguntas: [
      '¿Qué tipo de evidencia sostiene mejor una hipótesis filogenética?',
      '¿Dónde termina el dato y dónde empieza el modelo interpretativo?',
      '¿Qué incertidumbres son metodológicas, taxonómicas o cronológicas?',
      '¿Cómo afecta la distribución geográfica y tafonómica a la interpretación evolutiva?',
    ],
    evidencias: [
      'Argumentación escrita con evidencias localizadas en varias vistas del atlas.',
      'Mapa conceptual entre táxones, métodos, fechas y debates.',
      'Presentación breve con comparación metodológica.',
      'Comentario crítico sobre incertidumbre y consenso científico.',
    ],
    criterios: [
      'Usa evidencias plurales y reconoce explícitamente sus límites.',
      'Distingue hipótesis, consenso y controversia activa.',
      'Integra cronología, espacio, taxonomía y método inferencial.',
      'Formula conclusiones prudentes, trazables y revisables.',
    ],
  },
  {
    id: 'general',
    label: 'Usuario general',
    titulo: 'Perfil 4 · Usuario general interesado en evolución humana',
    itinerario: [
      'Comenzar por la Introducción narrada (2 min) y la Cronología general.',
      'Abrir fichas de táxones destacados y revisar su modelo 3D o ubicación.',
      'Explorar Territorio y Parentesco para relacionar tiempo, espacio y linajes.',
      'Consultar el Glosario alfabético completo cuando aparezcan conceptos técnicos.',
      'Finalizar con una ruta personal de exploración y revisión bibliográfica.',
    ],
    objetivos: [
      'Comprender que la evolución humana no es una escalera lineal sino un árbol ramificado.',
      'Reconocer la diversidad de táxones y evidencias de origen africano.',
      'Leer con cautela fechas aproximadas, mapas y relaciones evolutivas.',
      'Desarrollar curiosidad informada y respeto por la incertidumbre científica.',
    ],
    actividades: [
      'Ruta libre: elegir tres táxones y explicar por qué llaman la atención.',
      '«Antes pensaba, ahora pienso»: registrar cómo cambia una idea inicial tras explorar el atlas.',
      'Comparación visual entre Cronología, Territorio y Parentesco.',
      'Consulta del Glosario para construir un pequeño vocabulario personal.',
    ],
    preguntas: [
      '¿Qué idea previa sobre evolución humana cambia al usar el atlas?',
      '¿Qué diferencia hay entre antigüedad, parentesco y parecido morfológico?',
      '¿Qué datos parecen más firmes y cuáles requieren cautela?',
      '¿Cómo puede una nueva evidencia modificar una explicación aceptada?',
    ],
    evidencias: [
      'Diario breve de exploración con notas de las sesiones o vistas consultadas.',
      'Explicación de una ruta personal por el atlas.',
      'Lista comentada de términos nuevos del glosario.',
      'Comparación sencilla entre dos formas de representar la evolución humana.',
    ],
    criterios: [
      'Navega por varias vistas y conecta información de forma coherente.',
      'Evita explicaciones lineales o teleológicas.',
      'Usa vocabulario básico con precisión suficiente.',
      'Formula preguntas propias a partir de evidencias observadas.',
    ],
  },
];
