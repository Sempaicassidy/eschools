import React, { useState, useMemo } from 'react';
import { MOCK_STUDENTS } from '../services/api';
import {
  Award,
  BookOpen,
  Search,
  Printer,
  CheckCircle2,
  FileSpreadsheet,
  Building,
  TrendingUp,
  Filter,
  Save
} from 'lucide-react';

export const ExamsManagement: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('Form II');
  const [examType, setExamType] = useState<'internal' | 'necta_national'>('necta_national');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [searchTerm, setSearchTerm] = useState('');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Class & Exam Type Change
  const isNectaClass = selectedClass === 'Form II' || selectedClass === 'Form IV';

  // NECTA Subject Grades Table
  const nectaResults = [
    { id: 1, index_no: 'S.4820/0012/2025', name: 'Baraka Juma Mkwawa', phy: 'A', chem: 'B', bio: 'A', math: 'A', kisw: 'A', eng: 'A', geo: 'B', hist: 'A', points: 8, div: 'Division I', rank: 'Center Rank #1' },
    { id: 2, index_no: 'S.4820/0014/2025', name: 'Aisha Hassan Rashid', phy: 'A', chem: 'A', bio: 'A', math: 'B', kisw: 'A', eng: 'A', geo: 'A', hist: 'A', points: 9, div: 'Division I', rank: 'Center Rank #2' },
    { id: 3, index_no: 'S.4820/0022/2025', name: 'David Emmanuel Nyerere', phy: 'B', chem: 'B', bio: 'B', math: 'C', kisw: 'A', eng: 'B', geo: 'B', hist: 'B', points: 14, div: 'Division I', rank: 'Center Rank #5' },
    { id: 4, index_no: 'S.4820/0031/2025', name: 'Neema Grace Massawe', phy: 'B', chem: 'C', bio: 'B', math: 'C', kisw: 'B', eng: 'B', geo: 'C', hist: 'B', points: 17, div: 'Division II', rank: 'Center Rank #9' },
  ];

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveNotice(`Exam Marks & NECTA Broadsheet for ${selectedClass} (${selectedYear}) successfully locked and processed!`);
    setTimeout(() => setSaveNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-sky-700" /> Examinations & NECTA Results Processing Register
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Usimamizi wa Mitihani ya Ndani na Matokeo Rasmi ya Serikali (NECTA Broadsheet)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-4 h-4" /> Print Official Broadsheet
          </button>
          <button
            onClick={handleSaveMarks}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-700 to-blue-700 hover:from-sky-800 hover:to-blue-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-sky-700/20 shrink-0"
          >
            <Save className="w-4 h-4" /> Save Broadsheet
          </button>
        </div>
      </div>

      {/* Save Success Notice */}
      {saveNotice && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-xs font-bold text-emerald-950 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">NECTA Division I Rate</span>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-950">75.0%</p>
          <span className="text-[11px] text-emerald-700 font-bold">Center Division I Distinction</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Center Mean Score</span>
            <TrendingUp className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-3xl font-black text-sky-950">82.7%</p>
          <span className="text-[11px] text-sky-700 font-bold">Grade A Average</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Candidates Registered</span>
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-indigo-950">45</p>
          <span className="text-[11px] text-indigo-700 font-bold">FTNA Candidates Enrolled</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">National Pass Rate</span>
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-purple-950">100%</p>
          <span className="text-[11px] text-purple-700 font-bold">100% Passed (Div I - Div IV)</span>
        </div>
      </div>

      {/* Selector Control Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-500" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="Form I">Form I (Internal Assessment)</option>
              <option value="Form II">Form II (FTNA National Exam)</option>
              <option value="Form III">Form III (Internal Assessment)</option>
              <option value="Form IV">Form IV (CSEE National Exam)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          {isNectaClass && (
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setExamType('necta_national')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  examType === 'necta_national' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Government NECTA Statement
              </button>
              <button
                onClick={() => setExamType('internal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  examType === 'internal' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Internal Continuous Assessment
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Index No or candidate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Official NECTA Statement / Results Broadsheet Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="border-b-2 border-slate-900 p-5 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-slate-900" />
              {examType === 'necta_national' && isNectaClass
                ? `OFFICIAL NATIONAL EXAMINATIONS COUNCIL OF TANZANIA (NECTA) BROADSHEET - ${selectedClass} (${selectedYear})`
                : `OFFICIAL INTERNAL SCHOOL CONTINUOUS ASSESSMENT BROADSHEET - ${selectedClass} (${selectedYear})`}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Center Number: <code className="font-mono font-bold text-slate-900">S.4820</code> - HAULA SECONDARY SCHOOL
            </p>
          </div>
          <span className="bg-slate-900 text-white font-mono font-bold px-3 py-1.5 rounded-xl text-xs self-start md:self-auto">
            CENTER REG: S.4820/{selectedYear}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-black text-[10px] uppercase border-b border-slate-900">
                <th className="p-3.5 border-r border-slate-800">Candidate Index No</th>
                <th className="p-3.5 border-r border-slate-800">Candidate Full Name</th>
                <th className="p-3.5 text-center border-r border-slate-800">Phy</th>
                <th className="p-3.5 text-center border-r border-slate-800">Chem</th>
                <th className="p-3.5 text-center border-r border-slate-800">Bio</th>
                <th className="p-3.5 text-center border-r border-slate-800">Math</th>
                <th className="p-3.5 text-center border-r border-slate-800">Kisw</th>
                <th className="p-3.5 text-center border-r border-slate-800">Eng</th>
                <th className="p-3.5 text-center border-r border-slate-800">Geo</th>
                <th className="p-3.5 text-center border-r border-slate-800">Hist</th>
                <th className="p-3.5 text-center border-r border-slate-800">Points</th>
                <th className="p-3.5 text-center border-r border-slate-800">Division</th>
                <th className="p-3.5 text-center">Center Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
              {nectaResults.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 border-r border-slate-200 font-mono font-black text-slate-900">
                    {r.index_no}
                  </td>
                  <td className="p-3.5 border-r border-slate-200 font-extrabold">{r.name}</td>
                  <td className="p-3.5 text-center border-r border-slate-200 font-mono font-black text-emerald-800">{r.phy}</td>
                  <td className="p-3.5 text-center border-r border-slate-200 font-mono font-black text-emerald-800">{r.chem}</td>
                  <td className="p-3.5 text-center border-r border-slate-200 font-mono font-black text-emerald-800">{r.bio}</td>
                  <td className="p-3.5 text-center border-r border-slate-200 font-mono font-black text-emerald-800">{r.math}</td>
                  <td className="p-3.5 text-center border-r border-slate-200 font-mono font-black text-emerald-800">{r.kisw}</td>
                  <td className="p-3.5 text-center border-r border-slate-200 font-mono font-black text-emerald-800">{r.eng}</td>
                  <td className="p-3.5 text-center border-r border-slate-200 font-mono font-black text-emerald-800">{r.geo}</td>
                  <td className="p-3.5 text-center border-r border-slate-200 font-mono font-black text-emerald-800">{r.hist}</td>
                  <td className="p-3.5 text-center border-r border-slate-200 font-mono font-black text-slate-900">{r.points} Pts</td>
                  <td className="p-3.5 text-center border-r border-slate-200 font-black">
                    <span className="bg-emerald-100 text-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-300 font-black text-[11px]">
                      {r.div}
                    </span>
                  </td>
                  <td className="p-3.5 text-center font-bold text-sky-900">{r.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
