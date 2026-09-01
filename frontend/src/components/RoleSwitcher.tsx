import React from 'react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import { Shield, ShieldAlert, GraduationCap, BookOpen, CreditCard, Users, UserCheck } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { role, switchRole } = useAuth();

  const rolesList: { id: UserRole; label: string; icon: any }[] = [
    { id: 'school_admin', label: 'School Admin / Headmaster', icon: Shield },
    { id: 'teacher', label: 'Teacher Portal', icon: BookOpen },
    { id: 'accountant', label: 'Bursar / Accountant', icon: CreditCard },
    { id: 'parent', label: 'Parent Portal', icon: Users },
    { id: 'student', label: 'Student Portal', icon: GraduationCap },
  ];

  return (
    <div className="bg-sky-900 text-white px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md border-b border-sky-800">
      <div className="flex items-center gap-2 font-semibold">
        <UserCheck className="w-4 h-4 text-sky-300" />
        <span className="text-sky-100 font-bold uppercase tracking-wider text-[11px]">Executive Portal Switcher:</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {rolesList.map((r) => {
          const Icon = r.icon;
          const isActive = role === r.id;
          return (
            <button
              key={r.id}
              onClick={() => switchRole(r.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                isActive
                  ? 'bg-white text-sky-950 border-white shadow-md ring-2 ring-sky-300 scale-105'
                  : 'bg-sky-800/70 hover:bg-sky-800 text-sky-100 border-sky-700/60 hover:border-sky-500'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};