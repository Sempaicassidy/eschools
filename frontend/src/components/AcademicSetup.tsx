import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BookOpen, CalendarDays, Layers3, Pencil, Trash2, Plus, Check, X, Sparkles } from 'lucide-react';

type AcademicYear = {
  id: number;
  name: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  terms?: Term[];
};

type Term = {
  id: number;
  academic_year_id: number;
  name: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
};

type ClassRoom = {
  id: number;
  name: string;
  level?: string;
  order?: number;
  streams?: Stream[];
};

type Stream = {
  id: number;
  class_room_id: number;
  name: string;
};

type Subject = {
  id: number;
  name: string;
  code?: string;
  department?: string;
  is_compulsory: boolean;
  is_active: boolean;
};

type SetupData = {
  academic_years: AcademicYear[];
  classes: ClassRoom[];
  subjects: Subject[];
};

export const AcademicSetup: React.FC = () => {
  const [setup, setSetup] = useState<SetupData>({ academic_years: [], classes: [], subjects: [] });
  const [activeTab, setActiveTab] = useState<'years' | 'classes' | 'subjects'>('years');
  const [notice, setNotice] = useState<string | null>(null);

  // Edit states
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [editingStream, setEditingStream] = useState<Stream | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const loadData = async () => {
    try {
      const { data } = await api.get('/admin/academic-setup');
      setSetup(data.data);
    } catch {
      setNotice('Unable to load academic configuration.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (endpoint: string, formData: Record<string, any>, formElement?: HTMLFormElement) => {
    try {
      await api.post(endpoint, formData);
      if (formElement) formElement.reset();
      setNotice('Record added successfully.');
      loadData();
    } catch (err: any) {
      setNotice(err.response?.data?.message || 'Error saving record.');
    }
  };

  const handleUpdate = async (endpoint: string, id: number, payload: Record<string, any>, closeEditModal: () => void) => {
    try {
      await api.put(`${endpoint}/${id}`, payload);
      setNotice('Updated successfully.');
      closeEditModal();
      loadData();
    } catch (err: any) {
      setNotice(err.response?.data?.message || 'Error updating record.');
    }
  };

  const handleDelete = async (endpoint: string, id: number, label: string) => {
    if (!window.confirm(`Are you sure you want to delete ${label}?`)) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      setNotice(`${label} deleted.`);
      loadData();
    } catch (err: any) {
      setNotice(err.response?.data?.message || 'Error deleting record.');
    }
  };

  const inputStyle = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium";

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-600" />
            <h2 className="text-xl font-black text-slate-900">Academic Structure & Setup</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">Configure and edit academic years, terms, classes, streams, and subjects.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl gap-1 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('years')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'years' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Years & Terms ({setup.academic_years.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'classes' ? 'bg-white text-indigo-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers3 className="w-4 h-4" />
            <span>Classes & Streams ({setup.classes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'subjects' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Subjects ({setup.subjects.length})</span>
          </button>
        </div>
      </div>

      {/* Notice Message */}
      {notice && (
        <div className="flex items-center justify-between bg-sky-50 border border-sky-200 text-sky-800 px-4 py-3 rounded-2xl text-xs font-bold">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-sky-600 hover:text-sky-900"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* TAB 1: ACADEMIC YEARS & TERMS */}
      {activeTab === 'years' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Add Year & Term Forms */}
          <div className="space-y-5 bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-600" /> Add Academic Year
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                handleCreate('/admin/academic-years', {
                  name: data.get('name'),
                  start_date: data.get('start_date') || null,
                  end_date: data.get('end_date') || null,
                  is_active: data.get('is_active') === '1',
                }, form);
              }}
              className="space-y-3"
            >
              <input className={inputStyle} name="name" placeholder="Year Name (e.g. Academic Year 2026)" required />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Start Date</label>
                  <input className={inputStyle} type="date" name="start_date" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">End Date</label>
                  <input className={inputStyle} type="date" name="end_date" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input type="checkbox" name="is_active" value="1" className="rounded text-sky-600 focus:ring-sky-500" />
                <span>Set as Active Academic Year</span>
              </label>
              <button className="w-full bg-sky-700 hover:bg-sky-800 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs">
                + Add Academic Year
              </button>
            </form>

            <hr className="border-slate-200" />

            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-600" /> Add Term to Year
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                handleCreate('/admin/terms', {
                  academic_year_id: Number(data.get('academic_year_id')),
                  name: data.get('name'),
                  start_date: data.get('start_date') || null,
                  end_date: data.get('end_date') || null,
                  is_active: data.get('is_active') === '1',
                }, form);
              }}
              className="space-y-3"
            >
              <select className={inputStyle} name="academic_year_id" required>
                <option value="">Choose Academic Year</option>
                {setup.academic_years.map((y) => (
                  <option key={y.id} value={y.id}>{y.name} {y.is_active ? '(Active)' : ''}</option>
                ))}
              </select>
              <input className={inputStyle} name="name" placeholder="Term Name (e.g. Term 1)" required />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Start Date</label>
                  <input className={inputStyle} type="date" name="start_date" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">End Date</label>
                  <input className={inputStyle} type="date" name="end_date" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input type="checkbox" name="is_active" value="1" className="rounded text-sky-600 focus:ring-sky-500" />
                <span>Set as Active Term</span>
              </label>
              <button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs">
                + Add Term
              </button>
            </form>
          </div>

          {/* List & Edit Existing Years & Terms */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900">Existing Academic Years & Terms</h3>
            {setup.academic_years.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No academic years added yet.</p>
            ) : (
              setup.academic_years.map((year) => (
                <div key={year.id} className="border border-slate-200 rounded-2xl p-4 bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{year.name}</span>
                      {year.is_active && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                          Active Year
                        </span>
                      )}
                      {(year.start_date || year.end_date) && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          ({year.start_date || 'N/A'} - {year.end_date || 'N/A'})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingYear(year)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-sky-700 hover:bg-sky-50 transition-all"
                        title="Edit Academic Year"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('/admin/academic-years', year.id, year.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        title="Delete Academic Year"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Terms List under Year */}
                  <div className="pl-3 space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Terms:</p>
                    {(!year.terms || year.terms.length === 0) ? (
                      <p className="text-xs text-slate-400 italic">No terms registered under this year.</p>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {year.terms.map((t) => (
                          <div key={t.id} className="flex items-center justify-between bg-slate-50 border border-slate-200/60 px-3 py-2 rounded-xl">
                            <div>
                              <p className="text-xs font-bold text-slate-800">{t.name}</p>
                              {t.is_active && <span className="text-[9px] font-extrabold text-emerald-600 uppercase">Active Term</span>}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingTerm(t)}
                                className="p-1 text-slate-400 hover:text-sky-600"
                                title="Edit Term"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete('/admin/terms', t.id, t.name)}
                                className="p-1 text-slate-400 hover:text-rose-600"
                                title="Delete Term"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CLASSES & STREAMS */}
      {activeTab === 'classes' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Add Class & Stream Forms */}
          <div className="space-y-5 bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" /> Add Class
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                handleCreate('/admin/classes', {
                  name: data.get('name'),
                  level: data.get('level') || 'Secondary',
                  order: Number(data.get('order')) || 1,
                }, form);
              }}
              className="space-y-3"
            >
              <input className={inputStyle} name="name" placeholder="Class Name (e.g. Form I / Class 1)" required />
              <input className={inputStyle} name="level" placeholder="Level (e.g. Primary, Secondary, High School)" />
              <input className={inputStyle} type="number" min="0" name="order" placeholder="Display Order (e.g. 1)" />
              <button className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs">
                + Add Class
              </button>
            </form>

            <hr className="border-slate-200" />

            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" /> Add Stream to Class
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                handleCreate('/admin/streams', {
                  class_room_id: Number(data.get('class_room_id')),
                  name: data.get('name'),
                }, form);
              }}
              className="space-y-3"
            >
              <select className={inputStyle} name="class_room_id" required>
                <option value="">Choose Class</option>
                {setup.classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.level || 'General'})</option>
                ))}
              </select>
              <input className={inputStyle} name="name" placeholder="Stream Name (e.g. Stream A / Science)" required />
              <button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs">
                + Add Stream
              </button>
            </form>
          </div>

          {/* List & Edit Existing Classes & Streams */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900">Configured Classes & Streams</h3>
            {setup.classes.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No classes added yet.</p>
            ) : (
              setup.classes.map((c) => (
                <div key={c.id} className="border border-slate-200 rounded-2xl p-4 bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{c.name}</span>
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {c.level || 'Secondary'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingClass(c)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 transition-all"
                        title="Edit Class"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('/admin/classes', c.id, c.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        title="Delete Class"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Streams under Class */}
                  <div className="pl-3 space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Streams:</p>
                    {(!c.streams || c.streams.length === 0) ? (
                      <p className="text-xs text-slate-400 italic">No streams created for this class.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {c.streams.map((s) => (
                          <div key={s.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800">
                            <span>{s.name}</span>
                            <button onClick={() => setEditingStream(s)} className="text-slate-400 hover:text-indigo-600"><Pencil className="w-3 h-3" /></button>
                            <button onClick={() => handleDelete('/admin/streams', s.id, s.name)} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SUBJECTS */}
      {activeTab === 'subjects' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Add Subject Form */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" /> Add Subject
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                handleCreate('/admin/subjects', {
                  name: data.get('name'),
                  code: data.get('code') || null,
                  department: data.get('department') || null,
                  is_compulsory: data.get('is_compulsory') === '1',
                }, form);
              }}
              className="space-y-3"
            >
              <input className={inputStyle} name="name" placeholder="Subject Name (e.g. Mathematics)" required />
              <input className={inputStyle} name="code" placeholder="Subject Code (e.g. MATH-01)" />
              <input className={inputStyle} name="department" placeholder="Department (e.g. Science)" />
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input type="checkbox" name="is_compulsory" value="1" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                <span>Compulsory Subject</span>
              </label>
              <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs">
                + Add Subject
              </button>
            </form>
          </div>

          {/* List & Edit Subjects */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900">Configured Subjects ({setup.subjects.length})</h3>
            {setup.subjects.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No subjects added yet.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {setup.subjects.map((sub) => (
                  <div key={sub.id} className="border border-slate-200 rounded-2xl p-3.5 bg-white shadow-xs flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900">{sub.name}</span>
                        {sub.code && <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-mono">{sub.code}</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400">{sub.department || 'General'}</span>
                        {sub.is_compulsory ? (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Compulsory</span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">Optional</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingSubject(sub)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
                        title="Edit Subject"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete('/admin/subjects', sub.id, sub.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT MODAL: ACADEMIC YEAR */}
      {editingYear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900">Edit Academic Year</h3>
              <button onClick={() => setEditingYear(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate('/admin/academic-years', editingYear.id, {
                  name: editingYear.name,
                  start_date: editingYear.start_date,
                  end_date: editingYear.end_date,
                  is_active: editingYear.is_active,
                }, () => setEditingYear(null));
              }}
              className="space-y-3"
            >
              <label className="block text-xs font-bold text-slate-700">
                Year Name
                <input
                  className={inputStyle}
                  value={editingYear.name}
                  onChange={(e) => setEditingYear({ ...editingYear, name: e.target.value })}
                  required
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block text-xs font-bold text-slate-700">
                  Start Date
                  <input
                    className={inputStyle}
                    type="date"
                    value={editingYear.start_date || ''}
                    onChange={(e) => setEditingYear({ ...editingYear, start_date: e.target.value })}
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  End Date
                  <input
                    className={inputStyle}
                    type="date"
                    value={editingYear.end_date || ''}
                    onChange={(e) => setEditingYear({ ...editingYear, end_date: e.target.value })}
                  />
                </label>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editingYear.is_active}
                  onChange={(e) => setEditingYear({ ...editingYear, is_active: e.target.checked })}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span>Active Year</span>
              </label>
              <div className="flex items-center gap-2 pt-2">
                <button type="button" onClick={() => setEditingYear(null)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-sky-800">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL: TERM */}
      {editingTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900">Edit Term</h3>
              <button onClick={() => setEditingTerm(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate('/admin/terms', editingTerm.id, {
                  name: editingTerm.name,
                  start_date: editingTerm.start_date,
                  end_date: editingTerm.end_date,
                  is_active: editingTerm.is_active,
                }, () => setEditingTerm(null));
              }}
              className="space-y-3"
            >
              <label className="block text-xs font-bold text-slate-700">
                Term Name
                <input
                  className={inputStyle}
                  value={editingTerm.name}
                  onChange={(e) => setEditingTerm({ ...editingTerm, name: e.target.value })}
                  required
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block text-xs font-bold text-slate-700">
                  Start Date
                  <input
                    className={inputStyle}
                    type="date"
                    value={editingTerm.start_date || ''}
                    onChange={(e) => setEditingTerm({ ...editingTerm, start_date: e.target.value })}
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700">
                  End Date
                  <input
                    className={inputStyle}
                    type="date"
                    value={editingTerm.end_date || ''}
                    onChange={(e) => setEditingTerm({ ...editingTerm, end_date: e.target.value })}
                  />
                </label>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editingTerm.is_active}
                  onChange={(e) => setEditingTerm({ ...editingTerm, is_active: e.target.checked })}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span>Active Term</span>
              </label>
              <div className="flex items-center gap-2 pt-2">
                <button type="button" onClick={() => setEditingTerm(null)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-slate-900">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL: CLASS */}
      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900">Edit Class</h3>
              <button onClick={() => setEditingClass(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate('/admin/classes', editingClass.id, {
                  name: editingClass.name,
                  level: editingClass.level,
                  order: editingClass.order,
                }, () => setEditingClass(null));
              }}
              className="space-y-3"
            >
              <label className="block text-xs font-bold text-slate-700">
                Class Name
                <input
                  className={inputStyle}
                  value={editingClass.name}
                  onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                  required
                />
              </label>
              <label className="block text-xs font-bold text-slate-700">
                Level
                <input
                  className={inputStyle}
                  value={editingClass.level || ''}
                  onChange={(e) => setEditingClass({ ...editingClass, level: e.target.value })}
                />
              </label>
              <label className="block text-xs font-bold text-slate-700">
                Display Order
                <input
                  className={inputStyle}
                  type="number"
                  value={editingClass.order ?? 0}
                  onChange={(e) => setEditingClass({ ...editingClass, order: Number(e.target.value) })}
                />
              </label>
              <div className="flex items-center gap-2 pt-2">
                <button type="button" onClick={() => setEditingClass(null)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-indigo-800">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL: STREAM */}
      {editingStream && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900">Edit Stream</h3>
              <button onClick={() => setEditingStream(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate('/admin/streams', editingStream.id, { name: editingStream.name }, () => setEditingStream(null));
              }}
              className="space-y-3"
            >
              <label className="block text-xs font-bold text-slate-700">
                Stream Name
                <input
                  className={inputStyle}
                  value={editingStream.name}
                  onChange={(e) => setEditingStream({ ...editingStream, name: e.target.value })}
                  required
                />
              </label>
              <div className="flex items-center gap-2 pt-2">
                <button type="button" onClick={() => setEditingStream(null)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-slate-900">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL: SUBJECT */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900">Edit Subject</h3>
              <button onClick={() => setEditingSubject(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate('/admin/subjects', editingSubject.id, {
                  name: editingSubject.name,
                  code: editingSubject.code,
                  department: editingSubject.department,
                  is_compulsory: editingSubject.is_compulsory,
                  is_active: editingSubject.is_active,
                }, () => setEditingSubject(null));
              }}
              className="space-y-3"
            >
              <label className="block text-xs font-bold text-slate-700">
                Subject Name
                <input
                  className={inputStyle}
                  value={editingSubject.name}
                  onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                  required
                />
              </label>
              <label className="block text-xs font-bold text-slate-700">
                Subject Code
                <input
                  className={inputStyle}
                  value={editingSubject.code || ''}
                  onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value })}
                />
              </label>
              <label className="block text-xs font-bold text-slate-700">
                Department
                <input
                  className={inputStyle}
                  value={editingSubject.department || ''}
                  onChange={(e) => setEditingSubject({ ...editingSubject, department: e.target.value })}
                />
              </label>
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSubject.is_compulsory}
                    onChange={(e) => setEditingSubject({ ...editingSubject, is_compulsory: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Compulsory Subject</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSubject.is_active}
                    onChange={(e) => setEditingSubject({ ...editingSubject, is_active: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Active Subject</span>
                </label>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button type="button" onClick={() => setEditingSubject(null)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-emerald-800">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
