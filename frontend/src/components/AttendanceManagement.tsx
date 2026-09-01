import React, { useState, useMemo } from 'react';
import { MOCK_STUDENTS } from '../services/api';
import {
  CalendarCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Filter,
  Users,
  Send,
  Building,
  UserCheck,
  Eye,
  X,
  FileSpreadsheet,
  Printer
} from 'lucide-react';

type ClassSubmission = {
  id: number;
  class_name: string;
  stream_name: string;
  class_teacher: string;
  total_students: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  excused_count: number;
  submission_time: string;
  status: 'submitted' | 'pending';
};

export const AttendanceManagement: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notice, setNotice] = useState<string | null>(null);
  const [inspectingClass, setInspectingClass] = useState<ClassSubmission | null>(null);

  // Mock Class Submissions by Teachers
  const classSubmissions: ClassSubmission[] = [
    { id: 1, class_name: 'Form I', stream_name: 'Stream A', class_teacher: 'Tr. Alex Mhagama', total_students: 45, present_count: 43, absent_count: 1, late_count: 1, excused_count: 0, submission_time: '07:45 AM', status: 'submitted' },
    { id: 2, class_name: 'Form I', stream_name: 'Stream B', class_teacher: 'Tr. Mary Mushi', total_students: 42, present_count: 40, absent_count: 2, late_count: 0, excused_count: 0, submission_time: '07:50 AM', status: 'submitted' },
    { id: 3, class_name: 'Form II', stream_name: 'Stream A', class_teacher: 'Tr. Alex Mhagama', total_students: 48, present_count: 46, absent_count: 1, late_count: 0, excused_count: 1, submission_time: '07:42 AM', status: 'submitted' },
    { id: 4, class_name: 'Form II', stream_name: 'Stream B', class_teacher: 'Tr. Josephat Mwita', total_students: 44, present_count: 42, absent_count: 2, late_count: 0, excused_count: 0, submission_time: '08:02 AM', status: 'submitted' },
    { id: 5, class_name: 'Form III', stream_name: 'Science Stream', class_teacher: 'Tr. Alex Mhagama', total_students: 45, present_count: 44, absent_count: 0, late_count: 1, excused_count: 0, submission_time: '07:38 AM', status: 'submitted' },
    { id: 6, class_name: 'Form III', stream_name: 'Arts Stream', class_teacher: 'Tr. Hassan K. Juma', total_students: 40, present_count: 37, absent_count: 3, late_count: 0, excused_count: 0, submission_time: '08:15 AM', status: 'submitted' },
    { id: 7, class_name: 'Form IV', stream_name: 'Science Stream', class_teacher: 'Tr. Beatrice Kimaro', total_students: 46, present_count: 45, absent_count: 1, late_count: 0, excused_count: 0, submission_time: '07:40 AM', status: 'submitted' },
    { id: 8, class_name: 'Form IV', stream_name: 'Arts Stream', class_teacher: 'Tr. Hassan K. Juma', total_students: 42, present_count: 0, absent_count: 0, late_count: 0, excused_count: 0, submission_time: 'Pending', status: 'pending' },
  ];

  // Daily Absentees Log (Reported by Class Teachers)
  const absenteesLog = [
    { id: 1, admission_number: 'STD-2026-003', name: 'David Emmanuel Nyerere', class: 'Form IV Science', boarding: 'Boarding', guardian: 'Emmanuel Nyerere', phone: '+255 713 445 566', status: 'absent', remarks: 'Sick - Reported to dispensary' },
    { id: 2, admission_number: 'STD-2026-007', name: 'Zainab Hussein Issa', class: 'Form II Stream B', boarding: 'Day', guardian: 'Hussein Issa', phone: '+255 754 889 900', status: 'absent', remarks: 'Family Permission Request' },
    { id: 3, admission_number: 'STD-2026-012', name: 'Kelvin Peter Masawe', class: 'Form III Arts', boarding: 'Boarding', guardian: 'Peter Masawe', phone: '+255 767 112 244', status: 'absent', remarks: 'Unexcused Absence' },
  ];

  // Summary Statistics
  const stats = useMemo(() => {
    const totalClasses = classSubmissions.length;
    const submittedClasses = classSubmissions.filter((c) => c.status === 'submitted').length;
    const totalStudents = classSubmissions.reduce((acc, curr) => acc + curr.total_students, 0);
    const totalPresent = classSubmissions.reduce((acc, curr) => acc + curr.present_count + curr.late_count, 0);
    const totalAbsent = classSubmissions.reduce((acc, curr) => acc + curr.absent_count, 0);
    const overallRate = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

    return { totalClasses, submittedClasses, totalStudents, totalPresent, totalAbsent, overallRate };
  }, [classSubmissions]);

  // Filtered Class Submissions
  const filteredSubmissions = useMemo(() => {
    return classSubmissions.filter((c) => {
      const name = `${c.class_name} ${c.stream_name} ${c.class_teacher}`.toLowerCase();
      const matchesSearch = name.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [classSubmissions, searchTerm, statusFilter]);

  // Handle Send SMS Reminder
  const handleSendSms = (phone: string, name: string) => {
    setNotice(`Official Attendance SMS Alert sent to guardian of ${name} (${phone}).`);
    setTimeout(() => setNotice(null), 5000);
  };

  // Handle Broadcast All SMS
  const handleBroadcastAllSms = () => {
    setNotice(`Broadcast SMS Attendance Notification sent to all ${absenteesLog.length} absent student guardians.`);
    setTimeout(() => setNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarCheck className="w-7 h-7 text-sky-700" /> School Attendance Inspection & Compliance Audit Log
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Daftari la Ukaguzi na Utathmini wa Mahudhurio ya Shule (Headmaster & Administrative Overview)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBroadcastAllSms}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-700 to-blue-700 hover:from-sky-800 hover:to-blue-800 text-white font-extrabold px-5 py-3 rounded-2xl text-xs transition-all shadow-md shadow-sky-700/20 shrink-0"
          >
            <Send className="w-4 h-4" /> Broadcast Absentee SMS Alerts
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-xs font-bold text-emerald-950 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Overall School Attendance</span>
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-950">{stats.overallRate}%</p>
          <span className="text-[11px] text-emerald-700 font-bold">Campus Punctuality Average</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Class Submissions Status</span>
            <CheckCircle2 className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-3xl font-black text-sky-950">{stats.submittedClasses} / {stats.totalClasses}</p>
          <span className="text-[11px] text-sky-700 font-bold">Class Teacher Registers Submitted</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Total Absentees Reported</span>
            <XCircle className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-3xl font-black text-rose-950">{stats.totalAbsent}</p>
          <span className="text-[11px] text-rose-700 font-bold">Absentees Under Inspection</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Best Attendance Class</span>
            <Building className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-xl font-black text-purple-950 truncate">Form III Science</p>
          <span className="text-[11px] text-purple-700 font-bold">99.1% Punctuality Distinction</span>
        </div>
      </div>

      {/* Date & Filter Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">Audit Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Class Registers</option>
              <option value="submitted">Submitted Only</option>
              <option value="pending">Pending Submission</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search class or teacher name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* SECTION 1: CLASS TEACHER SUBMISSION STATUS LEDGER */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="border-b-2 border-slate-900 p-5 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-slate-900" /> Class Teacher Attendance Register Submissions Log
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Orodha ya Uwasilishaji wa Mahudhurio na Walimu wa Madarasa
            </p>
          </div>
          <span className="bg-slate-900 text-white font-mono font-bold px-3 py-1.5 rounded-xl text-xs self-start md:self-auto">
            DATE: {selectedDate}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-black text-[10px] uppercase border-b border-slate-900">
                <th className="p-4 border-r border-slate-800">Class Form & Stream</th>
                <th className="p-4 border-r border-slate-800">Class Teacher Assigned</th>
                <th className="p-4 text-center border-r border-slate-800">Total Enrolled</th>
                <th className="p-4 text-center border-r border-slate-800">Present</th>
                <th className="p-4 text-center border-r border-slate-800">Absentees</th>
                <th className="p-4 text-center border-r border-slate-800">Attendance Rate</th>
                <th className="p-4 text-center border-r border-slate-800">Submission Status</th>
                <th className="p-4 text-center">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
              {filteredSubmissions.map((item) => {
                const rate = item.total_students > 0 ? Math.round(((item.present_count + item.late_count) / item.total_students) * 100) : 0;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 border-r border-slate-200 font-extrabold text-slate-900">
                      {item.class_name} - {item.stream_name}
                    </td>

                    <td className="p-4 border-r border-slate-200 text-slate-800 font-bold">
                      {item.class_teacher}
                    </td>

                    <td className="p-4 text-center border-r border-slate-200 font-mono font-bold">
                      {item.total_students} Scholars
                    </td>

                    <td className="p-4 text-center border-r border-slate-200 font-mono font-bold text-emerald-800">
                      {item.present_count}
                    </td>

                    <td className="p-4 text-center border-r border-slate-200 font-mono font-bold text-rose-700">
                      {item.absent_count}
                    </td>

                    <td className="p-4 text-center border-r border-slate-200 font-black">
                      <span className="bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded border border-emerald-300 font-mono">
                        {rate}%
                      </span>
                    </td>

                    <td className="p-4 text-center border-r border-slate-200 font-bold">
                      {item.status === 'submitted' ? (
                        <span className="bg-emerald-100 text-emerald-950 px-2.5 py-1 rounded-lg text-[10px] uppercase font-black border border-emerald-300">
                          SUBMITTED ({item.submission_time})
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-950 px-2.5 py-1 rounded-lg text-[10px] uppercase font-black border border-amber-300">
                          PENDING SUBMISSION
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => setInspectingClass(item)}
                        className="px-3.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-extrabold text-[11px] transition-all flex items-center justify-center gap-1 mx-auto shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect Class Register
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: DAILY ABSENTEES & EXCUSED SICK LOG */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="border-b-2 border-slate-900 p-5 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" /> Daily Absentees & Medical Permission Inspection Log
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Ukaguzi wa Wanafunzi Wasiohudhuria na Tuma SMS kwa Wazazi
            </p>
          </div>
          <span className="bg-rose-100 text-rose-950 border border-rose-300 font-bold px-3 py-1 rounded-lg text-xs font-mono">
            {absenteesLog.length} ABSENTEES TODAY
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-black text-[10px] uppercase border-b border-slate-900">
                <th className="p-4 border-r border-slate-800">ADM No</th>
                <th className="p-4 border-r border-slate-800">Student Scholar Name</th>
                <th className="p-4 border-r border-slate-800">Class Form</th>
                <th className="p-4 border-r border-slate-800">Guardian Name & Phone</th>
                <th className="p-4 border-r border-slate-800">Reason / Excuse Remarks</th>
                <th className="p-4 text-center">SMS Alert Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
              {absenteesLog.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 border-r border-slate-200 font-mono font-black text-slate-900">
                    {log.admission_number}
                  </td>
                  <td className="p-4 border-r border-slate-200 font-extrabold">{log.name}</td>
                  <td className="p-4 border-r border-slate-200 font-bold">{log.class}</td>
                  <td className="p-4 border-r border-slate-200">
                    <p className="font-bold text-slate-900">{log.guardian}</p>
                    <p className="text-[10px] font-mono text-slate-500">{log.phone}</p>
                  </td>
                  <td className="p-4 border-r border-slate-200 font-bold text-rose-700">{log.remarks}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleSendSms(log.phone, log.name)}
                      className="px-3.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-extrabold text-[11px] transition-all flex items-center justify-center gap-1 mx-auto shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" /> Send Guardian SMS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* READ-ONLY CLASS INSPECTION MODAL */}
      {inspectingClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] uppercase font-black text-sky-700 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
                  Read-Only Inspection Mode
                </span>
                <h3 className="font-black text-slate-900 text-lg uppercase tracking-wider mt-1 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-slate-900" /> Class Register Audit: {inspectingClass.class_name} {inspectingClass.stream_name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Class Teacher: <strong>{inspectingClass.class_teacher}</strong> | Submitted at: <code className="font-mono font-bold">{inspectingClass.submission_time}</code>
                </p>
              </div>
              <button onClick={() => setInspectingClass(null)} className="p-2 text-slate-400 hover:text-slate-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-300 text-xs">
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px]">Total Enrolled</span>
                <p className="font-black text-slate-900 text-base">{inspectingClass.total_students}</p>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px]">Present</span>
                <p className="font-black text-emerald-800 text-base">{inspectingClass.present_count}</p>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px]">Absentees</span>
                <p className="font-black text-rose-700 text-base">{inspectingClass.absent_count}</p>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px]">Class Rate</span>
                <p className="font-black text-sky-900 text-base">
                  {Math.round(((inspectingClass.present_count + inspectingClass.late_count) / inspectingClass.total_students) * 100)}%
                </p>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-600 font-medium leading-relaxed bg-sky-50 border border-sky-200 p-4 rounded-xl">
              <strong>Administrative Audit Note:</strong> Daily roll-call attendance is exclusively prepared and submitted by the assigned Class Teacher. The Headmaster and School Administration audit class submission compliance and issue SMS notifications to guardians.
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setInspectingClass(null)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-extrabold text-xs"
              >
                Close Inspection View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
