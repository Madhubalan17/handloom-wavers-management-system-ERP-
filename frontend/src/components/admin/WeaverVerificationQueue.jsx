import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Clock,
  Eye,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import confetti from 'canvas-confetti';

export const WeaverVerificationQueue = () => {
  const {
    weaverProfiles,
    updateWeaverVerification,
    currentRole,
  } = useApp();

  const [selectedWeaver, setSelectedWeaver] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'review' | 'reject' | null
  const [rejectReason, setRejectReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const weaversList = Object.values(weaverProfiles);
  const pendingWeavers = weaversList.filter(w => w.verificationStatus === 'under_review');
  const approvedWeavers = weaversList.filter(w => w.verificationStatus === 'approved');

  const handleApprove = (weaverId) => {
    updateWeaverVerification(weaverId, 'approved', 'Documents and loom capacity verified by district manager.');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setSuccessMessage(`Weaver ${weaverProfiles[weaverId]?.businessName} has been approved and workspace is now ACTIVE!`);
    setActiveModal(null);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (selectedWeaver) {
      updateWeaverVerification(selectedWeaver.id, 'rejected', rejectReason);
      setSuccessMessage(`Weaver onboarding application rejected with feedback.`);
      setActiveModal(null);
      setSelectedWeaver(null);
      setRejectReason('');
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            Weaver Onboarding & Verification Desk
          </h1>
          <p className="text-xs text-slate-500">
            Platform Manager verification gate: examine identity proofs, co-op memberships, and approve private workspaces
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200">
            {pendingWeavers.length} Pending Review
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200">
            {approvedWeavers.length} Active Weavers
          </span>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Pending Verifications Queue */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600" />
          <h2 className="text-base font-bold text-slate-900 font-serif">
            Applications Awaiting Manager Approval
          </h2>
        </div>

        {pendingWeavers.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 text-xs">
            No pending weaver verification applications at this time. All onboarded weavers are active!
          </div>
        ) : (
          <div className="space-y-4">
            {pendingWeavers.map((weaver) => (
              <div
                key={weaver.id}
                className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/20 hover:bg-amber-50/40 transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                        {weaver.id.toUpperCase()}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 font-serif">
                        {weaver.businessName}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Proprietor: <span className="font-semibold text-slate-900">{weaver.ownerName}</span> • Phone: {weaver.contactNumber} • {weaver.district}, {weaver.state}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Co-op Membership: {weaver.coopRegNo} • ID Proof: {weaver.idProofRef} • Capacity: {weaver.monthlyCapacityPieces} pcs/month
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedWeaver(weaver);
                        setActiveModal('review');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-amber-400 text-slate-800 text-xs font-bold shadow-2xs flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Inspect Documents</span>
                    </button>
                    <button
                      onClick={() => handleApprove(weaver.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Weaver</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedWeaver(weaver);
                        setActiveModal('reject');
                      }}
                      className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* Uploaded Verification Documents */}
                {weaver.documents && (
                  <div className="pt-3 border-t border-amber-200/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Attached KYC Verification Files
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {weaver.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-2xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-700" />
                          <span>{doc.name}</span>
                          <span className="text-[10px] text-slate-400">({doc.size})</span>
                          <span className="text-[10px] font-bold text-emerald-700">Verified Hash</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Weavers Directory */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 font-serif">
              Active Verified Handloom Weavers
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            All weavers isolated by tenant key
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b">
              <tr>
                <th className="px-4 py-3">Weaver ID</th>
                <th className="px-4 py-3">Weaving Business Name</th>
                <th className="px-4 py-3">Owner / Contact</th>
                <th className="px-4 py-3">District / Region</th>
                <th className="px-4 py-3">Looms & Artisans</th>
                <th className="px-4 py-3">Monthly Capacity</th>
                <th className="px-4 py-3">GI Certification</th>
                <th className="px-4 py-3">Approved By</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {approvedWeavers.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono font-bold text-slate-600">{w.id.toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 block">{w.businessName}</span>
                    <span className="text-[10px] text-slate-400">{w.address}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-800 block">{w.ownerName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{w.contactNumber}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">{w.district}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {w.loomCount} Looms • {w.workerCount} Artisans
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800">
                    {w.monthlyCapacityPieces} pcs/mo
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Award className="w-3 h-3 text-emerald-600" />
                      {w.certifications?.[0]?.name || 'Handloom Mark'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-500">
                    {w.approvedBy || 'System Admin'} ({formatDate(w.approvedDate)})
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Documents Modal */}
      <Modal
        isOpen={activeModal === 'review' && selectedWeaver !== null}
        onClose={() => setActiveModal(null)}
        title={`Verification Details: ${selectedWeaver?.businessName}`}
        subtitle="Review onboarding application and compliance credentials"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Business Unit:</span>
              <span className="font-bold text-slate-900">{selectedWeaver?.businessName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Owner / Master Artisan:</span>
              <span className="font-bold text-slate-900">{selectedWeaver?.ownerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">District & Address:</span>
              <span className="font-bold text-slate-900">{selectedWeaver?.address}, {selectedWeaver?.district}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Aadhaar Proof Ref:</span>
              <span className="font-mono font-bold text-slate-900">{selectedWeaver?.idProofRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cooperative Society Registration #:</span>
              <span className="font-mono font-bold text-slate-900">{selectedWeaver?.coopRegNo}</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-slate-900 block mb-2">Uploaded Verification Certificates:</span>
            <div className="space-y-2">
              {selectedWeaver?.documents?.map((doc, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-white shadow-2xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-800" />
                    <div>
                      <p className="font-bold text-slate-900">{doc.name}</p>
                      <p className="text-[10px] text-slate-400">PDF Document • {doc.size}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Digitally Signed
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl border text-slate-600 hover:bg-slate-50"
            >
              Close
            </button>
            <button
              onClick={() => handleApprove(selectedWeaver.id)}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
            >
              Approve & Activate Account
            </button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={activeModal === 'reject' && selectedWeaver !== null}
        onClose={() => setActiveModal(null)}
        title={`Reject Onboarding: ${selectedWeaver?.businessName}`}
        subtitle="Provide constructive feedback for the weaver to resubmit credentials"
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Reason for Rejection *</label>
            <textarea
              placeholder="e.g. Incomplete loom electricity sanction bill, Aadhaar mismatch with co-op membership record..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 h-28"
              required
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
              className="px-5 py-2 rounded-xl bg-rose-700 text-white font-bold hover:bg-rose-800"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
