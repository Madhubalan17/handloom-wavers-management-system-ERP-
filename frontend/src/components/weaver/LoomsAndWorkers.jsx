import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Users,
  Plus,
  Wrench,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  Phone,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import { Modal } from '../common/Modal';

export const LoomsAndWorkers = () => {
  const {
    weaverLooms,
    weaverWorkers,
    addLoom,
    updateLoomStatus,
    addWorker,
  } = useApp();

  const [activeTab, setActiveTab] = useState('looms'); // 'looms' | 'workers'
  const [activeModal, setActiveModal] = useState(null); // 'add_loom' | 'add_worker' | 'repair_loom' | null
  const [selectedLoom, setSelectedLoom] = useState(null);
  const [repairNotes, setRepairNotes] = useState('');

  // Form states
  const [loomForm, setLoomForm] = useState({
    loomNumber: '',
    type: 'Traditional Pit Loom with Jacquard',
    location: 'Main Weaving Shed',
    status: 'idle',
  });

  const [workerForm, setWorkerForm] = useState({
    name: '',
    role: 'Loom Weaver',
    contactNumber: '',
    skill: '',
    wageType: 'per_piece',
    wageRate: '',
    currentLoomId: '',
  });

  const handleAddLoomSubmit = (e) => {
    e.preventDefault();
    addLoom(loomForm);
    setActiveModal(null);
    setLoomForm({
      loomNumber: '',
      type: 'Traditional Pit Loom with Jacquard',
      location: 'Main Weaving Shed',
      status: 'idle',
    });
  };

  const handleAddWorkerSubmit = (e) => {
    e.preventDefault();
    addWorker(workerForm);
    setActiveModal(null);
    setWorkerForm({
      name: '',
      role: 'Loom Weaver',
      contactNumber: '',
      skill: '',
      wageType: 'per_piece',
      wageRate: '',
      currentLoomId: '',
    });
  };

  const handleRepairSubmit = (e) => {
    e.preventDefault();
    if (selectedLoom) {
      updateLoomStatus(selectedLoom.id, 'under_repair', repairNotes);
      setActiveModal(null);
      setSelectedLoom(null);
      setRepairNotes('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            Loom & Worker Management
          </h1>
          <p className="text-xs text-slate-500">
            Monitor pit & frame looms, artisan skills, wage structures, and active workloads
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'looms' ? (
            <button
              onClick={() => setActiveModal('add_loom')}
              className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Add New Loom</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveModal('add_worker')}
              className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Register Artisan</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('looms')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'looms'
              ? 'border-amber-900 text-amber-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Looms Registry ({weaverLooms.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('workers')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'workers'
              ? 'border-amber-900 text-amber-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Artisans & Workers ({weaverWorkers.length})</span>
        </button>
      </div>

      {/* Looms Tab View */}
      {activeTab === 'looms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weaverLooms.map((loom) => {
            const isWorking = loom.status === 'working';
            const isIdle = loom.status === 'idle';
            const isRepair = loom.status === 'under_repair';

            return (
              <div
                key={loom.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-amber-400 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {loom.loomNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5 line-clamp-1">
                      {loom.type}
                    </h3>
                    <p className="text-[11px] text-slate-500">{loom.location}</p>
                  </div>

                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${getStatusBadgeClass(loom.status)}`}>
                    {loom.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Assigned Weaver:</span>
                    <span className="font-semibold text-slate-900">{loom.assignedWorkerName || 'None'}</span>
                  </div>
                  {loom.currentProduct && (
                    <div className="flex justify-between text-slate-600">
                      <span>Current Order:</span>
                      <span className="font-bold text-amber-950 line-clamp-1 max-w-[150px] text-right">
                        {loom.currentProduct}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Efficiency Rating:</span>
                    <span className="font-bold text-emerald-700">{loom.efficiencyScore}%</span>
                  </div>
                </div>

                {isRepair && loom.repairNotes && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 flex items-start gap-2">
                    <Wrench className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{loom.repairNotes}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  {isWorking && (
                    <button
                      onClick={() => updateLoomStatus(loom.id, 'idle')}
                      className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                    >
                      <PauseCircle className="w-3.5 h-3.5" /> Mark Idle
                    </button>
                  )}
                  {isIdle && (
                    <button
                      onClick={() => updateLoomStatus(loom.id, 'working')}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Start Production
                    </button>
                  )}
                  {isRepair ? (
                    <button
                      onClick={() => updateLoomStatus(loom.id, 'idle')}
                      className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Repairs Completed
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedLoom(loom);
                        setActiveModal('repair_loom');
                      }}
                      className="text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 ml-auto"
                    >
                      <Wrench className="w-3.5 h-3.5" /> Log Repair
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Workers Tab View */}
      {activeTab === 'workers' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b">
                <tr>
                  <th className="px-5 py-3.5">Artisan Name & Role</th>
                  <th className="px-4 py-3.5">Specialized Weaving Skill</th>
                  <th className="px-4 py-3.5">Contact Number</th>
                  <th className="px-4 py-3.5">Wage Model</th>
                  <th className="px-4 py-3.5">Rate</th>
                  <th className="px-4 py-3.5">Assigned Loom</th>
                  <th className="px-4 py-3.5">Workload (This Month)</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {weaverWorkers.map((wrk) => {
                  return (
                    <tr key={wrk.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{wrk.name}</div>
                        <div className="text-[11px] text-slate-500">{wrk.role}</div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 font-medium">
                        {wrk.skill}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-600">
                        {wrk.contactNumber}
                      </td>
                      <td className="px-4 py-3.5 font-semibold capitalize text-amber-950">
                        {wrk.wageType.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        {formatCurrency(wrk.wageRate)} / {wrk.wageType === 'per_piece' ? 'saree' : wrk.wageType === 'per_meter' ? 'meter' : wrk.wageType === 'daily' ? 'day' : 'month'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                          {wrk.currentLoomId ? weaverLooms.find(l => l.id === wrk.currentLoomId)?.loomNumber || 'Loom' : 'Preparatory / Dye'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-800">
                        {wrk.workloadPiecesThisMonth} units
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Loom Modal */}
      <Modal
        isOpen={activeModal === 'add_loom'}
        onClose={() => setActiveModal(null)}
        title="Register New Handloom"
        subtitle="Add traditional pit loom, frame loom, or jacquard shed to workspace"
      >
        <form onSubmit={handleAddLoomSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Loom Number / Tag *</label>
            <input
              type="text"
              placeholder="e.g. LM-KPM-06"
              value={loomForm.loomNumber}
              onChange={(e) => setLoomForm({ ...loomForm, loomNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Loom Type *</label>
            <select
              value={loomForm.type}
              onChange={(e) => setLoomForm({ ...loomForm, type: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
              required
            >
              <option value="Traditional Jacquard Pit Loom (800 Hooks)">Traditional Jacquard Pit Loom (800 Hooks)</option>
              <option value="Double-Box Pit Loom with Korvai Attachment">Double-Box Pit Loom with Korvai Attachment</option>
              <option value="Heavy Dobby Frame Loom">Heavy Dobby Frame Loom</option>
              <option value="Traditional Fly-Shuttle Pit Loom">Traditional Fly-Shuttle Pit Loom</option>
              <option value="Raised Frame Loom for Fine Cottons">Raised Frame Loom for Fine Cottons</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Shed Location</label>
            <input
              type="text"
              placeholder="e.g. Main Shed Bay 4 or South Workshop"
              value={loomForm.location}
              onChange={(e) => setLoomForm({ ...loomForm, location: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
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
              Register Loom
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Worker Modal */}
      <Modal
        isOpen={activeModal === 'add_worker'}
        onClose={() => setActiveModal(null)}
        title="Register Handloom Artisan"
        subtitle="Onboard master weaver, bobbin winder, or inlay artisan with wage rules"
      >
        <form onSubmit={handleAddWorkerSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Artisan Full Name *</label>
              <input
                type="text"
                placeholder="e.g. R. Palanivel"
                value={workerForm.name}
                onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Role / Designation *</label>
              <select
                value={workerForm.role}
                onChange={(e) => setWorkerForm({ ...workerForm, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              >
                <option value="Master Weaver">Master Weaver</option>
                <option value="Senior Loom Weaver">Senior Loom Weaver</option>
                <option value="Warping & Bobbin Preparatory Craftsman">Warping & Bobbin Preparatory Craftsman</option>
                <option value="Zari Inlay & Shawl Weaver">Zari Inlay & Shawl Weaver</option>
                <option value="Master Dyer & Yarn Finisher">Master Dyer & Yarn Finisher</option>
                <option value="Apprentice Weaver">Apprentice Weaver</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone *</label>
              <input
                type="text"
                placeholder="+91 94432 XXXXX"
                value={workerForm.contactNumber}
                onChange={(e) => setWorkerForm({ ...workerForm, contactNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Specialized Skill</label>
              <input
                type="text"
                placeholder="e.g. Pure Korvai Borders, Zari Buttas"
                value={workerForm.skill}
                onChange={(e) => setWorkerForm({ ...workerForm, skill: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Wage Calculation Type *</label>
              <select
                value={workerForm.wageType}
                onChange={(e) => setWorkerForm({ ...workerForm, wageType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              >
                <option value="per_piece">Per Piece (₹ / Saree or Shawl)</option>
                <option value="per_meter">Per Meter (₹ / Woven Meter)</option>
                <option value="daily">Daily Wage (₹ / Day)</option>
                <option value="monthly">Monthly Salary (₹ / Month)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Wage Rate (₹) *</label>
              <input
                type="number"
                placeholder="e.g. 2800 or 650"
                value={workerForm.wageRate}
                onChange={(e) => setWorkerForm({ ...workerForm, wageRate: e.target.value })}
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
              Save Artisan
            </button>
          </div>
        </form>
      </Modal>

      {/* Loom Repair Modal */}
      <Modal
        isOpen={activeModal === 'repair_loom'}
        onClose={() => setActiveModal(null)}
        title={`Log Repair for ${selectedLoom?.loomNumber}`}
        subtitle="Mark loom under maintenance and record technician service needs"
      >
        <form onSubmit={handleRepairSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Repair Issue / Maintenance Notes *</label>
            <textarea
              placeholder="Describe damaged cords, harness alignment, reed spacing or shuttle box issue..."
              value={repairNotes}
              onChange={(e) => setRepairNotes(e.target.value)}
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
              Mark Under Repair
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
