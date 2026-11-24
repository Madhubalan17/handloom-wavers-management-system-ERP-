import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Upload,
  Package,
  Layers,
  Sparkles,
  Camera,
  ShieldCheck,
  X,
  Save,
  CheckCircle2,
  Building,
  Tag,
  Scale,
  Calendar,
  AlertTriangle,
  Coins,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../../utils/formatters';

// High-Definition SVG illustration of Traditional Yarn Spools & Cones
const FallbackYarnSvg = () => (
  <svg
    viewBox="0 0 400 300"
    className="w-full h-full object-cover"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="400" height="300" fill="#faf7f2" />
    {/* Base shadow */}
    <ellipse cx="200" cy="245" rx="140" ry="25" fill="#e8dfd3" />

    {/* Center Silk Yarn Spool (Gold) */}
    <ellipse cx="200" cy="225" rx="55" ry="14" fill="#8B5A2B" />
    <path d="M145,225 C145,225 155,105 168,85 L232,85 C245,105 255,225 255,225 Z" fill="#DAA520" />
    <ellipse cx="200" cy="85" rx="32" ry="9" fill="#B8860B" />
    <ellipse cx="200" cy="85" rx="14" ry="4" fill="#4A2508" />
    {/* Thread winding details */}
    {Array.from({ length: 14 }).map((_, i) => (
      <path
        key={i}
        d={`M${148 + i * 2.8},${215 - i * 9} Q200,${222 - i * 9} ${252 - i * 2.8},${215 - i * 9}`}
        stroke="#C88A2C"
        strokeWidth="1.8"
        fill="none"
        opacity="0.75"
      />
    ))}

    {/* Left Cotton Yarn Cone (Cream White) */}
    <ellipse cx="115" cy="220" rx="42" ry="11" fill="#7A6855" />
    <path d="M73,220 C73,220 83,115 95,98 L135,98 C147,115 157,220 157,220 Z" fill="#F5F2EB" stroke="#DCD6C9" strokeWidth="1" />
    <ellipse cx="115" cy="98" rx="20" ry="6" fill="#DCD6C9" />
    <ellipse cx="115" cy="98" rx="9" ry="3" fill="#6B5B4D" />
    {Array.from({ length: 10 }).map((_, i) => (
      <path
        key={`c-${i}`}
        d={`M${76 + i * 2.2},${210 - i * 10} Q115,${216 - i * 10} ${154 - i * 2.2},${210 - i * 10}`}
        stroke="#D5CEBE"
        strokeWidth="1.5"
        fill="none"
      />
    ))}

    {/* Right Maroon Zari Thread Spool */}
    <ellipse cx="285" cy="220" rx="42" ry="11" fill="#4A1515" />
    <path d="M243,220 C243,220 253,115 265,98 L305,98 C317,115 327,220 327,220 Z" fill="#800000" />
    <ellipse cx="285" cy="98" rx="20" ry="6" fill="#A52A2A" />
    <ellipse cx="285" cy="98" rx="9" ry="3" fill="#3A0808" />
    {Array.from({ length: 10 }).map((_, i) => (
      <path
        key={`m-${i}`}
        d={`M${246 + i * 2.2},${210 - i * 10} Q285,${216 - i * 10} ${324 - i * 2.2},${210 - i * 10}`}
        stroke="#B22222"
        strokeWidth="1.5"
        fill="none"
      />
    ))}

    {/* Badge Overlay */}
    <rect x="120" y="260" width="160" height="24" rx="12" fill="#1e5bbf" opacity="0.92" />
    <text x="200" y="276" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
      Raw Material Inventory Depot
    </text>
  </svg>
);

