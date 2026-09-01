import React, { useState } from 'react';
import { MOCK_STUDENTS } from '../services/api';
import { GraduationCap, Users, CalendarCheck, CreditCard, Search, UserPlus, Filter } from 'lucide-react';

export const SchoolAdminDashboard: React.FC = () => {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [admNo, setAdmNo] = useState('');
  const [className, setClassName] = useState('Form II');
  const [streamName, setStreamName] = useState('A');
  const [boardingStatus, setBoardingStatus] = useState<'day' | 'boarding'>('boarding');

  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !admNo) return;

    const newStudent = {
      id: students.length + 1,
      school_id: 1,
      admission_number: admNo,
      first_name: firstName,
      middle_name: '',
      last_name: lastName,
      gender: 'male' as const,
      class_name: className,
      stream_name: streamName,
      boarding_status: boardingStatus,
      status: 'active' as const,
      guardian_name: `${lastName} Guardian`,
      guardian_phone: '+255 700 888 999',
      fee_balance: boardingStatus === 'boarding' ? 850000 : 600000,
    };

    setStudents([newStudent, ...students]);
    setShowModal(false);
    setFirstName('');
    setLastName('');
    setAdmNo('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-700 via-blue-800 to-sky-900 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Headmaster & School Admin Dashboard</h1>
          <p className="text-xs text-sky-100 font-medium mt-1">Haula International Secondary School • Academic Year 2026</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-white hover:bg-sky-50 text-sky-900 font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 border border-white"
        >
          <UserPlus className="w-4 h-4 text-sky-700" />
          <span>Register New Student</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrolled Students</span>
            <div className="p-3 rounded-xl bg-sky-50 text-sky-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{students.length + 846}</p>
          <span className="text-xs text-sky-700 font-bold mt-2 block">520 Boarding • 330 Day</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Attendance Rate</span>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">94.8%</p>
          <span className="text-xs text-emerald-600 font-bold mt-2 block">+1.2% higher than yesterday</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teaching Staff Count</span>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">42</p>
          <span className="text-xs text-indigo-600 font-bold mt-2 block">All subjects assigned</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fee Collection Rate</span>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">82.4%</p>
          <span className="text-xs text-amber-600 font-bold mt-2 block">Term II Tuition & Boarding</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-sky-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-black text-slate-900 text-lg">Student Master Directory</h3>
            <p className="text-xs text-slate-500 mt-0.5">Form I - Form VI student profiles and guardians</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student or admission #..."
                className="bg-sky-50/50 border border-sky-200 text-slate-800 text-xs pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-sky-500 w-56 font-medium"
              />
            </div>
            <button className="p-2.5 border border-sky-200 text-sky-700 rounded-xl hover:bg-sky-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sky-50/60 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-sky-100">
                <th className="py-4 px-6">Student Name</th>
                <th className="py-4 px-6">Admission #</th>
                <th className="py-4 px-6">Class & Stream</th>
                <th className="py-4 px-6">Boarding Status</th>
                <th className="py-4 px-6">Guardian Contact</th>
                <th className="py-4 px-6">Fee Balance</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100 text-xs font-semibold text-slate-700">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-sky-50/40 transition-all">
                  <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 font-black flex items-center justify-center text-xs">
                      {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                    </div>
                    <span className="font-extrabold text-slate-900">{student.first_name} {student.middle_name} {student.last_name}</span>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-slate-600">{student.admission_number}</td>
                  <td className="py-4 px-6 font-extrabold text-slate-900">{student.class_name} ({student.stream_name})</td>
                  <td className="py-4 px-6 capitalize">
                    <span className="inline-block px-3 py-1 rounded-lg text-[11px] font-extrabold bg-sky-50 text-sky-800 border border-sky-200">
                      {student.boarding_status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <p className="font-bold text-slate-900">{student.guardian_name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{student.guardian_phone}</p>
                  </td>
                  <td className="py-4 px-6 font-extrabold">
                    {student.fee_balance === 0 ? (
                      <span className="text-emerald-600 font-black">Cleared (0 TZS)</span>
                    ) : (
                      <span className="text-rose-600 font-black">TZS {student.fee_balance?.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-xs font-bold text-sky-600 hover:underline">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-sky-100">
            <h3 className="text-xl font-black text-slate-900 mb-1">Register New Student</h3>
            <p className="text-xs text-slate-500 mb-6">Assign admission number, class, stream, and boarding type.</p>

            <form onSubmit={handleRegisterStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    placeholder="Baraka"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-sky-50/50 border border-sky-200 text-slate-800 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-sky-600 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Mkwawa"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-sky-50/50 border border-sky-200 text-slate-800 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-sky-600 font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Admission Number</label>
                <input
                  type="text"
                  placeholder="STD-2026-005"
                  value={admNo}
                  onChange={(e) => setAdmNo(e.target.value)}
                  className="w-full bg-sky-50/50 border border-sky-200 text-slate-800 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-sky-600 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full bg-sky-50/50 border border-sky-200 text-slate-800 text-xs px-3 py-3 rounded-xl font-bold"
                  >
                    <option>Form I</option>
                    <option>Form II</option>
                    <option>Form III</option>
                    <option>Form IV</option>
                    <option>Form V</option>
                    <option>Form VI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stream</label>
                  <select
                    value={streamName}
                    onChange={(e) => setStreamName(e.target.value)}
                    className="w-full bg-sky-50/50 border border-sky-200 text-slate-800 text-xs px-3 py-3 rounded-xl font-bold"
                  >
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                    <option>Science</option>
                    <option>Arts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Boarding</label>
                  <select
                    value={boardingStatus}
                    onChange={(e) => setBoardingStatus(e.target.value as any)}
                    className="w-full bg-sky-50/50 border border-sky-200 text-slate-800 text-xs px-3 py-3 rounded-xl font-bold"
                  >
                    <option value="boarding">Boarding</option>
                    <option value="day">Day</option>
                  </select>
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
                  Save Student Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};