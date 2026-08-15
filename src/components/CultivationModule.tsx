import React, { useState, useEffect } from "react";
import {
  Sprout,
  Plus,
  Truck,
  Sparkles,
  FileText,
  QrCode,
  TrendingUp,
  Camera,
  MessageSquareText,
  X,
  CheckCircle2,
} from "lucide-react";
import { CropPlot, FoodBankCenter, SurplusTransaction, ThreatType, SurplusMatchOption, SurplusMatchResult } from "../types";
import { SurplusMatchPanel } from "./SurplusMatchPanel";
import { CropPhotoAnalysisView } from "./CropPhotoAnalysisView";

interface CultivationModuleProps {
  plots: CropPlot[];
  setPlots: React.Dispatch<React.SetStateAction<CropPlot[]>>;
  foodBanks: FoodBankCenter[];
  transactions: SurplusTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<SurplusTransaction[]>>;
  preselectedPlot?: CropPlot | null;
}

type ModuleTab = "motor" | "foto" | "simulador";

export const CultivationModule: React.FC<CultivationModuleProps> = ({
  plots,
  setPlots,
  foodBanks,
  transactions,
  setTransactions,
  preselectedPlot,
}) => {
  const [selectedPlot, setSelectedPlot] = useState<CropPlot>(preselectedPlot || plots[0]);
  const [activeTab, setActiveTab] = useState<ModuleTab>("motor");

  useEffect(() => {
    if (preselectedPlot) setSelectedPlot(preselectedPlot);
  }, [preselectedPlot]);

  // --- Manual "simulador de impacto" state (kept for CO2/meals estimation) ---
  const [threatInput, setThreatInput] = useState<ThreatType>("helada");
  const [rescuePercentage, setRescuePercentage] = useState<number>(85);
  const [selectedFoodBankId, setSelectedFoodBankId] = useState<string>(foodBanks[0]?.id || "");
  const [generatedVoucher, setGeneratedVoucher] = useState<SurplusTransaction | null>(null);

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
    locationName: "Valle Central, Tlaxcala",
  });

  const calculatedRescuedTons = Number(((selectedPlot.estimatedYieldTons * rescuePercentage) / 100).toFixed(1));
  const mealsGenerated = Math.round(calculatedRescuedTons * 1000 * 2.5);
  const co2SavedKg = Math.round(calculatedRescuedTons * 250);
  const selectedFoodBank = foodBanks.find((fb) => fb.id === selectedFoodBankId) || foodBanks[0];

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
      mealsGenerated,
      taxVoucherCode: `CLIVIA-SAT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}X`,
    };
    setTransactions([newTrx, ...transactions]);
    setGeneratedVoucher(newTrx);
    setPlots((prev) => prev.map((p) => (p.id === selectedPlot.id ? { ...p, status: "cosecha_anticipada_activa" } : p)));
  };

  const handleSurplusConfirmed = (option: SurplusMatchOption, result: SurplusMatchResult) => {
    const newTrx: SurplusTransaction = {
      id: `trx-${Date.now().toString().slice(-4)}`,
      plotId: selectedPlot.id,
      cropName: selectedPlot.cropType,
      farmerName: selectedPlot.farmerName,
      rescuedTons: result.estimatedTons,
      destinationCenterId: option.id,
      destinationCenterName: option.name,
      threatTrigger: threatInput,
      timestamp: "Hace unos momentos",
      status: "programado",
      estimatedCo2SavedKg: Math.round(result.estimatedTons * 250),
      mealsGenerated: Math.round(result.estimatedTons * 1000 * 2.5),
      taxVoucherCode: `CLIVIA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}X`,
    };
    setTransactions([newTrx, ...transactions]);
    setPlots((prev) => prev.map((p) => (p.id === selectedPlot.id ? { ...p, status: "cosecha_anticipada_activa" } : p)));
  };

  const handleAddNewPlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlot: CropPlot = {
      id: `plot-${Date.now()}`,
      name: newPlotForm.name || "Nueva Parcela",
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
      status: "alerta_preventiva",
    };
    setPlots([newPlot, ...plots]);
    setSelectedPlot(newPlot);
    setShowNewPlotModal(false);
  };

  const tabs: { id: ModuleTab; label: string; icon: React.ElementType }[] = [
    { id: "motor", label: "Motor de excedentes", icon: Sparkles },
    { id: "foto", label: "Análisis de foto", icon: Camera },
    { id: "simulador", label: "Simulador de impacto", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant">
        <div>
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <Sprout className="w-5 h-5 text-primary" />
            Cultivos y gestión de excedentes
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Convierte alertas climáticas en cosechas preventivas y conexiones de excedente coordinadas.
          </p>
        </div>
        <button
          onClick={() => setShowNewPlotModal(true)}
          className="px-4 py-2.5 bg-primary text-on-primary rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-primary-container hover:text-on-primary-container transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Registrar parcela
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Plot list */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant space-y-3">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Parcelas bajo monitoreo ({plots.length})</span>
            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
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
                      isSelected ? "bg-surface-container-low border-primary ring-1 ring-primary" : "bg-surface border-outline-variant hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-on-surface">{plot.name}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                          plot.riskLevel === "rojo"
                            ? "bg-tertiary-container text-on-tertiary-container"
                            : plot.riskLevel === "amarillo"
                            ? "bg-secondary-container text-on-secondary-container"
                            : "bg-primary-fixed text-on-primary-fixed"
                        }`}
                      >
                        {plot.riskLevel}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-on-surface-variant">
                      <span>🌱 {plot.cropType}</span>
                      <span>·</span>
                      <span>{plot.hectares} ha</span>
                      <span>·</span>
                      <span>~{plot.estimatedYieldTons} ton</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-on-surface-variant pt-2 border-t border-outline-variant">
                      <span>
                        Etapa: <strong className="text-on-surface">{plot.phenologicalStage.replace("_", " ")}</strong>
                      </span>
                      <span className="font-semibold text-primary">
                        {plot.status === "cosecha_anticipada_activa" ? "🚜 Rescate activo" : "Monitoreo"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: active plot + tabs */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-primary text-on-primary rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full">Parcela activa</span>
                <h3 className="text-lg font-bold mt-1">
                  {selectedPlot.name} — {selectedPlot.cropType}
                </h3>
                <p className="text-xs text-on-primary/70">
                  Productor: {selectedPlot.farmerName} · {selectedPlot.locationName}
                </p>
              </div>
              <div className="text-right bg-white/10 px-3.5 py-2 rounded-xl">
                <span className="text-[10px] block opacity-70">Rendimiento esperado</span>
                <span className="text-base font-black">{selectedPlot.estimatedYieldTons} ton</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 border-b border-outline-variant overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
                    isActive ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === "motor" && <SurplusMatchPanel key={selectedPlot.id} plot={selectedPlot} onConfirmed={handleSurplusConfirmed} />}

          {activeTab === "foto" && <CropPhotoAnalysisView key={selectedPlot.id} plot={selectedPlot} />}

          {activeTab === "simulador" && (
            <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant space-y-6">
              <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                <h4 className="font-bold text-sm text-on-surface flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Simulador manual de pérdida vs. cosecha anticipada
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant block mb-1">Amenaza meteorológica</label>
                  <select
                    value={threatInput}
                    onChange={(e) => setThreatInput(e.target.value as ThreatType)}
                    className="w-full text-xs font-medium border border-outline-variant rounded-lg p-2.5 bg-surface focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="helada">❄️ Helada agronómica</option>
                    <option value="inundacion">🌧️ Crecida de río / lluvias</option>
                    <option value="sequia">☀️ Estrés hídrico extremo</option>
                    <option value="granizo">🌨️ Tormenta de granizo</option>
                    <option value="plaga">🐛 Brote fitosanitario</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant block mb-1">
                    % cosecha rescatable: <strong className="text-primary">{rescuePercentage}%</strong>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={rescuePercentage}
                    onChange={(e) => setRescuePercentage(Number(e.target.value))}
                    className="w-full accent-[#012d1d] mt-3"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant block mb-1">Destino</label>
                  <select
                    value={selectedFoodBankId}
                    onChange={(e) => setSelectedFoodBankId(e.target.value)}
                    className="w-full text-xs font-medium border border-outline-variant rounded-lg p-2.5 bg-surface focus:ring-1 focus:ring-primary outline-none"
                  >
                    {foodBanks.map((fb) => (
                      <option key={fb.id} value={fb.id}>
                        {fb.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-container-low p-4 rounded-xl">
                <div>
                  <span className="text-[11px] font-semibold text-on-surface-variant uppercase">Excedente a rescatar</span>
                  <div className="text-2xl font-black text-on-surface">
                    {calculatedRescuedTons} <span className="text-xs font-bold text-on-surface-variant">ton</span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-on-surface-variant uppercase">Raciones de comida</span>
                  <div className="text-2xl font-black text-primary">{mealsGenerated.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-on-surface-variant uppercase">CO₂ evitado</span>
                  <div className="text-2xl font-black text-primary">{(co2SavedKg / 1000).toFixed(1)} ton</div>
                </div>
              </div>

              <button
                onClick={handleCreateSurplusDispatch}
                className="w-full py-3 bg-primary text-on-primary font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition"
              >
                <Truck className="w-5 h-5" />
                Generar manifiesto de despacho ({calculatedRescuedTons} ton)
              </button>

              {generatedVoucher && (
                <div className="p-5 rounded-xl bg-inverse-surface text-inverse-on-surface space-y-3 animate-in zoom-in-95">
                  <div className="flex items-start justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5" />
                      <div>
                        <h5 className="font-bold text-sm">Manifiesto de despacho</h5>
                        <span className="text-xs font-mono opacity-80">Folio: {generatedVoucher.taxVoucherCode}</span>
                      </div>
                    </div>
                    <button onClick={() => setGeneratedVoucher(null)} className="opacity-70 hover:opacity-100">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white/5 p-3 rounded-lg">
                    <div>
                      <span className="opacity-60 block text-[10px]">Volumen</span>
                      <strong>{generatedVoucher.rescuedTons} ton</strong>
                    </div>
                    <div>
                      <span className="opacity-60 block text-[10px]">Destino</span>
                      <strong>{generatedVoucher.destinationCenterName}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="opacity-60 block text-[10px]">Estado</span>
                      <span className="inline-block text-[10px] font-bold bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full">En ruta</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Descargando PDF del manifiesto: ${generatedVoucher.taxVoucherCode}`)}
                    className="text-xs font-semibold flex items-center gap-1.5 opacity-90 hover:opacity-100"
                  >
                    <FileText className="w-3.5 h-3.5" /> Descargar PDF
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showNewPlotModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base text-on-surface">Registrar nueva parcela</h3>
              </div>
              <button onClick={() => setShowNewPlotModal(false)} className="text-on-surface-variant hover:text-on-surface p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewPlot} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-1">Nombre de la parcela</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Parcela El Recuerdo - Lote 3"
                  value={newPlotForm.name}
                  onChange={(e) => setNewPlotForm({ ...newPlotForm, name: e.target.value })}
                  className="w-full text-xs border border-outline-variant rounded-lg p-2.5 focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant block mb-1">Tipo de cultivo</label>
                  <input
                    type="text"
                    required
                    value={newPlotForm.cropType}
                    onChange={(e) => setNewPlotForm({ ...newPlotForm, cropType: e.target.value })}
                    className="w-full text-xs border border-outline-variant rounded-lg p-2.5 focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant block mb-1">Categoría</label>
                  <select
                    value={newPlotForm.cropCategory}
                    onChange={(e: any) => setNewPlotForm({ ...newPlotForm, cropCategory: e.target.value })}
                    className="w-full text-xs border border-outline-variant rounded-lg p-2.5 bg-surface focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="granos">Granos básicos</option>
                    <option value="hortalizas">Hortalizas</option>
                    <option value="frutas">Frutas / perennes</option>
                    <option value="tuberculos">Tubérculos</option>
                    <option value="legumbres">Legumbres</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant block mb-1">Hectáreas</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newPlotForm.hectares}
                    onChange={(e) => setNewPlotForm({ ...newPlotForm, hectares: Number(e.target.value) })}
                    className="w-full text-xs border border-outline-variant rounded-lg p-2.5 focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant block mb-1">Rendimiento estimado (ton)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newPlotForm.estimatedYieldTons}
                    onChange={(e) => setNewPlotForm({ ...newPlotForm, estimatedYieldTons: Number(e.target.value) })}
                    className="w-full text-xs border border-outline-variant rounded-lg p-2.5 focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-1">Región / municipio</label>
                <input
                  type="text"
                  required
                  value={newPlotForm.locationName}
                  onChange={(e) => setNewPlotForm({ ...newPlotForm, locationName: e.target.value })}
                  className="w-full text-xs border border-outline-variant rounded-lg p-2.5 focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowNewPlotModal(false)} className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-lg">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-bold text-on-primary bg-primary hover:bg-primary-container hover:text-on-primary-container rounded-lg">
                  Guardar y activar monitoreo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
