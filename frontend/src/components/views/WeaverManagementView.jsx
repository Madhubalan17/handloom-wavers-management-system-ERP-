import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  CheckCircle2,
  ChevronDown,
  Filter,
  Download,
  Upload,
  FileSpreadsheet,
} from 'lucide-react';
import { exportWeaversToExcel } from '../../utils/excelExport';
import { ImportWeaversModal } from './ImportWeaversModal';

export const initialWeaversList = [
  {
    id: 1,
    name: 'R. Selvi',
    village: 'Nallapatti',
    phone: '9876543210',
    status: 'Active',
    gender: 'Female',
    age: '38',
    assignedLoom: 'L-001',
    loomType: 'Handloom',
    specialty: 'Pure Silk & Zari Weaving',
    address: '12 North Weavers Street, Nallapatti',
  },
  {
    id: 2,
    name: 'M. Kumar',
    village: 'Thingalur',
    phone: '9876543211',
    status: 'Active',
    gender: 'Male',
    age: '42',
    assignedLoom: 'L-002',
    loomType: 'Power Loom',
    specialty: 'Fine Cotton Dhotis',
    address: '45 Gandhi Nagar, Thingalur',
  },
  {
    id: 3,
    name: 'P. Lakshmi',
    village: 'Erode',
    phone: '9876543212',
    status: 'Active',
    gender: 'Female',
    age: '35',
    assignedLoom: 'L-003',
    loomType: 'Handloom',
    specialty: 'Silk Sarees',
    address: '8 Bazaar Road, Erode',
  },
  {
    id: 4,
    name: 'S. Murugan',
    village: 'Nallapatti',
    phone: '9876543213',
    status: 'Active',
    gender: 'Male',
    age: '45',
    assignedLoom: 'L-004',
    loomType: 'Pit Loom',
    specialty: 'Traditional Jacquard Towels',
    address: '14/2 Weavers Colony, Pillayar Palayam',
  },
  {
    id: 5,
    name: 'K. Devi',
    village: 'Erode',
    phone: '9876543214',
    status: 'Active',
    gender: 'Female',
    age: '29',
    assignedLoom: 'L-005',
    loomType: 'Handloom',
    specialty: 'Cotton Silk Blend',
    address: '22 South Masi Street, Erode',
  },
];

