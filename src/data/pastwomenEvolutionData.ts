export interface PastwomenEvolutionStage {
  id: string;
  eraLabel: string;
  chronology: string;
  taxa: string;
  africanAndGlobalSites: string;
  title: string;
  keyMetrics: Array<{ label: string; value: string }>;
  biologicalAndMaterialEvidence: string;
  pastwomenPerspective: string;
  maintenanceFocus: string;
  linkedTopicId: string;
  linkedTopicLabel: string;
  citation: string;
}

export interface PastwomenMythContrast {
  id: string;
  axisShort: string;
  axisTitle: string;
  androcentricMyth: string;
  bioarchaeologicalEvidence: string;
  keyMaterialIndicators: string;
  pastwomenImplication: string;
}

export interface MaintenanceActivityRow {
  id: string;
  sphere: string;
  evolutionaryRole: string;
  archaeologicalTrace: string;
  diplomaConnection: string;
  targetAction:
    | { type: 'topic'; topicId: string; view3d?: boolean; label: string }
    | { type: 'ethology'; tab: 'parentesco' | 'taller-automedicacion' | 'culturas-taller'; label: string };
}

export const PASTWOMEN_PORTAL_URL = 'https://www.pastwomen.net/';

export const PASTWOMEN_EVOLUTION_STATS = [
  {
    label: 'Horizonte evolutivo cubierto',
    value: '4,2 Ma – Holoceno',
    detail: 'De Australopithecus afarensis al Paleolítico Superior y Neolítico',
    accent: 'ochre' as const,
  },
  {
    label: 'Eje conceptual central',
    value: '5 ámbitos',
    detail: 'Actividades de mantenimiento, cuidados, parto, dieta e infancia',
    accent: 'lapis' as const,
  },
  {
    label: 'Red interuniversitaria',
    value: '7+ universidades',
    detail: 'UAB · UJA · UGR · UAM · UPF · UV · Universidad de Oviedo',
    accent: 'forest' as const,
  },
  {
    label: 'Enfoque bioarqueológico',
    value: 'Isótopos y osteología',
    detail: 'Pelvis, desgaste dental, cálculo, trazas de uso y paleopatología',
    accent: 'ink' as const,
  },
];

