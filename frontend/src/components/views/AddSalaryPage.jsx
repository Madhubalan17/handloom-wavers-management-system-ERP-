import React, { useState } from 'react';
import {
  ArrowLeft,
  Wallet,
  User,
  Calendar,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Save,
  Tag,
  Receipt,
  FileText,
  BadgeCheck,
  Coins,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../../utils/formatters';

export const sampleSalaryPresets = [
  {
    label: 'Standard Monthly Output Wage (Nov 2026)',
    month: 'Nov 2026',
    meters: 120,
    ratePerMeter: 65,
    incentive: 700,
    deductions: 500,
    paymentMethod: 'Direct Bank Transfer (NEFT)',
    remarks: 'Disbursed for 120m of Grade A silk saree output verified by cluster supervisor.',
  },
  {
    label: 'Festival Pongal Bonus & High Output Wage',
    month: 'Nov 2026',
    meters: 160,
    ratePerMeter: 65,
    incentive: 2500,
    deductions: 0,
    paymentMethod: 'Direct Bank Transfer (NEFT)',
    remarks: 'Includes Pongal festival productivity bonus for exceeding 150-meter threshold.',
  },
  {
    label: 'Fast-Track Handloom Piece-Rate Advance',
    month: 'Nov 2026',
    meters: 90,
    ratePerMeter: 65,
    incentive: 400,
    deductions: 250,
    paymentMethod: 'UPI Direct Transfer',
    remarks: 'Mid-month settlement for finished yardage delivered to central warehouse.',
  },
];

export const AddSalaryPage = ({
  onBack,
  onSaveSalary,
  salaryToEdit = null,
  weaversList = [],
}) => {
  const isEditing = Boolean(salaryToEdit);

  // Selected weaver
  const defaultWeaver = weaversList.find((w) => w.name === salaryToEdit?.weaverName) || weaversList[0] || {
    name: 'R. Selvi',
    bankName: 'State Bank of India',
    bankAccount: '30495810294',
    ifscCode: 'SBIN0001248',
    village: 'Nallapatti',
  };

  // Form State
  const [formData, setFormData] = useState({
    weaverName: salaryToEdit?.weaverName || salaryToEdit?.weaver_name || defaultWeaver.name,
    month: salaryToEdit?.month || 'Nov 2026',
    paymentDate: salaryToEdit?.paymentDate || salaryToEdit?.payment_date || '2026-11-24',
    metersProduced: salaryToEdit?.metersProduced || 120,
    ratePerMeter: salaryToEdit?.ratePerMeter || 65,
    incentiveAmount: salaryToEdit?.incentiveAmount || 700,
    deductions: salaryToEdit?.deductions || 500,
    status: salaryToEdit?.status || 'Paid',
    paymentMethod: salaryToEdit?.paymentMethod || 'Direct Bank Transfer (NEFT)',
    bankName: salaryToEdit?.bankName || defaultWeaver.bankName || 'State Bank of India',
    bankAccount: salaryToEdit?.bankAccount || defaultWeaver.bankAccount || '30495810294',
    ifscCode: salaryToEdit?.ifscCode || defaultWeaver.ifscCode || 'SBIN0001248',
    transactionRef: salaryToEdit?.transactionRef || salaryToEdit?.transaction_ref || 'TXN-HWMS-8921-TN',
    remarks: salaryToEdit?.remarks || 'Artisan output verified against warp logs. Direct wage credited to savings account.',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // When weaver changes, auto-fill their registered bank details
  const handleWeaverSelect = (weaverName) => {
    const selected = weaversList.find((w) => w.name === weaverName);
    setFormData((prev) => ({
      ...prev,
      weaverName,
      bankName: selected?.bankName || prev.bankName,
      bankAccount: selected?.bankAccount || prev.bankAccount,
      ifscCode: selected?.ifscCode || prev.ifscCode,
    }));
  };

  // Calculations
  const baseWage = (Number(formData.metersProduced) || 0) * (Number(formData.ratePerMeter) || 0);
  const netAmount = baseWage + (Number(formData.incentiveAmount) || 0) - (Number(formData.deductions) || 0);

  const validate = () => {
    const newErrors = {};
    if (!formData.weaverName) newErrors.weaverName = 'Please select a weaver';
    if (!formData.month) newErrors.month = 'Billing month is required';
    if (netAmount <= 0) newErrors.netAmount = 'Net payable wage must be greater than zero';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
    });

    onSaveSalary({
      ...formData,
      amount: netAmount,
      month: formData.month,
      status: formData.status,
      payment_date: formData.paymentDate,
      transaction_ref: formData.transactionRef,
      id: salaryToEdit ? salaryToEdit.id : undefined,
    });
  };

  return (
    <div className="space-y-6 font-sans max-w-[1300px] mx-auto pb-12">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-6">
        <div
          className="absolute inset-y-0 right-0 w-2/5 pointer-events-none opacity-25 mix-blend-multiply bg-cover bg-right"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80')`,
            maskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 90%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 90%)',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-1.5 h-12 bg-[#c88a2c] rounded-full shrink-0 mt-1" />
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-0.5">
                <button
                  type="button"
                  onClick={onBack}
                  className="hover:text-[#1e5bbf] transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Salary & Sales Management
                </button>
                <span>/</span>
                <span className="text-[#1e5bbf]">
                  {isEditing ? 'Update Wage Disbursement' : 'Process Artisan Wage Disbursement'}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-serif text-[#132036] tracking-tight">
                {isEditing ? `Edit Wage Slip: ${formData.weaverName}` : 'Process Artisan Wage Disbursement'}
              </h1>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                {isEditing
                  ? 'Update piece-rate production wage calculation and bank transaction reference'
                  : 'Calculate output-based artisan wages, apply festival incentives, and record direct bank transfers'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="self-start md:self-auto px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 shadow-2xs transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Back to Salary List</span>
          </button>
        </div>
      </div>

      {/* 2. Main Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Official Voucher Preview Card (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Voucher Slip Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4 relative overflow-hidden">
              {/* Decorative Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1e5bbf] flex items-center justify-center font-bold">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Wage Payment Voucher
                    </h2>
                    <span className="text-[10px] text-slate-400 font-mono">
                      VOUCHER #{formData.transactionRef.slice(-6)}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    formData.status === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}
                >
                  ● {formData.status}
                </span>
              </div>

              {/* Artisan Profile Snapshot */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Artisan:</span>
                  <span className="font-bold text-slate-900">{formData.weaverName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Billing Period:</span>
                  <span className="font-semibold text-blue-700">{formData.month}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Bank Account:</span>
                  <span className="font-mono text-slate-700 text-[11px]">{formData.bankAccount}</span>
                </div>
              </div>

              {/* Output & Rate Itemized Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Fabric Woven:</span>
                  <span className="font-mono font-semibold text-slate-800">{formData.metersProduced} meters</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Piece Rate (₹/meter):</span>
                  <span className="font-medium text-slate-800">₹{formData.ratePerMeter}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Base Production Wage:</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(baseWage)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50 text-emerald-700">
                  <span>+ Quality Incentive / Bonus:</span>
                  <span className="font-semibold">+{formatCurrency(formData.incentiveAmount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50 text-rose-600">
                  <span>- Advance Loan Deductions:</span>
                  <span className="font-semibold">-{formatCurrency(formData.deductions)}</span>
                </div>
              </div>

              {/* Net Disbursable Box */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#1e5bbf] to-[#15428a] text-white space-y-1 shadow-sm">
                <span className="text-[11px] font-semibold text-blue-200 block uppercase tracking-wider">
                  Net Disbursable Amount
                </span>
                <span className="text-2xl font-extrabold font-serif block tracking-tight">
                  {formatCurrency(netAmount)}
                </span>
                <span className="text-[10px] text-blue-200 block">
                  Method: {formData.paymentMethod}
                </span>
              </div>

              {/* Presets */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block mb-2">
                  Quick calculate presets:
                </span>
                <div className="space-y-1.5">
                  {sampleSalaryPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        handleInputChange('month', preset.month);
                        handleInputChange('metersProduced', preset.meters);
                        handleInputChange('ratePerMeter', preset.ratePerMeter);
                        handleInputChange('incentiveAmount', preset.incentive);
                        handleInputChange('deductions', preset.deductions);
                        handleInputChange('paymentMethod', preset.paymentMethod);
                        handleInputChange('remarks', preset.remarks);
                      }}
                      className="w-full p-2 rounded-xl border border-slate-200 hover:border-[#1e5bbf] bg-slate-50/60 hover:bg-blue-50/60 text-left text-[11px] transition-all flex items-center justify-between"
                    >
                      <span className="font-medium text-slate-700 line-clamp-1">{preset.label}</span>
                      <span className="font-bold text-[#1e5bbf] font-mono shrink-0 ml-1">
                        {formatCurrency(preset.meters * preset.ratePerMeter + preset.incentive - preset.deductions)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Verification Seal */}
              <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium pt-1 border-t border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Direct Artisan Bank Disbursement</span>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Form Fields (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section 1: Artisan & Billing Period */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#1e5bbf]" />
                <div>
                  <h2 className="text-sm font-bold text-slate-800">1. Artisan & Billing Period</h2>
                  <p className="text-[11px] text-slate-400">Recipient weaver, billing cycle month, and payment processing date</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Artisan (Weaver) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.weaverName}
                    onChange={(e) => handleWeaverSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-semibold text-slate-800 bg-white"
                  >
                    {weaversList && weaversList.length > 0 ? (
                      weaversList.map((w) => (
                        <option key={w.id} value={w.name}>
                          {w.name} ({w.village} - Loom {w.assignedLoom || 'Unit'})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="R. Selvi">R. Selvi (Nallapatti Cluster)</option>
                        <option value="M. Kumar">M. Kumar (Thingalur Cluster)</option>
                        <option value="P. Lakshmi">P. Lakshmi (Erode Center)</option>
                        <option value="S. Murugan">S. Murugan (Nallapatti Cluster)</option>
                        <option value="K. Devi">K. Devi (Erode Center)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Billing Cycle Month <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.month}
                    onChange={(e) => handleInputChange('month', e.target.value)}
                    placeholder="e.g. Nov 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Disbursement Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Disbursement Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-bold text-emerald-700 bg-white"
                  >
                    <option value="Paid">● Paid (Disbursed)</option>
                    <option value="Pending">▲ Pending Approval</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-medium text-slate-800 bg-white"
                  >
                    <option value="Direct Bank Transfer (NEFT)">Direct Bank Transfer (NEFT)</option>
                    <option value="Immediate Payment (IMPS)">Immediate Payment (IMPS)</option>
                    <option value="UPI Direct Transfer">UPI Direct Transfer</option>
                    <option value="Cheque Disbursement">Cheque Disbursement</option>
                    <option value="Cash Voucher">Cash Voucher</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Wage & Output Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#1e5bbf]" />
                <div>
                  <h2 className="text-sm font-bold text-slate-800">2. Output-Based Piece-Rate Wage Breakdown</h2>
                  <p className="text-[11px] text-slate-400">Calculated from total verified linear meters produced in cluster</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Meters Woven (Mtrs)
                  </label>
                  <input
                    type="number"
                    value={formData.metersProduced}
                    onChange={(e) => handleInputChange('metersProduced', e.target.value)}
                    placeholder="e.g. 120"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Rate per Meter (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.ratePerMeter}
                    onChange={(e) => handleInputChange('ratePerMeter', e.target.value)}
                    placeholder="e.g. 65"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Quality Incentive (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.incentiveAmount}
                    onChange={(e) => handleInputChange('incentiveAmount', e.target.value)}
                    placeholder="e.g. 700"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Deductions (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.deductions}
                    onChange={(e) => handleInputChange('deductions', e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-bold text-rose-600"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Banking & Transaction Reference */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#1e5bbf]" />
                <div>
                  <h2 className="text-sm font-bold text-slate-800">3. Direct Banking & Transaction Reference</h2>
                  <p className="text-[11px] text-slate-400">Artisan bank account, IFSC routing, and bank transaction UTR</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.bankAccount}
                    onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    IFSC Routing Code
                  </label>
                  <input
                    type="text"
                    value={formData.ifscCode}
                    onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-mono font-bold text-slate-900"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">
                    Transaction Reference No / Bank UTR Code
                  </label>
                  <input
                    type="text"
                    value={formData.transactionRef}
                    onChange={(e) => handleInputChange('transactionRef', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-mono text-slate-800 font-semibold"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">
                    Disbursement & Approval Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={formData.remarks}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    placeholder="e.g. Verified by cooperative manager. Direct piece-rate credited."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-all active:scale-95"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 py-2.5 rounded-xl bg-[#1e5bbf] hover:bg-[#164799] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Update Wage Record' : 'Disburse Wage Payment'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
