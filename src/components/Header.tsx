import React, { useState } from "react";
import { 
  ShieldAlert, 
  Sprout, 
  MapPin, 
  Bot, 
  Bell, 
  Building2, 
  Truck, 
  Smartphone, 
  Monitor, 
  Menu, 
  X, 
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Users
} from "lucide-react";
import { UserRole, AlertSeverity, WeatherAlert } from "../types";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isMobileDeviceMode: boolean;
  setIsMobileDeviceMode: (mode: boolean) => void;
  overallSeverity: AlertSeverity;
  activeAlerts: WeatherAlert[];
  onOpenNewIncident: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  isMobileDeviceMode,
  setIsMobileDeviceMode,
  overallSeverity,
  activeAlerts,
  onOpenNewIncident,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAlertsDrawer, setShowAlertsDrawer] = useState(false);

  const roleLabels: Record<UserRole, { label: string; icon: any; color: string }> = {
    productor: { label: "Productor / Agricultor", icon: Sprout, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    ciudadano: { label: "Ciudadano / Comunidad", icon: Users, color: "text-blue-700 bg-blue-50 border-blue-200" },
    autoridad: { label: "Autoridad / Protección Civil", icon: ShieldAlert, color: "text-purple-700 bg-purple-50 border-purple-200" },
    ong_banco: { label: "Banco de Alimentos / ONG", icon: Building2, color: "text-amber-700 bg-amber-50 border-amber-200" }
  };

  const navItems = [
    { id: "dashboard", label: "Monitor General", icon: ShieldAlert },
    { id: "mapa", label: "Mapa de Riesgos", icon: MapPin },
    { id: "cultivos", label: "Cultivos y Excedentes", icon: Sprout },
    { id: "chat", label: "Asistente IA (Gemini)", icon: Bot, isSpecial: true },
    { id: "alertas", label: "Boletines", icon: Bell },
    { id: "bancos", label: "Red Logística", icon: Truck },
  ];

  const severityBadgeStyles = {
    rojo: "bg-red-500 text-white animate-pulse",
    amarillo: "bg-amber-500 text-white",
    verde: "bg-emerald-500 text-white"
  };

  const severityText = {
    rojo: "ALERTA ROJA (Frente Polar Activo)",
    amarillo: "ALERTA AMARILLA (Vigilancia)",
    verde: "VERDE (Condiciones Estables)"
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 transition-all">
      {/* Top Banner: Semáforo y Alerta Global */}
      <div className="bg-slate-900 text-white px-3 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Semáforo de Riesgo Nacional:</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1 ${severityBadgeStyles[overallSeverity]}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            {severityText[overallSeverity]}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Motor Predictivo con Gemini 3.7</span>
          </div>

          <button
            onClick={() => setIsMobileDeviceMode(!isMobileDeviceMode)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] border border-slate-700 transition"
            title="Alternar entre vista completa web o simulador de dispositivo móvil"
          >
            {isMobileDeviceMode ? (
              <>
                <Monitor className="w-3 h-3 text-emerald-400" />
                <span>Vista Web Completa</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3 h-3 text-emerald-400" />
                <span>Simular Móvil</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab("dashboard")}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-emerald-100" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">CLIVIA</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    Resiliencia
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Prevención de Riesgos y Gestión de Excedentes Agrícolas
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? item.isSpecial
                        ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm"
                        : "bg-emerald-50 text-emerald-900 font-semibold"
                      : item.isSpecial
                      ? "text-emerald-700 hover:bg-emerald-50 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? (item.isSpecial ? "text-white" : "text-emerald-600") : "text-slate-500"}`} />
                  <span>{item.label}</span>
                  {item.isSpecial && (
                    <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-full font-bold ml-1">
                      IA
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Role Selector & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role Switcher */}
            <div className="relative">
              <label htmlFor="role-select" className="sr-only">Seleccionar Perfil</label>
              <div className="flex items-center">
                <select
                  id="role-select"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="text-xs sm:text-sm font-medium border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 shadow-sm hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer"
                >
                  <option value="productor">🌾 Productor / Agricultor</option>
                  <option value="ciudadano">🏘️ Ciudadano / Comunidad</option>
                  <option value="autoridad">🛡️ Autoridad / Prot. Civil</option>
                  <option value="ong_banco">🏢 Banco de Alimentos / ONG</option>
                </select>
              </div>
            </div>

            {/* Quick Report Button */}
            <button
              onClick={onOpenNewIncident}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition active:scale-95"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Reportar Alerta</span>
            </button>

            {/* Notification Drawer Trigger */}
            <button
              onClick={() => setShowAlertsDrawer(!showAlertsDrawer)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Ver alertas y notificaciones activas"
            >
              <Bell className="w-5 h-5" />
              {activeAlerts.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-emerald-50 text-emerald-900 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-5 h-5 ${isActive ? "text-emerald-600" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </div>
                {item.isSpecial && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Gemini AI
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onOpenNewIncident();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-semibold"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Reportar Incidente / Riesgo en Campo</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Alerts Floating Flyout Drawer */}
      {showAlertsDrawer && (
        <div className="absolute right-4 top-18 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95">
          <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-sm">Boletines de Alerta Activos</span>
            </div>
            <button
              onClick={() => setShowAlertsDrawer(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Cerrar
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-2">
            {activeAlerts.map((alert) => (
              <div key={alert.id} className="p-2.5 hover:bg-slate-50 rounded-lg transition">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    alert.severity === "rojo" ? "bg-red-100 text-red-800" :
                    alert.severity === "amarillo" ? "bg-amber-100 text-amber-800" :
                    "bg-emerald-100 text-emerald-800"
                  }`}>
                    {alert.threatType} • {alert.severity}
                  </span>
                  <span className="text-[11px] text-slate-500">{alert.validUntil}</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-900 mt-1">{alert.title}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{alert.forecastSummary}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-medium">📍 {alert.region}</span>
                  <button
                    onClick={() => {
                      setCurrentTab("alertas");
                      setShowAlertsDrawer(false);
                    }}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    Ver protocolo →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
