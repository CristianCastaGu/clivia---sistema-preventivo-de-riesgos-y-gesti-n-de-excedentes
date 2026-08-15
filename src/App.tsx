import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { OnboardingView } from "./components/OnboardingView";
import { DashboardView } from "./components/DashboardView";
import { MapView } from "./components/MapView";
import { CultivationModule } from "./components/CultivationModule";
import { FloatingAssistant } from "./components/FloatingAssistant";
import { AlertsCenterView } from "./components/AlertsCenterView";
import { FoodBankLogisticsView } from "./components/FoodBankLogisticsView";
import { SurplusMarketplaceView } from "./components/SurplusMarketplaceView";
import { EmergencyDirectoryView } from "./components/EmergencyDirectoryView";
import { IncidentReportModal } from "./components/IncidentReportModal";
import {
  INITIAL_ALERTS,
  INITIAL_PLOTS,
  INITIAL_FOOD_BANKS,
  INITIAL_INCIDENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_SURPLUS_LISTINGS,
} from "./data/mockData";
import { UserRole, AlertSeverity, CropPlot, CitizenIncident, SurplusTransaction, UserProfile, UserLocation } from "./types";

const PROFILE_STORAGE_KEY = "clivia.profile";

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as UserProfile) : null;
    } catch {
      return null;
    }
  });

  const [currentTab, setCurrentTab] = useState<string>("dashboard");

  // Core Data States
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [plots, setPlots] = useState<CropPlot[]>(INITIAL_PLOTS);
  const [foodBanks, setFoodBanks] = useState(INITIAL_FOOD_BANKS);
  const [incidents, setIncidents] = useState<CitizenIncident[]>(INITIAL_INCIDENTS);
  const [transactions, setTransactions] = useState<SurplusTransaction[]>(INITIAL_TRANSACTIONS);
  const [surplusListings] = useState(INITIAL_SURPLUS_LISTINGS);

  // Selected plot for surplus workflow
  const [selectedPlotForSurplus, setSelectedPlotForSurplus] = useState<CropPlot | null>(null);

  // Modal for new incident
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOnboardingComplete = (role: UserRole, location: UserLocation, displayName: string) => {
    setProfile({ role, displayName, location });
    setCurrentTab("dashboard");
  };

  const handleChangeRole = () => {
    setProfile(null);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
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
  const overallSeverity: AlertSeverity = alerts.some((a) => a.severity === "rojo")
    ? "rojo"
    : alerts.some((a) => a.severity === "amarillo")
    ? "amarillo"
    : "verde";

  if (!profile) {
    return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  const renderActiveView = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <DashboardView
            alerts={alerts}
            plots={plots}
            incidents={incidents}
            transactions={transactions}
            userRole={profile.role}
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
      case "alertas":
        return <AlertsCenterView alerts={alerts} />;
      case "bancos":
        return <SurplusMarketplaceView listings={surplusListings} foodBanks={foodBanks} transactions={transactions} />;
      case "directorio":
        return <EmergencyDirectoryView alerts={alerts} />;
      default:
        return (
          <DashboardView
            alerts={alerts}
            plots={plots}
            incidents={incidents}
            transactions={transactions}
            userRole={profile.role}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenNewIncident={() => setIsIncidentModalOpen(true)}
            onSelectPlotForSurplus={handleSelectPlotForSurplus}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans antialiased">
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        profile={profile}
        onChangeRole={handleChangeRole}
        overallSeverity={overallSeverity}
        activeAlerts={alerts}
        onOpenNewIncident={() => setIsIncidentModalOpen(true)}
      />

      <main className="pt-16 md:pl-64 pb-20 md:pb-8 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{renderActiveView()}</div>
      </main>

      <IncidentReportModal
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
        onSubmit={handleCreateIncident}
        userRole={profile.role}
      />

      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-4 md:left-[calc(16rem+1.5rem)] z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <span>{toastMessage}</span>
        </div>
      )}

      <FloatingAssistant userRole={profile.role} />
    </div>
  );
}
