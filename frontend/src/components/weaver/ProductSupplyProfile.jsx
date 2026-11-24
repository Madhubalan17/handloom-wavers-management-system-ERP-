import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  Award,
  ShieldCheck,
  Building2,
  Layers,
  Clock,
  CheckCircle2,
  Edit3,
  Save,
  CreditCard,
  QrCode,
  Info,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const ProductSupplyProfile = () => {
  const { currentWeaverProfile, updateWeaverProfile, platformSettings } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...currentWeaverProfile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateWeaverProfile(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleCategory = (cat) => {
    const exists = formData.productCategories?.includes(cat);
    const updated = exists 
      ? formData.productCategories.filter(c => c !== cat)
      : [...(formData.productCategories || []), cat];
    setFormData({ ...formData, productCategories: updated });
  };

  const toggleFabric = (fab) => {
    const exists = formData.fabricTypes?.includes(fab);
    const updated = exists 
      ? formData.fabricTypes.filter(f => f !== fab)
      : [...(formData.fabricTypes || []), fab];
    setFormData({ ...formData, fabricTypes: updated });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-700 to-orange-600 flex items-center justify-center text-white text-3xl shadow-lg shrink-0">
            🧵
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
                {currentWeaverProfile?.businessName}
              </h1>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                currentWeaverProfile?.verificationStatus === 'approved' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {currentWeaverProfile?.verificationStatus?.toUpperCase() || 'ACTIVE'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Owner: {currentWeaverProfile?.ownerName} • Contact: {currentWeaverProfile?.contactNumber} • {currentWeaverProfile?.district}, {currentWeaverProfile?.state}
            </p>
            <p className="text-[11px] text-amber-900/80 font-medium mt-1">
              Co-op Reg #: {currentWeaverProfile?.coopRegNo || 'TN/HL-REG'} • Experience: {currentWeaverProfile?.experienceYears} Years
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-600 animate-fade-in flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Saved!
            </span>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-300" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Supply Profile'}</span>
          </button>
        </div>
      </div>

      {/* Editing Form or Read-only Display */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 font-serif border-b pb-2">
            Update Product Supply Profile & Terms
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Business / Weaving Unit Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Owner Name</label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Production Capacity (Pieces)</label>
              <input
                type="number"
                value={formData.monthlyCapacityPieces}
                onChange={(e) => setFormData({ ...formData, monthlyCapacityPieces: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Order Quantity (MOQ)</label>
              <input
                type="number"
                value={formData.minimumOrderQuantity}
                onChange={(e) => setFormData({ ...formData, minimumOrderQuantity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Standard Lead Time (Days)</label>
              <input
                type="number"
                value={formData.leadTimeDays}
                onChange={(e) => setFormData({ ...formData, leadTimeDays: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">UPI ID for Direct Payments</label>
              <input
                type="text"
                value={formData.bankDetails?.upiId || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  bankDetails: { ...formData.bankDetails, upiId: e.target.value } 
                })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-600"
              />
            </div>
          </div>

          {/* Product Categories Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Products Supplied (Categories)</label>
            <div className="flex flex-wrap gap-2">
              {platformSettings.productCategories.map((cat) => {
                const isSelected = formData.productCategories?.includes(cat);
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected 
                        ? 'bg-amber-900 text-white border-amber-900 shadow-xs' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fabric Types Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Fabric Specialties</label>
            <div className="flex flex-wrap gap-2">
              {platformSettings.fabricTypes.map((fab) => {
                const isSelected = formData.fabricTypes?.includes(fab);
                return (
                  <button
                    type="button"
                    key={fab}
                    onClick={() => toggleFabric(fab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected 
                        ? 'bg-orange-800 text-white border-orange-800 shadow-xs' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{fab}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-900 text-white text-xs font-bold hover:bg-amber-950 flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      ) : (
        /* Read-Only Grid Display */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Product Categories & Fabrics */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-800" />
              <h3 className="text-sm font-bold text-slate-900 font-serif">
                Declared Products & Fabrics
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Product Categories
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {currentWeaverProfile?.productCategories?.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200/80"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Fabrics & Materials
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {currentWeaverProfile?.fabricTypes?.map((fab) => (
                    <span
                      key={fab}
                      className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-950 text-xs font-semibold border border-orange-200/80"
                    >
                      {fab}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Signature Weave Styles
                </span>
                <div className="space-y-1 mt-1.5">
                  {currentWeaverProfile?.designStyles?.map((style) => (
                    <div key={style} className="text-xs text-slate-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      <span>{style}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Production Capacity & Supply Terms */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-800" />
              <h3 className="text-sm font-bold text-slate-900 font-serif">
                Capacity & Supply Terms
              </h3>
            </div>

            <div className="space-y-3 divide-y divide-slate-100">
              <div className="pt-2 first:pt-0 flex justify-between items-center text-xs">
                <span className="text-slate-500">Monthly Capacity</span>
                <span className="font-bold text-slate-900">{currentWeaverProfile?.monthlyCapacityPieces} pieces</span>
              </div>
              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-slate-500">Minimum Order Qty (MOQ)</span>
                <span className="font-bold text-slate-900">{currentWeaverProfile?.minimumOrderQuantity} pieces</span>
              </div>
              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-slate-500">Standard Lead Time</span>
                <span className="font-bold text-slate-900">{currentWeaverProfile?.leadTimeDays} days</span>
              </div>
              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-slate-500">Bulk Orders Accepted</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${currentWeaverProfile?.acceptsBulkOrders ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                  {currentWeaverProfile?.acceptsBulkOrders ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-slate-500">Custom Weave Orders</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${currentWeaverProfile?.acceptsCustomOrders ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                  {currentWeaverProfile?.acceptsCustomOrders ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Certifications & Secure Bank / UPI */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900 font-serif">
                GI Tags & Secure Banking
              </h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Government Certifications
                </span>
                {currentWeaverProfile?.certifications?.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/70 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-emerald-950">{cert.name}</p>
                      <p className="text-[10px] text-emerald-700 font-mono">Reg: {cert.tagId}</p>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentWeaverProfile?.bankDetails?.bankName}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  A/C: {currentWeaverProfile?.bankDetails?.accountNumber} ({currentWeaverProfile?.bankDetails?.ifscCode})
                </p>
                <div className="flex items-center gap-1 pt-1 text-[11px] text-amber-900 font-semibold">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>UPI: {currentWeaverProfile?.bankDetails?.upiId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
