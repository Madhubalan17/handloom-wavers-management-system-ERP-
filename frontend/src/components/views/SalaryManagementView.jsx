import React, { useState } from 'react';
import { Wallet, Search, Plus, Edit2, Trash2, CheckCircle2, Clock, CreditCard, User, Building } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const initialSalaries = [
  {
    id: 1,
    weaverName: 'R. Selvi',
    month: 'Nov 2026',
    amount: 8000,
    status: 'Paid',
    paymentDate: '2026-11-24',
    transactionRef: 'TXN-HWMS-8921-TN',
    paymentMethod: 'Direct Bank Transfer (NEFT)',
  },
  {
    id: 2,
    weaverName: 'M. Kumar',
    month: 'Nov 2026',
    amount: 8000,
    status: 'Paid',
    paymentDate: '2026-11-24',
    transactionRef: 'TXN-HWMS-8922-TN',
    paymentMethod: 'Direct Bank Transfer (NEFT)',
  },
  {
    id: 3,
    weaverName: 'P. Lakshmi',
    month: 'Nov 2026',
    amount: 7500,
    status: 'Pending',
    paymentDate: '2026-11-23',
    transactionRef: 'TXN-HWMS-8923-TN',
    paymentMethod: 'Direct Bank Transfer (NEFT)',
  },
  {
    id: 4,
    weaverName: 'S. Murugan',
    month: 'Nov 2026',
    amount: 8000,
    status: 'Paid',
    paymentDate: '2026-11-22',
    transactionRef: 'TXN-HWMS-8924-TN',
    paymentMethod: 'UPI Direct Transfer',
  },
];

export const SalaryManagementView = ({
  salaries = initialSalaries,
  onNavigateToAddSalary,
  onNavigateToEditSalary,
  onDeleteSalary,
  onToggleStatus,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = (salaries || []).filter((s) => {
    const w = (s.weaverName || s.weaver_name || '').toLowerCase();
    const m = (s.month || '').toLowerCase();
    const ref = (s.transactionRef || s.transaction_ref || '').toLowerCase();
    const q = search.toLowerCase();

    const matchSearch = w.includes(q) || m.includes(q) || ref.includes(q);
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4 font-sans">
      {/* Header matching Screen 9 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-1.5 h-10 bg-[#c88a2c] rounded-full shrink-0 mt-0.5" />
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-serif tracking-tight">
              Salary & Sales Wage Management
            </h1>
            <p className="text-xs text-slate-500">
              Output-based piece-rate wage calculation, sales settlement, and direct bank disbursement
            </p>
          </div>
        </div>

        {/* Primary "+ Add Salary" opens dedicated AddSalaryPage */}
        <button
          type="button"
          onClick={onNavigateToAddSalary}
          className="px-4 py-2.5 rounded-xl bg-[#1e5bbf] hover:bg-[#164799] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.02] active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Disburse Wage Payment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by weaver, month, transaction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium"
          >
            <option value="All">All Payments</option>
            <option value="Paid">Disbursed (Paid)</option>
            <option value="Pending">Pending Approval</option>
          </select>
        </div>
      </div>

      {/* Table matching Screen 9 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#152238] text-white font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12">#</th>
                <th className="py-3.5 px-4">Artisan (Weaver)</th>
                <th className="py-3.5 px-4">Billing Month</th>
                <th className="py-3.5 px-4">Disbursed Amount</th>
                <th className="py-3.5 px-4">Bank Reference</th>
                <th className="py-3.5 px-4">Disbursement Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item, index) => {
                const isPaid = item.status === 'Paid';
                const wName = item.weaverName || item.weaver_name;
                const amt = item.amount;
                const ref = item.transactionRef || item.transaction_ref || 'TXN-HWMS-8921';

                return (
                  <tr key={item.id || index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {index + 1}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1e5bbf] flex items-center justify-center font-bold">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {wName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Wage ID: DISB-{100 + (item.id || index)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {item.month}
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-emerald-800 text-sm font-serif">
                      {formatCurrency(amt)}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      {ref}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => onToggleStatus && onToggleStatus(item.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}
                        title="Click to toggle status"
                      >
                        ● {item.status}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onNavigateToEditSalary(item)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-2xs"
                          title="Edit Wage Slip"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteSalary(item.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors shadow-2xs"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {filtered.length} of {salaries.length} wage records</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">&lt;</button>
            <button className="px-2.5 py-1 rounded bg-[#1e5bbf] text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};
