import React, { useState } from 'react';
import { TrendingUp, Search, Plus, Edit2, Trash2, Calendar, User, Cpu, Award } from 'lucide-react';

export const initialProductionRecords = [
  {
    id: 1,
    weaverName: 'R. Selvi',
    loomNo: 'L-001',
    productionMtrs: 120,
    fabricType: 'Pure Silk & Zari Weaving',
    date: '24-11-2026',
    qualityGrade: 'Grade A (Export Quality)',
    fabricImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    weaverName: 'M. Kumar',
    loomNo: 'L-002',
    productionMtrs: 100,
    fabricType: 'Organic Cotton Weave',
    date: '24-11-2026',
    qualityGrade: 'Grade A (Co-optex Certified)',
    fabricImage: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    weaverName: 'P. Lakshmi',
    loomNo: 'L-003',
    productionMtrs: 110,
    fabricType: 'Heavy Jacquard Durrie',
    date: '23-11-2026',
    qualityGrade: 'Grade A (Export Quality)',
    fabricImage: '',
  },
  {
    id: 4,
    weaverName: 'S. Murugan',
    loomNo: 'L-001',
    productionMtrs: 90,
    fabricType: 'Fine Cotton Yardage',
    date: '22-11-2026',
    qualityGrade: 'Grade B (Standard Market)',
    fabricImage: '',
  },
];

export const ProductionTrackingView = ({
  records = initialProductionRecords,
  onNavigateToAddRecord,
  onNavigateToEditRecord,
  onDeleteRecord,
}) => {
  const [search, setSearch] = useState('');

  const filtered = (records || []).filter((r) => {
    const w = (r.weaverName || r.weaver_name || '').toLowerCase();
    const l = (r.loomNo || r.loom_no || '').toLowerCase();
    const f = (r.fabricType || r.fabric_type || '').toLowerCase();
    const q = search.toLowerCase();
    return w.includes(q) || l.includes(q) || f.includes(q);
  });

  return (
    <div className="space-y-4 font-sans">
      {/* Header Banner matching Screen 8 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-1.5 h-10 bg-[#c88a2c] rounded-full shrink-0 mt-0.5" />
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-serif tracking-tight">
              Production Tracking
            </h1>
            <p className="text-xs text-slate-500">
              Daily handloom fabric output logs, meters produced, and quality inspection records
            </p>
          </div>
        </div>

        {/* Primary "+ Add Record" opens dedicated AddProductionRecordPage */}
        <button
          type="button"
          onClick={onNavigateToAddRecord}
          className="px-4 py-2.5 rounded-xl bg-[#1e5bbf] hover:bg-[#164799] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.02] active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Production Log</span>
        </button>
      </div>

      {/* Search Input matching Screen 8 */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by weaver, loom, fabric type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf]"
          />
        </div>
      </div>

      {/* Table matching Screen 8 with Fabric Photo Thumbnails */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#152238] text-white font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12">#</th>
                <th className="py-3.5 px-4">Fabric Sample / Variety</th>
                <th className="py-3.5 px-4">Weaver Artisan</th>
                <th className="py-3.5 px-4">Loom Unit</th>
                <th className="py-3.5 px-4">Output (Mtrs)</th>
                <th className="py-3.5 px-4">Log Date</th>
                <th className="py-3.5 px-4">Quality Grade</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((record, index) => {
                const wName = record.weaverName || record.weaver_name;
                const lNo = record.loomNo || record.loom_no;
                const mtrs = record.productionMtrs || record.meters_produced;
                const fType = record.fabricType || record.fabric_type || 'Handloom Silk';
                const fDate = record.date || record.production_date;
                const img = record.fabricImage || record.fabric_image;

                return (
                  <tr key={record.id || index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {index + 1}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-rose-50 border border-rose-200/70 shrink-0 flex items-center justify-center">
                          {img ? (
                            <img
                              src={img}
                              alt={fType}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center text-rose-700 ${img ? 'hidden' : ''}`}>
                            <TrendingUp className="w-5 h-5 text-rose-600" />
                          </div>
                        </div>

                        <div>
                          <span className="font-bold text-slate-900 text-sm block line-clamp-1">
                            {fType}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Log #{record.id || index + 1}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#1e5bbf]" />
                        <span>{wName}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {lNo}
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-blue-700 text-sm font-serif">
                      {mtrs} mtrs
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {fDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        {record.qualityGrade || 'Grade A'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onNavigateToEditRecord(record)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-2xs"
                          title="Edit Production Entry"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteRecord(record.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors shadow-2xs"
                          title="Delete Record"
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

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {filtered.length} of {records.length} production logs</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">&lt;</button>
            <button className="px-2.5 py-1 rounded bg-[#1e5bbf] text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};
