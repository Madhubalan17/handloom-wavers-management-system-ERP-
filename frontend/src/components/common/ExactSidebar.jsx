import React from 'react';
import {
  LayoutDashboard,
  Users,
  Cpu,
  Package,
  TrendingUp,
  Wallet,
  FileSpreadsheet,
  Settings,
  LogOut,
  X,
} from 'lucide-react';

export const ExactSidebar = ({ activeTab, onSelectTab, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'weavers', label: 'Weaver Management', icon: Users },
    { id: 'looms', label: 'Loom Management', icon: Cpu },
    { id: 'stock', label: 'Yarn & Stock', icon: Package },
    { id: 'production', label: 'Production', icon: TrendingUp },
    { id: 'salary', label: 'Salary Management', icon: Wallet },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#132036] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Top Logo Section (Matching Screenshot) */}
          <div className="p-5 flex flex-col items-center text-center border-b border-slate-700/50 relative">
            <button
              onClick={onClose}
              className="lg:hidden absolute top-3 right-3 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Golden Handloom Loom Icon */}
            <div className="w-16 h-12 flex items-center justify-center mb-1">
              <svg
                viewBox="0 0 100 80"
                className="w-full h-full text-amber-400 drop-shadow-md"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Traditional Loom Structure */}
                <rect x="10" y="10" width="80" height="60" rx="3" stroke="#f59e0b" strokeWidth="5" />
                <line x1="25" y1="10" x2="25" y2="70" stroke="#fbbf24" strokeWidth="3" />
                <line x1="75" y1="10" x2="75" y2="70" stroke="#fbbf24" strokeWidth="3" />
                {/* Warp Threads */}
                <line x1="25" y1="30" x2="75" y2="30" stroke="#fde68a" strokeWidth="2" strokeDasharray="3 2" />
                <line x1="25" y1="40" x2="75" y2="40" stroke="#fde68a" strokeWidth="2" strokeDasharray="3 2" />
                <line x1="25" y1="50" x2="75" y2="50" stroke="#fde68a" strokeWidth="2" strokeDasharray="3 2" />
                {/* Shuttle in Center */}
                <ellipse cx="50" cy="40" rx="16" ry="6" fill="#d97706" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="50" cy="40" r="2.5" fill="#fef3c7" />
                {/* Top/Bottom Roller Beams */}
                <line x1="10" y1="20" x2="90" y2="20" stroke="#b45309" strokeWidth="4" />
                <line x1="10" y1="60" x2="90" y2="60" stroke="#b45309" strokeWidth="4" />
              </svg>
            </div>

            <h1 className="font-bold text-sm text-white tracking-wide leading-tight">
              Handloom Weavers
            </h1>
            <p className="text-[11px] text-slate-300 font-normal">
              Management System
            </p>
          </div>

          {/* Menu Items List */}
          <nav className="p-3 space-y-1 mt-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              // If currently in 'add_weaver_page', highlight 'weavers' tab
              const isActive =
                activeTab === item.id ||
                (activeTab === 'add_weaver_page' && item.id === 'weavers');

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#1e5bbf] text-white shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}

            {/* Logout Item (Red text as in reference mockup) */}
            <button
              onClick={() => {
                onSelectTab('logout');
                if (onClose) onClose();
              }}
              className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 transition-all mt-4"
            >
              <LogOut className="w-4 h-4 shrink-0 text-rose-500" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Bottom Handloom Charkha & Motif (Matching Reference Screenshot) */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0f1a2c] flex flex-col items-center">
          {/* Traditional Charkha & Handloom Sketch in Gold */}
          <div className="w-full h-14 flex items-center justify-center opacity-85 mb-1.5">
            <svg
              viewBox="0 0 160 50"
              className="w-full h-full text-amber-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Spinning Wheel (Charkha) on Right */}
              <circle cx="125" cy="25" r="16" stroke="#f59e0b" strokeWidth="1.8" />
              <circle cx="125" cy="25" r="3" fill="#fbbf24" />
              {/* Spokes */}
              <line x1="125" y1="9" x2="125" y2="41" stroke="#f59e0b" strokeWidth="1" />
              <line x1="109" y1="25" x2="141" y2="25" stroke="#f59e0b" strokeWidth="1" />
              <line x1="114" y1="14" x2="136" y2="36" stroke="#f59e0b" strokeWidth="1" />
              <line x1="114" y1="36" x2="136" y2="14" stroke="#f59e0b" strokeWidth="1" />
              {/* Charkha Stand Base */}
              <line x1="95" y1="43" x2="150" y2="43" stroke="#b45309" strokeWidth="2.5" />
              <line x1="125" y1="25" x2="125" y2="43" stroke="#b45309" strokeWidth="2" />
              {/* Spindle Post on Left */}
              <line x1="98" y1="20" x2="98" y2="43" stroke="#b45309" strokeWidth="2" />
              <line x1="92" y1="22" x2="104" y2="22" stroke="#fbbf24" strokeWidth="1.5" />
              <line x1="125" y1="25" x2="98" y2="22" stroke="#fde68a" strokeWidth="1" strokeDasharray="2 1" />

              {/* Handloom Loom Shuttle & Frame on Left */}
              <rect x="25" y="10" width="45" height="30" rx="2" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="33" y1="10" x2="33" y2="40" stroke="#d97706" strokeWidth="1" />
              <line x1="62" y1="10" x2="62" y2="40" stroke="#d97706" strokeWidth="1" />
              <line x1="20" y1="43" x2="75" y2="43" stroke="#b45309" strokeWidth="2.5" />
              {/* Warp & Weft Threads */}
              <line x1="33" y1="20" x2="62" y2="20" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="33" y1="30" x2="62" y2="30" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 2" />
              {/* Mini Shuttle */}
              <ellipse cx="48" cy="25" rx="8" ry="3" fill="#d97706" stroke="#f59e0b" strokeWidth="1" />
            </svg>
          </div>

          {/* Traditional Wave Pattern Border */}
          <div className="w-full h-4 flex items-center justify-center opacity-60 mb-2">
            <svg viewBox="0 0 200 16" className="w-full h-full text-amber-500" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M0 8 Q 10 0, 20 8 T 40 8 T 60 8 T 80 8 T 100 8 T 120 8 T 140 8 T 160 8 T 180 8 T 200 8" />
              <path d="M0 12 Q 10 4, 20 12 T 40 12 T 60 12 T 80 12 T 100 12 T 120 12 T 140 12 T 160 12 T 180 12 T 200 12" />
            </svg>
          </div>

          <p className="text-[11px] font-serif italic text-amber-400 text-center leading-snug">
            Support Our Weavers...<br />
            Promote Handloom...
          </p>
        </div>
      </aside>
    </>
  );
};
