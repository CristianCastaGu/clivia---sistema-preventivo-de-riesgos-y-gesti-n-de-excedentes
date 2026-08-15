import React, { useState } from "react";
import { Sprout, Globe2, ShieldPlus, Store, ArrowRight, MapPin, LocateFixed, Loader2 } from "lucide-react";
import { UserRole, UserLocation } from "../types";

interface OnboardingViewProps {
  onComplete: (role: UserRole, location: UserLocation, displayName: string) => void;
}

const ROLES: { id: UserRole; icon: React.ElementType; title: string; description: string }[] = [
  {
    id: "ciudadano",
    icon: Globe2,
    title: "Ciudadano",
    description: "Consulta el clima de tu zona, recibe alertas comunitarias en tiempo real y mantente informado sobre la seguridad regional.",
  },
  {
    id: "autoridad",
    icon: ShieldPlus,
    title: "Entidad de riesgo",
    description: "Monitorea zonas de riesgo agregadas, coordina la respuesta operativa y difunde alertas críticas.",
  },
  {
    id: "productor",
    icon: Sprout,
    title: "Campesino / Productor",
    description: "Gestiona tus cultivos, reporta excedentes de cosecha y recibe intervenciones climáticas accionables.",
  },
  {
    id: "ong_banco",
    icon: Store,
    title: "Comprador / Receptor",
    description: "Accede al directorio de excedentes agrícolas cercanos, conecta con productores y estabiliza tu cadena de suministro.",
  },
];

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [locationSource, setLocationSource] = useState<"manual" | "gps" | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización. Escribe tu ubicación manualmente.");
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoordinates([latitude, longitude]);
        setLocationLabel(`Ubicación GPS detectada (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
        setLocationSource("gps");
        setIsLocating(false);
      },
      () => {
        setLocationError("No pudimos acceder a tu ubicación. Puedes escribirla manualmente.");
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const canContinue = Boolean(selectedRole);

  const handleContinue = () => {
    if (!selectedRole) return;
    const role = ROLES.find((r) => r.id === selectedRole)!;
    onComplete(
      selectedRole,
      {
        label: locationLabel.trim() || "Ubicación no especificada",
        coordinates,
        source: locationSource,
      },
      role.title
    );
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-outline) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <main className="w-full max-w-3xl relative z-10 flex flex-col items-center">
        <header className="text-center mb-10 space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-on-surface">CLIVIA</span>
          </div>
          <h1 className="text-[26px] sm:text-[32px] font-bold leading-tight text-on-surface text-balance">
            Bienvenido a tu aliado de alerta temprana y gestión de excedentes.
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-xl mx-auto">
            Para darte los datos de riesgo y las herramientas más relevantes, cuéntanos qué tipo de usuario eres.
          </p>
        </header>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`text-left rounded-xl border-2 p-5 flex flex-col gap-3 transition-all bg-surface-container-lowest ${
                  isSelected
                    ? "border-primary shadow-md bg-surface-container-low"
                    : "border-outline-variant hover:border-outline hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? "bg-primary-container text-on-primary" : "bg-surface-container-high text-primary"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-on-surface">{role.title}</h2>
                    <p className="text-[13px] leading-snug text-on-surface-variant">{role.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-8 space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Tu ubicación
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={locationLabel}
              onChange={(e) => {
                setLocationLabel(e.target.value);
                setLocationSource(e.target.value ? "manual" : null);
              }}
              placeholder="Ej: Tocancipá, Cundinamarca"
              className="flex-1 text-sm rounded-lg border border-outline-variant px-3 py-2.5 bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
            <button
              type="button"
              onClick={handleUseGps}
              disabled={isLocating}
              className="shrink-0 h-[42px] px-3 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition flex items-center gap-1.5 text-xs font-semibold disabled:opacity-60"
              title="Usar mi ubicación actual"
            >
              {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4 text-primary" />}
              <span className="hidden sm:inline">GPS</span>
            </button>
          </div>
          {locationError && <p className="text-xs text-error">{locationError}</p>}
          <p className="text-[11px] text-outline">Puedes escribirla a mano o usar el GPS de tu dispositivo — también se puede ajustar después.</p>
        </div>

        <div className="flex flex-col items-center w-full max-w-sm">
          <button
            type="button"
            disabled={!canContinue}
            onClick={handleContinue}
            className={`w-full min-h-12 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              canContinue
                ? "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-sm"
                : "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
            }`}
          >
            <span>Comenzar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-outline mt-3 text-center">Puedes cambiar tu rol principal después, desde el menú lateral.</p>
        </div>
      </main>
    </div>
  );
};
