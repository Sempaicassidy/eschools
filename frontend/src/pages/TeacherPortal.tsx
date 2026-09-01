import React, { useState } from 'react';
import { MOCK_ATTENDANCE, MOCK_MARKS } from '../services/api';
import { CalendarCheck, Award, Save, CheckCircle2, BookOpen, Send } from 'lucide-react';

export const TeacherPortal: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'attendance' | 'marks'>('attendance');
  const [attendanceList, setAttendanceList] = useState(MOCK_ATTENDANCE);
  const [marksList, setMarksList] = useState(MOCK_MARKS);
  const [selectedClass, setSelectedClass] = useState('Form II A');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleStatusChange = (id: number, newStatus: any) => {
    setAttendanceList(
      attendanceList.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleScoreChange = (id: number, newScore: number) => {
    setMarksList(
      marksList.map((item) => {
        if (item.id === id) {
          let grade = 'F';
          if (newScore >= 75) grade = 'A';
          else if (newScore >= 65) grade = 'B';
          else if (newScore >= 45) grade = 'C';
          else if (newScore >= 30) grade = 'D';
          return { ...item, score: newScore, grade };
        }
        return item;
      })
    );
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-700 via-blue-800 to-sky-900 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/15 text-sky-100 border border-white/20 px-3.5 py-1 rounded-full text-xs font-bold mb-3 shadow-xs">
            <BookOpen className="w-4 h-4 text-sky-300" />
            <span>Teacher Portal • Mwl. Christopher Mollel</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Class Register & Marks Entry</h1>
          <p className="text-xs text-sky-100 font-medium mt-1">Take daily class attendance and submit examination marks for your assigned subjects.</p>
        </div>

        <div className="flex bg-white/15 p-1 rounded-2xl border border-white/20 backdrop-blur-xs">
          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === 'attendance'
                ? 'bg-white text-sky-950 shadow-md'
                : 'text-sky-100 hover:text-white'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Take Attendance</span>
          </button>
          <button
            onClick={() => setActiveSubTab('marks')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeSubTab === 'marks'
                ? 'bg-white text-sky-950 shadow-md'
                : 'text-sky-100 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Enter Marks</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Records successfully submitted and saved to Laravel Backend Database API!</span>
        </div>
      )}

      {activeSubTab === 'attendance' && (
        <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-sky-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-black text-slate-900 text-lg">Class Attendance Roll Call</h3>
              <p className="text-xs text-slate-500">Date: {new Date().toLocaleDateString('en-GB')} • Morning Session</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-sky-50/50 border border-sky-200 text-slate-800 text-xs px-4 py-2.5 rounded-xl font-bold"
              >
                <option>Form II A</option>
                <option>Form II B</option>
                <option>Form IV Science</option>
              </select>

              <button
                onClick={handleSave}
                className="bg-sky-600 hover:bg-sky-500 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Submit Attendance</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sky-50/60 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-sky-100">
                  <th className="py-4 px-6">Student Name</th>
                  <th className="py-4 px-6">Admission #</th>
                  <th className="py-4 px-6">Attendance Status</th>
                  <th className="py-4 px-6">Remarks / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 text-xs font-semibold text-slate-700">
                {attendanceList.map((item) => (
                  <tr key={item.id} className="hover:bg-sky-50/40">
                    <td className="py-4 px-6 font-extrabold text-slate-900">{item.student_name}</td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-600">{item.admission_number}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusChange(item.id, 'present')}
                          className={`px-4 py-1.5 rounded-xl text-xs font-black ${
                            item.status === 'present'
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.id, 'absent')}
                          className={`px-4 py-1.5 rounded-xl text-xs font-black ${
                            item.status === 'absent'
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.id, 'late')}
                          className={`px-4 py-1.5 rounded-xl text-xs font-black ${
                            item.status === 'late'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          Late
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <input
                        type="text"
                        placeholder="Add note..."
                        value={item.remarks || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAttendanceList(attendanceList.map(a => a.id === item.id ? { ...a, remarks: val } : a));
                        }}
                        className="bg-sky-50/50 border border-sky-200 text-slate-800 text-xs px-3.5 py-2 rounded-xl w-full font-medium"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'marks' && (
        <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-sky-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-black text-slate-900 text-lg">Term II Terminal Marks Entry Matrix</h3>
              <p className="text-xs text-slate-500">Subject: {selectedSubject} • Class: {selectedClass}</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-sky-50/50 border border-sky-200 text-slate-800 text-xs px-4 py-2.5 rounded-xl font-bold"
              >
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>English Language</option>
                <option>Kiswahili</option>
              </select>

              <button
                onClick={handleSave}
                className="bg-sky-600 hover:bg-sky-500 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Marks to Academic Master</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sky-50/60 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-sky-100">
                  <th className="py-4 px-6">Student Name</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Score (0-100)</th>
                  <th className="py-4 px-6">Calculated Grade</th>
                  <th className="py-4 px-6">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 text-xs font-semibold text-slate-700">
                {marksList.map((item) => (
                  <tr key={item.id} className="hover:bg-sky-50/40">
                    <td className="py-4 px-6 font-extrabold text-slate-900">{item.student_name}</td>
                    <td className="py-4 px-6 text-slate-600">{item.subject_name}</td>
                    <td className="py-4 px-6">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.score}
                        onChange={(e) => handleScoreChange(item.id, Number(e.target.value))}
                        className="bg-sky-50 border border-sky-300 font-black text-slate-900 text-sm px-3.5 py-2 rounded-xl w-24 text-center focus:outline-none focus:border-sky-600"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3.5 py-1 rounded-lg text-xs font-black ${
                        item.grade === 'A' ? 'bg-emerald-100 text-emerald-800' :
                        item.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                        item.grade === 'C' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        Grade {item.grade}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 italic font-medium">{item.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};