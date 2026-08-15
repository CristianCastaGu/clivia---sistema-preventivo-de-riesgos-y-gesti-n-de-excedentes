import React, { useState, useEffect } from "react";
import { 
  Sprout, 
  Plus, 
  AlertTriangle, 
  Truck, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  FileText, 
  QrCode, 
  TrendingUp, 
  Heart,
  Droplets,
  Calendar,
  X,
  ThermometerSnowflake,
  ShieldCheck
} from "lucide-react";
import { CropPlot, FoodBankCenter, SurplusTransaction, ThreatType } from "../types";

interface CultivationModuleProps {
  plots: CropPlot[];
  setPlots: React.Dispatch<React.SetStateAction<CropPlot[]>>;
  foodBanks: FoodBankCenter[];
  transactions: SurplusTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<SurplusTransaction[]>>;
  preselectedPlot?: CropPlot | null;
}

export const CultivationModule: React.FC<CultivationModuleProps> = ({
  plots,
  setPlots,
  foodBanks,
  transactions,
  setTransactions,
  preselectedPlot,
}) => {
  // Active selected plot for surplus engine
  const [selectedPlot, setSelectedPlot] = useState<CropPlot>(
    preselectedPlot || plots[0]
  );

  // When preselectedPlot changes from other components
  useEffect(() => {
    if (preselectedPlot) {
      setSelectedPlot(preselectedPlot);
    }
  }, [preselectedPlot]);

  // Surplus Simulation State
  const [threatInput, setThreatInput] = useState<ThreatType>("helada");
  const [urgencyDays, setUrgencyDays] = useState<number>(2);
  const [rescuePercentage, setRescuePercentage] = useState<number>(85);
  const [selectedFoodBankId, setSelectedFoodBankId] = useState<string>(foodBanks[0]?.id || "");
  const [isAnalyzingAI, setIsAnalyzingAI] = useState<boolean>(false);
  const [aiRiskAnalysis, setAiRiskAnalysis] = useState<any | null>(null);
  const [generatedVoucher, setGeneratedVoucher] = useState<SurplusTransaction | null>(null);

  // New plot modal
  const [showNewPlotModal, setShowNewPlotModal] = useState(false);
  const [newPlotForm, setNewPlotForm] = useState({
    name: "",
    farmerName: "Don Mateo Ramírez",
    cropType: "Maíz Blanco Criollo",
    cropCategory: "granos" as const,
    hectares: 5,
    estimatedYieldTons: 20,
    plantingDate: "2025-05-01",
    estimatedHarvestDate: "2025-10-30",
    phenologicalStage: "madurez_cosecha" as const,
    locationName: "Valle Central, Tlaxcala"
  });

  // Calculate surplus numbers
  const calculatedRescuedTons = Number(((selectedPlot.estimatedYieldTons * rescuePercentage) / 100).toFixed(1));
  const mealsGenerated = Math.round(calculatedRescuedTons * 1000 * 2.5); // 2.5 meals per kg
  const co2SavedKg = Math.round(calculatedRescuedTons * 250); // 250kg CO2 avoided per ton
  const selectedFoodBank = foodBanks.find(fb => fb.id === selectedFoodBankId) || foodBanks[0];

  // Trigger AI Risk Analysis
  const handleAnalyzeWithGemini = async () => {
    setIsAnalyzingAI(true);
    setAiRiskAnalysis(null);
    try {
      const res = await fetch("/api/gemini/analyze-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropType: selectedPlot.cropType,
          hectares: selectedPlot.hectares,
          region: selectedPlot.locationName,
          forecastEvent: `Alerta inminente de ${threatInput} en ${urgencyDays} días`
        })
      });
      const data = await res.json();
      setAiRiskAnalysis(data);
      if (data.harvestRescuePotential) {
        setRescuePercentage(data.harvestRescuePotential);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  // Submit and finalize Surplus Rescue dispatch
  const handleCreateSurplusDispatch = () => {
    const newTrx: SurplusTransaction = {
      id: `trx-${Date.now().toString().slice(-4)}`,
      plotId: selectedPlot.id,
      cropName: selectedPlot.cropType,
      farmerName: selectedPlot.farmerName,
      rescuedTons: calculatedRescuedTons,
      destinationCenterId: selectedFoodBank.id,
      destinationCenterName: selectedFoodBank.name,
      threatTrigger: threatInput,
      timestamp: "Hace unos momentos",
      status: "en_camino",
      estimatedCo2SavedKg: co2SavedKg,
      mealsGenerated: mealsGenerated,
      taxVoucherCode: `CLIVIA-SAT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}X`
    };

    setTransactions([newTrx, ...transactions]);
    setGeneratedVoucher(newTrx);

    // Update plot status
    setPlots(prev => prev.map(p => p.id === selectedPlot.id ? { ...p, status: "cosecha_anticipada_activa" } : p));
  };

  const handleAddNewPlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlot: CropPlot = {
      id: `plot-${Date.now()}`,
      name: newPlotForm.name || "Nueva Parcela Ejidal",
      farmerName: newPlotForm.farmerName,
      cropType: newPlotForm.cropType,
      cropCategory: newPlotForm.cropCategory,
      hectares: Number(newPlotForm.hectares),
      estimatedYieldTons: Number(newPlotForm.estimatedYieldTons),
      plantingDate: newPlotForm.plantingDate,
      estimatedHarvestDate: newPlotForm.estimatedHarvestDate,
      phenologicalStage: newPlotForm.phenologicalStage,
      riskLevel: "amarillo",
      currentThreat: "helada",
      locationName: newPlotForm.locationName,
      coordinates: [19.32, -97.92],
      moistureLevel: 60,
      status: "alerta_preventiva"
    };

    setPlots([newPlot, ...plots]);
    setSelectedPlot(newPlot);
    setShowNewPlotModal(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            <span>Módulo Agrícola y Motor de Optimización de Excedentes</span>
          </h2>
          <p className="text-xs text-slate-500">
            Convierte alertas climáticas en cosechas preventivas y donaciones coordinadas a bancos de alimentos.
          </p>
        </div>

        <button
          onClick={() => setShowNewPlotModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Parcela</span>
        </button>
      </div>

      {/* Main Grid: Plots Carousel (Left) & Decision Engine (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: My Plots List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Parcelas Bajo Monitoreo ({plots.length})
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">Selecciona una</span>
            </div>

            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {plots.map((plot) => {
                const isSelected = selectedPlot.id === plot.id;
                return (
                  <button
                    key={plot.id}
                    onClick={() => {
                      setSelectedPlot(plot);
                      setGeneratedVoucher(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100/70"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{plot.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        plot.riskLevel === "rojo" ? "bg-rose-100 text-rose-800" :
                        plot.riskLevel === "amarillo" ? "bg-amber-100 text-amber-800" :
                        "bg-emerald-100 text-emerald-800"
                      }`}>
                        {plot.riskLevel}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-600">
                      <span>🌱 {plot.cropType}</span>
                      <span>•</span>
                      <span>{plot.hectares} ha</span>
                      <span>•</span>
                      <span>~{plot.estimatedYieldTons} Ton</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200/50">
                      <span>Etapa: <strong className="text-slate-700">{plot.phenologicalStage.replace("_", " ")}</strong></span>
                      <span className="font-semibold text-emerald-700">
                        {plot.status === "cosecha_anticipada_activa" ? "🚜 Rescate Activo" : "Monitoreo"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Surplus Decision & Redistribution Engine (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Plot Header Summary */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Motor de Excedentes Activo
                </span>
                <h3 className="text-lg font-extrabold text-white mt-1">
                  {selectedPlot.name} — {selectedPlot.cropType}
                </h3>
                <p className="text-xs text-slate-400">
                  Productor: {selectedPlot.farmerName} • Ubicación: {selectedPlot.locationName}
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Rendimiento Esperado</span>
                  <span className="text-base font-black text-emerald-400">{selectedPlot.estimatedYieldTons} Toneladas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Simulator Form & Calculations */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Simulador de Pérdida vs. Cosecha Anticipada Preventiva</span>
              </h4>

              <button
                onClick={handleAnalyzeWithGemini}
                disabled={isAnalyzingAI}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAnalyzingAI ? "Analizando con Gemini..." : "Optimizar con Gemini AI"}</span>
              </button>
            </div>

            {/* AI Risk Insight Callout if present */}
            {aiRiskAnalysis && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Diagnóstico Predictivo de Riesgo (Gemini 3.7 Flash)
                  </span>
                  <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                    Nivel: {aiRiskAnalysis.alertLevel || "ROJO"} (Score: {aiRiskAnalysis.riskScore}/100)
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {aiRiskAnalysis.suggestedSurplusAction || aiRiskAnalysis.economicImpactAssessment}
                </p>
                {aiRiskAnalysis.preventiveSteps && (
                  <div className="pt-2 border-t border-emerald-200">
                    <strong className="text-emerald-900 block mb-1">Plan de acción recomendado:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      {aiRiskAnalysis.preventiveSteps.map((step: string, idx: number) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Simulation Variables Sliders and Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Amenaza Meteorológica
                </label>
                <select
                  value={threatInput}
                  onChange={(e) => setThreatInput(e.target.value as ThreatType)}
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="helada">❄️ Helada Agronómica (-3°C)</option>
                  <option value="inundacion">🌧️ Crecida de Río / Lluvias</option>
                  <option value="sequia">☀️ Estrés Hídrico Extremo</option>
                  <option value="granizo">🌨️ Tormenta de Granizo</option>
                  <option value="plaga">🐛 Brote Fitosanitario</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Ventana de Tiempo Prevista
                </label>
                <select
                  value={urgencyDays}
                  onChange={(e) => setUrgencyDays(Number(e.target.value))}
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value={1}>🚨 24 a 36 Horas (Urgente)</option>
                  <option value={2}>⚠️ 48 Horas (Planificado)</option>
                  <option value={5}>📅 5 a 7 Días (Preventivo)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  % Cosecha Rescatable: <strong className="text-emerald-700">{rescuePercentage}%</strong>
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={rescuePercentage}
                  onChange={(e) => setRescuePercentage(Number(e.target.value))}
                  className="w-full accent-emerald-600 mt-2"
                />
              </div>
            </div>

            {/* Impact Calculation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Excedente a Rescatar</span>
                <div className="text-2xl font-black text-slate-900">{calculatedRescuedTons} <span className="text-xs font-bold text-slate-500">Ton</span></div>
                <p className="text-[10px] text-slate-500">Equivalente a {(calculatedRescuedTons * 1000).toLocaleString()} kg frescos</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Raciones de Comida</span>
                <div className="text-2xl font-black text-emerald-700">{mealsGenerated.toLocaleString()}</div>
                <p className="text-[10px] text-emerald-600">Para comedores y comunidades vulnerables</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">CO₂ Evitado</span>
                <div className="text-2xl font-black text-teal-700">{(co2SavedKg / 1000).toFixed(1)} <span className="text-xs font-bold text-slate-500">Ton</span></div>
                <p className="text-[10px] text-teal-600">Por prevención de descomposición en campo</p>
              </div>
            </div>

            {/* Destination Food Bank Matching */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Emparejamiento Inteligente de Centro de Acopio / Banco de Alimentos:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {foodBanks.map((fb) => (
                  <div
                    key={fb.id}
                    onClick={() => setSelectedFoodBankId(fb.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      selectedFoodBankId === fb.id
                        ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{fb.name}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                        Capacidad: {fb.storageCapacityTons} Ton
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">📍 {fb.region} • {fb.beneficiariesServedDaily.toLocaleString()} beneficiarios/día</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600">
                      <span>Cámara fría: <strong className={fb.refrigerationAvailable ? "text-emerald-700" : "text-slate-400"}>{fb.refrigerationAvailable ? "Sí" : "No"}</strong></span>
                      <span className="text-emerald-700 font-bold">Ruta directa: ~28 km</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Finalize and Dispatch Button */}
            <div className="pt-2">
              <button
                onClick={handleCreateSurplusDispatch}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition transform active:scale-98"
              >
                <Truck className="w-5 h-5" />
                <span>Generar Manifiesto de Despacho y Donación Preventiva ({calculatedRescuedTons} Ton)</span>
              </button>
            </div>

            {/* Generated Official Voucher / Tax Certificate Modal Card */}
            {generatedVoucher && (
              <div className="p-5 rounded-2xl bg-slate-900 text-white border border-emerald-500/50 shadow-xl space-y-4 animate-in zoom-in-95">
                <div className="flex items-start justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-white">Manifiesto Oficial de Cosecha y Donación Preventiva</h5>
                      <span className="text-xs text-emerald-400 font-mono">Folio: {generatedVoucher.taxVoucherCode}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setGeneratedVoucher(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-800/80 p-3 rounded-xl">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Cultivo Rescatado:</span>
                    <strong className="text-emerald-400">{generatedVoucher.cropName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Volumen:</span>
                    <strong className="text-white">{generatedVoucher.rescuedTons} Toneladas</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Destino Asignado:</span>
                    <strong className="text-white">{generatedVoucher.destinationCenterName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Estado Logístico:</span>
                    <span className="inline-block text-[10px] font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">
                      En Ruta
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-10 h-10 text-white bg-slate-800 p-1 rounded" />
                    <div>
                      <span className="text-[11px] font-semibold text-white block">Código de Verificación SAT / Banco de Alimentos</span>
                      <span className="text-[10px] text-slate-400">Válido para deducción fiscal y trazabilidad comunitaria</span>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Descargando PDF del Manifiesto Folio: ${generatedVoucher.taxVoucherCode}`)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-600 transition flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Descargar PDF</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Plot Registration Modal */}
      {showNewPlotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">Registrar Nueva Parcela Agrícola</h3>
              </div>
              <button
                onClick={() => setShowNewPlotModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewPlot} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nombre de la Parcela / Rancho</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Parcela El Recuerdo - Lote 3"
                  value={newPlotForm.name}
                  onChange={(e) => setNewPlotForm({ ...newPlotForm, name: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Tipo de Cultivo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Maíz Blanco, Tomate, Aguacate"
                    value={newPlotForm.cropType}
                    onChange={(e) => setNewPlotForm({ ...newPlotForm, cropType: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={newPlotForm.cropCategory}
                    onChange={(e: any) => setNewPlotForm({ ...newPlotForm, cropCategory: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="granos">Granos Básicos</option>
                    <option value="hortalizas">Hortalizas</option>
                    <option value="frutas">Frutas / Perennes</option>
                    <option value="tuberculos">Tubérculos</option>
                    <option value="legumbres">Legumbres</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Superficie (Hectáreas)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newPlotForm.hectares}
                    onChange={(e) => setNewPlotForm({ ...newPlotForm, hectares: Number(e.target.value) })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Rendimiento Estimado (Ton)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newPlotForm.estimatedYieldTons}
                    onChange={(e) => setNewPlotForm({ ...newPlotForm, estimatedYieldTons: Number(e.target.value) })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Etapa Fenológica</label>
                  <select
                    value={newPlotForm.phenologicalStage}
                    onChange={(e: any) => setNewPlotForm({ ...newPlotForm, phenologicalStage: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="madurez_cosecha">Madurez de Cosecha</option>
                    <option value="llenado_grano">Llenado de Grano / Fruto</option>
                    <option value="floracion">Floración</option>
                    <option value="vegetativo">Desarrollo Vegetativo</option>
                    <option value="germinacion">Germinación</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Región / Municipio</label>
                  <input
                    type="text"
                    required
                    value={newPlotForm.locationName}
                    onChange={(e) => setNewPlotForm({ ...newPlotForm, locationName: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPlotModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Guardar y Activar Monitoreo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
