import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  Truck,
  Plus,
  CheckCircle2,
  DollarSign,
  Calendar,
  Lock,
  ArrowRight,
  CreditCard,
  Building2,
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import { Modal } from '../common/Modal';

export const PaymentsWages = () => {
  const {
    weaverWages,
    weaverWorkers,
    weaverSupplierPayments,
    suppliers,
    recordWorkerWage,
    updateWageStatus,
    recordSupplierPayment,
  } = useApp();

  const [activeTab, setActiveTab] = useState('wages'); // 'wages' | 'supplier_payments'
  const [activeModal, setActiveModal] = useState(null); // 'calc_wage' | 'pay_supplier' | null
  const [successMessage, setSuccessMessage] = useState('');

  // Wage Form
  const [wageForm, setWageForm] = useState({
    workerId: '',
    period: 'Nov 1 - Nov 24, 2026',
    unitsApproved: '3',
    advancesDeducted: '1000',
    welfareDeduction: '100',
    workOrderNumber: 'WO-KPM-2026-081',
  });

  // Supplier Payment Form
  const [supplierPayForm, setSupplierPayForm] = useState({
    supplierId: '',
    invoiceReference: '',
    amountPaid: '',
    paymentMode: 'RTGS / Bank Transfer',
    referenceNumber: '',
    notes: '',
  });

  const handleCalculateWageSubmit = (e) => {
    e.preventDefault();
    recordWorkerWage(wageForm);
    setActiveModal(null);
    setSuccessMessage('Worker wage calculated and added to approval queue!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSupplierPaySubmit = (e) => {
    e.preventDefault();
    recordSupplierPayment(supplierPayForm);
    setActiveModal(null);
    setSuccessMessage('Supplier payment recorded and ledger updated!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleApproveWage = (wageId) => {
    updateWageStatus(wageId, 'approved');
  };

  const handlePayWage = (wageId) => {
    updateWageStatus(wageId, 'paid', 'Cash Voucher / Bank UPI', `TXN-${Date.now().toString().slice(-6)}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            Payments & Worker Wage Ledger
          </h1>
          <p className="text-xs text-slate-500">
            Automated wage computation from approved production, advances deduction, and supplier remittance records
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'wages' ? (
            <button
              onClick={() => setActiveModal('calc_wage')}
              className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Calculate Worker Wage</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveModal('pay_supplier')}
              className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Record Supplier Payment</span>
            </button>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('wages')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'wages'
              ? 'border-amber-900 text-amber-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Artisan & Worker Wages ({weaverWages.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('supplier_payments')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'supplier_payments'
              ? 'border-amber-900 text-amber-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Supplier Payments & Receipts ({weaverSupplierPayments.length})</span>
        </button>
      </div>

      {/* Tab 1: Artisan & Worker Wages */}
      {activeTab === 'wages' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              Wage Approval Workflow: Calculated → Approved (Protected) → Paid
            </span>
            <span className="text-[11px] text-slate-400">
              Advances & Welfare auto-deducted
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b">
                <tr>
                  <th className="px-4 py-3">Artisan</th>
                  <th className="px-4 py-3">Wage Model</th>
                  <th className="px-4 py-3">Period & Ref</th>
                  <th className="px-4 py-3">Units Approved</th>
                  <th className="px-4 py-3">Gross Wage</th>
                  <th className="px-4 py-3">Advances / Ded.</th>
                  <th className="px-4 py-3">Net Payable</th>
                  <th className="px-4 py-3">Approval Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {weaverWages.map((wg) => {
                  const isCalculated = wg.status === 'calculated';
                  const isApproved = wg.status === 'approved';
                  const isPaid = wg.status === 'paid';

                  return (
                    <tr key={wg.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 block">{wg.workerName}</span>
                      </td>
                      <td className="px-4 py-3 capitalize text-slate-600">
                        {wg.wageType.replace('_', ' ')} ({formatCurrency(wg.ratePerUnit)})
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-800 block">{wg.period}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{wg.workOrderNumber}</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800">
                        {wg.unitsApproved} {wg.wageType === 'per_piece' ? 'sarees' : wg.wageType === 'per_meter' ? 'meters' : 'days'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {formatCurrency(wg.grossWage)}
                      </td>
                      <td className="px-4 py-3 text-rose-600 font-mono">
                        -{formatCurrency((wg.advancesDeducted || 0) + (wg.welfareDeduction || 0))}
                      </td>
                      <td className="px-4 py-3 font-extrabold text-slate-900 text-sm font-serif">
                        {formatCurrency(wg.netPayable)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${getStatusBadgeClass(wg.status)}`}>
                          {wg.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isCalculated && (
                          <button
                            onClick={() => handleApproveWage(wg.id)}
                            className="px-2.5 py-1 bg-amber-900 hover:bg-amber-950 text-white font-bold rounded-lg text-[11px]"
                          >
                            Approve
                          </button>
                        )}
                        {isApproved && (
                          <button
                            onClick={() => handlePayWage(wg.id)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-[11px]"
                          >
                            Disburse
                          </button>
                        )}
                        {isPaid && (
                          <span className="text-emerald-700 font-semibold text-[11px] flex items-center justify-end gap-1">
                            <Lock className="w-3 h-3 text-slate-400" /> Paid {formatDate(wg.paymentDate)}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Supplier Payments */}
      {activeTab === 'supplier_payments' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              Supplier Settlement History (Raw Material Silk & Zari Purchases)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Supplier Name</th>
                  <th className="px-4 py-3">Invoice Ref</th>
                  <th className="px-4 py-3">Amount Settled</th>
                  <th className="px-4 py-3">Payment Mode</th>
                  <th className="px-4 py-3">Reference / UTR #</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {weaverSupplierPayments.map((sp) => (
                  <tr key={sp.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono text-slate-500">{formatDate(sp.paymentDate)}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{sp.supplierName}</td>
                    <td className="px-4 py-3 font-mono text-amber-900 font-semibold">{sp.invoiceReference}</td>
                    <td className="px-4 py-3 font-extrabold text-emerald-700 text-sm font-serif">
                      {formatCurrency(sp.amountPaid)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{sp.paymentMode}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{sp.referenceNumber || '-'}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{sp.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Calculate Worker Wage Modal */}
      <Modal
        isOpen={activeModal === 'calc_wage'}
        onClose={() => setActiveModal(null)}
        title="Compute Artisan Wage Disbursement"
        subtitle="Calculates wages based on completed sarees, woven meters or work days with advance deductions"
      >
        <form onSubmit={handleCalculateWageSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Artisan *</label>
            <select
              value={wageForm.workerId}
              onChange={(e) => setWageForm({ ...wageForm, workerId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
              required
            >
              <option value="">-- Choose Artisan --</option>
              {weaverWorkers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.role}) - Rate: ₹{w.wageRate} / {w.wageType.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pay Period *</label>
              <input
                type="text"
                value={wageForm.period}
                onChange={(e) => setWageForm({ ...wageForm, period: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Units Completed / Approved *</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 2 pieces or 24 days"
                value={wageForm.unitsApproved}
                onChange={(e) => setWageForm({ ...wageForm, unitsApproved: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Advances to Deduct (₹)</label>
              <input
                type="number"
                value={wageForm.advancesDeducted}
                onChange={(e) => setWageForm({ ...wageForm, advancesDeducted: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Welfare / Co-op Fund (₹)</label>
              <input
                type="number"
                value={wageForm.welfareDeduction}
                onChange={(e) => setWageForm({ ...wageForm, welfareDeduction: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Work Order Reference</label>
            <input
              type="text"
              value={wageForm.workOrderNumber}
              onChange={(e) => setWageForm({ ...wageForm, workOrderNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-900 text-white font-bold hover:bg-amber-950"
            >
              Calculate & Queue
            </button>
          </div>
        </form>
      </Modal>

      {/* Record Supplier Payment Modal */}
      <Modal
        isOpen={activeModal === 'pay_supplier'}
        onClose={() => setActiveModal(null)}
        title="Record Supplier Settlement"
        subtitle="Log RTGS, NEFT, or UPI remittance against supplier raw material invoice"
      >
        <form onSubmit={handleSupplierPaySubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Supplier *</label>
            <select
              value={supplierPayForm.supplierId}
              onChange={(e) => setSupplierPayForm({ ...supplierPayForm, supplierId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
              required
            >
              <option value="">-- Choose Supplier --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Balance Due: ₹{s.balanceDue})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Supplier Invoice Reference *</label>
              <input
                type="text"
                placeholder="e.g. SLM-2026-881"
                value={supplierPayForm.invoiceReference}
                onChange={(e) => setSupplierPayForm({ ...supplierPayForm, invoiceReference: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Amount Paid (₹) *</label>
              <input
                type="number"
                placeholder="e.g. 24500"
                value={supplierPayForm.amountPaid}
                onChange={(e) => setSupplierPayForm({ ...supplierPayForm, amountPaid: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Payment Mode *</label>
              <select
                value={supplierPayForm.paymentMode}
                onChange={(e) => setSupplierPayForm({ ...supplierPayForm, paymentMode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              >
                <option value="RTGS / Bank Transfer">RTGS / Bank Transfer</option>
                <option value="UPI Instant Transfer">UPI Instant Transfer</option>
                <option value="Cheque Deposit">Cheque Deposit</option>
                <option value="Cash Voucher">Cash Voucher</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bank Reference / UTR #</label>
              <input
                type="text"
                placeholder="e.g. UTR-IOBA-99210"
                value={supplierPayForm.referenceNumber}
                onChange={(e) => setSupplierPayForm({ ...supplierPayForm, referenceNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Remittance Notes</label>
            <textarea
              placeholder="Full settlement for November silk yarn consignment..."
              value={supplierPayForm.notes}
              onChange={(e) => setSupplierPayForm({ ...supplierPayForm, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 h-20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-900 text-white font-bold hover:bg-amber-950"
            >
              Confirm Settlement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
