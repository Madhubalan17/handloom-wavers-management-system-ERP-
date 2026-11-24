import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Users,
  TrendingUp,
  Cpu,
  Layers,
  Settings,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const AdminDashboard = () => {
  const {
    users,
    weaverProfiles,
    sales,
    looms,
    workOrders,
    setActiveNav,
  } = useApp();

  const totalWeavers = Object.keys(weaverProfiles).length;
  const activeWeavers = Object.values(weaverProfiles).filter(w => w.verificationStatus === 'approved').length;
  const platformRevenue = sales.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalLooms = looms.length;
  const workingLooms = looms.filter(l => l.status === 'working').length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Administrator Director Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
            HWMS National Platform Oversight
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200/90">
            S. Ramanathan • Platform Director • Shared ERP Cloud for All Handloom Weavers
          </p>
        </div>

        <button
          onClick={() => setActiveNav('platform_settings')}
          className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 shadow-md flex items-center gap-2"
        >
          <Settings className="w-4 h-4 text-indigo-700" />
          <span>Platform Settings</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Weavers Enrolled
          </span>
          <p className="text-2xl font-extrabold text-slate-900 font-serif">
            {totalWeavers} Weavers
          </p>
          <p className="text-xs text-emerald-700 font-semibold">{activeWeavers} Active & Verified</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Combined Platform Gross Sales
          </span>
          <p className="text-2xl font-extrabold text-emerald-700 font-serif">
            {formatCurrency(platformRevenue)}
          </p>
          <p className="text-xs text-slate-500">{sales.length} Invoices Issued</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Platform Looms
          </span>
          <p className="text-2xl font-extrabold text-amber-800 font-serif">
            {totalLooms} Looms
          </p>
          <p className="text-xs text-slate-500">{workingLooms} currently operating</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Data Isolation Security
          </span>
          <p className="text-2xl font-extrabold text-indigo-700 font-serif">
            100%
          </p>
          <p className="text-xs text-emerald-600 font-semibold">Strict Tenant Partitioning</p>
        </div>
      </div>

      {/* Weavers Cluster Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 font-serif">
            Registered Weaving Units Across Clusters
          </h2>
          <button
            onClick={() => setActiveNav('verifications')}
            className="text-xs font-semibold text-indigo-700 hover:underline flex items-center gap-1"
          >
            <span>View Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(weaverProfiles).map((w) => (
            <div
              key={w.id}
              className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2 text-xs"
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900 text-sm line-clamp-1">{w.businessName}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  w.verificationStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {w.verificationStatus}
                </span>
              </div>
              <p className="text-slate-600">Owner: {w.ownerName} • {w.district}</p>
              <p className="text-slate-500 font-mono text-[11px]">
                Capacity: {w.monthlyCapacityPieces} pcs/mo • {w.loomCount} Looms
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
