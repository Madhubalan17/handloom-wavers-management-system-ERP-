import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Receipt,
  Plus,
  Printer,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building2,
  QrCode,
  ArrowRight,
  Search,
  Eye,
  Trash2,
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import confetti from 'canvas-confetti';

export const SalesBilling = () => {
  const {
    weaverSales,
    weaverFinishedGoods,
    currentWeaverProfile,
    createSale,
  } = useApp();

  const [activeModal, setActiveModal] = useState(null); // 'create_sale' | 'view_invoice' | null
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // New Sale Form
  const [saleForm, setSaleForm] = useState({
    buyerName: '',
    buyerType: 'Wholesale Shop',
    buyerPhone: '',
    buyerAddress: '',
    buyerGst: '',
    discount: '0',
    amountPaid: '0',
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  });

  // Dynamic Line Items
  const [lineItems, setLineItems] = useState([
    { sku: '', quantity: 1, unitPrice: 0, gstRate: 5 },
  ]);

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { sku: '', quantity: 1, unitPrice: 0, gstRate: 5 }]);
  };

  const handleRemoveLineItem = (index) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, idx) => idx !== index));
    }
  };

  const handleLineItemChange = (index, field, value) => {
    const updated = [...lineItems];
    if (field === 'sku') {
      const fg = weaverFinishedGoods.find(g => g.sku === value);
      updated[index].sku = value;
      if (fg) {
        updated[index].productName = fg.name;
        updated[index].unitPrice = fg.wholesalePrice;
        updated[index].gstRate = fg.gstPercentage || 5;
      }
    } else {
      updated[index][field] = value;
    }
    setLineItems(updated);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)), 0);
  };

  const calculateGst = () => {
    return lineItems.reduce((sum, item) => {
      const line = parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0);
      return sum + (line * (item.gstRate || 5)) / 100;
    }, 0);
  };

  const calculateGrandTotal = () => {
    const sub = calculateSubtotal();
    const gst = calculateGst();
    const disc = parseFloat(saleForm.discount || 0);
    return Math.max(0, Math.round(sub + gst - disc));
  };

  const handleSaleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validate items
    for (const item of lineItems) {
      if (!item.sku) {
        setErrorMessage('Please select a product for all line items.');
        return;
      }
      if (parseInt(item.quantity || 0) <= 0) {
        setErrorMessage('Quantity must be greater than 0.');
        return;
      }
    }

    const res = createSale({
      buyerName: saleForm.buyerName,
      buyerType: saleForm.buyerType,
      buyerPhone: saleForm.buyerPhone,
      buyerAddress: saleForm.buyerAddress,
      buyerGst: saleForm.buyerGst,
      items: lineItems.map(it => ({
        sku: it.sku,
        productName: it.productName || weaverFinishedGoods.find(g => g.sku === it.sku)?.name,
        quantity: parseInt(it.quantity, 10),
        unitPrice: parseFloat(it.unitPrice),
        gstRate: it.gstRate,
      })),
      discount: parseFloat(saleForm.discount || 0),
      amountPaid: parseFloat(saleForm.amountPaid || 0),
      paymentMode: saleForm.paymentMode,
      dueDate: saleForm.dueDate,
    });

    if (!res.success) {
      setErrorMessage(res.error);
    } else {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
      setSuccessMessage(`Invoice ${res.newSale.invoiceNumber} generated & finished stock deducted!`);
      setActiveModal(null);
      setSelectedInvoice(res.newSale);
      setSaleForm({
        buyerName: '',
        buyerType: 'Wholesale Shop',
        buyerPhone: '',
        buyerAddress: '',
        buyerGst: '',
        discount: '0',
        amountPaid: '0',
        paymentMode: 'Bank Transfer (NEFT/RTGS)',
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      });
      setLineItems([{ sku: '', quantity: 1, unitPrice: 0, gstRate: 5 }]);
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
            Sales & GST Invoicing
          </h1>
          <p className="text-xs text-slate-500">
            Issue official tax invoices, deduct finished goods stock, and monitor outstanding payment dues
          </p>
        </div>

        <button
          onClick={() => {
            setActiveModal('create_sale');
            setErrorMessage('');
          }}
          className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>New Sale / Generate Invoice</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          {selectedInvoice && (
            <button
              onClick={() => setActiveModal('view_invoice')}
              className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800"
            >
              View Printable Invoice
            </button>
          )}
        </div>
      )}

      {/* Invoices Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b">
              <tr>
                <th className="px-5 py-3.5">Invoice #</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Buyer Details</th>
                <th className="px-4 py-3.5">Buyer Type</th>
                <th className="px-4 py-3.5">Items Sold</th>
                <th className="px-4 py-3.5">Grand Total</th>
                <th className="px-4 py-3.5">Payment Status</th>
                <th className="px-4 py-3.5">Due Date & Balance</th>
                <th className="px-5 py-3.5 text-right">Invoice Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {weaverSales.map((sale) => {
                const totalItemsCount = sale.items?.reduce((s, it) => s + it.quantity, 0) || 0;
                return (
                  <tr key={sale.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-amber-950 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {sale.invoiceNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono">
                      {formatDate(sale.date)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{sale.buyerName}</div>
                      <div className="text-[11px] text-slate-500">{sale.buyerPhone}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {sale.buyerType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 font-medium">
                      {totalItemsCount} pieces ({sale.items?.length} items)
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-slate-900 text-sm font-serif">
                      {formatCurrency(sale.grandTotal)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${getStatusBadgeClass(sale.paymentStatus)}`}>
                        {sale.paymentStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {sale.balanceDue > 0 ? (
                        <div>
                          <span className="font-bold text-rose-600 block">
                            Due: {formatCurrency(sale.balanceDue)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            By {formatDate(sale.dueDate)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-emerald-700 font-semibold text-[11px]">Fully Paid</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedInvoice(sale);
                          setActiveModal('view_invoice');
                        }}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-amber-900 hover:bg-amber-50 transition-colors inline-flex items-center gap-1 font-bold text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-700" />
                        <span>View / Print</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Sale Modal */}
      <Modal
        isOpen={activeModal === 'create_sale'}
        onClose={() => setActiveModal(null)}
        title="Record New Sale & Generate Tax Invoice"
        subtitle="Deducts stock automatically from verified finished goods inventory"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSaleSubmit} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              {errorMessage}
            </div>
          )}

          {/* Buyer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Buyer / Shop Name *</label>
              <input
                type="text"
                placeholder="e.g. Sundari Silks Boutique"
                value={saleForm.buyerName}
                onChange={(e) => setSaleForm({ ...saleForm, buyerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Buyer Type *</label>
              <select
                value={saleForm.buyerType}
                onChange={(e) => setSaleForm({ ...saleForm, buyerType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              >
                <option value="Wholesale Shop">Wholesale Shop</option>
                <option value="Co-op Society">Co-operative Showroom</option>
                <option value="Boutique Agent">Boutique Agent</option>
                <option value="Direct Customer">Direct Customer</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone *</label>
              <input
                type="text"
                placeholder="+91 98401 XXXXX"
                value={saleForm.buyerPhone}
                onChange={(e) => setSaleForm({ ...saleForm, buyerPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Buyer Address / City</label>
              <input
                type="text"
                placeholder="e.g. T. Nagar, Chennai"
                value={saleForm.buyerAddress}
                onChange={(e) => setSaleForm({ ...saleForm, buyerAddress: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Buyer GSTIN (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 33AAECS4491J1ZB"
                value={saleForm.buyerGst}
                onChange={(e) => setSaleForm({ ...saleForm, buyerGst: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Dynamic Line Items Section */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Sale Line Items (from Finished Stock)</span>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="text-amber-800 hover:text-amber-950 font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Item
              </button>
            </div>

            <div className="space-y-2">
              {lineItems.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center p-3 rounded-2xl bg-slate-50 border border-slate-200"
                >
                  <div className="col-span-5">
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Product (SKU / Stock)</label>
                    <select
                      value={item.sku}
                      onChange={(e) => handleLineItemChange(idx, 'sku', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white"
                      required
                    >
                      <option value="">-- Choose Finished Product --</option>
                      {weaverFinishedGoods.map((fg) => (
                        <option key={fg.id} value={fg.sku}>
                          {fg.name} ({fg.sku}) - {fg.stockQuantity} in stock
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleLineItemChange(idx, 'quantity', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-center font-bold"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Price (₹)</label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleLineItemChange(idx, 'unitPrice', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white font-mono"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Line Total</label>
                    <span className="font-bold text-slate-900 block pt-1">
                      {formatCurrency((item.quantity || 0) * (item.unitPrice || 0))}
                    </span>
                  </div>

                  <div className="col-span-1 text-right pt-4">
                    {lineItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLineItem(idx)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 grid grid-cols-3 gap-3">
            <div>
              <span className="text-slate-500 block text-[11px]">Subtotal:</span>
              <span className="font-bold text-slate-800 text-sm">{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">GST Tax (5%):</span>
              <span className="font-bold text-slate-800 text-sm">{formatCurrency(calculateGst())}</span>
            </div>
            <div>
              <span className="text-amber-900 block text-[11px] font-bold">Estimated Grand Total:</span>
              <span className="font-extrabold text-amber-950 text-base font-serif">{formatCurrency(calculateGrandTotal())}</span>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Discount (₹)</label>
              <input
                type="number"
                value={saleForm.discount}
                onChange={(e) => setSaleForm({ ...saleForm, discount: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Amount Paid Now (₹)</label>
              <input
                type="number"
                value={saleForm.amountPaid}
                onChange={(e) => setSaleForm({ ...saleForm, amountPaid: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Payment Due Date</label>
              <input
                type="date"
                value={saleForm.dueDate}
                onChange={(e) => setSaleForm({ ...saleForm, dueDate: e.target.value })}
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
              className="px-5 py-2 rounded-xl bg-amber-900 text-white font-bold hover:bg-amber-950 shadow-md"
            >
              Confirm Sale & Generate Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable GST Invoice Modal */}
      <Modal
        isOpen={activeModal === 'view_invoice' && selectedInvoice !== null}
        onClose={() => setActiveModal(null)}
        title={`Tax Invoice: ${selectedInvoice?.invoiceNumber}`}
        subtitle="Official Handloom Weaver GST Tax Invoice (Print-ready)"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6">
          <div className="flex justify-end no-print">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-amber-950 shadow-md"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Print Invoice / Save PDF</span>
            </button>
          </div>

          {/* Printable Invoice Container */}
          <div id="printable-invoice" className="p-8 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-6 text-xs text-slate-800">
            {/* Invoice Top Header */}
            <div className="flex justify-between items-start border-b-2 border-amber-900 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-amber-950 font-serif">
                    {currentWeaverProfile?.businessName}
                  </span>
                </div>
                <p className="text-slate-600">
                  {currentWeaverProfile?.address}, {currentWeaverProfile?.district}, {currentWeaverProfile?.state} - {currentWeaverProfile?.pincode}
                </p>
                <p className="text-slate-600 font-mono">
                  Phone: {currentWeaverProfile?.contactNumber} • Email: {currentWeaverProfile?.email}
                </p>
                <p className="text-amber-900 font-semibold">
                  Co-op Reg #: {currentWeaverProfile?.coopRegNo} • GI Tag Registered Unit
                </p>
              </div>

              <div className="text-right space-y-1">
                <span className="px-3 py-1 bg-amber-900 text-white font-bold text-sm tracking-wider uppercase rounded-md inline-block">
                  GST TAX INVOICE
                </span>
                <p className="font-mono font-bold text-sm text-slate-900 mt-2">
                  Invoice #: {selectedInvoice?.invoiceNumber}
                </p>
                <p className="text-slate-500">Date: {formatDate(selectedInvoice?.date)}</p>
                <p className="text-slate-500">Due Date: {formatDate(selectedInvoice?.dueDate)}</p>
              </div>
            </div>

            {/* Bill To & Weaver Bank Info */}
            <div className="grid grid-cols-2 gap-6 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60">
              <div>
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                  Billed To (Buyer):
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{selectedInvoice?.buyerName}</h4>
                <p className="text-slate-600">{selectedInvoice?.buyerAddress}</p>
                <p className="text-slate-600">Phone: {selectedInvoice?.buyerPhone}</p>
                {selectedInvoice?.buyerGst && (
                  <p className="font-mono font-semibold text-slate-700">GSTIN: {selectedInvoice?.buyerGst}</p>
                )}
              </div>

              <div>
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                  Payment Remittance Details:
                </span>
                <p className="font-semibold text-slate-800">{currentWeaverProfile?.bankDetails?.bankName}</p>
                <p className="font-mono text-slate-600">
                  A/C: {currentWeaverProfile?.bankDetails?.accountNumber} ({currentWeaverProfile?.bankDetails?.ifscCode})
                </p>
                <p className="font-mono text-amber-900 font-bold mt-1">
                  UPI ID: {currentWeaverProfile?.bankDetails?.upiId}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Product Description & SKU</th>
                  <th className="py-2.5 px-3 text-center">HSN Code</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                  <th className="py-2.5 px-3 text-right">GST %</th>
                  <th className="py-2.5 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedInvoice?.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-900 block">{item.productName}</span>
                      <span className="font-mono text-[10px] text-slate-500">{item.sku}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500">5007 / 5208</td>
                    <td className="py-2.5 px-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-2.5 px-3 text-right">{item.gstRate || 5}%</td>
                    <td className="py-2.5 px-3 text-right font-bold">{formatCurrency(item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Section */}
            <div className="flex justify-end pt-2">
              <div className="w-72 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatCurrency(selectedInvoice?.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST Amount (5%):</span>
                  <span className="font-mono">{formatCurrency(selectedInvoice?.gstAmount)}</span>
                </div>
                {selectedInvoice?.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span className="font-mono">-{formatCurrency(selectedInvoice?.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t-2 border-slate-900 font-serif">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(selectedInvoice?.grandTotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600 pt-1">
                  <span>Paid Amount:</span>
                  <span className="font-mono text-emerald-700 font-bold">{formatCurrency(selectedInvoice?.amountPaid)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-900 font-bold pt-1 border-t">
                  <span>Balance Due:</span>
                  <span className="font-mono text-rose-600">{formatCurrency(selectedInvoice?.balanceDue)}</span>
                </div>
              </div>
            </div>

            {/* Declaration & Signatures */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-6">
              <div className="space-y-1 text-[11px] text-slate-500">
                <span className="font-bold text-slate-800 block">Declaration & Certification:</span>
                <p>
                  We certify that the items described in this invoice are genuine handloom products woven by certified master artisans with legitimate GI tags and Handloom Mark adherence.
                </p>
              </div>

              <div className="text-right space-y-8">
                <span className="text-[11px] text-slate-500 block">For {currentWeaverProfile?.businessName}</span>
                <span className="font-bold text-slate-900 block border-t border-slate-300 pt-1 w-48 ml-auto">
                  Authorized Signatory / Weaver Head
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
