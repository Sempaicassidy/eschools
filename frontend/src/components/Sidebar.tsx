import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  CreditCard,
  Bell,
  BookOpen,
  LogOut,
  FileText,
  Building,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { role, user, logout } = useAuth();

  const getMenuItems = () => {
    switch (role) {
      case 'school_admin':
      case 'headmaster':
        return [
          { id: 'dashboard', label: 'School Overview', icon: LayoutDashboard },
          { id: 'students', label: 'Student Directory', icon: GraduationCap },
          { id: 'staff', label: 'Teachers & Staff', icon: Users },
          { id: 'attendance', label: 'Daily Attendance', icon: CalendarCheck },
          { id: 'exams', label: 'Exams & Results', icon: Award },
          { id: 'finance', label: 'Fees & Finance', icon: CreditCard },
          { id: 'announcements', label: 'Announcements', icon: Bell },
        ];
      case 'admission_officer':
        return [
          { id: 'students', label: 'Admissions & Directory', icon: GraduationCap },
          { id: 'announcements', label: 'School Announcements', icon: Bell },
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Teacher Portal', icon: LayoutDashboard },
          { id: 'attendance', label: 'Mark Attendance', icon: CalendarCheck },
          { id: 'marks', label: 'Enter Exam Marks', icon: Award },
          { id: 'students', label: 'My Students', icon: GraduationCap },
          { id: 'announcements', label: 'Announcements', icon: Bell },
        ];
      case 'accountant':
        return [
          { id: 'dashboard', label: 'Finance Summary', icon: LayoutDashboard },
          { id: 'invoices', label: 'Student Invoices', icon: FileText },
          { id: 'payments', label: 'Record Payments', icon: CreditCard },
          { id: 'debtors', label: 'Fee Debtors List', icon: Users },
        ];
      case 'parent':
        return [
          { id: 'dashboard', label: 'My Child Overview', icon: LayoutDashboard },
          { id: 'attendance', label: 'Attendance History', icon: CalendarCheck },
          { id: 'results', label: 'Report Cards & Marks', icon: Award },
          { id: 'fees', label: 'Fee Statement', icon: CreditCard },
          { id: 'announcements', label: 'School Notices', icon: Bell },
        ];
      case 'student':
        return [
          { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
          { id: 'results', label: 'Exam Grades', icon: Award },
          { id: 'attendance', label: 'My Attendance', icon: CalendarCheck },
          { id: 'materials', label: 'Learning Materials', icon: BookOpen },
        ];
      default:
        return [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white border-r border-sky-100 min-h-screen flex flex-col justify-between p-4 shadow-sm shrink-0">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-4 border-b border-sky-100 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-sky-600/30">
            H
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">Haula eSchool</h1>
            <span className="text-[11px] text-sky-600 font-bold tracking-wider uppercase">Smart Campus Platform</span>
          </div>
        </div>

        {/* School Context Badge */}
        {user?.school && (
          <div className="bg-sky-50/80 border border-sky-200/80 rounded-xl p-3 mb-6">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-sky-700">
              <Building className="w-3.5 h-3.5" />
              <span>School Installation</span>
            </div>
            <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{user.school.name}</p>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-600/25'
                    : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer */}
      <div className="pt-4 border-t border-sky-100">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center font-extrabold text-sm">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
            <p className="text-[10px] font-semibold text-sky-600 truncate capitalize">{role.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all border border-sky-200"
        >
          <LogOut className="w-3.5 h-3.5 text-sky-600" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