export const PASTWOMEN_EVOLUTION_STAGES: PastwomenEvolutionStage[] = [
  {
    id: 'pw-australopithecus',
    eraLabel: 'Etapa 01 · Primeros bípedos africanos',
    chronology: '4,2 – 2,9 Ma',
    taxa: 'Australopithecus anamensis · Australopithecus afarensis',
    africanAndGlobalSites: 'Hadar (Etiopía) · Laetoli (Tanzania) · Afar',
    title: 'Lucy (AL 288-1), Laetoli y la corporalidad de los primeros bípedos',
    keyMetrics: [
      { label: 'Estatura estimada (AL 288-1)', value: '~1,05–1,10 m' },
      { label: 'Masa corporal estimada', value: '~28–30 kg' },
      { label: 'Capacidad craneal media', value: '~400–450 cm³' },
    ],
    biologicalAndMaterialEvidence:
      'El esqueleto parcial de AL 288-1 («Lucy», ~3,2 Ma) y las huellas volcánicas de Laetoli (~3,66 Ma) confirman una locomoción bípeda habitual combinada con rasgos arbóreos conservados en extremidades superiores. Su pelvis ancha y baja ya inicia la reestructuración biomecánica hacia el equilibrio bipodal, manteniendo aún un parto menos estrecho que en Homo tardío.',
    pastwomenPerspective:
      'Pastwomen analiza a Australopithecus afarensis superando la caricatura pasiva: destaca la movilidad cotidiana de hembras adultas y juveniles en mosaicos africanos, la recolección vegetal como base estable de la subsistencia y las implicaciones de portar crías dependientes con manos progresivamente liberadas.',
    maintenanceFocus:
      'Desplazamiento colectivo intergeneracional, transporte de crías y aprovechamiento diversificado de recursos vegetales en sabana arbolada.',
    linkedTopicId: 'tema-04',
    linkedTopicLabel: 'Tema 04 · Bipedismo y biomecánica',
    citation: 'Pastwomen (Evolución Humana · Paleolítico); González Marcén, Montón Subías & Picazo (2008)',
  },
  {
    id: 'pw-homo-temprano',
    eraLabel: 'Etapa 02 · Encefalización y dilema obstétrico',
    chronology: '2,4 – 0,8 Ma',
    taxa: 'Homo habilis · Homo ergaster / Homo erectus',
    africanAndGlobalSites: 'Turkana Occidental y Koobi Fora (Kenia) · Olduvai (Tanzania) · Dmanisi',
    title: 'El dilema obstétrico, el parto asistido y las redes de aloparentalidad',
    keyMetrics: [
      { label: 'Expansión encefálica', value: '600 → 1.000 cm³' },
      { label: 'Maduración postnatal', value: 'Altricialidad secundaria' },
      { label: 'Hito social', value: 'Parto asistido comunitario' },
    ],
    biologicalAndMaterialEvidence:
      'La combinación de una pelvis estrechada para la marcha bípeda eficiente y la carrera de resistencia con el aumento sostenido del volumen cerebral generó un compromiso biomecánico y metabólico conocido como «dilema obstétrico». El nacimiento pasa a implicar rotación fetal compleja y neonatos con cerebros muy inmaduros que requieren años de crianza intensiva.',
    pastwomenPerspective:
      'Frente a los relatos centrados exclusivamente en la talla lítica masculina, la arqueología de género y Pastwomen demuestran que el parto humano dejó de ser un evento solitario para convertirse en una práctica social asistida (obligate midwifery), cimentando la interdependencia, el cuidado cooperativo y la supervivencia de los recién nacidos.',
    maintenanceFocus:
      'Asistencia mutua en el parto, lactancia, porteo prolongado y cooperación de abuelas y otros cuidadores (aloparentalidad).',
    linkedTopicId: 'tema-09',
    linkedTopicLabel: 'Tema 09 · Teoría de la abuela y parentesco',
    citation: 'Pastwomen (Maternidad y cuidados); Rosenberg & Trevathan (2002); Hrdy (2009); Hawkes et al. (1998)',
  },
  {
    id: 'pw-paleolitico-medio',
    eraLabel: 'Etapa 03 · Fuego, dieta y arqueología de los cuidados',
    chronology: '600 – 40 ka',
    taxa: 'Homo heidelbergensis · Homo neanderthalensis · Homo sapiens arcaico',
    africanAndGlobalSites: 'Wonderwerk y Klasies River (Sudáfrica) · Atapuerca · Shanidar · El Sidrón',
    title: 'Actividades de mantenimiento, gestión del fuego y atención a la vulnerabilidad',
    keyMetrics: [
      { label: 'Evidencia dietética', value: 'Isótopos y cálculo dental' },
      { label: 'Registro paleopatológico', value: 'Supervivencia con lesiones' },
      { label: 'Tecnología clave', value: 'Fuego, pieles y fibras' },
    ],
    biologicalAndMaterialEvidence:
      'Los análisis de isótopos de carbono, nitrógeno y estroncio, junto con microfósiles vegetales atrapados en el cálculo dental, corrigen la imagen de grupos exclusivamente carnívoros: tubérculos, semillas, frutos y plantas cocinadas aportaban energía regular y micronutrientes esenciales. Asimismo, esqueletos con fracturas graves, pérdida dental total o discapacidades crónicas (como en Atapuerca o Shanidar) prueban cuidados prolongados por parte del grupo.',
    pastwomenPerspective:
      'Pastwomen conceptualiza estas tareas como «actividades de mantenimiento»: procesamiento de alimentos, control del fuego, preparación de pieles, higiene, botánica medicinal y cuidado de enfermos y mayores. Lejos de ser tareas accesorias, sostuvieron la demografía y la cohesión cotidiana de los grupos paleolíticos.',
    maintenanceFocus:
      'Gestión térmica y culinaria del fuego, recolección sistemática, cuidados médicos tempranos y conservación de alimentos.',
    linkedTopicId: 'tema-05',
    linkedTopicLabel: 'Tema 05 · Herramientas y subsistencia',
    citation: 'Pastwomen (Actividades de mantenimiento y Paleolítico); Sánchez Romero (2010, 2022); Spikins et al. (2018)',
  },
  {
    id: 'pw-sapiens-infancia',
    eraLabel: 'Etapa 04 · Homo sapiens, infancia y tecnología orgánica',
    chronology: '300 – 10 ka',
    taxa: 'Homo sapiens',
    africanAndGlobalSites: 'Jebel Irhoud (Marruecos) · Blombos y Border Cave (Sudáfrica) · Panga ya Saidi (Kenia)',
    title: 'Infancia prolongada, aprendizaje técnico y deconstrucción de estereotipos visuales',
    keyMetrics: [
      { label: 'Origen panafricano', value: '~315 ka (Jebel Irhoud)' },
      { label: 'Primer enterramiento infantil', value: '~78 ka (Mtoto, Kenia)' },
      { label: 'Registro simbólico', value: 'Ocre, cuentas y aprendizaje' },
    ],
    biologicalAndMaterialEvidence:
      'El hallazgo de enterramientos infantiles cuidadosos en África —como «Mtoto» en Panga ya Saidi (~78 ka)—, el uso temprano de ocre y cuentas perforadas en Blombos, y los rastros de aprendices jóvenes en talleres líticos demuestran la centralidad de la infancia como etapa estructurada de socialización, juego y transmisión técnica.',
    pastwomenPerspective:
      'Pastwomen denuncia el sesgo de las ilustraciones museográficas tradicionales (donde los hombres tallan, cazan y pintan mientras mujeres y criaturas aparecen pasivas o ausentes) y propone reconstrucciones científicas basadas en evidencias que visibilizan a mujeres, infancia y mayores en la producción técnica, textil, alimentaria y simbólica.',
    maintenanceFocus:
      'Socialización infantil, transmisión intergeneracional de conocimientos, tecnologías perecederas (cestería, fibras, portabebés) y prácticas simbólicas.',
    linkedTopicId: 'tema-06',
    linkedTopicLabel: 'Tema 06 · Cuerpos, mentes y primeras voces',
    citation: 'Pastwomen (Infancia y Paleolítico Superior); Martinón-Torres et al. (2021); Sánchez Romero (2022)',
  },
];

