import React, { useState } from "react";
import { AlertTriangle, X, MapPin, Camera, Send } from "lucide-react";
import { CitizenIncident, ThreatType, AlertSeverity, UserRole } from "../types";

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incident: CitizenIncident) => void;
  userRole: UserRole;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({ isOpen, onClose, onSubmit, userRole }) => {
  const [title, setTitle] = useState("");
  const [threatType, setThreatType] = useState<ThreatType>("inundacion");
  const [severity, setSeverity] = useState<AlertSeverity>("amarillo");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("Vereda Canavita, Tocancipá");
  const [reportedBy] = useState(
    userRole === "productor" ? "Productor de la zona" : userRole === "ciudadano" ? "Vecino comunitario" : "Oficial de enlace"
  );
  const [hasPhoto, setHasPhoto] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIncident: CitizenIncident = {
      id: `inc-${Date.now()}`,
      title: title || `Alerta de ${threatType.toUpperCase()} en ${locationName}`,
      threatType,
      severity,
      description,
      locationName,
      coordinates: [4.9678 + (Math.random() - 0.5) * 0.05, -73.9151 + (Math.random() - 0.5) * 0.05],
      reportedBy,
      role: userRole,
      timestamp: "Hace unos momentos",
      status: "reportado",
      votes: 1,
    };
    onSubmit(newIncident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-on-surface">Reportar incidente o amenaza</h3>
              <p className="text-xs text-on-surface-variant">Notificación directa para la comunidad y autoridades</p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1">Título o resumen</label>
            <input
              type="text"
              required
              placeholder="Ej: Vía bloqueada por desborde de acequia"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs border border-outline-variant rounded-lg p-2.5 focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-1">Tipo de amenaza</label>
              <select
                value={threatType}
                onChange={(e) => setThreatType(e.target.value as ThreatType)}
                className="w-full text-xs border border-outline-variant rounded-lg p-2.5 bg-surface focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="inundacion">🌧️ Crecida / inundación</option>
                <option value="helada">❄️ Helada / escarcha</option>
                <option value="vendaval">💨 Vendaval / ráfagas</option>
                <option value="sequia">☀️ Sequía / falta de agua</option>
                <option value="incendio">🔥 Incendio de pastizal</option>
                <option value="granizo">🌨️ Granizo</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-1">Severidad percibida</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
                className="w-full text-xs border border-outline-variant rounded-lg p-2.5 bg-surface focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="amarillo">🟡 Moderado</option>
                <option value="rojo">🔴 Crítico</option>
                <option value="verde">🟢 Informativo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1">Ubicación / referencia</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="flex-1 text-xs border border-outline-variant rounded-lg p-2.5 focus:ring-1 focus:ring-primary outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (!navigator.geolocation) return;
                  navigator.geolocation.getCurrentPosition((pos) =>
                    setLocationName(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`)
                  );
                }}
                className="px-2.5 py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface-variant rounded-lg text-xs font-semibold flex items-center gap-1"
                title="Detectar GPS"
              >
                <MapPin className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">GPS</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-on-surface-variant block mb-1">Descripción detallada</label>
            <textarea
              rows={3}
              required
              placeholder="Explica qué está sucediendo, personas o cultivos afectados y si requiere auxilio…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs border border-outline-variant rounded-lg p-2.5 focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setHasPhoto(!hasPhoto)}
              className={`w-full py-2.5 px-3 rounded-xl border border-dashed text-xs font-semibold flex items-center justify-center gap-2 transition ${
                hasPhoto ? "bg-primary-fixed/40 border-primary text-on-surface" : "bg-surface-container-low border-outline-variant text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{hasPhoto ? "✅ 1 evidencia fotográfica adjunta" : "+ Adjuntar foto / evidencia de campo"}</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-lg">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2 text-xs font-bold text-on-tertiary bg-tertiary hover:opacity-90 rounded-full shadow-sm flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              Publicar reporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
