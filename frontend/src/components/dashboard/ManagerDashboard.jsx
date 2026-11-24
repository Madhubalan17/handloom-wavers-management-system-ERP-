import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  UserCheck,
  ClipboardList,
  AlertTriangle,
  Building2,
  Clock,
  ArrowRight,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const ManagerDashboard = () => {
  const {
    weaverProfiles,
    qualityInspections,
    workOrders,
    setActiveNav,
  } = useApp();

  const weaversList = Object.values(weaverProfiles);
  const pendingWeavers = weaversList.filter(w => w.verificationStatus === 'under_review');
  const approvedWeavers = weaversList.filter(w => w.verificationStatus === 'approved');

  // Quality checks with rework or defect
  const reworkInspections = qualityInspections.filter(qa => qa.status === 'rework' || qa.status === 'rejected');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>District Verification & Quality Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
            Platform Manager Operations Desk
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90">
            Ananya Sharma • District Handloom Officer • Overseeing Kanchipuram, Salem & Madurai Clusters
          </p>
        </div>

        <button
          onClick={() => setActiveNav('verifications')}
          className="px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 shadow-md flex items-center gap-2"
        >
          <UserCheck className="w-4 h-4 text-emerald-700" />
          <span>Review Pending Weavers ({pendingWeavers.length})</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
            Awaiting Verification
          </span>
          <p className="text-2xl font-extrabold text-amber-700 font-serif">
            {pendingWeavers.length} Weavers
          </p>
          <p className="text-xs text-slate-500">KYC & loom inspections pending</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
            Active Verified Weavers
          </span>
          <p className="text-2xl font-extrabold text-emerald-700 font-serif">
            {approvedWeavers.length} Units
          </p>
          <p className="text-xs text-slate-500">Private ERP workspaces live</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
            Total Work Orders Monitored
          </span>
          <p className="text-2xl font-extrabold text-blue-800 font-serif">
            {workOrders.length} Orders
          </p>
          <p className="text-xs text-slate-500">Across all platform looms</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block">
            Quality Reworks Flagged
          </span>
          <p className="text-2xl font-extrabold text-rose-700 font-serif">
            {reworkInspections.length} Cases
          </p>
          <p className="text-xs text-slate-500">Defect audits under re-tensioning</p>
        </div>
      </div>

      {/* Verification Queue Preview */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 font-serif">
            Pending Weaver Approvals
          </h2>
          <button
            onClick={() => setActiveNav('verifications')}
            className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
          >
            <span>Open Verification Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingWeavers.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
            All registered weavers have been verified and approved.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingWeavers.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{w.businessName}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {w.ownerName} • {w.district} • {w.loomCount} Looms • ID: {w.idProofRef}
                  </p>
                </div>
                <button
                  onClick={() => setActiveNav('verifications')}
                  className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800 shadow-2xs"
                >
                  Inspect & Approve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
