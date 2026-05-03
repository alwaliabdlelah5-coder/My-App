import { Switch, Route, Router as WouterRouter } from "wouter";
import Dashboard from "@/pages/Dashboard";
import PatientsPage from "@/pages/PatientsPage";
import AppointmentsPage from "@/pages/AppointmentsPage";
import ClinicPage from "@/pages/ClinicPage";
import QueuePage from "@/pages/QueuePage";
import LabPage from "@/pages/LabPage";
import PharmacyPage from "@/pages/PharmacyPage";
import InventoryPage from "@/pages/InventoryPage";
import FinancePage from "@/pages/FinancePage";
import HRPage from "@/pages/HRPage";
import ReportsPage from "@/pages/ReportsPage";
import UsersPage from "@/pages/UsersPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/not-found";
import { FirebaseSeeder } from "@/components/FirebaseSeeder";
import { ToastProvider } from "@/components/Toast";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/pages/LoginPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/patients" component={PatientsPage} />
      <Route path="/appointments" component={AppointmentsPage} />
      <Route path="/clinic" component={ClinicPage} />
      <Route path="/queue" component={QueuePage} />
      <Route path="/lab" component={LabPage} />
      <Route path="/pharmacy" component={PharmacyPage} />
      <Route path="/inventory" component={InventoryPage} />
      <Route path="/finance" component={FinancePage} />
      <Route path="/hr" component={HRPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/users" component={UsersPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <>
      <FirebaseSeeder />
      <Router />
    </>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppContent />
        </WouterRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
