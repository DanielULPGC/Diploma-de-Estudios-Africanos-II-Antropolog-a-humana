// Catálogo de fotografías científicas y láminas museísticas del Atlas ULPGC / DEA
// Fuente: dea/imagenes.js (Wikimedia Commons con autoría, objeto y licencia verificados)

export interface TaxonImageMeta {
  src: string;
  w: number;
  h: number;
  alt: string;
  objeto: string;
  credito: string;
  licencia: string;
  licenciaUrl: string;
  fuente: string;
  isReference?: boolean;
}

export const INSTITUTIONAL_MEDIA = {
  smithsonianCrania: 'https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/atlas/assets/media/institutional/smithsonian-hominin-crania.webp',
  olduvaiChopper: 'https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/atlas/assets/media/institutional/smithsonian-olduvai-chopper.webp',
  nhmGibraltar: 'https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/atlas/assets/media/institutional/nhm-gibraltar-neanderthal.jpg',
};

export const TAXON_IMAGES: Record<string, TaxonImageMeta> = {
  "proconsul": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/proconsul.jpg",
    "w": 500,
    "h": 503,
    "alt": "Fósil atribuido a Proconsul fotografiado en un museo de Tubinga",
    "objeto": "Fósil de Proconsul en la colección paleontológica de Tubinga",
    "credito": "Fotografía de Ghedoghedo",
    "licencia": "CC BY-SA 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Proconsul_heseloni_Tubingen.jpg"
  },
  "morotopithecus": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/morotopithecus.jpg",
    "w": 500,
    "h": 536,
    "alt": "Fósil atribuido a Morotopithecus bishopi fotografiado en Tubinga",
    "objeto": "Fósil de Morotopithecus en el Museo de Paleontología de Tubinga",
    "credito": "Fotografía de Ghedoghedo",
    "licencia": "CC BY-SA 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Morotopithecus_bishopi_Tubingen.JPG"
  },
  "dryopithecus": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/dryopithecus.jpg",
    "w": 500,
    "h": 469,
    "alt": "Ilustración histórica en dos vistas de una mandíbula atribuida a Dryopithecus fontani",
    "objeto": "Ilustración histórica de la mandíbula de Dryopithecus fontani (1893), no fotografía del fósil",
    "credito": "Ilustración del libro de Jovan Žujović; digitalización de Project Rastko",
    "licencia": "Dominio público (PDM 1.0)",
    "licenciaUrl": "https://creativecommons.org/publicdomain/mark/1.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Dryopithecus_Fontani_jaw.jpg"
  },
  "pierolapithecus": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/pierolapithecus.jpg",
    "w": 500,
    "h": 695,
    "alt": "Réplica museística de Pierolapithecus catalaunicus fotografiada en Sabadell",
    "objeto": "Réplica de Pierolapithecus catalaunicus en el museo de Sabadell, no fósil original",
    "credito": "Fotografía de Nasobema lyricum",
    "licencia": "CC0 1.0",
    "licenciaUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Pierolapithecus_catalaunicus_%28Kopie%29.jpg"
  },
  "nakalipithecus": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/nakalipithecus.jpg",
    "w": 500,
    "h": 486,
    "alt": "Dibujo en dos vistas de la mandíbula atribuida a Nakalipithecus nakayamai",
    "objeto": "Dibujo de dos vistas del holotipo de Nakalipithecus, basado en una publicación; no fotografía del fósil",
    "credito": "Ilustración de Nikhil Iyengar",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Nakalipithecus_mandible.jpg"
  },
  "graecopithecus": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/graecopithecus.jpg",
    "w": 500,
    "h": 618,
    "alt": "Figura científica con mandíbula y premolar atribuidos a Graecopithecus freybergi",
    "objeto": "Figura publicada de la mandíbula holotipo y un premolar de Graecopithecus freybergi",
    "credito": "Figura de Jochen Fuss, Nikolai Spassov, David R. Begun y Madelaine Böhme",
    "licencia": "CC BY 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Graecopithecus_%28from_PLoS_ONE%29.jpg"
  },
  "sahelanthropus": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/sahel.jpg",
    "w": 500,
    "h": 421,
    "alt": "Vista lateral de un molde del cráneo Toumaï atribuido a Sahelanthropus tchadensis",
    "objeto": "Molde del cráneo TM 266-01-060-1 de Sahelanthropus, no fósil original",
    "credito": "Fotografía de Didier Descouens",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Sahelanthropus_tchadensis_-_TM_266-01-060-1.jpg"
  },
  "orrorin": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/orrorin.jpg",
    "w": 370,
    "h": 370,
    "alt": "Lámina compuesta con restos fósiles atribuidos a Orrorin tugenensis, identificados por letras",
    "objeto": "Lámina de restos fósiles atribuidos a Orrorin tugenensis",
    "credito": "Elaboración de Lucius; indicaciones añadidas por Nachosan",
    "licencia": "CC BY-SA 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Orrorin_tugenensis.jpg"
  },
  "ardipithecus": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/ramidus.jpg",
    "w": 500,
    "h": 556,
    "alt": "Cráneo museístico identificado como Ardipithecus ramidus",
    "objeto": "Cráneo expuesto como Ardipithecus ramidus en el Museo Nacional de Ciencias Naturales de Madrid; la ficha de origen no precisa si es original o reproducción",
    "credito": "Fotografía de Tiia Monto",
    "licencia": "CC BY-SA 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Ardipithecus_ramidus.jpg"
  },
  "anamensis": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/anamensis.jpg",
    "w": 500,
    "h": 375,
    "alt": "Húmero distal KNM-KP 271 atribuido a Australopithecus anamensis en el museo de Zúrich",
    "objeto": "Extremo distal del húmero derecho KNM-KP 271 de Australopithecus anamensis, procedente de Kanapoi; la fotografía no muestra el cráneo MRD",
    "credito": "Fotografía de Guérin Nicolas",
    "licencia": "CC BY-SA 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Australopithecus_anamensis_bone_%28University_of_Zurich%29.JPG"
  },
  "afarensis": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/afarensis.jpg",
    "w": 500,
    "h": 565,
    "alt": "Reconstrucción museística del cráneo de Lucy, Australopithecus afarensis",
    "objeto": "Reconstrucción del cráneo de Lucy, no fósil original",
    "credito": "Fotografía de Pbuergler; recorte en Commons de Dunkleosteus77",
    "licencia": "CC BY-SA 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Australopithecus_afarensis_reconstruction.JPG"
  },
  "africanus": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/africanus.jpg",
    "w": 500,
    "h": 902,
    "alt": "Réplica museística del cráneo Sts 5 atribuido a Australopithecus africanus",
    "objeto": "Réplica de Sts 5 («Mrs Ples») en el Museo de Prehistoria de Valencia, no fósil original",
    "credito": "Fotografía de Dorieo",
    "licencia": "CC BY-SA 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Australopithecus_africanus._Museo_de_Prehistoria_de_Valencia.jpg"
  },
  "boisei": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/boisei.jpg",
    "w": 500,
    "h": 768,
    "alt": "Reproducción del cráneo atribuido a Paranthropus boisei",
    "objeto": "Reproducción museística de restos craneales atribuidos a Paranthropus boisei en San Diego, no fósiles originales",
    "credito": "Fotografía de Durova",
    "licencia": "CC BY-SA 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Paranthropus_boisei_skull.jpg"
  },
  "robustus": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/robustus.jpg",
    "w": 500,
    "h": 336,
    "alt": "Cráneo museístico atribuido a Paranthropus robustus",
    "objeto": "Cráneo exhibido como Paranthropus robustus en Augsburg; la fuente no aclara si es original o copia",
    "credito": "Fotografía de Tiia Monto",
    "licencia": "CC BY-SA 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Paranthropus_robustus_skull.jpg"
  },
  "habilis": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/habilis.jpg",
    "w": 500,
    "h": 500,
    "alt": "Cráneo museístico rotulado Homo habilis",
    "objeto": "Cráneo exhibido como Homo habilis en Augsburg; la fuente no aclara si la pieza es original o copia",
    "credito": "Fotografía de Tiia Monto",
    "licencia": "CC BY-SA 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Homo_habilis_skull.jpg"
  },
  "erectus": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/erectus.jpg",
    "w": 500,
    "h": 544,
    "alt": "Pieza craneal identificada como Hombre de Pekín en su archivo de procedencia",
    "objeto": "Cráneo rotulado «Hombre de Pekín» y Homo erectus en Commons; el registro no determina si la pieza fotografiada es original o reproducción",
    "credito": "Fotografía de Netha Hussain",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Homo_erectus_Peking_man_skull.jpg"
  },
  "heidelbergensis": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/heidelbergensis.jpg",
    "w": 500,
    "h": 483,
    "alt": "Cráneo 5 de la Sima de los Huesos, yacimiento de Atapuerca",
    "objeto": "Cráneo 5 de Sima de los Huesos (Atapuerca); es un hallazgo distinto de la mandíbula de Mauer fechada en esta ficha. Atribución taxonómica por revisar",
    "credito": "Fotografía de José-Manuel Benito Álvarez",
    "licencia": "CC BY-SA 2.5",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/2.5/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Homo_heidelbergensis-Cranium_-5.jpg"
  },
  "naledi": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/naledi.jpg",
    "w": 500,
    "h": 751,
    "alt": "Reconstrucción del cráneo de Homo naledi compuesta con moldes de dos especímenes",
    "objeto": "Reconstrucción craneal de Homo naledi realizada a partir de moldes de dos individuos; no es un cráneo fósil completo de un solo individuo",
    "credito": "Fotografía de Martinvl",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:HomoNalediSkull.jpg"
  },
  "neanderthalensis": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/neander.jpg",
    "w": 500,
    "h": 630,
    "alt": "Pieza craneal museística rotulada Homo neanderthalensis",
    "objeto": "Cráneo exhibido como Homo neanderthalensis en Augsburg; la fuente no aclara si la pieza es original o copia",
    "credito": "Fotografía de Tiia Monto",
    "licencia": "CC BY-SA 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Homo_neanderthalensis_skull.jpg"
  },
  "floresiensis": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/flores.jpg",
    "w": 500,
    "h": 667,
    "alt": "Pieza craneal museística rotulada Homo floresiensis en el Senckenberg",
    "objeto": "Pieza craneal expuesta como Homo floresiensis en Senckenberg; la ficha de origen no aclara si es original o copia",
    "credito": "Fotografía de Daderot",
    "licencia": "CC0 1.0",
    "licenciaUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Homo_floresiensis_skull_-_Naturmuseum_Senckenberg_-_DSC02091.JPG"
  },
  "sapiens": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/sapiens.jpg",
    "w": 500,
    "h": 370,
    "alt": "Cráneo calcolítico de Homo sapiens procedente de Sonseca, Granada",
    "objeto": "Cráneo de Homo sapiens procedente de Sonseca, Granada, expuesto en el Museo Arqueológico Nacional; es del Calcolítico y mucho más reciente que las evidencias tempranas de la especie",
    "credito": "Fotografía de Dorieo",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Cr%C3%A1neo_de_homo_sapiens_procedente_de_Sonseca_%28Laborcillas%2C_Granada%29._Calcol%C3%ADtico_-_M.A.N.jpg"
  },
  "kadabba": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/kadabba.jpg",
    "w": 392,
    "h": 286,
    "alt": "Composición de restos fósiles atribuidos a Ardipithecus kadabba",
    "objeto": "Composición de fósiles atribuida a Ardipithecus kadabba",
    "credito": "Imagen de Lucius (Wikimedia Commons)",
    "licencia": "CC BY-SA 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Ardipithecus_kadabba_fossils.jpg"
  },
  "platyops": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/kenyanthropus.jpg",
    "w": 500,
    "h": 333,
    "alt": "Modelo del cráneo atribuido a Kenyanthropus platyops expuesto en el museo Anthropos de Brno",
    "objeto": "Modelo museístico del cráneo atribuido a Kenyanthropus platyops, no fósil original",
    "credito": "Fotografía de Pavel Švejnar",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Kenyanthropus_platyops%2C_skull_%28model%29.JPG"
  },
  "bahrelghazali": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/bahrelghazali.png",
    "w": 341,
    "h": 341,
    "alt": "Mapa esquemático de África con una marca en Chad, área del hallazgo de Australopithecus bahrelghazali",
    "objeto": "Mapa esquemático con marca aproximada del hallazgo de Abel en Chad; sirve para situar el contexto regional y no representa el fósil ni aporta coordenadas verificadas",
    "credito": "Mapa de En rouge; versión de 2016 del autor",
    "licencia": "CC BY-SA 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Bahr_el_Ghazal%2C_Chad_%3B_Australopithecus_bahrelghazali_1995_discovery_map.png"
  },
  "garhi": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/garhi.jpg",
    "w": 500,
    "h": 573,
    "alt": "Pieza museística identificada como Australopithecus garhi",
    "objeto": "Pieza identificada como Australopithecus garhi en la colección del Museo Nacional de Etiopía; la ficha no confirma si es original o copia",
    "credito": "Fotografía de 宜蘭第一公民",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Australopithecus_garhi-_white_background.jpg"
  },
  "sediba": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/sediba.jpg",
    "w": 500,
    "h": 589,
    "alt": "Molde museístico del cráneo juvenil atribuido a Australopithecus sediba",
    "objeto": "Molde del cráneo de un individuo juvenil de Australopithecus sediba en el Smithsonian, no fósil original",
    "credito": "Fotografía de Tim Evanson",
    "licencia": "CC BY-SA 2.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Australopithecus_sediba_juvenile_male_skull_-_Smithsonian_Museum_of_Natural_History_-_2012-05-17.jpg"
  },
  "aethiopicus": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/aethiopicus.jpg",
    "w": 500,
    "h": 401,
    "alt": "Pieza craneal museística atribuida a Paranthropus aethiopicus, probablemente un molde",
    "objeto": "Cráneo expuesto como Paranthropus aethiopicus en Múnich; la fuente indica que probablemente es un molde",
    "credito": "Fotografía de Ghedoghedo",
    "licencia": "CC BY-SA 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Paraustralopithecus_aethiopicus.JPG"
  },
  "rudolfensis": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/rudolfensis.jpg",
    "w": 500,
    "h": 694,
    "alt": "Reconstrucción museística del cráneo KNM-ER 1470 atribuido a Homo rudolfensis",
    "objeto": "Reconstrucción del cráneo KNM-ER 1470 expuesta en San Diego, no fósil original",
    "credito": "Fotografía de Durova",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Homo_rudolfensis.jpg"
  },
  "ergaster": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/ergaster.jpg",
    "w": 500,
    "h": 375,
    "alt": "Pieza craneal museística rotulada Homo ergaster en el Senckenberg",
    "objeto": "Pieza craneal expuesta como Homo ergaster en el Senckenberg; la ficha de origen no aclara si es original o copia",
    "credito": "Fotografía de Daderot",
    "licencia": "CC0 1.0",
    "licenciaUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Homo_ergaster_skull_-_Naturmuseum_Senckenberg_-_DSC02098.JPG"
  },
  "antecessor": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/antecessor.jpg",
    "w": 500,
    "h": 397,
    "alt": "Reconstrucción museística del cráneo atribuido a Homo antecessor",
    "objeto": "Reconstrucción del cráneo de Homo antecessor en el Museo de Arqueología de Cataluña, no fósil original",
    "credito": "Fotografía de Xvazquez",
    "licencia": "Dominio público (declaración del autor)",
    "licenciaUrl": "https://commons.wikimedia.org/wiki/File:Homo_antecessor_reconstruccion.jpg#Licensing",
    "fuente": "https://commons.wikimedia.org/wiki/File:Homo_antecessor_reconstruccion.jpg"
  },
  "luzonensis": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/luzon.jpg",
    "w": 500,
    "h": 386,
    "alt": "Tercer metatarsiano CCH1 atribuido a Homo luzonensis",
    "objeto": "Imagen identificada en Commons como el tercer metatarsiano CCH1 hallado en Callao; el archivo no aclara si la pieza mostrada es el fósil original o una copia",
    "credito": "Imagen de Luzonensis",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Homo_luzonensis_metatarsal.jpg"
  },
  "longi": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/longi.jpg",
    "w": 500,
    "h": 543,
    "alt": "Figura científica del cráneo holotipo de Harbin",
    "objeto": "Figura del cráneo holotipo de Harbin, asignado a Homo longi en la fuente; su clasificación sigue abierta",
    "credito": "Figura de Fu y colaboradores (2025)",
    "licencia": "CC BY 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Homo_longi_holotype.jpg"
  },
  "daliensis": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/daliensis.jpg",
    "w": 500,
    "h": 480,
    "alt": "Réplica museística del cráneo de Dali",
    "objeto": "Réplica del cráneo de Dali expuesta en Xi'an; no fósil original",
    "credito": "Fotografía de Gary Todd",
    "licencia": "CC0 1.0",
    "licenciaUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Dali_Man_Skull%2C_Replica.jpg"
  },
  "juluensis": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/juluensis.jpg",
    "w": 500,
    "h": 326,
    "alt": "Lámina científica rotulada de restos humanos procedentes de Xujiayao, China",
    "objeto": "Lámina de restos humanos de Xujiayao (maxilar, dientes, fragmentos craneales y mandíbula) publicada en 2017; anterior a la propuesta de Homo juluensis y no demuestra la validez de ese nombre ni la cronología revisada de la ficha",
    "credito": "Figura de Hong Ao, Chun-Ru Liu, Andrew P. Roberts, Peng Zhang y Xinwen Xu (2017)",
    "licencia": "CC BY 4.0 (publicación de origen)",
    "licenciaUrl": "https://creativecommons.org/licenses/by/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Xujiayao_hominin.jpg"
  },
  "penghu": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/penghu.jpg",
    "w": 500,
    "h": 353,
    "alt": "Mandíbula identificada en la fuente como Penghu 1",
    "objeto": "Mandíbula identificada como Penghu 1 en la fuente; no se documenta si la pieza fotografiada es original o réplica",
    "credito": "Fotografía de TaichungJohnny",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Fossil_of_Mandible_of_Penghu_1.JPG"
  },
  "deyiremeda": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/deyiremeda.png",
    "w": 500,
    "h": 500,
    "alt": "Dibujo de mandíbula y maxilar atribuidos a Australopithecus deyiremeda, mostrados en oclusión",
    "objeto": "Dibujo de la mandíbula BRT-VP-3/1 invertida y del maxilar BRT-VP-3/14, presentados en oclusión como Australopithecus deyiremeda; no es una fotografía de los fósiles ni debe usarse para medirlos",
    "credito": "Ilustración de A. C. Tatarinov",
    "licencia": "CC0 1.0",
    "licenciaUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Australopithecus_deyiremeda.png"
  },
  "prometheus": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/prometheus.jpg",
    "w": 500,
    "h": 667,
    "alt": "Molde museístico del esqueleto StW 573 conocido como Little Foot",
    "objeto": "Molde del esqueleto StW 573 («Little Foot») en el American Museum of Natural History; la atribución a Australopithecus prometheus está debatida, no es el fósil original",
    "credito": "Fotografía de Vicpeters",
    "licencia": "CC BY 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Little_Foot_cast.jpg"
  },
  "georgicus": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/georgicus.jpg",
    "w": 500,
    "h": 500,
    "alt": "Molde del cráneo MGL 95212 procedente de Dmanisi",
    "objeto": "Molde de MGL 95212, Dmanisi. «Homo georgicus» es la etiqueta del catálogo; su delimitación taxonómica está discutida",
    "credito": "Fotografía de Rama",
    "licencia": "CC BY-SA 3.0 Francia",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0/fr/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Homo_georgicus-MGL_95212-P5030043-white.jpg"
  },
  "rhodesiensis": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/rhodesiensis.jpg",
    "w": 500,
    "h": 533,
    "alt": "Réplica museística del cráneo Kabwe 1 procedente de Broken Hill",
    "objeto": "Réplica de Kabwe 1 (Broken Hill) expuesta en Mauer, no fósil original; las atribuciones taxonómicas del cráneo son objeto de debate",
    "credito": "Fotografía de Gerbil",
    "licencia": "CC BY-SA 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Broken_Hill_Skull_%28Replica01%29.jpg"
  },
  "bodoensis": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/bodoensis.jpg",
    "w": 500,
    "h": 538,
    "alt": "Molde museístico del cráneo de Bodo fotografiado en el Smithsonian",
    "objeto": "Molde del cráneo de Bodo en el Smithsonian, rotulado Homo heidelbergensis en la fuente; Homo bodoensis es una propuesta taxonómica discutida, no una identificación validada por la fotografía",
    "credito": "Fotografía de Jonathan Chen",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Bodo_NMNH.jpg"
  },
  "cepranensis": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/cepranensis.png",
    "w": 500,
    "h": 404,
    "alt": "Ilustración digital del cráneo de Ceprano",
    "objeto": "Infografía artística del cráneo de Ceprano, no fotografía del fósil; la denominación «Homo cepranensis» del catálogo exige cautela taxonómica",
    "credito": "Ilustración de UtaUtaNapishtim",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Ceprano_artistic.png"
  },
  "helmei": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/helmei.jpg",
    "w": 500,
    "h": 471,
    "alt": "Molde museístico del cráneo de Florisbad fotografiado en el Smithsonian",
    "objeto": "Molde del cráneo de Florisbad en el Smithsonian, rotulado Homo heidelbergensis en la fuente; su atribución a Homo helmei sigue debatida, no es el fósil original",
    "credito": "Fotografía de Jonathan Chen",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Florisbad_NMNH.jpg"
  },
  "idaltu": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/idaltu.jpg",
    "w": 500,
    "h": 375,
    "alt": "Pieza craneal de Herto identificada como Homo sapiens idaltu en el Museo Nacional de Adís Abeba",
    "objeto": "Pieza craneal de Herto expuesta en el Museo Nacional de Adís Abeba; Commons la identifica como Homo sapiens idaltu y no aclara si es el fósil original o una reproducción",
    "credito": "Fotografía de Alessandrosmerilli",
    "licencia": "Dominio público (declaración del autor)",
    "licenciaUrl": "https://commons.wikimedia.org/wiki/File:Homo_Sapiens_Idaltu.JPG#Licensing",
    "fuente": "https://commons.wikimedia.org/wiki/File:Homo_Sapiens_Idaltu.JPG"
  },
  "jebel_irhoud": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/jebel_irhoud.jpg",
    "w": 500,
    "h": 532,
    "alt": "Molde museístico del cráneo Jebel Irhoud 1",
    "objeto": "Molde del cráneo Jebel Irhoud 1 expuesto en el Smithsonian, no fósil original",
    "credito": "Fotografía de Jonathan Chen",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Jebel_Irhoud-1_NMNH.jpg"
  },
  "omo_i": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/omo_i.jpg",
    "w": 500,
    "h": 547,
    "alt": "Réplica de un cráneo de Kibish en el Museo de las Civilizaciones Negras, clasificada como Omo I",
    "objeto": "Réplica de un cráneo de Kibish en Dakar, clasificada como Omo I en Commons; no se ha fotografiado el fósil original ni verificado independientemente la identificación de la réplica",
    "credito": "Fotografía y recorte en Commons de GuillaumeG",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Omo_Kibish_-_MCN_4152_%28cropped%29.jpg"
  },
  "denisovanos": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/denisova.jpg",
    "w": 500,
    "h": 333,
    "alt": "Réplica museística de una falange denisovana expuesta en Bruselas",
    "objeto": "Réplica de una falange denisovana hallada en 2008, no fósil original",
    "credito": "Fotografía de Thilo Parg / Wikimedia Commons",
    "licencia": "CC BY-SA 3.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Denisova_Phalanx_distalis.jpg"
  },
  "erectus_soloensis": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/soloensis.jpg",
    "w": 500,
    "h": 371,
    "alt": "Pieza craneal Ngandong 14 exhibida en un museo",
    "objeto": "Ngandong 14, exhibido en el Smithsonian; la fuente no confirma si la pieza expuesta es el fósil original o una copia",
    "credito": "Fotografía de Ryan Somma",
    "licencia": "CC BY-SA 2.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Ngandong_14._Homo_erectus.jpg"
  },
  "erectus_pekinensis": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/erectus.jpg",
    "w": 500,
    "h": 544,
    "alt": "Pieza craneal identificada como Hombre de Pekín en su archivo de procedencia",
    "objeto": "Molde craneal atribuido al «Hombre de Pekín» (Zhoukoudian, Homo erectus pekinensis)",
    "credito": "Fotografía de Netha Hussain",
    "licencia": "CC BY-SA 4.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Homo_erectus_Peking_man_skull.jpg"
  },
  "erectus_erectus": {
    "src": "https://danielulpgc.github.io/Paleobot.-Plataforma-de-evoluci-n-humana/img/taxones/soloensis.jpg",
    "w": 500,
    "h": 371,
    "alt": "Pieza craneal Ngandong 14 exhibida en un museo",
    "objeto": "Ejemplar indonesio de referencia de Homo erectus (Java, Ngandong 14 en el Smithsonian; referencia regional para Homo erectus erectus)",
    "credito": "Fotografía de Ryan Somma",
    "licencia": "CC BY-SA 2.0",
    "licenciaUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "fuente": "https://commons.wikimedia.org/wiki/File:Ngandong_14._Homo_erectus.jpg"
  }
};

