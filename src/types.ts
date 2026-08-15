export type UserRole = "ciudadano" | "productor" | "autoridad" | "ong_banco";

export type AlertSeverity = "verde" | "amarillo" | "rojo";

export type ThreatType = "helada" | "inundacion" | "sequia" | "incendio" | "granizo" | "vendaval" | "plaga";

export interface WeatherAlert {
  id: string;
  title: string;
  threatType: ThreatType;
  severity: AlertSeverity;
  region: string;
  municipality: string;
  coordinates: [number, number]; // [lat, lng] or [x, y] for custom map
  validUntil: string;
  forecastSummary: string;
  temperature?: { min: number; max: number };
  precipitationProb?: number;
  windSpeed?: number;
  protocolRecommendations: string[];
  affectedCrops: string[];
  affectedPopulationEstimate: number;
}

export interface CropPlot {
  id: string;
  name: string;
  farmerName: string;
  cropType: string;
  cropCategory: "granos" | "frutas" | "hortalizas" | "tuberculos" | "legumbres";
  hectares: number;
  estimatedYieldTons: number;
  plantingDate: string;
  estimatedHarvestDate: string;
  phenologicalStage: "germinacion" | "vegetativo" | "floracion" | "llenado_grano" | "madurez_cosecha";
  riskLevel: AlertSeverity;
  currentThreat?: ThreatType;
  locationName: string;
  coordinates: [number, number];
  moistureLevel: number; // percentage
  status: "optimo" | "alerta_preventiva" | "cosecha_anticipada_activa" | "excedente_despachado";
}

export interface FoodBankCenter {
  id: string;
  name: string;
  type: "banco_alimentos" | "comedor_comunitario" | "albergue_temporal" | "centro_acopio";
  contactPerson: string;
  phone: string;
  address: string;
  region: string;
  coordinates: [number, number];
  storageCapacityTons: number;
  currentStockTons: number;
  refrigerationAvailable: boolean;
  urgentNeeds: string[];
  beneficiariesServedDaily: number;
}

export interface MapMarker {
  id: string;
  type: "alerta" | "parcela" | "albergue" | "banco" | "incidente";
  title: string;
  subtitle: string;
  severity?: AlertSeverity;
  coordinates: [number, number];
  data?: any;
}

export interface CitizenIncident {
  id: string;
  title: string;
  threatType: ThreatType;
  severity: AlertSeverity;
  description: string;
  locationName: string;
  coordinates: [number, number];
  reportedBy: string;
  role: string;
  timestamp: string;
  imageUrl?: string;
  status: "reportado" | "en_verificacion" | "atendido";
  votes: number;
}

export interface SurplusTransaction {
  id: string;
  plotId: string;
  cropName: string;
  farmerName: string;
  rescuedTons: number;
  destinationCenterId: string;
  destinationCenterName: string;
  threatTrigger: ThreatType;
  timestamp: string;
  status: "programado" | "en_camino" | "entregado" | "distribuido";
  estimatedCo2SavedKg: number;
  mealsGenerated: number;
  taxVoucherCode: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "clivia" | "system";
  text: string;
  timestamp: string;
  severityBadge?: AlertSeverity;
  suggestedActions?: string[];
  isStreaming?: boolean;
}