export const WeaverManagementView = ({
  weavers = initialWeaversList,
  onNavigateToAddWeaver,
  onNavigateToEditWeaver,
  onDeleteWeaver,
  onBulkImportWeavers,
}) => {
  const [search, setSearch] = useState('');
  const [villageFilter, setVillageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showImportModal, setShowImportModal] = useState(false);

  // Filter logic
  const filtered = weavers.filter((w) => {
    const matchSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.village.toLowerCase().includes(search.toLowerCase()) ||
      w.phone.includes(search);
    const matchVillage = villageFilter === 'All' || w.village === villageFilter;
    const matchStatus = statusFilter === 'All' || w.status === statusFilter;
    return matchSearch && matchVillage && matchStatus;
  });

  const handleImportSuccess = (importedRows) => {
    if (onBulkImportWeavers) {
      onBulkImportWeavers(importedRows);
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* 1. Header Banner matching reference image */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-6">
        {/* Soft Golden Silk Fabric Drape overlay on the right */}
        <div
          className="absolute inset-y-0 right-0 w-2/5 pointer-events-none opacity-25 mix-blend-multiply bg-cover bg-right"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80')`,
            maskImage: 'linear-gradient(to left, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 85%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 85%)',
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Title with Gold Accent Bar */}
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 bg-[#c88a2c] rounded-full shrink-0" />
            <div>
              <h1 className="text-2xl font-bold font-serif text-[#132036] tracking-tight">
                Weaver Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-sans mt-0.5">
                Registered handloom artisans across clusters
              </p>
            </div>
          </div>

          {/* Right Action Buttons: Export Excel, Import Excel, + Add Weaver */}
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
            {/* Export Excel Button */}
            <button
              onClick={() => exportWeaversToExcel(filtered)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
              title="Export current filtered records to an Excel (.xlsx) file"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export Excel</span>
            </button>

            {/* Import Excel Button */}
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
              title="Import weavers in bulk from Excel (.xlsx or .csv)"
            >
              <Upload className="w-4 h-4 text-[#1e5bbf]" />
              <span>Import Excel</span>
            </button>

            {/* + Add Weaver Button (navigates to dedicated Add Weaver page) */}
            <button
              onClick={onNavigateToAddWeaver}
              className="px-5 py-2.5 rounded-xl bg-[#1e5bbf] hover:bg-[#164799] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all duration-200 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Add Weaver</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Bar matching reference image */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search input with rounded pill styling */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-4 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-xs rounded-full border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-hidden focus:border-[#1e5bbf] transition-all text-slate-700"
          />
        </div>

        {/* Dropdowns on the right matching mockup pills */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Village Filter with Location Pin Icon */}
          <div className="relative">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-[#1e5bbf]" />
              <select
                value={villageFilter}
                onChange={(e) => setVillageFilter(e.target.value)}
                className="bg-transparent border-none outline-hidden cursor-pointer font-medium text-slate-700 pr-2 text-xs"
              >
                <option value="All">All Villages</option>
                <option value="Nallapatti">Nallapatti</option>
                <option value="Thingalur">Thingalur</option>
                <option value="Erode">Erode</option>
                <option value="Sirumugai">Sirumugai</option>
                <option value="Salem">Salem</option>
              </select>
            </div>
          </div>

          {/* Status Filter with CheckCircle Icon */}
          <div className="relative">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs cursor-pointer">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1e5bbf]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none outline-hidden cursor-pointer font-medium text-slate-700 pr-2 text-xs"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Table matching reference image */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Dark Navy Table Header */}
            <thead className="bg-[#132036] text-white">
              <tr>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-center w-14">
                  #
                </th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider">
                  NAME
                </th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider">
                  VILLAGE
                </th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider">
                  PHONE
                </th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider">
                  STATUS
                </th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-center w-28">
                  ACTIONS
                </th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                    No artisans found matching the current search & filters.
                  </td>
                </tr>
              ) : (
                filtered.map((weaver, idx) => (
                  <tr
                    key={weaver.id || idx}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Index */}
                    <td className="py-4 px-4 font-bold text-slate-700 text-center">
                      {idx + 1}
                    </td>

                    {/* Name */}
                    <td className="py-4 px-6 font-bold text-[#132036] text-sm">
                      {weaver.name}
                    </td>

                    {/* Village */}
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {weaver.village}
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-6 font-mono text-slate-700 font-medium">
                      {weaver.phone}
                    </td>

                    {/* Status Pill matching mockup: soft green pill with green bullet dot */}
                    <td className="py-4 px-6">
                      {weaver.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Action buttons matching mockup: light blue square (edit), light red square (delete) */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => onNavigateToEditWeaver(weaver)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                          title="Edit Artisan Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => onDeleteWeaver(weaver.id)}
                          className="p-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                          title="Remove Artisan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Table Pagination Footer matching reference image */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Showing 1 to {filtered.length} of 248 entries</span>

          <div className="flex items-center gap-1.5">
            {/* Prev button */}
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-1.5 px-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            >
              &lt;
            </button>

            {/* Page 1 (Active royal blue) */}
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                currentPage === 1
                  ? 'bg-[#1e5bbf] text-white shadow-2xs'
                  : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              1
            </button>

            {/* Page 2 */}
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                currentPage === 2
                  ? 'bg-[#1e5bbf] text-white shadow-2xs'
                  : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              2
            </button>

            {/* Page 3 */}
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                currentPage === 3
                  ? 'bg-[#1e5bbf] text-white shadow-2xs'
                  : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              3
            </button>

            <span className="px-1 text-slate-400">...</span>

            {/* Next button */}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-1.5 px-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* 5. Bottom Page Footer matching reference image */}
      <div className="pt-2 pb-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 border-t border-slate-200/60 mt-4">
        <span>© 2026 Handloom Weavers Management System. All rights reserved.</span>
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <span className="hidden sm:inline w-12 h-px bg-amber-400/80" />
          <span>Promoting Handloom • Empowering Artisans</span>
        </div>
      </div>

      {/* 6. Import Weavers from Excel Modal */}
      <ImportWeaversModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
};