// Fallback de referencia por clado para los 3 táxones fragmentarios sin fotografía propia en Commons
export function getTaxonImage(taxonId: string, clado?: string): TaxonImageMeta {
  if (TAXON_IMAGES[taxonId]) return TAXON_IMAGES[taxonId];
  if (taxonId === 'anoiapithecus' && TAXON_IMAGES.pierolapithecus) {
    return {
      ...TAXON_IMAGES.pierolapithecus,
      objeto: 'Referencia regional del Mioceno de Cataluña (Pierolapithecus catalaunicus, mismo yacimiento de Els Hostalets de Pierola que Anoiapithecus brevirostris)',
      isReference: true,
    };
  }
  if (taxonId === 'chororapithecus' && TAXON_IMAGES.nakalipithecus) {
    return {
      ...TAXON_IMAGES.nakalipithecus,
      objeto: 'Referencia comparativa de hominoideo del Mioceno tardío de África Oriental (Nakalipithecus; Chororapithecus se conoce por dientes aislados sin imagen libre en Commons)',
      isReference: true,
    };
  }
  if (taxonId === 'gautengensis' && TAXON_IMAGES.habilis) {
    return {
      ...TAXON_IMAGES.habilis,
      objeto: 'Referencia comparativa de Homo temprano (Homo habilis; Homo gautengensis se basa en el cráneo StW 53 de Sterkfontein)',
      isReference: true,
    };
  }
  if (clado === 'homo' && TAXON_IMAGES.habilis) {
    return { ...TAXON_IMAGES.habilis, isReference: true };
  }
  return {
    src: INSTITUTIONAL_MEDIA.smithsonianCrania,
    w: 800,
    h: 533,
    alt: 'Serie comparativa de cráneos de homininos del Smithsonian Institution',
    objeto: 'Serie comparativa de cráneos fósiles de homininos (Smithsonian Institution)',
    credito: 'Smithsonian Institution',
    licencia: 'Uso educativo institucional',
    licenciaUrl: 'https://humanorigins.si.edu/',
    fuente: 'https://humanorigins.si.edu/',
    isReference: true,
  };
}
