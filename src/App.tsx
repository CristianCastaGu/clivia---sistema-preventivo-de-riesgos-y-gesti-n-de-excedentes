import React, { useState } from "react";
import { Header } from "./components/Header";
import { DashboardView } from "./components/DashboardView";
import { MapView } from "./components/MapView";
import { CultivationModule } from "./components/CultivationModule";
import { ChatBotView } from "./components/ChatBotView";
import { AlertsCenterView } from "./components/AlertsCenterView";
import { FoodBankLogisticsView } from "./components/FoodBankLogisticsView";
import { IncidentReportModal } from "./components/IncidentReportModal";
import { DeviceFrameWrapper } from "./components/DeviceFrameWrapper";
import { 
  INITIAL_ALERTS, 
  INITIAL_PLOTS, 
  INITIAL_FOOD_BANKS, 
  INITIAL_INCIDENTS, 
  INITIAL_TRANSACTIONS 
} from "./data/mockData";
import { UserRole, AlertSeverity, CropPlot, CitizenIncident, SurplusTransaction } from "./types";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [userRole, setUserRole] = useState<UserRole>("productor");
  const [isMobileDeviceMode, setIsMobileDeviceMode] = useState<boolean>(false);

  // Core Data States
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [plots, setPlots] = useState<CropPlot[]>(INITIAL_PLOTS);
  const [foodBanks, setFoodBanks] = useState(INITIAL_FOOD_BANKS);
  const [incidents, setIncidents] = useState<CitizenIncident[]>(INITIAL_INCIDENTS);
  const [transactions, setTransactions] = useState<SurplusTransaction[]>(INITIAL_TRANSACTIONS);

  // Selected plot for surplus workflow
  const [selectedPlotForSurplus, setSelectedPlotForSurplus] = useState<CropPlot | null>(null);

  // Modal for new incident
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateIncident = (newInc: CitizenIncident) => {
    setIncidents([newInc, ...incidents]);
    showToast(`✅ Reporte de incidente registrado con éxito: "${newInc.title}"`);
  };

  const handleSelectPlotForSurplus = (plot: CropPlot) => {
    setSelectedPlotForSurplus(plot);
    setCurrentTab("cultivos");
  };

  // Determine overall severity
  const overallSeverity: AlertSeverity = alerts.some(a => a.severity === "rojo")
    ? "rojo"
    : alerts.some(a => a.severity === "amarillo")
    ? "amarillo"
    : "verde";

  const renderActiveView = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <DashboardView
            alerts={alerts}
            plots={plots}
            incidents={incidents}
            transactions={transactions}
            userRole={userRole}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenNewIncident={() => setIsIncidentModalOpen(true)}
            onSelectPlotForSurplus={handleSelectPlotForSurplus}
          />
        );
      case "mapa":
        return (
          <MapView
            alerts={alerts}
            plots={plots}
            foodBanks={foodBanks}
            incidents={incidents}
            onOpenNewIncident={() => setIsIncidentModalOpen(true)}
            onNavigateToSurplus={handleSelectPlotForSurplus}
          />
        );
      case "cultivos":
        return (
          <CultivationModule
            plots={plots}
            setPlots={setPlots}
            foodBanks={foodBanks}
            transactions={transactions}
            setTransactions={setTransactions}
            preselectedPlot={selectedPlotForSurplus}
          />
        );
      case "chat":
        return <ChatBotView userRole={userRole} />;
      case "alertas":
        return <AlertsCenterView alerts={alerts} />;
      case "bancos":
        return (
          <FoodBankLogisticsView
            foodBanks={foodBanks}
            transactions={transactions}
            onSelectPlotForSurplus={() => setCurrentTab("cultivos")}
          />
        );
      default:
        return (
          <DashboardView
            alerts={alerts}
            plots={plots}
            incidents={incidents}
            transactions={transactions}
            userRole={userRole}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenNewIncident={() => setIsIncidentModalOpen(true)}
            onSelectPlotForSurplus={handleSelectPlotForSurplus}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased">
      <DeviceFrameWrapper
        isMobileMode={isMobileDeviceMode}
        setIsMobileMode={setIsMobileDeviceMode}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      >
        {/* Header Navigation */}
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          userRole={userRole}
          setUserRole={setUserRole}
          isMobileDeviceMode={isMobileDeviceMode}
          setIsMobileDeviceMode={setIsMobileDeviceMode}
          overallSeverity={overallSeverity}
          activeAlerts={alerts}
          onOpenNewIncident={() => setIsIncidentModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {renderActiveView()}
        </main>
      </DeviceFrameWrapper>

      {/* Incident Report Modal */}
      <IncidentReportModal
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
        onSubmit={handleCreateIncident}
        userRole={userRole}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
