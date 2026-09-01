import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { SchoolAdminDashboard } from './pages/SchoolAdminDashboard';
import { TeacherPortal } from './pages/TeacherPortal';
import { AccountantPortal } from './pages/AccountantPortal';
import { ParentPortal } from './pages/ParentPortal';
import { StudentPortal } from './pages/StudentPortal';
import { StudentDirectory } from './components/StudentDirectory';
import { StaffDirectory } from './components/StaffDirectory';
import { AttendanceManagement } from './components/AttendanceManagement';
import { ExamsManagement } from './components/ExamsManagement';
import { FinanceManagement } from './components/FinanceManagement';
import { AnnouncementsManagement } from './components/AnnouncementsManagement';

const MainLayout: React.FC = () => {
  const { user, role, isRestoring } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isRestoring) {
    return <div className="min-h-screen grid place-items-center bg-slate-100 text-sm font-semibold text-slate-600">Loading E-Schools…</div>;
  }

  if (!user) {
    return <Login />;
  }

  const renderDashboardContent = () => {
    if (activeTab === 'students') {
      return <StudentDirectory />;
    }
    if (activeTab === 'staff') {
      return <StaffDirectory />;
    }
    if (activeTab === 'attendance') {
      return <AttendanceManagement />;
    }
    if (activeTab === 'exams' || activeTab === 'marks' || activeTab === 'results') {
      return <ExamsManagement />;
    }
    if (activeTab === 'finance' || activeTab === 'invoices' || activeTab === 'payments' || activeTab === 'debtors' || activeTab === 'fees') {
      return <FinanceManagement />;
    }
    if (activeTab === 'announcements') {
      return <AnnouncementsManagement />;
    }

    switch (role) {
      case 'school_admin':
      case 'headmaster':
      case 'academic_master':
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
