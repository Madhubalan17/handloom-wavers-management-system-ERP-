import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Upload,
  TrendingUp,
  Cpu,
  User,
  Calendar,
  Sparkles,
  Camera,
  ShieldCheck,
  X,
  Save,
  CheckCircle2,
  Award,
  Layers,
  Clock,
  Scissors,
  Tag,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// High-Definition SVG illustration of Traditional Handwoven Silk Fabric & Jacquard Motif
const FallbackFabricSvg = () => (
  <svg
    viewBox="0 0 400 300"
    className="w-full h-full object-cover"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="400" height="300" fill="#7A0016" />
    
    {/* Silk Fabric Base Texture Lines */}
    {Array.from({ length: 30 }).map((_, i) => (
      <line
        key={`warp-${i}`}
        x1={i * 14}
        y1="0"
        x2={i * 14}
        y2="300"
        stroke="#9B111E"
        strokeWidth="1.2"
        opacity="0.6"
      />
    ))}

    {/* Golden Zari Border (Top and Bottom) */}
    <rect x="0" y="30" width="400" height="32" fill="#DAA520" />
    <rect x="0" y="34" width="400" height="24" fill="#C88A2C" />
    <rect x="0" y="238" width="400" height="32" fill="#DAA520" />
    <rect x="0" y="242" width="400" height="24" fill="#C88A2C" />

    {/* Zari Mango / Paisley / Mayil (Peacock) Motifs */}
    {Array.from({ length: 8 }).map((_, i) => (
      <g key={`motif-${i}`} transform={`translate(${20 + i * 48}, 37)`}>
        <polygon points="12,3 18,12 12,21 6,12" fill="#FFE57F" />
        <circle cx="12" cy="12" r="3" fill="#800000" />
      </g>
    ))}
    {Array.from({ length: 8 }).map((_, i) => (
      <g key={`motif-bot-${i}`} transform={`translate(${20 + i * 48}, 245)`}>
        <polygon points="12,3 18,12 12,21 6,12" fill="#FFE57F" />
        <circle cx="12" cy="12" r="3" fill="#800000" />
      </g>
    ))}

    {/* Central Jacquard Medallion */}
    <ellipse cx="200" cy="150" rx="65" ry="45" fill="#DAA520" opacity="0.9" />
    <ellipse cx="200" cy="150" rx="55" ry="37" fill="#800000" />
    <circle cx="200" cy="150" r="16" fill="#FFE57F" />
    <circle cx="200" cy="150" r="8" fill="#800000" />

    {/* Badge Overlay */}
    <rect x="110" y="185" width="180" height="24" rx="12" fill="#1e5bbf" opacity="0.95" />
    <text x="200" y="201" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
      Handloom Production Output
    </text>
  </svg>
);

export const sampleProductionPresets = [
  {
    label: 'Kanchipuram Pure Silk Bridal Saree',
    fabricType: 'Pure Silk & Zari Weaving',
    metersProduced: 120,
    width: '48 inches',
    pickCount: '120 picks / inch (Dense)',
    grade: 'Grade A (Export Quality)',
    remarks: 'Flawless 3-ply mulberry warp with pure silver-gilt zari pallu.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&auto=format&fit=crop&q=80',
  },
  {
    label: 'Erode Traditional Fine Cotton Dhoti',
    fabricType: 'Organic Cotton Weave',
    metersProduced: 150,
    width: '50 inches',
    pickCount: '80 picks / inch',
    grade: 'Grade A (Co-optex Certified)',
    remarks: 'Soft combed long-staple cotton dhoti with traditional red selvedge.',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=500&auto=format&fit=crop&q=80',
  },
  {
    label: 'Bhavani Jacquard Jamakkalam (Carpet)',
    fabricType: 'Heavy Jacquard Durrie',
    metersProduced: 90,
    width: '60 inches',
    pickCount: '64 picks / inch (Heavy Duty)',
    grade: 'Grade A (Export Quality)',
    remarks: 'Vibrant geometric block pattern with reinforced border hems.',
    image: '',
  },
  {
    label: 'Chennimalai Organic Bedspread Yardage',
    fabricType: 'Fine Cotton Yardage',
    metersProduced: 180,
    width: '52 inches',
    pickCount: '90 picks / inch',
    grade: 'Grade B (Standard Market)',
    remarks: 'Uniform warp tension maintained across entire 180-meter cut.',
    image: '',
  },
];

