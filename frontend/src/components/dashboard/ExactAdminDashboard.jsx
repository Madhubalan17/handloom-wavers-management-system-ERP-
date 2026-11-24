import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Cpu,
  Package,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  Zap,
  Plus,
  CheckCircle2,
  ChevronDown,
  Layers,
  ArrowRight,
  User,
  ExternalLink,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ExactAdminDashboard = ({ onOpenModal, onNavigate }) => {
  const { setActiveNav } = useApp();
  const [selectedMonthRange, setSelectedMonthRange] = useState('This Month');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Line Chart Data (Monthly Production Overview matching the screenshot)
  const productionData = [
    { month: 'Jan', value: 2000, label: '2,000 mtrs' },
    { month: 'Feb', value: 3100, label: '3,100 mtrs' },
    { month: 'Mar', value: 5800, label: '5,800 mtrs' },
    { month: 'Apr', value: 4000, label: '4,000 mtrs' },
    { month: 'May', value: 4600, label: '4,600 mtrs' },
    { month: 'Jun', value: 4900, label: '4,900 mtrs' },
    { month: 'Jul', value: 6200, label: '6,200 mtrs' },
    { month: 'Aug', value: 7500, label: '7,500 mtrs' },
    { month: 'Sep', value: 6200, label: '6,200 mtrs' },
    { month: 'Oct', value: 6800, label: '6,800 mtrs' },
    { month: 'Nov', value: 7200, label: '7,200 mtrs' },
    { month: 'Dec', value: 8750, label: '8,750 mtrs' },
  ];

  // SVG Chart Dimensions
  const chartWidth = 650;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 25;
  const effectiveWidth = chartWidth - paddingX * 2;
  const effectiveHeight = chartHeight - paddingY * 2;
  const maxY = 10000;

  // Compute SVG Points
  const points = productionData.map((d, i) => {
    const x = paddingX + (i / (productionData.length - 1)) * effectiveWidth;
    const y = chartHeight - paddingY - (d.value / maxY) * effectiveHeight;
    return { x, y, ...d };
  });

  // Smooth curve path command
  const pathD = points.reduce((acc, p, i, a) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = a[i - 1];
    const cp1x = prev.x + (p.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (p.x - prev.x) / 2;
    const cp2y = p.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p.x} ${p.y}`;
  }, '');

  // Gradient area closed path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  // Recent Registrations from screenshot
  const recentRegistrations = [
    { id: 1, name: 'R. Selvi', village: 'Nallapatti', date: '23 Nov 2026' },
    { id: 2, name: 'M. Kumar', village: 'Thingalur', date: '22 Nov 2026' },
    { id: 3, name: 'P. Lakshmi', village: 'Erode', date: '21 Nov 2026' },
  ];

  // Latest activities from screenshot
  const latestActivities = [
    {
      id: 1,
      type: 'user',
      title: 'New weaver registered - R. Selvi',
      time: '2 hours ago',
      color: 'bg-emerald-500 text-white',
      symbol: '+',
    },
    {
      id: 2,
      type: 'stock',
      title: 'Yarn stock updated - 50 kg',
      time: '3 hours ago',
      color: 'bg-blue-500 text-white',
      symbol: '📦',
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment processed - ₹15,000',
      time: '5 hours ago',
      color: 'bg-purple-600 text-white',
      symbol: '✓',
    },
  ];

  return (
    <div className="space-y-5">
      {/* 1. Welcome Hero Banner (Matching the exact look from the screenshot) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#fbf8f3] via-[#f7f2e9] to-[#eddcc7] border border-amber-200/70 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center min-h-[160px]">
          {/* Left: Artisan Weaver Line Illustration */}
          <div className="hidden sm:flex md:col-span-3 items-center justify-center p-3 opacity-80">
            <svg
              className="w-36 h-36 text-amber-900"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Traditional Weaver Sketch Stylization */}
              <circle cx="85" cy="55" r="16" stroke="#854d0e" strokeWidth="3" />
              <path d="M75 50 Q85 45 95 50" stroke="#854d0e" strokeWidth="2.5" />
              <path d="M85 71 Q70 95 65 140" stroke="#854d0e" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M85 71 Q100 95 105 135" stroke="#854d0e" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M65 140 L45 160" stroke="#854d0e" strokeWidth="4" strokeLinecap="round" />
              <path d="M105 135 L125 155" stroke="#854d0e" strokeWidth="4" strokeLinecap="round" />
              <path d="M78 88 L125 105 L150 95" stroke="#854d0e" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M72 98 L115 120" stroke="#854d0e" strokeWidth="3" strokeLinecap="round" />
              {/* Loom Bench & Shuttle */}
              <rect x="35" y="150" width="130" height="12" rx="3" fill="#ca8a04" opacity="0.4" stroke="#854d0e" strokeWidth="2.5" />
              <line x1="45" y1="162" x2="45" y2="185" stroke="#854d0e" strokeWidth="4" strokeLinecap="round" />
              <line x1="155" y1="162" x2="155" y2="185" stroke="#854d0e" strokeWidth="4" strokeLinecap="round" />
              <line x1="120" y1="70" x2="120" y2="140" stroke="#854d0e" strokeWidth="3" />
              <line x1="145" y1="60" x2="145" y2="150" stroke="#854d0e" strokeWidth="3" />
              <path d="M120 100 L145 95" stroke="#854d0e" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M120 110 L145 105" stroke="#854d0e" strokeWidth="2" strokeDasharray="3 3" />
              {/* Thread spools */}
              <circle cx="160" cy="142" r="6" fill="#854d0e" />
              <circle cx="172" cy="142" r="5" fill="#a16207" />
            </svg>
          </div>

          {/* Center: Welcome Text */}
          <div className="p-6 md:p-4 md:col-span-5 space-y-1.5 text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
              Welcome Back, Admin!
            </h1>
            <p className="text-sm font-semibold text-slate-800">
              Handloom Weavers Management System
            </p>
            <div className="pt-1">
              <span className="text-xs font-medium text-amber-900/90 tracking-wide inline-block border-b-2 border-amber-600/80 pb-0.5">
                Together for a Stronger Handloom Community
              </span>
            </div>
          </div>

          {/* Right: Vibrant Loom Photo Header */}
          <div className="hidden md:block md:col-span-4 h-full relative overflow-hidden rounded-r-2xl">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80"
              alt="Traditional Handloom with Silk Weave"
              className="w-full h-44 object-cover object-center shadow-inner"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#f7f2e9]/90" />
          </div>
        </div>
      </div>

      {/* 2. Top 4 KPI Cards (Matching exact colors and layout from the screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Weavers */}
        <div 
          onClick={() => onNavigate('weavers')}
          className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs hover:shadow-md transition-all border-l-4 border-l-blue-600 flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-full bg-blue-100/90 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
            <Users className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-600 block">Total Weavers</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-serif tracking-tight mt-0.5">
              1,248
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-0.5">
              <span>↑ 5%</span>
              <span className="text-slate-400 font-normal">from last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Looms */}
        <div 
          onClick={() => onNavigate('looms')}
          className="bg-white rounded-xl border border-emerald-300/80 p-4 shadow-xs hover:shadow-md transition-all flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-700 shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
            </svg>
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-600 block">Active Looms</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-serif tracking-tight mt-0.5">
              350
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-0.5">
              <span>↑ 3%</span>
              <span className="text-slate-400 font-normal">from last month</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Production */}
        <div 
          onClick={() => onNavigate('production')}
          className="bg-white rounded-xl border border-purple-300/80 p-4 shadow-xs hover:shadow-md transition-all flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 shrink-0 group-hover:scale-105 transition-transform">
            {/* Yarn Spool Icon */}
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 3.79 5 6v12c0 2.21 3.13 4 7 4s7-1.79 7-4V6c0-2.21-3.13-4-7-4zm0 2c2.76 0 5 1.12 5 2.5S14.76 9 12 9s-5-1.12-5-2.5S9.24 4 12 4zm0 16c-2.76 0-5-1.12-5-2.5V11.3c1.37.76 3.08 1.2 5 1.2s3.63-.44 5-1.2v6.2c0 1.38-2.24 2.5-5 2.5z"/>
            </svg>
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-600 block">Total Production</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-serif tracking-tight mt-0.5">
              8,750 mtrs
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-0.5">
              <span>↑ 8%</span>
              <span className="text-slate-400 font-normal">from last month</span>
            </div>
          </div>
        </div>

        {/* Card 4: Pending Payments */}
        <div 
          onClick={() => onNavigate('salary')}
          className="bg-white rounded-xl border border-orange-300/80 p-4 shadow-xs hover:shadow-md transition-all flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 group-hover:scale-105 transition-transform">
            <Wallet className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-600 block">Pending Payments</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-serif tracking-tight mt-0.5">
              ₹1,25,000
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 mt-0.5">
              <span>↓ 2%</span>
              <span className="text-slate-400 font-normal">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Charts Row: Monthly Production Line Chart + Yarn Stock Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Chart: Monthly Production Overview (7 cols / ~65%) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Monthly Production Overview
              </h3>
            </div>
            <div className="relative">
              <button className="flex items-center gap-1 text-xs font-medium text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100">
                <span>{selectedMonthRange}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-56 select-none"
            >
              <defs>
                <linearGradient id="blueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines & Y Axis labels */}
              {[10000, 8000, 6000, 4000, 2000, 0].map((val) => {
                const y = chartHeight - paddingY - (val / maxY) * effectiveHeight;
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill="#94a3b8"
                      fontFamily="sans-serif"
                    >
                      {val === 0 ? '0' : `${val / 1000}k`}
                    </text>
                  </g>
                );
              })}

              {/* Area Fill */}
              <path d={areaD} fill="url(#blueAreaGrad)" />

              {/* Line Curve */}
              <path
                d={pathD}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dots for each Month */}
              {points.map((p, idx) => (
                <g key={idx} className="cursor-pointer">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint === idx ? '6' : '3.5'}
                    fill="#2563eb"
                    stroke="#ffffff"
                    strokeWidth="2"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Month Label on X Axis */}
                  <text
                    x={p.x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    fontSize="9.5"
                    fill="#64748b"
                    fontFamily="sans-serif"
                    fontWeight="500"
                  >
                    {p.month}
                  </text>
                </g>
              ))}

              {/* Hover Tooltip */}
              {hoveredPoint !== null && (
                <g>
                  <rect
                    x={points[hoveredPoint].x - 42}
                    y={points[hoveredPoint].y - 32}
                    width="84"
                    height="22"
                    rx="6"
                    fill="#1e293b"
                  />
                  <text
                    x={points[hoveredPoint].x}
                    y={points[hoveredPoint].y - 18}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9.5"
                    fontWeight="bold"
                  >
                    {points[hoveredPoint].month}: {points[hoveredPoint].label}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Right Chart: Yarn Stock Overview Donut Chart (4 cols / ~35%) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Yarn Stock Overview
            </h3>
          </div>

          <div className="flex items-center justify-center py-2">
            {/* SVG Donut Chart with center text */}
            <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="14"
                />
                {/* 1. Cotton Yarn: 72% (circumference ~ 238.76, 72% = 171.9) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="14"
                  strokeDasharray="171.9 238.76"
                  strokeDashoffset="0"
                />
                {/* 2. Silk Yarn: 18% (18% of 238.76 = 42.98) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="14"
                  strokeDasharray="42.98 238.76"
                  strokeDashoffset="-171.9"
                />
                {/* 3. Others: 10% (10% of 238.76 = 23.88) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="14"
                  strokeDasharray="23.88 238.76"
                  strokeDashoffset="-214.88"
                />
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900 font-serif leading-none">
                  72%
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                  In Stock
                </span>
              </div>
            </div>

            {/* Legend on right */}
            <div className="space-y-2.5 ml-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                <span className="text-slate-700">Cotton Yarn <span className="text-slate-400 font-normal">(72%)</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-700">Silk Yarn <span className="text-slate-400 font-normal">(18%)</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-700">Others <span className="text-slate-400 font-normal">(10%)</span></span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500">
              Total Yarn Stored: <strong>2,450 kg</strong> in warehouse
            </span>
          </div>
        </div>
      </div>

      {/* 4. Bottom 3 Widgets (Matching exact layout from screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Recent Weaver Registrations (4 cols) */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs flex flex-col justify-between">
          <div>
            {/* Dark Navy Header Bar */}
            <div className="bg-[#152238] px-4 py-3 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8 2 5 4 5 6v12c0 2 3 4 7 4s7-2 7-4V6c0-2-3-4-7-4z"/>
                </svg>
                <h3 className="text-xs font-bold text-white">
                  Recent Weaver Registrations
                </h3>
              </div>
              <button
                onClick={() => onNavigate('weavers')}
                className="text-[11px] text-slate-300 hover:text-white font-medium flex items-center gap-1"
              >
                <span>View All</span>
                <span>→</span>
              </button>
            </div>

            {/* Table */}
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Village</th>
                  <th className="py-2.5 px-3">Registered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRegistrations.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 font-mono">{row.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{row.name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{row.village}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Middle: Latest Activities (4 cols) */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs flex flex-col justify-between">
          <div>
            {/* Dark Navy Header Bar */}
            <div className="bg-[#152238] px-4 py-3 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white">
                  Latest Activities
                </h3>
              </div>
              <button
                onClick={() => onNavigate('reports')}
                className="text-[11px] text-slate-300 hover:text-white font-medium flex items-center gap-1"
              >
                <span>View All</span>
                <span>→</span>
              </button>
            </div>

            {/* Activities List */}
            <div className="p-3 divide-y divide-slate-100 space-y-2">
              {latestActivities.map((act) => (
                <div key={act.id} className="flex items-center justify-between pt-2 first:pt-0">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${act.color}`}>
                      {act.symbol}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {act.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0 ml-2 font-mono">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Quick Actions (4 cols) */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs flex flex-col justify-between">
          <div>
            {/* Dark Navy Header Bar */}
            <div className="bg-[#152238] px-4 py-3 text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white">
                Quick Actions
              </h3>
            </div>

            {/* 4 Colorful Action Buttons (2x2 grid matching screenshot) */}
            <div className="p-4 grid grid-cols-2 gap-3">
              {/* Add Weaver */}
              <button
                onClick={() => onOpenModal('add_weaver')}
                className="py-3 px-3 rounded-xl bg-[#1e5bbf] hover:bg-[#194aa0] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.02]"
              >
                <Users className="w-4 h-4" />
                <span>Add Weaver</span>
              </button>

              {/* Add Loom */}
              <button
                onClick={() => onOpenModal('add_loom')}
                className="py-3 px-3 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.02]"
              >
                <Cpu className="w-4 h-4" />
                <span>Add Loom</span>
              </button>

              {/* Update Stock */}
              <button
                onClick={() => onOpenModal('update_stock')}
                className="py-3 px-3 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.02]"
              >
                <Package className="w-4 h-4" />
                <span>Update Stock</span>
              </button>

              {/* View Reports */}
              <button
                onClick={() => onNavigate('reports')}
                className="py-3 px-3 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.02]"
              >
                <TrendingUp className="w-4 h-4" />
                <span>View Reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
