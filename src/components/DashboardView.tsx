import React, { useState } from "react";
import { 
  ShieldAlert, 
  AlertTriangle, 
  Sprout, 
  Truck, 
  Users, 
  ThermometerSnowflake, 
  CloudRain, 
  SunMedium, 
  Flame, 
  Bot, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle, 
  MapPin, 
  Clock, 
  ExternalLink,
  Sparkles,
  Filter
} from "lucide-react";
import { WeatherAlert, CropPlot, CitizenIncident, SurplusTransaction, UserRole, AlertSeverity, ThreatType } from "../types";

interface DashboardViewProps {
  alerts: WeatherAlert[];
  plots: CropPlot[];
  incidents: CitizenIncident[];
  transactions: SurplusTransaction[];
  userRole: UserRole;
  onNavigate: (tab: string) => void;
  onOpenNewIncident: () => void;
  onSelectPlotForSurplus: (plot: CropPlot) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  alerts,
  plots,
  incidents,
  transactions,
  userRole,
  onNavigate,
  onOpenNewIncident,
  onSelectPlotForSurplus,
}) => {
  const [selectedThreatFilter, setSelectedThreatFilter] = useState<string>("todos");
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>("todas");

  // Summary counts
  const totalTonsRescued = transactions.reduce((acc, curr) => acc + curr.rescuedTons, 0);
  const totalMeals = transactions.reduce((acc, curr) => acc + curr.mealsGenerated, 0);
  const totalCo2Saved = transactions.reduce((acc, curr) => acc + curr.estimatedCo2SavedKg, 0);
  const criticalAlertsCount = alerts.filter(a => a.severity === "rojo").length;
  const plotsAtRiskCount = plots.filter(p => p.riskLevel === "rojo" || p.riskLevel === "amarillo").length;

  const filteredAlerts = alerts.filter(alert => {
    const matchesThreat = selectedThreatFilter === "todos" || alert.threatType === selectedThreatFilter;
    const matchesRegion = selectedRegionFilter === "todas" || alert.region.toLowerCase().includes(selectedRegionFilter.toLowerCase());
    return matchesThreat && matchesRegion;
  });

  const getThreatIcon = (type: ThreatType) => {
    switch (type) {
      case "helada": return <ThermometerSnowflake className="w-5 h-5 text-blue-500" />;
      case "inundacion": return <CloudRain className="w-5 h-5 text-cyan-600" />;
      case "sequia": return <SunMedium className="w-5 h-5 text-amber-500" />;
      case "incendio": return <Flame className="w-5 h-5 text-rose-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    }
  };

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case "rojo":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
            Crítico / Rojo
          </span>
        );
      case "amarillo":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Moderado / Amarillo
          </span>
        );
      case "verde":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Normal / Verde
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Banner Role Greeting & Action Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-700 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistema CLIVIA Activo • Red de Prevención y Rescate</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {userRole === "productor" && "Panel Agroclimático de Don Mateo y Productores"}
              {userRole === "ciudadano" && "Centro Comunitario de Alerta Temprana"}
              {userRole === "autoridad" && "Sala de Mando y Despacho Operativo de Riesgos"}
              {userRole === "ong_banco" && "Centro de Enlace de Excedentes y Bancos de Alimentos"}
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Monitoreo meteorológico en tiempo real, anticipación de siniestros agrícolas y enrutamiento inteligente de excedentes para proteger comunidades y evitar desperdicio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate("chat")}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-md transition transform active:scale-95"
            >
              <Bot className="w-4 h-4" />
              <span>Consultar Asesor IA</span>
            </button>
            <button
              onClick={() => onNavigate("cultivos")}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm border border-slate-600 transition"
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Simulador de Cosecha</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Alertas Activas</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{alerts.length}</span>
            <span className="text-xs font-bold text-rose-600">({criticalAlertsCount} críticas)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Helada polar y crecida de ríos</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Parcelas en Riesgo</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{plotsAtRiskCount}</span>
            <span className="text-xs text-slate-500 font-medium">de {plots.length} registradas</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">34.5 ha bajo protocolo preventivo</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Alimento Rescatado</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700">{totalTonsRescued.toFixed(1)}</span>
            <span className="text-xs font-bold text-emerald-600">Toneladas</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{totalMeals.toLocaleString()} raciones servidas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Impacto Ecológico</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-700">{(totalCo2Saved / 1000).toFixed(1)}</span>
            <span className="text-xs font-bold text-teal-600">Ton CO₂ evitado</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Por merma y pudrición prevenida</p>
        </div>
      </div>

      {/* Main Grid: Live Bulletins & Action Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Semáforo de Alertas & Filtros */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header & Filter Controls */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-emerald-600" />
                  <span>Boletines Agroclimáticos y Semáforo de Riesgo</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Actualización constante sincronizada con estaciones agrometeorológicas y satélites.
                </p>
              </div>

              {/* Threat Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {["todos", "helada", "inundacion", "sequia"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedThreatFilter(t)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                      selectedThreatFilter === t
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Filtered Alerts */}
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-all ${
                    alert.severity === "rojo"
                      ? "bg-rose-50/70 border-rose-200"
                      : alert.severity === "amarillo"
                      ? "bg-amber-50/70 border-amber-200"
                      : "bg-emerald-50/70 border-emerald-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-white shadow-xs">
                        {getThreatIcon(alert.threatType)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{alert.forecastSummary}</p>
                      </div>
                    </div>

                    <div className="text-right sm:shrink-0">
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center sm:justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.validUntil}
                      </span>
                      <span className="text-xs font-bold text-slate-700 block mt-0.5">
                        📍 {alert.region}
                      </span>
                    </div>
                  </div>

                  {/* Impacted Crops and Action Recommendations */}
                  <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-slate-700">Cultivos más vulnerables:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {alert.affectedCrops.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700">Medida prioritaria recomendada:</span>
                      <p className="text-slate-600 mt-0.5 italic">
                        "{alert.protocolRecommendations[0]}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => onNavigate("mapa")}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Ver polígono en Mapa
                    </button>

                    <button
                      onClick={() => onNavigate("cultivos")}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition"
                    >
                      <span>Simular Excedente / Cosecha</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plots Under Threat (Quick Action Panel) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-emerald-600" />
                  <span>Tus Parcelas Registradas y Estado Agroclimático</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Monitoreo de estado fenológico y cálculo de cosecha de emergencia.
                </p>
              </div>
              <button
                onClick={() => onNavigate("cultivos")}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                Ver todas ({plots.length}) →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plots.slice(0, 4).map((plot) => (
                <div
                  key={plot.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{plot.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {plot.cropType} • {plot.hectares} ha (~{plot.estimatedYieldTons} ton est.)
                      </p>
                    </div>
                    {getSeverityBadge(plot.riskLevel)}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-200/50">
                    <span>Etapa: <strong className="text-slate-800 uppercase">{plot.phenologicalStage.replace("_", " ")}</strong></span>
                    <span>Humedad: <strong className="text-emerald-700">{plot.moistureLevel}%</strong></span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        onSelectPlotForSurplus(plot);
                        onNavigate("cultivos");
                      }}
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Gestionar Excedente / Rescate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3): AI Advisor Widget & Live Feed */}
        <div className="space-y-6">
          {/* Quick AI Advisor Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-5 shadow-sm border border-emerald-800 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
                <Bot className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Asistente CLIVIA (Gemini 3.7)</h3>
                <p className="text-[11px] text-emerald-200">Asesoría preventiva y logística en tiempo real</p>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              Pregunta cualquier protocolo de emergencia ante heladas, rutas de evacucación o conexión con bancos de alimentos.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => onNavigate("chat")}
                className="w-full text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-white transition flex items-center justify-between"
              >
                <span>❄️ ¿Cómo proteger mi maíz de la helada de hoy?</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              <button
                onClick={() => onNavigate("chat")}
                className="w-full text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-white transition flex items-center justify-between"
              >
                <span>🚜 ¿Cómo donar excedentes al Banco de Alimentos?</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              <button
                onClick={() => onNavigate("chat")}
                className="w-full text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-white transition flex items-center justify-between"
              >
                <span>🏘️ ¿Dónde está el refugio temporal más cercano?</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>

            <button
              onClick={() => onNavigate("chat")}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition"
            >
              Abrir Chat Completo
            </button>
          </div>

          {/* Live Incident Reports Feed */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Reportes Ciudadanos en Vivo</span>
                </h3>
                <p className="text-[11px] text-slate-500">Alertas reportadas por la comunidad</p>
              </div>
              <button
                onClick={onOpenNewIncident}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold"
              >
                + Reportar
              </button>
            </div>

            <div className="space-y-3">
              {incidents.slice(0, 3).map((inc) => (
                <div key={inc.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{inc.title}</span>
                    <span className="text-[10px] text-slate-400">{inc.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{inc.description}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-medium">
                    <span>📍 {inc.locationName}</span>
                    <span className="text-emerald-700 font-bold">▲ {inc.votes} confirmaciones</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate("mapa")}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              Explorar Incidentes en el Mapa
            </button>
          </div>

          {/* Quick Stats: Food Rescue Log */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Últimos Despachos de Excedentes</span>
            </h3>

            <div className="space-y-2">
              {transactions.map((trx) => (
                <div key={trx.id} className="p-2.5 rounded-lg border border-slate-100 bg-emerald-50/30 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{trx.cropName} ({trx.rescuedTons} Ton)</span>
                    <span className="text-[10px] text-emerald-700 uppercase bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
                      {trx.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Destino: {trx.destinationCenterName}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{trx.timestamp}</span>
                    <span className="font-mono text-emerald-800">{trx.taxVoucherCode}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate("bancos")}
              className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              Ver Red de Bancos de Alimentos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
