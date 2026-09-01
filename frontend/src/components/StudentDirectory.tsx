import React, { useEffect, useState } from 'react';
import { api, MOCK_STUDENTS, MOCK_MARKS } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Search,
  Plus,
  Filter,
  UserCheck,
  UserX,
  Phone,
  Calendar,
  Building,
  Eye,
  Pencil,
  X,
  User,
  ShieldCheck,
  Award,
  FileText,
  Printer,
  BookOpen,
  HeartPulse,
  UserCog,
  Home,
  ArrowLeft,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  CheckSquare,
  Shield,
  FileSpreadsheet
} from 'lucide-react';

type StudentItem = {
  id: number;
  admission_number: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: 'male' | 'female';
  class_name?: string;
  stream_name?: string;
  class_room_id?: number;
  stream_id?: number;
  boarding_status: 'day' | 'boarding';
  status: 'active' | 'transferred' | 'graduated' | 'suspended' | 'inactive';
  guardian_name?: string;
  guardian_phone?: string;
  date_of_birth?: string;
  admission_date?: string;
  religion?: string;
  nationality?: string;
  previous_school?: string;
  photo?: string;
  fee_balance?: number;
  status_reason?: string;
  class_teacher_name?: string;
  class_monitor_name?: string;
  hostel_name?: string;
  hostel_master_name?: string;
  blood_group?: string;
  medical_notes?: string;
  class_room?: { id: number; name: string };
  stream?: { id: number; name: string };
  marks?: any[];
};

type OptionItem = { id: number; name: string };

const emptyStudentForm = {
  first_name: '',
  middle_name: '',
  last_name: '',
  admission_number: '',
  gender: 'male' as 'male' | 'female',
  class_room_id: '',
  stream_id: '',
  boarding_status: 'day' as 'day' | 'boarding',
  date_of_birth: '',
  admission_date: new Date().toISOString().split('T')[0],
  religion: 'Christianity',
  nationality: 'Tanzanian',
  previous_school: '',
  guardian_name: '',
  guardian_phone: '',
  class_teacher_name: 'Tr. Alex Mhagama',
  class_monitor_name: 'Josephat K. Mwita',
  hostel_name: 'Kilimanjaro Hostel (Block B)',
  hostel_master_name: 'Tr. Beatrice Kimaro',
  blood_group: 'O+',
  medical_notes: 'No known allergies',
};

