import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  Search,
  Tag,
  Award,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export const FinishedGoodsStock = () => {
  const { weaverFinishedGoods, setActiveNav, currentWeaverProfile } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredGoods = weaverFinishedGoods.filter(fg => {
    const matchesSearch = fg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fg.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fg.fabric.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || fg.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalFinishedPieces = weaverFinishedGoods.reduce((sum, g) => sum + g.stockQuantity, 0);
  const totalValuation = weaverFinishedGoods.reduce((sum, g) => sum + (g.stockQuantity * g.wholesalePrice), 0);

  return (
    <div className="space-y-6">
      {/* Header and Valuation Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            Finished Goods Stock
          </h1>
          <p className="text-xs text-slate-500">
            Certified inventory updated automatically from quality audits; depleted only upon invoiced sales
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Finished Stock Valuation
            </span>
            <span className="text-sm font-extrabold text-slate-900 font-serif">
              {formatCurrency(totalValuation)}
            </span>
          </div>
          <button
            onClick={() => setActiveNav('sales')}
            className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-amber-300" />
            <span>Create Sale</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by SKU, fabric, saree name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-400 shrink-0">Category:</span>
          {['all', 'Saree', 'Dhoti', 'Shawl'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                categoryFilter === cat
                  ? 'bg-amber-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Finished Goods Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoods.map((item) => {
          const isLowStock = item.stockQuantity <= item.minimumStock;
          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Product Image & Badges */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-amber-950 font-mono shadow-xs">
                    {item.sku}
                  </span>
                  {item.giTagCertified && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                      <Award className="w-3 h-3" /> GI Tag
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold shadow-md ${
                    isLowStock ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-900/80 backdrop-blur-xs text-white'
                  }`}>
                    {item.stockQuantity} pcs in stock
                  </span>
                </div>
              </div>

              {/* Product Content */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span>{item.category}</span>
                    <span>GST: {item.gstPercentage}%</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 font-serif line-clamp-1 group-hover:text-amber-900 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Fabric:</span>
                    <span className="font-semibold text-slate-900">{item.fabric}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Colour & Size:</span>
                    <span className="font-semibold text-slate-900">{item.colour} ({item.size})</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Wholesale</span>
                      <span className="font-bold text-slate-800 text-sm">{formatCurrency(item.wholesalePrice)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Suggested Retail</span>
                      <span className="font-extrabold text-amber-900 text-sm font-serif">{formatCurrency(item.retailPrice)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveNav('sales')}
                  className="w-full mt-2 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Invoice This Product</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
