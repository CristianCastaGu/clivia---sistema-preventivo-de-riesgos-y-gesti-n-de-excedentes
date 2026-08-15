import React, { useState, useEffect } from "react";
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
  MapPin,
  Clock,
  Sparkles,
  Wind,
  Droplets,
  Satellite,
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

const roleHeadline: Record<UserRole, string> = {
  productor: "Panel agroclimático y de excedentes",
  ciudadano: "Centro comunitario de alerta temprana",
  autoridad: "Sala de mando y despacho operativo",
  ong_banco: "Centro de excedentes disponibles",
};

interface LiveWeather {
  referencePoint: { lat: number; lon: number };
  fetchedAt: string;
  sourcesOnline: number;
  sourcesTotal: number;
  consensus: { temperatureC: number | null; humidityPercent: number | null; windSpeedKmh: number | null; precipitationMm: number | null };
  sources: Record<string, { ok: boolean; temperatureC?: number; conditionText?: string }>;
}

const sourceLabels: Record<string, string> = {
  openMeteo: "Open-Meteo",
  openWeather: "OpenWeatherMap",
  weatherApi: "WeatherAPI",
  meteoblue: "Meteoblue",
};

const LiveWeatherCard: React.FC = () => {
  const [weather, setWeather] = useState<LiveWeather | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    fetch("/api/weather/live")
      .then((r) => r.json())
      .then((d) => {
        setWeather(d);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "error") return null;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
          <Satellite className="w-4 h-4 text-primary" />
          Clima en tiempo real — Tocancipá
        </h3>
        {weather && (
          <span className="text-[10px] font-semibold text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-full">
            {weather.sourcesOnline}/{weather.sourcesTotal} fuentes en línea
          </span>
        )}
      </div>

      {status === "loading" && <p className="text-xs text-on-surface-variant">Consultando fuentes meteorológicas…</p>}

      {weather && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <ThermometerSnowflake className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <span className="text-lg font-black text-on-surface">{weather.consensus.temperatureC ?? "—"}°C</span>
                <p className="text-[10px] text-on-surface-variant">Temperatura</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-700 shrink-0" />
              <div>
                <span className="text-lg font-black text-on-surface">{weather.consensus.humidityPercent ?? "—"}%</span>
                <p className="text-[10px] text-on-surface-variant">Humedad</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-on-surface-variant shrink-0" />
              <div>
                <span className="text-lg font-black text-on-surface">{weather.consensus.windSpeedKmh ?? "—"}</span>
                <p className="text-[10px] text-on-surface-variant">km/h viento</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-outline-variant">
            {Object.entries(weather.sources).map(([key, s]: [string, LiveWeather["sources"][string]]) => (
              <span
                key={key}
                className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                  s.ok ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container-high text-on-surface-variant opacity-60"
                }`}
                title={s.ok ? `${sourceLabels[key]}: ${s.temperatureC ?? "—"}°C` : `${sourceLabels[key]}: sin datos`}
              >
                {sourceLabels[key]} {s.ok ? `· ${s.temperatureC ?? "—"}°C` : "· offline"}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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

  const totalTonsRescued = transactions.reduce((acc, curr) => acc + curr.rescuedTons, 0);
  const totalMeals = transactions.reduce((acc, curr) => acc + curr.mealsGenerated, 0);
  const totalCo2Saved = transactions.reduce((acc, curr) => acc + curr.estimatedCo2SavedKg, 0);
  const criticalAlertsCount = alerts.filter((a) => a.severity === "rojo").length;
  const plotsAtRiskCount = plots.filter((p) => p.riskLevel === "rojo" || p.riskLevel === "amarillo").length;

  const filteredAlerts = alerts.filter((alert) => selectedThreatFilter === "todos" || alert.threatType === selectedThreatFilter);

  const getThreatIcon = (type: ThreatType) => {
    switch (type) {
      case "helada": return <ThermometerSnowflake className="w-5 h-5 text-sky-600" />;
      case "inundacion": return <CloudRain className="w-5 h-5 text-sky-700" />;
      case "sequia": return <SunMedium className="w-5 h-5 text-secondary" />;
      case "incendio": return <Flame className="w-5 h-5 text-tertiary" />;
      default: return <AlertTriangle className="w-5 h-5 text-secondary" />;
    }
  };

  const getSeverityBadge = (severity: AlertSeverity) => {
    const styles: Record<AlertSeverity, string> = {
      rojo: "bg-tertiary-container text-on-tertiary-container",
      amarillo: "bg-secondary-container text-on-secondary-container",
      verde: "bg-primary-fixed text-on-primary-fixed",
    };
    const labels: Record<AlertSeverity, string> = { rojo: "Crítico", amarillo: "Moderado", verde: "Normal" };
    return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${styles[severity]}`}>{labels[severity]}</span>;
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Status banner */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistema CLIVIA activo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">{roleHeadline[userRole]}</h1>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Monitoreo meteorológico en tiempo real, anticipación de riesgo agrícola y enrutamiento inteligente de excedentes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => onNavigate("chat")} className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-bold rounded-full text-sm transition">
              <Bot className="w-4 h-4" />
              <span>Consultar CLIVIA</span>
            </button>
            <button onClick={() => onNavigate("cultivos")} className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold rounded-full text-sm border border-outline-variant transition">
              <Sprout className="w-4 h-4 text-primary" />
              <span>Motor de excedentes</span>
            </button>
          </div>
        </div>
      </div>

      <LiveWeatherCard />

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide">Alertas activas</span>
            <div className="p-2 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed"><ShieldAlert className="w-5 h-5" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-on-surface">{alerts.length}</span>
            <span className="text-xs font-bold text-tertiary">({criticalAlertsCount} críticas)</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide">Parcelas en riesgo</span>
            <div className="p-2 rounded-lg bg-secondary-container text-on-secondary-container"><Sprout className="w-5 h-5" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-on-surface">{plotsAtRiskCount}</span>
            <span className="text-xs text-on-surface-variant font-medium">de {plots.length}</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide">Alimento rescatado</span>
            <div className="p-2 rounded-lg bg-primary-fixed text-on-primary-fixed"><Truck className="w-5 h-5" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-primary">{totalTonsRescued.toFixed(1)}</span>
            <span className="text-xs font-bold text-primary">ton</span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1">{totalMeals.toLocaleString()} raciones</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide">Impacto ecológico</span>
            <div className="p-2 rounded-lg bg-surface-container-high text-primary"><TrendingUp className="w-5 h-5" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-primary">{(totalCo2Saved / 1000).toFixed(1)}</span>
            <span className="text-xs font-bold text-primary">ton CO₂</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant pb-3">
              <div>
                <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                  Boletines y semáforo de riesgo
                </h2>
                <p className="text-xs text-on-surface-variant">Sincronizado con estaciones agrometeorológicas.</p>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {["todos", "helada", "inundacion", "sequia"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedThreatFilter(t)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition ${
                      selectedThreatFilter === t ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className="p-4 rounded-xl border border-outline-variant bg-surface-container-low/60">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-surface-container-lowest">{getThreatIcon(alert.threatType)}</div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-on-surface">{alert.title}</h3>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">{alert.forecastSummary}</p>
                      </div>
                    </div>
                    <div className="text-right sm:shrink-0">
                      <span className="text-[11px] font-semibold text-on-surface-variant flex items-center sm:justify-end gap-1">
                        <Clock className="w-3 h-3" /> {alert.validUntil}
                      </span>
                      <span className="text-xs font-bold text-on-surface block mt-0.5">📍 {alert.region}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-outline-variant flex items-center justify-between">
                    <button onClick={() => onNavigate("mapa")} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
                      <MapPin className="w-3.5 h-3.5" /> Ver en mapa
                    </button>
                    <button onClick={() => onNavigate("cultivos")} className="px-3 py-1.5 rounded-full bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container text-xs font-semibold flex items-center gap-1 transition">
                      <span>Gestionar excedente</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-primary" />
                  Tus parcelas registradas
                </h3>
              </div>
              <button onClick={() => onNavigate("cultivos")} className="text-xs text-primary font-bold hover:underline">
                Ver todas ({plots.length}) →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plots.slice(0, 4).map((plot) => (
                <div key={plot.id} className="p-3.5 rounded-xl border border-outline-variant bg-surface-container-low/50 flex flex-col justify-between gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">{plot.name}</h4>
                      <p className="text-[11px] text-on-surface-variant font-medium">
                        {plot.cropType} · {plot.hectares} ha
                      </p>
                    </div>
                    {getSeverityBadge(plot.riskLevel)}
                  </div>
                  <button
                    onClick={() => {
                      onSelectPlotForSurplus(plot);
                      onNavigate("cultivos");
                    }}
                    className="w-full py-1.5 bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    Gestionar excedente
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-primary text-on-primary rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><Bot className="w-5 h-5" /></div>
              <div>
                <h3 className="font-bold text-sm">Asistente CLIVIA</h3>
                <p className="text-[11px] text-on-primary/70">Asesoría preventiva en tiempo real</p>
              </div>
            </div>
            <div className="space-y-2">
              {["❄️ ¿Cómo proteger mi cultivo de la helada de hoy?", "🚜 ¿Cómo conecto mi excedente con un destino?", "🏘️ ¿Dónde está el refugio temporal más cercano?"].map((q) => (
                <button key={q} onClick={() => onNavigate("chat")} className="w-full text-left p-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs transition flex items-center justify-between">
                  <span>{q}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
            <button onClick={() => onNavigate("chat")} className="w-full py-2 bg-white text-primary font-bold rounded-full text-xs">
              Abrir chat completo
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" /> Reportes ciudadanos
              </h3>
              <button onClick={onOpenNewIncident} className="text-xs text-tertiary hover:opacity-80 font-bold">
                + Reportar
              </button>
            </div>
            <div className="space-y-3">
              {incidents.slice(0, 3).map((inc) => (
                <div key={inc.id} className="p-3 rounded-lg bg-surface-container-low text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface">{inc.title}</span>
                    <span className="text-[10px] text-on-surface-variant">{inc.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2">{inc.description}</p>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate("mapa")} className="w-full py-2 bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-semibold rounded-full text-xs transition">
              Ver en el mapa
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant space-y-3">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-primary" /> Últimos despachos
            </h3>
            <div className="space-y-2">
              {transactions.map((trx) => (
                <div key={trx.id} className="p-2.5 rounded-lg border border-outline-variant bg-surface-container-low/40 text-xs">
                  <div className="flex items-center justify-between font-bold text-on-surface">
                    <span>{trx.cropName} ({trx.rescuedTons} ton)</span>
                    <span className="text-[10px] text-primary uppercase bg-primary-fixed px-1.5 py-0.5 rounded font-bold">{trx.status}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Destino: {trx.destinationCenterName}</p>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate("bancos")} className="w-full py-2 border border-outline-variant hover:bg-surface-container-low text-on-surface-variant font-semibold rounded-full text-xs transition">
              Ver marketplace de excedentes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
