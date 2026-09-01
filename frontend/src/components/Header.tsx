import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, ShieldCheck, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, role } = useAuth();

  return (
    <header className="bg-white border-b border-sky-100 px-8 py-4 flex items-center justify-between shadow-xs sticky top-0 z-30">
      {/* Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search students, staff, admission numbers, invoices..."
            className="w-full bg-sky-50/50 text-slate-800 placeholder-slate-400 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
          />
        </div>
      </div>

      {/* Header Badges & Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-sky-50 text-sky-700 border border-sky-200 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Haula eSchool SaaS v1.0</span>
        </div>

        <button className="relative p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all border border-transparent hover:border-sky-200">
          <Bell className="w-5 h-5" />
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-4 border-l border-sky-100">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 leading-snug">{user?.name}</p>
            <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-sky-600">
              <ShieldCheck className="w-3 h-3 text-sky-500" />
              <span className="capitalize">{role.replace('_', ' ')}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-sky-600/25">
            {user?.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};