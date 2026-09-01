import React, { useState } from 'react';
import { MOCK_MARKS } from '../services/api';
import { Users, Award, CalendarCheck, CreditCard, Printer, FileText } from 'lucide-react';

export const ParentPortal: React.FC = () => {
  const [marks] = useState(MOCK_MARKS);
  const [showReportCard, setShowReportCard] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-700 via-blue-800 to-sky-900 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/15 text-sky-100 border border-white/20 px-3.5 py-1 rounded-full text-xs font-bold mb-3 shadow-xs">
            <Users className="w-4 h-4 text-sky-300" />
            <span>Parent & Guardian Portal • Welcome Juma Mkwawa</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Baraka Juma Mkwawa (Form II A)</h1>
          <p className="text-xs text-sky-100 font-medium mt-1">Admission Number: STD-2026-001 • Boarding Student • Haula International Secondary School</p>
        </div>

        <button
          onClick={() => setShowReportCard(true)}
          className="bg-white hover:bg-sky-50 text-sky-900 font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 border border-white"
        >
          <FileText className="w-4 h-4 text-sky-700" />
          <span>View Terminal Report Card</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance This Term</span>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">97.5%</p>
          <span className="text-xs text-emerald-600 font-bold mt-2 block">Present 39 out of 40 days</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Rank & Average</span>
            <div className="p-3 rounded-xl bg-sky-50 text-sky-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">Position 2 / 45</p>
          <span className="text-xs text-sky-700 font-bold mt-2 block">Average: 82.8% (Grade A)</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outstanding Fee Balance</span>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-600 mt-4">TZS 150,000</p>
          <span className="text-xs text-rose-600 font-bold mt-2 block">Due date: 15th Sept 2026</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-sky-100 flex justify-between items-center">
          <div>
            <h3 className="font-black text-slate-900 text-lg">Term II Terminal Exam Results</h3>
            <p className="text-xs text-slate-500">Officially published by Academic Master</p>
          </div>
          <button
            onClick={() => setShowReportCard(true)}
            className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report Card</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sky-50/60 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-sky-100">
                <th className="py-4 px-6">Subject</th>
                <th className="py-4 px-6">Score (100%)</th>
                <th className="py-4 px-6">Grade</th>
                <th className="py-4 px-6">Points</th>
                <th className="py-4 px-6">Subject Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100 text-xs font-semibold text-slate-700">
              {marks.map((item) => (
                <tr key={item.id} className="hover:bg-sky-50/40">
                  <td className="py-4 px-6 font-extrabold text-slate-900">{item.subject_name}</td>
                  <td className="py-4 px-6 font-black text-slate-900">{item.score}%</td>
                  <td className="py-4 px-6">
                    <span className="px-3.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-black text-xs">
                      Grade {item.grade}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold">{item.points}</td>
                  <td className="py-4 px-6 text-slate-600 italic font-medium">{item.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showReportCard && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-sky-100 max-h-[90vh] overflow-y-auto">
            <div className="text-center border-b border-sky-100 pb-6 mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">HAULA INTERNATIONAL SECONDARY SCHOOL</h2>
              <p className="text-xs text-slate-500">P.O. Box 4820, Kinondoni, Dar es Salaam • REG: S.4820/001</p>
              <div className="inline-block bg-sky-900 text-sky-200 px-6 py-1.5 rounded-full text-xs font-black mt-3">
                OFFICIAL STUDENT REPORT CARD • TERM II 2026
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-sky-50/60 p-4 rounded-2xl border border-sky-100 mb-6">
              <div>
                <p><span className="font-bold text-slate-500">Student Name:</span> <strong className="text-slate-900">Baraka Juma Mkwawa</strong></p>
                <p><span className="font-bold text-slate-500">Admission No:</span> <strong>STD-2026-001</strong></p>
              </div>
              <div>
                <p><span className="font-bold text-slate-500">Class & Stream:</span> <strong>Form II A</strong></p>
                <p><span className="font-bold text-slate-500">Class Rank:</span> <strong className="text-sky-700 font-black">Position 2 of 45</strong></p>
              </div>
            </div>

            <table className="w-full text-left text-xs border border-sky-200 mb-6">
              <thead>
                <tr className="bg-sky-100/70 text-slate-800 font-bold border-b border-sky-200">
                  <th className="p-3">Subject</th>
                  <th className="p-3 text-center">Score</th>
                  <th className="p-3 text-center">Grade</th>
                  <th className="p-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100">
                {marks.map((m) => (
                  <tr key={m.id}>
                    <td className="p-3 font-bold text-slate-900">{m.subject_name}</td>
                    <td className="p-3 text-center font-extrabold">{m.score}%</td>
                    <td className="p-3 text-center font-black">{m.grade}</td>
                    <td className="p-3 italic text-slate-600 font-medium">{m.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 space-y-2 text-xs mb-6">
              <p><strong className="text-slate-900">Class Teacher Remarks:</strong> Baraka is an exceptionally disciplined and bright student. Keep up the high standard!</p>
              <p><strong className="text-slate-900">Headmaster Remarks:</strong> Promoted to Form III with Division I Distinction.</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-sky-100">
              <button
                onClick={() => setShowReportCard(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};