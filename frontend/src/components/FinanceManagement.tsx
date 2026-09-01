import React, { useState, useMemo } from 'react';
import { MOCK_INVOICES, MOCK_PAYMENTS } from '../services/api';
import {
  CreditCard,
  Search,
  CheckCircle2,
  FileText,
  TrendingUp,
  AlertCircle,
  Send,
  FileSpreadsheet,
  Flag,
  ShieldCheck,
  Download
} from 'lucide-react';

export const FinanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payments' | 'invoices' | 'debtors'>('payments');
  const [searchTerm, setSearchTerm] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  // Filtered Payments Audit Log
  const filteredPayments = useMemo(() => {
    return MOCK_PAYMENTS.filter((p) => {
      const text = `${p.receipt_number} ${p.student_name} ${p.reference_number}`.toLowerCase();
      return text.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return MOCK_INVOICES.filter((inv) => {
      const text = `${inv.invoice_number} ${inv.student_name} ${inv.class_name}`.toLowerCase();
      return text.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  // Mock Debtors List for Support Actions
  const feeDebtors = [
    { id: 1, admission_number: 'STD-2026-003', student_name: 'David Emmanuel Nyerere', class: 'Form IV Science', guardian: 'Emmanuel Nyerere', phone: '+255 713 445 566', total_billed: 950000, paid: 630000, balance: 320000, status: 'Overdue' },
    { id: 2, admission_number: 'STD-2026-001', student_name: 'Baraka Juma Mkwawa', class: 'Form II Stream A', guardian: 'Juma Mkwawa', phone: '+255 754 889 900', total_billed: 850000, paid: 700000, balance: 150000, status: 'Partial' },
    { id: 3, admission_number: 'STD-2026-012', student_name: 'Kelvin Peter Masawe', class: 'Form III Arts', guardian: 'Peter Masawe', phone: '+255 767 112 244', total_billed: 850000, paid: 400000, balance: 450000, status: 'Overdue' },
  ];

  // Administrative Support: Send SMS Reminder to Debtor Guardian
  const handleSendDebtorSms = (phone: string, studentName: string) => {
    setNotice(`Official Fee Payment SMS Reminder sent to guardian of ${studentName} (${phone}).`);
    setTimeout(() => setNotice(null), 5000);
  };

  // Administrative Support: Broadcast SMS to All Debtors
  const handleBroadcastAllDebtorSms = () => {
    setNotice(`Broadcast SMS Fee Payment Reminder sent to all ${feeDebtors.length} fee-defaulting guardians.`);
    setTimeout(() => setNotice(null), 5000);
  };

  // Administrative Support: Flag Transaction for Bursar Audit
  const handleFlagTransaction = (receiptNo: string) => {
    setNotice(`Transaction ${receiptNo} flagged for Bursar verification audit support.`);
    setTimeout(() => setNotice(null), 5000);
  };

  // Administrative Support: Export Governance Financial Report
  const handleExportFinancialReport = () => {
    setNotice(`Official School Board Financial Revenue & Collection Audit Report generated.`);
    setTimeout(() => setNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-amber-600" /> Financial Oversight & Administrative Support Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            School Financial Records Oversight, Audit Logs & Bursar Support (Headmaster Administrative View)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportFinancialReport}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-xs"
          >
            <Download className="w-4 h-4" /> Export Governance Report
          </button>
          <button
            onClick={handleBroadcastAllDebtorSms}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-extrabold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-md shadow-amber-600/20 shrink-0"
          >
            <Send className="w-4 h-4" /> Broadcast Fee SMS Reminders
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

      {/* Administrative Operational Guidance Note */}
      <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl text-xs text-amber-950 font-medium leading-relaxed flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong>Administrative Governance Note:</strong> Direct fee collection receipts and accounting entries are strictly managed by the <strong>School Bursar / Accountant</strong>. The Headmaster and School Administration provide oversight, review audit trails, export board reports, and broadcast SMS payment reminders to support collection.
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Total Billed Fees</span>
            <FileText className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">TZS 722,500,000</p>
          <span className="text-[11px] text-slate-500 font-bold">2026 Academic Year Invoices</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Total Fees Collected</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-950">TZS 595,000,000</p>
          <span className="text-[11px] text-emerald-700 font-bold">82.3% Bank Collection Rate</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Outstanding Debt</span>
            <AlertCircle className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-950">TZS 127,500,000</p>
          <span className="text-[11px] text-rose-700 font-bold">45 Fee Debtors Pending</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">Bursar Reconciled</span>
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-950">100%</p>
          <span className="text-[11px] text-purple-700 font-bold">CRDB & NMB Direct Feeds</span>
        </div>
      </div>

      {/* Finance Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-5 py-3 font-extrabold text-xs rounded-t-xl transition-all ${
            activeTab === 'payments' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          1. Payment Receipts & Deposits Audit Log
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-5 py-3 font-extrabold text-xs rounded-t-xl transition-all ${
            activeTab === 'invoices' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          2. Prescribed Invoices & Billed Fees Ledger
        </button>
        <button
          onClick={() => setActiveTab('debtors')}
          className={`px-5 py-3 font-extrabold text-xs rounded-t-xl transition-all ${
            activeTab === 'debtors' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          3. Fee Debtors & Collection Support Log
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student name or Receipt No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* TAB 1: PAYMENTS AUDIT LOG */}
      {activeTab === 'payments' && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="border-b-2 border-slate-900 p-5 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-slate-900" /> Accountant Receipt & Bank Deposit Audit Log
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Read-Only Inspection Log of Financial Receipts Recorded by Bursar Office
              </p>
            </div>
            <span className="bg-slate-900 text-white font-mono font-bold px-3.5 py-1.5 rounded-xl text-xs">
              BURSAR AUDIT LOG
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-black text-[10px] uppercase border-b border-slate-900">
                  <th className="p-4 border-r border-slate-800">Receipt No</th>
                  <th className="p-4 border-r border-slate-800">Student Scholar Name</th>
                  <th className="p-4 border-r border-slate-800">Payment Channel</th>
                  <th className="p-4 border-r border-slate-800">Bank Control / Tx Ref</th>
                  <th className="p-4 text-center border-r border-slate-800">Payment Date</th>
                  <th className="p-4 text-right border-r border-slate-800">Amount Paid</th>
                  <th className="p-4 text-center">Bursar Support Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 border-r border-slate-200 font-mono font-black text-slate-900">
                      {p.receipt_number}
                    </td>

                    <td className="p-4 border-r border-slate-200 font-extrabold text-slate-900">
                      {p.student_name}
                    </td>

                    <td className="p-4 border-r border-slate-200 font-bold text-slate-800 uppercase">
                      {p.payment_method.replace('_', ' ')}
                    </td>

                    <td className="p-4 border-r border-slate-200 font-mono text-slate-700">
                      {p.reference_number}
                    </td>

                    <td className="p-4 text-center border-r border-slate-200 font-mono font-bold">
                      {p.payment_date}
                    </td>

                    <td className="p-4 text-right border-r border-slate-200 font-mono font-black text-emerald-800 text-sm">
                      TZS {Number(p.amount).toLocaleString()}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleFlagTransaction(p.receipt_number)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-extrabold text-[11px] transition-all flex items-center justify-center gap-1 mx-auto"
                        title="Flag for Accountant Verification"
                      >
                        <Flag className="w-3 h-3 text-amber-600" /> Flag Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INVOICES LEDGER */}
      {activeTab === 'invoices' && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="border-b-2 border-slate-900 p-5 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-900" /> Prescribed Student Invoices & Fee Structure Ledger
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Official Annual Prescribed Fees & Bursar Account Standings
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-black text-[10px] uppercase border-b border-slate-900">
                  <th className="p-4 border-r border-slate-800">Invoice No</th>
                  <th className="p-4 border-r border-slate-800">Student Scholar Name</th>
                  <th className="p-4 border-r border-slate-800">Class Form</th>
                  <th className="p-4 text-right border-r border-slate-800">Total Billed Fee</th>
                  <th className="p-4 text-right border-r border-slate-800">Paid to Date</th>
                  <th className="p-4 text-right border-r border-slate-800">Fee Balance</th>
                  <th className="p-4 text-center">Bursar Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 border-r border-slate-200 font-mono font-black text-slate-900">
                      {inv.invoice_number}
                    </td>

                    <td className="p-4 border-r border-slate-200 font-extrabold text-slate-900">
                      {inv.student_name}
                    </td>

                    <td className="p-4 border-r border-slate-200 font-bold text-slate-800">
                      {inv.class_name}
                    </td>

                    <td className="p-4 text-right border-r border-slate-200 font-mono font-bold text-slate-900">
                      TZS {Number(inv.total_amount).toLocaleString()}
                    </td>

                    <td className="p-4 text-right border-r border-slate-200 font-mono font-bold text-emerald-800">
                      TZS {Number(inv.paid_amount).toLocaleString()}
                    </td>

                    <td className="p-4 text-right border-r border-slate-200 font-mono font-black text-rose-700">
                      TZS {Number(inv.balance).toLocaleString()}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-black border ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                            : 'bg-amber-100 text-amber-950 border-amber-300'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DEBTORS & COLLECTION SUPPORT */}
      {activeTab === 'debtors' && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="border-b-2 border-slate-900 p-5 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" /> Outstanding Fee Debtors & Guardian Collection Support
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Administrative Collection Support: Broadcast Fee Debt Reminders to Guardians
              </p>
            </div>
            <span className="bg-rose-100 text-rose-950 border border-rose-300 font-bold px-3 py-1 rounded-lg text-xs font-mono">
              {feeDebtors.length} DEBTORS PENDING
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
                  <th className="p-4 text-right border-r border-slate-800">Billed Fee</th>
                  <th className="p-4 text-right border-r border-slate-800">Amount Paid</th>
                  <th className="p-4 text-right border-r border-slate-800">Fee Balance Due</th>
                  <th className="p-4 text-center">Administrative Support Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
                {feeDebtors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 border-r border-slate-200 font-mono font-black text-slate-900">
                      {d.admission_number}
                    </td>

                    <td className="p-4 border-r border-slate-200 font-extrabold text-slate-900">
                      {d.student_name}
                    </td>

                    <td className="p-4 border-r border-slate-200 font-bold">
                      {d.class}
                    </td>

                    <td className="p-4 border-r border-slate-200">
                      <p className="font-bold text-slate-900">{d.guardian}</p>
                      <p className="text-[10px] font-mono text-slate-500">{d.phone}</p>
                    </td>

                    <td className="p-4 text-right border-r border-slate-200 font-mono font-bold text-slate-900">
                      TZS {d.total_billed.toLocaleString()}
                    </td>

                    <td className="p-4 text-right border-r border-slate-200 font-mono font-bold text-emerald-800">
                      TZS {d.paid.toLocaleString()}
                    </td>

                    <td className="p-4 text-right border-r border-slate-200 font-mono font-black text-rose-700 text-sm">
                      TZS {d.balance.toLocaleString()}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleSendDebtorSms(d.phone, d.student_name)}
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
      )}
    </div>
  );
};
