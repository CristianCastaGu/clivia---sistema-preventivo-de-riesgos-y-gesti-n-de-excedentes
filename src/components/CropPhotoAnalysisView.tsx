import React, { useRef, useState } from "react";
import { Camera, Upload, Sparkles, Loader2, CheckCircle2, AlertTriangle, ShieldAlert, X } from "lucide-react";
import { CropPlot, CropPhotoDiagnosis } from "../types";

interface CropPhotoAnalysisViewProps {
  plot: CropPlot;
}

const statusStyles: Record<CropPhotoDiagnosis["status"], { chip: string; icon: React.ElementType; label: string }> = {
  saludable: { chip: "bg-primary-fixed text-on-primary-fixed", icon: CheckCircle2, label: "Saludable" },
  atencion: { chip: "bg-secondary-container text-on-secondary-container", icon: AlertTriangle, label: "Requiere atención" },
  critico: { chip: "bg-tertiary-container text-on-tertiary-container", icon: ShieldAlert, label: "Crítico" },
};

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const CropPhotoAnalysisView: React.FC<CropPhotoAnalysisViewProps> = ({ plot }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<CropPhotoDiagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDiagnosis(null);
    setError(null);
    setPreviewUrl(URL.createObjectURL(file));

    setIsAnalyzing(true);
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch("/api/gemini/analyze-crop-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType: file.type || "image/jpeg", cropType: plot.cropType }),
      });
      const data = await res.json();
      setDiagnosis(data);
    } catch {
      setError("No se pudo analizar la foto. Verifica tu conexión e inténtalo de nuevo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clear = () => {
    setPreviewUrl(null);
    setDiagnosis(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 sm:p-6 space-y-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
          <Camera className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-on-surface">Análisis de foto del cultivo</h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Sube una foto de {plot.cropType} y CLIVIA evalúa estado fitosanitario, estrés hídrico o daño por clima.
          </p>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />

      {!previewUrl ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-outline-variant rounded-xl py-10 flex flex-col items-center gap-2 text-on-surface-variant hover:border-primary hover:text-primary transition"
        >
          <Upload className="w-8 h-8" />
          <span className="text-sm font-semibold">Tomar o subir una foto</span>
          <span className="text-[11px]">JPG o PNG · se envía directo a Gemini</span>
        </button>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-outline-variant">
          <img src={previewUrl} alt={`Foto de ${plot.cropType}`} className="w-full max-h-72 object-cover" />
          <button
            onClick={clear}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-inverse-surface text-inverse-on-surface flex items-center justify-center"
            title="Quitar foto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isAnalyzing && (
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          CLIVIA está analizando la imagen…
        </div>
      )}

      {error && <p className="text-xs text-error">{error}</p>}

      {diagnosis && (
        <div className="space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            {(() => {
              const s = statusStyles[diagnosis.status] ?? statusStyles.atencion;
              const Icon = s.icon;
              return (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${s.chip}`}>
                  <Icon className="w-3.5 h-3.5" /> {s.label}
                </span>
              );
            })()}
          </div>
          <p className="text-sm text-on-surface">{diagnosis.summary}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-surface-container-low rounded-lg p-3">
              <span className="text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">Hallazgos</span>
              <ul className="mt-1.5 space-y-1 text-xs text-on-surface-variant list-disc list-inside">
                {diagnosis.findings?.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
            <div className="bg-surface-container-low rounded-lg p-3">
              <span className="text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">Acciones recomendadas</span>
              <ul className="mt-1.5 space-y-1 text-xs text-on-surface-variant list-disc list-inside">
                {diagnosis.recommendedActions?.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
