import React from "react";
import { Phone, Flame, HeartPulse, ShieldCheck, ShieldAlert, Leaf, MapPinCheck, Waves, Wind } from "lucide-react";
import { EMERGENCY_CONTACTS, RESPONSE_PROTOCOLS } from "../data/mockData";
import { EmergencyContact, WeatherAlert } from "../types";

interface EmergencyDirectoryViewProps {
  alerts: WeatherAlert[];
}

const categoryIcon: Record<EmergencyContact["category"], React.ElementType> = {
  bomberos: Flame,
  salud: HeartPulse,
  policia: ShieldCheck,
  gestion_riesgo: ShieldAlert,
  ambiental: Leaf,
};

const protocolIcon: Record<string, React.ElementType> = {
  helada: Wind,
  inundacion: Waves,
  vendaval: Wind,
};

const protocolAccent: Record<string, string> = {
  helada: "border-l-primary bg-primary-fixed/30",
  inundacion: "border-l-tertiary bg-tertiary-fixed/30",
  vendaval: "border-l-secondary bg-secondary-container/30",
};

export const EmergencyDirectoryView: React.FC<EmergencyDirectoryViewProps> = ({ alerts }) => {
  const priorityContacts = EMERGENCY_CONTACTS.filter((c) => c.priority === "alta");
  const otherContacts = EMERGENCY_CONTACTS.filter((c) => c.priority === "media");

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
            <Phone className="w-6 h-6 text-primary" />
            Directorio de emergencia
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">Acceso rápido a servicios locales y protocolos críticos.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-semibold">
          <MapPinCheck className="w-3.5 h-3.5" />
          Ubicación compartida con despacho
        </span>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-on-surface uppercase tracking-wide">Despacho inmediato</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {priorityContacts.map((c) => {
            const Icon = categoryIcon[c.category];
            return (
              <div key={c.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <span className="w-10 h-10 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                  {c.distanceKm > 0 && (
                    <span className="text-[10px] font-semibold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
                      {c.distanceKm} km
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">{c.name}</h3>
                  <p className="text-xs text-on-surface-variant">{c.detail}</p>
                </div>
                <a
                  href={`tel:${c.phone.replace(/\s/g, "")}`}
                  className="mt-auto h-10 rounded-lg bg-tertiary text-on-tertiary text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition"
                >
                  <Phone className="w-3.5 h-3.5" /> {c.phone}
                </a>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-on-surface uppercase tracking-wide">Otros contactos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {otherContacts.map((c) => {
            const Icon = categoryIcon[c.category];
            return (
              <div key={c.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-on-surface truncate">{c.name}</h3>
                  <p className="text-xs text-on-surface-variant">{c.detail}</p>
                </div>
                <a
                  href={`tel:${c.phone.replace(/\s/g, "")}`}
                  className="h-9 px-3 rounded-lg border border-outline-variant text-xs font-semibold flex items-center gap-1.5 hover:bg-surface-container-low transition shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" /> Llamar
                </a>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-on-surface uppercase tracking-wide">Protocolos de respuesta</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RESPONSE_PROTOCOLS.map((protocol) => {
            const Icon = protocolIcon[protocol.threatType] ?? ShieldAlert;
            const hasActiveAlert = alerts.some((a) => a.threatType === protocol.threatType && a.severity !== "verde");
            return (
              <div
                key={protocol.id}
                className={`bg-surface-container-lowest border border-outline-variant border-l-4 rounded-xl p-4 space-y-3 ${protocolAccent[protocol.threatType] ?? "border-l-outline"}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                    <Icon className="w-4 h-4 text-on-surface-variant" />
                    {protocol.title}
                  </h3>
                  {hasActiveAlert && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container">
                      Activo
                    </span>
                  )}
                </div>
                <ol className="space-y-2">
                  {protocol.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-on-surface-variant">
                      <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
