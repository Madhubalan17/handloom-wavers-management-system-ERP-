import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Globe,
  User,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Calendar,
} from 'lucide-react';

export const ExactHeader = ({ onToggleSidebar, onSearch, searchQuery, onOpenLogoutModal }) => {
  const { currentUser, users, switchRole, isBackendConnected } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-2xs h-16 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Hamburger & Search Input (Screen 2) */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search bar matching screenshot: rounded-full border with search icon */}
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-hidden focus:border-[#1e5bbf] transition-all text-slate-700"
          />
        </div>
      </div>

      {/* Right: Backend API status, Date badge, Notifications & User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Backend API status badge */}
        <div
          title={isBackendConnected ? "Connected to Django REST Backend & PostgreSQL Database" : "Using Local Offline Storage (Backend Standby)"}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
            isBackendConnected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
          <span>{isBackendConnected ? 'Django API Live' : 'Local Mode'}</span>
        </div>

        {/* Date badge matching Screen 2 top right */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200/70">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Today: 24 Nov 2026</span>
        </div>

        {/* Notification Bell with Red Badge "2" */}
        <div className="relative">
          <button
            className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
              2
            </span>
          </button>
        </div>

        {/* User Profile Pill matching screenshot */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={currentUser?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
            />
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-800 block leading-tight">
                {currentUser?.role || 'Admin'}
              </span>
              <span className="text-[10px] text-slate-400 block leading-none">
                {currentUser?.name?.split(' ')[0]}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile & Role Switcher Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-xs">
              <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                <p className="font-bold text-slate-900">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">{currentUser?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-900 text-white">
                  Active Role: {currentUser?.role}
                </span>
              </div>

              <div className="p-2 border-b border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  Switch Active Role (Demo)
                </p>
                <div className="space-y-1">
                  {['Admin', 'Manager', 'Staff', 'Storekeeper', 'Weaver'].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-medium flex items-center justify-between transition-colors ${
                        currentUser?.role === r
                          ? 'bg-blue-50 text-[#1e5bbf] font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{r} Account</span>
                      {currentUser?.role === r && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenLogoutModal();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
