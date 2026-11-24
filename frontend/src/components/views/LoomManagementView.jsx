import React, { useState } from 'react';
import { Cpu, Search, Plus, Edit2, Trash2, Camera, ShieldCheck, MapPin, User } from 'lucide-react';

export const initialLoomsList = [
  {
    id: 1,
    loomNo: 'L-001',
    type: 'Power Loom',
    status: 'Active',
    village: 'Nallapatti',
    assignedWeaver: 'R. Selvi',
    dailyCapacity: '35 mtrs / day',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    loomNo: 'L-002',
    type: 'Handloom',
    status: 'Active',
    village: 'Thingalur',
    assignedWeaver: 'M. Kumar',
    dailyCapacity: '12 mtrs / day',
    image: '',
  },
  {
    id: 3,
    loomNo: 'L-003',
    type: 'Power Loom',
    status: 'Inactive',
    village: 'Erode',
    assignedWeaver: 'P. Lakshmi',
    dailyCapacity: '30 mtrs / day',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    loomNo: 'L-004',
    type: 'Handloom',
    status: 'Active',
    village: 'Nallapatti',
    assignedWeaver: 'S. Murugan',
    dailyCapacity: '15 mtrs / day',
    image: '',
  },
  {
    id: 5,
    loomNo: 'L-005',
    type: 'Power Loom',
    status: 'Active',
    village: 'Chennimalai',
    assignedWeaver: 'K. Devi',
    dailyCapacity: '40 mtrs / day',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
  },
];

export const LoomManagementView = ({
  looms = initialLoomsList,
  onNavigateToAddLoom,
  onNavigateToEditLoom,
  onDeleteLoom,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = (looms || []).filter((l) => {
    const no = (l.loomNo || l.loom_no || '').toLowerCase();
    const tp = (l.type || l.loom_type || '').toLowerCase();
    const v = (l.village || l.cluster_village || '').toLowerCase();
    const w = (l.assignedWeaver || l.assigned_weaver || '').toLowerCase();
    const q = search.toLowerCase();

    const matchSearch = no.includes(q) || tp.includes(q) || v.includes(q) || w.includes(q);
    const matchStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4 font-sans">
      {/* Header matching Screen 5 & Weaver Page Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-1.5 h-10 bg-[#c88a2c] rounded-full shrink-0 mt-0.5" />
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-serif tracking-tight">
              Loom Management
            </h1>
            <p className="text-xs text-slate-500">
              Handlooms, pit looms, and power loom units registered across cooperative clusters
            </p>
          </div>
        </div>

        {/* Primary "+ Add Loom" navigates to full AddLoomPage */}
        <button
          type="button"
          onClick={onNavigateToAddLoom}
          className="px-4 py-2.5 rounded-xl bg-[#1e5bbf] hover:bg-[#164799] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.02] active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Loom</span>
        </button>
      </div>

      {/* Filter and Search Bar matching Screen 5 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by loom no, type, weaver, village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="All">All Status</option>
            <option value="Active">Active Units</option>
            <option value="Inactive">Inactive</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Under Repair">Under Repair</option>
          </select>
        </div>
      </div>

      {/* Table matching Screen 5 with Loom Photo Thumbnails */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#152238] text-white font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12">#</th>
                <th className="py-3.5 px-4">Loom Unit</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Cluster / Shed</th>
                <th className="py-3.5 px-4">Assigned Weaver</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((loom, index) => {
                const isActive = loom.status === 'Active';
                const loomNo = loom.loomNo || loom.loom_no || `L-${loom.id}`;
                const loomType = loom.type || loom.loom_type || 'Handloom';
                const village = loom.village || loom.cluster_village || 'Nallapatti';
                const weaver = loom.assignedWeaver || loom.assigned_weaver || 'Unassigned';

                return (
                  <tr key={loom.id || index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {index + 1}
                    </td>

                    {/* Loom Unit with Photo Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-50 border border-amber-200/70 shrink-0 flex items-center justify-center">
                          {loom.image ? (
                            <img
                              src={loom.image}
                              alt={loomNo}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center text-amber-700 ${loom.image ? 'hidden' : ''}`}>
                            <Cpu className="w-5 h-5 text-amber-600" />
                          </div>
                        </div>

                        <div>
                          <span className="font-bold text-slate-900 font-mono text-sm block">
                            {loomNo}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ID: HWMS-{loom.id || index + 1}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {loomType}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{village}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-800 font-medium">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#1e5bbf]" />
                        <span>{weaver}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : loom.status === 'Under Maintenance' || loom.status === 'Under Repair'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-rose-100 text-rose-800 border-rose-200'
                      }`}>
                        ● {loom.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button opens AddLoomPage in edit mode */}
                        <button
                          type="button"
                          onClick={() => onNavigateToEditLoom(loom)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-2xs"
                          title="Edit Loom Unit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => onDeleteLoom(loom.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors shadow-2xs"
                          title="Delete Loom Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer pagination matching UI */}
        <div className="px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>Showing 1 to {filtered.length} of {looms.length} loom units</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">&lt;</button>
            <button className="px-2.5 py-1 rounded bg-[#1e5bbf] text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50">2</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50">3</button>
            <span>...</span>
            <button className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};
