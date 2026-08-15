import React, { useState } from "react";
import { Building2, Truck, Heart, MapPin, Phone } from "lucide-react";
import { FoodBankCenter, SurplusTransaction } from "../types";

interface FoodBankLogisticsViewProps {
  foodBanks: FoodBankCenter[];
  transactions: SurplusTransaction[];
  onSelectPlotForSurplus?: () => void;
}

export const FoodBankLogisticsView: React.FC<FoodBankLogisticsViewProps> = ({ foodBanks, transactions }) => {
  const [filterType, setFilterType] = useState<string>("todos");

  const totalCapacity = foodBanks.reduce((a, c) => a + c.storageCapacityTons, 0);
  const totalBeneficiaries = foodBanks.reduce((a, c) => a + c.beneficiariesServedDaily, 0);
  const filteredBanks = foodBanks.filter((fb) => filterType === "todos" || fb.type === filterType);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="bg-primary text-on-primary p-6 sm:p-8 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">
              <Heart className="w-3.5 h-3.5" />
              Red solidaria de bancos y comedores
            </div>
            <h2 className="text-2xl font-bold">Logística comunitaria de excedentes</h2>
            <p className="text-xs text-on-primary/70 leading-relaxed">
              Canalización directa desde parcelas amenazadas por contingencias climáticas hacia bancos de alimentos, albergues y comedores.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 bg-white/10 p-4 rounded-xl">
            <div>
              <span className="text-[10px] opacity-70 block uppercase">Almacenamiento total</span>
              <strong className="text-lg font-black">{totalCapacity} ton</strong>
            </div>
            <div>
              <span className="text-[10px] opacity-70 block uppercase">Beneficiarios diarios</span>
              <strong className="text-lg font-black">{totalBeneficiaries.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Centros habilitados ({filteredBanks.length})
          </h3>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: "todos", label: "Todos" },
              { id: "banco_alimentos", label: "Bancos de alimentos" },
              { id: "comedor_comunitario", label: "Comedores" },
              { id: "albergue_temporal", label: "Albergues" },
              { id: "centro_acopio", label: "Centros de acopio" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  filterType === f.id ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBanks.map((center) => {
            const occupancyPercent = Math.round((center.currentStockTons / center.storageCapacityTons) * 100);
            return (
              <div key={center.id} className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-on-primary-container uppercase bg-primary-fixed px-2 py-0.5 rounded-full">
                      {center.type.replace("_", " ")}
                    </span>
                    <h4 className="text-sm font-bold text-on-surface mt-1">{center.name}</h4>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {center.address}, {center.region}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-on-surface">{center.currentStockTons} / {center.storageCapacityTons} ton</span>
                    <span className="text-[10px] text-on-surface-variant block">{occupancyPercent}%</span>
                  </div>
                </div>

                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${occupancyPercent > 80 ? "bg-secondary" : "bg-primary"}`} style={{ width: `${occupancyPercent}%` }} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-surface-container-low p-2.5 rounded-lg">
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">Cámara de frío</span>
                    <strong className={center.refrigerationAvailable ? "text-primary" : "text-on-surface-variant"}>
                      {center.refrigerationAvailable ? "Disponible" : "No"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[10px]">Atención diaria</span>
                    <strong className="text-on-surface">{center.beneficiariesServedDaily.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant flex items-center justify-between">
                  <div className="text-xs text-on-surface-variant">
                    Contacto: <strong className="text-on-surface">{center.contactPerson}</strong>
                  </div>
                  <a href={`tel:${center.phone}`} className="px-3 py-1.5 bg-inverse-surface text-inverse-on-surface rounded-full text-xs font-semibold flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> Llamar
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant space-y-4">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <Truck className="w-5 h-5 text-primary" />
          Bitácora de despachos
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-on-surface-variant uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3">Folio</th>
                <th className="p-3">Cultivo</th>
                <th className="p-3">Productor</th>
                <th className="p-3">Volumen</th>
                <th className="p-3">Destino</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {transactions.map((trx) => (
                <tr key={trx.id}>
                  <td className="p-3 font-mono font-bold text-on-surface">{trx.taxVoucherCode}</td>
                  <td className="p-3 font-semibold text-primary">{trx.cropName}</td>
                  <td className="p-3 text-on-surface-variant">{trx.farmerName}</td>
                  <td className="p-3 font-bold text-on-surface">{trx.rescuedTons} ton</td>
                  <td className="p-3 text-on-surface-variant">{trx.destinationCenterName}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        trx.status === "entregado" ? "bg-primary-fixed text-on-primary-fixed" : trx.status === "en_camino" ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {trx.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
