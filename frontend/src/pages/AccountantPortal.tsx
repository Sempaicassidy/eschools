import React, { useState } from 'react';
import { MOCK_INVOICES, MOCK_PAYMENTS } from '../services/api';
import { CreditCard, Plus, Printer, TrendingUp } from 'lucide-react';

export const AccountantPortal: React.FC = () => {
  const [invoices] = useState(MOCK_INVOICES);
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [showModal, setShowModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState<any>(null);
  const [studentName, setStudentName] = useState('Baraka Juma Mkwawa');
  const [amount, setAmount] = useState('150000');
  const [payMethod, setPayMethod] = useState<'cash' | 'bank' | 'mobile_money' | 'card'>('mobile_money');
  const [refNo, setRefNo] = useState('MPESA-TX99300');

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newPayment = {
      id: payments.length + 1,
      receipt_number: `REC-${Math.floor(88400 + Math.random() * 1000)}`,
      student_name: studentName,
      amount: Number(amount),
      payment_method: payMethod,
      reference_number: refNo,
      payment_date: new Date().toISOString().split('T')[0],
    };

    setPayments([newPayment, ...payments]);
    setShowModal(false);
    setShowReceipt(newPayment);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-700 via-blue-800 to-sky-900 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/15 text-sky-100 border border-white/20 px-3.5 py-1 rounded-full text-xs font-bold mb-3 shadow-xs">
            <CreditCard className="w-4 h-4 text-sky-300" />
            <span>Accountant / Bursar Office</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Fees & Financial Management</h1>
          <p className="text-xs text-sky-100 font-medium mt-1">Record payments, manage student invoices, track fee debtors, and issue official receipts.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-white hover:bg-sky-50 text-sky-900 font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 border border-white"
        >
          <Plus className="w-4 h-4 text-sky-700" />
          <span>Record New Fee Payment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expected Term II Fees</span>
          <p className="text-3xl font-black text-slate-900 mt-3">TZS 722.5M</p>
          <span className="text-xs text-slate-500 font-medium mt-2 block">850 active students</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Fees Collected</span>
          <p className="text-3xl font-black text-emerald-600 mt-3">TZS 595.3M</p>
          <span className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            82.4% collection rate
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outstanding Balance (Debtors)</span>
          <p className="text-3xl font-black text-rose-600 mt-3">TZS 127.1M</p>
          <span className="text-xs text-rose-600 font-bold mt-2 block">152 pending invoices</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payments Today</span>
          <p className="text-3xl font-black text-slate-900 mt-3">TZS 4.2M</p>
          <span className="text-xs text-slate-500 font-medium mt-2 block">12 transaction receipts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-sky-100 flex justify-between items-center">
            <h3 className="font-black text-slate-900 text-lg">Student Fee Invoices</h3>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">Term II 2026</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sky-50/60 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-sky-100">
                  <th className="py-4 px-6">Invoice #</th>
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6">Balance</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 text-xs font-semibold text-slate-700">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-sky-50/40">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">{inv.invoice_number}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{inv.student_name}</td>
                    <td className="py-4 px-6">TZS {inv.total_amount.toLocaleString()}</td>
                    <td className="py-4 px-6 font-black text-rose-600">TZS {inv.balance.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                        inv.status === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-sky-100 flex justify-between items-center">
            <h3 className="font-black text-slate-900 text-lg">Recent Payment Receipts</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Audit-Logged</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sky-50/60 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-sky-100">
                  <th className="py-4 px-6">Receipt #</th>
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Method</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 text-xs font-semibold text-slate-700">
                {payments.map((pmt) => (
                  <tr key={pmt.id} className="hover:bg-sky-50/40">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">{pmt.receipt_number}</td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{pmt.student_name}</td>
                    <td className="py-4 px-6 font-black text-emerald-600">TZS {pmt.amount.toLocaleString()}</td>
                    <td className="py-4 px-6 uppercase text-[10px] font-extrabold text-slate-500">{pmt.payment_method.replace('_', ' ')}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setShowReceipt(pmt)}
                        className="text-xs font-bold text-sky-600 hover:underline flex items-center justify-end gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-sky-100">
            <h3 className="text-xl font-black text-slate-900 mb-1">Record Fee Payment</h3>
            <p className="text-xs text-slate-500 mb-6">Updates student balance & generates official receipt.</p>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student</label>
                <select
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-sky-50/50 border border-sky-200 text-slate-800 text-xs px-4 py-3 rounded-xl font-bold"
                >
                  <option>Baraka Juma Mkwawa (STD-2026-001)</option>
                  <option>David Emmanuel Nyerere (STD-2026-003)</option>
                  <option>Neema Grace Massawe (STD-2026-004)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount Paid (TZS)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-sky-50/50 border border-sky-200 text-slate-900 font-black text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-sky-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full bg-sky-50/50 border border-sky-200 text-slate-800 text-xs px-3 py-3 rounded-xl font-bold"
                  >
                    <option value="mobile_money">Mobile Money (M-Pesa/Tigo)</option>
                    <option value="bank">Bank Deposit</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ref / Trans Number</label>
                  <input
                    type="text"
                    value={refNo}
                    onChange={(e) => setRefNo(e.target.value)}
                    className="w-full bg-sky-50/50 border border-sky-200 text-slate-800 text-xs px-3 py-3 rounded-xl font-semibold"
                  />
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
                  Issue Receipt & Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReceipt && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-sky-100">
            <div className="text-center border-b border-sky-100 pb-6 mb-6">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">HAULA INTERNATIONAL SECONDARY SCHOOL</h2>
              <p className="text-xs text-slate-500">P.O. Box 4820, Kinondoni, Dar es Salaam • Tel: +255 754 123 456</p>
              <div className="inline-block bg-sky-900 text-sky-200 px-4 py-1.5 rounded-full text-xs font-extrabold mt-3">
                OFFICIAL PAYMENT RECEIPT
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700 mb-6">
              <div className="flex justify-between border-b border-sky-50 pb-2">
                <span className="font-bold text-slate-500">Receipt Number:</span>
                <span className="font-mono font-bold text-slate-900">{showReceipt.receipt_number}</span>
              </div>
              <div className="flex justify-between border-b border-sky-50 pb-2">
                <span className="font-bold text-slate-500">Date Issued:</span>
                <span>{showReceipt.payment_date}</span>
              </div>
              <div className="flex justify-between border-b border-sky-50 pb-2">
                <span className="font-bold text-slate-500">Student Name:</span>
                <span className="font-extrabold text-slate-900">{showReceipt.student_name}</span>
              </div>
              <div className="flex justify-between border-b border-sky-50 pb-2">
                <span className="font-bold text-slate-500">Payment Method:</span>
                <span className="uppercase font-bold">{showReceipt.payment_method.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between border-b border-sky-50 pb-2">
                <span className="font-bold text-slate-500">Transaction Reference:</span>
                <span className="font-mono">{showReceipt.reference_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-black text-slate-900">
                <span>Amount Paid:</span>
                <span className="text-emerald-600">TZS {showReceipt.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-sky-100">
              <span className="text-[10px] text-slate-400">Issued by: Francis Kibona (Bursar)</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReceipt(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-sky-900 hover:bg-sky-800 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};