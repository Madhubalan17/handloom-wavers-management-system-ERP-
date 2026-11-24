import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardList,
  Plus,
  Play,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Cpu,
  User,
  Layers,
  Sparkles,
} from 'lucide-react';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';
import { Modal } from '../common/Modal';

export const WorkOrdersProduction = () => {
  const {
    weaverWorkOrders,
    weaverLooms,
    weaverWorkers,
    createWorkOrder,
    updateWorkOrderProgress,
    platformSettings,
    currentWeaverProfile,
  } = useApp();

  const [activeModal, setActiveModal] = useState(null); // 'create' | 'update_progress' | null
  const [selectedWO, setSelectedWO] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form states
  const [newWOForm, setNewWOForm] = useState({
    productName: '',
    category: 'Saree',
    quantityOrdered: '2',
    unit: 'pieces',
    materialsRequired: '',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
    priority: 'Normal',
    assignedLoomId: '',
    assignedWorkerId: '',
    notes: '',
  });

  const [progressForm, setProgressForm] = useState({
    progressPercentage: 50,
    quantityCompleted: 1,
    materialConsumed: '',
    wastageRecorded: '',
    notes: '',
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const loom = weaverLooms.find(l => l.id === newWOForm.assignedLoomId);
    const worker = weaverWorkers.find(w => w.id === newWOForm.assignedWorkerId);

    createWorkOrder({
      ...newWOForm,
      assignedLoomNumber: loom ? loom.loomNumber : 'Unassigned',
      assignedWorkerName: worker ? worker.name : 'Unassigned',
    });

    setSuccessMessage('Work order registered successfully and assigned to loom/artisan!');
    setActiveModal(null);
    setNewWOForm({
      productName: '',
      category: 'Saree',
      quantityOrdered: '2',
      unit: 'pieces',
      materialsRequired: '',
      startDate: new Date().toISOString().split('T')[0],
      targetDate: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
      priority: 'Normal',
      assignedLoomId: '',
      assignedWorkerId: '',
      notes: '',
    });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleProgressSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const res = updateWorkOrderProgress(selectedWO.id, progressForm);
    if (!res.success) {
      setErrorMessage(res.error);
    } else {
      setSuccessMessage('Production progress and material consumption updated!');
      setActiveModal(null);
      setSelectedWO(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const filteredOrders = weaverWorkOrders.filter(wo => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'overdue') return wo.status !== 'closed' && wo.targetDate && wo.targetDate < todayStr;
    return wo.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            Work Orders & Production Tracking
          </h1>
          <p className="text-xs text-slate-500">
            End-to-end weaving workflow: order specs, loom assignment, daily progress, material consumption & wastage
          </p>
        </div>

        <button
          onClick={() => {
            setActiveModal('create');
            setErrorMessage('');
          }}
          className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>New Work Order</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-400">Filter Status:</span>
        {[
          { id: 'all', label: 'All Orders' },
          { id: 'in_progress', label: 'In Progress' },
          { id: 'submitted', label: 'Ready for QA' },
          { id: 'overdue', label: '⚠️ Overdue' },
          { id: 'rework', label: 'Rework Required' },
          { id: 'closed', label: 'Closed / In Stock' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setStatusFilter(f.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
              statusFilter === f.id
                ? 'bg-amber-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Work Orders List / Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
            No work orders match the selected filter.
          </div>
        ) : (
          filteredOrders.map((wo) => {
            const isOverdue = wo.status !== 'closed' && wo.targetDate && wo.targetDate < todayStr;
            const isReadyForQA = wo.status === 'submitted';

            return (
              <div
                key={wo.id}
                className={`bg-white rounded-3xl border p-5 shadow-xs transition-all space-y-4 ${
                  isOverdue ? 'border-rose-300 ring-2 ring-rose-500/10' : 'border-slate-200/80 hover:border-amber-300'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-amber-950 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      {wo.workOrderNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border ${getStatusBadgeClass(wo.status)}`}>
                      {wo.status.replace('_', ' ')}
                    </span>
                    {isOverdue && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                        ⚠️ Overdue Target
                      </span>
                    )}
                    {wo.priority === 'Urgent' && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-orange-100 text-orange-900">
                        Urgent Priority
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Start: {formatDate(wo.startDate)}
                    </span>
                    <span>•</span>
                    <span className={`font-semibold ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                      Deadline: {formatDate(wo.targetDate)}
                    </span>
                  </div>
                </div>

                {/* Main Content Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-serif">
                      {wo.productName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Category: {wo.category} • Target Qty: <span className="font-bold text-slate-900">{wo.quantityOrdered} {wo.unit}</span>
                    </p>
                    <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                      <p><span className="font-semibold text-slate-700">Required:</span> {wo.materialsRequired || 'Yarn & Zari as per specs'}</p>
                      <p><span className="font-semibold text-slate-700">Consumed:</span> {wo.materialConsumed || 'Pending entry'}</p>
                      <p><span className="font-semibold text-slate-700">Wastage Log:</span> {wo.wastageRecorded || 'None'}</p>
                    </div>
                  </div>

                  {/* Loom & Artisan Info */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-amber-800" />
                      <div>
                        <span className="text-slate-500 text-[11px] block">Allocated Loom</span>
                        <span className="font-bold text-slate-900">{wo.assignedLoomNumber || 'Not assigned'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-800" />
                      <div>
                        <span className="text-slate-500 text-[11px] block">Master Artisan</span>
                        <span className="font-bold text-slate-900">{wo.assignedWorkerName || 'Not assigned'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress & Actions */}
                  <div className="space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-600">
                          {wo.quantityCompleted} of {wo.quantityOrdered} {wo.unit} Completed
                        </span>
                        <span className="text-amber-900">{wo.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${wo.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      {isReadyForQA ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          <span>Submitted for Quality Inspection</span>
                        </div>
                      ) : wo.status === 'closed' ? (
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Passed QA & In Stock
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedWO(wo);
                            setProgressForm({
                              progressPercentage: wo.progressPercentage || 0,
                              quantityCompleted: wo.quantityCompleted || 0,
                              materialConsumed: wo.materialConsumed || '',
                              wastageRecorded: wo.wastageRecorded || '',
                              notes: wo.notes || '',
                            });
                            setActiveModal('update_progress');
                            setErrorMessage('');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                        >
                          <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
                          <span>Update Progress & Usage</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {wo.notes && (
                  <p className="text-[11px] text-slate-500 italic border-t pt-2">
                    Note: {wo.notes}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Work Order Modal */}
      <Modal
        isOpen={activeModal === 'create'}
        onClose={() => setActiveModal(null)}
        title="Create New Production Work Order"
        subtitle="Specify handloom product design, target deadline, materials and loom allocation"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Product / Design Title *</label>
            <input
              type="text"
              placeholder="e.g. Kanchipuram Pure Silk Bridal Saree - Korvai Peacock"
              value={newWOForm.productName}
              onChange={(e) => setNewWOForm({ ...newWOForm, productName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={newWOForm.category}
                onChange={(e) => setNewWOForm({ ...newWOForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              >
                {platformSettings.productCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Quantity Required *</label>
              <input
                type="number"
                min="1"
                value={newWOForm.quantityOrdered}
                onChange={(e) => setNewWOForm({ ...newWOForm, quantityOrdered: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={newWOForm.priority}
                onChange={(e) => setNewWOForm({ ...newWOForm, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Assign to Loom</label>
              <select
                value={newWOForm.assignedLoomId}
                onChange={(e) => setNewWOForm({ ...newWOForm, assignedLoomId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              >
                <option value="">-- Select Pit / Frame Loom --</option>
                {weaverLooms.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.loomNumber} ({l.type}) - Status: {l.status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Assign to Artisan</label>
              <select
                value={newWOForm.assignedWorkerId}
                onChange={(e) => setNewWOForm({ ...newWOForm, assignedWorkerId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              >
                <option value="">-- Select Artisan --</option>
                {weaverWorkers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.role}) - {w.skill}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Start Date *</label>
              <input
                type="date"
                value={newWOForm.startDate}
                onChange={(e) => setNewWOForm({ ...newWOForm, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Completion Date *</label>
              <input
                type="date"
                value={newWOForm.targetDate}
                onChange={(e) => setNewWOForm({ ...newWOForm, targetDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Materials Required (Warp & Weft Specs)</label>
            <input
              type="text"
              placeholder="e.g. Mulberry Silk 20/22D (3.6 kg), Pure Gold Zari (2.5 cones)"
              value={newWOForm.materialsRequired}
              onChange={(e) => setNewWOForm({ ...newWOForm, materialsRequired: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Special Weaving Instructions</label>
            <textarea
              placeholder="Contrast selvage Korvai interlock, double pallu butta specifications..."
              value={newWOForm.notes}
              onChange={(e) => setNewWOForm({ ...newWOForm, notes: e.target.value })}
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
              className="px-5 py-2 rounded-xl bg-amber-900 text-white font-bold hover:bg-amber-950"
            >
              Issue Work Order
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Progress & Material Consumption Modal */}
      <Modal
        isOpen={activeModal === 'update_progress'}
        onClose={() => setActiveModal(null)}
        title={`Update Progress: ${selectedWO?.workOrderNumber}`}
        subtitle="Record completed units, % completion, and material consumed / wastage"
      >
        <form onSubmit={handleProgressSubmit} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              {errorMessage}
            </div>
          )}

          <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60">
            <p className="font-bold text-slate-900">{selectedWO?.productName}</p>
            <p className="text-slate-600 mt-0.5">
              Target Quantity: <span className="font-bold">{selectedWO?.quantityOrdered} {selectedWO?.unit}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Completed Quantity *</label>
              <input
                type="number"
                min="0"
                max={selectedWO?.quantityOrdered}
                value={progressForm.quantityCompleted}
                onChange={(e) => setProgressForm({ ...progressForm, quantityCompleted: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
              <span className="text-[10px] text-slate-400">Cannot exceed {selectedWO?.quantityOrdered} without approval</span>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Progress Percentage (%) *</label>
              <input
                type="number"
                min="0"
                max="100"
                value={progressForm.progressPercentage}
                onChange={(e) => setProgressForm({ ...progressForm, progressPercentage: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Material Consumed to Date *</label>
              <input
                type="text"
                placeholder="e.g. 2.4 kg Silk, 1.8 cones Zari"
                value={progressForm.materialConsumed}
                onChange={(e) => setProgressForm({ ...progressForm, materialConsumed: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Wastage Recorded *</label>
              <input
                type="text"
                placeholder="e.g. 0.08 kg Silk trim waste"
                value={progressForm.wastageRecorded}
                onChange={(e) => setProgressForm({ ...progressForm, wastageRecorded: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Production Log Notes</label>
            <textarea
              placeholder="Shuttle tension tuned, completed pallu zari motifs..."
              value={progressForm.notes}
              onChange={(e) => setProgressForm({ ...progressForm, notes: e.target.value })}
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
              className="px-5 py-2 rounded-xl bg-amber-900 text-white font-bold hover:bg-amber-950"
            >
              Update Progress
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