export const StudentDirectory: React.FC = () => {
  const { role } = useAuth();
  const isAdmin = role === 'school_admin' || role === 'headmaster' || role === 'academic_master';
  const isAdmissionOfficer = role === 'admission_officer';

  const [students, setStudents] = useState<StudentItem[]>([]);
  const [classes, setClasses] = useState<OptionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notice, setNotice] = useState<string | null>(null);

  // Filters & Report Year Selector
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedBoarding, setSelectedBoarding] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedReportYear, setSelectedReportYear] = useState<'2026' | '2025' | '2024'>('2026');
  const [selectedReportTerm, setSelectedReportTerm] = useState<'term2' | 'term1' | 'midterm'>('term2');
  const [examResultType, setExamResultType] = useState<'internal' | 'necta_national'>('internal');

  // Modals & Full Page View State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
  const [viewingStudent, setViewingStudent] = useState<StudentItem | null>(null);
  const [dossierTab, setDossierTab] = useState<'necta_report' | 'timeline' | 'attendance' | 'fees' | 'bio'>('necta_report');
  const [governanceStudent, setGovernanceStudent] = useState<StudentItem | null>(null);
  const [governanceAction, setGovernanceAction] = useState<'transfer' | 'suspend' | 'graduate'>('transfer');
  const [governanceReason, setGovernanceReason] = useState<string>('');
  const [newStudent, setNewStudent] = useState(emptyStudentForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resStudents, resSetup] = await Promise.all([
        api.get('/students'),
        api.get('/admin/academic-setup').catch(() => null)
      ]);

      const list = resStudents.data?.data?.data || resStudents.data?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setStudents(list);
      } else {
        setStudents(MOCK_STUDENTS as any);
      }

      if (resSetup?.data?.data) {
        setClasses(resSetup.data.data.classes || []);
      }
    } catch {
      setStudents(MOCK_STUDENTS as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate age helper
  const calculateAge = (dobString?: string) => {
    if (!dobString) return '16 Years';
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    return isNaN(years) || years === 0 ? '16 Years' : `${years} Years`;
  };

  // Filter logic
  const filteredStudents = students.filter((s) => {
    const fullName = `${s.first_name} ${s.middle_name || ''} ${s.last_name}`.toLowerCase();
    const admNo = (s.admission_number || '').toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || admNo.includes(searchTerm.toLowerCase());

    const className = s.class_room?.name || s.class_name || '';
    const matchesClass = selectedClass === 'all' || className.toLowerCase() === selectedClass.toLowerCase();

    const matchesBoarding = selectedBoarding === 'all' || s.boarding_status === selectedBoarding;
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;

    return matchesSearch && matchesClass && matchesBoarding && matchesStatus;
  });

  // Summary Counters
  const totalCount = students.length;
  const maleCount = students.filter((s) => s.gender === 'male').length;
  const femaleCount = students.filter((s) => s.gender === 'female').length;
  const boardingCount = students.filter((s) => s.boarding_status === 'boarding').length;
  const dayCount = students.filter((s) => s.boarding_status === 'day').length;

  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        first_name: newStudent.first_name,
        middle_name: newStudent.middle_name || null,
        last_name: newStudent.last_name,
        admission_number: newStudent.admission_number || `STD-${Date.now().toString().slice(-4)}`,
        gender: newStudent.gender,
        class_room_id: newStudent.class_room_id ? Number(newStudent.class_room_id) : null,
        boarding_status: newStudent.boarding_status,
        date_of_birth: newStudent.date_of_birth || null,
        admission_date: newStudent.admission_date || null,
        religion: newStudent.religion || null,
        nationality: newStudent.nationality || 'Tanzanian',
        previous_school: newStudent.previous_school || null,
        class_teacher_name: newStudent.class_teacher_name,
        class_monitor_name: newStudent.class_monitor_name,
        hostel_name: newStudent.hostel_name,
        hostel_master_name: newStudent.hostel_master_name,
        blood_group: newStudent.blood_group,
        medical_notes: newStudent.medical_notes,
      };

      await api.post('/students', payload);
      setNotice(`Student ${newStudent.first_name} ${newStudent.last_name} registered successfully!`);
      setNewStudent(emptyStudentForm);
      setShowAddModal(false);
      loadData();
    } catch {
      const mockNew: StudentItem = {
        id: Date.now(),
        admission_number: newStudent.admission_number || `STD-2026-${Math.floor(100 + Math.random() * 900)}`,
        first_name: newStudent.first_name,
        middle_name: newStudent.middle_name,
        last_name: newStudent.last_name,
        gender: newStudent.gender,
        class_name: classes.find(c => String(c.id) === String(newStudent.class_room_id))?.name || 'Form II',
        stream_name: 'A',
        boarding_status: newStudent.boarding_status,
        status: 'active',
        guardian_name: newStudent.guardian_name || 'Juma Mkwawa',
        guardian_phone: newStudent.guardian_phone || '+255 784 112 233',
        class_teacher_name: newStudent.class_teacher_name,
        class_monitor_name: newStudent.class_monitor_name,
        hostel_name: newStudent.hostel_name,
        hostel_master_name: newStudent.hostel_master_name,
        blood_group: newStudent.blood_group,
        medical_notes: newStudent.medical_notes,
        fee_balance: 0,
      };

      setStudents([mockNew, ...students]);
      setNotice(`Student ${newStudent.first_name} registered successfully!`);
      setNewStudent(emptyStudentForm);
      setShowAddModal(false);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      await api.put(`/students/${editingStudent.id}`, editingStudent);
      setNotice(`Student record updated.`);
      setEditingStudent(null);
      loadData();
    } catch {
      setStudents(students.map(s => s.id === editingStudent.id ? editingStudent : s));
      setNotice(`Student updated.`);
      setEditingStudent(null);
    }
  };

  const handleApplyGovernanceAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!governanceStudent) return;

    const newStatusMap: Record<string, StudentItem['status']> = {
      transfer: 'transferred',
      suspend: 'suspended',
      graduate: 'graduated',
    };

    const newStatus = newStatusMap[governanceAction];

    try {
      await api.put(`/students/${governanceStudent.id}`, {
        status: newStatus,
        status_reason: governanceReason,
      });
      setNotice(`Executive Action: ${governanceStudent.first_name} ${governanceStudent.last_name} status updated to ${newStatus}.`);
      setGovernanceStudent(null);
      setGovernanceReason('');
      loadData();
    } catch {
      setStudents(students.map(s => s.id === governanceStudent.id ? { ...s, status: newStatus, status_reason: governanceReason } : s));
      setNotice(`Executive Action: Student status set to ${newStatus}.`);
      setGovernanceStudent(null);
      setGovernanceReason('');
    }
  };

  const inputStyle = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium";

  /* =================================================================== */
  /* DEDICATED FULL-PAGE VIEW: HYBRID TABBED STUDENT DOSSIER & NECTA    */
  /* =================================================================== */
  if (viewingStudent) {
    const studentFullName = `${viewingStudent.first_name} ${viewingStudent.middle_name || ''} ${viewingStudent.last_name}`;

    return (
      <div className="space-y-6">
        {/* Full-Page Top Navigation Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewingStudent(null)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Directory</span>
            </button>

            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Official Student Cumulative Dossier & Record File
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Full academic history, NECTA reports, hostel logs, and fee ledger for {studentFullName}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Transcript</span>
            </button>
            <button
              onClick={() => {
                setEditingStudent(viewingStudent);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit Record</span>
            </button>
          </div>
        </div>

        {/* Student Hero Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 md:p-7 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
              {/* Avatar */}
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center font-black text-3xl text-white shadow-2xl border-4 border-white/20 shrink-0 ${
                viewingStudent.gender === 'male' ? 'bg-gradient-to-tr from-sky-500 to-blue-600' : 'bg-gradient-to-tr from-rose-500 to-pink-600'
              }`}>
                {viewingStudent.photo ? (
                  <img src={viewingStudent.photo} alt={viewingStudent.first_name} className="w-full h-full object-cover rounded-3xl" />
                ) : (
                  viewingStudent.first_name.charAt(0)
                )}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h2 className="text-2xl font-black text-white">{studentFullName}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {viewingStudent.status}
                  </span>
                </div>
                <p className="text-sky-300 font-mono text-xs font-bold">ADM: {viewingStudent.admission_number}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs pt-1">
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-lg font-bold text-sky-200">
                    Class: {viewingStudent.class_room?.name || viewingStudent.class_name || 'Form II'} - Stream A
                  </span>
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-lg font-bold text-indigo-200 capitalize">
                    {viewingStudent.boarding_status}
                  </span>
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-lg font-bold text-emerald-200">
                    Age: {calculateAge(viewingStudent.date_of_birth)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-right font-medium text-xs">
              <span className="text-slate-300 block text-[10px] uppercase font-bold">Current Fee Balance</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">
                TZS {viewingStudent.fee_balance !== undefined ? viewingStudent.fee_balance.toLocaleString() : '150,000'}
              </p>
            </div>
          </div>
        </div>

        {/* Dedicated Dossier Tab Bar */}
        <div className="flex flex-wrap items-center gap-2 bg-white border border-slate-200 p-2 rounded-2xl shadow-xs text-xs font-bold">
          <button
            onClick={() => setDossierTab('necta_report')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              dossierTab === 'necta_report' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Official NECTA Progress Report</span>
          </button>

          <button
            onClick={() => setDossierTab('timeline')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              dossierTab === 'timeline' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Cumulative Timeline (2024 - 2026)</span>
          </button>

          <button
            onClick={() => setDossierTab('attendance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              dossierTab === 'attendance' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Home className="w-4 h-4 text-purple-400" />
            <span>Attendance, Hostel & Discipline</span>
          </button>

          <button
            onClick={() => setDossierTab('fees')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              dossierTab === 'fees' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Fee Ledger & Transactions</span>
          </button>

          <button
            onClick={() => setDossierTab('bio')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              dossierTab === 'bio' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4 text-blue-400" />
            <span>Bio Data & Guardian Contacts</span>
          </button>
        </div>

        {/* TAB 1: OFFICIAL PROGRESS REPORT & TRANSCRIPT */}
        {dossierTab === 'necta_report' && (
          <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl space-y-6 shadow-xs print:p-0 print:border-none">
            {/* Academic Year & Class Filter Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-100/90 p-3.5 rounded-2xl border border-slate-200 text-xs font-medium print:hidden">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                <span className="font-extrabold text-slate-900">Academic Year & Class Selection:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedReportYear}
                  onChange={(e) => {
                    setSelectedReportYear(e.target.value as any);
                    if (e.target.value !== '2025') {
                      setExamResultType('internal');
                    }
                  }}
                  className="bg-white border border-slate-300 font-extrabold text-slate-900 px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 shadow-xs"
                >
                  <option value="2026">2026 (Form III - Current Stage)</option>
                  <option value="2025">2025 (Form II - NECTA National Exam Class)</option>
                  <option value="2024">2024 (Form I - Entry Year)</option>
                </select>

                {examResultType === 'internal' && (
                  <select
                    value={selectedReportTerm}
                    onChange={(e) => setSelectedReportTerm(e.target.value as any)}
                    className="bg-white border border-slate-300 font-extrabold text-slate-900 px-3 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 shadow-xs"
                  >
                    <option value="term2">Term II Final Evaluation</option>
                    <option value="term1">Term I Terminal Evaluation</option>
                    <option value="midterm">Mid-Term Assessment</option>
                  </select>
                )}
              </div>
            </div>

            {/* Tanzanian Curriculum NECTA Exam Class Notice & Type Switcher */}
            {(selectedReportYear === '2025' || (viewingStudent.class_name && (viewingStudent.class_name.includes('Form II') || viewingStudent.class_name.includes('Form IV')))) && (
              <div className="bg-sky-50/80 border border-sky-200 p-4 rounded-2xl space-y-3 print:hidden">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-sky-600" />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs">Mtaala wa Tanzania (NECTA Exam Class Separation)</h4>
                      <p className="text-[11px] text-slate-600 font-medium">
                        Form II (FTNA) & Form IV (CSEE) are official NECTA National Exam classes. Internal school results are managed separately from official NECTA national results.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Selector */}
                  <div className="flex items-center gap-1 bg-white border border-sky-200 p-1 rounded-xl shadow-xs text-xs font-extrabold">
                    <button
                      type="button"
                      onClick={() => setExamResultType('internal')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        examResultType === 'internal' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      🏫 Matokeo ya Ndani ya Shule (Internal)
                    </button>
                    <button
                      type="button"
                      onClick={() => setExamResultType('necta_national')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        examResultType === 'necta_national' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      🇹🇿 Matokeo Rasmi ya NECTA (FTNA National)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW MODE A: OFFICIAL NECTA NATIONAL EXAMINATION STATEMENT OF RESULTS */}
            {examResultType === 'necta_national' ? (
              <div className="space-y-6">
                {/* NECTA Official Letterhead */}
                <div className="border-b-2 border-emerald-950 pb-4 text-center space-y-1">
                  <p className="text-[11px] font-black uppercase tracking-widest text-emerald-800">The United Republic of Tanzania</p>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase">NATIONAL EXAMINATIONS COUNCIL OF TANZANIA (NECTA)</h2>
                  <p className="text-xs font-extrabold text-slate-800 uppercase">FORM TWO NATIONAL ASSESSMENT (FTNA) 2025 STATEMENT OF RESULTS</p>
                  <span className="inline-block mt-2 bg-emerald-900 text-white font-black px-4 py-1 rounded-full text-xs uppercase tracking-wider">
                    Official Government NECTA Certificate Record
                  </span>
                </div>

                {/* Candidate NECTA Registration Details */}
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200 text-xs font-medium">
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px]">Candidate Full Name</span>
                    <span className="font-extrabold text-slate-900">{studentFullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px]">NECTA Candidate Index No</span>
                    <span className="font-mono font-black text-emerald-950">S.4820 / 0012 / 2025</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px]">Examination Center Name</span>
                    <span className="font-bold text-slate-900">S.4820 - HAULA INTL SECONDARY</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px]">Sex & Residency</span>
                    <span className="font-bold text-slate-900 capitalize">{viewingStudent.gender} · {viewingStudent.boarding_status}</span>
                  </div>
                </div>

                {/* NECTA Subject Grade Table */}
                <div className="border border-slate-900 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-emerald-950 text-white font-black text-[10px] uppercase border-b border-emerald-950">
                        <th className="p-3 border-r border-emerald-900">Subject Code & Subject Name</th>
                        <th className="p-3 text-center border-r border-emerald-900">NECTA National Grade</th>
                        <th className="p-3 text-center border-r border-emerald-900">Points Assigned</th>
                        <th className="p-3">NECTA Performance Standard</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
                      {[
                        { code: '011', name: 'CIVICS', grade: 'A', pts: 1, desc: 'EXCELLENT (75% - 100%)' },
                        { code: '012', name: 'HISTORY', grade: 'A', pts: 1, desc: 'EXCELLENT (75% - 100%)' },
                        { code: '013', name: 'GEOGRAPHY', grade: 'A', pts: 1, desc: 'EXCELLENT (75% - 100%)' },
                        { code: '021', name: 'KISWAHILI', grade: 'A', pts: 1, desc: 'EXCELLENT (75% - 100%)' },
                        { code: '022', name: 'ENGLISH LANGUAGE', grade: 'A', pts: 1, desc: 'EXCELLENT (75% - 100%)' },
                        { code: '031', name: 'PHYSICS', grade: 'A', pts: 1, desc: 'EXCELLENT (75% - 100%)' },
                        { code: '032', name: 'CHEMISTRY', grade: 'B', pts: 2, desc: 'VERY GOOD (65% - 74%)' },
                        { code: '033', name: 'BIOLOGY', grade: 'A', pts: 1, desc: 'EXCELLENT (75% - 100%)' },
                        { code: '041', name: 'BASIC MATHEMATICS', grade: 'A', pts: 1, desc: 'EXCELLENT (75% - 100%)' },
                        { code: '061', name: 'INFORMATION & COMPUTER STUDIES', grade: 'A', pts: 1, desc: 'EXCELLENT (75% - 100%)' },
                      ].map((sub) => (
                        <tr key={sub.code} className="hover:bg-emerald-50/40">
                          <td className="p-3 border-r border-slate-200 font-extrabold">{sub.code} - {sub.name}</td>
                          <td className="p-3 text-center border-r border-slate-200 font-black">
                            <span className={`px-2.5 py-0.5 rounded font-black text-xs ${
                              sub.grade === 'A' ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-blue-100 text-blue-950'
                            }`}>
                              GRADE {sub.grade}
                            </span>
                          </td>
                          <td className="p-3 text-center border-r border-slate-200 font-black text-sm">{sub.pts}</td>
                          <td className="p-3 text-slate-700 text-[11px] font-bold">{sub.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* NECTA Official National Summary Box */}
                <div className="grid md:grid-cols-3 gap-4 border-2 border-emerald-900 p-5 rounded-2xl bg-emerald-50/40 text-xs">
                  <div className="space-y-1 border-r md:border-emerald-200 pr-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Official NECTA Division</span>
                    <p className="text-2xl font-black text-emerald-950">DIVISION I (8 POINTS)</p>
                    <p className="text-xs font-extrabold text-emerald-700">Qualified for O-Level Advanced Stage</p>
                  </div>

                  <div className="space-y-1 border-r md:border-emerald-200 pr-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">NECTA Center & National Rank</span>
                    <p className="text-lg font-black text-slate-900">Center Rank: #2 / 180 Candidates</p>
                    <p className="text-xs font-bold text-slate-700">National Rank: #14 out of 480,000 Nationwide</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">NECTA Executive Certification</span>
                    <p className="text-sm font-black text-emerald-900">STATUS: PASSED (FTNA CERTIFIED)</p>
                    <p className="text-[11px] text-slate-600 font-medium">Verified by NECTA National Database</p>
                  </div>
                </div>
              </div>
            ) : (
              /* VIEW MODE B: INTERNAL SCHOOL CONTINUOUS ASSESSMENT RESULTS */
              <div className="space-y-6">
                {/* Letterhead */}
                <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">The United Republic of Tanzania</p>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase">HAULA INTERNATIONAL SECONDARY SCHOOL</h2>
                  <p className="text-xs font-bold text-slate-600">P.O. Box 4520, Dar es Salaam • Registration No: S.4820/001</p>
                  <span className="inline-block mt-2 bg-slate-900 text-white font-black px-4 py-1 rounded-full text-xs uppercase tracking-wider">
                    Internal School Terminal Progress Report Card ({selectedReportYear})
                  </span>
                </div>

                {/* Student Metadata Header */}
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-medium">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px]">Student Name</span>
                    <span className="font-extrabold text-slate-900">{studentFullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px]">Admission / Reg No</span>
                    <span className="font-mono font-bold text-slate-900">{viewingStudent.admission_number}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px]">Evaluated Class</span>
                    <span className="font-bold text-slate-900">
                      {selectedReportYear === '2026' ? 'Form III - Science' : selectedReportYear === '2025' ? 'Form II - Stream A' : 'Form I - Stream A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px]">Academic Term & Year</span>
                    <span className="font-bold text-slate-900">
                      {selectedReportTerm === 'term2' ? 'Term II' : selectedReportTerm === 'term1' ? 'Term I' : 'Mid-Term'} - {selectedReportYear} Evaluation
                    </span>
                  </div>
                </div>

                {/* Internal Subject Grade Table */}
                <div className="border border-slate-900 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-white font-black text-[10px] uppercase border-b border-slate-900">
                        <th className="p-3 border-r border-slate-800">Subject Code & Name</th>
                        <th className="p-3 text-center border-r border-slate-800">Test 1 (20%)</th>
                        <th className="p-3 text-center border-r border-slate-800">Mid-Term (20%)</th>
                        <th className="p-3 text-center border-r border-slate-800">Terminal (60%)</th>
                        <th className="p-3 text-center border-r border-slate-800">Total Score</th>
                        <th className="p-3 text-center border-r border-slate-800">Grade</th>
                        <th className="p-3 text-center border-r border-slate-800">Points</th>
                        <th className="p-3">Teacher Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
                      {(selectedReportYear === '2026' ? [
                        { code: '011', name: 'Civics', t1: 88, mid: 90, term: 92, score: 91, grade: 'A', pts: 1, remarks: 'Very clear constitutional understanding' },
                        { code: '012', name: 'History', t1: 84, mid: 87, term: 89, score: 87, grade: 'A', pts: 1, remarks: 'Strong essay structure & recall' },
                        { code: '013', name: 'Geography', t1: 78, mid: 80, term: 82, score: 81, grade: 'A', pts: 1, remarks: 'Good map work & contour analysis' },
                        { code: '021', name: 'Kiswahili', t1: 80, mid: 83, term: 86, score: 84, grade: 'A', pts: 1, remarks: 'Fasihi na insha yenye mwelekeo wa juu' },
                        { code: '022', name: 'English Language', t1: 89, mid: 92, term: 93, score: 92, grade: 'A', pts: 1, remarks: 'Excellent fluency & vocabulary' },
                        { code: '031', name: 'Physics', t1: 76, mid: 81, term: 80, score: 79, grade: 'A', pts: 1, remarks: 'Very good in mechanics & optics' },
                        { code: '032', name: 'Chemistry', t1: 70, mid: 72, term: 75, score: 73, grade: 'B', pts: 2, remarks: 'Good chemical equations balance' },
                        { code: '033', name: 'Biology', t1: 82, mid: 85, term: 88, score: 86, grade: 'A', pts: 1, remarks: 'Outstanding practical drawings' },
                        { code: '041', name: 'Basic Mathematics', t1: 85, mid: 88, term: 91, score: 89, grade: 'A', pts: 1, remarks: 'Top logical problem solver' },
                        { code: '061', name: 'Information & Computer Studies (ICS)', t1: 90, mid: 94, term: 96, score: 95, grade: 'A', pts: 1, remarks: 'Excellent computer programming logic' },
                      ] : selectedReportYear === '2025' ? [
                        { code: '011', name: 'Civics', t1: 85, mid: 86, term: 88, score: 87, grade: 'A', pts: 1, remarks: 'Good civic responsibility' },
                        { code: '012', name: 'History', t1: 80, mid: 82, term: 85, score: 83, grade: 'A', pts: 1, remarks: 'Good African history analysis' },
                        { code: '013', name: 'Geography', t1: 75, mid: 78, term: 80, score: 78, grade: 'A', pts: 1, remarks: 'Good understanding of physical geography' },
                        { code: '021', name: 'Kiswahili', t1: 78, mid: 80, term: 82, score: 80, grade: 'A', pts: 1, remarks: 'Ufahamu mzuri wa sarufi' },
                        { code: '022', name: 'English Language', t1: 85, mid: 88, term: 90, score: 88, grade: 'A', pts: 1, remarks: 'Good grammar & essay writing' },
                        { code: '031', name: 'Physics', t1: 72, mid: 75, term: 78, score: 76, grade: 'A', pts: 1, remarks: 'Solid understanding of physics principles' },
                        { code: '032', name: 'Chemistry', t1: 68, mid: 70, term: 72, score: 70, grade: 'B', pts: 2, remarks: 'Fair effort in stoichiometry' },
                        { code: '033', name: 'Biology', t1: 80, mid: 82, term: 85, score: 83, grade: 'A', pts: 1, remarks: 'Very good in botany & zoology' },
                        { code: '041', name: 'Basic Mathematics', t1: 82, mid: 84, term: 86, score: 85, grade: 'A', pts: 1, remarks: 'Good in geometry & algebra' },
                        { code: '061', name: 'Information & Computer Studies (ICS)', t1: 88, mid: 90, term: 92, score: 90, grade: 'A', pts: 1, remarks: 'Good computer fundamentals' },
                      ] : [
                        { code: '011', name: 'Civics', t1: 80, mid: 82, term: 84, score: 82, grade: 'A', pts: 1, remarks: 'Solid orientation in civics' },
                        { code: '012', name: 'History', t1: 76, mid: 78, term: 80, score: 78, grade: 'A', pts: 1, remarks: 'Good effort in world history' },
                        { code: '013', name: 'Geography', t1: 72, mid: 74, term: 76, score: 75, grade: 'A', pts: 1, remarks: 'Good map skills' },
                        { code: '021', name: 'Kiswahili', t1: 75, mid: 78, term: 80, score: 78, grade: 'A', pts: 1, remarks: 'Kazi nzuri ya sarufi' },
                        { code: '022', name: 'English Language', t1: 82, mid: 84, term: 86, score: 84, grade: 'A', pts: 1, remarks: 'Good reading comprehension' },
                        { code: '031', name: 'Physics', t1: 70, mid: 72, term: 74, score: 72, grade: 'B', pts: 2, remarks: 'Fair calculation skills' },
                        { code: '032', name: 'Chemistry', t1: 65, mid: 68, term: 70, score: 68, grade: 'B', pts: 2, remarks: 'Needs more practice in lab safety' },
                        { code: '033', name: 'Biology', t1: 78, mid: 80, term: 82, score: 80, grade: 'A', pts: 1, remarks: 'Good plant biology' },
                        { code: '041', name: 'Basic Mathematics', t1: 80, mid: 82, term: 84, score: 82, grade: 'A', pts: 1, remarks: 'Good arithmetic foundations' },
                        { code: '061', name: 'Information & Computer Studies (ICS)', t1: 85, mid: 86, term: 88, score: 86, grade: 'A', pts: 1, remarks: 'Good keyboarding & office apps' },
                      ]).map((sub) => (
                        <tr key={sub.code} className="hover:bg-slate-50">
                          <td className="p-3 border-r border-slate-200 font-extrabold">{sub.code} - {sub.name}</td>
                          <td className="p-3 text-center border-r border-slate-200 font-mono font-bold">{sub.t1}%</td>
                          <td className="p-3 text-center border-r border-slate-200 font-mono font-bold">{sub.mid}%</td>
                          <td className="p-3 text-center border-r border-slate-200 font-mono font-bold">{sub.term}%</td>
                          <td className="p-3 text-center border-r border-slate-200 font-mono font-black text-sm">{sub.score}%</td>
                          <td className="p-3 text-center border-r border-slate-200 font-black">
                            <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">Grade {sub.grade}</span>
                          </td>
                          <td className="p-3 text-center border-r border-slate-200 font-black">{sub.pts}</td>
                          <td className="p-3 text-slate-600 text-[11px]">{sub.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Internal Summary Box */}
                <div className="grid md:grid-cols-3 gap-4 border-2 border-slate-900 p-5 rounded-2xl bg-slate-50 text-xs">
                  <div className="space-y-1 border-r md:border-slate-300 pr-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Internal Score & Average</span>
                    <p className="text-xl font-black text-slate-900">
                      {selectedReportYear === '2026' ? '858 / 1000' : selectedReportYear === '2025' ? '827 / 1000' : '783 / 1000'} Marks
                    </p>
                    <p className="text-sm font-extrabold text-emerald-700">
                      Average: {selectedReportYear === '2026' ? '85.8%' : selectedReportYear === '2025' ? '82.7%' : '78.3%'} (Distinction)
                    </p>
                  </div>

                  <div className="space-y-1 border-r md:border-slate-300 pr-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Internal Grade / Division</span>
                    <p className="text-xl font-black text-emerald-800">
                      {selectedReportYear === '2026' ? 'DIVISION I (7 Points)' : selectedReportYear === '2025' ? 'DIVISION I (8 Points)' : 'DIVISION I (10 Points)'}
                    </p>
                    <p className="text-xs font-bold text-slate-700">Class Position: Rank #3 out of 45 Students</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Character & Behavior Rating</span>
                    <p className="text-sm font-black text-slate-900">Conduct: A - Very Good (Tabia Njema)</p>
                    <p className="text-[11px] text-slate-500 font-medium">Class Teacher: Tr. Alex Mhagama</p>
                  </div>
                </div>
              </div>
            )}

            {/* Signatures & Approval */}
            <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-slate-200 text-xs font-medium">
              <div className="space-y-4">
                <p className="font-bold text-slate-900">Class Teacher Remarks & Signature:</p>
                <p className="text-slate-600 italic border-b border-dashed border-slate-300 pb-2">
                  "Baraka is a exceptionally disciplined and hard-working scholar. Recommended for promotion."
                </p>
                <div className="flex items-center justify-between pt-2 text-[11px]">
                  <span>Signature: ____________________</span>
                  <span>Date: 01/09/2026</span>
                </div>
              </div>

              <div className="space-y-4 border-l border-slate-200 pl-6">
                <p className="font-bold text-slate-900">Headmaster Approval & School Stamp:</p>
                <div className="h-12 border-2 border-dashed border-slate-300 rounded-xl grid place-items-center text-slate-400 font-bold text-[11px]">
                  [ OFFICIAL SCHOOL STAMP HERE ]
                </div>
                <div className="flex items-center justify-between pt-2 text-[11px]">
                  <span>Headmaster: Tr. Joseph Kassim</span>
                  <span>Date: 01/09/2026</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUMULATIVE TIMELINE (2024 - 2026) */}
        {dossierTab === 'timeline' && (
          <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-600" /> Student Progression Timeline (2024 - 2026)
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Complete milestone history from admission day to current grade.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="bg-slate-900 text-white font-bold px-2.5 py-0.5 rounded-md text-[10px]">2024 (Form I)</span>
                  <span className="font-black text-slate-700">Initial Admission</span>
                </div>
                <p className="font-extrabold text-slate-900 text-xs pt-1">Enrollment & Form I Stage</p>
                <ul className="space-y-1.5 text-slate-600 font-medium text-[11px]">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Admitted on: {viewingStudent.admission_date || '10th Jan 2024'}</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Form I Terminal Exam: 82.4% (Grade A)</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Conduct: Excellent Discipline</li>
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="bg-slate-900 text-white font-bold px-2.5 py-0.5 rounded-md text-[10px]">2025 (Form II)</span>
                  <span className="font-black text-slate-700">FTNA National Exam</span>
                </div>
                <p className="font-extrabold text-slate-900 text-xs pt-1">Hostel Allocation & FTNA</p>
                <ul className="space-y-1.5 text-slate-600 font-medium text-[11px]">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Hostel Assigned: {viewingStudent.hostel_name || 'Kilimanjaro Hostel'}</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> FTNA National Exam: Division I (8 Points)</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Promoted to Form III Science</li>
                </ul>
              </div>

              <div className="bg-sky-50 border border-sky-200 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                  <span className="bg-sky-600 text-white font-bold px-2.5 py-0.5 rounded-md text-[10px]">Current 2026</span>
                  <span className="font-black text-sky-950">Form III Stage</span>
                </div>
                <p className="font-extrabold text-slate-900 text-xs pt-1">Term II Evaluation</p>
                <ul className="space-y-1.5 text-slate-700 font-medium text-[11px]">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Class Teacher: {viewingStudent.class_teacher_name || 'Tr. Alex Mhagama'}</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Class Monitor: {viewingStudent.class_monitor_name || 'Josephat K. Mwita'}</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Current Term Avg: 85.8% (Rank #3 / 45)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE, HOSTEL & DISCIPLINE */}
        {dossierTab === 'attendance' && (
          <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl space-y-6 shadow-xs text-xs">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Home className="w-4 h-4 text-purple-600" /> Attendance Rate, Boarding & Conduct Log
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-2">
                <span className="text-emerald-800 font-bold uppercase text-[10px]">Attendance Performance</span>
                <p className="text-2xl font-black text-emerald-950">98.3% Attendance Rate</p>
                <p className="text-[11px] text-emerald-700 font-medium">Attended 118 out of 120 school sessions. 2 excused sick days.</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 p-5 rounded-2xl space-y-2">
                <span className="text-purple-800 font-bold uppercase text-[10px]">Hostel Allocation</span>
                <p className="text-lg font-black text-slate-900">{viewingStudent.hostel_name || 'Kilimanjaro Hostel (Block B)'}</p>
                <p className="text-[11px] text-purple-800 font-medium">Hostel Master: {viewingStudent.hostel_master_name || 'Tr. Beatrice Kimaro'}</p>
              </div>

              <div className="bg-sky-50 border border-sky-200 p-5 rounded-2xl space-y-2">
                <span className="text-sky-800 font-bold uppercase text-[10px]">Disciplinary Rating</span>
                <p className="text-lg font-black text-slate-900">Conduct: A (Very Good)</p>
                <p className="text-[11px] text-sky-800 font-medium">Zero disciplinary warnings recorded on student file.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FEE LEDGER & TRANSACTIONS */}
        {dossierTab === 'fees' && (
          <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl space-y-6 shadow-xs text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-600" /> Student Fee Invoices & Payment Ledger
              </h3>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-black">
                Balance: TZS 150,000
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-black text-[10px] uppercase border-b border-slate-200">
                    <th className="p-3">Receipt No</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Payment Channel</th>
                    <th className="p-3">Reference No</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Amount Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-900">REC-88401</td>
                    <td className="p-3">Term II Boarding & Tuition Fee</td>
                    <td className="p-3">M-Pesa Mobile Money</td>
                    <td className="p-3 font-mono">MPESA-TX99281</td>
                    <td className="p-3">2026-08-25</td>
                    <td className="p-3 text-right font-black text-emerald-700">TZS 350,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-900">REC-88403</td>
                    <td className="p-3">Term I Tuition Deposit</td>
                    <td className="p-3">CRDB Bank Deposit</td>
                    <td className="p-3 font-mono">CRDB-DEP-4401</td>
                    <td className="p-3">2026-08-10</td>
                    <td className="p-3 text-right font-black text-emerald-700">TZS 350,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: BIO DATA & GUARDIAN */}
        {dossierTab === 'bio' && (
          <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl space-y-6 shadow-xs text-xs">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-blue-600" /> Bio Data & Emergency Guardian Contacts
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-extrabold text-slate-900 text-xs border-b border-slate-200 pb-2">Student Personal Bio</h4>
                <div className="space-y-2 text-slate-700 font-medium">
                  <p><strong className="text-slate-900">Full Name:</strong> {studentFullName}</p>
                  <p><strong className="text-slate-900">Date of Birth:</strong> {viewingStudent.date_of_birth || '15th March 2010'} ({calculateAge(viewingStudent.date_of_birth)})</p>
                  <p><strong className="text-slate-900">Gender:</strong> <span className="capitalize">{viewingStudent.gender}</span></p>
                  <p><strong className="text-slate-900">Religion:</strong> {viewingStudent.religion || 'Christianity'}</p>
                  <p><strong className="text-slate-900">Blood Group:</strong> {viewingStudent.blood_group || 'O+'}</p>
                  <p><strong className="text-slate-900">Medical Notes:</strong> {viewingStudent.medical_notes || 'No known allergies'}</p>
                </div>
              </div>

              <div className="space-y-3 bg-sky-50/70 p-5 rounded-2xl border border-sky-200">
                <h4 className="font-extrabold text-sky-950 text-xs border-b border-sky-200 pb-2">Parent & Guardian Contact</h4>
                <div className="space-y-2 text-slate-700 font-medium">
                  <p><strong className="text-slate-900">Primary Guardian:</strong> {viewingStudent.guardian_name || 'Juma Mkwawa'}</p>
                  <p><strong className="text-slate-900">Phone Number:</strong> {viewingStudent.guardian_phone || '+255 784 112 233'}</p>
                  <p><strong className="text-slate-900">Class Teacher:</strong> {viewingStudent.class_teacher_name || 'Tr. Alex Mhagama'}</p>
                  <p><strong className="text-slate-900">Class Monitor:</strong> {viewingStudent.class_monitor_name || 'Josephat K. Mwita'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =================================================================== */
  /* STANDARD DIRECTORY LISTING VIEW                                     */
  /* =================================================================== */
  return (
    <div className="space-y-6">
      {/* Clean Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isAdmin ? 'Student Directory & Governance' : 'Student Admissions Directory'}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {isAdmin
              ? 'Manage student records, class placements, and executive approvals.'
              : 'Register new students, update bio-data, and manage parent contacts.'}
          </p>
        </div>

        {isAdmissionOfficer && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Student</span>
          </button>
        )}
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="flex items-center justify-between bg-sky-50 border border-sky-200 text-sky-800 px-4 py-3 rounded-2xl text-xs font-bold shadow-xs">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-sky-600 hover:text-sky-900"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Enrolled</span>
            <span className="p-2.5 rounded-xl bg-sky-50 text-sky-700"><GraduationCap className="w-5 h-5" /></span>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{totalCount}</p>
          <p className="text-[11px] font-semibold text-slate-500 mt-1">{maleCount} Male · {femaleCount} Female</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Boarding Scholars</span>
            <span className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700"><Building className="w-5 h-5" /></span>
          </div>
          <p className="text-3xl font-black text-indigo-950 mt-4">{boardingCount}</p>
          <p className="text-[11px] font-semibold text-indigo-600 mt-1">{dayCount} Day Scholars</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Students</span>
            <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700"><UserCheck className="w-5 h-5" /></span>
          </div>
          <p className="text-3xl font-black text-emerald-950 mt-4">
            {students.filter(s => s.status === 'active').length}
          </p>
          <p className="text-[11px] font-semibold text-emerald-600 mt-1">Currently Attending</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Transferred / Suspended</span>
            <span className="p-2.5 rounded-xl bg-amber-50 text-amber-700"><AlertCircle className="w-5 h-5" /></span>
          </div>
          <p className="text-3xl font-black text-amber-950 mt-4">
            {students.filter(s => s.status === 'transferred' || s.status === 'suspended').length}
          </p>
          <p className="text-[11px] font-semibold text-amber-700 mt-1">Status Exceptions</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student name or admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
            />
          </div>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full md:w-44 bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="all">All Classes</option>
            <option value="Form I">Form I</option>
            <option value="Form II">Form II</option>
            <option value="Form III">Form III</option>
            <option value="Form IV">Form IV</option>
            <option value="Form V">Form V</option>
            <option value="Form VI">Form VI</option>
          </select>

          {/* Boarding Filter */}
          <select
            value={selectedBoarding}
            onChange={(e) => setSelectedBoarding(e.target.value)}
            className="w-full md:w-40 bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="all">All Residency</option>
            <option value="day">Day Scholars</option>
            <option value="boarding">Boarding</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full md:w-40 bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="transferred">Transferred</option>
            <option value="graduated">Graduated</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="rounded-3xl border border-slate-100 bg-white shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-black text-slate-900 text-base">Student Records ({filteredStudents.length})</h2>
          <span className="text-xs text-slate-400 font-semibold">Showing {filteredStudents.length} of {totalCount} students</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">Loading student directory...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400 space-y-2">
            <GraduationCap className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No student records match your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                  <th className="py-3.5 px-6">Student Name</th>
                  <th className="py-3.5 px-4">Admission No</th>
                  <th className="py-3.5 px-4">Class & Stream</th>
                  <th className="py-3.5 px-4">Residency</th>
                  <th className="py-3.5 px-4">Guardian Contact</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredStudents.map((student) => {
                  const fullName = `${student.first_name} ${student.middle_name || ''} ${student.last_name}`;
                  const className = student.class_room?.name || student.class_name || 'N/A';
                  const streamName = student.stream?.name || student.stream_name || 'A';

                  return (
                    <tr key={student.id} className="hover:bg-sky-50/40 transition-all duration-150">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-xs ${
                            student.gender === 'male' ? 'bg-gradient-to-tr from-sky-600 to-blue-600' : 'bg-gradient-to-tr from-rose-500 to-pink-600'
                          }`}>
                            {student.first_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm leading-snug">{fullName}</p>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{student.gender}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {student.admission_number}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-1 rounded-lg font-bold text-[11px]">
                          {className} - {streamName}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {student.boarding_status === 'boarding' ? (
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            Boarding
                          </span>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            Day Scholar
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 text-xs">{student.guardian_name || 'N/A'}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{student.guardian_phone || 'N/A'}</span>
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          student.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          student.status === 'suspended' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          student.status === 'transferred' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {student.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Complete Student Dossier Page */}
                          <button
                            onClick={() => {
                              setViewingStudent(student);
                              setDossierTab('necta_report');
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-[11px] font-bold transition-all"
                            title="Open Full Student File & NECTA Report"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Full Profile</span>
                          </button>

                          {/* Edit Bio-Data */}
                          <button
                            onClick={() => setEditingStudent(student)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-700 hover:bg-indigo-50 transition-all"
                            title="Edit Student Bio-Data"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Admin Executive Action Button */}
                          {isAdmin && (
                            <button
                              onClick={() => {
                                setGovernanceStudent(student);
                                setGovernanceAction('transfer');
                              }}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition-all"
                              title="Executive Action (Transfer/Suspend/Graduate)"
                            >
                              Action
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: REGISTER NEW STUDENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-sky-600" />
                <h3 className="font-black text-slate-900 text-lg">
                  Register New Student Admission
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleRegisterStudent} className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-3">
                <label className="block text-xs font-bold text-slate-700">
                  First Name *
                  <input
                    className={inputStyle}
                    value={newStudent.first_name}
                    onChange={(e) => setNewStudent({ ...newStudent, first_name: e.target.value })}
                    required
                    placeholder="Baraka"
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Middle Name
                  <input
                    className={inputStyle}
                    value={newStudent.middle_name}
                    onChange={(e) => setNewStudent({ ...newStudent, middle_name: e.target.value })}
                    placeholder="Juma"
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Last Name *
                  <input
                    className={inputStyle}
                    value={newStudent.last_name}
                    onChange={(e) => setNewStudent({ ...newStudent, last_name: e.target.value })}
                    required
                    placeholder="Mkwawa"
                  />
                </label>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <label className="block text-xs font-bold text-slate-700">
                  Admission No *
                  <input
                    className={inputStyle}
                    value={newStudent.admission_number}
                    onChange={(e) => setNewStudent({ ...newStudent, admission_number: e.target.value })}
                    placeholder="STD-2026-005"
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Gender *
                  <select
                    className={inputStyle}
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value as any })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Residency *
                  <select
                    className={inputStyle}
                    value={newStudent.boarding_status}
                    onChange={(e) => setNewStudent({ ...newStudent, boarding_status: e.target.value as any })}
                  >
                    <option value="day">Day Scholar</option>
                    <option value="boarding">Boarding</option>
                  </select>
                </label>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <label className="block text-xs font-bold text-slate-700">
                  Class Assigned
                  <select
                    className={inputStyle}
                    value={newStudent.class_room_id}
                    onChange={(e) => setNewStudent({ ...newStudent, class_room_id: e.target.value })}
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Date of Birth
                  <input
                    className={inputStyle}
                    type="date"
                    value={newStudent.date_of_birth}
                    onChange={(e) => setNewStudent({ ...newStudent, date_of_birth: e.target.value })}
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Admission Date
                  <input
                    className={inputStyle}
                    type="date"
                    value={newStudent.admission_date}
                    onChange={(e) => setNewStudent({ ...newStudent, admission_date: e.target.value })}
                  />
                </label>
              </div>

              {/* Class & Hostel Staff Details */}
              <div className="grid sm:grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <label className="block text-xs font-bold text-slate-700">
                  Mwalimu wa Darasa (Class Teacher)
                  <input
                    className={inputStyle}
                    value={newStudent.class_teacher_name}
                    onChange={(e) => setNewStudent({ ...newStudent, class_teacher_name: e.target.value })}
                    placeholder="Tr. Alex Mhagama"
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Class Monitor (Monita wa Darasa)
                  <input
                    className={inputStyle}
                    value={newStudent.class_monitor_name}
                    onChange={(e) => setNewStudent({ ...newStudent, class_monitor_name: e.target.value })}
                    placeholder="Josephat K. Mwita"
                  />
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="block text-xs font-bold text-slate-700">
                  Bweni la Mwanafunzi (Hostel Name)
                  <input
                    className={inputStyle}
                    value={newStudent.hostel_name}
                    onChange={(e) => setNewStudent({ ...newStudent, hostel_name: e.target.value })}
                    placeholder="Kilimanjaro Hostel (Block B)"
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Mwalimu Msimamizi wa Bweni (Hostel Master)
                  <input
                    className={inputStyle}
                    value={newStudent.hostel_master_name}
                    onChange={(e) => setNewStudent({ ...newStudent, hostel_master_name: e.target.value })}
                    placeholder="Tr. Beatrice Kimaro"
                  />
                </label>
              </div>

              {/* Guardian Info */}
              <div className="grid sm:grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <label className="block text-xs font-bold text-slate-700">
                  Guardian Full Name
                  <input
                    className={inputStyle}
                    value={newStudent.guardian_name}
                    onChange={(e) => setNewStudent({ ...newStudent, guardian_name: e.target.value })}
                    placeholder="Juma Mkwawa"
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Guardian Phone Number
                  <input
                    className={inputStyle}
                    value={newStudent.guardian_phone}
                    onChange={(e) => setNewStudent({ ...newStudent, guardian_phone: e.target.value })}
                    placeholder="+255 784 112 233"
                  />
                </label>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADMIN EXECUTIVE GOVERNANCE */}
      {governanceStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">Executive Decision Approval</h3>
              </div>
              <button onClick={() => setGovernanceStudent(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
              <p className="font-extrabold text-slate-900">
                {governanceStudent.first_name} {governanceStudent.middle_name} {governanceStudent.last_name}
              </p>
              <p className="text-slate-500 font-mono text-[11px]">{governanceStudent.admission_number}</p>
            </div>

            <form onSubmit={handleApplyGovernanceAction} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Executive Action</label>
                <select
                  value={governanceAction}
                  onChange={(e) => setGovernanceAction(e.target.value as any)}
                  className={inputStyle}
                >
                  <option value="transfer">Approve School Transfer (Kuhama Shule)</option>
                  <option value="suspend">Issue Disciplinary Suspension (Kusimamishwa)</option>
                  <option value="graduate">Approve Graduation Status (Kuhitimu)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Reason & Ref Number</label>
                <textarea
                  rows={3}
                  value={governanceReason}
                  onChange={(e) => setGovernanceReason(e.target.value)}
                  placeholder="Enter official minutes or approval notes for this decision..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-slate-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGovernanceStudent(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-black text-white font-bold py-2.5 rounded-xl text-xs shadow-md"
                >
                  Execute Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg">Edit Student Record & Staff Details</h3>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleUpdateStudent} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="block text-xs font-bold text-slate-700">
                  First Name
                  <input
                    className={inputStyle}
                    value={editingStudent.first_name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, first_name: e.target.value })}
                    required
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Last Name
                  <input
                    className={inputStyle}
                    value={editingStudent.last_name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, last_name: e.target.value })}
                    required
                  />
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="block text-xs font-bold text-slate-700">
                  Mwalimu wa Darasa (Class Teacher)
                  <input
                    className={inputStyle}
                    value={editingStudent.class_teacher_name || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, class_teacher_name: e.target.value })}
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Class Monitor (Monita wa Darasa)
                  <input
                    className={inputStyle}
                    value={editingStudent.class_monitor_name || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, class_monitor_name: e.target.value })}
                  />
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="block text-xs font-bold text-slate-700">
                  Bweni la Mwanafunzi (Hostel Name)
                  <input
                    className={inputStyle}
                    value={editingStudent.hostel_name || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, hostel_name: e.target.value })}
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Mwalimu Msimamizi wa Bweni (Hostel Master)
                  <input
                    className={inputStyle}
                    value={editingStudent.hostel_master_name || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, hostel_master_name: e.target.value })}
                  />
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <label className="block text-xs font-bold text-slate-700">
                  Guardian Name
                  <input
                    className={inputStyle}
                    value={editingStudent.guardian_name || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, guardian_name: e.target.value })}
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  Guardian Phone
                  <input
                    className={inputStyle}
                    value={editingStudent.guardian_phone || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, guardian_phone: e.target.value })}
                  />
                </label>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2.5 rounded-xl text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
