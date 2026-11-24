import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  Layers,
  ChevronDown,
  Building2,
  UserCheck,
  ShieldAlert,
  Menu,
  X,
  Award,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const Header = ({ onToggleSidebar }) => {
  const {
    currentRole,
    setCurrentRole,
    activeWeaverId,
    setActiveWeaverId,
    currentWeaverProfile,
    language,
    setLanguage,
    t,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveNav,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const handleRoleSelect = (role, weaverId = null) => {
    setCurrentRole(role);
    if (weaverId) {
      setActiveWeaverId(weaverId);
    }
    if (role === 'admin' || role === 'manager') {
      setActiveNav('dashboard');
    } else if (role === 'supplier') {
      setActiveNav('supplier_portal');
    } else if (role === 'customer') {
      setActiveNav('customer_catalog');
    } else {
      setActiveNav('dashboard');
    }
    setShowRoleMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-amber-800 hover:bg-amber-50"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div 
              onClick={() => setActiveNav('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-700 via-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform">
                <span className="text-xl">🧵</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-amber-950 font-serif">
                    HWMS
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                    ERP
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                  Handloom Weaver Management System
                </p>
              </div>
            </div>
          </div>

          {/* Center: Tenant Context Banner (For Weavers) */}
          {currentRole === 'weaver' && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50/80 border border-amber-200/70 text-xs text-amber-950">
              <Building2 className="w-3.5 h-3.5 text-amber-700" />
              <span className="font-semibold max-w-[240px] truncate">
                {currentWeaverProfile?.businessName}
              </span>
              <span className="text-amber-400">•</span>
              <span className="text-slate-600 text-[11px]">
                {currentWeaverProfile?.district}
              </span>
              {currentWeaverProfile?.verificationStatus === 'approved' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 rounded-full">
                  <Award className="w-3 h-3 text-emerald-600" /> GI Verified
                </span>
              )}
            </div>
          )}

          {/* Right Controls: Role Switcher, Language, Notifications */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
              title="Toggle English / தமிழ்"
            >
              <Globe className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-amber-800 hover:bg-amber-50 border border-slate-200/80 transition-colors shadow-2xs"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white ring-2 ring-white animate-pulse">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">Notifications</span>
                      {unreadNotifs.length > 0 && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                          {unreadNotifs.length} new
                        </span>
                      )}
                    </div>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-amber-700 hover:text-amber-900 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 6).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.linkTo) setActiveNav(notif.linkTo);
                            setShowNotifMenu(false);
                          }}
                          className={`p-3.5 hover:bg-amber-50/50 cursor-pointer transition-colors ${
                            !notif.read ? 'bg-amber-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {notif.type === 'warning' ? (
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            ) : notif.type === 'urgent' ? (
                              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            ) : (
                              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-900 truncate">
                                {notif.title}
                              </p>
                              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                                {notif.message}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {formatDate(notif.timestamp)}
                              </span>
                            </div>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Role & Workspace Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-xl border border-amber-900/20 bg-gradient-to-r from-amber-50 to-orange-50 hover:border-amber-400 text-xs font-semibold text-amber-950 transition-all shadow-xs"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline text-slate-500 font-normal">Role:</span>
                <span className="font-bold capitalize">
                  {currentRole === 'weaver' ? `Weaver (${activeWeaverId === 'wvr-001' ? 'Kanchi' : activeWeaverId === 'wvr-002' ? 'Salem' : 'Madurai'})` : currentRole}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-800" />
              </button>

              {/* Role Switcher Menu */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Role & Multi-Tenant Workspace
                    </p>
                  </div>

                  <div className="py-1">
                    {/* Weaver 1 */}
                    <button
                      onClick={() => handleRoleSelect('weaver', 'wvr-001')}
                      className={`w-full px-4 py-2 text-left text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${
                        currentRole === 'weaver' && activeWeaverId === 'wvr-001' ? 'bg-amber-50/80 font-bold text-amber-900' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <span>🧵 Murugan Weavers</span>
                          <span className="text-[10px] px-1 bg-emerald-100 text-emerald-800 rounded">Kanchi Silk</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Weaver Owner (5 Looms, Active)</p>
                      </div>
                      {currentRole === 'weaver' && activeWeaverId === 'wvr-001' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>

                    {/* Weaver 2 */}
                    <button
                      onClick={() => handleRoleSelect('weaver', 'wvr-002')}
                      className={`w-full px-4 py-2 text-left text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${
                        currentRole === 'weaver' && activeWeaverId === 'wvr-002' ? 'bg-amber-50/80 font-bold text-amber-900' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <span>🧵 Venkateshwara Looms</span>
                          <span className="text-[10px] px-1 bg-blue-100 text-blue-800 rounded">Salem Cotton</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Separate isolated workspace</p>
                      </div>
                      {currentRole === 'weaver' && activeWeaverId === 'wvr-002' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>

                    {/* Weaver 3 (Under Review) */}
                    <button
                      onClick={() => handleRoleSelect('weaver', 'wvr-003')}
                      className={`w-full px-4 py-2 text-left text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${
                        currentRole === 'weaver' && activeWeaverId === 'wvr-003' ? 'bg-amber-50/80 font-bold text-amber-900' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <span>🧵 Meenakshi Textiles</span>
                          <span className="text-[10px] px-1 bg-amber-100 text-amber-800 rounded">Under Review</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Self-registered onboarding weaver</p>
                      </div>
                      {currentRole === 'weaver' && activeWeaverId === 'wvr-003' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    {/* Platform Manager */}
                    <button
                      onClick={() => handleRoleSelect('manager')}
                      className={`w-full px-4 py-2 text-left text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${
                        currentRole === 'manager' ? 'bg-amber-50/80 font-bold text-amber-900' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <span>🛡️ Platform Manager</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Verifies weavers & approves onboarding</p>
                      </div>
                      {currentRole === 'manager' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>

                    {/* Platform Admin */}
                    <button
                      onClick={() => handleRoleSelect('admin')}
                      className={`w-full px-4 py-2 text-left text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${
                        currentRole === 'admin' ? 'bg-amber-50/80 font-bold text-amber-900' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <span>👑 Platform Administrator</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Users, system settings & global reports</p>
                      </div>
                      {currentRole === 'admin' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>

                    {/* Supplier */}
                    <button
                      onClick={() => handleRoleSelect('supplier')}
                      className={`w-full px-4 py-2 text-left text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${
                        currentRole === 'supplier' ? 'bg-amber-50/80 font-bold text-amber-900' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <span>📦 Raw Material Supplier</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Sri Lakshmi Silk & Yarn Mills portal</p>
                      </div>
                      {currentRole === 'supplier' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>

                    {/* Customer */}
                    <button
                      onClick={() => handleRoleSelect('customer')}
                      className={`w-full px-4 py-2 text-left text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${
                        currentRole === 'customer' ? 'bg-amber-50/80 font-bold text-amber-900' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <span>🛍️ Public Handloom Showcase</span>
                          <span className="text-[9px] px-1 bg-purple-100 text-purple-800 rounded">Phase 2</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Customer product catalogue</p>
                      </div>
                      {currentRole === 'customer' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
