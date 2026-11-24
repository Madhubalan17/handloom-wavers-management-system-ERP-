import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Upload,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  Cpu,
  CreditCard,
  Briefcase,
  Building,
  Calendar,
  Sparkles,
  Camera,
  ShieldCheck,
  X,
  Save,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AddWeaverPage = ({ onBack, onSaveWeaver, weaverToEdit = null }) => {
  const isEditing = Boolean(weaverToEdit);
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: weaverToEdit?.name || '',
    gender: weaverToEdit?.gender || 'Female',
    age: weaverToEdit?.age || '38',
    fatherSpouse: weaverToEdit?.fatherSpouse || '',
    artisanCardNo: weaverToEdit?.artisanCardNo || 'TN-ERD-2026-884',
    phone: weaverToEdit?.phone || '',
    altPhone: weaverToEdit?.altPhone || '',
    village: weaverToEdit?.village || 'Nallapatti',
    district: weaverToEdit?.district || 'Erode',
    address: weaverToEdit?.address || '',
    pincode: weaverToEdit?.pincode || '638052',
    assignedLoom: weaverToEdit?.assignedLoom || 'L-001',
    loomType: weaverToEdit?.loomType || 'Handloom',
    experienceYears: weaverToEdit?.experienceYears || '12',
    specialty: weaverToEdit?.specialty || 'Pure Silk & Zari Weaving',
    dailyCapacity: weaverToEdit?.dailyCapacity || '4.5 mtrs / day',
    status: weaverToEdit?.status || 'Active',
    bankName: weaverToEdit?.bankName || 'State Bank of India',
    bankAccount: weaverToEdit?.bankAccount || '30495810294',
    ifscCode: weaverToEdit?.ifscCode || 'SBIN0001248',
    avatar: weaverToEdit?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  });

  const [avatarPreview, setAvatarPreview] = useState(formData.avatar);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});

  // Sample quick avatars to choose from
  const sampleAvatars = [
    { label: 'Selvi (Female)', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80' },
    { label: 'Lakshmi (Female)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
    { label: 'Kumar (Male)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
    { label: 'Murugan (Male)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
  ];

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
      alert('Photo size exceeds 8MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setAvatarPreview(dataUrl);
      setImageLoadError(false);
      handleInputChange('avatar', dataUrl);
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

  const handleResetPhoto = () => {
    const defaultAvatar = sampleAvatars[0].url;
    setAvatarPreview(defaultAvatar);
    setImageLoadError(false);
    handleInputChange('avatar', defaultAvatar);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.village) newErrors.village = 'Village cluster is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.5 },
    });

    onSaveWeaver({
      ...formData,
      id: weaverToEdit ? weaverToEdit.id : undefined,
    });
  };

  return (
    <div className="space-y-6 font-sans max-w-[1300px] mx-auto pb-12">
      {/* 1. Header Banner matching reference styling */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-6">
        {/* Soft Golden Silk Fabric Drape overlay on the right */}
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
                  Weaver Management
                </button>
                <span>/</span>
                <span className="text-[#1e5bbf]">
                  {isEditing ? 'Edit Weaver Profile' : 'Register New Weaver'}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-serif text-[#132036] tracking-tight">
                {isEditing ? `Edit Profile: ${formData.name}` : 'Register New Weaver'}
              </h1>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                {isEditing
                  ? 'Update artisan records, cluster assignment, and bank disbursement information'
                  : 'Onboard a new handloom artisan to cluster management & direct wage disbursement'}
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
            <span>Back to Weavers List</span>
          </button>
        </div>
      </div>

      {/* 2. Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Photo & Artisan ID Badge (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Photo Card with Real Image Upload */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 text-center space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-sm font-bold text-slate-800 text-left flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#1e5bbf]" />
                  Artisan Photograph
                </h2>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleResetPhoto}
                    className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Avatar circle / dropzone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-36 h-36 mx-auto rounded-full cursor-pointer group transition-all p-1 border-2 ${
                  isDragging
                    ? 'border-[#1e5bbf] bg-blue-50/70 scale-105'
                    : 'border-dashed border-blue-200 hover:border-[#1e5bbf]'
                }`}
                title="Click or drag image to upload photo"
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 relative shadow-inner">
                  {avatarPreview && !imageLoadError ? (
                    <img
                      src={avatarPreview}
                      alt="Weaver preview"
                      onError={() => setImageLoadError(true)}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50 text-[#1e5bbf]">
                      <User className="w-16 h-16 stroke-1" />
                    </div>
                  )}

                  {/* Hover Upload Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 p-2">
                    <Upload className="w-5 h-5 text-white" />
                    <span>Upload Photo</span>
                  </div>
                </div>

                {/* Floating camera badge */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="absolute bottom-1 right-1 p-2.5 bg-[#1e5bbf] text-white rounded-full hover:bg-[#164799] shadow-md transition-transform hover:scale-110 active:scale-95"
                  title="Upload / Change Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {/* Upload Photo Button */}
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-[#1e5bbf] text-xs font-bold flex items-center justify-center gap-1.5 border border-blue-200/80 transition-all active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Artisan Photo</span>
                </button>
                <span className="text-[10px] text-slate-400 block mt-1">
                  JPG, PNG, WebP up to 8MB
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  {formData.name || 'Artisan Name'}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  ID: {formData.artisanCardNo}
                </p>
              </div>

              {/* Sample Quick Avatars selector */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block mb-2">
                  Or select sample profile photo:
                </span>
                <div className="flex justify-center gap-2">
                  {sampleAvatars.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAvatarPreview(item.url);
                        setImageLoadError(false);
                        handleInputChange('avatar', item.url);
                      }}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all ${
                        avatarPreview === item.url
                          ? 'border-[#1e5bbf] scale-110 shadow-xs'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      title={item.label}
                    >
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Verification & Status */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">Account Status</span>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="text-xs font-bold rounded-lg px-2 py-1 bg-white border border-slate-200 text-emerald-700"
                  >
                    <option value="Active">● Active</option>
                    <option value="Inactive">○ Inactive</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tamil Nadu Handloom Cooperative Verified</span>
                </div>
              </div>
            </div>

            {/* Loom & Cluster Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3 text-xs">
              <h2 className="font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#1e5bbf]" />
                Loom & Cluster
              </h2>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Assigned Loom *
                </label>
                <select
                  value={formData.assignedLoom}
                  onChange={(e) => handleInputChange('assignedLoom', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 font-medium text-slate-800"
                >
                  <option value="L-001">L-001 (Frame Loom - Active)</option>
                  <option value="L-002">L-002 (Power Loom - Active)</option>
                  <option value="L-003">L-003 (Jacquard Loom - Active)</option>
                  <option value="L-004">L-004 (Traditional Pit Loom)</option>
                  <option value="L-005">L-005 (Handloom - Active)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Loom Type
                </label>
                <select
                  value={formData.loomType}
                  onChange={(e) => handleInputChange('loomType', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 font-medium text-slate-800"
                >
                  <option value="Handloom">Traditional Handloom</option>
                  <option value="Power Loom">Power Loom</option>
                  <option value="Pit Loom">Pit Loom</option>
                  <option value="Jacquard">Jacquard Handloom</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  value={formData.experienceYears}
                  onChange={(e) => handleInputChange('experienceYears', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 font-medium text-slate-800"
                  min="1"
                  max="50"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Forms (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section 1: Personal Information */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
              <h2 className="text-sm font-bold text-[#132036] font-serif border-b border-slate-100 pb-2.5 flex items-center gap-2">
                <User className="w-4 h-4 text-[#1e5bbf]" />
                1. Personal Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. R. Selvi"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-medium ${
                      errors.name
                        ? 'border-rose-400 bg-rose-50/30'
                        : 'border-slate-200 focus:border-[#1e5bbf]'
                    } focus:outline-hidden transition-all`}
                  />
                  {errors.name && (
                    <span className="text-[11px] text-rose-500 font-semibold mt-1 block">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Father's / Spouse's Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. K. Ramasamy"
                    value={formData.fatherSpouse}
                    onChange={(e) => handleInputChange('fatherSpouse', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-medium"
                  />
                </div>

                {/* Gender radio pills */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Gender *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Female', 'Male', 'Other'].map((g) => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => handleInputChange('gender', g)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                          formData.gender === g
                            ? 'bg-[#1e5bbf] text-white border-[#1e5bbf] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Age / Date of Birth
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Age (e.g. 38)"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="w-1/2 px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
                    />
                    <input
                      type="text"
                      placeholder="Artisan Card No"
                      value={formData.artisanCardNo}
                      onChange={(e) => handleInputChange('artisanCardNo', e.target.value)}
                      className="w-1/2 px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Contact & Location */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
              <h2 className="text-sm font-bold text-[#132036] font-serif border-b border-slate-100 pb-2.5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1e5bbf]" />
                2. Contact & Village Cluster
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Mobile Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border font-mono font-medium ${
                        errors.phone
                          ? 'border-rose-400 bg-rose-50/30'
                          : 'border-slate-200 focus:border-[#1e5bbf]'
                      } focus:outline-hidden transition-all`}
                    />
                  </div>
                  {errors.phone && (
                    <span className="text-[11px] text-rose-500 font-semibold mt-1 block">
                      {errors.phone}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Village / Cluster *
                  </label>
                  <select
                    value={formData.village}
                    onChange={(e) => handleInputChange('village', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                  >
                    <option value="Nallapatti">Nallapatti (Silk Cluster)</option>
                    <option value="Thingalur">Thingalur (Cotton Cluster)</option>
                    <option value="Erode">Erode (Central Hub)</option>
                    <option value="Sirumugai">Sirumugai (Zari Specialists)</option>
                    <option value="Salem">Salem (Dhoti Weavers)</option>
                    <option value="Kanchipuram">Kanchipuram (Traditional Silk)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Residential Address
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Door No, Street Name, Colony / Palayam..."
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf] font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Craft Specialization & Bank Wages */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
              <h2 className="text-sm font-bold text-[#132036] font-serif border-b border-slate-100 pb-2.5 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#1e5bbf]" />
                3. Weaving Specialty & Direct Wage Bank Account
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Primary Fabric Specialization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pure Silk Sarees, Cotton Dhotis"
                    value={formData.specialty}
                    onChange={(e) => handleInputChange('specialty', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Daily Production Capacity
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4.5 mtrs / day"
                    value={formData.dailyCapacity}
                    onChange={(e) => handleInputChange('dailyCapacity', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. State Bank of India"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Bank Account Number (for direct wages)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 30495810294"
                    value={formData.bankAccount}
                    onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SBIN0001248"
                    value={formData.ifscCode}
                    onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-medium uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="638052"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs shadow-2xs transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-[#1e5bbf] hover:bg-[#164799] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Save & Register Weaver'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
