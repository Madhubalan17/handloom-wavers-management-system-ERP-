import React from 'react';
import { LogOut } from 'lucide-react';

export const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Blue Exit Arrow Icon inside container (matching Screen 12) */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-[#1e5bbf]">
          <LogOut className="w-8 h-8" />
        </div>

        {/* Title & Subtext */}
        <div className="space-y-1.5">
          <h3 className="text-xl font-extrabold text-slate-900 font-serif">
            Are you sure you want to logout?
          </h3>
          <p className="text-xs text-slate-500">
            You will be redirected to the login page.
          </p>
        </div>

        {/* Buttons: Cancel & Logout */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-32 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-32 py-2.5 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold text-xs transition-colors shadow-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
