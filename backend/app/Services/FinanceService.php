<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class FinanceService
{
    public function recordPayment(array $data): Payment
    {
        return DB::transaction(function () use ($data) {
            $payment = Payment::create($data);

            if (!empty($data['invoice_id'])) {
                $invoice = Invoice::findOrFail($data['invoice_id']);

                $paidAmount = $invoice->payments()
                    ->where('status', 'valid')
                    ->sum('amount');

                $balance = max($invoice->total_amount - $paidAmount, 0);

                $invoice->update([
                    'paid_amount' => $paidAmount,
                    'balance' => $balance,
                    'status' => $balance <= 0
                        ? 'paid'
                        : ($paidAmount > 0 ? 'partial' : 'unpaid'),
                ]);
            }

            return $payment;
        });
    }
}
