import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  SlidersHorizontal,
  AlertTriangle,
  History,
  Search,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Modal } from '../common/Modal';

export const RawMaterialInventory = () => {
  const {
    weaverMaterials,
    weaverMovements,
    suppliers,
    recordStockMovement,
    addMaterial,
    platformSettings,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeModal, setActiveModal] = useState(null); // 'in' | 'out' | 'adjustment' | 'add_material' | null
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [inwardForm, setInwardForm] = useState({
    materialId: '',
    quantity: '',
    rate: '',
    invoiceNo: '',
    supplierId: '',
    notes: '',
  });

  const [outwardForm, setOutwardForm] = useState({
    materialId: '',
    quantity: '',
    workOrderId: '',
    notes: '',
  });

  const [adjustmentForm, setAdjustmentForm] = useState({
    materialId: '',
    quantity: '', // positive or negative
    reason: '',
    notes: '',
  });

  const [newMaterialForm, setNewMaterialForm] = useState({
    name: '',
    category: 'Yarn',
    unit: 'kg',
    colour: '',
    countQuality: '',
    currentStock: '0',
    minimumStock: '5',
    ratePerUnit: '',
    supplierId: '',
  });

  // Filtered materials
  const filteredMaterials = weaverMaterials.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.colour.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.countQuality.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Handle Inward Movement Submit
  const handleInwardSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const res = recordStockMovement({
      materialId: inwardForm.materialId,
      movementType: 'in',
      quantity: inwardForm.quantity,
      rate: inwardForm.rate,
      invoiceNo: inwardForm.invoiceNo,
      supplierId: inwardForm.supplierId,
      notes: inwardForm.notes,
    });

    if (!res.success) {
      setErrorMessage(res.error);
    } else {
      setSuccessMessage('Material stock added successfully!');
      setActiveModal(null);
      setInwardForm({ materialId: '', quantity: '', rate: '', invoiceNo: '', supplierId: '', notes: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Handle Outward Movement Submit
  const handleOutwardSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const res = recordStockMovement({
      materialId: outwardForm.materialId,
      movementType: 'out',
      quantity: outwardForm.quantity,
      workOrderId: outwardForm.workOrderId,
      notes: outwardForm.notes,
    });

    if (!res.success) {
      setErrorMessage(res.error);
    } else {
      setSuccessMessage('Material stock issued successfully!');
      setActiveModal(null);
      setOutwardForm({ materialId: '', quantity: '', workOrderId: '', notes: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Handle Stock Adjustment Submit
  const handleAdjustmentSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const res = recordStockMovement({
      materialId: adjustmentForm.materialId,
      movementType: 'adjustment',
      quantity: adjustmentForm.quantity,
      reason: adjustmentForm.reason,
      notes: adjustmentForm.notes,
    });

    if (!res.success) {
      setErrorMessage(res.error);
    } else {
      setSuccessMessage('Stock adjustment recorded in audit ledger!');
      setActiveModal(null);
      setAdjustmentForm({ materialId: '', quantity: '', reason: '', notes: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Handle Add Material
  const handleAddMaterialSubmit = (e) => {
    e.preventDefault();
    addMaterial(newMaterialForm);
    setSuccessMessage('New material added to inventory catalog!');
    setActiveModal(null);
    setNewMaterialForm({
      name: '',
      category: 'Yarn',
      unit: 'kg',
      colour: '',
      countQuality: '',
      currentStock: '0',
      minimumStock: '5',
      ratePerUnit: '',
      supplierId: '',
    });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            Raw Material & Inventory Management
          </h1>
          <p className="text-xs text-slate-500">
            Isolated weaver stock tracking for yarn, pure zari, and dyes with non-negative audit control
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setActiveModal('in');
              setErrorMessage('');
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Stock In (Supplier Receipt)</span>
          </button>
          <button
            onClick={() => {
              setActiveModal('out');
              setErrorMessage('');
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Stock Out (Work Order)</span>
          </button>
          <button
            onClick={() => {
              setActiveModal('adjustment');
              setErrorMessage('');
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Audit Adjustment</span>
          </button>
          <button
            onClick={() => {
              setActiveModal('add_material');
              setErrorMessage('');
            }}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Material</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search material, count, colour..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-amber-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-400 shrink-0">Filter:</span>
          {['all', 'Yarn', 'Zari', 'Dye', 'Packaging'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                categoryFilter === cat
                  ? 'bg-amber-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Material Name & Quality</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Colour / Shade</th>
                <th className="px-4 py-3.5">Unit</th>
                <th className="px-4 py-3.5">Rate / Unit</th>
                <th className="px-4 py-3.5">Current Stock</th>
                <th className="px-4 py-3.5">Min Stock Alert</th>
                <th className="px-4 py-3.5">Stock Status</th>
                <th className="px-5 py-3.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMaterials.map((mat) => {
                const isLow = mat.currentStock <= mat.minimumStock;
                return (
                  <tr key={mat.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{mat.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{mat.countQuality}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {mat.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{mat.colour}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-700">{mat.unit}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">
                      {formatCurrency(mat.ratePerUnit)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-extrabold ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>
                        {mat.currentStock} {mat.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 font-medium">
                      {mat.minimumStock} {mat.unit}
                    </td>
                    <td className="px-4 py-3.5">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Adequate
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setInwardForm({ ...inwardForm, materialId: mat.id, rate: mat.ratePerUnit });
                          setActiveModal('in');
                        }}
                        className="text-amber-800 hover:text-amber-950 font-bold text-[11px] hover:underline"
                      >
                        + Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movement Audit Log (Section 7.4) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-800" />
            <h2 className="text-base font-bold text-slate-900 font-serif">
              Stock Movement Audit Ledger (Traceability)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Immutable movement history
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b">
              <tr>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Material</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Qty Movement</th>
                <th className="px-4 py-2.5">Ref / Invoice / WO</th>
                <th className="px-4 py-2.5">Supplier / Reason</th>
                <th className="px-4 py-2.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {weaverMovements.map((mv) => {
                const isIn = mv.movementType === 'in';
                const isOut = mv.movementType === 'out';
                return (
                  <tr key={mv.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 text-slate-500 font-mono">{formatDate(mv.date)}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-800">{mv.materialName}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isIn ? 'bg-emerald-100 text-emerald-800' :
                        isOut ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {mv.movementType}
                      </span>
                    </td>
                    <td className={`px-4 py-2.5 font-bold ${isIn ? 'text-emerald-700' : 'text-slate-800'}`}>
                      {isIn ? `+${mv.quantity}` : mv.quantity} {mv.unit}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-slate-600">
                      {mv.invoiceNo || mv.workOrderId || '-'}
                    </td>
                    <td className="px-4 py-2.5 text-slate-700">
                      {mv.supplierName || mv.reason || '-'}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 max-w-xs truncate">{mv.notes || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock In Modal */}
      <Modal
        isOpen={activeModal === 'in'}
        onClose={() => setActiveModal(null)}
        title="Stock Inward Receipt (Supplier Purchase)"
        subtitle="Record raw materials received from yarn/zari supplier with invoice verification"
      >
        <form onSubmit={handleInwardSubmit} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              {errorMessage}
            </div>
          )}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Material *</label>
            <select
              value={inwardForm.materialId}
              onChange={(e) => {
                const mat = weaverMaterials.find(m => m.id === e.target.value);
                setInwardForm({ 
                  ...inwardForm, 
                  materialId: e.target.value,
                  rate: mat ? mat.ratePerUnit : inwardForm.rate 
                });
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
              required
            >
              <option value="">-- Choose Material --</option>
              {weaverMaterials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.colour}) - Current: {m.currentStock} {m.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Quantity Inward *</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 10.5"
                value={inwardForm.quantity}
                onChange={(e) => setInwardForm({ ...inwardForm, quantity: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Rate Per Unit (₹) *</label>
              <input
                type="number"
                placeholder="₹ Rate"
                value={inwardForm.rate}
                onChange={(e) => setInwardForm({ ...inwardForm, rate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Supplier *</label>
              <select
                value={inwardForm.supplierId}
                onChange={(e) => setInwardForm({ ...inwardForm, supplierId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              >
                <option value="">-- Select Supplier --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.district})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Supplier Invoice # *</label>
              <input
                type="text"
                placeholder="e.g. SLM-2026-904"
                value={inwardForm.invoiceNo}
                onChange={(e) => setInwardForm({ ...inwardForm, invoiceNo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Receipt Notes</label>
            <textarea
              placeholder="Batch number, tensile strength inspection, dye batch details..."
              value={inwardForm.notes}
              onChange={(e) => setInwardForm({ ...inwardForm, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 h-20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900"
            >
              Confirm Stock In
            </button>
          </div>
        </form>
      </Modal>

      {/* Stock Out Modal */}
      <Modal
        isOpen={activeModal === 'out'}
        onClose={() => setActiveModal(null)}
        title="Stock Outward Issue (Work Order)"
        subtitle="Issue yarn or zari to active work orders; system prevents stock from becoming negative"
      >
        <form onSubmit={handleOutwardSubmit} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              {errorMessage}
            </div>
          )}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Material to Issue *</label>
            <select
              value={outwardForm.materialId}
              onChange={(e) => setOutwardForm({ ...outwardForm, materialId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
              required
            >
              <option value="">-- Choose Material --</option>
              {weaverMaterials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (Available: {m.currentStock} {m.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Quantity to Deduct *</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 2.4"
                value={outwardForm.quantity}
                onChange={(e) => setOutwardForm({ ...outwardForm, quantity: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Work Order Reference</label>
              <input
                type="text"
                placeholder="e.g. WO-KPM-2026-081"
                value={outwardForm.workOrderId}
                onChange={(e) => setOutwardForm({ ...outwardForm, workOrderId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Notes / Loom Shed</label>
            <textarea
              placeholder="Issued to Pit Loom 2 for temple border warp..."
              value={outwardForm.notes}
              onChange={(e) => setOutwardForm({ ...outwardForm, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 h-20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-800 text-white font-bold hover:bg-amber-900"
            >
              Confirm Issue
            </button>
          </div>
        </form>
      </Modal>

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={activeModal === 'adjustment'}
        onClose={() => setActiveModal(null)}
        title="Stock Audit Adjustment"
        subtitle="Mandatory reason required (damage, wastage, physical stock reconciliation)"
      >
        <form onSubmit={handleAdjustmentSubmit} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              {errorMessage}
            </div>
          )}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Material *</label>
            <select
              value={adjustmentForm.materialId}
              onChange={(e) => setAdjustmentForm({ ...adjustmentForm, materialId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
              required
            >
              <option value="">-- Choose Material --</option>
              {weaverMaterials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (Current: {m.currentStock} {m.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Quantity Difference (Use negative for loss/damage, e.g. -1.5) *
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. -0.5 or +1.0"
              value={adjustmentForm.quantity}
              onChange={(e) => setAdjustmentForm({ ...adjustmentForm, quantity: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mandatory Audit Reason *</label>
            <select
              value={adjustmentForm.reason}
              onChange={(e) => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
              required
            >
              <option value="">-- Select Reason --</option>
              <option value="Damage during handling / moisture in shed">Damage during handling / moisture in shed</option>
              <option value="Warping & bobbin winding wastage correction">Warping & bobbin winding wastage correction</option>
              <option value="Physical count audit reconciliation">Physical count audit reconciliation</option>
              <option value="Supplier invoice count correction">Supplier invoice count correction</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Audit Notes / Explanation</label>
            <textarea
              placeholder="Provide specific notes for manager / audit ledger..."
              value={adjustmentForm.notes}
              onChange={(e) => setAdjustmentForm({ ...adjustmentForm, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 h-20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-950"
            >
              Record Adjustment
            </button>
          </div>
        </form>
      </Modal>

      {/* Add New Material to Catalog Modal */}
      <Modal
        isOpen={activeModal === 'add_material'}
        onClose={() => setActiveModal(null)}
        title="Add Material to Inventory Catalog"
        subtitle="Register new yarn, dye, zari, or packaging specification"
      >
        <form onSubmit={handleAddMaterialSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Material Name *</label>
            <input
              type="text"
              placeholder="e.g. Mulberry Silk Yarn 20/22D or Tested Silver Zari"
              value={newMaterialForm.name}
              onChange={(e) => setNewMaterialForm({ ...newMaterialForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={newMaterialForm.category}
                onChange={(e) => setNewMaterialForm({ ...newMaterialForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              >
                {platformSettings.materialCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit *</label>
              <select
                value={newMaterialForm.unit}
                onChange={(e) => setNewMaterialForm({ ...newMaterialForm, unit: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              >
                {platformSettings.measurementUnits.map((u) => (
                  <option key={u.code} value={u.code}>{u.name} ({u.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Rate / Unit (₹) *</label>
              <input
                type="number"
                placeholder="Rate"
                value={newMaterialForm.ratePerUnit}
                onChange={(e) => setNewMaterialForm({ ...newMaterialForm, ratePerUnit: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Colour / Shade</label>
              <input
                type="text"
                placeholder="e.g. Natural Ivory, Deep Crimson"
                value={newMaterialForm.colour}
                onChange={(e) => setNewMaterialForm({ ...newMaterialForm, colour: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Count / Quality Spec</label>
              <input
                type="text"
                placeholder="e.g. 80s Combed or Grade 1 Half-Fine"
                value={newMaterialForm.countQuality}
                onChange={(e) => setNewMaterialForm({ ...newMaterialForm, countQuality: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Initial Opening Stock</label>
              <input
                type="number"
                step="0.01"
                value={newMaterialForm.currentStock}
                onChange={(e) => setNewMaterialForm({ ...newMaterialForm, currentStock: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Low-Stock Alert Threshold *</label>
              <input
                type="number"
                step="0.01"
                value={newMaterialForm.minimumStock}
                onChange={(e) => setNewMaterialForm({ ...newMaterialForm, minimumStock: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-900 text-white font-bold hover:bg-amber-950"
            >
              Save Material
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
