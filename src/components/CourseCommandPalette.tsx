import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Box, Compass, Layers, Search, X } from 'lucide-react';
import { ANTHROPOLOGY_SYLLABUS_TOPICS } from '../data/anthropologySyllabusData';
import { ATLAS_CLADOS, ATLAS_TAXONES } from '../data/atlasPaleo';
import { KINGDOMS_DATA, KINGDOMS_ORDER } from '../data/curriculum';
import { GLOSSARY_TERMS } from '../data/glossary';
import {
  COURSE_BLOCKS,
  COURSE_CHAPTERS,
  INTERACTIVE_LAB_SHORTCUTS,
  getBlockMeta,
  normalizeSearchText,
  type CourseDeepAction,
} from '../data/courseNavigation';
import { useModalFocusTrap } from '../utils/useModalFocusTrap';

type SearchCategory =
  | 'todo'
  | 'secciones'
  | 'laboratorios'
  | 'temas'
  | 'fosiles'
  | 'reinos'
  | 'glosario';

interface PaletteItem {
  id: string;
  category: Exclude<SearchCategory, 'todo'>;
  categoryLabel: string;
  title: string;
  subtitle: string;
  meta: string;
  searchBlob: string;
  action: CourseDeepAction;
}

const CATEGORY_TABS: Array<{ id: SearchCategory; label: string }> = [
  { id: 'todo', label: 'Todo' },
  { id: 'secciones', label: `Secciones (${COURSE_CHAPTERS.length})` },
  { id: 'laboratorios', label: 'Laboratorios y 3D' },
  { id: 'temas', label: 'Temas 1–10' },
  { id: 'fosiles', label: `Fósiles (${ATLAS_TAXONES.length})` },
  { id: 'reinos', label: 'Reinos (6)' },
  { id: 'glosario', label: 'Glosario' },
];

export interface CourseCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (action: CourseDeepAction) => void;
}

