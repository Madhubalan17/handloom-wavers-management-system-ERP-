import React, { useState } from 'react';
import { Package, Plus, Edit2, Trash2, Camera, Layers, Coins } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const initialYarnStock = [
  {
    id: 1,
    yarnType: 'Cotton Yarn',
    quantity: 500,
    status: 'In Stock',
    unitPrice: 380,
    supplier: 'Coimbatore Cotton Spinners',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    yarnType: 'Silk Yarn',
    quantity: 200,
    status: 'In Stock',
    unitPrice: 4200,
    supplier: 'Karnataka Silk Marketing Board',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    yarnType: 'Polyester',
    quantity: 300,
    status: 'In Stock',
    unitPrice: 220,
    supplier: 'Tamil Nadu Textile Corporation',
    image: '',
  },
  {
    id: 4,
    yarnType: 'Mixed Yarn',
    quantity: 150,
    status: 'In Stock',
    unitPrice: 340,
    supplier: 'Erode Cluster Depot',
    image: '',
  },
];

export const YarnStockView = ({
  stockList = initialYarnStock,
  onNavigateToAddStock,
  onNavigateToEditStock,
  onDeleteStock,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = (stockList || []).filter((s) => {
    const yType = (s.yarnType || s.yarn_type || '').toLowerCase();
    const sup = (s.supplier || '').toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = yType.includes(q) || sup.includes(q);
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4 font-sans">
      {/* Header Banner matching Screen 7 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-1.5 h-10 bg-[#c88a2c] rounded-full shrink-0 mt-0.5" />
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-serif tracking-tight">
              Yarn & Stock Management
            </h1>
            <p className="text-xs text-slate-500">
              Raw material inventory depot: cotton, mulberry silk, and zari consignments
            </p>
          </div>
        </div>

        {/* Primary "+ Add Stock" opens dedicated AddYarnStockPage */}
        <button
          type="button"
          onClick={onNavigateToAddStock}
          className="px-4 py-2.5 rounded-xl bg-[#1e5bbf] hover:bg-[#164799] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.02] active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Stock Consignment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by yarn type, supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#1e5bbf]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium"
          >
            <option value="All">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Table matching Screen 7 with Yarn Photo Thumbnails */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#152238] text-white font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12">#</th>
                <th className="py-3.5 px-4">Yarn Consignment</th>
                <th className="py-3.5 px-4">Available Quantity</th>
                <th className="py-3.5 px-4">Unit Rate (₹/Kg)</th>
                <th className="py-3.5 px-4">Supplier / Depot</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item, index) => {
                const qty = item.quantity || item.quantity_kg || 0;
                const unitPrice = item.unitPrice || item.unit_price || 380;
                const yarnName = item.yarnType || item.yarn_type;

                return (
                  <tr key={item.id || index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {index + 1}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-50 border border-amber-200/70 shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={yarnName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center text-amber-700 ${item.image ? 'hidden' : ''}`}>
                            <Package className="w-5 h-5 text-amber-600" />
                          </div>
                        </div>

                        <div>
                          <span className="font-bold text-slate-900 text-sm block">
                            {yarnName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Batch: LOT-ERD-2026-{100 + (item.id || index)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-slate-900 text-sm font-mono">
                      {qty} Kg
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      ₹{unitPrice} / kg
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {item.supplier || 'Co-optex Central Depot'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.status === 'In Stock'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}>
                        ● {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onNavigateToEditStock(item)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-2xs"
                          title="Edit Stock Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteStock(item.id)}
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
          <span>Showing 1 to {filtered.length} of {stockList.length} stock consignments</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">&lt;</button>
            <button className="px-2.5 py-1 rounded bg-[#1e5bbf] text-white font-bold">1</button>
            <button className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};
