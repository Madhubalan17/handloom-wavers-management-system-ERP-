import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardList,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  Wallet,
  Cpu,
  Layers,
  Plus,
  ArrowRight,
  Package,
  Calendar,
  AlertCircle,
  Truck,
  Sparkles,
  Award,
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';

export const WeaverDashboard = () => {
  const {
    t,
    currentWeaverProfile,
    weaverMaterials,
    weaverLooms,
    weaverWorkers,
    weaverWorkOrders,
    weaverInspections,
    weaverFinishedGoods,
    weaverSales,
    weaverWages,
    setActiveNav,
  } = useApp();

  // Metric Computations
  const activeWorkOrders = weaverWorkOrders.filter(w => w.status === 'in_progress' || w.status === 'assigned');
  
  // Overdue check: targetDate < today and status != 'closed'
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueOrders = weaverWorkOrders.filter(w => 
    w.status !== 'closed' && w.targetDate && w.targetDate < todayStr
  );

  const lowStockItems = weaverMaterials.filter(m => m.currentStock <= m.minimumStock);
  const pendingInspections = weaverWorkOrders.filter(w => w.status === 'submitted');
  
  // Sales this month
  const currentMonthPrefix = todayStr.slice(0, 7); // "2026-11"
  const salesThisMonth = weaverSales
    .filter(s => s.date?.startsWith(currentMonthPrefix))
    .reduce((sum, s) => sum + (s.grandTotal || 0), 0);

  // Pending wages & dues
  const pendingWagesTotal = weaverWages
    .filter(w => w.status === 'calculated' || w.status === 'approved')
    .reduce((sum, w) => sum + (w.netPayable || 0), 0);

  // Active looms
  const workingLooms = weaverLooms.filter(l => l.status === 'working');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-700/60 border border-amber-600/40 text-xs font-semibold text-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Private Weaver Workspace</span>
              <span className="text-amber-400">•</span>
              <span>{currentWeaverProfile?.district}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-amber-50">
              {currentWeaverProfile?.businessName}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              Master Handloom Unit • {currentWeaverProfile?.loomCount} Looms • {currentWeaverProfile?.workerCount} Artisans • Capacity: {currentWeaverProfile?.monthlyCapacityPieces} pcs/mo
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveNav('work_orders')}
              className="px-4 py-2.5 rounded-xl bg-white text-amber-950 font-bold text-xs hover:bg-amber-50 transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-amber-800" />
              <span>Create Work Order</span>
            </button>
            <button
              onClick={() => setActiveNav('sales')}
              className="px-4 py-2.5 rounded-xl bg-amber-700/80 hover:bg-amber-600 border border-amber-500/40 text-white font-bold text-xs transition-all flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-amber-200" />
              <span>New Sale / GST Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards (6 Key Areas from Section 7.12) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Active Work Orders */}
        <div 
          onClick={() => setActiveNav('work_orders')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-amber-400 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Orders
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800 group-hover:scale-110 transition-transform">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-serif">
              {activeWorkOrders.length}
            </span>
            <span className="text-[11px] text-slate-500">in progress</span>
          </div>
        </div>

        {/* Overdue Orders */}
        <div 
          onClick={() => setActiveNav('work_orders')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-rose-400 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
              Overdue Orders
            </span>
            <div className={`p-2 rounded-xl ${overdueOrders.length > 0 ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-500'} group-hover:scale-110 transition-transform`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold font-serif ${overdueOrders.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {overdueOrders.length}
            </span>
            <span className="text-[11px] text-slate-500">attention</span>
          </div>
        </div>

        {/* Low Stock Items */}
        <div 
          onClick={() => setActiveNav('materials')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-amber-400 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Low Stock Items
            </span>
            <div className={`p-2 rounded-xl ${lowStockItems.length > 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-500'} group-hover:scale-110 transition-transform`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold font-serif ${lowStockItems.length > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
              {lowStockItems.length}
            </span>
            <span className="text-[11px] text-slate-500">below min</span>
          </div>
        </div>

        {/* Pending QA Inspections */}
        <div 
          onClick={() => setActiveNav('quality')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-blue-400 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Pending QA
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-serif">
              {pendingInspections.length}
            </span>
            <span className="text-[11px] text-slate-500">submitted</span>
          </div>
        </div>

        {/* Monthly Sales */}
        <div 
          onClick={() => setActiveNav('sales')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-emerald-400 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Monthly Sales
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-extrabold text-emerald-700 font-serif">
              {formatCurrency(salesThisMonth)}
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">Nov 2026</p>
          </div>
        </div>

        {/* Pending Wages */}
        <div 
          onClick={() => setActiveNav('payments_wages')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-purple-400 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
              Wages Payable
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700 group-hover:scale-110 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-extrabold text-purple-800 font-serif">
              {formatCurrency(pendingWagesTotal)}
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">Calculated & approved</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Production & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Active Production Progress */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">
                Active Production & Loom Allocations
              </h2>
              <p className="text-xs text-slate-500">
                Live monitoring of work orders, worker assignments, and deadlines
              </p>
            </div>
            <button
              onClick={() => setActiveNav('work_orders')}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {weaverWorkOrders.slice(0, 3).map((wo) => {
              const isUrgent = wo.priority === 'Urgent';
              return (
                <div
                  key={wo.id}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-amber-300 bg-slate-50/40 hover:bg-white transition-all space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-900">
                          {wo.workOrderNumber}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${getStatusBadgeClass(wo.status)}`}>
                          {wo.status.replace('_', ' ').toUpperCase()}
                        </span>
                        {isUrgent && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-100 text-rose-800">
                            Urgent
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 mt-1">
                        {wo.productName}
                      </h4>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs font-bold text-slate-900">
                        {wo.quantityCompleted} / {wo.quantityOrdered} {wo.unit}
                      </span>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 sm:justify-end mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Target: {formatDate(wo.targetDate)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-slate-600">
                        Assigned: {wo.assignedWorkerName} ({wo.assignedLoomNumber})
                      </span>
                      <span className="text-amber-800">{wo.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${wo.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (1 col): Low Stock Alerts & Loom Readiness */}
        <div className="space-y-6">
          {/* Low Stock Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900 font-serif">
                  Raw Material Alerts
                </h3>
              </div>
              <button
                onClick={() => setActiveNav('materials')}
                className="text-xs font-semibold text-amber-800 hover:text-amber-950"
              >
                Restock
              </button>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                <p className="text-xs font-semibold text-emerald-800">
                  All yarn, zari and dye stocks are adequate!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {lowStockItems.map((mat) => (
                  <div
                    key={mat.id}
                    className="p-3 rounded-xl border border-rose-200/80 bg-rose-50/50 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{mat.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Min required: {mat.minimumStock} {mat.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-rose-600">
                        {mat.currentStock} {mat.unit}
                      </span>
                      <p className="text-[10px] text-rose-500 font-medium">Shortage</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Looms Status Glance */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-800" />
                <h3 className="text-sm font-bold text-slate-900 font-serif">
                  Looms & Workforce
                </h3>
              </div>
              <button
                onClick={() => setActiveNav('looms_workers')}
                className="text-xs font-semibold text-amber-800 hover:text-amber-950"
              >
                Manage
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-100">
                <span className="text-lg font-bold text-emerald-700 font-serif">
                  {workingLooms.length}
                </span>
                <p className="text-[10px] text-emerald-800 font-semibold uppercase mt-0.5">
                  Working
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-lg font-bold text-slate-700 font-serif">
                  {weaverLooms.filter(l => l.status === 'idle').length}
                </span>
                <p className="text-[10px] text-slate-600 font-semibold uppercase mt-0.5">
                  Idle
                </p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
                <span className="text-lg font-bold text-rose-700 font-serif">
                  {weaverLooms.filter(l => l.status === 'under_repair').length}
                </span>
                <p className="text-[10px] text-rose-800 font-semibold uppercase mt-0.5">
                  Repair
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              Active workforce: {weaverWorkers.length} certified artisans ({weaverWorkers.filter(w => w.status === 'active').length} on duty today).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
