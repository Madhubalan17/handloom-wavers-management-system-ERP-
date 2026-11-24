import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Upload,
  Cpu,
  User,
  MapPin,
  CheckCircle2,
  Calendar,
  Sparkles,
  Camera,
  ShieldCheck,
  X,
  Save,
  RotateCcw,
  Wrench,
  Layers,
  Gauge,
  Tag,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Reliable High-Definition SVG illustration of a traditional wooden handloom
const FallbackLoomSvg = () => (
  <svg
    viewBox="0 0 400 300"
    className="w-full h-full object-cover"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="400" height="300" fill="#fdfbf7" />
    {/* Wooden Frame Structure */}
    <rect x="50" y="40" width="20" height="220" rx="3" fill="#8B4513" />
    <rect x="330" y="40" width="20" height="220" rx="3" fill="#8B4513" />
    <rect x="50" y="50" width="300" height="18" rx="2" fill="#A0522D" />
    <rect x="50" y="240" width="300" height="18" rx="2" fill="#A0522D" />
    <rect x="190" y="50" width="20" height="208" rx="2" fill="#6B3410" />

    {/* Warp Beam & Cloth Roller */}
    <rect x="70" y="80" width="260" height="14" rx="7" fill="#CD853F" />
    <rect x="70" y="210" width="260" height="14" rx="7" fill="#CD853F" />

    {/* Warp Threads (Gold & Maroon Silk Pattern) */}
    {Array.from({ length: 28 }).map((_, i) => (
      <line
        key={i}
        x1={78 + i * 8.8}
        y1="94"
        x2={78 + i * 8.8}
        y2="210"
        stroke={i % 3 === 0 ? '#C88A2C' : i % 3 === 1 ? '#9A2A2A' : '#D4AF37'}
        strokeWidth="1.6"
        opacity="0.85"
      />
    ))}

    {/* Reed / Beater */}
    <rect x="65" y="145" width="270" height="26" rx="4" fill="#5C2E0B" opacity="0.95" />
    <rect x="70" y="149" width="260" height="18" rx="2" fill="#D2B48C" />
    {Array.from({ length: 40 }).map((_, i) => (
      <line
        key={`reed-${i}`}
        x1={74 + i * 6.3}
        y1="149"
        x2={74 + i * 6.3}
        y2="167"
        stroke="#4A2508"
        strokeWidth="1"
      />
    ))}

    {/* Shuttle */}
    <polygon points="175,158 200,150 225,158 200,166" fill="#DAA520" stroke="#8B5A2B" strokeWidth="1.5" />
    <circle cx="200" cy="158" r="3.5" fill="#B22222" />

    {/* Treadles (Pedals at bottom) */}
    <rect x="150" y="250" width="16" height="36" rx="2" fill="#4A2508" transform="rotate(-10 150 250)" />
    <rect x="180" y="250" width="16" height="36" rx="2" fill="#4A2508" />
    <rect x="210" y="250" width="16" height="36" rx="2" fill="#4A2508" transform="rotate(10 210 250)" />

    {/* Decorative Label Overlay */}
    <rect x="120" y="270" width="160" height="22" rx="11" fill="#1e5bbf" opacity="0.9" />
    <text x="200" y="285" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
      Traditional Handloom
    </text>
  </svg>
);

export const sampleLoomPresets = [
  {
    label: 'Traditional Wooden Handloom',
    type: 'Handloom (Traditional Wooden)',
    desc: 'Pure teakwood pit loom for Kanchipuram & Erode zari sarees',
    image: '',
    specs: '48" Reed Width, 2-Pedal Frame',
  },
  {
    label: 'Pit Loom with Jacquard',
    type: 'Pit Loom with Jacquard',
    desc: '480-hook jacquard mechanism for intricate bridal pallu motifs',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    specs: '52" Extra Wide, 480-Hook Jacquard',
  },
  {
    label: 'Fly Shuttle Frame Loom',
    type: 'Fly Shuttle Frame Loom',
    desc: 'High-speed foot-operated frame loom for soft cotton dhotis & towels',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&auto=format&fit=crop&q=80',
    specs: '46" Standard, Fly Shuttle Motion',
  },
  {
    label: 'High-Speed Power Loom',
    type: 'Power Loom',
    desc: 'Electric semi-automatic unit for bulk uniform & shirting yardage',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    specs: '60" Industrial Width, 180 RPM',
  },
];

