import React, { useEffect, useState } from "react";
import {
  Sprout,
  MapPin,
  Bell,
  Store,
  Phone,
  Wifi,
  WifiOff,
  Menu,
  X,
  AlertTriangle,
  LayoutGrid,
  Users,
  RefreshCcw,
} from "lucide-react";
import { UserProfile, AlertSeverity, WeatherAlert } from "../types";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  profile: UserProfile;
  onChangeRole: () => void;
  overallSeverity: AlertSeverity;
  activeAlerts: WeatherAlert[];
  onOpenNewIncident: () => void;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Monitor", mobileLabel: "Monitor", icon: LayoutGrid },
  { id: "mapa", label: "Mapa de Riesgos", mobileLabel: "Mapa", icon: MapPin },
  { id: "cultivos", label: "Cultivos y Excedentes", mobileLabel: "Cultivos", icon: Sprout },
  { id: "bancos", label: "Marketplace de Excedentes", mobileLabel: "Mercado", icon: Store },
  { id: "directorio", label: "Directorio de Emergencia", mobileLabel: "Ayuda", icon: Phone },
  { id: "alertas", label: "Boletines", mobileLabel: "Alertas", icon: Bell },
];

const MOBILE_TABS = ["dashboard", "mapa", "cultivos", "bancos", "directorio"];

const severityStyles: Record<AlertSeverity, { chip: string; label: string; dot: string }> = {
  rojo: { chip: "bg-tertiary-container text-on-tertiary-container", label: "Riesgo Rojo — Crítico", dot: "bg-tertiary-container" },
  amarillo: { chip: "bg-secondary-container text-on-secondary-container", label: "Riesgo Amarillo — Vigilancia", dot: "bg-secondary" },
  verde: { chip: "bg-primary-fixed text-on-primary-fixed", label: "Riesgo Verde — Estable", dot: "bg-primary" },
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  profile,
  onChangeRole,
  overallSeverity,
  activeAlerts,
  onOpenNewIncident,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAlertsDrawer, setShowAlertsDrawer] = useState(false);
  const [connectivity, setConnectivity] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((d) => setConnectivity(d.hasGeminiKey ? "online" : "offline"))
      .catch(() => setConnectivity("offline"));
  }, []);

  const severity = severityStyles[overallSeverity];

  return (
    <>
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button onClick={() => setCurrentTab("dashboard")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary shrink-0">
              <Sprout className="w-4.5 h-4.5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-primary">CLIVIA</span>
          </button>
          <span className={`hidden sm:inline-flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full text-[11px] font-bold ${severity.chip}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${severity.dot}`} />
            {severity.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-on-surface-variant px-2 py-1 rounded-full border border-outline-variant"
            title={connectivity === "online" ? "Conectado a Gemini" : "Usando motor de respaldo local"}
          >
            {connectivity === "online" ? <Wifi className="w-3.5 h-3.5 text-primary" /> : <WifiOff className="w-3.5 h-3.5 text-outline" />}
            {connectivity === "online" ? "IA en línea" : "Modo local"}
          </span>

          <button
            onClick={onOpenNewIncident}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-tertiary-container text-on-tertiary-container hover:opacity-90 rounded-full text-xs font-semibold transition"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Reportar</span>
          </button>

          <button
            onClick={() => setShowAlertsDrawer(!showAlertsDrawer)}
            className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low transition"
            title="Ver alertas activas"
          >
            <Bell className="w-5 h-5" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-tertiary text-on-tertiary text-[9px] font-bold flex items-center justify-center">
                {activeAlerts.length}
              </span>
            )}
          </button>

          <button
            onClick={onChangeRole}
            className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center hover:bg-surface-container-highest transition"
            title="Cambiar de rol"
          >
            <Users className="w-4 h-4" />
          </button>
        </div>

        {/* Alerts flyout */}
        {showAlertsDrawer && (
          <div className="absolute right-4 top-16 w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-3 bg-primary text-on-primary flex items-center justify-between">
              <span className="font-semibold text-sm flex items-center gap-2">
                <Bell className="w-4 h-4" /> Boletines activos
              </span>
              <button onClick={() => setShowAlertsDrawer(false)} className="text-xs opacity-80 hover:opacity-100">
                Cerrar
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant p-1.5">
              {activeAlerts.map((a) => (
                <div key={a.id} className="p-2.5 hover:bg-surface-container-low rounded-lg transition">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        a.severity === "rojo"
                          ? "bg-tertiary-container text-on-tertiary-container"
                          : a.severity === "amarillo"
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-primary-fixed text-on-primary-fixed"
                      }`}
                    >
                      {a.threatType} · {a.severity}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">{a.validUntil}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-on-surface mt-1">{a.title}</h4>
                  <button
                    onClick={() => {
                      setCurrentTab("alertas");
                      setShowAlertsDrawer(false);
                    }}
                    className="text-[11px] text-primary font-semibold mt-1 hover:underline"
                  >
                    Ver protocolo →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Desktop side navigation */}
      <nav className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-64 border-r border-outline-variant bg-surface-container z-30 py-4">
        <div className="flex flex-col items-center text-center px-4 pb-4 mb-2 border-b border-outline-variant">
          <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-primary mb-2">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-bold text-on-surface">{profile.displayName}</h2>
          <p className="text-[11px] text-on-surface-variant mt-0.5">{profile.location.label}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  isActive ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="px-2 pt-3 mt-2 border-t border-outline-variant space-y-1.5">
          <button
            onClick={onOpenNewIncident}
            className="w-full h-11 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container transition flex items-center justify-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Reportar incidente
          </button>
          <button
            onClick={onChangeRole}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high rounded-full transition"
          >
            <RefreshCcw className="w-4 h-4" />
            Cambiar de rol
          </button>
          <div className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-on-surface-variant">
            {connectivity === "online" ? <Wifi className="w-4 h-4 text-primary" /> : <WifiOff className="w-4 h-4 text-outline" />}
            {connectivity === "online" ? "Motor Gemini en línea" : "Motor local sin conexión"}
          </div>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-30 bg-surface-container-lowest border-b border-outline-variant px-3 py-3 space-y-1 animate-in fade-in slide-in-from-top-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-sm font-medium transition ${
                  isActive ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest border-t border-outline-variant flex items-stretch justify-around px-1 h-16">
        {NAV_ITEMS.filter((i) => MOBILE_TABS.includes(i.id)).map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5"
            >
              <div className={`px-3 py-1 rounded-full flex items-center justify-center transition ${isActive ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant"}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-primary font-bold" : "text-on-surface-variant"}`}>{item.mobileLabel}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
