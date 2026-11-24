import React, { useState } from 'react';
import { Upload, User } from 'lucide-react';
import { Modal } from '../common/Modal';

export const AddEditWeaverModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    village: 'Nallapatti',
    phone: '',
    gender: 'Female',
    address: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    setFormData({ name: '', village: 'Nallapatti', phone: '', gender: 'Female', address: '' });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Weaver"
      subtitle="Enter weaver artisan identification and contact details"
      maxWidth="max-w-2xl"
    >
      {/* Form matching Screen 4 layout */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
          {/* Left: Upload Photo Circle (matching Screen 4) */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
              <User className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold text-slate-700">Upload Photo</span>
            <span className="text-[10px] text-slate-400 mt-0.5">PNG or JPG up to 2MB</span>
          </div>

          {/* Right: Inputs (matching Screen 4) */}
          <div className="sm:col-span-8 space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. R. Selvi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Village *</label>
                <select
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                >
                  <option value="Nallapatti">Nallapatti</option>
                  <option value="Thingalur">Thingalur</option>
                  <option value="Erode">Erode</option>
                  <option value="Salem">Salem</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>
            </div>

            {/* Gender Radio Buttons matching Screen 4 */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Gender</label>
              <div className="flex items-center gap-4">
                {['Male', 'Female', 'Other'].map((g) => (
                  <label key={g} className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={() => setFormData({ ...formData, gender: g })}
                      className="text-[#1e5bbf] focus:ring-[#1e5bbf]"
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Address</label>
              <textarea
                placeholder="Enter address..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 h-16"
              />
            </div>
          </div>
        </div>

        {/* Buttons matching Screen 4 */}
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
