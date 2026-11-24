import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Filter,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Printer,
} from 'lucide-react';

export const ReportsView = () => {
  const [reportType, setReportType] = useState('production'); // 'production' | 'payment' | 'weaver' | 'stock'
  const [fromDate, setFromDate] = useState('2026-11-01');
  const [toDate, setToDate] = useState('2026-11-24');
  const [selectedWeaver, setSelectedWeaver] = useState('All');

  // Bar chart monthly production data
  const monthlyBars = [
    { month: 'Jan', value: 20 },
    { month: 'Feb', value: 35 },
    { month: 'Mar', value: 58 },
    { month: 'Apr', value: 40 },
    { month: 'May', value: 48 },
    { month: 'Jun', value: 52 },
    { month: 'Jul', value: 65 },
    { month: 'Aug', value: 78 },
    { month: 'Sep', value: 64 },
    { month: 'Oct', value: 70 },
    { month: 'Nov', value: 74 },
    { month: 'Dec', value: 88 },
  ];

  return (
    <div className="space-y-5 font-sans">
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h1 className="text-xl font-bold text-slate-900 font-serif">
          Reports & Analytics
        </h1>
        <p className="text-xs text-slate-500">
          Generate consolidated production, payment, artisan, and inventory audits
        </p>
      </div>

      {/* Date & Filter Bar matching Screen 10 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Weaver Filter</label>
            <select
              value={selectedWeaver}
              onChange={(e) => setSelectedWeaver(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
            >
              <option value="All">All Weavers</option>
              <option value="R. Selvi">R. Selvi (Nallapatti)</option>
              <option value="M. Kumar">M. Kumar (Thingalur)</option>
              <option value="P. Lakshmi">P. Lakshmi (Erode)</option>
            </select>
          </div>

          <div>
            <button
              onClick={() => alert(`Generated ${reportType} report for ${fromDate} to ${toDate}`)}
              className="w-full py-2.5 rounded-xl bg-[#132036] hover:bg-[#1a2d4b] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Report Cards matching Screen 10 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Production Report */}
        <button
          onClick={() => setReportType('production')}
          className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-3.5 shadow-2xs ${
            reportType === 'production'
              ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Production Report</h3>
            <span className="text-[11px] text-slate-500">Meters & Loom logs</span>
          </div>
        </button>

        {/* Card 2: Payment Report */}
        <button
          onClick={() => setReportType('payment')}
          className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-3.5 shadow-2xs ${
            reportType === 'payment'
              ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 font-serif font-bold text-xl">
            ₹
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Payment Report</h3>
            <span className="text-[11px] text-slate-500">Salaries & Dues</span>
          </div>
        </button>

        {/* Card 3: Weaver Report */}
        <button
          onClick={() => setReportType('weaver')}
          className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-3.5 shadow-2xs ${
            reportType === 'weaver'
              ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Weaver Report</h3>
            <span className="text-[11px] text-slate-500">Artisan Rosters</span>
          </div>
        </button>

        {/* Card 4: Stock Report */}
        <button
          onClick={() => setReportType('stock')}
          className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-3.5 shadow-2xs ${
            reportType === 'stock'
              ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Stock Report</h3>
            <span className="text-[11px] text-slate-500">Yarn & Finished goods</span>
          </div>
        </button>
      </div>

      {/* Bar Chart matching Screen 10 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Monthly Production Report
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-600">
              <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" />
              <span>Production (Mtrs)</span>
            </span>
            <button
              onClick={() => window.print()}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Print
            </button>
          </div>
        </div>

        {/* SVG Column Bar Chart */}
        <div className="w-full overflow-x-auto pt-4">
          <div className="min-w-[500px] h-48 flex items-end justify-between gap-3 px-6 pb-2 border-b border-slate-200">
            {monthlyBars.map((b) => (
              <div key={b.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {b.value * 100}m
                </span>
                <div
                  className="w-full max-w-[28px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-500 group-hover:brightness-110 shadow-xs"
                  style={{ height: `${b.value}%` }}
                />
                <span className="text-[10px] font-semibold text-slate-500 mt-1">
                  {b.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
