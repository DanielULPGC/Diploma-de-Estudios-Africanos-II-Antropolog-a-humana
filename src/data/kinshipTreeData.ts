export type KinshipModelId = 'abuela' | 'matrilineal' | 'patrilineal' | 'primates';
export type KinshipSocialRole = 'elder' | 'caregiver' | 'youth';

export const SOCIAL_ROLE_META: Record<
  KinshipSocialRole,
  {
    label: string;
    pluralLabel: string;
    shortDescription: string;
    strokeHex: string;
    bgHex: string;
    textClass: string;
  }
> = {
  elder: {
    label: 'Anciano/a · Mayor',
    pluralLabel: 'Ancianos',
    shortDescription: 'Memoria generacional, longevidad post-reproductiva y autoridad de linaje',
    strokeHex: '#b43c0b',
    bgHex: '#fdf3ee',
    textClass: 'text-ochre',
  },
  caregiver: {
    label: 'Cuidador/a · Alopadre',
    pluralLabel: 'Cuidadores',
    shortDescription: 'Provisión alimentaria, crianza cooperativa, tutela y transmisión social',
    strokeHex: '#156f55',
    bgHex: '#edf7f3',
    textClass: 'text-forest',
  },
  youth: {
    label: 'Joven · Aprendiz',
    pluralLabel: 'Jóvenes',
    shortDescription: 'Infancia prolongada, aprendizaje cultural y continuidad generacional',
    strokeHex: '#1f5fa8',
    bgHex: '#eef4fb',
    textClass: 'text-lapis',
  },
};

export interface KinshipNode {
  id: string;
  label: string;
  shortLabel: string;
  sex: 'female' | 'male';
  socialRole: KinshipSocialRole;
  generation: 'G+2' | 'G+1' | 'G0' | 'G-1';
  x: number;
  y: number;
  isEgo?: boolean;
  inLineage: boolean;
  highlightTone?: 'ochre' | 'forest' | 'lapis' | 'plum' | 'neutral';
  statusTag: string;
  roleSummary: string;
  evolutionaryOrSocialFunction: string;
  flowsProvidedOrReceived: string;
  ethnographicAnchor: string;
}

export interface KinshipMarriageEdge {
  fromId: string;
  toId: string;
  label?: string;
}

export interface KinshipDescentSegment {
  /** SVG path d attribute for crisp orthogonal anthropological kinship lines */
  d: string;
  emphasized?: boolean;
}

export interface KinshipFlowArrow {
  id: string;
  d: string;
  label: string;
  labelX: number;
  labelY: number;
  tone: 'ochre' | 'lapis' | 'forest' | 'plum';
  dashed?: boolean;
  requiresGrandmother?: boolean;
}

export interface KinshipModelSpec {
  id: KinshipModelId;
  shortLabel: string;
  title: string;
  subtitle: string;
  ethnographicFocus: string;
  accentTone: 'ochre' | 'forest' | 'lapis' | 'plum';
  overview: string;
  legendLineageLabel: string;
  legendExternalLabel: string;
  legendFlowLabel: string;
  supportsGrandmotherToggle?: boolean;
  nodes: KinshipNode[];
  marriages: KinshipMarriageEdge[];
  descentSegments: KinshipDescentSegment[];
  flowArrows: KinshipFlowArrow[];
  keyMetrics: Array<{ label: string; value: string; note: string }>;
  references: string;
}

