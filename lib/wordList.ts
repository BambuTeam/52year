export interface TritechWord {
  id: string;
  text: string;
  category?: "history" | "brand" | "country" | "value" | "client";
  year?: string;
  historyNote?: string;
  author?: string;
  plant?: string;
  country?: string;
  position: [number, number, number];
  color?: string;
  size?: number;
  isCustom?: boolean;
}

export const SWATCH_PALETTES = {
  blue: ["#0833a1", "#1e40af", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"],
  green: ["#09402c", "#064e3b", "#047857", "#059669", "#10b981", "#34d399", "#52b788"],
  monochrome: ["#ffffff", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280"],
};

export const HISTORICAL_TRITECH_DATA: Omit<TritechWord, "id" | "position">[] = [
  // 1970s: Foundation & Pioneers
  {
    text: "1976 GUATEMALA",
    category: "history",
    year: "1976",
    historyNote: "Nace la historia en Guatemala. El Ing. William Bickford asume la distribución de Mollub-Alloy.",
    color: "#60a5fa",
    size: 0.44,
  },
  {
    text: "LUBRICANTES METÁLICOS",
    category: "history",
    year: "1976",
    historyNote: "Primer nombre comercial de la empresa pionera en tecnología de lubricación con metales líquidos.",
    color: "#52b788",
    size: 0.38,
  },
  {
    text: "WM. BICKFORD",
    category: "history",
    year: "1976",
    historyNote: "Ing. William Bickford viaja a Los Ángeles para pactar la alianza inicial de lubricación.",
    color: "#93c5fd",
    size: 0.36,
  },
  {
    text: "MOLLUB-ALLOY",
    category: "brand",
    year: "1976",
    historyNote: "Tecnología innovadora de metales sólidos que prolongaba la vida de piezas industriales.",
    color: "#34d399",
    size: 0.4,
  },
  {
    text: "FEGUA",
    category: "client",
    year: "1977",
    historyNote: "Uno de nuestros primeros grandes clientes emblemáticos en el sector ferroviario.",
    color: "#0833a1",
    size: 0.32,
  },
  {
    text: "CERVECERÍA CENTROAMERICANA",
    category: "client",
    year: "1977",
    historyNote: "Cliente histórico clave que ha permanecido a nuestro lado por décadas.",
    color: "#3b82f6",
    size: 0.34,
  },
  {
    text: "CEMENTOS PROGRESO",
    category: "client",
    year: "1977",
    historyNote: "Alianza industrial histórica fundamental en el desarrollo de infraestructura regional.",
    color: "#60a5fa",
    size: 0.34,
  },
  {
    text: "ARMANDO VALIENTE",
    category: "history",
    year: "1978",
    historyNote: "Ing. Armando Valiente se une para liderar la visión de expansión en El Salvador.",
    color: "#d1d5db",
    size: 0.32,
  },

  // 1980s: Tech expansion & Lincoln
  {
    text: "TRIBOL",
    category: "brand",
    year: "1982",
    historyNote: "Nueva tecnología de lubricantes bajo la sombrilla ICI que amplió el portafolio industrial.",
    color: "#10b981",
    size: 0.38,
  },
  {
    text: "LINCOLN",
    category: "brand",
    year: "1983",
    historyNote: "Alianza estratégica en equipos de automatización para optimizar tareas de lubricación.",
    color: "#2563eb",
    size: 0.38,
  },
  {
    text: "GERARDO SALAZAR",
    category: "history",
    year: "1985",
    historyNote: "Desarrollo del mercado centroamericano incorporando oficialmente a Costa Rica al grupo.",
    color: "#9ca3af",
    size: 0.32,
  },
  {
    text: "COSTA RICA",
    category: "country",
    year: "1985",
    historyNote: "Apertura de operaciones consolidando la presencia en Centroamérica.",
    color: "#52b788",
    size: 0.36,
  },

  // 1990s: Mexico Consolidation & Castrol
  {
    text: "1993 MÉXICO",
    category: "history",
    year: "1993",
    historyNote: "Incursión en México comenzando en Córdoba, Veracruz con el sector azucarero.",
    color: "#3b82f6",
    size: 0.44,
  },
  {
    text: "SECTOR AZUCARERO",
    category: "history",
    year: "1993",
    historyNote: "Primer gran motor de crecimiento industrial en los ingenios de Córdoba y Huixtla.",
    color: "#059669",
    size: 0.36,
  },
  {
    text: "PICNOS",
    category: "brand",
    year: "1995",
    historyNote: "Empresa formada en alianza con LOF para abrir por completo el mercado industrial en México.",
    color: "#60a5fa",
    size: 0.36,
  },
  {
    text: "OPTIMOL",
    category: "brand",
    year: "1995",
    historyNote: "Prestigiosa marca alemana incorporada para fortalecer la lubricación de alta especialidad.",
    color: "#34d399",
    size: 0.34,
  },
  {
    text: "CASTROL JOINT VENTURE",
    category: "brand",
    year: "1996",
    historyNote: "Alianza estratégica que potenció el crecimiento exponencial en toda la región.",
    color: "#1e40af",
    size: 0.4,
  },

  // 2000s & 2010s: Metalworking, International Expansion & FUCHS
  {
    text: "METALWORKING",
    category: "history",
    year: "2008",
    historyNote: "Incursión estratégica en el sector de trabajo de metales impulsado por el auge automotriz.",
    color: "#2563eb",
    size: 0.38,
  },
  {
    text: "AUTOMOTRIZ",
    category: "history",
    year: "2008",
    historyNote: "Crecimiento de alta tecnología industrial abasteciendo las principales armadoras.",
    color: "#10b981",
    size: 0.36,
  },
  {
    text: "COLOMBIA (IQA)",
    category: "country",
    year: "2011",
    historyNote: "Adquisición de IQA en Colombia, recibidos con brazos abiertos en Sudamérica.",
    color: "#52b788",
    size: 0.38,
  },
  {
    text: "NICARAGUA & HONDURAS",
    category: "country",
    year: "2010",
    historyNote: "Formalización de operaciones oficiales en Centroamérica.",
    color: "#60a5fa",
    size: 0.34,
  },
  {
    text: "PANAMÁ & REP. DOMINICANA",
    category: "country",
    year: "2012",
    historyNote: "Expansión al Caribe y Panamá acompañando las solicitudes de nuestros clientes regionales.",
    color: "#3b82f6",
    size: 0.36,
  },
  {
    text: "2018 FUCHS",
    category: "brand",
    year: "2018",
    historyNote: "Nueva era con el líder mundial en lubricantes FUCHS, superando la meta de $20M+ en ventas.",
    color: "#34d399",
    size: 0.46,
  },
  {
    text: "$20M+ EN VENTAS",
    category: "history",
    year: "2026",
    historyNote: "Logro histórico financiero que demuestra la solidez y visión de liderazgo de Tritech.",
    color: "#ffffff",
    size: 0.44,
  },

  // Core Values & Philosophy
  {
    text: "CONFIANZA",
    category: "value",
    historyNote: "Base fundamental en la relación de más de 50 años con nuestros clientes y colaboradores.",
    color: "#ffffff",
    size: 0.48,
  },
  {
    text: "ALIADOS",
    category: "value",
    historyNote: "Más que un proveedor, un socio estratégico que incrementa la rentabilidad del cliente.",
    color: "#93c5fd",
    size: 0.46,
  },
  {
    text: "RENTABILIDAD",
    category: "value",
    historyNote: "Filosofía Tritech: reducir costos y maximizar la vida útil de equipos industriales.",
    color: "#10b981",
    size: 0.38,
  },
  {
    text: "RESILIENCIA",
    category: "value",
    historyNote: "Capacidad de convertir cada obstáculo político o de mercado en una gran oportunidad.",
    color: "#3b82f6",
    size: 0.38,
  },
  {
    text: "OPTIMIZACIÓN",
    category: "value",
    historyNote: "Uso eficiente de tecnología y automatización en tareas de lubricación.",
    color: "#52b788",
    size: 0.36,
  },
  {
    text: "INNOVACIÓN",
    category: "value",
    historyNote: "Pioneros en introducir tecnologías revolucionarias desde 1976.",
    color: "#ffffff",
    size: 0.44,
  },
  {
    text: "PASIÓN Y CRECIMIENTO",
    category: "value",
    historyNote: "Espíritu que impulsa los primeros 52 años y prepara el futuro hacia los próximos 50.",
    color: "#60a5fa",
    size: 0.44,
  },
  {
    text: "EXCELENCIA",
    category: "value",
    historyNote: "Compromiso de calidad técnica e ingeniería humana en cada operación.",
    color: "#34d399",
    size: 0.38,
  },
];

function generateHistorical52Constellation(): TritechWord[] {
  const result: TritechWord[] = [];
  let idCounter = 0;

  const allSwatches = [
    ...SWATCH_PALETTES.blue,
    ...SWATCH_PALETTES.green,
    ...SWATCH_PALETTES.monochrome,
  ];

  // Distribute all 28 core historical items evenly into 3 spacious 3D orbital rings
  const totalItems = HISTORICAL_TRITECH_DATA.length;
  const innerCount = 8;
  const middleCount = 10;
  const outerCount = totalItems - innerCount - middleCount; // 10

  // 1. Inner Ring (Radius 6.4) - Generous spatial clearance around central core
  for (let i = 0; i < innerCount; i++) {
    const item = HISTORICAL_TRITECH_DATA[i];
    const angle = (i / innerCount) * Math.PI * 2;
    const radius = 6.4;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.7;
    const z = Math.sin(angle * 2) * 1.5;

    result.push({
      ...item,
      id: `orb-inner-${idCounter++}`,
      position: [x, y, z],
      color: allSwatches[i % allSwatches.length],
    });
  }

  // 2. Middle Ring (Radius 9.0)
  for (let i = 0; i < middleCount; i++) {
    const item = HISTORICAL_TRITECH_DATA[innerCount + i];
    const angle = (i / middleCount) * Math.PI * 2 + 0.35;
    const radius = 9.0;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.75;
    const z = Math.cos(angle * 2) * 2.0;

    result.push({
      ...item,
      id: `orb-mid-${idCounter++}`,
      position: [x, y, z],
      color: allSwatches[(i + 3) % allSwatches.length],
    });
  }

  // 3. Outer Ring (Radius 11.8)
  for (let i = 0; i < outerCount; i++) {
    const item = HISTORICAL_TRITECH_DATA[innerCount + middleCount + i];
    const angle = (i / outerCount) * Math.PI * 2 + 0.65;
    const radius = 11.8;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.8;
    const z = Math.sin(angle * 3) * 2.4;

    result.push({
      ...item,
      id: `orb-outer-${idCounter++}`,
      position: [x, y, z],
      color: allSwatches[(i + 6) % allSwatches.length],
    });
  }

  return result;
}

export const INITIAL_TRITECH_WORDS = generateHistorical52Constellation();

export const SAFE_TRITECH_PHRASES: string[] = [
  "52 AÑOS DE LIDERAZGO",
  "EXCELENCIA EN LUBRICACIÓN",
  "CONFIANZA INDUSTRIAL",
  "ALIADOS ESTRATÉGICOS",
  "INNOVACIÓN CONTINUA",
  "TECNOLOGÍA FUCHS",
  "PASIÓN Y CRECIMIENTO",
  "RESILIENCIA Y SOLIDEZ",
  "RENTABILIDAD GARANTIZADA",
  "SOCIOS DE VALOR",
  "CALIDAD HUMANA",
  "DESARROLLO REGIONAL",
  "FUTURO Y VANGUARDIA",
  "LUBRICACIÓN DE ALTA ESPECIALIDAD",
  "AUTOMATIZACIÓN LINCOLN",
  "INGENIERÍA APLICADA",
];

