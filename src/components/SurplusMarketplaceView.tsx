import React, { useState } from "react";
import { Store, MapPin, Mail, Timer, Filter } from "lucide-react";
import { SurplusListing, FoodBankCenter, SurplusTransaction, AlertSeverity } from "../types";

interface SurplusMarketplaceViewProps {
  listings: SurplusListing[];
  foodBanks: FoodBankCenter[];
  transactions: SurplusTransaction[];
}

const urgencyChip: Record<AlertSeverity, string> = {
  rojo: "bg-tertiary-container text-on-tertiary-container",
  amarillo: "bg-secondary-container text-on-secondary-container",
  verde: "bg-primary-fixed text-on-primary-fixed",
};

export const SurplusMarketplaceView: React.FC<SurplusMarketplaceViewProps> = ({ listings, foodBanks, transactions }) => {
  const [productFilter, setProductFilter] = useState("todos");
  const [contactedIds, setContactedIds] = useState<string[]>([]);

  const products = ["todos", ...Array.from(new Set(listings.map((l) => l.cropName)))];
  const filtered = listings.filter((l) => productFilter === "todos" || l.cropName === productFilter);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
            <Store className="w-6 h-6 text-primary" />
            Excedentes disponibles
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Asegura producto agrícola excedente cerca de ti antes de que se dañe — visible para productores y compradores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-on-surface-variant" />
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="text-xs font-semibold rounded-full border border-outline-variant px-3.5 py-2 bg-surface-container-lowest focus:ring-1 focus:ring-primary outline-none"
          >
            {products.map((p) => (
              <option key={p} value={p}>
                {p === "todos" ? "Todos los productos" : p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((listing) => {
          const wasContacted = contactedIds.includes(listing.id);
          return (
            <article key={listing.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="h-32 bg-surface-container-high flex items-center justify-center text-6xl relative">
                {listing.imageEmoji}
                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${urgencyChip[listing.urgency]}`}>
                  <Timer className="w-3 h-3" /> {listing.expiresInLabel}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-on-surface leading-tight">{listing.cropName}</h3>
                  <span className="text-primary font-bold text-sm whitespace-nowrap">{listing.priceLabel}</span>
                </div>
                <p className="text-xs text-on-surface-variant">{listing.quantityLabel}</p>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {listing.locationName} · {listing.distanceKm} km
                </p>
                <p className="text-[11px] text-outline">Productor: {listing.farmerName}</p>

                <button
                  onClick={() => setContactedIds((ids) => [...ids, listing.id])}
                  disabled={wasContacted}
                  className={`mt-auto h-10 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    wasContacted
                      ? "bg-primary-fixed text-on-primary-fixed"
                      : "bg-primary-container text-on-primary-container hover:opacity-90"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  {wasContacted ? "Productor contactado" : "Contactar productor"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-on-surface">Últimos despachos confirmados</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-on-surface-variant uppercase text-[10px]">
              <tr>
                <th className="py-2 pr-3">Cultivo</th>
                <th className="py-2 pr-3">Productor</th>
                <th className="py-2 pr-3">Volumen</th>
                <th className="py-2 pr-3">Destino</th>
                <th className="py-2">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="py-2 pr-3 font-semibold text-on-surface">{t.cropName}</td>
                  <td className="py-2 pr-3 text-on-surface-variant">{t.farmerName}</td>
                  <td className="py-2 pr-3 text-on-surface-variant">{t.rescuedTons} ton</td>
                  <td className="py-2 pr-3 text-on-surface-variant">{t.destinationCenterName}</td>
                  <td className="py-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed">
                      {t.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-outline">
        Bancos y centros de acopio conectados a la red: {foodBanks.length}. Ver detalle completo en Boletines → Red logística.
      </p>
    </div>
  );
};
