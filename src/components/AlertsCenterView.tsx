import React, { useState } from "react";
import { Bell, ShieldAlert, CheckCircle2, ThermometerSnowflake, CloudRain, SunMedium, Flame, Wind, Share2, Radio, CheckSquare, Square } from "lucide-react";
import { WeatherAlert, ThreatType } from "../types";

interface AlertsCenterViewProps {
  alerts: WeatherAlert[];
}

export const AlertsCenterView: React.FC<AlertsCenterViewProps> = ({ alerts }) => {
  const [selectedAlert, setSelectedAlert] = useState<WeatherAlert>(alerts[0]);
  const [simulatedBroadcastSuccess, setSimulatedBroadcastSuccess] = useState(false);

  const [checklist, setChecklist] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: "c1", text: "Proteger medidores de agua y tuberías expuestas con material aislante", done: true },
    { id: "c2", text: "Regar parcelas y semilleros antes del anochecer para crear inercia térmica", done: false },
    { id: "c3", text: "Resguardar ganado y aves de corral en corrales cerrados", done: false },
    { id: "c4", text: "Monitorear nivel de gas y batería de linternas de emergencia", done: true },
    { id: "c5", text: "Tener a la mano botiquín de primeros auxilios y documentos", done: false },
    { id: "c6", text: "Notificar al centro de acopio comunal si hay excedente por cosecha de emergencia", done: false },
  ]);

  const toggleChecklistItem = (id: string) =>
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));

  const handleSimulateBroadcast = () => {
    setSimulatedBroadcastSuccess(true);
    setTimeout(() => setSimulatedBroadcastSuccess(false), 4000);
  };

  const getThreatIcon = (type: ThreatType) => {
    switch (type) {
      case "helada": return <ThermometerSnowflake className="w-5 h-5 text-sky-600" />;
      case "inundacion": return <CloudRain className="w-5 h-5 text-sky-700" />;
      case "sequia": return <SunMedium className="w-5 h-5 text-secondary" />;
      case "incendio": return <Flame className="w-5 h-5 text-tertiary" />;
      default: return <Wind className="w-5 h-5 text-on-surface-variant" />;
    }
  };

  const severityChip = (severity: WeatherAlert["severity"]) =>
    ({
      rojo: "bg-tertiary-container text-on-tertiary-container",
      amarillo: "bg-secondary-container text-on-secondary-container",
      verde: "bg-primary-fixed text-on-primary-fixed",
    }[severity]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Centro de alertas tempranas
          </h2>
          <p className="text-xs text-on-surface-variant">Protocolos homologados con Gestión del Riesgo y Servicio Meteorológico.</p>
        </div>
        <button onClick={handleSimulateBroadcast} className="px-4 py-2.5 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container rounded-full text-xs font-semibold flex items-center gap-2 transition">
          <Radio className="w-4 h-4 animate-pulse" />
          Simular difusión masiva
        </button>
      </div>

      {simulatedBroadcastSuccess && (
        <div className="p-4 bg-primary-fixed rounded-xl text-xs text-on-primary-fixed flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>
            <strong>¡Aviso difundido!</strong> Se transmitió notificación push y SMS a <strong>14.200</strong> habitantes y productores de la zona.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide block">Boletines vigentes ({alerts.length})</span>
          <div className="space-y-3">
            {alerts.map((alert) => {
              const isSelected = selectedAlert.id === alert.id;
              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected ? "bg-surface-container-low border-primary ring-1 ring-primary" : "bg-surface-container-lowest border-outline-variant hover:bg-surface-container-low"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface-container-lowest">{getThreatIcon(alert.threatType)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${severityChip(alert.severity)}`}>
                          {alert.threatType} · {alert.severity}
                        </span>
                        <span className="text-[10px] text-on-surface-variant">{alert.validUntil}</span>
                      </div>
                      <h3 className="text-xs font-bold text-on-surface mt-1 truncate">{alert.title}</h3>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-2">{alert.forecastSummary}</p>
                      <span className="text-[10px] font-semibold text-on-surface-variant block mt-2">📍 {alert.region}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant space-y-4">
            <div className="flex items-start justify-between border-b border-outline-variant pb-3">
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${severityChip(selectedAlert.severity)}`}>
                  Nivel: {selectedAlert.severity.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-on-surface mt-2">{selectedAlert.title}</h3>
                <p className="text-xs text-on-surface-variant">
                  Región: {selectedAlert.region} ({selectedAlert.municipality})
                </p>
              </div>
              <button
                onClick={() => alert(`Enlace de alerta copiado: ${selectedAlert.title}`)}
                className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition"
                title="Compartir alerta"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-surface-container-low p-3.5 rounded-xl text-xs">
              <div>
                <span className="text-on-surface-variant block text-[10px]">Temperatura min/max</span>
                <strong className="text-on-surface">{selectedAlert.temperature?.min}°C / {selectedAlert.temperature?.max}°C</strong>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[10px]">Prob. precipitación</span>
                <strong className="text-on-surface">{selectedAlert.precipitationProb}%</strong>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[10px]">Velocidad de viento</span>
                <strong className="text-on-surface">{selectedAlert.windSpeed} km/h</strong>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-primary" />
                Protocolo de acción
              </h4>
              <div className="space-y-2">
                {selectedAlert.protocolRecommendations.map((rec, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-surface-container-low text-xs text-on-surface-variant flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-primary" />
                Lista de verificación rápida
              </h4>
              <span className="text-xs font-mono font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full">
                {checklist.filter((c) => c.done).length} / {checklist.length}
              </span>
            </div>
            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                    item.done ? "bg-primary-fixed/40 border-primary-fixed text-on-surface" : "bg-surface-container-low border-outline-variant text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {item.done ? <CheckSquare className="w-4 h-4 text-primary shrink-0" /> : <Square className="w-4 h-4 text-outline shrink-0" />}
                  <span className={`text-xs ${item.done ? "line-through opacity-70" : "font-medium"}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
