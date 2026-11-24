import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LoginPage = () => {
  const { login, switchRole } = useAuth();
  const [email, setEmail] = useState('admin@handloom.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (!res || !res.success) {
      setError(res?.error || 'Invalid credentials.');
    } else {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleQuickLogin = async (roleKey, credEmail, credPass) => {
    setEmail(credEmail);
    setPassword(credPass);
    const res = await login(credEmail, credPass);
    if (res && res.success) {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900/90 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px] border border-slate-200">
        
        {/* Left Side: Loom Hero & Golden Branding (Screens 1 & 13) */}
        <div className="md:col-span-6 relative bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 p-8 sm:p-10 flex flex-col justify-between text-white overflow-hidden">
          {/* Background image overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-overlay"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-transparent" />

          {/* Top Logo */}
          <div className="relative z-10 space-y-3">
            <div className="w-16 h-12 flex items-center justify-center">
              <svg
                viewBox="0 0 100 80"
                className="w-full h-full text-amber-400 drop-shadow-md"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="10" y="10" width="80" height="60" rx="3" stroke="#f59e0b" strokeWidth="5" />
                <line x1="25" y1="10" x2="25" y2="70" stroke="#fbbf24" strokeWidth="3" />
                <line x1="75" y1="10" x2="75" y2="70" stroke="#fbbf24" strokeWidth="3" />
                <line x1="25" y1="30" x2="75" y2="30" stroke="#fde68a" strokeWidth="2" strokeDasharray="3 2" />
                <line x1="25" y1="40" x2="75" y2="40" stroke="#fde68a" strokeWidth="2" strokeDasharray="3 2" />
                <line x1="25" y1="50" x2="75" y2="50" stroke="#fde68a" strokeWidth="2" strokeDasharray="3 2" />
                <ellipse cx="50" cy="40" rx="16" ry="6" fill="#d97706" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="50" cy="40" r="2.5" fill="#fef3c7" />
                <line x1="10" y1="20" x2="90" y2="20" stroke="#b45309" strokeWidth="4" />
                <line x1="10" y1="60" x2="90" y2="60" stroke="#b45309" strokeWidth="4" />
              </svg>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif">
              Handloom Weavers
            </h1>
            <p className="text-xs text-amber-200/90 font-medium">
              Management System
            </p>
          </div>

          {/* Slogan at Bottom Left */}
          <div className="relative z-10 pt-16">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-100">
              Preserve Tradition,
              <br />
              Empower Weavers
            </h2>
            <p className="text-xs text-slate-300 mt-2 max-w-xs leading-relaxed">
              Unified enterprise cloud management for handloom cooperatives, artisans, yarn depots, and looms.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form (Screens 1 & 13) */}
        <div className="md:col-span-6 p-8 sm:p-10 flex flex-col justify-center bg-white">
          <div className="max-w-sm w-full mx-auto space-y-6">
            {/* Header */}
            <div className="text-center md:text-left space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                Welcome Back!
              </h2>
              <p className="text-xs text-slate-500">
                Sign in to continue to Handloom Portal
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 animate-shake">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Username/Email Input */}
              <div className="space-y-1">
                <label className="block text-slate-700 font-semibold">
                  Username / Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] focus:ring-1 focus:ring-[#1e5bbf] text-slate-800 text-xs font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="block text-slate-700 font-semibold">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] focus:ring-1 focus:ring-[#1e5bbf] text-slate-800 text-xs font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#1e5bbf] focus:ring-[#1e5bbf]"
                  />
                  <span>Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to registered email or contact Administrator.')}
                  className="text-[#1e5bbf] hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#1e5bbf] hover:bg-[#164799] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Login Switcher */}
            <div className="pt-4 border-t border-slate-100 text-center space-y-2">
              <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-semibold">
                — or login with role credentials —
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {[
                  { role: 'Admin', email: 'admin@handloom.com', pass: 'admin123', bg: 'bg-slate-900 text-white' },
                  { role: 'Manager', email: 'manager@handloom.com', pass: 'manager123', bg: 'bg-emerald-700 text-white' },
                  { role: 'Staff', email: 'staff@handloom.com', pass: 'staff123', bg: 'bg-indigo-700 text-white' },
                  { role: 'Storekeeper', email: 'storekeeper@handloom.com', pass: 'store123', bg: 'bg-amber-700 text-white' },
                  { role: 'Weaver', email: 'weaver@handloom.com', pass: 'weaver123', bg: 'bg-blue-700 text-white' },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleQuickLogin(item.role, item.email, item.pass)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-transform hover:scale-105 shadow-2xs ${item.bg}`}
                  >
                    {item.role}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
