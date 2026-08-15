import React from "react";
import { Smartphone, Monitor, Wifi, Battery, Signal, ShieldAlert, MapPin, Sprout, Bot, Bell } from "lucide-react";

interface DeviceFrameWrapperProps {
  isMobileMode: boolean;
  setIsMobileMode: (val: boolean) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  children: React.ReactNode;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({
  isMobileMode,
  setIsMobileMode,
  currentTab,
  setCurrentTab,
  children,
}) => {
  if (!isMobileMode) {
    return <>{children}</>;
  }

  const mobileNavItems = [
    { id: "dashboard", label: "Monitor", icon: ShieldAlert },
    { id: "mapa", label: "Mapa", icon: MapPin },
    { id: "cultivos", label: "Excedentes", icon: Sprout },
    { id: "chat", label: "CLIVIA IA", icon: Bot, isSpecial: true },
    { id: "alertas", label: "Boletines", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-6 px-4 flex flex-col items-center justify-center animate-in fade-in">
      {/* Device Switcher Banner on Top */}
      <div className="mb-4 flex items-center justify-between w-full max-w-[420px] text-xs text-slate-400 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800">
        <span className="font-semibold text-slate-200">📱 Simulador Móvil CLIVIA</span>
        <button
          onClick={() => setIsMobileMode(false)}
          className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Salir a Vista Web</span>
        </button>
      </div>

      {/* Realistic Smartphone Shell */}
      <div className="w-full max-w-[400px] h-[820px] bg-slate-900 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-700 relative flex flex-col overflow-hidden ring-12 ring-slate-800/50">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ml-auto mr-2"></div>
        </div>

        {/* Mobile Status Bar */}
        <div className="pt-2 px-6 pb-2 text-[11px] font-bold text-slate-800 flex items-center justify-between z-40 select-none">
          <span>09:41</span>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Screen Content Container (Scrollable) */}
        <div className="flex-1 w-full bg-slate-50 overflow-y-auto rounded-[36px] relative shadow-inner p-3 pb-20">
          {children}
        </div>

        {/* Floating Mobile Bottom Navigation Bar */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 bg-white/95 backdrop-blur border-t border-slate-200 rounded-b-[36px] py-2 px-3 flex items-center justify-around z-40 shadow-lg">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
                  isActive
                    ? item.isSpecial
                      ? "text-emerald-700 font-bold scale-105"
                      : "text-emerald-700 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? (item.isSpecial ? "bg-emerald-100 text-emerald-800" : "bg-emerald-50 text-emerald-700") : ""}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate max-w-[55px]">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Home Indicator Bar */}
        <div className="w-32 h-1 bg-slate-400 rounded-full mx-auto mt-2 mb-0.5 z-50"></div>
      </div>
    </div>
  );
};
