import type { MolecularDiscipline } from './paleomolecularData';

export type Molecular3DModelId =
  | 'adn-taforalt'
  | 'amelogenina-swartkrans'
  | 'enamelina-enam137'
  | 'colageno-zooms';

export type CameraPresetId = 'frontal' | 'axial' | 'detalle' | 'reset';

export interface Molecular3DHotspot {
  id: string;
  label: string;
  shortTag: string;
  position: [number, number, number];
  cameraOffset: [number, number, number];
  accent: string;
  biologicalFunction: string;
  summary: string;
  biochemicalDetail: string;
}

export interface Molecular3DSubstructureInfo {
  id: string;
  title: string;
  category: string;
  accent: string;
  biologicalFunction: string;
  paleoSignificance: string;
  /** Optional alternate copy when the 3D model is in its secondary variant state */
  alternateTitle?: string;
  alternateBiologicalFunction?: string;
  alternatePaleoSignificance?: string;
  relatedHotspotId?: string;
}

export interface Molecular3DVariantConfig {
  defaultLabel: string;
  alternateLabel: string;
  defaultDescription: string;
  alternateDescription: string;
}

export type DnaBase = 'A' | 'T' | 'G' | 'C';

export interface Molecular3DReplicationSpec {
  geneLabel: string;
  sourceRelation: 'direct-dna' | 'coding-locus';
  defaultSequence5to3: string; // 16 nt 5'->3'
  alternateSequence5to3: string; // 16 nt 5'->3'
  /** 0-based indices on default sequence where post-mortem 5' C->U deamination occurs */
  deaminatedIndicesDefault?: number[];
  /** 0-based indices of diagnostic codons / polymorphisms highlighted in the 2D diagram */
  highlightIndicesDefault?: number[];
  highlightIndicesAlternate?: number[];
  highlightLabelDefault: string;
  highlightLabelAlternate: string;
  contextNote: string;
  polymeraseNoteDefault: string;
  polymeraseNoteAlternate: string;
}

export interface Molecular3DModelSpec {
  id: Molecular3DModelId;
  shortLabel: string;
  title: string;
  subtitle: string;
  discipline: MolecularDiscipline;
  siteContext: string;
  ageLabel: string;
  placeholderNote: string;
  sequenceLabel: string;
  sequenceReadout: string;
  evolutionaryRelevance: string;
  methodLimit: string;
  citation: string;
  doi: string;
  glossaryTermId: string;
  explodeLabel: string;
  variant: Molecular3DVariantConfig;
  defaultCamera: {
    position: [number, number, number];
    target: [number, number, number];
  };
  cameraPresets: Record<
    CameraPresetId,
    {
      label: string;
      position: [number, number, number];
      target: [number, number, number];
    }
  >;
  hotspots: Molecular3DHotspot[];
  substructures: Record<string, Molecular3DSubstructureInfo>;
  replicationLocus: Molecular3DReplicationSpec;
}