export const AddProductionRecordPage = ({
  onBack,
  onSaveRecord,
  recordToEdit = null,
  weaversList = [],
  loomsList = [],
}) => {
  const isEditing = Boolean(recordToEdit);
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    weaverName: recordToEdit?.weaverName || recordToEdit?.weaver_name || (weaversList[0]?.name || 'R. Selvi'),
    loomNo: recordToEdit?.loomNo || recordToEdit?.loom_no || (loomsList[0]?.loomNo || 'L-001'),
    fabricType: recordToEdit?.fabricType || recordToEdit?.fabric_type || 'Pure Silk',
    productionMtrs: recordToEdit?.productionMtrs || recordToEdit?.meters_produced || 120,
    productionDate: recordToEdit?.date || recordToEdit?.production_date || '2026-11-24',
    shift: recordToEdit?.shift || 'Morning Shift (06:00 - 14:00)',
    fabricWidth: recordToEdit?.fabricWidth || '48 inches (Standard)',
    pickCount: recordToEdit?.pickCount || '120 picks / inch',
    qualityGrade: recordToEdit?.qualityGrade || 'Grade A (Export Quality)',
    defectStatus: recordToEdit?.defectStatus || 'Zero Defects (Pass)',
    warpBatchNo: recordToEdit?.warpBatchNo || 'WARP-SILK-2026-88',
    remarks: recordToEdit?.remarks || 'Inspected by master weaver. Balanced reed motion with excellent zari finish.',
    fabricImage: recordToEdit?.fabricImage || recordToEdit?.fabric_image || '',
  });

  const [imagePreview, setImagePreview] = useState(formData.fabricImage);
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
      handleInputChange('fabricImage', dataUrl);
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
    handleInputChange('fabricImage', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.weaverName) newErrors.weaverName = 'Please select a weaver';
    if (!formData.loomNo) newErrors.loomNo = 'Please select a loom unit';
    if (!formData.productionMtrs || Number(formData.productionMtrs) <= 0) {
      newErrors.productionMtrs = 'Please enter valid production output in meters';
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

    onSaveRecord({
      ...formData,
      productionMtrs: Number(formData.productionMtrs),
      meters_produced: Number(formData.productionMtrs),
      date: formData.productionDate,
      production_date: formData.productionDate,
      fabric_image: formData.fabricImage,
      id: recordToEdit ? recordToEdit.id : undefined,
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
                  Production Tracking
                </button>
                <span>/</span>
                <span className="text-[#1e5bbf]">
                  {isEditing ? 'Update Production Entry' : 'Log Daily Production Output'}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-serif text-[#132036] tracking-tight">
                {isEditing ? `Edit Record: ${formData.weaverName}` : 'Log Daily Production Output'}
              </h1>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                {isEditing
                  ? 'Update fabric yardage, artisan assignment, and quality inspection grades'
                  : 'Log finished fabric meters produced across cluster looms and artisan shifts'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="self-start md:self-auto px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 shadow-2xs transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Back to Production Logs</span>
          </button>
        </div>
      </div>

      {/* 2. Main Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Fabric Photo & Quality Badge (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Fabric Image Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#1e5bbf]" />
                  Woven Fabric Photograph
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
                title="Click or drag fabric photo to upload"
              >
                {imagePreview && !imageLoadError ? (
                  <img
                    src={imagePreview}
                    alt="Fabric Production"
                    onError={() => setImageLoadError(true)}
                    className="w-full h-full object-cover rounded-xl shadow-xs"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center rounded-xl overflow-hidden">
                    <FallbackFabricSvg />
                  </div>
                )}

                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1.5 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <span>Click or Drag to Upload Fabric Photo</span>
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
                <span>Upload Fabric Photo</span>
              </button>

              {/* Presets */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block mb-2">
                  Or select standard fabric product preset:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {sampleProductionPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        handleInputChange('fabricType', preset.fabricType);
                        handleInputChange('productionMtrs', preset.metersProduced);
                        handleInputChange('fabricWidth', preset.width);
                        handleInputChange('pickCount', preset.pickCount);
                        handleInputChange('qualityGrade', preset.grade);
                        handleInputChange('remarks', preset.remarks);
                        if (preset.image) {
                          setImagePreview(preset.image);
                          setImageLoadError(false);
                          handleInputChange('fabricImage', preset.image);
                        } else {
                          handleResetImage();
                        }
                      }}
                      className={`p-2 rounded-xl border text-left transition-all text-[11px] flex flex-col justify-between ${
                        formData.fabricType === preset.fabricType
                          ? 'border-[#1e5bbf] bg-blue-50/70 text-[#1e5bbf] font-bold shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                      }`}
                    >
                      <span className="line-clamp-1">{preset.label}</span>
                      <span className="text-[9px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                        {preset.metersProduced} mtrs
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality & Grade Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">Inspection Grade</span>
                  <select
                    value={formData.qualityGrade}
                    onChange={(e) => handleInputChange('qualityGrade', e.target.value)}
                    className="text-xs font-bold rounded-lg px-2.5 py-1 border bg-white border-slate-200 text-emerald-700"
                  >
                    <option value="Grade A (Export Quality)">★ Grade A (Export Quality)</option>
                    <option value="Grade A (Co-optex Certified)">● Grade A (Co-optex Certified)</option>
                    <option value="Grade B (Standard Market)">▲ Grade B (Domestic Standard)</option>
                    <option value="Grade C (Seconds / Re-work)">✕ Grade C (Defect Re-work)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium pt-1 border-t border-slate-200/60">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Certified India Handloom Mark Standards</span>
                </div>
              </div>
            </div>

            {/* Output Metric Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 text-xs space-y-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Tag className="w-3.5 h-3.5 text-[#c88a2c]" />
                Daily Output Log Summary
              </h3>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Total Output:</span>
                <span className="font-mono font-bold text-blue-700 text-sm">{formData.productionMtrs} meters</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Operating Artisan:</span>
                <span className="font-semibold text-slate-900">{formData.weaverName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Loom Unit:</span>
                <span className="font-mono font-bold text-slate-700">{formData.loomNo}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Log Date:</span>
                <span className="font-medium text-slate-600">{formData.productionDate}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Form Fields (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section 1: Artisan Allocation & Loom Assignment */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#1e5bbf]" />
                <div>
                  <h2 className="text-sm font-bold text-slate-800">1. Artisan Allocation & Loom Assignment</h2>
                  <p className="text-[11px] text-slate-400">Weaver artisan, hardware loom unit, shift, and production date</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Operating Weaver Artisan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.weaverName}
                    onChange={(e) => handleInputChange('weaverName', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-semibold text-slate-800 bg-white"
                  >
                    {weaversList && weaversList.length > 0 ? (
                      weaversList.map((w) => (
                        <option key={w.id} value={w.name}>
                          {w.name} ({w.village} - {w.assignedLoom || 'Loom Unit'})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="R. Selvi">R. Selvi (Nallapatti Cluster)</option>
                        <option value="M. Kumar">M. Kumar (Thingalur Cluster)</option>
                        <option value="P. Lakshmi">P. Lakshmi (Erode Center)</option>
                        <option value="S. Murugan">S. Murugan (Nallapatti Cluster)</option>
                        <option value="K. Devi">K. Devi (Erode Center)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Loom Unit <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.loomNo}
                    onChange={(e) => handleInputChange('loomNo', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-mono font-bold text-slate-800 bg-white"
                  >
                    {loomsList && loomsList.length > 0 ? (
                      loomsList.map((l) => (
                        <option key={l.id} value={l.loomNo || l.loom_no}>
                          {l.loomNo || l.loom_no} - {l.type || l.loom_type} ({l.status})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="L-001">L-001 - Power Loom</option>
                        <option value="L-002">L-002 - Traditional Handloom</option>
                        <option value="L-003">L-003 - Power Loom</option>
                        <option value="L-004">L-004 - Handloom</option>
                        <option value="L-005">L-005 - Power Loom</option>
                        <option value="L-006">L-006 - Pit Loom with Jacquard</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Production Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.productionDate}
                    onChange={(e) => handleInputChange('productionDate', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Artisan Working Shift
                  </label>
                  <select
                    value={formData.shift}
                    onChange={(e) => handleInputChange('shift', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-medium text-slate-800 bg-white"
                  >
                    <option value="Morning Shift (06:00 - 14:00)">Morning Shift (06:00 - 14:00)</option>
                    <option value="General Day Shift (09:00 - 17:00)">General Day Shift (09:00 - 17:00)</option>
                    <option value="Evening Shift (14:00 - 22:00)">Evening Shift (14:00 - 22:00)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Fabric Output & Weaving Specifications */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-[#1e5bbf]" />
                <div>
                  <h2 className="text-sm font-bold text-slate-800">2. Fabric Output & Weaving Specifications</h2>
                  <p className="text-[11px] text-slate-400">Fabric variety, total linear meters woven, width, and pick density</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Fabric Variety / Pattern Title
                  </label>
                  <input
                    type="text"
                    value={formData.fabricType}
                    onChange={(e) => handleInputChange('fabricType', e.target.value)}
                    placeholder="e.g. Pure Silk & Zari Weaving"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Meters Woven (Mtrs) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.productionMtrs}
                    onChange={(e) => handleInputChange('productionMtrs', e.target.value)}
                    placeholder="e.g. 120"
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-bold text-blue-700 text-sm focus:outline-hidden ${
                      errors.productionMtrs ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-[#1e5bbf]'
                    }`}
                  />
                  {errors.productionMtrs && <p className="text-[11px] text-rose-500 mt-1">{errors.productionMtrs}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Fabric Width
                  </label>
                  <select
                    value={formData.fabricWidth}
                    onChange={(e) => handleInputChange('fabricWidth', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-medium text-slate-800 bg-white"
                  >
                    <option value="48 inches (Standard)">48 inches (Standard Saree)</option>
                    <option value="50 inches (Wide)">50 inches (Wide Dhoti)</option>
                    <option value="52 inches (Extra Wide)">52 inches (Extra Wide)</option>
                    <option value="60 inches (Industrial)">60 inches (Jamakkalam)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pick Count / Density
                  </label>
                  <input
                    type="text"
                    value={formData.pickCount}
                    onChange={(e) => handleInputChange('pickCount', e.target.value)}
                    placeholder="e.g. 120 picks / inch"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Warp Consignment Batch
                  </label>
                  <input
                    type="text"
                    value={formData.warpBatchNo}
                    onChange={(e) => handleInputChange('warpBatchNo', e.target.value)}
                    placeholder="e.g. WARP-SILK-2026-88"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] text-slate-800 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Quality Control & Production Notes */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1e5bbf]" />
                <div>
                  <h2 className="text-sm font-bold text-slate-800">3. Quality Inspection & Production Notes</h2>
                  <p className="text-[11px] text-slate-400">Defect checks, selvedge inspection, and supervisor sign-off</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Defect Inspection Status
                  </label>
                  <select
                    value={formData.defectStatus}
                    onChange={(e) => handleInputChange('defectStatus', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-medium text-slate-800 bg-white"
                  >
                    <option value="Zero Defects (Pass)">Zero Defects (100% Passed Inspection)</option>
                    <option value="Minor Selvedge Pull (Accepted)">Minor Selvedge Pull (Accepted for Finish)</option>
                    <option value="Re-wash Required">Re-wash / Steam Press Required</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Quality Inspector Signature
                  </label>
                  <input
                    type="text"
                    defaultValue="Master Weaver Inspector - Erode Center"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium"
                    readOnly
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Production Remarks & Weaving Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.remarks}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    placeholder="e.g. Inspected by master weaver. Balanced reed motion with excellent zari finish."
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
                <span>{isEditing ? 'Update Production Entry' : 'Save Production Record'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
