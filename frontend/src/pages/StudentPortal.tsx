import React from 'react';
import { MOCK_MARKS } from '../services/api';
import { GraduationCap, BookOpen, Download } from 'lucide-react';

export const StudentPortal: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-700 via-blue-800 to-sky-900 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/15 text-sky-100 border border-white/20 px-3.5 py-1 rounded-full text-xs font-bold mb-3 shadow-xs">
            <GraduationCap className="w-4 h-4 text-sky-300" />
            <span>Student eLearning Portal • Baraka Juma Mkwawa</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Form II A • Academic Dashboard</h1>
          <p className="text-xs text-sky-100 font-medium mt-1">Access notes, assignments, timetable, and view published examination grades.</p>
        </div>

        <div className="bg-white/15 border border-white/20 p-4 rounded-2xl text-center backdrop-blur-xs">
          <span className="text-[10px] text-sky-200 font-bold uppercase tracking-wider block">Overall Grade Average</span>
          <span className="text-2xl font-black text-white">82.8% (Division I)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-sky-100">
            <h3 className="font-black text-slate-900 text-lg">My Examination Marks</h3>
            <p className="text-xs text-slate-500">Term II Terminal Exam 2026</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sky-50/60 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-sky-100">
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Score</th>
                  <th className="py-4 px-6">Grade</th>
                  <th className="py-4 px-6">Teacher Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 text-xs font-semibold text-slate-700">
                {MOCK_MARKS.map((m) => (
                  <tr key={m.id} className="hover:bg-sky-50/40">
                    <td className="py-4 px-6 font-extrabold text-slate-900">{m.subject_name}</td>
                    <td className="py-4 px-6 font-black text-slate-900">{m.score}%</td>
                    <td className="py-4 px-6">
                      <span className="px-3.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs">
                        {m.grade}
                      </span>
                    </td>
                    <td className="py-4 px-6 italic text-slate-600 font-medium">{m.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-sky-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-sky-100 pb-4">
            <h3 className="font-black text-slate-900 text-lg">Class Learning Notes</h3>
            <BookOpen className="w-5 h-5 text-sky-600" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-sky-50/60 border border-sky-100 rounded-2xl flex items-center justify-between hover:bg-sky-100/60 transition-all">
              <div>
                <p className="font-bold text-slate-900">Quadratic Equations & Vectors</p>
                <span className="text-[10px] text-slate-400 font-medium">Mathematics • Form II (PDF 2.4 MB)</span>
              </div>
              <button className="p-2.5 bg-white text-sky-600 border border-sky-200 rounded-xl hover:bg-sky-600 hover:text-white transition-all shadow-xs">
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-sky-50/60 border border-sky-100 rounded-2xl flex items-center justify-between hover:bg-sky-100/60 transition-all">
              <div>
                <p className="font-bold text-slate-900">Newton's Laws of Motion</p>
                <span className="text-[10px] text-slate-400 font-medium">Physics • Form II (PDF 1.8 MB)</span>
              </div>
              <button className="p-2.5 bg-white text-sky-600 border border-sky-200 rounded-xl hover:bg-sky-600 hover:text-white transition-all shadow-xs">
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-sky-50/60 border border-sky-100 rounded-2xl flex items-center justify-between hover:bg-sky-100/60 transition-all">
              <div>
                <p className="font-bold text-slate-900">Uchanganuzi wa Fasihi ya Kiswahili</p>
                <span className="text-[10px] text-slate-400 font-medium">Kiswahili • Form II (PDF 3.1 MB)</span>
              </div>
              <button className="p-2.5 bg-white text-sky-600 border border-sky-200 rounded-xl hover:bg-sky-600 hover:text-white transition-all shadow-xs">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};