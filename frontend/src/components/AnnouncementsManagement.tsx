import React, { useState } from 'react';
import { MOCK_ANNOUNCEMENTS } from '../services/api';
import {
  Bell,
  Plus,
  Send,
  CheckCircle2,
  Users,
  Calendar,
  X,
  Megaphone
} from 'lucide-react';

export const AnnouncementsManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [showModal, setShowModal] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [newNotice, setNewNotice] = useState({
    title: '',
    message: '',
    audience: 'All Parents & Students',
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.message) return;

    const created = {
      id: Date.now(),
      title: newNotice.title,
      message: newNotice.message,
      audience: newNotice.audience,
      created_at: new Date().toISOString().split('T')[0],
      author_name: 'School Administration',
    };

    setAnnouncements([created, ...announcements]);
    setShowModal(false);
    setNotice(`Announcement "${newNotice.title}" published successfully! SMS Broadcast sent to ${newNotice.audience}.`);
    setNewNotice({ title: '', message: '', audience: 'All Parents & Students' });
    setTimeout(() => setNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-sky-700" /> School Announcements & Official Circulars
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Broadcast Official Bulletins, Parent Notifications & Student Circulars
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-700 to-blue-700 hover:from-sky-800 hover:to-blue-800 text-white font-extrabold px-5 py-3 rounded-2xl text-xs transition-all shadow-md shadow-sky-700/20 shrink-0"
        >
          <Plus className="w-4 h-4" /> Publish New School Notice
        </button>
      </div>

      {/* Notice */}
      {notice && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-xs font-bold text-emerald-950 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{item.title}</h3>
                  <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200 inline-block mt-0.5">
                    Target: {item.audience}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Published on {item.created_at} by <strong>{item.author_name}</strong></span>
              </div>
            </div>

            <p className="text-xs font-medium text-slate-700 leading-relaxed pl-1">{item.message}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-black text-slate-900 text-base uppercase tracking-wider flex items-center gap-2">
                  <Plus className="w-5 h-5 text-sky-700" /> Publish School Announcement
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Broadcast new announcement to parents and students</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Announcement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Term II Terminal Examination Schedule"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Target Audience *</label>
                <select
                  value={newNotice.audience}
                  onChange={(e) => setNewNotice({ ...newNotice, audience: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                >
                  <option value="All Parents & Students">All Parents & Students</option>
                  <option value="Parents Only">Parents Only</option>
                  <option value="Students Only">Students Only</option>
                  <option value="Teachers & Staff Only">Teachers & Staff Only</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Notice Content Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter full notice text here..."
                  value={newNotice.message}
                  onChange={(e) => setNewNotice({ ...newNotice, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-xl font-extrabold flex items-center gap-2">
                  <Send className="w-3.5 h-3.5" /> Publish & Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
