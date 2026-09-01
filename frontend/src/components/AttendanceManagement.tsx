import React, { useState, useMemo } from 'react';
import { MOCK_STUDENTS, MOCK_ATTENDANCE } from '../services/api';
import {
  CalendarCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  Filter,
  Users,
  Send,
  Building,
  UserCheck
} from 'lucide-react';

export const AttendanceManagement: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('Form II Stream A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sessionType, setSessionType] = useState<'morning' | 'afternoon' | 'hostel'>('morning');
  const [searchTerm, setSearchTerm] = useState('');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Student Attendance State Map
  const [attendanceMap, setAttendanceMap] = useState<Record<number, { status: 'present' | 'absent' | 'late' | 'excused'; remarks: string }>>({
    1: { status: 'present', remarks: '' },
    2: { status: 'present', remarks: '' },
    3: { status: 'absent', remarks: 'Sick - Reported to dispensary' },
    4: { status: 'late', remarks: 'Arrived at 08:20 AM' },
  });

  // Filter students by selected class & search
  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter((s) => {
      const fullName = `${s.first_name} ${s.middle_name || ''} ${s.last_name}`.toLowerCase();
      const adm = s.admission_number.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase()) || adm.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  // Attendance Summary Stats
  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    filteredStudents.forEach((s) => {
      const record = attendanceMap[s.id] || { status: 'present' };
      if (record.status === 'present') present++;
      if (record.status === 'absent') absent++;
      if (record.status === 'late') late++;
      if (record.status === 'excused') excused++;
    });

    const total = filteredStudents.length || 1;
    const rate = Math.round(((present + late) / total) * 100);

    return { total, present, absent, late, excused, rate };
  }, [filteredStudents, attendanceMap]);

  // Handle Radio Change
  const handleStatusChange = (studentId: number, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        status,
        remarks: prev[studentId]?.remarks || '',
      },
    }));
  };

  // Handle Remarks Change
  const handleRemarksChange = (studentId: number, remarks: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || 'present',
        remarks,
      },
    }));
  };

  // Save Attendance & Broadcast SMS Notice
  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveNotice(`Daily Attendance Register for ${selectedClass} on ${selectedDate} saved successfully! SMS notification sent to 2 absent guardians.`);
    setTimeout(() => setSaveNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarCheck className="w-7 h-7 text-sky-700" /> Daily School Attendance & Punctuality Register
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Daftari Rasmi la Mahudhurio ya Kila Siku ya Wanafunzi (Haula Secondary Campus)
          </p>
        </div>

        <button
          onClick={handleSaveAttendance}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-700 to-blue-700 hover:from-sky-800 hover:to-blue-800 text-white font-extrabold px-5 py-3 rounded-2xl text-xs transition-all shadow-md shadow-sky-700/20 shrink-0"
        >
          <Save className="w-4 h-4" /> Save & Lock Register
        </button>
      </div>

      {/* Save Success Notice */}
      {saveNotice && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-xs font-bold text-emerald-950 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Today's Attendance Rate</span>
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-950">{stats.rate}%</p>
          <span className="text-[11px] text-emerald-700 font-bold">Class Attendance Benchmark</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Students Present</span>
            <CheckCircle2 className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-3xl font-black text-sky-950">{stats.present}</p>
          <span className="text-[11px] text-sky-700 font-bold">In Classroom / On Campus</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Absences Reported</span>
            <XCircle className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-3xl font-black text-rose-950">{stats.absent}</p>
          <span className="text-[11px] text-rose-700 font-bold">Absentees Trigger SMS Alert</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Late / Excused</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-amber-950">{stats.late + stats.excused}</p>
          <span className="text-[11px] text-amber-700 font-bold">{stats.late} Late | {stats.excused} Medical Permission</span>
        </div>
      </div>

      {/* Control Bar: Class, Date & Session Selectors */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-500" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="Form I Stream A">Form I - Stream A</option>
              <option value="Form II Stream A">Form II - Stream A (FTNA)</option>
              <option value="Form III Science Stream">Form III - Science Stream</option>
              <option value="Form IV Arts Stream">Form IV - Arts Stream (CSEE)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSessionType('morning')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                sessionType === 'morning' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Morning Roll-Call
            </button>
            <button
              onClick={() => setSessionType('afternoon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                sessionType === 'afternoon' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Afternoon Class
            </button>
            <button
              onClick={() => setSessionType('hostel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                sessionType === 'hostel' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Evening Hostel Roll
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student name or ADM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 p-4 bg-slate-50 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-sky-700" /> Official Class Attendance Register ({selectedClass})
          </h3>
          <span className="bg-slate-900 text-white font-mono font-bold px-3 py-1 rounded-lg text-[11px]">
            REGISTER DATE: {selectedDate}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-black text-[10px] uppercase border-b border-slate-900">
                <th className="p-4 border-r border-slate-800">ADM No</th>
                <th className="p-4 border-r border-slate-800">Student Scholar Name</th>
                <th className="p-4 border-r border-slate-800">Gender & Boarding</th>
                <th className="p-4 text-center border-r border-slate-800">Attendance Status Radio</th>
                <th className="p-4">Remarks / Medical Excuse Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
              {filteredStudents.map((student) => {
                const fullName = `${student.first_name} ${student.middle_name || ''} ${student.last_name}`.trim();
                const record = attendanceMap[student.id] || { status: 'present', remarks: '' };

                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 border-r border-slate-200 font-mono font-black text-slate-900">
                      {student.admission_number}
                    </td>

                    <td className="p-4 border-r border-slate-200 font-extrabold">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0">
                          {student.first_name.charAt(0)}
                          {student.last_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900">{fullName}</p>
                          <span className="text-[10px] text-slate-500 font-mono">Guardian: {student.guardian_name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 border-r border-slate-200 text-slate-700">
                      <span className="capitalize font-bold text-slate-900">{student.gender}</span> ·{' '}
                      <span className="text-[11px] font-semibold text-slate-600 capitalize">{student.boarding_status}</span>
                    </td>

                    {/* Radio Selector */}
                    <td className="p-4 border-r border-slate-200">
                      <div className="flex items-center justify-center gap-2">
                        <label
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all border ${
                            record.status === 'present'
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`att_${student.id}`}
                            checked={record.status === 'present'}
                            onChange={() => handleStatusChange(student.id, 'present')}
                            className="sr-only"
                          />
                          <span>Present</span>
                        </label>

                        <label
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all border ${
                            record.status === 'absent'
                              ? 'bg-rose-100 text-rose-950 border-rose-400 font-black shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`att_${student.id}`}
                            checked={record.status === 'absent'}
                            onChange={() => handleStatusChange(student.id, 'absent')}
                            className="sr-only"
                          />
                          <span>Absent</span>
                        </label>

                        <label
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all border ${
                            record.status === 'late'
                              ? 'bg-amber-100 text-amber-950 border-amber-400 font-black shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`att_${student.id}`}
                            checked={record.status === 'late'}
                            onChange={() => handleStatusChange(student.id, 'late')}
                            className="sr-only"
                          />
                          <span>Late</span>
                        </label>

                        <label
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all border ${
                            record.status === 'excused'
                              ? 'bg-sky-100 text-sky-950 border-sky-400 font-black shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`att_${student.id}`}
                            checked={record.status === 'excused'}
                            onChange={() => handleStatusChange(student.id, 'excused')}
                            className="sr-only"
                          />
                          <span>Excused</span>
                        </label>
                      </div>
                    </td>

                    {/* Remarks Input */}
                    <td className="p-4">
                      <input
                        type="text"
                        placeholder="Add excuse note or remarks..."
                        value={record.remarks}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
