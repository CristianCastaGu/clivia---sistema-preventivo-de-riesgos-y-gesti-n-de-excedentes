import { WeatherAlert, CropPlot, FoodBankCenter, CitizenIncident, SurplusTransaction, EmergencyContact, ResponseProtocol, SurplusListing } from "../types";

export const INITIAL_ALERTS: WeatherAlert[] = [
  {
    id: "alt-01",
    title: "Alerta Crítica: Helada Agronómica Severa (-3°C)",
    threatType: "helada",
    severity: "rojo",
    region: "Valle Central - Altiplano",
    municipality: "Huamantla / San Salvador",
    coordinates: [19.32, -97.92],
    validUntil: "Próximas 36 horas",
    forecastSummary: "Masa de aire polar descenderá bruscamente durante la madrugada. Se prevé escarcha y daño por congelamiento en cultivos no protegidos.",
    temperature: { min: -3, max: 14 },
    precipitationProb: 5,
    windSpeed: 28,
    protocolRecommendations: [
      "Activar riego por aspersión preventivo antes del ocaso para elevar temperatura foliar.",
      "Desplegar cubiertas térmicas de polipropileno en hortalizas y semilleros.",
      "Iniciar protocolo de cosecha anticipada urgente en parcelas con más del 80% de maduración.",
      "Notificar excedente al Banco de Alimentos Central para logística refrigerada."
    ],
    affectedCrops: ["Maíz tardío", "Tomate", "Calabacita", "Fresa"],
    affectedPopulationEstimate: 14200
  },
  {
    id: "alt-02",
    title: "Alerta Naranja: Crecida de Río y Lluvias Torrenciales",
    threatType: "inundacion",
    severity: "amarillo",
    region: "Costa y Cuenca Baja",
    municipality: "San Pedro Amuzgos / Río Grande",
    coordinates: [16.48, -98.15],
    validUntil: "Próximas 48 horas",
    forecastSummary: "Onda tropical generará precipitaciones acumuladas de 95 mm en 24h con alta probabilidad de desbordamiento en zonas bajas.",
    temperature: { min: 21, max: 29 },
    precipitationProb: 88,
    windSpeed: 42,
    protocolRecommendations: [
      "Limpiar zanjas perimetrales y compuertas de drenaje en tierras de cultivo.",
      "Poner a resguardo bombas de riego, insumos químicos y ganado en cotas altas.",
      "Verificar albergue comunitario habilitado en Escuela Benito Juárez."
    ],
    affectedCrops: ["Plátano", "Caña de Azúcar", "Papaya", "Hortalizas de hoja"],
    affectedPopulationEstimate: 8750
  },
  {
    id: "alt-03",
    title: "Monitoreo Preventivo: Estrés Hídrico y Ola de Calor",
    threatType: "sequia",
    severity: "amarillo",
    region: "Zona Norte / Bajío Seco",
    municipality: "Dolores Hidalgo / San Felipe",
    coordinates: [21.15, -100.93],
    validUntil: "7 días",
    forecastSummary: "Racha sostenida de 5 días con temperaturas superiores a 36°C y radiación UV extrema. Humedad de suelo por debajo del 18%.",
    temperature: { min: 16, max: 37 },
    precipitationProb: 0,
    windSpeed: 15,
    protocolRecommendations: [
      "Programar riegos nocturnos o en primeras horas del amanecer para minimizar evapotranspiración.",
      "Aplicar acolchado orgánico (mulch) para conservar humedad radicular.",
      "Optimizar uso de represas comunitarias coordinado con autoridades ejidales."
    ],
    affectedCrops: ["Frijol", "Sorgo", "Trigo", "Alfalfa"],
    affectedPopulationEstimate: 22000
  },
  {
    id: "alt-04",
    title: "Condiciones Estables y Óptimas",
    threatType: "granizo",
    severity: "verde",
    region: "Sierra Occidental",
    municipality: "Mascota / Talpa",
    coordinates: [20.53, -104.78],
    validUntil: "4 días",
    forecastSummary: "Cielos despejados con vientos calmos y humedad relativa en rangos ideales para la floración.",
    temperature: { min: 14, max: 26 },
    precipitationProb: 10,
    windSpeed: 10,
    protocolRecommendations: [
      "Continuar monitoreo rutinario de plagas y fertilización foliar.",
      "Mantener actualizado el registro fenológico en el módulo de parcelas."
    ],
    affectedCrops: ["Aguacate", "Café de Sombra", "Zarzamora"],
    affectedPopulationEstimate: 6100
  }
];

