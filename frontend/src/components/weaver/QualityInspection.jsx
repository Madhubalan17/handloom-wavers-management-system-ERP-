import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  ClipboardCheck,
} from 'lucide-react';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import confetti from 'canvas-confetti';

export const QualityInspection = () => {
  const {
    weaverInspections,
    weaverWorkOrders,
    performQualityInspection,
    currentWeaverProfile,
    setActiveNav,
  } = useApp();

  const [activeModal, setActiveModal] = useState(false);
  const [selectedWOId, setSelectedWOId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Submitted work orders ready for QA
  const readyForQAOrders = weaverWorkOrders.filter(w => w.status === 'submitted' || w.status === 'rework');

  // QA Inspection Form State
  const [inspectionForm, setInspectionForm] = useState({
    inspectorName: currentWeaverProfile.ownerName || 'Master Inspector',
    quantityInspected: '',
    quantityAccepted: '',
    quantityReworked: '0',
    quantityRejected: '0',
    checklist: {
      weaveUniformity: true,
      zariBorderAlignment: true,
      colourFastness: true,
      dimensionTolerance: true,
      defectFreeSelvage: true,
    },
    rejectionReason: '',
    reworkInstructions: '',
    notes: '',
    wholesalePrice: '18500',
    retailPrice: '24000',
  });

  const handleSelectWO = (woId) => {
    setSelectedWOId(woId);
    const wo = weaverWorkOrders.find(w => w.id === woId);
    if (wo) {
      setInspectionForm({
        ...inspectionForm,
        quantityInspected: wo.quantityCompleted || wo.quantityOrdered,
        quantityAccepted: wo.quantityCompleted || wo.quantityOrdered,
        quantityReworked: '0',
        quantityRejected: '0',
      });
    }
  };

  const handleInspectSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedWOId) {
      setErrorMessage('Please select a work order to inspect.');
      return;
    }

    const inspected = parseInt(inspectionForm.quantityInspected, 10);
    const accepted = parseInt(inspectionForm.quantityAccepted, 10);
    const reworked = parseInt(inspectionForm.quantityReworked || 0, 10);
    const rejected = parseInt(inspectionForm.quantityRejected || 0, 10);

    if (accepted + reworked + rejected !== inspected) {
      setErrorMessage(`Total of accepted (${accepted}) + rework (${reworked}) + rejected (${rejected}) must equal inspected count (${inspected}).`);
      return;
    }

    const res = performQualityInspection({
      workOrderId: selectedWOId,
      inspectorName: inspectionForm.inspectorName,
      quantityInspected: inspected,
      quantityAccepted: accepted,
      quantityRejected: rejected,
      quantityReworked: reworked,
      checklist: inspectionForm.checklist,
      rejectionReason: inspectionForm.rejectionReason,
      reworkInstructions: inspectionForm.reworkInstructions,
      notes: inspectionForm.notes,
      productDetails: {
        wholesalePrice: parseFloat(inspectionForm.wholesalePrice || 16000),
        retailPrice: parseFloat(inspectionForm.retailPrice || 22000),
      },
    });

    if (!res.success) {
      setErrorMessage(res.error);
    } else {
      if (accepted > 0) {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
      setSuccessMessage(`${accepted} pieces passed quality audit and added to Finished Goods Stock!`);
      setActiveModal(false);
      setSelectedWOId('');
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            Quality Management & Inspection
          </h1>
          <p className="text-xs text-slate-500">
            Strict artisan QA gatekeeping: only approved pieces move to Finished Stock; defects routed for rework
          </p>
        </div>

        <button
          onClick={() => {
            setActiveModal(true);
            setErrorMessage('');
            if (readyForQAOrders.length > 0) {
              handleSelectWO(readyForQAOrders[0].id);
            }
          }}
          className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <ClipboardCheck className="w-4 h-4 text-amber-300" />
          <span>New Inspection Audit</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setActiveNav('finished_stock')}
            className="text-emerald-900 font-bold hover:underline flex items-center gap-1"
          >
            <span>View Finished Stock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Orders awaiting QA banner */}
      {readyForQAOrders.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-blue-950">
                {readyForQAOrders.length} Work Order{readyForQAOrders.length > 1 ? 's' : ''} Ready for Inspection
              </h3>
              <p className="text-xs text-blue-800/80 mt-0.5">
                Weavers have submitted completed woven pieces from the looms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {readyForQAOrders.map((wo) => (
              <button
                key={wo.id}
                onClick={() => {
                  handleSelectWO(wo.id);
                  setActiveModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-white text-blue-900 border border-blue-200 hover:border-blue-400 font-bold text-xs shadow-2xs transition-colors"
              >
                Inspect {wo.workOrderNumber}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inspection History Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 font-serif">
            Quality Inspection Records & Audit Trail
          </h2>
          <span className="text-xs text-slate-500">
            Total Inspected: {weaverInspections.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weaverInspections.map((qa) => {
            const isPassed = qa.status === 'passed';
            const isRework = qa.status === 'rework';
            return (
              <div
                key={qa.id}
                className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/30 hover:bg-white hover:border-amber-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-900">
                      {qa.inspectionNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {qa.productName}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Linked WO: <span className="font-mono">{qa.workOrderNumber}</span> • {formatDate(qa.inspectionDate)}
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${getStatusBadgeClass(qa.status)}`}>
                    {qa.status}
                  </span>
                </div>

                {/* Score and Counts */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="font-extrabold text-emerald-800 text-sm">
                      {qa.quantityAccepted}
                    </span>
                    <p className="text-[10px] text-emerald-700 font-semibold uppercase">Accepted</p>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-100">
                    <span className="font-extrabold text-amber-800 text-sm">
                      {qa.quantityReworked}
                    </span>
                    <p className="text-[10px] text-amber-700 font-semibold uppercase">Rework</p>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                    <span className="font-extrabold text-rose-800 text-sm">
                      {qa.quantityRejected}
                    </span>
                    <p className="text-[10px] text-rose-700 font-semibold uppercase">Rejected</p>
                  </div>
                </div>

                {/* Checklist glance */}
                <div className="p-2.5 rounded-xl bg-slate-100/70 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Weave Uniformity:</span>
                    <span className="font-bold text-emerald-700">✓ Passed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Selvage & Zari Borders:</span>
                    <span className={`font-bold ${qa.checklist?.zariBorderAlignment ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {qa.checklist?.zariBorderAlignment ? '✓ Passed' : '⚠️ Minor Flaw'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Colour Fastness & Dimensions:</span>
                    <span className="font-bold text-emerald-700">✓ Within Standard</span>
                  </div>
                </div>

                {isRework && qa.reworkInstructions && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
                    <span className="font-bold block">Rework Instructions:</span>
                    <span>{qa.reworkInstructions}</span>
                  </div>
                )}

                <div className="pt-2 border-t flex justify-between items-center text-[11px] text-slate-500">
                  <span>Inspector: {qa.inspectorName}</span>
                  <span className="font-semibold text-slate-700">{qa.resultAction}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Quality Inspection Modal */}
      <Modal
        isOpen={activeModal}
        onClose={() => setActiveModal(false)}
        title="Execute Quality Inspection Audit"
        subtitle="Mandatory 5-point criteria checklist before moving pieces into Finished Goods Stock"
      >
        <form onSubmit={handleInspectSubmit} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Work Order to Inspect *</label>
            <select
              value={selectedWOId}
              onChange={(e) => handleSelectWO(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
              required
            >
              <option value="">-- Choose Submitted Work Order --</option>
              {weaverWorkOrders.map((wo) => (
                <option key={wo.id} value={wo.id}>
                  {wo.workOrderNumber} - {wo.productName} ({wo.quantityCompleted || wo.quantityOrdered} {wo.unit}) [{wo.status}]
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Inspector Name *</label>
              <input
                type="text"
                value={inspectionForm.inspectorName}
                onChange={(e) => setInspectionForm({ ...inspectionForm, inspectorName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Quantity Inspected *</label>
              <input
                type="number"
                min="1"
                value={inspectionForm.quantityInspected}
                onChange={(e) => setInspectionForm({ ...inspectionForm, quantityInspected: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          {/* 5-Point Quality Checklist (Section 7.7) */}
          <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
            <span className="font-bold text-slate-900 block">5-Point Handloom Quality Checklist</span>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inspectionForm.checklist.weaveUniformity}
                  onChange={(e) => setInspectionForm({
                    ...inspectionForm,
                    checklist: { ...inspectionForm.checklist, weaveUniformity: e.target.checked }
                  })}
                  className="rounded text-amber-900 focus:ring-amber-900"
                />
                <span className="text-slate-800">1. Weave uniformity & density (no loose floats, warp skips, or reed dents)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inspectionForm.checklist.zariBorderAlignment}
                  onChange={(e) => setInspectionForm({
                    ...inspectionForm,
                    checklist: { ...inspectionForm.checklist, zariBorderAlignment: e.target.checked }
                  })}
                  className="rounded text-amber-900 focus:ring-amber-900"
                />
                <span className="text-slate-800">2. Zari border alignment & Korvai contrast sharpness</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inspectionForm.checklist.colourFastness}
                  onChange={(e) => setInspectionForm({
                    ...inspectionForm,
                    checklist: { ...inspectionForm.checklist, colourFastness: e.target.checked }
                  })}
                  className="rounded text-amber-900 focus:ring-amber-900"
                />
                <span className="text-slate-800">3. Natural/vat dye fastness & consistent shade across warp length</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inspectionForm.checklist.dimensionTolerance}
                  onChange={(e) => setInspectionForm({
                    ...inspectionForm,
                    checklist: { ...inspectionForm.checklist, dimensionTolerance: e.target.checked }
                  })}
                  className="rounded text-amber-900 focus:ring-amber-900"
                />
                <span className="text-slate-800">4. Length, width & blouse piece dimension tolerance verified (6.25m ± 5cm)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inspectionForm.checklist.defectFreeSelvage}
                  onChange={(e) => setInspectionForm({
                    ...inspectionForm,
                    checklist: { ...inspectionForm.checklist, defectFreeSelvage: e.target.checked }
                  })}
                  className="rounded text-amber-900 focus:ring-amber-900"
                />
                <span className="text-slate-800">5. Selvage edge finishing & neat fringe knotting</span>
              </label>
            </div>
          </div>

          {/* Allocation of pieces */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-emerald-800 mb-1">Approved Quantity *</label>
              <input
                type="number"
                min="0"
                value={inspectionForm.quantityAccepted}
                onChange={(e) => setInspectionForm({ ...inspectionForm, quantityAccepted: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/50 font-bold"
                required
              />
              <span className="text-[10px] text-slate-400">Moves to Finished Stock</span>
            </div>
            <div>
              <label className="block font-bold text-amber-800 mb-1">Rework Quantity</label>
              <input
                type="number"
                min="0"
                value={inspectionForm.quantityReworked}
                onChange={(e) => setInspectionForm({ ...inspectionForm, quantityReworked: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-amber-50/50 font-bold"
              />
              <span className="text-[10px] text-slate-400">Sent back to weaver</span>
            </div>
            <div>
              <label className="block font-bold text-rose-800 mb-1">Rejected Quantity</label>
              <input
                type="number"
                min="0"
                value={inspectionForm.quantityRejected}
                onChange={(e) => setInspectionForm({ ...inspectionForm, quantityRejected: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-rose-50/50 font-bold"
              />
              <span className="text-[10px] text-slate-400">Scrapped / Damaged</span>
            </div>
          </div>

          {/* Rework instructions if rework > 0 */}
          {parseInt(inspectionForm.quantityReworked || 0, 10) > 0 && (
            <div>
              <label className="block font-bold text-amber-900 mb-1">Rework Instructions *</label>
              <input
                type="text"
                placeholder="Specific instructions for weaver to fix selvage or re-knot fringes..."
                value={inspectionForm.reworkInstructions}
                onChange={(e) => setInspectionForm({ ...inspectionForm, reworkInstructions: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-amber-300"
                required
              />
            </div>
          )}

          {/* Pricing for approved goods */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Wholesale Price (₹) for Stock</label>
              <input
                type="number"
                value={inspectionForm.wholesalePrice}
                onChange={(e) => setInspectionForm({ ...inspectionForm, wholesalePrice: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Retail Price (₹) for Stock</label>
              <input
                type="number"
                value={inspectionForm.retailPrice}
                onChange={(e) => setInspectionForm({ ...inspectionForm, retailPrice: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
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
              className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 shadow-md"
            >
              Confirm & Post to Stock
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
