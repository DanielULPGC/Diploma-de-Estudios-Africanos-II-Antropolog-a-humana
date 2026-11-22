// Metadatos oficiales de PaleoLab 3D (Smithsonian 3D Digitization) y Archivo Nutcracker Man
// Integrado desde el repositorio institucional ULPGC (CC BY-NC 4.0)

export interface PaleoLabModel {
  id: string;
  dataTaxonId?: string;
  taxonName: string;
  specimen: string;
  label: string;
  url: string;
  note: string;
  verifiedAt: string;
}

export interface PaleoLabDataset {
  updatedAt: string;
  institution: string;
  rightsNote: string;
  models: PaleoLabModel[];
}

export interface NutcrackerResource {
  type: string;
  date: string;
  title: string;
  note: string;
  url: string;
  primary?: string;
}

export interface NutcrackerCorpus {
  reviewedAt: string;
  observedPosts: number;
  observedRange: string;
  postsWithExternalReferences: number;
  externalReferenceLinks: number;
  years: Array<[number, number]>;
  categories: Array<[string, number]>;
  topTags: Array<[string, number]>;
  resources: NutcrackerResource[];
}

export const PALEOLAB_3D_DATA: PaleoLabDataset = {
  "updatedAt": "2026-07-14",
  "institution": "Smithsonian 3D Digitization",
  "rightsNote": "Los metadatos se identifican como CC0 en las fichas institucionales. Los medios 3D conservan las condiciones de uso indicadas por Smithsonian y se abren en su fuente original.",
  "models": [
    {
      "id": "boisei",
      "taxonName": "Paranthropus boisei",
      "specimen": "OH 5, Olduvai",
      "label": "Paranthropus boisei: cráneo",
      "url": "https://3d.si.edu/object/3d/paranthropus-boisei-cranium%3Af71256ba-fb5d-4a26-b44d-3d4cc2a8b533",
      "note": "Escaneo de una réplica del cráneo OH 5. Metadatos CC0; el medio está sujeto a las condiciones de uso del Smithsonian.",
      "verifiedAt": "2026-07-14"
    },
    {
      "id": "afarensis",
      "taxonName": "Australopithecus afarensis",
      "specimen": "A.L. 444-2, Hadar",
      "label": "Australopithecus afarensis: cráneo",
      "url": "https://3d.si.edu/object/3d/australopithecus-afarensis-cranium%3A6faf8121-250c-47cb-a5cc-139d7b16c570",
      "note": "Escaneo de una réplica de A.L. 444-2. Metadatos CC0; el medio está sujeto a las condiciones de uso del Smithsonian.",
      "verifiedAt": "2026-07-14"
    },
    {
      "id": "habilis",
      "taxonName": "Homo habilis",
      "specimen": "KNM-ER 1813, Koobi Fora",
      "label": "Homo habilis: cráneo",
      "url": "https://3d.si.edu/object/3d/homo-habilis-cranium%3Ade47a0c6-20c6-4d70-bcc8-4992d5f4ff66",
      "note": "Escaneo de una réplica de KNM-ER 1813. Metadatos CC0; el medio está sujeto a las condiciones de uso del Smithsonian.",
      "verifiedAt": "2026-07-14"
    },
    {
      "id": "erectus",
      "taxonName": "Homo erectus",
      "specimen": "Sangiran 17, Java",
      "label": "Homo erectus: cráneo",
      "url": "https://3d.si.edu/object/3d/homo-erectus-cranium%3Ab2c8c6ff-069d-42da-98ae-9bf12fce60f2",
      "note": "Escaneo de una réplica de Sangiran 17. Metadatos CC0; el medio está sujeto a las condiciones de uso del Smithsonian.",
      "verifiedAt": "2026-07-14"
    },
    {
      "id": "neander",
      "dataTaxonId": "neanderthalensis",
      "taxonName": "Homo neanderthalensis",
      "specimen": "La Ferrassie 1, Francia",
      "label": "Homo neanderthalensis: cráneo",
      "url": "https://3d.si.edu/object/3d/homo-neanderthalensis-cranium%3A62c5a1ab-24bc-467d-8566-5e67be2fc41d",
      "note": "Escaneo de una réplica de La Ferrassie 1. Metadatos CC0; el medio está sujeto a las condiciones de uso del Smithsonian.",
      "verifiedAt": "2026-07-14"
    }
  ]
};