export const INITIAL_PLOTS: CropPlot[] = [
  {
    id: "plot-01",
    name: "Parcela La Providencia - Lote A",
    farmerName: "Don Mateo Ramírez",
    cropType: "Maíz Blanco Criollo",
    cropCategory: "granos",
    hectares: 8.5,
    estimatedYieldTons: 34.0,
    plantingDate: "2025-05-10",
    estimatedHarvestDate: "2025-10-25",
    phenologicalStage: "madurez_cosecha",
    riskLevel: "rojo",
    currentThreat: "helada",
    locationName: "Huamantla, Tlaxcala",
    coordinates: [19.31, -97.91],
    moistureLevel: 42,
    status: "cosecha_anticipada_activa"
  },
  {
    id: "plot-02",
    name: "Rancho El Huerto - Invernaderos 1 y 2",
    farmerName: "María Elena Fuentes",
    cropType: "Tomate Saladette",
    cropCategory: "hortalizas",
    hectares: 3.2,
    estimatedYieldTons: 48.0,
    plantingDate: "2025-06-15",
    estimatedHarvestDate: "2025-11-05",
    phenologicalStage: "llenado_grano",
    riskLevel: "amarillo",
    currentThreat: "helada",
    locationName: "San Salvador el Verde, Puebla",
    coordinates: [19.34, -98.51],
    moistureLevel: 68,
    status: "alerta_preventiva"
  },
  {
    id: "plot-03",
    name: "Finca Cafetalera Las Nubes",
    farmerName: "Carlos Albarrán",
    cropType: "Café Arábica de Altura",
    cropCategory: "frutas",
    hectares: 12.0,
    estimatedYieldTons: 18.5,
    plantingDate: "2024-03-01",
    estimatedHarvestDate: "2025-12-10",
    phenologicalStage: "floracion",
    riskLevel: "verde",
    locationName: "Coatepec, Veracruz",
    coordinates: [19.45, -96.95],
    moistureLevel: 75,
    status: "optimo"
  },
  {
    id: "plot-04",
    name: "Agropecuaria San Jerónimo",
    farmerName: "Teresa Solís",
    cropType: "Fresa Festival",
    cropCategory: "frutas",
    hectares: 4.5,
    estimatedYieldTons: 22.0,
    plantingDate: "2025-07-01",
    estimatedHarvestDate: "2025-10-30",
    phenologicalStage: "madurez_cosecha",
    riskLevel: "rojo",
    currentThreat: "helada",
    locationName: "Irapuato / Valle de Santiago",
    coordinates: [20.52, -101.21],
    moistureLevel: 55,
    status: "excedente_despachado"
  },
  {
    id: "plot-05",
    name: "Parcela Los Mangos",
    farmerName: "Roberto Gómez",
    cropType: "Papaya Maradol",
    cropCategory: "frutas",
    hectares: 6.0,
    estimatedYieldTons: 38.0,
    plantingDate: "2025-01-20",
    estimatedHarvestDate: "2025-11-15",
    phenologicalStage: "llenado_grano",
    riskLevel: "amarillo",
    currentThreat: "inundacion",
    locationName: "San Pedro Pochutla, Oaxaca",
    coordinates: [15.74, -96.46],
    moistureLevel: 82,
    status: "alerta_preventiva"
  }
];

export const INITIAL_FOOD_BANKS: FoodBankCenter[] = [
  {
    id: "fb-01",
    name: "Banco de Alimentos Regional Altiplano",
    type: "banco_alimentos",
    contactPerson: "Lic. Andrea Morales",
    phone: "+52 246 462 8900",
    address: "Parque Industrial Xicohténcatl II, Nave 4",
    region: "Valle Central",
    coordinates: [19.33, -97.90],
    storageCapacityTons: 120,
    currentStockTons: 42,
    refrigerationAvailable: true,
    urgentNeeds: ["Hortalizas frescas", "Granos básicos", "Tubérculos"],
    beneficiariesServedDaily: 3400
  },
  {
    id: "fb-02",
    name: "Comedor Comunitario Esperanza y Vida",
    type: "comedor_comunitario",
    contactPerson: "Padre Gabriel Luna",
    phone: "+52 222 555 1290",
    address: "Calle Hidalgo #45, Barrio San Sebastián",
    region: "Puebla - Tlaxcala",
    coordinates: [19.29, -98.22],
    storageCapacityTons: 15,
    currentStockTons: 4.5,
    refrigerationAvailable: true,
    urgentNeeds: ["Frutas de temporada", "Tomate y cebolla", "Legumbres"],
    beneficiariesServedDaily: 680
  },
  {
    id: "fb-03",
    name: "Albergue y Refugio Temporal Los Olivos",
    type: "albergue_temporal",
    contactPerson: "Dra. Sofía Castillo (Protección Civil)",
    phone: "+52 954 102 3344",
    address: "Auditorio Municipal Bicentenario",
    region: "Costa Sur",
    coordinates: [16.49, -98.14],
    storageCapacityTons: 25,
    currentStockTons: 8,
    refrigerationAvailable: false,
    urgentNeeds: ["Agua embotellada", "Alimentos no perecederos", "Fruta lista para consumo"],
    beneficiariesServedDaily: 1200
  },
  {
    id: "fb-04",
    name: "Centro de Acopio y Redistribución Bajío",
    type: "centro_acopio",
    contactPerson: "Ing. Jorge Villaseñor",
    phone: "+52 462 624 7711",
    address: "Km 12 Carretera Federal Irapuato-Silao",
    region: "Bajío",
    coordinates: [20.67, -101.35],
    storageCapacityTons: 200,
    currentStockTons: 95,
    refrigerationAvailable: true,
    urgentNeeds: ["Fresa", "Brócoli", "Zanahoria", "Calabaza"],
    beneficiariesServedDaily: 8900
  }
];