export const PALEOMOLECULAR_3D_MODELS: Molecular3DModelSpec[] = [
  {
    id: 'adn-taforalt',
    shortLabel: 'ADN antiguo (Taforalt)',
    title: 'Doble hélice de ADN antiguo (aDNA) con daño terminal 5\' C→T',
    subtitle: 'Fragmento ultracorto (<70 pb) · Taforalt (~15 ka) y Takarkori (~7 ka)',
    discipline: 'paleogenomica',
    siteContext: 'Grotte des Pigeons (Marruecos) y Takarkori (Libia)',
    ageLabel: '~15 – 7 ka',
    placeholderNote:
      'Modelo 3D esquemático procedimental (placeholder estructural B-DNA) calibrado para visualizar fragmentación y desaminación post mortem.',
    sequenceLabel: 'Motivo 5\'→3\' (extremo desaminado)',
    sequenceReadout: "5'-[C→T]-[C→T]-G-A-T-C-G-A-A-T-C-G-T-A-C-G-3'",
    evolutionaryRelevance:
      'Los fragmentos cortos recuperados de hueso petroso en Taforalt (~15 ka) y de momias naturales en Takarkori (~7 ka) revelaron un linaje norteafricano ancestral profundo divergido hace ~50 ka.',
    methodLimit:
      'En climas cálidos africanos la hidrólisis espontánea destruye las hebras en decenas de miles de años; el daño C→T en extremos 5\' es indispensable para descartar contaminación moderna.',
    citation: 'van de Loosdrecht et al. (2018), Science, 360(6388), 548–552; Salem et al. (2025), Nature, 641(8061), 144–150.',
    doi: '10.1038/s41586-025-08793-7',
    glossaryTermId: 'desaminacion-adn',
    explodeLabel: 'Separación de hebras y bases',
    variant: {
      defaultLabel: 'ADN antiguo (daño 5\' C→T)',
      alternateLabel: 'ADN moderno (sin daño)',
      defaultDescription:
        'Resalta las citosinas desaminadas a uracilo/timina (naranja ocre) concentradas en los extremos 5\' monocatenarios del fragmento fósil.',
      alternateDescription:
        'Muestra una doble hélice íntegra sin sobrecarga de sustituciones terminales C→T, perfil característico de contaminación moderna.',
    },
    defaultCamera: {
      position: [0.6, 0.9, 9.6],
      target: [0, 0, 0],
    },
    cameraPresets: {
      frontal: { label: 'Frontal', position: [0.4, 0.5, 9.6], target: [0, 0, 0] },
      axial: { label: 'Eje helicoidal', position: [0.1, 8.8, 2.4], target: [0, 0, 0] },
      detalle: { label: 'Extremo 5\' C→T', position: [3.6, 3.1, 4.4], target: [0, 2.4, 0] },
      reset: { label: 'Restablecer', position: [0.6, 0.9, 9.6], target: [0, 0, 0] },
    },
    hotspots: [
      {
        id: 'deamination-5prime',
        label: 'Extremo 5\' con desaminación C→T',
        shortTag: 'Daño 5\' C→T',
        position: [1.15, 2.75, 0.45],
        cameraOffset: [3.2, 0.6, 4.0],
        accent: '#d95216',
        biologicalFunction:
          'En células vivas, la enzima uracilo-ADN glicosilasa (UDG) repara continuamente la desaminación de citosina para preservar la fidelidad transcripcional y replicativa.',
        summary:
          'Pérdida espontánea del grupo amino de la citosina en extremos monocatenarios expuestos (15–40 % en la primera base).',
        biochemicalDetail:
          'Autentica la secuencia endógena frente a ADN moderno de laboratorio o excavación.',
      },
      {
        id: 'sugar-phosphate',
        label: 'Esqueleto azúcar-fosfato',
        shortTag: 'Hidrólisis',
        position: [-1.42, 0.55, 0.85],
        cameraOffset: [-3.5, 0.6, 4.2],
        accent: '#2f6db5',
        biologicalFunction:
          'Forma el armazón covalente antiparalelo 5\'→3\' mediante enlaces fosfodiéster que protegen químicamente las bases nitrogenadas hidrofóbicas en el interior helicoidal.',
        summary:
          'Los enlaces fosfodiéster sufren rotura hidrolítica acelerada según la edad térmica del yacimiento africano.',
        biochemicalDetail:
          'Reduce la longitud modal de los fragmentos a ~35–65 pares de bases.',
      },
      {
        id: 'core-basepair',
        label: 'Núcleo bicatenario protegido (G≡C / A=T)',
        shortTag: 'Puentes H',
        position: [0.05, -0.35, 0.15],
        cameraOffset: [2.8, 0.2, 4.6],
        accent: '#1c8b6a',
        biologicalFunction:
          'Almacena la información genética hereditaria mediante emparejamiento complementario (A=T con 2 puentes H; G≡C con 3 puentes H), base de la replicación semiconservativa.',
        summary:
          'El interior bicatenario conserva el apareamiento complementario que permite alinear SNP informativos (captura 1240k).',
        biochemicalDetail:
          'Permite inferir divergencia (~50 ka) y proporción de mezcla neandertal en Takarkori.',
      },
      {
        id: 'terminal-break',
        label: 'Corte diagenético 3\' (<70 pb)',
        shortTag: 'Corte 3\'',
        position: [-0.95, -2.55, -0.45],
        cameraOffset: [-2.9, -0.4, 4.4],
        accent: '#d98c16',
        biologicalFunction:
          'En el núcleo celular, el ADN cromosómico alcanza millones de pares de bases compactados en nucleosomas; tras la muerte, nucleasas endógenas e hidrólisis lo fragmentan.',
        summary:
          'La fragmentación extrema obliga a emplear bibliotecas monocatenarias (ssDNA) en sala blanca de presión positiva.',
        biochemicalDetail:
          'Hueso petroso del oído interno multiplica el porcentaje de ADN endógeno recuperable.',
      },
    ],
    substructures: {
      'dna-backbone': {
        id: 'dna-backbone',
        title: 'Esqueleto azúcar-fosfato (desoxirribosa + PO₄⁻)',
        category: 'Armazón covalente B-DNA',
        accent: '#2f6db5',
        biologicalFunction:
          'Sostiene la doble hélice antiparalela (5\'→3\' / 3\'→5\') mediante enlaces fosfodiéster y expone grupos fosfato polares al medio acuoso nuclear.',
        paleoSignificance:
          'La depurinación y la hidrólisis térmica rompen este esqueleto en fragmentos ultracortos (<70 pb) en contextos cálidos africanos.',
        relatedHotspotId: 'sugar-phosphate',
      },
      'dna-basepair': {
        id: 'dna-basepair',
        title: 'Pares de bases nitrogenadas (A=T / G≡C)',
        category: 'Núcleo codificante',
        accent: '#1c8b6a',
        biologicalFunction:
          'Codifican la secuencia genómica y estabilizan la doble hélice mediante puentes de hidrógeno específicos y fuerzas de apilamiento entre anillos aromáticos.',
        paleoSignificance:
          'Su conservación en el interior bicatenario permite capturar miles de SNP diagnósticos (panel 1240k) en hueso petroso.',
        relatedHotspotId: 'core-basepair',
      },
      'dna-terminal': {
        id: 'dna-terminal',
        title: 'Extremo 5\' con desaminación post mortem (C→T)',
        category: 'Firma de autenticación aDNA',
        accent: '#d95216',
        biologicalFunction:
          'Las citosinas emparejan con guanina y en organismos vivos son vigiladas por reparación por escisión de bases (UDG); tras la muerte se desaminan espontáneamente a uracilo.',
        paleoSignificance:
          'La tasa elevada de sustituciones C→T en los extremos 5\' demuestra la autenticidad del ADN antiguo de Taforalt y Takarkori.',
        alternateTitle: 'Extremo 5\' íntegro (citosina sin daño)',
        alternateBiologicalFunction:
          'En ADN celular moderno o recién extraído, la reparación enzimática mantiene las citosinas terminales intactas sin acumulación de uracilo.',
        alternatePaleoSignificance:
          'La ausencia de patrón terminal C→T alerta de posible contaminación moderna durante la excavación o en laboratorio.',
        relatedHotspotId: 'deamination-5prime',
      },
    },
    replicationLocus: {
      geneLabel: 'Fragmento endógeno aDNA · Taforalt / Takarkori (5\'→3\')',
      sourceRelation: 'direct-dna',
      defaultSequence5to3: 'CCGATCGAATCGTACG',
      alternateSequence5to3: 'CCGATCGAATCGTACG',
      deaminatedIndicesDefault: [0, 1],
      highlightIndicesDefault: [0, 1],
      highlightIndicesAlternate: [0, 1],
      highlightLabelDefault: 'Posiciones 1–2: citosina desaminada (C→U) en extremo 5\'',
      highlightLabelAlternate: 'Posiciones 1–2: citosina íntegra (ADN moderno)',
      contextNote:
        'Representación directa de la secuencia B-DNA cargada en el visor 3D. Al replicar o amplificar el fragmento antiguo en biblioteca, las citosinas desaminadas a uracilo (U) en el extremo 5\' se leen como timina.',
      polymeraseNoteDefault:
        'Durante la síntesis de la hebra complementaria, la ADN polimerasa lee cada uracilo terminal (U) como timina e incorpora adenina (A) en lugar de guanina (G), fijando la transición diagnóstica C→T.',
      polymeraseNoteAlternate:
        'En ausencia de daño post mortem, la ADN polimerasa replica ambas hebras con fidelidad completa (C≡G y A=T) sin introducir sustituciones terminales C→T.',
    },
  },
  {
    id: 'amelogenina-swartkrans',
    shortLabel: 'Amelogenina AMELX/Y',
    title: 'Péptidos de amelogenina (AMELX / AMELY) en matriz de esmalte',
    subtitle: 'Swartkrans (SK 830, SK 835, SK 850, SK 14132) y Sterkfontein (Sts 63)',
    discipline: 'paleoproteomica',
    siteContext: 'Cuna de la Humanidad · Sudáfrica (~2,0 – 3,5 Ma)',
    ageLabel: '~2,0 – 3,5 Ma',
    placeholderNote:
      'Modelo 3D esquemático procedimental (placeholder estructural peptídico) con cadenas AMELX/AMELY encapsuladas junto a prismas de hidroxiapatita.',
    sequenceLabel: 'Péptidos diagnósticos LC-MS/MS',
    sequenceReadout: 'AMELX: SIRPPYPSY   ·   AMELY (crom. Y): SMIRPPY',
    evolutionaryRelevance:
      'Permitió determinar el sexo cromosómico directo de cuatro individuos de Paranthropus robustus en Swartkrans y del ejemplar Sts 63 de Australopithecus africanus en Sterkfontein, corrigiendo asignaciones basadas solo en tamaño dental.',
    methodLimit:
      'En especímenes XX (sin señal AMELY), la inferencia exige comprobar cobertura suficiente de AMELX para descartar falsos negativos por degradación.',
    citation: 'Madupe et al. (2025), Science, 388(6750), 969–973; Madupe et al. (2025), South African Journal of Science, 121(1/2), Art. #18571.',
    doi: '10.1126/science.adt9539',
    glossaryTermId: 'amelogenina',
    explodeLabel: 'Desacoplar matriz mineral y cadenas',
    variant: {
      defaultLabel: 'Perfil XY (SK 835 / Sts 63)',
      alternateLabel: 'Perfil XX (SK 830 / SK 14132)',
      defaultDescription:
        'Presenta simultáneamente la cadena AMELX (azul lapislázuli) y el péptido exclusivo del cromosoma Y AMELY con metionina (ocre), confirmando sexo masculino.',
      alternateDescription:
        'Retira la cadena AMELY (ausente en individuos XX) manteniendo una señal robusta de AMELX en la matriz cristalina de hidroxiapatita.',
    },
    defaultCamera: {
      position: [1.1, 1.3, 9.2],
      target: [0, 0, 0],
    },
    cameraPresets: {
      frontal: { label: 'Frontal', position: [1.1, 1.3, 9.2], target: [0, 0, 0] },
      axial: { label: 'Sección prismática', position: [0.2, 8.2, 3.0], target: [0, 0, 0] },
      detalle: { label: 'Péptido SMIRPPY', position: [3.6, 1.6, 4.2], target: [1.1, 0.5, 0.3] },
      reset: { label: 'Restablecer', position: [1.1, 1.3, 9.2], target: [0, 0, 0] },
    },
    hotspots: [
      {
        id: 'amely-motif',
        label: 'Péptido diagnóstico AMELY (SMIRPPY)',
        shortTag: 'AMELY (XY)',
        position: [1.45, 0.85, 0.55],
        cameraOffset: [3.0, 0.8, 3.8],
        accent: '#d95216',
        biologicalFunction:
          'Isoforma de amelogenina secretada por los ameloblastos desde el gen AMELY del cromosoma Y; colabora en el ensamblaje de nanoesferas que organizan el espesor del esmalte.',
        summary:
          'Secuencia exclusiva codificada en el cromosoma Y que incluye metionina diagnóstica (SMIRPPY / SM(ox)IRPPY).',
        biochemicalDetail:
          'Confirmó como machos XY a SK 835, SK 850 (Swartkrans) y Sts 63 (Sterkfontein).',
      },
      {
        id: 'amelx-motif',
        label: 'Péptido AMELX (SIRPPYPSY)',
        shortTag: 'AMELX (X)',
        position: [-1.45, 0.65, 0.45],
        cameraOffset: [-3.2, 0.8, 4.0],
        accent: '#2f6db5',
        biologicalFunction:
          'Constituye >90 % de la matriz proteica inicial del esmalte dental; forma nanoesferas hidrofóbicas que espacian y guían el crecimiento alargado de los cristales minerales.',
        summary:
          'Isoforma del cromosoma X presente tanto en hembras XX como en machos XY; sirve de control interno de preservación.',
        biochemicalDetail:
          'Su intensidad relativa evita atribuir erróneamente como XX un diente pobremente conservado.',
      },
      {
        id: 'hydroxyapatite-shield',
        label: 'Prismas de hidroxiapatita (>95 %)',
        shortTag: 'Escudo mineral',
        position: [0.0, -1.75, -0.45],
        cameraOffset: [2.6, -0.4, 4.8],
        accent: '#d6d2c4',
        biologicalFunction:
          'Cristales hexagonales densamente empaquetados de fosfato cálcico que confieren al esmalte dental la máxima dureza biomecánica y resistencia frente a la abrasión masticatoria.',
        summary:
          'Cristales hexagonales de fosfato cálcico que sellan herméticamente los péptidos frente a microorganismos y agua.',
        biochemicalDetail:
          'Explica la supervivencia proteica >2–3,5 Ma en el karst cálido de África Austral.',
      },
      {
        id: 'nq-deamidation',
        label: 'Desamidación post mortem (Asn / Gln)',
        shortTag: 'Autenticación N/Q',
        position: [-0.45, 1.85, -0.25],
        cameraOffset: [-2.4, 1.2, 4.2],
        accent: '#1c8b6a',
        biologicalFunction:
          'Los residuos polares de asparagina (Asn) y glutamina (Gln) estabilizan interacciones proteína-proteína y la interfase electrostática con los cristales durante la amelogénesis.',
        summary:
          'Conversión progresiva de asparagina y glutamina en ácido aspártico y glutámico a lo largo de millones de años.',
        biochemicalDetail:
          'Cumple el mismo papel autenticador que la desaminación C→T en paleogenómica.',
      },
    ],
    substructures: {
      'amel-prism': {
        id: 'amel-prism',
        title: 'Prismas de hidroxiapatita · Ca₁₀(PO₄)₆(OH)₂',
        category: 'Matriz biomineral del esmalte',
        accent: '#d6d2c4',
        biologicalFunction:
          'Forman >95 % del peso del esmalte maduro, protegiendo la corona dental frente a cargas masticatorias intensas y desgaste abrasivo.',
        paleoSignificance:
          'Su porosidad casi nula encapsula herméticamente los péptidos dentales durante >2–3,5 Ma en África Austral.',
        relatedHotspotId: 'hydroxyapatite-shield',
      },
      'amel-x': {
        id: 'amel-x',
        title: 'Isoforma AMELX (cromosoma X · SIRPPYPSY)',
        category: 'Proteína reguladora de amelogénesis',
        accent: '#2f6db5',
        biologicalFunction:
          'Dirige el ensamblaje en nanoesferas que regulan la elongación ordenada de los prismas de esmalte antes de su degradación proteolítica parcial.',
        paleoSignificance:
          'Presente en todos los individuos (XX y XY), valida que la muestra conserva proteoma suficiente para determinar el sexo cromosómico.',
        relatedHotspotId: 'amelx-motif',
      },
      'amel-y': {
        id: 'amel-y',
        title: 'Isoforma AMELY (cromosoma Y · SMIRPPY)',
        category: 'Marcador sexual cromosómico',
        accent: '#d95216',
        biologicalFunction:
          'Versión codificada en el cromosoma Y (~10 % de la amelogenina masculina) que coopera con AMELX en la estructuración de la matriz del esmalte.',
        paleoSignificance:
          'Su metionina específica en SMIRPPY permite asignar sexo masculino directo en fósiles de Swartkrans (SK 835, SK 850) y Sterkfontein (Sts 63).',
        relatedHotspotId: 'amely-motif',
      },
      'amel-nq': {
        id: 'amel-nq',
        title: 'Sitio de desamidación Asn / Gln',
        category: 'Control bioquímico post mortem',
        accent: '#1c8b6a',
        biologicalFunction:
          'Residuos polares que median enlaces de hidrógeno y afinidad iónica durante el plegamiento temporal de la matriz del esmalte.',
        paleoSignificance:
          'Su conversión diagenética a Asp/Glu autentica que los péptidos proceden del fósil pleistoceno y no de contaminación actual.',
        relatedHotspotId: 'nq-deamidation',
      },
    },
    replicationLocus: {
      geneLabel: 'Locus génico codificante AMELY (crom. Y) / AMELX (crom. X)',
      sourceRelation: 'coding-locus',
      defaultSequence5to3: 'AGCATGATTCGTCCTC',
      alternateSequence5to3: 'AGCATTCGTCCTTATC',
      highlightIndicesDefault: [3, 4, 5],
      highlightIndicesAlternate: [3, 4, 5],
      highlightLabelDefault: 'Codón ATG (pos. 4–6): codifica la metionina diagnóstica de AMELY (SMIRPPY)',
      highlightLabelAlternate: 'Ausencia de ATG en AMELX (pos. 4–6 · ATT → Ile en SIRPPYPSY)',
      contextNote:
        'En los fósiles de Swartkrans y Sterkfontein (~2,0–3,5 Ma) el ADN ya no sobrevive, pero la secuencia de aminoácidos AMELX/AMELY refleja la replicación y transcripción in vivo de estos loci sexuales.',
      polymeraseNoteDefault:
        'La replicación semiconservativa del exón AMELY conserva el triplete 5\'-ATG-3\' (Met) exclusivo del cromosoma Y, origen del péptido SMIRPPY detectado por LC-MS/MS.',
      polymeraseNoteAlternate:
        'En individuos XX solo se replica el gen AMELX en ambos cromosomas X, careciendo del codón de metionina exclusivo de AMELY.',
    },
  },
  {
    id: 'enamelina-enam137',
    shortLabel: 'Enamelina (ENAM-137)',
    title: 'Dominio de enamelina (ENAM) y polimorfismo pos. 137 en SK 835',
    subtitle: 'Variabilidad genética intraespecífica en Paranthropus robustus (~2,0 Ma)',
    discipline: 'paleoproteomica',
    siteContext: 'Cueva de Swartkrans · Miembro 1 (Sudáfrica)',
    ageLabel: '~2,0 Ma',
    placeholderNote:
      'Modelo 3D esquemático procedimental (placeholder de dominio proteico) ilustrativo de sustitución de aminoácido único (SAP) en posición ENAM-137.',
    sequenceLabel: 'Variante peptídica filogenética',
    sequenceReadout: 'ENAM pos. 137: polimorfismo de aminoácido (SK 835 vs. SK 830/850/14132)',
    evolutionaryRelevance:
      'La variación en ENAM pos. 137 detectada en SK 835 junto a otras posiciones variables sugiere diversidad genética inesperada o subestructura poblacional dentro del clado Paranthropus en África Austral.',
    methodLimit:
      'Al cubrir solo una decena de proteínas del esmalte (~1.000 aminoácidos informativos), la resolución filogenética fina entre especies hermanas requiere ampliar el muestreo.',
    citation: 'Madupe, P. P., Koenig, C., Patramanis, I., et al. (2025), Science, 388(6750), 969–973.',
    doi: '10.1126/science.adt9539',
    glossaryTermId: 'paleoproteomica',
    explodeLabel: 'Expandir bucle y cadenas laterales',
    variant: {
      defaultLabel: 'Polimorfismo SK 835 (ENAM-137)',
      alternateLabel: 'Secuencia base Swartkrans',
      defaultDescription:
        'Resalta la sustitución no sinónima en la posición 137 de ENAM detectada en el macho SK 835, revelando variabilidad intraespecífica o subestructura en P. robustus.',
      alternateDescription:
        'Muestra la conformación de referencia compartida por los otros especímenes de Swartkrans para comparar el cambio de cadena lateral.',
    },
    defaultCamera: {
      position: [0.8, 1.0, 8.8],
      target: [0, 0, 0],
    },
    cameraPresets: {
      frontal: { label: 'Frontal', position: [0.8, 1.0, 8.8], target: [0, 0, 0] },
      axial: { label: 'Vista superior', position: [0, 8.2, 2.2], target: [0, 0, 0] },
      detalle: { label: 'Locus ENAM-137', position: [3.2, 1.7, 3.8], target: [0.75, 0.9, 0.65] },
      reset: { label: 'Restablecer', position: [0.8, 1.0, 8.8], target: [0, 0, 0] },
    },
    hotspots: [
      {
        id: 'enam-137-sap',
        label: 'Polimorfismo diagnóstico ENAM pos. 137',
        shortTag: 'ENAM-137 (SK 835)',
        position: [0.85, 0.95, 0.85],
        cameraOffset: [2.8, 0.9, 3.4],
        accent: '#d95216',
        biologicalFunction:
          'Residuo expuesto en la superficie del dominio de enamelina secretada, modulando la arquitectura local durante el crecimiento del esmalte dental.',
        summary:
          'Sustitución de un solo aminoácido (SAP) exclusiva de SK 835 dentro de la serie analizada de Swartkrans.',
        biochemicalDetail:
          'Indica variabilidad genética o diferenciación cronológica/taxonómica en Paranthropus.',
      },
      {
        id: 'enam-phylogeny',
        label: 'Posiciones filogenéticas diagnósticas',
        shortTag: 'Señal clado',
        position: [-1.55, 0.2, 0.35],
        cameraOffset: [-3.2, 0.5, 4.0],
        accent: '#2f6db5',
        biologicalFunction:
          'Glicoproteína no amelogenínica esencial para iniciar la mineralización en el frente secretor del ameloblasto; su déficit bloquea la formación normal del esmalte.',
        summary:
          'Sitios conservados en ENAM y AMBN que separan a P. robustus del clado formado por Homo sapiens, neandertales y denisovanos.',
        biochemicalDetail:
          'Aporta anclaje molecular directo donde la morfología masticatoria converge.',
      },
      {
        id: 'calcium-interface',
        label: 'Interfaz de unión a calcio/fosfato',
        shortTag: 'Biomineralización',
        position: [0.15, -1.45, -0.35],
        cameraOffset: [2.2, -0.6, 4.5],
        accent: '#1c8b6a',
        biologicalFunction:
          'Regiones ácidas y fosforiladas con alta afinidad por iones Ca²⁺ y PO₄³⁻ que nuclean y orientan el crecimiento en longitud de las cintas minerales del esmalte.',
        summary:
          'La enamelina guía el crecimiento alargado de los cristales de hidroxiapatita durante la amelogénesis dental.',
        biochemicalDetail:
          'Su fuerte afinidad mineral favorece que fragmentos peptídicos queden atrapados en el fósil.',
      },
    ],
    substructures: {
      'enam-core': {
        id: 'enam-core',
        title: 'Dominio estructural de enamelina (ENAM)',
        category: 'Glicoproteína de biomineralización',
        accent: '#2f6db5',
        biologicalFunction:
          'Actúa en el frente de mineralización controlando la nucleación y elongación cristalina del esmalte; es la proteína no amelogenínica de mayor tamaño del diente.',
        paleoSignificance:
          'Reúne posiciones evolutivamente informativas que sitúan a Paranthropus robustus fuera del clado Homo.',
        relatedHotspotId: 'enam-phylogeny',
      },
      'enam-sap': {
        id: 'enam-sap',
        title: 'Variante polimórfica ENAM pos. 137 (SK 835)',
        category: 'Sustitución de aminoácido único (SAP)',
        accent: '#d95216',
        biologicalFunction:
          'Cadena lateral superficial que refleja variación codificante tolerada en la región secretada de la enamelina sin comprometer la integridad del esmalte.',
        paleoSignificance:
          'Exclusiva del macho SK 835 frente a los demás dientes de Swartkrans, evidenciando diversidad intraespecífica o subestructura en Paranthropus.',
        alternateTitle: 'Residuo de referencia ENAM pos. 137 (Swartkrans)',
        alternateBiologicalFunction:
          'Conformación ancestral compartida por la mayoría de los individuos de Swartkrans dentro del dominio proteico de enamelina.',
        alternatePaleoSignificance:
          'Sirve como secuencia base para contrastar el polimorfismo detectado en el individuo SK 835.',
        relatedHotspotId: 'enam-137-sap',
      },
      'enam-calcium': {
        id: 'enam-calcium',
        title: 'Anillo de coordinación de Ca²⁺ y fosfato',
        category: 'Interfaz proteína-mineral',
        accent: '#1c8b6a',
        biologicalFunction:
          'Coordina electrostáticamente iones calcio y fosfato para alinear los cristales de hidroxiapatita a lo largo de su eje de crecimiento.',
        paleoSignificance:
          'Esta unión íntima al cristal mineral explica por qué fragmentos de ENAM sobreviven ~2 Ma en sedimentos kársticos cálidos.',
        relatedHotspotId: 'calcium-interface',
      },
    },
    replicationLocus: {
      geneLabel: 'Exón del gen ENAM (entorno del codón polimórfico 137)',
      sourceRelation: 'coding-locus',
      defaultSequence5to3: 'GGAACCGTGGATCCAG',
      alternateSequence5to3: 'GGAACCGCGGATCCAG',
      highlightIndicesDefault: [6, 7, 8],
      highlightIndicesAlternate: [6, 7, 8],
      highlightLabelDefault: 'Codón 137 variante en SK 835 (pos. 7–9 · transición C→T en base 8)',
      highlightLabelAlternate: 'Codón 137 de referencia en Swartkrans (pos. 7–9 · base C en pos. 8)',
      contextNote:
        'Aunque el análisis de Swartkrans (~2,0 Ma) procede de paleoproteómica de esmalte, cada sustitución de aminoácido único (SAP) en ENAM pos. 137 deriva de un polimorfismo puntual fijado durante la replicación del ADN.',
      polymeraseNoteDefault:
        'La replicación fiel de la mutación puntual en el codón 137 (pos. 8) transmite la variante no sinónima observada en el ejemplar SK 835 de Paranthropus robustus.',
      polymeraseNoteAlternate:
        'La hebra parental de referencia mantiene la citosina original en la posición 8, replicada como par G≡C estable en los demás individuos de Swartkrans.',
    },
  },
  {
    id: 'colageno-zooms',
    shortLabel: 'Colágeno I (ZooMS)',
    title: 'Triple hélice de Colágeno tipo I (COL1A1 / COL1A2)',
    subtitle: 'Cribado masivo ZooMS (MALDI-TOF) y marca filogenética COL1A2',
    discipline: 'paleoproteomica',
    siteContext: 'Puente África–Eurasia · Astillas óseas y dentina (~160 – 45 ka)',
    ageLabel: '<120 ka África · ~1 Ma frío',
    placeholderNote:
      'Modelo 3D esquemático procedimental (placeholder de triple hélice superenrollada) con dos cadenas α1 (COL1A1) y una cadena α2 (COL1A2).',
    sequenceLabel: 'Repetición estructural Gly-X-Y',
    sequenceReadout: '2× COL1A1 (α1) + 1× COL1A2 (α2) · Digestión tríptica MALDI-TOF',
    evolutionaryRelevance:
      'Permite cribar miles de astillas óseas indetectables en segundos (Denisova 11, Ranis, Bacho Kiro) y, mediante sustituciones en COL1A2, identificó fósiles como la mandíbula denisovana de Xiahe.',
    methodLimit:
      'A diferencia del esmalte dental, el colágeno óseo sufre hidrólisis térmica más rápida en África tropical (<50–120 ka), acotando su ventana al Pleistoceno Superior y Holoceno.',
    citation: 'Chen et al. (2019), Nature, 569, 409–412; Mylopotamitaki et al. (2024), Nature, 626(7998), 341–346.',
    doi: '10.1038/s41586-019-1139-x',
    glossaryTermId: 'zooms',
    explodeLabel: 'Desenrollar las tres cadenas α',
    variant: {
      defaultLabel: 'Resaltar cadena COL1A2 (α2)',
      alternateLabel: 'Triple hélice unificada',
      defaultDescription:
        'Destaca en verde bosque la cadena α2 (COL1A2), más variable evolutivamente y portadora de los péptidos marcadores clave en ZooMS y filogenia.',
      alternateDescription:
        'Presenta la arquitectura compacta del tropocolágeno estabilizado por puentes de hidrógeno intercatenarios.',
    },
    defaultCamera: {
      position: [0.9, 0.8, 9.4],
      target: [0, 0, 0],
    },
    cameraPresets: {
      frontal: { label: 'Frontal', position: [0.9, 0.8, 9.4], target: [0, 0, 0] },
      axial: { label: 'Eje superhélice', position: [0.2, 9.0, 2.0], target: [0, 0, 0] },
      detalle: { label: 'Marcador COL1A2', position: [3.2, 1.4, 3.8], target: [0.6, 0.7, 0.4] },
      reset: { label: 'Restablecer', position: [0.9, 0.8, 9.4], target: [0, 0, 0] },
    },
    hotspots: [
      {
        id: 'col1a2-marker',
        label: 'Péptido marcador en cadena COL1A2 (α2)',
        shortTag: 'Marcador COL1A2',
        position: [0.85, 0.9, 0.6],
        cameraOffset: [3.0, 0.7, 3.6],
        accent: '#1c8b6a',
        biologicalFunction:
          'Subunidad heterotrimérica única del tropocolágeno tipo I que regula el diámetro de las fibrillas de colágeno y su mineralización en el tejido óseo.',
        summary:
          'Región variable digerida con tripsina que genera picos m/z diagnósticos en espectrometría MALDI-TOF (ZooMS).',
        biochemicalDetail:
          'Distingue homininos de bóvidos, cérvidos o carnívoros en fragmentos óseos <2 cm.',
      },
      {
        id: 'col1a1-chains',
        label: 'Doble cadena estructural COL1A1 (α1)',
        shortTag: 'Cadenas α1',
        position: [-0.95, -0.65, 0.65],
        cameraOffset: [-3.1, -0.3, 4.1],
        accent: '#d95216',
        biologicalFunction:
          'Dos cadenas polipeptídicas ricas en glicina, prolina e hidroxiprolina que aportan resistencia a la tracción y elasticidad al hueso cortical y la dentina.',
        summary:
          'Dos cadenas ricas en glicina, prolina e hidroxiprolina que aportan resistencia mecánica al hueso cortical y la dentina.',
        biochemicalDetail:
          'Constituye cerca del 90 % de la matriz proteica orgánica del hueso.',
      },
      {
        id: 'gly-x-y-crosslink',
        label: 'Puentes de hidrógeno Gly-X-Y',
        shortTag: 'Estabilidad térmica',
        position: [0.0, 2.25, 0.0],
        cameraOffset: [2.4, 1.1, 4.4],
        accent: '#d6a442',
        biologicalFunction:
          'La glicina cada tres posiciones (el aminoácido más pequeño) permite que las tres hélices se empaqueten estrechamente mediante puentes de hidrógeno intercatenarios.',
        summary:
          'La compactación de glicina cada tres residuos mantiene unida la triple hélice hasta que el calor tropical hidroliza la cadena.',
        biochemicalDetail:
          'Por encima de ~100 ka en África tropical el esmalte (LC-MS/MS) supera ampliamente al colágeno.',
      },
    ],
    substructures: {
      'col-a1': {
        id: 'col-a1',
        title: 'Cadenas estructurales α1 (COL1A1)',
        category: 'Andamiaje fibrilar óseo',
        accent: '#c96228',
        biologicalFunction:
          'Forman dos tercios de la triple hélice de tropocolágeno tipo I (~90 % de la matriz orgánica del hueso), confiriendo tenacidad y soporte para los cristales de apatita.',
        paleoSignificance:
          'Su abundancia hace posible extraer huellas peptídicas a partir de astillas óseas sin morfología diagnóstica.',
        relatedHotspotId: 'col1a1-chains',
      },
      'col-a2': {
        id: 'col-a2',
        title: 'Cadena α2 (COL1A2 · marcador ZooMS)',
        category: 'Subunidad filogenética variable',
        accent: '#1c9b76',
        biologicalFunction:
          'Completa el heterotrímero α1(I)₂α2(I), modulando la estabilidad térmica y el ensamblaje ordenado de fibrillas en hueso, tendón y dentina.',
        paleoSignificance:
          'Al acumular más sustituciones evolutivas que α1, concentra los péptidos m/z que distinguen taxones en cribado masivo ZooMS.',
        relatedHotspotId: 'col1a2-marker',
      },
      'col-crosslink': {
        id: 'col-crosslink',
        title: 'Puentes de hidrógeno intercatenarios (Gly-X-Y)',
        category: 'Estabilización de superhélice',
        accent: '#d6a442',
        biologicalFunction:
          'Enlazan el eje interno de glicinas e hidroxiprolinas entre las tres cadenas α, evitando el desenrollamiento térmico de la fibra de colágeno.',
        paleoSignificance:
          'Su ruptura hidrolítica acelerada por el calor acota el colágeno óseo a <50–120 ka en África tropical.',
        relatedHotspotId: 'gly-x-y-crosslink',
      },
    },
    replicationLocus: {
      geneLabel: 'Motivo repetitivo Gly-X-Y del gen COL1A2 / COL1A1',
      sourceRelation: 'coding-locus',
      defaultSequence5to3: 'GGCCCAGGTGGTCCTG',
      alternateSequence5to3: 'GGTCCTGGTCCAGGTG',
      highlightIndicesDefault: [0, 1, 2, 6, 7, 8],
      highlightIndicesAlternate: [0, 1, 2, 6, 7, 8],
      highlightLabelDefault: 'Tripletes GGC / GGT (Gly cada 3 residuos) y codón variable en COL1A2',
      highlightLabelAlternate: 'Repetición conservada GGT (Gly) en las cadenas estructurales COL1A1',
      contextNote:
        'La arquitectura de la triple hélice del colágeno tipo I exige replicar con alta fidelidad tripletes GGN (glicina) cada 9 nucleótidos; las sustituciones en posiciones X/Y de COL1A2 generan los marcadores m/z de ZooMS.',
      polymeraseNoteDefault:
        'La ADN polimerasa replica el alto contenido G≡C de los tripletes de glicina y prolina en COL1A2, cuya variación interespecífica sustenta la identificación taxonómica MALDI-TOF.',
      polymeraseNoteAlternate:
        'La secuencia conservada de COL1A1 mantiene la alternancia periódica de codones ricos en guanina y citosina que estabilizan el tropocolágeno óseo.',
    },
  },
];

export function getMolecular3DModel(id: Molecular3DModelId): Molecular3DModelSpec {
  return PALEOMOLECULAR_3D_MODELS.find((m) => m.id === id) ?? PALEOMOLECULAR_3D_MODELS[0];
}