export const PASTWOMEN_MYTH_CONTRASTS: PastwomenMythContrast[] = [
  {
    id: 'myth-marcha',
    axisShort: 'Iconografía lineal',
    axisTitle: 'De la «Marcha del Progreso» al árbol comunitario',
    androcentricMyth:
      'La evolución humana se representa habitualmente como una fila lineal y ascendente que culmina en un único varón adulto erguido portando una lanza, borrando la diversidad sexual, etaria y geográfica africana.',
    bioarchaeologicalEvidence:
      'La paleoantropología demuestra una evolución ramificada en mosaico dentro de África donde la supervivencia dependió de comunidades enteras (mujeres, hombres, criaturas y mayores) adaptándose a climas cambiantes.',
    keyMaterialIndicators:
      'Huellas colectivas de Laetoli, registro fósil panafricano diverso y enterramientos infantiles tempranos como Panga ya Saidi.',
    pastwomenImplication:
      'Las láminas abiertas de Pastwomen sustituyen el icono androcéntrico por escenas basadas en evidencia arqueológica que incluyen todas las edades y actividades.',
  },
  {
    id: 'myth-pelvis',
    axisShort: 'Bipedismo y parto',
    axisTitle: 'Pelvis, dilema obstétrico y socialización del nacimiento',
    androcentricMyth:
      'El bipedismo suele explicarse únicamente desde la locomoción masculina para cazar o recorrer grandes distancias, tratando el parto como un proceso meramente biológico y solitario.',
    bioarchaeologicalEvidence:
      'El estrechamiento pélvico y la encefalización crearon un compromiso obstétrico y energético que volvió indispensable el acompañamiento en el parto y la cooperación comunitaria en la crianza.',
    keyMaterialIndicators:
      'Morfología pélvica comparada (AL 288-1, KNM-WT 15000, pelvis neandertales y sapiens) y tasas de crecimiento dental infantil.',
    pastwomenImplication:
      'Sitúa la vulnerabilidad del nacimiento y las redes de apoyo mutuo como pilares evolutivos al mismo nivel que el bipedismo o el tamaño cerebral.',
  },
  {
    id: 'myth-dieta',
    axisShort: 'Caza vs. recolección',
    axisTitle: 'Nutrición vegetal constante frente al mito del «hombre cazador»',
    androcentricMyth:
      'El relato clásico atribuye el salto evolutivo casi en exclusiva a la caza mayor masculina, infravalorando la recolección y el procesado de alimentos vegetales.',
    bioarchaeologicalEvidence:
      'Los isótopos estables, el microdesgaste y los fitolitos en cálculo dental revelan dietas omnívoras muy ricas en raíces, tubérculos, semillas, frutos y fauna pequeña, complementadas con cocción al fuego.',
    keyMaterialIndicators:
      'Isótopos de carbono/estroncio, gránulos de almidón en cálculo dental, hogares estructurados y piedras de moler paleolíticas.',
    pastwomenImplication:
      'Reconoce la recolección y la transformación culinaria como fuentes energéticas diarias decisivas para sostener cerebros metabólicamente muy costosos.',
  },
  {
    id: 'myth-tecnologia',
    axisShort: 'Sesgo lítico',
    axisTitle: 'Tecnologías orgánicas y actividades de mantenimiento',
    androcentricMyth:
      'Se asume que solo las puntas líticas de caza representan innovación tecnológica y que fueron fabricadas exclusivamente por varones.',
    bioarchaeologicalEvidence:
      'La mayor parte del utillaje cotidiano (fibras vegetales, cordelería, cestería, portabebés, palos cavadores, raspadores para pieles) era perecedero o polifuncional, y su uso involucraba a todo el grupo.',
    keyMaterialIndicators:
      'Trazas de uso en filos líticos sobre vegetales y pieles, improntas de cordelería, punzones óseos y paralelos etológicos (Fongoli, Goualougo).',
    pastwomenImplication:
      'Amplía la definición de tecnología en evolución humana incorporando los contenedores, el transporte de crías y el mantenimiento cotidiano del campamento.',
  },
  {
    id: 'myth-cuidados',
    axisShort: 'Cuidados e infancia',
    axisTitle: 'La arqueología de los cuidados como motor de hominización',
    androcentricMyth:
      'La crianza, la atención a enfermos y la socialización infantil se omiten en las síntesis evolutivas como esfera doméstica secundaria o «natural».',
    bioarchaeologicalEvidence:
      'La supervivencia de individuos con traumatismos incapacitantes o edentulismo severo y la prolongada infancia humana prueban sistemas estructurados de cuidado médico, alimentación y transmisión cultural.',
    keyMaterialIndicators:
      'Paleopatologías curadas en restos del Pleistoceno, marcadores de destete en esmalte dental y evidencias de aprendizaje técnico infantil.',
    pastwomenImplication:
      'Coloca los cuidados y las relaciones interpersonales en el centro de la explicación científica sobre cómo llegamos a ser humanos.',
  },
];