export function CourseCommandPalette({
  isOpen,
  onClose,
  onNavigate,
}: CourseCommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('todo');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useModalFocusTrap({
    isOpen,
    containerRef: dialogRef,
    initialFocusRef: inputRef,
    onClose,
  });

  const allItems = useMemo<PaletteItem[]>(() => {
    const items: PaletteItem[] = [];

    // 1. 13 Course sections
    COURSE_CHAPTERS.forEach((ch) => {
      const block = getBlockMeta(ch.blockId);
      items.push({
        id: `sec-${ch.id}`,
        category: 'secciones',
        categoryLabel: `Bloque ${block.roman}`,
        title: `${ch.num} · ${ch.label}`,
        subtitle: ch.summary,
        meta: ch.durationMin ? `${ch.durationMin} min` : 'Referencia',
        searchBlob: normalizeSearchText(`${ch.num} ${ch.label} ${ch.summary} ${block.title}`),
        action: { sectionId: ch.id },
      });
    });

    // 2. Interactive labs & 3D viewers (core 6 + additional key sub-tools)
    INTERACTIVE_LAB_SHORTCUTS.forEach((lab) => {
      items.push({
        id: lab.id,
        category: 'laboratorios',
        categoryLabel: 'Laboratorio',
        title: lab.title,
        subtitle: lab.subtitle,
        meta: lab.tag,
        searchBlob: normalizeSearchText(`${lab.title} ${lab.subtitle} ${lab.tag} 3d interactivo`),
        action: lab.action,
      });
    });

    items.push(
      {
        id: 'lab-reloj-24h',
        category: 'laboratorios',
        categoryLabel: 'Laboratorio',
        title: 'Comparador fósil y Reloj 24 horas',
        subtitle: 'Escala del tiempo profundo evolutivo comprimida en un día de 24 h',
        meta: 'Atlas Paleo',
        searchBlob: normalizeSearchText('reloj 24 horas comparador fosil tiempo profundo atlas'),
        action: { sectionId: 'sec-atlas-paleo', atlas: { tab: 'comparar' } },
      },
      {
        id: 'lab-territorio-rift',
        category: 'laboratorios',
        categoryLabel: 'Laboratorio',
        title: 'Cartografía del Rift Oriental y África (24 regiones)',
        subtitle: 'Mapa fosilífero Natural Earth con ampliación ×2,5 del valle del Rift',
        meta: 'Atlas Paleo',
        searchBlob: normalizeSearchText('mapa territorio rift oriental africa canarias fosiles'),
        action: { sectionId: 'sec-atlas-paleo', atlas: { tab: 'territorio' } },
      },
      {
        id: 'lab-sesiones-dea',
        category: 'laboratorios',
        categoryLabel: 'Laboratorio',
        title: 'Itinerario de 6 sesiones guiadas DEA',
        subtitle: 'Guía docente, cuaderno local, criterios APA 7.ª y situación LOMLOE',
        meta: 'Atlas · Aula DEA',
        searchBlob: normalizeSearchText('sesiones dea aula lomloe cuaderno guia apa'),
        action: { sectionId: 'sec-atlas-paleo', atlas: { tab: 'aula' } },
      },
      {
        id: 'lab-viabilidad-molecular',
        category: 'laboratorios',
        categoryLabel: 'Laboratorio',
        title: 'Simulador de viabilidad paleomolecular',
        subtitle: 'Evaluación de ADN antiguo frente a proteómica del esmalte según clima y edad',
        meta: 'Paleomolecular',
        searchBlob: normalizeSearchText(
          'simulador viabilidad paleoproteomica paleogenomica adn esmalte proteina'
        ),
        action: { sectionId: 'sec-paleomolecular', paleomolecular: { tab: 'laboratorio' } },
      },
      {
        id: 'lab-olduvayense',
        category: 'laboratorios',
        categoryLabel: 'Laboratorio',
        title: 'Puente entre etología primate y Olduvayense',
        subtitle: 'Comparación de huellas de percusión en primates con yacimientos del Plioceno',
        meta: 'Etología',
        searchBlob: normalizeSearchText('olduvayense percusion litica puente arqueologia primate'),
        action: { sectionId: 'etologia', ethology: { tab: 'olduvayense' } },
      },
      {
        id: 'lab-etologia-sociedad',
        category: 'laboratorios',
        categoryLabel: 'Etología',
        title: 'Sociedad primate, cooperación y resolución de conflictos',
        subtitle: 'Fisión-fusión, coaliciones femeninas en bonobos, caza en Taï y modelos de sabana',
        meta: 'Etología · Sociedad',
        searchBlob: normalizeSearchText(
          'sociedad cooperacion reconciliacion consolacion fision fusion bonobo chimpance gorila babuino gelada tai wamba'
        ),
        action: { sectionId: 'etologia', ethology: { tab: 'sociedad' } },
      },
      {
        id: 'lab-etologia-comunicacion',
        category: 'laboratorios',
        categoryLabel: 'Laboratorio',
        title: 'Comparador interactivo de sistemas sociales y comunicación',
        subtitle: 'Contraste dual de 5 especies africanas en gestos, vocalizaciones y cognición',
        meta: 'Etología · Comparador',
        searchBlob: normalizeSearchText(
          'comparador comunicacion gestos intencionales teoria mente vocalizacion pant hoot bonobo chimpance gelada gorila'
        ),
        action: { sectionId: 'etologia', ethology: { tab: 'comunicacion' } },
      },
      {
        id: 'lab-etologia-culturas-taller',
        category: 'laboratorios',
        categoryLabel: 'Taller',
        title: 'Culturas vegetales, caza en Fongoli, automedicación y taller',
        subtitle: 'Kits de Goualougo, lanzas de sabana, zoofarmacognosia y 4 casos prácticos de aula',
        meta: 'Etología · Taller',
        searchBlob: normalizeSearchText(
          'culturas vegetales goualougo fongoli lanzas sabana zoofarmacognosia automedicacion vernonia mahale taller etologia'
        ),
        action: { sectionId: 'etologia', ethology: { tab: 'culturas-taller' } },
      },
      {
        id: 'lab-etologia-zoofarmacognosia',
        category: 'laboratorios',
        categoryLabel: 'Ficha de taller',
        title: 'Ficha interactiva: plantas de automedicación en sabanas africanas',
        subtitle: 'Identifica Vernonia, Aspilia, Balanites, Ficus, Aneilema y Lippia en 4 entornos de sabana',
        meta: 'Etología · Zoofarmacognosia',
        searchBlob: normalizeSearchText(
          'ficha taller automedicacion zoofarmacognosia sabana africana vernonia amygdalina aspilia balanites aegyptiaca ficus exasperata aneilema lippia herbario plantas medicinales'
        ),
        action: { sectionId: 'etologia', ethology: { tab: 'culturas-taller' } },
      },
      {
        id: 'lab-taller-automedicacion-visual',
        category: 'laboratorios',
        categoryLabel: 'Taller visual',
        title: 'Taller de Automedicación (imágenes de plantas ↔ uso etológico)',
        subtitle: 'Empareja fotografías botánicas africanas con su conducta terapéutica y guarda tu sesión',
        meta: 'Etología · Sesión guardada',
        searchBlob: normalizeSearchText(
          'taller automedicacion imagenes plantas africanas uso etologico emparejar vernonia aspilia balanites ficus sesion progreso'
        ),
        action: { sectionId: 'etologia', ethology: { tab: 'taller-automedicacion' } },
      },
      {
        id: 'ref-pastwomen',
        category: 'laboratorios',
        categoryLabel: 'Dossier · Pastwomen',
        title: 'Evolución humana desde Pastwomen (mantenimiento, cuidados y parto)',
        subtitle: 'Australopithecus/Lucy, dilema obstétrico, crítica a la Marcha del Progreso y matriz de cuidados',
        meta: 'pastwomen.net · Bloque I',
        searchBlob: normalizeSearchText(
          'pastwomen evolucion humana lucy australopithecus laetoli dilema obstetrico parto asistido marcha del progreso cuidados infancia mujeres prehistoria arqueologia genero actividades mantenimiento laminas'
        ),
        action: { sectionId: 'sec-antropologia', anthropology: { viewMode: 'pastwomen' } },
      },
      {
        id: 'ref-smithsonian-origins',
        category: 'laboratorios',
        categoryLabel: 'Dossier · Smithsonian',
        title: 'Evolución humana · Smithsonian Human Origins (6 Ma y Olorgesailie)',
        subtitle: 'Línea temporal de 6 Ma, 6 rasgos en mosaico, selección por variabilidad y Rick Potts',
        meta: 'humanorigins.si.edu · Bloque I',
        searchBlob: normalizeSearchText(
          'smithsonian human origins rick potts olorgesailie seleccion por variabilidad 6 ma evolucion mosaico arbol familiar bipedismo cerebros simbolos humanorigins si edu'
        ),
        action: { sectionId: 'sec-antropologia', anthropology: { viewMode: 'smithsonian' } },
      },
      {
        id: 'ref-mapa-migraciones-d3-nodos',
        category: 'laboratorios',
        categoryLabel: 'Mapa D3 · Evolución',
        title: 'Yacimientos y rutas migratorias (Dmanisi, Olorgesailie, Blombos, Sahul, Monte Verde)',
        subtitle: '14 nodos arqueológicos interactivos con evidencias cruzadas de Smithsonian y Pastwomen',
        meta: 'D3.js · 4 olas',
        searchBlob: normalizeSearchText(
          'mapa d3 rutas migratorias dispersión hadar laetoli olduvai turkana koobi fora dmanisi sangiran liang bua olorgesailie jebel irhoud atapuerca el sidron blombos wonderwerk skhul qafzeh shanidar panga ya saidi mtoto madjedbebe sahul monte verde takarkori beringia pastwomen smithsonian'
        ),
        action: { sectionId: 'sec-antropologia', anthropology: { viewMode: 'migraciones' } },
      },
      {
        id: 'ref-canibalismo-cronologia-critica',
        category: 'laboratorios',
        categoryLabel: 'Bloque III · Cronología Crítica',
        title: 'Cronología Crítica: mitos caníbales vs. arqueología africana (6 regiones)',
        subtitle: 'Coexistencia simultánea frente a Kush, Aksum, Kilwa, Gran Zimbabue, Benín, Malí y Mbanza Kongo',
        meta: '05b · Doble carril',
        searchBlob: normalizeSearchText(
          'cronologia critica coexistencia mitos canibalismo evidencias arqueologicas regiones africanas kush aksum meroe kilwa suajili gran zimbabue zimboo mocaranga finley benin mali jenne jeno tombuctu mbanza kongo luba umlauft danville cruttwell bloque iii'
        ),
        action: {
          sectionId: 'sec-estereotipos-canibalismo',
          cannibalism: { tab: 'cronologia-critica' },
        },
      },
      {
        id: 'ref-canibalismo-genealogia',
        category: 'laboratorios',
        categoryLabel: 'Bloque III · Imaginarios',
        title: 'Genealogía del estereotipo caníbal (América, Pacífico y África)',
        subtitle: 'De Colón 1492, Servet 1541 y De Bry a D’Anville 1794, Finley 1827, Umlauft y El cautivo',
        meta: '05b · 4 fases',
        searchBlob: normalizeSearchText(
          'canibalismo antropofagia estereotipos genealogia america pacifico africa colon servet de bry staden danville cruttwell finley umlauft el cautivo zentner pellejero becerra romero'
        ),
        action: { sectionId: 'sec-estereotipos-canibalismo', cannibalism: { tab: 'genealogia' } },
      },
      {
        id: 'ref-canibalismo-iconos',
        category: 'laboratorios',
        categoryLabel: 'Bloque III · Iconografía',
        title: 'Deconstrucción de iconos: caldero, salacot, mapas y viñetas',
        subtitle: 'Biblia de Holkham, brujas, Robespierre 1793, Little Nemo y tríada de Roger Chartier',
        meta: '05b · Chartier',
        searchBlob: normalizeSearchText(
          'caldero marmita olla salacot explorador jefe hueso gorro cocinero holkham brujas robespierre little nemo winsor mccay chiquita banana chartier gombrich bartra'
        ),
        action: { sectionId: 'sec-estereotipos-canibalismo', cannibalism: { tab: 'iconos' } },
      },
      {
        id: 'ref-canibalismo-ntlle',
        category: 'laboratorios',
        categoryLabel: 'Bloque III · Léxico',
        title: 'Evolución léxica del NTLLE (antropófago, caníbal y salvaje)',
        subtitle: 'Cronología lexicográfica 1492–1970: Colón, Covarrubias 1611 y ediciones de la RAE',
        meta: '05b · NTLLE',
        searchBlob: normalizeSearchText(
          'ntlle rae covarrubias diccionario lexico antropofago canibal salvaje pueblos sin cultura 1492 1611 1788 1970'
        ),
        action: { sectionId: 'sec-estereotipos-canibalismo', cannibalism: { tab: 'lexico' } },
      },
      {
        id: 'ref-canibalismo-ciencia-mito',
        category: 'laboratorios',
        categoryLabel: 'Bloque III · Ciencia vs. Mito',
        title: 'Ciencia vs. Mito: Atapuerca, botica europea (Mumia) y primatología',
        subtitle: 'Gran Dolina, El Sidrón, El Mirador, Mumia/Axungia hominis, Mahale y Kibale',
        meta: '05b · Contraste',
        searchBlob: normalizeSearchText(
          'ciencia mito atapuerca gran dolina el sidron moula guercy krapina el mirador botica europea mumia axungia hominis mahale kibale ngogo norikoshi sherrow lituania 1571 mateo de paris'
        ),
        action: { sectionId: 'sec-estereotipos-canibalismo', cannibalism: { tab: 'ciencia-mito' } },
      },
      {
        id: 'ref-antropologia-visual-filmografia',
        category: 'laboratorios',
        categoryLabel: 'Bloque III · Antropología Visual',
        title: 'Filmografía etnográfica de África (AntropologiaVisual.net · 13 obras)',
        subtitle:
          'Wodaabe, Shooting Freetown, Azande, Akan, Aoujgal, Sidi Ifni, Bwiti, Djema el Fna, Dakar, Tabanca, La forêt y Gurumbé',
        meta: '05c · Cine etnográfico',
        searchBlob: normalizeSearchText(
          'antropologia visual antropologiavisual net cine etnografico documental africa wodaabe herzog gerewol shooting freetown sierra leona jean rouch etnoficcion azande evans pritchard sudan akan costa de marfil jordi esteva retorno al pais de las almas aoujgal marruecos magreb bereber atlas sidi ifni romain simenel ibogaina bwiti gabon camerun djema el fna marrakech dos cuadernos dakar senegal tabanca guinea bissau la foret ceuta frontera gurumbe miguel angel rosales ruanda genocidio'
        ),
        action: {
          sectionId: 'sec-antropologia-visual',
          visualAnthropology: { tab: 'filmografia' },
        },
      },
      {
        id: 'ref-antropologia-visual-vivo',
        category: 'laboratorios',
        categoryLabel: 'Bloque III · Archivo en directo',
        title: 'Conexión directa con el archivo abierto AntropologiaVisual.net',
        subtitle: 'Búsqueda en tiempo real en antropologiavisual.net sobre África, muestras y festivales',
        meta: '05c · Archivo vivo',
        searchBlob: normalizeSearchText(
          'antropologiavisual net archivo vivo api busqueda directo festival jean rouch maam madrid lleida jordi esteva miguel angel rosales jorgelina barrera ficaa'
        ),
        action: {
          sectionId: 'sec-antropologia-visual',
          visualAnthropology: { tab: 'archivo-vivo' },
        },
      },
      {
        id: 'ref-cultural-studies-genealogia',
        category: 'laboratorios',
        categoryLabel: 'Bloque III · Imaginarios coloniales',
        title: 'Genealogía colonial del «África misteriosa» (1490–2025) y matriz binaria',
        subtitle:
          'Seis estratos históricos, 8 pares dicotómicos (Nosotros/El Otro), postales, publicidad colonial y restitución',
        meta: '05d · Genealogía',
        searchBlob: normalizeSearchText(
          'genealogia colonial africa misteriosa estereotipos coloniales hegel sociedades geograficas berlin 1884 mision civilizadora kipling racismo de mercancia commodity racism mcclintock banania tintin congo postales coloniales alocronismo fabian alegoria maniquea restitucion sarr savoy bronces benin'
        ),
        action: {
          sectionId: 'sec-cultural-studies',
          culturalStudies: { tab: 'genealogia-colonial' },
        },
      },
      {
        id: 'ref-cultural-studies-tropos',
        category: 'laboratorios',
        categoryLabel: 'Bloque III · Cultural Studies',
        title: 'El «África misteriosa»: 12 tropos, imaginarios y estereotipos coloniales',
        subtitle:
          'Continente oscuro, misión civilizadora, commodity racism, buen salvaje, arte primitivo, safari y white savior',
        meta: '05d · 12 Tropos',
        searchBlob: normalizeSearchText(
          'cultural studies africa misteriosa imaginarios estereotipos coloniales 12 tropos continente oscuro corazon de las tinieblas stanley conrad achebe mudimbe biblioteca colonial edward said chimamanda adichie historia unica binyavanga wainaina mbembe ngugi white savior salvador blanco afropesimismo safari tribu saartjie baartman zoos humanos fanon mision civilizadora kipling commodity racism mcclintock buen salvaje arte primitivo sally price sarr savoy'
        ),
        action: {
          sectionId: 'sec-cultural-studies',
          culturalStudies: { tab: 'tropos' },
        },
      },
      {
        id: 'ref-cultural-studies-hall-lab',
        category: 'laboratorios',
        categoryLabel: 'Bloque III · Laboratorio',
        title: 'Laboratorio de decodificación de Stuart Hall (7 piezas mediáticas)',
        subtitle:
          'Novela imperial, prensa, publicidad de cacao, cómic colonial, safari, campañas ONG y cine comercial',
        meta: '05d · Stuart Hall',
        searchBlob: normalizeSearchText(
          'laboratorio decodificacion codificacion stuart hall lectura dominante negociada oposicional publicidad cacao chocolate comic colonial tintin contra narrativas literatura africana ousmane sembene fespaco seydou keita malick sidibe afrofuturismo africanfuturism nnedi okorafor'
        ),
        action: {
          sectionId: 'sec-cultural-studies',
          culturalStudies: { tab: 'decodificador' },
        },
      }
    );

    // 3. 10 Anthropology syllabus topics
    ANTHROPOLOGY_SYLLABUS_TOPICS.forEach((topic) => {
      items.push({
        id: `topic-${topic.id}`,
        category: 'temas',
        categoryLabel: `Tema ${topic.num}`,
        title: `Tema ${topic.num} · ${topic.shortTitle}`,
        subtitle: topic.officialTitle,
        meta: topic.block,
        searchBlob: normalizeSearchText(
          `tema ${topic.num} ${topic.shortTitle} ${topic.officialTitle} ${topic.block} ${topic.leadSummary}`
        ),
        action: {
          sectionId: 'sec-antropologia',
          anthropology: { topicId: topic.id, viewMode: 'detalle' },
        },
      });
    });

    // 4. 52 Atlas Paleo fossil taxa
    ATLAS_TAXONES.forEach((taxon) => {
      const clado = ATLAS_CLADOS[taxon.c];
      items.push({
        id: `taxon-${taxon.id}`,
        category: 'fosiles',
        categoryLabel: clado?.short ?? 'Taxón fósil',
        title: taxon.n,
        subtitle: taxon.nota,
        meta: `${taxon.desde}–${taxon.hasta} Ma`,
        searchBlob: normalizeSearchText(
          `${taxon.n} ${taxon.id} ${taxon.nota} ${taxon.geoNota ?? ''} ${taxon.etimologia ?? ''} ${clado?.nombre ?? ''} fosil homininos`
        ),
        action: {
          sectionId: 'sec-atlas-paleo',
          atlas: { tab: 'cronologia', taxonId: taxon.id },
        },
      });
    });

    // 5. 6 African precolonial kingdoms
    KINGDOMS_ORDER.forEach((kid) => {
      const k = KINGDOMS_DATA[kid];
      items.push({
        id: `kingdom-${kid}`,
        category: 'reinos',
        categoryLabel: 'Reino africano',
        title: k.name,
        subtitle: `${k.spanLabel} · ${k.title}`,
        meta: 'Bloque III',
        searchBlob: normalizeSearchText(
          `${k.name} ${k.shortLabel} ${k.spanLabel} ${k.kicker} ${k.title} ${k.desc} ${k.econ} ${k.inst} ${k.pat}`
        ),
        action: { sectionId: 'sec-reinos', kingdomId: kid },
      });
    });

    // 6. Glossary terms
    GLOSSARY_TERMS.forEach((term) => {
      items.push({
        id: `gloss-${term.id}`,
        category: 'glosario',
        categoryLabel: 'Glosario',
        title: term.term,
        subtitle: term.definition,
        meta: term.categoryLabel,
        searchBlob: normalizeSearchText(
          `${term.term} ${term.definition} ${term.categoryLabel} ${term.moduleContext}`
        ),
        action: { sectionId: 'sec-glosario', glossaryTermId: term.id },
      });
    });

    return items;
  }, []);

  const filteredItems = useMemo(() => {
    const q = normalizeSearchText(query);
    const pool =
      category === 'todo' ? allItems : allItems.filter((item) => item.category === category);

    if (!q) {
      if (category === 'todo') {
        // Show curated overview: key labs (including D3 map & workshops) + all sections
        const featuredLabs = pool.filter((i) => i.category === 'laboratorios').slice(0, 8);
        const sections = pool.filter((i) => i.category === 'secciones');
        return [...featuredLabs, ...sections];
      }
      return pool.slice(0, 40);
    }

    const tokens = q.split(/\s+/).filter(Boolean);
    return pool
      .filter((item) => tokens.every((tok) => item.searchBlob.includes(tok)))
      .slice(0, 32);
  }, [allItems, category, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, category, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setCategory('todo');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0
        );
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredItems.length > 0
            ? (prev - 1 + filteredItems.length) % filteredItems.length
            : 0
        );
        return;
      }
      if (e.key === 'Enter' && document.activeElement === inputRef.current && filteredItems[selectedIndex]) {
        e.preventDefault();
        onNavigate(filteredItems[selectedIndex].action);
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onNavigate, onClose]);

  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>('[data-selected="true"]');
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex, isOpen]);

  if (!isOpen) return null;

  const renderCategoryIcon = (cat: PaletteItem['category']) => {
    if (cat === 'laboratorios') return <Box className="w-3.5 h-3.5 text-ochre shrink-0" aria-hidden="true" />;
    if (cat === 'temas') return <BookOpen className="w-3.5 h-3.5 text-lapis shrink-0" aria-hidden="true" />;
    if (cat === 'reinos') return <Compass className="w-3.5 h-3.5 text-forest shrink-0" aria-hidden="true" />;
    return <Layers className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />;
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-ink/45 flex items-start justify-center p-4 sm:pt-16 no-print"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Buscador rápido de contenidos del Módulo I"
        className="w-full max-w-2xl bg-canvas border border-ink border-t-2 border-t-ochre shadow-xl flex flex-col max-h-[82vh] overflow-hidden focus:outline-none"
      >
        {/* Search Input Header */}
        <div className="px-4 py-3.5 border-b border-hairline bg-paper flex items-center gap-3">
          <Search className="w-4 h-4 text-ochre shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded="true"
            aria-controls="course-palette-listbox"
            aria-autocomplete="list"
            aria-activedescendant={
              filteredItems[selectedIndex]
                ? `palette-opt-${filteredItems[selectedIndex].id}`
                : undefined
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar tema, laboratorio 3D, reino, fósil o término (ej. bipedismo, Malí, abuela)..."
            aria-label="Buscar contenidos del Módulo I"
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-muted focus:outline-none min-w-0"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar buscador rápido"
            className="min-h-[34px] min-w-[34px] inline-flex items-center justify-center rounded border border-hairline bg-canvas text-ink hover:border-ink cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-4 py-2 border-b border-hairline bg-canvas flex flex-wrap items-center gap-1.5">
          {CATEGORY_TABS.map((tab) => {
            const isActive = category === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategory(tab.id)}
                aria-pressed={isActive}
                className={`min-h-[32px] px-2.5 py-1 font-mono text-[11px] rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-ink text-white border-ink'
                    : 'bg-paper text-ink-muted border-hairline hover:border-ink hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Quick Block Jump Strip when query is empty */}
        {!query && category === 'todo' && (
          <div className="px-4 py-2.5 border-b border-hairline bg-paper/60 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
            <span className="font-mono text-[10.5px] text-ink-muted">Saltar a bloque:</span>
            {COURSE_BLOCKS.map((blk) => (
              <button
                key={blk.id}
                type="button"
                onClick={() => {
                  onNavigate({ sectionId: blk.chapterIds[0] });
                  onClose();
                }}
                className="font-mono text-[11px] text-ink hover:text-ochre underline underline-offset-4 decoration-hairline hover:decoration-ochre cursor-pointer whitespace-nowrap"
              >
                {blk.roman}. {blk.shortTitle}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div
          ref={listRef}
          id="course-palette-listbox"
          role="listbox"
          aria-label="Resultados de búsqueda del Módulo I"
          className="overflow-y-auto flex-1 divide-y divide-hairline"
        >
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center gap-2">
              <p className="font-display text-base font-semibold text-ink m-0">
                No hay coincidencias para «{query}»
              </p>
              <p className="text-xs text-ink-muted m-0 max-w-md">
                Prueba con términos como «biomecánica», «etología», «parentesco», «Malí», «reloj
                24h», «paleobotánica» o cambia el filtro superior a «Todo».
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  id={`palette-opt-${item.id}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  data-selected={isSelected ? 'true' : undefined}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    onNavigate(item.action);
                    onClose();
                  }}
                  className={`w-full px-4 py-3 text-left flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-ochre-soft/65' : 'bg-canvas hover:bg-paper'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5">{renderCategoryIcon(item.category)}</div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="font-mono text-[11px] text-ochre font-medium whitespace-nowrap">
                          {item.categoryLabel}
                        </span>
                        <span className="text-sm font-semibold text-ink leading-snug">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted leading-snug line-clamp-1 m-0">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-center">
                    <span className="hidden sm:inline font-mono text-[11px] text-ink-muted whitespace-nowrap">
                      {item.meta}
                    </span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? 'text-ochre translate-x-0.5' : 'text-ink-subtle'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Quiet Keyboard Hint Footer */}
        <div className="px-4 py-2 border-t border-hairline bg-paper flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-ink-muted">
          <span aria-live="polite">
            {filteredItems.length} resultados · Usa ↑↓ para elegir y Enter para saltar
          </span>
          <span>Atajo global: Ctrl+K · Esc para cerrar</span>
        </div>
      </div>
    </div>
  );
}
