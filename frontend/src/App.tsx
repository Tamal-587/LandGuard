import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DocumentHashModal } from './components/DocumentHashModal';
import { Dashboard } from './pages/Dashboard';
import { LandRecords } from './pages/LandRecords';
import { RecordDetails } from './pages/RecordDetails';
import { VerifyLand } from './pages/VerifyLand';
import { FraudAlerts } from './pages/FraudAlerts';
import { MutationHistoryPage } from './pages/MutationHistoryPage';
import { VerificationReports } from './pages/VerificationReports';
import { ReportDetails } from './pages/ReportDetails';
import { About } from './pages/About';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FraudGraphPage } from './pages/FraudGraphPage';
import { FraudDnaPage } from './pages/FraudDnaPage';
import { SimulationPage } from './pages/SimulationPage';
import { TimelinePage } from './pages/TimelinePage';
import { LanguageProvider } from './context/LanguageContext';
import { DemoAuthProvider } from './context/DemoAuthContext';

const Workspace: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const location = useLocation();

  if (location.pathname === '/login') return <LoginPage />;
  if (location.pathname === '/register') return <RegisterPage />;
  if (location.pathname === '/' || location.pathname === '/welcome') return <LandingPage />;

  return (
    <div className="min-h-screen bg-[#F4F6F2] flex flex-col text-slate-800">
      <Navbar
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenDocModal={() => setDocModalOpen(true)}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenDocModal={() => setDocModalOpen(true)}
        />
        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/graph" element={<FraudGraphPage />} />
              <Route path="/fraud-dna" element={<FraudDnaPage />} />
              <Route path="/simulation" element={<SimulationPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/records" element={<LandRecords />} />
              <Route path="/records/:recordId" element={<RecordDetails />} />
              <Route path="/verify" element={<VerifyLand />} />
              <Route path="/alerts" element={<FraudAlerts />} />
              <Route path="/mutations" element={<MutationHistoryPage />} />
              <Route path="/reports" element={<VerificationReports />} />
              <Route path="/reports/:reportId" element={<ReportDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
      <DocumentHashModal isOpen={docModalOpen} onClose={() => setDocModalOpen(false)} />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <DemoAuthProvider>
        <Router>
          <Workspace />
        </Router>
      </DemoAuthProvider>
    </LanguageProvider>
  );
}

export default App;