export const sampleYarnPresets = [
  {
    label: 'Mulberry Raw Silk (20/22D)',
    yarnType: 'Mulberry Silk Yarn',
    material: '100% Pure Mulberry Silk',
    count: '20/22 Denier (2-Ply)',
    color: 'Natural Cream Silk (Shade #102)',
    unitPrice: 4200,
    quantity: 150,
    supplier: 'Karnataka Silk Marketing Board / Co-optex',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80',
  },
  {
    label: '80s Combed Organic Cotton',
    yarnType: 'Cotton Yarn',
    material: '100% Giza Long Staple Cotton',
    count: '80s Ne (Single Combed)',
    color: 'Bleached White (Shade #001)',
    unitPrice: 380,
    quantity: 500,
    supplier: 'Coimbatore Cotton Spinners Federation',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=500&auto=format&fit=crop&q=80',
  },
  {
    label: 'Pure Gold Zari Metallic Thread',
    yarnType: 'Zari Yarn',
    material: 'Electroplated Silver/Gold Filament',
    count: '120 Gauge High Tensile',
    color: 'Bridal Lustre Gold (Shade #Z01)',
    unitPrice: 6500,
    quantity: 60,
    supplier: 'Surat Zari Cooperative Corporation',
    image: '',
  },
  {
    label: 'Polyester Micro-Filament Blend',
    yarnType: 'Polyester',
    material: 'Polyester Staple Fiber Blend',
    count: '2/40s Spun Yarn',
    color: 'Navy Blue Dyed (Shade #NV44)',
    unitPrice: 220,
    quantity: 300,
    supplier: 'Tamil Nadu Textile Corporation Depot',
    image: '',
  },
];