export const MAINTENANCE_ACTIVITIES_MATRIX: MaintenanceActivityRow[] = [
  {
    id: 'maint-maternidad',
    sphere: 'Maternidad, parto y ciclo vital',
    evolutionaryRole:
      'Respuesta social al dilema obstétrico y a la altricialidad secundaria; asegura la viabilidad materna y neonatal.',
    archaeologicalTrace:
      'Morfología pélvica fósil, isótopos de nitrógeno (duración de lactancia/destete en dientes) y registros de porteo.',
    diplomaConnection: 'Tema 04 (Biomecánica y pelvis 3D) · Tema 09 (Parentesco)',
    targetAction: {
      type: 'topic',
      topicId: 'tema-04',
      view3d: true,
      label: 'Abrir Biomecánica 3D (Tema 04)',
    },
  },
  {
    id: 'maint-cuidados',
    sphere: 'Cuidados corporales, salud y curación',
    evolutionaryRole:
      'Atención a lesiones, infecciones y envejecimiento; prolonga la esperanza de vida y preserva la memoria colectiva del grupo.',
    archaeologicalTrace:
      'Fracturas consolidadas, supervivencia sin dentición, cálculo dental con plantas no nutritivas y zoofarmacognosia comparada.',
    diplomaConnection: 'Etología · Taller de Automedicación y zoofarmacognosia',
    targetAction: {
      type: 'ethology',
      tab: 'taller-automedicacion',
      label: 'Abrir Taller de Automedicación',
    },
  },
  {
    id: 'maint-alimentacion',
    sphere: 'Recolección, fuego y procesado alimentario',
    evolutionaryRole:
      'Aporte calórico regular y biodisponible (cocción de tubérculos y plantas) indispensable para la encefalización.',
    archaeologicalTrace:
      'Hogares controlados, fitolitos y almidones en cálculo dental, trazas de uso en útiles líticos y análisis isotópicos.',
    diplomaConnection: 'Tema 05 (Herramientas y dieta) · Paleobotánica',
    targetAction: {
      type: 'topic',
      topicId: 'tema-05',
      label: 'Ir al Tema 05 (Subsistencia)',
    },
  },
  {
    id: 'maint-infancia',
    sphere: 'Socialización de la infancia y aloparentalidad',
    evolutionaryRole:
      'Cuidado compartido (abuelas, parientes, grupo) y aprendizaje guiado durante una infancia evolutivamente prolongada.',
    archaeologicalTrace:
      'Núcleos líticos con errores de aprendizaje infantil, huellas infantiles en yacimientos y enterramientos cuidadosos.',
    diplomaConnection: 'Etología · Árbol de parentesco e Hipótesis de la abuela',
    targetAction: {
      type: 'ethology',
      tab: 'parentesco',
      label: 'Abrir Árbol de Parentesco',
    },
  },
  {
    id: 'maint-tecnologia',
    sphere: 'Tecnología orgánica cotidiana y abrigo',
    evolutionaryRole:
      'Elaboración de fibras, pieles, recipientes y portabebés que multiplican la movilidad y reducen el coste térmico.',
    archaeologicalTrace:
      'Raspadores y perforadores óseos, improntas textiles tempranas y paralelos de utillaje vegetal en primates africanos.',
    diplomaConnection: 'Etología · Culturas vegetales y sabana de Fongoli',
    targetAction: {
      type: 'ethology',
      tab: 'culturas-taller',
      label: 'Ver Culturas Ecológicas',
    },
  },
];
