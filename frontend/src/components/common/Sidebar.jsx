import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Store,
  Layers,
  Cpu,
  ClipboardList,
  CheckCircle,
  Package,
  Receipt,
  Wallet,
  BarChart3,
  Truck,
  UserCheck,
  Settings,
  ShoppingBag,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const {
    currentRole,
    activeNav,
    setActiveNav,
    t,
    weaverMaterials,
    weaverLooms,
    weaverWorkOrders,
    weaverInspections,
    weaverProfiles,
  } = useApp();

  // Metrics for badges
  const lowStockCount = weaverMaterials.filter(m => m.currentStock <= m.minimumStock).length;
  const activeOrdersCount = weaverWorkOrders.filter(w => w.status === 'in_progress' || w.status === 'assigned').length;
  const pendingInspectionsCount = weaverWorkOrders.filter(w => w.status === 'submitted').length;
  const pendingVerificationsCount = Object.values(weaverProfiles).filter(p => p.verificationStatus === 'under_review').length;
  const workingLoomsCount = weaverLooms.filter(l => l.status === 'working').length;

  const handleNavClick = (navId) => {
    setActiveNav(navId);
    if (onClose) onClose();
  };

  // Weaver navigation items
  const weaverNavItems = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'profile', label: t('navProfile'), icon: Store },
    { 
      id: 'materials', 
      label: t('navMaterials'), 
      icon: Layers, 
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeColor: 'bg-rose-500 text-white' 
    },
    { 
      id: 'looms_workers', 
      label: t('navLoomsWorkers'), 
      icon: Cpu,
      meta: `${workingLoomsCount}/${weaverLooms.length} Active`
    },
    { 
      id: 'work_orders', 
      label: t('navWorkOrders'), 
      icon: ClipboardList,
      badge: activeOrdersCount > 0 ? activeOrdersCount : null,
      badgeColor: 'bg-amber-600 text-white'
    },
    { 
      id: 'quality', 
      label: t('navQuality'), 
      icon: CheckCircle,
      badge: pendingInspectionsCount > 0 ? pendingInspectionsCount : null,
      badgeColor: 'bg-blue-600 text-white'
    },
    { id: 'finished_stock', label: t('navFinishedStock'), icon: Package },
    { id: 'sales', label: t('navSalesBilling'), icon: Receipt },
    { id: 'payments_wages', label: t('navPaymentsWages'), icon: Wallet },
    { id: 'suppliers', label: t('navSuppliers'), icon: Truck },
    { id: 'reports', label: t('navReports'), icon: BarChart3 },
  ];

  // Manager navigation items
  const managerNavItems = [
    { id: 'dashboard', label: "Manager Dashboard", icon: LayoutDashboard },
    { 
      id: 'verifications', 
      label: t('navVerificationQueue'), 
      icon: UserCheck,
      badge: pendingVerificationsCount > 0 ? pendingVerificationsCount : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    { id: 'quality_reviews', label: "Quality Audit & Disputes", icon: ShieldCheck },
    { id: 'reports', label: "Platform Analytics", icon: BarChart3 },
    { id: 'customer_catalog', label: t('navCustomerCatalog'), icon: ShoppingBag },
  ];

  // Admin navigation items
  const adminNavItems = [
    { id: 'dashboard', label: "Admin Control Center", icon: LayoutDashboard },
    { id: 'verifications', label: "Weaver Directory & Audits", icon: UserCheck },
    { id: 'platform_settings', label: t('navPlatformSettings'), icon: Settings },
    { id: 'reports', label: "Financial & Tax Reports", icon: BarChart3 },
    { id: 'customer_catalog', label: t('navCustomerCatalog'), icon: ShoppingBag },
  ];

  // Supplier navigation items
  const supplierNavItems = [
    { id: 'supplier_portal', label: t('navSupplierPortal'), icon: Truck },
    { id: 'customer_catalog', label: t('navCustomerCatalog'), icon: ShoppingBag },
  ];

  // Customer navigation items
  const customerNavItems = [
    { id: 'customer_catalog', label: t('navCustomerCatalog'), icon: ShoppingBag },
    { id: 'profile', label: "Weaver Artisan Story", icon: Store },
  ];

  const currentNavItems = 
    currentRole === 'weaver' ? weaverNavItems :
    currentRole === 'manager' ? managerNavItems :
    currentRole === 'admin' ? adminNavItems :
    currentRole === 'supplier' ? supplierNavItems : customerNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation Links */}
        <div className="p-4 overflow-y-auto flex-1 space-y-1">
          <div className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {currentRole === 'weaver' ? 'Weaver ERP Modules' : `${currentRole.toUpperCase()} Navigation`}
          </div>

          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-amber-900 text-white shadow-md shadow-amber-950/20'
                    : 'text-slate-600 hover:text-amber-900 hover:bg-amber-50/70'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-amber-700'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {item.meta && (
                    <span className="text-[10px] text-slate-400 font-normal">
                      {item.meta}
                    </span>
                  )}
                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                      {item.badge}
                    </span>
                  )}
                  {!isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-700 transition-colors" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer / Status Card */}
        <div className="p-4 border-t border-slate-100 bg-amber-50/30">
          <div className="rounded-xl p-3 bg-white border border-amber-200/60 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-amber-950">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                HWMS Core v1.0
              </span>
              <span className="text-[10px] text-amber-700 uppercase tracking-wider font-semibold">Active</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Multi-tenant Isolated Workspace with GIS Handloom Verification.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
