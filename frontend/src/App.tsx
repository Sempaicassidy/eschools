import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleSwitcher } from './components/RoleSwitcher';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { SchoolAdminDashboard } from './pages/SchoolAdminDashboard';
import { TeacherPortal } from './pages/TeacherPortal';
import { AccountantPortal } from './pages/AccountantPortal';
import { ParentPortal } from './pages/ParentPortal';
import { StudentPortal } from './pages/StudentPortal';

const MainLayout: React.FC = () => {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <Login />;
  }

  const renderDashboardContent = () => {
    switch (role) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'school_admin':
      case 'headmaster':
        return <SchoolAdminDashboard />;
      case 'teacher':
        return <TeacherPortal />;
      case 'accountant':
        return <AccountantPortal />;
      case 'parent':
        return <ParentPortal />;
      case 'student':
        return <StudentPortal />;
      default:
        return <SchoolAdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased">
      {/* Top Floating Demo Role Switcher */}
      <RoleSwitcher />

      <div className="flex-1 flex min-h-screen">
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="p-6 md:p-8 flex-1 max-w-[1600px] w-full mx-auto">
            {renderDashboardContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;