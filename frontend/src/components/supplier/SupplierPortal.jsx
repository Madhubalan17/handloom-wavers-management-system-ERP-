import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  DollarSign,
  PackageCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Building2,
  Phone,
  Mail,
  FileText,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const SupplierPortal = () => {
  const {
    suppliers,
    supplierPayments,
    stockMovements,
    materials,
  } = useApp();

  const currentSupplier = suppliers[0]; // Sri Lakshmi Raw Silk & Yarn Mills

  const supplierReceipts = stockMovements.filter(mv => 
    mv.movementType === 'in' && mv.supplierId === currentSupplier?.id
  );

  const supplierLedger = supplierPayments.filter(sp => 
    sp.supplierId === currentSupplier?.id
  );

  const totalSuppliedValuation = supplierReceipts.reduce((sum, r) => sum + (r.quantity * (r.rate || 4800)), 0);
  const totalRemitted = supplierLedger.reduce((sum, p) => sum + p.amountPaid, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            <Truck className="w-3.5 h-3.5" />
            <span>Raw Material Supplier Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
            {currentSupplier?.businessName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Proprietor: {currentSupplier?.contactPerson} • {currentSupplier?.phone} • GSTIN: {currentSupplier?.gstNumber}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-right space-y-1">
          <span className="text-[10px] text-amber-200 uppercase font-bold tracking-wider block">
            Outstanding Payment Dues
          </span>
          <span className="text-2xl font-extrabold text-amber-400 font-serif">
            {formatCurrency(currentSupplier?.balanceDue)}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] block">
            Total Consignment Supplies
          </span>
          <p className="text-2xl font-extrabold text-slate-900 font-serif">
            {formatCurrency(totalSuppliedValuation)}
          </p>
          <p className="text-xs text-slate-500">{supplierReceipts.length} Batches Delivered</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] block">
            Payments Received to Date
          </span>
          <p className="text-2xl font-extrabold text-emerald-700 font-serif">
            {formatCurrency(totalRemitted)}
          </p>
          <p className="text-xs text-emerald-600 font-semibold">{supplierLedger.length} Wire Transfers</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] block">
            Quality Inspection Score
          </span>
          <p className="text-2xl font-extrabold text-amber-800 font-serif">
            99.2%
          </p>
          <p className="text-xs text-slate-500">Pure Grade AAA Mulberry Denier</p>
        </div>
      </div>

      {/* Inward Consignments Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-amber-800" />
            <h2 className="text-base font-bold text-slate-900 font-serif">
              Raw Material Deliveries to Weavers
            </h2>
          </div>
          <span className="text-xs text-slate-400">Verified by Weavers' Inward Gate</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Invoice #</th>
                <th className="px-4 py-3">Material Supplied</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Agreed Rate</th>
                <th className="px-4 py-3">Consignment Value</th>
                <th className="px-4 py-3">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {supplierReceipts.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono text-slate-500">{formatDate(rec.date)}</td>
                  <td className="px-4 py-3 font-mono font-bold text-amber-900">{rec.invoiceNo}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{rec.materialName}</td>
                  <td className="px-4 py-3 font-extrabold text-slate-900">{rec.quantity} {rec.unit}</td>
                  <td className="px-4 py-3 font-mono">{formatCurrency(rec.rate)}</td>
                  <td className="px-4 py-3 font-extrabold text-slate-900 text-sm font-serif">
                    {formatCurrency(rec.quantity * rec.rate)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Delivered & Stocked
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
