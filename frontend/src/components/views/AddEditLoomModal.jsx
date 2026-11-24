import React, { useState } from 'react';
import { Modal } from '../common/Modal';

export const AddEditLoomModal = ({ isOpen, onClose, onSave }) => {
  const [loomNo, setLoomNo] = useState('L-006');
  const [type, setType] = useState('Handloom');
  const [status, setStatus] = useState('Active');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ loomNo, type, status });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Loom"
      subtitle="Register new handloom or power loom unit"
      maxWidth="max-w-2xl"
    >
      {/* Form matching Screen 6 layout */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
          {/* Left: Traditional Wooden Loom Image (matching Screen 6) */}
          <div className="sm:col-span-5 rounded-2xl overflow-hidden bg-amber-50/50 border border-amber-200/60 p-2 flex flex-col items-center justify-center">
            <svg
              viewBox="0 0 200 160"
              className="w-full h-36 rounded-xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="200" height="160" fill="#fef9f2" />
              <rect x="25" y="20" width="12" height="120" rx="2" fill="#8B4513" />
              <rect x="165" y="20" width="12" height="120" rx="2" fill="#8B4513" />
              <rect x="25" y="25" width="150" height="10" rx="1" fill="#A0522D" />
              <rect x="25" y="130" width="150" height="10" rx="1" fill="#A0522D" />
              {Array.from({ length: 18 }).map((_, i) => (
                <line key={i} x1={38 + i * 7} y1="35" x2={38 + i * 7} y2="120" stroke={i % 2 === 0 ? '#C88A2C' : '#9A2A2A'} strokeWidth="1.2" opacity="0.85" />
              ))}
              <rect x="30" y="75" width="140" height="14" rx="2" fill="#5C2E0B" />
              <polygon points="90,82 100,77 110,82 100,87" fill="#DAA520" />
            </svg>
            <span className="text-[10px] text-amber-800 font-bold mt-1">Traditional Wooden Loom</span>
          </div>

          {/* Right: Inputs (matching Screen 6) */}
          <div className="sm:col-span-7 space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Loom Number *</label>
              <input
                type="text"
                placeholder="e.g. L-006"
                value={loomNo}
                onChange={(e) => setLoomNo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                required
              >
                <option value="Handloom">Handloom</option>
                <option value="Power Loom">Power Loom</option>
                <option value="Pit Loom">Pit Loom with Jacquard</option>
                <option value="Frame Loom">Frame Loom</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Under Repair">Under Repair</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buttons matching Screen 6 */}
        <div className="flex justify-end gap-2 pt-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-[#1e5bbf] hover:bg-[#164799] text-white font-bold"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};
