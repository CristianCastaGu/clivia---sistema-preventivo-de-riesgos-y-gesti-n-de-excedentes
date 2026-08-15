import React, { useState } from "react";
import { AlertTriangle, X, MapPin, Camera, CheckCircle2, User, Send } from "lucide-react";
import { CitizenIncident, ThreatType, AlertSeverity, UserRole } from "../types";

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incident: CitizenIncident) => void;
  userRole: UserRole;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userRole,
}) => {
  const [title, setTitle] = useState("");
  const [threatType, setThreatType] = useState<ThreatType>("inundacion");
  const [severity, setSeverity] = useState<AlertSeverity>("amarillo");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("Camino Ejidal Sector 4, Huamantla");
  const [reportedBy, setReportedBy] = useState(
    userRole === "productor" ? "Don Mateo Ramírez (Productor)" :
    userRole === "ciudadano" ? "Vecino Comunitario" : "Oficial de Enlace"
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
      coordinates: [19.32 + (Math.random() - 0.5) * 0.05, -97.92 + (Math.random() - 0.5) * 0.05],
      reportedBy,
      role: userRole,
      timestamp: "Hace unos momentos",
      status: "reportado",
      votes: 1
    };

    onSubmit(newIncident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Reportar Incidente o Amenaza en Campo</h3>
              <p className="text-xs text-slate-500">Notificación directa para la comunidad y autoridades</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Título o Resumen del Incidente</label>
            <input
              type="text"
              required
              placeholder="Ej: Camino bloqueado por desborde de acequia"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Tipo de Amenaza</label>
              <select
                value={threatType}
                onChange={(e) => setThreatType(e.target.value as ThreatType)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-rose-500 outline-none"
              >
                <option value="inundacion">🌧️ Crecida / Inundación</option>
                <option value="helada">❄️ Helada / Escarcha</option>
                <option value="vendaval">💨 Vendaval / Ráfagas</option>
                <option value="sequia">☀️ Sequía / Falta de agua</option>
                <option value="incendio">🔥 Incendio de pastizal</option>
                <option value="granizo">🌨️ Granizo</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Severidad Percibida</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-rose-500 outline-none"
              >
                <option value="amarillo">🟡 Moderado (Precaución)</option>
                <option value="rojo">🔴 Crítico (Peligro Inminente)</option>
                <option value="verde">🟢 Informativo / Leve</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Ubicación / Referencia</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="flex-1 text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setLocationName("GPS: 19.3214° N, 97.9255° W (Ubicación actual detectada)")}
                className="px-2.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                title="Detectar GPS"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">GPS</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Descripción detallada</label>
            <textarea
              rows={3}
              required
              placeholder="Explica qué está sucediendo, personas o cultivos afectados y si requiere auxilio de bomberos o maquinaria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          {/* Photo attachment simulation */}
          <div>
            <button
              type="button"
              onClick={() => setHasPhoto(!hasPhoto)}
              className={`w-full py-2.5 px-3 rounded-xl border border-dashed text-xs font-semibold flex items-center justify-center gap-2 transition ${
                hasPhoto
                  ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                  : "bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{hasPhoto ? "✅ 1 Evidencia fotográfica adjunta" : "+ Adjuntar Foto / Evidencia de campo"}</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publicar Reporte de Incidente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
