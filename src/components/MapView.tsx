import React, { useState } from "react";
import { 
  MapPin, 
  Layers, 
  ShieldAlert, 
  Sprout, 
  Building2, 
  Truck, 
  AlertTriangle, 
  Navigation, 
  Phone, 
  CheckCircle2, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Info,
  ThermometerSnowflake,
  CloudRain,
  SunMedium
} from "lucide-react";
import { WeatherAlert, CropPlot, FoodBankCenter, CitizenIncident, AlertSeverity } from "../types";

interface MapViewProps {
  alerts: WeatherAlert[];
  plots: CropPlot[];
  foodBanks: FoodBankCenter[];
  incidents: CitizenIncident[];
  onOpenNewIncident: () => void;
  onNavigateToSurplus: (plot: CropPlot) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  alerts,
  plots,
  foodBanks,
  incidents,
  onOpenNewIncident,
  onNavigateToSurplus,
}) => {
  // Layer visibility toggles
  const [showThreatZones, setShowThreatZones] = useState(true);
  const [showPlots, setShowPlots] = useState(true);
  const [showFoodBanks, setShowFoodBanks] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);

  // Selected item for detail drawer
  const [selectedItem, setSelectedItem] = useState<{ type: string; data: any } | null>({
    type: "alerta",
    data: alerts[0]
  });

  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeRegionView, setActiveRegionView] = useState("nacional");

  // Region preset coordinates / focal points
  const regions = [
    { id: "nacional", name: "Vista General Nacional" },
    { id: "valle_central", name: "Valle Central / Tlaxcala - Puebla" },
    { id: "bajio", name: "Bajío / Guanajuato - Querétaro" },
    { id: "costa_sur", name: "Costa Sur / Oaxaca - Guerrero" },
    { id: "veracruz", name: "Sierra Oriental / Veracruz" }
  ];

  return (
    <div className="space-y-4 pb-12 animate-in fade-in">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Mapa Geoespacial de Riesgos y Recursos Logísticos</span>
          </h2>
          <p className="text-xs text-slate-500">
            Visualización integrada de polígonos de alerta, cultivos vulnerables, albergues y centros de acopio.
          </p>
        </div>

        {/* Region Quick Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={activeRegionView}
            onChange={(e) => setActiveRegionView(e.target.value)}
            className="text-xs font-semibold border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenNewIncident}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Reportar en Mapa</span>
          </button>
        </div>
      </div>

      {/* Main Map + Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Layer Toggles & Interactive Map Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative shadow-lg min-h-[520px] flex flex-col">
          {/* Top Layer Toggles Floating Bar */}
          <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 backdrop-blur p-1.5 rounded-xl border border-slate-700/80 pointer-events-auto shadow-md">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Capas:</span>
              
              <button
                onClick={() => setShowThreatZones(!showThreatZones)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                  showThreatZones ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <ShieldAlert className="w-3 h-3" />
                <span>Amenazas ({alerts.length})</span>
              </button>

              <button
                onClick={() => setShowPlots(!showPlots)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                  showPlots ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sprout className="w-3 h-3" />
                <span>Cultivos ({plots.length})</span>
              </button>

              <button
                onClick={() => setShowFoodBanks(!showFoodBanks)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                  showFoodBanks ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Building2 className="w-3 h-3" />
                <span>Albergues y Bancos ({foodBanks.length})</span>
              </button>

              <button
                onClick={() => setShowIncidents(!showIncidents)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                  showIncidents ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Incidentes ({incidents.length})</span>
              </button>
            </div>

            {/* Map Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur p-1 rounded-xl border border-slate-700 pointer-events-auto">
              <button
                onClick={() => setZoomLevel(Math.min(zoomLevel + 0.2, 1.8))}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="Acercar"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(Math.max(zoomLevel - 0.2, 0.8))}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="Alejar"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition text-xs font-mono"
                title="Restablecer"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
            </div>
          </div>

          {/* Interactive Graphic SVG Terrain Canvas */}
          <div className="flex-1 w-full h-full relative overflow-hidden bg-radial from-slate-900 via-slate-950 to-slate-950 flex items-center justify-center p-4">
            <svg
              className="w-full h-full max-w-4xl transition-transform duration-300 select-none cursor-grab active:cursor-grabbing"
              style={{ transform: `scale(${zoomLevel})` }}
              viewBox="0 0 800 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Threat Zone Gradients */}
                <radialGradient id="freezeThreatGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#2563eb" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="floodThreatGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#0891b2" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0e7490" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="droughtThreatGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="70%" stopColor="#d97706" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background Grid & Topography lines */}
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.4" />
              </pattern>
              <rect width="800" height="500" fill="url(#grid)" />

              {/* Stylized Mexico Region Outlines / Topographic Contours */}
              <path
                d="M 120 100 Q 200 80 340 120 T 520 180 T 680 280 T 600 420 T 420 380 T 260 320 T 140 220 Z"
                fill="#0f172a"
                stroke="#1e293b"
                strokeWidth="2"
              />
              <path
                d="M 180 140 Q 280 110 400 150 T 560 220 T 520 340 T 360 320 T 220 250 Z"
                fill="#131f37"
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Threat Heatmap Polygons */}
              {showThreatZones && (
                <g className="animate-pulse">
                  {/* Valle Central - Freeze Zone */}
                  <circle cx="430" cy="220" r="85" fill="url(#freezeThreatGrad)" />
                  <circle cx="430" cy="220" r="85" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="430" y="150" fill="#93c5fd" fontSize="10" fontWeight="bold" textAnchor="middle">
                    ❄️ ZONA HELADA (-3°C)
                  </text>

                  {/* Costa Sur - Flood Zone */}
                  <circle cx="490" cy="380" r="70" fill="url(#floodThreatGrad)" />
                  <circle cx="490" cy="380" r="70" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="490" y="445" fill="#67e8f9" fontSize="10" fontWeight="bold" textAnchor="middle">
                    🌧️ ZONA CRECIDA DE RÍO (95mm)
                  </text>

                  {/* Bajío - Drought Zone */}
                  <circle cx="310" cy="190" r="60" fill="url(#droughtThreatGrad)" />
                  <circle cx="310" cy="190" r="60" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="310" y="140" fill="#fcd34d" fontSize="10" fontWeight="bold" textAnchor="middle">
                    ☀️ ESTRÉS HÍDRICO (37°C)
                  </text>
                </g>
              )}

              {/* Logistics Corridors / Connecting Routes */}
              <path
                d="M 425 215 L 450 205 L 340 180"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="6 4"
                strokeOpacity="0.7"
              />
              <path
                d="M 425 215 L 485 375"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeOpacity="0.5"
              />

              {/* Interactive Markers: Plots (Green Sprout) */}
              {showPlots && (
                <g>
                  {/* Parcela 1: La Providencia (Under Threat) */}
                  <g
                    className="cursor-pointer transform hover:scale-125 transition-transform"
                    onClick={() => setSelectedItem({ type: "parcela", data: plots[0] })}
                  >
                    <circle cx="420" cy="210" r="14" fill="#ef4444" fillOpacity="0.2" className="animate-ping" />
                    <circle cx="420" cy="210" r="9" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                    <text x="420" y="235" fill="#fecaca" fontSize="9" fontWeight="bold" textAnchor="middle">
                      🌾 La Providencia (Maíz)
                    </text>
                  </g>

                  {/* Parcela 2: Rancho El Huerto (Tomate) */}
                  <g
                    className="cursor-pointer transform hover:scale-125 transition-transform"
                    onClick={() => setSelectedItem({ type: "parcela", data: plots[1] })}
                  >
                    <circle cx="400" cy="230" r="8" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="400" y="250" fill="#fef3c7" fontSize="8" fontWeight="bold" textAnchor="middle">
                      🍅 El Huerto (Tomate)
                    </text>
                  </g>

                  {/* Parcela 3: Cafetalera Las Nubes */}
                  <g
                    className="cursor-pointer transform hover:scale-125 transition-transform"
                    onClick={() => setSelectedItem({ type: "parcela", data: plots[2] })}
                  >
                    <circle cx="530" cy="210" r="8" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="530" y="228" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle">
                      ☕ Las Nubes (Café)
                    </text>
                  </g>

                  {/* Parcela 4: San Jerónimo (Fresa) */}
                  <g
                    className="cursor-pointer transform hover:scale-125 transition-transform"
                    onClick={() => setSelectedItem({ type: "parcela", data: plots[3] })}
                  >
                    <circle cx="330" cy="180" r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="330" y="200" fill="#fecaca" fontSize="8" fontWeight="bold" textAnchor="middle">
                      🍓 San Jerónimo (Fresa)
                    </text>
                  </g>
                </g>
              )}

              {/* Interactive Markers: Food Banks & Shelters */}
              {showFoodBanks && (
                <g>
                  {/* Banco Altiplano */}
                  <g
                    className="cursor-pointer transform hover:scale-125 transition-transform"
                    onClick={() => setSelectedItem({ type: "banco", data: foodBanks[0] })}
                  >
                    <rect x="445" y="195" width="18" height="18" rx="4" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                    <text x="454" y="208" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                      🏢
                    </text>
                    <text x="454" y="225" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle">
                      Banco Altiplano
                    </text>
                  </g>

                  {/* Comedor Comunitario */}
                  <g
                    className="cursor-pointer transform hover:scale-125 transition-transform"
                    onClick={() => setSelectedItem({ type: "banco", data: foodBanks[1] })}
                  >
                    <rect x="410" cy="250" y="250" width="16" height="16" rx="4" fill="#0891b2" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="418" y="262" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                      🍲
                    </text>
                    <text x="418" y="278" fill="#bae6fd" fontSize="8" fontWeight="bold" textAnchor="middle">
                      Comedor Esperanza
                    </text>
                  </g>

                  {/* Albergue Costa Sur */}
                  <g
                    className="cursor-pointer transform hover:scale-125 transition-transform"
                    onClick={() => setSelectedItem({ type: "banco", data: foodBanks[2] })}
                  >
                    <rect x="480" y="365" width="18" height="18" rx="4" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                    <text x="489" y="378" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                      🏠
                    </text>
                    <text x="489" y="395" fill="#c7d2fe" fontSize="8" fontWeight="bold" textAnchor="middle">
                      Albergue Los Olivos
                    </text>
                  </g>
                </g>
              )}

              {/* Interactive Markers: Incidents */}
              {showIncidents && (
                <g>
                  {/* Incidente 1 */}
                  <g
                    className="cursor-pointer transform hover:scale-125 transition-transform"
                    onClick={() => setSelectedItem({ type: "incidente", data: incidents[0] })}
                  >
                    <polygon points="475,350 485,370 465,370" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="475" y="366" fill="#000000" fontSize="8" fontWeight="black" textAnchor="middle">!</text>
                  </g>

                  {/* Incidente 2 */}
                  <g
                    className="cursor-pointer transform hover:scale-125 transition-transform"
                    onClick={() => setSelectedItem({ type: "incidente", data: incidents[1] })}
                  >
                    <polygon points="435,235 445,255 425,255" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="435" y="251" fill="#000000" fontSize="8" fontWeight="black" textAnchor="middle">!</text>
                  </g>
                </g>
              )}
            </svg>
          </div>

          {/* Bottom Map Legend */}
          <div className="bg-slate-900 border-t border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-semibold text-slate-400">Simbología:</span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-600 border border-white"></span>
                <span>Parcela en Riesgo Crítico</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-600 border border-white"></span>
                <span>Banco de Alimentos / Acopio</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-600 border border-white"></span>
                <span>Albergue Oficial</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-amber-500"></span>
                <span>Incidente Reportado</span>
              </span>
            </div>

            <span className="text-[11px] text-slate-400">
              * Haz clic en cualquier marcador para abrir ficha de acción
            </span>
          </div>
        </div>

        {/* Right Detail Inspector Drawer (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between space-y-4">
          {selectedItem ? (
            <div className="space-y-4">
              {/* Header of Inspector */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Ficha de Detalle
                  </span>
                  <span className="text-xs text-slate-400 capitalize">
                    {selectedItem.type}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic Content based on selected node */}
              {selectedItem.type === "parcela" && (
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 uppercase bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Riesgo {selectedItem.data.riskLevel.toUpperCase()}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{selectedItem.data.name}</h3>
                    <p className="text-xs text-slate-500">Titular: {selectedItem.data.farmerName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Cultivo:</span>
                      <strong className="text-slate-800">{selectedItem.data.cropType}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Superficie:</span>
                      <strong className="text-slate-800">{selectedItem.data.hectares} Hectáreas</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Cosecha estimada:</span>
                      <strong className="text-slate-800">{selectedItem.data.estimatedYieldTons} Toneladas</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Etapa:</span>
                      <strong className="text-slate-800 uppercase">{selectedItem.data.phenologicalStage.replace("_", " ")}</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Amenaza Activa: Helada Inminente (-3°C)
                    </span>
                    <p className="text-amber-800 text-[11px]">
                      Se recomienda iniciar cosecha anticipada preventiva en las próximas 36 horas para salvar hasta 28 toneladas.
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigateToSurplus(selectedItem.data)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Activar Protocolo de Cosecha y Excedente</span>
                  </button>
                </div>
              )}

              {selectedItem.type === "banco" && (
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {selectedItem.data.type.replace("_", " ").toUpperCase()}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{selectedItem.data.name}</h3>
                    <p className="text-xs text-slate-500">📍 {selectedItem.data.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Capacidad Bodega:</span>
                      <strong className="text-slate-800">{selectedItem.data.storageCapacityTons} Ton</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Stock actual:</span>
                      <strong className="text-slate-800">{selectedItem.data.currentStockTons} Ton</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Cámara fría:</span>
                      <strong className={selectedItem.data.refrigerationAvailable ? "text-emerald-700" : "text-slate-500"}>
                        {selectedItem.data.refrigerationAvailable ? "Disponible" : "No"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Beneficiarios/día:</span>
                      <strong className="text-slate-800">{selectedItem.data.beneficiariesServedDaily.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <span className="font-semibold text-slate-700">Demanda prioritaria de alimentos:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.data.urgentNeeds.map((n: string, i: number) => (
                        <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={`tel:${selectedItem.data.phone}`}
                      className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{selectedItem.data.phone}</span>
                    </a>
                  </div>
                </div>
              )}

              {selectedItem.type === "alerta" && (
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-rose-700 uppercase bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Boletín Oficial
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedItem.data.title}</h3>
                    <p className="text-xs text-slate-500">Región: {selectedItem.data.region}</p>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl leading-relaxed">
                    {selectedItem.data.forecastSummary}
                  </p>

                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-900">Medidas de Protección Civil:</span>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                      {selectedItem.data.protocolRecommendations.slice(0, 3).map((r: string, idx: number) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {selectedItem.type === "incidente" && (
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Incidente Ciudadano
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedItem.data.title}</h3>
                    <p className="text-xs text-slate-500">Reportó: {selectedItem.data.reportedBy} ({selectedItem.data.timestamp})</p>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl">
                    "{selectedItem.data.description}"
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500">Estado: <strong className="text-amber-700">{selectedItem.data.status}</strong></span>
                    <span className="font-bold text-emerald-700">▲ {selectedItem.data.votes} confirmaciones</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <MapPin className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs">Selecciona un marcador en el mapa para inspeccionar sus datos.</p>
            </div>
          )}

          {/* Persistent Quick Help Box */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-700 font-medium">GPS y Radares Sincronizados</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">19.32°N, 97.92°W</span>
          </div>
        </div>
      </div>
    </div>
  );
};
