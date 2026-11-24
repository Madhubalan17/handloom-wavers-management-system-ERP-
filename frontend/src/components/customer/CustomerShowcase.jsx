import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Award,
  ShieldCheck,
  Search,
  Filter,
  Building2,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  Send,
  Heart,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import confetti from 'canvas-confetti';

export const CustomerShowcase = () => {
  const {
    finishedGoods,
    weaverProfiles,
    setActiveWeaverId,
    setCurrentRole,
    setActiveNav,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFabric, setSelectedFabric] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeModal, setActiveModal] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    quantity: '5',
    notes: '',
  });

  const filteredCatalog = finishedGoods.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFabric = selectedFabric === 'all' || item.fabric.toLowerCase().includes(selectedFabric.toLowerCase());
    return matchesSearch && matchesFabric;
  });

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setEnquirySuccess(true);
    setTimeout(() => {
      setEnquirySuccess(false);
      setActiveModal(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Showcase Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-amber-900 to-orange-950 p-8 sm:p-12 text-white shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Public Handloom Product Showcase (Phase 2)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-amber-50">
            Authentic Certified Handlooms from Traditional Weaving Clusters
          </h1>
          <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
            Directly connect with certified master weavers of Kanchipuram, Salem, and Madurai. Every piece is woven on traditional pit and frame looms with authentic GI Tags and Handloom Mark pedigree.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search pure silk sarees, Kasavu dhotis, shawls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-400 shrink-0">Fabric:</span>
          {['all', 'Silk', 'Cotton', 'Zari'].map((fab) => (
            <button
              key={fab}
              onClick={() => setSelectedFabric(fab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                selectedFabric === fab
                  ? 'bg-amber-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {fab === 'all' ? 'All Fabrics' : fab}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCatalog.map((product) => {
          const weaver = weaverProfiles[product.weaverId] || weaverProfiles['wvr-001'];

          return (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:border-amber-400 hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              {/* Product Image & Overlays */}
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-amber-950 font-mono shadow-xs">
                    {product.sku}
                  </span>
                  {product.giTagCertified && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                      <Award className="w-3 h-3" /> GI Tag
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 backdrop-blur-xs text-white">
                    {product.stockQuantity} pcs ready
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-amber-900">{product.category}</span>
                    <span>{weaver?.district}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-serif line-clamp-1 group-hover:text-amber-900 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Weaver Badge */}
                <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-amber-900 font-bold block">Weaver Producer:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[180px] block">
                      {weaver?.businessName}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Artisan Direct Price</span>
                    <span className="text-lg font-extrabold text-slate-900 font-serif">
                      {formatCurrency(product.retailPrice)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setActiveModal(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Send Order Enquiry
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Enquiry Modal */}
      <Modal
        isOpen={activeModal && selectedProduct !== null}
        onClose={() => setActiveModal(false)}
        title={`Send Order Enquiry for ${selectedProduct?.name}`}
        subtitle="Direct enquiry sent straight to the master weaver's dashboard"
      >
        {enquirySuccess ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Order Enquiry Sent to Weaver!
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              The weaver unit will review your order requirements and contact you via phone or email with wholesale pricing and dispatch schedule.
            </p>
          </div>
        ) : (
          <form onSubmit={handleEnquirySubmit} className="space-y-4 text-xs">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center gap-3">
              <img
                src={selectedProduct?.imageUrl}
                alt=""
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div>
                <p className="font-bold text-slate-900">{selectedProduct?.name}</p>
                <p className="text-[11px] text-slate-600">
                  SKU: {selectedProduct?.sku} • Direct Price: {formatCurrency(selectedProduct?.retailPrice)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Radhika Sundaram"
                  value={enquiryForm.name}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Phone *</label>
                <input
                  type="text"
                  placeholder="+91 98401 XXXXX"
                  value={enquiryForm.phone}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="radhika@boutique.in"
                  value={enquiryForm.email}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pieces Requested</label>
                <input
                  type="number"
                  min="1"
                  value={enquiryForm.quantity}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, quantity: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Enquiry Notes / Custom Requirements</label>
              <textarea
                placeholder="Mention wedding date, colour preference, or wholesale shop delivery details..."
                value={enquiryForm.notes}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 h-20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setActiveModal(false)}
                className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-900 text-white font-bold hover:bg-amber-950 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>Submit Order Request</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
