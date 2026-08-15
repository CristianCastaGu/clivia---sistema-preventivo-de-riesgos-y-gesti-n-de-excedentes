import React, { useState } from "react";
import { 
  Building2, 
  Truck, 
  Heart, 
  TrendingUp, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Package, 
  ArrowRight,
  Filter,
  Sparkles
} from "lucide-react";
import { FoodBankCenter, SurplusTransaction } from "../types";

interface FoodBankLogisticsViewProps {
  foodBanks: FoodBankCenter[];
  transactions: SurplusTransaction[];
  onSelectPlotForSurplus?: () => void;
}

export const FoodBankLogisticsView: React.FC<FoodBankLogisticsViewProps> = ({
  foodBanks,
  transactions,
  onSelectPlotForSurplus,
}) => {
  const [filterType, setFilterType] = useState<string>("todos");

  const totalCapacity = foodBanks.reduce((a, c) => a + c.storageCapacityTons, 0);
  const totalStock = foodBanks.reduce((a, c) => a + c.currentStockTons, 0);
  const totalBeneficiaries = foodBanks.reduce((a, c) => a + c.beneficiariesServedDaily, 0);

  const filteredBanks = foodBanks.filter(fb => {
    if (filterType === "todos") return true;
    return fb.type === filterType;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Banner Overview */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-emerald-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Heart className="w-3.5 h-3.5" />
              <span>Red Solidaria de Bancos de Alimentos y Comedores</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              Logística Comunitaria y Redistribución de Excedentes
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Canalización directa desde parcelas amenazadas por contingencias climáticas hacia bancos de alimentos, albergues temporales y comedores comunitarios.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-700/80">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Almacenamiento Total</span>
              <strong className="text-lg font-black text-emerald-400">{totalCapacity} Ton</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Beneficiarios Diarios</span>
              <strong className="text-lg font-black text-white">{totalBeneficiaries.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Storage & Rescue Centers */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span>Centros de Acopio y Bancos Habilitados ({filteredBanks.length})</span>
          </h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: "todos", label: "Todos" },
              { id: "banco_alimentos", label: "Bancos de Alimentos" },
              { id: "comedor_comunitario", label: "Comedores" },
              { id: "albergue_temporal", label: "Albergues Temporales" },
              { id: "centro_acopio", label: "Centros de Acopio" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  filterType === f.id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
              <div
                key={center.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                      {center.type.replace("_", " ")}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{center.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {center.address}, {center.region}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800">{center.currentStockTons} / {center.storageCapacityTons} Ton</span>
                    <span className="text-[10px] text-slate-400 block">{occupancyPercent}% ocupación</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${occupancyPercent > 80 ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ width: `${occupancyPercent}%` }}
                  />
                </div>

                {/* Details & Needs */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Cámara de Frío:</span>
                    <strong className={center.refrigerationAvailable ? "text-emerald-700" : "text-slate-500"}>
                      {center.refrigerationAvailable ? "✅ Habilitada" : "❌ Solo seco"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Atención Diaria:</span>
                    <strong className="text-slate-800">{center.beneficiariesServedDaily.toLocaleString()} personas</strong>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <span className="font-semibold text-slate-700">Demanda de Alimentos Frescos:</span>
                  <div className="flex flex-wrap gap-1">
                    {center.urgentNeeds.map((need, idx) => (
                      <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {need}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Contacto: <strong>{center.contactPerson}</strong>
                  </div>
                  <a
                    href={`tel:${center.phone}`}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Llamar</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Shipments & Delivery Tracking */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-600" />
          <span>Bitácora de Despachos y Trazabilidad de Donaciones</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3">Folio / Manifiesto</th>
                <th className="p-3">Cultivo Rescatado</th>
                <th className="p-3">Productor / Parcela</th>
                <th className="p-3">Volumen</th>
                <th className="p-3">Destino</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Impacto Social</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-mono font-bold text-slate-900">{trx.taxVoucherCode}</td>
                  <td className="p-3 font-semibold text-emerald-900">{trx.cropName}</td>
                  <td className="p-3 text-slate-600">{trx.farmerName}</td>
                  <td className="p-3 font-bold text-slate-900">{trx.rescuedTons} Ton</td>
                  <td className="p-3 text-slate-600">{trx.destinationCenterName}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      trx.status === "entregado" ? "bg-emerald-100 text-emerald-800" :
                      trx.status === "en_camino" ? "bg-amber-100 text-amber-800" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {trx.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">
                    <span className="font-semibold text-emerald-700">{trx.mealsGenerated.toLocaleString()}</span> raciones
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