export const INITIAL_INCIDENTS: CitizenIncident[] = [
  {
    id: "inc-01",
    title: "Escorrentía bloqueando camino saca-cosechas",
    threatType: "inundacion",
    severity: "amarillo",
    description: "Creciente de arroyo inundó 200 metros de la terracería que conecta las parcelas ejidales con la carretera federal. Camiones de carga no pueden pasar.",
    locationName: "Camino Ejidal La Laja Km 3.4",
    coordinates: [16.50, -98.16],
    reportedBy: "Comisariado Ejidal Juan M.",
    role: "Productor",
    timestamp: "Hace 45 minutos",
    status: "en_verificacion",
    votes: 18
  },
  {
    id: "inc-02",
    title: "Ráfaga de viento derribó poste y tendido eléctrico",
    threatType: "vendaval",
    severity: "rojo",
    description: "Viento superior a 60 km/h tiró cableado sobre el pozo de riego número 4. Se requiere apoyo de CFE y Protección Civil para evitar riesgo y reactivar bombeo.",
    locationName: "Carretera Huamantla-Ixtenco",
    coordinates: [19.28, -97.89],
    reportedBy: "Lucía Morales (Vecina)",
    role: "Ciudadano",
    timestamp: "Hace 2 horas",
    status: "reportado",
    votes: 34
  },
  {
    id: "inc-03",
    title: "Helada incipiente registrada en termómetro de campo",
    threatType: "helada",
    severity: "rojo",
    description: "La estación agrometeorológica local marca 0.5°C a las 05:30 am con rocío congelado visible sobre forrajes.",
    locationName: "Rancho El Tejocote",
    coordinates: [19.35, -97.94],
    reportedBy: "Ing. Agrónomo David C.",
    role: "Productor",
    timestamp: "Hace 3 horas",
    status: "atendido",
    votes: 12
  }
];

export const INITIAL_TRANSACTIONS: SurplusTransaction[] = [
  {
    id: "trx-101",
    plotId: "plot-04",
    cropName: "Fresa Festival",
    farmerName: "Teresa Solís",
    rescuedTons: 14.5,
    destinationCenterId: "fb-04",
    destinationCenterName: "Centro de Acopio y Redistribución Bajío",
    threatTrigger: "helada",
    timestamp: "Hoy 08:30 AM",
    status: "entregado",
    estimatedCo2SavedKg: 3625,
    mealsGenerated: 18125,
    taxVoucherCode: "CLIVIA-SAT-2025-99824A"
  },
  {
    id: "trx-102",
    plotId: "plot-01",
    cropName: "Maíz Blanco Criollo",
    farmerName: "Don Mateo Ramírez",
    rescuedTons: 22.0,
    destinationCenterId: "fb-01",
    destinationCenterName: "Banco de Alimentos Regional Altiplano",
    threatTrigger: "helada",
    timestamp: "Hoy 06:15 AM",
    status: "en_camino",
    estimatedCo2SavedKg: 5500,
    mealsGenerated: 33000,
    taxVoucherCode: "CLIVIA-SAT-2025-77412B"
  }
];