export const KINSHIP_MODELS: KinshipModelSpec[] = [
  {
    id: 'abuela',
    shortLabel: 'Teoría de la abuela (Hadza)',
    title: 'Hipótesis de la abuela y crianza cooperativa',
    subtitle: 'Transferencia intergeneracional de calorías y aloparentalidad en cazadores-recolectores',
    ethnographicFocus: 'Hadza (Tanzania) · Hawkes, O’Connell, Blurton Jones y Hrdy',
    accentTone: 'ochre',
    overview:
      'Explica por qué las mujeres humanas viven décadas tras la menopausia: al recolectar recursos fiables como tubérculos y cuidar de los nietos ya destetados, la abuela materna permite a su hija acortar el intervalo entre partos, sostener cerebros infantiles energéticamente costosos y prolongar el periodo de aprendizaje cultural.',
    legendLineageLabel: 'Red cooperativa de crianza (alopadres)',
    legendExternalLabel: 'Parientes con apoyo complementario',
    legendFlowLabel: 'Flujo de calorías (tubérculos) y cuidado infantil',
    supportsGrandmotherToggle: true,
    nodes: [
      {
        id: 'ab-abuela-mat',
        label: 'Abuela materna (post-reproductiva)',
        shortLabel: 'Abuela mat.',
        sex: 'female',
        socialRole: 'elder',
        generation: 'G+2',
        x: 220,
        y: 66,
        inLineage: true,
        highlightTone: 'ochre',
        statusTag: 'Eje de la hipótesis de la abuela',
        roleSummary:
          'Mujer mayor post-menopáusica que concentra su esfuerzo económico en la extracción de tubérculos profundos y el cuidado cotidiano de los nietos.',
        evolutionaryOrSocialFunction:
          'Su aporte calórico estabiliza el crecimiento de los nietos destetados cuando la madre atiende a un nuevo lactante, aumentando la eficacia biológica inclusiva y seleccionando una mayor longevidad humana.',
        flowsProvidedOrReceived:
          'Aporta ~1.500–2.000 kcal/día en tubérculos y supervisión infantil directa hacia su hija y sus nietos.',
        ethnographicAnchor:
          'Entre los Hadza de Tanzania, las mujeres mayores pasan más horas diarias excavando tubérculos que las madres jóvenes con bebés lactantes.',
      },
      {
        id: 'ab-abuelo-mat',
        label: 'Abuelo materno',
        shortLabel: 'Abuelo mat.',
        sex: 'male',
        socialRole: 'elder',
        generation: 'G+2',
        x: 340,
        y: 66,
        inLineage: false,
        highlightTone: 'neutral',
        statusTag: 'Generación parental mayor',
        roleSummary:
          'Compañero generacional que contribuye con caza oportunista, miel y transmisión de conocimiento ecológico del territorio.',
        evolutionaryOrSocialFunction:
          'Aporta recursos de alta variabilidad (carne, miel) que se reparten a escala de campamento más que exclusivamente hacia un único hogar.',
        flowsProvidedOrReceived:
          'Comparte carne y saberes territoriales en la red del campamento.',
        ethnographicAnchor:
          'El reparto comunal de presas grandes entre los Hadza reduce el riesgo alimentario del grupo entero.',
      },
      {
        id: 'ab-tia-mat',
        label: 'Tía materna (alopadre)',
        shortLabel: 'Tía materna',
        sex: 'female',
        socialRole: 'caregiver',
        generation: 'G+1',
        x: 155,
        y: 164,
        inLineage: true,
        highlightTone: 'lapis',
        statusTag: 'Crianza cooperativa (aloparentalidad)',
        roleSummary:
          'Hermana de la madre que comparte tareas de porteo, vigilancia infantil y recolección en campamentos flexibles.',
        evolutionaryOrSocialFunction:
          'Refuerza el colchón de cuidado cooperativo (Sarah Blaffer Hrdy), reduciendo la vulnerabilidad de las crías humanas altriciales.',
        flowsProvidedOrReceived:
          'Cuidado aloparental alterno y transmisión temprana de habilidades de recolección.',
        ethnographicAnchor:
          'En sociedades forrajeras africanas (Hadza, Efe, Aka), un bebé es sostenido por múltiples cuidadores desde los primeros días de vida.',
      },
      {
        id: 'ab-madre',
        label: 'Madre (edad reproductiva)',
        shortLabel: 'Madre',
        sex: 'female',
        socialRole: 'caregiver',
        generation: 'G+1',
        x: 280,
        y: 164,
        inLineage: true,
        highlightTone: 'ochre',
        statusTag: 'Receptora de apoyo intergeneracional',
        roleSummary:
          'Madre que combina lactancia intensiva con forrajeo cercano al campamento gracias al respaldo de su madre y parientes.',
        evolutionaryOrSocialFunction:
          'El apoyo de la abuela permite destetar antes al hijo mayor sin comprometer su nutrición, acortando el intervalo entre nacimientos frente a los grandes simios.',
        flowsProvidedOrReceived:
          'Recibe calorías y cuidado de la abuela; concentra energía metabólica en el lactante menor.',
        ethnographicAnchor:
          'Los intervalos entre partos humanos (~3–4 años en forrajeros) son mucho más cortos que en chimpancés (~5–6 años) u orangutanes (~7–8 años).',
      },
      {
        id: 'ab-padre',
        label: 'Padre (forrajeo complementario)',
        shortLabel: 'Padre',
        sex: 'male',
        socialRole: 'caregiver',
        generation: 'G+1',
        x: 420,
        y: 164,
        inLineage: false,
        highlightTone: 'lapis',
        statusTag: 'Provisión complementaria y protección',
        roleSummary:
          'Aporta proteínas, miel y defensa social, además de implicarse en el cuidado directo con variabilidad entre culturas africanas.',
        evolutionaryOrSocialFunction:
          'Complementa la dieta estable vegetal con nutrientes de alta densidad calórica y amplía la red de alianzas del hogar.',
        flowsProvidedOrReceived:
          'Aporta miel, carne y cooperación social al núcleo doméstico y al campamento.',
        ethnographicAnchor:
          'Entre los Aka de África Central, los padres pasan un porcentaje excepcionalmente alto del día en contacto físico con sus bebés.',
      },
      {
        id: 'ab-ego',
        label: 'EGO · Niño/a destetado/a (4–7 años)',
        shortLabel: 'EGO (niño/a)',
        sex: 'female',
        socialRole: 'youth',
        generation: 'G0',
        x: 265,
        y: 268,
        isEgo: true,
        inLineage: true,
        highlightTone: 'ochre',
        statusTag: 'Infancia prolongada de aprendizaje',
        roleSummary:
          'Menor ya destetado pero aún incapaz de autoabastecerse de tubérculos duros; depende del aprovisionamiento adulto durante años.',
        evolutionaryOrSocialFunction:
          'La provisión garantizada por la abuela financia un cerebro grande en desarrollo y años de aprendizaje social, lingüístico y técnico.',
        flowsProvidedOrReceived:
          'Recibe alimento diario de la abuela y enseñanza social de múltiples generaciones.',
        ethnographicAnchor:
          'A diferencia de las crías de chimpancé (autosuficientes tras el destete), los niños humanos requieren apoyo alimentario hasta la adolescencia.',
      },
      {
        id: 'ab-bebe',
        label: 'Hermano/a menor lactante',
        shortLabel: 'Lactante',
        sex: 'male',
        socialRole: 'youth',
        generation: 'G0',
        x: 395,
        y: 268,
        inLineage: true,
        highlightTone: 'lapis',
        statusTag: 'Nuevo nacimiento posible por aloparentalidad',
        roleSummary:
          'Bebé dependiente de la lactancia materna cuyo nacimiento temprano es viable porque el hermano mayor cuenta con la abuela.',
        evolutionaryOrSocialFunction:
          'Permite «apilar» hijos dependientes de distintas edades simultáneamente, rasgo demográfico distintivo de Homo sapiens.',
        flowsProvidedOrReceived:
          'Recibe lactancia exclusiva de la madre y porteo compartido por tías y hermanos mayores.',
        ethnographicAnchor:
          'Esta estructura demográfica explica el potencial de crecimiento poblacional humano frente a otros hominoideos.',
      },
    ],
    marriages: [
      { fromId: 'ab-abuela-mat', toId: 'ab-abuelo-mat' },
      { fromId: 'ab-madre', toId: 'ab-padre' },
    ],
    descentSegments: [
      { d: 'M 280 66 L 280 112 M 155 112 L 280 112 M 155 112 L 155 142 M 280 112 L 280 142', emphasized: true },
      { d: 'M 350 164 L 350 216 M 265 216 L 395 216 M 265 216 L 265 246 M 395 216 L 395 246', emphasized: true },
    ],
    flowArrows: [
      {
        id: 'flow-abuela-ego',
        d: 'M 206 84 C 168 136, 178 214, 240 258',
        label: 'Tubérculos y cuidado',
        labelX: 112,
        labelY: 224,
        tone: 'ochre',
        requiresGrandmother: true,
      },
      {
        id: 'flow-abuela-madre',
        d: 'M 236 86 C 248 108, 258 124, 268 142',
        label: 'Apoyo energético',
        labelX: 256,
        labelY: 102,
        tone: 'ochre',
        dashed: true,
        requiresGrandmother: true,
      },
      {
        id: 'flow-tia-ego',
        d: 'M 170 184 C 194 218, 218 240, 244 256',
        label: 'Aloparentalidad',
        labelX: 196,
        labelY: 244,
        tone: 'lapis',
        dashed: true,
      },
      {
        id: 'flow-madre-bebe',
        d: 'M 300 180 C 336 206, 362 224, 382 246',
        label: 'Lactancia',
        labelX: 382,
        labelY: 205,
        tone: 'lapis',
      },
    ],
    keyMetrics: [
      {
        label: 'Intervalo entre partos',
        value: '3–4 años',
        note: 'Frente a 5–6 años en chimpancés sin crianza cooperativa.',
      },
      {
        label: 'Vida post-reproductiva',
        value: '+25–35 años',
        note: 'Prolongada longevidad femenina tras la menopausia.',
      },
      {
        label: 'Eje demográfico',
        value: 'Aloparentalidad',
        note: 'Financia cerebros grandes e infancias largas de aprendizaje.',
      },
    ],
    references: 'Hawkes et al. (1998), PNAS; Blurton Jones (2016); Hrdy (2009), Mothers and Others.',
  },
  {
    id: 'matrilineal',
    shortLabel: 'Filiación matrilineal (Akan)',
    title: 'Sistema de filiación matrilineal (uterina) y avunculado',
    subtitle: 'El linaje (abusua), la herencia y la autoridad circulan a través de la línea materna',
    ethnographicFocus: 'Akan / Ashanti (Ghana) · Bemba (Zambia) · Cinturón matrilineal africano',
    accentTone: 'forest',
    overview:
      'En las sociedades matrilineales africanas, la pertenencia al clan y al linaje (abusua entre los Akan), los derechos sobre la tierra y los cargos políticos se transmiten por vía materna. Aunque existe matrimonio y vínculo afectivo con el padre (ntoro), la autoridad jurídica y la herencia sobre EGO corresponden principalmente al tío materno (hermano de la madre).',
    legendLineageLabel: 'Miembro del matrilinaje (mismo abusua)',
    legendExternalLabel: 'Pariente afín o de otro linaje',
    legendFlowLabel: 'Transmisión de herencia, nombre de clan y autoridad avuncular',
    nodes: [
      {
        id: 'mat-abuela',
        label: 'Abuela materna (ancestra fundadora)',
        shortLabel: 'Abuela mat.',
        sex: 'female',
        socialRole: 'elder',
        generation: 'G+2',
        x: 245,
        y: 62,
        inLineage: true,
        highlightTone: 'forest',
        statusTag: 'Núcleo del matrilinaje (abusua)',
        roleSummary:
          'Eje genealógico desde el que se traza la pertenencia común al matrilinaje y la legitimidad de cargos como la Reina Madre (Asantehemaa).',
        evolutionaryOrSocialFunction:
          'Asegura la continuidad histórica del grupo corporativo femenino y masculino unido por sangre materna.',
        flowsProvidedOrReceived:
          'Transmite identidad de clan y derechos colectivos a hijos e hijas.',
        ethnographicAnchor:
          'Entre los Akan, la Reina Madre (Ohemaa) propone y fiscaliza al jefe político gracias a su autoridad genealógica matrilineal.',
      },
      {
        id: 'mat-abuelo',
        label: 'Abuelo materno (otro linaje)',
        shortLabel: 'Abuelo mat.',
        sex: 'male',
        socialRole: 'elder',
        generation: 'G+2',
        x: 375,
        y: 62,
        inLineage: false,
        highlightTone: 'neutral',
        statusTag: 'Afín externo al matrilinaje',
        roleSummary:
          'Pertenece al matrilinaje de su propia madre; mantiene alianza conyugal sin transmitir pertenencia de clan a sus hijos.',
        evolutionaryOrSocialFunction:
          'Teje lazos de alianza exogámica entre dos clanes matrilineales diferentes.',
        flowsProvidedOrReceived:
          'Reciprocidad ritual y vínculos espirituales (ntoro), no herencia de linaje.',
        ethnographicAnchor:
          'La distinción akan entre abusua (sangre/linaje materno) y ntoro (espíritu paterno) evita confundir parentesco social con paternidad biológica.',
      },
      {
        id: 'mat-tio',
        label: 'Tío materno (autoridad avuncular)',
        shortLabel: 'Tío materno',
        sex: 'male',
        socialRole: 'caregiver',
        generation: 'G+1',
        x: 165,
        y: 152,
        inLineage: true,
        highlightTone: 'forest',
        statusTag: 'Figura clave del avunculado',
        roleSummary:
          'Hermano de la madre y miembro pleno del mismo matrilinaje que EGO; ejerce tutela jurídica, gestión de tierras y transmisión de cargos.',
        evolutionaryOrSocialFunction:
          'Resuelve el «dilema matrilineal» vinculando la autoridad masculina al linaje de la hermana y sus hijos, no a los propios hijos biológicos del tío.',
        flowsProvidedOrReceived:
          'Transmite herencia, tierras y estatus político a EGO (su sobrino uterino).',
        ethnographicAnchor:
          'En el reino Ashanti, el heredero legítimo de un jefe o patrimonio familiar es tradicionalmente el hijo de su hermana, no su propio hijo.',
      },
      {
        id: 'mat-madre',
        label: 'Madre (eslabón transmisor)',
        shortLabel: 'Madre',
        sex: 'female',
        socialRole: 'caregiver',
        generation: 'G+1',
        x: 310,
        y: 152,
        inLineage: true,
        highlightTone: 'forest',
        statusTag: 'Transmisora del matrilinaje',
        roleSummary:
          'Transmite a todos sus hijos e hijas la pertenencia plena al abusua y los derechos de uso sobre bienes comunales.',
        evolutionaryOrSocialFunction:
          'Garantiza la continuidad demográfica del linaje y fortalece la autonomía residencial y económica de las mujeres.',
        flowsProvidedOrReceived:
          'Transmite linaje a EGO y a la hermana de EGO.',
        ethnographicAnchor:
          'En sociedades matrilineales de África Central (Bemba, Chewa), la residencia inicial suele ser matrilocal junto a la familia de la esposa.',
      },
      {
        id: 'mat-padre',
        label: 'Padre (pertenece a otro linaje)',
        shortLabel: 'Padre',
        sex: 'male',
        socialRole: 'caregiver',
        generation: 'G+1',
        x: 450,
        y: 152,
        inLineage: false,
        highlightTone: 'neutral',
        statusTag: 'Externo al matrilinaje de EGO',
        roleSummary:
          'Mantiene afecto, crianza cotidiana y transmisión moral hacia EGO, pero su patrimonio de linaje irá a los hijos de su propia hermana.',
        evolutionaryOrSocialFunction:
          'Equilibra el vínculo doméstico con la solidaridad externa hacia su propio grupo materno.',
        flowsProvidedOrReceived:
          'Afecto, educación cotidiana y lazos de alianza con el clan paterno.',
        ethnographicAnchor:
          'Demuestra que matrilinealidad no equivale a «matriarcado» ni a ausencia del padre, sino a otra regla jurídica de filiación.',
      },
      {
        id: 'mat-ego',
        label: 'EGO (heredero del tío materno)',
        shortLabel: 'EGO',
        sex: 'male',
        socialRole: 'caregiver',
        generation: 'G0',
        x: 280,
        y: 244,
        isEgo: true,
        inLineage: true,
        highlightTone: 'forest',
        statusTag: 'Miembro del abusua · Heredero',
        roleSummary:
          'Hereda tierras y estatus de su tío materno, pero sus propios hijos pertenecerán al linaje de su esposa, no al suyo.',
        evolutionaryOrSocialFunction:
          'Mantiene la riqueza y el prestigio dentro del clan uterino a lo largo de generaciones.',
        flowsProvidedOrReceived:
          'Recibe herencia del tío materno; a su vez legará sus derechos al hijo de su hermana.',
        ethnographicAnchor:
          'La relación tío materno–sobrino es el eje jurídico característico del cinturón matrilineal africano.',
      },
      {
        id: 'mat-hermana',
        label: 'Hermana de EGO',
        shortLabel: 'Hermana',
        sex: 'female',
        socialRole: 'caregiver',
        generation: 'G0',
        x: 430,
        y: 244,
        inLineage: true,
        highlightTone: 'forest',
        statusTag: 'Continuadora del linaje en G-1',
        roleSummary:
          'Sus hijos e hijas prolongan el matrilinaje en la siguiente generación y son los herederos directos de EGO.',
        evolutionaryOrSocialFunction:
          'Asegura la reproducción social del clan y otorga peso político a las madres dentro de la familia extensa.',
        flowsProvidedOrReceived:
          'Transmite la pertenencia al linaje a la generación G-1.',
        ethnographicAnchor:
          'Entre los Bemba y Chewa, el vínculo entre hermanos de distinto sexo articula la cooperación entre generaciones.',
      },
      {
        id: 'mat-hijo-ego',
        label: 'Hijo/a de EGO (linaje de la madre)',
        shortLabel: 'Hijo/a de EGO',
        sex: 'female',
        socialRole: 'youth',
        generation: 'G-1',
        x: 280,
        y: 334,
        inLineage: false,
        highlightTone: 'neutral',
        statusTag: 'Pertenece al clan de la esposa de EGO',
        roleSummary:
          'Hijo biológico de EGO, pero jurídicamente integrado en el matrilinaje de su madre.',
        evolutionaryOrSocialFunction:
          'Ilustra con claridad cómo la filiación unilineal separa descendencia social y filiación biológica.',
        flowsProvidedOrReceived:
          'Hereda del hermano de su madre, no del linaje de EGO.',
        ethnographicAnchor:
          'Rasgo central para comprender el contraste estructural frente a las sociedades patrilineales.',
      },
      {
        id: 'mat-sobrino',
        label: 'Sobrino/a uterino/a (heredero de EGO)',
        shortLabel: 'Sobrino uterino',
        sex: 'male',
        socialRole: 'youth',
        generation: 'G-1',
        x: 430,
        y: 334,
        inLineage: true,
        highlightTone: 'forest',
        statusTag: 'Heredero legítimo del matrilinaje',
        roleSummary:
          'Hijo de la hermana de EGO; pertenece al mismo matrilinaje y recibe la sucesión patrimonial y política de EGO.',
        evolutionaryOrSocialFunction:
          'Cierra el ciclo intergeneracional de transmisión avuncular sin fragmentar el clan materno.',
        flowsProvidedOrReceived:
          'Recibe herencia, tierras y tutela jurídica de EGO.',
        ethnographicAnchor:
          'Regla clásica documentada por Meyer Fortes en el estudio de los Ashanti de Ghana.',
      },
    ],
    marriages: [
      { fromId: 'mat-abuela', toId: 'mat-abuelo' },
      { fromId: 'mat-madre', toId: 'mat-padre' },
    ],
    descentSegments: [
      { d: 'M 310 62 L 310 106 M 165 106 L 310 106 M 165 106 L 165 130 M 310 106 L 310 130', emphasized: true },
      { d: 'M 380 152 L 380 198 M 280 198 L 430 198 M 280 198 L 280 222 M 430 198 L 430 222', emphasized: true },
      { d: 'M 280 266 L 280 312', emphasized: false },
      { d: 'M 430 266 L 430 312', emphasized: true },
    ],
    flowArrows: [
      {
        id: 'flow-tio-ego',
        d: 'M 172 174 C 188 214, 218 232, 254 240',
        label: 'Herencia avuncular',
        labelX: 146,
        labelY: 220,
        tone: 'forest',
      },
      {
        id: 'flow-ego-sobrino',
        d: 'M 304 260 C 350 286, 376 306, 408 326',
        label: 'Sucesión al sobrino',
        labelX: 356,
        labelY: 312,
        tone: 'forest',
        dashed: true,
      },
    ],
    keyMetrics: [
      {
        label: 'Regla de filiación',
        value: 'Uterina (madre)',
        note: 'Pertenencia al clan abusua exclusivamente por vía femenina.',
      },
      {
        label: 'Eje de autoridad',
        value: 'Avunculado',
        note: 'Tío materno → sobrino uterino en herencia y cargos.',
      },
      {
        label: 'Área africana',
        value: 'Ghana · Zambia · Malaui',
        note: 'Akan/Ashanti, Bemba, Chewa, Yao y grupos tuareg.',
      },
    ],
    references: 'Fortes (1950), Kinship and Marriage among the Ashanti; Richards (1950); Amadiume (1987).',
  },
  {
    id: 'patrilineal',
    shortLabel: 'Filiación patrilineal (Nuer / Zulú)',
    title: 'Filiación patrilineal (agnaticia) y linajes segmentarios',
    subtitle: 'Descendencia por línea paterna, exogamia de clan y alianzas matrimoniales (lobola)',
    ethnographicFocus: 'Nuer (Sudán del Sur) · Zulú (Sudáfrica) · Kikuyu (Kenia)',
    accentTone: 'lapis',
    overview:
      'En los sistemas patrilineales africanos, el linaje, los derechos sobre pastos o tierras y la identidad de clan pasan del padre a sus hijos e hijas, pero solo los varones transmiten esa pertenencia a la siguiente generación. Las hermanas casan exogámicamente con otros linajes, sellando alianzas recíprocas mediante prestaciones matrimoniales como la lobola.',
    legendLineageLabel: 'Miembro del patrilinaje (agnados)',
    legendExternalLabel: 'Afines / linajes aliados por exogamia',
    legendFlowLabel: 'Transmisión agnaticia y alianza interlinaje (lobola)',
    nodes: [
      {
        id: 'pat-abuelo',
        label: 'Abuelo paterno (ancestro apical)',
        shortLabel: 'Abuelo pat.',
        sex: 'male',
        socialRole: 'elder',
        generation: 'G+2',
        x: 270,
        y: 62,
        inLineage: true,
        highlightTone: 'lapis',
        statusTag: 'Eje del patrilinaje segmentario',
        roleSummary:
          'Referente genealógico que agrupa a hermanos y primos paternos en un segmento solidario de linaje.',
        evolutionaryOrSocialFunction:
          'En sociedades acéfalas como los Nuer (Evans-Pritchard), los segmentos se fusionan o fisionan según el nivel del ancestro común para gestionar disputas y recursos sin Estado central.',
        flowsProvidedOrReceived:
          'Transmite nombre de linaje, acceso comunal al territorio y rebaños.',
        ethnographicAnchor:
          'Modelo clásico de «oposición complementaria» en linajes segmentarios estudiado en Sudán del Sur.',
      },
      {
        id: 'pat-abuela',
        label: 'Abuela paterna (linaje aliado)',
        shortLabel: 'Abuela pat.',
        sex: 'female',
        socialRole: 'elder',
        generation: 'G+2',
        x: 390,
        y: 62,
        inLineage: false,
        highlightTone: 'neutral',
        statusTag: 'Vínculo de alianza entre clanes',
        roleSummary:
          'Procedente de otro clan exogámico; su matrimonio fundó una red duradera de reciprocidad entre dos grupos de parentesco.',
        evolutionaryOrSocialFunction:
          'Conecta linajes vecinos en redes amplias de apoyo económico y pacificación.',
        flowsProvidedOrReceived:
          'Cuidado intergeneracional y mediación entre su linaje natal y el del esposo.',
        ethnographicAnchor:
          'Las mujeres casadas mantienen lazos activos con sus hermanos, actuando como puentes diplomáticos entre clanes.',
      },
      {
        id: 'pat-tio',
        label: 'Tío paterno (hermano del padre)',
        shortLabel: 'Tío paterno',
        sex: 'male',
        socialRole: 'caregiver',
        generation: 'G+1',
        x: 180,
        y: 152,
        inLineage: true,
        highlightTone: 'lapis',
        statusTag: 'Corresponsable del patrilinaje',
        roleSummary:
          'En muchos sistemas clasificatorios africanos recibe un término equivalente al de «padre» y comparte responsabilidad sobre sus sobrinos.',
        evolutionaryOrSocialFunction:
          'Asegura respaldo jurídico, crianza y defensa colectiva ante cualquier pérdida del progenitor.',
        flowsProvidedOrReceived:
          'Participa en decisiones de tierras, ganado y negociaciones matrimoniales.',
        ethnographicAnchor:
          'El parentesco clasificatorio africano amplía las figuras de cuidado y autoridad más allá de la familia nuclear occidental.',
      },
      {
        id: 'pat-padre',
        label: 'Padre (eslabón agnaticio)',
        shortLabel: 'Padre',
        sex: 'male',
        socialRole: 'caregiver',
        generation: 'G+1',
        x: 330,
        y: 152,
        inLineage: true,
        highlightTone: 'lapis',
        statusTag: 'Transmisor del patrilinaje',
        roleSummary:
          'Transmite a EGO y a sus hermanos la pertenencia al clan paterno, derechos de uso de la tierra y patrimonio ganadero.',
        evolutionaryOrSocialFunction:
          'Estructura la continuidad económica y ritual con los ancestros paternos.',
        flowsProvidedOrReceived:
          'Transmite estatus de linaje y recursos hacia G0.',
        ethnographicAnchor:
          'Entre los Zulú y Nuer, el ganado vincula a vivos, ancestros y familias aliadas.',
      },
      {
        id: 'pat-madre',
        label: 'Madre (clan aliado exogámico)',
        shortLabel: 'Madre',
        sex: 'female',
        socialRole: 'caregiver',
        generation: 'G+1',
        x: 465,
        y: 152,
        inLineage: false,
        highlightTone: 'neutral',
        statusTag: 'Afín clave del hogar',
        roleSummary:
          'Aunque conserva su pertenencia a su clan paterno natal, es el eje doméstico y alimentario de la casa de sus hijos.',
        evolutionaryOrSocialFunction:
          'Consolida la alianza intergrupal sellada mediante riqueza de la novia (lobola).',
        flowsProvidedOrReceived:
          'Vínculo afectivo, socialización temprana y conexión con el linaje materno.',
        ethnographicAnchor:
          'La lobola o riqueza de la novia legitima los derechos de la descendencia y une a dos familias extensas; nunca fue una «compra».',
      },
      {
        id: 'pat-primo',
        label: 'Primo paralelo paterno',
        shortLabel: 'Primo pat.',
        sex: 'male',
        socialRole: 'caregiver',
        generation: 'G0',
        x: 180,
        y: 244,
        inLineage: true,
        highlightTone: 'lapis',
        statusTag: '«Hermano» clasificatorio de linaje',
        roleSummary:
          'Hijo del tío paterno; pertenece al mismo patrilinaje que EGO y actúa como hermano solidario en derechos y exogamia.',
        evolutionaryOrSocialFunction:
          'Refuerza la cohesión de la cohorte joven dentro del segmento de linaje.',
        flowsProvidedOrReceived:
          'Cooperación laboral, defensa mutua y apoyo ceremonial.',
        ethnographicAnchor:
          'La exogamia prohíbe el matrimonio con primos paralelos del mismo clan, obligando a tejer alianzas externas.',
      },
      {
        id: 'pat-ego',
        label: 'EGO (continuador agnaticio)',
        shortLabel: 'EGO',
        sex: 'male',
        socialRole: 'caregiver',
        generation: 'G0',
        x: 330,
        y: 244,
        isEgo: true,
        inLineage: true,
        highlightTone: 'lapis',
        statusTag: 'Miembro y transmisor en G0',
        roleSummary:
          'Recibe la pertenencia al linaje de su padre y la transmitirá a sus propios hijos e hijas en la generación G-1.',
        evolutionaryOrSocialFunction:
          'Sostiene la continuidad del segmento patrilineal y el culto a los antepasados paternos.',
        flowsProvidedOrReceived:
          'Recibe derechos de G+1 y los transmite a sus descendientes en G-1.',
        ethnographicAnchor:
          'La residencia suele ser patrilocal/virilocal en torno a los campos o corrales paternos.',
      },
      {
        id: 'pat-hermana',
        label: 'Hermana de EGO (alianza exogámica)',
        shortLabel: 'Hermana',
        sex: 'female',
        socialRole: 'caregiver',
        generation: 'G0',
        x: 475,
        y: 244,
        inLineage: true,
        highlightTone: 'ochre',
        statusTag: 'Miembro del linaje · Vector de alianza',
        roleSummary:
          'Pertenece de por vida al patrilinaje de su padre, pero al casarse exogámicamente sus hijos integrarán el linaje de su esposo.',
        evolutionaryOrSocialFunction:
          'Su matrimonio aporta ganado o bienes de alianza (lobola) que a menudo permiten a sus hermanos formalizar a su vez sus propias alianzas.',
        flowsProvidedOrReceived:
          'Conecta dos clanes distintos y genera reciprocidad ceremonial a largo plazo.',
        ethnographicAnchor:
          'El circuito de ganado matrimonial en África Austral y Oriental estabiliza la paz entre linajes vecinos.',
      },
      {
        id: 'pat-hijos',
        label: 'Hijos/as de EGO (patrilinaje)',
        shortLabel: 'Hijos de EGO',
        sex: 'male',
        socialRole: 'youth',
        generation: 'G-1',
        x: 330,
        y: 334,
        inLineage: true,
        highlightTone: 'lapis',
        statusTag: 'Continuidad del patrilinaje en G-1',
        roleSummary:
          'Integran de pleno derecho el clan paterno de EGO y heredan acceso a tierras y red de parentesco agnaticio.',
        evolutionaryOrSocialFunction:
          'Garantizan la persistencia generacional del linaje y el cuidado de los mayores.',
        flowsProvidedOrReceived:
          'Reciben protección, herencia y pertenencia comunitaria.',
        ethnographicAnchor:
          'La familia extensa africana funciona como sistema de seguridad social intergeneracional.',
      },
      {
        id: 'pat-sobrino-ext',
        label: 'Hijo/a de la hermana (linaje aliado)',
        shortLabel: 'Sobrino aliado',
        sex: 'female',
        socialRole: 'youth',
        generation: 'G-1',
        x: 475,
        y: 334,
        inLineage: false,
        highlightTone: 'neutral',
        statusTag: 'Pertenece al patrilinaje del cuñado',
        roleSummary:
          'Aunque pertenece a otro patrilinaje, suele mantener una relación afectiva privilegiada y distendida con su tío materno (EGO).',
        evolutionaryOrSocialFunction:
          'Aporta un refugio social fuera de la disciplina estricta del propio patrilinaje.',
        flowsProvidedOrReceived:
          'Hospitalidad y afecto especial entre linajes aliados.',
        ethnographicAnchor:
          'Incluso en sociedades patrilineales, el vínculo con el tío materno cumple funciones vitales de apoyo afectivo y mediación.',
      },
    ],
    marriages: [
      { fromId: 'pat-abuelo', toId: 'pat-abuela' },
      { fromId: 'pat-padre', toId: 'pat-madre', label: 'lobola' },
    ],
    descentSegments: [
      { d: 'M 330 62 L 330 106 M 180 106 L 330 106 M 180 106 L 180 130 M 330 106 L 330 130', emphasized: true },
      { d: 'M 180 174 L 180 222', emphasized: true },
      { d: 'M 398 152 L 398 198 M 330 198 L 475 198 M 330 198 L 330 222 M 475 198 L 475 222', emphasized: true },
      { d: 'M 330 266 L 330 312', emphasized: true },
      { d: 'M 475 266 L 475 312', emphasized: false },
    ],
    flowArrows: [
      {
        id: 'flow-pat-herencia',
        d: 'M 314 174 C 304 196, 304 206, 314 224',
        label: 'Filiación agnaticia',
        labelX: 256,
        labelY: 196,
        tone: 'lapis',
      },
      {
        id: 'flow-pat-alianza',
        d: 'M 498 244 C 554 244, 566 286, 514 328',
        label: 'Alianza exogámica',
        labelX: 562,
        labelY: 288,
        tone: 'ochre',
        dashed: true,
      },
    ],
    keyMetrics: [
      {
        label: 'Regla de filiación',
        value: 'Agnaticia (padre)',
        note: 'Descendencia, clan y tierras transmitidos por línea paterna.',
      },
      {
        label: 'Alianza matrimonial',
        value: 'Lobola / exogamia',
        note: 'Prestaciones recíprocas que sellan pactos entre clanes.',
      },
      {
        label: 'Organización política',
        value: 'Linaje segmentario',
        note: 'Fusión y fisión cooperativa (p. ej. Nuer en Sudán del Sur).',
      },
    ],
    references: 'Evans-Pritchard (1940), The Nuer; Radcliffe-Brown y Forde (1950); Kuper (1982).',
  },
  {
    id: 'primates',
    shortLabel: 'Filopatria primate (Pan)',
    title: 'Filopatria masculina, dispersión femenina y transmisión cultural',
    subtitle: 'Cómo la estructura social de chimpancés y bonobos moldea el aprendizaje y las coaliciones',
    ethnographicFocus: 'Pan troglodytes (Taï / Gombe) y Pan paniscus (Wamba · R. D. del Congo)',
    accentTone: 'plum',
    overview:
      'En chimpancés y bonobos africanos, los machos permanecen toda su vida en su comunidad natal (filopatria masculina), mientras que las hembras emigran a grupos vecinos al alcanzar la madurez. Este patrón explica fenómenos clave del módulo de Etología: la conformidad cultural de las hembras inmigrantes en Taï (Luncz y Boesch) y las coaliciones femeninas no emparentadas que sostienen la alta tolerancia social de los bonobos.',
    legendLineageLabel: 'Machos filopátricos (residentes natales)',
    legendExternalLabel: 'Hembras inmigrantes de comunidades vecinas',
    legendFlowLabel: 'Migración femenina, coaliciones y transmisión cultural',
    nodes: [
      {
        id: 'pr-madre-res',
        label: 'Hembra residente mayor (grupo receptor)',
        shortLabel: 'Hembra residente',
        sex: 'female',
        socialRole: 'elder',
        generation: 'G+2',
        x: 205,
        y: 66,
        inLineage: false,
        highlightTone: 'plum',
        statusTag: 'Modelo cultural residente',
        roleSummary:
          'Hembra adulta asentada en el grupo que domina las técnicas locales de forrajeo (cascanueces con piedra o madera) y lidera coaliciones en bonobos.',
        evolutionaryOrSocialFunction:
          'Establece la norma técnica del grupo y, en Pan paniscus, acoge e integra mediante coaliciones a las jóvenes recién llegadas.',
        flowsProvidedOrReceived:
          'Transmite tradición local a sus crías y sirve de referencia conductual a las inmigrantes.',
        ethnographicAnchor:
          'En los bonobos de Wamba, las alianzas entre hembras no emparentadas superan en cohesión a las jerarquías masculinas.',
      },
      {
        id: 'pr-macho-alfa',
        label: 'Macho filopátrico mayor',
        shortLabel: 'Macho natal A',
        sex: 'male',
        socialRole: 'caregiver',
        generation: 'G+1',
        x: 365,
        y: 158,
        inLineage: true,
        highlightTone: 'ochre',
        statusTag: 'Filopatria masculina',
        roleSummary:
          'Permanece en la comunidad donde nació junto a hermanos y medios hermanos, formando patrullas territoriales en chimpancés.',
        evolutionaryOrSocialFunction:
          'En Pan troglodytes la filopatria favorece la cooperación masculina en defensa territorial y caza de colobos.',
        flowsProvidedOrReceived:
          'Alianzas coalicionales masculinas dentro del territorio natal.',
        ethnographicAnchor:
          'Contrasta con el patrón humano de residencia bilateral/flexible que permite a las mujeres permanecer cerca de sus madres (base de la teoría de la abuela).',
      },
      {
        id: 'pr-macho-hno',
        label: 'Hermano / aliado filopátrico',
        shortLabel: 'Macho natal B',
        sex: 'male',
        socialRole: 'caregiver',
        generation: 'G+1',
        x: 495,
        y: 158,
        inLineage: true,
        highlightTone: 'ochre',
        statusTag: 'Coalición de machos emparentados',
        roleSummary:
          'Macho residente que comparte vínculos de crianza y parentesco materno o paterno dentro de la misma comunidad.',
        evolutionaryOrSocialFunction:
          'Sostiene la estabilidad espacial del territorio del grupo donde se acumulan los talleres de percusión lítica.',
        flowsProvidedOrReceived:
          'Acicalamiento recíproco y patrulla cooperativa en fronteras grupales.',
        ethnographicAnchor:
          'La permanencia en un mismo bosque favorece la reutilización de sitios de cascanueces durante décadas en Taï.',
      },
      {
        id: 'pr-inmigrante',
        label: 'EGO · Hembra inmigrante (dispersión)',
        shortLabel: 'Hembra inmigrante',
        sex: 'female',
        socialRole: 'caregiver',
        generation: 'G+1',
        x: 195,
        y: 158,
        isEgo: true,
        inLineage: false,
        highlightTone: 'plum',
        statusTag: 'Vector de conformidad cultural',
        roleSummary:
          'Abandona su grupo natal al madurar evitando la endogamia y se integra en una nueva comunidad con tradiciones técnicas propias.',
        evolutionaryOrSocialFunction:
          'En el bosque de Taï, las hembras inmigrantes abandonan su técnica previa de cascanueces y adoptan la preferencia lítica o leñosa del grupo receptor (conformidad cultural).',
        flowsProvidedOrReceived:
          'Recibe normas del grupo receptor y las transmite después a sus crías.',
        ethnographicAnchor:
          'Estudio de Luncz y Boesch (2014) en Costa de Marfil: prueba directa de conformidad social por encima de la eficiencia individual.',
      },
      {
        id: 'pr-cria',
        label: 'Cría en aprendizaje prolongado (0–6 años)',
        shortLabel: 'Cría aprendiz',
        sex: 'female',
        socialRole: 'youth',
        generation: 'G0',
        x: 280,
        y: 264,
        inLineage: true,
        highlightTone: 'forest',
        statusTag: 'Transmisión vertical y facilitación local',
        roleSummary:
          'Permanece en estrecho contacto con su madre durante 5–6 años observando el uso de herramientas y practicando con piedras abandonadas.',
        evolutionaryOrSocialFunction:
          'Adquiere el repertorio técnico del grupo mediante observación cercana y pistas sociales indirectas en los yunques («cuarta dimensión»).',
        flowsProvidedOrReceived:
          'Recibe leche materna y andamiaje social; sin aporte calórico de abuelas tras el destete.',
        ethnographicAnchor:
          'A diferencia de los humanos, la ausencia de aloparentalidad intensa mantiene largos intervalos entre nacimientos (~5–6 años).',
      },
    ],
    marriages: [],
    descentSegments: [
      { d: 'M 365 132 L 495 132 M 365 132 L 365 136 M 495 132 L 495 136', emphasized: true },
      { d: 'M 280 198 L 280 242 M 195 180 L 195 198 L 365 198 L 365 180', emphasized: false },
    ],
    flowArrows: [
      {
        id: 'flow-migracion',
        d: 'M 62 158 C 102 158, 128 158, 166 158',
        label: 'Dispersión femenina',
        labelX: 102,
        labelY: 140,
        tone: 'plum',
      },
      {
        id: 'flow-conformidad',
        d: 'M 202 88 C 198 108, 198 118, 196 134',
        label: 'Conformidad cultural',
        labelX: 256,
        labelY: 112,
        tone: 'plum',
        dashed: true,
      },
      {
        id: 'flow-aprendizaje-cria',
        d: 'M 210 178 C 228 214, 244 234, 260 250',
        label: 'Aprendizaje + pistas',
        labelX: 196,
        labelY: 234,
        tone: 'forest',
      },
      {
        id: 'flow-coalicion-machos',
        d: 'M 388 158 C 418 144, 442 144, 472 158',
        label: 'Coalición filopátrica',
        labelX: 430,
        labelY: 118,
        tone: 'ochre',
        dashed: true,
      },
    ],
    keyMetrics: [
      {
        label: 'Patrón residencial',
        value: 'Filopatria masculina',
        note: 'Machos permanecen; hembras emigran entre comunidades.',
      },
      {
        label: 'Diferencia con humanos',
        value: 'Sin abuelas alopadres',
        note: 'Las madres crían casi en solitario (intervalo ~5–6 años).',
      },
      {
        label: 'Efecto cultural (Taï)',
        value: 'Conformidad',
        note: 'Hembras inmigrantes adoptan el útil lítico del grupo local.',
      },
    ],
    references: 'Luncz y Boesch (2014); Kano (1992); Surbeck et al. (2025), Communications Biology; Hawkes et al. (1998), PNAS.',
  },
];
