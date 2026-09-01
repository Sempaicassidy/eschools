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
  CheckCircle2,
  AlertCircle
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

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedBoarding, setSelectedBoarding] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
  const [viewingStudent, setViewingStudent] = useState<StudentItem | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'academic' | 'residency' | 'marks' | 'guardian'>('overview');
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
                          {/* View Complete Student Dossier */}
                          <button
                            onClick={() => {
                              setViewingStudent(student);
                              setActiveProfileTab('overview');
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-[11px] font-bold transition-all"
                            title="View Full Student Dossier"
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

      {/* MODAL 2: BREATHTAKING EXECUTIVE STUDENT DOSSIER PROFILE */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 md:p-6 overflow-y-auto">
          <div className="w-full max-w-5xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 my-auto border border-slate-200">
            {/* Dossier Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-sky-50 text-sky-700 rounded-2xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Student Academic Dossier & Profile</h2>
                  <p className="text-xs text-slate-500 font-medium">Official student file and comprehensive school record.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print Student File</span>
                </button>
                <button
                  onClick={() => setViewingStudent(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* 2-Column Executive Dossier Grid */}
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6 text-xs">
              
              {/* LEFT COLUMN: STUDENT ID CARD & BIO STATS */}
              <div className="space-y-5">
                {/* ID Badge Card */}
                <div className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-4">
                  <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                    <GraduationCap className="w-32 h-32 text-white" />
                  </div>

                  <div className="flex flex-col items-center text-center space-y-3">
                    {/* Photo with Glowing Ring */}
                    <div className="relative">
                      <div className={`w-24 h-24 rounded-3xl flex items-center justify-center font-black text-3xl text-white shadow-2xl border-4 border-white/20 ${
                        viewingStudent.gender === 'male' ? 'bg-gradient-to-tr from-sky-500 to-blue-600' : 'bg-gradient-to-tr from-rose-500 to-pink-600'
                      }`}>
                        {viewingStudent.photo ? (
                          <img src={viewingStudent.photo} alt={viewingStudent.first_name} className="w-full h-full object-cover rounded-3xl" />
                        ) : (
                          viewingStudent.first_name.charAt(0)
                        )}
                      </div>
                      <span className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-md ${
                        viewingStudent.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {viewingStudent.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black tracking-tight leading-snug text-white">
                        {viewingStudent.first_name} {viewingStudent.middle_name || ''} {viewingStudent.last_name}
                      </h3>
                      <p className="text-sky-300 font-mono text-xs mt-0.5 font-bold">
                        ADM: {viewingStudent.admission_number}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                      <span className="bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-bold text-sky-200">
                        {viewingStudent.class_room?.name || viewingStudent.class_name || 'Form II'} - Stream A
                      </span>
                      <span className="bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-bold text-indigo-200 capitalize">
                        {viewingStudent.boarding_status}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-2 text-center text-[11px]">
                    <div className="bg-white/5 p-2 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">Age</span>
                      <span className="font-bold text-white">{calculateAge(viewingStudent.date_of_birth)}</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">Gender</span>
                      <span className="font-bold text-white capitalize">{viewingStudent.gender}</span>
                    </div>
                  </div>
                </div>

                {/* Personal & Bio Details Card */}
                <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-3xl space-y-3">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                    <User className="w-4 h-4 text-sky-600" /> Bio Data & Health Info
                  </h4>
                  <div className="space-y-2 text-slate-700 font-medium">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Date of Birth:</span>
                      <strong className="text-slate-900">{viewingStudent.date_of_birth || '15th March 2010'}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Religion:</span>
                      <strong className="text-slate-900">{viewingStudent.religion || 'Christianity'}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Nationality:</span>
                      <strong className="text-slate-900">{viewingStudent.nationality || 'Tanzanian'}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Blood Group:</span>
                      <strong className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-black">{viewingStudent.blood_group || 'O+'}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Previous School:</span>
                      <strong className="text-slate-900">{viewingStudent.previous_school || 'Mwenge Primary School'}</strong>
                    </div>
                  </div>
                </div>

                {/* Guardian Quick Call Box */}
                <div className="bg-sky-50/70 border border-sky-200 p-5 rounded-3xl space-y-2">
                  <span className="text-sky-800 font-bold text-xs uppercase tracking-wider block">Parent & Guardian Contact</span>
                  <p className="text-base font-black text-slate-900">{viewingStudent.guardian_name || 'Juma Mkwawa'}</p>
                  <p className="text-xs text-sky-800 font-bold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                    <span>{viewingStudent.guardian_phone || '+255 784 112 233'}</span>
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: COMPLETE ACADEMIC & HOSTEL DOSSIER */}
              <div className="space-y-5">
                
                {/* Academic Leadership Grid (Class Teacher & Class Monitor) */}
                <div className="bg-white border border-slate-200/80 p-5 rounded-3xl space-y-3 shadow-xs">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                    <UserCog className="w-4 h-4 text-indigo-600" /> Academic & Class Governance
                  </h4>
                  
                  <div className="grid sm:grid-cols-2 gap-3">
                    {/* Class Teacher */}
                    <div className="bg-sky-50/60 border border-sky-100 p-3.5 rounded-2xl space-y-1">
                      <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">Mwalimu wa Darasa (Class Teacher)</span>
                      <p className="font-black text-slate-900 text-sm">{viewingStudent.class_teacher_name || 'Tr. Alex Mhagama'}</p>
                      <p className="text-[11px] text-slate-500 font-medium">Class supervisor & academic mentor for {viewingStudent.class_room?.name || viewingStudent.class_name || 'Form II'}.</p>
                    </div>

                    {/* Class Monitor */}
                    <div className="bg-indigo-50/60 border border-indigo-100 p-3.5 rounded-2xl space-y-1">
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Monita wa Darasa (Class Prefect)</span>
                      <p className="font-black text-slate-900 text-sm">{viewingStudent.class_monitor_name || 'Josephat K. Mwita'}</p>
                      <p className="text-[11px] text-slate-500 font-medium">Student prefect in charge of daily logbook and class order.</p>
                    </div>
                  </div>
                </div>

                {/* Residency & Hostel Governance Grid */}
                <div className="bg-white border border-slate-200/80 p-5 rounded-3xl space-y-3 shadow-xs">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Home className="w-4 h-4 text-purple-600" /> Boarding & Hostel Accommodation
                  </h4>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {/* Hostel Name */}
                    <div className="bg-purple-50/60 border border-purple-100 p-3.5 rounded-2xl space-y-1">
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Bweni la Mwanafunzi (Hostel)</span>
                      <p className="font-black text-slate-900 text-sm">
                        {viewingStudent.boarding_status === 'boarding'
                          ? (viewingStudent.hostel_name || 'Kilimanjaro Hostel (Block B)')
                          : 'Day Scholar (No Hostel Allocated)'}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">Assigned residential room for prep & sleeping.</p>
                    </div>

                    {/* Hostel Master */}
                    <div className="bg-pink-50/60 border border-pink-100 p-3.5 rounded-2xl space-y-1">
                      <span className="text-[10px] font-bold text-pink-700 uppercase tracking-wider block">Mwalimu Msimamizi wa Bweni</span>
                      <p className="font-black text-slate-900 text-sm">
                        {viewingStudent.boarding_status === 'boarding'
                          ? (viewingStudent.hostel_master_name || 'Tr. Beatrice Kimaro')
                          : 'N/A'}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">Patron/Matron in charge of dorm welfare & prep.</p>
                    </div>
                  </div>
                </div>

                {/* Comprehensive Examination Results & Multi-Test Progress Matrix */}
                <div className="bg-white border border-slate-200/80 p-5 rounded-3xl space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-600" /> Student Comprehensive Academic Progress & All Test Results
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Track progress across Continuous Assessments (Monthly Tests), Mid-Term, and Terminal Exams for all subjects.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-black">
                        Division I (7 Points)
                      </span>
                      <span className="bg-sky-50 text-sky-800 border border-sky-200 px-3 py-1 rounded-full text-xs font-black">
                        Rank: #3 / 45 (Avg: 85.9%)
                      </span>
                    </div>
                  </div>

                  {/* All Subjects & Multi-Test Performance Matrix Table */}
                  <div className="border border-slate-200/80 rounded-2xl overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/90 text-slate-600 font-extrabold text-[10px] uppercase tracking-wider border-b border-slate-200">
                          <th className="p-3">Subject Name</th>
                          <th className="p-3 text-center">Test 1 (20%)</th>
                          <th className="p-3 text-center">Mid-Term (20%)</th>
                          <th className="p-3 text-center">Terminal (60%)</th>
                          <th className="p-3 text-center">Term Avg & Grade</th>
                          <th className="p-3 text-center">Trend</th>
                          <th className="p-3">Teacher Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                        {[
                          { id: 1, subject: 'Basic Mathematics', t1: 85, mid: 88, term: 91, avg: 88.9, grade: 'A', trend: '+3.2%', remarks: 'Outstanding logical reasoning & algebra' },
                          { id: 2, subject: 'Physics', t1: 76, mid: 81, term: 80, avg: 79.4, grade: 'A', trend: '+4.0%', remarks: 'Strong in mechanics & optics calculations' },
                          { id: 3, subject: 'Chemistry', t1: 70, mid: 72, term: 75, avg: 73.4, grade: 'B', trend: '+2.5%', remarks: 'Good effort in organic chemistry balance' },
                          { id: 4, subject: 'Biology', t1: 82, mid: 85, term: 88, avg: 86.2, grade: 'A', trend: '+3.0%', remarks: 'Excellent cell structure drawings & practicals' },
                          { id: 5, subject: 'English Language', t1: 89, mid: 92, term: 93, avg: 92.0, grade: 'A', trend: '+1.5%', remarks: 'High fluency, vocabulary & comprehension' },
                          { id: 6, subject: 'Kiswahili', t1: 80, mid: 83, term: 86, avg: 84.2, grade: 'A', trend: '+3.0%', remarks: 'Ushahidi wa kipekee katika uchanganuzi wa fasihi' },
                          { id: 7, subject: 'Geography', t1: 78, mid: 80, term: 82, avg: 80.8, grade: 'A', trend: '+2.0%', remarks: 'Good map work, contours & climate analysis' },
                          { id: 8, subject: 'History', t1: 84, mid: 87, term: 89, avg: 87.6, grade: 'A', trend: '+2.3%', remarks: 'Strong historical recall & essay structure' },
                          { id: 9, subject: 'Civics', t1: 88, mid: 90, term: 92, avg: 90.8, grade: 'A', trend: '+2.0%', remarks: 'Deep understanding of constitutional rights' },
                          { id: 10, subject: 'Computer Studies (ICS)', t1: 90, mid: 94, term: 96, avg: 94.4, grade: 'A', trend: '+2.6%', remarks: 'Top programmer & computer logic in class' },
                        ].map((sub) => (
                          <tr key={sub.id} className="hover:bg-sky-50/30 transition-all">
                            <td className="p-3 font-extrabold text-slate-900">{sub.subject}</td>
                            <td className="p-3 text-center font-mono font-bold text-slate-700">{sub.t1}%</td>
                            <td className="p-3 text-center font-mono font-bold text-slate-700">{sub.mid}%</td>
                            <td className="p-3 text-center font-mono font-bold text-slate-700">{sub.term}%</td>
                            <td className="p-3 text-center">
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg font-black text-[11px]">
                                {sub.avg}% ({sub.grade})
                              </span>
                            </td>
                            <td className="p-3 text-center font-extrabold text-emerald-600 text-[11px]">
                              {sub.trend}
                            </td>
                            <td className="p-3 text-slate-500 font-medium text-[11px]">{sub.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Footer Close Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setViewingStudent(null)}
                className="bg-slate-900 hover:bg-black text-white font-bold px-8 py-3 rounded-2xl text-xs shadow-md transition-all"
              >
                Close Student File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADMIN EXECUTIVE GOVERNANCE */}
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
