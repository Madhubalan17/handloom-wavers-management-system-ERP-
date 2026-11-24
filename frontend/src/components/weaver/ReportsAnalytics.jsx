import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  TrendingUp,
  Package,
  Layers,
  Wallet,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ReportsAnalytics = () => {
  const {
    weaverSales,
    weaverWorkOrders,
    weaverMaterials,
    weaverWages,
    weaverInspections,
    currentWeaverProfile,
  } = useApp();

  const [reportType, setReportType] = useState('sales'); // 'sales' | 'production' | 'materials' | 'wages' | 'quality'
  const [dateFilter, setDateFilter] = useState('all');

  // Compute metrics
  const totalSales = weaverSales.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalWages = weaverWages.reduce((sum, w) => sum + w.netPayable, 0);
  const totalMaterialValuation = weaverMaterials.reduce((sum, m) => sum + (m.currentStock * m.ratePerUnit), 0);
  const totalCompletedPieces = weaverWorkOrders.reduce((sum, wo) => sum + wo.quantityCompleted, 0);

  // Quality pass rate
  const totalInspected = weaverInspections.reduce((sum, qa) => sum + qa.quantityInspected, 0);
  const totalAccepted = weaverInspections.reduce((sum, qa) => sum + qa.quantityAccepted, 0);
  const passRate = totalInspected > 0 ? Math.round((totalAccepted / totalInspected) * 100) : 100;

  // Export CSV function
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (reportType === 'sales') {
      csvContent += "Invoice Number,Date,Buyer Name,Buyer Type,Grand Total,Payment Status,Balance Due\n";
      weaverSales.forEach(s => {
        csvContent += `"${s.invoiceNumber}","${s.date}","${s.buyerName}","${s.buyerType}",${s.grandTotal},"${s.paymentStatus}",${s.balanceDue}\n`;
      });
    } else if (reportType === 'production') {
      csvContent += "WO Number,Product Name,Quantity Ordered,Quantity Completed,Status,Target Date,Artisan\n";
      weaverWorkOrders.forEach(w => {
        csvContent += `"${w.workOrderNumber}","${w.productName}",${w.quantityOrdered},${w.quantityCompleted},"${w.status}","${w.targetDate}","${w.assignedWorkerName}"\n`;
      });
    } else if (reportType === 'materials') {
      csvContent += "Material Name,Category,Current Stock,Unit,Rate,Valuation,Status\n";
      weaverMaterials.forEach(m => {
        csvContent += `"${m.name}","${m.category}",${m.currentStock},"${m.unit}",${m.ratePerUnit},${m.currentStock * m.ratePerUnit},"${m.currentStock <= m.minimumStock ? 'Low Stock' : 'Adequate'}"\n`;
      });
    } else {
      csvContent += "Artisan Name,Period,Wage Type,Gross Wage,Deductions,Net Payable,Status\n";
      weaverWages.forEach(wg => {
        csvContent += `"${wg.workerName}","${wg.period}","${wg.wageType}",${wg.grossWage},${wg.advancesDeducted + wg.welfareDeduction},${wg.netPayable},"${wg.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HWMS_${currentWeaverProfile.businessName.slice(0,10)}_${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            Reports & Business Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Comprehensive production, inventory valuation, quality pass rates, and GST sales reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
            <span>Cumulative Sales</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 font-serif">{formatCurrency(totalSales)}</p>
          <p className="text-[10px] text-emerald-700 font-semibold">{weaverSales.length} Total Invoices</p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
            <span>Yarn & Stock Valuation</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 font-serif">{formatCurrency(totalMaterialValuation)}</p>
          <p className="text-[10px] text-slate-500">{weaverMaterials.length} Raw Materials</p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
            <span>Woven Pieces Output</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 font-serif">{totalCompletedPieces} pieces</p>
          <p className="text-[10px] text-blue-700 font-semibold">Across {weaverWorkOrders.length} Work Orders</p>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
            <span>Quality Pass Rate</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-extrabold text-slate-900 font-serif">{passRate}%</p>
          <p className="text-[10px] text-purple-700 font-semibold">{totalAccepted} of {totalInspected} Passed</p>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'sales', label: 'Sales & Billing Ledger' },
              { id: 'production', label: 'Production & Work Orders' },
              { id: 'materials', label: 'Material Stock & Rates' },
              { id: 'wages', label: 'Artisan Wage Disbursements' },
              { id: 'quality', label: 'Quality & Rework Audit' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  reportType === tab.id
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            Generated: {formatDate(new Date().toISOString())}
          </span>
        </div>

        {/* Tab 1: Sales Report */}
        {reportType === 'sales' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b">
                <tr>
                  <th className="px-4 py-2.5">Invoice #</th>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Buyer</th>
                  <th className="px-4 py-2.5">Subtotal</th>
                  <th className="px-4 py-2.5">GST (5%)</th>
                  <th className="px-4 py-2.5">Grand Total</th>
                  <th className="px-4 py-2.5">Payment</th>
                  <th className="px-4 py-2.5">Balance Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {weaverSales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 font-mono font-bold text-amber-900">{s.invoiceNumber}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-500">{formatDate(s.date)}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-800">{s.buyerName}</td>
                    <td className="px-4 py-2.5">{formatCurrency(s.subtotal)}</td>
                    <td className="px-4 py-2.5">{formatCurrency(s.gstAmount)}</td>
                    <td className="px-4 py-2.5 font-extrabold text-slate-900">{formatCurrency(s.grandTotal)}</td>
                    <td className="px-4 py-2.5 capitalize">{s.paymentStatus.replace('_', ' ')}</td>
                    <td className="px-4 py-2.5 font-bold text-rose-600">{formatCurrency(s.balanceDue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Production Report */}
        {reportType === 'production' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b">
                <tr>
                  <th className="px-4 py-2.5">Work Order #</th>
                  <th className="px-4 py-2.5">Product</th>
                  <th className="px-4 py-2.5">Ordered</th>
                  <th className="px-4 py-2.5">Completed</th>
                  <th className="px-4 py-2.5">Progress</th>
                  <th className="px-4 py-2.5">Artisan</th>
                  <th className="px-4 py-2.5">Target Date</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {weaverWorkOrders.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 font-mono font-bold text-amber-900">{w.workOrderNumber}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-800">{w.productName}</td>
                    <td className="px-4 py-2.5">{w.quantityOrdered} {w.unit}</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-700">{w.quantityCompleted} {w.unit}</td>
                    <td className="px-4 py-2.5 font-bold">{w.progressPercentage}%</td>
                    <td className="px-4 py-2.5">{w.assignedWorkerName}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-500">{formatDate(w.targetDate)}</td>
                    <td className="px-4 py-2.5 capitalize">{w.status.replace('_', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Materials Report */}
        {reportType === 'materials' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b">
                <tr>
                  <th className="px-4 py-2.5">Material</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Quality Spec</th>
                  <th className="px-4 py-2.5">Stock</th>
                  <th className="px-4 py-2.5">Unit Rate</th>
                  <th className="px-4 py-2.5">Stock Valuation</th>
                  <th className="px-4 py-2.5">Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {weaverMaterials.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 font-bold text-slate-800">{m.name}</td>
                    <td className="px-4 py-2.5">{m.category}</td>
                    <td className="px-4 py-2.5 text-slate-500 font-mono">{m.countQuality}</td>
                    <td className="px-4 py-2.5 font-extrabold text-slate-900">{m.currentStock} {m.unit}</td>
                    <td className="px-4 py-2.5 font-mono">{formatCurrency(m.ratePerUnit)}</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-800">{formatCurrency(m.currentStock * m.ratePerUnit)}</td>
                    <td className="px-4 py-2.5 text-slate-500">{m.minimumStock} {m.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Wages Report */}
        {reportType === 'wages' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b">
                <tr>
                  <th className="px-4 py-2.5">Artisan</th>
                  <th className="px-4 py-2.5">Period</th>
                  <th className="px-4 py-2.5">Wage Model</th>
                  <th className="px-4 py-2.5">Gross Wage</th>
                  <th className="px-4 py-2.5">Deductions</th>
                  <th className="px-4 py-2.5">Net Disbursed</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {weaverWages.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 font-bold text-slate-800">{w.workerName}</td>
                    <td className="px-4 py-2.5 font-semibold text-slate-600">{w.period}</td>
                    <td className="px-4 py-2.5 capitalize">{w.wageType.replace('_', ' ')}</td>
                    <td className="px-4 py-2.5 font-mono">{formatCurrency(w.grossWage)}</td>
                    <td className="px-4 py-2.5 text-rose-600 font-mono">-{formatCurrency((w.advancesDeducted || 0) + (w.welfareDeduction || 0))}</td>
                    <td className="px-4 py-2.5 font-extrabold text-slate-900">{formatCurrency(w.netPayable)}</td>
                    <td className="px-4 py-2.5 capitalize">{w.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 5: Quality Report */}
        {reportType === 'quality' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b">
                <tr>
                  <th className="px-4 py-2.5">QA #</th>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Product</th>
                  <th className="px-4 py-2.5">Inspected</th>
                  <th className="px-4 py-2.5">Accepted</th>
                  <th className="px-4 py-2.5">Rework</th>
                  <th className="px-4 py-2.5">Inspector</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {weaverInspections.map((qa) => (
                  <tr key={qa.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 font-mono font-bold text-amber-900">{qa.inspectionNumber}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-500">{formatDate(qa.inspectionDate)}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-800">{qa.productName}</td>
                    <td className="px-4 py-2.5">{qa.quantityInspected}</td>
                    <td className="px-4 py-2.5 font-bold text-emerald-700">{qa.quantityAccepted}</td>
                    <td className="px-4 py-2.5 font-bold text-amber-700">{qa.quantityReworked}</td>
                    <td className="px-4 py-2.5">{qa.inspectorName}</td>
                    <td className="px-4 py-2.5 uppercase font-bold text-[10px]">{qa.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