export const NUTCRACKER_CORPUS: NutcrackerCorpus = {
  "reviewedAt": "2026-07-14",
  "observedPosts": 481,
  "observedRange": "mayo de 2014 – julio de 2026",
  "postsWithExternalReferences": 196,
  "externalReferenceLinks": 479,
  "years": [
    [
      2014,
      34
    ],
    [
      2015,
      59
    ],
    [
      2016,
      49
    ],
    [
      2017,
      43
    ],
    [
      2018,
      36
    ],
    [
      2019,
      36
    ],
    [
      2020,
      45
    ],
    [
      2021,
      38
    ],
    [
      2022,
      25
    ],
    [
      2023,
      30
    ],
    [
      2024,
      30
    ],
    [
      2025,
      39
    ],
    [
      2026,
      17
    ]
  ],
  "categories": [
    [
      "Actualidad",
      106
    ],
    [
      "Reflexiones",
      98
    ],
    [
      "Fósiles",
      91
    ],
    [
      "Resumen trimestral",
      48
    ],
    [
      "Yacimientos",
      48
    ],
    [
      "Arte y cuevas",
      36
    ],
    [
      "Recursos",
      27
    ],
    [
      "Entrevistas",
      19
    ],
    [
      "Exposiciones y museos",
      17
    ],
    [
      "Bioarqueología del cuidado",
      13
    ],
    [
      "Humor evolution",
      7
    ]
  ],
  "topTags": [
    [
      "neandertal",
      53
    ],
    [
      "Homo erectus",
      35
    ],
    [
      "denisovanos",
      31
    ],
    [
      "Australopithecus",
      21
    ],
    [
      "Pleistoceno medio",
      20
    ],
    [
      "Achelense",
      20
    ],
    [
      "Atapuerca",
      20
    ],
    [
      "Homo naledi",
      19
    ],
    [
      "Paranthropus",
      19
    ],
    [
      "hibridación",
      18
    ],
    [
      "Sima de los Huesos",
      17
    ],
    [
      "Olduvai",
      16
    ]
  ],
  "resources": [
    {
      "type": "Portal",
      "date": "Archivo",
      "title": "Nutcracker Man",
      "note": "Punto de entrada al proyecto de divulgación de Roberto Sáez.",
      "url": "https://nutcrackerman.com/"
    },
    {
      "type": "Fósiles",
      "date": "Archivo",
      "title": "Archivo de fósiles",
      "note": "Índice temático de especímenes, anatomía, taxonomía y técnicas de estudio.",
      "url": "https://nutcrackerman.com/category/fosiles/"
    },
    {
      "type": "Yacimientos",
      "date": "Archivo",
      "title": "Archivo de yacimientos",
      "note": "Contexto arqueológico, estratigrafía, patrimonio y formación del registro.",
      "url": "https://nutcrackerman.com/category/yacimientos/"
    },
    {
      "type": "Arte",
      "date": "Archivo",
      "title": "Arte y cuevas",
      "note": "Índice temático para discutir simbolismo, grafismo y contexto rupestre.",
      "url": "https://nutcrackerman.com/category/arte-y-cuevas/"
    },
    {
      "type": "Recursos",
      "date": "Archivo",
      "title": "Archivo de recursos",
      "note": "Conferencias, materiales y propuestas de ampliación.",
      "url": "https://nutcrackerman.com/category/recursos/"
    },
    {
      "type": "Reflexión",
      "date": "Archivo",
      "title": "Archivo de reflexiones",
      "note": "Ensayos sobre interpretación, historia disciplinar y percepción social.",
      "url": "https://nutcrackerman.com/category/reflexiones/"
    },
    {
      "type": "Cuidado",
      "date": "2022-10-30",
      "title": "Bioarqueología del cuidado e Index of Care",
      "note": "Caso para analizar cómo se argumenta la asistencia a partir de supervivencia, patología y contexto.",
      "url": "https://nutcrackerman.com/2022/10/30/la-bioarqueologia-del-cuidado-index-of-care/"
    },
    {
      "type": "Cuidado",
      "date": "2025-04-14",
      "title": "Índice del Cuidado para la enseñanza",
      "note": "Puente entre razonamiento bioarqueológico y actividades universitarias guiadas.",
      "url": "https://nutcrackerman.com/2025/04/14/version-breve-indice-del-cuidado-en-el-pasado/"
    },
    {
      "type": "Taxonomía",
      "date": "2017-12-12",
      "title": "Little Foot: especie y preguntas abiertas",
      "note": "Caso para discutir datación, anatomía en mosaico y clasificación taxonómica.",
      "url": "https://nutcrackerman.com/2017/12/12/what-species-is-little-foot-and-other-open-questions/"
    },
    {
      "type": "Taxonomía",
      "date": "2025-12-03",
      "title": "Australopithecus deyiremeda y coexistencia",
      "note": "Nuevos restos apoyan diferencias locomotoras y dietarias respecto a A. afarensis.",
      "url": "https://nutcrackerman.com/2025/12/03/sacamos-del-cajon-australopithecus-deyiremeda-dos-australopitecos-mismo-paisaje/",
      "primary": "https://www.nature.com/articles/s41586-025-09714-4"
    },
    {
      "type": "Locomoción",
      "date": "2026-05",
      "title": "Paranthropus y Australopithecus: repertorios distintos",
      "note": "La estructura articular sugiere más arborealidad en P. robustus que en el Australopithecus de Sterkfontein comparado.",
      "url": "https://nutcrackerman.com/2026/06/30/paleoantropologia-novedades-2o-trimestre-2026/",
      "primary": "https://www.pnas.org/doi/10.1073/pnas.2532193123"
    },
    {
      "type": "Locomoción",
      "date": "2025-08-28",
      "title": "Bipedalismo hominino en dos pasos",
      "note": "Modelo comparativo para revisar qué rasgos preceden a la locomoción bípeda plenamente humana.",
      "url": "https://nutcrackerman.com/2025/08/28/la-evolucion-del-bipedalismo-hominino-en-dos-pasos-fundamentales/",
      "primary": "https://doi.org/10.1038/s41586-025-09399-9"
    },
    {
      "type": "Anatomía",
      "date": "2025-05-21",
      "title": "Adaptaciones de las manos en Australopithecus y Homo",
      "note": "Conecta morfología funcional, señales de carga y límites de la atribución tecnológica.",
      "url": "https://nutcrackerman.com/2025/05/21/adaptaciones-de-las-manos-en-australopithecus-y-homo/",
      "primary": "https://doi.org/10.1126/sciadv.adt1201"
    },
    {
      "type": "Primer Homo",
      "date": "2026-01-13",
      "title": "Nuevo esqueleto parcial de Homo habilis",
      "note": "KNM-ER 64061 amplía el postcráneo conocido y cuestiona una transición lineal habilis–erectus.",
      "url": "https://nutcrackerman.com/2026/01/13/el-esqueleto-mas-completo-de-homo-habilis-y-el-cuestionado-vinculo-habilis-erectus/",
      "primary": "https://doi.org/10.1002/ar.70100"
    },
    {
      "type": "Dispersión",
      "date": "2025-03-12",
      "title": "Posible Homo erectus en Eurasia occidental",
      "note": "Caso de identificación taxonómica con material fragmentario y cronología de 1,1–1,4 Ma.",
      "url": "https://nutcrackerman.com/2025/03/12/un-posible-homo-erectus-en-el-oeste-euroasiatico-hace-11-14-millones-de-anos/",
      "primary": "https://doi.org/10.1038/s41586-025-08681-0"
    },
    {
      "type": "Fósiles",
      "date": "2025-07-16",
      "title": "Kocabaş en el registro hominino",
      "note": "Fósil relevante para estudiar dispersiones, comparación morfológica y vacíos del registro.",
      "url": "https://nutcrackerman.com/2025/07/16/craneo-kocabas-registro-fosil-hominino/"
    },
    {
      "type": "Tecnología",
      "date": "2026-06-03",
      "title": "Wonderwerk y la gestión del fuego",
      "note": "Evidencia de combustión en depósitos achelenses; uso no equivale automáticamente a producción o control pleno.",
      "url": "https://nutcrackerman.com/2026/06/03/wonderwerk-y-los-origenes-de-la-gestion-del-fuego/",
      "primary": "https://doi.org/10.1371/journal.pone.0347480"
    },
    {
      "type": "Tecnología",
      "date": "2025-12-21",
      "title": "Producción de fuego en Barnham",
      "note": "Caso más tardío para comparar adquisición, mantenimiento y producción deliberada del fuego.",
      "url": "https://nutcrackerman.com/2025/12/21/el-dominio-de-la-produccion-de-fuego-hace-unos-400-000-anos-barnham-reino-unido/"
    },
    {
      "type": "Conducta",
      "date": "2025-05-12",
      "title": "Caza colectiva en Schöningen",
      "note": "Permite separar datación, función de las armas y reconstrucción de cooperación.",
      "url": "https://nutcrackerman.com/2025/05/12/lanzas-neandertales-schoningen/",
      "primary": "https://doi.org/10.1126/sciadv.adv0752"
    },
    {
      "type": "Paleogenómica",
      "date": "2026-06-26",
      "title": "Diversidad genética de neandertales tardíos",
      "note": "La cuenca del Mosa muestra conectividad y no respalda una endogamia reciente uniforme ni un deterioro genético progresivo.",
      "url": "https://nutcrackerman.com/2026/06/26/la-diversidad-genetica-de-los-ultimos-neandertales-y-la-hipotesis-de-la-endogamia/",
      "primary": "https://www.nature.com/articles/s41586-026-10625-1"
    },
    {
      "type": "Cultura",
      "date": "2026-07-07",
      "title": "Continuidad cultural en el Levante",
      "note": "La continuidad técnica a ambos lados de un reemplazo poblacional obliga a comparar transmisión, convergencia y persistencia regional.",
      "url": "https://nutcrackerman.com/2026/07/07/neandertales-y-homo-sapiens-conservaron-las-mismas-tradiciones-culturales-en-el-levante/",
      "primary": "https://www.pnas.org/doi/10.1073/pnas.2609061123"
    },
    {
      "type": "Simbolismo",
      "date": "2025-06-01",
      "title": "Huella dactilar neandertal",
      "note": "Caso para graduar una inferencia simbólica a partir de forma, gesto, contexto y alternativas.",
      "url": "https://nutcrackerman.com/2025/06/01/una-huella-dactilar-neandertal-y-posible-simbolismo/",
      "primary": "https://doi.org/10.1007/s12520-025-02243-1"
    },
    {
      "type": "Paleoproteómica",
      "date": "2026-06-24",
      "title": "Proteínas dentales de Homo naledi",
      "note": "No se detectó marcador masculino en 23 dientes de al menos 20 individuos; el resultado caracteriza la muestra analizada, no todo Rising Star.",
      "url": "https://nutcrackerman.com/2026/06/24/todos-los-20-homo-naledi-analizados-son-hembras/",
      "primary": "https://www.cell.com/cell/fulltext/S0092-8674(26)00644-6"
    },
    {
      "type": "Paleoproteómica",
      "date": "2025-10-06",
      "title": "Prado Vargas y determinación sexual",
      "note": "Alcance y límites de la identificación cromosómica mediante proteínas del esmalte.",
      "url": "https://nutcrackerman.com/2025/10/06/resiliencia-de-los-neandertales-en-prado-vargas-y-el-rebautizo-de-vera-en-realidad-nino/"
    },
    {
      "type": "Denisovanos",
      "date": "2025-06-22",
      "title": "Harbin, denisovanos y nombre de especie",
      "note": "Proteoma y ADN mitocondrial vinculan el cráneo de Harbin con denisovanos; la nomenclatura sigue siendo debatida.",
      "url": "https://nutcrackerman.com/2025/06/22/harbin-denisovanos-y-el-nombre-de-su-especie/",
      "primary": "https://doi.org/10.1016/j.cell.2025.05.040"
    },
    {
      "type": "Hibridación",
      "date": "2025-07-23",
      "title": "Skhul 1 y posibles rasgos en mosaico",
      "note": "Ejercicio sobre cómo distinguir mosaico morfológico, variación y evidencia de hibridación.",
      "url": "https://nutcrackerman.com/2025/07/23/skhul-1-un-craneo-infantil-con-indicios-de-hibridacion/",
      "primary": "https://doi.org/10.1016/j.anthro.2025.103385"
    },
    {
      "type": "Actualidad",
      "date": "2026-06-30",
      "title": "Novedades del segundo trimestre de 2026",
      "note": "Panorama reciente para practicar selección de fuentes y revisión del conocimiento.",
      "url": "https://nutcrackerman.com/2026/06/30/paleoantropologia-novedades-2o-trimestre-2026/"
    },
    {
      "type": "Método",
      "date": "Actividad",
      "title": "Protocolo de lectura crítica",
      "note": "En cada caso: identificar dato, técnica, inferencia, hipótesis alternativa y alcance real de la muestra.",
      "url": "https://nutcrackerman.com/"
    }
  ]
};
