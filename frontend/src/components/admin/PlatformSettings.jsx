import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Plus,
  Save,
  CheckCircle2,
  Layers,
  Store,
  Percent,
  MapPin,
  Trash2,
} from 'lucide-react';

export const PlatformSettings = () => {
  const { platformSettings, setPlatformSettings } = useApp();
  const [settings, setSettings] = useState({ ...platformSettings });
  const [newCat, setNewCat] = useState('');
  const [newProdCat, setNewProdCat] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddMaterialCat = (e) => {
    e.preventDefault();
    if (newCat && !settings.materialCategories.includes(newCat)) {
      setSettings({
        ...settings,
        materialCategories: [...settings.materialCategories, newCat],
      });
      setNewCat('');
    }
  };

  const handleAddProductCat = (e) => {
    e.preventDefault();
    if (newProdCat && !settings.productCategories.includes(newProdCat)) {
      setSettings({
        ...settings,
        productCategories: [...settings.productCategories, newProdCat],
      });
      setNewProdCat('');
    }
  };

  const handleAddDistrict = (e) => {
    e.preventDefault();
    if (newDistrict && !settings.districtsSupported.includes(newDistrict)) {
      setSettings({
        ...settings,
        districtsSupported: [...settings.districtsSupported, newDistrict],
      });
      setNewDistrict('');
    }
  };

  const handleSaveAll = () => {
    setPlatformSettings(settings);
    setSuccessMessage('Platform master settings saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            Platform Master Settings
          </h1>
          <p className="text-xs text-slate-500">
            Configure system-wide categories, measurement units, GST slabs, and geographical weaving clusters
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
        >
          <Save className="w-4 h-4 text-amber-300" />
          <span>Save Master Configuration</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Categories */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-amber-800" />
            <h3 className="text-sm font-bold text-slate-900 font-serif">
              Finished Product Categories
            </h3>
          </div>

          <form onSubmit={handleAddProductCat} className="flex gap-2">
            <input
              type="text"
              placeholder="Add product category (e.g. Stole, Dupatta)"
              value={newProdCat}
              onChange={(e) => setNewProdCat(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-amber-900 text-white font-bold text-xs"
            >
              Add
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {settings.productCategories.map((cat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200"
              >
                <span>{cat}</span>
                <button
                  type="button"
                  onClick={() => setSettings({
                    ...settings,
                    productCategories: settings.productCategories.filter((_, i) => i !== idx)
                  })}
                  className="hover:text-rose-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Raw Material Categories */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-800" />
            <h3 className="text-sm font-bold text-slate-900 font-serif">
              Raw Material Categories
            </h3>
          </div>

          <form onSubmit={handleAddMaterialCat} className="flex gap-2">
            <input
              type="text"
              placeholder="Add raw material category (e.g. Mordants, Reed Spares)"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-amber-900 text-white font-bold text-xs"
            >
              Add
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {settings.materialCategories.map((cat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 text-orange-950 text-xs font-semibold border border-orange-200"
              >
                <span>{cat}</span>
                <button
                  type="button"
                  onClick={() => setSettings({
                    ...settings,
                    materialCategories: settings.materialCategories.filter((_, i) => i !== idx)
                  })}
                  className="hover:text-rose-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* GST Tax Slabs */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900 font-serif">
              GST Tax Slabs (India)
            </h3>
          </div>

          <div className="space-y-2">
            {settings.taxSlabs.map((slab, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900">{slab.name}</p>
                </div>
                <span className="font-extrabold text-emerald-800 text-sm font-serif">
                  {slab.rate}% GST
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Handloom Clusters & Districts */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-700" />
            <h3 className="text-sm font-bold text-slate-900 font-serif">
              Active Handloom Weaving Clusters & Districts
            </h3>
          </div>

          <form onSubmit={handleAddDistrict} className="flex gap-2">
            <input
              type="text"
              placeholder="Add cluster (e.g. Coimbatore, Arani)"
              value={newDistrict}
              onChange={(e) => setNewDistrict(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-amber-900 text-white font-bold text-xs"
            >
              Add
            </button>
          </form>

          <div className="flex flex-wrap gap-1.5">
            {settings.districtsSupported.map((d, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