// Directorio de emergencia — referencia Tocancipá / Sabana Centro, Cundinamarca.
export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: "ec-01",
    name: "Línea Nacional de Emergencias",
    category: "gestion_riesgo",
    detail: "Despacho unificado 24/7",
    phone: "123",
    distanceKm: 0,
    priority: "alta"
  },
  {
    id: "ec-02",
    name: "Bomberos Tocancipá",
    category: "bomberos",
    detail: "Estación central",
    phone: "(601) 856 0202",
    distanceKm: 2.4,
    priority: "alta"
  },
  {
    id: "ec-03",
    name: "Hospital San Rafael Tocancipá",
    category: "salud",
    detail: "Urgencias 24 horas",
    phone: "(601) 856 0110",
    distanceKm: 3.1,
    priority: "alta"
  },
  {
    id: "ec-04",
    name: "Policía Nacional — Estación Tocancipá",
    category: "policia",
    detail: "Cuadrante rural y urbano",
    phone: "(601) 856 0055",
    distanceKm: 2.8,
    priority: "media"
  },
  {
    id: "ec-05",
    name: "UNGRD — Unidad Nacional de Gestión del Riesgo",
    category: "gestion_riesgo",
    detail: "Coordinación Cundinamarca",
    phone: "018000 111 519",
    distanceKm: 32,
    priority: "media"
  },
  {
    id: "ec-06",
    name: "CAR Cundinamarca",
    category: "ambiental",
    detail: "Emergencias ambientales y de cuencas",
    phone: "(601) 320 9000",
    distanceKm: 28,
    priority: "media"
  }
];

export const RESPONSE_PROTOCOLS: ResponseProtocol[] = [
  {
    id: "rp-helada",
    threatType: "helada",
    title: "Helada agronómica",
    steps: [
      "Activar riego por aspersión antes del anochecer para elevar la temperatura foliar.",
      "Cubrir semilleros y hortalizas con manta térmica o rastrojo seco.",
      "Priorizar cosecha de lotes con más del 80% de maduración.",
      "Reportar el excedente esperado desde el chat de CLIVIA para activar el motor de excedentes."
    ]
  },
  {
    id: "rp-inundacion",
    threatType: "inundacion",
    title: "Creciente / inundación",
    steps: [
      "Despejar zanjas y canales de drenaje perimetrales a la parcela.",
      "Poner a resguardo insumos, semillas y maquinaria en cotas altas.",
      "Verificar el estado de vías de acceso antes de movilizar carga.",
      "Ubicar el albergue temporal habilitado más cercano en el mapa."
    ]
  },
  {
    id: "rp-vendaval",
    threatType: "vendaval",
    title: "Vendaval / ráfagas fuertes",
    steps: [
      "Asegurar cubiertas, invernaderos y estructuras livianas.",
      "Alejar del cultivo cualquier maquinaria o material suelto.",
      "Reportar postes o tendido eléctrico caído a la línea 123.",
      "Suspender labores de fumigación y aspersión hasta que pase el evento."
    ]
  }
];

// Excedentes visibles en el marketplace — visibilidad entre productores y receptores.
export const INITIAL_SURPLUS_LISTINGS: SurplusListing[] = [
  {
    id: "sl-01",
    plotId: "plot-01",
    farmerName: "Don Mateo Ramírez",
    cropName: "Maíz Blanco Criollo",
    quantityLabel: "22 toneladas",
    locationName: "Huamantla, Tlaxcala",
    distanceKm: 5,
    expiresInLabel: "Vence en 48h",
    urgency: "rojo",
    priceLabel: "Precio de mercado",
    imageEmoji: "🌽"
  },
  {
    id: "sl-02",
    plotId: "plot-02",
    farmerName: "María Elena Fuentes",
    cropName: "Tomate Saladette",
    quantityLabel: "15 canastillas (~300 kg)",
    locationName: "San Salvador el Verde, Puebla",
    distanceKm: 12,
    expiresInLabel: "Vence en 72h",
    urgency: "amarillo",
    priceLabel: "$2.400/kg",
    imageEmoji: "🍅"
  },
  {
    id: "sl-03",
    plotId: "plot-04",
    farmerName: "Teresa Solís",
    cropName: "Fresa Festival",
    quantityLabel: "20 bins (~800 kg)",
    locationName: "Irapuato / Valle de Santiago",
    distanceKm: 22,
    expiresInLabel: "Vence en 24h",
    urgency: "rojo",
    priceLabel: "$5.100/kg",
    imageEmoji: "🍓"
  },
  {
    id: "sl-04",
    plotId: "plot-05",
    farmerName: "Roberto Gómez",
    cropName: "Papaya Maradol",
    quantityLabel: "3.5 toneladas",
    locationName: "San Pedro Pochutla, Oaxaca",
    distanceKm: 45,
    expiresInLabel: "Vence en 5 días",
    urgency: "verde",
    priceLabel: "$1.800/kg",
    imageEmoji: "🍈"
  }
];