export const AddLoomPage = ({
  onBack,
  onSaveLoom,
  loomToEdit = null,
  weaversList = [],
}) => {
  const isEditing = Boolean(loomToEdit);
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    loomNo: loomToEdit?.loomNo || loomToEdit?.loom_no || 'L-006',
    type: loomToEdit?.type || loomToEdit?.loom_type || 'Pit Loom with Jacquard',
    status: loomToEdit?.status || 'Active',
    village: loomToEdit?.village || loomToEdit?.cluster_village || 'Nallapatti',
    assignedWeaver: loomToEdit?.assignedWeaver || loomToEdit?.assigned_weaver || 'R. Selvi',
    dailyCapacity: loomToEdit?.dailyCapacity || loomToEdit?.daily_capacity || '12 - 15 meters / day',
    reedWidth: loomToEdit?.reedWidth || loomToEdit?.reed_width || '48 inches (Standard)',
    warpLength: loomToEdit?.warpLength || '120 meters per warp',
    shedLocation: loomToEdit?.shedLocation || 'Shed A - Main Cooperative Facility',
    installationDate: loomToEdit?.installationDate || '2026-03-15',
    remarks: loomToEdit?.remarks || 'Equipped with 480-hook Jacquard head and balanced box motion for pure zari weaving.',
    image: loomToEdit?.image || '',
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
      alert('Image file size exceeds 8MB. Please choose a smaller photo.');
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

  const validate = () => {
    const newErrors = {};
    if (!formData.loomNo.trim()) newErrors.loomNo = 'Loom Number is required (e.g. L-006)';
    if (!formData.type) newErrors.type = 'Loom type is required';
    if (!formData.village) newErrors.village = 'Cluster / Village location is required';
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

    onSaveLoom({
      ...formData,
      id: loomToEdit ? loomToEdit.id : undefined,
    });
  };

  return (
    <div className="space-y-6 font-sans max-w-[1300px] mx-auto pb-12">
      {/* 1. Header Banner matching AddWeaverPage styling */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-6">
        {/* Soft Golden Silk Fabric Drape overlay */}
        <div
          className="absolute inset-y-0 right-0 w-2/5 pointer-events-none opacity-25 mix-blend-multiply bg-cover bg-right"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80')`,
            maskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 90%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 90%)',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Title with Gold Accent Bar */}
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
                  Loom Management
                </button>
                <span>/</span>
                <span className="text-[#1e5bbf]">
                  {isEditing ? 'Edit Loom Details' : 'Register New Loom Unit'}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-serif text-[#132036] tracking-tight">
                {isEditing ? `Edit Loom: ${formData.loomNo}` : 'Register New Loom Unit'}
              </h1>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                {isEditing
                  ? 'Update loom hardware specifications, weaver allocation, and maintenance records'
                  : 'Onboard a new handloom, pit loom or power loom asset to the cluster cooperative'}
              </p>
            </div>
          </div>

          {/* Back button */}
          <button
            type="button"
            onClick={onBack}
            className="self-start md:self-auto px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 shadow-2xs transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Back to Looms List</span>
          </button>
        </div>
      </div>

      {/* 2. Main Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Loom Image & Asset Status Badge (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Loom Image Upload Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#1e5bbf]" />
                  Loom Unit Photograph
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

              {/* Loom Image Display / Dropzone */}
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
                    alt="Loom Unit"
                    onError={() => setImageLoadError(true)}
                    className="w-full h-full object-cover rounded-xl shadow-xs"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center rounded-xl overflow-hidden">
                    <FallbackLoomSvg />
                  </div>
                )}

                {/* Hover / Overlay Upload Prompt */}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1.5 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <span>Click or Drag to Upload Photo</span>
                  <span className="text-[10px] text-slate-200 font-normal">PNG, JPG, WebP up to 8MB</span>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {/* Upload Button */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#1e5bbf] hover:bg-[#164799] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Loom Photo</span>
                </button>
              </div>

              {/* Sample Presets Gallery */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block mb-2">
                  Or select traditional loom type preset:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {sampleLoomPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        handleInputChange('type', preset.type);
                        if (preset.image) {
                          setImagePreview(preset.image);
                          setImageLoadError(false);
                          handleInputChange('image', preset.image);
                        } else {
                          handleResetImage();
                        }
                      }}
                      className={`p-2 rounded-xl border text-left transition-all text-[11px] flex flex-col justify-between ${
                        formData.type === preset.type
                          ? 'border-[#1e5bbf] bg-blue-50/70 text-[#1e5bbf] font-bold shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                      }`}
                    >
                      <span className="line-clamp-1">{preset.label}</span>
                      <span className="text-[9px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                        {preset.specs}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Asset Verification & Status Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">Unit Status</span>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className={`text-xs font-bold rounded-lg px-2.5 py-1 border ${
                      formData.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : formData.status === 'Under Maintenance' || formData.status === 'Under Repair'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    <option value="Active">● Active</option>
                    <option value="Inactive">○ Inactive</option>
                    <option value="Under Maintenance">▲ Under Maintenance</option>
                    <option value="Under Repair">✕ Under Repair</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium pt-1 border-t border-slate-200/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Tamil Nadu Handloom Cluster Asset</span>
                </div>
              </div>
            </div>

            {/* Quick Specs Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 text-xs space-y-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Tag className="w-3.5 h-3.5 text-[#c88a2c]" />
                Loom Asset ID Card
              </h3>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Loom ID:</span>
                <span className="font-mono font-bold text-slate-900">{formData.loomNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Classification:</span>
                <span className="font-semibold text-slate-800 line-clamp-1">{formData.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Cluster:</span>
                <span className="font-medium text-slate-700">{formData.village}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Operator:</span>
                <span className="font-medium text-[#1e5bbf]">{formData.assignedWeaver || 'Unassigned'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Loom Form Fields (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section 1: Identification & Hardware Category */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#1e5bbf]" />
                <div>
                  <h2 className="text-sm font-bold text-slate-800">1. Loom Identification & Category</h2>
                  <p className="text-[11px] text-slate-400">Hardware registration code and cluster shed designation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Loom Number */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Loom Number / Serial Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.loomNo}
                    onChange={(e) => handleInputChange('loomNo', e.target.value)}
                    placeholder="e.g. L-006"
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-mono font-bold text-slate-900 text-sm focus:outline-hidden ${
                      errors.loomNo ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-[#1e5bbf]'
                    }`}
                  />
                  {errors.loomNo && <p className="text-[11px] text-rose-500 mt-1">{errors.loomNo}</p>}
                </div>

                {/* Loom Type */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Loom Category & Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-medium text-slate-800 bg-white"
                  >
                    <option value="Pit Loom with Jacquard">Pit Loom with Jacquard (Bridal / Zari)</option>
                    <option value="Handloom (Traditional Wooden)">Handloom (Traditional Teakwood Frame)</option>
                    <option value="Fly Shuttle Frame Loom">Fly Shuttle Frame Loom (Cotton / Towels)</option>
                    <option value="Semi-Automatic Handloom">Semi-Automatic Handloom</option>
                    <option value="Power Loom">Power Loom (High Speed)</option>
                  </select>
                </div>

                {/* Cluster / Village */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Cluster / Village Location <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.village}
                    onChange={(e) => handleInputChange('village', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-medium text-slate-800 bg-white"
                  >
                    <option value="Nallapatti">Nallapatti Cluster</option>
                    <option value="Thingalur">Thingalur Cluster</option>
                    <option value="Erode">Erode Cooperative Center</option>
                    <option value="Chennimalai">Chennimalai Loom Center</option>
                    <option value="Bhavani">Bhavani Weaving Zone</option>
                  </select>
                </div>

                {/* Shed Location */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Shed / Room Designation
                  </label>
                  <input
                    type="text"
                    value={formData.shedLocation}
                    onChange={(e) => handleInputChange('shedLocation', e.target.value)}
                    placeholder="e.g. Shed A - Row 3, Loom #2"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Technical Specifications & Production Capacity */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#1e5bbf]" />
                <div>
                  <h2 className="text-sm font-bold text-slate-800">2. Technical Specifications & Output Capacity</h2>
                  <p className="text-[11px] text-slate-400">Fabric width, warp capacity, and expected daily production</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Daily Output Capacity */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Expected Daily Capacity
                  </label>
                  <input
                    type="text"
                    value={formData.dailyCapacity}
                    onChange={(e) => handleInputChange('dailyCapacity', e.target.value)}
                    placeholder="e.g. 12 - 15 meters / day"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800"
                  />
                </div>

                {/* Reed Width */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Reed Width / Fabric Width
                  </label>
                  <select
                    value={formData.reedWidth}
                    onChange={(e) => handleInputChange('reedWidth', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-medium text-slate-800 bg-white"
                  >
                    <option value="48 inches (Standard)">48 inches (Standard Saree)</option>
                    <option value="52 inches (Extra Wide)">52 inches (Extra Wide Saree / Dhotis)</option>
                    <option value="44 inches (Narrow)">44 inches (Narrow Width Yardage)</option>
                    <option value="60 inches (Industrial)">60 inches (Bedspreads / Fabric)</option>
                  </select>
                </div>

                {/* Warp Length */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Warp Beam Capacity
                  </label>
                  <input
                    type="text"
                    value={formData.warpLength}
                    onChange={(e) => handleInputChange('warpLength', e.target.value)}
                    placeholder="e.g. 120 meters per warp"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Weaver Allocation & Maintenance */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#1e5bbf]" />
                <div>
                  <h2 className="text-sm font-bold text-slate-800">3. Artisan Allocation & Maintenance Record</h2>
                  <p className="text-[11px] text-slate-400">Weaver assignment, commissioning date, and technical remarks</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Assigned Weaver */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Assigned Weaver (Artisan)
                  </label>
                  <select
                    value={formData.assignedWeaver}
                    onChange={(e) => handleInputChange('assignedWeaver', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-medium text-slate-800 bg-white"
                  >
                    <option value="">-- Unassigned (Available in Pool) --</option>
                    {weaversList && weaversList.length > 0 ? (
                      weaversList.map((w) => (
                        <option key={w.id} value={w.name}>
                          {w.name} ({w.village} - {w.phone})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="R. Selvi">R. Selvi (Nallapatti)</option>
                        <option value="M. Kumar">M. Kumar (Thingalur)</option>
                        <option value="P. Lakshmi">P. Lakshmi (Erode)</option>
                        <option value="S. Murugan">S. Murugan (Nallapatti)</option>
                        <option value="K. Devi">K. Devi (Erode)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Installation Date */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Commission / Installation Date
                  </label>
                  <input
                    type="date"
                    value={formData.installationDate}
                    onChange={(e) => handleInputChange('installationDate', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800"
                  />
                </div>

                {/* Remarks & Notes */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Technical Specifications & Maintenance Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.remarks}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    placeholder="e.g. Equipped with 480-hook Jacquard head and balanced box motion for pure zari weaving."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Form Action Buttons */}
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
                <span>{isEditing ? 'Update Loom Unit' : 'Save Loom Unit'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
