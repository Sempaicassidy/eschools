import React, { useState, useMemo } from 'react';
import { MOCK_STAFF } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  Plus,
  Phone,
  Calendar,
  Building,
  Eye,
  Pencil,
  X,
  User,
  ShieldCheck,
  Award,
  Printer,
  Home,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  BookOpen,
  GraduationCap,
  CreditCard,
  Mail,
  FileText,
  Clock
} from 'lucide-react';

export type StaffItem = {
  id: number;
  employee_id: string;
  tsc_number?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: 'male' | 'female';
  department: 'Teaching' | 'Administration' | 'Finance & Accounts' | 'Hostel & Boarding' | 'Medical & Health' | 'Library & IT';
  designation: string;
  subjects?: string;
  assigned_class?: string;
  phone: string;
  email: string;
  status: 'active' | 'on_leave' | 'suspended' | 'retired';
  joining_date?: string;
  qualification?: string;
  teaching_load_periods?: number;
  salary_scale?: string;
  nida_number?: string;
  pension_fund_no?: string;
  bank_account?: string;
  avatar_url?: string;
};

export const StaffDirectory: React.FC = () => {
  const { role } = useAuth();
  const [staffList, setStaffList] = useState<StaffItem[]>(MOCK_STAFF as StaffItem[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewingStaff, setViewingStaff] = useState<StaffItem | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [staffDossierTab, setStaffDossierTab] = useState<'dossier' | 'responsibilities' | 'payroll' | 'biodata'>('dossier');

  // Form State for Adding Staff
  const [newStaff, setNewStaff] = useState<Partial<StaffItem>>({
    employee_id: `TR-2026-00${staffList.length + 1}`,
    tsc_number: 'TSC-9900' + (staffList.length + 10),
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: 'male',
    department: 'Teaching',
    designation: 'Secondary School Teacher',
    subjects: 'Mathematics & Physics',
    assigned_class: 'Form I Stream A',
    phone: '',
    email: '',
    status: 'active',
    joining_date: '2026-01-10',
    qualification: 'Bachelor of Education (UDSM)',
    teaching_load_periods: 16,
    salary_scale: 'TGTS D',
    nida_number: '19900101-11101-00001-00',
    pension_fund_no: 'PSSSF-001928',
    bank_account: 'CRDB Bank - Acc #0150992211',
  });

  // Filtered staff memoization
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const fullName = `${s.first_name} ${s.middle_name || ''} ${s.last_name}`.toLowerCase();
      const empId = s.employee_id.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || empId.includes(searchTerm.toLowerCase()) || s.phone.includes(searchTerm);
      const matchesDept = departmentFilter === 'all' || s.department === departmentFilter;
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [staffList, searchTerm, departmentFilter, statusFilter]);

  // KPI Statistics Memoization
  const staffKpis = useMemo(() => {
    const total = staffList.length;
    const teaching = staffList.filter((s) => s.department === 'Teaching' || s.department === 'Hostel & Boarding').length;
    const admin = staffList.filter((s) => s.department === 'Administration' || s.department === 'Finance & Accounts').length;
    const active = staffList.filter((s) => s.status === 'active').length;
    return { total, teaching, admin, active };
  }, [staffList]);

  // Create New Staff Member
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.first_name || !newStaff.last_name || !newStaff.phone) return;
    const created: StaffItem = {
      id: Date.now(),
      employee_id: newStaff.employee_id || `TR-2026-0${staffList.length + 1}`,
      tsc_number: newStaff.tsc_number || 'N/A',
      first_name: newStaff.first_name,
      middle_name: newStaff.middle_name || '',
      last_name: newStaff.last_name,
      gender: (newStaff.gender as 'male' | 'female') || 'male',
      department: (newStaff.department as any) || 'Teaching',
      designation: newStaff.designation || 'Teacher',
      subjects: newStaff.subjects || 'General',
      assigned_class: newStaff.assigned_class || 'N/A',
      phone: newStaff.phone,
      email: newStaff.email || `${newStaff.first_name.toLowerCase()}@haulaschools.ac.tz`,
      status: 'active',
      joining_date: newStaff.joining_date || '2026-01-10',
      qualification: newStaff.qualification || 'Degree in Education',
      teaching_load_periods: Number(newStaff.teaching_load_periods) || 16,
      salary_scale: newStaff.salary_scale || 'TGTS D',
      nida_number: newStaff.nida_number || '19900101-11101-00001-00',
      pension_fund_no: newStaff.pension_fund_no || 'PSSSF-001928',
      bank_account: newStaff.bank_account || 'CRDB Bank',
    };
    setStaffList([created, ...staffList]);
    setShowAddModal(false);
    setNewStaff({
      employee_id: `TR-2026-00${staffList.length + 2}`,
      first_name: '',
      middle_name: '',
      last_name: '',
      phone: '',
      email: '',
    });
  };

  // Save Edit Staff
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    setStaffList(staffList.map((s) => (s.id === editingStaff.id ? editingStaff : s)));
    if (viewingStaff && viewingStaff.id === editingStaff.id) {
      setViewingStaff(editingStaff);
    }
    setEditingStaff(null);
  };

  // Dedicated Full Page Dossier View
  if (viewingStaff !== null) {
    const staffFullName = `${viewingStaff.first_name} ${viewingStaff.middle_name || ''} ${viewingStaff.last_name}`.trim();
    return (
      <div className="space-y-6">
        {/* Top Dossier Breadcrumb & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewingStaff(null)}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl transition-all duration-200 flex items-center gap-2 font-extrabold text-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Staff Directory
            </button>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                Official Staff Dossier
              </span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">{staffFullName}</h1>
              <p className="text-xs text-slate-500 font-medium">
                Employee ID: <code className="font-mono font-bold text-slate-900">{viewingStaff.employee_id}</code> | TSC No: <code className="font-mono font-bold text-slate-900">{viewingStaff.tsc_number || 'N/A'}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 shadow-xs"
            >
              <Printer className="w-4 h-4" /> Print Official File
            </button>
            <button
              onClick={() => setEditingStaff(viewingStaff)}
              className="px-4 py-2.5 bg-sky-700 text-white hover:bg-sky-800 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 shadow-xs"
            >
              <Pencil className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>

        {/* Staff Dossier Profile Banner */}
        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl space-y-6 shadow-xs">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-28 h-28 rounded-3xl bg-slate-900 text-white flex items-center justify-center font-black text-3xl shadow-md border-4 border-white shrink-0">
              {viewingStaff.first_name.charAt(0)}
              {viewingStaff.last_name.charAt(0)}
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="bg-sky-100 text-sky-950 px-3 py-1 rounded-xl text-xs font-black border border-sky-300">
                  {viewingStaff.department} Department
                </span>
                <span className="bg-slate-900 text-white px-3 py-1 rounded-xl text-xs font-mono font-bold">
                  ID: {viewingStaff.employee_id}
                </span>
                <span className="bg-emerald-100 text-emerald-950 px-3 py-1 rounded-xl text-xs font-bold border border-emerald-300 uppercase">
                  {viewingStaff.status}
                </span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{staffFullName}</h2>
              <p className="text-xs font-bold text-slate-700">{viewingStaff.designation}</p>

              <div className="grid sm:grid-cols-3 gap-4 pt-2 text-xs font-medium text-slate-600">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Phone className="w-4 h-4 text-sky-600" /> <span>{viewingStaff.phone}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4 text-sky-600" /> <span>{viewingStaff.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <GraduationCap className="w-4 h-4 text-sky-600" /> <span>{viewingStaff.qualification || 'Degree in Education'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dossier Tabs Header */}
          <div className="flex flex-wrap border-b border-slate-200 gap-2 pt-2">
            {[
              { id: 'dossier', label: '1. Official Employee Dossier', icon: Briefcase },
              { id: 'responsibilities', label: '2. Supervision Responsibilities', icon: ShieldCheck },
              { id: 'payroll', label: '3. Attendance & Payroll Ledger', icon: CreditCard },
              { id: 'biodata', label: '4. Bio Data & Qualifications', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = staffDossierTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStaffDossierTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 font-extrabold text-xs rounded-t-xl transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: OFFICIAL EMPLOYEE DOSSIER */}
          {staffDossierTab === 'dossier' && (
            <div className="space-y-6 pt-2">
              <div className="border-b-2 border-slate-900 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-slate-900 text-base uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-slate-900" /> Official Teaching & Employment Dossier
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Daftari Rasmi la Ajira, Masomo na Ufundishaji wa Mwalimu
                  </p>
                </div>
                <span className="bg-slate-900 text-white font-mono font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs self-start md:self-auto">
                  TSC REG: {viewingStaff.tsc_number || 'TSC-NOT-ISSUED'}
                </span>
              </div>

              {/* Teaching Assignments Table */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-600" /> Assigned Teaching Subjects & Load Breakdown
                </h4>
                <div className="border border-slate-900 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-black text-[10px] uppercase border-b border-slate-900">
                        <th className="p-3 border-r border-slate-800">Subject Name</th>
                        <th className="p-3 border-r border-slate-800">Assigned Class / Form</th>
                        <th className="p-3 text-center border-r border-slate-800">Periods / Week</th>
                        <th className="p-3 border-r border-slate-800">Laboratory / Room Assigned</th>
                        <th className="p-3">Department Clearance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 border-r border-slate-200 font-extrabold">Physics (Form III & IV)</td>
                        <td className="p-3 border-r border-slate-200 font-bold">Form III Science & Form IV CSEE</td>
                        <td className="p-3 text-center border-r border-slate-200 font-mono font-bold text-sky-900">10 Periods/wk</td>
                        <td className="p-3 border-r border-slate-200 text-slate-700">Physics Lab 01</td>
                        <td className="p-3 font-bold text-emerald-800 text-[11px]">Approved by Academic Office</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 border-r border-slate-200 font-extrabold">Basic Mathematics (Form III)</td>
                        <td className="p-3 border-r border-slate-200 font-bold">Form III Science Stream</td>
                        <td className="p-3 text-center border-r border-slate-200 font-mono font-bold text-sky-900">8 Periods/wk</td>
                        <td className="p-3 border-r border-slate-200 text-slate-700">Main Block Rm 14</td>
                        <td className="p-3 font-bold text-emerald-800 text-[11px]">Approved by Academic Office</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Employment Profile Grid */}
              <div className="grid md:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-300 text-xs">
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Employment Date Joined</span>
                  <p className="font-extrabold text-slate-900 mt-1">{viewingStaff.joining_date || '15th Jan 2020'}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Highest Academic Credential</span>
                  <p className="font-extrabold text-slate-900 mt-1">{viewingStaff.qualification || 'Degree in Education'}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Total Weekly Teaching Periods</span>
                  <p className="font-extrabold text-sky-900 mt-1 font-mono text-sm">{viewingStaff.teaching_load_periods || 18} Periods / Week</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUPERVISION RESPONSIBILITIES */}
          {staffDossierTab === 'responsibilities' && (
            <div className="space-y-6 pt-2">
              <div className="border-b-2 border-slate-900 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-slate-900 text-base uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-slate-900" /> Class & Hostel Supervision Responsibilities
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Daftari la Majukumu ya Ualimu wa Darasa, Usimamizi wa Bweni na Doria ya Shule
                  </p>
                </div>
                <span className="bg-slate-900 text-white font-mono font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs self-start md:self-auto">
                  ROLE: CLASS TEACHER & DUTY MASTER
                </span>
              </div>

              {/* Responsibilities Table */}
              <div className="border border-slate-900 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-black text-[10px] uppercase border-b border-slate-900">
                      <th className="p-3 border-r border-slate-800">Supervision Category</th>
                      <th className="p-3 border-r border-slate-800">Assigned Entity / Department</th>
                      <th className="p-3 text-center border-r border-slate-800">Student Scholars Supervised</th>
                      <th className="p-3 border-r border-slate-800">Key Co-Supervisor / Assistant</th>
                      <th className="p-3">Headmaster Approval Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 border-r border-slate-200 font-extrabold">Form Class Teacher (Mwalimu wa Darasa)</td>
                      <td className="p-3 border-r border-slate-200 font-bold">{viewingStaff.assigned_class || 'Form III Science Stream'}</td>
                      <td className="p-3 text-center border-r border-slate-200 font-mono font-bold">45 Scholars</td>
                      <td className="p-3 border-r border-slate-200 text-slate-700">Class Monitor: Josephat K. Mwita</td>
                      <td className="p-3 font-bold text-emerald-800 text-[11px]">✓ Confirmed by Headmaster</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 border-r border-slate-200 font-extrabold">Boarding Hostel Supervision (Patron/Matron)</td>
                      <td className="p-3 border-r border-slate-200 font-bold">Kilimanjaro Hostel (Block B)</td>
                      <td className="p-3 text-center border-r border-slate-200 font-mono font-bold">60 Boarders</td>
                      <td className="p-3 border-r border-slate-200 text-slate-700">Tr. Beatrice Kimaro (Matron)</td>
                      <td className="p-3 font-bold text-emerald-800 text-[11px]">✓ Confirmed by Headmaster</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PAYROLL & ATTENDANCE */}
          {staffDossierTab === 'payroll' && (
            <div className="space-y-6 pt-2">
              <div className="border-b-2 border-slate-900 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-slate-900 text-base uppercase tracking-wider flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-slate-900" /> Attendance, Leave Record & Payroll Ledger
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Daftari Rasmi la Mahudhurio ya Kazi, Likizo na Mshahara wa Mtumishi
                  </p>
                </div>
                <span className="bg-slate-900 text-white font-mono font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs self-start md:self-auto">
                  PAYROLL SCALE: {viewingStaff.salary_scale || 'TGTS E'}
                </span>
              </div>

              {/* Payroll & Financial Summary Table */}
              <div className="border border-slate-900 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-black text-[10px] uppercase border-b border-slate-900">
                      <th className="p-3 border-r border-slate-800">Payroll Parameter</th>
                      <th className="p-3 border-r border-slate-800">Official Value / Fund Reference</th>
                      <th className="p-3 text-center border-r border-slate-800">Status</th>
                      <th className="p-3">Bursar Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 border-r border-slate-200 font-bold">Government / TSC Salary Scale</td>
                      <td className="p-3 border-r border-slate-200 font-mono font-extrabold">{viewingStaff.salary_scale || 'TGTS E'}</td>
                      <td className="p-3 text-center border-r border-slate-200 font-bold text-emerald-800">Active Payroll</td>
                      <td className="p-3 text-slate-600">Reconciled by Bursar</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 border-r border-slate-200 font-bold">Pension Fund Registration No</td>
                      <td className="p-3 border-r border-slate-200 font-mono font-extrabold">{viewingStaff.pension_fund_no || 'PSSSF-994012'}</td>
                      <td className="p-3 text-center border-r border-slate-200 font-bold text-emerald-800">Compliant</td>
                      <td className="p-3 text-slate-600">PSSSF Returns Cleared</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 border-r border-slate-200 font-bold">Bank Account Details</td>
                      <td className="p-3 border-r border-slate-200 font-mono font-extrabold">{viewingStaff.bank_account || 'CRDB Bank - Acc #0150244901'}</td>
                      <td className="p-3 text-center border-r border-slate-200 font-bold text-emerald-800">Verified Direct Deposit</td>
                      <td className="p-3 text-slate-600">CRDB Salary Clearance</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: BIO DATA & QUALIFICATIONS */}
          {staffDossierTab === 'biodata' && (
            <div className="space-y-6 pt-2">
              <div className="border-b-2 border-slate-900 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-slate-900 text-base uppercase tracking-wider flex items-center gap-2">
                    <User className="w-5 h-5 text-slate-900" /> Bio Data & Professional Qualifications
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Taarifa Binafsi, Vitambulisho vya NIDA na Vyeti vya Mwalimu
                  </p>
                </div>
                <span className="bg-slate-900 text-white font-mono font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs self-start md:self-auto">
                  NIDA: {viewingStaff.nida_number || 'NIDA-VERIFIED'}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-xs font-medium">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-300 space-y-3">
                  <h4 className="font-extrabold text-slate-900 uppercase text-[11px]">1. Personal Identification</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Full Official Name:</span>
                      <span className="font-extrabold text-slate-900">{staffFullName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Gender (Jinsia):</span>
                      <span className="font-extrabold text-slate-900 capitalize">{viewingStaff.gender}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">National ID (NIDA No):</span>
                      <span className="font-mono font-extrabold text-slate-900">{viewingStaff.nida_number || '19880315-11102-00001-22'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-300 space-y-3">
                  <h4 className="font-extrabold text-slate-900 uppercase text-[11px]">2. Educational Qualifications</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Highest Credential:</span>
                      <span className="font-extrabold text-slate-900">{viewingStaff.qualification || 'Bachelor of Science in Education'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Graduation University:</span>
                      <span className="font-extrabold text-slate-900">University of Dar es Salaam (UDSM)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">TSC License Status:</span>
                      <span className="font-extrabold text-emerald-800">Licensed & Registered Teacher</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // MAIN DIRECTORY LISTING
  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-sky-700" /> Teachers & Staff Administrative Directory
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Daftari la Walimu na Watumishi wa Shule (Haula Secondary Campus)
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-700 to-blue-700 hover:from-sky-800 hover:to-blue-800 text-white font-extrabold px-5 py-3 rounded-2xl text-xs transition-all shadow-md shadow-sky-700/20 shrink-0"
        >
          <Plus className="w-4 h-4" /> Register New Staff Member
        </button>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Total Staff Members</span>
            <Users className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{staffKpis.total}</p>
          <span className="text-[11px] text-slate-500 font-bold">Employees Enrolled</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Teaching Staff (Walimu)</span>
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-indigo-950">{staffKpis.teaching}</p>
          <span className="text-[11px] text-indigo-700 font-bold">Academic Instructors</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Admin & Support Staff</span>
            <Briefcase className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-purple-950">{staffKpis.admin}</p>
          <span className="text-[11px] text-purple-700 font-bold">Finance, Admissions & Boarding</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Active Status</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-950">{staffKpis.active}</p>
          <span className="text-[11px] text-emerald-700 font-bold">On Active Duty</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, Employee ID, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Department & Status Filters */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Departments</option>
            <option value="Teaching">Teaching Department</option>
            <option value="Administration">Administration & Admissions</option>
            <option value="Finance & Accounts">Finance & Accounts (Bursar)</option>
            <option value="Hostel & Boarding">Hostel & Boarding</option>
            <option value="Medical & Health">Medical & Dispensary</option>
            <option value="Library & IT">Library & IT Systems</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Duty</option>
            <option value="on_leave">On Annual Leave</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-black text-[10px] uppercase border-b border-slate-900">
                <th className="p-4 border-r border-slate-800">Staff Member / Name</th>
                <th className="p-4 border-r border-slate-800">Employee ID / TSC</th>
                <th className="p-4 border-r border-slate-800">Department & Designation</th>
                <th className="p-4 border-r border-slate-800">Subjects Taught / Role</th>
                <th className="p-4 border-r border-slate-800">Contact (Phone & Email)</th>
                <th className="p-4 text-center border-r border-slate-800">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-bold">
                    No staff members match the specified search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => {
                  const staffFullName = `${staff.first_name} ${staff.middle_name || ''} ${staff.last_name}`.trim();
                  return (
                    <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 border-r border-slate-200 font-bold">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0">
                            {staff.first_name.charAt(0)}
                            {staff.last_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900">{staffFullName}</p>
                            <span className="text-[10px] text-slate-500 capitalize">{staff.gender} Staff</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 border-r border-slate-200 font-mono font-bold">
                        <span className="bg-slate-100 text-slate-900 px-2 py-1 rounded text-[11px]">
                          {staff.employee_id}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-mono">TSC: {staff.tsc_number || 'N/A'}</div>
                      </td>

                      <td className="p-4 border-r border-slate-200">
                        <p className="font-extrabold text-slate-900">{staff.department}</p>
                        <p className="text-[11px] text-slate-600 font-medium">{staff.designation}</p>
                      </td>

                      <td className="p-4 border-r border-slate-200 text-slate-700">
                        <p className="font-bold text-slate-900">{staff.subjects || 'Administrative'}</p>
                        {staff.assigned_class && (
                          <span className="text-[10px] text-sky-800 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200 inline-block mt-0.5">
                            {staff.assigned_class}
                          </span>
                        )}
                      </td>

                      <td className="p-4 border-r border-slate-200">
                        <p className="font-bold text-slate-900">{staff.phone}</p>
                        <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{staff.email}</p>
                      </td>

                      <td className="p-4 text-center border-r border-slate-200 font-bold">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-black border ${
                            staff.status === 'active'
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                              : 'bg-amber-100 text-amber-950 border-amber-300'
                          }`}
                        >
                          {staff.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setViewingStaff(staff);
                              setStaffDossierTab('dossier');
                            }}
                            className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-extrabold text-[11px] transition-all flex items-center gap-1 shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Staff Dossier
                          </button>
                          <button
                            onClick={() => setEditingStaff(staff)}
                            className="p-1.5 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-all"
                            title="Edit Staff Member"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Register New Staff Member */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-black text-slate-900 text-lg uppercase tracking-wider flex items-center gap-2">
                  <Plus className="w-5 h-5 text-sky-700" /> Register New Staff Member
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Sajili Mwalimu au Mtumishi Mpya wa Shule
                </p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs font-medium">
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newStaff.first_name}
                    onChange={(e) => setNewStaff({ ...newStaff, first_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                    placeholder="e.g. Alex"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={newStaff.middle_name}
                    onChange={(e) => setNewStaff({ ...newStaff, middle_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                    placeholder="e.g. John"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={newStaff.last_name}
                    onChange={(e) => setNewStaff({ ...newStaff, last_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                    placeholder="e.g. Mhagama"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Employee ID *</label>
                  <input
                    type="text"
                    required
                    value={newStaff.employee_id}
                    onChange={(e) => setNewStaff({ ...newStaff, employee_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">TSC License No</label>
                  <input
                    type="text"
                    value={newStaff.tsc_number}
                    onChange={(e) => setNewStaff({ ...newStaff, tsc_number: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold font-mono text-slate-900"
                    placeholder="TSC-994012"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Department *</label>
                  <select
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Teaching">Teaching</option>
                    <option value="Administration">Administration</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Hostel & Boarding">Hostel & Boarding</option>
                    <option value="Medical & Health">Medical & Health</option>
                    <option value="Library & IT">Library & IT</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Designation / Role Title *</label>
                  <input
                    type="text"
                    required
                    value={newStaff.designation}
                    onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                    placeholder="e.g. Senior Physics Teacher"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Teaching Subjects / Specialization</label>
                  <input
                    type="text"
                    value={newStaff.subjects}
                    onChange={(e) => setNewStaff({ ...newStaff, subjects: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                    placeholder="e.g. Physics & Basic Mathematics"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                    placeholder="+255 754 000 111"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                    placeholder="teacher@haulaschools.ac.tz"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-extrabold shadow-md"
                >
                  Confirm & Register Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Staff Member Profile */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-black text-slate-900 text-lg uppercase tracking-wider flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-sky-700" /> Edit Staff Profile & Dossier
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Badili Taarifa za Mwalimu au Mtumishi (ID: {editingStaff.employee_id})
                </p>
              </div>
              <button onClick={() => setEditingStaff(null)} className="p-2 text-slate-400 hover:text-slate-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-medium">
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.first_name}
                    onChange={(e) => setEditingStaff({ ...editingStaff, first_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={editingStaff.middle_name || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, middle_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.last_name}
                    onChange={(e) => setEditingStaff({ ...editingStaff, last_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Employee ID *</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.employee_id}
                    onChange={(e) => setEditingStaff({ ...editingStaff, employee_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">TSC License No</label>
                  <input
                    type="text"
                    value={editingStaff.tsc_number || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, tsc_number: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Department *</label>
                  <select
                    value={editingStaff.department}
                    onChange={(e) => setEditingStaff({ ...editingStaff, department: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Teaching">Teaching</option>
                    <option value="Administration">Administration</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Hostel & Boarding">Hostel & Boarding</option>
                    <option value="Medical & Health">Medical & Health</option>
                    <option value="Library & IT">Library & IT</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Designation / Role Title *</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.designation}
                    onChange={(e) => setEditingStaff({ ...editingStaff, designation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Teaching Subjects / Specialization</label>
                  <input
                    type="text"
                    value={editingStaff.subjects || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, subjects: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.phone}
                    onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingStaff.email}
                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Employment Status *</label>
                  <select
                    value={editingStaff.status}
                    onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                  >
                    <option value="active">Active Duty</option>
                    <option value="on_leave">On Annual Leave</option>
                    <option value="suspended">Suspended</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Salary Scale / Grade</label>
                  <input
                    type="text"
                    value={editingStaff.salary_scale || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, salary_scale: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold font-mono text-slate-900"
                    placeholder="e.g. TGTS E"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">National ID (NIDA No)</label>
                  <input
                    type="text"
                    value={editingStaff.nida_number || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, nida_number: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-700 text-white rounded-xl font-extrabold shadow-md"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
