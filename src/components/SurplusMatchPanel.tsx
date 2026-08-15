import React, { useState } from "react";
import { Sparkles, Send, MapPin, Store, Recycle, HeartHandshake, RotateCcw, CheckCircle2, Loader2 } from "lucide-react";
import { CropPlot, SurplusMatchResult, SurplusMatchOption } from "../types";

interface SurplusMatchPanelProps {
  plot: CropPlot;
  onConfirmed: (option: SurplusMatchOption, result: SurplusMatchResult) => void;
}

const kindStyles: Record<SurplusMatchOption["kind"], { icon: React.ElementType; chip: string }> = {
  comprador: { icon: Store, chip: "bg-primary-fixed text-on-primary-fixed" },
  transformacion: { icon: Recycle, chip: "bg-secondary-container text-on-secondary-container" },
  donacion: { icon: HeartHandshake, chip: "bg-tertiary-fixed text-on-tertiary-fixed" },
};

export const SurplusMatchPanel: React.FC<SurplusMatchPanelProps> = ({ plot, onConfirmed }) => {
  const [signal, setSignal] = useState(
    `Va a caer una helada fuerte en ${plot.locationName.split(",")[0]}, tengo que cosechar ${plot.cropType} antes de lo previsto.`
  );
  const [isThinking, setIsThinking] = useState(false);
  const [result, setResult] = useState<SurplusMatchResult | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [sentOptionId, setSentOptionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!signal.trim() || isThinking) return;
    setIsThinking(true);
    setResult(null);
    setSentOptionId(null);
    setError(null);
    try {
      const res = await fetch("/api/gemini/surplus-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropType: plot.cropType,
          quantityDescription: `${plot.estimatedYieldTons} toneladas estimadas en ${plot.hectares} ha`,
          region: plot.locationName,
          signal,
          urgencyHours: 48,
        }),
      });
      const data = await res.json();
      setResult(data);
      const initialMessages: Record<string, string> = {};
      (data.options || []).forEach((o: SurplusMatchOption) => (initialMessages[o.id] = o.message));
      setMessages(initialMessages);
    } catch (e) {
      setError("No se pudo conectar con el motor de excedentes. Intenta de nuevo.");
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = (option: SurplusMatchOption) => {
    setSentOptionId(option.id);
    if (result) onConfirmed({ ...option, message: messages[option.id] }, result);
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 sm:p-6 space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-on-surface">Motor de excedentes — describe la señal, no llenes un formulario</h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            CLIVIA razona si de verdad amerita cosecha anticipada y, si aplica, busca destino sola.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Tu reporte, en tus palabras</label>
        <textarea
          value={signal}
          onChange={(e) => setSignal(e.target.value)}
          rows={2}
          className="w-full text-sm rounded-lg border border-outline-variant p-3 bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
          placeholder="Ej: tengo unas 3 canastillas de tomate que se están madurando rápido…"
        />
        <button
          onClick={handleAnalyze}
          disabled={isThinking || !signal.trim()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container hover:text-on-primary-container transition disabled:opacity-60"
        >
          {isThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isThinking ? "Razonando…" : "Analizar con CLIVIA"}
        </button>
      </div>

      {error && <p className="text-xs text-error">{error}</p>}

      {result && !result.requiresForcedHarvest && (
        <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant text-sm text-on-surface-variant flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <strong className="text-on-surface block mb-0.5">No hace falta cosechar antes de tiempo todavía.</strong>
            {result.reasoning}
          </div>
        </div>
      )}

      {result && result.requiresForcedHarvest && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-3.5 rounded-lg bg-secondary-container/40 border border-secondary-container text-xs text-on-surface flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
            <div>
              <strong className="block text-on-surface">Sí amerita cosecha anticipada.</strong>
              <span className="text-on-surface-variant">{result.reasoning}</span>
              <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] font-semibold">
                <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest border border-outline-variant">
                  ~{result.estimatedTons} ton estimadas
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest border border-outline-variant">
                  Ventana: {result.windowHours}h
                </span>
              </div>
            </div>
          </div>

          <h4 className="text-xs font-bold text-on-surface uppercase tracking-wide">
            {result.options.length} destino{result.options.length !== 1 ? "s" : ""} recomendado{result.options.length !== 1 ? "s" : ""}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.options.map((option) => {
              const style = kindStyles[option.kind];
              const Icon = style.icon;
              const wasSent = sentOptionId === option.id;
              return (
                <article key={option.id} className="bg-surface border border-outline-variant rounded-xl p-4 flex flex-col gap-3">
                  <header className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${style.chip}`}>
                        <Icon className="w-4.5 h-4.5" />
                      </span>
                      <div>
                        <h5 className="text-sm font-bold text-on-surface leading-tight">{option.name}</h5>
                        <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {option.distanceKm} km
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-surface-container-high text-on-surface-variant whitespace-nowrap">
                      {option.tag}
                    </span>
                  </header>

                  <p className="text-xs text-on-surface-variant">{option.reason}</p>

                  <div className="bg-surface-container-low border border-outline-variant rounded-lg p-3 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">Mensaje generado</label>
                    <textarea
                      value={messages[option.id] ?? option.message}
                      onChange={(e) => setMessages((m) => ({ ...m, [option.id]: e.target.value }))}
                      rows={3}
                      className="w-full text-xs bg-surface-container-lowest border border-outline-variant rounded p-2 resize-none focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>

                  <button
                    onClick={() => handleSend(option)}
                    disabled={wasSent}
                    className={`w-full h-10 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
                      wasSent ? "bg-primary-fixed text-on-primary-fixed" : "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container"
                    }`}
                  >
                    {wasSent ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    {wasSent ? "Sí, ese — mensaje listo" : "Sí, ese: enviar mensaje"}
                  </button>
                </article>
              );
            })}
          </div>

          <button
            onClick={handleAnalyze}
            className="text-xs font-semibold text-on-surface-variant hover:text-on-surface flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            No, busca otras opciones
          </button>

          <p className="text-[10px] text-outline">
            El envío es simulado para este MVP — se muestra el mensaje listo, sin integración real de mensajería.
          </p>
        </div>
      )}
    </div>
  );
};
