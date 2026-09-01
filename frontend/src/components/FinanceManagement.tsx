import React, { useState } from 'react';
import { MOCK_INVOICES, MOCK_PAYMENTS } from '../services/api';
import {
  CreditCard,
  Search,
  Plus,
  Printer,
  CheckCircle2,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Building,
  Send,
  X
} from 'lucide-react';

export const FinanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payments' | 'invoices' | 'debtors'>('payments');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Form State for Recording Payment
  const [newPayment, setNewPayment] = useState({
    receipt_number: `REC-884${MOCK_PAYMENTS.length + 10}`,
    student_name: 'Baraka Juma Mkwawa',
    admission_number: 'STD-2026-001',
    amount: '350000',
    payment_method: 'mobile_money',
    reference_number: 'MPESA-TX99300',
    payment_date: new Date().toISOString().split('T')[0],
    description: 'Term II Boarding & Tuition Fee Deposit',
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(`Official Fee Payment Receipt ${newPayment.receipt_number} recorded successfully for ${newPayment.student_name}! Bank reconciliation complete.`);
    setShowPaymentModal(false);
    setTimeout(() => setNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-amber-600" /> School Fees, Financial Invoices & Payment Ledger
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            School Fees Management, Payment Receipts & Student Invoices (Bursar Accounting System)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-extrabold px-5 py-3 rounded-2xl text-xs transition-all shadow-md shadow-emerald-700/20 shrink-0"
          >
            <Plus className="w-4 h-4" /> Record New Payment Receipt
          </button>
        </div>
      </div>

      {/* Notice */}
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
          1. Payment Receipts Ledger
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-5 py-3 font-extrabold text-xs rounded-t-xl transition-all ${
            activeTab === 'invoices' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          2. Student Fee Invoices
        </button>
        <button
          onClick={() => setActiveTab('debtors')}
          className={`px-5 py-3 font-extrabold text-xs rounded-t-xl transition-all ${
            activeTab === 'debtors' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          3. Fee Debtors & SMS Reminders
        </button>
      </div>

      {/* Tab 1: Payment Receipts Ledger */}
      {activeTab === 'payments' && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="border-b-2 border-slate-900 p-5 bg-slate-50 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-900" /> Official Bursar Fee Payment Receipts Ledger
            </h3>
            <span className="bg-slate-900 text-white font-mono font-bold px-3 py-1 rounded-lg text-xs">
              TOTAL RECEIPTS: {MOCK_PAYMENTS.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-black text-[10px] uppercase border-b border-slate-900">
                  <th className="p-3.5 border-r border-slate-800">Receipt No</th>
                  <th className="p-3.5 border-r border-slate-800">Student Scholar Name</th>
                  <th className="p-3.5 border-r border-slate-800">Payment Method</th>
                  <th className="p-3.5 border-r border-slate-800">Bank Control / Tx Ref</th>
                  <th className="p-3.5 text-center border-r border-slate-800">Payment Date</th>
                  <th className="p-3.5 text-right border-r border-slate-800">Amount Paid</th>
                  <th className="p-3.5">Bursar Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
                {MOCK_PAYMENTS.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 border-r border-slate-200 font-mono font-black text-slate-900">
                      {p.receipt_number}
                    </td>
                    <td className="p-3.5 border-r border-slate-200 font-extrabold">{p.student_name}</td>
                    <td className="p-3.5 border-r border-slate-200 capitalize font-bold text-slate-700">{p.payment_method.replace('_', ' ')}</td>
                    <td className="p-3.5 border-r border-slate-200 font-mono font-bold text-slate-800">{p.reference_number}</td>
                    <td className="p-3.5 text-center border-r border-slate-200 font-mono">{p.payment_date}</td>
                    <td className="p-3.5 text-right border-r border-slate-200 font-mono font-black text-emerald-800 text-sm">
                      TZS {p.amount.toLocaleString()}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-800 text-[11px]">✓ Cleared & Reconciled</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Student Fee Invoices */}
      {activeTab === 'invoices' && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="border-b-2 border-slate-900 p-5 bg-slate-50 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-slate-900" /> Student Fee Invoices & Billing Breakdown
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-black text-[10px] uppercase border-b border-slate-900">
                  <th className="p-3.5 border-r border-slate-800">Invoice No</th>
                  <th className="p-3.5 border-r border-slate-800">Student Scholar Name</th>
                  <th className="p-3.5 border-r border-slate-800">Class Form</th>
                  <th className="p-3.5 text-right border-r border-slate-800">Total Billed</th>
                  <th className="p-3.5 text-right border-r border-slate-800">Paid Amount</th>
                  <th className="p-3.5 text-right border-r border-slate-800">Outstanding Balance</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
                {MOCK_INVOICES.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 border-r border-slate-200 font-mono font-black text-slate-900">{inv.invoice_number}</td>
                    <td className="p-3.5 border-r border-slate-200 font-extrabold">{inv.student_name}</td>
                    <td className="p-3.5 border-r border-slate-200 font-bold">{inv.class_name}</td>
                    <td className="p-3.5 text-right border-r border-slate-200 font-mono font-bold">TZS {inv.total_amount.toLocaleString()}</td>
                    <td className="p-3.5 text-right border-r border-slate-200 font-mono font-bold text-emerald-800">TZS {inv.paid_amount.toLocaleString()}</td>
                    <td className="p-3.5 text-right border-r border-slate-200 font-mono font-black text-rose-700">TZS {inv.balance.toLocaleString()}</td>
                    <td className="p-3.5 text-center font-bold">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-black border ${inv.status === 'paid' ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-amber-100 text-amber-950 border-amber-300'}`}>
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

      {/* Tab 3: Debtors & Reminders */}
      {activeTab === 'debtors' && (
        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl space-y-6 shadow-xs text-xs">
          <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-base uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" /> Fee Debtors & Automatic SMS Reminders
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Orodha ya Wanafunzi Wenye Salio la Ada na Tuma SMS kwa Wazazi</p>
            </div>
            <button
              onClick={() => alert('Broadcast SMS reminders sent to all 45 fee debtors guardians!')}
              className="bg-rose-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4" /> Broadcast Fee SMS Reminders
            </button>
          </div>

          <div className="border border-slate-900 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-black text-[10px] uppercase border-b border-slate-900">
                  <th className="p-3.5 border-r border-slate-800">ADM No</th>
                  <th className="p-3.5 border-r border-slate-800">Student Scholar Name</th>
                  <th className="p-3.5 border-r border-slate-800">Class Form</th>
                  <th className="p-3.5 border-r border-slate-800">Guardian Contact</th>
                  <th className="p-3.5 text-right border-r border-slate-800">Outstanding Fee Balance</th>
                  <th className="p-3.5 text-center">SMS Alert Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-900">
                <tr className="hover:bg-slate-50">
                  <td className="p-3.5 border-r border-slate-200 font-mono font-black">STD-2026-001</td>
                  <td className="p-3.5 border-r border-slate-200 font-extrabold">Baraka Juma Mkwawa</td>
                  <td className="p-3.5 border-r border-slate-200 font-bold">Form II Stream A</td>
                  <td className="p-3.5 border-r border-slate-200">Juma Mkwawa (+255 784 112 233)</td>
                  <td className="p-3.5 text-right border-r border-slate-200 font-mono font-black text-rose-700 text-sm">TZS 150,000</td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => alert('SMS Fee Reminder sent to Juma Mkwawa (+255 784 112 233)')}
                      className="px-3 py-1 bg-slate-900 text-white rounded-lg font-extrabold text-[11px]"
                    >
                      Send SMS Reminder
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-black text-slate-900 text-base uppercase tracking-wider flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-700" /> Record Fee Payment Receipt
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Ingiza Risiti Mpya ya Ada ya Mwanafunzi</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 text-slate-400 hover:text-slate-700 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Receipt Number *</label>
                <input
                  type="text"
                  required
                  value={newPayment.receipt_number}
                  onChange={(e) => setNewPayment({ ...newPayment, receipt_number: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Student Scholar *</label>
                <select
                  value={newPayment.student_name}
                  onChange={(e) => setNewPayment({ ...newPayment, student_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                >
                  <option value="Baraka Juma Mkwawa">Baraka Juma Mkwawa (STD-2026-001)</option>
                  <option value="David Emmanuel Nyerere">David Emmanuel Nyerere (STD-2026-003)</option>
                  <option value="Neema Grace Massawe">Neema Grace Massawe (STD-2026-004)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Amount Paid (TZS) *</label>
                  <input
                    type="number"
                    required
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Payment Method *</label>
                  <select
                    value={newPayment.payment_method}
                    onChange={(e) => setNewPayment({ ...newPayment, payment_method: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                  >
                    <option value="mobile_money">M-Pesa Mobile Money</option>
                    <option value="bank">CRDB Bank Deposit</option>
                    <option value="bank_nmb">NMB Bank Deposit</option>
                    <option value="cash">Cash Counter Receipt</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Bank Control / Tx Reference No *</label>
                <input
                  type="text"
                  required
                  value={newPayment.reference_number}
                  onChange={(e) => setNewPayment({ ...newPayment, reference_number: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold font-mono text-slate-900"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-800 text-white rounded-xl font-extrabold">Confirm & Issue Receipt</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