export const AddYarnStockPage = ({
  onBack,
  onSaveStock,
  stockToEdit = null,
}) => {
  const isEditing = Boolean(stockToEdit);
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    yarnType: stockToEdit?.yarnType || stockToEdit?.yarn_type || 'Cotton Yarn',
    material: stockToEdit?.material || '100% Organic Cotton',
    count: stockToEdit?.count || '80s Ne Combed',
    colorCode: stockToEdit?.colorCode || 'Bleached White (Shade #001)',
    batchNo: stockToEdit?.batchNo || 'LOT-ERD-2026-904',
    quantity: stockToEdit?.quantity || stockToEdit?.quantity_kg || 250,
    minThreshold: stockToEdit?.minThreshold || 50,
    unitPrice: stockToEdit?.unitPrice || stockToEdit?.unit_price || 380,
    status: stockToEdit?.status || 'In Stock',
    supplier: stockToEdit?.supplier || 'Co-optex Yarn Depot - Erode',
    warehouseLocation: stockToEdit?.warehouseLocation || 'Rack B-14, Central Warehouse',
    receivedDate: stockToEdit?.receivedDate || '2026-11-24',
    remarks: stockToEdit?.remarks || 'Certified high-tensile warp yarn tested for defect-free jacquard weaving.',
    image: stockToEdit?.image || '',
  });

  const [imagePreview, setImagePreview] = useState(formData.image);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Image Upload Handlers
  const handleProcessFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setImagePreview(dataUrl);
      setImageLoadError(false);
      handleInputChange('image', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleResetImage = () => {
    setImagePreview('');
    setImageLoadError(false);
    handleInputChange('image', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const totalValue = (Number(formData.quantity) || 0) * (Number(formData.unitPrice) || 0);

  const validate = () => {
    const newErrors = {};
    if (!formData.yarnType.trim()) newErrors.yarnType = 'Yarn type is required';
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Please enter a valid stock quantity in Kg';
    }
    if (!formData.unitPrice || Number(formData.unitPrice) <= 0) {
      newErrors.unitPrice = 'Please enter unit cost per Kg';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
    });

    onSaveStock({
      ...formData,
      quantity_kg: Number(formData.quantity),
      unit_price: Number(formData.unitPrice),
      id: stockToEdit ? stockToEdit.id : undefined,
    });
  };

  return (
    <div className="space-y-6 font-sans max-w-[1300px] mx-auto pb-12">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-6">
        <div
          className="absolute inset-y-0 right-0 w-2/5 pointer-events-none opacity-25 mix-blend-multiply bg-cover bg-right"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80')`,
            maskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 90%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 90%)',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-1.5 h-12 bg-[#c88a2c] rounded-full shrink-0 mt-1" />
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-0.5">
                <button
                  type="button"
                  onClick={onBack}
                  className="hover:text-[#1e5bbf] transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Yarn & Stock
                </button>
                <span>/</span>
                <span className="text-[#1e5bbf]">
                  {isEditing ? 'Update Yarn Inventory' : 'Add New Yarn Consignment'}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-serif text-[#132036] tracking-tight">
                {isEditing ? `Update Stock: ${formData.yarnType}` : 'Add New Yarn Consignment'}
              </h1>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                {isEditing
                  ? 'Update warehouse inventory quantities, batch specifications, and supplier receipts'
                  : 'Record new inward yarn bundles, cotton spools, and silk cones into cluster inventory'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="self-start md:self-auto px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 shadow-2xs transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Back to Stock List</span>
          </button>
        </div>
      </div>

      {/* 2. Main Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Photo & Stock ID Card (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Yarn Photo Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#1e5bbf]" />
                  Yarn Spool Photograph
                </h2>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleResetImage}
                    className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Image Dropzone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer w-full h-56 rounded-2xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center p-2 bg-amber-50/40 ${
                  isDragging
                    ? 'border-[#1e5bbf] bg-blue-50/60 scale-[1.01]'
                    : 'border-dashed border-amber-200/90 hover:border-[#1e5bbf]'
                }`}
                title="Click or drag image to upload"
              >
                {imagePreview && !imageLoadError ? (
                  <img
                    src={imagePreview}
                    alt="Yarn Stock"
                    onError={() => setImageLoadError(true)}
                    className="w-full h-full object-cover rounded-xl shadow-xs"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center rounded-xl overflow-hidden">
                    <FallbackYarnSvg />
                  </div>
                )}

                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1.5 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <span>Click or Drag to Upload Yarn Photo</span>
                  <span className="text-[10px] text-slate-200 font-normal">PNG, JPG, WebP up to 8MB</span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-xl bg-[#1e5bbf] hover:bg-[#164799] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Yarn Photo</span>
              </button>

              {/* Presets */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block mb-2">
                  Or select popular yarn category preset:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {sampleYarnPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        handleInputChange('yarnType', preset.yarnType);
                        handleInputChange('material', preset.material);
                        handleInputChange('count', preset.count);
                        handleInputChange('colorCode', preset.color);
                        handleInputChange('unitPrice', preset.unitPrice);
                        handleInputChange('quantity', preset.quantity);
                        handleInputChange('supplier', preset.supplier);
                        if (preset.image) {
                          setImagePreview(preset.image);
                          setImageLoadError(false);
                          handleInputChange('image', preset.image);
                        } else {
                          handleResetImage();
                        }
                      }}
                      className={`p-2 rounded-xl border text-left transition-all text-[11px] flex flex-col justify-between ${
                        formData.yarnType === preset.yarnType
                          ? 'border-[#1e5bbf] bg-blue-50/70 text-[#1e5bbf] font-bold shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                      }`}
                    >
                      <span className="line-clamp-1">{preset.label}</span>
                      <span className="text-[9px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                        ₹{preset.unitPrice}/kg
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">Stock Status</span>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="text-xs font-bold rounded-lg px-2.5 py-1 border bg-white border-slate-200 text-emerald-700"
                  >
                    <option value="In Stock">● In Stock</option>
                    <option value="Low Stock">▲ Low Stock Alert</option>
                    <option value="Out of Stock">✕ Out of Stock</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium pt-1 border-t border-slate-200/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tamil Nadu Co-optex Quality Certified</span>
                </div>
              </div>
            </div>

            {/* Valuation Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 text-xs space-y-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Coins className="w-3.5 h-3.5 text-[#c88a2c]" />
                Consignment Valuation Summary
              </h3>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Total Weight:</span>
                <span className="font-mono font-bold text-slate-900">{formData.quantity} Kg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Rate per Kg:</span>
                <span className="font-medium text-slate-700">₹{formData.unitPrice}</span>
              </div>
              <div className="flex justify-between py-1.5 pt-2">
                <span className="font-bold text-slate-700">Total Lot Value:</span>
                <span className="font-extrabold text-[#1e5bbf] font-serif text-sm">
                  {formatCurrency(totalValue)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Form Fields (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section 1: Classification & Material Specifications */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#1e5bbf]" />
                <div>
                  <h2 className="text-sm font-bold text-slate-800">1. Yarn Classification & Specifications</h2>
                  <p className="text-[11px] text-slate-400">Material type, yarn count, shade code, and batch number</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Yarn Category / Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.yarnType}
                    onChange={(e) => handleInputChange('yarnType', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-semibold text-slate-800 bg-white"
                  >
                    <option value="Cotton Yarn">Cotton Yarn (Combed / Carded)</option>
                    <option value="Mulberry Silk Yarn">Mulberry Silk Yarn (Pure Silk)</option>
                    <option value="Zari Yarn">Zari Metallic Yarn (Pure Gold / Silver)</option>
                    <option value="Polyester">Polyester Blend (Durable Shirting)</option>
                    <option value="Mixed Yarn">Mixed Organic Blend</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Fiber Composition / Material
                  </label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => handleInputChange('material', e.target.value)}
                    placeholder="e.g. 100% Giza Long Staple Cotton"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Yarn Count / Gauge
                  </label>
                  <input
                    type="text"
                    value={formData.count}
                    onChange={(e) => handleInputChange('count', e.target.value)}
                    placeholder="e.g. 80s Ne / 20/22 Denier"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Color / Shade Code
                  </label>
                  <input
                    type="text"
                    value={formData.colorCode}
                    onChange={(e) => handleInputChange('colorCode', e.target.value)}
                    placeholder="e.g. Natural Bleached White (#001)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Batch / Consignment Lot Number
                  </label>
                  <input
                    type="text"
                    value={formData.batchNo}
                    onChange={(e) => handleInputChange('batchNo', e.target.value)}
                    placeholder="e.g. LOT-ERD-2026-904"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-mono font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Inventory Quantities & Pricing */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#1e5bbf]" />
                <div>
                  <h2 className="text-sm font-bold text-slate-800">2. Inventory Quantities & Pricing</h2>
                  <p className="text-[11px] text-slate-400">Total weight received, reorder safety threshold, and unit cost</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Received Quantity (Kg) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    placeholder="e.g. 250"
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-bold text-slate-900 focus:outline-hidden ${
                      errors.quantity ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-[#1e5bbf]'
                    }`}
                  />
                  {errors.quantity && <p className="text-[11px] text-rose-500 mt-1">{errors.quantity}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Unit Cost per Kg (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                    placeholder="e.g. 380"
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-bold text-slate-900 focus:outline-hidden ${
                      errors.unitPrice ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-[#1e5bbf]'
                    }`}
                  />
                  {errors.unitPrice && <p className="text-[11px] text-rose-500 mt-1">{errors.unitPrice}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Safety Reorder Alert (Kg)
                  </label>
                  <input
                    type="number"
                    value={formData.minThreshold}
                    onChange={(e) => handleInputChange('minThreshold', e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Supplier Sourcing & Storage Details */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#1e5bbf]" />
                <div>
                  <h2 className="text-sm font-bold text-slate-800">3. Supplier Sourcing & Warehouse Storage</h2>
                  <p className="text-[11px] text-slate-400">Supplier mill, inward date, rack placement, and storage conditions</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Supplier / Spinning Mill Depot
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => handleInputChange('supplier', e.target.value)}
                    placeholder="e.g. Co-optex Yarn Depot - Erode"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Warehouse Bin / Rack Location
                  </label>
                  <input
                    type="text"
                    value={formData.warehouseLocation}
                    onChange={(e) => handleInputChange('warehouseLocation', e.target.value)}
                    placeholder="e.g. Rack B-14, Central Depot"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Inward Receipt Date
                  </label>
                  <input
                    type="date"
                    value={formData.receivedDate}
                    onChange={(e) => handleInputChange('receivedDate', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Storage Instructions & Quality Remarks
                  </label>
                  <textarea
                    rows={3}
                    value={formData.remarks}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    placeholder="e.g. Keep in humidity-controlled area. Suitable for pure silk warp."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-all active:scale-95"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 py-2.5 rounded-xl bg-[#1e5bbf] hover:bg-[#164799] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Update Stock Record' : 'Save Stock Inventory'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
