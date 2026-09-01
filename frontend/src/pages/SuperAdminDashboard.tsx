import React, { useState } from 'react';
import { MOCK_SCHOOLS } from '../services/api';
import { Building2, Plus, Users, GraduationCap, ShieldCheck, CheckCircle2, Search, Zap } from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const [schools, setSchools] = useState(MOCK_SCHOOLS);
  const [showModal, setShowModal] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [region, setRegion] = useState('');

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName) return;

    const created = {
      id: schools.length + 1,
      name: newSchoolName,
      registration_number: regNo || `S.${Math.floor(1000 + Math.random() * 9000)}/001`,
      school_type: 'mixed' as const,
      ownership: 'private' as const,
      region: region || 'Dar es Salaam',
      district: 'Kinondoni',
      phone: '+255 700 111 222',
      email: `admin@${newSchoolName.toLowerCase().replace(/\s+/g, '')}.ac.tz`,
      is_active: true,
      students_count: 0,
      staff_count: 0,
    };

    setSchools([created, ...schools]);
    setShowModal(false);
    setNewSchoolName('');
    setRegNo('');
    setRegion('');
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-blue-800 to-sky-900 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/15 text-sky-100 border border-white/20 px-3.5 py-1 rounded-full text-xs font-bold mb-3 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-sky-300" />
            <span>Haula Technologies Multi-Tenant Platform</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight leading-tight">Super Admin Platform Overview</h1>
          <p className="text-xs text-sky-100 font-medium mt-1">Manage secondary school tenant accounts, active subscriptions, and system-wide SaaS settings.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-white hover:bg-sky-50 text-sky-900 font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 border border-white"
        >
          <Plus className="w-4 h-4 text-sky-700" />
          <span>Register New School</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Schools</span>
            <div className="p-3 rounded-xl bg-sky-50 text-sky-600">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{schools.length}</p>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            100% Database Scoped
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enrolled Students</span>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">2,410</p>
          <span className="text-xs text-slate-500 font-medium mt-2 block">Across all 3 registered schools</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teachers & Staff</span>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">130</p>
          <span className="text-xs text-indigo-600 font-bold mt-2 block">Spatie RBAC Enabled</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly SaaS Revenue</span>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">TZS 14.2M</p>
          <span className="text-xs text-amber-600 font-bold mt-2 block">Enterprise Subscription</span>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-sky-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-black text-slate-900 text-lg">Registered Secondary Schools</h3>
            <p className="text-xs text-slate-500 mt-0.5">Isolated multi-tenant database contexts</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search school name or Reg No..."
              className="bg-sky-50/50 border border-sky-200 text-slate-800 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-sky-500 w-64 font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sky-50/60 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-sky-100">
                <th className="py-4 px-6">School Name</th>
                <th className="py-4 px-6">Reg Number</th>
                <th className="py-4 px-6">Type & Ownership</th>
                <th className="py-4 px-6">Region</th>
                <th className="py-4 px-6">Students</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100 text-xs font-semibold text-slate-700">
              {schools.map((school) => (
                <tr key={school.id} className="hover:bg-sky-50/40 transition-all">
                  <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-black flex items-center justify-center text-base shadow-md shadow-sky-600/20">
                      {school.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-black text-slate-900">{school.name}</span>
                      <p className="text-[11px] text-slate-400 font-medium">{school.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-600 font-bold">{school.registration_number}</td>
                  <td className="py-4 px-6 capitalize">
                    <span className="inline-block px-3 py-1 rounded-lg bg-sky-50 text-sky-800 font-bold text-[11px] border border-sky-200">
                      {school.school_type} • {school.ownership}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{school.region || 'Dar es Salaam'}</td>
                  <td className="py-4 px-6 font-black text-slate-900">{school.students_count || 0}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active Tenant
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline">
                      Configure Modules
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-sky-100">
            <h3 className="text-xl font-black text-slate-900 mb-1">Register New Secondary School</h3>
            <p className="text-xs text-slate-500 mb-6">Create a new isolated multi-tenant school account.</p>

            <form onSubmit={handleCreateSchool} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">School Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. St. Joseph Girls Secondary School"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  className="w-full bg-sky-50/50 border border-sky-200 text-slate-800 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-sky-600 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registration No.</label>
                  <input
                    type="text"
                    placeholder="S.4820/002"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className="w-full bg-sky-50/50 border border-sky-200 text-slate-800 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-sky-600 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Region</label>
                  <input
                    type="text"
                    placeholder="Arusha"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-sky-50/50 border border-sky-200 text-slate-800 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-sky-600 font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-sky-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs rounded-xl shadow-md"
                >
                  Create School Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};