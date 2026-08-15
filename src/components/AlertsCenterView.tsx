import React, { useState } from "react";
import { 
  Bell, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ThermometerSnowflake, 
  CloudRain, 
  SunMedium, 
  Flame, 
  Wind, 
  Share2, 
  Radio, 
  CheckSquare, 
  Square,
  FileDown
} from "lucide-react";
import { WeatherAlert, ThreatType, AlertSeverity } from "../types";

interface AlertsCenterViewProps {
  alerts: WeatherAlert[];
}

export const AlertsCenterView: React.FC<AlertsCenterViewProps> = ({ alerts }) => {
  const [selectedAlert, setSelectedAlert] = useState<WeatherAlert>(alerts[0]);
  const [simulatedBroadcastSuccess, setSimulatedBroadcastSuccess] = useState(false);

  // Interactive Checklist for Family & Farm Emergency
  const [checklist, setChecklist] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: "c1", text: "Proteger medidores de agua y tuberías expuestas con material aislante", done: true },
    { id: "c2", text: "Regar parcelas y semilleros antes del anochecer para crear inercia térmica", done: false },
    { id: "c3", text: "Resguardar ganado y aves de corral en corrales cerrados con ventilación controlada", done: false },
    { id: "c4", text: "Monitorear nivel de gas LP y batería de linternas de emergencia", done: true },
    { id: "c5", text: "Tener a la mano botiquín de primeros auxilios y documentos en bolsa plástica", done: false },
    { id: "c6", text: "Notificar al centro de acopio comunal si se tienen excedentes para cosecha de emergencia", done: false },
  ]);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleSimulateBroadcast = () => {
    setSimulatedBroadcastSuccess(true);
    setTimeout(() => setSimulatedBroadcastSuccess(false), 4000);
  };

  const getThreatIcon = (type: ThreatType) => {
    switch (type) {
      case "helada": return <ThermometerSnowflake className="w-5 h-5 text-blue-500" />;
      case "inundacion": return <CloudRain className="w-5 h-5 text-cyan-600" />;
      case "sequia": return <SunMedium className="w-5 h-5 text-amber-500" />;
      case "incendio": return <Flame className="w-5 h-5 text-rose-500" />;
      default: return <Wind className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Title & Emergency Broadcast Simulator */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <span>Centro de Alertas Tempranas y Boletines Oficiales</span>
          </h2>
          <p className="text-xs text-slate-500">
            Protocolos homologados con Protección Civil, CONAGUA y Servicio Meteorológico Nacional.
          </p>
        </div>

        <button
          onClick={handleSimulateBroadcast}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition"
        >
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Simular Difusión Masiva (SMS/Push)</span>
        </button>
      </div>

      {simulatedBroadcastSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>¡Aviso de Alerta Difundido!</strong> Se transmitió notificación push y SMS de alerta temprana a <strong>14,200</strong> habitantes y productores de la zona.
          </span>
        </div>
      )}

      {/* Main Grid: Alert List (Left 5 cols) & Detail Protocol (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Alerts Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Boletines Vigentes ({alerts.length})
          </span>

          <div className="space-y-3">
            {alerts.map((alert) => {
              const isSelected = selectedAlert.id === alert.id;
              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? alert.severity === "rojo"
                        ? "bg-rose-50 border-rose-400 ring-2 ring-rose-400/20"
                        : "bg-amber-50 border-amber-400 ring-2 ring-amber-400/20"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white shadow-xs">
                      {getThreatIcon(alert.threatType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          alert.severity === "rojo" ? "bg-rose-100 text-rose-800" :
                          alert.severity === "amarillo" ? "bg-amber-100 text-amber-800" :
                          "bg-emerald-100 text-emerald-800"
                        }`}>
                          {alert.threatType} • {alert.severity}
                        </span>
                        <span className="text-[10px] text-slate-400">{alert.validUntil}</span>
                      </div>

                      <h3 className="text-xs font-bold text-slate-900 mt-1 truncate">{alert.title}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{alert.forecastSummary}</p>
                      <span className="text-[10px] font-semibold text-slate-600 block mt-2">
                        📍 {alert.region}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Protocol & Emergency Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Detail Protocol Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                  selectedAlert.severity === "rojo" ? "bg-rose-100 text-rose-800 border border-rose-300" :
                  selectedAlert.severity === "amarillo" ? "bg-amber-100 text-amber-800 border border-amber-300" :
                  "bg-emerald-100 text-emerald-800 border border-emerald-300"
                }`}>
                  Nivel de Alerta: {selectedAlert.severity.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">{selectedAlert.title}</h3>
                <p className="text-xs text-slate-500">
                  Región: {selectedAlert.region} ({selectedAlert.municipality})
                </p>
              </div>

              <button
                onClick={() => alert(`Enlace de alerta copiado para compartir: ${selectedAlert.title}`)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                title="Compartir alerta"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Environmental Summary Table */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Temperatura Min/Max:</span>
                <strong className="text-slate-800">
                  {selectedAlert.temperature?.min}°C / {selectedAlert.temperature?.max}°C
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Prob. Precipitación:</span>
                <strong className="text-slate-800">{selectedAlert.precipitationProb}%</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Velocidad de Viento:</span>
                <strong className="text-slate-800">{selectedAlert.windSpeed} km/h</strong>
              </div>
            </div>

            {/* Agronomic Recommendations */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                <span>Protocolo de Acción y Medidas Preventivas</span>
              </h4>
              <div className="space-y-2">
                {selectedAlert.protocolRecommendations.map((rec, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Checklist Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <span>Lista de Verificación Rápida para el Hogar y Parcela</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Marca las acciones completadas para evaluar el nivel de preparación comunitaria.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {checklist.filter(c => c.done).length} / {checklist.length} listos
              </span>
            </div>

            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                    item.done ? "bg-emerald-50/60 border-emerald-200 text-emerald-950" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className={`text-xs ${item.done ? "line-through text-slate-500" : "font-medium"}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
