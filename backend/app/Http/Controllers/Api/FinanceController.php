<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use App\Services\FinanceService;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    public function recordPayment(Request $request, FinanceService $financeService)
    {
        $data = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
            'invoice_id' => ['nullable', 'exists:invoices,id'],
            'receipt_number' => ['required', 'string', 'max:100'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', 'in:cash,bank,mobile_money,card,cheque,online'],
            'reference_number' => ['nullable', 'string'],
            'payment_date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
        ]);

        $data['school_id'] = $request->user()->school_id;
        $data['received_by'] = $request->user()->id;

        $payment = $financeService->recordPayment($data);

        return response()->json([
            'success' => true,
            'message' => 'Payment recorded successfully',
            'data' => $payment->load(['student', 'invoice']),
        ], 201);
    }

    public function invoices(Request $request)
    {
        $invoices = Invoice::query()
            ->with(['student'])
            ->latest()
            ->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => $invoices,
        ]);
    }
}
