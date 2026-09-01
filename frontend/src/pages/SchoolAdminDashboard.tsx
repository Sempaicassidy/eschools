import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Building2, GraduationCap, ShieldCheck, UserPlus, Users } from 'lucide-react';
import { AcademicSetup } from '../components/AcademicSetup';

type Stats = { students: number; staff: number; users: number };
type Account = { id: number; name: string; email: string; phone?: string; user_type: string; is_active: boolean };
type School = { name: string; motto?: string; phone?: string; email?: string; region?: string; district?: string; school_type: string; ownership: string };

const emptyUser = { name: '', email: '', phone: '', user_type: 'teacher', password: '' };

export const SchoolAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ students: 0, staff: 0, users: 0 });
  const [users, setUsers] = useState<Account[]>([]);
  const [school, setSchool] = useState<School | null>(null);
  const [newUser, setNewUser] = useState(emptyUser);
  const [showUserForm, setShowUserForm] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const load = async () => {
    const [dashboard, accounts, profile] = await Promise.all([api.get('/admin/dashboard'), api.get('/admin/users'), api.get('/school/profile')]);
    setStats(dashboard.data.data);
    setUsers(accounts.data.data.data);
    setSchool(profile.data.data);
  };

  useEffect(() => { load().catch(() => setNotice('Unable to load admin data.')); }, []);

  const createUser = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await api.post('/admin/users', newUser);
      setNewUser(emptyUser); setShowUserForm(false); setNotice('User account created successfully.'); load();
    } catch (error: any) { setNotice(error.response?.data?.message || 'Unable to create the account.'); }
  };

  const saveSchool = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!school) return;
    try {
      const profileData = {
        name: school.name,
        motto: school.motto || '',
        phone: school.phone || '',
        email: school.email || '',
        school_type: school.school_type,
        ownership: school.ownership,
      };
      const request = logoFile
        ? (() => {
            const formData = new FormData();
            Object.entries(profileData).forEach(([key, value]) => formData.append(key, value));
            formData.append('logo', logoFile);
            return api.post('/school/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' }, params: { _method: 'PUT' } });
          })()
        : api.put('/school/profile', profileData);
      const { data } = await request;
      setSchool(data.data); setLogoFile(null); setNotice('School settings saved.');
    }
    catch (error: any) { setNotice(error.response?.data?.message || 'Unable to save school settings.'); }
  };

  const toggleUser = async (user: Account) => {
    try { await api.put(`/admin/users/${user.id}`, { is_active: !user.is_active }); setNotice(`Account ${user.is_active ? 'deactivated' : 'activated'}.`); load(); }
    catch (error: any) { setNotice(error.response?.data?.message || 'Unable to update account.'); }
  };

  const cards = [
    { label: 'Active students', value: stats.students, icon: GraduationCap, color: 'bg-sky-50 text-sky-700' },
    { label: 'Active staff', value: stats.staff, icon: Users, color: 'bg-indigo-50 text-indigo-700' },
    { label: 'System accounts', value: stats.users, icon: ShieldCheck, color: 'bg-emerald-50 text-emerald-700' },
  ];

  return <div className="space-y-6">
    <div className="rounded-3xl bg-gradient-to-r from-sky-800 to-blue-950 p-7 text-white shadow-lg"><p className="text-xs font-bold uppercase tracking-widest text-sky-200">Administration</p><h1 className="mt-2 text-3xl font-black">School Control Centre</h1><p className="mt-2 text-sm text-sky-100">Manage the school profile, system accounts, and core setup.</p></div>
    {notice && <button onClick={() => setNotice(null)} className="w-full rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-left text-sm font-medium text-sky-800">{notice}</button>}
    <div className="grid gap-4 md:grid-cols-3">{cards.map(({ label, value, icon: Icon, color }) => <div key={label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span><span className={`rounded-xl p-3 ${color}`}><Icon className="h-5 w-5" /></span></div><p className="mt-5 text-3xl font-black text-slate-900">{value}</p></div>)}</div>
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"><div className="mb-6 flex items-center gap-3"><span className="rounded-xl bg-sky-50 p-3 text-sky-700"><Building2 className="h-5 w-5" /></span><div><h2 className="font-black text-slate-900">School Settings</h2><p className="text-xs text-slate-500">These details appear on the login screen and reports.</p></div></div>{school && <form onSubmit={saveSchool} className="grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2 text-xs font-bold text-slate-700">School logo<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="mt-1.5 block w-full text-xs text-slate-600" /></label><label className="sm:col-span-2 text-xs font-bold text-slate-700">School name<input value={school.name} onChange={e => setSchool({ ...school, name: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" required /></label><label className="sm:col-span-2 text-xs font-bold text-slate-700">Motto<input value={school.motto || ''} onChange={e => setSchool({ ...school, motto: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label><label className="text-xs font-bold text-slate-700">Phone<input value={school.phone || ''} onChange={e => setSchool({ ...school, phone: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label><label className="text-xs font-bold text-slate-700">Email<input type="email" value={school.email || ''} onChange={e => setSchool({ ...school, email: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label><label className="text-xs font-bold text-slate-700">School type<select value={school.school_type} onChange={e => setSchool({ ...school, school_type: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option value="day">Day</option><option value="boarding">Boarding</option><option value="mixed">Mixed</option></select></label><label className="text-xs font-bold text-slate-700">Ownership<select value={school.ownership} onChange={e => setSchool({ ...school, ownership: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option value="private">Private</option><option value="public">Public</option><option value="faith_based">Faith based</option><option value="ngo">NGO</option></select></label><button className="sm:col-span-2 rounded-xl bg-sky-700 px-4 py-3 text-sm font-extrabold text-white">Save school settings</button></form>}</section>
      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-black text-slate-900">System Users</h2><p className="text-xs text-slate-500">Create and control staff accounts.</p></div><button onClick={() => setShowUserForm(!showUserForm)} className="flex items-center gap-2 rounded-xl bg-sky-700 px-3 py-2 text-xs font-extrabold text-white"><UserPlus className="h-4 w-4" />Add user</button></div>{showUserForm && <form onSubmit={createUser} className="mb-5 grid gap-3 rounded-2xl bg-slate-50 p-4"><input placeholder="Full name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" required /><input placeholder="Email" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" required /><input placeholder="Temporary password (8+ characters)" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" required /><select value={newUser.user_type} onChange={e => setNewUser({ ...newUser, user_type: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option value="admission_officer">Admission Officer</option><option value="teacher">Teacher</option><option value="headmaster">Headmaster</option><option value="accountant">Accountant</option><option value="librarian">Librarian</option><option value="hostel_master">Hostel Master</option><option value="security">Security</option></select><button className="rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-bold text-white">Create account</button></form>}<div className="divide-y divide-slate-100">{users.map(user => <div key={user.id} className="flex items-center justify-between gap-3 py-3"><div><p className="text-sm font-bold text-slate-900">{user.name}</p><p className="text-xs text-slate-500">{user.email} · {user.user_type.replace('_', ' ')}</p></div><button onClick={() => toggleUser(user)} className={`rounded-full px-2 py-1 text-[10px] font-bold ${user.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{user.is_active ? 'Active' : 'Inactive'}</button></div>)}</div></section>
    </div>
    <AcademicSetup />
  </div>;
};
