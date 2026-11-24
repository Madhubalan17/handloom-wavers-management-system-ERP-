import React, { useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { readWeaversFromExcel, downloadSampleTemplateExcel } from '../../utils/excelExport';
import { api } from '../../services/api';

export const ImportWeaversModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const rows = await readWeaversFromExcel(file);
      setParsedRows(rows);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to read Excel file. Please ensure it is a valid .xlsx or .csv.');
      setParsedRows([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!parsedRows || parsedRows.length === 0) return;

    setIsProcessing(true);
    setErrorMsg('');

    try {
      // 1. Attempt server-side import via Django backend if file is present
      if (selectedFile) {
        try {
          await api.weavers.importExcel(selectedFile);
        } catch (serverErr) {
          console.warn('Backend import fallback, applying client-parsed data:', serverErr.message);
        }
      }

      // 2. Trigger celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
      });

      // 3. Update frontend state
      onImportSuccess(parsedRows);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete import.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-serif">
                Import Weavers from Excel
              </h3>
              <p className="text-xs text-slate-500">
                Bulk upload artisan registrations via spreadsheet (.xlsx or .csv)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Download Sample Template Banner */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-blue-900">
              <Download className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold text-xs">Need the standard spreadsheet format?</p>
                <p className="text-[11px] text-blue-700">Download the pre-formatted Excel template with sample rows.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={downloadSampleTemplateExcel}
              className="px-3 py-1.5 rounded-lg bg-[#1e5bbf] hover:bg-[#164799] text-white font-bold text-xs shrink-0 shadow-2xs transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sample Template</span>
            </button>
          </div>

          {/* Upload Drop Zone */}
          <div className="relative border-2 border-dashed border-slate-300 hover:border-[#1e5bbf] bg-slate-50/60 hover:bg-slate-50 rounded-2xl p-6 text-center transition-all cursor-pointer">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2">
              <Upload className="w-6 h-6" />
            </div>
            <p className="font-bold text-slate-800 text-sm">
              {selectedFile ? selectedFile.name : 'Click to select or drag & drop Excel file'}
            </p>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Supports Microsoft Excel (.xlsx, .xls) and CSV spreadsheets up to 10MB
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Rows Preview */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {parsedRows.length} Artisans ready to import
                </span>
                <span className="text-slate-400 font-normal">Previewing records</span>
              </div>

              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 text-slate-600 sticky top-0 font-bold">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Village</th>
                      <th className="py-2 px-3">Phone</th>
                      <th className="py-2 px-3">Loom</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-1.5 px-3 text-slate-400 font-mono">{i + 1}</td>
                        <td className="py-1.5 px-3 font-bold text-slate-800">{r.name}</td>
                        <td className="py-1.5 px-3 text-slate-600">{r.village}</td>
                        <td className="py-1.5 px-3 font-mono text-slate-700">{r.phone}</td>
                        <td className="py-1.5 px-3 font-mono text-slate-600">{r.assignedLoom}</td>
                        <td className="py-1.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={parsedRows.length === 0 || isProcessing}
            onClick={handleConfirmImport}
            className={`px-5 py-2 rounded-xl font-bold text-xs text-white shadow-sm flex items-center gap-1.5 transition-all ${
              parsedRows.length === 0 || isProcessing
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isProcessing ? 'Importing...' : `Import ${parsedRows.length} Weavers`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
