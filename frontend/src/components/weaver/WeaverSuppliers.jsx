import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  Plus,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Modal } from '../common/Modal';

export const WeaverSuppliers = () => {
  const { suppliers, setActiveNav } = useApp();
  const [activeModal, setActiveModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    district: '',
    gstNumber: '',
    materialsSupplied: '',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            Raw Material Suppliers Directory
          </h1>
          <p className="text-xs text-slate-500">
            Certified yarn spinning mills, pure gold zari manufacturers, and natural dye houses
          </p>
        </div>

        <button
          onClick={() => setActiveModal(true)}
          className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Add New Supplier</span>
        </button>
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map((sup) => (
          <div
            key={sup.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-amber-400 transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-slate-400">
                  {sup.id.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-slate-900 font-serif mt-0.5">
                  {sup.name}
                </h3>
                <p className="text-xs text-slate-500">{sup.businessName}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Balance Due</span>
                <span className={`text-sm font-extrabold font-serif ${sup.balanceDue > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {formatCurrency(sup.balanceDue)}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{sup.phone}</span>
                <span className="text-slate-300">•</span>
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{sup.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{sup.address}, {sup.district}</span>
              </div>
              {sup.gstNumber && (
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>GSTIN: {sup.gstNumber}</span>
                </div>
              )}
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Materials Supplied
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sup.materialsSupplied?.map((mat, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t flex justify-between items-center text-xs">
              <span className="text-slate-500">Quality Rating: ⭐ {sup.rating || '4.8'}/5.0</span>
              <button
                onClick={() => setActiveNav('materials')}
                className="text-amber-800 hover:text-amber-950 font-bold hover:underline"
              >
                Stock In From Supplier →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      <Modal
        isOpen={activeModal}
        onClose={() => setActiveModal(false)}
        title="Add Raw Material Supplier"
        subtitle="Maintain independent supplier records for yarn mills, dye houses, and zari traders"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setActiveModal(false);
          }}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="block font-bold text-slate-700 mb-1">Supplier Business Name *</label>
            <input
              type="text"
              placeholder="e.g. Salem Silk Spun Yarn Corporation"
              value={newSupplier.name}
              onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Person *</label>
              <input
                type="text"
                placeholder="e.g. K. Natarajan"
                value={newSupplier.contactPerson}
                onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone *</label>
              <input
                type="text"
                placeholder="+91 98421 XXXXX"
                value={newSupplier.phone}
                onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">District / City *</label>
              <input
                type="text"
                placeholder="e.g. Dharmapuri or Surat"
                value={newSupplier.district}
                onChange={(e) => setNewSupplier({ ...newSupplier, district: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">GST Number</label>
              <input
                type="text"
                placeholder="e.g. 33AABCL1234F1Z9"
                value={newSupplier.gstNumber}
                onChange={(e) => setNewSupplier({ ...newSupplier, gstNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setActiveModal(false)}
              className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-900 text-white font-bold hover:bg-amber-950"
            >
              Save Supplier
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
