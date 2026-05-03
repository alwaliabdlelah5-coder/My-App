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
import ProtectedRoute from "@/components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      <Route path="/">
        {() => <ProtectedRoute component={Dashboard} allowedRoles={['admin','doctor','nurse','lab_tech','receptionist','pharmacist']} />}
      </Route>
      <Route path="/patients">
        {() => <ProtectedRoute component={PatientsPage} allowedRoles={['admin','doctor','nurse','receptionist','lab_tech']} />}
      </Route>
      <Route path="/appointments">
        {() => <ProtectedRoute component={AppointmentsPage} allowedRoles={['admin','doctor','receptionist']} />}
      </Route>
      <Route path="/clinic">
        {() => <ProtectedRoute component={ClinicPage} allowedRoles={['admin','doctor','nurse']} />}
      </Route>
      <Route path="/queue">
        {() => <ProtectedRoute component={QueuePage} allowedRoles={['admin','doctor','nurse','lab_tech','receptionist','pharmacist']} />}
      </Route>
      <Route path="/lab">
        {() => <ProtectedRoute component={LabPage} allowedRoles={['admin','doctor','lab_tech']} />}
      </Route>
      <Route path="/pharmacy">
        {() => <ProtectedRoute component={PharmacyPage} allowedRoles={['admin','pharmacist','doctor']} />}
      </Route>
      <Route path="/inventory">
        {() => <ProtectedRoute component={InventoryPage} allowedRoles={['admin','pharmacist']} />}
      </Route>
      <Route path="/finance">
        {() => <ProtectedRoute component={FinancePage} allowedRoles={['admin']} />}
      </Route>
      <Route path="/hr">
        {() => <ProtectedRoute component={HRPage} allowedRoles={['admin']} />}
      </Route>
      <Route path="/users">
        {() => <ProtectedRoute component={UsersPage} allowedRoles={['admin']} />}
      </Route>
      <Route path="/reports">
        {() => <ProtectedRoute component={ReportsPage} allowedRoles={['admin','doctor']} />}
      </Route>
      <Route path="/settings">
        {() => <ProtectedRoute component={SettingsPage} allowedRoles={['admin','doctor','nurse','lab_tech','receptionist','pharmacist']} />}
      </Route>
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
