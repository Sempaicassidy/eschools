import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import { Sparkles, ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, switchRole } = useAuth();
  const [email, setEmail] = useState('admin@haulaeschool.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login('demo-token-123', {
      id: 1,
      school_id: 1,
      name: 'Haula Admin User',
      email: email,
      user_type: 'super_admin',
      is_active: true,
      school: {
        id: 1,
        name: 'Haula International Secondary School',
        registration_number: 'S.4820/001',
        school_type: 'mixed',
        ownership: 'private',
        is_active: true,
      },
    });
  };

  const handleDemoLogin = (r: UserRole) => {
    switchRole(r);
    login(`demo-token-${r}`, {
      id: 1,
      school_id: 1,
      name: r === 'super_admin' ? 'Haula Super Admin' : r === 'headmaster' || r === 'school_admin' ? 'Dr. Elizabeth Mwangi (Headmistress)' : r === 'teacher' ? 'Mwl. Christopher Mollel' : r === 'accountant' ? 'Francis Kibona (Bursar)' : r === 'parent' ? 'Juma Mkwawa (Parent)' : 'Baraka Juma Mkwawa (Student)',
      email: `${r}@haulaschools.ac.tz`,
      user_type: r,
      is_active: true,
      school: {
        id: 1,
        name: 'Haula International Secondary School',
        registration_number: 'S.4820/001',
        school_type: 'mixed',
        ownership: 'private',
        is_active: true,
      },
    });
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white border border-sky-100 rounded-3xl p-8 shadow-xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-600 mx-auto flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-sky-600/30 mb-4">
            H
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Haula eSchool</h2>
          <p className="text-xs font-bold text-sky-600 uppercase tracking-wider mt-1">Smart Campus & School Transformation Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address or Phone</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-sky-50/50 border border-sky-200 text-slate-900 font-semibold text-xs pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-sky-50/50 border border-sky-200 text-slate-900 font-semibold text-xs pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-black text-xs rounded-xl shadow-lg shadow-sky-600/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In to Executive Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-sky-100 pt-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider text-[11px]">Instant One-Click Demo Portals:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              onClick={() => handleDemoLogin('super_admin')}
              className="px-3.5 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-900 rounded-xl border border-sky-200 text-left transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Super Admin</span>
            </button>
            <button
              onClick={() => handleDemoLogin('school_admin')}
              className="px-3.5 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-900 rounded-xl border border-sky-200 text-left transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Headmaster</span>
            </button>
            <button
              onClick={() => handleDemoLogin('teacher')}
              className="px-3.5 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-900 rounded-xl border border-sky-200 text-left transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Teacher</span>
            </button>
            <button
              onClick={() => handleDemoLogin('accountant')}
              className="px-3.5 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-900 rounded-xl border border-sky-200 text-left transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Accountant</span>
            </button>
            <button
              onClick={() => handleDemoLogin('parent')}
              className="px-3.5 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-900 rounded-xl border border-sky-200 text-left transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Parent Portal</span>
            </button>
            <button
              onClick={() => handleDemoLogin('student')}
              className="px-3.5 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-900 rounded-xl border border-sky-200 text-left transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Student Portal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};