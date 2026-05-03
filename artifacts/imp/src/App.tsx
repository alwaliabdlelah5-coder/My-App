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

function App() {
  return (
    <ToastProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <FirebaseSeeder />
        <Router />
      </WouterRouter>
    </ToastProvider>
  );
}

export default App;
